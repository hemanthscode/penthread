import api from './api';

class NotificationService {
  async getNotifications(params = {}) {
    // params: page, limit, unreadOnly etc
    const response = await api.get('/notifications', { params });
    return response.data;
  }

  async markAsRead(notificationId) {
    const response = await api.patch(`/notifications/${notificationId}/read`);
    return response.data;
  }

  async markAllAsRead() {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  }

  async deleteNotification(notificationId) {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  }

  async deleteReadNotifications() {
    const response = await api.delete('/notifications/read');
    return response.data;
  }

  async getUnreadCount() {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  }
}

export default new NotificationService();
