import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RotateCcw, Shuffle } from 'lucide-react';
import { StepByStepBase, VisualizationStep } from './step-by-step-base';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

export function EnhancedInsertionSort() {
  const [array, setArray] = useState<number[]>([64, 34, 25, 12, 22, 11, 90]);
  const [inputValue, setInputValue] = useState('64,34,25,12,22,11,90');
  const [steps, setSteps] = useState<VisualizationStep[]>([]);
  const [showMemory, setShowMemory] = useState(false);
  const { voiceEnabled, setVoiceEnabled, speed, setSpeed, isSpeaking, pauseSpeech, resumeSpeech, stopSpeech, speakOperation, speakStep, speakResult } = useVisualizerVoice({ minInterval: 2000 });
  const [stepDesc, setStepDesc] = useState('');

  const generateInsertionSortSteps = (arr: number[]): VisualizationStep[] => {
    const steps: VisualizationStep[] = [];
    const workingArray = [...arr];
    const n = workingArray.length;
    let stepId = 0;

    // Initial state
    steps.push({
      id: `step-${stepId++}`,
      title: 'Insertion Sort Started',
      description: `Starting insertion sort with ${n} elements. The first element is considered sorted.`,
      data: { 
        array: [...workingArray], 
        comparing: [], 
        sorted: [0], 
        current: -1,
        inserting: -1,
        shifting: [],
        pass: 0
      },
      complexity: { time: 'O(n²)', space: 'O(1)' },
      code: `function insertionSort(arr) {\n  // First element is already sorted\n  for (let i = 1; i < arr.length; i++) {`
    });

    for (let i = 1; i < n; i++) {
      const key = workingArray[i];
      
      // Start of pass - show current element to insert
      steps.push({
        id: `step-${stepId++}`,
        title: `Pass ${i}: Select Element to Insert`,
        description: `Pass ${i}: Taking element ${key} at position ${i} to insert into the sorted portion.`,
        data: { 
          array: [...workingArray], 
          comparing: [], 
          sorted: Array.from({ length: i }, (_, idx) => idx), 
          current: i,
          inserting: i,
          shifting: [],
          pass: i,
          key: key
        },
        complexity: { time: 'O(n²)', space: 'O(1)' },
        code: `// Pass ${i}: Insert element ${key}\nlet key = arr[${i}]; // = ${key}\nlet j = ${i} - 1;`
      });

      let j = i - 1;
      const originalPosition = i;
      
      // Find correct position and shift elements
      while (j >= 0 && workingArray[j] > key) {
        // Show comparison
        steps.push({
          id: `step-${stepId++}`,
          title: `Comparing Elements`,
          description: `Comparing ${key} with ${workingArray[j]} at position ${j}. Since ${workingArray[j]} > ${key}, we need to shift ${workingArray[j]} right.`,
          data: { 
            array: [...workingArray], 
            comparing: [j, originalPosition], 
            sorted: Array.from({ length: i }, (_, idx) => idx), 
            current: originalPosition,
            inserting: originalPosition,
            shifting: [j],
            pass: i,
            key: key
          },
          complexity: { time: 'O(n²)', space: 'O(1)' },
          code: `while (j >= 0 && arr[${j}] > ${key}) {\n  // ${workingArray[j]} > ${key} ? true`
        });

        // Shift element right
        workingArray[j + 1] = workingArray[j];
        
        steps.push({
          id: `step-${stepId++}`,
          title: `Shifting Element Right`,
          description: `Shifting ${workingArray[j + 1]} from position ${j} to position ${j + 1} to make space for ${key}.`,
          data: { 
            array: [...workingArray], 
            comparing: [], 
            sorted: Array.from({ length: i }, (_, idx) => idx), 
            current: originalPosition,
            inserting: originalPosition,
            shifting: [j + 1],
            pass: i,
            key: key,
            shifted: [j + 1]
          },
          complexity: { time: 'O(n²)', space: 'O(1)' },
          code: `  arr[${j + 1}] = arr[${j}]; // Shift ${workingArray[j + 1]} right\n  j--;`
        });

        j--;
      }

      // Insert the key at correct position
      workingArray[j + 1] = key;
      
      steps.push({
        id: `step-${stepId++}`,
        title: `Inserting Element`,
        description: `Found the correct position! Inserting ${key} at position ${j + 1}.`,
        data: { 
          array: [...workingArray], 
          comparing: [], 
          sorted: Array.from({ length: i + 1 }, (_, idx) => idx), 
          current: -1,
          inserting: j + 1,
          shifting: [],
          pass: i,
          key: key,
          justInserted: [j + 1]
        },
        complexity: { time: 'O(n²)', space: 'O(1)' },
        code: `arr[${j + 1}] = ${key}; // Insert at correct position`
      });

      // End of pass
      steps.push({
        id: `step-${stepId++}`,
        title: `Pass ${i} Complete`,
        description: `Pass ${i} complete! Element ${key} is now in its correct position. The sorted portion has grown to ${i + 1} elements.`,
        data: { 
          array: [...workingArray], 
          comparing: [], 
          sorted: Array.from({ length: i + 1 }, (_, idx) => idx), 
          current: -1,
          inserting: -1,
          shifting: [],
          pass: i,
          passComplete: true
        },
        complexity: { time: 'O(n²)', space: 'O(1)' },
        code: `// Pass ${i} complete. Sorted portion: [${workingArray.slice(0, i + 1).join(', ')}]`
      });
    }

    // Final step
    steps.push({
      id: `step-${stepId++}`,
      title: `Insertion Sort Complete!`,
      description: `All elements have been inserted into their correct positions. The array is fully sorted!`,
      data: { 
        array: [...workingArray], 
        comparing: [], 
        sorted: Array.from({ length: n }, (_, idx) => idx), 
        current: -1,
        inserting: -1,
        shifting: [],
        pass: n - 1,
        completed: true
      },
      complexity: { time: 'O(n²)', space: 'O(1)' },
      code: `// Insertion sort complete!\n// Final sorted array: [${workingArray.join(', ')}]`
    });

    return steps;
  };

  const handleSort = () => {
    speakOperation('Insertion Sort', 'Starting insertion sort: pick a key and insert into sorted portion by shifting larger elements.');
    const sortSteps = generateInsertionSortSteps(array);
    setSteps(sortSteps);
    setStepDesc(sortSteps[0]?.description || '');
  };

  const handleReset = () => {
    speakResult('Resetting insertion sort visualization.');
    setArray([64, 34, 25, 12, 22, 11, 90]);
    setInputValue('64,34,25,12,22,11,90');
    setSteps([]);
  };

  const handleShuffle = () => {
    const newArray = Array.from({ length: 7 }, () => Math.floor(Math.random() * 90) + 10);
    setArray(newArray);
    setInputValue(newArray.join(','));
    setSteps([]);
  };

  return (
    <div className="space-y-3">
      {stepDesc && (<div className="p-2 bg-muted/20 rounded text-sm">{stepDesc}</div>)}
    </div>
  );

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
    const { array: displayArray, comparing, sorted, current, inserting, shifting, justInserted, shifted, key } = currentStep.data;
    const maxValue = Math.max(...displayArray);

    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold mb-2">🔄 Insertion Sort Visualization</h3>
          <p className="text-sm text-muted-foreground">
            Watch how we build the sorted array one element at a time by inserting each element in its correct position!
          </p>
        </div>

        {/* Key Element Display */}
        {key !== undefined && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-full">
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Key Element: {key}
              </span>
            </div>
          </div>
        )}

        {/* Array Elements */}
        <div className="flex items-end justify-center gap-2 h-64">
          <AnimatePresence mode="popLayout">
            {displayArray.map((value: number, index: number) => {
              let barColor = 'bg-gray-500';
              let scale = 1;
              let y = 0;
              let rotate = 0;

              if (sorted?.includes(index)) {
                barColor = 'bg-green-500';
              } else if (justInserted?.includes(index)) {
                barColor = 'bg-green-400';
                scale = 1.2;
                y = -10;
                rotate = 5;
              } else if (inserting === index) {
                barColor = 'bg-blue-500';
                scale = 1.15;
                y = -8;
              } else if (current === index) {
                barColor = 'bg-orange-500';
                scale = 1.1;
                y = -5;
              } else if (comparing?.includes(index)) {
                barColor = 'bg-yellow-500';
                scale = 1.05;
                y = -3;
              } else if (shifting?.includes(index) || shifted?.includes(index)) {
                barColor = 'bg-red-500';
                scale = 1.1;
                y = shifted?.includes(index) ? -8 : -5;
                rotate = shifted?.includes(index) ? -5 : 0;
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
                    rotate,
                    x: shifting?.includes(index) ? [0, 10, -10, 0] : 0
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ 
                    duration: 0.6,
                    x: { duration: 0.8, times: [0, 0.3, 0.7, 1] }
                  }}
                  className={`${barColor} rounded-t-lg flex flex-col items-center justify-end relative min-w-[45px] text-white font-bold shadow-lg`}
                  style={{
                    height: `${(value / maxValue) * 200 + 30}px`,
                  }}
                >
                  <span className="text-sm mb-2">{value}</span>
                  <span className="absolute -bottom-6 text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-1 py-0.5 rounded">
                    [{index}]
                  </span>

                  {/* Status indicators */}
                  {sorted?.includes(index) && !justInserted?.includes(index) && (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs bg-green-500 text-white px-2 py-1 rounded">
                      ✓
                    </div>
                  )}
                  {current === index && (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs bg-orange-500 text-white px-2 py-1 rounded">
                      KEY
                    </div>
                  )}
                  {inserting === index && current !== index && (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs bg-blue-500 text-white px-2 py-1 rounded">
                      INSERT
                    </div>
                  )}
                  {comparing?.includes(index) && !sorted?.includes(index) && (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs bg-yellow-500 text-white px-2 py-1 rounded">
                      CMP
                    </div>
                  )}
                  {(shifting?.includes(index) || shifted?.includes(index)) && (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs bg-red-500 text-white px-2 py-1 rounded">
                      →
                    </div>
                  )}
                  {justInserted?.includes(index) && (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs bg-green-400 text-white px-2 py-1 rounded">
                      NEW
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Pass Information */}
        {currentStep.data.pass !== undefined && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-full">
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Pass {currentStep.data.pass} {currentStep.data.completed ? '- Complete!' : currentStep.data.passComplete ? '- Pass Complete' : '- In Progress'}
              </span>
            </div>
          </div>
        )}

        {/* Sorted vs Unsorted Sections */}
        <div className="flex justify-center">
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{sorted?.length || 0}</div>
              <div className="text-xs text-green-600">Sorted Elements</div>
              <div className="text-xs text-muted-foreground mt-1">
                [{displayArray.slice(0, sorted?.length || 0).join(', ')}]
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-600">{displayArray.length - (sorted?.length || 0)}</div>
              <div className="text-xs text-gray-600">Unsorted Elements</div>
              <div className="text-xs text-muted-foreground mt-1">
                [{displayArray.slice(sorted?.length || 0).join(', ')}]
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="bg-gray-50 dark:bg-gray-950 rounded-lg p-3">
            <div className="text-lg font-bold text-gray-600">{displayArray.length}</div>
            <div className="text-xs text-gray-600">Total Elements</div>
          </div>
          <div className="bg-green-50 dark:bg-green-950 rounded-lg p-3">
            <div className="text-lg font-bold text-green-600">{sorted?.length || 0}</div>
            <div className="text-xs text-green-600">Sorted</div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-3">
            <div className="text-lg font-bold text-blue-600">{currentStep.data.pass || 0}</div>
            <div className="text-xs text-blue-600">Current Pass</div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-950 rounded-lg p-3">
            <div className="text-lg font-bold text-orange-600">{key || '-'}</div>
            <div className="text-xs text-orange-600">Key Element</div>
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
            Start Insertion Sort
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

      {/* Step-by-Step Visualization */}
      {steps.length > 0 ? (
        <StepByStepBase
          steps={steps}
          title="Insertion Sort Step-by-Step"
          initialSpeed={1400}
        >
          {(currentStep) => renderSortVisualization(currentStep)}
        </StepByStepBase>
      ) : (
        <div className="bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-950 dark:to-cyan-900 rounded-xl p-8 border-2 border-dashed border-blue-200 dark:border-blue-800">
          {renderSortVisualization({
            id: 'initial',
            title: 'Ready to Sort',
            description: 'Click "Start Insertion Sort" to see the step-by-step process',
            data: { array, comparing: [], sorted: [0], current: -1, pass: 0 }
          } as VisualizationStep)}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-500 rounded"></div>
          <span>Key Element</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span>Comparing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>Shifting</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>Inserting</span>
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
        <h4 className="font-semibold mb-2">🔄 How Insertion Sort Works:</h4>
        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
          <li>Start with the second element (first element is considered sorted)</li>
          <li>Take the current element (key) and compare it with elements in the sorted portion</li>
          <li>Shift all elements greater than the key one position to the right</li>
          <li>Insert the key at its correct position in the sorted portion</li>
          <li>Repeat for all remaining elements</li>
          <li>The sorted portion grows by one element in each pass</li>
        </ol>
        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950 rounded">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>💡 Key Insight:</strong> Insertion sort is like sorting playing cards in your hand - you pick up cards one by one and insert each into its correct position among the cards you've already sorted.
          </p>
        </div>
      </div>
      </div>

      {/* Controls below visualization: voice + memory */}
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

      {showMemory && (
        <div className="mt-4">
          <MemoryLayout title="Array Memory Layout" data={array as number[]} baseAddress={0x1010} wordSize={4} />
        </div>
      )}
    </div>
  );
}
