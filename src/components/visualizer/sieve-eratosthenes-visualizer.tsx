import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';
import { toast } from 'sonner';

export function SieveEratosthenesVisualizer() {
  const [n, setN] = useState(30);
  const [isAnimating, setIsAnimating] = useState(false);
  const [numbers, setNumbers] = useState<{value: number, isPrime: boolean, isMarked: boolean, isCurrent: boolean}[]>([]);
  const [currentPrime, setCurrentPrime] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState('');
  const [primes, setPrimes] = useState<number[]>([]);
  const [showMemory, setShowMemory] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  
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

  const initializeSieve = (limit: number) => {
    const nums = [];
    for (let i = 2; i <= limit; i++) {
      nums.push({
        value: i,
        isPrime: true,
        isMarked: false,
        isCurrent: false
      });
    }
    return nums;
  };

  const runSieve = useCallback(async () => {
    if (n < 2) {
      toast.error('Please enter a number >= 2');
      return;
    }

    if (n > 100) {
      toast.error('Please enter a number <= 100 for better visualization');
      return;
    }

    setIsAnimating(true);
    setCurrentStep('');
    setCurrentPrime(null);
    setPrimes([]);
    setStepCount(0);
    
    speakOperation("Sieve of Eratosthenes", `Starting Sieve of Eratosthenes to find all prime numbers up to ${n}. We'll systematically eliminate multiples of each prime.`);

    // Initialize array
    let nums = initializeSieve(n);
    setNumbers([...nums]);
    setCurrentStep(`Initialized array with numbers 2 to ${n}`);
    speakStep("", `Initialized array with numbers 2 to ${n}. We start with the assumption that all numbers are prime.`, 1, Math.floor(Math.sqrt(n)));
    await sleep(1000);

    const foundPrimes: number[] = [];
    let steps = 0;

    // Main sieve algorithm
    for (let i = 2; i * i <= n; i++) {
      steps++;
      
      // Find the number in our array
      const currentIndex = nums.findIndex(num => num.value === i);
      
      if (currentIndex !== -1 && nums[currentIndex].isPrime) {
        // Mark current prime
        setCurrentPrime(i);
        nums[currentIndex].isCurrent = true;
        setNumbers([...nums]);
        setCurrentStep(`Found prime ${i}. Now marking its multiples as composite.`);
        speakStep("", `Found prime ${i}. Now we'll mark all multiples of ${i} as composite numbers.`, steps, Math.floor(Math.sqrt(n)));
        await sleep(800);

        foundPrimes.push(i);
        setPrimes([...foundPrimes]);

        // Mark multiples as composite
        for (let j = i * i; j <= n; j += i) {
          const multipleIndex = nums.findIndex(num => num.value === j);
          if (multipleIndex !== -1 && nums[multipleIndex].isPrime) {
            nums[multipleIndex].isPrime = false;
            nums[multipleIndex].isMarked = true;
            setNumbers([...nums]);
            setCurrentStep(`Marking ${j} as composite (multiple of ${i})`);
            speakStep("", `Marking ${j} as composite since it's a multiple of ${i}.`, steps, Math.floor(Math.sqrt(n)));
            await sleep(400);
          }
        }

        // Clear current marking
        nums[currentIndex].isCurrent = false;
        setNumbers([...nums]);
        await sleep(600);
      }
    }

    // Collect remaining primes
    const remainingPrimes = nums.filter(num => num.isPrime && !foundPrimes.includes(num.value)).map(num => num.value);
    const allPrimes = [...foundPrimes, ...remainingPrimes].sort((a, b) => a - b);
    
    setPrimes(allPrimes);
    setCurrentPrime(null);
    setStepCount(steps);
    setCurrentStep(`Sieve complete! Found ${allPrimes.length} primes: ${allPrimes.join(', ')}`);
    speakResult(`Sieve of Eratosthenes completed! Found ${allPrimes.length} prime numbers up to ${n}: ${allPrimes.join(', ')}.`);
    
    toast.success(`Found ${allPrimes.length} primes`);
    setIsAnimating(false);
  }, [n, speakOperation, speakStep, speakResult]);

  const reset = () => {
    setNumbers([]);
    setPrimes([]);
    setCurrentPrime(null);
    setCurrentStep('');
    setStepCount(0);
    setIsAnimating(false);
  };

  const handleInputChange = (value: string) => {
    const num = parseInt(value);
    if (!isNaN(num)) {
      setN(num);
      reset();
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Sieve of Eratosthenes</h2>
        <p className="text-muted-foreground">
          Ancient algorithm to find all prime numbers up to a given limit
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Find primes up to:</span>
          <Input 
            className="w-24" 
            value={n} 
            onChange={e => handleInputChange(e.target.value)} 
            placeholder="N"
            disabled={isAnimating}
            type="number"
            min="2"
            max="100"
          />
        </div>
        <Button onClick={runSieve} disabled={isAnimating}>
          {isAnimating ? 'Running Sieve...' : 'Start Sieve'}
        </Button>
        <Button onClick={reset} variant="outline" disabled={isAnimating}>
          Reset
        </Button>
      </div>

      {/* Current Step Display */}
      {currentStep && (
        <div className="p-4 bg-muted/20 rounded-lg border">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Step</Badge>
            <span className="text-sm font-medium">{currentStep}</span>
          </div>
        </div>
      )}

      {/* Algorithm Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-2">Current Status:</h4>
          <div className="space-y-2 text-sm">
            <div><strong>Range:</strong> 2 to {n}</div>
            <div><strong>Current Prime:</strong> {currentPrime || 'None'}</div>
            <div><strong>Primes Found:</strong> {primes.length}</div>
            <div><strong>Steps Completed:</strong> {stepCount}</div>
          </div>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-2">Algorithm Complexity:</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div><strong>Time:</strong> O(n log log n)</div>
            <div><strong>Space:</strong> O(n)</div>
            <div><strong>Optimizations:</strong> Start marking from p²</div>
            <div><strong>Applications:</strong> Cryptography, number theory</div>
          </div>
        </div>
      </div>

      {/* Numbers Grid Visualization */}
      <div className="p-6 bg-gradient-visualization rounded-xl border-2 border-primary/20">
        <h4 className="text-lg font-semibold mb-4 text-center">Number Grid (2 to {n})</h4>
        
        {numbers.length > 0 ? (
          <div className="grid grid-cols-10 gap-2 max-w-4xl mx-auto">
            {numbers.map((num, index) => (
              <div
                key={index}
                className={`
                  w-12 h-12 border-2 rounded-lg flex items-center justify-center font-mono text-sm font-bold
                  transition-all duration-300 ${
                    num.isCurrent
                      ? 'bg-yellow-200 border-yellow-500 text-yellow-800 animate-pulse scale-110'
                      : num.isMarked
                        ? 'bg-red-100 border-red-500 text-red-800 line-through'
                        : num.isPrime
                          ? 'bg-green-100 border-green-500 text-green-800'
                          : 'bg-gray-100 border-gray-300 text-gray-500'
                  }
                `}
              >
                {num.value}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>Click "Start Sieve" to begin finding prime numbers</p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="bg-muted/20 rounded-lg p-4">
        <h4 className="font-semibold mb-3">Legend:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-100 border-2 border-green-500 rounded"></div>
            <span>Prime numbers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-100 border-2 border-red-500 rounded"></div>
            <span>Composite (marked)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-200 border-2 border-yellow-500 rounded"></div>
            <span>Current prime</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-100 border-2 border-gray-300 rounded"></div>
            <span>Not yet processed</span>
          </div>
        </div>
      </div>

      {/* Primes Found */}
      {primes.length > 0 && (
        <div className="p-4 bg-muted/20 rounded-lg border">
          <h4 className="font-semibold mb-3">Prime Numbers Found ({primes.length}):</h4>
          <div className="flex gap-2 flex-wrap">
            {primes.map((prime, index) => (
              <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                {prime}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* How It Works */}
      <div className="bg-card border rounded-lg p-4">
        <h4 className="font-semibold mb-2">How Sieve of Eratosthenes Works:</h4>
        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
          <li>Create a list of consecutive integers from 2 through n</li>
          <li>Start with the first number (2) in the list</li>
          <li>Mark all multiples of this number (except the number itself) as composite</li>
          <li>Find the next unmarked number and repeat the process</li>
          <li>Continue until you've processed all numbers up to √n</li>
          <li>All unmarked numbers are prime</li>
        </ol>
      </div>

      {/* Memory Layout */}
      {showMemory && (
        <MemoryLayout
          title="Sieve Array Memory Layout"
          data={primes.slice(0, 10)}
          baseAddress={0xE000}
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
