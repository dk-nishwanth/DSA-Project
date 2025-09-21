import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import { GamificationEngine } from '@/services/gamification-engine';
import { toast } from 'sonner';

export function GamificationTest() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const gamification = GamificationEngine.getInstance();

  const loadUserProfile = () => {
    if (!user) {
      toast.error('Please log in first');
      return;
    }
    
    const profile = gamification.getUserProfile(user.id);
    setUserProfile(profile);
    toast.success('User profile loaded');
  };

  const awardTestXP = () => {
    if (!user) {
      toast.error('Please log in first');
      return;
    }

    const xpGain = gamification.awardXP(user.id, 50, 'Test XP Award');
    toast.success(`Awarded ${xpGain.amount} XP!`);
    
    // Reload profile to see changes
    loadUserProfile();
  };

  const checkAchievements = () => {
    if (!user) {
      toast.error('Please log in first');
      return;
    }

    const achievements = gamification.checkAchievements(user.id, 'quiz_complete', { score: 90 });
    if (achievements.length > 0) {
      toast.success(`Unlocked ${achievements.length} achievement(s)!`);
    } else {
      toast.info('No new achievements unlocked');
    }
    
    // Reload profile to see changes
    loadUserProfile();
  };

  const updateStreak = () => {
    if (!user) {
      toast.error('Please log in first');
      return;
    }

    const streak = gamification.updateStreak(user.id);
    toast.success(`Streak updated! Current: ${streak.current} days`);
    
    // Reload profile to see changes
    loadUserProfile();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🎮 Gamification System Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <Button onClick={loadUserProfile}>
              Load User Profile
            </Button>
            <Button onClick={awardTestXP} variant="secondary">
              Award 50 XP
            </Button>
            <Button onClick={checkAchievements} variant="secondary">
              Check Achievements
            </Button>
            <Button onClick={updateStreak} variant="secondary">
              Update Streak
            </Button>
          </div>

          {userProfile && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">XP System</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Current XP:</span>
                      <Badge variant="secondary">{userProfile.xp.currentXP}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Total XP Earned:</span>
                      <Badge variant="secondary">{userProfile.xp.totalXPEarned}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Level:</span>
                      <Badge>{userProfile.xp.level}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>XP to Next Level:</span>
                      <Badge variant="outline">{userProfile.xp.xpToNextLevel}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Achievements & Streak</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Achievements:</span>
                      <Badge variant="secondary">{userProfile.achievements.length}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Badges:</span>
                      <Badge variant="secondary">{userProfile.badges.length}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Current Streak:</span>
                      <Badge>{userProfile.streak.current} days</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Best Streak:</span>
                      <Badge variant="outline">{userProfile.streak.best} days</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {userProfile.achievements.length > 0 && (
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Achievements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {userProfile.achievements.slice(-5).map((achievement: any, index: number) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {achievement.icon} {achievement.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {!user && (
            <div className="text-center p-8 text-muted-foreground">
              Please log in to test the gamification system
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
