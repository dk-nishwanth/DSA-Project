import { useParams, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, BookOpen, Code2, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrayVisualizer } from '@/components/visualizer/array-visualizer';
import { SortingVisualizer } from '@/components/visualizer/sorting-visualizer';
import { LinkedListVisualizer } from '@/components/visualizer/linked-list-visualizer';
import { StackVisualizer } from '@/components/visualizer/stack-visualizer';
import { QueueVisualizer } from '@/components/visualizer/queue-visualizer';
import { BinaryTreeVisualizer } from '@/components/visualizer/binary-tree-visualizer';
import { HeapVisualizer } from '@/components/visualizer/heap-visualizer';
import { TrieVisualizer } from '@/components/visualizer/trie-visualizer';
import { UnionFindVisualizer } from '@/components/visualizer/union-find-visualizer';
import { GraphVisualizer } from '@/components/visualizer/graph-visualizer';
import { StringMatchingVisualizer } from '@/components/visualizer/string-matching-visualizer';
import { DoublyLinkedListVisualizer } from '@/components/visualizer/doubly-linked-list-visualizer';
import { GreedyVisualizer } from '@/components/visualizer/greedy-visualizer';
import { AdvancedVisualizer } from '@/components/visualizer/advanced-visualizer';
import { BacktrackingVisualizer } from '@/components/visualizer/backtracking-visualizer';
import { ArrayRotationVisualizer } from '@/components/visualizer/array-rotation-visualizer';
import { PalindromeVisualizer } from '@/components/visualizer/palindrome-visualizer';
import { SearchVisualizer } from '@/components/visualizer/search-visualizer';
import { HashTableVisualizer } from '@/components/visualizer/hash-table-visualizer';
import { RecursionVisualizer } from '@/components/visualizer/recursion-visualizer';
import { DPVisualizer } from '@/components/visualizer/dp-visualizer';
import { DFSBFSVisualizer } from '@/components/visualizer/dfs-bfs-visualizer';
import { SeparateChainingVisualizer } from '@/components/visualizer/separate-chaining-visualizer';
import { KnapsackVisualizer } from '@/components/visualizer/knapsack-visualizer';
import { LongestIncreasingSubsequenceVisualizer } from '@/components/visualizer/longest-increasing-subsequence-visualizer';
import { InsertionSortVisualizer } from '@/components/visualizer/insertion-sort-visualizer';
import { TwoPointersVisualizer } from '@/components/visualizer/two-pointers-visualizer';
import { SelectionSortVisualizer } from '@/components/visualizer/selection-sort-visualizer';
import { SlidingWindowVisualizer } from '@/components/visualizer/sliding-window-visualizer';
import { BitManipulationVisualizer } from '@/components/visualizer/bit-manipulation-visualizer';
import { MathematicalVisualizer } from '@/components/visualizer/mathematical-visualizer';
import { CountingSortVisualizer } from '@/components/visualizer/counting-sort-visualizer';
import { LearningProgress } from '@/components/learning-progress';
import { GlossaryTooltip } from '@/components/glossary-tooltip';
import { InteractiveQuiz } from '@/components/interactive-quiz';
import { EnhancedArrayVisualizer } from '@/components/visualizer/enhanced-array-visualizer';
import { EnhancedBubbleSort } from '@/components/visualizer/enhanced-bubble-sort';
import { EnhancedBinarySearch } from '@/components/visualizer/enhanced-binary-search';
import { TreeTraversalVisualizer } from '@/components/visualizer/tree-traversal-visualizer';

import { ComplexityBox } from '@/components/complexity-box';
import { PseudocodeBox } from '@/components/pseudocode-box';
import { ExplanationBox } from '@/components/explanation-box';
import { HintTooltip } from '@/components/hint-tooltip';
import { CodeSnippetBox } from '@/components/code-snippet-box';
import { dsaTopics } from '@/data/dsaTopics';
import { getCodeSnippet } from '@/data/codeSnippets';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { DefinitionBox } from '@/components/definition-box';
import { VoiceNarrator } from '@/components/voice-narrator';
import { VisualizerCodeRunner } from '@/components/visualizer/visualizer-code-runner';
import { VisualizationAutoNarrator } from '@/components/visualizer/visualization-auto-narrator';
import { TeachingCards } from '@/components/teaching-cards';
import { AdvancedCodePlayground } from '@/components/advanced-code-playground';
import { WebPlayground } from '@/components/web-playground';

export default function TopicDetail() {
  const [currentExplanationStep, setCurrentExplanationStep] = useState(0);
  const { topicId } = useParams<{ topicId: string }>();
  const topic = dsaTopics.find(t => t.id === topicId);

  if (!topic) {
    return <Navigate to="/" replace />;
  }

  // Sample pseudocode for array operations
  const arrayPseudocode = [
    "function insertElement(array, element):",
    "  array.push(element)",
    "  return array",
    "",
    "function deleteElement(array):",
    "  if array.length > 0:",
    "    array.pop()",
    "  return array",
    "",
    "function searchElement(array, target):",
    "  for i = 0 to array.length - 1:",
    "    if array[i] == target:",
    "      return i",
    "  return -1"
  ];

  const getExplanationSteps = (topicId: string) => {
    const explanations: Record<string, any[]> = {
      'array-basics': [
        {
          title: "Array Introduction",
          description: "Arrays store elements in contiguous memory locations. Each element can be accessed using an index.",
          highlight: "Arrays provide O(1) random access to elements using indices."
        },
        {
          title: "Insert Operation",
          description: "Adding an element to the end of an array is a constant time operation.",
          highlight: "Insertion at the end is O(1), but insertion at arbitrary positions is O(n)."
        },
        {
          title: "Delete Operation",
          description: "Removing the last element from an array is efficient. For other positions, elements need to be shifted.",
          highlight: "Deletion from the end is O(1), from arbitrary positions is O(n)."
        },
        {
          title: "Search Operation",
          description: "Linear search examines each element sequentially until the target is found.",
          highlight: "Linear search has O(n) time complexity in the worst case."
        }
      ],
      'linked-list-singly': [
        {
          title: "Linked List Structure",
          description: "A linked list consists of nodes where each node contains data and a reference to the next node.",
          highlight: "Dynamic size allocation - no need to declare size beforehand."
        },
        {
          title: "Insertion Operations",
          description: "Can insert at head (O(1)), tail (O(n)), or any position (O(n)).",
          highlight: "No shifting required unlike arrays - just update pointers."
        },
        {
          title: "Deletion Operations",
          description: "Delete by updating the previous node's next pointer to skip the target node.",
          highlight: "Memory is automatically freed when node is no longer referenced."
        },
        {
          title: "Traversal",
          description: "Must traverse sequentially from head to access any element.",
          highlight: "No random access - O(n) to reach any specific position."
        }
      ],
      'stack-operations': [
        {
          title: "LIFO Principle",
          description: "Stack follows Last In, First Out principle. The last element added is the first one to be removed.",
          highlight: "Think of a stack of plates - you can only take from the top."
        },
        {
          title: "Push Operation",
          description: "Adding an element to the top of the stack. Updates the top pointer.",
          highlight: "Always O(1) time complexity - no shifting required."
        },
        {
          title: "Pop Operation",
          description: "Removing and returning the top element from the stack.",
          highlight: "Also O(1) - just remove the top element and update pointer."
        },
        {
          title: "Applications",
          description: "Used in function calls, expression evaluation, undo operations, and backtracking.",
          highlight: "Essential for recursion and maintaining call stack."
        }
      ],
      'queue-operations': [
        {
          title: "FIFO Principle",
          description: "Queue follows First In, First Out principle. The first element added is the first one to be removed.",
          highlight: "Think of a queue at a store - first person in line is served first."
        },
        {
          title: "Enqueue Operation",
          description: "Adding an element to the rear/back of the queue.",
          highlight: "O(1) operation - just add to the end and update rear pointer."
        },
        {
          title: "Dequeue Operation",
          description: "Removing and returning the front element from the queue.",
          highlight: "O(1) operation - remove from front and update front pointer."
        },
        {
          title: "Applications",
          description: "Used in scheduling, breadth-first search, handling requests in web servers.",
          highlight: "Essential for managing tasks in order of arrival."
        }
      ],
      'binary-search-tree': [
        {
          title: "BST Property",
          description: "For any node, all left subtree values are smaller, all right subtree values are larger.",
          highlight: "This property enables efficient searching in O(log n) average time."
        },
        {
          title: "Insertion",
          description: "Compare with current node and go left or right, insert when reaching null position.",
          highlight: "Maintains BST property automatically during insertion."
        },
        {
          title: "Search Operation",
          description: "Compare target with current node, go left if smaller, right if larger.",
          highlight: "Much faster than linear search - eliminates half the tree each step."
        },
        {
          title: "Traversals",
          description: "Inorder gives sorted sequence, preorder for copying, postorder for deletion.",
          highlight: "Different traversals serve different purposes in tree operations."
        }
      ]
    };

    return explanations[topicId] || explanations['array-basics'];
  };

  const getTopicHint = (topicId: string) => {
    const hints: Record<string, string> = {
      'array-basics': 'Arrays store elements in contiguous memory. Think of them as a row of boxes, each with a number (index).',
      'bubble-sort': 'Bubble sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
      'merge-sort': 'Merge sort divides the array into halves, sorts them separately, then merges them back together.',
      'quick-sort': 'Quick sort picks a pivot element and partitions the array around it, then recursively sorts the partitions.',
      'binary-search': 'Binary search works only on sorted arrays by repeatedly dividing the search interval in half.',
      'linear-search': 'Linear search checks every element one by one until it finds the target value.',
    };
    return hints[topicId] || 'Learn this concept step by step with interactive visualizations.';
  };

  const getRealWorldApplications = (topicId: string) => {
    const applications: Record<string, Array<{ icon: string, title: string, description: string }>> = {
      'array-basics': [
        { icon: '📱', title: 'Contact Lists', description: 'Your phone stores contacts in an array-like structure for quick access by index.' },
        { icon: '🎵', title: 'Music Playlists', description: 'Songs in a playlist are stored in order, allowing you to jump to any track instantly.' },
        { icon: '📊', title: 'Spreadsheets', description: 'Excel cells are organized in a 2D array structure (rows and columns).' }
      ],
      'bubble-sort': [
        { icon: '🏫', title: 'School Line-ups', description: 'Teachers often use bubble sort logic to arrange students by height.' },
        { icon: '📚', title: 'Small Lists', description: 'Good for sorting small lists where simplicity matters more than speed.' },
        { icon: '🎓', title: 'Educational Tool', description: 'Perfect for teaching sorting concepts due to its visual nature.' }
      ],
      'binary-search': [
        { icon: '📖', title: 'Dictionary Lookup', description: 'Finding words in a dictionary by opening to the middle and narrowing down.' },
        { icon: '🔍', title: 'Database Searches', description: 'Databases use binary search on indexed columns for fast data retrieval.' },
        { icon: '📱', title: 'Phone Contacts', description: 'Finding a contact in your sorted phone book.' }
      ],
      'stack-operations': [
        { icon: '↩️', title: 'Undo Operations', description: 'Text editors use stacks to remember previous states for undo functionality.' },
        { icon: '🌐', title: 'Browser History', description: 'Back button functionality uses a stack to track visited pages.' },
        { icon: '🔧', title: 'Function Calls', description: 'Programming languages use call stacks to manage function execution.' }
      ],
      'queue-operations': [
        { icon: '🖨️', title: 'Print Queue', description: 'Printers process documents in the order they were submitted.' },
        { icon: '🚗', title: 'Traffic Systems', description: 'Traffic lights and toll booths process cars in first-come, first-served order.' },
        { icon: '🎫', title: 'Customer Service', description: 'Call centers use queues to handle customers in order of arrival.' }
      ],
      'linked-list-singly': [
        { icon: '🚂', title: 'Train Cars', description: 'Each train car is connected to the next, similar to linked list nodes.' },
        { icon: '🎵', title: 'Music Players', description: 'Playlists where each song points to the next one in the sequence.' },
        { icon: '📝', title: 'To-Do Lists', description: 'Dynamic lists where you can easily add or remove items anywhere.' }
      ],
      'hash-table': [
        { icon: '📞', title: 'Phone Books', description: 'Quick lookup of phone numbers by name using hash-based indexing.' },
        { icon: '🗄️', title: 'Database Indexing', description: 'Databases use hash tables for fast record retrieval.' },
        { icon: '🔐', title: 'Password Storage', description: 'Systems store hashed passwords for security and quick verification.' }
      ],
      'dijkstra-algorithm': [
        { icon: '🗺️', title: 'GPS Navigation', description: 'Finding the shortest route between two locations on a map.' },
        { icon: '🌐', title: 'Network Routing', description: 'Internet routers find the fastest path for data packets.' },
        { icon: '✈️', title: 'Flight Planning', description: 'Airlines optimize flight paths to minimize fuel consumption and time.' }
      ],
      'binary-search-tree': [
        { icon: '📁', title: 'File Systems', description: 'Operating systems organize files and folders in tree structures.' },
        { icon: '🏢', title: 'Organization Charts', description: 'Company hierarchies are represented as tree structures.' },
        { icon: '🧬', title: 'Decision Trees', description: 'AI systems use decision trees for classification and prediction.' }
      ]
    };

    return applications[topicId] || [
      { icon: '💻', title: 'Software Development', description: 'This concept is fundamental in building efficient software systems.' },
      { icon: '🔬', title: 'Computer Science', description: 'Essential knowledge for understanding how computers process information.' },
      { icon: '🎯', title: 'Problem Solving', description: 'Develops logical thinking and systematic problem-solving skills.' }
    ];
  };

  const getExample = (topicId: string) => {
    const examples: Record<string, string> = {
      'array-basics': 'Given array A = [2, 5, 7]\nAccess A[1] -> 5\nInsert 9 -> [2, 5, 7, 9]\nDelete last -> [2, 5, 7] \nSearch 7 -> index 2',
      'binary-search': 'Input: nums = [2, 5, 7, 9, 12], target = 9\nMid checks: 7 -> move right -> 9 -> found at index 3',
      'bubble-sort': 'Input: [5, 1, 4, 2]\nPass 1: [1, 4, 2, 5]\nPass 2: [1, 2, 4, 5] (sorted)'
    };
    return examples[topicId] || '';
  };

  const getSyntax = (topicId: string) => {
    const syntaxMap: Record<string, string> = {
      'array-basics': `// JavaScript
const arr = [];
arr.push(5); // insert
const x = arr[index]; // access
arr.pop(); // delete
arr.findIndex(v => v === 7); // search`,
      'binary-search': `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1; else right = mid - 1;
  }
  return -1;
}`,
      'bubble-sort': `function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`
    };
    return syntaxMap[topicId] || '';
  };

  const getVisualizationNarration = (topicId: string) => {
    const map: Record<string, string> = {
      'array-basics': 'In this visualization, watch how elements are accessed by index, inserted at the end, removed from the end, and searched linearly.',
      'binary-search': 'The visualization shows two pointers narrowing the search space by comparing the middle element to the target.',
      'bubble-sort': 'Observe adjacent pairs being compared and swapped, with largest elements bubbling to the end each pass.'
    };
    return map[topicId] || 'Follow the animation to see how the data structure changes step by step.';
  };

  const getTeachingCardItems = (topicId: string, category: string) => {
    const cardsByTopic: Record<string, Array<{icon: string, title: string, text: string}>> = {
      'array-basics': [
        { icon: 'fast', title: 'Fast Access', text: 'Arrays provide O(1) access to any element using its index.' },
        { icon: 'insert', title: 'Easy Insertion', text: 'Adding to the end is O(1); inserting in the middle shifts elements.' },
        { icon: 'search', title: 'Linear Search', text: 'Searching can be O(n) unless data is sorted (then use binary search).' }
      ],
      'binary-search': [
        { icon: 'fast', title: 'Logarithmic Time', text: 'Binary search reduces search space by half each step - O(log n).' },
        { icon: 'insert', title: 'Sorted Requirement', text: 'Only works on sorted arrays - this is the key prerequisite.' },
        { icon: 'search', title: 'Divide & Conquer', text: 'Compare with middle, then search left or right half.' }
      ],
      'bubble-sort': [
        { icon: 'fast', title: 'Simple Logic', text: 'Compare adjacent elements and swap if out of order.' },
        { icon: 'insert', title: 'Bubbling Effect', text: 'Largest elements "bubble" to the end after each pass.' },
        { icon: 'search', title: 'Educational Value', text: 'Great for learning sorting concepts, but inefficient for large data.' }
      ],
      'linked-list-singly': [
        { icon: 'fast', title: 'Dynamic Size', text: 'Grows and shrinks during runtime - no fixed size limit.' },
        { icon: 'insert', title: 'Efficient Insertion', text: 'Insert/delete at any position by updating pointers - O(1).' },
        { icon: 'search', title: 'Sequential Access', text: 'Must traverse from head to reach any element - O(n).' }
      ],
      'stack-operations': [
        { icon: 'fast', title: 'LIFO Principle', text: 'Last In, First Out - like a stack of plates.' },
        { icon: 'insert', title: 'Push & Pop', text: 'Add and remove elements only from the top - O(1).' },
        { icon: 'search', title: 'Function Calls', text: 'Used for recursion, undo operations, and expression evaluation.' }
      ],
      'queue-operations': [
        { icon: 'fast', title: 'FIFO Principle', text: 'First In, First Out - like a line at a store.' },
        { icon: 'insert', title: 'Enqueue & Dequeue', text: 'Add to rear, remove from front - both O(1).' },
        { icon: 'search', title: 'Scheduling', text: 'Used for task scheduling, BFS, and handling requests.' }
      ],
      'binary-search-tree': [
        { icon: 'fast', title: 'Ordered Structure', text: 'Left < Node < Right property enables efficient operations.' },
        { icon: 'insert', title: 'Balanced Performance', text: 'Search, insert, delete all O(log n) on average.' },
        { icon: 'search', title: 'Inorder Traversal', text: 'Visit nodes in sorted order - useful for range queries.' }
      ]
    };

    // Fallback for categories not specifically defined
    const categoryDefaults: Record<string, Array<{icon: string, title: string, text: string}>> = {
      'Sorting': [
        { icon: 'fast', title: 'Ordering Data', text: 'Arrange elements in ascending or descending order.' },
        { icon: 'insert', title: 'Time Complexity', text: 'Different algorithms have different performance characteristics.' },
        { icon: 'search', title: 'Stability', text: 'Some algorithms preserve relative order of equal elements.' }
      ],
      'Searching': [
        { icon: 'fast', title: 'Finding Elements', text: 'Locate specific values efficiently in data structures.' },
        { icon: 'insert', title: 'Prerequisites', text: 'Some algorithms require sorted data for optimal performance.' },
        { icon: 'search', title: 'Trade-offs', text: 'Balance between search time and preprocessing requirements.' }
      ],
      'Trees': [
        { icon: 'fast', title: 'Hierarchical Data', text: 'Organize data in parent-child relationships.' },
        { icon: 'insert', title: 'Tree Operations', text: 'Insert, delete, and traverse nodes efficiently.' },
        { icon: 'search', title: 'Applications', text: 'File systems, databases, and decision-making structures.' }
      ],
      'Graphs': [
        { icon: 'fast', title: 'Connected Data', text: 'Model relationships between entities using vertices and edges.' },
        { icon: 'insert', title: 'Graph Algorithms', text: 'Traverse, search, and find optimal paths through networks.' },
        { icon: 'search', title: 'Real Applications', text: 'Social networks, maps, and network routing protocols.' }
      ]
    };

    return cardsByTopic[topicId] || categoryDefaults[category] || [];
  };

  const getCommonMistakes = (topicId: string, category: string) => {
    const mistakesByTopic: Record<string, string[]> = {
      'array-basics': [
        'Indexing starts at 0, not 1.',
        'array[length] is out of bounds.',
        'Fixed-size arrays cannot grow arbitrarily.'
      ],
      'binary-search': [
        'Forgetting the array must be sorted first.',
        'Off-by-one errors with left/right boundaries.',
        'Integer overflow when calculating mid = (left + right) / 2.'
      ],
      'bubble-sort': [
        'Not optimizing for already sorted arrays.',
        'Forgetting to reduce comparison range after each pass.',
        'Using bubble sort for large datasets (very inefficient).'
      ],
      'linked-list-singly': [
        'Losing reference to nodes when inserting/deleting.',
        'Not handling edge cases (empty list, single node).',
        'Memory leaks from not properly deallocating nodes.'
      ],
      'stack-operations': [
        'Trying to pop from an empty stack.',
        'Not checking stack overflow in fixed-size implementations.',
        'Confusing stack with queue operations.'
      ],
      'queue-operations': [
        'Trying to dequeue from an empty queue.',
        'Not handling circular queue wraparound correctly.',
        'Confusing front and rear pointers.'
      ],
      'binary-search-tree': [
        'Not maintaining BST property during insertions.',
        'Forgetting to handle duplicate values consistently.',
        'Not considering tree balance (can degrade to O(n)).'
      ]
    };

    const categoryDefaults: Record<string, string[]> = {
      'Sorting': [
        'Not considering stability requirements.',
        'Choosing wrong algorithm for data size.',
        'Ignoring worst-case time complexity.'
      ],
      'Searching': [
        'Not checking if data is sorted when required.',
        'Off-by-one errors in boundary conditions.',
        'Not handling edge cases (empty data, not found).'
      ],
      'Trees': [
        'Not handling null/empty tree cases.',
        'Confusing different traversal orders.',
        'Memory leaks from improper node deletion.'
      ],
      'Graphs': [
        'Not handling disconnected components.',
        'Infinite loops in cyclic graphs.',
        'Not considering directed vs undirected edges.'
      ]
    };

    return mistakesByTopic[topicId] || categoryDefaults[category] || [];
  };

  // High-quality per-topic teaching content for the definition box
  const getTopicContent = (topicId: string) => {
    const byId: Record<string, {
      definition?: string;
      extras?: string[];
      example?: string;
      syntax?: string;
      narration?: string;
    }> = {
      'array-basics': {
        definition: 'An array stores a fixed-length sequence of elements in contiguous memory. Each element has an index, allowing constant-time random access.',
        extras: [
          'What it does: keeps items in order and lets you jump directly to any position by index.',
          'How it works: indexes map to memory offsets; appending at the end is fast, inserting in the middle shifts later elements.',
          'When to use: fast reads by position, compact storage, building blocks for higher-level structures.'
        ],
        example: 'A = [3, 8, 12]\nA[1] -> 8 (O(1))\nA.push(5) -> [3, 8, 12, 5]\nA.pop() -> [3, 8, 12]\nA.indexOf(12) -> 2 (O(n) if unsorted)',
        syntax: `const A = [3,8,12];\nA[1]; // access\nA.push(5); // append\nA.pop(); // remove last\nA.indexOf(12); // linear search`,
        narration: 'Arrays store items in a row of boxes. You can jump straight to a box by its number. Appending to the end is quick; inserting in the middle requires shifting boxes.'
      },
      'array-rotation': {
        definition: 'Array rotation shifts all elements by a specified number of positions, either left (counterclockwise) or right (clockwise).',
        extras: [
          'What it does: moves elements in a circular fashion while preserving their relative order.',
          'How it works: elements that would "fall off" one end are placed at the other end.',
          'When to use: scheduling algorithms, circular buffers, and certain pattern matching problems.'
        ],
        example: 'A = [1, 2, 3, 4, 5]\nLeft rotate by 2: [3, 4, 5, 1, 2]\nRight rotate by 1: [5, 1, 2, 3, 4]',
        syntax: `// Left rotation by k positions\nfunction rotateLeft(arr, k) {\n  k %= arr.length;\n  return [...arr.slice(k), ...arr.slice(0, k)];\n}`,
        narration: 'Array rotation is like a carousel. Elements that move past one end reappear at the other end, maintaining their order.'
      },
      'binary-search': {
        definition: 'Binary search finds a target in a sorted array by repeatedly halving the search interval.',
        extras: [
          'What it does: dramatically reduces the number of checks from n to about log2(n).',
          'How it works: compare target with the middle element, then discard the half that cannot contain the target.',
          'When to use: data is sorted or you can probe a monotonic condition.'
        ],
        example: 'arr = [2, 5, 7, 9, 12], target = 9\nmid=7 -> target is larger -> search right\nmid=9 -> found at index 3',
        syntax: `function binarySearch(a, t){\n  let l=0, r=a.length-1;\n  while(l<=r){\n    const m=(l+r>>1);\n    if(a[m]===t) return m;\n    if(a[m]<t) l=m+1; else r=m-1;\n  }\n  return -1;\n}`,
        narration: 'Because the array is sorted, we can jump to the middle and discard half each time. That is why binary search is fast.'
      },
      'linear-search': {
        definition: 'Linear search examines each element sequentially until the target is found or the entire collection is traversed.',
        extras: [
          'What it does: checks every element one by one until finding a match.',
          'How it works: compares each element with the target value in sequence.',
          'When to use: small datasets, unsorted collections, or when simplicity is preferred over efficiency.'
        ],
        example: 'A = [20, 15, 7, 9, 12], target = 7\nCheck 20 (no) -> 15 (no) -> 7 (yes!) -> found at index 2',
        syntax: `function linearSearch(arr, target) {\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] === target) return i;\n  }\n  return -1;\n}`,
        narration: 'Linear search is like checking each box in a row until you find what you need. Simple but potentially time-consuming for large collections.'
      },
      'interpolation-search': {
        definition: 'Interpolation search improves on binary search by estimating the likely position of a target value based on its value relative to the range being searched.',
        extras: [
          'What it does: makes educated guesses about where the target might be located.',
          'How it works: uses the formula pos = low + ((target - arr[low]) * (high - low) / (arr[high] - arr[low])).',
          'When to use: uniformly distributed sorted data where values correlate with positions.'
        ],
        example: 'A = [10, 20, 30, 40, 50], target = 30\nEstimate position: 2 -> check A[2]=30 -> found!',
        syntax: `function interpolationSearch(arr, target) {\n  let low = 0, high = arr.length - 1;\n  while (low <= high && target >= arr[low] && target <= arr[high]) {\n    let pos = low + Math.floor(((target - arr[low]) * (high - low)) / (arr[high] - arr[low]));\n    if (arr[pos] === target) return pos;\n    if (arr[pos] < target) low = pos + 1;\n    else high = pos - 1;\n  }\n  return -1;\n}`,
        narration: 'Interpolation search is like finding a name in a phone book. You don\'t start in the middle; you make an educated guess based on the first letter.'
      },
      'bubble-sort': {
        definition: 'Bubble sort repeatedly compares adjacent elements and swaps them if out of order, pushing larger elements to the end each pass.',
        extras: [
          'What it does: sorts by repeated local swaps.',
          'How it works: after pass i, the i largest elements are in their final positions.',
          'When to use: educational purposes or very small inputs.'
        ],
        example: 'Input [5,1,4,2]\nPass 1: swap (5,1) -> [1,5,4,2], swap (5,4) -> [1,4,5,2], swap (5,2) -> [1,4,2,5]\nPass 2: [1,2,4,5] sorted',
        syntax: `function bubbleSort(a){\n  for(let i=0;i<a.length-1;i++){\n    for(let j=0;j<a.length-1-i;j++){\n      if(a[j]>a[j+1]) [a[j],a[j+1]]=[a[j+1],a[j]];\n    }\n  }\n  return a;\n}`,
        narration: 'We look at neighbors and swap if needed. Big elements bubble to the right; after each pass, one more element is fixed at the end.'
      },
      'merge-sort': {
        definition: 'Merge sort is a divide-and-conquer algorithm that splits the array in half, recursively sorts each half, then merges the sorted halves.',
        extras: [
          'What it does: guarantees O(n log n) time complexity regardless of input distribution.',
          'How it works: recursively divides until single elements, then merges in sorted order.',
          'When to use: stable sorting is required, predictable performance is needed, or working with linked lists.'
        ],
        example: 'Input [38, 27, 43, 3]\nSplit: [38, 27] [43, 3]\nSplit: [38] [27] [43] [3]\nMerge: [27, 38] [3, 43]\nMerge: [3, 27, 38, 43]',
        syntax: `function mergeSort(arr) {\n  if (arr.length <= 1) return arr;\n  const mid = Math.floor(arr.length / 2);\n  const left = mergeSort(arr.slice(0, mid));\n  const right = mergeSort(arr.slice(mid));\n  return merge(left, right);\n}\n\nfunction merge(left, right) {\n  let result = [], i = 0, j = 0;\n  while (i < left.length && j < right.length) {\n    result.push(left[i] <= right[j] ? left[i++] : right[j++]);\n  }\n  return result.concat(left.slice(i)).concat(right.slice(j));\n}`,
        narration: 'Merge sort breaks the problem into smaller pieces, sorts them individually, and then combines them in order. It\'s like sorting small piles of cards and then merging them.'
      },
      'quick-sort': {
        definition: 'Quick sort is a divide-and-conquer algorithm that selects a pivot element and partitions the array around it, recursively sorting the sub-arrays.',
        extras: [
          'What it does: typically achieves O(n log n) average-case performance with low overhead.',
          'How it works: chooses a pivot, places smaller elements before it and larger elements after it, then recursively sorts the partitions.',
          'When to use: general-purpose sorting, in-place sorting with limited extra memory.'
        ],
        example: 'Input [10, 80, 30, 90, 40]\nPivot=40: [10, 30] [40] [80, 90]\nRecursively sort: [10, 30, 40, 80, 90]',
        syntax: `function quickSort(arr, low = 0, high = arr.length - 1) {\n  if (low < high) {\n    const pivotIndex = partition(arr, low, high);\n    quickSort(arr, low, pivotIndex - 1);\n    quickSort(arr, pivotIndex + 1, high);\n  }\n  return arr;\n}\n\nfunction partition(arr, low, high) {\n  const pivot = arr[high];\n  let i = low - 1;\n  for (let j = low; j < high; j++) {\n    if (arr[j] <= pivot) {\n      i++;\n      [arr[i], arr[j]] = [arr[j], arr[i]];\n    }\n  }\n  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];\n  return i + 1;\n}`,
        narration: 'Quick sort picks a pivot element and arranges everything around it. Smaller values go left, larger values go right, and we repeat the process for each section.'
      },
      'linked-list-singly': {
        definition: 'A singly linked list is a chain of nodes where each node points to the next. It supports efficient insertion and deletion with pointer updates.',
        extras: [
          'What it does: stores elements without requiring contiguous memory and grows dynamically.',
          'How it works: each node has a value and a next pointer; to insert, rewire pointers; to delete, bypass a node.',
          'Trade-off: accessing the k-th element requires walking from the head.'
        ],
        example: 'Head -> 10 -> 20 -> 30\nInsert head 5 -> 5 -> 10 -> 20 -> 30\nDelete 20 -> 5 -> 10 -> 30',
        syntax: `class Node{constructor(v,n=null){this.v=v;this.n=n;}}\nlet head=null;\nhead=new Node(5,head); // insert at head`,
        narration: 'Instead of shifting elements, we change pointers. That makes inserts and deletes simple, but random access is slow.'
      },
      'linked-list-doubly': {
        definition: 'A doubly linked list contains nodes with pointers to both the next and previous nodes, enabling bidirectional traversal.',
        extras: [
          'What it does: allows traversal in both directions and efficient deletion when given a reference to the node.',
          'How it works: each node has value, next, and prev pointers; operations update both forward and backward links.',
          'When to use: when bidirectional traversal is needed or for implementing more complex data structures like LRU caches.'
        ],
        example: 'NULL <- 10 <-> 20 <-> 30 -> NULL\nDelete 20: NULL <- 10 <-> 30 -> NULL',
        syntax: `class Node {\n  constructor(val) {\n    this.val = val;\n    this.next = null;\n    this.prev = null;\n  }\n}\n\nclass DoublyLinkedList {\n  constructor() {\n    this.head = null;\n    this.tail = null;\n  }\n}`,
        narration: 'Doubly linked lists let you move forward and backward. Each node knows both its next and previous neighbors, making it more flexible than singly linked lists.'
      },
      'stack-operations': {
        definition: 'A stack is a Last-In, First-Out (LIFO) structure that supports push and pop at the top in constant time.',
        extras: [
          'What it does: remembers the most recent items first—like undo history.',
          'How it works: push places an item on top; pop removes the top; peek reads it.',
          'Used for: function calls, backtracking, expression evaluation.'
        ],
        example: 'Push 10, push 20, push 30 -> top=30\nPop -> returns 30, top=20',
        syntax: `class Stack{constructor(){this.a=[];} push(x){this.a.push(x);} pop(){return this.a.pop();}}`,
        narration: 'Think of a stack of plates: last on, first off. Only the top is accessible.'
      },
      'queue-operations': {
        definition: 'A queue is a First-In, First-Out (FIFO) structure that enqueues at the rear and dequeues at the front in constant time.',
        extras: [
          'What it does: processes items in arrival order.',
          'How it works: enqueue appends to the tail; dequeue removes from the head.',
          'Used for: scheduling, BFS, buffering.'
        ],
        example: 'Enqueue 10,20,30 -> front=10, rear=30\nDequeue -> returns 10 -> front=20',
        syntax: `class Queue{constructor(){this.a=[];} enqueue(x){this.a.push(x);} dequeue(){return this.a.shift();}}`,
        narration: 'Like a line at a store: first in line is served first.'
      },
      'binary-tree': {
        definition: 'A binary tree is a hierarchical data structure where each node has at most two children, referred to as left and right child.',
        extras: [
          'What it does: organizes data in a hierarchical structure with parent-child relationships.',
          'How it works: each node contains a value and references to left and right subtrees.',
          'When to use: representing hierarchical relationships, expression trees, or as a foundation for more specialized trees.'
        ],
        example: 'Root=10, Left=5, Right=15\nLeft subtree: 5 -> (2, 7)\nRight subtree: 15 -> (12, 20)',
        syntax: `class TreeNode {\n  constructor(val) {\n    this.val = val;\n    this.left = null;\n    this.right = null;\n  }\n}`,
        narration: 'Binary trees branch out with at most two children per node. They form the foundation for many tree-based data structures and algorithms.'
      },
      'binary-search-tree': {
        definition: 'A binary search tree (BST) keeps keys in order: left subtree < node < right subtree, enabling efficient search, insert, and delete on average.',
        extras: [
          'What it does: organizes data for ordered operations and range queries.',
          'How it works: comparisons guide you left or right; inorder traversal yields sorted order.',
          'Caveat: performance degrades if the tree becomes unbalanced.'
        ],
        example: 'Insert 8,3,10,1,6,14\nInorder -> [1,3,6,8,10,14]\nSearch 6 -> left of 8, right of 3 -> found',
        syntax: `class Node{constructor(v){this.v=v;this.l=this.r=null;}}\nfunction insert(t,v){if(!t)return new Node(v); if(v<t.v)t.l=insert(t.l,v); else t.r=insert(t.r,v); return t;}`,
        narration: 'BSTs steer you by comparisons. Visit inorder to see values in ascending order.'
      },
      'tree-inorder-traversal': {
        definition: 'Inorder traversal visits nodes in a binary tree by recursively processing the left subtree, then the current node, and finally the right subtree.',
        extras: [
          'What it does: produces nodes in ascending order when applied to a binary search tree.',
          'How it works: recursively visits left child, then current node, then right child.',
          'When to use: retrieving sorted elements from a BST, evaluating expressions in infix notation.'
        ],
        example: 'Tree:     4\n         /   \\\n        2     6\n       / \\   / \\\n      1   3 5   7\nInorder: [1, 2, 3, 4, 5, 6, 7]',
        syntax: `function inorderTraversal(root) {\n  const result = [];\n  function traverse(node) {\n    if (node) {\n      traverse(node.left);\n      result.push(node.val);\n      traverse(node.right);\n    }\n  }\n  traverse(root);\n  return result;\n}`,
        narration: 'Inorder traversal follows left-node-right pattern. In a binary search tree, this gives you elements in sorted order.'
      },
      'tree-preorder-traversal': {
        definition: 'Preorder traversal visits the current node first, then recursively processes the left and right subtrees.',
        extras: [
          'What it does: visits root before children, useful for creating a copy of the tree or prefix expression evaluation.',
          'How it works: recursively visits current node, then left child, then right child.',
          'When to use: creating a copy of a tree, evaluating prefix expressions, exploring directory structures.'
        ],
        example: 'Tree:     4\n         /   \\\n        2     6\n       / \\   / \\\n      1   3 5   7\nPreorder: [4, 2, 1, 3, 6, 5, 7]',
        syntax: `function preorderTraversal(root) {\n  const result = [];\n  function traverse(node) {\n    if (node) {\n      result.push(node.val);\n      traverse(node.left);\n      traverse(node.right);\n    }\n  }\n  traverse(root);\n  return result;\n}`,
        narration: 'Preorder traversal follows node-left-right pattern. It visits the current node before its children, making it useful for creating copies of trees.'
      },
      'tree-postorder-traversal': {
        definition: 'Postorder traversal recursively processes the left and right subtrees before visiting the current node.',
        extras: [
          'What it does: visits children before root, useful for deletion operations or evaluating postfix expressions.',
          'How it works: recursively visits left child, then right child, then current node.',
          'When to use: tree deletion, evaluating postfix expressions, calculating directory sizes.'
        ],
        example: 'Tree:     4\n         /   \\\n        2     6\n       / \\   / \\\n      1   3 5   7\nPostorder: [1, 3, 2, 5, 7, 6, 4]',
        syntax: `function postorderTraversal(root) {\n  const result = [];\n  function traverse(node) {\n    if (node) {\n      traverse(node.left);\n      traverse(node.right);\n      result.push(node.val);\n    }\n  }\n  traverse(root);\n  return result;\n}`,
        narration: 'Postorder traversal follows left-right-node pattern. It processes all children before their parent, making it useful for cleanup operations.'
      },
      'hash-table': {
        definition: 'A hash table is a data structure that maps keys to values using a hash function, providing average O(1) time complexity for lookups, insertions, and deletions.',
        extras: [
          'What it does: provides fast key-value access without requiring sequential search.',
          'How it works: converts keys to array indices using a hash function; handles collisions with techniques like chaining or open addressing.',
          'When to use: dictionaries, caches, sets, and database indexing.'
        ],
        example: 'Insert: ("name", "Alice"), ("age", 30)\nLookup: hash("name") -> index -> "Alice"',
        syntax: `// Simple JavaScript Map (hash table)\nconst map = new Map();\nmap.set("name", "Alice");\nmap.get("name"); // "Alice"\nmap.has("age"); // false\nmap.delete("name");`,
        narration: 'Hash tables are like magic dictionaries. They use a special formula to instantly find where values are stored, without checking every entry.'
      },
      'hash-chaining': {
        definition: 'Separate chaining is a collision resolution technique where each hash table bucket contains a linked list of all key-value pairs that hash to the same index.',
        extras: [
          'What it does: handles hash collisions by storing multiple entries at the same index.',
          'How it works: maintains a linked list at each array position to store all elements with the same hash.',
          'When to use: when collisions are expected and memory overhead for linked lists is acceptable.'
        ],
        example: 'hash("John") = hash("Jane") = 3\nBucket[3] -> ["John":25] -> ["Jane":30]',
        syntax: `class HashTableWithChaining {\n  constructor(size = 10) {\n    this.buckets = Array(size).fill().map(() => []);\n  }\n  hash(key) {\n    return key.toString().length % this.buckets.length;\n  }\n  set(key, value) {\n    const index = this.hash(key);\n    const bucket = this.buckets[index];\n    const entry = bucket.find(entry => entry.key === key);\n    if (entry) entry.value = value;\n    else bucket.push({key, value});\n  }\n}`,
        narration: 'When two items want the same spot in our hash table, separate chaining lets them form a line. We just check each item in the line until we find what we need.'
      },
      'open-addressing': {
        definition: 'Open addressing is a collision resolution technique where all elements are stored in the hash table itself, and collisions are resolved by finding alternative slots.',
        extras: [
          'What it does: handles collisions by probing for empty slots in the table.',
          'How it works: uses probing sequences (linear, quadratic, double hashing) to find alternative positions.',
          'When to use: when memory efficiency is important and load factor will remain relatively low.'
        ],
        example: 'hash("John") = hash("Jane") = 3\nPlace "John" at index 3\nPlace "Jane" at next available slot (index 4)',
        syntax: `class HashTableWithOpenAddressing {\n  constructor(size = 10) {\n    this.keys = Array(size).fill(null);\n    this.values = Array(size).fill(null);\n  }\n  hash(key) {\n    return key.toString().length % this.keys.length;\n  }\n  set(key, value) {\n    let index = this.hash(key);\n    while (this.keys[index] !== null && this.keys[index] !== key) {\n      index = (index + 1) % this.keys.length; // Linear probing\n    }\n    this.keys[index] = key;\n    this.values[index] = value;\n  }\n}`,
        narration: 'With open addressing, if a spot is taken, we try the next spot, and the next, until we find an empty space. It\'s like finding a parking spot in a crowded lot.'
      },
      'graph-dfs': {
        definition: 'Depth-First Search (DFS) is a graph traversal algorithm that explores as far as possible along each branch before backtracking.',
        extras: [
          'What it does: systematically explores a graph by going as deep as possible before backtracking.',
          'How it works: uses a stack (often implemented recursively) to track vertices to visit.',
          'When to use: path finding, topological sorting, cycle detection, and connected component analysis.'
        ],
        example: 'Graph: 1 -- 2 -- 4\n       |    |\n       3 -- 5\nDFS from 1: 1, 2, 4, 5, 3',
        syntax: `function dfs(graph, start) {\n  const visited = new Set();\n  function explore(vertex) {\n    visited.add(vertex);\n    console.log(vertex);\n    for (const neighbor of graph[vertex]) {\n      if (!visited.has(neighbor)) {\n        explore(neighbor);\n      }\n    }\n  }\n  explore(start);\n}`,
        narration: 'DFS explores a graph like a maze runner who always goes as far as possible down one path before turning back. It uses recursion or a stack to remember where to backtrack.'
      },
      'graph-bfs': {
        definition: 'Breadth-First Search (BFS) is a graph traversal algorithm that explores all vertices at the present depth before moving to vertices at the next depth level.',
        extras: [
          'What it does: systematically explores a graph level by level, visiting all neighbors before moving to the next level.',
          'How it works: uses a queue to track vertices to visit in order of their distance from the source.',
          'When to use: finding shortest paths in unweighted graphs, connected components, and testing bipartiteness.'
        ],
        example: 'Graph: 1 -- 2 -- 4\n       |    |\n       3 -- 5\nBFS from 1: 1, 2, 3, 4, 5',
        syntax: `function bfs(graph, start) {\n  const visited = new Set([start]);\n  const queue = [start];\n  while (queue.length > 0) {\n    const vertex = queue.shift();\n    console.log(vertex);\n    for (const neighbor of graph[vertex]) {\n      if (!visited.has(neighbor)) {\n        visited.add(neighbor);\n        queue.push(neighbor);\n      }\n    }\n  }\n}`,
        narration: 'BFS explores a graph like ripples in a pond, expanding outward in all directions one level at a time. It guarantees finding the shortest path in unweighted graphs.'
      },
      'dijkstra-algorithm': {
        definition: 'Dijkstra\'s algorithm finds the shortest paths from a source vertex to all other vertices in a weighted graph with non-negative edge weights.',
        extras: [
          'What it does: computes minimum distance from source to all other nodes, accounting for edge weights.',
          'How it works: greedily selects the unvisited vertex with the smallest tentative distance and relaxes its outgoing edges.',
          'When to use: finding optimal routes, network routing protocols, and minimizing costs in weighted graphs.'
        ],
        example: 'Graph with weighted edges:\n  1 --(2)-- 2 --(3)-- 4\n  | \\      |\n (1) (4)  (1)\n  |    \\    |\n  3 --(2)-- 5\nShortest path from 1 to 4: 1 -> 2 -> 4 (cost: 5)',
        syntax: `function dijkstra(graph, start) {\n  const distances = {};\n  const previous = {};\n  const nodes = new Set();\n  \n  // Initialize\n  for (const vertex in graph) {\n    distances[vertex] = Infinity;\n    previous[vertex] = null;\n    nodes.add(vertex);\n  }\n  distances[start] = 0;\n  \n  while (nodes.size > 0) {\n    // Find vertex with minimum distance\n    let minVertex = null;\n    for (const vertex of nodes) {\n      if (minVertex === null || distances[vertex] < distances[minVertex]) {\n        minVertex = vertex;\n      }\n    }\n    \n    nodes.delete(minVertex);\n    \n    // Update distances to neighbors\n    for (const neighbor in graph[minVertex]) {\n      const alt = distances[minVertex] + graph[minVertex][neighbor];\n      if (alt < distances[neighbor]) {\n        distances[neighbor] = alt;\n        previous[neighbor] = minVertex;\n      }\n    }\n  }\n  \n  return { distances, previous };\n}`,
        narration: 'Dijkstra\'s algorithm is like a smart GPS that always finds the shortest route. It explores paths in order of their current known distance, ensuring optimal results.'
      },
      'recursion-basics': {
        definition: 'Recursion is a programming technique where a function calls itself to solve smaller instances of the same problem until reaching a base case.',
        extras: [
          'What it does: breaks complex problems into simpler subproblems of the same type.',
          'How it works: defines base cases for termination and recursive cases that reduce the problem size.',
          'When to use: problems with recursive structure like tree traversals, divide-and-conquer algorithms, and backtracking.'
        ],
        example: 'Factorial: n! = n * (n-1)!\nfactorial(4) = 4 * factorial(3)\n              = 4 * 3 * factorial(2)\n              = 4 * 3 * 2 * factorial(1)\n              = 4 * 3 * 2 * 1\n              = 24',
        syntax: `function factorial(n) {\n  // Base case\n  if (n <= 1) return 1;\n  \n  // Recursive case\n  return n * factorial(n - 1);\n}`,
        narration: 'Recursion is like nested Russian dolls. Each function call opens a smaller version of the same problem until reaching the smallest case that can be solved directly.'
      },
      'dp-introduction': {
        definition: 'Dynamic Programming (DP) is a method for solving complex problems by breaking them down into simpler subproblems and storing their solutions to avoid redundant calculations.',
        extras: [
          'What it does: optimizes recursive algorithms by storing intermediate results.',
          'How it works: uses memoization (top-down) or tabulation (bottom-up) to build solutions from previously solved subproblems.',
          'When to use: optimization problems with overlapping subproblems and optimal substructure.'
        ],
        example: 'Fibonacci with DP:\nfib(5) needs fib(4) and fib(3)\nfib(4) needs fib(3) and fib(2)\nStore results to avoid recalculating fib(3) multiple times',
        syntax: `// Fibonacci with memoization\nfunction fib(n, memo = {}) {\n  if (n <= 1) return n;\n  if (memo[n]) return memo[n];\n  memo[n] = fib(n - 1, memo) + fib(n - 2, memo);\n  return memo[n];\n}\n\n// Fibonacci with tabulation\nfunction fibTab(n) {\n  const dp = [0, 1];\n  for (let i = 2; i <= n; i++) {\n    dp[i] = dp[i - 1] + dp[i - 2];\n  }\n  return dp[n];\n}`,
        narration: 'Dynamic Programming is like solving a puzzle by remembering solutions to pieces you\'ve already figured out, saving time by not solving the same subproblems repeatedly.'
      },
      'trie-operations': {
        definition: 'A trie (prefix tree) is a tree-like data structure that stores a dynamic set of strings, where the keys are usually strings and common prefixes are shared to save space.',
        extras: [
          'What it does: efficiently stores and retrieves strings with common prefixes.',
          'How it works: each node represents a character, and paths from root to nodes form strings.',
          'When to use: autocomplete systems, spell checkers, IP routing, and word games.'
        ],
        example: 'Insert "car", "cat", "dog":\n     root\n    / | \\\n   c  d  ...\n  /    \\\n a     o\n/ \\    \\\nr   t    g',
        syntax: `class TrieNode {\n  constructor() {\n    this.children = {};\n    this.isEndOfWord = false;\n  }\n}\n\nclass Trie {\n  constructor() {\n    this.root = new TrieNode();\n  }\n  \n  insert(word) {\n    let node = this.root;\n    for (const char of word) {\n      if (!node.children[char]) {\n        node.children[char] = new TrieNode();\n      }\n      node = node.children[char];\n    }\n    node.isEndOfWord = true;\n  }\n  \n  search(word) {\n    let node = this.root;\n    for (const char of word) {\n      if (!node.children[char]) return false;\n      node = node.children[char];\n    }\n    return node.isEndOfWord;\n  }\n}`,
        narration: 'A trie is like a word tree where each path from root to leaf spells out a word. Words with the same prefix share the same initial path, making prefix searches very efficient.'
      },
      'heap-operations': {
        definition: 'A heap is a specialized tree-based data structure that satisfies the heap property: in a max heap, for any given node, the value is greater than or equal to its children; in a min heap, the value is less than or equal to its children.',
        extras: [
          'What it does: efficiently maintains the minimum or maximum element at the root.',
          'How it works: uses a complete binary tree structure, typically implemented with an array, with specific parent-child index relationships.',
          'When to use: priority queues, heap sort, finding kth largest/smallest elements, and graph algorithms like Dijkstra\'s.'
        ],
        example: 'Min-heap: [10, 15, 30, 40, 50, 100, 40]\nExtract min: 10 -> heap becomes [15, 40, 30, 40, 50, 100]\nInsert 5: heap becomes [5, 15, 30, 40, 50, 100, 40]',
        syntax: `class MinHeap {\n  constructor() {\n    this.heap = [];\n  }\n  \n  getParentIndex(i) { return Math.floor((i - 1) / 2); }\n  getLeftChildIndex(i) { return 2 * i + 1; }\n  getRightChildIndex(i) { return 2 * i + 2; }\n  \n  insert(value) {\n    this.heap.push(value);\n    this.siftUp(this.heap.length - 1);\n  }\n  \n  extractMin() {\n    if (this.heap.length === 0) return null;\n    const min = this.heap[0];\n    const last = this.heap.pop();\n    if (this.heap.length > 0) {\n      this.heap[0] = last;\n      this.siftDown(0);\n    }\n    return min;\n  }\n}`,
        narration: 'A heap is like a priority line where the most important person (highest or lowest priority) is always at the front. When someone leaves or joins, we quickly reorganize to maintain this property.'
      },
      'segment-tree': {
        definition: 'A segment tree is a binary tree data structure used for storing information about intervals or segments, allowing for efficient range queries and updates.',
        extras: [
          'What it does: performs range queries (like sum, minimum, maximum) and updates in logarithmic time.',
          'How it works: divides the array into segments and pre-computes results for those segments in a tree structure.',
          'When to use: problems involving range queries and updates, competitive programming, and computational geometry.'
        ],
        example: 'Array: [1, 3, 5, 7, 9, 11]\nQuery sum(1, 3): returns 3+5+7=15\nUpdate index 2 to 10: [1, 3, 10, 7, 9, 11]\nQuery sum(1, 3): returns 3+10+7=20',
        syntax: `class SegmentTree {\n  constructor(arr) {\n    this.n = arr.length;\n    this.tree = Array(4 * this.n).fill(0);\n    this.build(arr, 1, 0, this.n - 1);\n  }\n  \n  build(arr, node, start, end) {\n    if (start === end) {\n      this.tree[node] = arr[start];\n    } else {\n      const mid = Math.floor((start + end) / 2);\n      this.build(arr, 2 * node, start, mid);\n      this.build(arr, 2 * node + 1, mid + 1, end);\n      this.tree[node] = this.tree[2 * node] + this.tree[2 * node + 1];\n    }\n  }\n  \n  query(node, start, end, l, r) {\n    if (l > end || r < start) return 0;\n    if (l <= start && r >= end) return this.tree[node];\n    const mid = Math.floor((start + end) / 2);\n    return this.query(2 * node, start, mid, l, r) + \n           this.query(2 * node + 1, mid + 1, end, l, r);\n  }\n}`,
        narration: 'Segment trees divide data into ranges, allowing us to quickly answer questions about any range without checking every element. It\'s like having pre-calculated summaries for different sections of your data.'
      },
      'fenwick-tree': {
        definition: 'A Fenwick tree (Binary Indexed Tree) is a data structure that efficiently updates elements and calculates prefix sums in a table of numbers.',
        extras: [
          'What it does: supports point updates and range sum queries in logarithmic time with less memory than segment trees.',
          'How it works: uses a clever binary representation of indices to store cumulative sums in an implicit tree structure.',
          'When to use: when you need efficient prefix sum calculations with updates, like in cumulative frequency tables or range sum queries.'
        ],
        example: 'Array: [3, 2, 5, 1, 7, 9]\nUpdate index 2 to 8: [3, 2, 8, 1, 7, 9]\nQuery sum(0, 3): returns 3+2+8+1=14',
        syntax: `class FenwickTree {\n  constructor(size) {\n    this.size = size;\n    this.tree = Array(size + 1).fill(0);\n  }\n  \n  update(index, delta) {\n    index++; // 1-based indexing\n    while (index <= this.size) {\n      this.tree[index] += delta;\n      index += index & -index; // Add least significant bit\n    }\n  }\n  \n  prefixSum(index) {\n    index++; // 1-based indexing\n    let sum = 0;\n    while (index > 0) {\n      sum += this.tree[index];\n      index -= index & -index; // Remove least significant bit\n    }\n    return sum;\n  }\n  \n  rangeSum(left, right) {\n    return this.prefixSum(right) - this.prefixSum(left - 1);\n  }\n}`,
        narration: 'Fenwick trees use binary magic to efficiently track running totals. By cleverly using powers of 2, they can update values and calculate sums much faster than checking each element.'
      },
      'union-find': {
        definition: 'Union-Find (Disjoint Set) is a data structure that tracks a set of elements partitioned into disjoint subsets, supporting union and find operations.',
        extras: [
          'What it does: efficiently determines which set an element belongs to and merges sets together.',
          'How it works: uses tree structures with path compression and union by rank optimizations.',
          'When to use: detecting cycles in graphs, finding connected components, and implementing Kruskal\'s algorithm for minimum spanning trees.'
        ],
        example: 'Initially: [0], [1], [2], [3], [4]\nUnion(0,1): [0,1], [2], [3], [4]\nUnion(2,3): [0,1], [2,3], [4]\nFind(3): returns 2 (root of set containing 3)',
        syntax: `class UnionFind {\n  constructor(size) {\n    this.parent = Array(size).fill().map((_, i) => i);\n    this.rank = Array(size).fill(0);\n  }\n  \n  find(x) {\n    if (this.parent[x] !== x) {\n      this.parent[x] = this.find(this.parent[x]); // Path compression\n    }\n    return this.parent[x];\n  }\n  \n  union(x, y) {\n    const rootX = this.find(x);\n    const rootY = this.find(y);\n    \n    if (rootX === rootY) return;\n    \n    // Union by rank\n    if (this.rank[rootX] < this.rank[rootY]) {\n      this.parent[rootX] = rootY;\n    } else if (this.rank[rootX] > this.rank[rootY]) {\n      this.parent[rootY] = rootX;\n    } else {\n      this.parent[rootY] = rootX;\n      this.rank[rootX]++;\n    }\n  }\n  \n  connected(x, y) {\n    return this.find(x) === this.find(y);\n  }\n}`,
        narration: 'Union-Find is like tracking friend groups. The find operation tells you who the leader of a group is, while union merges two groups together under one leader.'
      },
      'greedy-algorithms': {
        definition: 'Greedy algorithms make locally optimal choices at each step with the hope of finding a global optimum, solving problems by making the best immediate decision without reconsidering previous choices.',
        extras: [
          'What it does: builds up a solution piece by piece, always choosing the next piece that offers the most immediate benefit.',
          'How it works: selects the best option available at each step without looking ahead or backtracking.',
          'When to use: problems with optimal substructure and the greedy-choice property, like certain scheduling, graph, and optimization problems.'
        ],
        example: 'Coin change with denominations [1,5,10,25]\nFor 36 cents: Pick 25, then 10, then 1 -> [25,10,1]\nTotal: 3 coins (optimal)',
        syntax: `function coinChange(amount, coins) {\n  coins.sort((a, b) => b - a); // Sort in descending order\n  let result = [];\n  let remaining = amount;\n  \n  for (const coin of coins) {\n    while (remaining >= coin) {\n      result.push(coin);\n      remaining -= coin;\n    }\n  }\n  \n  return result;\n}`,
        narration: 'Greedy algorithms are like hiking to the top of a mountain by always walking uphill. Each step takes you higher, but you might not reach the highest peak if there are valleys you need to cross first.'
      },
      'backtracking': {
        definition: 'Backtracking is an algorithmic technique that incrementally builds candidates to a solution and abandons (backtracks) when it determines that the candidate cannot be extended to a valid solution.',
        extras: [
          'What it does: explores all possible solutions by trying options, undoing them if they lead to dead ends.',
          'How it works: uses recursion to build a search tree, pruning branches that cannot lead to valid solutions.',
          'When to use: combinatorial problems like permutations, combinations, puzzles (Sudoku, N-Queens), and constraint satisfaction problems.'
        ],
        example: 'N-Queens (n=4):\nTry queen at (0,0) -> Try queen at (1,2) -> Try queen at (2,?)\nNo valid position for row 2 -> Backtrack to (1,2)\nTry queen at (1,3) -> ... and so on',
        syntax: `function solveNQueens(n) {\n  const result = [];\n  const board = Array(n).fill().map(() => Array(n).fill('.'));\n  \n  function isSafe(row, col) {\n    // Check if a queen can be placed at board[row][col]\n    // without being attacked by any previously placed queens\n    for (let i = 0; i < row; i++) {\n      if (board[i][col] === 'Q') return false;\n      if (col - (row - i) >= 0 && board[i][col - (row - i)] === 'Q') return false;\n      if (col + (row - i) < n && board[i][col + (row - i)] === 'Q') return false;\n    }\n    return true;\n  }\n  \n  function backtrack(row) {\n    if (row === n) {\n      result.push(board.map(row => row.join('')));\n      return;\n    }\n    \n    for (let col = 0; col < n; col++) {\n      if (isSafe(row, col)) {\n        board[row][col] = 'Q';\n        backtrack(row + 1);\n        board[row][col] = '.'; // Backtrack\n      }\n    }\n  }\n  \n  backtrack(0);\n  return result;\n}`,
        narration: 'Backtracking is like solving a maze by exploring paths and turning back when you hit dead ends. You systematically try all possibilities until you find a solution or exhaust all options.'
      },
      'topological-sort': {
        definition: 'Topological sorting arranges the vertices of a directed acyclic graph (DAG) in a linear order such that for every directed edge (u, v), vertex u comes before vertex v.',
        extras: [
          'What it does: creates a sequence where each node appears before any node it points to.',
          'How it works: uses DFS or BFS (Kahn\'s algorithm) to find an ordering that respects all dependencies.',
          'When to use: scheduling tasks with dependencies, course prerequisites, build systems, and data processing pipelines.'
        ],
        example: 'Graph: A → B, A → C, B → D, C → D\nTopological sort: A, B, C, D or A, C, B, D',
        syntax: `function topologicalSort(graph) {\n  const visited = new Set();\n  const temp = new Set();  // For cycle detection\n  const order = [];\n  \n  function dfs(node) {\n    if (temp.has(node)) return false; // Cycle detected\n    if (visited.has(node)) return true;\n    \n    temp.add(node);\n    \n    for (const neighbor of graph[node]) {\n      if (!dfs(neighbor)) return false;\n    }\n    \n    temp.delete(node);\n    visited.add(node);\n    order.unshift(node); // Add to front of result\n    return true;\n  }\n  \n  for (const node in graph) {\n    if (!visited.has(node)) {\n      if (!dfs(node)) return []; // Cycle detected, no valid topological sort\n    }\n  }\n  \n  return order;\n}`,
        narration: 'Topological sorting is like planning tasks where some must happen before others. If you need to put on socks before shoes, the sort ensures socks come before shoes in your morning routine.'
      },
      'minimum-spanning-tree': {
        definition: 'A minimum spanning tree (MST) is a subset of edges in a connected, undirected graph that connects all vertices with the minimum possible total edge weight.',
        extras: [
          'What it does: finds the cheapest way to connect all nodes in a graph.',
          'How it works: uses greedy algorithms like Kruskal\'s (sort edges, add if no cycle) or Prim\'s (grow tree from a vertex).',
          'When to use: network design, circuit design, clustering algorithms, and approximation algorithms for traveling salesman problem.'
        ],
        example: 'Graph with weighted edges:\nA-B: 4, A-C: 1, B-C: 2, B-D: 5, C-D: 3\nMST: A-C (1), B-C (2), C-D (3) with total weight 6',
        syntax: `// Kruskal's Algorithm\nfunction kruskalMST(graph, vertices) {\n  const edges = [];\n  for (const [u, neighbors] of Object.entries(graph)) {\n    for (const [v, weight] of Object.entries(neighbors)) {\n      if (parseInt(u) < parseInt(v)) { // Avoid duplicates\n        edges.push([parseInt(u), parseInt(v), weight]);\n      }\n    }\n  }\n  \n  edges.sort((a, b) => a[2] - b[2]); // Sort by weight\n  \n  const uf = new UnionFind(vertices);\n  const mst = [];\n  let weight = 0;\n  \n  for (const [u, v, w] of edges) {\n    if (!uf.connected(u, v)) {\n      uf.union(u, v);\n      mst.push([u, v, w]);\n      weight += w;\n    }\n  }\n  \n  return { mst, weight };\n}`,
        narration: 'A minimum spanning tree is like designing a road network to connect all cities with the least amount of road. It ensures everyone can reach everyone else while minimizing construction costs.'
      },
      'shortest-path': {
        definition: 'Shortest path algorithms find the path between two vertices in a graph such that the sum of the weights of its constituent edges is minimized.',
        extras: [
          'What it does: determines the most efficient route between nodes in a weighted graph.',
          'How it works: uses algorithms like Dijkstra\'s (non-negative weights) or Bellman-Ford (handles negative weights).',
          'When to use: route planning, network routing, logistics optimization, and any scenario where finding the optimal path is important.'
        ],
        example: 'Graph with weighted edges:\nA-B: 4, A-C: 2, B-D: 5, C-B: 1, C-D: 8\nShortest path A to D: A → C → B → D with total weight 8',
        syntax: `// Bellman-Ford Algorithm\nfunction bellmanFord(graph, source, vertices) {\n  const distances = {};\n  const predecessor = {};\n  \n  // Initialize\n  for (let i = 0; i < vertices; i++) {\n    distances[i] = Infinity;\n    predecessor[i] = null;\n  }\n  distances[source] = 0;\n  \n  // Relax edges repeatedly\n  for (let i = 0; i < vertices - 1; i++) {\n    for (const [u, neighbors] of Object.entries(graph)) {\n      for (const [v, weight] of Object.entries(neighbors)) {\n        if (distances[u] !== Infinity && distances[u] + weight < distances[v]) {\n          distances[v] = distances[u] + weight;\n          predecessor[v] = u;\n        }\n      }\n    }\n  }\n  \n  // Check for negative weight cycles\n  for (const [u, neighbors] of Object.entries(graph)) {\n    for (const [v, weight] of Object.entries(neighbors)) {\n      if (distances[u] !== Infinity && distances[u] + weight < distances[v]) {\n        return { hasNegativeCycle: true };\n      }\n    }\n  }\n  \n  return { distances, predecessor, hasNegativeCycle: false };\n}`,
        narration: 'Finding the shortest path is like planning a road trip to minimize travel time or distance. Different algorithms help us find the best route depending on the road conditions.'
      },
      'string-matching': {
        definition: 'String matching algorithms find occurrences of a pattern string within a larger text string, with various approaches optimized for different scenarios.',
        extras: [
          'What it does: locates all occurrences of a pattern within a text, often with pre-processing to improve efficiency.',
          'How it works: uses techniques like sliding windows, prefix tables, or hashing to avoid unnecessary comparisons.',
          'When to use: text editors, search engines, bioinformatics (DNA matching), and plagiarism detection.'
        ],
        example: 'Text: "ABABDABACDABABCABAB"\nPattern: "ABABCABAB"\nFound at position 10',
        syntax: `// Knuth-Morris-Pratt (KMP) Algorithm\nfunction kmpSearch(text, pattern) {\n  if (pattern.length === 0) return 0;\n  \n  // Compute LPS (Longest Prefix Suffix) array\n  const lps = Array(pattern.length).fill(0);\n  let prevLPS = 0, i = 1;\n  \n  while (i < pattern.length) {\n    if (pattern[i] === pattern[prevLPS]) {\n      lps[i] = prevLPS + 1;\n      prevLPS++;\n      i++;\n    } else if (prevLPS === 0) {\n      lps[i] = 0;\n      i++;\n    } else {\n      prevLPS = lps[prevLPS - 1];\n    }\n  }\n  \n  // Search pattern in text\n  let j = 0, // pattern index\n      k = 0; // text index\n  const positions = [];\n  \n  while (k < text.length) {\n    if (pattern[j] === text[k]) {\n      j++;\n      k++;\n    }\n    \n    if (j === pattern.length) {\n      positions.push(k - j); // Found pattern at k-j\n      j = lps[j - 1];\n    } else if (k < text.length && pattern[j] !== text[k]) {\n      if (j !== 0) {\n        j = lps[j - 1];\n      } else {\n        k++;\n      }\n    }\n  }\n  \n  return positions;\n}`,
        narration: 'String matching is like finding a specific word in a book. Instead of checking every character one by one, smart algorithms use patterns and shortcuts to quickly locate what you\'re looking for.'
      },
      'bit-manipulation': {
        definition: 'Bit manipulation involves applying logical operations on binary representations of data to perform efficient computations at the bit level.',
        extras: [
          'What it does: performs operations directly on bits rather than higher-level data types.',
          'How it works: uses bitwise operators (AND, OR, XOR, NOT, shifts) to manipulate individual bits.',
          'When to use: optimization problems, cryptography, compression algorithms, embedded systems, and low-level programming.'
        ],
        example: 'Check if number is power of 2:\nn = 16 (10000 in binary)\nn-1 = 15 (01111 in binary)\nn & (n-1) = 0 ✓ (power of 2)',
        syntax: `// Common bit manipulation operations\nfunction isPowerOfTwo(n) {\n  return n > 0 && (n & (n - 1)) === 0;\n}\n\nfunction countSetBits(n) {\n  let count = 0;\n  while (n > 0) {\n    count += n & 1;\n    n >>= 1;\n  }\n  return count;\n}\n\nfunction getBit(n, i) {\n  return (n & (1 << i)) !== 0;\n}\n\nfunction setBit(n, i) {\n  return n | (1 << i);\n}\n\nfunction clearBit(n, i) {\n  return n & ~(1 << i);\n}`,
        narration: 'Bit manipulation is like working with tiny switches that can be on or off. By flipping, combining, or checking these switches directly, we can perform operations much faster than working with larger units of data.'
      },
      'divide-and-conquer': {
        definition: 'Divide and conquer is an algorithmic paradigm that breaks a problem into smaller subproblems, solves them recursively, and then combines their solutions to solve the original problem.',
        extras: [
          'What it does: tackles complex problems by breaking them down into simpler versions of the same problem.',
          'How it works: follows three steps - divide (break into subproblems), conquer (solve subproblems recursively), and combine (merge solutions).',
          'When to use: sorting algorithms (merge sort, quick sort), binary search, matrix multiplication, and computational geometry.'
        ],
        example: 'Merge Sort:\nDivide: [38, 27, 43, 3, 9, 82, 10] → [38, 27, 43, 3] and [9, 82, 10]\nConquer: Sort each half recursively\nCombine: Merge sorted halves',
        syntax: `// Merge Sort implementation\nfunction mergeSort(arr) {\n  if (arr.length <= 1) return arr;\n  \n  // Divide\n  const mid = Math.floor(arr.length / 2);\n  const left = arr.slice(0, mid);\n  const right = arr.slice(mid);\n  \n  // Conquer (recursive calls)\n  const sortedLeft = mergeSort(left);\n  const sortedRight = mergeSort(right);\n  \n  // Combine\n  return merge(sortedLeft, sortedRight);\n}\n\nfunction merge(left, right) {\n  const result = [];\n  let leftIndex = 0, rightIndex = 0;\n  \n  while (leftIndex < left.length && rightIndex < right.length) {\n    if (left[leftIndex] < right[rightIndex]) {\n      result.push(left[leftIndex]);\n      leftIndex++;\n    } else {\n      result.push(right[rightIndex]);\n      rightIndex++;\n    }\n  }\n  \n  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));\n}`,
        narration: 'Divide and conquer is like solving a big puzzle by breaking it into smaller puzzles, solving each one, and then putting them back together. This approach often leads to elegant and efficient solutions for complex problems.'
      },
      'avl-tree': {
        definition: 'An AVL tree is a self-balancing binary search tree where the height difference between left and right subtrees (balance factor) of any node is at most 1.',
        extras: [
          'What it does: maintains logarithmic height to ensure O(log n) operations even in worst-case scenarios.',
          'How it works: performs rotations (single or double) after insertions and deletions to restore balance.',
          'When to use: applications requiring frequent lookups and guaranteed worst-case performance, like database indexing and memory management.'
        ],
        example: 'Insert 10, 20, 30 without balancing:\n  10\n    \\\n     20\n      \\\n       30 (unbalanced)\n\nAfter right rotation:\n    20\n   /  \\\n 10    30 (balanced)',
        syntax: `class AVLNode {\n  constructor(value) {\n    this.value = value;\n    this.left = null;\n    this.right = null;\n    this.height = 1;\n  }\n}\n\nclass AVLTree {\n  constructor() {\n    this.root = null;\n  }\n  \n  height(node) {\n    return node ? node.height : 0;\n  }\n  \n  balanceFactor(node) {\n    return node ? this.height(node.left) - this.height(node.right) : 0;\n  }\n  \n  updateHeight(node) {\n    node.height = 1 + Math.max(this.height(node.left), this.height(node.right));\n  }\n  \n  rotateRight(y) {\n    const x = y.left;\n    const T2 = x.right;\n    \n    x.right = y;\n    y.left = T2;\n    \n    this.updateHeight(y);\n    this.updateHeight(x);\n    \n    return x;\n  }\n  \n  rotateLeft(x) {\n    const y = x.right;\n    const T2 = y.left;\n    \n    y.left = x;\n    x.right = T2;\n    \n    this.updateHeight(x);\n    this.updateHeight(y);\n    \n    return y;\n  }\n}`,
        narration: 'AVL trees are like self-balancing scales that automatically adjust when they become too heavy on one side. This ensures that operations like searching and inserting remain efficient no matter how the data is added or removed.'
      },
      'red-black-tree': {
        definition: 'A red-black tree is a self-balancing binary search tree where each node has an extra bit for denoting color (red or black), used to ensure the tree remains balanced during insertions and deletions.',
        extras: [
          'What it does: maintains logarithmic height with less overhead than AVL trees by using color properties instead of strict height balancing.',
          'How it works: enforces five properties including root is black, red nodes have black children, and all paths from root to leaves have the same number of black nodes.',
          'When to use: implementations of associative arrays, in standard libraries of many programming languages, and in database engines.'
        ],
        example: 'Red-Black Tree Properties:\n1. Every node is red or black\n2. Root is black\n3. No red node has a red child\n4. Every path from root to leaf has the same number of black nodes',
        syntax: `class RBNode {\n  constructor(value) {\n    this.value = value;\n    this.left = null;\n    this.right = null;\n    this.parent = null;\n    this.color = 'RED'; // New nodes are red by default\n  }\n}\n\nclass RedBlackTree {\n  constructor() {\n    this.NIL = new RBNode(null);\n    this.NIL.color = 'BLACK';\n    this.NIL.left = null;\n    this.NIL.right = null;\n    this.root = this.NIL;\n  }\n  \n  rotateLeft(x) {\n    const y = x.right;\n    x.right = y.left;\n    \n    if (y.left !== this.NIL) {\n      y.left.parent = x;\n    }\n    \n    y.parent = x.parent;\n    \n    if (x.parent === null) {\n      this.root = y;\n    } else if (x === x.parent.left) {\n      x.parent.left = y;\n    } else {\n      x.parent.right = y;\n    }\n    \n    y.left = x;\n    x.parent = y;\n  }\n  \n  // Additional methods for insert, delete, and fixup would be implemented here\n}`,
        narration: 'Red-black trees are like traffic systems with rules that prevent congestion. By coloring nodes red or black and following specific rules, they maintain balance without being too strict, making them practical for many real-world applications.'
      },
      'b-tree': {
        definition: 'A B-tree is a self-balancing tree data structure that maintains sorted data and allows searches, sequential access, insertions, and deletions in logarithmic time.',
        extras: [
          'What it does: generalizes binary search trees by allowing nodes to have more than two children.',
          'How it works: keeps keys in sorted order within each node and uses a balanced tree structure with specific rules about node capacity.',
          'When to use: databases and file systems where data is read and written in large blocks, like databases and file systems.'
        ],
        example: 'B-tree of order 3:\n     [10, 20]\n    /    |    \\\n [5]   [15]   [30, 40]',
        syntax: `class BTreeNode {\n  constructor(isLeaf = false, t = 3) {\n    this.keys = [];\n    this.children = [];\n    this.isLeaf = isLeaf;\n    this.t = t; // Minimum degree (defines the range for number of keys)\n  }\n}\n\nclass BTree {\n  constructor(t = 3) {\n    this.root = new BTreeNode(true, t);\n    this.t = t; // Minimum degree\n  }\n  \n  search(k, node = this.root) {\n    let i = 0;\n    \n    // Find the first key greater than or equal to k\n    while (i < node.keys.length && k > node.keys[i]) {\n      i++;\n    }\n    \n    // If the found key is equal to k, return this node\n    if (i < node.keys.length && k === node.keys[i]) {\n      return { node, index: i };\n    }\n    \n    // If key is not found and this is a leaf node\n    if (node.isLeaf) {\n      return null;\n    }\n    \n    // Go to the appropriate child\n    return this.search(k, node.children[i]);\n  }\n  \n  // Additional methods for insert, delete, and split would be implemented here\n}`,
        narration: 'B-trees are like well-organized filing cabinets where each drawer can hold multiple files and has labels to help you quickly find what you need. They\'re especially good when working with large amounts of data that doesn\'t fit in memory.'
      },
      'hashing-techniques': {
        definition: 'Hashing techniques convert data of arbitrary size to fixed-size values (hash codes) and organize data in hash tables for efficient storage and retrieval.',
        extras: [
          'What it does: maps data to fixed-size values using hash functions and handles collisions when different inputs produce the same hash.',
          'How it works: uses hash functions to compute an index into an array where the desired value can be found or stored.',
          'When to use: implementing dictionaries, database indexing, caching, and cryptographic applications.'
        ],
        example: 'Hash table with chaining:\nArray: [0][1][2][3][4]\nHash("apple") = 1 → [1] → "apple"\nHash("banana") = 3 → [3] → "banana"\nHash("orange") = 1 → [1] → "apple" → "orange" (collision)',
        syntax: `class HashTable {\n  constructor(size = 53) {\n    this.keyMap = Array(size).fill().map(() => []);\n  }\n  \n  _hash(key) {\n    let total = 0;\n    const PRIME = 31;\n    for (let i = 0; i < Math.min(key.length, 100); i++) {\n      const char = key[i];\n      const value = char.charCodeAt(0) - 96;\n      total = (total * PRIME + value) % this.keyMap.length;\n    }\n    return total;\n  }\n  \n  set(key, value) {\n    const index = this._hash(key);\n    // Check if key already exists\n    for (let i = 0; i < this.keyMap[index].length; i++) {\n      if (this.keyMap[index][i][0] === key) {\n        this.keyMap[index][i][1] = value;\n        return;\n      }\n    }\n    // Key doesn't exist, add new key-value pair\n    this.keyMap[index].push([key, value]);\n  }\n  \n  get(key) {\n    const index = this._hash(key);\n    for (let i = 0; i < this.keyMap[index].length; i++) {\n      if (this.keyMap[index][i][0] === key) {\n        return this.keyMap[index][i][1];\n      }\n    }\n    return undefined;\n  }\n}`,
        narration: 'Hashing is like having a smart filing system that instantly tells you where to find or store information. It uses a special formula to convert data into a location, making lookups very fast regardless of how much data you have.'
      },
      'graph-coloring': {
        definition: 'Graph coloring is the assignment of labels (colors) to elements of a graph subject to certain constraints, typically ensuring that no adjacent vertices share the same color.',
        extras: [
          'What it does: assigns colors to graph elements (usually vertices) such that no adjacent elements have the same color.',
          'How it works: uses various algorithms like greedy coloring, backtracking, or heuristic approaches to find valid colorings.',
          'When to use: scheduling problems, register allocation in compilers, map coloring, and solving certain types of constraints.'
        ],
        example: 'Graph: A--B--C--D--A\nValid coloring: A(red), B(blue), C(red), D(blue)',
        syntax: `// Greedy coloring algorithm\nfunction greedyColoring(graph) {\n  const result = {};\n  const vertices = Object.keys(graph);\n  \n  // Assign the first color to first vertex\n  result[vertices[0]] = 0;\n  \n  // Initialize remaining vertices as unassigned\n  for (let i = 1; i < vertices.length; i++) {\n    result[vertices[i]] = -1;\n  }\n  \n  // A temporary array to store the available colors\n  const available = Array(vertices.length).fill(true);\n  \n  // Assign colors to remaining vertices\n  for (let u = 1; u < vertices.length; u++) {\n    // Process all adjacent vertices and flag their colors as unavailable\n    for (const adj of graph[vertices[u]]) {\n      if (result[adj] !== -1) {\n        available[result[adj]] = false;\n      }\n    }\n    \n    // Find the first available color\n    let cr;\n    for (cr = 0; cr < vertices.length; cr++) {\n      if (available[cr]) break;\n    }\n    \n    // Assign the found color\n    result[vertices[u]] = cr;\n    \n    // Reset the available array for next iteration\n    available.fill(true);\n  }\n  \n  return result;\n}`,
        narration: 'Graph coloring is like assigning meeting rooms to different groups, ensuring that groups that need to meet at the same time get different rooms. It\'s a fundamental problem with applications ranging from scheduling to map design.'
      }
    };
    return byId[topicId] || {};
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <NavLink to="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </NavLink>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">{topic.title}</h1>
            <Badge
              variant="secondary"
              className={cn(
                topic.difficulty === 'beginner' && "bg-success/20 text-success border-success/30",
                topic.difficulty === 'intermediate' && "bg-warning/20 text-warning border-warning/30",
                topic.difficulty === 'advanced' && "bg-destructive/20 text-destructive border-destructive/30"
              )}
            >
              {topic.difficulty}
            </Badge>
            <Badge variant="outline">{topic.category}</Badge>
            <HintTooltip hint={getTopicHint(topic.id)} />
          </div>
          <p className="text-muted-foreground">{topic.description}</p>
        </div>
      </div>

      {/* Learning Progress */}
      <LearningProgress currentTopicId={topic.id} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Visualization */}
        <div className="xl:col-span-2 space-y-6">
          {/* Topic Definition + Voice Narration */}
          <div className="space-y-3">
            {(() => { const c = getTopicContent(topic.id); return null; })()}
            <DefinitionBox 
              title={topic.title} 
              definition={(getTopicContent(topic.id).definition) || topic.extendedDefinition || topic.description}
              extra={getTopicContent(topic.id).extras || []}
              example={(getTopicContent(topic.id).example) || (topic.example || getExample(topic.id))}
              syntax={(getTopicContent(topic.id).syntax) || (topic.syntax || getSyntax(topic.id))}
              narrationText={(getTopicContent(topic.id).narration) || `${topic.title}. ${topic.description}. ${getVisualizationNarration(topic.id)}`}
            />
          </div>

          <div className="bg-card border rounded-xl p-6 shadow-subtle">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Interactive Visualization</h2>
            </div>
            <VisualizationAutoNarrator introText={`Let's explore ${topic.title}. ${topic.description}`} />
            {/* Removed Code & Run Visualization button */}

            {topic.id === 'array-basics' && <EnhancedArrayVisualizer />}
            {topic.id === 'linked-list-singly' && <LinkedListVisualizer />}
            {topic.id === 'stack-operations' && <StackVisualizer />}
            {topic.id === 'queue-operations' && <QueueVisualizer />}
            {topic.id === 'binary-search-tree' && <BinaryTreeVisualizer />}
            {topic.id === 'tree-inorder-traversal' && <TreeTraversalVisualizer />}
            {topic.id === 'tree-preorder-traversal' && <TreeTraversalVisualizer />}
            {topic.id === 'tree-postorder-traversal' && <TreeTraversalVisualizer />}
            {topic.id === 'bubble-sort' && <EnhancedBubbleSort />}
            {topic.id === 'merge-sort' && <SortingVisualizer algorithm="merge" />}
            {topic.id === 'quick-sort' && <SortingVisualizer algorithm="quick" />}
            {topic.id === 'heap-operations' && <HeapVisualizer />}
            {topic.id === 'trie-operations' && <TrieVisualizer />}
            {topic.id === 'union-find' && <UnionFindVisualizer />}
            {topic.id === 'dijkstra-algorithm' && <GraphVisualizer />}
            {topic.id === 'string-search-kmp' && <StringMatchingVisualizer />}

            {/* New Interactive Visualizers */}
            {topic.id === 'array-rotation' && <ArrayRotationVisualizer />}
            {topic.id === 'string-palindrome' && <PalindromeVisualizer />}
            {topic.id === 'linear-search' && <SearchVisualizer />}
            {topic.id === 'binary-search' && <EnhancedBinarySearch />}
            {topic.id === 'interpolation-search' && <SearchVisualizer />}
            {topic.id === 'hash-table' && <HashTableVisualizer />}
            {topic.id === 'hash-chaining' && <SeparateChainingVisualizer />}
            {topic.id === 'open-addressing' && <HashTableVisualizer />}
            {topic.id === 'recursion-basics' && <RecursionVisualizer />}
            {topic.id === 'tail-recursion' && <RecursionVisualizer />}
            {topic.id === 'fibonacci' && <RecursionVisualizer />}
            {topic.id === 'dp-introduction' && <DPVisualizer />}
            {topic.id === 'longest-common-subsequence' && <DPVisualizer />}
            {topic.id === 'knapsack-problem' && <KnapsackVisualizer />}
            {topic.id === 'longest-increasing-subsequence' && <LongestIncreasingSubsequenceVisualizer />}
            {topic.id === 'activity-selection' && <GreedyVisualizer />}
            {topic.id === 'huffman-coding' && <GreedyVisualizer />}
            {topic.id === 'fractional-knapsack' && <GreedyVisualizer />}
            {topic.id === 'n-queens' && <BacktrackingVisualizer />}
            {topic.id === 'sudoku-solver' && <BacktrackingVisualizer />}
            {topic.id === 'maze-solver' && <BacktrackingVisualizer />}
            {topic.id === 'linked-list-doubly' && <DoublyLinkedListVisualizer />}
            {topic.id === 'graph-dfs' && <DFSBFSVisualizer />}
            {topic.id === 'graph-bfs' && <DFSBFSVisualizer />}
            {topic.id === 'segment-tree' && <AdvancedVisualizer />}
            {topic.id === 'fenwick-tree' && <AdvancedVisualizer />}
            {topic.id === 'trie' && <TrieVisualizer />}
            {topic.id === 'binary-tree' && <BinaryTreeVisualizer />}

            {/* Additional visualizers for new topics */}
            {topic.id === 'heap-sort' && <HeapVisualizer />}
            {topic.id === 'insertion-sort' && <InsertionSortVisualizer />}
            {topic.id === 'selection-sort' && <SelectionSortVisualizer />}
            {topic.id === 'counting-sort' && <CountingSortVisualizer />}
            {topic.id === 'radix-sort' && <SortingVisualizer algorithm="radix" />}
            {topic.id === 'bucket-sort' && <SortingVisualizer algorithm="bucket" />}
            {topic.id === 'bellman-ford' && <GraphVisualizer />}
            {topic.id === 'floyd-warshall' && <GraphVisualizer />}
            {topic.id === 'kruskal-algorithm' && <GraphVisualizer />}
            {topic.id === 'prim-algorithm' && <GraphVisualizer />}
            {topic.id === 'topological-sort' && <GraphVisualizer />}
            {topic.id === 'rabin-karp' && <StringMatchingVisualizer />}
            {topic.id === 'z-algorithm' && <StringMatchingVisualizer />}
            {topic.id === 'manacher-algorithm' && <StringMatchingVisualizer />}
            {topic.id === 'string-anagram' && <StringMatchingVisualizer />}
            {topic.id === 'avl-tree' && <BinaryTreeVisualizer />}
            {topic.id === 'red-black-tree' && <BinaryTreeVisualizer />}
            {topic.id === 'b-tree' && <BinaryTreeVisualizer />}
            {topic.id === 'splay-tree' && <BinaryTreeVisualizer />}
            {topic.id === 'two-sum' && <TwoPointersVisualizer />}
            {topic.id === 'three-sum' && <TwoPointersVisualizer />}
            {topic.id === 'container-water' && <TwoPointersVisualizer />}
            {topic.id === 'remove-duplicates' && <TwoPointersVisualizer />}
            {topic.id === 'sliding-window-maximum' && <SlidingWindowVisualizer />}
            {topic.id === 'longest-substring' && <SlidingWindowVisualizer />}
            {topic.id === 'bit-basics' && <BitManipulationVisualizer />}
            {topic.id === 'count-set-bits' && <BitManipulationVisualizer />}
            {topic.id === 'power-of-two' && <BitManipulationVisualizer />}
            {topic.id === 'single-number' && <BitManipulationVisualizer />}
            {topic.id === 'bit-subset' && <BitManipulationVisualizer />}
            {topic.id === 'number-theory-basics' && <MathematicalVisualizer />}
            {topic.id === 'prime-algorithms' && <MathematicalVisualizer />}
            {topic.id === 'fast-exponentiation' && <MathematicalVisualizer />}
            {topic.id === 'array-subarray-problems' && <EnhancedArrayVisualizer />}
            {topic.id === 'linked-list-circular' && <LinkedListVisualizer />}
            {topic.id === 'heap-operations' && <HeapVisualizer />}
            {topic.id === 'sliding-window-basics' && <SlidingWindowVisualizer />}

          
          </div>

          {/* Explanation Steps */}
          <div className="space-y-3">
            <ExplanationBox
              steps={getExplanationSteps(topic.id)}
              title={`How ${topic.title} Works`}
              currentStep={currentExplanationStep}
              onStepChange={(step) => setCurrentExplanationStep(step)}
            />
          </div>

          {/* Teaching Cards - beginner-friendly summary (hidden for array-basics) */}
          {topic.id !== 'array-basics' && (
            <TeachingCards
              items={getTeachingCardItems(topic.id, topic.category)}
              mistakes={getCommonMistakes(topic.id, topic.category)}
            />
          )}

          {/* Real-world Applications */}
          <div className="bg-card border rounded-xl p-6 shadow-subtle">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🌍</span>
              <h2 className="text-xl font-semibold">Real-World Applications</h2>
            </div>
            <div className="space-y-3 text-sm">
              {getRealWorldApplications(topic.id).map((app, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <span className="text-lg flex-shrink-0">{app.icon}</span>
                  <div>
                    <h4 className="font-medium text-foreground">{app.title}</h4>
                    <p className="text-muted-foreground">{app.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Quiz */}
          <InteractiveQuiz topicId={topic.id} />

          {/* Advanced Personal Codespace */}
          <AdvancedCodePlayground 
            topicId={topic.id} 
            topicTitle={topic.title}
            initialCode={{
              javascript: getCodeSnippet(topic.id, 'javascript'),
              python: getCodeSnippet(topic.id, 'python'),
              java: getCodeSnippet(topic.id, 'java'),
              cpp: getCodeSnippet(topic.id, 'cpp')
            }}
          />

          {/* Web Development Playground for web-related topics */}
          {(topic.category === 'Web Development' || topic.title.toLowerCase().includes('html') || topic.title.toLowerCase().includes('css')) && (
            <WebPlayground 
              topicId={topic.id} 
              topicTitle={topic.title}
            />
          )}
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          {/* Complexity Analysis */}
          <ComplexityBox
            timeComplexity={topic.timeComplexity || 'O(1)'}
            spaceComplexity={topic.spaceComplexity || 'O(1)'}
            description="Performance characteristics for the main operations"
          />

          {/* Code Implementation */}
          {getCodeSnippet(topic.id) && (
            <CodeSnippetBox
              title={`${topic.title} Implementation`}
              language={getCodeSnippet(topic.id)!.language}
              code={getCodeSnippet(topic.id)!.code}
              description={getCodeSnippet(topic.id)!.description}
            />
          )}

          {/* Pseudocode */}
          <PseudocodeBox
            title={`${topic.title} Pseudocode`}
            code={arrayPseudocode}
          />

          {/* Key Concepts */}
          <div className="bg-card border rounded-xl p-4 shadow-subtle">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-4 w-4 text-primary" />
              <h4 className="font-semibold text-card-foreground">Key Concepts</h4>
            </div>

            <div className="space-y-3 text-sm">
              <div className="p-3 bg-muted/50 rounded-lg">
                <h5 className="font-medium text-foreground mb-1">Definition</h5>
                <p className="text-muted-foreground">{topic.description}</p>
              </div>

              {topic.category === 'Arrays' && (
                <>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <h5 className="font-medium text-foreground mb-1">Use Cases</h5>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Fast element access by index</li>
                      <li>• Memory-efficient storage</li>
                      <li>• Foundation for other data structures</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <h5 className="font-medium text-foreground mb-1">Trade-offs</h5>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Fixed size in many implementations</li>
                      <li>• Expensive insertions/deletions in middle</li>
                      <li>• Memory must be contiguous</li>
                    </ul>
                  </div>
                </>
              )}

              {topic.category === 'Linked Lists' && (
                <>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <h5 className="font-medium text-foreground mb-1">Advantages</h5>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Dynamic size allocation</li>
                      <li>• Efficient insertion/deletion</li>
                      <li>• Memory efficiency for sparse data</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <h5 className="font-medium text-foreground mb-1">Disadvantages</h5>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• No random access (sequential only)</li>
                      <li>• Extra memory for pointers</li>
                      <li>• Poor cache locality</li>
                    </ul>
                  </div>
                </>
              )}

              {topic.category === 'Stacks & Queues' && (
                <>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <h5 className="font-medium text-foreground mb-1">Real-world Applications</h5>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Function call management</li>
                      <li>• Undo operations in editors</li>
                      <li>• Expression evaluation</li>
                      <li>• Task scheduling systems</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <h5 className="font-medium text-foreground mb-1">Key Properties</h5>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• All operations are O(1)</li>
                      <li>• Restricted access patterns</li>
                      <li>• Can be implemented with arrays or linked lists</li>
                    </ul>
                  </div>
                </>
              )}

              {topic.category === 'Trees' && (
                <>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <h5 className="font-medium text-foreground mb-1">Tree Properties</h5>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Hierarchical data structure</li>
                      <li>• Efficient search, insertion, deletion</li>
                      <li>• Various traversal methods</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <h5 className="font-medium text-foreground mb-1">Applications</h5>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Database indexing</li>
                      <li>• File system structure</li>
                      <li>• Expression parsing</li>
                      <li>• Decision making algorithms</li>
                    </ul>
                  </div>
                </>
              )}

              {topic.category === 'Sorting' && (
                <>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <h5 className="font-medium text-foreground mb-1">Sorting Categories</h5>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Comparison-based vs Non-comparison</li>
                      <li>• In-place vs Out-of-place</li>
                      <li>• Stable vs Unstable</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <h5 className="font-medium text-foreground mb-1">When to Use</h5>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Bubble Sort: Educational purposes</li>
                      <li>• Merge Sort: Guaranteed O(n log n)</li>
                      <li>• Quick Sort: Average case efficiency</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}