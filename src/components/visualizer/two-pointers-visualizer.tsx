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
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <Input className="w-72" value={inputArray} onChange={(e)=>setInputArray(e.target.value)} />
        <Input className="w-24" value={inputTarget} onChange={(e)=>setInputTarget(e.target.value)} />
        <Button onClick={handleInputChange}>Set</Button>
        <Button onClick={handleSort}>Prepare</Button>
        <Button onClick={handlePlay} disabled={isPlaying}>Play</Button>
        <Button onClick={handlePause} variant="outline">Pause</Button>
        <Button onClick={handleReset} variant="secondary">Reset</Button>
      </div>

      {/* Target Display */}
      <div className="flex items-center justify-center gap-2 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
        <Target className="h-5 w-5 text-blue-600" />
        <span className="font-semibold">Target Sum: {currentStepData.target}</span>
        <span className="text-muted-foreground">|</span>
        <span className={`font-semibold ${currentStepData.found ? 'text-green-600' : 'text-orange-600'}`}>
          Current Sum: {currentStepData.sum}
        </span>
      </div>

      {/* Enhanced Visualization */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950 dark:to-pink-900 p-8 rounded-xl border-2 border-dashed border-purple-200 dark:border-purple-800">
        <div className="flex items-center justify-center gap-2 mb-8">
          {currentStepData.array.map((value, index) => {
            const isLeft = index === currentStepData.left;
            const isRight = index === currentStepData.right;
            const isBetween = index > currentStepData.left && index < currentStepData.right;
            const isPair = currentStepData.found && (isLeft || isRight);
            
            return (
              <motion.div 
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {/* Array element */}
                <motion.div
                  className={`
                    w-12 h-12 flex items-center justify-center rounded-lg border-2 font-mono text-lg
                    ${isPair ? 'bg-green-200 border-green-500 dark:bg-green-800 dark:border-green-500' : 
                      isLeft ? 'bg-blue-200 border-blue-500 dark:bg-blue-800 dark:border-blue-500' : 
                      isRight ? 'bg-red-200 border-red-500 dark:bg-red-800 dark:border-red-500' : 
                      isBetween ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800' : 
                      'bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-600'}
                    transition-all duration-300 ease-in-out
                    ${isPair ? 'shadow-lg shadow-green-200 dark:shadow-green-900/30' : ''}
                  `}
                  animate={isPair ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5, repeat: isPair ? Infinity : 0, repeatType: "reverse" }}
                >
                  {value}
                </motion.div>
                
                {/* Index number */}
                <div className="text-xs text-center text-muted-foreground mt-1">{index}</div>
                
                {/* Pointer indicators */}
                {isLeft && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                    <div className="flex flex-col items-center">
                      <motion.div 
                        className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-blue-500"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      <div className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-sm">
                        Left
                      </div>
                    </div>
                  </div>
                )}
                
                {isRight && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                    <div className="flex flex-col items-center">
                      <motion.div 
                        className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-red-500"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      <div className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-sm">
                        Right
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Search space indicator */}
        <div className="relative h-2 mx-auto mb-6 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden" style={{ width: `${currentStepData.array.length * 48}px` }}>
          <motion.div 
            className="absolute h-full bg-yellow-300 dark:bg-yellow-600"
            style={{ 
              left: `${currentStepData.left * 48}px`, 
              width: `${(currentStepData.right - currentStepData.left + 1) * 48}px` 
            }}
            initial={{ width: '100%' }}
            animate={{ 
              left: `${currentStepData.left * 48}px`, 
              width: `${(currentStepData.right - currentStepData.left + 1) * 48}px` 
            }}
            transition={{ duration: 0.5 }}
          />
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
          title="Array Memory"
          baseAddress={10200}
          wordSize={4}
        />
      )}
    </div>
  );
}