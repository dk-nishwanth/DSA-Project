import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CreditCard, Smartphone, QrCode, Check, Crown, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  savings?: string;
  benefits: string[];
  popular?: boolean;
}

const paymentPlans: PaymentPlan[] = [
  {
    id: 'monthly',
    name: 'Monthly Plan',
    price: 50,
    duration: 'per month',
    popular: true,
    benefits: [
      'Full access to all DSA topics',
      'Interactive visualizations',
      'Practice problems with solutions',
      'Progress tracking',
      'Mobile app access',
      'Email support'
    ]
  },
  {
    id: 'yearly',
    name: 'Yearly Plan',
    price: 500,
    duration: 'per year',
    savings: 'Save ₹100 (2 months free!)',
    benefits: [
      'All Monthly Plan benefits',
      '2 months completely FREE',
      'Priority customer support',
      'Exclusive yearly challenges',
      'Advanced analytics dashboard',
      'Downloadable study materials',
      'Certificate of completion',
      'Early access to new features'
    ]
  }
];

export default function CollegePayment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan>(paymentPlans[0]);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'qr' | 'card'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  // Get user data from registration
  const userData = location.state?.userData;

  useEffect(() => {
    if (!userData) {
      toast({
        title: "Registration Required",
        description: "Please complete registration first.",
        variant: "destructive",
      });
      navigate('/college-signup');
    }
  }, [userData, navigate, toast]);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Payment Successful! 🎉",
        description: `Welcome to DSA Learning Platform! Your ${selectedPlan.name} is now active.`,
      });
      
      // Navigate to dashboard or success page
      navigate('/dashboard', { 
        state: { 
          userData, 
          subscription: selectedPlan,
          paymentSuccess: true 
        } 
      });
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const generateQRCode = () => {
    // In a real implementation, this would generate an actual UPI QR code
    const upiString = `upi://pay?pa=dsa.learning@paytm&pn=DSA Learning Platform&am=${selectedPlan.price}&cu=INR&tn=DSA Platform Subscription`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}`;
  };

  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/college-signup')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Registration
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Complete Your Subscription</h1>
          <p className="text-muted-foreground">
            Welcome <strong>{userData.name}</strong>! Choose your plan to access the DSA Learning Platform
          </p>
        </div>

        {/* Plan Selection */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {paymentPlans.map((plan) => (
            <Card 
              key={plan.id}
              className={`cursor-pointer transition-all ${
                selectedPlan.id === plan.id 
                  ? 'border-purple-500 shadow-lg scale-105' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedPlan(plan)}
            >
              <CardHeader className="text-center">
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600">
                    <Crown className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                )}
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="text-3xl font-bold text-purple-600">
                  ₹{plan.price}
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    {plan.duration}
                  </span>
                </div>
                {plan.savings && (
                  <Badge variant="secondary" className="text-green-600 mt-2">
                    {plan.savings}
                  </Badge>
                )}
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Payment Methods */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Method
            </CardTitle>
            <CardDescription>
              Choose your preferred payment method for {selectedPlan.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="upi" className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  UPI
                </TabsTrigger>
                <TabsTrigger value="qr" className="flex items-center gap-2">
                  <QrCode className="w-4 h-4" />
                  QR Code
                </TabsTrigger>
                <TabsTrigger value="card" className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Card
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upi" className="space-y-4 mt-6">
                <div className="text-center">
                  <h3 className="font-semibold mb-4">Pay with UPI</h3>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => window.open(`upi://pay?pa=dsa.learning@paytm&pn=DSA Learning Platform&am=${selectedPlan.price}&cu=INR&tn=DSA Platform Subscription`)}
                    >
                      <img src="https://cdn.iconscout.com/icon/free/png-256/google-pay-2038307-1721675.png" alt="Google Pay" className="w-6 h-6 mr-3" />
                      Google Pay
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => window.open(`phonepe://pay?pa=dsa.learning@paytm&pn=DSA Learning Platform&am=${selectedPlan.price}&cu=INR&tn=DSA Platform Subscription`)}
                    >
                      <img src="https://cdn.iconscout.com/icon/free/png-256/phonepe-2709167-2249157.png" alt="PhonePe" className="w-6 h-6 mr-3" />
                      PhonePe
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => window.open(`paytmmp://pay?pa=dsa.learning@paytm&pn=DSA Learning Platform&am=${selectedPlan.price}&cu=INR&tn=DSA Platform Subscription`)}
                    >
                      <img src="https://cdn.iconscout.com/icon/free/png-256/paytm-226448.png" alt="Paytm" className="w-6 h-6 mr-3" />
                      Paytm
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="qr" className="space-y-4 mt-6">
                <div className="text-center">
                  <h3 className="font-semibold mb-4">Scan QR Code to Pay</h3>
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-white rounded-lg shadow-md">
                      <img 
                        src={generateQRCode()} 
                        alt="Payment QR Code" 
                        className="w-48 h-48"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Scan this QR code with any UPI app to pay ₹{selectedPlan.price}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="card" className="space-y-4 mt-6">
                <div className="text-center">
                  <h3 className="font-semibold mb-4">Pay with Card</h3>
                  <p className="text-muted-foreground mb-4">
                    Redirecting to secure payment gateway...
                  </p>
                  <Button 
                    onClick={() => {
                      // In real implementation, redirect to Razorpay/Stripe
                      toast({
                        title: "Redirecting...",
                        description: "Taking you to secure payment page",
                      });
                      setTimeout(handlePayment, 1000);
                    }}
                    className="w-full"
                  >
                    Pay ₹{selectedPlan.price} with Card
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-8 pt-6 border-t">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold">Total Amount:</span>
                <span className="text-2xl font-bold text-purple-600">₹{selectedPlan.price}</span>
              </div>
              
              <Button 
                onClick={handlePayment}
                className="w-full"
                disabled={isProcessing}
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Complete Payment & Start Learning
                  </>
                )}
              </Button>
              
              <p className="text-xs text-center text-muted-foreground mt-4">
                🔒 Secure payment powered by Razorpay • 100% Safe & Encrypted
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-6">
            <h3 className="font-semibold mb-4">Why Choose Our Platform?</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-medium mb-2">🎯 Interactive Learning</div>
                <p className="text-muted-foreground">
                  Visualize algorithms step-by-step with advanced interactive tools
                </p>
              </div>
              <div>
                <div className="font-medium mb-2">📊 Progress Tracking</div>
                <p className="text-muted-foreground">
                  Monitor your learning journey with detailed analytics
                </p>
              </div>
              <div>
                <div className="font-medium mb-2">💼 Interview Ready</div>
                <p className="text-muted-foreground">
                  Practice with real questions from top tech companies
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
