import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { AdaptiveLearningEngine } from '@/services/adaptive-learning-engine';
import { GamificationEngine } from '@/services/gamification-engine';
import { AILearningAssistant } from '@/services/ai-learning-assistant';
import { StudySession } from '@/types/adaptive-learning';
import { toast } from 'sonner';

interface TopicInteraction {
  topicId: string;
  action: 'start' | 'complete' | 'quiz_attempt' | 'code_submit' | 'visualization_view';
  data?: any;
  score?: number;
  timeSpent?: number;
}

interface AdvancedFeaturesState {
  isLoading: boolean;
  currentSession: StudySession | null;
  xpGained: number;
  achievementsUnlocked: any[];
  aiRecommendations: any[];
  adaptiveData: any;
}

export function useAdvancedFeatures(topicId: string) {
  const { user, isPremium } = useAuth();
  const [state, setState] = useState<AdvancedFeaturesState>({
    isLoading: false,
    currentSession: null,
    xpGained: 0,
    achievementsUnlocked: [],
    aiRecommendations: [],
    adaptiveData: null
  });

  const adaptiveLearning = AdaptiveLearningEngine.getInstance();
  const gamification = GamificationEngine.getInstance();
  const aiAssistant = AILearningAssistant.getInstance();

  // Start learning session
  const startSession = useCallback(async () => {
    if (!user) return;

    const session: StudySession = {
      id: `session-${Date.now()}`,
      userId: user.id,
      topicId,
      startTime: new Date(),
      duration: 0,
      activitiesCompleted: [],
      conceptsUnderstood: [],
      struggledConcepts: [],
      notes: ''
    };

    setState(prev => ({ ...prev, currentSession: session }));

    // Track session start
    await trackInteraction({
      topicId,
      action: 'start',
      data: { sessionId: session.id }
    });
  }, [user, topicId]);

  // End learning session
  const endSession = useCallback(async (score?: number, concepts?: string[]) => {
    if (!state.currentSession || !user) return;

    const endTime = new Date();
    const duration = Math.round((endTime.getTime() - state.currentSession.startTime.getTime()) / 1000 / 60); // minutes

    const completedSession: StudySession = {
      ...state.currentSession,
      endTime,
      duration,
      quizScore: score,
      conceptsUnderstood: concepts || [],
      satisfactionRating: score ? (score >= 80 ? 5 : score >= 60 ? 4 : 3) : undefined
    };

    // Save session to storage
    const sessions = JSON.parse(localStorage.getItem(`sessions-${user.id}`) || '[]');
    sessions.push(completedSession);
    localStorage.setItem(`sessions-${user.id}`, JSON.stringify(sessions));

    // Award XP and check achievements
    const xpAmount = calculateXP(completedSession);
    const xpGain = gamification.awardXP(user.id, xpAmount, `Completed ${topicId}`);
    const newAchievements = gamification.checkAchievements(user.id, 'topic_completed', completedSession);

    // Update streak
    gamification.updateStreak(user.id);

    setState(prev => ({
      ...prev,
      currentSession: null,
      xpGained: xpGain.amount,
      achievementsUnlocked: newAchievements
    }));

    // Show success feedback
    toast.success(`+${xpGain.amount} XP earned!`, {
      description: `Great job completing ${topicId}!`
    });

    if (newAchievements.length > 0) {
      newAchievements.forEach(achievement => {
        toast.success(`Achievement Unlocked: ${achievement.name}!`, {
          description: achievement.description
        });
      });
    }

    return completedSession;
  }, [state.currentSession, user, topicId]);

  // Track specific interactions
  const trackInteraction = useCallback(async (interaction: TopicInteraction) => {
    if (!user || !state.currentSession) return;

    // Update current session
    const updatedSession = {
      ...state.currentSession,
      activitiesCompleted: [...state.currentSession.activitiesCompleted, interaction.action]
    };

    setState(prev => ({ ...prev, currentSession: updatedSession }));

    // Award micro-XP for interactions
    let xpAmount = 0;
    switch (interaction.action) {
      case 'visualization_view':
        xpAmount = 5;
        break;
      case 'quiz_attempt':
        xpAmount = interaction.score ? Math.round(interaction.score / 10) : 5;
        break;
      case 'code_submit':
        xpAmount = 10;
        break;
      default:
        xpAmount = 2;
    }

    if (xpAmount > 0) {
      const xpGain = gamification.awardXP(user.id, xpAmount, `${interaction.action} on ${topicId}`);
      setState(prev => ({ ...prev, xpGained: prev.xpGained + xpGain.amount }));
    }
  }, [user, state.currentSession, topicId]);

  // Get AI-powered explanations
  const getAIExplanation = useCallback(async (concept: string) => {
    if (!isPremium) {
      toast.error('AI explanations are a premium feature');
      return null;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      // Get user's learning style from previous sessions
      const sessions = JSON.parse(localStorage.getItem(`sessions-${user?.id}`) || '[]');
      const adaptiveData = adaptiveLearning.generateAdaptiveLearning(user?.id || '', sessions);
      
      const explanation = await aiAssistant.generatePersonalizedExplanation(
        topicId,
        user?.id || '',
        adaptiveData.learningStyle,
        70 // default understanding level
      );

      setState(prev => ({ ...prev, isLoading: false }));
      return explanation;
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      toast.error('Failed to generate AI explanation');
      return null;
    }
  }, [isPremium, user, topicId]);

  // Get adaptive recommendations
  const getRecommendations = useCallback(async () => {
    if (!user) return [];

    const sessions = JSON.parse(localStorage.getItem(`sessions-${user.id}`) || '[]');
    const adaptiveData = adaptiveLearning.generateAdaptiveLearning(user.id, sessions);
    
    setState(prev => ({ 
      ...prev, 
      aiRecommendations: adaptiveData.nextRecommendations,
      adaptiveData 
    }));

    return adaptiveData.nextRecommendations;
  }, [user]);

  // Calculate XP based on session performance
  const calculateXP = (session: StudySession): number => {
    let baseXP = 50; // Base XP for completing a topic
    
    // Bonus for quiz performance
    if (session.quizScore) {
      if (session.quizScore >= 90) baseXP += 30;
      else if (session.quizScore >= 80) baseXP += 20;
      else if (session.quizScore >= 70) baseXP += 10;
    }

    // Bonus for time spent (engagement)
    if (session.duration >= 30) baseXP += 20; // 30+ minutes
    else if (session.duration >= 15) baseXP += 10; // 15+ minutes

    // Bonus for activities completed
    baseXP += session.activitiesCompleted.length * 5;

    return baseXP;
  };

  // Initialize on mount
  useEffect(() => {
    if (user && topicId) {
      startSession();
      getRecommendations();
    }

    return () => {
      // Auto-end session on unmount if still active
      if (state.currentSession) {
        endSession();
      }
    };
  }, [user, topicId]);

  return {
    ...state,
    startSession,
    endSession,
    trackInteraction,
    getAIExplanation,
    getRecommendations,
    isPremium
  };
}
