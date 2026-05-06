// maintenanceController.js - yeh controller maintenance requests handle karta hai
const Maintenance = require('../models/Maintenance');
const Notification = require('../models/Notification');

// GET /api/maintenance - saari requests ki list
const getAllRequests = async (req, res) => {
  try {
    const requests = await Maintenance.find()
      .populate('room', 'roomNumber type')
      .populate('reportedBy', 'name')
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: requests.length, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Requests fetch mein error' });
  }
};

// POST /api/maintenance - nayi request banao
const createRequest = async (req, res) => {
  try {
    const request = await Maintenance.create({ ...req.body, reportedBy: req.user._id });
    await Notification.create({
      title: 'Maintenance Request',
      message: `"${req.body.title}" - Priority: ${req.body.priority || 'Medium'}`,
      type: 'maintenance'
    });
    const populated = await Maintenance.findById(request._id)
      .populate('room', 'roomNumber type')
      .populate('reportedBy', 'name');
    res.status(201).json({ success: true, message: 'Request ban gayi!', request: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Request create mein error: ' + error.message });
  }
};

// PUT /api/maintenance/:id - request update karo
const updateRequest = async (req, res) => {
  try {
    if (req.body.status === 'Resolved') req.body.resolvedAt = new Date();
    const request = await Maintenance.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('room', 'roomNumber type')
      .populate('reportedBy', 'name')
      .populate('assignedTo', 'name');
    if (!request) return res.status(404).json({ success: false, message: 'Request nahi mili' });
    res.json({ success: true, message: 'Request update ho gayi!', request });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Request update mein error' });
  }
};

// DELETE /api/maintenance/:id
const deleteRequest = async (req, res) => {
  try {
    await Maintenance.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Request delete ho gayi!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Request delete mein error' });
  }
};

module.exports = { getAllRequests, createRequest, updateRequest, deleteRequest };
