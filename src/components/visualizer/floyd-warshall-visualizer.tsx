import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

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

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const reset = useCallback(() => {
    setKStep(-1); setIStep(-1); setJStep(-1); setIsRunning(false);
  }, []);

  const run = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    const dist = matrix.map(row => row.slice());
    for (let k = 0; k < n; k++) {
      setKStep(k);
      for (let i = 0; i < n; i++) {
        setIStep(i);
        for (let j = 0; j < n; j++) {
          setJStep(j);
          if (dist[i][k] + dist[k][j] < dist[i][j]) {
            dist[i][j] = dist[i][k] + dist[k][j];
            setMatrix(dist.map(row => row.slice()));
            await sleep(250);
          }
        }
      }
      await sleep(300);
    }
    setIsRunning(false);
    toast.success('All-pairs shortest paths computed');
  }, [isRunning, matrix, n]);

  const setCell = (i: number, j: number, val: string) => {
    const num = val.trim().toUpperCase() === 'INF' ? INF : (parseInt(val) || 0);
    const m = matrix.map(row => row.slice());
    m[i][j] = num;
    setMatrix(m);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <Button onClick={run} disabled={isRunning}>Run</Button>
        <Button onClick={reset} variant="outline" disabled={isRunning}>Reset</Button>
      </div>

      <div className="p-4 bg-gradient-visualization rounded-xl border-2">
        <div className="overflow-x-auto">
          <table className="border-collapse">
            <tbody>
              {matrix.map((row, i) => (
                <tr key={i}>
                  {row.map((val, j) => (
                    <td key={j} className={`border p-2 text-center font-mono text-sm ${i===iStep && j===jStep ? 'bg-warning/20' : ''} ${j===kStep || i===kStep ? 'bg-info/10' : ''}`}>
                      <Input
                        className="w-20 text-center"
                        value={val >= INF/2 ? 'INF' : String(val)}
                        onChange={e => setCell(i, j, e.target.value)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-muted/20 rounded-lg p-3 text-sm text-muted-foreground">
        <div>• Floyd–Warshall updates dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]) for all i, j, k.</div>
        <div>• Time: O(n^3), Space: O(n^2)</div>
      </div>
    </div>
  );
}
