import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

interface SplayNode {
  value: number;
  left: SplayNode | null;
  right: SplayNode | null;
  parent: SplayNode | null;
  id: string;
  x?: number;
  y?: number;
  isHighlighted?: boolean;
  isRotating?: boolean;
  isSplaying?: boolean;
}

export function SplayTreeVisualizer() {
  const [keyInput, setKeyInput] = useState('');
  const [operation, setOperation] = useState<'insert' | 'search' | 'delete'>('insert');
  const [root, setRoot] = useState<SplayNode | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showMemory, setShowMemory] = useState(false);
  const [result, setResult] = useState<string>('');
  const [step, setStep] = useState(0);
  const [nodeCount, setNodeCount] = useState(0);
  const [treeHeight, setTreeHeight] = useState(0);
  const [splayCount, setSplayCount] = useState(0);

  const {
    voiceEnabled,
    setVoiceEnabled,
    speakOperation,
    speakStep,
    speakResult,
  } = useVisualizerVoice({ minInterval: 800 });

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const createNode = useCallback((value: number, parent: SplayNode | null = null): SplayNode => {
    return {
      value,
      left: null,
      right: null,
      parent,
      id: `node-${Date.now()}-${Math.random()}`,
      isHighlighted: false,
      isRotating: false,
      isSplaying: false,
    };
  }, []);

  const clearHighlights = useCallback((node: SplayNode | null) => {
    if (!node) return;
    node.isHighlighted = false;
    node.isRotating = false;
    node.isSplaying = false;
    clearHighlights(node.left);
    clearHighlights(node.right);
  }, []);

  const calculateTreeHeight = useCallback((node: SplayNode | null): number => {
    if (!node) return 0;
    return 1 + Math.max(calculateTreeHeight(node.left), calculateTreeHeight(node.right));
  }, []);

  const countNodes = useCallback((node: SplayNode | null): number => {
    if (!node) return 0;
    return 1 + countNodes(node.left) + countNodes(node.right);
  }, []);

  const updateTreeStats = useCallback(() => {
    setNodeCount(countNodes(root));
    setTreeHeight(calculateTreeHeight(root));
  }, [root, countNodes, calculateTreeHeight]);

  // Rotation operations
  const rotateLeft = useCallback(async (node: SplayNode): Promise<SplayNode> => {
    const rightChild = node.right!;
    
    node.isRotating = true;
    rightChild.isRotating = true;
    setRoot({...root!});
    
    speakStep('Rotate left', `Rotating ${node.value} left with ${rightChild.value}`, step, 10);
    await sleep(600);
    
    // Perform rotation
    node.right = rightChild.left;
    if (rightChild.left) {
      rightChild.left.parent = node;
    }
    
    rightChild.parent = node.parent;
    if (node.parent) {
      if (node === node.parent.left) {
        node.parent.left = rightChild;
      } else {
        node.parent.right = rightChild;
      }
    }
    
    rightChild.left = node;
    node.parent = rightChild;
    
    node.isRotating = false;
    rightChild.isRotating = false;
    
    return rightChild;
  }, [root, step, speakStep]);

  const rotateRight = useCallback(async (node: SplayNode): Promise<SplayNode> => {
    const leftChild = node.left!;
    
    node.isRotating = true;
    leftChild.isRotating = true;
    setRoot({...root!});
    
    speakStep('Rotate right', `Rotating ${node.value} right with ${leftChild.value}`, step, 10);
    await sleep(600);
    
    // Perform rotation
    node.left = leftChild.right;
    if (leftChild.right) {
      leftChild.right.parent = node;
    }
    
    leftChild.parent = node.parent;
    if (node.parent) {
      if (node === node.parent.left) {
        node.parent.left = leftChild;
      } else {
        node.parent.right = leftChild;
      }
    }
    
    leftChild.right = node;
    node.parent = leftChild;
    
    node.isRotating = false;
    leftChild.isRotating = false;
    
    return leftChild;
  }, [root, step, speakStep]);

  const splay = useCallback(async (node: SplayNode): Promise<SplayNode> => {
    node.isSplaying = true;
    setRoot({...root!});
    
    speakStep('Start splay', `Splaying node ${node.value} to root`, step, 10);
    await sleep(600);
    
    let current = node;
    
    while (current.parent) {
      const parent = current.parent;
      const grandparent = parent.parent;
      
      if (!grandparent) {
        // Zig step - parent is root
        speakStep('Zig step', `Zig: rotating ${current.value} with parent ${parent.value}`, step, 10);
        if (current === parent.left) {
          current = await rotateRight(parent);
        } else {
          current = await rotateLeft(parent);
        }
      } else {
        // Zig-zig or Zig-zag step
        if ((current === parent.left && parent === grandparent.left) ||
            (current === parent.right && parent === grandparent.right)) {
          // Zig-zig step
          speakStep('Zig-zig step', `Zig-zig: ${current.value} → ${parent.value} → ${grandparent.value}`, step, 10);
          if (current === parent.left) {
            await rotateRight(grandparent);
            current = await rotateRight(parent);
          } else {
            await rotateLeft(grandparent);
            current = await rotateLeft(parent);
          }
        } else {
          // Zig-zag step
          speakStep('Zig-zag step', `Zig-zag: ${current.value} between ${parent.value} and ${grandparent.value}`, step, 10);
          if (current === parent.left) {
            current = await rotateRight(parent);
            current = await rotateLeft(grandparent);
          } else {
            current = await rotateLeft(parent);
            current = await rotateRight(grandparent);
          }
        }
      }
      
      setSplayCount(prev => prev + 1);
      await sleep(400);
    }
    
    current.isSplaying = false;
    speakStep('Splay complete', `Node ${current.value} is now at root`, step, 10);
    
    return current;
  }, [root, step, rotateLeft, rotateRight, speakStep]);

  const insertKey = useCallback(async (key: number) => {
    speakOperation('Splay Tree Insert', `Inserting key ${key} into splay tree`);
    
    if (!root) {
      const newRoot = createNode(key);
      setRoot(newRoot);
      speakStep('Create root', `Created root node with value ${key}`, 0, 1);
      setResult(`Inserted ${key} as root node`);
      updateTreeStats();
      return;
    }

    // Standard BST insertion
    let current = root;
    let parent: SplayNode | null = null;
    
    while (current) {
      parent = current;
      current.isHighlighted = true;
      setRoot({...root});
      
      speakStep('Navigate', `Comparing ${key} with ${current.value}`, step, 10);
      await sleep(500);
      
      if (key === current.value) {
        speakStep('Duplicate', `Key ${key} already exists`, step, 10);
        // Splay the existing node
        const newRoot = await splay(current);
        setRoot(newRoot);
        setResult(`Key ${key} already exists, splayed to root`);
        clearHighlights(newRoot);
        updateTreeStats();
        return;
      }
      
      current.isHighlighted = false;
      
      if (key < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }
    
    // Insert new node
    const newNode = createNode(key, parent);
    if (key < parent!.value) {
      parent!.left = newNode;
    } else {
      parent!.right = newNode;
    }
    
    speakStep('Insert node', `Inserted ${key} as child of ${parent!.value}`, step, 10);
    await sleep(500);
    
    // Splay the new node to root
    const newRoot = await splay(newNode);
    setRoot(newRoot);
    
    clearHighlights(newRoot);
    updateTreeStats();
    setResult(`Successfully inserted ${key} and splayed to root`);
    speakResult(`Inserted ${key} and splayed to root`);
  }, [root, createNode, step, splay, speakOperation, speakStep, speakResult, updateTreeStats, clearHighlights]);

  const searchKey = useCallback(async (key: number) => {
    if (!root) {
      setResult(`Key ${key} not found - tree is empty`);
      return;
    }

    speakOperation('Splay Tree Search', `Searching for key ${key} in splay tree`);
    
    let current = root;
    let lastNode = root;
    
    while (current) {
      lastNode = current;
      current.isHighlighted = true;
      setRoot({...root});
      
      speakStep('Search', `Comparing ${key} with ${current.value}`, step, 10);
      await sleep(600);
      
      if (key === current.value) {
        speakStep('Found', `Found key ${key}`, step, 10);
        // Splay the found node
        const newRoot = await splay(current);
        setRoot(newRoot);
        clearHighlights(newRoot);
        updateTreeStats();
        setResult(`Key ${key} found and splayed to root`);
        speakResult(`Found ${key} and splayed to root`);
        return;
      }
      
      current.isHighlighted = false;
      
      if (key < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }
    
    // Key not found, splay the last accessed node
    speakStep('Not found', `Key ${key} not found, splaying last accessed node`, step, 10);
    const newRoot = await splay(lastNode);
    setRoot(newRoot);
    
    clearHighlights(newRoot);
    updateTreeStats();
    setResult(`Key ${key} not found, splayed ${lastNode.value} to root`);
    speakResult(`Key ${key} not found`);
  }, [root, step, splay, speakOperation, speakStep, speakResult, updateTreeStats, clearHighlights]);

  const runOperation = useCallback(async () => {
    if (isRunning) return;
    
    const key = parseInt(keyInput);
    if (isNaN(key)) {
      setResult('Please enter a valid number');
      return;
    }

    setIsRunning(true);
    setResult('');
    setStep(0);
    setSplayCount(0);
    
    try {
      if (operation === 'insert') {
        await insertKey(key);
      } else if (operation === 'search') {
        await searchKey(key);
      } else if (operation === 'delete') {
        setResult('Delete operation not implemented yet');
      }
    } finally {
      setIsRunning(false);
      setKeyInput('');
    }
  }, [isRunning, keyInput, operation, insertKey, searchKey]);

  const clearTree = useCallback(() => {
    setRoot(null);
    setNodeCount(0);
    setTreeHeight(0);
    setSplayCount(0);
    setResult('Tree cleared');
  }, []);

  const renderNode = (node: SplayNode, x: number, y: number, level: number): JSX.Element => {
    const nodeRadius = 20;
    const levelHeight = 60;
    
    return (
      <g key={node.id}>
        {/* Connection lines to children */}
        {node.left && (
          <line
            x1={x}
            y1={y + nodeRadius}
            x2={x - Math.pow(2, Math.max(0, 4 - level)) * 30}
            y2={y + levelHeight - nodeRadius}
            stroke="#6b7280"
            strokeWidth={1}
          />
        )}
        {node.right && (
          <line
            x1={x}
            y1={y + nodeRadius}
            x2={x + Math.pow(2, Math.max(0, 4 - level)) * 30}
            y2={y + levelHeight - nodeRadius}
            stroke="#6b7280"
            strokeWidth={1}
          />
        )}
        
        {/* Node circle */}
        <circle
          cx={x}
          cy={y}
          r={nodeRadius}
          fill={
            node.isSplaying
              ? '#f59e0b'
              : node.isRotating
              ? '#8b5cf6'
              : node.isHighlighted
              ? '#10b981'
              : '#f3f4f6'
          }
          stroke={node.isHighlighted || node.isSplaying || node.isRotating ? '#1f2937' : '#9ca3af'}
          strokeWidth={node.isHighlighted || node.isSplaying || node.isRotating ? 2 : 1}
        />
        
        {/* Node value */}
        <text
          x={x}
          y={y + 4}
          textAnchor="middle"
          fontSize="12"
          fill="#1f2937"
          fontWeight="bold"
        >
          {node.value}
        </text>
        
        {/* Render children */}
        {node.left && renderNode(
          node.left,
          x - Math.pow(2, Math.max(0, 4 - level)) * 30,
          y + levelHeight,
          level + 1
        )}
        {node.right && renderNode(
          node.right,
          x + Math.pow(2, Math.max(0, 4 - level)) * 30,
          y + levelHeight,
          level + 1
        )}
      </g>
    );
  };

  const renderTree = () => {
    if (!root) {
      return (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Splay tree is empty. Insert some keys to get started.
        </div>
      );
    }

    return (
      <div className="w-full overflow-auto">
        <svg width="800" height="400" className="mx-auto">
          {renderNode(root, 400, 40, 0)}
        </svg>
      </div>
    );
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <div className="flex items-center gap-2">
          <span className="text-sm">Operation:</span>
          <Select value={operation} onValueChange={(v: 'insert' | 'search' | 'delete') => setOperation(v)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="insert">Insert</SelectItem>
              <SelectItem value="search">Search</SelectItem>
              <SelectItem value="delete">Delete</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm">Key:</span>
          <Input 
            className="w-20" 
            value={keyInput} 
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="42"
            type="number"
          />
        </div>

        <Button onClick={runOperation} disabled={isRunning}>
          {isRunning ? 'Running...' : operation.charAt(0).toUpperCase() + operation.slice(1)}
        </Button>

        <Button onClick={clearTree} variant="outline">
          Clear Tree
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 p-4 bg-gradient-visualization rounded-xl border-2">
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-sm font-semibold mb-4">
                Splay Tree - {operation.charAt(0).toUpperCase() + operation.slice(1)} Operation
              </h3>
              {renderTree()}
            </div>
            
            {result && (
              <div className="text-center p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <div className="text-sm font-semibold text-green-700 dark:text-green-300">
                  {result}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-muted/20 rounded-xl border">
            <h3 className="text-sm font-semibold mb-2">Tree Stats</h3>
            <div className="text-xs space-y-1">
              <div><strong>Node Count:</strong> {nodeCount}</div>
              <div><strong>Tree Height:</strong> {treeHeight}</div>
              <div><strong>Splay Operations:</strong> {splayCount}</div>
              <div><strong>Root Value:</strong> {root?.value || 'None'}</div>
            </div>
          </div>
          
          <div className="p-4 bg-muted/20 rounded-xl border">
            <h3 className="text-sm font-semibold mb-2">Complexity</h3>
            <div className="text-xs space-y-1">
              <div><strong>Search:</strong> O(log n) amortized</div>
              <div><strong>Insert:</strong> O(log n) amortized</div>
              <div><strong>Delete:</strong> O(log n) amortized</div>
              <div><strong>Space:</strong> O(n)</div>
              <div><strong>Note:</strong> Self-optimizing for access patterns</div>
            </div>
          </div>
          
          <div className="p-4 bg-muted/20 rounded-xl border">
            <h3 className="text-sm font-semibold mb-2">Legend</h3>
            <div className="text-xs space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span>Highlighted/Found</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Splaying</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                <span>Rotating</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                <span>Normal Node</span>
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

      {showMemory && (
        <MemoryLayout
          data={root ? [root] : []}
          title="Splay Tree Memory Layout"
          baseAddress={31000}
          wordSize={8}
        />
      )}

      <div className="bg-muted/20 rounded-lg p-4 text-sm space-y-2">
        <div className="font-semibold text-primary">Splay Tree Properties:</div>
        <div>• <strong>Self-Adjusting:</strong> Recently accessed nodes move to root via splaying</div>
        <div>• <strong>Temporal Locality:</strong> Optimizes for repeated access to same elements</div>
        <div>• <strong>Amortized Performance:</strong> O(log n) average time over sequence of operations</div>
        <div>• <strong>Simple Implementation:</strong> No balance factors or colors needed</div>
        <div>• <strong>Applications:</strong> Caches, compilers, network routing, adaptive data structures</div>
      </div>
    </div>
  );
}