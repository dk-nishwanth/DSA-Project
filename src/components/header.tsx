import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/theme-toggle';
import { Badge } from '@/components/ui/badge';
import { ProfileButton } from '@/components/profile/profile-button';
import { dsaCategories } from '@/data/dsaTopics';
import { NotificationPanel } from '@/components/notification-panel';
import { useNotifications } from '@/contexts/notification-context';
import { useAuth } from '@/contexts/auth-context';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const { notifications, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
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
          onNavigateToProfile={() => navigate('/profile')}
          onNavigateToProgress={() => navigate('/profile?tab=progress')}
          onNavigateToAchievements={() => navigate('/profile?tab=achievements')}
          onNavigateToSettings={() => navigate('/profile?tab=settings')}
          onLogout={() => {
            console.log('Logout clicked');
            logout();
            navigate('/login');
          }}
        />
      </div>
    </header>
  );
}