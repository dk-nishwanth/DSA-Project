import React from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Crown, Lock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface TopicAccessGuardProps {
  topicId: string;
  children: React.ReactNode;
}

export function TopicAccessGuard({ topicId, children }: TopicAccessGuardProps) {
  const { user, isPremium } = useAuth();

  // Premium users have unlimited access
  if (isPremium) {
    return <>{children}</>;
  }

  // Check if user has access to this topic
  const currentMonth = new Date().toISOString().slice(0, 7);
  const storageKey = `dsa-accessed-topics-${currentMonth}`;
  const accessedTopics = JSON.parse(localStorage.getItem(storageKey) || '[]');

  // If topic is already accessed this month, allow access
  if (accessedTopics.includes(topicId)) {
    return <>{children}</>;
  }

  // If user has remaining free topics, allow access and track it
  if (accessedTopics.length < 5) {
    // Track the topic access
    const updatedAccessed = [...accessedTopics, topicId];
    localStorage.setItem(storageKey, JSON.stringify(updatedAccessed));
    return <>{children}</>;
  }

  // Show upgrade prompt for free users who have exhausted their limit
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-xl font-bold">Topic Locked</CardTitle>
          <CardDescription>
            You've reached your monthly limit of 5 free topics. Upgrade to Premium for unlimited access!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-900">Premium Benefits</span>
            </div>
            <ul className="text-sm text-blue-800 space-y-1">
              <li className="flex items-center gap-2">
                <Zap className="h-3 w-3" />
                Unlimited access to all topics
              </li>
              <li className="flex items-center gap-2">
                <Zap className="h-3 w-3" />
                Advanced interactive visualizations
              </li>
              <li className="flex items-center gap-2">
                <Zap className="h-3 w-3" />
                Progress tracking & analytics
              </li>
              <li className="flex items-center gap-2">
                <Zap className="h-3 w-3" />
                Mock interview questions
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Premium - ₹50/month
            </Button>
            
            <Button variant="outline" className="w-full" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Your free topics will reset next month
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
