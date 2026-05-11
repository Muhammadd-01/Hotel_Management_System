const Addon = require('../models/Addon');

// @desc    Get all addons
// @route   GET /api/addons
const getAddons = async (req, res) => {
  try {
    const addons = await Addon.find({ isActive: true });
    res.json({ success: true, addons });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching addons' });
  }
};

// @desc    Create new addon
// @route   POST /api/addons
const createAddon = async (req, res) => {
  try {
    const addon = await Addon.create(req.body);
    res.status(201).json({ success: true, addon });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update addon
// @route   PUT /api/addons/:id
const updateAddon = async (req, res) => {
  try {
    const addon = await Addon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, addon });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete addon
// @route   DELETE /api/addons/:id
const deleteAddon = async (req, res) => {
  try {
    await Addon.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Addon deleted' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAddons,
  createAddon,
  updateAddon,
  deleteAddon
};
