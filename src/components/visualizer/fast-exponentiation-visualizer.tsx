import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function FastExponentiationVisualizer() {
  const [base, setBase] = useState('2');
  const [exp, setExp] = useState('13');
  const [mod, setMod] = useState('');
  const [steps, setSteps] = useState<string[]>([]);
  const [result, setResult] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);

  const sleep = (ms:number)=>new Promise(r=>setTimeout(r,ms));

  const run = useCallback( async () => {
    if (isRunning) return; setIsRunning(true);
    const a0 = parseInt(base) || 0;
    let b = Math.max(0, parseInt(exp) || 0);
    const hasMod = mod.trim().length>0;
    const m = hasMod ? Math.max(2, parseInt(mod)||2) : undefined;
    let a = hasMod ? ((a0 % (m!)) + (m!)) % (m!) : a0;
    let ans = 1;
    const S: string[] = [];
    while (b > 0) {
      if (b & 1) {
        ans = hasMod ? (ans * a) % (m!) : (ans * a);
        S.push(`b odd → ans = ans * a = ${ans}`);
      } else {
        S.push(`b even`);
      }
      b >>= 1;
      a = hasMod ? (a * a) % (m!) : (a * a);
      S.push(`square a → a = ${a}, b >>= 1 → ${b}`);
      setSteps([...S]);
      await sleep(160);
    }
    setResult(String(ans));
    setIsRunning(false);
  }, [base, exp, mod, isRunning]);

  return (
    <div className="w-full space-y-4">
      <div className="flex gap-2 items-center p-4 bg-muted/30 rounded-xl border flex-wrap">
        <div className="flex items-center gap-2"><span className="text-sm">a</span><Input className="w-24" value={base} onChange={e=>setBase(e.target.value)} /></div>
        <div className="flex items-center gap-2"><span className="text-sm">b</span><Input className="w-24" value={exp} onChange={e=>setExp(e.target.value)} /></div>
        <div className="flex items-center gap-2"><span className="text-sm">mod (optional)</span><Input className="w-24" value={mod} onChange={e=>setMod(e.target.value)} /></div>
        <Button onClick={run} disabled={isRunning}>Run</Button>
      </div>
      <div className="p-4 bg-card rounded-xl border font-mono text-sm space-y-1">
        {steps.map((s,i)=>(<div key={i}>• {s}</div>))}
      </div>
      {result!=='' && (
        <div className="p-3 bg-muted/20 rounded border text-sm">Result: <span className="font-mono font-bold">{result}</span></div>
      )}
      <div className="bg-muted/20 rounded-lg p-3 text-sm text-muted-foreground">
        <div>• Binary exponentiation multiplies only on set bits and squares base each step.</div>
        <div>• Time: O(log b), Space: O(1)</div>
      </div>
    </div>
  );
}
