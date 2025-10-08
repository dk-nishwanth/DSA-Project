import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GitBranch, RotateCcw, Play, Pause, ArrowDown, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';
import { toast } from 'sonner';

interface RecursionFrame {
  id: number;
  functionName: string;
  parameter: number;
  returnValue?: number;
  state: 'calling' | 'computing' | 'returning';
  depth: number;
  isBaseCase: boolean;
}

interface RecursionStep {
  step: number;
  callStack: RecursionFrame[];
  currentFrame?: RecursionFrame;
  message: string;
  operation: 'call' | 'base-case' | 'return' | 'complete';
}

export function RecursionBasicsVisualizer() {
  const [algorithm, setAlgorithm] = useState<'factorial' | 'fibonacci' | 'sum'>('factorial');
  const [inputValue, setInputValue] = useState(5);
  const [steps, setSteps] = useState<RecursionStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMemory, setShowMemory] = useState(false);
  
  const {
    voiceEnabled,
    setVoiceEnabled,
    speed,
    setSpeed,
    isSpeaking,
    pauseSpeech,
    resumeSpeech,
    stopSpeech,
    speakStep
  } = useVisualizerVoice({ minInterval: 2000 });

  const generateFactorialSteps = (n: number): RecursionStep[] => {
    const steps: RecursionStep[] = [];
    const callStack: RecursionFrame[] = [];
    let frameId = 0;
    let stepCount = 0;

    const factorial = (num: number, depth: number): number => {
      const frame: RecursionFrame = {
        id: frameId++,
        functionName: 'factorial',
        parameter: num,
        state: 'calling',
        depth,
        isBaseCase: num <= 1
      };

      callStack.push(frame);
      steps.push({
        step: stepCount++,
        callStack: [...callStack],
        currentFrame: frame,
        message: `Call factorial(${num}) - ${frame.isBaseCase ? 'Base case!' : 'Recursive case'}`,
        operation: frame.isBaseCase ? 'base-case' : 'call'
      });

      if (num <= 1) {
        frame.returnValue = 1;
        frame.state = 'returning';
        steps.push({
          step: stepCount++,
          callStack: [...callStack],
          currentFrame: frame,
          message: `Base case: factorial(${num}) returns 1`,
          operation: 'base-case'
        });
      } else {
        frame.state = 'computing';
        const result = factorial(num - 1, depth + 1);
        frame.returnValue = num * result;
        frame.state = 'returning';
        steps.push({
          step: stepCount++,
          callStack: [...callStack],
          currentFrame: frame,
          message: `factorial(${num}) = ${num} × factorial(${num - 1}) = ${num} × ${result} = ${frame.returnValue}`,
          operation: 'return'
        });
      }

      callStack.pop();
      return frame.returnValue;
    };

    steps.push({
      step: stepCount++,
      callStack: [],
      message: `Starting factorial(${n}) - demonstrating recursion with call stack`,
      operation: 'call'
    });

    factorial(n, 0);

    steps.push({
      step: stepCount++,
      callStack: [],
      message: `Complete! factorial(${n}) = ${steps[steps.length - 2]?.currentFrame?.returnValue}`,
      operation: 'complete'
    });

    return steps;
  };

  const generateFibonacciSteps = (n: number): RecursionStep[] => {
    const steps: RecursionStep[] = [];
    const callStack: RecursionFrame[] = [];
    let frameId = 0;
    let stepCount = 0;

    const fibonacci = (num: number, depth: number): number => {
      const frame: RecursionFrame = {
        id: frameId++,
        functionName: 'fibonacci',
        parameter: num,
        state: 'calling',
        depth,
        isBaseCase: num <= 1
      };

      callStack.push(frame);
      steps.push({
        step: stepCount++,
        callStack: [...callStack],
        currentFrame: frame,
        message: `Call fibonacci(${num}) - ${frame.isBaseCase ? 'Base case!' : 'Recursive case'}`,
        operation: frame.isBaseCase ? 'base-case' : 'call'
      });

      if (num <= 1) {
        frame.returnValue = num;
        frame.state = 'returning';
        steps.push({
          step: stepCount++,
          callStack: [...callStack],
          currentFrame: frame,
          message: `Base case: fibonacci(${num}) returns ${num}`,
          operation: 'base-case'
        });
      } else {
        frame.state = 'computing';
        const fib1 = fibonacci(num - 1, depth + 1);
        const fib2 = fibonacci(num - 2, depth + 1);
        frame.returnValue = fib1 + fib2;
        frame.state = 'returning';
        steps.push({
          step: stepCount++,
          callStack: [...callStack],
          currentFrame: frame,
          message: `fibonacci(${num}) = fibonacci(${num - 1}) + fibonacci(${num - 2}) = ${fib1} + ${fib2} = ${frame.returnValue}`,
          operation: 'return'
        });
      }

      callStack.pop();
      return frame.returnValue;
    };

    steps.push({
      step: stepCount++,
      callStack: [],
      message: `Starting fibonacci(${n}) - showing exponential recursive calls`,
      operation: 'call'
    });

    fibonacci(n, 0);

    steps.push({
      step: stepCount++,
      callStack: [],
      message: `Complete! fibonacci(${n}) = ${steps[steps.length - 2]?.currentFrame?.returnValue}`,
      operation: 'complete'
    });

    return steps;
  };

  const generateSumSteps = (n: number): RecursionStep[] => {
    const steps: RecursionStep[] = [];
    const callStack: RecursionFrame[] = [];
    let frameId = 0;
    let stepCount = 0;

    const sum = (num: number, depth: number): number => {
      const frame: RecursionFrame = {
        id: frameId++,
        functionName: 'sum',
        parameter: num,
        state: 'calling',
        depth,
        isBaseCase: num <= 0
      };

      callStack.push(frame);
      steps.push({
        step: stepCount++,
        callStack: [...callStack],
        currentFrame: frame,
        message: `Call sum(${num}) - ${frame.isBaseCase ? 'Base case!' : 'Recursive case'}`,
        operation: frame.isBaseCase ? 'base-case' : 'call'
      });

      if (num <= 0) {
        frame.returnValue = 0;
        frame.state = 'returning';
        steps.push({
          step: stepCount++,
          callStack: [...callStack],
          currentFrame: frame,
          message: `Base case: sum(${num}) returns 0`,
          operation: 'base-case'
        });
      } else {
        frame.state = 'computing';
        const result = sum(num - 1, depth + 1);
        frame.returnValue = num + result;
        frame.state = 'returning';
        steps.push({
          step: stepCount++,
          callStack: [...callStack],
          currentFrame: frame,
          message: `sum(${num}) = ${num} + sum(${num - 1}) = ${num} + ${result} = ${frame.returnValue}`,
          operation: 'return'
        });
      }

      callStack.pop();
      return frame.returnValue;
    };

    steps.push({
      step: stepCount++,
      callStack: [],
      message: `Starting sum(${n}) - calculating sum of numbers 1 to ${n}`,
      operation: 'call'
    });

    sum(n, 0);

    steps.push({
      step: stepCount++,
      callStack: [],
      message: `Complete! sum(${n}) = ${steps[steps.length - 2]?.currentFrame?.returnValue}`,
      operation: 'complete'
    });

    return steps;
  };

  const startVisualization = () => {
    if (inputValue < 0 || inputValue > 8) {
      toast.error('Please enter a value between 0 and 8 for better visualization');
      return;
    }

    let newSteps: RecursionStep[] = [];
    
    switch (algorithm) {
      case 'factorial':
        newSteps = generateFactorialSteps(inputValue);
        break;
      case 'fibonacci':
        newSteps = generateFibonacciSteps(inputValue);
        break;
      case 'sum':
        newSteps = generateSumSteps(inputValue);
        break;
    }

    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);

    if (voiceEnabled) {
      speakStep(`Starting ${algorithm} recursion visualization for input ${inputValue}. Watch how the call stack grows and shrinks.`);
    }

    toast.success(`${algorithm} recursion visualization started`);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      
      if (voiceEnabled && steps[newStep]) {
        speakStep(steps[newStep].message);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      
      if (voiceEnabled && steps[newStep]) {
        speakStep(steps[newStep].message);
      }
    }
  };

  const reset = () => {
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
    setInputValue(5);
  };

  const renderCallStack = () => {
    if (steps.length === 0) return null;
    
    const currentStepData = steps[currentStep];
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border">
        <h4 className="font-semibold mb-4 text-center">Call Stack Visualization</h4>
        <div className="space-y-2">
          {currentStepData.callStack.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Call stack is empty
            </div>
          ) : (
            <AnimatePresence>
              {currentStepData.callStack.map((frame, index) => (
                <motion.div
                  key={frame.id}
                  className={`p-4 rounded border-2 ${
                    frame === currentStepData.currentFrame
                      ? frame.isBaseCase
                        ? 'bg-green-100 border-green-400 text-green-800'
                        : frame.state === 'returning'
                          ? 'bg-blue-100 border-blue-400 text-blue-800'
                          : 'bg-yellow-100 border-yellow-400 text-yellow-800'
                      : 'bg-gray-100 border-gray-300 text-gray-600'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-4 w-4" />
                      <span className="font-mono font-bold">
                        {frame.functionName}({frame.parameter})
                      </span>
                      {frame.isBaseCase && (
                        <Badge variant="secondary" className="text-xs">Base Case</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {frame.state === 'returning' && frame.returnValue !== undefined && (
                        <div className="text-sm">
                          → <span className="font-bold">{frame.returnValue}</span>
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        Depth: {frame.depth}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )).reverse()}
            </AnimatePresence>
          )}
        </div>
        
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Stack grows upward ↑ | Current depth: {currentStepData.callStack.length}
        </div>
      </div>
    );
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Recursion Basics Visualizer</h3>
        <p className="text-muted-foreground">
          Understand recursion through call stack visualization and step-by-step execution
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Algorithm</label>
          <Select value={algorithm} onValueChange={(value: 'factorial' | 'fibonacci' | 'sum') => setAlgorithm(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="factorial">Factorial (n!)</SelectItem>
              <SelectItem value="fibonacci">Fibonacci (F(n))</SelectItem>
              <SelectItem value="sum">Sum 1 to n</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Input Value (0-8)</label>
          <Input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(parseInt(e.target.value) || 0)}
            placeholder="Enter value"
            min="0"
            max="8"
          />
        </div>

        <div className="flex gap-2 items-end">
          <Button onClick={startVisualization} className="flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            Start
          </Button>
          <Button onClick={reset} variant="outline">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Visualization */}
      {steps.length > 0 && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-950 dark:to-purple-900 p-8 rounded-xl border-2 border-dashed border-indigo-200 dark:border-indigo-800">
          <div className="space-y-6">
            {/* Call Stack */}
            {renderCallStack()}

            {/* Current State Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm text-muted-foreground">Current Operation</div>
                  <div className="font-bold capitalize">{currentStepData?.operation || 'None'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Stack Depth</div>
                  <div className="font-bold">{currentStepData?.callStack.length || 0}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Current Function</div>
                  <div className="font-bold font-mono">
                    {currentStepData?.currentFrame 
                      ? `${currentStepData.currentFrame.functionName}(${currentStepData.currentFrame.parameter})`
                      : 'None'
                    }
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <div className="text-sm text-muted-foreground mb-2">Step Description:</div>
                <div className="text-lg font-semibold">{currentStepData?.message}</div>
              </div>
            </div>

            {/* Step Controls */}
            <div className="flex justify-center gap-4">
              <Button 
                onClick={prevStep} 
                disabled={currentStep === 0}
                variant="outline"
              >
                Previous
              </Button>
              <Badge variant="secondary" className="px-4 py-2">
                Step {currentStep + 1} of {steps.length}
              </Badge>
              <Button 
                onClick={nextStep} 
                disabled={currentStep === steps.length - 1}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Recursion Concepts */}
      <div className="bg-card border rounded-lg p-4">
        <h4 className="font-semibold mb-4">Key Recursion Concepts:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="font-medium text-indigo-600">Essential Components</div>
            <div>• <strong>Base Case:</strong> Stopping condition that prevents infinite recursion</div>
            <div>• <strong>Recursive Case:</strong> Function calls itself with modified parameters</div>
            <div>• <strong>Call Stack:</strong> Memory structure tracking function calls</div>
            <div>• <strong>Stack Frame:</strong> Memory allocated for each function call</div>
          </div>
          <div className="space-y-2">
            <div className="font-medium text-purple-600">Important Properties</div>
            <div>• <strong>Space Complexity:</strong> O(n) due to call stack depth</div>
            <div>• <strong>Stack Overflow:</strong> Risk with deep recursion</div>
            <div>• <strong>Tail Recursion:</strong> Optimization for last-operation calls</div>
            <div>• <strong>Memoization:</strong> Caching to avoid redundant calculations</div>
          </div>
        </div>
      </div>

      {/* Visualizer Controls */}
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
    </div>
  );
}