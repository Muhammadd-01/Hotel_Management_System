// Notification.js - yeh model system notifications store karta hai
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  // notification ka title
  title: {
    type: String,
    required: true,
    trim: true
  },
  // notification ka message
  message: {
    type: String,
    required: true
  },
  // notification ka type
  type: {
    type: String,
    enum: ['booking', 'checkout', 'maintenance', 'housekeeping', 'service', 'system'],
    default: 'system'
  },
  // kis user ke liye hai (null = sabke liye)
  forUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  // padhi gayi ya nahi
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
