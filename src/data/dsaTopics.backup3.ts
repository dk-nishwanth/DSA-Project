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
    extendedDefinition: `Array rotation involves shifting elements of an array to the left or right by a specified number of positions. This fundamental operation is crucial in many algorithms and has applications in circular data structures, string manipulation, and algorithmic problem solving.

**Types of Array Rotation:**
- **Left Rotation**: Elements move towards the beginning, with elements from the start wrapping to the end
- **Right Rotation**: Elements move towards the end, with elements from the end wrapping to the start
- **Circular Rotation**: Treating the array as a circular structure where the last element connects to the first

**Key Concepts:**
- **Modular Arithmetic**: Use k % n to handle rotations larger than array size
- **In-place vs Extra Space**: Trade-off between memory usage and implementation complexity
- **Reversal Algorithm**: Efficient in-place rotation using three array reversals
- **Cyclic Replacements**: Advanced technique for optimal space complexity

**Algorithm Approaches:**
1. **Temporary Array**: Simple but uses O(n) extra space
2. **One by One**: Rotate elements individually, O(1) space but O(n×k) time
3. **Reversal Algorithm**: Three reversals achieve O(n) time and O(1) space
4. **Cyclic Replacement**: Handle rotations in cycles for optimal performance

**Mathematical Foundation:**
For left rotation by k positions: new_index = (old_index - k + n) % n
For right rotation by k positions: new_index = (old_index + k) % n`,
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
    extendedDefinition: `Subarray problems involve finding contiguous subsequences within an array that satisfy specific conditions. These problems are fundamental in algorithmic problem solving and form the basis for many optimization techniques.

**Core Concepts:**
- **Subarray**: A contiguous sequence of elements within an array
- **Subsequence**: Elements in original order but not necessarily contiguous
- **Subsets**: Any combination of elements from the array

**Common Subarray Problems:**
1. **Maximum Subarray Sum**: Find contiguous subarray with largest sum (Kadane's Algorithm)
2. **Subarray with Given Sum**: Find subarray that sums to a target value
3. **Longest Subarray**: Find longest subarray satisfying certain conditions
4. **Minimum Subarray**: Find subarray with minimum sum or length

**Kadane's Algorithm Principle:**
At each position, decide whether to extend the existing subarray or start a new one. The key insight is that if the current sum becomes negative, it's better to start fresh from the current element.

**Sliding Window Technique:**
For problems involving subarrays of fixed or variable size, the sliding window technique provides an efficient O(n) solution by maintaining a window that slides through the array.

**Dynamic Programming Connection:**
Many subarray problems can be solved using dynamic programming principles, where the solution at each position depends on the solution at previous positions.

**Applications:**
- Stock trading algorithms (maximum profit)
- Signal processing (finding patterns)
- Data analysis (trend identification)
- Resource allocation (optimal scheduling)`,
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
    spaceComplexity: 'O(m)',
    extendedDefinition: `The Knuth-Morris-Pratt (KMP) algorithm is an efficient string matching algorithm that avoids redundant character comparisons by utilizing information about the pattern itself. It achieves linear time complexity by preprocessing the pattern to create a failure function.

**Key Innovation:**
Unlike naive string matching that restarts comparison from the next character after a mismatch, KMP uses the failure function (also called LPS - Longest Proper Prefix which is also Suffix) to determine how far to shift the pattern without missing any potential matches.

**Failure Function (LPS Array):**
For each position in the pattern, the LPS array stores the length of the longest proper prefix that is also a suffix. This information allows the algorithm to skip characters that are guaranteed not to match.

**Algorithm Phases:**
1. **Preprocessing**: Build the LPS array in O(m) time
2. **Searching**: Use the LPS array to efficiently search in O(n) time

**Why It Works:**
When a mismatch occurs at position j in the pattern, we know that characters 0 to j-1 matched. The LPS array tells us the longest prefix of the pattern that is also a suffix of the matched portion, allowing us to continue matching from that position.

**Advantages:**
- Linear time complexity O(n + m)
- No backtracking in the text
- Optimal for repeated pattern searches
- Foundation for other advanced string algorithms

**Applications:**
- Text editors (find and replace)
- DNA sequence analysis
- Compiler design (lexical analysis)
- Network intrusion detection systems`,
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
   \`\`\``
  },
  {
    id: 'rabin-karp',
    title: 'Rabin-Karp Algorithm',
    description: 'String matching using rolling hash technique',
    category: 'Strings',
    difficulty: 'intermediate',
    timeComplexity: 'O(n + m)',
    spaceComplexity: 'O(1)',
    extendedDefinition: `The Rabin-Karp algorithm uses hashing to find pattern occurrences in text efficiently. It employs a rolling hash function that can be updated in constant time as the window slides through the text, making it particularly effective for multiple pattern searches.

**Core Concept - Rolling Hash:**
Instead of comparing strings character by character, Rabin-Karp computes hash values for the pattern and text substrings. The "rolling" aspect means that when the window slides by one position, the new hash can be computed from the previous hash in O(1) time.

**Hash Function:**
Typically uses polynomial rolling hash: hash = (c₁ × base^(m-1) + c₂ × base^(m-2) + ... + cₘ × base^0) mod prime

**Rolling Hash Update:**
When sliding the window from position i to i+1:
new_hash = (old_hash - text[i] × base^(m-1)) × base + text[i+m]

**Collision Handling:**
Since hash collisions can occur, when hash values match, the algorithm performs character-by-character comparison to confirm the match. This is why the worst-case time complexity can be O(nm), but average case is O(n+m).

**Advantages:**
- Simple to implement and understand
- Excellent for multiple pattern searches
- Can be extended to 2D pattern matching
- Effective average-case performance

**Applications:**
- Plagiarism detection systems
- DNA sequence matching
- Image pattern recognition
- Duplicate file detection
- Web crawling and indexing`,
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
   \`\`\``
  },
  {
    id: 'z-algorithm',
    title: 'Z Algorithm',
    description: 'Linear time string matching using Z array',
    category: 'Strings',
    difficulty: 'advanced',
    timeComplexity: 'O(n + m)',
    spaceComplexity: 'O(n + m)',
    extendedDefinition: `The Z Algorithm is a linear-time string matching algorithm that constructs a Z array where Z[i] represents the length of the longest substring starting from position i that is also a prefix of the string. This powerful preprocessing enables efficient pattern matching and various string analysis tasks.

**Z Array Definition:**
For a string S of length n, Z[i] is the length of the longest substring starting from S[i] which is also a prefix of S. By definition, Z[0] is not defined (or can be considered as n).

**Key Insight:**
The algorithm maintains a "Z-box" [L, R] representing the rightmost segment that matches a prefix. When processing position i:
- If i ≤ R, we can use previously computed information
- If i > R, we compute Z[i] from scratch

**Algorithm Efficiency:**
Despite nested loops, the algorithm runs in O(n) time because each character is examined at most twice - once when extending R and once when it's inside a Z-box.

**Pattern Matching Application:**
To find pattern P in text T, create string S = P + "$" + T (where "$" is a separator not in the alphabet). Then Z[i] = |P| indicates a match at position i - |P| - 1 in the original text.

**Advantages:**
- Simple and elegant implementation
- Linear time complexity with small constants
- Versatile for various string problems
- Easy to understand and debug

**Applications:**
- String matching and searching
- Longest common prefix problems
- Palindrome detection algorithms
- String compression techniques
- Bioinformatics sequence analysis`,
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

// Pattern matching using Z algorithm
function zSearch(text, pattern) {
    const combined = pattern + "$" + text;
    const z = zAlgorithm(combined);
    const result = [];
    
    for (let i = pattern.length + 1; i < combined.length; i++) {
        if (z[i] === pattern.length) {
            result.push(i - pattern.length - 1);
        }
    }
    return result;
}`,
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
   \`\`\``
  },
  {
    id: 'manacher-algorithm',
    title: 'Manacher\'s Algorithm',
    description: 'Linear time algorithm to find all palindromes in string',
    category: 'Strings',
    difficulty: 'advanced',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    extendedDefinition: `Manacher's Algorithm is a sophisticated linear-time algorithm for finding all palindromic substrings in a string. It's particularly famous for solving the "longest palindromic substring" problem optimally, improving upon the naive O(n³) and dynamic programming O(n²) approaches.

**Key Innovation - String Preprocessing:**
The algorithm transforms the input string to handle even and odd length palindromes uniformly. For example, "abc" becomes "^#a#b#c#$" where ^ and $ are sentinels to avoid boundary checks, and # characters ensure all palindromes have odd length in the transformed string.

**Palindrome Array:**
The algorithm maintains an array P where P[i] represents the radius of the palindrome centered at position i in the transformed string. This directly gives us the length of palindromes in the original string.

**Mirror Property:**
The core insight is that palindromes have mirror symmetry. If we're processing position i and we know there's a palindrome centered at position c with right boundary r, and i is within this palindrome, then P[i] is at least min(P[mirror_of_i], r - i).

**Linear Time Guarantee:**
Although the algorithm has nested loops, it runs in O(n) time because the right boundary r only moves forward, and each character is examined at most twice.

**Applications:**
- Finding longest palindromic substring
- Counting all palindromic substrings
- DNA sequence analysis (finding palindromic sequences)
- Text processing and pattern recognition
- Competitive programming problems

**Advantages:**
- Optimal O(n) time complexity
- Finds all palindromes, not just the longest
- Elegant use of symmetry properties
- Foundation for advanced string algorithms`,
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
   \`\`\``
  },
  {
    id: 'string-anagram',
    title: 'Anagram Detection',
    description: 'Check if two strings are anagrams of each other',
    category: 'Strings',
    difficulty: 'beginner',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    extendedDefinition: `Anagram detection determines whether two strings contain exactly the same characters with the same frequencies, but possibly in different orders. Two strings are anagrams if one can be formed by rearranging the letters of the other.

**What it does:**
Anagram detection algorithms verify if two strings are rearrangements of each other by comparing character frequencies or sorted representations.

**How it works:**
1. **Character Frequency Method**: Count occurrences of each character in both strings and compare the counts
2. **Sorting Method**: Sort both strings and check if they're identical
3. **Hash Table Method**: Use a hash map to track character frequencies efficiently

**When to use:**
- Word games and puzzles (Scrabble, crosswords)
- Cryptography and cipher analysis
- Data deduplication and similarity detection
- String matching and search optimization
- Linguistic analysis and natural language processing

**Key Insights:**
- Strings must have equal length to be anagrams
- Case sensitivity and whitespace handling affect results
- Character frequency approach is more efficient than sorting for large strings`,

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
    spaceComplexity: 'O(1)',
    extendedDefinition: `A Singly Linked List is a linear data structure where elements (nodes) are stored in sequence, with each node containing data and a reference (pointer) to the next node. Unlike arrays, linked lists don't require contiguous memory allocation, providing dynamic size capabilities.

**Node Structure:**
Each node contains two components:
- **Data**: The actual value stored in the node
- **Next**: A reference/pointer to the next node in the sequence

**Key Characteristics:**
- **Dynamic Size**: Can grow or shrink during runtime
- **Sequential Access**: Must traverse from head to reach any element
- **Memory Efficiency**: Allocates memory as needed, no wasted space
- **Insertion/Deletion**: Efficient at any position once the location is known

**Memory Layout:**
Unlike arrays with contiguous memory, linked list nodes can be scattered throughout memory, connected only by pointers. This provides flexibility but reduces cache locality.

**Common Operations:**
1. **Insertion**: At head (O(1)), at tail (O(n)), at position (O(n))
2. **Deletion**: By value (O(n)), by position (O(n)), at head (O(1))
3. **Traversal**: Visit all nodes sequentially (O(n))
4. **Search**: Find element by value (O(n))
5. **Reverse**: Change direction of all pointers (O(n))

**Advantages vs Arrays:**
- Dynamic size allocation
- Efficient insertion/deletion at known positions
- Memory allocated as needed

**Disadvantages vs Arrays:**
- No random access (must traverse to reach elements)
- Extra memory overhead for storing pointers
- Poor cache locality due to non-contiguous memory`,
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
   \`\`\``
  },
  {
    id: 'linked-list-doubly',
    title: 'Doubly Linked List',
    description: 'Bidirectional linked list with efficient forward and backward operations',
    category: 'Linked Lists',
    difficulty: 'intermediate',
    timeComplexity: 'O(1) - O(n)',
    spaceComplexity: 'O(1)',
    extendedDefinition: `A Doubly Linked List is a linear data structure where each node contains data and two pointers: one pointing to the next node and another pointing to the previous node. This bidirectional linking enables efficient traversal in both forward and backward directions.

**What it does:**
Doubly linked lists provide bidirectional navigation through the data structure, allowing efficient insertion and deletion operations at both ends and at any known position.

**How it works:**
Each node maintains three components:
1. **Data**: The actual value stored in the node
2. **Next**: Pointer to the next node in the sequence
3. **Previous**: Pointer to the previous node in the sequence

The list typically maintains both head and tail pointers for efficient operations at both ends.

**When to use:**
- Browser history navigation (back/forward buttons)
- Undo/redo functionality in applications
- Music playlist with previous/next song navigation
- LRU (Least Recently Used) cache implementation
- Text editors with cursor movement
- Implementation of deques (double-ended queues)

**Key advantages over singly linked lists:**
- Bidirectional traversal capability
- Efficient deletion when node reference is known (O(1))
- Easy implementation of reverse operations
- Better for algorithms requiring backward movement`,
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
    extendedDefinition: `A Circular Linked List is a variation of a linked list where the last node points back to the first node, forming a circular structure. This creates an endless loop where you can traverse the entire list starting from any node.

**What it does:**
Circular linked lists provide continuous traversal capabilities and eliminate the concept of a "null" end, making them ideal for applications that require cyclic behavior or round-robin scheduling.

**How it works:**
In a circular linked list, instead of the last node pointing to null, it points back to the head node. This creates a circular chain where:
- Traversal can continue indefinitely
- You can start from any node and visit all others
- Special care is needed to detect when you've completed a full cycle

**When to use:**
- Round-robin scheduling in operating systems
- Circular buffers for streaming data
- Music playlists with repeat functionality
- Game development for cycling through players/turns
- Implementation of circular queues
- Josephus problem and similar mathematical problems
- Continuous monitoring systems

**Key considerations:**
- Traversal requires cycle detection to avoid infinite loops
- Memory management is simpler (no null pointer checks)
- Insertion and deletion require careful pointer management
- Can be implemented as singly or doubly circular`,
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
    spaceComplexity: 'O(n)',
    extendedDefinition: `A Stack is a linear data structure that follows the Last-In-First-Out (LIFO) principle, where elements are added and removed from the same end called the "top" of the stack. Think of it like a stack of plates - you can only add or remove plates from the top.

**Core Principle - LIFO:**
The last element pushed onto the stack is the first one to be popped off. This ordering constraint makes stacks perfect for scenarios where you need to reverse the order of operations or maintain a "most recent first" access pattern.

**Essential Operations:**
1. **Push**: Add an element to the top of the stack (O(1))
2. **Pop**: Remove and return the top element (O(1))
3. **Peek/Top**: View the top element without removing it (O(1))
4. **isEmpty**: Check if the stack is empty (O(1))
5. **Size**: Get the number of elements in the stack (O(1))

**Implementation Approaches:**
- **Array-based**: Use an array with a top pointer/index
- **Linked List-based**: Use a singly linked list with head as top
- **Dynamic Array**: Automatically resize when capacity is exceeded

**Memory Management:**
Stacks can be implemented with fixed size (static) or dynamic size. Dynamic stacks automatically resize when full, while static stacks have a predetermined maximum capacity.

**Real-World Applications:**
- **Function Call Management**: Call stack in programming languages
- **Expression Evaluation**: Converting infix to postfix, evaluating expressions
- **Undo Operations**: Text editors, image editors, browsers
- **Backtracking Algorithms**: Maze solving, N-Queens problem
- **Syntax Parsing**: Balanced parentheses, compiler design
- **Memory Management**: Stack frame allocation in programs`,
    example: `// Stack Implementation
class Stack {
    constructor() {
        this.items = [];
    }
    
    // Add element to top - O(1)
    push(element) {
        this.items.push(element);
    }
    
    // Remove element from top - O(1)
    pop() {
        if (this.isEmpty()) return null;
        return this.items.pop();
    }
    
    // View top element - O(1)
    peek() {
        if (this.isEmpty()) return null;
        return this.items[this.items.length - 1];
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
    
    size() {
        return this.items.length;
    }
}

// Practical Example: Balanced Parentheses
function isBalanced(str) {
    const stack = new Stack();
    const pairs = { '(': ')', '[': ']', '{': '}' };
    
    for (let char of str) {
        if (char in pairs) {
            stack.push(char);
        } else if (Object.values(pairs).includes(char)) {
            if (stack.isEmpty() || pairs[stack.pop()] !== char) {
                return false;
            }
        }
    }
    
    return stack.isEmpty();
}`,
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
   \`\`\``
  },
  {
    id: 'queue-operations',
    title: 'Queue Operations',
    description: 'FIFO data structure: enqueue, dequeue, and circular queue',
    category: 'Stacks & Queues',
    difficulty: 'beginner',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(n)',
    extendedDefinition: `A Queue is a linear data structure that follows the First-In-First-Out (FIFO) principle, where elements are added at one end (rear) and removed from the other end (front). Think of it like a line of people waiting - the first person in line is the first to be served.

**What it does:**
Queues manage data in a sequential order where the oldest element is always processed first, making them essential for fair scheduling and ordered processing systems.

**How it works:**
The queue maintains two key positions:
1. **Front**: Points to the first element to be removed
2. **Rear**: Points to the position where the next element will be added

Core operations include:
- **Enqueue**: Add element to the rear (O(1))
- **Dequeue**: Remove element from the front (O(1))
- **Front/Peek**: View the front element without removing (O(1))
- **isEmpty**: Check if queue is empty (O(1))

**When to use:**
- Process scheduling in operating systems
- Breadth-First Search (BFS) in graphs and trees
- Handling requests in web servers
- Print job management
- Buffer for data streams
- Call center systems
- Breadth-first traversal algorithms

**Implementation variants:**
- **Simple Queue**: Basic array or linked list implementation
- **Circular Queue**: Efficient space utilization using circular buffer
- **Priority Queue**: Elements have priorities, not strictly FIFO
- **Double-ended Queue (Deque)**: Insertion/deletion at both ends`,
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
    extendedDefinition: `A Binary Tree is a hierarchical data structure where each node has at most two children, referred to as the left child and right child. Unlike linear data structures, trees represent hierarchical relationships and enable efficient searching, insertion, and deletion operations.

**What it does:**
Binary trees organize data in a hierarchical structure that enables efficient traversal, searching, and manipulation operations while maintaining parent-child relationships between elements.

**How it works:**
Each node in a binary tree contains:
1. **Data**: The value stored in the node
2. **Left Child**: Pointer to the left subtree
3. **Right Child**: Pointer to the right subtree

Tree traversal methods visit nodes in different orders:
- **Inorder**: Left → Root → Right
- **Preorder**: Root → Left → Right  
- **Postorder**: Left → Right → Root
- **Level-order**: Visit nodes level by level

**When to use:**
- Representing hierarchical data (file systems, organizational charts)
- Expression trees for mathematical expressions
- Decision trees in machine learning
- Huffman coding for data compression
- Syntax trees in compilers
- Game AI for decision making

**Key properties:**
- Maximum nodes at level i: 2^i
- Maximum nodes in tree of height h: 2^(h+1) - 1
- Height ranges from log₂(n) to n-1`,
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
    spaceComplexity: 'O(1)',
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
   \`\`\``
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

**Traversal Order:**
1. Recursively traverse the left subtree
2. Process the current node (visit/print)
3. Recursively traverse the right subtree

**Special Property for BSTs:**
In a Binary Search Tree, inorder traversal visits nodes in ascending sorted order. This property makes inorder traversal essential for:
- Retrieving all elements in sorted order
- Validating if a tree is a valid BST
- Finding kth smallest element
- Range queries in BSTs

**Implementation Approaches:**
1. **Recursive**: Natural and intuitive, uses function call stack
2. **Iterative**: Uses explicit stack, more memory efficient for deep trees
3. **Morris Traversal**: O(1) space complexity using threading technique

**Space Complexity Analysis:**
- **Recursive**: O(h) where h is tree height (due to call stack)
- **Iterative**: O(h) for explicit stack storage
- **Morris**: O(1) space but modifies tree structure temporarily

**Applications:**
- **Database Systems**: Retrieving records in sorted order from B-trees
- **Expression Trees**: Evaluating mathematical expressions
- **Syntax Trees**: Compiler design for parsing expressions
- **File Systems**: Listing directory contents in alphabetical order
- **Data Validation**: Checking BST property maintenance

**Relationship to Other Traversals:**
Inorder is one of three main DFS traversals, each serving different purposes:
- **Preorder**: Good for copying/serializing trees
- **Inorder**: Perfect for sorted data retrieval in BSTs
- **Postorder**: Ideal for deletion and cleanup operations`,
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
    description: 'Create copies of trees and evaluate expressions - process parent before children',
    category: 'Trees',
    difficulty: 'beginner',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)',
    extendedDefinition: `Preorder Traversal is a depth-first tree traversal method that visits nodes in the order: Root → Left subtree → Right subtree. This "parent-first" approach makes it ideal for operations that need to process a node before its children.

**Traversal Order:**
1. Process the current node (visit/print)
2. Recursively traverse the left subtree
3. Recursively traverse the right subtree

**Key Characteristics:**
- **Root-First Processing**: Parent nodes are always processed before their children
- **Top-Down Approach**: Information flows from parent to children
- **Natural Recursion**: Mirrors the recursive structure of trees
- **Prefix Notation**: For expression trees, produces prefix notation

**Why "Preorder"?**
The name comes from processing the root "pre" (before) its subtrees. This ordering is natural for many tree operations where you need to:
- Establish context at parent level
- Pass information down to children
- Make decisions based on parent state

**Implementation Strategies:**
1. **Recursive**: Most intuitive, follows tree structure naturally
2. **Iterative with Stack**: Uses explicit stack, processes right child after left
3. **Morris Traversal**: Constant space using tree threading

**Primary Applications:**
- **Tree Copying**: Create duplicate trees by processing structure top-down
- **Tree Serialization**: Convert tree to string representation for storage/transmission
- **Expression Evaluation**: Process operators before operands in expression trees
- **File System Operations**: Process directories before their contents
- **Syntax Tree Processing**: Compiler design for code generation

**Expression Trees:**
In mathematical expression trees, preorder traversal produces prefix notation (Polish notation):
- Tree: + 3 4 → Preorder: + 3 4
- Useful for stack-based expression evaluation

**Comparison with Other Traversals:**
- **Preorder**: Root → Left → Right (good for copying, serialization)
- **Inorder**: Left → Root → Right (sorted order in BSTs)
- **Postorder**: Left → Right → Root (good for deletion, cleanup)`,
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
   \`\`\``
  },
  {
    id: 'tree-postorder-traversal',
    title: 'Postorder Traversal',
    description: 'Delete trees safely and calculate directory sizes - process children before parent',
    category: 'Trees',
    difficulty: 'beginner',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)',
    extendedDefinition: `Postorder Traversal is a depth-first tree traversal method that visits nodes in the order: Left subtree → Right subtree → Root. This "children-first" approach ensures that all descendants are processed before their parent, making it essential for operations requiring bottom-up computation.

**Traversal Order:**
1. Recursively traverse the left subtree
2. Recursively traverse the right subtree  
3. Process the current node (visit/print)

**Key Principle - Bottom-Up Processing:**
Postorder traversal guarantees that when you process a node, all its descendants have already been processed. This property is crucial for:
- Safe memory deallocation
- Aggregating information from children
- Dependency resolution
- Cleanup operations

**Why "Postorder"?**
The name indicates that the root is processed "post" (after) its subtrees. This ensures complete information about subtrees is available when processing the parent.

**Critical Applications:**
1. **Safe Tree Deletion**: Delete children before parent to avoid memory leaks
2. **Directory Size Calculation**: Calculate folder sizes by summing file sizes bottom-up
3. **Expression Evaluation**: Process operands before operators in expression trees
4. **Dependency Resolution**: Process dependencies before dependent items
5. **Tree Height Calculation**: Compute height based on children's heights

**Implementation Challenges:**
Postorder is the most complex traversal to implement iteratively because:
- Need to track whether children have been processed
- Requires additional state management
- Common approaches use two stacks or modified single stack

**Expression Trees:**
In mathematical expression trees, postorder produces postfix notation (Reverse Polish Notation):
- Tree: + 3 4 → Postorder: 3 4 +
- Ideal for stack-based calculators

**Memory Management:**
Postorder is the standard pattern for destructors and garbage collection:
- Process all child objects first
- Then safely deallocate parent object
- Prevents dangling pointers and memory corruption

**Real-World Examples:**
- **File System**: Calculate directory sizes recursively
- **Compiler Design**: Generate code for expression evaluation
- **Database Systems**: Process query execution plans bottom-up
- **Operating Systems**: Process termination and resource cleanup`,
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
   \`\`\``
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
    spaceComplexity: 'O(V)',
    extendedDefinition: `Breadth-First Search (BFS) is a fundamental graph traversal algorithm that explores vertices level by level, visiting all vertices at distance k before visiting any vertex at distance k+1 from the starting vertex. It uses a queue data structure to maintain the order of exploration.

**Core Principle:**
BFS explores the graph in "waves" or "levels," ensuring that all vertices at the current level are visited before moving to the next level. This systematic approach guarantees finding the shortest path in unweighted graphs.

**Algorithm Steps:**
1. Start with a source vertex and mark it as visited
2. Add the source to a queue
3. While queue is not empty:
   - Dequeue a vertex
   - Process the vertex
   - Add all unvisited neighbors to the queue and mark them as visited

**Key Properties:**
- **Level-by-Level Exploration**: Visits vertices in order of their distance from source
- **Shortest Path**: In unweighted graphs, BFS finds shortest paths
- **Complete**: Will find a solution if one exists
- **Optimal**: For unweighted graphs, finds minimum number of edges

**Data Structures Used:**
- **Queue**: FIFO structure for maintaining exploration order
- **Visited Array/Set**: Track which vertices have been explored
- **Parent Array**: Optional, for path reconstruction

**Applications:**
1. **Shortest Path**: Find minimum steps in unweighted graphs
2. **Level-Order Traversal**: Process nodes level by level in trees
3. **Connected Components**: Find all vertices reachable from a source
4. **Bipartite Graph Testing**: Check if graph can be colored with two colors
5. **Social Networks**: Find degrees of separation between people
6. **Web Crawling**: Systematically explore web pages
7. **Puzzle Solving**: Find minimum moves in games like sliding puzzles

**Comparison with DFS:**
- **BFS**: Uses queue, finds shortest paths, explores breadth-wise
- **DFS**: Uses stack/recursion, explores depth-wise, uses less memory for sparse graphs

**Time and Space Analysis:**
- **Time**: O(V + E) where V is vertices and E is edges
- **Space**: O(V) for queue and visited tracking in worst case`,
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
    extendedDefinition: `Dijkstra's Algorithm is a greedy algorithm that finds the shortest path from a source vertex to all other vertices in a weighted graph with non-negative edge weights. It maintains a set of vertices whose shortest distance from the source is known and gradually expands this set.

**What it does:**
Dijkstra's algorithm computes the shortest path tree from a single source vertex to all other reachable vertices in a weighted graph, guaranteeing optimal solutions when all edge weights are non-negative.

**How it works:**
1. Initialize distances to all vertices as infinity, except source (distance 0)
2. Create a priority queue with all vertices, prioritized by distance
3. While priority queue is not empty:
   - Extract vertex with minimum distance
   - For each neighbor, calculate new distance through current vertex
   - If new distance is shorter, update distance and predecessor
4. Continue until all vertices are processed

**When to use:**
- Finding shortest paths in road networks and GPS navigation
- Network routing protocols (OSPF, IS-IS)
- Social network analysis (degrees of separation)
- Game AI pathfinding with weighted terrain
- Resource allocation and optimization problems
- Flight connection planning with costs

**Key characteristics:**
- Greedy approach: Always selects closest unvisited vertex
- Optimal for non-negative weights: Guarantees shortest paths
- Single-source: Finds paths from one source to all destinations
- Uses priority queue for efficient minimum extraction`
  },
  {
    id: 'floyd-warshall',
    title: 'Floyd-Warshall Algorithm',
    description: 'All-pairs shortest path algorithm using dynamic programming',
    category: 'Graphs',
    difficulty: 'advanced',
    timeComplexity: 'O(V³)',
    spaceComplexity: 'O(V²)',
    extendedDefinition: `Floyd-Warshall Algorithm is a dynamic programming algorithm that finds the shortest paths between all pairs of vertices in a weighted graph. It can handle negative edge weights but not negative cycles, making it more versatile than Dijkstra's algorithm for certain scenarios.

**What it does:**
Floyd-Warshall computes the shortest path distances between every pair of vertices in a graph, creating a complete distance matrix that shows the minimum cost to travel from any vertex to any other vertex.

**How it works:**
1. Initialize a distance matrix with direct edge weights and infinity for non-adjacent vertices
2. Set diagonal elements to 0 (distance from vertex to itself)
3. For each intermediate vertex k, update distances using the recurrence:
   - If distance[i][j] > distance[i][k] + distance[k][j], update distance[i][j]
4. Repeat for all vertices as intermediate points
5. The final matrix contains shortest distances between all pairs

**When to use:**
- Finding shortest paths between all pairs of vertices
- Dense graphs where many shortest paths are needed
- Graphs with negative edge weights (but no negative cycles)
- Transitive closure problems
- Network analysis requiring complete connectivity information
- Small to medium-sized graphs (due to O(V³) complexity)

**Key characteristics:**
- All-pairs shortest path: Computes distances between every vertex pair
- Handles negative weights: Unlike Dijkstra's, works with negative edges
- Dynamic programming: Uses optimal substructure principle
- Dense output: Produces complete V×V distance matrix`
  },
  {
    id: 'kruskal-algorithm',
    title: 'Kruskal\'s Algorithm',
    description: 'Build MST by adding cheapest edges that don\'t create cycles - edge-focused approach',
    category: 'Graphs',
    difficulty: 'intermediate',
    timeComplexity: 'O(E log E)',
    spaceComplexity: 'O(V)',
    extendedDefinition: `Kruskal's Algorithm is a greedy algorithm that finds the Minimum Spanning Tree (MST) of a connected, undirected graph by selecting edges in order of increasing weight while avoiding cycles. It uses a disjoint-set (union-find) data structure to efficiently detect cycles.

**What it does:**
Kruskal's algorithm builds an MST by examining edges in ascending order of weight and adding them to the spanning tree if they don't create a cycle, resulting in a tree that connects all vertices with minimum total weight.

**How it works:**
1. Sort all edges in the graph by weight in ascending order
2. Initialize each vertex as its own disjoint set
3. For each edge in sorted order:
   - Check if the edge connects vertices in different sets (no cycle)
   - If yes, add the edge to MST and union the sets
   - If no, skip the edge (would create cycle)
4. Continue until MST has V-1 edges

**When to use:**
- Network design (connecting cities with minimum cable cost)
- Circuit design and VLSI layout optimization
- Clustering algorithms in machine learning
- Image segmentation and computer vision
- Transportation network optimization
- Sparse graphs where edge-focused approach is efficient

**Key characteristics:**
- Edge-focused: Processes edges rather than vertices
- Greedy approach: Always selects minimum weight available edge
- Cycle detection: Uses union-find for efficient cycle checking
- Optimal: Guarantees minimum spanning tree
- Works well on sparse graphs due to edge sorting`
  },
  {
    id: 'prim-algorithm',
    title: 'Prim\'s Algorithm',
    description: 'Grow MST from starting vertex by adding minimum weight edges - vertex-focused approach',
    category: 'Graphs',
    difficulty: 'intermediate',
    timeComplexity: 'O(E log V)',
    spaceComplexity: 'O(V)',
    extendedDefinition: `Prim's Algorithm is a greedy algorithm that finds the Minimum Spanning Tree (MST) of a connected, undirected graph by growing the tree one vertex at a time. It starts from an arbitrary vertex and repeatedly adds the minimum weight edge that connects the current tree to a new vertex.

**What it does:**
Prim's algorithm builds an MST by maintaining a growing tree and always adding the cheapest edge that expands the tree to include a new vertex, ensuring the result has minimum total weight.

**How it works:**
1. Start with an arbitrary vertex and add it to the MST
2. Create a priority queue of all edges from vertices in MST to vertices not in MST
3. While there are vertices not in MST:
   - Extract the minimum weight edge from the priority queue
   - Add the new vertex to MST
   - Update priority queue with edges from the new vertex
4. Continue until all vertices are included

**When to use:**
- Dense graphs where vertex-focused approach is more efficient
- When you need to build MST incrementally
- Real-time applications requiring progressive tree construction
- Network design with incremental expansion
- When memory usage for edge storage is a concern
- Situations where starting vertex is predetermined

**Key characteristics:**
- Vertex-focused: Grows tree by adding vertices one at a time
- Greedy approach: Always selects minimum weight edge to new vertex
- Uses priority queue: Efficiently finds minimum weight edges
- Optimal: Guarantees minimum spanning tree
- Better for dense graphs: Avoids sorting all edges like Kruskal's`
  },
  {
    id: 'topological-sort',
    title: 'Topological Sort',
    description: 'Linear ordering of vertices in directed acyclic graph',
    category: 'Graphs',
    difficulty: 'intermediate',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    extendedDefinition: `Topological Sort is a linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge (u, v), vertex u comes before vertex v in the ordering. It's only possible for DAGs and has applications in scheduling and dependency resolution.

**What it does:**
Topological sort produces a sequence of vertices where all dependencies are satisfied - if there's an edge from A to B, then A appears before B in the sorted order.

**How it works:**
Two main approaches:
1. **DFS-based**: Use depth-first search and add vertices to result in reverse order of finishing times
2. **Kahn's Algorithm**: Repeatedly remove vertices with no incoming edges and add them to result

**When to use:**
- Task scheduling with dependencies (project management)
- Course prerequisite ordering in academic planning
- Build systems and dependency resolution
- Compiler design for symbol resolution
- Package manager dependency installation
- Makefile execution order

**Key characteristics:**
- Only works on DAGs: Cyclic graphs have no topological ordering
- Multiple valid orderings: Most DAGs have several correct topological sorts
- Dependency satisfaction: Ensures all prerequisites are met
- Linear time complexity: Efficient O(V + E) algorithms available`
  },

  // Sorting
  {
    id: 'bubble-sort',
    title: 'Bubble Sort',
    description: 'Simple comparison-based sorting with adjacent element swapping',
    category: 'Sorting',
    difficulty: 'beginner',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    extendedDefinition: `Bubble Sort is one of the simplest sorting algorithms that works by repeatedly stepping through the list, comparing adjacent elements and swapping them if they're in the wrong order. The algorithm gets its name because smaller elements "bubble" to the beginning of the list, just like air bubbles rising to the surface of water.

**Algorithm Mechanism:**
The algorithm makes multiple passes through the array. In each pass, it compares adjacent elements and swaps them if they're out of order. After each complete pass, the largest unsorted element "bubbles up" to its correct position at the end.

**Key Characteristics:**
- **In-Place**: Sorts the array without requiring additional storage space
- **Stable**: Maintains relative order of equal elements
- **Comparison-Based**: Uses element comparisons to determine order
- **Adaptive**: Can be optimized to detect if array becomes sorted early

**Pass-by-Pass Behavior:**
- **Pass 1**: Largest element moves to the last position
- **Pass 2**: Second largest element moves to second-to-last position
- **Pass k**: kth largest element moves to its correct position
- **Optimization**: After k passes, last k elements are sorted

**Performance Analysis:**
- **Best Case**: O(n) when array is already sorted (with optimization)
- **Average Case**: O(n²) for random data
- **Worst Case**: O(n²) when array is reverse sorted
- **Space**: O(1) constant extra space

**Optimizations:**
1. **Early Termination**: Stop if no swaps occur in a pass
2. **Reduced Range**: Don't check already sorted elements
3. **Cocktail Sort**: Bidirectional bubble sort

**Educational Value:**
Bubble sort is primarily used for teaching because it:
- Demonstrates basic sorting concepts
- Shows algorithm analysis principles
- Illustrates optimization techniques
- Provides foundation for understanding more complex algorithms

**Practical Limitations:**
- Too slow for large datasets
- Poor performance compared to modern algorithms
- Rarely used in production systems
- Mainly of historical and educational interest`,
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
   \`\`\``
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
    spaceComplexity: 'O(1)',
    extendedDefinition: `Heap Sort is an efficient comparison-based sorting algorithm that uses the binary heap data structure. It combines the best features of merge sort (guaranteed O(n log n) performance) and insertion sort (in-place sorting), making it a reliable choice for systems where consistent performance is crucial.

**Algorithm Overview:**
Heap Sort works in two main phases:
1. **Build Max Heap**: Transform the input array into a max heap structure
2. **Extract Elements**: Repeatedly remove the maximum element and restore heap property

**Heap Data Structure:**
A binary heap is a complete binary tree where:
- **Max Heap**: Parent nodes are greater than or equal to their children
- **Array Representation**: For element at index i, left child is at 2i+1, right child at 2i+2
- **Heap Property**: Maintained through heapify operations

**Detailed Process:**
1. **Heapify**: Convert array to max heap (O(n) time)
2. **Sort**: Repeatedly swap root with last element, reduce heap size, and re-heapify (O(n log n))

**Key Properties:**
- **In-Place**: Sorts within the original array, O(1) extra space
- **Not Stable**: May change relative order of equal elements
- **Consistent Performance**: Always O(n log n), regardless of input distribution
- **No Worst Case Degradation**: Unlike quicksort, performance is predictable

**Heapify Operation:**
The core operation that maintains heap property by comparing a node with its children and swapping if necessary, then recursively applying to affected subtree.

**Applications:**
- **Operating Systems**: Process scheduling with priority queues
- **Embedded Systems**: Where memory is limited but consistent performance needed
- **Real-Time Systems**: Predictable O(n log n) performance
- **Database Systems**: External sorting when memory is constrained

**Comparison with Other Sorts:**
- **vs Merge Sort**: Same time complexity but O(1) space instead of O(n)
- **vs Quick Sort**: More predictable performance, no worst-case O(n²)
- **vs Insertion Sort**: Much better for large datasets, but more complex

**Advantages:**
- Guaranteed O(n log n) performance
- In-place sorting
- No recursion depth issues
- Good cache performance for heap operations`,
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
   \`\`\``
  },
  {
    id: 'insertion-sort',
    title: 'Insertion Sort',
    description: 'Build sorted array one element at a time - efficient for small or nearly sorted data',
    category: 'Sorting',
    difficulty: 'beginner',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    extendedDefinition: `Insertion Sort is a simple and intuitive sorting algorithm that builds the final sorted array one element at a time. It works by taking elements from the unsorted portion and inserting them into their correct position in the sorted portion, similar to how you might sort playing cards in your hand.

**What it does:**
Insertion sort maintains a sorted portion at the beginning of the array and gradually expands it by inserting each unsorted element into its correct position within the sorted portion.

**How it works:**
1. Start with the second element (first element is considered sorted)
2. Compare the current element with elements in the sorted portion
3. Shift larger elements one position to the right
4. Insert the current element at its correct position
5. Repeat until all elements are processed

**When to use:**
- Small datasets (typically n < 50)
- Nearly sorted or partially sorted data
- Online algorithms (sorting data as it arrives)
- As a subroutine in hybrid algorithms like Timsort
- When simplicity and low overhead are important
- Educational purposes to understand sorting concepts

**Key advantages:**
- Adaptive: O(n) performance on nearly sorted data
- Stable: Maintains relative order of equal elements
- In-place: Requires only O(1) extra memory
- Online: Can sort data as it's received
- Simple implementation with low overhead`,
  },
  {
    id: 'selection-sort',
    title: 'Selection Sort',
    description: 'Find minimum element and swap to correct position - minimizes number of swaps',
    category: 'Sorting',
    difficulty: 'beginner',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    extendedDefinition: `Selection Sort is a simple comparison-based sorting algorithm that works by repeatedly finding the minimum element from the unsorted portion and placing it at the beginning. It divides the array into sorted and unsorted regions, progressively expanding the sorted region.

**What it does:**
Selection sort systematically selects the smallest (or largest) element from the unsorted portion and swaps it with the first element of the unsorted portion, gradually building a sorted array from left to right.

**How it works:**
1. Find the minimum element in the entire array
2. Swap it with the first element
3. Find the minimum element in the remaining unsorted portion
4. Swap it with the second element
5. Repeat until the entire array is sorted

**When to use:**
- Educational purposes to understand sorting concepts
- Small datasets where simplicity is preferred
- When memory writes are expensive (minimizes swaps)
- Situations where you need to minimize the number of swaps
- When auxiliary memory is limited
- Simple embedded systems with basic requirements

**Key characteristics:**
- Always performs exactly n-1 swaps (minimum possible)
- Not adaptive: O(n²) even for sorted arrays
- Not stable: May change relative order of equal elements
- In-place: Requires only O(1) extra memory
- Simple implementation with predictable behavior`
  },
  {
    id: 'counting-sort',
    title: 'Counting Sort',
    description: 'Non-comparison integer sorting using counting array',
    category: 'Sorting',
    difficulty: 'intermediate',
    timeComplexity: 'O(n + k)',
    spaceComplexity: 'O(k)',
    extendedDefinition: `Counting Sort is a non-comparison based sorting algorithm that works by counting the occurrences of each distinct element in the input array. It's particularly efficient for sorting integers when the range of possible values (k) is not significantly larger than the number of elements (n).

**What it does:**
Counting sort creates a frequency array to count occurrences of each value, then uses these counts to determine the exact position of each element in the sorted output array.

**How it works:**
1. Find the range of input values (minimum and maximum)
2. Create a counting array to store frequency of each value
3. Count occurrences of each element in the input array
4. Transform counting array to store actual positions
5. Build the output array using the position information
6. Copy the sorted elements back to the original array

**When to use:**
- Sorting integers with a small, known range
- When the range of values (k) is O(n) or smaller
- Stable sorting is required
- Non-comparison based sorting is preferred
- Sorting characters or small enumerated values
- As a subroutine in radix sort

**Key advantages:**
- Linear time complexity O(n + k) when k = O(n)
- Stable sorting algorithm
- Predictable performance regardless of input distribution
- No comparisons needed between elements`
  },
  {
    id: 'radix-sort',
    title: 'Radix Sort',
    description: 'Non-comparison sorting by processing digits',
    category: 'Sorting',
    difficulty: 'intermediate',
    timeComplexity: 'O(d × (n + k))',
    spaceComplexity: 'O(n + k)',
    extendedDefinition: `Radix Sort is a non-comparison based sorting algorithm that sorts integers by processing individual digits. It sorts numbers digit by digit, starting from the least significant digit (LSD) or most significant digit (MSD), using a stable sorting algorithm like counting sort as a subroutine.

**What it does:**
Radix sort processes numbers digit by digit, sorting the entire array based on each digit position, building up to a fully sorted array without ever comparing complete numbers directly.

**How it works:**
1. Find the maximum number to determine the number of digits (d)
2. For each digit position (from rightmost to leftmost in LSD):
   - Extract the digit at current position for each number
   - Use counting sort to sort based on this digit
   - Maintain stability to preserve previous sorting
3. After processing all digits, the array is completely sorted

**When to use:**
- Sorting large arrays of integers
- When the number of digits (d) is small relative to array size
- Fixed-width integer keys (like IDs, zip codes)
- Sorting strings of equal length
- When comparison-based sorting is too slow
- Parallel processing scenarios (digits can be processed independently)

**Key characteristics:**
- Non-comparison based: Never compares complete numbers
- Stable: Maintains relative order of equal elements
- Linear time when d is constant: O(n) effective performance
- Requires extra space for counting sort subroutine
- Works best with fixed-width data`
  },
  {
    id: 'bucket-sort',
    title: 'Bucket Sort',
    description: 'Distribute elements into buckets, sort individually, then concatenate - great for uniform data',
    category: 'Sorting',
    difficulty: 'intermediate',
    timeComplexity: 'O(n + k)',
    spaceComplexity: 'O(n + k)',
    extendedDefinition: `Bucket Sort is a distribution-based sorting algorithm that divides the input array into a number of buckets, sorts each bucket individually (usually with another sorting algorithm), and then concatenates the sorted buckets to produce the final sorted array.

**What it does:**
Bucket sort distributes elements into multiple buckets based on their values, sorts each bucket separately, and then combines them in order to achieve a sorted array. It's most effective when input is uniformly distributed.

**How it works:**
1. Create an array of empty buckets
2. Distribute input elements into buckets based on a mapping function
3. Sort each individual bucket (using insertion sort, quicksort, etc.)
4. Concatenate all sorted buckets in order to get the final result

**When to use:**
- Data is uniformly distributed across a known range
- Floating-point numbers between 0 and 1
- When you want to achieve linear average-case performance
- Large datasets where distribution can be predicted
- Parallel processing environments (buckets can be sorted independently)
- When input range is known and reasonable

**Key advantages:**
- Average-case time complexity of O(n + k) when data is uniformly distributed
- Can achieve linear time performance with good distribution
- Naturally parallelizable (each bucket can be processed independently)
- Stable when using stable sorting for individual buckets
- Adaptive to input distribution patterns`
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
    spaceComplexity: 'O(1)',
    example: `// Interpolation Search Implementation
function interpolationSearch(arr, target) {
    let low = 0, high = arr.length - 1;
    
    while (low <= high && target >= arr[low] && target <= arr[high]) {
        // If array has only one element
        if (low === high) {
            return arr[low] === target ? low : -1;
        }
        
        // Calculate position using interpolation formula
        const pos = low + Math.floor(
            ((target - arr[low]) * (high - low)) / (arr[high] - arr[low])
        );
        
        if (arr[pos] === target) {
            return pos;
        }
        
        if (arr[pos] < target) {
            low = pos + 1;
        } else {
            high = pos - 1;
        }
    }
    
    return -1;
}

// Comparison with Binary Search
function binarySearch(arr, target) {
    let low = 0, high = arr.length - 1;
    
    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        
        if (arr[mid] === target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    
    return -1;
}

// Example usage
const uniformData = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
console.log(interpolationSearch(uniformData, 70)); // Output: 6
console.log(binarySearch(uniformData, 70));        // Output: 6

// Interpolation search works better with uniform distribution
const nonUniform = [1, 2, 3, 100, 200, 300, 400, 500];
console.log("Non-uniform data - both algorithms work but interpolation may not be optimal");`,
    syntax: `**Interpolation Search Patterns:**

1. **Basic Interpolation Search:**
   \`\`\`javascript
   function interpolationSearch(arr, target) {
       let low = 0, high = arr.length - 1;
       
       while (low <= high && target >= arr[low] && target <= arr[high]) {
           if (low === high) return arr[low] === target ? low : -1;
           
           const pos = low + Math.floor(
               ((target - arr[low]) * (high - low)) / (arr[high] - arr[low])
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
   \`\`\`
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
    extendedDefinition: `A Hash Table (also called Hash Map) is a data structure that implements an associative array, mapping keys to values using a hash function. It provides extremely fast average-case performance for insertion, deletion, and lookup operations.

**What it does:**
Hash tables store key-value pairs and use a hash function to compute an index where the value should be stored or retrieved, enabling near-constant time access to data.

**How it works:**
1. **Hash Function**: Converts keys into array indices using mathematical operations
2. **Storage**: Values are stored in an array at the computed index
3. **Collision Handling**: When multiple keys hash to the same index, collision resolution techniques are used
4. **Dynamic Resizing**: Table size may be adjusted to maintain good performance

**When to use:**
- Implementing dictionaries, maps, and caches
- Database indexing and fast lookups
- Counting frequencies of elements
- Memoization in dynamic programming
- Symbol tables in compilers
- Implementing sets and associative arrays

**Key characteristics:**
- Average O(1) time complexity for basic operations
- Space-time tradeoff: uses more memory for faster access
- Performance depends on hash function quality and load factor
- Requires handling of hash collisions`,
    example: `// Hash Table Implementation
class HashTable {
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
const ht = new HashTable();
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
  },
  {
    id: 'hash-chaining',
    title: 'Separate Chaining',
    description: 'Handle hash collisions by storing multiple values in linked lists at each slot',
    category: 'Hashing',
    difficulty: 'intermediate',
    timeComplexity: 'O(1) avg',
    spaceComplexity: 'O(n)',
    extendedDefinition: `Separate Chaining is a collision resolution technique in hash tables where each slot in the hash table contains a linked list (or chain) of all elements that hash to the same index. This approach handles collisions by allowing multiple key-value pairs to coexist at the same hash table position.

**What it does:**
Separate chaining resolves hash collisions by maintaining a list of all elements that map to the same hash table index, allowing multiple items to be stored at each position without overwriting existing data.

**How it works:**
1. **Hash Function**: Compute the hash index for a key
2. **Chain Access**: Access the linked list at that index
3. **Insert**: Add new key-value pairs to the end of the chain
4. **Search**: Traverse the chain to find the desired key
5. **Delete**: Remove the key-value pair from the chain

**When to use:**
- When the hash table size is smaller than the number of expected elements
- When memory usage for pointers is not a major concern
- When you want simple and straightforward collision handling
- When the load factor might exceed 1.0
- When deletions are frequent (easier than open addressing)

**Key characteristics:**
- Load factor can exceed 1.0: More elements than table slots
- Simple implementation: Easy to understand and implement
- Dynamic memory usage: Chains grow as needed
- Cache performance: May have poor cache locality due to pointer chasing`
  },
  {
    id: 'open-addressing',
    title: 'Open Addressing',
    description: 'Resolve collisions by finding alternative slots using linear, quadratic, or double hashing',
    category: 'Hashing',
    difficulty: 'intermediate',
    timeComplexity: 'O(1) avg',
    spaceComplexity: 'O(n)',
    extendedDefinition: `Open Addressing is a collision resolution technique where all elements are stored directly in the hash table array. When a collision occurs, the algorithm probes for the next available slot using a systematic sequence until an empty position is found.

**What it does:**
Open addressing handles hash collisions by finding alternative positions within the same hash table array, ensuring each element has its own unique slot without using additional data structures.

**How it works:**
Three main probing strategies:
1. **Linear Probing**: Check consecutive slots (h+1, h+2, h+3, ...)
2. **Quadratic Probing**: Check slots at quadratic intervals (h+1², h+2², h+3², ...)
3. **Double Hashing**: Use a second hash function to determine probe sequence

**When to use:**
- When memory usage needs to be minimized (no extra pointers)
- When cache performance is important (better locality)
- When the load factor is kept below 0.7-0.8
- When you want to avoid dynamic memory allocation
- In embedded systems with limited memory

**Key characteristics:**
- No extra memory: All data stored in the main array
- Better cache performance: Sequential memory access
- Load factor limitation: Performance degrades significantly above 70-80%
- Deletion complexity: Requires special handling (tombstones)`
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
    extendedDefinition: `Recursion is a programming technique where a function calls itself to solve smaller instances of the same problem. It's a powerful paradigm that mirrors mathematical induction and provides elegant solutions to problems that have recursive structure.

**What it does:**
Recursion breaks down complex problems into simpler, similar subproblems, solving them by combining solutions from smaller cases until reaching a base case that can be solved directly.

**How it works:**
Every recursive function has two essential components:
1. **Base Case**: A condition that stops the recursion (prevents infinite calls)
2. **Recursive Case**: The function calls itself with modified parameters, moving toward the base case

**When to use:**
- Tree and graph traversals (DFS, tree operations)
- Mathematical computations (factorial, Fibonacci, power)
- Divide and conquer algorithms (merge sort, quick sort)
- Backtracking problems (N-Queens, maze solving)
- Problems with recursive structure (nested data, fractals)

**Key characteristics:**
- Stack-based execution: Each call creates a new stack frame
- Space complexity: O(n) for call stack in most cases
- Elegant and intuitive: Often mirrors the problem's natural structure
- Performance consideration: May have overhead compared to iterative solutions`,
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
   \`\`\`javascript
   function recursiveFunction(parameters) {
       // Base case - stops recursion
       if (baseCondition) {
           return baseValue;
       }
       
       // Recursive case - function calls itself
       return someOperation(recursiveFunction(modifiedParameters));
   }
   \`\`\`

2. **Multiple Base Cases:**
   \`\`\`javascript
   function fibonacci(n) {
       if (n <= 0) return 0;  // Base case 1
       if (n === 1) return 1; // Base case 2
       return fibonacci(n - 1) + fibonacci(n - 2); // Recursive case
   }
   \`\`\`

3. **Helper Function Pattern:**
   \`\`\`javascript
   function mainFunction(input) {
       function helper(modifiedInput, accumulator) {
           if (baseCase) return accumulator;
           return helper(nextInput, updatedAccumulator);
       }
       return helper(input, initialValue);
   }
   \`\`\``
  },
  {
    id: 'tail-recursion',
    title: 'Tail Recursion',
    description: 'Optimized recursion where recursive call is the last operation',
    category: 'Recursion',
    difficulty: 'intermediate',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    extendedDefinition: `Tail Recursion is a special form of recursion where the recursive call is the last operation performed in the function. This optimization allows compilers and interpreters to reuse the current function's stack frame instead of creating new ones, effectively converting recursion into iteration.

**What it does:**
Tail recursion eliminates the risk of stack overflow by reusing stack frames, making recursive algorithms as memory-efficient as their iterative counterparts while maintaining the elegance of recursive thinking.

**How it works:**
1. **Last Operation**: The recursive call must be the final operation
2. **No Pending Operations**: No computations happen after the recursive call returns
3. **Stack Frame Reuse**: The compiler can optimize by reusing the current stack frame
4. **Accumulator Pattern**: Often uses accumulator parameters to carry intermediate results

**When to use:**
- When recursion depth could be very large
- In functional programming languages with tail call optimization
- When you want recursive elegance without stack overflow risk
- For algorithms that naturally fit the accumulator pattern
- In embedded systems with limited stack space

**Key characteristics:**
- Constant space complexity: O(1) instead of O(n)
- Compiler optimization: Can be converted to loops automatically
- Accumulator pattern: Uses helper parameters to maintain state
- Last operation requirement: Recursive call must be the final statement`
  },
  {
    id: 'fibonacci',
    title: 'Fibonacci Sequence',
    description: 'Classic recursive problem with optimization techniques',
    category: 'Recursion',
    difficulty: 'beginner',
    timeComplexity: 'O(2^n)',
    spaceComplexity: 'O(n)',
    extendedDefinition: `The Fibonacci Sequence is a classic recursive problem where each number is the sum of the two preceding ones (0, 1, 1, 2, 3, 5, 8, 13, ...). It demonstrates the power and pitfalls of naive recursion and serves as an excellent example for learning optimization techniques.

**What it does:**
Fibonacci generates a sequence where F(n) = F(n-1) + F(n-2), with base cases F(0) = 0 and F(1) = 1, creating a mathematical sequence that appears frequently in nature and computer science.

**How it works:**
Multiple implementation approaches:
1. **Naive Recursion**: Direct translation of mathematical definition (exponential time)
2. **Memoization**: Cache results to avoid recomputation (linear time)
3. **Bottom-up DP**: Build solution iteratively (linear time, constant space)
4. **Matrix Exponentiation**: Advanced technique for very large n (logarithmic time)

**When to use:**
- Learning recursion and dynamic programming concepts
- Understanding optimization techniques (memoization, tabulation)
- Mathematical computations involving Fibonacci numbers
- Algorithm analysis and complexity comparison
- Teaching exponential vs polynomial time complexity

**Key characteristics:**
- Overlapping subproblems: Same calculations repeated multiple times
- Optimal substructure: Solution built from optimal solutions of subproblems
- Exponential naive complexity: O(2^n) without optimization
- Linear optimized complexity: O(n) with memoization or DP`
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
    example: `// Dynamic Programming Introduction

// 1. Fibonacci - Naive vs DP approach
// Naive recursion - O(2^n)
function fibonacciNaive(n) {
    if (n <= 1) return n;
    return fibonacciNaive(n - 1) + fibonacciNaive(n - 2);
}

// DP with memoization - O(n)
function fibonacciMemo(n, memo = {}) {
    if (n in memo) return memo[n];
    if (n <= 1) return n;
    
    memo[n] = fibonacciMemo(n - 1, memo) + fibonacciMemo(n - 2, memo);
    return memo[n];
}

// DP with tabulation - O(n)
function fibonacciTab(n) {
    if (n <= 1) return n;
    
    const dp = [0, 1];
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}

// Space optimized DP - O(1) space
function fibonacciOptimized(n) {
    if (n <= 1) return n;
    
    let prev2 = 0, prev1 = 1;
    for (let i = 2; i <= n; i++) {
        const current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }
    return prev1;
}

// 2. Climbing Stairs - DP example
function climbStairs(n) {
    if (n <= 2) return n;
    
    const dp = [0, 1, 2];
    for (let i = 3; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}

// Example usage
console.log(fibonacciNaive(10));     // 55 (slow)
console.log(fibonacciMemo(10));      // 55 (fast)
console.log(fibonacciTab(10));       // 55 (fast)
console.log(fibonacciOptimized(10)); // 55 (fastest)
console.log(climbStairs(5));         // 8`,
    syntax: `**Dynamic Programming Patterns:**

1. **Memoization (Top-Down):**
   \`\`\`javascript
   function dpMemo(n, memo = {}) {
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
   \`\`\``
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
    spaceComplexity: 'O(ALPHABET_SIZE × n × m)',
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

// Example: [0,0,1,1,1,2,2,3,3,4] → [0,1,2,3,4,...], length=5`,
    syntax: `function removeDuplicates(nums) {
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
    spaceComplexity: 'O(1)',
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
   \`\`\``
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
  },
  
  // Recursion
  {
    id: 'recursion',
    title: 'Recursion',
    description: 'Master self-referential problem-solving technique',
    category: 'Algorithm Paradigms',
    difficulty: 'intermediate',
    timeComplexity: 'Varies',
    spaceComplexity: 'O(n) stack space',
    extendedDefinition: `Recursion is a programming technique where a function calls itself to solve a problem by breaking it down into smaller instances of the same problem. It's a powerful approach for solving problems with a naturally recursive structure.

**Key Components:**
- **Base Case**: The condition that stops the recursion
- **Recursive Case**: The part where the function calls itself
- **Call Stack**: Memory structure that tracks function calls

**Types of Recursion:**
- **Direct Recursion**: Function calls itself directly
- **Indirect Recursion**: Function A calls function B, which calls function A
- **Tail Recursion**: Recursive call is the last operation in the function
- **Multiple Recursion**: Function makes multiple recursive calls (e.g., Fibonacci)

**Common Recursive Problems:**
- Factorial calculation
- Fibonacci sequence
- Tree traversals
- Divide and conquer algorithms
- Backtracking problems

**Advantages:**
- Elegant and intuitive solutions for certain problems
- Naturally models recursive structures (trees, graphs)

**Disadvantages:**
- Stack overflow for deep recursion
- Often less efficient than iterative solutions
- Higher memory usage due to call stack`,
    example: `// Factorial using recursion
function factorial(n) {
  // Base case
  if (n === 0 || n === 1) {
    return 1;
  }
  
  // Recursive case
  return n * factorial(n - 1);
}

// Binary tree traversal using recursion
class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

function inorderTraversal(root) {
  const result = [];
  
  function traverse(node) {
    if (node === null) return;
    
    // Recursively traverse left subtree
    traverse(node.left);
    
    // Process current node
    result.push(node.val);
    
    // Recursively traverse right subtree
    traverse(node.right);
  }
  
  traverse(root);
  return result;
}

// Usage
console.log(factorial(5)); // 120

const root = new TreeNode(1);
root.left = new TreeNode(2);
root.right = new TreeNode(3);
root.left.left = new TreeNode(4);
root.left.right = new TreeNode(5);
console.log(inorderTraversal(root)); // [4, 2, 5, 1, 3]`,
    syntax: `// Recursive Function Template
function recursiveFunction(params) {
  // Base case(s)
  if (/* termination condition */) {
    return /* base value */;
  }
  
  // Process current step
  // ...
  
  // Recursive case - call with modified parameters
  return /* combine results with */ recursiveFunction(/* smaller problem */);
}

// Helper Function Pattern (for cleaner public API)
function publicFunction(params) {
  // Initialize result storage if needed
  const result = [];
  
  // Define recursive helper
  function helper(currentParams) {
    // Base case
    if (/* termination condition */) {
      return;
    }
    
    // Process current state
    // ...
    
    // Recursive calls
    helper(/* modified params 1 */);
    helper(/* modified params 2 */);
  }
  
  // Start recursion
  helper(/* initial state */);
  
  // Return result
  return result;
}`
  }
];