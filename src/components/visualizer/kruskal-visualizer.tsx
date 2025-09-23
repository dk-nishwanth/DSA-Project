import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';
import { toast } from 'sonner';

interface Edge { u: string; v: string; w: number; inMST?: boolean; considered?: boolean; }

function createUF(nodes: string[]) {
  const parent = new Map<string, string>();
  const rank = new Map<string, number>();
  nodes.forEach(n => { parent.set(n, n); rank.set(n, 0); });
  const find = (x: string): string => {
    if (parent.get(x) !== x) parent.set(x, find(parent.get(x)!));
    return parent.get(x)!;
  };
  const unite = (a: string, b: string): boolean => {
    a = find(a); b = find(b);
    if (a === b) return false;
    const ra = rank.get(a)!; const rb = rank.get(b)!;
    if (ra < rb) parent.set(a, b);
    else if (ra > rb) parent.set(b, a);
    else { parent.set(b, a); rank.set(a, ra + 1); }
    return true;
  };
  return { find, unite };
}

const SAMPLE: Record<string, { nodes: string[]; edges: Edge[] }> = {
  small: {
    nodes: ['A','B','C','D','E'],
    edges: [
      { u:'A', v:'B', w:1 }, { u:'A', v:'C', w:5 }, { u:'B', v:'C', w:2 },
      { u:'B', v:'D', w:4 }, { u:'C', v:'D', w:3 }, { u:'C', v:'E', w:6 },
    ]
  }
};

export function KruskalVisualizer() {
  const [graphKey, setGraphKey] = useState<'small'>('small');
  const [edges, setEdges] = useState<Edge[]>([...SAMPLE.small.edges]);
  const [order, setOrder] = useState<Edge[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [showMemory, setShowMemory] = useState(false);
  const [totalWeight, setTotalWeight] = useState(0);
  
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

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const run = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setOrder([]);
    setTotalWeight(0);
    
    speakOperation("Kruskal's Algorithm", "Starting Kruskal's algorithm for Minimum Spanning Tree. We'll sort edges by weight and use Union-Find to detect cycles.");
    setCurrentStep("Sorting edges by weight...");
    
    const { nodes } = SAMPLE[graphKey];
    const uf = createUF(nodes);
    const es = [...edges].sort((a,b) => a.w - b.w).map(e => ({...e, inMST:false, considered:false}));
    setEdges(es);
    const mst: Edge[] = [];
    
    await sleep(800);
    setCurrentStep("Processing edges in order of increasing weight...");
    
    for (let i = 0; i < es.length; i++) {
      const e = es[i];
      e.considered = true; 
      setEdges([...es]); 
      setCurrentStep(`Considering edge (${e.u}-${e.v}) with weight ${e.w}`);
      speakStep("", `Considering edge from ${e.u} to ${e.v} with weight ${e.w}. Checking if it creates a cycle using Union-Find.`, i + 1, es.length);
      await sleep(600);
      
      if (uf.unite(e.u, e.v)) {
        e.inMST = true; 
        mst.push(e); 
        setOrder([...mst]);
        setTotalWeight(mst.reduce((s,edge) => s + edge.w, 0));
        setCurrentStep(`Added edge (${e.u}-${e.v}) to MST - no cycle created`);
        speakStep("", `Edge ${e.u} to ${e.v} added to MST. Components ${e.u} and ${e.v} are now connected.`, mst.length, nodes.length - 1);
        setEdges([...es]); 
        await sleep(600);
        if (mst.length === nodes.length - 1) {
          setCurrentStep("MST complete - all vertices connected!");
          break;
        }
      } else {
        setCurrentStep(`Rejected edge (${e.u}-${e.v}) - would create a cycle`);
        speakStep("", `Edge ${e.u} to ${e.v} rejected because it would create a cycle. Vertices are already connected.`, i + 1, es.length);
        await sleep(400);
      }
      e.considered = false; 
      setEdges([...es]);
    }
    
    const finalWeight = mst.reduce((s,e)=>s+e.w,0);
    setTotalWeight(finalWeight);
    setCurrentStep(`Kruskal's algorithm completed! MST weight: ${finalWeight}`);
    speakResult(`Kruskal's algorithm completed! Found minimum spanning tree with total weight ${finalWeight} using ${mst.length} edges.`);
    toast.success(`MST weight = ${finalWeight}`);
    
    setTimeout(() => {
      setIsRunning(false);
      setCurrentStep('');
    }, 3000);
  }, [graphKey, edges, isRunning, speakOperation, speakStep, speakResult]);

  const reset = useCallback(() => {
    setEdges([...SAMPLE[graphKey].edges]); 
    setOrder([]); 
    setTotalWeight(0);
    setCurrentStep('');
    setIsRunning(false);
  }, [graphKey]);

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Kruskal's Algorithm Visualizer</h3>
        <p className="text-muted-foreground">
          Watch how Kruskal's algorithm finds the Minimum Spanning Tree using Union-Find
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <Select value={graphKey} onValueChange={(v:'small')=>setGraphKey(v)}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small Graph</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={run} disabled={isRunning}>Run Kruskal's Algorithm</Button>
        <Button onClick={reset} variant="outline" disabled={isRunning}>Reset</Button>
      </div>

      {/* Main Visualization */}
      <div className="p-6 bg-gradient-visualization rounded-xl border-2 border-primary/20">
        <div className="text-lg font-semibold mb-4 text-center">Edge Processing</div>
        <div className="flex gap-2 flex-wrap justify-center">
          {edges.sort((a,b)=>a.w-b.w).map((e, i) => (
            <div key={i} className={`px-3 py-2 border-2 rounded-lg text-sm font-mono transition-all duration-300 ${
              e.inMST ? 'bg-green-100 border-green-500 text-green-800 shadow-lg' : 
              e.considered ? 'bg-yellow-100 border-yellow-500 text-yellow-800 animate-pulse' : 
              'bg-card border-border hover:border-primary/50'
            }`}>
              <div className="font-bold">({e.u}—{e.v})</div>
              <div className="text-xs opacity-70">Weight: {e.w}</div>
            </div>
          ))}
        </div>

        {/* Current Step Display */}
        {currentStep && (
          <div className="mt-4 p-3 bg-muted/20 rounded-lg border">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{currentStep}</span>
            </div>
          </div>
        )}

        {/* MST Results */}
        {order.length > 0 && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2">
              Minimum Spanning Tree
            </div>
            <div className="text-sm text-green-700 dark:text-green-300">
              <div>Edges: <span className="font-mono">[{order.map(e=>`${e.u}-${e.v}`).join(', ')}]</span></div>
              <div>Total Weight: <span className="font-bold">{totalWeight}</span></div>
              <div>Edges Used: <span className="font-bold">{order.length}</span> out of {SAMPLE[graphKey].nodes.length - 1} needed</div>
            </div>
          </div>
        )}
      </div>

      {/* Status */}
      <div className="flex flex-wrap gap-3 items-center">
        <Badge variant="outline">Nodes: {SAMPLE[graphKey].nodes.length}</Badge>
        <Badge variant="outline">Total Edges: {edges.length}</Badge>
        {totalWeight > 0 && (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            MST Weight: {totalWeight}
          </Badge>
        )}
        {isRunning && (
          <Badge variant="secondary" className="animate-pulse">
            Processing...
          </Badge>
        )}
      </div>

      {/* Algorithm Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-2">How Kruskal's Algorithm Works:</h4>
          <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
            <li>Sort all edges by weight in ascending order</li>
            <li>Initialize Union-Find data structure for cycle detection</li>
            <li>For each edge in sorted order:</li>
            <li className="ml-4">• Check if adding it creates a cycle</li>
            <li className="ml-4">• If no cycle, add to MST and union components</li>
            <li className="ml-4">• If cycle, reject the edge</li>
            <li>Stop when MST has V-1 edges (V = number of vertices)</li>
          </ol>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-2">Complexity Analysis:</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div><strong>Time Complexity:</strong> O(E log E)</div>
            <div className="ml-4">• Sorting edges: O(E log E)</div>
            <div className="ml-4">• Union-Find operations: O(E α(V))</div>
            <div><strong>Space Complexity:</strong> O(V)</div>
            <div className="ml-4">• Union-Find data structure</div>
            <div><strong>Applications:</strong> Network design, clustering, circuit design</div>
          </div>
        </div>
      </div>

      {/* Memory Layout */}
      {showMemory && (
        <MemoryLayout
          title="Kruskal's Algorithm Memory Layout"
          data={edges.map(e => e.w)}
          baseAddress={0x8000}
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
