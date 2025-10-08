import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Binary, Calculator, RotateCcw, Layers, CheckSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';
import { toast } from 'sonner';

interface SubsetStep {
  step: number;
  binaryNumber: number;
  binaryString: string;
  subset: string[];
  explanation: string;
  elementChecks: boolean[];
}

export function BitSubsetVisualizer() {
  const [inputSet, setInputSet] = useState('A,B,C');
  const [elements, setElements] = useState<string[]>([]);
  const [steps, setSteps] = useState<SubsetStep[]>([]);
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
  } = useVisualizerVoice({ minInterval: 2000 });

  const parseInput = () => {
    try {
      const elems = inputSet.split(',').map(e => e.trim()).filter(e => e.length > 0);
      if (elems.length === 0 || elems.length > 4) {
        toast.error('Please enter 1-4 elements');
        return null;
      }
      setElements(elems);
      return elems;
    } catch (error) {
      toast.error('Invalid input format');
      return null;
    }
  };

  const generateSubsets = () => {
    const elems = parseInput();
    if (!elems) return;

    const n = elems.length;
    const totalSubsets = Math.pow(2, n);
    const newSteps: SubsetStep[] = [];

    for (let i = 0; i < totalSubsets; i++) {
      const binaryString = i.toString(2).padStart(n, '0');
      const subset: string[] = [];
      const elementChecks: boolean[] = [];

      for (let j = 0; j < n; j++) {
        const bitSet = (i & (1 << j)) !== 0;
        elementChecks.push(bitSet);
        if (bitSet) {
          subset.push(elems[j]);
        }
      }

      let explanation = `Binary ${i.toString(2).padStart(n, '0')} (${i}): `;
      if (subset.length === 0) {
        explanation += 'Empty subset {}';
      } else {
        explanation += `Include {${subset.join(', ')}}`;
      }

      newSteps.push({
        step: i,
        binaryNumber: i,
        binaryString: binaryString,
        subset: subset,
        explanation: explanation,
        elementChecks: elementChecks
      });
    }

    setSteps(newSteps);
    setCurrentStep(0);
    setIsAnimating(true);

    if (voiceEnabled) {
      speakStep('Subset Generation', `Generating all subsets for set {${elems.join(', ')}}. We'll use binary numbers from 0 to ${totalSubsets - 1} to represent each subset.`);
    }

    toast.success(`Generating ${totalSubsets} subsets`);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      
      if (voiceEnabled && steps[newStep]) {
        speakStep('Subset Step', steps[newStep].explanation, newStep, steps.length);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      
      if (voiceEnabled && steps[newStep]) {
        speakStep('Subset Step', steps[newStep].explanation, newStep, steps.length);
      }
    }
  };

  const reset = () => {
    setSteps([]);
    setCurrentStep(0);
    setIsAnimating(false);
    setInputSet('A,B,C');
    setElements([]);
  };

  const renderBinaryBits = (binaryString: string, elementChecks: boolean[]) => {
    return (
      <div className="flex justify-center gap-2">
        {binaryString.split('').reverse().map((bit, index) => {
          const isSet = bit === '1';
          const element = elements[index];
          
          return (
            <motion.div
              key={index}
              className="flex flex-col items-center gap-2"
              initial={{ scale: 1 }}
              animate={{ scale: isSet ? 1.1 : 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Element Label */}
              <div className="text-sm font-medium text-center min-w-[40px]">
                {element}
              </div>
              
              {/* Bit Value */}
              <div className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 font-mono font-bold text-lg ${
                isSet 
                  ? 'bg-green-100 border-green-300 text-green-800' 
                  : 'bg-gray-100 border-gray-300 text-gray-600'
              }`}>
                {bit}
              </div>
              
              {/* Include/Exclude Status */}
              <div className={`text-xs px-2 py-1 rounded ${
                isSet 
                  ? 'bg-green-200 text-green-800' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {isSet ? 'Include' : 'Exclude'}
              </div>
              
              {/* Bit Position */}
              <div className="text-xs text-gray-500">
                2^{index}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const renderAllSubsets = () => {
    if (steps.length === 0) return null;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
        <h4 className="font-semibold mb-3">All Generated Subsets:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`p-2 rounded text-sm border ${
                index === currentStep 
                  ? 'bg-blue-100 border-blue-300 text-blue-800' 
                  : index <= currentStep 
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : 'bg-gray-50 border-gray-200 text-gray-600'
              }`}
            >
              <div className="font-mono text-xs">{step.binaryString}</div>
              <div className="font-medium">
                {step.subset.length === 0 ? '{}' : `{${step.subset.join(', ')}}`}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Bit Subset Generation Visualizer</h3>
        <p className="text-muted-foreground">
          Generate all subsets using binary representation - each bit decides element inclusion
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Set Elements (comma-separated, max 4)</label>
          <Input
            value={inputSet}
            onChange={(e) => setInputSet(e.target.value)}
            placeholder="e.g., A,B,C"
          />
          <div className="text-xs text-muted-foreground">
            Each element will be mapped to a bit position
          </div>
        </div>

        <div className="flex gap-2 items-end">
          <Button onClick={generateSubsets} className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Generate
          </Button>
          <Button onClick={reset} variant="outline">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Visualization */}
      {isAnimating && currentStepData && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-950 dark:to-purple-900 p-8 rounded-xl border-2 border-dashed border-indigo-200 dark:border-indigo-800">
          <div className="space-y-6">
            {/* Current State */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <CheckSquare className="h-6 w-6 text-indigo-600" />
                <h3 className="text-lg font-semibold">
                  Subset {currentStep + 1} of {steps.length}: Binary {currentStepData.binaryNumber}
                </h3>
              </div>

              {/* Binary to Subset Mapping */}
              <div className="space-y-6">
                <div className="text-lg font-semibold">
                  Binary Number: {currentStepData.binaryNumber} → {currentStepData.binaryString}
                </div>

                {/* Bit Visualization */}
                {renderBinaryBits(currentStepData.binaryString, currentStepData.elementChecks)}

                {/* Resulting Subset */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border">
                  <div className="text-lg font-semibold mb-2">Resulting Subset:</div>
                  <div className="text-3xl font-bold text-indigo-600">
                    {currentStepData.subset.length === 0 ? '∅ (Empty Set)' : `{${currentStepData.subset.join(', ')}}`}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    {currentStepData.explanation}
                  </div>
                </div>

                {/* Bit Explanation */}
                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
                  <div className="text-sm">
                    <strong>How it works:</strong> Each bit position corresponds to an element. 
                    If the bit is 1, include the element; if 0, exclude it.
                  </div>
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

      {/* All Subsets Display */}
      {steps.length > 0 && renderAllSubsets()}

      {/* Algorithm Explanation */}
      <div className="bg-card border rounded-lg p-4">
        <h4 className="font-semibold mb-4">Algorithm Explanation:</h4>
        <div className="space-y-3 text-sm">
          <div><strong>Key Insight:</strong> Each subset can be represented by a binary number</div>
          <div><strong>Bit Mapping:</strong> Each bit position corresponds to one element in the set</div>
          <div><strong>Generation:</strong> Count from 0 to 2^n - 1 to get all possible combinations</div>
          <div><strong>Inclusion Rule:</strong> If bit i is 1, include element i in the subset</div>
          <div><strong>Total Subsets:</strong> 2^n subsets for n elements (including empty set)</div>
        </div>
      </div>

      {/* Complexity Analysis */}
      <div className="bg-card border rounded-lg p-4">
        <h4 className="font-semibold mb-4">Complexity Analysis:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="space-y-2">
            <div className="font-medium text-red-600">Time Complexity</div>
            <div>O(2^n × n) - Generate 2^n subsets, each takes O(n) to build</div>
          </div>
          <div className="space-y-2">
            <div className="font-medium text-blue-600">Space Complexity</div>
            <div>O(1) extra space (excluding output storage)</div>
          </div>
          <div className="space-y-2">
            <div className="font-medium text-green-600">Total Subsets</div>
            <div>2^n subsets for n elements</div>
          </div>
        </div>
      </div>

      {/* Examples */}
      <div className="bg-card border rounded-lg p-4">
        <h4 className="font-semibold mb-4">Examples:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="font-medium">Set &#123;A, B&#125;:</div>
            <div>00 → &#123;&#125; (empty)</div>
            <div>01 → &#123;A&#125;</div>
            <div>10 → &#123;B&#125;</div>
            <div>11 → &#123;A, B&#125;</div>
          </div>
          <div className="space-y-2">
            <div className="font-medium">Set &#123;X, Y, Z&#125;:</div>
            <div>000 → &#123;&#125;, 001 → &#123;X&#125;</div>
            <div>010 → &#123;Y&#125;, 011 → &#123;X, Y&#125;</div>
            <div>100 → &#123;Z&#125;, 101 → &#123;X, Z&#125;</div>
            <div>110 → &#123;Y, Z&#125;, 111 → &#123;X, Y, Z&#125;</div>
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