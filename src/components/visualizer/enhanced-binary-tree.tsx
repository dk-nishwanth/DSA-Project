import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RotateCcw, Play, Pause, StepForward } from 'lucide-react';
import { toast } from 'sonner';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

interface TreeNode {
  id: string;
  value: number;
  left?: TreeNode;
  right?: TreeNode;
  x?: number;
  y?: number;
  highlighted?: boolean;
  visited?: boolean;
  level?: number;
}

interface TraversalStep {
  node: TreeNode;
  action: 'visit' | 'process' | 'backtrack';
  description: string;
  traversalOrder: number[];
  currentPath: string[];
}

export function EnhancedBinaryTree() {
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [deleteValue, setDeleteValue] = useState('');
  const [operation, setOperation] = useState<'insert' | 'search' | 'delete' | 'traverse'>('insert');
  const [traversalType, setTraversalType] = useState<'inorder' | 'preorder' | 'postorder' | 'levelorder'>('inorder');
  const [isAnimating, setIsAnimating] = useState(false);
  const [traversalSteps, setTraversalSteps] = useState<TraversalStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [traversalResult, setTraversalResult] = useState<number[]>([]);
  const [nodeCount, setNodeCount] = useState(0);
  const [treeHeight, setTreeHeight] = useState(0);
  const [searchPath, setSearchPath] = useState<string[]>([]);
  const [foundNode, setFoundNode] = useState<TreeNode | null>(null);
  const [showMemory, setShowMemory] = useState(false);
  const { voiceEnabled, setVoiceEnabled, speakOperation, speakStep, speakResult } = useVisualizerVoice({ minInterval: 1200 });

  // Calculate tree properties
  const calculateTreeProperties = useCallback((node: TreeNode | null): { count: number; height: number } => {
    if (!node) return { count: 0, height: 0 };
    
    const leftProps = calculateTreeProperties(node.left || null);
    const rightProps = calculateTreeProperties(node.right || null);
    
    return {
      count: 1 + leftProps.count + rightProps.count,
      height: 1 + Math.max(leftProps.height, rightProps.height)
    };
  }, []);

  // Calculate node positions for visualization
  const calculatePositions = useCallback((node: TreeNode | null, x: number = 400, y: number = 50, level: number = 0, spacing: number = 200): TreeNode | null => {
    if (!node) return null;
    
    const newNode = { ...node, x, y, level };
    const nextSpacing = spacing * 0.6;
    
    if (node.left) {
      newNode.left = calculatePositions(node.left, x - spacing, y + 80, level + 1, nextSpacing);
    }
    if (node.right) {
      newNode.right = calculatePositions(node.right, x + spacing, y + 80, level + 1, nextSpacing);
    }
    
    return newNode;
  }, []);

  // Insert node
  const insertNode = useCallback((root: TreeNode | null, value: number): TreeNode => {
    if (!root) {
      return { id: `node-${Date.now()}-${Math.random()}`, value };
    }
    
    if (value < root.value) {
      root.left = insertNode(root.left || null, value);
    } else if (value > root.value) {
      root.right = insertNode(root.right || null, value);
    }
    
    return root;
  }, []);

  // Find minimum node (for deletion)
  const findMin = (node: TreeNode): TreeNode => {
    while (node.left) {
      node = node.left;
    }
    return node;
  };

  // Delete node
  const deleteNode = useCallback((root: TreeNode | null, value: number): TreeNode | null => {
    if (!root) return null;
    
    if (value < root.value) {
      root.left = deleteNode(root.left || null, value);
    } else if (value > root.value) {
      root.right = deleteNode(root.right || null, value);
    } else {
      // Node to delete found
      if (!root.left && !root.right) {
        return null; // Leaf node
      } else if (!root.left) {
        return root.right; // Only right child
      } else if (!root.right) {
        return root.left; // Only left child
      } else {
        // Node with two children
        const minRight = findMin(root.right);
        root.value = minRight.value;
        root.right = deleteNode(root.right, minRight.value);
      }
    }
    
    return root;
  }, []);

  // Search for a node
  const searchNode = useCallback((root: TreeNode | null, value: number, path: string[] = []): { found: TreeNode | null; path: string[] } => {
    if (!root) return { found: null, path };
    
    path.push(`${root.value}`);
    
    if (value === root.value) {
      return { found: root, path };
    } else if (value < root.value) {
      return searchNode(root.left || null, value, path);
    } else {
      return searchNode(root.right || null, value, path);
    }
  }, []);

  // Traversal algorithms
  const generateTraversalSteps = useCallback((root: TreeNode | null, type: string): TraversalStep[] => {
    const steps: TraversalStep[] = [];
    const result: number[] = [];
    const path: string[] = [];

    const inorderTraversal = (node: TreeNode | null) => {
      if (!node) return;
      
      // Visit left
      if (node.left) {
        path.push(`Visit left child of ${node.value}`);
        steps.push({
          node: { ...node, highlighted: true },
          action: 'visit',
          description: `Moving to left child of ${node.value}`,
          traversalOrder: [...result],
          currentPath: [...path]
        });
        inorderTraversal(node.left);
      }
      
      // Process current
      path.push(`Process ${node.value}`);
      result.push(node.value);
      steps.push({
        node: { ...node, visited: true },
        action: 'process',
        description: `Processing node ${node.value} (adding to result)`,
        traversalOrder: [...result],
        currentPath: [...path]
      });
      
      // Visit right
      if (node.right) {
        path.push(`Visit right child of ${node.value}`);
        steps.push({
          node: { ...node, highlighted: true },
          action: 'visit',
          description: `Moving to right child of ${node.value}`,
          traversalOrder: [...result],
          currentPath: [...path]
        });
        inorderTraversal(node.right);
      }
    };

    const preorderTraversal = (node: TreeNode | null) => {
      if (!node) return;
      
      // Process current first
      path.push(`Process ${node.value}`);
      result.push(node.value);
      steps.push({
        node: { ...node, visited: true },
        action: 'process',
        description: `Processing node ${node.value} (adding to result)`,
        traversalOrder: [...result],
        currentPath: [...path]
      });
      
      // Visit left
      if (node.left) {
        path.push(`Visit left child of ${node.value}`);
        steps.push({
          node: { ...node, highlighted: true },
          action: 'visit',
          description: `Moving to left child of ${node.value}`,
          traversalOrder: [...result],
          currentPath: [...path]
        });
        preorderTraversal(node.left);
      }
      
      // Visit right
      if (node.right) {
        path.push(`Visit right child of ${node.value}`);
        steps.push({
          node: { ...node, highlighted: true },
          action: 'visit',
          description: `Moving to right child of ${node.value}`,
          traversalOrder: [...result],
          currentPath: [...path]
        });
        preorderTraversal(node.right);
      }
    };

    const postorderTraversal = (node: TreeNode | null) => {
      if (!node) return;
      
      // Visit left
      if (node.left) {
        path.push(`Visit left child of ${node.value}`);
        steps.push({
          node: { ...node, highlighted: true },
          action: 'visit',
          description: `Moving to left child of ${node.value}`,
          traversalOrder: [...result],
          currentPath: [...path]
        });
        postorderTraversal(node.left);
      }
      
      // Visit right
      if (node.right) {
        path.push(`Visit right child of ${node.value}`);
        steps.push({
          node: { ...node, highlighted: true },
          action: 'visit',
          description: `Moving to right child of ${node.value}`,
          traversalOrder: [...result],
          currentPath: [...path]
        });
        postorderTraversal(node.right);
      }
      
      // Process current last
      path.push(`Process ${node.value}`);
      result.push(node.value);
      steps.push({
        node: { ...node, visited: true },
        action: 'process',
        description: `Processing node ${node.value} (adding to result)`,
        traversalOrder: [...result],
        currentPath: [...path]
      });
    };

    if (root) {
      switch (type) {
        case 'inorder':
          inorderTraversal(root);
          break;
        case 'preorder':
          preorderTraversal(root);
          break;
        case 'postorder':
          postorderTraversal(root);
          break;
      }
    }

    return steps;
  }, []);

  // Handle operations
  const handleInsert = async () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      toast.error('Please enter a valid number');
      return;
    }

    setIsAnimating(true);
    speakOperation('BST Insert', `Insert ${value}`);
    const newRoot = insertNode(root, value);
    const positionedRoot = calculatePositions(newRoot);
    setRoot(positionedRoot);
    
    const props = calculateTreeProperties(positionedRoot);
    setNodeCount(props.count);
    setTreeHeight(props.height);
    
    setInputValue('');
    toast.success(`Inserted ${value} into the tree`);
    speakResult(`Inserted ${value}`);
    
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleSearch = async () => {
    const value = parseInt(searchValue);
    if (isNaN(value)) {
      toast.error('Please enter a valid number');
      return;
    }

    setIsAnimating(true);
    speakOperation('BST Search', `Search ${value}`);
    const { found, path } = searchNode(root, value);
    setSearchPath(path);
    setFoundNode(found);
    
    if (found) {
      toast.success(`Found ${value} in the tree! Path: ${path.join(' → ')}`);
      speakResult(`Found ${value}`);
    } else {
      toast.error(`${value} not found in the tree. Search path: ${path.join(' → ')}`);
      speakResult(`${value} not found`);
    }
    
    setTimeout(() => {
      setIsAnimating(false);
      setSearchPath([]);
      setFoundNode(null);
    }, 3000);
  };

  const handleDelete = async () => {
    const value = parseInt(deleteValue);
    if (isNaN(value)) {
      toast.error('Please enter a valid number');
      return;
    }

    setIsAnimating(true);
    speakOperation('BST Delete', `Delete ${value}`);
    const newRoot = deleteNode(root, value);
    const positionedRoot = calculatePositions(newRoot);
    setRoot(positionedRoot);
    
    const props = calculateTreeProperties(positionedRoot);
    setNodeCount(props.count);
    setTreeHeight(props.height);
    
    setDeleteValue('');
    toast.success(`Deleted ${value} from the tree`);
    speakResult(`Deleted ${value}`);
    
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleTraversal = () => {
    if (!root) {
      toast.error('Tree is empty');
      return;
    }

    const steps = generateTraversalSteps(root, traversalType);
    setTraversalSteps(steps);
    setCurrentStepIndex(0);
    setTraversalResult([]);
    speakOperation('BST Traversal', `${traversalType} order`);
  };

  const nextStep = () => {
    if (currentStepIndex < traversalSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      const step = traversalSteps[currentStepIndex + 1];
      setTraversalResult(step.traversalOrder);
      speakStep('', step.description);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      const step = traversalSteps[currentStepIndex - 1];
      setTraversalResult(step.traversalOrder);
      speakStep('', step.description);
    }
  };

  const resetTraversal = () => {
    setTraversalSteps([]);
    setCurrentStepIndex(-1);
    setTraversalResult([]);
  };

  const handleReset = () => {
    setRoot(null);
    setNodeCount(0);
    setTreeHeight(0);
    setInputValue('');
    setSearchValue('');
    setDeleteValue('');
    resetTraversal();
    toast.success('Tree reset');
  };

  const createSampleTree = () => {
    let newRoot: TreeNode | null = null;
    const values = [50, 30, 70, 20, 40, 60, 80];
    
    values.forEach(value => {
      newRoot = insertNode(newRoot, value);
    });
    
    const positionedRoot = calculatePositions(newRoot);
    setRoot(positionedRoot);
    
    const props = calculateTreeProperties(positionedRoot);
    setNodeCount(props.count);
    setTreeHeight(props.height);
    
    toast.success('Sample tree created');
  };

  // Render tree nodes and edges
  const renderTree = (node: TreeNode | null): JSX.Element | null => {
    if (!node || !node.x || !node.y) return null;

    const isHighlighted = searchPath.includes(node.value.toString()) || 
                         (foundNode && foundNode.value === node.value);
    const isCurrentStep = traversalSteps[currentStepIndex]?.node.value === node.value;

    return (
      <g key={node.id}>
        {/* Edges */}
        {node.left && node.left.x && node.left.y && (
          <motion.line
            x1={node.x}
            y1={node.y}
            x2={node.left.x}
            y2={node.left.y}
            stroke="#6b7280"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />
        )}
        {node.right && node.right.x && node.right.y && (
          <motion.line
            x1={node.x}
            y1={node.y}
            x2={node.right.x}
            y2={node.right.y}
            stroke="#6b7280"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />
        )}

        {/* Node */}
        <motion.circle
          cx={node.x}
          cy={node.y}
          r="25"
          fill={
            isCurrentStep && traversalSteps[currentStepIndex]?.action === 'process' 
              ? '#10b981' 
              : isHighlighted 
              ? '#f59e0b' 
              : isCurrentStep 
              ? '#3b82f6' 
              : '#e5e7eb'
          }
          stroke={isCurrentStep ? '#1f2937' : '#6b7280'}
          strokeWidth="2"
          initial={{ scale: 0 }}
          animate={{ 
            scale: isCurrentStep ? 1.2 : 1,
            fill: isCurrentStep && traversalSteps[currentStepIndex]?.action === 'process' 
              ? '#10b981' 
              : isHighlighted 
              ? '#f59e0b' 
              : isCurrentStep 
              ? '#3b82f6' 
              : '#e5e7eb'
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Node value */}
        <motion.text
          x={node.x}
          y={node.y}
          textAnchor="middle"
          dy="0.35em"
          fontSize="14"
          fontWeight="bold"
          fill={isCurrentStep || isHighlighted ? '#ffffff' : '#1f2937'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {node.value}
        </motion.text>

        {/* Level indicator */}
        <motion.text
          x={node.x}
          y={node.y - 35}
          textAnchor="middle"
          fontSize="10"
          fill="#6b7280"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          L{node.level}
        </motion.text>

        {/* Recursively render children */}
        {renderTree(node.left)}
        {renderTree(node.right)}
      </g>
    );
  };

  const currentStep = traversalSteps[currentStepIndex];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Insert */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Insert Node</label>
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter number"
                disabled={isAnimating}
                onKeyPress={(e) => e.key === 'Enter' && handleInsert()}
              />
              <Button onClick={handleInsert} disabled={isAnimating}>
                Insert
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Search Node</label>
            <div className="flex gap-2">
              <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Enter number"
                disabled={isAnimating}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={isAnimating || !root}>
                Search
              </Button>
            </div>
          </div>

          {/* Delete */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Delete Node</label>
            <div className="flex gap-2">
              <Input
                value={deleteValue}
                onChange={(e) => setDeleteValue(e.target.value)}
                placeholder="Enter number"
                disabled={isAnimating}
                onKeyPress={(e) => e.key === 'Enter' && handleDelete()}
              />
              <Button onClick={handleDelete} disabled={isAnimating || !root}>
                Delete
              </Button>
            </div>
          </div>

          {/* Traversal */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Traversal</label>
            <div className="flex gap-2">
              <Select value={traversalType} onValueChange={(value: any) => setTraversalType(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inorder">In-order</SelectItem>
                  <SelectItem value="preorder">Pre-order</SelectItem>
                  <SelectItem value="postorder">Post-order</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleTraversal} disabled={!root}>
                Traverse
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button onClick={createSampleTree} variant="outline">
            Sample Tree
          </Button>
          <Button onClick={handleReset} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Tree Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{nodeCount}</div>
          <div className="text-sm text-blue-600">Total Nodes</div>
        </div>
        <div className="bg-green-50 dark:bg-green-950 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{treeHeight}</div>
          <div className="text-sm text-green-600">Tree Height</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-950 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {root ? Math.ceil(Math.log2(nodeCount + 1)) : 0}
          </div>
          <div className="text-sm text-purple-600">Min Height</div>
        </div>
      </div>

      {/* Traversal Controls */}
      <div className="flex justify-center">
        <VisualizerControls
          showMemory={showMemory}
          onToggleMemory={setShowMemory}
          voiceEnabled={voiceEnabled}
          onToggleVoice={setVoiceEnabled}
        />
      </div>

      {traversalSteps.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {traversalType.charAt(0).toUpperCase() + traversalType.slice(1)} Traversal
            </h3>
            <div className="flex gap-2">
              <Button onClick={prevStep} disabled={currentStepIndex <= 0} size="sm">
                Previous
              </Button>
              <Button onClick={nextStep} disabled={currentStepIndex >= traversalSteps.length - 1} size="sm">
                <StepForward className="h-4 w-4 mr-2" />
                Next
              </Button>
              <Button onClick={resetTraversal} variant="outline" size="sm">
                Reset
              </Button>
            </div>
          </div>

          {currentStep && (
            <div className="space-y-2">
              <div className="text-sm font-medium">{currentStep.description}</div>
              <div className="text-sm text-muted-foreground">
                Step {currentStepIndex + 1} of {traversalSteps.length}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Result so far:</span>
                <div className="flex gap-1">
                  {traversalResult.map((value, index) => (
                    <Badge key={index} variant="secondary">
                      {value}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tree Visualization */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 rounded-xl p-8 border-2 border-dashed border-blue-200 dark:border-blue-800">
        {root ? (
          <div className="w-full h-96 overflow-auto">
            <svg width="800" height="400" className="mx-auto">
              <AnimatePresence>
                {renderTree(root)}
              </AnimatePresence>
            </svg>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-500 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.5 2.5L16 4.5l2.5 2.5L16 9.5l2.5 2.5L16 14.5l2.5 2.5L16 19.5l2.5 2.5L16 24.5" />
              </svg>
            </div>
            <p className="text-gray-500">Tree is empty. Insert some nodes to get started!</p>
          </div>
        )}
      </div>

      {showMemory && (
        <MemoryLayout
          data={traversalResult}
          title="Traversal Result Memory"
          baseAddress={7000}
          wordSize={4}
        />
      )}

      {/* Algorithm Info */}
      <div className="bg-card border rounded-lg p-4">
        <h4 className="font-semibold mb-2">🌳 Binary Search Tree Properties:</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
          <li>Left subtree contains only nodes with values less than the parent node</li>
          <li>Right subtree contains only nodes with values greater than the parent node</li>
          <li>Both left and right subtrees are also binary search trees</li>
          <li>In-order traversal gives sorted sequence</li>
          <li>Average time complexity: O(log n) for search, insert, delete</li>
          <li>Worst case time complexity: O(n) when tree becomes skewed</li>
        </ul>
      </div>
    </div>
  );
}
