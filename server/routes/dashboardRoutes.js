// dashboardRoutes.js - yeh file dashboard stats ke routes define karti hai
const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

// GET /api/dashboard/stats - dashboard stats dekho (protected)
router.get('/stats', protect, getStats);

module.exports = router;
