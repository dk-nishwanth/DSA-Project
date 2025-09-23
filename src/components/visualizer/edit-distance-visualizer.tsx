import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Edit, RotateCcw, Play, Info, ArrowRight } from 'lucide-react';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

export function EditDistanceVisualizer() {
  const [a, setA] = useState('intention');
  const [b, setB] = useState('execution');
  const [dp, setDp] = useState<number[][]>([]);
  const [iCur, setICur] = useState(-1);
  const [jCur, setJCur] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState('');
  const [currentOperation, setCurrentOperation] = useState<'match' | 'replace' | 'insert' | 'delete' | null>(null);
  const [showMemory, setShowMemory] = useState(false);
  const [operations, setOperations] = useState<string[]>([]);
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

  const run = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setOperations([]);
    setDistance(null);
    
    const n = a.length, m = b.length;
    speakOperation("Edit Distance", `Computing edit distance between "${a}" and "${b}" using dynamic programming. We'll find the minimum operations needed to transform one string into another.`);
    
    // Initialize DP table
    const D = Array.from({length: n + 1}, () => Array(m + 1).fill(0));
    
    // Base cases
    for (let i = 0; i <= n; i++) D[i][0] = i;
    for (let j = 0; j <= m; j++) D[0][j] = j;
    
    setDp(D.map(row => row.slice()));
    setCurrentStep('Initialized base cases: empty string to any string requires insertions/deletions');
    await sleep(1000);
    
    // Fill DP table
    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= m; j++) {
        setICur(i);
        setJCur(j);
        
        const charA = a[i - 1];
        const charB = b[j - 1];
        const isMatch = charA === charB;
        
        setCurrentStep(`Comparing '${charA}' (position ${i-1} in "${a}") with '${charB}' (position ${j-1} in "${b}")`);
        speakStep("", `Comparing character '${charA}' with '${charB}' at position [${i}, ${j}]`, (i-1)*m + j, n*m);
        
        const deleteCost = D[i - 1][j] + 1;
        const insertCost = D[i][j - 1] + 1;
        const replaceCost = D[i - 1][j - 1] + (isMatch ? 0 : 1);
        
        const minCost = Math.min(deleteCost, insertCost, replaceCost);
        D[i][j] = minCost;
        
        // Determine which operation was chosen
        let operation: string;
        let operationType: 'match' | 'replace' | 'insert' | 'delete';
        
        if (minCost === replaceCost) {
          if (isMatch) {
            operation = `Match: '${charA}' = '${charB}' (cost: 0)`;
            operationType = 'match';
          } else {
            operation = `Replace: '${charA}' → '${charB}' (cost: 1)`;
            operationType = 'replace';
          }
        } else if (minCost === deleteCost) {
          operation = `Delete: '${charA}' from string A (cost: 1)`;
          operationType = 'delete';
        } else {
          operation = `Insert: '${charB}' into string A (cost: 1)`;
          operationType = 'insert';
        }
        
        setCurrentOperation(operationType);
        setCurrentStep(`${operation} → dp[${i}][${j}] = ${minCost}`);
        setDp(D.map(row => row.slice()));
        
        await sleep(400);
      }
    }
    
    const finalDistance = D[n][m];
    setDistance(finalDistance);
    setCurrentStep(`Edit distance computed: ${finalDistance} operations needed to transform "${a}" into "${b}"`);
    speakResult(`Edit distance calculation complete! Minimum ${finalDistance} operations needed to transform "${a}" into "${b}"`);
    
    setICur(-1);
    setJCur(-1);
    setCurrentOperation(null);
    setIsRunning(false);
  }, [a, b, isRunning, speakOperation, speakStep, speakResult]);

  const reset = useCallback(() => { 
    setDp([]); 
    setICur(-1); 
    setJCur(-1); 
    setDistance(null); 
    setIsRunning(false);
    setCurrentStep('');
    setCurrentOperation(null);
    setOperations([]);
  }, []);

  const getOperationColor = (operation: 'match' | 'replace' | 'insert' | 'delete' | null) => {
    switch (operation) {
      case 'match': return 'bg-green-100 border-green-300';
      case 'replace': return 'bg-yellow-100 border-yellow-300';
      case 'insert': return 'bg-blue-100 border-blue-300';
      case 'delete': return 'bg-red-100 border-red-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          <Edit className="h-6 w-6" />
          Edit Distance Visualizer
        </h2>
        <p className="text-muted-foreground">
          Dynamic Programming solution to find minimum operations to transform one string into another
        </p>
      </div>

      {/* Controls */}
      <div className="flex gap-3 flex-wrap p-4 bg-muted/30 rounded-xl border">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">String A:</span>
          <Input 
            className="w-56" 
            value={a} 
            onChange={e => setA(e.target.value)}
            disabled={isRunning}
            placeholder="intention"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">String B:</span>
          <Input 
            className="w-56" 
            value={b} 
            onChange={e => setB(e.target.value)}
            disabled={isRunning}
            placeholder="execution"
          />
        </div>
        <Button onClick={run} disabled={isRunning}>
          <Play className="h-4 w-4 mr-1" />
          {isRunning ? 'Computing...' : 'Run Algorithm'}
        </Button>
        <Button onClick={reset} variant="outline" disabled={isRunning}>
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset
        </Button>
      </div>

      {/* String Comparison Display */}
      <div className="p-4 bg-muted/20 rounded-lg">
        <h4 className="font-semibold mb-3">String Transformation</h4>
        <div className="flex items-center gap-4 justify-center">
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">String A</div>
            <div className="font-mono text-lg bg-card p-2 rounded border">
              {a.split('').map((char, i) => (
                <span 
                  key={i}
                  className={`px-1 ${iCur > 0 && i === iCur - 1 ? 'bg-primary text-primary-foreground rounded' : ''}`}
                >
                  {char}
                </span>
              ))}
            </div>
          </div>
          <ArrowRight className="h-6 w-6 text-muted-foreground" />
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">String B</div>
            <div className="font-mono text-lg bg-card p-2 rounded border">
              {b.split('').map((char, i) => (
                <span 
                  key={i}
                  className={`px-1 ${jCur > 0 && i === jCur - 1 ? 'bg-primary text-primary-foreground rounded' : ''}`}
                >
                  {char}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Current Step Display */}
      {currentStep && (
        <div className="p-4 bg-muted rounded-lg border">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-primary mt-0.5" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                {currentOperation && (
                  <Badge variant="outline" className={getOperationColor(currentOperation)}>
                    {currentOperation.charAt(0).toUpperCase() + currentOperation.slice(1)}
                  </Badge>
                )}
                {iCur >= 0 && jCur >= 0 && (
                  <Badge variant="secondary">Position: [{iCur}, {jCur}]</Badge>
                )}
              </div>
              <p className="text-sm">{currentStep}</p>
            </div>
          </div>
        </div>
      )}

      {/* DP Table Visualization */}
      <div className="p-6 bg-gradient-visualization rounded-xl border-2 border-primary/20 overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4 text-center">Dynamic Programming Table</h3>
        {dp.length > 0 && (
          <div className="flex justify-center">
            <table className="border-collapse">
              <thead>
                <tr>
                  <th className="border-2 border-gray-300 w-10 h-8 text-xs bg-gray-100"></th>
                  <th className="border-2 border-gray-300 w-10 h-8 text-xs bg-gray-100">ε</th>
                  {b.split('').map((char, j) => (
                    <th key={j} className="border-2 border-gray-300 w-10 h-8 text-xs bg-gray-100 font-mono">
                      {char}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dp.map((row, i) => (
                  <tr key={i}>
                    <th className="border-2 border-gray-300 w-10 h-8 text-xs bg-gray-100 font-mono">
                      {i === 0 ? 'ε' : a[i - 1]}
                    </th>
                    {row.map((val, j) => (
                      <td 
                        key={j} 
                        className={`
                          border-2 text-center w-10 h-8 text-xs font-mono font-bold transition-all duration-300
                          ${i === iCur && j === jCur 
                            ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-110' 
                            : 'bg-card border-gray-300 hover:bg-muted'
                          }
                        `}
                      >
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Result Display */}
      {distance !== null && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-center">
            <h4 className="font-semibold text-green-800 mb-2">Final Result</h4>
            <div className="text-2xl font-bold text-green-600">
              Edit Distance: {distance}
            </div>
            <p className="text-sm text-green-700 mt-2">
              Minimum {distance} operations needed to transform "{a}" into "{b}"
            </p>
          </div>
        </div>
      )}

      {/* Operation Legend */}
      <div className="p-4 bg-muted/20 rounded-lg">
        <h4 className="font-semibold mb-3">Operations Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-200 border border-green-300 rounded"></div>
            <span className="text-sm">Match (cost: 0)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-200 border border-yellow-300 rounded"></div>
            <span className="text-sm">Replace (cost: 1)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-200 border border-blue-300 rounded"></div>
            <span className="text-sm">Insert (cost: 1)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-200 border border-red-300 rounded"></div>
            <span className="text-sm">Delete (cost: 1)</span>
          </div>
        </div>
      </div>

      {/* Algorithm Information */}
      <div className="bg-muted/20 rounded-lg p-4">
        <h4 className="font-semibold mb-2">Edit Distance (Levenshtein Distance)</h4>
        <div className="text-sm text-muted-foreground space-y-2">
          <div><strong>Problem:</strong> Find minimum operations (insert, delete, replace) to transform string A into string B</div>
          <div><strong>Recurrence:</strong> dp[i][j] = min(delete, insert, replace/match) cost</div>
          <div><strong>Base Cases:</strong> dp[i][0] = i (delete all), dp[0][j] = j (insert all)</div>
          <div><strong>Time Complexity:</strong> O(n × m) where n, m are string lengths</div>
          <div><strong>Space Complexity:</strong> O(n × m) for the DP table</div>
          <div><strong>Applications:</strong> Spell checkers, DNA sequence alignment, version control systems</div>
        </div>
      </div>

      {/* Memory Layout */}
      {showMemory && dp.length > 0 && (
        <MemoryLayout
          title="DP Table Memory Layout"
          data={dp.flat().slice(0, 20)} // Show first 20 elements to avoid overflow
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
