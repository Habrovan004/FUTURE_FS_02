/***************************************
 * Production-Ready CRM API (Express + MongoDB)
 * Single-file version for clarity
 ***************************************/

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;

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
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    source: { type: String, default: 'Direct' },
    status: { type: String, enum: ['new', 'contacted', 'qualified', 'lost'], default: 'new' },
    notes: [
      {
        text: String,
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

const Lead = mongoose.model('Lead', leadSchema);

/************* ROUTES *************/

// GET all leads
app.get('/api/leads', async (req, res, next) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    next(err);
  }
});

// GET single lead
app.get('/api/leads/:id', async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    next(err);
  }
});

// CREATE lead
app.post('/api/leads', async (req, res, next) => {
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
  } catch (err) {
    next(err);
  }
});

// UPDATE lead status
app.put('/api/leads/:id', async (req, res, next) => {
  try {
    const { status } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    res.json(lead);
  } catch (err) {
    next(err);
  }
});

// ADD note
app.post('/api/leads/:id/notes', async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Note text required' });
    }

    const lead = await Lead.findById(req.params.id);

    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    lead.notes.push({ text });
    await lead.save();

    res.json(lead);
  } catch (err) {
    next(err);
  }
});

// DELETE lead
app.delete('/api/leads/:id', async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    res.json({ message: 'Lead deleted successfully' });
  } catch (err) {
    next(err);
  }
});

/************* HEALTH CHECK *************/
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', time: new Date() });
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