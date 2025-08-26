import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Filter, 
  Search, 
  Calendar, 
  Clock, 
  Award,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  SAMPLE_ASSIGNMENTS, 
  getQuestionTypeIcon, 
  getQuestionTypeLabel, 
  getDifficultyColor,
  getActiveAssignments,
  getAssignmentsByDifficulty,
  getAssignmentsByType,
  Assignment
} from '@/data/assignmentData';
import { dsaTopics } from '@/data/dsaTopics';

export function AssignmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [topicFilter, setTopicFilter] = useState<string>('all');

  const assignments = getActiveAssignments();

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDifficulty = difficultyFilter === 'all' || assignment.difficulty === difficultyFilter;
    const matchesType = typeFilter === 'all' || assignment.questionType === typeFilter;
    const matchesTopic = topicFilter === 'all' || assignment.topicId === topicFilter;

    return matchesSearch && matchesDifficulty && matchesType && matchesTopic;
  });

  const getAssignmentStats = () => {
    const total = assignments.length;
    const completed = assignments.filter(a => a.submissions.length > 0).length;
    const pending = total - completed;
    const overdue = assignments.filter(a => 
      a.dueDate && new Date() > a.dueDate && a.submissions.length === 0
    ).length;

    return { total, completed, pending, overdue };
  };

  const stats = getAssignmentStats();

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

  const getSubmissionStatus = (assignment: Assignment) => {
    if (assignment.submissions.length === 0) {
      if (assignment.dueDate && new Date() > assignment.dueDate) {
        return { status: 'overdue', icon: XCircle, color: 'text-red-600' };
      }
      return { status: 'pending', icon: Clock, color: 'text-yellow-600' };
    }
    return { status: 'submitted', icon: CheckCircle, color: 'text-green-600' };
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Assignments</h1>
          <p className="text-muted-foreground">Complete assignments to test your knowledge and earn points</p>
        </div>
        <Button>
          <BookOpen className="h-4 w-4 mr-2" />
          View My Submissions
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Assignments</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search assignments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Difficulty</label>
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="program">Programming</SelectItem>
                  <SelectItem value="problem">Problem Solving</SelectItem>
                  <SelectItem value="essay">Essay</SelectItem>
                  <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Topic</label>
              <Select value={topicFilter} onValueChange={setTopicFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Topics</SelectItem>
                  {dsaTopics.map(topic => (
                    <SelectItem key={topic.id} value={topic.id}>
                      {topic.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignments List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Assignments ({filteredAssignments.length})
          </h2>
          <div className="text-sm text-muted-foreground">
            Showing {filteredAssignments.length} of {assignments.length} assignments
          </div>
        </div>

        {filteredAssignments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No assignments found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search terms
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAssignments.map((assignment) => {
              const submissionStatus = getSubmissionStatus(assignment);
              const StatusIcon = submissionStatus.icon;
              
              return (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">{getQuestionTypeIcon(assignment.questionType)}</span>
                            <Badge variant="outline">
                              {getQuestionTypeLabel(assignment.questionType)}
                            </Badge>
                            <Badge className={getDifficultyColor(assignment.difficulty)}>
                              {assignment.difficulty}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg">{assignment.title}</CardTitle>
                          <CardDescription className="mt-2">
                            {assignment.description}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusIcon className={`h-5 w-5 ${submissionStatus.color}`} />
                          <Award className="h-5 w-5 text-yellow-600" />
                          <span className="text-sm font-semibold">{assignment.points} pts</span>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-3">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {assignment.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        {/* Due Date */}
                        {assignment.dueDate && (
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4" />
                            <span className={getDueDateColor(assignment.dueDate)}>
                              {formatDueDate(assignment.dueDate)}
                            </span>
                          </div>
                        )}
                        
                        {/* Topic */}
                        {assignment.topicId && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <TrendingUp className="h-4 w-4" />
                            <span>
                              Topic: {dsaTopics.find(t => t.id === assignment.topicId)?.title || assignment.topicId}
                            </span>
                          </div>
                        )}
                        
                        {/* Instructions */}
                        {assignment.instructions && (
                          <div className="text-sm text-muted-foreground">
                            <strong>Instructions:</strong> {assignment.instructions}
                          </div>
                        )}
                        
                        {/* Action Button */}
                        <div className="pt-2">
                          <Button 
                            className="w-full" 
                            variant="outline"
                            onClick={() => window.location.href = `/assignment/${assignment.id}`}
                          >
                            {submissionStatus.status === 'submitted' ? 'View Submission' : 'Start Assignment'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
