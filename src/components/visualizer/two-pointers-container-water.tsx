import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ContainerWithMostWaterVisualizer() {
  const [heights, setHeights] = useState<number[]>([1,8,6,2,5,4,8,3,7]);
  const [input, setInput] = useState('1,8,6,2,5,4,8,3,7');
  const [l, setL] = useState(0);
  const [r, setR] = useState(heights.length-1);
  const [best, setBest] = useState<{area:number,l:number,r:number}>({area:0,l:0,r:0});
  const [isRunning, setIsRunning] = useState(false);

  const sleep = (ms:number)=>new Promise(r=>setTimeout(r,ms));

  const updateFromInput = () => {
    const nums = input.split(',').map(s=>parseInt(s.trim())).filter(n=>!isNaN(n) && n>=0);
    if (nums.length>=2) { setHeights(nums); setL(0); setR(nums.length-1); setBest({area:0,l:0,r:0}); }
  };

  const run = useCallback(async ()=>{
    if (isRunning) return; setIsRunning(true);
    let i = 0, j = heights.length-1; let bestA = 0, bestL=0, bestR=0;
    while (i < j) {
      setL(i); setR(j);
      const area = Math.min(heights[i], heights[j]) * (j - i);
      if (area > bestA) { bestA = area; bestL = i; bestR = j; setBest({area:bestA,l:bestL,r:bestR}); }
      await sleep(220);
      if (heights[i] < heights[j]) i++; else j--;
    }
    setIsRunning(false);
  }, [heights, isRunning]);

  return (
    <div className="w-full space-y-4">
      <div className="flex gap-2 items-center p-4 bg-muted/30 rounded-xl border flex-wrap">
        <Input className="w-80" value={input} onChange={e=>setInput(e.target.value)} />
        <Button onClick={updateFromInput} disabled={isRunning}>Update</Button>
        <Button onClick={run} disabled={isRunning}>Run Two Pointers</Button>
      </div>
      <div className="p-4 bg-gradient-visualization rounded-xl border-2">
        <div className="flex items-end gap-1 h-56 justify-center">
          {heights.map((h, idx)=>{
            const isL = idx===l; const isR = idx===r; const isBest = idx===best.l || idx===best.r;
            return (
              <div key={idx} className={`w-6 bg-card border relative ${isBest?'border-success':'border-border'}`} style={{height:`${h*8}px`}}>
                {isL && <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs">L</div>}
                {isR && <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs">R</div>}
              </div>
            );
          })}
        </div>
        <div className="text-sm mt-2">Best Area: <span className="font-mono">{best.area}</span> with [{best.l}, {best.r}]</div>
      </div>
      <div className="bg-muted/20 rounded-lg p-3 text-sm text-muted-foreground">
        <div>• Move the pointer at the shorter line inward to possibly find a taller line.</div>
        <div>• Time: O(n), Space: O(1)</div>
      </div>
    </div>
  );
}
