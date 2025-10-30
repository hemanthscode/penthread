import { Router } from 'express';
import * as userController from './user.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import { updateUserSchema, updateRoleSchema, updateStatusSchema, updateProfileSchema } from './user.validators.js';

const router = Router();

// Admin-only routes
router.get('/', authMiddleware(['admin']), userController.getUsers);
router.get('/:userId', authMiddleware(['admin']), userController.getUser);
router.patch('/:userId', authMiddleware(['admin']), validate(updateUserSchema), userController.updateUser);
router.delete('/:userId', authMiddleware(['admin']), userController.deleteUser);
router.patch('/:userId/role', authMiddleware(['admin']), validate(updateRoleSchema), userController.updateRole);
router.patch('/:userId/status', authMiddleware(['admin']), validate(updateStatusSchema), userController.updateStatus);

// Authenticated (any role) user profile routes
router.get('/profile/me', authMiddleware(['admin', 'author', 'user']), userController.getProfile);
router.patch('/profile/me', authMiddleware(['admin', 'author', 'user']), validate(updateProfileSchema), userController.updateProfile);

export default router;
