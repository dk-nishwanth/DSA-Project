import { useState } from 'react';
import { HelpCircle, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface GlossaryTooltipProps {
  term: string;
  children?: React.ReactNode;
}

const glossaryTerms: Record<string, { definition: string; example?: string; analogy?: string }> = {
  'time complexity': {
    definition: 'How the runtime of an algorithm grows as the input size increases',
    example: 'O(n) means if you double the input, the time roughly doubles',
    analogy: 'Like counting people in a line - more people = more time to count'
  },
  'space complexity': {
    definition: 'How much extra memory an algorithm needs as input size grows',
    example: 'O(1) means it uses the same amount of memory regardless of input size',
    analogy: 'Like desk space needed for homework - some tasks need more space'
  },
  'big o notation': {
    definition: 'A way to describe how fast an algorithm runs or how much space it uses',
    example: 'O(n²) is slower than O(n) for large inputs',
    analogy: 'Like describing how long it takes to find something in different sized rooms'
  },
  'array': {
    definition: 'A collection of items stored in contiguous memory locations',
    example: '[1, 2, 3, 4] - each number has an index position',
    analogy: 'Like a row of mailboxes, each with a number and contents'
  },
  'linked list': {
    definition: 'A sequence of nodes where each node contains data and points to the next node',
    example: 'Node1 → Node2 → Node3 → null',
    analogy: 'Like a treasure hunt where each clue points to the next location'
  },
  'stack': {
    definition: 'A Last-In-First-Out (LIFO) data structure',
    example: 'push(1), push(2), pop() returns 2',
    analogy: 'Like a stack of plates - you can only take from the top'
  },
  'queue': {
    definition: 'A First-In-First-Out (FIFO) data structure',
    example: 'enqueue(1), enqueue(2), dequeue() returns 1',
    analogy: 'Like a line at a coffee shop - first person in line is served first'
  },
  'recursion': {
    definition: 'A function that calls itself with a smaller version of the problem',
    example: 'factorial(n) = n × factorial(n-1)',
    analogy: 'Like Russian nesting dolls - each doll contains a smaller version'
  },
  'binary search': {
    definition: 'A search algorithm that repeatedly divides a sorted array in half',
    example: 'Looking for 7 in [1,3,5,7,9] - check middle, then right half',
    analogy: 'Like finding a word in a dictionary by opening to the middle first'
  },
  'sorting': {
    definition: 'Arranging elements in a specific order (usually ascending or descending)',
    example: '[3,1,4,2] becomes [1,2,3,4]',
    analogy: 'Like organizing books on a shelf by title or author'
  },
  'graph': {
    definition: 'A collection of nodes (vertices) connected by edges',
    example: 'Social networks, maps, family trees',
    analogy: 'Like a map of cities connected by roads'
  },
  'tree': {
    definition: 'A hierarchical data structure with a root and branches',
    example: 'Family tree, file system, decision tree',
    analogy: 'Like a real tree with trunk, branches, and leaves'
  },
  'hash table': {
    definition: 'A data structure that maps keys to values using a hash function',
    example: 'phone_book["John"] = "555-1234"',
    analogy: 'Like a filing cabinet where you know exactly which drawer to check'
  },
  'algorithm': {
    definition: 'A step-by-step procedure for solving a problem',
    example: 'Recipe for cooking, directions to a location',
    analogy: 'Like a recipe - specific steps to achieve a desired result'
  },
  'data structure': {
    definition: 'A way of organizing and storing data for efficient access and modification',
    example: 'Arrays, lists, trees, graphs',
    analogy: 'Like different ways to organize your closet - by color, type, season'
  },
  'pointer': {
    definition: 'A variable that stores the memory address of another variable',
    example: 'In linked lists, each node has a pointer to the next node',
    analogy: 'Like a forwarding address that tells you where to find something'
  },
  'node': {
    definition: 'A basic unit in data structures that contains data and references to other nodes',
    example: 'In a linked list: {data: 5, next: pointer to next node}',
    analogy: 'Like a train car that carries cargo and connects to other cars'
  }
};

export function GlossaryTooltip({ term, children }: GlossaryTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const termData = glossaryTerms[term.toLowerCase()];

  if (!termData) {
    return <span>{children || term}</span>;
  }

  return (
    <TooltipProvider>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild>
          <button
            className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-dotted underline-offset-2 transition-colors"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            onClick={() => setIsOpen(!isOpen)}
          >
            {children || term}
            <HelpCircle className="h-3 w-3" />
          </button>
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="max-w-sm p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-blue-800 dark:text-blue-200 capitalize">
                {term}
              </span>
            </div>
            
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Definition:</strong> {termData.definition}
            </div>
            
            {termData.analogy && (
              <div className="text-sm text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950 p-2 rounded">
                <strong>💡 Think of it like:</strong> {termData.analogy}
              </div>
            )}
            
            {termData.example && (
              <div className="text-sm text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950 p-2 rounded">
                <strong>📝 Example:</strong> {termData.example}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}