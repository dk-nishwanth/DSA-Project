import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

interface TreeNode {
  id: string;
  value: number;
  left?: TreeNode;
  right?: TreeNode;
  x: number;
  y: number;
  isActive: boolean;
  isVisited: boolean;
  isHighlighted: boolean;
}

export function BinaryTreeFundamentalsVisualizer() {
  const [operation, setOperation] = useState<'insert' | 'search' | 'delete' | 'traverse' | 'build'>('insert');
  const [traversalType, setTraversalType] = useState<'inorder' | 'preorder' | 'postorder' | 'levelorder'>('inorder');
  const [inputValue, setInputValue] = useState('15');
  const [arrayInput, setArrayInput] = useState('15,10,20,8,12,17,25');
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showMemory, setShowMemory] = useState(false);
  const [result, setResult] = useState<string>('');
  const [traversalResult, setTraversalResult] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const {
    voiceEnabled,
    setVoiceEnabled,
    speakOperation,
    speakStep,
    speakResult,
  } = useVisualizerVoice({ minInterval: 500 });

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const createNode = useCallback((value: number): TreeNode => ({
    id: `node-${value}-${Date.now()}`,
    value,
    x: 0,
    y: 0,
    isActive: false,
    isVisited: false,
    isHighlighted: false,
  }), []);

  const clearHighlights = useCallback((node: TreeNode | null) => {
    if (!node) return;
    node.isActive = false;
    node.isVisited = false;
    node.isHighlighted = false;
    clearHighlights(node.left || null);
    clearHighlights(node.right || null);
  }, []);

  const calculatePositions = useCallback((node: TreeNode | null, x: number, y: number, spacing: number): void => {
    if (!node) return;
    
    node.x = x;
    node.y = y;
    
    const childSpacing = spacing / 2;
    if (node.left) {
      calculatePositions(node.left, x - spacing, y + 80, childSpacing);
    }
    if (node.right) {
      calculatePositions(node.right, x + spacing, y + 80, childSpacing);
    }
  }, []);

  const insertNode = useCallback(async (value: number) => {
    speakOperation('Insert Node', `Inserting value ${value} into binary search tree`);
    
    if (!root) {
      const newNode = createNode(value);
      setRoot(newNode);
      calculatePositions(newNode, 400, 50, 150);
      setResult(`Inserted ${value} as root`);
      speakResult(`Inserted ${value} as root of the tree`);
      return;
    }
    
    const insert = async (node: TreeNode): Promise<TreeNode> => {
      node.isActive = true;
      setRoot({...root});
      
      speakStep('Compare', `Comparing ${value} with ${node.value}`, currentStep, 10);
      await sleep(600);
      
      if (value < node.value) {
        if (!node.left) {
          node.left = createNode(value);
          node.isActive = false;
          node.left.isHighlighted = true;
          calculatePositions(root, 400, 50, 150);
          setRoot({...root});
          
          speakStep('Insert left', `Inserted ${value} as left child of ${node.value}`, currentStep, 10);
          await sleep(500);
          return node;
        } else {
          node.isActive = false;
          speakStep('Go left', `Going to left subtree`, currentStep, 10);
          await sleep(400);
          await insert(node.left);
        }
      } else if (value > node.value) {
        if (!node.right) {
          node.right = createNode(value);
          node.isActive = false;
          node.right.isHighlighted = true;
          calculatePositions(root, 400, 50, 150);
          setRoot({...root});
          
          speakStep('Insert right', `Inserted ${value} as right child of ${node.value}`, currentStep, 10);
          await sleep(500);
          return node;
        } else {
          node.isActive = false;
          speakStep('Go right', `Going to right subtree`, currentStep, 10);
          await sleep(400);
          await insert(node.right);
        }
      } else {
        node.isActive = false;
        speakStep('Duplicate', `Value ${value} already exists`, currentStep, 10);
        await sleep(400);
      }
      
      return node;
    };
    
    await insert(root);
    clearHighlights(root);
    setResult(`Inserted ${value} into tree`);
    speakResult(`Successfully inserted ${value} into binary search tree`);
  }, [root, createNode, calculatePositions, currentStep, clearHighlights, speakOperation, speakStep, speakResult]);

  const searchNode = useCallback(async (value: number) => {
    if (!root) {
      setResult(`Tree is empty`);
      return;
    }
    
    speakOperation('Search Node', `Searching for value ${value} in binary search tree`);
    
    const search = async (node: TreeNode | null): Promise<boolean> => {
      if (!node) {
        speakStep('Not found', `Value ${value} not found`, currentStep, 10);
        return false;
      }
      
      node.isActive = true;
      setRoot({...root});
      
      speakStep('Compare', `Comparing ${value} with ${node.value}`, currentStep, 10);
      await sleep(600);
      
      if (value === node.value) {
        node.isActive = false;
        node.isHighlighted = true;
        setRoot({...root});
        speakStep('Found', `Found ${value}!`, currentStep, 10);
        await sleep(500);
        return true;
      } else if (value < node.value) {
        node.isActive = false;
        node.isVisited = true;
        setRoot({...root});
        speakStep('Go left', `${value} < ${node.value}, searching left subtree`, currentStep, 10);
        await sleep(400);
        return await search(node.left || null);
      } else {
        node.isActive = false;
        node.isVisited = true;
        setRoot({...root});
        speakStep('Go right', `${value} > ${node.value}, searching right subtree`, currentStep, 10);
        await sleep(400);
        return await search(node.right || null);
      }
    };
    
    const found = await search(root);
    setResult(found ? `Found ${value} in tree` : `${value} not found in tree`);
    speakResult(found ? `Found ${value} in the tree` : `${value} not found in the tree`);
  }, [root, currentStep, speakOperation, speakStep, speakResult]);

  const traverseTree = useCallback(async () => {
    if (!root) {
      setResult('Tree is empty');
      return;
    }
    
    speakOperation('Tree Traversal', `Performing ${traversalType} traversal`);
    
    const result: number[] = [];
    clearHighlights(root);
    
    const inorderTraversal = async (node: TreeNode | null): Promise<void> => {
      if (!node) return;
      
      // Left
      if (node.left) {
        await inorderTraversal(node.left);
      }
      
      // Root
      node.isActive = true;
      setRoot({...root});
      result.push(node.value);
      speakStep('Visit', `Visiting node ${node.value}`, result.length, 10);
      await sleep(500);
      
      node.isActive = false;
      node.isVisited = true;
      setRoot({...root});
      
      // Right
      if (node.right) {
        await inorderTraversal(node.right);
      }
    };
    
    const preorderTraversal = async (node: TreeNode | null): Promise<void> => {
      if (!node) return;
      
      // Root
      node.isActive = true;
      setRoot({...root});
      result.push(node.value);
      speakStep('Visit', `Visiting node ${node.value}`, result.length, 10);
      await sleep(500);
      
      node.isActive = false;
      node.isVisited = true;
      setRoot({...root});
      
      // Left
      if (node.left) {
        await preorderTraversal(node.left);
      }
      
      // Right
      if (node.right) {
        await preorderTraversal(node.right);
      }
    };
    
    const postorderTraversal = async (node: TreeNode | null): Promise<void> => {
      if (!node) return;
      
      // Left
      if (node.left) {
        await postorderTraversal(node.left);
      }
      
      // Right
      if (node.right) {
        await postorderTraversal(node.right);
      }
      
      // Root
      node.isActive = true;
      setRoot({...root});
      result.push(node.value);
      speakStep('Visit', `Visiting node ${node.value}`, result.length, 10);
      await sleep(500);
      
      node.isActive = false;
      node.isVisited = true;
      setRoot({...root});
    };
    
    const levelorderTraversal = async (root: TreeNode): Promise<void> => {
      const queue: TreeNode[] = [root];
      
      while (queue.length > 0) {
        const node = queue.shift()!;
        
        node.isActive = true;
        setRoot({...root});
        result.push(node.value);
        speakStep('Visit', `Visiting node ${node.value}`, result.length, 10);
        await sleep(500);
        
        node.isActive = false;
        node.isVisited = true;
        
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
        
        setRoot({...root});
      }
    };
    
    if (traversalType === 'inorder') {
      await inorderTraversal(root);
    } else if (traversalType === 'preorder') {
      await preorderTraversal(root);
    } else if (traversalType === 'postorder') {
      await postorderTraversal(root);
    } else {
      await levelorderTraversal(root);
    }
    
    setTraversalResult(result);
    setResult(`${traversalType} traversal: [${result.join(', ')}]`);
    speakResult(`${traversalType} traversal completed with ${result.length} nodes`);
  }, [root, traversalType, clearHighlights, speakOperation, speakStep, speakResult]);

  const buildTree = useCallback(async () => {
    const values = arrayInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    
    speakOperation('Build Tree', `Building binary search tree from array: [${values.join(', ')}]`);
    
    setRoot(null);
    
    for (let i = 0; i < values.length; i++) {
      await insertNode(values[i]);
      await sleep(300);
    }
    
    clearHighlights(root);
    setResult(`Built tree with ${values.length} nodes`);
    speakResult(`Successfully built binary search tree with ${values.length} nodes`);
  }, [arrayInput, insertNode, root, clearHighlights, speakOperation, speakResult]);

  const runOperation = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setResult('');
    setTraversalResult([]);
    setCurrentStep(0);
    
    try {
      if (operation === 'insert') {
        const value = parseInt(inputValue);
        if (!isNaN(value)) {
          await insertNode(value);
        }
      } else if (operation === 'search') {
        const value = parseInt(inputValue);
        if (!isNaN(value)) {
          await searchNode(value);
        }
      } else if (operation === 'traverse') {
        await traverseTree();
      } else if (operation === 'build') {
        await buildTree();
      }
    } finally {
      setIsRunning(false);
    }
  }, [isRunning, operation, inputValue, insertNode, searchNode, traverseTree, buildTree]);

  const renderTree = (node: TreeNode | null): JSX.Element[] => {
    if (!node) return [];
    
    const elements: JSX.Element[] = [];
    
    // Draw edges to children
    if (node.left) {
      elements.push(
        <line
          key={`edge-${node.id}-left`}
          x1={node.x}
          y1={node.y + 20}
          x2={node.left.x}
          y2={node.left.y - 20}
          stroke="#6B7280"
          strokeWidth={2}
        />
      );
      elements.push(...renderTree(node.left));
    }
    
    if (node.right) {
      elements.push(
        <line
          key={`edge-${node.id}-right`}
          x1={node.x}
          y1={node.y + 20}
          x2={node.right.x}
          y2={node.right.y - 20}
          stroke="#6B7280"
          strokeWidth={2}
        />
      );
      elements.push(...renderTree(node.right));
    }
    
    // Draw node
    elements.push(
      <g key={node.id}>
        <circle
          cx={node.x}
          cy={node.y}
          r={20}
          className={`transition-all duration-300 ${
            node.isActive
              ? 'fill-yellow-300 stroke-yellow-600'
              : node.isHighlighted
              ? 'fill-green-300 stroke-green-600'
              : node.isVisited
              ? 'fill-blue-300 stroke-blue-600'
              : 'fill-white stroke-gray-400'
          }`}
          strokeWidth={2}
        />
        <text
          x={node.x}
          y={node.y + 5}
          textAnchor="middle"
          className="text-sm font-bold fill-gray-800"
        >
          {node.value}
        </text>
      </g>
    );
    
    return elements;
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <Select value={operation} onValueChange={(v: 'insert' | 'search' | 'delete' | 'traverse' | 'build') => setOperation(v)}>
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="insert">Insert</SelectItem>
            <SelectItem value="search">Search</SelectItem>
            <SelectItem value="traverse">Traverse</SelectItem>
            <SelectItem value="build">Build</SelectItem>
          </SelectContent>
        </Select>

        {(operation === 'insert' || operation === 'search') && (
          <div className="flex items-center gap-2">
            <span className="text-sm">Value:</span>
            <Input 
              className="w-20" 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="15"
            />
          </div>
        )}

        {operation === 'traverse' && (
          <Select value={traversalType} onValueChange={(v: 'inorder' | 'preorder' | 'postorder' | 'levelorder') => setTraversalType(v)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inorder">Inorder</SelectItem>
              <SelectItem value="preorder">Preorder</SelectItem>
              <SelectItem value="postorder">Postorder</SelectItem>
              <SelectItem value="levelorder">Level Order</SelectItem>
            </SelectContent>
          </Select>
        )}

        {operation === 'build' && (
          <div className="flex items-center gap-2">
            <span className="text-sm">Array:</span>
            <Input 
              className="w-48" 
              value={arrayInput} 
              onChange={(e) => setArrayInput(e.target.value)}
              placeholder="15,10,20,8,12,17,25"
            />
          </div>
        )}

        <Button onClick={runOperation} disabled={isRunning}>
          {isRunning ? 'Running...' : operation.charAt(0).toUpperCase() + operation.slice(1)}
        </Button>

        <Button onClick={() => setRoot(null)} disabled={isRunning} variant="outline">
          Clear Tree
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 p-4 bg-gradient-visualization rounded-xl border-2">
          <div className="w-full h-96 overflow-auto">
            <svg width="800" height="400" className="w-full h-full">
              {root && renderTree(root)}
            </svg>
            {!root && (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Tree is empty
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          {result && (
            <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-xl border-2 border-green-300">
              <h3 className="text-sm font-semibold mb-2">Result</h3>
              <div className="text-sm">{result}</div>
            </div>
          )}
          
          {traversalResult.length > 0 && (
            <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl border-2 border-blue-300">
              <h3 className="text-sm font-semibold mb-2">Traversal Order</h3>
              <div className="text-sm font-mono">
                [{traversalResult.join(', ')}]
              </div>
            </div>
          )}
          
          <div className="p-4 bg-muted/20 rounded-xl border">
            <h3 className="text-sm font-semibold mb-2">Legend</h3>
            <div className="text-xs space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-300"></div>
                <span>Active (processing)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-300"></div>
                <span>Found/Inserted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-300"></div>
                <span>Visited</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <VisualizerControls
          showMemory={showMemory}
          onToggleMemory={setShowMemory}
          voiceEnabled={voiceEnabled}
          onToggleVoice={setVoiceEnabled}
        />
      </div>

      {showMemory && root && (
        <MemoryLayout
          data={[root]}
          title="Binary Tree Memory"
          baseAddress={15000}
          wordSize={8}
        />
      )}

      <div className="bg-muted/20 rounded-lg p-4 text-sm space-y-2">
        <div className="font-semibold text-primary">Binary Tree Operations:</div>
        <div>• <strong>Insert (BST):</strong> O(log n) average, O(n) worst case</div>
        <div>• <strong>Search (BST):</strong> O(log n) average, O(n) worst case</div>
        <div>• <strong>Traversals:</strong> O(n) time to visit all nodes</div>
        <div>• <strong>Space:</strong> O(h) for recursion stack, where h is height</div>
        <div>• <strong>Applications:</strong> Expression trees, file systems, decision trees</div>
      </div>
    </div>
  );
}