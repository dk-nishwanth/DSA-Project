import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { Check, Crown, Zap, QrCode, CreditCard, Smartphone, ArrowLeft, Star, Camera, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  duration: string;
  popular?: boolean;
  savings?: string;
  features: string[];
}

const plans: PricingPlan[] = [
  {
    id: 'monthly',
    name: 'Monthly Plan',
    price: 50,
    duration: 'per month',
    features: [
      'Access to all DSA topics',
      'Interactive visualizations',
      'Practice problems with solutions',
      'Progress tracking',
      'Mock interview questions',
      'Priority support',
      'Mobile app access',
      'Downloadable resources'
    ]
  },
  {
    id: 'yearly',
    name: 'Yearly Plan',
    price: 500,
    originalPrice: 600,
    duration: 'per year',
    popular: true,
    savings: 'Save ₹100',
    features: [
      'All Monthly Plan features',
      '2 months absolutely FREE',
      'Exclusive yearly challenges',
      'Direct mentor access',
      'Certificate of completion',
      'Advanced analytics',
      'Priority feature requests',
      'Lifetime updates'
    ]
  }
];

type UpiProvider = 'gpay' | 'phonepe' | 'paytm' | 'razorpay';

export default function SubscriptionPayment() {
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan>(plans[1]); // Default to yearly
  const [expandedMethod, setExpandedMethod] = useState<'upi' | 'card' | 'qr' | null>(null);
  const [selectedUpiProvider, setSelectedUpiProvider] = useState<UpiProvider | null>(null);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Payment Successful!",
        description: `Welcome to ${selectedPlan.name}! You now have full access to all features.`,
      });
      navigate('/payment-success');
      setIsProcessing(false);
    }, 3000);
  };

  const handleSkipTrial = () => {
    navigate('/dashboard?trial=true');
  };

  const handleMethodClick = (method: 'upi' | 'qr' | 'card') => {
    console.log('Payment method clicked:', method, 'Current expanded:', expandedMethod);
    if (expandedMethod === method) {
      setExpandedMethod(null);
    } else {
      setExpandedMethod(method);
    }
  };

  const handleCardInputChange = (field: string, value: string) => {
    setCardDetails(prev => ({ ...prev, [field]: value }));
  };

  const upiProviders = [
    {
      id: 'gpay' as const,
      name: 'Google Pay',
      description: 'Pay using Google Pay',
      color: 'bg-blue-500',
      textColor: 'text-white'
    },
    {
      id: 'phonepe' as const,
      name: 'PhonePe',
      description: 'Pay using PhonePe',
      color: 'bg-purple-600',
      textColor: 'text-white'
    },
    {
      id: 'paytm' as const,
      name: 'Paytm',
      description: 'Pay using Paytm',
      color: 'bg-blue-600',
      textColor: 'text-white'
    },
    {
      id: 'razorpay' as const,
      name: 'RazorPay UPI',
      description: 'Pay using RazorPay UPI',
      color: 'bg-blue-700',
      textColor: 'text-white'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/signup')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
          <h1 className="text-4xl font-bold mb-4">Choose Your Learning Journey</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Unlock the full potential of DSA learning with our comprehensive platform
          </p>
        </div>

        {/* Single Column Layout */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Free Trial Section - Prominent at Top */}
          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <Crown className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-green-800 mb-2">🎯 Start Free Trial</h2>
                  <p className="text-green-700 text-lg">Perfect for exploring our platform</p>
                </div>
                <div className="text-5xl font-bold text-green-800">FREE</div>
                
                <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <span>Access to first DSA topic</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <span>Interactive visualizations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <span>Basic practice problems</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <span>No credit card required</span>
                  </div>
                </div>
                
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 text-lg"
                  onClick={handleSkipTrial}
                >
                  🚀 Start Free Trial Now
                </Button>
                <p className="text-sm text-green-600">
                  ✨ Upgrade anytime to unlock all features
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Separator */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted-foreground/20" />
            </div>
            <div className="relative flex justify-center text-sm uppercase">
              <span className="bg-background px-4 text-muted-foreground font-medium">Or unlock everything with premium</span>
            </div>
          </div>

          {/* Premium Plans - Side by Side */}
          <div className="grid md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <Card 
                key={plan.id}
                className={`cursor-pointer transition-all ${
                  selectedPlan.id === plan.id 
                    ? 'border-primary shadow-lg ring-2 ring-primary/20 scale-105' 
                    : 'hover:shadow-md hover:scale-102'
                } ${plan.popular ? 'relative' : ''}`}
                onClick={() => setSelectedPlan(plan)}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-4xl font-bold">₹{plan.price}</span>
                      {plan.originalPrice && (
                        <span className="text-xl text-muted-foreground line-through">
                          ₹{plan.originalPrice}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground">{plan.duration}</p>
                    {plan.savings && (
                      <Badge variant="secondary" className="text-green-600">
                        {plan.savings}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.slice(0, 4).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${
                      selectedPlan.id === plan.id 
                        ? 'bg-primary' 
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                    variant={selectedPlan.id === plan.id ? 'default' : 'secondary'}
                  >
                    {selectedPlan.id === plan.id ? 'Selected' : 'Select Plan'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Payment Section - Only show if premium plan selected */}
          {selectedPlan && (
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Complete Your Purchase</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Order Summary */}
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>{selectedPlan.name}</span>
                      <span>₹{selectedPlan.price}</span>
                    </div>
                    {selectedPlan.originalPrice && (
                      <div className="flex justify-between text-green-600">
                        <span>Savings</span>
                        <span>-₹{selectedPlan.originalPrice - selectedPlan.price}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>₹{selectedPlan.price}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Choose Payment Method</h3>
                  {/* Debug info - remove this later */}
                  <div className="text-xs text-gray-500 p-2 bg-gray-100 rounded">
                    Debug: Expanded Method = {expandedMethod || 'none'}
                  </div>
                  
                  {/* UPI Payment */}
                  <Card 
                    className={`cursor-pointer transition-colors ${
                      expandedMethod === 'upi' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => handleMethodClick('upi')}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">UPI Payment</span>
                            <Badge variant="secondary" className="text-xs">Recommended</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">Pay with Google Pay, PhonePe, Paytm, etc.</p>
                        </div>
                      </div>
                      
                      {/* UPI Options - Expanded */}
                      {expandedMethod === 'upi' && (
                        <div className="mt-4 space-y-3 border-t pt-4">
                          {upiProviders.map((provider) => (
                            <Card 
                              key={provider.id}
                              className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                                selectedUpiProvider === provider.id ? 'border-primary bg-primary/5' : ''
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedUpiProvider(provider.id);
                              }}
                            >
                              <CardContent className="flex items-center gap-3 p-3">
                                <div className={`w-6 h-6 rounded ${provider.color} flex items-center justify-center`}>
                                  <span className={`text-xs font-bold ${provider.textColor}`}>
                                    {provider.name.charAt(0)}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <span className="font-medium text-sm">{provider.name}</span>
                                  <p className="text-xs text-muted-foreground">{provider.description}</p>
                                </div>
                                <div className={`w-3 h-3 rounded-full border-2 ${
                                  selectedUpiProvider === provider.id ? 'border-primary bg-primary' : 'border-muted-foreground'
                                }`} />
                              </CardContent>
                            </Card>
                          ))}
                          
                          <Button 
                            className="w-full mt-3" 
                            onClick={handlePayment}
                            disabled={!selectedUpiProvider || isProcessing}
                          >
                            {isProcessing ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Processing Payment...
                              </>
                            ) : (
                              `Pay ₹${selectedPlan.price} with UPI`
                            )}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* QR Code */}
                  <Card 
                    className={`cursor-pointer transition-colors ${
                      expandedMethod === 'qr' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => handleMethodClick('qr')}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <QrCode className="w-5 h-5" />
                        <div className="flex-1">
                          <span className="font-medium">QR Code</span>
                          <p className="text-sm text-muted-foreground">Scan QR code with any UPI app</p>
                        </div>
                      </div>
                      
                      {/* QR Code Display - Expanded */}
                      {expandedMethod === 'qr' && (
                        <div className="mt-4 border-t pt-4">
                          <div className="flex flex-col items-center space-y-4">
                            <div className="w-40 h-40 bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                              <div className="text-center">
                                <QrCode className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                <p className="text-xs text-gray-500">QR Code will appear here</p>
                                <p className="text-xs text-gray-400 mt-1">Amount: ₹{selectedPlan.price}</p>
                              </div>
                            </div>
                            
                            <div className="text-center">
                              <p className="text-sm font-medium">Open any UPI app and scan this QR code</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Supported: Google Pay, PhonePe, Paytm, BHIM, etc.
                              </p>
                            </div>

                            <Button variant="outline" className="w-full">
                              <Camera className="w-4 h-4 mr-2" />
                              Open Camera to Scan
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Credit/Debit Card */}
                  <Card 
                    className={`cursor-pointer transition-colors ${
                      expandedMethod === 'card' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => handleMethodClick('card')}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5" />
                        <div className="flex-1">
                          <span className="font-medium">Credit/Debit Card</span>
                          <p className="text-sm text-muted-foreground">Visa, Mastercard, RuPay accepted</p>
                        </div>
                      </div>
                      
                      {/* Card Details Form - Expanded */}
                      {expandedMethod === 'card' && (
                        <div className="mt-4 space-y-4 border-t pt-4">
                          <div>
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <Input
                              id="cardNumber"
                              placeholder="1234 5678 9012 3456"
                              value={cardDetails.number}
                              onChange={(e) => handleCardInputChange('number', e.target.value)}
                              maxLength={19}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="expiry">Expiry Date</Label>
                              <Input
                                id="expiry"
                                placeholder="MM/YY"
                                value={cardDetails.expiry}
                                onChange={(e) => handleCardInputChange('expiry', e.target.value)}
                                maxLength={5}
                              />
                            </div>
                            <div>
                              <Label htmlFor="cvv">CVV</Label>
                              <Input
                                id="cvv"
                                placeholder="123"
                                value={cardDetails.cvv}
                                onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                                maxLength={4}
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="cardName">Cardholder Name</Label>
                            <Input
                              id="cardName"
                              placeholder="John Doe"
                              value={cardDetails.name}
                              onChange={(e) => handleCardInputChange('name', e.target.value)}
                            />
                          </div>

                          <Button 
                            className="w-full" 
                            onClick={handlePayment}
                            disabled={!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name || isProcessing}
                          >
                            {isProcessing ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Processing Payment...
                              </>
                            ) : (
                              `Pay ₹${selectedPlan.price}`
                            )}
                          </Button>

                          <div className="text-center text-xs text-muted-foreground">
                            <p>🔒 Your card details are encrypted and secure</p>
                            <p>We don't store your card information</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>


                <div className="text-center text-sm text-muted-foreground space-y-1">
                  <p>🔒 Secure payment powered by Razorpay</p>
                  <p>Cancel anytime • No hidden charges • 100% refund policy</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Benefits Section */}
        <div className="mt-12 bg-white rounded-lg p-8">
          <h3 className="text-2xl font-bold text-center mb-8">Why Choose Our Platform?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">Interactive Learning</h4>
              <p className="text-sm text-muted-foreground">
                Visualize algorithms step-by-step with our advanced interactive tools
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Expert Content</h4>
              <p className="text-sm text-muted-foreground">
                Curated by industry experts and top university professors
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Interview Ready</h4>
              <p className="text-sm text-muted-foreground">
                Practice with real questions from top tech companies
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
