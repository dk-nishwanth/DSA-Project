import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Play } from 'lucide-react';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

interface QuickSortStep {
  array: number[];
  pivotIndex: number;
  left: number;
  right: number;
  i: number;
  j: number;
  phase: 'partition' | 'swap' | 'pivot-place' | 'complete';
  description: string;
}

export function QuickSortVisualizer() {
  const [originalArray, setOriginalArray] = useState<number[]>([10, 80, 30, 90, 40, 50, 70]);
  const [input, setInput] = useState('10,80,30,90,40,50,70');
  const [currentArray, setCurrentArray] = useState<number[]>([10, 80, 30, 90, 40, 50, 70]);
  const [isSorting, setIsSorting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<QuickSortStep[]>([]);
  const [showMemory, setShowMemory] = useState(false);
  const [pivotIndex, setPivotIndex] = useState<number | null>(null);
  const [partitionRange, setPartitionRange] = useState<{left: number, right: number} | null>(null);
  
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
    }
  };

  const generateQuickSortSteps = (arr: number[]): QuickSortStep[] => {
    const steps: QuickSortStep[] = [];
    const workingArray = [...arr];
    
    const quickSortRecursive = (array: number[], left: number, right: number) => {
      if (left >= right) return;
      
      const pivotIndex = partition(array, left, right);
      quickSortRecursive(array, left, pivotIndex - 1);
      quickSortRecursive(array, pivotIndex + 1, right);
    };
    
    const partition = (array: number[], left: number, right: number): number => {
      const pivot = array[right];
      let i = left - 1;
      
      steps.push({
        array: [...array],
        pivotIndex: right,
        left,
        right,
        i,
        j: left,
        phase: 'partition',
        description: `Starting partition with pivot ${pivot} at index ${right}`
      });
      
      for (let j = left; j < right; j++) {
        steps.push({
          array: [...array],
          pivotIndex: right,
          left,
          right,
          i,
          j,
          phase: 'partition',
          description: `Comparing ${array[j]} with pivot ${pivot}`
        });
        
        if (array[j] <= pivot) {
          i++;
          [array[i], array[j]] = [array[j], array[i]];
          
          steps.push({
            array: [...array],
            pivotIndex: right,
            left,
            right,
            i,
            j,
            phase: 'swap',
            description: `Swapped ${array[j]} and ${array[i]} (${array[j]} ≤ ${pivot})`
          });
        }
      }
      
      [array[i + 1], array[right]] = [array[right], array[i + 1]];
      
      steps.push({
        array: [...array],
        pivotIndex: i + 1,
        left,
        right,
        i: i + 1,
        j: right,
        phase: 'pivot-place',
        description: `Placed pivot ${pivot} at its final position ${i + 1}`
      });
      
      return i + 1;
    };
    
    quickSortRecursive(workingArray, 0, workingArray.length - 1);
    
    steps.push({
      array: [...workingArray],
      pivotIndex: -1,
      left: 0,
      right: workingArray.length - 1,
      i: -1,
      j: -1,
      phase: 'complete',
      description: 'Quick sort completed! Array is now fully sorted.'
    });
    
    return steps;
  };

  const startSorting = () => {
    const sortSteps = generateQuickSortSteps(originalArray);
    setSteps(sortSteps);
    setCurrentStep(0);
    setIsSorting(true);
    
    speakOperation("Starting quick sort visualization", "We'll partition around pivots and recursively sort subarrays.");
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      const nextStepIndex = currentStep + 1;
      setCurrentStep(nextStepIndex);
      setCurrentArray(steps[nextStepIndex].array);
      setPivotIndex(steps[nextStepIndex].pivotIndex);
      setPartitionRange({
        left: steps[nextStepIndex].left,
        right: steps[nextStepIndex].right
      });
      
      speakStep("", steps[nextStepIndex].description, nextStepIndex, steps.length);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const prevStepIndex = currentStep - 1;
      setCurrentStep(prevStepIndex);
      setCurrentArray(steps[prevStepIndex].array);
      setPivotIndex(steps[prevStepIndex].pivotIndex);
      setPartitionRange({
        left: steps[prevStepIndex].left,
        right: steps[prevStepIndex].right
      });
    }
  };

  const reset = () => {
    setCurrentArray([...originalArray]);
    setSteps([]);
    setCurrentStep(0);
    setIsSorting(false);
    setPivotIndex(null);
    setPartitionRange(null);
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Quick Sort Visualizer</h2>
        <p className="text-muted-foreground">
          Watch how quick sort partitions around pivots and recursively sorts subarrays
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
            currentStepData.phase === 'partition' ? 'default' : 
            currentStepData.phase === 'swap' ? 'destructive' : 
            currentStepData.phase === 'pivot-place' ? 'secondary' : 'outline'
          }>
            {currentStepData.phase.toUpperCase().replace('-', ' ')}
          </Badge>
          <p className="text-sm">{currentStepData.description}</p>
        </div>
      )}

      {/* Array Visualization */}
      <div className="p-6 bg-gradient-visualization rounded-xl border-2 border-primary/20">
        <h3 className="text-lg font-semibold mb-4 text-center">Array Visualization</h3>
        <div className="flex justify-center">
          <div className="flex gap-1">
            {currentArray.map((value, index) => {
              let className = "w-12 h-12 flex items-center justify-center border-2 rounded text-sm font-semibold transition-colors";
              
              if (currentStepData) {
                if (index === currentStepData.pivotIndex) {
                  className += " bg-red-200 border-red-400"; // Pivot
                } else if (index === currentStepData.i) {
                  className += " bg-blue-200 border-blue-400"; // i pointer
                } else if (index === currentStepData.j) {
                  className += " bg-green-200 border-green-400"; // j pointer
                } else if (partitionRange && index >= partitionRange.left && index <= partitionRange.right) {
                  className += " bg-yellow-100 border-yellow-300"; // In current partition range
                } else {
                  className += " bg-gray-100 border-gray-300";
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

      {/* Partition Info */}
      {currentStepData && partitionRange && (
        <div className="text-center text-sm text-muted-foreground">
          <div>Partition Range: [{partitionRange.left}, {partitionRange.right}]</div>
          {currentStepData.pivotIndex >= 0 && (
            <div>Pivot: {currentArray[currentStepData.pivotIndex]} (index {currentStepData.pivotIndex})</div>
          )}
        </div>
      )}

      {/* Memory Layout */}
      {showMemory && (
        <MemoryLayout
          title="Array Memory Layout"
          data={currentArray}
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
