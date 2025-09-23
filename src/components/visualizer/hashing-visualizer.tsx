import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Hash, Plus, Search, RotateCcw, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';
import { toast } from 'sonner';

interface HashEntry {
  key: string;
  value: string;
  hash: number;
}

export function HashingVisualizer() {
  const [tableSize, setTableSize] = useState(7);
  const [hashTable, setHashTable] = useState<(HashEntry[] | null)[]>(Array(7).fill(null));
  const [hashFunction, setHashFunction] = useState<'division' | 'multiplication' | 'djb2'>('division');
  const [collisionMethod, setCollisionMethod] = useState<'chaining' | 'linear' | 'quadratic'>('chaining');
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [searchKey, setSearchKey] = useState('');
  const [currentStep, setCurrentStep] = useState('');
  const [showMemory, setShowMemory] = useState(false);
  const [highlightedSlots, setHighlightedSlots] = useState<number[]>([]);
  const [operations, setOperations] = useState<string[]>([]);
  
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

  const calculateHash = (key: string): number => {
    switch (hashFunction) {
      case 'division':
        // Simple division method: sum of ASCII values % table size
        const sum = key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return sum % tableSize;
      
      case 'multiplication':
        // Multiplication method using golden ratio
        const A = 0.6180339887; // (√5 - 1) / 2
        const sum2 = key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return Math.floor(tableSize * ((sum2 * A) % 1));
      
      case 'djb2':
        // DJB2 hash function
        let hash = 5381;
        for (let i = 0; i < key.length; i++) {
          hash = ((hash << 5) + hash) + key.charCodeAt(i);
        }
        return Math.abs(hash) % tableSize;
      
      default:
        return 0;
    }
  };

  const findSlot = async (key: string, isInsert: boolean = false): Promise<number> => {
    const hash = calculateHash(key);
    let slot = hash;
    let attempts = 0;
    
    setHighlightedSlots([slot]);
    setCurrentStep(`Hash(${key}) = ${hash}. Checking slot ${slot}...`);
    speakStep("", `Hash function computed index ${hash} for key "${key}". Checking slot ${slot}.`, 1, tableSize);
    await sleep(800);

    if (collisionMethod === 'chaining') {
      return hash; // For chaining, always use the hash slot
    }

    // Open addressing (linear or quadratic probing)
    while (attempts < tableSize) {
      const currentSlot = hashTable[slot];
      
      if (!currentSlot || currentSlot.length === 0) {
        // Empty slot found
        if (isInsert) {
          setCurrentStep(`Found empty slot at index ${slot}`);
          speakStep("", `Found empty slot at index ${slot}. Perfect for insertion!`, attempts + 1, tableSize);
          return slot;
        } else {
          // Searching and found empty slot means key doesn't exist
          setCurrentStep(`Key "${key}" not found - reached empty slot`);
          speakStep("", `Reached empty slot at index ${slot}. Key "${key}" is not in the hash table.`, attempts + 1, tableSize);
          return -1;
        }
      }

      // Check if key already exists in this slot
      const existingEntry = currentSlot.find(entry => entry.key === key);
      if (existingEntry) {
        setCurrentStep(`Found key "${key}" at slot ${slot}`);
        speakStep("", `Found key "${key}" at slot ${slot}!`, attempts + 1, tableSize);
        return slot;
      }

      if (!isInsert) {
        // Continue probing for search
        attempts++;
        if (collisionMethod === 'linear') {
          slot = (slot + 1) % tableSize;
        } else { // quadratic
          slot = (hash + attempts * attempts) % tableSize;
        }
        
        setHighlightedSlots([slot]);
        setCurrentStep(`Collision! Probing to slot ${slot} (attempt ${attempts + 1})`);
        speakStep("", `Collision detected! Using ${collisionMethod} probing to check slot ${slot}.`, attempts + 1, tableSize);
        await sleep(600);
      } else {
        // For insertion with open addressing, we need an empty slot
        attempts++;
        if (collisionMethod === 'linear') {
          slot = (slot + 1) % tableSize;
        } else { // quadratic
          slot = (hash + attempts * attempts) % tableSize;
        }
        
        setHighlightedSlots([slot]);
        setCurrentStep(`Collision! Probing to slot ${slot} (attempt ${attempts + 1})`);
        speakStep("", `Collision detected! Using ${collisionMethod} probing to find next available slot ${slot}.`, attempts + 1, tableSize);
        await sleep(600);
      }
    }

    // Table is full
    setCurrentStep(`Hash table is full!`);
    speakStep("", `Hash table is full! Cannot insert more elements.`, tableSize, tableSize);
    return -1;
  };

  const insertEntry = useCallback(async () => {
    if (!key.trim() || !value.trim()) {
      toast.error('Please enter both key and value');
      return;
    }

    speakOperation("Hash Insert", `Inserting key-value pair: "${key}" → "${value}" using ${hashFunction} hash function and ${collisionMethod} collision resolution.`);
    
    const hash = calculateHash(key);
    const slot = await findSlot(key, true);
    
    if (slot === -1) {
      toast.error('Cannot insert - table full or error occurred');
      speakResult(`Failed to insert "${key}". Hash table may be full.`);
      return;
    }

    const newTable = [...hashTable];
    const entry: HashEntry = { key, value, hash };

    if (collisionMethod === 'chaining') {
      if (!newTable[slot]) {
        newTable[slot] = [];
      }
      // Check if key already exists and update, otherwise add new
      const existingIndex = newTable[slot]!.findIndex(e => e.key === key);
      if (existingIndex >= 0) {
        newTable[slot]![existingIndex] = entry;
        setCurrentStep(`Updated existing key "${key}" in slot ${slot}`);
        speakResult(`Updated existing key "${key}" with new value "${value}".`);
      } else {
        newTable[slot]!.push(entry);
        setCurrentStep(`Added "${key}" → "${value}" to slot ${slot}`);
        speakResult(`Successfully inserted "${key}" → "${value}" at slot ${slot} using chaining.`);
      }
    } else {
      // Open addressing
      newTable[slot] = [entry];
      setCurrentStep(`Inserted "${key}" → "${value}" at slot ${slot}`);
      speakResult(`Successfully inserted "${key}" → "${value}" at slot ${slot} using ${collisionMethod} probing.`);
    }

    setHashTable(newTable);
    setOperations(prev => [...prev, `INSERT: ${key} → ${value} (slot ${slot})`]);
    setKey('');
    setValue('');
    toast.success(`Inserted ${key} successfully`);
  }, [key, value, hashFunction, collisionMethod, tableSize, hashTable, speakOperation, speakResult]);

  const searchEntry = useCallback(async () => {
    if (!searchKey.trim()) {
      toast.error('Please enter a key to search');
      return;
    }

    speakOperation("Hash Search", `Searching for key "${searchKey}" using ${hashFunction} hash function and ${collisionMethod} collision resolution.`);
    
    const slot = await findSlot(searchKey, false);
    
    if (slot === -1) {
      setCurrentStep(`Key "${searchKey}" not found`);
      speakResult(`Key "${searchKey}" was not found in the hash table.`);
      toast.error(`Key "${searchKey}" not found`);
    } else {
      const entry = hashTable[slot]?.find(e => e.key === searchKey);
      if (entry) {
        setCurrentStep(`Found "${searchKey}" → "${entry.value}" at slot ${slot}`);
        speakResult(`Found key "${searchKey}" with value "${entry.value}" at slot ${slot}.`);
        toast.success(`Found: ${searchKey} → ${entry.value}`);
      }
    }
    
    setSearchKey('');
  }, [searchKey, hashFunction, collisionMethod, hashTable, speakOperation, speakResult]);

  const clearTable = () => {
    setHashTable(Array(tableSize).fill(null));
    setOperations([]);
    setCurrentStep('');
    setHighlightedSlots([]);
    toast.success('Hash table cleared');
  };

  const resizeTable = (newSize: number) => {
    setTableSize(newSize);
    setHashTable(Array(newSize).fill(null));
    setOperations([]);
    setCurrentStep('');
    setHighlightedSlots([]);
    toast.success(`Table resized to ${newSize}`);
  };

  const getLoadFactor = () => {
    const totalEntries = hashTable.reduce((count, slot) => {
      return count + (slot ? slot.length : 0);
    }, 0);
    return (totalEntries / tableSize).toFixed(2);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Hashing Visualizer</h2>
        <p className="text-muted-foreground">
          Explore hash functions and collision resolution techniques
        </p>
      </div>

      {/* Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-xl border">
        <div className="space-y-2">
          <label className="text-sm font-medium">Table Size:</label>
          <Select value={tableSize.toString()} onValueChange={(value) => resizeTable(parseInt(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="7">7</SelectItem>
              <SelectItem value="11">11</SelectItem>
              <SelectItem value="13">13</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Hash Function:</label>
          <Select value={hashFunction} onValueChange={(value: any) => setHashFunction(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="division">Division Method</SelectItem>
              <SelectItem value="multiplication">Multiplication Method</SelectItem>
              <SelectItem value="djb2">DJB2 Hash</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Collision Resolution:</label>
          <Select value={collisionMethod} onValueChange={(value: any) => setCollisionMethod(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="chaining">Separate Chaining</SelectItem>
              <SelectItem value="linear">Linear Probing</SelectItem>
              <SelectItem value="quadratic">Quadratic Probing</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Load Factor:</label>
          <div className="p-2 bg-muted rounded text-center font-mono">
            {getLoadFactor()}
          </div>
        </div>
      </div>

      {/* Operations */}
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <div className="flex items-center gap-2">
          <Input 
            className="w-32" 
            value={key} 
            onChange={e => setKey(e.target.value)} 
            placeholder="Key"
          />
          <Input 
            className="w-32" 
            value={value} 
            onChange={e => setValue(e.target.value)} 
            placeholder="Value"
          />
          <Button onClick={insertEntry}>
            <Plus className="w-4 h-4 mr-2" />
            Insert
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Input 
            className="w-32" 
            value={searchKey} 
            onChange={e => setSearchKey(e.target.value)} 
            placeholder="Search key"
          />
          <Button onClick={searchEntry} variant="secondary">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
        
        <Button onClick={clearTable} variant="outline">
          <Trash2 className="w-4 h-4 mr-2" />
          Clear
        </Button>
      </div>

      {/* Current Step Display */}
      {currentStep && (
        <div className="p-4 bg-muted/20 rounded-lg border">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Step</Badge>
            <span className="text-sm font-medium">{currentStep}</span>
          </div>
        </div>
      )}

      {/* Hash Table Visualization */}
      <div className="p-6 bg-gradient-visualization rounded-xl border-2 border-primary/20">
        <h4 className="text-lg font-semibold mb-4 text-center">Hash Table ({collisionMethod})</h4>
        
        <div className="grid grid-cols-1 gap-3 max-w-4xl mx-auto">
          {hashTable.map((slot, index) => (
            <motion.div
              key={index}
              className={`
                border-2 rounded-lg p-3 min-h-[60px] transition-all duration-300 ${
                  highlightedSlots.includes(index)
                    ? 'border-blue-500 bg-blue-100'
                    : 'border-gray-300 bg-white'
                }
              `}
              initial={{ scale: 1 }}
              animate={{ scale: highlightedSlots.includes(index) ? 1.02 : 1 }}
            >
              <div className="flex items-center justify-between">
                <div className="font-mono text-sm font-bold">
                  Slot {index}:
                </div>
                <div className="flex gap-2 flex-wrap">
                  {slot && slot.length > 0 ? (
                    slot.map((entry, entryIndex) => (
                      <div
                        key={entryIndex}
                        className="bg-green-100 border border-green-300 rounded px-2 py-1 text-xs"
                      >
                        <span className="font-semibold">{entry.key}</span>
                        <span className="text-muted-foreground"> → </span>
                        <span>{entry.value}</span>
                        {collisionMethod === 'chaining' && slot.length > 1 && (
                          <span className="text-xs text-blue-600 ml-1">
                            (chain {entryIndex + 1})
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">empty</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-2">Hash Function Details:</h4>
          <div className="space-y-2 text-sm">
            <div><strong>Method:</strong> {hashFunction}</div>
            <div><strong>Table Size:</strong> {tableSize}</div>
            <div><strong>Load Factor:</strong> {getLoadFactor()}</div>
            <div><strong>Collision Method:</strong> {collisionMethod}</div>
          </div>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-2">Performance:</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div><strong>Average Insert:</strong> O(1)</div>
            <div><strong>Average Search:</strong> O(1)</div>
            <div><strong>Worst Case:</strong> O(n)</div>
            <div><strong>Space:</strong> O(n)</div>
          </div>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-2">Collision Info:</h4>
          <div className="space-y-1 text-sm text-muted-foreground">
            {collisionMethod === 'chaining' && (
              <>
                <div>• Uses linked lists</div>
                <div>• No table size limit</div>
                <div>• Good for high load factors</div>
              </>
            )}
            {collisionMethod === 'linear' && (
              <>
                <div>• Probes next slot linearly</div>
                <div>• Can cause clustering</div>
                <div>• Simple implementation</div>
              </>
            )}
            {collisionMethod === 'quadratic' && (
              <>
                <div>• Probes using i² pattern</div>
                <div>• Reduces clustering</div>
                <div>• Better distribution</div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Operations History */}
      {operations.length > 0 && (
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-3">Operations History:</h4>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {operations.slice(-10).map((op, index) => (
              <div key={index} className="text-sm font-mono p-2 bg-muted/20 rounded">
                {op}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Memory Layout */}
      {showMemory && (
        <MemoryLayout
          title="Hash Table Memory Layout"
          data={hashTable.map((slot, i) => slot ? slot.length : 0)}
          baseAddress={0x4000}
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
