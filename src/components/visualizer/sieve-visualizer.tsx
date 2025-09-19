import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PseudocodeBox } from '@/components/pseudocode-box';
import { ComplexityBox } from '@/components/complexity-box';

export function SieveVisualizer() {
  const [nInput, setNInput] = useState('50');
  const [marked, setMarked] = useState<boolean[]>([]);
  const [curP, setCurP] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentStepDescription, setCurrentStepDescription] = useState('');
  const [highlightIdx, setHighlightIdx] = useState<number | null>(null);

  const sleep = (ms:number)=>new Promise(r=>setTimeout(r,ms));

  const pseudocode = [
    'function sieve(n):',            // 1
    '  isPrime[0] = isPrime[1] = false', // 2
    '  for p from 2 to floor(sqrt(n)):', // 3
    '    if isPrime[p] == true:',     // 4
    '      for m from p*p to n step p:', // 5
    '        isPrime[m] = false'      // 6
  ];

  const run = useCallback(async ()=>{
    if (isRunning) return; setIsRunning(true);
    const n = Math.max(2, Math.min(1000, parseInt(nInput)||50));
    const isPrime = Array(n+1).fill(true);
    setCurrentStep(1);
    setCurrentStepDescription('Initialize array isPrime[0..n] = true; mark 0 and 1 as not prime');
    isPrime[0]=isPrime[1]=false;
    setMarked([...isPrime]);
    await sleep(200);
    setCurrentStep(3);
    setCurrentStepDescription('Iterate p from 2 to floor(sqrt(n))');
    for (let p=2; p*p<=n; p++){
      if (isPrime[p]){
        setCurP(p);
        setCurrentStep(4);
        setCurrentStepDescription(`p = ${p} is prime. Cross out multiples starting at p*p = ${p*p}`);
        await sleep(200);
        setCurrentStep(5);
        for (let m=p*p; m<=n; m+=p){
          if (isPrime[m]) {
            isPrime[m]=false;
            setHighlightIdx(m);
            setMarked([...isPrime]);
            await sleep(60);
            setHighlightIdx(null);
          }
        }
      }
      await sleep(120);
    }
    setCurP(null);
    setCurrentStep(0);
    setCurrentStepDescription('Sieve complete. Remaining true entries are primes.');
    setIsRunning(false);
  }, [nInput, isRunning]);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2 p-4 bg-muted/30 rounded-xl border flex-wrap">
        <div className="flex items-center gap-2"><span className="text-sm">n</span><Input className="w-24" value={nInput} onChange={e=>setNInput(e.target.value)} /></div>
        <Button onClick={run} disabled={isRunning}>Run Sieve</Button>
      </div>
      <div className="p-4 bg-card rounded-xl border">
        <div className="grid grid-cols-10 gap-2">
          {marked.map((v, i)=> {
            const isPrime = i>1 && v;
            const isBase = i===curP;
            const isCrossing = highlightIdx===i && !v;
            return (
              <div
                key={i}
                className={`px-2 py-1 border rounded text-center text-xs font-mono transition-all duration-200
                  ${isBase ? 'bg-warning/30 border-warning' : ''}
                  ${isPrime ? 'bg-success/20 border-success' : ''}
                  ${!isPrime && i>1 ? 'bg-muted/30 text-muted-foreground' : ''}
                  ${isCrossing ? 'bg-destructive/20 border-destructive scale-105' : ''}
                `}
                title={isBase ? `Base prime p=${i}` : isPrime ? 'Prime' : i<=1 ? '' : 'Composite'}
              >{i}</div>
            );
          })}
        </div>
        {currentStepDescription && (
          <div className="mt-4 p-3 bg-muted/20 rounded-lg text-center text-sm">
            {currentStepDescription}
          </div>
        )}
      </div>
      <PseudocodeBox title="Sieve of Eratosthenes - Pseudocode" code={pseudocode} highlightedLine={currentStep} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ComplexityBox
          title="Time Complexity"
          timeComplexity="O(n log log n)"
          spaceComplexity="O(n)"
          description="Cross out multiples of each prime up to √n; remaining true entries are primes."
        />
        <div className="bg-muted/20 rounded-lg p-4 text-sm">
          <div className="font-semibold mb-2">Key Properties</div>
          <ul className="space-y-1">
            <li>• Start marking from p², since smaller multiples are already handled by smaller primes.</li>
            <li>• Efficiently finds all primes ≤ n in near-linear time.</li>
            <li>• isPrime[i] remains true exactly for primes after the sieve completes.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
