import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Eye, RotateCcw, Layers, ArrowUp, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

interface StackStep {
  step: number;
  operation: string;
  value?: number;
  stack: number[];
  description: string;
  error?: string;
  result?: number;
}

export function StackOperationsVisualizer() {
  const [operation, setOperation] = useState('push');
  const [inputValue, setInputValue] = useState(42);
  const [stack, setStack] = useState<number[]>([10, 20, 30]);
  const [steps, setSteps] = useState<StackStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showMemory, setShowMemory] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [maxSize] = useState(8);

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
    { value: 'push', label: 'Push (Add to top)' },
    { value: 'pop', label: 'Pop (Remove from top)' },
    { value: 'peek', label: 'Peek/Top (View top)' },
    { value: 'isEmpty', label: 'Is Empty Check' },
    { value: 'size', label: 'Get Size' },
    { value: 'clear', label: 'Clear Stack' }
  ];

  const generatePushSteps = (currentStack: number[], value: number): StackStep[] => {
    const steps: StackStep[] = [];
    let stepNum = 0;

    steps.push({
      step: stepNum++,
      operation: 'Initialize',
      stack: [...currentStack],
      description: `Current stack has ${currentStack.length} elements`,
    });

    if (currentStack.length >= maxSize) {
      steps.push({
        step: stepNum++,
        operation: 'Error',
        value,
        stack: [...currentStack],
        description: `Stack overflow! Cannot push ${value} - stack is full (max size: ${maxSize})`,
        error: 'Stack Overflow'
      });
      return steps;
    }

    steps.push({
      step: stepNum++,
      operation: 'Push',
      value,
      stack: [...currentStack, value],
      description: `Push ${value} onto the stack (add to top)`,
    });

    steps.push({
      step: stepNum++,
      operation: 'Complete',
      value,
      stack: [...currentStack, value],
      description: `Successfully pushed ${value}. Stack size: ${currentStack.length + 1}`,
    });

    return steps;
  };

  const generatePopSteps = (currentStack: number[]): StackStep[] => {
    const steps: StackStep[] = [];
    let stepNum = 0;

    steps.push({
      step: stepNum++,
      operation: 'Initialize',
      stack: [...currentStack],
      description: `Current stack has ${currentStack.length} elements`,
    });

    if (currentStack.length === 0) {
      steps.push({
        step: stepNum++,
        operation: 'Error',
        stack: [...currentStack],
        description: `Stack underflow! Cannot pop from empty stack`,
        error: 'Stack Underflow'
      });
      return steps;
    }

    const poppedValue = currentStack[currentStack.length - 1];
    const newStack = currentStack.slice(0, -1);

    steps.push({
      step: stepNum++,
      operation: 'Pop',
      value: poppedValue,
      stack: newStack,
      description: `Pop ${poppedValue} from the stack (remove from top)`,
      result: poppedValue
    });

    steps.push({
      step: stepNum++,
      operation: 'Complete',
      value: poppedValue,
      stack: newStack,
      description: `Successfully popped ${poppedValue}. Stack size: ${newStack.length}`,
      result: poppedValue
    });

    return steps;
  };

  const generatePeekSteps = (currentStack: number[]): StackStep[] => {
    const steps: StackStep[] = [];
    let stepNum = 0;

    steps.push({
      step: stepNum++,
      operation: 'Initialize',
      stack: [...currentStack],
      description: `Current stack has ${currentStack.length} elements`,
    });

    if (currentStack.length === 0) {
      steps.push({
        step: stepNum++,
        operation: 'Error',
        stack: [...currentStack],
        description: `Cannot peek empty stack`,
        error: 'Empty Stack'
      });
      return steps;
    }

    const topValue = currentStack[currentStack.length - 1];

    steps.push({
      step: stepNum++,
      operation: 'Peek',
      value: topValue,
      stack: [...currentStack],
      description: `Peek at top element: ${topValue} (stack unchanged)`,
      result: topValue
    });

    return steps;
  };

  const generateIsEmptySteps = (currentStack: number[]): StackStep[] => {
    const steps: StackStep[] = [];
    let stepNum = 0;

    steps.push({
      step: stepNum++,
      operation: 'Check Empty',
      stack: [...currentStack],
      description: `Check if stack is empty: ${currentStack.length === 0 ? 'Yes' : 'No'}`,
      result: currentStack.length === 0 ? 1 : 0
    });

    return steps;
  };

  const generateSizeSteps = (currentStack: number[]): StackStep[] => {
    const steps: StackStep[] = [];
    let stepNum = 0;

    steps.push({
      step: stepNum++,
      operation: 'Get Size',
      stack: [...currentStack],
      description: `Stack size: ${currentStack.length} elements`,
      result: currentStack.length
    });

    return steps;
  };

  const generateClearSteps = (currentStack: number[]): StackStep[] => {
    const steps: StackStep[] = [];
    let stepNum = 0;

    steps.push({
      step: stepNum++,
      operation: 'Initialize',
      stack: [...currentStack],
      description: `Current stack has ${currentStack.length} elements`,
    });

    steps.push({
      step: stepNum++,
      operation: 'Clear',
      stack: [],
      description: `Clear all elements from stack`,
    });

    return steps;
  };

  const runOperation = () => {
    setIsAnimating(true);
    speakOperation('Stack Operations', `Running ${operations.find(op=>op.value===operation)?.label || 'operation'}.`);
    
    let newSteps: StackStep[] = [];
    let newStack = [...stack];

    switch (operation) {
      case 'push':
        newSteps = generatePushSteps(stack, inputValue);
        if (stack.length < maxSize) {
          newStack = [...stack, inputValue];
        }
        break;
      case 'pop':
        newSteps = generatePopSteps(stack);
        if (stack.length > 0) {
          newStack = stack.slice(0, -1);
        }
        break;
      case 'peek':
        newSteps = generatePeekSteps(stack);
        break;
      case 'isEmpty':
        newSteps = generateIsEmptySteps(stack);
        break;
      case 'size':
        newSteps = generateSizeSteps(stack);
        break;
      case 'clear':
        newSteps = generateClearSteps(stack);
        newStack = [];
        break;
    }

    setSteps(newSteps);
    setCurrentStep(0);
    
    // Update stack state for operations that modify it
    if (['push', 'pop', 'clear'].includes(operation)) {
      setTimeout(() => setStack(newStack), 1000);
    }
    
    setTimeout(() => setIsAnimating(false), 1000);
    speakResult(`${operation} operation completed.`);
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
    setStack([10, 20, 30]);
  };

  const currentStepData = steps[currentStep];
  const displayStack = currentStepData?.stack || stack;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        {operation === 'push' && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Value to Push</label>
            <Input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(parseInt(e.target.value) || 0)}
            />
          </div>
        )}

        <div className="flex gap-2 items-end">
          <Button onClick={runOperation} className="flex items-center gap-2" disabled={isAnimating}>
            <Layers className="h-4 w-4" />
            {isAnimating ? 'Running...' : 'Run'}
          </Button>
          <Button onClick={reset} variant="outline">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stack Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Stack Visualization (LIFO - Last In, First Out)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Stack Display */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-4">
                <ArrowUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 font-medium">TOP (Push/Pop here)</span>
              </div>
              
              <div className="flex flex-col-reverse gap-1 min-h-[300px] justify-end">
                <AnimatePresence>
                  {displayStack.map((value, index) => (
                    <motion.div
                      key={`${index}-${value}`}
                      className={`w-32 h-12 border-2 rounded-lg flex items-center justify-center font-bold text-lg ${
                        index === displayStack.length - 1 
                          ? 'border-red-500 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' 
                          : 'border-blue-500 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      }`}
                      initial={{ opacity: 0, y: -20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                    >
                      {value}
                      {index === displayStack.length - 1 && (
                        <motion.div
                          className="absolute -right-8 text-red-500"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                          ← TOP
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {/* Empty stack indicator */}
                {displayStack.length === 0 && (
                  <div className="w-32 h-12 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-gray-500">
                    Empty
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2 mt-4">
                <ArrowDown className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">BOTTOM</span>
              </div>
            </div>

            {/* Stack Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded">
                <div className="text-sm text-muted-foreground">Size</div>
                <div className="text-xl font-bold">{displayStack.length}</div>
              </div>
              <div className="bg-green-50 dark:bg-green-950 p-3 rounded">
                <div className="text-sm text-muted-foreground">Max Size</div>
                <div className="text-xl font-bold">{maxSize}</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-950 p-3 rounded">
                <div className="text-sm text-muted-foreground">Top Element</div>
                <div className="text-xl font-bold">
                  {displayStack.length > 0 ? displayStack[displayStack.length - 1] : 'None'}
                </div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-950 p-3 rounded">
                <div className="text-sm text-muted-foreground">Is Empty</div>
                <div className="text-xl font-bold">{displayStack.length === 0 ? 'Yes' : 'No'}</div>
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
            <Card className={`border-2 ${
              currentStepData.error ? 'border-red-500' : 'border-blue-500'
            }`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant={currentStepData.error ? 'destructive' : 'outline'}>
                    {currentStepData.operation}
                  </Badge>
                  Step {currentStep + 1}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg mb-4">{currentStepData.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {currentStepData.value !== undefined && (
                    <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded">
                      <div className="text-sm text-muted-foreground">Value</div>
                      <div className="text-xl font-bold">{currentStepData.value}</div>
                    </div>
                  )}
                  <div className="bg-green-50 dark:bg-green-950 p-3 rounded">
                    <div className="text-sm text-muted-foreground">Stack Size</div>
                    <div className="text-xl font-bold">{currentStepData.stack.length}</div>
                  </div>
                  {currentStepData.result !== undefined && (
                    <div className="bg-purple-50 dark:bg-purple-950 p-3 rounded">
                      <div className="text-sm text-muted-foreground">Result</div>
                      <div className="text-xl font-bold">{currentStepData.result}</div>
                    </div>
                  )}
                  {currentStepData.error && (
                    <div className="bg-red-50 dark:bg-red-950 p-3 rounded">
                      <div className="text-sm text-muted-foreground">Error</div>
                      <div className="text-xl font-bold text-red-600">{currentStepData.error}</div>
                    </div>
                  )}
                </div>
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
          title="Stack Memory Layout"
          data={displayStack}
          baseAddress={0x4000}
          wordSize={4}
        />
      )}

      {/* Educational Information */}
      <Card>
        <CardHeader>
          <CardTitle>Stack Data Structure</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Key Properties:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• LIFO (Last In, First Out) principle</li>
                <li>• Operations only at the top</li>
                <li>• Dynamic size (with limits)</li>
                <li>• No random access to middle elements</li>
                <li>• Supports push, pop, peek operations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Time Complexities:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Push: O(1)</li>
                <li>• Pop: O(1)</li>
                <li>• Peek/Top: O(1)</li>
                <li>• IsEmpty: O(1)</li>
                <li>• Size: O(1)</li>
              </ul>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Real-world Applications:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Function call management (call stack)</li>
              <li>• Undo operations in applications</li>
              <li>• Expression evaluation and syntax parsing</li>
              <li>• Browser history navigation</li>
              <li>• Backtracking algorithms</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}