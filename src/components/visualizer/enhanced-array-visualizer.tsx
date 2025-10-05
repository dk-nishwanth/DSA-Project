import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Minus, Search, RotateCcw, Zap, HardDrive, Info, Play } from 'lucide-react';
import { toast } from 'sonner';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';

interface ArrayVisualizerProps {
  initialArray?: number[];
}

type OperationType = 'access' | 'insert' | 'delete' | 'search' | 'traverse' | null;
type InsertPosition = 'beginning' | 'end' | 'middle';

export function EnhancedArrayVisualizer({ initialArray = [64, 25, 12, 22, 11] }: ArrayVisualizerProps) {
  const [array, setArray] = useState<number[]>(initialArray);
  const [isAnimating, setIsAnimating] = useState(false);
  const [highlightedIndices, setHighlightedIndices] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [insertPosition, setInsertPosition] = useState<InsertPosition>('end');
  const [operation, setOperation] = useState<OperationType>(null);
  const [currentStep, setCurrentStep] = useState('');
  const [memoryAddresses, setMemoryAddresses] = useState<number[]>([]);
  const [showMemoryView, setShowMemoryView] = useState(false);
  const [operationCount, setOperationCount] = useState(0);
  const [timeComplexity, setTimeComplexity] = useState('O(1)');
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

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const generateMemoryAddresses = () => {
    const baseAddress = 0x1000;
    return array.map((_, index) => baseAddress + (index * 4));
  };

  useEffect(() => {
    setMemoryAddresses(generateMemoryAddresses());
  }, [array]);

  const handleAccess = async () => {
    const index = parseInt(inputValue);
    if (isNaN(index) || index < 0 || index >= array.length) {
      toast.error('Please enter a valid index (0 to ' + (array.length - 1) + ')');
      return;
    }

    setIsAnimating(true);
    setOperation('access');
    setTimeComplexity('O(1)');
    const stepText = `Accessing element at index ${index}`;
    setCurrentStep(stepText);
    speakOperation("Array Access", stepText);
    setOperationCount(1);

    setHighlightedIndices([index]);
    await sleep(800);
    
    const resultText = `Found value ${array[index]} at index ${index}`;
    setCurrentStep(resultText);
    speakResult(resultText);
    toast.success(`Array[${index}] = ${array[index]}`);
    
    await sleep(1200);
    setHighlightedIndices([]);
    setIsAnimating(false);
    setOperation(null);
    setCurrentStep('');
  };

  const handleInsert = async () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      toast.error('Please enter a valid number');
      return;
    }

    setIsAnimating(true);
    setOperation('insert');
    setOperationCount(0);
    
    let newArray = [...array];
    let insertIndex = 0;
    let complexity = 'O(1)';

    switch (insertPosition) {
      case 'beginning':
        insertIndex = 0;
        complexity = 'O(n)';
        const stepText = 'Inserting at beginning - need to shift all elements';
        setCurrentStep(stepText);
        speakOperation("Insert at Beginning", stepText);
        
        // Show shifting animation
        for (let i = array.length - 1; i >= 0; i--) {
          setHighlightedIndices([i, i + 1]);
          setOperationCount(prev => prev + 1);
          speakStep("", `Shifting element ${array[i]} from position ${i} to position ${i + 1}`, i + 1, array.length);
          await sleep(400);
        }
        
        newArray.unshift(value);
        const resultText = `Inserted ${value} at beginning`;
        setCurrentStep(resultText);
        speakResult(resultText);
        break;
        
      case 'end':
        insertIndex = array.length;
        complexity = 'O(1)';
        const endStepText = 'Inserting at end - direct append';
        setCurrentStep(endStepText);
        speakOperation("Insert at End", endStepText);
        newArray.push(value);
        setOperationCount(1);
        const endResultText = `Inserted ${value} at end`;
        setCurrentStep(endResultText);
        speakResult(endResultText);
        break;
        
      case 'middle':
        const middleIndex = Math.floor(array.length / 2);
        insertIndex = middleIndex;
        complexity = 'O(n)';
        const middleStepText = `Inserting at middle (index ${middleIndex}) - need to shift elements`;
        setCurrentStep(middleStepText);
        speakOperation("Insert at Middle", middleStepText);
        
        // Show shifting animation
        for (let i = array.length - 1; i >= middleIndex; i--) {
          setHighlightedIndices([i, i + 1]);
          setOperationCount(prev => prev + 1);
          speakStep("", `Shifting element ${array[i]} from position ${i} to position ${i + 1}`, i - middleIndex + 1, array.length - middleIndex);
          await sleep(400);
        }
        
        newArray.splice(middleIndex, 0, value);
        const middleResultText = `Inserted ${value} at index ${middleIndex}`;
        setCurrentStep(middleResultText);
        speakResult(middleResultText);
        break;
    }

    setTimeComplexity(complexity);
    setArray(newArray);
    setHighlightedIndices([insertIndex]);
    setInputValue('');
    
    await sleep(1000);
    setHighlightedIndices([]);
    setIsAnimating(false);
    setOperation(null);
    setCurrentStep('');
    
    toast.success(`Inserted ${value} (${complexity} operation)`);
  };

  const handleDelete = async () => {
    if (array.length === 0) {
      toast.error('Array is empty');
      return;
    }

    const index = parseInt(inputValue) || array.length - 1;
    if (index < 0 || index >= array.length) {
      toast.error('Invalid index');
      return;
    }

    setIsAnimating(true);
    setOperation('delete');
    setOperationCount(0);
    
    const deletedValue = array[index];
    setHighlightedIndices([index]);
    setCurrentStep(`Deleting element at index ${index}`);
    
    await sleep(800);
    
    if (index === array.length - 1) {
      // Deleting last element - O(1)
      setTimeComplexity('O(1)');
      setOperationCount(1);
      setCurrentStep('Deleting last element - no shifting needed');
    } else {
      // Deleting from middle - O(n)
      setTimeComplexity('O(n)');
      setCurrentStep('Deleting from middle - need to shift elements');
      
      // Show shifting animation
      for (let i = index + 1; i < array.length; i++) {
        setHighlightedIndices([i - 1, i]);
        setOperationCount(prev => prev + 1);
        await sleep(400);
      }
    }
    
    const newArray = array.filter((_, i) => i !== index);
    setArray(newArray);
    setCurrentStep(`Deleted ${deletedValue}`);
    
    await sleep(800);
    setHighlightedIndices([]);
    setIsAnimating(false);
    setOperation(null);
    setCurrentStep('');
    
    toast.success(`Deleted ${deletedValue} (${timeComplexity} operation)`);
  };

  const handleSearch = async () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      toast.error('Please enter a valid number');
      return;
    }

    setIsAnimating(true);
    setOperation('search');
    setTimeComplexity('O(n)');
    setCurrentStep(`Searching for ${value} using linear search`);
    setOperationCount(0);

    for (let i = 0; i < array.length; i++) {
      setHighlightedIndices([i]);
      setOperationCount(prev => prev + 1);
      setCurrentStep(`Checking index ${i}: ${array[i]} ${array[i] === value ? '==' : '!='} ${value}`);
      
      await sleep(600);
      
      if (array[i] === value) {
        setCurrentStep(`Found ${value} at index ${i}!`);
        toast.success(`Found ${value} at index ${i} (${operationCount + 1} comparisons)`);
        
        await sleep(1500);
        setHighlightedIndices([]);
        setIsAnimating(false);
        setOperation(null);
        setCurrentStep('');
        return;
      }
    }

    setCurrentStep(`${value} not found in array`);
    toast.error(`${value} not found (${operationCount} comparisons)`);
    
    await sleep(1000);
    setHighlightedIndices([]);
    setIsAnimating(false);
    setOperation(null);
    setCurrentStep('');
  };

  const handleTraverse = async () => {
    setIsAnimating(true);
    setOperation('traverse');
    setTimeComplexity('O(n)');
    setCurrentStep('Traversing array from start to end');
    setOperationCount(0);

    for (let i = 0; i < array.length; i++) {
      setHighlightedIndices([i]);
      setOperationCount(prev => prev + 1);
      setCurrentStep(`Visiting index ${i}: value = ${array[i]}`);
      await sleep(500);
    }

    setCurrentStep('Traversal complete!');
    toast.success(`Traversed ${array.length} elements`);
    
    await sleep(1000);
    setHighlightedIndices([]);
    setIsAnimating(false);
    setOperation(null);
    setCurrentStep('');
  };

  const handleReset = () => {
    setArray(initialArray);
    setHighlightedIndices([]);
    setIsAnimating(false);
    setOperation(null);
    setCurrentStep('');
    setOperationCount(0);
    setTimeComplexity('O(1)');
    toast.success('Array reset to initial state');
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Enhanced Array Visualizer</h3>
        <p className="text-muted-foreground">
          Comprehensive array operations with memory layout and complexity analysis
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-3 p-4 bg-muted/30 rounded-xl border">
          <h4 className="font-semibold">Operations</h4>
          <div className="flex gap-2">
            <Input
              placeholder="Enter value/index"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1"
              type="number"
              disabled={isAnimating}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleAccess} disabled={isAnimating || !inputValue} size="sm">
              <Zap className="h-4 w-4 mr-1" />
              Access
            </Button>
            <Button onClick={handleSearch} disabled={isAnimating || !inputValue} size="sm" variant="secondary">
              <Search className="h-4 w-4 mr-1" />
              Search
            </Button>
            <Button onClick={handleTraverse} disabled={isAnimating} size="sm" variant="outline">
              <Play className="h-4 w-4 mr-1" />
              Traverse
            </Button>
          </div>
        </div>

        <div className="space-y-3 p-4 bg-muted/30 rounded-xl border">
          <h4 className="font-semibold">Modifications</h4>
          <Select value={insertPosition} onValueChange={(value: InsertPosition) => setInsertPosition(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginning">Insert at Beginning</SelectItem>
              <SelectItem value="middle">Insert at Middle</SelectItem>
              <SelectItem value="end">Insert at End</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleInsert} disabled={isAnimating || !inputValue} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Insert
            </Button>
            <Button onClick={handleDelete} disabled={isAnimating || array.length === 0} size="sm" variant="destructive">
              <Minus className="h-4 w-4 mr-1" />
              Delete
            </Button>
            <Button onClick={handleReset} disabled={isAnimating} size="sm" variant="outline">
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Array Visualization */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 rounded-xl border-2 border-border/50 p-6">
        <div className="flex items-center justify-center gap-2 min-h-[200px] p-4">
          <AnimatePresence mode="popLayout">
            {array.map((value, index) => (
              <motion.div
                key={`${index}-${value}`}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  scale: highlightedIndices.includes(index) ? 1.15 : 1,
                  y: 0 
                }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ 
                  duration: 0.4,
                  type: "spring",
                  stiffness: 200,
                  damping: 20
                }}
                className={`
                  relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 min-w-[80px]
                  ${highlightedIndices.includes(index) 
                    ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-110' 
                    : 'bg-card border-border hover:border-primary/50'
                  }
                  transition-all duration-300 cursor-pointer
                `}
                whileHover={{ scale: highlightedIndices.includes(index) ? 1.15 : 1.05 }}
              >
                <span className="text-xl font-bold">{value}</span>
                <span className="text-xs opacity-70">Index: {index}</span>
                {showMemoryView && (
                  <span className="text-xs font-mono opacity-60">
                    0x{memoryAddresses[index]?.toString(16).toUpperCase()}
                  </span>
                )}
                
                {/* Array bounds indicators */}
                {index === 0 && (
                  <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                    Start
                  </div>
                )}
                {index === array.length - 1 && (
                  <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                    End
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {array.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <div className="text-lg mb-2">Array is empty</div>
              <div className="text-sm">Add elements to see the visualization</div>
            </div>
          )}
        </div>
        
        {/* Inline controls directly under visualization */}
        <div className="mt-2 flex justify-center">
          <Button onClick={() => setShowMemoryView(!showMemoryView)} variant="outline" size="sm" aria-label="Toggle memory view below visualization">
            <HardDrive className="h-4 w-4 mr-1" /> {showMemoryView ? 'Hide Memory' : 'Show Memory Below'}
          </Button>
        </div>
        
        {/* Current Operation Status */}
        {currentStep && (
          <div className="mt-4 p-3 bg-muted/20 rounded-lg border">
            <div className="flex items-center gap-2 text-sm">
              <Info className="h-4 w-4 text-primary" />
              <span className="font-medium">{currentStep}</span>
              {operationCount > 0 && (
                <Badge variant="outline" className="ml-auto">
                  Operations: {operationCount}
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Status */}
      <div className="flex flex-wrap gap-3 items-center">
        <Badge variant="outline">Length: {array.length}</Badge>
        <Badge variant="outline">Complexity: {timeComplexity}</Badge>
        {operation && (
          <Badge variant="secondary" className="animate-pulse">
            {operation.charAt(0).toUpperCase() + operation.slice(1)}ing...
          </Badge>
        )}
      </div>
      
      
      {/* Memory Layout View */}
      {showMemoryView && (
        <div className="mt-6 p-4 bg-muted/20 rounded-lg border">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <HardDrive className="h-4 w-4" />
            Memory Layout (Conceptual)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-medium mb-2">Memory Addresses:</div>
              {array.map((value, index) => (
                <div key={index} className={`flex justify-between p-1 rounded ${
                  highlightedIndices.includes(index) ? 'bg-primary/20' : ''
                }`}>
                  <span>arr[{index}]:</span>
                  <span className="font-mono">0x{memoryAddresses[index]?.toString(16).toUpperCase()}</span>
                  <span className="font-bold">{value}</span>
                </div>
              ))}
            </div>
            <div>
              <div className="font-medium mb-2">Key Properties:</div>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Contiguous memory allocation</li>
                <li>• Each element: 4 bytes (32-bit integer)</li>
                <li>• Direct index calculation: base + (index × size)</li>
                <li>• Cache-friendly sequential access</li>
                <li>• Random access in O(1) time</li>
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {/* Complexity Analysis removed - now shown in sidebar only */}
      
      {/* Learning Points */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-green-600" />
            <h4 className="font-semibold text-green-800 dark:text-green-200">Fast Access</h4>
          </div>
          <p className="text-sm text-green-700 dark:text-green-300">
            Arrays provide O(1) access to any element using its index - like knowing exactly which shelf a book is on!
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Plus className="h-4 w-4 text-blue-600" />
            <h4 className="font-semibold text-blue-800 dark:text-blue-200">Easy Insertion</h4>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Adding to the end is O(1) - quick and simple. Adding in the middle requires shifting elements.
          </p>
        </div>

        <div className="bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Search className="h-4 w-4 text-purple-600" />
            <h4 className="font-semibold text-purple-800 dark:text-purple-200">Linear Search</h4>
          </div>
          <p className="text-sm text-purple-700 dark:text-purple-300">
            Finding an element requires checking each position until found - O(n) time complexity.
          </p>
        </div>
      </div>

      {/* Common Mistakes */}
      <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">⚠️ Common Beginner Mistakes</h4>
        <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
          <li>• <strong>Index confusion:</strong> Remember arrays start at index 0, not 1!</li>
          <li>• <strong>Bounds checking:</strong> Accessing array[length] will cause an error - last valid index is length-1</li>
          <li>• <strong>Fixed size:</strong> In some languages, arrays have fixed size - you can't just keep adding elements</li>
        </ul>
      </div>

      {/* Visualizer Controls */}
      <div className="flex justify-center">
        <VisualizerControls
          showMemory={showMemoryView}
          onToggleMemory={setShowMemoryView}
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
