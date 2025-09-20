import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Play, Pause, SkipForward } from 'lucide-react';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVoiceExplain } from '@/hooks/useVoiceExplain';

interface MergeStep {
  array: number[];
  left: number;
  right: number;
  mid: number;
  phase: 'divide' | 'merge' | 'complete';
  description: string;
  leftArray?: number[];
  rightArray?: number[];
  mergedArray?: number[];
}

export function MergeSortVisualizer() {
  const [originalArray, setOriginalArray] = useState<number[]>([38, 27, 43, 3, 9, 82, 10]);
  const [input, setInput] = useState('38,27,43,3,9,82,10');
  const [currentArray, setCurrentArray] = useState<number[]>([38, 27, 43, 3, 9, 82, 10]);
  const [isSorting, setIsSorting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<MergeStep[]>([]);
  const [showMemory, setShowMemory] = useState(false);
  const [memoryAddresses, setMemoryAddresses] = useState<number[]>([]);
  
  const [voiceText, setVoiceText] = useState('');
  const { enabled: voiceEnabled, setEnabled: setVoiceEnabled } = useVoiceExplain(voiceText);

  const generateMemoryAddresses = () => {
    const baseAddress = 0x2000;
    return currentArray.map((_, index) => baseAddress + (index * 4));
  };

  useEffect(() => {
    setMemoryAddresses(generateMemoryAddresses());
  }, [currentArray]);

  const updateFromInput = () => {
    const nums = input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    if (nums.length > 0) {
      setOriginalArray(nums);
      setCurrentArray(nums);
      setSteps([]);
      setCurrentStep(0);
    }
  };

  const generateMergeSortSteps = (arr: number[]): MergeStep[] => {
    const steps: MergeStep[] = [];
    const workingArray = [...arr];
    
    const mergeSortRecursive = (array: number[], left: number, right: number, depth: number = 0) => {
      if (left >= right) return;
      
      const mid = Math.floor((left + right) / 2);
      
      // Divide step
      steps.push({
        array: [...array],
        left,
        right,
        mid,
        phase: 'divide',
        description: `Divide array [indices ${left}-${right}] at position ${mid}`,
        leftArray: array.slice(left, mid + 1),
        rightArray: array.slice(mid + 1, right + 1)
      });
      
      // Recursively sort left and right halves
      mergeSortRecursive(array, left, mid, depth + 1);
      mergeSortRecursive(array, mid + 1, right, depth + 1);
      
      // Merge step
      const leftArray = array.slice(left, mid + 1);
      const rightArray = array.slice(mid + 1, right + 1);
      const merged: number[] = [];
      
      let i = 0, j = 0;
      while (i < leftArray.length && j < rightArray.length) {
        if (leftArray[i] <= rightArray[j]) {
          merged.push(leftArray[i++]);
        } else {
          merged.push(rightArray[j++]);
        }
      }
      
      while (i < leftArray.length) merged.push(leftArray[i++]);
      while (j < rightArray.length) merged.push(rightArray[j++]);
      
      // Update the array with merged result
      for (let k = 0; k < merged.length; k++) {
        array[left + k] = merged[k];
      }
      
      steps.push({
        array: [...array],
        left,
        right,
        mid,
        phase: 'merge',
        description: `Merge sorted subarrays: [${leftArray.join(', ')}] and [${rightArray.join(', ')}] → [${merged.join(', ')}]`,
        leftArray,
        rightArray,
        mergedArray: merged
      });
    };
    
    mergeSortRecursive(workingArray, 0, workingArray.length - 1);
    
    steps.push({
      array: [...workingArray],
      left: 0,
      right: workingArray.length - 1,
      mid: 0,
      phase: 'complete',
      description: 'Merge sort completed! Array is now fully sorted.'
    });
    
    return steps;
  };

  const startSorting = () => {
    const sortSteps = generateMergeSortSteps(originalArray);
    setSteps(sortSteps);
    setCurrentStep(0);
    setIsSorting(true);
    
    if (voiceEnabled) {
      setVoiceText("Starting merge sort visualization. We'll divide the array recursively and then merge the sorted parts.");
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      const nextStepIndex = currentStep + 1;
      setCurrentStep(nextStepIndex);
      setCurrentArray(steps[nextStepIndex].array);
      
      if (voiceEnabled) {
        setVoiceText(steps[nextStepIndex].description);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const prevStepIndex = currentStep - 1;
      setCurrentStep(prevStepIndex);
      setCurrentArray(steps[prevStepIndex].array);
    }
  };

  const reset = () => {
    setCurrentArray([...originalArray]);
    setSteps([]);
    setCurrentStep(0);
    setIsSorting(false);
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Merge Sort Visualizer</h2>
        <p className="text-muted-foreground">
          Watch how merge sort divides the array and merges sorted subarrays
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
          <Badge className="mb-2" variant={currentStepData.phase === 'divide' ? 'destructive' : currentStepData.phase === 'merge' ? 'default' : 'secondary'}>
            {currentStepData.phase.toUpperCase()}
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
                if (currentStepData.phase === 'divide' && index >= currentStepData.left && index <= currentStepData.right) {
                  if (index <= currentStepData.mid) {
                    className += " bg-blue-200 border-blue-400";
                  } else {
                    className += " bg-green-200 border-green-400";
                  }
                } else if (currentStepData.phase === 'merge' && index >= currentStepData.left && index <= currentStepData.right) {
                  className += " bg-yellow-200 border-yellow-400";
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

      {/* Subarrays Display */}
      {currentStepData && (currentStepData.leftArray || currentStepData.rightArray) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentStepData.leftArray && (
            <div className="text-center">
              <h4 className="font-semibold mb-2">Left Subarray</h4>
              <div className="flex gap-1 justify-center">
                {currentStepData.leftArray.map((value, index) => (
                  <div key={index} className="w-10 h-10 flex items-center justify-center bg-blue-200 border border-blue-400 rounded text-sm">
                    {value}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {currentStepData.rightArray && (
            <div className="text-center">
              <h4 className="font-semibold mb-2">Right Subarray</h4>
              <div className="flex gap-1 justify-center">
                {currentStepData.rightArray.map((value, index) => (
                  <div key={index} className="w-10 h-10 flex items-center justify-center bg-green-200 border border-green-400 rounded text-sm">
                    {value}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Merged Result */}
      {currentStepData && currentStepData.mergedArray && (
        <div className="text-center">
          <h4 className="font-semibold mb-2">Merged Result</h4>
          <div className="flex gap-1 justify-center">
            {currentStepData.mergedArray.map((value, index) => (
              <div key={index} className="w-10 h-10 flex items-center justify-center bg-yellow-200 border border-yellow-400 rounded text-sm">
                {value}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Memory Layout */}
      {showMemory && (
        <MemoryLayout
          title="Array Memory Layout"
          data={currentArray}
          baseAddress={0x2000}
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
    </div>
  );
}
