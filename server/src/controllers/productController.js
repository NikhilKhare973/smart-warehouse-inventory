const { PrismaClient } = require('@prisma/client');
const prisma = require('../config/db');

// @desc    Create a new product
// @route   POST /api/products
// @access  Private (Admin or Manager)
exports.createProduct = async (req, res) => {
    try {
        // 1. Extract data from the request body
        const { name, sku, description, price, categoryId, minStockLevel } = req.body;

        // 2. Simple validation: Ensure the SKU is unique before creating
        const existingProduct = await prisma.product.findUnique({ where: { sku } });
        if (existingProduct) {
            return res.status(400).json({ message: 'A product with this SKU already exists.' });
        }

        // 3. Create the product in the database
        const product = await prisma.product.create({
            data: {
                name,
                sku,
                description,
                price,
                categoryId,
                minStockLevel: minStockLevel || 10, // Default to 10 if not provided
                currentStock: 0 // New products always start with 0 stock
            }
        });

        // 4. Send success response
        res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: 'Server error while creating product' });
    }
};


// @desc    Get all products (with Search and Filters)
// @route   GET /api/products
// @access  Private
exports.getProducts = async (req, res) => {
    try {
        // Extract query parameters from the URL (e.g., ?search=laptop&category=uuid)
        const { search, category, status } = req.query;

        // Build a dynamic filtering object
        let queryOptions = {
            include: { category: { select: { name: true } } },
            orderBy: { createdAt: 'desc' },
            where: {} // Start empty, add conditions if provided
        };

        // 1. Search by Name or SKU
        if (search) {
            queryOptions.where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { sku: { contains: search, mode: 'insensitive' } }
            ];
        }

        // 2. Filter by Category ID
        if (category) {
            queryOptions.where.categoryId = category;
        }

        // 3. Filter by Stock Status
        if (status === 'OUT_OF_STOCK') {
            queryOptions.where.currentStock = 0;
        } else if (status === 'IN_STOCK') {
            queryOptions.where.currentStock = { gt: 0 };
        }

        const products = await prisma.product.findMany(queryOptions);
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: 'Server error while fetching products' });
    }
};

// @desc    Update an existing product
// @route   PUT /api/products/:id
// @access  Private (Admin or Manager)
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, sku, price, minStockLevel } = req.body;

        // Ensure the product exists before updating
        const existingProduct = await prisma.product.findUnique({ where: { id } });
        if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: {
                name,
                sku,
                price: price ? parseFloat(price) : undefined,
                minStockLevel: minStockLevel ? parseInt(minStockLevel) : undefined
            }
        });

        res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        console.error("Error updating product:", error);
        // Handle unique constraint error if they try to change the SKU to one that already exists
        if (error.code === 'P2002') {
            return res.status(400).json({ message: 'A product with this SKU already exists.' });
        }
        res.status(500).json({ message: 'Server error while updating product' });
    }
};