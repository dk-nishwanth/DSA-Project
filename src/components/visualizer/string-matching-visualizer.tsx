import React, { useState, useCallback } from 'react';
import { Play, RotateCcw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

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
      await sleep(300);

      let j = 0;
      for (j = 0; j < pattern.length; j++) {
        setCurrentPatternIndex(j);
        totalComparisons++;
        setComparisons(totalComparisons);
        
        await sleep(400);

        if (text[i + j] !== pattern[j]) {
          break;
        }
      }

      if (j === pattern.length) {
        foundMatches.push(i);
        setMatches([...foundMatches]);
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
      
      await sleep(400);

      if (pattern[j] === text[i]) {
        i++;
        j++;
      }

      if (j === pattern.length) {
        foundMatches.push(i - j);
        setMatches([...foundMatches]);
        toast.success(`Match found at position ${i - j}`);
        j = lps[j - 1];
      } else if (i < text.length && pattern[j] !== text[i]) {
        if (j !== 0) {
          j = lps[j - 1];
          toast.info(`Using LPS: jumping to position ${j}`);
        } else {
          i++;
        }
      }

      await sleep(200);
    }

    setCurrentTextIndex(-1);
    setCurrentPatternIndex(-1);
    return foundMatches;
  }, [text, pattern, buildLPSArray]);

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

    try {
      switch (algorithm) {
        case 'naive':
          await naiveSearch();
          break;
        case 'kmp':
          await kmpSearch();
          break;
        case 'rabin-karp':
          toast.info('Rabin-Karp algorithm coming soon!');
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
      <div className="bg-gradient-visualization rounded-xl border-2 border-border/50 p-4">
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

      {/* Algorithm Info */}
      <div className="bg-muted/20 rounded-lg p-3">
        <div className="font-medium mb-2">Algorithm Info:</div>
        <div className="text-sm text-muted-foreground space-y-1">
          {algorithm === 'naive' && (
            <>
              <div>• Checks pattern at every position in text</div>
              <div>• Time complexity: O(nm) where n = text length, m = pattern length</div>
              <div>• Simple but inefficient for large texts</div>
            </>
          )}
          {algorithm === 'kmp' && (
            <>
              <div>• Uses failure function (LPS array) to skip unnecessary comparisons</div>
              <div>• Time complexity: O(n + m) - linear time!</div>
              <div>• Preprocessing creates LPS array in O(m) time</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}