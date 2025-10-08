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
  result?: number;
  step: number;
  isCached?: boolean;
}

interface MemoEntry {
  key: string;
  value: number;
  isNew: boolean;
}

export function DPIntroductionVisualizer() {
  const [nInput, setNInput] = useState('6');
  const [approach, setApproach] = useState<'naive' | 'memoization' | 'tabulation'>('naive');
  const [problem, setProblem] = useState<'fibonacci' | 'factorial' | 'tribonacci'>('fibonacci');
  const [callStack, setCallStack] = useState<CallFrame[]>([]);
  const [memoTable, setMemoTable] = useState<MemoEntry[]>([]);
  const [dpTable, setDpTable] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showMemory, setShowMemory] = useState(false);
  const [totalCalls, setTotalCalls] = useState(0);
  const [result, setResult] = useState<number | null>(null);

  const {
    voiceEnabled,
    setVoiceEnabled,
    speakOperation,
    speakStep,
    speakResult,
  } = useVisualizerVoice({ minInterval: 600 });

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  // Naive recursive implementations
  const naiveFibonacci = useCallback(async (n: number, stack: CallFrame[] = [], step = 0): Promise<number> => {
    const frame: CallFrame = {
      function: 'fib',
      params: `n=${n}`,
      step: step++,
    };
    
    stack.push(frame);
    setCallStack([...stack]);
    setCurrentStep(step);
    setTotalCalls(prev => prev + 1);
    
    speakStep('Recursive call', `Computing fib(${n})`, step, Math.pow(2, parseInt(nInput)));
    await sleep(300);

    if (n <= 1) {
      frame.result = n;
      setCallStack([...stack]);
      speakStep('Base case', `fib(${n}) = ${n}`, step, Math.pow(2, parseInt(nInput)));
      await sleep(300);
      stack.pop();
      setCallStack([...stack]);
      return n;
    }

    const left = await naiveFibonacci(n - 1, stack, step);
    const right = await naiveFibonacci(n - 2, stack, step);
    const result = left + right;
    
    frame.result = result;
    setCallStack([...stack]);
    speakStep('Combine', `fib(${n}) = ${left} + ${right} = ${result}`, step, Math.pow(2, parseInt(nInput)));
    await sleep(300);
    stack.pop();
    setCallStack([...stack]);
    return result;
  }, [nInput, speakStep]);

  const naiveFactorial = useCallback(async (n: number, stack: CallFrame[] = [], step = 0): Promise<number> => {
    const frame: CallFrame = {
      function: 'fact',
      params: `n=${n}`,
      step: step++,
    };
    
    stack.push(frame);
    setCallStack([...stack]);
    setCurrentStep(step);
    setTotalCalls(prev => prev + 1);
    
    speakStep('Recursive call', `Computing fact(${n})`, step, parseInt(nInput));
    await sleep(300);

    if (n <= 1) {
      frame.result = 1;
      setCallStack([...stack]);
      speakStep('Base case', `fact(${n}) = 1`, step, parseInt(nInput));
      await sleep(300);
      stack.pop();
      setCallStack([...stack]);
      return 1;
    }

    const subResult = await naiveFactorial(n - 1, stack, step);
    const result = n * subResult;
    
    frame.result = result;
    setCallStack([...stack]);
    speakStep('Multiply', `fact(${n}) = ${n} * ${subResult} = ${result}`, step, parseInt(nInput));
    await sleep(300);
    stack.pop();
    setCallStack([...stack]);
    return result;
  }, [nInput, speakStep]);

  // Memoized implementations
  const memoizedFibonacci = useCallback(async (n: number, memo: Record<number, number> = {}, stack: CallFrame[] = [], step = 0): Promise<number> => {
    const frame: CallFrame = {
      function: 'fibMemo',
      params: `n=${n}`,
      step: step++,
    };
    
    stack.push(frame);
    setCallStack([...stack]);
    setCurrentStep(step);
    setTotalCalls(prev => prev + 1);
    
    speakStep('Check memo', `Checking memo for fib(${n})`, step, parseInt(nInput));
    
    if (memo[n] !== undefined) {
      frame.result = memo[n];
      frame.isCached = true;
      setCallStack([...stack]);
      speakStep('Cache hit', `Found cached fib(${n}) = ${memo[n]}`, step, parseInt(nInput));
      await sleep(300);
      stack.pop();
      setCallStack([...stack]);
      return memo[n];
    }
    
    await sleep(300);

    if (n <= 1) {
      memo[n] = n;
      frame.result = n;
      setCallStack([...stack]);
      
      // Update memo table visualization
      const memoEntries = Object.entries(memo).map(([key, value]) => ({
        key,
        value,
        isNew: parseInt(key) === n,
      }));
      setMemoTable(memoEntries);
      
      speakStep('Base case', `fib(${n}) = ${n}, cached`, step, parseInt(nInput));
      await sleep(300);
      stack.pop();
      setCallStack([...stack]);
      return n;
    }

    const left = await memoizedFibonacci(n - 1, memo, stack, step);
    const right = await memoizedFibonacci(n - 2, memo, stack, step);
    const result = left + right;
    
    memo[n] = result;
    frame.result = result;
    setCallStack([...stack]);
    
    // Update memo table visualization
    const memoEntries = Object.entries(memo).map(([key, value]) => ({
      key,
      value,
      isNew: parseInt(key) === n,
    }));
    setMemoTable(memoEntries);
    
    speakStep('Cache store', `fib(${n}) = ${result}, cached`, step, parseInt(nInput));
    await sleep(300);
    stack.pop();
    setCallStack([...stack]);
    return result;
  }, [nInput, speakStep]);

  // Tabulation (bottom-up) implementations
  const tabulationFibonacci = useCallback(async (n: number) => {
    speakOperation('Tabulation', `Building fibonacci table bottom-up for n=${n}`);
    
    const dp = new Array(n + 1).fill(0);
    if (n >= 1) dp[1] = 1;
    
    setDpTable([...dp]);
    await sleep(500);
    
    for (let i = 2; i <= n; i++) {
      dp[i] = dp[i - 1] + dp[i - 2];
      setDpTable([...dp]);
      setCurrentStep(i);
      
      speakStep('Build table', `dp[${i}] = dp[${i-1}] + dp[${i-2}] = ${dp[i-1]} + ${dp[i-2]} = ${dp[i]}`, i, n);
      await sleep(400);
    }
    
    return dp[n];
  }, [speakOperation, speakStep]);

  const tabulationFactorial = useCallback(async (n: number) => {
    speakOperation('Tabulation', `Building factorial table bottom-up for n=${n}`);
    
    const dp = new Array(n + 1).fill(0);
    dp[0] = 1;
    if (n >= 1) dp[1] = 1;
    
    setDpTable([...dp]);
    await sleep(500);
    
    for (let i = 2; i <= n; i++) {
      dp[i] = i * dp[i - 1];
      setDpTable([...dp]);
      setCurrentStep(i);
      
      speakStep('Build table', `dp[${i}] = ${i} * dp[${i-1}] = ${i} * ${dp[i-1]} = ${dp[i]}`, i, n);
      await sleep(400);
    }
    
    return dp[n];
  }, [speakOperation, speakStep]);

  const runVisualization = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setCallStack([]);
    setMemoTable([]);
    setDpTable([]);
    setCurrentStep(0);
    setTotalCalls(0);
    setResult(null);
    
    const n = Math.max(1, Math.min(approach === 'naive' ? 8 : 15, parseInt(nInput) || 6));
    let finalResult: number;
    
    const startTime = Date.now();
    
    if (approach === 'naive') {
      speakOperation('Naive Recursion', `Computing ${problem}(${n}) using naive recursion`);
      if (problem === 'fibonacci') {
        finalResult = await naiveFibonacci(n);
      } else {
        finalResult = await naiveFactorial(n);
      }
    } else if (approach === 'memoization') {
      speakOperation('Memoization', `Computing ${problem}(${n}) using top-down memoization`);
      if (problem === 'fibonacci') {
        finalResult = await memoizedFibonacci(n);
      } else {
        // Implement memoized factorial if needed
        finalResult = await naiveFactorial(n);
      }
    } else {
      if (problem === 'fibonacci') {
        finalResult = await tabulationFibonacci(n);
      } else {
        finalResult = await tabulationFactorial(n);
      }
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    setResult(finalResult);
    speakResult(`${problem}(${n}) = ${finalResult}. Made ${totalCalls} calls in ${duration}ms`);
    setIsRunning(false);
  }, [isRunning, approach, problem, nInput, naiveFibonacci, naiveFactorial, memoizedFibonacci, tabulationFibonacci, tabulationFactorial, totalCalls, speakOperation, speakResult]);

  const renderCallStack = () => (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">Call Stack</h3>
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {callStack.map((frame, index) => (
          <div
            key={`${frame.step}-${index}`}
            className={`p-2 rounded border text-xs font-mono transition-all duration-300 ${
              frame.isCached 
                ? 'bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-600'
                : 'bg-blue-100 border-blue-300 dark:bg-blue-900/30 dark:border-blue-600'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold">{frame.function}({frame.params})</span>
              {frame.result !== undefined && (
                <span className="text-primary font-bold">
                  → {frame.result} {frame.isCached && '(cached)'}
                </span>
              )}
            </div>
          </div>
        ))}
        {callStack.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-4">
            No active calls
          </div>
        )}
      </div>
    </div>
  );

  const renderMemoTable = () => (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">Memoization Table</h3>
      <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
        {memoTable.map((entry, index) => (
          <div
            key={index}
            className={`p-2 rounded border text-xs font-mono text-center transition-all duration-300 ${
              entry.isNew
                ? 'bg-yellow-200 border-yellow-400 dark:bg-yellow-800 dark:border-yellow-600'
                : 'bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-600'
            }`}
          >
            <div className="font-semibold">[{entry.key}]</div>
            <div>{entry.value}</div>
          </div>
        ))}
        {memoTable.length === 0 && (
          <div className="col-span-4 text-center text-muted-foreground text-sm py-4">
            No cached values
          </div>
        )}
      </div>
    </div>
  );

  const renderDPTable = () => (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">DP Table (Bottom-up)</h3>
      <div className="flex flex-wrap gap-2">
        {dpTable.map((value, index) => (
          <div
            key={index}
            className={`w-12 h-12 flex flex-col items-center justify-center rounded border font-mono text-xs transition-all duration-300 ${
              currentStep === index
                ? 'bg-yellow-200 border-yellow-400 dark:bg-yellow-800 dark:border-yellow-600'
                : index <= currentStep
                ? 'bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-600'
                : 'bg-white border-gray-300 dark:bg-gray-900 dark:border-gray-600'
            }`}
          >
            <div className="text-xs text-muted-foreground">{index}</div>
            <div className="font-bold">{value}</div>
          </div>
        ))}
        {dpTable.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-4 w-full">
            No table built yet
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
            placeholder="6"
          />
        </div>
        
        <Select value={problem} onValueChange={(v: 'fibonacci' | 'factorial' | 'tribonacci') => setProblem(v)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fibonacci">Fibonacci</SelectItem>
            <SelectItem value="factorial">Factorial</SelectItem>
          </SelectContent>
        </Select>

        <Select value={approach} onValueChange={(v: 'naive' | 'memoization' | 'tabulation') => setApproach(v)}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="naive">Naive Recursion</SelectItem>
            <SelectItem value="memoization">Memoization</SelectItem>
            <SelectItem value="tabulation">Tabulation</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={runVisualization} disabled={isRunning}>
          {isRunning ? 'Running...' : 'Run DP Demo'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-4 bg-gradient-visualization rounded-xl border-2">
          {approach === 'tabulation' ? renderDPTable() : renderCallStack()}
        </div>
        
        <div className="p-4 bg-gradient-visualization rounded-xl border-2">
          {approach === 'memoization' ? renderMemoTable() : (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Algorithm Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Calls:</span>
                  <span className="font-mono">{totalCalls}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Step:</span>
                  <span className="font-mono">{currentStep}</span>
                </div>
                {result !== null && (
                  <div className="flex justify-between font-bold text-primary">
                    <span>Result:</span>
                    <span className="font-mono">{result}</span>
                  </div>
                )}
              </div>
            </div>
          )}
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
          data={approach === 'tabulation' ? dpTable : approach === 'memoization' ? memoTable : callStack}
          title={`${approach} Memory Layout`}
          baseAddress={9000}
          wordSize={8}
        />
      )}

      <div className="bg-muted/20 rounded-lg p-4 text-sm space-y-2">
        <div className="font-semibold text-primary">Dynamic Programming Approaches:</div>
        <div>• <strong>Naive Recursion:</strong> Exponential time due to repeated subproblems</div>
        <div>• <strong>Memoization (Top-down):</strong> Cache results to avoid recomputation</div>
        <div>• <strong>Tabulation (Bottom-up):</strong> Build solution iteratively from base cases</div>
        <div>• <strong>Key Insight:</strong> DP trades space for time by storing intermediate results</div>
      </div>
    </div>
  );
}