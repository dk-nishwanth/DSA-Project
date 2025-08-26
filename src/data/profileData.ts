export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  joinDate: Date;
  lastActive: Date;
  preferences: UserPreferences;
  progress: LearningProgress;
  achievements: Achievement[];
  statistics: UserStatistics;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja';
  notifications: {
    email: boolean;
    push: boolean;
    quizReminders: boolean;
    progressUpdates: boolean;
  };
  accessibility: {
    fontSize: 'small' | 'medium' | 'large';
    highContrast: boolean;
    reducedMotion: boolean;
  };
  learning: {
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'all';
    topicsPerSession: number;
    autoAdvance: boolean;
    showHints: boolean;
  };
}

export interface LearningProgress {
  completedTopics: string[];
  inProgressTopics: string[];
  quizScores: Record<string, QuizScore[]>;
  timeSpent: Record<string, number>; // minutes spent on each topic
  streakDays: number;
  lastStudyDate: Date;
  totalStudyTime: number; // total minutes
  certificates: Certificate[];
}

export interface QuizScore {
  topicId: string;
  score: number;
  totalQuestions: number;
  date: Date;
  timeTaken: number; // seconds
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Certificate {
  id: string;
  topicId: string;
  title: string;
  issueDate: Date;
  score: number;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedDate?: Date;
  progress: number; // 0-100
  maxProgress: number;
  category: 'learning' | 'quiz' | 'streak' | 'exploration';
}

export interface UserStatistics {
  totalTopics: number;
  completedTopics: number;
  totalQuizzes: number;
  averageQuizScore: number;
  totalStudyTime: number; // hours
  currentStreak: number;
  longestStreak: number;
  favoriteTopics: string[];
  weakAreas: string[];
  weeklyProgress: WeeklyProgress[];
  monthlyProgress: MonthlyProgress[];
}

export interface WeeklyProgress {
  week: string; // YYYY-WW format
  topicsCompleted: number;
  quizzesTaken: number;
  averageScore: number;
  studyTime: number; // minutes
}

export interface MonthlyProgress {
  month: string; // YYYY-MM format
  topicsCompleted: number;
  quizzesTaken: number;
  averageScore: number;
  studyTime: number; // hours
  achievementsUnlocked: number;
}

// Sample achievements
export const ACHIEVEMENTS: Omit<Achievement, 'unlockedDate' | 'progress'>[] = [
  {
    id: 'first-topic',
    title: 'First Steps',
    description: 'Complete your first DSA topic',
    icon: '🎯',
    maxProgress: 1,
    category: 'learning'
  },
  {
    id: 'quiz-master',
    title: 'Quiz Master',
    description: 'Score 100% on 10 quizzes',
    icon: '🏆',
    maxProgress: 10,
    category: 'quiz'
  },
  {
    id: 'streak-7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day study streak',
    icon: '🔥',
    maxProgress: 7,
    category: 'streak'
  },
  {
    id: 'streak-30',
    title: 'Monthly Master',
    description: 'Maintain a 30-day study streak',
    icon: '⚡',
    maxProgress: 30,
    category: 'streak'
  },
  {
    id: 'array-expert',
    title: 'Array Expert',
    description: 'Complete all array-related topics',
    icon: '📊',
    maxProgress: 3,
    category: 'learning'
  },
  {
    id: 'sorting-specialist',
    title: 'Sorting Specialist',
    description: 'Master all sorting algorithms',
    icon: '🔄',
    maxProgress: 8,
    category: 'learning'
  },
  {
    id: 'graph-explorer',
    title: 'Graph Explorer',
    description: 'Complete all graph algorithms',
    icon: '🕸️',
    maxProgress: 6,
    category: 'learning'
  },
  {
    id: 'dp-wizard',
    title: 'Dynamic Programming Wizard',
    description: 'Complete all DP topics',
    icon: '🧙‍♂️',
    maxProgress: 4,
    category: 'learning'
  },
  {
    id: 'speed-demon',
    title: 'Speed Demon',
    description: 'Complete 5 quizzes in under 2 minutes each',
    icon: '⚡',
    maxProgress: 5,
    category: 'quiz'
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Get perfect scores on 5 consecutive quizzes',
    icon: '💎',
    maxProgress: 5,
    category: 'quiz'
  },
  {
    id: 'explorer',
    title: 'Topic Explorer',
    description: 'Visit all topic categories',
    icon: '🗺️',
    maxProgress: 18,
    category: 'exploration'
  },
  {
    id: 'night-owl',
    title: 'Night Owl',
    description: 'Study for 5 hours after 10 PM',
    icon: '🦉',
    maxProgress: 300, // minutes
    category: 'learning'
  },
  {
    id: 'early-bird',
    title: 'Early Bird',
    description: 'Study for 5 hours before 8 AM',
    icon: '🐦',
    maxProgress: 300, // minutes
    category: 'learning'
  },
  {
    id: 'weekend-warrior',
    title: 'Weekend Warrior',
    description: 'Complete 10 topics on weekends',
    icon: '🏃‍♂️',
    maxProgress: 10,
    category: 'learning'
  },
  {
    id: 'consistency-king',
    title: 'Consistency King',
    description: 'Study for 14 consecutive days',
    icon: '👑',
    maxProgress: 14,
    category: 'streak'
  }
];

// Sample user profile
export const SAMPLE_PROFILE: UserProfile = {
  id: 'user-1',
  username: 'DSA_Learner',
  email: 'learner@example.com',
  avatar: '/avatars/default.png',
  joinDate: new Date('2024-01-15'),
  lastActive: new Date(),
  preferences: {
    theme: 'system',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      quizReminders: true,
      progressUpdates: true
    },
    accessibility: {
      fontSize: 'medium',
      highContrast: false,
      reducedMotion: false
    },
    learning: {
      difficulty: 'all',
      topicsPerSession: 3,
      autoAdvance: true,
      showHints: true
    }
  },
  progress: {
    completedTopics: ['array-basics', 'bubble-sort', 'linear-search', 'binary-search', 'merge-sort', 'quick-sort'],
    inProgressTopics: ['binary-search', 'merge-sort'],
    quizScores: {
      'array-basics': [
        {
          topicId: 'array-basics',
          score: 2,
          totalQuestions: 2,
          date: new Date('2024-01-20'),
          timeTaken: 120,
          difficulty: 'easy'
        }
      ],
      'bubble-sort': [
        {
          topicId: 'bubble-sort',
          score: 1,
          totalQuestions: 1,
          date: new Date('2024-01-21'),
          timeTaken: 90,
          difficulty: 'easy'
        }
      ]
    },
    timeSpent: {
      'array-basics': 45,
      'bubble-sort': 30,
      'linear-search': 25
    },
    streakDays: 5,
    lastStudyDate: new Date(),
    totalStudyTime: 100,
    certificates: [
      {
        id: 'cert-1',
        topicId: 'array-basics',
        title: 'Array Fundamentals Certificate',
        issueDate: new Date('2024-01-20'),
        score: 100,
        level: 'beginner'
      }
    ]
  },
  achievements: [
    {
      id: 'first-topic',
      title: 'First Steps',
      description: 'Complete your first DSA topic',
      icon: '🎯',
      unlockedDate: new Date('2024-01-20'),
      progress: 1,
      maxProgress: 1,
      category: 'learning'
    },
    {
      id: 'streak-7',
      title: 'Week Warrior',
      description: 'Maintain a 7-day study streak',
      icon: '🔥',
      progress: 5,
      maxProgress: 7,
      category: 'streak'
    }
  ],
  statistics: {
    totalTopics: 80,
    completedTopics: 3,
    totalQuizzes: 2,
    averageQuizScore: 75,
    totalStudyTime: 1.67, // hours
    currentStreak: 5,
    longestStreak: 5,
    favoriteTopics: ['array-basics', 'bubble-sort'],
    weakAreas: ['dynamic-programming', 'graph-algorithms'],
    weeklyProgress: [
      {
        week: '2024-03',
        topicsCompleted: 2,
        quizzesTaken: 2,
        averageScore: 75,
        studyTime: 100
      }
    ],
    monthlyProgress: [
      {
        month: '2024-01',
        topicsCompleted: 3,
        quizzesTaken: 2,
        averageScore: 75,
        studyTime: 1.67,
        achievementsUnlocked: 1
      }
    ]
  }
};

// Profile management functions
export const updateProfile = (profile: UserProfile, updates: Partial<UserProfile>): UserProfile => {
  return { ...profile, ...updates };
};

export const addQuizScore = (profile: UserProfile, quizScore: QuizScore): UserProfile => {
  const existingScores = profile.progress.quizScores[quizScore.topicId] || [];
  const updatedScores = [...existingScores, quizScore];
  
  return {
    ...profile,
    progress: {
      ...profile.progress,
      quizScores: {
        ...profile.progress.quizScores,
        [quizScore.topicId]: updatedScores
      }
    }
  };
};

export const completeTopic = (profile: UserProfile, topicId: string): UserProfile => {
  const completedTopics = [...profile.progress.completedTopics, topicId];
  const inProgressTopics = profile.progress.inProgressTopics.filter(id => id !== topicId);
  
  return {
    ...profile,
    progress: {
      ...profile.progress,
      completedTopics,
      inProgressTopics
    }
  };
};

export const updateStudyTime = (profile: UserProfile, topicId: string, minutes: number): UserProfile => {
  const currentTime = profile.progress.timeSpent[topicId] || 0;
  
  return {
    ...profile,
    progress: {
      ...profile.progress,
      timeSpent: {
        ...profile.progress.timeSpent,
        [topicId]: currentTime + minutes
      },
      totalStudyTime: profile.progress.totalStudyTime + minutes
    }
  };
};

export const checkAchievements = (profile: UserProfile): Achievement[] => {
  const newAchievements: Achievement[] = [];
  
  // Check for new achievements based on current progress
  ACHIEVEMENTS.forEach(achievement => {
    const existingAchievement = profile.achievements.find(a => a.id === achievement.id);
    if (existingAchievement && existingAchievement.unlockedDate) return; // Already unlocked
    
    let progress = 0;
    let shouldUnlock = false;
    
    switch (achievement.id) {
      case 'first-topic':
        progress = profile.progress.completedTopics.length;
        shouldUnlock = progress >= 1;
        break;
      case 'quiz-master':
        const perfectScores = Object.values(profile.progress.quizScores)
          .flat()
          .filter(score => score.score === score.totalQuestions).length;
        progress = perfectScores;
        shouldUnlock = perfectScores >= 10;
        break;
      case 'streak-7':
        progress = profile.progress.streakDays;
        shouldUnlock = profile.progress.streakDays >= 7;
        break;
      case 'streak-30':
        progress = profile.progress.streakDays;
        shouldUnlock = profile.progress.streakDays >= 30;
        break;
      case 'array-expert':
        const arrayTopics = ['array-basics', 'array-rotation', 'array-subarray-problems'];
        progress = arrayTopics.filter(topic => 
          profile.progress.completedTopics.includes(topic)
        ).length;
        shouldUnlock = progress >= 3;
        break;
      // Add more achievement checks as needed
    }
    
    if (shouldUnlock) {
      newAchievements.push({
        ...achievement,
        unlockedDate: new Date(),
        progress: Math.min(progress, achievement.maxProgress)
      });
    } else if (progress > 0) {
      newAchievements.push({
        ...achievement,
        progress: Math.min(progress, achievement.maxProgress)
      });
    }
  });
  
  return newAchievements;
};
