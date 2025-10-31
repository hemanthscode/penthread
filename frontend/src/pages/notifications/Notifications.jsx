import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, Trash2, CheckCheck } from 'lucide-react';
import useNotifications from '../../hooks/useNotifications';
import Container from '../../components/layout/Container';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { formatRelativeTime } from '../../utils/helpers';

const Notifications = () => {
  const { notifications, loading, markAsRead, markAllAsRead, deleteNotification } =
    useNotifications();
  const [deletingId, setDeletingId] = useState(null);

  const handleMarkAsRead = async (id) => {
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    await deleteNotification(id);
    setDeletingId(null);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Container className="py-8">
      <PageHeader
        title="Notifications"
        description={`You have ${unreadCount} unread notifications`}
        icon={Bell}
        action={unreadCount > 0 ? 'Mark All as Read' : null}
        onAction={unreadCount > 0 ? handleMarkAllAsRead : null}
      />

      {loading ? (
        <Loader />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          message="You're all caught up! Check back later for updates."
        />
      ) : (
        <div className="space-y-4">
          {notifications.map((notification, index) => (
            <motion.div
              key={notification._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={`${
                  !notification.isRead ? 'border-l-4 border-l-primary-600' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                        {notification.title}
                      </h3>
                      {!notification.isRead && <Badge variant="primary" size="sm">New</Badge>}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
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
                        onClick={() => handleMarkAsRead(notification._id)}
                      />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Trash2}
                      onClick={() => handleDelete(notification._id)}
                      loading={deletingId === notification._id}
                      className="text-red-600 hover:text-red-700"
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
