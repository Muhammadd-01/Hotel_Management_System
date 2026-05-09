// bookingController.js - Room bookings handle karne ka dimagh (logic)
const Booking = require('../models/Booking');
const Room = require('../models/Room');

// @desc    Nayi booking create karna
// @route   POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { room, checkIn, checkOut } = req.body;

    // 1. Check karna ke kya room available hai?
    const roomDetails = await Room.findById(room);
    if (!roomDetails) {
      return res.status(404).json({ success: false, message: 'Room nahi mila' });
    }

    if (roomDetails.status !== 'Available') {
      return res.status(400).json({ success: false, message: 'Yeh room pehle se booked hai ya safai ho rahi hai' });
    }

    // 2. Stay ki duration aur total amount calculate karna
    const cin = new Date(checkIn);
    const cout = new Date(checkOut);
    const diffTime = Math.abs(cout - cin);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; // Kam se kam 1 din
    
    const totalAmount = diffDays * roomDetails.price;

    // 3. Database mein nayi booking save karna
    const booking = await Booking.create({
      ...req.body,
      totalAmount,
      createdBy: req.user.id // Kis user ne booking ki? (Staff/Admin)
    });

    // 4. Room ka status "Booked" kar dena taake koi aur book na kar sake
    await Room.findByIdAndUpdate(room, { status: 'Booked' });

    res.status(201).json({
      success: true,
      message: 'Booking kamyabi se ho gayi',
      booking
    });
  } catch (error) {
    console.error('Booking Error:', error);
    res.status(500).json({ success: false, message: 'Booking mein koi error aa gaya' });
  }
};

// @desc    Saari bookings ki list lana
// @route   GET /api/bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('room', 'roomNumber type price')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Bookings lane mein masla hua' });
  }
};

// @desc    Single booking detail
// @route   GET /api/bookings/:id
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('room', 'roomNumber type price description')
      .populate('createdBy', 'name email');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking nahi mili' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Booking detail lane mein masla hua' });
  }
};

// @desc    Checkout process
// @route   PUT /api/bookings/:id/checkout
const checkoutBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking nahi mili' });
    }

    if (booking.status === 'Checked-out') {
      return res.status(400).json({ success: false, message: 'Yeh room pehle hi checkout ho chuka hai' });
    }

    // Booking update
    booking.status = 'Checked-out';
    booking.actualCheckOut = Date.now();
    await booking.save();

    // Room update - room ko safai ke liye mark karna
    await Room.findByIdAndUpdate(booking.room, { status: 'Cleaning' });

    res.json({ success: true, message: 'Checkout kamyabi se ho gaya. Room cleaning ke liye bhej diya gaya hai.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Checkout mein error aa gaya' });
  }
};

// @desc    Booking cancel karna
// @route   PUT /api/bookings/:id/cancel
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking nahi mili' });
    }

    if (booking.status === 'Cancelled') {
      return res.status(400).json({ success: false, message: 'Booking pehle hi cancel ho chuki hai' });
    }

    booking.status = 'Cancelled';
    await booking.save();

    // Room update - room ko wapis available karna
    await Room.findByIdAndUpdate(booking.room, { status: 'Available' });

    res.json({ success: true, message: 'Booking cancel kar di gayi hai' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Cancellation mein error aa gaya' });
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  checkoutBooking,
  cancelBooking
};
