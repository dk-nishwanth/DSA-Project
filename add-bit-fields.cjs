const fs = require('fs');

let content = fs.readFileSync('src/data/dsaTopics.ts', 'utf8');

// Define examples and syntax for each bit manipulation topic
const additions = {
  'bit-basics': {
    example: `5 & 3 = 1    // 101 & 011 = 001
5 | 3 = 7    // 101 | 011 = 111
5 ^ 3 = 6    // 101 ^ 011 = 110
~5 = -6      // Flip all bits
5 << 1 = 10  // Multiply by 2
8 >> 1 = 4   // Divide by 2`,
    addBefore: 'quizQuestions:'
  },
  'count-set-bits': {
    example: `countSetBits(7) = 3   // 111 has 3 ones
countSetBits(8) = 1   // 1000 has 1 one
countSetBits(15) = 4  // 1111 has 4 ones`,
    syntax: `function countSetBits(n) {
  let count = 0;
  while (n > 0) {
    count += n & 1;
    n >>= 1;
  }
  return count;
}

// Brian Kernighan's Algorithm - O(k) where k = set bits
function countSetBitsFast(n) {
  let count = 0;
  while (n > 0) {
    n &= (n - 1);  // Remove rightmost set bit
    count++;
  }
  return count;
}`,
    addBefore: 'quizQuestions:'
  },
  'power-of-two': {
    example: `isPowerOfTwo(8) = true   // 8 = 2^3
isPowerOfTwo(6) = false  // Not a power of 2
isPowerOfTwo(16) = true  // 16 = 2^4
isPowerOfTwo(0) = false  // 0 is not a power of 2`,
    syntax: `function isPowerOfTwo(n) {
  return n > 0 && (n & (n - 1)) === 0;
}

// Why it works:
// Powers of 2 have exactly one bit set
// 8 = 1000, 8-1 = 0111
// 8 & 7 = 1000 & 0111 = 0000`,
    addBefore: 'quizQuestions:'
  },
  'single-number': {
    example: `findSingle([2,1,2,3,1]) = 3
findSingle([4,1,2,1,2]) = 4
// XOR cancels out duplicates
// 2^1^2^3^1 = 3`,
    syntax: `function findSingleNumber(nums) {
  let result = 0;
  for (let num of nums) {
    result ^= num;  // XOR cancels duplicates
  }
  return result;
}

// Why it works:
// a ^ a = 0 (same numbers cancel)
// a ^ 0 = a (XOR with 0 gives original)
// XOR is commutative and associative`,
    addBefore: 'quizQuestions:'
  },
  'bit-subset': {
    example: `generateSubsets([1,2,3]) = 
[[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]
// 2^3 = 8 subsets total
// Each bit represents include/exclude`,
    syntax: `function generateSubsets(arr) {
  const n = arr.length;
  const subsets = [];
  
  // Iterate through all 2^n possibilities
  for (let mask = 0; mask < (1 << n); mask++) {
    const subset = [];
    for (let i = 0; i < n; i++) {
      // Check if i-th bit is set
      if (mask & (1 << i)) {
        subset.push(arr[i]);
      }
    }
    subsets.push(subset);
  }
  
  return subsets;
}`,
    addBefore: 'quizQuestions:'
  }
};

// Process each topic
for (const [topicId, data] of Object.entries(additions)) {
  const { example, syntax, addBefore } = data;
  
  // Find the topic and add fields before the specified marker
  const topicPattern = new RegExp(
    `(id:\\s*['"]${topicId}['"][\\s\\S]*?)\\s*(${addBefore})`,
    'g'
  );
  
  let fields = '';
  if (example) fields += `example: \`${example}\`,\n        `;
  if (syntax) fields += `syntax: \`${syntax}\`,\n        `;
  
  if (topicPattern.test(content)) {
    content = content.replace(topicPattern, `$1${fields}$2`);
    console.log(`✅ Added fields to ${topicId}`);
  } else {
    console.log(`❌ Could not find pattern for ${topicId}`);
  }
}

fs.writeFileSync('src/data/dsaTopics.ts', content, 'utf8');
console.log('\n✅ Done adding bit manipulation fields!');
