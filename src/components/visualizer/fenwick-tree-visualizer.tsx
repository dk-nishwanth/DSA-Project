import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function lsb(x: number) { return x & -x; }

export function FenwickTreeVisualizer() {
  const [input, setInput] = useState('1,2,3,4,5,6,7,8');
  const [arr, setArr] = useState<number[]>([1,2,3,4,5,6,7,8]);
  const [bit, setBit] = useState<number[]>([]);
  const [highlight, setHighlight] = useState<number[]>([]);
  const [idx, setIdx] = useState('5');
  const [delta, setDelta] = useState('3');
  const [queryIdx, setQueryIdx] = useState('6');
  const [isBusy, setIsBusy] = useState(false);

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const build = useCallback(async (a: number[]) => {
    setIsBusy(true);
    const n = a.length;
    const t = new Array(n+1).fill(0);
    for (let i = 1; i <= n; i++) {
      let j = i;
      while (j <= n) {
        t[j] += a[i-1];
        setBit([...t]); await sleep(60);
        j += lsb(j);
      }
    }
    setBit(t);
    setIsBusy(false);
  }, []);

  const rebuild = useCallback(() => {
    const nums = input.split(',').map(s=>parseInt(s.trim())).filter(n=>!isNaN(n));
    if (!nums.length) return;
    setArr(nums);
    build(nums);
  }, [input, build]);

  const prefixSum = useCallback(async (i: number) => {
    setIsBusy(true);
    let sum = 0; const n = arr.length; const t = [...bit];
    let j = Math.max(0, Math.min(n, i));
    const hl: number[] = [];
    while (j > 0) {
      hl.push(j); setHighlight([...hl]); await sleep(120);
      sum += t[j];
      j -= lsb(j);
    }
    setIsBusy(false);
    return sum;
  }, [bit, arr.length]);

  const pointUpdate = useCallback(async (i: number, d: number) => {
    setIsBusy(true);
    const n = arr.length; const a = [...arr]; a[i-1] += d; setArr(a);
    const t = [...bit];
    let j = i;
    const hl: number[] = [];
    while (j <= n) {
      t[j] += d; hl.push(j); setHighlight([...hl]); setBit([...t]); await sleep(120);
      j += lsb(j);
    }
    setIsBusy(false);
  }, [bit, arr]);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <Input className="w-72" value={input} onChange={e=>setInput(e.target.value)} />
        <Button onClick={rebuild} disabled={isBusy}>Build</Button>
        <div className="flex items-center gap-2">
          <span className="text-sm">Update i, +Δ:</span>
          <Input className="w-16" value={idx} onChange={e=>setIdx(e.target.value)} />
          <Input className="w-16" value={delta} onChange={e=>setDelta(e.target.value)} />
          <Button onClick={()=>pointUpdate(parseInt(idx)||1, parseInt(delta)||0)} disabled={isBusy}>Apply</Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">Prefix sum i:</span>
          <Input className="w-16" value={queryIdx} onChange={e=>setQueryIdx(e.target.value)} />
          <Button onClick={async()=>{
            const s = await prefixSum(parseInt(queryIdx)||0);
            alert(`prefixSum(${queryIdx}) = ${s}`);
          }} disabled={isBusy}>Query</Button>
        </div>
      </div>

      <div className="p-4 bg-gradient-visualization rounded-xl border-2 space-y-3">
        <div className="text-sm">Array</div>
        <div className="flex gap-2">
          {arr.map((x,i)=>(<div key={i} className="px-2 py-1 border rounded bg-card font-mono text-sm">{x}</div>))}
        </div>
        <div className="text-sm">Fenwick Tree (1-indexed)</div>
        <div className="flex gap-2 flex-wrap">
          {bit.map((x,i)=>(
            <div key={i} className={`px-2 py-1 border rounded font-mono text-xs ${highlight.includes(i)?'bg-primary/20 border-primary':'bg-card'}`}>{i}:{x}</div>
          ))}
        </div>
      </div>

      <div className="bg-muted/20 rounded-lg p-3 text-sm text-muted-foreground">
        <div>• Supports prefix sums and point updates in O(log n) using least significant bit jumps.</div>
        <div>• Time: Build O(n log n) shown (can be O(n)), Query/Update O(log n). Space: O(n).</div>
      </div>
    </div>
  );
}
