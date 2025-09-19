import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PseudocodeBox } from '@/components/pseudocode-box';

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
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <div className="flex items-center gap-2">
          <span className="text-sm">Text:</span>
          <Input className="w-64" value={text} onChange={e => setText(e.target.value)} disabled={isAnimating} />
        </div>
        <Button onClick={run} disabled={isAnimating}>Run</Button>
        <Button onClick={reset} variant="outline" disabled={isAnimating}>Reset</Button>
        <div className="flex items-center gap-2 ml-auto">
          <label className="text-sm">Voice Explain</label>
          <input type="checkbox" checked={voiceExplain} onChange={(e)=>setVoice(e.target.checked)} />
        </div>
      </div>

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

      <div className="bg-muted/20 rounded-lg p-3">
        <div className="font-medium mb-2">Algorithm Info</div>
        <div className="text-sm text-muted-foreground space-y-1">
          <div>• Preprocess to handle even/odd palindromes uniformly</div>
          <div>• Mirror property reduces redundant comparisons</div>
          <div>• Time: O(n), Space: O(n)</div>
        </div>
      </div>

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
    </div>
  );
}
