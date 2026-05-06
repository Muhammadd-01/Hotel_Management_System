// bookingRoutes.js - yeh file booking ke routes define karti hai
const express = require('express');
const router = express.Router();
const { getAllBookings, getBookingById, createBooking, checkoutBooking, cancelBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const { bookingRules } = require('../middleware/validate');

// saare routes protected hain
router.use(protect);

// GET /api/bookings - saari bookings dekho
router.get('/', getAllBookings);

// GET /api/bookings/:id - ek booking dekho
router.get('/:id', getBookingById);

// POST /api/bookings - nayi booking banao
router.post('/', bookingRules, createBooking);

// PUT /api/bookings/:id/checkout - checkout karo
router.put('/:id/checkout', checkoutBooking);

// PUT /api/bookings/:id/cancel - booking cancel karo
router.put('/:id/cancel', cancelBooking);

module.exports = router;
