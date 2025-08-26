import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, Plus, Minus, Search, Lightbulb, Clock } from 'lucide-react';

interface ArrayVisualizerProps {
  initialArray?: number[];
}

export function ArrayVisualizer({ initialArray = [64, 25, 12, 22, 11] }: ArrayVisualizerProps) {
  const [array, setArray] = useState<number[]>(initialArray);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedIndices, setHighlightedIndices] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [operation, setOperation] = useState<'insert' | 'delete' | 'search' | null>(null);

  const handleInsert = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) return;
    
    setIsAnimating(true);
    setOperation('insert');
    
    setTimeout(() => {
      setArray(prev => [...prev, value]);
      setHighlightedIndices([array.length]);
      setInputValue('');
      
      setTimeout(() => {
        setHighlightedIndices([]);
        setIsAnimating(false);
        setOperation(null);
      }, 1000);
    }, 300);
  };

  const handleDelete = () => {
    if (array.length === 0) return;
    
    setIsAnimating(true);
    setOperation('delete');
    setHighlightedIndices([array.length - 1]);
    
    setTimeout(() => {
      setArray(prev => prev.slice(0, -1));
      setHighlightedIndices([]);
      setIsAnimating(false);
      setOperation(null);
    }, 800);
  };

  const handleSearch = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) return;
    
    setIsAnimating(true);
    setOperation('search');
    
    let step = 0;
    const searchInterval = setInterval(() => {
      if (step < array.length) {
        setHighlightedIndices([step]);
        if (array[step] === value) {
          setTimeout(() => {
            setHighlightedIndices([]);
            setIsAnimating(false);
            setOperation(null);
          }, 1000);
          clearInterval(searchInterval);
          return;
        }
        step++;
      } else {
        setHighlightedIndices([]);
        setIsAnimating(false);
        setOperation(null);
        clearInterval(searchInterval);
      }
    }, 500);
  };

  const handleReset = () => {
    setArray(initialArray);
    setHighlightedIndices([]);
    setIsAnimating(false);
    setOperation(null);
    setCurrentStep(0);
  };

  return (
    <div className="visualization-container p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Array Operations</h3>
        <p className="text-muted-foreground text-sm">
          Interactive array visualization with insert, delete, and search operations
        </p>
      </div>

      {/* Array Visualization */}
      <div className="mb-8">
        <div className="flex items-end justify-center gap-2 min-h-[200px] p-4">
          <AnimatePresence mode="popLayout">
            {array.map((value, index) => (
              <motion.div
                key={`${index}-${value}`}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  scale: highlightedIndices.includes(index) ? 1.1 : 1,
                  y: 0 
                }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ 
                  duration: 0.3,
                  type: "spring",
                  stiffness: 200,
                  damping: 20
                }}
                className={`
                  flex flex-col items-center gap-2 p-3 rounded-lg border-2 min-w-[60px]
                  ${highlightedIndices.includes(index) 
                    ? 'bg-animation-highlight border-animation-highlight shadow-glow' 
                    : 'bg-card border-border'
                  }
                  transition-all duration-300
                `}
              >
                <span className="text-lg font-bold">{value}</span>
                <span className="text-xs text-muted-foreground">{index}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex gap-2">
            <Input
              placeholder="Enter value"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-24"
              type="number"
            />
            <Button 
              onClick={handleInsert}
              disabled={isAnimating || !inputValue}
              size="sm"
              className="control-button"
            >
              <Plus className="h-4 w-4 mr-1" />
              Insert
            </Button>
          </div>
          
          <Button 
            onClick={handleDelete}
            disabled={isAnimating || array.length === 0}
            size="sm"
            variant="destructive"
          >
            <Minus className="h-4 w-4 mr-1" />
            Delete
          </Button>
          
          <Button 
            onClick={handleSearch}
            disabled={isAnimating || !inputValue}
            size="sm"
            variant="secondary"
          >
            <Search className="h-4 w-4 mr-1" />
            Search
          </Button>
          
          <Button 
            onClick={handleReset}
            disabled={isAnimating}
            size="sm"
            variant="outline"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>

        {/* Status */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">
            Length: {array.length}
          </Badge>
          {operation && (
            <Badge variant="secondary" className="animate-pulse">
              {operation.charAt(0).toUpperCase() + operation.slice(1)}ing...
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}