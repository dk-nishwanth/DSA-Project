const fs = require('fs');

let content = fs.readFileSync('src/data/dsaTopics.ts', 'utf8');

// Add example and syntax fields to bit manipulation topics
// Insert before syntax_alt or quizQuestions

const additions = {
  'bit-basics': {
    example: `5 & 3 = 1    // 101 & 011 = 001
5 | 3 = 7    // 101 | 011 = 111
5 ^ 3 = 6    // 101 ^ 011 = 110
~5 = -6      // Flip all bits
5 << 1 = 10  // Multiply by 2
8 >> 1 = 4   // Divide by 2`,
    syntax: `// Check if even
n & 1 === 0

// Check if power of 2
n > 0 && (n & (n-1)) === 0

// Set bit at position i
num | (1 << i)

// Clear bit at position i
num & ~(1 << i)

// Toggle bit at position i
num ^ (1 << i)`
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

// Brian Kernighan's Algorithm
function countFast(n) {
  let count = 0;
  while (n > 0) {
    n &= (n - 1);
    count++;
  }
  return count;
}`
  }
};

// Continue with more topics...

additions['power-of-two'] = {
  example: `isPowerOfTwo(8) = true   // 8 = 2^3
isPowerOfTwo(6) = false  // Not a power of 2
isPowerOfTwo(16) = true  // 16 = 2^4
isPowerOfTwo(0) = false  // 0 is not a power of 2`,
  syntax: `function isPowerOfTwo(n) {
  return n > 0 && (n & (n - 1)) === 0;
}

// Why it works:
// Powers of 2: 8 = 1000, 8-1 = 0111
// 8 & 7 = 1000 & 0111 = 0000`
};

additions['single-number'] = {
  example: `findSingle([2,1,2,3,1]) = 3
findSingle([4,1,2,1,2]) = 4
// XOR cancels out duplicates`,
  syntax: `function findSingleNumber(nums) {
  let result = 0;
  for (let num of nums) {
    result ^= num;
  }
  return result;
}

// a ^ a = 0, a ^ 0 = a`
};

additions['bit-subset'] = {
  example: `generateSubsets([1,2,3]) = 
[[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]
// 2^3 = 8 subsets`,
  syntax: `function generateSubsets(arr) {
  const n = arr.length;
  const subsets = [];
  
  for (let mask = 0; mask < (1 << n); mask++) {
    const subset = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        subset.push(arr[i]);
      }
    }
    subsets.push(subset);
  }
  return subsets;
}`
};

// Process each topic
for (const [topicId, fields] of Object.entries(additions)) {
  const { example, syntax } = fields;
  
  // Find topic and add before syntax_alt or quizQuestions
  const pattern = new RegExp(
    `(id:\\s*['"]${topicId}['"][\\s\\S]*?countSetBits\\(7\\)\\);  \\/\\/ 3\`,)\\s*(syntax_alt:|quizQuestions:)`,
    'g'
  );
  
  if (pattern.test(content)) {
    content = content.replace(pattern, 
      `$1\n        example: \`${example}\`,\n        syntax: \`${syntax}\`,\n        $2`
    );
    console.log(`✅ Added fields to ${topicId}`);
  } else {
    console.log(`❌ Pattern not found for ${topicId}`);
  }
}

fs.writeFileSync('src/data/dsaTopics.ts', content, 'utf8');
console.log('\n✅ Done!');
