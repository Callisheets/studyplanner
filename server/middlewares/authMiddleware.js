const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    try {
        // Extract token from the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(403).json({ success: false, message: 'No token provided or invalid format' });
        }

        const token = authHeader.split(' ')[1];

        // Verify the token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ success: false, message: 'Invalid or expired token' });
            }

            // Attach decoded user information to the request object
            req.user = decoded;
            console.log('Decoded user:', req.user);
            next();
        });
    } catch (error) {
        console.error('Error in token verification:', error);
        res.status(500).json({ success: false, message: 'Internal server error during token verification' });
    }
};

module.exports = { verifyToken };
