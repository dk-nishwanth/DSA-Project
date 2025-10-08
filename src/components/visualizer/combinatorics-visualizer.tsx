import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RotateCcw, Calculator, Shuffle, Target, Grid, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

interface CombinatoricsStep {
  step: number;
  operation: string;
  values: { [key: string]: number };
  description: string;
  formula?: string;
  visualization?: string[];
}

export function CombinatoricsVisualizer() {
  const [operation, setOperation] = useState('permutation');
  const [inputN, setInputN] = useState(5);
  const [inputR, setInputR] = useState(3);
  const [steps, setSteps] = useState<CombinatoricsStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<number | null>(null);
  const [showMemory, setShowMemory] = useState(false);
  const [visualizations, setVisualizations] = useState<string[]>([]);

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
    { value: 'permutation', label: 'Permutations P(n,r)' },
    { value: 'combination', label: 'Combinations C(n,r)' },
    { value: 'factorial', label: 'Factorial n!' },
    { value: 'derangement', label: 'Derangements' },
    { value: 'catalan', label: 'Catalan Numbers' },
    { value: 'stirling', label: 'Stirling Numbers (Demo)' },
    { value: 'binomial', label: 'Binomial Coefficients' },
    { value: 'fibonacci-counting', label: 'Fibonacci Counting' }
  ];

  const factorial = (n: number): number => {
    if (n <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const permutation = (n: number, r: number): number => {
    if (r > n) return 0;
    return factorial(n) / factorial(n - r);
  };

  const combination = (n: number, r: number): number => {
    if (r > n) return 0;
    return factorial(n) / (factorial(r) * factorial(n - r));
  };

  const generatePermutationSteps = (n: number, r: number): CombinatoricsStep[] => {
    const steps: CombinatoricsStep[] = [];
    let stepNum = 0;

    steps.push({
      step: stepNum++,
      operation: 'Setup',
      values: { n, r },
      description: `Calculate P(${n}, ${r}) - permutations of ${r} items from ${n} items`,
      formula: `P(n,r) = n! / (n-r)!`
    });

    if (r > n) {
      steps.push({
        step: stepNum++,
        operation: 'Invalid',
        values: { n, r, result: 0 },
        description: `Cannot choose ${r} items from ${n} items`,
      });
      return steps;
    }

    const nFactorial = factorial(n);
    steps.push({
      step: stepNum++,
      operation: 'Calculate n!',
      values: { n, nFactorial },
      description: `${n}! = ${Array.from({length: n}, (_, i) => i + 1).join(' × ')} = ${nFactorial}`,
      formula: `${n}! = ${nFactorial}`
    });

    const nMinusR = n - r;
    const nMinusRFactorial = factorial(nMinusR);
    steps.push({
      step: stepNum++,
      operation: 'Calculate (n-r)!',
      values: { nMinusR, nMinusRFactorial },
      description: `(${n}-${r})! = ${nMinusR}! = ${nMinusRFactorial}`,
      formula: `${nMinusR}! = ${nMinusRFactorial}`
    });

    const result = nFactorial / nMinusRFactorial;
    steps.push({
      step: stepNum++,
      operation: 'Final Calculation',
      values: { nFactorial, nMinusRFactorial, result },
      description: `P(${n}, ${r}) = ${nFactorial} / ${nMinusRFactorial} = ${result}`,
      formula: `P(${n},${r}) = ${result}`
    });

    // Generate some example permutations for small values
    if (n <= 4 && r <= 3) {
      const examples = generatePermutationExamples(n, r);
      steps.push({
        step: stepNum++,
        operation: 'Examples',
        values: { count: examples.length },
        description: `Example permutations: ${examples.slice(0, 6).join(', ')}${examples.length > 6 ? '...' : ''}`,
        visualization: examples
      });
    }

    return steps;
  };

  const generateCombinationSteps = (n: number, r: number): CombinatoricsStep[] => {
    const steps: CombinatoricsStep[] = [];
    let stepNum = 0;

    steps.push({
      step: stepNum++,
      operation: 'Setup',
      values: { n, r },
      description: `Calculate C(${n}, ${r}) - combinations of ${r} items from ${n} items`,
      formula: `C(n,r) = n! / (r! × (n-r)!)`
    });

    if (r > n) {
      steps.push({
        step: stepNum++,
        operation: 'Invalid',
        values: { n, r, result: 0 },
        description: `Cannot choose ${r} items from ${n} items`,
      });
      return steps;
    }

    const nFactorial = factorial(n);
    steps.push({
      step: stepNum++,
      operation: 'Calculate n!',
      values: { n, nFactorial },
      description: `${n}! = ${nFactorial}`,
      formula: `${n}! = ${nFactorial}`
    });

    const rFactorial = factorial(r);
    steps.push({
      step: stepNum++,
      operation: 'Calculate r!',
      values: { r, rFactorial },
      description: `${r}! = ${rFactorial}`,
      formula: `${r}! = ${rFactorial}`
    });

    const nMinusR = n - r;
    const nMinusRFactorial = factorial(nMinusR);
    steps.push({
      step: stepNum++,
      operation: 'Calculate (n-r)!',
      values: { nMinusR, nMinusRFactorial },
      description: `(${n}-${r})! = ${nMinusR}! = ${nMinusRFactorial}`,
      formula: `${nMinusR}! = ${nMinusRFactorial}`
    });

    const denominator = rFactorial * nMinusRFactorial;
    const result = nFactorial / denominator;
    steps.push({
      step: stepNum++,
      operation: 'Final Calculation',
      values: { nFactorial, denominator, result },
      description: `C(${n}, ${r}) = ${nFactorial} / (${rFactorial} × ${nMinusRFactorial}) = ${nFactorial} / ${denominator} = ${result}`,
      formula: `C(${n},${r}) = ${result}`
    });

    // Generate some example combinations for small values
    if (n <= 6 && r <= 4) {
      const examples = generateCombinationExamples(n, r);
      steps.push({
        step: stepNum++,
        operation: 'Examples',
        values: { count: examples.length },
        description: `Example combinations: ${examples.slice(0, 8).join(', ')}${examples.length > 8 ? '...' : ''}`,
        visualization: examples
      });
    }

    return steps;
  };

  const generateFactorialSteps = (n: number): CombinatoricsStep[] => {
    const steps: CombinatoricsStep[] = [];
    let stepNum = 0;

    steps.push({
      step: stepNum++,
      operation: 'Setup',
      values: { n },
      description: `Calculate ${n}! (factorial of ${n})`,
      formula: `n! = n × (n-1) × ... × 2 × 1`
    });

    if (n === 0) {
      steps.push({
        step: stepNum++,
        operation: 'Base Case',
        values: { n: 0, result: 1 },
        description: `0! = 1 (by definition)`,
        formula: `0! = 1`
      });
      return steps;
    }

    let result = 1;
    const calculations = [];
    
    for (let i = 1; i <= n; i++) {
      result *= i;
      calculations.push(`${i}`);
      
      steps.push({
        step: stepNum++,
        operation: `Multiply by ${i}`,
        values: { i, result },
        description: `${calculations.join(' × ')} = ${result}`,
        formula: `${calculations.join(' × ')} = ${result}`
      });
    }

    steps.push({
      step: stepNum++,
      operation: 'Final Result',
      values: { n, result },
      description: `${n}! = ${result}`,
      formula: `${n}! = ${result}`
    });

    return steps;
  };

  const generateCatalanSteps = (n: number): CombinatoricsStep[] => {
    const steps: CombinatoricsStep[] = [];
    let stepNum = 0;

    steps.push({
      step: stepNum++,
      operation: 'Setup',
      values: { n },
      description: `Calculate ${n}th Catalan number`,
      formula: `C_n = (2n)! / ((n+1)! × n!)`
    });

    const twoN = 2 * n;
    const twoNFactorial = factorial(twoN);
    steps.push({
      step: stepNum++,
      operation: 'Calculate (2n)!',
      values: { twoN, twoNFactorial },
      description: `(2×${n})! = ${twoN}! = ${twoNFactorial}`,
      formula: `${twoN}! = ${twoNFactorial}`
    });

    const nPlusOne = n + 1;
    const nPlusOneFactorial = factorial(nPlusOne);
    steps.push({
      step: stepNum++,
      operation: 'Calculate (n+1)!',
      values: { nPlusOne, nPlusOneFactorial },
      description: `(${n}+1)! = ${nPlusOne}! = ${nPlusOneFactorial}`,
      formula: `${nPlusOne}! = ${nPlusOneFactorial}`
    });

    const nFactorial = factorial(n);
    steps.push({
      step: stepNum++,
      operation: 'Calculate n!',
      values: { n, nFactorial },
      description: `${n}! = ${nFactorial}`,
      formula: `${n}! = ${nFactorial}`
    });

    const denominator = nPlusOneFactorial * nFactorial;
    const result = twoNFactorial / denominator;
    steps.push({
      step: stepNum++,
      operation: 'Final Calculation',
      values: { twoNFactorial, denominator, result },
      description: `C_${n} = ${twoNFactorial} / (${nPlusOneFactorial} × ${nFactorial}) = ${result}`,
      formula: `C_${n} = ${result}`
    });

    return steps;
  };

  const generatePermutationExamples = (n: number, r: number): string[] => {
    if (n > 4 || r > 3) return [];
    
    const items = Array.from({length: n}, (_, i) => String.fromCharCode(65 + i)); // A, B, C, D...
    const permutations: string[] = [];
    
    const generatePerms = (arr: string[], chosen: string[]) => {
      if (chosen.length === r) {
        permutations.push(chosen.join(''));
        return;
      }
      
      for (let i = 0; i < arr.length; i++) {
        const remaining = arr.filter((_, idx) => idx !== i);
        generatePerms(remaining, [...chosen, arr[i]]);
      }
    };
    
    generatePerms(items, []);
    return permutations;
  };

  const generateCombinationExamples = (n: number, r: number): string[] => {
    if (n > 6 || r > 4) return [];
    
    const items = Array.from({length: n}, (_, i) => String.fromCharCode(65 + i));
    const combinations: string[] = [];
    
    const generateCombs = (start: number, chosen: string[]) => {
      if (chosen.length === r) {
        combinations.push(chosen.join(''));
        return;
      }
      
      for (let i = start; i < items.length; i++) {
        generateCombs(i + 1, [...chosen, items[i]]);
      }
    };
    
    generateCombs(0, []);
    return combinations;
  };

  const runOperation = () => {
    speakOperation('Combinatorics', `Running ${operations.find(op=>op.value===operation)?.label || 'operation'}.`);
    
    let newSteps: CombinatoricsStep[] = [];
    let finalResult: number = 0;

    switch (operation) {
      case 'permutation':
        newSteps = generatePermutationSteps(inputN, inputR);
        finalResult = permutation(inputN, inputR);
        break;
      case 'combination':
        newSteps = generateCombinationSteps(inputN, inputR);
        finalResult = combination(inputN, inputR);
        break;
      case 'factorial':
        newSteps = generateFactorialSteps(inputN);
        finalResult = factorial(inputN);
        break;
      case 'catalan':
        newSteps = generateCatalanSteps(inputN);
        finalResult = factorial(2 * inputN) / (factorial(inputN + 1) * factorial(inputN));
        break;
      case 'derangement':
        // Simplified derangement calculation
        finalResult = Math.round(factorial(inputN) / Math.E);
        newSteps = [{
          step: 0,
          operation: 'Derangement',
          values: { n: inputN, result: finalResult },
          description: `Derangements of ${inputN} items ≈ ${inputN}!/e ≈ ${finalResult}`,
          formula: `D_n ≈ n!/e`
        }];
        break;
      case 'binomial':
        newSteps = generateCombinationSteps(inputN, inputR);
        finalResult = combination(inputN, inputR);
        break;
      case 'stirling':
        newSteps = [{
          step: 0,
          operation: 'Stirling Numbers',
          values: { n: inputN, r: inputR },
          description: `Stirling numbers S(${inputN}, ${inputR}) - requires complex recurrence relation`,
          formula: `S(n,k) = k×S(n-1,k) + S(n-1,k-1)`
        }];
        finalResult = 0;
        break;
      case 'fibonacci-counting':
        // Fibonacci as counting problem
        let a = 0, b = 1;
        for (let i = 2; i <= inputN; i++) {
          [a, b] = [b, a + b];
        }
        finalResult = inputN <= 1 ? inputN : b;
        newSteps = [{
          step: 0,
          operation: 'Fibonacci Counting',
          values: { n: inputN, result: finalResult },
          description: `F(${inputN}) = ${finalResult} - counts ways to tile 1×${inputN} board with 1×1 and 1×2 tiles`,
          formula: `F(n) = F(n-1) + F(n-2)`
        }];
        break;
    }

    setSteps(newSteps);
    setResult(finalResult);
    setCurrentStep(0);
    
    // Set visualizations from the last step that has them
    const lastStepWithViz = newSteps.reverse().find(step => step.visualization);
    if (lastStepWithViz) {
      setVisualizations(lastStepWithViz.visualization || []);
    } else {
      setVisualizations([]);
    }
    newSteps.reverse(); // Restore original order
    
    speakResult(`Operation completed with result: ${finalResult}`);
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
    setVisualizations([]);
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            {['factorial', 'catalan', 'derangement', 'fibonacci-counting'].includes(operation) ? 'n' : 'n (total items)'}
          </label>
          <Input
            type="number"
            min="0"
            max="10"
            value={inputN}
            onChange={(e) => setInputN(parseInt(e.target.value) || 0)}
          />
        </div>

        {!['factorial', 'catalan', 'derangement', 'fibonacci-counting'].includes(operation) && (
          <div className="space-y-2">
            <label className="text-sm font-medium">r (chosen items)</label>
            <Input
              type="number"
              min="0"
              max="10"
              value={inputR}
              onChange={(e) => setInputR(parseInt(e.target.value) || 0)}
            />
          </div>
        )}

        <div className="flex gap-2 items-end">
          <Button onClick={runOperation} className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Calculate
          </Button>
          <Button onClick={reset} variant="outline">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Operation Description */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {operations.find(op => op.value === operation)?.label}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            {operation === 'permutation' && (
              <p>Permutations count arrangements where order matters. P(n,r) = n!/(n-r)!</p>
            )}
            {operation === 'combination' && (
              <p>Combinations count selections where order doesn't matter. C(n,r) = n!/(r!(n-r)!)</p>
            )}
            {operation === 'factorial' && (
              <p>Factorial counts all possible arrangements of n distinct items. n! = n × (n-1) × ... × 1</p>
            )}
            {operation === 'catalan' && (
              <p>Catalan numbers count various combinatorial structures like valid parentheses, binary trees, etc.</p>
            )}
            {operation === 'derangement' && (
              <p>Derangements count permutations where no element appears in its original position.</p>
            )}
            {operation === 'binomial' && (
              <p>Binomial coefficients appear in binomial theorem and Pascal's triangle.</p>
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
                  <Shuffle className="h-5 w-5 text-blue-500" />
                  {currentStepData.operation}
                  <Badge variant="outline">Step {currentStep + 1}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Description:</h4>
                  <p className="bg-muted p-3 rounded">{currentStepData.description}</p>
                </div>

                {currentStepData.formula && (
                  <div>
                    <h4 className="font-medium mb-2">Formula:</h4>
                    <p className="bg-blue-50 dark:bg-blue-950 p-3 rounded font-mono text-center">
                      {currentStepData.formula}
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="font-medium mb-2">Values:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(currentStepData.values).map(([key, value]) => (
                      <div
                        key={key}
                        className="p-4 rounded-lg border-2 text-center bg-white border-gray-200 text-gray-800 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                      >
                        <div className="text-sm font-medium text-muted-foreground mb-1">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </div>
                        <div className="text-xl font-bold">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {currentStepData.visualization && (
                  <div>
                    <h4 className="font-medium mb-2">Examples:</h4>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded">
                      <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                        {currentStepData.visualization.slice(0, 24).map((item, i) => (
                          <Badge key={i} variant="outline" className="text-center">
                            {item}
                          </Badge>
                        ))}
                        {currentStepData.visualization.length > 24 && (
                          <Badge variant="secondary">+{currentStepData.visualization.length - 24}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                )}
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
                {operations.find(op => op.value === operation)?.label}
                {!['factorial', 'catalan', 'derangement', 'fibonacci-counting'].includes(operation) && 
                  ` for n=${inputN}, r=${inputR}`
                }
                {['factorial', 'catalan', 'derangement', 'fibonacci-counting'].includes(operation) && 
                  ` for n=${inputN}`
                }
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
          title="Combinatorics Memory"
          data={steps.slice(0, currentStep + 1).map((step, i) => 
            Object.values(step.values)[0] || i
          )}
          baseAddress={0xB000}
          wordSize={4}
        />
      )}

      {/* Educational Information */}
      <Card>
        <CardHeader>
          <CardTitle>Combinatorics Fundamentals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Key Concepts:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Permutations: Order matters (arrangements)</li>
                <li>• Combinations: Order doesn't matter (selections)</li>
                <li>• Factorial: Total arrangements of n items</li>
                <li>• Catalan: Recursive structures counting</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Applications:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Probability calculations</li>
                <li>• Algorithm analysis</li>
                <li>• Cryptography key spaces</li>
                <li>• Game theory and puzzles</li>
              </ul>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="font-medium mb-2">Quick Reference:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded">
                <strong>Permutations:</strong> P(n,r) = n!/(n-r)!
                <br />
                <em>Example: P(5,3) = 5!/2! = 60</em>
              </div>
              <div className="bg-green-50 dark:bg-green-950 p-3 rounded">
                <strong>Combinations:</strong> C(n,r) = n!/(r!(n-r)!)
                <br />
                <em>Example: C(5,3) = 5!/(3!2!) = 10</em>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}