import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PseudocodeBox } from '@/components/pseudocode-box';
import { ComplexityBox } from '@/components/complexity-box';

export function SlidingWindowMaximumVisualizer() {
  const [arr, setArr] = useState<number[]>([1,3,-1,-3,5,3,6,7]);
  const [kInput, setKInput] = useState('3');
  const [input, setInput] = useState('1,3,-1,-3,5,3,6,7');
  const [deque, setDeque] = useState<number[]>([]); // store indices
  const [iCur, setICur] = useState<number | null>(null);
  const [output, setOutput] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [stepDesc, setStepDesc] = useState('');

  const sleep = (ms:number)=>new Promise(r=>setTimeout(r,ms));

  const updateFromInput = () => {
    const nums = input.split(',').map(s=>parseInt(s.trim())).filter(n=>!isNaN(n));
    if (nums.length) { setArr(nums); setDeque([]); setOutput([]); setICur(null); }
  };

  const run = useCallback(async ()=>{
    if (isRunning) return; setIsRunning(true);
    const k = Math.max(1, Math.min(arr.length, parseInt(kInput)||1));
    const dq: number[] = [];
    const out: number[] = [];
    for (let i=0;i<arr.length;i++){
      setICur(i);
      setStep(1);
      setStepDesc(`i=${i}, value=${arr[i]} → remove indices out of window (<= i-k)`);
      // remove out of window
      while (dq.length && dq[0] <= i - k) { dq.shift(); setDeque([...dq]); await sleep(80); }
      // maintain decreasing deque
      setStep(2);
      setStepDesc('Maintain decreasing deque: pop from back while smaller than current');
      while (dq.length && arr[dq[dq.length-1]] <= arr[i]) { dq.pop(); setDeque([...dq]); await sleep(80); }
      dq.push(i);
      setDeque([...dq]);
      setStep(3);
      setStepDesc('Push current index; front of deque is max for this window');
      if (i >= k-1) { out.push(arr[dq[0]]); setOutput([...out]); }
      await sleep(160);
    }
    setIsRunning(false);
  }, [arr, kInput, isRunning]);

  return (
    <div className="w-full space-y-4">
      <div className="flex gap-2 items-center p-4 bg-muted/30 rounded-xl border flex-wrap">
        <Input className="w-72" value={input} onChange={e=>setInput(e.target.value)} />
        <div className="flex items-center gap-2"><span className="text-sm">k</span><Input className="w-20" value={kInput} onChange={e=>setKInput(e.target.value)} /></div>
        <Button onClick={updateFromInput} disabled={isRunning}>Update</Button>
        <Button onClick={run} disabled={isRunning}>Run</Button>
      </div>

      <div className="p-4 bg-card rounded-xl border font-mono flex gap-2 flex-wrap">
        {arr.map((v,i)=> (
          <span key={i} className={`px-2 py-1 border rounded transition-all ${iCur===i?'bg-warning/30 scale-105':''}`}>{v}</span>
        ))}
      </div>

      <div className="p-4 bg-card rounded-xl border">
        <div className="text-sm mb-1">Deque (front → back)</div>
        <div className="font-mono flex gap-2 flex-wrap">
          {deque.map((idx,i)=>(
            <span key={i} className="px-2 py-1 border rounded bg-muted/20">
              {idx}:{arr[idx]}
            </span>
          ))}
        </div>
        {stepDesc && (
          <div className="mt-3 p-2 bg-muted/20 rounded text-sm">{stepDesc}</div>
        )}
      </div>

      {output.length>0 && (
        <div className="p-4 bg-muted/20 rounded border font-mono">Output: [{output.join(', ')}]</div>
      )}

      <PseudocodeBox
        title="Sliding Window Maximum - Pseudocode"
        code={[
          'dq = empty deque',
          'for i in 0..n-1:',
          '  while dq not empty and dq.front <= i-k: pop_front()',
          '  while dq not empty and a[dq.back] <= a[i]: pop_back()',
          '  push_back(i)',
          '  if i >= k-1: output.append(a[dq.front])',
        ]}
        highlightedLine={step}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ComplexityBox
          title="Time Complexity"
          timeComplexity="O(n)"
          spaceComplexity="O(k)"
          description="Each index is pushed and popped at most once from the deque."
        />
        <div className="bg-muted/20 rounded p-3 text-sm">
          <div className="font-semibold mb-2">Key Properties</div>
          <ul className="space-y-1">
            <li>• The deque stores indices in decreasing value order.</li>
            <li>• The front of the deque is always the window maximum.</li>
            <li>• Indices that fall out of window are ejected from the front.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
