import { useNotifications } from '@/contexts/notification-context';
import { NotificationType } from '@/components/notification-panel';

/**
 * Helper function to add an admin notification
 * @param title The notification title
 * @param message The notification message
 */
export const addAdminNotification = (title: string, message: string) => {
  const { addNotification } = useNotifications();
  addNotification({
    title,
    message,
    type: 'admin',
  });
};

/**
 * Helper function to add a calendar reminder notification
 * @param title The notification title
 * @param message The notification message
 */
export const addCalendarNotification = (title: string, message: string) => {
  const { addNotification } = useNotifications();
  addNotification({
    title,
    message,
    type: 'calendar',
  });
};

/**
 * Helper function to add a system notification
 * @param title The notification title
 * @param message The notification message
 */
export const addSystemNotification = (title: string, message: string) => {
  const { addNotification } = useNotifications();
  addNotification({
    title,
    message,
    type: 'system',
  });
};