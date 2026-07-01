require('dotenv').config(); // 1. Load the .env file so it can find DATABASE_URL
const prisma = require('../src/config/db'); // 2. Import your configured Prisma 7 client!
const bcrypt = require('bcryptjs');

async function main() {
    console.log('🌱 Starting database seeding...');

    // 1. Wipe existing data to start fresh
    await prisma.inventoryHistory.deleteMany();
    await prisma.purchaseRequest.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    // 2. Create an Admin User
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    const admin = await prisma.user.create({
        data: {
            name: 'System Admin',
            email: 'admin@test.com',
            passwordHash,
            role: 'ADMIN',
        },
    });
    console.log(`✅ Admin user created: ${admin.email}`);

    // 3. Create Categories
    const electronics = await prisma.category.create({ data: { name: 'Electronics & IT' } });
    const furniture = await prisma.category.create({ data: { name: 'Office Furniture' } });
    const supplies = await prisma.category.create({ data: { name: 'General Supplies' } });
    console.log('✅ Categories created.');

    // 4. Create Dummy Products
    const products = await prisma.product.createMany({
        data: [
            {
                name: 'MacBook Pro M3 Max',
                sku: 'LAP-MBP-001',
                price: 250000,
                currentStock: 12,
                minStockLevel: 5,
                categoryId: electronics.id,
            },
            {
                name: 'Dell UltraSharp 27" Monitor',
                sku: 'MON-DELL-027',
                price: 35000,
                currentStock: 3, // Low stock to trigger warnings!
                minStockLevel: 10,
                categoryId: electronics.id,
            },
            {
                name: 'Ergonomic Mesh Office Chair',
                sku: 'FURN-CHR-009',
                price: 12500,
                currentStock: 45,
                minStockLevel: 15,
                categoryId: furniture.id,
            },
            {
                name: 'Standing Desk (Motorized)',
                sku: 'FURN-DSK-002',
                price: 28000,
                currentStock: 0, // Out of stock to trigger errors!
                minStockLevel: 5,
                categoryId: furniture.id,
            },
            {
                name: 'Premium A4 Printer Paper (Box)',
                sku: 'SUP-PAP-A4',
                price: 1200,
                currentStock: 150,
                minStockLevel: 50,
                categoryId: supplies.id,
            },
        ],
    });

    console.log(`✅ Successfully seeded ${products.count} products.`);
    console.log('🎉 Seeding finished successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        process.exit(0); // Ensure the script closes out perfectly
    });