import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProfileButton } from '@/components/profile/profile-button';
import { TopicSearch } from '@/components/topic-search';
import { NotificationPanel } from '@/components/notification-panel';
import { useNotifications } from '@/contexts/notification-context';
import { useAuth } from '@/contexts/auth-context';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const { notifications, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  
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
        {/* Desktop Search */}
        <div className="hidden sm:block">
          <TopicSearch 
            placeholder="Search topics..."
            className="w-64"
          />
        </div>
        
        {/* Mobile Search Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowMobileSearch(!showMobileSearch)}
          className="sm:hidden"
          title="Search topics"
        >
          {showMobileSearch ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
        </Button>
        
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
      
      {/* Mobile Search Dropdown */}
      {showMobileSearch && (
        <div className="absolute top-16 left-0 right-0 bg-card border-b border-border p-4 sm:hidden z-50">
          <TopicSearch 
            placeholder="Search topics..."
            className="w-full"
          />
        </div>
      )}
    </header>
  );
}