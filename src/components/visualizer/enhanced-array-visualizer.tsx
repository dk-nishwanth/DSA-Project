import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Minus, Search, RotateCcw, Zap } from 'lucide-react';
import { StepByStepBase, VisualizationStep } from './step-by-step-base';

export function EnhancedArrayVisualizer() {
  const [array, setArray] = useState<number[]>([10, 25, 30, 45, 60]);
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [steps, setSteps] = useState<VisualizationStep[]>([]);
  const [currentOperation, setCurrentOperation] = useState<'insert' | 'delete' | 'search' | null>(null);

  const generateInsertSteps = (value: number): VisualizationStep[] => {
    const newArray = [...array, value];
    return [
      {
        id: 'insert-start',
        title: 'Insert Operation Started',
        description: `Preparing to insert ${value} at the end of the array`,
        data: { array, highlightIndex: -1, operation: 'insert', value },
        complexity: { time: 'O(1)', space: 'O(1)' },
        code: `array.push(${value});`
      },
      {
        id: 'insert-complete',
        title: 'Element Inserted',
        description: `Successfully added ${value} to index ${array.length}`,
        data: { array: newArray, highlightIndex: array.length, operation: 'insert', value },
        complexity: { time: 'O(1)', space: 'O(1)' },
        code: `// Array now has ${newArray.length} elements`
      }
    ];
  };

  const generateDeleteSteps = (): VisualizationStep[] => {
    if (array.length === 0) return [];
    
    const lastElement = array[array.length - 1];
    const newArray = array.slice(0, -1);
    
    return [
      {
        id: 'delete-start',
        title: 'Delete Operation Started',
        description: `Preparing to remove the last element (${lastElement})`,
        data: { array, highlightIndex: array.length - 1, operation: 'delete', value: lastElement },
        complexity: { time: 'O(1)', space: 'O(1)' },
        code: `array.pop(); // Removes ${lastElement}`
      },
      {
        id: 'delete-complete',
        title: 'Element Removed',
        description: `Successfully removed ${lastElement} from the array`,
        data: { array: newArray, highlightIndex: -1, operation: 'delete', value: lastElement },
        complexity: { time: 'O(1)', space: 'O(1)' },
        code: `// Array now has ${newArray.length} elements`
      }
    ];
  };

  const generateSearchSteps = (value: number): VisualizationStep[] => {
    const searchSteps: VisualizationStep[] = [
      {
        id: 'search-start',
        title: 'Linear Search Started',
        description: `Searching for ${value} in the array`,
        data: { array, highlightIndex: -1, operation: 'search', value, searchIndex: 0 },
        complexity: { time: 'O(n)', space: 'O(1)' },
        code: `for (let i = 0; i < array.length; i++) {`
      }
    ];

    let foundIndex = -1;
    for (let i = 0; i < array.length; i++) {
      const isFound = array[i] === value && foundIndex === -1;
      if (isFound) foundIndex = i;
      
      searchSteps.push({
        id: `search-step-${i}`,
        title: `Checking Index ${i}`,
        description: isFound 
          ? `Found ${value} at index ${i}! 🎉`
          : `Checking index ${i}: ${array[i]} ${array[i] === value ? '==' : '!='} ${value}`,
        data: { array, highlightIndex: i, operation: 'search', value, searchIndex: i, found: isFound },
        complexity: { time: 'O(n)', space: 'O(1)' },
        code: isFound 
          ? `  if (array[${i}] === ${value}) return ${i}; // Found!`
          : `  if (array[${i}] === ${value}) // ${array[i]} !== ${value}`
      });

      if (isFound) break;
    }

    if (foundIndex === -1) {
      searchSteps.push({
        id: 'search-not-found',
        title: 'Search Complete',
        description: `${value} not found in the array`,
        data: { array, highlightIndex: -1, operation: 'search', value, found: false },
        complexity: { time: 'O(n)', space: 'O(1)' },
        code: `return -1; // Not found`
      });
    }

    return searchSteps;
  };

  const handleInsert = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) return;
    
    const insertSteps = generateInsertSteps(value);
    setSteps(insertSteps);
    setCurrentOperation('insert');
    setInputValue('');
  };

  const handleDelete = () => {
    if (array.length === 0) return;
    
    const deleteSteps = generateDeleteSteps();
    setSteps(deleteSteps);
    setCurrentOperation('delete');
  };

  const handleSearch = () => {
    const value = parseInt(searchValue);
    if (isNaN(value)) return;
    
    const searchSteps = generateSearchSteps(value);
    setSteps(searchSteps);
    setCurrentOperation('search');
    setSearchValue('');
  };

  const handleStepChange = (step: VisualizationStep, index: number) => {
    // Update array state based on the step
    if (currentOperation === 'insert' && index === 1) {
      setArray(step.data.array);
    } else if (currentOperation === 'delete' && index === 1) {
      setArray(step.data.array);
    }
  };

  const handleReset = () => {
    setArray([10, 25, 30, 45, 60]);
    setInputValue('');
    setSearchValue('');
    setSteps([]);
    setCurrentOperation(null);
  };

  const getElementColor = (index: number, stepData: any) => {
    if (stepData?.highlightIndex === index) {
      switch (stepData.operation) {
        case 'insert': return 'bg-green-500 border-green-600';
        case 'delete': return 'bg-red-500 border-red-600';
        case 'search': 
          return stepData.found 
            ? 'bg-green-500 border-green-600' 
            : 'bg-yellow-500 border-yellow-600';
        default: return 'bg-blue-500 border-blue-600';
      }
    }
    return 'bg-blue-500 border-blue-600';
  };

  const renderArrayVisualization = (currentStep: VisualizationStep) => {
    const { array: displayArray, highlightIndex, operation } = currentStep.data;
    
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold mb-2">📚 Array Visualization</h3>
          <p className="text-sm text-muted-foreground">
            Think of an array as a bookshelf where each book has a specific position (index)
          </p>
        </div>

        {/* Array Elements */}
        <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
          <AnimatePresence mode="popLayout">
            {displayArray.map((value: number, index: number) => (
              <motion.div
                key={`${index}-${value}`}
                layout
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ 
                  opacity: 1, 
                  scale: highlightIndex === index ? 1.1 : 1,
                  y: 0,
                  rotateY: highlightIndex === index ? [0, 10, -10, 0] : 0
                }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ 
                  duration: 0.5,
                  rotateY: { duration: 0.6, times: [0, 0.3, 0.7, 1] }
                }}
                className={`relative ${getElementColor(index, currentStep.data)} text-white rounded-lg p-4 min-w-[60px] text-center font-bold shadow-lg`}
              >
                {/* Value */}
                <div className="text-lg">{value}</div>
                
                {/* Index */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded border">
                  [{index}]
                </div>

                {/* Animation effects */}
                {highlightIndex === index && (
                  <motion.div
                    className="absolute inset-0 bg-white rounded-lg"
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: [0.3, 0.1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty Array Message */}
        {displayArray.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📭</div>
            <p className="text-muted-foreground">Array is empty - like an empty bookshelf!</p>
          </div>
        )}

        {/* Operation Status */}
        {operation && (
          <div className="text-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              operation === 'insert' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
              operation === 'delete' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
              'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            }`}>
              {operation === 'insert' && <Plus className="h-4 w-4" />}
              {operation === 'delete' && <Minus className="h-4 w-4" />}
              {operation === 'search' && <Search className="h-4 w-4" />}
              {operation.charAt(0).toUpperCase() + operation.slice(1)} Operation
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Insert */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Add Element</label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter number"
                disabled={steps.length > 0}
              />
              <Button 
                onClick={handleInsert} 
                disabled={steps.length > 0 || !inputValue}
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Delete */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Remove Element</label>
            <Button 
              onClick={handleDelete} 
              disabled={steps.length > 0 || array.length === 0}
              variant="outline"
              className="w-full"
            >
              <Minus className="h-4 w-4 mr-2" />
              Remove Last
            </Button>
          </div>

          {/* Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Search Element</label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Find number"
                disabled={steps.length > 0}
              />
              <Button 
                onClick={handleSearch} 
                disabled={steps.length > 0 || !searchValue}
                size="sm"
                variant="outline"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center mt-4">
          <Button onClick={handleReset} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Array
          </Button>
        </div>
      </div>

      {/* Step-by-Step Visualization */}
      {steps.length > 0 ? (
        <StepByStepBase
          steps={steps}
          onStepChange={handleStepChange}
          title="Array Operations Step-by-Step"
        >
          {(currentStep) => renderArrayVisualization(currentStep)}
        </StepByStepBase>
      ) : (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 rounded-xl p-8 border-2 border-dashed border-blue-200 dark:border-blue-800">
          {renderArrayVisualization({
            id: 'initial',
            title: 'Array Ready',
            description: 'Choose an operation to see step-by-step visualization',
            data: { array, highlightIndex: -1, operation: null }
          } as VisualizationStep)}
        </div>
      )}

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
    </div>
  );
}