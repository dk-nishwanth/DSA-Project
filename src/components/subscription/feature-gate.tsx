import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Crown, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

interface FeatureGateProps {
  feature: string;
  title: string;
  description: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onUpgrade?: () => void;
}

export function FeatureGate({ 
  feature, 
  title, 
  description, 
  children, 
  fallback,
  onUpgrade 
}: FeatureGateProps) {
  const { checkFeatureAccess, isPremium } = useAuth();
  
  const hasAccess = checkFeatureAccess(feature);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <Card className="border-2 border-dashed border-muted-foreground/25">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Crown className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="flex items-center justify-center gap-2">
          <Lock className="w-4 h-4" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <Badge variant="secondary" className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 text-yellow-700 dark:text-yellow-300">
          <Zap className="w-3 h-3 mr-1" />
          Premium Feature
        </Badge>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Unlock this feature and many more with Premium
          </p>
          <Button onClick={onUpgrade} className="w-full">
            Upgrade to Premium - ₹50/month
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Usage examples for different features
export function PremiumVisualizationGate({ children, onUpgrade }: { children: React.ReactNode; onUpgrade?: () => void }) {
  return (
    <FeatureGate
      feature="advanced_visualizations"
      title="Advanced Visualizations"
      description="Interactive step-by-step algorithm execution with detailed explanations"
      onUpgrade={onUpgrade}
    >
      {children}
    </FeatureGate>
  );
}

export function PracticeProblemsGate({ children, onUpgrade }: { children: React.ReactNode; onUpgrade?: () => void }) {
  return (
    <FeatureGate
      feature="practice_problems"
      title="Unlimited Practice Problems"
      description="Access to our complete library of coding challenges and interview questions"
      onUpgrade={onUpgrade}
    >
      {children}
    </FeatureGate>
  );
}

export function ProgressTrackingGate({ children, onUpgrade }: { children: React.ReactNode; onUpgrade?: () => void }) {
  return (
    <FeatureGate
      feature="progress_tracking"
      title="Progress Analytics"
      description="Detailed insights into your learning journey with personalized recommendations"
      onUpgrade={onUpgrade}
    >
      {children}
    </FeatureGate>
  );
}
