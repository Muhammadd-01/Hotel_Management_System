// authController.js - yeh controller authentication handle karta hai (login, register, profile)
const User = require('../models/User');
const Guest = require('../models/Guest');
const jwt = require('jsonwebtoken');

// ============ JWT TOKEN GENERATE KARO ============
// yeh function user ki id se JWT token banata hai
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// ============ LOGIN CONTROLLER ============
// POST /api/auth/login - user logs in using email and password
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user by email, include password
    const user = await User.findOne({ email }).select('+password');

    // if user is not found return error
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // match password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // generate token and send response
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login'
    });
  }
};

// ============ REGISTER CONTROLLER ============
// POST /api/auth/register - admin creates a new staff user
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'This email is already registered'
      });
    }

    // create a new user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'staff'
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during registration'
    });
  }
};

// ============ GUEST SIGNUP (PUBLIC) ============
// POST /api/auth/signup - creates a new guest account
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'This email is already registered' });
    }

    // Create guest user in User model (for authentication)
    const user = await User.create({
      name,
      email,
      password,
      role: 'guest'
    });

    // Create entry in Guest model for administrative management
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || 'Guest';

    await Guest.create({
      firstName,
      lastName,
      email,
      phone: 'Not provided',
      idNumber: 'Pending'
    });

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: 'An error occurred during signup' });
  }
};

// ============ GET CURRENT USER ============
// GET /api/auth/me - return the logged in user profile
const getMe = async (req, res) => {
  try {
    // req.user auth middleware ne set kiya hai
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Profile fetch karne mein error aa gaya'
    });
  }
};

module.exports = { login, register, signup, getMe };
