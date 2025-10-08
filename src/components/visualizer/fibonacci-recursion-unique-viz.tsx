import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, RotateCcw, GitBranch, Zap, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FibNode {
  id: number;
  n: number;
  result?: number;
  x: number;
  y: number;
  children: FibNode[];
  state: 'pending' | 'computing' | 'complete' | 'cached';
  callCount: number;
}

interface Step {
  tree: FibNode;
  currentNode?: FibNode;
  message: string;
  totalCalls: number;
  cacheHits: number;
}

type Method = 'naive' | 'memoized' | 'iterative';

export function FibonacciRecursionUniqueViz() {
  const [method, setMethod] = useState<Method>('naive');
  const [input, setInput] = useState(5);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [showStats, setShowStats] = useState(true);

  // Generate naive recursive Fibonacci tree
  const generateNaiveSteps = (n: number): Step[] => {
    const steps: Step[] = [];
    let nodeId = 0;
    let totalCalls = 0;
    const callCounts: Map<number, number> = new Map();

    const buildTree = (num: number, x: number, y: number, width: number): FibNode => {
      totalCalls++;
      const count = (callCounts.get(num) || 0) + 1;
      callCounts.set(num, count);

      const node: FibNode = {
        id: nodeId++,
        n: num,
        x,
        y,
        children: [],
        state: 'pending',
        callCount: count
      };

      steps.push({
        tree: JSON.parse(JSON.stringify(node)),
        currentNode: node,
        message: `Computing fib(${num}) - Call #${totalCalls}`,
        totalCalls,
        cacheHits: 0
      });

      if (num <= 1) {
        node.result = num;
        node.state = 'complete';
        steps.push({
          tree: JSON.parse(JSON.stringify(node)),
          currentNode: node,
          message: `Base case: fib(${num}) = ${num}`,
          totalCalls,
          cacheHits: 0
        });
        return node;
      }

      node.state = 'computing';
      
      const leftChild = buildTree(num - 1, x - width / 2, y + 80, width / 2);
      node.children.push(leftChild);
      
      const rightChild = buildTree(num - 2, x + width / 2, y + 80, width / 2);
      node.children.push(rightChild);

      node.result = leftChild.result! + rightChild.result!;
      node.state = 'complete';
      
      steps.push({
        tree: JSON.parse(JSON.stringify(node)),
        currentNode: node,
        message: `fib(${num}) = fib(${num - 1}) + fib(${num - 2}) = ${leftChild.result} + ${rightChild.result} = ${node.result}`,
        totalCalls,
        cacheHits: 0
      });

      return node;
    };

    const root = buildTree(n, 400, 50, 300);
    
    steps.push({
      tree: root,
      message: `Complete! fib(${n}) = ${root.result} (${totalCalls} calls)`,
      totalCalls,
      cacheHits: 0
    });

    return steps;
  };

  // Generate memoized Fibonacci steps
  const generateMemoizedSteps = (n: number): Step[] => {
    const steps: Step[] = [];
    let nodeId = 0;
    let totalCalls = 0;
    let cacheHits = 0;
    const memo: Map<number, number> = new Map();
    const callCounts: Map<number, number> = new Map();

    const buildTree = (num: number, x: number, y: number, width: number): FibNode => {
      totalCalls++;
      const count = (callCounts.get(num) || 0) + 1;
      callCounts.set(num, count);

      const node: FibNode = {
        id: nodeId++,
        n: num,
        x,
        y,
        children: [],
        state: 'pending',
        callCount: count
      };

      if (memo.has(num)) {
        cacheHits++;
        node.result = memo.get(num);
        node.state = 'cached';
        steps.push({
          tree: JSON.parse(JSON.stringify(node)),
          currentNode: node,
          message: `Cache hit! fib(${num}) = ${node.result} (saved computation)`,
          totalCalls,
          cacheHits
        });
        return node;
      }

      steps.push({
        tree: JSON.parse(JSON.stringify(node)),
        currentNode: node,
        message: `Computing fib(${num}) - Call #${totalCalls}`,
        totalCalls,
        cacheHits
      });

      if (num <= 1) {
        node.result = num;
        node.state = 'complete';
        memo.set(num, num);
        steps.push({
          tree: JSON.parse(JSON.stringify(node)),
          currentNode: node,
          message: `Base case: fib(${num}) = ${num}`,
          totalCalls,
          cacheHits
        });
        return node;
      }

      node.state = 'computing';
      
      const leftChild = buildTree(num - 1, x - width / 2, y + 80, width / 2);
      node.children.push(leftChild);
      
      const rightChild = buildTree(num - 2, x + width / 2, y + 80, width / 2);
      node.children.push(rightChild);

      node.result = leftChild.result! + rightChild.result!;
      node.state = 'complete';
      memo.set(num, node.result);
      
      steps.push({
        tree: JSON.parse(JSON.stringify(node)),
        currentNode: node,
        message: `fib(${num}) = ${leftChild.result} + ${rightChild.result} = ${node.result} (cached)`,
        totalCalls,
        cacheHits
      });

      return node;
    };

    const root = buildTree(n, 400, 50, 300);
    
    steps.push({
      tree: root,
      message: `Complete! fib(${n}) = ${root.result} (${totalCalls} calls, ${cacheHits} cache hits)`,
      totalCalls,
      cacheHits
    });

    return steps;
  };

  const startVisualization = () => {
    const n = Math.min(input, method === 'naive' ? 6 : 8);
    let newSteps: Step[] = [];

    switch (method) {
      case 'naive':
        newSteps = generateNaiveSteps(n);
        break;
      case 'memoized':
        newSteps = generateMemoizedSteps(n);
        break;
    }

    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);
  };

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

  const renderNode = (node: FibNode, isActive: boolean) => {
    const getColor = () => {
      if (node.state === 'cached') return 'bg-purple-500 border-purple-600';
      if (node.state === 'complete') return 'bg-green-500 border-green-600';
      if (node.state === 'computing') return 'bg-yellow-500 border-yellow-600';
      return 'bg-gray-400 border-gray-500';
    };

    return (
      <g key={node.id}>
        {/* Draw lines to children */}
        {node.children.map((child) => (
          <line
            key={`line-${node.id}-${child.id}`}
            x1={node.x}
            y1={node.y + 20}
            x2={child.x}
            y2={child.y - 20}
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-300 dark:text-gray-600"
          />
        ))}

        {/* Node circle */}
        <motion.g
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <circle
            cx={node.x}
            cy={node.y}
            r="25"
            className={`${getColor()} ${isActive ? 'animate-pulse' : ''}`}
            stroke="currentColor"
            strokeWidth="3"
          />
          <text
            x={node.x}
            y={node.y - 5}
            textAnchor="middle"
            className="fill-white font-bold text-sm"
          >
            {node.n}
          </text>
          {node.result !== undefined && (
            <text
              x={node.x}
              y={node.y + 8}
              textAnchor="middle"
              className="fill-white font-bold text-xs"
            >
              ={node.result}
            </text>
          )}
          {node.callCount > 1 && (
            <text
              x={node.x + 30}
              y={node.y - 20}
              textAnchor="middle"
              className="fill-red-600 font-bold text-xs"
            >
              ×{node.callCount}
            </text>
          )}
        </motion.g>

        {/* Recursively render children */}
        {node.children.map((child) => renderNode(child, false))}
      </g>
    );
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          <GitBranch className="h-6 w-6 text-blue-600" />
          Fibonacci Recursion Tree
        </h3>
        <p className="text-muted-foreground">
          Visualize the recursive tree and see why memoization is crucial!
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Method</label>
          <Select value={method} onValueChange={(v: Method) => setMethod(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="naive">Naive Recursion</SelectItem>
              <SelectItem value="memoized">With Memoization</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            n (max {method === 'naive' ? 6 : 8})
          </label>
          <Input
            type="number"
            value={input}
            onChange={(e) => setInput(Math.min(method === 'naive' ? 6 : 8, Math.max(0, parseInt(e.target.value) || 0)))}
            min="0"
            max={method === 'naive' ? 6 : 8}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Speed</label>
          <Select value={speed.toString()} onValueChange={(v) => setSpeed(parseInt(v))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1200">Slow</SelectItem>
              <SelectItem value="800">Normal</SelectItem>
              <SelectItem value="400">Fast</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 items-end">
          <Button onClick={startVisualization} className="flex-1">
            <RotateCcw className="h-4 w-4 mr-2" />
            Start
          </Button>
          {steps.length > 0 && (
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              variant="outline"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </div>

      {/* Warning for naive method */}
      {method === 'naive' && input > 6 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-yellow-800 dark:text-yellow-200">
              Performance Warning
            </div>
            <div className="text-sm text-yellow-700 dark:text-yellow-300">
              Naive recursion grows exponentially! Limited to n≤6 for visualization.
              Use memoization for larger values.
            </div>
          </div>
        </div>
      )}

      {/* Visualization */}
      {steps.length > 0 && currentStepData && (
        <div className="space-y-6">
          {/* Current Message */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg p-4 text-center border-2">
            <div className="text-lg font-semibold">{currentStepData.message}</div>
          </div>

          {/* Stats */}
          {showStats && (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-card border rounded-lg p-4 text-center">
                <div className="text-sm text-muted-foreground">Total Calls</div>
                <div className="text-2xl font-bold text-blue-600">
                  {currentStepData.totalCalls}
                </div>
              </div>
              <div className="bg-card border rounded-lg p-4 text-center">
                <div className="text-sm text-muted-foreground">Cache Hits</div>
                <div className="text-2xl font-bold text-purple-600">
                  {currentStepData.cacheHits}
                </div>
              </div>
              <div className="bg-card border rounded-lg p-4 text-center">
                <div className="text-sm text-muted-foreground">Efficiency</div>
                <div className="text-2xl font-bold text-green-600">
                  {currentStepData.totalCalls > 0
                    ? Math.round((1 - currentStepData.cacheHits / currentStepData.totalCalls) * 100)
                    : 100}%
                </div>
              </div>
            </div>
          )}

          {/* Tree Visualization */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-2 overflow-x-auto">
            <svg width="800" height="400" className="mx-auto">
              {currentStepData.tree && renderNode(
                currentStepData.tree,
                currentStepData.currentNode?.id === currentStepData.tree.id
              )}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gray-400 border-2 border-gray-500" />
              <span>Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500 border-2 border-yellow-600" />
              <span>Computing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-green-600" />
              <span>Complete</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-purple-500 border-2 border-purple-600" />
              <span>Cached</span>
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
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all"
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
          <h4 className="font-semibold mb-3 text-red-600">⚠️ Naive Recursion</h4>
          <div className="space-y-2 text-sm">
            <div>• Time: O(2^n) - exponential!</div>
            <div>• Space: O(n) for call stack</div>
            <div>• Recalculates same values</div>
            <div>• Very slow for large n</div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-3 text-purple-600">⚡ With Memoization</h4>
          <div className="space-y-2 text-sm">
            <div>• Time: O(n) - linear!</div>
            <div>• Space: O(n) for cache</div>
            <div>• Caches computed values</div>
            <div>• Dramatically faster</div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-3 text-green-600">🎯 Key Insight</h4>
          <div className="space-y-2 text-sm">
            <div>• fib(n) calls fib(n-1) & fib(n-2)</div>
            <div>• Creates overlapping subproblems</div>
            <div>• Memoization avoids redundancy</div>
            <div>• Classic DP optimization</div>
          </div>
        </div>
      </div>
    </div>
  );
}
