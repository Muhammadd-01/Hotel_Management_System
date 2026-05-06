// server.js - Yeh backend ka main starting point hai
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Environment variables load karne ke liye .env file use hoti hai
dotenv.config();

// MongoDB database se connection banane ke liye function call
connectDB();

// Express framework ko initialize karna
const app = express();

// ============ MIDDLEWARE SETTINGS ============

// JSON data parse karne ke liye middleware (e.g. jab frontend se body aati hai)
app.use(express.json());

// CORS (Cross-Origin Resource Sharing) allow karna taake frontend aur backend communicate kar sakein
app.use(cors({
  origin: 'http://localhost:5173', // Hamare Vite React app ka URL
  credentials: true
}));

// ============ API ROUTES SETUP ============
// Har module ke liye alag routes file hai taake code saaf rahe

// Auth routes (Login, Register wagera)
app.use('/api/auth', require('./routes/authRoutes'));

// Room management routes
app.use('/api/rooms', require('./routes/roomRoutes'));

// Booking aur check-in management
app.use('/api/bookings', require('./routes/bookingRoutes'));

// Dashboard stats aur reports
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// AI Assistant functionality
app.use('/api/ai', require('./routes/aiRoutes'));

// Guest management
app.use('/api/guests', require('./routes/guestRoutes'));

// Additional services (Food, Laundry wagera)
app.use('/api/services', require('./routes/serviceRoutes'));

// Housekeeping tasks
app.use('/api/housekeeping', require('./routes/housekeepingRoutes'));

// Maintenance requests
app.use('/api/maintenance', require('./routes/maintenanceRoutes'));

// Feedback aur ratings
app.use('/api/feedback', require('./routes/feedbackRoutes'));

// System notifications
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Staff management (Admin only)
app.use('/api/staff', require('./routes/staffRoutes'));

// Billing aur invoice management
app.use('/api/invoices', require('./routes/invoiceRoutes'));

// ============ BASIC SERVER CHECKS ============

// Check karna ke server chal raha hai ya nahi
app.get('/', (req, res) => {
  res.json({ message: '🏨 HotelPro Backend API is LIVE!' });
});

// ============ GLOBAL ERROR HANDLING ============
// Agar poore app mein kahin bhi error aaye to yeh handle karega
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Backend mein koi masla aa gaya hai',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

// ============ SERVER LISTEN ============
// Specific port pe server start karna
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server chal raha hai port ${PORT} par`);
  console.log(`📡 API access karne ke liye: http://localhost:${PORT}`);
});
