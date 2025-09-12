import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, ChevronLeft, ChevronRight, Plus, Target, Clock, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { dsaTopics } from '@/data/dsaTopics';

interface StudyGoal {
  id: string;
  title: string;
  description: string;
  topicIds: string[];
  targetDate: Date;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: Date;
}

interface StudyCalendarProps {
  className?: string;
}

export function StudyCalendar({ className }: StudyCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    topicIds: [] as string[],
    targetDate: new Date(),
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  // Load goals from localStorage
  useEffect(() => {
    const savedGoals = localStorage.getItem('study-goals');
    if (savedGoals) {
      try {
        const parsed = JSON.parse(savedGoals).map((goal: any) => ({
          ...goal,
          targetDate: new Date(goal.targetDate),
          createdAt: new Date(goal.createdAt)
        }));
        setGoals(parsed);
      } catch {
        setGoals([]);
      }
    }
  }, []);

  // Save goals to localStorage
  useEffect(() => {
    localStorage.setItem('study-goals', JSON.stringify(goals));
  }, [goals]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getGoalsForDate = (date: Date) => {
    return goals.filter(goal => {
      const goalDate = new Date(goal.targetDate);
      return goalDate.toDateString() === date.toDateString();
    });
  };

  const addGoal = () => {
    if (!newGoal.title.trim()) return;

    const goal: StudyGoal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      topicIds: newGoal.topicIds,
      targetDate: newGoal.targetDate,
      priority: newGoal.priority,
      completed: false,
      createdAt: new Date()
    };

    setGoals(prev => [...prev, goal]);
    setNewGoal({
      title: '',
      description: '',
      topicIds: [],
      targetDate: new Date(),
      priority: 'medium'
    });
    setIsAddingGoal(false);
  };

  const toggleGoalCompletion = (goalId: string) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
    ));
  };

  const deleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-border/50"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayGoals = getGoalsForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = selectedDate?.toDateString() === date.toDateString();

      days.push(
        <div
          key={day}
          className={cn(
            "h-24 border border-border/50 p-1 cursor-pointer hover:bg-muted/50 transition-colors",
            isToday && "bg-primary/10 border-primary/30",
            isSelected && "bg-primary/20 border-primary"
          )}
          onClick={() => setSelectedDate(date)}
        >
          <div className="flex items-center justify-between mb-1">
            <span className={cn(
              "text-sm font-medium",
              isToday && "text-primary font-bold"
            )}>
              {day}
            </span>
            {dayGoals.length > 0 && (
              <Badge variant="secondary" className="text-xs px-1 py-0">
                {dayGoals.length}
              </Badge>
            )}
          </div>
          <div className="space-y-1">
            {dayGoals.slice(0, 2).map(goal => (
              <div
                key={goal.id}
                className={cn(
                  "text-xs p-1 rounded truncate",
                  goal.completed ? "bg-green-100 text-green-800 line-through" : "bg-blue-100 text-blue-800"
                )}
                title={goal.title}
              >
                {goal.title}
              </div>
            ))}
            {dayGoals.length > 2 && (
              <div className="text-xs text-muted-foreground">
                +{dayGoals.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const selectedDateGoals = selectedDate ? getGoalsForDate(selectedDate) : [];

  return (
    <div className={cn("space-y-6", className)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Study Calendar & Goals
          </CardTitle>
          <CardDescription>
            Plan your learning journey and set study targets for specific dates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="text-lg font-semibold">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <Dialog open={isAddingGoal} onOpenChange={setIsAddingGoal}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Goal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Study Goal</DialogTitle>
                  <DialogDescription>
                    Set a learning target with a specific date to stay motivated
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Goal Title</Label>
                    <Input
                      id="title"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Master Binary Search"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      value={newGoal.description}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Additional details about your goal..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Related Topics</Label>
                    <Select
                      value={newGoal.topicIds[0] || ''}
                      onValueChange={(value) => setNewGoal(prev => ({ ...prev, topicIds: [value] }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        {dsaTopics.map(topic => (
                          <SelectItem key={topic.id} value={topic.id}>
                            {topic.title} ({topic.category})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="targetDate">Target Date</Label>
                      <Input
                        id="targetDate"
                        type="date"
                        value={newGoal.targetDate.toISOString().split('T')[0]}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, targetDate: new Date(e.target.value) }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select
                        value={newGoal.priority}
                        onValueChange={(value: 'low' | 'medium' | 'high') => 
                          setNewGoal(prev => ({ ...prev, priority: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddingGoal(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addGoal}>
                      Add Goal
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-0 border border-border rounded-lg overflow-hidden">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="bg-muted p-2 text-center text-sm font-medium border-b border-border">
                {day}
              </div>
            ))}
            {/* Calendar days */}
            {renderCalendar()}
          </div>

          {/* Selected Date Goals */}
          {selectedDate && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Goals for {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDateGoals.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No goals set for this date
                  </p>
                ) : (
                  <div className="space-y-3">
                    {selectedDateGoals.map(goal => {
                      const topic = dsaTopics.find(t => t.id === goal.topicIds[0]);
                      return (
                        <div
                          key={goal.id}
                          className={cn(
                            "p-4 border rounded-lg",
                            goal.completed && "bg-green-50 border-green-200"
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className={cn(
                                  "font-medium",
                                  goal.completed && "line-through text-muted-foreground"
                                )}>
                                  {goal.title}
                                </h4>
                                <div className={cn(
                                  "w-2 h-2 rounded-full",
                                  getPriorityColor(goal.priority)
                                )} />
                                <Badge variant="outline" className="text-xs">
                                  {goal.priority}
                                </Badge>
                              </div>
                              {goal.description && (
                                <p className="text-sm text-muted-foreground mb-2">
                                  {goal.description}
                                </p>
                              )}
                              {topic && (
                                <Badge variant="secondary" className="text-xs">
                                  {topic.title}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant={goal.completed ? "outline" : "default"}
                                onClick={() => toggleGoalCompletion(goal.id)}
                              >
                                {goal.completed ? (
                                  <CheckCircle className="h-4 w-4" />
                                ) : (
                                  <Target className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteGoal(goal.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Upcoming Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Goals</CardTitle>
            </CardHeader>
            <CardContent>
              {goals.filter(goal => !goal.completed && goal.targetDate >= new Date()).length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No upcoming goals. Add some to stay motivated!
                </p>
              ) : (
                <div className="space-y-2">
                  {goals
                    .filter(goal => !goal.completed && goal.targetDate >= new Date())
                    .sort((a, b) => a.targetDate.getTime() - b.targetDate.getTime())
                    .slice(0, 5)
                    .map(goal => {
                      const topic = dsaTopics.find(t => t.id === goal.topicIds[0]);
                      const daysUntil = Math.ceil((goal.targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                      
                      return (
                        <div key={goal.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{goal.title}</span>
                              <div className={cn(
                                "w-2 h-2 rounded-full",
                                getPriorityColor(goal.priority)
                              )} />
                            </div>
                            {topic && (
                              <Badge variant="secondary" className="text-xs mt-1">
                                {topic.title}
                              </Badge>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {goal.targetDate.toLocaleDateString()}
                            </div>
                            <div className={cn(
                              "text-xs",
                              daysUntil <= 3 ? "text-red-600" : daysUntil <= 7 ? "text-yellow-600" : "text-muted-foreground"
                            )}>
                              {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}