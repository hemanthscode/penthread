/**
 * Authentication Middleware
 * 
 * Verifies JWT tokens and enforces role-based access control.
 * Supports optional authentication for public endpoints.
 * 
 * @module middlewares/auth
 */

import { verifyToken } from '../utils/crypto.js';
import User from '../modules/auth/auth.model.js';
import AppError from '../utils/AppError.js';
import logger from '../config/logger.js';

/**
 * Authentication middleware factory
 * @param {string[]} allowedRoles - Array of allowed roles
 * @param {boolean} optional - Whether authentication is optional
 * @returns {Function} Express middleware
 */
export default function authMiddleware(allowedRoles = [], optional = false) {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      // Handle optional authentication
      if (optional && (!authHeader || !authHeader.startsWith('Bearer '))) {
        req.user = null;
        return next();
      }

      // Require authentication
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw AppError.unauthorized('Authorization header missing or invalid');
      }

      const token = authHeader.split(' ')[1];

      // Verify token
      let decoded;
      try {
        decoded = verifyToken(token);
      } catch (error) {
        // Handle optional auth token errors
        if (optional) {
          req.user = null;
          return next();
        }
        throw AppError.unauthorized(error.message);
      }

      // Fetch user from database
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        if (optional) {
          req.user = null;
          return next();
        }
        throw AppError.unauthorized('User not found');
      }

      if (!user.isActive) {
        throw AppError.forbidden('Account is deactivated');
      }

      // Check role authorization
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        throw AppError.forbidden('Insufficient permissions');
      }

      // Attach user to request
      req.user = user;
      
      // Add user ID to logger context
      if (req.logger) {
        req.logger = req.logger.child({ userId: user._id });
      }

      next();
    } catch (error) {
      if (optional && !error.isOperational) {
        req.user = null;
        return next();
      }
      next(error);
    }
  };
}
