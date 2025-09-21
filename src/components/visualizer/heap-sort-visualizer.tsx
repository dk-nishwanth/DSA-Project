import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Play } from 'lucide-react';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

interface HeapSortStep {
  array: number[];
  heapSize: number;
  currentIndex: number;
  leftChild: number;
  rightChild: number;
  largest: number;
  phase: 'build-heap' | 'extract-max' | 'heapify' | 'complete';
  description: string;
}

export function HeapSortVisualizer() {
  const [originalArray, setOriginalArray] = useState<number[]>([50, 30, 40, 20, 10, 35, 25]);
  const [input, setInput] = useState('50,30,40,20,10,35,25');
  const [currentArray, setCurrentArray] = useState<number[]>([50, 30, 40, 20, 10, 35, 25]);
  const [isSorting, setIsSorting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<HeapSortStep[]>([]);
  const [showMemory, setShowMemory] = useState(false);
  const [heapSize, setHeapSize] = useState(7);
  
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
  } = useVisualizerVoice({ minInterval: 2500 });

  const updateFromInput = () => {
    const nums = input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    if (nums.length > 0) {
      setOriginalArray(nums);
      setCurrentArray(nums);
      setSteps([]);
      setCurrentStep(0);
      setHeapSize(nums.length);
    }
  };

  const generateHeapSortSteps = (arr: number[]): HeapSortStep[] => {
    const steps: HeapSortStep[] = [];
    const workingArray = [...arr];
    const n = workingArray.length;
    
    const heapify = (array: number[], heapSize: number, rootIndex: number) => {
      let largest = rootIndex;
      const leftChild = 2 * rootIndex + 1;
      const rightChild = 2 * rootIndex + 2;
      
      steps.push({
        array: [...array],
        heapSize,
        currentIndex: rootIndex,
        leftChild: leftChild < heapSize ? leftChild : -1,
        rightChild: rightChild < heapSize ? rightChild : -1,
        largest,
        phase: 'heapify',
        description: `Heapifying at index ${rootIndex}, checking children at ${leftChild} and ${rightChild}`
      });
      
      if (leftChild < heapSize && array[leftChild] > array[largest]) {
        largest = leftChild;
      }
      
      if (rightChild < heapSize && array[rightChild] > array[largest]) {
        largest = rightChild;
      }
      
      if (largest !== rootIndex) {
        [array[rootIndex], array[largest]] = [array[largest], array[rootIndex]];
        
        steps.push({
          array: [...array],
          heapSize,
          currentIndex: rootIndex,
          leftChild: leftChild < heapSize ? leftChild : -1,
          rightChild: rightChild < heapSize ? rightChild : -1,
          largest,
          phase: 'heapify',
          description: `Swapped ${array[largest]} and ${array[rootIndex]} to maintain heap property`
        });
        
        heapify(array, heapSize, largest);
      }
    };
    
    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      steps.push({
        array: [...workingArray],
        heapSize: n,
        currentIndex: i,
        leftChild: -1,
        rightChild: -1,
        largest: -1,
        phase: 'build-heap',
        description: `Building max heap: starting heapify from index ${i}`
      });
      heapify(workingArray, n, i);
    }
    
    // Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
      [workingArray[0], workingArray[i]] = [workingArray[i], workingArray[0]];
      
      steps.push({
        array: [...workingArray],
        heapSize: i,
        currentIndex: 0,
        leftChild: -1,
        rightChild: -1,
        largest: -1,
        phase: 'extract-max',
        description: `Extracted max element ${workingArray[i]} to position ${i}, heap size reduced to ${i}`
      });
      
      heapify(workingArray, i, 0);
    }
    
    steps.push({
      array: [...workingArray],
      heapSize: 0,
      currentIndex: -1,
      leftChild: -1,
      rightChild: -1,
      largest: -1,
      phase: 'complete',
      description: 'Heap sort completed! Array is now fully sorted.'
    });
    
    return steps;
  };

  const startSorting = () => {
    const sortSteps = generateHeapSortSteps(originalArray);
    setSteps(sortSteps);
    setCurrentStep(0);
    setIsSorting(true);
    
    speakOperation("Starting heap sort visualization", "We'll build a max heap and then extract elements in sorted order.");
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      const nextStepIndex = currentStep + 1;
      setCurrentStep(nextStepIndex);
      setCurrentArray(steps[nextStepIndex].array);
      setHeapSize(steps[nextStepIndex].heapSize);
      
      speakStep("", steps[nextStepIndex].description, nextStepIndex, steps.length);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const prevStepIndex = currentStep - 1;
      setCurrentStep(prevStepIndex);
      setCurrentArray(steps[prevStepIndex].array);
      setHeapSize(steps[prevStepIndex].heapSize);
    }
  };

  const reset = () => {
    setCurrentArray([...originalArray]);
    setSteps([]);
    setCurrentStep(0);
    setIsSorting(false);
    setHeapSize(originalArray.length);
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Heap Sort Visualizer</h2>
        <p className="text-muted-foreground">
          Watch how heap sort builds a max heap and extracts elements in sorted order
        </p>
      </div>


      {/* Input Controls */}
      <div className="flex gap-2 items-center justify-center flex-wrap">
        <Input 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          placeholder="Enter numbers separated by commas"
          className="max-w-xs"
        />
        <Button onClick={updateFromInput} variant="outline">
          Update Array
        </Button>
        <Button onClick={startSorting} disabled={isSorting && steps.length === 0}>
          <Play className="h-4 w-4 mr-1" />
          Start Sort
        </Button>
        <Button onClick={reset} variant="outline">
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset
        </Button>
      </div>

      {/* Step Controls */}
      {steps.length > 0 && (
        <div className="flex gap-2 items-center justify-center">
          <Button onClick={prevStep} disabled={currentStep === 0} variant="outline">
            Previous
          </Button>
          <Badge variant="secondary">
            Step {currentStep + 1} of {steps.length}
          </Badge>
          <Button onClick={nextStep} disabled={currentStep === steps.length - 1} variant="outline">
            Next
          </Button>
        </div>
      )}

      {/* Current Step Description */}
      {currentStepData && (
        <div className="text-center p-4 bg-muted rounded-lg">
          <Badge className="mb-2" variant={
            currentStepData.phase === 'build-heap' ? 'default' : 
            currentStepData.phase === 'extract-max' ? 'destructive' : 
            currentStepData.phase === 'heapify' ? 'secondary' : 'outline'
          }>
            {currentStepData.phase.toUpperCase().replace('-', ' ')}
          </Badge>
          <p className="text-sm">{currentStepData.description}</p>
        </div>
      )}

      {/* Array Visualization */}
      <div className="p-6 bg-gradient-visualization rounded-xl border-2 border-primary/20">
        <h3 className="text-lg font-semibold mb-4 text-center">Heap Visualization</h3>
        <div className="flex justify-center">
          <div className="flex gap-1">
            {currentArray.map((value, index) => {
              let className = "w-12 h-12 flex items-center justify-center border-2 rounded text-sm font-semibold transition-colors";
              
              if (currentStepData) {
                if (index === currentStepData.currentIndex) {
                  className += " bg-red-200 border-red-400"; // Current node
                } else if (index === currentStepData.leftChild) {
                  className += " bg-blue-200 border-blue-400"; // Left child
                } else if (index === currentStepData.rightChild) {
                  className += " bg-green-200 border-green-400"; // Right child
                } else if (index < heapSize) {
                  className += " bg-yellow-100 border-yellow-300"; // In heap
                } else {
                  className += " bg-purple-200 border-purple-400"; // Sorted portion
                }
              } else {
                className += " bg-gray-100 border-gray-300";
              }
              
              return (
                <div key={index} className={className}>
                  {value}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Heap Info */}
      {currentStepData && (
        <div className="text-center text-sm text-muted-foreground">
          <div>Heap Size: {heapSize}</div>
          <div>Sorted Elements: {currentArray.length - heapSize}</div>
        </div>
      )}

      {/* Memory Layout */}
      {showMemory && (
        <MemoryLayout
          title="Array Memory Layout"
          data={currentArray}
          baseAddress={0x4000}
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
