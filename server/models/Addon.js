// Addon.js - Catalog for extra services that can be added during booking
const mongoose = require('mongoose');

const addonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Food', 'Transport', 'Spa', 'Laundry', 'Other']
  },
  icon: {
    type: String,
    default: '✨'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Addon', addonSchema);
