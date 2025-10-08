import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, RotateCcw, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

interface GCDStep {
  a: number;
  b: number;
  remainder: number;
  operation: string;
  description: string;
}

export function GCDEuclideanVisualizer() {
  const [inputA, setInputA] = useState(48);
  const [inputB, setInputB] = useState(18);
  const [steps, setSteps] = useState<GCDStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  const {
    voiceEnabled,
    setVoiceEnabled,
    speed,
    setSpeed,
    speakOperation,
    speakStep,
    speakResult,
  } = useVisualizerVoice({ minInterval: 2000 });

  const calculateGCD = () => {
    const newSteps: GCDStep[] = [];
    let a = Math.abs(inputA);
    let b = Math.abs(inputB);

    speakOperation('Euclidean GCD Algorithm', `Computing GCD of ${a} and ${b} using the Euclidean algorithm`);

    while (b !== 0) {
      const remainder = a % b;
      newSteps.push({
        a,
        b,
        remainder,
        operation: `${a} = ${b} × ${Math.floor(a / b)} + ${remainder}`,
        description: `Divide ${a} by ${b}, remainder is ${remainder}`
      });
      a = b;
      b = remainder;
    }

    setSteps(newSteps);
    setResult(a);
    setCurrentStep(0);
    speakResult(`GCD is ${a}`);
  };

  useEffect(() => {
    if (isPlaying && currentStep < steps.length) {
      const timer = setTimeout(() => {
        const step = steps[currentStep];
        speakStep('GCD Step', step.description, currentStep + 1, steps.length);
        setCurrentStep(prev => prev + 1);
      }, 2000 / speed);
      return () => clearTimeout(timer);
    } else if (isPlaying && currentStep >= steps.length) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, steps, speed, speakStep]);

  const reset = () => {
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
    setResult(null);
  };

  // Geometric visualization: rectangles
  const renderGeometricView = () => {
    if (steps.length === 0 || currentStep === 0) return null;
    const step = steps[Math.min(currentStep - 1, steps.length - 1)];
    const maxDim = Math.max(step.a, step.b);
    const scale = 300 / maxDim;

    return (
      <div className="flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="border-2 border-blue-500"
            style={{
              width: step.a * scale,
              height: step.b * scale,
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
              {step.a} × {step.b}
            </div>
          </motion.div>
          {step.remainder > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute top-0 right-0 border-2 border-red-500 bg-red-100 dark:bg-red-900"
              style={{
                width: step.remainder * scale,
                height: step.b * scale,
              }}
            >
              <div className="flex items-center justify-center h-full text-xs font-semibold">
                r={step.remainder}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Euclidean GCD Algorithm
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Number A</label>
              <Input
                type="number"
                value={inputA}
                onChange={(e) => setInputA(Number(e.target.value))}
                min={1}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Number B</label>
              <Input
                type="number"
                value={inputB}
                onChange={(e) => setInputB(Number(e.target.value))}
                min={1}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={calculateGCD} className="flex-1">
              <Calculator className="w-4 h-4 mr-2" />
              Calculate GCD
            </Button>
            <Button onClick={reset} variant="outline">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          {steps.length > 0 && (
            <>
              <VisualizerControls
                isPlaying={isPlaying}
                onPlayPause={() => setIsPlaying(!isPlaying)}
                onReset={reset}
                speed={speed}
                onSpeedChange={setSpeed}
                voiceEnabled={voiceEnabled}
                onVoiceToggle={() => setVoiceEnabled(!voiceEnabled)}
              />

              {renderGeometricView()}

              <div className="space-y-2">
                <h3 className="font-semibold">Algorithm Steps:</h3>
                <AnimatePresence>
                  {steps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{
                        opacity: index <= currentStep ? 1 : 0.3,
                        x: 0,
                        scale: index === currentStep - 1 ? 1.02 : 1
                      }}
                      className={`p-3 rounded-lg border ${
                        index === currentStep - 1
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <Badge variant="outline" className="mb-1">
                            Step {index + 1}
                          </Badge>
                          <div className="font-mono text-sm">{step.operation}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {step.description}
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          {step.remainder}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {result !== null && currentStep >= steps.length && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-green-100 dark:bg-green-900/20 border border-green-500 rounded-lg"
                >
                  <div className="text-center">
                    <div className="text-sm font-medium text-green-800 dark:text-green-200">
                      Greatest Common Divisor
                    </div>
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                      GCD({inputA}, {inputB}) = {result}
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <strong>Euclidean Algorithm:</strong> Repeatedly replace the larger number with the remainder
            of dividing the larger by the smaller until one number becomes zero.
          </p>
          <p>
            <strong>Key Insight:</strong> GCD(a, b) = GCD(b, a mod b)
          </p>
          <p>
            <strong>Time Complexity:</strong> O(log min(a, b))
          </p>
          <p>
            <strong>Geometric Interpretation:</strong> Finding the largest square that can tile a rectangle.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
