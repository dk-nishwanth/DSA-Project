import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, RotateCcw, Target, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';
import { toast } from 'sonner';

export function InterpolationSearchVisualizer() {
  const [array, setArray] = useState<number[]>([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
  const [target, setTarget] = useState(70);
  const [left, setLeft] = useState(-1);
  const [right, setRight] = useState(-1);
  const [pos, setPos] = useState(-1);
  const [foundIndex, setFoundIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const [comparisons, setComparisons] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [showMemory, setShowMemory] = useState(false);
  const [inputArray, setInputArray] = useState('10,20,30,40,50,60,70,80,90,100');
  const [inputTarget, setInputTarget] = useState('70');
  const [interpolationHistory, setInterpolationHistory] = useState<{left: number, right: number, pos: number, formula: string}[]>([]);
  
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

  const interpolationSearch = useCallback(async () => {
    if (isSearching) return;
    
    setIsSearching(true);
    setLeft(-1);
    setRight(-1);
    setPos(-1);
    setFoundIndex(-1);
    setComparisons(0);
    setInterpolationHistory([]);
    
    speakOperation("Interpolation Search", `Starting interpolation search for ${target}. We'll use the value distribution to make smart guesses about the target's position.`);
    setCurrentStep(`Searching for ${target} using interpolation...`);
    
    let leftPtr = 0;
    let rightPtr = array.length - 1;
    let compCount = 0;
    const history: {left: number, right: number, pos: number, formula: string}[] = [];
    
    setLeft(leftPtr);
    setRight(rightPtr);
    
    while (leftPtr <= rightPtr && target >= array[leftPtr] && target <= array[rightPtr]) {
      // Calculate interpolated position
      const posPtr = leftPtr + Math.floor(
        ((target - array[leftPtr]) * (rightPtr - leftPtr)) / 
        (array[rightPtr] - array[leftPtr])
      );
      
      setPos(posPtr);
      compCount++;
      setComparisons(compCount);
      
      const formula = `left + ((target - arr[left]) * (right - left)) / (arr[right] - arr[left])`;
      const calculation = `${leftPtr} + ((${target} - ${array[leftPtr]}) * (${rightPtr} - ${leftPtr})) / (${array[rightPtr]} - ${array[leftPtr]}) = ${posPtr}`;
      
      history.push({ left: leftPtr, right: rightPtr, pos: posPtr, formula: calculation });
      setInterpolationHistory([...history]);
      
      setCurrentStep(`Interpolated position: ${posPtr}, checking array[${posPtr}] = ${array[posPtr]}`);
      speakStep("", `Using interpolation formula to estimate position. Calculated position ${posPtr}. Value at position ${posPtr} is ${array[posPtr]}. ${array[posPtr] === target ? 'Found the target!' : array[posPtr] < target ? 'Target is larger, search right portion.' : 'Target is smaller, search left portion.'}`, compCount, Math.ceil(Math.log2(array.length)) + 1);
      
      await sleep(1500);
      
      if (array[posPtr] === target) {
        setFoundIndex(posPtr);
        setCurrentStep(`Found ${target} at index ${posPtr}!`);
        speakResult(`Success! Found ${target} at index ${posPtr} after ${compCount} comparisons. Interpolation search used smart positioning to find the target efficiently.`);
        toast.success(`Found ${target} at index ${posPtr}`);
        setIsSearching(false);
        return;
      } else if (array[posPtr] < target) {
        leftPtr = posPtr + 1;
        setLeft(leftPtr);
        setCurrentStep(`${array[posPtr]} < ${target}, search right portion`);
      } else {
        rightPtr = posPtr - 1;
        setRight(rightPtr);
        setCurrentStep(`${array[posPtr]} > ${target}, search left portion`);
      }
      
      await sleep(1000);
    }
    
    setLeft(-1);
    setRight(-1);
    setPos(-1);
    setCurrentStep(`${target} not found in array`);
    speakResult(`${target} was not found in the array after ${compCount} comparisons. Interpolation search completed.`);
    toast.error(`${target} not found`);
    setIsSearching(false);
  }, [array, target, speakOperation, speakStep, speakResult]);

  const reset = () => {
    setLeft(-1);
    setRight(-1);
    setPos(-1);
    setFoundIndex(-1);
    setComparisons(0);
    setCurrentStep('');
    setInterpolationHistory([]);
    setIsSearching(false);
  };

  const updateArray = () => {
    try {
      const newArray = inputArray.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
      const newTarget = parseInt(inputTarget);
      
      if (newArray.length > 0 && !isNaN(newTarget)) {
        // Sort the array and check if it's uniformly distributed
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

  const isUniformlyDistributed = () => {
    if (array.length < 3) return true;
    const diffs = [];
    for (let i = 1; i < array.length; i++) {
      diffs.push(array[i] - array[i-1]);
    }
    const avgDiff = diffs.reduce((a, b) => a + b, 0) / diffs.length;
    return diffs.every(diff => Math.abs(diff - avgDiff) <= avgDiff * 0.3);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Interpolation Search Visualizer</h2>
        <p className="text-muted-foreground">
          Smart search using value distribution - O(log log n) for uniform data
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
            placeholder="Enter comma-separated numbers (uniform distribution works best)"
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
        <Button onClick={interpolationSearch} disabled={isSearching}>
          <Search className="w-4 h-4 mr-2" />
          {isSearching ? 'Searching...' : 'Start Search'}
        </Button>
        <Button onClick={reset} disabled={isSearching} variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      {/* Data Distribution Warning */}
      {!isUniformlyDistributed() && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-800">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">
              <strong>Note:</strong> This array is not uniformly distributed. Interpolation search works best with uniformly distributed data.
            </span>
          </div>
        </div>
      )}

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
            <div><strong>Interpolated Pos:</strong> {pos >= 0 ? pos : 'Not calculated'}</div>
            <div><strong>Comparisons:</strong> {comparisons}</div>
            <div><strong>Status:</strong> {foundIndex >= 0 ? `Found at index ${foundIndex}` : isSearching ? 'Searching...' : 'Ready'}</div>
          </div>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-2">Algorithm Info:</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div><strong>Time Complexity:</strong> O(log log n) avg</div>
            <div><strong>Worst Case:</strong> O(n)</div>
            <div><strong>Space Complexity:</strong> O(1)</div>
            <div><strong>Best For:</strong> Uniform distribution</div>
          </div>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-2">Key Features:</h4>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div>• Uses value-based positioning</div>
            <div>• Better than binary for uniform data</div>
            <div>• Estimates target location</div>
            <div>• Requires sorted array</div>
          </div>
        </div>
      </div>

      {/* Array Visualization */}
      <div className="p-6 bg-gradient-visualization rounded-xl border-2 border-primary/20">
        <h4 className="text-lg font-semibold mb-4 text-center">Sorted Array with Interpolation</h4>
        
        <div className="flex gap-2 flex-wrap justify-center">
          {array.map((value, index) => (
            <motion.div
              key={index}
              className={`
                w-16 h-20 border-2 rounded-lg flex flex-col items-center justify-center font-mono text-sm font-bold
                transition-all duration-300 ${
                  foundIndex === index
                    ? 'bg-green-200 border-green-500 text-green-800 scale-110'
                    : pos === index
                      ? 'bg-orange-200 border-orange-500 text-orange-800 scale-105'
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
                scale: pos === index ? 1.05 : foundIndex === index ? 1.1 : 1,
                y: pos === index ? -8 : 0
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-xs text-muted-foreground mb-1">{index}</div>
              <div>{value}</div>
              {pos === index && (
                <div className="text-xs text-orange-600 mt-1">INTERP</div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 flex gap-4 justify-center text-sm flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-200 border border-blue-500 rounded"></div>
            <span>Left Boundary</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-200 border border-red-500 rounded"></div>
            <span>Right Boundary</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-200 border border-orange-500 rounded"></div>
            <span>Interpolated Position</span>
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

      {/* Interpolation Formula */}
      <div className="bg-card border rounded-lg p-4">
        <h4 className="font-semibold mb-3">Interpolation Formula:</h4>
        <div className="bg-muted/20 p-3 rounded font-mono text-sm">
          pos = left + ((target - arr[left]) × (right - left)) / (arr[right] - arr[left])
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          This formula estimates the position based on the target value's proportion within the range.
        </p>
      </div>

      {/* Interpolation History */}
      {interpolationHistory.length > 0 && (
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-3">Interpolation History:</h4>
          <div className="space-y-2">
            {interpolationHistory.map((step, index) => (
              <div key={index} className="text-sm p-3 bg-muted/20 rounded">
                <div className="font-semibold mb-1">Step {index + 1}:</div>
                <div className="font-mono text-xs">{step.formula}</div>
                <div className="mt-1">
                  Range: [{step.left}, {step.right}] → Interpolated position: {step.pos}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* How Interpolation Search Works */}
      <div className="bg-card border rounded-lg p-4">
        <h4 className="font-semibold mb-2">How Interpolation Search Works:</h4>
        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
          <li>Start with left=0 and right=array.length-1</li>
          <li>Calculate interpolated position using the formula above</li>
          <li>Compare array[pos] with target value</li>
          <li>If equal: found! Return the index</li>
          <li>If array[pos] &lt; target: search right portion (left = pos + 1)</li>
          <li>If array[pos] &gt; target: search left portion (right = pos - 1)</li>
          <li>Repeat until found or left &gt; right</li>
        </ol>
      </div>

      {/* Memory Layout */}
      {showMemory && (
        <MemoryLayout
          title="Interpolation Search Memory Layout"
          data={array.slice(0, 10)}
          baseAddress={0x3000}
          highlightIndex={pos}
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
