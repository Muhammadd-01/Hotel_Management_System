const express = require('express');
const router = express.Router();
const { getAddons, createAddon, updateAddon, deleteAddon } = require('../controllers/addonController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getAddons);
router.post('/', protect, authorize('admin', 'manager'), createAddon);
router.put('/:id', protect, authorize('admin', 'manager'), updateAddon);
router.delete('/:id', protect, authorize('admin', 'manager'), deleteAddon);

module.exports = router;
