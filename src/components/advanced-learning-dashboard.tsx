import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Trophy, 
  Code, 
  Users, 
  Target, 
  TrendingUp, 
  Clock,
  Star,
  Zap,
  BookOpen,
  Award,
  Calendar,
  ArrowLeft,
  Home
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { AdaptiveLearningEngine } from '@/services/adaptive-learning-engine';
import { GamificationEngine } from '@/services/gamification-engine';
import { AILearningAssistant } from '@/services/ai-learning-assistant';

interface DashboardStats {
  totalXP: number;
  level: number;
  currentStreak: number;
  topicsCompleted: number;
  averageScore: number;
  timeSpent: number;
  achievements: number;
  rank: number;
}

interface RecommendedAction {
  id: string;
  type: 'study' | 'practice' | 'review' | 'challenge';
  title: string;
  description: string;
  estimatedTime: number;
  xpReward: number;
  priority: 'high' | 'medium' | 'low';
  icon: React.ReactNode;
}

export function AdvancedLearningDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalXP: 0,
    level: 1,
    currentStreak: 0,
    topicsCompleted: 0,
    averageScore: 0,
    timeSpent: 0,
    achievements: 0,
    rank: 0
  });
  const [recommendations, setRecommendations] = useState<RecommendedAction[]>([]);
  const [dailyChallenge, setDailyChallenge] = useState<any>(null);
  const [recentAchievements, setRecentAchievements] = useState<any[]>([]);
  const [learningPath, setLearningPath] = useState<any>(null);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      // Load gamification data
      const gamificationEngine = GamificationEngine.getInstance();
      const userProfile = gamificationEngine.getUserProfile(user.id);
      
      // Load adaptive learning data
      const adaptiveLearning = AdaptiveLearningEngine.getInstance();
      const sessions = []; // Load from storage
      const adaptiveData = adaptiveLearning.generateAdaptiveLearning(user.id, sessions);
      
      // Load AI recommendations
      const aiAssistant = AILearningAssistant.getInstance();
      const studyRecommendations = aiAssistant.generateStudyRecommendations(
        userProfile,
        adaptiveData.learningStyle,
        adaptiveData.weakAreas,
        60 // 60 minutes available
      );

      // Update stats
      setStats({
        totalXP: userProfile.xp.totalXPEarned,
        level: userProfile.level,
        currentStreak: userProfile.streak.current,
        topicsCompleted: userProfile.stats.topicsCompleted,
        averageScore: userProfile.stats.averageQuizScore,
        timeSpent: userProfile.stats.totalStudyTime,
        achievements: userProfile.achievements.length,
        rank: 1 // Calculate from leaderboard
      });

      // Convert study recommendations to dashboard actions
      const actions: RecommendedAction[] = studyRecommendations.map(rec => ({
        id: rec.type,
        type: rec.type as any,
        title: rec.title,
        description: rec.description,
        estimatedTime: rec.estimatedTime,
        xpReward: rec.estimatedTime * 2, // 2 XP per minute
        priority: rec.priority,
        icon: getIconForRecommendationType(rec.type)
      }));

      setRecommendations(actions);

      // Load daily challenge
      const challenge = gamificationEngine.generateDailyChallenge(user.id);
      setDailyChallenge(challenge);

      // Load recent achievements
      const recent = userProfile.achievements.slice(-3);
      setRecentAchievements(recent);

      // Set learning path
      setLearningPath(adaptiveData.personalizedPath);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const getIconForRecommendationType = (type: string) => {
    switch (type) {
      case 'weakness-focus': return <Target className="w-4 h-4" />;
      case 'practice': return <Code className="w-4 h-4" />;
      case 'review': return <BookOpen className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const handleStartRecommendation = (action: RecommendedAction) => {
    // Navigate to appropriate learning activity
    console.log('Starting recommendation:', action);
  };

  const handleStartDailyChallenge = () => {
    // Navigate to daily challenge
    console.log('Starting daily challenge');
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">Advanced Learning Dashboard</h1>
          <p className="text-muted-foreground">Track your progress and get personalized recommendations</p>
        </div>
      </div>

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total XP</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalXP.toLocaleString()}</p>
              </div>
              <Zap className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Level</p>
                <p className="text-2xl font-bold text-purple-600">{stats.level}</p>
              </div>
              <Star className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Streak</p>
                <p className="text-2xl font-bold text-orange-600">{stats.currentStreak} days</p>
              </div>
              <Trophy className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rank</p>
                <p className="text-2xl font-bold text-green-600">#{stats.rank}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Challenge */}
          {dailyChallenge && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Daily Challenge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{dailyChallenge.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{dailyChallenge.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant={dailyChallenge.difficulty === 'easy' ? 'default' : 
                                   dailyChallenge.difficulty === 'medium' ? 'secondary' : 'destructive'}>
                        {dailyChallenge.difficulty}
                      </Badge>
                      <Badge variant="outline">+{dailyChallenge.rewards.xp} XP</Badge>
                      <Badge variant="outline">
                        <Clock className="w-3 h-3 mr-1" />
                        {dailyChallenge.timeLimit}min
                      </Badge>
                    </div>
                  </div>
                  <Button onClick={handleStartDailyChallenge}>
                    Start Challenge
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Personalized Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recommendations.map((action) => (
                  <div key={action.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {action.icon}
                      <div>
                        <h4 className="font-medium">{action.title}</h4>
                        <p className="text-sm text-gray-600">{action.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {action.estimatedTime}min
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            +{action.xpReward} XP
                          </Badge>
                          <Badge variant={action.priority === 'high' ? 'destructive' : 
                                        action.priority === 'medium' ? 'secondary' : 'default'} 
                                className="text-xs">
                            {action.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => handleStartRecommendation(action)}>
                      Start
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Learning Path Progress */}
          {learningPath && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Your Learning Path
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">{learningPath.name}</h3>
                    <p className="text-sm text-gray-600">{learningPath.description}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>3 of {learningPath.topics.length} topics</span>
                    </div>
                    <Progress value={(3 / learningPath.topics.length) * 100} />
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {learningPath.estimatedDuration}h estimated
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {learningPath.topics.length} topics
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAchievements.length > 0 ? (
                  recentAchievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-yellow-50 rounded-lg">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div>
                        <p className="font-medium text-sm">{achievement.name}</p>
                        <p className="text-xs text-gray-600">{achievement.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No recent achievements</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Topics Completed</span>
                  <span className="font-medium">{stats.topicsCompleted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Average Score</span>
                  <span className="font-medium">{stats.averageScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Time Spent</span>
                  <span className="font-medium">{Math.round(stats.timeSpent / 60)}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Achievements</span>
                  <span className="font-medium">{stats.achievements}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Code className="w-4 h-4 mr-2" />
                  Practice Coding
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Mock Interview
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Trophy className="w-4 h-4 mr-2" />
                  View Leaderboard
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Study Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
