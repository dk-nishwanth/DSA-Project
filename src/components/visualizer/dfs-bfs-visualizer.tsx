import { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, RotateCcw, StepForward } from 'lucide-react';
import { toast } from 'sonner';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

interface GraphNode {
  id: number;
  x: number;
  y: number;
  visited: boolean;
  current: boolean;
  inQueue: boolean;
  inStack: boolean;
}

interface GraphEdge {
  from: number;
  to: number;
  highlighted: boolean;
  animated: boolean;
}

const PseudocodeBox = ({ title, code, highlightedLine }: { title: string; code: string[]; highlightedLine: number }) => (
  <div className="p-4 bg-card border rounded-lg shadow-sm">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <div className="space-y-1 font-mono text-sm">
      {code.map((line, idx) => (
        <div key={idx} className={idx === highlightedLine ? 'bg-primary/20 p-1 rounded -ml-1 pl-1 border-l-2 border-primary' : 'py-1'}>
          {line}
        </div>
      ))}
    </div>
  </div>
);

const ComplexityBox = ({ title, timeComplexity, spaceComplexity, description }: { title: string; timeComplexity: string; spaceComplexity: string; description: string }) => (
  <div className="p-4 bg-card border rounded-lg shadow-sm">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p><strong>Time Complexity:</strong> {timeComplexity}</p>
    <p><strong>Space Complexity:</strong> {spaceComplexity}</p>
    <p className="mt-2 text-muted-foreground">{description}</p>
  </div>
);

export function DFSBFSVisualizer() {
  const [nodes, setNodes] = useState<GraphNode[]>([
    { id: 0, x: 300, y: 50, visited: false, current: false, inQueue: false, inStack: false },
    { id: 1, x: 150, y: 150, visited: false, current: false, inQueue: false, inStack: false },
    { id: 2, x: 300, y: 150, visited: false, current: false, inQueue: false, inStack: false },
    { id: 3, x: 450, y: 150, visited: false, current: false, inQueue: false, inStack: false },
    { id: 4, x: 100, y: 250, visited: false, current: false, inQueue: false, inStack: false },
    { id: 5, x: 200, y: 250, visited: false, current: false, inQueue: false, inStack: false },
    { id: 6, x: 300, y: 250, visited: false, current: false, inQueue: false, inStack: false },
    { id: 7, x: 400, y: 250, visited: false, current: false, inQueue: false, inStack: false },
  ]);

  const [edges, setEdges] = useState<GraphEdge[]>([
    { from: 0, to: 1, highlighted: false, animated: false },
    { from: 0, to: 2, highlighted: false, animated: false },
    { from: 0, to: 3, highlighted: false, animated: false },
    { from: 1, to: 4, highlighted: false, animated: false },
    { from: 1, to: 5, highlighted: false, animated: false },
    { from: 2, to: 5, highlighted: false, animated: false },
    { from: 2, to: 6, highlighted: false, animated: false },
    { from: 3, to: 6, highlighted: false, animated: false },
    { from: 3, to: 7, highlighted: false, animated: false },
  ]);

  const [algorithm, setAlgorithm] = useState<'dfs' | 'bfs'>('dfs');
  const [startNode, setStartNode] = useState('0');
  const [generator, setGenerator] = useState<Generator | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [visitOrder, setVisitOrder] = useState<number[]>([]);
  const [queue, setQueue] = useState<number[]>([]);
  const [stack, setStack] = useState<number[]>([]);
  const [showMemory, setShowMemory] = useState(false);
  const [currentStepText, setCurrentStepText] = useState('');
  
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

  const pseudocodeDFS = [
    "function DFS(graph, startNode):",
    "  let visited = new Set()",
    "  let stack = [startNode]",
    "  while (stack is not empty):",
    "    current = stack.pop()",
    "    if (current not in visited):",
    "      visited.add(current)",
    "      for each neighbor of current:",
    "        if neighbor not visited:",
    "          stack.push(neighbor)"
  ];

  const pseudocodeBFS = [
    "function BFS(graph, startNode):",
    "  let visited = new Set()",
    "  let queue = [startNode]",
    "  while (queue is not empty):",
    "    current = queue.dequeue()",
    "    if (current not in visited):",
    "      visited.add(current)",
    "      for each neighbor of current:",
    "        if neighbor not visited:",
    "          queue.enqueue(neighbor)"
  ];

  const getNeighbors = (nodeId: number) => {
    const neighbors: number[] = [];
    edges.forEach(edge => {
      if (edge.from === nodeId) neighbors.push(edge.to);
      if (edge.to === nodeId) neighbors.push(edge.from);
    });
    return neighbors;
  };

  const highlightEdge = (from: number, to: number, animate: boolean = true) => {
    setEdges(edges => edges.map(e => ({
      ...e,
      highlighted: (e.from === from && e.to === to) || (e.from === to && e.to === from),
      animated: animate && ((e.from === from && e.to === to) || (e.from === to && e.to === from))
    })));
  };

  function* runDFS(start: number): Generator {
    const visited = new Set<number>();
    let stackLocal: number[] = [start];
    const order: number[] = [];
    let step = 0;

    setNodes(nodes => nodes.map(n => ({ ...n, visited: false, current: false, inStack: n.id === start })));
    setStack([start]);
    setCurrentStep(0);

    while (stackLocal.length > 0) {
      const current = stackLocal.pop()!;
      setStack([...stackLocal]);
      setNodes(nodes => nodes.map(n => ({ ...n, current: n.id === current, inStack: stackLocal.includes(n.id) })));
      setCurrentStep(step++);
      yield;

      if (!visited.has(current)) {
        visited.add(current);
        order.push(current);
        setVisitOrder([...order]);
        setNodes(nodes => nodes.map(n => ({ ...n, visited: visited.has(n.id), current: false })));

        const neighbors = getNeighbors(current);
        for (const neighbor of neighbors.reverse()) {
          if (!visited.has(neighbor) && !stackLocal.includes(neighbor)) {
            highlightEdge(current, neighbor);
            setNodes(nodes => nodes.map(n => n.id === neighbor ? { ...n, current: true } : n));
            yield;
            stackLocal.push(neighbor);
            setNodes(nodes => nodes.map(n => ({ ...n, inStack: stackLocal.includes(n.id), current: false })));
            setEdges(edges => edges.map(e => ({ ...e, highlighted: false, animated: false })));
          }
        }
      }
    }
    setCurrentStep(-1);
    toast.success(`DFS completed! Visit order: ${order.join(' → ')}`);
  }

  function* runBFS(start: number): Generator {
    const visited = new Set<number>();
    let queueLocal: number[] = [start];
    const order: number[] = [];
    let step = 0;

    setNodes(nodes => nodes.map(n => ({ ...n, visited: false, current: false, inQueue: n.id === start, inStack: false })));
    setQueue([start]);
    setCurrentStep(0);

    while (queueLocal.length > 0) {
      const current = queueLocal.shift()!;
      setQueue([...queueLocal]);
      setNodes(nodes => nodes.map(n => ({ ...n, current: n.id === current, inQueue: queueLocal.includes(n.id) })));
      setCurrentStep(step++);
      yield;

      if (!visited.has(current)) {
        visited.add(current);
        order.push(current);
        setVisitOrder([...order]);
        setNodes(nodes => nodes.map(n => ({ ...n, visited: visited.has(n.id), current: false })));

        const neighbors = getNeighbors(current);
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor) && !queueLocal.includes(neighbor)) {
            highlightEdge(current, neighbor);
            setNodes(nodes => nodes.map(n => n.id === neighbor ? { ...n, current: true } : n));
            yield;
            queueLocal.push(neighbor);
            setNodes(nodes => nodes.map(n => ({ ...n, inQueue: queueLocal.includes(n.id), current: false })));
            setEdges(edges => edges.map(e => ({ ...e, highlighted: false, animated: false })));
          }
        }
      }
    }
    setCurrentStep(-1);
    toast.success(`BFS completed! Visit order: ${order.join(' → ')}`);
  }

  const handleStart = useCallback(() => {
    if (generator) handleReset();
    const start = parseInt(startNode);
    
    const algorithmName = algorithm === 'dfs' ? 'Depth-First Search' : 'Breadth-First Search';
    const dataStructure = algorithm === 'dfs' ? 'stack (LIFO)' : 'queue (FIFO)';
    const explanation = algorithm === 'dfs' 
      ? 'DFS explores as far as possible along each branch before backtracking, using a stack to remember where to go next.'
      : 'BFS explores all neighbors at the current depth before moving to nodes at the next depth level, using a queue to process nodes in order.';
    
    setCurrentStepText(`Starting ${algorithmName} from node ${start}`);
    speakOperation(algorithmName, `Starting ${algorithmName} from node ${start}. ${explanation} We'll use a ${dataStructure} to keep track of nodes to visit.`);
    
    const gen = algorithm === 'dfs' ? runDFS(start) : runBFS(start);
    setGenerator(gen);
    gen.next();
  }, [algorithm, startNode, generator, speakOperation]);

  const handleNext = useCallback(() => {
    if (generator) {
      const { done } = generator.next();
      if (done) setGenerator(null);
    }
  }, [generator]);

  const handleReset = useCallback(() => {
    setGenerator(null);
    setNodes(nodes => nodes.map(n => ({ ...n, visited: false, current: false, inQueue: false, inStack: false })));
    setVisitOrder([]);
    setQueue([]);
    setStack([]);
    setEdges(edges => edges.map(e => ({ ...e, highlighted: false, animated: false })));
    setCurrentStep(0);
    toast.info("Graph reset!");
  }, []);

  const memoizedEdges = useMemo(() => edges.map((edge, i) => {
    const fromNode = nodes.find(n => n.id === edge.from)!;
    const toNode = nodes.find(n => n.id === edge.to)!;
    
    // Calculate arrow head points
    const dx = toNode.x - fromNode.x;
    const dy = toNode.y - fromNode.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const unitDx = dx / length;
    const unitDy = dy / length;
    
    // Arrow head points
    const arrowSize = 8;
    const arrowHeadX = toNode.x - unitDx * 30; // Adjust for node radius
    const arrowHeadY = toNode.y - unitDy * 30;
    
    const arrowLeftX = arrowHeadX - arrowSize * unitDy;
    const arrowLeftY = arrowHeadY + arrowSize * unitDx;
    const arrowRightX = arrowHeadX + arrowSize * unitDy;
    const arrowRightY = arrowHeadY - arrowSize * unitDx;

    return (
      <g key={i}>
        <line
          x1={fromNode.x} y1={fromNode.y} x2={toNode.x} y2={toNode.y}
          stroke={edge.highlighted ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}
          strokeWidth={edge.highlighted ? 3 : 2}
          strokeDasharray={edge.animated ? "5,3" : "none"}
          className={`transition-all duration-500 ${edge.animated ? 'animate-pulse' : ''}`}
          markerEnd={edge.highlighted ? "url(#arrowhead-highlighted)" : "url(#arrowhead)"}
        />
        {/* Arrow head */}
        <polygon
          points={`${arrowHeadX},${arrowHeadY} ${arrowLeftX},${arrowLeftY} ${arrowRightX},${arrowRightY}`}
          fill={edge.highlighted ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}
        />
      </g>
    );
  }), [edges, nodes]);

  const isRunning = !!generator;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-card border rounded-xl shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Algorithm:</span>
          <Select value={algorithm} onValueChange={(v: 'dfs' | 'bfs') => setAlgorithm(v)}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="dfs">DFS</SelectItem>
              <SelectItem value="bfs">BFS</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Start Node:</span>
          <Select value={startNode} onValueChange={setStartNode}>
            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
            <SelectContent>
              {nodes.map(n => <SelectItem key={n.id} value={n.id.toString()}>{n.id}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleStart} disabled={isRunning} className="gap-2">
            <Play size={16} /> Start
          </Button>
          <Button onClick={handleNext} disabled={!isRunning} className="gap-2">
            <StepForward size={16} /> Next
          </Button>
          <Button onClick={handleReset} variant="outline" className="gap-2">
            <RotateCcw size={16} /> Reset
          </Button>
        </div>
      </div>

      {/* Graph */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-primary/10 shadow-sm">
        <div className="relative">
          <svg width="500" height="350" className="w-full mx-auto">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--muted-foreground))" />
              </marker>
              <marker id="arrowhead-highlighted" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--primary))" />
              </marker>
            </defs>
            
            {memoizedEdges}
            
            {nodes.map(node => {
              let fillColor = 'hsl(var(--background))';
              let strokeColor = 'hsl(var(--border))';
              let strokeWidth = 2;
              
              if (node.current) {
                fillColor = 'hsl(var(--primary))';
                strokeColor = 'hsl(var(--primary))';
                strokeWidth = 3;
              } else if (node.visited) {
                fillColor = 'hsl(var(--success))';
                strokeColor = 'hsl(var(--success))';
              } else if (node.inQueue) {
                fillColor = 'hsl(var(--info))';
                strokeColor = 'hsl(var(--info))';
              } else if (node.inStack) {
                fillColor = 'hsl(var(--warning))';
                strokeColor = 'hsl(var(--warning))';
              }

              const textColor = (node.current || node.visited || node.inQueue || node.inStack) ? '#fff' : 'hsl(var(--foreground))';

              return (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="30"
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    className="transition-all duration-500 shadow-md"
                  />
                  <text
                    x={node.x}
                    y={node.y + 5}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fontWeight="bold"
                    fontSize="16"
                    fill={textColor}
                    className="pointer-events-none transition-colors duration-500"
                  >
                    {node.id}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-card border rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Status Legend</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-primary"></div>
              <span className="text-sm">Current</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-success"></div>
              <span className="text-sm">Visited</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-info"></div>
              <span className="text-sm">In Queue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-warning"></div>
              <span className="text-sm">In Stack</span>
            </div>
          </div>
        </div>

        {/* Stack/Queue */}
        {algorithm === 'dfs' && (
          <div className="p-4 bg-card border rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Stack</h3>
            <div className="flex gap-2 flex-wrap">
              {stack.length > 0 ? stack.map((n, i) => (
                <Badge key={i} variant={i === stack.length - 1 ? "default" : "outline"} className="text-sm py-1">
                  {n}
                </Badge>
              )) : <span className="text-muted-foreground text-sm">Empty</span>}
            </div>
          </div>
        )}
        {algorithm === 'bfs' && (
          <div className="p-4 bg-card border rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Queue</h3>
            <div className="flex gap-2 flex-wrap">
              {queue.length > 0 ? queue.map((n, i) => (
                <Badge key={i} variant={i === 0 ? "default" : "outline"} className="text-sm py-1">
                  {n}
                </Badge>
              )) : <span className="text-muted-foreground text-sm">Empty</span>}
            </div>
          </div>
        )}
      </div>

      {/* Visit order */}
      {visitOrder.length > 0 && (
        <div className="p-4 bg-card border rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Visit Order</h3>
          <div className="flex items-center gap-2 flex-wrap">
            {visitOrder.map((n, i) => (
              <div key={n} className="flex items-center">
                <Badge variant="secondary" className="text-sm py-1">
                  {i + 1}. {n}
                </Badge>
                {i < visitOrder.length - 1 && (
                  <span className="mx-1 text-muted-foreground">→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pseudocode & Complexity */}
      <div className="grid md:grid-cols-2 gap-6">
        <PseudocodeBox
          title={`${algorithm.toUpperCase()} Algorithm`}
          code={algorithm === 'dfs' ? pseudocodeDFS : pseudocodeBFS}
          highlightedLine={currentStep}
        />
        <ComplexityBox
          timeComplexity="O(V + E)"
          spaceComplexity="O(V)"
          title={`${algorithm.toUpperCase()} Complexity`}
          description={`Where V is vertices and E is edges. ${algorithm === 'dfs' ? 'DFS uses a stack for traversal.' : 'BFS uses a queue for level-wise traversal.'}`}
        />
      </div>
    </div>
  );
}