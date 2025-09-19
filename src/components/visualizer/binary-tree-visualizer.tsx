import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Play, RotateCcw } from 'lucide-react';

interface TreeNode {
  id: string;
  value: number;
  left?: TreeNode;
  right?: TreeNode;
  x?: number;
  y?: number;
}

export function BinaryTreeVisualizer() {
  const [root, setRoot] = useState<TreeNode | null>({
    id: '1',
    value: 50,
    left: {
      id: '2',
      value: 30,
      left: { id: '4', value: 20 },
      right: { id: '5', value: 40 }
    },
    right: {
      id: '3',
      value: 70,
      left: { id: '6', value: 60 },
      right: { id: '7', value: 80 }
    }
  });
  const [inputValue, setInputValue] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [highlightedNodes, setHighlightedNodes] = useState<string[]>([]);
  const [traversalOrder, setTraversalOrder] = useState<number[]>([]);
  const [operation, setOperation] = useState<string | null>(null);
  const [lcaInputs, setLcaInputs] = useState<{a: string, b: string}>({ a: '', b: '' });
  const [lcaMode, setLcaMode] = useState<'bst' | 'general'>('bst');
  const [treeHeight, setTreeHeight] = useState<number | null>(null);

  const computeHeight = (node: TreeNode | null): number => {
    if (!node) return -1;
    return 1 + Math.max(computeHeight(node.left || null), computeHeight(node.right || null));
  };

  const handleHeight = () => {
    if (!root) return;
    const h = computeHeight(root);
    setTreeHeight(h);
    setOperation(`Height = ${h}`);
  };

  const handleLevelOrder = async () => {
    if (!root || isAnimating) return;
    setIsAnimating(true);
    setOperation('Level Order Traversal');
    setHighlightedNodes([]);
    setTraversalOrder([]);
    const queue: (TreeNode | null)[] = [root];
    const order: number[] = [];
    while (queue.length > 0) {
      const node = queue.shift();
      if (!node) continue;
      setHighlightedNodes(prev => [...prev, node.id]);
      order.push(node.value);
      setTraversalOrder([...order]);
      await new Promise(r => setTimeout(r, 600));
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    setTimeout(() => {
      setHighlightedNodes([]);
      setIsAnimating(false);
      setOperation(null);
    }, 1200);
  };

  const findLCAInBST = async (node: TreeNode | null, a: number, b: number): Promise<TreeNode | null> => {
    let cur = node;
    const pathHighlight: string[] = [];
    while (cur) {
      pathHighlight.push(cur.id);
      setHighlightedNodes([...pathHighlight]);
      await new Promise(r => setTimeout(r, 500));
      if (a < cur.value && b < cur.value) {
        cur = cur.left || null;
      } else if (a > cur.value && b > cur.value) {
        cur = cur.right || null;
      } else {
        return cur;
      }
    }
    return null;
  };

  const findNodeByValue = (node: TreeNode | null, val: number): TreeNode | null => {
    if (!node) return null;
    if (node.value === val) return node;
    return findNodeByValue(node.left || null, val) || findNodeByValue(node.right || null, val);
  };

  const buildParentDepth = (node: TreeNode | null) => {
    const parent = new Map<string, TreeNode | null>();
    const depth = new Map<string, number>();
    if (!node) return { parent, depth };
    const q: (TreeNode | null)[] = [node];
    parent.set(node.id, null); depth.set(node.id, 0);
    while (q.length) {
      const cur = q.shift();
      if (!cur) continue;
      if (cur.left) { parent.set(cur.left.id, cur); depth.set(cur.left.id, (depth.get(cur.id) || 0) + 1); q.push(cur.left); }
      if (cur.right){ parent.set(cur.right.id, cur); depth.set(cur.right.id, (depth.get(cur.id) || 0) + 1); q.push(cur.right); }
    }
    return { parent, depth };
  };

  const findLCAInGeneral = async (rootNode: TreeNode | null, a: number, b: number): Promise<TreeNode | null> => {
    if (!rootNode) return null;
    const A = findNodeByValue(rootNode, a);
    const B = findNodeByValue(rootNode, b);
    if (!A || !B) return null;
    const { parent, depth } = buildParentDepth(rootNode);
    // climb deeper node up to same depth
    let u: TreeNode | null = A, v: TreeNode | null = B;
    let du = depth.get(A.id) || 0, dv = depth.get(B.id) || 0;
    const pathHighlight: string[] = [];
    const pulse = async (id?: string) => { if (!id) return; pathHighlight.push(id); setHighlightedNodes([...pathHighlight]); await new Promise(r => setTimeout(r, 500)); };
    while (du > dv && u) { await pulse(u.id); u = parent.get(u.id) || null; du--; }
    while (dv > du && v) { await pulse(v.id); v = parent.get(v.id) || null; dv--; }
    while (u && v && u.id !== v.id) {
      await pulse(u.id); await pulse(v.id);
      u = parent.get(u.id) || null;
      v = parent.get(v.id) || null;
    }
    if (u) await pulse(u.id);
    return u;
  };

  const handleLCA = async () => {
    if (!root || isAnimating) return;
    const a = parseInt(lcaInputs.a);
    const b = parseInt(lcaInputs.b);
    if (isNaN(a) || isNaN(b)) return;
    setIsAnimating(true);
    setOperation(`Finding LCA(${a}, ${b})`);
    setHighlightedNodes([]);
    const lca = lcaMode === 'bst'
      ? await findLCAInBST(root, Math.min(a,b), Math.max(a,b))
      : await findLCAInGeneral(root, a, b);
    if (lca) {
      setOperation(`LCA is ${lca.value}`);
      // pulse highlight
      setHighlightedNodes(prev => Array.from(new Set([...prev, lca.id])));
    } else {
      setOperation('LCA not found');
    }
    setTimeout(() => {
      setIsAnimating(false);
    }, 1200);
  };

  const insertNode = (root: TreeNode | null, value: number): TreeNode => {
    if (!root) {
      return { id: Date.now().toString(), value };
    }

    if (value < root.value) {
      root.left = insertNode(root.left || null, value);
    } else if (value > root.value) {
      root.right = insertNode(root.right || null, value);
    }

    return root;
  };

  const handleInsert = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) return;

    setIsAnimating(true);
    setOperation(`Inserting ${value}`);

    const newRoot = insertNode(root, value);
    setRoot({ ...newRoot });
    setInputValue('');

    setTimeout(() => {
      setIsAnimating(false);
      setOperation(null);
    }, 1000);
  };

  const inorderTraversal = async (node: TreeNode | null, order: number[] = []): Promise<number[]> => {
    if (!node) return order;

    await inorderTraversal(node.left, order);
    
    setHighlightedNodes(prev => [...prev, node.id]);
    order.push(node.value);
    setTraversalOrder([...order]);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    await inorderTraversal(node.right, order);
    
    return order;
  };

  const handleInorderTraversal = async () => {
    if (!root || isAnimating) return;

    setIsAnimating(true);
    setOperation('Inorder Traversal (Left → Root → Right)');
    setHighlightedNodes([]);
    setTraversalOrder([]);

    await inorderTraversal(root);

    setTimeout(() => {
      setHighlightedNodes([]);
      setIsAnimating(false);
      setOperation(null);
    }, 2000);
  };

  const handleReset = () => {
    setRoot({
      id: '1',
      value: 50,
      left: {
        id: '2',
        value: 30,
        left: { id: '4', value: 20 },
        right: { id: '5', value: 40 }
      },
      right: {
        id: '3',
        value: 70,
        left: { id: '6', value: 60 },
        right: { id: '7', value: 80 }
      }
    });
    setHighlightedNodes([]);
    setTraversalOrder([]);
    setIsAnimating(false);
    setOperation(null);
  };

  const calculatePositions = (node: TreeNode | null, x: number, y: number, xOffset: number): void => {
    if (!node) return;

    node.x = x;
    node.y = y;

    if (node.left) {
      calculatePositions(node.left, x - xOffset, y + 80, xOffset / 2);
    }
    if (node.right) {
      calculatePositions(node.right, x + xOffset, y + 80, xOffset / 2);
    }
  };

  if (root) {
    calculatePositions(root, 300, 50, 120);
  }

  const renderNode = (node: TreeNode | null): JSX.Element | null => {
    if (!node) return null;

    return (
      <g key={node.id}>
        {/* Edges */}
        {node.left && (
          <line
            x1={node.x}
            y1={node.y! + 20}
            x2={node.left.x}
            y2={node.left.y! - 20}
            stroke="hsl(var(--border))"
            strokeWidth="2"
          />
        )}
        {node.right && (
          <line
            x1={node.x}
            y1={node.y! + 20}
            x2={node.right.x}
            y2={node.right.y! - 20}
            stroke="hsl(var(--border))"
            strokeWidth="2"
          />
        )}

        {/* Node */}
        <motion.circle
          cx={node.x}
          cy={node.y}
          r="20"
          fill={highlightedNodes.includes(node.id) ? "hsl(var(--animation-highlight))" : "hsl(var(--card))"}
          stroke={highlightedNodes.includes(node.id) ? "hsl(var(--animation-highlight))" : "hsl(var(--border))"}
          strokeWidth="2"
          animate={{
            scale: highlightedNodes.includes(node.id) ? 1.2 : 1,
          }}
          transition={{ duration: 0.3 }}
        />
        <text
          x={node.x}
          y={node.y! + 5}
          textAnchor="middle"
          fontSize="14"
          fontWeight="bold"
          fill="hsl(var(--foreground))"
        >
          {node.value}
        </text>

        {/* Recursively render children */}
        {renderNode(node.left)}
        {renderNode(node.right)}
      </g>
    );
  };

  return (
    <div className="visualization-container p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Binary Search Tree</h3>
        <p className="text-muted-foreground text-sm">
          Interactive BST with insert and traversal operations
        </p>
      </div>

      {/* Tree Visualization */}
      <div className="mb-8 border rounded-xl p-4 bg-card">
        <svg width="600" height="300" className="mx-auto">
          {root && renderNode(root)}
        </svg>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex gap-2">
            <Input
              placeholder="Enter value"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-32"
              type="number"
            />
            <Button 
              onClick={handleInsert}
              disabled={isAnimating || !inputValue}
              size="sm"
              className="control-button"
            >
              <Plus className="h-4 w-4 mr-1" />
              Insert
            </Button>
          </div>
          
          <Button 
            onClick={handleInorderTraversal}
            disabled={isAnimating || !root}
            size="sm"
            variant="secondary"
          >
            <Play className="h-4 w-4 mr-1" />
            Inorder Traversal
          </Button>
          <Button 
            onClick={handleLevelOrder}
            disabled={isAnimating || !root}
            size="sm"
            variant="secondary"
          >
            <Play className="h-4 w-4 mr-1" />
            Level Order
          </Button>
          <Button 
            onClick={handleHeight}
            disabled={isAnimating || !root}
            size="sm"
            variant="outline"
          >
            Height
          </Button>
          
          <Button 
            onClick={handleReset}
            disabled={isAnimating}
            size="sm"
            variant="outline"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>

        {/* Status */}
        <div className="flex flex-wrap gap-2">
          {operation && (
            <Badge variant="secondary" className="animate-pulse">
              {operation}
            </Badge>
          )}
          {traversalOrder.length > 0 && (
            <Badge variant="outline">
              Traversal: {traversalOrder.join(' → ')}
            </Badge>
          )}
          {treeHeight !== null && (
            <Badge variant="outline">
              Height: {treeHeight}
            </Badge>
          )}
        </div>

        {/* LCA Controls */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-sm text-muted-foreground">LCA:</span>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={lcaMode}
            onChange={e=>setLcaMode(e.target.value as 'bst'|'general')}
          >
            <option value="bst">BST LCA</option>
            <option value="general">General Tree LCA</option>
          </select>
          <Input
            placeholder="A"
            value={lcaInputs.a}
            onChange={e => setLcaInputs({ ...lcaInputs, a: e.target.value })}
            className="w-24"
            type="number"
          />
          <Input
            placeholder="B"
            value={lcaInputs.b}
            onChange={e => setLcaInputs({ ...lcaInputs, b: e.target.value })}
            className="w-24"
            type="number"
          />
          <Button onClick={handleLCA} disabled={isAnimating || !root} size="sm">Find LCA</Button>
        </div>
      </div>
    </div>
  );
}