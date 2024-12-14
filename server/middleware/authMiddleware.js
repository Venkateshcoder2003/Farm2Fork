// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const JWT_SECRET = process.env.JWT_SECRET || '+_)(*&^%$#@!@#$%^&*()__&^%$#@@#$%^&*(';

// const authMiddleware = async (req, res, next) => {
//     try {
//         const token = req.header('Authorization').replace('Bearer ', '');
//         const decoded = jwt.verify(token, JWT_SECRET);

//         const user = await User.findOne({
//             _id: decoded.userId,
//         });

//         if (!user) {
//             throw new Error();
//         }

//         req.token = token;
//         req.user = user;
//         next();
//     } catch (error) {
//         res.status(401).send({ error: 'Please authenticate.' });
//     }
// };

// module.exports = authMiddleware;


const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const authMiddleware = async (req, res, next) => {
    // Check for token in Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }

    // Extract token (expecting "Bearer <token>")
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Invalid token format' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Find the user by ID from the token
        const user = await User.findById(decoded.userId).select('-pin');

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Attach user information to the request object
        req.user = {
            id: user._id,
            name: user.name,
            mobileNumber: user.mobileNumber,
            role: user.role
        };

        // Continue to the next middleware or route handler
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Generic error handling
        console.error('Authentication error:', error);
        return res.status(500).json({ message: 'Authentication failed', error: error.message });
    }
};

module.exports = authMiddleware;