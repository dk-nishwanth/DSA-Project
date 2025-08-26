import { NavLink } from 'react-router-dom';
import { Clock, Gauge, ArrowRight, BookOpen, Lightbulb } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DSATopic } from '@/data/dsaTopics';
import { cn } from '@/lib/utils';

interface ConceptCardProps {
  topic: DSATopic;
}

// Real-world analogies for better understanding
const getTopicAnalogy = (topicId: string): string => {
  const analogies: Record<string, string> = {
    'array-basics': '📚 Like organizing books on a shelf by index',
    'bubble-sort': '🫧 Like bubbles rising to the surface',
    'stack-operations': '🥞 Like a stack of pancakes - last in, first out',
    'queue-operations': '🚶‍♂️ Like people waiting in line at a store',
    'binary-search': '📖 Like finding a word in a dictionary',
    'linked-list-singly': '🔗 Like a chain where each link points to the next',
    'binary-search-tree': '🌳 Like a family tree with organized relationships',
    'hash-table': '📇 Like a filing cabinet with labeled drawers',
    'two-sum': '🎯 Like finding two puzzle pieces that fit together',
    'dijkstra-algorithm': '🗺️ Like GPS finding the shortest route',
    'merge-sort': '🃏 Like sorting two decks of cards and merging them',
    'quick-sort': '⚡ Like quickly organizing items by picking a reference point',
    'insertion-sort': '🎴 Like sorting playing cards in your hand',
    'selection-sort': '🏆 Like repeatedly finding the best item and placing it',
    'counting-sort': '📊 Like counting votes and organizing by frequency',
    'graph-dfs': '🕳️ Like exploring a maze by going as deep as possible',
    'graph-bfs': '🌊 Like ripples spreading outward in water',
    'recursion-basics': '🪆 Like Russian nesting dolls - problems within problems',
    'fibonacci': '🐰 Like rabbit population growth patterns',
    'dp-introduction': '💾 Like remembering solutions to avoid repeating work',
    'bit-basics': '💡 Like light switches - on (1) or off (0)',
    'gcd-lcm': '🔢 Like finding common factors in math class'
  };
  return analogies[topicId] || '🧠 A fundamental computer science concept';
};

const getDifficultyEmoji = (difficulty: string): string => {
  switch (difficulty) {
    case 'beginner': return '🌱';
    case 'intermediate': return '🌿';
    case 'advanced': return '🌳';
    default: return '📚';
  }
};

export function ConceptCard({ topic }: ConceptCardProps) {
  const analogy = getTopicAnalogy(topic.id);
  const difficultyEmoji = getDifficultyEmoji(topic.difficulty);

  return (
    <div className="concept-card group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
              {topic.title}
            </h3>
            <span className="text-lg">{difficultyEmoji}</span>
          </div>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
            {topic.description}
          </p>
          <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 mb-3">
            <Lightbulb className="h-3 w-3" />
            <span className="italic">{analogy}</span>
          </div>
        </div>
        <Badge 
          variant="secondary"
          className={cn(
            "ml-3 flex items-center gap-1",
            topic.difficulty === 'beginner' && "bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200",
            topic.difficulty === 'intermediate' && "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200",
            topic.difficulty === 'advanced' && "bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-200"
          )}
        >
          {topic.difficulty}
        </Badge>
      </div>

      <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
        {topic.timeComplexity && (
          <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-950 px-2 py-1 rounded">
            <Clock className="h-3 w-3" />
            <span>⏱️ {topic.timeComplexity}</span>
          </div>
        )}
        {topic.spaceComplexity && (
          <div className="flex items-center gap-1 bg-purple-50 dark:bg-purple-950 px-2 py-1 rounded">
            <Gauge className="h-3 w-3" />
            <span>💾 {topic.spaceComplexity}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            {topic.category}
          </Badge>
        </div>
        
        <NavLink to={`/topic/${topic.id}`}>
          <Button 
            size="sm" 
            className="control-button group-hover:bg-primary/90 transition-all duration-200"
          >
            Start Learning
            <ArrowRight className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-1" />
          </Button>
        </NavLink>
      </div>
    </div>
  );
}