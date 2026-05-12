// User.js - Database model for all system users (Admins, Staff, and Registered Guests)
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Personal Identification
  name: {
    type: String,
    required: [true, 'User name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email address is required'],
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Password is excluded from default query results for security
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },

  // Role-Based Access Control
  role: {
    type: String,
    enum: ['superadmin', 'manager', 'receptionist', 'housekeeping', 'maintenance', 'staff', 'guest'],
    default: 'guest'
  },

  // Identity Verification (CNIC Details)
  cnicNumber: {
    type: String,
    trim: true
  },
  cnicFrontImage: {
    type: String // Stores Base64 string or image URL
  },
  cnicBackImage: {
    type: String // Stores Base64 string or image URL
  },
  profileImage: {
    type: String // Optional profile picture
  }
}, {
  timestamps: true // Automatically manages createdAt and updatedAt fields
});

// ============ PASSWORD ENCRYPTION MIDDLEWARE ============
// Hash password using bcrypt before saving to database
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ============ PASSWORD VERIFICATION METHOD ============
// Compare entered password with the hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
