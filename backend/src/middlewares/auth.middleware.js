import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import User from '../modules/auth/auth.model.js';

export default function authMiddleware(allowedRoles = [], optional = false) {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      
      // If optional auth and no token, continue as guest
      if (optional && (!authHeader || !authHeader.startsWith('Bearer '))) {
        req.user = null;
        return next();
      }

      // If not optional and no token, reject
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header missing or invalid' });
      }

      const token = authHeader.split(' ')[1];
      
      try {
        const decoded = jwt.verify(token, config.jwtSecret);

        const user = await User.findById(decoded.id).select('-password');
        
        // If optional auth and user not found/inactive, continue as guest
        if (optional && (!user || !user.isActive)) {
          req.user = null;
          console.log('⚠️ Invalid token, continuing as guest'); // DEBUG
          return next();
        }

        // If not optional and user not found/inactive, reject
        if (!user || !user.isActive) {
          return res.status(401).json({ message: 'User not found or inactive' });
        }

        // Check roles if specified
        if (allowedRoles.length && !allowedRoles.includes(user.role)) {
          return res.status(403).json({ message: 'Access denied' });
        }

        req.user = user;
        console.log('✅ User authenticated:', user._id, user.email); // DEBUG
        next();
      } catch (tokenError) {
        // If optional auth and token invalid, continue as guest
        if (optional) {
          req.user = null;
          console.log('⚠️ Token verification failed, continuing as guest'); // DEBUG
          return next();
        }
        // If not optional, reject
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
    } catch (error) {
      console.error('Auth middleware error:', error);
      
      // If optional auth, continue as guest on any error
      if (optional) {
        req.user = null;
        return next();
      }
      
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
}
