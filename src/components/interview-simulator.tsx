import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { EnhancedCodeEditor } from './enhanced-code-editor';
import { 
  Play, 
  Pause, 
  Square, 
  Clock, 
  User, 
  Building, 
  Star,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Home
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface InterviewQuestion {
  id: string;
  company: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  title: string;
  description: string;
  constraints: string[];
  examples: Example[];
  hints: string[];
  optimalComplexity: {
    time: string;
    space: string;
  };
}

interface Example {
  input: string;
  output: string;
  explanation: string;
}

interface InterviewSession {
  id: string;
  company: string;
  duration: number; // in minutes
  questions: InterviewQuestion[];
  currentQuestionIndex: number;
  startTime: Date;
  endTime?: Date;
  status: 'not-started' | 'in-progress' | 'completed';
  score: number;
  feedback: string[];
}

const COMPANY_QUESTIONS = {
  'Google': [
    {
      id: 'google-1',
      company: 'Google',
      difficulty: 'medium' as const,
      category: 'Arrays',
      title: 'Two Sum',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      constraints: ['2 ≤ nums.length ≤ 10⁴', '-10⁹ ≤ nums[i] ≤ 10⁹', 'Only one valid answer exists'],
      examples: [
        {
          input: 'nums = [2,7,11,15], target = 9',
          output: '[0,1]',
          explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
        }
      ],
      hints: ['Use a hash map to store complements', 'Single pass solution exists'],
      optimalComplexity: { time: 'O(n)', space: 'O(n)' }
    }
  ],
  'Amazon': [
    {
      id: 'amazon-1',
      company: 'Amazon',
      difficulty: 'easy' as const,
      category: 'Strings',
      title: 'Valid Palindrome',
      description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.',
      constraints: ['1 ≤ s.length ≤ 2 * 10⁵', 's consists only of printable ASCII characters'],
      examples: [
        {
          input: 's = "A man, a plan, a canal: Panama"',
          output: 'true',
          explanation: '"amanaplanacanalpanama" is a palindrome.'
        }
      ],
      hints: ['Two pointer approach', 'Ignore non-alphanumeric characters'],
      optimalComplexity: { time: 'O(n)', space: 'O(1)' }
    }
  ],
  'Microsoft': [
    {
      id: 'microsoft-1',
      company: 'Microsoft',
      difficulty: 'hard' as const,
      category: 'Dynamic Programming',
      title: 'Longest Increasing Subsequence',
      description: 'Given an integer array nums, return the length of the longest strictly increasing subsequence.',
      constraints: ['1 ≤ nums.length ≤ 2500', '-10⁴ ≤ nums[i] ≤ 10⁴'],
      examples: [
        {
          input: 'nums = [10,9,2,5,3,7,101,18]',
          output: '4',
          explanation: 'The longest increasing subsequence is [2,3,7,18], therefore the length is 4.'
        }
      ],
      hints: ['Dynamic programming approach', 'Binary search optimization possible'],
      optimalComplexity: { time: 'O(n log n)', space: 'O(n)' }
    }
  ]
};

export function InterviewSimulator() {
  const navigate = useNavigate();
  const [currentSession, setCurrentSession] = useState<InterviewSession | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentCode, setCurrentCode] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string>('Google');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isTimerRunning, timeRemaining]);

  const startInterview = (company: string) => {
    const questions = COMPANY_QUESTIONS[company as keyof typeof COMPANY_QUESTIONS] || [];
    
    const session: InterviewSession = {
      id: `interview-${Date.now()}`,
      company,
      duration: 45, // 45 minutes
      questions,
      currentQuestionIndex: 0,
      startTime: new Date(),
      status: 'in-progress',
      score: 0,
      feedback: []
    };
    
    setCurrentSession(session);
    setTimeRemaining(session.duration * 60); // Convert to seconds
    setIsTimerRunning(true);
    setCurrentCode('');
  };

  const handleTimeUp = () => {
    if (currentSession) {
      setCurrentSession(prev => prev ? {
        ...prev,
        status: 'completed',
        endTime: new Date(),
        feedback: [...prev.feedback, 'Interview completed due to time limit']
      } : null);
    }
  };

  const nextQuestion = () => {
    if (currentSession && currentSession.currentQuestionIndex < currentSession.questions.length - 1) {
      setCurrentSession(prev => prev ? {
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      } : null);
      setCurrentCode('');
    } else {
      completeInterview();
    }
  };

  const completeInterview = () => {
    if (currentSession) {
      setCurrentSession(prev => prev ? {
        ...prev,
        status: 'completed',
        endTime: new Date()
      } : null);
      setIsTimerRunning(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentSession) {
    return (
      <div className="max-w-4xl mx-auto p-6">
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
            <h1 className="text-3xl font-bold text-foreground">Mock Interview Simulator</h1>
            <p className="text-muted-foreground">Practice coding interviews with company-specific questions</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-6 h-6" />
              Mock Interview Simulator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.keys(COMPANY_QUESTIONS).map(company => (
                <Card key={company} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Building className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                    <h3 className="text-lg font-semibold mb-2">{company}</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {COMPANY_QUESTIONS[company as keyof typeof COMPANY_QUESTIONS].length} Questions
                    </p>
                    <Button 
                      onClick={() => startInterview(company)}
                      className="w-full"
                    >
                      Start Interview
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = currentSession.questions[currentSession.currentQuestionIndex];
  const progress = ((currentSession.currentQuestionIndex + 1) / currentSession.questions.length) * 100;

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <Building className="w-4 h-4" />
                {currentSession.company}
              </Badge>
              <Badge variant={currentQuestion.difficulty === 'easy' ? 'default' : 
                            currentQuestion.difficulty === 'medium' ? 'secondary' : 'destructive'}>
                {currentQuestion.difficulty}
              </Badge>
              <span className="text-sm text-gray-600">
                Question {currentSession.currentQuestionIndex + 1} of {currentSession.questions.length}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className={`font-mono text-lg ${timeRemaining < 300 ? 'text-red-600' : ''}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
            <Progress value={progress} className="w-32" />
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Question Panel */}
        <div className="w-1/2 p-6 overflow-auto border-r">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">{currentQuestion.title}</h2>
              <p className="text-gray-700">{currentQuestion.description}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Examples:</h3>
              {currentQuestion.examples.map((example, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded mb-2">
                  <div className="font-mono text-sm">
                    <div><strong>Input:</strong> {example.input}</div>
                    <div><strong>Output:</strong> {example.output}</div>
                    <div className="text-gray-600 mt-1">{example.explanation}</div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h3 className="font-semibold mb-2">Constraints:</h3>
              <ul className="list-disc list-inside text-sm space-y-1">
                {currentQuestion.constraints.map((constraint, index) => (
                  <li key={index}>{constraint}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Hints:</h3>
              <ul className="list-disc list-inside text-sm space-y-1 text-blue-600">
                {currentQuestion.hints.map((hint, index) => (
                  <li key={index}>{hint}</li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50 p-3 rounded">
              <h3 className="font-semibold mb-1">Target Complexity:</h3>
              <div className="text-sm">
                <div>Time: {currentQuestion.optimalComplexity.time}</div>
                <div>Space: {currentQuestion.optimalComplexity.space}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Code Editor Panel */}
        <div className="w-1/2 flex flex-col">
          <div className="flex-1">
            <EnhancedCodeEditor
              initialCode={currentCode}
              language="javascript"
              onCodeChange={setCurrentCode}
              showConsole={true}
              enableDebugging={false}
            />
          </div>
          
          <div className="p-4 border-t bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isTimerRunning ? 'Pause' : 'Resume'}
                </Button>
                
                <Button
                  variant="destructive"
                  onClick={completeInterview}
                >
                  <Square className="w-4 h-4 mr-2" />
                  End Interview
                </Button>
              </div>
              
              <Button
                onClick={nextQuestion}
                disabled={!currentCode.trim()}
              >
                {currentSession.currentQuestionIndex === currentSession.questions.length - 1 ? 
                  'Complete Interview' : 'Next Question'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
