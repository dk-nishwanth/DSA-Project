import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, RotateCcw, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

type PointerType = 'i' | 'left' | 'right';

export interface ThreeSumVisualizerProps {
  initialArray?: number[];
  targetSum?: number;
  onStepChange?: (step: string) => void;
  className?: string;
}

interface ArrayElement {
  value: number;
  isAnchor?: boolean;
  isLeft?: boolean;
  isRight?: boolean;
  isSum?: boolean;
  isProcessed?: boolean;
  isDuplicate?: boolean;
}

export function ThreeSumVisualizer({
  initialArray = [-1, 0, 1, 2, -1, -4],
  targetSum = 0,
  onStepChange,
  className,
}: ThreeSumVisualizerProps) {
  const [array, setArray] = useState<ArrayElement[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [currentStep, setCurrentStep] = useState('');
  const [triplets, setTriplets] = useState<number[][]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [showMemory, setShowMemory] = useState(false);
  const { voiceEnabled, setVoiceEnabled, speakStep, speakOperation, speakResult } = useVisualizerVoice({ minInterval: 1200 });
  
  // Initialize array with default values
  useEffect(() => {
    resetVisualization();
  }, []);

  const resetVisualization = useCallback(() => {
    setArray(
      [...initialArray].sort((a, b) => a - b).map((value) => ({
        value,
        isAnchor: false,
        isLeft: false,
        isRight: false,
        isSum: false,
        isProcessed: false,
        isDuplicate: false,
      }))
    );
    setTriplets([]);
    setIsComplete(false);
    setCurrentStep('Initializing visualization...');
    onStepChange?.('Initializing visualization...');
  }, [initialArray, onStepChange]);

  const updateStep = useCallback((step: string) => {
    setCurrentStep(step);
    onStepChange?.(step);
    speakStep('', step);
  }, [onStepChange, speakStep]);

  const highlightElements = useCallback((indices: number[], type: PointerType | 'sum' | 'reset' = 'reset') => {
    setArray(prev => {
      const newArray = [...prev];
      // Reset all highlights
      newArray.forEach((el, idx) => {
        newArray[idx] = { ...el, isAnchor: false, isLeft: false, isRight: false, isSum: false };
      });
      
      // Apply new highlights
      indices.forEach((idx, i) => {
        if (idx >= 0 && idx < newArray.length) {
          if (type === 'i') newArray[idx].isAnchor = true;
          else if (type === 'left') newArray[idx].isLeft = true;
          else if (type === 'right') newArray[idx].isRight = true;
          else if (type === 'sum') newArray[idx].isSum = true;
        }
      });
      
      return newArray;
    });
  }, []);

  const markAsProcessed = useCallback((indices: number[]) => {
    setArray(prev => {
      const newArray = [...prev];
      indices.forEach(idx => {
        if (idx >= 0 && idx < newArray.length) {
          newArray[idx] = { ...newArray[idx], isProcessed: true };
        }
      });
      return newArray;
    });
  }, []);

  const markAsDuplicate = useCallback((indices: number[]) => {
    setArray(prev => {
      const newArray = [...prev];
      indices.forEach(idx => {
        if (idx >= 0 && idx < newArray.length) {
          newArray[idx] = { ...newArray[idx], isDuplicate: true };
        }
      });
      return newArray;
    });
  }, []);

  const addTriplet = useCallback((triplet: number[]) => {
    setTriplets(prev => {
      // Check for duplicate triplets
      const tripletStr = triplet.join(',');
      if (prev.some(t => t.join(',') === tripletStr)) return prev;
      return [...prev, [...triplet].sort((a, b) => a - b)];
    });
  }, []);

  const runVisualization = useCallback(async () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    setIsComplete(false);
    const nums = [...initialArray].sort((a, b) => a - b);
    const n = nums.length;
    const result: number[][] = [];
    speakOperation('Three Sum', 'Find all unique triplets that sum to target.');
    
    updateStep('Starting Three Sum visualization...');
    await new Promise(resolve => setTimeout(resolve, 1000 / speed));
    
    for (let i = 0; i < n - 2; i++) {
      // Skip duplicates for anchor
      if (i > 0 && nums[i] === nums[i - 1]) {
        updateStep(`Skipping duplicate anchor at index ${i} (${nums[i]})`);
        markAsDuplicate([i]);
        await new Promise(resolve => setTimeout(resolve, 1000 / speed));
        continue;
      }
      
      // Set current anchor
      highlightElements([i], 'i');
      updateStep(`Setting anchor at index ${i} (${nums[i]})`);
      await new Promise(resolve => setTimeout(resolve, 1000 / speed));
      
      let left = i + 1;
      let right = n - 1;
      
      // Highlight initial left and right pointers
      highlightElements([i, left, right], 'left');
      highlightElements([right], 'right');
      updateStep(`Initializing pointers: left=${left} (${nums[left]}), right=${right} (${nums[right]})`);
      await new Promise(resolve => setTimeout(resolve, 1000 / speed));
      
      while (left < right) {
        const sum = nums[i] + nums[left] + nums[right];
        
        // Highlight current sum
        highlightElements([i, left, right], 'sum');
        updateStep(`Checking sum: ${nums[i]} + ${nums[left]} + ${nums[right]} = ${sum} (target: ${targetSum})`);
        await new Promise(resolve => setTimeout(resolve, 1000 / speed));
        
        if (sum === targetSum) {
          // Found a triplet
          updateStep(`Found triplet: [${nums[i]}, ${nums[left]}, ${nums[right]}]`);
          addTriplet([nums[i], nums[left], nums[right]]);
          markAsProcessed([i, left, right]);
          
          // Skip duplicates for left pointer
          while (left < right && nums[left] === nums[left + 1]) {
            left++;
            markAsDuplicate([left]);
            updateStep(`Skipping duplicate at left pointer (index ${left})`);
            await new Promise(resolve => setTimeout(resolve, 1000 / speed));
          }
          
          // Skip duplicates for right pointer
          while (left < right && nums[right] === nums[right - 1]) {
            right--;
            markAsDuplicate([right]);
            updateStep(`Skipping duplicate at right pointer (index ${right})`);
            await new Promise(resolve => setTimeout(resolve, 1000 / speed));
          }
          
          // Move both pointers
          left++;
          right--;
          
          if (left < right) {
            highlightElements([i, left, right], 'left');
            highlightElements([right], 'right');
            updateStep(`Moving both pointers: left=${left}, right=${right}`);
            await new Promise(resolve => setTimeout(resolve, 1000 / speed));
          }
        } else if (sum < targetSum) {
          // Need a larger sum, move left pointer right
          left++;
          highlightElements([i, left, right], 'left');
          updateStep(`Sum too small, moving left pointer to index ${left} (${nums[left]})`);
          await new Promise(resolve => setTimeout(resolve, 1000 / speed));
        } else {
          // Need a smaller sum, move right pointer left
          right--;
          highlightElements([i, left, right], 'right');
          updateStep(`Sum too large, moving right pointer to index ${right} (${nums[right]})`);
          await new Promise(resolve => setTimeout(resolve, 1000 / speed));
        }
      }
      
      // Mark anchor as processed
      markAsProcessed([i]);
    }
    
    updateStep('Three Sum visualization complete!');
    speakResult('Three Sum complete.');
    setIsComplete(true);
    setIsPlaying(false);
  }, [initialArray, targetSum, isPlaying, speed, updateStep, highlightElements, markAsProcessed, markAsDuplicate, addTriplet, speakResult]);

  const togglePlayPause = () => {
    if (isComplete) {
      resetVisualization();
      runVisualization();
    } else if (isPlaying) {
      setIsPlaying(false);
    } else {
      runVisualization();
    }
  };

  const handleSpeedChange = (value: number[]) => {
    setSpeed(value[0]);
  };

  return (
    <div className={cn("flex flex-col gap-4 p-4 bg-background rounded-lg border", className)}>
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={togglePlayPause}
            disabled={isPlaying && isComplete}
          >
            {isPlaying && !isComplete ? (
              <Pause className="h-4 w-4 mr-2" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            {isComplete ? 'Restart' : isPlaying ? 'Pause' : 'Play'}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetVisualization}
            disabled={isPlaying}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowMemory(!showMemory)}
          >
            <HardDrive className="h-4 w-4 mr-2" />
            {showMemory ? 'Hide Memory' : 'Show Memory'}
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Speed:</span>
          <Slider
            min={0.5}
            max={5}
            step={0.5}
            value={[speed]}
            onValueChange={handleSpeedChange}
            className="w-32"
            disabled={isPlaying}
          />
          <span className="text-sm w-8">{speed}x</span>
        </div>
      </div>
      
      {/* Current Step */}
      <div className="bg-muted/50 p-3 rounded-md text-sm font-mono">
        <div className="flex items-start gap-2">
          <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{currentStep || 'Ready to start visualization...'}</span>
        </div>
      </div>

      {/* Visualizer Controls */}
      <div className="flex justify-center">
        <VisualizerControls
          showMemory={showMemory}
          onToggleMemory={setShowMemory}
          voiceEnabled={voiceEnabled}
          onToggleVoice={setVoiceEnabled}
        />
      </div>

      {/* Memory Layout */}
      {showMemory && (
        <MemoryLayout
          data={array.map(el=>el.value)}
          title="Array (sorted) Memory Layout"
          baseAddress={2500}
          wordSize={4}
        />
      )}
      
      {/* Array Visualization */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end gap-1 justify-center min-h-40">
          {array.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div 
                className={cn(
                  "w-12 flex items-center justify-center py-2 border rounded-t-md font-mono text-sm transition-all duration-300",
                  item.isAnchor && "bg-primary/20 border-primary",
                  item.isLeft && "bg-blue-100 dark:bg-blue-900 border-blue-500",
                  item.isRight && "bg-red-100 dark:bg-red-900 border-red-500",
                  item.isSum && "bg-green-100 dark:bg-green-900 border-green-500",
                  item.isDuplicate && "opacity-50",
                  item.isProcessed && "opacity-70"
                )}
              >
                {item.value}
              </div>
              <div className="w-full h-1 bg-muted"></div>
              <div className="text-xs text-muted-foreground mt-1">
                {index}
              </div>
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap gap-4 justify-center text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-primary/20 border border-primary"></div>
            <span>Anchor (i)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-100 dark:bg-blue-900 border border-blue-500"></div>
            <span>Left Pointer</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-100 dark:bg-red-900 border border-red-500"></div>
            <span>Right Pointer</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-100 dark:bg-green-900 border border-green-500"></div>
            <span>Current Sum</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full opacity-50"></div>
            <span>Processed</span>
          </div>
        </div>
      </div>
      
      {/* Memory View */}
      {showMemory && (
        <div className="mt-4 p-4 bg-muted/20 rounded-md">
          <h3 className="font-medium mb-2">Memory View</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-1">Variables</h4>
              <div className="bg-background p-2 rounded text-sm font-mono">
                <div>targetSum = {targetSum}</div>
                <div>isComplete = {isComplete.toString()}</div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Current Pointers</h4>
              <div className="bg-background p-2 rounded text-sm font-mono">
                {array.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>arr[{idx}]:</span>
                    <span className={cn(
                      item.isAnchor && "text-primary font-bold",
                      item.isLeft && "text-blue-500 font-bold",
                      item.isRight && "text-red-500 font-bold"
                    )}>
                      {item.value}
                      {item.isAnchor && " (i)"}
                      {item.isLeft && " (left)"}
                      {item.isRight && " (right)"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Found Triplets</h4>
              <div className="bg-background p-2 rounded text-sm font-mono max-h-32 overflow-y-auto">
                {triplets.length > 0 ? (
                  triplets.map((triplet, idx) => (
                    <div key={idx} className="mb-1">
                      [{triplet.join(', ')}]
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground">No triplets found yet</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Found Triplets */}
      {triplets.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium mb-2">Found Triplets (Sum = {targetSum})</h3>
          <div className="flex flex-wrap gap-2">
            {triplets.map((triplet, idx) => (
              <div 
                key={idx} 
                className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-mono"
              >
                [{triplet.join(', ')}]
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
