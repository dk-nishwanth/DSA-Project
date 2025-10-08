import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Search, RotateCcw, Grid, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

interface ArrayOperation {
  step: number;
  operation: string;
  index?: number;
  value?: number;
  array: number[];
  description: string;
  highlight?: number[];
}

export function ArrayFundamentalsVisualizer() {
  const [operation, setOperation] = useState('access');
  const [array, setArray] = useState([10, 25, 30, 45, 50, 65, 70]);
  const [inputValue, setInputValue] = useState(35);
  const [inputIndex, setInputIndex] = useState(2);
  const [steps, setSteps] = useState<ArrayOperation[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showMemory, setShowMemory] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const {
    voiceEnabled,
    setVoiceEnabled,
    speed,
    setSpeed,
    isSpeaking,
    pauseSpeech,
    resumeSpeech,
    stopSpeech,
    speakOperation,
    speakStep,
    speakResult,
  } = useVisualizerVoice({ minInterval: 1500 });

  const operations = [
    { value: 'access', label: 'Array Access' },
    { value: 'insert', label: 'Insert Element' },
    { value: 'delete', label: 'Delete Element' },
    { value: 'search', label: 'Linear Search' },
    { value: 'traverse', label: 'Array Traversal' },
    { value: 'update', label: 'Update Element' }
  ];

  const generateAccessSteps = (arr: number[], index: number): ArrayOperation[] => {
    const steps: ArrayOperation[] = [];
    let stepNum = 0;

    steps.push({
      step: stepNum++,
      operation: 'Initialize',
      array: [...arr],
      description: `Array with ${arr.length} elements`,
    });

    if (index < 0 || index >= arr.length) {
      steps.push({
        step: stepNum++,
        operation: 'Error',
        array: [...arr],
        index,
        description: `Index ${index} is out of bounds (0 to ${arr.length - 1})`,
        highlight: []
      });
      return steps;
    }

    steps.push({
      step: stepNum++,
      operation: 'Access',
      array: [...arr],
      index,
      value: arr[index],
      description: `Accessing element at index ${index}: arr[${index}] = ${arr[index]}`,
      highlight: [index]
    });

    steps.push({
      step: stepNum++,
      operation: 'Result',
      array: [...arr],
      index,
      value: arr[index],
      description: `Successfully accessed value ${arr[index]} in O(1) time`,
      highlight: [index]
    });

    return steps;
  };

  const generateInsertSteps = (arr: number[], index: number, value: number): ArrayOperation[] => {
    const steps: ArrayOperation[] = [];
    let stepNum = 0;
    let currentArray = [...arr];

    steps.push({
      step: stepNum++,
      operation: 'Initialize',
      array: [...currentArray],
      description: `Insert ${value} at index ${index}`,
    });

    if (index < 0 || index > currentArray.length) {
      steps.push({
        step: stepNum++,
        operation: 'Error',
        array: [...currentArray],
        description: `Invalid index ${index} for insertion`,
      });
      return steps;
    }

    // Show shifting elements
    if (index < currentArray.length) {
      steps.push({
        step: stepNum++,
        operation: 'Shift Right',
        array: [...currentArray],
        index,
        description: `Shift elements from index ${index} to right`,
        highlight: Array.from({ length: currentArray.length - index }, (_, i) => index + i)
      });
    }

    // Insert the element
    currentArray.splice(index, 0, value);
    steps.push({
      step: stepNum++,
      operation: 'Insert',
      array: [...currentArray],
      index,
      value,
      description: `Insert ${value} at index ${index}`,
      highlight: [index]
    });

    steps.push({
      step: stepNum++,
      operation: 'Complete',
      array: [...currentArray],
      description: `Insertion complete. Array size: ${currentArray.length}`,
    });

    return steps;
  };

  const generateDeleteSteps = (arr: number[], index: number): ArrayOperation[] => {
    const steps: ArrayOperation[] = [];
    let stepNum = 0;
    let currentArray = [...arr];

    steps.push({
      step: stepNum++,
      operation: 'Initialize',
      array: [...currentArray],
      description: `Delete element at index ${index}`,
    });

    if (index < 0 || index >= currentArray.length) {
      steps.push({
        step: stepNum++,
        operation: 'Error',
        array: [...currentArray],
        description: `Index ${index} is out of bounds`,
      });
      return steps;
    }

    const deletedValue = currentArray[index];
    steps.push({
      step: stepNum++,
      operation: 'Mark for Deletion',
      array: [...currentArray],
      index,
      value: deletedValue,
      description: `Element to delete: ${deletedValue} at index ${index}`,
      highlight: [index]
    });

    // Show shifting elements
    if (index < currentArray.length - 1) {
      steps.push({
        step: stepNum++,
        operation: 'Shift Left',
        array: [...currentArray],
        index,
        description: `Shift elements from index ${index + 1} to left`,
        highlight: Array.from({ length: currentArray.length - index - 1 }, (_, i) => index + i + 1)
      });
    }

    // Delete the element
    currentArray.splice(index, 1);
    steps.push({
      step: stepNum++,
      operation: 'Delete',
      array: [...currentArray],
      description: `Deleted ${deletedValue}. Array size: ${currentArray.length}`,
    });

    return steps;
  };

  const generateSearchSteps = (arr: number[], target: number): ArrayOperation[] => {
    const steps: ArrayOperation[] = [];
    let stepNum = 0;

    steps.push({
      step: stepNum++,
      operation: 'Initialize',
      array: [...arr],
      description: `Search for ${target} in array`,
    });

    for (let i = 0; i < arr.length; i++) {
      steps.push({
        step: stepNum++,
        operation: 'Compare',
        array: [...arr],
        index: i,
        value: arr[i],
        description: `Check index ${i}: arr[${i}] = ${arr[i]} ${arr[i] === target ? '== ' + target + ' ✓' : '!= ' + target}`,
        highlight: [i]
      });

      if (arr[i] === target) {
        steps.push({
          step: stepNum++,
          operation: 'Found',
          array: [...arr],
          index: i,
          value: target,
          description: `Found ${target} at index ${i}`,
          highlight: [i]
        });
        return steps;
      }
    }

    steps.push({
      step: stepNum++,
      operation: 'Not Found',
      array: [...arr],
      description: `${target} not found in array`,
    });

    return steps;
  };

  const generateTraverseSteps = (arr: number[]): ArrayOperation[] => {
    const steps: ArrayOperation[] = [];
    let stepNum = 0;

    steps.push({
      step: stepNum++,
      operation: 'Initialize',
      array: [...arr],
      description: `Traverse array of ${arr.length} elements`,
    });

    for (let i = 0; i < arr.length; i++) {
      steps.push({
        step: stepNum++,
        operation: 'Visit',
        array: [...arr],
        index: i,
        value: arr[i],
        description: `Visit index ${i}: process element ${arr[i]}`,
        highlight: [i]
      });
    }

    steps.push({
      step: stepNum++,
      operation: 'Complete',
      array: [...arr],
      description: `Traversal complete. Visited all ${arr.length} elements`,
    });

    return steps;
  };

  const generateUpdateSteps = (arr: number[], index: number, newValue: number): ArrayOperation[] => {
    const steps: ArrayOperation[] = [];
    let stepNum = 0;
    let currentArray = [...arr];

    steps.push({
      step: stepNum++,
      operation: 'Initialize',
      array: [...currentArray],
      description: `Update element at index ${index} to ${newValue}`,
    });

    if (index < 0 || index >= currentArray.length) {
      steps.push({
        step: stepNum++,
        operation: 'Error',
        array: [...currentArray],
        description: `Index ${index} is out of bounds`,
      });
      return steps;
    }

    const oldValue = currentArray[index];
    steps.push({
      step: stepNum++,
      operation: 'Access',
      array: [...currentArray],
      index,
      value: oldValue,
      description: `Current value at index ${index}: ${oldValue}`,
      highlight: [index]
    });

    currentArray[index] = newValue;
    steps.push({
      step: stepNum++,
      operation: 'Update',
      array: [...currentArray],
      index,
      value: newValue,
      description: `Updated arr[${index}] from ${oldValue} to ${newValue}`,
      highlight: [index]
    });

    return steps;
  };

  const runOperation = () => {
    setIsAnimating(true);
    speakOperation('Array Fundamentals', `Running ${operations.find(op=>op.value===operation)?.label || 'operation'}.`);
    
    let newSteps: ArrayOperation[] = [];

    switch (operation) {
      case 'access':
        newSteps = generateAccessSteps(array, inputIndex);
        break;
      case 'insert':
        newSteps = generateInsertSteps(array, inputIndex, inputValue);
        break;
      case 'delete':
        newSteps = generateDeleteSteps(array, inputIndex);
        break;
      case 'search':
        newSteps = generateSearchSteps(array, inputValue);
        break;
      case 'traverse':
        newSteps = generateTraverseSteps(array);
        break;
      case 'update':
        newSteps = generateUpdateSteps(array, inputIndex, inputValue);
        break;
    }

    setSteps(newSteps);
    setCurrentStep(0);
    
    setTimeout(() => setIsAnimating(false), 1000);
    speakResult(`${operation} operation completed with ${newSteps.length} steps.`);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      if (steps[newStep]) {
        speakStep(`Step ${newStep + 1}`, steps[newStep].description, newStep, steps.length);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const reset = () => {
    setSteps([]);
    setCurrentStep(0);
    setIsAnimating(false);
    setArray([10, 25, 30, 45, 50, 65, 70]);
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Operation</label>
          <Select value={operation} onValueChange={setOperation}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {operations.map(op => (
                <SelectItem key={op.value} value={op.value}>
                  {op.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!['traverse'].includes(operation) && (
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {['search'].includes(operation) ? 'Search Value' : 'Value'}
            </label>
            <Input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(parseInt(e.target.value) || 0)}
            />
          </div>
        )}

        {!['search', 'traverse'].includes(operation) && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Index</label>
            <Input
              type="number"
              min="0"
              value={inputIndex}
              onChange={(e) => setInputIndex(parseInt(e.target.value) || 0)}
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Array</label>
          <Input
            value={array.join(', ')}
            onChange={(e) => {
              const values = e.target.value.split(',').map(v => parseInt(v.trim()) || 0);
              setArray(values);
            }}
            placeholder="10, 25, 30, 45, 50"
          />
        </div>

        <div className="flex gap-2 items-end">
          <Button onClick={runOperation} className="flex items-center gap-2" disabled={isAnimating}>
            <Grid className="h-4 w-4" />
            {isAnimating ? 'Running...' : 'Run'}
          </Button>
          <Button onClick={reset} variant="outline">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Array Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid className="h-5 w-5" />
            Array Visualization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Array Display */}
            <div className="flex flex-wrap gap-2 justify-center">
              {(currentStepData?.array || array).map((value, index) => {
                const isHighlighted = currentStepData?.highlight?.includes(index);
                const isCurrentIndex = currentStepData?.index === index;
                
                return (
                  <motion.div
                    key={`${index}-${value}`}
                    className={`relative flex flex-col items-center p-3 border-2 rounded-lg min-w-[60px] ${
                      isCurrentIndex ? 'border-red-500 bg-red-100 dark:bg-red-900' :
                      isHighlighted ? 'border-yellow-500 bg-yellow-100 dark:bg-yellow-900' :
                      'border-gray-300 bg-white dark:bg-gray-800'
                    }`}
                    initial={{ scale: 1 }}
                    animate={{ 
                      scale: isCurrentIndex || isHighlighted ? 1.1 : 1,
                      y: isCurrentIndex ? -5 : 0
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-xs text-muted-foreground mb-1">
                      [{index}]
                    </div>
                    <div className="text-lg font-bold">
                      {value}
                    </div>
                    {isCurrentIndex && (
                      <motion.div
                        className="absolute -top-8 left-1/2 transform -translate-x-1/2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <ArrowRight className="h-4 w-4 text-red-500 rotate-90" />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Array Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded">
                <div className="text-sm text-muted-foreground">Length</div>
                <div className="text-xl font-bold">{(currentStepData?.array || array).length}</div>
              </div>
              <div className="bg-green-50 dark:bg-green-950 p-3 rounded">
                <div className="text-sm text-muted-foreground">Memory</div>
                <div className="text-xl font-bold">{(currentStepData?.array || array).length * 4}B</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-950 p-3 rounded">
                <div className="text-sm text-muted-foreground">Access Time</div>
                <div className="text-xl font-bold">O(1)</div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-950 p-3 rounded">
                <div className="text-sm text-muted-foreground">Space</div>
                <div className="text-xl font-bold">O(n)</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Navigation */}
      {steps.length > 0 && (
        <div className="flex items-center justify-center gap-4">
          <Button onClick={prevStep} disabled={currentStep === 0} variant="outline">
            Previous
          </Button>
          <Badge variant="secondary">
            Step {currentStep + 1} of {steps.length}
          </Badge>
          <Button onClick={nextStep} disabled={currentStep === steps.length - 1} variant="outline">
            Next
          </Button>
        </div>
      )}

      {/* Current Step Display */}
      <AnimatePresence mode="wait">
        {currentStepData && (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-2 border-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="outline">{currentStepData.operation}</Badge>
                  Step {currentStep + 1}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">{currentStepData.description}</p>
                
                {currentStepData.index !== undefined && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-muted p-3 rounded">
                      <div className="text-sm text-muted-foreground">Index</div>
                      <div className="text-xl font-bold">{currentStepData.index}</div>
                    </div>
                    {currentStepData.value !== undefined && (
                      <div className="bg-muted p-3 rounded">
                        <div className="text-sm text-muted-foreground">Value</div>
                        <div className="text-xl font-bold">{currentStepData.value}</div>
                      </div>
                    )}
                    <div className="bg-muted p-3 rounded">
                      <div className="text-sm text-muted-foreground">Array Size</div>
                      <div className="text-xl font-bold">{currentStepData.array.length}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
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

      {/* Memory Layout */}
      {showMemory && (
        <MemoryLayout
          title="Array Memory Layout"
          data={currentStepData?.array || array}
          baseAddress={0x1000}
          wordSize={4}
        />
      )}

      {/* Educational Information */}
      <Card>
        <CardHeader>
          <CardTitle>Array Fundamentals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Key Properties:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Fixed size (in most languages)</li>
                <li>• Elements stored in contiguous memory</li>
                <li>• Zero-based indexing</li>
                <li>• Random access in O(1) time</li>
                <li>• Cache-friendly due to locality</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Time Complexities:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Access: O(1)</li>
                <li>• Search: O(n)</li>
                <li>• Insert: O(n) - due to shifting</li>
                <li>• Delete: O(n) - due to shifting</li>
                <li>• Update: O(1)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}