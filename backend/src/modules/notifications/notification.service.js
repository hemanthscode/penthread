import Notification from './notification.model.js';

export async function getUserNotifications(userId) {
  return Notification.find({ user: userId }).sort({ createdAt: -1 });
}

export async function markAsRead(notificationId, userId) {
  const notification = await Notification.findOne({ _id: notificationId, user: userId });
  if (!notification) throw new Error('Notification not found');
  notification.isRead = true;
  await notification.save();
  return notification;
}

export async function markAllAsRead(userId) {
  await Notification.updateMany({ user: userId, isRead: false }, { isRead: true });
  return;
}

export async function deleteNotification(notificationId, userId) {
  const notification = await Notification.findOneAndDelete({ _id: notificationId, user: userId });
  if (!notification) throw new Error('Notification not found');
  return notification;
}

export async function createNotification(data) {
  const notification = new Notification(data);
  await notification.save();
  return notification;
}
