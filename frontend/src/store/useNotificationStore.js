import { create } from 'zustand';
import notificationService from '../services/notificationService';
import toast from 'react-hot-toast';

const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const response = await notificationService.getNotifications();
      if (response.success) {
        const notifications = response.data;
        const unreadCount = notifications.filter((n) => !n.isRead).length;
        set({ notifications, unreadCount, loading: false });
      }
    } catch (error) {
      set({ loading: false });
      // Only log error, don't show toast on page load
      console.error('Failed to fetch notifications:', error);
    }
  },

  markAsRead: async (notificationId) => {
    try {
      const response = await notificationService.markAsRead(notificationId);
      if (response.success) {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n._id === notificationId ? { ...n, isRead: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }));
      }
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  },

  markAllAsRead: async () => {
    try {
      const response = await notificationService.markAllAsRead();
      if (response.success) {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
          unreadCount: 0,
        }));
        toast.success('All notifications marked as read');
      }
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  },

  deleteNotification: async (notificationId) => {
    try {
      const response = await notificationService.deleteNotification(notificationId);
      if (response.success) {
        set((state) => {
          const notification = state.notifications.find((n) => n._id === notificationId);
          return {
            notifications: state.notifications.filter((n) => n._id !== notificationId),
            unreadCount: notification && !notification.isRead ? state.unreadCount - 1 : state.unreadCount,
          };
        });
        toast.success('Notification deleted');
      }
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  },
}));

export default useNotificationStore;
