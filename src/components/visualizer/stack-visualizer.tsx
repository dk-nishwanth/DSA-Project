import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Eye, RotateCcw } from 'lucide-react';
import { ComplexityBox } from '@/components/complexity-box';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVoiceExplain } from '@/hooks/useVoiceExplain';

interface StackItem {
  id: string;
  value: number;
}

export function StackVisualizer() {
  const [stack, setStack] = useState<StackItem[]>([
    { id: '1', value: 30 },
    { id: '2', value: 20 },
    { id: '3', value: 10 }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [operation, setOperation] = useState<string>('');
  const [showMemory, setShowMemory] = useState(false);
  const { enabled: voiceEnabled, setEnabled: setVoiceEnabled } = useVoiceExplain(operation);

  const handlePush = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) return;

    setIsAnimating(true);
    setOperation(`Pushing ${value}`);

    const newItem: StackItem = {
      id: Date.now().toString(),
      value
    };

    setStack(prev => [...prev, newItem]);
    setHighlightedIndex(stack.length);
    setInputValue('');

    setTimeout(() => {
      setHighlightedIndex(null);
      setIsAnimating(false);
      setOperation('');
    }, 1000);
  };

  const handlePop = () => {
    if (stack.length === 0) return;

    setIsAnimating(true);
    setOperation(`Popping ${stack[stack.length - 1].value}`);
    setHighlightedIndex(stack.length - 1);

    setTimeout(() => {
      setStack(prev => prev.slice(0, -1));
      setHighlightedIndex(null);
      setIsAnimating(false);
      setOperation('');
    }, 800);
  };

  const handlePeek = () => {
    if (stack.length === 0) return;

    setIsAnimating(true);
    setOperation(`Top element: ${stack[stack.length - 1].value}`);
    setHighlightedIndex(stack.length - 1);

    setTimeout(() => {
      setHighlightedIndex(null);
      setIsAnimating(false);
      setOperation('');
    }, 1500);
  };

  const handleReset = () => {
    setStack([
      { id: '1', value: 30 },
      { id: '2', value: 20 },
      { id: '3', value: 10 }
    ]);
    setHighlightedIndex(null);
    setIsAnimating(false);
    setOperation('');
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Stack Visualizer</h3>
        <p className="text-muted-foreground">
          Last In, First Out data structure with push, pop, and peek operations
        </p>
      </div>

      {/* Stack Visualization */}
      <div className="bg-gradient-visualization rounded-xl border-2 border-primary/20 p-6">
        <div className="flex flex-col items-center justify-end min-h-[300px] p-4">
          <div className="flex flex-col-reverse gap-1 items-center">
            <AnimatePresence mode="popLayout">
              {stack.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8, y: -20 }}
                  animate={{
                    opacity: 1,
                    scale: highlightedIndex === index ? 1.1 : 1,
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
                    flex items-center justify-center w-32 h-12 rounded-lg border-2 relative
                    ${highlightedIndex === index
                      ? 'bg-primary text-primary-foreground border-primary shadow-lg'
                      : 'bg-card border-border hover:border-primary/50'
                    }
                    transition-all duration-300
                  `}
                >
                  <span className="text-lg font-bold">{item.value}</span>
                  {index === stack.length - 1 && (
                    <div className="absolute -right-16 text-sm text-primary font-medium">
                      ← TOP
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Stack Base */}
            <div className="w-36 h-3 bg-muted rounded-lg mt-2" />
            <span className="text-xs text-muted-foreground mt-1">Stack Base</span>
          </div>

          {stack.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Stack is empty
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center">
        <VisualizerControls
          showMemory={showMemory}
          onToggleMemory={setShowMemory}
          voiceEnabled={voiceEnabled}
          onToggleVoice={setVoiceEnabled}
        />
      </div>

      {/* Memory Layout */}
      {showMemory && (
        <MemoryLayout
          data={stack.map(item => item.value)}
          title="Stack Memory Layout (LIFO)"
          baseAddress={6000}
          wordSize={4}
        />
      )}

      {/* Complexity Analysis */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex gap-2">
            <Input
              placeholder="Enter value"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-32"
              type="number"
            />
            <Button 
              onClick={handlePush}
              disabled={isAnimating || !inputValue}
              size="sm"
              className="control-button"
            >
              <Plus className="h-4 w-4 mr-1" />
              Push
            </Button>
          </div>
          
          <Button 
            onClick={handlePop}
            disabled={isAnimating || stack.length === 0}
            size="sm"
            variant="destructive"
          >
            <Minus className="h-4 w-4 mr-1" />
            Pop
          </Button>
          
          <Button 
            onClick={handlePeek}
            disabled={isAnimating || stack.length === 0}
            size="sm"
            variant="secondary"
          >
            <Eye className="h-4 w-4 mr-1" />
            Peek
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
            Size: {stack.length}
          </Badge>
          <Badge variant="outline">
            Top: {stack.length > 0 ? stack[stack.length - 1].value : 'Empty'}
          </Badge>
          {operation && (
            <Badge variant="secondary" className="animate-pulse">
              {operation}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}