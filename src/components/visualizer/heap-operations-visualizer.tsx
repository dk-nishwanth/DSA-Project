import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

interface HeapNode {
  value: number;
  index: number;
  isActive: boolean;
  isComparing: boolean;
  isSwapping: boolean;
  level: number;
}

export function HeapOperationsVisualizer() {
  const [heapType, setHeapType] = useState<'min' | 'max'>('max');
  const [operation, setOperation] = useState<'insert' | 'extract' | 'build' | 'heapify'>('insert');
  const [inputValue, setInputValue] = useState('15');
  const [arrayInput, setArrayInput] = useState('4,10,3,5,1,8,2,7');
  const [heap, setHeap] = useState<HeapNode[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showMemory, setShowMemory] = useState(false);
  const [result, setResult] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(0);
  const [heapifyIndex, setHeapifyIndex] = useState('0');

  const {
    voiceEnabled,
    setVoiceEnabled,
    speakOperation,
    speakStep,
    speakResult,
  } = useVisualizerVoice({ minInterval: 500 });

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const clearHighlights = useCallback(() => {
    setHeap(prev => prev.map(node => ({
      ...node,
      isActive: false,
      isComparing: false,
      isSwapping: false,
    })));
  }, []);

  const updateLevels = useCallback((heapArray: HeapNode[]) => {
    return heapArray.map((node, index) => ({
      ...node,
      index,
      level: Math.floor(Math.log2(index + 1)),
    }));
  }, []);

  const shouldSwap = useCallback((parent: number, child: number) => {
    if (heapType === 'max') {
      return parent < child;
    } else {
      return parent > child;
    }
  }, [heapType]);

  const heapifyUp = useCallback(async (index: number) => {
    if (index === 0) return;
    
    const parentIndex = Math.floor((index - 1) / 2);
    
    // Highlight nodes being compared
    heap[index].isComparing = true;
    heap[parentIndex].isComparing = true;
    setHeap([...heap]);
    
    speakStep('Compare', `Comparing child ${heap[index].value} with parent ${heap[parentIndex].value}`, index, heap.length);
    await sleep(600);
    
    if (shouldSwap(heap[parentIndex].value, heap[index].value)) {
      // Swap needed
      heap[index].isSwapping = true;
      heap[parentIndex].isSwapping = true;
      setHeap([...heap]);
      
      speakStep('Swap', `Swapping ${heap[index].value} with ${heap[parentIndex].value}`, index, heap.length);
      await sleep(500);
      
      // Perform swap
      const temp = heap[index].value;
      heap[index].value = heap[parentIndex].value;
      heap[parentIndex].value = temp;
      
      heap[index].isSwapping = false;
      heap[parentIndex].isSwapping = false;
      heap[index].isComparing = false;
      heap[parentIndex].isComparing = false;
      setHeap([...heap]);
      
      await sleep(300);
      
      // Continue heapifying up
      await heapifyUp(parentIndex);
    } else {
      // No swap needed
      heap[index].isComparing = false;
      heap[parentIndex].isComparing = false;
      setHeap([...heap]);
      
      speakStep('No swap', `Heap property satisfied`, index, heap.length);
      await sleep(300);
    }
  }, [heap, shouldSwap, speakStep]);

  const heapifyDown = useCallback(async (index: number) => {
    const leftChild = 2 * index + 1;
    const rightChild = 2 * index + 2;
    let targetIndex = index;
    
    if (leftChild >= heap.length) return; // No children
    
    // Highlight current node
    heap[index].isActive = true;
    setHeap([...heap]);
    
    speakStep('Check children', `Checking children of node at index ${index}`, index, heap.length);
    await sleep(400);
    
    // Find the target child to potentially swap with
    if (leftChild < heap.length) {
      heap[leftChild].isComparing = true;
      if (shouldSwap(heap[targetIndex].value, heap[leftChild].value)) {
        targetIndex = leftChild;
      }
    }
    
    if (rightChild < heap.length) {
      heap[rightChild].isComparing = true;
      if (shouldSwap(heap[targetIndex].value, heap[rightChild].value)) {
        targetIndex = rightChild;
      }
    }
    
    setHeap([...heap]);
    await sleep(500);
    
    if (targetIndex !== index) {
      // Swap needed
      heap[index].isSwapping = true;
      heap[targetIndex].isSwapping = true;
      setHeap([...heap]);
      
      speakStep('Swap down', `Swapping ${heap[index].value} with ${heap[targetIndex].value}`, index, heap.length);
      await sleep(500);
      
      // Perform swap
      const temp = heap[index].value;
      heap[index].value = heap[targetIndex].value;
      heap[targetIndex].value = temp;
      
      // Clear highlights
      heap[index].isActive = false;
      heap[index].isSwapping = false;
      heap[targetIndex].isSwapping = false;
      if (leftChild < heap.length) heap[leftChild].isComparing = false;
      if (rightChild < heap.length) heap[rightChild].isComparing = false;
      setHeap([...heap]);
      
      await sleep(300);
      
      // Continue heapifying down
      await heapifyDown(targetIndex);
    } else {
      // No swap needed
      heap[index].isActive = false;
      if (leftChild < heap.length) heap[leftChild].isComparing = false;
      if (rightChild < heap.length) heap[rightChild].isComparing = false;
      setHeap([...heap]);
      
      speakStep('Heap property satisfied', `No more swaps needed`, index, heap.length);
      await sleep(300);
    }
  }, [heap, shouldSwap, speakStep]);

  const insertElement = useCallback(async () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) return;
    
    speakOperation('Insert Element', `Inserting ${value} into ${heapType} heap`);
    
    // Add element to end of heap
    const newNode: HeapNode = {
      value,
      index: heap.length,
      isActive: true,
      isComparing: false,
      isSwapping: false,
      level: Math.floor(Math.log2(heap.length + 1)),
    };
    
    const newHeap = [...heap, newNode];
    setHeap(updateLevels(newHeap));
    
    speakStep('Add to end', `Added ${value} at index ${heap.length}`, heap.length, heap.length + 1);
    await sleep(500);
    
    // Heapify up
    await heapifyUp(heap.length);
    
    clearHighlights();
    setResult(`Inserted ${value} into heap`);
    speakResult(`Successfully inserted ${value} into ${heapType} heap`);
  }, [inputValue, heap, heapType, updateLevels, heapifyUp, clearHighlights, speakOperation, speakStep, speakResult]);

  const extractRoot = useCallback(async () => {
    if (heap.length === 0) {
      setResult('Heap is empty');
      return;
    }
    
    const rootValue = heap[0].value;
    speakOperation('Extract Root', `Extracting ${heapType === 'max' ? 'maximum' : 'minimum'} element: ${rootValue}`);
    
    // Highlight root
    heap[0].isActive = true;
    setHeap([...heap]);
    
    speakStep('Extract root', `Removing root element ${rootValue}`, 0, heap.length);
    await sleep(500);
    
    if (heap.length === 1) {
      // Only one element
      setHeap([]);
      setResult(`Extracted ${rootValue}. Heap is now empty.`);
      speakResult(`Extracted ${rootValue}. Heap is now empty.`);
      return;
    }
    
    // Move last element to root
    heap[0].value = heap[heap.length - 1].value;
    heap[0].isActive = false;
    const newHeap = heap.slice(0, -1);
    setHeap(updateLevels(newHeap));
    
    speakStep('Move last to root', `Moved last element ${heap[0].value} to root`, 0, newHeap.length);
    await sleep(500);
    
    // Heapify down from root
    await heapifyDown(0);
    
    clearHighlights();
    setResult(`Extracted ${rootValue} from heap`);
    speakResult(`Successfully extracted ${rootValue} from ${heapType} heap`);
  }, [heap, heapType, updateLevels, heapifyDown, clearHighlights, speakOperation, speakStep, speakResult]);

  const buildHeap = useCallback(async () => {
    const nums = arrayInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    
    speakOperation('Build Heap', `Building ${heapType} heap from array: [${nums.join(', ')}]`);
    
    // Create initial heap structure
    const newHeap: HeapNode[] = nums.map((value, index) => ({
      value,
      index,
      isActive: false,
      isComparing: false,
      isSwapping: false,
      level: Math.floor(Math.log2(index + 1)),
    }));
    
    setHeap(newHeap);
    
    speakStep('Initial array', `Created initial heap structure`, 0, nums.length);
    await sleep(500);
    
    // Heapify from last non-leaf node down to root
    const lastNonLeaf = Math.floor(nums.length / 2) - 1;
    
    for (let i = lastNonLeaf; i >= 0; i--) {
      speakStep('Heapify node', `Heapifying subtree rooted at index ${i}`, i, lastNonLeaf + 1);
      await heapifyDown(i);
      await sleep(200);
    }
    
    clearHighlights();
    setResult(`Built ${heapType} heap from array`);
    speakResult(`Successfully built ${heapType} heap from input array`);
  }, [arrayInput, heapType, heapifyDown, clearHighlights, speakOperation, speakStep, speakResult]);

  const heapifyAtIndex = useCallback(async () => {
    const index = parseInt(heapifyIndex);
    if (isNaN(index) || index < 0 || index >= heap.length) {
      setResult('Invalid index for heapify');
      return;
    }
    
    speakOperation('Heapify at Index', `Heapifying subtree rooted at index ${index}`);
    
    await heapifyDown(index);
    
    clearHighlights();
    setResult(`Heapified subtree at index ${index}`);
    speakResult(`Successfully heapified subtree at index ${index}`);
  }, [heapifyIndex, heap, heapifyDown, clearHighlights, speakOperation, speakResult]);

  const runOperation = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setResult('');
    setCurrentStep(0);
    
    try {
      if (operation === 'insert') {
        await insertElement();
      } else if (operation === 'extract') {
        await extractRoot();
      } else if (operation === 'build') {
        await buildHeap();
      } else if (operation === 'heapify') {
        await heapifyAtIndex();
      }
    } finally {
      setIsRunning(false);
    }
  }, [isRunning, operation, insertElement, extractRoot, buildHeap, heapifyAtIndex]);

  const renderHeap = () => {
    if (heap.length === 0) return <div className="text-center text-muted-foreground py-8">Heap is empty</div>;
    
    // Group nodes by level
    const levels: HeapNode[][] = [];
    heap.forEach(node => {
      if (!levels[node.level]) levels[node.level] = [];
      levels[node.level].push(node);
    });
    
    return (
      <div className="space-y-4">
        {levels.map((level, levelIndex) => (
          <div key={levelIndex} className="flex justify-center gap-4">
            {level.map(node => (
              <div key={node.index} className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-full border-2 font-mono text-sm font-bold transition-all duration-300 ${
                    node.isActive
                      ? 'bg-yellow-200 border-yellow-400 dark:bg-yellow-800 dark:border-yellow-600'
                      : node.isSwapping
                      ? 'bg-red-200 border-red-400 dark:bg-red-800 dark:border-red-600'
                      : node.isComparing
                      ? 'bg-blue-200 border-blue-400 dark:bg-blue-800 dark:border-blue-600'
                      : 'bg-white border-gray-400 dark:bg-gray-900 dark:border-gray-600'
                  }`}
                >
                  {node.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1">{node.index}</div>
                
                {/* Draw lines to children */}
                {2 * node.index + 1 < heap.length && (
                  <svg className="absolute" style={{ zIndex: -1 }}>
                    <line
                      x1="0"
                      y1="24"
                      x2="-30"
                      y2="60"
                      stroke="#6B7280"
                      strokeWidth="1"
                    />
                  </svg>
                )}
                {2 * node.index + 2 < heap.length && (
                  <svg className="absolute" style={{ zIndex: -1 }}>
                    <line
                      x1="0"
                      y1="24"
                      x2="30"
                      y2="60"
                      stroke="#6B7280"
                      strokeWidth="1"
                    />
                  </svg>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <Select value={heapType} onValueChange={(v: 'min' | 'max') => setHeapType(v)}>
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="max">Max Heap</SelectItem>
            <SelectItem value="min">Min Heap</SelectItem>
          </SelectContent>
        </Select>

        <Select value={operation} onValueChange={(v: 'insert' | 'extract' | 'build' | 'heapify') => setOperation(v)}>
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="insert">Insert</SelectItem>
            <SelectItem value="extract">Extract</SelectItem>
            <SelectItem value="build">Build</SelectItem>
            <SelectItem value="heapify">Heapify</SelectItem>
          </SelectContent>
        </Select>

        {operation === 'insert' && (
          <div className="flex items-center gap-2">
            <span className="text-sm">Value:</span>
            <Input 
              className="w-20" 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="15"
            />
          </div>
        )}

        {operation === 'build' && (
          <div className="flex items-center gap-2">
            <span className="text-sm">Array:</span>
            <Input 
              className="w-48" 
              value={arrayInput} 
              onChange={(e) => setArrayInput(e.target.value)}
              placeholder="4,10,3,5,1,8,2,7"
            />
          </div>
        )}

        {operation === 'heapify' && (
          <div className="flex items-center gap-2">
            <span className="text-sm">Index:</span>
            <Input 
              className="w-20" 
              value={heapifyIndex} 
              onChange={(e) => setHeapifyIndex(e.target.value)}
              placeholder="0"
            />
          </div>
        )}

        <Button onClick={runOperation} disabled={isRunning}>
          {isRunning ? 'Running...' : operation.charAt(0).toUpperCase() + operation.slice(1)}
        </Button>

        <Button onClick={() => setHeap([])} disabled={isRunning} variant="outline">
          Clear Heap
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 p-4 bg-gradient-visualization rounded-xl border-2">
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-sm font-semibold mb-4">
                {heapType === 'max' ? 'Max' : 'Min'} Heap ({heap.length} elements)
              </h3>
              <div className="min-h-[300px] flex items-center justify-center">
                {renderHeap()}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold mb-2">Array Representation</h3>
              <div className="flex gap-2 flex-wrap justify-center">
                {heap.map((node, index) => (
                  <div
                    key={index}
                    className={`w-12 h-12 flex items-center justify-center rounded border font-mono text-sm transition-all duration-300 ${
                      node.isActive || node.isComparing || node.isSwapping
                        ? 'bg-yellow-100 border-yellow-400 dark:bg-yellow-900/30'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">{index}</div>
                      <div className="font-bold">{node.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {result && (
            <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-xl border-2 border-green-300">
              <h3 className="text-sm font-semibold mb-2">Result</h3>
              <div className="text-sm">{result}</div>
            </div>
          )}
          
          <div className="p-4 bg-muted/20 rounded-xl border">
            <h3 className="text-sm font-semibold mb-2">Heap Properties</h3>
            <div className="text-xs space-y-1">
              <div><strong>Type:</strong> {heapType === 'max' ? 'Max Heap' : 'Min Heap'}</div>
              <div><strong>Root:</strong> {heap.length > 0 ? heap[0].value : 'Empty'}</div>
              <div><strong>Size:</strong> {heap.length}</div>
              <div><strong>Height:</strong> {heap.length > 0 ? Math.floor(Math.log2(heap.length)) + 1 : 0}</div>
            </div>
          </div>
          
          <div className="p-4 bg-muted/20 rounded-xl border">
            <h3 className="text-sm font-semibold mb-2">Legend</h3>
            <div className="text-xs space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-yellow-300"></div>
                <span>Active/Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-300"></div>
                <span>Comparing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-300"></div>
                <span>Swapping</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <VisualizerControls
          showMemory={showMemory}
          onToggleMemory={setShowMemory}
          voiceEnabled={voiceEnabled}
          onToggleVoice={setVoiceEnabled}
        />
      </div>

      {showMemory && (
        <MemoryLayout
          data={heap}
          title="Heap Array Memory"
          baseAddress={13000}
          wordSize={4}
        />
      )}

      <div className="bg-muted/20 rounded-lg p-4 text-sm space-y-2">
        <div className="font-semibold text-primary">Heap Operations:</div>
        <div>• <strong>Insert:</strong> O(log n) - Add element and heapify up</div>
        <div>• <strong>Extract:</strong> O(log n) - Remove root and heapify down</div>
        <div>• <strong>Build:</strong> O(n) - Build heap from unsorted array</div>
        <div>• <strong>Heapify:</strong> O(log n) - Restore heap property at given index</div>
        <div>• <strong>Applications:</strong> Priority queues, heap sort, graph algorithms</div>
      </div>
    </div>
  );
}