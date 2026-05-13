// serviceController.js - yeh controller additional services handle karta hai
const Service = require('../models/Service');

// GET /api/services - saari services ki list
const getAllServices = async (req, res) => {
  try {
    const services = await Service.find()
      .populate('booking', 'guestName')
      .populate('guest', 'firstName lastName')
      .populate('handledBy', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: services.length, services });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Services fetch mein error' });
  }
};

// POST /api/services - nayi service request banao
const createService = async (req, res) => {
  try {
    const service = await Service.create({ ...req.body, handledBy: req.user._id });

    const populated = await Service.findById(service._id)
      .populate('booking', 'guestName')
      .populate('guest', 'firstName lastName');
    res.status(201).json({ success: true, message: 'Service request ban gayi!', service: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Service create mein error: ' + error.message });
  }
};

// PUT /api/services/:id - service update karo (status change)
const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('booking', 'guestName')
      .populate('guest', 'firstName lastName');
    if (!service) return res.status(404).json({ success: false, message: 'Service nahi mili' });
    res.json({ success: true, message: 'Service update ho gayi!', service });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Service update mein error' });
  }
};

// DELETE /api/services/:id
const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service nahi mili' });
    res.json({ success: true, message: 'Service delete ho gayi!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Service delete mein error' });
  }
};

module.exports = { getAllServices, createService, updateService, deleteService };
