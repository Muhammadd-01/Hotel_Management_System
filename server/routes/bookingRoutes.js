// bookingRoutes.js - This file defines booking routes
const express = require('express');
const router = express.Router();
const { getAllBookings, getBookingById, getMyBookings, createBooking, checkoutBooking, cancelBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const { bookingRules } = require('../middleware/validate');

// All routes are protected
router.use(protect);

// GET /api/bookings - view all bookings (Admin/Staff)
router.get('/', getAllBookings);

// GET /api/bookings/my-bookings - view current user bookings
router.get('/my-bookings', getMyBookings);

// GET /api/bookings/:id - view a specific booking
router.get('/:id', getBookingById);

// POST /api/bookings - create a new booking
router.post('/', bookingRules, createBooking);

// PUT /api/bookings/:id/checkout - checkout booking
router.put('/:id/checkout', checkoutBooking);

// PUT /api/bookings/:id/cancel - cancel booking
router.put('/:id/cancel', cancelBooking);

module.exports = router;
