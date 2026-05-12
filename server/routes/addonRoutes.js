const express = require('express');
const router = express.Router();
const { getAddons, createAddon, updateAddon, deleteAddon } = require('../controllers/addonController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getAddons);
router.post('/', protect, authorize('superadmin', 'manager'), createAddon);
router.put('/:id', protect, authorize('superadmin', 'manager'), updateAddon);
router.delete('/:id', protect, authorize('superadmin', 'manager'), deleteAddon);

module.exports = router;
