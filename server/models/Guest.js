// Guest.js - Detailed information model for hotel guests (Walk-ins and Registered)
const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  // Personal Identification
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  
  // Contact Channels
  email: {
    type: String,
    lowercase: true,
    trim: true,
    index: true
  },
  phone: {
    type: String,
    trim: true,
    index: true
  },

  // Identity Verification
  idNumber: {
    type: String,
    trim: true
  },
  idType: {
    type: String,
    enum: ['CNIC', 'Passport', 'Driving License', 'Other'],
    default: 'CNIC'
  },
  cnicFrontImage: {
    type: String // Base64 or URL
  },
  cnicBackImage: {
    type: String // Base64 or URL
  },

  // Geography
  address: String,
  city: String,
  country: {
    type: String,
    default: 'Pakistan'
  },

  // Elite Status & Preferences
  isVIP: {
    type: Boolean,
    default: false
  },
  preferences: {
    roomType: String,
    floorPreference: String,
    specialRequests: String
  },

  // Operational Notes
  notes: String
}, {
  timestamps: true // Manages createdAt and updatedAt automatically
});

module.exports = mongoose.model('Guest', guestSchema);
