// SUBSCRIPTION FEATURES DISABLED - Types preserved for future use
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: 'user' | 'admin';
  createdAt: Date;
  lastLoginAt: Date;
  preferences: UserPreferences;
  subscription: Subscription;
  progress: UserProgress;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'javascript' | 'python' | 'java' | 'cpp';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  notifications: {
    email: boolean;
    push: boolean;
    reminders: boolean;
  };
}

export interface Subscription {
  id: string;
  userId: string;
  plan: 'free' | 'premium';
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  startDate: Date;
  endDate: Date;
  paymentMethod?: string;
  razorpaySubscriptionId?: string;
  trialUsed: boolean;
}

export interface UserProgress {
  topicsCompleted: string[];
  challengesSolved: string[];
  totalTimeSpent: number; // in minutes
  currentStreak: number;
  longestStreak: number;
  skillLevel: {
    arrays: number;
    strings: number;
    linkedLists: number;
    trees: number;
    graphs: number;
    sorting: number;
    searching: number;
    dynamicProgramming: number;
    overall: number;
  };
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  category: 'learning' | 'practice' | 'streak' | 'milestone';
}

export interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  currency: 'INR';
  duration: 'monthly' | 'yearly';
  features: string[];
  popular?: boolean;
  discount?: number;
}

export const SUBSCRIPTION_PLANS: PaymentPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'INR',
    duration: 'monthly',
    features: [
      '5 topics per month',
      'Basic visualizations',
      'Limited practice problems',
      'Community support'
    ]
  },
  {
    id: 'premium-monthly',
    name: 'Premium Monthly',
    price: 50,
    currency: 'INR',
    duration: 'monthly',
    popular: true,
    features: [
      'Unlimited access to all topics',
      'Advanced interactive visualizations',
      'Unlimited practice problems',
      'Personalized learning paths',
      'Progress tracking & analytics',
      'Mock interview questions',
      'Priority support',
      'Downloadable resources'
    ]
  },
  {
    id: 'premium-yearly',
    name: 'Premium Yearly',
    price: 500,
    currency: 'INR',
    duration: 'yearly',
    discount: 17, // 2 months free
    features: [
      'All Premium Monthly features',
      '2 months free (17% savings)',
      'Exclusive yearly challenges',
      'Direct mentor access',
      'Certificate of completion'
    ]
  }
];
