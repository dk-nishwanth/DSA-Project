export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

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
  voiceExplanation?: string; // Voice-friendly explanation for audio learning
  realWorldApplications?: string; // Practical applications in industry
  pseudocode?: string; // Step-by-step pseudocode
  keyConcepts?: string; // Essential concepts and principles
  implementationCode?: string; // Complete, accurate implementation
  quizQuestions?: QuizQuestion[]; // Interactive quiz questions for assessment
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
    spaceComplexity: 'O(1)',
    extendedDefinition: `Arrays are fundamental data structures that store elements of the same type in contiguous memory locations. Each element can be accessed directly using its index, making arrays one of the most efficient data structures for random access operations.

What it does: keeps items in order and lets you jump directly to any position by index.

How it works: indexes map to memory offsets; appending at the end is fast, inserting in the middle shifts later elements.

When to use: fast reads by position, compact storage, building blocks for higher-level structures.`,
    voiceExplanation: `Arrays are like a row of numbered boxes where you can store items. Imagine you have a street with houses numbered zero, one, two, and so on. Each house can hold one item, and you can instantly go to any house if you know its number. This is exactly how arrays work in programming. The house number is the index, and the item inside is your data. You can quickly access any element because the computer knows exactly where each element is stored in memory. Arrays are perfect when you need fast access to elements and know roughly how much data you'll be storing.`,
    realWorldApplications: `**Industry Applications:**
- **Database Systems**: Row storage and indexing mechanisms
- **Image Processing**: Pixel data representation (2D arrays)
- **Gaming**: Game boards, tile maps, inventory systems
- **Financial Systems**: Time series data, stock prices, trading algorithms
- **Scientific Computing**: Mathematical matrices, simulation grids
- **Web Development**: Form data collection, API response handling
- **Operating Systems**: Process tables, memory management
- **Embedded Systems**: Sensor data buffers, real-time data processing`,
    keyConcepts: `**Essential Concepts:**
1. **Indexing**: Direct access using array[index] notation
2. **Bounds Checking**: Ensuring index is within valid range [0, length-1]
3. **Memory Efficiency**: Contiguous storage minimizes memory overhead
4. **Cache Locality**: Sequential access patterns optimize CPU cache usage
5. **Trade-offs**: Fast access vs. fixed size limitations
6. **Dynamic vs. Static**: Understanding when to use each type
7. **Multi-dimensional Arrays**: Arrays of arrays for complex data structures`,
    pseudocode: `**Array Operations Pseudocode:**

ALGORITHM ArrayAccess(array, index)
INPUT: array - the array to access, index - position to access
OUTPUT: element at given index
BEGIN
    IF index < 0 OR index >= array.length THEN
        THROW IndexOutOfBoundsException
    END IF
    RETURN array[index]
END

ALGORITHM ArrayInsert(array, index, element)
INPUT: array, index - insertion position, element - value to insert
OUTPUT: modified array
BEGIN
    IF index < 0 OR index > array.length THEN
        THROW IndexOutOfBoundsException
    END IF
    
    FOR i = array.length - 1 DOWN TO index DO
        array[i + 1] = array[i]
    END FOR
    
    array[index] = element
    array.length = array.length + 1
END

ALGORITHM ArrayDelete(array, index)
INPUT: array, index - position to delete
OUTPUT: modified array
BEGIN
    IF index < 0 OR index >= array.length THEN
        THROW IndexOutOfBoundsException
    END IF
    
    FOR i = index TO array.length - 2 DO
        array[i] = array[i + 1]
    END FOR
    
    array.length = array.length - 1
END`,
    implementationCode: `// Comprehensive Array Implementation in JavaScript

class DynamicArray {
    constructor(initialCapacity = 10) {
        this.data = new Array(initialCapacity);
        this.size = 0;
        this.capacity = initialCapacity;
    }
    
    // Access element at index - O(1)
    get(index) {
        if (index < 0 || index >= this.size) {
            throw new Error(\`Index \${index} out of bounds for size \${this.size}\`);
        }
        return this.data[index];
    }
    
    // Set element at index - O(1)
    set(index, element) {
        if (index < 0 || index >= this.size) {
            throw new Error(\`Index \${index} out of bounds for size \${this.size}\`);
        }
        this.data[index] = element;
    }
    
    // Add element at end - O(1) amortized
    push(element) {
        if (this.size >= this.capacity) {
            this._resize();
        }
        this.data[this.size] = element;
        this.size++;
    }
    
    // Insert element at specific index - O(n)
    insert(index, element) {
        if (index < 0 || index > this.size) {
            throw new Error(\`Index \${index} out of bounds for insertion\`);
        }
        
        if (this.size >= this.capacity) {
            this._resize();
        }
        
        // Shift elements to the right
        for (let i = this.size; i > index; i--) {
            this.data[i] = this.data[i - 1];
        }
        
        this.data[index] = element;
        this.size++;
    }
    
    // Remove element at index - O(n)
    delete(index) {
        if (index < 0 || index >= this.size) {
            throw new Error(\`Index \${index} out of bounds for deletion\`);
        }
        
        const deletedElement = this.data[index];
        
        // Shift elements to the left
        for (let i = index; i < this.size - 1; i++) {
            this.data[i] = this.data[i + 1];
        }
        
        this.size--;
        return deletedElement;
    }
    
    // Search for element - O(n)
    indexOf(element) {
        for (let i = 0; i < this.size; i++) {
            if (this.data[i] === element) {
                return i;
            }
        }
        return -1;
    }
    
    // Traverse array - O(n)
    forEach(callback) {
        for (let i = 0; i < this.size; i++) {
            callback(this.data[i], i, this);
        }
    }
    
    // Private method to resize array
    _resize() {
        const newCapacity = this.capacity * 2;
        const newData = new Array(newCapacity);
        
        for (let i = 0; i < this.size; i++) {
            newData[i] = this.data[i];
        }
        
        this.data = newData;
        this.capacity = newCapacity;
    }
    
    // Utility methods
    isEmpty() { return this.size === 0; }
    length() { return this.size; }
    toArray() { return this.data.slice(0, this.size); }
}

// Usage Examples
const arr = new DynamicArray();
arr.push(10);
arr.push(20);
arr.push(30);
arr.insert(1, 15); // [10, 15, 20, 30]
console.log(arr.get(1)); // 15
arr.delete(2); // [10, 15, 30]
console.log(arr.indexOf(30)); // 2`,
    example: `// Basic Array Operations
const numbers = [1, 2, 3, 4, 5];

// Access - O(1)
console.log(numbers[0]); // 1
console.log(numbers[4]); // 5

// Insert at end - O(1)
numbers.push(6); // [1, 2, 3, 4, 5, 6]

// Insert at beginning - O(n)
numbers.unshift(0); // [0, 1, 2, 3, 4, 5, 6]

// Delete from end - O(1)
numbers.pop(); // [0, 1, 2, 3, 4, 5]

// Delete from beginning - O(n)
numbers.shift(); // [1, 2, 3, 4, 5]

// Search - O(n)
const index = numbers.indexOf(3); // 2

// Traverse - O(n)
numbers.forEach((num, i) => console.log(\`Index \${i}: \${num}\`));`,
    syntax: `const A = [3,8,12];
A[1]; // access
A.push(5); // append
A.pop(); // remove last
A.indexOf(12); // linear search`,
    quizQuestions: [
      {
        question: "What is the time complexity of accessing an element in an array by index?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "Array access by index is O(1) because elements are stored in contiguous memory locations, allowing direct calculation of memory address using the formula: base_address + (index * element_size)."
      },
      {
        question: "What happens when you try to insert an element at the beginning of an array?",
        options: ["All elements shift left", "All elements shift right", "Only the first element moves", "No elements need to move"],
        correctAnswer: 1,
        explanation: "When inserting at the beginning, all existing elements must shift one position to the right to make space for the new element, resulting in O(n) time complexity."
      },
      {
        question: "Which array operation has the best average-case time complexity?",
        options: ["Search", "Insert at beginning", "Access by index", "Delete from middle"],
        correctAnswer: 2,
        explanation: "Access by index is O(1) - constant time - because arrays provide direct memory access using index calculations, regardless of array size."
      },
      {
        question: "What is the main advantage of arrays over linked lists?",
        options: ["Dynamic size", "Easy insertion", "Random access", "Less memory usage per element"],
        correctAnswer: 2,
        explanation: "Arrays provide O(1) random access to elements by index, while linked lists require O(n) traversal to reach a specific position. Arrays also have better cache locality due to contiguous memory layout."
      },
      {
        question: "In a zero-indexed array of size 10, what is the valid range of indices?",
        options: ["1 to 10", "0 to 10", "0 to 9", "1 to 9"],
        correctAnswer: 2,
        explanation: "Zero-indexed arrays start counting from 0, so an array of size 10 has valid indices from 0 to 9 (inclusive). Accessing index 10 would cause an out-of-bounds error."
      }
    ]
  },
  {
    id: 'array-rotation',
    title: 'Array Rotation',
    description: 'Learn left and right rotation techniques with optimal approaches',
    category: 'Arrays',
    difficulty: 'intermediate',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    extendedDefinition: `Array rotation involves shifting elements of an array to the left or right by a specified number of positions. This fundamental operation is crucial in many algorithms and has applications in circular data structures, string manipulation, and algorithmic problem solving.

What it does: shifts elements left or right by positions, wrapping elements around to the other end.

How it works: uses reversal algorithm - reverse entire array, then reverse first k elements, then reverse remaining elements.

When to use: circular data structures, image transformations, string rotations, sliding window problems.`,
    voiceExplanation: `Think of array rotation like a carousel or a conveyor belt. Imagine you have a row of people standing in a line, and you want to rotate them. In a left rotation, everyone takes a step to the left, and the person at the front wraps around to the back. In a right rotation, everyone steps to the right, and the person at the back moves to the front. The clever part is that you don't need to move everyone one by one - there's a brilliant trick called the reversal algorithm. It's like doing three magic flips: first flip the entire line, then flip the first part, then flip the second part, and voila! You've rotated the array efficiently. This technique is used everywhere - from image processing where you rotate pixel arrays, to operating systems managing circular buffers, to even simple tasks like rotating elements in a game board.`,
    realWorldApplications: `**Industry Applications:**
- **Image Processing**: Rotating pixel matrices for image transformations
- **Operating Systems**: Circular buffer management for I/O operations
- **Game Development**: Rotating game boards, tile maps, and sprite arrays
- **Data Compression**: Burrows-Wheeler transform uses rotations
- **Cryptography**: Caesar cipher and other rotation-based encryption
- **Audio Processing**: Circular delay buffers and audio effects
- **Network Protocols**: Round-robin scheduling and load balancing
- **Database Systems**: Circular log files and buffer pool management`,
    keyConcepts: `**Essential Concepts:**
1. **Modular Arithmetic**: Understanding k % n for handling large rotations
2. **In-place Operations**: Minimizing space complexity through clever algorithms
3. **Reversal Technique**: Three reversals achieve optimal O(n) time, O(1) space
4. **Cyclic Nature**: Treating arrays as circular structures
5. **GCD-based Cycles**: Using greatest common divisor for cyclic replacements
6. **Time-Space Trade-offs**: Balancing algorithm efficiency and memory usage
7. **Edge Cases**: Handling empty arrays, single elements, and zero rotations`,
    pseudocode: `**Array Rotation Pseudocode:**

ALGORITHM RotateLeftSimple(array, k)
INPUT: array - the array to rotate, k - number of positions
OUTPUT: rotated array
BEGIN
    n = array.length
    k = k % n  // Handle rotations larger than array size
    temp = new Array(n)
    
    FOR i = 0 TO n - 1 DO
        temp[i] = array[(i + k) % n]
    END FOR
    
    RETURN temp
END

ALGORITHM RotateLeftReversal(array, k)
INPUT: array - the array to rotate, k - number of positions
OUTPUT: rotated array (in-place)
BEGIN
    n = array.length
    k = k % n
    
    // Step 1: Reverse entire array
    Reverse(array, 0, n - 1)
    
    // Step 2: Reverse first n-k elements
    Reverse(array, 0, n - k - 1)
    
    // Step 3: Reverse last k elements
    Reverse(array, n - k, n - 1)
END

ALGORITHM Reverse(array, start, end)
INPUT: array, start index, end index
OUTPUT: reversed array segment
BEGIN
    WHILE start < end DO
        SWAP array[start] AND array[end]
        start = start + 1
        end = end - 1
    END WHILE
END`,
    implementationCode: `// Comprehensive Array Rotation Implementation

class ArrayRotation {
    // Simple rotation using extra space - O(n) time, O(n) space
    static rotateLeftSimple(arr, k) {
        const n = arr.length;
        if (n === 0) return arr;
        k = k % n;
        return arr.slice(k).concat(arr.slice(0, k));
    }
    
    // In-place rotation using reversal algorithm - O(n) time, O(1) space
    static rotateLeftInPlace(arr, k) {
        const n = arr.length;
        if (n === 0) return arr;
        k = k % n;
        
        // Step 1: Reverse entire array
        this.reverse(arr, 0, n - 1);
        
        // Step 2: Reverse first n-k elements
        this.reverse(arr, 0, n - k - 1);
        
        // Step 3: Reverse last k elements
        this.reverse(arr, n - k, n - 1);
        
        return arr;
    }
    
    // Right rotation
    static rotateRightInPlace(arr, k) {
        const n = arr.length;
        if (n === 0) return arr;
        k = k % n;
        
        // Right rotation by k = Left rotation by n-k
        return this.rotateLeftInPlace(arr, n - k);
    }
    
    // Cyclic replacement approach - O(n) time, O(1) space
    static rotateLeftCyclic(arr, k) {
        const n = arr.length;
        if (n === 0) return arr;
        k = k % n;
        
        const gcd = this.findGCD(n, k);
        
        for (let i = 0; i < gcd; i++) {
            let temp = arr[i];
            let j = i;
            
            while (true) {
                let next = (j + k) % n;
                if (next === i) break;
                arr[j] = arr[next];
                j = next;
            }
            arr[j] = temp;
        }
        
        return arr;
    }
    
    // Helper method to reverse array segment
    static reverse(arr, start, end) {
        while (start < end) {
            [arr[start], arr[end]] = [arr[end], arr[start]];
            start++;
            end--;
        }
    }
    
    // Helper method to find GCD
    static findGCD(a, b) {
        return b === 0 ? a : this.findGCD(b, a % b);
    }
}

// Usage Examples
const numbers = [1, 2, 3, 4, 5, 6, 7];
console.log(ArrayRotation.rotateLeftSimple([...numbers], 3)); // [4, 5, 6, 7, 1, 2, 3]
console.log(ArrayRotation.rotateLeftInPlace([...numbers], 3)); // [4, 5, 6, 7, 1, 2, 3]
console.log(ArrayRotation.rotateRightInPlace([...numbers], 2)); // [6, 7, 1, 2, 3, 4, 5]`,
    example: `// Array Rotation
function rotateLeft(arr, k) {
    const n = arr.length;
    k = k % n;
    return arr.slice(k).concat(arr.slice(0, k));
}

function rotateRight(arr, k) {
    const n = arr.length;
    k = k % n;
    return arr.slice(-k).concat(arr.slice(0, -k));
}

// Example usage
const nums = [1, 2, 3, 4, 5];
console.log(rotateLeft(nums, 2)); // [3, 4, 5, 1, 2]
console.log(rotateRight(nums, 2)); // [4, 5, 1, 2, 3]`,
    quizQuestions: [
      {
        question: "What is the time complexity of the reversal algorithm for array rotation?",
        options: ["O(1)", "O(k)", "O(n)", "O(n²)"],
        correctAnswer: 2,
        explanation: "The reversal algorithm performs three array reversals, each taking O(n) time, resulting in overall O(n) time complexity."
      },
      {
        question: "Why do we use k % n when rotating an array by k positions?",
        options: ["To handle negative rotations", "To handle rotations larger than array size", "To optimize performance", "To prevent array overflow"],
        correctAnswer: 1,
        explanation: "Using k % n handles cases where k is larger than the array size, since rotating by n positions returns the array to its original state."
      },
      {
        question: "What is the space complexity of the reversal algorithm for in-place rotation?",
        options: ["O(1)", "O(k)", "O(n)", "O(n log n)"],
        correctAnswer: 0,
        explanation: "The reversal algorithm rotates the array in-place using only a constant amount of extra space for swapping elements."
      },
      {
        question: "How do you convert a right rotation by k positions to a left rotation?",
        options: ["Left rotate by k", "Left rotate by n-k", "Left rotate by k-n", "Right rotate by n-k"],
        correctAnswer: 1,
        explanation: "Right rotation by k positions is equivalent to left rotation by (n-k) positions, where n is the array length."
      },
      {
        question: "What is a real-world application of array rotation?",
        options: ["Binary search", "Hash table implementation", "Image processing for rotations", "Sorting algorithms"],
        correctAnswer: 2,
        explanation: "Array rotation is commonly used in image processing to rotate pixel matrices, as well as in circular buffers and game development."
      }
    ]
  },
  {
    id: 'array-subarray-problems',
    title: 'Subarray Problems',
    description: 'Maximum subarray, subarray sum, and sliding window basics',
    category: 'Arrays',
    difficulty: 'intermediate',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    extendedDefinition: `Subarray problems involve finding contiguous subsequences within an array that satisfy specific conditions. These problems are fundamental in algorithmic problem solving and form the basis for many optimization techniques.

What it does: finds contiguous subsequences within arrays that meet specific criteria like maximum sum or target value.

How it works: uses techniques like Kadane's algorithm for maximum subarray or sliding window for efficient traversal.

When to use: maximum/minimum subarray problems, stock trading algorithms, signal processing, pattern finding.`,
    voiceExplanation: `Think of subarray problems like finding the best continuous stretch in a journey. Imagine you're driving on a highway and tracking your fuel efficiency - sometimes you get great mileage, sometimes terrible. A subarray problem is like asking "what's the best continuous stretch of road where I got the highest average mileage?" Kadane's algorithm is brilliant because it makes a simple decision at each mile marker: should I continue with my current stretch, or is it better to start fresh from here? If my running total becomes negative, it's like saying "this stretch is dragging me down so much that I'm better off starting over." This same principle applies everywhere - from finding the most profitable trading period in stocks, to identifying the most productive hours in your day, to detecting the strongest signal in noisy data. The sliding window technique is like having a smart window that expands and contracts as you move through your data, always maintaining the optimal view.`,
    keyConcepts: `**Essential Concepts:**
1. **Contiguous Elements**: Subarrays must maintain original order and adjacency
2. **Kadane's Principle**: At each position, choose between extending or restarting
3. **Negative Sum Reset**: When cumulative sum becomes negative, start fresh
4. **Sliding Window**: Efficient technique for fixed or variable-size subarrays
5. **Two Pointers**: Often used for subarray problems with specific conditions
6. **Prefix Sums**: Precomputed sums for efficient range queries
7. **Dynamic Programming**: Optimal substructure in subarray problems`,
    pseudocode: `**Subarray Problems Pseudocode:**

ALGORITHM KadaneMaxSubarray(array)
INPUT: array - array of integers
OUTPUT: maximum sum of contiguous subarray
BEGIN
    IF array.length = 0 THEN
        RETURN 0
    END IF
    
    maxSoFar = array[0]
    maxEndingHere = array[0]
    
    FOR i = 1 TO array.length - 1 DO
        maxEndingHere = MAX(array[i], maxEndingHere + array[i])
        maxSoFar = MAX(maxSoFar, maxEndingHere)
    END FOR
    
    RETURN maxSoFar
END

ALGORITHM SubarrayWithSum(array, targetSum)
INPUT: array - array of positive integers, targetSum - target sum
OUTPUT: indices of subarray with given sum
BEGIN
    start = 0
    currentSum = 0
    
    FOR end = 0 TO array.length - 1 DO
        currentSum = currentSum + array[end]
        
        WHILE currentSum > targetSum AND start <= end DO
            currentSum = currentSum - array[start]
            start = start + 1
        END WHILE
        
        IF currentSum = targetSum THEN
            RETURN [start, end]
        END IF
    END FOR
    
    RETURN [-1, -1]  // Not found
END

ALGORITHM SlidingWindowMaximum(array, windowSize)
INPUT: array - input array, windowSize - size of sliding window
OUTPUT: array of maximum elements in each window
BEGIN
    result = []
    deque = []  // Store indices
    
    FOR i = 0 TO array.length - 1 DO
        // Remove indices outside current window
        WHILE deque is not empty AND deque.front() <= i - windowSize DO
            deque.removeFront()
        END WHILE
        
        // Remove smaller elements from back
        WHILE deque is not empty AND array[deque.back()] <= array[i] DO
            deque.removeBack()
        END WHILE
        
        deque.addBack(i)
        
        // Add maximum to result if window is complete
        IF i >= windowSize - 1 THEN
            result.add(array[deque.front()])
        END IF
    END FOR
    
    RETURN result
END`,
    implementationCode: `// Comprehensive Subarray Problems Implementation

class SubarrayProblems {
    // Kadane's Algorithm - Maximum Subarray Sum
    static maxSubarraySum(arr) {
        if (arr.length === 0) return 0;
        
        let maxSoFar = arr[0];
        let maxEndingHere = arr[0];
        let start = 0, end = 0, tempStart = 0;
        
        for (let i = 1; i < arr.length; i++) {
            if (maxEndingHere < 0) {
                maxEndingHere = arr[i];
                tempStart = i;
            } else {
                maxEndingHere += arr[i];
            }
            
            if (maxEndingHere > maxSoFar) {
                maxSoFar = maxEndingHere;
                start = tempStart;
                end = i;
            }
        }
        
        return { maxSum: maxSoFar, startIndex: start, endIndex: end };
    }
    
    // Find subarray with given sum (positive numbers)
    static subarrayWithSum(arr, targetSum) {
        let start = 0;
        let currentSum = 0;
        
        for (let end = 0; end < arr.length; end++) {
            currentSum += arr[end];
            
            while (currentSum > targetSum && start <= end) {
                currentSum -= arr[start];
                start++;
            }
            
            if (currentSum === targetSum) {
                return { found: true, startIndex: start, endIndex: end };
            }
        }
        
        return { found: false, startIndex: -1, endIndex: -1 };
    }
    
    // Longest subarray with sum K (handles negative numbers)
    static longestSubarrayWithSum(arr, k) {
        const prefixSumMap = new Map();
        let prefixSum = 0;
        let maxLength = 0;
        let startIndex = -1, endIndex = -1;
        
        prefixSumMap.set(0, -1); // Handle subarrays starting from index 0
        
        for (let i = 0; i < arr.length; i++) {
            prefixSum += arr[i];
            
            if (prefixSumMap.has(prefixSum - k)) {
                const length = i - prefixSumMap.get(prefixSum - k);
                if (length > maxLength) {
                    maxLength = length;
                    startIndex = prefixSumMap.get(prefixSum - k) + 1;
                    endIndex = i;
                }
            }
            
            if (!prefixSumMap.has(prefixSum)) {
                prefixSumMap.set(prefixSum, i);
            }
        }
        
        return { maxLength, startIndex, endIndex };
    }
    
    // Sliding Window Maximum
    static slidingWindowMaximum(arr, windowSize) {
        if (arr.length === 0 || windowSize <= 0) return [];
        
        const result = [];
        const deque = []; // Store indices
        
        for (let i = 0; i < arr.length; i++) {
            // Remove indices outside current window
            while (deque.length > 0 && deque[0] <= i - windowSize) {
                deque.shift();
            }
            
            // Remove smaller elements from back
            while (deque.length > 0 && arr[deque[deque.length - 1]] <= arr[i]) {
                deque.pop();
            }
            
            deque.push(i);
            
            // Add maximum to result if window is complete
            if (i >= windowSize - 1) {
                result.push(arr[deque[0]]);
            }
        }
        
        return result;
    }
    
    // Maximum sum of subarray of size K
    static maxSumSubarrayOfSizeK(arr, k) {
        if (arr.length < k) return null;
        
        let windowSum = 0;
        
        // Calculate sum of first window
        for (let i = 0; i < k; i++) {
            windowSum += arr[i];
        }
        
        let maxSum = windowSum;
        let maxStartIndex = 0;
        
        // Slide the window
        for (let i = k; i < arr.length; i++) {
            windowSum = windowSum - arr[i - k] + arr[i];
            if (windowSum > maxSum) {
                maxSum = windowSum;
                maxStartIndex = i - k + 1;
            }
        }
        
        return { maxSum, startIndex: maxStartIndex, endIndex: maxStartIndex + k - 1 };
    }
}

// Usage Examples
const numbers = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
console.log(SubarrayProblems.maxSubarraySum(numbers)); 
// { maxSum: 6, startIndex: 3, endIndex: 6 } -> [4, -1, 2, 1]

const positiveNums = [1, 4, 2, 7, 3, 5];
console.log(SubarrayProblems.subarrayWithSum(positiveNums, 9));
// { found: true, startIndex: 1, endIndex: 2 } -> [4, 2, 7] has sum 13, [2, 7] has sum 9

console.log(SubarrayProblems.slidingWindowMaximum([1, 3, -1, -3, 5, 3, 6, 7], 3));
// [3, 3, 5, 5, 6, 7]`,
    example: `// Maximum Subarray Sum (Kadane's Algorithm)
function maxSubarraySum(arr) {
    let maxSoFar = arr[0];
    let maxEndingHere = arr[0];
    
    for (let i = 1; i < arr.length; i++) {
        maxEndingHere = Math.max(arr[i], maxEndingHere + arr[i]);
        maxSoFar = Math.max(maxSoFar, maxEndingHere);
    }
    
    return maxSoFar;
}

// Example usage
const nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
console.log(maxSubarraySum(nums)); // 6 (subarray [4, -1, 2, 1])`,
    realWorldApplications: `**Industry Applications:**
- **Finance**: Stock trading algorithms for maximum profit periods, portfolio optimization
- **Signal Processing**: Finding strongest signal segments in noisy data, pattern detection
- **Data Analytics**: Identifying peak performance periods, trend analysis in time series
- **Resource Management**: Optimal scheduling windows, load balancing in distributed systems
- **Bioinformatics**: DNA sequence analysis, finding conserved regions in genetic data
- **Image Processing**: Detecting regions of interest, noise reduction in image segments
- **Network Optimization**: Finding optimal transmission windows, bandwidth allocation
- **Manufacturing**: Quality control analysis, identifying optimal production periods
- **Sports Analytics**: Performance streak analysis, identifying peak performance periods
- **Energy Systems**: Peak demand analysis, optimal energy distribution windows`,
    quizQuestions: [
      {
        question: "What is the core principle behind Kadane's algorithm?",
        options: ["Always include the current element", "At each position, choose between extending current subarray or starting new", "Find all possible subarrays first", "Use divide and conquer approach"],
        correctAnswer: 1,
        explanation: "Kadane's algorithm works by deciding at each position whether to extend the existing subarray or start a new one, based on whether the current sum is positive or negative."
      },
      {
        question: "What is the time complexity of Kadane's algorithm for maximum subarray sum?",
        options: ["O(n²)", "O(n log n)", "O(n)", "O(1)"],
        correctAnswer: 2,
        explanation: "Kadane's algorithm runs in O(n) time as it makes a single pass through the array, making a constant-time decision at each element."
      },
      {
        question: "When should you reset the current sum to start a new subarray in Kadane's algorithm?",
        options: ["When current element is negative", "When current sum becomes negative", "When current sum is zero", "Never reset, always extend"],
        correctAnswer: 1,
        explanation: "You should start a new subarray when the current sum becomes negative, as including negative sums would only decrease the total."
      },
      {
        question: "What technique is most efficient for finding subarrays with a given sum in positive arrays?",
        options: ["Brute force nested loops", "Sliding window technique", "Binary search", "Dynamic programming"],
        correctAnswer: 1,
        explanation: "The sliding window technique is most efficient for subarray sum problems with positive numbers, achieving O(n) time complexity."
      },
      {
        question: "What is a real-world application of maximum subarray problems?",
        options: ["Sorting algorithms", "Hash table implementation", "Stock trading for maximum profit periods", "Binary tree traversal"],
        correctAnswer: 2,
        explanation: "Maximum subarray problems are commonly used in stock trading to find the period that would yield maximum profit from buying and selling."
      }
    ]
  },
  {
    id: 'string-palindrome',
    title: 'Palindrome Check',
    description: 'Check if a string is a palindrome using various methods',
    category: 'Strings',
    difficulty: 'beginner',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    extendedDefinition: `A palindrome is a sequence of characters that reads the same forwards and backwards. Palindrome checking is a fundamental string processing problem with applications in text analysis, DNA sequence analysis, and data validation.

What it does: checks if a string reads the same forwards and backwards using character comparison.

How it works: uses two pointers starting from both ends, moving inward while comparing characters until they meet.

When to use: text validation, DNA sequence analysis, word games, data integrity checks.`,
    voiceExplanation: `Think of a palindrome like a word or phrase that reads the same forwards and backwards - like "racecar" or "madam". Imagine you have two people standing at opposite ends of the word, one at the beginning and one at the end. They both start walking toward each other, checking if the letters they encounter are the same. If at any point the letters don't match, it's not a palindrome. If they meet in the middle and all letters matched along the way, congratulations - you've found a palindrome! This two-pointer approach is like having two inspectors working from both ends, making the process twice as fast. For phrases like "A man, a plan, a canal: Panama", we first clean up the text by removing spaces and punctuation, then apply the same walking-from-both-ends technique.`,
    realWorldApplications: `**Industry Applications:**
- **Data Validation**: Credit card numbers, license plates, product codes
- **Bioinformatics**: DNA palindromic sequences, restriction enzyme sites
- **Text Processing**: Spell checkers, word games, linguistic analysis
- **Security**: Password validation, cryptographic applications
- **Database Systems**: Data integrity checks, duplicate detection
- **Web Development**: Form validation, user input sanitization
- **Competitive Programming**: Algorithm contests, coding interviews
- **Natural Language Processing**: Text analysis, pattern recognition`,
    keyConcepts: `**Essential Concepts:**
1. **Two-Pointer Technique**: Efficient O(n) time, O(1) space approach
2. **String Preprocessing**: Handling case, spaces, and special characters
3. **Boundary Conditions**: Empty strings, single characters, even/odd lengths
4. **Character Comparison**: Direct comparison vs. normalized comparison
5. **Space-Time Tradeoffs**: In-place vs. auxiliary space approaches
6. **Recursive vs. Iterative**: Stack space considerations
7. **Unicode Handling**: Multi-byte character support and normalization`,
    pseudocode: `**Palindrome Check Pseudocode:**

ALGORITHM IsPalindromeTwoPointers(string)
INPUT: string - the string to check
OUTPUT: boolean - true if palindrome, false otherwise
BEGIN
    IF string is null OR string.length = 0 THEN
        RETURN true
    END IF
    
    left = 0
    right = string.length - 1
    
    WHILE left < right DO
        IF string[left] Ã¢â€°Â  string[right] THEN
            RETURN false
        END IF
        left = left + 1
        right = right - 1
    END WHILE
    
    RETURN true
END

ALGORITHM IsPalindromeWithPreprocessing(string)
INPUT: string - the string to check (may contain spaces/punctuation)
OUTPUT: boolean - true if palindrome, false otherwise
BEGIN
    // Preprocess: remove non-alphanumeric, convert to lowercase
    cleaned = ""
    FOR each character c in string DO
        IF c is alphanumeric THEN
            cleaned = cleaned + toLowerCase(c)
        END IF
    END FOR
    
    RETURN IsPalindromeTwoPointers(cleaned)
END

ALGORITHM IsPalindromeRecursive(string, left, right)
INPUT: string, left index, right index
OUTPUT: boolean - true if palindrome, false otherwise
BEGIN
    IF left >= right THEN
        RETURN true
    END IF
    
    IF string[left] Ã¢â€°Â  string[right] THEN
        RETURN false
    END IF
    
    RETURN IsPalindromeRecursive(string, left + 1, right - 1)
END`,
    implementationCode: `// Comprehensive Palindrome Check Implementation

class PalindromeChecker {
    // Basic two-pointer approach - O(n) time, O(1) space
    static isPalindrome(str) {
        if (!str || str.length === 0) return true;
        
        let left = 0;
        let right = str.length - 1;
        
        while (left < right) {
            if (str[left] !== str[right]) {
                return false;
            }
            left++;
            right--;
        }
        
        return true;
    }
    
    // Palindrome check with preprocessing - handles spaces, punctuation, case
    static isPalindromeIgnoreCase(str) {
        if (!str) return true;
        
        // Clean string: keep only alphanumeric, convert to lowercase
        const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
        return this.isPalindrome(cleaned);
    }
    
    // Recursive approach - O(n) time, O(n) space (stack)
    static isPalindromeRecursive(str, left = 0, right = str.length - 1) {
        if (left >= right) return true;
        if (str[left] !== str[right]) return false;
        return this.isPalindromeRecursive(str, left + 1, right - 1);
    }
    
    // Reverse and compare approach - O(n) time, O(n) space
    static isPalindromeReverse(str) {
        if (!str) return true;
        const reversed = str.split('').reverse().join('');
        return str === reversed;
    }
    
    // Find longest palindromic substring - O(nÃ‚Â²) time
    static longestPalindrome(str) {
        if (!str || str.length < 2) return str;
        
        let start = 0;
        let maxLength = 1;
        
        // Helper function to expand around center
        const expandAroundCenter = (left, right) => {
            while (left >= 0 && right < str.length && str[left] === str[right]) {
                const currentLength = right - left + 1;
                if (currentLength > maxLength) {
                    start = left;
                    maxLength = currentLength;
                }
                left--;
                right++;
            }
        };
        
        for (let i = 0; i < str.length; i++) {
            // Check for odd length palindromes
            expandAroundCenter(i, i);
            // Check for even length palindromes
            expandAroundCenter(i, i + 1);
        }
        
        return str.substring(start, start + maxLength);
    }
    
    // Count all palindromic substrings - O(nÃ‚Â²) time
    static countPalindromes(str) {
        if (!str) return 0;
        
        let count = 0;
        
        const expandAroundCenter = (left, right) => {
            while (left >= 0 && right < str.length && str[left] === str[right]) {
                count++;
                left--;
                right++;
            }
        };
        
        for (let i = 0; i < str.length; i++) {
            expandAroundCenter(i, i);     // odd length
            expandAroundCenter(i, i + 1); // even length
        }
        
        return count;
    }
    
    // Check if string can be rearranged to form palindrome
    static canFormPalindrome(str) {
        const charCount = {};
        
        for (let char of str) {
            charCount[char] = (charCount[char] || 0) + 1;
        }
        
        let oddCount = 0;
        for (let count of Object.values(charCount)) {
            if (count % 2 === 1) oddCount++;
        }
        
        // At most one character can have odd count
        return oddCount <= 1;
    }
}

// Usage Examples
console.log(PalindromeChecker.isPalindrome("racecar")); // true
console.log(PalindromeChecker.isPalindromeIgnoreCase("A man, a plan, a canal: Panama")); // true
console.log(PalindromeChecker.longestPalindrome("babad")); // "bab" or "aba"
console.log(PalindromeChecker.countPalindromes("abc")); // 3 ("a", "b", "c")
console.log(PalindromeChecker.canFormPalindrome("aabbcc")); // true`,
    example: `// Palindrome Check
function isPalindrome(str) {
    const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    let left = 0, right = cleaned.length - 1;
    
    while (left < right) {
        if (cleaned[left] !== cleaned[right]) return false;
        left++; right--;
    }
    return true;
}

// Example usage
console.log(isPalindrome("A man, a plan, a canal: Panama")); // true
console.log(isPalindrome("race a car")); // false`,
    syntax: `**Palindrome Check Patterns:**

1. **Two Pointers Approach:**
   \`\`\`javascript
   function isPalindrome(s) {
       let left = 0, right = s.length - 1;
       while (left < right) {
           if (s[left] !== s[right]) return false;
           left++; right--;
       }
       return true;
   }
   \`\`\`

2. **Reverse and Compare:**
   \`\`\`javascript
   function isPalindrome(s) {
       return s === s.split('').reverse().join('');
   }
   \`\`\`

3. **Recursive Approach:**
   \`\`\`javascript
   function isPalindrome(s, left = 0, right = s.length - 1) {
       if (left >= right) return true;
       if (s[left] !== s[right]) return false;
       return isPalindrome(s, left + 1, right - 1);
   }
   \`\`\``,
    quizQuestions: [
      {
        question: "What is the time complexity of the two-pointer approach for palindrome checking?",
        options: ["O(1)", "O(log n)", "O(n)", "O(nÃ‚Â²)"],
        correctAnswer: 2,
        explanation: "The two-pointer approach visits each character at most once, making it O(n) time complexity."
      },
      {
        question: "Which approach for palindrome checking uses O(1) space complexity?",
        options: ["Reverse and compare", "Two pointers", "Recursive", "Dynamic programming"],
        correctAnswer: 1,
        explanation: "The two-pointer approach only uses a constant amount of extra space for the left and right pointers."
      },
      {
        question: "What should be the first step when checking if a phrase like 'A man, a plan, a canal: Panama' is a palindrome?",
        options: ["Convert to lowercase", "Remove spaces and punctuation", "Reverse the string", "Count characters"],
        correctAnswer: 1,
        explanation: "Preprocessing by removing non-alphanumeric characters and converting to lowercase is essential for phrase palindromes."
      },
      {
        question: "In the two-pointer palindrome algorithm, when do we stop the loop?",
        options: ["When left > right", "When left >= right", "When left == right", "When we find a mismatch"],
        correctAnswer: 1,
        explanation: "We stop when left >= right because we've checked all necessary character pairs."
      },
      {
        question: "What is the space complexity of the recursive palindrome checking approach?",
        options: ["O(1)", "O(log n)", "O(n)", "O(nÃ‚Â²)"],
        correctAnswer: 2,
        explanation: "The recursive approach uses O(n) space due to the call stack depth in the worst case."
      }
    ]
  },
  {
    id: 'string-search-kmp',
    title: 'KMP Algorithm',
    description: 'Knuth-Morris-Pratt algorithm for efficient string pattern matching',
    category: 'Strings',
    difficulty: 'advanced',
    timeComplexity: 'O(n + m)',
    spaceComplexity: 'O(m)',
    extendedDefinition: `The Knuth-Morris-Pratt (KMP) algorithm is an efficient string matching algorithm that avoids redundant character comparisons by utilizing information about the pattern itself. It achieves linear time complexity by preprocessing the pattern to create a failure function.

What it does: finds pattern occurrences in text efficiently by avoiding redundant character comparisons.

How it works: preprocesses pattern to create failure function, then uses it to skip characters during matching.

When to use: text editors, DNA analysis, large text searches, when pattern occurs frequently.`,
    voiceExplanation: `Think of the KMP algorithm like a smart detective who learns from past mistakes. Imagine you're searching for the word "ABABACA" in a long text. When you find a mismatch, instead of starting over from the next character like a naive approach, KMP is clever - it remembers the pattern it just saw and uses that knowledge to skip ahead intelligently. The secret is the "failure function" or LPS array, which is like a cheat sheet that tells you: "Hey, if you fail at position 5, don't start from scratch - you can safely jump to position 2 because you already know positions 0-1 match what you just saw." It's like having a memory of partial matches that prevents you from doing redundant work. This makes KMP incredibly efficient for text editors when you're searching for patterns, or in DNA analysis where you're looking for specific genetic sequences.`,
    keyConcepts: `**Essential Concepts:**
1. **Failure Function (LPS)**: Longest Proper Prefix which is also Suffix
2. **Pattern Preprocessing**: Building the LPS array in O(m) time
3. **No Backtracking**: Text pointer never moves backward
4. **Partial Match Utilization**: Using previous match information
5. **Linear Time Complexity**: Guaranteed O(n + m) performance
6. **Optimal Shifting**: Maximum safe shift distance after mismatch
7. **Border Concept**: Understanding string borders and their properties`,
    pseudocode: `**KMP Algorithm Pseudocode:**

ALGORITHM BuildLPS(pattern)
INPUT: pattern - the pattern string
OUTPUT: lps - array of longest proper prefix suffix lengths
BEGIN
    m = pattern.length
    lps = array of size m, initialized to 0
    len = 0
    i = 1
    
    WHILE i < m DO
        IF pattern[i] = pattern[len] THEN
            len = len + 1
            lps[i] = len
            i = i + 1
        ELSE
            IF len Ã¢â€°Â  0 THEN
                len = lps[len - 1]
            ELSE
                lps[i] = 0
                i = i + 1
            END IF
        END IF
    END WHILE
    
    RETURN lps
END

ALGORITHM KMPSearch(text, pattern)
INPUT: text - the text to search in, pattern - the pattern to find
OUTPUT: positions - array of starting positions where pattern is found
BEGIN
    n = text.length
    m = pattern.length
    lps = BuildLPS(pattern)
    positions = []
    
    i = 0
    j = 0
    
    WHILE i < n DO
        IF text[i] = pattern[j] THEN
            i = i + 1
            j = j + 1
        END IF
        
        IF j = m THEN
            positions.append(i - j)
            j = lps[j - 1]
        ELSE IF i < n AND text[i] Ã¢â€°Â  pattern[j] THEN
            IF j Ã¢â€°Â  0 THEN
                j = lps[j - 1]
            ELSE
                i = i + 1
            END IF
        END IF
    END WHILE
    
    RETURN positions
END`,
    implementationCode: `// Comprehensive KMP Algorithm Implementation

class KMPStringMatcher {
    static buildLPS(pattern) {
        const m = pattern.length;
        const lps = new Array(m).fill(0);
        let len = 0;
        let i = 1;
        
        while (i < m) {
            if (pattern[i] === pattern[len]) {
                len++;
                lps[i] = len;
                i++;
            } else {
                if (len !== 0) {
                    len = lps[len - 1];
                } else {
                    lps[i] = 0;
                    i++;
                }
            }
        }
        
        return lps;
    }
    
    static search(text, pattern) {
        const n = text.length;
        const m = pattern.length;
        
        if (m === 0) return [0];
        if (n === 0 || m > n) return [];
        
        const lps = this.buildLPS(pattern);
        const result = [];
        
        let i = 0;
        let j = 0;
        
        while (i < n) {
            if (text[i] === pattern[j]) {
                i++;
                j++;
            }
            
            if (j === m) {
                result.push(i - j);
                j = lps[j - 1];
            } else if (i < n && text[i] !== pattern[j]) {
                if (j !== 0) {
                    j = lps[j - 1];
                } else {
                    i++;
                }
            }
        }
        
        return result;
    }
}

// Usage Examples
const text = "ABABDABACDABABCABCABCABCABC";
const pattern = "ABABCABCABCABC";
console.log("Matches:", KMPStringMatcher.search(text, pattern));`,
    example: `// KMP Algorithm Implementation
function kmpSearch(text, pattern) {
    const lps = buildLPS(pattern);
    const result = [];
    let i = 0, j = 0;
    
    while (i < text.length) {
        if (text[i] === pattern[j]) {
            i++; j++;
        }
        
        if (j === pattern.length) {
            result.push(i - j);
            j = lps[j - 1];
        } else if (i < text.length && text[i] !== pattern[j]) {
            if (j !== 0) j = lps[j - 1];
            else i++;
        }
    }
    return result;
}

function buildLPS(pattern) {
    const lps = new Array(pattern.length).fill(0);
    let len = 0, i = 1;
    
    while (i < pattern.length) {
        if (pattern[i] === pattern[len]) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len !== 0) len = lps[len - 1];
            else { lps[i] = 0; i++; }
        }
    }
    return lps;
}`,
    syntax: `**KMP Algorithm Patterns:**

1. **LPS Array Construction:**
   \`\`\`javascript
   function buildLPS(pattern) {
       const lps = new Array(pattern.length).fill(0);
       let len = 0, i = 1;
       while (i < pattern.length) {
           if (pattern[i] === pattern[len]) {
               lps[i] = ++len; i++;
           } else if (len !== 0) {
               len = lps[len - 1];
           } else {
               lps[i] = 0; i++;
           }
       }
       return lps;
   }
   \`\`\`

2. **Pattern Matching:**
   \`\`\`javascript
   function kmpSearch(text, pattern) {
       const lps = buildLPS(pattern);
       let i = 0, j = 0;
       while (i < text.length) {
           if (text[i] === pattern[j]) { i++; j++; }
           if (j === pattern.length) {
               // Found match at i - j
               j = lps[j - 1];
           } else if (i < text.length && text[i] !== pattern[j]) {
               j !== 0 ? j = lps[j - 1] : i++;
           }
       }
   }
   \`\`\``,
    quizQuestions: [
      {
        question: "What is the main advantage of KMP algorithm over naive string matching?",
        options: ["Uses less memory", "Avoids backtracking in text", "Works with any alphabet", "Simpler implementation"],
        correctAnswer: 1,
        explanation: "KMP's key advantage is that it never backtracks in the text, achieving linear time complexity by using the failure function."
      },
      {
        question: "What does the LPS array in KMP algorithm represent?",
        options: ["Last Position Seen", "Longest Proper Prefix which is also Suffix", "Linear Pattern Search", "Left Pointer Shift"],
        correctAnswer: 1,
        explanation: "LPS stands for Longest Proper Prefix which is also Suffix, used to determine how far to shift the pattern on mismatch."
      },
      {
        question: "What is the time complexity of building the LPS array?",
        options: ["O(1)", "O(log m)", "O(m)", "O(mÃ‚Â²)"],
        correctAnswer: 2,
        explanation: "Building the LPS array takes O(m) time where m is the length of the pattern."
      },
      {
        question: "In KMP, when a mismatch occurs at pattern[j], what do we do next?",
        options: ["Start over from text[i+1]", "Set j = lps[j-1]", "Increment both i and j", "Return no match"],
        correctAnswer: 1,
        explanation: "On mismatch, we set j = lps[j-1] to utilize the previously computed failure function information."
      },
      {
        question: "What is the overall time complexity of KMP algorithm?",
        options: ["O(n)", "O(m)", "O(n + m)", "O(nm)"],
        correctAnswer: 2,
        explanation: "KMP runs in O(n + m) time: O(m) for preprocessing the pattern and O(n) for searching the text."
      }
    ]
  },
  {
    id: 'rabin-karp',
    title: 'Rabin-Karp Algorithm',
    description: 'String matching using rolling hash technique',
    category: 'Strings',
    difficulty: 'intermediate',
    timeComplexity: 'O(n + m)',
    spaceComplexity: 'O(1)',
    voiceExplanation: `Imagine you're looking for a specific word in a massive book, but instead of reading every word, you have a magical fingerprint scanner. The Rabin-Karp algorithm works like this scanner - it creates a unique "fingerprint" or hash value for the pattern you're searching for. Then, it slides a window through the text, creating fingerprints for each substring of the same length. Here's the clever part: instead of recalculating the entire fingerprint each time, it uses a "rolling hash" - like updating a fingerprint by removing the leftmost character and adding a new rightmost character. When two fingerprints match, it's like finding a potential match, but you still need to double-check character by character because different words can sometimes have the same fingerprint. It's particularly powerful when searching for multiple patterns simultaneously, making it a favorite for plagiarism detection and DNA sequence analysis.`,
    extendedDefinition: `The Rabin-Karp algorithm uses hashing to find pattern occurrences in text efficiently. It employs a rolling hash function that can be updated in constant time as the window slides through the text, making it particularly effective for multiple pattern searches.

What it does: finds pattern occurrences in text using rolling hash technique to avoid redundant character comparisons.

How it works: computes hash values for pattern and text substrings, uses rolling hash to update window hash in O(1) time, verifies matches with character comparison.

When to use: multiple pattern searches, plagiarism detection, DNA sequence analysis, large text processing where hash-based matching is beneficial.

**Applications:**
- Plagiarism detection systems
- DNA sequence matching
- Image pattern recognition
- Duplicate file detection
- Web crawling and indexing`,
    keyConcepts: `**Essential Concepts:**
1. **Rolling Hash Function**: Polynomial hash that can be updated in O(1) time
2. **Hash Collision Handling**: Verification step when hash values match
3. **Modular Arithmetic**: Using prime numbers to reduce hash collisions
4. **Sliding Window**: Moving the pattern window through the text
5. **Base and Prime Selection**: Choosing appropriate values for hash function
6. **Spurious Hits**: False positives due to hash collisions
7. **Multiple Pattern Search**: Extending to search for multiple patterns simultaneously`,
    pseudocode: `**Rabin-Karp Algorithm Pseudocode:**

ALGORITHM RabinKarpSearch(text, pattern)
INPUT: text - the text to search in, pattern - the pattern to find
OUTPUT: positions - array of starting positions where pattern is found
BEGIN
    n = text.length
    m = pattern.length
    base = 256  // number of characters in alphabet
    prime = 101  // a prime number
    positions = []
    
    // Calculate h = base^(m-1) % prime
    h = 1
    FOR i = 0 TO m - 2 DO
        h = (h * base) % prime
    END FOR
    
    // Calculate hash for pattern and first window of text
    patternHash = 0
    textHash = 0
    FOR i = 0 TO m - 1 DO
        patternHash = (base * patternHash + pattern[i]) % prime
        textHash = (base * textHash + text[i]) % prime
    END FOR
    
    // Slide pattern over text one by one
    FOR i = 0 TO n - m DO
        // Check if hash values match
        IF patternHash = textHash THEN
            // Check character by character for exact match
            match = true
            FOR j = 0 TO m - 1 DO
                IF text[i + j] Ã¢â€°Â  pattern[j] THEN
                    match = false
                    BREAK
                END IF
            END FOR
            
            IF match = true THEN
                positions.append(i)
            END IF
        END IF
        
        // Calculate hash for next window (rolling hash)
        IF i < n - m THEN
            textHash = (base * (textHash - text[i] * h) + text[i + m]) % prime
            
            // Handle negative hash values
            IF textHash < 0 THEN
                textHash = textHash + prime
            END IF
        END IF
    END FOR
    
    RETURN positions
END`,
    implementationCode: `// Comprehensive Rabin-Karp Algorithm Implementation

class RabinKarpMatcher {
    constructor(base = 256, prime = 101) {
        this.base = base;
        this.prime = prime;
    }
    
    // Calculate hash value for a string
    calculateHash(str, length) {
        let hash = 0;
        for (let i = 0; i < length; i++) {
            hash = (this.base * hash + str.charCodeAt(i)) % this.prime;
        }
        return hash;
    }
    
    // Update hash using rolling hash technique
    rollingHash(oldHash, oldChar, newChar, h) {
        let newHash = (this.base * (oldHash - oldChar * h) + newChar) % this.prime;
        return newHash < 0 ? newHash + this.prime : newHash;
    }
    
    // Main search function
    search(text, pattern) {
        const n = text.length;
        const m = pattern.length;
        
        if (m === 0) return [0];
        if (n === 0 || m > n) return [];
        
        const result = [];
        
        // Calculate h = base^(m-1) % prime
        let h = 1;
        for (let i = 0; i < m - 1; i++) {
            h = (h * this.base) % this.prime;
        }
        
        // Calculate hash for pattern and first window
        let patternHash = this.calculateHash(pattern, m);
        let textHash = this.calculateHash(text, m);
        
        // Slide pattern over text
        for (let i = 0; i <= n - m; i++) {
            // Check if hash values match
            if (patternHash === textHash) {
                // Verify character by character
                let match = true;
                for (let j = 0; j < m; j++) {
                    if (text[i + j] !== pattern[j]) {
                        match = false;
                        break;
                    }
                }
                if (match) result.push(i);
            }
            
            // Calculate hash for next window
            if (i < n - m) {
                textHash = this.rollingHash(
                    textHash, 
                    text.charCodeAt(i), 
                    text.charCodeAt(i + m), 
                    h
                );
            }
        }
        
        return result;
    }
    
    // Search for multiple patterns simultaneously
    multiSearch(text, patterns) {
        const results = {};
        
        for (const pattern of patterns) {
            results[pattern] = this.search(text, pattern);
        }
        
        return results;
    }
    
    // Count occurrences of pattern
    count(text, pattern) {
        return this.search(text, pattern).length;
    }
    
    // Check if pattern exists in text
    contains(text, pattern) {
        return this.search(text, pattern).length > 0;
    }
}

// Usage Examples
const matcher = new RabinKarpMatcher();
const text = "AABAACAADAABAABA";
const pattern = "AABA";

console.log("Pattern found at positions:", matcher.search(text, pattern));
console.log("Pattern count:", matcher.count(text, pattern));
console.log("Pattern exists:", matcher.contains(text, pattern));

// Multiple pattern search
const patterns = ["AABA", "CAAD", "BAAB"];
console.log("Multiple patterns:", matcher.multiSearch(text, patterns));`,
    example: `// Rabin-Karp Algorithm
function rabinKarp(text, pattern) {
    const base = 256, prime = 101;
    const n = text.length, m = pattern.length;
    let patternHash = 0, textHash = 0, h = 1;
    const result = [];
    
    // Calculate h = base^(m-1) % prime
    for (let i = 0; i < m - 1; i++) {
        h = (h * base) % prime;
    }
    
    // Calculate hash for pattern and first window
    for (let i = 0; i < m; i++) {
        patternHash = (base * patternHash + pattern.charCodeAt(i)) % prime;
        textHash = (base * textHash + text.charCodeAt(i)) % prime;
    }
    
    // Slide pattern over text
    for (let i = 0; i <= n - m; i++) {
        if (patternHash === textHash) {
            // Check character by character
            let match = true;
            for (let j = 0; j < m; j++) {
                if (text[i + j] !== pattern[j]) {
                    match = false;
                    break;
                }
            }
            if (match) result.push(i);
        }
        
        // Calculate hash for next window
        if (i < n - m) {
            textHash = (base * (textHash - text.charCodeAt(i) * h) + 
                       text.charCodeAt(i + m)) % prime;
            if (textHash < 0) textHash += prime;
        }
    }
    return result;
}`,
    syntax: `**Rabin-Karp Patterns:**

1. **Rolling Hash Calculation:**
   \`\`\`javascript
   function rollingHash(text, start, length, base, prime) {
       let hash = 0;
       for (let i = 0; i < length; i++) {
           hash = (hash * base + text.charCodeAt(start + i)) % prime;
       }
       return hash;
   }
   \`\`\`

2. **Hash Update (Rolling):**
   \`\`\`javascript
   function updateHash(oldHash, oldChar, newChar, base, prime, h) {
       let newHash = (base * (oldHash - oldChar * h) + newChar) % prime;
       return newHash < 0 ? newHash + prime : newHash;
   }
   \`\`\``,
    quizQuestions: [
      {
        question: "What is the key technique used in Rabin-Karp algorithm?",
        options: ["Dynamic programming", "Rolling hash", "Binary search", "Two pointers"],
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
        options: ["O(n)", "O(m)", "O(n + m)", "O(nm)"],
        correctAnswer: 2,
        explanation: "On average, Rabin-Karp runs in O(n + m) time due to few hash collisions, though worst case is O(nm)."
      },
      {
        question: "What happens when we slide the window in rolling hash?",
        options: ["Recalculate entire hash", "Remove leftmost, add rightmost character", "Compare with pattern", "Reset to zero"],
        correctAnswer: 1,
        explanation: "Rolling hash efficiently updates by removing the leftmost character's contribution and adding the new rightmost character."
      },
      {
        question: "Which application benefits most from Rabin-Karp's ability to search multiple patterns?",
        options: ["Text editors", "Plagiarism detection", "Spell checkers", "Data compression"],
        correctAnswer: 1,
        explanation: "Plagiarism detection often needs to search for multiple patterns simultaneously, making Rabin-Karp ideal."
      }
    ]
  },
  {
    id: 'z-algorithm',
    title: 'Z Algorithm',
    description: 'Linear time string matching using Z array',
    category: 'Strings',
    difficulty: 'advanced',
    timeComplexity: 'O(n + m)',
    spaceComplexity: 'O(n + m)',
    voiceExplanation: `The Z Algorithm is like having a smart memory system that remembers patterns it has seen before. Imagine you're reading a book and you want to find every place where a certain phrase repeats. The Z Algorithm creates a special "memory array" called the Z array, where each position tells you how many characters match between that position and the very beginning of the string. It's like having a ruler that measures how much of the beginning of the string matches at each position. The brilliant part is that it uses previously computed information to avoid redundant comparisons - if you already know that positions 5-10 match the beginning, you can use that knowledge to quickly compute matches for positions 6, 7, 8, and so on. This makes it incredibly efficient for finding patterns, with applications in text editors, DNA analysis, and data compression.`,
    extendedDefinition: `The Z Algorithm is a linear-time string matching algorithm that constructs a Z array where Z[i] represents the length of the longest substring starting from position i that is also a prefix of the string. This powerful preprocessing enables efficient pattern matching and various string analysis tasks.

What it does: constructs Z array where each position stores length of longest prefix match starting from that position.

How it works: maintains Z-box representing rightmost matching segment, uses previously computed information to avoid redundant comparisons.

When to use: pattern matching, string analysis, text processing where prefix-based matching is needed with linear time complexity.`,
    example: `// Z Algorithm Implementation
function zAlgorithm(s) {
    const n = s.length;
    const z = new Array(n).fill(0);
    let l = 0, r = 0;
    
    for (let i = 1; i < n; i++) {
        if (i <= r) {
            z[i] = Math.min(r - i + 1, z[i - l]);
        }
        
        while (i + z[i] < n && s[z[i]] === s[i + z[i]]) {
            z[i]++;
        }
        
        if (i + z[i] - 1 > r) {
            l = i;
            r = i + z[i] - 1;
        }
    }
    return z;
}

// Pattern Matching
function findPattern(text, pattern) {
    const combined = pattern + "$" + text;
    const z = zAlgorithm(combined);
    const matches = [];
    
    for (let i = pattern.length + 1; i < z.length; i++) {
        if (z[i] === pattern.length) {
            matches.push(i - pattern.length - 1);
        }
    }
    return matches;
}

console.log(zAlgorithm("ababa")); // [0, 0, 3, 0, 1]
console.log(findPattern("ababcababa", "aba")); // [0, 5, 7]`,
    syntax: `**Z Algorithm Patterns:**

1. **Z Array Construction:**
   \`\`\`javascript
   function buildZArray(s) {
       const n = s.length, z = new Array(n).fill(0);
       let l = 0, r = 0;
       for (let i = 1; i < n; i++) {
           if (i <= r) z[i] = Math.min(r - i + 1, z[i - l]);
           while (i + z[i] < n && s[z[i]] === s[i + z[i]]) z[i]++;
           if (i + z[i] - 1 > r) { l = i; r = i + z[i] - 1; }
       }
       return z;
   }
   \`\`\`

2. **Pattern Matching:**
   \`\`\`javascript
   function zPatternMatch(text, pattern) {
       const combined = pattern + "$" + text;
       const z = buildZArray(combined);
       return z.map((val, i) => val === pattern.length ? 
                   i - pattern.length - 1 : -1).filter(x => x >= 0);
   }
   \`\`\``,
    quizQuestions: [
      {
        question: "What does Z[i] represent in the Z algorithm?",
        options: ["Position of character i", "Length of longest substring starting at i that matches prefix", "Number of comparisons at position i", "Hash value at position i"],
        correctAnswer: 1,
        explanation: "Z[i] represents the length of the longest substring starting from position i that is also a prefix of the string."
      },
      {
        question: "Why do we use a separator like '$' in Z algorithm for pattern matching?",
        options: ["To improve performance", "To prevent pattern from matching with itself in text", "To handle special characters", "To reduce memory usage"],
        correctAnswer: 1,
        explanation: "The separator ensures that the pattern doesn't match with itself when concatenated with the text, avoiding false positives."
      },
      {
        question: "What is the purpose of the Z-box [L, R] in the algorithm?",
        options: ["Store pattern positions", "Track rightmost matching segment", "Count character frequencies", "Maintain hash values"],
        correctAnswer: 1,
        explanation: "The Z-box [L, R] represents the rightmost segment that matches a prefix, allowing us to use previously computed information."
      },
      {
        question: "What is the time complexity of the Z algorithm?",
        options: ["O(n log n)", "O(nÃ‚Â²)", "O(n)", "O(n + m)"],
        correctAnswer: 2,
        explanation: "The Z algorithm runs in O(n) time because each character is examined at most twice during the entire process."
      },
      {
        question: "When processing position i, if i > R, what do we do?",
        options: ["Use Z[i-L]", "Set Z[i] = 0 and expand", "Skip to next position", "Reset L and R"],
        correctAnswer: 1,
        explanation: "If i > R, we're outside any known Z-box, so we start with Z[i] = 0 and expand from scratch."
      }
    ]
  },
  {
    id: 'manacher-algorithm',
    title: 'Manacher\'s Algorithm',
    description: 'Linear time algorithm to find all palindromes in string',
    category: 'Strings',
    difficulty: 'advanced',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    extendedDefinition: `Manacher's Algorithm is a sophisticated linear-time algorithm for finding all palindromic substrings in a string. It's particularly famous for solving the "longest palindromic substring" problem optimally, improving upon the naive O(nÃ‚Â³) and dynamic programming O(nÃ‚Â²) approaches.

What it does: finds all palindromic substrings in linear time using mirror symmetry properties of palindromes.

How it works: transforms string with special characters, maintains palindrome radius array, uses previously computed information to avoid redundant checks.

When to use: longest palindromic substring problems, DNA sequence analysis, text processing requiring all palindromes, competitive programming.`,
    voiceExplanation: `Think of Manacher's algorithm like a master palindrome detective with a perfect memory. Imagine you're walking down a street looking for houses that are perfectly symmetrical. Instead of checking each house from scratch, this detective is incredibly smart - when he finds a symmetrical house, he remembers that everything inside that house is also symmetrical. So when he moves to the next position, if it's still within a house he's already checked, he can use his memory to instantly know how much symmetry to expect. The brilliant preprocessing trick is like adding streetlights between every house - this way, whether the original palindrome was even or odd length, everything becomes odd length with a clear center. It's like having X-ray vision that can see all palindromes at once, making it the fastest way to find every single palindromic pattern in a string, which is why it's used in DNA analysis and advanced text processing.`,
    keyConcepts: `**Essential Concepts:**
1. **String Preprocessing**: Adding separators to handle even/odd length uniformly
2. **Palindrome Radius Array**: P[i] stores radius of palindrome centered at i
3. **Mirror Property**: Using symmetry within known palindromes
4. **Center and Right Boundary**: Tracking rightmost palindrome boundary
5. **Linear Time Guarantee**: Each character examined at most twice
6. **Sentinel Characters**: Boundary markers to avoid index checks
7. **Radius to Length Conversion**: Converting radius back to original string positions`,
    pseudocode: `**Manacher's Algorithm Pseudocode:**

ALGORITHM PreprocessString(string)
INPUT: string - the original string
OUTPUT: processed - string with separators and sentinels
BEGIN
    processed = "^#"  // start with sentinel and separator
    
    FOR each character c in string DO
        processed = processed + c + "#"
    END FOR
    
    processed = processed + "$"  // end with sentinel
    RETURN processed
END

ALGORITHM ManacherAlgorithm(string)
INPUT: string - the original string
OUTPUT: longestPalindrome - the longest palindromic substring
BEGIN
    processed = PreprocessString(string)
    n = processed.length
    P = array of size n, initialized to 0  // palindrome radius array
    center = 0  // center of rightmost palindrome
    right = 0   // right boundary of rightmost palindrome
    
    maxLength = 0
    centerIndex = 0
    
    FOR i = 1 TO n - 2 DO  // skip sentinels
        mirror = 2 * center - i  // mirror of i with respect to center
        
        // If i is within right boundary, use mirror property
        IF i < right THEN
            P[i] = MIN(right - i, P[mirror])
        END IF
        
        // Try to expand palindrome centered at i
        WHILE processed[i + (1 + P[i])] = processed[i - (1 + P[i])] DO
            P[i] = P[i] + 1
        END WHILE
        
        // If palindrome centered at i extends past right, update center and right
        IF i + P[i] > right THEN
            center = i
            right = i + P[i]
        END IF
        
        // Update maximum palindrome found
        IF P[i] > maxLength THEN
            maxLength = P[i]
            centerIndex = i
        END IF
    END FOR
    
    // Convert back to original string coordinates
    start = (centerIndex - maxLength) / 2
    RETURN string.substring(start, start + maxLength)
END`,
    implementationCode: `// Comprehensive Manacher's Algorithm Implementation

class ManacherAlgorithm {
    // Preprocess string to handle even/odd length palindromes uniformly
    static preprocess(str) {
        let processed = "^#";
        for (let char of str) {
            processed += char + "#";
        }
        processed += "$";
        return processed;
    }
    
    // Find longest palindromic substring
    static longestPalindrome(str) {
        if (!str || str.length === 0) return "";
        
        const processed = this.preprocess(str);
        const n = processed.length;
        const P = new Array(n).fill(0);
        let center = 0, right = 0;
        let maxLength = 0, centerIndex = 0;
        
        for (let i = 1; i < n - 1; i++) {
            const mirror = 2 * center - i;
            
            if (i < right) {
                P[i] = Math.min(right - i, P[mirror]);
            }
            
            // Try to expand palindrome centered at i
            while (processed[i + (1 + P[i])] === processed[i - (1 + P[i])]) {
                P[i]++;
            }
            
            // If palindrome centered at i extends past right, adjust center and right
            if (i + P[i] > right) {
                center = i;
                right = i + P[i];
            }
            
            // Update maximum palindrome
            if (P[i] > maxLength) {
                maxLength = P[i];
                centerIndex = i;
            }
        }
        
        const start = (centerIndex - maxLength) / 2;
        return str.substring(start, start + maxLength);
    }
    
    // Count all palindromic substrings
    static countPalindromes(str) {
        if (!str || str.length === 0) return 0;
        
        const processed = this.preprocess(str);
        const n = processed.length;
        const P = new Array(n).fill(0);
        let center = 0, right = 0;
        let count = 0;
        
        for (let i = 1; i < n - 1; i++) {
            const mirror = 2 * center - i;
            
            if (i < right) {
                P[i] = Math.min(right - i, P[mirror]);
            }
            
            while (processed[i + (1 + P[i])] === processed[i - (1 + P[i])]) {
                P[i]++;
            }
            
            if (i + P[i] > right) {
                center = i;
                right = i + P[i];
            }
            
            // Count palindromes: each radius contributes (radius + 1) / 2 palindromes
            count += Math.ceil(P[i] / 2);
        }
        
        return count;
    }
    
    // Find all palindromic substrings with their positions
    static findAllPalindromes(str) {
        if (!str || str.length === 0) return [];
        
        const processed = this.preprocess(str);
        const n = processed.length;
        const P = new Array(n).fill(0);
        let center = 0, right = 0;
        const palindromes = [];
        
        for (let i = 1; i < n - 1; i++) {
            const mirror = 2 * center - i;
            
            if (i < right) {
                P[i] = Math.min(right - i, P[mirror]);
            }
            
            while (processed[i + (1 + P[i])] === processed[i - (1 + P[i])]) {
                P[i]++;
            }
            
            if (i + P[i] > right) {
                center = i;
                right = i + P[i];
            }
            
            // Extract all palindromes centered at i
            for (let radius = 1; radius <= P[i]; radius++) {
                const start = (i - radius) / 2;
                const length = radius;
                if (start >= 0 && start + length <= str.length) {
                    palindromes.push({
                        text: str.substring(start, start + length),
                        start: start,
                        length: length
                    });
                }
            }
        }
        
        return palindromes.sort((a, b) => a.start - b.start);
    }
    
    // Check if string is a palindrome
    static isPalindrome(str) {
        const longest = this.longestPalindrome(str);
        return longest.length === str.length;
    }
    
    // Get detailed analysis of palindrome structure
    static analyze(str) {
        const processed = this.preprocess(str);
        const n = processed.length;
        const P = new Array(n).fill(0);
        let center = 0, right = 0;
        const steps = [];
        
        for (let i = 1; i < n - 1; i++) {
            const mirror = 2 * center - i;
            const oldP = P[i];
            
            if (i < right) {
                P[i] = Math.min(right - i, P[mirror]);
                steps.push({
                    step: i,
                    action: 'mirror',
                    description: \`Used mirror property: P[\${i}] = min(\${right - i}, P[\${mirror}]) = \${P[i]}\`
                });
            }
            
            while (processed[i + (1 + P[i])] === processed[i - (1 + P[i])]) {
                P[i]++;
            }
            
            if (P[i] !== oldP) {
                steps.push({
                    step: i,
                    action: 'expand',
                    description: \`Expanded palindrome at \${i}: P[\${i}] = \${P[i]}\`
                });
            }
            
            if (i + P[i] > right) {
                center = i;
                right = i + P[i];
                steps.push({
                    step: i,
                    action: 'update',
                    description: \`Updated center=\${center}, right=\${right}\`
                });
            }
        }
        
        return {
            original: str,
            processed: processed,
            P: P,
            steps: steps,
            longestPalindrome: this.longestPalindrome(str),
            allPalindromes: this.findAllPalindromes(str)
        };
    }
}

// Usage Examples
const text = "babad";
console.log("Longest palindrome:", ManacherAlgorithm.longestPalindrome(text));
console.log("Palindrome count:", ManacherAlgorithm.countPalindromes(text));
console.log("All palindromes:", ManacherAlgorithm.findAllPalindromes(text));
console.log("Is palindrome:", ManacherAlgorithm.isPalindrome("racecar"));

// Detailed analysis
const analysis = ManacherAlgorithm.analyze("ababa");
console.log("Analysis:", analysis);`,
    example: `// Manacher's Algorithm
function longestPalindrome(s) {
    // Preprocess string: "abc" -> "^#a#b#c#$"
    let processed = "^#";
    for (let char of s) processed += char + "#";
    processed += "$";
    
    const n = processed.length;
    const p = new Array(n).fill(0); // palindrome lengths
    let center = 0, right = 0;
    let maxLen = 0, centerIndex = 0;
    
    for (let i = 1; i < n - 1; i++) {
        const mirror = 2 * center - i;
        
        if (i < right) {
            p[i] = Math.min(right - i, p[mirror]);
        }
        
        // Try to expand palindrome centered at i
        while (processed[i + (1 + p[i])] === processed[i - (1 + p[i])]) {
            p[i]++;
        }
        
        // If palindrome centered at i extends past right, adjust center and right
        if (i + p[i] > right) {
            center = i;
            right = i + p[i];
        }
        
        // Update maximum palindrome
        if (p[i] > maxLen) {
            maxLen = p[i];
            centerIndex = i;
        }
    }
    
    const start = (centerIndex - maxLen) / 2;
    return s.substring(start, start + maxLen);
}`,
    syntax: `**Manacher's Algorithm Patterns:**

1. **String Preprocessing:**
   \`\`\`javascript
   function preprocess(s) {
       let result = "^#";
       for (let char of s) result += char + "#";
       return result + "$";
   }
   \`\`\`

2. **Palindrome Length Array:**
   \`\`\`javascript
   function manacher(s) {
       const processed = preprocess(s);
       const n = processed.length;
       const p = new Array(n).fill(0);
       let center = 0, right = 0;
       
       for (let i = 1; i < n - 1; i++) {
           const mirror = 2 * center - i;
           if (i < right) p[i] = Math.min(right - i, p[mirror]);
           
           while (processed[i + p[i] + 1] === processed[i - p[i] - 1]) p[i]++;
           
           if (i + p[i] > right) { center = i; right = i + p[i]; }
       }
       return p;
   }
   \`\`\``,
    quizQuestions: [
      {
        question: "Why does Manacher's algorithm preprocess the string by adding '#' characters?",
        options: ["To improve performance", "To handle even and odd length palindromes uniformly", "To avoid boundary checks", "To reduce memory usage"],
        correctAnswer: 1,
        explanation: "Adding '#' characters between every character makes all palindromes have odd length in the processed string, simplifying the algorithm."
      },
      {
        question: "What does P[i] represent in Manacher's algorithm?",
        options: ["Position of palindrome", "Radius of palindrome centered at i", "Length of palindrome", "Number of characters"],
        correctAnswer: 1,
        explanation: "P[i] represents the radius of the palindrome centered at position i in the preprocessed string."
      },
      {
        question: "What is the key insight that makes Manacher's algorithm linear time?",
        options: ["Using hash functions", "Mirror property of palindromes", "Dynamic programming", "Binary search"],
        correctAnswer: 1,
        explanation: "The mirror property allows us to use previously computed palindrome information to avoid redundant comparisons."
      },
      {
        question: "What are the sentinel characters '^' and '$' used for?",
        options: ["Pattern matching", "Avoiding boundary checks", "Hash calculation", "Memory optimization"],
        correctAnswer: 1,
        explanation: "Sentinel characters at the beginning and end prevent index out of bounds errors during expansion."
      },
      {
        question: "What is the time complexity of Manacher's algorithm?",
        options: ["O(n log n)", "O(nÃ‚Â²)", "O(n)", "O(nÃ‚Â³)"],
        correctAnswer: 2,
        explanation: "Manacher's algorithm runs in O(n) time because each character is examined at most twice during the entire process."
      }
    ]
  },
  {
    id: 'string-anagram',
    title: 'Anagram Detection',
    description: 'Check if two strings are anagrams of each other',
    category: 'Strings',
    difficulty: 'beginner',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    extendedDefinition: `Anagram detection is the process of determining whether two strings are anagrams of each other. Two strings are anagrams if they contain exactly the same characters with the same frequencies, but possibly in different orders. This fundamental string processing problem has applications in word games, cryptography, and text analysis.

What it does: checks if two strings contain exactly the same characters with the same frequencies in any order.

How it works: counts character frequencies in both strings and compares them, or sorts both strings and checks equality.

When to use: word games, cryptography, text analysis, duplicate detection, linguistic analysis.`,
    voiceExplanation: `Think of anagrams like word puzzles where you rearrange the letters of one word to form another word - like "listen" and "silent", or "elbow" and "below". The key insight is that anagrams must have exactly the same letters in the same quantities, just in different orders. Imagine you have two bags of letter tiles - if they're anagrams, both bags should contain identical sets of letters. The most efficient way to check this is to count the frequency of each letter in both strings. You can do this by going through the first string and adding 1 to each letter's count, then going through the second string and subtracting 1 from each letter's count. If they're true anagrams, all counts should end up at zero. It's like a perfect balancing act - every letter added from the first word should be perfectly canceled out by the same letter from the second word.`,
    realWorldApplications: `**Industry Applications:**
- **Word Games**: Scrabble, anagram solvers, crossword puzzles
- **Cryptography**: Detecting simple substitution ciphers and transpositions
- **Text Analysis**: Plagiarism detection, document similarity analysis
- **Data Deduplication**: Finding duplicate entries with different orderings
- **Bioinformatics**: DNA sequence analysis and pattern matching
- **Search Engines**: Query expansion and alternative search suggestions
- **Social Media**: Detecting spam accounts with scrambled usernames
- **Educational Software**: Language learning tools and spelling games`,
    keyConcepts: `**Essential Concepts:**
1. **Character Frequency**: Counting occurrences of each character
2. **Hash Table Usage**: Efficient storage and lookup of character counts
3. **Early Termination**: Optimizing by checking length first
4. **Space-Time Tradeoffs**: Array vs hash map based on alphabet size
5. **Case Sensitivity**: Handling uppercase/lowercase considerations
6. **Unicode Normalization**: Dealing with multi-byte characters
7. **Alphabet Constraints**: Leveraging known character sets for optimization`,
    pseudocode: `**Anagram Detection Pseudocode:**

ALGORITHM IsAnagramFrequencyCount(string1, string2)
INPUT: string1, string2 - the two strings to compare
OUTPUT: boolean - true if strings are anagrams, false otherwise
BEGIN
    // Early termination: different lengths cannot be anagrams
    IF string1.length Ã¢â€°Â  string2.length THEN
        RETURN false
    END IF
    
    // Initialize character frequency map
    charCount = new HashMap()
    
    // Count characters in first string
    FOR each character c in string1 DO
        IF charCount.contains(c) THEN
            charCount[c] = charCount[c] + 1
        ELSE
            charCount[c] = 1
        END IF
    END FOR
    
    // Subtract characters from second string
    FOR each character c in string2 DO
        IF NOT charCount.contains(c) THEN
            RETURN false  // Character not in first string
        END IF
        
        charCount[c] = charCount[c] - 1
        
        IF charCount[c] < 0 THEN
            RETURN false  // More occurrences in second string
        END IF
    END FOR
    
    // Check if all counts are zero
    FOR each count in charCount.values() DO
        IF count Ã¢â€°Â  0 THEN
            RETURN false
        END IF
    END FOR
    
    RETURN true
END

ALGORITHM IsAnagramSorting(string1, string2)
INPUT: string1, string2 - the two strings to compare
OUTPUT: boolean - true if strings are anagrams, false otherwise
BEGIN
    IF string1.length Ã¢â€°Â  string2.length THEN
        RETURN false
    END IF
    
    sortedString1 = SORT(string1.toCharArray())
    sortedString2 = SORT(string2.toCharArray())
    
    RETURN sortedString1 = sortedString2
END

ALGORITHM IsAnagramArray(string1, string2)
INPUT: string1, string2 - strings with characters in range [a-z]
OUTPUT: boolean - true if strings are anagrams, false otherwise
BEGIN
    IF string1.length Ã¢â€°Â  string2.length THEN
        RETURN false
    END IF
    
    count = array of size 26, initialized to 0
    
    FOR i = 0 TO string1.length - 1 DO
        count[string1[i] - 'a'] = count[string1[i] - 'a'] + 1
        count[string2[i] - 'a'] = count[string2[i] - 'a'] - 1
    END FOR
    
    FOR i = 0 TO 25 DO
        IF count[i] Ã¢â€°Â  0 THEN
            RETURN false
        END IF
    END FOR
    
    RETURN true
END`,
    implementationCode: `// Comprehensive Anagram Detection Implementation

class AnagramDetector {
    // Basic frequency counting approach - O(n) time, O(k) space where k is alphabet size
    static isAnagram(str1, str2) {
        if (str1.length !== str2.length) return false;
        
        const charCount = {};
        
        // Count characters in first string
        for (let char of str1.toLowerCase()) {
            charCount[char] = (charCount[char] || 0) + 1;
        }
        
        // Subtract characters from second string
        for (let char of str2.toLowerCase()) {
            if (!charCount[char]) return false;
            charCount[char]--;
            if (charCount[char] < 0) return false;
        }
        
        return true;
    }
    
    // Optimized version using single pass - O(n) time, O(k) space
    static isAnagramOptimized(str1, str2) {
        if (str1.length !== str2.length) return false;
        
        const charCount = {};
        
        // Single pass: increment for str1, decrement for str2
        for (let i = 0; i < str1.length; i++) {
            const char1 = str1[i].toLowerCase();
            const char2 = str2[i].toLowerCase();
            
            charCount[char1] = (charCount[char1] || 0) + 1;
            charCount[char2] = (charCount[char2] || 0) - 1;
        }
        
        // Check if all counts are zero
        for (let count of Object.values(charCount)) {
            if (count !== 0) return false;
        }
        
        return true;
    }
    
    // Array-based approach for lowercase letters only - O(n) time, O(1) space
    static isAnagramArray(str1, str2) {
        if (str1.length !== str2.length) return false;
        
        const count = new Array(26).fill(0);
        
        for (let i = 0; i < str1.length; i++) {
            count[str1.charCodeAt(i) - 97]++; // 'a' = 97
            count[str2.charCodeAt(i) - 97]--;
        }
        
        return count.every(c => c === 0);
    }
    
    // Sorting approach - O(n log n) time, O(n) space
    static isAnagramSorting(str1, str2) {
        if (str1.length !== str2.length) return false;
        
        const sorted1 = str1.toLowerCase().split('').sort().join('');
        const sorted2 = str2.toLowerCase().split('').sort().join('');
        
        return sorted1 === sorted2;
    }
    
    // Find all anagrams of a word in a list
    static findAnagrams(word, wordList) {
        const anagrams = [];
        
        for (let candidate of wordList) {
            if (this.isAnagram(word, candidate)) {
                anagrams.push(candidate);
            }
        }
        
        return anagrams;
    }
    
    // Group anagrams together
    static groupAnagrams(words) {
        const groups = {};
        
        for (let word of words) {
            // Use sorted word as key
            const key = word.toLowerCase().split('').sort().join('');
            
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(word);
        }
        
        return Object.values(groups);
    }
    
    // Check if string can form an anagram of target
    static canFormAnagram(source, target) {
        const sourceCount = {};
        const targetCount = {};
        
        // Count characters in both strings
        for (let char of source.toLowerCase()) {
            sourceCount[char] = (sourceCount[char] || 0) + 1;
        }
        
        for (let char of target.toLowerCase()) {
            targetCount[char] = (targetCount[char] || 0) + 1;
        }
        
        // Check if source has enough of each character
        for (let char in targetCount) {
            if ((sourceCount[char] || 0) < targetCount[char]) {
                return false;
            }
        }
        
        return true;
    }
    
    // Generate all possible anagrams (permutations) of a string
    static generateAnagrams(str) {
        if (str.length <= 1) return [str];
        
        const anagrams = [];
        
        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            const remaining = str.slice(0, i) + str.slice(i + 1);
            const subAnagrams = this.generateAnagrams(remaining);
            
            for (let subAnagram of subAnagrams) {
                anagrams.push(char + subAnagram);
            }
        }
        
        return [...new Set(anagrams)]; // Remove duplicates
    }
    
    // Performance comparison of different methods
    static performanceTest(str1, str2, iterations = 100000) {
        const methods = [
            { name: 'Frequency Count', fn: this.isAnagram },
            { name: 'Optimized', fn: this.isAnagramOptimized },
            { name: 'Array Based', fn: this.isAnagramArray },
            { name: 'Sorting', fn: this.isAnagramSorting }
        ];
        
        const results = {};
        
        for (let method of methods) {
            const start = performance.now();
            
            for (let i = 0; i < iterations; i++) {
                method.fn.call(this, str1, str2);
            }
            
            const end = performance.now();
            results[method.name] = end - start;
        }
        
        return results;
    }
}

// Usage Examples
console.log("Basic anagram check:", AnagramDetector.isAnagram("listen", "silent")); // true
console.log("Case insensitive:", AnagramDetector.isAnagram("Listen", "Silent")); // true
console.log("Not anagrams:", AnagramDetector.isAnagram("hello", "world")); // false

// Find anagrams in a list
const words = ["eat", "tea", "tan", "ate", "nat", "bat"];
console.log("Anagrams of 'eat':", AnagramDetector.findAnagrams("eat", words));

// Group anagrams
console.log("Grouped anagrams:", AnagramDetector.groupAnagrams(words));

// Performance comparison
const perf = AnagramDetector.performanceTest("listen", "silent");
console.log("Performance results:", perf);`,
    example: `// Anagram Detection
function isAnagram(s1, s2) {
    if (s1.length !== s2.length) return false;
    
    const charCount = {};
    
    // Count characters in first string
    for (let char of s1.toLowerCase()) {
        charCount[char] = (charCount[char] || 0) + 1;
    }
    
    // Subtract characters from second string
    for (let char of s2.toLowerCase()) {
        if (!charCount[char]) return false;
        charCount[char]--;
    }
    
    return true;
}

// Example usage
console.log(isAnagram("listen", "silent")); // true
console.log(isAnagram("hello", "world")); // false`,
    syntax: `**Anagram Detection Patterns:**

1. **Character Frequency Count:**
   \`\`\`javascript
   function isAnagram(s1, s2) {
       if (s1.length !== s2.length) return false;
       const count = {};
       for (let char of s1) count[char] = (count[char] || 0) + 1;
       for (let char of s2) {
           if (!count[char]) return false;
           count[char]--;
       }
       return true;
   }
   \`\`\``,
    quizQuestions: [
      {
        question: "What is the most efficient approach for anagram detection?",
        options: ["Sorting both strings", "Character frequency counting", "Nested loops", "Regular expressions"],
        correctAnswer: 1,
        explanation: "Character frequency counting is O(n) time and O(k) space where k is alphabet size, more efficient than O(n log n) sorting."
      },
      {
        question: "What should be the first check when determining if two strings are anagrams?",
        options: ["Character frequencies", "String lengths", "Alphabetical order", "Case sensitivity"],
        correctAnswer: 1,
        explanation: "If two strings have different lengths, they cannot be anagrams, so this is an efficient early termination check."
      },
      {
        question: "Which data structure is most suitable for counting character frequencies?",
        options: ["Array", "Hash table", "Linked list", "Stack"],
        correctAnswer: 1,
        explanation: "Hash tables provide O(1) average time for insertion and lookup, making them ideal for character frequency counting."
      },
      {
        question: "What is the space complexity of the character frequency approach for anagram detection?",
        options: ["O(1)", "O(n)", "O(k) where k is alphabet size", "O(nÃ‚Â²)"],
        correctAnswer: 2,
        explanation: "Space complexity is O(k) where k is the size of the character set (e.g., 26 for lowercase English letters)."
      },
      {
        question: "Which of these pairs are anagrams?",
        options: ["'listen' and 'silent'", "'hello' and 'world'", "'abc' and 'def'", "'cat' and 'dog'"],
        correctAnswer: 0,
        explanation: "'listen' and 'silent' contain exactly the same characters with the same frequencies, just in different order."
      }
    ]
  },

  // Linked Lists
  {
    id: 'linked-list-singly',
    title: 'Singly Linked List',
    description: 'Master basic linked list operations: insert, delete, traverse, reverse',
    category: 'Linked Lists',
    difficulty: 'beginner',
    timeComplexity: 'O(1) - O(n)',
    spaceComplexity: 'O(1)',
    voiceExplanation: `Think of a singly linked list like a treasure hunt where each clue leads you to the next location. Unlike an array where you can jump to any position instantly, a linked list is like a chain of connected nodes where each node knows only about the next one in line. Imagine you have a train where each car is connected to the next car, but you can only move forward - you can't go backwards. Each node in the list contains two things: the actual data you want to store, and a pointer or reference that tells you where to find the next node. The beauty of linked lists is their flexibility - you can easily add or remove nodes anywhere in the chain by simply updating the connections, like unhooking and rehooking train cars. However, if you want to find a specific piece of data, you have to start from the beginning and follow the chain until you find it, which can be slower than arrays for searching.`,
    extendedDefinition: `A Singly Linked List is a linear data structure where elements (nodes) are stored in sequence, with each node containing data and a reference (pointer) to the next node. Unlike arrays, linked lists don't require contiguous memory allocation, providing dynamic size capabilities.

What it does: stores elements in nodes connected by pointers, allowing dynamic insertion and deletion.

How it works: each node contains data and a pointer to the next node, creating a chain-like structure with sequential access.

When to use: dynamic size requirements, frequent insertions/deletions, when memory allocation is unpredictable.`,
    example: `// Singly Linked List Implementation
class ListNode {
    constructor(val) {
        this.val = val;
        this.next = null;
    }
}

class SinglyLinkedList {
    constructor() {
        this.head = null;
    }
    
    // Insert at beginning - O(1)
    insertAtHead(val) {
        const newNode = new ListNode(val);
        newNode.next = this.head;
        this.head = newNode;
    }
    
    // Insert at end - O(n)
    insertAtTail(val) {
        const newNode = new ListNode(val);
        if (!this.head) {
            this.head = newNode;
            return;
        }
        
        let current = this.head;
        while (current.next) {
            current = current.next;
        }
        current.next = newNode;
    }
    
    // Delete by value - O(n)
    delete(val) {
        if (!this.head) return;
        
        if (this.head.val === val) {
            this.head = this.head.next;
            return;
        }
        
        let current = this.head;
        while (current.next && current.next.val !== val) {
            current = current.next;
        }
        
        if (current.next) {
            current.next = current.next.next;
        }
    }
    
    // Reverse list - O(n)
    reverse() {
        let prev = null, current = this.head;
        
        while (current) {
            const next = current.next;
            current.next = prev;
            prev = current;
            current = next;
        }
        
        this.head = prev;
    }
    
    // Display list - O(n)
    display() {
        const result = [];
        let current = this.head;
        while (current) {
            result.push(current.val);
            current = current.next;
        }
        return result;
    }
}`,
    syntax: `**Singly Linked List Patterns:**

1. **Node Structure:**
   \`\`\`javascript
   class ListNode {
       constructor(val) {
           this.val = val;
           this.next = null;
       }
   }
   \`\`\`

2. **Traversal Pattern:**
   \`\`\`javascript
   let current = head;
   while (current) {
       // Process current node
       current = current.next;
   }
   \`\`\`

3. **Reverse Pattern:**
   \`\`\`javascript
   let prev = null, current = head;
   while (current) {
       const next = current.next;
       current.next = prev;
       prev = current;
       current = next;
   }
   return prev; // new head
   \`\`\``,
    realWorldApplications: `**Industry Applications:**
- **Operating Systems**: Process scheduling, memory management, undo operations
- **Web Browsers**: Browser history, back button functionality
- **Music/Video Players**: Playlist management, next/previous track navigation
- **Text Editors**: Undo/redo operations, cursor position tracking
- **Database Systems**: Buffer management, transaction logs
- **Compilers**: Symbol tables, syntax tree construction
- **Game Development**: Inventory systems, AI pathfinding
- **Social Media**: Timeline feeds, friend connections`,
    keyConcepts: `**Essential Concepts:**
1. **Node Structure**: Data field and next pointer combination
2. **Head Pointer**: Reference to the first node in the list
3. **Dynamic Memory**: Nodes allocated and deallocated as needed
4. **Sequential Access**: Must traverse from head to reach any element
5. **Pointer Manipulation**: Core skill for insertion and deletion
6. **Memory Management**: Proper allocation and deallocation
7. **Traversal Patterns**: Standard iteration techniques`,
    pseudocode: `**Singly Linked List Operations Pseudocode:**

ALGORITHM InsertAtHead(list, data)
INPUT: list - the linked list, data - value to insert
OUTPUT: updated list with new head
BEGIN
    newNode = CreateNode(data)
    newNode.next = list.head
    list.head = newNode
END

ALGORITHM InsertAtTail(list, data)
INPUT: list - the linked list, data - value to insert
OUTPUT: updated list with new tail
BEGIN
    newNode = CreateNode(data)
    IF list.head = NULL THEN
        list.head = newNode
        RETURN
    END IF
    
    current = list.head
    WHILE current.next Ã¢â€°Â  NULL DO
        current = current.next
    END WHILE
    current.next = newNode
END

ALGORITHM DeleteByValue(list, value)
INPUT: list - the linked list, value - value to delete
OUTPUT: updated list with node removed
BEGIN
    IF list.head = NULL THEN
        RETURN
    END IF
    
    IF list.head.data = value THEN
        list.head = list.head.next
        RETURN
    END IF
    
    current = list.head
    WHILE current.next Ã¢â€°Â  NULL AND current.next.data Ã¢â€°Â  value DO
        current = current.next
    END WHILE
    
    IF current.next Ã¢â€°Â  NULL THEN
        current.next = current.next.next
    END IF
END

ALGORITHM ReverseList(list)
INPUT: list - the linked list to reverse
OUTPUT: reversed linked list
BEGIN
    prev = NULL
    current = list.head
    
    WHILE current Ã¢â€°Â  NULL DO
        next = current.next
        current.next = prev
        prev = current
        current = next
    END WHILE
    
    list.head = prev
END

ALGORITHM TraverseList(list)
INPUT: list - the linked list to traverse
OUTPUT: prints all elements
BEGIN
    current = list.head
    WHILE current Ã¢â€°Â  NULL DO
        PRINT current.data
        current = current.next
    END WHILE
END`,
    implementationCode: `// Comprehensive Singly Linked List Implementation

class ListNode {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class SinglyLinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }
    
    // Insert at beginning - O(1)
    insertAtHead(data) {
        const newNode = new ListNode(data);
        newNode.next = this.head;
        this.head = newNode;
        this.size++;
        return this;
    }
    
    // Insert at end - O(n)
    insertAtTail(data) {
        const newNode = new ListNode(data);
        
        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
        this.size++;
        return this;
    }
    
    // Insert at specific position - O(n)
    insertAtPosition(position, data) {
        if (position < 0 || position > this.size) {
            throw new Error('Position out of bounds');
        }
        
        if (position === 0) {
            return this.insertAtHead(data);
        }
        
        const newNode = new ListNode(data);
        let current = this.head;
        
        for (let i = 0; i < position - 1; i++) {
            current = current.next;
        }
        
        newNode.next = current.next;
        current.next = newNode;
        this.size++;
        return this;
    }
    
    // Delete by value - O(n)
    deleteByValue(value) {
        if (!this.head) return false;
        
        if (this.head.data === value) {
            this.head = this.head.next;
            this.size--;
            return true;
        }
        
        let current = this.head;
        while (current.next && current.next.data !== value) {
            current = current.next;
        }
        
        if (current.next) {
            current.next = current.next.next;
            this.size--;
            return true;
        }
        
        return false;
    }
    
    // Delete at position - O(n)
    deleteAtPosition(position) {
        if (position < 0 || position >= this.size) {
            throw new Error('Position out of bounds');
        }
        
        if (position === 0) {
            const deletedData = this.head.data;
            this.head = this.head.next;
            this.size--;
            return deletedData;
        }
        
        let current = this.head;
        for (let i = 0; i < position - 1; i++) {
            current = current.next;
        }
        
        const deletedData = current.next.data;
        current.next = current.next.next;
        this.size--;
        return deletedData;
    }
    
    // Search for value - O(n)
    search(value) {
        let current = this.head;
        let position = 0;
        
        while (current) {
            if (current.data === value) {
                return position;
            }
            current = current.next;
            position++;
        }
        
        return -1;
    }
    
    // Get value at position - O(n)
    get(position) {
        if (position < 0 || position >= this.size) {
            throw new Error('Position out of bounds');
        }
        
        let current = this.head;
        for (let i = 0; i < position; i++) {
            current = current.next;
        }
        
        return current.data;
    }
    
    // Reverse the list - O(n)
    reverse() {
        let prev = null;
        let current = this.head;
        
        while (current) {
            const next = current.next;
            current.next = prev;
            prev = current;
            current = next;
        }
        
        this.head = prev;
        return this;
    }
    
    // Get middle element - O(n)
    getMiddle() {
        if (!this.head) return null;
        
        let slow = this.head;
        let fast = this.head;
        
        while (fast && fast.next) {
            slow = slow.next;
            fast = fast.next.next;
        }
        
        return slow.data;
    }
    
    // Detect cycle - O(n)
    hasCycle() {
        if (!this.head) return false;
        
        let slow = this.head;
        let fast = this.head;
        
        while (fast && fast.next) {
            slow = slow.next;
            fast = fast.next.next;
            
            if (slow === fast) {
                return true;
            }
        }
        
        return false;
    }
    
    // Convert to array - O(n)
    toArray() {
        const result = [];
        let current = this.head;
        
        while (current) {
            result.push(current.data);
            current = current.next;
        }
        
        return result;
    }
    
    // Get size - O(1)
    getSize() {
        return this.size;
    }
    
    // Check if empty - O(1)
    isEmpty() {
        return this.size === 0;
    }
    
    // Clear the list - O(1)
    clear() {
        this.head = null;
        this.size = 0;
        return this;
    }
    
    // Display list - O(n)
    display() {
        if (!this.head) {
            console.log('List is empty');
            return;
        }
        
        const values = this.toArray();
        console.log(values.join(' -> ') + ' -> null');
    }
    
    // Create from array - O(n)
    static fromArray(array) {
        const list = new SinglyLinkedList();
        for (const item of array) {
            list.insertAtTail(item);
        }
        return list;
    }
}

// Usage Examples
const list = new SinglyLinkedList();

// Insert operations
list.insertAtHead(1).insertAtHead(2).insertAtTail(3);
console.log('List:', list.toArray()); // [2, 1, 3]

// Search operations
console.log('Position of 1:', list.search(1)); // 1
console.log('Value at position 0:', list.get(0)); // 2

// Delete operations
list.deleteByValue(1);
console.log('After deleting 1:', list.toArray()); // [2, 3]

// Reverse
list.reverse();
console.log('Reversed:', list.toArray()); // [3, 2]

// Utility operations
console.log('Middle element:', list.getMiddle()); // 2
console.log('Size:', list.getSize()); // 2
console.log('Is empty:', list.isEmpty()); // false`,
    quizQuestions: [
      {
        question: "What is the time complexity of inserting an element at the head of a singly linked list?",
        options: ["O(1)", "O(log n)", "O(n)", "O(nÃ‚Â²)"],
        correctAnswer: 0,
        explanation: "Inserting at the head requires only updating the head pointer and the new node's next pointer, which is constant time O(1)."
      },
      {
        question: "Why is random access not possible in a singly linked list?",
        options: ["Nodes are not indexed", "Memory is not contiguous", "Must traverse from head", "All of the above"],
        correctAnswer: 3,
        explanation: "Singly linked lists don't support random access because nodes aren't indexed, memory isn't contiguous, and you must traverse from the head to reach any element."
      },
      {
        question: "What is the main advantage of linked lists over arrays?",
        options: ["Faster access", "Better cache performance", "Dynamic size", "Less memory usage"],
        correctAnswer: 2,
        explanation: "The main advantage of linked lists is their dynamic size - they can grow or shrink during runtime without declaring a fixed size."
      },
      {
        question: "In the two-pointer technique for finding the middle of a linked list, how do the pointers move?",
        options: ["Both move one step", "Both move two steps", "Slow: 1 step, Fast: 2 steps", "Slow: 2 steps, Fast: 1 step"],
        correctAnswer: 2,
        explanation: "The slow pointer moves one step while the fast pointer moves two steps. When fast reaches the end, slow will be at the middle."
      },
      {
        question: "What happens to the original head when reversing a singly linked list?",
        options: ["It becomes the tail", "It gets deleted", "It stays the head", "It points to null"],
        correctAnswer: 0,
        explanation: "When reversing a singly linked list, the original head becomes the tail of the reversed list."
      }
    ]
  },
  {
    id: 'linked-list-doubly',
    title: 'Doubly Linked List',
    description: 'Bidirectional linked list with efficient forward and backward operations',
    category: 'Linked Lists',
    difficulty: 'intermediate',
    timeComplexity: 'O(1) - O(n)',
    spaceComplexity: 'O(1)',
    voiceExplanation: `A doubly linked list is like upgrading from a one-way street to a two-way street. While a singly linked list only lets you move forward from one node to the next, a doubly linked list gives each node two connections - one pointing to the next node and another pointing to the previous node. Think of it like a train where each car is connected to both the car in front and the car behind it. This bidirectional connectivity makes many operations more efficient. For example, if you want to delete a node, you don't need to traverse from the beginning to find the previous node - you already have a direct reference to it. You can also traverse the list in both directions, which is useful for applications like browser history where you need to go both forward and backward through pages. The trade-off is that each node requires extra memory to store the additional pointer, but this cost is often worth it for the added flexibility and efficiency.`,
    extendedDefinition: `A Doubly Linked List is a linear data structure where each node contains data and two pointers: one pointing to the next node and another pointing to the previous node. This bidirectional linking provides enhanced flexibility for traversal and manipulation operations.

What it does: stores elements in nodes with bidirectional pointers, allowing efficient forward and backward traversal.

How it works: each node contains data, next pointer, and previous pointer, creating bidirectional connections between adjacent nodes.

When to use: browser history, undo/redo operations, LRU cache implementation, when frequent bidirectional traversal is needed.`,
    realWorldApplications: `**Industry Applications:**
- **Web Browsers**: Forward and backward navigation history
- **Text Editors**: Cursor movement, undo/redo operations with bidirectional access
- **Music Players**: Previous/next track with seamless navigation
- **Operating Systems**: Process scheduling with priority queues
- **Database Systems**: LRU cache implementation, buffer management
- **Game Development**: Player movement history, game state management
- **File Systems**: Directory navigation, file history tracking
- **Social Media**: Timeline navigation, content browsing`,
    keyConcepts: `**Essential Concepts:**
1. **Bidirectional Pointers**: Next and previous pointer management
2. **Head and Tail Maintenance**: Efficient access to both ends
3. **Symmetric Operations**: Operations possible from both directions
4. **Memory Trade-offs**: Extra space for improved time complexity
5. **Pointer Integrity**: Maintaining consistency between next and prev pointers
6. **Boundary Conditions**: Handling empty list, single node cases
7. **Circular Variants**: Understanding doubly circular linked lists`,
    pseudocode: `**Doubly Linked List Operations Pseudocode:**

ALGORITHM InsertAtHead(list, data)
INPUT: list - the doubly linked list, data - value to insert
OUTPUT: updated list with new head
BEGIN
    newNode = CreateNode(data)
    newNode.next = list.head
    newNode.prev = NULL
    
    IF list.head Ã¢â€°Â  NULL THEN
        list.head.prev = newNode
    ELSE
        list.tail = newNode
    END IF
    
    list.head = newNode
END

ALGORITHM InsertAtTail(list, data)
INPUT: list - the doubly linked list, data - value to insert
OUTPUT: updated list with new tail
BEGIN
    newNode = CreateNode(data)
    newNode.next = NULL
    newNode.prev = list.tail
    
    IF list.tail Ã¢â€°Â  NULL THEN
        list.tail.next = newNode
    ELSE
        list.head = newNode
    END IF
    
    list.tail = newNode
END

ALGORITHM DeleteNode(list, node)
INPUT: list - the doubly linked list, node - node to delete
OUTPUT: updated list with node removed
BEGIN
    IF node.prev Ã¢â€°Â  NULL THEN
        node.prev.next = node.next
    ELSE
        list.head = node.next
    END IF
    
    IF node.next Ã¢â€°Â  NULL THEN
        node.next.prev = node.prev
    ELSE
        list.tail = node.prev
    END IF
END

ALGORITHM TraverseForward(list)
INPUT: list - the doubly linked list
OUTPUT: prints all elements forward
BEGIN
    current = list.head
    WHILE current Ã¢â€°Â  NULL DO
        PRINT current.data
        current = current.next
    END WHILE
END

ALGORITHM TraverseBackward(list)
INPUT: list - the doubly linked list
OUTPUT: prints all elements backward
BEGIN
    current = list.tail
    WHILE current Ã¢â€°Â  NULL DO
        PRINT current.data
        current = current.prev
    END WHILE
END`,
    implementationCode: `// Comprehensive Doubly Linked List Implementation

class DoublyNode {
    constructor(data) {
        this.data = data;
        this.next = null;
        this.prev = null;
    }
}

class DoublyLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }
    
    // Insert at beginning - O(1)
    insertAtHead(data) {
        const newNode = new DoublyNode(data);
        
        if (!this.head) {
            this.head = this.tail = newNode;
        } else {
            newNode.next = this.head;
            this.head.prev = newNode;
            this.head = newNode;
        }
        
        this.size++;
        return this;
    }
    
    // Insert at end - O(1)
    insertAtTail(data) {
        const newNode = new DoublyNode(data);
        
        if (!this.tail) {
            this.head = this.tail = newNode;
        } else {
            newNode.prev = this.tail;
            this.tail.next = newNode;
            this.tail = newNode;
        }
        
        this.size++;
        return this;
    }
    
    // Insert at specific position - O(n)
    insertAtPosition(position, data) {
        if (position < 0 || position > this.size) {
            throw new Error('Position out of bounds');
        }
        
        if (position === 0) {
            return this.insertAtHead(data);
        }
        
        if (position === this.size) {
            return this.insertAtTail(data);
        }
        
        const newNode = new DoublyNode(data);
        let current;
        
        // Optimize traversal direction
        if (position <= this.size / 2) {
            current = this.head;
            for (let i = 0; i < position; i++) {
                current = current.next;
            }
        } else {
            current = this.tail;
            for (let i = this.size - 1; i > position; i--) {
                current = current.prev;
            }
        }
        
        newNode.next = current;
        newNode.prev = current.prev;
        current.prev.next = newNode;
        current.prev = newNode;
        
        this.size++;
        return this;
    }
    
    // Delete by value - O(n)
    deleteByValue(value) {
        let current = this.head;
        
        while (current) {
            if (current.data === value) {
                this.deleteNode(current);
                return true;
            }
            current = current.next;
        }
        
        return false;
    }
    
    // Delete specific node - O(1)
    deleteNode(node) {
        if (!node) return false;
        
        if (node.prev) {
            node.prev.next = node.next;
        } else {
            this.head = node.next;
        }
        
        if (node.next) {
            node.next.prev = node.prev;
        } else {
            this.tail = node.prev;
        }
        
        this.size--;
        return true;
    }
    
    // Delete at position - O(n)
    deleteAtPosition(position) {
        if (position < 0 || position >= this.size) {
            throw new Error('Position out of bounds');
        }
        
        let current;
        
        // Optimize traversal direction
        if (position <= this.size / 2) {
            current = this.head;
            for (let i = 0; i < position; i++) {
                current = current.next;
            }
        } else {
            current = this.tail;
            for (let i = this.size - 1; i > position; i--) {
                current = current.prev;
            }
        }
        
        const deletedData = current.data;
        this.deleteNode(current);
        return deletedData;
    }
    
    // Search for value - O(n)
    search(value) {
        let current = this.head;
        let position = 0;
        
        while (current) {
            if (current.data === value) {
                return position;
            }
            current = current.next;
            position++;
        }
        
        return -1;
    }
    
    // Get value at position - O(n)
    get(position) {
        if (position < 0 || position >= this.size) {
            throw new Error('Position out of bounds');
        }
        
        let current;
        
        // Optimize traversal direction
        if (position <= this.size / 2) {
            current = this.head;
            for (let i = 0; i < position; i++) {
                current = current.next;
            }
        } else {
            current = this.tail;
            for (let i = this.size - 1; i > position; i--) {
                current = current.prev;
            }
        }
        
        return current.data;
    }
    
    // Reverse the list - O(n)
    reverse() {
        let current = this.head;
        
        while (current) {
            // Swap next and prev pointers
            const temp = current.next;
            current.next = current.prev;
            current.prev = temp;
            
            current = temp;
        }
        
        // Swap head and tail
        const temp = this.head;
        this.head = this.tail;
        this.tail = temp;
        
        return this;
    }
    
    // Convert to array (forward) - O(n)
    toArray() {
        const result = [];
        let current = this.head;
        
        while (current) {
            result.push(current.data);
            current = current.next;
        }
        
        return result;
    }
    
    // Convert to array (backward) - O(n)
    toArrayReverse() {
        const result = [];
        let current = this.tail;
        
        while (current) {
            result.push(current.data);
            current = current.prev;
        }
        
        return result;
    }
    
    // Get size - O(1)
    getSize() {
        return this.size;
    }
    
    // Check if empty - O(1)
    isEmpty() {
        return this.size === 0;
    }
    
    // Clear the list - O(1)
    clear() {
        this.head = null;
        this.tail = null;
        this.size = 0;
        return this;
    }
    
    // Display list forward - O(n)
    displayForward() {
        if (!this.head) {
            console.log('List is empty');
            return;
        }
        
        const values = this.toArray();
        console.log('Forward: ' + values.join(' <-> '));
    }
    
    // Display list backward - O(n)
    displayBackward() {
        if (!this.tail) {
            console.log('List is empty');
            return;
        }
        
        const values = this.toArrayReverse();
        console.log('Backward: ' + values.join(' <-> '));
    }
    
    // Create from array - O(n)
    static fromArray(array) {
        const list = new DoublyLinkedList();
        for (const item of array) {
            list.insertAtTail(item);
        }
        return list;
    }
}

// Usage Examples
const dList = new DoublyLinkedList();

// Insert operations
dList.insertAtHead(1).insertAtTail(2).insertAtTail(3);
console.log('List:', dList.toArray()); // [1, 2, 3]

// Bidirectional traversal
dList.displayForward();  // Forward: 1 <-> 2 <-> 3
dList.displayBackward(); // Backward: 3 <-> 2 <-> 1

// Efficient operations
console.log('Value at position 1:', dList.get(1)); // 2
dList.deleteAtPosition(1);
console.log('After deletion:', dList.toArray()); // [1, 3]

// Reverse
dList.reverse();
console.log('Reversed:', dList.toArray()); // [3, 1]`,
    example: `// Doubly Linked List Node
class DoublyNode {
    constructor(data) {
        this.data = data;
        this.next = null;
        this.prev = null;
    }
}

class DoublyLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
    }
    
    // Insert at beginning
    insertAtBeginning(data) {
        const newNode = new DoublyNode(data);
        if (!this.head) {
            this.head = this.tail = newNode;
        } else {
            newNode.next = this.head;
            this.head.prev = newNode;
            this.head = newNode;
        }
    }
    
    // Display forward
    displayForward() {
        const result = [];
        let current = this.head;
        while (current) {
            result.push(current.data);
            current = current.next;
        }
        return result;
    }
}`,
    syntax: `**Doubly Linked List Patterns:**

1. **Node Structure:**
   \`\`\`javascript
   class DoublyNode {
       constructor(data) {
           this.data = data;
           this.next = null;
           this.prev = null;
       }
   }
   \`\`\`

2. **Insert at Beginning:**
   \`\`\`javascript
   insertAtBeginning(data) {
       const newNode = new DoublyNode(data);
       if (!this.head) {
           this.head = this.tail = newNode;
       } else {
           newNode.next = this.head;
           this.head.prev = newNode;
           this.head = newNode;
       }
   }
   \`\`\``,
    quizQuestions: [
      {
        question: "What is the main advantage of a doubly linked list over a singly linked list?",
        options: ["Uses less memory", "Bidirectional traversal", "Faster insertion", "Better cache performance"],
        correctAnswer: 1,
        explanation: "The main advantage is bidirectional traversal - you can move both forward and backward through the list efficiently."
      },
      {
        question: "What is the time complexity of deleting a node when you have a direct reference to it in a doubly linked list?",
        options: ["O(1)", "O(log n)", "O(n)", "O(nÃ‚Â²)"],
        correctAnswer: 0,
        explanation: "With a direct reference to the node, deletion is O(1) because you can directly update the prev and next pointers without traversal."
      },
      {
        question: "How many pointers does each node in a doubly linked list contain?",
        options: ["1", "2", "3", "4"],
        correctAnswer: 1,
        explanation: "Each node contains 2 pointers: one pointing to the next node and one pointing to the previous node."
      },
      {
        question: "What optimization can be used when accessing elements in a doubly linked list?",
        options: ["Binary search", "Choose traversal direction based on position", "Hash table lookup", "Skip list"],
        correctAnswer: 1,
        explanation: "You can optimize by choosing to traverse from head or tail based on whether the target position is closer to the beginning or end."
      },
      {
        question: "What is the space complexity trade-off of doubly linked lists compared to singly linked lists?",
        options: ["Same space complexity", "Half the space", "Double the space", "Extra pointer per node"],
        correctAnswer: 3,
        explanation: "Doubly linked lists require an extra pointer per node (the previous pointer), increasing memory overhead."
      }
    ]
  },
  {
    id: 'linked-list-circular',
    title: 'Circular Linked List',
    description: 'Circular linked list where last node points to first node',
    category: 'Linked Lists',
    difficulty: 'intermediate',
    timeComplexity: 'O(1) - O(n)',
    spaceComplexity: 'O(1)',
    voiceExplanation: `A circular linked list is like a regular linked list that has been bent into a circle - the last node points back to the first node instead of pointing to null. Imagine a group of people holding hands in a circle, where each person can only see and hold hands with the person next to them. You can start from any person and keep walking around the circle, and you'll eventually come back to where you started. This circular structure is perfect for applications that need to cycle through items repeatedly, like a playlist that repeats, a round-robin scheduler, or a game where players take turns. The tricky part is avoiding infinite loops when traversing - you need to remember where you started so you know when you've completed a full circle. Circular linked lists are especially useful when you need to represent cyclical processes or when you want to eliminate the concept of a "beginning" and "end" in your data structure.`,
    example: `// Circular Linked List
class CircularLinkedList {
    constructor() {
        this.head = null;
    }
    
    // Insert at end
    insertAtEnd(data) {
        const newNode = { data, next: null };
        
        if (!this.head) {
            this.head = newNode;
            newNode.next = this.head; // Point to itself
        } else {
            let current = this.head;
            while (current.next !== this.head) {
                current = current.next;
            }
            current.next = newNode;
            newNode.next = this.head;
        }
    }
    
    // Display (with cycle detection)
    display() {
        if (!this.head) return [];
        
        const result = [this.head.data];
        let current = this.head.next;
        
        while (current !== this.head) {
            result.push(current.data);
            current = current.next;
        }
        return result;
    }
}`,
    syntax: `**Circular Linked List Patterns:**

1. **Insert at End:**
   \`\`\`javascript
   insertAtEnd(data) {
       const newNode = { data, next: null };
       if (!this.head) {
           this.head = newNode;
           newNode.next = this.head;
       } else {
           let current = this.head;
           while (current.next !== this.head) {
               current = current.next;
           }
           current.next = newNode;
           newNode.next = this.head;
       }
   }
   \`\`\`

2. **Traversal with Cycle Detection:**
   \`\`\`javascript
   traverse() {
       if (!this.head) return;
       let current = this.head;
       do {
           console.log(current.data);
           current = current.next;
       } while (current !== this.head);
   }
   \`\`\``,
    extendedDefinition: `A Circular Linked List is a variation of a linked list where the last node points back to the first node instead of pointing to null, forming a circular structure. This creates a continuous loop where you can traverse indefinitely without reaching an end.

What it does: creates continuous loop structure where last node connects back to first node, enabling infinite traversal.

How it works: last node points to first node instead of null, forming circular structure that eliminates fixed start/end points.

When to use: round-robin scheduling, circular buffers, cyclic processes, when you need continuous traversal without null checks.`,
    realWorldApplications: `**Industry Applications:**
- **Operating Systems**: Round-robin CPU scheduling, process management
- **Game Development**: Turn-based games, player rotation, game loops
- **Media Players**: Playlist repeat functionality, continuous playback
- **Network Protocols**: Token ring networks, circular buffer implementation
- **Resource Management**: Load balancing, resource allocation in distributed systems
- **Embedded Systems**: Circular buffers for sensor data, real-time processing
- **Database Systems**: Circular replication, distributed database management
- **Web Servers**: Request routing, server load distribution`,
    keyConcepts: `**Essential Concepts:**
1. **Circular Property**: Last node points to first node, creating a cycle
2. **Cycle Detection**: Techniques to avoid infinite loops during traversal
3. **Starting Point Tracking**: Remembering where traversal began
4. **Termination Conditions**: Proper loop exit strategies
5. **Insertion Strategies**: Maintaining circularity during modifications
6. **Memory Management**: Proper cleanup to avoid memory leaks
7. **Round-Robin Logic**: Understanding cyclic access patterns`,
    pseudocode: `**Circular Linked List Operations Pseudocode:**

ALGORITHM InsertAtBeginning(list, data)
INPUT: list - circular linked list, data - value to insert
OUTPUT: updated list with new head
BEGIN
    newNode = CreateNode(data)
    
    IF list.head = NULL THEN
        list.head = newNode
        newNode.next = newNode  // Point to itself
    ELSE
        // Find the last node
        current = list.head
        WHILE current.next Ã¢â€°Â  list.head DO
            current = current.next
        END WHILE
        
        newNode.next = list.head
        current.next = newNode
        list.head = newNode
    END IF
END

ALGORITHM InsertAtEnd(list, data)
INPUT: list - circular linked list, data - value to insert
OUTPUT: updated list with new tail
BEGIN
    newNode = CreateNode(data)
    
    IF list.head = NULL THEN
        list.head = newNode
        newNode.next = newNode
    ELSE
        current = list.head
        WHILE current.next Ã¢â€°Â  list.head DO
            current = current.next
        END WHILE
        
        current.next = newNode
        newNode.next = list.head
    END IF
END

ALGORITHM DeleteByValue(list, value)
INPUT: list - circular linked list, value - value to delete
OUTPUT: updated list with node removed
BEGIN
    IF list.head = NULL THEN
        RETURN false
    END IF
    
    // If deleting the only node
    IF list.head.next = list.head AND list.head.data = value THEN
        list.head = NULL
        RETURN true
    END IF
    
    // If deleting the head node
    IF list.head.data = value THEN
        current = list.head
        WHILE current.next Ã¢â€°Â  list.head DO
            current = current.next
        END WHILE
        current.next = list.head.next
        list.head = list.head.next
        RETURN true
    END IF
    
    // Delete non-head node
    current = list.head
    WHILE current.next Ã¢â€°Â  list.head AND current.next.data Ã¢â€°Â  value DO
        current = current.next
    END WHILE
    
    IF current.next.data = value THEN
        current.next = current.next.next
        RETURN true
    END IF
    
    RETURN false
END

ALGORITHM TraverseCircular(list)
INPUT: list - circular linked list
OUTPUT: prints all elements once
BEGIN
    IF list.head = NULL THEN
        RETURN
    END IF
    
    current = list.head
    DO
        PRINT current.data
        current = current.next
    WHILE current Ã¢â€°Â  list.head
END`,
    implementationCode: `// Comprehensive Circular Linked List Implementation

class CircularNode {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class CircularLinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }
    
    // Insert at beginning - O(n) due to finding last node
    insertAtHead(data) {
        const newNode = new CircularNode(data);
        
        if (!this.head) {
            this.head = newNode;
            newNode.next = newNode; // Point to itself
        } else {
            // Find the last node
            let current = this.head;
            while (current.next !== this.head) {
                current = current.next;
            }
            
            newNode.next = this.head;
            current.next = newNode;
            this.head = newNode;
        }
        
        this.size++;
        return this;
    }
    
    // Insert at end - O(n)
    insertAtTail(data) {
        const newNode = new CircularNode(data);
        
        if (!this.head) {
            this.head = newNode;
            newNode.next = newNode;
        } else {
            let current = this.head;
            while (current.next !== this.head) {
                current = current.next;
            }
            
            current.next = newNode;
            newNode.next = this.head;
        }
        
        this.size++;
        return this;
    }
    
    // Insert at specific position - O(n)
    insertAtPosition(position, data) {
        if (position < 0 || position > this.size) {
            throw new Error('Position out of bounds');
        }
        
        if (position === 0) {
            return this.insertAtHead(data);
        }
        
        const newNode = new CircularNode(data);
        let current = this.head;
        
        for (let i = 0; i < position - 1; i++) {
            current = current.next;
        }
        
        newNode.next = current.next;
        current.next = newNode;
        this.size++;
        return this;
    }
    
    // Delete by value - O(n)
    deleteByValue(value) {
        if (!this.head) return false;
        
        // If deleting the only node
        if (this.head.next === this.head && this.head.data === value) {
            this.head = null;
            this.size--;
            return true;
        }
        
        // If deleting the head node
        if (this.head.data === value) {
            let current = this.head;
            while (current.next !== this.head) {
                current = current.next;
            }
            current.next = this.head.next;
            this.head = this.head.next;
            this.size--;
            return true;
        }
        
        // Delete non-head node
        let current = this.head;
        while (current.next !== this.head && current.next.data !== value) {
            current = current.next;
        }
        
        if (current.next.data === value) {
            current.next = current.next.next;
            this.size--;
            return true;
        }
        
        return false;
    }
    
    // Delete at position - O(n)
    deleteAtPosition(position) {
        if (position < 0 || position >= this.size) {
            throw new Error('Position out of bounds');
        }
        
        if (position === 0) {
            const deletedData = this.head.data;
            
            if (this.head.next === this.head) {
                this.head = null;
            } else {
                let current = this.head;
                while (current.next !== this.head) {
                    current = current.next;
                }
                current.next = this.head.next;
                this.head = this.head.next;
            }
            
            this.size--;
            return deletedData;
        }
        
        let current = this.head;
        for (let i = 0; i < position - 1; i++) {
            current = current.next;
        }
        
        const deletedData = current.next.data;
        current.next = current.next.next;
        this.size--;
        return deletedData;
    }
    
    // Search for value - O(n)
    search(value) {
        if (!this.head) return -1;
        
        let current = this.head;
        let position = 0;
        
        do {
            if (current.data === value) {
                return position;
            }
            current = current.next;
            position++;
        } while (current !== this.head);
        
        return -1;
    }
    
    // Get value at position - O(n)
    get(position) {
        if (position < 0 || position >= this.size) {
            throw new Error('Position out of bounds');
        }
        
        let current = this.head;
        for (let i = 0; i < position; i++) {
            current = current.next;
        }
        
        return current.data;
    }
    
    // Convert to array - O(n)
    toArray() {
        if (!this.head) return [];
        
        const result = [];
        let current = this.head;
        
        do {
            result.push(current.data);
            current = current.next;
        } while (current !== this.head);
        
        return result;
    }
    
    // Traverse with callback - O(n)
    traverse(callback) {
        if (!this.head) return;
        
        let current = this.head;
        let index = 0;
        
        do {
            callback(current.data, index);
            current = current.next;
            index++;
        } while (current !== this.head);
    }
    
    // Get size - O(1)
    getSize() {
        return this.size;
    }
    
    // Check if empty - O(1)
    isEmpty() {
        return this.size === 0;
    }
    
    // Clear the list - O(1)
    clear() {
        this.head = null;
        this.size = 0;
        return this;
    }
    
    // Display list - O(n)
    display() {
        if (!this.head) {
            console.log('List is empty');
            return;
        }
        
        const values = this.toArray();
        console.log(values.join(' -> ') + ' -> (back to ' + values[0] + ')');
    }
    
    // Split circular list into two halves - O(n)
    split() {
        if (!this.head || this.head.next === this.head) {
            return [this, new CircularLinkedList()];
        }
        
        let slow = this.head;
        let fast = this.head;
        
        // Find the middle using Floyd's algorithm
        while (fast.next !== this.head && fast.next.next !== this.head) {
            slow = slow.next;
            fast = fast.next.next;
        }
        
        // Create second list
        const secondList = new CircularLinkedList();
        secondList.head = slow.next;
        
        // Find the end of second list
        let current = secondList.head;
        let secondSize = 1;
        while (current.next !== this.head) {
            current = current.next;
            secondSize++;
        }
        
        // Make second list circular
        current.next = secondList.head;
        secondList.size = secondSize;
        
        // Update first list
        slow.next = this.head;
        this.size -= secondSize;
        
        return [this, secondList];
    }
    
    // Create from array - O(n)
    static fromArray(array) {
        const list = new CircularLinkedList();
        for (const item of array) {
            list.insertAtTail(item);
        }
        return list;
    }
}

// Usage Examples
const cList = new CircularLinkedList();

// Insert operations
cList.insertAtHead(1).insertAtTail(2).insertAtTail(3);
console.log('List:', cList.toArray()); // [1, 2, 3]

// Circular traversal
cList.display(); // 1 -> 2 -> 3 -> (back to 1)

// Search and access
console.log('Position of 2:', cList.search(2)); // 1
console.log('Value at position 1:', cList.get(1)); // 2

// Demonstrate circular property
console.log('Circular traversal:');
let count = 0;
cList.traverse((data, index) => {
    if (count < 6) { // Limit to avoid infinite output
        console.log(\`Position \${index}: \${data}\`);
        count++;
    }
});

// Split operation
const [list1, list2] = cList.split();
console.log('First half:', list1.toArray());
console.log('Second half:', list2.toArray());`,
    quizQuestions: [
      {
        question: "What is the key difference between a circular linked list and a regular linked list?",
        options: ["Circular lists use more memory", "Last node points to first node instead of null", "Circular lists are faster", "Circular lists store more data"],
        correctAnswer: 1,
        explanation: "In a circular linked list, the last node's next pointer points back to the first node, creating a circular structure instead of terminating with null."
      },
      {
        question: "What is the main challenge when traversing a circular linked list?",
        options: ["Memory allocation", "Avoiding infinite loops", "Pointer arithmetic", "Data corruption"],
        correctAnswer: 1,
        explanation: "The main challenge is avoiding infinite loops since there's no natural termination point (null). You must track the starting point to know when to stop."
      },
      {
        question: "Which termination condition is correct for traversing a circular linked list?",
        options: ["current != null", "current.next != null", "current != head", "current.next != head"],
        correctAnswer: 2,
        explanation: "You should continue until current != head (starting point) to traverse all nodes exactly once in a circular list."
      },
      {
        question: "What is a primary real-world application of circular linked lists?",
        options: ["File systems", "Round-robin scheduling", "Database indexing", "Memory management"],
        correctAnswer: 1,
        explanation: "Round-robin scheduling is a perfect application for circular linked lists, where processes are given CPU time in a circular order."
      },
      {
        question: "When inserting at the head of a circular linked list, what additional step is required?",
        options: ["Update the size", "Find and update the last node's pointer", "Check for duplicates", "Validate the data"],
        correctAnswer: 1,
        explanation: "You must find the last node and update its next pointer to point to the new head, maintaining the circular property."
      }
    ]
  },

  // Stacks & Queues
  {
    id: 'stack-operations',
    title: 'Stack Operations',
    description: 'LIFO data structure: push, pop, peek, and practical applications',
    category: 'Stacks & Queues',
    difficulty: 'beginner',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(n)',
    extendedDefinition: `A Stack is a linear data structure that follows the Last-In-First-Out (LIFO) principle, where elements are added and removed from the same end called the "top" of the stack. Think of it like a stack of plates - you can only add or remove plates from the top.

What it does: stores elements in LIFO order where last added element is first to be removed.

How it works: maintains a top pointer, push adds elements at top, pop removes from top in O(1) time.

When to use: function calls, undo operations, expression evaluation, backtracking algorithms.`,
    voiceExplanation: `Think of a stack like a stack of dinner plates in a cafeteria. You can only add new plates to the top of the stack, and when someone needs a plate, they take it from the top. You can't pull out a plate from the middle without first removing all the plates above it! This is exactly how a stack data structure works in programming. The "Last In, First Out" rule means the most recently added item is always the first one to be removed. It's like having a very organized pile where you always work from the top. Stacks are perfect for keeping track of things in reverse order - like the "undo" function in your text editor, where the last action you did is the first one that gets undone!`,
    realWorldApplications: `**Industry Applications:**
- **Function Call Management**: Call stack in programming languages for method invocation
- **Expression Evaluation**: Converting infix to postfix notation, evaluating mathematical expressions
- **Undo Operations**: Text editors, image editors, browsers (back button functionality)
- **Backtracking Algorithms**: Maze solving, N-Queens problem, Sudoku solvers
- **Syntax Parsing**: Balanced parentheses checking, compiler design and parsing
- **Memory Management**: Stack frame allocation in programs, local variable storage
- **Web Browsers**: Page history navigation, JavaScript execution context
- **Operating Systems**: Process management, interrupt handling, system call management
- **Compilers**: Symbol table management, recursive descent parsing
- **Game Development**: Game state management, AI decision trees, pathfinding algorithms`,
    keyConcepts: `**Essential Concepts:**
1. **LIFO Principle**: Last In, First Out - the fundamental ordering constraint
2. **Top Pointer**: Reference to the topmost element for efficient access
3. **Stack Overflow**: Error when pushing to a full fixed-size stack
4. **Stack Underflow**: Error when popping from an empty stack
5. **Atomic Operations**: Push and pop are indivisible operations
6. **Call Stack**: How programming languages manage function calls and returns
7. **Stack Frame**: Memory allocation unit containing local variables and parameters
8. **Recursion Relationship**: Natural fit for recursive algorithms and backtracking`,
    pseudocode: `**Stack Operations Pseudocode:**

ALGORITHM Push(stack, element)
INPUT: stack - the stack data structure, element - item to add
OUTPUT: modified stack
BEGIN
    IF stack.isFull() THEN
        THROW StackOverflowException
    END IF
    
    stack.top = stack.top + 1
    stack.data[stack.top] = element
    stack.size = stack.size + 1
END

ALGORITHM Pop(stack)
INPUT: stack - the stack data structure
OUTPUT: removed element
BEGIN
    IF stack.isEmpty() THEN
        THROW StackUnderflowException
    END IF
    
    element = stack.data[stack.top]
    stack.top = stack.top - 1
    stack.size = stack.size - 1
    RETURN element
END

ALGORITHM Peek(stack)
INPUT: stack - the stack data structure
OUTPUT: top element without removal
BEGIN
    IF stack.isEmpty() THEN
        RETURN null
    END IF
    
    RETURN stack.data[stack.top]
END

ALGORITHM IsEmpty(stack)
INPUT: stack - the stack data structure
OUTPUT: boolean indicating if stack is empty
BEGIN
    RETURN stack.size = 0
END

ALGORITHM BalancedParentheses(expression)
INPUT: expression - string with parentheses to check
OUTPUT: boolean indicating if parentheses are balanced
BEGIN
    stack = CreateStack()
    
    FOR each character c in expression DO
        IF c is opening bracket ('(', '[', '{') THEN
            Push(stack, c)
        ELSE IF c is closing bracket (')', ']', '}') THEN
            IF IsEmpty(stack) THEN
                RETURN false
            END IF
            
            opening = Pop(stack)
            IF NOT isMatchingPair(opening, c) THEN
                RETURN false
            END IF
        END IF
    END FOR
    
    RETURN IsEmpty(stack)
END`,
    implementationCode: `// Comprehensive Stack Implementation

class Stack {
    constructor(capacity = 100) {
        this.data = new Array(capacity);
        this.top = -1;
        this.capacity = capacity;
        this.operationCount = 0;
    }
    
    // Push element to top - O(1)
    push(element) {
        if (this.isFull()) {
            throw new Error('Stack Overflow: Cannot push to full stack');
        }
        
        this.top++;
        this.data[this.top] = element;
        this.operationCount++;
        return this.size();
    }
    
    // Pop element from top - O(1)
    pop() {
        if (this.isEmpty()) {
            throw new Error('Stack Underflow: Cannot pop from empty stack');
        }
        
        const element = this.data[this.top];
        this.data[this.top] = undefined; // Clear reference
        this.top--;
        this.operationCount++;
        return element;
    }
    
    // Peek at top element - O(1)
    peek() {
        if (this.isEmpty()) {
            return null;
        }
        return this.data[this.top];
    }
    
    // Check if stack is empty - O(1)
    isEmpty() {
        return this.top === -1;
    }
    
    // Check if stack is full - O(1)
    isFull() {
        return this.top === this.capacity - 1;
    }
    
    // Get current size - O(1)
    size() {
        return this.top + 1;
    }
    
    // Clear all elements - O(1)
    clear() {
        this.top = -1;
        this.data.fill(undefined);
        this.operationCount++;
    }
    
    // Convert to array (for display) - O(n)
    toArray() {
        return this.data.slice(0, this.top + 1);
    }
    
    // Display stack contents - O(n)
    display() {
        if (this.isEmpty()) {
            console.log('Stack is empty');
            return;
        }
        
        console.log('Stack contents (top to bottom):');
        for (let i = this.top; i >= 0; i--) {
            console.log(\`[\${i}] \${this.data[i]} \${i === this.top ? '<-- TOP' : ''}\`);
        }
    }
    
    // Get statistics
    getStatistics() {
        return {
            size: this.size(),
            capacity: this.capacity,
            utilization: ((this.size() / this.capacity) * 100).toFixed(2) + '%',
            operations: this.operationCount,
            isEmpty: this.isEmpty(),
            isFull: this.isFull()
        };
    }
}

// Dynamic Stack with auto-resizing
class DynamicStack extends Stack {
    constructor(initialCapacity = 10) {
        super(initialCapacity);
        this.growthFactor = 2;
    }
    
    // Auto-resize when full
    push(element) {
        if (this.isFull()) {
            this._resize();
        }
        return super.push(element);
    }
    
    _resize() {
        const newCapacity = this.capacity * this.growthFactor;
        const newData = new Array(newCapacity);
        
        // Copy existing elements
        for (let i = 0; i <= this.top; i++) {
            newData[i] = this.data[i];
        }
        
        this.data = newData;
        this.capacity = newCapacity;
        console.log(\`Stack resized to capacity: \${newCapacity}\`);
    }
}

// Stack Applications

// 1. Balanced Parentheses Checker
function isBalanced(expression) {
    const stack = new Stack();
    const pairs = { '(': ')', '[': ']', '{': '}' };
    
    for (let char of expression) {
        if (char in pairs) {
            stack.push(char);
        } else if (Object.values(pairs).includes(char)) {
            if (stack.isEmpty()) return false;
            
            const opening = stack.pop();
            if (pairs[opening] !== char) return false;
        }
    }
    
    return stack.isEmpty();
}

// 2. Infix to Postfix Conversion
function infixToPostfix(infix) {
    const stack = new Stack();
    const precedence = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 };
    const associativity = { '+': 'L', '-': 'L', '*': 'L', '/': 'L', '^': 'R' };
    let postfix = '';
    
    for (let char of infix) {
        if (/[a-zA-Z0-9]/.test(char)) {
            postfix += char;
        } else if (char === '(') {
            stack.push(char);
        } else if (char === ')') {
            while (!stack.isEmpty() && stack.peek() !== '(') {
                postfix += stack.pop();
            }
            stack.pop(); // Remove '('
        } else if (char in precedence) {
            while (!stack.isEmpty() && 
                   stack.peek() !== '(' &&
                   (precedence[stack.peek()] > precedence[char] ||
                    (precedence[stack.peek()] === precedence[char] && associativity[char] === 'L'))) {
                postfix += stack.pop();
            }
            stack.push(char);
        }
    }
    
    while (!stack.isEmpty()) {
        postfix += stack.pop();
    }
    
    return postfix;
}

// 3. Postfix Expression Evaluation
function evaluatePostfix(postfix) {
    const stack = new Stack();
    
    for (let char of postfix.split(' ')) {
        if (!isNaN(char)) {
            stack.push(parseFloat(char));
        } else {
            const b = stack.pop();
            const a = stack.pop();
            
            switch (char) {
                case '+': stack.push(a + b); break;
                case '-': stack.push(a - b); break;
                case '*': stack.push(a * b); break;
                case '/': stack.push(a / b); break;
                case '^': stack.push(Math.pow(a, b)); break;
            }
        }
    }
    
    return stack.pop();
}

// 4. Next Greater Element
function nextGreaterElement(arr) {
    const stack = new Stack();
    const result = new Array(arr.length).fill(-1);
    
    for (let i = 0; i < arr.length; i++) {
        while (!stack.isEmpty() && arr[stack.peek()] < arr[i]) {
            const index = stack.pop();
            result[index] = arr[i];
        }
        stack.push(i);
    }
    
    return result;
}

// 5. Stock Span Problem
function calculateSpan(prices) {
    const stack = new Stack();
    const spans = [];
    
    for (let i = 0; i < prices.length; i++) {
        while (!stack.isEmpty() && prices[stack.peek()] <= prices[i]) {
            stack.pop();
        }
        
        spans[i] = stack.isEmpty() ? i + 1 : i - stack.peek();
        stack.push(i);
    }
    
    return spans;
}

// Usage Examples
console.log('=== Stack Examples ===');

// Basic operations
const stack = new Stack(5);
console.log('Pushing elements: 10, 20, 30');
stack.push(10);
stack.push(20);
stack.push(30);
stack.display();

console.log('\\nPeek:', stack.peek()); // 30
console.log('Pop:', stack.pop());     // 30
console.log('Size:', stack.size());   // 2

// Dynamic stack
const dynStack = new DynamicStack(3);
for (let i = 1; i <= 5; i++) {
    dynStack.push(i * 10);
}
console.log('\\nDynamic stack stats:', dynStack.getStatistics());

// Applications
console.log('\\n=== Applications ===');
console.log('Balanced "({[]})":', isBalanced('({[]})')); // true
console.log('Balanced "([)]":', isBalanced('([)]'));     // false

console.log('Infix "a+b*c" to postfix:', infixToPostfix('a+b*c')); // abc*+
console.log('Evaluate "3 4 + 2 *":', evaluatePostfix('3 4 + 2 *')); // 14

console.log('Next greater [4,5,2,25]:', nextGreaterElement([4, 5, 2, 25])); // [5,25,25,-1]
console.log('Stock span [100,80,60,70,60,75,85]:', calculateSpan([100, 80, 60, 70, 60, 75, 85])); // [1,1,1,2,1,4,6]`,
    syntax: `**Stack Operation Patterns:**

1. **Basic Stack Operations:**
   \`\`\`javascript
   class Stack {
       constructor() { this.items = []; }
       push(element) { this.items.push(element); }
       pop() { return this.items.pop(); }
       peek() { return this.items[this.items.length - 1]; }
       isEmpty() { return this.items.length === 0; }
   }
   \`\`\`

2. **Stack Applications:**
   \`\`\`javascript
   // Expression evaluation
   function evaluatePostfix(expression) {
       const stack = [];
       for (let token of expression) {
           if (isOperator(token)) {
               const b = stack.pop(), a = stack.pop();
               stack.push(operate(a, b, token));
           } else {
               stack.push(Number(token));
           }
       }
       return stack.pop();
   }
   \`\`\``,
    voiceExplanation: `Think of a stack like a stack of plates in a cafeteria - you can only add or remove plates from the top. This is exactly how a stack data structure works! When you push an element, it goes on top of the stack, just like placing a new plate on the pile. When you pop an element, you take the top plate off, which is always the most recently added one. This "last in, first out" behavior makes stacks perfect for situations where you need to reverse the order of things or keep track of what happened most recently. Imagine the "undo" function in your text editor - every action you take gets pushed onto a stack, and when you hit undo, it pops off the most recent action. Or think about function calls in programming - when one function calls another, the first function gets "paused" and pushed onto a call stack, and when the second function finishes, the first one gets popped back off and continues where it left off.`,
    keyConcepts: `**Essential Concepts:**
1. **LIFO Principle**: Last In, First Out ordering constraint
2. **Top Pointer**: Reference to the most recently added element
3. **Stack Overflow**: Error when pushing to a full stack
4. **Stack Underflow**: Error when popping from an empty stack
5. **Recursive Nature**: Natural fit for recursive algorithms
6. **Memory Management**: Stack frames in program execution
7. **Expression Evaluation**: Converting and evaluating mathematical expressions`,
    pseudocode: `**Stack Operations Pseudocode:**

ALGORITHM Push(stack, element)
INPUT: stack - the stack data structure, element - value to add
OUTPUT: updated stack with new top element
BEGIN
    IF stack.isFull() THEN
        THROW StackOverflowException
    END IF
    
    stack.top = stack.top + 1
    stack.items[stack.top] = element
    stack.size = stack.size + 1
END

ALGORITHM Pop(stack)
INPUT: stack - the stack data structure
OUTPUT: removed top element
BEGIN
    IF stack.isEmpty() THEN
        THROW StackUnderflowException
    END IF
    
    element = stack.items[stack.top]
    stack.top = stack.top - 1
    stack.size = stack.size - 1
    RETURN element
END

ALGORITHM Peek(stack)
INPUT: stack - the stack data structure
OUTPUT: top element without removing it
BEGIN
    IF stack.isEmpty() THEN
        RETURN NULL
    END IF
    
    RETURN stack.items[stack.top]
END

ALGORITHM IsEmpty(stack)
INPUT: stack - the stack data structure
OUTPUT: boolean indicating if stack is empty
BEGIN
    RETURN stack.size = 0
END

ALGORITHM BalancedParentheses(expression)
INPUT: expression - string with parentheses
OUTPUT: boolean indicating if parentheses are balanced
BEGIN
    stack = CreateStack()
    
    FOR each character c in expression DO
        IF c is opening bracket THEN
            Push(stack, c)
        ELSE IF c is closing bracket THEN
            IF IsEmpty(stack) THEN
                RETURN false
            END IF
            
            opening = Pop(stack)
            IF opening and c are not matching pair THEN
                RETURN false
            END IF
        END IF
    END FOR
    
    RETURN IsEmpty(stack)
END`,
    implementationCode: `// Comprehensive Stack Implementation

class Stack {
    constructor(capacity = 100) {
        this.items = [];
        this.capacity = capacity;
    }
    
    // Push element to top - O(1)
    push(element) {
        if (this.isFull()) {
            throw new Error('Stack Overflow: Cannot push to full stack');
        }
        this.items.push(element);
        return this;
    }
    
    // Pop element from top - O(1)
    pop() {
        if (this.isEmpty()) {
            throw new Error('Stack Underflow: Cannot pop from empty stack');
        }
        return this.items.pop();
    }
    
    // Peek at top element - O(1)
    peek() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items[this.items.length - 1];
    }
    
    // Check if stack is empty - O(1)
    isEmpty() {
        return this.items.length === 0;
    }
    
    // Check if stack is full - O(1)
    isFull() {
        return this.items.length >= this.capacity;
    }
    
    // Get stack size - O(1)
    size() {
        return this.items.length;
    }
    
    // Clear the stack - O(1)
    clear() {
        this.items = [];
        return this;
    }
    
    // Convert to array - O(n)
    toArray() {
        return [...this.items];
    }
    
    // Display stack - O(n)
    display() {
        if (this.isEmpty()) {
            console.log('Stack is empty');
            return;
        }
        
        console.log('Stack (top to bottom):');
        for (let i = this.items.length - 1; i >= 0; i--) {
            console.log(\`[\${i}] \${this.items[i]}\`);
        }
    }
    
    // Search for element - O(n)
    search(element) {
        for (let i = this.items.length - 1; i >= 0; i--) {
            if (this.items[i] === element) {
                return this.items.length - 1 - i; // Distance from top
            }
        }
        return -1;
    }
}

// Advanced Stack Applications

// 1. Balanced Parentheses Checker
function isBalanced(expression) {
    const stack = new Stack();
    const pairs = {
        '(': ')',
        '[': ']',
        '{': '}',
        '<': '>'
    };
    
    for (let char of expression) {
        if (char in pairs) {
            stack.push(char);
        } else if (Object.values(pairs).includes(char)) {
            if (stack.isEmpty()) {
                return false;
            }
            
            const opening = stack.pop();
            if (pairs[opening] !== char) {
                return false;
            }
        }
    }
    
    return stack.isEmpty();
}

// 2. Infix to Postfix Converter
function infixToPostfix(infix) {
    const stack = new Stack();
    const result = [];
    const precedence = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 };
    const rightAssociative = { '^': true };
    
    for (let char of infix) {
        if (/[a-zA-Z0-9]/.test(char)) {
            result.push(char);
        } else if (char === '(') {
            stack.push(char);
        } else if (char === ')') {
            while (!stack.isEmpty() && stack.peek() !== '(') {
                result.push(stack.pop());
            }
            stack.pop(); // Remove '('
        } else if (char in precedence) {
            while (!stack.isEmpty() && 
                   stack.peek() !== '(' &&
                   (precedence[stack.peek()] > precedence[char] ||
                    (precedence[stack.peek()] === precedence[char] && !rightAssociative[char]))) {
                result.push(stack.pop());
            }
            stack.push(char);
        }
    }
    
    while (!stack.isEmpty()) {
        result.push(stack.pop());
    }
    
    return result.join('');
}

// 3. Postfix Expression Evaluator
function evaluatePostfix(expression) {
    const stack = new Stack();
    const operators = {
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        '*': (a, b) => a * b,
        '/': (a, b) => a / b,
        '^': (a, b) => Math.pow(a, b)
    };
    
    for (let token of expression.split(' ')) {
        if (token in operators) {
            if (stack.size() < 2) {
                throw new Error('Invalid expression: insufficient operands');
            }
            
            const b = stack.pop();
            const a = stack.pop();
            const result = operators[token](a, b);
            stack.push(result);
        } else {
            const num = parseFloat(token);
            if (isNaN(num)) {
                throw new Error(\`Invalid token: \${token}\`);
            }
            stack.push(num);
        }
    }
    
    if (stack.size() !== 1) {
        throw new Error('Invalid expression: too many operands');
    }
    
    return stack.pop();
}

// 4. Next Greater Element
function nextGreaterElement(arr) {
    const stack = new Stack();
    const result = new Array(arr.length).fill(-1);
    
    for (let i = 0; i < arr.length; i++) {
        while (!stack.isEmpty() && arr[stack.peek()] < arr[i]) {
            const index = stack.pop();
            result[index] = arr[i];
        }
        stack.push(i);
    }
    
    return result;
}

// 5. Stock Span Problem
function calculateSpan(prices) {
    const stack = new Stack();
    const span = [];
    
    for (let i = 0; i < prices.length; i++) {
        while (!stack.isEmpty() && prices[stack.peek()] <= prices[i]) {
            stack.pop();
        }
        
        span[i] = stack.isEmpty() ? i + 1 : i - stack.peek();
        stack.push(i);
    }
    
    return span;
}

// Usage Examples
const stack = new Stack();

// Basic operations
stack.push(10).push(20).push(30);
console.log('Stack size:', stack.size()); // 3
console.log('Top element:', stack.peek()); // 30
console.log('Popped:', stack.pop()); // 30
stack.display(); // Shows remaining elements

// Practical applications
console.log('Balanced:', isBalanced('({[]})')); // true
console.log('Postfix:', infixToPostfix('a+b*c')); // abc*+
console.log('Evaluated:', evaluatePostfix('3 4 + 2 *')); // 14
console.log('Next Greater:', nextGreaterElement([4, 5, 2, 25])); // [5, 25, 25, -1]
console.log('Stock Span:', calculateSpan([100, 80, 60, 70, 60, 75, 85])); // [1, 1, 1, 2, 1, 4, 6]`,
    quizQuestions: [
      {
        question: "What does LIFO stand for in the context of stacks?",
        options: ["Last In, First Out", "Last In, Final Out", "Latest In, First Out", "Limited In, First Out"],
        correctAnswer: 0,
        explanation: "LIFO stands for Last In, First Out, meaning the most recently added element is the first one to be removed."
      },
      {
        question: "What is the time complexity of push and pop operations in a stack?",
        options: ["O(n)", "O(log n)", "O(1)", "O(nÃ‚Â²)"],
        correctAnswer: 2,
        explanation: "Both push and pop operations in a stack are O(1) constant time operations since they only affect the top element."
      },
      {
        question: "Which of the following is NOT a typical application of stacks?",
        options: ["Function call management", "Undo operations", "Breadth-first search", "Expression evaluation"],
        correctAnswer: 2,
        explanation: "Breadth-first search typically uses a queue (FIFO), not a stack. Stacks are used for depth-first search."
      },
      {
        question: "What happens when you try to pop from an empty stack?",
        options: ["Returns null", "Returns 0", "Stack underflow error", "Creates a new element"],
        correctAnswer: 2,
        explanation: "Attempting to pop from an empty stack results in a stack underflow error or exception."
      },
      {
        question: "In the balanced parentheses problem, what do you push onto the stack?",
        options: ["Closing brackets", "Opening brackets", "All brackets", "Nothing"],
        correctAnswer: 1,
        explanation: "You push opening brackets onto the stack and pop them when you encounter matching closing brackets."
      }
    ]
  },
  {
    id: 'queue-operations',
    title: 'Queue Operations',
    description: 'FIFO data structure: enqueue, dequeue, and circular queue',
    category: 'Stacks & Queues',
    difficulty: 'beginner',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(n)',
    extendedDefinition: `A Queue is a linear data structure that follows the First-In-First-Out (FIFO) principle, where elements are added at one end (rear/back) and removed from the other end (front). Think of it like a line of people waiting for service - the first person to join the line is the first person to be served.

What it does: stores elements in FIFO order where the first added element is the first to be removed.

How it works: maintains front and rear pointers, enqueue adds at rear, dequeue removes from front in O(1) time.

When to use: task scheduling, breadth-first search, handling requests, buffering data streams.`,
    example: `// Basic Queue Operations
const queue = [];

// Enqueue - add elements to rear
queue.push(10);
queue.push(20);
queue.push(30);
console.log(queue); // [10, 20, 30]

// Dequeue - remove from front
const first = queue.shift(); // 10
console.log(first); // 10
console.log(queue); // [20, 30]

// Peek front element
const front = queue[0]; // 20

// Check if empty
const isEmpty = queue.length === 0; // false`,
    syntax: `const queue = [];
queue.push(item); // enqueue
queue.shift(); // dequeue
queue[0]; // peek front
queue.length; // size`,
    keyConcepts: `**Essential Concepts:**
1. **FIFO Principle**: First In, First Out - the fundamental ordering constraint
2. **Front and Rear Pointers**: References to the beginning and end of the queue
3. **Circular Implementation**: Reusing array space to prevent false overflow
4. **Queue Overflow**: Error when enqueuing to a full fixed-size queue
5. **Queue Underflow**: Error when dequeuing from an empty queue
6. **Priority Queues**: Elements have associated priorities for processing order
7. **Blocking vs Non-blocking**: Thread-safe operations in concurrent environments
8. **Breadth-First Applications**: Natural fit for level-order processing algorithms`,
    pseudocode: `**Queue Operations Pseudocode:**

ALGORITHM Enqueue(queue, element)
INPUT: queue - the queue data structure, element - item to add
OUTPUT: modified queue
BEGIN
    IF queue.isFull() THEN
        THROW QueueOverflowException
    END IF
    
    IF queue.isEmpty() THEN
        queue.front = 0
        queue.rear = 0
    ELSE
        queue.rear = (queue.rear + 1) % queue.capacity
    END IF
    
    queue.data[queue.rear] = element
    queue.size = queue.size + 1
END

ALGORITHM Dequeue(queue)
INPUT: queue - the queue data structure
OUTPUT: removed element
BEGIN
    IF queue.isEmpty() THEN
        THROW QueueUnderflowException
    END IF
    
    element = queue.data[queue.front]
    
    IF queue.size = 1 THEN
        queue.front = -1
        queue.rear = -1
    ELSE
        queue.front = (queue.front + 1) % queue.capacity
    END IF
    
    queue.size = queue.size - 1
    RETURN element
END

ALGORITHM Front(queue)
INPUT: queue - the queue data structure
OUTPUT: front element without removing it
BEGIN
    IF queue.isEmpty() THEN
        RETURN NULL
    END IF
    
    RETURN queue.data[queue.front]
END

ALGORITHM BreadthFirstSearch(graph, startNode)
INPUT: graph - adjacency list representation, startNode - starting vertex
OUTPUT: BFS traversal order
BEGIN
    queue = CreateQueue()
    visited = CreateSet()
    result = CreateList()
    
    Enqueue(queue, startNode)
    Add(visited, startNode)
    
    WHILE NOT IsEmpty(queue) DO
        current = Dequeue(queue)
        Add(result, current)
        
        FOR each neighbor IN graph[current] DO
            IF neighbor NOT IN visited THEN
                Add(visited, neighbor)
                Enqueue(queue, neighbor)
            END IF
        END FOR
    END WHILE
    
    RETURN result
END`,
    implementationCode: `// Comprehensive Queue Implementation

class Queue {
    constructor(capacity = 100) {
        this.data = new Array(capacity);
        this.front = -1;
        this.rear = -1;
        this.capacity = capacity;
        this.currentSize = 0;
        this.operationCount = 0;
    }
    
    // Add element to rear - O(1)
    enqueue(element) {
        if (this.isFull()) {
            throw new Error('Queue Overflow: Cannot enqueue to full queue');
        }
        
        if (this.isEmpty()) {
            this.front = 0;
            this.rear = 0;
        } else {
            this.rear = (this.rear + 1) % this.capacity;
        }
        
        this.data[this.rear] = element;
        this.currentSize++;
        this.operationCount++;
        return this.currentSize;
    }
    
    // Remove element from front - O(1)
    dequeue() {
        if (this.isEmpty()) {
            throw new Error('Queue Underflow: Cannot dequeue from empty queue');
        }
        
        const element = this.data[this.front];
        this.data[this.front] = undefined; // Clear reference
        
        if (this.currentSize === 1) {
            this.front = -1;
            this.rear = -1;
        } else {
            this.front = (this.front + 1) % this.capacity;
        }
        
        this.currentSize--;
        this.operationCount++;
        return element;
    }
    
    // Peek at front element - O(1)
    peek() {
        if (this.isEmpty()) {
            return null;
        }
        return this.data[this.front];
    }
    
    // Check if queue is empty - O(1)
    isEmpty() {
        return this.currentSize === 0;
    }
    
    // Check if queue is full - O(1)
    isFull() {
        return this.currentSize === this.capacity;
    }
    
    // Get current size - O(1)
    size() {
        return this.currentSize;
    }
    
    // Clear all elements - O(1)
    clear() {
        this.front = -1;
        this.rear = -1;
        this.currentSize = 0;
        this.data.fill(undefined);
        this.operationCount++;
    }
    
    // Convert to array (for display) - O(n)
    toArray() {
        if (this.isEmpty()) return [];
        
        const result = [];
        let current = this.front;
        
        for (let i = 0; i < this.currentSize; i++) {
            result.push(this.data[current]);
            current = (current + 1) % this.capacity;
        }
        
        return result;
    }
    
    // Display queue contents - O(n)
    display() {
        if (this.isEmpty()) {
            console.log('Queue is empty');
            return;
        }
        
        console.log('Queue contents (front to rear):');
        const elements = this.toArray();
        elements.forEach((element, index) => {
            console.log(\`[\${index}] \${element} \${index === 0 ? '<-- FRONT' : ''} \${index === elements.length - 1 ? '<-- REAR' : ''}\`);
        });
    }
    
    // Get statistics
    getStatistics() {
        return {
            size: this.size(),
            capacity: this.capacity,
            utilization: ((this.size() / this.capacity) * 100).toFixed(2) + '%',
            operations: this.operationCount,
            isEmpty: this.isEmpty(),
            isFull: this.isFull(),
            frontIndex: this.front,
            rearIndex: this.rear
        };
    }
}

// Dynamic Queue with auto-resizing
class DynamicQueue extends Queue {
    constructor(initialCapacity = 10) {
        super(initialCapacity);
        this.growthFactor = 2;
    }
    
    // Auto-resize when full
    enqueue(element) {
        if (this.isFull()) {
            this._resize();
        }
        return super.enqueue(element);
    }
    
    _resize() {
        const newCapacity = this.capacity * this.growthFactor;
        const newData = new Array(newCapacity);
        
        // Copy existing elements in order
        const elements = this.toArray();
        for (let i = 0; i < elements.length; i++) {
            newData[i] = elements[i];
        }
        
        this.data = newData;
        this.front = elements.length > 0 ? 0 : -1;
        this.rear = elements.length > 0 ? elements.length - 1 : -1;
        this.capacity = newCapacity;
        console.log(\`Queue resized to capacity: \${newCapacity}\`);
    }
}

// Priority Queue Implementation
class PriorityQueue {
    constructor() {
        this.items = [];
        this.operationCount = 0;
    }
    
    // Add element with priority - O(n)
    enqueue(element, priority = 0) {
        const queueElement = { element, priority };
        let added = false;
        
        for (let i = 0; i < this.items.length; i++) {
            if (queueElement.priority > this.items[i].priority) {
                this.items.splice(i, 0, queueElement);
                added = true;
                break;
            }
        }
        
        if (!added) {
            this.items.push(queueElement);
        }
        
        this.operationCount++;
        return this.items.length;
    }
    
    // Remove highest priority element - O(1)
    dequeue() {
        if (this.isEmpty()) {
            throw new Error('Priority Queue is empty');
        }
        
        this.operationCount++;
        return this.items.shift().element;
    }
    
    // Peek at highest priority element - O(1)
    peek() {
        if (this.isEmpty()) return null;
        return this.items[0].element;
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
    
    size() {
        return this.items.length;
    }
    
    display() {
        console.log('Priority Queue (highest to lowest priority):');
        this.items.forEach((item, index) => {
            console.log(\`[\${index}] \${item.element} (priority: \${item.priority})\`);
        });
    }
}

// Queue Applications

// 1. Breadth-First Search
function breadthFirstSearch(graph, startNode) {
    const queue = new Queue();
    const visited = new Set();
    const result = [];
    
    queue.enqueue(startNode);
    visited.add(startNode);
    
    while (!queue.isEmpty()) {
        const current = queue.dequeue();
        result.push(current);
        
        if (graph[current]) {
            for (const neighbor of graph[current]) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.enqueue(neighbor);
                }
            }
        }
    }
    
    return result;
}

// 2. Level Order Tree Traversal
function levelOrderTraversal(root) {
    if (!root) return [];
    
    const queue = new Queue();
    const result = [];
    
    queue.enqueue(root);
    
    while (!queue.isEmpty()) {
        const levelSize = queue.size();
        const currentLevel = [];
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue.dequeue();
            currentLevel.push(node.value);
            
            if (node.left) queue.enqueue(node.left);
            if (node.right) queue.enqueue(node.right);
        }
        
        result.push(currentLevel);
    }
    
    return result;
}

// 3. Task Scheduler
class TaskScheduler {
    constructor() {
        this.taskQueue = new PriorityQueue();
        this.completedTasks = [];
    }
    
    addTask(task, priority) {
        this.taskQueue.enqueue(task, priority);
        console.log(\`Added task: \${task} with priority \${priority}\`);
    }
    
    processNextTask() {
        if (this.taskQueue.isEmpty()) {
            console.log('No tasks to process');
            return null;
        }
        
        const task = this.taskQueue.dequeue();
        this.completedTasks.push(task);
        console.log(\`Processing task: \${task}\`);
        return task;
    }
    
    processAllTasks() {
        while (!this.taskQueue.isEmpty()) {
            this.processNextTask();
        }
        return this.completedTasks;
    }
}

// Usage Examples
console.log('=== Queue Examples ===');

// Basic operations
const queue = new Queue(5);
console.log('Enqueuing elements: 10, 20, 30');
queue.enqueue(10);
queue.enqueue(20);
queue.enqueue(30);
queue.display();

console.log('\\nPeek:', queue.peek()); // 10
console.log('Dequeue:', queue.dequeue()); // 10
console.log('Size:', queue.size()); // 2

// Dynamic queue
const dynQueue = new DynamicQueue(3);
for (let i = 1; i <= 5; i++) {
    dynQueue.enqueue(i * 10);
}
console.log('\\nDynamic queue stats:', dynQueue.getStatistics());

// Priority queue
const pQueue = new PriorityQueue();
pQueue.enqueue('Low priority task', 1);
pQueue.enqueue('High priority task', 5);
pQueue.enqueue('Medium priority task', 3);
console.log('\\nPriority Queue:');
pQueue.display();

// Applications
console.log('\\n=== Applications ===');
const graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
};
console.log('BFS traversal:', breadthFirstSearch(graph, 'A'));

// Task scheduler
const scheduler = new TaskScheduler();
scheduler.addTask('Send email', 2);
scheduler.addTask('Critical bug fix', 5);
scheduler.addTask('Update documentation', 1);
console.log('\\nProcessing tasks by priority:');
scheduler.processAllTasks();`,
    syntax: `**Queue Operation Patterns:**

1. **Basic Queue Operations:**
   \`\`\`javascript
   class Queue {
       constructor() { this.items = []; }
       enqueue(element) { this.items.push(element); }
       dequeue() { return this.items.shift(); }
       front() { return this.items[0]; }
       isEmpty() { return this.items.length === 0; }
   }
   \`\`\`

2. **Circular Queue:**
   \`\`\`javascript
   class CircularQueue {
       constructor(size) {
           this.items = new Array(size);
           this.front = this.rear = -1;
           this.size = size;
       }
       isFull() {
           return (this.front === 0 && this.rear === this.size - 1) || ((this.rear + 1) % this.size === this.front);
       }
       isEmpty() { return this.front === -1; }
       enqueue(element) {
           if (this.isFull()) return false;
           this.rear = (this.rear + 1) % this.size;
           this.items[this.rear] = element;
           if (this.front === -1) this.front = 0;
           return true;
       }
       dequeue() {
           if (this.isEmpty()) return null;
           const item = this.items[this.front];
           if (this.front === this.rear) { this.front = this.rear = -1; }
           else { this.front = (this.front + 1) % this.size; }
           return item;
       }
       frontElement() { return this.isEmpty() ? null : this.items[this.front]; }
   }
   \`\`\``,
    voiceExplanation: `Think of a queue like a line of people waiting at a coffee shop - the first person in line is the first person to get served. This is exactly how a queue data structure works! When you enqueue (add) an element, it goes to the back of the line, just like a new customer joining the queue. When you dequeue (remove) an element, you take the person from the front of the line, who has been waiting the longest. This "first in, first out" behavior makes queues perfect for situations where fairness and order matter. Imagine a printer queue in an office - documents are printed in the order they were submitted, ensuring everyone gets their turn. Or think about breadth-first search in a graph - you explore all neighbors at the current level before moving to the next level, just like serving all customers at the front before helping those who arrived later. Queues are also great for handling tasks in web servers, where requests should be processed in the order they arrive.`,
    implementationCode: `// Comprehensive Queue Implementation

class Queue {
    constructor(capacity = 100) {
        this.items = [];
        this.capacity = capacity;
        this.frontIndex = 0;
        this.rearIndex = -1;
        this.count = 0;
    }
    
    // Enqueue element to rear - O(1)
    enqueue(element) {
        if (this.isFull()) {
            throw new Error('Queue Overflow: Cannot enqueue to full queue');
        }
        
        this.rearIndex = (this.rearIndex + 1) % this.capacity;
        this.items[this.rearIndex] = element;
        this.count++;
        return this;
    }
    
    // Dequeue element from front - O(1)
    dequeue() {
        if (this.isEmpty()) {
            throw new Error('Queue Underflow: Cannot dequeue from empty queue');
        }
        
        const element = this.items[this.frontIndex];
        this.items[this.frontIndex] = undefined; // Clear reference
        this.frontIndex = (this.frontIndex + 1) % this.capacity;
        this.count--;
        return element;
    }
    
    // Peek at front element - O(1)
    front() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items[this.frontIndex];
    }
    
    // Peek at rear element - O(1)
    rear() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items[this.rearIndex];
    }
    
    // Check if queue is empty - O(1)
    isEmpty() {
        return this.count === 0;
    }
    
    // Check if queue is full - O(1)
    isFull() {
        return this.count >= this.capacity;
    }
    
    // Get queue size - O(1)
    size() {
        return this.count;
    }
    
    // Clear the queue - O(1)
    clear() {
        this.items = [];
        this.frontIndex = 0;
        this.rearIndex = -1;
        this.count = 0;
        return this;
    }
    
    // Convert to array - O(n)
    toArray() {
        const result = [];
        let index = this.frontIndex;
        
        for (let i = 0; i < this.count; i++) {
            result.push(this.items[index]);
            index = (index + 1) % this.capacity;
        }
        
        return result;
    }
    
    // Display queue - O(n)
    display() {
        if (this.isEmpty()) {
            console.log('Queue is empty');
            return;
        }
        
        console.log('Queue (front to rear):');
        const elements = this.toArray();
        console.log(elements.join(' <- '));
    }
}

// Priority Queue Implementation
class PriorityQueue {
    constructor() {
        this.items = [];
    }
    
    enqueue(element, priority) {
        const queueElement = { element, priority };
        let added = false;
        
        for (let i = 0; i < this.items.length; i++) {
            if (queueElement.priority < this.items[i].priority) {
                this.items.splice(i, 0, queueElement);
                added = true;
                break;
            }
        }
        
        if (!added) {
            this.items.push(queueElement);
        }
    }
    
    dequeue() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items.shift().element;
    }
    
    front() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items[0].element;
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
    
    size() {
        return this.items.length;
    }
}

// Deque (Double-ended Queue) Implementation
class Deque {
    constructor() {
        this.items = [];
    }
    
    // Add to front
    addFront(element) {
        this.items.unshift(element);
    }
    
    // Add to rear
    addRear(element) {
        this.items.push(element);
    }
    
    // Remove from front
    removeFront() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items.shift();
    }
    
    // Remove from rear
    removeRear() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items.pop();
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
    
    size() {
        return this.items.length;
    }
}

// Advanced Queue Applications

// 1. Breadth-First Search
function breadthFirstSearch(graph, startNode) {
    const queue = new Queue();
    const visited = new Set();
    const result = [];
    
    queue.enqueue(startNode);
    visited.add(startNode);
    
    while (!queue.isEmpty()) {
        const current = queue.dequeue();
        result.push(current);
        
        for (const neighbor of graph[current] || []) {
            if (!visited.has(neighbor)) {
                queue.enqueue(neighbor);
                visited.add(neighbor);
            }
        }
    }
    
    return result;
}

// 2. Level Order Tree Traversal
function levelOrderTraversal(root) {
    if (!root) return [];
    
    const queue = new Queue();
    const result = [];
    
    queue.enqueue(root);
    
    while (!queue.isEmpty()) {
        const levelSize = queue.size();
        const currentLevel = [];
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue.dequeue();
            currentLevel.push(node.val);
            
            if (node.left) queue.enqueue(node.left);
            if (node.right) queue.enqueue(node.right);
        }
        
        result.push(currentLevel);
    }
    
    return result;
}

// 3. Sliding Window Maximum using Deque
function slidingWindowMaximum(nums, k) {
    const deque = new Deque();
    const result = [];
    
    for (let i = 0; i < nums.length; i++) {
        // Remove elements outside window
        while (!deque.isEmpty() && deque.items[0] <= i - k) {
            deque.removeFront();
        }
        
        // Remove smaller elements from rear
        while (!deque.isEmpty() && nums[deque.items[deque.items.length - 1]] <= nums[i]) {
            deque.removeRear();
        }
        
        deque.addRear(i);
        
        // Add to result if window is complete
        if (i >= k - 1) {
            result.push(nums[deque.items[0]]);
        }
    }
    
    return result;
}

// Usage Examples
const queue = new Queue();

// Basic operations
queue.enqueue(10).enqueue(20).enqueue(30);
console.log('Queue size:', queue.size()); // 3
console.log('Front element:', queue.front()); // 10
console.log('Dequeued:', queue.dequeue()); // 10
queue.display(); // Shows remaining elements

// Priority Queue
const pq = new PriorityQueue();
pq.enqueue('low priority', 3);
pq.enqueue('high priority', 1);
pq.enqueue('medium priority', 2);
console.log('Priority dequeue:', pq.dequeue()); // 'high priority'

// BFS Example
const graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
};
console.log('BFS:', breadthFirstSearch(graph, 'A')); // ['A', 'B', 'C', 'D', 'E', 'F']`,
    quizQuestions: [
      {
        question: "What does FIFO stand for in the context of queues?",
        options: ["First In, First Out", "Fast In, Fast Out", "Final In, First Out", "Fixed In, Flexible Out"],
        correctAnswer: 0,
        explanation: "FIFO stands for First In, First Out, meaning the first element added is the first one to be removed."
      },
      {
        question: "Which end of a queue do you add new elements to?",
        options: ["Front", "Rear", "Middle", "Any position"],
        correctAnswer: 1,
        explanation: "In a queue, new elements are added to the rear (back) and removed from the front, maintaining FIFO order."
      },
      {
        question: "What is the main advantage of a circular queue over a simple queue?",
        options: ["Faster operations", "Space efficiency", "Better sorting", "Easier implementation"],
        correctAnswer: 1,
        explanation: "Circular queues efficiently reuse memory space by wrapping the rear pointer back to the beginning when space becomes available."
      },
      {
        question: "Which algorithm commonly uses a queue data structure?",
        options: ["Depth-first search", "Breadth-first search", "Binary search", "Quick sort"],
        correctAnswer: 1,
        explanation: "Breadth-first search (BFS) uses a queue to explore nodes level by level, processing all neighbors before moving to the next level."
      },
      {
        question: "What happens when you try to dequeue from an empty queue?",
        options: ["Returns null", "Returns 0", "Queue underflow error", "Creates a new element"],
        correctAnswer: 2,
        explanation: "Attempting to dequeue from an empty queue results in a queue underflow error or exception."
      }
    ]
  },
  {
    id: 'binary-tree',
    title: 'Binary Tree Fundamentals',
    description: 'Tree structure with inorder, preorder, postorder traversals and properties',
    category: 'Trees',
    difficulty: 'intermediate',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)',
    voiceExplanation: 'Think of a binary tree like a family tree, but with a special rule: each person can have at most two children - a left child and a right child. The tree starts with a single root node at the top, like the oldest ancestor, and branches downward. What makes binary trees fascinating is how you can visit all the family members in different orders. You can visit them inorder by going left child, then parent, then right child - like reading names alphabetically. You can visit preorder by going parent first, then left child, then right child - like introducing the head of household first. Or you can visit postorder by going left child, right child, then parent - like children speaking before their parents. Each traversal method gives you the data in a different sequence, making binary trees incredibly versatile for organizing and retrieving information in various ways.',
    example: `// Binary Tree Node
class TreeNode {
    constructor(val) {
        this.val = val;
        this.left = null;
        this.right = null;
    }
}

// Tree Traversals
function inorderTraversal(root) {
    const result = [];
    function inorder(node) {
        if (node) {
            inorder(node.left);
            result.push(node.val);
            inorder(node.right);
        }
    }
    inorder(root);
    return result;
}

// Example usage
const root = new TreeNode(1);
root.left = new TreeNode(2);
root.right = new TreeNode(3);
root.left.left = new TreeNode(4);
root.left.right = new TreeNode(5);

console.log(inorderTraversal(root)); // [4, 2, 5, 1, 3]`,
    extendedDefinition: `A Binary Tree is a hierarchical data structure where each node has at most two children, referred to as the left child and right child. Unlike linear data structures (arrays, linked lists), trees represent hierarchical relationships and enable efficient searching, insertion, and deletion operations.

What it does: organizes data hierarchically with each node having at most two children for efficient tree operations.

How it works: uses recursive structure where each node contains data and pointers to left and right children, enabling traversal algorithms.

When to use: expression parsing, file systems, database indexing, decision trees, hierarchical data representation.`,
    realWorldApplications: `**Industry Applications:**
- **File Systems**: Directory hierarchies, folder structures, file organization
- **Database Systems**: B-trees for indexing, query optimization, data retrieval
- **Compiler Design**: Parse trees, syntax analysis, expression evaluation
- **Computer Graphics**: Scene graphs, spatial partitioning, 3D rendering
- **Game Development**: Decision trees, AI behavior trees, game state management
- **Network Routing**: Routing protocols, network topology, path finding
- **Machine Learning**: Decision trees, random forests, classification algorithms
- **Operating Systems**: Process trees, memory management, resource allocation
- **Web Development**: DOM structure, XML parsing, HTML rendering
- **Data Compression**: Huffman coding trees, compression algorithms`,
    keyConcepts: `**Essential Concepts:**
1. **Node Structure**: Data field with left and right child pointers
2. **Tree Height vs Depth**: Understanding vertical measurements in trees
3. **Parent-Child Relationships**: Hierarchical connections between nodes
4. **Leaf vs Internal Nodes**: Different types of nodes and their properties
5. **Tree Traversal**: Different methods to visit all nodes systematically
6. **Recursive Nature**: Most tree operations are naturally recursive
7. **Tree Balance**: Impact on performance and operation complexity
8. **Complete vs Full Trees**: Different structural properties and their uses`,
    pseudocode: `**Binary Tree Operations Pseudocode:**

ALGORITHM CreateNode(data)
INPUT: data - value to store in node
OUTPUT: new tree node
BEGIN
    node = AllocateMemory()
    node.data = data
    node.left = NULL
    node.right = NULL
    RETURN node
END

ALGORITHM InorderTraversal(root)
INPUT: root - root node of tree
OUTPUT: inorder sequence of nodes
BEGIN
    IF root Ã¢â€°Â  NULL THEN
        InorderTraversal(root.left)
        PRINT root.data
        InorderTraversal(root.right)
    END IF
END

ALGORITHM PreorderTraversal(root)
INPUT: root - root node of tree
OUTPUT: preorder sequence of nodes
BEGIN
    IF root Ã¢â€°Â  NULL THEN
        PRINT root.data
        PreorderTraversal(root.left)
        PreorderTraversal(root.right)
    END IF
END

ALGORITHM PostorderTraversal(root)
INPUT: root - root node of tree
OUTPUT: postorder sequence of nodes
BEGIN
    IF root Ã¢â€°Â  NULL THEN
        PostorderTraversal(root.left)
        PostorderTraversal(root.right)
        PRINT root.data
    END IF
END

ALGORITHM LevelOrderTraversal(root)
INPUT: root - root node of tree
OUTPUT: level order sequence of nodes
BEGIN
    queue = CreateQueue()
    IF root Ã¢â€°Â  NULL THEN
        Enqueue(queue, root)
    END IF
    
    WHILE NOT IsEmpty(queue) DO
        current = Dequeue(queue)
        PRINT current.data
        
        IF current.left Ã¢â€°Â  NULL THEN
            Enqueue(queue, current.left)
        END IF
        
        IF current.right Ã¢â€°Â  NULL THEN
            Enqueue(queue, current.right)
        END IF
    END WHILE
END

ALGORITHM CalculateHeight(root)
INPUT: root - root node of tree
OUTPUT: height of tree
BEGIN
    IF root = NULL THEN
        RETURN -1
    END IF
    
    leftHeight = CalculateHeight(root.left)
    rightHeight = CalculateHeight(root.right)
    
    RETURN 1 + MAX(leftHeight, rightHeight)
END

ALGORITHM CountNodes(root)
INPUT: root - root node of tree
OUTPUT: total number of nodes
BEGIN
    IF root = NULL THEN
        RETURN 0
    END IF
    
    RETURN 1 + CountNodes(root.left) + CountNodes(root.right)
END`,
    implementationCode: `// Comprehensive Binary Tree Implementation

class TreeNode {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

class BinaryTree {
    constructor() {
        this.root = null;
    }
    
    // Insert using level order (complete tree property)
    insert(data) {
        const newNode = new TreeNode(data);
        
        if (!this.root) {
            this.root = newNode;
            return;
        }
        
        const queue = [this.root];
        
        while (queue.length > 0) {
            const current = queue.shift();
            
            if (!current.left) {
                current.left = newNode;
                return;
            } else if (!current.right) {
                current.right = newNode;
                return;
            } else {
                queue.push(current.left);
                queue.push(current.right);
            }
        }
    }
    
    // Inorder Traversal: Left Ã¢â€ â€™ Root Ã¢â€ â€™ Right
    inorderTraversal(node = this.root, result = []) {
        if (node) {
            this.inorderTraversal(node.left, result);
            result.push(node.data);
            this.inorderTraversal(node.right, result);
        }
        return result;
    }
    
    // Preorder Traversal: Root Ã¢â€ â€™ Left Ã¢â€ â€™ Right
    preorderTraversal(node = this.root, result = []) {
        if (node) {
            result.push(node.data);
            this.preorderTraversal(node.left, result);
            this.preorderTraversal(node.right, result);
        }
        return result;
    }
    
    // Postorder Traversal: Left Ã¢â€ â€™ Right Ã¢â€ â€™ Root
    postorderTraversal(node = this.root, result = []) {
        if (node) {
            this.postorderTraversal(node.left, result);
            this.postorderTraversal(node.right, result);
            result.push(node.data);
        }
        return result;
    }
    
    // Level Order Traversal (Breadth-First)
    levelOrderTraversal() {
        if (!this.root) return [];
        
        const result = [];
        const queue = [this.root];
        
        while (queue.length > 0) {
            const levelSize = queue.length;
            const currentLevel = [];
            
            for (let i = 0; i < levelSize; i++) {
                const node = queue.shift();
                currentLevel.push(node.data);
                
                if (node.left) queue.push(node.left);
                if (node.right) queue.push(node.right);
            }
            
            result.push(currentLevel);
        }
        
        return result;
    }
    
    // Calculate tree height
    getHeight(node = this.root) {
        if (!node) return -1;
        
        const leftHeight = this.getHeight(node.left);
        const rightHeight = this.getHeight(node.right);
        
        return 1 + Math.max(leftHeight, rightHeight);
    }
    
    // Count total nodes
    countNodes(node = this.root) {
        if (!node) return 0;
        
        return 1 + this.countNodes(node.left) + this.countNodes(node.right);
    }
    
    // Count leaf nodes
    countLeaves(node = this.root) {
        if (!node) return 0;
        
        if (!node.left && !node.right) return 1;
        
        return this.countLeaves(node.left) + this.countLeaves(node.right);
    }
    
    // Find maximum value
    findMax(node = this.root) {
        if (!node) return null;
        
        let max = node.data;
        
        const leftMax = this.findMax(node.left);
        const rightMax = this.findMax(node.right);
        
        if (leftMax !== null && leftMax > max) max = leftMax;
        if (rightMax !== null && rightMax > max) max = rightMax;
        
        return max;
    }
    
    // Find minimum value
    findMin(node = this.root) {
        if (!node) return null;
        
        let min = node.data;
        
        const leftMin = this.findMin(node.left);
        const rightMin = this.findMin(node.right);
        
        if (leftMin !== null && leftMin < min) min = leftMin;
        if (rightMin !== null && rightMin < min) min = rightMin;
        
        return min;
    }
    
    // Search for a value
    search(data, node = this.root) {
        if (!node) return false;
        
        if (node.data === data) return true;
        
        return this.search(data, node.left) || this.search(data, node.right);
    }
    
    // Check if tree is balanced
    isBalanced(node = this.root) {
        if (!node) return true;
        
        const leftHeight = this.getHeight(node.left);
        const rightHeight = this.getHeight(node.right);
        
        return Math.abs(leftHeight - rightHeight) <= 1 &&
               this.isBalanced(node.left) &&
               this.isBalanced(node.right);
    }
    
    // Check if tree is complete
    isComplete() {
        if (!this.root) return true;
        
        const queue = [this.root];
        let foundNull = false;
        
        while (queue.length > 0) {
            const node = queue.shift();
            
            if (!node) {
                foundNull = true;
            } else {
                if (foundNull) return false;
                queue.push(node.left);
                queue.push(node.right);
            }
        }
        
        return true;
    }
    
    // Mirror the tree
    mirror(node = this.root) {
        if (!node) return null;
        
        // Swap left and right children
        const temp = node.left;
        node.left = node.right;
        node.right = temp;
        
        // Recursively mirror subtrees
        this.mirror(node.left);
        this.mirror(node.right);
        
        return node;
    }
    
    // Print tree structure
    printTree(node = this.root, prefix = '', isLast = true) {
        if (!node) return;
        
        console.log(prefix + (isLast ? 'Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ ' : 'Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ ') + node.data);
        
        const children = [node.left, node.right].filter(child => child !== null);
        
        children.forEach((child, index) => {
            const isLastChild = index === children.length - 1;
            const newPrefix = prefix + (isLast ? '    ' : 'Ã¢â€â€š   ');
            this.printTree(child, newPrefix, isLastChild);
        });
    }
    
    // Convert to array representation
    toArray() {
        if (!this.root) return [];
        
        const result = [];
        const queue = [this.root];
        
        while (queue.length > 0) {
            const node = queue.shift();
            
            if (node) {
                result.push(node.data);
                queue.push(node.left);
                queue.push(node.right);
            } else {
                result.push(null);
            }
        }
        
        // Remove trailing nulls
        while (result.length > 0 && result[result.length - 1] === null) {
            result.pop();
        }
        
        return result;
    }
    
    // Create tree from array
    static fromArray(array) {
        if (!array || array.length === 0) return new BinaryTree();
        
        const tree = new BinaryTree();
        tree.root = new TreeNode(array[0]);
        const queue = [tree.root];
        let i = 1;
        
        while (queue.length > 0 && i < array.length) {
            const node = queue.shift();
            
            if (i < array.length && array[i] !== null) {
                node.left = new TreeNode(array[i]);
                queue.push(node.left);
            }
            i++;
            
            if (i < array.length && array[i] !== null) {
                node.right = new TreeNode(array[i]);
                queue.push(node.right);
            }
            i++;
        }
        
        return tree;
    }
}

// Usage Examples
const tree = new BinaryTree();

// Insert nodes
[1, 2, 3, 4, 5, 6, 7].forEach(val => tree.insert(val));

// Traversals
console.log('Inorder:', tree.inorderTraversal());     // [4, 2, 5, 1, 6, 3, 7]
console.log('Preorder:', tree.preorderTraversal());   // [1, 2, 4, 5, 3, 6, 7]
console.log('Postorder:', tree.postorderTraversal()); // [4, 5, 2, 6, 7, 3, 1]
console.log('Level order:', tree.levelOrderTraversal()); // [[1], [2, 3], [4, 5, 6, 7]]

// Tree properties
console.log('Height:', tree.getHeight());        // 2
console.log('Node count:', tree.countNodes());   // 7
console.log('Leaf count:', tree.countLeaves());  // 4
console.log('Max value:', tree.findMax());       // 7
console.log('Min value:', tree.findMin());       // 1
console.log('Is balanced:', tree.isBalanced());  // true
console.log('Is complete:', tree.isComplete());  // true

// Search
console.log('Search 5:', tree.search(5));        // true
console.log('Search 10:', tree.search(10));      // false

// Print tree structure
tree.printTree();

// Create from array
const arrayTree = BinaryTree.fromArray([1, 2, 3, null, 4, 5, 6]);
console.log('From array:', arrayTree.toArray()); // [1, 2, 3, null, 4, 5, 6]`,
    quizQuestions: [
      {
        question: "What is the maximum number of nodes at level 3 in a binary tree?",
        options: ["4", "6", "8", "16"],
        correctAnswer: 2,
        explanation: "At level i, the maximum number of nodes is 2^i. At level 3: 2^3 = 8 nodes."
      },
      {
        question: "Which traversal method gives nodes in sorted order for a Binary Search Tree?",
        options: ["Preorder", "Inorder", "Postorder", "Level order"],
        correctAnswer: 1,
        explanation: "Inorder traversal (Left Ã¢â€ â€™ Root Ã¢â€ â€™ Right) visits nodes in ascending sorted order for a BST."
      },
      {
        question: "What is the minimum height of a binary tree with 15 nodes?",
        options: ["3", "4", "5", "6"],
        correctAnswer: 0,
        explanation: "Minimum height = Ã¢Å’Å logÃ¢â€šâ€š(n)Ã¢Å’â€¹ = Ã¢Å’Å logÃ¢â€šâ€š(15)Ã¢Å’â€¹ = Ã¢Å’Å 3.9Ã¢Å’â€¹ = 3."
      },
      {
        question: "In which traversal do you process children before the parent?",
        options: ["Preorder", "Inorder", "Postorder", "Level order"],
        correctAnswer: 2,
        explanation: "Postorder traversal processes left child, right child, then parent node."
      },
      {
        question: "What type of binary tree has all levels completely filled except possibly the last?",
        options: ["Full binary tree", "Perfect binary tree", "Complete binary tree", "Balanced binary tree"],
        correctAnswer: 2,
        explanation: "A complete binary tree has all levels filled except possibly the last level, which is filled from left to right."
      }
    ]
  },
  {
    id: 'binary-search-tree',
    title: 'Binary Search Tree',
    description: 'Efficient BST operations: insert, delete, search with optimal performance',
    category: 'Trees',
    difficulty: 'intermediate',
    timeComplexity: 'O(log n) - O(n)',
    spaceComplexity: 'O(h)',
    extendedDefinition: `A Binary Search Tree (BST) is a hierarchical data structure where each node has at most two children, and the tree maintains the BST property: for every node, all values in the left subtree are smaller, and all values in the right subtree are larger.

What it does: maintains sorted tree structure where left children are smaller and right children are larger than parent.

How it works: uses BST property for efficient search, insert, and delete operations by eliminating half the tree at each step.

When to use: fast searching, maintaining sorted data, range queries, when you need O(log n) operations on dynamic datasets.`,
    voiceExplanation: `Think of a Binary Search Tree like a perfectly organized filing system where everything has its logical place. Imagine you're the root of the family tree, and everyone to your left in the family has a smaller value than you, and everyone to your right has a larger value. This rule applies to every person in the tree - they're always bigger than everyone on their left and smaller than everyone on their right. This organization makes searching incredibly fast because you can eliminate half the tree with each comparison, just like binary search. When you want to find someone, you start at the top and keep going left if they're smaller or right if they're bigger until you find them. It's like having a perfectly organized filing system where everything has its logical place.`,
    realWorldApplications: `**Industry Applications:**
- **Database Systems**: B-trees for indexing, query optimization, range queries
- **File Systems**: Directory structures, file organization, metadata storage
- **Compiler Design**: Symbol tables, syntax trees, expression parsing
- **Network Routing**: Routing tables, IP address lookups, network topology
- **Game Development**: Spatial partitioning, collision detection, AI decision trees
- **Operating Systems**: Process scheduling, memory management, resource allocation
- **Search Engines**: Inverted indexes, document ranking, query processing
- **Financial Systems**: Order books, price discovery, risk management
- **Machine Learning**: Decision trees, random forests, feature selection
- **Graphics**: Scene graphs, ray tracing, 3D rendering pipelines`,
    keyConcepts: `**Essential Concepts:**
1. **BST Property**: Fundamental ordering constraint that enables efficient operations
2. **Tree Height**: Determines performance - balanced trees have O(log n) height
3. **Node Structure**: Each node contains data, left pointer, and right pointer
4. **Recursive Nature**: Most BST operations are naturally recursive
5. **Inorder Traversal**: Produces sorted sequence of elements
6. **Successor/Predecessor**: Finding next/previous elements in sorted order
7. **Tree Balance**: Understanding when trees become skewed and performance degrades
8. **Deletion Cases**: Three scenarios - leaf, one child, two children`,
    pseudocode: `**Binary Search Tree Operations Pseudocode:**

ALGORITHM BSTSearch(root, key)
INPUT: root node, key to search
OUTPUT: node containing key or NULL
BEGIN
    IF root == NULL OR root.data == key THEN
        RETURN root
    END IF
    
    IF key < root.data THEN
        RETURN BSTSearch(root.left, key)
    ELSE
        RETURN BSTSearch(root.right, key)
    END IF
END

ALGORITHM BSTInsert(root, key)
INPUT: root node, key to insert
OUTPUT: root of modified tree
BEGIN
    IF root == NULL THEN
        RETURN CreateNode(key)
    END IF
    
    IF key < root.data THEN
        root.left = BSTInsert(root.left, key)
    ELSE IF key > root.data THEN
        root.right = BSTInsert(root.right, key)
    END IF
    
    RETURN root
END

ALGORITHM BSTDelete(root, key)
INPUT: root node, key to delete
OUTPUT: root of modified tree
BEGIN
    IF root == NULL THEN
        RETURN root
    END IF
    
    IF key < root.data THEN
        root.left = BSTDelete(root.left, key)
    ELSE IF key > root.data THEN
        root.right = BSTDelete(root.right, key)
    ELSE
        // Node to be deleted found
        IF root.left == NULL THEN
            RETURN root.right
        ELSE IF root.right == NULL THEN
            RETURN root.left
        END IF
        
        // Node has two children
        successor = FindMin(root.right)
        root.data = successor.data
        root.right = BSTDelete(root.right, successor.data)
    END IF
    
    RETURN root
END`,
    implementationCode: `// Comprehensive Binary Search Tree Implementation

class TreeNode {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

class BinarySearchTree {
    constructor() {
        this.root = null;
    }
    
    // Insert a value - O(log n) average, O(n) worst case
    insert(data) {
        this.root = this._insertRecursive(this.root, data);
    }
    
    _insertRecursive(node, data) {
        // Base case: create new node
        if (node === null) {
            return new TreeNode(data);
        }
        
        // Recursive case: insert in appropriate subtree
        if (data < node.data) {
            node.left = this._insertRecursive(node.left, data);
        } else if (data > node.data) {
            node.right = this._insertRecursive(node.right, data);
        }
        // Ignore duplicates
        
        return node;
    }
    
    // Search for a value - O(log n) average, O(n) worst case
    search(data) {
        return this._searchRecursive(this.root, data);
    }
    
    _searchRecursive(node, data) {
        // Base cases
        if (node === null || node.data === data) {
            return node;
        }
        
        // Recursive cases
        if (data < node.data) {
            return this._searchRecursive(node.left, data);
        } else {
            return this._searchRecursive(node.right, data);
        }
    }
    
    // Delete a value - O(log n) average, O(n) worst case
    delete(data) {
        this.root = this._deleteRecursive(this.root, data);
    }
    
    _deleteRecursive(node, data) {
        // Base case
        if (node === null) {
            return node;
        }
        
        // Find the node to delete
        if (data < node.data) {
            node.left = this._deleteRecursive(node.left, data);
        } else if (data > node.data) {
            node.right = this._deleteRecursive(node.right, data);
        } else {
            // Node to be deleted found
            
            // Case 1: Node has no children (leaf node)
            if (node.left === null && node.right === null) {
                return null;
            }
            
            // Case 2: Node has one child
            if (node.left === null) {
                return node.right;
            }
            if (node.right === null) {
                return node.left;
            }
            
            // Case 3: Node has two children
            // Find inorder successor (smallest in right subtree)
            const successor = this._findMin(node.right);
            node.data = successor.data;
            node.right = this._deleteRecursive(node.right, successor.data);
        }
        
        return node;
    }
    
    // Find minimum value in tree
    findMin() {
        if (this.root === null) return null;
        return this._findMin(this.root).data;
    }
    
    _findMin(node) {
        while (node.left !== null) {
            node = node.left;
        }
        return node;
    }
    
    // Find maximum value in tree
    findMax() {
        if (this.root === null) return null;
        return this._findMax(this.root).data;
    }
    
    _findMax(node) {
        while (node.right !== null) {
            node = node.right;
        }
        return node;
    }
    
    // Inorder traversal (sorted order) - O(n)
    inorderTraversal() {
        const result = [];
        this._inorderRecursive(this.root, result);
        return result;
    }
    
    _inorderRecursive(node, result) {
        if (node !== null) {
            this._inorderRecursive(node.left, result);
            result.push(node.data);
            this._inorderRecursive(node.right, result);
        }
    }
    
    // Preorder traversal - O(n)
    preorderTraversal() {
        const result = [];
        this._preorderRecursive(this.root, result);
        return result;
    }
    
    _preorderRecursive(node, result) {
        if (node !== null) {
            result.push(node.data);
            this._preorderRecursive(node.left, result);
            this._preorderRecursive(node.right, result);
        }
    }
    
    // Postorder traversal - O(n)
    postorderTraversal() {
        const result = [];
        this._postorderRecursive(this.root, result);
        return result;
    }
    
    _postorderRecursive(node, result) {
        if (node !== null) {
            this._postorderRecursive(node.left, result);
            this._postorderRecursive(node.right, result);
            result.push(node.data);
        }
    }
    
    // Level order traversal (BFS) - O(n)
    levelOrderTraversal() {
        if (this.root === null) return [];
        
        const result = [];
        const queue = [this.root];
        
        while (queue.length > 0) {
            const node = queue.shift();
            result.push(node.data);
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        
        return result;
    }
    
    // Calculate height of tree - O(n)
    height() {
        return this._heightRecursive(this.root);
    }
    
    _heightRecursive(node) {
        if (node === null) return -1;
        
        const leftHeight = this._heightRecursive(node.left);
        const rightHeight = this._heightRecursive(node.right);
        
        return Math.max(leftHeight, rightHeight) + 1;
    }
    
    // Check if tree is valid BST
    isValidBST() {
        return this._isValidBSTRecursive(this.root, null, null);
    }
    
    _isValidBSTRecursive(node, min, max) {
        if (node === null) return true;
        
        if ((min !== null && node.data <= min) || 
            (max !== null && node.data >= max)) {
            return false;
        }
        
        return this._isValidBSTRecursive(node.left, min, node.data) &&
               this._isValidBSTRecursive(node.right, node.data, max);
    }
}

// Usage Example
const bst = new BinarySearchTree();

// Insert values
[50, 30, 70, 20, 40, 60, 80].forEach(val => bst.insert(val));

console.log("Inorder:", bst.inorderTraversal()); // [20, 30, 40, 50, 60, 70, 80]
console.log("Search 40:", bst.search(40) !== null); // true
console.log("Height:", bst.height()); // 2
console.log("Min:", bst.findMin()); // 20
console.log("Max:", bst.findMax()); // 80

bst.delete(30);
console.log("After deleting 30:", bst.inorderTraversal()); // [20, 40, 50, 60, 70, 80]`,
    example: `// Simple BST Implementation
class BST {
    constructor() { this.root = null; }
    
    insert(data) {
        this.root = this._insert(this.root, data);
    }
    
    _insert(node, data) {
        if (!node) return { data, left: null, right: null };
        
        if (data < node.data) node.left = this._insert(node.left, data);
        else if (data > node.data) node.right = this._insert(node.right, data);
        
        return node;
    }
    
    search(data) {
        return this._search(this.root, data);
    }
    
    _search(node, data) {
        if (!node || node.data === data) return node;
        return data < node.data ? this._search(node.left, data) : this._search(node.right, data);
    }
}

const bst2 = new BST();
bst2.insert(50); bst2.insert(30); bst2.insert(70);
console.log(bst2.search(30)); // Found`,
    quizQuestions: [
      {
        question: "What is the key property that defines a Binary Search Tree?",
        options: ["All nodes have exactly two children", "Left subtree values < root < right subtree values", "Tree is always balanced", "Nodes are stored in level order"],
        correctAnswer: 1,
        explanation: "The BST property states that for every node, all values in the left subtree are smaller and all values in the right subtree are larger."
      },
      {
        question: "What is the average time complexity for search operations in a BST?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctAnswer: 1,
        explanation: "In a balanced BST, search operations take O(log n) time as we eliminate half the tree with each comparison."
      },
      {
        question: "What happens to BST performance when the tree becomes skewed (like a linked list)?",
        options: ["Performance improves", "Performance stays the same", "Performance degrades to O(n)", "Tree becomes invalid"],
        correctAnswer: 2,
        explanation: "When a BST becomes skewed, it essentially becomes a linked list, and operations degrade from O(log n) to O(n)."
      },
      {
        question: "Which case is most complex when deleting a node from a BST?",
        options: ["Deleting a leaf node", "Deleting a node with one child", "Deleting a node with two children", "All cases are equally complex"],
        correctAnswer: 2,
        explanation: "Deleting a node with two children requires finding the inorder successor (or predecessor) and replacing the node's value."
      },
      {
        question: "What does an inorder traversal of a BST produce?",
        options: ["Random order", "Reverse sorted order", "Sorted order", "Level order"],
        correctAnswer: 2,
        explanation: "Inorder traversal of a BST visits nodes in ascending sorted order due to the BST property."
      }
    ]
  },
  {
    id: 'heap-operations',
    title: 'Heap Data Structure',
    description: 'Min-heap and max-heap operations: insert, delete, heapify',
    category: 'Trees',
    difficulty: 'intermediate',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    extendedDefinition: `A Heap is a specialized tree-based data structure that satisfies the heap property, where parent nodes are either greater than (max-heap) or less than (min-heap) their children. It's commonly implemented as a complete binary tree using an array.`,
    example: `// Min Heap Implementation
class MinHeap {
    constructor() {
        this.heap = [];
    }
    
    insert(val) {
        this.heap.push(val);
        this.heapifyUp(this.heap.length - 1);
    }
    
    extractMin() {
        if (this.heap.length === 0) return null;
        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.heapifyDown(0);
        return min;
    }
    
    heapifyUp(index) {
        const parent = Math.floor((index - 1) / 2);
        if (parent >= 0 && this.heap[parent] > this.heap[index]) {
            [this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[parent]];
            this.heapifyUp(parent);
        }
    }
    
    heapifyDown(index) {
        const left = 2 * index + 1;
        const right = 2 * index + 2;
        let smallest = index;
        
        if (left < this.heap.length && this.heap[left] < this.heap[smallest]) {
            smallest = left;
        }
        if (right < this.heap.length && this.heap[right] < this.heap[smallest]) {
            smallest = right;
        }
        
        if (smallest !== index) {
            [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
            this.heapifyDown(smallest);
        }
    }
}

const heap = new MinHeap();
heap.insert(3);
heap.insert(1);
heap.insert(4);
console.log(heap.extractMin()); // 1`,
    syntax: `**Heap Operation Patterns:**

1. **Insert Element:**
   \`\`\`javascript
   insert(val) {
       this.heap.push(val);
       this.heapifyUp(this.heap.length - 1);
   }
   \`\`\`

2. **Extract Min/Max:**
   \`\`\`javascript
   extractMin() {
       const min = this.heap[0];
       this.heap[0] = this.heap.pop();
       this.heapifyDown(0);
       return min;
   }
   \`\`\`

3. **Heapify Operations:**
   \`\`\`javascript
   heapifyUp(index) {
       const parent = Math.floor((index - 1) / 2);
       if (parent >= 0 && this.heap[parent] > this.heap[index]) {
           [this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[parent]];
           this.heapifyUp(parent);
       }
   }
   \`\`\``,
    voiceExplanation: `Think of a heap like a family tree where parents are always more important than their children, but siblings don't care about each other's rank. In a min-heap, every parent is smaller than their children - imagine a corporate hierarchy where the CEO (root) has the smallest employee ID, and every manager has a smaller ID than their direct reports. When you want to find the most important person (minimum value), you just look at the top! When someone new joins the company, they start at the bottom and bubble up until they find their proper place in the hierarchy. When the CEO leaves, the newest employee temporarily takes their place, but then they sink down to where they belong while someone more qualified rises to fill the leadership role. This constant reorganization ensures that the most important person is always at the top, and you can find them instantly!`,
    extendedDefinition: `A Heap is a specialized tree-based data structure that satisfies the heap property. It's a complete binary tree where every parent node has a specific relationship with its children, making it perfect for priority-based operations.

What it does: maintains heap property where parent nodes are always smaller (min-heap) or larger (max-heap) than their children.

How it works: uses complete binary tree stored in array with parent-child relationships maintained through array indices and heapify operations.

When to use: priority queues, heap sort, graph algorithms like Dijkstra's and Prim's, task scheduling systems.`,
    realWorldApplications: `**Industry Applications:**
- **Operating Systems**: Process scheduling, memory management, interrupt handling
- **Network Systems**: Bandwidth allocation, packet prioritization, QoS management
- **Database Systems**: Query optimization, index management, buffer pool management
- **Game Development**: AI decision making, pathfinding algorithms, event scheduling
- **Financial Systems**: Order book management, risk assessment, algorithmic trading
- **Web Services**: Load balancing, request prioritization, rate limiting
- **Data Processing**: Stream processing, real-time analytics, data compression
- **Machine Learning**: Feature selection, model optimization, hyperparameter tuning
- **Graphics & Rendering**: Z-buffer algorithms, collision detection, animation systems
- **Embedded Systems**: Real-time task scheduling, resource allocation, power management`,
    keyConcepts: `**Essential Concepts:**
1. **Heap Property**: Fundamental ordering constraint between parent and children
2. **Complete Binary Tree**: Structural requirement for efficient array representation
3. **Array Representation**: Index-based parent-child relationships without pointers
4. **Heapify Operations**: Bubble-up and bubble-down for maintaining heap property
5. **Root Invariant**: Min/Max element always accessible in O(1) time
6. **Insertion Process**: Add at end, then bubble up to maintain property
7. **Deletion Process**: Replace root with last element, then bubble down
8. **Heap Construction**: Building heap from arbitrary array in O(n) time`,
    pseudocode: `**Heap Operations Pseudocode:**

ALGORITHM HeapifyUp(heap, index)
INPUT: heap array, index of element to bubble up
OUTPUT: heap with property maintained
BEGIN
    WHILE index > 0 DO
        parentIndex = (index - 1) / 2
        IF heap[parentIndex] <= heap[index] THEN
            BREAK
        END IF
        
        SWAP heap[parentIndex] AND heap[index]
        index = parentIndex
    END WHILE
END

ALGORITHM HeapifyDown(heap, index, size)
INPUT: heap array, starting index, heap size
OUTPUT: heap with property maintained
BEGIN
    WHILE TRUE DO
        leftChild = 2 * index + 1
        rightChild = 2 * index + 2
        smallest = index
        
        IF leftChild < size AND heap[leftChild] < heap[smallest] THEN
            smallest = leftChild
        END IF
        
        IF rightChild < size AND heap[rightChild] < heap[smallest] THEN
            smallest = rightChild
        END IF
        
        IF smallest = index THEN
            BREAK
        END IF
        
        SWAP heap[index] AND heap[smallest]
        index = smallest
    END WHILE
END

ALGORITHM HeapInsert(heap, value)
INPUT: heap array, value to insert
OUTPUT: heap with new element
BEGIN
    heap.ADD(value)
    HeapifyUp(heap, heap.SIZE - 1)
END

ALGORITHM HeapExtractMin(heap)
INPUT: heap array
OUTPUT: minimum element
BEGIN
    IF heap.SIZE = 0 THEN
        RETURN NULL
    END IF
    
    minimum = heap[0]
    heap[0] = heap[heap.SIZE - 1]
    heap.REMOVE_LAST()
    
    IF heap.SIZE > 0 THEN
        HeapifyDown(heap, 0, heap.SIZE)
    END IF
    
    RETURN minimum
END`,
    implementationCode: `// Comprehensive Heap Implementation

class MinHeap {
    constructor() {
        this.heap = [];
    }
    
    // Get parent index
    getParentIndex(index) {
        return Math.floor((index - 1) / 2);
    }
    
    // Get left child index
    getLeftChildIndex(index) {
        return 2 * index + 1;
    }
    
    // Get right child index
    getRightChildIndex(index) {
        return 2 * index + 2;
    }
    
    // Swap elements
    swap(index1, index2) {
        [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
    }
    
    // Peek at minimum element - O(1)
    peek() {
        if (this.heap.length === 0) {
            throw new Error('Heap is empty');
        }
        return this.heap[0];
    }
    
    // Extract minimum element - O(log n)
    extractMin() {
        if (this.heap.length === 0) {
            throw new Error('Heap is empty');
        }
        
        if (this.heap.length === 1) {
            return this.heap.pop();
        }
        
        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.heapifyDown();
        return min;
    }
    
    // Insert element - O(log n)
    insert(value) {
        this.heap.push(value);
        this.heapifyUp();
    }
    
    // Heapify up (bubble up)
    heapifyUp() {
        let index = this.heap.length - 1;
        
        while (index > 0) {
            const parentIndex = this.getParentIndex(index);
            
            if (this.heap[parentIndex] <= this.heap[index]) {
                break;
            }
            
            this.swap(parentIndex, index);
            index = parentIndex;
        }
    }
    
    // Heapify down (bubble down)
    heapifyDown() {
        let index = 0;
        
        while (this.getLeftChildIndex(index) < this.heap.length) {
            let smallerChildIndex = this.getLeftChildIndex(index);
            
            if (this.getRightChildIndex(index) < this.heap.length && 
                this.heap[this.getRightChildIndex(index)] < this.heap[smallerChildIndex]) {
                smallerChildIndex = this.getRightChildIndex(index);
            }
            
            if (this.heap[index] < this.heap[smallerChildIndex]) {
                break;
            }
            
            this.swap(index, smallerChildIndex);
            index = smallerChildIndex;
        }
    }
    
    // Build heap from array - O(n)
    buildHeap(array) {
        this.heap = [...array];
        
        for (let i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) {
            this.heapifyDownFrom(i);
        }
    }
    
    // Heapify down from specific index
    heapifyDownFrom(index) {
        while (this.getLeftChildIndex(index) < this.heap.length) {
            let smallerChildIndex = this.getLeftChildIndex(index);
            
            if (this.getRightChildIndex(index) < this.heap.length && 
                this.heap[this.getRightChildIndex(index)] < this.heap[smallerChildIndex]) {
                smallerChildIndex = this.getRightChildIndex(index);
            }
            
            if (this.heap[index] < this.heap[smallerChildIndex]) {
                break;
            }
            
            this.swap(index, smallerChildIndex);
            index = smallerChildIndex;
        }
    }
    
    // Get size
    size() {
        return this.heap.length;
    }
    
    // Check if empty
    isEmpty() {
        return this.heap.length === 0;
    }
    
    // Convert to array
    toArray() {
        return [...this.heap];
    }
}

// Max Heap Implementation
class MaxHeap extends MinHeap {
    // Override comparison methods for max heap
    heapifyUp() {
        let index = this.heap.length - 1;
        
        while (index > 0) {
            const parentIndex = this.getParentIndex(index);
            
            if (this.heap[parentIndex] >= this.heap[index]) {
                break;
            }
            
            this.swap(parentIndex, index);
            index = parentIndex;
        }
    }
    
    heapifyDown() {
        let index = 0;
        
        while (this.getLeftChildIndex(index) < this.heap.length) {
            let largerChildIndex = this.getLeftChildIndex(index);
            
            if (this.getRightChildIndex(index) < this.heap.length && 
                this.heap[this.getRightChildIndex(index)] > this.heap[largerChildIndex]) {
                largerChildIndex = this.getRightChildIndex(index);
            }
            
            if (this.heap[index] > this.heap[largerChildIndex]) {
                break;
            }
            
            this.swap(index, largerChildIndex);
            index = largerChildIndex;
        }
    }
    
    extractMax() {
        return this.extractMin(); // Same logic, different name
    }
}

// Priority Queue using Heap
class PriorityQueue {
    constructor(compareFn = (a, b) => a.priority - b.priority) {
        this.heap = [];
        this.compare = compareFn;
    }
    
    enqueue(item, priority) {
        const node = { item, priority };
        this.heap.push(node);
        this.heapifyUp();
    }
    
    dequeue() {
        if (this.isEmpty()) return null;
        
        if (this.heap.length === 1) {
            return this.heap.pop().item;
        }
        
        const min = this.heap[0].item;
        this.heap[0] = this.heap.pop();
        this.heapifyDown();
        return min;
    }
    
    heapifyUp() {
        let index = this.heap.length - 1;
        
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            
            if (this.compare(this.heap[parentIndex], this.heap[index]) <= 0) {
                break;
            }
            
            [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
            index = parentIndex;
        }
    }
    
    heapifyDown() {
        let index = 0;
        
        while (2 * index + 1 < this.heap.length) {
            let smallerChildIndex = 2 * index + 1;
            
            if (2 * index + 2 < this.heap.length && 
                this.compare(this.heap[2 * index + 2], this.heap[smallerChildIndex]) < 0) {
                smallerChildIndex = 2 * index + 2;
            }
            
            if (this.compare(this.heap[index], this.heap[smallerChildIndex]) <= 0) {
                break;
            }
            
            [this.heap[index], this.heap[smallerChildIndex]] = [this.heap[smallerChildIndex], this.heap[index]];
            index = smallerChildIndex;
        }
    }
    
    peek() {
        return this.isEmpty() ? null : this.heap[0].item;
    }
    
    isEmpty() {
        return this.heap.length === 0;
    }
    
    size() {
        return this.heap.length;
    }
}

// Usage Examples
const minHeap = new MinHeap();
[4, 1, 3, 2, 16, 9, 10, 14, 8, 7].forEach(val => minHeap.insert(val));

console.log('Heap array:', minHeap.toArray());
console.log('Min element:', minHeap.peek());
console.log('Extract min:', minHeap.extractMin());

const maxHeap = new MaxHeap();
maxHeap.buildHeap([4, 1, 3, 2, 16, 9, 10, 14, 8, 7]);
console.log('Max heap:', maxHeap.toArray());

const pq = new PriorityQueue();
pq.enqueue('Low priority task', 3);
pq.enqueue('High priority task', 1);
pq.enqueue('Medium priority task', 2);

while (!pq.isEmpty()) {
    console.log('Processing:', pq.dequeue());
}`,
    quizQuestions: [
      {
        question: "What is the key property that defines a min-heap?",
        options: ["Every parent node is greater than its children", "Every parent node is less than or equal to its children", "All nodes are in sorted order", "The tree is perfectly balanced"],
        correctAnswer: 1,
        explanation: "In a min-heap, every parent node must be less than or equal to its children, ensuring the minimum element is always at the root."
      },
      {
        question: "What is the time complexity of inserting an element into a heap?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctAnswer: 1,
        explanation: "Insertion takes O(log n) time because the element may need to bubble up through all levels of the tree, which has height log n."
      },
      {
        question: "In an array representation of a heap, what is the index of the left child of node at index i?",
        options: ["i + 1", "2i", "2i + 1", "i * 2 - 1"],
        correctAnswer: 2,
        explanation: "In zero-indexed array representation, the left child of node at index i is located at index 2i + 1."
      },
      {
        question: "What is the time complexity of building a heap from an arbitrary array?",
        options: ["O(n)", "O(n log n)", "O(log n)", "O(nÃ‚Â²)"],
        correctAnswer: 0,
        explanation: "Building a heap from an array takes O(n) time using the bottom-up heapify approach, which is more efficient than inserting elements one by one."
      },
      {
        question: "Which operation is NOT efficiently supported by a heap?",
        options: ["Finding minimum/maximum", "Inserting an element", "Searching for an arbitrary element", "Deleting minimum/maximum"],
        correctAnswer: 2,
        explanation: "Heaps are not optimized for searching arbitrary elements, which takes O(n) time. They excel at min/max operations and insertions/deletions."
      }
    ]
  },
  {
    id: 'tree-inorder-traversal',
    title: 'Inorder Traversal',
    description: 'Process nodes in sorted order for BSTs - essential for retrieving data in ascending sequence',
    category: 'Trees',
    difficulty: 'beginner',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)',
    extendedDefinition: `Inorder Traversal is a depth-first tree traversal method that visits nodes in the order: Left subtree → Root → Right subtree. This traversal pattern has special significance for Binary Search Trees (BSTs) as it produces elements in sorted ascending order.

What it does: visits tree nodes in left-root-right order, producing sorted sequence for BSTs.

How it works: recursively traverses left subtree, processes current node, then traverses right subtree.

When to use: retrieving sorted data from BSTs, validating BST property, finding kth smallest element.`,
    example: `// Inorder Traversal (Left, Root, Right)
function inorderTraversal(root) {
    const result = [];
    
    function inorder(node) {
        if (node) {
            inorder(node.left);    // Visit left subtree
            result.push(node.val); // Process current node
            inorder(node.right);   // Visit right subtree
        }
    }
    
    inorder(root);
    return result;
}

// Iterative Inorder Traversal
function inorderIterative(root) {
    const result = [], stack = [];
    let current = root;
    
    while (current || stack.length > 0) {
        // Go to leftmost node
        while (current) {
            stack.push(current);
            current = current.left;
        }
        
        // Process current node
        current = stack.pop();
        result.push(current.val);
        
        // Move to right subtree
        current = current.right;
    }
    
    return result;
}

// Example: Tree [1, null, 2, 3] gives [1, 3, 2]`,
    syntax: `**Inorder Traversal Patterns:**

1. **Recursive Inorder:**
   \`\`\`javascript
   function inorder(root) {
       if (!root) return;
       inorder(root.left);
       console.log(root.val);
       inorder(root.right);
   }
   \`\`\`

2. **Iterative Inorder:**
   \`\`\`javascript
   function inorderIterative(root) {
       const stack = [], result = [];
       let current = root;
       while (current || stack.length) {
           while (current) {
               stack.push(current);
               current = current.left;
           }
           current = stack.pop();
           result.push(current.val);
           current = current.right;
       }
       return result;
   }
   \`\`\``
  },
  {
    id: 'tree-preorder-traversal',
    title: 'Preorder Traversal',
    description: 'Process parent before children - ideal for tree copying and serialization',
    category: 'Trees',
    difficulty: 'beginner',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)',
    extendedDefinition: `Preorder Traversal is a depth-first tree traversal method that visits nodes in the order: Root → Left subtree → Right subtree. This "parent-first" approach makes it ideal for operations that need to process a node before its children.

What it does: visits tree nodes in root-left-right order, processing parent before children for tree operations.

How it works: processes current node first, then recursively traverses left subtree, followed by right subtree.

When to use: tree copying, serialization, expression tree evaluation, file system operations, creating tree structures.`,
    example: `// Preorder Traversal (Root, Left, Right)
function preorderTraversal(root) {
    const result = [];
    
    function preorder(node) {
        if (node) {
            result.push(node.val); // Process current node first
            preorder(node.left);   // Visit left subtree
            preorder(node.right);  // Visit right subtree
        }
    }
    
    preorder(root);
    return result;
}

// Iterative Preorder Traversal
function preorderIterative(root) {
    if (!root) return [];
    
    const result = [], stack = [root];
    
    while (stack.length > 0) {
        const node = stack.pop();
        result.push(node.val);
        
        // Push right first, then left (stack is LIFO)
        if (node.right) stack.push(node.right);
        if (node.left) stack.push(node.left);
    }
    
    return result;
}

// Example: Tree [1, 2, 3, 4, 5] gives [1, 2, 4, 5, 3]`,
    syntax: `**Preorder Traversal Patterns:**

1. **Recursive Preorder:**
   \`\`\`javascript
   function preorder(root) {
       if (!root) return;
       console.log(root.val);  // Process root first
       preorder(root.left);
       preorder(root.right);
   }
   \`\`\`

2. **Iterative Preorder:**
   \`\`\`javascript
   function preorderIterative(root) {
       if (!root) return [];
       const stack = [root], result = [];
       while (stack.length) {
           const node = stack.pop();
           result.push(node.val);
           if (node.right) stack.push(node.right);
           if (node.left) stack.push(node.left);
       }
       return result;
   }
   \`\`\``,
    voiceExplanation: `Think of preorder traversal like being a tour guide leading a group through a museum! As a good tour guide, you always introduce each room or exhibit first before taking people to see the details inside. You'd say "Welcome to the Ancient Egypt section!" before exploring the individual artifacts. This is exactly how preorder traversal works - it visits the parent node first (like announcing the room), then explores the left wing (left subtree), and finally the right wing (right subtree). This approach is perfect when you need to establish context or make decisions at the parent level before processing children. It's like reading a book's table of contents - you see the chapter title first, then the main sections, then the subsections. Preorder is ideal for copying trees (you need to create the parent before the children), serializing data structures, or any situation where the parent needs to "set the stage" for its children!`,
    realWorldApplications: `**Industry Applications:**
- **File System Operations**: Directory listing, file tree copying, backup systems
- **Compiler Design**: Abstract syntax tree processing, code generation, symbol table creation
- **Database Systems**: Query plan execution, index tree traversal, schema validation
- **Web Development**: DOM tree serialization, component rendering, XML/JSON parsing
- **Game Development**: Scene graph traversal, object hierarchy processing, collision detection
- **Network Systems**: Routing table construction, protocol stack processing, packet forwarding
- **Operating Systems**: Process tree management, resource allocation, system call handling
- **Document Processing**: Document structure analysis, template processing, content management
- **Artificial Intelligence**: Decision tree evaluation, knowledge base traversal, expert systems
- **Graphics Processing**: Rendering pipeline, transformation hierarchies, animation systems`,
    keyConcepts: `**Essential Concepts:**
1. **Root-First Processing**: Parent nodes processed before their children
2. **Top-Down Information Flow**: Context established at parent level flows to children
3. **Prefix Expression Generation**: Produces prefix notation for expression trees
4. **Tree Serialization**: Natural order for converting trees to linear representations
5. **Stack-Based Implementation**: Iterative version uses explicit stack with right-first pushing
6. **Morris Traversal**: Advanced technique for O(1) space complexity using threading
7. **Tree Copying Pattern**: Standard approach for duplicating tree structures
8. **Recursive Structure**: Algorithm naturally mirrors the recursive nature of trees`,
    pseudocode: `**Preorder Traversal Algorithms:**

ALGORITHM PreorderRecursive(TreeNode root)
INPUT: root - root of the tree/subtree
OUTPUT: preorder sequence of node values
BEGIN
    IF root = NULL THEN
        RETURN
    END IF
    
    PROCESS(root.value)              // Process current node first
    PreorderRecursive(root.left)     // Process left subtree
    PreorderRecursive(root.right)    // Process right subtree
END

ALGORITHM PreorderIterative(TreeNode root)
INPUT: root - root of the tree
OUTPUT: preorder sequence of node values
BEGIN
    IF root = NULL THEN
        RETURN empty list
    END IF
    
    CREATE stack
    CREATE result list
    
    PUSH root onto stack
    
    WHILE stack is not empty DO
        node = POP from stack
        ADD node.value to result
        
        // Push right child first, then left (stack is LIFO)
        IF node.right ≠ NULL THEN
            PUSH node.right onto stack
        END IF
        
        IF node.left ≠ NULL THEN
            PUSH node.left onto stack
        END IF
    END WHILE
    
    RETURN result
END`,
    implementationCode: `// Comprehensive Preorder Traversal Implementation

class TreeNode {
    constructor(val, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

class PreorderTraversal {
    constructor() {
        this.visitCount = 0;
    }
    
    // 1. Recursive Preorder Traversal
    preorderRecursive(root, result = []) {
        if (!root) return result;
        
        result.push(root.val);  // Process root first
        this.visitCount++;
        
        this.preorderRecursive(root.left, result);   // Left subtree
        this.preorderRecursive(root.right, result);  // Right subtree
        
        return result;
    }
    
    // 2. Iterative Preorder Traversal
    preorderIterative(root) {
        if (!root) return [];
        
        const result = [];
        const stack = [root];
        
        while (stack.length > 0) {
            const node = stack.pop();
            result.push(node.val);
            this.visitCount++;
            
            // Push right first, then left (stack is LIFO)
            if (node.right) stack.push(node.right);
            if (node.left) stack.push(node.left);
        }
        
        return result;
    }
    
    // 3. Tree Copying (Classic Preorder Application)
    copyTree(root) {
        if (!root) return null;
        
        // Create new node first (preorder pattern)
        const newNode = new TreeNode(root.val);
        
        // Copy subtrees
        newNode.left = this.copyTree(root.left);
        newNode.right = this.copyTree(root.right);
        
        return newNode;
    }
    
    // 4. Tree Serialization
    serialize(root) {
        if (!root) return 'null';
        
        // Process root first, then children
        return root.val + ',' + this.serialize(root.left) + ',' + this.serialize(root.right);
    }
    
    // 5. Path Sum Problems
    hasPathSum(root, targetSum) {
        if (!root) return false;
        
        // Check if leaf node with target sum
        if (!root.left && !root.right) {
            return root.val === targetSum;
        }
        
        // Recursively check subtrees with reduced sum
        const remainingSum = targetSum - root.val;
        return this.hasPathSum(root.left, remainingSum) || 
               this.hasPathSum(root.right, remainingSum);
    }
    
    resetVisitCount() {
        this.visitCount = 0;
    }
    
    getVisitCount() {
        return this.visitCount;
    }
}

// Usage Examples
console.log('=== Preorder Traversal Examples ===');

const traversal = new PreorderTraversal();

// Build sample tree:     1
//                       / \\
//                      2   3
//                     / \\
//                    4   5
const root = new TreeNode(1,
    new TreeNode(2,
        new TreeNode(4),
        new TreeNode(5)
    ),
    new TreeNode(3)
);

console.log('Preorder (Recursive):', traversal.preorderRecursive(root)); // [1, 2, 4, 5, 3]
traversal.resetVisitCount();
console.log('Preorder (Iterative):', traversal.preorderIterative(root)); // [1, 2, 4, 5, 3]

// Tree operations
const copiedTree = traversal.copyTree(root);
console.log('Tree copied successfully');

const serialized = traversal.serialize(root);
console.log('Serialized tree:', serialized);

console.log('Has path sum 7:', traversal.hasPathSum(root, 7)); // true (1->2->4)`,
    quizQuestions: [
      {
        question: "In which order does preorder traversal visit nodes?",
        options: ["Left, Root, Right", "Root, Left, Right", "Left, Right, Root", "Right, Root, Left"],
        correctAnswer: 1,
        explanation: "Preorder traversal visits nodes in Root-Left-Right order, processing the parent node before its children."
      },
      {
        question: "Why is preorder traversal ideal for tree copying operations?",
        options: ["It uses less memory", "It's faster than other traversals", "It processes parent before children", "It handles null nodes better"],
        correctAnswer: 2,
        explanation: "Preorder traversal processes the parent node first, which is essential for tree copying since you must create the parent node before you can attach children to it."
      },
      {
        question: "What type of notation does preorder traversal produce for expression trees?",
        options: ["Infix notation", "Postfix notation (Reverse Polish)", "Prefix notation (Polish)", "Binary notation"],
        correctAnswer: 2,
        explanation: "Preorder traversal of expression trees produces prefix notation (Polish notation), where operators come before their operands."
      },
      {
        question: "In the iterative implementation of preorder traversal, why do we push the right child before the left child?",
        options: ["Right child has higher priority", "To maintain left-to-right processing order", "To save memory", "It's a programming convention"],
        correctAnswer: 1,
        explanation: "We push the right child first because stacks are LIFO (Last In, First Out). By pushing right first, then left, we ensure the left child is processed before the right child."
      },
      {
        question: "What is a common real-world application of preorder traversal?",
        options: ["Sorting tree elements", "Finding the shortest path", "File system directory listing", "Binary search in trees"],
        correctAnswer: 2,
        explanation: "Preorder traversal is commonly used for file system directory listing, where you list the directory name first, then its contents, maintaining the hierarchical structure."
      }
    ]
  },
  {
    id: 'tree-postorder-traversal',
    title: 'Postorder Traversal',
    description: 'Left-Right-Root traversal for bottom-up tree processing',
    category: 'Trees',
    difficulty: 'intermediate',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)',
    extendedDefinition: `Postorder Traversal is a depth-first tree traversal method that visits nodes in the order: Left subtree → Right subtree → Root. This "children-first" approach ensures that all descendants are processed before their parent, making it essential for operations requiring bottom-up computation.

What it does: visits tree nodes in left-right-root order, processing children before their parent node.

How it works: recursively traverses left subtree, then right subtree, finally processes current node ensuring bottom-up computation.

When to use: safe tree deletion, directory size calculation, expression evaluation, dependency resolution, cleanup operations.`,
    voiceExplanation: `Think of postorder traversal like being a responsible parent cleaning up after your children. Imagine you're organizing a messy house where each room has smaller rooms inside it. In postorder traversal, you always clean up the smallest rooms first, then work your way up to the bigger rooms, and finally clean the main room. This is exactly how postorder works with trees - it visits the left child, then the right child, and only then processes the parent node. This approach is perfect for situations where you need to gather information from children before making decisions about the parent, like calculating the total size of a folder by first calculating the sizes of all files and subfolders inside it. It's also essential for safely deleting tree structures because you must delete all children before deleting the parent to avoid memory leaks.`,
    realWorldApplications: `**Industry Applications:**
- **File Systems**: Calculate directory sizes by summing file sizes bottom-up
- **Compiler Design**: Generate postfix notation for expression evaluation
- **Database Systems**: Process query execution plans from leaves to root
- **Operating Systems**: Process termination and resource cleanup
- **Memory Management**: Safe deletion of tree structures and garbage collection
- **Game Development**: Scene graph cleanup and resource deallocation
- **Mathematical Computing**: Expression tree evaluation in calculators
- **Network Protocols**: Tree-based routing table cleanup
- **Data Compression**: Huffman tree construction and cleanup
- **Graphics Rendering**: Scene hierarchy processing and cleanup`,
    example: `// Postorder Traversal (Left, Right, Root)
function postorderTraversal(root) {
    const result = [];
    
    function postorder(node) {
        if (node) {
            postorder(node.left);   // Visit left subtree
            postorder(node.right);  // Visit right subtree
            result.push(node.val);  // Process current node last
        }
    }
    
    postorder(root);
    return result;
}

// Iterative Postorder Traversal (Two Stacks)
function postorderIterative(root) {
    if (!root) return [];
    
    const stack1 = [root], stack2 = [], result = [];
    
    while (stack1.length > 0) {
        const node = stack1.pop();
        stack2.push(node);
        
        if (node.left) stack1.push(node.left);
        if (node.right) stack1.push(node.right);
    }
    
    while (stack2.length > 0) {
        result.push(stack2.pop().val);
    }
    
    return result;
}

// Example: Tree [1, 2, 3, 4, 5] gives [4, 5, 2, 3, 1]`,
    syntax: `**Postorder Traversal Patterns:**

1. **Recursive Postorder:**
   \`\`\`javascript
   function postorder(root) {
       if (!root) return;
       postorder(root.left);
       postorder(root.right);
       console.log(root.val);  // Process root last
   }
   \`\`\`

2. **Iterative Postorder (Two Stacks):**
   \`\`\`javascript
   function postorderIterative(root) {
       if (!root) return [];
       const stack1 = [root], stack2 = [];
       while (stack1.length) {
           const node = stack1.pop();
           stack2.push(node);
           if (node.left) stack1.push(node.left);
           if (node.right) stack1.push(node.right);
       }
       return stack2.reverse().map(node => node.val);
   }
   \`\`\``,
    voiceExplanation: `Think of postorder traversal like being a responsible parent cleaning up after a big family gathering! Imagine you're in charge of cleaning up a house where every room has smaller rooms inside it. As a responsible parent, you can't clean a room until all the smaller rooms inside it are completely clean first. So you start with the tiniest rooms (the leaves), clean them thoroughly, then move to slightly bigger rooms, and finally clean the main room. This is exactly how postorder traversal works! You visit the left child's house, clean it completely, then visit the right child's house and clean it completely, and only then do you clean the parent's room. This approach is perfect when you need to make sure all the "children" are taken care of before you handle the "parent" - like calculating the total size of a folder by first calculating the sizes of all files and subfolders inside it, or safely deleting a directory by first deleting all its contents!`
  },

  // Graphs
  {
    id: 'graph-dfs',
    title: 'Depth First Search',
    description: 'Graph traversal using DFS with recursive and iterative approaches',
    category: 'Graphs',
    difficulty: 'intermediate',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    extendedDefinition: `Depth First Search (DFS) is a fundamental graph traversal algorithm that explores as far as possible along each branch before backtracking. It uses a stack-based approach (either explicit stack or recursion stack) to systematically visit all vertices in a graph.

What it does: explores graph by going as deep as possible along each branch before backtracking to explore other branches.

How it works: uses stack (recursion or explicit) to remember vertices, marks visited nodes, backtracks when no unvisited neighbors remain.

When to use: path finding, cycle detection, topological sorting, connected components, maze solving, tree traversals.`,
    voiceExplanation: `Imagine you're exploring a maze, and you have a simple strategy: always go as deep as possible before turning back. You start at the entrance and pick a path. You keep following that path, making turns when you hit dead ends, always trying to go deeper into the maze. Only when you've exhausted all possibilities in one direction do you backtrack and try a different route. This is exactly how Depth First Search works! It's like having a ball of yarn - you unroll it as you go deeper, and when you hit a dead end, you follow the yarn back to the last intersection and try a different path. DFS is perfect for exploring all possibilities systematically, finding paths between locations, or checking if you can reach a destination. It's the algorithm equivalent of being a thorough explorer who never gives up until every path has been investigated.`,
    realWorldApplications: `**Industry Applications:**
- **Web Crawling**: Search engines traversing web pages and links
- **Social Networks**: Finding connections, friend recommendations, influence analysis
- **Compiler Design**: Syntax analysis, dependency resolution, dead code elimination
- **Game Development**: AI pathfinding, game tree search, puzzle solving
- **Network Analysis**: Topology discovery, routing protocols, network security
- **File Systems**: Directory traversal, file search, backup systems
- **Database Systems**: Query optimization, constraint checking, transaction management
- **Bioinformatics**: Protein interaction networks, gene regulatory networks
- **Circuit Design**: Electronic circuit analysis, fault detection, optimization
- **Project Management**: Task dependency analysis, critical path identification`,
    keyConcepts: `**Essential Concepts:**
1. **Visited Tracking**: Preventing infinite loops by marking visited vertices
2. **Recursion Stack**: Understanding the implicit stack in recursive DFS
3. **Backtracking**: Returning to previous vertices when no unvisited neighbors exist
4. **Graph Representation**: Adjacency list vs. adjacency matrix implications
5. **Connected Components**: Using DFS to find separate graph components
6. **Cycle Detection**: Identifying back edges that create cycles
7. **Topological Ordering**: DFS-based algorithm for DAG vertex ordering
8. **Time Complexity**: O(V + E) where V is vertices and E is edges`,
    pseudocode: `**Depth First Search Pseudocode:**

ALGORITHM DFS(graph, startVertex)
INPUT: graph representation, starting vertex
OUTPUT: DFS traversal order
BEGIN
    visited = new Set()
    result = []
    
    DFSRecursive(startVertex, visited, result, graph)
    
    RETURN result
END

ALGORITHM DFSRecursive(vertex, visited, result, graph)
INPUT: current vertex, visited set, result array, graph
BEGIN
    // Mark current vertex as visited
    visited.add(vertex)
    result.add(vertex)
    
    // Visit all unvisited adjacent vertices
    FOR each neighbor IN graph.adjacentVertices(vertex) DO
        IF neighbor NOT IN visited THEN
            DFSRecursive(neighbor, visited, result, graph)
        END IF
    END FOR
END

ALGORITHM DFSIterative(graph, startVertex)
INPUT: graph representation, starting vertex
OUTPUT: DFS traversal order
BEGIN
    visited = new Set()
    result = []
    stack = new Stack()
    
    stack.push(startVertex)
    
    WHILE NOT stack.isEmpty() DO
        vertex = stack.pop()
        
        IF vertex NOT IN visited THEN
            visited.add(vertex)
            result.add(vertex)
            
            // Add all unvisited neighbors to stack
            FOR each neighbor IN graph.adjacentVertices(vertex) DO
                IF neighbor NOT IN visited THEN
                    stack.push(neighbor)
                END IF
            END FOR
        END IF
    END WHILE
    
    RETURN result
END`,
    implementationCode: `// Comprehensive Depth First Search Implementation

class Graph {
    constructor(isDirected = false) {
        this.adjacencyList = new Map();
        this.isDirected = isDirected;
    }
    
    // Add vertex to graph
    addVertex(vertex) {
        if (!this.adjacencyList.has(vertex)) {
            this.adjacencyList.set(vertex, []);
        }
    }
    
    // Add edge between vertices
    addEdge(vertex1, vertex2) {
        this.addVertex(vertex1);
        this.addVertex(vertex2);
        
        this.adjacencyList.get(vertex1).push(vertex2);
        
        // For undirected graphs, add edge in both directions
        if (!this.isDirected) {
            this.adjacencyList.get(vertex2).push(vertex1);
        }
    }
    
    // Get all vertices
    getVertices() {
        return Array.from(this.adjacencyList.keys());
    }
    
    // Get neighbors of a vertex
    getNeighbors(vertex) {
        return this.adjacencyList.get(vertex) || [];
    }
}

class DepthFirstSearch {
    constructor(graph) {
        this.graph = graph;
    }
    
    // Recursive DFS traversal
    dfsRecursive(startVertex) {
        const visited = new Set();
        const result = [];
        
        this._dfsRecursiveHelper(startVertex, visited, result);
        
        return result;
    }
    
    _dfsRecursiveHelper(vertex, visited, result) {
        // Mark current vertex as visited
        visited.add(vertex);
        result.push(vertex);
        
        // Visit all unvisited neighbors
        const neighbors = this.graph.getNeighbors(vertex);
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                this._dfsRecursiveHelper(neighbor, visited, result);
            }
        }
    }
    
    // Iterative DFS traversal using explicit stack
    dfsIterative(startVertex) {
        const visited = new Set();
        const result = [];
        const stack = [startVertex];
        
        while (stack.length > 0) {
            const vertex = stack.pop();
            
            if (!visited.has(vertex)) {
                visited.add(vertex);
                result.push(vertex);
                
                // Add all unvisited neighbors to stack (in reverse order for consistent traversal)
                const neighbors = this.graph.getNeighbors(vertex);
                for (let i = neighbors.length - 1; i >= 0; i--) {
                    if (!visited.has(neighbors[i])) {
                        stack.push(neighbors[i]);
                    }
                }
            }
        }
        
        return result;
    }
    
    // Find all connected components using DFS
    findConnectedComponents() {
        const visited = new Set();
        const components = [];
        
        for (const vertex of this.graph.getVertices()) {
            if (!visited.has(vertex)) {
                const component = [];
                this._dfsComponentHelper(vertex, visited, component);
                components.push(component);
            }
        }
        
        return components;
    }
    
    _dfsComponentHelper(vertex, visited, component) {
        visited.add(vertex);
        component.push(vertex);
        
        for (const neighbor of this.graph.getNeighbors(vertex)) {
            if (!visited.has(neighbor)) {
                this._dfsComponentHelper(neighbor, visited, component);
            }
        }
    }
    
    // Check if path exists between two vertices
    hasPath(startVertex, endVertex) {
        const visited = new Set();
        return this._hasPathHelper(startVertex, endVertex, visited);
    }
    
    _hasPathHelper(currentVertex, endVertex, visited) {
        if (currentVertex === endVertex) {
            return true;
        }
        
        visited.add(currentVertex);
        
        for (const neighbor of this.graph.getNeighbors(currentVertex)) {
            if (!visited.has(neighbor)) {
                if (this._hasPathHelper(neighbor, endVertex, visited)) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    // Find a path between two vertices
    findPath(startVertex, endVertex) {
        const visited = new Set();
        const path = [];
        
        if (this._findPathHelper(startVertex, endVertex, visited, path)) {
            return path;
        }
        
        return null; // No path found
    }
    
    _findPathHelper(currentVertex, endVertex, visited, path) {
        visited.add(currentVertex);
        path.push(currentVertex);
        
        if (currentVertex === endVertex) {
            return true;
        }
        
        for (const neighbor of this.graph.getNeighbors(currentVertex)) {
            if (!visited.has(neighbor)) {
                if (this._findPathHelper(neighbor, endVertex, visited, path)) {
                    return true;
                }
            }
        }
        
        path.pop(); // Backtrack
        return false;
    }
    
    // Detect cycle in undirected graph
    hasCycleUndirected() {
        const visited = new Set();
        
        for (const vertex of this.graph.getVertices()) {
            if (!visited.has(vertex)) {
                if (this._hasCycleUndirectedHelper(vertex, -1, visited)) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    _hasCycleUndirectedHelper(vertex, parent, visited) {
        visited.add(vertex);
        
        for (const neighbor of this.graph.getNeighbors(vertex)) {
            if (!visited.has(neighbor)) {
                if (this._hasCycleUndirectedHelper(neighbor, vertex, visited)) {
                    return true;
                }
            } else if (neighbor !== parent) {
                return true; // Back edge found
            }
        }
        
        return false;
    }
    
    // Detect cycle in directed graph
    hasCycleDirected() {
        const visited = new Set();
        const recursionStack = new Set();
        
        for (const vertex of this.graph.getVertices()) {
            if (!visited.has(vertex)) {
                if (this._hasCycleDirectedHelper(vertex, visited, recursionStack)) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    _hasCycleDirectedHelper(vertex, visited, recursionStack) {
        visited.add(vertex);
        recursionStack.add(vertex);
        
        for (const neighbor of this.graph.getNeighbors(vertex)) {
            if (!visited.has(neighbor)) {
                if (this._hasCycleDirectedHelper(neighbor, visited, recursionStack)) {
                    return true;
                }
            } else if (recursionStack.has(neighbor)) {
                return true; // Back edge in recursion stack
            }
        }
        
        recursionStack.delete(vertex);
        return false;
    }
    
    // Topological sort using DFS (for DAGs)
    topologicalSort() {
        const visited = new Set();
        const stack = [];
        
        for (const vertex of this.graph.getVertices()) {
            if (!visited.has(vertex)) {
                this._topologicalSortHelper(vertex, visited, stack);
            }
        }
        
        return stack.reverse();
    }
    
    _topologicalSortHelper(vertex, visited, stack) {
        visited.add(vertex);
        
        for (const neighbor of this.graph.getNeighbors(vertex)) {
            if (!visited.has(neighbor)) {
                this._topologicalSortHelper(neighbor, visited, stack);
            }
        }
        
        stack.push(vertex);
    }
}

// Usage Examples
const graph = new Graph();

// Add vertices and edges
graph.addEdge('A', 'B');
graph.addEdge('A', 'C');
graph.addEdge('B', 'D');
graph.addEdge('C', 'E');
graph.addEdge('D', 'F');
graph.addEdge('E', 'F');

const dfs = new DepthFirstSearch(graph);

console.log("DFS Recursive:", dfs.dfsRecursive('A')); // ['A', 'B', 'D', 'F', 'C', 'E']
console.log("DFS Iterative:", dfs.dfsIterative('A')); // ['A', 'C', 'E', 'F', 'B', 'D']
console.log("Has path A to F:", dfs.hasPath('A', 'F')); // true
console.log("Path A to F:", dfs.findPath('A', 'F')); // ['A', 'B', 'D', 'F']
console.log("Connected Components:", dfs.findConnectedComponents());`,
    example: `// Simple DFS Implementation
function dfs(graph, start, visited = new Set()) {
    visited.add(start);
    console.log(start); // Process vertex
    
    for (const neighbor of graph[start] || []) {
        if (!visited.has(neighbor)) {
            dfs(graph, neighbor, visited);
        }
    }
}

// Example usage
const graph = {
    'A': ['B', 'C'],
    'B': ['D'],
    'C': ['E'],
    'D': ['F'],
    'E': ['F'],
    'F': []
};

dfs(graph, 'A'); // Output: A B D F C E`
  },
  {
    id: 'graph-bfs',
    title: 'Breadth First Search',
    description: 'Level-order graph traversal using BFS with queue implementation',
    category: 'Graphs',
    difficulty: 'intermediate',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    extendedDefinition: `Breadth-First Search (BFS) is a fundamental graph traversal algorithm that explores vertices level by level, visiting all vertices at distance k before visiting any vertex at distance k+1 from the starting vertex. It uses a queue data structure to maintain the order of exploration.

What it does: explores graph vertices level by level using queue, guaranteeing shortest path discovery in unweighted graphs.

How it works: starts from source vertex, adds neighbors to queue, processes vertices in FIFO order until all reachable vertices are visited.

When to use: shortest path in unweighted graphs, level-order traversal, connected components, social network analysis.`,
    example: `// BFS Implementation for Graph
function bfs(graph, start) {
    const visited = new Set();
    const queue = [start];
    const result = [];
    
    visited.add(start);
    
    while (queue.length > 0) {
        const vertex = queue.shift();
        result.push(vertex);
        
        // Visit all unvisited neighbors
        for (const neighbor of graph[vertex] || []) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
            }
        }
    }
    
    return result;
}

// BFS for Shortest Path (unweighted graph)
function shortestPath(graph, start, end) {
    const queue = [[start, [start]]];
    const visited = new Set([start]);
    
    while (queue.length > 0) {
        const [vertex, path] = queue.shift();
        
        if (vertex === end) {
            return path;
        }
        
        for (const neighbor of graph[vertex] || []) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push([neighbor, [...path, neighbor]]);
            }
        }
    }
    
    return null; // No path found
}

// Example usage:
// graph = {0: [1, 2], 1: [0, 3], 2: [0, 4], 3: [1], 4: [2]}
// bfs(graph, 0) returns [0, 1, 2, 3, 4]`,
    syntax: `**BFS Patterns:**

1. **Basic BFS Traversal:**
   \`\`\`javascript
   function bfs(graph, start) {
       const visited = new Set(), queue = [start];
       visited.add(start);
       
       while (queue.length > 0) {
           const vertex = queue.shift();
           console.log(vertex);
           
           for (const neighbor of graph[vertex]) {
               if (!visited.has(neighbor)) {
                   visited.add(neighbor);
                   queue.push(neighbor);
               }
           }
       }
   }
   \`\`\`

2. **BFS with Level Tracking:**
   \`\`\`javascript
   function bfsLevels(graph, start) {
       const queue = [[start, 0]], visited = new Set([start]);
       
       while (queue.length > 0) {
           const [vertex, level] = queue.shift();
           console.log(\`Vertex \${vertex} at level \${level}\`);
           
           for (const neighbor of graph[vertex]) {
               if (!visited.has(neighbor)) {
                   visited.add(neighbor);
                   queue.push([neighbor, level + 1]);
               }
           }
       }
   }
   \`\`\``
  },
  {
    id: 'dijkstra-algorithm',
    title: 'Dijkstra\'s Algorithm',
    description: 'Shortest path algorithm for weighted graphs with non-negative edges',
    category: 'Graphs',
    difficulty: 'advanced',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    extendedDefinition: `Dijkstra's Algorithm is a graph traversal algorithm that finds the shortest path from a source vertex to all other vertices in a weighted graph with non-negative edge weights. It uses a greedy approach, always selecting the unvisited vertex with the smallest known distance.

What it does: finds shortest paths from source vertex to all other vertices in weighted graph with non-negative edges.

How it works: uses greedy approach with priority queue, always selecting closest unvisited vertex and relaxing edge weights to update distances.

When to use: GPS navigation, network routing, social networks, game pathfinding, any shortest path problems with non-negative weights.`,
    voiceExplanation: `Think of Dijkstra's algorithm like a delivery driver with a GPS who's incredibly methodical! Imagine you're a delivery driver starting from your depot, and you need to find the shortest route to every address in the city. You have a GPS that shows you the distance to nearby locations, but you can only see one step ahead. Here's how you'd work: First, you mark your starting depot as "visited" with distance 0. Then you look at all the places you can directly reach from the depot and note their distances. You pick the closest unvisited location and drive there - this becomes your new "known shortest path." From this new location, you update your GPS with any shorter routes you've discovered to other places. You keep repeating this process: always go to the closest unvisited location, update your route information, and mark that location as "fully explored." By the time you've visited everywhere, you'll have found the shortest route from your depot to every single address in the city! That's exactly how Dijkstra's algorithm works - it's like having the most efficient GPS system that guarantees the shortest path.`,
    realWorldApplications: `**Industry Applications:**
- **GPS Navigation Systems**: Route planning and real-time traffic optimization
- **Network Routing Protocols**: Internet packet routing (OSPF, IS-IS protocols)
- **Social Networks**: Finding degrees of separation, friend recommendations
- **Game Development**: AI pathfinding, NPC movement optimization
- **Supply Chain Management**: Logistics optimization, delivery route planning
- **Telecommunications**: Network topology optimization, call routing
- **Flight Planning**: Airline route optimization, fuel-efficient flight paths
- **Urban Planning**: Public transportation route design, emergency services
- **Financial Networks**: Currency exchange rate optimization, arbitrage detection
- **Robotics**: Robot navigation, autonomous vehicle path planning`,
    keyConcepts: `**Essential Concepts:**
1. **Greedy Strategy**: Always choose the vertex with minimum distance from unvisited set
2. **Relaxation**: Update distance if a shorter path is found through current vertex
3. **Priority Queue**: Efficiently extract minimum distance vertex (Min-Heap)
4. **Single Source**: Finds shortest paths from one source to all other vertices
5. **Non-negative Weights**: Algorithm fails with negative edge weights
6. **Optimal Substructure**: Shortest path contains shortest subpaths
7. **Distance Array**: Maintains shortest known distance to each vertex
8. **Path Reconstruction**: Use previous array to trace back actual shortest paths`,
    pseudocode: `**Dijkstra's Algorithm Pseudocode:**

ALGORITHM Dijkstra(Graph G, Vertex source)
INPUT: G - weighted graph with non-negative edges, source - starting vertex
OUTPUT: distance array with shortest distances, previous array for path reconstruction
BEGIN
    // Initialize distances and previous vertices
    FOR each vertex v in G DO
        distance[v] = INFINITY
        previous[v] = NULL
        visited[v] = FALSE
    END FOR
    
    distance[source] = 0
    CREATE priority_queue Q with all vertices (keyed by distance)
    
    WHILE Q is not empty DO
        current = EXTRACT_MIN(Q)  // Vertex with minimum distance
        visited[current] = TRUE
        
        FOR each neighbor v of current DO
            IF NOT visited[v] THEN
                alt = distance[current] + weight(current, v)
                IF alt < distance[v] THEN
                    distance[v] = alt
                    previous[v] = current
                    DECREASE_KEY(Q, v, alt)  // Update priority in queue
                END IF
            END IF
        END FOR
    END WHILE
    
    RETURN distance, previous
END

ALGORITHM ReconstructPath(previous, source, target)
INPUT: previous array, source vertex, target vertex
OUTPUT: shortest path from source to target
BEGIN
    path = []
    current = target
    
    WHILE current ≠ NULL DO
        path.PREPEND(current)
        current = previous[current]
    END WHILE
    
    IF path[0] = source THEN
        RETURN path
    ELSE
        RETURN "No path exists"
    END IF
END`,
    implementationCode: `// Comprehensive Dijkstra's Algorithm Implementation

class MinHeap {
    constructor() {
        this.heap = [];
        this.positions = new Map(); // Track positions for decrease-key operation
    }
    
    insert(vertex, distance) {
        const node = { vertex, distance };
        this.heap.push(node);
        this.positions.set(vertex, this.heap.length - 1);
        this.heapifyUp(this.heap.length - 1);
    }
    
    extractMin() {
        if (this.heap.length === 0) return null;
        
        const min = this.heap[0];
        const last = this.heap.pop();
        this.positions.delete(min.vertex);
        
        if (this.heap.length > 0) {
            this.heap[0] = last;
            this.positions.set(last.vertex, 0);
            this.heapifyDown(0);
        }
        
        return min;
    }
    
    decreaseKey(vertex, newDistance) {
        const pos = this.positions.get(vertex);
        if (pos === undefined) return;
        
        this.heap[pos].distance = newDistance;
        this.heapifyUp(pos);
    }
    
    heapifyUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.heap[parentIndex].distance <= this.heap[index].distance) break;
            
            this.swap(parentIndex, index);
            index = parentIndex;
        }
    }
    
    heapifyDown(index) {
        while (true) {
            let minIndex = index;
            const leftChild = 2 * index + 1;
            const rightChild = 2 * index + 2;
            
            if (leftChild < this.heap.length && 
                this.heap[leftChild].distance < this.heap[minIndex].distance) {
                minIndex = leftChild;
            }
            
            if (rightChild < this.heap.length && 
                this.heap[rightChild].distance < this.heap[minIndex].distance) {
                minIndex = rightChild;
            }
            
            if (minIndex === index) break;
            
            this.swap(index, minIndex);
            index = minIndex;
        }
    }
    
    swap(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
        this.positions.set(this.heap[i].vertex, i);
        this.positions.set(this.heap[j].vertex, j);
    }
    
    isEmpty() {
        return this.heap.length === 0;
    }
}

class WeightedGraph {
    constructor() {
        this.adjacencyList = new Map();
    }
    
    addVertex(vertex) {
        if (!this.adjacencyList.has(vertex)) {
            this.adjacencyList.set(vertex, []);
        }
    }
    
    addEdge(vertex1, vertex2, weight) {
        this.addVertex(vertex1);
        this.addVertex(vertex2);
        
        this.adjacencyList.get(vertex1).push({ vertex: vertex2, weight });
        // For undirected graph, add reverse edge
        this.adjacencyList.get(vertex2).push({ vertex: vertex1, weight });
    }
    
    dijkstra(source) {
        const distances = new Map();
        const previous = new Map();
        const visited = new Set();
        const pq = new MinHeap();
        
        // Initialize distances
        for (const vertex of this.adjacencyList.keys()) {
            distances.set(vertex, vertex === source ? 0 : Infinity);
            previous.set(vertex, null);
            pq.insert(vertex, distances.get(vertex));
        }
        
        while (!pq.isEmpty()) {
            const { vertex: current } = pq.extractMin();
            
            if (visited.has(current)) continue;
            visited.add(current);
            
            // Examine neighbors
            for (const { vertex: neighbor, weight } of this.adjacencyList.get(current) || []) {
                if (visited.has(neighbor)) continue;
                
                const altDistance = distances.get(current) + weight;
                
                if (altDistance < distances.get(neighbor)) {
                    distances.set(neighbor, altDistance);
                    previous.set(neighbor, current);
                    pq.decreaseKey(neighbor, altDistance);
                }
            }
        }
        
        return { distances, previous };
    }
    
    getShortestPath(source, target) {
        const { distances, previous } = this.dijkstra(source);
        
        if (distances.get(target) === Infinity) {
            return { path: null, distance: Infinity };
        }
        
        const path = [];
        let current = target;
        
        while (current !== null) {
            path.unshift(current);
            current = previous.get(current);
        }
        
        return { path, distance: distances.get(target) };
    }
    
    getAllShortestPaths(source) {
        const { distances, previous } = this.dijkstra(source);
        const paths = new Map();
        
        for (const vertex of this.adjacencyList.keys()) {
            if (vertex === source) {
                paths.set(vertex, { path: [source], distance: 0 });
                continue;
            }
            
            if (distances.get(vertex) === Infinity) {
                paths.set(vertex, { path: null, distance: Infinity });
                continue;
            }
            
            const path = [];
            let current = vertex;
            
            while (current !== null) {
                path.unshift(current);
                current = previous.get(current);
            }
            
            paths.set(vertex, { path, distance: distances.get(vertex) });
        }
        
        return paths;
    }
}

// Usage Examples
console.log('=== Dijkstra\'s Algorithm Examples ===');

const graph = new WeightedGraph();

// Build sample graph
graph.addEdge('A', 'B', 4);
graph.addEdge('A', 'C', 2);
graph.addEdge('B', 'C', 1);
graph.addEdge('B', 'D', 5);
graph.addEdge('C', 'D', 8);
graph.addEdge('C', 'E', 10);
graph.addEdge('D', 'E', 2);

// Find shortest path from A to E
const result = graph.getShortestPath('A', 'E');
console.log('Shortest path from A to E:', result.path); // ['A', 'C', 'B', 'D', 'E']
console.log('Distance:', result.distance); // 12

// Get all shortest paths from A
const allPaths = graph.getAllShortestPaths('A');
console.log('\\nAll shortest paths from A:');
for (const [vertex, info] of allPaths) {
    console.log(\`To \${vertex}: \${info.path ? info.path.join(' -> ') : 'No path'} (distance: \${info.distance})\`);
}`,
    quizQuestions: [
      {
        question: "What is the key requirement for Dijkstra's algorithm to work correctly?",
        options: ["Graph must be connected", "Graph must have non-negative edge weights", "Graph must be acyclic", "Graph must be undirected"],
        correctAnswer: 1,
        explanation: "Dijkstra's algorithm requires non-negative edge weights. Negative weights can cause the algorithm to produce incorrect results because it assumes that once a vertex is visited, the shortest path to it has been found."
      },
      {
        question: "What data structure is typically used to efficiently implement Dijkstra's algorithm?",
        options: ["Stack", "Queue", "Priority Queue (Min-Heap)", "Hash Table"],
        correctAnswer: 2,
        explanation: "A priority queue (min-heap) is used to efficiently extract the unvisited vertex with the minimum distance, which is crucial for the algorithm's performance."
      },
      {
        question: "What is the time complexity of Dijkstra's algorithm using a binary heap?",
        options: ["O(V²)", "O(E log V)", "O((V + E) log V)", "O(VE)"],
        correctAnswer: 2,
        explanation: "Using a binary heap, Dijkstra's algorithm has O((V + E) log V) time complexity: O(V log V) for extract-min operations and O(E log V) for decrease-key operations."
      },
      {
        question: "What happens when Dijkstra's algorithm encounters a negative edge weight?",
        options: ["It automatically handles it correctly", "It produces incorrect shortest paths", "It throws an error", "It ignores the negative edge"],
        correctAnswer: 1,
        explanation: "Dijkstra's algorithm can produce incorrect results with negative edge weights because it assumes that once a vertex is processed, no shorter path to it can be found later."
      },
      {
        question: "What is the purpose of the 'relaxation' step in Dijkstra's algorithm?",
        options: ["To remove vertices from the graph", "To update distances if a shorter path is found", "To add new edges to the graph", "To mark vertices as visited"],
        correctAnswer: 1,
        explanation: "Relaxation updates the distance to a vertex if a shorter path is discovered through the current vertex, ensuring that we always maintain the shortest known distance to each vertex."
      }
    ]
  },
  {
    id: 'bellman-ford',
    title: 'Bellman-Ford Algorithm',
    description: 'Shortest path algorithm that handles negative edge weights',
    category: 'Graphs',
    difficulty: 'advanced',
    timeComplexity: 'O(VE)',
    spaceComplexity: 'O(V)',
    extendedDefinition: `The Bellman-Ford Algorithm is a single-source shortest path algorithm that can handle graphs with negative edge weights, unlike Dijkstra's algorithm. It works by relaxing all edges repeatedly and can detect negative weight cycles in the graph.

What it does: finds shortest paths from single source to all vertices, handles negative edge weights and detects negative cycles.

How it works: relaxes all edges V-1 times, then checks for negative cycles by attempting one more relaxation round.

When to use: graphs with negative edge weights, currency exchange rates, detecting negative cycles, when Dijkstra cannot be used.`,
    example: `// Bellman-Ford Algorithm Implementation
function bellmanFord(graph, source) {
    const V = graph.vertices;
    const distances = new Array(V).fill(Infinity);
    distances[source] = 0;
    
    // Relax all edges V-1 times
    for (let i = 0; i < V - 1; i++) {
        for (let edge of graph.edges) {
            const { from, to, weight } = edge;
            if (distances[from] !== Infinity && 
                distances[from] + weight < distances[to]) {
                distances[to] = distances[from] + weight;
            }
        }
    }
    
    // Check for negative cycles
    for (let edge of graph.edges) {
        const { from, to, weight } = edge;
        if (distances[from] !== Infinity && 
            distances[from] + weight < distances[to]) {
            return { hasNegativeCycle: true, distances: null };
        }
    }
    
    return { hasNegativeCycle: false, distances };
}

// Example usage
const graph = {
    vertices: 5,
    edges: [
        { from: 0, to: 1, weight: -1 },
        { from: 0, to: 2, weight: 4 },
        { from: 1, to: 2, weight: 3 },
        { from: 1, to: 3, weight: 2 },
        { from: 3, to: 4, weight: -3 }
    ]
};

const result = bellmanFord(graph, 0);
console.log(result.distances); // [0, -1, 2, 1, -2]`
  },
  {
    id: 'floyd-warshall',
    title: 'Floyd-Warshall Algorithm',
    description: 'All-pairs shortest path algorithm using dynamic programming',
    category: 'Graphs',
    difficulty: 'advanced',
    timeComplexity: 'O(VÃ‚Â³)',
    spaceComplexity: 'O(VÃ‚Â²)',
    extendedDefinition: `The Floyd-Warshall Algorithm is a dynamic programming algorithm that finds the shortest paths between all pairs of vertices in a weighted graph. It can handle both positive and negative edge weights (but not negative cycles) and works on both directed and undirected graphs.

What it does: finds shortest paths between all pairs of vertices using dynamic programming with intermediate vertices.

How it works: uses three nested loops to consider each vertex as intermediate point, updating distances if shorter path found.

When to use: dense graphs, all-pairs shortest paths needed, transitive closure, small to medium graphs where O(V³) is acceptable.`,
    example: `// Floyd-Warshall Algorithm Implementation
function floydWarshall(graph) {
    const V = graph.length;
    const dist = Array(V).fill().map(() => Array(V).fill(Infinity));
    
    // Initialize distances
    for (let i = 0; i < V; i++) {
        for (let j = 0; j < V; j++) {
            if (i === j) {
                dist[i][j] = 0;
            } else if (graph[i][j] !== 0) {
                dist[i][j] = graph[i][j];
            }
        }
    }
    
    // Main Floyd-Warshall algorithm
    for (let k = 0; k < V; k++) {
        for (let i = 0; i < V; i++) {
            for (let j = 0; j < V; j++) {
                if (dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                }
            }
        }
    }
    
    return dist;
}

// Example usage
const graph = [
    [0, 3, Infinity, 5],
    [2, 0, Infinity, 4],
    [Infinity, 1, 0, Infinity],
    [Infinity, Infinity, 2, 0]
];

const shortestPaths = floydWarshall(graph);
console.log(shortestPaths);
// Result: All-pairs shortest distances matrix`,
  },
  {
    id: 'kruskal-algorithm',
    title: 'Kruskal\'s Algorithm',
    description: 'Build MST by adding cheapest edges that don\'t create cycles - edge-focused approach',
    category: 'Graphs',
    difficulty: 'intermediate',
    timeComplexity: 'O(E log E)',
    spaceComplexity: 'O(V)',
    extendedDefinition: `Kruskal's Algorithm is a greedy algorithm that finds the Minimum Spanning Tree (MST) of a connected, undirected graph by selecting edges in order of increasing weight while avoiding cycles. It uses a Union-Find data structure to efficiently detect cycles.

What it does: builds minimum spanning tree by selecting cheapest edges that don't create cycles using Union-Find structure.

How it works: sorts all edges by weight, iteratively adds cheapest edge that doesn't form cycle until MST is complete.

When to use: sparse graphs, network design, clustering problems, when edge-focused MST approach is preferred over vertex-focused.`,
    example: `// Kruskal's Algorithm Implementation
class UnionFind {
    constructor(n) {
        this.parent = Array.from({length: n}, (_, i) => i);
        this.rank = new Array(n).fill(0);
    }
    
    find(x) {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]); // Path compression
        }
        return this.parent[x];
    }
    
    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);
        
        if (rootX !== rootY) {
            // Union by rank
            if (this.rank[rootX] < this.rank[rootY]) {
                this.parent[rootX] = rootY;
            } else if (this.rank[rootX] > this.rank[rootY]) {
                this.parent[rootY] = rootX;
            } else {
                this.parent[rootY] = rootX;
                this.rank[rootX]++;
            }
            return true;
        }
        return false;
    }
}

function kruskalMST(vertices, edges) {
    // Sort edges by weight
    edges.sort((a, b) => a.weight - b.weight);
    
    const uf = new UnionFind(vertices);
    const mst = [];
    let totalWeight = 0;
    
    for (const edge of edges) {
        if (uf.union(edge.from, edge.to)) {
            mst.push(edge);
            totalWeight += edge.weight;
            
            // MST complete when we have V-1 edges
            if (mst.length === vertices - 1) break;
        }
    }
    
    return { mst, totalWeight };
}

// Example usage
const edges = [
    { from: 0, to: 1, weight: 4 },
    { from: 0, to: 2, weight: 3 },
    { from: 1, to: 2, weight: 1 },
    { from: 1, to: 3, weight: 2 },
    { from: 2, to: 3, weight: 4 }
];

const result = kruskalMST(4, edges);
console.log('MST edges:', result.mst);
console.log('Total weight:', result.totalWeight); // 6`
  },
  {
    id: 'prim-algorithm',
    title: 'Prim\'s Algorithm',
    description: 'Grow MST from starting vertex by adding minimum weight edges - vertex-focused approach',
    category: 'Graphs',
    difficulty: 'intermediate',
    timeComplexity: 'O(E log V)',
    spaceComplexity: 'O(V)',
    extendedDefinition: `Prim's Algorithm is a greedy algorithm that finds the Minimum Spanning Tree (MST) by starting from an arbitrary vertex and growing the tree by adding the minimum weight edge that connects a vertex in the MST to a vertex outside the MST.

What it does: builds minimum spanning tree by growing from starting vertex, always adding cheapest edge to new vertex.

How it works: starts with arbitrary vertex, uses priority queue to find minimum weight edge to unvisited vertex, repeats until all vertices included.

When to use: dense graphs, when vertex-focused MST approach preferred, graphs represented as adjacency matrix, when starting vertex matters.`,
    example: `// Prim's Algorithm Implementation
class PriorityQueue {
    constructor() {
        this.heap = [];
    }
    
    push(item) {
        this.heap.push(item);
        this.heapifyUp(this.heap.length - 1);
    }
    
    pop() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();
        
        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.heapifyDown(0);
        return min;
    }
    
    heapifyUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.heap[parentIndex].weight <= this.heap[index].weight) break;
            [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
            index = parentIndex;
        }
    }
    
    heapifyDown(index) {
        while (true) {
            let minIndex = index;
            const leftChild = 2 * index + 1;
            const rightChild = 2 * index + 2;
            
            if (leftChild < this.heap.length && this.heap[leftChild].weight < this.heap[minIndex].weight) {
                minIndex = leftChild;
            }
            if (rightChild < this.heap.length && this.heap[rightChild].weight < this.heap[minIndex].weight) {
                minIndex = rightChild;
            }
            
            if (minIndex === index) break;
            [this.heap[index], this.heap[minIndex]] = [this.heap[minIndex], this.heap[index]];
            index = minIndex;
        }
    }
    
    isEmpty() {
        return this.heap.length === 0;
    }
}

function primMST(graph, startVertex = 0) {
    const V = graph.length;
    const inMST = new Array(V).fill(false);
    const mst = [];
    let totalWeight = 0;
    
    const pq = new PriorityQueue();
    inMST[startVertex] = true;
    
    // Add all edges from start vertex to priority queue
    for (let i = 0; i < V; i++) {
        if (graph[startVertex][i] !== 0) {
            pq.push({ from: startVertex, to: i, weight: graph[startVertex][i] });
        }
    }
    
    while (!pq.isEmpty() && mst.length < V - 1) {
        const edge = pq.pop();
        
        if (inMST[edge.to]) continue; // Skip if vertex already in MST
        
        // Add edge to MST
        mst.push(edge);
        totalWeight += edge.weight;
        inMST[edge.to] = true;
        
        // Add all edges from new vertex to priority queue
        for (let i = 0; i < V; i++) {
            if (!inMST[i] && graph[edge.to][i] !== 0) {
                pq.push({ from: edge.to, to: i, weight: graph[edge.to][i] });
            }
        }
    }
    
    return { mst, totalWeight };
}

// Example usage
const graph = [
    [0, 2, 0, 6, 0],
    [2, 0, 3, 8, 5],
    [0, 3, 0, 0, 7],
    [6, 8, 0, 0, 9],
    [0, 5, 7, 9, 0]
];

const result = primMST(graph);
console.log('MST edges:', result.mst);
console.log('Total weight:', result.totalWeight); // 16`,
  },
  {
    id: 'topological-sort',
    title: 'Topological Sort',
    description: 'Linear ordering of vertices in directed acyclic graph',
    category: 'Graphs',
    difficulty: 'intermediate',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    extendedDefinition: `Topological Sort is a linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge (u, v), vertex u comes before vertex v in the ordering. It's only possible for DAGs and has applications in scheduling, dependency resolution, and build systems.

What it does: creates linear ordering of vertices in DAG where dependencies come before dependents in the sequence.

How it works: uses DFS with post-order traversal or Kahn's algorithm with in-degree counting to ensure dependency constraints.

When to use: task scheduling, course prerequisites, build systems, dependency resolution, compiler optimization, project planning.`,
    example: `// Topological Sort Implementation (DFS-based)
function topologicalSortDFS(graph) {
    const visited = new Set();
    const result = [];
    
    function dfs(node) {
        if (visited.has(node)) return;
        visited.add(node);
        
        // Visit all neighbors first
        for (const neighbor of graph[node] || []) {
            dfs(neighbor);
        }
        
        // Add to result after visiting all dependencies
        result.unshift(node);
    }
    
    // Visit all vertices
    for (const vertex in graph) {
        if (!visited.has(vertex)) {
            dfs(vertex);
        }
    }
    
    return result;
}

// Kahn's Algorithm Implementation
function topologicalSortKahn(graph, vertices) {
    const inDegree = new Array(vertices).fill(0);
    const result = [];
    const queue = [];
    
    // Calculate in-degrees
    for (let u = 0; u < vertices; u++) {
        for (const v of graph[u] || []) {
            inDegree[v]++;
        }
    }
    
    // Find vertices with no incoming edges
    for (let i = 0; i < vertices; i++) {
        if (inDegree[i] === 0) {
            queue.push(i);
        }
    }
    
    while (queue.length > 0) {
        const u = queue.shift();
        result.push(u);
        
        // Remove edges and update in-degrees
        for (const v of graph[u] || []) {
            inDegree[v]--;
            if (inDegree[v] === 0) {
                queue.push(v);
            }
        }
    }
    
    // Check for cycles
    if (result.length !== vertices) {
        return null; // Cycle detected
    }
    
    return result;
}

// Example usage
const graph = {
    'A': ['C'],
    'B': ['C', 'D'],
    'C': ['E'],
    'D': ['F'],
    'E': ['F'],
    'F': []
};

console.log(topologicalSortDFS(graph)); // One possible order: ['B', 'A', 'D', 'C', 'E', 'F']`
  },

  // Sorting
  {
    id: 'bubble-sort',
    title: 'Bubble Sort',
    description: 'Simple comparison-based sorting with adjacent element swapping',
    category: 'Sorting',
    difficulty: 'beginner',
    timeComplexity: 'O(nÃ‚Â²)',
    spaceComplexity: 'O(1)',
    extendedDefinition: `Bubble Sort is one of the simplest sorting algorithms that works by repeatedly stepping through the list, comparing adjacent elements and swapping them if they're in the wrong order. The algorithm gets its name because smaller elements "bubble" to the beginning of the list, just like air bubbles rising to the surface of water.

What it does: repeatedly compares adjacent elements and swaps them if out of order, making multiple passes until array is sorted.

How it works: larger elements "bubble up" to correct positions through adjacent swaps, with each pass placing one more element in final position.

When to use: educational purposes, small datasets, nearly sorted data, when simplicity is more important than efficiency.`,
    voiceExplanation: `Think of bubble sort like organizing a line of people by height, but you can only compare and swap people who are standing next to each other! Imagine you're a teacher organizing students for a class photo. You walk along the line from left to right, and whenever you see a taller person standing in front of a shorter person, you ask them to switch places. You keep doing this over and over again. After your first walk through the line, the tallest person will have "bubbled up" to the end, just like a bubble rising to the surface of water. Then you do it again, and the second tallest person bubbles up to the second-to-last position. You keep repeating this process until no more swaps are needed and everyone is perfectly organized by height. It's called bubble sort because the larger elements slowly "bubble" to their correct positions, just like air bubbles rising in a glass of soda!`,
    realWorldApplications: `**Industry Applications:**
- **Educational Systems**: Teaching sorting concepts and algorithm analysis
- **Embedded Systems**: Simple sorting for small datasets with memory constraints
- **Testing and Debugging**: Baseline comparison for other sorting algorithms
- **Prototyping**: Quick implementation when performance isn't critical
- **Small Data Processing**: Sorting small lists where simplicity matters
- **Algorithm Visualization**: Demonstrating sorting concepts in educational software
- **Legacy Systems**: Maintaining older codebases with simple sorting needs
- **Microcontrollers**: Resource-constrained environments with tiny datasets
- **Interview Preparation**: Understanding fundamental sorting principles
- **Code Golf**: Shortest possible sorting implementation challenges`,
    example: `// Bubble Sort Implementation
function bubbleSort(arr) {
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        
        // Last i elements are already sorted
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap adjacent elements
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
            }
        }
        
        // If no swapping occurred, array is sorted
        if (!swapped) break;
    }
    
    return arr;
}

// Example usage
const numbers = [64, 34, 25, 12, 22, 11, 90];
console.log("Original:", numbers);
console.log("Sorted:", bubbleSort([...numbers]));
// Output: [11, 12, 22, 25, 34, 64, 90]

// Visualization of one pass:
// [64, 34, 25, 12, 22, 11, 90]
// [34, 64, 25, 12, 22, 11, 90] - 64 > 34, swap
// [34, 25, 64, 12, 22, 11, 90] - 64 > 25, swap
// [34, 25, 12, 64, 22, 11, 90] - 64 > 12, swap
// [34, 25, 12, 22, 64, 11, 90] - 64 > 22, swap
// [34, 25, 12, 22, 11, 64, 90] - 64 > 11, swap
// [34, 25, 12, 22, 11, 64, 90] - 64 < 90, no swap`,
    syntax: `**Bubble Sort Patterns:**

1. **Basic Bubble Sort:**
   \`\`\`javascript
   function bubbleSort(arr) {
       for (let i = 0; i < arr.length - 1; i++) {
           for (let j = 0; j < arr.length - i - 1; j++) {
               if (arr[j] > arr[j + 1]) {
                   [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
               }
           }
       }
       return arr;
   }
   \`\`\`

2. **Optimized Bubble Sort:**
   \`\`\`javascript
   function bubbleSortOptimized(arr) {
       let n = arr.length, swapped;
       do {
           swapped = false;
           for (let i = 1; i < n; i++) {
               if (arr[i - 1] > arr[i]) {
                   [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
                   swapped = true;
               }
           }
           n--; // Reduce range as largest element is in place
       } while (swapped);
       return arr;
   }
   \`\`\``,
    voiceExplanation: `Bubble sort is like organizing books on a shelf by comparing only adjacent books. You start at the left and compare each pair of neighboring books. If the left book is bigger than the right one, you swap them. After one complete pass through all books, the largest book "bubbles up" to the rightmost position. You repeat this process, and each time, the next largest book finds its correct spot. It's called bubble sort because large elements bubble to the top, just like air bubbles rising in water. The algorithm is simple but slow for large collections.`,
    realWorldApplications: `**Industry Applications:**
- **Educational Systems**: Teaching fundamental sorting concepts in computer science courses
- **Small Dataset Processing**: Sorting small lists where simplicity matters more than efficiency
- **Embedded Systems**: Simple sorting for microcontrollers with severe memory constraints
- **Algorithm Visualization**: Demonstrating sorting concepts in educational software
- **Code Interviews**: Testing understanding of basic algorithms and optimization techniques
- **Debugging Tools**: Simple sorting for small diagnostic datasets
- **Game Development**: Sorting small arrays like inventory items or high scores
- **IoT Devices**: Lightweight sorting for sensor data with minimal processing power
- **Prototyping**: Quick implementation for proof-of-concept applications
- **Legacy Systems**: Maintaining old codebases where bubble sort was historically used`,
    keyConcepts: `**Essential Concepts:**
1. **Adjacent Comparison**: Core operation comparing only neighboring elements
2. **Bubble Effect**: Largest elements "bubble up" to correct positions each pass
3. **Pass-by-Pass Reduction**: Each pass reduces the unsorted region by one element
4. **Early Termination**: Optimization to stop when no swaps occur in a pass
5. **Stable Sorting**: Equal elements maintain their relative order
6. **In-Place Algorithm**: Sorts without requiring additional array space
7. **Adaptive Potential**: Can be optimized to detect already sorted arrays
8. **Quadratic Complexity**: Understanding why it's O(nÂ²) in average and worst cases`,
    pseudocode: `**Bubble Sort Pseudocode:**

ALGORITHM BubbleSort(array)
INPUT: array of comparable elements
OUTPUT: sorted array in ascending order
BEGIN
    n = length of array
    
    FOR i = 0 TO n-2 DO
        swapped = false
        
        // Last i elements are already in correct position
        FOR j = 0 TO n-i-2 DO
            IF array[j] > array[j+1] THEN
                // Swap adjacent elements
                SWAP array[j] AND array[j+1]
                swapped = true
            END IF
        END FOR
        
        // If no swapping occurred, array is sorted
        IF swapped = false THEN
            BREAK
        END IF
    END FOR
    
    RETURN array
END`,
    implementationCode: `// Comprehensive Bubble Sort Implementation

class BubbleSort {
    constructor() {
        this.comparisons = 0;
        this.swaps = 0;
        this.passes = 0;
    }
    
    // Basic bubble sort implementation
    sort(arr) {
        const array = [...arr]; // Create copy to avoid mutation
        const n = array.length;
        
        this.resetCounters();
        
        for (let i = 0; i < n - 1; i++) {
            this.passes++;
            let swapped = false;
            
            // Last i elements are already sorted
            for (let j = 0; j < n - i - 1; j++) {
                this.comparisons++;
                if (array[j] > array[j + 1]) {
                    this.swap(array, j, j + 1);
                    swapped = true;
                }
            }
            
            // Early termination if no swaps occurred
            if (!swapped) {
                break;
            }
        }
        
        return array;
    }
    
    // Utility functions
    swap(array, i, j) {
        [array[i], array[j]] = [array[j], array[i]];
        this.swaps++;
    }
    
    resetCounters() {
        this.comparisons = 0;
        this.swaps = 0;
        this.passes = 0;
    }
    
    getStatistics() {
        return {
            comparisons: this.comparisons,
            swaps: this.swaps,
            passes: this.passes
        };
    }
}

// Usage Examples
const bubbleSort = new BubbleSort();
const testArray = [64, 34, 25, 12, 22, 11, 90];
console.log("Original:", testArray);
console.log("Sorted:", bubbleSort.sort(testArray));
console.log("Statistics:", bubbleSort.getStatistics());`,
    quizQuestions: [
      {
        question: "What is the best-case time complexity of bubble sort with early termination optimization?",
        options: ["O(1)", "O(n)", "O(n log n)", "O(nÂ²)"],
        correctAnswer: 1,
        explanation: "With early termination optimization, bubble sort can detect when the array is already sorted after just one pass, giving it O(n) best-case time complexity."
      },
      {
        question: "Why is bubble sort called 'bubble' sort?",
        options: ["It creates bubbles in memory", "Large elements 'bubble up' to their correct positions", "It uses a bubble data structure", "It was invented by someone named Bubble"],
        correctAnswer: 1,
        explanation: "Bubble sort gets its name because larger elements 'bubble up' to the end of the array through successive comparisons and swaps, similar to air bubbles rising to the surface of water."
      },
      {
        question: "What is the main advantage of bubble sort over other sorting algorithms?",
        options: ["Fastest performance", "Lowest memory usage", "Simplicity and ease of understanding", "Best for large datasets"],
        correctAnswer: 2,
        explanation: "Bubble sort's main advantage is its simplicity and ease of understanding, making it excellent for educational purposes and teaching fundamental sorting concepts."
      },
      {
        question: "Is bubble sort a stable sorting algorithm?",
        options: ["Yes, it maintains relative order of equal elements", "No, it changes relative order", "Only with specific implementations", "Only for certain data types"],
        correctAnswer: 0,
        explanation: "Bubble sort is stable because it only swaps adjacent elements when the left element is strictly greater than the right element, never when they are equal, thus preserving the relative order of equal elements."
      },
      {
        question: "What optimization can significantly improve bubble sort's performance on nearly sorted data?",
        options: ["Using a different comparison operator", "Early termination when no swaps occur", "Sorting in reverse order", "Using recursion instead of loops"],
        correctAnswer: 1,
        explanation: "Early termination optimization stops the algorithm when no swaps occur in a complete pass, indicating the array is sorted. This can reduce time complexity from O(nÂ²) to O(n) for already sorted arrays."
      }
    ]
  },
  {
    id: 'merge-sort',
    title: 'Merge Sort',
    description: 'Divide and conquer sorting algorithm with guaranteed O(n log n)',
    category: 'Sorting',
    difficulty: 'intermediate',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    extendedDefinition: `Merge Sort is a stable, divide-and-conquer sorting algorithm that consistently performs in O(n log n) time regardless of input distribution. It works by recursively dividing the array into smaller subarrays until each contains a single element, then merging these subarrays back together in sorted order.

What it does: divides array into smaller parts recursively, then merges them back together in sorted order using divide-and-conquer approach.

How it works: splits array in half until single elements remain, then merges sorted subarrays back together maintaining stability and O(n log n) performance.

When to use: large datasets, stable sorting required, predictable performance needed, external sorting, parallel processing environments.`,
    voiceExplanation: `Merge sort is like organizing a deck of cards using a divide-and-conquer approach. First, you split the deck into smaller and smaller piles until each pile has just one card. Then you merge these piles back together in sorted order. When merging two sorted piles, you simply compare the top cards and take the smaller one. This process continues until you have one perfectly sorted deck. Merge sort is reliable because it always takes the same amount of time, regardless of how shuffled the original deck was.`,
    realWorldApplications: `**Industry Applications:**
- **Database Systems**: External sorting for large datasets, index creation, query processing
- **Big Data Processing**: MapReduce frameworks, distributed sorting, data warehousing
- **File Systems**: Sorting directory entries, file metadata, backup systems
- **Graphics Processing**: Sorting primitives for rendering, z-buffer algorithms
- **Scientific Computing**: Sorting simulation data, statistical analysis, research datasets
- **Web Search**: Sorting search results, indexing web pages, relevance ranking
- **Financial Systems**: Transaction processing, risk analysis, regulatory reporting
- **Bioinformatics**: DNA sequence analysis, protein folding, genomic data processing
- **Machine Learning**: Feature sorting, data preprocessing, model training optimization
- **Operating Systems**: Process scheduling, memory management, resource allocation`,
    keyConcepts: `**Essential Concepts:**
1. **Divide and Conquer**: Recursive problem decomposition strategy
2. **Stability**: Preserves relative order of equal elements
3. **Merge Process**: Core operation that combines two sorted arrays
4. **Recursion Tree**: Understanding the call stack and memory usage
5. **Base Case**: Single element arrays are already sorted
6. **Time Complexity**: O(n log n) in all cases due to balanced recursion
7. **Space Complexity**: O(n) auxiliary space for temporary arrays
8. **External Sorting**: Adaptation for datasets larger than available memory`,
    pseudocode: `**Merge Sort Pseudocode:**

ALGORITHM MergeSort(array, left, right)
INPUT: array to sort, left index, right index
OUTPUT: sorted array
BEGIN
    IF left < right THEN
        middle = (left + right) / 2
        
        // Recursively sort both halves
        MergeSort(array, left, middle)
        MergeSort(array, middle + 1, right)
        
        // Merge the sorted halves
        Merge(array, left, middle, right)
    END IF
END

ALGORITHM Merge(array, left, middle, right)
INPUT: array, left index, middle index, right index
OUTPUT: merged sorted array
BEGIN
    // Create temporary arrays for left and right subarrays
    leftArray = array[left...middle]
    rightArray = array[middle+1...right]
    
    i = 0  // Index for leftArray
    j = 0  // Index for rightArray
    k = left  // Index for merged array
    
    // Merge the temporary arrays back into array[left...right]
    WHILE i < leftArray.length AND j < rightArray.length DO
        IF leftArray[i] <= rightArray[j] THEN
            array[k] = leftArray[i]
            i = i + 1
        ELSE
            array[k] = rightArray[j]
            j = j + 1
        END IF
        k = k + 1
    END WHILE
    
    // Copy remaining elements
    WHILE i < leftArray.length DO
        array[k] = leftArray[i]
        i = i + 1
        k = k + 1
    END WHILE
    
    WHILE j < rightArray.length DO
        array[k] = rightArray[j]
        j = j + 1
        k = k + 1
    END WHILE
END`,
    implementationCode: `// Comprehensive Merge Sort Implementation

class MergeSort {
    // Main merge sort function
    static sort(arr) {
        if (arr.length <= 1) return arr;
        
        // Create a copy to avoid modifying original array
        const sortedArray = [...arr];
        this.mergeSortRecursive(sortedArray, 0, sortedArray.length - 1);
        return sortedArray;
    }
    
    // Recursive merge sort implementation
    static mergeSortRecursive(arr, left, right) {
        if (left < right) {
            // Find the middle point to divide array into two halves
            const middle = Math.floor((left + right) / 2);
            
            // Recursively sort both halves
            this.mergeSortRecursive(arr, left, middle);
            this.mergeSortRecursive(arr, middle + 1, right);
            
            // Merge the sorted halves
            this.merge(arr, left, middle, right);
        }
    }
    
    // Merge function to combine two sorted subarrays
    static merge(arr, left, middle, right) {
        // Calculate sizes of subarrays
        const leftSize = middle - left + 1;
        const rightSize = right - middle;
        
        // Create temporary arrays
        const leftArray = new Array(leftSize);
        const rightArray = new Array(rightSize);
        
        // Copy data to temporary arrays
        for (let i = 0; i < leftSize; i++) {
            leftArray[i] = arr[left + i];
        }
        for (let j = 0; j < rightSize; j++) {
            rightArray[j] = arr[middle + 1 + j];
        }
        
        // Merge the temporary arrays back into arr[left...right]
        let i = 0; // Initial index of left subarray
        let j = 0; // Initial index of right subarray
        let k = left; // Initial index of merged subarray
        
        while (i < leftSize && j < rightSize) {
            if (leftArray[i] <= rightArray[j]) {
                arr[k] = leftArray[i];
                i++;
            } else {
                arr[k] = rightArray[j];
                j++;
            }
            k++;
        }
        
        // Copy remaining elements of leftArray[], if any
        while (i < leftSize) {
            arr[k] = leftArray[i];
            i++;
            k++;
        }
        
        // Copy remaining elements of rightArray[], if any
        while (j < rightSize) {
            arr[k] = rightArray[j];
            j++;
            k++;
        }
    }
    
    // In-place merge sort (more memory efficient)
    static sortInPlace(arr) {
        this.mergeSortInPlace(arr, 0, arr.length - 1);
        return arr;
    }
    
    static mergeSortInPlace(arr, left, right) {
        if (left < right) {
            const middle = Math.floor((left + right) / 2);
            
            this.mergeSortInPlace(arr, left, middle);
            this.mergeSortInPlace(arr, middle + 1, right);
            
            this.mergeInPlace(arr, left, middle, right);
        }
    }
    
    static mergeInPlace(arr, left, middle, right) {
        // Create temporary array for the merge
        const temp = new Array(right - left + 1);
        let i = left, j = middle + 1, k = 0;
        
        // Merge elements into temporary array
        while (i <= middle && j <= right) {
            if (arr[i] <= arr[j]) {
                temp[k++] = arr[i++];
            } else {
                temp[k++] = arr[j++];
            }
        }
        
        // Copy remaining elements
        while (i <= middle) temp[k++] = arr[i++];
        while (j <= right) temp[k++] = arr[j++];
        
        // Copy back to original array
        for (i = left; i <= right; i++) {
            arr[i] = temp[i - left];
        }
    }
    
    // Iterative merge sort (bottom-up approach)
    static sortIterative(arr) {
        const n = arr.length;
        const result = [...arr];
        
        // Start with subarrays of size 1, then 2, 4, 8, ...
        for (let currentSize = 1; currentSize < n; currentSize *= 2) {
            // Pick starting point of left subarray
            for (let leftStart = 0; leftStart < n - 1; leftStart += 2 * currentSize) {
                // Calculate middle and right points
                const middle = Math.min(leftStart + currentSize - 1, n - 1);
                const rightEnd = Math.min(leftStart + 2 * currentSize - 1, n - 1);
                
                // Merge subarrays if middle is smaller than rightEnd
                if (middle < rightEnd) {
                    this.merge(result, leftStart, middle, rightEnd);
                }
            }
        }
        
        return result;
    }
    
    // Merge sort for linked lists
    static sortLinkedList(head) {
        if (!head || !head.next) return head;
        
        // Split the list into two halves
        const middle = this.getMiddle(head);
        const nextToMiddle = middle.next;
        middle.next = null;
        
        // Recursively sort both halves
        const left = this.sortLinkedList(head);
        const right = this.sortLinkedList(nextToMiddle);
        
        // Merge the sorted halves
        return this.mergeLinkedLists(left, right);
    }
    
    static getMiddle(head) {
        if (!head) return head;
        
        let slow = head;
        let fast = head.next;
        
        while (fast && fast.next) {
            slow = slow.next;
            fast = fast.next.next;
        }
        
        return slow;
    }
    
    static mergeLinkedLists(left, right) {
        const dummy = { next: null };
        let current = dummy;
        
        while (left && right) {
            if (left.data <= right.data) {
                current.next = left;
                left = left.next;
            } else {
                current.next = right;
                right = right.next;
            }
            current = current.next;
        }
        
        // Attach remaining nodes
        current.next = left || right;
        
        return dummy.next;
    }
}

// Usage Examples and Performance Testing
const unsortedArray = [64, 34, 25, 12, 22, 11, 90, 88, 76, 50, 42];

console.log("Original:", unsortedArray);
console.log("Sorted (Recursive):", MergeSort.sort(unsortedArray));
console.log("Sorted (Iterative):", MergeSort.sortIterative(unsortedArray));

// Performance comparison
const largeArray = Array.from({length: 10000}, () => Math.floor(Math.random() * 10000));

console.time("Merge Sort Recursive");
MergeSort.sort(largeArray);
console.timeEnd("Merge Sort Recursive");

console.time("Merge Sort Iterative");
MergeSort.sortIterative(largeArray);
console.timeEnd("Merge Sort Iterative");`,
    example: `// Simple Merge Sort Implementation
function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    
    return merge(left, right);
}

function merge(left, right) {
    const result = [];
    let i = 0, j = 0;
    
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result.push(left[i++]);
        } else {
            result.push(right[j++]);
        }
    }

    return result.concat(left.slice(i)).concat(right.slice(j));
}

// Example usage
const numbers = [64, 34, 25, 12, 22, 11, 90];
console.log("Sorted:", mergeSort(numbers)); // [11, 12, 22, 25, 34, 64, 90]`,
    quizQuestions: [
      {
        question: "What is the time complexity of merge sort in all cases (best, average, and worst)?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
        correctAnswer: 1,
        explanation: "Merge sort consistently performs in O(n log n) time regardless of input distribution because it always divides the array in half and merges in linear time."
      },
      {
        question: "What is the main advantage of merge sort over quick sort?",
        options: ["Uses less memory", "Faster average performance", "Guaranteed O(n log n) performance", "In-place sorting"],
        correctAnswer: 2,
        explanation: "Merge sort's main advantage is its guaranteed O(n log n) performance in all cases, while quick sort can degrade to O(n²) in worst-case scenarios."
      },
      {
        question: "Is merge sort a stable sorting algorithm?",
        options: ["Yes, it maintains relative order of equal elements", "No, it changes relative order", "Only in certain implementations", "Depends on the input data"],
        correctAnswer: 0,
        explanation: "Merge sort is stable because when merging two sorted arrays, equal elements from the left array are always placed before equal elements from the right array."
      },
      {
        question: "What is the space complexity of merge sort?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctAnswer: 2,
        explanation: "Merge sort requires O(n) auxiliary space for the temporary arrays used during the merge process, making it not an in-place sorting algorithm."
      },
      {
        question: "In which scenario is merge sort particularly useful?",
        options: ["When memory is very limited", "When sorting linked lists", "When you need the fastest possible sort", "When sorting small arrays"],
        correctAnswer: 1,
        explanation: "Merge sort is particularly useful for sorting linked lists because it doesn't require random access to elements and can efficiently merge linked lists without extra space."
      }
    ]
  },
  {
    id: 'quick-sort',
    title: 'Quick Sort',
    description: 'Efficient in-place sorting using pivot partitioning',
    category: 'Sorting',
    difficulty: 'intermediate',
    timeComplexity: 'O(n log n) - O(nÃ‚Â²)',
    spaceComplexity: 'O(log n)',
    extendedDefinition: `Quick Sort is a highly efficient, divide-and-conquer sorting algorithm that works by selecting a 'pivot' element and partitioning the array around it. Elements smaller than the pivot go to the left, larger elements go to the right, then the process is recursively applied to the sub-arrays.

What it does: selects pivot element, partitions array around it with smaller elements left and larger right, then recursively sorts sub-arrays.

How it works: uses divide-and-conquer with pivot partitioning to achieve efficient in-place sorting, typically O(n log n) but O(n²) worst-case.

When to use: general-purpose sorting, memory-constrained environments, when average-case performance matters more than worst-case guarantees.`,
    voiceExplanation: `Quick sort is like organizing books by picking one book as a reference point (called a pivot). You then arrange all smaller books to the left and all larger books to the right of this reference book. Next, you do the same thing with the left group and right group separately. This process continues until all books are sorted. Quick sort is usually very fast, but its speed depends on choosing good reference points. If you consistently pick the smallest or largest book as your reference, it becomes much slower.`,
    realWorldApplications: `**Industry Applications:**
- **Operating Systems**: Process scheduling, memory management, file system operations
- **Database Systems**: Query optimization, index sorting, join operations
- **Programming Languages**: Built-in sort functions (C++ std::sort, Java Arrays.sort)
- **Graphics Processing**: Sorting primitives for rendering, z-buffer algorithms
- **Scientific Computing**: Numerical analysis, simulation data processing
- **Big Data**: Distributed sorting in MapReduce, Spark, and Hadoop ecosystems
- **Financial Systems**: High-frequency trading, risk analysis, portfolio optimization
- **Game Development**: Leaderboards, inventory sorting, spatial partitioning
- **Web Development**: Search result ranking, data pagination, API response sorting
- **Machine Learning**: Feature selection, data preprocessing, model optimization`,
    keyConcepts: `**Essential Concepts:**
1. **Pivot Selection**: Critical for performance - random, median-of-three, or adaptive strategies
2. **Partitioning**: Core operation that rearranges elements around the pivot
3. **In-place Sorting**: Minimizes memory usage by sorting within the original array
4. **Recursion Depth**: Stack depth depends on pivot choices and input distribution
5. **Tail Recursion**: Optimization to reduce stack space usage
6. **Hybrid Approaches**: Switching to insertion sort for small subarrays
7. **Worst-case Avoidance**: Techniques like randomization and median-of-medians
8. **Cache Performance**: Excellent spatial locality compared to merge sort`,
    pseudocode: `**Quick Sort Pseudocode:**

ALGORITHM QuickSort(array, low, high)
INPUT: array to sort, low index, high index
OUTPUT: sorted array
BEGIN
    IF low < high THEN
        // Partition the array and get pivot index
        pivotIndex = Partition(array, low, high)
        
        // Recursively sort elements before and after partition
        QuickSort(array, low, pivotIndex - 1)
        QuickSort(array, pivotIndex + 1, high)
    END IF
END

ALGORITHM Partition(array, low, high)
INPUT: array, low index, high index
OUTPUT: final position of pivot element
BEGIN
    // Choose rightmost element as pivot
    pivot = array[high]
    
    // Index of smaller element (indicates right position of pivot)
    i = low - 1
    
    FOR j = low TO high - 1 DO
        // If current element is smaller than or equal to pivot
        IF array[j] <= pivot THEN
            i = i + 1
            Swap(array[i], array[j])
        END IF
    END FOR
    
    // Place pivot in correct position
    Swap(array[i + 1], array[high])
    RETURN i + 1
END

ALGORITHM RandomizedQuickSort(array, low, high)
INPUT: array to sort, low index, high index
OUTPUT: sorted array
BEGIN
    IF low < high THEN
        // Randomly choose pivot to avoid worst case
        randomIndex = Random(low, high)
        Swap(array[randomIndex], array[high])
        
        pivotIndex = Partition(array, low, high)
        RandomizedQuickSort(array, low, pivotIndex - 1)
        RandomizedQuickSort(array, pivotIndex + 1, high)
    END IF
END`,
    implementationCode: `// Comprehensive Quick Sort Implementation

class QuickSort {
    // Standard Quick Sort with last element as pivot
    static sort(arr) {
        const sortedArray = [...arr]; // Create copy to avoid modifying original
        this.quickSortRecursive(sortedArray, 0, sortedArray.length - 1);
        return sortedArray;
    }
    
    static quickSortRecursive(arr, low, high) {
        if (low < high) {
            // Partition the array and get pivot index
            const pivotIndex = this.partition(arr, low, high);
            
            // Recursively sort elements before and after partition
            this.quickSortRecursive(arr, low, pivotIndex - 1);
            this.quickSortRecursive(arr, pivotIndex + 1, high);
        }
    }
    
    // Lomuto partition scheme
    static partition(arr, low, high) {
        const pivot = arr[high]; // Choose rightmost element as pivot
        let i = low - 1; // Index of smaller element
        
        for (let j = low; j < high; j++) {
            // If current element is smaller than or equal to pivot
            if (arr[j] <= pivot) {
                i++;
                this.swap(arr, i, j);
            }
        }
        
        // Place pivot in correct position
        this.swap(arr, i + 1, high);
        return i + 1;
    }
    
    // Hoare partition scheme (more efficient)
    static hoarePartition(arr, low, high) {
        const pivot = arr[low]; // Choose first element as pivot
        let i = low - 1;
        let j = high + 1;
        
        while (true) {
            // Find element on left that should be on right
            do {
                i++;
            } while (arr[i] < pivot);
            
            // Find element on right that should be on left
            do {
                j--;
            } while (arr[j] > pivot);
            
            // If elements crossed, partitioning is done
            if (i >= j) {
                return j;
            }
            
            this.swap(arr, i, j);
        }
    }
    
    // Randomized Quick Sort to avoid worst case
    static randomizedSort(arr) {
        const sortedArray = [...arr];
        this.randomizedQuickSort(sortedArray, 0, sortedArray.length - 1);
        return sortedArray;
    }
    
    static randomizedQuickSort(arr, low, high) {
        if (low < high) {
            // Randomly choose pivot to avoid worst case
            const randomIndex = low + Math.floor(Math.random() * (high - low + 1));
            this.swap(arr, randomIndex, high);
            
            const pivotIndex = this.partition(arr, low, high);
            this.randomizedQuickSort(arr, low, pivotIndex - 1);
            this.randomizedQuickSort(arr, pivotIndex + 1, high);
        }
    }
    
    // Median-of-three pivot selection
    static medianOfThreeSort(arr) {
        const sortedArray = [...arr];
        this.medianOfThreeQuickSort(sortedArray, 0, sortedArray.length - 1);
        return sortedArray;
    }
    
    static medianOfThreeQuickSort(arr, low, high) {
        if (low < high) {
            // Choose median of first, middle, and last elements as pivot
            this.medianOfThree(arr, low, high);
            
            const pivotIndex = this.partition(arr, low, high);
            this.medianOfThreeQuickSort(arr, low, pivotIndex - 1);
            this.medianOfThreeQuickSort(arr, pivotIndex + 1, high);
        }
    }
    
    static medianOfThree(arr, low, high) {
        const mid = Math.floor((low + high) / 2);
        
        // Sort low, mid, high
        if (arr[mid] < arr[low]) {
            this.swap(arr, low, mid);
        }
        if (arr[high] < arr[low]) {
            this.swap(arr, low, high);
        }
        if (arr[high] < arr[mid]) {
            this.swap(arr, mid, high);
        }
        
        // Place median at end (as pivot)
        this.swap(arr, mid, high);
    }
    
    // Iterative Quick Sort to avoid recursion stack overflow
    static iterativeSort(arr) {
        const sortedArray = [...arr];
        this.quickSortIterative(sortedArray);
        return sortedArray;
    }
    
    static quickSortIterative(arr) {
        const stack = [];
        stack.push(0);
        stack.push(arr.length - 1);
        
        while (stack.length > 0) {
            const high = stack.pop();
            const low = stack.pop();
            
            if (low < high) {
                const pivotIndex = this.partition(arr, low, high);
                
                // Push left subarray bounds
                stack.push(low);
                stack.push(pivotIndex - 1);
                
                // Push right subarray bounds
                stack.push(pivotIndex + 1);
                stack.push(high);
            }
        }
    }
    
    // Hybrid Quick Sort with Insertion Sort for small arrays
    static hybridSort(arr, threshold = 10) {
        const sortedArray = [...arr];
        this.hybridQuickSort(sortedArray, 0, sortedArray.length - 1, threshold);
        return sortedArray;
    }
    
    static hybridQuickSort(arr, low, high, threshold) {
        if (low < high) {
            // Use insertion sort for small subarrays
            if (high - low + 1 < threshold) {
                this.insertionSort(arr, low, high);
            } else {
                const pivotIndex = this.partition(arr, low, high);
                this.hybridQuickSort(arr, low, pivotIndex - 1, threshold);
                this.hybridQuickSort(arr, pivotIndex + 1, high, threshold);
            }
        }
    }
    
    static insertionSort(arr, low, high) {
        for (let i = low + 1; i <= high; i++) {
            const key = arr[i];
            let j = i - 1;
            
            while (j >= low && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            
            arr[j + 1] = key;
        }
    }
    
    // Three-way partitioning for arrays with many duplicates
    static threeWaySort(arr) {
        const sortedArray = [...arr];
        this.threeWayQuickSort(sortedArray, 0, sortedArray.length - 1);
        return sortedArray;
    }
    
    static threeWayQuickSort(arr, low, high) {
        if (low >= high) return;
        
        const [lt, gt] = this.threeWayPartition(arr, low, high);
        
        this.threeWayQuickSort(arr, low, lt - 1);
        this.threeWayQuickSort(arr, gt + 1, high);
    }
    
    static threeWayPartition(arr, low, high) {
        const pivot = arr[low];
        let lt = low;      // arr[low..lt-1] < pivot
        let i = low + 1;   // arr[lt..i-1] == pivot
        let gt = high;     // arr[gt+1..high] > pivot
        
        while (i <= gt) {
            if (arr[i] < pivot) {
                this.swap(arr, lt++, i++);
            } else if (arr[i] > pivot) {
                this.swap(arr, i, gt--);
            } else {
                i++;
            }
        }
        
        return [lt, gt];
    }
    
    // Utility function to swap elements
    static swap(arr, i, j) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    
    // Find kth smallest element using Quick Select
    static quickSelect(arr, k) {
        const array = [...arr];
        return this.quickSelectRecursive(array, 0, array.length - 1, k - 1);
    }
    
    static quickSelectRecursive(arr, low, high, k) {
        if (low === high) {
            return arr[low];
        }
        
        const pivotIndex = this.partition(arr, low, high);
        
        if (k === pivotIndex) {
            return arr[k];
        } else if (k < pivotIndex) {
            return this.quickSelectRecursive(arr, low, pivotIndex - 1, k);
        } else {
            return this.quickSelectRecursive(arr, pivotIndex + 1, high, k);
        }
    }
}

// Usage Examples and Performance Testing
const unsortedArray = [64, 34, 25, 12, 22, 11, 90, 88, 76, 50, 42];

console.log("Original:", unsortedArray);
console.log("Standard Quick Sort:", QuickSort.sort(unsortedArray));
console.log("Randomized Quick Sort:", QuickSort.randomizedSort(unsortedArray));
console.log("Median-of-Three:", QuickSort.medianOfThreeSort(unsortedArray));
console.log("Iterative Quick Sort:", QuickSort.iterativeSort(unsortedArray));
console.log("Hybrid Quick Sort:", QuickSort.hybridSort(unsortedArray));
console.log("Three-Way Quick Sort:", QuickSort.threeWaySort([3, 1, 3, 2, 3, 1, 2, 3]));

// Quick Select example
console.log("3rd smallest element:", QuickSort.quickSelect(unsortedArray, 3));

// Performance comparison
const largeArray = Array.from({length: 10000}, () => Math.floor(Math.random() * 10000));

console.time("Standard Quick Sort");
QuickSort.sort(largeArray);
console.timeEnd("Standard Quick Sort");

console.time("Randomized Quick Sort");
QuickSort.randomizedSort(largeArray);
console.timeEnd("Randomized Quick Sort");`,
    example: `// Simple Quick Sort Implementation
function quickSort(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
        const pivotIndex = partition(arr, low, high);
        quickSort(arr, low, pivotIndex - 1);
        quickSort(arr, pivotIndex + 1, high);
    }
    return arr;
}

function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}

// Example usage
const numbers = [64, 34, 25, 12, 22, 11, 90];
console.log("Sorted:", quickSort([...numbers])); // [11, 12, 22, 25, 34, 64, 90]`,
    quizQuestions: [
      {
        question: "What is the worst-case time complexity of quick sort?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
        correctAnswer: 2,
        explanation: "Quick sort's worst-case time complexity is O(n²), which occurs when the pivot is consistently the smallest or largest element, leading to unbalanced partitions."
      },
      {
        question: "What is the main advantage of quick sort over merge sort?",
        options: ["Better worst-case performance", "Uses less memory (in-place)", "Always stable", "Simpler implementation"],
        correctAnswer: 1,
        explanation: "Quick sort's main advantage is that it sorts in-place, requiring only O(log n) extra space for recursion, while merge sort requires O(n) auxiliary space."
      },
      {
        question: "Which pivot selection strategy helps avoid worst-case performance?",
        options: ["Always choose first element", "Always choose last element", "Random pivot selection", "Always choose middle element"],
        correctAnswer: 2,
        explanation: "Random pivot selection helps avoid worst-case performance by making it unlikely to consistently choose poor pivots, especially on already sorted or reverse-sorted data."
      },
      {
        question: "Is quick sort a stable sorting algorithm?",
        options: ["Yes, always stable", "No, not stable", "Only with specific implementations", "Depends on pivot choice"],
        correctAnswer: 1,
        explanation: "Quick sort is not stable because the partitioning process can change the relative order of equal elements when they are swapped across the pivot."
      },
      {
        question: "What optimization can be applied to quick sort for small subarrays?",
        options: ["Use bubble sort", "Use insertion sort", "Use selection sort", "Skip sorting"],
        correctAnswer: 1,
        explanation: "For small subarrays (typically < 10-15 elements), switching to insertion sort can improve performance because insertion sort is faster for small datasets and has less overhead."
      }
    ]
  },
  {
    id: 'heap-sort',
    title: 'Heap Sort',
    description: 'Comparison-based sorting using binary heap data structure',
    category: 'Sorting',
    difficulty: 'intermediate',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)',
    extendedDefinition: `Heap Sort is an efficient comparison-based sorting algorithm that uses the binary heap data structure. It combines the best features of merge sort (guaranteed O(n log n) performance) and insertion sort (in-place sorting), making it a reliable choice for systems where consistent performance is crucial.

What it does: builds max heap from array, then repeatedly extracts maximum element and places it at end while maintaining heap property.

How it works: transforms array into max heap structure, then swaps root with last element and re-heapifies remaining elements until sorted.

When to use: memory-constrained environments, predictable performance required, real-time systems, embedded systems, priority queue implementations.`,
    voiceExplanation: `Think of heap sort like organizing a tournament bracket! Imagine you have a bunch of players and you want to find the strongest one. You organize them into a tournament tree where the strongest player always beats weaker ones and rises to the top. In heap sort, you first arrange your numbers into this "tournament tree" structure called a max heap, where the biggest number is always at the top. Then you take the winner (biggest number), put it at the end of your sorted list, and reorganize the remaining players into a new tournament. You keep doing this - take the winner, put them in the sorted area, reorganize the tournament - until everyone has been placed in order from strongest to weakest. It's like running multiple tournament rounds until you have a complete ranking!`,
    realWorldApplications: `**Industry Applications:**
- **Operating Systems**: Process scheduling with priority queues, memory management
- **Embedded Systems**: Sorting with strict memory constraints and predictable performance
- **Real-Time Systems**: Guaranteed O(n log n) performance for time-critical applications
- **Database Systems**: External sorting when memory is limited, index maintenance
- **Graphics Processing**: Z-buffer sorting, priority-based rendering
- **Network Systems**: Quality of Service (QoS) packet scheduling
- **Game Development**: Priority-based AI decision making, leaderboard maintenance
- **Scientific Computing**: Sorting large datasets with memory constraints
- **Financial Systems**: Priority-based order processing, risk management
- **Telecommunications**: Call routing with priority levels`,
    example: `// Heap Sort Implementation
function heapSort(arr) {
    const n = arr.length;
    
    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }
    
    // Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
        // Move current root to end
        [arr[0], arr[i]] = [arr[i], arr[0]];
        
        // Call heapify on reduced heap
        heapify(arr, i, 0);
    }
    
    return arr;
}

function heapify(arr, n, i) {
    let largest = i;        // Initialize largest as root
    const left = 2 * i + 1; // Left child
    const right = 2 * i + 2; // Right child
    
    // If left child is larger than root
    if (left < n && arr[left] > arr[largest]) {
        largest = left;
    }
    
    // If right child is larger than largest so far
    if (right < n && arr[right] > arr[largest]) {
        largest = right;
    }
    
    // If largest is not root
    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        
        // Recursively heapify the affected sub-tree
        heapify(arr, n, largest);
    }
}

// Example usage
const numbers = [12, 11, 13, 5, 6, 7];
console.log("Original:", numbers);
console.log("Sorted:", heapSort([...numbers]));
// Output: [5, 6, 7, 11, 12, 13]`,
    syntax: `**Heap Sort Patterns:**

1. **Heapify Function:**
   \`\`\`javascript
   function heapify(arr, n, i) {
       let largest = i;
       const left = 2 * i + 1, right = 2 * i + 2;
       
       if (left < n && arr[left] > arr[largest]) largest = left;
       if (right < n && arr[right] > arr[largest]) largest = right;
       
       if (largest !== i) {
           [arr[i], arr[largest]] = [arr[largest], arr[i]];
           heapify(arr, n, largest);
       }
   }
   \`\`\`

2. **Build Heap and Sort:**
   \`\`\`javascript
   function heapSort(arr) {
       const n = arr.length;
       
       // Build max heap
       for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
           heapify(arr, n, i);
       }
       
       // Extract elements
       for (let i = n - 1; i > 0; i--) {
           [arr[0], arr[i]] = [arr[i], arr[0]];
           heapify(arr, i, 0);
       }
       return arr;
   }
   \`\`\``,
    voiceExplanation: `Heap sort is like organizing a tournament where the winner always moves to the top. First, you arrange all elements into a "heap" - a special tree where parents are always larger than their children. The largest element naturally becomes the root. You then repeatedly take the winner (root), place it in the sorted section, and reorganize the remaining elements to find the next largest. Heap sort is reliable because it always takes the same amount of time, and it sorts in place without needing extra memory.`,
    realWorldApplications: `**Industry Applications:**
- **Operating Systems**: Process scheduling with priority queues, memory management
- **Database Systems**: Priority-based query processing, index maintenance
- **Network Systems**: Bandwidth allocation, packet scheduling, QoS management
- **Game Development**: AI pathfinding (A* algorithm), event scheduling
- **Real-Time Systems**: Task scheduling with deadlines, interrupt handling
- **Graphics Processing**: Z-buffer algorithms, rendering priority queues
- **Scientific Computing**: Simulation event scheduling, numerical algorithms
- **Embedded Systems**: Resource-constrained sorting with predictable performance
- **Financial Systems**: Order book management, risk assessment algorithms
- **Machine Learning**: Feature selection, model optimization, hyperparameter tuning`,
    keyConcepts: `**Essential Concepts:**
1. **Heap Property**: Parent nodes are always greater (max heap) or smaller (min heap) than children
2. **Complete Binary Tree**: All levels filled except possibly the last, filled left to right
3. **Array Representation**: Parent at index i, children at 2i+1 and 2i+2
4. **Heapify Operation**: Maintains heap property by comparing node with children
5. **Build Heap**: Convert array to heap in O(n) time using bottom-up approach
6. **Extract Maximum**: Remove root, replace with last element, then heapify
7. **In-Place Sorting**: Uses the same array for heap and sorted elements
8. **Guaranteed Performance**: Always O(n log n) regardless of input distribution`,
    pseudocode: `**Heap Sort Pseudocode:**

ALGORITHM HeapSort(array)
INPUT: array of comparable elements
OUTPUT: sorted array in ascending order
BEGIN
    n = length of array
    
    // Build max heap (heapify)
    FOR i = floor(n/2) - 1 DOWN TO 0 DO
        Heapify(array, n, i)
    END FOR
    
    // Extract elements from heap one by one
    FOR i = n - 1 DOWN TO 1 DO
        // Move current root to end
        Swap(array[0], array[i])
        
        // Call heapify on reduced heap
        Heapify(array, i, 0)
    END FOR
    
    RETURN array
END

ALGORITHM Heapify(array, heapSize, rootIndex)
INPUT: array, heap size, root index
OUTPUT: maintains heap property
BEGIN
    largest = rootIndex
    leftChild = 2 * rootIndex + 1
    rightChild = 2 * rootIndex + 2
    
    // Find largest among root, left child, and right child
    IF leftChild < heapSize AND array[leftChild] > array[largest] THEN
        largest = leftChild
    END IF
    
    IF rightChild < heapSize AND array[rightChild] > array[largest] THEN
        largest = rightChild
    END IF
    
    // If largest is not root, swap and continue heapifying
    IF largest != rootIndex THEN
        Swap(array[rootIndex], array[largest])
        Heapify(array, heapSize, largest)
    END IF
END

ALGORITHM BuildMaxHeap(array)
INPUT: array to convert to max heap
OUTPUT: max heap property established
BEGIN
    n = length of array
    
    // Start from last non-leaf node and heapify each node
    FOR i = floor(n/2) - 1 DOWN TO 0 DO
        Heapify(array, n, i)
    END FOR
END`,
    implementationCode: `// Comprehensive Heap Sort Implementation

class HeapSort {
    // Main heap sort function
    static sort(arr) {
        const array = [...arr]; // Create copy to avoid modifying original
        const n = array.length;
        
        // Build max heap
        this.buildMaxHeap(array);
        
        // Extract elements from heap one by one
        for (let i = n - 1; i > 0; i--) {
            // Move current root to end
            this.swap(array, 0, i);
            
            // Call heapify on reduced heap
            this.heapify(array, i, 0);
        }
        
        return array;
    }
    
    // Build max heap from array
    static buildMaxHeap(arr) {
        const n = arr.length;
        
        // Start from last non-leaf node and heapify each node
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            this.heapify(arr, n, i);
        }
    }
    
    // Heapify a subtree rooted at index i
    static heapify(arr, heapSize, rootIndex) {
        let largest = rootIndex;
        const leftChild = 2 * rootIndex + 1;
        const rightChild = 2 * rootIndex + 2;
        
        // Find largest among root, left child, and right child
        if (leftChild < heapSize && arr[leftChild] > arr[largest]) {
            largest = leftChild;
        }
        
        if (rightChild < heapSize && arr[rightChild] > arr[largest]) {
            largest = rightChild;
        }
        
        // If largest is not root, swap and continue heapifying
        if (largest !== rootIndex) {
            this.swap(arr, rootIndex, largest);
            this.heapify(arr, heapSize, largest);
        }
    }
    
    // Iterative heapify (avoids recursion)
    static heapifyIterative(arr, heapSize, startIndex) {
        let parentIndex = startIndex;
        
        while (true) {
            let largest = parentIndex;
            const leftChild = 2 * parentIndex + 1;
            const rightChild = 2 * parentIndex + 2;
            
            if (leftChild < heapSize && arr[leftChild] > arr[largest]) {
                largest = leftChild;
            }
            
            if (rightChild < heapSize && arr[rightChild] > arr[largest]) {
                largest = rightChild;
            }
            
            if (largest === parentIndex) {
                break; // Heap property satisfied
            }
            
            this.swap(arr, parentIndex, largest);
            parentIndex = largest;
        }
    }
    
    // Sort with step-by-step visualization
    static sortWithSteps(arr) {
        const array = [...arr];
        const steps = [];
        const n = array.length;
        
        // Step 1: Build max heap
        steps.push({
            phase: 'build-heap',
            description: 'Building max heap from array',
            array: [...array],
            heapSize: n
        });
        
        this.buildMaxHeap(array);
        
        steps.push({
            phase: 'heap-built',
            description: 'Max heap constructed - largest element at root',
            array: [...array],
            heapSize: n
        });
        
        // Step 2: Extract elements
        for (let i = n - 1; i > 0; i--) {
            // Move root to sorted position
            this.swap(array, 0, i);
            
            steps.push({
                phase: 'extract',
                description: \`Extracted \${array[i]} to sorted position \${i}\`,
                array: [...array],
                heapSize: i,
                sortedElements: Array.from({length: n - i}, (_, idx) => n - 1 - idx)
            });
            
            // Restore heap property
            this.heapify(array, i, 0);
            
            steps.push({
                phase: 'heapify',
                description: \`Restored heap property for remaining \${i} elements\`,
                array: [...array],
                heapSize: i,
                sortedElements: Array.from({length: n - i}, (_, idx) => n - 1 - idx)
            });
        }
        
        return {
            sortedArray: array,
            steps: steps
        };
    }
    
    // Min heap sort (for descending order)
    static sortDescending(arr) {
        const array = [...arr];
        const n = array.length;
        
        // Build min heap
        this.buildMinHeap(array);
        
        // Extract elements from min heap
        for (let i = n - 1; i > 0; i--) {
            this.swap(array, 0, i);
            this.minHeapify(array, i, 0);
        }
        
        return array;
    }
    
    static buildMinHeap(arr) {
        const n = arr.length;
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            this.minHeapify(arr, n, i);
        }
    }
    
    static minHeapify(arr, heapSize, rootIndex) {
        let smallest = rootIndex;
        const leftChild = 2 * rootIndex + 1;
        const rightChild = 2 * rootIndex + 2;
        
        if (leftChild < heapSize && arr[leftChild] < arr[smallest]) {
            smallest = leftChild;
        }
        
        if (rightChild < heapSize && arr[rightChild] < arr[smallest]) {
            smallest = rightChild;
        }
        
        if (smallest !== rootIndex) {
            this.swap(arr, rootIndex, smallest);
            this.minHeapify(arr, heapSize, smallest);
        }
    }
    
    // Utility functions
    static swap(arr, i, j) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    
    static isValidHeap(arr, isMaxHeap = true) {
        const n = arr.length;
        
        for (let i = 0; i < Math.floor(n / 2); i++) {
            const leftChild = 2 * i + 1;
            const rightChild = 2 * i + 2;
            
            if (isMaxHeap) {
                if (leftChild < n && arr[i] < arr[leftChild]) return false;
                if (rightChild < n && arr[i] < arr[rightChild]) return false;
            } else {
                if (leftChild < n && arr[i] > arr[leftChild]) return false;
                if (rightChild < n && arr[i] > arr[rightChild]) return false;
            }
        }
        
        return true;
    }
    
    // Performance analysis
    static analyzeComplexity(size) {
        const buildHeapTime = size; // O(n)
        const sortTime = size * Math.log2(size); // O(n log n)
        const totalTime = buildHeapTime + sortTime;
        
        return {
            buildHeap: {
                operations: buildHeapTime,
                description: 'Building heap from array'
            },
            sorting: {
                operations: Math.round(sortTime),
                description: 'Extracting elements and maintaining heap'
            },
            total: {
                operations: Math.round(totalTime),
                description: 'Total heap sort operations'
            },
            spaceComplexity: 'O(1) - in-place sorting'
        };
    }
}

// Usage Examples and Testing
console.log('=== Heap Sort Examples ===');

const testArrays = {
    random: [64, 34, 25, 12, 22, 11, 90],
    sorted: [1, 2, 3, 4, 5],
    reverse: [5, 4, 3, 2, 1],
    duplicates: [3, 1, 4, 1, 5, 9, 2, 6, 5, 3]
};

Object.entries(testArrays).forEach(([name, arr]) => {
    console.log(\`\${name}: \${arr} → \${HeapSort.sort(arr)}\`);
});

// Demonstrate step-by-step sorting
console.log('\\n--- Step-by-Step Heap Sort ---');
const stepResult = HeapSort.sortWithSteps([3, 1, 4, 1, 5]);
console.log('Final result:', stepResult.sortedArray);
console.log('Steps taken:', stepResult.steps.length);

// Performance analysis
console.log('\\n--- Complexity Analysis ---');
const analysis = HeapSort.analyzeComplexity(1000);
console.log('For array of size 1000:');
console.log('Build heap:', analysis.buildHeap);
console.log('Sorting:', analysis.sorting);
console.log('Total:', analysis.total);

// Heap validation
console.log('\\n--- Heap Validation ---');
const heap = [90, 64, 34, 25, 22, 11, 12];
console.log('Is valid max heap:', HeapSort.isValidHeap(heap));`,
    quizQuestions: [
      {
        question: "What is the time complexity of heap sort in all cases?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
        correctAnswer: 1,
        explanation: "Heap sort has a consistent O(n log n) time complexity in all cases because building the heap takes O(n) time and extracting n elements takes O(n log n) time."
      },
      {
        question: "What is the main advantage of heap sort over quick sort?",
        options: ["Uses less memory", "Guaranteed O(n log n) performance", "Stable sorting", "Faster average case"],
        correctAnswer: 1,
        explanation: "Heap sort's main advantage is its guaranteed O(n log n) performance regardless of input, while quick sort can degrade to O(n²) in worst-case scenarios."
      },
      {
        question: "In a max heap represented as an array, where are the children of element at index i?",
        options: ["i+1 and i+2", "2i and 2i+1", "2i+1 and 2i+2", "i/2 and i/2+1"],
        correctAnswer: 2,
        explanation: "In a zero-indexed array representation of a heap, the children of element at index i are located at indices 2i+1 (left child) and 2i+2 (right child)."
      },
      {
        question: "Is heap sort a stable sorting algorithm?",
        options: ["Yes, always stable", "No, not stable", "Only for max heaps", "Depends on implementation"],
        correctAnswer: 1,
        explanation: "Heap sort is not stable because the heap operations can change the relative order of equal elements when they are moved during the sorting process."
      },
      {
        question: "What is the space complexity of heap sort?",
        options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
        correctAnswer: 2,
        explanation: "Heap sort has O(1) space complexity because it sorts in-place, using only a constant amount of extra space for variables, not counting the input array."
      }
    ]
  },
  {
    id: 'insertion-sort',
    title: 'Insertion Sort',
    description: 'Build sorted array one element at a time - efficient for small or nearly sorted data',
    category: 'Sorting',
    difficulty: 'beginner',
    timeComplexity: 'O(nÃ‚Â²)',
    spaceComplexity: 'O(1)',
    voiceExplanation: `Insertion sort is like sorting playing cards in your hand. You start with one card (already "sorted"), then pick up the next card and insert it in the right position among the cards you've already sorted. You continue this process, always keeping the left portion of your hand sorted while inserting each new card into its correct spot. It's very efficient for small collections or when the cards are already mostly in order.`,
    extendedDefinition: `Insertion Sort is a simple, intuitive sorting algorithm that builds the final sorted array one element at a time. It works by taking elements from the unsorted portion and inserting them into their correct position in the sorted portion, similar to how you might sort playing cards in your hand.

What it does: builds sorted array one element at a time by taking each element and inserting it into correct position within already sorted portion.

How it works: starts with first element as sorted, then repeatedly takes next element and shifts larger elements right to insert it correctly.

When to use: small datasets, nearly sorted data, online algorithms, simple implementations, when stability and simplicity are more important than efficiency.`,
    realWorldApplications: `**Industry Applications:**
- **Small Dataset Sorting**: Efficient for arrays with < 50 elements
- **Nearly Sorted Data**: Excellent performance on partially sorted datasets
- **Hybrid Sorting**: Used as final step in advanced algorithms (Timsort, Introsort)
- **Real-Time Systems**: Predictable behavior for small, time-critical operations
- **Embedded Systems**: Low memory footprint for resource-constrained devices
- **Online Algorithms**: Sorting data streams as elements arrive
- **Educational Software**: Teaching fundamental sorting concepts
- **Game Development**: Sorting small lists like high scores, inventory items
- **Database Systems**: Sorting small result sets, maintaining sorted indexes
- **Graphics Programming**: Sorting vertices, sprites, or UI elements by depth`,
    keyConcepts: `**Essential Concepts:**
1. **Invariant Maintenance**: Left portion always remains sorted throughout execution
2. **Shifting Strategy**: Elements are shifted right to make space for insertion
3. **Adaptive Behavior**: Performance improves significantly on nearly sorted data
4. **Stable Sorting**: Equal elements maintain their original relative order
5. **Binary Insertion**: Can use binary search to find insertion position
6. **Sentinel Values**: Using sentinel to eliminate boundary checks
7. **Gap Sequences**: Foundation for Shell sort's gap-based improvements
8. **Online Processing**: Can process elements as they become available`,
    pseudocode: `**Insertion Sort Pseudocode:**

ALGORITHM InsertionSort(array)
INPUT: array of comparable elements
OUTPUT: sorted array in ascending order
BEGIN
    FOR i = 1 TO length(array) - 1 DO
        key = array[i]
        j = i - 1
        
        // Move elements greater than key one position ahead
        WHILE j >= 0 AND array[j] > key DO
            array[j + 1] = array[j]
            j = j - 1
        END WHILE
        
        // Insert key at correct position
        array[j + 1] = key
    END FOR
    
    RETURN array
END

ALGORITHM BinaryInsertionSort(array)
INPUT: array of comparable elements
OUTPUT: sorted array using binary search for position
BEGIN
    FOR i = 1 TO length(array) - 1 DO
        key = array[i]
        
        // Find insertion position using binary search
        position = BinarySearch(array, 0, i - 1, key)
        
        // Shift elements to make space
        FOR j = i - 1 DOWN TO position DO
            array[j + 1] = array[j]
        END FOR
        
        // Insert key at found position
        array[position] = key
    END FOR
    
    RETURN array
END

ALGORITHM BinarySearch(array, low, high, key)
INPUT: sorted array, search bounds, key to find position for
OUTPUT: insertion position for key
BEGIN
    WHILE low <= high DO
        mid = (low + high) / 2
        
        IF array[mid] > key THEN
            high = mid - 1
        ELSE
            low = mid + 1
        END IF
    END WHILE
    
    RETURN low
END`,
    implementationCode: `// Comprehensive Insertion Sort Implementation

class InsertionSort {
    // Standard insertion sort
    static sort(arr) {
        const array = [...arr]; // Create copy to avoid modifying original
        
        for (let i = 1; i < array.length; i++) {
            const key = array[i];
            let j = i - 1;
            
            // Move elements greater than key one position ahead
            while (j >= 0 && array[j] > key) {
                array[j + 1] = array[j];
                j--;
            }
            
            // Insert key at correct position
            array[j + 1] = key;
        }
        
        return array;
    }
    
    // Binary insertion sort - uses binary search to find insertion position
    static binaryInsertionSort(arr) {
        const array = [...arr];
        
        for (let i = 1; i < array.length; i++) {
            const key = array[i];
            
            // Find insertion position using binary search
            const position = this.binarySearch(array, 0, i - 1, key);
            
            // Shift elements to make space
            for (let j = i - 1; j >= position; j--) {
                array[j + 1] = array[j];
            }
            
            // Insert key at found position
            array[position] = key;
        }
        
        return array;
    }
    
    // Binary search to find insertion position
    static binarySearch(arr, low, high, key) {
        while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            
            if (arr[mid] > key) {
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        }
        
        return low;
    }
    
    // Insertion sort with step-by-step visualization
    static sortWithSteps(arr) {
        const array = [...arr];
        const steps = [];
        
        steps.push({
            phase: 'initial',
            description: 'Starting with first element as sorted',
            array: [...array],
            sortedUpTo: 0,
            currentElement: null
        });
        
        for (let i = 1; i < array.length; i++) {
            const key = array[i];
            let j = i - 1;
            
            steps.push({
                phase: 'select',
                description: \`Selecting element \${key} at position \${i}\`,
                array: [...array],
                sortedUpTo: i - 1,
                currentElement: key,
                currentIndex: i
            });
            
            // Track shifting process
            const shiftSteps = [];
            while (j >= 0 && array[j] > key) {
                array[j + 1] = array[j];
                shiftSteps.push({
                    from: j,
                    to: j + 1,
                    value: array[j + 1]
                });
                j--;
            }
            
            if (shiftSteps.length > 0) {
                steps.push({
                    phase: 'shift',
                    description: \`Shifting elements to make space for \${key}\`,
                    array: [...array],
                    sortedUpTo: i - 1,
                    currentElement: key,
                    shifts: shiftSteps
                });
            }
            
            // Insert key at correct position
            array[j + 1] = key;
            
            steps.push({
                phase: 'insert',
                description: \`Inserted \${key} at position \${j + 1}\`,
                array: [...array],
                sortedUpTo: i,
                insertedAt: j + 1
            });
        }
        
        steps.push({
            phase: 'complete',
            description: 'Array is now completely sorted',
            array: [...array],
            sortedUpTo: array.length - 1
        });
        
        return {
            sortedArray: array,
            steps: steps
        };
    }
    
    // Optimized insertion sort with sentinel
    static sortWithSentinel(arr) {
        const array = [Number.NEGATIVE_INFINITY, ...arr]; // Add sentinel
        
        for (let i = 2; i < array.length; i++) {
            const key = array[i];
            let j = i - 1;
            
            // No need to check j >= 0 due to sentinel
            while (array[j] > key) {
                array[j + 1] = array[j];
                j--;
            }
            
            array[j + 1] = key;
        }
        
        return array.slice(1); // Remove sentinel
    }
    
    // Insertion sort for linked lists
    static sortLinkedList(head) {
        if (!head || !head.next) return head;
        
        const dummy = { next: null };
        let current = head;
        
        while (current) {
            const next = current.next;
            
            // Find insertion position
            let prev = dummy;
            while (prev.next && prev.next.data < current.data) {
                prev = prev.next;
            }
            
            // Insert current node
            current.next = prev.next;
            prev.next = current;
            
            current = next;
        }
        
        return dummy.next;
    }
    
    // Recursive insertion sort
    static sortRecursive(arr, n = arr.length) {
        if (n <= 1) return arr;
        
        // Sort first n-1 elements
        this.sortRecursive(arr, n - 1);
        
        // Insert last element at correct position
        const last = arr[n - 1];
        let j = n - 2;
        
        while (j >= 0 && arr[j] > last) {
            arr[j + 1] = arr[j];
            j--;
        }
        
        arr[j + 1] = last;
        return arr;
    }
    
    // Insertion sort with gap (used in Shell sort)
    static sortWithGap(arr, gap) {
        const array = [...arr];
        
        for (let i = gap; i < array.length; i++) {
            const key = array[i];
            let j = i - gap;
            
            while (j >= 0 && array[j] > key) {
                array[j + gap] = array[j];
                j -= gap;
            }
            
            array[j + gap] = key;
        }
        
        return array;
    }
    
    // Performance analysis and comparison
    static analyzePerformance(arr) {
        const size = arr.length;
        const isNearlySorted = this.checkIfNearlySorted(arr);
        
        let comparisons, swaps;
        
        if (isNearlySorted) {
            comparisons = size - 1; // Best case O(n)
            swaps = 0;
        } else {
            comparisons = (size * (size - 1)) / 2; // Average/Worst case O(n²)
            swaps = comparisons / 2;
        }
        
        return {
            inputSize: size,
            isNearlySorted: isNearlySorted,
            estimatedComparisons: Math.round(comparisons),
            estimatedSwaps: Math.round(swaps),
            timeComplexity: isNearlySorted ? 'O(n)' : 'O(n²)',
            spaceComplexity: 'O(1)',
            recommendation: size < 50 ? 'Recommended for small arrays' : 'Consider quicksort or mergesort'
        };
    }
    
    static checkIfNearlySorted(arr) {
        let inversions = 0;
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] > arr[i + 1]) {
                inversions++;
            }
        }
        return inversions <= arr.length * 0.1; // Less than 10% inversions
    }
    
    // Utility functions
    static swap(arr, i, j) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    
    static isSorted(arr) {
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] < arr[i - 1]) return false;
        }
        return true;
    }
}

// Usage Examples and Testing
console.log('=== Insertion Sort Examples ===');

const testCases = {
    random: [64, 34, 25, 12, 22, 11, 90],
    nearlySorted: [1, 2, 4, 3, 5, 6, 7],
    reversed: [7, 6, 5, 4, 3, 2, 1],
    duplicates: [3, 1, 4, 1, 5, 9, 2, 6, 5],
    small: [3, 1, 4]
};

// Test different variants
Object.entries(testCases).forEach(([name, arr]) => {
    console.log(\`\${name}: \${arr}\`);
    console.log(\`  Standard: \${InsertionSort.sort(arr)}\`);
    console.log(\`  Binary: \${InsertionSort.binaryInsertionSort(arr)}\`);
    console.log(\`  Performance: \${JSON.stringify(InsertionSort.analyzePerformance(arr))}\`);
    console.log('');
});

// Demonstrate step-by-step sorting
console.log('--- Step-by-Step Insertion Sort ---');
const stepDemo = InsertionSort.sortWithSteps([3, 1, 4, 1, 5]);
console.log('Final result:', stepDemo.sortedArray);
console.log('Total steps:', stepDemo.steps.length);

// Compare with other small-array algorithms
console.log('--- Small Array Performance Comparison ---');
const smallArray = [5, 2, 8, 1, 9];
console.time('Insertion Sort');
InsertionSort.sort(smallArray);
console.timeEnd('Insertion Sort');

console.time('Binary Insertion Sort');
InsertionSort.binaryInsertionSort(smallArray);
console.timeEnd('Binary Insertion Sort');`,
    quizQuestions: [
      {
        question: "What is the best-case time complexity of insertion sort?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
        correctAnswer: 0,
        explanation: "Insertion sort has O(n) best-case time complexity when the array is already sorted, as it only needs to make one comparison per element without any shifts."
      },
      {
        question: "What makes insertion sort particularly suitable for small arrays?",
        options: ["It has the lowest space complexity", "It has simple implementation with low overhead", "It's always faster than quicksort", "It uses divide and conquer"],
        correctAnswer: 1,
        explanation: "Insertion sort is suitable for small arrays because of its simple implementation with low overhead. Despite O(n²) complexity, the constant factors are small, making it efficient for small datasets."
      },
      {
        question: "Is insertion sort a stable sorting algorithm?",
        options: ["Yes, it maintains relative order of equal elements", "No, it changes relative order", "Only in certain implementations", "Only for numeric data"],
        correctAnswer: 0,
        explanation: "Insertion sort is stable because when inserting an element, it's placed after any equal elements already in the sorted portion, maintaining the original relative order."
      },
      {
        question: "How can insertion sort be optimized for finding the insertion position?",
        options: ["Use quicksort partitioning", "Use binary search", "Use hash tables", "Use merge operation"],
        correctAnswer: 1,
        explanation: "Binary insertion sort uses binary search to find the correct insertion position, reducing comparisons from O(n) to O(log n) per element, though shifting still takes O(n) time."
      },
      {
        question: "In which scenario does insertion sort perform best?",
        options: ["Large random arrays", "Nearly sorted arrays", "Reverse sorted arrays", "Arrays with many duplicates"],
        correctAnswer: 1,
        explanation: "Insertion sort performs best on nearly sorted arrays because it can achieve O(n) time complexity when most elements are already in their correct positions, requiring minimal shifts."
      }
    ]
  },
  {
    id: 'selection-sort',
    title: 'Selection Sort',
    description: 'Find minimum element and swap to correct position - minimizes number of swaps',
    category: 'Sorting',
    difficulty: 'beginner',
    timeComplexity: 'O(nÃ‚Â²)',
    spaceComplexity: 'O(1)',
    voiceExplanation: `Selection sort is like organizing your bookshelf by repeatedly finding the shortest book and placing it at the beginning. You scan through all remaining books to find the shortest one, then swap it to the front. Next, you find the shortest book among the remaining ones and place it in the second position. You continue this process until all books are arranged from shortest to tallest. Selection sort minimizes the number of swaps but still takes a lot of time for large collections.`,
    extendedDefinition: `Selection Sort is a simple comparison-based sorting algorithm that divides the array into sorted and unsorted regions. It repeatedly finds the minimum element from the unsorted region and places it at the beginning of the sorted region, effectively growing the sorted portion one element at a time.

What it does: repeatedly finds minimum element from unsorted portion and swaps it with first unsorted element to build sorted region.

How it works: scans unsorted region to find smallest element, swaps it to correct position, then repeats with remaining unsorted elements.

When to use: minimizing number of swaps is important, simple implementation needed, small datasets, educational purposes, memory-write expensive operations.`,
    realWorldApplications: `**Industry Applications:**
- **Memory-Constrained Systems**: Minimal memory usage for embedded systems
- **Swap-Expensive Operations**: When moving elements is costly (large objects, disk operations)
- **Educational Purposes**: Teaching fundamental sorting concepts and algorithm analysis
- **Small Dataset Sorting**: Acceptable performance for very small arrays (< 20 elements)
- **Hardware Implementation**: Simple logic suitable for hardware sorting circuits
- **Database Systems**: Sorting small result sets where simplicity matters
- **Embedded Controllers**: Microcontroller applications with limited resources
- **Real-Time Systems**: Predictable behavior for time-critical applications
- **Graphics Programming**: Sorting small lists of sprites or UI elements
- **Game Development**: Organizing small collections like player scores or inventory`,
    keyConcepts: `**Essential Concepts:**
1. **Invariant Maintenance**: Left portion always contains smallest elements in sorted order
2. **Minimum Finding**: Linear search through unsorted portion to find smallest element
3. **Swap Minimization**: Exactly n-1 swaps regardless of input distribution
4. **Unstable Sorting**: Equal elements may change their relative positions
5. **Selection Strategy**: Always selects globally minimum from remaining elements
6. **Boundary Management**: Clear separation between sorted and unsorted regions
7. **Comparison Count**: Always makes (n-1) + (n-2) + ... + 1 = n(n-1)/2 comparisons
8. **Non-Adaptive**: Performance independent of initial array arrangement`,
    pseudocode: `**Selection Sort Pseudocode:**

ALGORITHM SelectionSort(array)
INPUT: array of comparable elements
OUTPUT: sorted array in ascending order
BEGIN
    n = length of array
    
    FOR i = 0 TO n - 2 DO
        // Find minimum element in remaining unsorted array
        minIndex = i
        
        FOR j = i + 1 TO n - 1 DO
            IF array[j] < array[minIndex] THEN
                minIndex = j
            END IF
        END FOR
        
        // Swap minimum element with first element of unsorted portion
        IF minIndex != i THEN
            Swap(array[i], array[minIndex])
        END IF
    END FOR
    
    RETURN array
END

ALGORITHM DoubleSelectionSort(array)
INPUT: array of comparable elements
OUTPUT: sorted array using bidirectional selection
BEGIN
    left = 0
    right = length(array) - 1
    
    WHILE left < right DO
        minIndex = left
        maxIndex = left
        
        // Find both minimum and maximum in one pass
        FOR i = left TO right DO
            IF array[i] < array[minIndex] THEN
                minIndex = i
            END IF
            IF array[i] > array[maxIndex] THEN
                maxIndex = i
            END IF
        END FOR
        
        // Place minimum at left boundary
        Swap(array[left], array[minIndex])
        
        // Adjust maxIndex if it was pointing to left
        IF maxIndex = left THEN
            maxIndex = minIndex
        END IF
        
        // Place maximum at right boundary
        Swap(array[right], array[maxIndex])
        
        left = left + 1
        right = right - 1
    END WHILE
    
    RETURN array
END

ALGORITHM StableSelectionSort(array)
INPUT: array of comparable elements
OUTPUT: stable sorted array
BEGIN
    n = length of array
    
    FOR i = 0 TO n - 2 DO
        minIndex = i
        
        // Find minimum element
        FOR j = i + 1 TO n - 1 DO
            IF array[j] < array[minIndex] THEN
                minIndex = j
            END IF
        END FOR
        
        // Shift elements to maintain stability
        IF minIndex != i THEN
            minValue = array[minIndex]
            FOR k = minIndex DOWN TO i + 1 DO
                array[k] = array[k - 1]
            END FOR
            array[i] = minValue
        END IF
    END FOR
    
    RETURN array
END`,
    implementationCode: `// Comprehensive Selection Sort Implementation

class SelectionSort {
    // Standard selection sort
    static sort(arr) {
        const array = [...arr]; // Create copy to avoid modifying original
        const n = array.length;
        
        for (let i = 0; i < n - 1; i++) {
            // Find minimum element in remaining unsorted array
            let minIndex = i;
            
            for (let j = i + 1; j < n; j++) {
                if (array[j] < array[minIndex]) {
                    minIndex = j;
                }
            }
            
            // Swap minimum element with first element of unsorted portion
            if (minIndex !== i) {
                this.swap(array, i, minIndex);
            }
        }
        
        return array;
    }
    
    // Double selection sort - finds both min and max in each pass
    static doubleSelectionSort(arr) {
        const array = [...arr];
        let left = 0;
        let right = array.length - 1;
        
        while (left < right) {
            let minIndex = left;
            let maxIndex = left;
            
            // Find both minimum and maximum in one pass
            for (let i = left; i <= right; i++) {
                if (array[i] < array[minIndex]) {
                    minIndex = i;
                }
                if (array[i] > array[maxIndex]) {
                    maxIndex = i;
                }
            }
            
            // Place minimum at left boundary
            this.swap(array, left, minIndex);
            
            // Adjust maxIndex if it was pointing to left
            if (maxIndex === left) {
                maxIndex = minIndex;
            }
            
            // Place maximum at right boundary
            this.swap(array, right, maxIndex);
            
            left++;
            right--;
        }
        
        return array;
    }
    
    // Stable selection sort - maintains relative order of equal elements
    static stableSelectionSort(arr) {
        const array = [...arr];
        const n = array.length;
        
        for (let i = 0; i < n - 1; i++) {
            let minIndex = i;
            
            // Find minimum element
            for (let j = i + 1; j < n; j++) {
                if (array[j] < array[minIndex]) {
                    minIndex = j;
                }
            }
            
            // Shift elements to maintain stability instead of swapping
            if (minIndex !== i) {
                const minValue = array[minIndex];
                for (let k = minIndex; k > i; k--) {
                    array[k] = array[k - 1];
                }
                array[i] = minValue;
            }
        }
        
        return array;
    }
    
    // Selection sort with step-by-step visualization
    static sortWithSteps(arr) {
        const array = [...arr];
        const steps = [];
        const n = array.length;
        
        steps.push({
            phase: 'initial',
            description: 'Starting selection sort - finding minimum elements',
            array: [...array],
            sortedUpTo: -1,
            currentMin: null
        });
        
        for (let i = 0; i < n - 1; i++) {
            let minIndex = i;
            
            steps.push({
                phase: 'search-start',
                description: \`Pass \${i + 1}: Searching for minimum in unsorted portion\`,
                array: [...array],
                sortedUpTo: i - 1,
                searchingFrom: i,
                currentMin: array[i],
                currentMinIndex: i
            });
            
            // Track the search for minimum
            for (let j = i + 1; j < n; j++) {
                if (array[j] < array[minIndex]) {
                    minIndex = j;
                    
                    steps.push({
                        phase: 'new-min-found',
                        description: \`Found new minimum: \${array[j]} at position \${j}\`,
                        array: [...array],
                        sortedUpTo: i - 1,
                        searchingFrom: i,
                        currentMin: array[j],
                        currentMinIndex: j,
                        comparing: j
                    });
                }
            }
            
            // Perform swap if needed
            if (minIndex !== i) {
                steps.push({
                    phase: 'swap',
                    description: \`Swapping \${array[i]} with minimum \${array[minIndex]}\`,
                    array: [...array],
                    sortedUpTo: i - 1,
                    swapping: [i, minIndex]
                });
                
                this.swap(array, i, minIndex);
            }
            
            steps.push({
                phase: 'pass-complete',
                description: \`Pass \${i + 1} complete. Element \${array[i]} is in correct position\`,
                array: [...array],
                sortedUpTo: i,
                justPlaced: i
            });
        }
        
        steps.push({
            phase: 'complete',
            description: 'Selection sort complete - array is now sorted',
            array: [...array],
            sortedUpTo: n - 1
        });
        
        return {
            sortedArray: array,
            steps: steps
        };
    }
    
    // Selection sort for linked lists
    static sortLinkedList(head) {
        if (!head || !head.next) return head;
        
        let current = head;
        
        while (current.next) {
            let minNode = current;
            let temp = current.next;
            
            // Find minimum in remaining list
            while (temp) {
                if (temp.data < minNode.data) {
                    minNode = temp;
                }
                temp = temp.next;
            }
            
            // Swap data (easier than pointer manipulation)
            if (minNode !== current) {
                [current.data, minNode.data] = [minNode.data, current.data];
            }
            
            current = current.next;
        }
        
        return head;
    }
    
    // Recursive selection sort
    static sortRecursive(arr, startIndex = 0) {
        const array = [...arr];
        
        if (startIndex >= array.length - 1) {
            return array;
        }
        
        // Find minimum in remaining array
        let minIndex = startIndex;
        for (let i = startIndex + 1; i < array.length; i++) {
            if (array[i] < array[minIndex]) {
                minIndex = i;
            }
        }
        
        // Swap if needed
        if (minIndex !== startIndex) {
            this.swap(array, startIndex, minIndex);
        }
        
        // Recursively sort remaining array
        return this.sortRecursive(array, startIndex + 1);
    }
    
    // Selection sort with custom comparator
    static sortWithComparator(arr, compareFn) {
        const array = [...arr];
        const n = array.length;
        
        for (let i = 0; i < n - 1; i++) {
            let minIndex = i;
            
            for (let j = i + 1; j < n; j++) {
                if (compareFn(array[j], array[minIndex]) < 0) {
                    minIndex = j;
                }
            }
            
            if (minIndex !== i) {
                this.swap(array, i, minIndex);
            }
        }
        
        return array;
    }
    
    // Performance analysis
    static analyzePerformance(arr) {
        const size = arr.length;
        const comparisons = (size * (size - 1)) / 2; // Always n(n-1)/2
        const swaps = size - 1; // At most n-1 swaps
        
        return {
            inputSize: size,
            comparisons: comparisons,
            maxSwaps: swaps,
            timeComplexity: 'O(n²)',
            spaceComplexity: 'O(1)',
            characteristics: {
                stable: false,
                adaptive: false,
                inPlace: true,
                minimumSwaps: true
            },
            recommendation: size < 20 ? 'Acceptable for very small arrays' : 'Use quicksort or mergesort'
        };
    }
    
    // Find kth smallest element using selection sort approach
    static findKthSmallest(arr, k) {
        if (k < 1 || k > arr.length) return null;
        
        const array = [...arr];
        
        // Only need to sort first k elements
        for (let i = 0; i < k; i++) {
            let minIndex = i;
            
            for (let j = i + 1; j < array.length; j++) {
                if (array[j] < array[minIndex]) {
                    minIndex = j;
                }
            }
            
            if (minIndex !== i) {
                this.swap(array, i, minIndex);
            }
        }
        
        return array[k - 1];
    }
    
    // Utility functions
    static swap(arr, i, j) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    
    static isSorted(arr) {
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] < arr[i - 1]) return false;
        }
        return true;
    }
    
    static countSwaps(arr) {
        const array = [...arr];
        let swapCount = 0;
        const n = array.length;
        
        for (let i = 0; i < n - 1; i++) {
            let minIndex = i;
            
            for (let j = i + 1; j < n; j++) {
                if (array[j] < array[minIndex]) {
                    minIndex = j;
                }
            }
            
            if (minIndex !== i) {
                this.swap(array, i, minIndex);
                swapCount++;
            }
        }
        
        return swapCount;
    }
}

// Usage Examples and Testing
console.log('=== Selection Sort Examples ===');

const testCases = {
    random: [64, 34, 25, 12, 22, 11, 90],
    sorted: [1, 2, 3, 4, 5],
    reverse: [5, 4, 3, 2, 1],
    duplicates: [3, 1, 4, 1, 5, 9, 2, 6, 5],
    single: [42],
    empty: []
};

// Test different variants
Object.entries(testCases).forEach(([name, arr]) => {
    if (arr.length > 0) {
        console.log(\`\${name}: \${arr}\`);
        console.log(\`  Standard: \${SelectionSort.sort(arr)}\`);
        console.log(\`  Double: \${SelectionSort.doubleSelectionSort(arr)}\`);
        console.log(\`  Stable: \${SelectionSort.stableSelectionSort(arr)}\`);
        console.log(\`  Swaps needed: \${SelectionSort.countSwaps(arr)}\`);
        console.log(\`  Performance: \${JSON.stringify(SelectionSort.analyzePerformance(arr))}\`);
        console.log('');
    }
});

// Demonstrate step-by-step sorting
console.log('--- Step-by-Step Selection Sort ---');
const stepDemo = SelectionSort.sortWithSteps([3, 1, 4, 1, 5]);
console.log('Final result:', stepDemo.sortedArray);
console.log('Total steps:', stepDemo.steps.length);

// Test kth smallest
console.log('--- Kth Smallest Element ---');
const testArray = [7, 10, 4, 3, 20, 15];
for (let k = 1; k <= 3; k++) {
    console.log(\`\${k}th smallest in [\${testArray}]: \${SelectionSort.findKthSmallest(testArray, k)}\`);
}

// Custom comparator example
console.log('--- Custom Comparator (Descending) ---');
const descending = (a, b) => b - a;
console.log('Descending order:', SelectionSort.sortWithComparator([3, 1, 4, 1, 5], descending));`,
    quizQuestions: [
      {
        question: "What is the main advantage of selection sort over other O(n²) algorithms?",
        options: ["Faster average performance", "Minimizes number of swaps", "Stable sorting", "Adaptive behavior"],
        correctAnswer: 1,
        explanation: "Selection sort's main advantage is that it minimizes the number of swaps, making exactly n-1 swaps regardless of input. This is beneficial when swapping is expensive."
      },
      {
        question: "What is the time complexity of selection sort in all cases?",
        options: ["O(n)", "O(n log n)", "O(n²)", "Depends on input"],
        correctAnswer: 2,
        explanation: "Selection sort always has O(n²) time complexity because it makes n(n-1)/2 comparisons regardless of the input arrangement, unlike adaptive algorithms."
      },
      {
        question: "Is selection sort a stable sorting algorithm?",
        options: ["Yes, always stable", "No, not stable", "Only with modifications", "Depends on implementation"],
        correctAnswer: 1,
        explanation: "Standard selection sort is not stable because swapping can change the relative order of equal elements. However, it can be made stable by shifting elements instead of swapping."
      },
      {
        question: "How many swaps does selection sort make for an array of n elements?",
        options: ["At most n-1", "Exactly n²", "At most n²", "Depends on input order"],
        correctAnswer: 0,
        explanation: "Selection sort makes at most n-1 swaps because it places one element in its correct position per pass, and the last element is automatically in place."
      },
      {
        question: "When might selection sort be preferred over more efficient algorithms?",
        options: ["For large datasets", "When swapping is expensive", "When stability is required", "For nearly sorted data"],
        correctAnswer: 1,
        explanation: "Selection sort is preferred when swapping elements is expensive (e.g., large objects or disk operations) because it minimizes the number of swaps to exactly n-1."
      }
    ]
  },
  {
    id: 'counting-sort',
    title: 'Counting Sort',
    description: 'Non-comparison integer sorting using counting array',
    category: 'Sorting',
    difficulty: 'intermediate',
    timeComplexity: 'O(n + k)',
    spaceComplexity: 'O(k)',
    voiceExplanation: `Counting sort is like organizing exam scores by counting how many students got each score. Instead of comparing scores directly, you create a tally chart with all possible scores (0 to 100) and count how many students achieved each score. Then you simply read through your tally chart in order to get the sorted list. This works great when you have a limited range of values, like test scores or ages, and can be much faster than comparison-based sorting.`,
    extendedDefinition: `Counting Sort is a non-comparison based sorting algorithm that works by counting the occurrences of each distinct element in the input array. It's particularly efficient when the range of possible values (k) is not significantly larger than the number of elements to be sorted (n).

What it does: counts frequency of each distinct element, then uses these counts to place elements directly into correct positions without comparisons.

How it works: creates counting array to tally element frequencies, transforms counts into positions, then builds sorted output array.

When to use: small range of integer values, when O(n + k) is better than O(n log n), stable sorting needed, discrete value sets.`,
    realWorldApplications: `**Industry Applications:**
- **Grading Systems**: Sorting student scores, grade distributions, academic rankings
- **Age Demographics**: Population analysis, census data, demographic studies
- **Inventory Management**: Sorting items by quantity, stock levels, product codes
- **Gaming**: Leaderboards, score sorting, level progression systems
- **Digital Image Processing**: Histogram equalization, color quantization
- **Database Systems**: Sorting by discrete categories, status codes, priority levels
- **Network Traffic**: Packet sorting by priority, QoS classification
- **Financial Systems**: Transaction categorization, risk level sorting
- **Manufacturing**: Quality control sorting, defect classification
- **Bioinformatics**: DNA sequence analysis, protein classification`,
    keyConcepts: `**Essential Concepts:**
1. **Range Dependency**: Performance directly tied to the range of input values
2. **Frequency Counting**: Core technique of tallying element occurrences
3. **Cumulative Sum**: Converting counts to positions for stable sorting
4. **Index Mapping**: Using element values as array indices for O(1) access
5. **Stability Preservation**: Maintaining original order of equal elements
6. **Memory Trade-off**: Space efficiency vs time efficiency consideration
7. **Discrete Value Requirement**: Works only with countable, finite value sets
8. **Preprocessing Optimization**: Range calculation and offset handling`,
    pseudocode: `**Counting Sort Pseudocode:**

ALGORITHM CountingSort(array)
INPUT: array of integers with known range
OUTPUT: sorted array
BEGIN
    // Find the range of elements
    min = FindMinimum(array)
    max = FindMaximum(array)
    range = max - min + 1
    
    // Create counting array
    count = new Array[range] initialized to 0
    output = new Array[length(array)]
    
    // Count occurrences of each element
    FOR i = 0 TO length(array) - 1 DO
        count[array[i] - min] = count[array[i] - min] + 1
    END FOR
    
    // Calculate cumulative counts (for stability)
    FOR i = 1 TO range - 1 DO
        count[i] = count[i] + count[i - 1]
    END FOR
    
    // Build output array (traverse backwards for stability)
    FOR i = length(array) - 1 DOWN TO 0 DO
        output[count[array[i] - min] - 1] = array[i]
        count[array[i] - min] = count[array[i] - min] - 1
    END FOR
    
    RETURN output
END

ALGORITHM SimpleCountingSort(array, maxValue)
INPUT: array of non-negative integers, maximum value
OUTPUT: sorted array
BEGIN
    count = new Array[maxValue + 1] initialized to 0
    
    // Count occurrences
    FOR each element in array DO
        count[element] = count[element] + 1
    END FOR
    
    // Reconstruct sorted array
    index = 0
    FOR value = 0 TO maxValue DO
        WHILE count[value] > 0 DO
            array[index] = value
            index = index + 1
            count[value] = count[value] - 1
        END WHILE
    END FOR
    
    RETURN array
END

ALGORITHM CountingSortWithRange(array, min, max)
INPUT: array with known minimum and maximum values
OUTPUT: sorted array
BEGIN
    range = max - min + 1
    count = new Array[range] initialized to 0
    output = new Array[length(array)]
    
    // Count with offset
    FOR each element in array DO
        count[element - min] = count[element - min] + 1
    END FOR
    
    // Calculate positions
    FOR i = 1 TO range - 1 DO
        count[i] = count[i] + count[i - 1]
    END FOR
    
    // Place elements
    FOR i = length(array) - 1 DOWN TO 0 DO
        output[count[array[i] - min] - 1] = array[i]
        count[array[i] - min] = count[array[i] - min] - 1
    END FOR
    
    RETURN output
END`,
    implementationCode: `// Comprehensive Counting Sort Implementation

class CountingSort {
    // Standard counting sort with automatic range detection
    static sort(arr) {
        if (arr.length <= 1) return [...arr];
        
        // Find range
        const min = Math.min(...arr);
        const max = Math.max(...arr);
        
        return this.sortWithRange(arr, min, max);
    }
    
    // Counting sort with specified range
    static sortWithRange(arr, min, max) {
        const array = [...arr]; // Create copy
        const range = max - min + 1;
        const count = new Array(range).fill(0);
        const output = new Array(array.length);
        
        // Count occurrences of each element
        for (let i = 0; i < array.length; i++) {
            count[array[i] - min]++;
        }
        
        // Calculate cumulative counts for stable sorting
        for (let i = 1; i < range; i++) {
            count[i] += count[i - 1];
        }
        
        // Build output array (traverse backwards for stability)
        for (let i = array.length - 1; i >= 0; i--) {
            output[count[array[i] - min] - 1] = array[i];
            count[array[i] - min]--;
        }
        
        return output;
    }
    
    // Simple counting sort for non-negative integers
    static sortNonNegative(arr, maxValue = null) {
        const array = [...arr];
        const max = maxValue !== null ? maxValue : Math.max(...array);
        const count = new Array(max + 1).fill(0);
        
        // Count occurrences
        for (const element of array) {
            count[element]++;
        }
        
        // Reconstruct sorted array
        let index = 0;
        for (let value = 0; value <= max; value++) {
            while (count[value] > 0) {
                array[index++] = value;
                count[value]--;
            }
        }
        
        return array;
    }
    
    // Counting sort with step-by-step visualization
    static sortWithSteps(arr) {
        const array = [...arr];
        const steps = [];
        
        if (array.length <= 1) {
            return { sortedArray: array, steps: [{ phase: 'complete', array: array }] };
        }
        
        const min = Math.min(...array);
        const max = Math.max(...array);
        const range = max - min + 1;
        
        steps.push({
            phase: 'initial',
            description: \`Starting counting sort. Range: \${min} to \${max} (size: \${range})\`,
            array: [...array],
            min: min,
            max: max,
            range: range
        });
        
        // Create counting array
        const count = new Array(range).fill(0);
        
        steps.push({
            phase: 'count-init',
            description: 'Created counting array initialized to zeros',
            array: [...array],
            countArray: [...count],
            min: min
        });
        
        // Count occurrences
        for (let i = 0; i < array.length; i++) {
            count[array[i] - min]++;
            
            steps.push({
                phase: 'counting',
                description: \`Counting element \${array[i]} at index \${i}\`,
                array: [...array],
                countArray: [...count],
                currentElement: array[i],
                currentIndex: i,
                min: min
            });
        }
        
        steps.push({
            phase: 'count-complete',
            description: 'Finished counting all elements',
            array: [...array],
            countArray: [...count],
            min: min
        });
        
        // Calculate cumulative counts
        for (let i = 1; i < range; i++) {
            count[i] += count[i - 1];
        }
        
        steps.push({
            phase: 'cumulative',
            description: 'Calculated cumulative counts for positioning',
            array: [...array],
            countArray: [...count],
            min: min
        });
        
        // Build output array
        const output = new Array(array.length);
        for (let i = array.length - 1; i >= 0; i--) {
            const pos = count[array[i] - min] - 1;
            output[pos] = array[i];
            count[array[i] - min]--;
            
            steps.push({
                phase: 'placing',
                description: \`Placing element \${array[i]} at position \${pos}\`,
                array: [...array],
                output: [...output],
                countArray: [...count],
                currentElement: array[i],
                currentIndex: i,
                placedAt: pos,
                min: min
            });
        }
        
        steps.push({
            phase: 'complete',
            description: 'Counting sort complete',
            array: output,
            sortedArray: output
        });
        
        return {
            sortedArray: output,
            steps: steps
        };
    }
    
    // Counting sort for strings (by length)
    static sortStringsByLength(strings) {
        if (strings.length <= 1) return [...strings];
        
        const maxLength = Math.max(...strings.map(s => s.length));
        const count = new Array(maxLength + 1).fill(0);
        
        // Count strings by length
        for (const str of strings) {
            count[str.length]++;
        }
        
        // Reconstruct sorted array
        const result = [];
        for (let length = 0; length <= maxLength; length++) {
            for (const str of strings) {
                if (str.length === length) {
                    result.push(str);
                }
            }
        }
        
        return result;
    }
    
    // Counting sort for characters in a string
    static sortCharacters(str) {
        const chars = str.split('');
        const count = new Array(256).fill(0); // ASCII range
        
        // Count character frequencies
        for (const char of chars) {
            count[char.charCodeAt(0)]++;
        }
        
        // Reconstruct sorted string
        let result = '';
        for (let i = 0; i < 256; i++) {
            while (count[i] > 0) {
                result += String.fromCharCode(i);
                count[i]--;
            }
        }
        
        return result;
    }
    
    // Counting sort with custom key function
    static sortWithKey(arr, keyFn, maxKey = null) {
        const array = [...arr];
        const keys = array.map(keyFn);
        const max = maxKey !== null ? maxKey : Math.max(...keys);
        const count = new Array(max + 1).fill(0);
        
        // Count by key
        for (const key of keys) {
            count[key]++;
        }
        
        // Calculate positions
        for (let i = 1; i <= max; i++) {
            count[i] += count[i - 1];
        }
        
        // Build output
        const output = new Array(array.length);
        for (let i = array.length - 1; i >= 0; i--) {
            const key = keyFn(array[i]);
            output[count[key] - 1] = array[i];
            count[key]--;
        }
        
        return output;
    }
    
    // Performance analysis
    static analyzePerformance(arr) {
        const n = arr.length;
        const min = Math.min(...arr);
        const max = Math.max(...arr);
        const k = max - min + 1;
        
        const timeComplexity = n + k;
        const spaceComplexity = k;
        const efficiency = n / k; // Higher is better
        
        return {
            inputSize: n,
            range: k,
            minValue: min,
            maxValue: max,
            timeComplexity: \`O(\${n} + \${k}) = O(\${timeComplexity})\`,
            spaceComplexity: \`O(\${k})\`,
            efficiency: efficiency.toFixed(2),
            recommendation: efficiency > 0.1 ? 'Efficient for this input' : 'Consider comparison-based sorting',
            characteristics: {
                stable: true,
                adaptive: false,
                inPlace: false,
                comparisonBased: false
            }
        };
    }
    
    // Find frequency of each element
    static getFrequencies(arr) {
        const frequencies = new Map();
        
        for (const element of arr) {
            frequencies.set(element, (frequencies.get(element) || 0) + 1);
        }
        
        return frequencies;
    }
    
    // Check if counting sort is suitable for the input
    static isSuitable(arr, maxRangeRatio = 2) {
        if (arr.length === 0) return false;
        
        const n = arr.length;
        const min = Math.min(...arr);
        const max = Math.max(...arr);
        const range = max - min + 1;
        
        return range <= n * maxRangeRatio;
    }
    
    // Utility functions
    static isInteger(value) {
        return Number.isInteger(value);
    }
    
    static validateInput(arr) {
        if (!Array.isArray(arr)) {
            throw new Error('Input must be an array');
        }
        
        if (!arr.every(this.isInteger)) {
            throw new Error('All elements must be integers');
        }
        
        return true;
    }
}

// Usage Examples and Testing
console.log('=== Counting Sort Examples ===');

const testCases = {
    grades: [85, 92, 78, 96, 85, 88, 92, 78, 90, 85],
    ages: [25, 30, 22, 35, 28, 30, 22, 25, 33, 28],
    scores: [3, 1, 4, 1, 5, 9, 2, 6, 5, 3],
    negative: [-2, -5, -1, -3, -1, -4, -2],
    large: Array.from({length: 1000}, () => Math.floor(Math.random() * 100))
};

// Test different scenarios
Object.entries(testCases).forEach(([name, arr]) => {
    console.log(\`\${name}: \${arr.slice(0, 10)}\${arr.length > 10 ? '...' : ''}\`);
    console.log(\`  Sorted: \${CountingSort.sort(arr).slice(0, 10)}\${arr.length > 10 ? '...' : ''}\`);
    console.log(\`  Analysis: \${JSON.stringify(CountingSort.analyzePerformance(arr))}\`);
    console.log(\`  Suitable: \${CountingSort.isSuitable(arr)}\`);
    console.log('');
});

// Demonstrate step-by-step sorting
console.log('--- Step-by-Step Counting Sort ---');
const stepDemo = CountingSort.sortWithSteps([4, 2, 2, 8, 3, 3, 1]);
console.log('Final result:', stepDemo.sortedArray);
console.log('Total steps:', stepDemo.steps.length);

// Test string sorting
console.log('--- String Sorting Examples ---');
const strings = ['cat', 'elephant', 'dog', 'a', 'bird'];
console.log('By length:', CountingSort.sortStringsByLength(strings));

const text = 'hello world';
console.log(\`Characters in "\${text}":\`, CountingSort.sortCharacters(text));

// Test with custom key
console.log('--- Custom Key Sorting ---');
const people = [{name: 'Alice', age: 30}, {name: 'Bob', age: 25}, {name: 'Charlie', age: 35}];
const sortedByAge = CountingSort.sortWithKey(people, person => person.age, 100);
console.log('Sorted by age:', sortedByAge.map(p => \`\${p.name}(\${p.age})\`));`,
    quizQuestions: [
      {
        question: "What is the time complexity of counting sort?",
        options: ["O(n log n)", "O(n²)", "O(n + k)", "O(k log k)"],
        correctAnswer: 2,
        explanation: "Counting sort has O(n + k) time complexity, where n is the number of elements and k is the range of input values. It's linear when k is not significantly larger than n."
      },
      {
        question: "When is counting sort most efficient?",
        options: ["When the range of values is much larger than the number of elements", "When the range of values is similar to the number of elements", "When the array is already sorted", "When all elements are unique"],
        correctAnswer: 1,
        explanation: "Counting sort is most efficient when the range of values (k) is similar to or smaller than the number of elements (n), making the O(n + k) complexity close to O(n)."
      },
      {
        question: "Is counting sort a stable sorting algorithm?",
        options: ["Yes, when implemented properly", "No, never stable", "Only for positive integers", "Depends on the input data"],
        correctAnswer: 0,
        explanation: "Counting sort can be stable when implemented properly by processing elements from right to left and using cumulative counts to determine positions, preserving the relative order of equal elements."
      },
      {
        question: "What is the main limitation of counting sort?",
        options: ["It's slower than comparison-based sorts", "It requires knowing the range of input values", "It can't handle duplicate elements", "It's not stable"],
        correctAnswer: 1,
        explanation: "The main limitation of counting sort is that it requires knowing the range of input values beforehand and works only with discrete values, typically integers within a reasonable range."
      },
      {
        question: "What type of sorting algorithm is counting sort?",
        options: ["Comparison-based", "Non-comparison based", "Divide and conquer", "Greedy algorithm"],
        correctAnswer: 1,
        explanation: "Counting sort is a non-comparison based sorting algorithm. It doesn't compare elements directly but instead counts occurrences and uses arithmetic to determine positions."
      }
    ]
  },
  {
    id: 'radix-sort',
    title: 'Radix Sort',
    description: 'Non-comparison sorting by processing digits',
    category: 'Sorting',
    difficulty: 'intermediate',
    timeComplexity: 'O(d Ãƒâ€" (n + k))',
    spaceComplexity: 'O(n + k)',
    voiceExplanation: `Radix sort is like organizing a filing cabinet by employee ID numbers, but you sort by one digit at a time. First, you sort all files by their last digit (0-9), then by their second-to-last digit, and so on. After processing all digit positions, your files are perfectly sorted by ID number. The key insight is that you never compare full numbers - you just look at one digit at a time, making it very efficient for sorting numbers or fixed-length strings.`,
    extendedDefinition: `Radix Sort is a non-comparison based sorting algorithm that sorts integers by processing individual digits. It processes digits from least significant digit (LSD) to most significant digit (MSD) or vice versa, using a stable sorting algorithm (typically counting sort) as a subroutine for each digit position.

What it does: sorts numbers by processing individual digits from least to most significant using stable sorting for each digit position.

How it works: determines maximum digits needed, then repeatedly sorts by each digit position using counting sort while maintaining stability.

When to use: sorting integers, fixed-length strings, when O(d×(n+k)) is better than O(n log n), large datasets with small digit range.`,
    realWorldApplications: `**Industry Applications:**
- **Database Systems**: Sorting large integer keys, primary key indexing
- **Computer Graphics**: Z-buffer sorting, pixel coordinate sorting
- **Network Systems**: IP address sorting, packet routing tables
- **Financial Systems**: Account number sorting, transaction ID processing
- **Scientific Computing**: Sorting large datasets of numeric measurements
- **Telecommunications**: Phone number sorting, routing table management
- **Digital Signal Processing**: Sample sorting, frequency domain processing
- **Bioinformatics**: DNA sequence sorting, protein ID classification
- **Gaming**: Player ID sorting, score processing, leaderboard management
- **Manufacturing**: Serial number sorting, batch processing, quality control`,
    keyConcepts: `**Essential Concepts:**
1. **Digit Extraction**: Efficiently extracting specific digit positions from numbers
2. **Stable Subroutine**: Using stable sorting (counting sort) for each digit position
3. **Radix Choice**: Selecting appropriate base (usually 10 for decimal, 2 for binary)
4. **LSD vs MSD**: Understanding when to use least vs most significant digit first
5. **Digit Counting**: Determining maximum number of digits in the dataset
6. **Memory Management**: Efficient use of auxiliary arrays for digit processing
7. **Base Optimization**: Choosing optimal radix for performance (often powers of 2)
8. **String Adaptation**: Extending algorithm to work with fixed-length strings`,
    pseudocode: `**Radix Sort Pseudocode:**

ALGORITHM RadixSort(array)
INPUT: array of non-negative integers
OUTPUT: sorted array
BEGIN
    // Find maximum number to determine digit count
    max = FindMaximum(array)
    digits = CountDigits(max)
    
    // Process each digit position
    FOR digitPosition = 1 TO digits DO
        CountingSortByDigit(array, digitPosition)
    END FOR
    
    RETURN array
END

ALGORITHM CountingSortByDigit(array, digitPosition)
INPUT: array and current digit position (1 = units, 2 = tens, etc.)
OUTPUT: array sorted by specified digit
BEGIN
    n = length(array)
    output = new Array[n]
    count = new Array[10] initialized to 0  // For digits 0-9
    
    // Count occurrences of each digit
    FOR i = 0 TO n - 1 DO
        digit = GetDigit(array[i], digitPosition)
        count[digit] = count[digit] + 1
    END FOR
    
    // Calculate cumulative counts
    FOR i = 1 TO 9 DO
        count[i] = count[i] + count[i - 1]
    END FOR
    
    // Build output array (backwards for stability)
    FOR i = n - 1 DOWN TO 0 DO
        digit = GetDigit(array[i], digitPosition)
        output[count[digit] - 1] = array[i]
        count[digit] = count[digit] - 1
    END FOR
    
    // Copy back to original array
    FOR i = 0 TO n - 1 DO
        array[i] = output[i]
    END FOR
END

ALGORITHM GetDigit(number, position)
INPUT: number and digit position
OUTPUT: digit at specified position
BEGIN
    RETURN (number / (10^(position-1))) MOD 10
END

ALGORITHM MSDRadixSort(array, digitPosition, maxDigits)
INPUT: array, current digit position, maximum digits
OUTPUT: sorted array using MSD approach
BEGIN
    IF digitPosition > maxDigits OR length(array) <= 1 THEN
        RETURN
    END IF
    
    // Create buckets for each digit (0-9)
    buckets = Array of 10 empty lists
    
    // Distribute elements into buckets
    FOR each element in array DO
        digit = GetDigit(element, maxDigits - digitPosition + 1)
        buckets[digit].add(element)
    END FOR
    
    // Recursively sort each bucket
    index = 0
    FOR i = 0 TO 9 DO
        IF buckets[i] is not empty THEN
            MSDRadixSort(buckets[i], digitPosition + 1, maxDigits)
            
            // Copy sorted bucket back to array
            FOR each element in buckets[i] DO
                array[index] = element
                index = index + 1
            END FOR
        END IF
    END FOR
END`,
    implementationCode: `// Comprehensive Radix Sort Implementation

class RadixSort {
    // Standard LSD (Least Significant Digit) radix sort
    static sort(arr) {
        if (arr.length <= 1) return [...arr];
        
        const array = [...arr];
        const max = Math.max(...array);
        const maxDigits = this.countDigits(max);
        
        // Process each digit position
        for (let digitPos = 1; digitPos <= maxDigits; digitPos++) {
            this.countingSortByDigit(array, digitPos);
        }
        
        return array;
    }
    
    // Counting sort by specific digit position
    static countingSortByDigit(arr, digitPosition) {
        const n = arr.length;
        const output = new Array(n);
        const count = new Array(10).fill(0);
        
        // Count occurrences of each digit
        for (let i = 0; i < n; i++) {
            const digit = this.getDigit(arr[i], digitPosition);
            count[digit]++;
        }
        
        // Calculate cumulative counts
        for (let i = 1; i < 10; i++) {
            count[i] += count[i - 1];
        }
        
        // Build output array (backwards for stability)
        for (let i = n - 1; i >= 0; i--) {
            const digit = this.getDigit(arr[i], digitPosition);
            output[count[digit] - 1] = arr[i];
            count[digit]--;
        }
        
        // Copy back to original array
        for (let i = 0; i < n; i++) {
            arr[i] = output[i];
        }
    }
    
    // MSD (Most Significant Digit) radix sort
    static sortMSD(arr) {
        if (arr.length <= 1) return [...arr];
        
        const array = [...arr];
        const max = Math.max(...array);
        const maxDigits = this.countDigits(max);
        
        this.msdRadixSort(array, 0, array.length - 1, maxDigits);
        return array;
    }
    
    static msdRadixSort(arr, low, high, digitPosition) {
        if (low >= high || digitPosition <= 0) return;
        
        // Create buckets for each digit (0-9)
        const buckets = Array.from({ length: 10 }, () => []);
        
        // Distribute elements into buckets
        for (let i = low; i <= high; i++) {
            const digit = this.getDigit(arr[i], digitPosition);
            buckets[digit].push(arr[i]);
        }
        
        // Copy back and recursively sort each bucket
        let index = low;
        for (let i = 0; i < 10; i++) {
            if (buckets[i].length > 0) {
                const bucketStart = index;
                
                // Copy bucket back to array
                for (const element of buckets[i]) {
                    arr[index++] = element;
                }
                
                // Recursively sort this bucket
                if (buckets[i].length > 1) {
                    this.msdRadixSort(arr, bucketStart, index - 1, digitPosition - 1);
                }
            }
        }
    }
    
    // Binary radix sort (base 2)
    static sortBinary(arr) {
        if (arr.length <= 1) return [...arr];
        
        const array = [...arr];
        const max = Math.max(...array);
        const maxBits = Math.floor(Math.log2(max)) + 1;
        
        for (let bit = 0; bit < maxBits; bit++) {
            this.countingSortByBit(array, bit);
        }
        
        return array;
    }
    
    static countingSortByBit(arr, bitPosition) {
        const n = arr.length;
        const output = new Array(n);
        const count = [0, 0]; // For bits 0 and 1
        
        // Count 0s and 1s
        for (let i = 0; i < n; i++) {
            const bit = (arr[i] >> bitPosition) & 1;
            count[bit]++;
        }
        
        // Calculate cumulative count
        count[1] += count[0];
        
        // Build output array
        for (let i = n - 1; i >= 0; i--) {
            const bit = (arr[i] >> bitPosition) & 1;
            output[count[bit] - 1] = arr[i];
            count[bit]--;
        }
        
        // Copy back
        for (let i = 0; i < n; i++) {
            arr[i] = output[i];
        }
    }
    
    // Radix sort with step-by-step visualization
    static sortWithSteps(arr) {
        const array = [...arr];
        const steps = [];
        
        if (array.length <= 1) {
            return { sortedArray: array, steps: [{ phase: 'complete', array: array }] };
        }
        
        const max = Math.max(...array);
        const maxDigits = this.countDigits(max);
        
        steps.push({
            phase: 'initial',
            description: \`Starting radix sort. Maximum number: \${max} has \${maxDigits} digits\`,
            array: [...array],
            maxDigits: maxDigits,
            currentDigit: 0
        });
        
        for (let digitPos = 1; digitPos <= maxDigits; digitPos++) {
            steps.push({
                phase: 'digit-start',
                description: \`Processing digit position \${digitPos} (from right)\`,
                array: [...array],
                currentDigit: digitPos,
                maxDigits: maxDigits
            });
            
            // Show digit extraction
            const digitCounts = new Array(10).fill(0);
            for (const num of array) {
                const digit = this.getDigit(num, digitPos);
                digitCounts[digit]++;
            }
            
            steps.push({
                phase: 'counting',
                description: \`Counting occurrences of each digit at position \${digitPos}\`,
                array: [...array],
                digitCounts: [...digitCounts],
                currentDigit: digitPos
            });
            
            this.countingSortByDigit(array, digitPos);
            
            steps.push({
                phase: 'digit-complete',
                description: \`Completed sorting by digit position \${digitPos}\`,
                array: [...array],
                currentDigit: digitPos,
                maxDigits: maxDigits
            });
        }
        
        steps.push({
            phase: 'complete',
            description: 'Radix sort complete - all digits processed',
            array: [...array],
            sortedArray: [...array]
        });
        
        return {
            sortedArray: array,
            steps: steps
        };
    }
    
    // Radix sort for strings (fixed length)
    static sortStrings(strings, maxLength = null) {
        if (strings.length <= 1) return [...strings];
        
        const array = [...strings];
        const length = maxLength || Math.max(...array.map(s => s.length));
        
        // Process each character position from right to left
        for (let pos = length - 1; pos >= 0; pos--) {
            this.countingSortByCharacter(array, pos);
        }
        
        return array;
    }
    
    static countingSortByCharacter(arr, position) {
        const n = arr.length;
        const output = new Array(n);
        const count = new Array(256).fill(0); // ASCII range
        
        // Count character frequencies
        for (let i = 0; i < n; i++) {
            const char = position < arr[i].length ? arr[i].charCodeAt(position) : 0;
            count[char]++;
        }
        
        // Calculate cumulative counts
        for (let i = 1; i < 256; i++) {
            count[i] += count[i - 1];
        }
        
        // Build output array
        for (let i = n - 1; i >= 0; i--) {
            const char = position < arr[i].length ? arr[i].charCodeAt(position) : 0;
            output[count[char] - 1] = arr[i];
            count[char]--;
        }
        
        // Copy back
        for (let i = 0; i < n; i++) {
            arr[i] = output[i];
        }
    }
    
    // Performance analysis
    static analyzePerformance(arr) {
        const n = arr.length;
        const max = Math.max(...arr);
        const d = this.countDigits(max);
        const k = 10; // Base 10
        
        return {
            inputSize: n,
            maxValue: max,
            digitCount: d,
            base: k,
            timeComplexity: \`O(\${d} × (\${n} + \${k})) = O(\${d * (n + k)})\`,
            spaceComplexity: \`O(\${n} + \${k})\`,
            efficiency: n / (d * (n + k)),
            recommendation: d <= Math.log2(n) ? 'Efficient choice' : 'Consider comparison-based sorting',
            characteristics: {
                stable: true,
                adaptive: false,
                inPlace: false,
                comparisonBased: false
            }
        };
    }
    
    // Utility functions
    static getDigit(number, position) {
        return Math.floor(number / Math.pow(10, position - 1)) % 10;
    }
    
    static countDigits(number) {
        if (number === 0) return 1;
        return Math.floor(Math.log10(Math.abs(number))) + 1;
    }
    
    static getMaxDigits(arr) {
        const max = Math.max(...arr);
        return this.countDigits(max);
    }
    
    static isValidForRadixSort(arr) {
        return arr.every(num => Number.isInteger(num) && num >= 0);
    }
}

// Usage Examples and Testing
console.log('=== Radix Sort Examples ===');

const testCases = {
    integers: [170, 45, 75, 90, 2, 802, 24, 66],
    sameDigits: [123, 456, 789, 321, 654, 987],
    withZeros: [1000, 100, 10, 1, 0],
    large: [999999, 1, 888888, 77777, 6666, 555, 44, 3, 22, 1],
    strings: ['cat', 'dog', 'rat', 'bat', 'hat']
};

// Test different variants
Object.entries(testCases).forEach(([name, data]) => {
    if (name === 'strings') {
        console.log(\`\${name}: \${data}\`);
        console.log(\`  Sorted: \${RadixSort.sortStrings(data, 3)}\`);
    } else {
        console.log(\`\${name}: \${data}\`);
        console.log(\`  LSD: \${RadixSort.sort(data)}\`);
        console.log(\`  MSD: \${RadixSort.sortMSD(data)}\`);
        console.log(\`  Binary: \${RadixSort.sortBinary(data)}\`);
        console.log(\`  Analysis: \${JSON.stringify(RadixSort.analyzePerformance(data))}\`);
        console.log('');
    }
});

// Demonstrate step-by-step sorting
console.log('--- Step-by-Step Radix Sort ---');
const stepDemo = RadixSort.sortWithSteps([170, 45, 75, 90, 2, 802]);
console.log('Final result:', stepDemo.sortedArray);
console.log('Total steps:', stepDemo.steps.length);

// Performance comparison
console.log('--- Performance Analysis ---');
const perfTest = [1234, 5678, 9012, 3456, 7890];
console.log('Performance analysis:', RadixSort.analyzePerformance(perfTest));`,
    quizQuestions: [
      {
        question: "What is the time complexity of radix sort?",
        options: ["O(n log n)", "O(n²)", "O(d × (n + k))", "O(k log k)"],
        correctAnswer: 2,
        explanation: "Radix sort has O(d × (n + k)) time complexity, where d is the number of digits, n is the number of elements, and k is the range of each digit (usually 10)."
      },
      {
        question: "What is the key requirement for radix sort to work efficiently?",
        options: ["Elements must be in random order", "Elements must be integers or fixed-length strings", "Array must be small", "Elements must be unique"],
        correctAnswer: 1,
        explanation: "Radix sort requires elements to be integers or fixed-length strings because it processes individual digit/character positions. It cannot work with variable-length data."
      },
      {
        question: "What is the difference between LSD and MSD radix sort?",
        options: ["LSD is faster than MSD", "LSD processes digits from right to left, MSD from left to right", "LSD uses more memory", "MSD is always stable"],
        correctAnswer: 1,
        explanation: "LSD (Least Significant Digit) processes digits from right to left (units, tens, hundreds), while MSD (Most Significant Digit) processes from left to right."
      },
      {
        question: "Is radix sort a stable sorting algorithm?",
        options: ["Yes, when implemented properly", "No, never stable", "Only LSD version is stable", "Only when using counting sort"],
        correctAnswer: 0,
        explanation: "Radix sort is stable when implemented properly using a stable subroutine (like counting sort) for each digit position, preserving the relative order of equal elements."
      },
      {
        question: "When is radix sort most efficient compared to comparison-based algorithms?",
        options: ["When the number of digits is large", "When the number of digits is small relative to log n", "When elements are already sorted", "When using binary representation"],
        correctAnswer: 1,
        explanation: "Radix sort is most efficient when the number of digits (d) is small relative to log n, making O(d × (n + k)) better than O(n log n) comparison-based algorithms."
      }
    ]
  },
  {
    id: 'bucket-sort',
    title: 'Bucket Sort',
    description: 'Distribute elements into buckets, sort individually, then concatenate - great for uniform data',
    category: 'Sorting',
    difficulty: 'intermediate',
    timeComplexity: 'O(n + k)',
    spaceComplexity: 'O(n + k)',
    voiceExplanation: `Bucket sort is like organizing a library by first separating books into different sections (A-C, D-F, G-I, etc.), then sorting each section individually. You distribute all books into appropriate buckets based on their first letter, then sort each bucket separately using any method you like. Finally, you collect the books from each bucket in order. This works best when books are evenly distributed across the alphabet - if most books start with 'S', you haven't really helped yourself much!`,
    extendedDefinition: `Bucket Sort is a distribution-based sorting algorithm that works by distributing elements into a number of buckets, sorting each bucket individually, and then concatenating the sorted buckets. It's most effective when the input is uniformly distributed across the range of possible values.

What it does: distributes elements into multiple buckets, sorts each bucket individually, then concatenates sorted buckets.

How it works: creates buckets based on value ranges, distributes elements into appropriate buckets, sorts each bucket separately, then combines results.

When to use: uniformly distributed data, floating-point numbers, parallel processing scenarios, large datasets with known ranges.`,
    realWorldApplications: `**Industry Applications:**
- **Graphics Processing**: Color quantization, pixel value sorting, image processing
- **Database Systems**: Range-based indexing, histogram equalization, data partitioning
- **Network Systems**: Load balancing, traffic distribution, packet classification
- **Financial Systems**: Transaction amount sorting, risk categorization, portfolio analysis
- **Scientific Computing**: Experimental data analysis, measurement sorting, statistical processing
- **Gaming**: Score distribution, level progression, player ranking systems
- **E-commerce**: Price range filtering, product categorization, inventory management
- **Data Analytics**: Histogram generation, data binning, statistical analysis
- **Telecommunications**: Call duration analysis, bandwidth allocation, usage patterns
- **Manufacturing**: Quality control sorting, defect classification, batch processing`,
    keyConcepts: `**Essential Concepts:**
1. **Uniform Distribution Assumption**: Algorithm performs best with evenly distributed data
2. **Bucket Count Selection**: Choosing optimal number of buckets for performance
3. **Mapping Function**: Determining how to assign elements to buckets
4. **Individual Bucket Sorting**: Choice of sorting algorithm for each bucket
5. **Load Balancing**: Ensuring buckets have roughly equal sizes
6. **Range Determination**: Finding min/max values to define bucket boundaries
7. **Concatenation Order**: Maintaining sorted order when combining buckets
8. **Adaptive Strategies**: Adjusting algorithm based on data characteristics`,
    pseudocode: `**Bucket Sort Pseudocode:**

ALGORITHM BucketSort(array)
INPUT: array of elements with known range
OUTPUT: sorted array
BEGIN
    n = length(array)
    
    // Determine range and create buckets
    min = FindMinimum(array)
    max = FindMaximum(array)
    bucketCount = n  // Or choose based on data characteristics
    buckets = Array of bucketCount empty lists
    
    // Distribute elements into buckets
    FOR i = 0 TO n - 1 DO
        bucketIndex = GetBucketIndex(array[i], min, max, bucketCount)
        buckets[bucketIndex].add(array[i])
    END FOR
    
    // Sort each bucket individually
    FOR i = 0 TO bucketCount - 1 DO
        Sort(buckets[i])  // Use any sorting algorithm
    END FOR
    
    // Concatenate sorted buckets
    result = empty array
    FOR i = 0 TO bucketCount - 1 DO
        FOR each element in buckets[i] DO
            result.add(element)
        END FOR
    END FOR
    
    RETURN result
END

ALGORITHM GetBucketIndex(element, min, max, bucketCount)
INPUT: element value, range bounds, number of buckets
OUTPUT: bucket index for the element
BEGIN
    IF max = min THEN
        RETURN 0
    END IF
    
    // Normalize to [0, 1) and scale to bucket range
    normalized = (element - min) / (max - min)
    bucketIndex = floor(normalized * bucketCount)
    
    // Handle edge case where element equals max
    IF bucketIndex = bucketCount THEN
        bucketIndex = bucketCount - 1
    END IF
    
    RETURN bucketIndex
END

ALGORITHM AdaptiveBucketSort(array)
INPUT: array with potentially non-uniform distribution
OUTPUT: sorted array
BEGIN
    n = length(array)
    
    // Analyze distribution to determine optimal bucket count
    optimalBuckets = AnalyzeDistribution(array)
    buckets = Array of optimalBuckets empty lists
    
    // Use histogram-based bucket assignment
    FOR each element in array DO
        bucketIndex = HistogramBasedAssignment(element, array)
        buckets[bucketIndex].add(element)
    END FOR
    
    // Sort buckets and concatenate
    result = empty array
    FOR each bucket in buckets DO
        Sort(bucket)
        result.addAll(bucket)
    END FOR
    
    RETURN result
END`,
    implementationCode: `// Comprehensive Bucket Sort Implementation

class BucketSort {
    // Standard bucket sort for uniformly distributed data
    static sort(arr, bucketCount = null) {
        if (arr.length <= 1) return [...arr];
        
        const array = [...arr];
        const n = array.length;
        const min = Math.min(...array);
        const max = Math.max(...array);
        
        // Default bucket count to array length for optimal distribution
        const numBuckets = bucketCount || n;
        const buckets = Array.from({ length: numBuckets }, () => []);
        
        // Distribute elements into buckets
        for (const element of array) {
            const bucketIndex = this.getBucketIndex(element, min, max, numBuckets);
            buckets[bucketIndex].push(element);
        }
        
        // Sort each bucket and concatenate
        const result = [];
        for (const bucket of buckets) {
            if (bucket.length > 0) {
                bucket.sort((a, b) => a - b); // Use built-in sort for simplicity
                result.push(...bucket);
            }
        }
        
        return result;
    }
    
    // Bucket sort with custom sorting algorithm for buckets
    static sortWithCustomAlgorithm(arr, bucketSortFn = null) {
        if (arr.length <= 1) return [...arr];
        
        const array = [...arr];
        const n = array.length;
        const min = Math.min(...array);
        const max = Math.max(...array);
        const buckets = Array.from({ length: n }, () => []);
        
        // Distribute elements
        for (const element of array) {
            const bucketIndex = this.getBucketIndex(element, min, max, n);
            buckets[bucketIndex].push(element);
        }
        
        // Sort each bucket with custom algorithm
        const sortFn = bucketSortFn || this.insertionSort;
        const result = [];
        
        for (const bucket of buckets) {
            if (bucket.length > 0) {
                const sortedBucket = sortFn(bucket);
                result.push(...sortedBucket);
            }
        }
        
        return result;
    }
    
    // Adaptive bucket sort that adjusts to data distribution
    static sortAdaptive(arr) {
        if (arr.length <= 1) return [...arr];
        
        const array = [...arr];
        const distribution = this.analyzeDistribution(array);
        const buckets = this.createAdaptiveBuckets(array, distribution);
        
        // Sort each bucket
        const result = [];
        for (const bucket of buckets) {
            if (bucket.length > 0) {
                // Use different algorithms based on bucket size
                const sortedBucket = bucket.length < 10 
                    ? this.insertionSort(bucket)
                    : bucket.sort((a, b) => a - b);
                result.push(...sortedBucket);
            }
        }
        
        return result;
    }
    
    // Bucket sort with step-by-step visualization
    static sortWithSteps(arr, bucketCount = null) {
        const array = [...arr];
        const steps = [];
        
        if (array.length <= 1) {
            return { sortedArray: array, steps: [{ phase: 'complete', array: array }] };
        }
        
        const n = array.length;
        const min = Math.min(...array);
        const max = Math.max(...array);
        const numBuckets = bucketCount || Math.ceil(Math.sqrt(n));
        
        steps.push({
            phase: 'initial',
            description: \`Starting bucket sort with \${numBuckets} buckets. Range: \${min} to \${max}\`,
            array: [...array],
            bucketCount: numBuckets,
            min: min,
            max: max
        });
        
        // Create empty buckets
        const buckets = Array.from({ length: numBuckets }, () => []);
        
        steps.push({
            phase: 'buckets-created',
            description: \`Created \${numBuckets} empty buckets\`,
            array: [...array],
            buckets: buckets.map(b => [...b]),
            bucketCount: numBuckets
        });
        
        // Distribute elements
        for (let i = 0; i < array.length; i++) {
            const element = array[i];
            const bucketIndex = this.getBucketIndex(element, min, max, numBuckets);
            buckets[bucketIndex].push(element);
            
            steps.push({
                phase: 'distributing',
                description: \`Placed element \${element} into bucket \${bucketIndex}\`,
                array: [...array],
                buckets: buckets.map(b => [...b]),
                currentElement: element,
                currentIndex: i,
                targetBucket: bucketIndex
            });
        }
        
        steps.push({
            phase: 'distribution-complete',
            description: 'All elements distributed into buckets',
            array: [...array],
            buckets: buckets.map(b => [...b])
        });
        
        // Sort each bucket
        for (let i = 0; i < buckets.length; i++) {
            if (buckets[i].length > 0) {
                const originalBucket = [...buckets[i]];
                buckets[i].sort((a, b) => a - b);
                
                steps.push({
                    phase: 'bucket-sorting',
                    description: \`Sorted bucket \${i}: [\${originalBucket}] → [\${buckets[i]}]\`,
                    buckets: buckets.map(b => [...b]),
                    sortedBucket: i,
                    originalBucket: originalBucket,
                    sortedBucketContent: [...buckets[i]]
                });
            }
        }
        
        // Concatenate results
        const result = [];
        for (const bucket of buckets) {
            result.push(...bucket);
        }
        
        steps.push({
            phase: 'concatenation',
            description: 'Concatenating all sorted buckets',
            buckets: buckets.map(b => [...b]),
            result: [...result]
        });
        
        steps.push({
            phase: 'complete',
            description: 'Bucket sort complete',
            array: result,
            sortedArray: result
        });
        
        return {
            sortedArray: result,
            steps: steps
        };
    }
    
    // Bucket sort for floating point numbers in [0, 1)
    static sortFloats(arr) {
        if (arr.length <= 1) return [...arr];
        
        const array = [...arr];
        const n = array.length;
        const buckets = Array.from({ length: n }, () => []);
        
        // Distribute elements (assuming values in [0, 1))
        for (const element of array) {
            const bucketIndex = Math.floor(element * n);
            const index = bucketIndex === n ? n - 1 : bucketIndex;
            buckets[index].push(element);
        }
        
        // Sort each bucket and concatenate
        const result = [];
        for (const bucket of buckets) {
            if (bucket.length > 0) {
                bucket.sort((a, b) => a - b);
                result.push(...bucket);
            }
        }
        
        return result;
    }
    
    // Performance analysis
    static analyzePerformance(arr) {
        const n = arr.length;
        const distribution = this.analyzeDistribution(arr);
        const bucketCount = Math.ceil(Math.sqrt(n));
        
        return {
            inputSize: n,
            recommendedBuckets: bucketCount,
            distribution: distribution,
            expectedTimeComplexity: distribution.isUniform ? 'O(n + k)' : 'O(n²)',
            spaceComplexity: \`O(\${n + bucketCount})\`,
            efficiency: distribution.uniformityScore,
            recommendation: distribution.isUniform ? 'Excellent choice for this data' : 'Consider other algorithms',
            characteristics: {
                stable: true,
                adaptive: true,
                inPlace: false,
                distributionSensitive: true
            }
        };
    }
    
    // Utility functions
    static getBucketIndex(element, min, max, bucketCount) {
        if (max === min) return 0;
        
        const normalized = (element - min) / (max - min);
        const bucketIndex = Math.floor(normalized * bucketCount);
        
        // Handle edge case where element equals max
        return bucketIndex === bucketCount ? bucketCount - 1 : bucketIndex;
    }
    
    static analyzeDistribution(arr) {
        const n = arr.length;
        const min = Math.min(...arr);
        const max = Math.max(...arr);
        const range = max - min;
        
        // Create histogram to analyze distribution
        const histogramBins = Math.ceil(Math.sqrt(n));
        const histogram = new Array(histogramBins).fill(0);
        
        for (const element of arr) {
            const binIndex = range === 0 ? 0 : Math.floor(((element - min) / range) * (histogramBins - 1));
            histogram[binIndex]++;
        }
        
        // Calculate uniformity score
        const expectedPerBin = n / histogramBins;
        const variance = histogram.reduce((sum, count) => sum + Math.pow(count - expectedPerBin, 2), 0) / histogramBins;
        const uniformityScore = 1 / (1 + variance / expectedPerBin);
        
        return {
            min: min,
            max: max,
            range: range,
            histogram: histogram,
            uniformityScore: uniformityScore,
            isUniform: uniformityScore > 0.7
        };
    }
    
    static createAdaptiveBuckets(arr, distribution) {
        const n = arr.length;
        const bucketCount = distribution.isUniform ? n : Math.ceil(Math.sqrt(n));
        const buckets = Array.from({ length: bucketCount }, () => []);
        
        for (const element of arr) {
            const bucketIndex = this.getBucketIndex(element, distribution.min, distribution.max, bucketCount);
            buckets[bucketIndex].push(element);
        }
        
        return buckets;
    }
    
    static insertionSort(arr) {
        const array = [...arr];
        for (let i = 1; i < array.length; i++) {
            const key = array[i];
            let j = i - 1;
            while (j >= 0 && array[j] > key) {
                array[j + 1] = array[j];
                j--;
            }
            array[j + 1] = key;
        }
        return array;
    }
    
    static isSuitableForBucketSort(arr) {
        const distribution = this.analyzeDistribution(arr);
        return distribution.isUniform && distribution.range > 0;
    }
}

// Usage Examples and Testing
console.log('=== Bucket Sort Examples ===');

const testCases = {
    uniform: [0.78, 0.17, 0.39, 0.26, 0.72, 0.94, 0.21, 0.12, 0.23, 0.68],
    integers: [29, 25, 3, 49, 9, 37, 21, 43, 1, 5],
    clustered: [1, 2, 3, 97, 98, 99, 50, 51, 52],
    identical: [5, 5, 5, 5, 5],
    sorted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
};

// Test different scenarios
Object.entries(testCases).forEach(([name, data]) => {
    console.log(\`\${name}: \${data}\`);
    console.log(\`  Standard: \${BucketSort.sort(data)}\`);
    console.log(\`  Adaptive: \${BucketSort.sortAdaptive(data)}\`);
    console.log(\`  Analysis: \${JSON.stringify(BucketSort.analyzePerformance(data))}\`);
    console.log(\`  Suitable: \${BucketSort.isSuitableForBucketSort(data)}\`);
    console.log('');
});

// Demonstrate step-by-step sorting
console.log('--- Step-by-Step Bucket Sort ---');
const stepDemo = BucketSort.sortWithSteps([0.78, 0.17, 0.39, 0.26, 0.72]);
console.log('Final result:', stepDemo.sortedArray);
console.log('Total steps:', stepDemo.steps.length);

// Test floating point sorting
console.log('--- Floating Point Bucket Sort ---');
const floats = [0.897, 0.565, 0.656, 0.1234, 0.665, 0.3434];
console.log('Floats sorted:', BucketSort.sortFloats(floats));`,
    quizQuestions: [
      {
        question: "When does bucket sort perform optimally?",
        options: ["When all elements are identical", "When elements are uniformly distributed", "When the array is already sorted", "When the array is very large"],
        correctAnswer: 1,
        explanation: "Bucket sort performs optimally when elements are uniformly distributed across the range, ensuring roughly equal bucket sizes and achieving O(n + k) time complexity."
      },
      {
        question: "What is the worst-case time complexity of bucket sort?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(k log k)"],
        correctAnswer: 2,
        explanation: "Bucket sort has O(n²) worst-case time complexity when all elements fall into a single bucket, requiring the bucket sorting algorithm to sort all n elements."
      },
      {
        question: "What sorting algorithm is typically used to sort individual buckets?",
        options: ["Bubble sort", "Insertion sort", "Quick sort", "Any comparison-based algorithm"],
        correctAnswer: 3,
        explanation: "Any comparison-based sorting algorithm can be used for individual buckets. The choice depends on bucket size - insertion sort for small buckets, quicksort or mergesort for larger ones."
      },
      {
        question: "Is bucket sort a stable sorting algorithm?",
        options: ["Yes, always stable", "No, never stable", "Only when using stable bucket sorting", "Depends on input distribution"],
        correctAnswer: 2,
        explanation: "Bucket sort is stable only when the algorithm used to sort individual buckets is stable, and elements are processed in their original order during distribution."
      },
      {
        question: "What is the main disadvantage of bucket sort?",
        options: ["High time complexity", "Requires uniform data distribution", "Not stable", "Cannot handle duplicates"],
        correctAnswer: 1,
        explanation: "The main disadvantage is that bucket sort requires uniform data distribution to perform well. With skewed data, most elements may fall into few buckets, degrading performance."
      }
    ]
  },

  // Searching
  {
    id: 'linear-search',
    title: 'Linear Search',
    description: 'Sequential search through array elements one by one',
    category: 'Searching',
    difficulty: 'beginner',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    extendedDefinition: `Linear Search, also known as Sequential Search, is the simplest searching algorithm that examines each element of a collection sequentially until the target element is found or the entire collection has been traversed. It works on both sorted and unsorted data structures.

What it does: searches through elements one by one from start to end until target is found or all elements checked.

How it works: starts at first element, compares each element with target, returns index when found or -1 if not present.

When to use: small datasets, unsorted data, simple implementation needed, when data structure doesn't support faster search methods.`,
    voiceExplanation: `Think of linear search like looking for a specific book on a bookshelf. You start from the leftmost book and check each book one by one, reading the title until you find the book you're looking for. If you reach the end of the shelf without finding it, you know the book isn't there. This is exactly how linear search works - it's like having a methodical person who checks every single item in order, never skipping anything. While it might not be the fastest method for large collections, it's reliable, simple, and works regardless of whether your data is organized or not. It's the "brute force" approach that guarantees you'll find what you're looking for if it exists.`,
    realWorldApplications: `**Industry Applications:**
- **Small Datasets**: Contact lists, small inventories, configuration files
- **Unsorted Data**: Real-time data streams, log files, user input validation
- **Database Systems**: Table scans when no index is available, full-text search
- **Web Development**: Form validation, searching through DOM elements
- **Mobile Apps**: Searching through device contacts, recent calls, message history
- **Gaming**: Finding objects in small game inventories, player searches
- **Embedded Systems**: Sensor data processing, simple device configurations
- **File Systems**: Searching files in directories, grep-like operations
- **Quality Assurance**: Test case execution, bug tracking systems
- **Educational Software**: Simple search features, learning management systems`,
    keyConcepts: `**Essential Concepts:**
1. **Sequential Access**: Examining elements one after another in order
2. **Early Termination**: Stopping as soon as the target is found
3. **Exhaustive Search**: Checking all elements if target is not found
4. **Index Tracking**: Keeping track of current position during search
5. **Comparison Operations**: Using equality checks to match target
6. **Return Strategies**: Returning index, element, or boolean based on requirements
7. **Multiple Occurrences**: Handling cases where target appears multiple times
8. **Sentinel Search**: Optimization technique using a sentinel value`,
    pseudocode: `**Linear Search Pseudocode:**

ALGORITHM LinearSearch(array, target)
INPUT: array - collection of elements, target - value to search for
OUTPUT: index of target or -1 if not found
BEGIN
    FOR i = 0 TO array.length - 1 DO
        IF array[i] = target THEN
            RETURN i
        END IF
    END FOR
    RETURN -1
END

ALGORITHM LinearSearchAll(array, target)
INPUT: array - collection of elements, target - value to search for
OUTPUT: array of all indices where target is found
BEGIN
    indices = []
    FOR i = 0 TO array.length - 1 DO
        IF array[i] = target THEN
            indices.append(i)
        END IF
    END FOR
    RETURN indices
END

ALGORITHM SentinelLinearSearch(array, target)
INPUT: array - collection of elements, target - value to search for
OUTPUT: index of target or -1 if not found
BEGIN
    last = array[array.length - 1]
    array[array.length - 1] = target
    
    i = 0
    WHILE array[i] ≠ target DO
        i = i + 1
    END WHILE
    
    array[array.length - 1] = last
    
    IF i < array.length - 1 OR last = target THEN
        RETURN i
    ELSE
        RETURN -1
    END IF
END`,
    implementationCode: `class LinearSearch {
    // Basic linear search - returns first occurrence
    static search(array, target) {
        for (let i = 0; i < array.length; i++) {
            if (array[i] === target) {
                return i;
            }
        }
        return -1;
    }
    
    // Search for all occurrences
    static searchAll(array, target) {
        const indices = [];
        for (let i = 0; i < array.length; i++) {
            if (array[i] === target) {
                indices.push(i);
            }
        }
        return indices;
    }
    
    // Search with custom comparison function
    static searchWithComparator(array, target, compareFn) {
        for (let i = 0; i < array.length; i++) {
            if (compareFn(array[i], target)) {
                return i;
            }
        }
        return -1;
    }
    
    // Search in object array by property
    static searchObject(array, property, value) {
        for (let i = 0; i < array.length; i++) {
            if (array[i][property] === value) {
                return array[i];
            }
        }
        return null;
    }
    
    // Sentinel linear search (optimization)
    static sentinelSearch(array, target) {
        if (array.length === 0) return -1;
        
        const last = array[array.length - 1];
        array[array.length - 1] = target;
        
        let i = 0;
        while (array[i] !== target) {
            i++;
        }
        
        array[array.length - 1] = last;
        
        if (i < array.length - 1 || last === target) {
            return i;
        }
        return -1;
    }
    
    // Search with early termination condition
    static searchUntil(array, target, maxIndex) {
        const limit = Math.min(maxIndex, array.length);
        for (let i = 0; i < limit; i++) {
            if (array[i] === target) {
                return i;
            }
        }
        return -1;
    }
    
    // Count occurrences
    static count(array, target) {
        let count = 0;
        for (let i = 0; i < array.length; i++) {
            if (array[i] === target) {
                count++;
            }
        }
        return count;
    }
    
    // Check if element exists
    static contains(array, target) {
        return this.search(array, target) !== -1;
    }
    
    // Find first element matching condition
    static findFirst(array, predicate) {
        for (let i = 0; i < array.length; i++) {
            if (predicate(array[i])) {
                return { element: array[i], index: i };
            }
        }
        return null;
    }
    
    // Find last occurrence
    static findLast(array, target) {
        for (let i = array.length - 1; i >= 0; i--) {
            if (array[i] === target) {
                return i;
            }
        }
        return -1;
    }
    
    // Search with statistics
    static searchWithStats(array, target) {
        let comparisons = 0;
        for (let i = 0; i < array.length; i++) {
            comparisons++;
            if (array[i] === target) {
                return { index: i, comparisons };
            }
        }
        return { index: -1, comparisons };
    }
}

// Usage Examples
const numbers = [64, 34, 25, 12, 22, 11, 90, 25];
console.log("Search 25:", LinearSearch.search(numbers, 25)); // 2
console.log("Search all 25:", LinearSearch.searchAll(numbers, 25)); // [2, 7]
console.log("Count 25:", LinearSearch.count(numbers, 25)); // 2
console.log("Contains 100:", LinearSearch.contains(numbers, 100)); // false

const users = [
    { id: 1, name: "Alice", age: 30 },
    { id: 2, name: "Bob", age: 25 },
    { id: 3, name: "Charlie", age: 35 }
];
console.log("Find Bob:", LinearSearch.searchObject(users, "name", "Bob"));`,
    quizQuestions: [
      {
        question: "What is the time complexity of linear search in the worst case?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correctAnswer: 2,
        explanation: "In the worst case, linear search must examine every element in the array, resulting in O(n) time complexity."
      },
      {
        question: "Which statement about linear search is TRUE?",
        options: ["Requires sorted data", "Only works on arrays", "Can work on unsorted data", "Has O(log n) complexity"],
        correctAnswer: 2,
        explanation: "Linear search can work on both sorted and unsorted data, making it very versatile but not always the most efficient."
      },
      {
        question: "What is the best-case time complexity of linear search?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctAnswer: 0,
        explanation: "The best case occurs when the target element is the first element in the array, requiring only one comparison - O(1)."
      },
      {
        question: "In which scenario is linear search preferred over binary search?",
        options: ["Large sorted arrays", "Small unsorted arrays", "Always prefer binary search", "Only for strings"],
        correctAnswer: 1,
        explanation: "Linear search is preferred for small unsorted arrays because it doesn't require sorting and has simple implementation."
      },
      {
        question: "What does the sentinel linear search optimization do?",
        options: ["Sorts the array first", "Eliminates the boundary check in the loop", "Uses binary search internally", "Only works on sorted arrays"],
        correctAnswer: 1,
        explanation: "Sentinel search places the target at the end of the array, eliminating the need to check array bounds in each iteration."
      }
    ],
    example: `// Linear Search Implementation
function linearSearch(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) {
            return i; // Return index if found
        }
    }
    return -1; // Return -1 if not found
}

// Linear Search with All Occurrences
function linearSearchAll(arr, target) {
    const indices = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) {
            indices.push(i);
        }
    }
    return indices;
}

// Linear Search in Objects
function linearSearchObject(arr, key, value) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][key] === value) {
            return arr[i];
        }
    }
    return null;
}

// Example usage
const numbers = [2, 4, 6, 8, 10, 12, 14];
console.log(linearSearch(numbers, 8));  // Output: 3
console.log(linearSearch(numbers, 15)); // Output: -1

const duplicates = [1, 3, 5, 3, 7, 3, 9];
console.log(linearSearchAll(duplicates, 3)); // Output: [1, 3, 5]

const users = [{id: 1, name: "Alice"}, {id: 2, name: "Bob"}];
console.log(linearSearchObject(users, "name", "Bob")); // Output: {id: 2, name: "Bob"}`,
    syntax: `**Linear Search Patterns:**

1. **Basic Linear Search:**
   \`\`\`javascript
   function linearSearch(arr, target) {
       for (let i = 0; i < arr.length; i++) {
           if (arr[i] === target) return i;
       }
       return -1;
   }
   \`\`\`

2. **Linear Search with Condition:**
   \`\`\`javascript
   function findFirst(arr, condition) {
       for (let i = 0; i < arr.length; i++) {
           if (condition(arr[i])) return arr[i];
       }
       return null;
   }
   
   // Usage: findFirst([1, 2, 3, 4], x => x > 2) returns 3
   \`\`\`

3. **Sentinel Linear Search:**
   \`\`\`javascript
   function sentinelSearch(arr, target) {
       const last = arr[arr.length - 1];
       arr[arr.length - 1] = target;
       
       let i = 0;
       while (arr[i] !== target) i++;
       
       arr[arr.length - 1] = last;
       return (i < arr.length - 1 || last === target) ? i : -1;
   }
   \`\`\``
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    description: 'Efficient search in sorted arrays using divide and conquer',
    category: 'Searching',
    difficulty: 'beginner',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    extendedDefinition: `Binary Search is a highly efficient searching algorithm that works on sorted arrays by repeatedly dividing the search interval in half. It compares the target value with the middle element and eliminates half of the remaining elements in each iteration.

What it does: searches sorted arrays by repeatedly dividing search space in half, comparing target with middle element.

How it works: compares target with middle element, eliminates half the array based on comparison, repeats until found or search space empty.

When to use: large sorted datasets, when O(log n) search time needed, arrays with random access, when data doesn't change frequently.`,
    voiceExplanation: `Imagine you're looking for a word in a dictionary. Instead of starting from the first page, you open it in the middle. If your word comes before the middle word alphabetically, you know it's in the first half, so you discard the second half. If it comes after, you discard the first half. You repeat this process, always going to the middle of the remaining section, until you find your word. This is exactly how binary search works! Each step eliminates half of the possibilities, making it incredibly fast. For a million items, you'd only need about 20 steps to find what you're looking for, compared to potentially checking all million items with a linear search.`,
    realWorldApplications: `**Industry Applications:**
- **Database Systems**: Index searching, B-tree operations, query optimization
- **Search Engines**: Ranking algorithms, autocomplete suggestions
- **Version Control**: Git bisect for finding bug-introducing commits
- **Computer Graphics**: Ray tracing, collision detection, spatial partitioning
- **Machine Learning**: Hyperparameter tuning, decision trees, feature selection
- **Operating Systems**: Process scheduling, memory allocation, file systems
- **Financial Systems**: Options pricing, risk analysis, algorithmic trading
- **Game Development**: Pathfinding optimizations, level-of-detail systems
- **Networking**: Routing tables, load balancing, bandwidth allocation`,
    keyConcepts: `**Essential Concepts:**
1. **Sorted Prerequisite**: Array must be sorted for binary search to work
2. **Divide and Conquer**: Systematically eliminate half the search space
3. **Invariant Maintenance**: Target is always within the current search bounds
4. **Boundary Conditions**: Proper handling of left, right, and middle pointers
5. **Integer Overflow**: Safe calculation of middle index: left + (right - left) / 2
6. **Termination Conditions**: When to stop searching (found vs. not found)
7. **Variants**: Understanding different types of binary search applications`,
    pseudocode: `**Binary Search Pseudocode:**

ALGORITHM BinarySearch(array, target)
INPUT: sorted array, target value to find
OUTPUT: index of target or -1 if not found
BEGIN
    left = 0
    right = array.length - 1
    
    WHILE left <= right DO
        middle = left + (right - left) / 2
        
        IF array[middle] == target THEN
            RETURN middle
        ELSE IF array[middle] < target THEN
            left = middle + 1
        ELSE
            right = middle - 1
        END IF
    END WHILE
    
    RETURN -1  // Target not found
END

ALGORITHM BinarySearchRecursive(array, target, left, right)
INPUT: sorted array, target, left bound, right bound
OUTPUT: index of target or -1 if not found
BEGIN
    IF left > right THEN
        RETURN -1
    END IF
    
    middle = left + (right - left) / 2
    
    IF array[middle] == target THEN
        RETURN middle
    ELSE IF array[middle] < target THEN
        RETURN BinarySearchRecursive(array, target, middle + 1, right)
    ELSE
        RETURN BinarySearchRecursive(array, target, left, middle - 1)
    END IF
END`,
    implementationCode: `// Comprehensive Binary Search Implementation

class BinarySearch {
    // Standard Binary Search - Iterative
    static search(arr, target) {
        let left = 0;
        let right = arr.length - 1;
        
        while (left <= right) {
            // Prevent integer overflow
            const mid = left + Math.floor((right - left) / 2);
            
            if (arr[mid] === target) {
                return mid;
            } else if (arr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return -1; // Target not found
    }
    
    // Recursive Binary Search
    static searchRecursive(arr, target, left = 0, right = arr.length - 1) {
        if (left > right) {
            return -1;
        }
        
        const mid = left + Math.floor((right - left) / 2);
        
        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            return this.searchRecursive(arr, target, mid + 1, right);
        } else {
            return this.searchRecursive(arr, target, left, mid - 1);
        }
    }
    
    // Find First Occurrence (Lower Bound)
    static findFirst(arr, target) {
        let left = 0;
        let right = arr.length - 1;
        let result = -1;
        
        while (left <= right) {
            const mid = left + Math.floor((right - left) / 2);
            
            if (arr[mid] === target) {
                result = mid;
                right = mid - 1; // Continue searching in left half
            } else if (arr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return result;
    }
    
    // Find Last Occurrence (Upper Bound)
    static findLast(arr, target) {
        let left = 0;
        let right = arr.length - 1;
        let result = -1;
        
        while (left <= right) {
            const mid = left + Math.floor((right - left) / 2);
            
            if (arr[mid] === target) {
                result = mid;
                left = mid + 1; // Continue searching in right half
            } else if (arr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return result;
    }
    
    // Find insertion point for target
    static findInsertionPoint(arr, target) {
        let left = 0;
        let right = arr.length;
        
        while (left < right) {
            const mid = left + Math.floor((right - left) / 2);
            
            if (arr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        
        return left;
    }
    
    // Search in rotated sorted array
    static searchRotated(arr, target) {
        let left = 0;
        let right = arr.length - 1;
        
        while (left <= right) {
            const mid = left + Math.floor((right - left) / 2);
            
            if (arr[mid] === target) {
                return mid;
            }
            
            // Check which half is sorted
            if (arr[left] <= arr[mid]) {
                // Left half is sorted
                if (target >= arr[left] && target < arr[mid]) {
                    right = mid - 1;
                } else {
                    left = mid + 1;
                }
            } else {
                // Right half is sorted
                if (target > arr[mid] && target <= arr[right]) {
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }
        }
        
        return -1;
    }
    
    // Find peak element (local maximum)
    static findPeak(arr) {
        let left = 0;
        let right = arr.length - 1;
        
        while (left < right) {
            const mid = left + Math.floor((right - left) / 2);
            
            if (arr[mid] < arr[mid + 1]) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        
        return left;
    }
}

// Usage Examples and Testing
const sortedArray = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
const duplicateArray = [1, 2, 2, 2, 3, 4, 5];
const rotatedArray = [4, 5, 6, 7, 0, 1, 2];

console.log(BinarySearch.search(sortedArray, 7)); // 3
console.log(BinarySearch.searchRecursive(sortedArray, 13)); // 6
console.log(BinarySearch.findFirst(duplicateArray, 2)); // 1
console.log(BinarySearch.findLast(duplicateArray, 2)); // 3
console.log(BinarySearch.findInsertionPoint(sortedArray, 8)); // 4
console.log(BinarySearch.searchRotated(rotatedArray, 0)); // 4`,
    example: `// Basic Binary Search Example
function binarySearch(arr, target) {
    let left = 0, right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;

// Example usage
const numbers = [1, 3, 5, 7, 9, 11, 13, 15];
console.log(BinarySearch.search(numbers, 7)); // Output: 3
console.log(BinarySearch.search(numbers, 4)); // Output: -1`,
    quizQuestions: [
      {
        question: "What is the main prerequisite for binary search to work correctly?",
        options: ["Array must be sorted", "Array must have even length", "Array must contain unique elements", "Array must be of primitive types"],
        correctAnswer: 0,
        explanation: "Binary search requires the array to be sorted because it relies on the property that elements are in order to eliminate half the search space."
      },
      {
        question: "What is the time complexity of binary search?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctAnswer: 1,
        explanation: "Binary search has O(log n) time complexity because it eliminates half of the remaining elements in each iteration."
      },
      {
        question: "Why should you use 'left + (right - left) / 2' instead of '(left + right) / 2' for calculating mid?",
        options: ["It's faster", "Prevents integer overflow", "It's more readable", "No difference"],
        correctAnswer: 1,
        explanation: "Using 'left + (right - left) / 2' prevents integer overflow that could occur when left + right exceeds the maximum integer value."
      },
      {
        question: "In which scenario would binary search perform poorly compared to linear search?",
        options: ["Large sorted array", "Small unsorted array", "Array with duplicates", "Array of strings"],
        correctAnswer: 1,
        explanation: "Binary search cannot work on unsorted arrays, so you'd need to sort first, making it inefficient for small datasets where linear search would be faster."
      },
      {
        question: "What happens when binary search looks for an element that doesn't exist?",
        options: ["Returns the closest element", "Returns -1 or null", "Throws an exception", "Returns the middle element"],
        correctAnswer: 1,
        explanation: "When the target element is not found, binary search typically returns -1 or null to indicate the element is not present in the array."
      }
    ]
  },
  {
    id: 'interpolation-search',
    title: 'Interpolation Search',
    description: 'Improved binary search for uniformly distributed data',
    category: 'Searching',
    difficulty: 'intermediate',
    timeComplexity: 'O(log log n)',
    spaceComplexity: 'O(1)',
    extendedDefinition: `Interpolation Search is an enhanced version of binary search that works optimally on uniformly distributed sorted arrays. Instead of always checking the middle element like binary search, it estimates the position of the target value based on the distribution of values in the array.

What it does: estimates target position using linear interpolation formula based on value distribution rather than always checking middle.

How it works: calculates probe position using interpolation formula, compares with target, adjusts search bounds based on result.

When to use: uniformly distributed sorted data, numerical datasets, when O(log log n) performance needed, large datasets with predictable distribution.`,
    voiceExplanation: `Think of interpolation search like looking up a phone number in a phone book. If you're looking for someone whose name starts with 'M', you don't open the book in the middle - you estimate that 'M' is roughly in the middle and open it there. If you're looking for 'A', you open near the beginning. If you're looking for 'Z', you open near the end. This is exactly how interpolation search works! It makes an educated guess about where your target value should be based on its value relative to the range of values in the array. For uniformly distributed data, this smart guessing can be much faster than binary search's fixed middle-point approach.`,
    realWorldApplications: `**Industry Applications:**
- **Database Systems**: Index searching in B+ trees, range queries on sorted columns
- **Numerical Analysis**: Root finding algorithms, function approximation
- **Computer Graphics**: Texture mapping, color interpolation, animation curves
- **Financial Systems**: Time series analysis, price prediction models
- **Scientific Computing**: Interpolation in lookup tables, numerical integration
- **Geographic Information Systems**: Coordinate mapping, elevation data queries
- **Signal Processing**: Sample rate conversion, digital filtering
- **Game Development**: Physics simulations, pathfinding optimizations
- **Data Analytics**: Statistical analysis on sorted datasets
- **Network Protocols**: Timestamp-based packet ordering, bandwidth allocation`,
    keyConcepts: `**Essential Concepts:**
1. **Linear Interpolation**: Estimating position based on value distribution
2. **Uniform Distribution**: Algorithm works best when data is evenly spaced
3. **Probe Position**: Calculated position where target is likely to be found
4. **Adaptive Search**: Search interval adjustment based on comparison results
5. **Boundary Conditions**: Handling edge cases and out-of-range values
6. **Performance Degradation**: Understanding when algorithm becomes inefficient
7. **Numerical Stability**: Avoiding division by zero and overflow issues
8. **Comparison Strategy**: When to prefer over binary search`,
    pseudocode: `**Interpolation Search Pseudocode:**

ALGORITHM InterpolationSearch(array, target)
INPUT: sorted array, target value to find
OUTPUT: index of target or -1 if not found
BEGIN
    low = 0
    high = array.length - 1
    
    WHILE low <= high AND target >= array[low] AND target <= array[high] DO
        IF low = high THEN
            IF array[low] = target THEN
                RETURN low
            ELSE
                RETURN -1
            END IF
        END IF
        
        // Calculate interpolated position
        pos = low + floor(((target - array[low]) / (array[high] - array[low])) * (high - low))
        
        IF array[pos] = target THEN
            RETURN pos
        ELSE IF array[pos] < target THEN
            low = pos + 1
        ELSE
            high = pos - 1
        END IF
    END WHILE
    
    RETURN -1
END

ALGORITHM InterpolationSearchRecursive(array, target, low, high)
INPUT: sorted array, target, low bound, high bound
OUTPUT: index of target or -1 if not found
BEGIN
    IF low > high OR target < array[low] OR target > array[high] THEN
        RETURN -1
    END IF
    
    IF low = high THEN
        IF array[low] = target THEN
            RETURN low
        ELSE
            RETURN -1
        END IF
    END IF
    
    pos = low + floor(((target - array[low]) / (array[high] - array[low])) * (high - low))
    
    IF array[pos] = target THEN
        RETURN pos
    ELSE IF array[pos] < target THEN
        RETURN InterpolationSearchRecursive(array, target, pos + 1, high)
    ELSE
        RETURN InterpolationSearchRecursive(array, target, low, pos - 1)
    END IF
END`,
    implementationCode: `class InterpolationSearch {
    // Standard Interpolation Search - Iterative
    static search(arr, target) {
        let low = 0;
        let high = arr.length - 1;
        
        while (low <= high && target >= arr[low] && target <= arr[high]) {
            // Handle single element case
            if (low === high) {
                return arr[low] === target ? low : -1;
            }
            
            // Calculate interpolated position
            const pos = low + Math.floor(
                ((target - arr[low]) / (arr[high] - arr[low])) * (high - low)
            );
            
            if (arr[pos] === target) {
                return pos;
            } else if (arr[pos] < target) {
                low = pos + 1;
            } else {
                high = pos - 1;
            }
        }
        
        return -1; // Target not found
    }
    
    // Recursive Interpolation Search
    static searchRecursive(arr, target, low = 0, high = arr.length - 1) {
        if (low > high || target < arr[low] || target > arr[high]) {
            return -1;
        }
        
        if (low === high) {
            return arr[low] === target ? low : -1;
        }
        
        const pos = low + Math.floor(
            ((target - arr[low]) / (arr[high] - arr[low])) * (high - low)
        );
        
        if (arr[pos] === target) {
            return pos;
        } else if (arr[pos] < target) {
            return this.searchRecursive(arr, target, pos + 1, high);
        } else {
            return this.searchRecursive(arr, target, low, pos - 1);
        }
    }
    
    // Safe Interpolation Search (handles edge cases)
    static searchSafe(arr, target) {
        if (!arr || arr.length === 0) return -1;
        if (arr.length === 1) return arr[0] === target ? 0 : -1;
        
        let low = 0;
        let high = arr.length - 1;
        
        while (low <= high && target >= arr[low] && target <= arr[high]) {
            if (low === high) {
                return arr[low] === target ? low : -1;
            }
            
            // Prevent division by zero
            if (arr[high] === arr[low]) {
                // Fall back to linear search for duplicate values
                for (let i = low; i <= high; i++) {
                    if (arr[i] === target) return i;
                }
                return -1;
            }
            
            const pos = low + Math.floor(
                ((target - arr[low]) / (arr[high] - arr[low])) * (high - low)
            );
            
            // Ensure pos is within bounds
            const clampedPos = Math.max(low, Math.min(high, pos));
            
            if (arr[clampedPos] === target) {
                return clampedPos;
            } else if (arr[clampedPos] < target) {
                low = clampedPos + 1;
            } else {
                high = clampedPos - 1;
            }
        }
        
        return -1;
    }
    
    // Interpolation Search with statistics
    static searchWithStats(arr, target) {
        let probes = 0;
        let low = 0;
        let high = arr.length - 1;
        
        while (low <= high && target >= arr[low] && target <= arr[high]) {
            probes++;
            
            if (low === high) {
                return { 
                    index: arr[low] === target ? low : -1, 
                    probes,
                    efficiency: probes <= Math.log2(arr.length) ? 'Good' : 'Poor'
                };
            }
            
            const pos = low + Math.floor(
                ((target - arr[low]) / (arr[high] - arr[low])) * (high - low)
            );
            
            if (arr[pos] === target) {
                return { 
                    index: pos, 
                    probes,
                    efficiency: probes <= Math.log2(Math.log2(arr.length)) ? 'Excellent' : 'Good'
                };
            } else if (arr[pos] < target) {
                low = pos + 1;
            } else {
                high = pos - 1;
            }
        }
        
        return { index: -1, probes, efficiency: 'Not Found' };
    }
    
    // Compare with Binary Search
    static compareWithBinary(arr, target) {
        const startTime = performance.now();
        const interpResult = this.searchWithStats(arr, target);
        const interpTime = performance.now() - startTime;
        
        const binaryStartTime = performance.now();
        let binaryProbes = 0;
        let low = 0, high = arr.length - 1;
        let binaryIndex = -1;
        
        while (low <= high) {
            binaryProbes++;
            const mid = Math.floor((low + high) / 2);
            
            if (arr[mid] === target) {
                binaryIndex = mid;
                break;
            } else if (arr[mid] < target) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        
        const binaryTime = performance.now() - binaryStartTime;
        
        return {
            interpolation: {
                index: interpResult.index,
                probes: interpResult.probes,
                time: interpTime
            },
            binary: {
                index: binaryIndex,
                probes: binaryProbes,
                time: binaryTime
            },
            winner: interpResult.probes < binaryProbes ? 'Interpolation' : 'Binary'
        };
    }
    
    // Check if array is suitable for interpolation search
    static isUniformlyDistributed(arr, threshold = 0.1) {
        if (arr.length < 3) return true;
        
        const expectedDiff = (arr[arr.length - 1] - arr[0]) / (arr.length - 1);
        let deviations = 0;
        
        for (let i = 1; i < arr.length; i++) {
            const actualDiff = arr[i] - arr[i - 1];
            const deviation = Math.abs(actualDiff - expectedDiff) / expectedDiff;
            if (deviation > threshold) deviations++;
        }
        
        return deviations / (arr.length - 1) < threshold;
    }
}

// Usage Examples and Testing
const uniformArray = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const nonUniformArray = [1, 2, 3, 100, 200, 300, 1000, 2000];

console.log("Uniform array search:", InterpolationSearch.search(uniformArray, 70)); // 6
console.log("Non-uniform array search:", InterpolationSearch.search(nonUniformArray, 100)); // 3

console.log("Search with stats:", InterpolationSearch.searchWithStats(uniformArray, 70));
console.log("Comparison:", InterpolationSearch.compareWithBinary(uniformArray, 70));
console.log("Is uniform?", InterpolationSearch.isUniformlyDistributed(uniformArray)); // true
console.log("Is uniform?", InterpolationSearch.isUniformlyDistributed(nonUniformArray)); // false`,
    example: `// Basic Interpolation Search Example
function interpolationSearch(arr, target) {
    let low = 0, high = arr.length - 1;
    
    while (low <= high && target >= arr[low] && target <= arr[high]) {
        if (low === high) {
            return arr[low] === target ? low : -1;
        }
        
        // Calculate interpolated position
        const pos = low + Math.floor(
            ((target - arr[low]) / (arr[high] - arr[low])) * (high - low)
        );
        
        if (arr[pos] === target) return pos;
        else if (arr[pos] < target) low = pos + 1;
        else high = pos - 1;
    }
    
    return -1;
}

// Example usage
const uniformData = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
console.log(interpolationSearch(uniformData, 70)); // Output: 6

// Comparison with Binary Search
function binarySearch(arr, target) {
    let low = 0, high = arr.length - 1;
    
    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        if (arr[mid] === target) return mid;
        else if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}

console.log("Binary search result:", binarySearch(uniformData, 70)); // Output: 6`,
    syntax: `**Interpolation Search Patterns:**

1. **Basic Interpolation Search:**
   \`\`\`javascript
   function interpolationSearch(arr, target) {
       let low = 0, high = arr.length - 1;
       
       while (low <= high && target >= arr[low] && target <= arr[high]) {
           if (low === high) return arr[low] === target ? low : -1;
           
           const pos = low + Math.floor(
               ((target - arr[low]) / (arr[high] - arr[low])) * (high - low)
           );
           
           if (arr[pos] === target) return pos;
           arr[pos] < target ? low = pos + 1 : high = pos - 1;
       }
       return -1;
   }
   \`\`\`

2. **Position Formula:**
   \`\`\`javascript
   // Interpolation formula estimates position
   pos = low + [(target - arr[low]) / (arr[high] - arr[low])] * (high - low)
   
   // This assumes uniform distribution
   // Better than binary search's fixed midpoint: mid = (low + high) / 2
   \`\`\`

3. **Safe Implementation:**
   \`\`\`javascript
   function safeInterpolationSearch(arr, target) {
       if (arr[high] === arr[low]) {
           // Fall back to linear search for duplicates
           return linearSearch(arr, target);
       }
       // Continue with interpolation...
   }
   \`\`\``,
    quizQuestions: [
      {
        question: "What is the main advantage of interpolation search over binary search?",
        options: ["Works on unsorted arrays", "Better performance on uniformly distributed data", "Uses less memory", "Simpler implementation"],
        correctAnswer: 1,
        explanation: "Interpolation search can achieve O(log log n) time complexity on uniformly distributed data by making educated guesses about target position, compared to binary search's O(log n)."
      },
      {
        question: "What happens to interpolation search performance on non-uniformly distributed data?",
        options: ["Becomes O(1)", "Remains O(log log n)", "Degrades to O(n)", "Becomes O(log n)"],
        correctAnswer: 2,
        explanation: "On non-uniformly distributed data, interpolation search can degrade to O(n) in the worst case because the position estimates become poor."
      },
      {
        question: "Which formula is used to calculate the probe position in interpolation search?",
        options: ["(low + high) / 2", "low + (target - arr[low]) / (arr[high] - arr[low]) * (high - low)", "low + 1", "high - 1"],
        correctAnswer: 1,
        explanation: "Interpolation search uses linear interpolation: pos = low + [(target - arr[low]) / (arr[high] - arr[low])] * (high - low) to estimate the target position."
      },
      {
        question: "When should you prefer binary search over interpolation search?",
        options: ["Always", "For non-uniformly distributed data", "For small arrays", "For string data"],
        correctAnswer: 1,
        explanation: "Binary search is preferred for non-uniformly distributed data because it guarantees O(log n) performance, while interpolation search can degrade to O(n)."
      },
      {
        question: "What is a critical edge case to handle in interpolation search?",
        options: ["Empty arrays", "Division by zero when arr[high] = arr[low]", "Negative numbers", "Floating point numbers"],
        correctAnswer: 1,
        explanation: "When arr[high] equals arr[low], division by zero occurs in the interpolation formula. The algorithm should fall back to linear search or handle this case specially."
      }
    ]
  },

  // Hashing
  {
    id: 'hash-table',
    title: 'Hash Table',
    description: 'Lightning-fast key-value storage powering databases, caches, and dictionaries',
    category: 'Hashing',
    difficulty: 'intermediate',
    timeComplexity: 'O(1) avg',
    spaceComplexity: 'O(n)',
    extendedDefinition: `A Hash Table (also known as Hash Map or Dictionary) is a data structure that implements an associative array abstract data type, mapping keys to values using a hash function. It provides extremely fast average-case performance for insertion, deletion, and lookup operations.

What it does: maps keys to values using hash function for O(1) average-case insert, delete, and lookup operations.

How it works: uses hash function to compute array index from key, handles collisions with chaining or open addressing techniques.

When to use: fast key-value lookups needed, implementing dictionaries/maps, caching systems, database indexing, symbol tables.`,
    voiceExplanation: `Think of a hash table like a magical library with an incredibly smart librarian. When you want to store a book, instead of putting it on any random shelf, the librarian uses a special formula based on the book's title to instantly know exactly which shelf it belongs on. This formula is the hash function - it takes the book's title and converts it into a specific shelf number. When you later want to find that book, you just tell the librarian the title, they apply the same formula, and boom - they know exactly which shelf to check! This is why hash tables are so fast - instead of searching through every shelf like a regular library, the hash table can jump directly to the right location. Sometimes two books might end up assigned to the same shelf (a collision), but our smart librarian handles this by keeping a small basket on each shelf to hold multiple books when needed.`,
    realWorldApplications: `**Industry Applications:**
- **Database Systems**: Indexing for fast record retrieval, query optimization
- **Caching Systems**: Redis, Memcached for high-speed data access
- **Web Development**: Session storage, user authentication, API rate limiting
- **Compilers**: Symbol tables for variable and function lookups
- **Distributed Systems**: Consistent hashing for load balancing, data partitioning
- **Blockchain**: Merkle trees, transaction verification, wallet addresses
- **Search Engines**: Inverted indexes, document fingerprinting, duplicate detection
- **Operating Systems**: File system metadata, process tables, memory management
- **Network Protocols**: DNS resolution, routing tables, MAC address tables
- **Gaming**: Player statistics, leaderboards, inventory management`,
    keyConcepts: `**Essential Concepts:**
1. **Hash Function**: Mathematical function that maps keys to array indices
2. **Collision Resolution**: Strategies to handle multiple keys mapping to same index
3. **Load Factor**: Ratio of stored elements to table capacity (affects performance)
4. **Dynamic Resizing**: Growing/shrinking table size to maintain efficiency
5. **Separate Chaining**: Using linked lists to store multiple values per slot
6. **Open Addressing**: Finding alternative slots when collisions occur
7. **Uniform Distribution**: Good hash functions spread keys evenly across table
8. **Amortized Analysis**: Average performance over many operations`,
    pseudocode: `**Hash Table Pseudocode:**

ALGORITHM HashFunction(key, tableSize)
INPUT: key - the key to hash, tableSize - size of hash table
OUTPUT: hash value (index)
BEGIN
    hash = 0
    FOR i = 0 TO key.length - 1 DO
        hash = (hash + key.charCodeAt(i) * (i + 1)) MOD tableSize
    END FOR
    RETURN hash
END

ALGORITHM Insert(hashTable, key, value)
INPUT: hashTable - the hash table, key - key to insert, value - associated value
OUTPUT: success/failure status
BEGIN
    index = HashFunction(key, hashTable.size)
    
    IF hashTable[index] is empty THEN
        hashTable[index] = new LinkedList()
    END IF
    
    // Check if key already exists
    FOR each pair IN hashTable[index] DO
        IF pair.key = key THEN
            pair.value = value  // Update existing
            RETURN success
        END IF
    END FOR
    
    // Insert new key-value pair
    hashTable[index].append(new Pair(key, value))
    RETURN success
END

ALGORITHM Search(hashTable, key)
INPUT: hashTable - the hash table, key - key to search for
OUTPUT: value associated with key, or null if not found
BEGIN
    index = HashFunction(key, hashTable.size)
    
    IF hashTable[index] is empty THEN
        RETURN null
    END IF
    
    FOR each pair IN hashTable[index] DO
        IF pair.key = key THEN
            RETURN pair.value
        END IF
    END FOR
    
    RETURN null
END

ALGORITHM Delete(hashTable, key)
INPUT: hashTable - the hash table, key - key to delete
OUTPUT: success/failure status
BEGIN
    index = HashFunction(key, hashTable.size)
    
    IF hashTable[index] is empty THEN
        RETURN failure
    END IF
    
    FOR each pair IN hashTable[index] DO
        IF pair.key = key THEN
            hashTable[index].remove(pair)
            RETURN success
        END IF
    END FOR
    
    RETURN failure
END

ALGORITHM Resize(hashTable, newSize)
INPUT: hashTable - current hash table, newSize - new table size
OUTPUT: resized hash table
BEGIN
    oldTable = hashTable
    hashTable = new Array(newSize)
    
    FOR i = 0 TO oldTable.size - 1 DO
        IF oldTable[i] is not empty THEN
            FOR each pair IN oldTable[i] DO
                Insert(hashTable, pair.key, pair.value)
            END FOR
        END IF
    END FOR
    
    RETURN hashTable
END`,
    implementationCode: `class HashTable {
    constructor(initialSize = 16) {
        this.size = initialSize;
        this.count = 0;
        this.table = new Array(this.size);
        this.loadFactorThreshold = 0.75;
    }
    
    // Hash function using djb2 algorithm
    hash(key) {
        let hash = 5381;
        for (let i = 0; i < key.length; i++) {
            hash = ((hash << 5) + hash) + key.charCodeAt(i);
        }
        return Math.abs(hash) % this.size;
    }
    
    // Alternative hash function for double hashing
    hash2(key) {
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash = (hash + key.charCodeAt(i) * (i + 1)) % this.size;
        }
        return hash === 0 ? 1 : hash;
    }
    
    // Insert or update key-value pair
    set(key, value) {
        // Resize if load factor exceeds threshold
        if (this.count >= this.size * this.loadFactorThreshold) {
            this.resize(this.size * 2);
        }
        
        const index = this.hash(key);
        
        if (!this.table[index]) {
            this.table[index] = [];
        }
        
        // Check if key already exists
        const bucket = this.table[index];
        for (let i = 0; i < bucket.length; i++) {
            if (bucket[i][0] === key) {
                bucket[i][1] = value; // Update existing
                return;
            }
        }
        
        // Add new key-value pair
        bucket.push([key, value]);
        this.count++;
    }
    
    // Retrieve value by key
    get(key) {
        const index = this.hash(key);
        const bucket = this.table[index];
        
        if (bucket) {
            for (const [k, v] of bucket) {
                if (k === key) return v;
            }
        }
        
        return undefined;
    }
    
    // Check if key exists
    has(key) {
        return this.get(key) !== undefined;
    }
    
    // Delete key-value pair
    delete(key) {
        const index = this.hash(key);
        const bucket = this.table[index];
        
        if (bucket) {
            for (let i = 0; i < bucket.length; i++) {
                if (bucket[i][0] === key) {
                    bucket.splice(i, 1);
                    this.count--;
                    
                    // Remove empty bucket
                    if (bucket.length === 0) {
                        this.table[index] = undefined;
                    }
                    
                    return true;
                }
            }
        }
        
        return false;
    }
    
    // Get all keys
    keys() {
        const keys = [];
        for (let i = 0; i < this.size; i++) {
            if (this.table[i]) {
                for (const [key] of this.table[i]) {
                    keys.push(key);
                }
            }
        }
        return keys;
    }
    
    // Get all values
    values() {
        const values = [];
        for (let i = 0; i < this.size; i++) {
            if (this.table[i]) {
                for (const [, value] of this.table[i]) {
                    values.push(value);
                }
            }
        }
        return values;
    }
    
    // Get all key-value pairs
    entries() {
        const entries = [];
        for (let i = 0; i < this.size; i++) {
            if (this.table[i]) {
                for (const pair of this.table[i]) {
                    entries.push([...pair]);
                }
            }
        }
        return entries;
    }
    
    // Resize hash table
    resize(newSize) {
        const oldTable = this.table;
        const oldSize = this.size;
        
        this.size = newSize;
        this.count = 0;
        this.table = new Array(newSize);
        
        // Rehash all existing entries
        for (let i = 0; i < oldSize; i++) {
            if (oldTable[i]) {
                for (const [key, value] of oldTable[i]) {
                    this.set(key, value);
                }
            }
        }
    }
    
    // Get current load factor
    getLoadFactor() {
        return this.count / this.size;
    }
    
    // Get statistics
    getStats() {
        let maxChainLength = 0;
        let usedBuckets = 0;
        let totalChainLength = 0;
        
        for (let i = 0; i < this.size; i++) {
            if (this.table[i] && this.table[i].length > 0) {
                usedBuckets++;
                const chainLength = this.table[i].length;
                totalChainLength += chainLength;
                maxChainLength = Math.max(maxChainLength, chainLength);
            }
        }
        
        return {
            size: this.size,
            count: this.count,
            loadFactor: this.getLoadFactor(),
            usedBuckets,
            maxChainLength,
            avgChainLength: usedBuckets > 0 ? totalChainLength / usedBuckets : 0
        };
    }
    
    // Clear all entries
    clear() {
        this.table = new Array(this.size);
        this.count = 0;
    }
    
    // Iterator support
    *[Symbol.iterator]() {
        for (let i = 0; i < this.size; i++) {
            if (this.table[i]) {
                for (const [key, value] of this.table[i]) {
                    yield [key, value];
                }
            }
        }
    }
}

// Usage Examples
const hashTable = new HashTable();

// Basic operations
hashTable.set("name", "Alice");
hashTable.set("age", 30);
hashTable.set("city", "New York");

console.log(hashTable.get("name")); // "Alice"
console.log(hashTable.has("age")); // true
console.log(hashTable.delete("city")); // true

// Iteration
for (const [key, value] of hashTable) {
    console.log(\`\${key}: \${value}\`);
}

// Statistics
console.log(hashTable.getStats());
// { size: 16, count: 2, loadFactor: 0.125, usedBuckets: 2, maxChainLength: 1, avgChainLength: 1 }

// Advanced usage with collision handling
const collisionTest = new HashTable(3); // Small size to force collisions
collisionTest.set("abc", 1);
collisionTest.set("bca", 2);
collisionTest.set("cab", 3);

console.log("Collision test stats:", collisionTest.getStats());`,
    example: `// Basic Hash Table Example
class SimpleHashTable {
    constructor(size = 10) {
        this.size = size;
        this.table = new Array(size);
    }
    
    // Simple hash function
    hash(key) {
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash = (hash + key.charCodeAt(i) * i) % this.size;
        }
        return hash;
    }
    
    // Insert key-value pair - O(1) average
    set(key, value) {
        const index = this.hash(key);
        
        if (!this.table[index]) {
            this.table[index] = [];
        }
        
        // Check if key already exists
        const bucket = this.table[index];
        for (let i = 0; i < bucket.length; i++) {
            if (bucket[i][0] === key) {
                bucket[i][1] = value; // Update existing
                return;
            }
        }
        
        // Add new key-value pair
        bucket.push([key, value]);
    }
    
    // Retrieve value by key - O(1) average
    get(key) {
        const index = this.hash(key);
        const bucket = this.table[index];
        
        if (bucket) {
            for (const [k, v] of bucket) {
                if (k === key) return v;
            }
        }
        
        return undefined;
    }
}

// Example usage
const ht = new SimpleHashTable();
ht.set("name", "Alice");
ht.set("age", 25);
console.log(ht.get("name")); // "Alice"`,
    syntax: `**Hash Table Patterns:**

1. **Basic Hash Function:**
   \`\`\`javascript
   function hash(key, size) {
       let hash = 0;
       for (let i = 0; i < key.length; i++) {
           hash = (hash + key.charCodeAt(i)) % size;
       }
       return hash;
   }
   \`\`\`

2. **Hash Table Operations:**
   \`\`\`javascript
   class HashTable {
       set(key, value) {
           const index = this.hash(key);
           if (!this.table[index]) this.table[index] = [];
           this.table[index].push([key, value]);
       }
       
       get(key) {
           const index = this.hash(key);
           return this.table[index]?.find(([k]) => k === key)?.[1];
       }
   }
   \`\`\`

3. **Collision Handling:**
   \`\`\`javascript
   // Separate Chaining
   set(key, value) {
       const index = this.hash(key);
       if (!this.buckets[index]) this.buckets[index] = [];
       this.buckets[index].push([key, value]);
   }
   
   // Linear Probing
   set(key, value) {
       let index = this.hash(key);
       while (this.table[index] && this.table[index][0] !== key) {
           index = (index + 1) % this.size;
       }
       this.table[index] = [key, value];
   }
   \`\`\``,
    quizQuestions: [
      {
        question: "What is the average time complexity of hash table operations (insert, delete, search)?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "Hash tables provide O(1) average time complexity for basic operations because the hash function directly computes the storage location, eliminating the need to search through elements."
      },
      {
        question: "What happens when two different keys produce the same hash value?",
        options: ["The second key overwrites the first", "A collision occurs and must be resolved", "The hash table becomes invalid", "The operation fails"],
        correctAnswer: 1,
        explanation: "When two keys hash to the same index, it's called a collision. Hash tables use collision resolution techniques like separate chaining or open addressing to handle this situation."
      },
      {
        question: "What is the load factor of a hash table?",
        options: ["The maximum number of elements", "The ratio of stored elements to table size", "The number of collisions", "The hash function efficiency"],
        correctAnswer: 1,
        explanation: "Load factor is the ratio of the number of stored elements to the total size of the hash table. It affects performance - higher load factors increase collision probability."
      },
      {
        question: "Which collision resolution technique stores multiple values in linked lists at each table slot?",
        options: ["Linear probing", "Quadratic probing", "Separate chaining", "Double hashing"],
        correctAnswer: 2,
        explanation: "Separate chaining handles collisions by maintaining a linked list (or dynamic array) at each table slot to store multiple key-value pairs that hash to the same index."
      },
      {
        question: "What is a key property that a good hash function should have?",
        options: ["Always return the same value", "Distribute keys uniformly across the table", "Only work with string keys", "Minimize memory usage"],
        correctAnswer: 1,
        explanation: "A good hash function should distribute keys uniformly across the hash table to minimize collisions and ensure optimal performance. Uniform distribution reduces clustering and maintains O(1) average performance."
      }
    ]
  },
  {
    id: 'hash-chaining',
    title: 'Separate Chaining',
    description: 'Handle hash collisions by storing multiple values in linked lists at each slot',
    category: 'Hashing',
    difficulty: 'intermediate',
    timeComplexity: 'O(1) avg',
    spaceComplexity: 'O(n)',
    extendedDefinition: `Separate Chaining is a collision resolution technique in hash tables where each slot in the hash table contains a linked list (or dynamic array) to store multiple key-value pairs that hash to the same index.

What it does: resolves hash collisions by maintaining linked lists at each table slot to store multiple values with same hash.

How it works: when collision occurs, new key-value pair is added to linked list at that slot, searches traverse the chain to find target.

When to use: high load factor expected, memory not critical, simple implementation preferred, frequent insertions and deletions.`
  },
  {
    id: 'open-addressing',
    title: 'Open Addressing',
    description: 'Resolve collisions by finding alternative slots using linear, quadratic, or double hashing',
    category: 'Hashing',
    difficulty: 'intermediate',
    timeComplexity: 'O(1) avg',
    spaceComplexity: 'O(1)',
    extendedDefinition: `Open Addressing is a collision resolution technique in hash tables where all elements are stored directly in the hash table array, and collisions are resolved by probing for alternative empty slots using various strategies.

What it does: resolves hash collisions by finding alternative empty slots in the table using probing sequences instead of chaining.

How it works: when collision occurs, uses probing methods (linear, quadratic, double hashing) to find next available slot for insertion.

When to use: memory efficiency important, cache performance critical, load factor kept low, simple data structures preferred over linked lists.`
  },

  // Recursion
  {
    id: 'recursion-basics',
    title: 'Recursion Fundamentals',
    description: 'Function calling itself with base and recursive cases',
    category: 'Recursion',
    difficulty: 'intermediate',
    timeComplexity: 'Varies',
    spaceComplexity: 'O(n)',
    extendedDefinition: `Recursion is a fundamental programming technique where a function calls itself to solve a problem by breaking it down into smaller, similar subproblems. It's a powerful paradigm that mirrors mathematical induction and provides elegant solutions to problems that have a recursive structure.

What it does: breaks down complex problems into smaller identical subproblems by having functions call themselves.

How it works: uses base cases to stop recursion and recursive cases that call the function with modified parameters.

When to use: tree traversals, mathematical computations, divide-and-conquer algorithms, backtracking problems.`,
    voiceExplanation: `Think of recursion like a set of Russian nesting dolls (Matryoshka dolls). When you want to find the tiniest doll inside, you open the outermost doll, then the next one inside, then the next one, and so on, until you reach the tiniest doll that can't be opened further - that's your base case. Then you start putting the dolls back together, one by one, until you have the complete set again. In programming, recursion works the same way: a function keeps calling smaller versions of itself until it reaches the simplest case it can solve directly, then it combines all those solutions back up to solve the original problem.`,
    realWorldApplications: `**Industry Applications:**
- **File System Navigation**: Traversing directory structures recursively
- **Compiler Design**: Parsing nested expressions and syntax trees
- **Computer Graphics**: Fractal generation, ray tracing, scene graph traversal
- **Database Systems**: Hierarchical queries, tree-structured data retrieval
- **Web Crawling**: Following links recursively to index web pages
- **Game Development**: Pathfinding algorithms, game tree search (minimax)
- **Artificial Intelligence**: Decision trees, recursive neural networks
- **Mathematical Computing**: Numerical integration, solving differential equations
- **Data Compression**: Huffman coding, recursive data structure compression
- **Network Protocols**: DNS resolution, routing algorithms`,
    keyConcepts: `**Essential Concepts:**
1. **Base Case**: The condition that stops recursion and provides a direct answer
2. **Recursive Case**: The part where the function calls itself with modified parameters
3. **Call Stack**: Memory structure that tracks function calls and local variables
4. **Stack Overflow**: Error when recursion depth exceeds available stack space
5. **Tail Recursion**: Optimization where recursive call is the last operation
6. **Memoization**: Caching results to avoid redundant recursive calculations
7. **Divide and Conquer**: Breaking problems into smaller subproblems recursively
8. **Tree Recursion**: Multiple recursive calls creating a tree-like call structure`,
    pseudocode: `**Recursion Pseudocode:**

ALGORITHM BasicRecursion(problem)
INPUT: problem - the problem to solve recursively
OUTPUT: solution to the problem
BEGIN
    // Check base case first
    IF problem is trivial or smallest possible THEN
        RETURN direct solution
    END IF
    
    // Break down the problem
    subproblem = reduce problem size
    
    // Recursive call
    subresult = BasicRecursion(subproblem)
    
    // Combine results
    result = combine current problem with subresult
    
    RETURN result
END

ALGORITHM Factorial(n)
INPUT: n - non-negative integer
OUTPUT: n! (n factorial)
BEGIN
    IF n <= 1 THEN
        RETURN 1  // Base case
    END IF
    
    RETURN n * Factorial(n - 1)  // Recursive case
END

ALGORITHM Fibonacci(n)
INPUT: n - position in Fibonacci sequence
OUTPUT: nth Fibonacci number
BEGIN
    IF n <= 0 THEN
        RETURN 0  // Base case 1
    END IF
    
    IF n = 1 THEN
        RETURN 1  // Base case 2
    END IF
    
    RETURN Fibonacci(n - 1) + Fibonacci(n - 2)  // Recursive case
END

ALGORITHM TowerOfHanoi(n, source, destination, auxiliary)
INPUT: n - number of disks, source/destination/auxiliary - rod names
OUTPUT: sequence of moves
BEGIN
    IF n = 1 THEN
        PRINT "Move disk from " + source + " to " + destination
        RETURN
    END IF
    
    // Move n-1 disks to auxiliary rod
    TowerOfHanoi(n - 1, source, auxiliary, destination)
    
    // Move the largest disk to destination
    PRINT "Move disk from " + source + " to " + destination
    
    // Move n-1 disks from auxiliary to destination
    TowerOfHanoi(n - 1, auxiliary, destination, source)
END

ALGORITHM BinarySearch(arr, target, low, high)
INPUT: sorted array, target value, low and high indices
OUTPUT: index of target or -1 if not found
BEGIN
    IF low > high THEN
        RETURN -1  // Base case: not found
    END IF
    
    mid = (low + high) / 2
    
    IF arr[mid] = target THEN
        RETURN mid  // Base case: found
    ELSE IF arr[mid] > target THEN
        RETURN BinarySearch(arr, target, low, mid - 1)
    ELSE
        RETURN BinarySearch(arr, target, mid + 1, high)
    END IF
END`,
    implementationCode: `class RecursionExamples {
    // Basic factorial implementation
    static factorial(n) {
        if (n < 0) throw new Error('Factorial undefined for negative numbers');
        if (n <= 1) return 1;
        return n * this.factorial(n - 1);
    }
    
    // Tail-recursive factorial (optimizable)
    static factorialTailRecursive(n, accumulator = 1) {
        if (n <= 1) return accumulator;
        return this.factorialTailRecursive(n - 1, n * accumulator);
    }
    
    // Fibonacci with memoization
    static fibonacci(n, memo = {}) {
        if (n in memo) return memo[n];
        if (n <= 0) return 0;
        if (n === 1) return 1;
        
        memo[n] = this.fibonacci(n - 1, memo) + this.fibonacci(n - 2, memo);
        return memo[n];
    }
    
    // Power calculation with optimization
    static power(base, exponent) {
        if (exponent === 0) return 1;
        if (exponent === 1) return base;
        if (exponent < 0) return 1 / this.power(base, -exponent);
        
        // Optimization: use exponentiation by squaring
        if (exponent % 2 === 0) {
            const half = this.power(base, exponent / 2);
            return half * half;
        } else {
            return base * this.power(base, exponent - 1);
        }
    }
    
    // Sum of array elements
    static arraySum(arr, index = 0) {
        if (index >= arr.length) return 0;
        return arr[index] + this.arraySum(arr, index + 1);
    }
    
    // Reverse a string recursively
    static reverseString(str) {
        if (str.length <= 1) return str;
        return str[str.length - 1] + this.reverseString(str.slice(0, -1));
    }
    
    // Check if string is palindrome
    static isPalindrome(str, start = 0, end = str.length - 1) {
        if (start >= end) return true;
        if (str[start] !== str[end]) return false;
        return this.isPalindrome(str, start + 1, end - 1);
    }
    
    // Binary search recursive implementation
    static binarySearch(arr, target, low = 0, high = arr.length - 1) {
        if (low > high) return -1;
        
        const mid = Math.floor((low + high) / 2);
        
        if (arr[mid] === target) return mid;
        if (arr[mid] > target) return this.binarySearch(arr, target, low, mid - 1);
        return this.binarySearch(arr, target, mid + 1, high);
    }
    
    // Generate all permutations of an array
    static permutations(arr) {
        if (arr.length <= 1) return [arr];
        
        const result = [];
        for (let i = 0; i < arr.length; i++) {
            const current = arr[i];
            const remaining = arr.slice(0, i).concat(arr.slice(i + 1));
            const perms = this.permutations(remaining);
            
            for (const perm of perms) {
                result.push([current, ...perm]);
            }
        }
        return result;
    }
    
    // Tower of Hanoi solution
    static towerOfHanoi(n, source = 'A', destination = 'C', auxiliary = 'B') {
        const moves = [];
        
        function hanoi(disks, src, dest, aux) {
            if (disks === 1) {
                moves.push('Move disk 1 from ' + src + ' to ' + dest);
                return;
            }
            
            hanoi(disks - 1, src, aux, dest);
            moves.push('Move disk ' + disks + ' from ' + src + ' to ' + dest);
            hanoi(disks - 1, aux, dest, src);
        }
        
        hanoi(n, source, destination, auxiliary);
        return moves;
    }
    
    // Quick sort implementation
    static quickSort(arr, low = 0, high = arr.length - 1) {
        if (low < high) {
            const pivotIndex = this.partition(arr, low, high);
            this.quickSort(arr, low, pivotIndex - 1);
            this.quickSort(arr, pivotIndex + 1, high);
        }
        return arr;
    }
    
    static partition(arr, low, high) {
        const pivot = arr[high];
        let i = low - 1;
        
        for (let j = low; j < high; j++) {
            if (arr[j] <= pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        }
        
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        return i + 1;
    }
    
    // Tree traversal (assuming simple tree structure)
    static inorderTraversal(node, result = []) {
        if (!node) return result;
        
        this.inorderTraversal(node.left, result);
        result.push(node.value);
        this.inorderTraversal(node.right, result);
        
        return result;
    }
    
    // Calculate depth of recursion
    static maxDepth(node) {
        if (!node) return 0;
        
        const leftDepth = this.maxDepth(node.left);
        const rightDepth = this.maxDepth(node.right);
        
        return Math.max(leftDepth, rightDepth) + 1;
    }
    
    // Recursive GCD (Greatest Common Divisor)
    static gcd(a, b) {
        if (b === 0) return a;
        return this.gcd(b, a % b);
    }
    
    // Count occurrences in nested array
    static countOccurrences(arr, target) {
        let count = 0;
        
        for (const item of arr) {
            if (Array.isArray(item)) {
                count += this.countOccurrences(item, target);
            } else if (item === target) {
                count++;
            }
        }
        
        return count;
    }
}

// Usage Examples and Testing
console.log('=== Recursion Examples ===');

// Basic examples
console.log('Factorial(5):', RecursionExamples.factorial(5)); // 120
console.log('Fibonacci(10):', RecursionExamples.fibonacci(10)); // 55
console.log('Power(2, 8):', RecursionExamples.power(2, 8)); // 256

// String operations
console.log('Reverse "hello":', RecursionExamples.reverseString('hello')); // "olleh"
console.log('Is "racecar" palindrome?:', RecursionExamples.isPalindrome('racecar')); // true

// Array operations
console.log('Array sum [1,2,3,4,5]:', RecursionExamples.arraySum([1,2,3,4,5])); // 15
console.log('Binary search for 7 in [1,3,5,7,9]:', RecursionExamples.binarySearch([1,3,5,7,9], 7)); // 3

// Advanced examples
console.log('GCD(48, 18):', RecursionExamples.gcd(48, 18)); // 6
console.log('Tower of Hanoi (3 disks):', RecursionExamples.towerOfHanoi(3));

// Performance comparison
const startTime = performance.now();
RecursionExamples.fibonacci(30);
const endTime = performance.now();
console.log('Fibonacci(30) took ' + (endTime - startTime) + ' milliseconds');
`,
    example: `// Basic Recursion Examples

// 1. Factorial - Classic recursion example
function factorial(n) {
    // Base case
    if (n <= 1) return 1;
    
    // Recursive case
    return n * factorial(n - 1);
}

// 2. Sum of numbers from 1 to n
function sum(n) {
    if (n <= 0) return 0;
    return n + sum(n - 1);
}

// 3. Power calculation
function power(base, exponent) {
    if (exponent === 0) return 1;
    if (exponent === 1) return base;
    return base * power(base, exponent - 1);
}

// 4. Array sum using recursion
function arraySum(arr, index = 0) {
    if (index >= arr.length) return 0;
    return arr[index] + arraySum(arr, index + 1);
}

// Example usage
console.log(factorial(5));    // 120
console.log(sum(5));          // 15
console.log(power(2, 3));     // 8
console.log(arraySum([1, 2, 3, 4])); // 10`,
    syntax: `**Recursion Patterns:**

1. **Basic Recursion Template:**
   function recursiveFunction(parameters) {
       // Base case - stops recursion
       if (baseCondition) {
           return baseValue;
       }
       
       // Recursive case - function calls itself
       return someOperation(recursiveFunction(modifiedParameters));
   }

2. **Multiple Base Cases:**
   function fibonacci(n) {
       if (n <= 0) return 0;  // Base case 1
       if (n === 1) return 1; // Base case 2
       return fibonacci(n - 1) + fibonacci(n - 2); // Recursive case
   }

3. **Helper Function Pattern:**
   function mainFunction(input) {
       function helper(modifiedInput, accumulator) {
           if (baseCase) return accumulator;
           return helper(nextInput, updatedAccumulator);
       }
       return helper(input, initialValue);
   }

4. **Tail Recursion:**
   function tailRecursive(n, accumulator = 0) {
       if (n === 0) return accumulator;
       return tailRecursive(n - 1, accumulator + n);
   }`,
    quizQuestions: [
      {
        question: "What are the two essential components that every recursive function must have?",
        options: ["Loop and condition", "Base case and recursive case", "Input and output", "Variables and constants"],
        correctAnswer: 1,
        explanation: "Every recursive function must have a base case (stopping condition) to prevent infinite recursion, and a recursive case where the function calls itself with modified parameters."
      },
      {
        question: "What happens if a recursive function doesn't have a proper base case?",
        options: ["The function runs faster", "Stack overflow error occurs", "The function returns null", "The function becomes iterative"],
        correctAnswer: 1,
        explanation: "Without a proper base case, the function will call itself indefinitely, eventually exhausting the call stack and causing a stack overflow error."
      },
      {
        question: "What is tail recursion?",
        options: ["Recursion that processes the tail of an array", "Recursion where the recursive call is the last operation", "Recursion that runs backwards", "Recursion with multiple base cases"],
        correctAnswer: 1,
        explanation: "Tail recursion occurs when the recursive call is the last operation performed in the function. This allows for optimization where the compiler can reuse the current stack frame instead of creating a new one."
      },
      {
        question: "Which data structure is used to manage recursive function calls?",
        options: ["Queue", "Stack", "Heap", "Array"],
        correctAnswer: 1,
        explanation: "The call stack is used to manage recursive function calls. Each recursive call creates a new frame on the stack, and when the base case is reached, the frames are popped off in LIFO order."
      },
      {
        question: "What is the space complexity of a recursive function that makes n recursive calls?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correctAnswer: 2,
        explanation: "The space complexity is O(n) because each recursive call adds a new frame to the call stack, and with n recursive calls, we need O(n) space to store all the stack frames."
      }
    ]
  },
  {
    id: 'tail-recursion',
    title: 'Tail Recursion',
    description: 'Optimized recursion where recursive call is the last operation',
    category: 'Recursion',
    difficulty: 'intermediate',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    extendedDefinition: `Tail Recursion is a special form of recursion where the recursive call is the last operation performed in the function, with no additional computation after the recursive call returns.

What it does: optimizes recursive functions by making recursive call the final operation, enabling compiler optimizations for constant space.

How it works: accumulates results in parameters, makes recursive call as last statement, allows reuse of current stack frame.

When to use: deep recursion needed, stack overflow concerns, functional programming, compiler supports tail call optimization.`,
  },
  {
    id: 'fibonacci',
    title: 'Fibonacci Sequence',
    description: 'Classic recursive problem with optimization techniques',
    category: 'Recursion',
    difficulty: 'beginner',
    timeComplexity: 'O(2^n)',
    spaceComplexity: 'O(n)',
    extendedDefinition: `The Fibonacci Sequence is a series of numbers where each number is the sum of the two preceding ones, starting from 0 and 1. It's a classic example used to teach recursion, dynamic programming, and algorithm optimization.

What it does: generates sequence where each number equals sum of two preceding numbers, demonstrates recursive problem-solving patterns.

How it works: uses base cases F(0)=0, F(1)=1, then recursively computes F(n) = F(n-1) + F(n-2) for larger values.

When to use: teaching recursion concepts, demonstrating optimization techniques, mathematical computations, algorithm analysis examples.`,
  },

  // Dynamic Programming
  {
    id: 'dp-introduction',
    title: 'DP Introduction',
    description: 'Breaking problems into overlapping subproblems',
    category: 'Dynamic Programming',
    difficulty: 'intermediate',
    timeComplexity: 'Varies',
    spaceComplexity: 'Varies',
    extendedDefinition: `Dynamic Programming (DP) is a powerful algorithmic paradigm that solves complex problems by breaking them down into simpler subproblems and storing the results to avoid redundant calculations. It's particularly effective for optimization problems with overlapping subproblems and optimal substructure.

What it does: solves complex problems by breaking them into smaller subproblems and storing solutions to avoid redundant calculations.

How it works: identifies overlapping subproblems and optimal substructure, then uses memoization or tabulation to store and reuse results.

When to use: optimization problems, counting problems, problems with recursive structure where same subproblems appear multiple times.`,
    voiceExplanation: `Think of Dynamic Programming like solving a giant jigsaw puzzle, but you're really smart about it! Instead of trying random pieces over and over, you organize your approach: you solve small sections first, remember what you've learned, and use that knowledge to solve bigger sections. Imagine you're climbing a staircase and someone asks "how many ways can you reach step 10?" Instead of counting from scratch every time, you remember: "I know there are X ways to reach step 8 and Y ways to reach step 9, so there are X+Y ways to reach step 10!" That's exactly how DP works - it remembers solutions to smaller problems and combines them to solve bigger ones. It's like having a perfect memory that never forgets a solution, making you incredibly efficient at solving complex problems!`,
    realWorldApplications: `**Industry Applications:**
- **Finance**: Portfolio optimization, option pricing, risk management algorithms
- **Bioinformatics**: DNA sequence alignment, protein folding prediction, phylogenetic analysis
- **Operations Research**: Resource allocation, scheduling optimization, supply chain management
- **Game Development**: AI decision making, pathfinding optimization, game balance calculations
- **Machine Learning**: Neural network training, reinforcement learning, feature selection
- **Computer Graphics**: Image processing, texture synthesis, animation optimization
- **Network Optimization**: Routing algorithms, bandwidth allocation, network flow problems
- **Manufacturing**: Production planning, inventory management, quality control optimization
- **Transportation**: Route optimization, traffic flow management, logistics planning
- **Economics**: Market analysis, auction theory, mechanism design`,
    keyConcepts: `**Essential Concepts:**
1. **Overlapping Subproblems**: Same subproblems solved multiple times in naive recursion
2. **Optimal Substructure**: Optimal solution contains optimal solutions to subproblems
3. **Memoization**: Top-down approach storing results of function calls
4. **Tabulation**: Bottom-up approach filling a table iteratively
5. **State Space**: Set of all possible states/subproblems in the problem
6. **Transition Function**: How to move from one state to another
7. **Base Cases**: Smallest subproblems that can be solved directly
8. **Space Optimization**: Reducing memory usage by keeping only necessary previous states`,
    pseudocode: `**Dynamic Programming Patterns:**

ALGORITHM Memoization(problem, memo)
INPUT: problem - the problem instance, memo - storage for computed results
OUTPUT: optimal solution to the problem
BEGIN
    IF problem in memo THEN
        RETURN memo[problem]
    END IF
    
    IF problem is base case THEN
        result = solve base case directly
    ELSE
        result = combine solutions from subproblems
        FOR each subproblem DO
            subresult = Memoization(subproblem, memo)
            combine subresult into result
        END FOR
    END IF
    
    memo[problem] = result
    RETURN result
END

ALGORITHM Tabulation(problemSize)
INPUT: problemSize - size of the problem to solve
OUTPUT: optimal solution
BEGIN
    CREATE table[0...problemSize]
    
    // Initialize base cases
    FOR each base case i DO
        table[i] = base case solution
    END FOR
    
    // Fill table bottom-up
    FOR i = first non-base case TO problemSize DO
        table[i] = combine solutions from table[smaller indices]
    END FOR
    
    RETURN table[problemSize]
END

ALGORITHM FibonacciDP(n)
INPUT: n - the Fibonacci number to compute
OUTPUT: nth Fibonacci number
BEGIN
    IF n <= 1 THEN
        RETURN n
    END IF
    
    CREATE dp[0...n]
    dp[0] = 0
    dp[1] = 1
    
    FOR i = 2 TO n DO
        dp[i] = dp[i-1] + dp[i-2]
    END FOR
    
    RETURN dp[n]
END

ALGORITHM LongestCommonSubsequence(text1, text2)
INPUT: text1, text2 - two strings to compare
OUTPUT: length of longest common subsequence
BEGIN
    m = length of text1
    n = length of text2
    CREATE dp[0...m][0...n]
    
    // Initialize base cases
    FOR i = 0 TO m DO
        dp[i][0] = 0
    END FOR
    FOR j = 0 TO n DO
        dp[0][j] = 0
    END FOR
    
    // Fill table
    FOR i = 1 TO m DO
        FOR j = 1 TO n DO
            IF text1[i-1] = text2[j-1] THEN
                dp[i][j] = dp[i-1][j-1] + 1
            ELSE
                dp[i][j] = MAX(dp[i-1][j], dp[i][j-1])
            END IF
        END FOR
    END FOR
    
    RETURN dp[m][n]
END`,
    implementationCode: `// Comprehensive Dynamic Programming Implementation

class DynamicProgramming {
    constructor() {
        this.memoCache = new Map();
        this.computationCount = 0;
    }
    
    // 1. Fibonacci - Multiple approaches
    fibonacciNaive(n) {
        this.computationCount++;
        if (n <= 1) return n;
        return this.fibonacciNaive(n - 1) + this.fibonacciNaive(n - 2);
    }
    
    fibonacciMemo(n, memo = {}) {
        this.computationCount++;
        if (n in memo) return memo[n];
        if (n <= 1) return n;
        
        memo[n] = this.fibonacciMemo(n - 1, memo) + this.fibonacciMemo(n - 2, memo);
        return memo[n];
    }
    
    fibonacciTabulation(n) {
        if (n <= 1) return n;
        
        const dp = new Array(n + 1);
        dp[0] = 0;
        dp[1] = 1;
        
        for (let i = 2; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
            this.computationCount++;
        }
        
        return dp[n];
    }
    
    fibonacciOptimized(n) {
        if (n <= 1) return n;
        
        let prev2 = 0, prev1 = 1;
        
        for (let i = 2; i <= n; i++) {
            const current = prev1 + prev2;
            prev2 = prev1;
            prev1 = current;
            this.computationCount++;
        }
        
        return prev1;
    }
    
    // 2. Climbing Stairs Problem
    climbStairs(n, memo = {}) {
        if (n in memo) return memo[n];
        if (n <= 2) return n;
        
        memo[n] = this.climbStairs(n - 1, memo) + this.climbStairs(n - 2, memo);
        return memo[n];
    }
    
    climbStairsTabulation(n) {
        if (n <= 2) return n;
        
        const dp = new Array(n + 1);
        dp[1] = 1;
        dp[2] = 2;
        
        for (let i = 3; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }
        
        return dp[n];
    }
    
    // 3. House Robber Problem
    rob(nums) {
        if (nums.length === 0) return 0;
        if (nums.length === 1) return nums[0];
        
        const dp = new Array(nums.length);
        dp[0] = nums[0];
        dp[1] = Math.max(nums[0], nums[1]);
        
        for (let i = 2; i < nums.length; i++) {
            dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);
        }
        
        return dp[nums.length - 1];
    }
    
    robOptimized(nums) {
        if (nums.length === 0) return 0;
        if (nums.length === 1) return nums[0];
        
        let prev2 = nums[0];
        let prev1 = Math.max(nums[0], nums[1]);
        
        for (let i = 2; i < nums.length; i++) {
            const current = Math.max(prev1, prev2 + nums[i]);
            prev2 = prev1;
            prev1 = current;
        }
        
        return prev1;
    }
    
    // 4. Coin Change Problem
    coinChange(coins, amount) {
        const dp = new Array(amount + 1).fill(amount + 1);
        dp[0] = 0;
        
        for (let i = 1; i <= amount; i++) {
            for (const coin of coins) {
                if (coin <= i) {
                    dp[i] = Math.min(dp[i], dp[i - coin] + 1);
                }
            }
        }
        
        return dp[amount] > amount ? -1 : dp[amount];
    }
    
    // 5. Longest Increasing Subsequence
    lengthOfLIS(nums) {
        if (nums.length === 0) return 0;
        
        const dp = new Array(nums.length).fill(1);
        let maxLength = 1;
        
        for (let i = 1; i < nums.length; i++) {
            for (let j = 0; j < i; j++) {
                if (nums[i] > nums[j]) {
                    dp[i] = Math.max(dp[i], dp[j] + 1);
                }
            }
            maxLength = Math.max(maxLength, dp[i]);
        }
        
        return maxLength;
    }
    
    // 6. Longest Common Subsequence
    longestCommonSubsequence(text1, text2) {
        const m = text1.length;
        const n = text2.length;
        const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
        
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (text1[i - 1] === text2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        
        return dp[m][n];
    }
    
    // 7. Edit Distance (Levenshtein Distance)
    minDistance(word1, word2) {
        const m = word1.length;
        const n = word2.length;
        const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
        
        // Initialize base cases
        for (let i = 0; i <= m; i++) dp[i][0] = i;
        for (let j = 0; j <= n; j++) dp[0][j] = j;
        
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (word1[i - 1] === word2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = Math.min(
                        dp[i - 1][j] + 1,     // deletion
                        dp[i][j - 1] + 1,     // insertion
                        dp[i - 1][j - 1] + 1  // substitution
                    );
                }
            }
        }
        
        return dp[m][n];
    }
    
    // 8. Maximum Subarray (Kadane's Algorithm)
    maxSubArray(nums) {
        let maxSoFar = nums[0];
        let maxEndingHere = nums[0];
        
        for (let i = 1; i < nums.length; i++) {
            maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);
            maxSoFar = Math.max(maxSoFar, maxEndingHere);
        }
        
        return maxSoFar;
    }
    
    // Utility methods
    resetComputationCount() {
        this.computationCount = 0;
    }
    
    getComputationCount() {
        return this.computationCount;
    }
    
    // Performance comparison
    compareApproaches(n) {
        console.log(\`Comparing approaches for Fibonacci(\${n}):\`);
        
        // Memoization
        this.resetComputationCount();
        const start1 = performance.now();
        const result1 = this.fibonacciMemo(n);
        const end1 = performance.now();
        console.log(\`Memoization: \${result1}, Time: \${(end1 - start1).toFixed(2)}ms, Computations: \${this.getComputationCount()}\`);
        
        // Tabulation
        this.resetComputationCount();
        const start2 = performance.now();
        const result2 = this.fibonacciTabulation(n);
        const end2 = performance.now();
        console.log(\`Tabulation: \${result2}, Time: \${(end2 - start2).toFixed(2)}ms, Computations: \${this.getComputationCount()}\`);
        
        // Optimized
        this.resetComputationCount();
        const start3 = performance.now();
        const result3 = this.fibonacciOptimized(n);
        const end3 = performance.now();
        console.log(\`Optimized: \${result3}, Time: \${(end3 - start3).toFixed(2)}ms, Computations: \${this.getComputationCount()}\`);
        
        // Naive (only for small n)
        if (n <= 35) {
            this.resetComputationCount();
            const start4 = performance.now();
            const result4 = this.fibonacciNaive(n);
            const end4 = performance.now();
            console.log(\`Naive: \${result4}, Time: \${(end4 - start4).toFixed(2)}ms, Computations: \${this.getComputationCount()}\`);
        }
    }
}

// Usage Examples
console.log('=== Dynamic Programming Examples ===');

const dp = new DynamicProgramming();

// Fibonacci comparison
dp.compareApproaches(30);

// Climbing stairs
console.log('\\nClimbing Stairs:');
console.log('Ways to climb 5 stairs:', dp.climbStairs(5)); // 8

// House robber
console.log('\\nHouse Robber:');
const houses = [2, 7, 9, 3, 1];
console.log('Max money from houses [2,7,9,3,1]:', dp.rob(houses)); // 12

// Coin change
console.log('\\nCoin Change:');
const coins = [1, 3, 4];
console.log('Min coins for amount 6 with [1,3,4]:', dp.coinChange(coins, 6)); // 2

// Longest increasing subsequence
console.log('\\nLongest Increasing Subsequence:');
const nums = [10, 9, 2, 5, 3, 7, 101, 18];
console.log('LIS length for [10,9,2,5,3,7,101,18]:', dp.lengthOfLIS(nums)); // 4

// Longest common subsequence
console.log('\\nLongest Common Subsequence:');
console.log('LCS of "abcde" and "ace":', dp.longestCommonSubsequence("abcde", "ace")); // 3

// Edit distance
console.log('\\nEdit Distance:');
console.log('Edit distance "horse" to "ros":', dp.minDistance("horse", "ros")); // 3

// Maximum subarray
console.log('\nMaximum Subarray:');
const array = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
console.log('Max subarray sum [-2,1,-3,4,-1,2,1,-5,4]:', dp.maxSubArray(array)); // 6

// Quiz questions
const quizQuestions = [
       if (n in memo) return memo[n];
       if (baseCase) return baseValue;
       
       memo[n] = recurrence(dpMemo(n-1, memo), dpMemo(n-2, memo));
       return memo[n];
   }
   \`\`\`

2. **Tabulation (Bottom-Up):**
   \`\`\`javascript
   function dpTab(n) {
       const dp = new Array(n + 1);
       dp[0] = baseValue1;
       dp[1] = baseValue2;
       
       for (let i = 2; i <= n; i++) {
           dp[i] = recurrence(dp[i-1], dp[i-2]);
       }
       return dp[n];
   }
   \`\`\`

3. **Space Optimization:**
   \`\`\`javascript
   function dpOptimized(n) {
       let prev2 = baseValue1, prev1 = baseValue2;
       for (let i = 2; i <= n; i++) {
           const current = recurrence(prev1, prev2);
           prev2 = prev1;
           prev1 = current;
       }
       return prev1;
   }
   \`\`\``,
    example: `// Fibonacci with Dynamic Programming
function fibonacci(n) {
    const dp = new Array(n + 1);
    dp[0] = 0;
    dp[1] = 1;
    
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];
    }
    return dp[n];
}

// Climbing Stairs Problem
function climbStairs(n) {
    if (n <= 2) return n;
    
    let prev2 = 1, prev1 = 2;
    for (let i = 3; i <= n; i++) {
        const current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }
    return prev1;
}

console.log(fibonacci(10)); // 55
console.log(climbStairs(5)); // 8`,
    syntax: `// Memoization Pattern
const memo = {};
function dpMemo(n) {
    if (n in memo) return memo[n];
    memo[n] = baseCase || recurrence(dpMemo(n-1));
    return memo[n];
}

// Tabulation Pattern  
function dpTab(n) {
    const dp = new Array(n + 1);
    dp[0] = baseCase;
    for (let i = 1; i <= n; i++) {
        dp[i] = recurrence(dp[i-1]);
    }
    return dp[n];
}`,
    quizQuestions: [
      {
        question: "What are the two key properties required for a problem to be solved using Dynamic Programming?",
        options: ["Recursion and Iteration", "Overlapping Subproblems and Optimal Substructure", "Memoization and Tabulation", "Top-down and Bottom-up"],
        correctAnswer: 1,
        explanation: "Dynamic Programming requires Overlapping Subproblems (same subproblems solved multiple times) and Optimal Substructure (optimal solution contains optimal solutions to subproblems)."
      },
      {
        question: "What is the main difference between Memoization and Tabulation approaches in DP?",
        options: ["Memoization is faster than Tabulation", "Memoization is top-down, Tabulation is bottom-up", "Memoization uses less memory", "Tabulation is recursive"],
        correctAnswer: 1,
        explanation: "Memoization is a top-down approach that starts with the original problem and stores results, while Tabulation is bottom-up, starting with base cases and building up to the solution."
      },
      {
        question: "What is the time complexity improvement of DP Fibonacci compared to naive recursive Fibonacci?",
        options: ["O(n) vs O(n²)", "O(n) vs O(2ⁿ)", "O(log n) vs O(n)", "O(1) vs O(n)"],
        correctAnswer: 1,
        explanation: "Naive recursive Fibonacci has O(2ⁿ) exponential time complexity due to redundant calculations, while DP Fibonacci achieves O(n) linear time by storing intermediate results."
      },
      {
        question: "When should you choose DP over other algorithmic approaches?",
        options: ["When the problem involves sorting", "When you need constant space complexity", "When the problem has overlapping subproblems and optimal substructure", "When the problem is naturally iterative"],
        correctAnswer: 2,
        explanation: "DP is ideal when a problem can be broken into overlapping subproblems with optimal substructure, allowing you to avoid redundant calculations and build optimal solutions from smaller optimal solutions."
      },
      {
        question: "What is the space optimization technique commonly used in DP problems?",
        options: ["Using recursion instead of iteration", "Keeping only necessary previous states instead of full table", "Using global variables", "Avoiding memoization"],
        correctAnswer: 1,
        explanation: "Space optimization in DP involves keeping only the necessary previous states (like previous row in 2D DP) instead of storing the entire table, reducing space complexity from O(n²) to O(n) in many cases."
      }
    ]
  },
  {
    id: 'longest-common-subsequence',
    title: 'Longest Common Subsequence',
    description: 'Finding the longest subsequence common to two sequences',
    category: 'Dynamic Programming',
    difficulty: 'intermediate',
    timeComplexity: 'O(mn)',
    spaceComplexity: 'O(mn)',
    extendedDefinition: `The Longest Common Subsequence (LCS) problem is a classic dynamic programming problem that finds the longest subsequence that appears in both given sequences in the same relative order, but not necessarily contiguous.

What it does: finds longest subsequence common to two sequences maintaining relative order but not requiring contiguous characters.

How it works: uses 2D DP table where dp[i][j] represents LCS length of first i and j characters, builds solution bottom-up.

When to use: sequence comparison needed, version control diffs, bioinformatics alignment, plagiarism detection, text similarity analysis.`,
    voiceExplanation: `Think of the Longest Common Subsequence like finding the "DNA" that two stories share! Imagine you have two different movie scripts, and you want to find the longest sequence of scenes that appear in both movies in the same order, but not necessarily back-to-back. For example, if Movie A has scenes [A, B, C, D, E] and Movie B has scenes [A, C, E, F, G], the longest common "story thread" would be [A, C, E] - these scenes appear in both movies in the same order! It's like finding the common thread that runs through two different narratives. This is incredibly useful in real life: when comparing DNA sequences to find evolutionary relationships, or when Git compares two versions of a file to show you what changed. The magic is that we don't need the common parts to be consecutive - just in the same relative order!`,
    realWorldApplications: `**Industry Applications:**
- **Bioinformatics**: DNA sequence alignment, protein structure analysis, phylogenetic tree construction
- **Software Development**: Version control systems (Git diff), code comparison tools, merge conflict resolution
- **Data Mining**: Pattern recognition, similarity analysis, data deduplication
- **Natural Language Processing**: Text similarity, plagiarism detection, machine translation alignment
- **Computational Biology**: Gene expression analysis, evolutionary studies, species classification
- **File Systems**: Backup systems, synchronization tools, incremental updates
- **Multimedia**: Video editing, audio synchronization, subtitle alignment
- **Database Systems**: Record matching, data integration, schema mapping
- **Network Security**: Intrusion detection, malware signature matching
- **Quality Assurance**: Test case optimization, regression testing, code coverage analysis`,
    keyConcepts: `**Essential Concepts:**
1. **Subsequence vs Substring**: Order matters, but contiguity doesn't for subsequences
2. **Optimal Substructure**: Solution built from optimal solutions of subproblems
3. **Overlapping Subproblems**: Same subproblems solved multiple times in naive approach
4. **2D DP Table**: Matrix where dp[i][j] represents LCS length for first i and j characters
5. **Base Cases**: Empty strings have LCS length 0
6. **Recurrence Relation**: Character match vs mismatch cases
7. **Backtracking**: Reconstructing the actual LCS from the DP table
8. **Space Optimization**: Reducing O(mn) space to O(min(m,n)) using rolling arrays`,
    pseudocode: `**Longest Common Subsequence Algorithms:**

ALGORITHM LCSLength(X, Y)
INPUT: X[1..m], Y[1..n] - two sequences
OUTPUT: length of longest common subsequence
BEGIN
    m = length of X
    n = length of Y
    CREATE dp[0..m][0..n]
    
    // Initialize base cases
    FOR i = 0 TO m DO
        dp[i][0] = 0
    END FOR
    FOR j = 0 TO n DO
        dp[0][j] = 0
    END FOR
    
    // Fill DP table
    FOR i = 1 TO m DO
        FOR j = 1 TO n DO
            IF X[i-1] = Y[j-1] THEN
                dp[i][j] = dp[i-1][j-1] + 1
            ELSE
                dp[i][j] = MAX(dp[i-1][j], dp[i][j-1])
            END IF
        END FOR
    END FOR
    
    RETURN dp[m][n]
END

ALGORITHM LCSConstruct(X, Y)
INPUT: X[1..m], Y[1..n] - two sequences
OUTPUT: actual longest common subsequence
BEGIN
    // First compute the DP table
    dp = LCSTable(X, Y)
    m = length of X
    n = length of Y
    
    // Backtrack to construct LCS
    lcs = ""
    i = m
    j = n
    
    WHILE i > 0 AND j > 0 DO
        IF X[i-1] = Y[j-1] THEN
            lcs = X[i-1] + lcs  // Prepend character
            i = i - 1
            j = j - 1
        ELSE IF dp[i-1][j] > dp[i][j-1] THEN
            i = i - 1
        ELSE
            j = j - 1
        END IF
    END WHILE
    
    RETURN lcs
END

ALGORITHM LCSSpaceOptimized(X, Y)
INPUT: X[1..m], Y[1..n] - two sequences
OUTPUT: length of LCS using O(min(m,n)) space
BEGIN
    // Ensure X is the shorter sequence
    IF length of X > length of Y THEN
        SWAP X and Y
    END IF
    
    m = length of X
    n = length of Y
    CREATE prev[0..m], curr[0..m]
    
    // Initialize base case
    FOR i = 0 TO m DO
        prev[i] = 0
    END FOR
    
    FOR j = 1 TO n DO
        curr[0] = 0
        FOR i = 1 TO m DO
            IF X[i-1] = Y[j-1] THEN
                curr[i] = prev[i-1] + 1
            ELSE
                curr[i] = MAX(prev[i], curr[i-1])
            END IF
        END FOR
        SWAP prev and curr
    END FOR
    
    RETURN prev[m]
END

ALGORITHM PrintAllLCS(X, Y, i, j, lcs, allLCS)
INPUT: sequences X, Y, indices i, j, current lcs, result set
OUTPUT: all possible longest common subsequences
BEGIN
    IF i = 0 OR j = 0 THEN
        ADD reverse(lcs) TO allLCS
        RETURN
    END IF
    
    IF X[i-1] = Y[j-1] THEN
        PrintAllLCS(X, Y, i-1, j-1, X[i-1] + lcs, allLCS)
    ELSE
        IF dp[i-1][j] >= dp[i][j-1] THEN
            PrintAllLCS(X, Y, i-1, j, lcs, allLCS)
        END IF
        IF dp[i][j-1] >= dp[i-1][j] THEN
            PrintAllLCS(X, Y, i, j-1, lcs, allLCS)
        END IF
    END IF
END`,
    implementationCode: `// Comprehensive Longest Common Subsequence Implementation

class LongestCommonSubsequence {
    constructor() {
        this.dpTable = null;
        this.computationCount = 0;
    }
    
    // 1. Basic LCS Length - O(mn) time, O(mn) space
    lcsLength(text1, text2) {
        const m = text1.length;
        const n = text2.length;
        this.dpTable = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
        
        // Fill DP table
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                this.computationCount++;
                if (text1[i - 1] === text2[j - 1]) {
                    this.dpTable[i][j] = this.dpTable[i - 1][j - 1] + 1;
                } else {
                    this.dpTable[i][j] = Math.max(
                        this.dpTable[i - 1][j],
                        this.dpTable[i][j - 1]
                    );
                }
            }
        }
        
        return this.dpTable[m][n];
    }
    
    // 2. LCS with actual subsequence construction
    lcsWithConstruction(text1, text2) {
        const length = this.lcsLength(text1, text2);
        const lcs = this.constructLCS(text1, text2);
        
        return {
            length: length,
            subsequence: lcs,
            table: this.dpTable
        };
    }
    
    // 3. Construct actual LCS using backtracking
    constructLCS(text1, text2) {
        if (!this.dpTable) {
            this.lcsLength(text1, text2);
        }
        
        let i = text1.length;
        let j = text2.length;
        let lcs = "";
        
        while (i > 0 && j > 0) {
            if (text1[i - 1] === text2[j - 1]) {
                lcs = text1[i - 1] + lcs;
                i--;
                j--;
            } else if (this.dpTable[i - 1][j] > this.dpTable[i][j - 1]) {
                i--;
            } else {
                j--;
            }
        }
        
        return lcs;
    }
    
    // 4. Space optimized version - O(min(m,n)) space
    lcsSpaceOptimized(text1, text2) {
        // Ensure text1 is shorter for space optimization
        if (text1.length > text2.length) {
            [text1, text2] = [text2, text1];
        }
        
        const m = text1.length;
        const n = text2.length;
        let prev = new Array(m + 1).fill(0);
        let curr = new Array(m + 1).fill(0);
        
        for (let j = 1; j <= n; j++) {
            curr[0] = 0;
            for (let i = 1; i <= m; i++) {
                if (text1[i - 1] === text2[j - 1]) {
                    curr[i] = prev[i - 1] + 1;
                } else {
                    curr[i] = Math.max(prev[i], curr[i - 1]);
                }
            }
            [prev, curr] = [curr, prev];
        }
        
        return prev[m];
    }
    
    // 5. Find all possible LCS (when multiple exist)
    findAllLCS(text1, text2) {
        this.lcsLength(text1, text2);
        const allLCS = [];
        this.printAllLCS(text1, text2, text1.length, text2.length, "", allLCS);
        return [...new Set(allLCS)]; // Remove duplicates
    }
    
    printAllLCS(text1, text2, i, j, lcs, allLCS) {
        if (i === 0 || j === 0) {
            allLCS.push(lcs.split('').reverse().join(''));
            return;
        }
        
        if (text1[i - 1] === text2[j - 1]) {
            this.printAllLCS(text1, text2, i - 1, j - 1, text1[i - 1] + lcs, allLCS);
        } else {
            if (this.dpTable[i - 1][j] >= this.dpTable[i][j - 1]) {
                this.printAllLCS(text1, text2, i - 1, j, lcs, allLCS);
            }
            if (this.dpTable[i][j - 1] >= this.dpTable[i - 1][j]) {
                this.printAllLCS(text1, text2, i, j - 1, lcs, allLCS);
            }
        }
    }
    
    // 6. LCS for multiple sequences (3 sequences)
    lcsThreeSequences(text1, text2, text3) {
        const m = text1.length;
        const n = text2.length;
        const p = text3.length;
        
        const dp = Array(m + 1).fill().map(() => 
            Array(n + 1).fill().map(() => Array(p + 1).fill(0))
        );
        
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                for (let k = 1; k <= p; k++) {
                    if (text1[i - 1] === text2[j - 1] && text2[j - 1] === text3[k - 1]) {
                        dp[i][j][k] = dp[i - 1][j - 1][k - 1] + 1;
                    } else {
                        dp[i][j][k] = Math.max(
                            dp[i - 1][j][k],
                            dp[i][j - 1][k],
                            dp[i][j][k - 1]
                        );
                    }
                }
            }
        }
        
        return dp[m][n][p];
    }
    
    // 7. LCS with character weights
    lcsWeighted(text1, text2, weights) {
        const m = text1.length;
        const n = text2.length;
        const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
        
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (text1[i - 1] === text2[j - 1]) {
                    const char = text1[i - 1];
                    const weight = weights[char] || 1;
                    dp[i][j] = dp[i - 1][j - 1] + weight;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        
        return dp[m][n];
    }
    
    // 8. Utility methods
    printDPTable(text1, text2) {
        if (!this.dpTable) return;
        
        console.log('\\nDP Table for LCS:');
        console.log('    ε ' + text2.split('').join(' '));
        
        for (let i = 0; i <= text1.length; i++) {
            const rowLabel = i === 0 ? 'ε' : text1[i - 1];
            const row = this.dpTable[i].map(val => val.toString().padStart(2)).join(' ');
            console.log(\`\${rowLabel.padStart(2)} \${row}\`);
        }
    }
    
    visualizeLCS(text1, text2) {
        const result = this.lcsWithConstruction(text1, text2);
        
        console.log(\`\\nLCS Analysis:\`);
        console.log(\`Text 1: "\${text1}"\`);
        console.log(\`Text 2: "\${text2}"\`);
        console.log(\`LCS Length: \${result.length}\`);
        console.log(\`LCS: "\${result.subsequence}"\`);
        console.log(\`Similarity: \${(result.length / Math.max(text1.length, text2.length) * 100).toFixed(1)}%\`);
        
        this.printDPTable(text1, text2);
        return result;
    }
    
    resetComputationCount() {
        this.computationCount = 0;
    }
    
    getComputationCount() {
        return this.computationCount;
    }
}

// Usage Examples and Applications
console.log('=== Longest Common Subsequence Examples ===');

const lcs = new LongestCommonSubsequence();

// Basic LCS
console.log('\\n1. Basic LCS:');
const result1 = lcs.visualizeLCS("ABCDGH", "AEDFHR");

// DNA sequence alignment example
console.log('\\n2. DNA Sequence Alignment:');
const dna1 = "ATCGATCG";
const dna2 = "ATGCATCG";
const dnaResult = lcs.visualizeLCS(dna1, dna2);

// Text similarity
console.log('\\n3. Text Similarity:');
const text1 = "HELLO WORLD";
const text2 = "HELO WORD";
const textResult = lcs.visualizeLCS(text1, text2);

// Multiple LCS
console.log('\\n4. All Possible LCS:');
const allLCS = lcs.findAllLCS("ABCD", "ACBDX");
console.log('All LCS for "ABCD" and "ACBDX":', allLCS);

// Space optimized
console.log('\\n5. Space Optimized:');
lcs.resetComputationCount();
const spaceOpt = lcs.lcsSpaceOptimized("PROGRAMMING", "ALGORITHM");
console.log(\`Space optimized LCS length: \${spaceOpt}\`);

// Three sequences
console.log('\\n6. Three Sequences LCS:');
const threeLCS = lcs.lcsThreeSequences("ABC", "AC", "BC");
console.log('LCS of "ABC", "AC", "BC":', threeLCS);

// Weighted LCS
console.log('\\n7. Weighted LCS:');
const weights = {'A': 3, 'B': 2, 'C': 1, 'D': 4};
const weightedLCS = lcs.lcsWeighted("ABCD", "ACBD", weights);
console.log('Weighted LCS score:', weightedLCS);

// Performance comparison
console.log('\\n8. Performance Analysis:');
const longText1 = "A".repeat(100) + "B".repeat(100);
const longText2 = "A".repeat(50) + "C".repeat(50) + "B".repeat(100);

lcs.resetComputationCount();
const start1 = performance.now();
const normalResult = lcs.lcsLength(longText1, longText2);
const end1 = performance.now();

const start2 = performance.now();
const optimizedResult = lcs.lcsSpaceOptimized(longText1, longText2);
const end2 = performance.now();

console.log(\`Normal DP: \${normalResult}, Time: \${(end1-start1).toFixed(2)}ms\`);
console.log(\`Space Optimized: \${optimizedResult}, Time: \${(end2-start2).toFixed(2)}ms\`);
console.log(\`Computations: \${lcs.getComputationCount()}\`);`,
    quizQuestions: [
      {
        question: "What is the key difference between a subsequence and a substring?",
        options: ["Subsequences must be contiguous, substrings don't", "Substrings must be contiguous, subsequences don't", "They are the same thing", "Subsequences are always longer"],
        correctAnswer: 1,
        explanation: "A substring must have contiguous characters, while a subsequence maintains relative order but characters don't need to be adjacent."
      },
      {
        question: "What is the time complexity of the standard LCS dynamic programming solution?",
        options: ["O(m + n)", "O(mn)", "O(m²n)", "O(2^(m+n))"],
        correctAnswer: 1,
        explanation: "The standard DP solution uses a 2D table of size (m+1) × (n+1) and fills each cell once, resulting in O(mn) time complexity."
      },
      {
        question: "In the LCS recurrence relation, what happens when characters don't match?",
        options: ["We add 1 to the diagonal value", "We take the maximum of left and top values", "We take the minimum of left and top values", "We set the value to 0"],
        correctAnswer: 1,
        explanation: "When characters don't match, LCS[i][j] = max(LCS[i-1][j], LCS[i][j-1]) - we take the better of excluding one character from either string."
      },
      {
        question: "How can we optimize the space complexity of LCS from O(mn) to O(min(m,n))?",
        options: ["Use recursion with memoization", "Use only two rows/columns instead of full table", "Use a hash table", "Use binary search"],
        correctAnswer: 1,
        explanation: "We can use rolling arrays - only keeping the current and previous row (or column), reducing space to O(min(m,n))."
      },
      {
        question: "What is a real-world application of LCS?",
        options: ["Sorting algorithms", "Hash table collisions", "Git diff algorithms", "Binary search optimization"],
        correctAnswer: 2,
        explanation: "LCS is used in version control systems like Git to find differences between file versions, showing what lines were added, removed, or unchanged."
      }
    ]
  },
  {
    id: 'knapsack-problem',
    title: '0/1 Knapsack Problem',
    description: 'Optimization problem with weight and value constraints',
    category: 'Dynamic Programming',
    difficulty: 'intermediate',
    timeComplexity: 'O(nW)',
    spaceComplexity: 'O(nW)',
    extendedDefinition: `The 0/1 Knapsack Problem is a classic optimization problem in dynamic programming where you have a knapsack with a weight capacity W and n items, each with a weight and value. The goal is to maximize the total value of items in the knapsack without exceeding the weight capacity, with the constraint that each item can either be taken (1) or not taken (0).

What it does: maximizes value of selected items within weight constraint where each item can only be taken once or not at all.

How it works: uses 2D DP table where dp[i][w] represents maximum value using first i items with weight limit w, builds solution bottom-up.

When to use: resource allocation problems, budget optimization, cargo loading, portfolio selection, any binary choice optimization with constraints.`,
    voiceExplanation: `Imagine you're going on a camping trip and you have a backpack that can only carry 50 pounds. You have a bunch of items you'd like to take: a tent (heavy but very useful), snacks (light and valuable), a camera (medium weight, high sentimental value), books (heavy, moderate value), etc. The 0/1 Knapsack problem is like being the world's most strategic packer! You can't cut items in half - you either take the whole tent or leave it behind. Your goal is to pack the most valuable combination of complete items without exceeding your 50-pound limit. It's like playing Tetris with values and weights! This problem appears everywhere in real life: when companies decide which projects to fund with a limited budget, when you're choosing which apps to install on your phone with limited storage, or when airlines decide which cargo to load to maximize profit while staying within weight limits.`,
    realWorldApplications: `**Industry Applications:**
- **Finance**: Portfolio optimization, capital budgeting, investment selection
- **Logistics**: Cargo loading optimization, shipping container packing
- **Manufacturing**: Production planning, resource allocation, machine scheduling
- **Computer Science**: Memory allocation, process scheduling, cache optimization
- **Retail**: Inventory management, shelf space allocation, promotional budgeting
- **Energy**: Power plant selection, renewable energy investment
- **Telecommunications**: Bandwidth allocation, network resource management
- **Healthcare**: Medical equipment allocation, treatment selection optimization
- **Military**: Equipment selection for missions, supply chain optimization
- **Gaming**: Character build optimization, inventory management systems`,
    keyConcepts: `**Essential Concepts:**
1. **0/1 Constraint**: Each item can be taken at most once (binary choice)
2. **Optimal Substructure**: Optimal solution built from optimal subproblems
3. **Overlapping Subproblems**: Same subproblems appear multiple times
4. **2D DP Table**: dp[i][w] represents max value using first i items with capacity w
5. **Base Cases**: No items or zero capacity gives zero value
6. **Choice Decision**: For each item, decide whether to include or exclude
7. **Backtracking**: Reconstructing which items were selected
8. **Space Optimization**: Reducing space complexity using 1D array`,
    pseudocode: `**0/1 Knapsack Algorithms:**

ALGORITHM Knapsack01(weights, values, capacity)
INPUT: weights[1..n], values[1..n], capacity W
OUTPUT: maximum value achievable
BEGIN
    n = length of weights
    CREATE dp[0..n][0..W]
    
    // Initialize base cases
    FOR i = 0 TO n DO
        dp[i][0] = 0
    END FOR
    FOR w = 0 TO W DO
        dp[0][w] = 0
    END FOR
    
    // Fill DP table
    FOR i = 1 TO n DO
        FOR w = 1 TO W DO
            // Option 1: Don't take item i
            dp[i][w] = dp[i-1][w]
            
            // Option 2: Take item i (if it fits)
            IF weights[i-1] <= w THEN
                takeValue = dp[i-1][w-weights[i-1]] + values[i-1]
                dp[i][w] = MAX(dp[i][w], takeValue)
            END IF
        END FOR
    END FOR
    
    RETURN dp[n][W]
END

ALGORITHM KnapsackWithItems(weights, values, capacity)
INPUT: weights[1..n], values[1..n], capacity W
OUTPUT: maximum value and selected items
BEGIN
    dp = Knapsack01(weights, values, capacity)
    selectedItems = []
    
    // Backtrack to find selected items
    i = n
    w = capacity
    
    WHILE i > 0 AND w > 0 DO
        // If value came from including item i
        IF dp[i][w] != dp[i-1][w] THEN
            ADD i-1 TO selectedItems
            w = w - weights[i-1]
        END IF
        i = i - 1
    END WHILE
    
    RETURN (dp[n][W], reverse(selectedItems))
END

ALGORITHM KnapsackSpaceOptimized(weights, values, capacity)
INPUT: weights[1..n], values[1..n], capacity W
OUTPUT: maximum value using O(W) space
BEGIN
    n = length of weights
    CREATE dp[0..W]
    
    // Initialize base case
    FOR w = 0 TO W DO
        dp[w] = 0
    END FOR
    
    // Process each item
    FOR i = 0 TO n-1 DO
        // Traverse backwards to avoid using updated values
        FOR w = W DOWN TO weights[i] DO
            dp[w] = MAX(dp[w], dp[w-weights[i]] + values[i])
        END FOR
    END FOR
    
    RETURN dp[W]
END

ALGORITHM UnboundedKnapsack(weights, values, capacity)
INPUT: weights[1..n], values[1..n], capacity W (items can be taken multiple times)
OUTPUT: maximum value achievable
BEGIN
    CREATE dp[0..W]
    
    FOR w = 0 TO W DO
        dp[w] = 0
    END FOR
    
    FOR w = 1 TO W DO
        FOR i = 0 TO n-1 DO
            IF weights[i] <= w THEN
                dp[w] = MAX(dp[w], dp[w-weights[i]] + values[i])
            END IF
        END FOR
    END FOR
    
    RETURN dp[W]
END`,
    implementationCode: `// Comprehensive 0/1 Knapsack Implementation

class KnapsackSolver {
    constructor() {
        this.dpTable = null;
        this.computationCount = 0;
    }
    
    // 1. Basic 0/1 Knapsack - O(nW) time, O(nW) space
    knapsack01(weights, values, capacity) {
        const n = weights.length;
        this.dpTable = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));
        
        // Fill DP table
        for (let i = 1; i <= n; i++) {
            for (let w = 1; w <= capacity; w++) {
                this.computationCount++;
                
                // Option 1: Don't take item i-1
                this.dpTable[i][w] = this.dpTable[i - 1][w];
                
                // Option 2: Take item i-1 (if it fits)
                if (weights[i - 1] <= w) {
                    const takeValue = this.dpTable[i - 1][w - weights[i - 1]] + values[i - 1];
                    this.dpTable[i][w] = Math.max(this.dpTable[i][w], takeValue);
                }
            }
        }
        
        return this.dpTable[n][capacity];
    }
    
    // 2. Knapsack with item tracking
    knapsackWithItems(weights, values, capacity) {
        const maxValue = this.knapsack01(weights, values, capacity);
        const selectedItems = this.findSelectedItems(weights, values, capacity);
        
        return {
            maxValue: maxValue,
            selectedItems: selectedItems,
            totalWeight: selectedItems.reduce((sum, i) => sum + weights[i], 0),
            totalValue: selectedItems.reduce((sum, i) => sum + values[i], 0)
        };
    }
    
    // 3. Find which items were selected
    findSelectedItems(weights, values, capacity) {
        if (!this.dpTable) return [];
        
        const selectedItems = [];
        let i = weights.length;
        let w = capacity;
        
        while (i > 0 && w > 0) {
            // If value came from including item i-1
            if (this.dpTable[i][w] !== this.dpTable[i - 1][w]) {
                selectedItems.push(i - 1);
                w -= weights[i - 1];
            }
            i--;
        }
        
        return selectedItems.reverse();
    }
    
    // 4. Space optimized version - O(W) space
    knapsackSpaceOptimized(weights, values, capacity) {
        const n = weights.length;
        let dp = new Array(capacity + 1).fill(0);
        
        for (let i = 0; i < n; i++) {
            // Traverse backwards to avoid using updated values
            for (let w = capacity; w >= weights[i]; w--) {
                dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
                this.computationCount++;
            }
        }
        
        return dp[capacity];
    }
    
    // 5. Unbounded Knapsack (items can be taken multiple times)
    unboundedKnapsack(weights, values, capacity) {
        const dp = new Array(capacity + 1).fill(0);
        
        for (let w = 1; w <= capacity; w++) {
            for (let i = 0; i < weights.length; i++) {
                if (weights[i] <= w) {
                    dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
                    this.computationCount++;
                }
            }
        }
        
        return dp[capacity];
    }
    
    // 6. Bounded Knapsack (limited quantity of each item)
    boundedKnapsack(weights, values, quantities, capacity) {
        // Convert to 0/1 knapsack by expanding items
        const expandedWeights = [];
        const expandedValues = [];
        
        for (let i = 0; i < weights.length; i++) {
            for (let j = 0; j < quantities[i]; j++) {
                expandedWeights.push(weights[i]);
                expandedValues.push(values[i]);
            }
        }
        
        return this.knapsackSpaceOptimized(expandedWeights, expandedValues, capacity);
    }
    
    // 7. Fractional Knapsack (greedy approach for comparison)
    fractionalKnapsack(weights, values, capacity) {
        const n = weights.length;
        const items = [];
        
        // Create items with value-to-weight ratio
        for (let i = 0; i < n; i++) {
            items.push({
                index: i,
                weight: weights[i],
                value: values[i],
                ratio: values[i] / weights[i]
            });
        }
        
        // Sort by value-to-weight ratio in descending order
        items.sort((a, b) => b.ratio - a.ratio);
        
        let totalValue = 0;
        let remainingCapacity = capacity;
        const selectedItems = [];
        
        for (const item of items) {
            if (remainingCapacity >= item.weight) {
                // Take the whole item
                totalValue += item.value;
                remainingCapacity -= item.weight;
                selectedItems.push({ index: item.index, fraction: 1 });
            } else if (remainingCapacity > 0) {
                // Take fraction of the item
                const fraction = remainingCapacity / item.weight;
                totalValue += item.value * fraction;
                selectedItems.push({ index: item.index, fraction: fraction });
                remainingCapacity = 0;
                break;
            }
        }
        
        return {
            maxValue: totalValue,
            selectedItems: selectedItems
        };
    }
    
    // 8. Multi-dimensional Knapsack (2D constraints)
    multiDimensionalKnapsack(weights1, weights2, values, capacity1, capacity2) {
        const n = weights1.length;
        const dp = Array(capacity1 + 1).fill().map(() => Array(capacity2 + 1).fill(0));
        
        for (let i = 0; i < n; i++) {
            for (let w1 = capacity1; w1 >= weights1[i]; w1--) {
                for (let w2 = capacity2; w2 >= weights2[i]; w2--) {
                    dp[w1][w2] = Math.max(
                        dp[w1][w2],
                        dp[w1 - weights1[i]][w2 - weights2[i]] + values[i]
                    );
                }
            }
        }
        
        return dp[capacity1][capacity2];
    }
    
    // 9. Utility methods
    printDPTable(weights, values, capacity) {
        if (!this.dpTable) return;
        
        console.log('\\nKnapsack DP Table:');
        console.log('Items:', values.map((v, i) => \`(\${weights[i]},\${v})\`).join(' '));
        console.log('Capacity →');
        
        const header = '    ' + Array.from({length: capacity + 1}, (_, i) => i.toString().padStart(3)).join('');
        console.log(header);
        
        for (let i = 0; i <= weights.length; i++) {
            const rowLabel = i === 0 ? '∅' : \`I\${i}\`;
            const row = this.dpTable[i].map(val => val.toString().padStart(3)).join('');
            console.log(\`\${rowLabel.padStart(3)} \${row}\`);
        }
    }
    
    analyzeKnapsack(weights, values, capacity) {
        console.log(\`\\n=== Knapsack Analysis ===\`);
        console.log(\`Items: \${weights.map((w, i) => \`(\${w}kg, $\${values[i]})\`).join(', ')}\`);
        console.log(\`Capacity: \${capacity}kg\`);
        
        this.resetComputationCount();
        const result = this.knapsackWithItems(weights, values, capacity);
        
        console.log(\`\\nOptimal Solution:\`);
        console.log(\`Max Value: $\${result.maxValue}\`);
        console.log(\`Total Weight: \${result.totalWeight}kg\`);
        console.log(\`Selected Items: \${result.selectedItems.map(i => \`Item \${i+1}\`).join(', ')}\`);
        console.log(\`Efficiency: \${(result.maxValue / result.totalWeight).toFixed(2)} $/kg\`);
        console.log(\`Capacity Used: \${(result.totalWeight / capacity * 100).toFixed(1)}%\`);
        
        this.printDPTable(weights, values, capacity);
        
        // Compare with fractional knapsack
        const fractional = this.fractionalKnapsack(weights, values, capacity);
        console.log(\`\\nFractional Knapsack (Upper Bound): $\${fractional.maxValue.toFixed(2)}\`);
        console.log(\`Gap: \${((fractional.maxValue - result.maxValue) / result.maxValue * 100).toFixed(1)}%\`);
        
        return result;
    }
    
    resetComputationCount() {
        this.computationCount = 0;
    }
    
    getComputationCount() {
        return this.computationCount;
    }
}

// Usage Examples and Applications
console.log('=== 0/1 Knapsack Problem Examples ===');

const knapsack = new KnapsackSolver();

// Example 1: Classic knapsack problem
console.log('\\n1. Classic Knapsack Problem:');
const weights1 = [2, 1, 3, 2];
const values1 = [12, 10, 20, 15];
const capacity1 = 5;
knapsack.analyzeKnapsack(weights1, values1, capacity1);

// Example 2: Investment portfolio
console.log('\\n2. Investment Portfolio Optimization:');
const investments = [
    { name: 'Stock A', cost: 1000, return: 150 },
    { name: 'Bond B', cost: 2000, return: 200 },
    { name: 'Real Estate', cost: 5000, return: 600 },
    { name: 'Crypto', cost: 1500, return: 300 },
    { name: 'Mutual Fund', cost: 3000, return: 350 }
];
const budget = 8000;

const costs = investments.map(inv => inv.cost);
const returns = investments.map(inv => inv.return);
const portfolioResult = knapsack.knapsackWithItems(costs, returns, budget);

console.log('Investment Analysis:');
console.log(\`Budget: $\${budget}\`);
console.log(\`Max Return: $\${portfolioResult.maxValue}\`);
console.log(\`Selected Investments:\`);
portfolioResult.selectedItems.forEach(i => {
    console.log(\`  - \${investments[i].name}: Cost $\${investments[i].cost}, Return $\${investments[i].return}\`);
});

// Example 3: Space optimization comparison
console.log('\\n3. Space Optimization Comparison:');
const largeWeights = Array.from({length: 20}, (_, i) => i + 1);
const largeValues = Array.from({length: 20}, (_, i) => (i + 1) * 2);
const largeCapacity = 50;

knapsack.resetComputationCount();
const start1 = performance.now();
const result1 = knapsack.knapsack01(largeWeights, largeValues, largeCapacity);
const end1 = performance.now();
const computations1 = knapsack.getComputationCount();

knapsack.resetComputationCount();
const start2 = performance.now();
const result2 = knapsack.knapsackSpaceOptimized(largeWeights, largeValues, largeCapacity);
const end2 = performance.now();
const computations2 = knapsack.getComputationCount();

console.log(\`Standard DP: Value=\${result1}, Time=\${(end1-start1).toFixed(2)}ms, Computations=\${computations1}\`);
console.log(\`Space Optimized: Value=\${result2}, Time=\${(end2-start2).toFixed(2)}ms, Computations=\${computations2}\`);

// Example 4: Unbounded vs 0/1 comparison
console.log('\\n4. Unbounded vs 0/1 Knapsack:');
const coinWeights = [1, 3, 4];
const coinValues = [1, 4, 5];
const coinCapacity = 7;

const bounded = knapsack.knapsackSpaceOptimized(coinWeights, coinValues, coinCapacity);
const unbounded = knapsack.unboundedKnapsack(coinWeights, coinValues, coinCapacity);

console.log(\`0/1 Knapsack: \${bounded}\`);
console.log(\`Unbounded Knapsack: \${unbounded}\`);`,
    quizQuestions: [
      {
        question: "What is the key difference between 0/1 Knapsack and Fractional Knapsack?",
        options: ["0/1 uses DP, Fractional uses greedy", "0/1 allows partial items, Fractional doesn't", "0/1 doesn't allow partial items, Fractional does", "They are the same problem"],
        correctAnswer: 2,
        explanation: "In 0/1 Knapsack, items must be taken completely or not at all. In Fractional Knapsack, items can be broken into fractions, allowing for a greedy solution."
      },
      {
        question: "What is the time complexity of the standard 0/1 Knapsack DP solution?",
        options: ["O(n)", "O(W)", "O(nW)", "O(n²W)"],
        correctAnswer: 2,
        explanation: "The standard DP solution uses a 2D table of size (n+1) × (W+1) and fills each cell once, resulting in O(nW) time complexity."
      },
      {
        question: "In the 0/1 Knapsack recurrence relation, what do we do when an item's weight exceeds current capacity?",
        options: ["Include the item anyway", "Skip to the next item", "Take the value from the row above", "Set the value to 0"],
        correctAnswer: 2,
        explanation: "When an item's weight exceeds the current capacity, we can't include it, so we take the value from the previous row (without this item)."
      },
      {
        question: "How can we optimize the space complexity of 0/1 Knapsack from O(nW) to O(W)?",
        options: ["Use recursion", "Use only one row and traverse backwards", "Use a hash table", "Use multiple threads"],
        correctAnswer: 1,
        explanation: "We can use only one row (1D array) and traverse backwards to avoid overwriting values we still need, reducing space to O(W)."
      },
      {
        question: "What is a real-world application of the 0/1 Knapsack problem?",
        options: ["Sorting algorithms", "Graph traversal", "Portfolio optimization", "String matching"],
        correctAnswer: 2,
        explanation: "Portfolio optimization is a classic application where you select investments (items) to maximize returns (value) within a budget constraint (capacity)."
      }
    ]
  },
  {
    id: 'longest-increasing-subsequence',
    title: 'Longest Increasing Subsequence',
    description: 'Finding the longest strictly increasing subsequence',
    category: 'Dynamic Programming',
    difficulty: 'intermediate',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    extendedDefinition: `The Longest Increasing Subsequence (LIS) problem finds the longest subsequence of a given sequence where all elements are in strictly increasing order. Unlike the Longest Common Subsequence, LIS works with a single sequence and focuses on maintaining increasing order.

What it does: finds longest subsequence where elements are in strictly increasing order, maintaining relative positions but not requiring contiguity.

How it works: uses dynamic programming or binary search to build up solutions, checking each element against previous elements to extend sequences.

When to use: sequence analysis, scheduling problems, stock trading analysis, bioinformatics, trend identification in time series data.`,
    voiceExplanation: `Think of the Longest Increasing Subsequence like watching a mountain climber's elevation over time! Imagine you have a graph showing a hiker's altitude throughout a day - sometimes they go up, sometimes down, sometimes they rest at the same level. The LIS is like finding the longest continuous upward journey they could have taken if they could magically skip the downhill parts! For example, if their elevations were [100, 200, 150, 300, 250, 400], the longest increasing journey would be [100, 200, 300, 400] - they skip the dips but maintain the upward trend. This is super useful in real life: stock traders use it to find the longest period of rising prices, project managers use it to schedule tasks that build on each other, and even dating apps might use it to find people with consistently improving profiles over time! It's like finding the most optimistic story you can tell with your data points.`,
    realWorldApplications: `**Industry Applications:**
- **Finance**: Stock price trend analysis, portfolio optimization, market timing strategies
- **Project Management**: Task scheduling, dependency resolution, milestone planning
- **Bioinformatics**: Gene sequence analysis, protein folding prediction, evolutionary studies
- **Data Mining**: Trend detection, pattern recognition, time series analysis
- **Manufacturing**: Production line optimization, quality improvement tracking
- **Sports Analytics**: Performance improvement tracking, training progression analysis
- **Supply Chain**: Inventory level optimization, demand forecasting
- **Network Optimization**: Bandwidth allocation, traffic flow analysis
- **Gaming**: Level progression systems, skill development tracking
- **Education**: Learning path optimization, curriculum sequencing`,
    keyConcepts: `**Essential Concepts:**
1. **Subsequence Property**: Maintains relative order without requiring contiguity
2. **Strictly Increasing**: Each element must be greater than the previous
3. **Optimal Substructure**: LIS at position i built from optimal LIS at previous positions
4. **DP State**: dp[i] represents length of LIS ending at position i
5. **Binary Search Optimization**: Using auxiliary array for O(n log n) solution
6. **Patience Sorting**: Alternative perspective using card game analogy
7. **Reconstruction**: Backtracking to find actual LIS elements
8. **Multiple Solutions**: Different subsequences can have same maximum length`,
    pseudocode: `**Longest Increasing Subsequence Algorithms:**

ALGORITHM LIS_DP(arr)
INPUT: array arr[0..n-1]
OUTPUT: length of longest increasing subsequence
BEGIN
    n = length of arr
    CREATE dp[0..n-1]
    
    // Initialize: each element forms LIS of length 1
    FOR i = 0 TO n-1 DO
        dp[i] = 1
    END FOR
    
    // Fill DP array
    FOR i = 1 TO n-1 DO
        FOR j = 0 TO i-1 DO
            IF arr[j] < arr[i] THEN
                dp[i] = MAX(dp[i], dp[j] + 1)
            END IF
        END FOR
    END FOR
    
    // Find maximum length
    maxLength = 0
    FOR i = 0 TO n-1 DO
        maxLength = MAX(maxLength, dp[i])
    END FOR
    
    RETURN maxLength
END

ALGORITHM LIS_BinarySearch(arr)
INPUT: array arr[0..n-1]
OUTPUT: length of LIS using O(n log n) approach
BEGIN
    n = length of arr
    CREATE tails[0..n-1]  // tails[i] = smallest tail of LIS of length i+1
    length = 0
    
    FOR i = 0 TO n-1 DO
        // Binary search for position to insert arr[i]
        left = 0
        right = length
        
        WHILE left < right DO
            mid = (left + right) / 2
            IF tails[mid] < arr[i] THEN
                left = mid + 1
            ELSE
                right = mid
            END IF
        END WHILE
        
        // Update tails array
        tails[left] = arr[i]
        
        // If we extended the LIS
        IF left = length THEN
            length = length + 1
        END IF
    END FOR
    
    RETURN length
END

ALGORITHM LIS_WithReconstruction(arr)
INPUT: array arr[0..n-1]
OUTPUT: actual LIS sequence
BEGIN
    n = length of arr
    CREATE dp[0..n-1], parent[0..n-1]
    
    // Initialize
    FOR i = 0 TO n-1 DO
        dp[i] = 1
        parent[i] = -1
    END FOR
    
    // Fill DP and parent arrays
    FOR i = 1 TO n-1 DO
        FOR j = 0 TO i-1 DO
            IF arr[j] < arr[i] AND dp[j] + 1 > dp[i] THEN
                dp[i] = dp[j] + 1
                parent[i] = j
            END IF
        END FOR
    END FOR
    
    // Find ending position of LIS
    maxLength = 0
    endIndex = 0
    FOR i = 0 TO n-1 DO
        IF dp[i] > maxLength THEN
            maxLength = dp[i]
            endIndex = i
        END IF
    END FOR
    
    // Reconstruct LIS
    lis = []
    current = endIndex
    WHILE current != -1 DO
        INSERT arr[current] AT BEGINNING OF lis
        current = parent[current]
    END WHILE
    
    RETURN lis
END

ALGORITHM CountLIS(arr)
INPUT: array arr[0..n-1]
OUTPUT: number of different LIS
BEGIN
    n = length of arr
    CREATE dp[0..n-1], count[0..n-1]
    
    // Initialize
    FOR i = 0 TO n-1 DO
        dp[i] = 1
        count[i] = 1
    END FOR
    
    FOR i = 1 TO n-1 DO
        FOR j = 0 TO i-1 DO
            IF arr[j] < arr[i] THEN
                IF dp[j] + 1 > dp[i] THEN
                    dp[i] = dp[j] + 1
                    count[i] = count[j]
                ELSE IF dp[j] + 1 = dp[i] THEN
                    count[i] = count[i] + count[j]
                END IF
            END IF
        END FOR
    END FOR
    
    // Find maximum length and sum counts
    maxLength = MAX(dp)
    totalCount = 0
    FOR i = 0 TO n-1 DO
        IF dp[i] = maxLength THEN
            totalCount = totalCount + count[i]
        END IF
    END FOR
    
    RETURN totalCount
END`,
    implementationCode: `// Comprehensive Longest Increasing Subsequence Implementation

class LongestIncreasingSubsequence {
    constructor() {
        this.dpArray = null;
        this.parentArray = null;
        this.computationCount = 0;
    }
    
    // 1. Basic DP approach - O(n²) time, O(n) space
    lisDP(nums) {
        if (nums.length === 0) return 0;
        
        const n = nums.length;
        this.dpArray = new Array(n).fill(1);
        
        for (let i = 1; i < n; i++) {
            for (let j = 0; j < i; j++) {
                this.computationCount++;
                if (nums[j] < nums[i]) {
                    this.dpArray[i] = Math.max(this.dpArray[i], this.dpArray[j] + 1);
                }
            }
        }
        
        return Math.max(...this.dpArray);
    }
    
    // 2. Binary search approach - O(n log n) time, O(n) space
    lisBinarySearch(nums) {
        if (nums.length === 0) return 0;
        
        const tails = []; // tails[i] = smallest tail of LIS of length i+1
        
        for (const num of nums) {
            this.computationCount++;
            
            // Binary search for the position to insert num
            let left = 0;
            let right = tails.length;
            
            while (left < right) {
                const mid = Math.floor((left + right) / 2);
                if (tails[mid] < num) {
                    left = mid + 1;
                } else {
                    right = mid;
                }
            }
            
            // Update tails array
            if (left === tails.length) {
                tails.push(num);
            } else {
                tails[left] = num;
            }
        }
        
        return tails.length;
    }
    
    // 3. LIS with reconstruction - returns actual subsequence
    lisWithReconstruction(nums) {
        if (nums.length === 0) return [];
        
        const n = nums.length;
        const dp = new Array(n).fill(1);
        const parent = new Array(n).fill(-1);
        
        // Fill DP and parent arrays
        for (let i = 1; i < n; i++) {
            for (let j = 0; j < i; j++) {
                if (nums[j] < nums[i] && dp[j] + 1 > dp[i]) {
                    dp[i] = dp[j] + 1;
                    parent[i] = j;
                }
            }
        }
        
        // Find the ending position of LIS
        let maxLength = 0;
        let endIndex = 0;
        for (let i = 0; i < n; i++) {
            if (dp[i] > maxLength) {
                maxLength = dp[i];
                endIndex = i;
            }
        }
        
        // Reconstruct the LIS
        const lis = [];
        let current = endIndex;
        while (current !== -1) {
            lis.unshift(nums[current]);
            current = parent[current];
        }
        
        return {
            length: maxLength,
            subsequence: lis,
            endIndex: endIndex
        };
    }
    
    // 4. Count number of different LIS
    countLIS(nums) {
        if (nums.length === 0) return 0;
        
        const n = nums.length;
        const dp = new Array(n).fill(1);
        const count = new Array(n).fill(1);
        
        for (let i = 1; i < n; i++) {
            for (let j = 0; j < i; j++) {
                if (nums[j] < nums[i]) {
                    if (dp[j] + 1 > dp[i]) {
                        dp[i] = dp[j] + 1;
                        count[i] = count[j];
                    } else if (dp[j] + 1 === dp[i]) {
                        count[i] += count[j];
                    }
                }
            }
        }
        
        const maxLength = Math.max(...dp);
        let totalCount = 0;
        for (let i = 0; i < n; i++) {
            if (dp[i] === maxLength) {
                totalCount += count[i];
            }
        }
        
        return {
            length: maxLength,
            count: totalCount
        };
    }
    
    // 5. Find all LIS of maximum length
    findAllLIS(nums) {
        if (nums.length === 0) return [];
        
        const result = this.lisWithReconstruction(nums);
        const maxLength = result.length;
        const allLIS = [];
        
        this.backtrackAllLIS(nums, 0, [], maxLength, allLIS);
        return allLIS;
    }
    
    backtrackAllLIS(nums, start, current, targetLength, result) {
        if (current.length === targetLength) {
            result.push([...current]);
            return;
        }
        
        for (let i = start; i < nums.length; i++) {
            if (current.length === 0 || nums[i] > current[current.length - 1]) {
                current.push(nums[i]);
                if (this.canFormLIS(nums, i + 1, current, targetLength)) {
                    this.backtrackAllLIS(nums, i + 1, current, targetLength, result);
                }
                current.pop();
            }
        }
    }
    
    canFormLIS(nums, start, current, targetLength) {
        const remaining = targetLength - current.length;
        if (remaining === 0) return true;
        
        let count = 0;
        const lastValue = current.length > 0 ? current[current.length - 1] : -Infinity;
        
        for (let i = start; i < nums.length; i++) {
            if (nums[i] > lastValue) {
                count++;
                if (count >= remaining) return true;
            }
        }
        
        return false;
    }
    
    // 6. Longest Decreasing Subsequence
    longestDecreasingSubsequence(nums) {
        // Reverse the array and find LIS, then reverse result
        const reversed = [...nums].reverse();
        const result = this.lisWithReconstruction(reversed);
        
        return {
            length: result.length,
            subsequence: result.subsequence.reverse()
        };
    }
    
    // 7. Russian Doll Envelopes (2D LIS problem)
    maxEnvelopes(envelopes) {
        // Sort by width ascending, height descending
        envelopes.sort((a, b) => {
            if (a[0] === b[0]) return b[1] - a[1];
            return a[0] - b[0];
        });
        
        // Find LIS on heights
        const heights = envelopes.map(env => env[1]);
        return this.lisBinarySearch(heights);
    }
    
    // 8. Utility methods
    visualizeLIS(nums) {
        console.log(\`\\n=== LIS Analysis ===\`);
        console.log(\`Array: [\${nums.join(', ')}]\`);
        
        this.resetComputationCount();
        const dpResult = this.lisDP(nums);
        const dpComputations = this.getComputationCount();
        
        this.resetComputationCount();
        const bsResult = this.lisBinarySearch(nums);
        const bsComputations = this.getComputationCount();
        
        const reconstruction = this.lisWithReconstruction(nums);
        const countResult = this.countLIS(nums);
        
        console.log(\`\\nResults:\`);
        console.log(\`LIS Length: \${dpResult}\`);
        console.log(\`LIS Subsequence: [\${reconstruction.subsequence.join(', ')}]\`);
        console.log(\`Number of LIS: \${countResult.count}\`);
        console.log(\`\\nPerformance:\`);
        console.log(\`DP O(n²): \${dpComputations} comparisons\`);
        console.log(\`Binary Search O(n log n): \${bsComputations} operations\`);
        
        if (this.dpArray) {
            console.log(\`\\nDP Array: [\${this.dpArray.join(', ')}]\`);
        }
        
        return {
            length: dpResult,
            subsequence: reconstruction.subsequence,
            count: countResult.count,
            dpComputations: dpComputations,
            bsComputations: bsComputations
        };
    }
    
    resetComputationCount() {
        this.computationCount = 0;
    }
    
    getComputationCount() {
        return this.computationCount;
    }
}

// Usage Examples and Applications
console.log('=== Longest Increasing Subsequence Examples ===');

const lis = new LongestIncreasingSubsequence();

// Example 1: Basic LIS
console.log('\\n1. Basic LIS Problem:');
const nums1 = [10, 9, 2, 5, 3, 7, 101, 18];
lis.visualizeLIS(nums1);

// Example 2: Stock price analysis
console.log('\\n2. Stock Price Analysis:');
const stockPrices = [100, 80, 60, 70, 60, 75, 85];
console.log(\`Stock Prices: [\${stockPrices.join(', ')}]\`);
const stockResult = lis.lisWithReconstruction(stockPrices);
console.log(\`Longest Rising Period: [\${stockResult.subsequence.join(', ')}]\`);
console.log(\`Duration: \${stockResult.length} days\`);

// Example 3: Performance comparison
console.log('\\n3. Performance Comparison:');
const largeArray = Array.from({length: 1000}, () => Math.floor(Math.random() * 1000));

lis.resetComputationCount();
const start1 = performance.now();
const dpResult = lis.lisDP(largeArray);
const end1 = performance.now();
const dpOps = lis.getComputationCount();

lis.resetComputationCount();
const start2 = performance.now();
const bsResult = lis.lisBinarySearch(largeArray);
const end2 = performance.now();
const bsOps = lis.getComputationCount();

console.log(\`Array size: \${largeArray.length}\`);
console.log(\`DP O(n²): LIS=\${dpResult}, Time=\${(end1-start1).toFixed(2)}ms, Ops=\${dpOps}\`);
console.log(\`Binary Search O(n log n): LIS=\${bsResult}, Time=\${(end2-start2).toFixed(2)}ms, Ops=\${bsOps}\`);
console.log(\`Speedup: \${(dpOps/bsOps).toFixed(2)}x fewer operations\`);

// Example 4: Count all LIS
console.log('\\n4. Counting All LIS:');
const nums4 = [1, 3, 6, 7, 9, 4, 10, 5, 6];
const countResult = lis.countLIS(nums4);
console.log(\`Array: [\${nums4.join(', ')}]\`);
console.log(\`LIS Length: \${countResult.length}\`);
console.log(\`Number of different LIS: \${countResult.count}\`);

// Example 5: Russian Doll Envelopes
console.log('\\n5. Russian Doll Envelopes (2D LIS):');
const envelopes = [[5,4],[6,4],[6,7],[2,3]];
const maxEnv = lis.maxEnvelopes(envelopes);
console.log('Envelopes (width, height):', envelopes);
console.log(\`Maximum nested envelopes: \${maxEnv}\`);

// Example 6: Longest Decreasing Subsequence
console.log('\\n6. Longest Decreasing Subsequence:');
const nums6 = [9, 8, 7, 6, 5, 1, 2, 3];
const ldsResult = lis.longestDecreasingSubsequence(nums6);
console.log(\`Array: [\${nums6.join(', ')}]\`);
console.log(\`LDS: [\${ldsResult.subsequence.join(', ')}]\`);
console.log(\`Length: \${ldsResult.length}\`);`,
    quizQuestions: [
      {
        question: "What is the time complexity of the optimal LIS algorithm using binary search?",
        options: ["O(n)", "O(n²)", "O(n log n)", "O(2ⁿ)"],
        correctAnswer: 2,
        explanation: "The binary search approach achieves O(n log n) time complexity by maintaining a tails array and using binary search to find insertion positions."
      },
      {
        question: "In the DP approach for LIS, what does dp[i] represent?",
        options: ["Length of LIS in the entire array", "Length of LIS ending at position i", "Length of LIS starting at position i", "Number of increasing subsequences"],
        correctAnswer: 1,
        explanation: "dp[i] represents the length of the longest increasing subsequence that ends at position i, which is key to building the optimal solution."
      },
      {
        question: "What is the key difference between LIS and LCS?",
        options: ["LIS works with one sequence, LCS with two", "LIS allows equal elements, LCS doesn't", "LIS is always longer than LCS", "They are the same problem"],
        correctAnswer: 0,
        explanation: "LIS (Longest Increasing Subsequence) works with a single sequence to find increasing order, while LCS (Longest Common Subsequence) works with two sequences to find common elements."
      },
      {
        question: "In the binary search LIS approach, what does the tails array store?",
        options: ["All possible subsequences", "The actual LIS elements", "Smallest tail element for each LIS length", "Indices of LIS elements"],
        correctAnswer: 2,
        explanation: "The tails array stores tails[i] = smallest tail element of all increasing subsequences of length i+1, enabling efficient binary search."
      },
      {
        question: "What is a real-world application of LIS?",
        options: ["Hash table implementation", "Stock price trend analysis", "Binary tree balancing", "String compression"],
        correctAnswer: 1,
        explanation: "LIS is commonly used in stock price analysis to find the longest period of consistently rising prices, helping identify bullish trends."
      }
    ]
  },

  // Greedy Algorithms
  {
    id: 'activity-selection',
    title: 'Activity Selection',
    description: 'Selecting maximum number of non-overlapping activities',
    category: 'Greedy Algorithms',
    difficulty: 'intermediate',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)',
    extendedDefinition: `The Activity Selection Problem is a classic greedy algorithm problem where you need to select the maximum number of activities that don't overlap in time. Given a set of activities with start and finish times, the goal is to select the maximum number of activities that can be performed by a single person.

What it does: selects maximum number of non-overlapping activities from a given set by choosing activities that finish earliest.

How it works: sorts activities by finish time, then greedily selects activities that start after the previous selected activity ends.

When to use: scheduling problems, resource allocation, interval optimization where you want maximum non-overlapping selections.`,
    example: `// Activity Selection Problem Implementation
function activitySelection(activities) {
    // Sort activities by finish time
    const sorted = activities.map((activity, index) => ({
        ...activity,
        originalIndex: index
    })).sort((a, b) => a.finish - b.finish);
    
    const selected = [];
    let lastFinishTime = 0;
    
    for (const activity of sorted) {
        // Select activity if it starts after the last selected activity finishes
        if (activity.start >= lastFinishTime) {
            selected.push(activity);
            lastFinishTime = activity.finish;
        }
    }
    
    return selected;
}

// Enhanced implementation with detailed tracking
class ActivitySelector {
    constructor() {
        this.activities = [];
        this.selected = [];
        this.rejected = [];
    }
    
    addActivity(name, start, finish) {
        this.activities.push({ name, start, finish });
    }
    
    selectActivities() {
        // Reset previous selections
        this.selected = [];
        this.rejected = [];
        
        // Sort by finish time
        const sorted = [...this.activities].sort((a, b) => a.finish - b.finish);
        
        let lastFinishTime = 0;
        
        for (const activity of sorted) {
            if (activity.start >= lastFinishTime) {
                this.selected.push(activity);
                lastFinishTime = activity.finish;
            } else {
                this.rejected.push({
                    ...activity,
                    reason: \`Overlaps with activity ending at \${lastFinishTime}\`
                });
            }
        }
        
        return {
            selected: this.selected,
            rejected: this.rejected,
            maxActivities: this.selected.length
        };
    }
    
    getSchedule() {
        return this.selected.map(activity => 
            \`\${activity.name}: \${activity.start}-\${activity.finish}\`
        ).join(', ');
    }
}

// Example usage
const activities = [
    { name: 'Meeting A', start: 1, finish: 4 },
    { name: 'Meeting B', start: 3, finish: 5 },
    { name: 'Meeting C', start: 0, finish: 6 },
    { name: 'Meeting D', start: 5, finish: 7 },
    { name: 'Meeting E', start: 8, finish: 9 },
    { name: 'Meeting F', start: 5, finish: 9 }
];

const selector = new ActivitySelector();
activities.forEach(act => selector.addActivity(act.name, act.start, act.finish));

const result = selector.selectActivities();
console.log('Selected activities:', result.selected.length);
console.log('Schedule:', selector.getSchedule());
// Output: Meeting A: 1-4, Meeting D: 5-7, Meeting E: 8-9`,
    syntax: `// Activity Selection Pattern
function activitySelection(activities) {
    // Sort by finish time
    activities.sort((a, b) => a.finish - b.finish);
    
    const selected = [];
    let lastFinish = 0;
    
    for (const activity of activities) {
        if (activity.start >= lastFinish) {
            selected.push(activity);
            lastFinish = activity.finish;
        }
    }
    return selected;
}`,
  },
  {
    id: 'huffman-coding',
    title: 'Huffman Coding',
    description: 'Optimal prefix-free encoding for data compression',
    category: 'Greedy Algorithms',
    difficulty: 'advanced',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    extendedDefinition: `Huffman Coding is a lossless data compression algorithm that uses variable-length prefix codes based on character frequencies. It's a greedy algorithm that builds an optimal prefix-free binary tree where frequently occurring characters get shorter codes and less frequent characters get longer codes.

What it does: creates optimal variable-length prefix codes for characters based on frequency, achieving maximum compression for given character distribution.

How it works: builds binary tree bottom-up by repeatedly merging two lowest-frequency nodes, assigns codes based on tree paths.

When to use: lossless data compression needed, text compression, file compression algorithms, when character frequencies vary significantly.`,
    example: `// Huffman Coding Implementation
class HuffmanNode {
    constructor(char, freq, left = null, right = null) {
        this.char = char;
        this.freq = freq;
        this.left = left;
        this.right = right;
    }
    
    isLeaf() {
        return this.left === null && this.right === null;
    }
}

class MinHeap {
    constructor() {
        this.heap = [];
    }
    
    push(node) {
        this.heap.push(node);
        this.heapifyUp(this.heap.length - 1);
    }
    
    pop() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();
        
        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.heapifyDown(0);
        return min;
    }
    
    heapifyUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.heap[parentIndex].freq <= this.heap[index].freq) break;
            [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
            index = parentIndex;
        }
    }
    
    heapifyDown(index) {
        while (true) {
            let minIndex = index;
            const leftChild = 2 * index + 1;
            const rightChild = 2 * index + 2;
            
            if (leftChild < this.heap.length && this.heap[leftChild].freq < this.heap[minIndex].freq) {
                minIndex = leftChild;
            }
            if (rightChild < this.heap.length && this.heap[rightChild].freq < this.heap[minIndex].freq) {
                minIndex = rightChild;
            }
            
            if (minIndex === index) break;
            [this.heap[index], this.heap[minIndex]] = [this.heap[minIndex], this.heap[index]];
            index = minIndex;
        }
    }
    
    size() {
        return this.heap.length;
    }
}

class HuffmanCoding {
    constructor() {
        this.root = null;
        this.codes = {};
        this.reverseCodeMap = {};
    }
    
    buildFrequencyTable(text) {
        const freq = {};
        for (const char of text) {
            freq[char] = (freq[char] || 0) + 1;
        }
        return freq;
    }
    
    buildHuffmanTree(frequencies) {
        const heap = new MinHeap();
        
        // Create leaf nodes for each character
        for (const [char, freq] of Object.entries(frequencies)) {
            heap.push(new HuffmanNode(char, freq));
        }
        
        // Build the tree
        while (heap.size() > 1) {
            const left = heap.pop();
            const right = heap.pop();
            
            const merged = new HuffmanNode(
                null, // Internal nodes don't have characters
                left.freq + right.freq,
                left,
                right
            );
            
            heap.push(merged);
        }
        
        this.root = heap.pop();
        return this.root;
    }
    
    generateCodes(node = this.root, code = '') {
        if (!node) return;
        
        if (node.isLeaf()) {
            this.codes[node.char] = code || '0'; // Handle single character case
            this.reverseCodeMap[code || '0'] = node.char;
            return;
        }
        
        this.generateCodes(node.left, code + '0');
        this.generateCodes(node.right, code + '1');
    }
    
    encode(text) {
        const frequencies = this.buildFrequencyTable(text);
        this.buildHuffmanTree(frequencies);
        this.generateCodes();
        
        let encoded = '';
        for (const char of text) {
            encoded += this.codes[char];
        }
        
        return {
            encoded,
            tree: this.root,
            codes: this.codes,
            originalLength: text.length * 8, // Assuming 8 bits per character
            compressedLength: encoded.length,
            compressionRatio: ((text.length * 8 - encoded.length) / (text.length * 8) * 100).toFixed(2)
        };
    }
    
    decode(encodedText, root = this.root) {
        let decoded = '';
        let current = root;
        
        for (const bit of encodedText) {
            current = bit === '0' ? current.left : current.right;
            
            if (current.isLeaf()) {
                decoded += current.char;
                current = root;
            }
        }
        
        return decoded;
    }
}

// Example usage
const huffman = new HuffmanCoding();
const text = "hello world! this is huffman coding example";

const result = huffman.encode(text);
console.log('Original text:', text);
console.log('Encoded:', result.encoded);
console.log('Codes:', result.codes);
console.log('Compression ratio:', result.compressionRatio + '%');

const decoded = huffman.decode(result.encoded);
console.log('Decoded:', decoded);
console.log('Match original:', text === decoded);`
  },
  {
    id: 'fractional-knapsack',
    title: 'Fractional Knapsack',
    description: 'Greedy approach to knapsack with fractional items',
    category: 'Greedy Algorithms',
    difficulty: 'intermediate',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)',
    extendedDefinition: `The Fractional Knapsack Problem is a greedy algorithm problem where items can be broken into smaller pieces, unlike the 0/1 knapsack problem. Given a knapsack with weight capacity W and items with weights and values, the goal is to maximize the total value by taking fractions of items if necessary.

What it does: maximizes knapsack value by allowing fractional items, using greedy approach based on value-to-weight ratio.

How it works: sorts items by value-to-weight ratio descending, greedily takes highest ratio items first, takes fraction of last item if needed.

When to use: items can be divided, continuous optimization problems, resource allocation with divisible resources, approximation for 0/1 knapsack upper bound.`,
    example: `// Fractional Knapsack Implementation
class Item {
    constructor(value, weight, name = '') {
        this.value = value;
        this.weight = weight;
        this.name = name;
        this.ratio = value / weight;
    }
    
    toString() {
        return \`\${this.name || 'Item'} (v:\${this.value}, w:\${this.weight}, r:\${this.ratio.toFixed(2)})\`;
    }
}

function fractionalKnapsack(capacity, items) {
    // Sort items by value-to-weight ratio in descending order
    const sortedItems = [...items].sort((a, b) => b.ratio - a.ratio);
    
    let totalValue = 0;
    let remainingCapacity = capacity;
    const selectedItems = [];
    
    for (const item of sortedItems) {
        if (remainingCapacity === 0) break;
        
        if (item.weight <= remainingCapacity) {
            // Take the whole item
            selectedItems.push({
                item: item,
                fraction: 1,
                value: item.value,
                weight: item.weight
            });
            totalValue += item.value;
            remainingCapacity -= item.weight;
        } else {
            // Take fraction of the item
            const fraction = remainingCapacity / item.weight;
            const fractionalValue = item.value * fraction;
            
            selectedItems.push({
                item: item,
                fraction: fraction,
                value: fractionalValue,
                weight: remainingCapacity
            });
            totalValue += fractionalValue;
            remainingCapacity = 0;
        }
    }
    
    return {
        maxValue: totalValue,
        selectedItems: selectedItems,
        utilizedCapacity: capacity - remainingCapacity
    };
}

// Enhanced implementation with detailed tracking
class FractionalKnapsackSolver {
    constructor(capacity) {
        this.capacity = capacity;
        this.items = [];
    }
    
    addItem(value, weight, name = '') {
        this.items.push(new Item(value, weight, name));
    }
    
    solve() {
        if (this.items.length === 0) {
            return { maxValue: 0, selectedItems: [], utilizedCapacity: 0 };
        }
        
        // Sort by value-to-weight ratio
        const sortedItems = [...this.items].sort((a, b) => b.ratio - a.ratio);
        
        let totalValue = 0;
        let remainingCapacity = this.capacity;
        const solution = [];
        
        console.log('Items sorted by value-to-weight ratio:');
        sortedItems.forEach((item, index) => {
            console.log(\`\${index + 1}. \${item.toString()}\`);
        });
        
        for (let i = 0; i < sortedItems.length && remainingCapacity > 0; i++) {
            const item = sortedItems[i];
            
            if (item.weight <= remainingCapacity) {
                // Take whole item
                solution.push({
                    item: item,
                    fraction: 1,
                    value: item.value,
                    weight: item.weight,
                    description: \`Take entire \${item.name || 'item'}\`
                });
                totalValue += item.value;
                remainingCapacity -= item.weight;
            } else {
                // Take fraction
                const fraction = remainingCapacity / item.weight;
                const fractionalValue = item.value * fraction;
                
                solution.push({
                    item: item,
                    fraction: fraction,
                    value: fractionalValue,
                    weight: remainingCapacity,
                    description: \`Take \${(fraction * 100).toFixed(1)}% of \${item.name || 'item'}\`
                });
                totalValue += fractionalValue;
                remainingCapacity = 0;
            }
        }
        
        return {
            maxValue: parseFloat(totalValue.toFixed(2)),
            selectedItems: solution,
            utilizedCapacity: this.capacity - remainingCapacity,
            efficiency: ((this.capacity - remainingCapacity) / this.capacity * 100).toFixed(1)
        };
    }
    
    printSolution() {
        const result = this.solve();
        
        console.log(\`\\nFractional Knapsack Solution:\`);
        console.log(\`Capacity: \${this.capacity}\`);
        console.log(\`Maximum Value: \${result.maxValue}\`);
        console.log(\`Capacity Utilization: \${result.efficiency}%\\n\`);
        
        console.log('Selected Items:');
        result.selectedItems.forEach((selection, index) => {
            console.log(\`\${index + 1}. \${selection.description} - Value: \${selection.value.toFixed(2)}, Weight: \${selection.weight}\`);
        });
        
        return result;
    }
}

// Example usage
const solver = new FractionalKnapsackSolver(50);

solver.addItem(60, 10, 'Gold');
solver.addItem(100, 20, 'Silver');
solver.addItem(120, 30, 'Bronze');

const result = solver.printSolution();

// Simple function example
const items = [
    new Item(60, 10, 'Item1'),
    new Item(100, 20, 'Item2'),
    new Item(120, 30, 'Item3')
];

const solution = fractionalKnapsack(50, items);
console.log('\\nSimple solution:', solution.maxValue); // Output: 240`
  },

  // Backtracking
  {
    id: 'backtracking-intro',
    title: 'Backtracking Fundamentals',
    description: 'Master the backtracking algorithmic paradigm for constraint satisfaction problems',
    category: 'Backtracking',
    difficulty: 'intermediate',
    timeComplexity: 'O(b^d)',
    spaceComplexity: 'O(d)',
    extendedDefinition: `Backtracking is a systematic method for solving constraint satisfaction problems by incrementally building solutions and abandoning candidates ("backtracking") when they cannot lead to a valid solution.

What it does: systematically explores all possible solutions by building them incrementally and abandoning invalid paths.

How it works: makes choices, checks constraints, recurses deeper, and backtracks when hitting dead ends.

When to use: constraint satisfaction problems, puzzle solving, combinatorial optimization, generating permutations/combinations.`,
    voiceExplanation: `Think of backtracking like exploring a maze with a magical ability to teleport back when you hit a dead end! Imagine you're in a huge maze and you want to find the treasure. You walk forward, making choices at each intersection. If you reach a dead end, instead of being stuck, you magically teleport back to the last intersection and try a different path. That's exactly how backtracking works! It's like having a time machine for your decisions. You make a choice, explore that path completely, and if it doesn't work out, you undo that choice and try something else. This is incredibly powerful for solving puzzles like Sudoku - you fill in a number, see if it leads to a solution, and if not, you erase it and try the next number. It's systematic, thorough, and guarantees you'll find a solution if one exists. The beauty is that you never get permanently stuck - you can always backtrack and try a different approach!`,
    realWorldApplications: `**Industry Applications:**
- **Game Development**: AI for chess, checkers, puzzle games, pathfinding in complex scenarios
- **Constraint Programming**: Scheduling problems, resource allocation, timetabling systems
- **Circuit Design**: VLSI layout, routing problems, logic circuit optimization
- **Bioinformatics**: Protein folding prediction, DNA sequence alignment, phylogenetic trees
- **Operations Research**: Vehicle routing, job scheduling, facility location problems
- **Artificial Intelligence**: Expert systems, automated theorem proving, planning algorithms
- **Software Testing**: Test case generation, configuration space exploration
- **Cryptography**: Key generation, cryptanalysis, security protocol verification
- **Network Design**: Topology optimization, routing protocol design, bandwidth allocation
- **Manufacturing**: Production scheduling, quality control, supply chain optimization`,
    keyConcepts: `**Essential Concepts:**
1. **Decision Tree**: Systematic exploration of all possible solution paths
2. **Constraint Checking**: Validating partial solutions before proceeding
3. **Pruning**: Eliminating branches that cannot lead to valid solutions
4. **State Space**: Complete set of all possible problem states
5. **Backtrack Point**: Position to return to when current path fails
6. **Solution Space**: Subset of state space containing valid solutions
7. **Branch and Bound**: Optimization technique combined with backtracking
8. **Recursive Structure**: Natural fit for recursive implementation patterns`,
    pseudocode: `**Backtracking Algorithm Pseudocode:**

ALGORITHM Backtrack(solution, level)
INPUT: solution - partial solution being built, level - current decision level
OUTPUT: boolean - true if solution found, false otherwise
BEGIN
    IF IsSolutionComplete(solution) THEN
        ProcessSolution(solution)
        RETURN true
    END IF
    
    FOR each candidate IN GetCandidates(solution, level) DO
        IF IsValidChoice(solution, candidate) THEN
            // Make choice
            solution[level] = candidate
            UpdateConstraints(solution, candidate, level)
            
            // Recurse to next level
            IF Backtrack(solution, level + 1) THEN
                RETURN true  // Solution found
            END IF
            
            // Backtrack: undo choice
            RestoreConstraints(solution, candidate, level)
            solution[level] = UNDEFINED
        END IF
    END FOR
    
    RETURN false  // No solution found at this level
END

ALGORITHM GenerateAllSolutions(solution, level, results)
INPUT: solution - partial solution, level - current level, results - collection
OUTPUT: all valid solutions added to results
BEGIN
    IF IsSolutionComplete(solution) THEN
        results.add(CopySolution(solution))
        RETURN
    END IF
    
    FOR each candidate IN GetCandidates(solution, level) DO
        IF IsValidChoice(solution, candidate) THEN
            solution[level] = candidate
            GenerateAllSolutions(solution, level + 1, results)
            solution[level] = UNDEFINED  // Backtrack
        END IF
    END FOR
END`,
    implementationCode: `// Comprehensive Backtracking Implementation

class BacktrackingSolver {
    constructor() {
        this.solutionCount = 0;
        this.exploredNodes = 0;
    }
    
    // Generic backtracking template
    solve(problem, findAll = false) {
        const solutions = [];
        const solution = new Array(problem.size);
        
        this.backtrack(problem, solution, 0, solutions, findAll);
        return findAll ? solutions : solutions[0] || null;
    }
    
    backtrack(problem, solution, level, solutions, findAll) {
        this.exploredNodes++;
        
        // Base case: solution complete
        if (level === problem.size) {
            if (problem.isValidSolution(solution)) {
                solutions.push([...solution]);
                this.solutionCount++;
                return !findAll; // Stop if only need one solution
            }
            return false;
        }
        
        // Try each possible choice at current level
        for (const candidate of problem.getCandidates(solution, level)) {
            if (problem.isValidChoice(solution, level, candidate)) {
                // Make choice
                solution[level] = candidate;
                
                // Recurse to next level
                if (this.backtrack(problem, solution, level + 1, solutions, findAll)) {
                    return true; // Solution found and we only need one
                }
                
                // Backtrack: undo choice
                solution[level] = undefined;
            }
        }
        
        return false;
    }
    
    // N-Queens problem implementation
    solveNQueens(n) {
        const problem = {
            size: n,
            getCandidates: (solution, level) => Array.from({length: n}, (_, i) => i),
            isValidChoice: (solution, row, col) => {
                // Check column conflicts
                for (let i = 0; i < row; i++) {
                    if (solution[i] === col) return false;
                }
                
                // Check diagonal conflicts
                for (let i = 0; i < row; i++) {
                    if (Math.abs(solution[i] - col) === Math.abs(i - row)) {
                        return false;
                    }
                }
                
                return true;
            },
            isValidSolution: (solution) => solution.every(col => col !== undefined)
        };
        
        return this.solve(problem, true);
    }
    
    // Sudoku solver implementation
    solveSudoku(board) {
        const emptyCells = [];
        
        // Find all empty cells
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    emptyCells.push([row, col]);
                }
            }
        }
        
        const problem = {
            size: emptyCells.length,
            getCandidates: () => [1, 2, 3, 4, 5, 6, 7, 8, 9],
            isValidChoice: (solution, level, num) => {
                const [row, col] = emptyCells[level];
                
                // Check row
                for (let c = 0; c < 9; c++) {
                    if (board[row][c] === num) return false;
                }
                
                // Check column
                for (let r = 0; r < 9; r++) {
                    if (board[r][col] === num) return false;
                }
                
                // Check 3x3 box
                const boxRow = Math.floor(row / 3) * 3;
                const boxCol = Math.floor(col / 3) * 3;
                for (let r = boxRow; r < boxRow + 3; r++) {
                    for (let c = boxCol; c < boxCol + 3; c++) {
                        if (board[r][c] === num) return false;
                    }
                }
                
                // Temporarily place number for further validation
                board[row][col] = num;
                return true;
            },
            isValidSolution: (solution) => true
        };
        
        // Override backtrack to handle board updates
        const originalBacktrack = this.backtrack;
        this.backtrack = (problem, solution, level, solutions, findAll) => {
            if (level === problem.size) {
                solutions.push(board.map(row => [...row]));
                return true;
            }
            
            const [row, col] = emptyCells[level];
            for (const num of problem.getCandidates()) {
                const originalValue = board[row][col];
                if (problem.isValidChoice(solution, level, num)) {
                    solution[level] = num;
                    
                    if (this.backtrack(problem, solution, level + 1, solutions, findAll)) {
                        return true;
                    }
                    
                    solution[level] = undefined;
                }
                board[row][col] = originalValue; // Restore
            }
            
            return false;
        };
        
        const result = this.solve(problem);
        this.backtrack = originalBacktrack; // Restore original method
        return result;
    }
    
    // Generate all permutations
    generatePermutations(arr) {
        const results = [];
        const used = new Array(arr.length).fill(false);
        const current = [];
        
        const backtrack = () => {
            if (current.length === arr.length) {
                results.push([...current]);
                return;
            }
            
            for (let i = 0; i < arr.length; i++) {
                if (!used[i]) {
                    used[i] = true;
                    current.push(arr[i]);
                    
                    backtrack();
                    
                    current.pop();
                    used[i] = false;
                }
            }
        };
        
        backtrack();
        return results;
    }
    
    // Get statistics
    getStatistics() {
        return {
            solutionsFound: this.solutionCount,
            nodesExplored: this.exploredNodes
        };
    }
    
    // Reset statistics
    reset() {
        this.solutionCount = 0;
        this.exploredNodes = 0;
    }
}

// Usage Examples
const solver = new BacktrackingSolver();

// Solve 4-Queens problem
console.log('4-Queens Solutions:');
const queensSolutions = solver.solveNQueens(4);
queensSolutions.forEach((solution, index) => {
    console.log(\`Solution \${index + 1}: [\${solution.join(', ')}]\`);
});

// Generate permutations
console.log('\\nPermutations of [1, 2, 3]:');
const perms = solver.generatePermutations([1, 2, 3]);
console.log(perms);

console.log('\\nStatistics:', solver.getStatistics());`,
    example: `// Generic Backtracking Template
function backtrack(solution, candidates) {
    // Base case: solution is complete
    if (isComplete(solution)) {
        return solution; // or add to results
    }
    
    // Try each candidate
    for (let candidate of candidates) {
        // Check if candidate is valid
        if (isValid(solution, candidate)) {
            // Make choice
            solution.push(candidate);
            
            // Recurse with updated solution
            const result = backtrack(solution, getNextCandidates(solution));
            
            // If solution found, return it
            if (result !== null) {
                return result;
            }
            
            // Backtrack: undo choice
            solution.pop();
        }
    }
    
    return null; // No solution found
}

// Example: Generate all subsets
function generateSubsets(nums) {
    const result = [];
    const current = [];
    
    function backtrack(start) {
        // Add current subset to result
        result.push([...current]);
        
        // Try adding each remaining number
        for (let i = start; i < nums.length; i++) {
            current.push(nums[i]);     // Choose
            backtrack(i + 1);          // Recurse
            current.pop();             // Backtrack
        }
    }
    
    backtrack(0);
    return result;
}`,
    syntax: `**Backtracking Patterns:**

1. **Decision Tree Traversal:**
   \`\`\`javascript
   function backtrack(path, choices) {
       if (isComplete(path)) {
           results.push([...path]);
           return;
       }
       
       for (let choice of choices) {
           if (isValid(path, choice)) {
               path.push(choice);        // Choose
               backtrack(path, newChoices); // Explore
               path.pop();               // Backtrack
           }
       }
   }
   \`\`\`

2. **Constraint Satisfaction:**
   \`\`\`javascript
   function solve(board, position) {
       if (position === totalPositions) {
           return true; // Solution found
       }
       
       for (let value of possibleValues) {
           if (isValidPlacement(board, position, value)) {
               board[position] = value;
               if (solve(board, position + 1)) {
                   return true;
               }
               board[position] = EMPTY; // Backtrack
           }
       }
       
       return false; // No solution
   }
   \`\`\``,
    quizQuestions: [
      {
        question: "What is the key principle behind backtracking algorithms?",
        options: ["Always find the optimal solution", "Systematically explore all possibilities and backtrack from dead ends", "Use dynamic programming for optimization", "Employ greedy choices at each step"],
        correctAnswer: 1,
        explanation: "Backtracking systematically explores all possible solution paths, making choices and backtracking (undoing choices) when a path cannot lead to a valid solution."
      },
      {
        question: "When should you backtrack in a backtracking algorithm?",
        options: ["When you find a solution", "When the current partial solution violates constraints", "After exploring all possibilities", "When the recursion depth is too high"],
        correctAnswer: 1,
        explanation: "You should backtrack when the current partial solution violates constraints or cannot possibly lead to a valid solution, allowing you to try alternative choices."
      },
      {
        question: "What is the time complexity of backtracking algorithms in the worst case?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(b^d) where b is branching factor and d is depth"],
        correctAnswer: 3,
        explanation: "Backtracking algorithms have exponential time complexity O(b^d) in the worst case, where b is the branching factor (choices at each level) and d is the maximum depth."
      },
      {
        question: "Which data structure is implicitly used in recursive backtracking?",
        options: ["Queue", "Stack", "Heap", "Hash table"],
        correctAnswer: 1,
        explanation: "Recursive backtracking implicitly uses the call stack to keep track of the current state and enable backtracking to previous decision points."
      },
      {
        question: "What is pruning in the context of backtracking?",
        options: ["Removing duplicate solutions", "Eliminating branches that cannot lead to valid solutions", "Optimizing memory usage", "Sorting the solution space"],
        correctAnswer: 1,
        explanation: "Pruning is the technique of eliminating branches early when it's determined they cannot possibly lead to a valid solution, significantly improving efficiency."
      }
    ]
  },
  {
    id: 'n-queens',
    title: 'N-Queens Problem',
    description: 'Place N queens on NxN chessboard so no two queens attack each other',
    category: 'Backtracking',
    difficulty: 'advanced',
    timeComplexity: 'O(N!)',
    spaceComplexity: 'O(NÃ‚Â²)',
    extendedDefinition: `The N-Queens problem is a classic backtracking problem that demonstrates constraint satisfaction. The goal is to place N queens on an N×N chessboard such that no two queens can attack each other.

What it does: places N queens on an N×N chessboard ensuring no queen attacks another.

How it works: uses backtracking to try queen placements row by row, checking column and diagonal conflicts.

When to use: constraint satisfaction problems, backtracking algorithm practice, combinatorial optimization.`,
    example: `function solveNQueens(n) {
    const result = [], board = Array(n).fill().map(() => Array(n).fill('.'));
    const cols = new Set(), diag1 = new Set(), diag2 = new Set();
    
    function backtrack(row) {
        if (row === n) {
            result.push(board.map(row => row.join('')));
            return;
        }
        
        for (let col = 0; col < n; col++) {
            if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) continue;
            
            board[row][col] = 'Q';
            cols.add(col); diag1.add(row - col); diag2.add(row + col);
            backtrack(row + 1);
            board[row][col] = '.';
            cols.delete(col); diag1.delete(row - col); diag2.delete(row + col);
        }
    }
    
    backtrack(0);
    return result;
}`
  },
  {
    id: 'sudoku-solver',
    title: 'Sudoku Solver',
    description: 'Solve 9x9 Sudoku puzzle using constraint-based backtracking',
    category: 'Backtracking',
    difficulty: 'advanced',
    timeComplexity: 'O(9^(nÃ‚Â²))',
    spaceComplexity: 'O(nÃ‚Â²)',
    extendedDefinition: `Sudoku solving demonstrates advanced backtracking with multiple constraint types. Each cell must satisfy three constraints simultaneously: row, column, and 3×3 box uniqueness.

What it does: solves 9×9 Sudoku puzzles by filling empty cells with digits 1-9.

How it works: uses backtracking to try digits 1-9 in each empty cell, checking row, column, and box constraints.

When to use: constraint satisfaction problems, puzzle solving, advanced backtracking practice.`,
    example: `function solveSudoku(board) {
    function isValid(row, col, num) {
        for (let i = 0; i < 9; i++) {
            if (board[row][i] === num || board[i][col] === num) return false;
        }
        const boxRow = Math.floor(row / 3) * 3, boxCol = Math.floor(col / 3) * 3;
        for (let i = boxRow; i < boxRow + 3; i++) {
            for (let j = boxCol; j < boxCol + 3; j++) {
                if (board[i][j] === num) return false;
            }
        }
        return true;
    }
    
    function solve() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] === '.') {
                    for (let num = '1'; num <= '9'; num++) {
                        if (isValid(i, j, num)) {
                            board[i][j] = num;
                            if (solve()) return true;
                            board[i][j] = '.';
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }
    
    solve();
}`
  },
  {
    id: 'maze-solver',
    title: 'Maze Path Finding',
    description: 'Find path through maze using backtracking with path visualization',
    category: 'Backtracking',
    difficulty: 'intermediate',
    timeComplexity: 'O(4^(nÃƒâ€”m))',
    spaceComplexity: 'O(nÃƒâ€”m)',
    extendedDefinition: `Maze solving showcases backtracking in grid-based problems. The algorithm explores all possible paths from start to destination, backtracking when hitting dead ends.

What it does: finds a path through a maze from start to destination using backtracking.

How it works: explores all 4 directions from each cell, marking visited cells and backtracking when hitting dead ends.

When to use: pathfinding problems, grid-based navigation, exploring all possible routes.`,
    example: `function solveMaze(maze) {
    const rows = maze.length, cols = maze[0].length;
    const visited = Array(rows).fill().map(() => Array(cols).fill(false));
    const path = [], directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
    
    function backtrack(row, col, destRow, destCol) {
        if (row === destRow && col === destCol) {
            path.push([row, col]);
            return true;
        }
        
        visited[row][col] = true;
        path.push([row, col]);
        
        for (const [dr, dc] of directions) {
            const newRow = row + dr, newCol = col + dc;
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols &&
                maze[newRow][newCol] === 0 && !visited[newRow][newCol]) {
                if (backtrack(newRow, newCol, destRow, destCol)) return true;
            }
        }
        
        visited[row][col] = false;
        path.pop();
        return false;
    }
    
    return backtrack(0, 0, rows - 1, cols - 1) ? path : [];
}`
  },
  {
    id: 'generate-parentheses',
    title: 'Generate Valid Parentheses',
    description: 'Generate all combinations of well-formed parentheses using backtracking',
    category: 'Backtracking',
    difficulty: 'intermediate',
    timeComplexity: 'O(4^n / Ã¢Ë†Å¡n)',
    spaceComplexity: 'O(n)',
    extendedDefinition: `Generating valid parentheses demonstrates backtracking with constraint validation. We build strings character by character, ensuring validity at each step.

What it does: generates all combinations of n pairs of well-formed parentheses.

How it works: uses backtracking to build strings character by character, ensuring valid parentheses constraints.

When to use: combinatorial string generation, constraint validation, balanced bracket problems.`,
    example: `function generateParenthesis(n) {
    const result = [];
    
    function backtrack(current, open, close) {
        if (current.length === 2 * n) {
            result.push(current);
            return;
        }
        
        if (open < n) backtrack(current + '(', open + 1, close);
        if (close < open) backtrack(current + ')', open, close + 1);
    }
    
    backtrack('', 0, 0);
    return result;
}

// Example n=3: ["((()))", "(()())", "(())()", "()(())", "()()()"]`
  },
  {
    id: 'word-search',
    title: 'Word Search in Grid',
    description: 'Find if word exists in 2D character grid using backtracking',
    category: 'Backtracking',
    difficulty: 'intermediate',
    timeComplexity: 'O(N Ãƒâ€” 4^L)',
    spaceComplexity: 'O(L)',
    extendedDefinition: `Word search in a grid combines backtracking with 2D traversal. We explore all possible paths from each starting position, backtracking when the current path cannot form the target word.

What it does: finds if a word exists in a 2D character grid using adjacent cells.

How it works: tries starting from each cell, using DFS with backtracking to explore adjacent paths.

When to use: 2D grid search problems, word puzzles, path finding with constraints.`,
    example: `function exist(board, word) {
    const rows = board.length, cols = board[0].length;
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    
    function backtrack(row, col, index) {
        if (index === word.length) return true;
        if (row < 0 || row >= rows || col < 0 || col >= cols ||
            board[row][col] !== word[index] || board[row][col] === '#') return false;
        
        const temp = board[row][col];
        board[row][col] = '#';
        
        for (const [dr, dc] of directions) {
            if (backtrack(row + dr, col + dc, index + 1)) {
                board[row][col] = temp;
                return true;
            }
        }
        
        board[row][col] = temp;
        return false;
    }
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (backtrack(i, j, 0)) return true;
        }
    }
    return false;
}`
  },
  {
    id: 'combination-sum',
    title: 'Combination Sum',
    description: 'Find all unique combinations that sum to target using backtracking',
    category: 'Backtracking',
    difficulty: 'intermediate',
    timeComplexity: 'O(2^n)',
    spaceComplexity: 'O(target/min)',
    extendedDefinition: `Combination Sum problems demonstrate backtracking in combinatorial optimization. We build combinations incrementally, pruning branches that exceed the target sum.

What it does: finds all unique combinations of numbers that sum to a target value.

How it works: uses backtracking to build combinations incrementally, pruning branches when sum exceeds target.

When to use: combinatorial optimization, finding all valid combinations, subset sum problems.`,
    example: `// Combination Sum I (numbers can be reused)
function combinationSum(candidates, target) {
    const result = [];
    candidates.sort((a, b) => a - b); // Sort for optimization
    
    function backtrack(start, current, remaining) {
        // Base case: found valid combination
        if (remaining === 0) {
            result.push([...current]);
            return;
        }
        
        // Try each candidate starting from 'start' index
        for (let i = start; i < candidates.length; i++) {
            const num = candidates[i];
            
            // Pruning: if current number > remaining, skip rest
            if (num > remaining) break;
            
            // Choose current number
            current.push(num);
            
            // Recurse (can reuse same number, so pass 'i' not 'i+1')
            backtrack(i, current, remaining - num);
            
            // Backtrack
            current.pop();
        }
    }
    
    backtrack(0, [], target);
    return result;
}

// Example: candidates = [2,3,6,7], target = 7
// Decision tree:
//                    []
//                 /  |  \\  \\
//               [2] [3] [6] [7]
//              / |   |    Ã¢Å“â€œ
//           [2,2] [2,3] [3,3]
//           / |    Ã¢Å“â€œ     |
//       [2,2,2] [2,2,3] [3,3,3]
//         |       Ã¢Å“â€œ      (>7)
//      [2,2,2,2]
//       (>7)
//
// Valid combinations: [[2,2,3], [7]]`
  },

  // Advanced Data Structures
  {
    id: 'trie',
    title: 'Trie (Prefix Tree)',
    description: 'Tree-like data structure for efficient string operations',
    category: 'Advanced Data Structures',
    difficulty: 'intermediate',
    timeComplexity: 'O(m)',
    spaceComplexity: 'O(ALPHABET_SIZE × n × m)',
    extendedDefinition: `A Trie (pronounced "try") or Prefix Tree is a tree-like data structure that stores a dynamic set of strings, where each node represents a single character and paths from root to leaves represent complete words.

What it does: efficiently stores and retrieves strings with shared prefixes, enabling fast prefix-based operations like autocomplete and spell checking.

How it works: each node contains character mappings to children, paths from root represent prefixes, end-of-word flags mark complete strings.

When to use: autocomplete systems, spell checkers, IP routing tables, dictionary implementations, prefix matching, word games.`,
    example: `// Trie (Prefix Tree) Implementation
class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }
    
    // Insert word - O(m) where m is word length
    insert(word) {
        let current = this.root;
        
        for (const char of word) {
            if (!current.children[char]) {
                current.children[char] = new TrieNode();
            }
            current = current.children[char];
        }
        
        current.isEndOfWord = true;
    }
    
    // Search for word - O(m)
    search(word) {
        let current = this.root;
        
        for (const char of word) {
            if (!current.children[char]) {
                return false;
            }
            current = current.children[char];
        }
        
        return current.isEndOfWord;
    }
    
    // Check if prefix exists - O(m)
    startsWith(prefix) {
        let current = this.root;
        
        for (const char of prefix) {
            if (!current.children[char]) {
                return false;
            }
            current = current.children[char];
        }
        
        return true;
    }
    
    // Get all words with given prefix
    getWordsWithPrefix(prefix) {
        let current = this.root;
        const result = [];
        
        // Navigate to prefix end
        for (const char of prefix) {
            if (!current.children[char]) {
                return result;
            }
            current = current.children[char];
        }
        
        // DFS to find all words
        this._dfs(current, prefix, result);
        return result;
    }
    
    _dfs(node, currentWord, result) {
        if (node.isEndOfWord) {
            result.push(currentWord);
        }
        
        for (const [char, childNode] of Object.entries(node.children)) {
            this._dfs(childNode, currentWord + char, result);
        }
    }
}

// Example usage
const trie = new Trie();
trie.insert("apple");
trie.insert("app");
trie.insert("application");
trie.insert("apply");

console.log(trie.search("app"));        // true
console.log(trie.search("appl"));       // false
console.log(trie.startsWith("app"));    // true
console.log(trie.getWordsWithPrefix("app")); // ["app", "apple", "application", "apply"]`,
    syntax: `**Trie Patterns:**

1. **Basic Trie Node:**
   \`\`\`javascript
   class TrieNode {
       constructor() {
           this.children = {}; // or new Map()
           this.isEndOfWord = false;
       }
   }
   \`\`\`

2. **Insert Operation:**
   \`\`\`javascript
   insert(word) {
       let current = this.root;
       for (const char of word) {
           if (!current.children[char]) {
               current.children[char] = new TrieNode();
           }
           current = current.children[char];
       }
       current.isEndOfWord = true;
   }
   \`\`\`

3. **Search Operation:**
   \`\`\`javascript
   search(word) {
       let current = this.root;
       for (const char of word) {
           if (!current.children[char]) return false;
           current = current.children[char];
       }
       return current.isEndOfWord;
   }
   \`\`\``
  },
  {
    id: 'segment-tree',
    title: 'Segment Tree',
    description: 'Tree structure for range queries and updates',
    category: 'Advanced Data Structures',
    difficulty: 'advanced',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(n)',
    extendedDefinition: `A Segment Tree is a binary tree data structure used for storing information about array segments in a way that allows answering range queries efficiently.

What it does: efficiently handles range queries and updates on arrays, supporting operations like range sum, minimum, maximum in O(log n) time.

How it works: recursively divides array into segments, stores aggregate information at internal nodes, queries traverse tree to combine relevant segments.

When to use: frequent range queries needed, range updates required, competitive programming, when Fenwick tree limitations are restrictive.`
  },
  {
    id: 'fenwick-tree',
    title: 'Fenwick Tree (BIT)',
    description: 'Binary Indexed Tree for prefix sum queries',
    category: 'Advanced Data Structures',
    difficulty: 'advanced',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(n)',
    extendedDefinition: `A Fenwick Tree (Binary Indexed Tree) is a data structure that efficiently calculates prefix sums in O(log n) time and allows updates in O(log n) time.

What it does: efficiently maintains cumulative frequency table supporting prefix sum queries and single element updates in logarithmic time.

How it works: uses binary representation of indices to store partial sums, leverages bit manipulation for tree traversal and updates.

When to use: prefix sum queries needed, cumulative frequency tables, range sum queries, when space efficiency important over segment trees.`
  },
  {
    id: 'union-find',
    title: 'Union-Find (Disjoint Set)',
    description: 'Data structure for tracking disjoint sets',
    category: 'Advanced Data Structures',
    difficulty: 'intermediate',
    timeComplexity: 'O(α(n))',
    spaceComplexity: 'O(n)',
    extendedDefinition: `Union-Find (Disjoint Set Union) is a data structure that keeps track of elements partitioned into disjoint sets and supports union and find operations efficiently.

What it does: maintains collection of disjoint sets with efficient union and find operations, determines connectivity between elements.

How it works: uses parent pointers to represent trees, path compression flattens trees during find, union by rank keeps trees balanced.

When to use: connectivity problems, cycle detection in graphs, Kruskal's MST algorithm, dynamic connectivity queries, percolation problems.`
  },
  {
    id: 'avl-tree',
    title: 'AVL Tree',
    description: 'Strictly height-balanced BST ensuring O(log n) operations through rotations',
    category: 'Advanced Data Structures',
    difficulty: 'advanced',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(n)',
    extendedDefinition: `An AVL Tree is a self-balancing binary search tree where the height difference between left and right subtrees of any node is at most 1.

What it does: maintains strict height balance through rotations, guaranteeing O(log n) worst-case performance for all operations.

How it works: tracks balance factor for each node, performs single or double rotations when balance factor exceeds ±1 after insertions/deletions.

When to use: guaranteed O(log n) performance needed, frequent lookups with occasional updates, real-time systems requiring predictable performance.`
  },
  {
    id: 'red-black-tree',
    title: 'Red-Black Tree',
    description: 'Balanced BST using node colors and rotation rules - used in many standard libraries',
    category: 'Advanced Data Structures',
    difficulty: 'advanced',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(n)',
    extendedDefinition: `A Red-Black Tree is a self-balancing binary search tree where each node has a color (red or black) and follows specific coloring rules to maintain balance.

What it does: maintains approximate balance using color properties and rotations, ensuring O(log n) operations with fewer rotations than AVL trees.

How it works: enforces red-black properties through coloring rules, uses rotations and recoloring during insertions and deletions to maintain balance.

When to use: frequent insertions/deletions, standard library implementations, when balance maintenance cost should be minimized, general-purpose balanced BST.`
  },
  {
    id: 'b-tree',
    title: 'B-Tree',
    description: 'Multi-way search tree optimized for disk storage and database indexing',
    category: 'Advanced Data Structures',
    difficulty: 'advanced',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(n)',
    extendedDefinition: `A B-Tree is a self-balancing multi-way search tree optimized for systems that read and write large blocks of data, commonly used in databases and file systems.

What it does: maintains sorted data in multi-way tree structure optimized for disk I/O, minimizing expensive disk accesses through high branching factor.

How it works: stores multiple keys per node, maintains balance through splitting and merging nodes, keeps all leaves at same level.

When to use: database indexing, file systems, external storage systems, when minimizing disk I/O is critical, large datasets that don't fit in memory.`
  },
  {
    id: 'splay-tree',
    title: 'Splay Tree',
    description: 'Self-optimizing BST that moves frequently accessed nodes to the root',
    category: 'Advanced Data Structures',
    difficulty: 'advanced',
    timeComplexity: 'O(log n) amortized',
    spaceComplexity: 'O(n)',
    extendedDefinition: `A Splay Tree is a self-adjusting binary search tree that moves recently accessed elements to the root through splaying operations.

What it does: optimizes for locality of reference by moving accessed nodes to root, providing excellent performance for non-uniform access patterns.

How it works: performs splay operation after each access, uses rotations to move target node to root, naturally adapts to access patterns.

When to use: temporal locality in access patterns, caching applications, when recently accessed items likely to be accessed again, simple implementation preferred.`
  },

  // Two Pointers
  {
    id: 'two-pointers-intro',
    title: 'Two Pointers Technique',
    description: 'Master the fundamental two pointers pattern for array and string problems',
    category: 'Two Pointers',
    difficulty: 'beginner',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    extendedDefinition: `The Two Pointers technique is a powerful algorithmic pattern that uses two pointers to traverse data structures, typically arrays or strings, from different positions. This technique is particularly effective for problems involving sorted arrays, palindromes, or finding pairs/triplets.

What it does: uses two pointers moving in coordinated patterns to solve problems efficiently without nested loops.

How it works: pointers start at different positions and move based on problem conditions, eliminating redundant comparisons.

When to use: sorted arrays, palindrome checking, finding pairs/triplets, cycle detection, merging operations.`,
    example: `// Two Sum in Sorted Array
function twoSum(nums, target) {
    let left = 0, right = nums.length - 1;
    
    while (left < right) {
        const sum = nums[left] + nums[right];
        
        if (sum === target) {
            return [left, right];
        } else if (sum < target) {
            left++; // Need larger sum
        } else {
            right--; // Need smaller sum
        }
    }
    
    return [-1, -1]; // Not found
}

// Example: nums = [2, 7, 11, 15], target = 9
// Step 1: left=0(2), right=3(15), sum=17 > 9, right--
// Step 2: left=0(2), right=2(11), sum=13 > 9, right--  
// Step 3: left=0(2), right=1(7), sum=9 = 9, found!`,
    syntax: `**Two Pointers Patterns:**

1. **Opposite Direction (Converging):**
   \`\`\`javascript
   let left = 0, right = array.length - 1;
   while (left < right) {
       // Process elements at left and right
       // Move pointers based on condition
   }
   \`\`\`

2. **Same Direction (Chasing):**
   \`\`\`javascript
   let slow = 0, fast = 0;
   while (fast < array.length) {
       // Move fast pointer
       // Move slow pointer conditionally
   }
   \`\`\`

3. **Fast & Slow (Floyd's):**
   \`\`\`javascript
   let slow = head, fast = head;
   while (fast && fast.next) {
       slow = slow.next;
       fast = fast.next.next;
   }
   \`\`\``
  },
  {
    id: 'two-sum',
    title: 'Two Sum Problem',
    description: 'Find two numbers that add up to target using two pointers approach',
    category: 'Two Pointers',
    difficulty: 'beginner',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    extendedDefinition: `The Two Sum problem is a classic example of the two pointers technique. Given a sorted array and a target sum, find two numbers that add up to the target.

What it does: finds two numbers in a sorted array that sum to a specific target value.

How it works: uses two pointers starting from opposite ends, moving them inward based on sum comparison with target.

When to use: sorted arrays, finding pairs with specific sum, avoiding O(n²) brute force approach.`,
    example: `function twoSum(numbers, target) {
    let left = 0, right = numbers.length - 1;
    
    while (left < right) {
        const sum = numbers[left] + numbers[right];
        if (sum === target) return [left + 1, right + 1];
        else if (sum < target) left++;
        else right--;
    }
    return [];
}

// Example: [2, 7, 11, 15], target = 9
// left=0, right=1: sum = 2+7 = 9 Ã¢Å“â€œ`
  },
  {
    id: 'three-sum',
    title: 'Three Sum Problem',
    description: 'Find all unique triplets that sum to zero using two pointers technique',
    category: 'Two Pointers',
    difficulty: 'intermediate',
    timeComplexity: 'O(nÃ‚Â²)',
    spaceComplexity: 'O(1)',
    extendedDefinition: `The Three Sum problem extends the two pointers technique to find triplets. Given an array, find all unique triplets that sum to zero (or a target).

What it does: finds all unique triplets in an array that sum to zero using two pointers technique.

How it works: sorts array, fixes one element, then uses two pointers on remaining elements to find valid triplets.

When to use: triplet sum problems, three-element combinations, extending two-sum solutions, avoiding duplicate results.`,
    example: `function threeSum(nums) {
    const result = [];
    nums.sort((a, b) => a - b);
    
    for (let i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        
        let left = i + 1, right = nums.length - 1;
        while (left < right) {
            const sum = nums[i] + nums[left] + nums[right];
            if (sum === 0) {
                result.push([nums[i], nums[left], nums[right]]);
                while (left < right && nums[left] === nums[left + 1]) left++;
                while (left < right && nums[right] === nums[right - 1]) right--;
                left++; right--;
            } else if (sum < 0) left++;
            else right--;
        }
    }
    return result;
}`
  },
  {
    id: 'container-water',
    title: 'Container With Most Water',
    description: 'Find container that holds maximum water using two pointers optimization',
    category: 'Two Pointers',
    difficulty: 'intermediate',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    extendedDefinition: `The Container With Most Water problem demonstrates the power of two pointers in optimization problems. Given heights of vertical lines, find two lines that form a container holding the maximum water.

What it does: finds two lines that form a container holding the maximum amount of water using two pointers.

How it works: starts with widest container, then moves the pointer at the shorter line inward to potentially find larger areas.

When to use: optimization problems with two elements, area/volume maximization, two-pointer technique applications.`,
    example: `function maxArea(height) {
    let left = 0, right = height.length - 1, maxWater = 0;
    
    while (left < right) {
        const area = Math.min(height[left], height[right]) * (right - left);
        maxWater = Math.max(maxWater, area);
        
        if (height[left] < height[right]) left++;
        else right--;
    }
    return maxWater;
}

// Example: [1,8,6,2,5,4,8,3,7]
// Max area = 49 (between heights 8 and 7)`
  },
  {
    id: 'remove-duplicates',
    title: 'Remove Duplicates from Sorted Array',
    description: 'Remove duplicates in-place from sorted array using two pointers',
    category: 'Two Pointers',
    difficulty: 'beginner',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    extendedDefinition: `This problem showcases the same-direction two pointers technique. We use one pointer to track the position for unique elements and another to scan through the array.

What it does: removes duplicate elements from sorted array in-place while maintaining relative order of unique elements.

How it works: uses slow pointer to track unique element position, fast pointer scans array, overwrites duplicates with unique elements.

When to use: in-place array modification needed, sorted array deduplication, memory-constrained environments, two pointers pattern practice.`,
    example: `function removeDuplicates(nums) {
    if (nums.length <= 1) return nums.length;
    
    let slow = 0;
    for (let fast = 1; fast < nums.length; fast++) {
        if (nums[fast] !== nums[slow]) {
            slow++;
            nums[slow] = nums[fast];
        }
    }
    return slow + 1;
}

// Example: [0,0,1,1,1,2,2,3,3,4] Ã¢â€ â€™ [0,1,2,3,4,...], length=5`
  },
  {
    id: 'palindrome-check',
    title: 'Palindrome Verification',
    description: 'Check if string is palindrome using two pointers from both ends',
    category: 'Two Pointers',
    difficulty: 'beginner',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    extendedDefinition: `Palindrome checking is a perfect example of the converging two pointers technique. We compare characters from both ends moving towards the center.

What it does: checks if a string reads the same forwards and backwards using two-pointer comparison.

How it works: uses two pointers starting from both ends, moving inward while comparing characters until they meet.

When to use: text validation, string processing, finding palindromic patterns in data.`,
    example: `function isPalindrome(s) {
    const cleaned = s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    let left = 0, right = cleaned.length - 1;
    
    while (left < right) {
        if (cleaned[left] !== cleaned[right]) return false;
        left++; right--;
    }
    return true;
}

// Example: "A man, a plan, a canal: Panama" Ã¢â€ â€™ true`,
    syntax: `let left = 0, right = s.length - 1;
while (left < right) {
    if (s[left] !== s[right]) return false;
    left++; right--;
}
return true;`,
  },
  {
    id: 'merge-sorted-arrays',
    title: 'Merge Two Sorted Arrays',
    description: 'Merge two sorted arrays in-place using two pointers technique',
    category: 'Two Pointers',
    difficulty: 'intermediate',
    timeComplexity: 'O(m + n)',
    spaceComplexity: 'O(1)',
    extendedDefinition: `Merging sorted arrays demonstrates the power of two pointers in combining data structures. The key insight is to merge from the end to avoid overwriting elements.

What it does: combines two sorted arrays into one sorted array in-place, maintaining sorted order throughout the process.

How it works: uses three pointers starting from end, compares elements from both arrays, places larger element at end position.

When to use: merging sorted data structures, merge sort implementation, combining sorted lists, in-place array operations.`,
    example: `function merge(nums1, m, nums2, n) {
    let i = m - 1, j = n - 1, k = m + n - 1;
    
    while (i >= 0 && j >= 0) {
        if (nums1[i] > nums2[j]) nums1[k--] = nums1[i--];
        else nums1[k--] = nums2[j--];
    }
    
    while (j >= 0) nums1[k--] = nums2[j--];
}

// Example: [1,2,3,0,0,0] + [2,5,6] Ã¢â€ â€™ [1,2,2,3,5,6]`
  },

  // Sliding Window
  {
    id: 'sliding-window-basics',
    title: 'Sliding Window Technique',
    description: 'Master the sliding window pattern for array and string problems',
    category: 'Sliding Window',
    difficulty: 'intermediate',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    extendedDefinition: `The Sliding Window technique is a powerful algorithmic pattern that maintains a subset of data (window) that slides through a larger dataset. It's particularly effective for problems involving contiguous subarrays or substrings, transforming brute force O(n²) or O(n³) solutions into efficient O(n) algorithms.

What it does: maintains moving window over data structure to efficiently process contiguous elements, avoiding redundant calculations.

How it works: expands window by moving right pointer, contracts by moving left pointer, maintains window properties throughout traversal.

When to use: contiguous subarray/substring problems, fixed or variable window size, optimization from O(n²) to O(n), pattern matching.`,
    example: `// Sliding Window Technique Examples

// 1. Fixed Size Window - Maximum sum of k elements
function maxSumSubarray(arr, k) {
    if (arr.length < k) return null;
    
    // Calculate sum of first window
    let windowSum = 0;
    for (let i = 0; i < k; i++) {
        windowSum += arr[i];
    }
    
    let maxSum = windowSum;
    
    // Slide the window
    for (let i = k; i < arr.length; i++) {
        windowSum = windowSum - arr[i - k] + arr[i]; // Remove left, add right
        maxSum = Math.max(maxSum, windowSum);
    }
    
    return maxSum;
}

// 2. Variable Size Window - Longest substring without repeating characters
function lengthOfLongestSubstring(s) {
    const charSet = new Set();
    let left = 0;
    let maxLength = 0;
    
    for (let right = 0; right < s.length; right++) {
        // Contract window while we have duplicates
        while (charSet.has(s[right])) {
            charSet.delete(s[left]);
            left++;
        }
        
        // Expand window
        charSet.add(s[right]);
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}

// 3. Comprehensive Sliding Window Class
class SlidingWindow {
    constructor() {
        this.window = [];
        this.left = 0;
        this.right = 0;
    }
    
    // Fixed size sliding window maximum
    maxInFixedWindow(arr, k) {
        if (arr.length < k) return [];
        
        const result = [];
        const deque = []; // Store indices
        
        for (let i = 0; i < arr.length; i++) {
            // Remove elements outside current window
            while (deque.length > 0 && deque[0] <= i - k) {
                deque.shift();
            }
            
            // Remove smaller elements from back
            while (deque.length > 0 && arr[deque[deque.length - 1]] <= arr[i]) {
                deque.pop();
            }
            
            deque.push(i);
            
            // Add to result when window is complete
            if (i >= k - 1) {
                result.push(arr[deque[0]]);
            }
        }
        
        return result;
    }
    
    // Variable size - minimum window substring
    minWindow(s, t) {
        const targetMap = new Map();
        for (const char of t) {
            targetMap.set(char, (targetMap.get(char) || 0) + 1);
        }
        
        let left = 0;
        let minLength = Infinity;
        let minStart = 0;
        let required = targetMap.size;
        let formed = 0;
        const windowCounts = new Map();
        
        for (let right = 0; right < s.length; right++) {
            const char = s[right];
            windowCounts.set(char, (windowCounts.get(char) || 0) + 1);
            
            if (targetMap.has(char) && windowCounts.get(char) === targetMap.get(char)) {
                formed++;
            }
            
            // Contract window while valid
            while (left <= right && formed === required) {
                if (right - left + 1 < minLength) {
                    minLength = right - left + 1;
                    minStart = left;
                }
                
                const leftChar = s[left];
                windowCounts.set(leftChar, windowCounts.get(leftChar) - 1);
                if (targetMap.has(leftChar) && windowCounts.get(leftChar) < targetMap.get(leftChar)) {
                    formed--;
                }
                left++;
            }
        }
        
        return minLength === Infinity ? "" : s.substring(minStart, minStart + minLength);
    }
}

// Example usage
console.log(maxSumSubarray([1, 4, 2, 10, 23, 3, 1, 0, 20], 4)); // 39
console.log(lengthOfLongestSubstring("abcabcbb")); // 3

const sw = new SlidingWindow();
console.log(sw.maxInFixedWindow([1, 3, -1, -3, 5, 3, 6, 7], 3)); // [3, 3, 5, 5, 6, 7]
console.log(sw.minWindow("ADOBECODEBANC", "ABC")); // "BANC"`
  },
  {
    id: 'sliding-window-maximum',
    title: 'Sliding Window Maximum',
    description: 'Find maximum in all subarrays of size k using deque optimization',
    category: 'Sliding Window',
    difficulty: 'advanced',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(k)',
    extendedDefinition: `The Sliding Window Maximum problem finds the maximum element in every subarray of size k in an array. This is a classic application of the sliding window technique combined with a deque (double-ended queue) data structure for optimal performance.

What it does: finds maximum element in every sliding window of size k, maintaining efficient access to maximum across all windows.

How it works: uses deque to store indices in decreasing order of values, removes outdated indices, maintains maximum at front.

When to use: sliding window maximum queries, stock price analysis, real-time data monitoring, competitive programming problems.`,
    example: `// Sliding Window Maximum Implementation
function slidingWindowMaximum(nums, k) {
    if (nums.length === 0 || k === 0) return [];
    
    const result = [];
    const deque = []; // Store indices
    
    for (let i = 0; i < nums.length; i++) {
        // Remove indices outside current window
        while (deque.length > 0 && deque[0] <= i - k) {
            deque.shift();
        }
        
        // Remove indices of smaller elements from back
        while (deque.length > 0 && nums[deque[deque.length - 1]] <= nums[i]) {
            deque.pop();
        }
        
        // Add current index
        deque.push(i);
        
        // Add maximum to result when window is complete
        if (i >= k - 1) {
            result.push(nums[deque[0]]);
        }
    }
    
    return result;
}

// Enhanced implementation with detailed tracking
class SlidingWindowMax {
    constructor() {
        this.deque = [];
        this.window = [];
    }
    
    findMaximums(arr, k) {
        const result = [];
        this.deque = [];
        
        for (let i = 0; i < arr.length; i++) {
            // Remove elements outside window
            while (this.deque.length > 0 && this.deque[0] <= i - k) {
                this.deque.shift();
            }
            
            // Maintain decreasing order
            while (this.deque.length > 0 && arr[this.deque[this.deque.length - 1]] <= arr[i]) {
                this.deque.pop();
            }
            
            this.deque.push(i);
            
            // Record maximum when window is complete
            if (i >= k - 1) {
                result.push({
                    windowStart: i - k + 1,
                    windowEnd: i,
                    maximum: arr[this.deque[0]],
                    maxIndex: this.deque[0]
                });
            }
        }
        
        return result;
    }
    
    // Alternative approach using priority queue simulation
    findMaximumsWithPQ(arr, k) {
        const result = [];
        const pq = []; // [value, index] pairs
        
        for (let i = 0; i < arr.length; i++) {
            // Add current element
            pq.push([arr[i], i]);
            
            // Remove elements outside window
            while (pq.length > 0 && pq[0][1] <= i - k) {
                pq.shift();
            }
            
            // Sort to maintain max at front (inefficient but illustrative)
            pq.sort((a, b) => b[0] - a[0] || b[1] - a[1]);
            
            if (i >= k - 1) {
                result.push(pq[0][0]);
            }
        }
        
        return result;
    }
}

// Example usage
const nums = [1, 3, -1, -3, 5, 3, 6, 7];
const k = 3;

console.log(slidingWindowMaximum(nums, k)); // [3, 3, 5, 5, 6, 7]

const swm = new SlidingWindowMax();
const detailed = swm.findMaximums(nums, k);
console.log('Detailed results:', detailed);`
  },
  {
    id: 'longest-substring',
    title: 'Longest Substring Problems',
    description: 'Find longest substring without repeating characters and variations',
    category: 'Sliding Window',
    difficulty: 'intermediate',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(min(m,n))',
    extendedDefinition: `The Longest Substring Without Repeating Characters problem is a classic variable-size sliding window problem that finds the length of the longest substring that contains all unique characters.

What it does: finds longest contiguous substring with all unique characters using variable-size sliding window approach.

How it works: expands window with right pointer, contracts with left pointer when duplicates found, tracks characters with set/map.

When to use: unique character substring problems, text analysis, data deduplication, sliding window pattern practice.`,
    example: `// Longest Substring Without Repeating Characters
function lengthOfLongestSubstring(s) {
    const charSet = new Set();
    let left = 0;
    let maxLength = 0;
    
    for (let right = 0; right < s.length; right++) {
        // Contract window while duplicate exists
        while (charSet.has(s[right])) {
            charSet.delete(s[left]);
            left++;
        }
        
        // Expand window
        charSet.add(s[right]);
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}

// Enhanced implementation with detailed tracking
class LongestSubstring {
    constructor() {
        this.charMap = new Map();
        this.maxLength = 0;
        this.maxSubstring = '';
    }
    
    findLongestUnique(s) {
        const charMap = new Map();
        let left = 0;
        let maxLength = 0;
        let maxStart = 0;
        
        for (let right = 0; right < s.length; right++) {
            const char = s[right];
            
            // If character seen before and within current window
            if (charMap.has(char) && charMap.get(char) >= left) {
                left = charMap.get(char) + 1;
            }
            
            charMap.set(char, right);
            
            if (right - left + 1 > maxLength) {
                maxLength = right - left + 1;
                maxStart = left;
            }
        }
        
        return {
            length: maxLength,
            substring: s.substring(maxStart, maxStart + maxLength),
            startIndex: maxStart
        };
    }
    
    // Variation: At most k distinct characters
    longestWithKDistinct(s, k) {
        const charCount = new Map();
        let left = 0;
        let maxLength = 0;
        
        for (let right = 0; right < s.length; right++) {
            const char = s[right];
            charCount.set(char, (charCount.get(char) || 0) + 1);
            
            // Contract window if more than k distinct characters
            while (charCount.size > k) {
                const leftChar = s[left];
                charCount.set(leftChar, charCount.get(leftChar) - 1);
                if (charCount.get(leftChar) === 0) {
                    charCount.delete(leftChar);
                }
                left++;
            }
            
            maxLength = Math.max(maxLength, right - left + 1);
        }
        
        return maxLength;
    }
    
    // Variation: Minimum window substring
    minWindow(s, t) {
        const targetMap = new Map();
        for (const char of t) {
            targetMap.set(char, (targetMap.get(char) || 0) + 1);
        }
        
        let left = 0;
        let minLength = Infinity;
        let minStart = 0;
        let required = targetMap.size;
        let formed = 0;
        const windowCounts = new Map();
        
        for (let right = 0; right < s.length; right++) {
            const char = s[right];
            windowCounts.set(char, (windowCounts.get(char) || 0) + 1);
            
            if (targetMap.has(char) && windowCounts.get(char) === targetMap.get(char)) {
                formed++;
            }
            
            // Contract window while valid
            while (left <= right && formed === required) {
                if (right - left + 1 < minLength) {
                    minLength = right - left + 1;
                    minStart = left;
                }
                
                const leftChar = s[left];
                windowCounts.set(leftChar, windowCounts.get(leftChar) - 1);
                if (targetMap.has(leftChar) && windowCounts.get(leftChar) < targetMap.get(leftChar)) {
                    formed--;
                }
                left++;
            }
        }
        
        return minLength === Infinity ? "" : s.substring(minStart, minStart + minLength);
    }
}

// Example usage
console.log(lengthOfLongestSubstring("abcabcbb")); // 3 ("abc")
console.log(lengthOfLongestSubstring("bbbbb")); // 1 ("b")

const ls = new LongestSubstring();
console.log(ls.findLongestUnique("pwwkew")); // {length: 3, substring: "wke", startIndex: 2}
console.log(ls.longestWithKDistinct("eceba", 2)); // 3 ("ece")
console.log(ls.minWindow("ADOBECODEBANC", "ABC")); // "BANC"`
  },

  // Bit Manipulation
  {
    id: 'bit-basics',
    title: 'Bit Manipulation Basics',
    description: 'Basic bitwise operations: AND, OR, XOR, NOT, shifts',
    category: 'Bit Manipulation',
    difficulty: 'beginner',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    extendedDefinition: `Bit Manipulation involves performing operations directly on the binary representation of numbers. It's one of the most efficient ways to perform certain calculations and is fundamental in computer science for optimization and low-level programming.

What it does: performs operations directly on binary digits using bitwise operators like AND, OR, XOR, NOT, and bit shifts.

How it works: treats numbers as sequences of bits and applies logical operations bit by bit to achieve desired results.

When to use: optimization problems, checking powers of two, finding unique elements, generating subsets, low-level programming.`,
    example: `// Bit Manipulation Basics

// Basic Bitwise Operations
function bitwiseOperations() {
    const a = 5;  // Binary: 101
    const b = 3;  // Binary: 011
    
    console.log("AND:", a & b);    // 1 (001)
    console.log("OR:", a | b);     // 7 (111)
    console.log("XOR:", a ^ b);    // 6 (110)
    console.log("NOT a:", ~a);     // -6 (two's complement)
    console.log("Left shift:", a << 1);  // 10 (1010)
    console.log("Right shift:", a >> 1); // 2 (10)
}

// Check if number is even or odd
function isEven(n) {
    return (n & 1) === 0;
}

// Check if number is power of 2
function isPowerOfTwo(n) {
    return n > 0 && (n & (n - 1)) === 0;
}

// Set bit at position i
function setBit(num, i) {
    return num | (1 << i);
}

// Clear bit at position i
function clearBit(num, i) {
    return num & ~(1 << i);
}

// Toggle bit at position i
function toggleBit(num, i) {
    return num ^ (1 << i);
}

// Check if bit at position i is set
function isBitSet(num, i) {
    return (num & (1 << i)) !== 0;
}

// Count number of set bits (1s)
function countSetBits(n) {
    let count = 0;
    while (n) {
        count += n & 1;
        n >>= 1;
    }
    return count;
}

// Brian Kernighan's algorithm for counting set bits
function countSetBitsFast(n) {
    let count = 0;
    while (n) {
        n &= (n - 1); // Removes rightmost set bit
        count++;
    }
    return count;
}

// Example usage
bitwiseOperations();
console.log(isEven(4));        // true
console.log(isPowerOfTwo(8));  // true
console.log(setBit(5, 1));     // 7 (101 -> 111)
console.log(clearBit(7, 1));   // 5 (111 -> 101)
console.log(countSetBits(7));  // 3`,
    syntax: `**Bit Manipulation Patterns:**

1. **Basic Operations:**
   \`\`\`javascript
   // AND: both bits must be 1
   a & b
   
   // OR: at least one bit must be 1
   a | b
   
   // XOR: bits must be different
   a ^ b
   
   // NOT: flip all bits
   ~a
   
   // Left shift: multiply by 2^n
   a << n
   
   // Right shift: divide by 2^n
   a >> n
   \`\`\`

2. **Common Bit Tricks:**
   \`\`\`javascript
   // Check even/odd
   n & 1 === 0  // even if true
   
   // Power of 2 check
   n > 0 && (n & (n - 1)) === 0
   
   // Set bit at position i
   num | (1 << i)
   
   // Clear bit at position i
   num & ~(1 << i)
   
   // Toggle bit at position i
   num ^ (1 << i)
   
   // Check if bit i is set
   (num & (1 << i)) !== 0
   \`\`\``,
    syntax: `// Basic Bitwise Operators
a & b    // AND
a | b    // OR  
a ^ b    // XOR
~a       // NOT
a << n   // Left shift
a >> n   // Right shift

// Common Patterns
n & 1 === 0        // Check even
n & (n-1) === 0    // Check power of 2
num | (1 << i)     // Set bit i
num & ~(1 << i)    // Clear bit i`,
  },
  {
    id: 'count-set-bits',
    title: 'Count Set Bits',
    description: 'Count number of 1s in binary representation',
    category: 'Bit Manipulation',
    difficulty: 'beginner',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    extendedDefinition: `Counting Set Bits (also known as Population Count or Hamming Weight) is a fundamental bit manipulation operation that counts the number of 1s in the binary representation of a number. This operation has numerous applications in computer science and optimization.

What it does: counts number of 1-bits in binary representation of integer, fundamental operation for bit manipulation algorithms.

How it works: uses bit operations like n&1 to check bits, or Brian Kernighan's algorithm n&(n-1) to clear rightmost set bit.

When to use: bit manipulation problems, cryptography, error correction codes, optimization algorithms, competitive programming.`,
    example: `// Count Set Bits Implementation
// Method 1: Naive approach - check each bit
function countSetBitsNaive(n) {
    let count = 0;
    while (n) {
        count += n & 1; // Check rightmost bit
        n >>= 1;        // Right shift
    }
    return count;
}

// Method 2: Brian Kernighan's Algorithm - O(number of set bits)
function countSetBitsBK(n) {
    let count = 0;
    while (n) {
        n &= (n - 1); // Remove rightmost set bit
        count++;
    }
    return count;
}

// Method 3: Using lookup table for optimization
class BitCounter {
    constructor() {
        // Precompute counts for 8-bit numbers
        this.lookupTable = new Array(256);
        for (let i = 0; i < 256; i++) {
            this.lookupTable[i] = this.countBitsNaive(i);
        }
    }
    
    countBitsNaive(n) {
        let count = 0;
        while (n) {
            count += n & 1;
            n >>= 1;
        }
        return count;
    }
    
    countSetBitsLookup(n) {
        let count = 0;
        while (n) {
            count += this.lookupTable[n & 0xFF]; // Count bits in last 8 bits
            n >>= 8; // Move to next 8 bits
        }
        return count;
    }
    
    // Method 4: Divide and conquer approach
    countSetBitsDivideConquer(n) {
        // Count bits in parallel
        n = n - ((n >> 1) & 0x55555555);
        n = (n & 0x33333333) + ((n >> 2) & 0x33333333);
        n = (n + (n >> 4)) & 0x0F0F0F0F;
        n = n + (n >> 8);
        n = n + (n >> 16);
        return n & 0x3F;
    }
    
    // Method 5: Using built-in function (when available)
    countSetBitsBuiltIn(n) {
        // In environments that support it
        return n.toString(2).split('1').length - 1;
    }
}

// Enhanced implementation with performance comparison
class SetBitAnalyzer {
    constructor() {
        this.counter = new BitCounter();
    }
    
    analyzeNumber(n) {
        const methods = [
            { name: 'Naive', func: countSetBitsNaive },
            { name: 'Brian Kernighan', func: countSetBitsBK },
            { name: 'Lookup Table', func: this.counter.countSetBitsLookup.bind(this.counter) },
            { name: 'Divide & Conquer', func: this.counter.countSetBitsDivideConquer.bind(this.counter) }
        ];
        
        const results = methods.map(method => {
            const start = performance.now();
            const count = method.func(n);
            const time = performance.now() - start;
            
            return {
                method: method.name,
                count: count,
                time: time,
                binary: n.toString(2)
            };
        });
        
        return results;
    }
    
    // Count set bits in range [a, b]
    countSetBitsInRange(a, b) {
        let totalCount = 0;
        for (let i = a; i <= b; i++) {
            totalCount += countSetBitsBK(i);
        }
        return totalCount;
    }
    
    // Find numbers with exactly k set bits
    findNumbersWithKBits(n, k) {
        const result = [];
        for (let i = 0; i <= n; i++) {
            if (countSetBitsBK(i) === k) {
                result.push({
                    number: i,
                    binary: i.toString(2),
                    setBits: k
                });
            }
        }
        return result;
    }
}

// Example usage
console.log(countSetBitsNaive(7));  // 3 (binary: 111)
console.log(countSetBitsBK(12));    // 2 (binary: 1100)

const analyzer = new SetBitAnalyzer();
console.log(analyzer.analyzeNumber(255)); // Compare all methods
console.log(analyzer.findNumbersWithKBits(15, 2)); // Numbers ≤ 15 with exactly 2 set bits`
  },
  {
    id: 'power-of-two',
    title: 'Power of Two Check',
    description: 'Check if number is power of 2 using bit manipulation',
    category: 'Bit Manipulation',
    difficulty: 'beginner',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    extendedDefinition: `Checking if a number is a power of two is a classic bit manipulation problem that can be solved elegantly using the property that powers of two have exactly one bit set in their binary representation.

What it does: determines if given positive integer is power of two using efficient bit manipulation trick.

How it works: uses n & (n-1) == 0 property where powers of two have single bit set, subtracting 1 flips all bits after it.

When to use: optimization problems, memory allocation, hash table sizing, binary tree problems, competitive programming.`
  },
  {
    id: 'single-number',
    title: 'Single Number',
    description: 'Find single number in array where others appear twice',
    category: 'Bit Manipulation',
    difficulty: 'intermediate',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    extendedDefinition: `The Single Number problem finds the unique element in an array where every other element appears exactly twice, using the XOR operation's self-canceling property.

What it does: finds single unique number in array where all other numbers appear exactly twice using XOR properties.

How it works: XORs all numbers together, identical numbers cancel out (a ⊕ a = 0), leaving only the unique number.

When to use: finding unique elements, bit manipulation practice, space-efficient solutions, when hash tables not allowed.`
  },
  {
    id: 'bit-subset',
    title: 'Generate All Subsets',
    description: 'Generate all subsets using bit manipulation',
    category: 'Bit Manipulation',
    difficulty: 'intermediate',
    timeComplexity: 'O(2^n)',
    spaceComplexity: 'O(1)',
    extendedDefinition: `Generating all subsets using bit manipulation leverages the fact that each subset can be represented by a binary number where each bit indicates whether an element is included.

What it does: generates all possible subsets of given set using bit patterns to represent element inclusion/exclusion.

How it works: iterates through numbers 0 to 2^n-1, uses each bit position to determine if corresponding element is in subset.

When to use: subset enumeration problems, combinatorial generation, backtracking alternatives, when memory efficiency important.`
  },

  // Mathematical Algorithms
  {
    id: 'mathematical-algorithms-intro',
    title: 'Mathematical Algorithms Overview',
    description: 'Foundation of computational mathematics in algorithm design and optimization',
    category: 'Mathematical Algorithms',
    difficulty: 'intermediate',
    timeComplexity: 'Varies',
    spaceComplexity: 'Varies',
    extendedDefinition: `Mathematical algorithms form the backbone of computational problem-solving, combining mathematical theory with efficient algorithmic techniques. These algorithms solve numerical problems, optimize computations, and provide foundations for cryptography, graphics, and scientific computing.

What it does: applies mathematical principles to solve computational problems efficiently, covering number theory, combinatorics, and optimization.

How it works: leverages mathematical properties like modular arithmetic, fast exponentiation, and algorithmic optimization to reduce complexity.

When to use: cryptography applications, scientific computing, graphics programming, competitive programming, when mathematical insight can optimize solutions.`,
    example: `// Fast Exponentiation
function fastPower(base, exp, mod = null) {
    let result = 1;
    while (exp > 0) {
        if (exp % 2 === 1) result = (result * base) % (mod || Number.MAX_SAFE_INTEGER);
        exp = Math.floor(exp / 2);
        base = (base * base) % (mod || Number.MAX_SAFE_INTEGER);
    }
    return result;
}

// GCD using Euclidean Algorithm
function gcd(a, b) {
    while (b !== 0) [a, b] = [b, a % b];
    return a;
}

// Sieve of Eratosthenes
function sieveOfEratosthenes(n) {
    const isPrime = Array(n + 1).fill(true);
    isPrime[0] = isPrime[1] = false;
    for (let i = 2; i * i <= n; i++) {
        if (isPrime[i]) {
            for (let j = i * i; j <= n; j += i) isPrime[j] = false;
        }
    }
    return isPrime.map((prime, index) => prime ? index : null).filter(num => num !== null);
}`,
    syntax: `**Mathematical Algorithm Patterns:**

1. **Iterative Mathematical Operations:**
   \`\`\`javascript
   function mathematicalOperation(n) {
       let result = initialValue;
       while (condition) {
           result = updateRule(result);
           n = reduceN(n);
       }
       return result;
   }
   \`\`\`

2. **Recursive Mathematical Relations:**
   \`\`\`javascript
   function recursiveMath(n) {
       if (baseCase(n)) return baseValue;
       return combineResults(
           recursiveMath(reduce1(n)),
           recursiveMath(reduce2(n))
       );
   }
   \`\`\`

3. **Modular Arithmetic:**
   \`\`\`javascript
   const MOD = 1000000007;
   function modularOperation(a, b) {
       return ((a % MOD) + (b % MOD)) % MOD;
   }
   \`\`\``
  },
  {
    id: 'number-theory-basics',
    title: 'Number Theory Fundamentals',
    description: 'Essential number theory concepts: GCD, LCM, prime numbers, and divisibility',
    category: 'Mathematical Algorithms',
    difficulty: 'beginner',
    timeComplexity: 'O(log min(a,b))',
    spaceComplexity: 'O(1)',
    extendedDefinition: `Number theory provides fundamental tools for algorithmic problem-solving. These concepts appear frequently in competitive programming, cryptography, and optimization problems.

What it does: provides mathematical tools for GCD, LCM, prime testing, and modular arithmetic operations.

How it works: uses algorithms like Euclidean method for GCD, sieve methods for primes, and modular arithmetic for efficient calculations.

When to use: cryptography, competitive programming, fraction operations, hash functions, mathematical optimization problems.`,
    example: `// GCD using Euclidean Algorithm
function gcd(a, b) {
    while (b !== 0) [a, b] = [b, a % b];
    return a;
}

// LCM using GCD
function lcm(a, b) {
    return Math.abs(a * b) / gcd(a, b);
}

// Prime check
function isPrime(n) {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    for (let i = 3; i * i <= n; i += 2) {
        if (n % i === 0) return false;
    }
    return true;
}

// Prime factorization
function primeFactors(n) {
    const factors = [];
    while (n % 2 === 0) { factors.push(2); n /= 2; }
    for (let i = 3; i * i <= n; i += 2) {
        while (n % i === 0) { factors.push(i); n /= i; }
    }
    if (n > 2) factors.push(n);
    return factors;
}`
  },
  {
    id: 'prime-algorithms',
    title: 'Prime Number Algorithms',
    description: 'Efficient algorithms for prime generation, testing, and factorization',
    category: 'Mathematical Algorithms',
    difficulty: 'intermediate',
    timeComplexity: 'O(n log log n)',
    spaceComplexity: 'O(n)',
    extendedDefinition: `Prime number algorithms are crucial for cryptography, number theory, and optimization problems. Different algorithms serve different purposes based on the problem requirements.

What it does: efficiently tests primality, generates prime numbers, and performs prime factorization using various mathematical algorithms.

How it works: uses Sieve of Eratosthenes for generation, trial division for testing, optimizations like checking only up to √n.

When to use: cryptography applications, number theory problems, RSA encryption, mathematical computations, competitive programming.`,
    example: `// Sieve of Eratosthenes
function sieveOfEratosthenes(n) {
    const isPrime = Array(n + 1).fill(true);
    isPrime[0] = isPrime[1] = false;
    
    for (let i = 2; i * i <= n; i++) {
        if (isPrime[i]) {
            for (let j = i * i; j <= n; j += i) isPrime[j] = false;
        }
    }
    
    return isPrime.map((prime, index) => prime ? index : null).filter(num => num !== null);
}

// Optimized Primality Test
function isPrimeOptimized(n) {
    if (n < 2) return false;
    if (n === 2 || n === 3) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;
    
    for (let i = 5; i * i <= n; i += 6) {
        if (n % i === 0 || n % (i + 2) === 0) return false;
    }
    return true;
}

// Prime Factorization
function primeFactorization(n) {
    const factors = new Map();
    while (n % 2 === 0) { factors.set(2, (factors.get(2) || 0) + 1); n /= 2; }
    for (let i = 3; i * i <= n; i += 2) {
        while (n % i === 0) { factors.set(i, (factors.get(i) || 0) + 1); n /= i; }
    }
    if (n > 2) factors.set(n, 1);
    return factors;
}`
  },
  {
    id: 'fast-exponentiation',
    title: 'Fast Exponentiation (Binary Exponentiation)',
    description: 'Compute a^n efficiently using binary exponentiation and modular arithmetic',
    category: 'Mathematical Algorithms',
    difficulty: 'intermediate',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    extendedDefinition: `Fast exponentiation, also known as binary exponentiation or exponentiation by squaring, computes a^n in O(log n) time instead of the naive O(n) approach.

What it does: computes large powers efficiently using binary representation of exponent, reducing time complexity from O(n) to O(log n).

How it works: uses divide-and-conquer approach, squares base when exponent is even, multiplies by base when odd, processes binary digits.

When to use: large power computations, modular exponentiation in cryptography, matrix exponentiation, competitive programming, RSA encryption.`,
    example: `// Iterative Binary Exponentiation
function fastPower(base, exp, mod = null) {
    let result = 1;
    base = base % (mod || Number.MAX_SAFE_INTEGER);
    
    while (exp > 0) {
        if (exp % 2 === 1) result = mod ? (result * base) % mod : result * base;
        exp = Math.floor(exp / 2);
        base = mod ? (base * base) % mod : base * base;
    }
    return result;
}

// Recursive Binary Exponentiation
function fastPowerRecursive(base, exp, mod = null) {
    if (exp === 0) return 1;
    const half = fastPowerRecursive(base, Math.floor(exp / 2), mod);
    const halfSquared = mod ? (half * half) % mod : half * half;
    return exp % 2 === 0 ? halfSquared : mod ? (base * halfSquared) % mod : base * halfSquared;
}

// Example: fastPower(2, 10) = 1024`
  },
  {
    id: 'modular-arithmetic',
    title: 'Modular Arithmetic',
    description: 'Master modular arithmetic operations and their applications in algorithms',
    category: 'Mathematical Algorithms',
    difficulty: 'intermediate',
    timeComplexity: 'O(1) - O(log n)',
    spaceComplexity: 'O(1)',
    extendedDefinition: `Modular arithmetic is arithmetic for integers where numbers "wrap around" after reaching a certain value (the modulus). It's essential for handling large numbers, cryptography, and competitive programming.

What it does: performs arithmetic operations on integers with results constrained to a specific range by wrapping around at the modulus value.

How it works: uses properties like (a+b) mod m = ((a mod m) + (b mod m)) mod m to break complex calculations into manageable parts.

When to use: cryptography, hash functions, large number computations, competitive programming, random number generation, preventing integer overflow.`,
    example: `// Modular Arithmetic Operations
const MOD = 1000000007;

function modAdd(a, b, mod = MOD) { return ((a % mod) + (b % mod)) % mod; }
function modSubtract(a, b, mod = MOD) { return ((a % mod) - (b % mod) + mod) % mod; }
function modMultiply(a, b, mod = MOD) { return ((a % mod) * (b % mod)) % mod; }

// Modular Inverse using Extended Euclidean Algorithm
function modInverse(a, mod = MOD) {
    function extendedGCD(a, b) {
        if (b === 0) return { gcd: a, x: 1, y: 0 };
        const result = extendedGCD(b, a % b);
        return { gcd: result.gcd, x: result.y, y: result.x - Math.floor(a / b) * result.y };
    }
    
    const result = extendedGCD(a, mod);
    if (result.gcd !== 1) throw new Error("Modular inverse doesn't exist");
    return (result.x % mod + mod) % mod;
}

// Modular Division
function modDivide(a, b, mod = MOD) {
    return modMultiply(a, modInverse(b, mod), mod);
}`
  },
  {
    id: 'combinatorics',
    title: 'Combinatorics and Counting',
    description: 'Permutations, combinations, and advanced counting techniques',
    category: 'Mathematical Algorithms',
    difficulty: 'intermediate',
    timeComplexity: 'O(n) - O(n!)',
    spaceComplexity: 'O(n)',
    extendedDefinition: `Combinatorics deals with counting, arrangement, and selection of objects. It's fundamental to probability, algorithm analysis, and optimization problems.

What it does: provides mathematical techniques for counting arrangements, selections, and combinations of objects.

How it works: uses formulas like nPr for permutations, nCr for combinations, and principles like inclusion-exclusion for complex counting.

When to use: probability calculations, algorithm analysis, optimization problems, generating arrangements and selections.`,
    example: `// Permutations nPr = n!/(n-r)!
function permutation(n, r) {
    if (r > n || r < 0) return 0;
    let result = 1;
    for (let i = n; i > n - r; i--) result *= i;
    return result;
}

// Combinations nCr = n!/(r!(n-r)!)
function combination(n, r) {
    if (r > n || r < 0) return 0;
    if (r === 0 || r === n) return 1;
    r = Math.min(r, n - r);
    
    let result = 1;
    for (let i = 0; i < r; i++) result = result * (n - i) / (i + 1);
    return Math.round(result);
}

// Catalan Numbers
function catalanNumber(n) {
    if (n <= 1) return 1;
    const catalan = Array(n + 1);
    catalan[0] = catalan[1] = 1;
    
    for (let i = 2; i <= n; i++) {
        catalan[i] = 0;
        for (let j = 0; j < i; j++) catalan[i] += catalan[j] * catalan[i - 1 - j];
    }
    return catalan[n];
}

// Example: combination(10, 3) = 120, catalanNumber(4) = 14`
  },
  {
    id: 'fibonacci-algorithms',
    title: 'Fibonacci and Linear Recurrences',
    description: 'Efficient algorithms for Fibonacci sequence and linear recurrence relations',
    category: 'Mathematical Algorithms',
    difficulty: 'intermediate',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    extendedDefinition: `Fibonacci sequence and linear recurrences appear frequently in algorithm problems. While the naive recursive approach is O(2^n), several optimizations can reduce this to O(log n).

What it does: efficiently computes Fibonacci numbers and solves linear recurrence relations using optimized mathematical techniques.

How it works: uses dynamic programming for O(n), matrix exponentiation for O(log n), or mathematical identities for direct calculation.

When to use: Fibonacci calculations, counting problems like stairs/tiling, recurrence relation optimization, competitive programming, mathematical modeling.`,
    example: `// Dynamic Programming Approach O(n)
function fibonacciDP(n) {
    if (n <= 1) return n;
    let prev2 = 0, prev1 = 1;
    
    for (let i = 2; i <= n; i++) {
        const current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }
    return prev1;
}

// Matrix Exponentiation O(log n)
function fibonacciMatrix(n) {
    if (n <= 1) return n;
    
    function matrixMultiply(A, B) {
        return [
            [A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]],
            [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]]
        ];
    }
    
    function matrixPower(matrix, power) {
        if (power === 1) return matrix;
        if (power % 2 === 0) {
            const half = matrixPower(matrix, power / 2);
            return matrixMultiply(half, half);
        }
        return matrixMultiply(matrix, matrixPower(matrix, power - 1));
    }
    
    const baseMatrix = [[1, 1], [1, 0]];
    return matrixPower(baseMatrix, n)[0][1];
}

// Example: fibonacciDP(10) = 55, fibonacciMatrix(50) computed in O(log 50)`
  }
];






















