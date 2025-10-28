import React, { useEffect } from 'react';

const Toast = ({ id, message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), 5000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  const colors = {
    info: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  return (
    <div
      role="alert"
      className={`max-w-sm w-full text-white px-4 py-3 rounded shadow-md mb-2 ${colors[type] || colors.info}`}
    >
      <div className="flex items-center justify-between">
        <div>{message}</div>
        <button className="ml-4" onClick={() => onClose(id)} aria-label="Close notification">
          &times;
        </button>
      </div>
    </div>
  );
};

export default Toast;
