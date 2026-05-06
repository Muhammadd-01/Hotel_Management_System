// housekeepingRoutes.js - housekeeping tasks ke routes
const express = require('express');
const router = express.Router();
const { getAllTasks, createTask, updateTask, deleteTask } = require('../controllers/housekeepingController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getAllTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
