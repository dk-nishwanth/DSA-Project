import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PseudocodeBox } from '@/components/pseudocode-box';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

function preprocess(s: string): string {
  return `^#${s.split('').join('#')}#$`;
}

export function ManacherVisualizer() {
  const [text, setText] = useState('babad');
  const [processed, setProcessed] = useState('');
  const [p, setP] = useState<number[]>([]);
  const [center, setCenter] = useState(0);
  const [right, setRight] = useState(0);
  const [current, setCurrent] = useState(0);
  const [longest, setLongest] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
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

  const run = useCallback(async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    const T = preprocess(text);
    setProcessed(T);
    const n = T.length;
    const P = new Array(n).fill(0);
    let C = 0, R = 0;

    for (let i = 1; i < n - 1; i++) {
      setCurrent(i);
      const mirror = 2 * C - i;
      if (i < R) {
        P[i] = Math.min(R - i, P[mirror]);
        setStepDesc(`i=${i}, inside [C=${C}, R=${R}]. Initialize P[i]=min(R-i, P[mirror=${mirror}]) → ${P[i]}.`);
      } else {
        setStepDesc(`i=${i}, outside Z-box. Start expansion.`);
      }

      while (T[i + (1 + P[i])] === T[i - (1 + P[i])]) {
        P[i]++;
        setP([...P]);
        await sleep(120);
      }

      if (i + P[i] > R) {
        C = i; R = i + P[i];
        setCenter(C); setRight(R);
        setStepDesc(`Extend center to C=${C}, right to R=${R}.`);
      }
      setP([...P]);
      await sleep(120);
    }

    // Extract longest palindrome
    let maxLen = 0, centerIndex = 0;
    for (let i = 1; i < n - 1; i++) {
      if (P[i] > maxLen) { maxLen = P[i]; centerIndex = i; }
    }
    const start = (centerIndex - maxLen) / 2;
    const longestPal = text.substring(start, start + maxLen);
    setLongest(longestPal);
    setIsAnimating(false);
  }, [text, isAnimating]);

  const reset = useCallback(() => {
    setP([]); setCenter(0); setRight(0); setCurrent(0); setProcessed(''); setLongest(''); setIsAnimating(false);
  }, []);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Manacher's Algorithm Visualizer</h2>
        <p className="text-muted-foreground">
          Linear time algorithm to find all palindromes in a string
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <div className="flex items-center gap-2">
          <span className="text-sm">Text:</span>
          <Input 
            className="w-64" 
            value={text} 
            onChange={e => setText(e.target.value)} 
            disabled={isAnimating}
            placeholder="Enter string to find palindromes"
          />
        </div>
        <Button onClick={run} disabled={isAnimating}>
          {isAnimating ? 'Running...' : 'Run Manacher\'s Algorithm'}
        </Button>
        <Button onClick={reset} variant="outline" disabled={isAnimating}>Reset</Button>
      </div>

      {/* Current Step Display */}
      {stepDesc && (
        <div className="text-center p-4 bg-muted rounded-lg">
          <Badge className="mb-2" variant={isAnimating ? 'default' : 'secondary'}>
            Manacher's Algorithm Step
          </Badge>
          <p className="text-sm">{stepDesc}</p>
        </div>
      )}

      <div className="p-3 bg-card border rounded">
        <div className="text-sm text-muted-foreground mb-1">Processed (with sentinels):</div>
        <div className="font-mono text-sm break-all">{processed || preprocess(text)}</div>
      </div>

      <div className="p-4 bg-gradient-visualization rounded-xl border-2">
        <div className="mb-2 text-sm font-medium">Palindrome Radius Array (P)</div>
        <div className="border rounded bg-card font-mono text-sm overflow-x-auto whitespace-nowrap">
          {p.map((val, i) => (
            <span key={i} className={`inline-block w-8 h-8 text-center border-r ${i===current?'bg-primary text-primary-foreground':''}`}>{val}</span>
          ))}
        </div>
        <div className="mt-3 text-xs text-muted-foreground">Center: {center}, Right: {right}</div>
        {stepDesc && (
          <div className="mt-3 p-2 bg-muted/20 rounded text-sm">{stepDesc}</div>
        )}
      </div>

      {longest && (
        <div className="p-3 bg-muted/20 rounded border">
          <div className="text-sm">Longest Palindromic Substring: <span className="font-bold text-primary">{longest}</span></div>
        </div>
      )}

      <div className="bg-muted/20 rounded-lg p-4">
        <h4 className="font-semibold mb-2">Manacher's Algorithm Properties</h4>
        <div className="text-sm text-muted-foreground space-y-1">
          <div>• <strong>Preprocessing:</strong> Insert special characters to handle even/odd palindromes uniformly</div>
          <div>• <strong>Mirror Property:</strong> Uses previously computed values to avoid redundant comparisons</div>
          <div>• <strong>Center & Right:</strong> Maintains rightmost palindrome boundary for optimization</div>
          <div>• <strong>Time Complexity:</strong> O(n) linear time - each character processed at most twice</div>
          <div>• <strong>Space Complexity:</strong> O(n) for storing palindrome radius array</div>
          <div>• <strong>Applications:</strong> Longest palindromic substring, palindrome counting, DNA analysis</div>
        </div>
      </div>

      {/* Memory Layout */}
      {showMemory && (
        <MemoryLayout
          title="Manacher's Algorithm Memory Layout"
          data={p.map((val, i) => `P[${i}]=${val}`)}
          baseAddress={0xA000}
        />
      )}

      <PseudocodeBox
        title="Manacher's Algorithm - Pseudocode"
        code={[
          'T = preprocess(s) with sentinels',
          'P = array of zeros; C=0; R=0',
          'for i in 1..n-2:',
          '  mirror = 2*C - i',
          '  if i < R: P[i] = min(R-i, P[mirror])',
          '  while T[i+1+P[i]] == T[i-1-P[i]]: P[i]++',
          '  if i + P[i] > R: C=i; R=i+P[i]',
          'return max P[i] mapped back to s'
        ]}
        highlightedLine={
          current <= 1 ? 1 :
          (current > 1 && current < processed.length-1 ? (current < right ? 5 : 6) : 0)
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
