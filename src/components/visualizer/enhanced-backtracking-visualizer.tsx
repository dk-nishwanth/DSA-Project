import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

interface BacktrackStep {
  id: string;
  level: number;
  choice: any;
  state: any;
  isValid: boolean;
  isBacktrack: boolean;
  isSolution: boolean;
  timestamp: number;
}

interface TreeNode {
  id: string;
  value: string;
  level: number;
  x: number;
  y: number;
  parent?: TreeNode;
  children: TreeNode[];
  isValid: boolean;
  isBacktrack: boolean;
  isSolution: boolean;
  isCurrentPath: boolean;
  isExploring: boolean;
}

export function EnhancedBacktrackingVisualizer() {
  const [problem, setProblem] = useState<'permutations' | 'combinations' | 'subset-sum' | 'graph-coloring'>('permutations');
  const [input, setInput] = useState('1,2,3');
  const [target, setTarget] = useState('6'); // for subset sum
  const [isRunning, setIsRunning] = useState(false);
  const [showMemory, setShowMemory] = useState(false);
  const [result, setResult] = useState<string>('');
  const [step, setStep] = useState(0);
  const [solutions, setSolutions] = useState<any[]>([]);
  const [backtrackTree, setBacktrackTree] = useState<TreeNode | null>(null);
  const [currentPath, setCurrentPath] = useState<TreeNode[]>([]);
  const [exploredNodes, setExploredNodes] = useState(0);
  const [backtrackCount, setBacktrackCount] = useState(0);

  const {
    voiceEnabled,
    setVoiceEnabled,
    speakOperation,
    speakStep,
    speakResult,
  } = useVisualizerVoice({ minInterval: 800 });

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const createNode = useCallback((value: string, level: number, parent?: TreeNode): TreeNode => {
    return {
      id: `node-${Date.now()}-${Math.random()}`,
      value,
      level,
      x: 0,
      y: 0,
      parent,
      children: [],
      isValid: true,
      isBacktrack: false,
      isSolution: false,
      isCurrentPath: false,
      isExploring: false,
    };
  }, []);

  const updateTreeVisualization = useCallback((tree: TreeNode) => {
    // Calculate positions for tree nodes
    const calculatePositions = (node: TreeNode, x: number, y: number, width: number) => {
      node.x = x;
      node.y = y;
      
      if (node.children.length > 0) {
        const childWidth = width / node.children.length;
        node.children.forEach((child, index) => {
          const childX = x - width / 2 + (index + 0.5) * childWidth;
          calculatePositions(child, childX, y + 80, childWidth);
        });
      }
    };
    
    calculatePositions(tree, 400, 50, 800);
    setBacktrackTree({...tree});
  }, []);

  // Permutations Problem
  const solvePermutations = useCallback(async () => {
    const arr = input.split(',').map(s => s.trim()).filter(s => s);
    
    speakOperation('Backtracking Permutations', `Generating all permutations of [${arr.join(', ')}]`);
    
    const root = createNode('[]', 0);
    const foundSolutions: string[][] = [];
    let nodeCount = 0;
    let backtrackSteps = 0;
    
    const backtrack = async (node: TreeNode, used: boolean[], current: string[]): Promise<void> => {
      node.isExploring = true;
      updateTreeVisualization(root);
      setExploredNodes(++nodeCount);
      
      speakStep('Explore', `Exploring node: [${current.join(', ')}] at level ${node.level}`, step, arr.length);
      await sleep(600);
      
      if (current.length === arr.length) {
        // Found a complete permutation
        node.isSolution = true;
        foundSolutions.push([...current]);
        updateTreeVisualization(root);
        
        speakStep('Solution found', `Complete permutation: [${current.join(', ')}]`, step, arr.length);
        await sleep(800);
        
        node.isExploring = false;
        return;
      }
      
      // Try each unused element
      for (let i = 0; i < arr.length; i++) {
        if (!used[i]) {
          const childValue = `[${[...current, arr[i]].join(', ')}]`;
          const child = createNode(childValue, node.level + 1, node);
          node.children.push(child);
          
          used[i] = true;
          current.push(arr[i]);
          
          updateTreeVisualization(root);
          speakStep('Try choice', `Trying element '${arr[i]}' at position ${current.length - 1}`, step, arr.length);
          await sleep(500);
          
          await backtrack(child, used, current);
          
          // Backtrack
          current.pop();
          used[i] = false;
          
          child.isBacktrack = true;
          updateTreeVisualization(root);
          setBacktrackCount(++backtrackSteps);
          
          speakStep('Backtrack', `Backtracking from '${arr[i]}', trying next option`, step, arr.length);
          await sleep(400);
        }
      }
      
      node.isExploring = false;
      updateTreeVisualization(root);
    };
    
    await backtrack(root, new Array(arr.length).fill(false), []);
    
    setSolutions(foundSolutions);
    setResult(`Found ${foundSolutions.length} permutations. Explored ${nodeCount} nodes, backtracked ${backtrackSteps} times.`);
    speakResult(`Generated all ${foundSolutions.length} permutations using backtracking`);
  }, [input, createNode, updateTreeVisualization, step, speakOperation, speakStep, speakResult]);

  // Subset Sum Problem
  const solveSubsetSum = useCallback(async () => {
    const arr = input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    const targetSum = parseInt(target);
    
    speakOperation('Backtracking Subset Sum', `Finding subsets that sum to ${targetSum}`);
    
    const root = createNode('{}', 0);
    const foundSolutions: number[][] = [];
    let nodeCount = 0;
    let backtrackSteps = 0;
    
    const backtrack = async (node: TreeNode, index: number, current: number[], currentSum: number): Promise<void> => {
      node.isExploring = true;
      updateTreeVisualization(root);
      setExploredNodes(++nodeCount);
      
      speakStep('Explore', `Current subset: {${current.join(', ')}} sum=${currentSum}, index=${index}`, step, arr.length);
      await sleep(600);
      
      if (currentSum === targetSum) {
        // Found a valid subset
        node.isSolution = true;
        foundSolutions.push([...current]);
        updateTreeVisualization(root);
        
        speakStep('Solution found', `Valid subset: {${current.join(', ')}} = ${targetSum}`, step, arr.length);
        await sleep(800);
        
        node.isExploring = false;
        return;
      }
      
      if (index >= arr.length || currentSum > targetSum) {
        // Pruning: no more elements or sum exceeded
        node.isBacktrack = true;
        updateTreeVisualization(root);
        
        speakStep('Prune', `Pruning: ${currentSum > targetSum ? 'sum exceeded' : 'no more elements'}`, step, arr.length);
        await sleep(400);
        
        node.isExploring = false;
        return;
      }
      
      // Choice 1: Include current element
      const includeChild = createNode(`{${[...current, arr[index]].join(', ')}}`, node.level + 1, node);
      node.children.push(includeChild);
      
      current.push(arr[index]);
      updateTreeVisualization(root);
      
      speakStep('Include', `Including ${arr[index]}, new sum = ${currentSum + arr[index]}`, step, arr.length);
      await sleep(500);
      
      await backtrack(includeChild, index + 1, current, currentSum + arr[index]);
      
      // Backtrack from include
      current.pop();
      includeChild.isBacktrack = true;
      setBacktrackCount(++backtrackSteps);
      
      // Choice 2: Exclude current element
      const excludeChild = createNode(`{${current.join(', ')}}`, node.level + 1, node);
      node.children.push(excludeChild);
      
      updateTreeVisualization(root);
      speakStep('Exclude', `Excluding ${arr[index]}, sum remains ${currentSum}`, step, arr.length);
      await sleep(500);
      
      await backtrack(excludeChild, index + 1, current, currentSum);
      
      excludeChild.isBacktrack = true;
      setBacktrackCount(++backtrackSteps);
      
      node.isExploring = false;
      updateTreeVisualization(root);
    };
    
    await backtrack(root, 0, [], 0);
    
    setSolutions(foundSolutions);
    setResult(`Found ${foundSolutions.length} subsets that sum to ${targetSum}. Explored ${nodeCount} nodes.`);
    speakResult(`Found ${foundSolutions.length} valid subsets using backtracking`);
  }, [input, target, createNode, updateTreeVisualization, step, speakOperation, speakStep, speakResult]);

  // Graph Coloring Problem
  const solveGraphColoring = useCallback(async () => {
    // Simple graph: vertices connected in a cycle
    const vertices = input.split(',').map(s => s.trim()).filter(s => s);
    const colors = ['Red', 'Blue', 'Green', 'Yellow'];
    const maxColors = parseInt(target) || 3;
    
    speakOperation('Graph Coloring', `Coloring graph vertices with ${maxColors} colors`);
    
    // Create adjacency list for a cycle graph
    const adj: number[][] = vertices.map(() => []);
    for (let i = 0; i < vertices.length; i++) {
      adj[i].push((i + 1) % vertices.length);
      adj[i].push((i - 1 + vertices.length) % vertices.length);
    }
    
    const root = createNode('[]', 0);
    const foundSolutions: number[][] = [];
    let nodeCount = 0;
    
    const isSafe = (coloring: number[], vertex: number, color: number): boolean => {
      for (const neighbor of adj[vertex]) {
        if (coloring[neighbor] === color) return false;
      }
      return true;
    };
    
    const backtrack = async (node: TreeNode, vertex: number, coloring: number[]): Promise<void> => {
      node.isExploring = true;
      updateTreeVisualization(root);
      setExploredNodes(++nodeCount);
      
      const colorNames = coloring.map((c, i) => i < vertex ? colors[c] : '?');
      speakStep('Color vertex', `Coloring vertex ${vertex}: [${colorNames.join(', ')}]`, step, vertices.length);
      await sleep(600);
      
      if (vertex === vertices.length) {
        // All vertices colored successfully
        node.isSolution = true;
        foundSolutions.push([...coloring]);
        updateTreeVisualization(root);
        
        const solution = coloring.map(c => colors[c]);
        speakStep('Solution found', `Valid coloring: [${solution.join(', ')}]`, step, vertices.length);
        await sleep(800);
        
        node.isExploring = false;
        return;
      }
      
      // Try each color for current vertex
      for (let color = 0; color < maxColors; color++) {
        if (isSafe(coloring, vertex, color)) {
          const childValue = `[${coloring.slice(0, vertex).map(c => colors[c]).concat(colors[color]).join(', ')}]`;
          const child = createNode(childValue, node.level + 1, node);
          node.children.push(child);
          
          coloring[vertex] = color;
          updateTreeVisualization(root);
          
          speakStep('Try color', `Trying ${colors[color]} for vertex ${vertex}`, step, vertices.length);
          await sleep(500);
          
          await backtrack(child, vertex + 1, coloring);
          
          // Backtrack
          child.isBacktrack = true;
          updateTreeVisualization(root);
          
          speakStep('Backtrack', `${colors[color]} didn't work, trying next color`, step, vertices.length);
          await sleep(400);
        }
      }
      
      node.isExploring = false;
      updateTreeVisualization(root);
    };
    
    await backtrack(root, 0, new Array(vertices.length).fill(-1));
    
    setSolutions(foundSolutions);
    setResult(`Found ${foundSolutions.length} valid colorings with ${maxColors} colors.`);
    speakResult(`Found ${foundSolutions.length} valid graph colorings`);
  }, [input, target, createNode, updateTreeVisualization, step, speakOperation, speakStep, speakResult]);

  const runAlgorithm = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setResult('');
    setStep(0);
    setSolutions([]);
    setBacktrackTree(null);
    setExploredNodes(0);
    setBacktrackCount(0);
    
    try {
      if (problem === 'permutations') {
        await solvePermutations();
      } else if (problem === 'subset-sum') {
        await solveSubsetSum();
      } else if (problem === 'graph-coloring') {
        await solveGraphColoring();
      }
    } finally {
      setIsRunning(false);
    }
  }, [isRunning, problem, solvePermutations, solveSubsetSum, solveGraphColoring]);

  const renderTree = () => {
    if (!backtrackTree) {
      return (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Backtracking tree will appear here during algorithm execution
        </div>
      );
    }

    const renderNode = (node: TreeNode): JSX.Element => {
      return (
        <g key={node.id}>
          {/* Connection lines to children */}
          {node.children.map(child => (
            <line
              key={child.id}
              x1={node.x}
              y1={node.y + 15}
              x2={child.x}
              y2={child.y - 15}
              stroke={child.isBacktrack ? '#ef4444' : '#6b7280'}
              strokeWidth={child.isCurrentPath ? 3 : 1}
              strokeDasharray={child.isBacktrack ? '5,5' : 'none'}
            />
          ))}
          
          {/* Node */}
          <rect
            x={node.x - 40}
            y={node.y - 15}
            width={80}
            height={30}
            fill={
              node.isSolution
                ? '#10b981'
                : node.isExploring
                ? '#f59e0b'
                : node.isBacktrack
                ? '#ef4444'
                : '#f3f4f6'
            }
            stroke={node.isCurrentPath ? '#1f2937' : '#9ca3af'}
            strokeWidth={node.isCurrentPath ? 2 : 1}
            rx={4}
          />
          
          <text
            x={node.x}
            y={node.y + 4}
            textAnchor="middle"
            fontSize="10"
            fill="#1f2937"
            fontWeight="bold"
          >
            {node.value.length > 12 ? node.value.substring(0, 12) + '...' : node.value}
          </text>
          
          {/* Render children */}
          {node.children.map(child => renderNode(child))}
        </g>
      );
    };

    return (
      <div className="w-full overflow-auto">
        <svg width="800" height="500" className="mx-auto">
          {renderNode(backtrackTree)}
        </svg>
      </div>
    );
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <div className="flex items-center gap-2">
          <span className="text-sm">Problem:</span>
          <Select value={problem} onValueChange={(v: 'permutations' | 'combinations' | 'subset-sum' | 'graph-coloring') => setProblem(v)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="permutations">Permutations</SelectItem>
              <SelectItem value="subset-sum">Subset Sum</SelectItem>
              <SelectItem value="graph-coloring">Graph Coloring</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm">Input:</span>
          <Input 
            className="w-32" 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            placeholder={problem === 'permutations' ? '1,2,3' : '1,2,3,4'}
          />
        </div>

        {(problem === 'subset-sum' || problem === 'graph-coloring') && (
          <div className="flex items-center gap-2">
            <span className="text-sm">{problem === 'subset-sum' ? 'Target Sum:' : 'Max Colors:'}</span>
            <Input 
              className="w-20" 
              value={target} 
              onChange={(e) => setTarget(e.target.value)}
              placeholder={problem === 'subset-sum' ? '6' : '3'}
              type="number"
            />
          </div>
        )}

        <Button onClick={runAlgorithm} disabled={isRunning}>
          {isRunning ? 'Running...' : 'Start Backtracking'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 p-4 bg-gradient-visualization rounded-xl border-2">
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-sm font-semibold mb-4">
                Backtracking Tree - {problem.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Problem
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
            <h3 className="text-sm font-semibold mb-2">Algorithm Stats</h3>
            <div className="text-xs space-y-1">
              <div><strong>Problem:</strong> {problem.replace('-', ' ')}</div>
              <div><strong>Nodes Explored:</strong> {exploredNodes}</div>
              <div><strong>Backtrack Steps:</strong> {backtrackCount}</div>
              <div><strong>Solutions Found:</strong> {solutions.length}</div>
            </div>
          </div>
          
          <div className="p-4 bg-muted/20 rounded-xl border">
            <h3 className="text-sm font-semibold mb-2">Complexity</h3>
            <div className="text-xs space-y-1">
              {problem === 'permutations' && (
                <>
                  <div><strong>Time:</strong> O(n!)</div>
                  <div><strong>Space:</strong> O(n)</div>
                  <div><strong>Note:</strong> Factorial growth</div>
                </>
              )}
              {problem === 'subset-sum' && (
                <>
                  <div><strong>Time:</strong> O(2^n)</div>
                  <div><strong>Space:</strong> O(n)</div>
                  <div><strong>Note:</strong> Exponential with pruning</div>
                </>
              )}
              {problem === 'graph-coloring' && (
                <>
                  <div><strong>Time:</strong> O(k^n)</div>
                  <div><strong>Space:</strong> O(n)</div>
                  <div><strong>Note:</strong> k colors, n vertices</div>
                </>
              )}
            </div>
          </div>
          
          <div className="p-4 bg-muted/20 rounded-xl border">
            <h3 className="text-sm font-semibold mb-2">Legend</h3>
            <div className="text-xs space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-yellow-400"></div>
                <span>Currently Exploring</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-400"></div>
                <span>Solution Found</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-400"></div>
                <span>Backtracked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-gray-300"></div>
                <span>Unexplored</span>
              </div>
            </div>
          </div>

          {solutions.length > 0 && (
            <div className="p-4 bg-muted/20 rounded-xl border">
              <h3 className="text-sm font-semibold mb-2">Solutions ({solutions.length})</h3>
              <div className="text-xs space-y-1 max-h-32 overflow-y-auto">
                {solutions.slice(0, 10).map((sol, index) => (
                  <div key={index} className="p-1 bg-green-100 rounded text-green-800">
                    {Array.isArray(sol) ? `[${sol.join(', ')}]` : JSON.stringify(sol)}
                  </div>
                ))}
                {solutions.length > 10 && (
                  <div className="text-muted-foreground">... and {solutions.length - 10} more</div>
                )}
              </div>
            </div>
          )}
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
          data={backtrackTree ? [backtrackTree] : []}
          title="Backtracking Tree Memory"
          baseAddress={32000}
          wordSize={8}
        />
      )}

      <div className="bg-muted/20 rounded-lg p-4 text-sm space-y-2">
        <div className="font-semibold text-primary">Backtracking Algorithm Properties:</div>
        <div>• <strong>Systematic Search:</strong> Explores all possible solutions systematically</div>
        <div>• <strong>Constraint Satisfaction:</strong> Builds solutions incrementally, abandoning invalid paths</div>
        <div>• <strong>Tree Structure:</strong> Creates a search tree where each node represents a partial solution</div>
        <div>• <strong>Pruning:</strong> Eliminates branches that cannot lead to valid solutions</div>
        <div>• <strong>Applications:</strong> Puzzles, optimization, constraint satisfaction, combinatorial problems</div>
      </div>
    </div>
  );
}