import {
  XPSystem,
  Achievement,
  Badge,
  Streak,
  DailyChallenge,
  UserProfile,
  XPGain,
  NotificationEvent,
  Leaderboard,
  LeaderboardEntry
} from '@/types/gamification';

export class GamificationEngine {
  private static instance: GamificationEngine;
  
  static getInstance(): GamificationEngine {
    if (!GamificationEngine.instance) {
      GamificationEngine.instance = new GamificationEngine();
    }
    return GamificationEngine.instance;
  }

  /**
   * Award XP to user for various activities
   */
  awardXP(userId: string, amount: number, reason: string, multiplier: number = 1): XPGain {
    const user = this.getUserProfile(userId);
    const streak = this.getStreak(userId);
    
    // Calculate bonuses
    const streakBonus = streak.current > 0 ? Math.min(streak.current * 0.1, 2.0) : 0;
    const totalMultiplier = multiplier * (1 + streakBonus);
    const finalAmount = Math.round(amount * totalMultiplier);
    
    // Update user XP
    user.xp.currentXP += finalAmount;
    user.xp.totalXPEarned += finalAmount;
    
    // Check for level up
    this.checkLevelUp(user);
    
    // Save user profile
    this.saveUserProfile(user);
    
    const xpGain: XPGain = {
      amount: finalAmount,
      reason,
      timestamp: new Date(),
      multiplier: totalMultiplier,
      bonus: finalAmount - amount
    };
    
    // Create notification
    this.createNotification(userId, {
      id: `xp-${Date.now()}`,
      type: 'achievement',
      title: `+${finalAmount} XP`,
      message: reason,
      timestamp: new Date(),
      read: false,
      data: xpGain
    });
    
    return xpGain;
  }

  /**
   * Check and unlock achievements
   */
  checkAchievements(userId: string, activity: string, data: any): Achievement[] {
    const user = this.getUserProfile(userId);
    const unlockedAchievements: Achievement[] = [];
    
    const achievements = this.getAllAchievements();
    
    achievements.forEach(achievement => {
      if (achievement.unlockedAt) return; // Already unlocked
      
      let progress = 0;
      let canUnlock = true;
      
      achievement.requirements.forEach(req => {
        switch (req.type) {
          case 'topics_completed':
            progress = user.stats.topicsCompleted;
            break;
          case 'streak_days':
            progress = user.streak.current;
            break;
          case 'quiz_score':
            progress = user.stats.averageQuizScore;
            break;
          case 'time_spent':
            progress = user.stats.totalStudyTime;
            break;
          case 'consecutive_days':
            progress = user.streak.longest;
            break;
        }
        
        if (progress < req.value) {
          canUnlock = false;
        }
      });
      
      // Update progress
      achievement.progress = Math.min((progress / achievement.maxProgress) * 100, 100);
      
      if (canUnlock && !achievement.unlockedAt) {
        achievement.unlockedAt = new Date();
        user.achievements.push(achievement);
        unlockedAchievements.push(achievement);
        
        // Award XP for achievement
        this.awardXP(userId, achievement.xpReward, `Achievement: ${achievement.name}`);
        
        // Create notification
        this.createNotification(userId, {
          id: `achievement-${achievement.id}`,
          type: 'achievement',
          title: 'Achievement Unlocked!',
          message: `${achievement.name}: ${achievement.description}`,
          timestamp: new Date(),
          read: false,
          data: achievement
        });
      }
    });
    
    this.saveUserProfile(user);
    return unlockedAchievements;
  }

  /**
   * Update user streak
   */
  updateStreak(userId: string): Streak {
    const user = this.getUserProfile(userId);
    const now = new Date();
    const lastActivity = user.streak.lastActivityDate;
    
    // Check if it's a new day
    const isNewDay = !lastActivity || 
      now.toDateString() !== lastActivity.toDateString();
    
    if (isNewDay) {
      const daysDiff = lastActivity ? 
        Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)) : 1;
      
      if (daysDiff === 1) {
        // Consecutive day
        user.streak.current += 1;
        user.streak.longest = Math.max(user.streak.longest, user.streak.current);
      } else if (daysDiff > 1) {
        // Streak broken
        user.streak.current = 1;
      }
      
      user.streak.lastActivityDate = now;
      
      // Check streak milestones
      user.streak.milestones.forEach(milestone => {
        if (user.streak.current >= milestone.days && !milestone.achieved) {
          milestone.achieved = true;
          this.awardXP(userId, milestone.reward.xp, `${milestone.days}-day streak!`);
          
          if (milestone.reward.badge) {
            this.awardBadge(userId, milestone.reward.badge);
          }
        }
      });
      
      this.saveUserProfile(user);
    }
    
    return user.streak;
  }

  /**
   * Generate daily challenge
   */
  generateDailyChallenge(userId: string): DailyChallenge {
    const today = new Date();
    const challengeId = `daily-${today.toISOString().split('T')[0]}`;
    
    // Check if challenge already exists for today
    const existingChallenge = this.getDailyChallenge(userId, today);
    if (existingChallenge) {
      return existingChallenge;
    }
    
    const user = this.getUserProfile(userId);
    const difficulties = ['easy', 'medium', 'hard'];
    const categories = ['Arrays', 'Strings', 'Trees', 'Graphs', 'Sorting'];
    
    // Select difficulty based on user level
    let difficulty: 'easy' | 'medium' | 'hard' = 'easy';
    if (user.level > 10) difficulty = 'medium';
    if (user.level > 25) difficulty = 'hard';
    
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    const challenge: DailyChallenge = {
      id: challengeId,
      date: today,
      title: `${category} Challenge`,
      description: `Complete a ${difficulty} ${category} problem`,
      difficulty,
      category,
      topicId: this.getRandomTopicByCategory(category),
      requirements: [
        {
          type: 'complete_topic',
          value: 1,
          description: 'Complete the assigned topic'
        },
        {
          type: 'quiz_score',
          value: difficulty === 'easy' ? 70 : difficulty === 'medium' ? 80 : 90,
          description: `Score at least ${difficulty === 'easy' ? 70 : difficulty === 'medium' ? 80 : 90}% on the quiz`
        }
      ],
      rewards: {
        xp: difficulty === 'easy' ? 100 : difficulty === 'medium' ? 200 : 300,
        badge: `daily-${difficulty}`,
        multiplier: 1.5
      },
      timeLimit: difficulty === 'easy' ? 30 : difficulty === 'medium' ? 45 : 60,
      completed: false
    };
    
    this.saveDailyChallenge(userId, challenge);
    return challenge;
  }

  /**
   * Create and manage leaderboards
   */
  updateLeaderboard(type: 'global' | 'friends' | 'local', timeframe: 'daily' | 'weekly' | 'monthly' | 'all-time'): Leaderboard {
    const users = this.getAllUsers();
    
    // Sort users based on criteria
    const sortedUsers = users.sort((a, b) => {
      switch (timeframe) {
        case 'daily':
          return this.getDailyXP(b.userId) - this.getDailyXP(a.userId);
        case 'weekly':
          return this.getWeeklyXP(b.userId) - this.getWeeklyXP(a.userId);
        case 'monthly':
          return this.getMonthlyXP(b.userId) - this.getMonthlyXP(a.userId);
        default:
          return b.xp.totalXPEarned - a.xp.totalXPEarned;
      }
    });
    
    const entries: LeaderboardEntry[] = sortedUsers.map((user, index) => ({
      userId: user.userId,
      username: user.username,
      avatar: user.avatar,
      score: timeframe === 'all-time' ? user.xp.totalXPEarned : this.getXPForTimeframe(user.userId, timeframe),
      rank: index + 1,
      change: this.getRankChange(user.userId, type, timeframe),
      badges: user.badges.slice(0, 3).map(b => b.id),
      level: user.level
    }));
    
    return {
      id: `${type}-${timeframe}`,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} Leaderboard`,
      type,
      timeframe,
      entries,
      userRank: entries.findIndex(e => e.userId === 'current-user') + 1 || undefined
    };
  }

  /**
   * Award badge to user
   */
  awardBadge(userId: string, badgeId: string): Badge {
    const user = this.getUserProfile(userId);
    const badgeTemplate = this.getBadgeTemplate(badgeId);
    
    const badge: Badge = {
      ...badgeTemplate,
      earnedAt: new Date()
    };
    
    user.badges.push(badge);
    this.saveUserProfile(user);
    
    // Create notification
    this.createNotification(userId, {
      id: `badge-${badgeId}`,
      type: 'achievement',
      title: 'Badge Earned!',
      message: `You earned the ${badge.name} badge`,
      timestamp: new Date(),
      read: false,
      data: badge
    });
    
    return badge;
  }

  // Private helper methods
  private checkLevelUp(user: UserProfile): boolean {
    const xpForNextLevel = this.calculateXPForLevel(user.level + 1);
    
    if (user.xp.currentXP >= xpForNextLevel) {
      user.level += 1;
      user.xp.currentXP -= xpForNextLevel;
      user.xp.xpToNextLevel = this.calculateXPForLevel(user.level + 1);
      
      // Create level up notification
      this.createNotification(user.userId, {
        id: `levelup-${user.level}`,
        type: 'level_up',
        title: 'Level Up!',
        message: `Congratulations! You reached level ${user.level}`,
        timestamp: new Date(),
        read: false,
        data: { newLevel: user.level }
      });
      
      return true;
    }
    
    user.xp.xpToNextLevel = xpForNextLevel - user.xp.currentXP;
    return false;
  }

  private calculateXPForLevel(level: number): number {
    // XP required increases exponentially
    return Math.floor(100 * Math.pow(1.5, level - 1));
  }

  private getAllAchievements(): Achievement[] {
    // Return predefined achievements
    return [
      {
        id: 'first-topic',
        name: 'First Steps',
        description: 'Complete your first topic',
        icon: '🎯',
        category: 'learning',
        rarity: 'common',
        xpReward: 50,
        progress: 0,
        maxProgress: 1,
        requirements: [{ type: 'topics_completed', value: 1 }]
      },
      {
        id: 'week-streak',
        name: 'Dedicated Learner',
        description: 'Maintain a 7-day learning streak',
        icon: '🔥',
        category: 'streak',
        rarity: 'rare',
        xpReward: 200,
        progress: 0,
        maxProgress: 7,
        requirements: [{ type: 'streak_days', value: 7 }]
      },
      {
        id: 'perfect-score',
        name: 'Perfectionist',
        description: 'Score 100% on 5 quizzes',
        icon: '⭐',
        category: 'mastery',
        rarity: 'epic',
        xpReward: 500,
        progress: 0,
        maxProgress: 5,
        requirements: [{ type: 'quiz_score', value: 100 }]
      }
      // Add more achievements...
    ];
  }

  public getUserProfile(userId: string): UserProfile {
    // Get user profile from storage or create default
    const stored = localStorage.getItem(`gamification-${userId}`);
    if (stored) {
      return JSON.parse(stored);
    }
    
    return this.createDefaultProfile(userId);
  }

  private createDefaultProfile(userId: string): UserProfile {
    return {
      userId,
      username: 'DSA Learner',
      level: 1,
      xp: {
        currentXP: 0,
        level: 1,
        xpToNextLevel: 100,
        totalXPEarned: 0,
        xpMultiplier: 1,
        streakBonus: 0
      },
      achievements: [],
      badges: [],
      streak: {
        current: 0,
        longest: 0,
        lastActivityDate: new Date(),
        streakType: 'daily',
        multiplier: 1,
        milestones: [
          { days: 3, reward: { xp: 50 }, achieved: false },
          { days: 7, reward: { xp: 150, badge: 'week-warrior' }, achieved: false },
          { days: 30, reward: { xp: 500, badge: 'month-master' }, achieved: false }
        ]
      },
      titles: [],
      stats: {
        topicsCompleted: 0,
        totalStudyTime: 0,
        averageQuizScore: 0,
        perfectScores: 0,
        challengesCompleted: 0,
        competitionsParticipated: 0,
        helpfulVotes: 0,
        questionsAnswered: 0
      },
      preferences: {
        showXPGains: true,
        enableNotifications: true,
        showLeaderboards: true,
        participateInChallenges: true,
        shareAchievements: true,
        competitiveMode: false
      }
    };
  }

  private saveUserProfile(user: UserProfile): void {
    localStorage.setItem(`gamification-${user.userId}`, JSON.stringify(user));
  }

  private getStreak(userId: string): Streak {
    const user = this.getUserProfile(userId);
    return user.streak;
  }

  private createNotification(userId: string, notification: NotificationEvent): void {
    const notifications = this.getNotifications(userId);
    notifications.unshift(notification);
    
    // Keep only last 50 notifications
    if (notifications.length > 50) {
      notifications.splice(50);
    }
    
    localStorage.setItem(`notifications-${userId}`, JSON.stringify(notifications));
  }

  private getNotifications(userId: string): NotificationEvent[] {
    const stored = localStorage.getItem(`notifications-${userId}`);
    return stored ? JSON.parse(stored) : [];
  }

  // Additional helper methods would be implemented here...
  private getDailyChallenge(userId: string, date: Date): DailyChallenge | null {
    const stored = localStorage.getItem(`daily-challenge-${userId}-${date.toISOString().split('T')[0]}`);
    return stored ? JSON.parse(stored) : null;
  }

  private saveDailyChallenge(userId: string, challenge: DailyChallenge): void {
    localStorage.setItem(`daily-challenge-${userId}-${challenge.date.toISOString().split('T')[0]}`, JSON.stringify(challenge));
  }

  private getRandomTopicByCategory(category: string): string {
    // Implementation to get random topic by category
    return 'array-fundamentals'; // Placeholder
  }

  private getAllUsers(): UserProfile[] {
    // Implementation to get all users for leaderboard
    return []; // Placeholder
  }

  private getDailyXP(userId: string): number {
    // Implementation to get daily XP
    return 0; // Placeholder
  }

  private getWeeklyXP(userId: string): number {
    // Implementation to get weekly XP
    return 0; // Placeholder
  }

  private getMonthlyXP(userId: string): number {
    // Implementation to get monthly XP
    return 0; // Placeholder
  }

  private getXPForTimeframe(userId: string, timeframe: string): number {
    // Implementation to get XP for specific timeframe
    return 0; // Placeholder
  }

  private getRankChange(userId: string, type: string, timeframe: string): number {
    // Implementation to get rank change
    return 0; // Placeholder
  }

  private getBadgeTemplate(badgeId: string): Omit<Badge, 'earnedAt'> {
    // Implementation to get badge template
    return {
      id: badgeId,
      name: 'Sample Badge',
      description: 'Sample badge description',
      icon: '🏆',
      color: 'gold',
      category: 'achievement'
    };
  }
}
