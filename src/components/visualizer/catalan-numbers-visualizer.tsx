import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Binary, RotateCcw, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

interface ParenthesesPattern {
  pattern: string;
  valid: boolean;
}

export function CatalanNumbersVisualizer() {
  const [n, setN] = useState(3);
  const [catalanValue, setCatalanValue] = useState(0);
  const [parentheses, setParentheses] = useState<ParenthesesPattern[]>([]);
  const [binaryTrees, setBinaryTrees] = useState<number>(0);
  const [paths, setPaths] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMemory, setShowMemory] = useState(false);

  const {
    voiceEnabled,
    setVoiceEnabled,
    speed,
    setSpeed,
    speakOperation,
    speakStep,
    speakResult,
  } = useVisualizerVoice({ minInterval: 2000 });

  // Calculate Catalan number using DP
  const calculateCatalan = (num: number): number => {
    if (num <= 1) return 1;
    const dp = Array(num + 1).fill(0);
    dp[0] = dp[1] = 1;

    for (let i = 2; i <= num; i++) {
      for (let j = 0; j < i; j++) {
        dp[i] += dp[j] * dp[i - 1 - j];
      }
    }
    return dp[num];
  };

  // Generate all valid parentheses combinations
  const generateParentheses = (n: number): ParenthesesPattern[] => {
    const result: ParenthesesPattern[] = [];
    
    const backtrack = (current: string, open: number, close: number) => {
      if (current.length === 2 * n) {
        result.push({ pattern: current, valid: true });
        return;
      }
      
      if (open < n) {
        backtrack(current + '(', open + 1, close);
      }
      if (close < open) {
        backtrack(current + ')', open, close + 1);
      }
    };
    
    backtrack('', 0, 0);
    return result;
  };

  // Generate Dyck paths (lattice paths that don't cross diagonal)
  const generateDyckPaths = (n: number): string[] => {
    const paths: string[] = [];
    
    const backtrack = (path: string, up: number, down: number) => {
      if (up === n && down === n) {
        paths.push(path);
        return;
      }
      
      if (up < n) {
        backtrack(path + 'U', up + 1, down);
      }
      if (down < up) {
        backtrack(path + 'D', up, down + 1);
      }
    };
    
    backtrack('', 0, 0);
    return paths;
  };

  const calculate = () => {
    const value = calculateCatalan(n);
    setCatalanValue(value);
    
    speakOperation('Catalan Numbers', `Computing the ${n}th Catalan number`);
    
    if (n <= 4) {
      const parens = generateParentheses(n);
      setParentheses(parens);
      
      const dyckPaths = generateDyckPaths(n);
      setPaths(dyckPaths);
    } else {
      setParentheses([]);
      setPaths([]);
    }
    
    setBinaryTrees(value);
    setCurrentStep(0);
    setIsPlaying(true);
    
    speakResult(`The ${n}th Catalan number is ${value}`);
  };

  useEffect(() => {
    if (isPlaying && currentStep < parentheses.length) {
      const speedMultiplier = speed === 'slow' ? 0.5 : speed === 'fast' ? 2 : 1;
      const timer = setTimeout(() => {
        speakStep(
          'Pattern',
          `Valid parentheses pattern ${currentStep + 1}`,
          currentStep + 1,
          parentheses.length
        );
        setCurrentStep(prev => prev + 1);
      }, 1500 / speedMultiplier);
      return () => clearTimeout(timer);
    } else if (isPlaying && currentStep >= parentheses.length) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, parentheses, speed, speakStep]);

  const reset = () => {
    setCatalanValue(0);
    setParentheses([]);
    setPaths([]);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const renderDyckPath = (path: string, index: number) => {
    const points: [number, number][] = [[0, 0]];
    let x = 0, y = 0;
    
    for (const char of path) {
      if (char === 'U') y++;
      else x++;
      points.push([x, y]);
    }
    
    const scale = 30;
    const pathString = points.map(([x, y], i) => 
      `${i === 0 ? 'M' : 'L'} ${x * scale} ${(n - y) * scale}`
    ).join(' ');
    
    return (
      <svg
        key={index}
        width={n * scale + 10}
        height={n * scale + 10}
        className="border border-gray-300 dark:border-gray-600 rounded"
      >
        {/* Grid */}
        {Array.from({ length: n + 1 }).map((_, i) => (
          <g key={`grid-${i}`}>
            <line
              x1={0}
              y1={i * scale}
              x2={n * scale}
              y2={i * scale}
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-gray-300 dark:text-gray-600"
            />
            <line
              x1={i * scale}
              y1={0}
              x2={i * scale}
              y2={n * scale}
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-gray-300 dark:text-gray-600"
            />
          </g>
        ))}
        
        {/* Diagonal */}
        <line
          x1={0}
          y1={n * scale}
          x2={n * scale}
          y2={0}
          stroke="red"
          strokeWidth="1"
          strokeDasharray="4"
        />
        
        {/* Path */}
        <path
          d={pathString}
          fill="none"
          stroke="blue"
          strokeWidth="2"
        />
        
        {/* Points */}
        {points.map(([x, y], i) => (
          <circle
            key={i}
            cx={x * scale}
            cy={(n - y) * scale}
            r="3"
            fill="blue"
          />
        ))}
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Binary className="w-5 h-5" />
            Catalan Numbers Visualizer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">n (Catalan Number Index)</label>
            <Input
              type="number"
              value={n}
              onChange={(e) => setN(Math.max(0, Math.min(10, Number(e.target.value))))}
              min={0}
              max={10}
            />
            <p className="text-xs text-gray-500 mt-1">
              Limited to n ≤ 10 for visualization purposes
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={calculate} className="flex-1">
              <Play className="w-4 h-4 mr-2" />
              Calculate C({n})
            </Button>
            <Button onClick={reset} variant="outline">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          {catalanValue > 0 && (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-blue-100 dark:bg-blue-900/20 border border-blue-500 rounded-lg"
              >
                <div className="text-center">
                  <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    {n}th Catalan Number
                  </div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    C({n}) = {catalanValue}
                  </div>
                </div>
              </motion.div>

              <Tabs defaultValue="parentheses" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="parentheses">Parentheses</TabsTrigger>
                  <TabsTrigger value="paths">Dyck Paths</TabsTrigger>
                  <TabsTrigger value="trees">Binary Trees</TabsTrigger>
                </TabsList>

                <TabsContent value="parentheses" className="space-y-4">
                  {n <= 4 ? (
                    <>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setIsPlaying(!isPlaying)}
                          variant="outline"
                          size="sm"
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <VisualizerControls
                          showMemory={showMemory}
                          onToggleMemory={setShowMemory}
                          voiceEnabled={voiceEnabled}
                          onToggleVoice={setVoiceEnabled}
                          voiceSpeed={speed}
                          onVoiceSpeedChange={setSpeed}
                        />
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        <AnimatePresence>
                          {parentheses.map((p, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{
                                opacity: idx < currentStep || !isPlaying ? 1 : 0.3,
                                scale: idx === currentStep - 1 ? 1.05 : 1
                              }}
                              className={`p-3 rounded-lg border text-center font-mono ${
                                idx === currentStep - 1
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                  : 'border-gray-200 dark:border-gray-700'
                              }`}
                            >
                              {p.pattern}
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </>
                  ) : (
                    <p className="text-center text-gray-500">
                      Too many combinations to display (C({n}) = {catalanValue})
                    </p>
                  )}
                </TabsContent>

                <TabsContent value="paths" className="space-y-4">
                  {n <= 4 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {paths.map((path, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-2">
                          {renderDyckPath(path, idx)}
                          <span className="text-xs font-mono">{path}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500">
                      Too many paths to display (C({n}) = {catalanValue})
                    </p>
                  )}
                </TabsContent>

                <TabsContent value="trees" className="space-y-4">
                  <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-lg font-semibold mb-2">
                      Number of Full Binary Trees with {n} Internal Nodes
                    </div>
                    <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                      {binaryTrees}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                      Each Catalan number also counts the number of different ways to arrange
                      {n} pairs of parentheses, {n + 1} leaves in a binary tree, and many other structures.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Catalan Numbers Applications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <strong>Definition:</strong> C(n) = (2n)! / ((n+1)! × n!)
          </p>
          <p>
            <strong>Recurrence:</strong> C(n) = Σ C(i) × C(n-1-i) for i = 0 to n-1
          </p>
          <p>
            <strong>Applications:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Valid parentheses combinations</li>
            <li>Number of full binary trees</li>
            <li>Dyck paths (lattice paths not crossing diagonal)</li>
            <li>Ways to triangulate a polygon</li>
            <li>Mountain ranges with n upstrokes and n downstrokes</li>
          </ul>
          <p>
            <strong>Sequence:</strong> 1, 1, 2, 5, 14, 42, 132, 429, 1430, 4862, ...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
