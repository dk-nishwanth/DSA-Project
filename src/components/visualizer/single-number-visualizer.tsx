import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Binary, Calculator, RotateCcw, Zap, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';
import { toast } from 'sonner';

interface XORStep {
  step: number;
  currentNumber: number;
  runningXOR: number;
  previousXOR: number;
  binary: string;
  runningBinary: string;
  explanation: string;
  isComplete: boolean;
}

export function SingleNumberVisualizer() {
  const [inputArray, setInputArray] = useState('2,1,2,3,1');
  const [numbers, setNumbers] = useState<number[]>([]);
  const [steps, setSteps] = useState<XORStep[]>([]);
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
      const nums = inputArray.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
      if (nums.length === 0) {
        toast.error('Please enter valid numbers');
        return;
      }
      setNumbers(nums);
      return nums;
    } catch (error) {
      toast.error('Invalid input format');
      return null;
    }
  };

  const startVisualization = () => {
    const nums = parseInput();
    if (!nums) return;

    const newSteps: XORStep[] = [];
    let runningXOR = 0;
    
    // Initial step
    newSteps.push({
      step: 0,
      currentNumber: 0,
      runningXOR: 0,
      previousXOR: 0,
      binary: '00000000',
      runningBinary: '00000000',
      explanation: 'Starting with XOR result = 0',
      isComplete: false
    });

    // Process each number
    nums.forEach((num, index) => {
      const previousXOR = runningXOR;
      runningXOR ^= num;
      
      newSteps.push({
        step: index + 1,
        currentNumber: num,
        runningXOR: runningXOR,
        previousXOR: previousXOR,
        binary: num.toString(2).padStart(8, '0'),
        runningBinary: runningXOR.toString(2).padStart(8, '0'),
        explanation: `XOR with ${num}: ${previousXOR} ⊕ ${num} = ${runningXOR}`,
        isComplete: index === nums.length - 1
      });
    });

    setSteps(newSteps);
    setCurrentStep(0);
    setIsAnimating(true);

    if (voiceEnabled) {
      speakStep('Single Number Algorithm', `Starting with array: ${nums.join(', ')}. We'll XOR all numbers together to find the unique one.`);
    }

    toast.success('Single Number visualization started');
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      
      if (voiceEnabled && steps[newStep]) {
        speakStep('XOR Step', steps[newStep].explanation, newStep, steps.length);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      
      if (voiceEnabled && steps[newStep]) {
        speakStep('XOR Step', steps[newStep].explanation, newStep, steps.length);
      }
    }
  };

  const reset = () => {
    setSteps([]);
    setCurrentStep(0);
    setIsAnimating(false);
    setInputArray('2,1,2,3,1');
    setNumbers([]);
  };

  const renderBinaryBits = (binary: string, label: string, highlight?: boolean) => {
    return (
      <div className="space-y-2">
        <div className="text-sm font-medium text-center">{label}</div>
        <div className="flex justify-center gap-1">
          {binary.split('').map((bit, index) => {
            const isSet = bit === '1';
            return (
              <motion.div
                key={index}
                className={`w-10 h-10 flex items-center justify-center rounded border-2 font-mono font-bold text-lg ${
                  highlight && isSet
                    ? 'bg-yellow-200 border-yellow-400 text-yellow-800' 
                    : isSet 
                      ? 'bg-blue-100 border-blue-300 text-blue-800' 
                      : 'bg-gray-100 border-gray-300 text-gray-600'
                }`}
                initial={{ scale: 1 }}
                animate={{ scale: highlight && isSet ? 1.1 : 1 }}
                transition={{ duration: 0.3 }}
              >
                {bit}
              </motion.div>
            );
          })}
        </div>
        <div className="flex justify-center gap-1">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="w-10 text-xs text-center text-gray-500">
              {7 - i}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderNumberFrequency = () => {
    if (numbers.length === 0) return null;

    const frequency = new Map<number, number>();
    numbers.forEach(num => {
      frequency.set(num, (frequency.get(num) || 0) + 1);
    });

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
        <h4 className="font-semibold mb-3">Number Frequency:</h4>
        <div className="flex flex-wrap gap-2">
          {Array.from(frequency.entries()).map(([num, count]) => (
            <div key={num} className={`px-3 py-1 rounded text-sm ${
              count === 1 ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-gray-100 text-gray-800'
            }`}>
              {num}: {count} time{count > 1 ? 's' : ''}
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
        <h3 className="text-2xl font-bold mb-2">Single Number Visualizer</h3>
        <p className="text-muted-foreground">
          Find the unique number using XOR properties: a ⊕ a = 0, a ⊕ 0 = a
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Array (comma-separated)</label>
          <Input
            value={inputArray}
            onChange={(e) => setInputArray(e.target.value)}
            placeholder="e.g., 2,1,2,3,1"
          />
          <div className="text-xs text-muted-foreground">
            Enter numbers where all appear twice except one
          </div>
        </div>

        <div className="flex gap-2 items-end">
          <Button onClick={startVisualization} className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Start XOR
          </Button>
          <Button onClick={reset} variant="outline">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Number Frequency Display */}
      {numbers.length > 0 && renderNumberFrequency()}

      {/* Visualization */}
      {isAnimating && currentStepData && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 p-8 rounded-xl border-2 border-dashed border-green-200 dark:border-green-800">
          <div className="space-y-6">
            {/* Current State */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Users className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-semibold">
                  Step {currentStep} of {steps.length - 1}: XOR Operation
                </h3>
              </div>

              {/* Array Visualization */}
              <div className="mb-6">
                <div className="text-sm font-medium mb-2">Array: [{numbers.join(', ')}]</div>
                <div className="flex justify-center gap-2 flex-wrap">
                  {numbers.map((num, index) => (
                    <div
                      key={index}
                      className={`px-3 py-2 rounded border ${
                        index < currentStep 
                          ? 'bg-gray-200 text-gray-600 border-gray-300' 
                          : index === currentStep 
                            ? 'bg-yellow-200 text-yellow-800 border-yellow-400' 
                            : 'bg-white text-gray-800 border-gray-300'
                      }`}
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>

              {/* XOR Operation Visualization */}
              {currentStep > 0 && (
                <div className="space-y-4">
                  <div className="text-lg font-semibold">
                    {currentStepData.previousXOR} ⊕ {currentStepData.currentNumber} = {currentStepData.runningXOR}
                  </div>
                  
                  {/* Binary Representation */}
                  <div className="space-y-4">
                    {renderBinaryBits(
                      currentStepData.previousXOR.toString(2).padStart(8, '0'), 
                      `Previous XOR: ${currentStepData.previousXOR}`
                    )}
                    
                    <div className="text-center text-2xl font-bold text-green-600">⊕</div>
                    
                    {renderBinaryBits(
                      currentStepData.binary, 
                      `Current Number: ${currentStepData.currentNumber}`,
                      true
                    )}
                    
                    <div className="text-center text-2xl font-bold">=</div>
                    
                    {renderBinaryBits(
                      currentStepData.runningBinary, 
                      `Result: ${currentStepData.runningXOR}`,
                      true
                    )}
                  </div>
                </div>
              )}

              {currentStep === 0 && (
                <div className="space-y-4">
                  <div className="text-lg font-semibold">Initialize XOR result to 0</div>
                  {renderBinaryBits(currentStepData.runningBinary, 'XOR Result: 0')}
                </div>
              )}

              {/* Explanation */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border mt-4">
                <div className="text-sm text-muted-foreground">
                  {currentStepData.explanation}
                </div>
                {currentStepData.isComplete && (
                  <div className="mt-2 text-lg font-bold text-green-600">
                    🎉 Single number found: {currentStepData.runningXOR}
                  </div>
                )}
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
                {currentStep} / {steps.length - 1}
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

      {/* XOR Properties Explanation */}
      <div className="bg-card border rounded-lg p-4">
        <h4 className="font-semibold mb-4">XOR Properties That Make This Work:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div><strong>Self-Canceling:</strong> a ⊕ a = 0</div>
            <div><strong>Identity:</strong> a ⊕ 0 = a</div>
            <div><strong>Commutative:</strong> a ⊕ b = b ⊕ a</div>
            <div><strong>Associative:</strong> (a ⊕ b) ⊕ c = a ⊕ (b ⊕ c)</div>
          </div>
          <div className="space-y-2">
            <div><strong>Example:</strong> [2, 1, 2, 3, 1]</div>
            <div>2 ⊕ 1 ⊕ 2 ⊕ 3 ⊕ 1</div>
            <div>= (2 ⊕ 2) ⊕ (1 ⊕ 1) ⊕ 3</div>
            <div>= 0 ⊕ 0 ⊕ 3 = 3 ✓</div>
          </div>
        </div>
      </div>

      {/* Algorithm Analysis */}
      <div className="bg-card border rounded-lg p-4">
        <h4 className="font-semibold mb-4">Algorithm Analysis:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="space-y-2">
            <div className="font-medium text-green-600">Time Complexity</div>
            <div>O(n) - Single pass through array</div>
          </div>
          <div className="space-y-2">
            <div className="font-medium text-blue-600">Space Complexity</div>
            <div>O(1) - Only one variable needed</div>
          </div>
          <div className="space-y-2">
            <div className="font-medium text-purple-600">Key Advantage</div>
            <div>No extra space vs hash table O(n)</div>
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