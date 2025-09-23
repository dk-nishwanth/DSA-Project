import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, RotateCcw, Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';
import { toast } from 'sonner';

export function LinearSearchVisualizer() {
  const [array, setArray] = useState<number[]>([64, 34, 25, 12, 22, 11, 90, 88, 76, 50]);
  const [target, setTarget] = useState(22);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [foundIndex, setFoundIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const [comparisons, setComparisons] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [showMemory, setShowMemory] = useState(false);
  const [inputArray, setInputArray] = useState('64,34,25,12,22,11,90,88,76,50');
  const [inputTarget, setInputTarget] = useState('22');
  
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

  const linearSearch = useCallback(async () => {
    if (isSearching) return;
    
    setIsSearching(true);
    setCurrentIndex(-1);
    setFoundIndex(-1);
    setComparisons(0);
    
    speakOperation("Linear Search", `Starting linear search for ${target} in array. We'll check each element sequentially from left to right.`);
    setCurrentStep(`Searching for ${target} in array...`);
    
    let compCount = 0;
    
    for (let i = 0; i < array.length; i++) {
      setCurrentIndex(i);
      compCount++;
      setComparisons(compCount);
      
      setCurrentStep(`Checking index ${i}: array[${i}] = ${array[i]}`);
      speakStep("", `Checking element at index ${i}. Value is ${array[i]}. ${array[i] === target ? 'Found the target!' : array[i] < target ? 'Too small, continue searching.' : 'Too large, continue searching.'}`, i + 1, array.length);
      
      await sleep(1000);
      
      if (array[i] === target) {
        setFoundIndex(i);
        setCurrentStep(`Found ${target} at index ${i}!`);
        speakResult(`Success! Found ${target} at index ${i} after ${compCount} comparisons. Linear search completed.`);
        toast.success(`Found ${target} at index ${i}`);
        setIsSearching(false);
        return;
      }
    }
    
    setCurrentIndex(-1);
    setCurrentStep(`${target} not found in array`);
    speakResult(`${target} was not found in the array after checking all ${array.length} elements with ${compCount} comparisons.`);
    toast.error(`${target} not found`);
    setIsSearching(false);
  }, [array, target, speakOperation, speakStep, speakResult]);

  const reset = () => {
    setCurrentIndex(-1);
    setFoundIndex(-1);
    setComparisons(0);
    setCurrentStep('');
    setIsSearching(false);
  };

  const updateArray = () => {
    try {
      const newArray = inputArray.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
      const newTarget = parseInt(inputTarget);
      
      if (newArray.length > 0 && !isNaN(newTarget)) {
        setArray(newArray);
        setTarget(newTarget);
        reset();
        toast.success('Array and target updated');
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
        <h2 className="text-2xl font-bold mb-2">Linear Search Visualizer</h2>
        <p className="text-muted-foreground">
          Sequential search through array elements - O(n) time complexity
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
            placeholder="Enter comma-separated numbers"
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
          Update
        </Button>
        <Button onClick={linearSearch} disabled={isSearching}>
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
            <div><strong>Current Index:</strong> {currentIndex >= 0 ? currentIndex : 'Not started'}</div>
            <div><strong>Comparisons:</strong> {comparisons}</div>
            <div><strong>Status:</strong> {foundIndex >= 0 ? `Found at index ${foundIndex}` : isSearching ? 'Searching...' : 'Ready'}</div>
          </div>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-2">Algorithm Info:</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div><strong>Time Complexity:</strong> O(n)</div>
            <div><strong>Space Complexity:</strong> O(1)</div>
            <div><strong>Best Case:</strong> O(1) - first element</div>
            <div><strong>Worst Case:</strong> O(n) - last element or not found</div>
          </div>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-2">Use Cases:</h4>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div>• Unsorted arrays</div>
            <div>• Small datasets</div>
            <div>• Simple implementation needed</div>
            <div>• No preprocessing required</div>
          </div>
        </div>
      </div>

      {/* Array Visualization */}
      <div className="p-6 bg-gradient-visualization rounded-xl border-2 border-primary/20">
        <h4 className="text-lg font-semibold mb-4 text-center">Array Elements</h4>
        
        <div className="flex gap-2 flex-wrap justify-center">
          {array.map((value, index) => (
            <motion.div
              key={index}
              className={`
                w-16 h-16 border-2 rounded-lg flex flex-col items-center justify-center font-mono text-sm font-bold
                transition-all duration-300 ${
                  foundIndex === index
                    ? 'bg-green-200 border-green-500 text-green-800 scale-110'
                    : currentIndex === index
                      ? 'bg-blue-200 border-blue-500 text-blue-800 scale-105'
                      : index < currentIndex
                        ? 'bg-red-100 border-red-300 text-red-600'
                        : 'bg-gray-100 border-gray-300 text-gray-700'
                }
              `}
              initial={{ scale: 1 }}
              animate={{ 
                scale: currentIndex === index ? 1.05 : foundIndex === index ? 1.1 : 1,
                y: currentIndex === index ? -5 : 0
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-xs text-muted-foreground">{index}</div>
              <div>{value}</div>
            </motion.div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 flex gap-4 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-200 border border-blue-500 rounded"></div>
            <span>Currently Checking</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
            <span>Already Checked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-200 border border-green-500 rounded"></div>
            <span>Found Target</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
            <span>Not Checked</span>
          </div>
        </div>
      </div>

      {/* How Linear Search Works */}
      <div className="bg-card border rounded-lg p-4">
        <h4 className="font-semibold mb-2">How Linear Search Works:</h4>
        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
          <li>Start from the first element of the array</li>
          <li>Compare the current element with the target value</li>
          <li>If they match, return the current index (found!)</li>
          <li>If they don't match, move to the next element</li>
          <li>Repeat until target is found or array ends</li>
          <li>If array ends without finding target, return "not found"</li>
        </ol>
      </div>

      {/* Memory Layout */}
      {showMemory && (
        <MemoryLayout
          title="Linear Search Memory Layout"
          data={array.slice(0, 10)}
          baseAddress={0x1000}
          highlightIndex={currentIndex}
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
