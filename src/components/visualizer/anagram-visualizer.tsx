import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { PseudocodeBox } from '@/components/pseudocode-box';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

function buildFreq(s: string): number[] {
  const freq = new Array(26).fill(0);
  for (const ch of s.toLowerCase()) {
    const code = ch.charCodeAt(0) - 97;
    if (code >= 0 && code < 26) freq[code]++;
  }
  return freq;
}

export function AnagramVisualizer() {
  const [a, setA] = useState('listen');
  const [b, setB] = useState('silent');
  const [freqA, setFreqA] = useState<number[]>([]);
  const [freqB, setFreqB] = useState<number[]>([]);
  const [diffIdx, setDiffIdx] = useState<number[]>([]);
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
  } = useVisualizerVoice({ minInterval: 2000 });

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const run = useCallback(async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setStepDesc('Build frequency arrays for A and B (lowercase letters only).');
    speakOperation("Anagram Detection", `Checking if "${a}" and "${b}" are anagrams. We'll compare character frequencies.`);
    
    const fA = buildFreq(a);
    const fB = buildFreq(b);
    setFreqA(fA); setFreqB(fB);

    const diffs: number[] = [];
    for (let i = 0; i < 26; i++) {
      if (fA[i] !== fB[i]) diffs.push(i);
    }
    setDiffIdx(diffs);

    await sleep(800);
    const isAnagram = diffs.length === 0;
    const resultText = isAnagram ? `"${a}" and "${b}" are anagrams!` : `Not anagrams. Different counts for: ${diffs.map(i => String.fromCharCode(97+i)).join(', ')}`;
    setStepDesc(resultText);
    
    if (isAnagram) {
      speakResult(`Success! "${a}" and "${b}" are anagrams. All character frequencies match perfectly.`);
    } else {
      speakResult(`"${a}" and "${b}" are not anagrams. Character frequencies differ for letters: ${diffs.map(i => String.fromCharCode(97+i)).join(', ')}.`);
    }
    
    setIsAnimating(false);
  }, [a, b, isAnimating, speakOperation, speakResult]);

  const reset = useCallback(() => {
    setFreqA([]); setFreqB([]); setDiffIdx([]); setIsAnimating(false);
  }, []);

  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <div className="flex items-center gap-2">
          <span className="text-sm">A:</span>
          <Input value={a} onChange={e=>setA(e.target.value)} className="w-56" disabled={isAnimating} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">B:</span>
          <Input value={b} onChange={e=>setB(e.target.value)} className="w-56" disabled={isAnimating} />
        </div>
        <Button onClick={run} disabled={isAnimating}>Check</Button>
        <Button onClick={reset} variant="outline" disabled={isAnimating}>Reset</Button>
        <div className="flex items-center gap-2 ml-auto">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-card border rounded">
          <div className="text-sm font-medium mb-2">Frequency of A</div>
          <div className="flex items-end gap-1 h-40">
            {letters.map((ch, i) => (
              <div key={ch} className="flex flex-col items-center gap-1">
                <div className={`w-4 bg-primary/70 rounded transition-all`} style={{height: `${(freqA[i]||0)*20}px`}} />
                <div className="text-[10px] text-muted-foreground">{ch}</div>
                <div className="text-[10px] font-mono">{freqA[i]||0}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 bg-card border rounded">
          <div className="text-sm font-medium mb-2">Frequency of B</div>
          <div className="flex items-end gap-1 h-40">
            {letters.map((ch, i) => (
              <div key={ch} className="flex flex-col items-center gap-1">
                <div className={`w-4 ${diffIdx.includes(i)?'bg-destructive/70':'bg-success/70'} rounded transition-all`} style={{height: `${(freqB[i]||0)*20}px`}} />
                <div className="text-[10px] text-muted-foreground">{ch}</div>
                <div className="text-[10px] font-mono">{freqB[i]||0}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-muted/20 rounded-lg p-3">
        <div className="font-medium mb-2">Concept</div>
        <div className="text-sm text-muted-foreground space-y-1">
          <div>• Two strings are anagrams if character counts match for every letter.</div>
          <div>• Complexity: O(n) time, O(1) space for fixed alphabet.</div>
        </div>
      </div>

      <PseudocodeBox
        title="Anagram Detection - Pseudocode"
        code={[
          'countA[26] = zeros; countB[26] = zeros',
          'for ch in A: countA[ch-\'a\']++',
          'for ch in B: countB[ch-\'a\']++',
          'if countA == countB and len(A)==len(B): return true else false'
        ]}
        highlightedLine={
          stepDesc.includes('Build frequency') ? 1 :
          stepDesc.includes('Anagrams') ? 4 :
          stepDesc.includes('Not anagrams') ? 4 : 0
        }
      />
    </div>
  );
}
