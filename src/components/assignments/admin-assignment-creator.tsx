import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Save, 
  Eye, 
  Trash2, 
  Code, 
  FileText, 
  CheckSquare, 
  MessageSquare,
  Calendar,
  Award,
  Tag,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Assignment, 
  AssignmentQuestion, 
  TestCase, 
  RubricItem,
  getQuestionTypeIcon, 
  getQuestionTypeLabel,
  createAssignment
} from '@/data/assignmentData';
import { dsaTopics } from '@/data/dsaTopics';

export function AdminAssignmentCreator() {
  const [activeTab, setActiveTab] = useState('basic');
  const [questionType, setQuestionType] = useState<Assignment['questionType']>('problem');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<Assignment['difficulty']>('medium');
  const [topicId, setTopicId] = useState<string>('');
  const [points, setPoints] = useState(10);
  const [dueDate, setDueDate] = useState('');
  const [instructions, setInstructions] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  // Question-specific fields
  const [questionContent, setQuestionContent] = useState('');
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState<number>(0);
  const [constraints, setConstraints] = useState('');
  const [codeTemplate, setCodeTemplate] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [rubric, setRubric] = useState<RubricItem[]>([]);

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addTestCase = () => {
    setTestCases([...testCases, {
      input: '',
      expectedOutput: '',
      isHidden: false,
      description: ''
    }]);
  };

  const updateTestCase = (index: number, field: keyof TestCase, value: string | boolean) => {
    const updatedTestCases = [...testCases];
    updatedTestCases[index] = { ...updatedTestCases[index], [field]: value };
    setTestCases(updatedTestCases);
  };

  const removeTestCase = (index: number) => {
    setTestCases(testCases.filter((_, i) => i !== index));
  };

  const addRubricItem = () => {
    setRubric([...rubric, {
      criterion: '',
      maxPoints: 5,
      description: ''
    }]);
  };

  const updateRubricItem = (index: number, field: keyof RubricItem, value: string | number) => {
    const updatedRubric = [...rubric];
    updatedRubric[index] = { ...updatedRubric[index], [field]: value };
    setRubric(updatedRubric);
  };

  const removeRubricItem = (index: number) => {
    setRubric(rubric.filter((_, i) => i !== index));
  };

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [savedAssignmentId, setSavedAssignmentId] = useState<string | null>(null);

  const handleSave = () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    const question: AssignmentQuestion = {
      type: questionType,
      content: questionContent,
      ...(questionType === 'quiz' || questionType === 'multiple-choice') && {
        options: options.filter(opt => opt.trim()),
        correctAnswer
      },
      ...(questionType === 'program') && {
        constraints,
        codeTemplate,
        language: language as any,
        testCases: testCases.filter(tc => tc.input.trim() && tc.expectedOutput.trim())
      },
      ...(questionType === 'essay') && {
        rubric: rubric.filter(r => r.criterion.trim())
      }
    };

    const assignment = createAssignment({
      title,
      description,
      questionType,
      difficulty,
      topicId: topicId || undefined,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      points,
      createdBy: 'admin-1',
      isActive: true,
      question,
      instructions: instructions || undefined,
      tags
    });

    // In a real app, you would save to the backend here
    // For now, we'll simulate saving to localStorage
    try {
      // Get existing assignments from localStorage or initialize empty array
      const existingAssignments = JSON.parse(localStorage.getItem('dsa_assignments') || '[]');
      
      // Add the new assignment
      existingAssignments.push(assignment);
      
      // Save back to localStorage
      localStorage.setItem('dsa_assignments', JSON.stringify(existingAssignments));
      
      console.log('Assignment saved successfully:', assignment);
      setSavedAssignmentId(assignment.id);
      setSaveSuccess(true);
      
      // Reset form after successful save
      setTimeout(() => {
        if (confirm('Assignment created successfully! Create another assignment?')) {
          resetForm();
        }
      }, 500);
    } catch (error) {
      console.error('Error saving assignment:', error);
      alert('Failed to save assignment. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setQuestionType('problem');
    setDifficulty('medium');
    setTopicId('');
    setPoints(10);
    setDueDate('');
    setInstructions('');
    setTags([]);
    setQuestionContent('');
    setOptions(['', '', '', '']);
    setCorrectAnswer(0);
    setConstraints('');
    setCodeTemplate('');
    setLanguage('javascript');
    setTestCases([]);
    setRubric([]);
    setSaveSuccess(false);
    setSavedAssignmentId(null);
  };

  const renderQuestionTypeFields = () => {
    switch (questionType) {
      case 'quiz':
      case 'multiple-choice':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="questionContent">Question:</Label>
              <Textarea
                id="questionContent"
                value={questionContent}
                onChange={(e) => setQuestionContent(e.target.value)}
                placeholder="Enter your question here..."
                className="min-h-[100px]"
              />
            </div>
            
            <div>
              <Label>Options:</Label>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...options];
                        newOptions[index] = e.target.value;
                        setOptions(newOptions);
                      }}
                      placeholder={`Option ${index + 1}`}
                    />
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={correctAnswer === index}
                      onChange={() => setCorrectAnswer(index)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'program':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="questionContent">Problem Description:</Label>
              <Textarea
                id="questionContent"
                value={questionContent}
                onChange={(e) => setQuestionContent(e.target.value)}
                placeholder="Describe the programming problem..."
                className="min-h-[200px]"
              />
            </div>
            
            <div>
              <Label htmlFor="constraints">Constraints:</Label>
              <Textarea
                id="constraints"
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                placeholder="e.g., Time complexity should be O(n), Space complexity should be O(1)"
                className="min-h-[100px]"
              />
            </div>
            
            <div>
              <Label htmlFor="codeTemplate">Code Template (Optional):</Label>
              <Textarea
                id="codeTemplate"
                value={codeTemplate}
                onChange={(e) => setCodeTemplate(e.target.value)}
                placeholder="Provide a starting code template..."
                className="font-mono text-sm min-h-[150px]"
              />
            </div>
            
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
              <div className="flex items-center justify-between mb-2">
                <Label>Test Cases:</Label>
                <Button type="button" variant="outline" size="sm" onClick={addTestCase}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Test Case
                </Button>
              </div>
              <div className="space-y-3">
                {testCases.map((testCase, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Input:</Label>
                          <Input
                            value={testCase.input}
                            onChange={(e) => updateTestCase(index, 'input', e.target.value)}
                            placeholder="Test input"
                          />
                        </div>
                        <div>
                          <Label>Expected Output:</Label>
                          <Input
                            value={testCase.expectedOutput}
                            onChange={(e) => updateTestCase(index, 'expectedOutput', e.target.value)}
                            placeholder="Expected output"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={testCase.isHidden}
                            onCheckedChange={(checked) => updateTestCase(index, 'isHidden', checked)}
                          />
                          <Label className="text-sm">Hidden Test Case</Label>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeTestCase(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 'essay':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="questionContent">Essay Prompt:</Label>
              <Textarea
                id="questionContent"
                value={questionContent}
                onChange={(e) => setQuestionContent(e.target.value)}
                placeholder="Provide the essay prompt or question..."
                className="min-h-[200px]"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Grading Rubric:</Label>
                <Button type="button" variant="outline" size="sm" onClick={addRubricItem}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Criterion
                </Button>
              </div>
              <div className="space-y-3">
                {rubric.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <Label>Criterion:</Label>
                          <Input
                            value={item.criterion}
                            onChange={(e) => updateRubricItem(index, 'criterion', e.target.value)}
                            placeholder="e.g., Understanding of concepts"
                          />
                        </div>
                        <div>
                          <Label>Description:</Label>
                          <Textarea
                            value={item.description}
                            onChange={(e) => updateRubricItem(index, 'description', e.target.value)}
                            placeholder="Describe what you're looking for..."
                            className="min-h-[80px]"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Label>Max Points:</Label>
                            <Input
                              type="number"
                              value={item.maxPoints}
                              onChange={(e) => updateRubricItem(index, 'maxPoints', parseInt(e.target.value))}
                              className="w-20"
                              min="1"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeRubricItem(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 'problem':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="questionContent">Problem Statement:</Label>
              <Textarea
                id="questionContent"
                value={questionContent}
                onChange={(e) => setQuestionContent(e.target.value)}
                placeholder="Describe the problem to be solved..."
                className="min-h-[200px]"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Example Test Cases (Optional):</Label>
                <Button type="button" variant="outline" size="sm" onClick={addTestCase}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Test Case
                </Button>
              </div>
              <div className="space-y-3">
                {testCases.map((testCase, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Input:</Label>
                          <Input
                            value={testCase.input}
                            onChange={(e) => updateTestCase(index, 'input', e.target.value)}
                            placeholder="Example input"
                          />
                        </div>
                        <div>
                          <Label>Expected Output:</Label>
                          <Input
                            value={testCase.expectedOutput}
                            onChange={(e) => updateTestCase(index, 'expectedOutput', e.target.value)}
                            placeholder="Expected output"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeTestCase(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div>
            <Label htmlFor="questionContent">Question Content:</Label>
            <Textarea
              id="questionContent"
              value={questionContent}
              onChange={(e) => setQuestionContent(e.target.value)}
              placeholder="Enter your question here..."
              className="min-h-[200px]"
            />
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create Assignment</h1>
          <p className="text-muted-foreground">Create new assignments for students to complete</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Assignment
          </Button>
        </div>
      </div>

      {/* Main Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="question">Question</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Assignment Title:</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter assignment title..."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description:</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief description of the assignment..."
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="difficulty">Difficulty:</Label>
                      <Select value={difficulty} onValueChange={(value: any) => setDifficulty(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="points">Points:</Label>
                      <Input
                        id="points"
                        type="number"
                        value={points}
                        onChange={(e) => setPoints(parseInt(e.target.value))}
                        min="1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="topic">Related Topic (Optional):</Label>
                    <Select value={topicId} onValueChange={setTopicId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a topic..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No topic</SelectItem>
                        {dsaTopics.map(topic => (
                          <SelectItem key={topic.id} value={topic.id}>
                            {topic.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="dueDate">Due Date (Optional):</Label>
                    <Input
                      id="dueDate"
                      type="datetime-local"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="question" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Question Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="questionType">Question Type:</Label>
                    <Select value={questionType} onValueChange={(value: any) => setQuestionType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quiz">Quiz</SelectItem>
                        <SelectItem value="program">Programming</SelectItem>
                        <SelectItem value="problem">Problem Solving</SelectItem>
                        <SelectItem value="essay">Essay</SelectItem>
                        <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center gap-2 p-3 border rounded-lg">
                    <span className="text-2xl">{getQuestionTypeIcon(questionType)}</span>
                    <div>
                      <div className="font-medium">{getQuestionTypeLabel(questionType)}</div>
                      <div className="text-sm text-muted-foreground">
                        {questionType === 'quiz' && 'Single correct answer question'}
                        {questionType === 'program' && 'Coding problem with test cases'}
                        {questionType === 'problem' && 'Problem solving with detailed answer'}
                        {questionType === 'essay' && 'Written response with rubric'}
                        {questionType === 'multiple-choice' && 'Multiple choice question'}
                      </div>
                    </div>
                  </div>
                  
                  {renderQuestionTypeFields()}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Additional Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="instructions">Instructions (Optional):</Label>
                    <Textarea
                      id="instructions"
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="Additional instructions for students..."
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div>
                    <Label>Tags:</Label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Add a tag..."
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        />
                        <Button type="button" variant="outline" onClick={addTag}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                            {tag} ×
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">{title || 'Untitled Assignment'}</h3>
                <p className="text-sm text-muted-foreground">{description || 'No description'}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {getQuestionTypeIcon(questionType)} {getQuestionTypeLabel(questionType)}
                </Badge>
                <Badge className={difficulty === 'easy' ? 'bg-green-100 text-green-800' : 
                                  difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-red-100 text-red-800'}>
                  {difficulty}
                </Badge>
                <Badge className="bg-yellow-100 text-yellow-800">
                  <Award className="h-3 w-3 mr-1" />
                  {points} pts
                </Badge>
              </div>
              
              {topicId && (
                <div className="text-sm">
                  <span className="font-medium">Topic:</span> {dsaTopics.find(t => t.id === topicId)?.title}
                </div>
              )}
              
              {dueDate && (
                <div className="text-sm">
                  <span className="font-medium">Due:</span> {new Date(dueDate).toLocaleDateString()}
                </div>
              )}
              
              {tags.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-1">Tags:</div>
                  <div className="flex flex-wrap gap-1">
                    {tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
