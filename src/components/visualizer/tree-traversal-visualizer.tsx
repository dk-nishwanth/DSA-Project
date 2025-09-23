import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';
import { toast } from 'sonner';

interface TreeNode {
  value: number;
  left?: TreeNode;
  right?: TreeNode;
  x?: number;
  y?: number;
  id: string;
}

interface TraversalStep {
  id: string;
  nodeId: string;
  action: 'visit' | 'traverse' | 'complete';
  description: string;
  result: number[];
  currentPath: string[];
}

export function TreeTraversalVisualizer() {
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [traversalType, setTraversalType] = useState<'inorder' | 'preorder' | 'postorder'>('inorder');
  const [steps, setSteps] = useState<TraversalStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  const [inputValues, setInputValues] = useState('4,2,6,1,3,5,7');
  const [showMemory, setShowMemory] = useState(false);
  
  const {
    voiceEnabled,
    setVoiceEnabled,
    speed,
    setSpeed,
    isSpeaking,
    pauseSpeech,
    resumeSpeech,
    stopSpeech,
    speakStep,
    speakOperation,
    speakResult
  } = useVisualizerVoice({ minInterval: 2500 });

  // Create a sample binary tree from array
  const createTreeFromArray = useCallback((values: number[]): TreeNode | null => {
    if (values.length === 0) return null;

    const nodes: (TreeNode | null)[] = values.map((val, idx) => 
      val !== null ? { value: val, id: `node-${idx}` } : null
    );

    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i]) {
        const leftIdx = 2 * i + 1;
        const rightIdx = 2 * i + 2;
        
        if (leftIdx < nodes.length && nodes[leftIdx]) {
          nodes[i]!.left = nodes[leftIdx]!;
        }
        if (rightIdx < nodes.length && nodes[rightIdx]) {
          nodes[i]!.right = nodes[rightIdx]!;
        }
      }
    }

    return nodes[0];
  }, []);

  // Calculate node positions for visualization
  const calculatePositions = useCallback((node: TreeNode | null, x = 400, y = 50, level = 0): void => {
    if (!node) return;
    
    const horizontalSpacing = 200 / (level + 1);
    node.x = x;
    node.y = y;

    if (node.left) {
      calculatePositions(node.left, x - horizontalSpacing, y + 80, level + 1);
    }
    if (node.right) {
      calculatePositions(node.right, x + horizontalSpacing, y + 80, level + 1);
    }
  }, []);

  // Generate traversal steps
  const generateTraversalSteps = useCallback((root: TreeNode | null, type: string): TraversalStep[] => {
    const steps: TraversalStep[] = [];
    const result: number[] = [];
    const path: string[] = [];
    let stepId = 0;

    const traverse = (node: TreeNode | null, currentPath: string[]): void => {
      if (!node) return;

      const newPath = [...currentPath, node.id];

      if (type === 'preorder') {
        // Root -> Left -> Right
        steps.push({
          id: `step-${stepId++}`,
          nodeId: node.id,
          action: 'visit',
          description: `Visit root node ${node.value}`,
          result: [...result, node.value],
          currentPath: [...newPath]
        });
        result.push(node.value);

        if (node.left) {
          steps.push({
            id: `step-${stepId++}`,
            nodeId: node.left.id,
            action: 'traverse',
            description: `Traverse to left child of ${node.value}`,
            result: [...result],
            currentPath: [...newPath]
          });
          traverse(node.left, newPath);
        }

        if (node.right) {
          steps.push({
            id: `step-${stepId++}`,
            nodeId: node.right.id,
            action: 'traverse',
            description: `Traverse to right child of ${node.value}`,
            result: [...result],
            currentPath: [...newPath]
          });
          traverse(node.right, newPath);
        }
      } else if (type === 'inorder') {
        // Left -> Root -> Right
        if (node.left) {
          steps.push({
            id: `step-${stepId++}`,
            nodeId: node.left.id,
            action: 'traverse',
            description: `Traverse to left child of ${node.value}`,
            result: [...result],
            currentPath: [...newPath]
          });
          traverse(node.left, newPath);
        }

        steps.push({
          id: `step-${stepId++}`,
          nodeId: node.id,
          action: 'visit',
          description: `Visit root node ${node.value}`,
          result: [...result, node.value],
          currentPath: [...newPath]
        });
        result.push(node.value);

        if (node.right) {
          steps.push({
            id: `step-${stepId++}`,
            nodeId: node.right.id,
            action: 'traverse',
            description: `Traverse to right child of ${node.value}`,
            result: [...result],
            currentPath: [...newPath]
          });
          traverse(node.right, newPath);
        }
      } else if (type === 'postorder') {
        // Left -> Right -> Root
        if (node.left) {
          steps.push({
            id: `step-${stepId++}`,
            nodeId: node.left.id,
            action: 'traverse',
            description: `Traverse to left child of ${node.value}`,
            result: [...result],
            currentPath: [...newPath]
          });
          traverse(node.left, newPath);
        }

        if (node.right) {
          steps.push({
            id: `step-${stepId++}`,
            nodeId: node.right.id,
            action: 'traverse',
            description: `Traverse to right child of ${node.value}`,
            result: [...result],
            currentPath: [...newPath]
          });
          traverse(node.right, newPath);
        }

        steps.push({
          id: `step-${stepId++}`,
          nodeId: node.id,
          action: 'visit',
          description: `Visit root node ${node.value}`,
          result: [...result, node.value],
          currentPath: [...newPath]
        });
        result.push(node.value);
      }
    };

    traverse(root, []);

    steps.push({
      id: `step-${stepId++}`,
      nodeId: '',
      action: 'complete',
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} traversal complete!`,
      result: [...result],
      currentPath: []
    });

    return steps;
  }, []);

  const handleCreateTree = useCallback(() => {
    try {
      const values = inputValues.split(',').map(v => {
        const num = parseInt(v.trim());
        return isNaN(num) ? null : num;
      }).filter(v => v !== null) as number[];
      
      const newTree = createTreeFromArray(values);
      if (newTree) {
        calculatePositions(newTree);
        setTree(newTree);
        setSteps([]);
        setCurrentStep(0);
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Error creating tree:', error);
    }
  }, [inputValues, createTreeFromArray, calculatePositions]);

  const handleStartTraversal = useCallback(() => {
    if (!tree) return;
    
    const newSteps = generateTraversalSteps(tree, traversalType);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(true);
  }, [tree, traversalType, generateTraversalSteps]);

  const handleReset = useCallback(() => {
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  const handleStepForward = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, steps.length]);

  const handleStepBackward = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentStep, steps.length, speed]);

  const renderTree = () => {
    if (!tree) return null;

    const renderNode = (node: TreeNode): JSX.Element => {
      const currentStepData = steps[currentStep];
      const isCurrentNode = currentStepData?.nodeId === node.id;
      const isVisited = steps.slice(0, currentStep + 1).some(step => 
        step.nodeId === node.id && step.action === 'visit'
      );
      const isInPath = currentStepData?.currentPath.includes(node.id);

      return (
        <g key={node.id}>
          {/* Edges */}
          {node.left && (
            <line
              x1={node.x}
              y1={node.y}
              x2={node.left.x}
              y2={node.left.y}
              stroke="#6b7280"
              strokeWidth="2"
            />
          )}
          {node.right && (
            <line
              x1={node.x}
              y1={node.y}
              x2={node.right.x}
              y2={node.right.y}
              stroke="#6b7280"
              strokeWidth="2"
            />
          )}

          {/* Node */}
          <motion.circle
            cx={node.x}
            cy={node.y}
            r="25"
            fill={
              isCurrentNode ? '#ef4444' : 
              isVisited ? '#22c55e' : 
              isInPath ? '#f59e0b' : 
              '#3b82f6'
            }
            stroke="#1f2937"
            strokeWidth="2"
            animate={{
              scale: isCurrentNode ? 1.2 : 1,
              fill: isCurrentNode ? '#ef4444' : 
                   isVisited ? '#22c55e' : 
                   isInPath ? '#f59e0b' : 
                   '#3b82f6'
            }}
            transition={{ duration: 0.3 }}
          />
          
          <text
            x={node.x}
            y={node.y + 5}
            textAnchor="middle"
            fill="white"
            fontSize="14"
            fontWeight="bold"
          >
            {node.value}
          </text>

          {/* Recursively render children */}
          {node.left && renderNode(node.left)}
          {node.right && renderNode(node.right)}
        </g>
      );
    };

    return (
      <div className="flex justify-center">
        <svg width="800" height="400" className="border rounded-lg bg-gray-50 dark:bg-gray-900">
          {renderNode(tree)}
        </svg>
      </div>
    );
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="text-sm font-medium mb-2 block">Tree Values</label>
            <Input
              value={inputValues}
              onChange={(e) => setInputValues(e.target.value)}
              placeholder="4,2,6,1,3,5,7"
              disabled={isPlaying}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Traversal Type</label>
            <Select value={traversalType} onValueChange={(value: 'inorder' | 'preorder' | 'postorder') => setTraversalType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inorder">Inorder (L-Root-R)</SelectItem>
                <SelectItem value="preorder">Preorder (Root-L-R)</SelectItem>
                <SelectItem value="postorder">Postorder (L-R-Root)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Speed (ms)</label>
            <Select value={speed.toString()} onValueChange={(value) => setSpeed(parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2000">Very Slow</SelectItem>
                <SelectItem value="1500">Slow</SelectItem>
                <SelectItem value="1000">Normal</SelectItem>
                <SelectItem value="500">Fast</SelectItem>
                <SelectItem value="200">Very Fast</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleCreateTree} disabled={isPlaying}>
              Create Tree
            </Button>
            <Button onClick={handleStartTraversal} disabled={!tree || isPlaying}>
              Start
            </Button>
            <Button onClick={handleReset} variant="outline">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Playback Controls */}
      {steps.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleStepBackward}
                disabled={currentStep === 0}
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              
              <Button
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={currentStep >= steps.length - 1}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={handleStepForward}
                disabled={currentStep >= steps.length - 1}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>

          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Tree Visualization */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
        <h3 className="text-lg font-semibold mb-4">Tree Visualization</h3>
        {tree ? renderTree() : (
          <div className="text-center py-12 text-muted-foreground">
            Enter tree values and click "Create Tree" to start
          </div>
        )}
      </div>

      {/* Step Information */}
      {currentStepData && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Current Step</h4>
              <p className="text-sm text-muted-foreground">{currentStepData.description}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Traversal Result</h4>
              <div className="flex flex-wrap gap-2">
                {currentStepData.result.map((value, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-sm"
                  >
                    {value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
        <h4 className="font-semibold mb-3">Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span>Unvisited</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span>In Path</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span>Current</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span>Visited</span>
          </div>
        </div>
      </div>

      {/* Algorithm Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
        <h4 className="font-semibold mb-3">Tree Traversal Algorithms</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-blue-600 mb-2">Inorder (L-Root-R)</h5>
            <p className="text-muted-foreground">Visit left subtree, then root, then right subtree. For BST, gives sorted order.</p>
          </div>
          <div>
            <h5 className="font-medium text-green-600 mb-2">Preorder (Root-L-R)</h5>
            <p className="text-muted-foreground">Visit root first, then left subtree, then right subtree. Used for tree copying.</p>
          </div>
          <div>
            <h5 className="font-medium text-purple-600 mb-2">Postorder (L-R-Root)</h5>
            <p className="text-muted-foreground">Visit left subtree, then right subtree, then root. Used for tree deletion.</p>
          </div>
        </div>
      </div>
    </div>
  );
}