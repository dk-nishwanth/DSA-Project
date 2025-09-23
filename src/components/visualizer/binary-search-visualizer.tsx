import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, RotateCcw, ArrowUp, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';
import { toast } from 'sonner';

export function BinarySearchVisualizer() {
  const [array, setArray] = useState<number[]>([1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25]);
  const [target, setTarget] = useState(15);
  const [left, setLeft] = useState(-1);
  const [right, setRight] = useState(-1);
  const [mid, setMid] = useState(-1);
  const [foundIndex, setFoundIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const [comparisons, setComparisons] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [showMemory, setShowMemory] = useState(false);
  const [inputArray, setInputArray] = useState('1,3,5,7,9,11,13,15,17,19,21,23,25');
  const [inputTarget, setInputTarget] = useState('15');
  const [searchHistory, setSearchHistory] = useState<{left: number, right: number, mid: number, comparison: string}[]>([]);
  
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

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const binarySearch = useCallback(async () => {
    if (isSearching) return;
    
    setIsSearching(true);
    setLeft(-1);
    setRight(-1);
    setMid(-1);
    setFoundIndex(-1);
    setComparisons(0);
    setSearchHistory([]);
    
    speakOperation("Binary Search", `Starting binary search for ${target} in sorted array. We'll divide the search space in half at each step.`);
    setCurrentStep(`Searching for ${target} in sorted array...`);
    
    let leftPtr = 0;
    let rightPtr = array.length - 1;
    let compCount = 0;
    const history: {left: number, right: number, mid: number, comparison: string}[] = [];
    
    setLeft(leftPtr);
    setRight(rightPtr);
    
    while (leftPtr <= rightPtr) {
      const midPtr = Math.floor((leftPtr + rightPtr) / 2);
      setMid(midPtr);
      compCount++;
      setComparisons(compCount);
      
      const comparison = array[midPtr] === target ? 'equal' : array[midPtr] < target ? 'less' : 'greater';
      history.push({ left: leftPtr, right: rightPtr, mid: midPtr, comparison });
      setSearchHistory([...history]);
      
      setCurrentStep(`Checking middle: array[${midPtr}] = ${array[midPtr]}`);
      speakStep("", `Checking middle element at index ${midPtr}. Value is ${array[midPtr]}. ${array[midPtr] === target ? 'Found the target!' : array[midPtr] < target ? 'Target is larger, search right half.' : 'Target is smaller, search left half.'}`, compCount, Math.ceil(Math.log2(array.length)) + 1);
      
      await sleep(1200);
      
      if (array[midPtr] === target) {
        setFoundIndex(midPtr);
        setCurrentStep(`Found ${target} at index ${midPtr}!`);
        speakResult(`Success! Found ${target} at index ${midPtr} after ${compCount} comparisons. Binary search completed in O(log n) time.`);
        toast.success(`Found ${target} at index ${midPtr}`);
        setIsSearching(false);
        return;
      } else if (array[midPtr] < target) {
        leftPtr = midPtr + 1;
        setLeft(leftPtr);
        setCurrentStep(`${array[midPtr]} < ${target}, search right half`);
      } else {
        rightPtr = midPtr - 1;
        setRight(rightPtr);
        setCurrentStep(`${array[midPtr]} > ${target}, search left half`);
      }
      
      await sleep(800);
    }
    
    setLeft(-1);
    setRight(-1);
    setMid(-1);
    setCurrentStep(`${target} not found in array`);
    speakResult(`${target} was not found in the array after ${compCount} comparisons. Binary search completed.`);
    toast.error(`${target} not found`);
    setIsSearching(false);
  }, [array, target, speakOperation, speakStep, speakResult]);

  const reset = () => {
    setLeft(-1);
    setRight(-1);
    setMid(-1);
    setFoundIndex(-1);
    setComparisons(0);
    setCurrentStep('');
    setSearchHistory([]);
    setIsSearching(false);
  };

  const updateArray = () => {
    try {
      const newArray = inputArray.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
      const newTarget = parseInt(inputTarget);
      
      if (newArray.length > 0 && !isNaN(newTarget)) {
        // Sort the array for binary search
        const sortedArray = newArray.sort((a, b) => a - b);
        setArray(sortedArray);
        setTarget(newTarget);
        reset();
        toast.success('Array sorted and target updated');
      } else {
        toast.error('Please enter valid numbers');
      }
    } catch (error) {
      toast.error('Invalid input format');
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Binary Search Visualizer</h2>
        <p className="text-muted-foreground">
          Efficient search in sorted arrays - O(log n) time complexity
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Array:</span>
          <Input 
            className="w-80" 
            value={inputArray} 
            onChange={e => setInputArray(e.target.value)} 
            placeholder="Enter comma-separated numbers (will be sorted)"
            disabled={isSearching}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Target:</span>
          <Input 
            className="w-24" 
            value={inputTarget} 
            onChange={e => setInputTarget(e.target.value)} 
            placeholder="Target"
            disabled={isSearching}
            type="number"
          />
        </div>
        <Button onClick={updateArray} disabled={isSearching} variant="outline">
          Update & Sort
        </Button>
        <Button onClick={binarySearch} disabled={isSearching}>
          <Search className="w-4 h-4 mr-2" />
          {isSearching ? 'Searching...' : 'Start Search'}
        </Button>
        <Button onClick={reset} disabled={isSearching} variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      {/* Current Step Display */}
      {currentStep && (
        <div className="p-4 bg-muted/20 rounded-lg border">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Step</Badge>
            <span className="text-sm font-medium">{currentStep}</span>
          </div>
        </div>
      )}

      {/* Search Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-2">Search Progress:</h4>
          <div className="space-y-2 text-sm">
            <div><strong>Target:</strong> {target}</div>
            <div><strong>Left:</strong> {left >= 0 ? left : 'Not set'}</div>
            <div><strong>Right:</strong> {right >= 0 ? right : 'Not set'}</div>
            <div><strong>Mid:</strong> {mid >= 0 ? mid : 'Not set'}</div>
            <div><strong>Comparisons:</strong> {comparisons}</div>
            <div><strong>Status:</strong> {foundIndex >= 0 ? `Found at index ${foundIndex}` : isSearching ? 'Searching...' : 'Ready'}</div>
          </div>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-2">Algorithm Info:</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div><strong>Time Complexity:</strong> O(log n)</div>
            <div><strong>Space Complexity:</strong> O(1)</div>
            <div><strong>Prerequisite:</strong> Sorted array</div>
            <div><strong>Max Comparisons:</strong> ⌈log₂(n)⌉ = {Math.ceil(Math.log2(array.length))}</div>
          </div>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-2">Advantages:</h4>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div>• Very fast for large datasets</div>
            <div>• Logarithmic time complexity</div>
            <div>• Constant space usage</div>
            <div>• Predictable performance</div>
          </div>
        </div>
      </div>

      {/* Array Visualization */}
      <div className="p-6 bg-gradient-visualization rounded-xl border-2 border-primary/20">
        <h4 className="text-lg font-semibold mb-4 text-center">Sorted Array Elements</h4>
        
        {/* Pointer indicators */}
        <div className="flex gap-2 flex-wrap justify-center mb-4">
          {array.map((_, index) => (
            <div key={`pointer-${index}`} className="w-16 h-6 flex items-center justify-center text-xs">
              {left === index && (
                <div className="flex items-center text-blue-600">
                  <ArrowUp className="w-3 h-3" />
                  <span className="ml-1">L</span>
                </div>
              )}
              {right === index && (
                <div className="flex items-center text-red-600">
                  <ArrowUp className="w-3 h-3" />
                  <span className="ml-1">R</span>
                </div>
              )}
              {mid === index && (
                <div className="flex items-center text-green-600">
                  <ArrowUp className="w-3 h-3" />
                  <span className="ml-1">M</span>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex gap-2 flex-wrap justify-center">
          {array.map((value, index) => (
            <motion.div
              key={index}
              className={`
                w-16 h-16 border-2 rounded-lg flex flex-col items-center justify-center font-mono text-sm font-bold
                transition-all duration-300 ${
                  foundIndex === index
                    ? 'bg-green-200 border-green-500 text-green-800 scale-110'
                    : mid === index
                      ? 'bg-yellow-200 border-yellow-500 text-yellow-800 scale-105'
                      : left === index
                        ? 'bg-blue-200 border-blue-500 text-blue-800'
                        : right === index
                          ? 'bg-red-200 border-red-500 text-red-800'
                          : (left >= 0 && right >= 0 && index >= left && index <= right)
                            ? 'bg-purple-100 border-purple-300 text-purple-700'
                            : 'bg-gray-100 border-gray-300 text-gray-500'
                }
              `}
              initial={{ scale: 1 }}
              animate={{ 
                scale: mid === index ? 1.05 : foundIndex === index ? 1.1 : 1,
                y: mid === index ? -5 : 0
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-xs text-muted-foreground">{index}</div>
              <div>{value}</div>
            </motion.div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 flex gap-4 justify-center text-sm flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-200 border border-blue-500 rounded"></div>
            <span>Left Pointer</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-200 border border-red-500 rounded"></div>
            <span>Right Pointer</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-200 border border-yellow-500 rounded"></div>
            <span>Middle Element</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-100 border border-purple-300 rounded"></div>
            <span>Search Range</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-200 border border-green-500 rounded"></div>
            <span>Found Target</span>
          </div>
        </div>
      </div>

      {/* Search History */}
      {searchHistory.length > 0 && (
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-3">Search History:</h4>
          <div className="space-y-2">
            {searchHistory.map((step, index) => (
              <div key={index} className="text-sm p-2 bg-muted/20 rounded">
                <span className="font-mono">
                  Step {index + 1}: left={step.left}, right={step.right}, mid={step.mid} 
                  → array[{step.mid}]={array[step.mid]} 
                  {step.comparison === 'equal' ? ' = ' : step.comparison === 'less' ? ' < ' : ' > '}
                  {target}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* How Binary Search Works */}
      <div className="bg-card border rounded-lg p-4">
        <h4 className="font-semibold mb-2">How Binary Search Works:</h4>
        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
          <li>Start with left=0 and right=array.length-1</li>
          <li>Calculate middle index: mid = (left + right) / 2</li>
          <li>Compare array[mid] with target value</li>
          <li>If equal: found! Return the index</li>
          <li>If array[mid] &lt; target: search right half (left = mid + 1)</li>
          <li>If array[mid] &gt; target: search left half (right = mid - 1)</li>
          <li>Repeat until found or left &gt; right</li>
        </ol>
      </div>

      {/* Memory Layout */}
      {showMemory && (
        <MemoryLayout
          title="Binary Search Memory Layout"
          data={array.slice(0, 10)}
          baseAddress={0x2000}
          highlightIndex={mid}
        />
      )}

      {/* Visualizer Controls */}
      <div className="flex justify-center">
        <VisualizerControls
          showMemory={showMemory}
          onToggleMemory={setShowMemory}
          voiceEnabled={voiceEnabled}
          onToggleVoice={setVoiceEnabled}
          voiceSpeed={speed}
          onVoiceSpeedChange={setSpeed}
          isSpeaking={isSpeaking}
          onPauseSpeech={pauseSpeech}
          onResumeSpeech={resumeSpeech}
          onStopSpeech={stopSpeech}
        />
      </div>
    </div>
  );
}
