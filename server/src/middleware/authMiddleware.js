const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

// Verify JWT Validity (BYPASSED FOR DEMO)
exports.authenticate = (req, res, next) => {
    // BYPASS MODE: Always inject a valid fake user and move to the next function immediately
    req.user = { 
        id: 1, 
        userId: 1,         // Added both id and userId just in case your controllers look for either name
        email: "admin@test.com", 
        role: "ADMIN" 
    };
    return next(); 

    /* -------------------------------------------------------------
       Your original token verification code is kept safely below,
       but the server will ignore it because of the 'return next()' above.
       ------------------------------------------------------------- */
    const token = req.header('Authorization')?.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is invalid or expired' });
    }
};

// Authorize specific roles (This will now always pass because role is "ADMIN")
exports.authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: Access Denied' });
        }
        next();
    };
};
