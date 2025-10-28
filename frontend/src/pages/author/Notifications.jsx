import React from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import Loader from '../../components/common/Loader';
import NotificationList from '../../components/notifications/NotificationList';

const Notifications = () => {
  const { notifications, loading } = useNotifications();

  if (loading) return <Loader />;

  return (
    <section>
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>
      <NotificationList notifications={notifications} />
    </section>
  );
};

export default Notifications;
