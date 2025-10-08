import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GitBranch, RotateCcw, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

interface FactorNode {
  value: number;
  isPrime: boolean;
  factors?: [number, number];
  level: number;
  position: number;
}

export function PrimeFactorizationVisualizer() {
  const [inputN, setInputN] = useState(60);
  const [tree, setTree] = useState<FactorNode[]>([]);
  const [primeFactors, setPrimeFactors] = useState<Map<number, number>>(new Map());
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
  } = useVisualizerVoice({ minInterval: 1500 });

  const isPrime = (n: number): boolean => {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    for (let i = 3; i * i <= n; i += 2) {
      if (n % i === 0) return false;
    }
    return true;
  };

  const buildFactorTree = (n: number, level = 0, position = 0): FactorNode[] => {
    if (isPrime(n) || n === 1) {
      return [{ value: n, isPrime: true, level, position }];
    }

    // Find smallest prime factor
    let factor = 2;
    if (n % 2 !== 0) {
      for (let i = 3; i * i <= n; i += 2) {
        if (n % i === 0) {
          factor = i;
          break;
        }
      }
      if (factor === 2) factor = n; // n is prime
    }

    const other = n / factor;
    const node: FactorNode = {
      value: n,
      isPrime: false,
      factors: [factor, other],
      level,
      position
    };

    const leftTree = buildFactorTree(factor, level + 1, position * 2);
    const rightTree = buildFactorTree(other, level + 1, position * 2 + 1);

    return [node, ...leftTree, ...rightTree];
  };

  const calculateFactorization = () => {
    speakOperation('Prime Factorization', `Finding prime factors of ${inputN}`);
    
    const treeNodes = buildFactorTree(inputN);
    setTree(treeNodes);

    // Extract prime factors with exponents
    const factors = new Map<number, number>();
    let n = inputN;
    
    for (let i = 2; i <= n; i++) {
      while (n % i === 0) {
        factors.set(i, (factors.get(i) || 0) + 1);
        n /= i;
      }
    }

    setPrimeFactors(factors);
    setCurrentStep(0);
    setIsPlaying(true);

    const factorStr = Array.from(factors.entries())
      .map(([p, exp]) => exp > 1 ? `${p}^${exp}` : `${p}`)
      .join(' × ');
    speakResult(`Prime factorization: ${factorStr}`);
  };

  useEffect(() => {
    if (isPlaying && currentStep < tree.length) {
      const speedMultiplier = speed === 'slow' ? 0.5 : speed === 'fast' ? 2 : 1;
      const timer = setTimeout(() => {
        const node = tree[currentStep];
        if (!node.isPrime && node.factors) {
          speakStep(
            'Factoring',
            `${node.value} equals ${node.factors[0]} times ${node.factors[1]}`,
            currentStep + 1,
            tree.length
          );
        }
        setCurrentStep(prev => prev + 1);
      }, 1500 / speedMultiplier);
      return () => clearTimeout(timer);
    } else if (isPlaying && currentStep >= tree.length) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, tree, speed, speakStep]);

  const reset = () => {
    setTree([]);
    setPrimeFactors(new Map());
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const renderTree = () => {
    if (tree.length === 0) return null;

    const maxLevel = Math.max(...tree.map(n => n.level));
    const levelWidth = 600;

    return (
      <div className="relative h-96 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 overflow-auto">
        <svg width={levelWidth} height={maxLevel * 80 + 60} className="mx-auto">
          {/* Draw connections */}
          {tree.map((node, idx) => {
            if (!node.factors) return null;
            const x = levelWidth / 2 - (node.position - Math.pow(2, node.level) / 2) * (levelWidth / Math.pow(2, node.level + 1));
            const y = node.level * 80 + 30;

            const leftChild = tree.find(n => n.level === node.level + 1 && n.position === node.position * 2);
            const rightChild = tree.find(n => n.level === node.level + 1 && n.position === node.position * 2 + 1);

            return (
              <g key={`conn-${idx}`}>
                {leftChild && (
                  <line
                    x1={x}
                    y1={y}
                    x2={levelWidth / 2 - (leftChild.position - Math.pow(2, leftChild.level) / 2) * (levelWidth / Math.pow(2, leftChild.level + 1))}
                    y2={leftChild.level * 80 + 30}
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-gray-400"
                  />
                )}
                {rightChild && (
                  <line
                    x1={x}
                    y1={y}
                    x2={levelWidth / 2 - (rightChild.position - Math.pow(2, rightChild.level) / 2) * (levelWidth / Math.pow(2, rightChild.level + 1))}
                    y2={rightChild.level * 80 + 30}
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-gray-400"
                  />
                )}
              </g>
            );
          })}

          {/* Draw nodes */}
          {tree.map((node, idx) => {
            const x = levelWidth / 2 - (node.position - Math.pow(2, node.level) / 2) * (levelWidth / Math.pow(2, node.level + 1));
            const y = node.level * 80 + 30;
            const isVisible = idx < currentStep;

            return (
              <motion.g
                key={`node-${idx}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <circle
                  cx={x}
                  cy={y}
                  r="25"
                  fill={node.isPrime ? '#10b981' : '#3b82f6'}
                  stroke="white"
                  strokeWidth="2"
                />
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="14"
                  fontWeight="bold"
                >
                  {node.value}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            Prime Factorization Tree
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Number to Factorize</label>
            <Input
              type="number"
              value={inputN}
              onChange={(e) => setInputN(Math.max(2, Number(e.target.value)))}
              min={2}
              max={10000}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={calculateFactorization} className="flex-1">
              <Play className="w-4 h-4 mr-2" />
              Factorize
            </Button>
            <Button onClick={reset} variant="outline">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          {tree.length > 0 && (
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

              {renderTree()}

              {primeFactors.size > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-100 dark:bg-green-900/20 border border-green-500 rounded-lg"
                >
                  <div className="text-center space-y-2">
                    <div className="text-sm font-medium text-green-800 dark:text-green-200">
                      Prime Factorization
                    </div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {inputN} = {Array.from(primeFactors.entries())
                        .map(([p, exp]) => exp > 1 ? `${p}^${exp}` : `${p}`)
                        .join(' × ')}
                    </div>
                    <div className="flex gap-2 justify-center flex-wrap">
                      {Array.from(primeFactors.entries()).map(([prime, exp]) => (
                        <Badge key={prime} variant="outline" className="bg-green-50 dark:bg-green-900">
                          {prime}{exp > 1 && <sup>{exp}</sup>}
                        </Badge>
                      ))}
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
          <CardTitle>Understanding Prime Factorization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <strong>Fundamental Theorem of Arithmetic:</strong> Every integer greater than 1 can be
            uniquely represented as a product of prime numbers.
          </p>
          <p>
            <strong>Algorithm:</strong> Repeatedly divide by the smallest prime factor until only 1 remains.
          </p>
          <p>
            <strong>Applications:</strong> Cryptography (RSA), GCD/LCM calculations, simplifying fractions.
          </p>
          <p className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-blue-500"></span>
            <span>Composite numbers (can be factored)</span>
          </p>
          <p className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-green-500"></span>
            <span>Prime numbers (cannot be factored further)</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
