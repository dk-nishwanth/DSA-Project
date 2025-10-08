const fs = require('fs');

let content = fs.readFileSync('src/data/dsaTopics.ts', 'utf8');

const additions = {
  'segment-tree': {
    example: `rangeSum([1,3,5,7,9,11], 1, 3) = 15  // 3+5+7
update(2, 6)  // Change index 2 to 6
rangeSum([1,3,6,7,9,11], 1, 3) = 16  // 3+6+7`,
    syntax: `class SegmentTree {
  constructor(arr) {
    this.n = arr.length;
    this.tree = new Array(4 * this.n);
    this.build(arr, 0, 0, this.n - 1);
  }
  
  build(arr, node, start, end) {
    if (start === end) {
      this.tree[node] = arr[start];
    } else {
      const mid = Math.floor((start + end) / 2);
      this.build(arr, 2*node+1, start, mid);
      this.build(arr, 2*node+2, mid+1, end);
      this.tree[node] = this.tree[2*node+1] + this.tree[2*node+2];
    }
  }
  
  query(L, R, node=0, start=0, end=this.n-1) {
    if (R < start || end < L) return 0;
    if (L <= start && end <= R) return this.tree[node];
    const mid = Math.floor((start + end) / 2);
    return this.query(L, R, 2*node+1, start, mid) +
           this.query(L, R, 2*node+2, mid+1, end);
  }
}`
  },
  'fenwick-tree': {
    example: `prefixSum(5) = sum of first 5 elements
update(3, 5)  // Add 5 to index 3
rangeSum(2, 5) = prefixSum(5) - prefixSum(1)`,
    syntax: `class FenwickTree {
  constructor(n) {
    this.tree = new Array(n + 1).fill(0);
  }
  
  update(i, delta) {
    i++;  // 1-indexed
    while (i < this.tree.length) {
      this.tree[i] += delta;
      i += i & (-i);  // Add last set bit
    }
  }
  
  query(i) {
    i++;  // 1-indexed
    let sum = 0;
    while (i > 0) {
      sum += this.tree[i];
      i -= i & (-i);  // Remove last set bit
    }
    return sum;
  }
  
  rangeSum(l, r) {
    return this.query(r) - (l > 0 ? this.query(l-1) : 0);
  }
}`
  }
};


additions['union-find'] = {
  example: `union(1, 2); union(2, 3);
find(1) === find(3)  // true, same set
connected(1, 3) = true
componentCount = 2  // If we have 5 nodes total`,
  syntax: `class UnionFind {
  constructor(n) {
    this.parent = Array.from({length: n}, (_, i) => i);
    this.rank = new Array(n).fill(0);
  }
  
  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);  // Path compression
    }
    return this.parent[x];
  }
  
  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);
    
    if (rootX === rootY) return false;
    
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
}`
};

additions['avl-tree'] = {
  example: `insert(10); insert(20); insert(30);
// Tree auto-balances via rotations
height difference ≤ 1 for all nodes
search(20) = O(log n) guaranteed`,
  syntax: `class AVLNode {
  constructor(val) {
    this.val = val;
    this.left = this.right = null;
    this.height = 1;
  }
}

class AVLTree {
  getHeight(node) {
    return node ? node.height : 0;
  }
  
  getBalance(node) {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }
  
  rotateRight(y) {
    const x = y.left;
    y.left = x.right;
    x.right = y;
    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
    return x;
  }
  
  insert(node, val) {
    if (!node) return new AVLNode(val);
    
    if (val < node.val) node.left = this.insert(node.left, val);
    else if (val > node.val) node.right = this.insert(node.right, val);
    else return node;
    
    node.height = Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;
    const balance = this.getBalance(node);
    
    // Left-Left
    if (balance > 1 && val < node.left.val) return this.rotateRight(node);
    // Right-Right
    if (balance < -1 && val > node.right.val) return this.rotateLeft(node);
    // Left-Right
    if (balance > 1 && val > node.left.val) {
      node.left = this.rotateLeft(node.left);
      return this.rotateRight(node);
    }
    // Right-Left
    if (balance < -1 && val < node.right.val) {
      node.right = this.rotateRight(node.right);
      return this.rotateLeft(node);
    }
    
    return node;
  }
}`
};

additions['b-tree'] = {
  example: `// B-Tree of order 3 (max 2 keys per node)
insert(10); insert(20); insert(30);
// Node splits when full
search(20) = O(log n) with fewer disk reads`,
  syntax: `class BTreeNode {
  constructor(t, isLeaf = true) {
    this.keys = [];
    this.children = [];
    this.t = t;  // Minimum degree
    this.isLeaf = isLeaf;
  }
  
  search(k) {
    let i = 0;
    while (i < this.keys.length && k > this.keys[i]) i++;
    
    if (i < this.keys.length && k === this.keys[i]) return this;
    if (this.isLeaf) return null;
    return this.children[i].search(k);
  }
  
  insertNonFull(k) {
    let i = this.keys.length - 1;
    
    if (this.isLeaf) {
      this.keys.push(null);
      while (i >= 0 && k < this.keys[i]) {
        this.keys[i + 1] = this.keys[i];
        i--;
      }
      this.keys[i + 1] = k;
    } else {
      while (i >= 0 && k < this.keys[i]) i--;
      i++;
      
      if (this.children[i].keys.length === 2 * this.t - 1) {
        this.splitChild(i);
        if (k > this.keys[i]) i++;
      }
      this.children[i].insertNonFull(k);
    }
  }
}`
};

additions['splay-tree'] = {
  example: `insert(10); insert(20); insert(30);
access(10);  // 10 moves to root via splaying
// Recently accessed nodes near root
amortized O(log n) per operation`,
  syntax: `class SplayTree {
  splay(node, key) {
    if (!node || node.val === key) return node;
    
    // Key in left subtree
    if (key < node.val) {
      if (!node.left) return node;
      
      // Zig-Zig (Left-Left)
      if (key < node.left.val) {
        node.left.left = this.splay(node.left.left, key);
        node = this.rotateRight(node);
      }
      // Zig-Zag (Left-Right)
      else if (key > node.left.val) {
        node.left.right = this.splay(node.left.right, key);
        if (node.left.right) node.left = this.rotateLeft(node.left);
      }
      
      return node.left ? this.rotateRight(node) : node;
    }
    // Key in right subtree
    else {
      if (!node.right) return node;
      
      // Zag-Zag (Right-Right)
      if (key > node.right.val) {
        node.right.right = this.splay(node.right.right, key);
        node = this.rotateLeft(node);
      }
      // Zag-Zig (Right-Left)
      else if (key < node.right.val) {
        node.right.left = this.splay(node.right.left, key);
        if (node.right.left) node.right = this.rotateRight(node.right);
      }
      
      return node.right ? this.rotateLeft(node) : node;
    }
  }
  
  search(node, key) {
    return this.splay(node, key);
  }
}`
};

// Now add fields to each topic
for (const [topicId, fields] of Object.entries(additions)) {
  const { example, syntax } = fields;
  
  const topicPattern = new RegExp(
    `(id:\\s*['"]${topicId}['"][\\s\\S]*?console\\.log[\\s\\S]*?\`,)\\s*(quizQuestions:|},)`,
    'g'
  );
  
  if (topicPattern.test(content)) {
    content = content.replace(topicPattern, 
      `$1\n        example: \`${example}\`,\n        syntax: \`${syntax}\`,\n        $2`
    );
    console.log(`✅ Added fields to ${topicId}`);
  } else {
    console.log(`❌ Pattern not found for ${topicId}`);
  }
}

fs.writeFileSync('src/data/dsaTopics.ts', content, 'utf8');
console.log('\n✅ Done!');
