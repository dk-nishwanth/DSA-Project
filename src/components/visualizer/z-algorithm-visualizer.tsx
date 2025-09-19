import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { PseudocodeBox } from '@/components/pseudocode-box';

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

  const buildZArray = useCallback(async (s: string) => {
    const n = s.length;
    const z = new Array(n).fill(0);
    let l = 0, r = 0;

    for (let i = 1; i < n; i++) {
      setCurrentIndex(i);
      setStepDesc(`i=${i}. Inside Z-box? Compare with [L=${l}, R=${r}].`);
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
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <Select value={mode} onValueChange={(v: 'zonly' | 'search') => setMode(v)}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="search">Pattern Search (P$T)</SelectItem>
            <SelectItem value="zonly">Z on Text Only</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <span className="text-sm">Text:</span>
          <Input className="w-64" value={text} onChange={e => setText(e.target.value)} disabled={isAnimating} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">Pattern:</span>
          <Input className="w-48" value={pattern} onChange={e => setPattern(e.target.value)} disabled={isAnimating || mode==='zonly'} />
        </div>
        <Button onClick={run} disabled={isAnimating}>Run</Button>
        <Button onClick={reset} variant="outline" disabled={isAnimating}>Reset</Button>
        <div className="flex items-center gap-2 ml-auto">
          <label className="text-sm">Voice Explain</label>
          <input type="checkbox" checked={voiceExplain} onChange={(e)=>setVoice(e.target.checked)} />
        </div>
      </div>

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

      <div className="bg-muted/20 rounded-lg p-3">
        <div className="font-medium mb-2">Algorithm Info</div>
        <div className="text-sm text-muted-foreground space-y-1">
          <div>• Builds Z array where Z[i] is LCP of S and S[i:]</div>
          <div>• Pattern search: build S = P + "$" + T and find Z[i] == |P|</div>
          <div>• Time: O(n), Space: O(n)</div>
        </div>
      </div>

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
    </div>
  );
}
