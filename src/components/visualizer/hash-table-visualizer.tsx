import React, { useState, useCallback, useEffect } from 'react';
import { Play, RotateCcw, Plus, Minus, Search, HardDrive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { useVoiceExplain } from '@/hooks/useVoiceExplain';

type CollisionMethod = 'chaining' | 'linear-probing' | 'quadratic-probing';

interface HashEntry {
  key: string;
  value: string;
  isDeleted?: boolean;
}

interface ChainNode {
  key: string;
  value: string;
  next?: ChainNode;
}

export function HashTableVisualizer() {
  const [tableSize, setTableSize] = useState(7);
  const [method, setMethod] = useState<CollisionMethod>('chaining');
  const [inputKey, setInputKey] = useState('apple');
  const [inputValue, setInputValue] = useState('red');
  const [searchKey, setSearchKey] = useState('apple');
  const [isAnimating, setIsAnimating] = useState(false);
  const [highlightedSlots, setHighlightedSlots] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState('Hash table visualizer loaded. Try inserting or searching for keys to see the collision resolution in action!');
  const [showMemory, setShowMemory] = useState(false);
  const { 
    enabled: voiceEnabled, 
    setEnabled: setVoiceEnabled,
    speed: voiceSpeed,
    setSpeed: setVoiceSpeed,
    isSpeaking,
    pauseSpeech,
    resumeSpeech,
    stopSpeech
  } = useVoiceExplain(currentStep);

  // For separate chaining
  const [chainTable, setChainTable] = useState<(ChainNode | null)[]>(Array(7).fill(null));
  
  // For open addressing
  const [openTable, setOpenTable] = useState<(HashEntry | null)[]>(Array(7).fill(null));

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Update current step when method changes
  useEffect(() => {
    const methodName = method.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    setCurrentStep(`Switched to ${methodName} collision resolution method. Ready for hash table operations!`);
  }, [method]);

  const hashFunction = useCallback((key: string, size: number) => {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash * 31 + key.charCodeAt(i)) % size;
    }
    return Math.abs(hash);
  }, []);

  const quadraticProbe = useCallback((hash: number, attempt: number, size: number) => {
    return (hash + attempt * attempt) % size;
  }, []);

  const resetTable = useCallback(() => {
    const newSize = Math.max(3, Math.min(15, tableSize));
    setChainTable(Array(newSize).fill(null));
    setOpenTable(Array(newSize).fill(null));
    setHighlightedSlots([]);
    setCurrentStep('Hash table reset. Ready for new operations.');
    setIsAnimating(false);
    toast.success('Hash table reset');
  }, [tableSize]);

  const insertChaining = useCallback(async (key: string, value: string) => {
    const hash = hashFunction(key, chainTable.length);
    setHighlightedSlots([hash]);
    setCurrentStep(`Using hash function to compute index for key "${key}". Hash(${key}) = ${hash}. This is our target slot in the hash table.`);
    
    await sleep(800);

    const newTable = [...chainTable];
    if (!newTable[hash]) {
      newTable[hash] = { key, value };
      setCurrentStep(`Perfect! Slot ${hash} is empty, so we can insert the key-value pair "${key}": "${value}" directly. No collision occurred.`);
    } else {
      // Handle collision by chaining
      let current = newTable[hash];
      while (current) {
        if (current.key === key) {
          current.value = value;
          setCurrentStep(`Key "${key}" already exists in the chain at slot ${hash}. Updating its value to "${value}".`);
          setChainTable(newTable);
          return;
        }
        if (!current.next) break;
        current = current.next;
      }
      current!.next = { key, value };
      setCurrentStep(`Collision detected! Slot ${hash} is occupied, but with separate chaining, we can add "${key}": "${value}" to the linked list chain at this slot.`);
    }
    
    setChainTable(newTable);
    await sleep(800);
  }, [chainTable, hashFunction]);

  const insertOpenAddressing = useCallback(async (key: string, value: string) => {
    const originalHash = hashFunction(key, openTable.length);
    let hash = originalHash;
    let attempt = 0;
    
    setCurrentStep(`Using hash function to compute index for key "${key}". Hash(${key}) = ${originalHash}. Starting open addressing insertion.`);
    await sleep(800);
    
    while (attempt < openTable.length) {
      setHighlightedSlots([hash]);
      
      if (attempt === 0) {
        setCurrentStep(`First attempt: checking slot ${hash} for key "${key}".`);
      } else {
        const probingMethod = method === 'linear-probing' ? 'linear probing' : 'quadratic probing';
        setCurrentStep(`Attempt ${attempt + 1}: using ${probingMethod} to check slot ${hash} for key "${key}".`);
      }
      
      await sleep(600);

      if (!openTable[hash] || openTable[hash]?.isDeleted) {
        const newTable = [...openTable];
        newTable[hash] = { key, value };
        setOpenTable(newTable);
        setCurrentStep(`Success! Found empty slot ${hash}. Inserted "${key}": "${value}" using open addressing after ${attempt + 1} attempts.`);
        await sleep(800);
        return;
      } else if (openTable[hash]?.key === key) {
        const newTable = [...openTable];
        newTable[hash] = { key, value };
        setOpenTable(newTable);
        setCurrentStep(`Key "${key}" already exists at slot ${hash}. Updated its value to "${value}".`);
        await sleep(800);
        return;
      } else {
        const occupyingKey = openTable[hash]?.key;
        setCurrentStep(`Collision! Slot ${hash} is occupied by "${occupyingKey}". Need to probe for next available slot.`);
        await sleep(600);
        
        attempt++;
        if (method === 'linear-probing') {
          hash = (originalHash + attempt) % openTable.length;
          setCurrentStep(`Linear probing: trying next slot ${hash} (original + ${attempt}).`);
        } else {
          hash = quadraticProbe(originalHash, attempt, openTable.length);
          setCurrentStep(`Quadratic probing: trying slot ${hash} using formula (original + ${attempt}²) mod table_size.`);
        }
        await sleep(400);
      }
    }
    
    setCurrentStep(`Hash table is full! Checked all ${openTable.length} slots but couldn't find space for "${key}".`);
    toast.error('Hash table is full');
  }, [openTable, hashFunction, method, quadraticProbe]);

  const searchItem = useCallback(async () => {
    if (!searchKey.trim()) {
      toast.error('Please enter a key to search');
      return;
    }

    setIsAnimating(true);
    setHighlightedSlots([]);
    
    if (method === 'chaining') {
      const hash = hashFunction(searchKey, chainTable.length);
      setHighlightedSlots([hash]);
      setCurrentStep(`Searching for "${searchKey}" using separate chaining. Hash(${searchKey}) = ${hash}. Checking the chain at slot ${hash}.`);
      
      await sleep(800);
      
      let current = chainTable[hash];
      let found = false;
      let chainPosition = 0;
      
      if (!current) {
        setCurrentStep(`Slot ${hash} is empty. Key "${searchKey}" is not in the hash table.`);
        toast.error('Key not found');
      } else {
        setCurrentStep(`Found chain at slot ${hash}. Traversing the linked list to find "${searchKey}".`);
        await sleep(600);
        
        while (current) {
          chainPosition++;
          setCurrentStep(`Checking position ${chainPosition} in chain: found key "${current.key}". ${current.key === searchKey ? 'This matches our target!' : 'Not a match, continuing...'}`);
          await sleep(600);
          
          if (current.key === searchKey) {
            setCurrentStep(`Success! Found "${searchKey}" at slot ${hash}, position ${chainPosition} in the chain, with value: "${current.value}".`);
            found = true;
            toast.success(`Found: ${searchKey}`);
            break;
          }
          current = current.next;
          
          if (current) {
            setCurrentStep(`Moving to next node in the chain at slot ${hash}.`);
            await sleep(400);
          }
        }
        
        if (!found) {
          setCurrentStep(`Reached end of chain at slot ${hash}. Key "${searchKey}" is not in the hash table after checking ${chainPosition} nodes.`);
          toast.error('Key not found');
        }
      }
    } else {
      // Open addressing search
      const originalHash = hashFunction(searchKey, openTable.length);
      let hash = originalHash;
      let attempt = 0;
      let found = false;
      
      setCurrentStep(`Searching for "${searchKey}" using open addressing. Hash(${searchKey}) = ${originalHash}. Starting at slot ${originalHash}.`);
      await sleep(800);
      
      while (attempt < openTable.length) {
        setHighlightedSlots([hash]);
        
        if (attempt === 0) {
          setCurrentStep(`First attempt: checking slot ${hash} for "${searchKey}".`);
        } else {
          const probingMethod = method === 'linear-probing' ? 'linear probing' : 'quadratic probing';
          setCurrentStep(`Attempt ${attempt + 1}: using ${probingMethod} to check slot ${hash} for "${searchKey}".`);
        }
        
        await sleep(600);
        
        if (!openTable[hash]) {
          setCurrentStep(`Found empty slot at ${hash}. This means "${searchKey}" is not in the hash table, as we would have encountered it before this empty slot.`);
          break;
        } else if (openTable[hash]?.key === searchKey && !openTable[hash]?.isDeleted) {
          setCurrentStep(`Success! Found "${searchKey}" at slot ${hash} with value: "${openTable[hash]?.value}". Search completed after ${attempt + 1} attempts.`);
          found = true;
          toast.success(`Found: ${searchKey}`);
          break;
        } else if (openTable[hash]?.isDeleted) {
          setCurrentStep(`Slot ${hash} contains a deleted entry. Continuing search as "${searchKey}" might be further along the probe sequence.`);
        } else {
          setCurrentStep(`Slot ${hash} contains "${openTable[hash]?.key}", not our target. Continuing probe sequence.`);
        }
        
        await sleep(400);
        attempt++;
        if (method === 'linear-probing') {
          hash = (originalHash + attempt) % openTable.length;
          setCurrentStep(`Linear probing: moving to next slot ${hash}.`);
        } else {
          hash = quadraticProbe(originalHash, attempt, openTable.length);
          setCurrentStep(`Quadratic probing: jumping to slot ${hash} using quadratic formula.`);
        }
        await sleep(400);
      }
      
      if (!found && attempt >= openTable.length) {
        setCurrentStep(`Search exhausted! Checked all ${openTable.length} slots but "${searchKey}" was not found in the hash table.`);
        toast.error('Key not found');
      }
    }
    
    setIsAnimating(false);
  }, [searchKey, method, chainTable, openTable, hashFunction, quadraticProbe]);

  const insertItem = useCallback(async () => {
    if (!inputKey.trim() || !inputValue.trim()) {
      toast.error('Please enter both key and value');
      return;
    }

    setIsAnimating(true);
    setHighlightedSlots([]);

    try {
      if (method === 'chaining') {
        await insertChaining(inputKey, inputValue);
      } else {
        await insertOpenAddressing(inputKey, inputValue);
      }
      toast.success(`Inserted ${inputKey}: ${inputValue}`);
    } catch (error) {
      toast.error('Insert failed');
    }

    setHighlightedSlots([]);
    setIsAnimating(false);
  }, [inputKey, inputValue, method, insertChaining, insertOpenAddressing]);

  const renderChainTable = useCallback(() => {
    return chainTable.map((head, index) => (
      <div key={index} className="flex flex-col items-center space-y-2">
        <div className="text-xs font-medium text-muted-foreground">Slot {index}</div>
        <div className={`
          min-h-16 w-24 border-2 rounded-lg p-2 transition-all duration-300
          ${highlightedSlots.includes(index) ? 'border-primary bg-primary/10 animate-pulse' : 'border-border bg-card'}
        `}>
          {!head ? (
            <div className="h-full flex items-center justify-center text-muted-foreground text-xs">
              Empty
            </div>
          ) : (
            <div className="space-y-1">
              {(() => {
                const nodes = [];
                let current = head;
                while (current) {
                  nodes.push(
                    <div key={`${current.key}-${current.value}`} className="bg-secondary/50 rounded px-2 py-1 text-xs">
                      <div className="font-mono font-bold">{current.key}</div>
                      <div className="text-muted-foreground">{current.value}</div>
                    </div>
                  );
                  current = current.next;
                }
                return nodes;
              })()}
            </div>
          )}
        </div>
      </div>
    ));
  }, [chainTable, highlightedSlots]);

  const renderOpenTable = useCallback(() => {
    return openTable.map((entry, index) => (
      <div key={index} className="flex flex-col items-center space-y-2">
        <div className="text-xs font-medium text-muted-foreground">Slot {index}</div>
        <div className={`
          h-16 w-24 border-2 rounded-lg p-2 flex flex-col justify-center transition-all duration-300
          ${highlightedSlots.includes(index) ? 'border-primary bg-primary/10 animate-pulse' : 'border-border bg-card'}
          ${entry?.isDeleted ? 'bg-destructive/10 border-destructive/30' : ''}
        `}>
          {!entry || entry.isDeleted ? (
            <div className="text-muted-foreground text-xs text-center">
              {entry?.isDeleted ? 'Deleted' : 'Empty'}
            </div>
          ) : (
            <div className="text-center">
              <div className="font-mono font-bold text-xs">{entry.key}</div>
              <div className="text-muted-foreground text-xs">{entry.value}</div>
            </div>
          )}
        </div>
      </div>
    ));
  }, [openTable, highlightedSlots]);

  return (
    <div className="w-full space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <div className="flex gap-2 items-center">
          <label className="text-sm font-medium">Size:</label>
          <Input
            type="number"
            value={tableSize}
            onChange={(e) => setTableSize(parseInt(e.target.value) || 7)}
            className="w-20"
            min="3"
            max="15"
            disabled={isAnimating}
          />
        </div>

        <Select value={method} onValueChange={(value: CollisionMethod) => setMethod(value)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="chaining">Separate Chaining</SelectItem>
            <SelectItem value="linear-probing">Linear Probing</SelectItem>
            <SelectItem value="quadratic-probing">Quadratic Probing</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={resetTable} disabled={isAnimating} variant="outline">
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset Table
        </Button>
      </div>

      {/* Insert Controls */}
      <div className="flex flex-wrap gap-3 p-4 bg-muted/20 rounded-lg border">
        <Input
          value={inputKey}
          onChange={(e) => setInputKey(e.target.value)}
          placeholder="Key"
          className="w-32"
          disabled={isAnimating}
        />
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Value"
          className="w-32"
          disabled={isAnimating}
        />
        <Button onClick={insertItem} disabled={isAnimating}>
          <Plus className="h-4 w-4 mr-1" />
          Insert
        </Button>

        <Input
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
          placeholder="Search key"
          className="w-32"
          disabled={isAnimating}
        />
        <Button onClick={searchItem} disabled={isAnimating} variant="outline">
          <Search className="h-4 w-4 mr-1" />
          Search
        </Button>
      </div>

      {/* Visualization */}
      <div className="bg-gradient-visualization rounded-xl border-2 border-border/50 p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center">
            Hash Table ({method.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())})
          </h3>
          
          <div className="flex justify-center">
            <div className="flex gap-3 flex-wrap justify-center">
              {method === 'chaining' ? renderChainTable() : renderOpenTable()}
            </div>
          </div>

          {currentStep && (
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <p className="text-sm font-medium">{currentStep}</p>
            </div>
          )}
        </div>
      </div>

      {/* Voice Explain and Show Memory Controls */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-800">
        <h4 className="font-semibold mb-4 text-center text-lg">Visualizer Controls</h4>
        <div className="flex justify-center">
          <VisualizerControls
            showMemory={showMemory}
            onToggleMemory={setShowMemory}
            voiceEnabled={voiceEnabled}
            onToggleVoice={setVoiceEnabled}
            voiceSpeed={voiceSpeed}
            onVoiceSpeedChange={setVoiceSpeed}
            isSpeaking={isSpeaking}
            onPauseSpeech={pauseSpeech}
            onResumeSpeech={resumeSpeech}
            onStopSpeech={stopSpeech}
          />
        </div>
      </div>

      {/* Memory Layout */}
      {showMemory && (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border-2 border-green-200 dark:border-green-800">
          <h4 className="font-semibold mb-3 text-lg">Hash Table Memory Layout</h4>
          <div className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="text-sm font-medium mb-2">Hash Table Slots</h5>
                <div className="space-y-1">
                  {(method === 'chaining' ? chainTable : openTable).map((slot, index) => {
                    const address = 0x4000 + (index * 8); // Different base address for hash table
                    return (
                      <div key={index} className={`flex justify-between text-xs font-mono p-2 rounded ${
                        highlightedSlots.includes(index) ? 'bg-primary/20 border border-primary/30' : 'bg-background/50'
                      }`}>
                        <span>slot[{index}]</span>
                        <span>0x{address.toString(16).toUpperCase()}</span>
                        <span>{slot ? (method === 'chaining' ? `${slot.key}:${slot.value}` : `${(slot as HashEntry).key}:${(slot as HashEntry).value}`) : 'empty'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <h5 className="text-sm font-medium mb-2">Hash Function Details</h5>
                <div className="space-y-1">
                  <div className="text-xs font-mono bg-background/50 p-2 rounded">
                    <div><strong>Algorithm:</strong> djb2 hash</div>
                    <div><strong>Formula:</strong> hash = hash * 31 + charCode</div>
                    <div><strong>Table Size:</strong> {method === 'chaining' ? chainTable.length : openTable.length}</div>
                    <div><strong>Load Factor:</strong> {
                      method === 'chaining' 
                        ? (chainTable.filter(slot => slot !== null).length / chainTable.length).toFixed(2)
                        : (openTable.filter(slot => slot !== null && !slot.isDeleted).length / openTable.length).toFixed(2)
                    }</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 p-3 bg-info/10 rounded-lg border border-info/30">
              <p className="text-xs text-info-foreground">
                <strong>Memory Info:</strong> Each hash table slot occupies 8 bytes (pointer to key-value pair). 
                {method === 'chaining' && ' Separate chaining uses additional memory for linked list nodes.'}
                {method !== 'chaining' && ' Open addressing stores entries directly in the table slots.'}
                {highlightedSlots.length > 0 && ` Currently accessing slot ${highlightedSlots[0]} at address 0x${(0x4000 + (highlightedSlots[0] * 8)).toString(16).toUpperCase()}.`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Algorithm Info */}
      <div className="bg-muted/20 rounded-lg p-4">
        <h4 className="font-semibold mb-2">Collision Resolution Method</h4>
        <div className="text-sm space-y-1">
          {method === 'chaining' && (
            <>
              <div>• <strong>Separate Chaining:</strong> Store collisions in linked lists</div>
              <div>• <strong>Time Complexity:</strong> O(1) average, O(n) worst case</div>
              <div>• <strong>Space Complexity:</strong> O(n) - Extra space for chains</div>
              <div>• <strong>Load Factor:</strong> Can exceed 1.0</div>
            </>
          )}
          {method === 'linear-probing' && (
            <>
              <div>• <strong>Linear Probing:</strong> Check next slot if collision occurs</div>
              <div>• <strong>Time Complexity:</strong> O(1) average, O(n) worst case</div>
              <div>• <strong>Space Complexity:</strong> O(1) - In-place storage</div>
              <div>• <strong>Clustering:</strong> Tends to create clusters of occupied slots</div>
            </>
          )}
          {method === 'quadratic-probing' && (
            <>
              <div>• <strong>Quadratic Probing:</strong> Use quadratic function for probe sequence</div>
              <div>• <strong>Time Complexity:</strong> O(1) average, O(n) worst case</div>
              <div>• <strong>Space Complexity:</strong> O(1) - In-place storage</div>
              <div>• <strong>Advantage:</strong> Reduces clustering compared to linear probing</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}