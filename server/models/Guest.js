// Guest.js - Guest ki detailed information store karne ke liye database model
const mongoose = require('mongoose');

// Guest schema define karna
const guestSchema = new mongoose.Schema({
  // Guest ka pehla naam
  firstName: {
    type: String,
    required: [true, 'First name zaroori hai'],
    trim: true
  },
  // Guest ka aakhri naam
  lastName: {
    type: String,
    required: [true, 'Last name zaroori hai'],
    trim: true
  },
  // Contact details
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number zaroori hai'],
    trim: true
  },
  // Identification details (ID Card ya Passport)
  idNumber: {
    type: String,
    required: [true, 'ID Number zaroori hai']
  },
  idType: {
    type: String,
    enum: ['CNIC', 'Passport', 'Driving License', 'Other'],
    default: 'CNIC'
  },
  // Address ki maloomat
  address: String,
  city: String,
  country: {
    type: String,
    default: 'Pakistan'
  },
  // Guest status (kya woh VIP hai?)
  isVIP: {
    type: Boolean,
    default: false
  },
  // Guest ki pasand aur napasand (Preferences)
  preferences: {
    roomType: String,
    floorPreference: String,
    specialRequests: String
  },
  // Admin ke liye extra notes
  notes: String
}, {
  // timestamps se "createdAt" aur "updatedAt" khud ban jayenge
  timestamps: true
});

// Model export karna taake controllers mein use ho sake
module.exports = mongoose.model('Guest', guestSchema);
