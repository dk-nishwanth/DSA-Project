import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { PseudocodeBox } from '@/components/pseudocode-box';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

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

type Algorithm = 'dfs' | 'bfs' | 'dijkstra' | 'bellman-ford' | 'floyd-warshall' | 'prim' | 'kruskal' | 'topological-sort';

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
  const [showMemory, setShowMemory] = useState(false);
  const [currentStepText, setCurrentStepText] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  
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
  const [isDirected, setIsDirected] = useState(false);
  const [showWeights, setShowWeights] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(800);
  const [graphPreset, setGraphPreset] = useState('default');
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
    floydWarshall: [
      'for k = 0 to |V|-1:',
      '  for i = 0 to |V|-1:',
      '    for j = 0 to |V|-1:',
      '      if dist[i][k] + dist[k][j] < dist[i][j]:',
      '        dist[i][j] = dist[i][k] + dist[k][j]'
    ],
    topologicalSort: [
      'compute in-degrees for all vertices',
      'queue ← vertices with in-degree 0',
      'while queue not empty:',
      '  u ← queue.dequeue()',
      '  for each neighbor v of u:',
      '    decrease in-degree of v',
      '    if in-degree of v = 0: queue.enqueue(v)'
    ]
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

  // Graph presets
  const graphPresets = {
    default: {
      nodes: [
        { id: 'A', x: 150, y: 100 },
        { id: 'B', x: 350, y: 100 },
        { id: 'C', x: 550, y: 100 },
        { id: 'D', x: 150, y: 250 },
        { id: 'E', x: 350, y: 250 },
        { id: 'F', x: 550, y: 250 }
      ],
      edges: [
        { from: 'A', to: 'B', weight: 4 },
        { from: 'A', to: 'D', weight: 2 },
        { from: 'B', to: 'C', weight: 3 },
        { from: 'B', to: 'E', weight: 1 },
        { from: 'C', to: 'F', weight: 2 },
        { from: 'D', to: 'E', weight: 5 },
        { from: 'E', to: 'F', weight: 3 }
      ]
    },
    dag: {
      nodes: [
        { id: 'A', x: 100, y: 100 },
        { id: 'B', x: 250, y: 100 },
        { id: 'C', x: 400, y: 100 },
        { id: 'D', x: 175, y: 200 },
        { id: 'E', x: 325, y: 200 },
        { id: 'F', x: 250, y: 300 }
      ],
      edges: [
        { from: 'A', to: 'B', weight: 1 },
        { from: 'A', to: 'D', weight: 1 },
        { from: 'B', to: 'C', weight: 1 },
        { from: 'B', to: 'E', weight: 1 },
        { from: 'D', to: 'F', weight: 1 },
        { from: 'E', to: 'F', weight: 1 }
      ]
    },
    complete: {
      nodes: [
        { id: 'A', x: 200, y: 100 },
        { id: 'B', x: 350, y: 150 },
        { id: 'C', x: 300, y: 300 },
        { id: 'D', x: 150, y: 300 },
        { id: 'E', x: 100, y: 150 }
      ],
      edges: [
        { from: 'A', to: 'B', weight: 2 },
        { from: 'A', to: 'C', weight: 4 },
        { from: 'A', to: 'D', weight: 1 },
        { from: 'A', to: 'E', weight: 3 },
        { from: 'B', to: 'C', weight: 1 },
        { from: 'B', to: 'D', weight: 5 },
        { from: 'B', to: 'E', weight: 2 },
        { from: 'C', to: 'D', weight: 3 },
        { from: 'C', to: 'E', weight: 1 },
        { from: 'D', to: 'E', weight: 2 }
      ]
    }
  };

  // Load graph preset
  const loadPreset = useCallback((preset: string) => {
    const presetData = graphPresets[preset as keyof typeof graphPresets];
    if (presetData) {
      setNodes(presetData.nodes);
      setEdges(presetData.edges);
      resetGraph();
    }
  }, [resetGraph]);

  useEffect(() => {
    if (graphPreset !== 'default') {
      loadPreset(graphPreset);
    }
  }, [graphPreset, loadPreset]);

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
    
    speakOperation("Breadth First Search", `Starting BFS from node ${sourceNode}. We'll explore all neighbors at current depth before moving to next depth level.`);
    setVisitedNodes([sourceNode]);
    highlightNode(sourceNode, true);
    setCurrentStep(1);
    setCurrentStepDescription(`Enqueue start node ${sourceNode}`);
    speakStep("", `Starting BFS from node ${sourceNode}. Adding it to the queue for processing.`, 1, nodes.length);
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
        
        speakResult(`BFS complete! Found shortest path from ${sourceNode} to ${targetNode}: ${path.join(' → ')}. Path length is ${path.length - 1} edges.`);
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
          speakStep("", `Exploring neighbor ${neighbor} from ${current}. Adding ${neighbor} to queue for later processing.`, visited.size + 1, nodes.length);
          setQueueState([...queue]);
          
          await sleep(animationSpeed);
          
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
          await sleep(animationSpeed * 0.75);
          
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
        await sleep(animationSpeed * 0.375);
      }
    }
    if (added === nodes.length - 1) toast.success('Kruskal: MST constructed');
    else toast.error('Kruskal: MST not complete (graph may be disconnected)');
  }, [edges, nodes, highlightEdge]);

  // Floyd-Warshall Algorithm (All-pairs shortest paths)
  const runFloydWarshall = useCallback(async () => {
    const nodeIds = nodes.map(n => n.id);
    const n = nodeIds.length;
    const dist: number[][] = Array(n).fill(0).map(() => Array(n).fill(Infinity));
    const next: (string | null)[][] = Array(n).fill(0).map(() => Array(n).fill(null));
    
    // Initialize distance matrix
    for (let i = 0; i < n; i++) {
      dist[i][i] = 0;
    }
    
    for (const edge of edges) {
      const i = nodeIds.indexOf(edge.from);
      const j = nodeIds.indexOf(edge.to);
      if (i !== -1 && j !== -1) {
        dist[i][j] = edge.weight;
        next[i][j] = edge.to;
        // For undirected graphs
        if (!isDirected) {
          dist[j][i] = edge.weight;
          next[j][i] = edge.from;
        }
      }
    }
    
    setCurrentStep(1);
    setCurrentStepDescription('Initialize distance matrix with direct edge weights');
    await sleep(animationSpeed);
    
    // Floyd-Warshall main algorithm
    for (let k = 0; k < n; k++) {
      highlightNode(nodeIds[k], true);
      setCurrentStep(2);
      setCurrentStepDescription(`Using ${nodeIds[k]} as intermediate vertex`);
      await sleep(animationSpeed);
      
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (dist[i][k] + dist[k][j] < dist[i][j]) {
            dist[i][j] = dist[i][k] + dist[k][j];
            next[i][j] = next[i][k];
            
            if (i !== j && nodeIds[i] && nodeIds[j]) {
              highlightEdge(nodeIds[i], nodeIds[j], true);
              setCurrentStep(3);
              setCurrentStepDescription(`Updated distance ${nodeIds[i]} → ${nodeIds[j]} = ${dist[i][j]} via ${nodeIds[k]}`);
              await sleep(animationSpeed * 0.5);
              highlightEdge(nodeIds[i], nodeIds[j], false);
            }
          }
        }
      }
      
      highlightNode(nodeIds[k], false);
    }
    
    // Show final distances
    const distanceMap = new Map<string, number>();
    const sourceIdx = nodeIds.indexOf(sourceNode);
    if (sourceIdx !== -1) {
      for (let i = 0; i < n; i++) {
        if (dist[sourceIdx][i] !== Infinity) {
          distanceMap.set(nodeIds[i], dist[sourceIdx][i]);
        }
      }
      setDistances(distanceMap);
    }
    
    toast.success('Floyd-Warshall: All-pairs shortest paths computed');
  }, [nodes, edges, sourceNode, isDirected, highlightNode, highlightEdge, animationSpeed]);

  // Topological Sort (Kahn's Algorithm)
  const runTopologicalSort = useCallback(async () => {
    if (!isDirected) {
      toast.error('Topological sort requires a directed graph');
      return;
    }
    
    const nodeIds = nodes.map(n => n.id);
    const inDegree = new Map<string, number>();
    const adjList = new Map<string, string[]>();
    
    // Initialize
    for (const nodeId of nodeIds) {
      inDegree.set(nodeId, 0);
      adjList.set(nodeId, []);
    }
    
    // Build adjacency list and calculate in-degrees
    for (const edge of edges) {
      adjList.get(edge.from)?.push(edge.to);
      inDegree.set(edge.to, (inDegree.get(edge.to) || 0) + 1);
    }
    
    // Find nodes with in-degree 0
    const queue: string[] = [];
    for (const [nodeId, degree] of inDegree) {
      if (degree === 0) {
        queue.push(nodeId);
      }
    }
    
    const result: string[] = [];
    setCurrentStep(1);
    setCurrentStepDescription('Initialize: Find vertices with in-degree 0');
    setQueueState([...queue]);
    await sleep(animationSpeed);
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      result.push(current);
      setVisitedNodes([...result]);
      highlightNode(current, true);
      
      setCurrentStep(2);
      setCurrentStepDescription(`Process ${current}: Add to topological order`);
      await sleep(animationSpeed);
      
      // Reduce in-degree of neighbors
      const neighbors = adjList.get(current) || [];
      for (const neighbor of neighbors) {
        highlightEdge(current, neighbor, true);
        const newDegree = (inDegree.get(neighbor) || 0) - 1;
        inDegree.set(neighbor, newDegree);
        
        setCurrentStep(3);
        setCurrentStepDescription(`Reduce in-degree of ${neighbor} to ${newDegree}`);
        await sleep(animationSpeed * 0.5);
        
        if (newDegree === 0) {
          queue.push(neighbor);
          setCurrentStepDescription(`${neighbor} now has in-degree 0, add to queue`);
        }
        
        highlightEdge(current, neighbor, false);
      }
      
      setQueueState([...queue]);
      highlightNode(current, false);
      await sleep(animationSpeed * 0.5);
    }
    
    if (result.length === nodeIds.length) {
      toast.success(`Topological order: ${result.join(' → ')}`);
      setShortestPath(result);
    } else {
      toast.error('Graph contains a cycle - topological sort not possible');
    }
  }, [nodes, edges, isDirected, highlightNode, highlightEdge, animationSpeed]);

  // Main algorithm runner
  const runAlgorithm = useCallback(async () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    resetGraph();
    
    const algorithmNames = {
      'bfs': 'Breadth-First Search',
      'dfs': 'Depth-First Search', 
      'dijkstra': "Dijkstra's Algorithm",
      'bellman-ford': 'Bellman-Ford Algorithm',
      'floyd-warshall': 'Floyd-Warshall Algorithm',
      'prim': "Prim's Algorithm",
      'kruskal': "Kruskal's Algorithm",
      'topological-sort': 'Topological Sort'
    };
    
    const algorithmName = algorithmNames[selectedAlgorithm] || selectedAlgorithm;
    setCurrentStepText(`Starting ${algorithmName} on the graph`);
    speakOperation(algorithmName, `Starting ${algorithmName} algorithm on the graph. This will demonstrate how the algorithm explores or processes the graph structure.`);
    
    try {
      switch (selectedAlgorithm) {
        case 'bfs':
          await runBFS();
          break;
        case 'dfs':
          await runDFS();
          break;
        case 'dijkstra':
          await runDijkstra();
          break;
        case 'bellman-ford':
          await runBellmanFord();
          break;
        case 'floyd-warshall':
          await runFloydWarshall();
          break;
        case 'prim':
          await runPrim();
          break;
        case 'kruskal':
          await runKruskal();
          break;
        case 'topological-sort':
          await runTopologicalSort();
          break;
        default:
          toast.error('Algorithm not implemented');
      }
      
      speakResult(`${algorithmName} completed successfully! The algorithm has finished processing the graph.`);
    } catch (error) {
      toast.error('Algorithm execution failed');
      console.error(error);
      speakResult(`${algorithmName} execution failed. Please check the graph configuration and try again.`);
    } finally {
      setIsAnimating(false);
      setCurrentStepText('');
    }
  }, [
    isAnimating, selectedAlgorithm, resetGraph, runBFS, runDFS, runDijkstra, 
    runBellmanFord, runFloydWarshall, runPrim, runKruskal, runTopologicalSort
  ]);

  return (
    <div className="w-full space-y-4">
      {/* Enhanced Controls */}
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        {/* Algorithm Selection */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Algorithm:</label>
          <Select value={selectedAlgorithm} onValueChange={(value: Algorithm) => setSelectedAlgorithm(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bfs">BFS</SelectItem>
              <SelectItem value="dfs">DFS</SelectItem>
              <SelectItem value="dijkstra">Dijkstra</SelectItem>
              <SelectItem value="bellman-ford">Bellman-Ford</SelectItem>
              <SelectItem value="floyd-warshall">Floyd-Warshall</SelectItem>
              <SelectItem value="prim">Prim's MST</SelectItem>
              <SelectItem value="kruskal">Kruskal's MST</SelectItem>
              <SelectItem value="topological-sort">Topological Sort</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Graph Type */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Graph Type:</label>
          <Select value={isDirected ? 'directed' : 'undirected'} onValueChange={(value) => setIsDirected(value === 'directed')}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="undirected">Undirected</SelectItem>
              <SelectItem value="directed">Directed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Graph Presets */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Preset:</label>
          <Select value={graphPreset} onValueChange={setGraphPreset}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="dag">DAG</SelectItem>
              <SelectItem value="complete">Complete</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Source Node */}
        {(selectedAlgorithm === 'bfs' || selectedAlgorithm === 'dfs' || 
          selectedAlgorithm === 'dijkstra' || selectedAlgorithm === 'bellman-ford' ||
          selectedAlgorithm === 'prim') && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Source:</label>
            <Select value={sourceNode} onValueChange={setSourceNode}>
              <SelectTrigger className="w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {nodes.map(node => (
                  <SelectItem key={node.id} value={node.id}>{node.id}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Target Node */}
        {(selectedAlgorithm === 'bfs' || selectedAlgorithm === 'dfs' || 
          selectedAlgorithm === 'dijkstra' || selectedAlgorithm === 'bellman-ford') && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Target:</label>
            <Select value={targetNode} onValueChange={setTargetNode}>
              <SelectTrigger className="w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {nodes.map(node => (
                  <SelectItem key={node.id} value={node.id}>{node.id}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Animation Speed */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Speed:</label>
          <Select value={animationSpeed.toString()} onValueChange={(value) => setAnimationSpeed(Number(value))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1200">Slow</SelectItem>
              <SelectItem value="800">Normal</SelectItem>
              <SelectItem value="400">Fast</SelectItem>
              <SelectItem value="200">Very Fast</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Show Weights Toggle */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Show Weights:</label>
          <input
            type="checkbox"
            checked={showWeights}
            onChange={(e) => setShowWeights(e.target.checked)}
            className="rounded"
          />
        </div>

        {/* Control Buttons */}
        <div className="flex gap-2 ml-auto">
          <Button
            onClick={runAlgorithm}
            disabled={isAnimating}
            className="flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            {isAnimating ? 'Running...' : 'Run Algorithm'}
          </Button>
          
          <Button
            onClick={resetGraph}
            variant="outline"
            disabled={isAnimating}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>

        {/* Voice Explain */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Voice Explain:</label>
          <input
            type="checkbox"
            checked={voiceExplain}
            onChange={(e) => setVoice(e.target.checked)}
            className="rounded"
          />
        </div>
      </div>

      {/* Enhanced Visualization */}
      <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border-2 border-border/50 min-h-[400px]">
        <svg width="700" height="400" className="w-full h-full">
          {/* Render Edges */}
          {edges.map((edge, index) => {
            const fromNode = nodes.find(n => n.id === edge.from);
            const toNode = nodes.find(n => n.id === edge.to);
            if (!fromNode || !toNode) return null;

            const dx = toNode.x - fromNode.x;
            const dy = toNode.y - fromNode.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const unitX = dx / length;
            const unitY = dy / length;
            
            // Adjust for node radius
            const nodeRadius = 25;
            const startX = fromNode.x + unitX * nodeRadius;
            const startY = fromNode.y + unitY * nodeRadius;
            const endX = toNode.x - unitX * nodeRadius;
            const endY = toNode.y - unitY * nodeRadius;

            return (
              <g key={`${edge.from}-${edge.to}-${index}`}>
                {/* Edge Line */}
                <line
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke={edge.isHighlighted ? '#3b82f6' : edge.isInPath ? '#10b981' : '#6b7280'}
                  strokeWidth={edge.isHighlighted || edge.isInPath ? 3 : 2}
                  className="transition-all duration-300"
                />
                
                {/* Arrow for directed graphs */}
                {isDirected && (
                  <polygon
                    points={`${endX},${endY} ${endX - 8 * unitX + 4 * unitY},${endY - 8 * unitY - 4 * unitX} ${endX - 8 * unitX - 4 * unitY},${endY - 8 * unitY + 4 * unitX}`}
                    fill={edge.isHighlighted ? '#3b82f6' : edge.isInPath ? '#10b981' : '#6b7280'}
                    className="transition-all duration-300"
                  />
                )}
                
                {/* Edge Weight */}
                {showWeights && (
                  <text
                    x={(startX + endX) / 2}
                    y={(startY + endY) / 2 - 5}
                    textAnchor="middle"
                    className="text-xs font-medium fill-gray-700 dark:fill-gray-300"
                    style={{ fontSize: '12px' }}
                  >
                    {edge.weight}
                  </text>
                )}
              </g>
            );
          })}

          {/* Render Nodes */}
          {nodes.map((node) => (
            <g key={node.id}>
              {/* Node Circle */}
              <circle
                cx={node.x}
                cy={node.y}
                r={25}
                fill={
                  node.isSource ? '#10b981' :
                  node.isTarget ? '#ef4444' :
                  node.isHighlighted ? '#3b82f6' :
                  node.visited ? '#8b5cf6' :
                  '#f3f4f6'
                }
                stroke={
                  node.isHighlighted ? '#1d4ed8' :
                  node.visited ? '#7c3aed' :
                  '#6b7280'
                }
                strokeWidth={node.isHighlighted ? 3 : 2}
                className="transition-all duration-300 cursor-pointer hover:stroke-blue-500"
              />
              
              {/* Node Label */}
              <text
                x={node.x}
                y={node.y + 5}
                textAnchor="middle"
                className="text-sm font-bold fill-gray-800 dark:fill-gray-200 pointer-events-none"
                style={{ fontSize: '14px' }}
              >
                {node.id}
              </text>
              
              {/* Distance Label */}
              {distances.has(node.id) && distances.get(node.id) !== Infinity && (
                <text
                  x={node.x}
                  y={node.y - 35}
                  textAnchor="middle"
                  className="text-xs font-medium fill-blue-600 dark:fill-blue-400"
                  style={{ fontSize: '11px' }}
                >
                  d: {distances.get(node.id)}
                </text>
              )}
            </g>
          ))}
        </svg>

        {/* Legend */}
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 rounded-lg p-3 text-xs space-y-1 backdrop-blur-sm">
          <div className="font-medium mb-2">Legend:</div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Source</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Target</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Current</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span>Visited</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-green-500"></div>
            <span>Path</span>
          </div>
        </div>
      </div>

      {/* Enhanced Algorithm Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-muted/20 rounded-lg p-4">
          <h4 className="font-medium mb-3 text-primary">Algorithm Info</h4>
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Algorithm:</span>
              <span className="font-medium">{selectedAlgorithm.toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Graph Type:</span>
              <span className="font-medium">{isDirected ? 'Directed' : 'Undirected'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Vertices:</span>
              <span className="font-medium">{nodes.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Edges:</span>
              <span className="font-medium">{edges.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className={`font-medium ${isAnimating ? 'text-blue-600' : 'text-green-600'}`}>
                {isAnimating ? 'Running' : 'Ready'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-muted/20 rounded-lg p-4">
          <h4 className="font-medium mb-3 text-primary">Current State</h4>
          <div className="text-sm space-y-2">
            {(selectedAlgorithm === 'bfs' || selectedAlgorithm === 'dfs' || 
              selectedAlgorithm === 'dijkstra' || selectedAlgorithm === 'bellman-ford' ||
              selectedAlgorithm === 'prim') && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Source:</span>
                <span className="font-medium text-green-600">{sourceNode}</span>
              </div>
            )}
            {(selectedAlgorithm === 'bfs' || selectedAlgorithm === 'dfs' || 
              selectedAlgorithm === 'dijkstra' || selectedAlgorithm === 'bellman-ford') && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Target:</span>
                <span className="font-medium text-red-600">{targetNode}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Visited:</span>
              <span className="font-medium">{visitedNodes.length}</span>
            </div>
            {queueState.length > 0 && (
              <div>
                <span className="text-muted-foreground">Queue:</span>
                <div className="mt-1 text-xs bg-blue-100 dark:bg-blue-900/30 rounded px-2 py-1">
                  [{queueState.join(', ')}]
                </div>
              </div>
            )}
            {stackState.length > 0 && (
              <div>
                <span className="text-muted-foreground">Stack:</span>
                <div className="mt-1 text-xs bg-purple-100 dark:bg-purple-900/30 rounded px-2 py-1">
                  [{stackState.join(', ')}]
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-muted/20 rounded-lg p-4">
          <h4 className="font-medium mb-3 text-primary">Results</h4>
          <div className="text-sm space-y-2">
            {shortestPath.length > 0 && (
              <div>
                <span className="text-muted-foreground">Path Found:</span>
                <div className="mt-1 text-xs bg-green-100 dark:bg-green-900/30 rounded px-2 py-1 font-mono">
                  {shortestPath.join(' → ')}
                </div>
              </div>
            )}
            {distances.size > 0 && (
              <div>
                <span className="text-muted-foreground">Distances:</span>
                <div className="mt-1 space-y-1">
                  {Array.from(distances.entries()).map(([node, dist]) => (
                    <div key={node} className="flex justify-between text-xs">
                      <span>{node}:</span>
                      <span className="font-mono">{dist === Infinity ? '∞' : dist}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {currentStepDescription && (
              <div>
                <span className="text-muted-foreground">Current Step:</span>
                <div className="mt-1 text-xs bg-yellow-100 dark:bg-yellow-900/30 rounded px-2 py-1">
                  {currentStepDescription}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Pseudocode Panel */}
      <PseudocodeBox
        title={`${selectedAlgorithm.toUpperCase()} Algorithm - Pseudocode`}
        code={
          selectedAlgorithm === 'bfs' ? pseudocode.bfs :
          selectedAlgorithm === 'dfs' ? pseudocode.dfs :
          selectedAlgorithm === 'dijkstra' ? pseudocode.dijkstra :
          selectedAlgorithm === 'bellman-ford' ? pseudocode.bellmanFord :
          selectedAlgorithm === 'floyd-warshall' ? pseudocode.floydWarshall :
          selectedAlgorithm === 'prim' ? pseudocode.prim :
          selectedAlgorithm === 'kruskal' ? pseudocode.kruskal :
          selectedAlgorithm === 'topological-sort' ? pseudocode.topologicalSort :
          pseudocode.bfs
        }
        highlightedLine={currentStep}
      />
    </div>
  );
}