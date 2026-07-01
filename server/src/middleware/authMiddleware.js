const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_change_me';

// Verify JWT Validity
exports.authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Adds { userId, role } to the request object
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is invalid or expired' });
    }
};

// Authorize specific roles
exports.authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: Access Denied' });
        }
        next();
    };
};