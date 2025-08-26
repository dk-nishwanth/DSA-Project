import { useState, useEffect } from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DSATopic } from '@/data/dsaTopics';

interface ProgressTrackerProps {
  topics: DSATopic[];
}

export function ProgressTracker({ topics }: ProgressTrackerProps) {
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = localStorage.getItem('dsa-completed-topics');
    if (saved) {
      setCompletedTopics(new Set(JSON.parse(saved)));
    }
  }, []);

  const markComplete = (topicId: string) => {
    const newCompleted = new Set(completedTopics);
    if (newCompleted.has(topicId)) {
      newCompleted.delete(topicId);
    } else {
      newCompleted.add(topicId);
    }
    setCompletedTopics(newCompleted);
    localStorage.setItem('dsa-completed-topics', JSON.stringify([...newCompleted]));
  };

  const getProgress = () => {
    const completed = completedTopics.size;
    const total = topics.length;
    return { completed, total, percentage: Math.round((completed / total) * 100) };
  };

  const { completed, total, percentage } = getProgress();

  return {
    completedTopics,
    markComplete,
    getProgress: () => ({ completed, total, percentage }),
    ProgressBadge: () => (
      <Badge variant="outline" className="bg-success/20 text-success border-success/30">
        {completed}/{total} ({percentage}%)
      </Badge>
    ),
    TopicIcon: ({ topicId }: { topicId: string }) => 
      completedTopics.has(topicId) ? (
        <CheckCircle className="h-4 w-4 text-success" />
      ) : (
        <Circle className="h-4 w-4 text-muted-foreground" />
      )
  };
}