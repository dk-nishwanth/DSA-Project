export interface PerformanceMetrics {
  topicScores: Record<string, number>; // Topic ID -> Score (0-100)
  averageCompletionTime: Record<string, number>; // Topic ID -> Time in minutes
  attemptCounts: Record<string, number>; // Topic ID -> Number of attempts
  quizScores: Record<string, number[]>; // Topic ID -> Array of quiz scores
  conceptualUnderstanding: Record<string, number>; // Topic ID -> Understanding level (0-10)
  practicalApplication: Record<string, number>; // Topic ID -> Application skill (0-10)
  retentionRate: Record<string, number>; // Topic ID -> Retention percentage
  lastAccessed: Record<string, Date>; // Topic ID -> Last access date
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  topics: string[]; // Ordered list of topic IDs
  estimatedDuration: number; // In hours
  difficultyProgression: ('beginner' | 'intermediate' | 'advanced')[];
  prerequisites: Record<string, string[]>; // Topic ID -> Required topics
  milestones: LearningMilestone[];
}

export interface LearningMilestone {
  id: string;
  name: string;
  description: string;
  requiredTopics: string[];
  reward: {
    xp: number;
    badge?: string;
    title?: string;
  };
}

export interface AdaptiveLearning {
  userPerformance: PerformanceMetrics;
  recommendedTopics: string[];
  difficultyAdjustment: 'easier' | 'harder' | 'same';
  personalizedPath: LearningPath;
  learningStyle: LearningStyle;
  weakAreas: string[];
  strongAreas: string[];
  nextRecommendations: TopicRecommendation[];
}

export interface LearningStyle {
  visual: number; // 0-10 preference for visual learning
  auditory: number; // 0-10 preference for audio explanations
  kinesthetic: number; // 0-10 preference for hands-on practice
  reading: number; // 0-10 preference for text-based learning
  dominant: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
}

export interface TopicRecommendation {
  topicId: string;
  reason: string;
  confidence: number; // 0-1 confidence in recommendation
  estimatedDifficulty: 'easier' | 'same' | 'harder';
  estimatedTime: number; // In minutes
  prerequisites: string[];
  benefits: string[];
}

export interface StudySession {
  id: string;
  userId: string;
  topicId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // In minutes
  activitiesCompleted: string[];
  quizScore?: number;
  conceptsUnderstood: string[];
  struggledConcepts: string[];
  notes: string;
  satisfactionRating?: number; // 1-5
}

export interface LearningAnalytics {
  timeSpentPerTopic: Record<string, number>;
  strengthsAndWeaknesses: SkillAnalysis;
  learningVelocity: number; // Topics per week
  predictedCompletionTime: Date;
  recommendedStudySchedule: StudyPlan;
  improvementAreas: string[];
  masteredConcepts: string[];
}

export interface SkillAnalysis {
  arrays: number;
  strings: number;
  linkedLists: number;
  trees: number;
  graphs: number;
  sorting: number;
  searching: number;
  dynamicProgramming: number;
  recursion: number;
  hashing: number;
  overall: number;
}

export interface StudyPlan {
  dailyGoals: DailyGoal[];
  weeklyMilestones: WeeklyMilestone[];
  monthlyObjectives: MonthlyObjective[];
  adaptiveSchedule: boolean;
  preferredStudyTimes: string[];
  sessionDuration: number; // In minutes
}

export interface DailyGoal {
  date: Date;
  topics: string[];
  estimatedTime: number;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

export interface WeeklyMilestone {
  week: number;
  objectives: string[];
  targetTopics: number;
  skillFocus: string;
  completed: boolean;
}

export interface MonthlyObjective {
  month: number;
  goal: string;
  targetSkillLevel: number;
  majorMilestones: string[];
  completed: boolean;
}
