import fs from 'fs';
import path from 'path';

// Mapping of visualizer files to their topic folders
const visualizerMapping = {
  // Arrays
  'array-fundamentals-visualizer.tsx': 'arrays/array-fundamentals',
  'array-rotation-visualizer.tsx': 'arrays/array-rotation',
  'array-visualizer.tsx': 'arrays/array-basics',
  'enhanced-array-visualizer.tsx': 'arrays/enhanced-array',
  
  // Strings
  'string-palindrome-visualizer.tsx': 'strings/palindrome',
  'string-matching-visualizer.tsx': 'strings/string-matching',
  'kmp-visualizer.tsx': 'strings/kmp',
  'rabin-karp-visualizer.tsx': 'strings/rabin-karp',
  'z-algorithm-visualizer.tsx': 'strings/z-algorithm',
  'manacher-visualizer.tsx': 'strings/manacher',
  'anagram-visualizer.tsx': 'strings/anagram',
  
  // Linked Lists
  'linked-list-visualizer.tsx': 'linked-lists/singly-linked-list',
  'singly-linked-list-visualizer.tsx': 'linked-lists/singly-linked-list',
  'doubly-linked-list-visualizer.tsx': 'linked-lists/doubly-linked-list',
  'circular-linked-list-visualizer.tsx': 'linked-lists/circular-linked-list',
  
  // Stacks & Queues
  'stack-visualizer.tsx': 'stacks-queues/stack',
  'stack-operations-visualizer.tsx': 'stacks-queues/stack-operations',
  'queue-visualizer.tsx': 'stacks-queues/queue',
  'queue-operations-visualizer.tsx': 'stacks-queues/queue-operations',
  
  // Trees
  'binary-tree-visualizer.tsx': 'trees/binary-tree',
  'binary-tree-fundamentals-visualizer.tsx': 'trees/binary-tree-fundamentals',
  'binary-tree-fundamentals-viz.tsx': 'trees/binary-tree-fundamentals',
  'binary-search-tree-visualizer.tsx': 'trees/binary-search-tree',
  'bst-visualizer.tsx': 'trees/bst',
  'bst-operations-visualizer.tsx': 'trees/bst-operations',
  'avl-tree-visualizer.tsx': 'trees/avl-tree',
  'red-black-tree-visualizer.tsx': 'trees/red-black-tree',
  'tree-traversal-visualizer.tsx': 'trees/tree-traversal',
  'inorder-traversal-visualizer.tsx': 'trees/inorder-traversal',
  'preorder-traversal-visualizer.tsx': 'trees/preorder-traversal',
  'postorder-traversal-visualizer.tsx': 'trees/postorder-traversal',
  
  // Graphs
  'graph-visualizer.tsx': 'graphs/graph',
  'graph-dfs-visualizer.tsx': 'graphs/dfs',
  'graph-bfs-visualizer.tsx': 'graphs/bfs',
  'dijkstra-visualizer.tsx': 'graphs/dijkstra',
  'bellman-ford-visualizer.tsx': 'graphs/bellman-ford',
  'floyd-warshall-visualizer.tsx': 'graphs/floyd-warshall',
  'topological-sort-visualizer.tsx': 'graphs/topological-sort',
  'kruskal-visualizer.tsx': 'graphs/kruskal',
  'prim-visualizer.tsx': 'graphs/prim',
  'dfs-bfs-visualizer.tsx': 'graphs/dfs-bfs',
  
  // Sorting
  'sorting-visualizer.tsx': 'sorting/sorting',
  'bubble-sort-visualizer.tsx': 'sorting/bubble-sort',
  'enhanced-bubble-sort.tsx': 'sorting/bubble-sort',
  'merge-sort-visualizer.tsx': 'sorting/merge-sort',
  'quick-sort-visualizer.tsx': 'sorting/quick-sort',
  'heap-sort-visualizer.tsx': 'sorting/heap-sort',
  'insertion-sort-visualizer.tsx': 'sorting/insertion-sort',
  'selection-sort-visualizer.tsx': 'sorting/selection-sort',
  'counting-sort-visualizer.tsx': 'sorting/counting-sort',
  'radix-sort-visualizer.tsx': 'sorting/radix-sort',
  'bucket-sort-visualizer.tsx': 'sorting/bucket-sort',
  
  // Searching
  'search-visualizer.tsx': 'searching/search',
  'linear-search-visualizer.tsx': 'searching/linear-search',
  'binary-search-visualizer.tsx': 'searching/binary-search',
  'binary-search-algo-visualizer.tsx': 'searching/binary-search',
  'interpolation-search-viz.tsx': 'searching/interpolation-search',
  'exponential-search-viz.tsx': 'searching/exponential-search',
  
  // Hashing
  'hash-table-visualizer.tsx': 'hashing/hash-table',
  'hash-table-basics-visualizer.tsx': 'hashing/hash-table-basics',
  'hash-functions-viz.tsx': 'hashing/hash-functions',
  'separate-chaining-viz.tsx': 'hashing/separate-chaining',
  'open-addressing-visualizer.tsx': 'hashing/open-addressing',
  
  // Dynamic Programming
  'dp-visualizer.tsx': 'dynamic-programming/dp',
  'dp-introduction-visualizer.tsx': 'dynamic-programming/dp-introduction',
  'dp-fundamentals-viz.tsx': 'dynamic-programming/dp-fundamentals',
  'knapsack-visualizer.tsx': 'dynamic-programming/knapsack',
  'knapsack-01-viz.tsx': 'dynamic-programming/knapsack-01',
  'lis-visualizer.tsx': 'dynamic-programming/lis',
  'lis-unique-viz.tsx': 'dynamic-programming/lis',
  'lcs-visualizer.tsx': 'dynamic-programming/lcs',
  'lcs-unique-viz.tsx': 'dynamic-programming/lcs',
  'fibonacci-dp-visualizer.tsx': 'dynamic-programming/fibonacci',
  
  // Greedy
  'greedy-visualizer.tsx': 'greedy/greedy',
  'activity-selection-viz.tsx': 'greedy/activity-selection',
  'fractional-knapsack-viz.tsx': 'greedy/fractional-knapsack',
  'job-scheduling-viz.tsx': 'greedy/job-scheduling',
  'huffman-visualizer.tsx': 'greedy/huffman',
  'huffman-coding-visualizer.tsx': 'greedy/huffman-coding',
  
  // Backtracking
  'backtracking-visualizer.tsx': 'backtracking/backtracking',
  'enhanced-backtracking-visualizer.tsx': 'backtracking/enhanced-backtracking',
  'backtracking-fundamentals-unique-viz.tsx': 'backtracking/backtracking-fundamentals',
  'subset-generation-unique-viz.tsx': 'backtracking/subset-generation',
  'permutation-generation-unique-viz.tsx': 'backtracking/permutation-generation',
  'n-queens-visualizer.tsx': 'backtracking/n-queens',
  'sudoku-visualizer.tsx': 'backtracking/sudoku',
  'maze-solver-visualizer.tsx': 'backtracking/maze-solver',
  'generate-parentheses-visualizer.tsx': 'backtracking/generate-parentheses',
  
  // Advanced Data Structures
  'trie-visualizer.tsx': 'advanced-data-structures/trie',
  'segment-tree-visualizer.tsx': 'advanced-data-structures/segment-tree',
  'fenwick-tree-visualizer.tsx': 'advanced-data-structures/fenwick-tree',
  'union-find-visualizer.tsx': 'advanced-data-structures/union-find',
  'b-tree-visualizer.tsx': 'advanced-data-structures/b-tree',
  'splay-tree-visualizer.tsx': 'advanced-data-structures/splay-tree',
  'heap-visualizer.tsx': 'advanced-data-structures/heap',
  'heap-operations-visualizer.tsx': 'advanced-data-structures/heap-operations',
  
  // Two Pointers
  'two-pointers-visualizer.tsx': 'two-pointers/two-pointers',
  'two-pointers-intro-visualizer.tsx': 'two-pointers/two-pointers-intro',
  'two-pointers-basics-visualizer.tsx': 'two-pointers/two-pointers-basics',
  'two-sum-visualizer.tsx': 'two-pointers/two-sum',
  'three-sum-visualizer.tsx': 'two-pointers/three-sum',
  'container-water-visualizer.tsx': 'two-pointers/container-water',
  'remove-duplicates-visualizer.tsx': 'two-pointers/remove-duplicates',
  'palindrome-check-visualizer.tsx': 'two-pointers/palindrome-check',
  
  // Sliding Window
  'sliding-window-visualizer.tsx': 'sliding-window/sliding-window',
  'sliding-window-basics-visualizer.tsx': 'sliding-window/sliding-window-basics',
  'sliding-window-maximum-visualizer.tsx': 'sliding-window/sliding-window-maximum',
  'longest-substring-visualizer.tsx': 'sliding-window/longest-substring',
  
  // Bit Manipulation
  'bit-manipulation-visualizer.tsx': 'bit-manipulation/bit-manipulation',
  'bit-basics-visualizer.tsx': 'bit-manipulation/bit-basics',
  'count-set-bits-visualizer.tsx': 'bit-manipulation/count-set-bits',
  'power-of-two-visualizer.tsx': 'bit-manipulation/power-of-two',
  'single-number-visualizer.tsx': 'bit-manipulation/single-number',
  'bit-subset-visualizer.tsx': 'bit-manipulation/bit-subset',
  
  // Mathematical
  'mathematical-visualizer.tsx': 'mathematical/mathematical',
  'mathematical-induction-visualizer.tsx': 'mathematical/mathematical-induction',
  'number-theory-visualizer.tsx': 'mathematical/number-theory',
  'prime-algorithms-visualizer.tsx': 'mathematical/prime-algorithms',
  'fast-exponentiation-visualizer.tsx': 'mathematical/fast-exponentiation',
  'modular-arithmetic-visualizer.tsx': 'mathematical/modular-arithmetic',
  'combinatorics-visualizer.tsx': 'mathematical/combinatorics',
  
  // Recursion
  'recursion-visualizer.tsx': 'recursion/recursion',
  'recursion-basics-visualizer.tsx': 'recursion/recursion-basics',
  'tail-recursion-visualizer.tsx': 'recursion/tail-recursion'
};

console.log('🔄 Starting visualizer reorganization...\n');

let moved = 0;
let skipped = 0;
let errors = 0;

Object.entries(visualizerMapping).forEach(([filename, targetPath]) => {
  const sourcePath = path.join('src/components/visualizer', filename);
  const targetDir = path.join('src/components/visualizer', targetPath);
  const targetFile = path.join(targetDir, 'index.tsx');
  
  // Check if source file exists
  if (!fs.existsSync(sourcePath)) {
    console.log(`⏭️  Skipped: ${filename} (not found)`);
    skipped++;
    return;
  }
  
  try {
    // Create target directory
    fs.mkdirSync(targetDir, { recursive: true });
    
    // Read source file
    const content = fs.readFileSync(sourcePath, 'utf-8');
    
    // Write to new location
    fs.writeFileSync(targetFile, content);
    
    console.log(`✅ Moved: ${filename} → ${targetPath}/index.tsx`);
    moved++;
  } catch (error) {
    console.log(`❌ Error moving ${filename}: ${error.message}`);
    errors++;
  }
});

console.log(`\n📊 Summary:`);
console.log(`   Moved: ${moved}`);
console.log(`   Skipped: ${skipped}`);
console.log(`   Errors: ${errors}`);
console.log(`\n✅ Reorganization complete!`);
console.log(`\n⚠️  Note: You'll need to update import paths in TopicDetail.tsx`);
