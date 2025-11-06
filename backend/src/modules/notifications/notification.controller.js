/**
 * Notification Controller
 * 
 * Handles HTTP requests for notification endpoints.
 * 
 * @module modules/notifications/controller
 */

import * as notificationService from './notification.service.js';
import { sendSuccess, sendPaginatedResponse } from '../../utils/response.js';
import { getPaginationParams, buildPaginationMeta } from '../../utils/pagination.js';

/**
 * Get user notifications
 * GET /api/notifications
 */
export async function getNotifications(req, res, next) {
  try {
    const { page, limit } = getPaginationParams(req.query);
    const { unreadOnly } = req.query;

    const notifications = await notificationService.getUserNotifications(
      req.user._id,
      { page, limit, unreadOnly: unreadOnly === 'true' }
    );

    // Get total count
    const filter = { user: req.user._id };
    if (unreadOnly === 'true') filter.isRead = false;
    
    const total = await notificationService.getUserNotifications(req.user._id, {
      page: 1,
      limit: Number.MAX_SAFE_INTEGER,
      unreadOnly: unreadOnly === 'true',
    }).then(n => n.length);

    const pagination = buildPaginationMeta(page, limit, total);

    sendPaginatedResponse(
      res,
      notifications,
      pagination,
      'Notifications retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
}

/**
 * Get unread count
 * GET /api/notifications/unread-count
 */
export async function getUnreadCount(req, res, next) {
  try {
    const count = await notificationService.getUnreadCount(req.user._id);
    sendSuccess(res, { count }, 'Unread count retrieved successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Mark notification as read
 * PATCH /api/notifications/:id/read
 */
export async function markAsRead(req, res, next) {
  try {
    const notification = await notificationService.markAsRead(
      req.params.id,
      req.user._id
    );
    sendSuccess(res, notification, 'Notification marked as read');
  } catch (error) {
    next(error);
  }
}

/**
 * Mark all notifications as read
 * PATCH /api/notifications/read-all
 */
export async function markAllAsRead(req, res, next) {
  try {
    const result = await notificationService.markAllAsRead(req.user._id);
    sendSuccess(res, result, 'All notifications marked as read');
  } catch (error) {
    next(error);
  }
}

/**
 * Delete notification
 * DELETE /api/notifications/:id
 */
export async function deleteNotification(req, res, next) {
  try {
    await notificationService.deleteNotification(req.params.id, req.user._id);
    sendSuccess(res, null, 'Notification deleted successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Delete all read notifications
 * DELETE /api/notifications/read
 */
export async function deleteReadNotifications(req, res, next) {
  try {
    const result = await notificationService.deleteReadNotifications(req.user._id);
    sendSuccess(res, result, 'Read notifications deleted successfully');
  } catch (error) {
    next(error);
  }
}

export default {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteReadNotifications,
};
