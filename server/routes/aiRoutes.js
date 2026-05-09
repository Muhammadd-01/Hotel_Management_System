// aiRoutes.js - yeh file AI Smart Assistant ke routes define karti hai
const express = require('express');
const router = express.Router();
const { smartSearch } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

// GET /api/ai/search - AI se room suggest karwao (protected)
router.get('/search', protect, smartSearch);

module.exports = router;
