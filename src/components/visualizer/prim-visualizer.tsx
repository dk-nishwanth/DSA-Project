import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';
import { toast } from 'sonner';

interface Edge { u: string; v: string; w: number; inMST?: boolean; considered?: boolean; }

const SAMPLE: Record<string, { nodes: string[]; edges: Edge[] }> = {
  small: {
    nodes: ['A','B','C','D','E'],
    edges: [
      { u:'A', v:'B', w:1 }, { u:'A', v:'C', w:5 }, { u:'B', v:'C', w:2 },
      { u:'B', v:'D', w:4 }, { u:'C', v:'D', w:3 }, { u:'C', v:'E', w:6 },
      { u:'D', v:'E', w:7 }
    ]
  }
};

export function PrimVisualizer() {
  const [graphKey, setGraphKey] = useState<'small'>('small');
  const [edges, setEdges] = useState<Edge[]>([...SAMPLE.small.edges]);
  const [inMST, setInMST] = useState<Set<string>>(new Set());
  const [mstEdges, setMstEdges] = useState<Edge[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [showMemory, setShowMemory] = useState(false);
  const [totalWeight, setTotalWeight] = useState(0);
  const [currentNode, setCurrentNode] = useState<string>('');
  
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
    setMstEdges([]);
    setTotalWeight(0);
    
    speakOperation("Prim's Algorithm", "Starting Prim's algorithm for Minimum Spanning Tree. We'll grow the tree by adding the minimum edge crossing the current cut.");
    
    const { nodes } = SAMPLE[graphKey];
    const picked = new Set<string>();
    const mst: Edge[] = [];

    // Start at first node
    const startNode = nodes[0];
    picked.add(startNode);
    setInMST(new Set(picked));
    setCurrentNode(startNode);
    setCurrentStep(`Starting from vertex ${startNode}`);
    speakStep("", `Starting Prim's algorithm from vertex ${startNode}. This vertex is now part of our growing MST.`, 1, nodes.length);
    await sleep(800);

    while (picked.size < nodes.length) {
      setCurrentStep("Finding minimum edge crossing the cut...");
      
      // Find minimum edge crossing the cut (picked -> not picked)
      let best: Edge | null = null;
      let consideredCount = 0;
      
      for (const e of edges) {
        const aIn = picked.has(e.u), bIn = picked.has(e.v);
        if (aIn !== bIn) {
          e.considered = true; 
          setEdges([...edges]); 
          consideredCount++;
          setCurrentStep(`Considering edge (${e.u}-${e.v}) with weight ${e.w}`);
          await sleep(300);
          if (!best || e.w < best.w) {
            best = e;
            setCurrentStep(`New minimum edge found: (${e.u}-${e.v}) with weight ${e.w}`);
          }
          e.considered = false; 
          setEdges([...edges]);
        }
      }
      
      if (!best) break; // disconnected
      
      best.inMST = true;
      mst.push(best);
      setMstEdges([...mst]);
      setTotalWeight(mst.reduce((s,edge) => s + edge.w, 0));
      setEdges([...edges]);
      
      const newVertex = picked.has(best.u) ? best.v : best.u;
      picked.add(newVertex);
      setInMST(new Set(picked));
      setCurrentNode(newVertex);
      setCurrentStep(`Added edge (${best.u}-${best.v}) and vertex ${newVertex} to MST`);
      speakStep("", `Added edge ${best.u} to ${best.v} with weight ${best.w}. Vertex ${newVertex} is now connected to our MST.`, picked.size, nodes.length);
      await sleep(600);
    }
    
    const finalWeight = mst.reduce((s,e)=>s+e.w,0);
    setTotalWeight(finalWeight);
    setCurrentStep(`Prim's algorithm completed! MST weight: ${finalWeight}`);
    speakResult(`Prim's algorithm completed! Found minimum spanning tree with total weight ${finalWeight}. All ${nodes.length} vertices are now connected.`);
    toast.success(`MST weight = ${finalWeight}`);
    
    setTimeout(() => {
      setIsRunning(false);
      setCurrentStep('');
      setCurrentNode('');
    }, 3000);
  }, [graphKey, edges, isRunning, speakOperation, speakStep, speakResult]);

  const reset = useCallback(() => {
    setEdges([...SAMPLE[graphKey].edges]); 
    setMstEdges([]); 
    setInMST(new Set()); 
    setTotalWeight(0);
    setCurrentStep('');
    setCurrentNode('');
    setIsRunning(false);
  }, [graphKey]);

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Prim's Algorithm Visualizer</h3>
        <p className="text-muted-foreground">
          Watch how Prim's algorithm grows the MST by adding minimum edges crossing the cut
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
        <Button onClick={run} disabled={isRunning}>Run Prim's Algorithm</Button>
        <Button onClick={reset} variant="outline" disabled={isRunning}>Reset</Button>
      </div>

      {/* Main Visualization */}
      <div className="p-6 bg-gradient-visualization rounded-xl border-2 border-primary/20">
        <div className="text-lg font-semibold mb-4 text-center">Vertex-Focused MST Growth</div>
        
        {/* Vertices in MST */}
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Vertices in MST:</div>
          <div className="flex gap-2 flex-wrap">
            {SAMPLE[graphKey].nodes.map((node) => (
              <div key={node} className={`px-3 py-2 border-2 rounded-lg text-sm font-mono transition-all duration-300 ${
                inMST.has(node) ? 'bg-blue-100 border-blue-500 text-blue-800 shadow-lg' : 
                'bg-gray-100 border-gray-300 text-gray-600'
              } ${currentNode === node ? 'animate-pulse ring-2 ring-blue-400' : ''}`}>
                {node}
              </div>
            ))}
          </div>
        </div>

        {/* Edges */}
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">All Edges:</div>
          <div className="flex gap-2 flex-wrap">
            {edges.map((e, i) => (
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
        {mstEdges.length > 0 && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2">
              Minimum Spanning Tree (Prim's)
            </div>
            <div className="text-sm text-green-700 dark:text-green-300">
              <div>Edges: <span className="font-mono">[{mstEdges.map(e=>`${e.u}-${e.v}`).join(', ')}]</span></div>
              <div>Total Weight: <span className="font-bold">{totalWeight}</span></div>
              <div>Vertices Connected: <span className="font-bold">{inMST.size}</span> out of {SAMPLE[graphKey].nodes.length}</div>
            </div>
          </div>
        )}
      </div>

      {/* Status */}
      <div className="flex flex-wrap gap-3 items-center">
        <Badge variant="outline">Nodes: {SAMPLE[graphKey].nodes.length}</Badge>
        <Badge variant="outline">Total Edges: {edges.length}</Badge>
        <Badge variant="outline">Vertices in MST: {inMST.size}</Badge>
        {totalWeight > 0 && (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            MST Weight: {totalWeight}
          </Badge>
        )}
        {isRunning && (
          <Badge variant="secondary" className="animate-pulse">
            Growing MST...
          </Badge>
        )}
      </div>

      {/* Algorithm Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-2">How Prim's Algorithm Works:</h4>
          <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
            <li>Start with any vertex (vertex-focused approach)</li>
            <li>Add the vertex to the MST set</li>
            <li>Repeat until all vertices are in MST:</li>
            <li className="ml-4">• Find minimum edge crossing the cut</li>
            <li className="ml-4">• Add the edge and new vertex to MST</li>
            <li className="ml-4">• Update the cut (MST vs non-MST vertices)</li>
            <li>Result: Minimum spanning tree connecting all vertices</li>
          </ol>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-2">Complexity Analysis:</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div><strong>Time Complexity:</strong> O(E log V)</div>
            <div className="ml-4">• With binary heap priority queue</div>
            <div className="ml-4">• Simple implementation: O(V²)</div>
            <div><strong>Space Complexity:</strong> O(V)</div>
            <div className="ml-4">• Priority queue and MST storage</div>
            <div><strong>Difference from Kruskal:</strong> Vertex-focused vs edge-focused</div>
            <div><strong>Applications:</strong> Network design, approximation algorithms</div>
          </div>
        </div>
      </div>

      {/* Memory Layout */}
      {showMemory && (
        <MemoryLayout
          title="Prim's Algorithm Memory Layout"
          data={mstEdges.map(e => e.w)}
          baseAddress={0x9000}
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
