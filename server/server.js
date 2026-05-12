// server.js - Yeh backend ka main starting point hai
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/db');

// Environment variables load karne ke liye .env file use hoti hai
dotenv.config();

// MongoDB database se connection banane ke liye function call
connectDB();

// Express framework ko initialize karna
const app = express();

// ============ MIDDLEWARE SETTINGS ============

// Security Headers
app.use(helmet());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// CORS configuration (Moved up to ensure headers are present even on errors)
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

// Rate Limiting - brute force prevention (Increased for development)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 1000, // Increased from 100 to 1000 for smoother development
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', limiter);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// JSON data parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ============ API ROUTES SETUP ============
// Har module ke liye alag routes file hai taake code saaf rahe

// Auth routes (Login, Register wagera)
app.use('/api/auth', require('./routes/authRoutes'));

// Room management routes
app.use('/api/rooms', require('./routes/roomRoutes'));

// Booking aur check-in management
// Dashboard stats aur reports
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// AI Assistant functionality
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/guests', require('./routes/guestRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/addons', require('./routes/addonRoutes'));

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
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

// ============ SOCKET.IO SETUP ============
const io = require('socket.io')(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST']
  }
});

// Global io object for use in controllers
app.set('io', io);

io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);
  
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`👤 User joined room: ${userId}`);
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected');
  });
});
