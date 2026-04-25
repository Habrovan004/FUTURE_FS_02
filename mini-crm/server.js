/***************************************
 * Production-Ready CRM API (Express + MongoDB)
 * With JWT Authentication
 ***************************************/

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

/************* MIDDLEWARE *************/
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

/************* DATABASE *************/
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

/************* MODEL *************/
const leadSchema = new mongoose.Schema(
  {
    name:   { type: String, required: true },
    email:  { type: String, required: true, unique: true },
    source: { type: String, default: 'Direct' },
    status: { type: String, enum: ['new', 'contacted', 'converted', 'lost'], default: 'new' },
    notes:  [{ text: String, createdAt: { type: Date, default: Date.now } }],
  },
  { timestamps: true }
);

const Lead = mongoose.model('Lead', leadSchema);

/************* ADMIN CREDENTIALS *************/
const ADMIN = {
  username: 'hagai',
  password: '$2b$10$jwIYZ3qEiqEsLBjKYcTd3uZ7M89Fh8G8SYJ6nJSXibOejsjShc.hS',
};

/************* AUTH MIDDLEWARE *************/
const protect = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, access denied' });
  }
  try {
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};

/************* AUTH ROUTE *************/
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (username !== ADMIN.username) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const match = await bcrypt.compare(password, ADMIN.password);
  if (!match) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '8h' });
  res.json({ token });
});

/************* HEALTH CHECK *************/
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', time: new Date() });
});

/************* LEAD ROUTES (protected) *************/

// GET all leads
app.get('/api/leads', protect, async (req, res, next) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) { next(err); }
});

// GET single lead
app.get('/api/leads/:id', protect, async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (err) { next(err); }
});

// CREATE lead
app.post('/api/leads', protect, async (req, res, next) => {
  try {
    const { name, email, source } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }
    const existing = await Lead.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Lead already exists' });
    }
    const lead = await Lead.create({ name, email, source });
    res.status(201).json(lead);
  } catch (err) { next(err); }
});

// UPDATE lead status
app.put('/api/leads/:id', protect, async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (err) { next(err); }
});

// ADD note
app.post('/api/leads/:id/notes', protect, async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Note text required' });
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    lead.notes.push({ text });
    await lead.save();
    res.json(lead);
  } catch (err) { next(err); }
});

// DELETE lead
app.delete('/api/leads/:id', protect, async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json({ message: 'Lead deleted successfully' });
  } catch (err) { next(err); }
});

/************* ERROR HANDLER *************/
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
});

/************* START SERVER *************/
app.listen(PORT, () => {
  console.log(`🚀 CRM API running on http://localhost:${PORT}`);
});