import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Play, Pause, RotateCcw, Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface WindowStep {
  array: number[];
  windowStart: number;
  windowEnd: number;
  windowSize: number;
  currentMax: number;
  maxIndex: number;
  result: number[];
  message: string;
}

export function SlidingWindowVisualizer() {
  const [array, setArray] = useState<number[]>([1, 3, -1, -3, 5, 3, 6, 7]);
  const [windowSize, setWindowSize] = useState(3);
  const [steps, setSteps] = useState<WindowStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [inputArray, setInputArray] = useState('1,3,-1,-3,5,3,6,7');
  const [inputWindowSize, setInputWindowSize] = useState('3');

  const generateSteps = (arr: number[], k: number): WindowStep[] => {
    const steps: WindowStep[] = [];
    const result: number[] = [];

    if (k > arr.length) {
      steps.push({
        array: [...arr],
        windowStart: 0,
        windowEnd: arr.length - 1,
        windowSize: k,
        currentMax: Math.max(...arr),
        maxIndex: arr.indexOf(Math.max(...arr)),
        result: [],
        message: `Window size (${k}) is larger than array length (${arr.length})`
      });
      return steps;
    }

    // Initial window
    let windowStart = 0;
    let windowEnd = k - 1;
    let currentWindow = arr.slice(windowStart, windowEnd + 1);
    let currentMax = Math.max(...currentWindow);
    let maxIndex = windowStart + currentWindow.indexOf(currentMax);
    
    result.push(currentMax);
    
    steps.push({
      array: [...arr],
      windowStart,
      windowEnd,
      windowSize: k,
      currentMax,
      maxIndex,
      result: [...result],
      message: `Initial window [${windowStart}, ${windowEnd}]: max = ${currentMax}`
    });

    // Slide the window
    for (let i = 1; i <= arr.length - k; i++) {
      windowStart = i;
      windowEnd = i + k - 1;
      currentWindow = arr.slice(windowStart, windowEnd + 1);
      currentMax = Math.max(...currentWindow);
      maxIndex = windowStart + currentWindow.indexOf(currentMax);
      
      result.push(currentMax);
      
      steps.push({
        array: [...arr],
        windowStart,
        windowEnd,
        windowSize: k,
        currentMax,
        maxIndex,
        result: [...result],
        message: `Window [${windowStart}, ${windowEnd}]: max = ${currentMax}`
      });
    }

    steps.push({
      array: [...arr],
      windowStart: -1,
      windowEnd: -1,
      windowSize: k,
      currentMax: -1,
      maxIndex: -1,
      result: [...result],
      message: `Complete! Maximum values: [${result.join(', ')}]`
    });

    return steps;
  };

  const handleSort = () => {
    const newSteps = generateSteps(array, windowSize);
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
      const newWindowSize = parseInt(inputWindowSize);
      
      if (newArray.length > 0 && newWindowSize > 0) {
        setArray(newArray);
        setWindowSize(newWindowSize);
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
    windowStart: 0,
    windowEnd: windowSize - 1,
    windowSize: windowSize,
    currentMax: Math.max(...array.slice(0, windowSize)),
    maxIndex: 0,
    result: [],
    message: 'Click Play to start'
  };

  const maxValue = Math.max(...currentStepData.array);
  const minValue = Math.min(...currentStepData.array);

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
            placeholder="Enter numbers"
            className="w-48"
          />
          <Input
            value={inputWindowSize}
            onChange={(e) => setInputWindowSize(e.target.value)}
            placeholder="Window size"
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

      {/* Window Info */}
      <div className="flex items-center justify-center gap-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-600" />
          <span className="font-semibold">Window Size: {currentStepData.windowSize}</span>
        </div>
        {currentStepData.currentMax !== -1 && (
          <>
            <span className="text-muted-foreground">|</span>
            <span className="font-semibold text-green-600">
              Current Max: {currentStepData.currentMax}
            </span>
          </>
        )}
      </div>

      {/* Visualization */}
      <div className="bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-950 dark:to-red-900 p-8 rounded-xl border-2 border-dashed border-orange-200 dark:border-orange-800">
        <div className="flex items-end justify-center gap-2 h-64 mb-8">
          {currentStepData.array.map((value, index) => {
            const isInWindow = index >= currentStepData.windowStart && index <= currentStepData.windowEnd;
            const isMaxInWindow = index === currentStepData.maxIndex;
            
            let barColor = 'bg-gray-400';
            if (isMaxInWindow && isInWindow) {
              barColor = 'bg-green-500';
            } else if (isInWindow) {
              barColor = 'bg-blue-500';
            }

            const height = value >= 0 
              ? ((value / maxValue) * 180 + 20)
              : (20 - (Math.abs(value) / Math.abs(minValue)) * 180);

            return (
              <motion.div
                key={index}
                className="flex flex-col items-center justify-end relative min-w-[50px]"
                initial={{ scale: 1 }}
                animate={{ 
                  scale: isInWindow ? 1.05 : 1,
                  y: isMaxInWindow ? -5 : 0
                }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`${barColor} rounded-t-lg flex flex-col items-center justify-end relative`}
                  style={{
                    height: `${Math.abs(height)}px`,
                    marginTop: value < 0 ? `${180 - Math.abs(height)}px` : '0px'
                  }}
                >
                  <span className="text-white font-bold text-sm mb-2">
                    {value}
                  </span>
                </div>
                <span className="absolute -bottom-6 text-xs text-gray-600 dark:text-gray-400">
                  {index}
                </span>
                
                {isInWindow && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                    <div className={`${isMaxInWindow ? 'bg-green-500' : 'bg-blue-500'} text-white px-2 py-1 rounded text-xs`}>
                      {isMaxInWindow ? 'MAX' : 'WIN'}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Window Indicator */}
        {currentStepData.windowStart >= 0 && (
          <div className="relative">
            <div 
              className="absolute top-0 bg-blue-200 dark:bg-blue-800 opacity-50 rounded"
              style={{
                left: `${(currentStepData.windowStart / currentStepData.array.length) * 100}%`,
                width: `${(currentStepData.windowSize / currentStepData.array.length) * 100}%`,
                height: '4px'
              }}
            />
          </div>
        )}

        {/* Message */}
        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border mt-4">
          <p className="text-sm font-medium">{currentStepData.message}</p>
        </div>
      </div>

      {/* Result Display */}
      {currentStepData.result.length > 0 && (
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-2">Maximum Values Found:</h4>
          <div className="flex flex-wrap gap-2">
            {currentStepData.result.map((value, index) => (
              <div key={index} className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
                {value}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Maximum in Window</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>In Current Window</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-400 rounded"></div>
          <span>Outside Window</span>
        </div>
      </div>

      {/* Algorithm Info */}
      <div className="bg-card border rounded-lg p-4">
        <h4 className="font-semibold mb-2">Sliding Window Maximum:</h4>
        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
          <li>Start with a window of size k at the beginning of the array</li>
          <li>Find the maximum element in the current window</li>
          <li>Add this maximum to the result array</li>
          <li>Slide the window one position to the right</li>
          <li>Repeat until the window reaches the end of the array</li>
          <li>Optimized versions use deque to achieve O(n) time complexity</li>
        </ol>
      </div>
    </div>
  );
}