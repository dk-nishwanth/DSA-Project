import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, X, Hash, Zap, Target, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

interface PrimeStep {
  step: number;
  number: number;
  operation: string;
  isPrime?: boolean;
  factors?: number[];
  description: string;
  sieveState?: boolean[];
}

export function PrimeAlgorithmsVisualizer() {
  const [algorithm, setAlgorithm] = useState('sieve');
  const [inputN, setInputN] = useState(30);
  const [testNumber, setTestNumber] = useState(97);
  const [steps, setSteps] = useState<PrimeStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [primes, setPrimes] = useState<number[]>([]);
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

  const algorithms = [
    { value: 'sieve', label: 'Sieve of Eratosthenes' },
    { value: 'trial-division', label: 'Trial Division' },
    { value: 'optimized-trial', label: 'Optimized Trial Division' },
    { value: 'miller-rabin', label: 'Miller-Rabin (Demo)' },
    { value: 'factorization', label: 'Prime Factorization' },
    { value: 'prime-counting', label: 'Prime Counting Function' }
  ];

  const generateSieveSteps = (n: number): PrimeStep[] => {
    const steps: PrimeStep[] = [];
    const sieve = Array(n + 1).fill(true);
    sieve[0] = sieve[1] = false;
    let stepNum = 0;

    steps.push({
      step: stepNum++,
      number: n,
      operation: 'Initialize',
      description: `Initialize sieve array for numbers 0 to ${n}`,
      sieveState: [...sieve]
    });

    for (let i = 2; i * i <= n; i++) {
      if (sieve[i]) {
        steps.push({
          step: stepNum++,
          number: i,
          operation: 'Mark Prime',
          isPrime: true,
          description: `${i} is prime, mark its multiples as composite`,
          sieveState: [...sieve]
        });

        for (let j = i * i; j <= n; j += i) {
          if (sieve[j]) {
            sieve[j] = false;
            steps.push({
              step: stepNum++,
              number: j,
              operation: 'Mark Composite',
              isPrime: false,
              description: `Mark ${j} as composite (multiple of ${i})`,
              sieveState: [...sieve]
            });
          }
        }
      }
    }

    const foundPrimes = [];
    for (let i = 2; i <= n; i++) {
      if (sieve[i]) foundPrimes.push(i);
    }

    steps.push({
      step: stepNum++,
      number: foundPrimes.length,
      operation: 'Complete',
      description: `Found ${foundPrimes.length} primes: ${foundPrimes.slice(0, 10).join(', ')}${foundPrimes.length > 10 ? '...' : ''}`,
      sieveState: [...sieve]
    });

    return steps;
  };

  const generateTrialDivisionSteps = (n: number): PrimeStep[] => {
    const steps: PrimeStep[] = [];
    let stepNum = 0;

    if (n < 2) {
      steps.push({
        step: stepNum++,
        number: n,
        operation: 'Not Prime',
        isPrime: false,
        description: `${n} is not prime (less than 2)`,
      });
      return steps;
    }

    steps.push({
      step: stepNum++,
      number: n,
      operation: 'Start Test',
      description: `Testing if ${n} is prime using trial division`,
    });

    const factors = [];
    for (let i = 2; i <= Math.sqrt(n); i++) {
      steps.push({
        step: stepNum++,
        number: i,
        operation: 'Test Divisor',
        description: `Testing if ${i} divides ${n}: ${n} ÷ ${i} = ${(n / i).toFixed(2)}`,
      });

      if (n % i === 0) {
        factors.push(i);
        if (i !== n / i) factors.push(n / i);
        
        steps.push({
          step: stepNum++,
          number: n,
          operation: 'Found Factor',
          isPrime: false,
          factors: [...factors],
          description: `${n} is composite: ${i} × ${n / i} = ${n}`,
        });
        return steps;
      }
    }

    steps.push({
      step: stepNum++,
      number: n,
      operation: 'Prime Found',
      isPrime: true,
      description: `${n} is prime (no divisors found)`,
    });

    return steps;
  };

  const generateOptimizedTrialSteps = (n: number): PrimeStep[] => {
    const steps: PrimeStep[] = [];
    let stepNum = 0;

    if (n < 2) {
      steps.push({
        step: stepNum++,
        number: n,
        operation: 'Not Prime',
        isPrime: false,
        description: `${n} is not prime (less than 2)`,
      });
      return steps;
    }

    if (n === 2) {
      steps.push({
        step: stepNum++,
        number: 2,
        operation: 'Prime Found',
        isPrime: true,
        description: `2 is the only even prime`,
      });
      return steps;
    }

    if (n % 2 === 0) {
      steps.push({
        step: stepNum++,
        number: n,
        operation: 'Even Check',
        isPrime: false,
        description: `${n} is even and &gt; 2, therefore composite`,
      });
      return steps;
    }

    steps.push({
      step: stepNum++,
      number: n,
      operation: 'Odd Check',
      description: `${n} is odd, testing odd divisors only`,
    });

    const factors = [];
    for (let i = 3; i <= Math.sqrt(n); i += 2) {
      steps.push({
        step: stepNum++,
        number: i,
        operation: 'Test Odd Divisor',
        description: `Testing odd divisor ${i}: ${n} ÷ ${i} = ${(n / i).toFixed(2)}`,
      });

      if (n % i === 0) {
        factors.push(i);
        if (i !== n / i) factors.push(n / i);
        
        steps.push({
          step: stepNum++,
          number: n,
          operation: 'Found Factor',
          isPrime: false,
          factors: [...factors],
          description: `${n} is composite: ${i} × ${n / i} = ${n}`,
        });
        return steps;
      }
    }

    steps.push({
      step: stepNum++,
      number: n,
      operation: 'Prime Found',
      isPrime: true,
      description: `${n} is prime (no odd divisors found)`,
    });

    return steps;
  };

  const generateFactorizationSteps = (n: number): PrimeStep[] => {
    const steps: PrimeStep[] = [];
    let stepNum = 0;
    let num = n;
    const factors = [];

    steps.push({
      step: stepNum++,
      number: n,
      operation: 'Start Factorization',
      description: `Finding prime factorization of ${n}`,
    });

    // Handle factor 2
    while (num % 2 === 0) {
      factors.push(2);
      num = num / 2;
      steps.push({
        step: stepNum++,
        number: 2,
        operation: 'Factor Found',
        factors: [...factors],
        description: `Found factor 2, remaining: ${num}`,
      });
    }

    // Handle odd factors
    for (let i = 3; i <= Math.sqrt(num); i += 2) {
      while (num % i === 0) {
        factors.push(i);
        num = num / i;
        steps.push({
          step: stepNum++,
          number: i,
          operation: 'Factor Found',
          factors: [...factors],
          description: `Found factor ${i}, remaining: ${num}`,
        });
      }
    }

    // If num is still > 2, it's a prime factor
    if (num > 2) {
      factors.push(num);
      steps.push({
        step: stepNum++,
        number: num,
        operation: 'Prime Factor',
        factors: [...factors],
        description: `${num} is a prime factor`,
      });
    }

    steps.push({
      step: stepNum++,
      number: n,
      operation: 'Complete',
      factors: [...factors],
      description: `Prime factorization: ${factors.join(' × ')} = ${n}`,
    });

    return steps;
  };

  const runAlgorithm = () => {
    setIsAnimating(true);
    speakOperation('Prime Algorithms', `Running ${algorithms.find(a=>a.value===algorithm)?.label || 'algorithm'}.`);
    
    let newSteps: PrimeStep[] = [];
    let foundPrimes: number[] = [];

    switch (algorithm) {
      case 'sieve':
        newSteps = generateSieveSteps(inputN);
        // Extract primes from final sieve state
        const finalSieve = newSteps[newSteps.length - 1]?.sieveState;
        if (finalSieve) {
          foundPrimes = finalSieve.map((isPrime, i) => isPrime ? i : -1).filter(n => n > 1);
        }
        break;
      case 'trial-division':
        newSteps = generateTrialDivisionSteps(testNumber);
        if (newSteps[newSteps.length - 1]?.isPrime) {
          foundPrimes = [testNumber];
        }
        break;
      case 'optimized-trial':
        newSteps = generateOptimizedTrialSteps(testNumber);
        if (newSteps[newSteps.length - 1]?.isPrime) {
          foundPrimes = [testNumber];
        }
        break;
      case 'factorization':
        newSteps = generateFactorizationSteps(testNumber);
        break;
      case 'miller-rabin':
        newSteps = [{
          step: 0,
          number: testNumber,
          operation: 'Miller-Rabin Demo',
          description: `Miller-Rabin is a probabilistic primality test - implementation would require complex number theory`,
        }];
        break;
      case 'prime-counting':
        // Count primes up to inputN
        const sieveForCounting = Array(inputN + 1).fill(true);
        sieveForCounting[0] = sieveForCounting[1] = false;
        for (let i = 2; i * i <= inputN; i++) {
          if (sieveForCounting[i]) {
            for (let j = i * i; j <= inputN; j += i) {
              sieveForCounting[j] = false;
            }
          }
        }
        const primeCount = sieveForCounting.filter(Boolean).length;
        newSteps = [{
          step: 0,
          number: primeCount,
          operation: 'Prime Counting',
          description: `π(${inputN}) = ${primeCount} (number of primes ≤ ${inputN})`,
        }];
        break;
    }

    setSteps(newSteps);
    setPrimes(foundPrimes);
    setCurrentStep(0);
    
    setTimeout(() => setIsAnimating(false), 1000);
    speakResult(`Algorithm completed. Found ${foundPrimes.length} primes.`);
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
    setPrimes([]);
    setIsAnimating(false);
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

        {['sieve', 'prime-counting'].includes(algorithm) && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Upper Limit (n)</label>
            <Input
              type="number"
              min="2"
              max="100"
              value={inputN}
              onChange={(e) => setInputN(parseInt(e.target.value) || 30)}
            />
          </div>
        )}

        {['trial-division', 'optimized-trial', 'miller-rabin', 'factorization'].includes(algorithm) && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Test Number</label>
            <Input
              type="number"
              min="2"
              max="10000"
              value={testNumber}
              onChange={(e) => setTestNumber(parseInt(e.target.value) || 97)}
            />
          </div>
        )}

        <div className="flex gap-2 items-end">
          <Button onClick={runAlgorithm} className="flex items-center gap-2" disabled={isAnimating}>
            <Hash className="h-4 w-4" />
            {isAnimating ? 'Running...' : 'Run'}
          </Button>
          <Button onClick={reset} variant="outline">
            <Target className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Algorithm Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            {algorithms.find(a => a.value === algorithm)?.label}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            {algorithm === 'sieve' && (
              <p>Sieve of Eratosthenes finds all primes up to n by iteratively marking multiples of each prime as composite. Time: O(n log log n)</p>
            )}
            {algorithm === 'trial-division' && (
              <p>Trial Division tests primality by checking divisibility by all numbers from 2 to √n. Time: O(√n)</p>
            )}
            {algorithm === 'optimized-trial' && (
              <p>Optimized Trial Division skips even numbers after checking 2, reducing operations by half. Time: O(√n)</p>
            )}
            {algorithm === 'miller-rabin' && (
              <p>Miller-Rabin is a probabilistic primality test with high accuracy and better performance for large numbers. Time: O(k log³ n)</p>
            )}
            {algorithm === 'factorization' && (
              <p>Prime Factorization decomposes a number into its prime factors. Time: O(√n)</p>
            )}
            {algorithm === 'prime-counting' && (
              <p>Prime Counting Function π(n) counts the number of primes less than or equal to n.</p>
            )}
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

      {/* Sieve Visualization */}
      {algorithm === 'sieve' && currentStepData?.sieveState && (
        <Card>
          <CardHeader>
            <CardTitle>Sieve State</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-10 gap-1 max-w-4xl">
              {currentStepData.sieveState.slice(0, Math.min(100, inputN + 1)).map((isPrime, i) => (
                <motion.div
                  key={i}
                  className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded ${
                    i < 2 ? 'bg-gray-300 text-gray-600' :
                    isPrime ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}
                  initial={{ scale: 1 }}
                  animate={{ 
                    scale: currentStepData.number === i ? 1.2 : 1,
                    boxShadow: currentStepData.number === i ? '0 0 10px rgba(59, 130, 246, 0.5)' : 'none'
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {i}
                </motion.div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Prime</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>Composite</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                <span>Not Prime (0,1)</span>
              </div>
            </div>
          </CardContent>
        </Card>
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
                  {currentStepData.isPrime === true ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : currentStepData.isPrime === false ? (
                    <X className="h-5 w-5 text-red-500" />
                  ) : (
                    <Clock className="h-5 w-5 text-blue-500" />
                  )}
                  {currentStepData.operation}
                  <Badge variant="outline">Step {currentStep + 1}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Description:</h4>
                  <p className="bg-muted p-3 rounded">{currentStepData.description}</p>
                </div>

                {currentStepData.factors && (
                  <div>
                    <h4 className="font-medium mb-2">Factors Found:</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentStepData.factors.map((factor, i) => (
                        <Badge key={i} variant="destructive">{factor}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded text-center">
                    <div className="text-sm text-muted-foreground">Number</div>
                    <div className="text-xl font-bold">{currentStepData.number}</div>
                  </div>
                  {currentStepData.isPrime !== undefined && (
                    <div className={`p-3 rounded text-center ${
                      currentStepData.isPrime ? 'bg-green-50 dark:bg-green-950' : 'bg-red-50 dark:bg-red-950'
                    }`}>
                      <div className="text-sm text-muted-foreground">Status</div>
                      <div className="text-xl font-bold">
                        {currentStepData.isPrime ? 'Prime' : 'Composite'}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Summary */}
      {primes.length > 0 && (
        <Card className="border-2 border-green-500">
          <CardHeader>
            <CardTitle className="text-green-700 dark:text-green-300">Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Primes Found ({primes.length}):</h4>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {primes.slice(0, 50).map((prime, i) => (
                    <Badge key={i} variant="default">{prime}</Badge>
                  ))}
                  {primes.length > 50 && (
                    <Badge variant="outline">+{primes.length - 50} more</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
          title="Prime Algorithms Memory"
          data={primes.slice(0, 20)}
          baseAddress={0x9000}
          wordSize={4}
        />
      )}

      {/* Educational Information */}
      <Card>
        <CardHeader>
          <CardTitle>Prime Number Theory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Key Properties:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Prime: divisible only by 1 and itself</li>
                <li>• 2 is the only even prime number</li>
                <li>• All primes &gt; 2 are odd</li>
                <li>• Infinite number of primes (Euclid&apos;s theorem)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Applications:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• RSA cryptography</li>
                <li>• Hash functions</li>
                <li>• Random number generation</li>
                <li>• Error detection codes</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}