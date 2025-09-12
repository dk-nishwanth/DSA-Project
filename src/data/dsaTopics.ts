export interface DSATopic {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeComplexity?: string;
  spaceComplexity?: string;
  extendedDefinition?: string; // richer content used in DefinitionBox if available
  example?: string;
  syntax?: string;
}

export const dsaCategories = [
  'Arrays',
  'Strings',
  'Linked Lists',
  'Stacks & Queues',
  'Trees',
  'Graphs',
  'Sorting',
  'Searching',
  'Hashing',
  'Recursion',
  'Dynamic Programming',
  'Greedy Algorithms',
  'Backtracking',
  'Advanced Data Structures',
  'Two Pointers',
  'Sliding Window',
  'Bit Manipulation',
  'Mathematical Algorithms'
];

export const dsaTopics: DSATopic[] = [
  // Arrays
  {
    id: 'array-basics',
    title: 'Array Fundamentals',
    description: 'Master array operations: access, insert, delete, traverse, and search',
    category: 'Arrays',
    difficulty: 'beginner',
    timeComplexity: 'O(1) - O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'array-rotation',
    title: 'Array Rotation',
    description: 'Learn left and right rotation techniques with optimal approaches',
    category: 'Arrays',
    difficulty: 'intermediate',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'array-subarray-problems',
    title: 'Subarray Problems',
    description: 'Maximum subarray, subarray sum, and sliding window basics',
    category: 'Arrays',
    difficulty: 'intermediate',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },

  // Strings
  {
    id: 'string-palindrome',
    title: 'Palindrome Check',
    description: 'Check if a string is a palindrome using various methods',
    category: 'Strings',
    difficulty: 'beginner',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'string-search-kmp',
    title: 'KMP Algorithm',
    description: 'Knuth-Morris-Pratt algorithm for efficient string pattern matching',
    category: 'Strings',
    difficulty: 'advanced',
    timeComplexity: 'O(n + m)',
    spaceComplexity: 'O(m)'
  },
  {
    id: 'rabin-karp',
    title: 'Rabin-Karp Algorithm',
    description: 'String matching using rolling hash technique',
    category: 'Strings',
    difficulty: 'intermediate',
    timeComplexity: 'O(n + m)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'z-algorithm',
    title: 'Z Algorithm',
    description: 'Linear time string matching using Z array',
    category: 'Strings',
    difficulty: 'advanced',
    timeComplexity: 'O(n + m)',
    spaceComplexity: 'O(n + m)'
  },
  {
    id: 'manacher-algorithm',
    title: 'Manacher\'s Algorithm',
    description: 'Linear time algorithm to find all palindromes in string',
    category: 'Strings',
    difficulty: 'advanced',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'string-anagram',
    title: 'Anagram Detection',
    description: 'Check if two strings are anagrams of each other',
    category: 'Strings',
    difficulty: 'beginner',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },

  // Linked Lists
  {
    id: 'linked-list-singly',
    title: 'Singly Linked List',
    description: 'Master basic linked list operations: insert, delete, traverse, reverse',
    category: 'Linked Lists',
    difficulty: 'beginner',
    timeComplexity: 'O(1) - O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'linked-list-doubly',
    title: 'Doubly Linked List',
    description: 'Bidirectional linked list with efficient forward and backward operations',
    category: 'Linked Lists',
    difficulty: 'intermediate',
    timeComplexity: 'O(1) - O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'linked-list-circular',
    title: 'Circular Linked List',
    description: 'Circular linked list where last node points to first node',
    category: 'Linked Lists',
    difficulty: 'intermediate',
    timeComplexity: 'O(1) - O(n)',
    spaceComplexity: 'O(1)'
  },

  // Stacks & Queues
  {
    id: 'stack-operations',
    title: 'Stack Operations',
    description: 'LIFO data structure: push, pop, peek, and practical applications',
    category: 'Stacks & Queues',
    difficulty: 'beginner',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'queue-operations',
    title: 'Queue Operations',
    description: 'FIFO data structure: enqueue, dequeue, and circular queue',
    category: 'Stacks & Queues',
    difficulty: 'beginner',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(n)'
  },

  // Trees
  {
    id: 'binary-tree',
    title: 'Binary Tree Fundamentals',
    description: 'Tree structure with inorder, preorder, postorder traversals and properties',
    category: 'Trees',
    difficulty: 'intermediate',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)'
  },
  {
    id: 'binary-search-tree',
    title: 'Binary Search Tree',
    description: 'Efficient BST operations: insert, delete, search with optimal performance',
    category: 'Trees',
    difficulty: 'intermediate',
    timeComplexity: 'O(log n) - O(n)',
    spaceComplexity: 'O(h)'
  },
  {
    id: 'heap-operations',
    title: 'Heap Data Structure',
    description: 'Min-heap and max-heap operations: insert, delete, heapify',
    category: 'Trees',
    difficulty: 'intermediate',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'tree-inorder-traversal',
    title: 'Inorder Traversal',
    description: 'Process nodes in sorted order for BSTs - essential for retrieving data in ascending sequence',
    category: 'Trees',
    difficulty: 'beginner',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)'
  },
  {
    id: 'tree-preorder-traversal',
    title: 'Preorder Traversal',
    description: 'Create copies of trees and evaluate expressions - process parent before children',
    category: 'Trees',
    difficulty: 'beginner',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)'
  },
  {
    id: 'tree-postorder-traversal',
    title: 'Postorder Traversal',
    description: 'Delete trees safely and calculate directory sizes - process children before parent',
    category: 'Trees',
    difficulty: 'beginner',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)'
  },

  // Graphs
  {
    id: 'graph-dfs',
    title: 'Depth First Search',
    description: 'Graph traversal using DFS with recursive and iterative approaches',
    category: 'Graphs',
    difficulty: 'intermediate',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)'
  },
  {
    id: 'graph-bfs',
    title: 'Breadth First Search',
    description: 'Level-order graph traversal using BFS with queue implementation',
    category: 'Graphs',
    difficulty: 'intermediate',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)'
  },
  {
    id: 'dijkstra-algorithm',
    title: 'Dijkstra\'s Algorithm',
    description: 'Shortest path algorithm for weighted graphs with non-negative edges',
    category: 'Graphs',
    difficulty: 'advanced',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)'
  },
  {
    id: 'bellman-ford',
    title: 'Bellman-Ford Algorithm',
    description: 'Shortest path algorithm that handles negative edge weights',
    category: 'Graphs',
    difficulty: 'advanced',
    timeComplexity: 'O(VE)',
    spaceComplexity: 'O(V)'
  },
  {
    id: 'floyd-warshall',
    title: 'Floyd-Warshall Algorithm',
    description: 'All-pairs shortest path algorithm using dynamic programming',
    category: 'Graphs',
    difficulty: 'advanced',
    timeComplexity: 'O(V³)',
    spaceComplexity: 'O(V²)'
  },
  {
    id: 'kruskal-algorithm',
    title: 'Kruskal\'s Algorithm',
    description: 'Build MST by adding cheapest edges that don\'t create cycles - edge-focused approach',
    category: 'Graphs',
    difficulty: 'intermediate',
    timeComplexity: 'O(E log E)',
    spaceComplexity: 'O(V)'
  },
  {
    id: 'prim-algorithm',
    title: 'Prim\'s Algorithm',
    description: 'Grow MST from starting vertex by adding minimum weight edges - vertex-focused approach',
    category: 'Graphs',
    difficulty: 'intermediate',
    timeComplexity: 'O(E log V)',
    spaceComplexity: 'O(V)'
  },
  {
    id: 'topological-sort',
    title: 'Topological Sort',
    description: 'Linear ordering of vertices in directed acyclic graph',
    category: 'Graphs',
    difficulty: 'intermediate',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)'
  },

  // Sorting
  {
    id: 'bubble-sort',
    title: 'Bubble Sort',
    description: 'Simple comparison-based sorting with adjacent element swapping',
    category: 'Sorting',
    difficulty: 'beginner',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'merge-sort',
    title: 'Merge Sort',
    description: 'Divide and conquer sorting algorithm with guaranteed O(n log n)',
    category: 'Sorting',
    difficulty: 'intermediate',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'quick-sort',
    title: 'Quick Sort',
    description: 'Efficient in-place sorting using pivot partitioning',
    category: 'Sorting',
    difficulty: 'intermediate',
    timeComplexity: 'O(n log n) - O(n²)',
    spaceComplexity: 'O(log n)'
  },
  {
    id: 'heap-sort',
    title: 'Heap Sort',
    description: 'Comparison-based sorting using binary heap data structure',
    category: 'Sorting',
    difficulty: 'intermediate',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'insertion-sort',
    title: 'Insertion Sort',
    description: 'Build sorted array one element at a time - efficient for small or nearly sorted data',
    category: 'Sorting',
    difficulty: 'beginner',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'selection-sort',
    title: 'Selection Sort',
    description: 'Find minimum element and swap to correct position - minimizes number of swaps',
    category: 'Sorting',
    difficulty: 'beginner',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'counting-sort',
    title: 'Counting Sort',
    description: 'Non-comparison integer sorting using counting array',
    category: 'Sorting',
    difficulty: 'intermediate',
    timeComplexity: 'O(n + k)',
    spaceComplexity: 'O(k)'
  },
  {
    id: 'radix-sort',
    title: 'Radix Sort',
    description: 'Non-comparison sorting by processing digits',
    category: 'Sorting',
    difficulty: 'intermediate',
    timeComplexity: 'O(d × (n + k))',
    spaceComplexity: 'O(n + k)'
  },
  {
    id: 'bucket-sort',
    title: 'Bucket Sort',
    description: 'Distribute elements into buckets, sort individually, then concatenate - great for uniform data',
    category: 'Sorting',
    difficulty: 'intermediate',
    timeComplexity: 'O(n + k)',
    spaceComplexity: 'O(n + k)'
  },

  // Searching
  {
    id: 'linear-search',
    title: 'Linear Search',
    description: 'Sequential search through array elements one by one',
    category: 'Searching',
    difficulty: 'beginner',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    description: 'Efficient search in sorted arrays using divide and conquer',
    category: 'Searching',
    difficulty: 'beginner',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'interpolation-search',
    title: 'Interpolation Search',
    description: 'Improved binary search for uniformly distributed data',
    category: 'Searching',
    difficulty: 'intermediate',
    timeComplexity: 'O(log log n)',
    spaceComplexity: 'O(1)'
  },

  // Hashing
  {
    id: 'hash-table',
    title: 'Hash Table',
    description: 'Lightning-fast key-value storage powering databases, caches, and dictionaries',
    category: 'Hashing',
    difficulty: 'intermediate',
    timeComplexity: 'O(1) avg',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'hash-chaining',
    title: 'Separate Chaining',
    description: 'Handle hash collisions by storing multiple values in linked lists at each slot',
    category: 'Hashing',
    difficulty: 'intermediate',
    timeComplexity: 'O(1) avg',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'open-addressing',
    title: 'Open Addressing',
    description: 'Resolve collisions by finding alternative slots using linear, quadratic, or double hashing',
    category: 'Hashing',
    difficulty: 'intermediate',
    timeComplexity: 'O(1) avg',
    spaceComplexity: 'O(n)'
  },

  // Recursion
  {
    id: 'recursion-basics',
    title: 'Recursion Fundamentals',
    description: 'Function calling itself with base and recursive cases',
    category: 'Recursion',
    difficulty: 'intermediate',
    timeComplexity: 'Varies',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'tail-recursion',
    title: 'Tail Recursion',
    description: 'Optimized recursion where recursive call is the last operation',
    category: 'Recursion',
    difficulty: 'intermediate',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'fibonacci',
    title: 'Fibonacci Sequence',
    description: 'Classic recursive problem with optimization techniques',
    category: 'Recursion',
    difficulty: 'beginner',
    timeComplexity: 'O(2^n)',
    spaceComplexity: 'O(n)'
  },

  // Dynamic Programming
  {
    id: 'dp-introduction',
    title: 'DP Introduction',
    description: 'Breaking problems into overlapping subproblems',
    category: 'Dynamic Programming',
    difficulty: 'intermediate',
    timeComplexity: 'Varies',
    spaceComplexity: 'Varies'
  },
  {
    id: 'longest-common-subsequence',
    title: 'Longest Common Subsequence',
    description: 'Finding the longest subsequence common to two sequences',
    category: 'Dynamic Programming',
    difficulty: 'intermediate',
    timeComplexity: 'O(mn)',
    spaceComplexity: 'O(mn)'
  },
  {
    id: 'knapsack-problem',
    title: '0/1 Knapsack Problem',
    description: 'Optimization problem with weight and value constraints',
    category: 'Dynamic Programming',
    difficulty: 'intermediate',
    timeComplexity: 'O(nW)',
    spaceComplexity: 'O(nW)'
  },
  {
    id: 'longest-increasing-subsequence',
    title: 'Longest Increasing Subsequence',
    description: 'Finding the longest strictly increasing subsequence',
    category: 'Dynamic Programming',
    difficulty: 'intermediate',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)'
  },

  // Greedy Algorithms
  {
    id: 'activity-selection',
    title: 'Activity Selection',
    description: 'Selecting maximum number of non-overlapping activities',
    category: 'Greedy Algorithms',
    difficulty: 'intermediate',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'huffman-coding',
    title: 'Huffman Coding',
    description: 'Optimal prefix-free encoding for data compression',
    category: 'Greedy Algorithms',
    difficulty: 'advanced',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'fractional-knapsack',
    title: 'Fractional Knapsack',
    description: 'Greedy approach to knapsack with fractional items',
    category: 'Greedy Algorithms',
    difficulty: 'intermediate',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)'
  },

  // Backtracking
  {
    id: 'n-queens',
    title: 'N-Queens Problem',
    description: 'Place N queens on chessboard without attacking each other',
    category: 'Backtracking',
    difficulty: 'advanced',
    timeComplexity: 'O(N!)',
    spaceComplexity: 'O(N²)'
  },
  {
    id: 'sudoku-solver',
    title: 'Sudoku Solver',
    description: 'Solve 9x9 Sudoku puzzle using backtracking',
    category: 'Backtracking',
    difficulty: 'advanced',
    timeComplexity: 'O(9^(n²))',
    spaceComplexity: 'O(n²)'
  },
  {
    id: 'maze-solver',
    title: 'Maze Solver',
    description: 'Find path through maze using backtracking',
    category: 'Backtracking',
    difficulty: 'intermediate',
    timeComplexity: 'O(4^(n×m))',
    spaceComplexity: 'O(n×m)'
  },

  // Advanced Data Structures
  {
    id: 'trie',
    title: 'Trie (Prefix Tree)',
    description: 'Tree-like data structure for efficient string operations',
    category: 'Advanced Data Structures',
    difficulty: 'intermediate',
    timeComplexity: 'O(m)',
    spaceComplexity: 'O(ALPHABET_SIZE × n × m)'
  },
  {
    id: 'segment-tree',
    title: 'Segment Tree',
    description: 'Tree structure for range queries and updates',
    category: 'Advanced Data Structures',
    difficulty: 'advanced',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'fenwick-tree',
    title: 'Fenwick Tree (BIT)',
    description: 'Binary Indexed Tree for prefix sum queries',
    category: 'Advanced Data Structures',
    difficulty: 'advanced',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'union-find',
    title: 'Union-Find (Disjoint Set)',
    description: 'Data structure for tracking disjoint sets',
    category: 'Advanced Data Structures',
    difficulty: 'intermediate',
    timeComplexity: 'O(α(n))',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'avl-tree',
    title: 'AVL Tree',
    description: 'Strictly height-balanced BST ensuring O(log n) operations through rotations',
    category: 'Advanced Data Structures',
    difficulty: 'advanced',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'red-black-tree',
    title: 'Red-Black Tree',
    description: 'Balanced BST using node colors and rotation rules - used in many standard libraries',
    category: 'Advanced Data Structures',
    difficulty: 'advanced',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'b-tree',
    title: 'B-Tree',
    description: 'Multi-way search tree optimized for disk storage and database indexing',
    category: 'Advanced Data Structures',
    difficulty: 'advanced',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'splay-tree',
    title: 'Splay Tree',
    description: 'Self-optimizing BST that moves frequently accessed nodes to the root',
    category: 'Advanced Data Structures',
    difficulty: 'advanced',
    timeComplexity: 'O(log n) amortized',
    spaceComplexity: 'O(n)'
  },

  // Two Pointers
  {
    id: 'two-sum',
    title: 'Two Sum Problem',
    description: 'Find two numbers that add up to target using two pointers',
    category: 'Two Pointers',
    difficulty: 'beginner',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'three-sum',
    title: 'Three Sum Problem',
    description: 'Find triplets that sum to zero using two pointers technique',
    category: 'Two Pointers',
    difficulty: 'intermediate',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'container-water',
    title: 'Container With Most Water',
    description: 'Find container that holds maximum water using two pointers',
    category: 'Two Pointers',
    difficulty: 'intermediate',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'remove-duplicates',
    title: 'Remove Duplicates',
    description: 'Remove duplicates from sorted array using two pointers',
    category: 'Two Pointers',
    difficulty: 'beginner',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },

  // Sliding Window
  {
    id: 'sliding-window-basics',
    title: 'Sliding Window Technique',
    description: 'Master the sliding window pattern for array and string problems',
    category: 'Sliding Window',
    difficulty: 'intermediate',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'sliding-window-maximum',
    title: 'Sliding Window Maximum',
    description: 'Find maximum in all subarrays of size k using deque optimization',
    category: 'Sliding Window',
    difficulty: 'advanced',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(k)'
  },
  {
    id: 'longest-substring',
    title: 'Longest Substring Problems',
    description: 'Find longest substring without repeating characters and variations',
    category: 'Sliding Window',
    difficulty: 'intermediate',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(min(m,n))'
  },

  // Bit Manipulation
  {
    id: 'bit-basics',
    title: 'Bit Manipulation Basics',
    description: 'Basic bitwise operations: AND, OR, XOR, NOT, shifts',
    category: 'Bit Manipulation',
    difficulty: 'beginner',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'count-set-bits',
    title: 'Count Set Bits',
    description: 'Count number of 1s in binary representation',
    category: 'Bit Manipulation',
    difficulty: 'beginner',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'power-of-two',
    title: 'Power of Two Check',
    description: 'Check if number is power of 2 using bit manipulation',
    category: 'Bit Manipulation',
    difficulty: 'beginner',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'single-number',
    title: 'Single Number',
    description: 'Find single number in array where others appear twice',
    category: 'Bit Manipulation',
    difficulty: 'intermediate',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'bit-subset',
    title: 'Generate All Subsets',
    description: 'Generate all subsets using bit manipulation',
    category: 'Bit Manipulation',
    difficulty: 'intermediate',
    timeComplexity: 'O(2^n)',
    spaceComplexity: 'O(1)'
  },

  // Mathematical Algorithms
  {
    id: 'number-theory-basics',
    title: 'Number Theory Basics',
    description: 'GCD, LCM, prime numbers, and fundamental number theory concepts',
    category: 'Mathematical Algorithms',
    difficulty: 'beginner',
    timeComplexity: 'O(log min(a,b))',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'prime-algorithms',
    title: 'Prime Number Algorithms',
    description: 'Sieve of Eratosthenes, primality testing, and prime factorization',
    category: 'Mathematical Algorithms',
    difficulty: 'intermediate',
    timeComplexity: 'O(n log log n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'fast-exponentiation',
    title: 'Fast Exponentiation',
    description: 'Binary exponentiation and modular arithmetic applications',
    category: 'Mathematical Algorithms',
    difficulty: 'intermediate',
    timeComplexity: 'O(log b)',
    spaceComplexity: 'O(1)'
  }
];