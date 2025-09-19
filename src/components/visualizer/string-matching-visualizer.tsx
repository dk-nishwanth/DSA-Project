import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Play, RotateCcw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { PseudocodeBox } from '@/components/pseudocode-box';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVoiceExplain } from '@/hooks/useVoiceExplain';

type Algorithm = 'naive' | 'kmp' | 'rabin-karp';

interface MatchResult {
  index: number;
  isMatch: boolean;
}

export function StringMatchingVisualizer() {
  const [text, setText] = useState('ABABDABACDABABCABCABCABCABCABC');
  const [pattern, setPattern] = useState('ABABCAB');
  const [algorithm, setAlgorithm] = useState<Algorithm>('naive');
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(-1);
  const [currentPatternIndex, setCurrentPatternIndex] = useState(-1);
  const [matches, setMatches] = useState<number[]>([]);
  const [comparisons, setComparisons] = useState(0);
  const [lpsArray, setLpsArray] = useState<number[]>([]);
  const [hashWindowIndex, setHashWindowIndex] = useState<number>(-1);
  const [currentHash, setCurrentHash] = useState<number | null>(null);
  const [patternHash, setPatternHash] = useState<number | null>(null);
  const [stepDesc, setStepDesc] = useState('');
  const [showMemory, setShowMemory] = useState(false);
  const { enabled: voiceEnabled, setEnabled: setVoiceEnabled } = useVoiceExplain(stepDesc);

  const pseudocode = useMemo(() => ({
    naive: [
      'for i in 0..n-m:',
      '  for j in 0..m-1:',
      '    if T[i+j] != P[j]: break',
      '  if j == m: report match at i'
    ],
    kmp: [
      'lps = buildLPS(P)',
      'i=0; j=0',
      'while i < n:',
      '  if T[i] == P[j]: i++; j++',
      '  if j == m: report match; j = lps[j-1]',
      '  else if i < n and T[i] != P[j]:',
      '    if j != 0: j = lps[j-1] else i++'
    ],
    rabin: [
      'pHash = hash(P); tHash = hash(T[0..m-1])',
      'for i in 0..n-m:',
      '  if pHash == tHash: verify chars',
      '  if i < n-m: roll hash to next window'
    ],
  }), []);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const buildLPSArray = useCallback((pattern: string): number[] => {
    const lps = new Array(pattern.length).fill(0);
    let len = 0;
    let i = 1;

    while (i < pattern.length) {
      if (pattern[i] === pattern[len]) {
        len++;
        lps[i] = len;
        i++;
      } else {
        if (len !== 0) {
          len = lps[len - 1];
        } else {
          lps[i] = 0;
          i++;
        }
      }
    }

    return lps;
  }, []);

  const naiveSearch = useCallback(async () => {
    const foundMatches = [];
    let totalComparisons = 0;

    for (let i = 0; i <= text.length - pattern.length; i++) {
      setCurrentTextIndex(i);
      setStepDesc(`Shift i=${i}. Compare pattern over text starting at ${i}.`);
      await sleep(300);

      let j = 0;
      for (j = 0; j < pattern.length; j++) {
        setCurrentPatternIndex(j);
        totalComparisons++;
        setComparisons(totalComparisons);
        
        await sleep(400);

        if (text[i + j] !== pattern[j]) {
          setStepDesc(`Mismatch at T[${i+j}] vs P[${j}]. Break and shift.`);
          break;
        }
      }

      if (j === pattern.length) {
        foundMatches.push(i);
        setMatches([...foundMatches]);
        setStepDesc(`Match found at position ${i}.`);
        toast.success(`Match found at position ${i}`);
      }

      setCurrentPatternIndex(-1);
      await sleep(200);
    }

    setCurrentTextIndex(-1);
    return foundMatches;
  }, [text, pattern]);

  const kmpSearch = useCallback(async () => {
    const lps = buildLPSArray(pattern);
    setLpsArray(lps);
    
    const foundMatches = [];
    let totalComparisons = 0;
    let i = 0; // text index
    let j = 0; // pattern index

    while (i < text.length) {
      setCurrentTextIndex(i);
      setCurrentPatternIndex(j);
      totalComparisons++;
      setComparisons(totalComparisons);
      setStepDesc(`Compare T[${i}] with P[${j}].`);
      
      await sleep(400);

      if (pattern[j] === text[i]) {
        i++;
        j++;
        setStepDesc(`Match: advance to i=${i}, j=${j}.`);
      }

      if (j === pattern.length) {
        foundMatches.push(i - j);
        setMatches([...foundMatches]);
        setStepDesc(`Match found at position ${i - j}. Jump using LPS to j=lps[${j-1}]`);
        toast.success(`Match found at position ${i - j}`);
        j = lps[j - 1];
      } else if (i < text.length && pattern[j] !== text[i]) {
        if (j !== 0) {
          j = lps[j - 1];
          setStepDesc(`Mismatch: jump j to lps = ${j}. Keep i=${i}.`);
          toast.info(`Using LPS: jumping to position ${j}`);
        } else {
          i++;
          setStepDesc(`Mismatch at j=0: increment i to ${i}.`);
        }
      }

      await sleep(200);
    }

    setCurrentTextIndex(-1);
    setCurrentPatternIndex(-1);
    return foundMatches;
  }, [text, pattern, buildLPSArray]);

  const rabinKarpSearch = useCallback(async () => {
    // Polynomial rolling hash parameters
    const base = 256; // alphabet size
    const prime = 101; // a small prime for mod to keep values visible
    const n = text.length;
    const m = pattern.length;
    if (m === 0 || n < m) return [] as number[];

    let pHash = 0; // hash of pattern
    let tHash = 0; // hash of current text window
    let h = 1;     // base^(m-1) % prime
    const foundMatches: number[] = [];
    let totalComparisons = 0;

    for (let i = 0; i < m - 1; i++) {
      h = (h * base) % prime;
    }

    for (let i = 0; i < m; i++) {
      pHash = (base * pHash + pattern.charCodeAt(i)) % prime;
      tHash = (base * tHash + text.charCodeAt(i)) % prime;
    }

    setPatternHash(pHash);
    setCurrentHash(tHash);

    for (let i = 0; i <= n - m; i++) {
      setHashWindowIndex(i);
      setCurrentTextIndex(i);
      setCurrentPatternIndex(0);
      setStepDesc(`Window i=${i}: compare hashes (pHash=${pHash}, tHash=${tHash}).`);
      await sleep(300);

      if (pHash === tHash) {
        // Potential match, verify characters
        let j = 0;
        let isMatch = true;
        while (j < m) {
          totalComparisons++;
          setComparisons(totalComparisons);
          setCurrentPatternIndex(j);
          await sleep(200);
          if (text[i + j] !== pattern[j]) {
            isMatch = false;
            setStepDesc(`Hash equal but chars mismatch at j=${j}. False positive.`);
            break;
          }
          j++;
        }
        if (isMatch) {
          foundMatches.push(i);
          setMatches([...foundMatches]);
          setStepDesc(`Verified match at position ${i}.`);
          toast.success(`Match found at position ${i}`);
        }
      }

      // Slide the window
      if (i < n - m) {
        tHash = (base * (tHash - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % prime;
        if (tHash < 0) tHash += prime;
        setCurrentHash(tHash);
        setStepDesc(`Roll hash to next window: tHash=${tHash}.`);
        await sleep(200);
      }
    }

    setCurrentTextIndex(-1);
    setCurrentPatternIndex(-1);
    setHashWindowIndex(-1);
    return foundMatches;
  }, [text, pattern]);

  const runSearch = useCallback(async () => {
    if (!text.trim() || !pattern.trim()) {
      toast.error('Please enter both text and pattern');
      return;
    }

    setIsAnimating(true);
    setMatches([]);
    setComparisons(0);
    setCurrentTextIndex(-1);
    setCurrentPatternIndex(-1);
    setStepDesc('');

    try {
      switch (algorithm) {
        case 'naive':
          await naiveSearch();
          break;
        case 'kmp':
          await kmpSearch();
          break;
        case 'rabin-karp':
          await rabinKarpSearch();
          break;
      }
    } catch (error) {
      toast.error('Search algorithm failed');
    }

    setIsAnimating(false);
  }, [text, pattern, algorithm, naiveSearch, kmpSearch]);

  const resetSearch = useCallback(() => {
    setMatches([]);
    setComparisons(0);
    setCurrentTextIndex(-1);
    setCurrentPatternIndex(-1);
    setLpsArray([]);
    setHashWindowIndex(-1);
    setCurrentHash(null);
    setPatternHash(null);
    setIsAnimating(false);
    toast.success('Search reset');
  }, []);

  const renderText = useCallback(() => {
    return text.split('').map((char, index) => {
      const isCurrentPosition = index === currentTextIndex;
      const isInMatch = matches.some(match => 
        index >= match && index < match + pattern.length
      );
      const isCurrentlyMatching = currentTextIndex !== -1 && 
        index >= currentTextIndex && 
        index < currentTextIndex + pattern.length;

      return (
        <span
          key={index}
          className={`
            inline-block w-6 h-8 text-center text-sm font-mono border-r border-border/30
            ${isCurrentPosition ? 'bg-primary text-primary-foreground animate-pulse' : ''}
            ${isInMatch ? 'bg-success/20 text-success' : ''}
            ${isCurrentlyMatching && !isInMatch ? 'bg-warning/20' : ''}
          `}
        >
          {char}
        </span>
      );
    });
  }, [text, currentTextIndex, matches, pattern.length]);

  const renderPattern = useCallback(() => {
    return pattern.split('').map((char, index) => {
      const isCurrentChar = index === currentPatternIndex;

      return (
        <span
          key={index}
          className={`
            inline-block w-6 h-8 text-center text-sm font-mono border-r border-border/30
            ${isCurrentChar ? 'bg-primary text-primary-foreground animate-pulse' : ''}
            bg-card
          `}
        >
          {char}
        </span>
      );
    });
  }, [pattern, currentPatternIndex]);

  return (
    <div className="w-full space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <Select value={algorithm} onValueChange={(value: Algorithm) => setAlgorithm(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="naive">Naive Search</SelectItem>
            <SelectItem value="kmp">KMP Algorithm</SelectItem>
            <SelectItem value="rabin-karp">Rabin-Karp</SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={runSearch}
          disabled={isAnimating}
          className="flex items-center gap-1"
        >
          <Search className="h-4 w-4" />
          Search
        </Button>

        <Button
          onClick={resetSearch}
          disabled={isAnimating}
          variant="outline"
          className="flex items-center gap-1"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>

      {/* Input Fields */}
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium mb-1 block">Text:</label>
          <Input
            value={text}
            onChange={(e) => setText(e.target.value.toUpperCase())}
            placeholder="Enter text to search in"
            disabled={isAnimating}
            className="font-mono"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">Pattern:</label>
          <Input
            value={pattern}
            onChange={(e) => setPattern(e.target.value.toUpperCase())}
            placeholder="Enter pattern to search for"
            disabled={isAnimating}
            className="font-mono"
          />
        </div>
      </div>

      {/* Visualization */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 rounded-xl border-2 border-border/50 p-6">
        {/* Text Display */}
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Text:</div>
          <div className="border rounded p-2 bg-card font-mono text-sm overflow-x-auto">
            {renderText()}
          </div>
        </div>

        {/* Pattern Display */}
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Pattern:</div>
          <div className="border rounded p-2 bg-card font-mono text-sm">
            {renderPattern()}
          </div>
        </div>

        {/* LPS Array for KMP */}
        {algorithm === 'kmp' && lpsArray.length > 0 && (
          <div className="mb-4">
            <div className="text-sm font-medium mb-2">LPS Array (Longest Proper Prefix Suffix):</div>
            <div className="border rounded p-2 bg-card font-mono text-sm">
              {lpsArray.map((value, index) => (
                <span
                  key={index}
                  className="inline-block w-6 h-8 text-center border-r border-border/30 bg-info/20 text-info"
                >
                  {value}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Hash values for Rabin-Karp */}
        {algorithm === 'rabin-karp' && (
          <div className="mb-4 grid gap-2 md:grid-cols-2">
            <div className="p-3 border rounded bg-card">
              <div className="text-sm font-medium mb-1">Pattern Hash</div>
              <div className="font-mono text-sm">{patternHash ?? '-'} (mod 101)</div>
            </div>
            <div className="p-3 border rounded bg-card">
              <div className="text-sm font-medium mb-1">Current Window</div>
              <div className="text-sm">Index: <span className="font-mono">{hashWindowIndex >= 0 ? hashWindowIndex : '-'}</span></div>
              <div className="text-sm">Hash: <span className="font-mono">{currentHash ?? '-'}</span> (mod 101)</div>
            </div>
          </div>
        )}
        {/* Statistics */}
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span>Comparisons:</span>
            <span className="font-medium text-primary">{comparisons}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Matches found:</span>
            <span className="font-medium text-success">{matches.length}</span>
          </div>
          {matches.length > 0 && (
            <div className="flex items-center gap-2">
              <span>Positions:</span>
              <span className="font-medium text-success">[{matches.join(', ')}]</span>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center">
        <VisualizerControls
          showMemory={showMemory}
          onToggleMemory={setShowMemory}
          voiceEnabled={voiceEnabled}
          onToggleVoice={setVoiceEnabled}
        />
      </div>

      {/* Memory Layout */}
      {showMemory && (
        <MemoryLayout
          data={Array.from(text)}
          title="Text Buffer Memory Layout"
          baseAddress={3000}
          wordSize={1}
        />
      )}

      {/* Narration */}
      {stepDesc && (
        <div className="mt-3 p-2 bg-muted/20 rounded text-sm">{stepDesc}</div>
      )}

      {/* Pseudocode */}
      <PseudocodeBox
        title={`${algorithm.toUpperCase()} - Pseudocode`}
        code={algorithm==='naive' ? pseudocode.naive : algorithm==='kmp' ? pseudocode.kmp : pseudocode.rabin}
        highlightedLine={
          algorithm==='naive' ? (
            currentPatternIndex<0 ? 1 : (stepDesc.includes('Mismatch') ? 3 : (stepDesc.includes('Match found') ? 4 : 2))
          ) : algorithm==='kmp' ? (
            stepDesc.includes('jump j') ? 7 : stepDesc.includes('Mismatch at j=0') ? 7 : stepDesc.includes('report match') ? 5 : stepDesc.includes('Match: advance') ? 4 : 3
          ) : (
            stepDesc.includes('compare hashes') ? 3 : stepDesc.includes('Verified match') ? 3 : 4
          )
        }
      />
    </div>
  );
}