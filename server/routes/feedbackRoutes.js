// feedbackRoutes.js - guest feedback ke routes
const express = require('express');
const router = express.Router();
const { getAllFeedback, createFeedback, updateFeedback, deleteFeedback } = require('../controllers/feedbackController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getAllFeedback);
router.post('/', createFeedback);
router.put('/:id', updateFeedback);
router.delete('/:id', deleteFeedback);

module.exports = router;
