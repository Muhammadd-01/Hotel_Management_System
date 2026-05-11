// Room.js - yeh model hotel ke rooms ka data store karta hai
const mongoose = require('mongoose');

// Room schema define karo - har room ka structure yahan hai
const roomSchema = new mongoose.Schema({
  // room ka number - unique hona chahiye
  roomNumber: {
    type: String,
    required: [true, 'Room number dena zaroori hai'],
    unique: true,
    trim: true,
    index: true
  },
  // room ki type - Single, Double, ya Deluxe
  type: {
    type: String,
    required: [true, 'Room type dena zaroori hai'],
    enum: {
      values: ['Single', 'Double', 'Deluxe'],
      message: 'Room type Single, Double, ya Deluxe mein se hona chahiye'
    },
    index: true
  },
  // room ki price per night
  price: {
    type: Number,
    required: [true, 'Price dena zaroori hai'],
    min: [0, 'Price negative nahi ho sakti']
  },
  // room ki images (URLs ka array)
  images: {
    type: [String],
    default: []
  },
  // room ka current status
  status: {
    type: String,
    enum: {
      values: ['Available', 'Booked', 'Cleaning'],
      message: 'Status Available, Booked, ya Cleaning mein se hona chahiye'
    },
    default: 'Available',
    index: true
  },
  // room ki description - optional
  description: {
    type: String,
    default: ''
  }
}, {
  // timestamps automatically createdAt aur updatedAt add karta hai
  timestamps: true
});

module.exports = mongoose.model('Room', roomSchema);
