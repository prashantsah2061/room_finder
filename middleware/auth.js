const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const auth = (req, res, next) => {
    try {
        // Check for token in Authorization header
        const headerToken = req.header('Authorization')?.replace('Bearer ', '');
        
        // Check for token in cookies
        const cookieToken = req.cookies?.token;
        
        // Use token from header or cookie
        const token = headerToken || cookieToken;
        
        if (!token) {
            return res.status(401).json({ message: 'No authentication token, access denied' });
        }

        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token verification failed, authorization denied' });
    }
};

module.exports = auth; 