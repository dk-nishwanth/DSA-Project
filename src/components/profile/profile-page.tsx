import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Trophy, 
  Settings, 
  BarChart3, 
  Calendar, 
  Clock, 
  Target, 
  Award,
  Edit,
  Save,
  X,
  Bell,
  Eye,
  Palette,
  Globe,
  Accessibility,
  BookOpen,
  TrendingUp,
  Flame,
  Star,
  CheckCircle,
  Circle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  UserProfile, 
  SAMPLE_PROFILE, 
  updateProfile, 
  checkAchievements
} from '@/data/profileData';
import { dsaTopics } from '@/data/dsaTopics';

export function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(SAMPLE_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: profile.username,
    email: profile.email
  });

  const handleSaveProfile = () => {
    setProfile(updateProfile(profile, {
      username: editForm.username,
      email: editForm.email
    }));
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditForm({
      username: profile.username,
      email: profile.email
    });
    setIsEditing(false);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getCompletionPercentage = () => {
    return Math.round((profile.statistics.completedTopics / profile.statistics.totalTopics) * 100);
  };

  const getUnlockedAchievements = () => {
    return profile.achievements.filter(a => a.unlockedDate);
  };

  const getInProgressAchievements = () => {
    return profile.achievements.filter(a => !a.unlockedDate && a.progress > 0);
  };

  const getRecentQuizScores = () => {
    const allScores = Object.values(profile.progress.quizScores).flat();
    return allScores
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  };

  const getTopicProgress = () => {
    return dsaTopics.map(topic => ({
      ...topic,
      isCompleted: profile.progress.completedTopics.includes(topic.id),
      isInProgress: profile.progress.inProgressTopics.includes(topic.id),
      timeSpent: profile.progress.timeSpent[topic.id] || 0,
      quizScores: profile.progress.quizScores[topic.id] || []
    }));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Track your learning progress and achievements</p>
        </div>
        <Button onClick={() => setIsEditing(true)} disabled={isEditing}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      {/* Profile Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {profile.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Input
                        value={editForm.username}
                        onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                        placeholder="Username"
                      />
                      <Input
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        placeholder="Email"
                        type="email"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveProfile}>
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-lg font-semibold">{profile.username}</h3>
                      <p className="text-muted-foreground">{profile.email}</p>
                    </>
                  )}
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Member since {profile.joinDate.toLocaleDateString()}</p>
                <p>Last active {profile.lastActive.toLocaleDateString()}</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <h4 className="font-semibold">Quick Stats</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{profile.statistics.completedTopics}</div>
                  <div className="text-sm text-muted-foreground">Topics Completed</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{profile.statistics.totalQuizzes}</div>
                  <div className="text-sm text-muted-foreground">Quizzes Taken</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{profile.statistics.averageQuizScore}%</div>
                  <div className="text-sm text-muted-foreground">Avg Score</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{formatTime(profile.statistics.totalStudyTime * 6)}</div>
                  <div className="text-sm text-muted-foreground">Study Time</div>
                </div>
              </div>
            </div>

            {/* Streak */}
            <div className="space-y-4">
              <h4 className="font-semibold">Current Streak</h4>
              <div className="text-center p-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg text-white">
                <div className="text-3xl font-bold">{profile.progress.streakDays}</div>
                <div className="text-sm opacity-90">Days</div>
                <Flame className="h-6 w-6 mx-auto mt-2" />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Longest streak: {profile.statistics.longestStreak} days
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="progress" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-6">
          {/* Overall Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Overall Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Course Completion</span>
                  <span className="font-semibold">{getCompletionPercentage()}%</span>
                </div>
                <Progress value={getCompletionPercentage()} className="h-3" />
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{profile.statistics.completedTopics}</div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">{profile.progress.inProgressTopics.length}</div>
                    <div className="text-sm text-muted-foreground">In Progress</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-600">{profile.statistics.totalTopics - profile.statistics.completedTopics}</div>
                    <div className="text-sm text-muted-foreground">Remaining</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Topic Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Topic Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getTopicProgress().slice(0, 10).map((topic) => (
                  <div key={topic.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {topic.isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : topic.isInProgress ? (
                        <Circle className="h-5 w-5 text-yellow-600" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400" />
                      )}
                      <div>
                        <div className="font-medium">{topic.title}</div>
                        <div className="text-sm text-muted-foreground">{topic.category}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {topic.isCompleted ? 'Completed' : topic.isInProgress ? 'In Progress' : 'Not Started'}
                      </div>
                      {topic.timeSpent > 0 && (
                        <div className="text-xs text-muted-foreground">
                          {formatTime(topic.timeSpent)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Quiz Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Recent Quiz Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getRecentQuizScores().map((score, index) => {
                  const topic = dsaTopics.find(t => t.id === score.topicId);
                  return (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{topic?.title || score.topicId}</div>
                        <div className="text-sm text-muted-foreground">
                          {score.date.toLocaleDateString()} • {score.timeTaken}s
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {score.score}/{score.totalQuestions}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {Math.round((score.score / score.totalQuestions) * 100)}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          {/* Unlocked Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Unlocked Achievements ({getUnlockedAchievements().length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getUnlockedAchievements().map((achievement) => (
                  <div key={achievement.id} className="p-4 border rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div>
                        <div className="font-semibold">{achievement.title}</div>
                        <div className="text-sm text-muted-foreground">{achievement.description}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Unlocked {achievement.unlockedDate?.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* In Progress Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                In Progress Achievements ({getInProgressAchievements().length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getInProgressAchievements().map((achievement) => (
                  <div key={achievement.id} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div>
                        <div className="font-semibold">{achievement.title}</div>
                        <div className="text-sm text-muted-foreground">{achievement.description}</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{achievement.progress}/{achievement.maxProgress}</span>
                      </div>
                      <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="statistics" className="space-y-6">
          {/* Study Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Study Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{formatTime(profile.statistics.totalStudyTime * 60)}</div>
                    <div className="text-sm text-muted-foreground">Total Study Time</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{profile.statistics.averageQuizScore}%</div>
                    <div className="text-sm text-muted-foreground">Average Quiz Score</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Current Streak</span>
                    <span className="font-semibold">{profile.statistics.currentStreak} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Longest Streak</span>
                    <span className="font-semibold">{profile.statistics.longestStreak} days</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Performance Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Favorite Topics</h4>
                  <div className="space-y-1">
                    {profile.statistics.favoriteTopics.map((topicId) => {
                      const topic = dsaTopics.find(t => t.id === topicId);
                      return (
                        <div key={topicId} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>{topic?.title || topicId}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Areas for Improvement</h4>
                  <div className="space-y-1">
                    {profile.statistics.weakAreas.map((topicId) => {
                      const topic = dsaTopics.find(t => t.id === topicId);
                      return (
                        <div key={topicId} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span>{topic?.title || topicId}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Certificates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Certificates ({profile.progress.certificates.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profile.progress.certificates.map((cert) => (
                  <div key={cert.id} className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                    <div className="text-center">
                      <Award className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <div className="font-semibold">{cert.title}</div>
                      <div className="text-sm text-muted-foreground">{cert.level}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Score: {cert.score}%
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {cert.issueDate.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select value={profile.preferences.theme}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={profile.preferences.language}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="zh">Chinese</SelectItem>
                    <SelectItem value="ja">Japanese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Learning Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Learning Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Difficulty Level</Label>
                <Select value={profile.preferences.learning.difficulty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="all">All Levels</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Topics per Session</Label>
                <Select value={profile.preferences.learning.topicsPerSession.toString()}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-advance to next topic</Label>
                  <div className="text-sm text-muted-foreground">
                    Automatically move to the next topic after completion
                  </div>
                </div>
                <Switch checked={profile.preferences.learning.autoAdvance} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show hints</Label>
                  <div className="text-sm text-muted-foreground">
                    Display helpful hints during quizzes
                  </div>
                </div>
                <Switch checked={profile.preferences.learning.showHints} />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email notifications</Label>
                  <div className="text-sm text-muted-foreground">
                    Receive updates via email
                  </div>
                </div>
                <Switch checked={profile.preferences.notifications.email} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push notifications</Label>
                  <div className="text-sm text-muted-foreground">
                    Receive browser notifications
                  </div>
                </div>
                <Switch checked={profile.preferences.notifications.push} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Quiz reminders</Label>
                  <div className="text-sm text-muted-foreground">
                    Get reminded to take quizzes
                  </div>
                </div>
                <Switch checked={profile.preferences.notifications.quizReminders} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Progress updates</Label>
                  <div className="text-sm text-muted-foreground">
                    Receive progress summaries
                  </div>
                </div>
                <Switch checked={profile.preferences.notifications.progressUpdates} />
              </div>
            </CardContent>
          </Card>

          {/* Accessibility */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Accessibility className="h-5 w-5" />
                Accessibility
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Font Size</Label>
                <Select value={profile.preferences.accessibility.fontSize}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>High contrast</Label>
                  <div className="text-sm text-muted-foreground">
                    Increase contrast for better visibility
                  </div>
                </div>
                <Switch checked={profile.preferences.accessibility.highContrast} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Reduced motion</Label>
                  <div className="text-sm text-muted-foreground">
                    Reduce animations and transitions
                  </div>
                </div>
                <Switch checked={profile.preferences.accessibility.reducedMotion} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
