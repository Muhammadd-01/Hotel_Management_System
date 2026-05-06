// authRoutes.js - yeh file authentication ke routes define karti hai
const express = require('express');
const router = express.Router();
const { login, register, getMe } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');
const { loginRules, registerRules } = require('../middleware/validate');

// POST /api/auth/login - user login karo
router.post('/login', loginRules, login);

// POST /api/auth/register - admin new user create kare (protected + admin only)
router.post('/register', protect, authorize('admin'), registerRules, register);

// GET /api/auth/me - apni profile dekho (protected)
router.get('/me', protect, getMe);

module.exports = router;
