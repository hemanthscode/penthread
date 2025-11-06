/**
 * User Routes
 * 
 * Defines all user management endpoints.
 * 
 * @module modules/users/routes
 */

import { Router } from 'express';
import * as userController from './user.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import {
  updateUserSchema,
  updateProfileSchema,
  updateRoleSchema,
  updateStatusSchema,
  getUsersQuerySchema,
} from './user.validators.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware(['admin', 'author', 'user']));

// Own profile routes (any authenticated user)
router.get('/profile/me', userController.getProfile);
router.patch(
  '/profile/me',
  validate(updateProfileSchema),
  userController.updateProfile
);

// Admin-only routes
router.get(
  '/',
  authMiddleware(['admin']),
  validate(getUsersQuerySchema, 'query'),
  userController.getUsers
);

router.get(
  '/:userId',
  authMiddleware(['admin']),
  userController.getUser
);

router.patch(
  '/:userId',
  authMiddleware(['admin']),
  validate(updateUserSchema),
  userController.updateUser
);

router.delete(
  '/:userId',
  authMiddleware(['admin']),
  userController.deleteUser
);

router.patch(
  '/:userId/role',
  authMiddleware(['admin']),
  validate(updateRoleSchema),
  userController.updateRole
);

router.patch(
  '/:userId/status',
  authMiddleware(['admin']),
  validate(updateStatusSchema),
  userController.updateStatus
);

export default router;
