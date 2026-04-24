const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: String,
  email: String,
  source: String,
  status: {
    type: String,
    default: 'new'
  },
  notes: [
    {
      text: String,
      date: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);