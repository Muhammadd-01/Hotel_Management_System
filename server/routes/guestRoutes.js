// guestRoutes.js - guest management ke routes
const express = require('express');
const router = express.Router();
const { getAllGuests, getGuestById, createGuest, updateGuest, deleteGuest } = require('../controllers/guestController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getAllGuests);
router.get('/:id', getGuestById);
router.post('/', createGuest);
router.put('/:id', updateGuest);
router.delete('/:id', deleteGuest);

module.exports = router;
