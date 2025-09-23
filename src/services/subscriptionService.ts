// SUBSCRIPTION FEATURES DISABLED - Service preserved for future use
import { User, Subscription, PaymentPlan, SUBSCRIPTION_PLANS } from '@/types/subscription';
import { API_BASE_URL } from '@/lib/api';

export class SubscriptionService {
  // Note: The current backend does not expose subscription endpoints.
  // We keep this service for future integration and use a consistent base URL.
  private baseUrl = `${API_BASE_URL.replace(/\/$/, '')}/api`;

  async getPlans(): Promise<PaymentPlan[]> {
    return SUBSCRIPTION_PLANS;
  }

  async createSubscription(planId: string, userId: string): Promise<{ subscriptionId: string; paymentUrl: string }> {
    const response = await fetch(`${this.baseUrl}/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('dsa_auth_token')}`
      },
      body: JSON.stringify({ planId, userId })
    });

    if (!response.ok) {
      throw new Error('Failed to create subscription');
    }

    return response.json();
  }

  async verifyPayment(paymentId: string, subscriptionId: string): Promise<Subscription> {
    const response = await fetch(`${this.baseUrl}/subscriptions/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('dsa_auth_token')}`
      },
      body: JSON.stringify({ paymentId, subscriptionId })
    });

    if (!response.ok) {
      throw new Error('Payment verification failed');
    }

    return response.json();
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/subscriptions/${subscriptionId}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('dsa_auth_token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to cancel subscription');
    }
  }

  async getUserSubscription(userId: string): Promise<Subscription | null> {
    const response = await fetch(`${this.baseUrl}/users/${userId}/subscription`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('dsa_auth_token')}`
      }
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error('Failed to fetch subscription');
    }

    return response.json();
  }

  // Mock implementation for development
  async createMockUser(email: string, name: string): Promise<User> {
    const now = new Date();
    return {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      createdAt: now,
      lastLoginAt: now,
      preferences: {
        theme: 'system',
        language: 'javascript',
        difficulty: 'beginner',
        notifications: {
          email: true,
          push: false,
          reminders: true
        }
      },
      subscription: {
        id: Math.random().toString(36).substr(2, 9),
        userId: Math.random().toString(36).substr(2, 9),
        plan: 'free',
        status: 'active',
        startDate: now,
        endDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days
        trialUsed: false
      },
      progress: {
        topicsCompleted: [],
        challengesSolved: [],
        totalTimeSpent: 0,
        currentStreak: 0,
        longestStreak: 0,
        skillLevel: {
          arrays: 0,
          strings: 0,
          linkedLists: 0,
          trees: 0,
          graphs: 0,
          sorting: 0,
          searching: 0,
          dynamicProgramming: 0,
          overall: 0
        },
        achievements: []
      }
    };
  }
}

export const subscriptionService = new SubscriptionService();
