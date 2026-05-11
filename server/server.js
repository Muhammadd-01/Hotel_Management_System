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

// JSON data parsing middleware
app.use(express.json());

// CORS configuration to allow multiple origins
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
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

// Check if the server is running or not
app.get('/', (req, res) => {
  res.json({ message: '🏨 HotelPro Backend API is LIVE!' });
});

// ============ GLOBAL ERROR HANDLING ============
// This will handle any errors occurring throughout the app
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'An issue occurred in the backend',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

// ============ SERVER LISTEN ============
// Start server on a specific port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 To access the API: http://localhost:${PORT}`);
});
