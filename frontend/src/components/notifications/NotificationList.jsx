import React from 'react';
import NotificationItem from './NotificationItem';

const NotificationList = ({ notifications, onMarkRead = () => {}, onDelete = () => {} }) => {
  if (!notifications.length) return <p>No notifications.</p>;

  return (
    <div className="space-y-2">
      {notifications.map((note) => (
        <NotificationItem
          key={note._id}
          notification={note}
          onMarkRead={onMarkRead}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default NotificationList;
