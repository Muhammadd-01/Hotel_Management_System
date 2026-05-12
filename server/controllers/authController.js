// authController.js - Handles authentication and profile management for all users
const User = require('../models/User');
const Guest = require('../models/Guest');
const jwt = require('jsonwebtoken');

// ============ JWT TOKEN GENERATOR ============
// Generates a JSON Web Token using the user's unique ID
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// ============ LOGIN CONTROLLER ============
// POST /api/auth/login - authenticates user and issues session token
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Retrieve user and explicitly select password field (excluded by default)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password match using model method
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Authentication successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
};

// ============ STAFF REGISTRATION ============
// POST /api/auth/register - admin utility to create new staff accounts
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email address is already registered'
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'staff'
    });

    res.status(201).json({
      success: true,
      message: 'Personnel account created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration'
    });
  }
};

// ============ GUEST SELF-SIGNUP ============
// POST /api/auth/signup - enables guests to create their own accounts
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email address is already registered' });
    }

    // Create credential account
    const user = await User.create({
      name,
      email,
      password,
      role: 'guest'
    });

    // Create synchronized administrative guest profile
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || 'Guest';

    await Guest.create({
      firstName,
      lastName,
      email,
      phone: 'Pending',
      idNumber: 'Pending Verification'
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Guest account created successfully',
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
    res.status(500).json({ success: false, message: 'Internal server error during signup' });
  }
};

// ============ FETCH CURRENT USER PROFILE ============
// GET /api/auth/me - returns detailed profile of the authenticated user
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        cnicNumber: user.cnicNumber,
        cnicFrontImage: user.cnicFrontImage,
        cnicBackImage: user.cnicBackImage,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile data'
    });
  }
};

// ============ UPDATE USER PROFILE ============
// PUT /api/auth/update-profile - allows users to update their personal details
const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, cnicNumber, cnicFrontImage, cnicBackImage, profileImage, password } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update basic fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (cnicNumber) user.cnicNumber = cnicNumber;
    if (cnicFrontImage) user.cnicFrontImage = cnicFrontImage;
    if (cnicBackImage) user.cnicBackImage = cnicBackImage;
    if (profileImage) user.profileImage = profileImage;

    // Handle password update if provided
    if (password) {
      user.password = password;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        cnicNumber: user.cnicNumber,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('Update Profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile details'
    });
  }
};

module.exports = { login, register, signup, getMe, updateProfile };
