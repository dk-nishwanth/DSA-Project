import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function LongestUniqueSubstringVisualizer() {
  const [text, setText] = useState('abcabcbb');
  const [l, setL] = useState(0);
  const [r, setR] = useState(0);
  const [best, setBest] = useState<{len:number,l:number,r:number}>({len:0,l:0,r:0});
  const [seen, setSeen] = useState<Record<string, number>>({});
  const [isRunning, setIsRunning] = useState(false);

  const sleep = (ms:number)=>new Promise(r=>setTimeout(r,ms));

  const run = useCallback(async ()=>{
    if (isRunning) return; setIsRunning(true);
    const last: Record<string, number> = {};
    let left = 0; let bestLen = 0, bestL = 0, bestR = 0;
    for (let right = 0; right < text.length; right++) {
      const ch = text[right];
      if (last[ch] !== undefined && last[ch] >= left) {
        left = last[ch] + 1;
      }
      last[ch] = right;
      setSeen({...last}); setL(left); setR(right);
      const curLen = right - left + 1;
      if (curLen > bestLen) { bestLen = curLen; bestL = left; bestR = right; setBest({len:bestLen,l:bestL,r:bestR}); }
      await sleep(160);
    }
    setIsRunning(false);
  }, [text, isRunning]);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2 p-4 bg-muted/30 rounded-xl border flex-wrap">
        <Input className="w-80" value={text} onChange={e=>setText(e.target.value)} />
        <Button onClick={run} disabled={isRunning}>Run</Button>
      </div>
      <div className="p-4 bg-card rounded-xl border font-mono">
        {text.split('').map((ch, i)=> (
          <span key={i} className={`px-1 ${i>=l && i<=r?'bg-warning/30':''} ${i>=best.l && i<=best.r?'underline decoration-success':''}`}>{ch}</span>
        ))}
      </div>
      <div className="text-sm">Best: <span className="font-mono">{best.len}</span> substring "<span className="font-mono">{text.slice(best.l, best.r+1)}</span>"</div>
      <div className="bg-muted/20 rounded-lg p-3 text-sm text-muted-foreground">
        <div>• Expand right; when duplicate seen, move left to last duplicate index + 1.</div>
        <div>• Time: O(n), Space: O(k) distinct chars</div>
      </div>
    </div>
  );
}
