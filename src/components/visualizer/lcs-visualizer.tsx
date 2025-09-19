import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function LCSVisualizer() {
  const [a, setA] = useState('ABCBDAB');
  const [b, setB] = useState('BDCABA');
  const [dp, setDp] = useState<number[][]>([]);
  const [iCur, setICur] = useState(-1);
  const [jCur, setJCur] = useState(-1);
  const [lcs, setLcs] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const sleep = (ms:number)=>new Promise(r=>setTimeout(r,ms));

  const run = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    const n = a.length, m = b.length;
    const D = Array.from({length:n+1},()=>Array(m+1).fill(0));
    for (let i=1;i<=n;i++){
      for(let j=1;j<=m;j++){
        setICur(i); setJCur(j);
        if (a[i-1]===b[j-1]) D[i][j]=D[i-1][j-1]+1; else D[i][j]=Math.max(D[i-1][j],D[i][j-1]);
        setDp(D.map(row=>row.slice()));
        await sleep(60);
      }
    }
    // reconstruct
    let i=n, j=m; const out:string[]=[];
    while(i>0&&j>0){
      if (a[i-1]===b[j-1]){ out.push(a[i-1]); i--; j--; }
      else if (D[i-1][j]>=D[i][j-1]) i--; else j--;
    }
    setLcs(out.reverse().join(''));
    setIsRunning(false);
  }, [a,b,isRunning]);

  const reset = useCallback(()=>{ setDp([]); setICur(-1); setJCur(-1); setLcs(''); setIsRunning(false); },[]);

  return (
    <div className="w-full space-y-4">
      <div className="flex gap-3 flex-wrap p-4 bg-muted/30 rounded-xl border">
        <div className="flex items-center gap-2"><span className="text-sm">A</span><Input className="w-56" value={a} onChange={e=>setA(e.target.value)} /></div>
        <div className="flex items-center gap-2"><span className="text-sm">B</span><Input className="w-56" value={b} onChange={e=>setB(e.target.value)} /></div>
        <Button onClick={run} disabled={isRunning}>Run</Button>
        <Button onClick={reset} variant="outline" disabled={isRunning}>Reset</Button>
      </div>

      <div className="p-4 bg-gradient-visualization rounded-xl border-2 overflow-x-auto">
        <table className="border-collapse">
          <tbody>
            {dp.map((row, i)=>(
              <tr key={i}>
                {row.map((val, j)=>(
                  <td key={j} className={`border text-center w-10 h-8 text-xs font-mono ${i===iCur&&j===jCur?'bg-warning/30':''}`}>
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {lcs && (
        <div className="bg-muted/20 rounded-lg p-3 text-sm">LCS: <span className="font-mono text-primary font-bold">{lcs}</span></div>
      )}

      <div className="bg-muted/20 rounded-lg p-3 text-sm text-muted-foreground">
        <div>• DP[i][j] = LCS length for A[0..i-1], B[0..j-1]</div>
        <div>• Time: O(n·m), Space: O(n·m)</div>
      </div>
    </div>
  );
}
