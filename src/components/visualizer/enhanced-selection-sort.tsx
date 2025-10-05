import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RotateCcw, Shuffle, HardDrive } from 'lucide-react';
import { StepByStepBase, VisualizationStep } from './step-by-step-base';
import { VisualizerControls } from './visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

export function EnhancedSelectionSort() {
  const [array, setArray] = useState<number[]>([64, 25, 12, 22, 11, 90]);
  const [inputValue, setInputValue] = useState('64,25,12,22,11,90');
  const [steps, setSteps] = useState<VisualizationStep[]>([]);
  const [showMemoryView, setShowMemoryView] = useState(false);
  const [memoryAddresses, setMemoryAddresses] = useState<number[]>([]);
  const { voiceEnabled, setVoiceEnabled, speed, setSpeed, isSpeaking, pauseSpeech, resumeSpeech, stopSpeech, speakOperation, speakStep, speakResult } = useVisualizerVoice({ minInterval: 2000 });
  const [stepDesc, setStepDesc] = useState('');

  const generateMemoryAddresses = () => {
    const baseAddress = 0x1000;
    return array.map((_, index) => baseAddress + (index * 4));
  };

  useEffect(() => {
    setMemoryAddresses(generateMemoryAddresses());
  }, [array]);

  const generateSelectionSortSteps = (arr: number[]): VisualizationStep[] => {
    const steps: VisualizationStep[] = [];
    const workingArray = [...arr];
    const n = workingArray.length;
    let stepId = 0;

    // Initial state
    steps.push({
      id: `step-${stepId++}`,
      title: 'Selection Sort Started',
      description: `Starting selection sort with ${n} elements. We'll find the minimum element and place it at the beginning.`,
      data: { 
        array: [...workingArray], 
        comparing: [], 
        sorted: [], 
        currentMin: -1,
        currentIndex: -1,
        pass: 0
      },
      complexity: { time: 'O(n²)', space: 'O(1)' },
      code: `function selectionSort(arr) {\n  const n = arr.length;\n  // Start sorting...`
    });

    for (let i = 0; i < n - 1; i++) {
      let minIndex = i;
      
      // Start of pass
      steps.push({
        id: `step-${stepId++}`,
        title: `Pass ${i + 1} Started`,
        description: `Starting pass ${i + 1}. Looking for the minimum element in positions ${i} to ${n - 1}.`,
        data: { 
          array: [...workingArray], 
          comparing: [], 
          sorted: Array.from({ length: i }, (_, idx) => idx), 
          currentMin: i,
          currentIndex: i,
          pass: i + 1
        },
        complexity: { time: 'O(n²)', space: 'O(1)' },
        code: `// Pass ${i + 1}: Find minimum in unsorted portion\nlet minIndex = ${i};`
      });

      // Find minimum element in remaining array
      for (let j = i + 1; j < n; j++) {
        // Compare with current minimum
        steps.push({
          id: `step-${stepId++}`,
          title: `Comparing Elements`,
          description: `Comparing ${workingArray[j]} at position ${j} with current minimum ${workingArray[minIndex]} at position ${minIndex}.`,
          data: { 
            array: [...workingArray], 
            comparing: [minIndex, j], 
            sorted: Array.from({ length: i }, (_, idx) => idx), 
            currentMin: minIndex,
            currentIndex: j,
            pass: i + 1
          },
          complexity: { time: 'O(n²)', space: 'O(1)' },
          code: `if (arr[${j}] < arr[${minIndex}]) {\n  // ${workingArray[j]} < ${workingArray[minIndex]} ? ${workingArray[j] < workingArray[minIndex]}`
        });

        if (workingArray[j] < workingArray[minIndex]) {
          minIndex = j;
          // New minimum found
          steps.push({
            id: `step-${stepId++}`,
            title: `New Minimum Found`,
            description: `${workingArray[j]} < ${workingArray[minIndex === j ? i : minIndex]}, so position ${j} becomes our new minimum!`,
            data: { 
              array: [...workingArray], 
              comparing: [i, j], 
              sorted: Array.from({ length: i }, (_, idx) => idx), 
              currentMin: j,
              currentIndex: j,
              pass: i + 1,
              newMin: true
            },
            complexity: { time: 'O(n²)', space: 'O(1)' },
            code: `  minIndex = ${j}; // New minimum found!`
          });
        } else {
          // No new minimum
          steps.push({
            id: `step-${stepId++}`,
            title: `Keep Current Minimum`,
            description: `${workingArray[j]} ≥ ${workingArray[minIndex]}, so position ${minIndex} remains our minimum.`,
            data: { 
              array: [...workingArray], 
              comparing: [], 
              sorted: Array.from({ length: i }, (_, idx) => idx), 
              currentMin: minIndex,
              currentIndex: j,
              pass: i + 1
            },
            complexity: { time: 'O(n²)', space: 'O(1)' },
            code: `  // Keep current minimum at position ${minIndex}`
          });
        }
      }

      // Swap if needed
      if (minIndex !== i) {
        steps.push({
          id: `step-${stepId++}`,
          title: `Swapping Elements`,
          description: `Minimum element ${workingArray[minIndex]} found at position ${minIndex}. Swapping with element at position ${i}.`,
          data: { 
            array: [...workingArray], 
            comparing: [i, minIndex], 
            sorted: Array.from({ length: i }, (_, idx) => idx), 
            currentMin: minIndex,
            currentIndex: -1,
            pass: i + 1,
            swapping: [i, minIndex]
          },
          complexity: { time: 'O(n²)', space: 'O(1)' },
          code: `// Swap: ${workingArray[i]} ↔ ${workingArray[minIndex]}\n[arr[${i}], arr[${minIndex}]] = [arr[${minIndex}], arr[${i}]];`
        });

        // Perform the swap
        [workingArray[i], workingArray[minIndex]] = [workingArray[minIndex], workingArray[i]];

        // Show result after swap
        steps.push({
          id: `step-${stepId++}`,
          title: `Swap Complete`,
          description: `Swap complete! Element ${workingArray[i]} is now in its correct position at index ${i}.`,
          data: { 
            array: [...workingArray], 
            comparing: [], 
            sorted: Array.from({ length: i + 1 }, (_, idx) => idx), 
            currentMin: -1,
            currentIndex: -1,
            pass: i + 1,
            justSorted: [i]
          },
          complexity: { time: 'O(n²)', space: 'O(1)' },
          code: `// Array after swap: [${workingArray.join(', ')}]`
        });
      } else {
        // No swap needed
        steps.push({
          id: `step-${stepId++}`,
          title: `No Swap Needed`,
          description: `Element ${workingArray[i]} at position ${i} is already the minimum. No swap needed.`,
          data: { 
            array: [...workingArray], 
            comparing: [], 
            sorted: Array.from({ length: i + 1 }, (_, idx) => idx), 
            currentMin: -1,
            currentIndex: -1,
            pass: i + 1,
            justSorted: [i]
          },
          complexity: { time: 'O(n²)', space: 'O(1)' },
          code: `// No swap needed: element ${workingArray[i]} is already minimum`
        });
      }

      // End of pass
      steps.push({
        id: `step-${stepId++}`,
        title: `Pass ${i + 1} Complete`,
        description: `Pass ${i + 1} complete! Element ${workingArray[i]} is now in its final sorted position.`,
        data: { 
          array: [...workingArray], 
          comparing: [], 
          sorted: Array.from({ length: i + 1 }, (_, idx) => idx), 
          currentMin: -1,
          currentIndex: -1,
          pass: i + 1,
          passComplete: true
        },
        complexity: { time: 'O(n²)', space: 'O(1)' },
        code: `// Pass ${i + 1} complete. Position ${i} is sorted.`
      });
    }

    // Final step
    steps.push({
      id: `step-${stepId++}`,
      title: `Selection Sort Complete!`,
      description: `All elements are now in their correct positions. The array is fully sorted!`,
      data: { 
        array: [...workingArray], 
        comparing: [], 
        sorted: Array.from({ length: n }, (_, idx) => idx), 
        currentMin: -1,
        currentIndex: -1,
        pass: n - 1,
        completed: true
      },
      complexity: { time: 'O(n²)', space: 'O(1)' },
      code: `// Selection sort complete!\n// Final sorted array: [${workingArray.join(', ')}]`
    });

    return steps;
  };

  const handleSort = () => {
    speakOperation('Selection Sort', 'Starting selection sort: repeatedly find the minimum and place it at the beginning.');
    const sortSteps = generateSelectionSortSteps(array);
    setSteps(sortSteps);
    setStepDesc(sortSteps[0]?.description || '');
  };

  return (
    <div className="space-y-3">
      {stepDesc && (<div className="p-2 bg-muted/20 rounded text-sm">{stepDesc}</div>)}
    </div>
  );

  const handleSort = () => {
    speakOperation('Selection Sort', 'Starting selection sort: find the minimum and place it at the front each pass.');
    const sortSteps = generateSelectionSortSteps(array);
    setSteps(sortSteps);
  };

  const handleReset = () => {
    speakResult('Resetting selection sort visualization.');
    setArray([64, 25, 12, 22, 11, 90]);
    setInputValue('64,25,12,22,11,90');
    setSteps([]);
  };

  const handleShuffle = () => {
    const newArray = Array.from({ length: 6 }, () => Math.floor(Math.random() * 90) + 10);
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
    const { array: displayArray, comparing, sorted, currentMin, swapping, justSorted, newMin } = currentStep.data;
    const maxValue = Math.max(...displayArray);

    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold mb-2">🎯 Selection Sort Visualization</h3>
          <p className="text-sm text-muted-foreground">
            Watch how we repeatedly select the minimum element and place it in the correct position!
          </p>
        </div>

        {/* Array Elements */}
        <div className="flex items-end justify-center gap-2 h-64">
          <AnimatePresence mode="popLayout">
            {displayArray.map((value: number, index: number) => {
              let barColor = 'bg-gray-500';
              let scale = 1;
              let y = 0;

              if (sorted?.includes(index)) {
                barColor = 'bg-green-500';
              } else if (justSorted?.includes(index)) {
                barColor = 'bg-green-400';
                scale = 1.15;
                y = -8;
              } else if (swapping?.includes(index)) {
                barColor = 'bg-red-500';
                scale = 1.1;
                y = -10;
              } else if (currentMin === index) {
                barColor = newMin ? 'bg-purple-400' : 'bg-purple-500';
                scale = newMin ? 1.2 : 1.1;
                y = newMin ? -12 : -5;
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
                    rotateY: swapping?.includes(index) ? [0, 15, -15, 0] : 0
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ 
                    duration: 0.5,
                    rotateY: { duration: 0.8, times: [0, 0.3, 0.7, 1] }
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

                  {/* Status indicators */}
                  {sorted?.includes(index) && (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs bg-green-500 text-white px-2 py-1 rounded">
                      ✓
                    </div>
                  )}
                  {currentMin === index && (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs bg-purple-500 text-white px-2 py-1 rounded">
                      MIN
                    </div>
                  )}
                  {comparing?.includes(index) && !sorted?.includes(index) && currentMin !== index && (
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900 rounded-full">
              <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
                Pass {currentStep.data.pass} {currentStep.data.completed ? '- Complete!' : '- In Progress'}
              </span>
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-gray-50 dark:bg-gray-950 rounded-lg p-3">
            <div className="text-lg font-bold text-gray-600">{displayArray.length}</div>
            <div className="text-xs text-gray-600">Total Elements</div>
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
            Start Selection Sort
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

      {/* Controls below visualization: voice + memory */}
      <div className="flex justify-center">
        <VisualizerControls
          showMemory={showMemoryView}
          onToggleMemory={setShowMemoryView}
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

      {showMemoryView && (
        <div className="mt-4">
          <MemoryLayout title="Array Memory Layout" data={array as number[]} baseAddress={0x1020} wordSize={4} />
        </div>
      )}

      {/* Step-by-Step Visualization */}
      {steps.length > 0 ? (
        <StepByStepBase
          steps={steps}
          title="Selection Sort Step-by-Step"
          initialSpeed={1200}
        >
          {(currentStep) => renderSortVisualization(currentStep)}
        </StepByStepBase>
      ) : (
        <div className="bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-950 dark:to-indigo-900 rounded-xl p-8 border-2 border-dashed border-purple-200 dark:border-purple-800">
          {renderSortVisualization({
            id: 'initial',
            title: 'Ready to Sort',
            description: 'Click "Start Selection Sort" to see the step-by-step process',
            data: { array, comparing: [], sorted: [], currentMin: -1, pass: 0 }
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
          <div className="w-4 h-4 bg-purple-500 rounded"></div>
          <span>Current Minimum</span>
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
          <div className="w-4 h-4 bg-gray-500 rounded"></div>
          <span>Unsorted</span>
        </div>
      </div>

      {/* Algorithm Info */}
      <div className="bg-card border rounded-lg p-4">
        <h4 className="font-semibold mb-2">🎯 How Selection Sort Works:</h4>
        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
          <li>Find the minimum element in the unsorted portion of the array</li>
          <li>Swap it with the first element of the unsorted portion</li>
          <li>Move the boundary between sorted and unsorted portions one position right</li>
          <li>Repeat until the entire array is sorted</li>
          <li>Each pass guarantees one more element is in its final position</li>
          <li>Unlike bubble sort, selection sort always makes exactly n-1 swaps</li>
        </ol>
      </div>
    </div>
  );
}
