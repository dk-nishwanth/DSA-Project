import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

interface CharElement {
  char: string;
  originalChar: string;
  index: number;
  originalIndex: number;
  isLeftPointer: boolean;
  isRightPointer: boolean;
  isMatching: boolean;
  isMismatch: boolean;
  isProcessed: boolean;
  isIgnored: boolean;
  isPalindromeCenter: boolean;
  mirrorIndex?: number;
}

export function PalindromeCheckVisualizer() {
  const [stringInput, setStringInput] = useState('A man a plan a canal Panama');
  const [approach, setApproach] = useState<'mirror-visualization' | 'expand-around-center' | 'manacher-algorithm'>('mirror-visualization');
  const [ignoreCase, setIgnoreCase] = useState(true);
  const [ignoreSpaces, setIgnoreSpaces] = useState(true);
  const [chars, setChars] = useState<CharElement[]>([]);
  const [originalChars, setOriginalChars] = useState<CharElement[]>([]);
  const [leftPointer, setLeftPointer] = useState(0);
  const [rightPointer, setRightPointer] = useState(0);
  const [centerIndex, setCenterIndex] = useState(-1);
  const [expandRadius, setExpandRadius] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showMemory, setShowMemory] = useState(false);
  const [result, setResult] = useState<string>('');
  const [step, setStep] = useState(0);
  const [comparisons, setComparisons] = useState(0);
  const [processedString, setProcessedString] = useState('');
  const [mirrorLine, setMirrorLine] = useState(-1);
  const [palindromes, setPalindromes] = useState<{start: number, end: number, length: number}[]>([]);

  const {
    voiceEnabled,
    setVoiceEnabled,
    speakOperation,
    speakStep,
    speakResult,
  } = useVisualizerVoice({ minInterval: 800 });

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const preprocessString = useCallback((str: string) => {
    const original = str.split('').map((char, index) => ({
      char,
      originalChar: char,
      index: -1,
      originalIndex: index,
      isLeftPointer: false,
      isRightPointer: false,
      isMatching: false,
      isMismatch: false,
      isProcessed: false,
      isIgnored: false,
      isPalindromeCenter: false,
    }));

    let processed = str;
    if (ignoreCase) processed = processed.toLowerCase();
    
    const filteredChars: CharElement[] = [];
    let processedIndex = 0;
    
    for (let i = 0; i < original.length; i++) {
      const char = original[i];
      if (ignoreSpaces && !/[a-zA-Z0-9]/.test(char.originalChar)) {
        char.isIgnored = true;
      } else {
        char.char = ignoreCase ? char.originalChar.toLowerCase() : char.originalChar;
        char.index = processedIndex++;
        filteredChars.push(char);
      }
    }
    
    setOriginalChars(original);
    return filteredChars;
  }, [ignoreCase, ignoreSpaces]);

  const parseString = useCallback(() => {
    const processedChars = preprocessString(stringInput);
    setChars(processedChars);
    setProcessedString(processedChars.map(c => c.char).join(''));
    return processedChars;
  }, [stringInput, preprocessString]);

  const clearHighlights = useCallback(() => {
    setChars(prev => prev.map(char => ({
      ...char,
      isLeftPointer: false,
      isRightPointer: false,
      isMatching: false,
      isMismatch: false,
      isPalindromeCenter: false,
    })));
    setMirrorLine(-1);
    setCenterIndex(-1);
    setExpandRadius(0);
  }, []);

  const updatePointers = useCallback((left: number, right: number) => {
    setLeftPointer(left);
    setRightPointer(right);
    setChars(prev => prev.map((char, index) => ({
      ...char,
      isLeftPointer: char.index === left,
      isRightPointer: char.index === right,
    })));
  }, []);

  // Mirror Visualization Approach - Shows palindrome as mirror reflection
  const mirrorVisualizationApproach = useCallback(async () => {
    const processedChars = parseString();
    
    speakOperation('Mirror Visualization', `Visualizing palindrome as mirror reflection`);
    
    if (processedChars.length === 0) {
      setResult('Empty string is considered a palindrome');
      return;
    }
    
    const str = processedChars.map(c => c.char).join('');
    let left = 0;
    let right = str.length - 1;
    let currentStep = 0;
    setComparisons(0);
    
    // Show mirror line in the center
    const centerPos = Math.floor(str.length / 2);
    setMirrorLine(centerPos);
    
    speakStep('Setup mirror', `Setting up mirror line at center position ${centerPos}`, currentStep, Math.ceil(str.length / 2));
    await sleep(1000);
    
    while (left < right) {
      updatePointers(left, right);
      setComparisons(prev => prev + 1);
      
      // Calculate mirror positions
      const leftMirror = centerPos - (left - centerPos);
      const rightMirror = centerPos + (right - centerPos);
      
      speakStep('Mirror check', `Checking mirror positions: ${str[left]} at ${left} mirrors ${str[right]} at ${right}`, currentStep, Math.ceil(str.length / 2));
      await sleep(800);
      
      if (str[left] === str[right]) {
        setChars(prev => prev.map((char, index) => ({
          ...char,
          isMatching: char.index === left || char.index === right ? true : char.isMatching,
          mirrorIndex: char.index === left ? right : char.index === right ? left : char.mirrorIndex,
        })));
        
        speakStep('Mirror match', `Characters ${str[left]} and ${str[right]} match across mirror`, currentStep, Math.ceil(str.length / 2));
        await sleep(600);
        
        left++;
        right--;
      } else {
        setChars(prev => prev.map((char, index) => ({
          ...char,
          isMismatch: char.index === left || char.index === right ? true : char.isMismatch,
        })));
        
        setResult(`Not a palindrome: '${str[left]}' ≠ '${str[right]}' - mirror broken at positions ${left} and ${right}`);
        speakResult(`Mirror broken - not a palindrome`);
        return;
      }
      
      currentStep++;
    }
    
    // Mark center if odd length
    if (left === right) {
      setChars(prev => prev.map((char, index) => ({
        ...char,
        isPalindromeCenter: char.index === left,
      })));
    }
    
    setResult(`"${stringInput}" is a perfect palindrome! ✓ Mirror reflection confirmed.`);
    speakResult(`Perfect palindrome confirmed through mirror visualization`);
  }, [stringInput, parseString, updatePointers, speakOperation, speakStep, speakResult]);

  // Expand Around Center Approach - Shows palindrome expansion
  const expandAroundCenterApproach = useCallback(async () => {
    const processedChars = parseString();
    
    speakOperation('Expand Around Center', `Finding palindromes by expanding around each center`);
    
    if (processedChars.length === 0) {
      setResult('Empty string - no palindromes to find');
      return;
    }
    
    const str = processedChars.map(c => c.char).join('');
    const foundPalindromes: {start: number, end: number, length: number}[] = [];
    let longestStart = 0, longestEnd = 0;
    
    const expandAroundCenter = async (left: number, right: number, centerType: string) => {
      setCenterIndex(Math.floor((left + right) / 2));
      setExpandRadius(0);
      
      speakStep('Set center', `Expanding around ${centerType} center at position ${Math.floor((left + right) / 2)}`, step, str.length * 2);
      await sleep(600);
      
      let radius = 0;
      while (left >= 0 && right < str.length && str[left] === str[right]) {
        setExpandRadius(radius);
        updatePointers(left, right);
        setComparisons(prev => prev + 1);
        
        setChars(prev => prev.map((char, index) => ({
          ...char,
          isMatching: char.index >= left && char.index <= right ? true : char.isMatching,
        })));
        
        speakStep('Expand', `Expanded to [${left}, ${right}]: "${str.substring(left, right + 1)}" (length ${right - left + 1})`, step, str.length * 2);
        await sleep(500);
        
        if (right - left + 1 > longestEnd - longestStart + 1) {
          longestStart = left;
          longestEnd = right;
        }
        
        foundPalindromes.push({start: left, end: right, length: right - left + 1});
        
        left--;
        right++;
        radius++;
      }
      
      return {start: longestStart, end: longestEnd, length: longestEnd - longestStart + 1};
    };
    
    // Check all possible centers
    for (let i = 0; i < str.length; i++) {
      clearHighlights();
      
      // Odd length palindromes (single character center)
      await expandAroundCenter(i, i, 'single character');
      
      // Even length palindromes (between characters)
      if (i < str.length - 1) {
        clearHighlights();
        await expandAroundCenter(i, i + 1, 'between characters');
      }
    }
    
    setPalindromes(foundPalindromes);
    
    // Highlight the longest palindrome
    setChars(prev => prev.map((char, index) => ({
      ...char,
      isMatching: char.index >= longestStart && char.index <= longestEnd,
      isPalindromeCenter: char.index === Math.floor((longestStart + longestEnd) / 2),
    })));
    
    const longestPalindrome = str.substring(longestStart, longestEnd + 1);
    setResult(`Found ${foundPalindromes.length} palindromes. Longest: "${longestPalindrome}" (length ${longestEnd - longestStart + 1})`);
    speakResult(`Found longest palindrome of length ${longestEnd - longestStart + 1}`);
  }, [stringInput, parseString, updatePointers, clearHighlights, step, speakOperation, speakStep, speakResult]);

  // Manacher's Algorithm Approach - Linear time palindrome finding
  const manacherAlgorithmApproach = useCallback(async () => {
    const processedChars = parseString();
    
    speakOperation('Manacher Algorithm', `Using Manacher's algorithm for linear time palindrome detection`);
    
    if (processedChars.length === 0) {
      setResult('Empty string - no palindromes to find');
      return;
    }
    
    const str = processedChars.map(c => c.char).join('');
    
    // Transform string: "abc" -> "^#a#b#c#$"
    const transformed = '^#' + str.split('').join('#') + '#$';
    const n = transformed.length;
    const P = new Array(n).fill(0); // Palindrome lengths array
    let center = 0, right = 0;
    
    speakStep('Transform', `Transformed string: "${transformed}"`, 0, n);
    await sleep(800);
    
    for (let i = 1; i < n - 1; i++) {
      const mirror = 2 * center - i;
      
      setCenterIndex(center);
      updatePointers(mirror, i);
      
      speakStep('Process', `Processing position ${i}, mirror at ${mirror}, center at ${center}`, i, n);
      await sleep(600);
      
      if (right > i) {
        P[i] = Math.min(right - i, P[mirror]);
        speakStep('Use mirror', `Using mirror property: P[${i}] = min(${right - i}, ${P[mirror]}) = ${P[i]}`, i, n);
      }
      
      // Try to expand palindrome centered at i
      let expandLeft = i - (P[i] + 1);
      let expandRight = i + (P[i] + 1);
      
      while (expandLeft >= 0 && expandRight < n && transformed[expandLeft] === transformed[expandRight]) {
        P[i]++;
        expandLeft--;
        expandRight++;
        
        setExpandRadius(P[i]);
        speakStep('Expand', `Expanded palindrome at ${i}, radius now ${P[i]}`, i, n);
        await sleep(400);
      }
      
      // Update center and right boundary if palindrome extends past right
      if (i + P[i] > right) {
        center = i;
        right = i + P[i];
        speakStep('Update center', `New center at ${center}, right boundary at ${right}`, i, n);
      }
      
      setComparisons(prev => prev + 1);
    }
    
    // Find longest palindrome
    let maxLen = 0, centerIndex = 0;
    for (let i = 1; i < n - 1; i++) {
      if (P[i] > maxLen) {
        maxLen = P[i];
        centerIndex = i;
      }
    }
    
    const start = Math.floor((centerIndex - maxLen) / 2);
    const longestPalindrome = str.substring(start, start + maxLen);
    
    // Highlight the longest palindrome
    setChars(prev => prev.map((char, index) => ({
      ...char,
      isMatching: char.index >= start && char.index < start + maxLen,
      isPalindromeCenter: char.index === Math.floor(start + (start + maxLen - 1)) / 2,
    })));
    
    setResult(`Manacher's Algorithm: Longest palindrome "${longestPalindrome}" (length ${maxLen}) found in O(n) time`);
    speakResult(`Found longest palindrome in linear time using Manacher's algorithm`);
  }, [stringInput, parseString, updatePointers, speakOperation, speakStep, speakResult]);



  const runAlgorithm = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setResult('');
    setStep(0);
    setComparisons(0);
    setPalindromes([]);
    clearHighlights();
    
    try {
      if (approach === 'mirror-visualization') {
        await mirrorVisualizationApproach();
      } else if (approach === 'expand-around-center') {
        await expandAroundCenterApproach();
      } else if (approach === 'manacher-algorithm') {
        await manacherAlgorithmApproach();
      }
    } finally {
      setIsRunning(false);
    }
  }, [isRunning, approach, mirrorVisualizationApproach, expandAroundCenterApproach, manacherAlgorithmApproach, clearHighlights]);

  const renderVisualization = () => {
    if (approach === 'mirror-visualization') {
      return (
        <div className="space-y-4">
          {/* Original string */}
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-2">Original String:</div>
            <div className="flex flex-wrap gap-1 justify-center">
              {originalChars.map((char, index) => (
                <div key={index} className="relative">
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded border font-mono text-sm ${
                      char.isIgnored ? 'bg-gray-100 border-gray-300 text-gray-400' : 'bg-white border-gray-400'
                    }`}
                  >
                    {char.originalChar}
                  </div>
                  <div className="text-xs text-center text-muted-foreground mt-1">{index}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Mirror visualization */}
          <div className="text-center relative">
            <div className="text-xs text-muted-foreground mb-2">Mirror Visualization:</div>
            <div className="flex flex-wrap gap-1 justify-center relative">
              {chars.map((char, index) => (
                <div key={char.index} className="relative">
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded border-2 font-mono text-sm transition-all duration-500 ${
                      char.isPalindromeCenter
                        ? 'bg-yellow-200 border-yellow-400 dark:bg-yellow-800 dark:border-yellow-600'
                        : char.isMatching
                        ? 'bg-green-200 border-green-400 dark:bg-green-800 dark:border-green-600'
                        : char.isMismatch
                        ? 'bg-red-200 border-red-400 dark:bg-red-800 dark:border-red-600'
                        : char.isLeftPointer
                        ? 'bg-blue-200 border-blue-400 dark:bg-blue-800 dark:border-blue-600'
                        : char.isRightPointer
                        ? 'bg-purple-200 border-purple-400 dark:bg-purple-800 dark:border-purple-600'
                        : 'bg-white border-gray-300 dark:bg-gray-900 dark:border-gray-600'
                    }`}
                  >
                    {char.char}
                  </div>
                  <div className="text-xs text-center text-muted-foreground mt-1">{char.index}</div>
                  
                  {/* Mirror connection lines */}
                  {char.mirrorIndex !== undefined && char.isMatching && (
                    <svg className="absolute top-0 left-0 pointer-events-none" style={{zIndex: -1}}>
                      <path
                        d={`M 20 20 Q ${(char.mirrorIndex - char.index) * 22} -10 ${(char.mirrorIndex - char.index) * 44} 20`}
                        stroke="#10b981"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray="5,5"
                      />
                    </svg>
                  )}
                  
                  {/* Pointer labels */}
                  {char.isLeftPointer && (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-blue-600">
                      L
                    </div>
                  )}
                  {char.isRightPointer && (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-purple-600">
                      R
                    </div>
                  )}
                </div>
              ))}
              
              {/* Mirror line */}
              {mirrorLine >= 0 && (
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-red-400 opacity-70"
                  style={{left: `${mirrorLine * 44 + 20}px`}}
                />
              )}
            </div>
          </div>
        </div>
      );
    }

    if (approach === 'expand-around-center') {
      return (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-2">Expand Around Center:</div>
            <div className="flex flex-wrap gap-1 justify-center relative">
              {chars.map((char, index) => (
                <div key={char.index} className="relative">
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full border-2 font-mono text-sm transition-all duration-500 ${
                      char.isPalindromeCenter
                        ? 'bg-yellow-300 border-yellow-500 scale-110'
                        : char.isMatching
                        ? 'bg-green-200 border-green-400 dark:bg-green-800 dark:border-green-600'
                        : char.isLeftPointer || char.isRightPointer
                        ? 'bg-blue-200 border-blue-400 dark:bg-blue-800 dark:border-blue-600'
                        : 'bg-white border-gray-300 dark:bg-gray-900 dark:border-gray-600'
                    }`}
                  >
                    {char.char}
                  </div>
                  <div className="text-xs text-center text-muted-foreground mt-1">{char.index}</div>
                  
                  {/* Expansion radius visualization */}
                  {char.isPalindromeCenter && expandRadius > 0 && (
                    <div 
                      className="absolute border-2 border-yellow-400 rounded-full opacity-30"
                      style={{
                        width: `${expandRadius * 88 + 40}px`,
                        height: `${expandRadius * 88 + 40}px`,
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: -1
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {palindromes.length > 0 && (
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-2">Found Palindromes:</div>
              <div className="flex flex-wrap gap-2 justify-center">
                {palindromes.slice(-5).map((pal, index) => (
                  <div key={index} className="px-2 py-1 bg-green-100 rounded text-xs">
                    [{pal.start}, {pal.end}] len:{pal.length}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (approach === 'manacher-algorithm') {
      return (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-2">Manacher's Algorithm (Linear Time):</div>
            <div className="flex flex-wrap gap-1 justify-center">
              {chars.map((char, index) => (
                <div key={char.index} className="relative">
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded border-2 font-mono text-sm transition-all duration-300 ${
                      char.isPalindromeCenter
                        ? 'bg-yellow-200 border-yellow-400 dark:bg-yellow-800 dark:border-yellow-600'
                        : char.isMatching
                        ? 'bg-green-200 border-green-400 dark:bg-green-800 dark:border-green-600'
                        : char.isLeftPointer
                        ? 'bg-blue-200 border-blue-400 dark:bg-blue-800 dark:border-blue-600'
                        : char.isRightPointer
                        ? 'bg-purple-200 border-purple-400 dark:bg-purple-800 dark:border-purple-600'
                        : 'bg-white border-gray-300 dark:bg-gray-900 dark:border-gray-600'
                    }`}
                  >
                    {char.char}
                  </div>
                  <div className="text-xs text-center text-muted-foreground mt-1">{char.index}</div>
                  
                  {/* Center indicator */}
                  {centerIndex === char.index && (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-yellow-600">
                      C
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <div className="flex items-center gap-2">
          <span className="text-sm">String:</span>
          <Input 
            className="w-64" 
            value={stringInput} 
            onChange={(e) => setStringInput(e.target.value)}
            placeholder="A man a plan a canal Panama"
          />
        </div>

        <Select value={approach} onValueChange={(v: 'mirror-visualization' | 'expand-around-center' | 'manacher-algorithm') => setApproach(v)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mirror-visualization">Mirror Visualization</SelectItem>
            <SelectItem value="expand-around-center">Expand Around Center</SelectItem>
            <SelectItem value="manacher-algorithm">Manacher's Algorithm</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="ignoreCase"
            checked={ignoreCase}
            onChange={(e) => setIgnoreCase(e.target.checked)}
          />
          <label htmlFor="ignoreCase" className="text-sm">Ignore Case</label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="ignoreSpaces"
            checked={ignoreSpaces}
            onChange={(e) => setIgnoreSpaces(e.target.checked)}
          />
          <label htmlFor="ignoreSpaces" className="text-sm">Ignore Spaces</label>
        </div>

        <Button onClick={runAlgorithm} disabled={isRunning}>
          {isRunning ? 'Checking...' : 'Check Palindrome'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 p-4 bg-gradient-visualization rounded-xl border-2">
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-sm font-semibold mb-2">
                Palindrome Check - {approach.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Approach
              </h3>
              <div className="text-xs text-muted-foreground mb-4">
                Original: "{stringInput}" → Processed: "{processedString}"
              </div>
              <div className="min-h-[200px] flex items-center justify-center">
                {renderVisualization()}
              </div>
            </div>
            
            {result && (
              <div className="text-center p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <div className="text-sm font-semibold text-green-700 dark:text-green-300">
                  {result}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-muted/20 rounded-xl border">
            <h3 className="text-sm font-semibold mb-2">Algorithm Stats</h3>
            <div className="text-xs space-y-1">
              <div><strong>Approach:</strong> {approach.replace('-', ' ')}</div>
              <div><strong>Comparisons:</strong> {comparisons}</div>
              <div><strong>String Length:</strong> {processedString.length}</div>
              {approach === 'mirror-visualization' && (
                <>
                  <div><strong>Left Pointer:</strong> {leftPointer}</div>
                  <div><strong>Right Pointer:</strong> {rightPointer}</div>
                  <div><strong>Mirror Line:</strong> {mirrorLine}</div>
                </>
              )}
              {approach === 'expand-around-center' && (
                <>
                  <div><strong>Center:</strong> {centerIndex}</div>
                  <div><strong>Expand Radius:</strong> {expandRadius}</div>
                  <div><strong>Palindromes Found:</strong> {palindromes.length}</div>
                </>
              )}
              {approach === 'manacher-algorithm' && (
                <>
                  <div><strong>Center:</strong> {centerIndex}</div>
                  <div><strong>Processing:</strong> Linear scan</div>
                </>
              )}
            </div>
          </div>
          
          <div className="p-4 bg-muted/20 rounded-xl border">
            <h3 className="text-sm font-semibold mb-2">Complexity</h3>
            <div className="text-xs space-y-1">
              {approach === 'mirror-visualization' && (
                <>
                  <div><strong>Time:</strong> O(n)</div>
                  <div><strong>Space:</strong> O(1)</div>
                  <div><strong>Note:</strong> Visual mirror reflection</div>
                </>
              )}
              {approach === 'expand-around-center' && (
                <>
                  <div><strong>Time:</strong> O(n²)</div>
                  <div><strong>Space:</strong> O(1)</div>
                  <div><strong>Note:</strong> Finds all palindromes</div>
                </>
              )}
              {approach === 'manacher-algorithm' && (
                <>
                  <div><strong>Time:</strong> O(n)</div>
                  <div><strong>Space:</strong> O(n)</div>
                  <div><strong>Note:</strong> Linear time, optimal</div>
                </>
              )}
            </div>
          </div>
          
          <div className="p-4 bg-muted/20 rounded-xl border">
            <h3 className="text-sm font-semibold mb-2">Legend</h3>
            <div className="text-xs space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-yellow-300"></div>
                <span>Palindrome Center</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-300"></div>
                <span>Matching Characters</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-300"></div>
                <span>Current Pointers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-300"></div>
                <span>Mismatched</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-gray-300"></div>
                <span>Ignored Characters</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <VisualizerControls
          showMemory={showMemory}
          onToggleMemory={setShowMemory}
          voiceEnabled={voiceEnabled}
          onToggleVoice={setVoiceEnabled}
        />
      </div>

      {showMemory && (
        <MemoryLayout
          data={chars}
          title="String Memory Layout"
          baseAddress={20000}
          wordSize={1}
        />
      )}

      <div className="bg-muted/20 rounded-lg p-4 text-sm space-y-2">
        <div className="font-semibold text-primary">Palindrome Check Problem:</div>
        <div>• <strong>Problem:</strong> Determine if a string reads the same forwards and backwards</div>
        <div>• <strong>Mirror Visualization:</strong> Shows palindrome as perfect mirror reflection - O(n) time, O(1) space</div>
        <div>• <strong>Expand Around Center:</strong> Finds all palindromes by expanding from each center - O(n²) time, O(1) space</div>
        <div>• <strong>Manacher's Algorithm:</strong> Linear time algorithm using preprocessing - O(n) time, O(n) space</div>
        <div>• <strong>Applications:</strong> Text processing, DNA analysis, longest palindromic substring, data validation</div>
      </div>
    </div>
  );
}