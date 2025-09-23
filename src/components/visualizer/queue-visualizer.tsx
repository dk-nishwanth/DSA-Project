import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Eye, RotateCcw } from 'lucide-react';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

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
    speakOperation,
    speakResult
  } = useVisualizerVoice({ minInterval: 2000 });

  const handleEnqueue = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) return;

    setIsAnimating(true);
    const opText = `Enqueueing ${value} to the rear of the queue`;
    setOperation(opText);
    speakOperation("Enqueue Operation", `Adding ${value} to the back of the queue. Queue follows FIFO - First In, First Out principle.`);

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
      speakResult(`Successfully enqueued ${value}. Queue now has ${queue.length + 1} elements.`);
    }, 1000);
  };

  const handleDequeue = () => {
    if (queue.length === 0) return;

    setIsAnimating(true);
    const frontValue = queue[0].value;
    const opText = `Dequeuing ${frontValue} from the front of the queue`;
    setOperation(opText);
    speakOperation("Dequeue Operation", `Removing ${frontValue} from the front of the queue. This is the first element that was added.`);
    setHighlightedIndex(0);

    setTimeout(() => {
      setQueue(prev => prev.slice(1));
      setHighlightedIndex(null);
      setIsAnimating(false);
      setOperation(null);
      speakResult(`Successfully dequeued ${frontValue}. Queue now has ${queue.length - 1} elements.`);
    }, 800);
  };

  const handlePeek = () => {
    if (queue.length === 0) return;

    setIsAnimating(true);
    const frontValue = queue[0].value;
    const opText = `Front element: ${frontValue}`;
    setOperation(opText);
    speakOperation("Peek Operation", `Looking at the front element without removing it. The front element is ${frontValue}.`);
    setHighlightedIndex(0);

    setTimeout(() => {
      setHighlightedIndex(null);
      setIsAnimating(false);
      setOperation(null);
      speakResult(`Peek complete. Front element is ${frontValue}, queue remains unchanged.`);
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
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Queue Visualizer</h3>
        <p className="text-muted-foreground">
          First In, First Out data structure with enqueue, dequeue, and peek operations
        </p>
      </div>

      {/* Queue Visualization */}
      <div className="bg-gradient-visualization rounded-xl border-2 border-primary/20 p-6">
        <div className="flex flex-col items-center gap-4 min-h-[200px]">
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
                        ? 'bg-primary text-primary-foreground border-primary shadow-lg' 
                        : 'bg-card border-border hover:border-primary/50'
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

      {/* Memory Layout */}
      {showMemory && (
        <MemoryLayout
          title="Queue Memory Layout"
          data={queue.map(item => item.value)}
          baseAddress={0x3000}
        />
      )}

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