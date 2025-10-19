// Utilities for notification formatting or processing can go here

export function formatNotification(notification) {
  return {
    id: notification._id,
    title: notification.title,
    message: notification.message,
    isRead: notification.isRead,
    link: notification.link,
    createdAt: notification.createdAt,
  };
}
