import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function MergeSortVisualizer() {
  const [arr, setArr] = useState<number[]>([38,27,43,3,9,82,10]);
  const [input, setInput] = useState('38,27,43,3,9,82,10');
  const [isSorting, setIsSorting] = useState(false);
  const [highlight, setHighlight] = useState<{left:number,right:number,mid:number}|null>(null);

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const updateFromInput = () => {
    const nums = input.split(',').map(s=>parseInt(s.trim())).filter(n=>!isNaN(n));
    if (nums.length) setArr(nums);
  };

  const mergeSort = async (a: number[], l: number, r: number) => {
    if (l >= r) return;
    const m = Math.floor((l + r) / 2);
    setHighlight({left:l,right:r,mid:m});
    await sleep(250);
    await mergeSort(a, l, m);
    await mergeSort(a, m + 1, r);
    // merge
    const tmp: number[] = [];
    let i = l, j = m + 1;
    while (i <= m && j <= r) tmp.push(a[i] <= a[j] ? a[i++] : a[j++]);
    while (i <= m) tmp.push(a[i++]);
    while (j <= r) tmp.push(a[j++]);
    for (let k = 0; k < tmp.length; k++) {
      a[l + k] = tmp[k];
      setArr([...a]);
      await sleep(120);
    }
  };

  const run = useCallback(async () => {
    if (isSorting) return;
    setIsSorting(true);
    const a = [...arr];
    await mergeSort(a, 0, a.length - 1);
    setHighlight(null);
    setIsSorting(false);
  }, [isSorting, arr]);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <Input className="w-72" value={input} onChange={e=>setInput(e.target.value)} />
        <Button onClick={updateFromInput} disabled={isSorting}>Update</Button>
        <Button onClick={run} disabled={isSorting}>Run Merge Sort</Button>
      </div>

      <div className="p-6 bg-gradient-visualization rounded-xl border-2">
        <div className="flex gap-2 items-end justify-center">
          {arr.map((v, i) => {
            const inRange = highlight && i>=highlight.left && i<=highlight.right;
            const isLeft = highlight && i<=highlight.mid && i>=highlight.left;
            const isRight = highlight && i>highlight.mid && i<=highlight.right;
            return (
              <div key={i} className={`w-6 text-center text-xs font-mono border rounded ${inRange?'border-warning':'border-border'} ${isLeft?'bg-warning/30': isRight?'bg-info/30':'bg-card'}`} style={{height: `${8+v*2}px`}}>
                {v}
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-muted/20 rounded-lg p-3 text-sm text-muted-foreground">
        <div>• Divide array, sort halves, then merge.</div>
        <div>• Time: O(n log n), Space: O(n)</div>
      </div>
    </div>
  );
}
