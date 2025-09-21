import { AdaptiveLearningEngine } from './adaptive-learning-engine';
import { GamificationEngine } from './gamification-engine';
import { AILearningAssistant } from './ai-learning-assistant';
import { StudySession } from '@/types/adaptive-learning';
import { dsaTopics } from '@/data/dsaTopics';

export class AdvancedFeaturesIntegration {
  private static instance: AdvancedFeaturesIntegration;
  
  static getInstance(): AdvancedFeaturesIntegration {
    if (!AdvancedFeaturesIntegration.instance) {
      AdvancedFeaturesIntegration.instance = new AdvancedFeaturesIntegration();
    }
    return AdvancedFeaturesIntegration.instance;
  }

  private adaptiveLearning = AdaptiveLearningEngine.getInstance();
  private gamification = GamificationEngine.getInstance();
  private aiAssistant = AILearningAssistant.getInstance();

  /**
   * Initialize advanced features for all topics
   */
  async initializeForAllTopics(): Promise<void> {
    console.log('🚀 Initializing advanced features for all DSA topics...');
    
    // Ensure all topics have proper metadata
    dsaTopics.forEach(topic => {
      this.ensureTopicMetadata(topic);
    });

    console.log(`✅ Advanced features initialized for ${dsaTopics.length} topics`);
  }

  /**
   * Ensure each topic has the necessary metadata for advanced features
   */
  private ensureTopicMetadata(topic: any): void {
    // Ensure topic has required fields for advanced features
    if (!topic.advancedFeatures) {
      topic.advancedFeatures = {
        hasCodeEditor: this.shouldHaveCodeEditor(topic),
        hasAIExplanations: true,
        hasAdaptiveLearning: true,
        hasGamification: true,
        hasInterviewQuestions: this.shouldHaveInterviewQuestions(topic),
        xpReward: this.calculateXPReward(topic),
        achievements: this.getTopicAchievements(topic)
      };
    }
  }

  /**
   * Determine if topic should have code editor
   */
  private shouldHaveCodeEditor(topic: any): boolean {
    const codingCategories = [
      'Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs',
      'Sorting', 'Searching', 'Dynamic Programming', 'Greedy',
      'Backtracking', 'Recursion', 'Hashing'
    ];
    return codingCategories.includes(topic.category);
  }

  /**
   * Determine if topic should have interview questions
   */
  private shouldHaveInterviewQuestions(topic: any): boolean {
    const interviewTopics = [
      'Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs',
      'Sorting', 'Searching', 'Dynamic Programming', 'Two Pointers',
      'Sliding Window', 'Hashing'
    ];
    return interviewTopics.includes(topic.category);
  }

  /**
   * Calculate XP reward based on topic difficulty and category
   */
  private calculateXPReward(topic: any): number {
    const baseXP = {
      'easy': 50,
      'medium': 75,
      'hard': 100
    };

    const categoryMultiplier = {
      'Arrays': 1.0,
      'Strings': 1.1,
      'Linked Lists': 1.2,
      'Trees': 1.3,
      'Graphs': 1.5,
      'Dynamic Programming': 1.6,
      'Greedy': 1.4,
      'Backtracking': 1.5,
      'Advanced Data Structures': 1.7
    };

    const base = baseXP[topic.difficulty as keyof typeof baseXP] || 50;
    const multiplier = categoryMultiplier[topic.category as keyof typeof categoryMultiplier] || 1.0;
    
    return Math.round(base * multiplier);
  }

  /**
   * Get topic-specific achievements
   */
  private getTopicAchievements(topic: any): string[] {
    const achievements = [];
    
    // Category-based achievements
    achievements.push(`${topic.category.toLowerCase()}-explorer`);
    
    // Difficulty-based achievements
    if (topic.difficulty === 'hard') {
      achievements.push('challenge-master');
    }
    
    // Special topic achievements
    if (topic.id.includes('sort')) {
      achievements.push('sorting-specialist');
    }
    if (topic.id.includes('search')) {
      achievements.push('search-expert');
    }
    if (topic.category === 'Dynamic Programming') {
      achievements.push('dp-ninja');
    }
    if (topic.category === 'Graphs') {
      achievements.push('graph-traverser');
    }
    
    return achievements;
  }

  /**
   * Track topic completion with all advanced features
   */
  async trackTopicCompletion(
    userId: string, 
    topicId: string, 
    score: number, 
    timeSpent: number,
    activitiesCompleted: string[]
  ): Promise<{
    xpGained: number;
    achievementsUnlocked: any[];
    adaptiveRecommendations: any[];
    levelUp: boolean;
  }> {
    
    const topic = dsaTopics.find(t => t.id === topicId);
    if (!topic) {
      throw new Error(`Topic ${topicId} not found`);
    }

    // Create study session
    const session: StudySession = {
      id: `session-${Date.now()}`,
      userId,
      topicId,
      startTime: new Date(Date.now() - timeSpent * 60 * 1000),
      endTime: new Date(),
      duration: timeSpent,
      activitiesCompleted,
      quizScore: score,
      conceptsUnderstood: score >= 80 ? [topicId] : [],
      struggledConcepts: score < 60 ? [topicId] : [],
      notes: '',
      satisfactionRating: score >= 80 ? 5 : score >= 60 ? 4 : 3
    };

    // Save session
    const sessions = JSON.parse(localStorage.getItem(`sessions-${userId}`) || '[]');
    sessions.push(session);
    localStorage.setItem(`sessions-${userId}`, JSON.stringify(sessions));

    // Award XP
    const xpAmount = (topic as any).advancedFeatures?.xpReward || this.calculateXPReward(topic);
    const xpGain = this.gamification.awardXP(userId, xpAmount, `Completed ${topic.title}`);

    // Check achievements
    const achievementsUnlocked = this.gamification.checkAchievements(userId, 'topic_completed', session);

    // Update streak
    this.gamification.updateStreak(userId);

    // Generate adaptive recommendations
    const adaptiveData = this.adaptiveLearning.generateAdaptiveLearning(userId, sessions);

    // Check for level up
    const userProfile = this.gamification.getUserProfile(userId);
    const levelUp = userProfile.level > (userProfile.level - 1);

    return {
      xpGained: xpGain.amount,
      achievementsUnlocked,
      adaptiveRecommendations: adaptiveData.nextRecommendations,
      levelUp
    };
  }

  /**
   * Get AI explanation for any topic
   */
  async getTopicAIExplanation(userId: string, topicId: string): Promise<any> {
    const sessions = JSON.parse(localStorage.getItem(`sessions-${userId}`) || '[]');
    const adaptiveData = this.adaptiveLearning.generateAdaptiveLearning(userId, sessions);
    
    return await this.aiAssistant.generatePersonalizedExplanation(
      topicId,
      userId,
      adaptiveData.learningStyle,
      70 // default understanding level
    );
  }

  /**
   * Generate interview questions for topic
   */
  async generateInterviewQuestions(topicId: string, difficulty: 'easy' | 'medium' | 'hard'): Promise<any[]> {
    return await this.aiAssistant.generateIntelligentQuestions(topicId, difficulty, 3);
  }

  /**
   * Get personalized study plan for user
   */
  async getPersonalizedStudyPlan(userId: string): Promise<any> {
    const sessions = JSON.parse(localStorage.getItem(`sessions-${userId}`) || '[]');
    const userProfile = this.gamification.getUserProfile(userId);
    const adaptiveData = this.adaptiveLearning.generateAdaptiveLearning(userId, sessions);
    
    return this.aiAssistant.generateStudyRecommendations(
      userProfile,
      adaptiveData.learningStyle,
      adaptiveData.weakAreas,
      60 // 60 minutes available time
    );
  }

  /**
   * Get comprehensive analytics for user
   */
  getAdvancedAnalytics(userId: string): any {
    const sessions = JSON.parse(localStorage.getItem(`sessions-${userId}`) || '[]');
    const userProfile = this.gamification.getUserProfile(userId);
    const adaptiveData = this.adaptiveLearning.generateAdaptiveLearning(userId, sessions);

    return {
      totalTopicsCompleted: userProfile.stats.topicsCompleted,
      totalXPEarned: userProfile.xp.totalXPEarned,
      currentLevel: userProfile.level,
      currentStreak: userProfile.streak.current,
      longestStreak: userProfile.streak.longest,
      averageScore: userProfile.stats.averageQuizScore,
      totalStudyTime: userProfile.stats.totalStudyTime,
      achievementsCount: userProfile.achievements.length,
      learningStyle: adaptiveData.learningStyle,
      strongAreas: adaptiveData.strongAreas,
      weakAreas: adaptiveData.weakAreas,
      recommendedTopics: adaptiveData.recommendedTopics,
      difficultyAdjustment: adaptiveData.difficultyAdjustment,
      personalizedPath: adaptiveData.personalizedPath
    };
  }

  /**
   * Reset user progress (for testing)
   */
  resetUserProgress(userId: string): void {
    localStorage.removeItem(`sessions-${userId}`);
    localStorage.removeItem(`gamification-${userId}`);
    localStorage.removeItem(`notifications-${userId}`);
    console.log(`Reset progress for user ${userId}`);
  }

  /**
   * Validate advanced features are working
   */
  validateAdvancedFeatures(): boolean {
    try {
      // Test each service
      const testUserId = 'test-validation-user';
      
      // Test gamification
      const gamificationTest = this.gamification.awardXP(testUserId, 10, 'Validation test');
      
      // Test adaptive learning with empty sessions
      const adaptiveTest = this.adaptiveLearning.generateAdaptiveLearning(testUserId, []);
      
      // Clean up test data
      this.resetUserProgress(testUserId);
      
      console.log('✅ Advanced features validation passed');
      return true;
    } catch (error) {
      console.error('❌ Advanced features validation failed:', error);
      return false;
    }
  }
}
