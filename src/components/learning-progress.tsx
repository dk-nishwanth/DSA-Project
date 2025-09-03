import { useState, useEffect } from 'react';
import { Trophy, Target, CheckCircle, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { dsaTopics } from '@/data/dsaTopics';

interface LearningProgressProps {
  currentTopicId?: string;
}

interface TopicProgress {
  topicId: string;
  completed: boolean;
  timeSpent: number;
  lastVisited: Date;
}

export function LearningProgress({ currentTopicId }: LearningProgressProps) {
  const [progress, setProgress] = useState<TopicProgress[]>([]);
  const [achievements, setAchievements] = useState<string[]>([]);

  useEffect(() => {
    const savedProgress = localStorage.getItem('dsa-learning-progress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
    const savedAchievements = localStorage.getItem('dsa-achievements');
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements));
    }
  }, []);

  useEffect(() => {
    if (currentTopicId) {
      const updatedProgress = [...progress];
      const existingIndex = updatedProgress.findIndex(p => p.topicId === currentTopicId);
      
      if (existingIndex >= 0) {
        updatedProgress[existingIndex].lastVisited = new Date();
        updatedProgress[existingIndex].timeSpent += 1;
      } else {
        updatedProgress.push({
          topicId: currentTopicId,
          completed: false,
          timeSpent: 1,
          lastVisited: new Date()
        });
      }
      
      setProgress(updatedProgress);
      localStorage.setItem('dsa-learning-progress', JSON.stringify(updatedProgress));
      checkAchievements(updatedProgress);
    }
  }, [currentTopicId]);

  const checkAchievements = (currentProgress: TopicProgress[]) => {
    const newAchievements = [...achievements];
    
    if (currentProgress.length >= 1 && !achievements.includes('first-topic')) {
      newAchievements.push('first-topic');
    }
    
    const beginnerTopics = dsaTopics.filter(t => t.difficulty === 'beginner');
    const completedBeginner = currentProgress.filter(p => 
      beginnerTopics.some(t => t.id === p.topicId) && p.completed
    ).length;
    
    if (completedBeginner >= 3 && !achievements.includes('beginner-master')) {
      newAchievements.push('beginner-master');
    }
    
    if (newAchievements.length > achievements.length) {
      setAchievements(newAchievements);
      localStorage.setItem('dsa-achievements', JSON.stringify(newAchievements));
    }
  };

  const markTopicCompleted = (topicId: string) => {
    const updatedProgress = progress.map(p => 
      p.topicId === topicId ? { ...p, completed: true } : p
    );
    setProgress(updatedProgress);
    localStorage.setItem('dsa-learning-progress', JSON.stringify(updatedProgress));
    checkAchievements(updatedProgress);
    // Notify other components (e.g., sidebar) that progress has updated
    try {
      window.dispatchEvent(new Event('dsa-progress-updated'));
    } catch {}
  };

  const getProgressStats = () => {
    const totalTopics = dsaTopics.length;
    const visitedTopics = progress.length;
    const completedTopics = progress.filter(p => p.completed).length;
    const progressPercentage = (completedTopics / totalTopics) * 100;
    
    return { totalTopics, visitedTopics, completedTopics, progressPercentage };
  };

  const stats = getProgressStats();

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200">Learning Progress</h3>
        </div>
        <div className="text-xs text-muted-foreground">
          {Math.round(stats.progressPercentage)}% Complete
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-indigo-600">{stats.visitedTopics}</div>
            <div className="text-xs text-muted-foreground">Explored</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{stats.completedTopics}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">{achievements.length}</div>
            <div className="text-xs text-muted-foreground">Achievements</div>
          </div>
        </div>
        
        {achievements.length > 0 && (
          <div className="flex gap-1">
            {achievements.slice(-2).map((_, index) => (
              <Trophy key={index} className="h-4 w-4 text-yellow-500" />
            ))}
          </div>
        )}
      </div>

      <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
        <div 
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(stats.progressPercentage, 100)}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          {stats.completedTopics === 0 
            ? "🚀 Start your DSA journey!"
            : stats.completedTopics < 5
            ? "🌱 Building foundations..."
            : "🔥 Great progress!"
          }
        </div>
        
        {currentTopicId && (
          <button
            onClick={() => markTopicCompleted(currentTopicId)}
            className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 transition-colors"
            disabled={progress.find(p => p.topicId === currentTopicId)?.completed}
          >
            <CheckCircle className="h-3 w-3" />
            {progress.find(p => p.topicId === currentTopicId)?.completed 
              ? "✅ Done" 
              : "Mark Done"
            }
          </button>
        )}
      </div>
    </div>
  );
}