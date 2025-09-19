import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Dimensions p[0..n] meaning Ai is p[i-1] x p[i]
export function MatrixChainVisualizer() {
  const [dimsInput, setDimsInput] = useState('30,35,15,5,10,20,25');
  const [p, setP] = useState<number[]>([30,35,15,5,10,20,25]);
  const [m, setM] = useState<number[][]>([]); // cost table
  const [s, setS] = useState<number[][]>([]); // split table
  const [lCur, setLCur] = useState(0);
  const [iCur, setICur] = useState(0);
  const [jCur, setJCur] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const sleep = (ms:number)=>new Promise(r=>setTimeout(r,ms));

  const run = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    const n = p.length - 1;
    const M = Array.from({length:n},()=>Array(n).fill(0));
    const S = Array.from({length:n},()=>Array(n).fill(0));
    for (let L=2; L<=n; L++) { // chain length
      setLCur(L);
      for (let i=0; i<=n-L; i++) {
        const j = i + L - 1;
        setICur(i); setJCur(j);
        M[i][j] = Number.POSITIVE_INFINITY;
        for (let k=i; k<j; k++) {
          const q = M[i][k] + M[k+1][j] + p[i]*p[k+1]*p[j+1];
          if (q < M[i][j]) { M[i][j]=q; S[i][j]=k; }
          setM(M.map(r=>r.slice())); setS(S.map(r=>r.slice()));
          await sleep(80);
        }
      }
    }
    setIsRunning(false);
  }, [p, isRunning]);

  const rebuild = useCallback(()=>{
    const dims = dimsInput.split(',').map(s=>parseInt(s.trim())).filter(n=>!isNaN(n) && n>0);
    if (dims.length>=2) { setP(dims); setM([]); setS([]); }
  }, [dimsInput]);

  const formatParens = (i:number,j:number):string => {
    if (i===j) return `A${i+1}`;
    const k = s[i]?.[j] ?? i;
    return `(${formatParens(i,k)}·${formatParens(k+1,j)})`;
  };

  const parenText = m.length && s.length && p.length>1 ? formatParens(0, p.length-2) : '';

  return (
    <div className="w-full space-y-4">
      <div className="flex gap-3 flex-wrap p-4 bg-muted/30 rounded-xl border">
        <div className="flex items-center gap-2"><span className="text-sm">Dims p[0..n]</span><Input className="w-80" value={dimsInput} onChange={e=>setDimsInput(e.target.value)} /></div>
        <Button onClick={rebuild} disabled={isRunning}>Set</Button>
        <Button onClick={run} disabled={isRunning}>Run</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gradient-visualization rounded-xl border-2 overflow-x-auto">
          <div className="text-sm mb-2">Cost table (m)</div>
          <table className="border-collapse">
            <tbody>
              {m.map((row, i)=>(
                <tr key={i}>
                  {row.map((val,j)=>(
                    <td key={j} className={`border w-16 h-10 text-center text-xs font-mono ${i===iCur&&j===jCur?'bg-warning/30':''}`}>{val===Infinity?'∞':val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-gradient-visualization rounded-xl border-2 overflow-x-auto">
          <div className="text-sm mb-2">Split table (s)</div>
          <table className="border-collapse">
            <tbody>
              {s.map((row, i)=>(
                <tr key={i}>
                  {row.map((val,j)=>(
                    <td key={j} className={`border w-16 h-10 text-center text-xs font-mono ${i===iCur&&j===jCur?'bg-info/30':''}`}>{val||0}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {m.length>0 && (
        <div className="bg-muted/20 rounded-lg p-3 text-sm">Parenthesization: <span className="font-mono">{parenText}</span></div>
      )}

      <div className="bg-muted/20 rounded-lg p-3 text-sm text-muted-foreground">
        <div>• DP over chain length L; m[i][j] = min over k of m[i][k]+m[k+1][j]+p[i]p[k+1]p[j+1].</div>
        <div>• Time: O(n^3), Space: O(n^2)</div>
      </div>
    </div>
  );
}
