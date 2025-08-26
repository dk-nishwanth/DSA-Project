import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Play, Pause, RotateCcw, Shuffle } from 'lucide-react';
import { motion } from 'framer-motion';

interface SortStep {
  array: number[];
  comparing: number[];
  sorted: number[];
  minIndex: number;
  currentIndex: number;
}

export function SelectionSortVisualizer() {
  const [array, setArray] = useState<number[]>([64, 34, 25, 12, 22, 11, 90]);
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [inputValue, setInputValue] = useState('64,34,25,12,22,11,90');

  const generateSteps = (arr: number[]): SortStep[] => {
    const steps: SortStep[] = [];
    const workingArray = [...arr];
    
    steps.push({
      array: [...workingArray],
      comparing: [],
      sorted: [],
      minIndex: -1,
      currentIndex: -1
    });

    for (let i = 0; i < workingArray.length - 1; i++) {
      let minIndex = i;
      
      // Show starting position
      steps.push({
        array: [...workingArray],
        comparing: [i],
        sorted: Array.from({ length: i }, (_, idx) => idx),
        minIndex: i,
        currentIndex: i
      });

      // Find minimum element in remaining array
      for (let j = i + 1; j < workingArray.length; j++) {
        steps.push({
          array: [...workingArray],
          comparing: [minIndex, j],
          sorted: Array.from({ length: i }, (_, idx) => idx),
          minIndex: minIndex,
          currentIndex: j
        });

        if (workingArray[j] < workingArray[minIndex]) {
          minIndex = j;
          steps.push({
            array: [...workingArray],
            comparing: [minIndex, j],
            sorted: Array.from({ length: i }, (_, idx) => idx),
            minIndex: minIndex,
            currentIndex: j
          });
        }
      }

      // Swap if needed
      if (minIndex !== i) {
        steps.push({
          array: [...workingArray],
          comparing: [i, minIndex],
          sorted: Array.from({ length: i }, (_, idx) => idx),
          minIndex: minIndex,
          currentIndex: -1
        });

        [workingArray[i], workingArray[minIndex]] = [workingArray[minIndex], workingArray[i]];
        
        steps.push({
          array: [...workingArray],
          comparing: [],
          sorted: Array.from({ length: i + 1 }, (_, idx) => idx),
          minIndex: -1,
          currentIndex: -1
        });
      } else {
        steps.push({
          array: [...workingArray],
          comparing: [],
          sorted: Array.from({ length: i + 1 }, (_, idx) => idx),
          minIndex: -1,
          currentIndex: -1
        });
      }
    }

    // Mark last element as sorted
    steps.push({
      array: [...workingArray],
      comparing: [],
      sorted: Array.from({ length: workingArray.length }, (_, idx) => idx),
      minIndex: -1,
      currentIndex: -1
    });

    return steps;
  };

  const handleSort = () => {
    const newSteps = generateSteps(array);
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
    }, 1000);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleShuffle = () => {
    const newArray = [...array].sort(() => Math.random() - 0.5);
    setArray(newArray);
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleInputChange = () => {
    try {
      const newArray = inputValue.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
      if (newArray.length > 0) {
        setArray(newArray);
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
    comparing: [],
    sorted: [],
    minIndex: -1,
    currentIndex: -1
  };

  const maxValue = Math.max(...currentStepData.array);

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
          
          <Button onClick={handleShuffle} variant="outline">
            <Shuffle className="h-4 w-4 mr-2" />
            Shuffle
          </Button>
        </div>

        <div className="flex gap-2 items-center">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter numbers separated by commas"
            className="w-64"
          />
          <Button onClick={handleInputChange} variant="outline">
            Set Array
          </Button>
        </div>
      </div>

      {/* Progress */}
      {steps.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Step {currentStep + 1} of {steps.length}
        </div>
      )}

      {/* Visualization */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 p-8 rounded-xl border-2 border-dashed border-green-200 dark:border-green-800">
        <div className="flex items-end justify-center gap-2 h-64">
          {currentStepData.array.map((value, index) => {
            const isComparing = currentStepData.comparing.includes(index);
            const isSorted = currentStepData.sorted.includes(index);
            const isMinimum = currentStepData.minIndex === index;
            const isCurrent = currentStepData.currentIndex === index;
            
            let barColor = 'bg-gray-400';
            if (isSorted) {
              barColor = 'bg-green-500';
            } else if (isMinimum) {
              barColor = 'bg-purple-500';
            } else if (isComparing) {
              barColor = 'bg-red-500';
            } else if (isCurrent) {
              barColor = 'bg-blue-500';
            }

            return (
              <motion.div
                key={index}
                className={`${barColor} rounded-t-lg flex flex-col items-center justify-end relative min-w-[40px]`}
                style={{
                  height: `${(value / maxValue) * 200 + 20}px`,
                }}
                initial={{ scale: 1 }}
                animate={{ 
                  scale: (isComparing || isMinimum || isCurrent) ? 1.1 : 1,
                  y: (isComparing || isMinimum) ? -5 : 0
                }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-white font-bold text-sm mb-2">
                  {value}
                </span>
                <span className="absolute -bottom-6 text-xs text-gray-600 dark:text-gray-400">
                  {index}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500 rounded"></div>
          <span>Current Minimum</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>Current Element</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>Comparing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Sorted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-400 rounded"></div>
          <span>Unsorted</span>
        </div>
      </div>

      {/* Algorithm Info */}
      <div className="bg-card border rounded-lg p-4">
        <h4 className="font-semibold mb-2">How Selection Sort Works:</h4>
        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
          <li>Find the minimum element in the unsorted portion</li>
          <li>Swap it with the first element of the unsorted portion</li>
          <li>Move the boundary of sorted and unsorted portions one position right</li>
          <li>Repeat until the entire array is sorted</li>
          <li>The algorithm maintains two subarrays: sorted and unsorted</li>
        </ol>
      </div>
    </div>
  );
}