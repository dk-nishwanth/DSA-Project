import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

interface BTreeNode {
  keys: number[];
  children: BTreeNode[];
  isLeaf: boolean;
  id: string;
  x?: number;
  y?: number;
  isHighlighted?: boolean;
  isSearching?: boolean;
  isSplitting?: boolean;
}

export function BTreeVisualizer() {
  const [degree, setDegree] = useState(3);
  const [keyInput, setKeyInput] = useState('');
  const [operation, setOperation] = useState<'insert' | 'search' | 'delete'>('insert');
  const [root, setRoot] = useState<BTreeNode | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showMemory, setShowMemory] = useState(false);
  const [result, setResult] = useState<string>('');
  const [step, setStep] = useState(0);
  const [nodeCount, setNodeCount] = useState(0);
  const [treeHeight, setTreeHeight] = useState(0);

  const {
    voiceEnabled,
    setVoiceEnabled,
    speakOperation,
    speakStep,
    speakResult,
  } = useVisualizerVoice({ minInterval: 800 });

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const createNode = useCallback((isLeaf: boolean = true): BTreeNode => {
    return {
      keys: [],
      children: [],
      isLeaf,
      id: `node-${Date.now()}-${Math.random()}`,
      isHighlighted: false,
      isSearching: false,
      isSplitting: false,
    };
  }, []);

  const clearHighlights = useCallback((node: BTreeNode | null) => {
    if (!node) return;
    node.isHighlighted = false;
    node.isSearching = false;
    node.isSplitting = false;
    node.children.forEach(child => clearHighlights(child));
  }, []);

  const calculateTreeHeight = useCallback((node: BTreeNode | null): number => {
    if (!node) return 0;
    if (node.isLeaf) return 1;
    return 1 + Math.max(...node.children.map(child => calculateTreeHeight(child)));
  }, []);

  const countNodes = useCallback((node: BTreeNode | null): number => {
    if (!node) return 0;
    return 1 + node.children.reduce((sum, child) => sum + countNodes(child), 0);
  }, []);

  const insertKey = useCallback(async (key: number) => {
    speakOperation('B-Tree Insert', `Inserting key ${key} into B-Tree of degree ${degree}`);
    
    if (!root) {
      const newRoot = createNode(true);
      newRoot.keys.push(key);
      setRoot(newRoot);
      speakStep('Create root', `Created root node with key ${key}`, 0, 1);
      setResult(`Inserted ${key} as root node`);
      return;
    }

    const insertRecursive = async (node: BTreeNode, key: number): Promise<BTreeNode | null> => {
      node.isHighlighted = true;
      setRoot({...root});
      
      speakStep('Visit node', `Visiting node with keys [${node.keys.join(', ')}]`, step, 10);
      await sleep(600);
      
      if (node.isLeaf) {
        // Insert key in sorted order
        let i = 0;
        while (i < node.keys.length && node.keys[i] < key) {
          i++;
        }
        
        if (i < node.keys.length && node.keys[i] === key) {
          speakStep('Duplicate key', `Key ${key} already exists`, step, 10);
          return null;
        }
        
        node.keys.splice(i, 0, key);
        speakStep('Insert key', `Inserted ${key} at position ${i}`, step, 10);
        await sleep(500);
        
        // Check if node needs to split
        if (node.keys.length >= 2 * degree - 1) {
          node.isSplitting = true;
          setRoot({...root});
          speakStep('Node full', `Node is full, needs to split`, step, 10);
          await sleep(600);
          return await splitNode(node);
        }
        
        return null;
      } else {
        // Find child to insert into
        let i = 0;
        while (i < node.keys.length && key > node.keys[i]) {
          i++;
        }
        
        const splitChild = await insertRecursive(node.children[i], key);
        
        if (splitChild) {
          // Insert the promoted key
          const promotedKey = splitChild.keys[Math.floor(splitChild.keys.length / 2)];
          node.keys.splice(i, 0, promotedKey);
          
          // Split the child and insert new nodes
          const leftChild = createNode(splitChild.isLeaf);
          const rightChild = createNode(splitChild.isLeaf);
          
          const mid = Math.floor(splitChild.keys.length / 2);
          leftChild.keys = splitChild.keys.slice(0, mid);
          rightChild.keys = splitChild.keys.slice(mid + 1);
          
          if (!splitChild.isLeaf) {
            const midChild = Math.floor(splitChild.children.length / 2);
            leftChild.children = splitChild.children.slice(0, midChild + 1);
            rightChild.children = splitChild.children.slice(midChild + 1);
          }
          
          node.children[i] = leftChild;
          node.children.splice(i + 1, 0, rightChild);
          
          speakStep('Promote key', `Promoted key ${promotedKey} to parent`, step, 10);
          await sleep(600);
          
          // Check if current node needs to split
          if (node.keys.length >= 2 * degree - 1) {
            return await splitNode(node);
          }
        }
        
        return null;
      }
    };

    const splitNode = async (node: BTreeNode): Promise<BTreeNode> => {
      const mid = Math.floor(node.keys.length / 2);
      const newNode = createNode(false);
      
      newNode.keys = [node.keys[mid]];
      
      const leftChild = createNode(node.isLeaf);
      const rightChild = createNode(node.isLeaf);
      
      leftChild.keys = node.keys.slice(0, mid);
      rightChild.keys = node.keys.slice(mid + 1);
      
      if (!node.isLeaf) {
        const midChild = Math.floor(node.children.length / 2);
        leftChild.children = node.children.slice(0, midChild + 1);
        rightChild.children = node.children.slice(midChild + 1);
      }
      
      newNode.children = [leftChild, rightChild];
      
      speakStep('Split complete', `Split node, promoted ${node.keys[mid]}`, step, 10);
      await sleep(600);
      
      return newNode;
    };

    try {
      const newRoot = await insertRecursive(root, key);
      if (newRoot) {
        setRoot(newRoot);
        speakStep('New root', `Created new root after split`, step, 10);
      }
      
      clearHighlights(root);
      setNodeCount(countNodes(root));
      setTreeHeight(calculateTreeHeight(root));
      setResult(`Successfully inserted ${key}`);
      speakResult(`Inserted ${key} into B-Tree`);
    } catch (error) {
      setResult(`Error inserting ${key}: ${error}`);
    }
  }, [root, degree, createNode, step, speakOperation, speakStep, speakResult, countNodes, calculateTreeHeight, clearHighlights]);

  const searchKey = useCallback(async (key: number) => {
    if (!root) {
      setResult(`Key ${key} not found - tree is empty`);
      return;
    }

    speakOperation('B-Tree Search', `Searching for key ${key} in B-Tree`);
    
    const searchRecursive = async (node: BTreeNode | null, key: number): Promise<boolean> => {
      if (!node) return false;
      
      node.isSearching = true;
      setRoot({...root});
      
      speakStep('Search node', `Searching in node with keys [${node.keys.join(', ')}]`, step, 10);
      await sleep(600);
      
      // Search in current node
      for (let i = 0; i < node.keys.length; i++) {
        if (node.keys[i] === key) {
          node.isHighlighted = true;
          setRoot({...root});
          speakStep('Found key', `Found key ${key} at position ${i}`, step, 10);
          await sleep(600);
          return true;
        }
      }
      
      // If leaf node and not found
      if (node.isLeaf) {
        speakStep('Not found', `Key ${key} not found in leaf node`, step, 10);
        return false;
      }
      
      // Find child to search
      let i = 0;
      while (i < node.keys.length && key > node.keys[i]) {
        i++;
      }
      
      speakStep('Go to child', `Moving to child ${i}`, step, 10);
      await sleep(400);
      
      return await searchRecursive(node.children[i], key);
    };

    try {
      const found = await searchRecursive(root, key);
      clearHighlights(root);
      
      if (found) {
        setResult(`Key ${key} found in B-Tree`);
        speakResult(`Found key ${key}`);
      } else {
        setResult(`Key ${key} not found in B-Tree`);
        speakResult(`Key ${key} not found`);
      }
    } catch (error) {
      setResult(`Error searching for ${key}: ${error}`);
    }
  }, [root, step, speakOperation, speakStep, speakResult, clearHighlights]);

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
    setResult('Tree cleared');
  }, []);

  const renderNode = (node: BTreeNode, x: number, y: number, level: number): JSX.Element => {
    const nodeWidth = Math.max(80, node.keys.length * 30 + 20);
    const nodeHeight = 40;
    
    return (
      <g key={node.id}>
        {/* Node rectangle */}
        <rect
          x={x - nodeWidth / 2}
          y={y - nodeHeight / 2}
          width={nodeWidth}
          height={nodeHeight}
          fill={
            node.isSplitting
              ? '#fbbf24'
              : node.isHighlighted
              ? '#10b981'
              : node.isSearching
              ? '#3b82f6'
              : '#f3f4f6'
          }
          stroke={node.isHighlighted || node.isSearching ? '#1f2937' : '#9ca3af'}
          strokeWidth={node.isHighlighted || node.isSearching ? 2 : 1}
          rx={4}
        />
        
        {/* Keys */}
        {node.keys.map((key, index) => (
          <text
            key={index}
            x={x - nodeWidth / 2 + 15 + index * 30}
            y={y + 5}
            fontSize="12"
            fill="#1f2937"
            fontWeight="bold"
          >
            {key}
          </text>
        ))}
        
        {/* Children */}
        {!node.isLeaf && node.children.map((child, index) => {
          const childX = x - (node.children.length - 1) * 60 / 2 + index * 60;
          const childY = y + 80;
          
          return (
            <g key={child.id}>
              {/* Connection line */}
              <line
                x1={x}
                y1={y + nodeHeight / 2}
                x2={childX}
                y2={childY - nodeHeight / 2}
                stroke="#6b7280"
                strokeWidth={1}
              />
              {renderNode(child, childX, childY, level + 1)}
            </g>
          );
        })}
      </g>
    );
  };

  const renderTree = () => {
    if (!root) {
      return (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          B-Tree is empty. Insert some keys to get started.
        </div>
      );
    }

    return (
      <div className="w-full overflow-auto">
        <svg width="800" height="400" className="mx-auto">
          {renderNode(root, 400, 50, 0)}
        </svg>
      </div>
    );
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <div className="flex items-center gap-2">
          <span className="text-sm">Degree:</span>
          <Select value={degree.toString()} onValueChange={(v) => setDegree(parseInt(v))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="5">5</SelectItem>
            </SelectContent>
          </Select>
        </div>

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
                B-Tree (Degree {degree}) - {operation.charAt(0).toUpperCase() + operation.slice(1)} Operation
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
              <div><strong>Degree:</strong> {degree}</div>
              <div><strong>Max Keys/Node:</strong> {2 * degree - 1}</div>
              <div><strong>Min Keys/Node:</strong> {degree - 1}</div>
              <div><strong>Node Count:</strong> {nodeCount}</div>
              <div><strong>Tree Height:</strong> {treeHeight}</div>
            </div>
          </div>
          
          <div className="p-4 bg-muted/20 rounded-xl border">
            <h3 className="text-sm font-semibold mb-2">Complexity</h3>
            <div className="text-xs space-y-1">
              <div><strong>Search:</strong> O(log n)</div>
              <div><strong>Insert:</strong> O(log n)</div>
              <div><strong>Delete:</strong> O(log n)</div>
              <div><strong>Space:</strong> O(n)</div>
              <div><strong>Note:</strong> Optimized for disk I/O</div>
            </div>
          </div>
          
          <div className="p-4 bg-muted/20 rounded-xl border">
            <h3 className="text-sm font-semibold mb-2">Legend</h3>
            <div className="text-xs space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-300"></div>
                <span>Searching</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-400"></div>
                <span>Found/Highlighted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-yellow-400"></div>
                <span>Splitting</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-gray-300"></div>
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
          title="B-Tree Memory Layout"
          baseAddress={30000}
          wordSize={8}
        />
      )}

      <div className="bg-muted/20 rounded-lg p-4 text-sm space-y-2">
        <div className="font-semibold text-primary">B-Tree Properties:</div>
        <div>• <strong>Multi-way Tree:</strong> Each node can have multiple keys and children</div>
        <div>• <strong>Balanced:</strong> All leaf nodes are at the same level</div>
        <div>• <strong>Sorted:</strong> Keys within nodes are sorted, subtrees maintain BST property</div>
        <div>• <strong>Disk Optimized:</strong> Minimizes disk I/O by storing multiple keys per node</div>
        <div>• <strong>Applications:</strong> Database indexing, file systems, external storage</div>
      </div>
    </div>
  );
}