// Core Types for DSA Learning Platform

export interface Topic {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeComplexity: string;
  spaceComplexity: string;
  extendedDefinition: string;
  example: string;
  pseudocode?: string;
  keyConcepts?: string;
  commonMistakes?: string;
  realWorldApplications?: string;
  relatedTopics?: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  hint?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface UserProgress {
  userId: string;
  topicId: string;
  completed: boolean;
  score?: number;
  lastAccessed: Date;
  timeSpent: number;
  quizAttempts: number;
  quizScore?: number;
}

export interface LearningSession {
  sessionId: string;
  userId: string;
  topicId: string;
  startTime: Date;
  endTime?: Date;
  interactions: SessionInteraction[];
  completed: boolean;
}

export interface SessionInteraction {
  type: 'visualizer' | 'quiz' | 'code' | 'navigation';
  timestamp: Date;
  data: any;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
}

export interface UserProfile {
  userId: string;
  username: string;
  email: string;
  avatar?: string;
  level: number;
  xp: number;
  completedTopics: string[];
  achievements: Achievement[];
  streak: number;
  lastActive: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  animationSpeed: 'slow' | 'normal' | 'fast';
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  language: string;
}

export interface VisualizerState {
  isPlaying: boolean;
  isPaused: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;
  data: any;
}

export interface CodeExample {
  language: 'javascript' | 'python' | 'java' | 'cpp' | 'c';
  code: string;
  explanation?: string;
}

export interface TopicCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  topicCount: number;
  color: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Backend Integration Types
export interface TopicRequest {
  topicId: string;
  userId?: string;
}

export interface QuizSubmission {
  userId: string;
  topicId: string;
  questionId: string;
  selectedAnswer: number;
  timeSpent: number;
}

export interface ProgressUpdate {
  userId: string;
  topicId: string;
  completed: boolean;
  score?: number;
  timeSpent: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar?: string;
  xp: number;
  completedTopics: number;
  streak: number;
}

// Utility Types
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type QuizDifficulty = 'easy' | 'medium' | 'hard';
export type ComplexityNotation = string; // e.g., "O(n)", "O(log n)"

// Export all types
export type {
  Topic as DSATopic,
  QuizQuestion as DSAQuizQuestion,
  UserProgress as DSAUserProgress,
  LearningSession as DSALearningSession
};
