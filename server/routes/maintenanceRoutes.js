// maintenanceRoutes.js - maintenance requests ke routes
const express = require('express');
const router = express.Router();
const { getAllRequests, createRequest, updateRequest, deleteRequest } = require('../controllers/maintenanceController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getAllRequests);
router.post('/', createRequest);
router.put('/:id', updateRequest);
router.delete('/:id', deleteRequest);

module.exports = router;
