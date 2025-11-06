/**
 * Notification Routes
 * 
 * Defines all notification-related endpoints.
 * Routes are ordered to prevent conflicts (specific before parameterized).
 * 
 * @module modules/notifications/routes
 */

import { Router } from 'express';
import * as notificationController from './notification.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware(['admin', 'author', 'user']));

// ==================== SPECIFIC ROUTES (MUST BE FIRST) ====================

// Get unread count - /notifications/unread-count
router.get('/unread-count', notificationController.getUnreadCount);

// Mark all as read - PATCH /notifications/read-all
router.patch('/read-all', notificationController.markAllAsRead);

// Delete all read notifications - DELETE /notifications/read
router.delete('/read', notificationController.deleteReadNotifications);

// ==================== GENERAL ROUTES ====================

// Get all notifications - GET /notifications
router.get('/', notificationController.getNotifications);

// ==================== PARAMETERIZED ROUTES (MUST BE LAST) ====================

// Mark single notification as read - PATCH /notifications/:id/read
router.patch('/:id/read', notificationController.markAsRead);

// Delete single notification - DELETE /notifications/:id
router.delete('/:id', notificationController.deleteNotification);

export default router;
