const express = require('express');
const router = express.Router();
const requestController = require('../controllers/purchaseRequestController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

// Get low stock alerts
router.get('/low-stock', authenticate, requestController.getLowStock);

// Submit a new request (Anyone logged in)
router.post('/', authenticate, requestController.createRequest);

// Get all requests
router.get('/', authenticate, requestController.getAllRequests);

// Approve/Reject a request (Admin or Manager ONLY)
router.patch(
    '/:id',
    authenticate,
    authorizeRoles('ADMIN', 'MANAGER'),
    requestController.updateRequestStatus
);

module.exports = router;