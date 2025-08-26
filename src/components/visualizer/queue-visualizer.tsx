import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Eye, RotateCcw } from 'lucide-react';

interface QueueItem {
  id: string;
  value: number;
}

export function QueueVisualizer() {
  const [queue, setQueue] = useState<QueueItem[]>([
    { id: '1', value: 10 },
    { id: '2', value: 20 },
    { id: '3', value: 30 }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);

  const handleEnqueue = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) return;

    setIsAnimating(true);
    setOperation(`Enqueueing ${value}`);

    const newItem: QueueItem = {
      id: Date.now().toString(),
      value
    };

    setQueue(prev => [...prev, newItem]);
    setHighlightedIndex(queue.length);
    setInputValue('');

    setTimeout(() => {
      setHighlightedIndex(null);
      setIsAnimating(false);
      setOperation(null);
    }, 1000);
  };

  const handleDequeue = () => {
    if (queue.length === 0) return;

    setIsAnimating(true);
    setOperation(`Dequeuing ${queue[0].value}`);
    setHighlightedIndex(0);

    setTimeout(() => {
      setQueue(prev => prev.slice(1));
      setHighlightedIndex(null);
      setIsAnimating(false);
      setOperation(null);
    }, 800);
  };

  const handlePeek = () => {
    if (queue.length === 0) return;

    setIsAnimating(true);
    setOperation(`Front element: ${queue[0].value}`);
    setHighlightedIndex(0);

    setTimeout(() => {
      setHighlightedIndex(null);
      setIsAnimating(false);
      setOperation(null);
    }, 1500);
  };

  const handleReset = () => {
    setQueue([
      { id: '1', value: 10 },
      { id: '2', value: 20 },
      { id: '3', value: 30 }
    ]);
    setHighlightedIndex(null);
    setIsAnimating(false);
    setOperation(null);
  };

  return (
    <div className="visualization-container p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Queue Operations (FIFO)</h3>
        <p className="text-muted-foreground text-sm">
          First In, First Out data structure with enqueue, dequeue, and peek operations
        </p>
      </div>

      {/* Queue Visualization */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex flex-col items-center gap-4 min-h-[200px] p-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-primary font-medium">FRONT</span>
            <div className="flex items-center gap-1">
              <AnimatePresence mode="popLayout">
                {queue.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8, x: 30 }}
                    animate={{ 
                      opacity: 1, 
                      scale: highlightedIndex === index ? 1.1 : 1,
                      x: 0 
                    }}
                    exit={{ opacity: 0, scale: 0.8, x: -30 }}
                    transition={{ 
                      duration: 0.3,
                      type: "spring",
                      stiffness: 200,
                      damping: 20
                    }}
                    className={`
                      flex items-center justify-center w-16 h-16 rounded-lg border-2
                      ${highlightedIndex === index
                        ? 'bg-animation-highlight border-animation-highlight shadow-glow' 
                        : 'bg-card border-border'
                      }
                      transition-all duration-300
                    `}
                  >
                    <span className="text-lg font-bold">{item.value}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <span className="text-sm text-primary font-medium">REAR</span>
          </div>
          
          {/* Queue Labels */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex flex-col items-center">
              <span>Dequeue</span>
              <span>removes from front</span>
            </div>
            <div className="w-px h-8 bg-border mx-4" />
            <div className="flex flex-col items-center">
              <span>Enqueue</span>
              <span>adds to rear</span>
            </div>
          </div>
          
          {queue.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Queue is empty
            </div>
          )}
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
              className="w-32"
              type="number"
            />
            <Button 
              onClick={handleEnqueue}
              disabled={isAnimating || !inputValue}
              size="sm"
              className="control-button"
            >
              <Plus className="h-4 w-4 mr-1" />
              Enqueue
            </Button>
          </div>
          
          <Button 
            onClick={handleDequeue}
            disabled={isAnimating || queue.length === 0}
            size="sm"
            variant="destructive"
          >
            <Minus className="h-4 w-4 mr-1" />
            Dequeue
          </Button>
          
          <Button 
            onClick={handlePeek}
            disabled={isAnimating || queue.length === 0}
            size="sm"
            variant="secondary"
          >
            <Eye className="h-4 w-4 mr-1" />
            Peek Front
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
            Size: {queue.length}
          </Badge>
          <Badge variant="outline">
            Front: {queue.length > 0 ? queue[0].value : 'Empty'}
          </Badge>
          <Badge variant="outline">
            Rear: {queue.length > 0 ? queue[queue.length - 1].value : 'Empty'}
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