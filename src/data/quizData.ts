export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  hint?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const quizData: Record<string, QuizQuestion[]> = {
  // Array Fundamentals
  'array-basics': [
    {
      id: 'array-1',
      question: 'What is the time complexity of accessing an element in an array by index?',
      options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
      correctAnswer: 0,
      explanation: 'Arrays provide direct access to elements using their index, which takes constant time regardless of array size.',
      hint: 'Think about how you find a specific mailbox when you know its number.',
      difficulty: 'easy'
    },
    {
      id: 'array-2',
      question: 'What is the time complexity of inserting an element at the beginning of an array?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      correctAnswer: 2,
      explanation: 'Inserting at the beginning requires shifting all existing elements, which takes O(n) time.',
      hint: 'Think about what happens to all the other elements when you insert at the front.',
      difficulty: 'medium'
    }
  ],

  // Array Rotation
  'array-rotation': [
    {
      id: 'rotation-1',
      question: 'What is the time complexity of the Juggling Algorithm for array rotation?',
      options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
      correctAnswer: 1,
      explanation: 'The Juggling Algorithm has O(n) time complexity as it moves each element exactly once.',
      hint: 'Each element is moved only once in the juggling algorithm.',
      difficulty: 'medium'
    }
  ],

  // Subarray Problems
  'array-subarray-problems': [
    {
      id: 'subarray-1',
      question: 'What is the time complexity of Kadane\'s algorithm for maximum subarray sum?',
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'],
      correctAnswer: 0,
      explanation: 'Kadane\'s algorithm uses a single pass through the array, making it O(n).',
      hint: 'Kadane\'s algorithm only needs to traverse the array once.',
      difficulty: 'medium'
    }
  ],

  // Palindrome Check
  'string-palindrome': [
    {
      id: 'palindrome-1',
      question: 'What is the time complexity of checking if a string is a palindrome using two pointers?',
      options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
      correctAnswer: 1,
      explanation: 'Two pointers approach requires O(n) time as it compares characters from both ends.',
      hint: 'The algorithm needs to check each character at most once.',
      difficulty: 'easy'
    }
  ],

  // KMP Algorithm
  'string-search-kmp': [
    {
      id: 'kmp-1',
      question: 'What is the time complexity of KMP algorithm for pattern matching?',
      options: ['O(m+n)', 'O(mn)', 'O(m²+n²)', 'O(log(m+n))'],
      correctAnswer: 0,
      explanation: 'KMP algorithm has O(m+n) time complexity where m is pattern length and n is text length.',
      hint: 'KMP uses preprocessing to avoid unnecessary comparisons.',
      difficulty: 'hard'
    }
  ],

  // Rabin-Karp Algorithm
  'rabin-karp': [
    {
      id: 'rk-1',
      question: 'What is the average time complexity of Rabin-Karp algorithm?',
      options: ['O(n+m)', 'O(nm)', 'O(n log m)', 'O(m log n)'],
      correctAnswer: 0,
      explanation: 'Rabin-Karp has O(n+m) average time complexity, but O(nm) worst case due to hash collisions.',
      hint: 'The rolling hash allows for efficient substring comparison.',
      difficulty: 'medium'
    }
  ],

  // Z Algorithm
  'z-algorithm': [
    {
      id: 'z-1',
      question: 'What is the time complexity of Z algorithm?',
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'],
      correctAnswer: 0,
      explanation: 'Z algorithm has linear O(n) time complexity for computing the Z array.',
      hint: 'Z algorithm uses the concept of Z-box to achieve linear time.',
      difficulty: 'hard'
    }
  ],

  // Manacher's Algorithm
  'manacher-algorithm': [
    {
      id: 'manacher-1',
      question: 'What is the time complexity of Manacher\'s algorithm?',
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'],
      correctAnswer: 0,
      explanation: 'Manacher\'s algorithm finds all palindromes in a string in O(n) time.',
      hint: 'Manacher\'s algorithm uses the concept of palindrome centers to achieve linear time.',
      difficulty: 'hard'
    }
  ],

  // Anagram Detection
  'string-anagram': [
    {
      id: 'anagram-1',
      question: 'What is the time complexity of checking if two strings are anagrams using character counting?',
      options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n²)'],
      correctAnswer: 1,
      explanation: 'Character counting approach requires O(n) time to count characters in both strings.',
      hint: 'You need to process each character in both strings once.',
      difficulty: 'easy'
    }
  ],

  // Singly Linked List
  'linked-list-singly': [
    {
      id: 'sll-1',
      question: 'What is the time complexity of inserting a node at the beginning of a singly linked list?',
      options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
      correctAnswer: 0,
      explanation: 'Inserting at the beginning of a linked list is O(1) as it only requires updating the head pointer.',
      hint: 'No need to shift elements like in arrays.',
      difficulty: 'easy'
    }
  ],

  // Doubly Linked List
  'linked-list-doubly': [
    {
      id: 'dll-1',
      question: 'What is the main advantage of doubly linked lists over singly linked lists?',
      options: ['Faster insertion', 'Faster deletion', 'Bidirectional traversal', 'Less memory usage'],
      correctAnswer: 2,
      explanation: 'Doubly linked lists allow traversal in both directions, which is not possible in singly linked lists.',
      hint: 'Think about the additional pointer that doubly linked lists have.',
      difficulty: 'medium'
    }
  ],

  // Circular Linked List
  'linked-list-circular': [
    {
      id: 'cll-1',
      question: 'What is the main characteristic of a circular linked list?',
      options: ['Last node points to first', 'First node points to last', 'All nodes point to null', 'Nodes are arranged in a circle'],
      correctAnswer: 0,
      explanation: 'In a circular linked list, the last node points back to the first node, creating a circular structure.',
      hint: 'Think about the name "circular" - what shape does it suggest?',
      difficulty: 'easy'
    }
  ],

  // Stack Operations
  'stack-operations': [
    {
      id: 'stack-1',
      question: 'What does LIFO stand for in the context of stacks?',
      options: ['Last In, First Out', 'Last In, Final Out', 'Linear In, First Out', 'List In, First Out'],
      correctAnswer: 0,
      explanation: 'LIFO means Last In, First Out - the last element added is the first one to be removed.',
      hint: 'Think about a stack of plates - which plate do you take first?',
      difficulty: 'easy'
    }
  ],

  // Queue Operations
  'queue-operations': [
    {
      id: 'queue-1',
      question: 'What does FIFO stand for in the context of queues?',
      options: ['First In, First Out', 'First In, Final Out', 'Fast In, First Out', 'Fixed In, First Out'],
      correctAnswer: 0,
      explanation: 'FIFO means First In, First Out - the first element added is the first one to be removed.',
      hint: 'Think about a line of people - who gets served first?',
      difficulty: 'easy'
    }
  ],

  // Binary Tree Fundamentals
  'binary-tree': [
    {
      id: 'bt-1',
      question: 'What is the maximum number of nodes in a binary tree of height h?',
      options: ['2^h', '2^(h+1) - 1', 'h^2', '2h'],
      correctAnswer: 1,
      explanation: 'A complete binary tree of height h has 2^(h+1) - 1 nodes, which is the maximum possible.',
      hint: 'Think about how many nodes are at each level: 1, 2, 4, 8, ...',
      difficulty: 'medium'
    }
  ],

  // Binary Search Tree
  'binary-search-tree': [
    {
      id: 'bst-1',
      question: 'What is the time complexity of search in a balanced BST?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      correctAnswer: 1,
      explanation: 'In a balanced BST, each comparison eliminates half the remaining nodes, giving O(log n) time.',
      hint: 'Think about how binary search works in a sorted array.',
      difficulty: 'medium'
    }
  ],

  // Heap Data Structure
  'heap-operations': [
    {
      id: 'heap-1',
      question: 'What is the time complexity of inserting an element into a heap?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      correctAnswer: 1,
      explanation: 'Insertion in a heap requires bubbling up the element to maintain heap property, taking O(log n) time.',
      hint: 'The element may need to bubble up to the root in the worst case.',
      difficulty: 'medium'
    }
  ],

  // Tree Traversals
  'tree-inorder-traversal': [
    {
      id: 'inorder-1',
      question: 'What is the order of traversal in inorder traversal?',
      options: ['Root-Left-Right', 'Left-Root-Right', 'Left-Right-Root', 'Right-Root-Left'],
      correctAnswer: 1,
      explanation: 'Inorder traversal visits nodes in Left-Root-Right order.',
      hint: 'The name "inorder" suggests the root is visited "in" between left and right.',
      difficulty: 'easy'
    }
  ],

  'tree-preorder-traversal': [
    {
      id: 'preorder-1',
      question: 'What is the order of traversal in preorder traversal?',
      options: ['Root-Left-Right', 'Left-Root-Right', 'Left-Right-Root', 'Right-Root-Left'],
      correctAnswer: 0,
      explanation: 'Preorder traversal visits nodes in Root-Left-Right order.',
      hint: 'The name "preorder" suggests the root is visited "pre" (before) the children.',
      difficulty: 'easy'
    }
  ],

  'tree-postorder-traversal': [
    {
      id: 'postorder-1',
      question: 'What is the order of traversal in postorder traversal?',
      options: ['Root-Left-Right', 'Left-Root-Right', 'Left-Right-Root', 'Right-Root-Left'],
      correctAnswer: 2,
      explanation: 'Postorder traversal visits nodes in Left-Right-Root order.',
      hint: 'The name "postorder" suggests the root is visited "post" (after) the children.',
      difficulty: 'easy'
    }
  ],

  // Graph Algorithms
  'graph-dfs': [
    {
      id: 'dfs-1',
      question: 'What is the time complexity of DFS on a graph with V vertices and E edges?',
      options: ['O(V)', 'O(E)', 'O(V + E)', 'O(V × E)'],
      correctAnswer: 2,
      explanation: 'DFS visits each vertex and edge at most once, giving O(V + E) time complexity.',
      hint: 'DFS explores each vertex and each edge exactly once.',
      difficulty: 'medium'
    }
  ],

  'graph-bfs': [
    {
      id: 'bfs-1',
      question: 'What is the time complexity of BFS on a graph with V vertices and E edges?',
      options: ['O(V)', 'O(E)', 'O(V + E)', 'O(V × E)'],
      correctAnswer: 2,
      explanation: 'BFS visits each vertex and edge at most once, giving O(V + E) time complexity.',
      hint: 'BFS explores each vertex and each edge exactly once.',
      difficulty: 'medium'
    }
  ],

  // Dijkstra's Algorithm
  'dijkstra-algorithm': [
    {
      id: 'dijkstra-1',
      question: 'What is the time complexity of Dijkstra\'s algorithm using a binary heap?',
      options: ['O(V²)', 'O((V + E) log V)', 'O(V log V)', 'O(E log V)'],
      correctAnswer: 1,
      explanation: 'Dijkstra\'s algorithm with binary heap has O((V + E) log V) time complexity.',
      hint: 'Each vertex is extracted from the heap once, and each edge may cause a heap update.',
      difficulty: 'hard'
    },
    {
      id: 'dijkstra-2',
      question: 'What is a limitation of Dijkstra\'s algorithm?',
      options: ['Cannot handle negative weights', 'Cannot handle cycles', 'Cannot handle directed graphs', 'Cannot handle weighted graphs'],
      correctAnswer: 0,
      explanation: 'Dijkstra\'s algorithm cannot handle graphs with negative edge weights.',
      hint: 'Think about what happens when a negative edge creates a shorter path.',
      difficulty: 'medium'
    }
  ],

  // Bellman-Ford Algorithm
  'bellman-ford': [
    {
      id: 'bellman-1',
      question: 'What is the time complexity of Bellman-Ford algorithm?',
      options: ['O(V)', 'O(E)', 'O(VE)', 'O(V²)'],
      correctAnswer: 2,
      explanation: 'Bellman-Ford algorithm has O(VE) time complexity as it relaxes all edges V-1 times.',
      hint: 'The algorithm performs V-1 iterations, relaxing all E edges in each iteration.',
      difficulty: 'hard'
    },
    {
      id: 'bellman-2',
      question: 'What is the main advantage of Bellman-Ford over Dijkstra\'s algorithm?',
      options: ['Faster execution', 'Can handle negative weights', 'Uses less memory', 'Works on all graph types'],
      correctAnswer: 1,
      explanation: 'Bellman-Ford can handle graphs with negative edge weights, unlike Dijkstra\'s algorithm.',
      hint: 'Bellman-Ford can detect negative cycles and handle negative weights.',
      difficulty: 'medium'
    }
  ],

  // Floyd-Warshall Algorithm
  'floyd-warshall': [
    {
      id: 'floyd-1',
      question: 'What is the time complexity of Floyd-Warshall algorithm?',
      options: ['O(V²)', 'O(V³)', 'O(VE)', 'O(V⁴)'],
      correctAnswer: 1,
      explanation: 'Floyd-Warshall algorithm has O(V³) time complexity as it uses three nested loops.',
      hint: 'The algorithm uses three nested loops, each iterating V times.',
      difficulty: 'hard'
    },
    {
      id: 'floyd-2',
      question: 'What does Floyd-Warshall algorithm compute?',
      options: ['Single source shortest paths', 'All pairs shortest paths', 'Minimum spanning tree', 'Strongly connected components'],
      correctAnswer: 1,
      explanation: 'Floyd-Warshall computes shortest paths between all pairs of vertices.',
      hint: 'The algorithm fills a V×V matrix with shortest path distances.',
      difficulty: 'medium'
    }
  ],

  // Kruskal's Algorithm
  'kruskal-algorithm': [
    {
      id: 'kruskal-1',
      question: 'What is the time complexity of Kruskal\'s algorithm?',
      options: ['O(E)', 'O(E log E)', 'O(V log V)', 'O(E log V)'],
      correctAnswer: 1,
      explanation: 'Kruskal\'s algorithm has O(E log E) time complexity due to sorting the edges.',
      hint: 'The algorithm sorts all edges, which takes O(E log E) time.',
      difficulty: 'medium'
    },
    {
      id: 'kruskal-2',
      question: 'What data structure is typically used in Kruskal\'s algorithm to detect cycles?',
      options: ['Stack', 'Queue', 'Union-Find', 'Binary Search Tree'],
      correctAnswer: 2,
      explanation: 'Union-Find data structure is used to efficiently detect cycles when adding edges.',
      hint: 'Union-Find helps determine if adding an edge would create a cycle.',
      difficulty: 'medium'
    }
  ],

  // Prim's Algorithm
  'prim-algorithm': [
    {
      id: 'prim-1',
      question: 'What is the time complexity of Prim\'s algorithm using a binary heap?',
      options: ['O(V²)', 'O(E log V)', 'O(V log V)', 'O(E log E)'],
      correctAnswer: 1,
      explanation: 'Prim\'s algorithm with binary heap has O(E log V) time complexity.',
      hint: 'Each edge may cause a heap update, and each vertex is extracted once.',
      difficulty: 'medium'
    },
    {
      id: 'prim-2',
      question: 'What is the main difference between Prim\'s and Kruskal\'s algorithms?',
      options: ['Prim\'s works on directed graphs', 'Prim\'s grows one tree, Kruskal\'s grows multiple trees', 'Prim\'s cannot handle negative weights', 'Prim\'s is faster'],
      correctAnswer: 1,
      explanation: 'Prim\'s grows a single tree from a starting vertex, while Kruskal\'s grows multiple trees and merges them.',
      hint: 'Think about how each algorithm builds the minimum spanning tree.',
      difficulty: 'medium'
    }
  ],

  // Topological Sort
  'topological-sort': [
    {
      id: 'topo-1',
      question: 'What is the time complexity of topological sort using DFS?',
      options: ['O(V)', 'O(E)', 'O(V + E)', 'O(V × E)'],
      correctAnswer: 2,
      explanation: 'Topological sort using DFS has O(V + E) time complexity.',
      hint: 'The algorithm visits each vertex and edge exactly once.',
      difficulty: 'medium'
    },
    {
      id: 'topo-2',
      question: 'What type of graph is required for topological sort?',
      options: ['Undirected graph', 'Directed acyclic graph (DAG)', 'Weighted graph', 'Complete graph'],
      correctAnswer: 1,
      explanation: 'Topological sort requires a directed acyclic graph (DAG) to be possible.',
      hint: 'Cycles would create a circular dependency that cannot be topologically sorted.',
      difficulty: 'medium'
    }
  ],

  // Sorting Algorithms
  'bubble-sort': [
    {
      id: 'bubble-1',
      question: 'What is the worst-case time complexity of bubble sort?',
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'],
      correctAnswer: 2,
      explanation: 'Bubble sort compares each element with every other element, resulting in O(n²) comparisons in the worst case.',
      hint: 'Think about how many comparisons are needed when the array is sorted in reverse order.',
      difficulty: 'easy'
    }
  ],

  'merge-sort': [
    {
      id: 'merge-1',
      question: 'What is the time complexity of merge sort?',
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'],
      correctAnswer: 1,
      explanation: 'Merge sort has guaranteed O(n log n) time complexity in all cases due to its divide-and-conquer approach.',
      hint: 'Merge sort divides the problem in half at each step and merges in linear time.',
      difficulty: 'medium'
    }
  ],

  'quick-sort': [
    {
      id: 'quick-1',
      question: 'What is the average time complexity of quick sort?',
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'],
      correctAnswer: 1,
      explanation: 'Quick sort has O(n log n) average time complexity when the pivot divides the array roughly in half.',
      hint: 'Good pivot selection leads to balanced partitions.',
      difficulty: 'medium'
    }
  ],

  'heap-sort': [
    {
      id: 'heap-1',
      question: 'What is the time complexity of heap sort?',
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'],
      correctAnswer: 1,
      explanation: 'Heap sort has O(n log n) time complexity as it builds a heap and extracts elements.',
      hint: 'Building heap takes O(n) and each extraction takes O(log n).',
      difficulty: 'medium'
    }
  ],

  'insertion-sort': [
    {
      id: 'insertion-1',
      question: 'What is the time complexity of insertion sort?',
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'],
      correctAnswer: 2,
      explanation: 'Insertion sort has O(n²) time complexity as it may need to shift elements for each insertion.',
      hint: 'In the worst case, each insertion may require shifting all previous elements.',
      difficulty: 'easy'
    }
  ],

  'selection-sort': [
    {
      id: 'selection-1',
      question: 'What is the time complexity of selection sort?',
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'],
      correctAnswer: 2,
      explanation: 'Selection sort has O(n²) time complexity as it finds the minimum element in each pass.',
      hint: 'Each pass requires scanning the remaining unsorted portion.',
      difficulty: 'easy'
    }
  ],

  'counting-sort': [
    {
      id: 'counting-1',
      question: 'What is the time complexity of counting sort?',
      options: ['O(n)', 'O(n + k)', 'O(n log n)', 'O(n²)'],
      correctAnswer: 1,
      explanation: 'Counting sort has O(n + k) time complexity where k is the range of input values.',
      hint: 'The algorithm counts occurrences and then reconstructs the sorted array.',
      difficulty: 'medium'
    }
  ],

  'radix-sort': [
    {
      id: 'radix-1',
      question: 'What is the time complexity of radix sort?',
      options: ['O(n)', 'O(d × (n + k))', 'O(n log n)', 'O(n²)'],
      correctAnswer: 1,
      explanation: 'Radix sort has O(d × (n + k)) time complexity where d is the number of digits and k is the base.',
      hint: 'The algorithm processes each digit position separately.',
      difficulty: 'medium'
    }
  ],

  'bucket-sort': [
    {
      id: 'bucket-1',
      question: 'What is the time complexity of bucket sort?',
      options: ['O(n)', 'O(n + k)', 'O(n log n)', 'O(n²)'],
      correctAnswer: 1,
      explanation: 'Bucket sort has O(n + k) time complexity where k is the number of buckets.',
      hint: 'The algorithm distributes elements into buckets and then sorts each bucket.',
      difficulty: 'medium'
    }
  ],

  // Searching Algorithms
  'linear-search': [
    {
      id: 'linear-1',
      question: 'What is the time complexity of linear search?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      correctAnswer: 2,
      explanation: 'Linear search examines each element sequentially, taking O(n) time in the worst case.',
      hint: 'Linear search checks elements one by one until it finds the target.',
      difficulty: 'easy'
    }
  ],

  'binary-search': [
    {
      id: 'binary-1',
      question: 'What is a prerequisite for binary search to work?',
      options: ['Array must be large', 'Array must be sorted', 'Array must contain unique elements', 'Array must be numeric'],
      correctAnswer: 1,
      explanation: 'Binary search only works on sorted arrays because it relies on the ordering to eliminate half the search space each time.',
      hint: 'Think about how you find a word in a dictionary.',
      difficulty: 'easy'
    }
  ],

  'interpolation-search': [
    {
      id: 'interpolation-1',
      question: 'What is the time complexity of interpolation search?',
      options: ['O(1)', 'O(log log n)', 'O(log n)', 'O(n)'],
      correctAnswer: 1,
      explanation: 'Interpolation search has O(log log n) time complexity for uniformly distributed data.',
      hint: 'This algorithm uses interpolation to guess the position of the target.',
      difficulty: 'medium'
    }
  ],

  // Hashing
  'hash-table': [
    {
      id: 'hash-1',
      question: 'What is the average time complexity of search in a hash table?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      correctAnswer: 0,
      explanation: 'Hash tables provide O(1) average time complexity for search, insert, and delete operations.',
      hint: 'Hash functions provide direct access to elements.',
      difficulty: 'medium'
    }
  ],

  'hash-chaining': [
    {
      id: 'chaining-1',
      question: 'What is separate chaining used for in hash tables?',
      options: ['Collision resolution', 'Hash function design', 'Table resizing', 'Memory optimization'],
      correctAnswer: 0,
      explanation: 'Separate chaining is a collision resolution technique that uses linked lists to handle hash collisions.',
      hint: 'When two keys hash to the same location, they are stored in a linked list.',
      difficulty: 'medium'
    }
  ],

  'open-addressing': [
    {
      id: 'open-1',
      question: 'What is open addressing used for in hash tables?',
      options: ['Collision resolution', 'Hash function design', 'Table resizing', 'Memory optimization'],
      correctAnswer: 0,
      explanation: 'Open addressing is a collision resolution technique that finds alternative locations within the table.',
      hint: 'Instead of using linked lists, it probes for the next available slot.',
      difficulty: 'medium'
    }
  ],

  // Recursion
  'recursion-basics': [
    {
      id: 'recursion-1',
      question: 'What are the two essential components of a recursive function?',
      options: ['Base case and recursive case', 'Input and output', 'Loop and condition', 'Variable and function'],
      correctAnswer: 0,
      explanation: 'A recursive function must have a base case (stopping condition) and a recursive case (calling itself).',
      hint: 'Think about what stops the recursion and what makes it continue.',
      difficulty: 'easy'
    }
  ],

  'tail-recursion': [
    {
      id: 'tail-1',
      question: 'What is the main advantage of tail recursion?',
      options: ['Faster execution', 'Space optimization', 'Easier debugging', 'Better readability'],
      correctAnswer: 1,
      explanation: 'Tail recursion can be optimized by the compiler to use constant space instead of linear space.',
      hint: 'The recursive call is the last operation, so the stack frame can be reused.',
      difficulty: 'medium'
    }
  ],

  'fibonacci': [
    {
      id: 'fib-1',
      question: 'What is the time complexity of naive recursive Fibonacci?',
      options: ['O(n)', 'O(log n)', 'O(2ⁿ)', 'O(n²)'],
      correctAnswer: 2,
      explanation: 'Naive recursive Fibonacci has exponential time complexity due to repeated calculations.',
      hint: 'Each call makes two recursive calls, leading to exponential growth.',
      difficulty: 'medium'
    }
  ],

  // Dynamic Programming
  'dp-introduction': [
    {
      id: 'dp-1',
      question: 'What is the main idea behind dynamic programming?',
      options: ['Breaking problems into smaller subproblems', 'Using recursion', 'Optimizing loops', 'Using hash tables'],
      correctAnswer: 0,
      explanation: 'Dynamic programming breaks complex problems into smaller, overlapping subproblems and solves each only once.',
      hint: 'Think about the word "dynamic" - it suggests building solutions step by step.',
      difficulty: 'medium'
    }
  ],

  'longest-common-subsequence': [
    {
      id: 'lcs-1',
      question: 'What is the time complexity of the LCS algorithm?',
      options: ['O(m+n)', 'O(mn)', 'O(m²+n²)', 'O(2^(m+n))'],
      correctAnswer: 1,
      explanation: 'The LCS algorithm has O(mn) time complexity where m and n are the lengths of the two sequences.',
      hint: 'The algorithm fills a 2D table of size m×n.',
      difficulty: 'medium'
    }
  ],

  'knapsack-problem': [
    {
      id: 'knapsack-1',
      question: 'What is the time complexity of the 0/1 knapsack problem?',
      options: ['O(n)', 'O(nW)', 'O(n log W)', 'O(2ⁿ)'],
      correctAnswer: 1,
      explanation: 'The 0/1 knapsack problem has O(nW) time complexity where n is the number of items and W is the capacity.',
      hint: 'The algorithm fills a 2D table of size n×W.',
      difficulty: 'medium'
    }
  ],

  'longest-increasing-subsequence': [
    {
      id: 'lis-1',
      question: 'What is the time complexity of the LIS algorithm?',
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'],
      correctAnswer: 1,
      explanation: 'The LIS algorithm has O(n log n) time complexity using binary search optimization.',
      hint: 'The algorithm maintains a sorted array and uses binary search for each element.',
      difficulty: 'medium'
    }
  ],

  // Greedy Algorithms
  'activity-selection': [
    {
      id: 'activity-1',
      question: 'What is the time complexity of the activity selection algorithm?',
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'],
      correctAnswer: 1,
      explanation: 'Activity selection requires sorting activities by finish time, giving O(n log n) time complexity.',
      hint: 'The algorithm needs to sort activities before processing them.',
      difficulty: 'medium'
    }
  ],

  'huffman-coding': [
    {
      id: 'huffman-1',
      question: 'What is the time complexity of Huffman coding?',
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'],
      correctAnswer: 1,
      explanation: 'Huffman coding has O(n log n) time complexity due to the priority queue operations.',
      hint: 'The algorithm repeatedly extracts the two minimum elements from a priority queue.',
      difficulty: 'hard'
    }
  ],

  'fractional-knapsack': [
    {
      id: 'fractional-1',
      question: 'What is the time complexity of the fractional knapsack problem?',
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'],
      correctAnswer: 1,
      explanation: 'The fractional knapsack problem requires sorting items by value/weight ratio, giving O(n log n) time complexity.',
      hint: 'The greedy approach sorts items before selecting them.',
      difficulty: 'medium'
    }
  ],

  // Backtracking
  'n-queens': [
    {
      id: 'nqueens-1',
      question: 'What is the time complexity of the N-Queens problem?',
      options: ['O(n)', 'O(n²)', 'O(n!)', 'O(2ⁿ)'],
      correctAnswer: 2,
      explanation: 'The N-Queens problem has O(n!) time complexity as it explores all possible queen placements.',
      hint: 'Each queen can be placed in n positions, and there are n queens.',
      difficulty: 'hard'
    }
  ],

  'sudoku-solver': [
    {
      id: 'sudoku-1',
      question: 'What is the time complexity of solving a Sudoku puzzle?',
      options: ['O(9^n)', 'O(9^(n²))', 'O(n²)', 'O(2ⁿ)'],
      correctAnswer: 1,
      explanation: 'Solving Sudoku has O(9^(n²)) time complexity where n is the grid size (typically 9).',
      hint: 'Each empty cell can be filled with 9 possible digits.',
      difficulty: 'hard'
    }
  ],

  'maze-solver': [
    {
      id: 'maze-1',
      question: 'What is the time complexity of solving a maze using backtracking?',
      options: ['O(n×m)', 'O(4^(n×m))', 'O(n²×m²)', 'O(2^(n×m))'],
      correctAnswer: 1,
      explanation: 'Maze solving has O(4^(n×m)) time complexity as each cell can be visited from 4 directions.',
      hint: 'At each cell, the algorithm can move in 4 directions (up, down, left, right).',
      difficulty: 'medium'
    }
  ],

  // Advanced Data Structures
  'trie': [
    {
      id: 'trie-1',
      question: 'What is the time complexity of searching for a string of length m in a trie?',
      options: ['O(1)', 'O(m)', 'O(log m)', 'O(m²)'],
      correctAnswer: 1,
      explanation: 'Searching in a trie takes O(m) time where m is the length of the string being searched.',
      hint: 'The search follows the path corresponding to each character in the string.',
      difficulty: 'medium'
    }
  ],

  'segment-tree': [
    {
      id: 'segment-1',
      question: 'What is the time complexity of range queries in a segment tree?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      correctAnswer: 1,
      explanation: 'Range queries in a segment tree take O(log n) time as the tree height is logarithmic.',
      hint: 'The segment tree divides the range into logarithmic number of segments.',
      difficulty: 'hard'
    }
  ],

  'fenwick-tree': [
    {
      id: 'fenwick-1',
      question: 'What is the time complexity of prefix sum queries in a Fenwick tree?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      correctAnswer: 1,
      explanation: 'Prefix sum queries in a Fenwick tree take O(log n) time.',
      hint: 'The algorithm follows the binary representation of the index.',
      difficulty: 'hard'
    }
  ],

  'union-find': [
    {
      id: 'union-1',
      question: 'What is the time complexity of union and find operations in union-find?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      correctAnswer: 1,
      explanation: 'With path compression and union by rank, union and find operations take O(α(n)) time.',
      hint: 'α(n) is the inverse Ackermann function, which grows very slowly.',
      difficulty: 'medium'
    }
  ],

  'avl-tree': [
    {
      id: 'avl-1',
      question: 'What is the time complexity of operations in an AVL tree?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      correctAnswer: 1,
      explanation: 'AVL tree operations take O(log n) time due to the height balancing property.',
      hint: 'The tree maintains a balance factor to ensure logarithmic height.',
      difficulty: 'hard'
    }
  ],

  'red-black-tree': [
    {
      id: 'rbt-1',
      question: 'What is the time complexity of operations in a red-black tree?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      correctAnswer: 1,
      explanation: 'Red-black tree operations take O(log n) time due to the color-based balancing rules.',
      hint: 'The tree uses red and black colors to maintain balance.',
      difficulty: 'hard'
    }
  ],

  'b-tree': [
    {
      id: 'btree-1',
      question: 'What is the time complexity of operations in a B-tree?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      correctAnswer: 1,
      explanation: 'B-tree operations take O(log n) time as the tree maintains a minimum degree constraint.',
      hint: 'B-trees are designed for disk-based storage systems.',
      difficulty: 'hard'
    }
  ],

  'splay-tree': [
    {
      id: 'splay-1',
      question: 'What is the amortized time complexity of operations in a splay tree?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      correctAnswer: 1,
      explanation: 'Splay tree operations have O(log n) amortized time complexity due to the splaying operation.',
      hint: 'The splaying operation moves accessed nodes to the root.',
      difficulty: 'hard'
    }
  ],

  // Two Pointers
  'two-sum': [
    {
      id: 'twoptr-1',
      question: 'What is the time complexity of the two-pointer approach for finding two numbers that sum to target?',
      options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n²)'],
      correctAnswer: 1,
      explanation: 'The two-pointer approach requires O(n) time as it traverses the array once with two pointers.',
      hint: 'Each pointer moves at most n times.',
      difficulty: 'medium'
    }
  ],

  'three-sum': [
    {
      id: 'threesum-1',
      question: 'What is the time complexity of the three sum problem using two pointers?',
      options: ['O(n)', 'O(n²)', 'O(n³)', 'O(2ⁿ)'],
      correctAnswer: 1,
      explanation: 'The three sum problem has O(n²) time complexity using two pointers with one outer loop.',
      hint: 'One pointer is fixed while two pointers move in the inner loop.',
      difficulty: 'medium'
    }
  ],

  'container-water': [
    {
      id: 'container-1',
      question: 'What is the time complexity of the container with most water problem?',
      options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n²)'],
      correctAnswer: 1,
      explanation: 'The container with most water problem has O(n) time complexity using two pointers.',
      hint: 'The algorithm moves the pointer with the smaller height.',
      difficulty: 'medium'
    }
  ],

  'remove-duplicates': [
    {
      id: 'duplicates-1',
      question: 'What is the time complexity of removing duplicates from a sorted array?',
      options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n²)'],
      correctAnswer: 1,
      explanation: 'Removing duplicates from a sorted array takes O(n) time using two pointers.',
      hint: 'One pointer tracks the position to write, another scans for unique elements.',
      difficulty: 'easy'
    }
  ],

  // Sliding Window
  'sliding-window-basics': [
    {
      id: 'sliding-1',
      question: 'What is the time complexity of the sliding window technique?',
      options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n²)'],
      correctAnswer: 1,
      explanation: 'The sliding window technique typically has O(n) time complexity as each element is processed at most twice.',
      hint: 'Each element enters and leaves the window at most once.',
      difficulty: 'medium'
    }
  ],

  'sliding-window-maximum': [
    {
      id: 'swmax-1',
      question: 'What is the time complexity of finding maximum in sliding window using deque?',
      options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n²)'],
      correctAnswer: 1,
      explanation: 'Using a deque, the sliding window maximum problem has O(n) time complexity.',
      hint: 'Each element is pushed and popped at most once from the deque.',
      difficulty: 'hard'
    }
  ],

  'longest-substring': [
    {
      id: 'substring-1',
      question: 'What is the time complexity of finding longest substring without repeating characters?',
      options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n²)'],
      correctAnswer: 1,
      explanation: 'Finding the longest substring without repeating characters has O(n) time complexity using sliding window.',
      hint: 'Each character is processed at most twice (entering and leaving the window).',
      difficulty: 'medium'
    }
  ],

  // Bit Manipulation
  'bit-basics': [
    {
      id: 'bit-1',
      question: 'What is the result of 5 & 3?',
      options: ['1', '2', '3', '8'],
      correctAnswer: 0,
      explanation: '5 & 3 = 101 & 011 = 001 = 1 in binary.',
      hint: 'Convert both numbers to binary and perform bitwise AND.',
      difficulty: 'easy'
    }
  ],

  'count-set-bits': [
    {
      id: 'count-1',
      question: 'What is the time complexity of counting set bits using Brian Kernighan\'s algorithm?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      correctAnswer: 1,
      explanation: 'Brian Kernighan\'s algorithm has O(log n) time complexity as it removes one set bit in each iteration.',
      hint: 'The algorithm uses n & (n-1) to remove the least significant set bit.',
      difficulty: 'medium'
    }
  ],

  'power-of-two': [
    {
      id: 'power-1',
      question: 'How can you check if a number is a power of 2 using bit manipulation?',
      options: ['n & (n-1) == 0', 'n | (n-1) == 0', 'n ^ (n-1) == 0', 'n << 1 == 0'],
      correctAnswer: 0,
      explanation: 'A number is a power of 2 if and only if n & (n-1) == 0 and n > 0.',
      hint: 'Powers of 2 have exactly one set bit in their binary representation.',
      difficulty: 'easy'
    }
  ],

  'single-number': [
    {
      id: 'single-1',
      question: 'What is the time complexity of finding the single number using XOR?',
      options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n²)'],
      correctAnswer: 1,
      explanation: 'Finding the single number using XOR has O(n) time complexity as it requires one pass through the array.',
      hint: 'XOR has the property that a ^ a = 0 and a ^ 0 = a.',
      difficulty: 'medium'
    }
  ],

  'bit-subset': [
    {
      id: 'subset-1',
      question: 'What is the time complexity of generating all subsets using bit manipulation?',
      options: ['O(n)', 'O(2ⁿ)', 'O(n²)', 'O(n!)'],
      correctAnswer: 1,
      explanation: 'Generating all subsets using bit manipulation has O(2ⁿ) time complexity as there are 2ⁿ possible subsets.',
      hint: 'Each bit in the binary representation represents whether an element is included.',
      difficulty: 'medium'
    }
  ],

  // Mathematical Algorithms
  'number-theory-basics': [
    {
      id: 'gcd-1',
      question: 'What is the time complexity of the Euclidean algorithm for finding GCD?',
      options: ['O(1)', 'O(log min(a,b))', 'O(min(a,b))', 'O(a×b)'],
      correctAnswer: 1,
      explanation: 'The Euclidean algorithm has O(log min(a,b)) time complexity.',
      hint: 'The algorithm reduces the problem size significantly in each step.',
      difficulty: 'medium'
    }
  ],

  'prime-algorithms': [
    {
      id: 'prime-1',
      question: 'What is the time complexity of the Sieve of Eratosthenes?',
      options: ['O(n)', 'O(n log log n)', 'O(n log n)', 'O(n²)'],
      correctAnswer: 1,
      explanation: 'The Sieve of Eratosthenes has O(n log log n) time complexity.',
      hint: 'The algorithm marks multiples of each prime number.',
      difficulty: 'medium'
    }
  ],

  'fast-exponentiation': [
    {
      id: 'exp-1',
      question: 'What is the time complexity of binary exponentiation?',
      options: ['O(1)', 'O(log b)', 'O(b)', 'O(b²)'],
      correctAnswer: 1,
      explanation: 'Binary exponentiation has O(log b) time complexity where b is the exponent.',
      hint: 'The algorithm uses the binary representation of the exponent to reduce multiplications.',
      difficulty: 'medium'
    }
  ]
};

export const getQuizQuestions = (topicId: string): QuizQuestion[] => {
  return quizData[topicId] || [];
};
