import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star } from 'lucide-react';
import { SUBSCRIPTION_PLANS, PaymentPlan } from '@/types/subscription';
import { useAuth } from '@/contexts/auth-context';

interface PricingPlansProps {
  onSelectPlan: (plan: PaymentPlan) => void;
}

export function PricingPlans({ onSelectPlan }: PricingPlansProps) {
  const { user, isPremium } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Learning Plan</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Master Data Structures & Algorithms with our comprehensive learning platform. 
          Start your journey today!
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {SUBSCRIPTION_PLANS.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                <Star className="w-3 h-3 mr-1" />
                Most Popular
              </Badge>
            )}
            
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">₹{plan.price}</span>
                  <span className="text-muted-foreground">
                    {plan.duration === 'monthly' ? '/month' : '/year'}
                  </span>
                </div>
                {plan.discount && (
                  <div className="mt-2">
                    <Badge variant="secondary" className="text-green-600">
                      Save {plan.discount}%
                    </Badge>
                  </div>
                )}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Button 
                className="w-full" 
                variant={plan.popular ? 'default' : 'outline'}
                onClick={() => onSelectPlan(plan)}
                disabled={isPremium && plan.id !== 'free'}
              >
                {plan.id === 'free' ? 'Current Plan' : 
                 isPremium ? 'Already Subscribed' : 
                 plan.id.includes('yearly') ? 'Get Yearly Plan' : 'Start Premium'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12">
        <div className="bg-muted/50 rounded-lg p-6 max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold mb-4">Why Choose Our Platform?</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="font-medium mb-2">🎯 Interactive Learning</div>
              <p className="text-muted-foreground">
                Visualize algorithms step-by-step with our advanced interactive tools
              </p>
            </div>
            <div>
              <div className="font-medium mb-2">📊 Progress Tracking</div>
              <p className="text-muted-foreground">
                Monitor your learning journey with detailed analytics and achievements
              </p>
            </div>
            <div>
              <div className="font-medium mb-2">💼 Interview Ready</div>
              <p className="text-muted-foreground">
                Practice with real interview questions from top tech companies
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
