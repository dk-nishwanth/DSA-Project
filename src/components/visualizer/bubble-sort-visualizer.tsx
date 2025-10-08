import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, ArrowUpDown, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';
import { toast } from 'sonner';

interface BubbleSortStep {
  array: number[];
  comparing: [number, number] | null;
  swapping: [number, number] | null;
  sorted: number[];
  pass: number;
  comparisons: number;
  swaps: number;
  message: string;
  isComplete: boolean;
}

export function BubbleSortVisualizer() {
  const [inputArray, setInputArray] = useState('64,34,25,12,22,11,90');
  const [array, setArray] = useState<number[]>([64, 34, 25, 12, 22, 11, 90]);
  const [steps, setSteps] = useState<BubbleSortStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [showMemory, setShowMemory] = useState(false);
  
  const {
    voiceEnabled,
    setVoiceEnabled,
    voiceSpeed,
    setVoiceSpeed,
    isSpeaking,
    pauseSpeech,
    resumeSpeech,
    stopSpeech,
    speakStep
  } = useVisualizerVoice({ minInterval: 1500 });

  const parseArray = () => {
    try {
      const nums = inputArray.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
      if (nums.length === 0 || nums.length > 12) {
        toast.error('Please enter 1-12 valid numbers');
        return null;
      }
      setArray(nums);
      return nums;
    } catch (error) {
      toast.error('Invalid array format');
      return null;
    }
  };

  const generateBubbleSortSteps = (arr: number[]): BubbleSortStep[] => {
    const steps: BubbleSortStep[] = [];
    const workingArray = [...arr];
    const n = workingArray.length;
    let comparisons = 0;
    let swaps = 0;
    const sorted: number[] = [];

    // Initial state
    steps.push({
      array: [...workingArray],
      comparing: null,
      swapping: null,
      sorted: [],
      pass: 0,
      comparisons: 0,
      swaps: 0,
      message: `Starting Bubble Sort with ${n} elements. We'll make ${n-1} passes through the array.`,
      isComplete: false
    });

    for (let pass = 0; pass < n - 1; pass++) {
      let swappedInThisPass = false;
      
      steps.push({
        array: [...workingArray],
        comparing: null,
        swapping: null,
        sorted: [...sorted],
        pass: pass + 1,
        comparisons,
        swaps,
        message: `Pass ${pass + 1}: Comparing adjacent elements. Largest element will "bubble up" to position ${n - pass - 1}.`,
        isComplete: false
      });

      for (let i = 0; i < n - pass - 1; i++) {
        // Comparing step
        comparisons++;
        steps.push({
          array: [...workingArray],
          comparing: [i, i + 1],
          swapping: null,
          sorted: [...sorted],
          pass: pass + 1,
          comparisons,
          swaps,
          message: `Comparing ${workingArray[i]} and ${workingArray[i + 1]}. ${workingArray[i] > workingArray[i + 1] ? 'Need to swap!' : 'Already in order.'}`,
          isComplete: false
        });

        if (workingArray[i] > workingArray[i + 1]) {
          // Swapping step
          swaps++;
          swappedInThisPass = true;
          
          steps.push({
            array: [...workingArray],
            comparing: null,
            swapping: [i, i + 1],
            sorted: [...sorted],
            pass: pass + 1,
            comparisons,
            swaps,
            message: `Swapping ${workingArray[i]} and ${workingArray[i + 1]} because ${workingArray[i]} > ${workingArray[i + 1]}`,
            isComplete: false
          });

          // Perform the swap
          [workingArray[i], workingArray[i + 1]] = [workingArray[i + 1], workingArray[i]];

          // Show result after swap
          steps.push({
            array: [...workingArray],
            comparing: null,
            swapping: null,
            sorted: [...sorted],
            pass: pass + 1,
            comparisons,
            swaps,
            message: `Swapped! Array is now: [${workingArray.join(', ')}]`,
            isComplete: false
          });
        }
      }

      // Mark the last element as sorted
      sorted.unshift(n - pass - 1);
      
      steps.push({
        array: [...workingArray],
        comparing: null,
        swapping: null,
        sorted: [...sorted],
        pass: pass + 1,
        comparisons,
        swaps,
        message: `Pass ${pass + 1} complete! Element ${workingArray[n - pass - 1]} is now in its final position.${!swappedInThisPass ? ' No swaps needed - array is sorted!' : ''}`,
        isComplete: false
      });

      // Early termination if no swaps occurred
      if (!swappedInThisPass) {
        // Mark all remaining elements as sorted
        for (let j = 0; j < n - pass - 1; j++) {
          if (!sorted.includes(j)) {
            sorted.push(j);
          }
        }
        break;
      }
    }

    // Mark first element as sorted if not already
    if (!sorted.includes(0)) {
      sorted.push(0);
    }

    // Final step
    steps.push({
      array: [...workingArray],
      comparing: null,
      swapping: null,
      sorted: [...sorted],
      pass: n - 1,
      comparisons,
      swaps,
      message: `Bubble Sort Complete! Array is sorted in ${comparisons} comparisons and ${swaps} swaps.`,
      isComplete: true
    });

    return steps;
  };

  const startVisualization = () => {
    const nums = parseArray();
    if (!nums) return;

    const newSteps = generateBubbleSortSteps(nums);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);

    if (voiceEnabled) {
      speakStep(`Starting Bubble Sort visualization with array [${nums.join(', ')}]. Watch how larger elements bubble up to their correct positions.`);
    }

    toast.success('Bubble Sort visualization started');
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

  const playPause = () => {
    setIsPlaying(!isPlaying);
  };

  const reset = () => {
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
    setInputArray('64,34,25,12,22,11,90');
  };

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          const next = prev + 1;
          if (next >= steps.length - 1) {
            setIsPlaying(false);
          }
          if (voiceEnabled && steps[next]) {
            speakStep(steps[next].message);
          }
          return next;
        });
      }, speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, steps.length, speed, voiceEnabled, speakStep]);

  const renderArray = () => {
    if (steps.length === 0) return null;
    
    const currentStepData = steps[currentStep];
    
    return (
      <div className="flex justify-center gap-2 mb-6">
        {currentStepData.array.map((num, index) => {
          const isComparing = currentStepData.comparing?.includes(index);
          const isSwapping = currentStepData.swapping?.includes(index);
          const isSorted = currentStepData.sorted.includes(index);
          
          return (
            <motion.div
              key={`${index}-${num}`}
              className={`relative w-16 h-16 flex items-center justify-center rounded-lg border-2 font-bold text-lg ${
                isSorted
                  ? 'bg-green-200 border-green-400 text-green-800'
                  : isSwapping
                    ? 'bg-red-200 border-red-400 text-red-800'
                    : isComparing
                      ? 'bg-yellow-200 border-yellow-400 text-yellow-800'
                      : 'bg-blue-100 border-blue-300 text-blue-800'
              }`}
              initial={{ scale: 1 }}
              animate={{ 
                scale: isSwapping ? 1.2 : isComparing ? 1.1 : 1,
                y: isSwapping ? -10 : 0
              }}
              transition={{ duration: 0.3 }}
            >
              {num}
              
              {/* Status indicators */}
              {isSorted && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              )}
              
              {isSwapping && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  <ArrowUpDown className="h-4 w-4 text-red-600" />
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
        <h3 className="text-2xl font-bold mb-2">Bubble Sort Visualizer</h3>
        <p className="text-muted-foreground">
          Watch how larger elements "bubble up" to their correct positions through adjacent swaps
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Array (comma-separated, max 12)</label>
          <Input
            value={inputArray}
            onChange={(e) => setInputArray(e.target.value)}
            placeholder="e.g., 64,34,25,12,22,11,90"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Animation Speed (ms)</label>
          <Input
            type="number"
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value) || 1000)}
            placeholder="Speed in milliseconds"
            min="100"
            max="3000"
          />
        </div>

        <div className="flex gap-2 items-end">
          <Button onClick={startVisualization} className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4" />
            Start
          </Button>
          <Button onClick={reset} variant="outline">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Visualization */}
      {steps.length > 0 && (
        <div className="bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-950 dark:to-red-900 p-8 rounded-xl border-2 border-dashed border-orange-200 dark:border-orange-800">
          <div className="space-y-6">
            {/* Array Visualization */}
            {renderArray()}

            {/* Statistics */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-sm text-muted-foreground">Current Pass</div>
                  <div className="font-bold text-2xl">{currentStepData?.pass || 0}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Comparisons</div>
                  <div className="font-bold text-2xl text-blue-600">{currentStepData?.comparisons || 0}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Swaps</div>
                  <div className="font-bold text-2xl text-red-600">{currentStepData?.swaps || 0}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Sorted Elements</div>
                  <div className="font-bold text-2xl text-green-600">{currentStepData?.sorted.length || 0}</div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <div className="text-sm text-muted-foreground mb-2">Current Operation:</div>
                <div className="text-lg font-semibold">{currentStepData?.message}</div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              <Button 
                onClick={prevStep} 
                disabled={currentStep === 0}
                variant="outline"
              >
                Previous
              </Button>
              
              <Button onClick={playPause} variant="outline">
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
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

      {/* Algorithm Analysis */}
      <div className="bg-card border rounded-lg p-4">
        <h4 className="font-semibold mb-4">Bubble Sort Analysis:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="space-y-2">
            <div className="font-medium text-orange-600">Time Complexity</div>
            <div>• <strong>Best Case:</strong> O(n) - already sorted with optimization</div>
            <div>• <strong>Average Case:</strong> O(n²) - random order</div>
            <div>• <strong>Worst Case:</strong> O(n²) - reverse sorted</div>
          </div>
          <div className="space-y-2">
            <div className="font-medium text-blue-600">Space Complexity</div>
            <div>• <strong>Space:</strong> O(1) - in-place sorting</div>
            <div>• <strong>Stable:</strong> Yes - maintains relative order</div>
            <div>• <strong>Adaptive:</strong> Yes - performs better on nearly sorted data</div>
          </div>
          <div className="space-y-2">
            <div className="font-medium text-green-600">Characteristics</div>
            <div>• <strong>Simple:</strong> Easy to understand and implement</div>
            <div>• <strong>Educational:</strong> Great for learning sorting concepts</div>
            <div>• <strong>Inefficient:</strong> Not suitable for large datasets</div>
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
          voiceSpeed={voiceSpeed}
          onVoiceSpeedChange={setVoiceSpeed}
          isSpeaking={isSpeaking}
          onPauseSpeech={pauseSpeech}
          onResumeSpeech={resumeSpeech}
          onStopSpeech={stopSpeech}
        />
      </div>
    </div>
  );
}