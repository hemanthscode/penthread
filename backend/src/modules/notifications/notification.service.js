/**
 * Notification Service
 * 
 * Handles all notification business logic.
 * 
 * @module modules/notifications/service
 */

import Notification from './notification.model.js';
import AppError from '../../utils/AppError.js';
import logger from '../../config/logger.js';

/**
 * Creates a new notification
 */
export async function createNotification(data) {
  const { user, title, message, type = 'info', link = '', metadata = {} } = data;

  const notification = new Notification({
    user,
    title,
    message,
    type,
    link,
    metadata,
  });

  await notification.save();

  logger.info(`Notification created for user ${user}`);

  return notification;
}

/**
 * Gets all notifications for a user
 */
export async function getUserNotifications(userId, options = {}) {
  const { page = 1, limit = 20, unreadOnly = false } = options;
  const skip = (page - 1) * limit;

  const filter = { user: userId };
  if (unreadOnly) {
    filter.isRead = false;
  }

  const notifications = await Notification.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return notifications;
}

/**
 * Gets unread count for a user
 */
export async function getUnreadCount(userId) {
  return Notification.getUnreadCount(userId);
}

/**
 * Marks a notification as read
 */
export async function markAsRead(notificationId, userId) {
  const notification = await Notification.findOne({
    _id: notificationId,
    user: userId,
  });

  if (!notification) {
    throw AppError.notFound('Notification not found');
  }

  if (notification.isRead) {
    return notification;
  }

  notification.isRead = true;
  await notification.save();

  logger.info(`Notification ${notificationId} marked as read`);

  return notification;
}

/**
 * Marks all notifications as read for a user
 */
export async function markAllAsRead(userId) {
  const result = await Notification.markAllReadForUser(userId);

  logger.info(`Marked ${result.modifiedCount} notifications as read for user ${userId}`);

  return { count: result.modifiedCount };
}

/**
 * Deletes a notification
 */
export async function deleteNotification(notificationId, userId) {
  const notification = await Notification.findOneAndDelete({
    _id: notificationId,
    user: userId,
  });

  if (!notification) {
    throw AppError.notFound('Notification not found');
  }

  logger.info(`Notification ${notificationId} deleted`);

  return notification;
}

/**
 * Deletes all read notifications for a user
 */
export async function deleteReadNotifications(userId) {
  const result = await Notification.deleteMany({
    user: userId,
    isRead: true,
  });

  logger.info(`Deleted ${result.deletedCount} read notifications for user ${userId}`);

  return { count: result.deletedCount };
}

/**
 * Bulk creates notifications for multiple users
 */
export async function createBulkNotifications(users, notificationData) {
  const notifications = users.map(userId => ({
    user: userId,
    ...notificationData,
  }));

  const result = await Notification.insertMany(notifications);

  logger.info(`Created ${result.length} bulk notifications`);

  return result;
}

export default {
  createNotification,
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteReadNotifications,
  createBulkNotifications,
};
