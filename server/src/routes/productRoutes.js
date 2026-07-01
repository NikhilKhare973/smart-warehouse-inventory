const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

// Route: GET /api/products
// Access: Private (All authenticated users)
router.get('/', authenticate, productController.getProducts);

// Route: POST /api/products
// Access: Private (Admin or Manager only)
router.post(
    '/',
    authenticate,
    authorizeRoles('ADMIN', 'MANAGER'), // Blocks STAFF from creating products
    productController.createProduct
);

// Add this right below your POST route
router.put(
    '/:id',
    authenticate,
    authorizeRoles('ADMIN', 'MANAGER'),
    productController.updateProduct
);

module.exports = router;