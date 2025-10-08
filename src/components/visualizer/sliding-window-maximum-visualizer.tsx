import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, RotateCcw, Play, Pause, ArrowUp, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';
import { toast } from 'sonner';

interface SWMStep {
  array: number[];
  windowStart: number;
  windowEnd: number;
  windowSize: number;
  deque: number[]; // indices in deque
  currentMax: number;
  result: number[];
  message: string;
  operation: 'init' | 'add' | 'remove-back' | 'remove-front' | 'slide' | 'complete';
  highlightIndex?: number;
}

export function SlidingWindowMaximumVisualizer() {
  const [inputArray, setInputArray] = useState('1,3,-1,-3,5,3,6,7');
  const [array, setArray] = useState<number[]>([1, 3, -1, -3, 5, 3, 6, 7]);
  const [windowSize, setWindowSize] = useState(3);
  const [steps, setSteps] = useState<SWMStep[]>([]);
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
  } = useVisualizerVoice({ minInterval: 2500 });

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

  const generateSWMSteps = (arr: number[], k: number): SWMStep[] => {
    const steps: SWMStep[] = [];
    const deque: number[] = []; // Store indices
    const result: number[] = [];

    steps.push({
      array: [...arr],
      windowStart: 0,
      windowEnd: -1,
      windowSize: k,
      deque: [],
      currentMax: 0,
      result: [],
      message: `Initialize: Finding maximum in each window of size ${k}`,
      operation: 'init'
    });

    for (let i = 0; i < arr.length; i++) {
      // Remove elements outside current window from front
      while (deque.length > 0 && deque[0] <= i - k) {
        const removedIndex = deque.shift()!;
        steps.push({
          array: [...arr],
          windowStart: Math.max(0, i - k + 1),
          windowEnd: i,
          windowSize: k,
          deque: [...deque],
          currentMax: deque.length > 0 ? arr[deque[0]] : 0,
          result: [...result],
          message: `Remove index ${removedIndex} (value ${arr[removedIndex]}) from front - outside window`,
          operation: 'remove-front',
          highlightIndex: removedIndex
        });
      }

      // Remove elements from back while they are smaller than current element
      while (deque.length > 0 && arr[deque[deque.length - 1]] <= arr[i]) {
        const removedIndex = deque.pop()!;
        steps.push({
          array: [...arr],
          windowStart: Math.max(0, i - k + 1),
          windowEnd: i,
          windowSize: k,
          deque: [...deque],
          currentMax: deque.length > 0 ? arr[deque[0]] : arr[i],
          result: [...result],
          message: `Remove index ${removedIndex} (value ${arr[removedIndex]}) from back - dominated by ${arr[i]}`,
          operation: 'remove-back',
          highlightIndex: removedIndex
        });
      }

      // Add current element
      deque.push(i);
      steps.push({
        array: [...arr],
        windowStart: Math.max(0, i - k + 1),
        windowEnd: i,
        windowSize: k,
        deque: [...deque],
        currentMax: arr[deque[0]],
        result: [...result],
        message: `Add index ${i} (value ${arr[i]}) to deque`,
        operation: 'add',
        highlightIndex: i
      });

      // If we have a complete window, record the maximum
      if (i >= k - 1) {
        const max = arr[deque[0]];
        result.push(max);
        steps.push({
          array: [...arr],
          windowStart: i - k + 1,
          windowEnd: i,
          windowSize: k,
          deque: [...deque],
          currentMax: max,
          result: [...result],
          message: `Window [${i - k + 1}, ${i}] complete. Maximum: ${max} (at index ${deque[0]})`,
          operation: 'slide',
          highlightIndex: deque[0]
        });
      }
    }

    steps.push({
      array: [...arr],
      windowStart: arr.length - k,
      windowEnd: arr.length - 1,
      windowSize: k,
      deque: [...deque],
      currentMax: result[result.length - 1] || 0,
      result: [...result],
      message: `Complete! Sliding window maximums: [${result.join(', ')}]`,
      operation: 'complete'
    });

    return steps;
  };

  const startVisualization = () => {
    const nums = parseArray();
    if (!nums) return;

    if (windowSize <= 0 || windowSize > nums.length) {
      toast.error('Window size must be between 1 and array length');
      return;
    }

    const newSteps = generateSWMSteps(nums, windowSize);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);

    if (voiceEnabled) {
      speakStep('Sliding Window Maximum', `Finding maximum in each window of size ${windowSize} for array [${nums.join(', ')}]`);
    }

    toast.success('Sliding window maximum visualization started');
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);

      if (voiceEnabled && steps[newStep]) {
        speakStep('Maximum Step', steps[newStep].message, newStep, steps.length);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);

      if (voiceEnabled && steps[newStep]) {
        speakStep('Maximum Step', steps[newStep].message, newStep, steps.length);
      }
    }
  };

  const reset = () => {
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
    setInputArray('1,3,-1,-3,5,3,6,7');
    setWindowSize(3);
  };

  const renderArray = () => {
    if (steps.length === 0) return null;

    const currentStepData = steps[currentStep];

    return (
      <div className="space-y-4">
        {/* Array with window highlighting */}
        <div className="flex justify-center gap-2">
          {currentStepData.array.map((num, index) => {
            const isInWindow = index >= currentStepData.windowStart && index <= currentStepData.windowEnd && currentStepData.windowStart >= 0;
            const isHighlighted = index === currentStepData.highlightIndex;
            const isInDeque = currentStepData.deque.includes(index);
            const isMaximum = currentStepData.deque.length > 0 && index === currentStepData.deque[0];

            return (
              <motion.div
                key={index}
                className={`relative w-14 h-14 flex items-center justify-center rounded border-2 font-bold ${isMaximum
                  ? 'bg-green-200 border-green-400 text-green-800'
                  : isHighlighted
                    ? 'bg-yellow-200 border-yellow-400 text-yellow-800'
                    : isInDeque
                      ? 'bg-blue-200 border-blue-400 text-blue-800'
                      : isInWindow
                        ? 'bg-purple-100 border-purple-300 text-purple-800'
                        : 'bg-gray-100 border-gray-300 text-gray-600'
                  }`}
                initial={{ scale: 1 }}
                animate={{ scale: isHighlighted ? 1.2 : isMaximum ? 1.1 : 1 }}
                transition={{ duration: 0.3 }}
              >
                {num}

                {/* Maximum indicator */}
                {isMaximum && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                )}

                {/* Deque position indicator */}
                {isInDeque && !isMaximum && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
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

        {/* Window boundaries */}
        {currentStepData.windowStart >= 0 && (
          <div className="flex justify-center">
            <div className="text-sm text-muted-foreground">
              Current Window: [{currentStepData.windowStart}, {currentStepData.windowEnd}]
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderDeque = () => {
    if (steps.length === 0) return null;

    const currentStepData = steps[currentStep];

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
        <h4 className="font-semibold mb-3 text-center">Deque State (Monotonic Decreasing)</h4>
        <div className="space-y-3">
          {/* Deque visualization */}
          <div className="flex justify-center gap-2">
            <div className="text-sm font-medium self-center mr-2">Front →</div>
            {currentStepData.deque.length === 0 ? (
              <div className="px-4 py-2 border-2 border-dashed border-gray-300 rounded text-gray-500">
                Empty
              </div>
            ) : (
              currentStepData.deque.map((index, pos) => (
                <motion.div
                  key={`${index}-${pos}`}
                  className={`px-3 py-2 rounded border-2 font-bold ${pos === 0
                    ? 'bg-green-200 border-green-400 text-green-800'
                    : 'bg-blue-200 border-blue-400 text-blue-800'
                    }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center">
                    <div className="text-xs">idx: {index}</div>
                    <div className="font-bold">{currentStepData.array[index]}</div>
                  </div>
                </motion.div>
              ))
            )}
            <div className="text-sm font-medium self-center ml-2">← Back</div>
          </div>

          {/* Deque explanation */}
          <div className="text-xs text-center text-muted-foreground">
            Stores indices of potential maximums in decreasing order of values
          </div>
        </div>
      </div>
    );
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Sliding Window Maximum Visualizer</h3>
        <p className="text-muted-foreground">
          Find maximum in all subarrays of size k using deque optimization - O(n) time complexity
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Array (comma-separated)</label>
          <Input
            value={inputArray}
            onChange={(e) => setInputArray(e.target.value)}
            placeholder="e.g., 1,3,-1,-3,5,3,6,7"
          />
        </div>

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

        <div className="flex gap-2 items-end">
          <Button onClick={startVisualization} className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Start
          </Button>
          <Button onClick={reset} variant="outline">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Visualization */}
      {steps.length > 0 && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 p-8 rounded-xl border-2 border-dashed border-green-200 dark:border-green-800">
          <div className="space-y-6">
            {/* Array Visualization */}
            {renderArray()}

            {/* Deque State */}
            {renderDeque()}

            {/* Current State Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-sm text-muted-foreground">Current Window</div>
                  <div className="font-bold">
                    {currentStepData.windowStart >= 0
                      ? `[${currentStepData.windowStart}, ${currentStepData.windowEnd}]`
                      : 'Initializing'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Window Maximum</div>
                  <div className="font-bold text-green-600">{currentStepData.currentMax || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Deque Size</div>
                  <div className="font-bold">{currentStepData.deque.length}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Results So Far</div>
                  <div className="font-bold">
                    {currentStepData.result.length > 0 ? `[${currentStepData.result.join(', ')}]` : 'None'}
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
        <h4 className="font-semibold mb-4">Deque-Based Algorithm:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="font-medium text-green-600">Key Operations</div>
            <div>• <strong>Remove from front:</strong> Elements outside window</div>
            <div>• <strong>Remove from back:</strong> Elements smaller than current</div>
            <div>• <strong>Add to back:</strong> Current element index</div>
            <div>• <strong>Front element:</strong> Always the maximum</div>
          </div>
          <div className="space-y-2">
            <div className="font-medium text-blue-600">Complexity Analysis</div>
            <div>• <strong>Time:</strong> O(n) - each element added/removed once</div>
            <div>• <strong>Space:</strong> O(k) - deque holds at most k elements</div>
            <div>• <strong>Monotonic:</strong> Deque maintains decreasing order</div>
            <div>• <strong>Optimal:</strong> Better than O(n×k) naive approach</div>
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