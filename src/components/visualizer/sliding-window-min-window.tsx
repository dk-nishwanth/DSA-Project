import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function MinimumWindowSubstringVisualizer() {
  const [text, setText] = useState('ADOBECODEBANC');
  const [pattern, setPattern] = useState('ABC');
  const [l, setL] = useState(0);
  const [r, setR] = useState(0);
  const [best, setBest] = useState<{len:number,l:number,r:number}>({len:Infinity,l:0,r:0});
  const [need, setNeed] = useState<Record<string, number>>({});
  const [have, setHave] = useState<Record<string, number>>({});
  const [formed, setFormed] = useState(0);
  const [required, setRequired] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const sleep = (ms:number)=>new Promise(r=>setTimeout(r,ms));

  const run = useCallback(async ()=>{
    if (isRunning) return; setIsRunning(true);
    const needMap: Record<string, number> = {};
    for (const c of pattern) needMap[c] = (needMap[c]||0)+1;
    setNeed({...needMap}); setRequired(Object.keys(needMap).length);

    const haveMap: Record<string, number> = {};
    let left = 0; let formedCount = 0; let bestLen = Infinity, bestL = 0, bestR = 0;
    const satisfies = (ch: string) => haveMap[ch] !== undefined && haveMap[ch] === needMap[ch];

    for (let right = 0; right < text.length; right++) {
      const ch = text[right];
      haveMap[ch] = (haveMap[ch]||0)+1;
      if (needMap[ch] && satisfies(ch)) formedCount++;
      setHave({...haveMap}); setFormed(formedCount); setL(left); setR(right);
      await sleep(120);
      while (left <= right && formedCount === Object.keys(needMap).length) {
        const curLen = right - left + 1;
        if (curLen < bestLen) { bestLen = curLen; bestL = left; bestR = right; setBest({len:bestLen,l:bestL,r:bestR}); }
        const chL = text[left];
        haveMap[chL] = (haveMap[chL]||0) - 1;
        if (needMap[chL] && haveMap[chL] < needMap[chL]) formedCount--;
        setHave({...haveMap}); setFormed(formedCount);
        left++;
        setL(left);
        await sleep(120);
      }
    }
    setIsRunning(false);
  }, [text, pattern, isRunning]);

  const bestText = best.len===Infinity? '' : text.slice(best.l, best.r+1);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2 p-4 bg-muted/30 rounded-xl border flex-wrap">
        <div className="flex items-center gap-2"><span className="text-sm">Text</span><Input className="w-72" value={text} onChange={e=>setText(e.target.value)} /></div>
        <div className="flex items-center gap-2"><span className="text-sm">Pattern</span><Input className="w-48" value={pattern} onChange={e=>setPattern(e.target.value)} /></div>
        <Button onClick={run} disabled={isRunning}>Run</Button>
      </div>
      <div className="p-4 bg-card rounded-xl border font-mono">
        {text.split('').map((ch, i)=> (
          <span key={i} className={`px-1 ${i>=l && i<=r?'bg-warning/30':''} ${best.len!==Infinity && i>=best.l && i<=best.r?'underline decoration-success':''}`}>{ch}</span>
        ))}
      </div>
      <div className="text-sm">Best: <span className="font-mono">{best.len===Infinity? 'N/A' : best.len}</span> window "<span className="font-mono">{bestText}</span>"</div>
      <div className="bg-muted/20 rounded-lg p-3 text-sm text-muted-foreground">
        <div>• Expand right until all requirements are satisfied, then shrink left to minimize.</div>
        <div>• Time: O(n), Space: O(k) distinct required chars</div>
      </div>
    </div>
  );
}
