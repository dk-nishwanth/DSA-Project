import { useState } from 'react';
import { User, Settings, BarChart3, Trophy, LogOut, ChevronDown, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { SAMPLE_PROFILE } from '@/data/profileData';
import { useAuth } from '@/contexts/auth-context';

interface ProfileButtonProps {
  onNavigateToProfile?: () => void;
  onNavigateToSettings?: () => void;
  onNavigateToProgress?: () => void;
  onNavigateToAchievements?: () => void;
  onLogout?: () => void;
}

export function ProfileButton({
  onNavigateToProfile,
  onNavigateToSettings,
  onNavigateToProgress,
  onNavigateToAchievements,
  onLogout
}: ProfileButtonProps) {
  const { user, isPremium, subscription } = useAuth();
  const profile = SAMPLE_PROFILE;
  const unlockedAchievements = profile.achievements.filter(a => a.unlockedDate).length;
  
  // Get subscription display info
  const getSubscriptionInfo = () => {
    if (!user || !subscription) return { plan: 'Free', color: 'bg-gray-500' };
    
    if (subscription.plan === 'premium') {
      if (subscription.endDate) {
        const endDate = new Date(subscription.endDate);
        const startDate = new Date(subscription.startDate);
        const diffTime = endDate.getTime() - startDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays >= 365) {
          return { plan: '₹500/year', color: 'bg-gradient-to-r from-purple-500 to-pink-500' };
        } else {
          return { plan: '₹50/month', color: 'bg-gradient-to-r from-blue-500 to-cyan-500' };
        }
      }
      return { plan: 'Premium', color: 'bg-gradient-to-r from-amber-500 to-orange-500' };
    }
    
    return { plan: 'Free', color: 'bg-gray-500' };
  };
  
  const subscriptionInfo = getSubscriptionInfo();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile.avatar} alt={profile.username} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold">
              {profile.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium leading-none">
                {user?.name || profile.username}
              </p>
              {isPremium && <Crown className="w-3 h-3 text-amber-500" />}
            </div>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email || profile.email}
            </p>
            <Badge 
              className={`text-xs ${subscriptionInfo.color} text-white border-0 w-fit`}
            >
              {subscriptionInfo.plan}
            </Badge>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Quick Stats */}
        <div className="px-2 py-1.5">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="font-semibold text-blue-600">{profile.statistics.completedTopics}</div>
              <div className="text-muted-foreground">Topics</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-green-600">{profile.statistics.totalQuizzes}</div>
              <div className="text-muted-foreground">Quizzes</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-purple-600">{unlockedAchievements}</div>
              <div className="text-muted-foreground">Achievements</div>
            </div>
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={onNavigateToProfile}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={onNavigateToProgress}>
          <BarChart3 className="mr-2 h-4 w-4" />
          <span>Progress</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={onNavigateToAchievements}>
          <Trophy className="mr-2 h-4 w-4" />
          <span>Achievements</span>
          {unlockedAchievements > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {unlockedAchievements}
            </Badge>
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={onNavigateToSettings}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => {
          if (window.confirm('Are you sure you want to log out?')) {
            onLogout?.();
          }
        }}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
