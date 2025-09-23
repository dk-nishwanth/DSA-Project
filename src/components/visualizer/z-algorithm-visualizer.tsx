import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { PseudocodeBox } from '@/components/pseudocode-box';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

export function ZAlgorithmVisualizer() {
  const [text, setText] = useState('ABCDABCDABCD');
  const [pattern, setPattern] = useState('ABCD');
  const [combined, setCombined] = useState('');
  const [zArray, setZArray] = useState<number[]>([]);
  const [matches, setMatches] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mode, setMode] = useState<'zonly' | 'search'>('search');
  const [L, setL] = useState(0);
  const [R, setR] = useState(0);
  const [stepDesc, setStepDesc] = useState('');
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
  } = useVisualizerVoice({ minInterval: 2500 });

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const buildZArray = useCallback(async (s: string) => {
    const n = s.length;
    const z = new Array(n).fill(0);
    let l = 0, r = 0;

    for (let i = 1; i < n; i++) {
      setCurrentIndex(i);
      const stepText = `i=${i}. Inside Z-box? Compare with [L=${l}, R=${r}].`;
      setStepDesc(stepText);
      speakStep("", stepText, i, n);
      if (i <= r) {
        z[i] = Math.min(r - i + 1, z[i - l]);
      }
      while (i + z[i] < n && s[z[i]] === s[i + z[i]]) {
        z[i]++;
      }
      if (i + z[i] - 1 > r) {
        l = i; r = i + z[i] - 1;
        setL(l); setR(r);
        setStepDesc(`Extend Z-box to [L=${l}, R=${r}] after expanding at i=${i}.`);
      }
      setZArray([...z]);
      await sleep(150);
    }
    setCurrentIndex(-1);
    return z;
  }, []);

  const run = useCallback(async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setMatches([]);
    setZArray([]);

    const s = mode === 'search' ? `${pattern}$${text}` : text;
    setCombined(s);
    setL(0); setR(0); setStepDesc('Start building Z array. Initialize L=0, R=0.');

    const z = await buildZArray(s);

    if (mode === 'search') {
      const m = pattern.length;
      const found: number[] = [];
      for (let i = m + 1; i < s.length; i++) {
        if (z[i] === m) {
          found.push(i - m - 1);
        }
      }
      setMatches(found);
      if (found.length) {
        toast.success(`Found pattern at positions: ${found.join(', ')}`);
      } else {
        toast.error('No match found');
      }
    } else {
      toast.success('Z-array constructed');
    }

    setIsAnimating(false);
  }, [isAnimating, pattern, text, mode, buildZArray]);

  const reset = useCallback(() => {
    setZArray([]);
    setMatches([]);
    setCurrentIndex(-1);
    setIsAnimating(false);
    setL(0); setR(0); setStepDesc('');
  }, []);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Z Algorithm Visualizer</h2>
        <p className="text-muted-foreground">
          Linear time string matching using Z array preprocessing
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-3 p-4 bg-muted/30 rounded-xl border">
          <h4 className="font-semibold">Algorithm Mode</h4>
          <Select value={mode} onValueChange={(v: 'zonly'|'search') => setMode(v)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="zonly">Z Array Construction Only</SelectItem>
              <SelectItem value="search">Pattern Search with Z Array</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3 p-4 bg-muted/30 rounded-xl border">
          <h4 className="font-semibold">Input Configuration</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm w-16">Text:</span>
              <Input 
                className="flex-1" 
                value={text} 
                onChange={e => setText(e.target.value)} 
                disabled={isAnimating} 
                placeholder="Enter text string"
              />
            </div>
            {mode === 'search' && (
              <div className="flex items-center gap-2">
                <span className="text-sm w-16">Pattern:</span>
                <Input 
                  className="flex-1" 
                  value={pattern} 
                  onChange={e => setPattern(e.target.value)} 
                  disabled={isAnimating} 
                  placeholder="Enter pattern to search"
                />
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={run} disabled={isAnimating} className="flex-1">
              {isAnimating ? 'Running...' : 'Run Z Algorithm'}
            </Button>
            <Button onClick={reset} variant="outline" disabled={isAnimating}>
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Current Step Display */}
      {stepDesc && (
        <div className="text-center p-4 bg-muted rounded-lg">
          <Badge className="mb-2" variant={isAnimating ? 'default' : 'secondary'}>
            Z Algorithm Step
          </Badge>
          <p className="text-sm">{stepDesc}</p>
        </div>
      )}

      {mode === 'search' && (
        <div className="p-3 bg-card border rounded">
          <div className="text-sm text-muted-foreground mb-1">Combined string S = P + "$" + T</div>
          <div className="font-mono text-sm break-all">{combined || `${pattern}$${text}`}</div>
        </div>
      )}

      <div className="p-4 bg-gradient-visualization rounded-xl border-2">
        <div className="mb-3 text-sm">Current Z-box: <span className="font-mono">[L={L}, R={R}]</span></div>
        {/* Combined string with Z-box highlight */}
        {(mode === 'search' ? (combined || `${pattern}$${text}`) : (combined || text)).length > 0 && (
          <div className="mb-3 border rounded p-2 bg-card font-mono text-sm overflow-x-auto whitespace-nowrap">
            {Array.from((mode === 'search' ? (combined || `${pattern}$${text}`) : (combined || text))).map((ch, i) => (
              <span key={i} className={`inline-block w-6 h-8 text-center border-r ${i>=L && i<=R ? 'bg-warning/20' : ''} ${i===currentIndex?'bg-primary/20':''}`}>{ch}</span>
            ))}
          </div>
        )}
        <div className="mb-2 text-sm font-medium">Z Array</div>
        <div className="border rounded bg-card font-mono text-sm overflow-x-auto whitespace-nowrap">
          {zArray.map((val, i) => (
            <span key={i} className={`inline-block w-8 h-8 text-center border-r ${i===currentIndex?'bg-primary text-primary-foreground':''}`}>{val}</span>
          ))}
        </div>
        {stepDesc && (
          <div className="mt-3 p-2 bg-muted/20 rounded text-sm">{stepDesc}</div>
        )}
      </div>

      {mode === 'search' && matches.length > 0 && (
        <div className="p-3 bg-muted/20 rounded border">
          <div className="text-sm">Matches at positions in text: <span className="font-mono">[{matches.join(', ')}]</span></div>
        </div>
      )}

      <div className="bg-muted/20 rounded-lg p-4">
        <h4 className="font-semibold mb-2">Z Algorithm Properties</h4>
        <div className="text-sm text-muted-foreground space-y-1">
          <div>• <strong>Z Array:</strong> Z[i] is the length of the longest common prefix of S and S[i:]</div>
          <div>• <strong>Z-box:</strong> Maintains interval [L,R] of rightmost substring that matches prefix</div>
          <div>• <strong>Pattern Search:</strong> Construct S = P + "$" + T, find positions where Z[i] = |P|</div>
          <div>• <strong>Time Complexity:</strong> O(n) linear time preprocessing and search</div>
          <div>• <strong>Space Complexity:</strong> O(n) for storing Z array</div>
          <div>• <strong>Applications:</strong> String matching, pattern recognition, bioinformatics</div>
        </div>
      </div>

      {/* Memory Layout */}
      {showMemory && (
        <MemoryLayout
          title="Z Algorithm Memory Layout"
          data={zArray.map((val, i) => `Z[${i}]=${val}`)}
          baseAddress={0x9000}
        />
      )}

      {/* Pseudocode */}
      <PseudocodeBox
        title="Z Algorithm - Pseudocode"
        code={[
          'L=0, R=0',
          'for i = 1..n-1:',
          '  if i <= R: Z[i] = min(R-i+1, Z[i-L])',
          '  while i+Z[i] < n and S[Z[i]] == S[i+Z[i]]: Z[i]++',
          '  if i+Z[i]-1 > R: L=i; R=i+Z[i]-1'
        ]}
        highlightedLine={
          currentIndex <= 0 ? 1 :
          (currentIndex > 0 && currentIndex <= combined.length ? (L && R && currentIndex<=R ? 3 : 2) : 0)
        }
      />

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
