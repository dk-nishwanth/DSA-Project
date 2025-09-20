import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Play, Pause, RotateCcw, Shuffle } from 'lucide-react';
import { motion } from 'framer-motion';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVoiceExplain } from '@/hooks/useVoiceExplain';

interface CountingStep {
  array: number[];
  countArray: number[];
  outputArray: number[];
  currentIndex: number;
  phase: 'counting' | 'cumulative' | 'placing' | 'complete';
  message: string;
}

export function CountingSortVisualizer() {
  const [array, setArray] = useState<number[]>([4, 2, 2, 8, 3, 3, 1]);
  const [steps, setSteps] = useState<CountingStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [inputValue, setInputValue] = useState('4,2,2,8,3,3,1');
  const [showMemory, setShowMemory] = useState(false);
  
  const [voiceText, setVoiceText] = useState('');
  const { enabled: voiceEnabled, setEnabled: setVoiceEnabled } = useVoiceExplain(voiceText);

  const generateSteps = (arr: number[]): CountingStep[] => {
    const steps: CountingStep[] = [];
    const maxVal = Math.max(...arr);
    const countArray = new Array(maxVal + 1).fill(0);
    const outputArray = new Array(arr.length);

    // Phase 1: Count occurrences
    steps.push({
      array: [...arr],
      countArray: [...countArray],
      outputArray: [...outputArray],
      currentIndex: -1,
      phase: 'counting',
      message: `Initialize count array of size ${maxVal + 1}`
    });

    for (let i = 0; i < arr.length; i++) {
      countArray[arr[i]]++;
      steps.push({
        array: [...arr],
        countArray: [...countArray],
        outputArray: [...outputArray],
        currentIndex: i,
        phase: 'counting',
        message: `Count element ${arr[i]} at index ${i}`
      });
    }

    // Phase 2: Calculate cumulative counts
    steps.push({
      array: [...arr],
      countArray: [...countArray],
      outputArray: [...outputArray],
      currentIndex: -1,
      phase: 'cumulative',
      message: 'Calculate cumulative counts'
    });

    for (let i = 1; i <= maxVal; i++) {
      countArray[i] += countArray[i - 1];
      steps.push({
        array: [...arr],
        countArray: [...countArray],
        outputArray: [...outputArray],
        currentIndex: i,
        phase: 'cumulative',
        message: `Cumulative count[${i}] = ${countArray[i]}`
      });
    }

    // Phase 3: Place elements in output array
    for (let i = arr.length - 1; i >= 0; i--) {
      const value = arr[i];
      const position = countArray[value] - 1;
      outputArray[position] = value;
      countArray[value]--;
      
      steps.push({
        array: [...arr],
        countArray: [...countArray],
        outputArray: [...outputArray],
        currentIndex: i,
        phase: 'placing',
        message: `Place ${value} at position ${position} in output array`
      });
    }

    steps.push({
      array: [...arr],
      countArray: [...countArray],
      outputArray: [...outputArray],
      currentIndex: -1,
      phase: 'complete',
      message: 'Counting sort complete!'
    });

    return steps;
  };

  const handleSort = () => {
    const newSteps = generateSteps(array);
    setSteps(newSteps);
    setCurrentStep(0);
  };

  const handlePlay = () => {
    if (steps.length === 0) {
      handleSort();
      return;
    }
    
    setIsPlaying(true);
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleShuffle = () => {
    const newArray = [...array].sort(() => Math.random() - 0.5);
    setArray(newArray);
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleInputChange = () => {
    try {
      const newArray = inputValue.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num) && num >= 0);
      if (newArray.length > 0) {
        setArray(newArray);
        setSteps([]);
        setCurrentStep(0);
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Invalid input');
    }
  };

  const currentStepData = steps[currentStep] || {
    array: array,
    countArray: new Array(Math.max(...array) + 1).fill(0),
    outputArray: new Array(array.length).fill(undefined),
    currentIndex: -1,
    phase: 'counting' as const,
    message: 'Click Play to start'
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex gap-2">
          <Button
            onClick={isPlaying ? handlePause : handlePlay}
            disabled={steps.length > 0 && currentStep >= steps.length - 1}
            className="flex items-center gap-2"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          
          <Button onClick={handleReset} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          
          <Button onClick={handleShuffle} variant="outline">
            <Shuffle className="h-4 w-4 mr-2" />
            Shuffle
          </Button>
        </div>

        <div className="flex gap-2 items-center">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter non-negative integers"
            className="w-64"
          />
          <Button onClick={handleInputChange} variant="outline">
            Set Array
          </Button>
        </div>
      </div>

      {/* Progress */}
      {steps.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Step {currentStep + 1} of {steps.length} - Phase: {currentStepData.phase}
        </div>
      )}

      {/* Visualization */}
      <div className="p-6 bg-gradient-visualization rounded-xl border-2 border-primary/20">
        <div className="space-y-8">
          {/* Original Array */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-center">Input Array</h3>
            <div className="flex items-end justify-center gap-2 h-32">
              {currentStepData.array.map((value, index) => {
                const isHighlighted = index === currentStepData.currentIndex && currentStepData.phase === 'counting';
                
                return (
                  <motion.div
                    key={index}
                    className={`${isHighlighted ? 'bg-yellow-500' : 'bg-blue-500'} rounded-t-lg flex flex-col items-center justify-end relative min-w-[40px]`}
                    style={{
                      height: `${(value / Math.max(...currentStepData.array)) * 80 + 20}px`,
                    }}
                    initial={{ scale: 1 }}
                    animate={{ scale: isHighlighted ? 1.1 : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-white font-bold text-sm mb-2">{value}</span>
                    <span className="absolute -bottom-6 text-xs text-gray-600 dark:text-gray-400">{index}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Count Array */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-center">Count Array</h3>
            <div className="flex items-end justify-center gap-2 h-32">
              {currentStepData.countArray.map((count, index) => {
                const isHighlighted = index === currentStepData.currentIndex && 
                  (currentStepData.phase === 'cumulative' || currentStepData.phase === 'counting');
                
                return (
                  <motion.div
                    key={index}
                    className={`${isHighlighted ? 'bg-orange-500' : 'bg-green-500'} rounded-t-lg flex flex-col items-center justify-end relative min-w-[40px]`}
                    style={{
                      height: `${count > 0 ? (count / Math.max(...currentStepData.countArray)) * 80 + 20 : 20}px`,
                    }}
                    initial={{ scale: 1 }}
                    animate={{ scale: isHighlighted ? 1.1 : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-white font-bold text-sm mb-2">{count}</span>
                    <span className="absolute -bottom-6 text-xs text-gray-600 dark:text-gray-400">{index}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Output Array */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-center">Output Array</h3>
            <div className="flex items-end justify-center gap-2 h-32">
              {currentStepData.outputArray.map((value, index) => {
                const hasValue = value !== undefined;
                
                return (
                  <motion.div
                    key={index}
                    className={`${hasValue ? 'bg-purple-500' : 'bg-gray-300 border-2 border-dashed border-gray-400'} rounded-t-lg flex flex-col items-center justify-end relative min-w-[40px]`}
                    style={{
                      height: hasValue ? `${(value / Math.max(...currentStepData.array)) * 80 + 20}px` : '20px',
                    }}
                    initial={{ scale: 1 }}
                    animate={{ scale: hasValue ? 1.05 : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {hasValue && <span className="text-white font-bold text-sm mb-2">{value}</span>}
                    <span className="absolute -bottom-6 text-xs text-gray-600 dark:text-gray-400">{index}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Message */}
          <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
            <p className="text-sm font-medium">{currentStepData.message}</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span>Current Element</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>Input Array</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Count Array</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-500 rounded"></div>
          <span>Active Count</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500 rounded"></div>
          <span>Output Array</span>
        </div>
      </div>

      {/* Algorithm Info */}
      <div className="bg-card border rounded-lg p-4">
        <h4 className="font-semibold mb-2">How Counting Sort Works:</h4>
        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
          <li>Count the frequency of each element in the input array</li>
          <li>Calculate cumulative counts to determine positions</li>
          <li>Place elements in output array using count array as index guide</li>
          <li>Works only with non-negative integers in a known range</li>
          <li>Time Complexity: O(n + k) where k is the range of input</li>
          <li>Space Complexity: O(k) for the count array</li>
        </ol>
      </div>

      {/* Memory Layout */}
      {showMemory && (
        <MemoryLayout
          title="Array Memory Layout"
          data={array}
          baseAddress={0x5000}
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

      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex gap-2">
          <Button
            onClick={isPlaying ? handlePause : handlePlay}
            disabled={steps.length > 0 && currentStep >= steps.length - 1}
            className="flex items-center gap-2"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          
          <Button onClick={handleReset} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          
          <Button onClick={handleShuffle} variant="outline">
            <Shuffle className="h-4 w-4 mr-2" />
            Shuffle
          </Button>
        </div>

        <div className="flex gap-2 items-center">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter non-negative integers"
            className="w-64"
          />
          <Button onClick={handleInputChange} variant="outline">
            Set Array
          </Button>
        </div>
      </div>
    </div>
  );
}