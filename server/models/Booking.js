// Booking.js - yeh model hotel ki bookings ka data store karta hai
const mongoose = require('mongoose');

// Booking schema define karo - har booking ka structure yahan hai
const bookingSchema = new mongoose.Schema({
  // guest ka naam jo room book kar raha hai
  guestName: {
    type: String,
    required: [true, 'Guest ka naam dena zaroori hai'],
    trim: true
  },
  // room ki reference - Room model se linked hai
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: [true, 'Room select karna zaroori hai']
  },
  // check-in ki date
  checkIn: {
    type: Date,
    required: [true, 'Check-in date dena zaroori hai']
  },
  // check-out ki date
  checkOut: {
    type: Date,
    required: [true, 'Check-out date dena zaroori hai']
  },
  // booking ka status
  status: {
    type: String,
    enum: {
      values: ['confirmed', 'checked-out', 'cancelled'],
      message: 'Status confirmed, checked-out, ya cancelled mein se hona chahiye'
    },
    default: 'confirmed'
  },
  // total amount calculate hota hai price * nights se
  totalAmount: {
    type: Number,
    default: 0
  },
  // kis user ne booking create ki
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  // timestamps automatically createdAt aur updatedAt add karta hai
  timestamps: true
});

// ============ TOTAL AMOUNT CALCULATE KARO ============
// save se pehle total amount calculate karo check-in aur check-out dates se
bookingSchema.pre('save', async function(next) {
  // agar checkIn ya checkOut modify hua hai to total calculate karo
  if (this.isModified('checkIn') || this.isModified('checkOut') || this.isNew) {
    try {
      // Room model se price fetch karo
      const Room = mongoose.model('Room');
      const room = await Room.findById(this.room);
      if (room) {
        // kitni raatein hain calculate karo
        const nights = Math.ceil(
          (new Date(this.checkOut) - new Date(this.checkIn)) / (1000 * 60 * 60 * 24)
        );
        // total amount = price per night * number of nights
        this.totalAmount = room.price * Math.max(nights, 1);
      }
    } catch (error) {
      console.error('Total amount calculate karne mein error:', error);
    }
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
