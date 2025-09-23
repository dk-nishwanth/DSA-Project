import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

export function LCSVisualizer() {
  const [a, setA] = useState('ABCBDAB');
  const [b, setB] = useState('BDCABA');
  const [dp, setDp] = useState<number[][]>([]);
  const [iCur, setICur] = useState(-1);
  const [jCur, setJCur] = useState(-1);
  const [lcs, setLcs] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [showMemory, setShowMemory] = useState(false);
  const [lcsLength, setLcsLength] = useState(0);
  
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
  } = useVisualizerVoice({ minInterval: 1500 });

  const sleep = (ms:number)=>new Promise(r=>setTimeout(r,ms));

  const run = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setLcs('');
    setLcsLength(0);
    
    speakOperation("Longest Common Subsequence", `Computing LCS between strings "${a}" and "${b}" using dynamic programming. We'll build a table to find the optimal solution.`);
    setCurrentStep("Initializing DP table...");
    
    const n = a.length, m = b.length;
    const D = Array.from({length:n+1},()=>Array(m+1).fill(0));
    setDp(D.map(row=>row.slice()));
    await sleep(800);
    
    setCurrentStep("Filling DP table using recurrence relation...");
    let totalCells = n * m;
    let currentCell = 0;
    
    for (let i=1;i<=n;i++){
      for(let j=1;j<=m;j++){
        currentCell++;
        setICur(i); setJCur(j);
        
        const charA = a[i-1];
        const charB = b[j-1];
        
        if (charA === charB) {
          D[i][j] = D[i-1][j-1] + 1;
          setCurrentStep(`Characters match: ${charA} = ${charB}. Taking diagonal + 1 = ${D[i][j]}`);
          speakStep("", `Characters ${charA} and ${charB} match. Taking diagonal value plus 1, giving us ${D[i][j]}.`, currentCell, totalCells);
        } else {
          D[i][j] = Math.max(D[i-1][j], D[i][j-1]);
          setCurrentStep(`Characters differ: ${charA} ≠ ${charB}. Taking max(${D[i-1][j]}, ${D[i][j-1]}) = ${D[i][j]}`);
          speakStep("", `Characters ${charA} and ${charB} don't match. Taking maximum of top and left values: ${D[i][j]}.`, currentCell, totalCells);
        }
        
        setDp(D.map(row=>row.slice()));
        await sleep(300);
      }
    }
    
    setLcsLength(D[n][m]);
    setCurrentStep("Reconstructing LCS by backtracking through the table...");
    speakStep("", `DP table complete! LCS length is ${D[n][m]}. Now reconstructing the actual sequence.`, totalCells, totalCells);
    
    // reconstruct
    let i=n, j=m; 
    const out:string[]=[];
    const reconstructionSteps: {i: number, j: number, action: string}[] = [];
    
    while(i>0&&j>0){
      setICur(i); setJCur(j);
      
      if (a[i-1]===b[j-1]){ 
        out.push(a[i-1]); 
        reconstructionSteps.push({i, j, action: `Found ${a[i-1]} in LCS`});
        setCurrentStep(`Found character '${a[i-1]}' in LCS. Moving diagonally.`);
        i--; j--; 
      } else if (D[i-1][j]>=D[i][j-1]) {
        reconstructionSteps.push({i, j, action: `Moving up from (${i},${j})`});
        setCurrentStep(`Moving up: D[${i-1}][${j}] = ${D[i-1][j]} >= D[${i}][${j-1}] = ${D[i][j-1]}`);
        i--;
      } else {
        reconstructionSteps.push({i, j, action: `Moving left from (${i},${j})`});
        setCurrentStep(`Moving left: D[${i}][${j-1}] = ${D[i][j-1]} > D[${i-1}][${j}] = ${D[i-1][j]}`);
        j--;
      }
      
      setDp(D.map(row=>row.slice()));
      await sleep(400);
    }
    
    const finalLcs = out.reverse().join('');
    setLcs(finalLcs);
    setCurrentStep(`LCS reconstruction complete!`);
    speakResult(`LCS algorithm completed! The longest common subsequence between "${a}" and "${b}" is "${finalLcs}" with length ${finalLcs.length}.`);
    
    setTimeout(() => {
      setIsRunning(false);
      setCurrentStep('');
      setICur(-1);
      setJCur(-1);
    }, 3000);
  }, [a, b, isRunning, speakOperation, speakStep, speakResult]);

  const reset = useCallback(()=>{ 
    setDp([]); 
    setICur(-1); 
    setJCur(-1); 
    setLcs(''); 
    setLcsLength(0);
    setCurrentStep('');
    setIsRunning(false); 
  },[]);

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Longest Common Subsequence Visualizer</h3>
        <p className="text-muted-foreground">
          Watch how dynamic programming finds the LCS by building an optimal solution table
        </p>
      </div>

      {/* Controls */}
      <div className="flex gap-3 flex-wrap p-4 bg-muted/30 rounded-xl border">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">String A:</span>
          <Input 
            className="w-56" 
            value={a} 
            onChange={e=>setA(e.target.value.toUpperCase())} 
            placeholder="Enter first string"
            disabled={isRunning}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">String B:</span>
          <Input 
            className="w-56" 
            value={b} 
            onChange={e=>setB(e.target.value.toUpperCase())} 
            placeholder="Enter second string"
            disabled={isRunning}
          />
        </div>
        <Button onClick={run} disabled={isRunning}>Run LCS Algorithm</Button>
        <Button onClick={reset} variant="outline" disabled={isRunning}>Reset</Button>
      </div>

      {/* String Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">String A</div>
          <div className="font-mono text-lg">{a}</div>
          <div className="text-xs text-blue-600 dark:text-blue-400">Length: {a.length}</div>
        </div>
        <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2">String B</div>
          <div className="font-mono text-lg">{b}</div>
          <div className="text-xs text-green-600 dark:text-green-400">Length: {b.length}</div>
        </div>
      </div>

      {/* DP Table Visualization */}
      <div className="p-6 bg-gradient-visualization rounded-xl border-2 border-primary/20">
        <div className="text-lg font-semibold mb-4 text-center">Dynamic Programming Table</div>
        
        {dp.length > 0 && (
          <div className="overflow-x-auto">
            <table className="border-collapse mx-auto">
              <thead>
                <tr>
                  <th className="border-2 border-border w-10 h-10 text-xs bg-muted/50"></th>
                  <th className="border-2 border-border w-10 h-10 text-xs bg-muted/50">ε</th>
                  {b.split('').map((char, j) => (
                    <th key={j} className="border-2 border-border w-10 h-10 text-xs bg-muted/50 font-mono">
                      {char}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dp.map((row, i) => (
                  <tr key={i}>
                    <th className="border-2 border-border w-10 h-10 text-xs bg-muted/50 font-mono">
                      {i === 0 ? 'ε' : a[i-1]}
                    </th>
                    {row.map((val, j) => (
                      <td key={j} className={`border-2 border-border text-center w-10 h-10 text-sm font-mono transition-all duration-300 ${
                        i === iCur && j === jCur 
                          ? 'bg-yellow-200 border-yellow-500 text-yellow-800 animate-pulse shadow-lg' 
                          : val > 0 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-white'
                      }`}>
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Current Step Display */}
        {currentStep && (
          <div className="mt-4 p-3 bg-muted/20 rounded-lg border">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{currentStep}</span>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {lcs && (
        <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2">
            Longest Common Subsequence Found!
          </div>
          <div className="text-green-700 dark:text-green-300">
            <div>LCS: <span className="font-mono text-lg font-bold">{lcs}</span></div>
            <div>Length: <span className="font-bold">{lcs.length}</span></div>
            <div className="text-xs mt-1">
              This is one of the longest subsequences common to both strings
            </div>
          </div>
        </div>
      )}

      {/* Status */}
      <div className="flex flex-wrap gap-3 items-center">
        <Badge variant="outline">String A Length: {a.length}</Badge>
        <Badge variant="outline">String B Length: {b.length}</Badge>
        <Badge variant="outline">Table Size: {a.length + 1} × {b.length + 1}</Badge>
        {lcsLength > 0 && (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            LCS Length: {lcsLength}
          </Badge>
        )}
        {isRunning && (
          <Badge variant="secondary" className="animate-pulse">
            Computing...
          </Badge>
        )}
      </div>

      {/* Algorithm Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-2">How LCS Algorithm Works:</h4>
          <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
            <li>Create a DP table of size (n+1) × (m+1)</li>
            <li>Initialize first row and column with zeros</li>
            <li>For each cell (i,j):</li>
            <li className="ml-4">• If characters match: DP[i][j] = DP[i-1][j-1] + 1</li>
            <li className="ml-4">• If different: DP[i][j] = max(DP[i-1][j], DP[i][j-1])</li>
            <li>Backtrack from DP[n][m] to reconstruct the LCS</li>
            <li>Follow the path that led to optimal solution</li>
          </ol>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-2">Complexity Analysis:</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div><strong>Time Complexity:</strong> O(n × m)</div>
            <div className="ml-4">• Fill DP table: O(n × m)</div>
            <div className="ml-4">• Reconstruct LCS: O(n + m)</div>
            <div><strong>Space Complexity:</strong> O(n × m)</div>
            <div className="ml-4">• DP table storage</div>
            <div><strong>Applications:</strong> DNA sequencing, file diff, version control</div>
            <div><strong>Optimization:</strong> Can be reduced to O(min(n,m)) space</div>
          </div>
        </div>
      </div>

      {/* Memory Layout */}
      {showMemory && (
        <MemoryLayout
          title="LCS DP Table Memory Layout"
          data={dp.flat()}
          baseAddress={0xA000}
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
