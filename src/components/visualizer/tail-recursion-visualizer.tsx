import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

interface CallFrame {
  function: string;
  params: string;
  returnValue?: number;
  step: number;
  isTailCall?: boolean;
}

export function TailRecursionVisualizer() {
  const [nInput, setNInput] = useState('5');
  const [algorithm, setAlgorithm] = useState<'factorial' | 'fibonacci' | 'sum'>('factorial');
  const [callStack, setCallStack] = useState<CallFrame[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showMemory, setShowMemory] = useState(false);
  const [comparison, setComparison] = useState<'regular' | 'tail' | 'both'>('both');
  const [regularStack, setRegularStack] = useState<CallFrame[]>([]);
  const [tailStack, setTailStack] = useState<CallFrame[]>([]);

  const {
    voiceEnabled,
    setVoiceEnabled,
    speakOperation,
    speakStep,
    speakResult,
  } = useVisualizerVoice({ minInterval: 800 });

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  // Regular (non-tail) recursive factorial
  const runRegularFactorial = useCallback(async (n: number, stack: CallFrame[] = [], step = 0): Promise<number> => {
    const frame: CallFrame = {
      function: 'factorial',
      params: `n=${n}`,
      step: step++,
    };
    
    stack.push(frame);
    setRegularStack([...stack]);
    setCurrentStep(step);
    
    speakStep('Regular recursion', `Call factorial(${n})`, step, n);
    await sleep(600);

    if (n <= 1) {
      frame.returnValue = 1;
      setRegularStack([...stack]);
      speakStep('Base case', `factorial(${n}) returns 1`, step, n);
      await sleep(600);
      stack.pop();
      setRegularStack([...stack]);
      return 1;
    }

    const result = n * await runRegularFactorial(n - 1, stack, step);
    frame.returnValue = result;
    setRegularStack([...stack]);
    speakStep('Return', `factorial(${n}) returns ${result}`, step, n);
    await sleep(600);
    stack.pop();
    setRegularStack([...stack]);
    return result;
  }, [speakStep]);

  // Tail recursive factorial
  const runTailFactorial = useCallback(async (n: number, acc = 1, stack: CallFrame[] = [], step = 0): Promise<number> => {
    const frame: CallFrame = {
      function: 'factorialTail',
      params: `n=${n}, acc=${acc}`,
      step: step++,
      isTailCall: true,
    };
    
    // In true tail recursion, we replace the frame instead of adding
    if (stack.length > 0) {
      stack[stack.length - 1] = frame;
    } else {
      stack.push(frame);
    }
    
    setTailStack([...stack]);
    setCurrentStep(step);
    
    speakStep('Tail recursion', `Call factorialTail(${n}, ${acc})`, step, n);
    await sleep(600);

    if (n <= 1) {
      frame.returnValue = acc;
      setTailStack([...stack]);
      speakStep('Base case', `factorialTail(${n}, ${acc}) returns ${acc}`, step, n);
      await sleep(600);
      return acc;
    }

    return await runTailFactorial(n - 1, n * acc, stack, step);
  }, [speakStep]);

  // Regular recursive sum
  const runRegularSum = useCallback(async (n: number, stack: CallFrame[] = [], step = 0): Promise<number> => {
    const frame: CallFrame = {
      function: 'sum',
      params: `n=${n}`,
      step: step++,
    };
    
    stack.push(frame);
    setRegularStack([...stack]);
    setCurrentStep(step);
    
    speakStep('Regular recursion', `Call sum(${n})`, step, n);
    await sleep(600);

    if (n <= 0) {
      frame.returnValue = 0;
      setRegularStack([...stack]);
      speakStep('Base case', `sum(${n}) returns 0`, step, n);
      await sleep(600);
      stack.pop();
      setRegularStack([...stack]);
      return 0;
    }

    const result = n + await runRegularSum(n - 1, stack, step);
    frame.returnValue = result;
    setRegularStack([...stack]);
    speakStep('Return', `sum(${n}) returns ${result}`, step, n);
    await sleep(600);
    stack.pop();
    setRegularStack([...stack]);
    return result;
  }, [speakStep]);

  // Tail recursive sum
  const runTailSum = useCallback(async (n: number, acc = 0, stack: CallFrame[] = [], step = 0): Promise<number> => {
    const frame: CallFrame = {
      function: 'sumTail',
      params: `n=${n}, acc=${acc}`,
      step: step++,
      isTailCall: true,
    };
    
    if (stack.length > 0) {
      stack[stack.length - 1] = frame;
    } else {
      stack.push(frame);
    }
    
    setTailStack([...stack]);
    setCurrentStep(step);
    
    speakStep('Tail recursion', `Call sumTail(${n}, ${acc})`, step, n);
    await sleep(600);

    if (n <= 0) {
      frame.returnValue = acc;
      setTailStack([...stack]);
      speakStep('Base case', `sumTail(${n}, ${acc}) returns ${acc}`, step, n);
      await sleep(600);
      return acc;
    }

    return await runTailSum(n - 1, acc + n, stack, step);
  }, [speakStep]);

  const runVisualization = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setCurrentStep(0);
    setRegularStack([]);
    setTailStack([]);
    
    const n = Math.max(1, Math.min(8, parseInt(nInput) || 5));
    
    speakOperation('Tail Recursion Comparison', `Comparing regular vs tail recursive ${algorithm} for n=${n}`);

    if (comparison === 'regular' || comparison === 'both') {
      if (algorithm === 'factorial') {
        await runRegularFactorial(n);
      } else if (algorithm === 'sum') {
        await runRegularSum(n);
      }
    }

    if (comparison === 'both') {
      await sleep(1000);
      speakOperation('Tail Recursion', 'Now showing tail recursive version');
    }

    if (comparison === 'tail' || comparison === 'both') {
      if (algorithm === 'factorial') {
        await runTailFactorial(n);
      } else if (algorithm === 'sum') {
        await runTailSum(n);
      }
    }

    speakResult(`Comparison complete. Notice how tail recursion uses constant stack space.`);
    setIsRunning(false);
  }, [isRunning, nInput, algorithm, comparison, runRegularFactorial, runTailFactorial, runRegularSum, runTailSum, speakOperation, speakResult]);

  const renderCallStack = (stack: CallFrame[], title: string, color: string) => (
    <div className="flex-1">
      <h3 className="text-sm font-semibold mb-2 text-center">{title}</h3>
      <div className="space-y-1 min-h-[200px]">
        {stack.map((frame, index) => (
          <div
            key={`${frame.step}-${index}`}
            className={`p-2 rounded border text-xs font-mono transition-all duration-300 ${
              frame.isTailCall 
                ? `bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-600`
                : `${color} border-opacity-50`
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold">{frame.function}({frame.params})</span>
              {frame.returnValue !== undefined && (
                <span className="text-primary font-bold">→ {frame.returnValue}</span>
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Step {frame.step} {frame.isTailCall && '(Tail Call - Optimized)'}
            </div>
          </div>
        ))}
        {stack.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-8">
            No active calls
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <div className="flex items-center gap-2">
          <span className="text-sm">n:</span>
          <Input 
            className="w-20" 
            value={nInput} 
            onChange={(e) => setNInput(e.target.value)}
            placeholder="5"
          />
        </div>
        
        <Select value={algorithm} onValueChange={(v: 'factorial' | 'fibonacci' | 'sum') => setAlgorithm(v)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="factorial">Factorial</SelectItem>
            <SelectItem value="sum">Sum 1..n</SelectItem>
          </SelectContent>
        </Select>

        <Select value={comparison} onValueChange={(v: 'regular' | 'tail' | 'both') => setComparison(v)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="both">Both</SelectItem>
            <SelectItem value="regular">Regular Only</SelectItem>
            <SelectItem value="tail">Tail Only</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={runVisualization} disabled={isRunning}>
          {isRunning ? 'Running...' : 'Run Comparison'}
        </Button>
      </div>

      <div className="p-4 bg-gradient-visualization rounded-xl border-2">
        <div className="flex gap-4">
          {(comparison === 'regular' || comparison === 'both') && 
            renderCallStack(regularStack, 'Regular Recursion', 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-600')
          }
          {(comparison === 'tail' || comparison === 'both') && 
            renderCallStack(tailStack, 'Tail Recursion', 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-600')
          }
        </div>
      </div>

      <div className="flex justify-center">
        <VisualizerControls
          showMemory={showMemory}
          onToggleMemory={setShowMemory}
          voiceEnabled={voiceEnabled}
          onToggleVoice={setVoiceEnabled}
        />
      </div>

      {showMemory && (
        <MemoryLayout
          data={comparison === 'tail' ? tailStack : regularStack}
          title="Call Stack Memory"
          baseAddress={8000}
          wordSize={8}
        />
      )}

      <div className="bg-muted/20 rounded-lg p-4 text-sm space-y-2">
        <div className="font-semibold text-primary">Key Differences:</div>
        <div>• <strong>Regular Recursion:</strong> Builds up call stack, then unwinds with calculations</div>
        <div>• <strong>Tail Recursion:</strong> Passes result as parameter, enables stack optimization</div>
        <div>• <strong>Memory Usage:</strong> Tail recursion can be optimized to O(1) space vs O(n) for regular</div>
        <div>• <strong>Performance:</strong> Tail calls can be converted to loops by compilers</div>
      </div>
    </div>
  );
}