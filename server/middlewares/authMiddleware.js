const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); 

// Middleware to authenticate the user
const authenticateUser  = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; 
    if (!token) {
        return res.status(403).json({ success: false, message: 'No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id); 
        if (!req.user) {
            return res.status(404).json({ success: false, message: 'User  not found' });
        }
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }
};

// Middleware to verify the token (for lightweight operations without user lookup)
const verifyToken = (req, res, next) => {
    try {
        const token = extractToken(req);

        if (!token) {
            return res.status(403).json({ success: false, message: 'No token provided.' });
        }

        // Verify the token and attach the decoded payload to the request
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
            }
            req.user = decoded;
            next();
        });
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ success: false, message: 'Failed to verify token.' });
    }
};

// Helper function to extract the token from the Authorization header
const extractToken = (req) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.split(' ')[1]; 
    }
    return null;
};

module.exports = { authenticateUser, verifyToken };
