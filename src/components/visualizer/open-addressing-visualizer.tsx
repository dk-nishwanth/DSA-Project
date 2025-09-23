import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

export function OpenAddressingVisualizer() {
  const [size, setSize] = useState(11);
  const [keys, setKeys] = useState<(string|null)[]>(Array(11).fill(null));
  const [values, setValues] = useState<(string|null)[]>(Array(11).fill(null));
  const [probe, setProbe] = useState<'linear'|'quadratic'>('linear');
  const [key, setKey] = useState('john');
  const [val, setVal] = useState('25');
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastProbes, setLastProbes] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState('');
  const [showMemory, setShowMemory] = useState(false);
  const [probeCount, setProbeCount] = useState(0);
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

  const hash = (k: string) => {
    // Simple hash: sum of char codes mod size
    let h = 0;
    for (const ch of k) h = (h + ch.charCodeAt(0)) % size;
    return h;
  };

  const reinit = useCallback((n: number) => {
    setKeys(Array(n).fill(null));
    setValues(Array(n).fill(null));
    setLastProbes([]);
  }, []);

  const insert = useCallback(async () => {
    if (!key.trim()) return;
    setIsAnimating(true);
    setProbeCount(0);
    const arrK = [...keys];
    const arrV = [...values];
    const start = hash(key);
    const probes: number[] = [];

    speakOperation("Open Addressing Insert", `Inserting key "${key}" using ${probe} probing. Hash function gives initial position ${start}.`);
    setCurrentStep(`Computing hash for "${key}": hash("${key}") = ${start}`);
    await new Promise(r => setTimeout(r, 800));

    let idx = start;
    let i = 0;
    let attempts = 0;
    
    while (i < size && arrK[idx] !== null && arrK[idx] !== key) {
      attempts++;
      probes.push(idx);
      setLastProbes([...probes]);
      setProbeCount(attempts);
      
      const stepText = `Attempt ${attempts}: Slot ${idx} is occupied by "${arrK[idx]}". ${probe === 'linear' ? 'Linear probing' : 'Quadratic probing'} to next position.`;
      setCurrentStep(stepText);
      speakStep("", stepText, attempts, size);
      
      await new Promise(r => setTimeout(r, 600));
      
      if (probe === 'linear') {
        i++;
        idx = (start + i) % size;
        setCurrentStep(`Linear probe: next position = (${start} + ${i}) mod ${size} = ${idx}`);
      } else {
        i++;
        idx = (start + i*i) % size;
        setCurrentStep(`Quadratic probe: next position = (${start} + ${i}²) mod ${size} = ${idx}`);
      }
      await new Promise(r => setTimeout(r, 400));
    }
    
    probes.push(idx);
    setLastProbes([...probes]);
    setProbeCount(attempts + 1);
    
    if (arrK[idx] === key) {
      // Update existing key
      arrV[idx] = val;
      const updateText = `Key "${key}" already exists at position ${idx}. Updated value to "${val}".`;
      setCurrentStep(updateText);
      speakResult(updateText);
      toast.success(`Updated ${key} with new value ${val}`);
    } else {
      // Insert new key
      arrK[idx] = key;
      arrV[idx] = val;
      const insertText = `Found empty slot at position ${idx}. Inserted "${key}":"${val}" after ${attempts + 1} probe${attempts === 0 ? '' : 's'}.`;
      setCurrentStep(insertText);
      speakResult(insertText);
      toast.success(`Inserted ${key}:${val} at index ${idx} (${attempts + 1} probes)`);
    }
    
    setKeys(arrK);
    setValues(arrV);
    
    setTimeout(() => {
      setIsAnimating(false);
      setCurrentStep('');
      setLastProbes([]);
    }, 2000);
  }, [key, val, size, probe, keys, values, speakOperation, speakStep, speakResult]);

  const remove = useCallback(async () => {
    if (!key.trim()) return;
    setIsAnimating(true);
    const arrK = [...keys];
    const arrV = [...values];
    const start = hash(key);
    const probes: number[] = [];
    let idx = start;
    let i = 0;
    while (i < size && arrK[idx] !== null && arrK[idx] !== key) {
      probes.push(idx); setLastProbes([...probes]); await new Promise(r => setTimeout(r, 200));
      if (probe === 'linear') idx = (start + (++i)) % size; else idx = (start + i*i) % size, i++;
    }
    if (arrK[idx] === key) {
      arrK[idx] = '__DELETED__';
      arrV[idx] = null;
      setKeys(arrK); setValues(arrV);
      toast.success(`Deleted ${key} at ${idx}`);
    } else {
      toast.error('Key not found');
    }
    setIsAnimating(false);
  }, [key, size, probe, keys, values]);

  const clear = useCallback(() => {
    reinit(size);
  }, [size, reinit]);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Open Addressing Hash Table Visualizer</h2>
        <p className="text-muted-foreground">
          Collision resolution using linear and quadratic probing techniques
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-3 p-4 bg-muted/30 rounded-xl border">
          <h4 className="font-semibold">Hash Table Configuration</h4>
          <div className="flex items-center gap-2">
            <span className="text-sm">Table Size:</span>
            <Input 
              type="number" 
              value={size} 
              onChange={e => { 
                const n = Math.max(3, parseInt(e.target.value)||11); 
                setSize(n); 
                reinit(n); 
              }} 
              className="w-24" 
              disabled={isAnimating}
            />
          </div>
          <Select value={probe} onValueChange={(v:'linear'|'quadratic') => setProbe(v)} disabled={isAnimating}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="linear">Linear Probing (h + i)</SelectItem>
              <SelectItem value="quadratic">Quadratic Probing (h + i²)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3 p-4 bg-muted/30 rounded-xl border">
          <h4 className="font-semibold">Operations</h4>
          <div className="flex gap-2">
            <Input 
              placeholder="Key" 
              value={key} 
              onChange={e=>setKey(e.target.value)} 
              className="flex-1" 
              disabled={isAnimating}
            />
            <Input 
              placeholder="Value" 
              value={val} 
              onChange={e=>setVal(e.target.value)} 
              className="flex-1" 
              disabled={isAnimating}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={insert} disabled={isAnimating || !key.trim()} className="flex-1">
              {isAnimating ? 'Inserting...' : 'Insert'}
            </Button>
            <Button onClick={remove} variant="destructive" disabled={isAnimating || !key.trim()} className="flex-1">
              Delete
            </Button>
            <Button onClick={clear} variant="outline" disabled={isAnimating}>
              Clear All
            </Button>
          </div>
        </div>
      </div>

      {/* Current Step Display */}
      {currentStep && (
        <div className="text-center p-4 bg-muted rounded-lg">
          <Badge className="mb-2" variant={isAnimating ? 'default' : 'secondary'}>
            {probeCount > 0 ? `Probes: ${probeCount}` : 'Hash Operation'}
          </Badge>
          <p className="text-sm">{currentStep}</p>
        </div>
      )}

      {/* Hash Table Visualization */}
      <div className="p-6 bg-gradient-visualization rounded-xl border-2 border-primary/20">
        <h3 className="text-lg font-semibold mb-4 text-center">Hash Table ({probe} probing)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {keys.map((k, i) => (
            <div key={i} className={`p-3 border-2 rounded-lg transition-all ${
              lastProbes.includes(i) 
                ? 'ring-2 ring-yellow-400 border-yellow-400 bg-yellow-50' 
                : k !== null 
                  ? 'border-green-300 bg-green-50' 
                  : 'border-gray-300 bg-white'
            }`}>
              <div className="text-xs text-muted-foreground font-medium">Index {i}</div>
              <div className="text-sm font-mono font-bold">
                {k === null ? '—' : k === '__DELETED__' ? '🗑️' : k}
              </div>
              <div className="text-xs text-muted-foreground">
                {values[i] === null ? '' : String(values[i])}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-4 bg-blue-200 border border-blue-400 rounded"></div>
            <span className="font-semibold text-blue-800">Load Factor</span>
          </div>
          <p className="text-sm text-blue-700">
            {((keys.filter(k => k !== null && k !== '__DELETED__').length / size) * 100).toFixed(1)}%
          </p>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-4 bg-yellow-200 border border-yellow-400 rounded"></div>
            <span className="font-semibold text-yellow-800">Probing Sequence</span>
          </div>
          <p className="text-sm text-yellow-700">
            {probe === 'linear' ? 'h, h+1, h+2, ...' : 'h, h+1², h+2², ...'}
          </p>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-4 bg-green-200 border border-green-300 rounded"></div>
            <span className="font-semibold text-green-800">Occupied Slots</span>
          </div>
          <p className="text-sm text-green-700">
            {keys.filter(k => k !== null && k !== '__DELETED__').length} / {size}
          </p>
        </div>
      </div>

      {/* Algorithm Information */}
      <div className="bg-muted/20 rounded-lg p-4">
        <h4 className="font-semibold mb-2">Open Addressing Collision Resolution</h4>
        <div className="text-sm text-muted-foreground space-y-1">
          <div>• <strong>Linear Probing:</strong> If slot h is occupied, try h+1, h+2, h+3, ... (mod table_size)</div>
          <div>• <strong>Quadratic Probing:</strong> If slot h is occupied, try h+1², h+2², h+3², ... (mod table_size)</div>
          <div>• <strong>Clustering:</strong> Linear probing can cause primary clustering; quadratic reduces this</div>
          <div>• <strong>Load Factor:</strong> Keep below 70% for good performance</div>
          <div>• <strong>Deletion:</strong> Mark slots as deleted rather than empty to maintain probe sequences</div>
        </div>
      </div>

      {/* Memory Layout */}
      {showMemory && (
        <MemoryLayout
          title="Hash Table Memory Layout"
          data={keys.map((k, i) => k || `empty_${i}`)}
          baseAddress={0x8000}
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
