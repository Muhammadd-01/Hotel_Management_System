// Feedback.js - yeh model guest feedback aur ratings store karta hai
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  // kis guest ne feedback diya
  guest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guest'
  },
  // guest ka naam (agar guest profile nahi hai)
  guestName: {
    type: String,
    default: ''
  },
  // kis booking ke liye feedback hai
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  // overall rating (1-5 stars)
  rating: {
    type: Number,
    required: [true, 'Rating dena zaroori hai'],
    min: 1,
    max: 5
  },
  // different categories ki rating
  cleanliness: { type: Number, min: 1, max: 5, default: 3 },
  service: { type: Number, min: 1, max: 5, default: 3 },
  comfort: { type: Number, min: 1, max: 5, default: 3 },
  location: { type: Number, min: 1, max: 5, default: 3 },
  // feedback ka comment
  comment: {
    type: String,
    default: ''
  },
  // feedback ka status - reviewed ya nahi
  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Responded'],
    default: 'Pending'
  },
  // admin ka response
  response: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Feedback', feedbackSchema);
