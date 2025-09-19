import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function TrappingRainWaterVisualizer() {
  const [heights, setHeights] = useState<number[]>([0,1,0,2,1,0,1,3,2,1,2,1]);
  const [input, setInput] = useState('0,1,0,2,1,0,1,3,2,1,2,1');
  const [l, setL] = useState(0);
  const [r, setR] = useState(heights.length-1);
  const [lMax, setLMax] = useState(0);
  const [rMax, setRMax] = useState(0);
  const [water, setWater] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const sleep = (ms:number)=>new Promise(r=>setTimeout(r,ms));

  const updateFromInput = () => {
    const nums = input.split(',').map(s=>parseInt(s.trim())).filter(n=>!isNaN(n) && n>=0);
    if (nums.length>=2) { setHeights(nums); setL(0); setR(nums.length-1); setLMax(0); setRMax(0); setWater(0); }
  };

  const run = useCallback(async ()=>{
    if (isRunning) return; setIsRunning(true);
    let i=0, j=heights.length-1; let lm=0, rm=0; let w=0;
    while(i<j){
      setL(i); setR(j); setLMax(lm); setRMax(rm);
      if (heights[i] <= heights[j]){
        lm = Math.max(lm, heights[i]); w += lm - heights[i];
        setWater(w);
        i++;
      } else {
        rm = Math.max(rm, heights[j]); w += rm - heights[j];
        setWater(w);
        j--;
      }
      await sleep(180);
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
            const isL = idx===l; const isR = idx===r;
            const waterHere = Math.max(0, Math.min(lMax, rMax) - h);
            return (
              <div key={idx} className="w-6 relative">
                <div className="w-full bg-card border" style={{height:`${h*10}px`}} />
                {waterHere>0 && (
                  <div className="absolute bottom-0 w-full bg-info/40" style={{height:`${waterHere*10}px`}} />
                )}
                {isL && <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs">L</div>}
                {isR && <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs">R</div>}
              </div>
            );
          })}
        </div>
        <div className="text-sm mt-2">Water trapped: <span className="font-mono">{water}</span></div>
      </div>
      <div className="bg-muted/20 rounded-lg p-3 text-sm text-muted-foreground">
        <div>• Maintain running maxima from both ends; move the side with smaller height.</div>
        <div>• Time: O(n), Space: O(1)</div>
      </div>
    </div>
  );
}
