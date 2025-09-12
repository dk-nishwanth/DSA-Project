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

**Key Properties:**
- **Fixed Size**: Traditional arrays have a predetermined size
- **Homogeneous Elements**: All elements are of the same data type
- **Zero-based Indexing**: First element is at index 0
- **Contiguous Memory**: Elements are stored in adjacent memory locations
- **Random Access**: Any element can be accessed in O(1) time

**Memory Layout:**
Arrays store elements in consecutive memory addresses, enabling efficient cache utilization and predictable memory access patterns.`,
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
numbers.forEach((num, i) => console.log(\`Index \${i}: \${num}\`));`
  },
  {
    id: 'array-rotation',
    title: 'Array Rotation',
    description: 'Learn left and right rotation techniques with optimal approaches',
    category: 'Arrays',
    difficulty: 'intermediate',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
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
    syntax: `**Array Rotation Patterns:**

1. **Left Rotation by k positions:**
   \`\`\`javascript
   function rotateLeft(arr, k) {
       k = k % arr.length;
       return arr.slice(k).concat(arr.slice(0, k));
   }
   \`\`\`

2. **Right Rotation by k positions:**
   \`\`\`javascript
   function rotateRight(arr, k) {
       k = k % arr.length;
       return arr.slice(-k).concat(arr.slice(0, -k));
   }
   \`\`\`

3. **In-place rotation (Reversal Algorithm):**
   \`\`\`javascript
   function reverse(arr, start, end) {
       while (start < end) {
           [arr[start], arr[end]] = [arr[end], arr[start]];
           start++; end--;
       }
   }
   \`\`\``
  },
  {
    id: 'array-subarray-problems',
    title: 'Subarray Problems',
    description: 'Maximum subarray, subarray sum, and sliding window basics',
    category: 'Arrays',
    difficulty: 'intermediate',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
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
    syntax: `**Subarray Problem Patterns:**

1. **Kadane's Algorithm (Maximum Subarray):**
   \`\`\`javascript
   function maxSubarray(arr) {
       let maxSoFar = arr[0], maxEndingHere = arr[0];
       for (let i = 1; i < arr.length; i++) {
           maxEndingHere = Math.max(arr[i], maxEndingHere + arr[i]);
           maxSoFar = Math.max(maxSoFar, maxEndingHere);
       }
       return maxSoFar;
   }
   \`\`\`

2. **Subarray with Given Sum:**
   \`\`\`javascript
   function subarraySum(arr, target) {
       let start = 0, currentSum = 0;
       for (let end = 0; end < arr.length; end++) {
           currentSum += arr[end];
           while (currentSum > target && start <= end) {
               currentSum -= arr[start++];
           }
           if (currentSum === target) return [start, end];
       }
       return [-1, -1];
   }
   \`\`\``
  },

  // Strings
  {
    id: 'string-palindrome',
    title: 'Palindrome Check',
    description: 'Check if a string is a palindrome using various methods',
    category: 'Strings',
    difficulty: 'beginner',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
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
   \`\`\``
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
    spaceComplexity: 'O(1)',
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
   \`\`\`

2. **Sorting Approach:**
   \`\`\`javascript
   function isAnagram(s1, s2) {
       return s1.split('').sort().join('') === 
              s2.split('').sort().join('');
   }
   \`\`\``
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
    spaceComplexity: 'O(1)',
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
   \`\`\``
  },
  {
    id: 'linked-list-circular',
    title: 'Circular Linked List',
    description: 'Circular linked list where last node points to first node',
    category: 'Linked Lists',
    difficulty: 'intermediate',
    timeComplexity: 'O(1) - O(n)',
    spaceComplexity: 'O(1)',
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
   \`\`\``
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
    spaceComplexity: 'O(n)',
    example: `// Queue Implementation
class Queue {
    constructor() {
        this.items = [];
    }
    
    // Add element to rear
    enqueue(element) {
        this.items.push(element);
    }
    
    // Remove element from front
    dequeue() {
        if (this.isEmpty()) return null;
        return this.items.shift();
    }
    
    // View front element
    front() {
        if (this.isEmpty()) return null;
        return this.items[0];
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
    
    size() {
        return this.items.length;
    }
}

// Usage
const queue = new Queue();
queue.enqueue(1);
queue.enqueue(2);
console.log(queue.dequeue()); // 1
console.log(queue.front()); // 2`,
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
       
       enqueue(element) {
           if (this.isFull()) return false;
           this.rear = (this.rear + 1) % this.size;
           this.items[this.rear] = element;
           if (this.front === -1) this.front = 0;
           return true;
       }
   }
   \`\`\``
  },

  // Trees
  {
    id: 'binary-tree',
    title: 'Binary Tree Fundamentals',
    description: 'Tree structure with inorder, preorder, postorder traversals and properties',
    category: 'Trees',
    difficulty: 'intermediate',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)',
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
    syntax: `**Binary Tree Traversal Patterns:**

1. **Inorder (Left, Root, Right):**
   \`\`\`javascript
   function inorder(root) {
       if (!root) return;
       inorder(root.left);
       console.log(root.val);
       inorder(root.right);
   }
   \`\`\`

2. **Preorder (Root, Left, Right):**
   \`\`\`javascript
   function preorder(root) {
       if (!root) return;
       console.log(root.val);
       preorder(root.left);
       preorder(root.right);
   }
   \`\`\`

3. **Postorder (Left, Right, Root):**
   \`\`\`javascript
   function postorder(root) {
       if (!root) return;
       postorder(root.left);
       postorder(root.right);
       console.log(root.val);
   }
   \`\`\``
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

**BST Property:**
- Left subtree contains only nodes with values less than the parent node
- Right subtree contains only nodes with values greater than the parent node
- Both left and right subtrees are also binary search trees

**Performance Characteristics:**
- **Best/Average Case**: O(log n) for search, insert, delete
- **Worst Case**: O(n) when tree becomes skewed (like a linked list)
- **Space Complexity**: O(h) where h is the height of the tree

**Tree Traversals:**
- **Inorder**: Left → Root → Right (gives sorted order)
- **Preorder**: Root → Left → Right (useful for copying tree)
- **Postorder**: Left → Right → Root (useful for deleting tree)`,
    voiceExplanation: `Think of a Binary Search Tree like a family tree, but with a special rule for organizing data. Imagine you're the root of the family tree. Everyone to your left in the family has a smaller value than you, and everyone to your right has a larger value. This rule applies to every person in the tree - they're always bigger than everyone on their left and smaller than everyone on their right. This organization makes searching incredibly fast because you can eliminate half the tree with each comparison, just like binary search. When you want to find someone, you start at the top and keep going left if they're smaller or right if they're bigger until you find them. It's like having a perfectly organized filing system where everything has its logical place.`,
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

const bst = new BST();
bst.insert(50); bst.insert(30); bst.insert(70);
console.log(bst.search(30)); // Found`
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
    spaceComplexity: 'O(V)',
    extendedDefinition: `Depth First Search (DFS) is a fundamental graph traversal algorithm that explores as far as possible along each branch before backtracking. It uses a stack-based approach (either explicit stack or recursion stack) to systematically visit all vertices in a graph.

**Algorithm Strategy:**
1. Start from a source vertex and mark it as visited
2. Explore an unvisited adjacent vertex recursively
3. When no unvisited adjacent vertices remain, backtrack
4. Continue until all reachable vertices are visited

**Key Characteristics:**
- **Memory Efficient**: Uses O(V) space for visited array and recursion stack
- **Path Finding**: Naturally finds paths between vertices
- **Cycle Detection**: Can detect cycles in both directed and undirected graphs
- **Topological Sorting**: Essential for ordering vertices in DAGs
- **Connected Components**: Identifies separate components in graphs

**DFS vs BFS:**
- DFS goes deep first, BFS goes wide first
- DFS uses stack, BFS uses queue
- DFS better for path existence, BFS better for shortest paths`,
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
    spaceComplexity: 'O(n)',
    extendedDefinition: `Merge Sort is a stable, divide-and-conquer sorting algorithm that consistently performs in O(n log n) time regardless of input distribution. It works by recursively dividing the array into smaller subarrays until each contains a single element, then merging these subarrays back together in sorted order.

**Algorithm Phases:**
1. **Divide**: Split array into two halves recursively until single elements
2. **Conquer**: Merge the divided subarrays back together in sorted order
3. **Combine**: The merge process maintains the sorted property

**Key Properties:**
- **Stable**: Maintains relative order of equal elements
- **Consistent Performance**: Always O(n log n), regardless of input
- **External Sorting**: Suitable for sorting large datasets that don't fit in memory
- **Parallelizable**: Can be easily adapted for parallel processing

**Comparison with Other Sorts:**
- More predictable than Quick Sort (no worst-case O(n²))
- Uses more memory than in-place sorts like Heap Sort
- Stable unlike Quick Sort and Heap Sort`,
    voiceExplanation: `Imagine you have a huge pile of papers to sort alphabetically, but it's too overwhelming to sort all at once. Merge sort uses a "divide and conquer" strategy - like asking friends to help. You split the pile in half, give each half to a friend, and ask them to sort their pile. But here's the clever part: your friends do the same thing! They split their piles in half and pass them on, until everyone has just one or two papers that are easy to sort. Then, the magic happens during the "merge" phase. People start combining their sorted mini-piles back together, always keeping them in order. Two sorted piles are easy to merge - just compare the top papers and take the smaller one. This process continues until you have one perfectly sorted pile. It's like a well-organized assembly line that guarantees the same speed no matter how messy the original pile was.`,
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
console.log("Sorted:", mergeSort(numbers)); // [11, 12, 22, 25, 34, 64, 90]`
  },
  {
    id: 'quick-sort',
    title: 'Quick Sort',
    description: 'Efficient in-place sorting using pivot partitioning',
    category: 'Sorting',
    difficulty: 'intermediate',
    timeComplexity: 'O(n log n) - O(n²)',
    spaceComplexity: 'O(log n)',
    extendedDefinition: `Quick Sort is a highly efficient, divide-and-conquer sorting algorithm that works by selecting a 'pivot' element and partitioning the array around it. Elements smaller than the pivot go to the left, larger elements go to the right, then the process is recursively applied to the sub-arrays.

**Algorithm Strategy:**
1. **Choose Pivot**: Select an element as the pivot (first, last, random, or median)
2. **Partition**: Rearrange array so elements < pivot are on left, > pivot on right
3. **Recursively Sort**: Apply quick sort to left and right sub-arrays
4. **Combine**: No explicit combine step needed due to in-place sorting

**Key Characteristics:**
- **In-place**: Requires only O(log n) extra space for recursion stack
- **Unstable**: Does not preserve relative order of equal elements
- **Cache-friendly**: Good locality of reference due to in-place partitioning
- **Practical**: Often faster than other O(n log n) algorithms in practice

**Performance Analysis:**
- **Best Case**: O(n log n) - pivot always divides array in half
- **Average Case**: O(n log n) - expected performance with random pivots
- **Worst Case**: O(n²) - pivot is always smallest or largest element`,
    voiceExplanation: `Imagine you're organizing a library by arranging books on shelves by height. Quick sort is like having a smart librarian who picks one book as a reference point and says "All shorter books go to my left, all taller books go to my right." Once that's done, the librarian does the same thing with the left pile and the right pile separately, picking new reference books for each group. This process continues until every small group is perfectly sorted. The magic is in the partitioning - it's like having multiple librarians working on different sections simultaneously. Sometimes you get lucky and pick perfect reference points that split the work evenly, making it super fast. But if you consistently pick the shortest or tallest book as your reference, you end up doing a lot more work. That's why choosing a good pivot is crucial for Quick Sort's performance.`,
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
console.log("Sorted:", quickSort([...numbers])); // [11, 12, 22, 25, 34, 64, 90]`
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
    spaceComplexity: 'O(1)',
    extendedDefinition: `Binary Search is a highly efficient searching algorithm that works on sorted arrays by repeatedly dividing the search interval in half. It compares the target value with the middle element and eliminates half of the remaining elements in each iteration.

**Prerequisites:**
- Array must be sorted in ascending or descending order
- Random access to elements (arrays, not linked lists)

**Algorithm Principle:**
The algorithm leverages the divide-and-conquer paradigm, reducing the problem size by half in each step, resulting in logarithmic time complexity.

**Variants:**
- **Lower Bound**: Find first occurrence of target
- **Upper Bound**: Find first element greater than target
- **Exact Match**: Traditional binary search
- **Peak Finding**: Find local maxima in arrays`,
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
    }
    
    return -1;
}

// Example usage
const numbers = [1, 3, 5, 7, 9, 11, 13, 15];
console.log(binarySearch(numbers, 7)); // Output: 3
console.log(binarySearch(numbers, 4)); // Output: -1`
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
    id: 'backtracking-intro',
    title: 'Backtracking Fundamentals',
    description: 'Master the backtracking algorithmic paradigm for constraint satisfaction problems',
    category: 'Backtracking',
    difficulty: 'intermediate',
    timeComplexity: 'O(b^d)',
    spaceComplexity: 'O(d)',
    extendedDefinition: `Backtracking is a systematic method for solving constraint satisfaction problems by incrementally building solutions and abandoning candidates ("backtracking") when they cannot lead to a valid solution.

**Core Concepts:**
- **Decision Tree**: Each decision creates a branch in the solution space
- **Pruning**: Eliminate branches that cannot lead to valid solutions
- **State Space**: All possible configurations of the problem
- **Constraint Checking**: Validate partial solutions at each step

**Algorithm Template:**
1. Choose a candidate for the next step
2. Check if this candidate is valid (satisfies constraints)
3. If valid, make the choice and recurse
4. If the recursive call succeeds, return success
5. If not, undo the choice (backtrack) and try the next candidate
6. If no candidates work, return failure

**Common Applications:**
- Puzzle solving (Sudoku, N-Queens)
- Combinatorial optimization
- Graph coloring
- Subset generation
- Permutation and combination problems

**Visualization Pattern:**
\`\`\`
        Root
       /  |  \\
      A   B   C
     /|   |   |\\
    D E   F   G H
    ✓ ✗   ✓   ✗ ✓
\`\`\`

✓ = Valid solution, ✗ = Invalid (backtrack)`,
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
   \`\`\``
  },
  {
    id: 'n-queens',
    title: 'N-Queens Problem',
    description: 'Place N queens on NxN chessboard so no two queens attack each other',
    category: 'Backtracking',
    difficulty: 'advanced',
    timeComplexity: 'O(N!)',
    spaceComplexity: 'O(N²)',
    extendedDefinition: `The N-Queens problem is a classic backtracking problem that demonstrates constraint satisfaction. The goal is to place N queens on an N×N chessboard such that no two queens can attack each other.

**Constraints:**
- No two queens in the same row
- No two queens in the same column  
- No two queens on the same diagonal

**Attack Patterns:**
Queens can attack horizontally, vertically, and diagonally. The key insight is that if we place queens row by row, we only need to check column and diagonal conflicts.

**Optimization Techniques:**
- Place one queen per row (eliminates row conflicts)
- Use arrays to track column and diagonal occupancy
- Diagonal identification: main diagonal (row-col), anti-diagonal (row+col)`,
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
    timeComplexity: 'O(9^(n²))',
    spaceComplexity: 'O(n²)',
    extendedDefinition: `Sudoku solving demonstrates advanced backtracking with multiple constraint types. Each cell must satisfy three constraints simultaneously: row, column, and 3×3 box uniqueness.

**Sudoku Rules:**
- Each row contains digits 1-9 exactly once
- Each column contains digits 1-9 exactly once  
- Each 3×3 box contains digits 1-9 exactly once

**Algorithm Strategy:**
1. Find next empty cell
2. Try digits 1-9 in that cell
3. Check if digit satisfies all three constraints
4. If valid, recurse to solve remaining puzzle
5. If no digit works, backtrack

**Optimization Techniques:**
- Most Constrained Variable (MCV): Fill cells with fewest possibilities first
- Constraint propagation: Update possibilities when placing digits
- Naked singles: Cells with only one possible value`,
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
    timeComplexity: 'O(4^(n×m))',
    spaceComplexity: 'O(n×m)',
    extendedDefinition: `Maze solving showcases backtracking in grid-based problems. The algorithm explores all possible paths from start to destination, backtracking when hitting dead ends.

**Problem Setup:**
- Grid with walls (1) and open paths (0)
- Start position and destination position
- Can move in 4 directions (up, down, left, right)
- Find any valid path or all possible paths

**Backtracking Process:**
1. Mark current cell as visited
2. If reached destination, return success
3. Try all 4 directions
4. For each valid direction, recurse
5. If no direction leads to solution, unmark cell (backtrack)

**Path Tracking:**
Maintain a path array to record the sequence of moves, enabling path reconstruction and visualization.`,
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
    timeComplexity: 'O(4^n / √n)',
    spaceComplexity: 'O(n)',
    extendedDefinition: `Generating valid parentheses demonstrates backtracking with constraint validation. We build strings character by character, ensuring validity at each step.

**Constraints for Valid Parentheses:**
- Equal number of opening and closing parentheses
- At any point, number of closing parentheses ≤ opening parentheses
- Total length = 2n for n pairs

**Pruning Strategy:**
- Don't add '(' if we already have n opening parentheses
- Don't add ')' if it would make string invalid (more ')' than '(')
- This dramatically reduces the search space`,
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
    timeComplexity: 'O(N × 4^L)',
    spaceComplexity: 'O(L)',
    extendedDefinition: `Word search in a grid combines backtracking with 2D traversal. We explore all possible paths from each starting position, backtracking when the current path cannot form the target word.

**Problem Constraints:**
- Word can be formed by adjacent cells (horizontally or vertically)
- Same cell cannot be used twice in a single word
- Case-sensitive matching

**Algorithm Strategy:**
1. Try starting from each cell in the grid
2. For each starting position, use DFS with backtracking
3. Mark cells as visited during current path exploration
4. Unmark cells when backtracking to allow other paths`,
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

**Problem Variations:**
- Combination Sum I: Numbers can be reused unlimited times
- Combination Sum II: Each number used at most once, handle duplicates
- Combination Sum III: Use exactly k numbers from 1-9

**Key Optimizations:**
- Sort array to enable early termination
- Skip duplicates to avoid duplicate combinations
- Pass remaining target to avoid recalculating sums`,
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
//              / |   |    ✓
//           [2,2] [2,3] [3,3]
//           / |    ✓     |
//       [2,2,2] [2,2,3] [3,3,3]
//         |       ✓      (>7)
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
    id: 'two-pointers-intro',
    title: 'Two Pointers Technique',
    description: 'Master the fundamental two pointers pattern for array and string problems',
    category: 'Two Pointers',
    difficulty: 'beginner',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    extendedDefinition: `The Two Pointers technique is a powerful algorithmic pattern that uses two pointers to traverse data structures, typically arrays or strings, from different positions. This technique is particularly effective for problems involving sorted arrays, palindromes, or finding pairs/triplets.

**Key Concepts:**
- **Opposite Direction**: Start from both ends and move towards center
- **Same Direction**: Both pointers move in same direction at different speeds
- **Fast & Slow**: One pointer moves faster than the other (Floyd's cycle detection)

**Common Applications:**
- Finding pairs with specific sum
- Palindrome checking
- Removing duplicates
- Merging sorted arrays
- Cycle detection in linked lists

**Visualization Pattern:**
\`\`\`
Array: [1, 2, 3, 4, 5, 6, 7, 8]
Left:   ↑                     
Right:                      ↑
\`\`\`

The pointers move based on problem conditions, eliminating the need for nested loops and reducing time complexity from O(n²) to O(n).`,
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

**Problem Variations:**
- Two Sum in sorted array (Two Pointers - O(n))
- Two Sum in unsorted array (Hash Map - O(n))
- Two Sum with indices (Hash Map preferred)
- Two Sum - return all pairs

**Algorithm Logic:**
1. Start with pointers at both ends
2. Calculate sum of elements at pointers
3. If sum equals target - found the pair
4. If sum is less than target - move left pointer right
5. If sum is greater than target - move right pointer left`,
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
// left=0, right=1: sum = 2+7 = 9 ✓`
  },
  {
    id: 'three-sum',
    title: 'Three Sum Problem',
    description: 'Find all unique triplets that sum to zero using two pointers technique',
    category: 'Two Pointers',
    difficulty: 'intermediate',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    extendedDefinition: `The Three Sum problem extends the two pointers technique to find triplets. Given an array, find all unique triplets that sum to zero (or a target).

**Key Challenges:**
- Avoiding duplicate triplets
- Handling the third element efficiently
- Maintaining O(n²) time complexity

**Algorithm Strategy:**
1. Sort the array first
2. Fix one element as the first element
3. Use two pointers for the remaining two elements
4. Skip duplicates to ensure unique triplets`,
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

**Key Insight:**
The area is determined by the shorter line and the distance between lines. Moving the pointer at the taller line won't increase the area, so we always move the pointer at the shorter line.

**Why This Works:**
- Area = min(height[left], height[right]) × (right - left)
- Moving the taller line can only decrease or maintain area
- Moving the shorter line might find a taller line and increase area`,
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

**Pattern: Slow-Fast Pointers**
- Slow pointer: marks the position for next unique element
- Fast pointer: scans through the array
- When fast finds a new unique element, place it at slow position

**In-Place Modification:**
The algorithm modifies the array in-place, maintaining the relative order of unique elements.`,
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

// Example: [0,0,1,1,1,2,2,3,3,4] → [0,1,2,3,4,...], length=5`
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

**Variations:**
- Simple palindrome check
- Ignore case and non-alphanumeric characters
- Longest palindromic substring
- Valid palindrome after removing one character`,
    example: `function isPalindrome(s) {
    const cleaned = s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    let left = 0, right = cleaned.length - 1;
    
    while (left < right) {
        if (cleaned[left] !== cleaned[right]) return false;
        left++; right--;
    }
    return true;
}

// Example: "A man, a plan, a canal: Panama" → true`
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

**Why Merge from End:**
- Prevents overwriting unprocessed elements
- Utilizes the extra space at the end of the first array
- Maintains sorted order efficiently`,
    example: `function merge(nums1, m, nums2, n) {
    let i = m - 1, j = n - 1, k = m + n - 1;
    
    while (i >= 0 && j >= 0) {
        if (nums1[i] > nums2[j]) nums1[k--] = nums1[i--];
        else nums1[k--] = nums2[j--];
    }
    
    while (j >= 0) nums1[k--] = nums2[j--];
}

// Example: [1,2,3,0,0,0] + [2,5,6] → [1,2,2,3,5,6]`
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
    id: 'mathematical-algorithms-intro',
    title: 'Mathematical Algorithms Overview',
    description: 'Foundation of computational mathematics in algorithm design and optimization',
    category: 'Mathematical Algorithms',
    difficulty: 'intermediate',
    timeComplexity: 'Varies',
    spaceComplexity: 'Varies',
    extendedDefinition: `Mathematical algorithms form the backbone of computational problem-solving, combining mathematical theory with efficient algorithmic techniques. These algorithms solve numerical problems, optimize computations, and provide foundations for cryptography, graphics, and scientific computing.

**Core Areas:**
- **Number Theory**: GCD, LCM, prime numbers, modular arithmetic
- **Combinatorics**: Permutations, combinations, counting problems
- **Geometry**: Computational geometry, coordinate systems
- **Optimization**: Linear programming, dynamic optimization
- **Probability**: Random algorithms, statistical computations

**Key Principles:**
- **Mathematical Insight**: Leverage mathematical properties for efficiency
- **Numerical Stability**: Handle precision and overflow issues
- **Algorithmic Optimization**: Reduce complexity through mathematical techniques
- **Modular Arithmetic**: Essential for large number computations

**Applications:**
- Cryptography and security
- Computer graphics and game development
- Scientific simulations
- Financial modeling
- Machine learning algorithms

**Common Patterns:**
\`\`\`
Mathematical Property → Algorithmic Optimization
Example: a^n = (a^(n/2))^2 → O(log n) exponentiation
\`\`\``,
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

**Core Concepts:**
- **Greatest Common Divisor (GCD)**: Largest number dividing both numbers
- **Least Common Multiple (LCM)**: Smallest number divisible by both numbers
- **Prime Numbers**: Numbers divisible only by 1 and themselves
- **Coprime Numbers**: Numbers with GCD = 1
- **Modular Arithmetic**: Arithmetic with remainders

**Key Relationships:**
- LCM(a,b) × GCD(a,b) = a × b
- If GCD(a,b) = 1, then a and b are coprime
- Euclidean Algorithm: GCD(a,b) = GCD(b, a mod b)

**Applications:**
- Simplifying fractions
- Finding common denominators
- Cryptographic key generation
- Hash function design`,
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

**Algorithm Categories:**
- **Primality Testing**: Check if a single number is prime
- **Prime Generation**: Generate all primes up to n
- **Prime Factorization**: Find prime factors of a number
- **Prime Counting**: Count primes in a range

**Sieve of Eratosthenes:**
The most efficient algorithm for generating all primes up to n. It works by iteratively marking multiples of each prime as composite.

**Optimizations:**
- Only check odd numbers after 2
- Only sieve up to √n for marking
- Segmented sieve for large ranges
- Wheel factorization for further optimization`,
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

**Core Insight:**
The algorithm leverages the binary representation of the exponent:
- If n is even: a^n = (a^(n/2))^2
- If n is odd: a^n = a × a^(n-1)

**Applications:**
- Modular exponentiation in cryptography
- Computing large powers efficiently
- Matrix exponentiation for recurrence relations
- Fast computation in competitive programming

**Modular Arithmetic:**
When computing large powers, we often need the result modulo some number to prevent overflow. The property (a × b) mod m = ((a mod m) × (b mod m)) mod m allows us to keep numbers manageable.`,
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

**Key Properties:**
- (a + b) mod m = ((a mod m) + (b mod m)) mod m
- (a - b) mod m = ((a mod m) - (b mod m) + m) mod m
- (a × b) mod m = ((a mod m) × (b mod m)) mod m
- (a^b) mod m can be computed efficiently using fast exponentiation

**Modular Inverse:**
The modular inverse of a modulo m is a number x such that (a × x) mod m = 1. It exists if and only if gcd(a, m) = 1.

**Applications:**
- Cryptography (RSA, Diffie-Hellman)
- Hash functions
- Random number generation
- Competitive programming problems`,
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

**Core Concepts:**
- **Permutations**: Arrangements where order matters (nPr = n!/(n-r)!)
- **Combinations**: Selections where order doesn't matter (nCr = n!/(r!(n-r)!))
- **Derangements**: Permutations where no element is in its original position
- **Catalan Numbers**: Count various combinatorial structures
- **Stirling Numbers**: Count ways to partition sets

**Counting Principles:**
- **Addition Principle**: If events are mutually exclusive, add their counts
- **Multiplication Principle**: If events are independent, multiply their counts
- **Inclusion-Exclusion**: Count by including and excluding overlapping cases
- **Pigeonhole Principle**: If n items go into m containers (n > m), at least one container has multiple items`,
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

**Fibonacci Sequence:**
F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2)

**Optimization Techniques:**
- **Dynamic Programming**: O(n) time, O(1) space
- **Matrix Exponentiation**: O(log n) time using fast exponentiation
- **Binet's Formula**: Direct calculation using golden ratio (precision issues)
- **Fast Doubling**: O(log n) using mathematical identities

**Matrix Representation:**
[F(n+1)]   [1 1]^n   [F(1)]
[F(n)  ] = [1 0]   × [F(0)]

**Applications:**
- Dynamic programming optimization
- Counting problems (stairs, tiling)
- Golden ratio approximations
- Recurrence relation solving`,
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