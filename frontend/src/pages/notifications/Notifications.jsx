import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, Check, Trash2, CheckCheck } from 'lucide-react';
import Container from '../../components/layout/Container';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import notificationService from '../../services/notificationService';
import { formatRelativeTime } from '../../utils/helpers';
import toast from 'react-hot-toast';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationService.getNotifications();
      if (response.success) {
        setNotifications(response.data);
      }
    } catch (error) {
      toast.error('Failed to load notifications');
      console.error('Fetch notifications error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await notificationService.markAsRead(notificationId);
      if (response.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
        );
        toast.success('Marked as read');
      }
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await notificationService.markAllAsRead();
      if (response.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        toast.success('All notifications marked as read');
      }
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      const response = await notificationService.deleteNotification(notificationId);
      if (response.success) {
        setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
        toast.success('Notification deleted');
      }
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const handleNotificationClick = (notification) => {
    if (notification.link) {
      if (!notification.isRead) {
        handleMarkAsRead(notification._id);
      }
      navigate(notification.link);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Container className="py-8">
      <div className="flex items-center justify-between mb-6">
        <PageHeader
          title="Notifications"
          description={`You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`}
          icon={Bell}
        />
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" icon={CheckCheck} onClick={handleMarkAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>

      {loading ? (
        <Loader />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          message="You're all caught up! Check back later for updates."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((notification, index) => (
            <motion.div
              key={notification._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={`cursor-pointer transition-all ${
                  !notification.isRead
                    ? 'bg-blue-50 dark:bg-blue-900/10 border-l-4 border-l-primary-600'
                    : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <span className="h-2 w-2 bg-primary-600 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {formatRelativeTime(notification.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Check}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification._id);
                        }}
                        title="Mark as read"
                      />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Trash2}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notification._id);
                      }}
                      title="Delete"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </Container>
  );
};

export default Notifications;
