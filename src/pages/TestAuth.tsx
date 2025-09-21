import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import { setTestUser } from '@/utils/test-user';
import { Crown, User, RefreshCw } from 'lucide-react';

export default function TestAuth() {
  const { user, isPremium, subscription, logout } = useAuth();

  const handleCreateTestUser = (plan: 'free' | 'monthly' | 'yearly') => {
    setTestUser(plan);
    window.location.reload(); // Reload to trigger auth context update
  };

  const handleClearAuth = () => {
    logout();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Authentication Test Page
            </CardTitle>
            <CardDescription>
              Test authentication states and subscription plans
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Auth State */}
            <div>
              <h3 className="font-semibold mb-3">Current Authentication State</h3>
              {user ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Authenticated
                    </Badge>
                    {isPremium && (
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Role:</strong> {user.role}</p>
                  {subscription && (
                    <div className="mt-2">
                      <p><strong>Plan:</strong> {subscription.plan}</p>
                      <p><strong>Status:</strong> {subscription.status}</p>
                      <p><strong>End Date:</strong> {new Date(subscription.endDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <Badge variant="secondary" className="bg-red-100 text-red-800 mb-2">
                    Not Authenticated
                  </Badge>
                  <p>No user logged in</p>
                </div>
              )}
            </div>

            {/* Test Actions */}
            <div>
              <h3 className="font-semibold mb-3">Test Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button 
                  onClick={() => handleCreateTestUser('free')}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <User className="w-5 h-5" />
                  <div className="text-center">
                    <div className="font-medium">Free User</div>
                    <div className="text-xs text-muted-foreground">Basic access</div>
                  </div>
                </Button>

                <Button 
                  onClick={() => handleCreateTestUser('monthly')}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <Crown className="w-5 h-5 text-blue-500" />
                  <div className="text-center">
                    <div className="font-medium">₹50/month</div>
                    <div className="text-xs text-muted-foreground">Monthly Premium</div>
                  </div>
                </Button>

                <Button 
                  onClick={() => handleCreateTestUser('yearly')}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <Crown className="w-5 h-5 text-purple-500" />
                  <div className="text-center">
                    <div className="font-medium">₹500/year</div>
                    <div className="text-xs text-muted-foreground">Yearly Premium</div>
                  </div>
                </Button>

                <Button 
                  onClick={handleClearAuth}
                  variant="destructive"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  <div className="text-center">
                    <div className="font-medium">Clear Auth</div>
                    <div className="text-xs">Logout & Reset</div>
                  </div>
                </Button>
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h3 className="font-semibold mb-3">Navigation</h3>
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
                  Dashboard
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/profile'}>
                  Profile
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/login'}>
                  Login Page
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/'}>
                  Landing Page
                </Button>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium mb-2">Instructions:</h4>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Click one of the test user buttons to create a user with different subscription plans</li>
                <li>Navigate to different pages to test authentication</li>
                <li>Check the profile dropdown to see subscription information</li>
                <li>Use "Clear Auth" to reset and test unauthenticated state</li>
                <li>Refresh the page to test persistent authentication</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
