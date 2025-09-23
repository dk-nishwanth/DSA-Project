import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

const INF = 1e9;

export function FloydWarshallVisualizer() {
  const [n, setN] = useState(4);
  const [matrix, setMatrix] = useState<number[][]>([
    [0, 3, INF, 7],
    [8, 0, 2, INF],
    [5, INF, 0, 1],
    [2, INF, INF, 0],
  ]);
  const [kStep, setKStep] = useState(-1);
  const [iStep, setIStep] = useState(-1);
  const [jStep, setJStep] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [showMemory, setShowMemory] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
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

  const reset = useCallback(() => {
    setKStep(-1); setIStep(-1); setJStep(-1); setIsRunning(false);
  }, []);

  const run = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    const dist = matrix.map(row => row.slice());
    
    speakOperation("Floyd-Warshall Algorithm", "Starting Floyd-Warshall algorithm to find all-pairs shortest paths. We'll use dynamic programming with intermediate vertices.");
    setCurrentStep("Initializing Floyd-Warshall algorithm...");
    await sleep(800);
    
    for (let k = 0; k < n; k++) {
      setKStep(k);
      const stepText = `Using vertex ${k} as intermediate vertex. Checking all pairs of vertices to see if path through ${k} is shorter.`;
      setCurrentStep(stepText);
      speakStep("", stepText, k + 1, n);
      await sleep(600);
      
      for (let i = 0; i < n; i++) {
        setIStep(i);
        for (let j = 0; j < n; j++) {
          setJStep(j);
          const currentDist = dist[i][j] >= INF/2 ? "∞" : dist[i][j];
          const viakDist = (dist[i][k] >= INF/2 || dist[k][j] >= INF/2) ? "∞" : dist[i][k] + dist[k][j];
          
          setCurrentStep(`Checking path from ${i} to ${j}: current = ${currentDist}, via ${k} = ${viakDist}`);
          
          if (dist[i][k] + dist[k][j] < dist[i][j]) {
            const newDist = dist[i][k] + dist[k][j];
            dist[i][j] = newDist;
            setMatrix(dist.map(row => row.slice()));
            setCurrentStep(`Updated! Shorter path found from ${i} to ${j} via ${k}: distance = ${newDist}`);
            await sleep(400);
          }
          await sleep(200);
        }
      }
      await sleep(300);
    }
    
    setKStep(-1); setIStep(-1); setJStep(-1);
    setIsRunning(false);
    const resultText = 'Floyd-Warshall algorithm completed! All-pairs shortest paths have been computed.';
    setCurrentStep(resultText);
    speakResult(resultText);
    toast.success('All-pairs shortest paths computed');
  }, [isRunning, matrix, n, speakOperation, speakStep, speakResult]);

  const setCell = (i: number, j: number, val: string) => {
    const num = val.trim().toUpperCase() === 'INF' ? INF : (parseInt(val) || 0);
    const m = matrix.map(row => row.slice());
    m[i][j] = num;
    setMatrix(m);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Floyd-Warshall Algorithm Visualizer</h2>
        <p className="text-muted-foreground">
          Find all-pairs shortest paths using dynamic programming
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <Button onClick={run} disabled={isRunning}>
          {isRunning ? 'Running...' : 'Run Algorithm'}
        </Button>
        <Button onClick={reset} variant="outline" disabled={isRunning}>Reset</Button>
      </div>

      {/* Current Step Display */}
      {currentStep && (
        <div className="text-center p-4 bg-muted rounded-lg">
          <Badge className="mb-2" variant={isRunning ? 'default' : 'secondary'}>
            {kStep >= 0 ? `Intermediate Vertex: ${kStep}` : 'Algorithm Status'}
          </Badge>
          <p className="text-sm">{currentStep}</p>
        </div>
      )}

      {/* Distance Matrix */}
      <div className="p-6 bg-gradient-visualization rounded-xl border-2 border-primary/20">
        <h3 className="text-lg font-semibold mb-4 text-center">Distance Matrix</h3>
        <div className="overflow-x-auto">
          <table className="border-collapse mx-auto">
            <thead>
              <tr>
                <th className="border p-2 bg-muted/50 font-semibold"></th>
                {Array.from({length: n}, (_, j) => (
                  <th key={j} className={`border p-2 bg-muted/50 font-semibold ${j === kStep ? 'bg-blue-200' : ''}`}>
                    {j}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, i) => (
                <tr key={i}>
                  <th className={`border p-2 bg-muted/50 font-semibold ${i === kStep ? 'bg-blue-200' : ''}`}>
                    {i}
                  </th>
                  {row.map((val, j) => (
                    <td key={j} className={`border p-2 text-center font-mono text-sm transition-colors ${
                      i === iStep && j === jStep ? 'bg-yellow-200 border-yellow-400' : 
                      (j === kStep || i === kStep) ? 'bg-blue-100 border-blue-300' : 
                      'bg-white'
                    }`}>
                      <Input
                        className="w-20 text-center border-0 bg-transparent"
                        value={val >= INF/2 ? 'INF' : String(val)}
                        onChange={e => setCell(i, j, e.target.value)}
                        disabled={isRunning}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-4 bg-yellow-200 border border-yellow-400 rounded"></div>
            <span className="font-semibold text-yellow-800">Current Cell</span>
          </div>
          <p className="text-sm text-yellow-700">Currently being evaluated (i,j)</p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-4 bg-blue-200 border border-blue-300 rounded"></div>
            <span className="font-semibold text-blue-800">Intermediate Vertex</span>
          </div>
          <p className="text-sm text-blue-700">Current k vertex being used</p>
        </div>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
            <span className="font-semibold text-gray-800">Distance</span>
          </div>
          <p className="text-sm text-gray-700">Shortest distance found so far</p>
        </div>
      </div>

      {/* Algorithm Info */}
      <div className="bg-muted/20 rounded-lg p-4">
        <h4 className="font-semibold mb-2">Algorithm Information</h4>
        <div className="text-sm text-muted-foreground space-y-1">
          <div>• <strong>Formula:</strong> dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])</div>
          <div>• <strong>Time Complexity:</strong> O(n³) - three nested loops</div>
          <div>• <strong>Space Complexity:</strong> O(n²) - distance matrix storage</div>
          <div>• <strong>Use Case:</strong> Finding shortest paths between all pairs of vertices</div>
        </div>
      </div>

      {/* Memory Layout */}
      {showMemory && (
        <MemoryLayout
          title="Floyd-Warshall Memory Layout"
          data={matrix.flat()}
          baseAddress={0x6000}
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
