import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, RotateCcw, Layers, ArrowDown, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';
import { toast } from 'sonner';

interface CallFrame {
  id: string;
  functionName: string;
  parameter: number;
  returnValue?: number;
  level: number;
  status: 'calling' | 'executing' | 'returning' | 'completed';
}

export function RecursionFundamentalsVisualizer() {
  const [algorithm, setAlgorithm] = useState<'factorial' | 'fibonacci' | 'power'>('factorial');
  const [input, setInput] = useState(5);
  const [callStack, setCallStack] = useState<CallFrame[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [showMemory, setShowMemory] = useState(false);
  const [finalResult, setFinalResult] = useState<number | null>(null);
  const [executionSteps, setExecutionSteps] = useState<string[]>([]);
  
  const {
    voiceEnabled,
    setVoiceEnabled,
    speed,
    setSpeed,
    isSpeaking,
    pauseSpeech,
    resumeSpeech,
    stopSpeech,
    speakStep,
    speakOperation,
    speakResult
  } = useVisualizerVoice({ minInterval: 2000 });

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addCallFrame = (functionName: string, parameter: number, level: number): string => {
    const id = generateId();
    const frame: CallFrame = {
      id,
      functionName,
      parameter,
      level,
      status: 'calling'
    };
    
    setCallStack(prev => [...prev, frame]);
    return id;
  };

  const updateCallFrame = (id: string, updates: Partial<CallFrame>) => {
    setCallStack(prev => prev.map(frame => 
      frame.id === id ? { ...frame, ...updates } : frame
    ));
  };

  const removeCallFrame = (id: string) => {
    setCallStack(prev => prev.filter(frame => frame.id !== id));
  };

  const factorial = useCallback(async (n: number, level: number = 0): Promise<number> => {
    const frameId = addCallFrame('factorial', n, level);
    
    setCurrentStep(`Calling factorial(${n}) - Level ${level}`);
    speakStep("", `Entering factorial function with parameter ${n}. Adding new frame to call stack at level ${level}.`, level + 1, input + 1);
    setExecutionSteps(prev => [...prev, `factorial(${n}) called`]);
    
    await sleep(1000);
    updateCallFrame(frameId, { status: 'executing' });
    
    if (n <= 1) {
      setCurrentStep(`Base case: factorial(${n}) = 1`);
      speakStep("", `Base case reached! factorial(${n}) = 1. This is the simplest case that stops the recursion. Now we can start returning values back up the call stack.`, level + 1, input + 1);
      setExecutionSteps(prev => [...prev, `Base case: factorial(${n}) = 1`]);
      
      await sleep(1000);
      updateCallFrame(frameId, { status: 'returning', returnValue: 1 });
      
      await sleep(800);
      removeCallFrame(frameId);
      return 1;
    }
    
    setCurrentStep(`Recursive case: factorial(${n}) = ${n} * factorial(${n-1})`);
    speakStep("", `Recursive case: factorial(${n}) = ${n} * factorial(${n-1}). We need to calculate factorial(${n-1}) first before we can compute this result.`, level + 1, input + 1);
    setExecutionSteps(prev => [...prev, `factorial(${n}) = ${n} * factorial(${n-1})`]);
    
    await sleep(1000);
    
    const result = await factorial(n - 1, level + 1);
    const finalValue = n * result;
    
    setCurrentStep(`Returning: factorial(${n}) = ${n} * ${result} = ${finalValue}`);
    speakStep("", `Now we can compute factorial(${n})! We got ${result} from the recursive call, so factorial(${n}) = ${n} * ${result} = ${finalValue}. Returning this result to the previous call.`, level + 1, input + 1);
    setExecutionSteps(prev => [...prev, `factorial(${n}) returns ${finalValue}`]);
    
    await sleep(1000);
    updateCallFrame(frameId, { status: 'returning', returnValue: finalValue });
    
    await sleep(800);
    removeCallFrame(frameId);
    return finalValue;
  }, [input, speakStep]);

  const fibonacci = useCallback(async (n: number, level: number = 0): Promise<number> => {
    const frameId = addCallFrame('fibonacci', n, level);
    
    setCurrentStep(`Calling fibonacci(${n}) - Level ${level}`);
    speakStep("", `Entering fibonacci function with parameter ${n}. This creates a new call frame at level ${level}.`, level + 1, Math.pow(2, Math.min(input, 6)));
    setExecutionSteps(prev => [...prev, `fibonacci(${n}) called`]);
    
    await sleep(1000);
    updateCallFrame(frameId, { status: 'executing' });
    
    if (n <= 1) {
      setCurrentStep(`Base case: fibonacci(${n}) = ${n}`);
      speakStep("", `Base case reached! fibonacci(${n}) = ${n}. This is one of our stopping conditions.`, level + 1, Math.pow(2, Math.min(input, 6)));
      setExecutionSteps(prev => [...prev, `Base case: fibonacci(${n}) = ${n}`]);
      
      await sleep(1000);
      updateCallFrame(frameId, { status: 'returning', returnValue: n });
      
      await sleep(800);
      removeCallFrame(frameId);
      return n;
    }
    
    setCurrentStep(`Recursive case: fibonacci(${n}) = fibonacci(${n-1}) + fibonacci(${n-2})`);
    speakStep("", `Recursive case: fibonacci(${n}) = fibonacci(${n-1}) + fibonacci(${n-2}). We need to calculate both recursive calls.`, level + 1, Math.pow(2, Math.min(input, 6)));
    setExecutionSteps(prev => [...prev, `fibonacci(${n}) = fib(${n-1}) + fib(${n-2})`]);
    
    await sleep(1000);
    
    const result1 = await fibonacci(n - 1, level + 1);
    const result2 = await fibonacci(n - 2, level + 1);
    const finalValue = result1 + result2;
    
    setCurrentStep(`Returning: fibonacci(${n}) = ${result1} + ${result2} = ${finalValue}`);
    speakStep("", `Combining results: fibonacci(${n}) = ${result1} + ${result2} = ${finalValue}. Returning this sum.`, level + 1, Math.pow(2, Math.min(input, 6)));
    setExecutionSteps(prev => [...prev, `fibonacci(${n}) returns ${finalValue}`]);
    
    await sleep(1000);
    updateCallFrame(frameId, { status: 'returning', returnValue: finalValue });
    
    await sleep(800);
    removeCallFrame(frameId);
    return finalValue;
  }, [input, speakStep]);

  const power = useCallback(async (base: number, exp: number, level: number = 0): Promise<number> => {
    const frameId = addCallFrame('power', exp, level);
    
    setCurrentStep(`Calling power(${base}, ${exp}) - Level ${level}`);
    speakStep("", `Entering power function to calculate ${base} to the power ${exp}. Creating call frame at level ${level}.`, level + 1, exp + 1);
    setExecutionSteps(prev => [...prev, `power(${base}, ${exp}) called`]);
    
    await sleep(1000);
    updateCallFrame(frameId, { status: 'executing' });
    
    if (exp === 0) {
      setCurrentStep(`Base case: power(${base}, 0) = 1`);
      speakStep("", `Base case reached! Any number to the power 0 equals 1. power(${base}, 0) = 1.`, level + 1, input + 1);
      setExecutionSteps(prev => [...prev, `Base case: power(${base}, 0) = 1`]);
      
      await sleep(1000);
      updateCallFrame(frameId, { status: 'returning', returnValue: 1 });
      
      await sleep(800);
      removeCallFrame(frameId);
      return 1;
    }
    
    setCurrentStep(`Recursive case: power(${base}, ${exp}) = ${base} * power(${base}, ${exp-1})`);
    speakStep("", `Recursive case: power(${base}, ${exp}) = ${base} * power(${base}, ${exp-1}). We need to calculate power(${base}, ${exp-1}) first.`, level + 1, input + 1);
    setExecutionSteps(prev => [...prev, `power(${base}, ${exp}) = ${base} * power(${base}, ${exp-1})`]);
    
    await sleep(1000);
    
    const result = await power(base, exp - 1, level + 1);
    const finalValue = base * result;
    
    setCurrentStep(`Returning: power(${base}, ${exp}) = ${base} * ${result} = ${finalValue}`);
    speakStep("", `Computing result: power(${base}, ${exp}) = ${base} * ${result} = ${finalValue}. Returning this value.`, level + 1, input + 1);
    setExecutionSteps(prev => [...prev, `power(${base}, ${exp}) returns ${finalValue}`]);
    
    await sleep(1000);
    updateCallFrame(frameId, { status: 'returning', returnValue: finalValue });
    
    await sleep(800);
    removeCallFrame(frameId);
    return finalValue;
  }, [input, speakStep]);

  const executeRecursion = useCallback(async () => {
    if (isExecuting) return;
    
    setIsExecuting(true);
    setCallStack([]);
    setFinalResult(null);
    setExecutionSteps([]);
    
    let result: number;
    
    switch (algorithm) {
      case 'factorial':
        speakOperation("Factorial Recursion", `Starting factorial calculation for ${input}. We'll see how recursion breaks down the problem into smaller subproblems.`);
        result = await factorial(input);
        break;
      case 'fibonacci':
        if (input > 6) {
          toast.warning('Fibonacci > 6 may take a while due to exponential calls');
        }
        speakOperation("Fibonacci Recursion", `Starting fibonacci calculation for ${input}. This demonstrates tree recursion with multiple recursive calls.`);
        result = await fibonacci(input);
        break;
      case 'power':
        speakOperation("Power Recursion", `Starting power calculation for 2^${input}. This shows how recursion can compute exponential values.`);
        result = await power(2, input);
        break;
      default:
        result = 0;
    }
    
    setFinalResult(result);
    setCurrentStep(`Final result: ${result}`);
    speakResult(`Recursion completed! The final result is ${result}. Notice how the call stack unwound from the deepest level back to the initial call.`);
    
    toast.success(`Result: ${result}`);
    setIsExecuting(false);
  }, [algorithm, input, factorial, fibonacci, power, speakOperation, speakResult]);

  const reset = () => {
    setCallStack([]);
    setFinalResult(null);
    setCurrentStep('');
    setExecutionSteps([]);
    setIsExecuting(false);
  };

  const getMaxStackDepth = () => {
    switch (algorithm) {
      case 'factorial':
      case 'power':
        return input + 1;
      case 'fibonacci':
        return Math.min(input + 1, 7); // Limit display for fibonacci
      default:
        return 1;
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Recursion Fundamentals Visualizer</h2>
        <p className="text-muted-foreground">
          Understand recursion through call stack visualization and step-by-step execution
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Algorithm:</span>
          <Select value={algorithm} onValueChange={(value: any) => setAlgorithm(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="factorial">Factorial</SelectItem>
              <SelectItem value="fibonacci">Fibonacci</SelectItem>
              <SelectItem value="power">Power (2^n)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Input:</span>
          <Input 
            className="w-24" 
            type="number"
            value={input} 
            onChange={e => setInput(Math.max(0, Math.min(algorithm === 'fibonacci' ? 8 : 10, parseInt(e.target.value) || 0)))} 
            disabled={isExecuting}
            min="0"
            max={algorithm === 'fibonacci' ? "8" : "10"}
          />
        </div>
        
        <Button onClick={executeRecursion} disabled={isExecuting}>
          <Play className="w-4 h-4 mr-2" />
          {isExecuting ? 'Executing...' : 'Start Recursion'}
        </Button>
        
        <Button onClick={reset} disabled={isExecuting} variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      {/* Current Step Display */}
      {currentStep && (
        <div className="p-4 bg-muted/20 rounded-lg border">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Current Step</Badge>
            <span className="text-sm font-medium">{currentStep}</span>
          </div>
        </div>
      )}

      {/* Final Result */}
      {finalResult !== null && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Badge className="bg-green-600">Final Result</Badge>
            <span className="text-lg font-bold text-green-800">
              {algorithm}({algorithm === 'power' ? `2, ${input}` : input}) = {finalResult}
            </span>
          </div>
        </div>
      )}

      {/* Call Stack Visualization */}
      <div className="p-6 bg-gradient-visualization rounded-xl border-2 border-primary/20">
        <h4 className="text-lg font-semibold mb-4 text-center flex items-center justify-center gap-2">
          <Layers className="w-5 h-5" />
          Call Stack Visualization
        </h4>
        
        <div className="relative">
          {callStack.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Call stack is empty. Click "Start Recursion" to begin.</p>
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence>
                {callStack.map((frame, index) => (
                  <motion.div
                    key={frame.id}
                    initial={{ opacity: 0, x: -50, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 50, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className={`
                      p-4 border-2 rounded-lg relative ${
                        frame.status === 'calling' 
                          ? 'border-blue-500 bg-blue-100' 
                          : frame.status === 'executing'
                            ? 'border-yellow-500 bg-yellow-100'
                            : frame.status === 'returning'
                              ? 'border-green-500 bg-green-100'
                              : 'border-gray-300 bg-gray-100'
                      }
                    `}
                    style={{ marginLeft: `${frame.level * 20}px` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="font-mono text-sm">
                          Level {frame.level}
                        </div>
                        <div className="font-semibold">
                          {frame.functionName}({frame.parameter})
                        </div>
                        {frame.returnValue !== undefined && (
                          <div className="text-green-700 font-semibold">
                            → {frame.returnValue}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={
                            frame.status === 'calling' ? 'default' :
                            frame.status === 'executing' ? 'secondary' :
                            frame.status === 'returning' ? 'outline' : 'destructive'
                          }
                        >
                          {frame.status}
                        </Badge>
                        
                        {frame.status === 'calling' && <ArrowDown className="w-4 h-4 text-blue-600" />}
                        {frame.status === 'returning' && <ArrowUp className="w-4 h-4 text-green-600" />}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Algorithm Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-2">Recursion Concepts:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li><strong>Base Case:</strong> Condition that stops recursion</li>
            <li><strong>Recursive Case:</strong> Function calls itself with modified input</li>
            <li><strong>Call Stack:</strong> Memory structure tracking function calls</li>
            <li><strong>Stack Frame:</strong> Memory allocated for each function call</li>
            <li><strong>Unwinding:</strong> Returning values back up the call stack</li>
          </ul>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-2">Current Algorithm Info:</h4>
          <div className="space-y-2 text-sm">
            {algorithm === 'factorial' && (
              <>
                <div><strong>Type:</strong> Linear recursion</div>
                <div><strong>Time:</strong> O(n)</div>
                <div><strong>Space:</strong> O(n) - call stack</div>
                <div><strong>Base Case:</strong> n ≤ 1</div>
              </>
            )}
            {algorithm === 'fibonacci' && (
              <>
                <div><strong>Type:</strong> Tree recursion</div>
                <div><strong>Time:</strong> O(2^n) - exponential</div>
                <div><strong>Space:</strong> O(n) - max depth</div>
                <div><strong>Base Case:</strong> n ≤ 1</div>
              </>
            )}
            {algorithm === 'power' && (
              <>
                <div><strong>Type:</strong> Linear recursion</div>
                <div><strong>Time:</strong> O(n)</div>
                <div><strong>Space:</strong> O(n) - call stack</div>
                <div><strong>Base Case:</strong> exp = 0</div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Execution Steps */}
      {executionSteps.length > 0 && (
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-3">Execution Trace:</h4>
          <div className="space-y-1 max-h-60 overflow-y-auto">
            {executionSteps.map((step, index) => (
              <div key={index} className="text-sm font-mono p-2 bg-muted/20 rounded">
                {index + 1}. {step}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Memory Layout */}
      {showMemory && (
        <MemoryLayout
          title="Recursion Call Stack Memory"
          data={callStack.map(frame => frame.parameter)}
          baseAddress={0x7000}
        />
      )}

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
