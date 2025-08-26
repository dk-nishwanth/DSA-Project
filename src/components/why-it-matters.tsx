import { useState } from 'react';
import { Lightbulb, TrendingUp, Users, Briefcase, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface WhyItMattersProps {
  topicId: string;
}

export function WhyItMatters({ topicId }: WhyItMattersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getTopicImportance = (topicId: string) => {
    const importance: Record<string, {
      career: string;
      performance: string;
      realWorld: string;
      interviews: string;
      difficulty: 'Easy' | 'Medium' | 'Hard';
      salary: string;
    }> = {
      'array-basics': {
        career: 'Foundation for all programming - used in 90% of software projects',
        performance: 'O(1) access time makes arrays incredibly fast for data retrieval',
        realWorld: 'Powers everything from your phone\'s contact list to Netflix recommendations',
        interviews: 'Asked in 95% of coding interviews - absolute must-know',
        difficulty: 'Easy',
        salary: 'Entry level: $60k+, Senior: $150k+'
      },
      'binary-search': {
        career: 'Essential for backend development and database optimization',
        performance: 'Reduces search time from hours to milliseconds in large datasets',
        realWorld: 'Used by Google, Amazon, and every major search engine',
        interviews: 'Top 5 most common interview question - learn this first!',
        difficulty: 'Medium',
        salary: 'Backend roles: $80k+, Senior: $180k+'
      },
      'sorting-algorithms': {
        career: 'Core skill for data engineering and algorithm design roles',
        performance: 'Proper sorting can speed up applications by 1000x',
        realWorld: 'Powers social media feeds, search results, and recommendation systems',
        interviews: 'Expected knowledge for mid-level and senior positions',
        difficulty: 'Medium',
        salary: 'Algorithm roles: $90k+, Senior: $200k+'
      },
      'stack-operations': {
        career: 'Critical for system design and compiler development',
        performance: 'Enables efficient memory management and function calls',
        realWorld: 'Makes undo/redo possible in every app you use',
        interviews: 'Common in system design and recursion questions',
        difficulty: 'Easy',
        salary: 'System roles: $75k+, Senior: $160k+'
      },
      'hash-table': {
        career: 'Fundamental for database design and caching systems',
        performance: 'O(1) lookup time - fastest data retrieval possible',
        realWorld: 'Powers password systems, databases, and web caching',
        interviews: 'Asked in 80% of technical interviews',
        difficulty: 'Medium',
        salary: 'Database roles: $85k+, Senior: $190k+'
      },
      'dijkstra-algorithm': {
        career: 'Opens doors to AI, robotics, and network engineering',
        performance: 'Finds optimal solutions in complex network problems',
        realWorld: 'Powers GPS navigation, internet routing, and game AI',
        interviews: 'Advanced topic that impresses senior interviewers',
        difficulty: 'Hard',
        salary: 'AI/ML roles: $100k+, Senior: $250k+'
      }
    };

    return importance[topicId] || {
      career: 'Builds problem-solving skills valued across all tech roles',
      performance: 'Improves code efficiency and system performance',
      realWorld: 'Fundamental concept used in modern software development',
      interviews: 'Demonstrates strong computer science foundation',
      difficulty: 'Medium' as const,
      salary: 'Tech roles: $70k+, Senior: $150k+'
    };
  };

  const importance = getTopicImportance(topicId);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100 dark:bg-green-900';
      case 'Medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900';
      case 'Hard': return 'text-red-600 bg-red-100 dark:bg-red-900';
      default: return 'text-blue-600 bg-blue-100 dark:bg-blue-900';
    }
  };

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-600" />
          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
            Why This Matters
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-yellow-700 hover:text-yellow-800"
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(importance.difficulty)}`}>
            {importance.difficulty}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Difficulty</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-600">💰</div>
          <div className="text-xs text-muted-foreground">{importance.salary}</div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="h-4 w-4 text-blue-600" />
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200">Career Impact</h4>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{importance.career}</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <h4 className="font-semibold text-green-800 dark:text-green-200">Performance</h4>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{importance.performance}</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  <h4 className="font-semibold text-purple-800 dark:text-purple-200">Real World</h4>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{importance.realWorld}</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🎯</span>
                  <h4 className="font-semibold text-orange-800 dark:text-orange-200">Interviews</h4>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{importance.interviews}</p>
              </div>
            </div>

            {/* Success Stories */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">💡 Success Tip</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {topicId === 'array-basics' && "Master arrays first - they're the building blocks for all other data structures. Once you understand arrays, everything else becomes easier!"}
                {topicId === 'binary-search' && "Practice binary search until you can code it with your eyes closed. It's the foundation for many advanced algorithms and a favorite in interviews."}
                {topicId.includes('sort') && "Learn multiple sorting algorithms and understand when to use each one. This knowledge separates junior from senior developers."}
                {!['array-basics', 'binary-search'].includes(topicId) && !topicId.includes('sort') && "Focus on understanding the 'why' behind this concept. When you can explain it to someone else, you've truly mastered it."}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}