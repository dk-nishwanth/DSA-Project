import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';
import { toast } from 'sonner';

function buildTree(arr: number[]): number[] {
  const n = arr.length;
  const size = 1 << (Math.ceil(Math.log2(n)) + 1);
  const tree = Array(size).fill(0);
  const build = (idx: number, l: number, r: number) => {
    if (l === r) { tree[idx] = arr[l]; return; }
    const m = (l + r) >> 1;
    build(idx*2, l, m);
    build(idx*2+1, m+1, r);
    tree[idx] = tree[idx*2] + tree[idx*2+1];
  };
  build(1, 0, n-1);
  return tree;
}

export function SegmentTreeVisualizer() {
  const [input, setInput] = useState('1,3,5,7,9,11');
  const [arr, setArr] = useState<number[]>([1,3,5,7,9,11]);
  const [tree, setTree] = useState<number[]>(buildTree([1,3,5,7,9,11]));
  const [op, setOp] = useState<'query'|'update'>('query');
  const [l, setL] = useState('1');
  const [r, setR] = useState('3');
  const [pos, setPos] = useState('2');
  const [val, setVal] = useState('10');
  const [highlight, setHighlight] = useState<number[]>([]);
  const [isBusy, setIsBusy] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [showMemory, setShowMemory] = useState(false);
  const [operation, setOperation] = useState<string>('');
  
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

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const rebuild = useCallback(() => {
    const nums = input.split(',').map(s=>parseInt(s.trim())).filter(n=>!isNaN(n));
    if (!nums.length) return;
    setArr(nums);
    setTree(buildTree(nums));
  }, [input]);

  const doQuery = useCallback(async (ql: number, qr: number) => {
    setIsBusy(true); 
    setHighlight([]);
    setOperation(`Range Sum Query [${ql}, ${qr}]`);
    setCurrentStep(`Starting range sum query for range [${ql}, ${qr}]`);
    speakOperation("Segment Tree Query", `Starting range sum query for range [${ql}, ${qr}]. We'll traverse the tree and collect segments that are completely within our query range.`);
    
    const n = arr.length;
    const t = [...tree];
    const visit: number[] = [];
    let stepCount = 0;
    
    const query = async (idx: number, l: number, r: number): Promise<number> => {
      stepCount++;
      visit.push(idx); 
      setHighlight([...visit]); 
      setCurrentStep(`Visiting node ${idx} covering range [${l}, ${r}]`);
      speakStep("", `Visiting tree node ${idx} which covers range [${l}, ${r}].`, stepCount, Math.ceil(Math.log2(n)) * 2);
      await sleep(600);
      
      if (qr < l || r < ql) {
        setCurrentStep(`Range [${l}, ${r}] doesn't overlap with query [${ql}, ${qr}] - returning 0`);
        return 0;
      }
      if (ql <= l && r <= qr) {
        setCurrentStep(`Range [${l}, ${r}] is completely within query [${ql}, ${qr}] - returning ${t[idx]}`);
        return t[idx];
      }
      const m = (l + r) >> 1;
      setCurrentStep(`Splitting range [${l}, ${r}] at midpoint ${m}`);
      return (await query(idx*2, l, m)) + (await query(idx*2+1, m+1, r));
    };
    
    const sum = await query(1, 0, n-1);
    setCurrentStep(`Range sum query complete! Result: ${sum}`);
    speakResult(`Range sum query completed! The sum of elements from index ${ql} to ${qr} is ${sum}.`);
    toast.success(`Range sum [${ql}, ${qr}] = ${sum}`);
    
    setTimeout(() => {
      setIsBusy(false);
      setCurrentStep('');
      setOperation('');
      setHighlight([]);
    }, 2000);
    
    return sum;
  }, [arr.length, tree, speakOperation, speakStep, speakResult]);

  const doUpdate = useCallback(async (p: number, newVal: number) => {
    setIsBusy(true); 
    setHighlight([]);
    setOperation(`Point Update at index ${p}`);
    setCurrentStep(`Updating element at index ${p} from ${arr[p]} to ${newVal}`);
    speakOperation("Segment Tree Update", `Updating element at index ${p} from ${arr[p]} to ${newVal}. We'll traverse down to the leaf and update all affected internal nodes on the way back up.`);
    
    const n = arr.length;
    const t = [...tree];
    const a = [...arr];
    const visit: number[] = [];
    let stepCount = 0;
    
    const update = async (idx: number, l: number, r: number) => {
      stepCount++;
      visit.push(idx); 
      setHighlight([...visit]); 
      setCurrentStep(`Visiting node ${idx} covering range [${l}, ${r}]`);
      speakStep("", `Visiting tree node ${idx} which covers range [${l}, ${r}].`, stepCount, Math.ceil(Math.log2(n)));
      await sleep(600);
      
      if (l === r) { 
        setCurrentStep(`Reached leaf node - updating value from ${t[idx]} to ${newVal}`);
        t[idx] = newVal; 
        return; 
      }
      const m = (l + r) >> 1;
      if (p <= m) {
        setCurrentStep(`Target index ${p} is in left subtree - going left`);
        await update(idx*2, l, m); 
      } else {
        setCurrentStep(`Target index ${p} is in right subtree - going right`);
        await update(idx*2+1, m+1, r);
      }
      const oldValue = t[idx];
      t[idx] = t[idx*2] + t[idx*2+1];
      setCurrentStep(`Updating internal node ${idx} from ${oldValue} to ${t[idx]} (sum of children)`);
    };
    
    await update(1, 0, n-1);
    a[p] = newVal;
    setArr(a); 
    setTree(t); 
    
    setCurrentStep(`Point update complete! Updated index ${p} to ${newVal}`);
    speakResult(`Point update completed! Element at index ${p} has been updated to ${newVal} and all affected tree nodes have been recalculated.`);
    toast.success(`Updated index ${p} to ${newVal}`);
    
    setTimeout(() => {
      setIsBusy(false);
      setCurrentStep('');
      setOperation('');
      setHighlight([]);
    }, 2000);
  }, [arr, tree, speakOperation, speakStep, speakResult]);

  const run = useCallback(async () => {
    if (op === 'query') {
      const ql = Math.max(0, Math.min(arr.length-1, parseInt(l)||0));
      const qr = Math.max(ql, Math.min(arr.length-1, parseInt(r)||0));
      const res = await doQuery(ql, qr);
      alert(`Range Sum [${ql}, ${qr}] = ${res}`);
    } else {
      const p = Math.max(0, Math.min(arr.length-1, parseInt(pos)||0));
      const nv = parseInt(val)||0;
      await doUpdate(p, nv);
    }
  }, [op, l, r, pos, val, arr.length, doQuery, doUpdate]);

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Segment Tree Visualizer</h3>
        <p className="text-muted-foreground">
          Efficient data structure for range queries and point updates in O(log n) time
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Array:</span>
          <Input 
            className="w-72" 
            value={input} 
            onChange={e=>setInput(e.target.value)} 
            placeholder="1,3,5,7,9,11"
            disabled={isBusy}
          />
        </div>
        <Button onClick={rebuild} disabled={isBusy}>Build Tree</Button>
        
        <Select value={op} onValueChange={(v: 'query'|'update')=>setOp(v)} disabled={isBusy}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="query">Range Sum Query</SelectItem>
            <SelectItem value="update">Point Update</SelectItem>
          </SelectContent>
        </Select>
        
        {op==='query' ? (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Range:</span>
            <Input 
              className="w-16" 
              value={l} 
              onChange={e=>setL(e.target.value)} 
              placeholder="L"
              disabled={isBusy}
            />
            <span className="text-sm">to</span>
            <Input 
              className="w-16" 
              value={r} 
              onChange={e=>setR(e.target.value)} 
              placeholder="R"
              disabled={isBusy}
            />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Update:</span>
            <Input 
              className="w-16" 
              value={pos} 
              onChange={e=>setPos(e.target.value)} 
              placeholder="Pos"
              disabled={isBusy}
            />
            <span className="text-sm">to</span>
            <Input 
              className="w-20" 
              value={val} 
              onChange={e=>setVal(e.target.value)} 
              placeholder="Value"
              disabled={isBusy}
            />
          </div>
        )}
        <Button onClick={run} disabled={isBusy}>
          {isBusy ? 'Running...' : 'Run Operation'}
        </Button>
      </div>

      {/* Current Step Display */}
      {currentStep && (
        <div className="p-4 bg-muted/20 rounded-lg border">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{operation}</Badge>
            <span className="text-sm font-medium">{currentStep}</span>
          </div>
        </div>
      )}

      {/* Segment Tree Visualization */}
      <div className="p-6 bg-gradient-visualization rounded-xl border-2 border-primary/20 space-y-4">
        <h4 className="text-lg font-semibold text-center">Segment Tree Structure</h4>
        
        <div>
          <div className="text-sm font-medium mb-2">Original Array</div>
          <div className="flex gap-2 justify-center">
            {arr.map((x,i)=>(
              <div key={i} className="px-3 py-2 border-2 rounded-lg bg-card font-mono text-sm min-w-[40px] text-center">
                <div className="text-xs text-muted-foreground">arr[{i}]</div>
                <div className="font-bold">{x}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm font-medium mb-2">Segment Tree (Array Representation)</div>
          <div className="flex gap-2 flex-wrap justify-center">
            {tree.map((x,i)=>(
              <div 
                key={i} 
                className={`px-2 py-2 border-2 rounded-lg font-mono text-xs min-w-[50px] text-center transition-all duration-300 ${
                  highlight.includes(i)
                    ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-110' 
                    : 'bg-card border-border'
                }`}
              >
                <div className="text-xs text-muted-foreground">tree[{i}]</div>
                <div className="font-bold">{x}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="flex flex-wrap gap-3 items-center">
        <Badge variant="outline">Array Size: {arr.length}</Badge>
        <Badge variant="outline">Tree Size: {tree.length}</Badge>
        {isBusy && (
          <Badge variant="secondary" className="animate-pulse">
            Processing...
          </Badge>
        )}
      </div>

      {/* Algorithm Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-2">How Segment Tree Works:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>Build tree by recursively dividing array into segments</li>
            <li>Each internal node stores sum of its range</li>
            <li>Leaves store individual array elements</li>
            <li>Query: Combine relevant segments in O(log n)</li>
            <li>Update: Modify leaf and propagate changes upward</li>
          </ul>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-2">Complexity Analysis:</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div><strong>Build:</strong> O(n) - Process each element once</div>
            <div><strong>Query:</strong> O(log n) - Visit at most 4 nodes per level</div>
            <div><strong>Update:</strong> O(log n) - Path from root to leaf</div>
            <div><strong>Space:</strong> O(n) - Tree has at most 4n nodes</div>
            <div><strong>Applications:</strong> Range queries, competitive programming</div>
          </div>
        </div>
      </div>

      {/* Memory Layout */}
      {showMemory && (
        <MemoryLayout
          title="Segment Tree Memory Layout"
          data={tree.slice(0, 20)} // Show first 20 elements to avoid overflow
          baseAddress={0x9000}
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
