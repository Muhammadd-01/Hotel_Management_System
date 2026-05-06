// dashboardController.js - yeh controller dashboard ke stats return karta hai (expanded)
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Guest = require('../models/Guest');
const Maintenance = require('../models/Maintenance');
const Housekeeping = require('../models/Housekeeping');
const Service = require('../models/Service');
const Feedback = require('../models/Feedback');

// GET /api/dashboard/stats - dashboard ke liye summary data
const getStats = async (req, res) => {
  try {
    const totalRooms = await Room.countDocuments();
    const availableRooms = await Room.countDocuments({ status: 'Available' });
    const bookedRooms = await Room.countDocuments({ status: 'Booked' });
    const cleaningRooms = await Room.countDocuments({ status: 'Cleaning' });
    const totalBookings = await Booking.countDocuments();
    const activeBookings = await Booking.countDocuments({ status: 'confirmed' });
    const completedBookings = await Booking.countDocuments({ status: 'checked-out' });

    // new counts - expanded modules
    const totalGuests = await Guest.countDocuments();
    const pendingMaintenance = await Maintenance.countDocuments({ status: { $in: ['Reported', 'In Progress'] } });
    const pendingHousekeeping = await Housekeeping.countDocuments({ status: { $in: ['Pending', 'In Progress'] } });
    const pendingServices = await Service.countDocuments({ status: { $in: ['Pending', 'In Progress'] } });
    const avgFeedback = await Feedback.aggregate([
      { $group: { _id: null, avg: { $avg: '$rating' } } }
    ]);
    const averageRating = avgFeedback.length > 0 ? Math.round(avgFeedback[0].avg * 10) / 10 : 0;

    // haal ki bookings (latest 5)
    const recentBookings = await Booking.find()
      .populate('room', 'roomNumber type price')
      .sort({ createdAt: -1 }).limit(5);

    // room type ke hisaab se count - chart ke liye
    const roomsByType = await Room.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // revenue calculate karo
    const revenueData = await Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'checked-out'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    res.json({
      success: true,
      stats: {
        totalRooms, availableRooms, bookedRooms, cleaningRooms,
        totalBookings, activeBookings, completedBookings, totalRevenue,
        totalGuests, pendingMaintenance, pendingHousekeeping, pendingServices, averageRating,
        recentBookings, roomsByType
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Stats fetch mein error' });
  }
};

module.exports = { getStats };
