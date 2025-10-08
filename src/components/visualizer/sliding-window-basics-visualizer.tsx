import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Target, ArrowRight, RotateCcw, Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';
import { toast } from 'sonner';

interface WindowStep {
  array: number[];
  left: number;
  right: number;
  windowSum: number;
  windowElements: number[];
  target?: number;
  windowSize?: number;
  found: boolean;
  message: string;
  operation: 'init' | 'expand' | 'shrink' | 'found' | 'complete';
}

export function SlidingWindowBasicsVisualizer() {
  const [inputArray, setInputArray] = useState('2,1,2,3,4,3,4,5,6');
  const [array, setArray] = useState<number[]>([2, 1, 2, 3, 4, 3, 4, 5, 6]);
  const [target, setTarget] = useState(7);
  const [windowSize, setWindowSize] = useState(3);
  const [mode, setMode] = useState<'target-sum' | 'fixed-max'>('target-sum');
  const [steps, setSteps] = useState<WindowStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
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
    speakStep
  } = useVisualizerVoice({ minInterval: 2000 });

  const parseArray = () => {
    try {
      const nums = inputArray.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
      if (nums.length === 0) {
        toast.error('Please enter valid numbers');
        return null;
      }
      setArray(nums);
      return nums;
    } catch (error) {
      toast.error('Invalid array format');
      return null;
    }
  };

  const generateTargetSumSteps = (arr: number[], targetSum: number): WindowStep[] => {
    const steps: WindowStep[] = [];
    let left = 0, right = 0;
    let currentSum = 0;

    steps.push({
      array: [...arr],
      left: 0,
      right: -1,
      windowSum: 0,
      windowElements: [],
      target: targetSum,
      found: false,
      message: `Initialize: Looking for subarray with sum ${targetSum}`,
      operation: 'init'
    });

    while (right < arr.length) {
      // Expand window
      right++;
      if (right < arr.length) {
        currentSum += arr[right];
        const windowElements = arr.slice(left, right + 1);
        
        steps.push({
          array: [...arr],
          left,
          right,
          windowSum: currentSum,
          windowElements: [...windowElements],
          target: targetSum,
          found: currentSum === targetSum,
          message: `Expand: Add arr[${right}] = ${arr[right]}, sum = ${currentSum}${currentSum === targetSum ? ' ✓ Found!' : currentSum > targetSum ? ' (too large)' : ' (need more)'}`,
          operation: currentSum === targetSum ? 'found' : 'expand'
        });

        if (currentSum === targetSum) {
          return steps;
        }

        // Shrink window while sum is too large
        while (currentSum > targetSum && left <= right) {
          currentSum -= arr[left];
          left++;
          const newWindowElements = left <= right ? arr.slice(left, right + 1) : [];
          
          steps.push({
            array: [...arr],
            left,
            right,
            windowSum: currentSum,
            windowElements: [...newWindowElements],
            target: targetSum,
            found: currentSum === targetSum && left <= right,
            message: `Shrink: Remove arr[${left - 1}] = ${arr[left - 1]}, sum = ${currentSum}${currentSum === targetSum && left <= right ? ' ✓ Found!' : ''}`,
            operation: currentSum === targetSum && left <= right ? 'found' : 'shrink'
          });

          if (currentSum === targetSum && left <= right) {
            return steps;
          }
        }
      }
    }

    steps.push({
      array: [...arr],
      left: -1,
      right: -1,
      windowSum: 0,
      windowElements: [],
      target: targetSum,
      found: false,
      message: `Complete: No subarray found with sum ${targetSum}`,
      operation: 'complete'
    });

    return steps;
  };

  const generateFixedMaxSteps = (arr: number[], k: number): WindowStep[] => {
    const steps: WindowStep[] = [];
    let maxSum = 0;
    let currentSum = 0;
    let maxStart = 0;

    steps.push({
      array: [...arr],
      left: 0,
      right: -1,
      windowSum: 0,
      windowElements: [],
      windowSize: k,
      found: false,
      message: `Initialize: Finding maximum sum of ${k} consecutive elements`,
      operation: 'init'
    });

    // Calculate sum of first window
    for (let i = 0; i < k && i < arr.length; i++) {
      currentSum += arr[i];
      steps.push({
        array: [...arr],
        left: 0,
        right: i,
        windowSum: currentSum,
        windowElements: arr.slice(0, i + 1),
        windowSize: k,
        found: false,
        message: `Building first window: Add arr[${i}] = ${arr[i]}, sum = ${currentSum}`,
        operation: 'expand'
      });
    }

    maxSum = currentSum;
    maxStart = 0;

    steps.push({
      array: [...arr],
      left: 0,
      right: k - 1,
      windowSum: currentSum,
      windowElements: arr.slice(0, k),
      windowSize: k,
      found: true,
      message: `First window complete: sum = ${currentSum} (current max)`,
      operation: 'found'
    });

    // Slide the window
    for (let i = k; i < arr.length; i++) {
      currentSum = currentSum - arr[i - k] + arr[i];
      const isNewMax = currentSum > maxSum;
      
      if (isNewMax) {
        maxSum = currentSum;
        maxStart = i - k + 1;
      }

      steps.push({
        array: [...arr],
        left: i - k + 1,
        right: i,
        windowSum: currentSum,
        windowElements: arr.slice(i - k + 1, i + 1),
        windowSize: k,
        found: isNewMax,
        message: `Slide window: Remove arr[${i - k}] = ${arr[i - k]}, add arr[${i}] = ${arr[i]}, sum = ${currentSum}${isNewMax ? ' ✓ New max!' : ''}`,
        operation: isNewMax ? 'found' : 'expand'
      });
    }

    steps.push({
      array: [...arr],
      left: maxStart,
      right: maxStart + k - 1,
      windowSum: maxSum,
      windowElements: arr.slice(maxStart, maxStart + k),
      windowSize: k,
      found: true,
      message: `Complete: Maximum sum is ${maxSum} at window [${maxStart}, ${maxStart + k - 1}]`,
      operation: 'complete'
    });

    return steps;
  };

  const startVisualization = () => {
    const nums = parseArray();
    if (!nums) return;

    let newSteps: WindowStep[] = [];
    
    if (mode === 'target-sum') {
      newSteps = generateTargetSumSteps(nums, target);
    } else {
      newSteps = generateFixedMaxSteps(nums, windowSize);
    }

    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);

    if (voiceEnabled) {
      const modeText = mode === 'target-sum' ? `subarray with sum ${target}` : `maximum sum of ${windowSize} consecutive elements`;
      speakStep('Sliding Window Start', `Starting visualization to find ${modeText} in array [${nums.join(', ')}]`);
    }

    toast.success('Sliding window visualization started');
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      
      if (voiceEnabled && steps[newStep]) {
        speakStep('Window Step', steps[newStep].message, newStep, steps.length);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      
      if (voiceEnabled && steps[newStep]) {
        speakStep('Window Step', steps[newStep].message, newStep, steps.length);
      }
    }
  };

  const reset = () => {
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
    setInputArray('2,1,2,3,4,3,4,5,6');
    setTarget(7);
    setWindowSize(3);
  };

  const renderArray = () => {
    if (steps.length === 0) return null;
    
    const currentStepData = steps[currentStep];
    
    return (
      <div className="flex justify-center gap-2 mb-6">
        {currentStepData.array.map((num, index) => {
          const isInWindow = index >= currentStepData.left && index <= currentStepData.right && currentStepData.left >= 0;
          const isLeftPointer = index === currentStepData.left;
          const isRightPointer = index === currentStepData.right;
          
          return (
            <motion.div
              key={index}
              className={`relative w-12 h-12 flex items-center justify-center rounded border-2 font-bold ${
                isInWindow 
                  ? currentStepData.found && currentStepData.operation === 'found'
                    ? 'bg-green-200 border-green-400 text-green-800'
                    : 'bg-blue-200 border-blue-400 text-blue-800'
                  : 'bg-gray-100 border-gray-300 text-gray-600'
              }`}
              initial={{ scale: 1 }}
              animate={{ scale: isInWindow ? 1.1 : 1 }}
              transition={{ duration: 0.3 }}
            >
              {num}
              
              {/* Pointer indicators */}
              {isLeftPointer && currentStepData.left >= 0 && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  <div className="text-xs font-bold text-blue-600">L</div>
                  <div className="w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-blue-600"></div>
                </div>
              )}
              
              {isRightPointer && currentStepData.right >= 0 && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  <div className="text-xs font-bold text-red-600">R</div>
                  <div className="w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-red-600"></div>
                </div>
              )}
              
              {/* Index labels */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
                {index}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Sliding Window Basics Visualizer</h3>
        <p className="text-muted-foreground">
          Learn the fundamental sliding window patterns with interactive demonstrations
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Array (comma-separated)</label>
          <Input
            value={inputArray}
            onChange={(e) => setInputArray(e.target.value)}
            placeholder="e.g., 2,1,2,3,4"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Algorithm Type</label>
          <Select value={mode} onValueChange={(value: 'target-sum' | 'fixed-max') => setMode(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="target-sum">Variable Window (Target Sum)</SelectItem>
              <SelectItem value="fixed-max">Fixed Window (Max Sum)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {mode === 'target-sum' ? (
          <div className="space-y-2">
            <label className="text-sm font-medium">Target Sum</label>
            <Input
              type="number"
              value={target}
              onChange={(e) => setTarget(parseInt(e.target.value) || 0)}
              placeholder="Target sum"
            />
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-sm font-medium">Window Size</label>
            <Input
              type="number"
              value={windowSize}
              onChange={(e) => setWindowSize(parseInt(e.target.value) || 1)}
              placeholder="Window size"
              min="1"
            />
          </div>
        )}

        <div className="flex gap-2 items-end">
          <Button onClick={startVisualization} className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Start
          </Button>
          <Button onClick={reset} variant="outline">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Visualization */}
      {steps.length > 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-950 dark:to-cyan-900 p-8 rounded-xl border-2 border-dashed border-blue-200 dark:border-blue-800">
          <div className="space-y-6">
            {/* Array Visualization */}
            {renderArray()}

            {/* Current State Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-sm text-muted-foreground">Window</div>
                  <div className="font-bold">
                    {currentStepData.left >= 0 && currentStepData.right >= 0 
                      ? `[${currentStepData.left}, ${currentStepData.right}]` 
                      : 'None'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Elements</div>
                  <div className="font-bold">
                    {currentStepData.windowElements.length > 0 
                      ? `[${currentStepData.windowElements.join(', ')}]` 
                      : 'None'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Sum</div>
                  <div className="font-bold">{currentStepData.windowSum}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    {mode === 'target-sum' ? 'Target' : 'Window Size'}
                  </div>
                  <div className="font-bold">
                    {mode === 'target-sum' ? currentStepData.target : currentStepData.windowSize}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <div className="text-sm text-muted-foreground mb-2">Current Operation:</div>
                <div className="text-lg font-semibold">{currentStepData.message}</div>
              </div>
            </div>

            {/* Step Controls */}
            <div className="flex justify-center gap-4">
              <Button 
                onClick={prevStep} 
                disabled={currentStep === 0}
                variant="outline"
              >
                Previous
              </Button>
              <Badge variant="secondary" className="px-4 py-2">
                Step {currentStep + 1} of {steps.length}
              </Badge>
              <Button 
                onClick={nextStep} 
                disabled={currentStep === steps.length - 1}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Algorithm Explanation */}
      <div className="bg-card border rounded-lg p-4">
        <h4 className="font-semibold mb-4">Sliding Window Patterns:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="font-medium text-blue-600">Variable Size Window</div>
            <div>• Expand window when condition not met</div>
            <div>• Shrink window when condition exceeded</div>
            <div>• Used for: target sum, longest substring</div>
            <div>• Time: O(n), Space: O(1)</div>
          </div>
          <div className="space-y-2">
            <div className="font-medium text-green-600">Fixed Size Window</div>
            <div>• Window size remains constant</div>
            <div>• Slide window by removing left, adding right</div>
            <div>• Used for: max sum of k elements, averages</div>
            <div>• Time: O(n), Space: O(1)</div>
          </div>
        </div>
      </div>

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