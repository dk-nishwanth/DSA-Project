import React from 'react';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/use-notifications';

export function NotificationDemo() {
  const { 
    addAdminNotification, 
    addCalendarNotification, 
    addSystemNotification 
  } = useNotifications();

  return (
    <div className="p-4 border rounded-md">
      <h3 className="text-lg font-medium mb-4">Notification Demo</h3>
      <div className="flex flex-col gap-2">
        <Button
          onClick={() => {
            addAdminNotification(
              'New Course Available', 
              'Advanced Algorithms course is now available. Check it out!'
            );
          }}
          variant="outline"
          size="sm"
        >
          Add Admin Notification
        </Button>
        
        <Button
          onClick={() => {
            addCalendarNotification(
              'Upcoming Study Session', 
              'Your scheduled study session for Dynamic Programming starts in 15 minutes.'
            );
          }}
          variant="outline"
          size="sm"
        >
          Add Calendar Notification
        </Button>
        
        <Button
          onClick={() => {
            addSystemNotification(
              'Achievement Unlocked', 
              'Congratulations! You have completed 10 coding challenges.'
            );
          }}
          variant="outline"
          size="sm"
        >
          Add System Notification
        </Button>
      </div>
    </div>
  );
}