import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

export function FibonacciDPVisualizer() {
  const [nInput, setNInput] = useState('10');
  const [mode, setMode] = useState<'tab'|'memo'>('tab');
  const [dp, setDp] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [cur, setCur] = useState<number | null>(null);
  const [showMemory, setShowMemory] = useState(false);
  const [stepDesc, setStepDesc] = useState('');

  const {
    voiceEnabled,
    setVoiceEnabled,
    speakOperation,
    speakStep,
    speakResult,
  } = useVisualizerVoice({ minInterval: 1200 });

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const runTab = useCallback(async (n: number) => {
    speakOperation('Fibonacci Tabulation', `Building table up to n=${n}.`);
    const T = Array(n+1).fill(0);
    if (n >= 1) T[1] = 1;
    setDp([...T]);
    for (let i=2;i<=n;i++) {
      T[i] = T[i-1] + T[i-2];
      setCur(i);
      setDp([...T]);
      const msg = `T[${i}] = T[${i-1}] + T[${i-2}] = ${T[i-1]} + ${T[i-2]} = ${T[i]}`;
      setStepDesc(msg);
      speakStep('', msg, i, n);
      await sleep(120);
    }
    speakResult(`F(${n}) = ${T[n]}`);
  }, [speakOperation, speakStep, speakResult]);

  const runMemo = useCallback(async (n: number) => {
    speakOperation('Fibonacci Memoization', `Top-down recursion with caching for n=${n}.`);
    const memo: Record<number, number> = {0:0, 1:1};
    const order: number[] = [];
    const fib = async (k: number): Promise<number> => {
      order.push(k);
      setCur(k);
      setDp(order.slice());
      setStepDesc(`Visiting F(${k})`);
      speakStep('', `Compute F(${k})`, k, n);
      await sleep(100);
      if (memo[k] !== undefined) {
        setStepDesc(`Cached F(${k}) = ${memo[k]}`);
        speakStep('', `Use memo F(${k}) = ${memo[k]}`, k, n);
        return memo[k];
      }
      memo[k] = (await fib(k-1)) + (await fib(k-2));
      setStepDesc(`Set F(${k}) = F(${k-1}) + F(${k-2}) = ${memo[k]}`);
      speakStep('', `Set F(${k}) = F(${k-1}) + F(${k-2})`, k, n);
      return memo[k];
    };
    const ans = await fib(n);
    // show final table from memo
    const maxK = Math.max(...Object.keys(memo).map(Number));
    const T = Array(maxK+1).fill(0);
    for (const k in memo) T[Number(k)] = memo[Number(k)];
    setDp(T);
    speakResult(`F(${n}) = ${ans}`);
  }, [speakOperation, speakStep, speakResult]);

  const run = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    const n = Math.max(0, Math.min(40, parseInt(nInput)||0));
    setDp([]); setCur(null); setStepDesc('');
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
        {stepDesc && (
          <div className="mt-3 text-sm bg-muted/20 rounded p-2">{stepDesc}</div>
        )}
      </div>

      <div className="flex justify-center">
        <VisualizerControls
          showMemory={showMemory}
          onToggleMemory={setShowMemory}
          voiceEnabled={voiceEnabled}
          onToggleVoice={setVoiceEnabled}
        />
      </div>

      {showMemory && (
        <MemoryLayout
          data={dp}
          title="DP Table (F[0..n])"
          baseAddress={4000}
          wordSize={4}
        />
      )}

      <div className="bg-muted/20 rounded-lg p-3 text-sm text-muted-foreground">
        <div>• DP trades recursion recomputation for stored results.</div>
        <div>• Tabulation builds from base cases up; Memoization caches recursive calls.</div>
      </div>
    </div>
  );
}
