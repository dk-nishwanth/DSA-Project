import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { PseudocodeBox } from '@/components/pseudocode-box';

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
  const [voiceExplain, setVoiceExplain] = useState<boolean>(() => {
    try { return localStorage.getItem('dsa_voice_explain') === '1'; } catch { return false; }
  });
  useEffect(() => {
    if (!voiceExplain || !stepDesc) return;
    try {
      const u = new SpeechSynthesisUtterance(stepDesc);
      u.rate = 1.05; u.pitch = 1.0; u.volume = 0.85;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch {}
  }, [voiceExplain, stepDesc]);
  const setVoice = (on: boolean) => {
    setVoiceExplain(on);
    try { localStorage.setItem('dsa_voice_explain', on ? '1' : '0'); } catch {}
  };

  const run = useCallback(async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setStepDesc('Build frequency arrays for A and B (lowercase letters only).');
    const fA = buildFreq(a);
    const fB = buildFreq(b);
    setFreqA(fA); setFreqB(fB);

    const diffs: number[] = [];
    for (let i = 0; i < 26; i++) {
      if (fA[i] !== fB[i]) diffs.push(i);
    }
    setDiffIdx(diffs);

    if (diffs.length === 0 && a.replace(/\W/g,'').length === b.replace(/\W/g,'').length) {
      setStepDesc('All character counts match and lengths equal → Anagrams!');
      toast.success('These are anagrams!');
    } else {
      setStepDesc('Character counts differ or lengths unequal → Not anagrams.');
      toast.error('Not anagrams');
    }
    setIsAnimating(false);
  }, [a, b, isAnimating]);

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
          <label className="text-sm">Voice Explain</label>
          <input type="checkbox" checked={voiceExplain} onChange={(e)=>setVoice(e.target.checked)} />
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
