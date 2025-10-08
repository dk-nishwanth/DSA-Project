import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, RotateCcw, ArrowDown, ArrowUp, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CallFrame {
  id: number;
  name: string;
  param: number;
  depth: number;
  state: 'calling' | 'waiting' | 'returning';
  result?: number;
  children: number[];
  parent?: number;
}

interface Step {
  frames: CallFrame[];
  activeId: number;
  message: string;
  phase: 'descending' | 'base' | 'ascending';
}

type Algorithm = 'factorial' | 'sum' | 'power' | 'countdown';

export function RecursionFundamentalsUniqueViz() {
  const [algorithm, setAlgorithm] = useState<Algorithm>('factorial');
  const [input, setInput] = useState(5);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  // Generate steps for factorial
  const generateFactorialSteps = (n: number): Step[] => {
    const steps: Step[] = [];
    const frames: Map<number, CallFrame> = new Map();
    let frameId = 0;

    const factorial = (num: number, depth: number, parentId?: number): number => {
      const id = frameId++;
      const frame: CallFrame = {
        id,
        name: `factorial(${num})`,
        param: num,
        depth,
        state: 'calling',
        children: [],
        parent: parentId
      };

      if (parentId !== undefined) {
        frames.get(parentId)?.children.push(id);
      }

      frames.set(id, frame);
      steps.push({
        frames: Array.from(frames.values()),
        activeId: id,
        message: `📞 Calling factorial(${num}) at depth ${depth}`,
        phase: 'descending'
      });

      if (num <= 1) {
        frame.state = 'returning';
        frame.result = 1;
        steps.push({
          frames: Array.from(frames.values()),
          activeId: id,
          message: `✅ Base case! factorial(${num}) = 1`,
          phase: 'base'
        });
        return 1;
      }

      frame.state = 'waiting';
      steps.push({
        frames: Array.from(frames.values()),
        activeId: id,
        message: `⏳ factorial(${num}) waiting for factorial(${num - 1})`,
        phase: 'descending'
      });

      const result = factorial(num - 1, depth + 1, id);
      
      frame.state = 'returning';
      frame.result = num * result;
      steps.push({
        frames: Array.from(frames.values()),
        activeId: id,
        message: `↩️ factorial(${num}) = ${num} × ${result} = ${frame.result}`,
        phase: 'ascending'
      });

      return frame.result;
    };

    factorial(n, 0);
    return steps;
  };

  // Generate steps for sum
  const generateSumSteps = (n: number): Step[] => {
    const steps: Step[] = [];
    const frames: Map<number, CallFrame> = new Map();
    let frameId = 0;

    const sum = (num: number, depth: number, parentId?: number): number => {
      const id = frameId++;
      const frame: CallFrame = {
        id,
        name: `sum(${num})`,
        param: num,
        depth,
        state: 'calling',
        children: [],
        parent: parentId
      };

      if (parentId !== undefined) {
        frames.get(parentId)?.children.push(id);
      }

      frames.set(id, frame);
      steps.push({
        frames: Array.from(frames.values()),
        activeId: id,
        message: `📞 Calling sum(${num}) - sum from 1 to ${num}`,
        phase: 'descending'
      });

      if (num <= 0) {
        frame.state = 'returning';
        frame.result = 0;
        steps.push({
          frames: Array.from(frames.values()),
          activeId: id,
          message: `✅ Base case! sum(0) = 0`,
          phase: 'base'
        });
        return 0;
      }

      frame.state = 'waiting';
      const result = sum(num - 1, depth + 1, id);
      
      frame.state = 'returning';
      frame.result = num + result;
      steps.push({
        frames: Array.from(frames.values()),
        activeId: id,
        message: `↩️ sum(${num}) = ${num} + sum(${num - 1}) = ${num} + ${result} = ${frame.result}`,
        phase: 'ascending'
      });

      return frame.result;
    };

    sum(n, 0);
    return steps;
  };

  // Generate steps for power
  const generatePowerSteps = (base: number, exp: number): Step[] => {
    const steps: Step[] = [];
    const frames: Map<number, CallFrame> = new Map();
    let frameId = 0;

    const power = (b: number, e: number, depth: number, parentId?: number): number => {
      const id = frameId++;
      const frame: CallFrame = {
        id,
        name: `power(${b}, ${e})`,
        param: e,
        depth,
        state: 'calling',
        children: [],
        parent: parentId
      };

      if (parentId !== undefined) {
        frames.get(parentId)?.children.push(id);
      }

      frames.set(id, frame);
      steps.push({
        frames: Array.from(frames.values()),
        activeId: id,
        message: `📞 Calling power(${b}, ${e}) - ${b} to the power of ${e}`,
        phase: 'descending'
      });

      if (e === 0) {
        frame.state = 'returning';
        frame.result = 1;
        steps.push({
          frames: Array.from(frames.values()),
          activeId: id,
          message: `✅ Base case! Any number to power 0 = 1`,
          phase: 'base'
        });
        return 1;
      }

      frame.state = 'waiting';
      const result = power(b, e - 1, depth + 1, id);
      
      frame.state = 'returning';
      frame.result = b * result;
      steps.push({
        frames: Array.from(frames.values()),
        activeId: id,
        message: `↩️ power(${b}, ${e}) = ${b} × power(${b}, ${e - 1}) = ${b} × ${result} = ${frame.result}`,
        phase: 'ascending'
      });

      return frame.result;
    };

    power(base, exp, 0);
    return steps;
  };

  // Generate steps for countdown
  const generateCountdownSteps = (n: number): Step[] => {
    const steps: Step[] = [];
    const frames: Map<number, CallFrame> = new Map();
    let frameId = 0;

    const countdown = (num: number, depth: number, parentId?: number): void => {
      const id = frameId++;
      const frame: CallFrame = {
        id,
        name: `countdown(${num})`,
        param: num,
        depth,
        state: 'calling',
        children: [],
        parent: parentId
      };

      if (parentId !== undefined) {
        frames.get(parentId)?.children.push(id);
      }

      frames.set(id, frame);
      steps.push({
        frames: Array.from(frames.values()),
        activeId: id,
        message: `📞 Calling countdown(${num}) - printing ${num}`,
        phase: 'descending'
      });

      if (num <= 0) {
        frame.state = 'returning';
        frame.result = 0;
        steps.push({
          frames: Array.from(frames.values()),
          activeId: id,
          message: `✅ Base case! Countdown complete!`,
          phase: 'base'
        });
        return;
      }

      frame.state = 'waiting';
      countdown(num - 1, depth + 1, id);
      
      frame.state = 'returning';
      frame.result = num;
      steps.push({
        frames: Array.from(frames.values()),
        activeId: id,
        message: `↩️ countdown(${num}) returns after printing`,
        phase: 'ascending'
      });
    };

    countdown(n, 0);
    return steps;
  };

  const startVisualization = () => {
    let newSteps: Step[] = [];
    
    switch (algorithm) {
      case 'factorial':
        newSteps = generateFactorialSteps(Math.min(input, 6));
        break;
      case 'sum':
        newSteps = generateSumSteps(Math.min(input, 6));
        break;
      case 'power':
        newSteps = generatePowerSteps(2, Math.min(input, 6));
        break;
      case 'countdown':
        newSteps = generateCountdownSteps(Math.min(input, 6));
        break;
    }

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

  const currentStepData = steps[currentStep];
  const maxDepth = currentStepData ? Math.max(...currentStepData.frames.map(f => f.depth)) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Recursion Fundamentals</h3>
        <p className="text-muted-foreground">
          Visualize how recursion works: function calls itself, reaches base case, then returns back up
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
              <SelectItem value="factorial">Factorial (n!)</SelectItem>
              <SelectItem value="sum">Sum (1 to n)</SelectItem>
              <SelectItem value="power">Power (2^n)</SelectItem>
              <SelectItem value="countdown">Countdown</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Input (max 6)</label>
          <Input
            type="number"
            value={input}
            onChange={(e) => setInput(Math.min(6, Math.max(0, parseInt(e.target.value) || 0)))}
            min="0"
            max="6"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Speed (ms)</label>
          <Select value={speed.toString()} onValueChange={(v) => setSpeed(parseInt(v))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2000">Slow (2s)</SelectItem>
              <SelectItem value="1000">Normal (1s)</SelectItem>
              <SelectItem value="500">Fast (0.5s)</SelectItem>
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
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 p-8 rounded-xl border-2">
          {/* Current Message */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 text-center">
            <div className="text-lg font-semibold">{currentStepData.message}</div>
            <div className="text-sm text-muted-foreground mt-2">
              Phase: <Badge variant={
                currentStepData.phase === 'descending' ? 'default' :
                currentStepData.phase === 'base' ? 'secondary' : 'outline'
              }>
                {currentStepData.phase === 'descending' ? '⬇️ Going Down' :
                 currentStepData.phase === 'base' ? '🎯 Base Case' : '⬆️ Coming Back'}
              </Badge>
            </div>
          </div>

          {/* Call Stack Visualization */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Call Stack (Depth: {maxDepth + 1})
              </h4>
              <div className="text-sm text-muted-foreground">
                Active calls: {currentStepData.frames.length}
              </div>
            </div>

            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {currentStepData.frames
                  .sort((a, b) => b.depth - a.depth)
                  .map((frame) => (
                    <motion.div
                      key={frame.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        frame.id === currentStepData.activeId
                          ? frame.state === 'calling'
                            ? 'bg-blue-100 border-blue-400 dark:bg-blue-900/50'
                            : frame.state === 'waiting'
                            ? 'bg-yellow-100 border-yellow-400 dark:bg-yellow-900/50'
                            : 'bg-green-100 border-green-400 dark:bg-green-900/50'
                          : 'bg-gray-50 border-gray-200 dark:bg-gray-700/50'
                      }`}
                      style={{ marginLeft: `${frame.depth * 20}px` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="font-mono font-bold text-lg">
                            {frame.name}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Depth {frame.depth}
                          </Badge>
                          {frame.state === 'waiting' && (
                            <Badge variant="secondary" className="text-xs">
                              ⏳ Waiting
                            </Badge>
                          )}
                        </div>
                        {frame.result !== undefined && (
                          <div className="flex items-center gap-2">
                            <ArrowUp className="h-4 w-4 text-green-600" />
                            <span className="font-bold text-lg text-green-600">
                              {frame.result}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
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
                  className="bg-blue-600 h-2 rounded-full transition-all"
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-3 text-blue-600">🎯 Key Concepts</h4>
          <div className="space-y-2 text-sm">
            <div>• <strong>Base Case:</strong> Condition that stops recursion</div>
            <div>• <strong>Recursive Case:</strong> Function calls itself</div>
            <div>• <strong>Call Stack:</strong> Tracks all active function calls</div>
            <div>• <strong>Unwinding:</strong> Returning values back up the stack</div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-3 text-purple-600">⚡ Complexity</h4>
          <div className="space-y-2 text-sm">
            <div>• <strong>Time:</strong> Depends on number of calls</div>
            <div>• <strong>Space:</strong> O(n) for call stack depth</div>
            <div>• <strong>Risk:</strong> Stack overflow with deep recursion</div>
            <div>• <strong>Optimization:</strong> Tail recursion, memoization</div>
          </div>
        </div>
      </div>
    </div>
  );
}
