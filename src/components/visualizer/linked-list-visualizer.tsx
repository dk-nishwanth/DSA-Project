import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Plus, Minus, Search, RotateCcw } from 'lucide-react';
import { PseudocodeBox } from '@/components/pseudocode-box';
import { ComplexityBox } from '@/components/complexity-box';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVoiceExplain } from '@/hooks/useVoiceExplain';

interface Node {
  id: string;
  value: number;
  next?: string;
}

export function LinkedListVisualizer() {

  const [nodes, setNodes] = useState<Node[]>([
    { id: '1', value: 10, next: '2' },
    { id: '2', value: 20, next: '3' },
    { id: '3', value: 30 }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [position, setPosition] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [stepDesc, setStepDesc] = useState('');
  const [showMemory, setShowMemory] = useState(false);
  const [pseudoTitle, setPseudoTitle] = useState('');
  const [pseudoCode, setPseudoCode] = useState<string[]>([]);
  const [pseudoLine, setPseudoLine] = useState(0);
  const { enabled: voiceEnabled, setEnabled: setVoiceEnabled } = useVoiceExplain(stepDesc);

  const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

  const handleInsert = async (pos: 'head' | 'tail' | 'position') => {
    const value = parseInt(inputValue);
    if (isNaN(value)) return;

    setIsAnimating(true);
    setOperation(`Inserting ${value} at ${pos}`);
    setPseudoTitle(`Insert ${pos === 'head' ? 'Head' : 'Tail'} - Pseudocode`);
    const code = pos==='head' ? [
      'newNode = create(value)',
      'newNode.next = head',
      'head = newNode'
    ] : [
      'newNode = create(value)',
      'if head == null: head = newNode',
      'else: traverse to tail; tail.next = newNode'
    ];
    setPseudoCode(code); setPseudoLine(1);
    setStepDesc(`Create new node with value ${value}.`);

    const newNode: Node = {
      id: Date.now().toString(),
      value,
    };

    if (pos === 'head') {
      await sleep(400);
      setPseudoLine(2); setStepDesc('Link newNode.next to current head.');
      newNode.next = nodes.length > 0 ? nodes[0].id : undefined;
      setNodes(prev => [newNode, ...prev]);
      setHighlightedNode(newNode.id);
      await sleep(400);
      setPseudoLine(3); setStepDesc('Move head pointer to new node.');
    } else if (pos === 'tail') {
      await sleep(400);
      setPseudoLine(2);
      if (nodes.length > 0) {
        setStepDesc('Traverse to tail and connect new node.');
        setNodes(prev => {
          const updated = [...prev];
          updated[updated.length - 1].next = newNode.id;
          return [...updated, newNode];
        });
      } else {
        setNodes([newNode]);
      }
      setHighlightedNode(newNode.id);
      await sleep(400);
      setPseudoLine(3);
    }

    setInputValue('');
    await sleep(600);
    setHighlightedNode(null);
    setIsAnimating(false);
    setOperation(null);
    setStepDesc('');
  };

  const handleDelete = async (pos: 'head' | 'tail') => {
    if (nodes.length === 0) return;

    setIsAnimating(true);
    setOperation(`Deleting from ${pos}`);
    setPseudoTitle(`Delete ${pos==='head'?'Head':'Tail'} - Pseudocode`);
    const code = pos==='head' ? [
      'if head == null: return',
      'head = head.next'
    ] : [
      'if head == null: return',
      'traverse to second last',
      'secondLast.next = null'
    ];
    setPseudoCode(code); setPseudoLine(1);

    if (pos === 'head') {
      setHighlightedNode(nodes[0].id);
      setStepDesc('Move head to next node.');
      await sleep(600);
      setPseudoLine(2);
      setNodes(prev => prev.slice(1));
      setHighlightedNode(null);
      setIsAnimating(false);
      setOperation(null);
      setStepDesc('');
    } else if (pos === 'tail') {
      const lastNode = nodes[nodes.length - 1];
      setHighlightedNode(lastNode.id);
      setStepDesc('Detach last node by setting previous next to null.');
      await sleep(600);
      setPseudoLine(3);
      setNodes(prev => {
        const updated = prev.slice(0, -1);
        if (updated.length > 0) {
          updated[updated.length - 1].next = undefined;
        }
        return updated;
      });
      setHighlightedNode(null);
      setIsAnimating(false);
      setOperation(null);
      setStepDesc('');
    }
  };

  const handleSearch = async () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) return;

    setIsAnimating(true);
    setOperation(`Searching for ${value}`);
    setPseudoTitle('Search - Pseudocode');
    setPseudoCode([
      'current = head',
      'while current != null:',
      '  if current.value == x: return true',
      '  current = current.next',
      'return false'
    ]);
    setPseudoLine(1);

    for (let i = 0; i < nodes.length; i++) {
      setHighlightedNode(nodes[i].id);
      setStepDesc(`Visit node ${i} (value=${nodes[i].value}).`);
      setPseudoLine(2);
      await new Promise(resolve => setTimeout(resolve, 600));
      
      if (nodes[i].value === value) {
        setPseudoLine(3);
        setOperation(`Found ${value}!`);
        setTimeout(() => {
          setHighlightedNode(null);
          setIsAnimating(false);
          setOperation(null);
          setStepDesc('');
        }, 1000);
        return;
      }
      setPseudoLine(4);
    }

    setOperation(`${value} not found`);
    setTimeout(() => {
      setHighlightedNode(null);
      setIsAnimating(false);
      setOperation(null);
      setStepDesc('');
    }, 1000);
  };

  const handleReset = () => {
    setNodes([
      { id: '1', value: 10, next: '2' },
      { id: '2', value: 20, next: '3' },
      { id: '3', value: 30 }
    ]);
    setHighlightedNode(null);
    setIsAnimating(false);
    setOperation(null);
    setStepDesc('');
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Linked List Visualizer</h3>
        <p className="text-muted-foreground">
          Interactive singly linked list with insert, delete, and search operations
        </p>
      </div>

      {/* Linked List Visualization */}
      <div className="bg-gradient-visualization rounded-xl border-2 border-primary/20 p-6 overflow-x-auto">
        <div className="flex items-center gap-4 min-h-[120px] p-4 justify-center">
          <AnimatePresence mode="popLayout">
            {nodes.map((node, index) => (
              <motion.div
                key={node.id}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  scale: highlightedNode === node.id ? 1.1 : 1,
                  y: 0 
                }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                className="flex items-center gap-3"
              >
                <div className={`
                  flex flex-col items-center p-4 rounded-xl border-2 min-w-[80px]
                  ${highlightedNode === node.id 
                    ? 'bg-primary text-primary-foreground border-primary shadow-lg' 
                    : 'bg-card border-border hover:border-primary/50'
                  }
                  transition-all duration-300
                `}>
                  <span className="text-lg font-bold">{node.value}</span>
                  <span className="text-xs text-muted-foreground">Node {index + 1}</span>
                </div>
                
                {node.next && (
                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                )}
                
                {!node.next && index === nodes.length - 1 && (
                  <div className="w-6 h-6 border-2 border-dashed border-muted-foreground rounded opacity-50" />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {nodes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              List is empty
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Enter value"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1"
                type="number"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={() => handleInsert('head')}
                disabled={isAnimating || !inputValue}
                size="sm"
                variant="default"
              >
                <Plus className="h-4 w-4 mr-1" />
                Insert Head
              </Button>
              
              <Button 
                onClick={() => handleInsert('tail')}
                disabled={isAnimating || !inputValue}
                size="sm"
                variant="default"
              >
                <Plus className="h-4 w-4 mr-1" />
                Insert Tail
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
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={() => handleDelete('head')}
                disabled={isAnimating || nodes.length === 0}
                size="sm"
                variant="destructive"
              >
                <Minus className="h-4 w-4 mr-1" />
                Delete Head
              </Button>
              
              <Button 
                onClick={() => handleDelete('tail')}
                disabled={isAnimating || nodes.length === 0}
                size="sm"
                variant="destructive"
              >
                <Minus className="h-4 w-4 mr-1" />
                Delete Tail
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
          </div>
        </div>

        {/* Status */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">
            Length: {nodes.length}
          </Badge>
          {operation && (
            <Badge variant="secondary" className="animate-pulse">
              {operation}
            </Badge>
          )}
        </div>

        {stepDesc && (
          <div className="p-3 bg-muted/20 rounded-lg">
            <p className="text-sm">{stepDesc}</p>
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
          baseAddress={4000}
          wordSize={4}
        />
      )}

      {/* Pseudocode */}
      <PseudocodeBox title={pseudoTitle || 'Singly Linked List - Pseudocode'} code={pseudoCode} highlightedLine={pseudoLine} />

      {/* Complexity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ComplexityBox
          title="Time Complexity"
          timeComplexity="O(1) - O(n)"
          spaceComplexity="O(1)"
          description="Insert/Delete at head: O(1), tail and search operations: O(n)"
        />
        <div className="bg-muted/20 rounded-lg p-4">
          <h4 className="font-semibold mb-2">Key Points</h4>
          <ul className="text-sm space-y-1">
            <li>• No random access; traversal from head.</li>
            <li>• Head insertion is O(1); tail insertion O(n) unless tail pointer maintained.</li>
            <li>• Good for frequent insert/delete at head.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}