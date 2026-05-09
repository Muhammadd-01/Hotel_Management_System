// authController.js - yeh controller authentication handle karta hai (login, register, profile)
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// ============ JWT TOKEN GENERATE KARO ============
// yeh function user ki id se JWT token banata hai
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// ============ LOGIN CONTROLLER ============
// POST /api/auth/login - user login karta hai email aur password se
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // user ko email se find karo, password bhi include karo (+password)
    const user = await User.findOne({ email }).select('+password');

    // agar user nahi mila to error do
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ya password galat hai'
      });
    }

    // password match karo
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email ya password galat hai'
      });
    }

    // token generate karo aur response bhejo
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
      message: 'Login mein error aa gaya'
    });
  }
};

// ============ REGISTER CONTROLLER ============
// POST /api/auth/register - admin new staff user create karta hai
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // check karo ke email pehle se registered to nahi hai
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Yeh email pehle se registered hai'
      });
    }

    // naya user create karo
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'staff'
    });

    res.status(201).json({
      success: true,
      message: 'User successfully create ho gaya!',
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
      message: 'Registration mein error aa gaya'
    });
  }
};

// ============ GUEST SIGNUP (PUBLIC) ============
// POST /api/auth/signup - naya guest account banata hai
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Yeh email pehle se registered hai' });
    }

    // Create guest user
    const user = await User.create({
      name,
      email,
      password,
      role: 'guest' // Force guest role for public signup
    });

    // Token generate karo taake signup ke baad foran login ho jaye
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account kamyabi se ban gaya!',
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
    res.status(500).json({ success: false, message: 'Signup mein error aa gaya' });
  }
};

// ============ GET CURRENT USER ============
// GET /api/auth/me - logged in user ki profile return karo
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
