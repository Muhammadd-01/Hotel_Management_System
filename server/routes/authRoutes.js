// authRoutes.js - Defines the API endpoints for authentication and user management
const express = require('express');
const router = express.Router();
const { login, register, signup, getMe, updateProfile } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');
const { loginRules, registerRules } = require('../middleware/validate');

// Public access: Authenticate existing users
router.post('/login', loginRules, login);

// Public access: Enroll new guest accounts
router.post('/signup', registerRules, signup);

// Admin only: Register new staff or management accounts
router.post('/register', protect, authorize('superadmin'), registerRules, register);

// Authenticated access: Retrieve current user profile
router.get('/me', protect, getMe);

// Authenticated access: Update personal profile details (CNIC, Address, Images)
router.put('/update-profile', protect, updateProfile);

module.exports = router;
