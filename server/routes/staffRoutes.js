// staffRoutes.js - staff management ke routes (admin only)
const express = require('express');
const router = express.Router();
const { getAllStaff, updateStaff, deactivateStaff } = require('../controllers/staffController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));
router.get('/', getAllStaff);
router.put('/:id', updateStaff);
router.delete('/:id', deactivateStaff);

module.exports = router;
