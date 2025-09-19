import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function QuickSortVisualizer() {
  const [arr, setArr] = useState<number[]>([10, 80, 30, 90, 40, 50, 70]);
  const [input, setInput] = useState('10,80,30,90,40,50,70');
  const [isSorting, setIsSorting] = useState(false);
  const [pivotIndex, setPivotIndex] = useState<number | null>(null);
  const [iIndex, setIIndex] = useState<number | null>(null);
  const [jIndex, setJIndex] = useState<number | null>(null);
  const [range, setRange] = useState<{l:number,r:number}|null>(null);

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const updateFromInput = () => {
    const nums = input.split(',').map(s=>parseInt(s.trim())).filter(n=>!isNaN(n));
    if (nums.length) setArr(nums);
  };

  const partition = async (a: number[], low: number, high: number) => {
    const pivot = a[high];
    setPivotIndex(high);
    let i = low - 1;
    for (let j = low; j < high; j++) {
      setIIndex(i);
      setJIndex(j);
      setRange({l:low, r:high});
      await sleep(180);
      if (a[j] <= pivot) {
        i++;
        [a[i], a[j]] = [a[j], a[i]];
        setArr([...a]);
        await sleep(160);
      }
    }
    [a[i+1], a[high]] = [a[high], a[i+1]];
    setArr([...a]);
    await sleep(200);
    setPivotIndex(null); setIIndex(null); setJIndex(null); setRange(null);
    return i + 1;
  };

  const quickSort = async (a: number[], low: number, high: number) => {
    if (low < high) {
      const pi = await partition(a, low, high);
      await quickSort(a, low, pi - 1);
      await quickSort(a, pi + 1, high);
    }
  };

  const run = useCallback( async () => {
    if (isSorting) return;
    setIsSorting(true);
    const a = [...arr];
    await quickSort(a, 0, a.length - 1);
    setIsSorting(false);
  }, [isSorting, arr]);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <Input className="w-72" value={input} onChange={e=>setInput(e.target.value)} />
        <Button onClick={updateFromInput} disabled={isSorting}>Update</Button>
        <Button onClick={run} disabled={isSorting}>Run Quick Sort</Button>
      </div>

      <div className="p-6 bg-gradient-visualization rounded-xl border-2">
        <div className="flex gap-2 items-end justify-center">
          {arr.map((v, idx) => {
            const inRange = range && idx>=range.l && idx<=range.r;
            const isPivot = pivotIndex === idx;
            const isI = iIndex === idx;
            const isJ = jIndex === idx;
            return (
              <div key={idx} className={`w-6 text-center text-xs font-mono border rounded ${inRange?'border-warning':'border-border'} ${isPivot?'bg-destructive/40': isI?'bg-success/40': isJ?'bg-info/40':'bg-card'}`} style={{height: `${8+v*2}px`}}>
                {v}
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-muted/20 rounded-lg p-3 text-sm text-muted-foreground">
        <div>• Partition around a pivot, then sort subarrays recursively.</div>
        <div>• Time: Average O(n log n), Worst O(n^2), Space: O(log n) recursion</div>
      </div>
    </div>
  );
}
