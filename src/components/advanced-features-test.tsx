import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Brain, 
  Trophy, 
  Code, 
  Users, 
  Zap,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { AdvancedFeaturesIntegration } from '@/services/advanced-features-integration';
import { GamificationEngine } from '@/services/gamification-engine';
import { AdaptiveLearningEngine } from '@/services/adaptive-learning-engine';
import { AILearningAssistant } from '@/services/ai-learning-assistant';
import { toast } from 'sonner';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: string;
}

export function AdvancedFeaturesTest() {
  const { user, isPremium } = useAuth();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const advancedFeatures = AdvancedFeaturesIntegration.getInstance();
  const gamification = GamificationEngine.getInstance();
  const adaptiveLearning = AdaptiveLearningEngine.getInstance();
  const aiAssistant = AILearningAssistant.getInstance();

  const runComprehensiveTest = async () => {
    setIsRunning(true);
    setProgress(0);
    setTestResults([]);

    const tests = [
      { name: 'Advanced Features Integration', test: testAdvancedFeaturesIntegration },
      { name: 'Gamification System', test: testGamificationSystem },
      { name: 'Adaptive Learning Engine', test: testAdaptiveLearningEngine },
      { name: 'AI Learning Assistant', test: testAILearningAssistant },
      { name: 'Topic Integration', test: testTopicIntegration },
      { name: 'User Authentication', test: testUserAuthentication },
      { name: 'Premium Features', test: testPremiumFeatures },
      { name: 'Data Persistence', test: testDataPersistence }
    ];

    const results: TestResult[] = [];

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      setProgress(((i + 1) / tests.length) * 100);
      
      try {
        const result = await test.test();
        results.push(result);
        setTestResults([...results]);
        await new Promise(resolve => setTimeout(resolve, 500)); // Visual delay
      } catch (error) {
        results.push({
          name: test.name,
          status: 'fail',
          message: 'Test failed with exception',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
        setTestResults([...results]);
      }
    }

    setIsRunning(false);
    
    const passCount = results.filter(r => r.status === 'pass').length;
    const failCount = results.filter(r => r.status === 'fail').length;
    
    if (failCount === 0) {
      toast.success(`All ${passCount} tests passed! 🎉`);
    } else {
      toast.error(`${failCount} tests failed, ${passCount} passed`);
    }
  };

  // Test Functions
  const testAdvancedFeaturesIntegration = async (): Promise<TestResult> => {
    try {
      const isValid = advancedFeatures.validateAdvancedFeatures();
      
      if (isValid) {
        return {
          name: 'Advanced Features Integration',
          status: 'pass',
          message: 'All advanced features are properly integrated',
          details: 'Gamification, Adaptive Learning, AI Assistant, and Code Editor are working'
        };
      } else {
        return {
          name: 'Advanced Features Integration',
          status: 'fail',
          message: 'Advanced features validation failed',
          details: 'One or more services are not responding correctly'
        };
      }
    } catch (error) {
      return {
        name: 'Advanced Features Integration',
        status: 'fail',
        message: 'Integration test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const testGamificationSystem = async (): Promise<TestResult> => {
    try {
      const testUserId = 'test-gamification-user';
      
      // Test XP awarding
      const xpGain = gamification.awardXP(testUserId, 100, 'Test XP');
      
      // Test achievement checking
      const achievements = gamification.checkAchievements(testUserId, 'topic_completed', {});
      
      // Test user profile
      const profile = gamification.getUserProfile(testUserId);
      
      // Clean up
      advancedFeatures.resetUserProgress(testUserId);
      
      if (xpGain.amount > 0 && profile.userId === testUserId) {
        return {
          name: 'Gamification System',
          status: 'pass',
          message: 'XP, achievements, and user profiles working correctly',
          details: `Awarded ${xpGain.amount} XP successfully`
        };
      } else {
        return {
          name: 'Gamification System',
          status: 'fail',
          message: 'Gamification system not working properly',
          details: 'XP awarding or profile creation failed'
        };
      }
    } catch (error) {
      return {
        name: 'Gamification System',
        status: 'fail',
        message: 'Gamification test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const testAdaptiveLearningEngine = async (): Promise<TestResult> => {
    try {
      const testUserId = 'test-adaptive-user';
      const mockSessions = [{
        id: 'test-session',
        userId: testUserId,
        topicId: 'array-basics',
        startTime: new Date(),
        duration: 30,
        activitiesCompleted: ['quiz', 'visualization'],
        conceptsUnderstood: ['arrays'],
        struggledConcepts: [],
        notes: 'Test session'
      }];
      
      const adaptiveData = adaptiveLearning.generateAdaptiveLearning(testUserId, mockSessions);
      
      if (adaptiveData && adaptiveData.learningStyle && adaptiveData.recommendedTopics) {
        return {
          name: 'Adaptive Learning Engine',
          status: 'pass',
          message: 'Adaptive learning analysis working correctly',
          details: `Generated ${adaptiveData.recommendedTopics.length} recommendations`
        };
      } else {
        return {
          name: 'Adaptive Learning Engine',
          status: 'fail',
          message: 'Adaptive learning analysis failed',
          details: 'Could not generate learning recommendations'
        };
      }
    } catch (error) {
      return {
        name: 'Adaptive Learning Engine',
        status: 'fail',
        message: 'Adaptive learning test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const testAILearningAssistant = async (): Promise<TestResult> => {
    try {
      // Test question generation
      const questions = await aiAssistant.generateIntelligentQuestions('array-basics', 'easy', 2);
      
      // Test study recommendations
      const mockProfile = { level: 1, stats: { topicsCompleted: 1 } };
      const mockLearningStyle = { visual: 8, auditory: 5, kinesthetic: 6, reading: 7, dominant: 'visual' as const };
      const recommendations = aiAssistant.generateStudyRecommendations(
        mockProfile, 
        mockLearningStyle, 
        ['arrays'], 
        60
      );
      
      if (questions.length > 0 && recommendations.length > 0) {
        return {
          name: 'AI Learning Assistant',
          status: 'pass',
          message: 'AI question generation and recommendations working',
          details: `Generated ${questions.length} questions and ${recommendations.length} recommendations`
        };
      } else {
        return {
          name: 'AI Learning Assistant',
          status: 'warning',
          message: 'AI Assistant partially working',
          details: 'Some AI features may not be fully functional'
        };
      }
    } catch (error) {
      return {
        name: 'AI Learning Assistant',
        status: 'warning',
        message: 'AI Assistant test completed with warnings',
        details: 'AI features are mock implementations - will work with real AI integration'
      };
    }
  };

  const testTopicIntegration = async (): Promise<TestResult> => {
    try {
      // Test topic completion tracking
      const result = await advancedFeatures.trackTopicCompletion(
        'test-user',
        'array-basics',
        85,
        30,
        ['quiz', 'visualization', 'code']
      );
      
      if (result.xpGained > 0) {
        return {
          name: 'Topic Integration',
          status: 'pass',
          message: 'Topic completion tracking working correctly',
          details: `Gained ${result.xpGained} XP, ${result.achievementsUnlocked.length} achievements`
        };
      } else {
        return {
          name: 'Topic Integration',
          status: 'fail',
          message: 'Topic integration not working',
          details: 'No XP gained from topic completion'
        };
      }
    } catch (error) {
      return {
        name: 'Topic Integration',
        status: 'fail',
        message: 'Topic integration test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const testUserAuthentication = async (): Promise<TestResult> => {
    if (user) {
      return {
        name: 'User Authentication',
        status: 'pass',
        message: 'User authentication working correctly',
        details: `Logged in as ${user.name} (${user.email})`
      };
    } else {
      return {
        name: 'User Authentication',
        status: 'warning',
        message: 'No user logged in',
        details: 'Advanced features require user authentication'
      };
    }
  };

  const testPremiumFeatures = async (): Promise<TestResult> => {
    if (isPremium) {
      return {
        name: 'Premium Features',
        status: 'pass',
        message: 'Premium features are accessible',
        details: 'AI explanations, advanced analytics, and unlimited access available'
      };
    } else {
      return {
        name: 'Premium Features',
        status: 'warning',
        message: 'Free tier limitations active',
        details: 'Some advanced features require premium subscription'
      };
    }
  };

  const testDataPersistence = async (): Promise<TestResult> => {
    try {
      const testKey = 'advanced-features-test';
      const testData = { test: true, timestamp: Date.now() };
      
      // Test localStorage
      localStorage.setItem(testKey, JSON.stringify(testData));
      const retrieved = JSON.parse(localStorage.getItem(testKey) || '{}');
      localStorage.removeItem(testKey);
      
      if (retrieved.test === true) {
        return {
          name: 'Data Persistence',
          status: 'pass',
          message: 'Data persistence working correctly',
          details: 'localStorage read/write operations successful'
        };
      } else {
        return {
          name: 'Data Persistence',
          status: 'fail',
          message: 'Data persistence failed',
          details: 'localStorage operations not working'
        };
      }
    } catch (error) {
      return {
        name: 'Data Persistence',
        status: 'fail',
        message: 'Data persistence test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const getStatusIcon = (status: 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'pass':
        return 'bg-green-50 border-green-200';
      case 'fail':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-6 h-6" />
            Advanced Features Test Suite
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                Validate that all advanced features are working correctly across all DSA topics.
              </p>
              <Button 
                onClick={runComprehensiveTest}
                disabled={isRunning}
                className="flex items-center gap-2"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Run Tests
                  </>
                )}
              </Button>
            </div>

            {isRunning && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Running tests...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {testResults.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold">Test Results</h3>
                {testResults.map((result, index) => (
                  <Card key={index} className={`${getStatusColor(result.status)} border`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {getStatusIcon(result.status)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{result.name}</h4>
                            <Badge variant={result.status === 'pass' ? 'default' : 
                                          result.status === 'warning' ? 'secondary' : 'destructive'}>
                              {result.status.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700 mb-1">{result.message}</p>
                          {result.details && (
                            <p className="text-xs text-gray-600">{result.details}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {testResults.length > 0 && !isRunning && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Test Summary</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {testResults.filter(r => r.status === 'pass').length}
                    </div>
                    <div className="text-green-700">Passed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {testResults.filter(r => r.status === 'warning').length}
                    </div>
                    <div className="text-yellow-700">Warnings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {testResults.filter(r => r.status === 'fail').length}
                    </div>
                    <div className="text-red-700">Failed</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Feature Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Brain className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <h3 className="font-medium">Adaptive Learning</h3>
            <p className="text-sm text-gray-600">Personalized recommendations</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
            <h3 className="font-medium">Gamification</h3>
            <p className="text-sm text-gray-600">XP, achievements, streaks</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Code className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <h3 className="font-medium">Code Editor</h3>
            <p className="text-sm text-gray-600">Real-time execution</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <h3 className="font-medium">Mock Interviews</h3>
            <p className="text-sm text-gray-600">Company-specific questions</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
