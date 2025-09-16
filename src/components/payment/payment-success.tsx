import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, ArrowRight, Download, Star } from 'lucide-react';

export function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, subscription } = location.state || {};

  useEffect(() => {
    // Set user as paid in localStorage for demo purposes
    if (userData) {
      localStorage.setItem('college_student_paid', JSON.stringify({
        ...userData,
        subscription,
        paymentDate: new Date().toISOString(),
        status: 'active'
      }));
    }
  }, [userData, subscription]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-700">Payment Successful! 🎉</CardTitle>
          <p className="text-muted-foreground">
            Welcome to DSA Learning Platform, <strong>{userData?.name}</strong>!
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Subscription Details */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-purple-600" />
              Your Subscription Details
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Plan</p>
                <p className="font-semibold">{subscription?.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Amount Paid</p>
                <p className="font-semibold text-green-600">₹{subscription?.price}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valid Until</p>
                <p className="font-semibold">
                  {subscription?.id === 'yearly' 
                    ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()
                    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
                  }
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge className="bg-green-100 text-green-700">Active</Badge>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="space-y-4">
            <h3 className="font-semibold">What's Next?</h3>
            <div className="grid gap-3">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                <div>
                  <p className="font-medium">Start Learning</p>
                  <p className="text-sm text-muted-foreground">Access 100+ DSA topics with interactive visualizations</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                <div>
                  <p className="font-medium">Practice Problems</p>
                  <p className="text-sm text-muted-foreground">Solve coding challenges and track your progress</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                <div>
                  <p className="font-medium">Get Certified</p>
                  <p className="text-sm text-muted-foreground">Complete courses and earn certificates</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              onClick={() => navigate('/dashboard')}
              className="flex-1"
              size="lg"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Start Learning Now
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                // Generate receipt
                const receipt = {
                  transactionId: `TXN${Date.now()}`,
                  date: new Date().toLocaleDateString(),
                  amount: subscription?.price,
                  plan: subscription?.name,
                  student: userData?.name,
                  email: userData?.email
                };
                console.log('Receipt:', receipt);
                alert('Receipt downloaded to console (demo)');
              }}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </Button>
          </div>

          <div className="text-center pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Need help? Contact us at{' '}
              <a href="mailto:support@dsalearning.com" className="text-purple-600 hover:underline">
                support@dsalearning.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
