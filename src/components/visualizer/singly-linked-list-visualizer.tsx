import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Search, RotateCcw, Link as LinkIcon, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

interface ListNode {
  value: number;
  next: ListNode | null;
  id: string;
}

interface LinkedListStep {
  step: number;
  operation: string;
  currentNode?: string;
  value?: number;
  index?: number;
  description: string;
  list: ListNode | null;
  highlight?: string[];
}

export function SinglyLinkedListVisualizer() {
  const [operation, setOperation] = useState('insertEnd');
  const [inputValue, setInputValue] = useState(25);
  const [inputIndex, setInputIndex] = useState(1);
  const [head, setHead] = useState<ListNode | null>(null);
  const [steps, setSteps] = useState<LinkedListStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
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
    speakStep,
    speakResult,
  } = useVisualizerVoice({ minInterval: 1500 });

  const operations = [
    { value: 'insertBegin', label: 'Insert at Beginning' },
    { value: 'insertEnd', label: 'Insert at End' },
    { value: 'insertAt', label: 'Insert at Index' },
    { value: 'deleteBegin', label: 'Delete from Beginning' },
    { value: 'deleteEnd', label: 'Delete from End' },
    { value: 'deleteAt', label: 'Delete at Index' },
    { value: 'search', label: 'Search Value' },
    { value: 'traverse', label: 'Traverse List' }
  ];

  // Initialize with sample list
  useState(() => {
    const node1 = createNode(10);
    const node2 = createNode(20);
    const node3 = createNode(30);
    node1.next = node2;
    node2.next = node3;
    setHead(node1);
  });

  function createNode(value: number): ListNode {
    return {
      value,
      next: null,
      id: `node-${value}-${Date.now()}-${Math.random()}`
    };
  }

  function cloneList(node: ListNode | null): ListNode | null {
    if (!node) return null;
    const newNode = { ...node, next: null };
    newNode.next = cloneList(node.next);
    return newNode;
  }

  function listToArray(node: ListNode | null): number[] {
    const arr: number[] = [];
    let current = node;
    while (current) {
      arr.push(current.value);
      current = current.next;
    }
    return arr;
  }

  function generateInsertBeginSteps(list: ListNode | null, value: number): LinkedListStep[] {
    const steps: LinkedListStep[] = [];
    let stepNum = 0;

    steps.push({
      step: stepNum++,
      operation: 'Initialize',
      description: `Insert ${value} at the beginning`,
      list: cloneList(list)
    });

    const newNode = createNode(value);
    steps.push({
      step: stepNum++,
      operation: 'Create Node',
      currentNode: newNode.id,
      value,
      description: `Create new node with value ${value}`,
      list: newNode,
      highlight: [newNode.id]
    });

    newNode.next = list;
    steps.push({
      step: stepNum++,
      operation: 'Link',
      currentNode: newNode.id,
      description: `Point new node to current head`,
      list: cloneList(newNode),
      highlight: [newNode.id]
    });

    steps.push({
      step: stepNum++,
      operation: 'Update Head',
      description: `Update head to point to new node`,
      list: cloneList(newNode)
    });

    return steps;
  }

  function generateInsertEndSteps(list: ListNode | null, value: number): LinkedListStep[] {
    const steps: LinkedListStep[] = [];
    let stepNum = 0;

    steps.push({
      step: stepNum++,
      operation: 'Initialize',
      description: `Insert ${value} at the end`,
      list: cloneList(list)
    });

    const newNode = createNode(value);

    if (!list) {
      steps.push({
        step: stepNum++,
        operation: 'Empty List',
        description: `List is empty, new node becomes head`,
        list: cloneList(newNode)
      });
      return steps;
    }

    let current = list;
    const path: string[] = [current.id];
    
    while (current.next) {
      steps.push({
        step: stepNum++,
        operation: 'Traverse',
        currentNode: current.id,
        description: `Move to next node (value: ${current.next.value})`,
        list: cloneList(list),
        highlight: path
      });
      current = current.next;
      path.push(current.id);
    }

    steps.push({
      step: stepNum++,
      operation: 'Found End',
      currentNode: current.id,
      description: `Reached last node (value: ${current.value})`,
      list: cloneList(list),
      highlight: path
    });

    current.next = newNode;
    steps.push({
      step: stepNum++,
      operation: 'Link',
      description: `Link last node to new node`,
      list: cloneList(list)
    });

    return steps;
  }

  function generateSearchSteps(list: ListNode | null, target: number): LinkedListStep[] {
    const steps: LinkedListStep[] = [];
    let stepNum = 0;
    let index = 0;

    steps.push({
      step: stepNum++,
      operation: 'Initialize',
      description: `Search for value ${target}`,
      list: cloneList(list)
    });

    let current = list;
    while (current) {
      steps.push({
        step: stepNum++,
        operation: 'Check',
        currentNode: current.id,
        value: current.value,
        index,
        description: `Check node at index ${index}: value = ${current.value} ${current.value === target ? '✓ Found!' : '✗'}`,
        list: cloneList(list),
        highlight: [current.id]
      });

      if (current.value === target) {
        steps.push({
          step: stepNum++,
          operation: 'Found',
          currentNode: current.id,
          value: target,
          index,
          description: `Found ${target} at index ${index}`,
          list: cloneList(list),
          highlight: [current.id]
        });
        return steps;
      }

      current = current.next;
      index++;
    }

    steps.push({
      step: stepNum++,
      operation: 'Not Found',
      description: `Value ${target} not found in list`,
      list: cloneList(list)
    });

    return steps;
  }

  function generateTraverseSteps(list: ListNode | null): LinkedListStep[] {
    const steps: LinkedListStep[] = [];
    let stepNum = 0;
    let index = 0;

    steps.push({
      step: stepNum++,
      operation: 'Initialize',
      description: `Traverse the linked list`,
      list: cloneList(list)
    });

    let current = list;
    const visited: string[] = [];

    while (current) {
      visited.push(current.id);
      steps.push({
        step: stepNum++,
        operation: 'Visit',
        currentNode: current.id,
        value: current.value,
        index,
        description: `Visit node at index ${index}: value = ${current.value}`,
        list: cloneList(list),
        highlight: visited
      });

      current = current.next;
      index++;
    }

    steps.push({
      step: stepNum++,
      operation: 'Complete',
      description: `Traversal complete. Visited ${index} nodes`,
      list: cloneList(list)
    });

    return steps;
  }

  const runOperation = () => {
    speakOperation('Singly Linked List', `Running ${operations.find(op=>op.value===operation)?.label || 'operation'}.`);
    
    let newSteps: LinkedListStep[] = [];
    let newHead = head;

    switch (operation) {
      case 'insertBegin':
        newSteps = generateInsertBeginSteps(head, inputValue);
        const newNode = createNode(inputValue);
        newNode.next = head;
        newHead = newNode;
        break;
      case 'insertEnd':
        newSteps = generateInsertEndSteps(head, inputValue);
        if (!head) {
          newHead = createNode(inputValue);
        } else {
          newHead = cloneList(head);
          let current = newHead;
          while (current!.next) current = current.next;
          current!.next = createNode(inputValue);
        }
        break;
      case 'search':
        newSteps = generateSearchSteps(head, inputValue);
        break;
      case 'traverse':
        newSteps = generateTraverseSteps(head);
        break;
      default:
        newSteps = [{
          step: 0,
          operation: 'Not Implemented',
          description: `${operation} operation coming soon`,
          list: cloneList(head)
        }];
    }

    setSteps(newSteps);
    setCurrentStep(0);
    
    if (['insertBegin', 'insertEnd'].includes(operation)) {
      setTimeout(() => setHead(newHead), 1000);
    }
    
    speakResult(`${operation} operation completed.`);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      if (steps[newStep]) {
        speakStep(`Step ${newStep + 1}`, steps[newStep].description, newStep, steps.length);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const reset = () => {
    const node1 = createNode(10);
    const node2 = createNode(20);
    const node3 = createNode(30);
    node1.next = node2;
    node2.next = node3;
    setHead(node1);
    setSteps([]);
    setCurrentStep(0);
  };

  const currentStepData = steps[currentStep];
  const displayList = currentStepData?.list || head;

  const renderList = (node: ListNode | null) => {
    const nodes: JSX.Element[] = [];
    let current = node;
    let index = 0;

    while (current) {
      const isHighlighted = currentStepData?.highlight?.includes(current.id);
      const isCurrent = currentStepData?.currentNode === current.id;

      nodes.push(
        <motion.div
          key={current.id}
          className="flex items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className={`flex flex-col items-center p-4 border-2 rounded-lg min-w-[80px] ${
              isCurrent ? 'border-red-500 bg-red-100 dark:bg-red-900' :
              isHighlighted ? 'border-yellow-500 bg-yellow-100 dark:bg-yellow-900' :
              'border-blue-500 bg-blue-100 dark:bg-blue-900'
            }`}
          >
            <div className="text-xs text-muted-foreground mb-1">[{index}]</div>
            <div className="text-xl font-bold">{current.value}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {current.next ? '→' : 'null'}
            </div>
          </div>
          {current.next && (
            <ArrowRight className="h-6 w-6 mx-2 text-gray-400" />
          )}
        </motion.div>
      );

      current = current.next;
      index++;
    }

    return nodes.length > 0 ? nodes : (
      <div className="text-gray-500 italic">Empty List</div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Operation</label>
          <Select value={operation} onValueChange={setOperation}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {operations.map(op => (
                <SelectItem key={op.value} value={op.value}>
                  {op.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!['traverse'].includes(operation) && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Value</label>
            <Input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(parseInt(e.target.value) || 0)}
            />
          </div>
        )}

        {['insertAt', 'deleteAt'].includes(operation) && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Index</label>
            <Input
              type="number"
              min="0"
              value={inputIndex}
              onChange={(e) => setInputIndex(parseInt(e.target.value) || 0)}
            />
          </div>
        )}

        <div className="flex gap-2 items-end">
          <Button onClick={runOperation} className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            Run
          </Button>
          <Button onClick={reset} variant="outline">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* List Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            Singly Linked List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="flex items-center min-w-max p-4">
              <div className="text-sm font-medium mr-4">HEAD →</div>
              {renderList(displayList)}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 text-center">
            <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded">
              <div className="text-sm text-muted-foreground">Length</div>
              <div className="text-xl font-bold">{listToArray(displayList).length}</div>
            </div>
            <div className="bg-green-50 dark:bg-green-950 p-3 rounded">
              <div className="text-sm text-muted-foreground">Head Value</div>
              <div className="text-xl font-bold">{displayList?.value ?? 'null'}</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-950 p-3 rounded">
              <div className="text-sm text-muted-foreground">Memory</div>
              <div className="text-xl font-bold">O(n)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Navigation */}
      {steps.length > 0 && (
        <div className="flex items-center justify-center gap-4">
          <Button onClick={prevStep} disabled={currentStep === 0} variant="outline">
            Previous
          </Button>
          <Badge variant="secondary">
            Step {currentStep + 1} of {steps.length}
          </Badge>
          <Button onClick={nextStep} disabled={currentStep === steps.length - 1} variant="outline">
            Next
          </Button>
        </div>
      )}

      {/* Current Step Display */}
      <AnimatePresence mode="wait">
        {currentStepData && (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-2 border-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="outline">{currentStepData.operation}</Badge>
                  Step {currentStep + 1}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">{currentStepData.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
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

      {/* Memory Layout */}
      {showMemory && (
        <MemoryLayout
          title="Linked List Memory"
          data={listToArray(displayList)}
          baseAddress={0x6000}
          wordSize={8}
        />
      )}

      {/* Educational Information */}
      <Card>
        <CardHeader>
          <CardTitle>Singly Linked List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Key Properties:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Each node contains data and pointer to next</li>
                <li>• Dynamic size (grows/shrinks as needed)</li>
                <li>• Sequential access only</li>
                <li>• No random access by index</li>
                <li>• Efficient insertion/deletion at beginning</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Time Complexities:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Insert at beginning: O(1)</li>
                <li>• Insert at end: O(n)</li>
                <li>• Delete at beginning: O(1)</li>
                <li>• Search: O(n)</li>
                <li>• Access by index: O(n)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}