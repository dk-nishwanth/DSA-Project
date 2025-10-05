import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Play, Trash2, Search, RotateCcw } from 'lucide-react';
import { PseudocodeBox } from '@/components/pseudocode-box';
import { ComplexityBox } from '@/components/complexity-box';
import { toast } from 'sonner';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

interface HashNode {
  key: string;
  value: string;
  next?: HashNode;
}

interface HashBucket {
  index: number;
  head: HashNode | null;
  highlighted: boolean;
  chainLength: number;
}

export function SeparateChainingVisualizer() {
  const [tableSize] = useState(7);
  const [table, setTable] = useState<HashBucket[]>(
    Array.from({ length: 7 }, (_, i) => ({
      index: i,
      head: null,
      highlighted: false,
      chainLength: 0
    }))
  );
  
  const [inputKey, setInputKey] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [searchKey, setSearchKey] = useState('');
  const [operation, setOperation] = useState<'insert' | 'search' | 'delete' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [stepDescription, setStepDescription] = useState('');
  const [showMemory, setShowMemory] = useState(false);
  const { voiceEnabled, setVoiceEnabled, speed, setSpeed, isSpeaking, pauseSpeech, resumeSpeech, stopSpeech, speakOperation, speakStep, speakResult } = useVisualizerVoice({ minInterval: 2000 });

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Simple hash function
  const hashFunction = (key: string): number => {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash + key.charCodeAt(i)) % tableSize;
    }
    return hash;
  };

  const pseudocodeInsert = [
    "function insert(key, value):",
    "  index = hash(key) % tableSize",
    "  newNode = createNode(key, value)",
    "  if table[index] is empty:",
    "    table[index] = newNode",
    "  else:",
    "    newNode.next = table[index]",
    "    table[index] = newNode"
  ];

  const pseudocodeSearch = [
    "function search(key):",
    "  index = hash(key) % tableSize",
    "  current = table[index]",
    "  while current is not null:",
    "    if current.key == key:",
    "      return current.value",
    "    current = current.next",
    "  return null"
  ];

  const pseudocodeDelete = [
    "function delete(key):",
    "  index = hash(key) % tableSize",
    "  current = table[index]",
    "  if current.key == key:",
    "    table[index] = current.next",
    "  else:",
    "    while current.next:",
    "      if current.next.key == key:",
    "        current.next = current.next.next",
    "        break"
  ];

  const insertKeyValue = useCallback(async (key: string, value: string) => {
    setIsAnimating(true);
    setOperation('insert');
    
    // Step 1: Calculate hash
    setCurrentStep(1);
    setStepDescription(`Computing hash for key "${key}"`);
    await sleep(800);
    
    const index = hashFunction(key);
    setTable(table => table.map((bucket, i) => ({
      ...bucket,
      highlighted: i === index
    })));
    
    setCurrentStep(2);
    setStepDescription(`Hash value: ${index}. Creating new node`);
    await sleep(800);
    
    // Step 2: Create new node and insert
    const newNode: HashNode = { key, value };
    
    setTable(table => table.map((bucket, i) => {
      if (i === index) {
        if (bucket.head === null) {
          setCurrentStep(4);
          setStepDescription(`Bucket ${index} is empty. Adding as first node`);
          return {
            ...bucket,
            head: newNode,
            chainLength: 1
          };
        } else {
          setCurrentStep(6);
          setStepDescription(`Bucket ${index} has collision. Adding to front of chain`);
          newNode.next = bucket.head;
          return {
            ...bucket,
            head: newNode,
            chainLength: bucket.chainLength + 1
          };
        }
      }
      return bucket;
    }));
    
    await sleep(1000);
    
    // Clear highlighting
    setTable(table => table.map(bucket => ({ ...bucket, highlighted: false })));
    setCurrentStep(-1);
    setStepDescription('');
    setOperation(null);
    setIsAnimating(false);
    
    toast.success(`Inserted "${key}": "${value}" successfully!`);
  }, [tableSize]);

  const searchForKey = useCallback(async (key: string) => {
    setIsAnimating(true);
    setOperation('search');
    
    // Step 1: Calculate hash
    setCurrentStep(1);
    setStepDescription(`Computing hash for key "${key}"`);
    await sleep(800);
    
    const index = hashFunction(key);
    setTable(table => table.map((bucket, i) => ({
      ...bucket,
      highlighted: i === index
    })));
    
    setCurrentStep(2);
    setStepDescription(`Hash value: ${index}. Starting search in chain`);
    await sleep(800);
    
    // Step 2: Search in chain
    const bucket = table[index];
    let current = bucket.head;
    let found = false;
    
    setCurrentStep(3);
    setStepDescription('Traversing the chain to find the key');
    
    while (current !== null) {
      await sleep(600);
      if (current.key === key) {
        setCurrentStep(4);
        setStepDescription(`Found! "${key}": "${current.value}"`);
        found = true;
        break;
      }
      current = current.next;
      setCurrentStep(5);
      setStepDescription('Key not found, checking next node...');
    }
    
    if (!found) {
      setCurrentStep(-1);
      setStepDescription(`Key "${key}" not found in the table`);
      toast.error(`Key "${key}" not found!`);
    } else {
      toast.success(`Found "${key}": "${current?.value}"`);
    }
    
    await sleep(1000);
    
    // Clear highlighting
    setTable(table => table.map(bucket => ({ ...bucket, highlighted: false })));
    setCurrentStep(-1);
    setStepDescription('');
    setOperation(null);
    setIsAnimating(false);
  }, [table, tableSize]);

  const deleteKey = useCallback(async (key: string) => {
    setIsAnimating(true);
    setOperation('delete');
    
    // Step 1: Calculate hash
    setCurrentStep(1);
    setStepDescription(`Computing hash for key "${key}"`);
    await sleep(800);
    
    const index = hashFunction(key);
    setTable(table => table.map((bucket, i) => ({
      ...bucket,
      highlighted: i === index
    })));
    
    setCurrentStep(2);
    setStepDescription(`Hash value: ${index}. Searching for key to delete`);
    await sleep(800);
    
    // Step 2: Find and delete
    setTable(table => table.map((bucket, i) => {
      if (i === index && bucket.head) {
        let current = bucket.head;
        
        // If head node matches
        if (current.key === key) {
          setCurrentStep(3);
          setStepDescription(`Found key at head. Removing first node`);
          return {
            ...bucket,
            head: current.next || null,
            chainLength: Math.max(0, bucket.chainLength - 1)
          };
        }
        
        // Search in chain
        while (current.next) {
          if (current.next.key === key) {
            setCurrentStep(6);
            setStepDescription(`Found key in chain. Unlinking node`);
            current.next = current.next.next;
            return {
              ...bucket,
              chainLength: Math.max(0, bucket.chainLength - 1)
            };
          }
          current = current.next;
        }
      }
      return bucket;
    }));
    
    await sleep(1000);
    
    // Clear highlighting
    setTable(table => table.map(bucket => ({ ...bucket, highlighted: false })));
    setCurrentStep(-1);
    setStepDescription('');
    setOperation(null);
    setIsAnimating(false);
    
    toast.success(`Deleted key "${key}" successfully!`);
  }, [tableSize]);

  const handleInsert = async () => {
    speakOperation('Hash Insert (Chaining)', 'Compute slot by hash and insert at head of chain to resolve collisions.');
    if (!inputKey.trim() || !inputValue.trim()) {
      toast.error('Please enter both key and value');
      return;
    }
    await insertKeyValue(inputKey.trim(), inputValue.trim());
    setInputKey('');
    setInputValue('');
  };

  const handleSearch = async () => {
    speakOperation('Hash Search (Chaining)', 'Compute slot by hash and traverse the linked list at that bucket.');
    if (!searchKey.trim()) {
      toast.error('Please enter a key to search');
      return;
    }
    await searchForKey(searchKey.trim());
  };

  const handleDelete = async () => {
    speakOperation('Hash Delete (Chaining)', 'Compute slot by hash and unlink node from the chain.');
    if (!searchKey.trim()) {
      toast.error('Please enter a key to delete');
      return;
    }
    await deleteKey(searchKey.trim());
    setSearchKey('');
  };

  const handleReset = () => {
    setTable(Array.from({ length: 7 }, (_, i) => ({
      index: i,
      head: null,
      highlighted: false,
      chainLength: 0
    })));
    setInputKey('');
    setInputValue('');
    setSearchKey('');
    setOperation(null);
    setCurrentStep(-1);
    setStepDescription('');
    toast.info('Hash table reset!');
  };

  const renderChain = (bucket: HashBucket) => {
    const nodes = [];
    let current = bucket.head;
    let position = 0;
    
    while (current) {
      nodes.push(
        <div key={`${bucket.index}-${position}`} className="flex items-center">
          <div className="bg-secondary border-2 border-primary/20 rounded-lg p-2 min-w-[80px] text-center">
            <div className="text-xs font-medium text-muted-foreground">Key</div>
            <div className="font-mono text-sm">{current.key}</div>
            <div className="text-xs font-medium text-muted-foreground">Value</div>
            <div className="font-mono text-sm">{current.value}</div>
          </div>
          {current.next && (
            <div className="mx-2 text-muted-foreground">→</div>
          )}
        </div>
      );
      current = current.next;
      position++;
    }
    
    return nodes.length > 0 ? nodes : <div className="text-muted-foreground italic">Empty</div>;
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-4 p-4 bg-card border rounded-xl">
          <h3 className="text-lg font-semibold">Insert Operation</h3>
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="inputKey">Key</Label>
              <Input
                id="inputKey"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="Enter key"
                disabled={isAnimating}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="inputValue">Value</Label>
              <Input
                id="inputValue"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter value"
                disabled={isAnimating}
              />
            </div>
          </div>
          <Button onClick={handleInsert} disabled={isAnimating} className="w-full">
            <Play className="h-4 w-4 mr-2" />
            Insert
          </Button>
        </div>
        
        <div className="space-y-4 p-4 bg-card border rounded-xl">
          <h3 className="text-lg font-semibold">Search & Delete</h3>
          <div>
            <Label htmlFor="searchKey">Key</Label>
            <Input
              id="searchKey"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              placeholder="Enter key"
              disabled={isAnimating}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSearch} disabled={isAnimating} variant="outline" className="flex-1">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button onClick={handleDelete} disabled={isAnimating} variant="outline" className="flex-1">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
          <Button onClick={handleReset} variant="outline" className="w-full">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Controls below visualization: voice + memory */}
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

      {showMemory && (
        <MemoryLayout
          title="Chain Lengths per Bucket"
          data={table.map(b=>b.chainLength) as number[]}
          baseAddress={0x5A00}
          wordSize={2}
        />
      )}

      {/* Status */}
      {stepDescription && (
        <div className="p-3 bg-info/10 border border-info/20 rounded-lg">
          <p className="text-info font-medium">{stepDescription}</p>
        </div>
      )}

      {/* Hash Table Visualization */}
      <div className="bg-gradient-visualization rounded-xl p-6 border-2 border-primary/20">
        <h3 className="text-lg font-semibold mb-4 text-center">Separate Chaining Hash Table</h3>
        <div className="space-y-3">
          {table.map((bucket) => (
            <div 
              key={bucket.index}
              className={`flex items-center p-3 rounded-lg border-2 transition-all duration-300 ${
                bucket.highlighted 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border bg-card'
              }`}
            >
              <div className="flex items-center min-w-[100px]">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold mr-3">
                  {bucket.index}
                </div>
                <Badge variant="outline" className="text-xs">
                  {bucket.chainLength} items
                </Badge>
              </div>
              <div className="flex-1 ml-4">
                <div className="flex items-center gap-2 overflow-x-auto">
                  {renderChain(bucket)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hash Function Display */}
      <div className="p-4 bg-card border rounded-xl">
        <h4 className="text-lg font-semibold mb-2">Hash Function</h4>
        <code className="bg-muted p-2 rounded text-sm block">
          hash(key) = (sum of ASCII values of characters) % {tableSize}
        </code>
      </div>

      {/* Pseudocode and Complexity */}
      <div className="grid md:grid-cols-2 gap-6">
        <PseudocodeBox
          title={`${operation ? operation.charAt(0).toUpperCase() + operation.slice(1) : 'Separate Chaining'} Algorithm`}
          code={
            operation === 'insert' ? pseudocodeInsert :
            operation === 'search' ? pseudocodeSearch :
            operation === 'delete' ? pseudocodeDelete :
            pseudocodeInsert
          }
          highlightedLine={currentStep}
        />
        
        <ComplexityBox
          timeComplexity="O(1) avg, O(n) worst"
          spaceComplexity="O(n)"
          title="Separate Chaining Complexity"
          description="Average case assumes good hash distribution. Worst case occurs when all keys hash to same bucket, creating a long chain."
        />
      </div>
    </div>
  );
}