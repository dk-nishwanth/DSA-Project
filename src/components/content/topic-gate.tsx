import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Crown, Zap, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useNavigate } from 'react-router-dom';

interface TopicGateProps {
  topicId: string;
  topicTitle: string;
  topicDescription: string;
  isFirstTopic?: boolean;
  children: React.ReactNode;
}

export function TopicGate({ 
  topicId, 
  topicTitle, 
  topicDescription, 
  isFirstTopic = false, 
  children 
}: TopicGateProps) {
  const { user, isPremium } = useAuth();
  const navigate = useNavigate();

  // Allow access if user is premium or it's the first topic (free trial)
  const hasAccess = isPremium || isFirstTopic;

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <Card className="border-2 border-dashed border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="flex items-center justify-center gap-2 text-xl">
          <Crown className="w-5 h-5 text-amber-500" />
          Premium Content Locked
        </CardTitle>
        <CardDescription className="text-base">
          {topicTitle}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="text-center space-y-6">
        <div className="p-4 bg-white/60 rounded-lg">
          <p className="text-sm text-muted-foreground mb-3">
            {topicDescription}
          </p>
          <Badge variant="secondary" className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800">
            <Zap className="w-3 h-3 mr-1" />
            Premium Feature
          </Badge>
        </div>

        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-2">🔓 Unlock this topic and get:</p>
            <ul className="text-left space-y-1 max-w-sm mx-auto">
              <li>• Interactive step-by-step visualizations</li>
              <li>• Practice problems with detailed solutions</li>
              <li>• Real interview questions from top companies</li>
              <li>• Progress tracking and analytics</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={() => navigate('/subscription-payment')}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Premium
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard?trial=true')}
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Continue Free Trial
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            <p>💡 <strong>Free Trial:</strong> Access the first topic to explore our platform</p>
            <p>💳 <strong>Premium:</strong> Only ₹50/month or ₹500/year (Save ₹100)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper component for topic list items
export function TopicListItem({ 
  topic, 
  index, 
  onClick 
}: { 
  topic: any; 
  index: number; 
  onClick: () => void; 
}) {
  const { isPremium } = useAuth();
  const isFirstTopic = index === 0;
  const hasAccess = isPremium || isFirstTopic;

  return (
    <div 
      className={`p-4 border rounded-lg cursor-pointer transition-all ${
        hasAccess 
          ? 'hover:shadow-md hover:border-primary/50 bg-white' 
          : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              hasAccess 
                ? 'bg-primary text-white' 
                : 'bg-amber-200 text-amber-800'
            }`}>
              {index + 1}
            </div>
            <div>
              <h3 className={`font-medium ${!hasAccess ? 'text-amber-800' : ''}`}>
                {topic.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {topic.description}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isFirstTopic && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Free
            </Badge>
          )}
          {!hasAccess && !isFirstTopic && (
            <div className="flex items-center gap-1">
              <Lock className="w-4 h-4 text-amber-600" />
              <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                Premium
              </Badge>
            </div>
          )}
          {hasAccess && (
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </div>
    </div>
  );
}
