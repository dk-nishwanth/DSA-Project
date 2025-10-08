import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Calculator, Clock, Zap, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

interface ModularStep {
  step: number;
  operation: string;
  values: { [key: string]: number };
  description: string;
  clockPosition?: number;
  highlight?: string[];
}

export function ModularArithmeticVisualizer() {
  const [operation, setOperation] = useState('addition');
  const [inputA, setInputA] = useState(17);
  const [inputB, setInputB] = useState(23);
  const [modulus, setModulus] = useState(12);
  const [steps, setSteps] = useState<ModularStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<number | null>(null);
  const [showMemory, setShowMemory] = useState(false);
  const [showClock, setShowClock] = useState(true);

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

  const operations = [
    { value: 'addition', label: 'Modular Addition' },
    { value: 'subtraction', label: 'Modular Subtraction' },
    { value: 'multiplication', label: 'Modular Multiplication' },
    { value: 'exponentiation', label: 'Modular Exponentiation' },
    { value: 'inverse', label: 'Modular Inverse' },
    { value: 'linear-congruence', label: 'Linear Congruence' }
  ];

  const generateAdditionSteps = (a: number, b: number, m: number): ModularStep[] => {
    const steps: ModularStep[] = [];
    let stepNum = 0;

    steps.push({
      step: stepNum++,
      operation: 'Setup',
      values: { a, b, m },
      description: `Calculate (${a} + ${b}) mod ${m}`,
      highlight: ['a', 'b', 'm']
    });

    const sum = a + b;
    steps.push({
      step: stepNum++,
      operation: 'Addition',
      values: { a, b, sum },
      description: `${a} + ${b} = ${sum}`,
      highlight: ['sum']
    });

    const result = sum % m;
    const quotient = Math.floor(sum / m);
    
    steps.push({
      step: stepNum++,
      operation: 'Modulo',
      values: { sum, m, quotient, result },
      description: `${sum} = ${quotient} × ${m} + ${result}`,
      clockPosition: result,
      highlight: ['result']
    });

    steps.push({
      step: stepNum++,
      operation: 'Result',
      values: { result },
      description: `(${a} + ${b}) mod ${m} = ${result}`,
      clockPosition: result,
      highlight: ['result']
    });

    return steps;
  };

  const generateSubtractionSteps = (a: number, b: number, m: number): ModularStep[] => {
    const steps: ModularStep[] = [];
    let stepNum = 0;

    steps.push({
      step: stepNum++,
      operation: 'Setup',
      values: { a, b, m },
      description: `Calculate (${a} - ${b}) mod ${m}`,
      highlight: ['a', 'b', 'm']
    });

    const diff = a - b;
    steps.push({
      step: stepNum++,
      operation: 'Subtraction',
      values: { a, b, diff },
      description: `${a} - ${b} = ${diff}`,
      highlight: ['diff']
    });

    let result = diff % m;
    if (result < 0) {
      steps.push({
        step: stepNum++,
        operation: 'Negative Handling',
        values: { diff, m, result },
        description: `${diff} mod ${m} = ${result} (negative)`,
        highlight: ['result']
      });

      result = ((diff % m) + m) % m;
      steps.push({
        step: stepNum++,
        operation: 'Positive Equivalent',
        values: { result },
        description: `Add ${m}: ${diff} + ${m} = ${result}`,
        clockPosition: result,
        highlight: ['result']
      });
    } else {
      steps.push({
        step: stepNum++,
        operation: 'Modulo',
        values: { diff, m, result },
        description: `${diff} mod ${m} = ${result}`,
        clockPosition: result,
        highlight: ['result']
      });
    }

    steps.push({
      step: stepNum++,
      operation: 'Result',
      values: { result },
      description: `(${a} - ${b}) mod ${m} = ${result}`,
      clockPosition: result,
      highlight: ['result']
    });

    return steps;
  };

  const generateMultiplicationSteps = (a: number, b: number, m: number): ModularStep[] => {
    const steps: ModularStep[] = [];
    let stepNum = 0;

    steps.push({
      step: stepNum++,
      operation: 'Setup',
      values: { a, b, m },
      description: `Calculate (${a} × ${b}) mod ${m}`,
      highlight: ['a', 'b', 'm']
    });

    // Reduce inputs first
    const aReduced = a % m;
    const bReduced = b % m;
    
    if (a !== aReduced || b !== bReduced) {
      steps.push({
        step: stepNum++,
        operation: 'Reduce Inputs',
        values: { a, aReduced, b, bReduced, m },
        description: `${a} mod ${m} = ${aReduced}, ${b} mod ${m} = ${bReduced}`,
        highlight: ['aReduced', 'bReduced']
      });
    }

    const product = aReduced * bReduced;
    steps.push({
      step: stepNum++,
      operation: 'Multiplication',
      values: { aReduced, bReduced, product },
      description: `${aReduced} × ${bReduced} = ${product}`,
      highlight: ['product']
    });

    const result = product % m;
    const quotient = Math.floor(product / m);
    
    steps.push({
      step: stepNum++,
      operation: 'Modulo',
      values: { product, m, quotient, result },
      description: `${product} = ${quotient} × ${m} + ${result}`,
      clockPosition: result,
      highlight: ['result']
    });

    steps.push({
      step: stepNum++,
      operation: 'Result',
      values: { result },
      description: `(${a} × ${b}) mod ${m} = ${result}`,
      clockPosition: result,
      highlight: ['result']
    });

    return steps;
  };

  const generateExponentiationSteps = (base: number, exp: number, m: number): ModularStep[] => {
    const steps: ModularStep[] = [];
    let stepNum = 0;

    steps.push({
      step: stepNum++,
      operation: 'Setup',
      values: { base, exp, m },
      description: `Calculate ${base}^${exp} mod ${m} using fast exponentiation`,
      highlight: ['base', 'exp', 'm']
    });

    let result = 1;
    let currentBase = base % m;
    let currentExp = exp;

    steps.push({
      step: stepNum++,
      operation: 'Initialize',
      values: { result, currentBase, currentExp },
      description: `Initialize: result = 1, base = ${currentBase}, exp = ${currentExp}`,
      highlight: ['result', 'currentBase']
    });

    while (currentExp > 0) {
      if (currentExp % 2 === 1) {
        result = (result * currentBase) % m;
        steps.push({
          step: stepNum++,
          operation: 'Odd Exponent',
          values: { result, currentBase, currentExp },
          description: `Exponent is odd: result = (result × ${currentBase}) mod ${m} = ${result}`,
          clockPosition: result,
          highlight: ['result']
        });
      }

      currentBase = (currentBase * currentBase) % m;
      currentExp = Math.floor(currentExp / 2);

      if (currentExp > 0) {
        steps.push({
          step: stepNum++,
          operation: 'Square and Halve',
          values: { currentBase, currentExp },
          description: `Square base and halve exponent: base = ${currentBase}, exp = ${currentExp}`,
          highlight: ['currentBase', 'currentExp']
        });
      }
    }

    steps.push({
      step: stepNum++,
      operation: 'Result',
      values: { result },
      description: `${base}^${exp} mod ${m} = ${result}`,
      clockPosition: result,
      highlight: ['result']
    });

    return steps;
  };

  const generateInverseSteps = (a: number, m: number): ModularStep[] => {
    const steps: ModularStep[] = [];
    let stepNum = 0;

    // Check if inverse exists
    const gcdValue = gcd(a, m);
    if (gcdValue !== 1) {
      steps.push({
        step: stepNum++,
        operation: 'No Inverse',
        values: { a, m, gcd: gcdValue },
        description: `Modular inverse doesn't exist: gcd(${a}, ${m}) = ${gcdValue} ≠ 1`,
        highlight: ['gcd']
      });
      return steps;
    }

    steps.push({
      step: stepNum++,
      operation: 'Setup',
      values: { a, m },
      description: `Find modular inverse of ${a} mod ${m}`,
      highlight: ['a', 'm']
    });

    // Extended Euclidean Algorithm
    let oldR = a, r = m;
    let oldS = 1, s = 0;

    while (r !== 0) {
      const quotient = Math.floor(oldR / r);
      [oldR, r] = [r, oldR - quotient * r];
      [oldS, s] = [s, oldS - quotient * s];

      steps.push({
        step: stepNum++,
        operation: 'Extended GCD',
        values: { quotient, r: oldR, s: oldS },
        description: `Update: r = ${oldR}, s = ${oldS}`,
        highlight: ['s']
      });
    }

    const inverse = ((oldS % m) + m) % m;
    
    steps.push({
      step: stepNum++,
      operation: 'Result',
      values: { inverse },
      description: `Modular inverse of ${a} mod ${m} = ${inverse}`,
      clockPosition: inverse,
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

  const gcd = (a: number, b: number): number => {
    while (b !== 0) {
      [a, b] = [b, a % b];
    }
    return a;
  };

  const runOperation = () => {
    speakOperation('Modular Arithmetic', `Running ${operations.find(op=>op.value===operation)?.label || 'operation'}.`);
    
    let newSteps: ModularStep[] = [];
    let finalResult: number = 0;

    switch (operation) {
      case 'addition':
        newSteps = generateAdditionSteps(inputA, inputB, modulus);
        finalResult = (inputA + inputB) % modulus;
        break;
      case 'subtraction':
        newSteps = generateSubtractionSteps(inputA, inputB, modulus);
        finalResult = ((inputA - inputB) % modulus + modulus) % modulus;
        break;
      case 'multiplication':
        newSteps = generateMultiplicationSteps(inputA, inputB, modulus);
        finalResult = (inputA * inputB) % modulus;
        break;
      case 'exponentiation':
        newSteps = generateExponentiationSteps(inputA, inputB, modulus);
        finalResult = fastModularExponentiation(inputA, inputB, modulus);
        break;
      case 'inverse':
        newSteps = generateInverseSteps(inputA, modulus);
        finalResult = modularInverse(inputA, modulus);
        break;
      case 'linear-congruence':
        newSteps = [{
          step: 0,
          operation: 'Linear Congruence',
          values: { a: inputA, b: inputB, m: modulus },
          description: `Solve ${inputA}x ≡ ${inputB} (mod ${modulus}) - requires extended implementation`,
          highlight: ['a', 'b', 'm']
        }];
        finalResult = 0;
        break;
    }

    setSteps(newSteps);
    setResult(finalResult);
    setCurrentStep(0);
    speakResult(`Operation completed with result: ${finalResult}`);
  };

  const fastModularExponentiation = (base: number, exp: number, mod: number): number => {
    let result = 1;
    base = base % mod;
    while (exp > 0) {
      if (exp % 2 === 1) result = (result * base) % mod;
      exp = Math.floor(exp / 2);
      base = (base * base) % mod;
    }
    return result;
  };

  const modularInverse = (a: number, m: number): number => {
    if (gcd(a, m) !== 1) return -1;
    let oldR = a, r = m;
    let oldS = 1, s = 0;
    while (r !== 0) {
      const quotient = Math.floor(oldR / r);
      [oldR, r] = [r, oldR - quotient * r];
      [oldS, s] = [s, oldS - quotient * s];
    }
    return ((oldS % m) + m) % m;
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
  };

  const currentStepData = steps[currentStep];

  // Clock visualization component
  const ClockVisualization = ({ position, modulus }: { position?: number; modulus: number }) => {
    const radius = 80;
    const centerX = 100;
    const centerY = 100;

    return (
      <svg width="200" height="200" className="mx-auto">
        {/* Clock circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        
        {/* Clock numbers */}
        {Array.from({ length: modulus }, (_, i) => {
          const angle = (i * 2 * Math.PI) / modulus - Math.PI / 2;
          const x = centerX + (radius - 20) * Math.cos(angle);
          const y = centerY + (radius - 20) * Math.sin(angle);
          
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className={`text-sm font-bold ${position === i ? 'fill-red-500' : 'fill-current'}`}
            >
              {i}
            </text>
          );
        })}
        
        {/* Position indicator */}
        {position !== undefined && (
          <motion.g
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <circle
              cx={centerX + (radius - 20) * Math.cos((position * 2 * Math.PI) / modulus - Math.PI / 2)}
              cy={centerY + (radius - 20) * Math.sin((position * 2 * Math.PI) / modulus - Math.PI / 2)}
              r="8"
              fill="red"
              stroke="white"
              strokeWidth="2"
            />
          </motion.g>
        )}
        
        {/* Center dot */}
        <circle cx={centerX} cy={centerY} r="3" fill="currentColor" />
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Operation</label>
          <Select value={operation} onValueChange={setOperation}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {operations.map(op => (
                <SelectItem key={op.value} value={op.value}>
                  {op.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            {operation === 'inverse' ? 'Number' : operation === 'exponentiation' ? 'Base' : 'First Number'}
          </label>
          <Input
            type="number"
            value={inputA}
            onChange={(e) => setInputA(parseInt(e.target.value) || 0)}
          />
        </div>

        {!['inverse'].includes(operation) && (
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {operation === 'exponentiation' ? 'Exponent' : 'Second Number'}
            </label>
            <Input
              type="number"
              value={inputB}
              onChange={(e) => setInputB(parseInt(e.target.value) || 0)}
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Modulus</label>
          <Input
            type="number"
            min="2"
            max="24"
            value={modulus}
            onChange={(e) => setModulus(parseInt(e.target.value) || 12)}
          />
        </div>

        <div className="flex gap-2 items-end">
          <Button onClick={runOperation} className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Run
          </Button>
          <Button onClick={reset} variant="outline">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Clock Visualization */}
      {showClock && modulus <= 24 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Modular Clock (mod {modulus})
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowClock(!showClock)}
              >
                Toggle
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ClockVisualization 
              position={currentStepData?.clockPosition} 
              modulus={modulus} 
            />
            <p className="text-center text-sm text-muted-foreground mt-2">
              Numbers wrap around at {modulus}, like hours on a clock
            </p>
          </CardContent>
        </Card>
      )}

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
                  <Zap className="h-5 w-5 text-blue-500" />
                  {currentStepData.operation}
                  <Badge variant="outline">Step {currentStep + 1}</Badge>
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
      {result !== null && result >= 0 && (
        <Card className="border-2 border-green-500">
          <CardHeader>
            <CardTitle className="text-green-700 dark:text-green-300">Final Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{result}</div>
              <p className="text-sm text-muted-foreground mt-2">
                Result of {operations.find(op => op.value === operation)?.label}
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
          title="Modular Arithmetic Memory"
          data={steps.slice(0, currentStep + 1).map((step, i) => 
            step.clockPosition !== undefined ? step.clockPosition : i
          )}
          baseAddress={0xA000}
          wordSize={4}
        />
      )}

      {/* Educational Information */}
      <Card>
        <CardHeader>
          <CardTitle>Modular Arithmetic Concepts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Key Properties:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• (a + b) mod m = ((a mod m) + (b mod m)) mod m</li>
                <li>• (a × b) mod m = ((a mod m) × (b mod m)) mod m</li>
                <li>• Numbers "wrap around" at the modulus</li>
                <li>• Negative results need adjustment: ((a mod m) + m) mod m</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Applications:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Cryptography (RSA, ECC)</li>
                <li>• Hash functions</li>
                <li>• Random number generation</li>
                <li>• Computer graphics (wrapping coordinates)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}