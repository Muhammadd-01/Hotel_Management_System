// Housekeeping.js - yeh model housekeeping tasks ka data store karta hai
const mongoose = require('mongoose');

const housekeepingSchema = new mongoose.Schema({
  // kis room ke liye hai yeh task
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: [true, 'Room select karna zaroori hai']
  },
  // task ka type
  taskType: {
    type: String,
    required: [true, 'Task type dena zaroori hai'],
    enum: ['Cleaning', 'Deep Cleaning', 'Linen Change', 'Restocking', 'Inspection']
  },
  // task ka status
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending'
  },
  // priority level
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  // kis staff member ko assign hua
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // notes ya special instructions
  notes: {
    type: String,
    default: ''
  },
  // task complete hone ki date
  completedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Housekeeping', housekeepingSchema);
