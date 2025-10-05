import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RotateCcw, Shuffle, HardDrive } from 'lucide-react';
import { StepByStepBase, VisualizationStep } from './step-by-step-base';
import { VisualizerControls } from './visualizer-controls';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';
import { MemoryLayout } from '@/components/memory-layout';

export function EnhancedBubbleSort() {
  const [array, setArray] = useState<number[]>([64, 34, 25, 12, 22, 11, 90]);
  const [inputValue, setInputValue] = useState('64,34,25,12,22,11,90');
  const [steps, setSteps] = useState<VisualizationStep[]>([]);
  const [showMemoryView, setShowMemoryView] = useState(false);
  const [memoryAddresses, setMemoryAddresses] = useState<number[]>([]);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const { isSpeaking, pauseSpeech, resumeSpeech, stopSpeech, speakOperation, speakStep, speakResult } = useVisualizerVoice({ minInterval: 2000 });
  const [stepDesc, setStepDesc] = useState('');

  const generateMemoryAddresses = () => {
    const baseAddress = 0x1000;
    return array.map((_, index) => baseAddress + (index * 4));
  };

  useEffect(() => {
    setMemoryAddresses(generateMemoryAddresses());
  }, [array]);

  const generateBubbleSortSteps = (arr: number[]): VisualizationStep[] => {
    const steps: VisualizationStep[] = [];
    const workingArray = [...arr];
    const n = workingArray.length;
    let stepId = 0;

    // Initial state
    steps.push({
      id: `step-${stepId++}`,
      title: 'Bubble Sort Started',
      description: `Starting bubble sort with ${n} elements. We'll compare adjacent elements and swap if needed.`,
      data: { 
        array: [...workingArray], 
        comparing: [], 
        sorted: [], 
        pass: 0,
        swapped: false 
      },
      complexity: { time: 'O(n²)', space: 'O(1)' },
      code: `function bubbleSort(arr) {\n  const n = arr.length;\n  // Start sorting...`
    });

    for (let i = 0; i < n - 1; i++) {
      let swapped = false;
      
      // Start of pass
      steps.push({
        id: `step-${stepId++}`,
        title: `Pass ${i + 1} Started`,
        description: `Starting pass ${i + 1}. We'll bubble the largest unsorted element to position ${n - 1 - i}.`,
        data: { 
          array: [...workingArray], 
          comparing: [], 
          sorted: Array.from({ length: i }, (_, idx) => n - 1 - idx), 
          pass: i + 1,
          swapped: false 
        },
        complexity: { time: 'O(n²)', space: 'O(1)' },
        code: `// Pass ${i + 1}: Find largest element in unsorted portion`
      });

      for (let j = 0; j < n - i - 1; j++) {
        // Compare elements
        steps.push({
          id: `step-${stepId++}`,
          title: `Comparing Elements`,
          description: `Comparing ${workingArray[j]} and ${workingArray[j + 1]} at positions ${j} and ${j + 1}.`,
          data: { 
            array: [...workingArray], 
            comparing: [j, j + 1], 
            sorted: Array.from({ length: i }, (_, idx) => n - 1 - idx), 
            pass: i + 1,
            swapped: false 
          },
          complexity: { time: 'O(n²)', space: 'O(1)' },
          code: `if (arr[${j}] > arr[${j + 1}]) {\n  // ${workingArray[j]} > ${workingArray[j + 1]} ? ${workingArray[j] > workingArray[j + 1]}`
        });

        if (workingArray[j] > workingArray[j + 1]) {
          // Swap needed
          steps.push({
            id: `step-${stepId++}`,
            title: `Swapping Elements`,
            description: `${workingArray[j]} > ${workingArray[j + 1]}, so we swap them. The larger element bubbles up!`,
            data: { 
              array: [...workingArray], 
              comparing: [j, j + 1], 
              sorted: Array.from({ length: i }, (_, idx) => n - 1 - idx), 
              pass: i + 1,
              swapped: true,
              swapping: [j, j + 1]
            },
            complexity: { time: 'O(n²)', space: 'O(1)' },
            code: `  // Swap: ${workingArray[j]} ↔ ${workingArray[j + 1]}\n  [arr[${j}], arr[${j + 1}]] = [arr[${j + 1}], arr[${j}]];`
          });

          // Perform the swap
          [workingArray[j], workingArray[j + 1]] = [workingArray[j + 1], workingArray[j]];
          swapped = true;

          // Show result after swap
          steps.push({
            id: `step-${stepId++}`,
            title: `Swap Complete`,
            description: `Swap complete! Array is now: [${workingArray.join(', ')}]`,
            data: { 
              array: [...workingArray], 
              comparing: [], 
              sorted: Array.from({ length: i }, (_, idx) => n - 1 - idx), 
              pass: i + 1,
              swapped: true 
            },
            complexity: { time: 'O(n²)', space: 'O(1)' },
            code: `// Array after swap: [${workingArray.join(', ')}]`
          });
        } else {
          // No swap needed
          steps.push({
            id: `step-${stepId++}`,
            title: `No Swap Needed`,
            description: `${workingArray[j]} ≤ ${workingArray[j + 1]}, so no swap needed. Continue to next pair.`,
            data: { 
              array: [...workingArray], 
              comparing: [], 
              sorted: Array.from({ length: i }, (_, idx) => n - 1 - idx), 
              pass: i + 1,
              swapped: false 
            },
            complexity: { time: 'O(n²)', space: 'O(1)' },
            code: `  // No swap needed: ${workingArray[j]} <= ${workingArray[j + 1]}`
          });
        }
      }

      // End of pass
      steps.push({
        id: `step-${stepId++}`,
        title: `Pass ${i + 1} Complete`,
        description: `Pass ${i + 1} complete! Element ${workingArray[n - 1 - i]} is now in its final position.`,
        data: { 
          array: [...workingArray], 
          comparing: [], 
          sorted: Array.from({ length: i + 1 }, (_, idx) => n - 1 - idx), 
          pass: i + 1,
          swapped: swapped,
          justSorted: [n - 1 - i]
        },
        complexity: { time: 'O(n²)', space: 'O(1)' },
        code: `// Pass ${i + 1} complete. Element at position ${n - 1 - i} is sorted.`
      });

      // Early termination check
      if (!swapped) {
        steps.push({
          id: `step-${stepId++}`,
          title: `Early Termination`,
          description: `No swaps occurred in this pass! The array is already sorted. We can stop early.`,
          data: { 
            array: [...workingArray], 
            comparing: [], 
            sorted: Array.from({ length: n }, (_, idx) => idx), 
            pass: i + 1,
            swapped: false,
            completed: true
          },
          complexity: { time: 'O(n²)', space: 'O(1)' },
          code: `// Optimization: No swaps means array is sorted!\nbreak; // Early termination`
        });
        break;
      }
    }

    // Final step
    if (steps[steps.length - 1]?.data?.completed !== true) {
      steps.push({
        id: `step-${stepId++}`,
        title: `Bubble Sort Complete!`,
        description: `All elements are now in their correct positions. The array is fully sorted!`,
        data: { 
          array: [...workingArray], 
          comparing: [], 
          sorted: Array.from({ length: n }, (_, idx) => idx), 
          pass: n - 1,
          swapped: false,
          completed: true
        },
        complexity: { time: 'O(n²)', space: 'O(1)' },
        code: `// Bubble sort complete!\n// Final sorted array: [${workingArray.join(', ')}]`
      });
    }

    return steps;
  };

  const handleSort = () => {
    speakOperation('Bubble Sort', 'Starting bubble sort. We will repeatedly compare adjacent elements and swap if they are out of order.');
    const sortSteps = generateBubbleSortSteps(array);
    setSteps(sortSteps);
    setStepDesc(sortSteps[0]?.description || '');
  };

  const handleReset = () => {
    speakResult('Resetting bubble sort visualization.');
    setArray([64, 34, 25, 12, 22, 11, 90]);
    setInputValue('64,34,25,12,22,11,90');
    setSteps([]);
  };

  return (
    <div className="space-y-3">
      {stepDesc && (<div className="p-2 bg-muted/20 rounded text-sm">{stepDesc}</div>)}
      {/* existing UI remains rendered by StepByStepBase / controls */}
    </div>
  );

  const handleShuffle = () => {
    const newArray = Array.from({ length: 7 }, () => Math.floor(Math.random() * 90) + 10);
    setArray(newArray);
    setInputValue(newArray.join(','));
    setSteps([]);
  };

  const handleInputChange = () => {
    try {
      const newArray = inputValue.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
      if (newArray.length > 0 && newArray.length <= 10) {
        setArray(newArray);
        setSteps([]);
      }
    } catch (error) {
      console.error('Invalid input');
    }
  };

  const renderSortVisualization = (currentStep: VisualizationStep) => {
    const { array: displayArray, comparing, sorted, swapping, justSorted } = currentStep.data;
    const maxValue = Math.max(...displayArray);

    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold mb-2">🫧 Bubble Sort Visualization</h3>
          <p className="text-sm text-muted-foreground">
            Watch how larger elements "bubble up" to their correct positions, just like bubbles rising in water!
          </p>
        </div>

        {/* Array Elements */}
        <div className="flex items-end justify-center gap-2 h-64">
          <AnimatePresence mode="popLayout">
            {displayArray.map((value: number, index: number) => {
              let barColor = 'bg-blue-500';
              let scale = 1;
              let y = 0;

              if (sorted?.includes(index)) {
                barColor = 'bg-green-500';
              } else if (justSorted?.includes(index)) {
                barColor = 'bg-green-400';
                scale = 1.1;
                y = -5;
              } else if (swapping?.includes(index)) {
                barColor = 'bg-red-500';
                scale = 1.1;
                y = -10;
              } else if (comparing?.includes(index)) {
                barColor = 'bg-yellow-500';
                scale = 1.05;
                y = -3;
              }

              return (
                <motion.div
                  key={`${index}-${value}`}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale,
                    y,
                    rotateX: swapping?.includes(index) ? [0, 10, -10, 0] : 0
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ 
                    duration: 0.5,
                    rotateX: { duration: 0.6, times: [0, 0.3, 0.7, 1] }
                  }}
                  className={`${barColor} rounded-t-lg flex flex-col items-center justify-end relative min-w-[50px] text-white font-bold shadow-lg`}
                  style={{
                    height: `${(value / maxValue) * 200 + 30}px`,
                  }}
                >
                  <span className="text-sm mb-2">{value}</span>
                  <span className="absolute -bottom-6 text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-1 py-0.5 rounded">
                    [{index}]
                  </span>
                  {showMemoryView && (
                    <span className="absolute -bottom-12 text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">
                      0x{memoryAddresses[index]?.toString(16).toUpperCase()}
                    </span>
                  )}

                  {/* Status indicators */}
                  {sorted?.includes(index) && (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs bg-green-500 text-white px-2 py-1 rounded">
                      ✓
                    </div>
                  )}
                  {comparing?.includes(index) && (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs bg-yellow-500 text-white px-2 py-1 rounded">
                      ?
                    </div>
                  )}
                  {swapping?.includes(index) && (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs bg-red-500 text-white px-2 py-1 rounded">
                      ↕
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Pass Information */}
        {currentStep.data.pass && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-full">
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Pass {currentStep.data.pass} {currentStep.data.completed ? '- Complete!' : '- In Progress'}
              </span>
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-3">
            <div className="text-lg font-bold text-blue-600">{displayArray.length}</div>
            <div className="text-xs text-blue-600">Total Elements</div>
          </div>
          <div className="bg-green-50 dark:bg-green-950 rounded-lg p-3">
            <div className="text-lg font-bold text-green-600">{sorted?.length || 0}</div>
            <div className="text-xs text-green-600">Sorted Elements</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-950 rounded-lg p-3">
            <div className="text-lg font-bold text-purple-600">{currentStep.data.pass || 0}</div>
            <div className="text-xs text-purple-600">Current Pass</div>
          </div>
        </div>

      {/* Memory Layout View */}
      {showMemoryView && (
        <div className="mt-6 p-4 bg-muted/20 rounded-lg border">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <HardDrive className="h-4 w-4" />
              Memory Layout
            </h4>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground mb-2">
                Array elements are stored in contiguous memory locations:
              </div>
              <div className="grid grid-cols-1 gap-1 font-mono text-xs">
                {displayArray.map((value, index) => (
                  <div 
                    key={index}
                    className={`flex justify-between items-center p-2 rounded ${
                      sorted?.includes(index) ? 'bg-green-100 dark:bg-green-900' :
                      comparing?.includes(index) ? 'bg-yellow-100 dark:bg-yellow-900' :
                      swapping?.includes(index) ? 'bg-red-100 dark:bg-red-900' :
                      'bg-gray-100 dark:bg-gray-800'
                    }`}
                  >
                    <span>arr[{index}]</span>
                    <span className="font-bold">{value}</span>
                    <span className="text-muted-foreground">
                      0x{memoryAddresses[index]?.toString(16).toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Each element occupies 4 bytes (32-bit integer). Base address: 0x{memoryAddresses[0]?.toString(16).toUpperCase()}
              </div>
              {/* Standardized Memory Layout Component */}
              <div className="mt-4">
                <MemoryLayout title="Array Memory Layout" data={array as number[]} baseAddress={0x1000} wordSize={4} />
              </div>
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
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium mb-2 block">Array Elements</label>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter numbers separated by commas"
              disabled={steps.length > 0}
            />
          </div>
          
          <Button 
            onClick={handleInputChange} 
            disabled={steps.length > 0}
            variant="outline"
          >
            Set Array
          </Button>
          
          <Button 
            onClick={handleSort} 
            disabled={steps.length > 0 || array.length === 0}
          >
            Start Bubble Sort
          </Button>
          
          <Button onClick={handleShuffle} variant="outline" disabled={steps.length > 0}>
            <Shuffle className="h-4 w-4 mr-2" />
            Shuffle
          </Button>
          
          <Button onClick={handleReset} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Memory Controls */}
      <div className="flex justify-center">
        <VisualizerControls
          showMemory={showMemoryView}
          onToggleMemory={setShowMemoryView}
          voiceEnabled={false}
          onToggleVoice={() => {}}
        />
      </div>

      {/* Step-by-Step Visualization */}
      {steps.length > 0 ? (
        <StepByStepBase
          steps={steps}
          title="Bubble Sort Step-by-Step"
          initialSpeed={1200}
        >
          {(currentStep) => renderSortVisualization(currentStep)}
        </StepByStepBase>
      ) : (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 rounded-xl p-8 border-2 border-dashed border-blue-200 dark:border-blue-800">
          {renderSortVisualization({
            id: 'initial',
            title: 'Ready to Sort',
            description: 'Click "Start Bubble Sort" to see the step-by-step process',
            data: { array, comparing: [], sorted: [], pass: 0 }
          } as VisualizationStep)}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span>Comparing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>Swapping</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Sorted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>Unsorted</span>
        </div>
      </div>

      {/* Algorithm Info */}
      <div className="bg-card border rounded-lg p-4">
        <h4 className="font-semibold mb-2">🫧 How Bubble Sort Works:</h4>
        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
          <li>Compare adjacent elements in the array</li>
          <li>If they're in the wrong order, swap them</li>
          <li>Continue through the array, "bubbling" large elements to the end</li>
          <li>Repeat until no more swaps are needed</li>
          <li>Each pass guarantees one more element is in its final position</li>
          <li>Optimization: Stop early if no swaps occur in a pass</li>
        </ol>
      </div>
    </div>
  );
}