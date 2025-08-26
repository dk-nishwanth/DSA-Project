import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Award, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Play,
  Save,
  Send,
  Code,
  FileText,
  CheckSquare,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  getAssignmentById, 
  getQuestionTypeIcon, 
  getQuestionTypeLabel, 
  getDifficultyColor,
  Assignment,
  AssignmentSubmission
} from '@/data/assignmentData';
import { dsaTopics } from '@/data/dsaTopics';

export function AssignmentDetail() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('question');
  const [answer, setAnswer] = useState('');
  const [code, setCode] = useState('');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [language, setLanguage] = useState('javascript');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const assignment = getAssignmentById(assignmentId || '');
  
  if (!assignment) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-red-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Assignment not found</h3>
            <p className="text-muted-foreground mb-4">
              The assignment you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/assignments')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Assignments
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const topic = assignment.topicId ? dsaTopics.find(t => t.id === assignment.topicId) : null;
  const hasSubmission = assignment.submissions.length > 0;
  const isOverdue = assignment.dueDate && new Date() > assignment.dueDate;

  const formatDueDate = (dueDate: Date) => {
    const now = new Date();
    const diff = dueDate.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) {
      return `Overdue by ${Math.abs(days)} days`;
    } else if (days === 0) {
      return 'Due today';
    } else if (days === 1) {
      return 'Due tomorrow';
    } else {
      return `Due in ${days} days`;
    }
  };

  const getDueDateColor = (dueDate: Date) => {
    const now = new Date();
    const diff = dueDate.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return 'text-red-600';
    if (days <= 1) return 'text-orange-600';
    if (days <= 3) return 'text-yellow-600';
    return 'text-green-600';
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, you would submit to the backend here
    console.log('Submitting assignment:', {
      assignmentId: assignment.id,
      answer,
      code,
      selectedOption,
      language
    });
    
    setIsSubmitting(false);
    // Navigate to submissions page or show success message
  };

  const renderQuestionContent = () => {
    switch (assignment.questionType) {
      case 'quiz':
      case 'multiple-choice':
        return (
          <div className="space-y-4">
            <div className="text-lg font-medium">{assignment.question.content}</div>
            <div className="space-y-3">
              {assignment.question.options?.map((option, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedOption === index
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedOption(index)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedOption === index
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedOption === index && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'program':
        return (
          <div className="space-y-4">
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-sm">{assignment.question.content}</pre>
            </div>
            
            {assignment.question.constraints && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Constraints</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{assignment.question.constraints}</p>
                </CardContent>
              </Card>
            )}
            
            {assignment.question.testCases && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Test Cases</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {assignment.question.testCases.map((testCase, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium">Test Case {index + 1}</span>
                          {testCase.isHidden && (
                            <Badge variant="secondary" className="text-xs">Hidden</Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Input:</span>
                            <pre className="mt-1 p-2 bg-muted rounded">{testCase.input}</pre>
                          </div>
                          <div>
                            <span className="font-medium">Expected Output:</span>
                            <pre className="mt-1 p-2 bg-muted rounded">{testCase.expectedOutput}</pre>
                          </div>
                        </div>
                        {testCase.description && (
                          <p className="text-xs text-muted-foreground mt-2">{testCase.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="language">Programming Language:</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="cpp">C++</SelectItem>
                    <SelectItem value="csharp">C#</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="code">Your Code:</Label>
                <Textarea
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={assignment.question.codeTemplate || "Write your code here..."}
                  className="font-mono text-sm min-h-[300px]"
                />
              </div>
            </div>
          </div>
        );

      case 'essay':
        return (
          <div className="space-y-4">
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-sm">{assignment.question.content}</pre>
            </div>
            
            {assignment.question.rubric && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Grading Rubric</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {assignment.question.rubric.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{item.criterion}</div>
                          <div className="text-sm text-muted-foreground">{item.description}</div>
                        </div>
                        <Badge variant="outline">{item.maxPoints} pts</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div>
              <Label htmlFor="essay">Your Essay:</Label>
              <Textarea
                id="essay"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Write your essay here..."
                className="min-h-[400px]"
              />
            </div>
          </div>
        );

      case 'problem':
        return (
          <div className="space-y-4">
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-sm">{assignment.question.content}</pre>
            </div>
            
            {assignment.question.testCases && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Example Test Cases</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {assignment.question.testCases.map((testCase, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Input:</span>
                            <pre className="mt-1 p-2 bg-muted rounded">{testCase.input}</pre>
                          </div>
                          <div>
                            <span className="font-medium">Expected Output:</span>
                            <pre className="mt-1 p-2 bg-muted rounded">{testCase.expectedOutput}</pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div>
              <Label htmlFor="answer">Your Answer:</Label>
              <Textarea
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Provide your detailed answer here..."
                className="min-h-[300px]"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap">{assignment.question.content}</pre>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/assignments')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assignments
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{assignment.title}</h1>
            <p className="text-muted-foreground">{assignment.description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {getQuestionTypeIcon(assignment.questionType)} {getQuestionTypeLabel(assignment.questionType)}
          </Badge>
          <Badge className={getDifficultyColor(assignment.difficulty)}>
            {assignment.difficulty}
          </Badge>
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            <Award className="h-3 w-3 mr-1" />
            {assignment.points} pts
          </Badge>
        </div>
      </div>

      {/* Assignment Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className={getDueDateColor(assignment.dueDate!)}>
                {assignment.dueDate ? formatDueDate(assignment.dueDate) : 'No due date'}
              </span>
            </div>
          </CardContent>
        </Card>
        
        {topic && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4" />
                <span>Topic: {topic.title}</span>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              {hasSubmission ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : isOverdue ? (
                <XCircle className="h-4 w-4 text-red-600" />
              ) : (
                <Clock className="h-4 w-4 text-yellow-600" />
              )}
              <span>
                {hasSubmission ? 'Submitted' : isOverdue ? 'Overdue' : 'Pending'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Question and Answer */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="question">Question</TabsTrigger>
              <TabsTrigger value="answer">Your Answer</TabsTrigger>
            </TabsList>
            
            <TabsContent value="question" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Question</CardTitle>
                  {assignment.instructions && (
                    <CardDescription>{assignment.instructions}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {renderQuestionContent()}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="answer" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Answer</CardTitle>
                </CardHeader>
                <CardContent>
                  {assignment.questionType === 'program' ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="code">Code:</Label>
                        <Textarea
                          id="code"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          placeholder="Write your code here..."
                          className="font-mono text-sm min-h-[300px]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="explanation">Explanation (Optional):</Label>
                        <Textarea
                          id="explanation"
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                          placeholder="Explain your approach, time complexity, etc..."
                          className="min-h-[150px]"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Label htmlFor="answer">Answer:</Label>
                      <Textarea
                        id="answer"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Write your answer here..."
                        className="min-h-[300px]"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Submission Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Submission Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Status:</span>
                <Badge variant={hasSubmission ? 'default' : isOverdue ? 'destructive' : 'secondary'}>
                  {hasSubmission ? 'Submitted' : isOverdue ? 'Overdue' : 'Not Submitted'}
                </Badge>
              </div>
              
              {assignment.dueDate && (
                <div className="flex items-center justify-between">
                  <span>Due Date:</span>
                  <span className={getDueDateColor(assignment.dueDate)}>
                    {assignment.dueDate.toLocaleDateString()}
                  </span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span>Points:</span>
                <span className="font-semibold">{assignment.points}</span>
              </div>
              
              {hasSubmission && (
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span>Score:</span>
                    <span className="font-semibold text-green-600">
                      {assignment.submissions[0].score || 'Not graded'} / {assignment.points}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {assignment.tags.map(tag => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardContent className="p-4 space-y-3">
              {!hasSubmission ? (
                <>
                  <Button 
                    className="w-full" 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Save className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Assignment
                      </>
                    )}
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                </>
              ) : (
                <Button variant="outline" className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  View Feedback
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
