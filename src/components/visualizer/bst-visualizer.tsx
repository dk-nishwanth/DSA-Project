import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';
import { toast } from 'sonner';

interface BSTNode {
  value: number;
  left?: BSTNode;
  right?: BSTNode;
  x?: number;
  y?: number;
  id: string;
  isHighlighted?: boolean;
  isSearchPath?: boolean;
}

export function BSTVisualizer() {
  const [root, setRoot] = useState<BSTNode | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [showMemory, setShowMemory] = useState(false);
  const [traversalOrder, setTraversalOrder] = useState<number[]>([]);
  const [operation, setOperation] = useState<'insert' | 'search' | 'delete' | 'traverse' | null>(null);
  
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
  } = useVisualizerVoice({ minInterval: 2000 });

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const createNode = (value: number): BSTNode => ({
    value,
    id: `node-${value}-${Date.now()}`,
    isHighlighted: false,
    isSearchPath: false
  });

  const clearHighlights = (node: BSTNode | null): BSTNode | null => {
    if (!node) return null;
    return {
      ...node,
      isHighlighted: false,
      isSearchPath: false,
      left: clearHighlights(node.left),
      right: clearHighlights(node.right)
    };
  };

  const highlightNode = (node: BSTNode | null, value: number, highlight: boolean = true): BSTNode | null => {
    if (!node) return null;
    if (node.value === value) {
      return { ...node, isHighlighted: highlight };
    }
    return {
      ...node,
      left: highlightNode(node.left, value, highlight),
      right: highlightNode(node.right, value, highlight)
    };
  };

  const insertNode = useCallback(async (node: BSTNode | null, value: number, path: string = 'root'): Promise<BSTNode> => {
    if (!node) {
      const newNode = createNode(value);
      setCurrentStep(`Created new node with value ${value} at ${path}`);
      speakStep("", `Created new node with value ${value} at ${path}. This becomes a leaf node in the BST.`, 1, 1);
      await sleep(800);
      return newNode;
    }

    setRoot(highlightNode(root, node.value, true));
    setCurrentStep(`Comparing ${value} with ${node.value} at ${path}`);
    speakStep("", `Comparing ${value} with ${node.value}. ${value < node.value ? 'Going left since ' + value + ' is smaller.' : value > node.value ? 'Going right since ' + value + ' is larger.' : 'Value already exists!'}`, 1, 1);
    await sleep(800);

    if (value < node.value) {
      const newLeft = await insertNode(node.left, value, `${path} -> left`);
      const updatedNode = { ...node, left: newLeft, isHighlighted: false };
      return updatedNode;
    } else if (value > node.value) {
      const newRight = await insertNode(node.right, value, `${path} -> right`);
      const updatedNode = { ...node, right: newRight, isHighlighted: false };
      return updatedNode;
    } else {
      setCurrentStep(`Value ${value} already exists in BST`);
      speakStep("", `Value ${value} already exists in the BST. No insertion needed.`, 1, 1);
      await sleep(800);
      return { ...node, isHighlighted: false };
    }
  }, [root, speakStep]);

  const searchNode = useCallback(async (node: BSTNode | null, value: number, path: string = 'root'): Promise<boolean> => {
    if (!node) {
      setCurrentStep(`Value ${value} not found - reached null node`);
      speakStep("", `Reached a null node. Value ${value} is not in the BST.`, 1, 1);
      await sleep(800);
      return false;
    }

    setRoot(highlightNode(root, node.value, true));
    setCurrentStep(`Searching for ${value}, currently at ${node.value} (${path})`);
    speakStep("", `Currently at node ${node.value}. ${value === node.value ? 'Found the target!' : value < node.value ? 'Target is smaller, going left.' : 'Target is larger, going right.'}`, 1, 1);
    await sleep(800);

    if (value === node.value) {
      setCurrentStep(`Found ${value} at ${path}!`);
      speakStep("", `Success! Found ${value} in the BST.`, 1, 1);
      await sleep(800);
      return true;
    } else if (value < node.value) {
      return await searchNode(node.left, value, `${path} -> left`);
    } else {
      return await searchNode(node.right, value, `${path} -> right`);
    }
  }, [root, speakStep]);

  const inorderTraversal = useCallback(async (node: BSTNode | null, result: number[] = []): Promise<number[]> => {
    if (!node) return result;

    // Left subtree
    await inorderTraversal(node.left, result);
    
    // Visit current node
    setRoot(highlightNode(root, node.value, true));
    result.push(node.value);
    setTraversalOrder([...result]);
    setCurrentStep(`Visiting node ${node.value} (inorder: left -> root -> right)`);
    speakStep("", `Visiting node ${node.value}. Inorder traversal visits left subtree first, then root, then right subtree.`, result.length, 1);
    await sleep(600);
    setRoot(highlightNode(root, node.value, false));

    // Right subtree
    await inorderTraversal(node.right, result);
    
    return result;
  }, [root, speakStep]);

  const handleInsert = async () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      toast.error('Please enter a valid number');
      return;
    }

    setIsAnimating(true);
    setOperation('insert');
    setCurrentStep('');
    setRoot(clearHighlights(root));
    
    speakOperation("BST Insert", `Inserting ${value} into the Binary Search Tree. We'll compare values and follow the BST property: left children are smaller, right children are larger.`);

    try {
      const newRoot = await insertNode(root, value);
      setRoot(clearHighlights(newRoot));
      setInputValue('');
      speakResult(`Successfully inserted ${value} into the BST!`);
      toast.success(`Inserted ${value} successfully`);
    } catch (error) {
      toast.error('Insert operation failed');
      speakResult('Insert operation failed. Please try again.');
    }

    setIsAnimating(false);
    setOperation(null);
    setCurrentStep('');
  };

  const handleSearch = async () => {
    const value = parseInt(searchValue);
    if (isNaN(value)) {
      toast.error('Please enter a valid number to search');
      return;
    }

    if (!root) {
      toast.error('BST is empty');
      return;
    }

    setIsAnimating(true);
    setOperation('search');
    setCurrentStep('');
    setRoot(clearHighlights(root));
    
    speakOperation("BST Search", `Searching for ${value} in the Binary Search Tree. We'll use the BST property to efficiently navigate to the target.`);

    try {
      const found = await searchNode(root, value);
      setRoot(clearHighlights(root));
      
      if (found) {
        speakResult(`Found ${value} in the BST!`);
        toast.success(`Found ${value}`);
      } else {
        speakResult(`${value} is not in the BST.`);
        toast.error(`${value} not found`);
      }
    } catch (error) {
      toast.error('Search operation failed');
      speakResult('Search operation failed. Please try again.');
    }

    setIsAnimating(false);
    setOperation(null);
    setCurrentStep('');
  };

  const handleTraversal = async () => {
    if (!root) {
      toast.error('BST is empty');
      return;
    }

    setIsAnimating(true);
    setOperation('traverse');
    setTraversalOrder([]);
    setRoot(clearHighlights(root));
    
    speakOperation("BST Inorder Traversal", `Starting inorder traversal of the BST. This will visit nodes in sorted order: left subtree, root, right subtree.`);

    try {
      const result = await inorderTraversal(root);
      setRoot(clearHighlights(root));
      speakResult(`Inorder traversal completed! Visited nodes in sorted order: ${result.join(', ')}.`);
      toast.success(`Traversal complete: ${result.join(', ')}`);
    } catch (error) {
      toast.error('Traversal operation failed');
      speakResult('Traversal operation failed. Please try again.');
    }

    setIsAnimating(false);
    setOperation(null);
    setCurrentStep('');
  };

  const resetBST = () => {
    setRoot(null);
    setTraversalOrder([]);
    setCurrentStep('');
    setInputValue('');
    setSearchValue('');
    setIsAnimating(false);
    setOperation(null);
    toast.success('BST reset');
  };

  const calculatePositions = (node: BSTNode | null, x: number = 400, y: number = 50, level: number = 0): BSTNode | null => {
    if (!node) return null;
    
    const spacing = Math.max(200 / (level + 1), 50);
    
    return {
      ...node,
      x,
      y,
      left: calculatePositions(node.left, x - spacing, y + 80, level + 1),
      right: calculatePositions(node.right, x + spacing, y + 80, level + 1)
    };
  };

  const renderTree = (node: BSTNode | null): JSX.Element[] => {
    if (!node) return [];
    
    const elements: JSX.Element[] = [];
    const positionedNode = calculatePositions(node);
    
    const renderNode = (n: BSTNode | null): void => {
      if (!n || !n.x || !n.y) return;
      
      // Render edges to children
      if (n.left && n.left.x && n.left.y) {
        elements.push(
          <line
            key={`edge-${n.id}-left`}
            x1={n.x}
            y1={n.y + 20}
            x2={n.left.x}
            y2={n.left.y - 20}
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="2"
          />
        );
        renderNode(n.left);
      }
      
      if (n.right && n.right.x && n.right.y) {
        elements.push(
          <line
            key={`edge-${n.id}-right`}
            x1={n.x}
            y1={n.y + 20}
            x2={n.right.x}
            y2={n.right.y - 20}
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="2"
          />
        );
        renderNode(n.right);
      }
      
      // Render node
      elements.push(
        <g key={n.id}>
          <circle
            cx={n.x}
            cy={n.y}
            r="20"
            fill={n.isHighlighted ? "hsl(var(--primary))" : "hsl(var(--card))"}
            stroke={n.isHighlighted ? "hsl(var(--primary-foreground))" : "hsl(var(--border))"}
            strokeWidth="2"
            className={`transition-all duration-300 ${n.isHighlighted ? 'animate-pulse' : ''}`}
          />
          <text
            x={n.x}
            y={n.y + 5}
            textAnchor="middle"
            className="text-sm font-bold fill-card-foreground"
          >
            {n.value}
          </text>
        </g>
      );
    };
    
    renderNode(positionedNode);
    return elements;
  };

  const getNodeCount = (node: BSTNode | null): number => {
    if (!node) return 0;
    return 1 + getNodeCount(node.left) + getNodeCount(node.right);
  };

  const getTreeHeight = (node: BSTNode | null): number => {
    if (!node) return 0;
    return 1 + Math.max(getTreeHeight(node.left), getTreeHeight(node.right));
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Binary Search Tree Visualizer</h2>
        <p className="text-muted-foreground">
          Efficient binary tree with ordered property: left &lt; root &lt; right
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Insert:</span>
          <Input 
            className="w-24" 
            value={inputValue} 
            onChange={e => setInputValue(e.target.value)} 
            placeholder="Value"
            disabled={isAnimating}
            type="number"
          />
          <Button onClick={handleInsert} disabled={isAnimating}>
            Insert
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Search:</span>
          <Input 
            className="w-24" 
            value={searchValue} 
            onChange={e => setSearchValue(e.target.value)} 
            placeholder="Value"
            disabled={isAnimating}
            type="number"
          />
          <Button onClick={handleSearch} disabled={isAnimating} variant="secondary">
            Search
          </Button>
        </div>
        
        <Button onClick={handleTraversal} disabled={isAnimating} variant="outline">
          Inorder Traversal
        </Button>
        
        <Button onClick={resetBST} disabled={isAnimating} variant="destructive">
          Reset BST
        </Button>
      </div>

      {/* Current Step Display */}
      {currentStep && (
        <div className="p-4 bg-muted/20 rounded-lg border">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{operation || 'Operation'}</Badge>
            <span className="text-sm font-medium">{currentStep}</span>
          </div>
        </div>
      )}

      {/* BST Visualization */}
      <div className="p-6 bg-gradient-visualization rounded-xl border-2 border-primary/20">
        <h4 className="text-lg font-semibold mb-4 text-center">Binary Search Tree Structure</h4>
        
        {root ? (
          <div className="relative">
            <svg width="800" height="400" className="w-full h-auto">
              {renderTree(root)}
            </svg>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>BST is empty. Insert some values to see the tree structure.</p>
          </div>
        )}
      </div>

      {/* Traversal Result */}
      {traversalOrder.length > 0 && (
        <div className="p-4 bg-muted/20 rounded-lg border">
          <h4 className="font-semibold mb-2">Inorder Traversal Result (Sorted Order):</h4>
          <div className="flex gap-2 flex-wrap">
            {traversalOrder.map((value, index) => (
              <Badge key={index} variant="secondary">
                {value}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* BST Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-2">BST Properties:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>Left subtree contains only nodes with values less than root</li>
            <li>Right subtree contains only nodes with values greater than root</li>
            <li>Both left and right subtrees are also BSTs</li>
            <li>Inorder traversal gives sorted sequence</li>
            <li>No duplicate values allowed</li>
          </ul>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-2">Tree Statistics:</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div><strong>Nodes:</strong> {getNodeCount(root)}</div>
            <div><strong>Height:</strong> {getTreeHeight(root)}</div>
            <div><strong>Search:</strong> O(h) where h is height</div>
            <div><strong>Insert:</strong> O(h) average case</div>
            <div><strong>Best Case Height:</strong> O(log n) (balanced)</div>
            <div><strong>Worst Case Height:</strong> O(n) (skewed)</div>
          </div>
        </div>
      </div>

      {/* Memory Layout */}
      {showMemory && (
        <MemoryLayout
          title="BST Node Memory Layout"
          data={traversalOrder.length > 0 ? traversalOrder.slice(0, 10) : []}
          baseAddress={0xD000}
        />
      )}

      {/* Visualizer Controls */}
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
    </div>
  );
}
