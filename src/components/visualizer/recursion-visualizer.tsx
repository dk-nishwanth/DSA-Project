import React, { useState, useCallback } from 'react';
import { Play, RotateCcw, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

type RecursionType = 'factorial' | 'fibonacci' | 'tail-factorial' | 'tower-hanoi' | 'binary-search';

interface CallStackFrame {
  id: number;
  functionName: string;
  parameters: any;
  localVars?: any;
  returnValue?: any;
  level: number;
  isActive?: boolean;
  isReturning?: boolean;
}

export function RecursionVisualizer() {
  const [recursionType, setRecursionType] = useState<RecursionType>('factorial');
  const [inputValue, setInputValue] = useState(5);
  const [isAnimating, setIsAnimating] = useState(false);
  const [callStack, setCallStack] = useState<CallStackFrame[]>([]);
  const [currentStep, setCurrentStep] = useState('Recursion visualizer ready. Choose a function and input value to see the call stack in action!');
  const [finalResult, setFinalResult] = useState<any>(null);
  const [expandedFrames, setExpandedFrames] = useState<Set<number>>(new Set());
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
    speakOperation
  } = useVisualizerVoice({ minInterval: 2500 });

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const addFrame = useCallback(async (frame: Omit<CallStackFrame, 'id'>) => {
    const newFrame = { ...frame, id: Date.now() + Math.random(), isActive: true };
    setCallStack(prev => [...prev, newFrame]);
    setExpandedFrames(prev => new Set([...prev, newFrame.id]));
    await sleep(600);
    return newFrame.id;
  }, []);

  const updateFrame = useCallback(async (id: number, updates: Partial<CallStackFrame>) => {
    setCallStack(prev => prev.map(frame => 
      frame.id === id ? { ...frame, ...updates } : { ...frame, isActive: false }
    ));
    await sleep(400);
  }, []);

  const removeFrame = useCallback(async (id: number) => {
    await updateFrame(id, { isReturning: true });
    await sleep(600);
    setCallStack(prev => prev.filter(frame => frame.id !== id));
    setExpandedFrames(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, [updateFrame]);

  const factorialRecursion = useCallback(async (n: number, level: number = 0): Promise<number> => {
    const frameId = await addFrame({
      functionName: 'factorial',
      parameters: { n },
      level,
      localVars: {},
    });

    setCurrentStep(`Entering factorial function with parameter n=${n}. Adding new frame to call stack at level ${level}.`);

    if (n <= 1) {
      await updateFrame(frameId, { 
        returnValue: 1,
        localVars: { baseCase: true }
      });
      setCurrentStep(`Base case reached! factorial(${n}) = 1. This is the simplest case that stops the recursion. Now we can start returning values back up the call stack.`);
      await sleep(800);
      await removeFrame(frameId);
      return 1;
    }

    setCurrentStep(`Recursive case: factorial(${n}) = ${n} * factorial(${n-1}). We need to calculate factorial(${n-1}) first before we can compute this result.`);
    const subResult = await factorialRecursion(n - 1, level + 1);
    
    const result = n * subResult;
    await updateFrame(frameId, { 
      returnValue: result,
      localVars: { subResult, calculation: `${n} * ${subResult}` }
    });
    
    setCurrentStep(`Now we can compute factorial(${n})! We got ${subResult} from the recursive call, so factorial(${n}) = ${n} * ${subResult} = ${result}. Returning this result to the previous call.`);
    await sleep(800);
    await removeFrame(frameId);
    
    return result;
  }, [addFrame, updateFrame, removeFrame]);

  const fibonacciRecursion = useCallback(async (n: number, level: number = 0): Promise<number> => {
    const frameId = await addFrame({
      functionName: 'fibonacci',
      parameters: { n },
      level,
      localVars: {},
    });

    setCurrentStep(`Calling fibonacci(${n})`);

    if (n <= 1) {
      await updateFrame(frameId, { 
        returnValue: n,
        localVars: { baseCase: true }
      });
      setCurrentStep(`Base case: fibonacci(${n}) = ${n}`);
      await sleep(800);
      await removeFrame(frameId);
      return n;
    }

    setCurrentStep(`Need fibonacci(${n-1}) and fibonacci(${n-2})`);
    
    const fib1 = await fibonacciRecursion(n - 1, level + 1);
    const fib2 = await fibonacciRecursion(n - 2, level + 1);
    
    const result = fib1 + fib2;
    await updateFrame(frameId, { 
      returnValue: result,
      localVars: { fib1, fib2, calculation: `${fib1} + ${fib2}` }
    });
    
    setCurrentStep(`fibonacci(${n}) = ${fib1} + ${fib2} = ${result}`);
    await sleep(800);
    await removeFrame(frameId);
    
    return result;
  }, [addFrame, updateFrame, removeFrame]);

  const tailFactorialRecursion = useCallback(async (n: number, accumulator: number = 1, level: number = 0): Promise<number> => {
    const frameId = await addFrame({
      functionName: 'tailFactorial',
      parameters: { n, accumulator },
      level,
      localVars: {},
    });

    setCurrentStep(`Calling tailFactorial(${n}, ${accumulator})`);

    if (n <= 1) {
      await updateFrame(frameId, { 
        returnValue: accumulator,
        localVars: { baseCase: true, finalResult: accumulator }
      });
      setCurrentStep(`Base case: tailFactorial(${n}, ${accumulator}) = ${accumulator}`);
      await sleep(800);
      await removeFrame(frameId);
      return accumulator;
    }

    const newAccumulator = n * accumulator;
    await updateFrame(frameId, { 
      localVars: { nextCall: `tailFactorial(${n-1}, ${newAccumulator})` }
    });
    
    setCurrentStep(`Tail call: tailFactorial(${n-1}, ${n} * ${accumulator} = ${newAccumulator})`);
    await sleep(600);
    
    // This is the key difference - no computation after the recursive call
    const result = await tailFactorialRecursion(n - 1, newAccumulator, level + 1);
    
    await updateFrame(frameId, { 
      returnValue: result,
      localVars: { tailCall: true, passed_through: result }
    });
    
    setCurrentStep(`Returning result: ${result}`);
    await sleep(400);
    await removeFrame(frameId);
    
    return result;
  }, [addFrame, updateFrame, removeFrame]);

  const runRecursion = useCallback(async () => {
    if (inputValue < 0 || inputValue > 10) {
      toast.error('Please enter a value between 0 and 10');
      return;
    }

    setIsAnimating(true);
    setCallStack([]);
    setExpandedFrames(new Set());
    setFinalResult(null);
    setCurrentStep('Starting recursion...');
    
    await sleep(500);

    try {
      let result;
      switch (recursionType) {
        case 'factorial':
          result = await factorialRecursion(inputValue);
          break;
        case 'fibonacci':
          result = await fibonacciRecursion(inputValue);
          break;
        case 'tail-factorial':
          result = await tailFactorialRecursion(inputValue);
          break;
        default:
          toast.info(`${recursionType} visualization coming soon!`);
          setIsAnimating(false);
          return;
      }
      
      setFinalResult(result);
      setCurrentStep(`Final result: ${result}`);
      toast.success(`Result: ${result}`);
    } catch (error) {
      toast.error('Recursion failed');
    }

    setIsAnimating(false);
  }, [recursionType, inputValue, factorialRecursion, fibonacciRecursion, tailFactorialRecursion]);

  const resetRecursion = useCallback(() => {
    setCallStack([]);
    setExpandedFrames(new Set());
    setFinalResult(null);
    setCurrentStep('');
    setIsAnimating(false);
    toast.success('Recursion reset');
  }, []);

  const toggleFrameExpansion = useCallback((frameId: number) => {
    setExpandedFrames(prev => {
      const newSet = new Set(prev);
      if (newSet.has(frameId)) {
        newSet.delete(frameId);
      } else {
        newSet.add(frameId);
      }
      return newSet;
    });
  }, []);

  const renderCallStack = useCallback(() => {
    return callStack.map((frame, index) => {
      const isExpanded = expandedFrames.has(frame.id);
      const indentLevel = frame.level * 20;
      
      // Visual enhancements for recursion tree
      const isLastFrame = index === callStack.length - 1;
      const hasReturnValue = frame.returnValue !== undefined;
      
      return (
        <div
          key={frame.id}
          className={`
            border rounded-lg p-3 transition-all duration-300 mb-2
            ${frame.isActive ? 'bg-primary/10 border-primary shadow-md' : 'bg-card border-border'}
            ${frame.isReturning ? 'bg-success/10 border-success shadow-lg' : ''}
            ${isLastFrame ? 'ring-2 ring-primary/30' : ''}
          `}
          style={{ 
            marginLeft: `${indentLevel}px`,
            transform: frame.isReturning ? 'translateY(-4px)' : 'none',
          }}
        >
          {/* Connection lines to show parent-child relationships */}
          {frame.level > 0 && (
            <div 
              className="absolute -left-4 top-1/2 w-4 h-px bg-muted-foreground/50"
              style={{ transform: 'translateY(-50%)' }}
            />
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleFrameExpansion(frame.id)}
                className={`h-6 w-6 p-0 ${isLastFrame ? 'bg-primary/20' : ''}`}
              >
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
              <span className={`font-mono font-semibold ${frame.isActive ? 'text-primary' : ''}`}>
                {frame.functionName}({JSON.stringify(frame.parameters).slice(1, -1)})
              </span>
              {hasReturnValue && (
                <span className={`font-bold ${frame.isReturning ? 'text-success animate-pulse' : 'text-success'}`}>
                  → {frame.returnValue}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className={`px-2 py-1 rounded-full text-xs ${frame.isActive ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                Level {frame.level}
              </div>
              {frame.isReturning && (
                <div className="text-xs bg-success/20 text-success px-2 py-1 rounded-full">
                  Returning
                </div>
              )}
            </div>
          </div>

          {isExpanded && (
            <div className="mt-3 space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/10 p-2 rounded-md border border-muted/30">
                  <span className="text-muted-foreground font-medium block mb-1">Parameters:</span>
                  <div className="font-mono bg-background p-2 rounded text-xs shadow-sm">
                    {JSON.stringify(frame.parameters, null, 2)}
                  </div>
                </div>
                {frame.localVars && Object.keys(frame.localVars).length > 0 && (
                  <div className="bg-muted/10 p-2 rounded-md border border-muted/30">
                    <span className="text-muted-foreground font-medium block mb-1">Local Variables:</span>
                    <div className="font-mono bg-background p-2 rounded text-xs shadow-sm">
                      {JSON.stringify(frame.localVars, null, 2)}
                    </div>
                    {frame.localVars.calculation && (
                      <div className="mt-2 p-1 bg-success/10 border border-success/20 rounded text-xs text-success font-medium">
                        Calculation: {frame.localVars.calculation}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Visual representation of the recursive call */}
              {frame.level < callStack.length - 1 && !frame.isReturning && (
                <div className="flex justify-center my-1">
                  <div className="border-l-2 border-dashed border-primary/30 h-4"></div>
                </div>
              )}
            </div>
          )}
        </div>
      );
    });
  }, [callStack, expandedFrames, toggleFrameExpansion]);

  return (
    <div className="w-full space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <Select value={recursionType} onValueChange={(value: RecursionType) => setRecursionType(value)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="factorial">Factorial</SelectItem>
            <SelectItem value="fibonacci">Fibonacci</SelectItem>
            <SelectItem value="tail-factorial">Tail Factorial</SelectItem>
            <SelectItem value="tower-hanoi">Tower of Hanoi</SelectItem>
            <SelectItem value="binary-search">Binary Search</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2 items-center">
          <label className="text-sm font-medium">Input:</label>
          <Input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(parseInt(e.target.value) || 0)}
            className="w-24"
            min="0"
            max="10"
            disabled={isAnimating}
          />
        </div>

        <Button onClick={runRecursion} disabled={isAnimating} className="flex items-center gap-1">
          <Play className="h-4 w-4" />
          Run Recursion
        </Button>

        <Button onClick={resetRecursion} disabled={isAnimating} variant="outline" className="flex items-center gap-1">
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>

      {/* Result Display */}
      {finalResult !== null && (
        <div className="p-4 bg-success/10 border-2 border-success rounded-xl text-center">
          <div className="text-lg font-semibold text-success">
            Final Result: {finalResult}
          </div>
        </div>
      )}

      {/* Visualization */}
      <div className="bg-gradient-visualization rounded-xl border-2 border-border/50 p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center">Call Stack</h3>
          
          {callStack.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No active function calls
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {renderCallStack()}
            </div>
          )}

          {currentStep && (
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <p className="text-sm font-medium">{currentStep}</p>
            </div>
          )}
        </div>
      </div>

      {/* Algorithm Info */}
      <div className="bg-muted/20 rounded-lg p-4">
        <h4 className="font-semibold mb-2">Recursion Analysis</h4>
        <div className="text-sm space-y-1">
          {recursionType === 'factorial' && (
            <>
              <div>• <strong>Factorial:</strong> n! = n × (n-1)!</div>
              <div>• <strong>Time Complexity:</strong> O(n) - One call per number</div>
              <div>• <strong>Space Complexity:</strong> O(n) - Call stack depth</div>
              <div>• <strong>Base Case:</strong> factorial(0) = factorial(1) = 1</div>
            </>
          )}
          {recursionType === 'fibonacci' && (
            <>
              <div>• <strong>Fibonacci:</strong> fib(n) = fib(n-1) + fib(n-2)</div>
              <div>• <strong>Time Complexity:</strong> O(2^n) - Exponential without memoization</div>
              <div>• <strong>Space Complexity:</strong> O(n) - Maximum call stack depth</div>
              <div>• <strong>Base Cases:</strong> fib(0) = 0, fib(1) = 1</div>
            </>
          )}
          {recursionType === 'tail-factorial' && (
            <>
              <div>• <strong>Tail Factorial:</strong> Uses accumulator parameter</div>
              <div>• <strong>Time Complexity:</strong> O(n) - Same as regular recursion</div>
              <div>• <strong>Space Complexity:</strong> O(1) - Can be optimized to constant space</div>
              <div>• <strong>Key Feature:</strong> No computation after recursive call</div>
            </>
          )}
        </div>
      </div>

      {/* Voice Explain and Show Memory Controls */}
      <div className="bg-muted/30 rounded-lg p-4 border-2 border-primary/20">
        <h4 className="font-semibold mb-3 text-center">Visualizer Controls</h4>
        <div className="flex justify-center">
          <VisualizerControls
            voiceEnabled={voiceEnabled}
            onToggleVoice={setVoiceEnabled}
            voiceSpeed={speed}
            onVoiceSpeedChange={setSpeed}
            isSpeaking={isSpeaking}
            onPauseSpeech={pauseSpeech}
            onResumeSpeech={resumeSpeech}
            onStopSpeech={stopSpeech}
            showMemory={showMemory}
            onToggleMemory={setShowMemory}
          />
        </div>
      </div>

      {/* Memory Layout */}
      {showMemory && (
        <div className="bg-muted/20 rounded-lg p-4">
          <h4 className="font-semibold mb-3">Call Stack Memory Layout</h4>
          <div className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="text-sm font-medium mb-2">Stack Frames</h5>
                <div className="space-y-1">
                  {callStack.length === 0 ? (
                    <div className="text-xs font-mono bg-background/50 p-2 rounded">
                      <span>Stack is empty</span>
                    </div>
                  ) : (
                    callStack.map((frame, index) => {
                      const address = 0x7000 + (index * 16); // Different base address for call stack
                      return (
                        <div key={frame.id} className={`flex justify-between text-xs font-mono p-2 rounded ${
                          frame.isActive ? 'bg-primary/20 border border-primary/30' : 'bg-background/50'
                        }`}>
                          <span>frame[{index}]</span>
                          <span>0x{address.toString(16).toUpperCase()}</span>
                          <span>{frame.functionName}({JSON.stringify(frame.parameters).slice(1, -1)})</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
              <div>
                <h5 className="text-sm font-medium mb-2">Stack Details</h5>
                <div className="space-y-1">
                  <div className="text-xs font-mono bg-background/50 p-2 rounded">
                    <div><strong>Stack Depth:</strong> {callStack.length}</div>
                    <div><strong>Max Depth:</strong> {Math.max(callStack.length, 1)}</div>
                    <div><strong>Active Frames:</strong> {callStack.filter(f => f.isActive).length}</div>
                    <div><strong>Current Function:</strong> {callStack.length > 0 ? callStack[callStack.length - 1]?.functionName : 'None'}</div>
                    <div><strong>Recursion Type:</strong> {recursionType}</div>
                    <div><strong>Input Value:</strong> {inputValue}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 p-3 bg-info/10 rounded-lg border border-info/30">
              <p className="text-xs text-info-foreground">
                <strong>Memory Info:</strong> Each function call creates a new stack frame containing parameters, local variables, and return address. 
                The call stack grows downward in memory as functions call each other recursively. When a function returns, its frame is removed from the stack.
                {callStack.length > 0 && ` Currently ${callStack.length} frame${callStack.length === 1 ? '' : 's'} on the stack.`}
                {finalResult !== null && ` Final result: ${finalResult}`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}