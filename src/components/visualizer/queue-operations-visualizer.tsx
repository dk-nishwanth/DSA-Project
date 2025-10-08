import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Eye, RotateCcw, List, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

interface QueueStep {
  step: number;
  operation: string;
  value?: number;
  queue: number[];
  description: string;
  error?: string;
  result?: number;
}

export function QueueOperationsVisualizer() {
  const [operation, setOperation] = useState('enqueue');
  const [inputValue, setInputValue] = useState(42);
  const [queue, setQueue] = useState<number[]>([10, 20, 30]);
  const [steps, setSteps] = useState<QueueStep[]>([]);
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
    { value: 'enqueue', label: 'Enqueue (Add to rear)' },
    { value: 'dequeue', label: 'Dequeue (Remove from front)' },
    { value: 'front', label: 'Front (View first)' },
    { value: 'rear', label: 'Rear (View last)' },
    { value: 'isEmpty', label: 'Is Empty Check' },
    { value: 'size', label: 'Get Size' },
    { value: 'clear', label: 'Clear Queue' }
  ];

  const generateEnqueueSteps = (currentQueue: number[], value: number): QueueStep[] => {
    const steps: QueueStep[] = [];
    let stepNum = 0;

    steps.push({
      step: stepNum++,
      operation: 'Initialize',
      queue: [...currentQueue],
      description: `Current queue has ${currentQueue.length} elements`,
    });

    if (currentQueue.length >= maxSize) {
      steps.push({
        step: stepNum++,
        operation: 'Error',
        value,
        queue: [...currentQueue],
        description: `Queue overflow! Cannot enqueue ${value} - queue is full (max size: ${maxSize})`,
        error: 'Queue Overflow'
      });
      return steps;
    }

    steps.push({
      step: stepNum++,
      operation: 'Enqueue',
      value,
      queue: [...currentQueue, value],
      description: `Enqueue ${value} to the rear of queue`,
    });

    steps.push({
      step: stepNum++,
      operation: 'Complete',
      value,
      queue: [...currentQueue, value],
      description: `Successfully enqueued ${value}. Queue size: ${currentQueue.length + 1}`,
    });

    return steps;
  };

  const generateDequeueSteps = (currentQueue: number[]): QueueStep[] => {
    const steps: QueueStep[] = [];
    let stepNum = 0;

    steps.push({
      step: stepNum++,
      operation: 'Initialize',
      queue: [...currentQueue],
      description: `Current queue has ${currentQueue.length} elements`,
    });

    if (currentQueue.length === 0) {
      steps.push({
        step: stepNum++,
        operation: 'Error',
        queue: [...currentQueue],
        description: `Queue underflow! Cannot dequeue from empty queue`,
        error: 'Queue Underflow'
      });
      return steps;
    }

    const dequeuedValue = currentQueue[0];
    const newQueue = currentQueue.slice(1);

    steps.push({
      step: stepNum++,
      operation: 'Dequeue',
      value: dequeuedValue,
      queue: newQueue,
      description: `Dequeue ${dequeuedValue} from the front of queue`,
      result: dequeuedValue
    });

    steps.push({
      step: stepNum++,
      operation: 'Complete',
      value: dequeuedValue,
      queue: newQueue,
      description: `Successfully dequeued ${dequeuedValue}. Queue size: ${newQueue.length}`,
      result: dequeuedValue
    });

    return steps;
  };

  const generateFrontSteps = (currentQueue: number[]): QueueStep[] => {
    const steps: QueueStep[] = [];
    let stepNum = 0;

    steps.push({
      step: stepNum++,
      operation: 'Initialize',
      queue: [...currentQueue],
      description: `Current queue has ${currentQueue.length} elements`,
    });

    if (currentQueue.length === 0) {
      steps.push({
        step: stepNum++,
        operation: 'Error',
        queue: [...currentQueue],
        description: `Cannot view front of empty queue`,
        error: 'Empty Queue'
      });
      return steps;
    }

    const frontValue = currentQueue[0];

    steps.push({
      step: stepNum++,
      operation: 'Front',
      value: frontValue,
      queue: [...currentQueue],
      description: `Front element: ${frontValue} (queue unchanged)`,
      result: frontValue
    });

    return steps;
  };

  const generateRearSteps = (currentQueue: number[]): QueueStep[] => {
    const steps: QueueStep[] = [];
    let stepNum = 0;

    steps.push({
      step: stepNum++,
      operation: 'Initialize',
      queue: [...currentQueue],
      description: `Current queue has ${currentQueue.length} elements`,
    });

    if (currentQueue.length === 0) {
      steps.push({
        step: stepNum++,
        operation: 'Error',
        queue: [...currentQueue],
        description: `Cannot view rear of empty queue`,
        error: 'Empty Queue'
      });
      return steps;
    }

    const rearValue = currentQueue[currentQueue.length - 1];

    steps.push({
      step: stepNum++,
      operation: 'Rear',
      value: rearValue,
      queue: [...currentQueue],
      description: `Rear element: ${rearValue} (queue unchanged)`,
      result: rearValue
    });

    return steps;
  };

  const runOperation = () => {
    setIsAnimating(true);
    speakOperation('Queue Operations', `Running ${operations.find(op=>op.value===operation)?.label || 'operation'}.`);
    
    let newSteps: QueueStep[] = [];
    let newQueue = [...queue];

    switch (operation) {
      case 'enqueue':
        newSteps = generateEnqueueSteps(queue, inputValue);
        if (queue.length < maxSize) {
          newQueue = [...queue, inputValue];
        }
        break;
      case 'dequeue':
        newSteps = generateDequeueSteps(queue);
        if (queue.length > 0) {
          newQueue = queue.slice(1);
        }
        break;
      case 'front':
        newSteps = generateFrontSteps(queue);
        break;
      case 'rear':
        newSteps = generateRearSteps(queue);
        break;
      case 'isEmpty':
        newSteps = [{
          step: 0,
          operation: 'Check Empty',
          queue: [...queue],
          description: `Check if queue is empty: ${queue.length === 0 ? 'Yes' : 'No'}`,
          result: queue.length === 0 ? 1 : 0
        }];
        break;
      case 'size':
        newSteps = [{
          step: 0,
          operation: 'Get Size',
          queue: [...queue],
          description: `Queue size: ${queue.length} elements`,
          result: queue.length
        }];
        break;
      case 'clear':
        newSteps = [
          {
            step: 0,
            operation: 'Initialize',
            queue: [...queue],
            description: `Current queue has ${queue.length} elements`,
          },
          {
            step: 1,
            operation: 'Clear',
            queue: [],
            description: `Clear all elements from queue`,
          }
        ];
        newQueue = [];
        break;
    }

    setSteps(newSteps);
    setCurrentStep(0);
    
    if (['enqueue', 'dequeue', 'clear'].includes(operation)) {
      setTimeout(() => setQueue(newQueue), 1000);
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
    setQueue([10, 20, 30]);
  };

  const currentStepData = steps[currentStep];
  const displayQueue = currentStepData?.queue || queue;

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

        {operation === 'enqueue' && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Value to Enqueue</label>
            <Input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(parseInt(e.target.value) || 0)}
            />
          </div>
        )}

        <div className="flex gap-2 items-end">
          <Button onClick={runOperation} className="flex items-center gap-2" disabled={isAnimating}>
            <List className="h-4 w-4" />
            {isAnimating ? 'Running...' : 'Run'}
          </Button>
          <Button onClick={reset} variant="outline">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Queue Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="h-5 w-5" />
            Queue Visualization (FIFO - First In, First Out)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Queue Display */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-4">
                <ArrowLeft className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-600 font-medium">FRONT (Dequeue here)</span>
              </div>
              
              <div className="flex gap-1 min-w-[300px] overflow-x-auto">
                <AnimatePresence>
                  {displayQueue.map((value, index) => (
                    <motion.div
                      key={`${index}-${value}`}
                      className={`w-16 h-16 border-2 rounded-lg flex items-center justify-center font-bold text-lg ${
                        index === 0 
                          ? 'border-red-500 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' 
                          : index === displayQueue.length - 1
                          ? 'border-green-500 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                          : 'border-blue-500 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      }`}
                      initial={{ opacity: 0, x: -20, scale: 0.8 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -20, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                    >
                      {value}
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {displayQueue.length === 0 && (
                  <div className="w-16 h-16 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-gray-500 text-xs">
                    Empty
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2 mt-4">
                <span className="text-sm text-green-600 font-medium">REAR (Enqueue here)</span>
                <ArrowRight className="h-4 w-4 text-green-500" />
              </div>
            </div>

            {/* Queue Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded">
                <div className="text-sm text-muted-foreground">Size</div>
                <div className="text-xl font-bold">{displayQueue.length}</div>
              </div>
              <div className="bg-green-50 dark:bg-green-950 p-3 rounded">
                <div className="text-sm text-muted-foreground">Max Size</div>
                <div className="text-xl font-bold">{maxSize}</div>
              </div>
              <div className="bg-red-50 dark:bg-red-950 p-3 rounded">
                <div className="text-sm text-muted-foreground">Front</div>
                <div className="text-xl font-bold">
                  {displayQueue.length > 0 ? displayQueue[0] : 'None'}
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-950 p-3 rounded">
                <div className="text-sm text-muted-foreground">Rear</div>
                <div className="text-xl font-bold">
                  {displayQueue.length > 0 ? displayQueue[displayQueue.length - 1] : 'None'}
                </div>
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
                    <div className="text-sm text-muted-foreground">Queue Size</div>
                    <div className="text-xl font-bold">{currentStepData.queue.length}</div>
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
          title="Queue Memory Layout"
          data={displayQueue}
          baseAddress={0x5000}
          wordSize={4}
        />
      )}

      {/* Educational Information */}
      <Card>
        <CardHeader>
          <CardTitle>Queue Data Structure</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Key Properties:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• FIFO (First In, First Out) principle</li>
                <li>• Operations at both ends (front & rear)</li>
                <li>• Dynamic size (with limits)</li>
                <li>• No random access to middle elements</li>
                <li>• Supports enqueue, dequeue, front, rear</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Time Complexities:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Enqueue: O(1)</li>
                <li>• Dequeue: O(1)</li>
                <li>• Front/Rear: O(1)</li>
                <li>• IsEmpty: O(1)</li>
                <li>• Size: O(1)</li>
              </ul>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Real-world Applications:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Task scheduling in operating systems</li>
              <li>• Print job management</li>
              <li>• BFS algorithm implementation</li>
              <li>• Request handling in web servers</li>
              <li>• Message queues in distributed systems</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}