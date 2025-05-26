const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Authentication token required' });
        }        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        
        // Check if it's a token expiration error
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                message: 'Token expired', 
                error: 'TokenExpiredError',
                tokenExpired: true 
            });
        }
        
        // Check if it's an invalid token error
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                message: 'Invalid token', 
                error: 'JsonWebTokenError',
                tokenInvalid: true 
            });
        }
        
        res.status(401).json({ message: 'Authentication failed', error: error.message });
    }
};

exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ message: 'Admin privileges required' });
    }
};
