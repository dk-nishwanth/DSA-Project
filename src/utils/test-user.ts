import { User } from '@/types/subscription';

export function createTestUser(plan: 'free' | 'monthly' | 'yearly' = 'free'): User {
  const now = new Date();
  let endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days default
  let subscriptionPlan: 'free' | 'premium' = 'free';
  
  if (plan === 'monthly') {
    subscriptionPlan = 'premium';
    endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
  } else if (plan === 'yearly') {
    subscriptionPlan = 'premium';
    endDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 365 days
  }

  return {
    id: 'test-user-' + Date.now(),
    email: 'learner@example.com',
    name: 'DSA Learner',
    role: 'user',
    createdAt: now,
    lastLoginAt: now,
    preferences: {
      theme: 'system',
      language: 'javascript',
      difficulty: 'beginner',
      notifications: { email: true, push: false, reminders: true }
    },
    subscription: {
      id: 'sub-' + Date.now(),
      userId: 'test-user-' + Date.now(),
      plan: subscriptionPlan,
      status: 'active',
      startDate: now,
      endDate: endDate,
      trialUsed: false
    },
    progress: {
      topicsCompleted: [],
      challengesSolved: [],
      totalTimeSpent: 0,
      currentStreak: 0,
      longestStreak: 0,
      skillLevel: {
        arrays: 0, strings: 0, linkedLists: 0, trees: 0, graphs: 0,
        sorting: 0, searching: 0, dynamicProgramming: 0, overall: 0
      },
      achievements: []
    }
  };
}

// Helper function to set a test user in localStorage
export function setTestUser(plan: 'free' | 'monthly' | 'yearly' = 'free') {
  const testUser = createTestUser(plan);
  localStorage.setItem('dsa_user', JSON.stringify(testUser));
  localStorage.setItem('dsa_token', 'test-token-' + Date.now());
  console.log(`Test user created with ${plan} plan:`, testUser);
  return testUser;
}
