// roomRoutes.js - yeh file room management ke routes define karti hai
const express = require('express');
const router = express.Router();
const { getAllRooms, getRoomById, createRoom, updateRoom, deleteRoom } = require('../controllers/roomController');
const { protect, authorize } = require('../middleware/auth');
const { roomRules } = require('../middleware/validate');

// saare routes protected hain - login zaroori hai
// GET /api/rooms - saare rooms dekho (Public)
router.get('/', getAllRooms);

// GET /api/rooms/:id - ek room dekho (Public)
router.get('/:id', getRoomById);

// Protected routes below
router.use(protect);

// POST /api/rooms - naya room add karo (sirf admin)
router.post('/', authorize('admin'), roomRules, createRoom);

// PUT /api/rooms/:id - room update karo (admin + staff)
router.put('/:id', updateRoom);

// DELETE /api/rooms/:id - room delete karo (sirf admin)
router.delete('/:id', authorize('admin'), deleteRoom);

module.exports = router;
