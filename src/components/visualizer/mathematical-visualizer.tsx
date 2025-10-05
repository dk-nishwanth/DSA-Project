import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, RotateCcw, Hash } from 'lucide-react';
import { motion } from 'framer-motion';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

interface MathStep {
  step: number;
  description: string;
  values: { [key: string]: number };
  highlight?: string[];
}

export function MathematicalVisualizer() {
  const [algorithm, setAlgorithm] = useState('gcd');
  const [inputA, setInputA] = useState(48);
  const [inputB, setInputB] = useState(18);
  const [inputN, setInputN] = useState(30);
  const [steps, setSteps] = useState<MathStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<number | null>(null);
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
    speakOperation,
    speakStep,
    speakResult,
  } = useVisualizerVoice({ minInterval: 2000 });

  const algorithms = [
    { value: 'gcd', label: 'GCD (Euclidean Algorithm)' },
    { value: 'lcm', label: 'LCM Calculation' },
    { value: 'prime-sieve', label: 'Sieve of Eratosthenes' },
    { value: 'fast-exp', label: 'Fast Exponentiation' },
    { value: 'fibonacci', label: 'Fibonacci Sequence' }
  ];

  const generateGCDSteps = (a: number, b: number): MathStep[] => {
    const steps: MathStep[] = [];
    let stepNum = 0;
    
    steps.push({
      step: stepNum++,
      description: `Start with GCD(${a}, ${b})`,
      values: { a, b },
      highlight: ['a', 'b']
    });

    while (b !== 0) {
      const remainder = a % b;
      steps.push({
        step: stepNum++,
        description: `${a} = ${Math.floor(a / b)} × ${b} + ${remainder}`,
        values: { a, b, quotient: Math.floor(a / b), remainder },
        highlight: ['remainder']
      });

      a = b;
      b = remainder;
      
      if (b !== 0) {
        steps.push({
          step: stepNum++,
          description: `Continue with GCD(${a}, ${b})`,
          values: { a, b },
          highlight: ['a', 'b']
        });
      }
    }

    steps.push({
      step: stepNum++,
      description: `GCD found: ${a}`,
      values: { result: a },
      highlight: ['result']
    });

    return steps;
  };

  const generateSieveSteps = (n: number): MathStep[] => {
    const steps: MathStep[] = [];
    const sieve = Array(n + 1).fill(true);
    sieve[0] = sieve[1] = false;
    let stepNum = 0;

    steps.push({
      step: stepNum++,
      description: `Initialize array for numbers 0 to ${n}`,
      values: { n, current: 2 },
      highlight: ['n']
    });

    for (let i = 2; i * i <= n; i++) {
      if (sieve[i]) {
        steps.push({
          step: stepNum++,
          description: `Mark multiples of ${i} as composite`,
          values: { current: i, marking: i * i },
          highlight: ['current']
        });

        for (let j = i * i; j <= n; j += i) {
          sieve[j] = false;
        }
      }
    }

    const primes = [];
    for (let i = 2; i <= n; i++) {
      if (sieve[i]) primes.push(i);
    }

    steps.push({
      step: stepNum++,
      description: `Found ${primes.length} primes: ${primes.slice(0, 10).join(', ')}${primes.length > 10 ? '...' : ''}`,
      values: { primeCount: primes.length },
      highlight: ['primeCount']
    });

    return steps;
  };

  const generateFastExpSteps = (base: number, exp: number): MathStep[] => {
    const steps: MathStep[] = [];
    let result = 1;
    let currentBase = base;
    let currentExp = exp;
    let stepNum = 0;

    steps.push({
      step: stepNum++,
      description: `Calculate ${base}^${exp} using fast exponentiation`,
      values: { base, exp, result: 1 },
      highlight: ['base', 'exp']
    });

    while (currentExp > 0) {
      if (currentExp % 2 === 1) {
        result *= currentBase;
        steps.push({
          step: stepNum++,
          description: `Exponent is odd: result = result × ${currentBase} = ${result}`,
          values: { base: currentBase, exp: currentExp, result },
          highlight: ['result']
        });
      }

      currentBase *= currentBase;
      currentExp = Math.floor(currentExp / 2);

      if (currentExp > 0) {
        steps.push({
          step: stepNum++,
          description: `Square base and halve exponent: base = ${currentBase}, exp = ${currentExp}`,
          values: { base: currentBase, exp: currentExp, result },
          highlight: ['base', 'exp']
        });
      }
    }

    steps.push({
      step: stepNum++,
      description: `Final result: ${result}`,
      values: { result },
      highlight: ['result']
    });

    return steps;
  };

  const generateFibonacciSteps = (n: number): MathStep[] => {
    const steps: MathStep[] = [];
    let stepNum = 0;

    if (n <= 1) {
      steps.push({
        step: stepNum++,
        description: `F(${n}) = ${n}`,
        values: { n, result: n },
        highlight: ['result']
      });
      return steps;
    }

    let a = 0, b = 1;
    steps.push({
      step: stepNum++,
      description: `Initialize: F(0) = 0, F(1) = 1`,
      values: { f0: a, f1: b },
      highlight: ['f0', 'f1']
    });

    for (let i = 2; i <= n; i++) {
      const next = a + b;
      steps.push({
        step: stepNum++,
        description: `F(${i}) = F(${i-2}) + F(${i-1}) = ${a} + ${b} = ${next}`,
        values: { prev2: a, prev1: b, current: next, index: i },
        highlight: ['current']
      });
      a = b;
      b = next;
    }

    return steps;
  };

  const runAlgorithm = () => {
    speakOperation('Mathematical Visualizer', `Running ${algorithms.find(a=>a.value===algorithm)?.label || 'algorithm'}.`);
    let newSteps: MathStep[] = [];
    let finalResult: number = 0;

    switch (algorithm) {
      case 'gcd':
        newSteps = generateGCDSteps(inputA, inputB);
        finalResult = gcd(inputA, inputB);
        break;
      case 'lcm':
        const gcdValue = gcd(inputA, inputB);
        finalResult = (inputA * inputB) / gcdValue;
        newSteps = [
          ...generateGCDSteps(inputA, inputB),
          {
            step: newSteps.length,
            description: `LCM(${inputA}, ${inputB}) = (${inputA} × ${inputB}) / GCD = ${finalResult}`,
            values: { result: finalResult },
            highlight: ['result']
          }
        ];
        break;
      case 'prime-sieve':
        newSteps = generateSieveSteps(inputN);
        finalResult = sieveOfEratosthenes(inputN).length;
        break;
      case 'fast-exp':
        newSteps = generateFastExpSteps(inputA, inputB);
        finalResult = fastExponentiation(inputA, inputB);
        break;
      case 'fibonacci':
        newSteps = generateFibonacciSteps(inputN);
        finalResult = fibonacci(inputN);
        break;
    }

    setSteps(newSteps);
    setResult(finalResult);
    setCurrentStep(0);
    speakResult(`Result: ${finalResult}`);
  };

  // Helper functions
  const gcd = (a: number, b: number): number => {
    while (b !== 0) {
      [a, b] = [b, a % b];
    }
    return a;
  };

  const sieveOfEratosthenes = (n: number): number[] => {
    const sieve = Array(n + 1).fill(true);
    sieve[0] = sieve[1] = false;
    
    for (let i = 2; i * i <= n; i++) {
      if (sieve[i]) {
        for (let j = i * i; j <= n; j += i) {
          sieve[j] = false;
        }
      }
    }
    
    return sieve.map((isPrime, num) => isPrime ? num : -1).filter(num => num !== -1);
  };

  const fastExponentiation = (base: number, exp: number): number => {
    let result = 1;
    while (exp > 0) {
      if (exp % 2 === 1) result *= base;
      base *= base;
      exp = Math.floor(exp / 2);
    }
    return result;
  };

  const fibonacci = (n: number): number => {
    if (n <= 1) return n;
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) {
      [a, b] = [b, a + b];
    }
    return b;
  };

  const reset = () => {
    setSteps([]);
    setCurrentStep(0);
    setResult(null);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Algorithm</label>
          <Select value={algorithm} onValueChange={setAlgorithm}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {algorithms.map(alg => (
                <SelectItem key={alg.value} value={alg.value}>
                  {alg.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {['gcd', 'lcm', 'fast-exp'].includes(algorithm) && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {algorithm === 'fast-exp' ? 'Base' : 'First Number'}
              </label>
              <Input
                type="number"
                value={inputA}
                onChange={(e) => setInputA(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {algorithm === 'fast-exp' ? 'Exponent' : 'Second Number'}
              </label>
              <Input
                type="number"
                value={inputB}
                onChange={(e) => setInputB(parseInt(e.target.value) || 0)}
              />
            </div>
          </>
        )}

        {['prime-sieve', 'fibonacci'].includes(algorithm) && (
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {algorithm === 'prime-sieve' ? 'Upper Limit' : 'N-th Term'}
            </label>
            <Input
              type="number"
              value={inputN}
              onChange={(e) => setInputN(parseInt(e.target.value) || 0)}
            />
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={runAlgorithm} className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Run
          </Button>
          <Button onClick={reset} variant="outline">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Step Panel */}
      {currentStepText && (
        <div className="p-2 bg-muted/20 rounded text-sm text-center">{currentStepText}</div>
      )}

      {/* Step Navigation */}
      {steps.length > 0 && (
        <div className="flex items-center justify-center gap-4">
          <Button onClick={prevStep} disabled={currentStep === 0} variant="outline">
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </span>
          <Button onClick={nextStep} disabled={currentStep === steps.length - 1} variant="outline">
            Next
          </Button>
        </div>
      )}

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
        <MemoryLayout
          title="Mathematical Memory Layout"
          data={(function(){
            if (algorithm==='gcd' || algorithm==='lcm') return [inputA, inputB, result ?? 0];
            if (algorithm==='fast-exp') return [inputA, inputB, result ?? 0];
            if (algorithm==='fibonacci') {
              const n = Math.max(0, Math.min(30, inputN));
              const arr:number[] = [];
              let a=0,b=1; for(let i=0;i<=n;i++){ arr.push(i===0?0:(i===1?1:(a+b))); if(i>=1){const c=a+b;a=b;b=c;} }
              return arr;
            }
            if (algorithm==='prime-sieve') {
              const n = Math.max(2, Math.min(500, inputN));
              const primes = sieveOfEratosthenes(n);
              return primes as number[];
            }
            return [] as number[];
          })()}
          baseAddress={0x5200}
          wordSize={4}
        />
      )}

      {/* Visualization */}
      {currentStepData && (
        <div className="bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-cyan-950 dark:to-blue-900 p-8 rounded-xl border-2 border-dashed border-cyan-200 dark:border-cyan-800">
          <div className="space-y-6">
            <div className="text-center">
              <Hash className="h-6 w-6 mx-auto mb-2 text-cyan-600" />
              <h3 className="text-lg font-semibold">Step {currentStepData.step + 1}</h3>
            </div>

            {/* Step Description */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
              <p className="text-center font-medium">{currentStepData.description}</p>
            </div>

            {/* Values Display */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(currentStepData.values).map(([key, value]) => {
                const isHighlighted = currentStepData.highlight?.includes(key);
                return (
                  <motion.div
                    key={key}
                    className={`p-4 rounded-lg border-2 text-center ${
                      isHighlighted 
                        ? 'bg-yellow-100 border-yellow-400 text-yellow-800' 
                        : 'bg-white border-gray-200 text-gray-800'
                    }`}
                    initial={{ scale: 1 }}
                    animate={{ scale: isHighlighted ? 1.05 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="text-sm font-medium text-gray-600 mb-1">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </div>
                    <div className="text-xl font-bold">{value}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Final Result */}
      {result !== null && (
        <div className="bg-card border rounded-lg p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Final Result</h3>
            <div className="text-3xl font-bold text-green-600">{result}</div>
          </div>
        </div>
      )}

      {/* Algorithm Information */}
      <div className="bg-card border rounded-lg p-4">
        <h4 className="font-semibold mb-2">Algorithm Information:</h4>
        <div className="text-sm text-muted-foreground">
          {algorithm === 'gcd' && (
            <div>
              <strong>Euclidean Algorithm:</strong> Efficiently finds the greatest common divisor by repeatedly applying the division algorithm until the remainder is 0.
              <br />Time Complexity: O(log min(a,b))
            </div>
          )}
          {algorithm === 'lcm' && (
            <div>
              <strong>LCM Calculation:</strong> Uses the relationship LCM(a,b) = (a × b) / GCD(a,b) to find the least common multiple.
              <br />Time Complexity: O(log min(a,b))
            </div>
          )}
          {algorithm === 'prime-sieve' && (
            <div>
              <strong>Sieve of Eratosthenes:</strong> Finds all prime numbers up to n by iteratively marking multiples of each prime as composite.
              <br />Time Complexity: O(n log log n)
            </div>
          )}
          {algorithm === 'fast-exp' && (
            <div>
              <strong>Fast Exponentiation:</strong> Computes a^b efficiently using the binary representation of the exponent.
              <br />Time Complexity: O(log b)
            </div>
          )}
          {algorithm === 'fibonacci' && (
            <div>
              <strong>Fibonacci Sequence:</strong> Generates the n-th Fibonacci number using iterative approach to avoid exponential time complexity.
              <br />Time Complexity: O(n)
            </div>
          )}
        </div>
      </div>
    </div>
  );
}