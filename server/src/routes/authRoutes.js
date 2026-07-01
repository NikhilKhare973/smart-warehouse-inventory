const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route: POST /api/auth/register
// Access: Public
router.post('/register', authController.register);

// Route: POST /api/auth/login
// Access: Public
router.post('/login', authController.login);

module.exports = router;