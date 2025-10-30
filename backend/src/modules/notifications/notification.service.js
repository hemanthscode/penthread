import Notification from './notification.model.js';

/**
 * Get all notifications for a user sorted newest first
 */
export async function getUserNotifications(userId) {
  return Notification.find({ user: userId }).sort({ createdAt: -1 });
}

/**
 * Mark a notification as read by owner
 */
export async function markAsRead(notificationId, userId) {
  const notification = await Notification.findOne({ _id: notificationId, user: userId });
  if (!notification) throw new Error('Notification not found');
  notification.isRead = true;
  await notification.save();
  return notification;
}

/**
 * Mark all unread notifications as read for user
 */
export async function markAllAsRead(userId) {
  await Notification.updateMany({ user: userId, isRead: false }, { isRead: true });
}

/**
 * Delete notification by owner
 */
export async function deleteNotification(notificationId, userId) {
  const notification = await Notification.findOneAndDelete({ _id: notificationId, user: userId });
  if (!notification) throw new Error('Notification not found');
  return notification;
}

/**
 * Create a new notification
 */
export async function createNotification(data) {
  const notification = new Notification(data);
  await notification.save();
  return notification;
}
