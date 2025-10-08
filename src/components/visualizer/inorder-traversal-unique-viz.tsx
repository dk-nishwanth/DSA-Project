import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, RotateCcw, GitBranch, ArrowLeft, ArrowRight, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TreeNode {
  val: number;
  left?: TreeNode;
  right?: TreeNode;
  x: number;
  y: number;
}

interface TraversalStep {
  currentNode: number | null;
  visited: number[];
  callStack: string[];
  message: string;
  phase: 'going-left' | 'at-root' | 'going-right' | 'complete';
  highlightPath: number[];
}

type TreeType = 'balanced' | 'skewed' | 'complete';

export function InorderTraversalUniqueViz() {
  const [treeType, setTreeType] = useState<TreeType>('balanced');
  const [steps, setSteps] = useState<TraversalStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [tree, setTree] = useState<TreeNode | null>(null);

  const trees: Record<TreeType, TreeNode> = {
    balanced: {
      val: 4,
      x: 400,
      y: 50,
      left: {
        val: 2,
        x: 250,
        y: 150,
        left: { val: 1, x: 180, y: 250 },
        right: { val: 3, x: 320, y: 250 }
      },
      right: {
        val: 6,
        x: 550,
        y: 150,
        left: { val: 5, x: 480, y: 250 },
        right: { val: 7, x: 620, y: 250 }
      }
    },
    skewed: {
      val: 1,
      x: 400,
      y: 50,
      right: {
        val: 2,
        x: 470,
        y: 120,
        right: {
          val: 3,
          x: 540,
          y: 190,
          right: { val: 4, x: 610, y: 260 }
        }
      }
    },
    complete: {
      val: 5,
      x: 400,
      y: 50,
      left: {
        val: 3,
        x: 250,
        y: 150,
        left: { val: 2, x: 180, y: 250 },
        right: { val: 4, x: 320, y: 250 }
      },
      right: {
        val: 7,
        x: 550,
        y: 150,
        left: { val: 6, x: 480, y: 250 },
        right: { val: 8, x: 620, y: 250 }
      }
    }
  };

  const generateInorderSteps = (root: TreeNode | null): TraversalStep[] => {
    const steps: TraversalStep[] = [];
    const visited: number[] = [];
    const callStack: string[] = [];

    const inorder = (node: TreeNode | null, path: number[] = []) => {
      if (!node) {
        steps.push({
          currentNode: null,
          visited: [...visited],
          callStack: [...callStack],
          message: 'Null node reached, return to parent',
          phase: 'complete',
          highlightPath: [...path]
        });
        return;
      }

      const currentPath = [...path, node.val];
      callStack.push(`inorder(${node.val})`);

      steps.push({
        currentNode: node.val,
        visited: [...visited],
        callStack: [...callStack],
        message: `Visit node ${node.val} - Going LEFT first`,
        phase: 'going-left',
        highlightPath: currentPath
      });

      // Go left
      if (node.left) {
        inorder(node.left, currentPath);
      } else {
        steps.push({
          currentNode: node.val,
          visited: [...visited],
          callStack: [...callStack],
          message: `Node ${node.val} has no left child`,
          phase: 'going-left',
          highlightPath: currentPath
        });
      }

      // Process root
      visited.push(node.val);
      steps.push({
        currentNode: node.val,
        visited: [...visited],
        callStack: [...callStack],
        message: `Process ROOT: Add ${node.val} to result`,
        phase: 'at-root',
        highlightPath: currentPath
      });

      // Go right
      steps.push({
        currentNode: node.val,
        visited: [...visited],
        callStack: [...callStack],
        message: `Node ${node.val} - Going RIGHT`,
        phase: 'going-right',
        highlightPath: currentPath
      });

      if (node.right) {
        inorder(node.right, currentPath);
      } else {
        steps.push({
          currentNode: node.val,
          visited: [...visited],
          callStack: [...callStack],
          message: `Node ${node.val} has no right child`,
          phase: 'going-right',
          highlightPath: currentPath
        });
      }

      callStack.pop();
      steps.push({
        currentNode: node.val,
        visited: [...visited],
        callStack: [...callStack],
        message: `Return from node ${node.val}`,
        phase: 'complete',
        highlightPath: currentPath
      });
    };

    steps.push({
      currentNode: null,
      visited: [],
      callStack: [],
      message: 'Starting Inorder Traversal: LEFT → ROOT → RIGHT',
      phase: 'complete',
      highlightPath: []
    });

    inorder(root);

    steps.push({
      currentNode: null,
      visited: [...visited],
      callStack: [],
      message: `Complete! Inorder result: [${visited.join(', ')}] - Notice it's sorted!`,
      phase: 'complete',
      highlightPath: []
    });

    return steps;
  };

  const startVisualization = () => {
    const selectedTree = trees[treeType];
    setTree(selectedTree);
    const newSteps = generateInorderSteps(selectedTree);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    startVisualization();
  }, [treeType]);

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

  const renderTree = (node: TreeNode | null, currentStepData: TraversalStep): JSX.Element | null => {
    if (!node) return null;

    const isCurrentNode = node.val === currentStepData.currentNode;
    const isVisited = currentStepData.visited.includes(node.val);
    const isInPath = currentStepData.highlightPath.includes(node.val);

    const getNodeColor = () => {
      if (isCurrentNode) {
        if (currentStepData.phase === 'going-left') return 'fill-blue-500';
        if (currentStepData.phase === 'at-root') return 'fill-green-500';
        if (currentStepData.phase === 'going-right') return 'fill-purple-500';
      }
      if (isVisited) return 'fill-green-300';
      if (isInPath) return 'fill-yellow-300';
      return 'fill-gray-300';
    };

    return (
      <g key={node.val}>
        {/* Lines to children */}
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

        {/* Node circle */}
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

        {/* Recursively render children */}
        {node.left && renderTree(node.left, currentStepData)}
        {node.right && renderTree(node.right, currentStepData)}
      </g>
    );
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          <GitBranch className="h-6 w-6 text-green-600" />
          Inorder Traversal (LEFT → ROOT → RIGHT)
        </h3>
        <p className="text-muted-foreground">
          Visit left subtree, process root, then visit right subtree - produces sorted output for BST!
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Tree Type</label>
          <Select value={treeType} onValueChange={(v: TreeType) => setTreeType(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="balanced">Balanced BST</SelectItem>
              <SelectItem value="skewed">Right-Skewed</SelectItem>
              <SelectItem value="complete">Complete Tree</SelectItem>
            </SelectContent>
          </Select>
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
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          {steps.length > 0 && (
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              variant="outline"
              className="flex-1"
            >
              {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
          )}
        </div>
      </div>

      {/* Visualization */}
      {steps.length > 0 && currentStepData && (
        <div className="space-y-6">
          {/* Current Message */}
          <div className={`rounded-lg p-4 text-center border-2 ${
            currentStepData.phase === 'going-left' ? 'bg-blue-100 border-blue-400 text-blue-800' :
            currentStepData.phase === 'at-root' ? 'bg-green-100 border-green-400 text-green-800' :
            currentStepData.phase === 'going-right' ? 'bg-purple-100 border-purple-400 text-purple-800' :
            'bg-gray-100 border-gray-400 text-gray-800'
          }`}>
            <div className="text-lg font-semibold flex items-center justify-center gap-2">
              {currentStepData.phase === 'going-left' && <ArrowLeft className="h-5 w-5" />}
              {currentStepData.phase === 'at-root' && <ArrowDown className="h-5 w-5" />}
              {currentStepData.phase === 'going-right' && <ArrowRight className="h-5 w-5" />}
              {currentStepData.message}
            </div>
          </div>

          {/* Tree Visualization */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-2">
            <svg width="800" height="350" className="mx-auto">
              {tree && renderTree(tree, currentStepData)}
            </svg>
          </div>

          {/* State Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Traversal Result */}
            <div className="bg-card border rounded-lg p-4">
              <h4 className="font-semibold mb-3 text-green-600">Traversal Result</h4>
              <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {currentStepData.visited.map((val, idx) => (
                    <motion.div
                      key={val}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold"
                    >
                      {val}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              {currentStepData.visited.length > 0 && (
                <div className="mt-3 text-sm text-muted-foreground">
                  Result: [{currentStepData.visited.join(', ')}]
                </div>
              )}
            </div>

            {/* Call Stack */}
            <div className="bg-card border rounded-lg p-4">
              <h4 className="font-semibold mb-3 text-blue-600">Call Stack</h4>
              <div className="space-y-1">
                {currentStepData.callStack.length === 0 ? (
                  <div className="text-sm text-muted-foreground">Empty</div>
                ) : (
                  currentStepData.callStack.map((call, idx) => (
                    <div
                      key={idx}
                      className="bg-blue-100 dark:bg-blue-900/30 px-3 py-2 rounded text-sm font-mono"
                    >
                      {call}
                    </div>
                  )).reverse()
                )}
              </div>
            </div>
          </div>

          {/* Progress */}
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
                  className="bg-gradient-to-r from-blue-600 via-green-600 to-purple-600 h-2 rounded-full transition-all"
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

      {/* Educational Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-3 text-blue-600">📚 Order</h4>
          <div className="space-y-2 text-sm">
            <div>1. <strong>LEFT</strong> subtree first</div>
            <div>2. <strong>ROOT</strong> node</div>
            <div>3. <strong>RIGHT</strong> subtree last</div>
            <div className="pt-2 border-t">
              <strong>Result:</strong> Sorted order for BST!
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-3 text-green-600">⚡ Complexity</h4>
          <div className="space-y-2 text-sm">
            <div><strong>Time:</strong> O(n)</div>
            <div><strong>Space:</strong> O(h) for call stack</div>
            <div><strong>h:</strong> height of tree</div>
            <div className="pt-2 border-t">
              Visits each node exactly once
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-3 text-purple-600">🎯 Applications</h4>
          <div className="space-y-2 text-sm">
            <div>• Get sorted data from BST</div>
            <div>• Validate BST property</div>
            <div>• Expression tree evaluation</div>
            <div>• Database indexing</div>
          </div>
        </div>
      </div>
    </div>
  );
}
