import fs from 'fs';

// Read the topics file
const content = fs.readFileSync('src/data/dsaTopics.ts', 'utf8');

// List of topics that need quiz questions only (already have other components)
const topicsNeedingQuizOnly = [
    'array-basics', 'array-rotation', 'string-palindrome', 'string-search-kmp', 
    'rabin-karp', 'z-algorithm', 'manacher-algorithm', 'string-anagram',
    'linked-list-doubly', 'binary-search-tree', 'graph-dfs', 'dijkstra-algorithm',
    'bellman-ford', 'floyd-warshall', 'kruskal-algorithm', 'topological-sort',
    'merge-sort', 'quick-sort', 'insertion-sort', 'selection-sort', 'counting-sort',
    'radix-sort', 'bucket-sort', 'linear-search', 'binary-search', 'interpolation-search',
    'hash-table', 'recursion-basics', 'dp-introduction', 'longest-common-subsequence',
    'knapsack-problem', 'longest-increasing-subsequence', 'huffman-coding',
    'backtracking-intro', 'segment-tree', 'fenwick-tree', 'union-find', 'avl-tree',
    'red-black-tree', 'b-tree', 'splay-tree', 'two-pointers-intro', 'two-sum',
    'three-sum', 'container-water', 'remove-duplicates', 'merge-sorted-arrays',
    'sliding-window-basics', 'sliding-window-maximum', 'longest-substring',
    'bit-basics', 'count-set-bits', 'power-of-two', 'single-number', 'bit-subset'
];

// Quiz questions for each topic
const quizQuestions = {
    'array-basics': [
        {
            question: "What is the time complexity of accessing an element in an array by index?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctAnswer: 0,
            explanation: "Array elements can be accessed directly using their index in constant time O(1) because arrays store elements in contiguous memory locations."
        },
        {
            question: "Which operation is most expensive in a dynamic array when it needs to resize?",
            options: ["Reading an element", "Writing an element", "Inserting at the end", "Resizing the array"],
            correctAnswer: 3,
            explanation: "Resizing requires allocating new memory and copying all existing elements, making it O(n) operation, while other operations are typically O(1)."
        },
        {
            question: "What is the space complexity of an array storing n elements?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctAnswer: 2,
            explanation: "An array storing n elements requires O(n) space as each element needs memory proportional to the number of elements."
        },
        {
            question: "In most programming languages, array indices start from:",
            options: ["1", "0", "-1", "Depends on the language"],
            correctAnswer: 1,
            explanation: "Most modern programming languages use zero-based indexing, where the first element is at index 0, though some languages like MATLAB use 1-based indexing."
        },
        {
            question: "What happens when you try to access an array element beyond its bounds?",
            options: ["Returns null", "Returns 0", "Undefined behavior/Error", "Automatically resizes"],
            correctAnswer: 2,
            explanation: "Accessing beyond array bounds typically results in undefined behavior in languages like C/C++, or throws an exception in languages like Java/Python."
        }
    ],
    'array-rotation': [
        {
            question: "What is the most efficient approach to rotate an array by k positions?",
            options: ["Rotate one by one k times", "Use extra array", "Reversal algorithm", "Bubble sort approach"],
            correctAnswer: 2,
            explanation: "The reversal algorithm rotates an array in O(n) time and O(1) space by reversing the entire array, then reversing the first k elements and the remaining elements."
        },
        {
            question: "To rotate array [1,2,3,4,5] left by 2 positions, what's the result?",
            options: ["[4,5,1,2,3]", "[3,4,5,1,2]", "[2,3,4,5,1]", "[5,1,2,3,4]"],
            correctAnswer: 1,
            explanation: "Left rotation by 2 moves the first 2 elements to the end: [1,2,3,4,5] becomes [3,4,5,1,2]."
        },
        {
            question: "What optimization can be applied when k > array length?",
            options: ["Rotate k times anyway", "Use k % array.length", "Return error", "Reverse the array"],
            correctAnswer: 1,
            explanation: "When k > array length, we can use k % array.length since rotating by array length brings us back to the original position."
        },
        {
            question: "What's the time complexity of the reversal algorithm for array rotation?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctAnswer: 2,
            explanation: "The reversal algorithm performs three reversals, each taking O(n) time, resulting in overall O(n) time complexity."
        },
        {
            question: "Which rotation direction moves elements towards higher indices?",
            options: ["Left rotation", "Right rotation", "Both", "Neither"],
            correctAnswer: 1,
            explanation: "Right rotation moves elements towards higher indices (rightward), while left rotation moves elements towards lower indices."
        }
    ],
    'string-palindrome': [
        {
            question: "What is the time complexity of checking if a string is a palindrome using two pointers?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctAnswer: 2,
            explanation: "The two-pointer approach visits each character at most once, making it O(n) time complexity."
        },
        {
            question: "Which approach for palindrome checking uses O(1) space complexity?",
            options: ["Recursive approach", "Two-pointer approach", "Stack-based approach", "Array reversal"],
            correctAnswer: 1,
            explanation: "The two-pointer approach only uses a constant amount of extra space for the left and right pointers."
        },
        {
            question: "What should be the first step when checking if a phrase like 'A man, a plan, a canal: Panama' is a palindrome?",
            options: ["Convert to uppercase", "Remove non-alphanumeric characters", "Reverse the string", "Count characters"],
            correctAnswer: 1,
            explanation: "Preprocessing by removing non-alphanumeric characters and converting to lowercase is essential for phrase palindromes."
        },
        {
            question: "In the two-pointer palindrome algorithm, when do we stop the loop?",
            options: ["When left > right", "When left >= right", "When characters don't match", "When we reach the middle"],
            correctAnswer: 1,
            explanation: "We stop when left >= right because we've checked all necessary character pairs."
        },
        {
            question: "What is the space complexity of the recursive palindrome checking approach?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctAnswer: 2,
            explanation: "The recursive approach uses O(n) space due to the call stack depth in the worst case."
        }
    ],
    'string-search-kmp': [
        {
            question: "What is the main advantage of KMP algorithm over naive string matching?",
            options: ["Uses less memory", "Never backtracks in text", "Simpler implementation", "Works only with ASCII"],
            correctAnswer: 1,
            explanation: "KMP's key advantage is that it never backtracks in the text, achieving linear time complexity by using the failure function."
        },
        {
            question: "What does the LPS array in KMP algorithm represent?",
            options: ["Longest Palindromic Substring", "Longest Proper Prefix which is also Suffix", "Last Position Seen", "Linear Pattern Search"],
            correctAnswer: 1,
            explanation: "LPS stands for Longest Proper Prefix which is also Suffix, used to determine how far to shift the pattern on mismatch."
        },
        {
            question: "What is the time complexity of building the LPS array?",
            options: ["O(1)", "O(log m)", "O(m)", "O(m²)"],
            correctAnswer: 2,
            explanation: "Building the LPS array takes O(m) time where m is the length of the pattern."
        },
        {
            question: "In KMP, when a mismatch occurs at pattern[j], what do we do next?",
            options: ["Reset j to 0", "Set j = lps[j-1]", "Increment j", "Decrement j"],
            correctAnswer: 1,
            explanation: "On mismatch, we set j = lps[j-1] to utilize the previously computed failure function information."
        },
        {
            question: "What is the overall time complexity of KMP algorithm?",
            options: ["O(n)", "O(m)", "O(n + m)", "O(n * m)"],
            correctAnswer: 2,
            explanation: "KMP runs in O(n + m) time: O(m) for preprocessing the pattern and O(n) for searching the text."
        }
    ],
    'binary-search-tree': [
        {
            question: "What is the key property of a Binary Search Tree?",
            options: ["All nodes have exactly two children", "Left subtree values < root < right subtree values", "Tree is always balanced", "Nodes are stored in level order"],
            correctAnswer: 1,
            explanation: "In a BST, for any node, all values in the left subtree are less than the node's value, and all values in the right subtree are greater."
        },
        {
            question: "What is the time complexity of searching in a balanced BST?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
            correctAnswer: 1,
            explanation: "In a balanced BST, search operations take O(log n) time as we eliminate half the nodes at each level."
        },
        {
            question: "What traversal of a BST gives nodes in sorted order?",
            options: ["Preorder", "Inorder", "Postorder", "Level order"],
            correctAnswer: 1,
            explanation: "Inorder traversal of a BST visits nodes in ascending sorted order due to the BST property."
        },
        {
            question: "In the worst case, what can be the time complexity of operations in a BST?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctAnswer: 2,
            explanation: "In the worst case (skewed tree), BST operations degrade to O(n) time complexity, similar to a linked list."
        },
        {
            question: "When inserting a new node in a BST, where is it always placed?",
            options: ["At the root", "As a leaf node", "At any internal node", "At the leftmost position"],
            correctAnswer: 1,
            explanation: "New nodes are always inserted as leaf nodes in a BST, maintaining the BST property by following the appropriate path."
        }
    ],
    'merge-sort': [
        {
            question: "What is the time complexity of merge sort in all cases?",
            options: ["O(n)", "O(n log n)", "O(n²)", "O(2^n)"],
            correctAnswer: 1,
            explanation: "Merge sort consistently runs in O(n log n) time for best, average, and worst cases due to its divide-and-conquer approach."
        },
        {
            question: "What is the space complexity of merge sort?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctAnswer: 2,
            explanation: "Merge sort requires O(n) extra space for the temporary arrays used during the merge process."
        },
        {
            question: "What is the key operation in merge sort?",
            options: ["Partitioning", "Merging two sorted arrays", "Finding pivot", "Swapping elements"],
            correctAnswer: 1,
            explanation: "The key operation is merging two sorted subarrays into a single sorted array, which is done in linear time."
        },
        {
            question: "Why is merge sort considered stable?",
            options: ["It's always fast", "It uses constant space", "It preserves relative order of equal elements", "It works on any data type"],
            correctAnswer: 2,
            explanation: "Merge sort is stable because when merging, equal elements from the left subarray are placed before those from the right subarray."
        },
        {
            question: "What type of algorithm is merge sort?",
            options: ["Greedy", "Dynamic Programming", "Divide and Conquer", "Backtracking"],
            correctAnswer: 2,
            explanation: "Merge sort is a divide-and-conquer algorithm that recursively divides the array and then merges the sorted subarrays."
        }
    ],
    'quick-sort': [
        {
            question: "What is the average time complexity of quicksort?",
            options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
            correctAnswer: 1,
            explanation: "Quicksort has an average time complexity of O(n log n) when the pivot divides the array into roughly equal parts."
        },
        {
            question: "What is the worst-case time complexity of quicksort?",
            options: ["O(n)", "O(n log n)", "O(n²)", "O(2^n)"],
            correctAnswer: 2,
            explanation: "Worst case occurs when the pivot is always the smallest or largest element, leading to O(n²) time complexity."
        },
        {
            question: "What is the space complexity of quicksort?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctAnswer: 1,
            explanation: "Quicksort has O(log n) space complexity on average due to the recursive call stack, O(n) in worst case."
        },
        {
            question: "What is the key operation in quicksort?",
            options: ["Merging", "Partitioning", "Heapifying", "Searching"],
            correctAnswer: 1,
            explanation: "Partitioning is the key operation where elements are rearranged so that elements smaller than pivot come before it."
        },
        {
            question: "Which pivot selection strategy helps avoid worst-case performance?",
            options: ["Always first element", "Always last element", "Random element", "Always middle element"],
            correctAnswer: 2,
            explanation: "Random pivot selection helps avoid worst-case performance by reducing the probability of consistently poor partitions."
        }
    ],
    'insertion-sort': [
        {
            question: "What is the best-case time complexity of insertion sort?",
            options: ["O(1)", "O(n)", "O(n log n)", "O(n²)"],
            correctAnswer: 1,
            explanation: "Insertion sort performs best on already sorted arrays, achieving O(n) time complexity with minimal comparisons."
        },
        {
            question: "What is the worst-case time complexity of insertion sort?",
            options: ["O(n)", "O(n log n)", "O(n²)", "O(2^n)"],
            correctAnswer: 2,
            explanation: "Worst case occurs with reverse-sorted arrays, requiring O(n²) comparisons and shifts."
        },
        {
            question: "What is the space complexity of insertion sort?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctAnswer: 0,
            explanation: "Insertion sort is an in-place algorithm using only O(1) extra space for variables."
        },
        {
            question: "When is insertion sort most efficient?",
            options: ["Large random arrays", "Small or nearly sorted arrays", "Reverse sorted arrays", "Arrays with duplicates"],
            correctAnswer: 1,
            explanation: "Insertion sort is most efficient for small arrays or nearly sorted data due to its adaptive nature."
        },
        {
            question: "What is the key characteristic of insertion sort?",
            options: ["Divides array in half", "Finds minimum element", "Builds sorted portion one element at a time", "Uses pivot element"],
            correctAnswer: 2,
            explanation: "Insertion sort builds the final sorted array one element at a time by inserting each element into its correct position."
        }
    ],
    'selection-sort': [
        {
            question: "What is the time complexity of selection sort in all cases?",
            options: ["O(n)", "O(n log n)", "O(n²)", "Depends on input"],
            correctAnswer: 2,
            explanation: "Selection sort always performs O(n²) comparisons regardless of input order, making it inefficient for large datasets."
        },
        {
            question: "What is the space complexity of selection sort?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctAnswer: 0,
            explanation: "Selection sort is an in-place algorithm requiring only O(1) extra space for temporary variables."
        },
        {
            question: "How many swaps does selection sort perform in the worst case?",
            options: ["O(1)", "O(n)", "O(n log n)", "O(n²)"],
            correctAnswer: 1,
            explanation: "Selection sort performs at most n-1 swaps, one for each position, making it efficient when swapping is expensive."
        },
        {
            question: "What is the main operation in each iteration of selection sort?",
            options: ["Find maximum element", "Find minimum element", "Partition array", "Merge subarrays"],
            correctAnswer: 1,
            explanation: "In each iteration, selection sort finds the minimum element from the unsorted portion and places it at the beginning."
        },
        {
            question: "When might selection sort be preferred over other O(n²) algorithms?",
            options: ["When memory is limited", "When swapping is expensive", "When array is large", "When stability is required"],
            correctAnswer: 1,
            explanation: "Selection sort minimizes the number of swaps, making it useful when swapping elements is costly."
        }
    ],
    'linear-search': [
        {
            question: "What is the time complexity of linear search?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctAnswer: 2,
            explanation: "Linear search examines each element sequentially, resulting in O(n) time complexity in the worst case."
        },
        {
            question: "What is the space complexity of linear search?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctAnswer: 0,
            explanation: "Linear search uses only a constant amount of extra space for variables, making it O(1) space complexity."
        },
        {
            question: "When is linear search preferred over binary search?",
            options: ["Array is sorted", "Array is unsorted", "Array is large", "Array has duplicates"],
            correctAnswer: 1,
            explanation: "Linear search works on unsorted arrays, while binary search requires the array to be sorted first."
        },
        {
            question: "What is the best-case time complexity of linear search?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctAnswer: 0,
            explanation: "Best case occurs when the target element is found at the first position, taking O(1) time."
        },
        {
            question: "What optimization can improve linear search performance?",
            options: ["Sort the array first", "Use sentinel search", "Use binary search", "Use hash table"],
            correctAnswer: 1,
            explanation: "Sentinel search places the target at the end of the array, eliminating bounds checking in the loop."
        }
    ],
    'binary-search': [
        {
            question: "What is the time complexity of binary search?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
            correctAnswer: 1,
            explanation: "Binary search eliminates half the search space in each iteration, resulting in O(log n) time complexity."
        },
        {
            question: "What is the prerequisite for binary search?",
            options: ["Array must be large", "Array must be sorted", "Array must have unique elements", "Array must be in memory"],
            correctAnswer: 1,
            explanation: "Binary search requires the array to be sorted to work correctly by comparing with middle elements."
        },
        {
            question: "What is the space complexity of iterative binary search?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctAnswer: 0,
            explanation: "Iterative binary search uses only a constant amount of extra space for variables like left, right, and mid."
        },
        {
            question: "In binary search, how do you calculate the middle index to avoid overflow?",
            options: ["mid = (left + right) / 2", "mid = left + (right - left) / 2", "mid = right / 2", "mid = left / 2"],
            correctAnswer: 1,
            explanation: "Using left + (right - left) / 2 prevents integer overflow that could occur with (left + right) / 2."
        },
        {
            question: "What does binary search return when the target is not found?",
            options: ["0", "-1 or null", "The closest element", "Throws exception"],
            correctAnswer: 1,
            explanation: "Binary search typically returns -1 or null to indicate the element is not present in the array."
        }
    ],
    'rabin-karp': [
        {
            question: "What is the key technique used in Rabin-Karp algorithm?",
            options: ["Binary search", "Rolling hash", "Dynamic programming", "Divide and conquer"],
            correctAnswer: 1,
            explanation: "Rabin-Karp uses rolling hash to efficiently compute hash values for sliding windows in constant time."
        },
        {
            question: "Why do we need character-by-character verification in Rabin-Karp?",
            options: ["To improve performance", "To handle hash collisions", "To reduce memory usage", "To support Unicode"],
            correctAnswer: 1,
            explanation: "Hash collisions can occur where different strings have the same hash value, so we verify matches character by character."
        },
        {
            question: "What is the average time complexity of Rabin-Karp algorithm?",
            options: ["O(n)", "O(m)", "O(n + m)", "O(n * m)"],
            correctAnswer: 2,
            explanation: "On average, Rabin-Karp runs in O(n + m) time due to few hash collisions, though worst case is O(nm)."
        },
        {
            question: "What happens when we slide the window in rolling hash?",
            options: ["Recalculate entire hash", "Remove leftmost, add rightmost character", "Sort the characters", "Reverse the string"],
            correctAnswer: 1,
            explanation: "Rolling hash efficiently updates by removing the leftmost character's contribution and adding the new rightmost character."
        },
        {
            question: "Which application benefits most from Rabin-Karp's ability to search multiple patterns?",
            options: ["Text compression", "Plagiarism detection", "Data encryption", "Image processing"],
            correctAnswer: 1,
            explanation: "Plagiarism detection often needs to search for multiple patterns simultaneously, making Rabin-Karp ideal."
        }
    ],
    'string-anagram': [
        {
            question: "What is the most efficient approach to check if two strings are anagrams?",
            options: ["Sort both strings", "Use frequency counting", "Use nested loops", "Convert to arrays"],
            correctAnswer: 1,
            explanation: "Frequency counting using a hash map or array is most efficient, running in O(n) time with O(1) space for fixed alphabet."
        },
        {
            question: "What is the time complexity of the sorting approach for anagram detection?",
            options: ["O(n)", "O(n log n)", "O(n²)", "O(2^n)"],
            correctAnswer: 1,
            explanation: "Sorting both strings takes O(n log n) time, then comparing the sorted strings takes O(n) time."
        },
        {
            question: "What is the space complexity of frequency counting approach for anagram detection?",
            options: ["O(1)", "O(n)", "O(n²)", "O(log n)"],
            correctAnswer: 0,
            explanation: "For a fixed alphabet (like ASCII), frequency counting uses O(1) space regardless of string length."
        },
        {
            question: "Which of these string pairs are anagrams?",
            options: ["'abc' and 'bca'", "'hello' and 'world'", "'listen' and 'silent'", "Both A and C"],
            correctAnswer: 3,
            explanation: "'abc' and 'bca' are anagrams, and 'listen' and 'silent' are anagrams as they contain the same characters."
        },
        {
            question: "What should be checked first when determining if two strings are anagrams?",
            options: ["Character frequencies", "String lengths", "First characters", "Last characters"],
            correctAnswer: 1,
            explanation: "If two strings have different lengths, they cannot be anagrams, so length comparison is an efficient first check."
        }
    ],
    'linked-list-doubly': [
        {
            question: "What is the main advantage of a doubly linked list over a singly linked list?",
            options: ["Uses less memory", "Faster insertion", "Bidirectional traversal", "Better cache performance"],
            correctAnswer: 2,
            explanation: "Doubly linked lists allow traversal in both directions due to the previous pointer in each node."
        },
        {
            question: "What is the space overhead of a doubly linked list compared to a singly linked list?",
            options: ["Same space", "One extra pointer per node", "Double the space", "Logarithmic extra space"],
            correctAnswer: 1,
            explanation: "Doubly linked lists require an extra pointer per node (the previous pointer), increasing memory overhead."
        },
        {
            question: "What is the time complexity of deleting a node when you have a reference to it in a doubly linked list?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctAnswer: 0,
            explanation: "With a reference to the node, deletion is O(1) because you can directly update the previous and next pointers."
        },
        {
            question: "In a doubly linked list, what pointers need to be updated when inserting a new node?",
            options: ["Only next pointers", "Only previous pointers", "Both next and previous pointers", "No pointers"],
            correctAnswer: 2,
            explanation: "Insertion requires updating both next and previous pointers to maintain the bidirectional links."
        },
        {
            question: "What is the time complexity of searching for an element in a doubly linked list?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctAnswer: 2,
            explanation: "Searching requires traversing the list sequentially, resulting in O(n) time complexity in the worst case."
        }
    ],
    'counting-sort': [
        {
            question: "What is the time complexity of counting sort?",
            options: ["O(n)", "O(n + k)", "O(n log n)", "O(n²)"],
            correctAnswer: 1,
            explanation: "Counting sort runs in O(n + k) time where n is the number of elements and k is the range of input values."
        },
        {
            question: "What is the space complexity of counting sort?",
            options: ["O(1)", "O(n)", "O(k)", "O(n + k)"],
            correctAnswer: 3,
            explanation: "Counting sort requires O(k) space for the counting array and O(n) space for the output array, totaling O(n + k)."
        },
        {
            question: "When is counting sort most efficient?",
            options: ["Large range of values", "Small range of values", "Negative numbers", "Floating point numbers"],
            correctAnswer: 1,
            explanation: "Counting sort is most efficient when the range of possible values (k) is small compared to the number of elements (n)."
        },
        {
            question: "What type of sorting algorithm is counting sort?",
            options: ["Comparison-based", "Non-comparison based", "In-place", "Recursive"],
            correctAnswer: 1,
            explanation: "Counting sort is a non-comparison based sorting algorithm that doesn't compare elements directly but uses arithmetic operations."
        },
        {
            question: "What is a limitation of counting sort?",
            options: ["Only works on integers", "Requires extra space", "Not stable", "All of the above"],
            correctAnswer: 1,
            explanation: "Counting sort works best with integers or objects that can be mapped to integers within a small range."
        }
    ],
    'radix-sort': [
        {
            question: "What is the time complexity of radix sort?",
            options: ["O(n)", "O(n log n)", "O(d × (n + k))", "O(n²)"],
            correctAnswer: 2,
            explanation: "Radix sort runs in O(d × (n + k)) time where d is the number of digits, n is the number of elements, and k is the range of each digit."
        },
        {
            question: "Which sorting algorithm does radix sort typically use as a subroutine?",
            options: ["Quick sort", "Merge sort", "Counting sort", "Bubble sort"],
            correctAnswer: 2,
            explanation: "Radix sort typically uses counting sort as a stable subroutine to sort by individual digits."
        },
        {
            question: "When is radix sort most efficient compared to comparison-based algorithms?",
            options: ["When d is large", "When d × log(n + k) < log n", "When n is small", "When k is large"],
            correctAnswer: 1,
            explanation: "Radix sort is most efficient when the number of digits (d) is small relative to log n, making O(d × (n + k)) better than O(n log n)."
        },
        {
            question: "What is the key requirement for radix sort to work correctly?",
            options: ["Elements must be unique", "Subroutine must be stable", "Array must be sorted", "Elements must be positive"],
            correctAnswer: 1,
            explanation: "The subroutine used for sorting individual digits must be stable to preserve the relative order established by previous digit sorts."
        },
        {
            question: "In which direction should radix sort process digits for correctness?",
            options: ["Most significant to least significant", "Least significant to most significant", "Random order", "Doesn't matter"],
            correctAnswer: 1,
            explanation: "Radix sort must process digits from least significant to most significant to work correctly with a stable subroutine."
        }
    ],
    'bucket-sort': [
        {
            question: "What is the average time complexity of bucket sort?",
            options: ["O(n)", "O(n + k)", "O(n log n)", "O(n²)"],
            correctAnswer: 1,
            explanation: "Bucket sort has O(n + k) average time complexity when elements are uniformly distributed across buckets."
        },
        {
            question: "What is the worst-case time complexity of bucket sort?",
            options: ["O(n)", "O(n log n)", "O(n²)", "O(n³)"],
            correctAnswer: 2,
            explanation: "Worst case occurs when all elements fall into one bucket, requiring O(n²) time to sort that bucket."
        },
        {
            question: "What is the key assumption for bucket sort to perform well?",
            options: ["Elements are integers", "Elements are uniformly distributed", "Array is small", "Elements are unique"],
            correctAnswer: 1,
            explanation: "Bucket sort performs well when input elements are uniformly distributed across the range, ensuring balanced bucket sizes."
        },
        {
            question: "What sorting algorithm is typically used to sort individual buckets?",
            options: ["Bubble sort", "Insertion sort", "Quick sort", "Any comparison-based sort"],
            correctAnswer: 3,
            explanation: "Any efficient comparison-based sorting algorithm can be used to sort individual buckets, often insertion sort for small buckets."
        },
        {
            question: "What is the main disadvantage of bucket sort?",
            options: ["High time complexity", "Requires uniform distribution", "Not stable", "Uses recursion"],
            correctAnswer: 1,
            explanation: "The main disadvantage is that bucket sort requires uniform data distribution to perform well; skewed data degrades performance."
        }
    ],
    'hash-table': [
        {
            question: "What is the average time complexity for search, insert, and delete operations in a hash table?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
            correctAnswer: 0,
            explanation: "Hash tables provide O(1) average time complexity for basic operations due to direct key-to-index mapping via hash functions."
        },
        {
            question: "What is the worst-case time complexity for hash table operations?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctAnswer: 2,
            explanation: "Worst case occurs when all keys hash to the same index, creating a long chain that requires O(n) time to traverse."
        },
        {
            question: "What is the purpose of a hash function?",
            options: ["Sort the keys", "Map keys to array indices", "Encrypt data", "Compress data"],
            correctAnswer: 1,
            explanation: "A hash function maps keys to array indices, enabling direct access to stored values in the hash table."
        },
        {
            question: "What happens when two keys hash to the same index?",
            options: ["One key is rejected", "A collision occurs", "The table resizes", "Keys are sorted"],
            correctAnswer: 1,
            explanation: "When two keys hash to the same index, a collision occurs, which must be resolved using techniques like chaining or open addressing."
        },
        {
            question: "What makes a good hash function?",
            options: ["Always returns 0", "Minimizes collisions", "Uniform distribution of keys", "Both B and C"],
            correctAnswer: 3,
            explanation: "A good hash function minimizes collisions and distributes keys uniformly across the hash table to maintain optimal performance."
        }
    ],
    'recursion-basics': [
        {
            question: "What is the essential component that prevents infinite recursion?",
            options: ["Loop condition", "Base case", "Return statement", "Function call"],
            correctAnswer: 1,
            explanation: "A base case is essential to stop the recursive calls and prevent infinite recursion by providing a condition where the function returns without calling itself."
        },
        {
            question: "What is the space complexity of a recursive function that makes n recursive calls?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctAnswer: 2,
            explanation: "Each recursive call adds a new frame to the call stack, so n recursive calls require O(n) space to store all the stack frames."
        },
        {
            question: "Which of these problems is naturally suited for recursion?",
            options: ["Linear search", "Bubble sort", "Tree traversal", "Array rotation"],
            correctAnswer: 2,
            explanation: "Tree traversal is naturally recursive because trees have a recursive structure where each subtree is also a tree."
        },
        {
            question: "What happens when a recursive function lacks a proper base case?",
            options: ["Compilation error", "Stack overflow", "Infinite loop", "Memory leak"],
            correctAnswer: 1,
            explanation: "Without a proper base case, recursive calls continue indefinitely, eventually causing a stack overflow when the call stack runs out of space."
        },
        {
            question: "In the recursive calculation of factorial, what is the base case?",
            options: ["n = 0 or n = 1", "n > 1", "n < 0", "n = 2"],
            correctAnswer: 0,
            explanation: "The base case for factorial is when n equals 0 or 1, both of which return 1, stopping the recursive calls."
        }
    ],
    'dp-introduction': [
        {
            question: "What is the main principle behind dynamic programming?",
            options: ["Divide and conquer", "Optimal substructure and overlapping subproblems", "Greedy choice", "Backtracking"],
            correctAnswer: 1,
            explanation: "Dynamic programming works on problems that have optimal substructure (optimal solution contains optimal solutions to subproblems) and overlapping subproblems."
        },
        {
            question: "What is memoization in dynamic programming?",
            options: ["Storing results of subproblems", "Forgetting previous calculations", "Using more memory", "Recursive function calls"],
            correctAnswer: 0,
            explanation: "Memoization is the technique of storing the results of expensive function calls and returning the cached result when the same inputs occur again."
        },
        {
            question: "Which approach builds solutions from smaller subproblems to larger ones?",
            options: ["Top-down DP", "Bottom-up DP", "Memoization", "Recursion"],
            correctAnswer: 1,
            explanation: "Bottom-up DP (tabulation) starts with the smallest subproblems and builds up to the final solution, typically using iteration."
        },
        {
            question: "What is the time complexity improvement of DP over naive recursion for Fibonacci?",
            options: ["O(n) vs O(2^n)", "O(log n) vs O(n)", "O(n²) vs O(n³)", "O(1) vs O(n)"],
            correctAnswer: 0,
            explanation: "DP reduces Fibonacci from exponential O(2^n) time complexity to linear O(n) by avoiding redundant calculations."
        },
        {
            question: "What is space optimization in DP?",
            options: ["Using less memory", "Keeping only necessary previous states", "Reducing time complexity", "Both A and B"],
            correctAnswer: 3,
            explanation: "Space optimization in DP involves keeping only the necessary previous states (like previous row in 2D DP) instead of storing the entire table."
        }
    ],
    'graph-dfs': [
        {
            question: "What data structure is typically used to implement DFS?",
            options: ["Queue", "Stack", "Heap", "Array"],
            correctAnswer: 1,
            explanation: "DFS uses a stack (either explicitly or implicitly through recursion) to keep track of vertices to visit, following the Last-In-First-Out principle."
        },
        {
            question: "What is the time complexity of DFS for a graph with V vertices and E edges?",
            options: ["O(V)", "O(E)", "O(V + E)", "O(V * E)"],
            correctAnswer: 2,
            explanation: "DFS visits each vertex once and examines each edge once, resulting in O(V + E) time complexity."
        },
        {
            question: "In which scenario would DFS be preferred over BFS?",
            options: ["Finding shortest path", "Detecting cycles", "Level-order traversal", "Finding minimum spanning tree"],
            correctAnswer: 1,
            explanation: "DFS is particularly good for detecting cycles in graphs because it can easily detect back edges that indicate cycles."
        },
        {
            question: "What is the space complexity of recursive DFS?",
            options: ["O(1)", "O(V)", "O(E)", "O(V + E)"],
            correctAnswer: 1,
            explanation: "Recursive DFS uses O(V) space in the worst case due to the recursion stack, which can go as deep as the number of vertices."
        },
        {
            question: "Which traversal order does DFS follow?",
            options: ["Breadth-first", "Depth-first", "Level-order", "Random"],
            correctAnswer: 1,
            explanation: "DFS follows depth-first order, exploring as far as possible along each branch before backtracking."
        }
    ],
    'segment-tree': [
        {
            question: "What is the primary use case for a segment tree?",
            options: ["Sorting arrays", "Range queries and updates", "Graph traversal", "String matching"],
            correctAnswer: 1,
            explanation: "Segment trees are specifically designed for efficient range queries and updates on arrays, supporting operations like range sum, minimum, maximum in O(log n) time."
        },
        {
            question: "What is the time complexity of range query operations in a segment tree?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
            correctAnswer: 1,
            explanation: "Range queries in a segment tree take O(log n) time because we traverse at most O(log n) levels of the tree to combine relevant segments."
        },
        {
            question: "How much space does a segment tree require for an array of size n?",
            options: ["O(n)", "O(2n)", "O(4n)", "O(n log n)"],
            correctAnswer: 2,
            explanation: "A segment tree requires O(4n) space in the worst case, though often less in practice. This accounts for the complete binary tree structure."
        },
        {
            question: "What is lazy propagation in segment trees?",
            options: ["Slow query processing", "Delaying updates for efficiency", "Lazy initialization", "Postponed tree construction"],
            correctAnswer: 1,
            explanation: "Lazy propagation delays updates to child nodes until they're actually needed, improving efficiency for range update operations."
        },
        {
            question: "What type of problems are segment trees most suitable for?",
            options: ["Single element queries", "Range queries with updates", "Static array problems", "String processing"],
            correctAnswer: 1,
            explanation: "Segment trees excel at problems requiring frequent range queries and updates, where both operations need to be efficient."
        }
    ],
    'fenwick-tree': [
        {
            question: "What is another name for a Fenwick Tree?",
            options: ["Binary Tree", "Binary Indexed Tree", "Balanced Tree", "Binary Search Tree"],
            correctAnswer: 1,
            explanation: "Fenwick Tree is also known as Binary Indexed Tree (BIT), named after its inventor Peter Fenwick."
        },
        {
            question: "What is the space complexity of a Fenwick Tree for an array of size n?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
            correctAnswer: 2,
            explanation: "Fenwick Tree uses O(n) space, which is more space-efficient than segment trees that require O(4n) space."
        },
        {
            question: "What operation does the expression 'i & (-i)' perform in Fenwick Tree?",
            options: ["Find parent", "Find last set bit", "Find next index", "Find tree height"],
            correctAnswer: 1,
            explanation: "The expression 'i & (-i)' isolates the last set bit (rightmost 1-bit) in the binary representation of i, which is crucial for Fenwick Tree operations."
        },
        {
            question: "What is the time complexity of prefix sum query in Fenwick Tree?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
            correctAnswer: 1,
            explanation: "Prefix sum queries in Fenwick Tree take O(log n) time by traversing up the tree using the last set bit operation."
        },
        {
            question: "Compared to segment trees, what is the main advantage of Fenwick Trees?",
            options: ["Faster queries", "More operations supported", "Simpler implementation and less space", "Better for range updates"],
            correctAnswer: 2,
            explanation: "Fenwick Trees have simpler implementation, use less space (O(n) vs O(4n)), and have better constant factors, though they support fewer types of operations."
        }
    ],
    'union-find': [
        {
            question: "What is the main purpose of Union-Find data structure?",
            options: ["Sorting elements", "Managing disjoint sets", "Tree traversal", "Graph coloring"],
            correctAnswer: 1,
            explanation: "Union-Find (Disjoint Set Union) is designed to efficiently manage a collection of disjoint sets with union and find operations."
        },
        {
            question: "What does path compression optimization do in Union-Find?",
            options: ["Reduces memory usage", "Makes find operations faster", "Balances the tree", "Compresses data"],
            correctAnswer: 1,
            explanation: "Path compression flattens the tree structure during find operations, making future find operations on the same path much faster."
        },
        {
            question: "What is the amortized time complexity of Union-Find operations with both optimizations?",
            options: ["O(1)", "O(α(n))", "O(log n)", "O(n)"],
            correctAnswer: 1,
            explanation: "With path compression and union by rank/size, Union-Find operations have O(α(n)) amortized time complexity, where α is the inverse Ackermann function (practically constant)."
        },
        {
            question: "What does union by rank optimization do?",
            options: ["Sorts elements by value", "Attaches smaller tree to larger tree", "Compresses paths", "Balances all trees"],
            correctAnswer: 1,
            explanation: "Union by rank attaches the tree with smaller rank (height) to the root of the tree with larger rank, keeping trees shallow."
        },
        {
            question: "Which algorithm commonly uses Union-Find data structure?",
            options: ["Dijkstra's algorithm", "Kruskal's MST algorithm", "Binary search", "Merge sort"],
            correctAnswer: 1,
            explanation: "Kruskal's algorithm for finding Minimum Spanning Tree uses Union-Find to efficiently detect cycles and manage connected components."
        }
    ],
    'recursion-basics': [
        {
            question: "What is the base case in recursion?",
            options: ["The first recursive call", "The condition that stops recursion", "The most complex case", "The return statement"],
            correctAnswer: 1,
            explanation: "The base case is the condition that stops the recursion from continuing, preventing infinite recursive calls."
        },
        {
            question: "What happens if a recursive function lacks a proper base case?",
            options: ["It runs faster", "It causes stack overflow", "It returns null", "It works normally"],
            correctAnswer: 1,
            explanation: "Without a proper base case, recursion continues indefinitely, eventually causing a stack overflow error."
        },
        {
            question: "What is the space complexity of a recursive function with n recursive calls?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctAnswer: 2,
            explanation: "Each recursive call adds a new frame to the call stack, so n recursive calls require O(n) space."
        },
        {
            question: "Which of these is a classic example of recursion?",
            options: ["Linear search", "Bubble sort", "Factorial calculation", "Hash table lookup"],
            correctAnswer: 2,
            explanation: "Factorial calculation (n! = n × (n-1)!) is a classic recursive problem where the solution depends on smaller instances."
        },
        {
            question: "What is tail recursion?",
            options: ["Recursion at the end of a program", "Recursion where the recursive call is the last operation", "Recursion with multiple base cases", "Recursion that returns a tail"],
            correctAnswer: 1,
            explanation: "Tail recursion occurs when the recursive call is the last operation in the function, allowing for optimization."
        }
    ],
    'dp-introduction': [
        {
            question: "What is the main principle behind dynamic programming?",
            options: ["Divide and conquer", "Storing solutions to subproblems", "Greedy choices", "Random sampling"],
            correctAnswer: 1,
            explanation: "Dynamic programming stores solutions to subproblems to avoid redundant calculations, using memoization or tabulation."
        },
        {
            question: "What is memoization in dynamic programming?",
            options: ["A memory allocation technique", "Top-down approach with caching", "Bottom-up table filling", "A sorting algorithm"],
            correctAnswer: 1,
            explanation: "Memoization is a top-down approach where we cache the results of function calls to avoid recomputation."
        },
        {
            question: "What is tabulation in dynamic programming?",
            options: ["Creating tables in databases", "Bottom-up approach filling a table", "Top-down recursive approach", "A data structure"],
            correctAnswer: 1,
            explanation: "Tabulation is a bottom-up approach where we fill a table iteratively, starting from the smallest subproblems."
        },
        {
            question: "Which property must a problem have to use dynamic programming?",
            options: ["Optimal substructure", "Overlapping subproblems", "Both A and B", "Greedy choice property"],
            correctAnswer: 2,
            explanation: "Dynamic programming requires both optimal substructure (optimal solution contains optimal solutions to subproblems) and overlapping subproblems."
        },
        {
            question: "What is the time complexity improvement of DP over naive recursion for Fibonacci?",
            options: ["O(n) vs O(2^n)", "O(log n) vs O(n)", "O(n²) vs O(n³)", "O(1) vs O(n)"],
            correctAnswer: 0,
            explanation: "DP reduces Fibonacci from exponential O(2^n) naive recursion to linear O(n) time by avoiding redundant calculations."
        }
    ],
    'graph-dfs': [
        {
            question: "What data structure is typically used to implement DFS?",
            options: ["Queue", "Stack", "Heap", "Array"],
            correctAnswer: 1,
            explanation: "DFS uses a stack (either explicitly or implicitly through recursion) to keep track of vertices to visit."
        },
        {
            question: "What is the time complexity of DFS for a graph with V vertices and E edges?",
            options: ["O(V)", "O(E)", "O(V + E)", "O(V × E)"],
            correctAnswer: 2,
            explanation: "DFS visits each vertex once and examines each edge once, resulting in O(V + E) time complexity."
        },
        {
            question: "In which order does DFS visit vertices?",
            options: ["Breadth-first order", "Depth-first order", "Random order", "Sorted order"],
            correctAnswer: 1,
            explanation: "DFS explores as far as possible along each branch before backtracking, visiting vertices in depth-first order."
        },
        {
            question: "What is DFS commonly used for?",
            options: ["Finding shortest paths", "Detecting cycles", "Both A and B", "Sorting vertices"],
            correctAnswer: 1,
            explanation: "DFS is commonly used for detecting cycles, topological sorting, and finding connected components, but not for shortest paths."
        },
        {
            question: "What happens when DFS encounters a visited vertex?",
            options: ["It visits it again", "It skips it", "It throws an error", "It restarts"],
            correctAnswer: 1,
            explanation: "DFS skips already visited vertices to avoid infinite loops and ensure the algorithm terminates."
        }
    ],
    'segment-tree': [
        {
            question: "What is the primary purpose of a segment tree?",
            options: ["Sorting elements", "Range queries and updates", "Graph traversal", "String matching"],
            correctAnswer: 1,
            explanation: "Segment trees are designed to efficiently handle range queries (like sum, min, max) and range updates on arrays."
        },
        {
            question: "What is the time complexity of range queries in a segment tree?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
            correctAnswer: 1,
            explanation: "Segment trees provide O(log n) time complexity for range queries by traversing at most log n levels of the tree."
        },
        {
            question: "How much space does a segment tree require for an array of size n?",
            options: ["O(n)", "O(2n)", "O(4n)", "O(n²)"],
            correctAnswer: 2,
            explanation: "A segment tree requires approximately 4n space in the worst case to store all internal nodes and leaves."
        },
        {
            question: "What is lazy propagation in segment trees?",
            options: ["Delayed tree construction", "Deferred range updates", "Slow query processing", "Lazy deletion"],
            correctAnswer: 1,
            explanation: "Lazy propagation defers range updates until they're actually needed, improving efficiency for range update operations."
        },
        {
            question: "Which operation is NOT efficiently supported by basic segment trees?",
            options: ["Range sum queries", "Range minimum queries", "Point updates", "Dynamic array resizing"],
            correctAnswer: 3,
            explanation: "Basic segment trees have fixed size and don't efficiently support dynamic resizing; they're built for fixed-size arrays."
        }
    ],
    'fenwick-tree': [
        {
            question: "What is another name for Fenwick Tree?",
            options: ["Segment Tree", "Binary Indexed Tree", "AVL Tree", "Red-Black Tree"],
            correctAnswer: 1,
            explanation: "Fenwick Tree is also known as Binary Indexed Tree (BIT), named after its binary indexing scheme."
        },
        {
            question: "What is the space complexity of a Fenwick Tree for an array of size n?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
            correctAnswer: 2,
            explanation: "Fenwick Tree uses exactly n+1 space, making it very space-efficient compared to segment trees."
        },
        {
            question: "What operation does 'x & (-x)' perform in Fenwick Tree?",
            options: ["Finds parent index", "Finds the lowest set bit", "Calculates tree height", "Performs range query"],
            correctAnswer: 1,
            explanation: "The operation 'x & (-x)' isolates the lowest set bit, which is crucial for navigating the Fenwick Tree structure."
        },
        {
            question: "What is the time complexity of prefix sum queries in Fenwick Tree?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
            correctAnswer: 1,
            explanation: "Fenwick Tree provides O(log n) time complexity for prefix sum queries by traversing at most log n nodes."
        },
        {
            question: "Which type of queries are Fenwick Trees specifically optimized for?",
            options: ["Range minimum queries", "Prefix sum queries", "Range maximum queries", "String queries"],
            correctAnswer: 1,
            explanation: "Fenwick Trees are specifically designed and optimized for prefix sum queries and point updates."
        }
    ],
    'union-find': [
        {
            question: "What is the main purpose of Union-Find data structure?",
            options: ["Sorting elements", "Managing disjoint sets", "Graph traversal", "String matching"],
            correctAnswer: 1,
            explanation: "Union-Find (Disjoint Set Union) is designed to efficiently manage a collection of disjoint sets with union and find operations."
        },
        {
            question: "What does path compression do in Union-Find?",
            options: ["Reduces memory usage", "Flattens the tree structure", "Speeds up union operations", "Compresses data"],
            correctAnswer: 1,
            explanation: "Path compression flattens the tree by making nodes point directly to the root, reducing future find operation costs."
        },
        {
            question: "What is union by rank in Union-Find?",
            options: ["Sorting by element value", "Attaching smaller tree to larger tree root", "Ranking elements by priority", "Union operations in order"],
            correctAnswer: 1,
            explanation: "Union by rank attaches the tree with smaller rank to the root of the tree with larger rank, keeping trees balanced."
        },
        {
            question: "What is the amortized time complexity of Union-Find operations with optimizations?",
            options: ["O(1)", "O(α(n))", "O(log n)", "O(n)"],
            correctAnswer: 1,
            explanation: "With path compression and union by rank, Union-Find operations have O(α(n)) amortized time, where α is the inverse Ackermann function."
        },
        {
            question: "Which algorithm commonly uses Union-Find data structure?",
            options: ["Dijkstra's algorithm", "Kruskal's MST algorithm", "Binary search", "Merge sort"],
            correctAnswer: 1,
            explanation: "Kruskal's algorithm for finding Minimum Spanning Tree uses Union-Find to efficiently detect cycles and manage connected components."
        }
    ],
    'avl-tree': [
        {
            question: "What is the main property that defines an AVL tree?",
            options: ["All nodes have two children", "Height difference between subtrees is at most 1", "All leaves are at the same level", "Nodes are stored in sorted order"],
            correctAnswer: 1,
            explanation: "An AVL tree maintains the balance property where the height difference between left and right subtrees of any node is at most 1."
        },
        {
            question: "What is the time complexity of search operations in an AVL tree?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
            correctAnswer: 1,
            explanation: "AVL trees guarantee O(log n) search time due to their balanced nature, ensuring the height is always logarithmic."
        },
        {
            question: "When does an AVL tree require rotation?",
            options: ["After every insertion", "When height difference exceeds 1", "When tree becomes full", "During search operations"],
            correctAnswer: 1,
            explanation: "Rotations are performed when the balance factor (height difference between subtrees) becomes greater than 1 or less than -1."
        },
        {
            question: "What are the four types of rotations in AVL trees?",
            options: ["Left, Right, Up, Down", "Single Left, Single Right, Double Left, Double Right", "LL, RR, LR, RL", "Forward, Backward, Clockwise, Counter-clockwise"],
            correctAnswer: 2,
            explanation: "AVL trees use four rotation types: LL (Left-Left), RR (Right-Right), LR (Left-Right), and RL (Right-Left) to maintain balance."
        },
        {
            question: "What is the maximum height of an AVL tree with n nodes?",
            options: ["O(log n)", "O(n)", "O(n log n)", "O(2^n)"],
            correctAnswer: 0,
            explanation: "AVL trees maintain a maximum height of approximately 1.44 * log₂(n), which is O(log n), ensuring efficient operations."
        }
    ],
    'red-black-tree': [
        {
            question: "What are the colors used in a Red-Black tree?",
            options: ["Red and Blue", "Black and White", "Red and Black", "Green and Red"],
            correctAnswer: 2,
            explanation: "Red-Black trees use red and black colors for nodes to maintain balance properties and ensure logarithmic height."
        },
        {
            question: "What is the Red-Black tree property about red nodes?",
            options: ["Red nodes must have red children", "Red nodes cannot have red children", "Red nodes must be leaves", "Red nodes must be internal"],
            correctAnswer: 1,
            explanation: "In a Red-Black tree, red nodes cannot have red children (no two red nodes can be adjacent), ensuring the tree remains balanced."
        },
        {
            question: "What color is the root of a Red-Black tree?",
            options: ["Always red", "Always black", "Can be either", "Depends on tree size"],
            correctAnswer: 1,
            explanation: "The root of a Red-Black tree is always black, which is one of the fundamental properties of Red-Black trees."
        },
        {
            question: "What is the maximum height of a Red-Black tree with n nodes?",
            options: ["log n", "2 log n", "n", "n log n"],
            correctAnswer: 1,
            explanation: "Red-Black trees guarantee a maximum height of 2 * log₂(n + 1), ensuring O(log n) operations in the worst case."
        },
        {
            question: "What happens to leaf nodes (NIL nodes) in a Red-Black tree?",
            options: ["They are red", "They are black", "They don't exist", "They can be any color"],
            correctAnswer: 1,
            explanation: "All leaf nodes (NIL nodes) in a Red-Black tree are considered black, which helps maintain the black-height property."
        }
    ],
    'b-tree': [
        {
            question: "What is the main advantage of B-trees over binary search trees?",
            options: ["Faster search", "Less memory usage", "Better for disk storage", "Simpler implementation"],
            correctAnswer: 2,
            explanation: "B-trees are designed for disk storage systems, minimizing disk I/O operations by storing multiple keys per node and having high branching factor."
        },
        {
            question: "What is the minimum number of children a non-leaf node can have in a B-tree of order m?",
            options: ["1", "m/2", "⌈m/2⌉", "m-1"],
            correctAnswer: 2,
            explanation: "In a B-tree of order m, non-leaf nodes must have at least ⌈m/2⌉ children to maintain the B-tree properties."
        },
        {
            question: "What happens when a B-tree node becomes full during insertion?",
            options: ["Insert fails", "Node splits", "Tree rebalances", "Node expands"],
            correctAnswer: 1,
            explanation: "When a B-tree node becomes full, it splits into two nodes, with the median key promoted to the parent node."
        },
        {
            question: "What is the time complexity of search operations in a B-tree?",
            options: ["O(1)", "O(log n)", "O(n)", "O(m log n)"],
            correctAnswer: 1,
            explanation: "B-tree search operations take O(log n) time, where the logarithm base depends on the branching factor of the tree."
        },
        {
            question: "Where are all the actual data values stored in a B+ tree?",
            options: ["In all nodes", "Only in internal nodes", "Only in leaf nodes", "In root node only"],
            correctAnswer: 2,
            explanation: "In B+ trees, all actual data values are stored only in leaf nodes, while internal nodes contain only keys for navigation."
        }
    ],
    'splay-tree': [
        {
            question: "What is the key operation that makes Splay trees unique?",
            options: ["Rotation", "Splaying", "Balancing", "Splitting"],
            correctAnswer: 1,
            explanation: "Splaying is the key operation that moves accessed nodes to the root through a series of rotations, providing amortized efficiency."
        },
        {
            question: "What is the amortized time complexity of operations in a Splay tree?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
            correctAnswer: 1,
            explanation: "Splay trees provide O(log n) amortized time complexity for search, insert, and delete operations through the splaying mechanism."
        },
        {
            question: "When does splaying occur in a Splay tree?",
            options: ["Only during insertion", "Only during deletion", "After every access", "Only when tree is unbalanced"],
            correctAnswer: 2,
            explanation: "Splaying occurs after every access operation (search, insert, delete), moving the accessed node to the root."
        },
        {
            question: "What is the main advantage of Splay trees?",
            options: ["Guaranteed balance", "Simple implementation", "Locality of reference", "Minimal memory usage"],
            correctAnswer: 2,
            explanation: "Splay trees excel with locality of reference - frequently accessed elements are kept near the root, improving performance for real-world access patterns."
        },
        {
            question: "What are the three types of splay operations?",
            options: ["Zig, Zag, Zig-Zag", "Left, Right, Center", "Zig, Zig-Zig, Zig-Zag", "Single, Double, Triple"],
            correctAnswer: 2,
            explanation: "Splay operations include Zig (single rotation), Zig-Zig (double rotation same direction), and Zig-Zag (double rotation opposite directions)."
        }
    ],
    'two-pointers-intro': [
        {
            question: "What is the main idea behind the two pointers technique?",
            options: ["Use two arrays", "Use two variables to traverse", "Use two functions", "Use two loops"],
            correctAnswer: 1,
            explanation: "Two pointers technique uses two variables (pointers) to traverse data structures, often reducing time complexity from O(n²) to O(n)."
        },
        {
            question: "In which scenario is two pointers technique most commonly used?",
            options: ["Unsorted arrays", "Sorted arrays or sequences", "Linked lists only", "Trees only"],
            correctAnswer: 1,
            explanation: "Two pointers technique is most effective with sorted arrays or sequences where the sorted property can be leveraged to make decisions."
        },
        {
            question: "What is the typical time complexity improvement with two pointers?",
            options: ["O(n²) to O(n log n)", "O(n²) to O(n)", "O(n) to O(1)", "O(n log n) to O(n)"],
            correctAnswer: 1,
            explanation: "Two pointers often reduces time complexity from O(n²) brute force approaches to O(n) by eliminating the need for nested loops."
        },
        {
            question: "Which of these is a classic two pointers problem?",
            options: ["Binary search", "Two sum in sorted array", "Tree traversal", "Hash table lookup"],
            correctAnswer: 1,
            explanation: "Two sum in a sorted array is a classic two pointers problem where we use left and right pointers to find pairs that sum to a target."
        },
        {
            question: "What is the space complexity of most two pointers algorithms?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctAnswer: 0,
            explanation: "Two pointers algorithms typically use O(1) extra space since they only need a constant number of pointer variables."
        }
    ],
    'two-sum': [
        {
            question: "What is the time complexity of the two pointers approach for Two Sum in a sorted array?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctAnswer: 2,
            explanation: "The two pointers approach scans the sorted array once with left and right pointers, achieving O(n) time complexity."
        },
        {
            question: "What is the prerequisite for using two pointers approach in Two Sum?",
            options: ["Array must be large", "Array must be sorted", "Array must have duplicates", "Array must be positive"],
            correctAnswer: 1,
            explanation: "The two pointers approach for Two Sum requires the array to be sorted to make decisions about moving pointers based on sum comparison."
        },
        {
            question: "In the two pointers Two Sum approach, when do you move the left pointer?",
            options: ["When sum is too large", "When sum is too small", "When sum equals target", "Always move left first"],
            correctAnswer: 1,
            explanation: "When the current sum is smaller than the target, we move the left pointer right to increase the sum."
        },
        {
            question: "What is the space complexity of the two pointers Two Sum approach?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctAnswer: 0,
            explanation: "The two pointers approach uses only two pointer variables, requiring O(1) constant extra space."
        },
        {
            question: "How does the hash map approach for Two Sum compare to two pointers?",
            options: ["Hash map is always better", "Two pointers is always better", "Hash map works on unsorted arrays", "Both have same space complexity"],
            correctAnswer: 2,
            explanation: "Hash map approach works on unsorted arrays with O(n) time and O(n) space, while two pointers needs sorted array but uses O(1) space."
        }
    ],
    'three-sum': [
        {
            question: "What is the time complexity of the optimal Three Sum solution?",
            options: ["O(n)", "O(n log n)", "O(n²)", "O(n³)"],
            correctAnswer: 2,
            explanation: "The optimal Three Sum solution uses sorting O(n log n) plus nested loops O(n²), resulting in overall O(n²) time complexity."
        },
        {
            question: "What technique is used to avoid duplicate triplets in Three Sum?",
            options: ["Hash set", "Skipping duplicate values", "Sorting first", "Using three pointers"],
            correctAnswer: 1,
            explanation: "To avoid duplicate triplets, we skip duplicate values when moving pointers, ensuring each unique triplet is found only once."
        },
        {
            question: "How does Three Sum reduce to Two Sum?",
            options: ["By using hash maps", "By fixing one element and finding two sum for remaining", "By sorting the array", "By using recursion"],
            correctAnswer: 1,
            explanation: "Three Sum fixes one element and then uses two pointers to find Two Sum in the remaining array for the target minus the fixed element."
        },
        {
            question: "What is the space complexity of the Three Sum solution?",
            options: ["O(1)", "O(n)", "O(n²)", "O(n³)"],
            correctAnswer: 0,
            explanation: "The Three Sum solution uses O(1) extra space (not counting the output array) as it only needs a few pointer variables."
        },
        {
            question: "Why is sorting necessary in the optimal Three Sum approach?",
            options: ["To improve time complexity", "To enable two pointers technique", "To avoid duplicates", "All of the above"],
            correctAnswer: 3,
            explanation: "Sorting enables the two pointers technique, helps avoid duplicates by skipping them, and is necessary for the O(n²) solution."
        }
    ],
    'container-water': [
        {
            question: "What does the Container With Most Water problem ask for?",
            options: ["Maximum height", "Maximum area between two lines", "Maximum width", "Maximum perimeter"],
            correctAnswer: 1,
            explanation: "The problem asks for the maximum area of water that can be contained between two vertical lines in an array of heights."
        },
        {
            question: "What is the time complexity of the two pointers solution?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctAnswer: 2,
            explanation: "The two pointers approach scans the array once, moving pointers from both ends toward the center, achieving O(n) time complexity."
        },
        {
            question: "How is the area calculated in Container With Most Water?",
            options: ["height × width", "min(height1, height2) × distance", "max(height1, height2) × distance", "average height × distance"],
            correctAnswer: 1,
            explanation: "Area is calculated as min(height1, height2) × distance, since water level is limited by the shorter of the two lines."
        },
        {
            question: "When do you move the left pointer in the two pointers approach?",
            options: ["When left height > right height", "When left height < right height", "Always move left first", "When area decreases"],
            correctAnswer: 1,
            explanation: "We move the pointer at the shorter line because moving the pointer at the taller line cannot increase the area."
        },
        {
            question: "Why does the greedy approach work for Container With Most Water?",
            options: ["It tries all combinations", "Moving shorter line might find better area", "It uses dynamic programming", "It sorts the array first"],
            correctAnswer: 1,
            explanation: "The greedy approach works because moving the pointer at the shorter line is the only way to potentially find a larger area."
        }
    ],
    'bit-basics': [
        {
            question: "What is the result of 5 & 3 (bitwise AND)?",
            options: ["1", "2", "3", "5"],
            correctAnswer: 0,
            explanation: "5 (101) & 3 (011) = 001 = 1. Bitwise AND returns 1 only when both corresponding bits are 1."
        },
        {
            question: "What does the expression n & (n-1) do?",
            options: ["Checks if n is even", "Removes the rightmost set bit", "Counts set bits", "Checks if n is power of 2"],
            correctAnswer: 1,
            explanation: "n & (n-1) removes the rightmost set bit from n. This is a fundamental bit manipulation trick used in many algorithms."
        },
        {
            question: "How do you check if a number is a power of 2 using bit manipulation?",
            options: ["n & 1 == 0", "n & (n-1) == 0", "n | (n-1) == 0", "n ^ (n-1) == 0"],
            correctAnswer: 1,
            explanation: "A number is a power of 2 if n & (n-1) == 0 and n > 0, because powers of 2 have exactly one set bit."
        },
        {
            question: "What is the result of 5 ^ 3 (bitwise XOR)?",
            options: ["6", "7", "8", "2"],
            correctAnswer: 0,
            explanation: "5 (101) ^ 3 (011) = 110 = 6. XOR returns 1 when corresponding bits are different, 0 when they are the same."
        },
        {
            question: "What does left shift by 1 position (n << 1) accomplish?",
            options: ["Divides n by 2", "Multiplies n by 2", "Adds 1 to n", "Subtracts 1 from n"],
            correctAnswer: 1,
            explanation: "Left shift by 1 position multiplies the number by 2. Each left shift doubles the value by moving all bits one position left."
        }
    ]
};

// Function to add quiz questions to a topic
function addQuizToTopic(content, topicId, questions) {
    const topicRegex = new RegExp(`(\\s+id: '${topicId}',[\\s\\S]*?)(\\s+})(,?\\s*\\n\\s*{|\\s*\\];)`, 'g');
    
    const quizString = `        quizQuestions: ${JSON.stringify(questions, null, 12).replace(/^/gm, '        ')}\n`;
    
    return content.replace(topicRegex, (match, beforeClosing, closing, after) => {
        // Check if quizQuestions already exists
        if (beforeClosing.includes('quizQuestions:')) {
            return match; // Already has quiz questions
        }
        return beforeClosing + quizString + closing + after;
    });
}

// Process first batch of topics
let updatedContent = content;
let processedCount = 0;

for (const topicId of topicsNeedingQuizOnly.slice(45, 55)) { // Process topics 45-55
    if (quizQuestions[topicId]) {
        console.log(`Adding quiz questions to ${topicId}...`);
        updatedContent = addQuizToTopic(updatedContent, topicId, quizQuestions[topicId]);
        processedCount++;
    } else {
        console.log(`No quiz questions defined for ${topicId}`);
    }
}

// Write the updated content
fs.writeFileSync('src/data/dsaTopics.ts', updatedContent);

console.log(`\nCompleted ${processedCount} topics with quiz questions.`);
console.log('Build test...');