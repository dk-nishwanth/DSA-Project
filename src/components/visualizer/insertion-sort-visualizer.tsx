import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Play, Pause, RotateCcw, Shuffle } from 'lucide-react';
import { motion } from 'framer-motion';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

interface SortStep {
  array: number[];
  comparing: number[];
  sorted: number[];
  current: number;
}

export function InsertionSortVisualizer() {
  const [array, setArray] = useState<number[]>([64, 34, 25, 12, 22, 11, 90]);
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [inputValue, setInputValue] = useState('64,34,25,12,22,11,90');
  const [showMemory, setShowMemory] = useState(false);
  
  const {
    voiceEnabled,
    setVoiceEnabled,
    speed,
    setSpeed,
    isSpeaking,
    pauseSpeech,
    resumeSpeech,
    stopSpeech,
    speakOperation
  } = useVisualizerVoice({ minInterval: 2500 });

  const generateSteps = (arr: number[]): SortStep[] => {
    const steps: SortStep[] = [];
    const workingArray = [...arr];
    
    steps.push({
      array: [...workingArray],
      comparing: [],
      sorted: [0],
      current: -1
    });

    for (let i = 1; i < workingArray.length; i++) {
      const key = workingArray[i];
      let j = i - 1;
      
      // Show current element being inserted
      steps.push({
        array: [...workingArray],
        comparing: [i],
        sorted: Array.from({ length: i }, (_, idx) => idx),
        current: i
      });

      // Find correct position and shift elements
      while (j >= 0 && workingArray[j] > key) {
        steps.push({
          array: [...workingArray],
          comparing: [j, j + 1],
          sorted: Array.from({ length: i }, (_, idx) => idx),
          current: i
        });

        workingArray[j + 1] = workingArray[j];
        
        steps.push({
          array: [...workingArray],
          comparing: [j, j + 1],
          sorted: Array.from({ length: i }, (_, idx) => idx),
          current: i
        });

        j--;
      }

      // Insert the key at correct position
      workingArray[j + 1] = key;
      
      steps.push({
        array: [...workingArray],
        comparing: [],
        sorted: Array.from({ length: i + 1 }, (_, idx) => idx),
        current: -1
      });
    }

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
    }, 800);
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
      const newArray = inputValue.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
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
    comparing: [],
    sorted: [],
    current: -1
  };

  const maxValue = Math.max(...currentStepData.array);

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
            placeholder="Enter numbers separated by commas"
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
          Step {currentStep + 1} of {steps.length}
        </div>
      )}

      {/* Visualization */}
      <div className="p-6 bg-gradient-visualization rounded-xl border-2 border-primary/20">
        <div className="flex items-end justify-center gap-2 h-64">
          {currentStepData.array.map((value, index) => {
            const isComparing = currentStepData.comparing.includes(index);
            const isSorted = currentStepData.sorted.includes(index);
            const isCurrent = currentStepData.current === index;
            
            let barColor = 'bg-gray-400';
            if (isCurrent) {
              barColor = 'bg-yellow-500';
            } else if (isComparing) {
              barColor = 'bg-red-500';
            } else if (isSorted) {
              barColor = 'bg-green-500';
            }

            return (
              <motion.div
                key={index}
                className={`${barColor} rounded-t-lg flex flex-col items-center justify-end relative min-w-[40px]`}
                style={{
                  height: `${(value / maxValue) * 200 + 20}px`,
                }}
                initial={{ scale: 1 }}
                animate={{ 
                  scale: isComparing || isCurrent ? 1.1 : 1,
                  y: isComparing ? -5 : 0
                }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-white font-bold text-sm mb-2">
                  {value}
                </span>
                <span className="absolute -bottom-6 text-xs text-gray-600 dark:text-gray-400">
                  {index}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span>Current Element</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>Comparing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Sorted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-400 rounded"></div>
          <span>Unsorted</span>
        </div>
      </div>

      {/* Algorithm Info */}
      <div className="bg-card border rounded-lg p-4">
        <h4 className="font-semibold mb-2">How Insertion Sort Works:</h4>
        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
          <li>Start with the second element (index 1) as the first element is considered sorted</li>
          <li>Compare the current element with elements in the sorted portion</li>
          <li>Shift larger elements one position to the right</li>
          <li>Insert the current element at its correct position</li>
          <li>Repeat until all elements are processed</li>
        </ol>
      </div>

      {/* Memory Layout */}
      {showMemory && (
        <MemoryLayout
          title="Array Memory Layout"
          data={currentStepData.array}
          baseAddress={0x3000}
        />
      )}

      {/* Controls */}
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