require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const stockRoutes = require('./src/routes/stockRoutes');
const purchaseRequestRoutes = require('./src/routes/purchaseRequestRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/purchase-requests', purchaseRequestRoutes);
app.use('/api/dashboard', require('./src/routes/dashboardRoutes'));

app.use('/api/categories', require('./src/routes/categoryRoutes'));

// --- Health Checks ---
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'Server is healthy and running!' });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'Backend is running smoothly with Prisma 7!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});