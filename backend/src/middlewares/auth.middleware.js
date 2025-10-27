import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import User from '../modules/auth/auth.model.js';

// Role-based authentication and authorization middleware
export default function authMiddleware(allowedRoles = []) {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header missing or invalid' });
      }
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, config.jwtSecret);
      const user = await User.findById(decoded.id).select('-password');
      if (!user || !user.isActive) {
        return res.status(401).json({ message: 'User not found or inactive' });
      }
      if (allowedRoles.length && !allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
}
