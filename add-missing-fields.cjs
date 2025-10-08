const fs = require('fs');

console.log('Adding missing example and syntax fields...\n');

// Define examples and syntax for topics that are missing them
const additions = {
  // Topics missing both example and syntax
  'bit-subset': {
    example: `subsets([1,2,3]) = [[], [1], [2], [3], [1,2], [1,3], [2,3], [1,2,3]]
// Using bits: 000 to 111 represents all subsets`,
    syntax: `function generateSubsets(arr) {
  const n = arr.length;
  const result = [];
  for (let mask = 0; mask < (1 << n); mask++) {
    const subset = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) subset.push(arr[i]);
    }
    result.push(subset);
  }
  return result;
}`
  },
  
  'power-of-two': {
    example: `isPowerOfTwo(16) = true  // 2^4
isPowerOfTwo(18) = false
Check: n & (n-1) === 0`,
    syntax: `function isPowerOfTwo(n) {
  return n > 0 && (n & (n - 1)) === 0;
}`
  },
  
  'count-set-bits': {
    example: `countBits(13) = 3  // 1101 has 3 ones
countBits(7) = 3   // 111 has 3 ones`,
    syntax: `function countSetBits(n) {
  let count = 0;
  while (n) {
    count += n & 1;
    n >>= 1;
  }
  return count;
}`
  },
  
  'union-find': {
    example: `union(1, 2); union(2, 3);
find(1) === find(3)  // true, same set
Path compression + union by rank: O(α(n))`,
    syntax: `class UnionFind {
  constructor(n) {
    this.parent = Array.from({length: n}, (_, i) => i);
    this.rank = Array(n).fill(0);
  }
  find(x) {
    if (this.parent[x] !== x)
      this.parent[x] = this.find(this.parent[x]);
    return this.parent[x];
  }
  union(x, y) {
    const px = this.find(x), py = this.find(y);
    if (px === py) return false;
    if (this.rank[px] < this.rank[py]) this.parent[px] = py;
    else if (this.rank[px] > this.rank[py]) this.parent[py] = px;
    else { this.parent[py] = px; this.rank[px]++; }
    return true;
  }
}`
  },
  
  'knapsack-problem': {
    example: `items = [{w:2,v:3}, {w:3,v:4}, {w:4,v:5}]
capacity = 5
maxValue = 7  // Take items 0 and 1`,
    syntax: `function knapsack(items, W) {
  const n = items.length;
  const dp = Array(n+1).fill().map(() => Array(W+1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= W; w++) {
      if (items[i-1].weight <= w)
        dp[i][w] = Math.max(dp[i-1][w], 
          dp[i-1][w-items[i-1].weight] + items[i-1].value);
      else dp[i][w] = dp[i-1][w];
    }
  }
  return dp[n][W];
}`
  },
  
  'longest-common-subsequence': {
    example: `LCS("ABCDGH", "AEDFHR") = "ADH"
Length = 3`,
    syntax: `function lcs(s1, s2) {
  const m = s1.length, n = s2.length;
  const dp = Array(m+1).fill().map(() => Array(n+1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i-1] === s2[j-1])
        dp[i][j] = dp[i-1][j-1] + 1;
      else
        dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
    }
  }
  return dp[m][n];
}`
  },
  
  'tail-recursion': {
    example: `factorial(5) = 120
// Tail recursive: last operation is recursive call
factorialTail(5, 1) → factorialTail(4, 5) → ...`,
    syntax: `function factorialTail(n, acc = 1) {
  if (n <= 1) return acc;
  return factorialTail(n - 1, n * acc);
}`
  },
  
  'hash-chaining': {
    example: `hash("key1") = 3, hash("key2") = 3
Bucket[3] → ["key1":val1] → ["key2":val2]`,
    syntax: `class HashTable {
  constructor(size = 10) {
    this.buckets = Array(size).fill().map(() => []);
  }
  hash(key) {
    return key.toString().length % this.buckets.length;
  }
  set(key, value) {
    const idx = this.hash(key);
    const bucket = this.buckets[idx];
    const existing = bucket.find(([k]) => k === key);
    if (existing) existing[1] = value;
    else bucket.push([key, value]);
  }
  get(key) {
    const bucket = this.buckets[this.hash(key)];
    const found = bucket.find(([k]) => k === key);
    return found ? found[1] : undefined;
  }
}`
  },
  
  'linear-search': {
    example: `linearSearch([4,2,7,1,9], 7) = 2
linearSearch([4,2,7,1,9], 5) = -1`,
    syntax: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`
  },
  
  'bucket-sort': {
    example: `bucketSort([0.42, 0.32, 0.23, 0.52, 0.25])
→ [0.23, 0.25, 0.32, 0.42, 0.52]`,
    syntax: `function bucketSort(arr, bucketSize = 5) {
  if (arr.length === 0) return arr;
  const min = Math.min(...arr), max = Math.max(...arr);
  const bucketCount = Math.floor((max - min) / bucketSize) + 1;
  const buckets = Array(bucketCount).fill().map(() => []);
  
  arr.forEach(num => {
    buckets[Math.floor((num - min) / bucketSize)].push(num);
  });
  
  return buckets.flatMap(bucket => bucket.sort((a,b) => a-b));
}`
  },
  
  'radix-sort': {
    example: `radixSort([170, 45, 75, 90, 802, 24, 2, 66])
→ [2, 24, 45, 66, 75, 90, 170, 802]`,
    syntax: `function radixSort(arr) {
  const max = Math.max(...arr);
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countingSortByDigit(arr, exp);
  }
  return arr;
}
function countingSortByDigit(arr, exp) {
  const output = Array(arr.length);
  const count = Array(10).fill(0);
  arr.forEach(num => count[Math.floor(num / exp) % 10]++);
  for (let i = 1; i < 10; i++) count[i] += count[i-1];
  for (let i = arr.length - 1; i >= 0; i--) {
    const digit = Math.floor(arr[i] / exp) % 10;
    output[--count[digit]] = arr[i];
  }
  arr.forEach((_, i) => arr[i] = output[i]);
}`
  },
  
  'counting-sort': {
    example: `countingSort([4,2,2,8,3,3,1])
→ [1,2,2,3,3,4,8]`,
    syntax: `function countingSort(arr) {
  const max = Math.max(...arr);
  const count = Array(max + 1).fill(0);
  arr.forEach(num => count[num]++);
  let idx = 0;
  count.forEach((c, num) => {
    while (c-- > 0) arr[idx++] = num;
  });
  return arr;
}`
  },
  
  'selection-sort': {
    example: `selectionSort([64, 25, 12, 22, 11])
→ [11, 12, 22, 25, 64]`,
    syntax: `function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
  return arr;
}`
  },
  
  'insertion-sort': {
    example: `insertionSort([12, 11, 13, 5, 6])
→ [5, 6, 11, 12, 13]`,
    syntax: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`
  },
  
  'dijkstra-algorithm': {
    example: `Graph: A--(1)--B--(2)--C
       \\__(4)__/
shortestPath(A, C) = 3 via A→B→C`,
    syntax: `function dijkstra(graph, start) {
  const dist = {}, visited = new Set();
  Object.keys(graph).forEach(v => dist[v] = Infinity);
  dist[start] = 0;
  
  while (visited.size < Object.keys(graph).length) {
    let u = null, minDist = Infinity;
    for (let v in dist) {
      if (!visited.has(v) && dist[v] < minDist) {
        minDist = dist[v];
        u = v;
      }
    }
    if (u === null) break;
    visited.add(u);
    
    for (let [v, weight] of graph[u]) {
      if (dist[u] + weight < dist[v]) {
        dist[v] = dist[u] + weight;
      }
    }
  }
  return dist;
}`
  },
  
  'stack-operations': {
    example: `stack.push(1); stack.push(2);
stack.pop() = 2  // LIFO
stack.peek() = 1`,
    syntax: `class Stack {
  constructor() { this.items = []; }
  push(item) { this.items.push(item); }
  pop() { return this.items.pop(); }
  peek() { return this.items[this.items.length - 1]; }
  isEmpty() { return this.items.length === 0; }
}`
  },
  
  'string-anagram': {
    example: `isAnagram("listen", "silent") = true
isAnagram("hello", "world") = false`,
    syntax: `function isAnagram(s1, s2) {
  if (s1.length !== s2.length) return false;
  const count = {};
  for (let c of s1) count[c] = (count[c] || 0) + 1;
  for (let c of s2) {
    if (!count[c]) return false;
    count[c]--;
  }
  return true;
}`
  }
};

// Read the file
let content = fs.readFileSync('src/data/dsaTopics.ts', 'utf8');
let modified = 0;

// For each topic that needs additions
Object.entries(additions).forEach(([topicId, fields]) => {
  // Find the topic
  const topicRegex = new RegExp(`(id:\\s*['"]${topicId}['"][\\s\\S]*?)(\\n\\s*},)`, 'g');
  
  const match = topicRegex.exec(content);
  if (match) {
    const topicBlock = match[1];
    const hasExample = topicBlock.includes('example:');
    const hasSyntax = topicBlock.includes('syntax:');
    
    let additions = '';
    if (!hasExample && fields.example) {
      additions += `\n        example: \`${fields.example}\`,`;
      console.log(`✅ Added example to ${topicId}`);
      modified++;
    }
    if (!hasSyntax && fields.syntax) {
      additions += `\n        syntax: \`${fields.syntax}\`,`;
      console.log(`✅ Added syntax to ${topicId}`);
      modified++;
    }
    
    if (additions) {
      content = content.replace(topicRegex, `$1${additions}$2`);
    }
  }
});

// Write back
fs.writeFileSync('src/data/dsaTopics.ts', content, 'utf8');

console.log(`\n✅ Added ${modified} fields to topics`);
console.log('✅ File updated successfully!\n');
