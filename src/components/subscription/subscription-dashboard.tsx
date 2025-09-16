import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, CreditCard, TrendingUp, Award, Clock, Target } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { format } from 'date-fns';

export function SubscriptionDashboard() {
  const { user, subscription, isPremium } = useAuth();

  if (!user || !subscription) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-8">
            <p>No subscription information available.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = user.progress;
  const daysUntilExpiry = Math.ceil(
    (new Date(subscription.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Track your learning progress and manage your subscription</p>
        </div>
        <Badge variant={isPremium ? 'default' : 'secondary'} className="text-sm">
          {subscription.plan.toUpperCase()} PLAN
        </Badge>
      </div>

      {/* Subscription Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Subscription Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Current Plan</p>
              <p className="font-semibold capitalize">{subscription.plan}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                {subscription.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {subscription.status === 'active' ? 'Expires On' : 'Expired On'}
              </p>
              <p className="font-semibold flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {format(new Date(subscription.endDate), 'MMM dd, yyyy')}
              </p>
              {daysUntilExpiry > 0 && (
                <p className="text-xs text-muted-foreground">
                  {daysUntilExpiry} days remaining
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Progress */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="w-4 h-4" />
              Topics Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress.topicsCompleted.length}</div>
            <p className="text-xs text-muted-foreground">out of 100+ topics</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Award className="w-4 h-4" />
              Challenges Solved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress.challengesSolved.length}</div>
            <p className="text-xs text-muted-foreground">coding problems</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Time Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor(progress.totalTimeSpent / 60)}h</div>
            <p className="text-xs text-muted-foreground">learning time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress.currentStreak}</div>
            <p className="text-xs text-muted-foreground">days in a row</p>
          </CardContent>
        </Card>
      </div>

      {/* Skill Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Skill Progress</CardTitle>
          <CardDescription>Your mastery level in different DSA topics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(progress.skillLevel).map(([skill, level]) => {
            if (skill === 'overall') return null;
            return (
              <div key={skill} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="capitalize font-medium">
                    {skill.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span>{level}%</span>
                </div>
                <Progress value={level} className="h-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      {progress.achievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Achievements</CardTitle>
            <CardDescription>Your latest learning milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {progress.achievements.slice(0, 3).map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div>
                    <p className="font-medium">{achievement.title}</p>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(achievement.unlockedAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline">Continue Learning</Button>
            <Button variant="outline">Take Practice Test</Button>
            <Button variant="outline">View All Topics</Button>
            {!isPremium && (
              <Button>Upgrade to Premium</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
