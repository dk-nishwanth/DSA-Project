import React, { useState, useCallback } from 'react';
import { Play, RotateCcw, Plus, Minus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

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
  const [currentStep, setCurrentStep] = useState('');

  // For separate chaining
  const [chainTable, setChainTable] = useState<(ChainNode | null)[]>(Array(7).fill(null));
  
  // For open addressing
  const [openTable, setOpenTable] = useState<(HashEntry | null)[]>(Array(7).fill(null));

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
    setCurrentStep('');
    setIsAnimating(false);
    toast.success('Hash table reset');
  }, [tableSize]);

  const insertChaining = useCallback(async (key: string, value: string) => {
    const hash = hashFunction(key, chainTable.length);
    setHighlightedSlots([hash]);
    setCurrentStep(`Hash(${key}) = ${hash}. Inserting into slot ${hash}`);
    
    await sleep(800);

    const newTable = [...chainTable];
    if (!newTable[hash]) {
      newTable[hash] = { key, value };
      setCurrentStep(`Slot ${hash} is empty. Inserted directly.`);
    } else {
      // Handle collision by chaining
      let current = newTable[hash];
      while (current) {
        if (current.key === key) {
          current.value = value;
          setCurrentStep(`Key ${key} already exists. Updated value.`);
          setChainTable(newTable);
          return;
        }
        if (!current.next) break;
        current = current.next;
      }
      current!.next = { key, value };
      setCurrentStep(`Collision detected! Added ${key} to chain at slot ${hash}.`);
    }
    
    setChainTable(newTable);
    await sleep(800);
  }, [chainTable, hashFunction]);

  const insertOpenAddressing = useCallback(async (key: string, value: string) => {
    const originalHash = hashFunction(key, openTable.length);
    let hash = originalHash;
    let attempt = 0;
    
    while (attempt < openTable.length) {
      setHighlightedSlots([hash]);
      setCurrentStep(`Trying slot ${hash} (attempt ${attempt + 1})`);
      
      await sleep(600);

      if (!openTable[hash] || openTable[hash]?.isDeleted) {
        const newTable = [...openTable];
        newTable[hash] = { key, value };
        setOpenTable(newTable);
        setCurrentStep(`Inserted ${key} at slot ${hash}`);
        await sleep(800);
        return;
      } else if (openTable[hash]?.key === key) {
        const newTable = [...openTable];
        newTable[hash] = { key, value };
        setOpenTable(newTable);
        setCurrentStep(`Updated existing key ${key} at slot ${hash}`);
        await sleep(800);
        return;
      } else {
        setCurrentStep(`Slot ${hash} occupied by ${openTable[hash]?.key}. Collision!`);
        await sleep(600);
        
        attempt++;
        if (method === 'linear-probing') {
          hash = (originalHash + attempt) % openTable.length;
        } else {
          hash = quadraticProbe(originalHash, attempt, openTable.length);
        }
      }
    }
    
    setCurrentStep('Hash table is full!');
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
      setCurrentStep(`Searching for ${searchKey}. Hash(${searchKey}) = ${hash}`);
      
      await sleep(800);
      
      let current = chainTable[hash];
      let found = false;
      
      while (current) {
        if (current.key === searchKey) {
          setCurrentStep(`Found ${searchKey} with value: ${current.value}`);
          found = true;
          break;
        }
        current = current.next;
      }
      
      if (!found) {
        setCurrentStep(`Key ${searchKey} not found in the hash table`);
        toast.error('Key not found');
      } else {
        toast.success(`Found: ${searchKey}`);
      }
    } else {
      // Open addressing search
      const originalHash = hashFunction(searchKey, openTable.length);
      let hash = originalHash;
      let attempt = 0;
      let found = false;
      
      while (attempt < openTable.length) {
        setHighlightedSlots([hash]);
        setCurrentStep(`Searching slot ${hash} for ${searchKey}`);
        
        await sleep(600);
        
        if (!openTable[hash]) {
          setCurrentStep(`Empty slot found. Key ${searchKey} not in table.`);
          break;
        } else if (openTable[hash]?.key === searchKey && !openTable[hash]?.isDeleted) {
          setCurrentStep(`Found ${searchKey} with value: ${openTable[hash]?.value}`);
          found = true;
          toast.success(`Found: ${searchKey}`);
          break;
        }
        
        attempt++;
        if (method === 'linear-probing') {
          hash = (originalHash + attempt) % openTable.length;
        } else {
          hash = quadraticProbe(originalHash, attempt, openTable.length);
        }
      }
      
      if (!found && attempt >= openTable.length) {
        setCurrentStep(`Key ${searchKey} not found after checking all slots`);
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