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