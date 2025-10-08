import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, RotateCcw, Plus, Search, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  x: number;
  y: number;
}

interface BSTStep {
  tree: TreeNode | null;
  currentNode: number | null;
  comparisonPath: number[];
  message: string;
  operation: 'insert' | 'search' | 'delete' | 'complete';
  found: boolean;
}

type Operation = 'insert' | 'search' | 'delete';

export function BSTUniqueViz() {
  const [operation, setOperation] = useState<Operation>('insert');
  const [inputValue, setInputValue] = useState(25);
  const [steps, setSteps] = useState<BSTStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [initialTree, setInitialTree] = useState<TreeNode | null>(null);

  const createInitialTree = (): TreeNode => {
    return {
      val: 50,
      x: 400,
      y: 50,
      left: {
        val: 30,
        x: 250,
        y: 150,
        left: {
          val: 20,
          x: 180,
          y: 250,
          left: null,
          right: null
        },
        right: {
          val: 40,
          x: 320,
          y: 250,
          left: null,
          right: null
        }
      },
      right: {
        val: 70,
        x: 550,
        y: 150,
        left: {
          val: 60,
          x: 480,
          y: 250,
          left: null,
          right: null
        },
        right: {
          val: 80,
          x: 620,
          y: 250,
          left: null,
          right: null
        }
      }
    };
  };

  const copyTree = (node: TreeNode | null): TreeNode | null => {
    if (!node) return null;
    return {
      val: node.val,
      x: node.x,
      y: node.y,
      left: copyTree(node.left),
      right: copyTree(node.right)
    };
  };

  const updatePositions = (node: TreeNode | null, x: number, y: number, offset: number): void => {
    if (!node) return;
    node.x = x;
    node.y = y;
    if (node.left) updatePositions(node.left, x - offset, y + 100, offset / 2);
    if (node.right) updatePositions(node.right, x + offset, y + 100, offset / 2);
  };

  const generateInsertSteps = (root: TreeNode | null, value: number): BSTStep[] => {
    const steps: BSTStep[] = [];
    const path: number[] = [];
    let treeCopy = copyTree(root);

    steps.push({
      tree: copyTree(treeCopy),
      currentNode: null,
      comparisonPath: [],
      message: `Inserting ${value} into BST`,
      operation: 'insert',
      found: false
    });

    const insert = (node: TreeNode | null, parent: TreeNode | null, isLeft: boolean): TreeNode => {
      if (!node) {
        const newNode: TreeNode = {
          val: value,
          x: 0,
          y: 0,
          left: null,
          right: null
        };
        
        if (parent) {
          if (isLeft) parent.left = newNode;
          else parent.right = newNode;
        }
        
        updatePositions(treeCopy!, 400, 50, 150);
        steps.push({
          tree: copyTree(treeCopy),
          currentNode: value,
          comparisonPath: [...path],
          message: `Inserted ${value} as ${isLeft ? 'left' : 'right'} child`,
          operation: 'insert',
          found: true
        });
        
        return newNode;
      }

      path.push(node.val);
      steps.push({
        tree: copyTree(treeCopy),
        currentNode: node.val,
        comparisonPath: [...path],
        message: `Compare ${value} with ${node.val}: ${value < node.val ? `${value} < ${node.val}, go left` : `${value} > ${node.val}, go right`}`,
        operation: 'insert',
        found: false
      });

      if (value < node.val) {
        node.left = insert(node.left, node, true);
      } else if (value > node.val) {
        node.right = insert(node.right, node, false);
      }

      return node;
    };

    if (treeCopy) {
      insert(treeCopy, null, false);
    }

    steps.push({
      tree: copyTree(treeCopy),
      currentNode: null,
      comparisonPath: [],
      message: `Complete! ${value} inserted successfully`,
      operation: 'complete',
      found: true
    });

    return steps;
  };

  const generateSearchSteps = (root: TreeNode | null, value: number): BSTStep[] => {
    const steps: BSTStep[] = [];
    const path: number[] = [];

    steps.push({
      tree: copyTree(root),
      currentNode: null,
      comparisonPath: [],
      message: `Searching for ${value} in BST`,
      operation: 'search',
      found: false
    });

    const search = (node: TreeNode | null): boolean => {
      if (!node) {
        steps.push({
          tree: copyTree(root),
          currentNode: null,
          comparisonPath: [...path],
          message: `${value} not found in BST`,
          operation: 'search',
          found: false
        });
        return false;
      }

      path.push(node.val);
      steps.push({
        tree: copyTree(root),
        currentNode: node.val,
        comparisonPath: [...path],
        message: `Compare ${value} with ${node.val}`,
        operation: 'search',
        found: false
      });

      if (value === node.val) {
        steps.push({
          tree: copyTree(root),
          currentNode: node.val,
          comparisonPath: [...path],
          message: `Found ${value}!`,
          operation: 'search',
          found: true
        });
        return true;
      }

      if (value < node.val) {
        steps.push({
          tree: copyTree(root),
          currentNode: node.val,
          comparisonPath: [...path],
          message: `${value} < ${node.val}, search left subtree`,
          operation: 'search',
          found: false
        });
        return search(node.left);
      } else {
        steps.push({
          tree: copyTree(root),
          currentNode: node.val,
          comparisonPath: [...path],
          message: `${value} > ${node.val}, search right subtree`,
          operation: 'search',
          found: false
        });
        return search(node.right);
      }
    };

    search(root);

    steps.push({
      tree: copyTree(root),
      currentNode: null,
      comparisonPath: [],
      message: `Search complete`,
      operation: 'complete',
      found: path[path.length - 1] === value
    });

    return steps;
  };

  const startVisualization = () => {
    const tree = initialTree || createInitialTree();
    setInitialTree(tree);

    let newSteps: BSTStep[] = [];

    switch (operation) {
      case 'insert':
        newSteps = generateInsertSteps(tree, inputValue);
        break;
      case 'search':
        newSteps = generateSearchSteps(tree, inputValue);
        break;
    }

    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const reset = () => {
    setInitialTree(createInitialTree());
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    if (!initialTree) {
      setInitialTree(createInitialTree());
    }
  }, []);

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, steps.length, speed]);

  const renderTree = (node: TreeNode | null, currentStepData: BSTStep): JSX.Element | null => {
    if (!node) return null;

    const isCurrentNode = node.val === currentStepData.currentNode;
    const isInPath = currentStepData.comparisonPath.includes(node.val);
    const isFound = currentStepData.found && node.val === inputValue;

    const getNodeColor = () => {
      if (isFound) return 'fill-green-500';
      if (isCurrentNode) return 'fill-blue-500';
      if (isInPath) return 'fill-yellow-300';
      return 'fill-gray-300';
    };

    return (
      <g key={node.val}>
        {node.left && (
          <line
            x1={node.x}
            y1={node.y + 25}
            x2={node.left.x}
            y2={node.left.y - 25}
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-400"
          />
        )}
        {node.right && (
          <line
            x1={node.x}
            y1={node.y + 25}
            x2={node.right.x}
            y2={node.right.y - 25}
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-400"
          />
        )}

        <motion.g
          initial={{ scale: 0 }}
          animate={{ scale: isCurrentNode ? 1.2 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <circle
            cx={node.x}
            cy={node.y}
            r="25"
            className={`${getNodeColor()} stroke-gray-700`}
            strokeWidth="3"
          />
          <text
            x={node.x}
            y={node.y + 7}
            textAnchor="middle"
            className="fill-white font-bold text-lg"
          >
            {node.val}
          </text>
        </motion.g>

        {node.left && renderTree(node.left, currentStepData)}
        {node.right && renderTree(node.right, currentStepData)}
      </g>
    );
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Binary Search Tree Operations</h3>
        <p className="text-muted-foreground">
          Visualize BST insert, search, and delete with comparison paths
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Operation</label>
          <Select value={operation} onValueChange={(v: Operation) => setOperation(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="insert">Insert</SelectItem>
              <SelectItem value="search">Search</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Value</label>
          <Input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Speed</label>
          <Select value={speed.toString()} onValueChange={(v) => setSpeed(parseInt(v))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1500">Slow</SelectItem>
              <SelectItem value="1000">Normal</SelectItem>
              <SelectItem value="500">Fast</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 items-end">
          <Button onClick={startVisualization} className="flex-1">
            {operation === 'insert' && <Plus className="h-4 w-4 mr-2" />}
            {operation === 'search' && <Search className="h-4 w-4 mr-2" />}
            Start
          </Button>
          <Button onClick={reset} variant="outline">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {steps.length > 0 && currentStepData && (
        <div className="space-y-6">
          <div className={`rounded-lg p-4 text-center border-2 ${
            currentStepData.found ? 'bg-green-100 border-green-400 text-green-800' :
            currentStepData.operation === 'insert' ? 'bg-blue-100 border-blue-400 text-blue-800' :
            'bg-yellow-100 border-yellow-400 text-yellow-800'
          }`}>
            <div className="text-lg font-semibold">{currentStepData.message}</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-2">
            <svg width="800" height="400" className="mx-auto">
              {currentStepData.tree && renderTree(currentStepData.tree, currentStepData)}
            </svg>
          </div>

          <div className="bg-card border rounded-lg p-4">
            <h4 className="font-semibold mb-3">Comparison Path</h4>
            <div className="flex flex-wrap gap-2">
              {currentStepData.comparisonPath.length === 0 ? (
                <div className="text-sm text-muted-foreground">No comparisons yet</div>
              ) : (
                currentStepData.comparisonPath.map((val, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Badge variant="outline">{val}</Badge>
                    {idx < currentStepData.comparisonPath.length - 1 && <span>→</span>}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <Button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              variant="outline"
              size="sm"
            >
              Previous
            </Button>
            <div className="flex-1">
              <div className="text-center text-sm text-muted-foreground mb-2">
                Step {currentStep + 1} of {steps.length}
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>
            <Button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              disabled={currentStep === steps.length - 1}
              variant="outline"
              size="sm"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-3 text-blue-600">🌳 BST Property</h4>
          <div className="space-y-2 text-sm">
            <div>• Left subtree &lt; Node</div>
            <div>• Right subtree &gt; Node</div>
            <div>• Enables binary search</div>
            <div>• O(log n) average case</div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-3 text-green-600">⚡ Operations</h4>
          <div className="space-y-2 text-sm">
            <div><strong>Insert:</strong> O(log n) avg</div>
            <div><strong>Search:</strong> O(log n) avg</div>
            <div><strong>Delete:</strong> O(log n) avg</div>
            <div><strong>Worst:</strong> O(n) if skewed</div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-3 text-purple-600">🎯 Applications</h4>
          <div className="space-y-2 text-sm">
            <div>• Database indexing</div>
            <div>• File systems</div>
            <div>• Priority queues</div>
            <div>• Symbol tables</div>
          </div>
        </div>
      </div>
    </div>
  );
}
