import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVoiceExplain } from '@/hooks/useVoiceExplain';

function getMax(a: number[]) { return a.reduce((m, x) => Math.max(m, x), 0); }

export function RadixSortVisualizer() {
  const [arr, setArr] = useState<number[]>([170, 45, 75, 90, 802, 24, 2, 66]);
  const [input, setInput] = useState('170,45,75,90,802,24,2,66');
  const [isSorting, setIsSorting] = useState(false);
  const [digitExp, setDigitExp] = useState<number | null>(null);
  const [buckets, setBuckets] = useState<number[][]>(Array.from({length:10},()=>[]));
  const [showMemory, setShowMemory] = useState(false);
  
  const [voiceText, setVoiceText] = useState('');
  const { enabled: voiceEnabled, setEnabled: setVoiceEnabled } = useVoiceExplain(voiceText);

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const updateFromInput = useCallback(() => {
    const nums = input.split(',').map(s=>parseInt(s.trim())).filter(n=>!isNaN(n) && n>=0);
    if (nums.length) setArr(nums);
  }, [input]);

  const countingPass = async (a: number[], exp: number) => {
    const B: number[][] = Array.from({length:10},()=>[]);
    for (const x of a) {
      const digit = Math.floor(x / exp) % 10;
      B[digit].push(x);
      setBuckets(B.map(b=>[...b]));
      await sleep(120);
    }
    const merged: number[] = [];
    for (let d=0; d<10; d++) merged.push(...B[d]);
    setBuckets(Array.from({length:10},()=>[]));
    return merged;
  };

  const run = useCallback(async () => {
    if (isSorting) return;
    setIsSorting(true);
    let a = [...arr];
    const maxv = getMax(a);
    for (let exp = 1; Math.floor(maxv / exp) > 0; exp *= 10) {
      setDigitExp(exp);
      a = await countingPass(a, exp);
      setArr([...a]);
      await sleep(200);
    }
    setDigitExp(null);
    setIsSorting(false);
  }, [isSorting, arr]);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <Input className="w-72" value={input} onChange={e=>setInput(e.target.value)} />
        <Button onClick={updateFromInput} disabled={isSorting}>Update</Button>
        <Button onClick={run} disabled={isSorting}>Run Radix Sort (LSD)</Button>
      </div>

      <div className="p-6 bg-gradient-visualization rounded-xl border-2 space-y-4">
        <div className="flex gap-2 items-end justify-center">
          {arr.map((v, i) => (
            <div key={i} className={`w-10 text-center text-xs font-mono border rounded bg-card`}>
              <div className="px-1 py-2">{v}</div>
            </div>
          ))}
        </div>

        {digitExp !== null && (
          <div className="text-sm text-center">Digit pass: exp = {digitExp}</div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {buckets.map((b, d) => (
            <div key={d} className="p-2 border rounded bg-card">
              <div className="text-xs text-muted-foreground">Bucket {d}</div>
              <div className="flex gap-1 flex-wrap mt-1">
                {b.map((x, idx) => (
                  <div key={idx} className="px-2 py-1 border rounded text-xs font-mono">{x}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-muted/20 rounded-lg p-3 text-sm text-muted-foreground">
        <div>• LSD Radix Sort using base-10 buckets per digit.</div>
        <div>• Time: O(d*(n + b)) where d=#digits and b=base (10 here). Space: O(n + b)</div>
      </div>

      {/* Memory Layout */}
      {showMemory && (
        <MemoryLayout
          title="Array Memory Layout"
          data={arr}
          baseAddress={0x6000}
        />
      )}

      {/* Controls */}
      <div className="flex justify-center">
        <VisualizerControls
          showMemory={showMemory}
          onToggleMemory={setShowMemory}
          voiceEnabled={voiceEnabled}
          onToggleVoice={setVoiceEnabled}
        />
      </div>
    </div>
  );
}
