// src/hooks/useNotifications.js
import { useState, useEffect } from 'react';
import * as notificationService from '../services/notificationService';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationService.fetchNotifications();
      setNotifications(response.data);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    await notificationService.markNotificationAsRead(id);
    await fetchNotifications();
  };

  const markAllAsRead = async () => {
    await notificationService.markAllNotificationsRead();
    await fetchNotifications();
  };

  const deleteNotification = async (id) => {
    await notificationService.deleteNotification(id);
    await fetchNotifications();
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };
};
