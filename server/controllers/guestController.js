// guestController.js - Manages the lifecycle and data of hotel guests
const Guest = require('../models/Guest');

// ============ FETCH ALL GUEST PROFILES ============
// GET /api/guests - Retrieves a sorted list of all registered guests
const getAllGuests = async (req, res) => {
  try {
    const guests = await Guest.find().sort({ createdAt: -1 });
    res.json({ 
      success: true, 
      count: guests.length, 
      guests 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve guest profiles' 
    });
  }
};

// ============ FETCH SINGLE GUEST PROFILE ============
// GET /api/guests/:id - Retrieves detailed information for a specific guest
const getGuestById = async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.id);
    if (!guest) {
      return res.status(404).json({ 
        success: false, 
        message: 'Guest profile not found' 
      });
    }
    res.json({ 
      success: true, 
      guest 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching guest details' 
    });
  }
};

// ============ CREATE NEW GUEST PROFILE ============
// POST /api/guests - Registers a new guest in the system catalog
const createGuest = async (req, res) => {
  try {
    // Body includes identification details, contact info, and preferences
    const guest = await Guest.create(req.body);
    res.status(201).json({ 
      success: true, 
      message: 'Guest profile initialized successfully', 
      guest 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create guest profile: ' + error.message 
    });
  }
};

// ============ UPDATE GUEST PROFILE ============
// PUT /api/guests/:id - Modifies existing guest information
const updateGuest = async (req, res) => {
  try {
    const guest = await Guest.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!guest) {
      return res.status(404).json({ 
        success: false, 
        message: 'Guest profile not found' 
      });
    }
    res.json({ 
      success: true, 
      message: 'Guest profile updated successfully', 
      guest 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update guest profile details' 
    });
  }
};

// ============ DELETE GUEST PROFILE ============
// DELETE /api/guests/:id - Permanently removes a guest record from the system
const deleteGuest = async (req, res) => {
  try {
    const guest = await Guest.findByIdAndDelete(req.params.id);
    if (!guest) {
      return res.status(404).json({ 
        success: false, 
        message: 'Guest profile not found' 
      });
    }
    res.json({ 
      success: true, 
      message: 'Guest profile deleted from system catalog' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error during guest profile deletion' 
    });
  }
};

module.exports = { getAllGuests, getGuestById, createGuest, updateGuest, deleteGuest };
