import React, { createContext, useState, useCallback, useContext } from "react";

const NotificationContext = createContext();

export const useNotification = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null); // { message, type }

  const showNotification = useCallback((message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000); // Hide after 3 seconds
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}
    </NotificationContext.Provider>
  );
};

// This is the actual UI component for the notification
const Notification = ({ message, type }) => {
  return <div className={`notification ${type}`}>{message}</div>;
};
