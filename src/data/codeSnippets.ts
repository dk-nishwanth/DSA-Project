export interface CodeSnippet {
  language: 'javascript' | 'python';
  code: string;
  description?: string;
  pseudocode?: string;
  keyConcepts?: string[];
  complexityAnalysis?: {
    time: string;
    space: string;
    bestCase?: string;
    worstCase?: string;
    averageCase?: string;
  };
}

export const codeSnippets: Record<string, CodeSnippet> = {
  'array-basics': {
    language: 'javascript',
    code: `// Array Fundamentals - Complete Implementation
class ArrayOperations {
  constructor() {
    this.array = [];
  }

  // Access element by index - O(1)
  access(index) {
    if (index < 0 || index >= this.array.length) {
      throw new Error('Index out of bounds');
    }
    return this.array[index];
  }

  // Insert at end - O(1) amortized
  insertAtEnd(element) {
    this.array.push(element);
    return this.array.length;
  }

  // Insert at beginning - O(n)
  insertAtBeginning(element) {
    this.array.unshift(element);
    return this.array.length;
  }

  // Insert at specific index - O(n)
  insertAtIndex(index, element) {
    if (index < 0 || index > this.array.length) {
      throw new Error('Invalid index');
    }
    this.array.splice(index, 0, element);
    return this.array.length;
  }

  // Delete from end - O(1)
  deleteFromEnd() {
    if (this.array.length === 0) {
      throw new Error('Array is empty');
    }
    return this.array.pop();
  }

  // Delete from beginning - O(n)
  deleteFromBeginning() {
    if (this.array.length === 0) {
      throw new Error('Array is empty');
    }
    return this.array.shift();
  }

  // Delete from specific index - O(n)
  deleteAtIndex(index) {
    if (index < 0 || index >= this.array.length) {
      throw new Error('Index out of bounds');
    }
    return this.array.splice(index, 1)[0];
  }

  // Linear search - O(n)
  linearSearch(target) {
    for (let i = 0; i < this.array.length; i++) {
      if (this.array[i] === target) {
        return i;
      }
    }
    return -1;
  }

  // Binary search (requires sorted array) - O(log n)
  binarySearch(target) {
    let left = 0;
    let right = this.array.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (this.array[mid] === target) {
        return mid;
      } else if (this.array[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    return -1;
  }

  // Traverse array - O(n)
  traverse() {
    for (let i = 0; i < this.array.length; i++) {
      console.log(\`Index \${i}: \${this.array[i]}\`);
    }
  }

  // Get array length - O(1)
  getLength() {
    return this.array.length;
  }

  // Check if empty - O(1)
  isEmpty() {
    return this.array.length === 0;
  }

  // Clear array - O(1)
  clear() {
    this.array = [];
  }
}

// Usage Example
const arr = new ArrayOperations();
arr.insertAtEnd(10);
arr.insertAtEnd(20);
arr.insertAtEnd(30);
console.log(arr.access(1)); // 20
console.log(arr.linearSearch(20)); // 1`,
    description: 'Complete array operations with proper complexity analysis',
    pseudocode: `ARRAY_OPERATIONS:
1. ACCESS(index):
   IF index < 0 OR index >= array.length
     THROW "Index out of bounds"
   RETURN array[index]

2. INSERT_AT_END(element):
   array.push(element)
   RETURN array.length

3. INSERT_AT_BEGINNING(element):
   array.unshift(element)
   RETURN array.length

4. DELETE_FROM_END():
   IF array is empty
     THROW "Array is empty"
   RETURN array.pop()

5. LINEAR_SEARCH(target):
   FOR i = 0 TO array.length - 1
     IF array[i] == target
       RETURN i
   RETURN -1

6. BINARY_SEARCH(target):
   left = 0, right = array.length - 1
   WHILE left <= right
     mid = (left + right) / 2
     IF array[mid] == target
       RETURN mid
     ELSE IF array[mid] < target
       left = mid + 1
     ELSE
       right = mid - 1
   RETURN -1`,
    keyConcepts: [
      'Random access - O(1) time complexity',
      'Sequential access - O(n) time complexity',
      'Insertion at end is O(1) amortized',
      'Insertion at beginning is O(n) due to shifting',
      'Linear search is O(n)',
      'Binary search is O(log n) but requires sorted array',
      'Memory allocation is contiguous',
      'Cache-friendly due to spatial locality'
    ],
    complexityAnalysis: {
      time: 'O(1) - O(n)',
      space: 'O(1)',
      bestCase: 'O(1) for access and end operations',
      worstCase: 'O(n) for beginning operations and search',
      averageCase: 'O(n) for linear search, O(log n) for binary search'
    }
  },

  'array-rotation': {
    language: 'javascript',
    code: `// Array Rotation - Multiple Approaches
class ArrayRotation {
  constructor(array) {
    this.array = [...array];
  }

  // Method 1: Using temporary array - O(n) time, O(n) space
  rotateLeftWithTemp(k) {
    const n = this.array.length;
    k = k % n; // Handle cases where k > n
    
    const temp = new Array(n);
    
    // Copy elements to temp array
    for (let i = 0; i < n; i++) {
      temp[(i - k + n) % n] = this.array[i];
    }
    
    // Copy back to original array
    for (let i = 0; i < n; i++) {
      this.array[i] = temp[i];
    }
    
    return this.array;
  }

  // Method 2: Juggling algorithm - O(n) time, O(1) space
  rotateLeftJuggling(k) {
    const n = this.array.length;
    k = k % n;
    
    if (k === 0) return this.array;
    
    const gcd = this.getGCD(n, k);
    
    for (let i = 0; i < gcd; i++) {
      const temp = this.array[i];
      let j = i;
      
      while (true) {
        const next = (j + k) % n;
        if (next === i) break;
        this.array[j] = this.array[next];
        j = next;
      }
      this.array[j] = temp;
    }
    
    return this.array;
  }

  // Method 3: Reversal algorithm - O(n) time, O(1) space
  rotateLeftReversal(k) {
    const n = this.array.length;
    k = k % n;
    
    // Reverse first k elements
    this.reverse(0, k - 1);
    // Reverse remaining elements
    this.reverse(k, n - 1);
    // Reverse entire array
    this.reverse(0, n - 1);
    
    return this.array;
  }

  // Method 4: Block swap algorithm - O(n) time, O(1) space
  rotateLeftBlockSwap(k) {
    const n = this.array.length;
    k = k % n;
    
    if (k === 0 || k === n) return this.array;
    
    let i = k;
    let j = n - k;
    
    while (i !== j) {
      if (i < j) {
        this.swapBlocks(0, i, j);
        j -= i;
      } else {
        this.swapBlocks(0, j, i);
        i -= j;
      }
    }
    
    this.swapBlocks(0, i, i);
    return this.array;
  }

  // Helper methods
  getGCD(a, b) {
    return b === 0 ? a : this.getGCD(b, a % b);
  }

  reverse(start, end) {
    while (start < end) {
      [this.array[start], this.array[end]] = [this.array[end], this.array[start]];
      start++;
      end--;
    }
  }

  swapBlocks(start, block1Size, block2Size) {
    for (let i = 0; i < block1Size; i++) {
      [this.array[start + i], this.array[start + block1Size + i]] = 
      [this.array[start + block1Size + i], this.array[start + i]];
    }
  }

  // Right rotation using left rotation
  rotateRight(k) {
    const n = this.array.length;
    return this.rotateLeft(n - k);
  }
}

// Usage Example
const arr = new ArrayRotation([1, 2, 3, 4, 5, 6, 7]);
console.log(arr.rotateLeftReversal(3)); // [4, 5, 6, 7, 1, 2, 3]`,
    description: 'Multiple approaches to array rotation with optimal space complexity',
    pseudocode: `ARRAY_ROTATION_ALGORITHMS:

1. TEMPORARY_ARRAY_METHOD(k):
   n = array.length
   k = k % n
   temp = new array[n]
   FOR i = 0 TO n-1
     temp[(i - k + n) % n] = array[i]
   FOR i = 0 TO n-1
     array[i] = temp[i]

2. JUGGLING_ALGORITHM(k):
   n = array.length
   k = k % n
   gcd = GCD(n, k)
   FOR i = 0 TO gcd-1
     temp = array[i]
     j = i
     WHILE true
       next = (j + k) % n
       IF next == i BREAK
       array[j] = array[next]
       j = next
     array[j] = temp

3. REVERSAL_ALGORITHM(k):
   n = array.length
   k = k % n
   REVERSE(0, k-1)
   REVERSE(k, n-1)
   REVERSE(0, n-1)

4. BLOCK_SWAP_ALGORITHM(k):
   n = array.length
   k = k % n
   i = k, j = n - k
   WHILE i != j
     IF i < j
       SWAP_BLOCKS(0, i, j)
       j = j - i
     ELSE
       SWAP_BLOCKS(0, j, i)
       i = i - j
   SWAP_BLOCKS(0, i, i)`,
    keyConcepts: [
      'Rotation preserves relative order of elements',
      'Multiple algorithms with different space complexities',
      'Juggling algorithm uses GCD for optimal grouping',
      'Reversal algorithm is elegant and space-efficient',
      'Block swap algorithm minimizes memory usage',
      'Right rotation can be achieved by left rotation',
      'Handle edge cases: k > n, k = 0, k = n',
      'Modular arithmetic for circular rotation'
    ],
    complexityAnalysis: {
      time: 'O(n)',
      space: 'O(1) for juggling, reversal, and block swap; O(n) for temp array',
      bestCase: 'O(n) - all methods require visiting each element',
      worstCase: 'O(n) - same as best case',
      averageCase: 'O(n) - linear time complexity'
    }
  },

  'array-subarray-problems': {
    language: 'javascript',
    code: `// Subarray Problems - Comprehensive Solutions
class SubarrayProblems {
  constructor(array) {
    this.array = array;
  }

  // 1. Maximum Subarray Sum (Kadane's Algorithm) - O(n)
  maxSubarraySum() {
    let maxSoFar = this.array[0];
    let maxEndingHere = this.array[0];
    
    for (let i = 1; i < this.array.length; i++) {
      maxEndingHere = Math.max(this.array[i], maxEndingHere + this.array[i]);
      maxSoFar = Math.max(maxSoFar, maxEndingHere);
    }
    
    return maxSoFar;
  }

  // 2. Maximum Subarray Sum with indices - O(n)
  maxSubarraySumWithIndices() {
    let maxSoFar = this.array[0];
    let maxEndingHere = this.array[0];
    let start = 0, end = 0;
    let tempStart = 0;
    
    for (let i = 1; i < this.array.length; i++) {
      if (this.array[i] > maxEndingHere + this.array[i]) {
        maxEndingHere = this.array[i];
        tempStart = i;
      } else {
        maxEndingHere = maxEndingHere + this.array[i];
      }
      
      if (maxEndingHere > maxSoFar) {
        maxSoFar = maxEndingHere;
        start = tempStart;
        end = i;
      }
    }
    
    return {
      sum: maxSoFar,
      start: start,
      end: end,
      subarray: this.array.slice(start, end + 1)
    };
  }

  // 3. Subarray with given sum - O(n)
  subarrayWithSum(targetSum) {
    const map = new Map();
    let currentSum = 0;
    
    for (let i = 0; i < this.array.length; i++) {
      currentSum += this.array[i];
      
      if (currentSum === targetSum) {
        return { start: 0, end: i };
      }
      
      if (map.has(currentSum - targetSum)) {
        return { start: map.get(currentSum - targetSum) + 1, end: i };
      }
      
      map.set(currentSum, i);
    }
    
    return null;
  }

  // 4. Longest subarray with sum k - O(n)
  longestSubarrayWithSum(k) {
    const map = new Map();
    let currentSum = 0;
    let maxLength = 0;
    
    for (let i = 0; i < this.array.length; i++) {
      currentSum += this.array[i];
      
      if (currentSum === k) {
        maxLength = i + 1;
      }
      
      if (map.has(currentSum - k)) {
        maxLength = Math.max(maxLength, i - map.get(currentSum - k));
      }
      
      if (!map.has(currentSum)) {
        map.set(currentSum, i);
      }
    }
    
    return maxLength;
  }

  // 5. Count subarrays with sum k - O(n)
  countSubarraysWithSum(k) {
    const map = new Map();
    let currentSum = 0;
    let count = 0;
    
    for (let i = 0; i < this.array.length; i++) {
      currentSum += this.array[i];
      
      if (currentSum === k) {
        count++;
      }
      
      if (map.has(currentSum - k)) {
        count += map.get(currentSum - k);
      }
      
      map.set(currentSum, (map.get(currentSum) || 0) + 1);
    }
    
    return count;
  }

  // 6. Maximum sum of k consecutive elements - O(n)
  maxSumOfKConsecutive(k) {
    if (k > this.array.length) return null;
    
    let currentSum = 0;
    for (let i = 0; i < k; i++) {
      currentSum += this.array[i];
    }
    
    let maxSum = currentSum;
    
    for (let i = k; i < this.array.length; i++) {
      currentSum = currentSum - this.array[i - k] + this.array[i];
      maxSum = Math.max(maxSum, currentSum);
    }
    
    return maxSum;
  }

  // 7. Minimum sum of k consecutive elements - O(n)
  minSumOfKConsecutive(k) {
    if (k > this.array.length) return null;
    
    let currentSum = 0;
    for (let i = 0; i < k; i++) {
      currentSum += this.array[i];
    }
    
    let minSum = currentSum;
    
    for (let i = k; i < this.array.length; i++) {
      currentSum = currentSum - this.array[i - k] + this.array[i];
      minSum = Math.min(minSum, currentSum);
    }
    
    return minSum;
  }

  // 8. All subarrays with sum k - O(n)
  allSubarraysWithSum(k) {
    const map = new Map();
    let currentSum = 0;
    const result = [];
    
    for (let i = 0; i < this.array.length; i++) {
      currentSum += this.array[i];
      
      if (currentSum === k) {
        result.push({ start: 0, end: i });
      }
      
      if (map.has(currentSum - k)) {
        const indices = map.get(currentSum - k);
        for (const index of indices) {
          result.push({ start: index + 1, end: i });
        }
      }
      
      if (!map.has(currentSum)) {
        map.set(currentSum, []);
      }
      map.get(currentSum).push(i);
    }
    
    return result;
  }
}

// Usage Example
const subarray = new SubarrayProblems([-2, 1, -3, 4, -1, 2, 1, -5, 4]);
console.log(subarray.maxSubarraySum()); // 6
console.log(subarray.maxSubarraySumWithIndices()); // { sum: 6, start: 3, end: 6, subarray: [4, -1, 2, 1] }`,
    description: 'Comprehensive subarray problems with optimal solutions',
    pseudocode: `SUBARRAY_PROBLEMS:

1. KADANE_ALGORITHM():
   maxSoFar = array[0]
   maxEndingHere = array[0]
   FOR i = 1 TO n-1
     maxEndingHere = MAX(array[i], maxEndingHere + array[i])
     maxSoFar = MAX(maxSoFar, maxEndingHere)
   RETURN maxSoFar

2. SUBARRAY_WITH_SUM(targetSum):
   map = empty hash map
   currentSum = 0
   FOR i = 0 TO n-1
     currentSum += array[i]
     IF currentSum == targetSum
       RETURN (0, i)
     IF map.contains(currentSum - targetSum)
       RETURN (map[currentSum - targetSum] + 1, i)
     map[currentSum] = i
   RETURN null

3. LONGEST_SUBARRAY_WITH_SUM(k):
   map = empty hash map
   currentSum = 0, maxLength = 0
   FOR i = 0 TO n-1
     currentSum += array[i]
     IF currentSum == k
       maxLength = i + 1
     IF map.contains(currentSum - k)
       maxLength = MAX(maxLength, i - map[currentSum - k])
     IF !map.contains(currentSum)
       map[currentSum] = i
   RETURN maxLength

4. SLIDING_WINDOW_K_ELEMENTS(k):
   currentSum = sum of first k elements
   maxSum = currentSum
   FOR i = k TO n-1
     currentSum = currentSum - array[i-k] + array[i]
     maxSum = MAX(maxSum, currentSum)
   RETURN maxSum`,
    keyConcepts: [
      'Kadane\'s algorithm for maximum subarray sum',
      'Prefix sum technique for subarray sum problems',
      'Sliding window for fixed-size subarrays',
      'Hash map for efficient sum tracking',
      'Two pointer technique for certain problems',
      'Dynamic programming approach for complex cases',
      'Handling negative numbers in sum problems',
      'Optimization techniques for large arrays'
    ],
    complexityAnalysis: {
      time: 'O(n)',
      space: 'O(n) for hash map based solutions, O(1) for Kadane\'s',
      bestCase: 'O(n) - single pass through array',
      worstCase: 'O(n) - same as best case',
      averageCase: 'O(n) - linear time complexity'
    }
  },

  'string-palindrome': {
    language: 'javascript',
    code: `// Palindrome Check - Multiple Approaches
class PalindromeChecker {
  constructor() {}

  // Method 1: Two pointers from ends - O(n)
  isPalindromeTwoPointers(str) {
    const cleanStr = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    let left = 0;
    let right = cleanStr.length - 1;
    
    while (left < right) {
      if (cleanStr[left] !== cleanStr[right]) {
        return false;
      }
      left++;
      right--;
    }
    
    return true;
  }

  // Method 2: Compare with reversed string - O(n)
  isPalindromeReverse(str) {
    const cleanStr = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    const reversed = cleanStr.split('').reverse().join('');
    return cleanStr === reversed;
  }

  // Method 3: Recursive approach - O(n)
  isPalindromeRecursive(str) {
    const cleanStr = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    return this.recursiveCheck(cleanStr, 0, cleanStr.length - 1);
  }

  recursiveCheck(str, left, right) {
    if (left >= right) {
      return true;
    }
    
    if (str[left] !== str[right]) {
      return false;
    }
    
    return this.recursiveCheck(str, left + 1, right - 1);
  }

  // Method 4: Stack approach - O(n)
  isPalindromeStack(str) {
    const cleanStr = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    const stack = [];
    const mid = Math.floor(cleanStr.length / 2);
    
    // Push first half to stack
    for (let i = 0; i < mid; i++) {
      stack.push(cleanStr[i]);
    }
    
    // Compare with second half
    let start = cleanStr.length % 2 === 0 ? mid : mid + 1;
    for (let i = start; i < cleanStr.length; i++) {
      if (stack.pop() !== cleanStr[i]) {
        return false;
      }
    }
    
    return true;
  }

  // Method 5: Character frequency approach - O(n)
  isPalindromeFrequency(str) {
    const cleanStr = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    const charCount = new Map();
    
    // Count characters
    for (const char of cleanStr) {
      charCount.set(char, (charCount.get(char) || 0) + 1);
    }
    
    let oddCount = 0;
    for (const count of charCount.values()) {
      if (count % 2 !== 0) {
        oddCount++;
      }
    }
    
    // For palindrome, at most one character can have odd frequency
    return oddCount <= 1;
  }

  // Method 6: Check if string can be rearranged to form palindrome - O(n)
  canFormPalindrome(str) {
    const cleanStr = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    const charCount = new Map();
    
    for (const char of cleanStr) {
      charCount.set(char, (charCount.get(char) || 0) + 1);
    }
    
    let oddCount = 0;
    for (const count of charCount.values()) {
      if (count % 2 !== 0) {
        oddCount++;
      }
    }
    
    return oddCount <= 1;
  }

  // Method 7: Find longest palindromic substring - O(n²)
  longestPalindromicSubstring(str) {
    if (!str || str.length === 0) return '';
    
    let start = 0;
    let maxLength = 1;
    
    for (let i = 0; i < str.length; i++) {
      // Check for odd length palindromes
      let len1 = this.expandAroundCenter(str, i, i);
      // Check for even length palindromes
      let len2 = this.expandAroundCenter(str, i, i + 1);
      
      let maxLen = Math.max(len1, len2);
      
      if (maxLen > maxLength) {
        start = i - Math.floor((maxLen - 1) / 2);
        maxLength = maxLen;
      }
    }
    
    return str.substring(start, start + maxLength);
  }

  expandAroundCenter(str, left, right) {
    while (left >= 0 && right < str.length && str[left] === str[right]) {
      left--;
      right++;
    }
    return right - left - 1;
  }

  // Method 8: Count palindromic substrings - O(n²)
  countPalindromicSubstrings(str) {
    let count = 0;
    
    for (let i = 0; i < str.length; i++) {
      // Count odd length palindromes
      count += this.expandAroundCenter(str, i, i);
      // Count even length palindromes
      count += this.expandAroundCenter(str, i, i + 1);
    }
    
    return count;
  }
}

// Usage Example
const checker = new PalindromeChecker();
console.log(checker.isPalindromeTwoPointers("A man, a plan, a canal: Panama")); // true
console.log(checker.longestPalindromicSubstring("babad")); // "bab" or "aba"`,
    description: 'Multiple approaches to palindrome checking with comprehensive solutions',
    pseudocode: `PALINDROME_ALGORITHMS:

1. TWO_POINTERS_METHOD(str):
   cleanStr = remove non-alphanumeric, convert to lowercase
   left = 0, right = cleanStr.length - 1
   WHILE left < right
     IF cleanStr[left] != cleanStr[right]
       RETURN false
     left++, right--
   RETURN true

2. REVERSE_METHOD(str):
   cleanStr = remove non-alphanumeric, convert to lowercase
   reversed = reverse(cleanStr)
   RETURN cleanStr == reversed

3. RECURSIVE_METHOD(str, left, right):
   IF left >= right
     RETURN true
   IF str[left] != str[right]
     RETURN false
   RETURN RECURSIVE_METHOD(str, left+1, right-1)

4. LONGEST_PALINDROMIC_SUBSTRING(str):
   start = 0, maxLength = 1
   FOR i = 0 TO str.length-1
     len1 = EXPAND_AROUND_CENTER(str, i, i)
     len2 = EXPAND_AROUND_CENTER(str, i, i+1)
     maxLen = MAX(len1, len2)
     IF maxLen > maxLength
       start = i - (maxLen-1)/2
       maxLength = maxLen
   RETURN str.substring(start, start + maxLength)

5. EXPAND_AROUND_CENTER(str, left, right):
   WHILE left >= 0 AND right < str.length AND str[left] == str[right]
     left--, right++
   RETURN right - left - 1`,
    keyConcepts: [
      'Two pointer technique for efficient checking',
      'Character case and punctuation handling',
      'Recursive approach for elegant solutions',
      'Stack-based approach for educational purposes',
      'Expand around center for substring problems',
      'Character frequency analysis',
      'Handling edge cases: empty string, single character',
      'Optimization techniques for large strings'
    ],
    complexityAnalysis: {
      time: 'O(n) for basic check, O(n²) for substring problems',
      space: 'O(1) for two pointers, O(n) for reverse method',
      bestCase: 'O(1) - first character mismatch',
      worstCase: 'O(n) - complete string check',
      averageCase: 'O(n) - linear time complexity'
    }
  }
};

export function getCodeSnippet(topicId: string): CodeSnippet | null {
  return codeSnippets[topicId] || null;
}