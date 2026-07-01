const prisma = require('../config/db');

// @desc    Get dashboard summary statistics
// @route   GET /api/dashboard/summary
// @access  Private
exports.getSummary = async (req, res) => {
    try {
        // 1. Fetch lightweight product data for calculations
        const products = await prisma.product.findMany({
            select: { currentStock: true, minStockLevel: true }
        });

        // 2. Calculate metrics in memory
        const totalProducts = products.length;
        const outOfStock = products.filter(p => p.currentStock === 0).length;
        const lowStock = products.filter(p => p.currentStock > 0 && p.currentStock <= p.minStockLevel).length;

        // 3. Get the 5 most recent warehouse transactions
        const recentActivity = await prisma.inventoryHistory.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                product: { select: { name: true } },
                user: { select: { name: true } }
            }
        });

        res.status(200).json({
            metrics: {
                totalProducts,
                outOfStock,
                lowStock
            },
            recentActivity
        });
    } catch (error) {
        console.error("Dashboard error:", error);
        res.status(500).json({ message: 'Server error fetching dashboard data' });
    }
};