import React, { useState, useCallback, useEffect } from 'react';

import { Play, Pause, SkipForward, SkipBack, RotateCcw, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { PseudocodeBox } from '@/components/pseudocode-box';
import { ComplexityBox } from '@/components/complexity-box';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

interface DoublyNode {
  id: string;
  value: number;
  prev?: string;
  next?: string;
}

type Operation = 'insert-head' | 'insert-tail' | 'insert-position' | 'delete-head' | 'delete-tail' | 'delete-value' | 'search';

export function DoublyLinkedListVisualizer() {
  const [nodes, setNodes] = useState<DoublyNode[]>([
    { id: '1', value: 10, next: '2' },
    { id: '2', value: 20, prev: '1', next: '3' },
    { id: '3', value: 30, prev: '2' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [inputPosition, setInputPosition] = useState('');
  const [operation, setOperation] = useState<Operation>('insert-head');
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedNodes, setHighlightedNodes] = useState<string[]>([]);
  const [animationSteps, setAnimationSteps] = useState<any[]>([]);
  const [currentStepDescription, setCurrentStepDescription] = useState('');
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
    speakStep,
    speakOperation,
    speakResult
  } = useVisualizerVoice({ minInterval: 2000 });

  const pseudocode: Record<Operation, string[]> = {
    'insert-head': [
      "function insertHead(value):",
      "  newNode = createNode(value)",
      "  newNode.next = head",
      "  if head != null:",
      "    head.prev = newNode",
      "  head = newNode",
      "  return newNode"
    ],
    'insert-tail': [
      "function insertTail(value):",
      "  newNode = createNode(value)",
      "  if head == null:",
      "    head = newNode",
      "    return",
      "  current = head",
      "  while current.next != null:",
      "    current = current.next",
      "  current.next = newNode",
      "  newNode.prev = current"
    ],
    'insert-position': [
      "function insertAtPosition(value, pos):",
      "  if pos == 0:",
      "    insertHead(value)",
      "    return",
      "  newNode = createNode(value)",
      "  current = head",
      "  for i = 0 to pos-1:",
      "    current = current.next",
      "  newNode.next = current.next",
      "  newNode.prev = current",
      "  current.next = newNode",
      "  if newNode.next != null:",
      "    newNode.next.prev = newNode"
    ],
    'delete-head': [
      "function deleteHead():",
      "  if head == null:",
      "    return null",
      "  temp = head",
      "  head = head.next",
      "  if head != null:",
      "    head.prev = null",
      "  return temp.value"
    ],
    'delete-tail': [
      "function deleteTail():",
      "  if head == null:",
      "    return null",
      "  current = head",
      "  while current.next != null:",
      "    current = current.next",
      "  if current.prev != null:",
      "    current.prev.next = null",
      "  else:",
      "    head = null",
      "  return current.value"
    ],
    'delete-value': [
      "function deleteValue(value):",
      "  current = head",
      "  while current != null:",
      "    if current.value == value:",
      "      if current.prev != null:",
      "        current.prev.next = current.next",
      "      else:",
      "        head = current.next",
      "      if current.next != null:",
      "        current.next.prev = current.prev",
      "      return true",
      "    current = current.next",
      "  return false"
    ],
    'search': [
      "function search(value):",
      "  current = head",
      "  position = 0",
      "  while current != null:",
      "    if current.value == value:",
      "      return position",
      "    current = current.next",
      "    position++",
      "  return -1"
    ]
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const generateAnimationSteps = useCallback((op: Operation, value?: number, position?: number) => {
    const steps: any[] = [];
    
    switch (op) {
      case 'insert-head':
        steps.push({ step: 0, description: `Creating new node with value ${value}`, highlight: [] });
        steps.push({ step: 1, description: `Setting newNode.next to current head`, highlight: [] });
        steps.push({ step: 2, description: `Updating head.prev to newNode`, highlight: [] });
        steps.push({ step: 5, description: `Setting head to newNode`, highlight: [] });
        break;
      case 'search':
        steps.push({ step: 0, description: `Starting search for value ${value}`, highlight: [] });
        for (let i = 0; i < nodes.length; i++) {
          steps.push({ step: 3, description: `Checking node ${i} (value: ${nodes[i].value})`, highlight: [nodes[i].id] });
          if (nodes[i].value === value) {
            steps.push({ step: 4, description: `Found value ${value} at position ${i}`, highlight: [nodes[i].id] });
            break;
          }
          steps.push({ step: 5, description: `Moving to next node`, highlight: [] });
        }
        break;
    }
    
    return steps;
  }, [nodes]);

  const executeOperation = useCallback(async () => {
    const value = parseInt(inputValue);
    const position = parseInt(inputPosition);
    
    if (!inputValue || (operation.includes('insert') && isNaN(value))) {
      toast.error('Please enter a valid value');
      return;
    }

    setIsAnimating(true);
    const steps = generateAnimationSteps(operation, value, position);
    setAnimationSteps(steps);
    setCurrentStep(0);

    const operationNames = {
      'insert-head': 'Insert at Head',
      'insert-tail': 'Insert at Tail', 
      'insert-position': 'Insert at Position',
      'delete-head': 'Delete Head',
      'delete-tail': 'Delete Tail',
      'delete-value': 'Delete by Value',
      'search': 'Search Value'
    };

    const operationName = operationNames[operation];
    speakOperation(operationName, `Starting ${operationName} operation on doubly linked list. This data structure allows bidirectional traversal with both next and previous pointers.`);

    try {
      switch (operation) {
        case 'insert-head':
          await insertHead(value, steps);
          break;
        case 'insert-tail':
          await insertTail(value, steps);
          break;
        case 'search':
          await searchValue(value, steps);
          break;
        case 'delete-head':
          await deleteHead(steps);
          break;
      }
      
      speakResult(`${operationName} operation completed successfully!`);
    } catch (error) {
      toast.error('Operation failed');
      speakResult(`${operationName} operation failed. Please try again.`);
    }

    setIsAnimating(false);
  }, [inputValue, inputPosition, operation, nodes]);

  const insertHead = async (value: number, steps: any[]) => {
    const newNode: DoublyNode = {
      id: Date.now().toString(),
      value,
      next: nodes.length > 0 ? nodes[0].id : undefined
    };

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      setCurrentStepDescription(steps[i].description);
      setHighlightedNodes(steps[i].highlight);
      await sleep(800);
    }

    if (nodes.length > 0) {
      setNodes(prev => {
        const updated = [...prev];
        updated[0] = { ...updated[0], prev: newNode.id };
        return [newNode, ...updated];
      });
    } else {
      setNodes([newNode]);
    }

    toast.success(`Inserted ${value} at head`);
  };

  const insertTail = async (value: number, steps: any[]) => {
    const newNode: DoublyNode = {
      id: Date.now().toString(),
      value
    };

    if (nodes.length === 0) {
      setNodes([newNode]);
    } else {
      setNodes(prev => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        updated[lastIndex] = { ...updated[lastIndex], next: newNode.id };
        newNode.prev = updated[lastIndex].id;
        return [...updated, newNode];
      });
    }

    toast.success(`Inserted ${value} at tail`);
  };

  const searchValue = async (value: number, steps: any[]) => {
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i % pseudocode[operation].length);
      setCurrentStepDescription(steps[i].description);
      setHighlightedNodes(steps[i].highlight);
      await sleep(800);
    }

    const found = nodes.find(node => node.value === value);
    if (found) {
      toast.success(`Found value ${value}`);
    } else {
      toast.error(`Value ${value} not found`);
    }
  };

  const deleteHead = async (steps: any[]) => {
    if (nodes.length === 0) {
      toast.error('List is empty');
      return;
    }

    const headValue = nodes[0].value;
    setNodes(prev => {
      if (prev.length === 1) return [];
      const updated = [...prev.slice(1)];
      updated[0] = { ...updated[0], prev: undefined };
      return updated;
    });

    toast.success(`Deleted head node with value ${headValue}`);
  };

  const renderNode = (node: DoublyNode, index: number) => {
    const isHighlighted = highlightedNodes.includes(node.id);
    
    return (
      <div key={node.id} className="flex items-center">
        <div className={`
          relative w-16 h-16 border-2 rounded-lg flex items-center justify-center font-mono font-bold text-lg
          transition-all duration-300 ${isHighlighted 
            ? 'border-primary bg-primary text-primary-foreground animate-pulse scale-110' 
            : 'border-border bg-card text-card-foreground hover:border-muted-foreground'
          }
        `}>
          {node.value}
          
          {/* Previous pointer */}
          {node.prev && (
            <div className="absolute -left-3 top-2 w-2 h-2 bg-secondary rounded-full" />
          )}
          
          {/* Next pointer */}
          {node.next && (
            <div className="absolute -right-3 top-2 w-2 h-2 bg-secondary rounded-full" />
          )}
        </div>
        
        {/* Bidirectional arrow */}
        {index < nodes.length - 1 && (
          <div className="flex flex-col items-center mx-2">
            <div className="h-0.5 w-8 bg-muted-foreground" />
            <div className="flex justify-between w-8 -mt-1">
              <div className="w-0 h-0 border-l-2 border-l-transparent border-r-2 border-r-transparent border-b-2 border-b-muted-foreground" />
              <div className="w-0 h-0 border-l-2 border-l-transparent border-r-2 border-r-transparent border-t-2 border-t-muted-foreground" />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <Select value={operation} onValueChange={(value: Operation) => setOperation(value)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="insert-head">Insert at Head</SelectItem>
            <SelectItem value="insert-tail">Insert at Tail</SelectItem>
            <SelectItem value="insert-position">Insert at Position</SelectItem>
            <SelectItem value="delete-head">Delete Head</SelectItem>
            <SelectItem value="delete-tail">Delete Tail</SelectItem>
            <SelectItem value="delete-value">Delete by Value</SelectItem>
            <SelectItem value="search">Search</SelectItem>
          </SelectContent>
        </Select>

        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter value"
          className="w-32"
          type="number"
          disabled={isAnimating}
        />

        {operation === 'insert-position' && (
          <Input
            value={inputPosition}
            onChange={(e) => setInputPosition(e.target.value)}
            placeholder="Position"
            className="w-24"
            type="number"
            disabled={isAnimating}
          />
        )}

        <Button onClick={executeOperation} disabled={isAnimating} className="flex items-center gap-1">
          <Play className="h-4 w-4" />
          Execute
        </Button>

        <Button 
          onClick={() => {
            setNodes([
              { id: '1', value: 10, next: '2' },
              { id: '2', value: 20, prev: '1', next: '3' },
              { id: '3', value: 30, prev: '2' }
            ]);
            setHighlightedNodes([]);
            setCurrentStep(0);
          }} 
          variant="outline"
          disabled={isAnimating}
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset
        </Button>
      </div>

      {/* Visualization */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 rounded-xl border-2 border-border/50 p-6">
        <h3 className="text-lg font-semibold mb-4 text-center">Doubly Linked List</h3>
        
        <div className="flex justify-center items-center min-h-24 flex-wrap gap-2">
          {nodes.length === 0 ? (
            <div className="text-muted-foreground text-lg">Empty List</div>
          ) : (
            nodes.map((node, index) => renderNode(node, index))
          )}
        </div>

        {currentStepDescription && (
          <div className="mt-4 p-3 bg-muted/20 rounded-lg text-center">
            <p className="text-sm font-medium">{currentStepDescription}</p>
          </div>
        )}
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
          data={nodes.map(n => n.value)}
          title="Node Values Memory Layout"
          baseAddress={5000}
          wordSize={4}
        />
      )}

      {/* Pseudocode */}
      <PseudocodeBox 
        title={`${operation.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} - Pseudocode`}
        code={pseudocode[operation]} 
        highlightedLine={currentStep}
      />

      {/* Complexity Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ComplexityBox
          title="Time Complexity"
          timeComplexity="O(1) - O(n)"
          spaceComplexity="O(1)"
          description="Insert/Delete at head: O(1), Search/Insert at position: O(n)"
        />
        
        <div className="bg-muted/20 rounded-lg p-4">
          <h4 className="font-semibold mb-2">Key Points</h4>
          <ul className="text-sm space-y-1">
            <li>• <strong>Bidirectional:</strong> Can traverse forward and backward</li>
            <li>• <strong>Extra Memory:</strong> Requires additional prev pointer</li>
            <li>• <strong>Flexible:</strong> Easier deletion than singly linked list</li>
            <li>• <strong>Use Case:</strong> Browser history, undo-redo operations</li>
          </ul>
        </div>
      </div>
    </div>
  );
}