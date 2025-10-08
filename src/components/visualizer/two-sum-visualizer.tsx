import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

interface ArrayElement {
  value: number;
  index: number;
  isLeftPointer: boolean;
  isRightPointer: boolean;
  isTarget: boolean;
  isProcessed: boolean;
}

export function TwoSumVisualizer() {
  const [arrayInput, setArrayInput] = useState('2,7,11,15');
  const [target, setTarget] = useState('9');
  const [approach, setApproach] = useState<'brute-force' | 'hash-map' | 'two-pointers'>('two-pointers');
  const [array, setArray] = useState<ArrayElement[]>([]);
  const [hashMap, setHashMap] = useState<Map<number, number>>(new Map());
  const [leftPointer, setLeftPointer] = useState(0);
  const [rightPointer, setRightPointer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showMemory, setShowMemory] = useState(false);
  const [result, setResult] = useState<string>('');
  const [step, setStep] = useState(0);
  const [comparisons, setComparisons] = useState(0);

  const {
    voiceEnabled,
    setVoiceEnabled,
    speakOperation,
    speakStep,
    speakResult,
  } = useVisualizerVoice({ minInterval: 600 });

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const parseArray = useCallback(() => {
    const nums = arrayInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    const elements: ArrayElement[] = nums.map((value, index) => ({
      value,
      index,
      isLeftPointer: false,
      isRightPointer: false,
      isTarget: false,
      isProcessed: false,
    }));
    setArray(elements);
    return nums;
  }, [arrayInput]);

  const clearHighlights = useCallback(() => {
    setArray(prev => prev.map(element => ({
      ...element,
      isLeftPointer: false,
      isRightPointer: false,
      isTarget: false,
    })));
    setHashMap(new Map());
  }, []);

  const updatePointers = useCallback((left: number, right: number) => {
    setLeftPointer(left);
    setRightPointer(right);
    setArray(prev => prev.map((element, index) => ({
      ...element,
      isLeftPointer: index === left,
      isRightPointer: index === right,
    })));
  }, []);

  const bruteForceApproach = useCallback(async () => {
    const nums = parseArray();
    const targetNum = parseInt(target);
    
    speakOperation('Brute Force Two Sum', `Finding two numbers that sum to ${targetNum} using nested loops`);
    
    setComparisons(0);
    
    for (let i = 0; i < nums.length; i++) {
      array[i].isLeftPointer = true;
      setArray([...array]);
      
      speakStep('Outer loop', `Checking element at index ${i}: ${nums[i]}`, i, nums.length);
      await sleep(500);
      
      for (let j = i + 1; j < nums.length; j++) {
        array[j].isRightPointer = true;
        setArray([...array]);
        setComparisons(prev => prev + 1);
        
        const sum = nums[i] + nums[j];
        speakStep('Inner loop', `${nums[i]} + ${nums[j]} = ${sum}`, j, nums.length);
        await sleep(400);
        
        if (sum === targetNum) {
          array[i].isTarget = true;
          array[j].isTarget = true;
          setArray([...array]);
          
          setResult(`Found pair: [${nums[i]}, ${nums[j]}] at indices [${i}, ${j}]`);
          speakResult(`Found target pair: ${nums[i]} and ${nums[j]} at indices ${i} and ${j}`);
          return;
        }
        
        array[j].isRightPointer = false;
        array[j].isProcessed = true;
        setArray([...array]);
        await sleep(200);
      }
      
      array[i].isLeftPointer = false;
      array[i].isProcessed = true;
      setArray([...array]);
    }
    
    setResult(`No pair found that sums to ${targetNum}`);
    speakResult(`No pair found that sums to ${targetNum}`);
  }, [parseArray, target, array, speakOperation, speakStep, speakResult]);

  const hashMapApproach = useCallback(async () => {
    const nums = parseArray();
    const targetNum = parseInt(target);
    
    speakOperation('Hash Map Two Sum', `Finding two numbers using hash map for O(n) solution`);
    
    const map = new Map<number, number>();
    setComparisons(0);
    
    for (let i = 0; i < nums.length; i++) {
      array[i].isLeftPointer = true;
      setArray([...array]);
      setComparisons(prev => prev + 1);
      
      const complement = targetNum - nums[i];
      
      speakStep('Check complement', `Looking for complement ${complement} of ${nums[i]}`, i, nums.length);
      await sleep(600);
      
      if (map.has(complement)) {
        const complementIndex = map.get(complement)!;
        array[complementIndex].isTarget = true;
        array[i].isTarget = true;
        setArray([...array]);
        
        setResult(`Found pair: [${nums[complementIndex]}, ${nums[i]}] at indices [${complementIndex}, ${i}]`);
        speakResult(`Found target pair using hash map: ${nums[complementIndex]} and ${nums[i]}`);
        return;
      }
      
      map.set(nums[i], i);
      setHashMap(new Map(map));
      
      speakStep('Store in map', `Stored ${nums[i]} at index ${i} in hash map`, i, nums.length);
      await sleep(400);
      
      array[i].isLeftPointer = false;
      array[i].isProcessed = true;
      setArray([...array]);
    }
    
    setResult(`No pair found that sums to ${targetNum}`);
    speakResult(`No pair found that sums to ${targetNum}`);
  }, [parseArray, target, array, speakOperation, speakStep, speakResult]);

  const twoPointersApproach = useCallback(async () => {
    const nums = parseArray();
    const targetNum = parseInt(target);
    
    // Sort array for two pointers approach
    const sortedNums = nums.map((value, index) => ({ value, originalIndex: index }))
                          .sort((a, b) => a.value - b.value);
    
    const sortedArray = sortedNums.map(item => item.value);
    
    speakOperation('Two Pointers Two Sum', `Finding two numbers using sorted array and two pointers`);
    
    let left = 0;
    let right = sortedArray.length - 1;
    setComparisons(0);
    
    // Update array to show sorted version
    const sortedElements: ArrayElement[] = sortedArray.map((value, index) => ({
      value,
      index,
      isLeftPointer: false,
      isRightPointer: false,
      isTarget: false,
      isProcessed: false,
    }));
    setArray(sortedElements);
    
    while (left < right) {
      updatePointers(left, right);
      setComparisons(prev => prev + 1);
      
      const currentSum = sortedArray[left] + sortedArray[right];
      
      speakStep('Check sum', `${sortedArray[left]} + ${sortedArray[right]} = ${currentSum}`, step, sortedArray.length);
      await sleep(700);
      
      if (currentSum === targetNum) {
        array[left].isTarget = true;
        array[right].isTarget = true;
        setArray([...array]);
        
        const originalLeft = sortedNums[left].originalIndex;
        const originalRight = sortedNums[right].originalIndex;
        
        setResult(`Found pair: [${sortedArray[left]}, ${sortedArray[right]}] at original indices [${originalLeft}, ${originalRight}]`);
        speakResult(`Found target pair using two pointers: ${sortedArray[left]} and ${sortedArray[right]}`);
        return;
      } else if (currentSum < targetNum) {
        array[left].isProcessed = true;
        left++;
        speakStep('Sum too small', `Moving left pointer right to increase sum`, step, sortedArray.length);
      } else {
        array[right].isProcessed = true;
        right--;
        speakStep('Sum too large', `Moving right pointer left to decrease sum`, step, sortedArray.length);
      }
      
      setArray([...array]);
      setStep(prev => prev + 1);
      await sleep(500);
    }
    
    setResult(`No pair found that sums to ${targetNum}`);
    speakResult(`No pair found that sums to ${targetNum}`);
  }, [parseArray, target, array, step, updatePointers, speakOperation, speakStep, speakResult]);

  const runAlgorithm = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setResult('');
    setStep(0);
    setComparisons(0);
    clearHighlights();
    
    try {
      if (approach === 'brute-force') {
        await bruteForceApproach();
      } else if (approach === 'hash-map') {
        await hashMapApproach();
      } else if (approach === 'two-pointers') {
        await twoPointersApproach();
      }
    } finally {
      setIsRunning(false);
    }
  }, [isRunning, approach, bruteForceApproach, hashMapApproach, twoPointersApproach, clearHighlights]);

  const renderArray = () => (
    <div className="flex flex-wrap gap-2 justify-center">
      {array.map((element, index) => (
        <div key={index} className="relative">
          <div
            className={`w-12 h-12 flex items-center justify-center rounded border-2 font-mono text-sm transition-all duration-300 ${
              element.isTarget
                ? 'bg-green-200 border-green-400 dark:bg-green-800 dark:border-green-600'
                : element.isLeftPointer
                ? 'bg-blue-200 border-blue-400 dark:bg-blue-800 dark:border-blue-600'
                : element.isRightPointer
                ? 'bg-red-200 border-red-400 dark:bg-red-800 dark:border-red-600'
                : element.isProcessed
                ? 'bg-gray-200 border-gray-400 dark:bg-gray-700 dark:border-gray-500'
                : 'bg-white border-gray-300 dark:bg-gray-900 dark:border-gray-600'
            }`}
          >
            <div className="text-center">
              <div className="font-bold">{element.value}</div>
            </div>
          </div>
          <div className="text-xs text-center text-muted-foreground mt-1">{index}</div>
          
          {/* Pointer labels */}
          {element.isLeftPointer && (
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-blue-600">
              L
            </div>
          )}
          {element.isRightPointer && (
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-red-600">
              R
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderHashMap = () => {
    if (hashMap.size === 0) return null;
    
    return (
      <div className="mt-4">
        <h3 className="text-sm font-semibold mb-2">Hash Map</h3>
        <div className="grid grid-cols-4 gap-2">
          {Array.from(hashMap.entries()).map(([value, index]) => (
            <div key={value} className="p-2 rounded border bg-blue-100 dark:bg-blue-900/30 text-xs font-mono text-center">
              <div className="font-bold">{value}</div>
              <div className="text-muted-foreground">idx: {index}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <div className="flex items-center gap-2">
          <span className="text-sm">Array:</span>
          <Input 
            className="w-32" 
            value={arrayInput} 
            onChange={(e) => setArrayInput(e.target.value)}
            placeholder="2,7,11,15"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm">Target:</span>
          <Input 
            className="w-20" 
            value={target} 
            onChange={(e) => setTarget(e.target.value)}
            placeholder="9"
          />
        </div>

        <Select value={approach} onValueChange={(v: 'brute-force' | 'hash-map' | 'two-pointers') => setApproach(v)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="brute-force">Brute Force O(n²)</SelectItem>
            <SelectItem value="hash-map">Hash Map O(n)</SelectItem>
            <SelectItem value="two-pointers">Two Pointers O(n log n)</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={runAlgorithm} disabled={isRunning}>
          {isRunning ? 'Running...' : 'Find Two Sum'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 p-4 bg-gradient-visualization rounded-xl border-2">
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-sm font-semibold mb-4">
                Two Sum - {approach.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Approach
              </h3>
              <div className="min-h-[100px] flex items-center justify-center">
                {renderArray()}
              </div>
            </div>
            
            {approach === 'hash-map' && renderHashMap()}
            
            {result && (
              <div className="text-center p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <div className="text-sm font-semibold text-green-700 dark:text-green-300">
                  {result}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-muted/20 rounded-xl border">
            <h3 className="text-sm font-semibold mb-2">Algorithm Stats</h3>
            <div className="text-xs space-y-1">
              <div><strong>Approach:</strong> {approach.replace('-', ' ')}</div>
              <div><strong>Comparisons:</strong> {comparisons}</div>
              <div><strong>Target Sum:</strong> {target}</div>
              {approach === 'two-pointers' && (
                <>
                  <div><strong>Left Pointer:</strong> {leftPointer}</div>
                  <div><strong>Right Pointer:</strong> {rightPointer}</div>
                </>
              )}
            </div>
          </div>
          
          <div className="p-4 bg-muted/20 rounded-xl border">
            <h3 className="text-sm font-semibold mb-2">Complexity</h3>
            <div className="text-xs space-y-1">
              {approach === 'brute-force' && (
                <>
                  <div><strong>Time:</strong> O(n²)</div>
                  <div><strong>Space:</strong> O(1)</div>
                </>
              )}
              {approach === 'hash-map' && (
                <>
                  <div><strong>Time:</strong> O(n)</div>
                  <div><strong>Space:</strong> O(n)</div>
                </>
              )}
              {approach === 'two-pointers' && (
                <>
                  <div><strong>Time:</strong> O(n log n)</div>
                  <div><strong>Space:</strong> O(1)</div>
                  <div><strong>Note:</strong> Requires sorted array</div>
                </>
              )}
            </div>
          </div>
          
          <div className="p-4 bg-muted/20 rounded-xl border">
            <h3 className="text-sm font-semibold mb-2">Legend</h3>
            <div className="text-xs space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-300"></div>
                <span>Left Pointer (L)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-300"></div>
                <span>Right Pointer (R)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-300"></div>
                <span>Target Pair Found</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-gray-300"></div>
                <span>Processed</span>
              </div>
            </div>
          </div>
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
        <MemoryLayout
          data={array}
          title="Array Memory Layout"
          baseAddress={16000}
          wordSize={4}
        />
      )}

      <div className="bg-muted/20 rounded-lg p-4 text-sm space-y-2">
        <div className="font-semibold text-primary">Two Sum Problem:</div>
        <div>• <strong>Problem:</strong> Find two numbers in array that add up to target sum</div>
        <div>• <strong>Brute Force:</strong> Check all pairs - O(n²) time, O(1) space</div>
        <div>• <strong>Hash Map:</strong> Store complements - O(n) time, O(n) space</div>
        <div>• <strong>Two Pointers:</strong> Use sorted array - O(n log n) time, O(1) space</div>
        <div>• <strong>Applications:</strong> Pair finding, complement search, optimization problems</div>
      </div>
    </div>
  );
}