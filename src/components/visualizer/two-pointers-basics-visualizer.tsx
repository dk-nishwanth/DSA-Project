import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MousePointer2, RotateCcw, Target, ArrowLeftRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';
import { toast } from 'sonner';

interface TwoPointersStep {
  array: number[];
  left: number;
  right: number;
  target?: number;
  sum?: number;
  found: boolean;
  message: string;
  operation: 'init' | 'compare' | 'move-left' | 'move-right' | 'found' | 'not-found';
}

export function TwoPointersBasicsVisualizer() {
  const [inputArray, setInputArray] = useState('1,2,3,4,6,8,9,11');
  const [array, setArray] = useState<number[]>([1, 2, 3, 4, 6, 8, 9, 11]);
  const [target, setTarget] = useState(10);
  const [algorithm, setAlgorithm] = useState<'two-sum' | 'palindrome' | 'remove-duplicates'>('two-sum');
  const [steps, setSteps] = useState<TwoPointersStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
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

  const generateTwoSumSteps = (arr: number[], targetSum: number): TwoPointersStep[] => {
    const steps: TwoPointersStep[] = [];
    let left = 0;
    let right = arr.length - 1;

    steps.push({
      array: [...arr],
      left,
      right,
      target: targetSum,
      found: false,
      message: `Initialize: Looking for two numbers that sum to ${targetSum}. Start with left=0, right=${right}`,
      operation: 'init'
    });

    while (left < right) {
      const sum = arr[left] + arr[right];
      
      steps.push({
        array: [...arr],
        left,
        right,
        target: targetSum,
        sum,
        found: false,
        message: `Compare: arr[${left}] + arr[${right}] = ${arr[left]} + ${arr[right]} = ${sum}`,
        operation: 'compare'
      });

      if (sum === targetSum) {
        steps.push({
          array: [...arr],
          left,
          right,
          target: targetSum,
          sum,
          found: true,
          message: `✅ Found! arr[${left}] + arr[${right}] = ${arr[left]} + ${arr[right]} = ${sum} = target`,
          operation: 'found'
        });
        return steps;
      } else if (sum < targetSum) {
        steps.push({
          array: [...arr],
          left,
          right,
          target: targetSum,
          sum,
          found: false,
          message: `${sum} < ${targetSum}, need larger sum. Move left pointer right: ${left} → ${left + 1}`,
          operation: 'move-left'
        });
        left++;
      } else {
        steps.push({
          array: [...arr],
          left,
          right,
          target: targetSum,
          sum,
          found: false,
          message: `${sum} > ${targetSum}, need smaller sum. Move right pointer left: ${right} → ${right - 1}`,
          operation: 'move-right'
        });
        right--;
      }
    }

    steps.push({
      array: [...arr],
      left,
      right,
      target: targetSum,
      found: false,
      message: `❌ No solution found. Pointers have crossed (left >= right).`,
      operation: 'not-found'
    });

    return steps;
  };

  const generatePalindromeSteps = (str: string): TwoPointersStep[] => {
    const steps: TwoPointersStep[] = [];
    const chars = str.split('');
    let left = 0;
    let right = chars.length - 1;

    steps.push({
      array: chars.map(c => c.charCodeAt(0)), // Convert to numbers for visualization
      left,
      right,
      found: false,
      message: `Initialize: Checking if "${str}" is a palindrome. Start with left=0, right=${right}`,
      operation: 'init'
    });

    while (left < right) {
      steps.push({
        array: chars.map(c => c.charCodeAt(0)),
        left,
        right,
        found: false,
        message: `Compare: '${chars[left]}' vs '${chars[right]}' - ${chars[left] === chars[right] ? 'Match!' : 'No match!'}`,
        operation: 'compare'
      });

      if (chars[left] !== chars[right]) {
        steps.push({
          array: chars.map(c => c.charCodeAt(0)),
          left,
          right,
          found: false,
          message: `❌ Not a palindrome! '${chars[left]}' ≠ '${chars[right]}'`,
          operation: 'not-found'
        });
        return steps;
      }

      left++;
      right--;
      
      if (left < right) {
        steps.push({
          array: chars.map(c => c.charCodeAt(0)),
          left,
          right,
          found: false,
          message: `Characters match! Move pointers inward: left=${left}, right=${right}`,
          operation: 'move-left'
        });
      }
    }

    steps.push({
      array: chars.map(c => c.charCodeAt(0)),
      left,
      right,
      found: true,
      message: `✅ Palindrome confirmed! All character pairs matched.`,
      operation: 'found'
    });

    return steps;
  };

  const startVisualization = () => {
    if (algorithm === 'two-sum') {
      const nums = parseArray();
      if (!nums) return;
      
      // Check if array is sorted
      const isSorted = nums.every((val, i) => i === 0 || nums[i - 1] <= val);
      if (!isSorted) {
        toast.error('Array must be sorted for two-sum with two pointers');
        return;
      }

      const newSteps = generateTwoSumSteps(nums, target);
      setSteps(newSteps);
    } else if (algorithm === 'palindrome') {
      const testString = inputArray.replace(/,/g, '').toLowerCase();
      if (!testString) {
        toast.error('Please enter a string to check');
        return;
      }
      
      const newSteps = generatePalindromeSteps(testString);
      setSteps(newSteps);
    }

    setCurrentStep(0);

    if (voiceEnabled) {
      const algorithmName = algorithm === 'two-sum' ? 'Two Sum' : 'Palindrome Check';
      speakStep(`Starting ${algorithmName} visualization using two pointers technique. Watch how the pointers move intelligently.`);
    }

    toast.success(`${algorithm} visualization started`);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      
      if (voiceEnabled && steps[newStep]) {
        speakStep(steps[newStep].message);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      
      if (voiceEnabled && steps[newStep]) {
        speakStep(steps[newStep].message);
      }
    }
  };

  const reset = () => {
    setSteps([]);
    setCurrentStep(0);
    setInputArray('1,2,3,4,6,8,9,11');
    setTarget(10);
  };

  const renderArray = () => {
    if (steps.length === 0) return null;
    
    const currentStepData = steps[currentStep];
    
    return (
      <div className="flex justify-center gap-2 mb-6">
        {currentStepData.array.map((num, index) => {
          const isLeftPointer = index === currentStepData.left;
          const isRightPointer = index === currentStepData.right;
          const isInRange = index >= currentStepData.left && index <= currentStepData.right;
          
          // For palindrome, convert back to character
          const displayValue = algorithm === 'palindrome' ? String.fromCharCode(num) : num;
          
          return (
            <motion.div
              key={index}
              className={`relative w-14 h-14 flex items-center justify-center rounded-lg border-2 font-bold ${
                currentStepData.found && (isLeftPointer || isRightPointer)
                  ? 'bg-green-200 border-green-400 text-green-800'
                  : isLeftPointer || isRightPointer
                    ? 'bg-blue-200 border-blue-400 text-blue-800'
                    : isInRange
                      ? 'bg-purple-100 border-purple-300 text-purple-800'
                      : 'bg-gray-100 border-gray-300 text-gray-600'
              }`}
              initial={{ scale: 1 }}
              animate={{ scale: (isLeftPointer || isRightPointer) ? 1.1 : 1 }}
              transition={{ duration: 0.3 }}
            >
              {displayValue}
              
              {/* Pointer indicators */}
              {isLeftPointer && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  <div className="text-xs font-bold text-blue-600">L</div>
                  <div className="w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-blue-600"></div>
                </div>
              )}
              
              {isRightPointer && (
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
        <h3 className="text-2xl font-bold mb-2">Two Pointers Technique Visualizer</h3>
        <p className="text-muted-foreground">
          Master the two pointers pattern with interactive demonstrations of common algorithms
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Algorithm</label>
          <Select value={algorithm} onValueChange={(value: 'two-sum' | 'palindrome' | 'remove-duplicates') => setAlgorithm(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="two-sum">Two Sum (Sorted Array)</SelectItem>
              <SelectItem value="palindrome">Palindrome Check</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            {algorithm === 'two-sum' ? 'Sorted Array' : 'String to Check'}
          </label>
          <Input
            value={inputArray}
            onChange={(e) => setInputArray(e.target.value)}
            placeholder={algorithm === 'two-sum' ? 'e.g., 1,2,3,4,6,8,9,11' : 'e.g., racecar'}
          />
        </div>

        {algorithm === 'two-sum' && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Target Sum</label>
            <Input
              type="number"
              value={target}
              onChange={(e) => setTarget(parseInt(e.target.value) || 0)}
              placeholder="Target sum"
            />
          </div>
        )}

        <div className="flex gap-2 items-end">
          <Button onClick={startVisualization} className="flex items-center gap-2">
            <MousePointer2 className="h-4 w-4" />
            Start
          </Button>
          <Button onClick={reset} variant="outline">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Algorithm Description */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-2 mb-2">
          <Target className="h-4 w-4 text-blue-600" />
          <span className="font-semibold text-blue-800 dark:text-blue-200">
            {algorithm === 'two-sum' ? 'Two Sum Pattern' : 'Palindrome Check Pattern'}
          </span>
        </div>
        <div className="text-sm text-blue-700 dark:text-blue-300">
          {algorithm === 'two-sum' && 'Use two pointers from opposite ends. Move left pointer right if sum is too small, move right pointer left if sum is too large.'}
          {algorithm === 'palindrome' && 'Use two pointers from opposite ends. Compare characters and move inward. If any pair doesn\'t match, it\'s not a palindrome.'}
        </div>
      </div>

      {/* Visualization */}
      {steps.length > 0 && (
        <div className="bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-cyan-950 dark:to-blue-900 p-8 rounded-xl border-2 border-dashed border-cyan-200 dark:border-cyan-800">
          <div className="space-y-6">
            {/* Array Visualization */}
            {renderArray()}

            {/* Current State Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-sm text-muted-foreground">Left Pointer</div>
                  <div className="font-bold">
                    Index: {currentStepData?.left}, Value: {currentStepData ? (algorithm === 'palindrome' ? String.fromCharCode(currentStepData.array[currentStepData.left]) : currentStepData.array[currentStepData.left]) : 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Right Pointer</div>
                  <div className="font-bold">
                    Index: {currentStepData?.right}, Value: {currentStepData ? (algorithm === 'palindrome' ? String.fromCharCode(currentStepData.array[currentStepData.right]) : currentStepData.array[currentStepData.right]) : 'N/A'}
                  </div>
                </div>
                {algorithm === 'two-sum' && (
                  <>
                    <div>
                      <div className="text-sm text-muted-foreground">Current Sum</div>
                      <div className="font-bold text-2xl">{currentStepData?.sum || 0}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Target</div>
                      <div className="font-bold text-2xl text-green-600">{currentStepData?.target || 0}</div>
                    </div>
                  </>
                )}
              </div>
              
              <div className="mt-4 text-center">
                <div className="text-sm text-muted-foreground mb-2">Current Operation:</div>
                <div className="text-lg font-semibold">{currentStepData?.message}</div>
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

      {/* Two Pointers Patterns */}
      <div className="bg-card border rounded-lg p-4">
        <h4 className="font-semibold mb-4">Two Pointers Patterns:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="font-medium text-cyan-600">Opposite Direction</div>
            <div>• <strong>Two Sum:</strong> Find pair with target sum</div>
            <div>• <strong>Palindrome:</strong> Check string symmetry</div>
            <div>• <strong>Container Water:</strong> Find maximum area</div>
            <div>• <strong>3Sum:</strong> Find triplets with target sum</div>
          </div>
          <div className="space-y-2">
            <div className="font-medium text-blue-600">Same Direction</div>
            <div>• <strong>Remove Duplicates:</strong> In-place array modification</div>
            <div>• <strong>Merge Arrays:</strong> Combine sorted sequences</div>
            <div>• <strong>Partition:</strong> Separate elements by condition</div>
            <div>• <strong>Sliding Window:</strong> Variable window size problems</div>
          </div>
        </div>
      </div>

      {/* Complexity Analysis */}
      <div className="bg-card border rounded-lg p-4">
        <h4 className="font-semibold mb-4">Complexity Analysis:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="space-y-2">
            <div className="font-medium text-green-600">Time Complexity</div>
            <div>• <strong>Typical:</strong> O(n) - single pass</div>
            <div>• <strong>Advantage:</strong> Better than O(n²) brute force</div>
          </div>
          <div className="space-y-2">
            <div className="font-medium text-blue-600">Space Complexity</div>
            <div>• <strong>Space:</strong> O(1) - only pointer variables</div>
            <div>• <strong>In-place:</strong> No extra data structures needed</div>
          </div>
          <div className="space-y-2">
            <div className="font-medium text-purple-600">Requirements</div>
            <div>• <strong>Sorted Data:</strong> Often required for optimal movement</div>
            <div>• <strong>Monotonic:</strong> Pointers move in predictable direction</div>
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