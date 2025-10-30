import { Router } from 'express';
import * as authController from './auth.controller.js';
import validate from '../../middlewares/validate.middleware.js';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema } from './auth.validators.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authMiddleware(['admin', 'author', 'user']), authController.logout);
router.post('/refresh', authController.refreshToken);

router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);

router.get('/me', authMiddleware(['admin', 'author', 'user']), authController.getProfile);
router.patch('/change-password', authMiddleware(['admin', 'author', 'user']), validate(changePasswordSchema), authController.changePassword);

export default router;
