import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, RotateCcw, TrendingDown, TrendingUp, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CallFrame {
  id: number;
  name: string;
  params: string;
  accumulator?: number;
  depth: number;
  isTailCall: boolean;
  result?: number;
}

interface ComparisonStep {
  regularStack: CallFrame[];
  tailStack: CallFrame[];
  message: string;
  phase: 'calling' | 'returning' | 'complete';
  highlightDifference: boolean;
}

type Algorithm = 'factorial' | 'sum' | 'fibonacci';

export function TailRecursionUniqueViz() {
  const [algorithm, setAlgorithm] = useState<Algorithm>('factorial');
  const [input, setInput] = useState(5);
  const [steps, setSteps] = useState<ComparisonStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [showComparison, setShowComparison] = useState(true);

  // Generate regular factorial steps
  const generateRegularFactorial = (n: number): CallFrame[] => {
    const frames: CallFrame[] = [];
    let id = 0;

    const factorial = (num: number, depth: number): number => {
      const frame: CallFrame = {
        id: id++,
        name: 'factorial',
        params: `n=${num}`,
        depth,
        isTailCall: false
      };
      frames.push(frame);

      if (num <= 1) {
        frame.result = 1;
        return 1;
      }

      const result = factorial(num - 1, depth + 1);
      frame.result = num * result;
      return frame.result;
    };

    factorial(n, 0);
    return frames;
  };

  // Generate tail recursive factorial steps
  const generateTailFactorial = (n: number): CallFrame[] => {
    const frames: CallFrame[] = [];
    let id = 0;

    const factorialTail = (num: number, acc: number, depth: number): number => {
      const frame: CallFrame = {
        id: id++,
        name: 'factorialTail',
        params: `n=${num}, acc=${acc}`,
        accumulator: acc,
        depth,
        isTailCall: true
      };
      frames.push(frame);

      if (num <= 1) {
        frame.result = acc;
        return acc;
      }

      return factorialTail(num - 1, num * acc, depth + 1);
    };

    factorialTail(n, 1, 0);
    return frames;
  };

  // Generate regular sum steps
  const generateRegularSum = (n: number): CallFrame[] => {
    const frames: CallFrame[] = [];
    let id = 0;

    const sum = (num: number, depth: number): number => {
      const frame: CallFrame = {
        id: id++,
        name: 'sum',
        params: `n=${num}`,
        depth,
        isTailCall: false
      };
      frames.push(frame);

      if (num <= 0) {
        frame.result = 0;
        return 0;
      }

      const result = sum(num - 1, depth + 1);
      frame.result = num + result;
      return frame.result;
    };

    sum(n, 0);
    return frames;
  };

  // Generate tail recursive sum steps
  const generateTailSum = (n: number): CallFrame[] => {
    const frames: CallFrame[] = [];
    let id = 0;

    const sumTail = (num: number, acc: number, depth: number): number => {
      const frame: CallFrame = {
        id: id++,
        name: 'sumTail',
        params: `n=${num}, acc=${acc}`,
        accumulator: acc,
        depth,
        isTailCall: true
      };
      frames.push(frame);

      if (num <= 0) {
        frame.result = acc;
        return acc;
      }

      return sumTail(num - 1, acc + num, depth + 1);
    };

    sumTail(n, 0, 0);
    return frames;
  };

  const startVisualization = () => {
    const n = Math.min(input, 7);
    let regularFrames: CallFrame[] = [];
    let tailFrames: CallFrame[] = [];

    switch (algorithm) {
      case 'factorial':
        regularFrames = generateRegularFactorial(n);
        tailFrames = generateTailFactorial(n);
        break;
      case 'sum':
        regularFrames = generateRegularSum(n);
        tailFrames = generateTailSum(n);
        break;
    }

    // Create comparison steps
    const newSteps: ComparisonStep[] = [];
    const maxLength = Math.max(regularFrames.length, tailFrames.length);

    for (let i = 0; i < maxLength; i++) {
      const regularStack = regularFrames.slice(0, i + 1);
      const tailStack = tailFrames.slice(0, i + 1);
      
      newSteps.push({
        regularStack,
        tailStack,
        message: i < regularFrames.length 
          ? `Step ${i + 1}: Building call stack`
          : `Step ${i + 1}: Returning values`,
        phase: i < regularFrames.length ? 'calling' : 'returning',
        highlightDifference: regularStack.length !== tailStack.length
      });
    }

    newSteps.push({
      regularStack: regularFrames,
      tailStack: tailFrames,
      message: 'Complete! Notice the difference in stack usage',
      phase: 'complete',
      highlightDifference: true
    });

    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, steps.length, speed]);

  const renderStack = (frames: CallFrame[], title: string, color: string, isTail: boolean) => {
    const maxDepth = frames.length > 0 ? Math.max(...frames.map(f => f.depth)) : 0;
    
    return (
      <div className="flex-1">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold flex items-center gap-2">
              {isTail ? <Zap className="h-5 w-5 text-green-600" /> : <TrendingDown className="h-5 w-5 text-blue-600" />}
              {title}
            </h4>
            <Badge variant={isTail ? "default" : "secondary"}>
              Max Depth: {maxDepth + 1}
            </Badge>
          </div>

          <div className="space-y-2 min-h-[300px]">
            {frames.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No active calls
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {frames.map((frame, index) => (
                  <motion.div
                    key={frame.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={`p-3 rounded-lg border-2 ${color}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold">
                          {frame.name}({frame.params})
                        </span>
                        {frame.isTailCall && (
                          <Badge variant="outline" className="text-xs bg-green-100 text-green-800">
                            Tail Call
                          </Badge>
                        )}
                      </div>
                      {frame.result !== undefined && (
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="font-bold text-green-600">
                            → {frame.result}
                          </span>
                        </div>
                      )}
                    </div>
                    {frame.accumulator !== undefined && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Accumulator: {frame.accumulator}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground mt-1">
                      Depth: {frame.depth} | Call #{index + 1}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Stack metrics */}
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Total Calls</div>
                <div className="font-bold text-lg">{frames.length}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Space Used</div>
                <div className="font-bold text-lg">
                  {isTail ? 'O(1)' : `O(${maxDepth + 1})`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          <Zap className="h-6 w-6 text-green-600" />
          Tail Recursion Optimization
        </h3>
        <p className="text-muted-foreground">
          Compare regular recursion vs tail recursion - see how tail calls use constant space!
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Algorithm</label>
          <Select value={algorithm} onValueChange={(v: Algorithm) => setAlgorithm(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="factorial">Factorial</SelectItem>
              <SelectItem value="sum">Sum (1 to n)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Input (max 7)</label>
          <Input
            type="number"
            value={input}
            onChange={(e) => setInput(Math.min(7, Math.max(1, parseInt(e.target.value) || 1)))}
            min="1"
            max="7"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Speed</label>
          <Select value={speed.toString()} onValueChange={(v) => setSpeed(parseInt(v))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1500">Slow</SelectItem>
              <SelectItem value="1000">Normal</SelectItem>
              <SelectItem value="500">Fast</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 items-end">
          <Button onClick={startVisualization} className="flex-1">
            <RotateCcw className="h-4 w-4 mr-2" />
            Start
          </Button>
          {steps.length > 0 && (
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              variant="outline"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </div>

      {/* Visualization */}
      {steps.length > 0 && currentStepData && (
        <div className="space-y-6">
          {/* Current Message */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950 rounded-lg p-4 text-center border-2">
            <div className="text-lg font-semibold">{currentStepData.message}</div>
            {currentStepData.highlightDifference && (
              <div className="text-sm text-muted-foreground mt-2">
                ⚡ Notice: Tail recursion maintains constant stack depth!
              </div>
            )}
          </div>

          {/* Side-by-side comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderStack(
              currentStepData.regularStack,
              'Regular Recursion',
              'bg-blue-50 border-blue-300 dark:bg-blue-900/30 dark:border-blue-600',
              false
            )}
            {renderStack(
              currentStepData.tailStack,
              'Tail Recursion',
              'bg-green-50 border-green-300 dark:bg-green-900/30 dark:border-green-600',
              true
            )}
          </div>

          {/* Progress */}
          <div className="flex items-center justify-between gap-4">
            <Button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              variant="outline"
              size="sm"
            >
              Previous
            </Button>
            <div className="flex-1">
              <div className="text-center text-sm text-muted-foreground mb-2">
                Step {currentStep + 1} of {steps.length}
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>
            <Button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              disabled={currentStep === steps.length - 1}
              variant="outline"
              size="sm"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Educational Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-3 text-blue-600">📚 Regular Recursion</h4>
          <div className="space-y-2 text-sm">
            <div>• Builds up call stack</div>
            <div>• Computes after recursive call</div>
            <div>• Space: O(n)</div>
            <div>• Risk of stack overflow</div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-3 text-green-600">⚡ Tail Recursion</h4>
          <div className="space-y-2 text-sm">
            <div>• Recursive call is last operation</div>
            <div>• Passes result in accumulator</div>
            <div>• Space: O(1) with optimization</div>
            <div>• Can be converted to loop</div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-3 text-purple-600">🎯 Key Difference</h4>
          <div className="space-y-2 text-sm">
            <div>• <strong>Regular:</strong> n * factorial(n-1)</div>
            <div>• <strong>Tail:</strong> factorial(n-1, n*acc)</div>
            <div>• Tail call = no pending operations</div>
            <div>• Compiler can optimize tail calls</div>
          </div>
        </div>
      </div>
    </div>
  );
}
