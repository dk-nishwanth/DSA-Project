export interface XPSystem {
  currentXP: number;
  level: number;
  xpToNextLevel: number;
  totalXPEarned: number;
  xpMultiplier: number;
  streakBonus: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'learning' | 'streak' | 'mastery' | 'social' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  unlockedAt?: Date;
  progress: number; // 0-100
  maxProgress: number;
  requirements: AchievementRequirement[];
}

export interface AchievementRequirement {
  type: 'topics_completed' | 'streak_days' | 'quiz_score' | 'time_spent' | 'consecutive_days';
  value: number;
  category?: string; // For topic-specific achievements
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedAt: Date;
  category: string;
}

export interface Streak {
  current: number;
  longest: number;
  lastActivityDate: Date;
  streakType: 'daily' | 'weekly' | 'monthly';
  multiplier: number;
  milestones: StreakMilestone[];
}

export interface StreakMilestone {
  days: number;
  reward: {
    xp: number;
    badge?: string;
    title?: string;
    multiplier?: number;
  };
  achieved: boolean;
}

export interface Leaderboard {
  id: string;
  name: string;
  type: 'global' | 'friends' | 'local' | 'category';
  timeframe: 'daily' | 'weekly' | 'monthly' | 'all-time';
  category?: string;
  entries: LeaderboardEntry[];
  userRank?: number;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar?: string;
  score: number;
  rank: number;
  change: number; // Position change from last period
  badges: string[];
  level: number;
}

export interface DailyChallenge {
  id: string;
  date: Date;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  topicId: string;
  requirements: ChallengeRequirement[];
  rewards: ChallengeReward;
  timeLimit?: number; // In minutes
  completed: boolean;
  score?: number;
  completedAt?: Date;
}

export interface ChallengeRequirement {
  type: 'complete_topic' | 'quiz_score' | 'time_limit' | 'no_hints';
  value: number;
  description: string;
}

export interface ChallengeReward {
  xp: number;
  badge?: string;
  title?: string;
  multiplier?: number;
  specialReward?: string;
}

export interface Competition {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  type: 'individual' | 'team';
  category: string;
  participants: CompetitionParticipant[];
  prizes: CompetitionPrize[];
  rules: string[];
  status: 'upcoming' | 'active' | 'completed';
}

export interface CompetitionParticipant {
  userId: string;
  username: string;
  score: number;
  rank: number;
  teamId?: string;
  submissions: CompetitionSubmission[];
}

export interface CompetitionSubmission {
  id: string;
  userId: string;
  problemId: string;
  code: string;
  language: string;
  score: number;
  submittedAt: Date;
  executionTime: number;
  memoryUsed: number;
}

export interface CompetitionPrize {
  rank: number;
  reward: {
    xp: number;
    badge: string;
    title: string;
    specialReward?: string;
  };
}

export interface UserProfile {
  userId: string;
  username: string;
  avatar?: string;
  level: number;
  xp: XPSystem;
  achievements: Achievement[];
  badges: Badge[];
  streak: Streak;
  titles: UserTitle[];
  activeTitle?: string;
  stats: UserStats;
  preferences: GamificationPreferences;
}

export interface UserTitle {
  id: string;
  name: string;
  description: string;
  earnedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserStats {
  topicsCompleted: number;
  totalStudyTime: number; // In minutes
  averageQuizScore: number;
  perfectScores: number;
  challengesCompleted: number;
  competitionsParticipated: number;
  helpfulVotes: number;
  questionsAnswered: number;
}

export interface GamificationPreferences {
  showXPGains: boolean;
  enableNotifications: boolean;
  showLeaderboards: boolean;
  participateInChallenges: boolean;
  shareAchievements: boolean;
  competitiveMode: boolean;
}

export interface XPGain {
  amount: number;
  reason: string;
  timestamp: Date;
  multiplier?: number;
  bonus?: number;
}

export interface NotificationEvent {
  id: string;
  type: 'achievement' | 'level_up' | 'streak' | 'challenge' | 'competition';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  data?: any;
}
