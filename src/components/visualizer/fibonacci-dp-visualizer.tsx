import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function FibonacciDPVisualizer() {
  const [nInput, setNInput] = useState('10');
  const [mode, setMode] = useState<'tab'|'memo'>('tab');
  const [dp, setDp] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [cur, setCur] = useState<number | null>(null);

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const runTab = useCallback(async (n: number) => {
    const T = Array(n+1).fill(0);
    if (n >= 1) T[1] = 1;
    setDp([...T]);
    for (let i=2;i<=n;i++) { T[i] = T[i-1] + T[i-2]; setCur(i); setDp([...T]); await sleep(120); }
  }, []);

  const runMemo = useCallback(async (n: number) => {
    const memo: Record<number, number> = {0:0, 1:1};
    const order: number[] = [];
    const fib = async (k: number): Promise<number> => {
      order.push(k); setCur(k); setDp(order.slice()); await sleep(100);
      if (memo[k] !== undefined) return memo[k];
      memo[k] = (await fib(k-1)) + (await fib(k-2));
      return memo[k];
    };
    await fib(n);
    // show final table from memo
    const maxK = Math.max(...Object.keys(memo).map(Number));
    const T = Array(maxK+1).fill(0);
    for (const k in memo) T[Number(k)] = memo[Number(k)];
    setDp(T);
  }, []);

  const run = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    const n = Math.max(0, Math.min(40, parseInt(nInput)||0));
    setDp([]); setCur(null);
    if (mode==='tab') await runTab(n); else await runMemo(n);
    setIsRunning(false);
  }, [nInput, mode, isRunning, runTab, runMemo]);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <div className="flex items-center gap-2"><span className="text-sm">n</span><Input className="w-24" value={nInput} onChange={e=>setNInput(e.target.value)} /></div>
        <Select value={mode} onValueChange={(v:'tab'|'memo')=>setMode(v)}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="tab">Tabulation (bottom-up)</SelectItem>
            <SelectItem value="memo">Memoization (top-down)</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={run} disabled={isRunning}>Run</Button>
      </div>

      <div className="p-4 bg-gradient-visualization rounded-xl border-2">
        <div className="flex gap-2 flex-wrap">
          {dp.map((v, i)=>(
            <div key={i} className={`px-2 py-1 border rounded font-mono text-xs ${cur===i?'bg-primary/20 border-primary':'bg-card'}`}>{i}:{v}</div>
          ))}
        </div>
      </div>

      <div className="bg-muted/20 rounded-lg p-3 text-sm text-muted-foreground">
        <div>• DP trades recursion recomputation for stored results.</div>
        <div>• Tabulation builds from base cases up; Memoization caches recursive calls.</div>
      </div>
    </div>
  );
}
