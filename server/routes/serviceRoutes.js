// serviceRoutes.js - additional services ke routes
const express = require('express');
const router = express.Router();
const { getAllServices, createService, updateService, deleteService } = require('../controllers/serviceController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getAllServices);
router.post('/', createService);
router.put('/:id', updateService);
router.delete('/:id', deleteService);

module.exports = router;
