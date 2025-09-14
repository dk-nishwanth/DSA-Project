import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/theme-toggle';
import { Badge } from '@/components/ui/badge';
import { ProfileButton } from '@/components/profile/profile-button';
import { dsaCategories } from '@/data/dsaTopics';
import { NotificationPanel } from '@/components/notification-panel';
import { useNotifications } from '@/contexts/notification-context';

export function Header() {
  const { notifications, markAsRead, markAllAsRead, clearAll } = useNotifications();
  return (
    <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between">
      <div className="flex items-center gap-6 flex-1">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-foreground">
            Data Structures & Algorithms
          </h2>
          <Badge variant="secondary" className="hidden sm:inline-flex">
            Interactive Learning Platform
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search topics..."
            className="pl-10 w-64"
          />
        </div>
        
        <ThemeToggle />
        
        <NotificationPanel 
          notifications={notifications}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
          onClearAll={clearAll}
        />
        
        <ProfileButton 
          onNavigateToProfile={() => window.location.href = '/profile'}
          onNavigateToProgress={() => window.location.href = '/profile?tab=progress'}
          onNavigateToAchievements={() => window.location.href = '/profile?tab=achievements'}
          onNavigateToSettings={() => window.location.href = '/profile?tab=settings'}
          onLogout={() => {
            // Handle logout logic here
            console.log('Logout clicked');
            
            // Clear any stored user data (localStorage, sessionStorage, etc.)
            localStorage.removeItem('user');
            localStorage.removeItem('authToken');
            sessionStorage.clear();
            
            // Clear any cookies if needed
            document.cookie.split(";").forEach(function(c) { 
              document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
            });
            
            // Navigate to login page
            window.location.href = '/login';
          }}
        />
      </div>
    </header>
  );
}