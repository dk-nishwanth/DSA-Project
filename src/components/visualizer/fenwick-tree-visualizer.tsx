import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

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
  const [currentStep, setCurrentStep] = useState('');
  const [showMemory, setShowMemory] = useState(false);
  const [operation, setOperation] = useState<string>('');
  
  const {
    voiceEnabled,
    setVoiceEnabled,
    speed,
    setSpeed,
    isSpeaking,
    pauseSpeech,
    resumeSpeech,
    stopSpeech,
    speakStep,
    speakOperation,
    speakResult
  } = useVisualizerVoice({ minInterval: 2000 });

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const build = useCallback(async (a: number[]) => {
    setIsBusy(true);
    setOperation('Building Fenwick Tree');
    speakOperation("Fenwick Tree Build", `Building Fenwick Tree (Binary Indexed Tree) from array [${a.join(', ')}]. We'll propagate each element's contribution using least significant bit jumps.`);
    
    const n = a.length;
    const t = new Array(n+1).fill(0);
    setCurrentStep('Initializing Fenwick Tree with zeros...');
    setBit([...t]);
    await sleep(800);
    
    for (let i = 1; i <= n; i++) {
      setCurrentStep(`Processing element ${a[i-1]} at position ${i}`);
      speakStep("", `Processing element ${a[i-1]} at position ${i}. Adding its value to all responsible positions using LSB jumps.`, i, n);
      let j = i;
      while (j <= n) {
        t[j] += a[i-1];
        setCurrentStep(`Adding ${a[i-1]} to BIT[${j}]. Next position: ${j + lsb(j)}`);
        setBit([...t]); 
        await sleep(300);
        j += lsb(j);
      }
    }
    
    setBit(t);
    setCurrentStep('Fenwick Tree construction complete!');
    speakResult(`Fenwick Tree built successfully! Ready for O(log n) range queries and updates.`);
    
    setTimeout(() => {
      setIsBusy(false);
      setCurrentStep('');
      setOperation('');
    }, 2000);
  }, [speakOperation, speakStep, speakResult]);

  const rebuild = useCallback(() => {
    const nums = input.split(',').map(s=>parseInt(s.trim())).filter(n=>!isNaN(n));
    if (!nums.length) return;
    setArr(nums);
    build(nums);
  }, [input, build]);

  const prefixSum = useCallback(async (i: number) => {
    setIsBusy(true);
    setOperation(`Computing prefix sum for index ${i}`);
    speakOperation("Prefix Sum Query", `Computing prefix sum from index 1 to ${i} using Fenwick Tree. We'll traverse using LSB jumps to collect partial sums.`);
    
    let sum = 0; 
    const n = arr.length; 
    const t = [...bit];
    let j = Math.max(0, Math.min(n, i));
    const hl: number[] = [];
    let stepCount = 0;
    
    setCurrentStep(`Starting prefix sum query for index ${i}`);
    
    while (j > 0) {
      stepCount++;
      hl.push(j); 
      setHighlight([...hl]); 
      setCurrentStep(`Adding BIT[${j}] = ${t[j]} to sum. Current sum: ${sum + t[j]}`);
      speakStep("", `Adding value ${t[j]} from position ${j}. Next position: ${j - lsb(j)}.`, stepCount, Math.ceil(Math.log2(i + 1)));
      sum += t[j];
      j -= lsb(j);
      await sleep(600);
    }
    
    setCurrentStep(`Prefix sum query complete! Result: ${sum}`);
    speakResult(`Prefix sum from 1 to ${i} equals ${sum}. Query completed in O(log n) time.`);
    
    setTimeout(() => {
      setIsBusy(false);
      setCurrentStep('');
      setOperation('');
      setHighlight([]);
    }, 2000);
    
    return sum;
  }, [bit, arr.length, speakOperation, speakStep, speakResult]);

  const pointUpdate = useCallback(async (i: number, d: number) => {
    setIsBusy(true);
    setOperation(`Updating position ${i} by ${d}`);
    speakOperation("Point Update", `Updating element at position ${i} by adding ${d}. We'll propagate this change through all affected positions using LSB jumps.`);
    
    const n = arr.length; 
    const a = [...arr]; 
    a[i-1] += d; 
    setArr(a);
    const t = [...bit];
    let j = i;
    const hl: number[] = [];
    let stepCount = 0;
    
    setCurrentStep(`Updating array[${i}] by adding ${d}`);
    
    while (j <= n) {
      stepCount++;
      t[j] += d; 
      hl.push(j); 
      setHighlight([...hl]); 
      setBit([...t]); 
      setCurrentStep(`Updated BIT[${j}] by adding ${d}. Next position: ${j + lsb(j)}`);
      speakStep("", `Adding ${d} to position ${j}. Next position to update: ${j + lsb(j)}.`, stepCount, Math.ceil(Math.log2(n + 1)));
      await sleep(600);
      j += lsb(j);
    }
    
    setCurrentStep(`Point update complete! Position ${i} updated by ${d}`);
    speakResult(`Point update completed in O(log n) time. All affected positions in Fenwick Tree have been updated.`);
    
    setTimeout(() => {
      setIsBusy(false);
      setCurrentStep('');
      setOperation('');
      setHighlight([]);
    }, 2000);
  }, [bit, arr, speakOperation, speakStep, speakResult]);

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

      <div className="flex justify-center">
        <VisualizerControls
          showMemory={showMemory}
          onToggleMemory={setShowMemory}
          voiceEnabled={voiceEnabled}
          onToggleVoice={setVoiceEnabled}
        />
      </div>

      {showMemory && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MemoryLayout
            data={arr}
            title="Array (1..n)"
            baseAddress={8100}
            wordSize={4}
          />
          <MemoryLayout
            data={bit}
            title="Fenwick Tree (BIT)"
            baseAddress={8300}
            wordSize={4}
          />
        </div>
      )}

      {/* Step Panel */}
      {currentStep && (
        <div className="mt-3 p-2 bg-muted/20 rounded text-sm">{currentStep}</div>
      )}

      <div className="bg-muted/20 rounded-lg p-3 text-sm text-muted-foreground">
        <div>• Supports prefix sums and point updates in O(log n) using least significant bit jumps.</div>
        <div>• Time: Build O(n log n) shown (can be O(n)), Query/Update O(log n). Space: O(n).</div>
      </div>
    </div>
  );
}
