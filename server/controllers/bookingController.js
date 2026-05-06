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
const getBookings = async (req, res) => {
  try {
    // Bookings fetch karna aur "room" ka data bhi saath lana (Populate)
    const bookings = await Booking.find()
      .populate('room', 'roomNumber type price')
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Bookings lane mein masla hua' });
  }
};

// @desc    Booking ka status update karna (Check-out wagera)
// @route   PUT /api/bookings/:id
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking nahi mili' });
    }

    // Agar status "checked-out" ho raha hai, to room ko khali karo
    if (status === 'checked-out') {
      await Room.findByIdAndUpdate(booking.room, { status: 'Cleaning' });
    }

    booking.status = status;
    await booking.save();

    res.json({ success: true, message: 'Status update ho gaya', booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Update mein error' });
  }
};

module.exports = {
  createBooking,
  getBookings,
  updateBookingStatus
};
