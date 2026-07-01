const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');
const { authenticate } = require('../middleware/authMiddleware');

// Route: POST /api/stock/adjust
// Access: Private
router.post('/adjust', authenticate, stockController.adjustStock);

// Route: GET /api/stock/history
// Access: Private
router.get('/history', authenticate, stockController.getHistory);

module.exports = router;