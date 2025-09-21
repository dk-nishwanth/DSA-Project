import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { Check, Crown, Zap, QrCode, CreditCard, Smartphone, ArrowLeft, Star, Camera, Loader2, Shield, AlertCircle, CheckCircle2, X } from 'lucide-react';
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

interface PaymentStep {
  step: number;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

interface ValidationErrors {
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
  name?: string;
  upiId?: string;
}

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
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSteps, setPaymentSteps] = useState<PaymentStep[]>([]);
  const navigate = useNavigate();
  const { user, updateSubscription } = useAuth();
  const { toast } = useToast();

  // Validation functions
  const validateCardNumber = (number: string): string | null => {
    const cleaned = number.replace(/\s/g, '');
    if (!cleaned) return 'Card number is required';
    if (cleaned.length < 13 || cleaned.length > 19) return 'Invalid card number length';
    if (!/^\d+$/.test(cleaned)) return 'Card number must contain only digits';
    
    // Luhn algorithm check
    let sum = 0;
    let isEven = false;
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i]);
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      isEven = !isEven;
    }
    
    if (sum % 10 !== 0) return 'Invalid card number';
    return null;
  };

  const validateExpiry = (expiry: string): string | null => {
    if (!expiry) return 'Expiry date is required';
    const [month, year] = expiry.split('/');
    if (!month || !year) return 'Invalid expiry format (MM/YY)';
    
    const monthNum = parseInt(month);
    const yearNum = parseInt('20' + year);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    if (monthNum < 1 || monthNum > 12) return 'Invalid month';
    if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
      return 'Card has expired';
    }
    
    return null;
  };

  const validateCVV = (cvv: string): string | null => {
    if (!cvv) return 'CVV is required';
    if (cvv.length < 3 || cvv.length > 4) return 'CVV must be 3-4 digits';
    if (!/^\d+$/.test(cvv)) return 'CVV must contain only digits';
    return null;
  };

  const validateName = (name: string): string | null => {
    if (!name.trim()) return 'Cardholder name is required';
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    if (!/^[a-zA-Z\s]+$/.test(name)) return 'Name must contain only letters and spaces';
    return null;
  };

  const validateUpiId = (upiId: string): string | null => {
    if (!upiId) return 'UPI ID is required';
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
    if (!upiRegex.test(upiId)) return 'Invalid UPI ID format (e.g., user@paytm)';
    return null;
  };

  const validatePaymentMethod = (): boolean => {
    const errors: ValidationErrors = {};
    
    if (expandedMethod === 'card') {
      errors.cardNumber = validateCardNumber(cardDetails.number);
      errors.expiry = validateExpiry(cardDetails.expiry);
      errors.cvv = validateCVV(cardDetails.cvv);
      errors.name = validateName(cardDetails.name);
    } else if (expandedMethod === 'upi' && selectedUpiProvider === 'razorpay') {
      errors.upiId = validateUpiId(upiId);
    }
    
    setValidationErrors(errors);
    return Object.values(errors).every(error => !error);
  };

  const initializePaymentSteps = (method: string) => {
    const steps: PaymentStep[] = [
      {
        step: 1,
        title: 'Validating Payment Details',
        description: 'Checking your payment information...',
        status: 'processing'
      },
      {
        step: 2,
        title: 'Processing Payment',
        description: `Processing payment via ${method}...`,
        status: 'pending'
      },
      {
        step: 3,
        title: 'Activating Subscription',
        description: 'Setting up your premium account...',
        status: 'pending'
      },
      {
        step: 4,
        title: 'Complete',
        description: 'Welcome to premium! Redirecting...',
        status: 'pending'
      }
    ];
    setPaymentSteps(steps);
  };

  const updatePaymentStep = (stepIndex: number, status: PaymentStep['status']) => {
    setPaymentSteps(prev => prev.map((step, index) => 
      index === stepIndex ? { ...step, status } : step
    ));
  };

  const handlePayment = async () => {
    if (!validatePaymentMethod()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in your payment details.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setShowPaymentModal(true);
    
    const paymentMethod = expandedMethod === 'card' ? 'Credit/Debit Card' : 
                         expandedMethod === 'upi' ? selectedUpiProvider?.toUpperCase() || 'UPI' : 
                         'QR Code';
    
    initializePaymentSteps(paymentMethod);

    try {
      // Step 1: Validation (1 second)
      await new Promise(resolve => setTimeout(resolve, 1000));
      updatePaymentStep(0, 'completed');
      updatePaymentStep(1, 'processing');

      // Step 2: Payment Processing (2-3 seconds)
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Simulate occasional payment failures (10% chance)
      if (Math.random() < 0.1) {
        updatePaymentStep(1, 'failed');
        throw new Error('Payment declined by bank');
      }
      
      updatePaymentStep(1, 'completed');
      updatePaymentStep(2, 'processing');

      // Step 3: Account Setup (1.5 seconds)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update user subscription
      if (updateSubscription) {
        const newSubscription = {
          id: `sub_${Date.now()}`,
          userId: user?.id || 'user_1',
          plan: 'premium' as const,
          status: 'active' as const,
          startDate: new Date(),
          endDate: new Date(Date.now() + (selectedPlan.id === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000),
          paymentMethod: paymentMethod,
          trialUsed: true
        };
        updateSubscription(newSubscription);
      }
      
      updatePaymentStep(2, 'completed');
      updatePaymentStep(3, 'processing');

      // Step 4: Complete (1 second)
      await new Promise(resolve => setTimeout(resolve, 1000));
      updatePaymentStep(3, 'completed');

      // Success
      toast({
        title: "Payment Successful! 🎉",
        description: `Welcome to ${selectedPlan.name}! You now have full access to all features.`,
      });

      // Redirect after showing success
      setTimeout(() => {
        navigate('/payment-success?plan=' + selectedPlan.id);
      }, 2000);

    } catch (error) {
      console.error('Payment failed:', error);
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Please try again or contact support.",
        variant: "destructive"
      });
      setShowPaymentModal(false);
    } finally {
      setIsProcessing(false);
    }
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
    let formattedValue = value;
    
    // Format card number with spaces
    if (field === 'number') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) formattedValue = formattedValue.slice(0, 19);
    }
    
    // Format expiry date
    if (field === 'expiry') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
      }
    }
    
    // Format CVV (numbers only)
    if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }
    
    // Format name (letters and spaces only)
    if (field === 'name') {
      formattedValue = value.replace(/[^a-zA-Z\s]/g, '').slice(0, 50);
    }
    
    setCardDetails(prev => ({ ...prev, [field]: formattedValue }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field as keyof ValidationErrors]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Real-time validation as user types
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (expandedMethod === 'card') {
        const errors: ValidationErrors = {};
        if (cardDetails.number) errors.cardNumber = validateCardNumber(cardDetails.number);
        if (cardDetails.expiry) errors.expiry = validateExpiry(cardDetails.expiry);
        if (cardDetails.cvv) errors.cvv = validateCVV(cardDetails.cvv);
        if (cardDetails.name) errors.name = validateName(cardDetails.name);
        setValidationErrors(errors);
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [cardDetails, expandedMethod]);

  // Payment Processing Modal Component
  const PaymentProcessingModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Processing Payment
          </CardTitle>
          <CardDescription>
            Please don't close this window or press back button
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentSteps.map((step, index) => (
            <div key={step.step} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step.status === 'completed' ? 'bg-green-100 text-green-600' :
                step.status === 'processing' ? 'bg-blue-100 text-blue-600' :
                step.status === 'failed' ? 'bg-red-100 text-red-600' :
                'bg-gray-100 text-gray-400'
              }`}>
                {step.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> :
                 step.status === 'processing' ? <Loader2 className="w-4 h-4 animate-spin" /> :
                 step.status === 'failed' ? <X className="w-4 h-4" /> :
                 <span className="text-xs font-bold">{step.step}</span>}
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">{step.title}</div>
                <div className="text-xs text-muted-foreground">{step.description}</div>
              </div>
            </div>
          ))}
          
          <div className="text-center text-xs text-muted-foreground mt-4 p-3 bg-blue-50 rounded-lg">
            <Shield className="w-4 h-4 mx-auto mb-1 text-blue-600" />
            <p>🔒 Your payment is secured with 256-bit SSL encryption</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

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
                          
                          {/* UPI ID Input for RazorPay */}
                          {selectedUpiProvider === 'razorpay' && (
                            <div className="mt-3 space-y-2">
                              <Label htmlFor="upiId">Enter your UPI ID</Label>
                              <Input
                                id="upiId"
                                placeholder="yourname@paytm"
                                value={upiId}
                                onChange={(e) => {
                                  setUpiId(e.target.value);
                                  if (validationErrors.upiId) {
                                    setValidationErrors(prev => ({ ...prev, upiId: undefined }));
                                  }
                                }}
                                className={validationErrors.upiId ? 'border-red-500' : ''}
                              />
                              {validationErrors.upiId && (
                                <div className="flex items-center gap-1 text-red-600 text-xs">
                                  <AlertCircle className="w-3 h-3" />
                                  {validationErrors.upiId}
                                </div>
                              )}
                              <p className="text-xs text-muted-foreground">
                                Enter your UPI ID (e.g., 9876543210@paytm, user@googlepay)
                              </p>
                            </div>
                          )}
                          
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
                            <Label htmlFor="cardNumber">Card Number *</Label>
                            <Input
                              id="cardNumber"
                              placeholder="1234 5678 9012 3456"
                              value={cardDetails.number}
                              onChange={(e) => handleCardInputChange('number', e.target.value)}
                              maxLength={19}
                              className={validationErrors.cardNumber ? 'border-red-500' : ''}
                            />
                            {validationErrors.cardNumber && (
                              <div className="flex items-center gap-1 text-red-600 text-xs mt-1">
                                <AlertCircle className="w-3 h-3" />
                                {validationErrors.cardNumber}
                              </div>
                            )}
                            {cardDetails.number && !validationErrors.cardNumber && cardDetails.number.replace(/\s/g, '').length >= 13 && (
                              <div className="flex items-center gap-1 text-green-600 text-xs mt-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Valid card number
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="expiry">Expiry Date *</Label>
                              <Input
                                id="expiry"
                                placeholder="MM/YY"
                                value={cardDetails.expiry}
                                onChange={(e) => handleCardInputChange('expiry', e.target.value)}
                                maxLength={5}
                                className={validationErrors.expiry ? 'border-red-500' : ''}
                              />
                              {validationErrors.expiry && (
                                <div className="flex items-center gap-1 text-red-600 text-xs mt-1">
                                  <AlertCircle className="w-3 h-3" />
                                  {validationErrors.expiry}
                                </div>
                              )}
                            </div>
                            <div>
                              <Label htmlFor="cvv">CVV *</Label>
                              <Input
                                id="cvv"
                                placeholder="123"
                                value={cardDetails.cvv}
                                onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                                maxLength={4}
                                type="password"
                                className={validationErrors.cvv ? 'border-red-500' : ''}
                              />
                              {validationErrors.cvv && (
                                <div className="flex items-center gap-1 text-red-600 text-xs mt-1">
                                  <AlertCircle className="w-3 h-3" />
                                  {validationErrors.cvv}
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="cardName">Cardholder Name *</Label>
                            <Input
                              id="cardName"
                              placeholder="John Doe"
                              value={cardDetails.name}
                              onChange={(e) => handleCardInputChange('name', e.target.value)}
                              className={validationErrors.name ? 'border-red-500' : ''}
                            />
                            {validationErrors.name && (
                              <div className="flex items-center gap-1 text-red-600 text-xs mt-1">
                                <AlertCircle className="w-3 h-3" />
                                {validationErrors.name}
                              </div>
                            )}
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
      
      {/* Payment Processing Modal */}
      {showPaymentModal && <PaymentProcessingModal />}
    </div>
  );
}
