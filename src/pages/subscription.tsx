import React, { useState } from 'react';
import { PricingPlans } from '@/components/subscription/pricing-plans';
import { PaymentModal } from '@/components/subscription/payment-modal';
import { SubscriptionDashboard } from '@/components/subscription/subscription-dashboard';
import { PaymentPlan } from '@/types/subscription';
import { useAuth } from '@/contexts/auth-context';

export function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { isAuthenticated, isPremium } = useAuth();

  const handleSelectPlan = (plan: PaymentPlan) => {
    if (plan.id === 'free') return;
    
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedPlan(null);
  };

  // Show dashboard for authenticated premium users
  if (isAuthenticated && isPremium) {
    return <SubscriptionDashboard />;
  }

  // Show pricing plans for everyone else
  return (
    <>
      <PricingPlans onSelectPlan={handleSelectPlan} />
      <PaymentModal 
        isOpen={showPaymentModal}
        onClose={handleClosePaymentModal}
        plan={selectedPlan}
      />
    </>
  );
}
