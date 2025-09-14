import { useNotifications as useNotificationsContext } from '@/contexts/notification-context';
import { NotificationType } from '@/components/notification-panel';

/**
 * Custom hook for working with notifications
 * @returns Notification utility functions and state
 */
export function useNotifications() {
  const context = useNotificationsContext();
  
  /**
   * Add an admin notification
   * @param title The notification title
   * @param message The notification message
   */
  const addAdminNotification = (title: string, message: string) => {
    context.addNotification({
      title,
      message,
      type: 'admin',
    });
  };

  /**
   * Add a calendar reminder notification
   * @param title The notification title
   * @param message The notification message
   */
  const addCalendarNotification = (title: string, message: string) => {
    context.addNotification({
      title,
      message,
      type: 'calendar',
    });
  };

  /**
   * Add a system notification
   * @param title The notification title
   * @param message The notification message
   */
  const addSystemNotification = (title: string, message: string) => {
    context.addNotification({
      title,
      message,
      type: 'system',
    });
  };

  return {
    ...context,
    addAdminNotification,
    addCalendarNotification,
    addSystemNotification,
  };
}