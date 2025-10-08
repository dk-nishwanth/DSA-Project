import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Search, RotateCcw, TreePine, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  x?: number;
  y?: number;
  id: string;
}

interface BSTStep {
  step: number;
  operation: string;
  currentNode?: string;
  value?: number;
  description: string;
  tree: TreeNode | null;
  path?: string[];
  found?: boolean;
}

export function BinarySearchTreeVisualizer() {
  const [operation, setOperation] = useState('insert');
  const [inputValue, setInputValue] = useState(25);
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [steps, setSteps] = useState<BSTStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showMemory, setShowMemory] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const {
    voiceEnabled,
    setVoiceEnabled,
    speed,
    setSpeed,
    isSpeaking,
    pauseSpeech,
    resumeSpeech,
    stopSpeech,
    speakOperation,
    speakStep,
    speakResult,
  } = useVisualizerVoice({ minInterval: 2000 });

  const operations = [
    { value: 'insert', label: 'Insert Node' },
    { value: 'search', label: 'Search Node' },
    { value: 'delete', label: 'Delete Node' },
    { value: 'find-min', label: 'Find Minimum' },
    { value: 'find-max', label: 'Find Maximum' },
    { value: 'inorder', label: 'Inorder Traversal' }
  ];

  // Initialize with sample tree
  useEffect(() => {
    const sampleTree = createNode(50);
    sampleTree.left = createNode(30);
    sampleTree.right = createNode(70);
    sampleTree.left.left = createNode(20);
    sampleTree.left.right = createNode(40);
    sampleTree.right.left = createNode(60);
    sampleTree.right.right = createNode(80);
    
    setTree(calculatePositions(sampleTree));
  }, []);

  const createNode = (value: number): TreeNode => ({
    value,
    left: null,
    right: null,
    id: `node-${value}-${Date.now()}`
  });

  const calculatePositions = (root: TreeNode | null, x = 400, y = 50, level = 0): TreeNode | null => {
    if (!root) return null;
    
    const spacing = Math.max(200 / (level + 1), 50);
    root.x = x;
    root.y = y;
    
    if (root.left) {
      root.left = calculatePositions(root.left, x - spacing, y + 80, level + 1);
    }
    if (root.right) {
      root.right = calculatePositions(root.right, x + spacing, y + 80, level + 1);
    }
    
    return root;
  };

  const insertNode = (root: TreeNode | null, value: number, steps: BSTStep[], stepNum: { current: number }): TreeNode => {
    if (!root) {
      const newNode = createNode(value);
      steps.push({
        step: stepNum.current++,
        operation: 'Create Node',
        currentNode: newNode.id,
        value,
        description: `Create new node with value ${value}`,
        tree: calculatePositions(newNode),
        path: [newNode.id]
      });
      return newNode;
    }

    steps.push({
      step: stepNum.current++,
      operation: 'Compare',
      currentNode: root.id,
      value,
      description: `Compare ${value} with ${root.value}: ${value < root.value ? 'Go left' : value > root.value ? 'Go right' : 'Duplicate found'}`,
      tree: calculatePositions(cloneTree(root)),
      path: [root.id]
    });

    if (value < root.value) {
      root.left = insertNode(root.left, value, steps, stepNum);
    } else if (value > root.value) {
      root.right = insertNode(root.right, value, steps, stepNum);
    } else {
      steps.push({
        step: stepNum.current++,
        operation: 'Duplicate',
        currentNode: root.id,
        value,
        description: `Value ${value} already exists in the tree`,
        tree: calculatePositions(cloneTree(root)),
        path: [root.id]
      });
      return root;
    }

    return root;
  };

  const searchNode = (root: TreeNode | null, value: number, steps: BSTStep[], stepNum: { current: number }, path: string[] = []): boolean => {
    if (!root) {
      steps.push({
        step: stepNum.current++,
        operation: 'Not Found',
        value,
        description: `Value ${value} not found in the tree`,
        tree: calculatePositions(cloneTree(tree)),
        path: [...path],
        found: false
      });
      return false;
    }

    const currentPath = [...path, root.id];
    
    steps.push({
      step: stepNum.current++,
      operation: 'Visit',
      currentNode: root.id,
      value,
      description: `Visit node ${root.value}: ${value === root.value ? 'Found!' : value < root.value ? 'Search left' : 'Search right'}`,
      tree: calculatePositions(cloneTree(tree)),
      path: currentPath
    });

    if (value === root.value) {
      steps.push({
        step: stepNum.current++,
        operation: 'Found',
        currentNode: root.id,
        value,
        description: `Found value ${value} at node ${root.id}`,
        tree: calculatePositions(cloneTree(tree)),
        path: currentPath,
        found: true
      });
      return true;
    }

    if (value < root.value) {
      return searchNode(root.left, value, steps, stepNum, currentPath);
    } else {
      return searchNode(root.right, value, steps, stepNum, currentPath);
    }
  };

  const findMin = (root: TreeNode | null, steps: BSTStep[], stepNum: { current: number }): TreeNode | null => {
    if (!root) return null;

    steps.push({
      step: stepNum.current++,
      operation: 'Visit',
      currentNode: root.id,
      description: `Visit node ${root.value}${root.left ? ': has left child, continue left' : ': no left child, this is minimum'}`,
      tree: calculatePositions(cloneTree(tree)),
      path: [root.id]
    });

    if (!root.left) {
      steps.push({
        step: stepNum.current++,
        operation: 'Found Min',
        currentNode: root.id,
        value: root.value,
        description: `Minimum value found: ${root.value}`,
        tree: calculatePositions(cloneTree(tree)),
        path: [root.id],
        found: true
      });
      return root;
    }

    return findMin(root.left, steps, stepNum);
  };

  const findMax = (root: TreeNode | null, steps: BSTStep[], stepNum: { current: number }): TreeNode | null => {
    if (!root) return null;

    steps.push({
      step: stepNum.current++,
      operation: 'Visit',
      currentNode: root.id,
      description: `Visit node ${root.value}${root.right ? ': has right child, continue right' : ': no right child, this is maximum'}`,
      tree: calculatePositions(cloneTree(tree)),
      path: [root.id]
    });

    if (!root.right) {
      steps.push({
        step: stepNum.current++,
        operation: 'Found Max',
        currentNode: root.id,
        value: root.value,
        description: `Maximum value found: ${root.value}`,
        tree: calculatePositions(cloneTree(tree)),
        path: [root.id],
        found: true
      });
      return root;
    }

    return findMax(root.right, steps, stepNum);
  };

  const inorderTraversal = (root: TreeNode | null, steps: BSTStep[], stepNum: { current: number }, result: number[] = []): number[] => {
    if (!root) return result;

    // Visit left subtree
    if (root.left) {
      steps.push({
        step: stepNum.current++,
        operation: 'Go Left',
        currentNode: root.id,
        description: `From node ${root.value}, go to left subtree`,
        tree: calculatePositions(cloneTree(tree)),
        path: [root.id]
      });
      inorderTraversal(root.left, steps, stepNum, result);
    }

    // Visit root
    steps.push({
      step: stepNum.current++,
      operation: 'Process',
      currentNode: root.id,
      value: root.value,
      description: `Process node ${root.value} (add to result)`,
      tree: calculatePositions(cloneTree(tree)),
      path: [root.id]
    });
    result.push(root.value);

    // Visit right subtree
    if (root.right) {
      steps.push({
        step: stepNum.current++,
        operation: 'Go Right',
        currentNode: root.id,
        description: `From node ${root.value}, go to right subtree`,
        tree: calculatePositions(cloneTree(tree)),
        path: [root.id]
      });
      inorderTraversal(root.right, steps, stepNum, result);
    }

    return result;
  };

  const cloneTree = (root: TreeNode | null): TreeNode | null => {
    if (!root) return null;
    return {
      ...root,
      left: cloneTree(root.left),
      right: cloneTree(root.right)
    };
  };

  const runOperation = () => {
    setIsAnimating(true);
    speakOperation('Binary Search Tree', `Running ${operations.find(op=>op.value===operation)?.label || 'operation'}.`);
    
    const newSteps: BSTStep[] = [];
    const stepNum = { current: 0 };

    newSteps.push({
      step: stepNum.current++,
      operation: 'Initialize',
      description: `Starting ${operation} operation${operation !== 'inorder' ? ` with value ${inputValue}` : ''}`,
      tree: calculatePositions(cloneTree(tree))
    });

    let newTree = tree;

    switch (operation) {
      case 'insert':
        if (tree) {
          newTree = insertNode(cloneTree(tree), inputValue, newSteps, stepNum);
        } else {
          newTree = createNode(inputValue);
          newSteps.push({
            step: stepNum.current++,
            operation: 'Create Root',
            currentNode: newTree.id,
            value: inputValue,
            description: `Create root node with value ${inputValue}`,
            tree: calculatePositions(newTree),
            path: [newTree.id]
          });
        }
        setTree(calculatePositions(newTree));
        break;
      case 'search':
        searchNode(tree, inputValue, newSteps, stepNum);
        break;
      case 'find-min':
        findMin(tree, newSteps, stepNum);
        break;
      case 'find-max':
        findMax(tree, newSteps, stepNum);
        break;
      case 'inorder':
        const result = inorderTraversal(tree, newSteps, stepNum);
        newSteps.push({
          step: stepNum.current++,
          operation: 'Complete',
          description: `Inorder traversal result: [${result.join(', ')}]`,
          tree: calculatePositions(cloneTree(tree))
        });
        break;
    }

    setSteps(newSteps);
    setCurrentStep(0);
    
    setTimeout(() => setIsAnimating(false), 1000);
    speakResult(`${operation} operation completed.`);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      if (steps[newStep]) {
        speakStep(`Step ${newStep + 1}`, steps[newStep].description, newStep, steps.length);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const reset = () => {
    setSteps([]);
    setCurrentStep(0);
    setIsAnimating(false);
    // Reset to sample tree
    const sampleTree = createNode(50);
    sampleTree.left = createNode(30);
    sampleTree.right = createNode(70);
    sampleTree.left.left = createNode(20);
    sampleTree.left.right = createNode(40);
    sampleTree.right.left = createNode(60);
    sampleTree.right.right = createNode(80);
    setTree(calculatePositions(sampleTree));
  };

  const currentStepData = steps[currentStep];
  const displayTree = currentStepData?.tree || tree;

  const renderTree = (node: TreeNode | null): JSX.Element | null => {
    if (!node || !node.x || !node.y) return null;

    const isHighlighted = currentStepData?.path?.includes(node.id);
    const isCurrent = currentStepData?.currentNode === node.id;

    return (
      <g key={node.id}>
        {/* Edges */}
        {node.left && node.left.x && node.left.y && (
          <line
            x1={node.x}
            y1={node.y}
            x2={node.left.x}
            y2={node.left.y}
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-400"
          />
        )}
        {node.right && node.right.x && node.right.y && (
          <line
            x1={node.x}
            y1={node.y}
            x2={node.right.x}
            y2={node.right.y}
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-400"
          />
        )}
        
        {/* Node */}
        <motion.circle
          cx={node.x}
          cy={node.y}
          r="25"
          fill={isCurrent ? '#ef4444' : isHighlighted ? '#f59e0b' : '#3b82f6'}
          stroke="white"
          strokeWidth="2"
          initial={{ scale: 1 }}
          animate={{ scale: isCurrent ? 1.2 : isHighlighted ? 1.1 : 1 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Node value */}
        <text
          x={node.x}
          y={node.y + 5}
          textAnchor="middle"
          className="text-white font-bold text-sm"
          fill="white"
        >
          {node.value}
        </text>

        {/* Recursively render children */}
        {renderTree(node.left)}
        {renderTree(node.right)}
      </g>
    );
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Operation</label>
          <Select value={operation} onValueChange={setOperation}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {operations.map(op => (
                <SelectItem key={op.value} value={op.value}>
                  {op.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!['find-min', 'find-max', 'inorder'].includes(operation) && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Value</label>
            <Input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(parseInt(e.target.value) || 0)}
            />
          </div>
        )}

        <div className="flex gap-2 items-end">
          <Button onClick={runOperation} className="flex items-center gap-2" disabled={isAnimating}>
            <TreePine className="h-4 w-4" />
            {isAnimating ? 'Running...' : 'Run'}
          </Button>
          <Button onClick={reset} variant="outline">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tree Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TreePine className="h-5 w-5" />
            Binary Search Tree
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-96 overflow-auto">
            <svg width="800" height="400" className="border rounded">
              {displayTree && renderTree(displayTree)}
            </svg>
          </div>
          
          {/* Legend */}
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span>Normal Node</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span>In Path</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span>Current Node</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Navigation */}
      {steps.length > 0 && (
        <div className="flex items-center justify-center gap-4">
          <Button onClick={prevStep} disabled={currentStep === 0} variant="outline">
            Previous
          </Button>
          <Badge variant="secondary">
            Step {currentStep + 1} of {steps.length}
          </Badge>
          <Button onClick={nextStep} disabled={currentStep === steps.length - 1} variant="outline">
            Next
          </Button>
        </div>
      )}

      {/* Current Step Display */}
      <AnimatePresence mode="wait">
        {currentStepData && (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-2 border-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="outline">{currentStepData.operation}</Badge>
                  Step {currentStep + 1}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg mb-4">{currentStepData.description}</p>
                
                {(currentStepData.value !== undefined || currentStepData.currentNode) && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {currentStepData.value !== undefined && (
                      <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded">
                        <div className="text-sm text-muted-foreground">Value</div>
                        <div className="text-xl font-bold">{currentStepData.value}</div>
                      </div>
                    )}
                    {currentStepData.currentNode && (
                      <div className="bg-red-50 dark:bg-red-950 p-3 rounded">
                        <div className="text-sm text-muted-foreground">Current Node</div>
                        <div className="text-xl font-bold">
                          {displayTree && findNodeById(displayTree, currentStepData.currentNode)?.value}
                        </div>
                      </div>
                    )}
                    {currentStepData.found !== undefined && (
                      <div className={`p-3 rounded ${
                        currentStepData.found ? 'bg-green-50 dark:bg-green-950' : 'bg-red-50 dark:bg-red-950'
                      }`}>
                        <div className="text-sm text-muted-foreground">Result</div>
                        <div className="text-xl font-bold">
                          {currentStepData.found ? 'Found' : 'Not Found'}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="flex justify-center">
        <VisualizerControls
          showMemory={showMemory}
          onToggleMemory={setShowMemory}
          voiceEnabled={voiceEnabled}
          onToggleVoice={setVoiceEnabled}
          voiceSpeed={speed}
          onVoiceSpeedChange={setSpeed}
          isSpeaking={isSpeaking}
          onPauseSpeech={pauseSpeech}
          onResumeSpeech={resumeSpeech}
          onStopSpeech={stopSpeech}
        />
      </div>

      {/* Memory Layout */}
      {showMemory && (
        <MemoryLayout
          title="BST Memory Layout"
          data={collectTreeValues(displayTree)}
          baseAddress={0x3000}
          wordSize={4}
        />
      )}

      {/* Educational Information */}
      <Card>
        <CardHeader>
          <CardTitle>Binary Search Tree Properties</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Key Properties:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Left subtree values &lt; root value</li>
                <li>• Right subtree values &gt; root value</li>
                <li>• Inorder traversal gives sorted sequence</li>
                <li>• No duplicate values allowed</li>
                <li>• Recursive structure</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Time Complexities:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Search: O(log n) average, O(n) worst</li>
                <li>• Insert: O(log n) average, O(n) worst</li>
                <li>• Delete: O(log n) average, O(n) worst</li>
                <li>• Traversal: O(n)</li>
                <li>• Space: O(n)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  function findNodeById(root: TreeNode | null, id: string): TreeNode | null {
    if (!root) return null;
    if (root.id === id) return root;
    return findNodeById(root.left, id) || findNodeById(root.right, id);
  }

  function collectTreeValues(root: TreeNode | null): number[] {
    if (!root) return [];
    return [root.value, ...collectTreeValues(root.left), ...collectTreeValues(root.right)];
  }
}