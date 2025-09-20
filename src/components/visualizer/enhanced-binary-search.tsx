import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, RotateCcw, Shuffle, Target } from 'lucide-react';
import { StepByStepBase, VisualizationStep } from './step-by-step-base';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { useVoiceExplain } from '@/hooks/useVoiceExplain';

export function EnhancedBinarySearch() {
  const [array, setArray] = useState<number[]>([1, 3, 5, 7, 9, 11, 13, 15, 17, 19]);
  const [target, setTarget] = useState<number>(7);
  const [inputArray, setInputArray] = useState('1,3,5,7,9,11,13,15,17,19');
  const [inputTarget, setInputTarget] = useState('7');
  const [steps, setSteps] = useState<VisualizationStep[]>([]);
  const [showMemory, setShowMemory] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const { enabled: voiceEnabled, setEnabled: setVoiceEnabled } = useVoiceExplain(currentStep);

  // Update currentStep when steps change
  React.useEffect(() => {
    if (steps.length > 0) {
      const latestStep = steps[steps.length - 1];
      setCurrentStep(latestStep.description || latestStep.title);
    }
  }, [steps]);

  const generateBinarySearchSteps = (arr: number[], target: number): VisualizationStep[] => {
    const steps: VisualizationStep[] = [];
    let left = 0;
    let right = arr.length - 1;
    let stepId = 0;
    let found = false;

    // Initial state
    steps.push({
      id: `step-${stepId++}`,
      title: 'Binary Search Started',
      description: `Searching for ${target} in sorted array. Binary search works by repeatedly dividing the search space in half.`,
      data: { 
        array: [...arr], 
        left, 
        right, 
        mid: -1, 
        target, 
        found: false,
        searchSpace: [left, right]
      },
      complexity: { time: 'O(log n)', space: 'O(1)' },
      code: `function binarySearch(arr, target) {\n  let left = 0, right = ${arr.length - 1};\n  // Start searching...`
    });

    while (left <= right && !found) {
      const mid = Math.floor((left + right) / 2);
      
      // Calculate mid step
      steps.push({
        id: `step-${stepId++}`,
        title: 'Calculate Middle',
        description: `Calculate middle index: mid = Math.floor((${left} + ${right}) / 2) = ${mid}`,
        data: { 
          array: [...arr], 
          left, 
          right, 
          mid, 
          target, 
          found: false,
          searchSpace: [left, right],
          calculating: true
        },
        complexity: { time: 'O(log n)', space: 'O(1)' },
        code: `let mid = Math.floor((${left} + ${right}) / 2); // mid = ${mid}`
      });

      // Compare with target
      steps.push({
        id: `step-${stepId++}`,
        title: 'Compare with Target',
        description: `Compare arr[${mid}] = ${arr[mid]} with target ${target}`,
        data: { 
          array: [...arr], 
          left, 
          right, 
          mid, 
          target, 
          found: false,
          searchSpace: [left, right],
          comparing: true
        },
        complexity: { time: 'O(log n)', space: 'O(1)' },
        code: `if (arr[${mid}] === ${target}) {\n  // ${arr[mid]} === ${target} ? ${arr[mid] === target}`
      });

      if (arr[mid] === target) {
        // Found the target
        steps.push({
          id: `step-${stepId++}`,
          title: 'Target Found! 🎉',
          description: `Found ${target} at index ${mid}! Binary search complete.`,
          data: { 
            array: [...arr], 
            left, 
            right, 
            mid, 
            target, 
            found: true,
            foundIndex: mid,
            searchSpace: [left, right]
          },
          complexity: { time: 'O(log n)', space: 'O(1)' },
          code: `  return ${mid}; // Found at index ${mid}!`
        });
        found = true;
      } else if (arr[mid] < target) {
        // Target is in right half
        steps.push({
          id: `step-${stepId++}`,
          title: 'Search Right Half',
          description: `${arr[mid]} < ${target}, so target must be in the right half. Update left = ${mid + 1}`,
          data: { 
            array: [...arr], 
            left, 
            right, 
            mid, 
            target, 
            found: false,
            searchSpace: [left, right],
            eliminated: [left, mid],
            direction: 'right'
          },
          complexity: { time: 'O(log n)', space: 'O(1)' },
          code: `} else if (arr[${mid}] < ${target}) {\n  left = ${mid + 1}; // Search right half`
        });
        left = mid + 1;
      } else {
        // Target is in left half
        steps.push({
          id: `step-${stepId++}`,
          title: 'Search Left Half',
          description: `${arr[mid]} > ${target}, so target must be in the left half. Update right = ${mid - 1}`,
          data: { 
            array: [...arr], 
            left, 
            right, 
            mid, 
            target, 
            found: false,
            searchSpace: [left, right],
            eliminated: [mid, right],
            direction: 'left'
          },
          complexity: { time: 'O(log n)', space: 'O(1)' },
          code: `} else {\n  right = ${mid - 1}; // Search left half`
        });
        right = mid - 1;
      }

      // Show updated search space (if not found yet)
      if (!found && left <= right) {
        steps.push({
          id: `step-${stepId++}`,
          title: 'Updated Search Space',
          description: `New search space: indices ${left} to ${right}. We've eliminated ${arr.length - (right - left + 1)} elements!`,
          data: { 
            array: [...arr], 
            left, 
            right, 
            mid: -1, 
            target, 
            found: false,
            searchSpace: [left, right],
            newSearchSpace: true
          },
          complexity: { time: 'O(log n)', space: 'O(1)' },
          code: `// New search space: [${left}, ${right}]`
        });
      }
    }

    // If not found
    if (!found) {
      steps.push({
        id: `step-${stepId++}`,
        title: 'Target Not Found',
        description: `Search space exhausted (left > right). ${target} is not in the array.`,
        data: { 
          array: [...arr], 
          left, 
          right, 
          mid: -1, 
          target, 
          found: false,
          notFound: true
        },
        complexity: { time: 'O(log n)', space: 'O(1)' },
        code: `return -1; // Target not found`
      });
    }

    return steps;
  };

  const handleSearch = () => {
    if (target === undefined || target === null) return;
    
    // Ensure array is sorted
    const sortedArray = [...array].sort((a, b) => a - b);
    if (JSON.stringify(sortedArray) !== JSON.stringify(array)) {
      setArray(sortedArray);
    }
    
    const searchSteps = generateBinarySearchSteps(sortedArray, target);
    setSteps(searchSteps);
  };

  const handleReset = () => {
    setArray([1, 3, 5, 7, 9, 11, 13, 15, 17, 19]);
    setTarget(7);
    setInputArray('1,3,5,7,9,11,13,15,17,19');
    setInputTarget('7');
    setSteps([]);
  };

  const handleShuffle = () => {
    const newArray = Array.from({ length: 10 }, () => Math.floor(Math.random() * 50) + 1)
      .sort((a, b) => a - b);
    setArray(newArray);
    setInputArray(newArray.join(','));
    setTarget(newArray[Math.floor(Math.random() * newArray.length)]);
    setInputTarget(newArray[Math.floor(Math.random() * newArray.length)].toString());
    setSteps([]);
  };

  const handleInputChange = () => {
    try {
      const newArray = inputArray.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
      const newTarget = parseInt(inputTarget);
      
      if (newArray.length > 0 && !isNaN(newTarget)) {
        const sortedArray = newArray.sort((a, b) => a - b);
        setArray(sortedArray);
        setTarget(newTarget);
        setSteps([]);
      }
    } catch (error) {
      console.error('Invalid input');
    }
  };

  const renderSearchVisualization = (currentStep: VisualizationStep) => {
    const { 
      array: displayArray, 
      left, 
      right, 
      mid, 
      target, 
      found, 
      foundIndex,
      searchSpace,
      eliminated,
      direction,
      calculating,
      comparing,
      newSearchSpace,
      notFound
    } = currentStep.data;

    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold mb-2">🔍 Binary Search Visualization</h3>
          <p className="text-sm text-muted-foreground">
            Like finding a word in a dictionary - always check the middle and eliminate half the possibilities!
          </p>
        </div>

        {/* Target Display */}
        <div className="flex items-center justify-center gap-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <Target className="h-5 w-5 text-blue-600" />
          <span className="font-semibold">Searching for: {target}</span>
          {found && <span className="text-green-600 font-bold">✅ Found at index {foundIndex}!</span>}
          {notFound && <span className="text-red-600 font-bold">❌ Not found in array</span>}
        </div>

        {/* Array Visualization */}
        <div className="flex items-center justify-center gap-1 mb-8 flex-wrap">
          <AnimatePresence>
            {displayArray.map((value: number, index: number) => {
              let bgColor = 'bg-gray-300 dark:bg-gray-600';
              let textColor = 'text-gray-700 dark:text-gray-300';
              let scale = 1;
              let y = 0;
              let borderColor = 'border-gray-400';

              // Determine element state
              if (found && index === foundIndex) {
                bgColor = 'bg-green-500';
                textColor = 'text-white';
                scale = 1.2;
                y = -10;
                borderColor = 'border-green-600';
              } else if (index === mid && (calculating || comparing)) {
                bgColor = 'bg-yellow-500';
                textColor = 'text-white';
                scale = 1.1;
                y = -5;
                borderColor = 'border-yellow-600';
              } else if (searchSpace && index >= searchSpace[0] && index <= searchSpace[1]) {
                bgColor = 'bg-blue-200 dark:bg-blue-800';
                textColor = 'text-blue-800 dark:text-blue-200';
                borderColor = 'border-blue-400';
              } else if (eliminated && index >= eliminated[0] && index <= eliminated[1]) {
                bgColor = 'bg-red-200 dark:bg-red-900';
                textColor = 'text-red-600 dark:text-red-400';
                borderColor = 'border-red-400';
              }

              return (
                <motion.div
                  key={`${index}-${value}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale,
                    y,
                    rotateY: index === mid && comparing ? [0, 10, -10, 0] : 0
                  }}
                  transition={{ 
                    duration: 0.5,
                    rotateY: { duration: 0.6, times: [0, 0.3, 0.7, 1] }
                  }}
                  className={`${bgColor} ${textColor} border-2 ${borderColor} rounded-lg p-3 min-w-[50px] text-center font-bold relative`}
                >
                  <div className="text-lg">{value}</div>
                  <div className="text-xs mt-1 opacity-75">[{index}]</div>
                  
                  {/* Status indicators */}
                  {index === left && searchSpace && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                      L
                    </div>
                  )}
                  {index === right && searchSpace && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                      R
                    </div>
                  )}
                  {index === mid && mid !== -1 && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-2 py-1 rounded text-xs">
                      M
                    </div>
                  )}
                  {found && index === foundIndex && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                      ✓
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Search Progress */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-3">
            <div className="text-lg font-bold text-blue-600">{displayArray.length}</div>
            <div className="text-xs text-blue-600">Total Elements</div>
          </div>
          <div className="bg-green-50 dark:bg-green-950 rounded-lg p-3">
            <div className="text-lg font-bold text-green-600">
              {searchSpace ? searchSpace[1] - searchSpace[0] + 1 : 0}
            </div>
            <div className="text-xs text-green-600">Search Space</div>
          </div>
          <div className="bg-red-50 dark:bg-red-950 rounded-lg p-3">
            <div className="text-lg font-bold text-red-600">
              {eliminated ? Math.abs(eliminated[1] - eliminated[0]) + 1 : 0}
            </div>
            <div className="text-xs text-red-600">Eliminated</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-950 rounded-lg p-3">
            <div className="text-lg font-bold text-purple-600">
              {Math.ceil(Math.log2(displayArray.length))}
            </div>
            <div className="text-xs text-purple-600">Max Steps</div>
          </div>
        </div>

        {/* Direction indicator */}
        {direction && (
          <div className="text-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              direction === 'left' 
                ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' 
                : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
            }`}>
              {direction === 'left' ? '← Searching Left Half' : 'Searching Right Half →'}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Sorted Array (comma-separated)</label>
            <Input
              value={inputArray}
              onChange={(e) => setInputArray(e.target.value)}
              placeholder="Enter sorted numbers"
              disabled={steps.length > 0}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Target Value</label>
            <Input
              type="number"
              value={inputTarget}
              onChange={(e) => setInputTarget(e.target.value)}
              placeholder="Enter target"
              disabled={steps.length > 0}
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 justify-center">
          <Button onClick={handleInputChange} disabled={steps.length > 0} variant="outline">
            Set Values
          </Button>
          <Button onClick={handleSearch} disabled={steps.length > 0 || array.length === 0}>
            <Search className="h-4 w-4 mr-2" />
            Start Binary Search
          </Button>
          <Button onClick={handleShuffle} variant="outline" disabled={steps.length > 0}>
            <Shuffle className="h-4 w-4 mr-2" />
            Random Array
          </Button>
          <Button onClick={handleReset} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Step-by-Step Visualization */}
      {steps.length > 0 ? (
        <StepByStepBase
          steps={steps}
          title="Binary Search Step-by-Step"
          initialSpeed={1500}
          onStepChange={(step) => setCurrentStep(step.description || step.title)}
        >
          {(currentStep) => renderSearchVisualization(currentStep)}
        </StepByStepBase>
      ) : (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 rounded-xl p-8 border-2 border-dashed border-blue-200 dark:border-blue-800">
          {renderSearchVisualization({
            id: 'initial',
            title: 'Ready to Search',
            description: 'Click "Start Binary Search" to see the step-by-step process',
            data: { array, left: 0, right: array.length - 1, mid: -1, target, found: false }
          } as VisualizationStep)}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-200 border border-blue-400 rounded"></div>
          <span>Search Space</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span>Middle Element</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-200 border border-red-400 rounded"></div>
          <span>Eliminated</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Found</span>
        </div>
      </div>

      {/* Algorithm Info */}
      <div className="bg-card border rounded-lg p-4">
        <h4 className="font-semibold mb-2">🔍 How Binary Search Works:</h4>
        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
          <li>Start with the entire sorted array as the search space</li>
          <li>Find the middle element and compare it with the target</li>
          <li>If middle equals target, we found it!</li>
          <li>If middle is less than target, search the right half</li>
          <li>If middle is greater than target, search the left half</li>
          <li>Repeat until found or search space is empty</li>
          <li>Each step eliminates half the remaining possibilities</li>
        </ol>
      </div>

      {/* Voice Explain and Show Memory Controls */}
      <VisualizerControls
        voiceEnabled={voiceEnabled}
        onToggleVoice={setVoiceEnabled}
        showMemory={showMemory}
        onToggleMemory={setShowMemory}
      />

      {/* Memory Layout */}
      {showMemory && (
        <div className="bg-muted/20 rounded-lg p-4">
          <h4 className="font-semibold mb-3">Memory Layout</h4>
          <div className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="text-sm font-medium mb-2">Array Elements</h5>
                <div className="space-y-1">
                  {array.map((value, index) => (
                    <div key={index} className="flex justify-between text-xs font-mono bg-background/50 p-2 rounded">
                      <span>arr[{index}]</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h5 className="text-sm font-medium mb-2">Memory Addresses</h5>
                <div className="space-y-1">
                  {array.map((value, index) => {
                    const address = 0x3000 + (index * 4); // Different base address for binary search
                    return (
                      <div key={index} className="flex justify-between text-xs font-mono bg-background/50 p-2 rounded">
                        <span>0x{address.toString(16).toUpperCase()}</span>
                        <span>{value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="mt-3 p-3 bg-info/10 rounded-lg border border-info/30">
              <p className="text-xs text-info-foreground">
                <strong>Memory Info:</strong> Each integer occupies 4 bytes in memory. Binary search accesses memory in O(log n) pattern, jumping to middle elements rather than sequential access.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}