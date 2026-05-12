// seed.js - yeh script database mein initial data daalta hai taake test karna asaan ho
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Room = require('./models/Room');
const Guest = require('./models/Guest');
const Booking = require('./models/Booking');
const Feedback = require('./models/Feedback');
const Maintenance = require('./models/Maintenance');
const Housekeeping = require('./models/Housekeeping');

dotenv.config();

const seedData = async () => {
  try {
    // MongoDB connect karo
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🌱 Seeding database...');

    // Purana data clear karo
    await User.deleteMany();
    await Room.deleteMany();
    await Guest.deleteMany();
    await Booking.deleteMany();
    await Feedback.deleteMany();
    await Maintenance.deleteMany();
    await Housekeeping.deleteMany();
    console.log('🗑️ Purana data clear ho gaya');

    // 1. Admin aur Staff users create karo
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@hotel.com',
      password: 'admin123',
      role: 'superadmin'
    });
    console.log('👤 SuperAdmin create hua: admin@hotel.com / admin123');

    const staff = await User.create({
      name: 'Staff Member',
      email: 'staff@hotel.com',
      password: 'staff123',
      role: 'staff'
    });
    console.log('👤 Staff create hua: staff@hotel.com / staff123');

    // 2. Rooms create karo (Total 12 rooms)
    const roomData = [
      { roomNumber: '101', type: 'Single', price: 2500, status: 'Available' },
      { roomNumber: '102', type: 'Single', price: 2500, status: 'Booked' },
      { roomNumber: '103', type: 'Single', price: 2500, status: 'Cleaning' },
      { roomNumber: '201', type: 'Double', price: 4500, status: 'Available' },
      { roomNumber: '202', type: 'Double', price: 4500, status: 'Booked' },
      { roomNumber: '203', type: 'Double', price: 4500, status: 'Available' },
      { roomNumber: '301', type: 'Deluxe', price: 8000, status: 'Available' },
      { roomNumber: '302', type: 'Deluxe', price: 8000, status: 'Booked' },
      { roomNumber: '303', type: 'Deluxe', price: 8500, status: 'Available' },
      { roomNumber: '401', type: 'Deluxe', price: 12000, status: 'Available' },
      { roomNumber: '402', type: 'Double', price: 5000, status: 'Available' },
      { roomNumber: '104', type: 'Single', price: 2200, status: 'Available' },
    ];
    const rooms = await Room.insertMany(roomData);
    console.log('🏨 12 rooms create ho gaye');

    // 3. Guests create karo
    const guestData = [
      { firstName: 'Ali', lastName: 'Khan', email: 'ali@example.com', phone: '03001234567', idNumber: '42101-1234567-1', idType: 'CNIC', city: 'Karachi', isVIP: true },
      { firstName: 'Sara', lastName: 'Ahmed', email: 'sara@example.com', phone: '03129876543', idNumber: '42201-7654321-2', idType: 'CNIC', city: 'Lahore', isVIP: false },
      { firstName: 'Zain', lastName: 'Malik', email: 'zain@example.com', phone: '03335554433', idNumber: 'A1234567', idType: 'Passport', city: 'Islamabad', isVIP: false },
    ];
    const guests = await Guest.insertMany(guestData);
    console.log('👥 3 Guest profiles create ho gaye');

    // 4. Sample Bookings create karo
    const bookingData = [
      {
        guestName: 'Ali Khan',
        room: rooms[1]._id,
        checkIn: new Date(),
        checkOut: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        totalAmount: 5000,
        status: 'confirmed',
        createdBy: admin._id
      },
      {
        guestName: 'Sara Ahmed',
        room: rooms[4]._id,
        checkIn: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        checkOut: new Date(),
        totalAmount: 13500,
        status: 'checked-out',
        createdBy: staff._id
      }
    ];
    const bookings = await Booking.insertMany(bookingData);
    console.log('📅 2 Sample bookings create ho gaye');

    // 5. Feedback create karo
    await Feedback.create({
      guestName: 'Sara Ahmed',
      rating: 5,
      cleanliness: 5,
      service: 4,
      comfort: 5,
      location: 5,
      comment: 'Bohot acha stay tha, staff ka behavior bohot acha hai.',
      status: 'Reviewed'
    });
    console.log('⭐ Sample feedback create ho gaya');

    // 6. Maintenance Request create karo
    await Maintenance.create({
      room: rooms[1]._id,
      title: 'AC Issue',
      description: 'AC cooling nahi kar raha sahi se.',
      priority: 'High',
      status: 'Reported',
      reportedBy: staff._id
    });
    console.log('🔧 Sample maintenance request create ho gayi');

    console.log('\n✅ Database seed complete!');
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
