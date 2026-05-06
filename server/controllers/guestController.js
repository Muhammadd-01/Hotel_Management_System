// guestController.js - yeh controller guest profiles ka CRUD handle karta hai
const Guest = require('../models/Guest');

// GET /api/guests - saare guests ki list
const getAllGuests = async (req, res) => {
  try {
    const guests = await Guest.find().sort({ createdAt: -1 });
    res.json({ success: true, count: guests.length, guests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Guests fetch mein error' });
  }
};

// GET /api/guests/:id - ek guest ki detail
const getGuestById = async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.id);
    if (!guest) return res.status(404).json({ success: false, message: 'Guest nahi mila' });
    res.json({ success: true, guest });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Guest fetch mein error' });
  }
};

// POST /api/guests - naya guest profile banao
const createGuest = async (req, res) => {
  try {
    const guest = await Guest.create(req.body);
    res.status(201).json({ success: true, message: 'Guest profile ban gaya!', guest });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Guest create mein error: ' + error.message });
  }
};

// PUT /api/guests/:id - guest profile update karo
const updateGuest = async (req, res) => {
  try {
    const guest = await Guest.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!guest) return res.status(404).json({ success: false, message: 'Guest nahi mila' });
    res.json({ success: true, message: 'Guest update ho gaya!', guest });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Guest update mein error' });
  }
};

// DELETE /api/guests/:id - guest delete karo
const deleteGuest = async (req, res) => {
  try {
    const guest = await Guest.findByIdAndDelete(req.params.id);
    if (!guest) return res.status(404).json({ success: false, message: 'Guest nahi mila' });
    res.json({ success: true, message: 'Guest delete ho gaya!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Guest delete mein error' });
  }
};

module.exports = { getAllGuests, getGuestById, createGuest, updateGuest, deleteGuest };
