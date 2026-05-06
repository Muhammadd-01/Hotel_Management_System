// invoiceController.js - yeh controller billing aur invoices handle karta hai
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Room = require('../models/Room');

// GET /api/invoices/:bookingId - ek booking ka detailed invoice
const getInvoice = async (req, res) => {
  try {
    // booking details fetch karo
    const booking = await Booking.findById(req.params.bookingId)
      .populate('room', 'roomNumber type price')
      .populate('createdBy', 'name');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking nahi mili' });
    }

    // is booking ke saare services fetch karo
    const services = await Service.find({ booking: booking._id });

    // kitni raatein hain
    const nights = Math.max(1, Math.ceil(
      (new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24)
    ));

    // room charges calculate karo
    const roomCharges = booking.room ? booking.room.price * nights : 0;

    // services ka total calculate karo
    const serviceCharges = services.reduce((sum, s) => sum + (s.amount || 0), 0);

    // tax calculate karo (15%)
    const taxRate = 0.15;
    const subtotal = roomCharges + serviceCharges;
    const tax = Math.round(subtotal * taxRate);
    const grandTotal = subtotal + tax;

    // invoice object banao
    const invoice = {
      invoiceNumber: `INV-${booking._id.toString().slice(-6).toUpperCase()}`,
      bookingId: booking._id,
      guestName: booking.guestName,
      room: booking.room,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      nights,
      roomCharges,
      services: services.map(s => ({
        type: s.serviceType,
        description: s.description,
        amount: s.amount,
        date: s.createdAt
      })),
      serviceCharges,
      subtotal,
      taxRate: taxRate * 100,
      tax,
      grandTotal,
      status: booking.status,
      createdAt: booking.createdAt,
      generatedAt: new Date()
    };

    res.json({ success: true, invoice });
  } catch (error) {
    console.error('Invoice error:', error);
    res.status(500).json({ success: false, message: 'Invoice generate mein error' });
  }
};

// GET /api/invoices - saari bookings ke invoices ki list
const getAllInvoices = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('room', 'roomNumber type price')
      .sort({ createdAt: -1 });

    const invoices = bookings.map(b => ({
      invoiceNumber: `INV-${b._id.toString().slice(-6).toUpperCase()}`,
      bookingId: b._id,
      guestName: b.guestName,
      roomNumber: b.room?.roomNumber || 'N/A',
      roomType: b.room?.type || 'N/A',
      totalAmount: b.totalAmount,
      status: b.status,
      checkIn: b.checkIn,
      checkOut: b.checkOut,
      createdAt: b.createdAt
    }));

    res.json({ success: true, count: invoices.length, invoices });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Invoices fetch mein error' });
  }
};

module.exports = { getInvoice, getAllInvoices };
