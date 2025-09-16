import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CreditCard, Smartphone, Wallet } from 'lucide-react';
import { PaymentPlan } from '@/types/subscription';
import { useAuth } from '@/contexts/auth-context';
import { subscriptionService } from '@/services/subscriptionService';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PaymentPlan | null;
}

export function PaymentModal({ isOpen, onClose, plan }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'wallet'>('upi');
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

  const paymentMethods = [
    {
      id: 'upi' as const,
      name: 'UPI',
      description: 'Pay with Google Pay, PhonePe, Paytm',
      icon: Smartphone,
      popular: true
    },
    {
      id: 'card' as const,
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, RuPay',
      icon: CreditCard
    },
    {
      id: 'wallet' as const,
      name: 'Digital Wallet',
      description: 'Paytm, Amazon Pay, etc.',
      icon: Wallet
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
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
            {paymentMethods.map((method) => (
              <Card 
                key={method.id}
                className={`cursor-pointer transition-colors ${
                  paymentMethod === method.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                }`}
                onClick={() => setPaymentMethod(method.id)}
              >
                <CardContent className="flex items-center gap-3 p-4">
                  <method.icon className="w-5 h-5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{method.name}</span>
                      {method.popular && (
                        <Badge variant="secondary" className="text-xs">Popular</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    paymentMethod === method.id ? 'border-primary bg-primary' : 'border-muted-foreground'
                  }`} />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Payment Button */}
          <div className="space-y-4">
            <Button 
              className="w-full" 
              onClick={handlePayment}
              disabled={isProcessing}
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
              <p>🔒 Secure payment powered by Razorpay</p>
              <p>Cancel anytime • 7-day free trial included</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
