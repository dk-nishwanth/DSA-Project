import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

interface Edge { from: string; to: string; }

const SAMPLE_DAGS: Record<string, { nodes: string[]; edges: Edge[] }> = {
  simple: {
    nodes: ['A','B','C','D','E','F'],
    edges: [
      { from: 'A', to: 'C' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'D' },
      { from: 'B', to: 'E' },
      { from: 'E', to: 'F' },
    ]
  },
  diamond: {
    nodes: ['S','A','B','T'],
    edges: [
      { from: 'S', to: 'A' },
      { from: 'S', to: 'B' },
      { from: 'A', to: 'T' },
      { from: 'B', to: 'T' },
    ]
  }
};

export function TopologicalSortVisualizer() {
  const [graphKey, setGraphKey] = useState<'simple'|'diamond'>('simple');
  const [order, setOrder] = useState<string[]>([]);
  const [inDegree, setInDegree] = useState<Record<string, number>>({});
  const [queueState, setQueueState] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [showMemory, setShowMemory] = useState(false);
  const [processedNodes, setProcessedNodes] = useState<string[]>([]);
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
  } = useVisualizerVoice({ minInterval: 2000 });

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const runKahn = useCallback( async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setOrder([]);
    setProcessedNodes([]);

    const { nodes, edges } = SAMPLE_DAGS[graphKey];
    
    speakOperation("Topological Sort", "Starting Kahn's algorithm for topological sorting. We'll process nodes with zero in-degree first.");
    setCurrentStep("Initializing Kahn's algorithm - calculating in-degrees for all nodes");
    
    const indeg: Record<string, number> = Object.fromEntries(nodes.map(n => [n, 0]));
    for (const e of edges) indeg[e.to]++;
    setInDegree({ ...indeg });
    await sleep(800);

    setCurrentStep("Finding nodes with zero in-degree to start processing");
    const q: string[] = [];
    for (const n of nodes) if (indeg[n] === 0) q.push(n);
    setQueueState([...q]);
    
    speakStep("", `Found ${q.length} nodes with zero in-degree: ${q.join(', ')}. These can be processed first.`, 1, nodes.length);
    await sleep(800);

    const result: string[] = [];
    let stepCount = 0;
    
    while (q.length) {
      const u = q.shift()!;
      setQueueState([...q]);
      result.push(u);
      setOrder([...result]);
      setProcessedNodes([...result]);
      stepCount++;
      
      setCurrentStep(`Processing node ${u} - removing it from the graph and updating dependencies`);
      speakStep("", `Processing node ${u}. Removing its outgoing edges and updating in-degrees.`, stepCount, nodes.length);
      await sleep(600);
      
      for (const e of edges.filter(e => e.from === u)) {
        indeg[e.to]--;
        setInDegree({ ...indeg });
        setCurrentStep(`Reduced in-degree of node ${e.to} to ${indeg[e.to]}`);
        await sleep(300);
        
        if (indeg[e.to] === 0) {
          q.push(e.to);
          setQueueState([...q]);
          setCurrentStep(`Node ${e.to} now has zero in-degree - adding to queue`);
          await sleep(200);
        }
      }
    }

    if (result.length !== nodes.length) {
      const errorMsg = 'Graph has a cycle - topological sort not possible!';
      setCurrentStep(errorMsg);
      speakResult(errorMsg);
      toast.error('Graph has a cycle (not a DAG)');
    } else {
      const successMsg = `Topological sort complete! Order: ${result.join(' → ')}`;
      setCurrentStep(successMsg);
      speakResult(successMsg);
      toast.success(`Topological order: ${result.join(' → ')}`);
    }
    setIsAnimating(false);
  }, [graphKey, isAnimating, speakOperation, speakStep, speakResult]);

  const reset = useCallback(() => {
    setOrder([]); setInDegree({}); setQueueState([]); setIsAnimating(false);
  }, []);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Topological Sort Visualizer</h2>
        <p className="text-muted-foreground">
          Kahn's algorithm for ordering vertices in a Directed Acyclic Graph (DAG)
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <Select value={graphKey} onValueChange={(v: 'simple'|'diamond') => setGraphKey(v)}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="simple">Simple DAG (6 nodes)</SelectItem>
            <SelectItem value="diamond">Diamond DAG (4 nodes)</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={runKahn} disabled={isAnimating}>
          {isAnimating ? 'Running...' : "Run Kahn's Algorithm"}
        </Button>
        <Button onClick={reset} variant="outline" disabled={isAnimating}>Reset</Button>
      </div>

      {/* Current Step Display */}
      {currentStep && (
        <div className="text-center p-4 bg-muted rounded-lg">
          <Badge className="mb-2" variant={isAnimating ? 'default' : 'secondary'}>
            Algorithm Status
          </Badge>
          <p className="text-sm">{currentStep}</p>
        </div>
      )}

      {/* Visualization */}
      <div className="p-6 bg-gradient-visualization rounded-xl border-2 border-primary/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* In-Degrees */}
          <div>
            <h3 className="text-lg font-semibold mb-3">In-Degrees</h3>
            <div className="space-y-2">
              {Object.entries(inDegree).map(([node, deg]) => (
                <div key={node} className={`flex justify-between items-center p-2 rounded border ${
                  processedNodes.includes(node) ? 'bg-green-100 border-green-300' : 'bg-white border-gray-300'
                }`}>
                  <span className="font-medium">{node}</span>
                  <Badge variant={deg === 0 ? 'default' : 'secondary'}>{deg}</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Queue State */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Processing Queue</h3>
            <div className="min-h-[100px] p-3 bg-blue-50 border border-blue-200 rounded">
              {queueState.length > 0 ? (
                <div className="space-y-2">
                  {queueState.map((node, i) => (
                    <div key={i} className="px-3 py-2 bg-blue-500 text-white rounded text-center font-medium">
                      {node}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-blue-600 py-8">
                  <div className="text-sm">Queue Empty</div>
                </div>
              )}
            </div>
          </div>

          {/* Topological Order */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Topological Order</h3>
            <div className="min-h-[100px] p-3 bg-green-50 border border-green-200 rounded">
              {order.length > 0 ? (
                <div className="space-y-2">
                  {order.map((node, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded">
                      <Badge variant="outline" className="bg-white text-green-600 border-green-600">
                        {i + 1}
                      </Badge>
                      <span className="font-medium">{node}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-green-600 py-8">
                  <div className="text-sm">No nodes processed yet</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Graph Structure Display */}
      <div className="p-4 bg-muted/20 rounded-lg">
        <h4 className="font-semibold mb-3">Current Graph Structure</h4>
        <div className="text-sm space-y-1">
          <div><strong>Nodes:</strong> {SAMPLE_DAGS[graphKey].nodes.join(', ')}</div>
          <div><strong>Edges:</strong> {SAMPLE_DAGS[graphKey].edges.map(e => `${e.from}→${e.to}`).join(', ')}</div>
        </div>
      </div>

      {/* Algorithm Information */}
      <div className="bg-muted/20 rounded-lg p-4">
        <h4 className="font-semibold mb-2">Kahn's Algorithm</h4>
        <div className="text-sm text-muted-foreground space-y-1">
          <div>• <strong>Purpose:</strong> Find a linear ordering of vertices in a DAG</div>
          <div>• <strong>Method:</strong> Repeatedly remove vertices with zero in-degree</div>
          <div>• <strong>Time Complexity:</strong> O(V + E) where V = vertices, E = edges</div>
          <div>• <strong>Space Complexity:</strong> O(V) for storing in-degrees and queue</div>
          <div>• <strong>Applications:</strong> Task scheduling, course prerequisites, build systems</div>
        </div>
      </div>

      {/* Memory Layout */}
      {showMemory && (
        <MemoryLayout
          title="Topological Sort Memory Layout"
          data={order}
          baseAddress={0x7000}
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
