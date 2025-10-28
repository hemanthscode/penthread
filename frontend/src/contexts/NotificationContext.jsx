import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(
    (toast) => {
      setToasts((prev) => [...prev, { id: Date.now(), ...toast }]);
    },
    [setToasts]
  );

  const removeToast = useCallback(
    (id) => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    },
    [setToasts]
  );

  return (
    <NotificationContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
};
