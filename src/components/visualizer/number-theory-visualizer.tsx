import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, RotateCcw, Zap, Target, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

interface NumberTheoryStep {
  step: number;
  operation: string;
  values: { [key: string]: number };
  description: string;
  highlight?: string[];
}

export function NumberTheoryVisualizer() {
  const [algorithm, setAlgorithm] = useState('gcd');
  const [inputA, setInputA] = useState(48);
  const [inputB, setInputB] = useState(18);
  const [steps, setSteps] = useState<NumberTheoryStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<number | null>(null);
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
  } = useVisualizerVoice({ minInterval: 2000 });

  const algorithms = [
    { value: 'gcd', label: 'GCD (Euclidean Algorithm)' },
    { value: 'lcm', label: 'LCM Calculation' },
    { value: 'extended-gcd', label: 'Extended Euclidean Algorithm' },
    { value: 'bezout', label: 'Bézout Coefficients' },
    { value: 'modular-inverse', label: 'Modular Inverse' },
    { value: 'chinese-remainder', label: 'Chinese Remainder Theorem (Demo)' }
  ];

  const generateGCDSteps = (a: number, b: number): NumberTheoryStep[] => {
    const steps: NumberTheoryStep[] = [];
    let stepNum = 0;
    let originalA = a, originalB = b;
    
    steps.push({
      step: stepNum++,
      operation: 'Initialize',
      values: { a, b },
      description: `Find GCD(${a}, ${b}) using Euclidean Algorithm`,
      highlight: ['a', 'b']
    });

    while (b !== 0) {
      const quotient = Math.floor(a / b);
      const remainder = a % b;
      
      steps.push({
        step: stepNum++,
        operation: 'Division',
        values: { a, b, quotient, remainder },
        description: `${a} = ${quotient} × ${b} + ${remainder}`,
        highlight: ['remainder']
      });

      a = b;
      b = remainder;
      
      if (b !== 0) {
        steps.push({
          step: stepNum++,
          operation: 'Update',
          values: { a, b },
          description: `Continue with GCD(${a}, ${b})`,
          highlight: ['a', 'b']
        });
      }
    }

    steps.push({
      step: stepNum++,
      operation: 'Result',
      values: { gcd: a },
      description: `GCD(${originalA}, ${originalB}) = ${a}`,
      highlight: ['gcd']
    });

    return steps;
  };

  const generateExtendedGCDSteps = (a: number, b: number): NumberTheoryStep[] => {
    const steps: NumberTheoryStep[] = [];
    let stepNum = 0;
    let originalA = a, originalB = b;
    
    // Extended Euclidean Algorithm
    let oldR = a, r = b;
    let oldS = 1, s = 0;
    let oldT = 0, t = 1;
    
    steps.push({
      step: stepNum++,
      operation: 'Initialize',
      values: { a, b, s: oldS, t: oldT },
      description: `Extended GCD: Find x, y such that ${a}x + ${b}y = gcd(${a}, ${b})`,
      highlight: ['a', 'b']
    });

    while (r !== 0) {
      const quotient = Math.floor(oldR / r);
      
      steps.push({
        step: stepNum++,
        operation: 'Division',
        values: { oldR, r, quotient },
        description: `${oldR} = ${quotient} × ${r} + ${oldR % r}`,
        highlight: ['quotient']
      });

      [oldR, r] = [r, oldR - quotient * r];
      [oldS, s] = [s, oldS - quotient * s];
      [oldT, t] = [t, oldT - quotient * t];
      
      if (r !== 0) {
        steps.push({
          step: stepNum++,
          operation: 'Update',
          values: { r: oldR, s: oldS, t: oldT },
          description: `Update coefficients: s=${oldS}, t=${oldT}`,
          highlight: ['s', 't']
        });
      }
    }

    steps.push({
      step: stepNum++,
      operation: 'Result',
      values: { gcd: oldR, x: oldS, y: oldT },
      description: `${originalA} × ${oldS} + ${originalB} × ${oldT} = ${oldR}`,
      highlight: ['gcd', 'x', 'y']
    });

    return steps;
  };

  const generateLCMSteps = (a: number, b: number): NumberTheoryStep[] => {
    const steps: NumberTheoryStep[] = [];
    let stepNum = 0;
    
    // First find GCD
    const gcdValue = gcd(a, b);
    
    steps.push({
      step: stepNum++,
      operation: 'GCD',
      values: { a, b, gcd: gcdValue },
      description: `First find GCD(${a}, ${b}) = ${gcdValue}`,
      highlight: ['gcd']
    });

    const lcmValue = (a * b) / gcdValue;
    
    steps.push({
      step: stepNum++,
      operation: 'LCM Formula',
      values: { a, b, gcd: gcdValue, product: a * b },
      description: `LCM = (a × b) / GCD = (${a} × ${b}) / ${gcdValue}`,
      highlight: ['product']
    });

    steps.push({
      step: stepNum++,
      operation: 'Result',
      values: { lcm: lcmValue },
      description: `LCM(${a}, ${b}) = ${lcmValue}`,
      highlight: ['lcm']
    });

    return steps;
  };

  const generateModularInverseSteps = (a: number, m: number): NumberTheoryStep[] => {
    const steps: NumberTheoryStep[] = [];
    let stepNum = 0;
    
    if (gcd(a, m) !== 1) {
      steps.push({
        step: stepNum++,
        operation: 'Error',
        values: { a, m, gcd: gcd(a, m) },
        description: `Modular inverse doesn't exist: GCD(${a}, ${m}) = ${gcd(a, m)} ≠ 1`,
        highlight: ['gcd']
      });
      return steps;
    }

    // Use Extended Euclidean Algorithm
    let oldR = a, r = m;
    let oldS = 1, s = 0;
    
    steps.push({
      step: stepNum++,
      operation: 'Initialize',
      values: { a, m },
      description: `Find modular inverse of ${a} mod ${m}`,
      highlight: ['a', 'm']
    });

    while (r !== 0) {
      const quotient = Math.floor(oldR / r);
      [oldR, r] = [r, oldR - quotient * r];
      [oldS, s] = [s, oldS - quotient * s];
      
      steps.push({
        step: stepNum++,
        operation: 'Extended GCD Step',
        values: { quotient, r: oldR, s: oldS },
        description: `Update: r=${oldR}, s=${oldS}`,
        highlight: ['s']
      });
    }

    const inverse = ((oldS % m) + m) % m;
    
    steps.push({
      step: stepNum++,
      operation: 'Result',
      values: { inverse },
      description: `Modular inverse of ${a} mod ${m} = ${inverse}`,
      highlight: ['inverse']
    });

    steps.push({
      step: stepNum++,
      operation: 'Verification',
      values: { a, inverse, m, product: (a * inverse) % m },
      description: `Verify: ${a} × ${inverse} ≡ ${(a * inverse) % m} (mod ${m})`,
      highlight: ['product']
    });

    return steps;
  };

  // Helper functions
  const gcd = (a: number, b: number): number => {
    while (b !== 0) {
      [a, b] = [b, a % b];
    }
    return a;
  };

  const runAlgorithm = () => {
    setIsAnimating(true);
    speakOperation('Number Theory Visualizer', `Running ${algorithms.find(a=>a.value===algorithm)?.label || 'algorithm'}.`);
    
    let newSteps: NumberTheoryStep[] = [];
    let finalResult: number = 0;

    switch (algorithm) {
      case 'gcd':
        newSteps = generateGCDSteps(inputA, inputB);
        finalResult = gcd(inputA, inputB);
        break;
      case 'lcm':
        newSteps = generateLCMSteps(inputA, inputB);
        finalResult = (inputA * inputB) / gcd(inputA, inputB);
        break;
      case 'extended-gcd':
        newSteps = generateExtendedGCDSteps(inputA, inputB);
        finalResult = gcd(inputA, inputB);
        break;
      case 'bezout':
        newSteps = generateExtendedGCDSteps(inputA, inputB);
        finalResult = gcd(inputA, inputB);
        break;
      case 'modular-inverse':
        newSteps = generateModularInverseSteps(inputA, inputB);
        finalResult = inputA; // Placeholder
        break;
      case 'chinese-remainder':
        // Simplified demo
        newSteps = [{
          step: 0,
          operation: 'Demo',
          values: { a: inputA, b: inputB },
          description: 'Chinese Remainder Theorem demo - requires multiple congruences',
          highlight: ['a', 'b']
        }];
        finalResult = 0;
        break;
    }

    setSteps(newSteps);
    setResult(finalResult);
    setCurrentStep(0);
    
    setTimeout(() => setIsAnimating(false), 1000);
    speakResult(`Algorithm completed with result: ${finalResult}`);
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
    setResult(null);
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

        <div className="space-y-2">
          <label className="text-sm font-medium">
            {algorithm === 'modular-inverse' ? 'Number (a)' : 'First Number'}
          </label>
          <Input
            type="number"
            value={inputA}
            onChange={(e) => setInputA(parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            {algorithm === 'modular-inverse' ? 'Modulus (m)' : 'Second Number'}
          </label>
          <Input
            type="number"
            value={inputB}
            onChange={(e) => setInputB(parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="flex gap-2 items-end">
          <Button onClick={runAlgorithm} className="flex items-center gap-2" disabled={isAnimating}>
            <Calculator className="h-4 w-4" />
            {isAnimating ? 'Running...' : 'Run'}
          </Button>
          <Button onClick={reset} variant="outline">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Algorithm Description */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {algorithms.find(a => a.value === algorithm)?.label}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            {algorithm === 'gcd' && (
              <p>The Euclidean Algorithm finds the greatest common divisor by repeatedly applying: GCD(a,b) = GCD(b, a mod b)</p>
            )}
            {algorithm === 'lcm' && (
              <p>Least Common Multiple using the relationship: LCM(a,b) = (a × b) / GCD(a,b)</p>
            )}
            {algorithm === 'extended-gcd' && (
              <p>Extended Euclidean Algorithm finds coefficients x, y such that ax + by = GCD(a,b)</p>
            )}
            {algorithm === 'bezout' && (
              <p>Bézout's Identity: For any integers a, b, there exist integers x, y such that ax + by = GCD(a,b)</p>
            )}
            {algorithm === 'modular-inverse' && (
              <p>Find the modular multiplicative inverse of a modulo m, where a × inverse ≡ 1 (mod m)</p>
            )}
            {algorithm === 'chinese-remainder' && (
              <p>Chinese Remainder Theorem solves systems of simultaneous congruences</p>
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

      {/* Current Step Visualization */}
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
                  <Zap className="h-5 w-5 text-blue-500" />
                  {currentStepData.operation}
                  <ArrowRight className="h-4 w-4" />
                  Step {currentStep + 1}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Description:</h4>
                  <p className="bg-muted p-3 rounded">{currentStepData.description}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Values:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(currentStepData.values).map(([key, value]) => {
                      const isHighlighted = currentStepData.highlight?.includes(key);
                      return (
                        <motion.div
                          key={key}
                          className={`p-4 rounded-lg border-2 text-center ${
                            isHighlighted 
                              ? 'bg-yellow-100 border-yellow-400 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
                              : 'bg-white border-gray-200 text-gray-800 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200'
                          }`}
                          initial={{ scale: 1 }}
                          animate={{ scale: isHighlighted ? 1.05 : 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="text-sm font-medium text-muted-foreground mb-1">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </div>
                          <div className="text-xl font-bold">{value}</div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Final Result */}
      {result !== null && (
        <Card className="border-2 border-green-500">
          <CardHeader>
            <CardTitle className="text-green-700 dark:text-green-300">Final Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{result}</div>
              <p className="text-sm text-muted-foreground mt-2">
                {algorithm === 'gcd' && `Greatest Common Divisor of ${inputA} and ${inputB}`}
                {algorithm === 'lcm' && `Least Common Multiple of ${inputA} and ${inputB}`}
                {algorithm === 'extended-gcd' && `GCD with Bézout coefficients`}
                {algorithm === 'bezout' && `Bézout coefficients found`}
                {algorithm === 'modular-inverse' && `Modular inverse computed`}
              </p>
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
          title="Number Theory Memory"
          data={steps.slice(0, currentStep + 1).map((step, i) => 
            Object.values(step.values)[0] || i
          )}
          baseAddress={0x8000}
          wordSize={4}
        />
      )}

      {/* Educational Information */}
      <Card>
        <CardHeader>
          <CardTitle>Number Theory Fundamentals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Key Concepts:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• GCD: Largest number dividing both inputs</li>
                <li>• LCM: Smallest number divisible by both inputs</li>
                <li>• Extended GCD: Finds Bézout coefficients</li>
                <li>• Modular Inverse: a⁻¹ such that a × a⁻¹ ≡ 1 (mod m)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Applications:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Cryptography (RSA, ECC)</li>
                <li>• Fraction simplification</li>
                <li>• Solving Diophantine equations</li>
                <li>• Hash functions and data structures</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}