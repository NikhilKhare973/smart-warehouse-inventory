const jwt = require('jsonwebtoken');
const prisma = require('../config/db'); // 1. We must import prisma to talk to the DB
const JWT_SECRET = process.env.JWT_SECRET;

// Verify JWT Validity (SMART BYPASS)
exports.authenticate = async (req, res, next) => { // 2. Add 'async' here
    try {
        // 3. Grab the REAL admin user from your Neon database
        const realAdmin = await prisma.user.findFirst({
            where: { email: 'admin@test.com' }
        });

        // 4. Inject the real database UUID into the request
        req.user = { 
            id: realAdmin.id, 
            userId: realAdmin.id,
            email: realAdmin.email, 
            role: realAdmin.role 
        };
        return next(); 

    } catch (error) {
        console.error("Bypass Database Error:", error);
        return res.status(500).json({ message: "Failed to connect to Neon database" });
    }

    /* --- Original Code Ignored Below --- */
    const token = req.header('Authorization')?.split(' ')[1]; 
    if (!token) return res.status(401).json({ message: 'No token' });
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

exports.authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
};
