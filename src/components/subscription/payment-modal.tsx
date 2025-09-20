import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CreditCard, Smartphone, Wallet, QrCode, ArrowLeft, Camera, X } from 'lucide-react';
import { PaymentPlan } from '@/types/subscription';
import { useAuth } from '@/contexts/auth-context';
import { subscriptionService } from '@/services/subscriptionService';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PaymentPlan | null;
}

type UpiProvider = 'gpay' | 'phonepe' | 'paytm' | 'razorpay';

export function PaymentModal({ isOpen, onClose, plan }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedMethod, setExpandedMethod] = useState<'upi' | 'qr' | 'card' | null>(null);
  const [selectedUpiProvider, setSelectedUpiProvider] = useState<UpiProvider | null>(null);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const { user, updateSubscription } = useAuth();

  if (!plan) return null;

  const handlePayment = async () => {
    if (!user) return;
    
    setIsProcessing(true);
    try {
      // Create subscription
      const { subscriptionId, paymentUrl } = await subscriptionService.createSubscription(plan.id, user.id);
      
      // In a real implementation, you would integrate with Razorpay here
      // For demo purposes, we'll simulate a successful payment
      setTimeout(async () => {
        try {
          const subscription = await subscriptionService.verifyPayment('mock_payment_id', subscriptionId);
          updateSubscription(subscription);
          onClose();
          // Show success message
        } catch (error) {
          console.error('Payment verification failed:', error);
        } finally {
          setIsProcessing(false);
        }
      }, 2000);
      
    } catch (error) {
      console.error('Payment failed:', error);
      setIsProcessing(false);
    }
  };

  const handleMethodClick = (method: 'upi' | 'qr' | 'card') => {
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Your Purchase</DialogTitle>
          <DialogDescription>
            Subscribe to {plan.name} and unlock premium features
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Plan Summary */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <CardDescription>{plan.duration}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">₹{plan.price}</div>
                  {plan.discount && (
                    <Badge variant="secondary" className="text-xs">
                      Save {plan.discount}%
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Payment Methods */}
          <div className="space-y-3">
            <h3 className="font-medium">Choose Payment Method</h3>
            
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
                        `Pay ₹${plan.price} with UPI`
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
                          <p className="text-xs text-gray-400 mt-1">Amount: ₹{plan.price}</p>
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
                        `Pay ₹${plan.price}`
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

          {/* Security Footer */}
          <div className="text-center text-xs text-muted-foreground">
            <p>🔒 Secure payment powered by Razorpay</p>
            <p>Cancel anytime • 7-day free trial included</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
