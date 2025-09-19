import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function CoinChangeVisualizer() {
  const [coinsInput, setCoinsInput] = useState('1,2,5');
  const [amount, setAmount] = useState('11');
  const [mode, setMode] = useState<'min'|'ways'>('min');
  const [dp, setDp] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const sleep = (ms:number)=>new Promise(r=>setTimeout(r,ms));

  const run = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    const coins = coinsInput.split(',').map(s=>parseInt(s.trim())).filter(n=>!isNaN(n)&&n>0);
    const A = Math.max(0, parseInt(amount)||0);
    if (!coins.length) { setIsRunning(false); return; }

    if (mode==='min') {
      const INF = 1e9;
      const D = Array(A+1).fill(INF); D[0]=0; setDp([...D]);
      for (const c of coins) {
        for (let x=c; x<=A; x++) { D[x] = Math.min(D[x], D[x-c]+1); setDp([...D]); await sleep(40); }
      }
    } else {
      const W = Array(A+1).fill(0); W[0]=1; setDp([...W]);
      for (const c of coins) {
        for (let x=c; x<=A; x++) { W[x] += W[x-c]; setDp([...W]); await sleep(40); }
      }
    }
    setIsRunning(false);
  }, [isRunning, coinsInput, amount, mode]);

  const reset = useCallback(()=>{ setDp([]); setIsRunning(false); },[]);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <div className="flex items-center gap-2"><span className="text-sm">Coins</span><Input className="w-40" value={coinsInput} onChange={e=>setCoinsInput(e.target.value)} /></div>
        <div className="flex items-center gap-2"><span className="text-sm">Amount</span><Input className="w-24" value={amount} onChange={e=>setAmount(e.target.value)} /></div>
        <Select value={mode} onValueChange={(v:'min'|'ways')=>setMode(v)}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="min">Min Coins</SelectItem>
            <SelectItem value="ways">Number of Ways</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={run} disabled={isRunning}>Run</Button>
        <Button onClick={reset} variant="outline" disabled={isRunning}>Reset</Button>
      </div>

      <div className="p-4 bg-gradient-visualization rounded-xl border-2">
        <div className="flex gap-2 flex-wrap">
          {dp.map((v,i)=>(<div key={i} className="px-2 py-1 border rounded bg-card font-mono text-xs">{i}:{v>=1e9?'∞':v}</div>))}
        </div>
      </div>

      <div className="bg-muted/20 rounded-lg p-3 text-sm text-muted-foreground">
        <div>• Unbounded knapsack variants: minimize coins or count combinations.</div>
        <div>• Time: O(n·amount) where n=#coins.</div>
      </div>
    </div>
  );
}
