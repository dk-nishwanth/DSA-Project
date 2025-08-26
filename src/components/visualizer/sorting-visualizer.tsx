import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, Shuffle, SkipForward } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SortingVisualizerProps {
  algorithm?: 'bubble' | 'insertion' | 'selection' | 'merge' | 'quick' | 'counting' | 'radix' | 'bucket';
}

export function SortingVisualizer({ algorithm = 'bubble' }: SortingVisualizerProps) {
  const [array, setArray] = useState<number[]>([64, 34, 25, 12, 22, 11, 90]);
  const [originalArray, setOriginalArray] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [comparingIndices, setComparingIndices] = useState<number[]>([]);
  const [swappingIndices, setSwappingIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<Set<number>>(new Set());
  const [speed, setSpeed] = useState(1000);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(algorithm);

  const generateRandomArray = () => {
    const newArray = Array.from({ length: 8 }, () => Math.floor(Math.random() * 90) + 10);
    setArray([...newArray]);
    setOriginalArray([...newArray]);
    reset();
  };

  const reset = () => {
    setIsAnimating(false);
    setCurrentStep(0);
    setComparingIndices([]);
    setSwappingIndices([]);
    setSortedIndices(new Set());
    if (originalArray.length > 0) {
      setArray([...originalArray]);
    }
  };

  const bubbleSort = async () => {
    const arr = [...array];
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        setComparingIndices([j, j + 1]);
        await new Promise(resolve => setTimeout(resolve, speed));
        
        if (arr[j] > arr[j + 1]) {
          setSwappingIndices([j, j + 1]);
          await new Promise(resolve => setTimeout(resolve, speed / 2));
          
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          
          await new Promise(resolve => setTimeout(resolve, speed / 2));
          setSwappingIndices([]);
        }
        
        setComparingIndices([]);
      }
      setSortedIndices(prev => new Set([...prev, n - 1 - i]));
    }
    setSortedIndices(new Set(Array.from({ length: n }, (_, i) => i)));
  };

  const startSorting = async () => {
    if (originalArray.length === 0) {
      setOriginalArray([...array]);
    }
    
    setIsAnimating(true);
    
    switch (selectedAlgorithm) {
      case 'bubble':
        await bubbleSort();
        break;
      // Add other algorithms here
      default:
        await bubbleSort();
    }
    
    setIsAnimating(false);
  };

  const getBarColor = (index: number) => {
    if (sortedIndices.has(index)) return 'bg-success';
    if (swappingIndices.includes(index)) return 'bg-destructive';
    if (comparingIndices.includes(index)) return 'bg-warning';
    return 'bg-primary';
  };

  const maxValue = Math.max(...array);

  return (
    <div className="visualization-container p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Sorting Algorithm Visualization</h3>
        <p className="text-muted-foreground text-sm">
          Watch how different sorting algorithms organize data step by step
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-3">
          <Select value={selectedAlgorithm} onValueChange={(value: any) => setSelectedAlgorithm(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bubble">Bubble Sort</SelectItem>
              <SelectItem value="insertion">Insertion Sort</SelectItem>
              <SelectItem value="selection">Selection Sort</SelectItem>
              <SelectItem value="merge">Merge Sort</SelectItem>
              <SelectItem value="quick">Quick Sort</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            onClick={startSorting}
            disabled={isAnimating}
            size="sm"
            className="control-button"
          >
            <Play className="h-4 w-4 mr-1" />
            Start
          </Button>
          
          <Button 
            onClick={reset}
            disabled={isAnimating}
            size="sm"
            variant="outline"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
          
          <Button 
            onClick={generateRandomArray}
            disabled={isAnimating}
            size="sm"
            variant="secondary"
          >
            <Shuffle className="h-4 w-4 mr-1" />
            Random
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-muted-foreground">Speed:</label>
          <input
            type="range"
            min="100"
            max="2000"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-32"
            disabled={isAnimating}
          />
          <span className="text-xs text-muted-foreground">{speed}ms</span>
        </div>
      </div>

      {/* Visualization */}
      <div className="mb-8">
        <div className="flex items-end justify-center gap-2 min-h-[300px] p-4 bg-card/50 rounded-xl border">
          <AnimatePresence mode="popLayout">
            {array.map((value, index) => (
              <motion.div
                key={`${index}-${value}`}
                layout
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: 1,
                  scale: swappingIndices.includes(index) ? 1.05 : 1
                }}
                transition={{ 
                  duration: 0.3,
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
                className={`
                  relative flex flex-col items-center gap-2 min-w-[40px] transition-all duration-300
                `}
              >
                <motion.div
                  className={`
                    w-8 rounded-t transition-all duration-300 ${getBarColor(index)}
                    ${comparingIndices.includes(index) ? 'animate-pulse' : ''}
                  `}
                  style={{ 
                    height: `${(value / maxValue) * 200}px`,
                    minHeight: '20px'
                  }}
                />
                <span className="text-xs font-mono text-foreground">{value}</span>
                <span className="text-xs text-muted-foreground">{index}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Status */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline">
          Array Length: {array.length}
        </Badge>
        {isAnimating && (
          <Badge variant="secondary" className="animate-pulse">
            Sorting...
          </Badge>
        )}
        {sortedIndices.size === array.length && !isAnimating && (
          <Badge variant="default" className="bg-success text-success-foreground">
            ✓ Sorted!
          </Badge>
        )}
        
        <div className="flex gap-2 ml-auto">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-primary rounded"></div>
            <span className="text-xs text-muted-foreground">Unsorted</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-warning rounded"></div>
            <span className="text-xs text-muted-foreground">Comparing</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-destructive rounded"></div>
            <span className="text-xs text-muted-foreground">Swapping</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-success rounded"></div>
            <span className="text-xs text-muted-foreground">Sorted</span>
          </div>
        </div>
      </div>
    </div>
  );
}