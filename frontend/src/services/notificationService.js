import { api } from '../utils';

export const fetchNotifications = () => api.get('/notifications');

export const markNotificationAsRead = (notificationId) =>
  api.patch(`/notifications/${notificationId}/read`);

export const markAllNotificationsRead = () => api.patch('/notifications/read-all');

export const deleteNotification = (notificationId) => api.delete(`/notifications/${notificationId}`);
