import React, { useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface GraphNode {
  id: string;
  x: number;
  y: number;
  visited?: boolean;
  distance?: number;
  isSource?: boolean;
  isTarget?: boolean;
  isHighlighted?: boolean;
}

interface GraphEdge {
  from: string;
  to: string;
  weight: number;
  isHighlighted?: boolean;
  isInPath?: boolean;
}

type Algorithm = 'dfs' | 'bfs' | 'dijkstra' | 'bellman-ford';

export function GraphVisualizer() {
  const [nodes, setNodes] = useState<GraphNode[]>([
    { id: 'A', x: 150, y: 100 },
    { id: 'B', x: 350, y: 100 },
    { id: 'C', x: 550, y: 100 },
    { id: 'D', x: 150, y: 250 },
    { id: 'E', x: 350, y: 250 },
    { id: 'F', x: 550, y: 250 }
  ]);
  
  const [edges, setEdges] = useState<GraphEdge[]>([
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'D', weight: 2 },
    { from: 'B', to: 'C', weight: 3 },
    { from: 'B', to: 'E', weight: 1 },
    { from: 'C', to: 'F', weight: 2 },
    { from: 'D', to: 'E', weight: 5 },
    { from: 'E', to: 'F', weight: 3 }
  ]);
  
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm>('bfs');
  const [sourceNode, setSourceNode] = useState('A');
  const [targetNode, setTargetNode] = useState('F');
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [visitedNodes, setVisitedNodes] = useState<string[]>([]);
  const [shortestPath, setShortestPath] = useState<string[]>([]);
  const [distances, setDistances] = useState<Map<string, number>>(new Map());

  const resetGraph = useCallback(() => {
    setNodes(prev => prev.map(node => ({
      ...node,
      visited: false,
      distance: undefined,
      isHighlighted: false,
      isSource: node.id === sourceNode,
      isTarget: node.id === targetNode
    })));
    
    setEdges(prev => prev.map(edge => ({
      ...edge,
      isHighlighted: false,
      isInPath: false
    })));
    
    setVisitedNodes([]);
    setShortestPath([]);
    setDistances(new Map());
    setCurrentStep(0);
    setIsAnimating(false);
  }, [sourceNode, targetNode]);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const highlightNode = useCallback((nodeId: string, highlight: boolean) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, isHighlighted: highlight } : node
    ));
  }, []);

  const highlightEdge = useCallback((from: string, to: string, highlight: boolean) => {
    setEdges(prev => prev.map(edge => 
      (edge.from === from && edge.to === to) || (edge.from === to && edge.to === from)
        ? { ...edge, isHighlighted: highlight }
        : edge
    ));
  }, []);

  const runBFS = useCallback(async () => {
    const queue = [sourceNode];
    const visited = new Set<string>();
    const parent = new Map<string, string>();
    
    setVisitedNodes([sourceNode]);
    highlightNode(sourceNode, true);
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      
      if (current === targetNode) {
        // Reconstruct path
        const path = [];
        let node = targetNode;
        while (node) {
          path.unshift(node);
          node = parent.get(node)!;
        }
        setShortestPath(path);
        
        // Highlight path edges
        for (let i = 0; i < path.length - 1; i++) {
          highlightEdge(path[i], path[i + 1], true);
        }
        
        toast.success(`Path found: ${path.join(' → ')}`);
        return;
      }
      
      visited.add(current);
      
      // Find neighbors
      const neighbors = edges
        .filter(edge => edge.from === current || edge.to === current)
        .map(edge => edge.from === current ? edge.to : edge.from)
        .filter(neighbor => !visited.has(neighbor));
      
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          queue.push(neighbor);
          parent.set(neighbor, current);
          setVisitedNodes(prev => [...prev, neighbor]);
          highlightNode(neighbor, true);
          highlightEdge(current, neighbor, true);
          
          await sleep(800);
          
          highlightEdge(current, neighbor, false);
        }
      }
      
      highlightNode(current, false);
      await sleep(400);
    }
    
    toast.error('No path found');
  }, [sourceNode, targetNode, edges, highlightNode, highlightEdge]);

  const runDijkstra = useCallback(async () => {
    const dist = new Map<string, number>();
    const previous = new Map<string, string>();
    const unvisited = new Set(nodes.map(n => n.id));
    
    // Initialize distances
    nodes.forEach(node => {
      dist.set(node.id, node.id === sourceNode ? 0 : Infinity);
    });
    
    setDistances(new Map(dist));
    
    while (unvisited.size > 0) {
      // Find unvisited node with minimum distance
      let current = '';
      let minDist = Infinity;
      
      for (const nodeId of unvisited) {
        const nodeDist = dist.get(nodeId)!;
        if (nodeDist < minDist) {
          minDist = nodeDist;
          current = nodeId;
        }
      }
      
      if (minDist === Infinity) break;
      
      unvisited.delete(current);
      setVisitedNodes(prev => [...prev, current]);
      highlightNode(current, true);
      
      // Update distances to neighbors
      const currentEdges = edges.filter(edge => 
        edge.from === current || edge.to === current
      );
      
      for (const edge of currentEdges) {
        const neighbor = edge.from === current ? edge.to : edge.from;
        
        if (unvisited.has(neighbor)) {
          const alt = dist.get(current)! + edge.weight;
          
          highlightEdge(current, neighbor, true);
          await sleep(600);
          
          if (alt < dist.get(neighbor)!) {
            dist.set(neighbor, alt);
            previous.set(neighbor, current);
            setDistances(new Map(dist));
            
            toast.info(`Updated distance to ${neighbor}: ${alt}`);
          }
          
          highlightEdge(current, neighbor, false);
        }
      }
      
      await sleep(800);
      highlightNode(current, false);
    }
    
    // Reconstruct shortest path
    if (dist.get(targetNode) !== Infinity) {
      const path = [];
      let current = targetNode;
      
      while (current) {
        path.unshift(current);
        current = previous.get(current)!;
      }
      
      setShortestPath(path);
      
      // Highlight path
      for (let i = 0; i < path.length - 1; i++) {
        highlightEdge(path[i], path[i + 1], true);
      }
      
      toast.success(`Shortest path: ${path.join(' → ')} (Distance: ${dist.get(targetNode)})`);
    } else {
      toast.error('No path found');
    }
  }, [sourceNode, targetNode, nodes, edges, highlightNode, highlightEdge]);

  const runAlgorithm = useCallback(async () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    resetGraph();
    
    await sleep(500);
    
    try {
      switch (selectedAlgorithm) {
        case 'bfs':
          await runBFS();
          break;
        case 'dijkstra':
          await runDijkstra();
          break;
        default:
          toast.info('Algorithm not implemented yet');
      }
    } catch (error) {
      toast.error('Algorithm execution failed');
    }
    
    setIsAnimating(false);
  }, [isAnimating, selectedAlgorithm, runBFS, runDijkstra, resetGraph]);

  const getNodePosition = useCallback((nodeId: string) => {
    return nodes.find(n => n.id === nodeId)!;
  }, [nodes]);

  return (
    <div className="w-full space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <Select value={selectedAlgorithm} onValueChange={(value: Algorithm) => setSelectedAlgorithm(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bfs">BFS (Breadth-First)</SelectItem>
            <SelectItem value="dfs">DFS (Depth-First)</SelectItem>
            <SelectItem value="dijkstra">Dijkstra's Algorithm</SelectItem>
            <SelectItem value="bellman-ford">Bellman-Ford</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={sourceNode} onValueChange={setSourceNode}>
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {nodes.map(node => (
              <SelectItem key={node.id} value={node.id}>
                Start: {node.id}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={targetNode} onValueChange={setTargetNode}>
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {nodes.map(node => (
              <SelectItem key={node.id} value={node.id}>
                End: {node.id}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button
          onClick={runAlgorithm}
          disabled={isAnimating}
          className="flex items-center gap-1"
        >
          <Play className="h-4 w-4" />
          Run {selectedAlgorithm.toUpperCase()}
        </Button>
        
        <Button
          onClick={resetGraph}
          disabled={isAnimating}
          variant="outline"
          className="flex items-center gap-1"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>

      {/* Visualization */}
      <div className="relative bg-gradient-visualization rounded-xl border-2 border-border/50">
        <svg width="700" height="350" className="w-full h-auto">
          {/* Edges */}
          {edges.map((edge, index) => {
            const fromNode = getNodePosition(edge.from);
            const toNode = getNodePosition(edge.to);
            const midX = (fromNode.x + toNode.x) / 2;
            const midY = (fromNode.y + toNode.y) / 2;
            
            return (
              <g key={index}>
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={
                    edge.isInPath || edge.isHighlighted
                      ? "hsl(var(--primary))"
                      : "hsl(var(--muted-foreground))"
                  }
                  strokeWidth={edge.isInPath ? "4" : "2"}
                  className="transition-all duration-300"
                />
                
                {/* Edge weight */}
                <circle
                  cx={midX}
                  cy={midY}
                  r="12"
                  fill="hsl(var(--card))"
                  stroke="hsl(var(--border))"
                  strokeWidth="1"
                />
                <text
                  x={midX}
                  y={midY + 3}
                  textAnchor="middle"
                  className="text-xs font-medium fill-card-foreground"
                >
                  {edge.weight}
                </text>
              </g>
            );
          })}
          
          {/* Nodes */}
          {nodes.map(node => (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r="20"
                fill={
                  node.id === sourceNode
                    ? "hsl(var(--success))"
                    : node.id === targetNode
                      ? "hsl(var(--destructive))"
                      : node.isHighlighted
                        ? "hsl(var(--primary))"
                        : visitedNodes.includes(node.id)
                          ? "hsl(var(--warning))"
                          : "hsl(var(--card))"
                }
                stroke="hsl(var(--border))"
                strokeWidth="2"
                className={`transition-all duration-300 ${
                  node.isHighlighted ? 'animate-pulse' : ''
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
              
              {/* Distance label for Dijkstra */}
              {distances.has(node.id) && distances.get(node.id) !== Infinity && (
                <text
                  x={node.x}
                  y={node.y - 30}
                  textAnchor="middle"
                  className="text-xs fill-primary font-medium"
                >
                  d: {distances.get(node.id)}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* Algorithm Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-muted/20 rounded-lg p-3">
          <h4 className="font-medium mb-2">Algorithm Info:</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            {selectedAlgorithm === 'bfs' && (
              <>
                <div>• Explores graph level by level</div>
                <div>• Guarantees shortest path (unweighted)</div>
                <div>• Time: O(V + E), Space: O(V)</div>
              </>
            )}
            {selectedAlgorithm === 'dijkstra' && (
              <>
                <div>• Finds shortest path with weights</div>
                <div>• Uses priority queue (greedy approach)</div>
                <div>• Time: O((V + E) log V), Space: O(V)</div>
              </>
            )}
          </div>
        </div>
        
        <div className="bg-muted/20 rounded-lg p-3">
          <h4 className="font-medium mb-2">Current State:</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <div>• Source: <span className="text-success font-medium">{sourceNode}</span></div>
            <div>• Target: <span className="text-destructive font-medium">{targetNode}</span></div>
            {shortestPath.length > 0 && (
              <div>• Path: <span className="text-primary font-medium">{shortestPath.join(' → ')}</span></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}