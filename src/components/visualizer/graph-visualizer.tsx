import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { PseudocodeBox } from '@/components/pseudocode-box';

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

type Algorithm = 'dfs' | 'bfs' | 'dijkstra' | 'bellman-ford' | 'prim' | 'kruskal';

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
  const [currentStepDescription, setCurrentStepDescription] = useState('');
  const [visitedNodes, setVisitedNodes] = useState<string[]>([]);
  const [shortestPath, setShortestPath] = useState<string[]>([]);
  const [distances, setDistances] = useState<Map<string, number>>(new Map());
  const [queueState, setQueueState] = useState<string[]>([]);
  const [stackState, setStackState] = useState<string[]>([]);
  const [voiceExplain, setVoiceExplain] = useState<boolean>(() => {
    try {
      return localStorage.getItem('dsa_voice_explain') === '1';
    } catch { return false; }
  });

  // Speak current step description when toggled on
  useEffect(() => {
    if (!voiceExplain || !currentStepDescription) return;
    try {
      const utter = new SpeechSynthesisUtterance(currentStepDescription);
      utter.rate = 1.05; utter.pitch = 1.0; utter.volume = 0.85;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    } catch {}
  }, [voiceExplain, currentStepDescription]);

  const setVoice = (on: boolean) => {
    setVoiceExplain(on);
    try { localStorage.setItem('dsa_voice_explain', on ? '1' : '0'); } catch {}
  };

  // Pseudocode per algorithm with indicative line numbers
  const pseudocode = useMemo(() => ({
    bfs: [
      'queue ← [source]',
      'while queue not empty:',
      '  u ← queue.pop_front()',
      '  for each neighbor v of u:',
      '    if v not visited: parent[v]=u; queue.push_back(v)'
    ],
    dfs: [
      'dfs(u):',
      '  mark u visited',
      '  for each neighbor v of u:',
      '    if v not visited: dfs(v)'
    ],
    dijkstra: [
      'for all v: dist[v]=∞; dist[s]=0',
      'PQ ← {(0,s)} (min-heap by distance)',
      'while PQ not empty:',
      '  (du,u) ← extract_min(PQ)',
      '  for each edge (u,v,w):',
      '    if du + w < dist[v]: dist[v]=du+w; prev[v]=u; decrease_key(v)'
    ],
    bellmanFord: [
      'for all v: dist[v]=∞; dist[s]=0',
      'repeat |V|-1 times:',
      '  for each edge (u,v,w):',
      '    if dist[u]+w < dist[v]: dist[v]=dist[u]+w; prev[v]=u'
    ],
    prim: [
      'MST ← ∅; included ← {s}',
      'while |included| < |V|:',
      '  choose cheapest edge (u,v) with u∈included, v∉included',
      '  add (u,v) to MST; included ← included ∪ {v}'
    ],
    kruskal: [
      'sort edges by weight',
      'for each edge (u,v) in order:',
      '  if find(u) ≠ find(v):',
      '    union(u,v); add (u,v) to MST'
    ],
  }), []);

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
    setQueueState([]);
    setStackState([]);
    setCurrentStepDescription('');
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
    setCurrentStep(1);
    setCurrentStepDescription(`Enqueue start node ${sourceNode}`);
    setQueueState([...queue]);
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      setQueueState([...queue]);
      setCurrentStep(2);
      setCurrentStepDescription(`Dequeue ${current} and explore its neighbors`);
      
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
        setCurrentStep(6);
        setCurrentStepDescription(`Path found: ${path.join(' → ')}`);
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
          setCurrentStep(3);
          setCurrentStepDescription(`Discovered ${neighbor} from ${current} → enqueue ${neighbor}`);
          setQueueState([...queue]);
          
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
    setCurrentStepDescription('Initialize distances: dist[source]=0, others=∞.');
    setCurrentStep(1);
    
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
      setCurrentStepDescription(`Extract node ${current} with smallest tentative distance ${minDist}.`);
      setCurrentStep(3);
      
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
            setCurrentStepDescription(`Relax edge ${current}→${neighbor}: update dist[${neighbor}]=${alt}.`);
            setCurrentStep(5);
            
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

  const runBellmanFord = useCallback(async () => {
    const dist = new Map<string, number>();
    const previous = new Map<string, string>();
    nodes.forEach(n => dist.set(n.id, n.id === sourceNode ? 0 : Infinity));
    setDistances(new Map(dist));
    setCurrentStep(1);
    setCurrentStepDescription('Initialize distances; relax all edges |V|-1 times.');

    const edgeList = edges.map(e => ({ u: e.from, v: e.to, w: e.weight }));

    for (let i = 0; i < nodes.length - 1; i++) {
      let updated = false;
      for (const { u, v, w } of edgeList) {
        const du = dist.get(u)!;
        const dv = dist.get(v)!;
        if (du + w < dv) {
          highlightEdge(u, v, true);
          await sleep(500);
          dist.set(v, du + w);
          previous.set(v, u);
          setDistances(new Map(dist));
          updated = true;
          highlightEdge(u, v, false);
          await sleep(200);
          setCurrentStep(3);
          setCurrentStepDescription(`Relax edge ${u}→${v}: dist[${v}] = ${du+w}`);
        }
        // Also relax reverse to mimic undirected edges in this demo
        if (dv + w < du) {
          highlightEdge(v, u, true);
          await sleep(500);
          dist.set(u, dv + w);
          previous.set(u, v);
          setDistances(new Map(dist));
          updated = true;
          highlightEdge(v, u, false);
          await sleep(200);
        }
      }
      if (!updated) break;
    }

    if (dist.get(targetNode) !== Infinity) {
      const path: string[] = [];
      let cur: string | undefined = targetNode;
      while (cur) {
        path.unshift(cur);
        cur = previous.get(cur);
      }
      setShortestPath(path);
      for (let i = 0; i < path.length - 1; i++) {
        highlightEdge(path[i], path[i + 1], true);
      }
      toast.success(`Shortest path (Bellman-Ford): ${path.join(' → ')} (Distance: ${dist.get(targetNode)})`);
    } else {
      toast.error('No path found');
    }
  }, [nodes, edges, sourceNode, targetNode, highlightEdge]);

  // DFS (Depth-First) traversal visualization
  const runDFS = useCallback(async () => {
    const visited = new Set<string>();
    const parent = new Map<string, string>();

    // Simple recursive DFS
    const dfs = async (u: string) => {
      visited.add(u);
      setVisitedNodes(prev => [...prev, u]);
      highlightNode(u, true);
      setCurrentStep(10);
      setCurrentStepDescription(`Visit ${u}; push neighbors to stack conceptually`);
      setStackState(prev => [u, ...prev.filter(x => x !== u)]);
      await sleep(400);

      // neighbors of u
      const neighbors = edges
        .filter(e => e.from === u || e.to === u)
        .map(e => (e.from === u ? e.to : e.from));

      for (const v of neighbors) {
        if (!visited.has(v)) {
          parent.set(v, u);
          highlightEdge(u, v, true);
          setCurrentStep(11);
          setCurrentStepDescription(`Traverse edge ${u} → ${v}`);
          await sleep(500);
          await dfs(v);
          highlightEdge(u, v, false);
        }
      }

      highlightNode(u, false);
      setStackState(prev => prev.filter(x => x !== u));
    };

    await dfs(sourceNode);

    // If a target is set and reached, reconstruct a path (best-effort)
    if (visited.has(targetNode)) {
      const path: string[] = [];
      let cur: string | undefined = targetNode;
      while (cur) {
        path.unshift(cur);
        cur = parent.get(cur);
      }
      setShortestPath(path);
      for (let i = 0; i < path.length - 1; i++) {
        highlightEdge(path[i], path[i + 1], true);
      }
      toast.success(`DFS reached target. Path: ${path.join(' → ')}`);
    } else {
      toast.info('DFS completed. Target not necessarily reached.');
    }
  }, [edges, sourceNode, targetNode, highlightNode, highlightEdge]);

  // Prim's MST (grows tree from a start node)
  const runPrim = useCallback(async () => {
    const included = new Set<string>();
    included.add(sourceNode);
    setVisitedNodes([sourceNode]);
    setCurrentStep(1);
    setCurrentStepDescription('Start with source in MST; repeatedly add the cheapest connecting edge.');

    // reset MST flags
    setEdges(prev => prev.map(e => ({ ...e, isInPath: false, isHighlighted: false })));

    while (included.size < nodes.length) {
      let best: { from: string; to: string; weight: number } | null = null;
      for (const e of edges) {
        const uIn = included.has(e.from), vIn = included.has(e.to);
        if (uIn !== vIn) {
          if (!best || e.weight < best.weight) best = { from: e.from, to: e.to, weight: e.weight };
        }
      }
      if (!best) {
        toast.error('Graph is not fully connected; MST cannot include all nodes.');
        break;
      }

      const u = best.from, v = best.to;
      const newNode = included.has(u) ? v : u;
      highlightEdge(u, v, true);
      await sleep(600);
      setCurrentStep(3);
      setCurrentStepDescription(`Add cheapest edge (${u},${v}); include ${newNode}.`);
      setEdges(prev => prev.map(e => (
        (e.from === u && e.to === v) || (e.from === v && e.to === u)
          ? { ...e, isInPath: true, isHighlighted: false }
          : e
      )));
      included.add(newNode);
      setVisitedNodes(prev => [...prev, newNode]);
      await sleep(400);
    }

    if (included.size === nodes.length) {
      toast.success('Prim: MST constructed');
    }
  }, [edges, nodes, sourceNode, highlightEdge]);

  // Kruskal's MST (sort all edges and add if no cycle)
  const runKruskal = useCallback(async () => {
    // reset MST flags
    setEdges(prev => prev.map(e => ({ ...e, isInPath: false, isHighlighted: false })));
    setCurrentStep(1);
    setCurrentStepDescription('Sort edges by weight; add if endpoints are in different sets.');

    const vertexIds = nodes.map(n => n.id);
    const parent = new Map<string, string>();
    const rank = new Map<string, number>();
    for (const v of vertexIds) { parent.set(v, v); rank.set(v, 0); }
    const find = (x: string): string => {
      const p = parent.get(x)!;
      if (p !== x) parent.set(x, find(p));
      return parent.get(x)!;
    };
    const unite = (a: string, b: string) => {
      let ra = find(a), rb = find(b);
      if (ra === rb) return false;
      const raRank = rank.get(ra)!; const rbRank = rank.get(rb)!;
      if (raRank < rbRank) parent.set(ra, rb);
      else if (raRank > rbRank) parent.set(rb, ra);
      else { parent.set(rb, ra); rank.set(ra, raRank + 1); }
      return true;
    };

    const sortedEdges = [...edges].sort((e1, e2) => e1.weight - e2.weight);
    let added = 0;
    for (const e of sortedEdges) {
      if (added === nodes.length - 1) break;
      if (unite(e.from, e.to)) {
        highlightEdge(e.from, e.to, true);
        await sleep(500);
        setCurrentStep(3);
        setCurrentStepDescription(`Edge (${e.from},${e.to}) added to MST (no cycle).`);
        setEdges(prev => prev.map(x => (
          (x.from === e.from && x.to === e.to) || (x.from === e.to && x.to === e.from)
            ? { ...x, isInPath: true, isHighlighted: false }
            : x
        )));
        added++;
        await sleep(300);
      }
    }
    if (added === nodes.length - 1) toast.success('Kruskal: MST constructed');
    else toast.error('Kruskal: MST not complete (graph may be disconnected)');
  }, [edges, nodes, highlightEdge]);

  // ...

  return (
    <div className="w-full space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        {/* ... */}
        <div className="flex items-center gap-2 ml-auto">
          <label className="text-sm">Voice Explain</label>
          <input
            type="checkbox"
            checked={voiceExplain}
            onChange={(e)=>setVoice(e.target.checked)}
          />
        </div>
        {/* ... */}
      </div>

      {/* Visualization */}
      <div className="relative bg-gradient-visualization rounded-xl border-2 border-border/50">
        {/* ... */}
      </div>

      {/* Algorithm Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-muted/20 rounded-lg p-3">
          <h4 className="font-medium mb-2">Algorithm Info:</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            {/* ... */}
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
            {currentStepDescription && (
              <div className="mt-2 p-2 bg-muted/30 rounded">{currentStepDescription}</div>
            )}
          </div>
        </div>
      </div>

      {/* Pseudocode Panel */}
      <PseudocodeBox
        title={`${selectedAlgorithm.toUpperCase()} - Pseudocode`}
        code={
          selectedAlgorithm==='bfs' ? pseudocode.bfs :
          selectedAlgorithm==='dfs' ? pseudocode.dfs :
          selectedAlgorithm==='dijkstra' ? pseudocode.dijkstra :
          selectedAlgorithm==='bellman-ford' ? pseudocode.bellmanFord :
          selectedAlgorithm==='prim' ? pseudocode.prim :
          pseudocode.kruskal
        }
        highlightedLine={currentStep}
      />
    </div>
  );
}