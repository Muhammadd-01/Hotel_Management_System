// User.js - yeh model users ka data store karta hai (Admin aur Staff)
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User schema define karo - har user ka structure yahan hai
const userSchema = new mongoose.Schema({
  // user ka naam
  name: {
    type: String,
    required: [true, 'Naam dena zaroori hai'],
    trim: true
  },
  // user ka email - unique hona chahiye
  email: {
    type: String,
    required: [true, 'Email dena zaroori hai'],
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  // user ka password - minimum 6 characters
  password: {
    type: String,
    required: [true, 'Password dena zaroori hai'],
    minlength: [6, 'Password kam se kam 6 characters ka hona chahiye'],
    select: false // password default mein query result mein nahi aayega
  },
  // user ka role - admin ya staff
    role: {
    type: String,
    enum: ['admin', 'manager', 'receptionist', 'housekeeping', 'maintenance', 'staff', 'guest'],
    default: 'guest'
  }
}, {
  // timestamps automatically createdAt aur updatedAt add karta hai
  timestamps: true
});

// ============ PASSWORD HASHING MIDDLEWARE ============
// save karne se pehle password hash karo bcrypt se
userSchema.pre('save', async function(next) {
  // agar password modify nahi hua to skip karo
  if (!this.isModified('password')) return next();

  // password ko hash karo 10 salt rounds ke saath
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ============ PASSWORD MATCH METHOD ============
// yeh method check karta hai ke entered password sahi hai ya nahi
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
