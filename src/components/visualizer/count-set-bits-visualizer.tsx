import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Binary, Calculator, RotateCcw, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';
import { toast } from 'sonner';

interface CountStep {
  step: number;
  number: number;
  binary: string;
  method: string;
  explanation: string;
  count: number;
  highlightBit?: number;
}

export function CountSetBitsVisualizer() {
  const [number, setNumber] = useState(13);
  const [method, setMethod] = useState('naive');
  const [steps, setSteps] = useState<CountStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
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
    speakStep
  } = useVisualizerVoice({ minInterval: 1500 });

  const methods = [
    { value: 'naive', label: 'Naive Approach (Check Each Bit)' },
    { value: 'brian-kernighan', label: 'Brian Kernighan\'s Algorithm' },
    { value: 'builtin', label: 'Built-in Method' }
  ];

  const countSetBitsNaive = (n: number): CountStep[] => {
    const steps: CountStep[] = [];
    let count = 0;
    let temp = n;
    let step = 0;

    steps.push({
      step: step++,
      number: n,
      binary: n.toString(2).padStart(8, '0'),
      method: 'Naive',
      explanation: `Starting with number ${n} (binary: ${n.toString(2).padStart(8, '0')})`,
      count: 0
    });

    for (let i = 0; temp > 0; i++) {
      const bit = temp & 1;
      if (bit === 1) {
        count++;
        steps.push({
          step: step++,
          number: temp,
          binary: temp.toString(2).padStart(8, '0'),
          method: 'Naive',
          explanation: `Bit ${i}: ${temp} & 1 = ${bit} ✓ (Count: ${count})`,
          count: count,
          highlightBit: 7 - i
        });
      } else {
        steps.push({
          step: step++,
          number: temp,
          binary: temp.toString(2).padStart(8, '0'),
          method: 'Naive',
          explanation: `Bit ${i}: ${temp} & 1 = ${bit} (Skip)`,
          count: count,
          highlightBit: 7 - i
        });
      }
      temp >>= 1;
    }

    steps.push({
      step: step++,
      number: 0,
      binary: '00000000',
      method: 'Naive',
      explanation: `Final count: ${count} set bits`,
      count: count
    });

    return steps;
  };

  const countSetBitsBrianKernighan = (n: number): CountStep[] => {
    const steps: CountStep[] = [];
    let count = 0;
    let temp = n;
    let step = 0;

    steps.push({
      step: step++,
      number: n,
      binary: n.toString(2).padStart(8, '0'),
      method: 'Brian Kernighan',
      explanation: `Starting with number ${n} (binary: ${n.toString(2).padStart(8, '0')})`,
      count: 0
    });

    while (temp > 0) {
      const before = temp;
      temp = temp & (temp - 1);
      count++;
      
      steps.push({
        step: step++,
        number: temp,
        binary: temp.toString(2).padStart(8, '0'),
        method: 'Brian Kernighan',
        explanation: `${before} & (${before} - 1) = ${before} & ${before - 1} = ${temp} (Count: ${count})`,
        count: count
      });
    }

    steps.push({
      step: step++,
      number: 0,
      binary: '00000000',
      method: 'Brian Kernighan',
      explanation: `Final count: ${count} set bits (Only ${count} iterations!)`,
      count: count
    });

    return steps;
  };

  const countSetBitsBuiltin = (n: number): CountStep[] => {
    const steps: CountStep[] = [];
    const binary = n.toString(2);
    const count = binary.split('1').length - 1;

    steps.push({
      step: 0,
      number: n,
      binary: n.toString(2).padStart(8, '0'),
      method: 'Built-in',
      explanation: `Convert ${n} to binary: ${binary}`,
      count: 0
    });

    steps.push({
      step: 1,
      number: n,
      binary: n.toString(2).padStart(8, '0'),
      method: 'Built-in',
      explanation: `Count '1' characters in "${binary}": ${count} set bits`,
      count: count
    });

    return steps;
  };

  const startVisualization = () => {
    let newSteps: CountStep[] = [];
    
    switch (method) {
      case 'naive':
        newSteps = countSetBitsNaive(number);
        break;
      case 'brian-kernighan':
        newSteps = countSetBitsBrianKernighan(number);
        break;
      case 'builtin':
        newSteps = countSetBitsBuiltin(number);
        break;
    }

    setSteps(newSteps);
    setCurrentStep(0);
    setIsAnimating(true);

    if (voiceEnabled) {
      speakStep('Count Set Bits', `Starting to count set bits in ${number} using ${methods.find(m => m.value === method)?.label}`);
    }

    toast.success(`Started ${methods.find(m => m.value === method)?.label} visualization`);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      
      if (voiceEnabled && steps[newStep]) {
        speakStep('Counting Step', steps[newStep].explanation, newStep, steps.length);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      
      if (voiceEnabled && steps[newStep]) {
        speakStep('Counting Step', steps[newStep].explanation, newStep, steps.length);
      }
    }
  };

  const reset = () => {
    setSteps([]);
    setCurrentStep(0);
    setIsAnimating(false);
    setNumber(13);
    setMethod('naive');
  };

  const renderBinaryBits = (binary: string, highlightBit?: number) => {
    return (
      <div className="flex justify-center gap-1 mb-2">
        {binary.split('').map((bit, index) => {
          const isHighlighted = highlightBit === index;
          const isSet = bit === '1';
          return (
            <motion.div
              key={index}
              className={`w-10 h-10 flex items-center justify-center rounded border-2 font-mono font-bold text-lg ${
                isHighlighted 
                  ? 'bg-yellow-200 border-yellow-400 text-yellow-800 scale-110' 
                  : isSet 
                    ? 'bg-green-100 border-green-300 text-green-800' 
                    : 'bg-gray-100 border-gray-300 text-gray-600'
              }`}
              initial={{ scale: 1 }}
              animate={{ scale: isHighlighted ? 1.1 : 1 }}
              transition={{ duration: 0.3 }}
            >
              {bit}
            </motion.div>
          );
        })}
      </div>
    );
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Count Set Bits Visualizer</h3>
        <p className="text-muted-foreground">
          Compare different algorithms for counting 1s in binary representation
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Number to Analyze</label>
          <Input
            type="number"
            value={number}
            onChange={(e) => setNumber(parseInt(e.target.value) || 0)}
            placeholder="Enter number"
            min="0"
            max="255"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Algorithm</label>
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {methods.map(m => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 items-end">
          <Button onClick={startVisualization} className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Start
          </Button>
          <Button onClick={reset} variant="outline">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Visualization */}
      {isAnimating && currentStepData && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 p-8 rounded-xl border-2 border-dashed border-blue-200 dark:border-blue-800">
          <div className="space-y-6">
            {/* Current State */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Binary className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold">
                  Step {currentStep + 1} of {steps.length}: {currentStepData.method}
                </h3>
              </div>

              {/* Binary Representation */}
              {renderBinaryBits(currentStepData.binary, currentStepData.highlightBit)}
              
              {/* Bit Positions */}
              <div className="flex justify-center gap-1 mb-4">
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={i} className="w-10 text-xs text-center text-gray-500">
                    {7 - i}
                  </div>
                ))}
              </div>

              {/* Current Count */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border mb-4">
                <div className="text-2xl font-bold text-blue-600">
                  Set Bits Count: {currentStepData.count}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  {currentStepData.explanation}
                </div>
              </div>
            </div>

            {/* Step Controls */}
            <div className="flex justify-center gap-4">
              <Button 
                onClick={prevStep} 
                disabled={currentStep === 0}
                variant="outline"
              >
                Previous
              </Button>
              <Badge variant="secondary" className="px-4 py-2">
                {currentStep + 1} / {steps.length}
              </Badge>
              <Button 
                onClick={nextStep} 
                disabled={currentStep === steps.length - 1}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Algorithm Comparison */}
      <div className="bg-card border rounded-lg p-4">
        <h4 className="font-semibold mb-4">Algorithm Comparison:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="space-y-2">
            <div className="font-medium text-blue-600">Naive Approach</div>
            <div>Time: O(log n)</div>
            <div>Space: O(1)</div>
            <div>Checks every bit position</div>
          </div>
          <div className="space-y-2">
            <div className="font-medium text-green-600">Brian Kernighan's</div>
            <div>Time: O(k) where k = set bits</div>
            <div>Space: O(1)</div>
            <div>Only loops for set bits</div>
          </div>
          <div className="space-y-2">
            <div className="font-medium text-purple-600">Built-in Method</div>
            <div>Time: O(log n)</div>
            <div>Space: O(log n)</div>
            <div>String conversion approach</div>
          </div>
        </div>
      </div>

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