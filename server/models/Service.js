// Service.js - yeh model additional services ka data store karta hai
// jaise room service, laundry, transport, food
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  // kis booking se related hai yeh service
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: [true, 'Booking select karna zaroori hai']
  },
  // kis guest ke liye hai
  guest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guest'
  },
  // service ka type
  serviceType: {
    type: String,
    required: [true, 'Service type dena zaroori hai'],
    enum: ['Room Service', 'Laundry', 'Food & Dining', 'Transport', 'Wake-up Call', 'Spa', 'Other']
  },
  // service ki description
  description: {
    type: String,
    required: [true, 'Description dena zaroori hai'],
    trim: true
  },
  // service ki price
  amount: {
    type: Number,
    required: [true, 'Amount dena zaroori hai'],
    min: 0
  },
  // service ka status
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  // kis staff member ne handle kiya
  handledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);
