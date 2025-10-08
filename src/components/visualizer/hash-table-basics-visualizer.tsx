import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

interface HashEntry {
  key: string;
  value: string;
  isActive: boolean;
  isCollision: boolean;
}

interface HashBucket {
  index: number;
  entries: HashEntry[];
  isActive: boolean;
}

export function HashTableBasicsVisualizer() {
  const [operation, setOperation] = useState<'insert' | 'search' | 'delete'>('insert');
  const [keyInput, setKeyInput] = useState('apple');
  const [valueInput, setValueInput] = useState('fruit');
  const [hashFunction, setHashFunction] = useState<'simple' | 'djb2' | 'fnv'>('simple');
  const [tableSize, setTableSize] = useState('7');
  const [hashTable, setHashTable] = useState<HashBucket[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showMemory, setShowMemory] = useState(false);
  const [result, setResult] = useState<string>('');
  const [hashSteps, setHashSteps] = useState<string[]>([]);

  const {
    voiceEnabled,
    setVoiceEnabled,
    speakOperation,
    speakStep,
    speakResult,
  } = useVisualizerVoice({ minInterval: 500 });

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const initializeHashTable = useCallback(() => {
    const size = parseInt(tableSize);
    const table: HashBucket[] = [];
    
    for (let i = 0; i < size; i++) {
      table.push({
        index: i,
        entries: [],
        isActive: false,
      });
    }
    
    setHashTable(table);
  }, [tableSize]);

  const clearHighlights = useCallback(() => {
    setHashTable(prev => prev.map(bucket => ({
      ...bucket,
      isActive: false,
      entries: bucket.entries.map(entry => ({
        ...entry,
        isActive: false,
        isCollision: false,
      })),
    })));
  }, []);

  const simpleHash = useCallback((key: string): number => {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash += key.charCodeAt(i);
    }
    return hash % parseInt(tableSize);
  }, [tableSize]);

  const djb2Hash = useCallback((key: string): number => {
    let hash = 5381;
    for (let i = 0; i < key.length; i++) {
      hash = ((hash << 5) + hash) + key.charCodeAt(i);
    }
    return Math.abs(hash) % parseInt(tableSize);
  }, [tableSize]);

  const fnvHash = useCallback((key: string): number => {
    let hash = 2166136261;
    for (let i = 0; i < key.length; i++) {
      hash ^= key.charCodeAt(i);
      hash *= 16777619;
    }
    return Math.abs(hash) % parseInt(tableSize);
  }, [tableSize]);

  const calculateHash = useCallback((key: string): { hash: number; steps: string[] } => {
    const steps: string[] = [];
    let hash: number;
    
    if (hashFunction === 'simple') {
      steps.push(`Simple Hash: Sum ASCII values of characters`);
      let sum = 0;
      for (let i = 0; i < key.length; i++) {
        const ascii = key.charCodeAt(i);
        sum += ascii;
        steps.push(`'${key[i]}' = ${ascii}, sum = ${sum}`);
      }
      hash = sum % parseInt(tableSize);
      steps.push(`Final: ${sum} % ${tableSize} = ${hash}`);
    } else if (hashFunction === 'djb2') {
      steps.push(`DJB2 Hash: hash = 5381`);
      hash = 5381;
      for (let i = 0; i < key.length; i++) {
        const ascii = key.charCodeAt(i);
        hash = ((hash << 5) + hash) + ascii;
        steps.push(`'${key[i]}': hash = ((${hash >> 5} << 5) + ${hash >> 5}) + ${ascii}`);
      }
      hash = Math.abs(hash) % parseInt(tableSize);
      steps.push(`Final: ${hash} % ${tableSize} = ${hash % parseInt(tableSize)}`);
    } else {
      steps.push(`FNV Hash: hash = 2166136261`);
      hash = 2166136261;
      for (let i = 0; i < key.length; i++) {
        const ascii = key.charCodeAt(i);
        hash ^= ascii;
        hash *= 16777619;
        steps.push(`'${key[i]}': hash ^= ${ascii}, hash *= 16777619`);
      }
      hash = Math.abs(hash) % parseInt(tableSize);
      steps.push(`Final: hash % ${tableSize} = ${hash}`);
    }
    
    return { hash, steps };
  }, [hashFunction, tableSize]);

  const insertKey = useCallback(async () => {
    const key = keyInput.trim();
    const value = valueInput.trim();
    
    if (!key || !value) return;
    
    speakOperation('Insert Key-Value', `Inserting key "${key}" with value "${value}"`);
    clearHighlights();
    
    const { hash, steps } = calculateHash(key);
    setHashSteps(steps);
    
    speakStep('Calculate hash', `Hash function maps "${key}" to index ${hash}`, 1, 3);
    await sleep(800);
    
    // Highlight the target bucket
    hashTable[hash].isActive = true;
    setHashTable([...hashTable]);
    
    speakStep('Find bucket', `Accessing bucket at index ${hash}`, 2, 3);
    await sleep(600);
    
    // Check if key already exists
    const existingEntryIndex = hashTable[hash].entries.findIndex(entry => entry.key === key);
    
    if (existingEntryIndex !== -1) {
      // Update existing entry
      hashTable[hash].entries[existingEntryIndex].value = value;
      hashTable[hash].entries[existingEntryIndex].isActive = true;
      setHashTable([...hashTable]);
      
      setResult(`Updated existing key "${key}" with new value "${value}"`);
      speakStep('Update value', `Key "${key}" already exists, updating value to "${value}"`, 3, 3);
    } else {
      // Add new entry
      const newEntry: HashEntry = {
        key,
        value,
        isActive: true,
        isCollision: hashTable[hash].entries.length > 0,
      };
      
      hashTable[hash].entries.push(newEntry);
      setHashTable([...hashTable]);
      
      if (newEntry.isCollision) {
        setResult(`Inserted "${key}": "${value}" at index ${hash} (collision handled by chaining)`);
        speakStep('Handle collision', `Collision detected! Adding to chain at index ${hash}`, 3, 3);
      } else {
        setResult(`Inserted "${key}": "${value}" at index ${hash}`);
        speakStep('Insert success', `Successfully inserted at index ${hash}`, 3, 3);
      }
    }
    
    await sleep(500);
    speakResult(`Key "${key}" inserted successfully`);
  }, [keyInput, valueInput, calculateHash, hashTable, clearHighlights, speakOperation, speakStep, speakResult]);

  const searchKey = useCallback(async () => {
    const key = keyInput.trim();
    
    if (!key) return;
    
    speakOperation('Search Key', `Searching for key "${key}"`);
    clearHighlights();
    
    const { hash, steps } = calculateHash(key);
    setHashSteps(steps);
    
    speakStep('Calculate hash', `Hash function maps "${key}" to index ${hash}`, 1, 3);
    await sleep(800);
    
    // Highlight the target bucket
    hashTable[hash].isActive = true;
    setHashTable([...hashTable]);
    
    speakStep('Check bucket', `Checking bucket at index ${hash}`, 2, 3);
    await sleep(600);
    
    // Search in the bucket
    const entry = hashTable[hash].entries.find(entry => entry.key === key);
    
    if (entry) {
      entry.isActive = true;
      setHashTable([...hashTable]);
      
      setResult(`Found key "${key}" with value "${entry.value}" at index ${hash}`);
      speakStep('Key found', `Found key "${key}" with value "${entry.value}"`, 3, 3);
      speakResult(`Key "${key}" found successfully`);
    } else {
      setResult(`Key "${key}" not found in hash table`);
      speakStep('Key not found', `Key "${key}" not found in bucket ${hash}`, 3, 3);
      speakResult(`Key "${key}" not found`);
    }
    
    await sleep(500);
  }, [keyInput, calculateHash, hashTable, clearHighlights, speakOperation, speakStep, speakResult]);

  const deleteKey = useCallback(async () => {
    const key = keyInput.trim();
    
    if (!key) return;
    
    speakOperation('Delete Key', `Deleting key "${key}"`);
    clearHighlights();
    
    const { hash, steps } = calculateHash(key);
    setHashSteps(steps);
    
    speakStep('Calculate hash', `Hash function maps "${key}" to index ${hash}`, 1, 3);
    await sleep(800);
    
    // Highlight the target bucket
    hashTable[hash].isActive = true;
    setHashTable([...hashTable]);
    
    speakStep('Find bucket', `Searching in bucket at index ${hash}`, 2, 3);
    await sleep(600);
    
    // Find and remove the entry
    const entryIndex = hashTable[hash].entries.findIndex(entry => entry.key === key);
    
    if (entryIndex !== -1) {
      const deletedEntry = hashTable[hash].entries[entryIndex];
      hashTable[hash].entries.splice(entryIndex, 1);
      setHashTable([...hashTable]);
      
      setResult(`Deleted key "${key}" with value "${deletedEntry.value}" from index ${hash}`);
      speakStep('Delete success', `Successfully deleted key "${key}"`, 3, 3);
      speakResult(`Key "${key}" deleted successfully`);
    } else {
      setResult(`Key "${key}" not found, cannot delete`);
      speakStep('Delete failed', `Key "${key}" not found for deletion`, 3, 3);
      speakResult(`Key "${key}" not found for deletion`);
    }
    
    await sleep(500);
  }, [keyInput, calculateHash, hashTable, clearHighlights, speakOperation, speakStep, speakResult]);

  const runOperation = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setResult('');
    setHashSteps([]);
    
    try {
      if (operation === 'insert') {
        await insertKey();
      } else if (operation === 'search') {
        await searchKey();
      } else if (operation === 'delete') {
        await deleteKey();
      }
    } finally {
      setIsRunning(false);
    }
  }, [isRunning, operation, insertKey, searchKey, deleteKey]);

  const renderHashTable = () => (
    <div className="space-y-2">
      {hashTable.map((bucket, index) => (
        <div
          key={index}
          className={`flex items-center gap-2 p-2 rounded border transition-all duration-300 ${
            bucket.isActive
              ? 'bg-yellow-100 border-yellow-400 dark:bg-yellow-900/30 dark:border-yellow-600'
              : 'bg-white border-gray-300 dark:bg-gray-900 dark:border-gray-600'
          }`}
        >
          <div className="w-8 text-center font-mono text-sm font-bold">
            {index}
          </div>
          <div className="flex-1 flex gap-1 flex-wrap">
            {bucket.entries.length === 0 ? (
              <div className="text-muted-foreground text-sm italic">empty</div>
            ) : (
              bucket.entries.map((entry, entryIndex) => (
                <div
                  key={entryIndex}
                  className={`px-2 py-1 rounded text-xs font-mono transition-all duration-300 ${
                    entry.isActive
                      ? 'bg-green-200 border-green-400 dark:bg-green-800 dark:border-green-600'
                      : entry.isCollision
                      ? 'bg-orange-100 border-orange-300 dark:bg-orange-900/30 dark:border-orange-600'
                      : 'bg-blue-100 border-blue-300 dark:bg-blue-900/30 dark:border-blue-600'
                  } border`}
                >
                  {entry.key}: {entry.value}
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <Select value={operation} onValueChange={(v: 'insert' | 'search' | 'delete') => setOperation(v)}>
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="insert">Insert</SelectItem>
            <SelectItem value="search">Search</SelectItem>
            <SelectItem value="delete">Delete</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <span className="text-sm">Key:</span>
          <Input 
            className="w-24" 
            value={keyInput} 
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="apple"
          />
        </div>

        {operation === 'insert' && (
          <div className="flex items-center gap-2">
            <span className="text-sm">Value:</span>
            <Input 
              className="w-24" 
              value={valueInput} 
              onChange={(e) => setValueInput(e.target.value)}
              placeholder="fruit"
            />
          </div>
        )}

        <Select value={hashFunction} onValueChange={(v: 'simple' | 'djb2' | 'fnv') => setHashFunction(v)}>
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="simple">Simple</SelectItem>
            <SelectItem value="djb2">DJB2</SelectItem>
            <SelectItem value="fnv">FNV</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <span className="text-sm">Size:</span>
          <Input 
            className="w-16" 
            value={tableSize} 
            onChange={(e) => setTableSize(e.target.value)}
            placeholder="7"
          />
        </div>

        <Button onClick={runOperation} disabled={isRunning}>
          {isRunning ? 'Running...' : operation.charAt(0).toUpperCase() + operation.slice(1)}
        </Button>

        <Button onClick={initializeHashTable} disabled={isRunning} variant="outline">
          Initialize
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 p-4 bg-gradient-visualization rounded-xl border-2">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-center">
              Hash Table (Size: {tableSize}, Function: {hashFunction.toUpperCase()})
            </h3>
            <div className="max-h-96 overflow-y-auto">
              {renderHashTable()}
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
          
          {hashSteps.length > 0 && (
            <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl border-2 border-blue-300">
              <h3 className="text-sm font-semibold mb-2">Hash Calculation</h3>
              <div className="text-xs space-y-1 font-mono">
                {hashSteps.map((step, index) => (
                  <div key={index}>{step}</div>
                ))}
              </div>
            </div>
          )}
          
          <div className="p-4 bg-muted/20 rounded-xl border">
            <h3 className="text-sm font-semibold mb-2">Legend</h3>
            <div className="text-xs space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-yellow-300"></div>
                <span>Active Bucket</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-300"></div>
                <span>Found/Active Entry</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-orange-300"></div>
                <span>Collision (Chained)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-300"></div>
                <span>Normal Entry</span>
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
          data={hashTable}
          title="Hash Table Memory"
          baseAddress={17000}
          wordSize={8}
        />
      )}

      <div className="bg-muted/20 rounded-lg p-4 text-sm space-y-2">
        <div className="font-semibold text-primary">Hash Table Operations:</div>
        <div>• <strong>Insert:</strong> O(1) average, O(n) worst case with many collisions</div>
        <div>• <strong>Search:</strong> O(1) average, O(n) worst case</div>
        <div>• <strong>Delete:</strong> O(1) average, O(n) worst case</div>
        <div>• <strong>Collision Handling:</strong> Separate chaining with linked lists</div>
        <div>• <strong>Applications:</strong> Databases, caches, symbol tables, sets</div>
      </div>
    </div>
  );
}