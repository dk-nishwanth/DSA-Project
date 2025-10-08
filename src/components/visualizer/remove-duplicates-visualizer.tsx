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
  isWritePointer: boolean;
  isReadPointer: boolean;
  isUnique: boolean;
  isDuplicate: boolean;
  isProcessed: boolean;
}

export function RemoveDuplicatesVisualizer() {
  const [arrayInput, setArrayInput] = useState('1,1,2,2,2,3,4,4,5');
  const [approach, setApproach] = useState<'two-pointers' | 'brute-force' | 'set-based'>('two-pointers');
  const [array, setArray] = useState<ArrayElement[]>([]);
  const [writePointer, setWritePointer] = useState(0);
  const [readPointer, setReadPointer] = useState(0);
  const [uniqueCount, setUniqueCount] = useState(0);
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
    // Sort to ensure it's a sorted array
    nums.sort((a, b) => a - b);
    const elements: ArrayElement[] = nums.map((value, index) => ({
      value,
      index,
      isWritePointer: false,
      isReadPointer: false,
      isUnique: false,
      isDuplicate: false,
      isProcessed: false,
    }));
    setArray(elements);
    return nums;
  }, [arrayInput]);

  const clearHighlights = useCallback(() => {
    setArray(prev => prev.map(element => ({
      ...element,
      isWritePointer: false,
      isReadPointer: false,
      isUnique: false,
      isDuplicate: false,
    })));
  }, []);

  const updatePointers = useCallback((write: number, read: number) => {
    setWritePointer(write);
    setReadPointer(read);
    setArray(prev => prev.map((element, index) => ({
      ...element,
      isWritePointer: index === write,
      isReadPointer: index === read,
    })));
  }, []);

  const twoPointersApproach = useCallback(async () => {
    const nums = parseArray();
    
    speakOperation('Two Pointers Remove Duplicates', `Removing duplicates from sorted array using two pointers`);
    
    if (nums.length === 0) {
      setResult('Array is empty');
      return;
    }
    
    let writeIndex = 0; // Slow pointer for unique elements
    let readIndex = 1;  // Fast pointer for scanning
    
    setComparisons(0);
    setUniqueCount(1); // First element is always unique
    
    // Mark first element as unique
    array[0].isUnique = true;
    setArray([...array]);
    
    speakStep('Initialize', `First element ${nums[0]} is always unique`, 0, nums.length);
    await sleep(800);
    
    while (readIndex < nums.length) {
      updatePointers(writeIndex, readIndex);
      setComparisons(prev => prev + 1);
      
      speakStep('Compare', `Comparing ${nums[writeIndex]} with ${nums[readIndex]}`, readIndex, nums.length);
      await sleep(700);
      
      if (nums[writeIndex] !== nums[readIndex]) {
        // Found new unique element
        writeIndex++;
        nums[writeIndex] = nums[readIndex];
        
        // Update array display
        array[writeIndex].value = nums[readIndex];
        array[writeIndex].isUnique = true;
        array[readIndex].isProcessed = true;
        setArray([...array]);
        
        setUniqueCount(writeIndex + 1);
        
        speakStep('New unique', `Found new unique element: ${nums[readIndex]}, moved to position ${writeIndex}`, readIndex, nums.length);
        await sleep(600);
      } else {
        // Duplicate found
        array[readIndex].isDuplicate = true;
        array[readIndex].isProcessed = true;
        setArray([...array]);
        
        speakStep('Duplicate', `Skipping duplicate: ${nums[readIndex]}`, readIndex, nums.length);
        await sleep(500);
      }
      
      readIndex++;
      setStep(prev => prev + 1);
    }
    
    clearHighlights();
    
    // Mark remaining positions as processed
    for (let i = writeIndex + 1; i < array.length; i++) {
      array[i].isProcessed = true;
    }
    setArray([...array]);
    
    const uniqueArray = nums.slice(0, writeIndex + 1);
    setResult(`Removed duplicates. Unique elements: [${uniqueArray.join(', ')}]. New length: ${writeIndex + 1}`);
    speakResult(`Removed duplicates. Found ${writeIndex + 1} unique elements`);
  }, [parseArray, array, updatePointers, clearHighlights, speakOperation, speakStep, speakResult]);

  const bruteForceApproach = useCallback(async () => {
    const nums = parseArray();
    
    speakOperation('Brute Force Remove Duplicates', `Removing duplicates using nested loops`);
    
    const uniqueElements: number[] = [];
    setComparisons(0);
    
    for (let i = 0; i < nums.length; i++) {
      array[i].isReadPointer = true;
      setArray([...array]);
      
      speakStep('Check element', `Checking element ${nums[i]} at index ${i}`, i, nums.length);
      await sleep(500);
      
      let isDuplicate = false;
      
      // Check if element already exists in unique array
      for (let j = 0; j < uniqueElements.length; j++) {
        setComparisons(prev => prev + 1);
        if (uniqueElements[j] === nums[i]) {
          isDuplicate = true;
          break;
        }
      }
      
      if (!isDuplicate) {
        uniqueElements.push(nums[i]);
        array[i].isUnique = true;
        speakStep('Add unique', `Added ${nums[i]} to unique array`, i, nums.length);
      } else {
        array[i].isDuplicate = true;
        speakStep('Skip duplicate', `Skipped duplicate ${nums[i]}`, i, nums.length);
      }
      
      array[i].isReadPointer = false;
      array[i].isProcessed = true;
      setArray([...array]);
      await sleep(400);
    }
    
    setUniqueCount(uniqueElements.length);
    setResult(`Brute force result: [${uniqueElements.join(', ')}]. Length: ${uniqueElements.length}`);
    speakResult(`Brute force found ${uniqueElements.length} unique elements`);
  }, [parseArray, array, speakOperation, speakStep, speakResult]);

  const setBasedApproach = useCallback(async () => {
    const nums = parseArray();
    
    speakOperation('Set-Based Remove Duplicates', `Using Set data structure to remove duplicates`);
    
    const uniqueSet = new Set<number>();
    setComparisons(0);
    
    for (let i = 0; i < nums.length; i++) {
      array[i].isReadPointer = true;
      setArray([...array]);
      
      speakStep('Process element', `Processing element ${nums[i]}`, i, nums.length);
      await sleep(500);
      
      if (uniqueSet.has(nums[i])) {
        array[i].isDuplicate = true;
        speakStep('Duplicate found', `${nums[i]} already in set`, i, nums.length);
      } else {
        uniqueSet.add(nums[i]);
        array[i].isUnique = true;
        speakStep('Add to set', `Added ${nums[i]} to set`, i, nums.length);
      }
      
      array[i].isReadPointer = false;
      array[i].isProcessed = true;
      setArray([...array]);
      setComparisons(prev => prev + 1);
      await sleep(400);
    }
    
    const uniqueArray = Array.from(uniqueSet).sort((a, b) => a - b);
    setUniqueCount(uniqueArray.length);
    setResult(`Set-based result: [${uniqueArray.join(', ')}]. Length: ${uniqueArray.length}`);
    speakResult(`Set-based approach found ${uniqueArray.length} unique elements`);
  }, [parseArray, array, speakOperation, speakStep, speakResult]);

  const runAlgorithm = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setResult('');
    setStep(0);
    setComparisons(0);
    setUniqueCount(0);
    clearHighlights();
    
    try {
      if (approach === 'two-pointers') {
        await twoPointersApproach();
      } else if (approach === 'brute-force') {
        await bruteForceApproach();
      } else if (approach === 'set-based') {
        await setBasedApproach();
      }
    } finally {
      setIsRunning(false);
    }
  }, [isRunning, approach, twoPointersApproach, bruteForceApproach, setBasedApproach, clearHighlights]);

  const renderArray = () => (
    <div className="flex flex-wrap gap-2 justify-center">
      {array.map((element, index) => (
        <div key={index} className="relative">
          <div
            className={`w-12 h-12 flex items-center justify-center rounded border-2 font-mono text-sm transition-all duration-300 ${
              element.isUnique
                ? 'bg-green-200 border-green-400 dark:bg-green-800 dark:border-green-600'
                : element.isDuplicate
                ? 'bg-red-200 border-red-400 dark:bg-red-800 dark:border-red-600'
                : element.isWritePointer
                ? 'bg-blue-200 border-blue-400 dark:bg-blue-800 dark:border-blue-600'
                : element.isReadPointer
                ? 'bg-yellow-200 border-yellow-400 dark:bg-yellow-800 dark:border-yellow-600'
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
          {element.isWritePointer && (
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-blue-600">
              W
            </div>
          )}
          {element.isReadPointer && (
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-yellow-600">
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
        <div className="flex items-center gap-2">
          <span className="text-sm">Array:</span>
          <Input 
            className="w-48" 
            value={arrayInput} 
            onChange={(e) => setArrayInput(e.target.value)}
            placeholder="1,1,2,2,2,3,4,4,5"
          />
        </div>

        <Select value={approach} onValueChange={(v: 'two-pointers' | 'brute-force' | 'set-based') => setApproach(v)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="two-pointers">Two Pointers O(n)</SelectItem>
            <SelectItem value="brute-force">Brute Force O(n²)</SelectItem>
            <SelectItem value="set-based">Set-Based O(n)</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={runAlgorithm} disabled={isRunning}>
          {isRunning ? 'Running...' : 'Remove Duplicates'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 p-4 bg-gradient-visualization rounded-xl border-2">
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-sm font-semibold mb-4">
                Remove Duplicates - {approach.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Approach
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
              <div><strong>Approach:</strong> {approach.replace('-', ' ')}</div>
              <div><strong>Comparisons:</strong> {comparisons}</div>
              <div><strong>Unique Count:</strong> {uniqueCount}</div>
              {approach === 'two-pointers' && (
                <>
                  <div><strong>Write Pointer:</strong> {writePointer}</div>
                  <div><strong>Read Pointer:</strong> {readPointer}</div>
                </>
              )}
            </div>
          </div>
          
          <div className="p-4 bg-muted/20 rounded-xl border">
            <h3 className="text-sm font-semibold mb-2">Complexity</h3>
            <div className="text-xs space-y-1">
              {approach === 'two-pointers' && (
                <>
                  <div><strong>Time:</strong> O(n)</div>
                  <div><strong>Space:</strong> O(1)</div>
                  <div><strong>Note:</strong> In-place modification</div>
                </>
              )}
              {approach === 'brute-force' && (
                <>
                  <div><strong>Time:</strong> O(n²)</div>
                  <div><strong>Space:</strong> O(n)</div>
                  <div><strong>Note:</strong> Inefficient for large arrays</div>
                </>
              )}
              {approach === 'set-based' && (
                <>
                  <div><strong>Time:</strong> O(n)</div>
                  <div><strong>Space:</strong> O(n)</div>
                  <div><strong>Note:</strong> Uses extra space for Set</div>
                </>
              )}
            </div>
          </div>
          
          <div className="p-4 bg-muted/20 rounded-xl border">
            <h3 className="text-sm font-semibold mb-2">Legend</h3>
            <div className="text-xs space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-300"></div>
                <span>Write Pointer (W)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-yellow-300"></div>
                <span>Read Pointer (R)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-300"></div>
                <span>Unique Element</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-300"></div>
                <span>Duplicate Element</span>
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
          baseAddress={19000}
          wordSize={4}
        />
      )}

      <div className="bg-muted/20 rounded-lg p-4 text-sm space-y-2">
        <div className="font-semibold text-primary">Remove Duplicates Problem:</div>
        <div>• <strong>Problem:</strong> Remove duplicates from sorted array in-place</div>
        <div>• <strong>Two Pointers:</strong> Write pointer for unique elements, read pointer for scanning - O(n) time, O(1) space</div>
        <div>• <strong>Brute Force:</strong> Check each element against all previous - O(n²) time, O(n) space</div>
        <div>• <strong>Set-Based:</strong> Use Set data structure - O(n) time, O(n) space</div>
        <div>• <strong>Applications:</strong> Data cleaning, array preprocessing, memory optimization</div>
      </div>
    </div>
  );
}