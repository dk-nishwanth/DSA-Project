import React, { useState, useCallback } from 'react';
import { Play, RotateCcw, Link, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

interface UFNode {
  id: number;
  parent: number;
  rank: number;
  x: number;
  y: number;
  isHighlighted?: boolean;
  isRoot?: boolean;
}

export function UnionFindVisualizer() {
  const [nodes, setNodes] = useState<UFNode[]>(
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      parent: i, // Initially, each node is its own parent
      rank: 0,
      x: 100 + (i % 4) * 150,
      y: 100 + Math.floor(i / 4) * 150,
      isRoot: true
    }))
  );
  
  const [nodeA, setNodeA] = useState('');
  const [nodeB, setNodeB] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [highlightedNodes, setHighlightedNodes] = useState<number[]>([]);
  const [operation, setOperation] = useState<'union' | 'find' | null>(null);
  const [showMemory, setShowMemory] = useState(false);
  const [currentStepText, setCurrentStepText] = useState('');
  const { voiceEnabled, setVoiceEnabled, speakOperation, speakStep, speakResult } = useVisualizerVoice({ minInterval: 1200 });

  const find = useCallback(async (nodeId: number, animate = false): Promise<number> => {
    if (animate) {
      setHighlightedNodes([nodeId]);
      speakOperation('Find', `Find root of node ${nodeId}`);
      setCurrentStepText(`Find(${nodeId}) - highlight path to root`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    let current = nodeId;
    const path = [current];
    
    // Find root with path compression visualization
    while (nodes[current].parent !== current) {
      current = nodes[current].parent;
      path.push(current);
      
      if (animate) {
        setHighlightedNodes(path);
        speakStep('', `Move to parent ${current}`);
        setCurrentStepText(`Move up to parent ${current}`);
        await new Promise(resolve => setTimeout(resolve, 600));
      }
    }
    
    if (animate && path.length > 1) {
      // Show path compression
      const newNodes = [...nodes];
      for (const node of path) {
        if (node !== current) {
          newNodes[node].parent = current;
        }
      }
      setNodes(newNodes);
      
      toast.info(`Path compression applied for node ${nodeId}`);
      speakStep('', `Compress path: set parents along path to ${current}`);
      setCurrentStepText(`Path compression: set parents along path to ${current}`);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    return current;
  }, [nodes, speakOperation, speakStep]);

  const union = useCallback(async (a: number, b: number) => {
    setIsAnimating(true);
    setOperation('union');
    speakOperation('Union', `Union nodes ${a} and ${b} by rank`);
    setCurrentStepText(`Union(${a}, ${b}) - find roots and attach smaller rank under larger`);
    
    // Find roots of both sets
    const rootA = await find(a, true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const rootB = await find(b, true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (rootA === rootB) {
      toast.info(`Nodes ${a} and ${b} are already in the same set`);
      speakResult(`Nodes ${a} and ${b} already united`);
      setCurrentStepText(`Nodes ${a} and ${b} are already connected`);
      setHighlightedNodes([]);
      setIsAnimating(false);
      setOperation(null);
      return;
    }
    
    // Union by rank
    const newNodes = [...nodes];
    
    if (newNodes[rootA].rank < newNodes[rootB].rank) {
      newNodes[rootA].parent = rootB;
      newNodes[rootA].isRoot = false;
      speakStep('', `Attach root ${rootA} under ${rootB}`);
      setCurrentStepText(`Attach ${rootA} under ${rootB}`);
    } else if (newNodes[rootA].rank > newNodes[rootB].rank) {
      newNodes[rootB].parent = rootA;
      newNodes[rootB].isRoot = false;
      speakStep('', `Attach root ${rootB} under ${rootA}`);
      setCurrentStepText(`Attach ${rootB} under ${rootA}`);
    } else {
      newNodes[rootB].parent = rootA;
      newNodes[rootB].isRoot = false;
      newNodes[rootA].rank++;
      speakStep('', `Equal rank: attach ${rootB} under ${rootA} and increment rank of ${rootA}`);
      setCurrentStepText(`Equal rank: attach ${rootB} under ${rootA} and increment rank(${rootA})`);
    }
    
    setNodes(newNodes);
    setHighlightedNodes([rootA, rootB]);
    
    toast.success(`United nodes ${a} and ${b}`);
    
    setTimeout(() => {
      setHighlightedNodes([]);
      setIsAnimating(false);
      setOperation(null);
    }, 1000);
  }, [nodes, find, speakOperation, speakStep, speakResult]);

  const findOperation = useCallback(async (nodeId: number) => {
    setIsAnimating(true);
    setOperation('find');
    
    const root = await find(nodeId, true);
    
    toast.success(`Root of node ${nodeId} is: ${root}`);
    
    setTimeout(() => {
      setHighlightedNodes([]);
      setIsAnimating(false);
      setOperation(null);
    }, 1000);
  }, [find]);

  const handleUnion = useCallback(() => {
    const a = parseInt(nodeA);
    const b = parseInt(nodeB);
    
    if (isNaN(a) || isNaN(b) || a < 0 || a >= nodes.length || b < 0 || b >= nodes.length) {
      toast.error('Please enter valid node numbers (0-7)');
      return;
    }
    
    if (a === b) {
      toast.error('Please enter different node numbers');
      return;
    }
    
    union(a, b);
  }, [nodeA, nodeB, nodes.length, union]);

  const handleFind = useCallback(() => {
    const nodeId = parseInt(nodeA);
    
    if (isNaN(nodeId) || nodeId < 0 || nodeId >= nodes.length) {
      toast.error('Please enter a valid node number (0-7)');
      return;
    }
    
    findOperation(nodeId);
  }, [nodeA, nodes.length, findOperation]);

  const resetUnionFind = useCallback(() => {
    setNodes(
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        parent: i,
        rank: 0,
        x: 100 + (i % 4) * 150,
        y: 100 + Math.floor(i / 4) * 150,
        isRoot: true
      }))
    );
    setHighlightedNodes([]);
    setIsAnimating(false);
    setOperation(null);
    setNodeA('');
    setNodeB('');
    toast.success('Union-Find data structure reset');
  }, []);

  const renderConnections = useCallback(() => {
    const connections: JSX.Element[] = [];
    
    nodes.forEach(node => {
      if (node.parent !== node.id) {
        const parent = nodes[node.parent];
        connections.push(
          <line
            key={`connection-${node.id}-${node.parent}`}
            x1={node.x}
            y1={node.y}
            x2={parent.x}
            y2={parent.y}
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            markerEnd="url(#arrowhead)"
            className="animate-fade-in"
          />
        );
      }
    });
    
    return connections;
  }, [nodes]);

  const getSets = useCallback(() => {
    const sets = new Map<number, number[]>();
    
    nodes.forEach(node => {
      let root = node.id;
      while (nodes[root].parent !== root) {
        root = nodes[root].parent;
      }
      
      if (!sets.has(root)) {
        sets.set(root, []);
      }
      sets.get(root)!.push(node.id);
    });
    
    return Array.from(sets.entries());
  }, [nodes]);

  return (
    <div className="w-full space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Node A (0-7)"
            value={nodeA}
            onChange={(e) => setNodeA(e.target.value)}
            className="w-32"
            min="0"
            max="7"
            disabled={isAnimating}
          />
          <Input
            type="number"
            placeholder="Node B (0-7)"
            value={nodeB}
            onChange={(e) => setNodeB(e.target.value)}
            className="w-32"
            min="0"
            max="7"
            disabled={isAnimating}
          />
          <Button
            onClick={handleUnion}
            disabled={isAnimating}
            size="sm"
            className="flex items-center gap-1"
          >
            <Link className="h-3 w-3" />
            Union
          </Button>
        </div>
        
          <Button
            onClick={handleFind}
          disabled={isAnimating}
          size="sm"
          variant="secondary"
          className="flex items-center gap-1"
        >
          <Search className="h-3 w-3" />
          Find Root of A
        </Button>
        
        <Button
          onClick={resetUnionFind}
          disabled={isAnimating}
          size="sm"
          variant="outline"
          className="flex items-center gap-1"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </Button>
      </div>

      <div className="flex justify-center">
        <VisualizerControls
          showMemory={showMemory}
          onToggleMemory={setShowMemory}
          voiceEnabled={voiceEnabled}
          onToggleVoice={setVoiceEnabled}
        />
      </div>

      {/* Step Panel */}
      {currentStepText && (
        <div className="p-2 bg-muted/20 rounded text-sm text-center">{currentStepText}</div>
      )}

      {showMemory && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MemoryLayout
            data={nodes.map(n=>n.parent)}
            title="Parent Array"
            baseAddress={5000}
            wordSize={4}
          />
          <MemoryLayout
            data={nodes.map(n=>n.rank)}
            title="Rank Array"
            baseAddress={5200}
            wordSize={4}
          />
        </div>
      )}

      {/* Current Sets Display */}
      <div className="bg-muted/20 rounded-lg p-3">
        <div className="font-medium mb-2">Current Disjoint Sets:</div>
        <div className="flex flex-wrap gap-2">
          {getSets().map(([root, members], index) => (
            <div key={root} className="flex items-center gap-2">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                Set {index + 1}: {`{${members.sort((a, b) => a - b).join(', ')}}`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Visualization */}
      <div className="relative bg-gradient-visualization rounded-xl border-2 border-border/50">
        <svg width="700" height="350" className="w-full h-auto">
          {/* Arrow marker definition */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="hsl(var(--primary))"
              />
            </marker>
          </defs>
          
          {/* Connections */}
          {renderConnections()}
          
          {/* Nodes */}
          {nodes.map(node => (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r="25"
                fill={
                  highlightedNodes.includes(node.id)
                    ? "hsl(var(--primary))"
                    : node.parent === node.id
                      ? "hsl(var(--success))"
                      : "hsl(var(--card))"
                }
                stroke={
                  node.parent === node.id
                    ? "hsl(var(--success-foreground))"
                    : "hsl(var(--border))"
                }
                strokeWidth="2"
                className={`transition-all duration-300 ${
                  highlightedNodes.includes(node.id) ? 'animate-pulse' : ''
                }`}
              />
              <text
                x={node.x}
                y={node.y + 4}
                textAnchor="middle"
                className="text-sm font-bold fill-card-foreground"
              >
                {node.id}
              </text>
              
              {/* Rank display for roots */}
              {node.parent === node.id && node.rank > 0 && (
                <text
                  x={node.x + 20}
                  y={node.y - 20}
                  textAnchor="middle"
                  className="text-xs fill-success font-medium"
                >
                  r:{node.rank}
                </text>
              )}
            </g>
          ))}
        </svg>
        
        {/* Operation Status */}
        {operation && (
          <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 border shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">
                {operation === 'union' ? 'Performing Union...' : 'Finding Root...'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="text-sm text-muted-foreground bg-muted/20 rounded-lg p-3">
        <div className="font-medium mb-2">Union-Find Legend:</div>
        <div className="grid grid-cols-2 gap-2">
          <div>• <span className="text-success">Green circles:</span> Root nodes</div>
          <div>• <span className="text-primary">Blue highlight:</span> Current operation</div>
          <div>• <span className="text-primary">Arrows:</span> Parent-child relationships</div>
          <div>• <strong>r:</strong> Rank of root nodes (for union by rank)</div>
        </div>
      </div>
    </div>
  );
}