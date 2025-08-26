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
        </div>
      </div>
    </div>
  );
}