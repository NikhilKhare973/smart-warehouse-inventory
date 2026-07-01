const prisma = require('../config/db');

// @desc    Adjust stock (IN or OUT) and create an audit log
// @route   POST /api/stock/adjust
// @access  Private (Admin, Manager, Staff)
exports.adjustStock = async (req, res) => {
    try {
        const { productId, type, quantity, reason } = req.body;
        const userId = req.user.userId; // Extracted from your JWT auth middleware

        // Basic validation
        if (!['IN', 'OUT'].includes(type) || quantity <= 0) {
            return res.status(400).json({ message: 'Invalid transaction type or quantity' });
        }

        // --- PRISMA TRANSACTION ---
        // Both database operations must succeed, or both will roll back.
        const result = await prisma.$transaction(async (tx) => {

            // 1. Find the product
            const product = await tx.product.findUnique({ where: { id: productId } });
            if (!product) {
                throw new Error("Product not found");
            }

            // 2. Calculate new stock
            let newStock = product.currentStock;
            if (type === 'IN') {
                newStock += quantity;
            } else if (type === 'OUT') {
                if (product.currentStock < quantity) {
                    throw new Error(`Insufficient stock. Current stock: ${product.currentStock}`);
                }
                newStock -= quantity;
            }

            // 3. Update the product's current stock
            const updatedProduct = await tx.product.update({
                where: { id: productId },
                data: { currentStock: newStock }
            });

            // 4. Create the immutable Audit Log
            const auditLog = await tx.inventoryHistory.create({
                data: {
                    productId,
                    userId,
                    type,
                    quantity,
                    reason
                }
            });

            return { updatedProduct, auditLog };
        });

        res.status(200).json({
            message: 'Stock updated successfully',
            data: result
        });

    } catch (error) {
        console.error("Stock adjustment error:", error.message);
        // If the error came from our custom throw inside the transaction, send a 400
        if (error.message.includes('Insufficient') || error.message.includes('not found')) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error during stock adjustment' });
    }
};

// @desc    Get inventory audit history
// @route   GET /api/stock/history
// @access  Private
exports.getHistory = async (req, res) => {
    try {
        const history = await prisma.inventoryHistory.findMany({
            include: {
                product: { select: { name: true, sku: true } },
                user: { select: { name: true } }
            },
            orderBy: { createdAt: 'desc' },
            take: 50 // Limit to the most recent 50 transactions for performance
        });

        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching history' });
    }
};