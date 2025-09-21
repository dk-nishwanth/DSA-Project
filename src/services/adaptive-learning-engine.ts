import { 
  AdaptiveLearning, 
  PerformanceMetrics, 
  LearningPath, 
  LearningStyle, 
  TopicRecommendation,
  StudySession,
  LearningAnalytics,
  SkillAnalysis
} from '@/types/adaptive-learning';
import { dsaTopics } from '@/data/dsaTopics';

export class AdaptiveLearningEngine {
  private static instance: AdaptiveLearningEngine;
  
  static getInstance(): AdaptiveLearningEngine {
    if (!AdaptiveLearningEngine.instance) {
      AdaptiveLearningEngine.instance = new AdaptiveLearningEngine();
    }
    return AdaptiveLearningEngine.instance;
  }

  /**
   * Analyzes user performance and generates adaptive learning recommendations
   */
  generateAdaptiveLearning(userId: string, sessions: StudySession[]): AdaptiveLearning {
    const performance = this.calculatePerformanceMetrics(sessions);
    const learningStyle = this.detectLearningStyle(sessions);
    const skillAnalysis = this.analyzeSkills(performance);
    
    return {
      userPerformance: performance,
      recommendedTopics: this.generateTopicRecommendations(performance, skillAnalysis),
      difficultyAdjustment: this.calculateDifficultyAdjustment(performance),
      personalizedPath: this.createPersonalizedPath(performance, learningStyle),
      learningStyle,
      weakAreas: this.identifyWeakAreas(skillAnalysis),
      strongAreas: this.identifyStrongAreas(skillAnalysis),
      nextRecommendations: this.generateDetailedRecommendations(performance, skillAnalysis)
    };
  }

  /**
   * Calculates comprehensive performance metrics from study sessions
   */
  private calculatePerformanceMetrics(sessions: StudySession[]): PerformanceMetrics {
    const metrics: PerformanceMetrics = {
      topicScores: {},
      averageCompletionTime: {},
      attemptCounts: {},
      quizScores: {},
      conceptualUnderstanding: {},
      practicalApplication: {},
      retentionRate: {},
      lastAccessed: {}
    };

    // Group sessions by topic
    const topicSessions = sessions.reduce((acc, session) => {
      if (!acc[session.topicId]) acc[session.topicId] = [];
      acc[session.topicId].push(session);
      return acc;
    }, {} as Record<string, StudySession[]>);

    // Calculate metrics for each topic
    Object.entries(topicSessions).forEach(([topicId, topicSessions]) => {
      // Average quiz scores
      const quizScores = topicSessions
        .filter(s => s.quizScore !== undefined)
        .map(s => s.quizScore!);
      
      metrics.quizScores[topicId] = quizScores;
      metrics.topicScores[topicId] = quizScores.length > 0 
        ? quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length 
        : 0;

      // Average completion time
      const completionTimes = topicSessions.map(s => s.duration);
      metrics.averageCompletionTime[topicId] = completionTimes.length > 0
        ? completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length
        : 0;

      // Attempt counts
      metrics.attemptCounts[topicId] = topicSessions.length;

      // Conceptual understanding (based on quiz performance and session quality)
      metrics.conceptualUnderstanding[topicId] = this.calculateConceptualUnderstanding(topicSessions);

      // Practical application (based on coding exercises and problem solving)
      metrics.practicalApplication[topicId] = this.calculatePracticalApplication(topicSessions);

      // Retention rate (based on performance over time)
      metrics.retentionRate[topicId] = this.calculateRetentionRate(topicSessions);

      // Last accessed
      metrics.lastAccessed[topicId] = new Date(Math.max(...topicSessions.map(s => s.startTime.getTime())));
    });

    return metrics;
  }

  /**
   * Detects user's learning style based on session patterns
   */
  private detectLearningStyle(sessions: StudySession[]): LearningStyle {
    // Analyze user behavior patterns to determine learning preferences
    let visualScore = 0;
    let auditoryScore = 0;
    let kinestheticScore = 0;
    let readingScore = 0;

    sessions.forEach(session => {
      // Visual learners tend to spend more time on visualizations
      if (session.activitiesCompleted.includes('visualization')) {
        visualScore += 2;
      }
      
      // Auditory learners prefer voice explanations
      if (session.activitiesCompleted.includes('voice-explanation')) {
        auditoryScore += 2;
      }
      
      // Kinesthetic learners engage more with interactive elements
      if (session.activitiesCompleted.includes('interactive-coding') || 
          session.activitiesCompleted.includes('hands-on-practice')) {
        kinestheticScore += 2;
      }
      
      // Reading learners spend more time on text content
      if (session.activitiesCompleted.includes('reading-content') ||
          session.activitiesCompleted.includes('documentation')) {
        readingScore += 2;
      }

      // Analyze session duration patterns
      if (session.duration > 30) { // Longer sessions might indicate reading preference
        readingScore += 1;
      }
    });

    // Normalize scores to 0-10 scale
    const total = visualScore + auditoryScore + kinestheticScore + readingScore;
    if (total === 0) {
      // Default balanced learning style
      return {
        visual: 5,
        auditory: 5,
        kinesthetic: 5,
        reading: 5,
        dominant: 'visual'
      };
    }

    const normalized = {
      visual: Math.round((visualScore / total) * 10),
      auditory: Math.round((auditoryScore / total) * 10),
      kinesthetic: Math.round((kinestheticScore / total) * 10),
      reading: Math.round((readingScore / total) * 10)
    };

    // Determine dominant style
    const dominant = Object.entries(normalized).reduce((a, b) => 
      normalized[a[0] as keyof typeof normalized] > normalized[b[0] as keyof typeof normalized] ? a : b
    )[0] as 'visual' | 'auditory' | 'kinesthetic' | 'reading';

    return { ...normalized, dominant };
  }

  /**
   * Analyzes skills across different DSA categories
   */
  private analyzeSkills(performance: PerformanceMetrics): SkillAnalysis {
    const categoryTopics = {
      arrays: dsaTopics.filter(t => t.category === 'Arrays').map(t => t.id),
      strings: dsaTopics.filter(t => t.category === 'Strings').map(t => t.id),
      linkedLists: dsaTopics.filter(t => t.category === 'Linked Lists').map(t => t.id),
      trees: dsaTopics.filter(t => t.category === 'Trees').map(t => t.id),
      graphs: dsaTopics.filter(t => t.category === 'Graphs').map(t => t.id),
      sorting: dsaTopics.filter(t => t.category === 'Sorting').map(t => t.id),
      searching: dsaTopics.filter(t => t.category === 'Searching').map(t => t.id),
      dynamicProgramming: dsaTopics.filter(t => t.category === 'Dynamic Programming').map(t => t.id),
      recursion: dsaTopics.filter(t => t.category === 'Recursion').map(t => t.id),
      hashing: dsaTopics.filter(t => t.category === 'Hashing').map(t => t.id)
    };

    const skillAnalysis: SkillAnalysis = {
      arrays: 0,
      strings: 0,
      linkedLists: 0,
      trees: 0,
      graphs: 0,
      sorting: 0,
      searching: 0,
      dynamicProgramming: 0,
      recursion: 0,
      hashing: 0,
      overall: 0
    };

    // Calculate skill level for each category
    Object.entries(categoryTopics).forEach(([category, topicIds]) => {
      const categoryScores = topicIds
        .map(id => performance.topicScores[id] || 0)
        .filter(score => score > 0);
      
      if (categoryScores.length > 0) {
        skillAnalysis[category as keyof SkillAnalysis] = 
          categoryScores.reduce((sum, score) => sum + score, 0) / categoryScores.length;
      }
    });

    // Calculate overall skill level
    const skillValues = Object.values(skillAnalysis).filter(v => v > 0);
    skillAnalysis.overall = skillValues.length > 0 
      ? skillValues.reduce((sum, skill) => sum + skill, 0) / skillValues.length 
      : 0;

    return skillAnalysis;
  }

  /**
   * Generates topic recommendations based on performance
   */
  private generateTopicRecommendations(performance: PerformanceMetrics, skills: SkillAnalysis): string[] {
    const recommendations: string[] = [];
    
    // Find topics that need improvement
    const weakTopics = Object.entries(performance.topicScores)
      .filter(([_, score]) => score < 70)
      .sort(([_, a], [__, b]) => a - b)
      .slice(0, 3)
      .map(([topicId, _]) => topicId);

    recommendations.push(...weakTopics);

    // Find next logical topics based on prerequisites
    const completedTopics = Object.entries(performance.topicScores)
      .filter(([_, score]) => score >= 80)
      .map(([topicId, _]) => topicId);

    const nextTopics = dsaTopics
      .filter(topic => 
        !completedTopics.includes(topic.id) && 
        !recommendations.includes(topic.id)
      )
      .slice(0, 5)
      .map(topic => topic.id);

    recommendations.push(...nextTopics);

    return recommendations.slice(0, 8);
  }

  /**
   * Calculates difficulty adjustment based on recent performance
   */
  private calculateDifficultyAdjustment(performance: PerformanceMetrics): 'easier' | 'harder' | 'same' {
    const recentScores = Object.values(performance.topicScores);
    if (recentScores.length === 0) return 'same';

    const averageScore = recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length;

    if (averageScore > 85) return 'harder';
    if (averageScore < 60) return 'easier';
    return 'same';
  }

  /**
   * Creates a personalized learning path
   */
  private createPersonalizedPath(performance: PerformanceMetrics, learningStyle: LearningStyle): LearningPath {
    // Create a customized learning path based on user's strengths, weaknesses, and learning style
    const weakAreas = this.identifyWeakAreas(this.analyzeSkills(performance));
    const orderedTopics = this.orderTopicsByPersonalization(performance, learningStyle, weakAreas);

    return {
      id: `personalized-${Date.now()}`,
      name: 'Your Personalized DSA Journey',
      description: `A customized learning path based on your ${learningStyle.dominant} learning style and current skill level`,
      topics: orderedTopics,
      estimatedDuration: orderedTopics.length * 2, // 2 hours per topic average
      difficultyProgression: this.calculateDifficultyProgression(orderedTopics),
      prerequisites: this.buildPrerequisiteMap(orderedTopics),
      milestones: this.createLearningMilestones(orderedTopics)
    };
  }

  // Helper methods
  private calculateConceptualUnderstanding(sessions: StudySession[]): number {
    // Implementation for conceptual understanding calculation
    const avgQuizScore = sessions
      .filter(s => s.quizScore !== undefined)
      .reduce((sum, s) => sum + s.quizScore!, 0) / sessions.length || 0;
    
    const conceptsUnderstood = sessions.reduce((sum, s) => sum + s.conceptsUnderstood.length, 0);
    const struggledConcepts = sessions.reduce((sum, s) => sum + s.struggledConcepts.length, 0);
    
    const understandingRatio = conceptsUnderstood / (conceptsUnderstood + struggledConcepts) || 0;
    
    return Math.round((avgQuizScore * 0.7 + understandingRatio * 30));
  }

  private calculatePracticalApplication(sessions: StudySession[]): number {
    // Implementation for practical application calculation
    const codingActivities = sessions.reduce((sum, s) => 
      sum + s.activitiesCompleted.filter(a => a.includes('coding') || a.includes('practice')).length, 0);
    
    const totalActivities = sessions.reduce((sum, s) => sum + s.activitiesCompleted.length, 0);
    
    return Math.round((codingActivities / totalActivities) * 100) || 0;
  }

  private calculateRetentionRate(sessions: StudySession[]): number {
    // Implementation for retention rate calculation
    if (sessions.length < 2) return 100;
    
    const sortedSessions = sessions.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    const firstScore = sortedSessions[0].quizScore || 0;
    const lastScore = sortedSessions[sortedSessions.length - 1].quizScore || 0;
    
    return Math.max(0, Math.round((lastScore / firstScore) * 100)) || 100;
  }

  private identifyWeakAreas(skills: SkillAnalysis): string[] {
    return Object.entries(skills)
      .filter(([key, value]) => key !== 'overall' && value < 60)
      .sort(([_, a], [__, b]) => a - b)
      .slice(0, 3)
      .map(([key, _]) => key);
  }

  private identifyStrongAreas(skills: SkillAnalysis): string[] {
    return Object.entries(skills)
      .filter(([key, value]) => key !== 'overall' && value >= 80)
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 3)
      .map(([key, _]) => key);
  }

  private generateDetailedRecommendations(performance: PerformanceMetrics, skills: SkillAnalysis): TopicRecommendation[] {
    // Implementation for detailed recommendations
    return this.generateTopicRecommendations(performance, skills).map(topicId => {
      const topic = dsaTopics.find(t => t.id === topicId);
      const currentScore = performance.topicScores[topicId] || 0;
      
      return {
        topicId,
        reason: currentScore < 70 ? 'Needs improvement' : 'Next in learning path',
        confidence: currentScore < 70 ? 0.9 : 0.7,
        estimatedDifficulty: currentScore < 50 ? 'easier' : 'same',
        estimatedTime: 45, // Default 45 minutes
        prerequisites: [],
        benefits: [`Improve ${topic?.category} skills`, 'Build foundation for advanced topics']
      };
    });
  }

  private orderTopicsByPersonalization(performance: PerformanceMetrics, learningStyle: LearningStyle, weakAreas: string[]): string[] {
    // Implementation for personalized topic ordering
    return dsaTopics
      .sort((a, b) => {
        const aScore = performance.topicScores[a.id] || 0;
        const bScore = performance.topicScores[b.id] || 0;
        
        // Prioritize weak areas
        if (weakAreas.includes(a.category.toLowerCase()) && !weakAreas.includes(b.category.toLowerCase())) return -1;
        if (!weakAreas.includes(a.category.toLowerCase()) && weakAreas.includes(b.category.toLowerCase())) return 1;
        
        // Then by difficulty
        const difficultyOrder = { beginner: 0, intermediate: 1, advanced: 2 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      })
      .map(topic => topic.id);
  }

  private calculateDifficultyProgression(topics: string[]): ('beginner' | 'intermediate' | 'advanced')[] {
    return topics.map(topicId => {
      const topic = dsaTopics.find(t => t.id === topicId);
      return topic?.difficulty || 'beginner';
    });
  }

  private buildPrerequisiteMap(topics: string[]): Record<string, string[]> {
    // Implementation for prerequisite mapping
    const prerequisites: Record<string, string[]> = {};
    
    topics.forEach((topicId, index) => {
      if (index > 0) {
        prerequisites[topicId] = [topics[index - 1]];
      }
    });
    
    return prerequisites;
  }

  private createLearningMilestones(topics: string[]): any[] {
    // Implementation for learning milestones
    const milestones = [];
    const chunkSize = Math.ceil(topics.length / 4);
    
    for (let i = 0; i < topics.length; i += chunkSize) {
      const chunk = topics.slice(i, i + chunkSize);
      milestones.push({
        id: `milestone-${i / chunkSize + 1}`,
        name: `Milestone ${i / chunkSize + 1}`,
        description: `Complete ${chunk.length} topics`,
        requiredTopics: chunk,
        reward: {
          xp: chunk.length * 100,
          badge: `milestone-${i / chunkSize + 1}`,
          title: `DSA Explorer Level ${i / chunkSize + 1}`
        }
      });
    }
    
    return milestones;
  }
}
