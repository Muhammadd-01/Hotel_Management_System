// Maintenance.js - yeh model maintenance requests ka data store karta hai
const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  // kis room mein issue hai
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: [true, 'Room select karna zaroori hai']
  },
  // issue ka title
  title: {
    type: String,
    required: [true, 'Issue ka title dena zaroori hai'],
    trim: true
  },
  // issue ki description
  description: {
    type: String,
    required: [true, 'Issue ki description dena zaroori hai'],
    trim: true
  },
  // priority level
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  // request ka status
  status: {
    type: String,
    enum: ['Reported', 'In Progress', 'Resolved', 'Closed'],
    default: 'Reported'
  },
  // kis ne report kiya
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // kis ko assign hua
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // resolve hone ki date
  resolvedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Maintenance', maintenanceSchema);
