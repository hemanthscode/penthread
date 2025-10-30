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
