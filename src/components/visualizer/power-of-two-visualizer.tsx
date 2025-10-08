import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Binary, Calculator, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';
import { toast } from 'sonner';

interface PowerOfTwoCheck {
  number: number;
  binary: string;
  minusOne: number;
  minusOneBinary: string;
  andResult: number;
  andResultBinary: string;
  isPowerOfTwo: boolean;
  explanation: string;
  step: 'input' | 'subtract' | 'and' | 'result';
}

export function PowerOfTwoVisualizer() {
  const [number, setNumber] = useState(8);
  const [result, setResult] = useState<PowerOfTwoCheck | null>(null);
  const [currentStep, setCurrentStep] = useState<'input' | 'subtract' | 'and' | 'result'>('input');
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

  const checkPowerOfTwo = () => {
    if (number <= 0) {
      toast.error('Please enter a positive number');
      return;
    }

    const binary = number.toString(2).padStart(8, '0');
    const minusOne = number - 1;
    const minusOneBinary = minusOne.toString(2).padStart(8, '0');
    const andResult = number & minusOne;
    const andResultBinary = andResult.toString(2).padStart(8, '0');
    const isPowerOfTwo = number > 0 && andResult === 0;

    const explanation = isPowerOfTwo 
      ? `${number} is a power of 2! It has exactly one bit set.`
      : `${number} is not a power of 2. It has multiple bits set or is not positive.`;

    setResult({
      number,
      binary,
      minusOne,
      minusOneBinary,
      andResult,
      andResultBinary,
      isPowerOfTwo,
      explanation,
      step: 'input'
    });

    setCurrentStep('input');

    if (voiceEnabled) {
      speakStep('Power of Two Check', `Checking if ${number} is a power of 2. Let's analyze its binary representation step by step.`);
    }

    toast.success('Power of 2 check started');
  };

  const nextStep = () => {
    if (!result) return;

    const steps: Array<'input' | 'subtract' | 'and' | 'result'> = ['input', 'subtract', 'and', 'result'];
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentIndex < steps.length - 1) {
      const newStep = steps[currentIndex + 1];
      setCurrentStep(newStep);
      
      if (voiceEnabled) {
        let title = '';
        let message = '';
        switch (newStep) {
          case 'subtract':
            title = 'Subtract One';
            message = `Now let's subtract 1 from ${result.number}. ${result.number} minus 1 equals ${result.minusOne}. Notice how the binary pattern changes.`;
            break;
          case 'and':
            title = 'AND Operation';
            message = `Now we perform the AND operation: ${result.number} AND ${result.minusOne} equals ${result.andResult}. This is the key insight!`;
            break;
          case 'result':
            title = 'Result';
            message = result.explanation;
            break;
        }
        speakStep(title, message);
      }
    }
  };

  const prevStep = () => {
    if (!result) return;

    const steps: Array<'input' | 'subtract' | 'and' | 'result'> = ['input', 'subtract', 'and', 'result'];
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentIndex > 0) {
      const newStep = steps[currentIndex - 1];
      setCurrentStep(newStep);
    }
  };

  const reset = () => {
    setResult(null);
    setCurrentStep('input');
    setNumber(8);
  };

  const renderBinaryBits = (binary: string, label: string, highlight?: 'set' | 'flipped' | 'result') => {
    return (
      <div className="space-y-2">
        <div className="text-sm font-medium text-center">{label}</div>
        <div className="flex justify-center gap-1">
          {binary.split('').map((bit, index) => {
            let className = 'w-10 h-10 flex items-center justify-center rounded border-2 font-mono font-bold text-lg ';
            
            if (highlight === 'set' && bit === '1') {
              className += 'bg-blue-100 border-blue-300 text-blue-800';
            } else if (highlight === 'flipped' && bit === '1') {
              className += 'bg-orange-100 border-orange-300 text-orange-800';
            } else if (highlight === 'result' && bit === '1') {
              className += 'bg-red-100 border-red-300 text-red-800';
            } else if (bit === '1') {
              className += 'bg-green-100 border-green-300 text-green-800';
            } else {
              className += 'bg-gray-100 border-gray-300 text-gray-600';
            }

            return (
              <motion.div
                key={index}
                className={className}
                initial={{ scale: 1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
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

  const powersOfTwo = [1, 2, 4, 8, 16, 32, 64, 128, 256];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Power of Two Check Visualizer</h3>
        <p className="text-muted-foreground">
          Visualize the n & (n-1) == 0 trick for checking powers of 2
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Number to Check</label>
          <Input
            type="number"
            value={number}
            onChange={(e) => setNumber(parseInt(e.target.value) || 0)}
            placeholder="Enter number"
            min="1"
            max="256"
          />
        </div>

        <div className="flex gap-2 items-end">
          <Button onClick={checkPowerOfTwo} className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Check
          </Button>
          <Button onClick={reset} variant="outline">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Visualization */}
      {result && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950 dark:to-pink-900 p-8 rounded-xl border-2 border-dashed border-purple-200 dark:border-purple-800">
          <div className="space-y-8">
            {/* Step Indicator */}
            <div className="flex justify-center items-center gap-4">
              <div className={`flex items-center gap-2 px-3 py-1 rounded ${currentStep === 'input' ? 'bg-blue-100 text-blue-800' : 'text-gray-500'}`}>
                <Binary className="h-4 w-4" />
                Input
              </div>
              <div className="w-8 h-0.5 bg-gray-300"></div>
              <div className={`flex items-center gap-2 px-3 py-1 rounded ${currentStep === 'subtract' ? 'bg-orange-100 text-orange-800' : 'text-gray-500'}`}>
                Subtract 1
              </div>
              <div className="w-8 h-0.5 bg-gray-300"></div>
              <div className={`flex items-center gap-2 px-3 py-1 rounded ${currentStep === 'and' ? 'bg-red-100 text-red-800' : 'text-gray-500'}`}>
                AND Operation
              </div>
              <div className="w-8 h-0.5 bg-gray-300"></div>
              <div className={`flex items-center gap-2 px-3 py-1 rounded ${currentStep === 'result' ? 'bg-green-100 text-green-800' : 'text-gray-500'}`}>
                {result.isPowerOfTwo ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                Result
              </div>
            </div>

            {/* Binary Visualization */}
            <div className="space-y-6">
              {currentStep === 'input' && (
                <div className="space-y-4">
                  {renderBinaryBits(result.binary, `${result.number} in binary`, 'set')}
                  <div className="text-center text-sm text-muted-foreground">
                    Powers of 2 have exactly one bit set (one '1' in binary)
                  </div>
                </div>
              )}

              {currentStep === 'subtract' && (
                <div className="space-y-4">
                  {renderBinaryBits(result.binary, `${result.number} in binary`, 'set')}
                  <div className="text-center text-lg font-bold">-1</div>
                  {renderBinaryBits(result.minusOneBinary, `${result.minusOne} in binary`, 'flipped')}
                  <div className="text-center text-sm text-muted-foreground">
                    Subtracting 1 flips all bits after (and including) the rightmost set bit
                  </div>
                </div>
              )}

              {currentStep === 'and' && (
                <div className="space-y-4">
                  {renderBinaryBits(result.binary, `${result.number} in binary`)}
                  <div className="text-center text-lg font-bold">&</div>
                  {renderBinaryBits(result.minusOneBinary, `${result.minusOne} in binary`)}
                  <div className="text-center text-lg font-bold">=</div>
                  {renderBinaryBits(result.andResultBinary, `${result.andResult} in binary`, 'result')}
                  <div className="text-center text-sm text-muted-foreground">
                    AND operation: 1 & 1 = 1, everything else = 0
                  </div>
                </div>
              )}

              {currentStep === 'result' && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className={`text-4xl font-bold mb-2 ${result.isPowerOfTwo ? 'text-green-600' : 'text-red-600'}`}>
                      {result.isPowerOfTwo ? '✓' : '✗'}
                    </div>
                    <div className="text-xl font-semibold mb-2">
                      {result.number} {result.isPowerOfTwo ? 'IS' : 'IS NOT'} a power of 2
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {result.explanation}
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
                    <div className="text-center">
                      <div className="font-mono text-lg">
                        {result.number} & ({result.number} - 1) = {result.number} & {result.minusOne} = {result.andResult}
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">
                        {result.andResult === 0 ? 'Result is 0 → Power of 2!' : 'Result is not 0 → Not a power of 2'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step Controls */}
            <div className="flex justify-center gap-4">
              <Button 
                onClick={prevStep} 
                disabled={currentStep === 'input'}
                variant="outline"
              >
                Previous
              </Button>
              <Button 
                onClick={nextStep} 
                disabled={currentStep === 'result'}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Powers of Two Reference */}
      <div className="bg-card border rounded-lg p-4">
        <h4 className="font-semibold mb-4">Powers of 2 Reference:</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-sm">
          {powersOfTwo.map(power => (
            <div key={power} className="text-center p-2 bg-muted rounded">
              <div className="font-mono font-bold">{power}</div>
              <div className="text-xs text-muted-foreground">{power.toString(2).padStart(8, '0')}</div>
              <div className="text-xs">2^{Math.log2(power)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Algorithm Explanation */}
      <div className="bg-card border rounded-lg p-4">
        <h4 className="font-semibold mb-4">Why This Works:</h4>
        <div className="space-y-2 text-sm">
          <div><strong>Key Insight:</strong> Powers of 2 have exactly one bit set in binary</div>
          <div><strong>The Trick:</strong> When you subtract 1 from a power of 2, all bits after the set bit flip</div>
          <div><strong>AND Result:</strong> The original number AND (number-1) will be 0 only for powers of 2</div>
          <div><strong>Example:</strong> 8 (1000) & 7 (0111) = 0000 = 0 ✓</div>
          <div><strong>Counter-example:</strong> 6 (0110) & 5 (0101) = 0100 = 4 ≠ 0 ✗</div>
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