import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function heapify(a: number[], n: number, i: number, onSwap: (arr:number[])=>Promise<void>) {
  return new Promise<void>(async (resolve) => {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;
    if (l < n && a[l] > a[largest]) largest = l;
    if (r < n && a[r] > a[largest]) largest = r;
    if (largest !== i) {
      [a[i], a[largest]] = [a[largest], a[i]];
      await onSwap([...a]);
      await heapify(a, n, largest, onSwap);
    }
    resolve();
  });
}

export function HeapSortVisualizer() {
  const [arr, setArr] = useState<number[]>([50, 30, 40, 20, 10, 35, 25]);
  const [input, setInput] = useState('50,30,40,20,10,35,25');
  const [isSorting, setIsSorting] = useState(false);
  const [heapSize, setHeapSize] = useState<number>(arr.length);

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const onSwap = async (a: number[]) => { setArr(a); await sleep(180); };

  const updateFromInput = () => {
    const nums = input.split(',').map(s=>parseInt(s.trim())).filter(n=>!isNaN(n));
    if (nums.length) { setArr(nums); setHeapSize(nums.length); }
  };

  const run = useCallback(async () => {
    if (isSorting) return;
    setIsSorting(true);
    const a = [...arr];
    const n = a.length;
    setHeapSize(n);

    // Build max heap
    for (let i = Math.floor(n/2)-1; i >= 0; i--) {
      await heapify(a, n, i, onSwap);
    }

    // Extract from heap
    for (let i = n - 1; i > 0; i--) {
      [a[0], a[i]] = [a[i], a[0]];
      await onSwap([...a]);
      setHeapSize(i);
      await heapify(a, i, 0, onSwap);
    }

    setArr(a);
    setHeapSize(0);
    setIsSorting(false);
  }, [isSorting, arr]);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <Input className="w-72" value={input} onChange={e=>setInput(e.target.value)} />
        <Button onClick={updateFromInput} disabled={isSorting}>Update</Button>
        <Button onClick={run} disabled={isSorting}>Run Heap Sort</Button>
      </div>

      <div className="p-6 bg-gradient-visualization rounded-xl border-2">
        <div className="flex gap-2 items-end justify-center">
          {arr.map((v, idx) => {
            const inHeap = idx < heapSize;
            const isSorted = heapSize > 0 ? idx >= heapSize : true;
            return (
              <div key={idx} className={`w-6 text-center text-xs font-mono border rounded ${inHeap? 'bg-warning/30 border-warning' : 'bg-success/30 border-success'}`} style={{height: `${8+v*2}px`}}>
                {v}
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-muted/20 rounded-lg p-3 text-sm text-muted-foreground">
        <div>• Build a max heap, then repeatedly extract the maximum to the end.</div>
        <div>• Time: O(n log n), Space: O(1)</div>
      </div>
    </div>
  );
}
