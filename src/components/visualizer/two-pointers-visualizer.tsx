import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';
import { toast } from 'sonner';

interface TwoPointersStep {
  array: number[];
  left: number;
  right: number;
  sum: number;
  target: number;
  found: boolean;
  message: string;
}

export function TwoPointersVisualizer() {
  const [array, setArray] = useState<number[]>([1, 2, 3, 4, 6, 8, 9, 14, 15]);
  const [target, setTarget] = useState(10);
  const [steps, setSteps] = useState<TwoPointersStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [inputArray, setInputArray] = useState('1,2,3,4,6,8,9,14,15');
  const [inputTarget, setInputTarget] = useState('10');
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
    speakStep,
    speakOperation,
    speakResult
  } = useVisualizerVoice({ minInterval: 2000 });

  const generateSteps = (arr: number[], targetSum: number): TwoPointersStep[] => {
    const steps: TwoPointersStep[] = [];
    let left = 0;
    let right = arr.length - 1;

    steps.push({
      array: [...arr],
      left,
      right,
      sum: arr[left] + arr[right],
      target: targetSum,
      found: false,
      message: `Initialize: left = ${left}, right = ${right}`
    });

    while (left < right) {
      const sum = arr[left] + arr[right];
      
      steps.push({
        array: [...arr],
        left,
        right,
        sum,
        target: targetSum,
        found: false,
        message: `Check: arr[${left}] + arr[${right}] = ${arr[left]} + ${arr[right]} = ${sum}`
      });

      if (sum === targetSum) {
        steps.push({
          array: [...arr],
          left,
          right,
          sum,
          target: targetSum,
          found: true,
          message: `Found! Pair at indices ${left} and ${right}: ${arr[left]} + ${arr[right]} = ${sum}`
        });
        break;
      } else if (sum < targetSum) {
        left++;
        steps.push({
          array: [...arr],
          left,
          right,
          sum: left < right ? arr[left] + arr[right] : 0,
          target: targetSum,
          found: false,
          message: `Sum too small, move left pointer right: left = ${left}`
        });
      } else {
        right--;
        steps.push({
          array: [...arr],
          left,
          right,
          sum: left < right ? arr[left] + arr[right] : 0,
          target: targetSum,
          found: false,
          message: `Sum too large, move right pointer left: right = ${right}`
        });
      }
    }

    if (left >= right && !steps[steps.length - 1].found) {
      steps.push({
        array: [...arr],
        left,
        right,
        sum: 0,
        target: targetSum,
        found: false,
        message: `No pair found that sums to ${targetSum}`
      });
    }

    return steps;
  };

  const handleSort = () => {
    // Ensure array is sorted for two pointers to work
    const sortedArray = [...array].sort((a, b) => a - b);
    setArray(sortedArray);
    const newSteps = generateSteps(sortedArray, target);
    setSteps(newSteps);
    setCurrentStep(0);
  };

  const handlePlay = () => {
    if (steps.length === 0) {
      handleSort();
      return;
    }
    
    speakOperation("Two Pointers Technique", `Starting two pointers algorithm to find pair that sums to ${target}. We'll use left and right pointers moving towards each other.`);
    
    setIsPlaying(true);
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        const nextStep = prev + 1;
        if (nextStep < steps.length) {
          const stepData = steps[nextStep];
          speakStep("", stepData.message, nextStep + 1, steps.length);
          
          if (stepData.found) {
            speakResult(`Success! Found pair at indices ${stepData.left} and ${stepData.right}: ${stepData.array[stepData.left]} + ${stepData.array[stepData.right]} = ${stepData.sum}`);
          }
        }
        
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          clearInterval(interval);
          if (!steps[steps.length - 1].found) {
            speakResult(`No pair found that sums to ${target}. Two pointers technique completed.`);
          }
          return prev;
        }
        return nextStep;
      });
    }, 1500);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleInputChange = () => {
    try {
      const newArray = inputArray.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
      const newTarget = parseInt(inputTarget);
      
      if (newArray.length > 0 && !isNaN(newTarget)) {
        setArray(newArray.sort((a, b) => a - b));
        setTarget(newTarget);
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
    left: 0,
    right: array.length - 1,
    sum: array[0] + array[array.length - 1],
    target: target,
    found: false,
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
        </div>

        <div className="flex gap-2 items-center">
          <Input
            value={inputArray}
            onChange={(e) => setInputArray(e.target.value)}
            placeholder="Enter sorted numbers"
            className="w-48"
          />
          <Input
            value={inputTarget}
            onChange={(e) => setInputTarget(e.target.value)}
            placeholder="Target sum"
            className="w-24"
          />
          <Button onClick={handleInputChange} variant="outline">
            Set Values
          </Button>
        </div>
      </div>

      {/* Progress */}
      {steps.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Step {currentStep + 1} of {steps.length}
        </div>
      )}

      {/* Target Display */}
      <div className="flex items-center justify-center gap-2 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
        <Target className="h-5 w-5 text-blue-600" />
        <span className="font-semibold">Target Sum: {currentStepData.target}</span>
        <span className="text-muted-foreground">|</span>
        <span className={`font-semibold ${currentStepData.found ? 'text-green-600' : 'text-orange-600'}`}>
          Current Sum: {currentStepData.sum}
        </span>
      </div>

      {/* Visualization */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950 dark:to-pink-900 p-8 rounded-xl border-2 border-dashed border-purple-200 dark:border-purple-800">
        <div className="flex items-center justify-center gap-2 mb-8">
          {currentStepData.array.map((value, index) => {
            const isLeft = index === currentStepData.left;
            const isRight = index === currentStepData.right;
            const isBetween = index > currentStepData.left && index < currentStepData.right;
            
            let bgColor = 'bg-gray-300 dark:bg-gray-600';
            let textColor = 'text-gray-700 dark:text-gray-300';
            
            if (isLeft) {
              bgColor = 'bg-blue-500';
              textColor = 'text-white';
            } else if (isRight) {
              bgColor = 'bg-red-500';
              textColor = 'text-white';
            } else if (isBetween) {
              bgColor = 'bg-yellow-200 dark:bg-yellow-800';
              textColor = 'text-yellow-800 dark:text-yellow-200';
            }

            if (currentStepData.found && (isLeft || isRight)) {
              bgColor = 'bg-green-500';
              textColor = 'text-white';
            }

            return (
              <motion.div
                key={index}
                className={`${bgColor} ${textColor} rounded-lg p-4 min-w-[60px] text-center font-bold relative`}
                initial={{ scale: 1 }}
                animate={{ 
                  scale: (isLeft || isRight) ? 1.1 : 1,
                  y: (isLeft || isRight) ? -5 : 0
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-lg">{value}</div>
                <div className="text-xs mt-1 opacity-75">[{index}]</div>
                
                {isLeft && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
                      Left
                    </div>
                  </div>
                )}
                
                {isRight && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                    <div className="bg-red-500 text-white px-2 py-1 rounded text-xs">
                      Right
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Message */}
        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
          <p className="text-sm font-medium">{currentStepData.message}</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>Left Pointer</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>Right Pointer</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-200 border border-yellow-400 rounded"></div>
          <span>Search Space</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Found Pair</span>
        </div>
      </div>

      {/* Algorithm Info */}
      <div className="bg-card border rounded-lg p-4">
        <h4 className="font-semibold mb-2">Two Pointers Technique:</h4>
        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
          <li>Start with pointers at both ends of the sorted array</li>
          <li>Calculate sum of elements at both pointers</li>
          <li>If sum equals target, we found the pair</li>
          <li>If sum is less than target, move left pointer right</li>
          <li>If sum is greater than target, move right pointer left</li>
          <li>Continue until pointers meet or pair is found</li>
        </ol>
      </div>
    </div>
  );
}