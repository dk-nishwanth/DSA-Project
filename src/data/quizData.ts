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
    },
    {
      id: 'array-3',
      question: 'Which operation is typically O(1) on a dynamic array (amortized)?',
      options: ['Insert at end (push)', 'Insert at beginning (unshift)', 'Insert in middle (splice)', 'Linear search'],
      correctAnswer: 0,
      explanation: 'Appending to the end is amortized O(1) because occasional resizes are spread across many inserts.',
      hint: 'Consider how often resizing happens relative to pushes.',
      difficulty: 'easy'
    },
    {
      id: 'array-4',
      question: 'Why do array middle insertions/deletions cost O(n)?',
      options: ['Indexing is slow', 'Requires shifting elements', 'Needs resorting', 'Memory fragmentation'],
      correctAnswer: 1,
      explanation: 'Elements after the index must be shifted to maintain contiguity.',
      hint: 'Think about keeping elements in contiguous memory.',
      difficulty: 'medium'
    },
    {
      id: 'array-5',
      question: 'What best describes cache locality benefits for arrays?',
      options: ['Data is randomly scattered', 'Contiguous memory improves CPU cache hits', 'Arrays use linked pointers', 'Caches avoid contiguous memory'],
      correctAnswer: 1,
      explanation: 'Contiguous memory makes prefetching effective and improves cache hit rates for sequential access.',
      hint: 'CPUs read data in cache lines, not single integers.',
      difficulty: 'hard'
    },
    {
      id: 'array-6',
      question: 'What happens during dynamic array resizing?',
      options: ['Array shrinks to fit', 'Elements are copied to a larger buffer', 'No copying is needed', 'Only metadata changes'],
      correctAnswer: 1,
      explanation: 'When capacity is exhausted, a larger buffer is allocated and existing elements are copied over.',
      hint: 'Consider how size and capacity differ.',
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
    },
    {
      id: 'rotation-2',
      question: 'What is the space complexity of the Reversal Algorithm for rotation?',
      options: ['O(1)', 'O(k)', 'O(n)', 'O(n log n)'],
      correctAnswer: 0,
      explanation: 'The Reversal Algorithm rotates in-place requiring only constant extra space.',
      hint: 'Think about whether an auxiliary array is required.',
      difficulty: 'easy'
    },
    {
      id: 'rotation-3',
      question: 'Why do we use k % n in rotation algorithms?',
      options: ['To avoid negative indices', 'To limit rotations within array length', 'To sort the array', 'To reduce time complexity'],
      correctAnswer: 1,
      explanation: 'Rotating by n positions returns the original array; k % n normalizes rotations larger than n.',
      hint: 'Consider rotating n times.',
      difficulty: 'easy'
    },
    {
      id: 'rotation-4',
      question: 'Which statement is true about the Block Swap algorithm?',
      options: ['Uses extra O(n) memory', 'Performs recursive block swapping until sizes equal', 'Has O(n log n) time', 'Only works when k divides n'],
      correctAnswer: 1,
      explanation: 'Block Swap swaps blocks of unequal size until they match, achieving rotation in O(n) time, O(1) space.',
      hint: 'Blocks A and B are swapped iteratively.',
      difficulty: 'hard'
    },
    {
      id: 'rotation-5',
      question: 'Right rotation by k positions is equivalent to what left rotation?',
      options: ['Left by k', 'Left by n-k', 'Left by k/2', 'Left by 2k'],
      correctAnswer: 1,
      explanation: 'Right rotate k equals left rotate (n-k).',
      hint: 'Think circularly.',
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
    },
    {
      id: 'subarray-2',
      question: 'Which technique efficiently finds a subarray with a given sum in arrays with negative numbers?',
      options: ['Sliding window', 'Prefix sum with hash map', 'Two pointers', 'Binary search'],
      correctAnswer: 1,
      explanation: 'Prefix sums with a hash map work with negative numbers, unlike the basic sliding window.',
      hint: 'Sliding window assumes non-negative increments.',
      difficulty: 'hard'
    },
    {
      id: 'subarray-3',
      question: 'For fixed-size window problems (e.g., max sum of k elements), which approach is optimal?',
      options: ['Nested loops', 'Divide and conquer', 'Sliding window', 'Greedy'],
      correctAnswer: 2,
      explanation: 'Sliding window maintains the sum in O(1) per step, yielding O(n) total.',
      hint: 'Re-use previous window sum.',
      difficulty: 'easy'
    },
    {
      id: 'subarray-4',
      question: 'What does Kadane\'s algorithm decide at each index i?',
      options: ['Start new or extend current subarray', 'Sort the prefix', 'Choose pivot for partition', 'Compute prefix GCD'],
      correctAnswer: 0,
      explanation: 'It picks max(arr[i], maxEndingHere + arr[i]) to either restart or extend.',
      hint: 'Compare including vs restarting.',
      difficulty: 'medium'
    },
    {
      id: 'subarray-5',
      question: 'What is the space complexity of the basic Kadane\'s algorithm?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      correctAnswer: 0,
      explanation: 'Kadane\'s uses constant extra space for running totals.',
      hint: 'No auxiliary arrays needed.',
      difficulty: 'easy'
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
    },
    {
      id: 'palindrome-2',
      question: 'Which preprocessing is common before palindrome checking in phrases?',
      options: ['Convert to uppercase', 'Remove non-alphanumeric and lowercase', 'Sort characters', 'Reverse string'],
      correctAnswer: 1,
      explanation: 'Removing non-alphanumeric characters and lowercasing normalizes input for correct comparisons.',
      hint: 'Focus on letters and digits only.',
      difficulty: 'easy'
    },
    {
      id: 'palindrome-3',
      question: 'What is the space complexity of the iterative two-pointer palindrome check?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      correctAnswer: 0,
      explanation: 'Only constant extra variables for indices are used.',
      hint: 'No auxiliary arrays are created.',
      difficulty: 'medium'
    },
    {
      id: 'palindrome-4',
      question: 'Why is the recursive palindrome check O(n) space?',
      options: ['Stores a copy of string', 'Uses call stack with depth n/2', 'Creates a hash map', 'Allocates a DP table'],
      correctAnswer: 1,
      explanation: 'Each recursive call consumes stack space, leading to O(n) in worst case.',
      hint: 'Consider how deep recursion goes.',
      difficulty: 'medium'
    },
    {
      id: 'palindrome-5',
      question: 'The longest palindromic substring problem can be solved optimally by which algorithm?',
      options: ['KMP', 'Manacher\'s', 'Rabin-Karp', 'Z Algorithm'],
      correctAnswer: 1,
      explanation: 'Manacher\'s algorithm finds longest palindromic substring in linear time.',
      hint: 'It preprocesses with separators.',
      difficulty: 'hard'
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
    },
    {
      id: 'kmp-2',
      question: 'What does the LPS array store?',
      options: ['Last partial sequence', 'Longest proper prefix which is also a suffix', 'Longest pattern suffix', 'Left pointer shift values'],
      correctAnswer: 1,
      explanation: 'LPS[i] equals the length of the longest proper prefix of pattern that is also a suffix ending at i.',
      hint: 'Prefix equals suffix.',
      difficulty: 'medium'
    },
    {
      id: 'kmp-3',
      question: 'When a mismatch happens at P[j] vs T[i], which pointer moves in KMP?',
      options: ['i only', 'j only', 'both i and j', 'neither'],
      correctAnswer: 1,
      explanation: 'j is updated to lps[j-1], i stays to avoid re-reading text.',
      hint: 'No backtracking in text.',
      difficulty: 'medium'
    },
    {
      id: 'kmp-4',
      question: 'What is the time to build the LPS array?',
      options: ['O(1)', 'O(m)', 'O(n)', 'O(m+n)'],
      correctAnswer: 1,
      explanation: 'LPS is built in linear time in the pattern length.',
      hint: 'Single pass over the pattern.',
      difficulty: 'easy'
    },
    {
      id: 'kmp-5',
      question: 'Why does KMP never move the text pointer i backward?',
      options: ['It would miss matches', 'It uses LPS to reuse previous work', 'It sorts the text', 'It hashes the text'],
      correctAnswer: 1,
      explanation: 'By reusing partial match info from LPS, KMP can keep i monotonic.',
      hint: 'Reuse prior comparisons.',
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
    },
    {
      id: 'rk-2',
      question: 'Why do we verify characters when hashes match?',
      options: ['To speed up', 'To handle collisions', 'To reduce memory', 'To normalize text'],
      correctAnswer: 1,
      explanation: 'Different substrings may share the same hash; verification prevents false positives.',
      hint: 'Hash collisions.',
      difficulty: 'easy'
    },
    {
      id: 'rk-3',
      question: 'What is updated during rolling hash when shifting the window?',
      options: ['Remove left char, add right char', 'Rehash entire window', 'Sort window', 'Reverse window'],
      correctAnswer: 0,
      explanation: 'Rolling hash updates in O(1) by subtracting the left char contribution and adding the right char.',
      hint: 'Constant-time update.',
      difficulty: 'medium'
    },
    {
      id: 'rk-4',
      question: 'Which parameter helps reduce collisions in polynomial rolling hash?',
      options: ['Small base', 'Large non-prime modulus', 'Prime modulus', 'No modulus'],
      correctAnswer: 2,
      explanation: 'Using a prime modulus helps distribute hash values and reduces collisions.',
      hint: 'Number theory.',
      difficulty: 'hard'
    },
    {
      id: 'rk-5',
      question: 'Which use case benefits from multi-pattern search in Rabin-Karp?',
      options: ['Sorting values', 'Plagiarism detection', 'Binary search', 'Heap operations'],
      correctAnswer: 1,
      explanation: 'Rabin-Karp can hash multiple patterns and scan text once.',
      hint: 'Many patterns at once.',
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
    },
    {
      id: 'z-2',
      question: 'What does Z[i] store?',
      options: ['Hash', 'Longest prefix match starting at i', 'Suffix length', 'Pattern index'],
      correctAnswer: 1,
      explanation: 'Z[i] equals the length of the longest substring starting at i that matches the prefix.',
      hint: 'Prefix match length.',
      difficulty: 'easy'
    },
    {
      id: 'z-3',
      question: 'What interval tracks the current known match region?',
      options: ['[L,R] Z-box', '[i,j] window', '[P,S] block', '[A,B] band'],
      correctAnswer: 0,
      explanation: 'The Z-box [L,R] represents the rightmost matching segment with the prefix.',
      hint: 'Two-letter bounds.',
      difficulty: 'medium'
    },
    {
      id: 'z-4',
      question: 'Why use a separator like $ when concatenating pattern and text?',
      options: ['To hash faster', 'To prevent self-match of pattern', 'To reduce memory', 'To sort characters'],
      correctAnswer: 1,
      explanation: 'Separator ensures pattern doesn\'t match itself when computing Z on pattern$text.',
      hint: 'Avoid false positives.',
      difficulty: 'medium'
    },
    {
      id: 'z-5',
      question: 'What is the space complexity to store the Z array?',
      options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n²)'],
      correctAnswer: 1,
      explanation: 'Z array requires linear space in the string length.',
      hint: 'One value per position.',
      difficulty: 'easy'
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
    },
    {
      id: 'manacher-2',
      question: 'What purpose do the inserted # characters serve?',
      options: ['Hashing', 'Handling even/odd uniformly', 'Reducing complexity', 'Sorting characters'],
      correctAnswer: 1,
      explanation: 'Separators make all palindromes odd-length in the processed string.',
      hint: 'Normalize palindrome centers.',
      difficulty: 'easy'
    },
    {
      id: 'manacher-3',
      question: 'What does P[i] represent?',
      options: ['Palindrome length', 'Palindrome radius at center i', 'Index of center', 'Right boundary'],
      correctAnswer: 1,
      explanation: 'P[i] is the radius of the palindrome centered at i in the processed string.',
      hint: 'Radius, not total length.',
      difficulty: 'medium'
    },
    {
      id: 'manacher-4',
      question: 'What is the mirror index relative to center C?',
      options: ['C - i', '2*C - i', 'i - C', 'C + i'],
      correctAnswer: 1,
      explanation: 'Mirror = 2*C - i.',
      hint: 'Reflect across C.',
      difficulty: 'medium'
    },
    {
      id: 'manacher-5',
      question: 'When do we update center C and right boundary R?',
      options: ['On every iteration', 'When i + P[i] > R', 'When a mismatch occurs', 'When P[i] decreases'],
      correctAnswer: 1,
      explanation: 'We update when the palindrome centered at i expands beyond the current right boundary.',
      hint: 'Crossing the boundary.',
      difficulty: 'medium'
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
    },
    {
      id: 'anagram-2',
      question: 'Which early check can avoid unnecessary work?',
      options: ['Compare sorted strings', 'Check equal lengths', 'Lowercase both strings', 'Hash both strings'],
      correctAnswer: 1,
      explanation: 'If lengths differ, they cannot be anagrams.',
      hint: 'Compare sizes first.',
      difficulty: 'easy'
    },
    {
      id: 'anagram-3',
      question: 'What is the main advantage of using a fixed-size array over a map for a-z only?',
      options: ['Less code', 'Better asymptotic complexity', 'Lower constant factors and memory', 'Supports Unicode'],
      correctAnswer: 2,
      explanation: 'Arrays are faster and more memory-efficient for small fixed alphabets.',
      hint: 'Direct indexing.',
      difficulty: 'medium'
    },
    {
      id: 'anagram-4',
      question: 'Which approach has O(n log n) time for anagram checking?',
      options: ['Counting', 'Sorting and compare', 'Two-pointers', 'Binary search'],
      correctAnswer: 1,
      explanation: 'Sorting both strings then comparing yields O(n log n).',
      hint: 'Think comparison-based.',
      difficulty: 'medium'
    },
    {
      id: 'anagram-5',
      question: 'Why might Unicode normalization be necessary?',
      options: ['Improve speed', 'Handle composed vs decomposed characters', 'Reduce memory', 'Lowercase faster'],
      correctAnswer: 1,
      explanation: 'Unicode characters like é can be represented in multiple ways; normalization ensures consistent comparison.',
      hint: 'Multiple code point representations.',
      difficulty: 'hard'
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
    },
    {
      id: 'sll-2',
      question: 'Why is random access O(n) in a singly linked list?',
      options: ['Nodes are contiguous', 'Must traverse from head to index', 'Array indexing is slower', 'Pointers are hashed'],
      correctAnswer: 1,
      explanation: 'You must follow next pointers from the head to reach the i-th node, which takes O(i) time (O(n) worst case).',
      hint: 'No direct index lookups.',
      difficulty: 'medium'
    },
    {
      id: 'sll-3',
      question: 'What happens to the original head when reversing a singly linked list?',
      options: ['It becomes the tail', 'It is deleted', 'It remains head', 'It points to null and stays'],
      correctAnswer: 0,
      explanation: 'After reversal, the node that was head ends up at the tail of the list.',
      hint: 'Follow pointer rewiring.',
      difficulty: 'medium'
    },
    {
      id: 'sll-4',
      question: 'Which operation requires O(n) time in a basic singly linked list without a tail pointer?',
      options: ['Insert at head', 'Delete head', 'Insert at tail', 'Check if empty'],
      correctAnswer: 2,
      explanation: 'Without a tail pointer, you must traverse to the end to insert, which is O(n).',
      hint: 'Do you already know the last node?',
      difficulty: 'easy'
    },
    {
      id: 'sll-5',
      question: 'Which two-pointer technique finds the middle of a singly linked list?',
      options: ['Fast/slow pointers', 'Left/right pointers', 'Head/tail pointers', 'Binary pointers'],
      correctAnswer: 0,
      explanation: 'Advance slow by 1 and fast by 2; when fast reaches end, slow is at the middle.',
      hint: 'One pointer is twice as fast.',
      difficulty: 'hard'
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
    },
    {
      id: 'dll-2',
      question: 'What is the space overhead per node in a doubly linked list compared to singly?',
      options: ['None', 'One extra pointer', 'Two extra pointers', 'Half a pointer'],
      correctAnswer: 1,
      explanation: 'Each node stores an extra prev pointer.',
      hint: 'Next and prev.',
      difficulty: 'easy'
    },
    {
      id: 'dll-3',
      question: 'Deleting a known node (with its reference) in a doubly linked list is:',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correctAnswer: 0,
      explanation: 'Directly update neighbor pointers without traversal.',
      hint: 'Already have the pointer.',
      difficulty: 'medium'
    },
    {
      id: 'dll-4',
      question: 'Which invariant must hold after insertion between A and B?',
      options: ['A.prev = B', 'B.next = A', 'A.next.prev = new and new.next.prev = new', 'new.prev = new.next'],
      correctAnswer: 2,
      explanation: 'Both neighbors must point back to the new node; next/prev integrity is essential.',
      hint: 'Fix both directions.',
      difficulty: 'hard'
    },
    {
      id: 'dll-5',
      question: 'Which direction should you traverse to reach position p fastest?',
      options: ['Always from head', 'Always from tail', 'From closer end (head or tail)', 'Skip list traversal'],
      correctAnswer: 2,
      explanation: 'Choose traversal direction based on whether p is closer to head or tail.',
      hint: 'Minimize steps.',
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
    },
    {
      id: 'cll-2',
      question: 'How can you safely traverse a circular linked list once?',
      options: ['Stop on null', 'Track visited count only', 'Use do-while until node returns to head', 'Use recursion until stack overflows'],
      correctAnswer: 2,
      explanation: 'Start at head and loop until you return to head to avoid infinite traversal.',
      hint: 'Remember the start.',
      difficulty: 'medium'
    },
    {
      id: 'cll-3',
      question: 'What is the time complexity to insert at the head if you also maintain a tail pointer?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correctAnswer: 0,
      explanation: 'With a tail pointer, updating head and tail.next is constant time.',
      hint: 'Direct references.',
      difficulty: 'easy'
    },
    {
      id: 'cll-4',
      question: 'What is a common pitfall when deleting the head in a circular list?',
      options: ['Forgetting to decrement size', 'Not setting tail.next to new head', 'Forgetting to free memory', 'Losing data field'],
      correctAnswer: 1,
      explanation: 'You must keep the circle by updating the last node’s next to the new head.',
      hint: 'Keep it circular.',
      difficulty: 'medium'
    },
    {
      id: 'cll-5',
      question: 'Which application is a good fit for circular linked lists?',
      options: ['Binary search', 'Round-robin scheduling', 'Heap operations', 'Hash map resizing'],
      correctAnswer: 1,
      explanation: 'Round-robin cycles through items repeatedly, which fits the circular structure.',
      hint: 'Cycle through repeatedly.',
      difficulty: 'medium'
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
    },
    {
      id: 'stack-2',
      question: 'What is the time complexity of push and pop operations in a typical stack?',
      options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
      correctAnswer: 2,
      explanation: 'Both push and pop are constant-time operations affecting only the top element.',
      hint: 'Only the top is touched.',
      difficulty: 'easy'
    },
    {
      id: 'stack-3',
      question: 'Which of the following is NOT a typical application of stacks?',
      options: ['Function call management', 'Undo operations', 'Breadth-first search', 'Expression evaluation'],
      correctAnswer: 2,
      explanation: 'Breadth-first search uses a queue; depth-first search uses a stack.',
      hint: 'Think BFS vs DFS.',
      difficulty: 'medium'
    },
    {
      id: 'stack-4',
      question: 'What occurs when you pop from an empty stack?',
      options: ['Returns -1', 'Returns null', 'Stack underflow error', 'Creates a new element'],
      correctAnswer: 2,
      explanation: 'Popping from an empty stack is underflow, typically raising an error.',
      hint: 'Underflow.',
      difficulty: 'medium'
    },
    {
      id: 'stack-5',
      question: 'For balanced parentheses checking, what do we push on the stack?',
      options: ['Closing brackets', 'Opening brackets', 'All characters', 'Only curly braces'],
      correctAnswer: 1,
      explanation: 'Push opening brackets and match with incoming closing brackets.',
      hint: 'Open first, match later.',
      difficulty: 'hard'
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
    },
    {
      id: 'queue-2',
      question: 'What is the time complexity of enqueue and dequeue in a properly implemented queue?',
      options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
      correctAnswer: 2,
      explanation: 'Enqueue adds to rear, dequeue removes from front, both in constant time.',
      hint: 'Update pointers only.',
      difficulty: 'easy'
    },
    {
      id: 'queue-3',
      question: 'Why use a circular array for queue implementation?',
      options: ['To sort automatically', 'To avoid reallocation', 'To reuse array slots efficiently', 'To support recursion'],
      correctAnswer: 2,
      explanation: 'Circular arrays wrap around to reuse freed slots, preventing false overflow.',
      hint: 'Wrap around.',
      difficulty: 'medium'
    },
    {
      id: 'queue-4',
      question: 'Which traversal algorithm naturally uses a queue?',
      options: ['Depth-first search', 'Breadth-first search', 'Dijkstra', 'Bellman-Ford'],
      correctAnswer: 1,
      explanation: 'BFS processes vertices in the order they were discovered using a queue.',
      hint: 'Level order.',
      difficulty: 'medium'
    },
    {
      id: 'queue-5',
      question: 'What occurs when you dequeue from an empty queue?',
      options: ['Queue overflow', 'Queue underflow', 'Returns last element', 'Resizes automatically'],
      correctAnswer: 1,
      explanation: 'Dequeue on empty queue is underflow, typically raising an error.',
      hint: 'Underflow.',
      difficulty: 'hard'
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
    },
    {
      id: 'bt-2',
      question: 'What is the height of an empty binary tree by common definition?',
      options: ['-1', '0', '1', 'Depends on implementation'],
      correctAnswer: 0,
      explanation: 'Many definitions use height -1 for empty and 0 for a single node; ensures consistent formulas.',
      hint: 'Matches recurrence nicely.',
      difficulty: 'easy'
    },
    {
      id: 'bt-3',
      question: 'What traversal visits nodes level by level?',
      options: ['Inorder', 'Preorder', 'Postorder', 'Level order (BFS)'],
      correctAnswer: 3,
      explanation: 'Level order uses a queue to process nodes breadth-first.',
      hint: 'Use a queue.',
      difficulty: 'easy'
    },
    {
      id: 'bt-4',
      question: 'What is the worst-case height of a skewed binary tree with n nodes?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correctAnswer: 2,
      explanation: 'In a skewed tree, each node has one child, so height is n-1 which is O(n).',
      hint: 'Linked-list like.',
      difficulty: 'medium'
    },
    {
      id: 'bt-5',
      question: 'Which statement is true for full binary trees?',
      options: ['Every node has 2 children', 'Every internal node has 2 children and leaves have 0', 'Each level is full', 'Tree is complete'],
      correctAnswer: 1,
      explanation: 'In a full binary tree, every internal node has exactly 2 children; leaves have none.',
      hint: 'Internal nodes only.',
      difficulty: 'hard'
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
    },
    {
      id: 'bst-2',
      question: 'Which traversal of a BST yields a sorted order?',
      options: ['Preorder', 'Inorder', 'Postorder', 'Level order'],
      correctAnswer: 1,
      explanation: 'Inorder traversal of a BST outputs keys in non-decreasing order.',
      hint: 'L-Root-R.',
      difficulty: 'easy'
    },
    {
      id: 'bst-3',
      question: 'What can degrade BST search to O(n)?',
      options: ['Duplicate keys', 'Skewed insert order', 'Large keys', 'Hash collisions'],
      correctAnswer: 1,
      explanation: 'Inserting sorted data can produce a skewed tree, making height O(n).',
      hint: 'Degenerate shape.',
      difficulty: 'medium'
    },
    {
      id: 'bst-4',
      question: 'Which operation is NOT O(log n) on average for a balanced BST?',
      options: ['Search', 'Insert', 'Delete', 'Sorting the keys'],
      correctAnswer: 3,
      explanation: 'Sorting the keys is not a BST operation and may require traversal plus separate sorting.',
      hint: 'BST doesn’t sort explicitly.',
      difficulty: 'hard'
    },
    {
      id: 'bst-5',
      question: 'What property defines a BST?',
      options: ['Left subtree < node < right subtree', 'Left subtree <= node', 'Heaps property', 'Complete levels'],
      correctAnswer: 0,
      explanation: 'BST invariant places smaller keys on the left and larger on the right.',
      hint: 'Ordering invariant.',
      difficulty: 'easy'
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
    },
    {
      id: 'heap-2',
      question: 'What is the time complexity of extracting the minimum from a binary min-heap?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correctAnswer: 1,
      explanation: 'Extract-min removes the root and heapifies down, which takes O(log n) time.',
      hint: 'Height of a complete binary tree.',
      difficulty: 'easy'
    },
    {
      id: 'heap-3',
      question: 'Which array index relationships hold for a 0-indexed binary heap?',
      options: ['left=2i+1, right=2i+2, parent=floor((i-1)/2)', 'left=i+1, right=i+2, parent=i-1', 'left=2i, right=2i+1, parent=i/2', 'Only left child exists'],
      correctAnswer: 0,
      explanation: 'These are the standard index formulas for a binary heap stored in an array.',
      hint: 'Think level-order array layout.',
      difficulty: 'medium'
    },
    {
      id: 'heap-4',
      question: 'Building a heap from an unsorted array using heapify has what time complexity?',
      options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(n²)'],
      correctAnswer: 0,
      explanation: 'Floyd’s heap construction algorithm runs in linear time O(n).',
      hint: 'Not n log n; percolate-down cost decreases by level.',
      difficulty: 'hard'
    },
    {
      id: 'heap-5',
      question: 'Which statement is true for a min-heap?',
      options: ['Every parent is less than or equal to its children', 'Array is globally sorted', 'Leaf nodes come before internal nodes in array', 'Height can be n in worst case'],
      correctAnswer: 0,
      explanation: 'Heap enforces local ordering (heap property), not global sorting.',
      hint: 'Local not global order.',
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
    },
    {
      id: 'inorder-2',
      question: 'For a BST, inorder traversal produces:',
      options: ['Random order', 'Sorted order', 'Level order', 'Reverse order always'],
      correctAnswer: 1,
      explanation: 'Inorder traversal yields keys in non-decreasing order for BST.',
      hint: 'Sorted output.',
      difficulty: 'easy'
    },
    {
      id: 'inorder-3',
      question: 'What data structure can simulate recursion for inorder traversal?',
      options: ['Queue', 'Stack', 'Heap', 'Set'],
      correctAnswer: 1,
      explanation: 'Use a stack to implement iterative inorder traversal.',
      hint: 'LIFO.',
      difficulty: 'medium'
    },
    {
      id: 'inorder-4',
      question: 'Which step belongs to inorder traversal?',
      options: ['Visit root before left', 'Visit root after left, before right', 'Visit root after right', 'Skip null nodes and revisit'],
      correctAnswer: 1,
      explanation: 'Inorder is Left, then Root, then Right.',
      hint: 'L-Root-R.',
      difficulty: 'medium'
    },
    {
      id: 'inorder-5',
      question: 'Morris inorder traversal achieves:',
      options: ['O(n) time, O(1) extra space', 'O(log n) time, O(n) space', 'O(n^2) time', 'Randomized time'],
      correctAnswer: 0,
      explanation: 'Morris traversal uses threaded binary trees to avoid a stack/recursion.',
      hint: 'Threaded pointers.',
      difficulty: 'hard'
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
    },
    {
      id: 'preorder-2',
      question: 'A use-case of preorder traversal is:',
      options: ['Tree deletion', 'Tree copying/serialization', 'Finding height', 'Level order printing'],
      correctAnswer: 1,
      explanation: 'Preorder visits root before children, good for serialization or copying.',
      hint: 'Root first.',
      difficulty: 'medium'
    },
    {
      id: 'preorder-3',
      question: 'Preorder traversal of a BST gives:',
      options: ['Sorted order', 'Heap order', 'Root-first listing', 'Reverse order'],
      correctAnswer: 2,
      explanation: 'It lists root before left and right subtrees.',
      hint: 'Root first, not sorted.',
      difficulty: 'easy'
    },
    {
      id: 'preorder-4',
      question: 'Which structure can be used to implement iterative preorder traversal?',
      options: ['Queue', 'Stack', 'Deque only', 'Priority queue'],
      correctAnswer: 1,
      explanation: 'A stack can emulate recursion for preorder traversal.',
      hint: 'LIFO.',
      difficulty: 'medium'
    },
    {
      id: 'preorder-5',
      question: 'In preorder, after visiting a node, we next:',
      options: ['Go right, then left', 'Go left, then right', 'Return immediately', 'Go to parent'],
      correctAnswer: 1,
      explanation: 'Preorder order is Root, Left, Right.',
      hint: 'Left subtree before right.',
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
    },
    {
      id: 'postorder-2',
      question: 'A common use-case of postorder traversal is:',
      options: ['Serialization', 'Deletion of the tree', 'Level order printing', 'Finding min'],
      correctAnswer: 1,
      explanation: 'Postorder deletes children before parent, ideal for freeing a tree.',
      hint: 'Cleanup bottom-up.',
      difficulty: 'medium'
    },
    {
      id: 'postorder-3',
      question: 'Which structure can be used to implement iterative postorder traversal?',
      options: ['One stack with bookkeeping or two stacks', 'Only queue', 'Only recursion', 'Priority queue'],
      correctAnswer: 0,
      explanation: 'Iterative postorder often uses two stacks or one stack with visited flags.',
      hint: 'Two stacks trick.',
      difficulty: 'hard'
    },
    {
      id: 'postorder-4',
      question: 'Postorder visits a node:',
      options: ['Before both children', 'Between the children', 'After both children', 'Before right, after left'],
      correctAnswer: 2,
      explanation: 'Left, then Right, then Root.',
      hint: 'After processing subtrees.',
      difficulty: 'easy'
    },
    {
      id: 'postorder-5',
      question: 'In a binary tree, postorder of [4,5,2,6,7,3,1] indicates root is:',
      options: ['1', '2', '3', '4'],
      correctAnswer: 0,
      explanation: 'In postorder, the last visited node is the root.',
      hint: 'Root is last.',
      difficulty: 'medium'
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
    },
    {
      id: 'dfs-2',
      question: 'Which data structure naturally supports DFS recursion?',
      options: ['Queue', 'Stack', 'Deque', 'Priority queue'],
      correctAnswer: 1,
      explanation: 'DFS uses a stack either implicitly via recursion or explicitly.',
      hint: 'LIFO order.',
      difficulty: 'easy'
    },
    {
      id: 'dfs-3',
      question: 'What is a common use-case of DFS in graphs?',
      options: ['Shortest path in unweighted graphs', 'Cycle detection and topological sort', 'Minimum spanning tree', 'All-pairs shortest path'],
      correctAnswer: 1,
      explanation: 'DFS is used for cycle detection and as a step in topological sorting of DAGs.',
      hint: 'Directed acyclic graphs.',
      difficulty: 'medium'
    },
    {
      id: 'dfs-4',
      question: 'How do you avoid revisiting nodes in DFS?',
      options: ['Use a visited set', 'Use a min-heap', 'Randomize order', 'Use hashing of edges only'],
      correctAnswer: 0,
      explanation: 'Maintain a visited set/array to mark nodes seen to prevent infinite loops.',
      hint: 'Mark nodes as seen.',
      difficulty: 'easy'
    },
    {
      id: 'dfs-5',
      question: 'In DFS on a directed graph, a back edge indicates:',
      options: ['A tree edge', 'A cross edge', 'A cycle', 'A disconnected component'],
      correctAnswer: 2,
      explanation: 'Back edges to an ancestor indicate a cycle.',
      hint: 'Edge to an ancestor.',
      difficulty: 'hard'
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
    },
    {
      id: 'bfs-2',
      question: 'Which data structure does BFS use?',
      options: ['Stack', 'Queue', 'Deque', 'Priority queue'],
      correctAnswer: 1,
      explanation: 'BFS uses a queue to process nodes in increasing distance from the source.',
      hint: 'FIFO.',
      difficulty: 'easy'
    },
    {
      id: 'bfs-3',
      question: 'What is a key application of BFS?',
      options: ['Cycle detection', 'Topological sort', 'Shortest path in unweighted graphs', 'Minimum cut'],
      correctAnswer: 2,
      explanation: 'BFS finds shortest paths in unweighted graphs by exploring in layers.',
      hint: 'Layer by layer.',
      difficulty: 'medium'
    },
    {
      id: 'bfs-4',
      question: 'How do you avoid revisiting nodes in BFS?',
      options: ['Use a visited set/array', 'Use a min-heap', 'Randomize neighbors', 'Track degrees'],
      correctAnswer: 0,
      explanation: 'Maintain a visited structure to prevent enqueuing nodes multiple times.',
      hint: 'Mark-as-visited before enqueue.',
      difficulty: 'easy'
    },
    {
      id: 'bfs-5',
      question: 'In BFS, the order of exploration is primarily determined by:',
      options: ['Edge weights', 'Alphabetical order of vertices', 'Distance (levels) from the source', 'Stack order'],
      correctAnswer: 2,
      explanation: 'BFS explores nodes by increasing distance from the source node.',
      hint: 'Level order.',
      difficulty: 'hard'
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
    },
    {
      id: 'bubble-2',
      question: 'When can bubble sort finish early?',
      options: ['When pivot is middle', 'When no swaps occur in a pass', 'When array is reversed', 'When duplicates exist'],
      correctAnswer: 1,
      explanation: 'With an optimization flag, bubble sort can stop if a full pass made no swaps.',
      hint: 'Already sorted detection.',
      difficulty: 'medium'
    },
    {
      id: 'bubble-3',
      question: 'Bubble sort is stable. What does stable mean?',
      options: ['Preserves relative order of equal elements', 'Uses less memory', 'Always O(n log n)', 'No swaps are needed'],
      correctAnswer: 0,
      explanation: 'Stable sorting algorithms keep equal keys in their original relative order.',
      hint: 'Equal keys keep their order.',
      difficulty: 'easy'
    },
    {
      id: 'bubble-4',
      question: 'How many passes are needed in worst case for n elements?',
      options: ['1', 'log n', 'n-1', 'n²'],
      correctAnswer: 2,
      explanation: 'Each pass places one element; worst case needs n-1 passes.',
      hint: 'One element per pass.',
      difficulty: 'medium'
    },
    {
      id: 'bubble-5',
      question: 'Space complexity of bubble sort (in-place)?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      correctAnswer: 0,
      explanation: 'Bubble sort sorts in-place with constant extra memory.',
      hint: 'No auxiliary array.',
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
    },
    {
      id: 'merge-2',
      question: 'Is merge sort stable?',
      options: ['Yes', 'No', 'Only with extra space', 'Only on linked lists'],
      correctAnswer: 0,
      explanation: 'Standard merge sort is stable because merging preserves equal-key order.',
      hint: 'Equal elements order.',
      difficulty: 'easy'
    },
    {
      id: 'merge-3',
      question: 'Space complexity of array-based merge sort?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correctAnswer: 2,
      explanation: 'Merge sort requires an auxiliary array proportional to n for merging.',
      hint: 'Auxiliary buffer.',
      difficulty: 'medium'
    },
    {
      id: 'merge-4',
      question: 'Which structure makes merge sort in-place and efficient?',
      options: ['Arrays', 'Linked lists', 'Heaps', 'Tries'],
      correctAnswer: 1,
      explanation: 'Merging linked lists can be done by pointer manipulations without extra arrays.',
      hint: 'Pointers not copies.',
      difficulty: 'hard'
    },
    {
      id: 'merge-5',
      question: 'Which step dominates merge sort cost?',
      options: ['Splitting', 'Merging', 'Choosing pivot', 'Partitioning'],
      correctAnswer: 1,
      explanation: 'Merging runs linear per level, across log n levels.',
      hint: 'Combine work.',
      difficulty: 'easy'
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
    },
    {
      id: 'quick-2',
      question: 'What causes worst-case O(n²) in quick sort?',
      options: ['Equal elements', 'Unbalanced partitions', 'Small arrays', 'Stable partition'],
      correctAnswer: 1,
      explanation: 'Picking the smallest or largest pivot repeatedly leads to unbalanced partitions.',
      hint: 'Degenerate partitions.',
      difficulty: 'easy'
    },
    {
      id: 'quick-3',
      question: 'Is quick sort stable by default?',
      options: ['Yes', 'No', 'Only with 3-way partition', 'Only with random pivot'],
      correctAnswer: 1,
      explanation: 'Standard in-place quick sort is not stable.',
      hint: 'Swaps can reorder equals.',
      difficulty: 'medium'
    },
    {
      id: 'quick-4',
      question: 'Which technique mitigates worst-case behavior?',
      options: ['Insertion sort fallback', 'Median-of-three pivot selection', 'Counting sort', 'Heapifying'],
      correctAnswer: 1,
      explanation: 'Median-of-three reduces chance of extreme unbalance.',
      hint: 'Pick a better pivot.',
      difficulty: 'hard'
    },
    {
      id: 'quick-5',
      question: 'Space complexity of in-place quick sort recursion?',
      options: ['O(1)', 'O(log n) average', 'O(n)', 'O(n log n)'],
      correctAnswer: 1,
      explanation: 'Stack depth is O(log n) on average with balanced partitions.',
      hint: 'Recursion depth.',
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
    },
    {
      id: 'heap-2',
      question: 'Is heap sort stable?',
      options: ['Yes', 'No', 'Only with min-heap', 'Only with max-heap'],
      correctAnswer: 1,
      explanation: 'Standard heap sort is not stable because equal elements can be rearranged during heapify.',
      hint: 'Heapify reorder.',
      difficulty: 'easy'
    },
    {
      id: 'heap-3',
      question: 'In-place space complexity of heap sort?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correctAnswer: 0,
      explanation: 'Heap sort can be implemented in-place using the array as heap.',
      hint: 'No extra array.',
      difficulty: 'easy'
    },
    {
      id: 'heap-4',
      question: 'Which step does heap sort repeat after building the heap?',
      options: ['Merge subarrays', 'Extract root and heapify', 'Partition by pivot', 'Count keys'],
      correctAnswer: 1,
      explanation: 'Repeatedly extract the root (max) and heapify the reduced heap.',
      hint: 'Root then heapify.',
      difficulty: 'medium'
    },
    {
      id: 'heap-5',
      question: 'What data structure underlies heap sort?',
      options: ['Binary heap', 'Binary search tree', 'Trie', 'AVL tree'],
      correctAnswer: 0,
      explanation: 'Heap sort uses a binary heap for selection of the next element.',
      hint: 'Complete binary tree.',
      difficulty: 'easy'
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
    },
    {
      id: 'insertion-2',
      question: 'Insertion sort performs best on:',
      options: ['Random arrays', 'Nearly sorted arrays', 'Reverse-sorted arrays', 'Large arrays'],
      correctAnswer: 1,
      explanation: 'On nearly sorted input it runs close to O(n).',
      hint: 'Small inversions.',
      difficulty: 'medium'
    },
    {
      id: 'insertion-3',
      question: 'Is insertion sort stable?',
      options: ['Yes', 'No', 'Only with extra memory', 'Only when keys are unique'],
      correctAnswer: 0,
      explanation: 'Insertion sort maintains relative order of equal elements.',
      hint: 'Adjacent shifts.',
      difficulty: 'easy'
    },
    {
      id: 'insertion-4',
      question: 'Common practical use of insertion sort?',
      options: ['Sorting huge data', 'Inner loop for small subarrays', 'Parallel sorting', 'External sorting'],
      correctAnswer: 1,
      explanation: 'Used as a base case in hybrid algorithms like TimSort/QuickSort for small partitions.',
      hint: 'Hybrid sorts.',
      difficulty: 'medium'
    },
    {
      id: 'insertion-5',
      question: 'Space complexity of insertion sort?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correctAnswer: 0,
      explanation: 'It sorts in-place with constant extra memory.',
      hint: 'In-place.',
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
    },
    {
      id: 'selection-2',
      question: 'Is selection sort stable?',
      options: ['Yes', 'No', 'Only with linked lists', 'Only when keys are unique'],
      correctAnswer: 1,
      explanation: 'Standard selection sort is not stable unless implemented carefully.',
      hint: 'Swapping minimum may move equals.',
      difficulty: 'medium'
    },
    {
      id: 'selection-3',
      question: 'Why is selection sort not adaptive?',
      options: ['Ignores ordering of data', 'Needs extra memory', 'Random pivot', 'Multiple passes are parallel'],
      correctAnswer: 0,
      explanation: 'It always scans the remaining array fully to pick min, regardless of current order.',
      hint: 'Full scans always.',
      difficulty: 'easy'
    },
    {
      id: 'selection-4',
      question: 'Number of swaps in selection sort (worst case)?',
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(1)'],
      correctAnswer: 0,
      explanation: 'At most n-1 swaps; fewer writes compared to bubble/insert sort.',
      hint: 'One per pass.',
      difficulty: 'medium'
    },
    {
      id: 'selection-5',
      question: 'Best use-case for selection sort?',
      options: ['Huge datasets', 'Minimizing write operations', 'Stable sort requirement', 'Streaming data'],
      correctAnswer: 1,
      explanation: 'It minimizes writes; useful for memory with limited write cycles (e.g., EEPROM).',
      hint: 'Fewer writes.',
      difficulty: 'hard'
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
    },
    {
      id: 'counting-2',
      question: 'When is counting sort inappropriate?',
      options: ['Small ranges', 'Large key range k >> n', 'Duplicate keys', 'Stable sorting'],
      correctAnswer: 1,
      explanation: 'When k is much larger than n, memory/time overhead is too high.',
      hint: 'Range explosion.',
      difficulty: 'easy'
    },
    {
      id: 'counting-3',
      question: 'Is counting sort stable?',
      options: ['Yes', 'No', 'Only when k < n', 'Only without duplicates'],
      correctAnswer: 0,
      explanation: 'Using cumulative counts allows stable placement.',
      hint: 'Prefix sums.',
      difficulty: 'medium'
    },
    {
      id: 'counting-4',
      question: 'Primary space cost of counting sort?',
      options: ['Aux buffer of size n', 'Count array of size k', 'Recursive stack', 'Tree nodes'],
      correctAnswer: 1,
      explanation: 'It allocates a count array proportional to key range k.',
      hint: 'k-sized array.',
      difficulty: 'easy'
    },
    {
      id: 'counting-5',
      question: 'Typical use-case of counting sort?',
      options: ['Arbitrary precision floats', 'Small integer keys range', 'Linked lists', 'External sorting'],
      correctAnswer: 1,
      explanation: 'Performs great when keys are integers in a modest range.',
      hint: 'Integers in small range.',
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
    },
    {
      id: 'radix-2',
      question: 'Which stable subroutine is commonly used inside radix sort?',
      options: ['Quick sort', 'Heap sort', 'Counting sort', 'Merge sort'],
      correctAnswer: 2,
      explanation: 'Counting sort is stable and works well per digit bucket.',
      hint: 'Stable and linear.',
      difficulty: 'easy'
    },
    {
      id: 'radix-3',
      question: 'Which type of data suits radix sort best?',
      options: ['Floating-point with exponents', 'Strings or integers with bounded length', 'Linked lists only', 'Arbitrary objects'],
      correctAnswer: 1,
      explanation: 'Radix sort is efficient for fixed-length strings/integers.',
      hint: 'Bounded digits.',
      difficulty: 'medium'
    },
    {
      id: 'radix-4',
      question: 'Why must the internal sort be stable?',
      options: ['To reduce time', 'To preserve previous digit ordering', 'To save memory', 'To avoid recursion'],
      correctAnswer: 1,
      explanation: 'Stability preserves the order from less significant digits.',
      hint: 'Carry over order.',
      difficulty: 'hard'
    },
    {
      id: 'radix-5',
      question: 'Base (k) choice affects:',
      options: ['Only stability', 'Only correctness', 'Time and space trade-offs', 'Nothing'],
      correctAnswer: 2,
      explanation: 'Larger base reduces passes (d) but increases bucket overhead.',
      hint: 'd vs bucket cost.',
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
    },
    {
      id: 'bucket-2',
      question: 'Bucket sort works best when input is:',
      options: ['Uniformly distributed', 'Reverse sorted', 'Nearly sorted', 'With many duplicates only'],
      correctAnswer: 0,
      explanation: 'Uniform distribution spreads keys evenly among buckets.',
      hint: 'Even spread.',
      difficulty: 'easy'
    },
    {
      id: 'bucket-3',
      question: 'Which per-bucket algorithm keeps bucket sort stable overall?',
      options: ['Quick sort', 'Heap sort', 'Insertion sort', 'Selection sort'],
      correctAnswer: 2,
      explanation: 'Insertion sort is stable and efficient for small buckets.',
      hint: 'Small buckets.',
      difficulty: 'medium'
    },
    {
      id: 'bucket-4',
      question: 'Primary drawback of bucket sort?',
      options: ['Not in-place', 'Not comparison-based', 'Needs large number of buckets sometimes', 'Not stable'],
      correctAnswer: 2,
      explanation: 'Choosing bucket count and handling skew can be tricky and memory-heavy.',
      hint: 'Skewed distributions.',
      difficulty: 'hard'
    },
    {
      id: 'bucket-5',
      question: 'Bucket sort is typically:',
      options: ['Comparison-based', 'Non-comparison-based', 'Recursive only', 'Parallel only'],
      correctAnswer: 1,
      explanation: 'Like counting/radix, bucket sort avoids comparisons by grouping by key ranges.',
      hint: 'Group by range.',
      difficulty: 'easy'
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
    },
    {
      id: 'linear-2',
      question: 'When is linear search preferable over binary search?',
      options: ['Large sorted arrays', 'Small arrays or unsorted data', 'Always', 'Never'],
      correctAnswer: 1,
      explanation: 'Linear search is fine for very small arrays or unsorted data where sorting would be costly.',
      hint: 'Constant factors matter.',
      difficulty: 'medium'
    },
    {
      id: 'linear-3',
      question: 'Linear search is stable with respect to equal values?',
      options: ['Yes', 'No', 'Depends on language', 'Depends on compiler'],
      correctAnswer: 0,
      explanation: 'It scans left-to-right, finding the first matching index consistently.',
      hint: 'First occurrence.',
      difficulty: 'easy'
    },
    {
      id: 'linear-4',
      question: 'Average-case time complexity of linear search?',
      options: ['O(1)', 'O(n/2)', 'O(n)', 'O(n log n)'],
      correctAnswer: 2,
      explanation: 'On average, it examines half the array, which is still O(n).',
      hint: 'Drop constants.',
      difficulty: 'easy'
    },
    {
      id: 'linear-5',
      question: 'Space complexity of linear search?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      correctAnswer: 0,
      explanation: 'Only constant extra space is used for indices.',
      hint: 'In-place.',
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
    },
    {
      id: 'binary-2',
      question: 'Worst-case time complexity of binary search?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correctAnswer: 1,
      explanation: 'Binary search halves the search interval each step.',
      hint: 'Logarithmic.',
      difficulty: 'easy'
    },
    {
      id: 'binary-3',
      question: 'Common bug in binary search implementation?',
      options: ['Using while (l < r)', 'Mid overflow with (l + r) / 2', 'Returning on equal mid', 'Using <= operator'],
      correctAnswer: 1,
      explanation: 'Use l + (r - l) / 2 to avoid integer overflow in some languages.',
      hint: 'Safe mid.',
      difficulty: 'medium'
    },
    {
      id: 'binary-4',
      question: 'Binary search on duplicates returns:',
      options: ['Any index of target', 'Always first index', 'Always last index', 'Throws error'],
      correctAnswer: 0,
      explanation: 'Standard binary search may return any matching index; variants find first/last.',
      hint: 'Variants exist.',
      difficulty: 'medium'
    },
    {
      id: 'binary-5',
      question: 'Ternary search vs binary search on unimodal functions?',
      options: ['Always faster', 'Same asymptotic complexity', 'Always slower', 'Undefined'],
      correctAnswer: 1,
      explanation: 'Both have logarithmic complexity in their respective domains.',
      hint: 'Big-O.',
      difficulty: 'hard'
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
    },
    {
      id: 'interpolation-2',
      question: 'When does interpolation search degrade to O(n)?',
      options: ['Small arrays', 'Highly skewed distributions', 'Sorted arrays', 'Random pivots'],
      correctAnswer: 1,
      explanation: 'Non-uniform distributions can break the position estimate.',
      hint: 'Bad estimate.',
      difficulty: 'easy'
    },
    {
      id: 'interpolation-3',
      question: 'Prerequisite for interpolation search?',
      options: ['Data must be unsorted', 'Uniformly distributed keys and sorted data', 'Unique keys only', 'No duplicates'],
      correctAnswer: 1,
      explanation: 'Data must be sorted and roughly uniform for efficiency.',
      hint: 'Assumptions.',
      difficulty: 'medium'
    },
    {
      id: 'interpolation-4',
      question: 'Formula for probe position pos?',
      options: ['low + (high-low)/2', 'low + (target-arr[low])*(high-low)/(arr[high]-arr[low])', 'high - 1', 'random index'],
      correctAnswer: 1,
      explanation: 'Uses linear interpolation of value range to guess index.',
      hint: 'Proportional distance.',
      difficulty: 'hard'
    },
    {
      id: 'interpolation-5',
      question: 'How does interpolation search compare to binary search?',
      options: ['Always better', 'Better on uniform data, worse otherwise', 'Always worse', 'Same'],
      correctAnswer: 1,
      explanation: 'It can outperform binary search on uniform data but degrade on skewed data.',
      hint: 'Trade-offs.',
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
    },
    {
      id: 'threesum-2',
      question: 'Why do we sort the array first?',
      options: ['To use binary search', 'To avoid duplicates and use two pointers', 'To reduce memory', 'To ensure stability'],
      correctAnswer: 1,
      explanation: 'Sorting helps skip duplicates and enables two-pointer scanning.',
      hint: 'Order helps.',
      difficulty: 'easy'
    },
    {
      id: 'threesum-3',
      question: 'How do we avoid duplicate triplets?',
      options: ['Use a set only', 'Skip equal neighbors after fixing i and moving pointers', 'Randomize', 'Hash sums'],
      correctAnswer: 1,
      explanation: 'After finding a valid triplet, skip equal values for left/right and for i.',
      hint: 'Skip equals.',
      difficulty: 'medium'
    },
    {
      id: 'threesum-4',
      question: 'What happens if current sum < target (assuming three-sum closest)?',
      options: ['Move right pointer left', 'Move left pointer right', 'Restart', 'Stop'],
      correctAnswer: 1,
      explanation: 'Increase sum by moving left pointer to a larger value.',
      hint: 'Adjust towards target.',
      difficulty: 'easy'
    },
    {
      id: 'threesum-5',
      question: 'Space complexity of typical two-pointer three-sum?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      correctAnswer: 0,
      explanation: 'Works in-place after sorting (ignoring output).',
      hint: 'Constant extra.',
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
    },
    {
      id: 'swmax-2',
      question: 'What does the deque store for SWM?',
      options: ['Values', 'Indices of candidates in decreasing order', 'Indices in increasing order', 'All indices'],
      correctAnswer: 1,
      explanation: 'Store indices of potentially maximum values in decreasing order.',
      hint: 'Monotonic queue.',
      difficulty: 'medium'
    },
    {
      id: 'swmax-3',
      question: 'When do we pop from back of deque?',
      options: ['When new value is smaller', 'When new value is greater or equal', 'Randomly', 'At window start only'],
      correctAnswer: 1,
      explanation: 'Remove dominated values smaller than incoming value.',
      hint: 'Maintain decreasing order.',
      difficulty: 'easy'
    },
    {
      id: 'swmax-4',
      question: 'When do we pop from front of deque?',
      options: ['When index is out of window', 'When value is minimal', 'At every step', 'Never'],
      correctAnswer: 0,
      explanation: 'Remove indices that fall out of current window.',
      hint: 'Window bounds.',
      difficulty: 'easy'
    },
    {
      id: 'swmax-5',
      question: 'Space complexity of SWM with deque?',
      options: ['O(1)', 'O(k)', 'O(n)', 'O(k log n)'],
      correctAnswer: 1,
      explanation: 'Deque holds at most k indices for window size k.',
      hint: 'At most window size.',
      difficulty: 'medium'
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
,
  'exponential-search': [
    {
      id: 'expsearch-1',
      question: 'What is the idea of exponential search?',
      options: ['Probe exponentially increasing indices, then binary search', 'Linear scan then binary search', 'Hash then search', 'Jump search only'],
      correctAnswer: 0,
      explanation: 'Exponential search finds a range by doubling index, then performs binary search within it.',
      hint: 'Find bounds fast.',
      difficulty: 'medium'
    },
    {
      id: 'expsearch-2',
      question: 'Prerequisite for exponential search?',
      options: ['Unsorted array', 'Sorted array', 'Unique keys', 'No duplicates'],
      correctAnswer: 1,
      explanation: 'Like binary search, exponential search requires sorted data.',
      hint: 'Ordering required.',
      difficulty: 'easy'
    },
    {
      id: 'expsearch-3',
      question: 'Time complexity of exponential search?',
      options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
      correctAnswer: 1,
      explanation: 'Exponential search is O(log n): O(log bound) to find range + O(log n) binary search.',
      hint: 'Logarithmic.',
      difficulty: 'medium'
    },
    {
      id: 'expsearch-4',
      question: 'How are bounds determined?',
      options: ['By hashing', 'By doubling index until exceed target', 'By random probing', 'By interpolation'],
      correctAnswer: 1,
      explanation: 'Double index i: 1,2,4,8,... until arr[i] >= target or i >= n.',
      hint: 'Exponential growth.',
      difficulty: 'hard'
    },
    {
      id: 'expsearch-5',
      question: 'Space complexity of exponential search?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correctAnswer: 0,
      explanation: 'It uses constant additional space.',
      hint: 'In-place indices.',
      difficulty: 'easy'
    }
  ],

  'container-with-most-water': [
    {
      id: 'cwmw-1',
      question: 'What is the time complexity using two pointers?',
      options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n²)'],
      correctAnswer: 1,
      explanation: 'Move the pointer at the shorter line inward each step to achieve O(n).',
      hint: 'Shrink from the limiting side.',
      difficulty: 'easy'
    },
    {
      id: 'cwmw-2',
      question: 'Why move the shorter line inward?',
      options: ['To reduce width', 'To possibly increase height and area', 'Randomly', 'To sort heights'],
      correctAnswer: 1,
      explanation: 'Only increasing the shorter height can increase area for a given width.',
      hint: 'Area = width × min(h).',
      difficulty: 'medium'
    },
    {
      id: 'cwmw-3',
      question: 'Space complexity of two-pointer solution?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      correctAnswer: 0,
      explanation: 'Only a constant number of indices is used.',
      hint: 'In-place.',
      difficulty: 'easy'
    },
    {
      id: 'cwmw-4',
      question: 'What happens if we move the taller line?',
      options: ['Area can only increase', 'Area never increases', 'Area might increase', 'No effect'],
      correctAnswer: 1,
      explanation: 'Moving the taller line cannot increase the limiting height; area cannot improve.',
      hint: 'Limiting factor.',
      difficulty: 'hard'
    },
    {
      id: 'cwmw-5',
      question: 'Initial positions of pointers are at:',
      options: ['Both middle', 'Both at start', 'Start and end', 'Random positions'],
      correctAnswer: 2,
      explanation: 'Place pointers at both ends and move inward greedily.',
      hint: 'Maximize width first.',
      difficulty: 'easy'
    }
  ],

  'trapping-rain-water': [
    {
      id: 'trap-1',
      question: 'What is the two-pointer solution time complexity?',
      options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n²)'],
      correctAnswer: 1,
      explanation: 'Process bars with left/right max tracking in O(n).',
      hint: 'One pass.',
      difficulty: 'medium'
    },
    {
      id: 'trap-2',
      question: 'Key invariant in two-pointer trapping water?',
      options: ['leftMax <= rightMax decides movement', 'Always move higher bar', 'Use stack only', 'Sort bars'],
      correctAnswer: 0,
      explanation: 'Move the side with smaller running max; trapped water is bounded by that max.',
      hint: 'Smaller max side.',
      difficulty: 'hard'
    },
    {
      id: 'trap-3',
      question: 'Space complexity of two-pointer trapping water?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      correctAnswer: 0,
      explanation: 'Only a few variables are used for running maxima and pointers.',
      hint: 'Constant space.',
      difficulty: 'easy'
    },
    {
      id: 'trap-4',
      question: 'Alternative O(n) approach uses:',
      options: ['Deque', 'Stack', 'Union-Find', 'Trie'],
      correctAnswer: 1,
      explanation: 'A stack approach simulates boundaries to accumulate water.',
      hint: 'Monotonic stack.',
      difficulty: 'medium'
    },
    {
      id: 'trap-5',
      question: 'Trapped water at index i equals:',
      options: ['min(leftMax, rightMax) - height[i]', 'leftMax - rightMax', 'height[i] - min(leftMax, rightMax)', 'max(leftMax, rightMax)'],
      correctAnswer: 0,
      explanation: 'Classic formula using left and right maxima.',
      hint: 'Bounded by min of maxima.',
      difficulty: 'easy'
    }
  ],

  'sliding-window-longest-unique': [
    {
      id: 'swlu-1',
      question: 'Data structure to track character counts for longest unique substring?',
      options: ['Stack', 'Queue', 'Hash map / array', 'Binary heap'],
      correctAnswer: 2,
      explanation: 'Use a map/array to maintain counts and shrink window on duplicates.',
      hint: 'Frequency table.',
      difficulty: 'easy'
    },
    {
      id: 'swlu-2',
      question: 'When do we shrink the window?',
      options: ['On duplicate entering', 'On non-duplicate entering', 'Randomly', 'Never'],
      correctAnswer: 0,
      explanation: 'Shrink from left until the duplicate count resolves.',
      hint: 'Remove from left.',
      difficulty: 'medium'
    },
    {
      id: 'swlu-3',
      question: 'Time complexity of longest unique substring?',
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'],
      correctAnswer: 0,
      explanation: 'Each character is visited at most twice (enter and leave).',
      hint: 'Two-pointer window.',
      difficulty: 'easy'
    },
    {
      id: 'swlu-4',
      question: 'Space complexity given ASCII input?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(σ) where σ is alphabet size'],
      correctAnswer: 3,
      explanation: 'Space is proportional to alphabet size for frequency map.',
      hint: 'Character set size matters.',
      difficulty: 'medium'
    },
    {
      id: 'swlu-5',
      question: 'Key update step after extending window to right?',
      options: ['Decrease count of s[left]', 'Increase count of s[right]', 'Sort substring', 'Reset map'],
      correctAnswer: 1,
      explanation: 'Increment frequency of new right character, then shrink if duplicate.',
      hint: 'Maintain counts.',
      difficulty: 'easy'
    }
  ],

  'sliding-window-min-window': [
    {
      id: 'swmw-1',
      question: 'What condition allows shrinking left pointer for minimum window substring?',
      options: ['When window contains all required counts', 'When right pointer moved', 'When duplicate elements exist', 'When characters are unique only'],
      correctAnswer: 0,
      explanation: 'Shrink while maintaining requirement to minimize window length.',
      hint: 'Maintain validity.',
      difficulty: 'hard'
    },
    {
      id: 'swmw-2',
      question: 'What is tracked for the requirement?',
      options: ['Total characters only', 'Counts of required characters', 'Sorted window', 'Unique count only'],
      correctAnswer: 1,
      explanation: 'Use a need map and a have counter to know when window is valid.',
      hint: 'Need vs have.',
      difficulty: 'medium'
    },
    {
      id: 'swmw-3',
      question: 'Time complexity of minimum window substring?',
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'],
      correctAnswer: 0,
      explanation: 'Two-pointer window visits each character at most twice.',
      hint: 'Sliding window.',
      difficulty: 'medium'
    },
    {
      id: 'swmw-4',
      question: 'What happens when count of s[left] becomes less than needed when shrinking?',
      options: ['Window stays valid', 'Window becomes invalid', 'Ignore and continue', 'Reset pointers'],
      correctAnswer: 1,
      explanation: 'Stop shrinking and resume expanding.',
      hint: 'Maintain validity.',
      difficulty: 'easy'
    },
    {
      id: 'swmw-5',
      question: 'Space complexity with ASCII input?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(σ) where σ is alphabet size'],
      correctAnswer: 3,
      explanation: 'We store frequency maps for required and current window by alphabet size.',
      hint: 'Alphabet bound.',
      difficulty: 'easy'
    }
  ],

  'hash-table-basics': [
    {
      id: 'htb-1',
      question: 'Average time complexity for hash table operations?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correctAnswer: 0,
      explanation: 'With good hashing and low load factor, operations are O(1) average.',
      hint: 'Expected constant time.',
      difficulty: 'easy'
    },
    {
      id: 'htb-2',
      question: 'What is load factor?',
      options: ['Table size', 'keys/capacity', 'Capacity/keys', 'Hash range'],
      correctAnswer: 1,
      explanation: 'Load factor α = number of keys / table capacity.',
      hint: 'α.',
      difficulty: 'medium'
    },
    {
      id: 'htb-3',
      question: 'How to reduce collisions?',
      options: ['Smaller table', 'Poor hash function', 'Good hash function and resizing', 'Disable probing'],
      correctAnswer: 2,
      explanation: 'Uniform hashing and resizing maintain performance.',
      hint: 'Uniform spread.',
      difficulty: 'medium'
    },
    {
      id: 'htb-4',
      question: 'Which is NOT a collision strategy?',
      options: ['Separate chaining', 'Open addressing', 'Double hashing', 'Kruskal chaining'],
      correctAnswer: 3,
      explanation: 'Kruskal is unrelated to hashing.',
      hint: 'Unrelated algorithm.',
      difficulty: 'easy'
    },
    {
      id: 'htb-5',
      question: 'Resizing a hash table usually happens when:',
      options: ['Load factor too high', 'Key not found', 'Duplicate key', 'Table is empty'],
      correctAnswer: 0,
      explanation: 'To keep O(1) average time, grow table when α exceeds threshold.',
      hint: 'Threshold on α.',
      difficulty: 'medium'
    }
  ],

  'hash-functions': [
    {
      id: 'hashf-1',
      question: 'Which property is desirable in a hash function?',
      options: ['Many collisions', 'Uniform distribution', 'High computation cost', 'Deterministic randomness'],
      correctAnswer: 1,
      explanation: 'Uniform distribution spreads keys evenly, reducing collisions.',
      hint: 'Even spread.',
      difficulty: 'easy'
    },
    {
      id: 'hashf-2',
      question: 'Multiplicative hashing uses:',
      options: ['Division only', 'A * key mod 2^w', 'Exponentiation', 'Sorting first'],
      correctAnswer: 1,
      explanation: 'A constant A scales key with modulo a power of two.',
      hint: 'Knuth method.',
      difficulty: 'medium'
    },
    {
      id: 'hashf-3',
      question: 'For strings, a common technique is:',
      options: ['Polynomial rolling hash', 'Binary search', 'DFS', 'Euclid GCD'],
      correctAnswer: 0,
      explanation: 'Polynomial rolling hash accumulates characters with a base and modulus.',
      hint: 'Rolling.',
      difficulty: 'medium'
    },
    {
      id: 'hashf-4',
      question: 'Double hashing helps by:',
      options: ['Sorting keys', 'Using two hash functions to reduce clustering', 'Avoiding collisions completely', 'Reducing memory'],
      correctAnswer: 1,
      explanation: 'Two independent hash functions reduce primary clustering.',
      hint: 'Two hashes.',
      difficulty: 'hard'
    },
    {
      id: 'hashf-5',
      question: 'Universal hashing means:',
      options: ['One fixed function', 'Randomly choose from a family of hash functions', 'No collisions guaranteed', 'Cryptographic hashing'],
      correctAnswer: 1,
      explanation: 'Choosing randomly from a hash family bounds expected collisions.',
      hint: 'Family of functions.',
      difficulty: 'medium'
    }
  ]
,

  // Backtracking Intro
  'backtracking-intro': [
    { id: 'btintro-1', question: 'What is the core idea of backtracking?', options: ['Dynamic programming', 'Greedy choice', 'Systematic trial with pruning', 'Divide and conquer only'], correctAnswer: 2, explanation: 'Backtracking tries building candidates and abandons a path as soon as it cannot possibly lead to a valid solution.', hint: 'Prune dead branches early.', difficulty: 'easy' },
    { id: 'btintro-2', question: 'Which condition triggers backtracking?', options: ['Reaching base case only', 'Encountering a constraint violation', 'Always after each step', 'Randomly'], correctAnswer: 1, explanation: 'When a partial assignment violates constraints, the algorithm backtracks immediately.', hint: 'Constraint check fails.', difficulty: 'medium' },
    { id: 'btintro-3', question: 'Typical time complexity class of backtracking?', options: ['Polynomial', 'Logarithmic', 'Exponential in general', 'Constant'], correctAnswer: 2, explanation: 'Backtracking often explores an exponential-sized search space in the worst case.', hint: 'Combinatorial explosion.', difficulty: 'medium' },
    { id: 'btintro-4', question: 'Which is NOT a canonical backtracking problem?', options: ['N-Queens', 'Sudoku', 'Merge Sort', 'Permutations'], correctAnswer: 2, explanation: 'Merge sort is divide-and-conquer sorting, not backtracking.', hint: 'Sorting vs search tree.', difficulty: 'easy' },
    { id: 'btintro-5', question: 'What improves backtracking performance most?', options: ['Larger recursion limit', 'Heuristics and pruning', 'More loops', 'String matching'], correctAnswer: 1, explanation: 'Heuristics like choosing most-constrained-first and pruning reduce explored states drastically.', hint: 'Prune early.', difficulty: 'hard' }
  ],

  // Combination Sum
  'combination-sum': [
    { id: 'combsum-1', question: 'Combination Sum typically uses:', options: ['BFS', 'Backtracking/DFS', 'Dijkstra', 'Union-Find'], correctAnswer: 1, explanation: 'We build combinations recursively and backtrack when sums exceed target.', hint: 'Depth-first search on candidates.', difficulty: 'easy' },
    { id: 'combsum-2', question: 'What ensures no duplicate combinations in sorted candidates?', options: ['Random picks', 'Set of sets', 'Skip equal values at same depth', 'Hash of all subsets only'], correctAnswer: 2, explanation: 'When candidates are sorted, skipping duplicates at a given depth avoids repeated combos.', hint: 'Deduplicate per depth.', difficulty: 'medium' },
    { id: 'combsum-3', question: 'Allowing reuse of a number means you should:', options: ['Advance index anyway', 'Reset recursion', 'Stay at same index for next call', 'Shuffle candidates'], correctAnswer: 2, explanation: 'To reuse a number, recurse without advancing the index.', hint: 'Same i for reuse.', difficulty: 'medium' },
    { id: 'combsum-4', question: 'Pruning rule for combination sum:', options: ['Stop when target < 0', 'Stop when target > 0', 'Stop only at target == 0', 'Never prune'], correctAnswer: 0, explanation: 'If the remaining target goes negative, no need to continue down that branch.', hint: 'Overshoot prevents completion.', difficulty: 'easy' },
    { id: 'combsum-5', question: 'Typical complexity for combination sum?', options: ['O(n)', 'O(2^n) in worst case', 'O(log n)', 'O(n!)'], correctAnswer: 1, explanation: 'Combinatorial branching yields exponential time in the worst case.', hint: 'Combinatorial search.', difficulty: 'hard' }
  ],

  // Fibonacci Algorithms
  'fibonacci-algorithms': [
    { id: 'fibalg-1', question: 'Time of naive recursive Fibonacci?', options: ['O(n)', 'O(log n)', 'O(2^n)', 'O(n log n)'], correctAnswer: 2, explanation: 'Each call branches twice, leading to exponential growth.', hint: 'Two recursive calls.', difficulty: 'easy' },
    { id: 'fibalg-2', question: 'Memoization reduces complexity to:', options: ['O(n)', 'O(n log n)', 'O(2^n)', 'O(1)'], correctAnswer: 0, explanation: 'Each subproblem is computed once and stored.', hint: 'Store results.', difficulty: 'medium' },
    { id: 'fibalg-3', question: 'Space of iterative bottom-up Fibonacci?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 0, explanation: 'Only two variables are needed for rolling computation.', hint: 'Two variables.', difficulty: 'easy' },
    { id: 'fibalg-4', question: 'Fast doubling method time complexity:', options: ['O(n)', 'O(log n)', 'O(√n)', 'O(n log n)'], correctAnswer: 1, explanation: 'Uses identities to compute F(n) with divide-and-conquer in logarithmic steps.', hint: 'Divide and conquer.', difficulty: 'hard' },
    { id: 'fibalg-5', question: 'Matrix exponentiation for Fibonacci uses:', options: ['Greedy', 'Binary exponentiation', 'DFS', 'Counting sort'], correctAnswer: 1, explanation: 'Raise the Fibonacci Q-matrix to the nth power using fast exponentiation.', hint: 'Exponentiate a matrix.', difficulty: 'medium' }
  ],

  // Generate Parentheses
  'generate-parentheses': [
    { id: 'genpar-1', question: 'Core invariant for generating parentheses:', options: ['Close count < open count', 'Open count < close count', 'Counts unrelated', 'Use stack only'], correctAnswer: 0, explanation: 'You can only add a closing parenthesis if it will not break validity (close <= open).', hint: 'Validity condition.', difficulty: 'easy' },
    { id: 'genpar-2', question: 'State tracked during recursion:', options: ['Only remaining total', 'Open and close used so far', 'Index only', 'Random seed'], correctAnswer: 1, explanation: 'Tracking both counts ensures valid construction.', hint: 'Two counters.', difficulty: 'medium' },
    { id: 'genpar-3', question: 'Stop condition when n pairs generated:', options: ['When open == close == n', 'When open == n only', 'When close == n only', 'Never stop'], correctAnswer: 0, explanation: 'A valid sequence has n opens and n closes.', hint: 'Both limits reached.', difficulty: 'easy' },
    { id: 'genpar-4', question: 'Branching rule when open < n:', options: ['Must add close', 'May add open', 'Stop', 'Backtrack immediately'], correctAnswer: 1, explanation: 'You can always add an opening parenthesis if limit not reached.', hint: 'Add "(".', difficulty: 'medium' },
    { id: 'genpar-5', question: 'Complexity class of generating all valid sequences:', options: ['Polynomial', 'Exponential (Catalan number)', 'Logarithmic', 'Linear'], correctAnswer: 1, explanation: 'Number of valid sequences is the nth Catalan number, which grows exponentially.', hint: 'Catalan.', difficulty: 'hard' }
  ],

  // Mathematical Algorithms Intro
  'mathematical-algorithms-intro': [
    { id: 'mathintro-1', question: 'Which is a core mathematical tool in algorithms?', options: ['AVL rotations', 'Modular arithmetic', 'Union-Find', 'DFS'], correctAnswer: 1, explanation: 'Modular arithmetic underpins hashing, cryptography, and number-theoretic algorithms.', hint: 'mod m.', difficulty: 'easy' },
    { id: 'mathintro-2', question: 'GCD of (a, b) is computed efficiently by:', options: ['Trial division', 'Euclid’s algorithm', 'Sieve of Eratosthenes', 'Karatsuba'], correctAnswer: 1, explanation: 'Euclid’s algorithm runs in logarithmic time using repeated remainders.', hint: 'a % b.', difficulty: 'medium' },
    { id: 'mathintro-3', question: 'Modular inverse exists when:', options: ['a and m are coprime', 'a > m', 'm is prime only', 'a is even'], correctAnswer: 0, explanation: 'Inverse of a modulo m exists iff gcd(a, m) = 1.', hint: 'Coprime.', difficulty: 'medium' },
    { id: 'mathintro-4', question: 'Fast exponentiation runs in:', options: ['O(n)', 'O(log n)', 'O(√n)', 'O(n log n)'], correctAnswer: 1, explanation: 'Exponentiation by squaring halves the exponent each step.', hint: 'Squaring.', difficulty: 'easy' },
    { id: 'mathintro-5', question: 'Chinese Remainder Theorem helps to:', options: ['Sort numbers', 'Solve congruences in parts', 'Compute primes', 'Traverse graphs'], correctAnswer: 1, explanation: 'CRT reconstructs a solution modulo a product from solutions modulo coprime factors.', hint: 'Combine residues.', difficulty: 'hard' }
  ],

  // Merge Sorted Arrays
  'merge-sorted-arrays': [
    { id: 'msa-1', question: 'Merging two sorted arrays runs in:', options: ['O(1)', 'O(log n)', 'O(n + m)', 'O(nm)'], correctAnswer: 2, explanation: 'Two-pointer merge processes each element at most once.', hint: 'Linear in total length.', difficulty: 'easy' },
    { id: 'msa-2', question: 'In-place merge without extra buffer is:', options: ['Trivial', 'More complex but possible', 'Impossible', 'Always O(1)'], correctAnswer: 1, explanation: 'In-place merge is non-trivial and often slower, but achievable with techniques like gap method.', hint: 'Gap method.', difficulty: 'hard' },
    { id: 'msa-3', question: 'Stable merge ensures:', options: ['Fewer comparisons', 'Order of equal keys preserved', 'Less memory', 'Random access'], correctAnswer: 1, explanation: 'Stability maintains relative order of equal elements.', hint: 'Stable = preserve order.', difficulty: 'medium' },
    { id: 'msa-4', question: 'Space cost of standard merge operation:', options: ['O(1)', 'O(k)', 'O(n + m)', 'O(n log n)'], correctAnswer: 2, explanation: 'Standard merging uses an auxiliary array proportional to total length.', hint: 'Aux array.', difficulty: 'medium' },
    { id: 'msa-5', question: 'Application of merging sorted arrays:', options: ['DFS traversal', 'Merge step in merge sort', 'Binary search tree rotations', 'Prim’s algorithm'], correctAnswer: 1, explanation: 'Merge sort’s core step is merging sorted halves.', hint: 'Sorting context.', difficulty: 'easy' }
  ],

  // Modular Arithmetic
  'modular-arithmetic': [
    { id: 'mod-1', question: 'a ≡ b (mod m) means:', options: ['a/b = m', 'm divides (a − b)', 'a = b', 'a and b are coprime'], correctAnswer: 1, explanation: 'By definition, a ≡ b (mod m) iff m | (a − b).', hint: 'Divisibility.', difficulty: 'easy' },
    { id: 'mod-2', question: 'Fast modular exponentiation time:', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(√n)'], correctAnswer: 1, explanation: 'Exponentiation by squaring under mod reduces multiplications to logarithmic.', hint: 'Binary exponentiation.', difficulty: 'medium' },
    { id: 'mod-3', question: 'When does a modular inverse exist?', options: ['Always', 'Only if gcd(a, m) = 1', 'Only if m is prime', 'Only if a is even'], correctAnswer: 1, explanation: 'Inverse exists if and only if a and m are coprime.', hint: 'Coprime condition.', difficulty: 'medium' },
    { id: 'mod-4', question: 'Fermat’s little theorem states:', options: ['a^(p−1) ≡ 1 (mod p) for prime p and a not divisible by p', 'a^p ≡ ap (mod p)', 'p divides a', 'a is prime'], correctAnswer: 0, explanation: 'Used for inverse when modulus is prime.', hint: 'Exponent p−1.', difficulty: 'hard' },
    { id: 'mod-5', question: 'CRT combines solutions:', options: ['Across non-coprime moduli', 'Across coprime moduli', 'Across prime only', 'Across equal moduli'], correctAnswer: 1, explanation: 'Classical CRT requires pairwise coprime moduli.', hint: 'Coprime product.', difficulty: 'medium' }
  ],

  // Palindrome Check (alias for string use-case)
  'palindrome-check': [
    { id: 'palchk-1', question: 'Two-pointer palindrome check runs in:', options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n²)'], correctAnswer: 1, explanation: 'We compare pairs from both ends in linear time.', hint: 'Left/right indices.', difficulty: 'easy' },
    { id: 'palchk-2', question: 'Preprocessing recommended for phrases:', options: ['Uppercase only', 'Normalize by stripping non-alphanumerics and lowercasing', 'Reverse string first', 'Hashing'], correctAnswer: 1, explanation: 'Normalize to ensure semantics are correct.', hint: 'Normalize input.', difficulty: 'medium' },
    { id: 'palchk-3', question: 'Space of iterative approach:', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correctAnswer: 0, explanation: 'Only indices and few variables used.', hint: 'Constant memory.', difficulty: 'easy' },
    { id: 'palchk-4', question: 'Why recursion increases space?', options: ['Stores whole string', 'Uses call stack frames proportional to n', 'Allocates set', 'Creates trie'], correctAnswer: 1, explanation: 'Recursive depth adds stack frames.', hint: 'Stack usage.', difficulty: 'medium' },
    { id: 'palchk-5', question: 'Which is true?', options: ['Palindromes must be dictionary words', 'Even-length palindromes exist only', 'Odd and even lengths are possible', 'Only lowercase allowed'], correctAnswer: 2, explanation: 'Both odd and even length palindromes are possible.', hint: 'Racecar vs abba.', difficulty: 'easy' }
  ],

  // Two Pointers Intro
  'two-pointers-intro': [
    { id: 'tpintro-1', question: 'Two pointers technique is useful for:', options: ['Heap property', 'Sorted arrays, sliding windows, partitioning', 'Tree rotations', 'Graph coloring'], correctAnswer: 1, explanation: 'Two pointers shine in problems with monotonic movement and contiguous windows.', hint: 'Move left/right indices.', difficulty: 'easy' },
    { id: 'tpintro-2', question: 'Invariant for container-with-most-water:', options: ['Move taller line', 'Move shorter line to seek higher area', 'Move random', 'Sort heights'], correctAnswer: 1, explanation: 'Only increasing the limiting height can improve area.', hint: 'Limiting side.', difficulty: 'medium' },
    { id: 'tpintro-3', question: 'Longest unique substring uses:', options: ['Stack', 'Hash map with sliding window', 'Priority queue', 'Union-Find'], correctAnswer: 1, explanation: 'Maintain counts and shrink on duplicates.', hint: 'Frequency map.', difficulty: 'easy' },
    { id: 'tpintro-4', question: 'Minimum window substring shrinks when:', options: ['Any time', 'Window remains valid after removing left char', 'When duplicate appears', 'Never'], correctAnswer: 1, explanation: 'Shrink while still satisfying required counts.', hint: 'Validity check.', difficulty: 'hard' },
    { id: 'tpintro-5', question: 'When is two pointers not suitable?', options: ['On sorted arrays', 'When ordering or window structure is absent', 'On strings', 'On linked lists'], correctAnswer: 1, explanation: 'Without an order or window property, two pointers rarely helps.', hint: 'Needs structure.', difficulty: 'medium' }
  ],

  // Word Search
  'word-search': [
    { id: 'wsearch-1', question: 'Word Search (board path finding) commonly uses:', options: ['BFS in grid only', 'DFS/backtracking on grid', 'Dijkstra', 'Union-Find only'], correctAnswer: 1, explanation: 'We explore neighbors and backtrack when paths fail.', hint: 'Explore and backtrack.', difficulty: 'easy' },
    { id: 'wsearch-2', question: 'Pruning condition in Word Search:', options: ['Stop at any mismatch', 'Continue until end', 'Always explore all neighbors', 'Sort board'], correctAnswer: 0, explanation: 'If a character mismatches expected letter, prune the branch.', hint: 'Mismatch => backtrack.', difficulty: 'medium' },
    { id: 'wsearch-3', question: 'Visited tracking prevents:', options: ['Correctness', 'Cycles and reusing same cell', 'Faster runtime', 'Out of bounds'], correctAnswer: 1, explanation: 'Marking visited avoids revisiting a cell within current path.', hint: 'Per path visited.', difficulty: 'medium' },
    { id: 'wsearch-4', question: 'Space complexity driver:', options: ['Queue size', 'Recursion depth and visited set', 'Priority queue', 'Sorting'], correctAnswer: 1, explanation: 'DFS recursion depth and the visited tracking dominate space.', hint: 'Depth and marks.', difficulty: 'hard' },
    { id: 'wsearch-5', question: 'Optimization often used:', options: ['Heap sort', 'Trie of dictionary words', 'Counting sort', 'AVL rotations'], correctAnswer: 1, explanation: 'Building a trie enables efficient pruning when matching many words.', hint: 'Prefix pruning.', difficulty: 'hard' }
  ]
};

export const getQuizQuestions = (topicId: string): QuizQuestion[] => {
  return quizData[topicId] || [];
};
