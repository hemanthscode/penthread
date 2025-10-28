import React from 'react';

const NotificationItem = ({ notification, onMarkRead, onDelete }) => (
  <div
    className={`p-3 rounded border ${
      notification.isRead ? 'bg-gray-100' : 'bg-white border-blue-300'
    } flex justify-between items-center`}
  >
    <p>{notification.message}</p>
    <div className="flex space-x-2">
      {!notification.isRead && (
        <button
          onClick={() => onMarkRead(notification._id)}
          className="text-blue-500 hover:underline text-sm"
        >
          Mark as read
        </button>
      )}
      <button
        onClick={() => onDelete(notification._id)}
        className="text-red-500 hover:underline text-sm"
      >
        Delete
      </button>
    </div>
  </div>
);

export default NotificationItem;
