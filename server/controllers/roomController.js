// roomController.js - yeh controller rooms ka CRUD handle karta hai
const Room = require('../models/Room');

// ============ GET ALL ROOMS ============
// GET /api/rooms - saare rooms ki list return karo
const getAllRooms = async (req, res) => {
  try {
    // saare rooms fetch karo, newest pehle
    const rooms = await Room.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: rooms.length,
      rooms
    });
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({
      success: false,
      message: 'Rooms fetch karne mein error aa gaya'
    });
  }
};

// ============ GET SINGLE ROOM ============
// GET /api/rooms/:id - ek specific room return karo
const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    // agar room nahi mila to 404 error do
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room nahi mila'
      });
    }

    res.json({ success: true, room });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Room fetch karne mein error aa gaya'
    });
  }
};

// ============ CREATE ROOM ============
// POST /api/rooms - naya room add karo
const createRoom = async (req, res) => {
  try {
    const { roomNumber, type, price, status, description } = req.body;

    // check karo ke room number pehle se to nahi hai
    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      return res.status(400).json({
        success: false,
        message: 'Yeh room number pehle se mojood hai'
      });
    }

    // naya room create karo
    const room = await Room.create({
      roomNumber,
      type,
      price,
      status: status || 'Available',
      description
    });

    res.status(201).json({
      success: true,
      message: 'Room successfully create ho gaya!',
      room
    });
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({
      success: false,
      message: 'Room create karne mein error aa gaya'
    });
  }
};

// ============ UPDATE ROOM ============
// PUT /api/rooms/:id - existing room update karo
const updateRoom = async (req, res) => {
  try {
    // room find karo aur update karo
    let room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room nahi mila'
      });
    }

    // agar room number change ho raha hai to duplicate check karo
    if (req.body.roomNumber && req.body.roomNumber !== room.roomNumber) {
      const duplicate = await Room.findOne({ roomNumber: req.body.roomNumber });
      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: 'Yeh room number pehle se kisi aur room ka hai'
        });
      }
    }

    // room update karo
    room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Room successfully update ho gaya!',
      room
    });
  } catch (error) {
    console.error('Update room error:', error);
    res.status(500).json({
      success: false,
      message: 'Room update karne mein error aa gaya'
    });
  }
};

// ============ DELETE ROOM ============
// DELETE /api/rooms/:id - room delete karo
const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room nahi mila'
      });
    }

    // room delete karo
    await Room.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Room successfully delete ho gaya!'
    });
  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({
      success: false,
      message: 'Room delete karne mein error aa gaya'
    });
  }
};

module.exports = { getAllRooms, getRoomById, createRoom, updateRoom, deleteRoom };
