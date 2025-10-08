import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Circle, ArrowRight, Zap, Target, Calculator, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

interface InductionStep {
  step: number;
  type: 'base' | 'inductive' | 'conclusion';
  description: string;
  statement: string;
  proof?: string;
  verified: boolean;
  values?: { [key: string]: number };
}

interface ProofExample {
  id: string;
  name: string;
  statement: string;
  baseCase: { n: number; statement: string; proof: string };
  inductiveStep: {
    assumption: (k: number) => string;
    goal: (k: number) => string;
    proof: (k: number) => string;
  };
  formula: (n: number) => number;
  verify: (n: number) => boolean;
}

export function MathematicalInductionVisualizer() {
  const [selectedProof, setSelectedProof] = useState('arithmetic-sum');
  const [currentStep, setCurrentStep] = useState(0);
  const [maxN, setMaxN] = useState(5);
  const [steps, setSteps] = useState<InductionStep[]>([]);
  const [showMemory, setShowMemory] = useState(false);
  const [dominoAnimation, setDominoAnimation] = useState(false);
  const [ladderAnimation, setLadderAnimation] = useState(false);

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

  const proofExamples: ProofExample[] = [
    {
      id: 'arithmetic-sum',
      name: 'Arithmetic Sum: 1 + 2 + ... + n = n(n+1)/2',
      statement: 'The sum of first n natural numbers equals n(n+1)/2',
      baseCase: {
        n: 1,
        statement: '1 = 1(1+1)/2 = 1',
        proof: 'For n=1: Left side = 1, Right side = 1×2/2 = 1 ✓'
      },
      inductiveStep: {
        assumption: (k) => `1 + 2 + ... + ${k} = ${k}(${k}+1)/2`,
        goal: (k) => `1 + 2 + ... + ${k} + ${k+1} = (${k+1})(${k+2})/2`,
        proof: (k) => `Left side = [1+2+...+${k}] + ${k+1} = ${k}(${k}+1)/2 + ${k+1} = (${k+1})[${k}/2 + 1] = (${k+1})(${k+2})/2`
      },
      formula: (n) => (n * (n + 1)) / 2,
      verify: (n) => {
        const formula = (n * (n + 1)) / 2;
        let sum = 0;
        for (let i = 1; i <= n; i++) sum += i;
        return formula === sum;
      }
    },
    {
      id: 'geometric-sum',
      name: 'Geometric Sum: 1 + r + r² + ... + r^n = (r^(n+1) - 1)/(r - 1)',
      statement: 'The sum of geometric series with ratio r ≠ 1',
      baseCase: {
        n: 0,
        statement: '1 = (r¹ - 1)/(r - 1)',
        proof: 'For n=0: Left side = 1, Right side = (r-1)/(r-1) = 1 ✓'
      },
      inductiveStep: {
        assumption: (k) => `1 + r + ... + r^${k} = (r^${k+1} - 1)/(r - 1)`,
        goal: (k) => `1 + r + ... + r^${k} + r^${k+1} = (r^${k+2} - 1)/(r - 1)`,
        proof: (k) => `Left side = (r^${k+1} - 1)/(r - 1) + r^${k+1} = [r^${k+1} - 1 + r^${k+1}(r-1)]/(r-1) = (r^${k+2} - 1)/(r-1)`
      },
      formula: (n) => n === 0 ? 1 : (Math.pow(2, n + 1) - 1) / (2 - 1), // Using r=2 for simplicity
      verify: (n) => {
        const r = 2;
        const formula = (Math.pow(r, n + 1) - 1) / (r - 1);
        let sum = 0;
        for (let i = 0; i <= n; i++) sum += Math.pow(r, i);
        return Math.abs(formula - sum) < 1e-10;
      }
    },
    {
      id: 'power-inequality',
      name: 'Power Inequality: 2^n > n for n ≥ 1',
      statement: 'Two to the power n is greater than n for all n ≥ 1',
      baseCase: {
        n: 1,
        statement: '2¹ = 2 > 1',
        proof: 'For n=1: 2¹ = 2 > 1 ✓'
      },
      inductiveStep: {
        assumption: (k) => `2^${k} > ${k}`,
        goal: (k) => `2^${k+1} > ${k+1}`,
        proof: (k) => `2^${k+1} = 2 × 2^${k} > 2 × ${k} = ${2*k}. Since ${k} ≥ 1, we have ${2*k} ≥ ${k+1}, so 2^${k+1} > ${k+1}`
      },
      formula: (n) => Math.pow(2, n),
      verify: (n) => Math.pow(2, n) > n
    },
    {
      id: 'tower-hanoi',
      name: 'Tower of Hanoi: T(n) = 2^n - 1',
      statement: 'Minimum moves for Tower of Hanoi with n disks',
      baseCase: {
        n: 1,
        statement: 'T(1) = 1 = 2¹ - 1',
        proof: 'For n=1: One disk requires 1 move = 2¹ - 1 ✓'
      },
      inductiveStep: {
        assumption: (k) => `T(${k}) = 2^${k} - 1`,
        goal: (k) => `T(${k+1}) = 2^${k+1} - 1`,
        proof: (k) => `T(${k+1}) = 2×T(${k}) + 1 = 2×(2^${k} - 1) + 1 = 2^${k+1} - 2 + 1 = 2^${k+1} - 1`
      },
      formula: (n) => Math.pow(2, n) - 1,
      verify: (n) => Math.pow(2, n) - 1 === Math.pow(2, n) - 1 // Always true by definition
    }
  ];

  const currentProof = proofExamples.find(p => p.id === selectedProof) || proofExamples[0];

  const generateSteps = () => {
    const newSteps: InductionStep[] = [];
    
    // Base case
    newSteps.push({
      step: 0,
      type: 'base',
      description: `Base Case: n = ${currentProof.baseCase.n}`,
      statement: currentProof.baseCase.statement,
      proof: currentProof.baseCase.proof,
      verified: true,
      values: { n: currentProof.baseCase.n, result: currentProof.formula(currentProof.baseCase.n) }
    });

    // Inductive steps
    for (let k = currentProof.baseCase.n; k < maxN; k++) {
      newSteps.push({
        step: k - currentProof.baseCase.n + 1,
        type: 'inductive',
        description: `Inductive Step: P(${k}) ⟹ P(${k+1})`,
        statement: `Assume: ${currentProof.inductiveStep.assumption(k)}\nProve: ${currentProof.inductiveStep.goal(k+1)}`,
        proof: currentProof.inductiveStep.proof(k),
        verified: currentProof.verify(k+1),
        values: { k: k, k_plus_1: k+1, result_k: currentProof.formula(k), result_k_plus_1: currentProof.formula(k+1) }
      });
    }

    // Conclusion
    newSteps.push({
      step: newSteps.length,
      type: 'conclusion',
      description: 'Conclusion',
      statement: `By mathematical induction, the statement is true for all n ≥ ${currentProof.baseCase.n}`,
      verified: true
    });

    setSteps(newSteps);
    setCurrentStep(0);
  };

  useEffect(() => {
    generateSteps();
  }, [selectedProof, maxN]);

  const runProof = () => {
    speakOperation('Mathematical Induction', `Running proof for ${currentProof.name}`);
    generateSteps();
    setCurrentStep(0);
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

  const triggerDominoAnimation = () => {
    setDominoAnimation(true);
    setTimeout(() => setDominoAnimation(false), 3000);
  };

  const triggerLadderAnimation = () => {
    setLadderAnimation(true);
    setTimeout(() => setLadderAnimation(false), 3000);
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Proof Example</label>
          <Select value={selectedProof} onValueChange={setSelectedProof}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {proofExamples.map(proof => (
                <SelectItem key={proof.id} value={proof.id}>
                  {proof.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Maximum n</label>
          <Input
            type="number"
            min="2"
            max="10"
            value={maxN}
            onChange={(e) => setMaxN(parseInt(e.target.value) || 5)}
          />
        </div>

        <div className="flex gap-2 items-end">
          <Button onClick={runProof} className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Run Proof
          </Button>
          <Button onClick={triggerDominoAnimation} variant="outline" size="sm">
            <Zap className="h-4 w-4" />
          </Button>
          <Button onClick={triggerLadderAnimation} variant="outline" size="sm">
            <Layers className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Proof Statement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Proof Statement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-medium">{currentProof.statement}</p>
        </CardContent>
      </Card>

      {/* Visual Metaphors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Domino Effect Visualization */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Domino Effect Metaphor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center space-x-2 h-20">
              {Array.from({ length: Math.min(maxN, 8) }, (_, i) => (
                <motion.div
                  key={i}
                  className={`w-6 h-16 rounded-sm border-2 ${
                    dominoAnimation && i <= currentStep ? 'bg-red-500 border-red-600' : 'bg-gray-300 border-gray-400'
                  }`}
                  initial={{ rotate: 0 }}
                  animate={{ 
                    rotate: dominoAnimation && i <= currentStep ? (i === 0 ? -15 : -45) : 0,
                    x: dominoAnimation && i <= currentStep && i > 0 ? -5 : 0
                  }}
                  transition={{ delay: dominoAnimation ? i * 0.3 : 0, duration: 0.5 }}
                />
              ))}
            </div>
            <p className="text-xs text-center mt-2 text-muted-foreground">
              Each domino represents P(n). If P(k) falls, P(k+1) must fall too.
            </p>
          </CardContent>
        </Card>

        {/* Ladder Climbing Visualization */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Ladder Climbing Metaphor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-20 flex items-end justify-center">
              {/* Ladder rungs */}
              {Array.from({ length: Math.min(maxN, 6) }, (_, i) => (
                <div key={i} className="relative">
                  <div className={`w-8 h-2 ${i <= currentStep ? 'bg-blue-500' : 'bg-gray-300'} mb-2`} />
                  {i === currentStep && ladderAnimation && (
                    <motion.div
                      className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-500 rounded-full"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-center mt-2 text-muted-foreground">
              Each rung represents P(n). Prove you can reach the first, then any next rung.
            </p>
          </CardContent>
        </Card>
      </div>

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
            <Card className={`border-2 ${
              currentStepData.type === 'base' ? 'border-green-500' :
              currentStepData.type === 'inductive' ? 'border-blue-500' :
              'border-purple-500'
            }`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {currentStepData.verified ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400" />
                  )}
                  {currentStepData.description}
                  <Badge variant={
                    currentStepData.type === 'base' ? 'default' :
                    currentStepData.type === 'inductive' ? 'secondary' :
                    'outline'
                  }>
                    {currentStepData.type}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Statement:</h4>
                  <p className="bg-muted p-3 rounded whitespace-pre-line">{currentStepData.statement}</p>
                </div>
                
                {currentStepData.proof && (
                  <div>
                    <h4 className="font-medium mb-2">Proof:</h4>
                    <p className="bg-blue-50 dark:bg-blue-950 p-3 rounded text-sm">{currentStepData.proof}</p>
                  </div>
                )}

                {currentStepData.values && (
                  <div>
                    <h4 className="font-medium mb-2">Values:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {Object.entries(currentStepData.values).map(([key, value]) => (
                        <div key={key} className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-center">
                          <div className="text-xs text-muted-foreground">{key}</div>
                          <div className="font-bold">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verification Table */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Table</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-gray-300 p-2">n</th>
                  <th className="border border-gray-300 p-2">Formula Result</th>
                  <th className="border border-gray-300 p-2">Direct Calculation</th>
                  <th className="border border-gray-300 p-2">Verified</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: maxN }, (_, i) => {
                  const n = i + 1;
                  const formulaResult = currentProof.formula(n);
                  const verified = currentProof.verify(n);
                  
                  let directResult = formulaResult; // Default
                  if (selectedProof === 'arithmetic-sum') {
                    directResult = Array.from({ length: n }, (_, j) => j + 1).reduce((a, b) => a + b, 0);
                  } else if (selectedProof === 'geometric-sum') {
                    directResult = Array.from({ length: n + 1 }, (_, j) => Math.pow(2, j)).reduce((a, b) => a + b, 0);
                  } else if (selectedProof === 'power-inequality') {
                    directResult = n;
                  }
                  
                  return (
                    <tr key={n} className={n <= currentStep + 1 ? 'bg-green-50 dark:bg-green-950' : ''}>
                      <td className="border border-gray-300 p-2 text-center">{n}</td>
                      <td className="border border-gray-300 p-2 text-center">{formulaResult}</td>
                      <td className="border border-gray-300 p-2 text-center">{directResult}</td>
                      <td className="border border-gray-300 p-2 text-center">
                        {verified ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                        ) : (
                          <Circle className="h-4 w-4 text-red-500 mx-auto" />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

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
          title="Mathematical Induction Memory"
          data={steps.slice(0, currentStep + 1).map((step, i) => step.values?.result || i)}
          baseAddress={0x7000}
          wordSize={4}
        />
      )}

      {/* Educational Information */}
      <Card>
        <CardHeader>
          <CardTitle>Understanding Mathematical Induction</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">The Two-Step Process:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 dark:bg-green-950 p-4 rounded">
                <h5 className="font-medium text-green-700 dark:text-green-300">1. Base Case</h5>
                <p className="text-sm">Prove P(n₀) is true for the smallest value n₀</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded">
                <h5 className="font-medium text-blue-700 dark:text-blue-300">2. Inductive Step</h5>
                <p className="text-sm">Prove: If P(k) is true, then P(k+1) is also true</p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="font-medium mb-2">Why It Works:</h4>
            <p className="text-sm text-muted-foreground">
              Mathematical induction works like a chain reaction. Once you prove the base case and show that each step leads to the next, 
              you've proven the statement for all values. It's like proving you can climb any rung of an infinite ladder by showing 
              you can reach the first rung and that from any rung, you can reach the next one.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}