import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { CheckCircle, Crown, ArrowRight, Download, Calendar, Users } from 'lucide-react';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { user, updateSubscription } = useAuth();

  useEffect(() => {
    // Update user subscription status to premium
    if (user) {
      const newSubscription = {
        ...user.subscription,
        plan: 'premium' as const,
        status: 'active' as const,
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
      };
      updateSubscription(newSubscription);
    }
  }, [user, updateSubscription]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-green-800 mb-4">Payment Successful!</h1>
          <p className="text-xl text-green-700 font-medium mb-2">
            Welcome to AlgoWave Premium
          </p>
          <p className="text-green-600">
            Ride the wave of algorithms with premium access!
          </p>
        </div>

        {/* Success Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-500" />
              Your Premium Access is Now Active
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Plan</p>
                <p className="font-semibold">Premium Yearly</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Amount Paid</p>
                <p className="font-semibold">₹500</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valid Until</p>
                <p className="font-semibold">{new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge className="bg-green-500">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What's Unlocked */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>🎉 What's Now Unlocked for You</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">All 100+ DSA Topics</p>
                    <p className="text-sm text-muted-foreground">Complete access to our entire curriculum</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Interactive Visualizations</p>
                    <p className="text-sm text-muted-foreground">Step-by-step algorithm execution</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Unlimited Practice Problems</p>
                    <p className="text-sm text-muted-foreground">1000+ coding challenges with solutions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Progress Analytics</p>
                    <p className="text-sm text-muted-foreground">Detailed insights into your learning</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Mock Interview Questions</p>
                    <p className="text-sm text-muted-foreground">Real questions from top companies</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Priority Support</p>
                    <p className="text-sm text-muted-foreground">Get help when you need it</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Downloadable Resources</p>
                    <p className="text-sm text-muted-foreground">PDFs, cheat sheets, and more</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Certificate of Completion</p>
                    <p className="text-sm text-muted-foreground">Showcase your achievements</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <ArrowRight className="w-8 h-8 mx-auto mb-3 text-blue-500" />
              <h3 className="font-semibold mb-2">Start Learning</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Jump into your personalized dashboard
              </p>
              <Button onClick={() => navigate('/dashboard')} className="w-full">
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Download className="w-8 h-8 mx-auto mb-3 text-green-500" />
              <h3 className="font-semibold mb-2">Download Resources</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get your study materials
              </p>
              <Button variant="outline" className="w-full">
                Download Now
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="w-8 h-8 mx-auto mb-3 text-purple-500" />
              <h3 className="font-semibold mb-2">Join Community</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Connect with fellow learners
              </p>
              <Button variant="outline" className="w-full">
                Join Discord
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>🚀 Recommended Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <p className="font-medium">Complete Your Profile</p>
                  <p className="text-sm text-muted-foreground">Set your learning preferences and goals</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <p className="font-medium">Take the Skill Assessment</p>
                  <p className="text-sm text-muted-foreground">Get personalized learning recommendations</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <p className="font-medium">Start with Arrays & Strings</p>
                  <p className="text-sm text-muted-foreground">Begin your DSA journey with fundamental topics</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <div className="text-center mt-8 p-6 bg-white rounded-lg">
          <h3 className="font-semibold mb-2">Need Help Getting Started?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Our support team is here to help you make the most of your premium experience
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline">Contact Support</Button>
            <Button variant="outline">View Help Center</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
