import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, Plus, Minus, Search, Lightbulb, Clock } from 'lucide-react';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';
import { toast } from 'sonner';

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
  const [showMemory, setShowMemory] = useState(false);
  const [currentStepText, setCurrentStepText] = useState('');
  
  const {
    voiceEnabled,
    setVoiceEnabled,
    speed,
    setSpeed,
    isSpeaking,
    pauseSpeech,
    resumeSpeech,
    stopSpeech,
    speakStep,
    speakOperation,
    speakResult
  } = useVisualizerVoice({ minInterval: 2000 });

  const handleInsert = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      toast.error('Please enter a valid number');
      return;
    }
    
    setIsAnimating(true);
    setOperation('insert');
    setCurrentStepText(`Inserting ${value} at the end of the array`);
    speakOperation("Array Insert", `Inserting ${value} at the end of the array. This is an O(1) operation since we're adding to the end.`);
    
    setTimeout(() => {
      setArray(prev => [...prev, value]);
      setHighlightedIndices([array.length]);
      setInputValue('');
      setCurrentStepText(`Successfully inserted ${value} at index ${array.length}`);
      speakResult(`Successfully inserted ${value} at index ${array.length}. Array length is now ${array.length + 1}.`);
      toast.success(`Inserted ${value} at index ${array.length}`);
      
      setTimeout(() => {
        setHighlightedIndices([]);
        setIsAnimating(false);
        setOperation(null);
        setCurrentStepText('');
      }, 1500);
    }, 500);
  };

  const handleDelete = () => {
    if (array.length === 0) {
      toast.error('Array is empty');
      return;
    }
    
    setIsAnimating(true);
    setOperation('delete');
    const lastIndex = array.length - 1;
    const lastValue = array[lastIndex];
    setHighlightedIndices([lastIndex]);
    setCurrentStepText(`Deleting element ${lastValue} from index ${lastIndex}`);
    speakOperation("Array Delete", `Deleting element ${lastValue} from the end of the array. This is an O(1) operation.`);
    
    setTimeout(() => {
      setArray(prev => prev.slice(0, -1));
      setCurrentStepText(`Successfully deleted ${lastValue}. Array length is now ${array.length - 1}`);
      speakResult(`Successfully deleted ${lastValue}. Array length is now ${array.length - 1}.`);
      toast.success(`Deleted ${lastValue} from index ${lastIndex}`);
      setHighlightedIndices([]);
      setIsAnimating(false);
      setOperation(null);
      
      setTimeout(() => {
        setCurrentStepText('');
      }, 1500);
    }, 800);
  };

  const handleSearch = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      toast.error('Please enter a valid number to search');
      return;
    }
    
    setIsAnimating(true);
    setOperation('search');
    setCurrentStepText(`Starting linear search for ${value}`);
    speakOperation("Linear Search", `Starting linear search for ${value}. We'll check each element sequentially until we find it or reach the end.`);
    
    let step = 0;
    const searchInterval = setInterval(() => {
      if (step < array.length) {
        setHighlightedIndices([step]);
        setCurrentStepText(`Checking index ${step}: ${array[step]} ${array[step] === value ? '✓ Found!' : '≠ ' + value}`);
        speakStep("", `Checking index ${step}. Value is ${array[step]}.`, step + 1, array.length);
        
        if (array[step] === value) {
          setTimeout(() => {
            setCurrentStepText(`Found ${value} at index ${step}!`);
            speakResult(`Success! Found ${value} at index ${step}. Linear search completed in ${step + 1} comparisons.`);
            toast.success(`Found ${value} at index ${step}`);
            setHighlightedIndices([]);
            setIsAnimating(false);
            setOperation(null);
            setTimeout(() => setCurrentStepText(''), 2000);
          }, 1000);
          clearInterval(searchInterval);
          return;
        }
        step++;
      } else {
        setCurrentStepText(`${value} not found in the array`);
        speakResult(`Search completed. ${value} was not found in the array after checking all ${array.length} elements.`);
        toast.error(`${value} not found in array`);
        setHighlightedIndices([]);
        setIsAnimating(false);
        setOperation(null);
        setTimeout(() => setCurrentStepText(''), 2000);
        clearInterval(searchInterval);
      }
    }, 800);
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
      <div className="mb-8 p-6 bg-gradient-visualization rounded-xl border-2 border-primary/20">
        <h3 className="text-lg font-semibold mb-4 text-center">Array Visualization</h3>
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
                    ? 'bg-primary text-primary-foreground border-primary shadow-lg' 
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
        
        {/* Current Step Display */}
        {currentStepText && (
          <div className="mt-4 p-3 bg-muted/20 rounded-lg border">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{currentStepText}</span>
            </div>
          </div>
        )}
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
          <Badge variant="outline">
            Max Index: {array.length - 1}
          </Badge>
          {operation && (
            <Badge variant="secondary" className="animate-pulse">
              {operation.charAt(0).toUpperCase() + operation.slice(1)}ing...
            </Badge>
          )}
        </div>
      </div>

      {/* Algorithm Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-2">Array Operations:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li><strong>Insert (End):</strong> O(1) - Add element to end of array</li>
            <li><strong>Delete (End):</strong> O(1) - Remove last element</li>
            <li><strong>Linear Search:</strong> O(n) - Check each element sequentially</li>
            <li><strong>Access by Index:</strong> O(1) - Direct memory access</li>
          </ul>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-2">Key Concepts:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li><strong>Contiguous Memory:</strong> Elements stored in adjacent memory locations</li>
            <li><strong>Zero-based Indexing:</strong> First element at index 0</li>
            <li><strong>Fixed Size:</strong> Static arrays have predetermined capacity</li>
            <li><strong>Cache Friendly:</strong> Sequential access patterns optimize performance</li>
          </ul>
        </div>
      </div>

      {/* Memory Layout */}
      {showMemory && (
        <div className="mb-6">
          <MemoryLayout
            title="Array Memory Layout"
            data={array}
            baseAddress={0x1000}
          />
        </div>
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