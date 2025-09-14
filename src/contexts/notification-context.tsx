import React, { createContext, useContext, useState, useEffect } from 'react';
import { Notification, NotificationType } from '@/components/notification-panel';

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'date' | 'read'>) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

// Mock data for initial notifications
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Assignment Available',
    message: 'Check out the new Binary Trees assignment in your dashboard.',
    type: 'admin',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
  },
  {
    id: '2',
    title: 'Study Session Reminder',
    message: 'Your scheduled study session for Graph Algorithms starts in 30 minutes.',
    type: 'calendar',
    date: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
  },
  {
    id: '3',
    title: 'Progress Update',
    message: 'You have completed 75% of the Data Structures course. Keep it up!',
    type: 'system',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
  },
];

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        // Parse the saved notifications and convert date strings back to Date objects
        const parsed = JSON.parse(savedNotifications);
        const withDates = parsed.map((n: any) => ({
          ...n,
          date: new Date(n.date),
        }));
        setNotifications(withDates);
      } catch (error) {
        console.error('Failed to parse notifications from localStorage', error);
        setNotifications(mockNotifications);
      }
    } else {
      // Use mock data for initial state if nothing in localStorage
      setNotifications(mockNotifications);
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notification: Omit<Notification, 'id' | 'date' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      date: new Date(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}