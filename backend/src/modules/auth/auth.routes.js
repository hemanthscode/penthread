/**
 * Authentication Routes
 * 
 * Defines all authentication-related endpoints.
 * 
 * @module modules/auth/routes
 */

import { Router } from 'express';
import * as authController from './auth.controller.js';
import validate from '../../middlewares/validate.middleware.js';
import authMiddleware from '../../middlewares/auth.middleware.js';
import { authRateLimiter } from '../../config/appConfig.js';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  refreshTokenSchema,
} from './auth.validators.js';

const router = Router();

// Public routes with strict rate limiting
router.post(
  '/register',
  authRateLimiter,
  validate(registerSchema),
  authController.register
);

router.post(
  '/login',
  authRateLimiter,
  validate(loginSchema),
  authController.login
);

router.post(
  '/forgot-password',
  authRateLimiter,
  validate(forgotPasswordSchema),
  authController.forgotPassword
);

router.post(
  '/reset-password',
  authRateLimiter,
  validate(resetPasswordSchema),
  authController.resetPassword
);

router.post(
  '/refresh',
  validate(refreshTokenSchema),
  authController.refreshToken
);

// Protected routes (require authentication)
router.use(authMiddleware(['admin', 'author', 'user']));

router.post('/logout', authController.logout);

router.get('/me', authController.getProfile);

router.patch(
  '/change-password',
  validate(changePasswordSchema),
  authController.changePassword
);

export default router;
