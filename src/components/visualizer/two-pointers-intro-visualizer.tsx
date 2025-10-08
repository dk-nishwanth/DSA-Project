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

export function TwoPointersIntroVisualizer() {
  const [arrayInput, setArrayInput] = useState('1,2,3,4,5,6,7,8,9');
  const [algorithm, setAlgorithm] = useState<'two-sum' | 'reverse' | 'palindrome' | 'remove-duplicates'>('two-sum');
  const [target, setTarget] = useState('10');
  const [array, setArray] = useState<ArrayElement[]>([]);
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

  const twoSumSorted = useCallback(async () => {
    const nums = parseArray();
    const targetNum = parseInt(target);
    
    speakOperation('Two Sum (Sorted Array)', `Finding two numbers that sum to ${targetNum}`);
    
    let left = 0;
    let right = nums.length - 1;
    setComparisons(0);
    
    while (left < right) {
      updatePointers(left, right);
      setStep(prev => prev + 1);
      setComparisons(prev => prev + 1);
      
      const currentSum = nums[left] + nums[right];
      
      speakStep('Check sum', `${nums[left]} + ${nums[right]} = ${currentSum}`, step, nums.length);
      await sleep(800);
      
      if (currentSum === targetNum) {
        // Found the pair
        array[left].isTarget = true;
        array[right].isTarget = true;
        setArray([...array]);
        
        setResult(`Found pair: [${nums[left]}, ${nums[right]}] at indices [${left}, ${right}]`);
        speakResult(`Found target pair: ${nums[left]} and ${nums[right]}`);
        return;
      } else if (currentSum < targetNum) {
        // Sum too small, move left pointer right
        array[left].isProcessed = true;
        left++;
        speakStep('Sum too small', `Moving left pointer right to increase sum`, step, nums.length);
      } else {
        // Sum too large, move right pointer left
        array[right].isProcessed = true;
        right--;
        speakStep('Sum too large', `Moving right pointer left to decrease sum`, step, nums.length);
      }
      
      await sleep(600);
    }
    
    setResult(`No pair found that sums to ${targetNum}`);
    speakResult(`No pair found that sums to ${targetNum}`);
  }, [parseArray, target, array, step, updatePointers, speakOperation, speakStep, speakResult]);

  const reverseArray = useCallback(async () => {
    const nums = parseArray();
    
    speakOperation('Reverse Array', `Reversing array using two pointers`);
    
    let left = 0;
    let right = nums.length - 1;
    setComparisons(0);
    
    while (left < right) {
      updatePointers(left, right);
      setStep(prev => prev + 1);
      setComparisons(prev => prev + 1);
      
      speakStep('Swap elements', `Swapping ${nums[left]} and ${nums[right]}`, step, Math.floor(nums.length / 2));
      await sleep(600);
      
      // Perform swap
      const temp = nums[left];
      nums[left] = nums[right];
      nums[right] = temp;
      
      // Update array display
      array[left].value = nums[left];
      array[right].value = nums[right];
      array[left].isProcessed = true;
      array[right].isProcessed = true;
      setArray([...array]);
      
      await sleep(500);
      
      left++;
      right--;
    }
    
    clearHighlights();
    setResult(`Array reversed: [${nums.join(', ')}]`);
    speakResult(`Array successfully reversed`);
  }, [parseArray, array, step, updatePointers, clearHighlights, speakOperation, speakStep, speakResult]);

  const checkPalindrome = useCallback(async () => {
    const str = arrayInput.replace(/,/g, '').toLowerCase();
    const chars = str.split('');
    
    speakOperation('Palindrome Check', `Checking if "${str}" is a palindrome`);
    
    // Convert to array elements for visualization
    const elements: ArrayElement[] = chars.map((char, index) => ({
      value: char.charCodeAt(0), // Use char code for display
      index,
      isLeftPointer: false,
      isRightPointer: false,
      isTarget: false,
      isProcessed: false,
    }));
    setArray(elements);
    
    let left = 0;
    let right = chars.length - 1;
    setComparisons(0);
    
    while (left < right) {
      updatePointers(left, right);
      setStep(prev => prev + 1);
      setComparisons(prev => prev + 1);
      
      speakStep('Compare characters', `Comparing '${chars[left]}' and '${chars[right]}'`, step, Math.floor(chars.length / 2));
      await sleep(700);
      
      if (chars[left] !== chars[right]) {
        // Not a palindrome
        array[left].isTarget = true;
        array[right].isTarget = true;
        setArray([...array]);
        
        setResult(`Not a palindrome: '${chars[left]}' ≠ '${chars[right]}'`);
        speakResult(`Not a palindrome: characters don't match`);
        return;
      }
      
      // Characters match
      array[left].isProcessed = true;
      array[right].isProcessed = true;
      setArray([...array]);
      
      left++;
      right--;
      
      await sleep(400);
    }
    
    clearHighlights();
    setResult(`"${str}" is a palindrome!`);
    speakResult(`String is a palindrome`);
  }, [arrayInput, array, step, updatePointers, clearHighlights, speakOperation, speakStep, speakResult]);

  const removeDuplicates = useCallback(async () => {
    const nums = parseArray().sort((a, b) => a - b); // Ensure sorted for this algorithm
    
    speakOperation('Remove Duplicates', `Removing duplicates from sorted array`);
    
    if (nums.length === 0) return;
    
    let writeIndex = 0; // Slow pointer
    let readIndex = 1;  // Fast pointer
    setComparisons(0);
    
    // Update array to show sorted version
    const sortedElements: ArrayElement[] = nums.map((value, index) => ({
      value,
      index,
      isLeftPointer: false,
      isRightPointer: false,
      isTarget: false,
      isProcessed: false,
    }));
    setArray(sortedElements);
    
    while (readIndex < nums.length) {
      updatePointers(writeIndex, readIndex);
      setStep(prev => prev + 1);
      setComparisons(prev => prev + 1);
      
      speakStep('Compare elements', `Comparing ${nums[writeIndex]} and ${nums[readIndex]}`, step, nums.length);
      await sleep(600);
      
      if (nums[writeIndex] !== nums[readIndex]) {
        // Found new unique element
        writeIndex++;
        nums[writeIndex] = nums[readIndex];
        
        // Update display
        array[writeIndex].value = nums[readIndex];
        array[writeIndex].isTarget = true;
        setArray([...array]);
        
        speakStep('New unique', `Found new unique element: ${nums[readIndex]}`, step, nums.length);
        await sleep(500);
        
        array[writeIndex].isTarget = false;
        array[writeIndex].isProcessed = true;
      } else {
        // Duplicate found
        array[readIndex].isProcessed = true;
        speakStep('Duplicate', `Skipping duplicate: ${nums[readIndex]}`, step, nums.length);
        await sleep(400);
      }
      
      readIndex++;
    }
    
    const uniqueLength = writeIndex + 1;
    const uniqueArray = nums.slice(0, uniqueLength);
    
    clearHighlights();
    setResult(`Removed duplicates. Unique elements: [${uniqueArray.join(', ')}] (length: ${uniqueLength})`);
    speakResult(`Removed duplicates. Found ${uniqueLength} unique elements`);
  }, [parseArray, array, step, updatePointers, clearHighlights, speakOperation, speakStep, speakResult]);

  const runAlgorithm = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setResult('');
    setStep(0);
    setComparisons(0);
    clearHighlights();
    
    try {
      if (algorithm === 'two-sum') {
        await twoSumSorted();
      } else if (algorithm === 'reverse') {
        await reverseArray();
      } else if (algorithm === 'palindrome') {
        await checkPalindrome();
      } else if (algorithm === 'remove-duplicates') {
        await removeDuplicates();
      }
    } finally {
      setIsRunning(false);
    }
  }, [isRunning, algorithm, twoSumSorted, reverseArray, checkPalindrome, removeDuplicates, clearHighlights]);

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
              <div className="font-bold">
                {algorithm === 'palindrome' ? String.fromCharCode(element.value) : element.value}
              </div>
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

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <Select value={algorithm} onValueChange={(v: 'two-sum' | 'reverse' | 'palindrome' | 'remove-duplicates') => setAlgorithm(v)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="two-sum">Two Sum</SelectItem>
            <SelectItem value="reverse">Reverse Array</SelectItem>
            <SelectItem value="palindrome">Palindrome Check</SelectItem>
            <SelectItem value="remove-duplicates">Remove Duplicates</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <span className="text-sm">
            {algorithm === 'palindrome' ? 'String:' : 'Array:'}
          </span>
          <Input 
            className="w-48" 
            value={arrayInput} 
            onChange={(e) => setArrayInput(e.target.value)}
            placeholder={algorithm === 'palindrome' ? 'racecar' : '1,2,3,4,5,6,7,8,9'}
          />
        </div>

        {algorithm === 'two-sum' && (
          <div className="flex items-center gap-2">
            <span className="text-sm">Target:</span>
            <Input 
              className="w-20" 
              value={target} 
              onChange={(e) => setTarget(e.target.value)}
              placeholder="10"
            />
          </div>
        )}

        <Button onClick={runAlgorithm} disabled={isRunning}>
          {isRunning ? 'Running...' : 'Run Algorithm'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 p-4 bg-gradient-visualization rounded-xl border-2">
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-sm font-semibold mb-4">
                {algorithm.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Algorithm
              </h3>
              <div className="min-h-[100px] flex items-center justify-center">
                {renderArray()}
              </div>
            </div>
            
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
              <div><strong>Steps:</strong> {step}</div>
              <div><strong>Comparisons:</strong> {comparisons}</div>
              <div><strong>Left Pointer:</strong> {leftPointer}</div>
              <div><strong>Right Pointer:</strong> {rightPointer}</div>
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
                <span>Target/Result</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-gray-300"></div>
                <span>Processed</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-muted/20 rounded-xl border">
            <h3 className="text-sm font-semibold mb-2">Algorithm Info</h3>
            <div className="text-xs space-y-1">
              {algorithm === 'two-sum' && (
                <>
                  <div><strong>Time:</strong> O(n)</div>
                  <div><strong>Space:</strong> O(1)</div>
                  <div><strong>Requirement:</strong> Sorted array</div>
                </>
              )}
              {algorithm === 'reverse' && (
                <>
                  <div><strong>Time:</strong> O(n)</div>
                  <div><strong>Space:</strong> O(1)</div>
                  <div><strong>Swaps:</strong> n/2</div>
                </>
              )}
              {algorithm === 'palindrome' && (
                <>
                  <div><strong>Time:</strong> O(n)</div>
                  <div><strong>Space:</strong> O(1)</div>
                  <div><strong>Comparisons:</strong> ≤ n/2</div>
                </>
              )}
              {algorithm === 'remove-duplicates' && (
                <>
                  <div><strong>Time:</strong> O(n)</div>
                  <div><strong>Space:</strong> O(1)</div>
                  <div><strong>Requirement:</strong> Sorted array</div>
                </>
              )}
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
          baseAddress={14000}
          wordSize={4}
        />
      )}

      <div className="bg-muted/20 rounded-lg p-4 text-sm space-y-2">
        <div className="font-semibold text-primary">Two Pointers Technique:</div>
        <div>• <strong>Pattern:</strong> Use two pointers moving towards each other or in same direction</div>
        <div>• <strong>Efficiency:</strong> Often reduces O(n²) brute force to O(n) solution</div>
        <div>• <strong>Common Uses:</strong> Sorted arrays, palindromes, pair finding, partitioning</div>
        <div>• <strong>Key Insight:</strong> Eliminate unnecessary comparisons by strategic pointer movement</div>
      </div>
    </div>
  );
}