import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVoiceExplain } from '@/hooks/useVoiceExplain';

export function BucketSortVisualizer() {
  const [arr, setArr] = useState<number[]>([0.78, 0.17, 0.39, 0.26, 0.72, 0.94, 0.21, 0.12, 0.23, 0.68]);
  const [input, setInput] = useState('0.78,0.17,0.39,0.26,0.72,0.94,0.21,0.12,0.23,0.68');
  const [isSorting, setIsSorting] = useState(false);
  const [buckets, setBuckets] = useState<number[][]>(Array.from({length:10},()=>[]));
  const [showMemory, setShowMemory] = useState(false);
  
  const [voiceText, setVoiceText] = useState('');
  const { enabled: voiceEnabled, setEnabled: setVoiceEnabled } = useVoiceExplain(voiceText);

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const updateFromInput = useCallback(() => {
    const nums = input.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n) && n >= 0 && n <= 1);
    if (nums.length) setArr(nums);
  }, [input]);

  const insertionSort = (bucket: number[]) => {
    for (let i = 1; i < bucket.length; i++) {
      const key = bucket[i];
      let j = i - 1;
      while (j >= 0 && bucket[j] > key) {
        bucket[j + 1] = bucket[j];
        j--;
      }
      bucket[j + 1] = key;
    }
  };

  const run = useCallback(async () => {
    if (isSorting) return;
    setIsSorting(true);
    
    if (voiceEnabled) {
      setVoiceText("Starting bucket sort. We'll distribute elements into buckets and sort each bucket.");
    }

    const n = arr.length;
    const bucketArray: number[][] = Array.from({length: n}, () => []);

    // Distribute elements into buckets
    for (let i = 0; i < n; i++) {
      const bucketIndex = Math.floor(n * arr[i]);
      bucketArray[bucketIndex].push(arr[i]);
      setBuckets([...bucketArray]);
      await sleep(300);
    }

    // Sort individual buckets
    for (let i = 0; i < n; i++) {
      if (bucketArray[i].length > 0) {
        insertionSort(bucketArray[i]);
        setBuckets([...bucketArray]);
        await sleep(200);
      }
    }

    // Concatenate all buckets
    const result: number[] = [];
    for (let i = 0; i < n; i++) {
      result.push(...bucketArray[i]);
    }
    
    setArr(result);
    setBuckets(Array.from({length: n}, () => []));
    setIsSorting(false);
    
    if (voiceEnabled) {
      setVoiceText("Bucket sort completed! All elements are now sorted.");
    }
  }, [isSorting, arr, voiceEnabled, setVoiceText]);

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Bucket Sort Visualizer</h2>
        <p className="text-muted-foreground">
          Watch how bucket sort distributes elements into buckets and sorts them individually
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <Input 
          className="w-72" 
          value={input} 
          onChange={e => setInput(e.target.value)}
          placeholder="Enter decimal numbers (0-1) separated by commas"
        />
        <Button onClick={updateFromInput} disabled={isSorting}>Update</Button>
        <Button onClick={run} disabled={isSorting}>Run Bucket Sort</Button>
      </div>

      {/* Array Visualization */}
      <div className="p-6 bg-gradient-visualization rounded-xl border-2 border-primary/20">
        <h3 className="text-lg font-semibold mb-4 text-center">Array Visualization</h3>
        <div className="flex gap-2 items-end justify-center">
          {arr.map((v, i) => (
            <div key={i} className="w-16 text-center text-xs font-mono border rounded bg-card p-2">
              {v.toFixed(2)}
            </div>
          ))}
        </div>
      </div>

      {/* Buckets Visualization */}
      <div className="p-6 bg-gradient-visualization rounded-xl border-2 border-primary/20">
        <h3 className="text-lg font-semibold mb-4 text-center">Buckets</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {buckets.map((bucket, bucketIndex) => (
            <div key={bucketIndex} className="p-2 border rounded bg-card">
              <div className="text-xs text-muted-foreground mb-1">Bucket {bucketIndex}</div>
              <div className="flex flex-col gap-1">
                {bucket.map((value, idx) => (
                  <div key={idx} className="px-2 py-1 border rounded text-xs font-mono bg-blue-100">
                    {value.toFixed(2)}
                  </div>
                ))}
                {bucket.length === 0 && (
                  <div className="px-2 py-1 text-xs text-muted-foreground">Empty</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Algorithm Info */}
      <div className="bg-card border rounded-lg p-4">
        <h4 className="font-semibold mb-2">How Bucket Sort Works:</h4>
        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
          <li>Create n empty buckets (where n is the number of elements)</li>
          <li>Distribute elements into buckets based on their value range</li>
          <li>Sort individual buckets using insertion sort</li>
          <li>Concatenate all sorted buckets to get the final result</li>
          <li>Works best with uniformly distributed data</li>
          <li>Time Complexity: O(n + k) average, O(n²) worst case</li>
          <li>Space Complexity: O(n + k) where k is the number of buckets</li>
        </ol>
      </div>

      {/* Memory Layout */}
      {showMemory && (
        <MemoryLayout
          title="Array Memory Layout"
          data={arr}
          baseAddress={0x7000}
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
