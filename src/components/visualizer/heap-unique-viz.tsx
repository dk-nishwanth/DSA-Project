import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, RotateCcw, Plus, Minus, ArrowUp, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeapStep {
  array: number[];
  currentIndex: number | null;
  compareIndices: number[];
  message: string;
  operation: 'insert' | 'extract' | 'heapify' | 'complete';
  highlightSwap?: [number, number];
}

type HeapType = 'min' | 'max';
type Operation = 'insert' | 'extract';

export function HeapUniqueViz() {
  const [heapType, setHeapType] = useState<HeapType>('min');
  const [operation, setOperation] = useState<Operation>('insert');
  const [inputValue, setInputValue] = useState(15);
  const [steps, setSteps] = useState<HeapStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [initialHeap, setInitialHeap] = useState<number[]>([10, 20, 30, 40, 50, 60, 70]);

  const parent = (i: number) => Math.floor((i - 1) / 2);
  const leftChild = (i: number) => 2 * i + 1;
  const rightChild = (i: number) => 2 * i + 2;

  const shouldSwap = (parentVal: number, childVal: number): boolean => {
    return heapType === 'min' ? parentVal > childVal : parentVal < childVal;
  };

  const generateInsertSteps = (heap: number[], value: number): HeapStep[] => {
    const steps: HeapStep[] = [];
    const arr = [...heap];

    steps.push({
      array: [...arr],
      currentIndex: null,
      compareIndices: [],
      message: `Inserting ${value} into ${heapType}-heap`,
      operation: 'insert',
    });

    arr.push(value);
    let currentIdx = arr.length - 1;

    steps.push({
      array: [...arr],
      currentIndex: currentIdx,
      compareIndices: [],
      message: `Added ${value} at end (index ${currentIdx})`,
      operation: 'insert',
    });

    // Bubble up
    while (currentIdx > 0) {
      const parentIdx = parent(currentIdx);
      const parentVal = arr[parentIdx];
      const currentVal = arr[currentIdx];

      steps.push({
        array: [...arr],
        currentIndex: currentIdx,
        compareIndices: [parentIdx, currentIdx],
        message: `Compare ${currentVal} with parent ${parentVal}`,
        operation: 'insert',
      });

      if (shouldSwap(parentVal, currentVal)) {
        [arr[parentIdx], arr[currentIdx]] = [arr[currentIdx], arr[parentIdx]];
        
        steps.push({
          array: [...arr],
          currentIndex: parentIdx,
          compareIndices: [parentIdx, currentIdx],
          message: `Swap! ${currentVal} ${heapType === 'min' ? '<' : '>'} ${parentVal}, bubble up`,
          operation: 'insert',
          highlightSwap: [parentIdx, currentIdx]
        });

        currentIdx = parentIdx;
      } else {
        steps.push({
          array: [...arr],
          currentIndex: currentIdx,
          compareIndices: [parentIdx, currentIdx],
          message: `Heap property satisfied, stop bubbling`,
          operation: 'insert',
        });
        break;
      }
    }

    steps.push({
      array: [...arr],
      currentIndex: null,
      compareIndices: [],
      message: `Complete! ${value} inserted, heap property maintained`,
      operation: 'complete',
    });

    return steps;
  };

  const generateExtractSteps = (heap: number[]): HeapStep[] => {
    const steps: HeapStep[] = [];
    const arr = [...heap];

    if (arr.length === 0) {
      steps.push({
        array: [],
        currentIndex: null,
        compareIndices: [],
        message: 'Heap is empty',
        operation: 'complete',
      });
      return steps;
    }

    const extracted = arr[0];

    steps.push({
      array: [...arr],
      currentIndex: 0,
      compareIndices: [],
      message: `Extract ${heapType === 'min' ? 'minimum' : 'maximum'}: ${extracted}`,
      operation: 'extract',
    });

    arr[0] = arr[arr.length - 1];
    arr.pop();

    if (arr.length === 0) {
      steps.push({
        array: [],
        currentIndex: null,
        compareIndices: [],
        message: `Extracted ${extracted}, heap now empty`,
        operation: 'complete',
      });
      return steps;
    }

    steps.push({
      array: [...arr],
      currentIndex: 0,
      compareIndices: [],
      message: `Move last element ${arr[0]} to root`,
      operation: 'extract',
    });

    // Bubble down
    let currentIdx = 0;

    while (true) {
      const leftIdx = leftChild(currentIdx);
      const rightIdx = rightChild(currentIdx);
      let targetIdx = currentIdx;

      if (leftIdx < arr.length) {
        steps.push({
          array: [...arr],
          currentIndex: currentIdx,
          compareIndices: [currentIdx, leftIdx],
          message: `Compare ${arr[currentIdx]} with left child ${arr[leftIdx]}`,
          operation: 'extract',
        });

        if (shouldSwap(arr[currentIdx], arr[leftIdx])) {
          targetIdx = leftIdx;
        }
      }

      if (rightIdx < arr.length) {
        steps.push({
          array: [...arr],
          currentIndex: currentIdx,
          compareIndices: [currentIdx, rightIdx, ...(targetIdx !== currentIdx ? [targetIdx] : [])],
          message: `Compare with right child ${arr[rightIdx]}`,
          operation: 'extract',
        });

        if (shouldSwap(arr[targetIdx], arr[rightIdx])) {
          targetIdx = rightIdx;
        }
      }

      if (targetIdx === currentIdx) {
        steps.push({
          array: [...arr],
          currentIndex: currentIdx,
          compareIndices: [],
          message: `Heap property satisfied, stop bubbling`,
          operation: 'extract',
        });
        break;
      }

      [arr[currentIdx], arr[targetIdx]] = [arr[targetIdx], arr[currentIdx]];
      
      steps.push({
        array: [...arr],
        currentIndex: targetIdx,
        compareIndices: [currentIdx, targetIdx],
        message: `Swap ${arr[targetIdx]} with ${arr[currentIdx]}, bubble down`,
        operation: 'extract',
        highlightSwap: [currentIdx, targetIdx]
      });

      currentIdx = targetIdx;
    }

    steps.push({
      array: [...arr],
      currentIndex: null,
      compareIndices: [],
      message: `Complete! Extracted ${extracted}, heap property maintained`,
      operation: 'complete',
    });

    return steps;
  };

  const startVisualization = () => {
    let newSteps: HeapStep[] = [];

    switch (operation) {
      case 'insert':
        newSteps = generateInsertSteps(initialHeap, inputValue);
        if (newSteps.length > 0) {
          setInitialHeap(newSteps[newSteps.length - 1].array);
        }
        break;
      case 'extract':
        newSteps = generateExtractSteps(initialHeap);
        if (newSteps.length > 0) {
          setInitialHeap(newSteps[newSteps.length - 1].array);
        }
        break;
    }

    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const reset = () => {
    setInitialHeap([10, 20, 30, 40, 50, 60, 70]);
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, steps.length, speed]);

  const currentStepData = steps[currentStep];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Heap Data Structure</h3>
        <p className="text-muted-foreground">
          Visualize heap operations: insert with bubble-up, extract with bubble-down
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Heap Type</label>
          <Select value={heapType} onValueChange={(v: HeapType) => setHeapType(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="min">Min-Heap</SelectItem>
              <SelectItem value="max">Max-Heap</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Operation</label>
          <Select value={operation} onValueChange={(v: Operation) => setOperation(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="insert">Insert</SelectItem>
              <SelectItem value="extract">Extract {heapType === 'min' ? 'Min' : 'Max'}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            {operation === 'insert' ? 'Value to Insert' : 'Speed'}
          </label>
          {operation === 'insert' ? (
            <Input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(parseInt(e.target.value) || 0)}
            />
          ) : (
            <Select value={speed.toString()} onValueChange={(v) => setSpeed(parseInt(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1500">Slow</SelectItem>
                <SelectItem value="1000">Normal</SelectItem>
                <SelectItem value="500">Fast</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="flex gap-2 items-end">
          <Button onClick={startVisualization} className="flex-1">
            {operation === 'insert' ? <Plus className="h-4 w-4 mr-2" /> : <Minus className="h-4 w-4 mr-2" />}
            Start
          </Button>
          <Button onClick={reset} variant="outline">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {steps.length > 0 && currentStepData && (
        <div className="space-y-6">
          <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-4 text-center border-2 border-blue-400">
            <div className="text-lg font-semibold">{currentStepData.message}</div>
          </div>

          <div className="bg-card border rounded-lg p-4">
            <h4 className="font-semibold mb-3">Array Representation</h4>
            <div className="flex flex-wrap gap-2 justify-center">
              <AnimatePresence mode="popLayout">
                {currentStepData.array.map((val, idx) => {
                  const isCurrent = idx === currentStepData.currentIndex;
                  const isComparing = currentStepData.compareIndices.includes(idx);
                  const isSwapping = currentStepData.highlightSwap?.includes(idx);

                  return (
                    <motion.div
                      key={`${idx}-${val}`}
                      layout
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: isCurrent ? 1.2 : 1, opacity: 1 }}
                      className={`
                        w-16 h-16 flex flex-col items-center justify-center rounded-lg border-2 font-bold
                        ${isCurrent ? 'bg-blue-500 border-blue-600 text-white ring-4 ring-blue-300' :
                          isSwapping ? 'bg-green-500 border-green-600 text-white' :
                          isComparing ? 'bg-yellow-300 border-yellow-400' :
                          'bg-gray-200 border-gray-300'}
                      `}
                    >
                      <div className="text-lg">{val}</div>
                      <div className="text-xs text-muted-foreground">[{idx}]</div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <Button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              variant="outline"
              size="sm"
            >
              Previous
            </Button>
            <div className="flex-1">
              <div className="text-center text-sm text-muted-foreground mb-2">
                Step {currentStep + 1} of {steps.length}
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>
            <Button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              disabled={currentStep === steps.length - 1}
              variant="outline"
              size="sm"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-3 text-blue-600">🏔️ Heap Property</h4>
          <div className="space-y-2 text-sm">
            <div><strong>Min-Heap:</strong> Parent ≤ Children</div>
            <div><strong>Max-Heap:</strong> Parent ≥ Children</div>
            <div>• Complete binary tree</div>
            <div>• Array representation</div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-3 text-green-600">⚡ Operations</h4>
          <div className="space-y-2 text-sm">
            <div><strong>Insert:</strong> O(log n)</div>
            <div><strong>Extract:</strong> O(log n)</div>
            <div><strong>Peek:</strong> O(1)</div>
            <div><strong>Heapify:</strong> O(n)</div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-3 text-purple-600">🎯 Applications</h4>
          <div className="space-y-2 text-sm">
            <div>• Priority queues</div>
            <div>• Heap sort algorithm</div>
            <div>• Dijkstra's algorithm</div>
            <div>• Task scheduling</div>
          </div>
        </div>
      </div>
    </div>
  );
}
