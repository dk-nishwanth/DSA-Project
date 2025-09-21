import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Code, 
  Zap, 
  Trophy, 
  Clock, 
  Target,
  Lightbulb,
  Play,
  BookOpen,
  MessageSquare
} from 'lucide-react';
import { useAdvancedFeatures } from '@/hooks/useAdvancedFeatures';
import { EnhancedCodeEditor } from './enhanced-code-editor';
import { toast } from 'sonner';

interface EnhancedTopicDetailProps {
  topic: any;
  children?: React.ReactNode;
}

export function EnhancedTopicDetail({ topic, children }: EnhancedTopicDetailProps) {
  const {
    isLoading,
    currentSession,
    xpGained,
    achievementsUnlocked,
    aiRecommendations,
    adaptiveData,
    trackInteraction,
    getAIExplanation,
    endSession,
    isPremium
  } = useAdvancedFeatures(topic.id);

  const [aiExplanation, setAiExplanation] = useState<any>(null);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [sessionProgress, setSessionProgress] = useState(0);

  // Update session progress based on activities
  useEffect(() => {
    if (currentSession) {
      const totalActivities = 5; // Learn, Practice, Quiz, Code, Review
      const completed = currentSession.activitiesCompleted.length;
      setSessionProgress((completed / totalActivities) * 100);
    }
  }, [currentSession]);

  const handleGetAIExplanation = async () => {
    const explanation = await getAIExplanation(topic.title);
    if (explanation) {
      setAiExplanation(explanation);
      await trackInteraction({
        topicId: topic.id,
        action: 'visualization_view',
        data: { type: 'ai_explanation' }
      });
    }
  };

  const handleQuizComplete = async (score: number) => {
    setQuizScore(score);
    await trackInteraction({
      topicId: topic.id,
      action: 'quiz_attempt',
      score,
      data: { score }
    });

    if (score >= 70) {
      toast.success(`Great job! You scored ${score}%`);
    } else {
      toast.info(`You scored ${score}%. Try reviewing the material and retaking the quiz.`);
    }
  };

  const handleCodeSubmit = async (result: any) => {
    await trackInteraction({
      topicId: topic.id,
      action: 'code_submit',
      data: { result }
    });

    if (result.success) {
      toast.success('Code executed successfully!');
    }
  };

  const handleCompleteSession = async () => {
    const concepts = currentSession?.conceptsUnderstood || [];
    await endSession(quizScore || undefined, concepts);
    toast.success('Learning session completed!');
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Session Progress Header */}
      {currentSession && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Learning Session Active</span>
                {xpGained > 0 && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    +{xpGained} XP
                  </Badge>
                )}
              </div>
              <Button onClick={handleCompleteSession} size="sm">
                Complete Session
              </Button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Session Progress</span>
                <span>{Math.round(sessionProgress)}%</span>
              </div>
              <Progress value={sessionProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Primary Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Topic Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                {topic.title}
                <Badge variant={topic.difficulty === 'easy' ? 'default' : 
                              topic.difficulty === 'medium' ? 'secondary' : 'destructive'}>
                  {topic.difficulty}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {children}
            </CardContent>
          </Card>

          {/* Enhanced Features Tabs */}
          <Card>
            <CardContent className="p-0">
              <Tabs defaultValue="practice" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="practice">Practice</TabsTrigger>
                  <TabsTrigger value="ai-help">AI Help</TabsTrigger>
                  <TabsTrigger value="code">Code</TabsTrigger>
                  <TabsTrigger value="quiz">Quiz</TabsTrigger>
                </TabsList>

                <TabsContent value="practice" className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Interactive Practice
                    </h3>
                    <p className="text-gray-600">
                      Practice with interactive visualizations and step-by-step guidance.
                    </p>
                    <Button 
                      onClick={() => trackInteraction({
                        topicId: topic.id,
                        action: 'visualization_view',
                        data: { type: 'practice' }
                      })}
                      className="w-full"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Interactive Practice
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="ai-help" className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      AI-Powered Explanations
                      {!isPremium && <Badge variant="outline">Premium</Badge>}
                    </h3>
                    
                    {!isPremium ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600 mb-4">
                          Get personalized AI explanations tailored to your learning style
                        </p>
                        <Button variant="outline">
                          Upgrade to Premium
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Button 
                          onClick={handleGetAIExplanation}
                          disabled={isLoading}
                          className="w-full"
                        >
                          <Lightbulb className="w-4 h-4 mr-2" />
                          {isLoading ? 'Generating...' : 'Get AI Explanation'}
                        </Button>
                        
                        {aiExplanation && (
                          <Card className="bg-blue-50 border-blue-200">
                            <CardContent className="p-4">
                              <h4 className="font-medium mb-2">AI Explanation</h4>
                              <p className="text-sm">{aiExplanation.explanation}</p>
                              {aiExplanation.analogies.length > 0 && (
                                <div className="mt-3">
                                  <h5 className="font-medium text-sm">Analogy:</h5>
                                  <p className="text-sm text-blue-700">
                                    {aiExplanation.analogies[0]}
                                  </p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="code" className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Code className="w-5 h-5" />
                      Enhanced Code Editor
                    </h3>
                    
                    {!showCodeEditor ? (
                      <div className="text-center py-8">
                        <Code className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600 mb-4">
                          Practice coding with our enhanced editor supporting 10+ languages
                        </p>
                        <Button onClick={() => setShowCodeEditor(true)}>
                          Open Code Editor
                        </Button>
                      </div>
                    ) : (
                      <div className="h-96">
                        <EnhancedCodeEditor
                          initialCode={topic.implementationCode || '// Start coding here...'}
                          language="javascript"
                          onExecutionComplete={handleCodeSubmit}
                          showConsole={true}
                        />
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="quiz" className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Knowledge Quiz
                    </h3>
                    
                    {quizScore !== null ? (
                      <Card className={`${quizScore >= 70 ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Trophy className="w-5 h-5" />
                            <span className="font-medium">Quiz Completed!</span>
                          </div>
                          <p>Your Score: {quizScore}%</p>
                          {quizScore >= 70 ? (
                            <p className="text-green-700 text-sm">Great job! You've mastered this topic.</p>
                          ) : (
                            <p className="text-yellow-700 text-sm">Consider reviewing the material and trying again.</p>
                          )}
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-gray-600">
                          Test your understanding with adaptive quiz questions.
                        </p>
                        <Button 
                          onClick={() => {
                            // Simulate quiz completion for demo
                            const score = Math.floor(Math.random() * 40) + 60; // 60-100%
                            handleQuizComplete(score);
                          }}
                          className="w-full"
                        >
                          Start Quiz
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Achievements */}
          {achievementsUnlocked.length > 0 && (
            <Card className="bg-yellow-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-800">
                  <Trophy className="w-5 h-5" />
                  New Achievements!
                </CardTitle>
              </CardHeader>
              <CardContent>
                {achievementsUnlocked.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <p className="font-medium text-sm">{achievement.name}</p>
                      <p className="text-xs text-yellow-700">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* AI Recommendations */}
          {aiRecommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {aiRecommendations.slice(0, 3).map((rec, index) => (
                    <div key={index} className="p-3 bg-blue-50 rounded-lg">
                      <p className="font-medium text-sm">{rec.reason}</p>
                      <p className="text-xs text-blue-600">
                        Confidence: {Math.round(rec.confidence * 100)}%
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Learning Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Session Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">XP Gained</span>
                  <Badge variant="outline">+{xpGained}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Activities</span>
                  <span className="text-sm">{currentSession?.activitiesCompleted.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Progress</span>
                  <span className="text-sm">{Math.round(sessionProgress)}%</span>
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
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Target className="w-4 h-4 mr-2" />
                  Practice Problems
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Code className="w-4 h-4 mr-2" />
                  Code Challenge
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Brain className="w-4 h-4 mr-2" />
                  Related Topics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
