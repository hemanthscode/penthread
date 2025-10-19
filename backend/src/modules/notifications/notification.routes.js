import { Router } from 'express';
import * as notificationController from './notification.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware(['admin', 'author', 'user']));

router.get('/', notificationController.getNotifications);
router.patch('/:id/read', notificationController.markAsRead);
router.patch('/read-all', notificationController.markAllAsRead);
router.delete('/:id', notificationController.deleteNotification);

export default router;
