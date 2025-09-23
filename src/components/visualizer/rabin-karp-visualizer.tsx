import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';
import { toast } from 'sonner';

export function RabinKarpVisualizer() {
  const [text, setText] = useState('ABAAABCDABABCABCABCDAB');
  const [pattern, setPattern] = useState('ABCAB');
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(-1);
  const [patternHash, setPatternHash] = useState(0);
  const [currentHash, setCurrentHash] = useState(0);
  const [matches, setMatches] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState('');
  const [showMemory, setShowMemory] = useState(false);
  const [hashCalculations, setHashCalculations] = useState<{pos: number, hash: number, isMatch: boolean}[]>([]);
  
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

  const BASE = 256;
  const PRIME = 101;

  const calculateHash = (str: string, length: number) => {
    let hash = 0;
    for (let i = 0; i < length; i++) {
      hash = (hash * BASE + str.charCodeAt(i)) % PRIME;
    }
    return hash;
  };

  const calculateRollingHash = (oldHash: number, oldChar: string, newChar: string, patternLength: number) => {
    let pow = 1;
    for (let i = 0; i < patternLength - 1; i++) {
      pow = (pow * BASE) % PRIME;
    }
    
    let newHash = oldHash - (oldChar.charCodeAt(0) * pow) % PRIME;
    newHash = (newHash * BASE + newChar.charCodeAt(0)) % PRIME;
    
    if (newHash < 0) {
      newHash += PRIME;
    }
    
    return newHash;
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const runRabinKarp = useCallback(async () => {
    if (!text || !pattern) {
      toast.error('Please enter both text and pattern');
      return;
    }

    if (pattern.length > text.length) {
      toast.error('Pattern cannot be longer than text');
      return;
    }

    setIsAnimating(true);
    setMatches([]);
    setHashCalculations([]);
    setCurrentPosition(-1);
    
    speakOperation("Rabin-Karp Algorithm", `Starting Rabin-Karp string matching algorithm. We'll use rolling hash to efficiently find pattern "${pattern}" in text "${text}".`);
    
    const patternLen = pattern.length;
    const textLen = text.length;
    
    // Calculate pattern hash
    const pHash = calculateHash(pattern, patternLen);
    setPatternHash(pHash);
    setCurrentStep(`Calculated pattern hash: ${pHash}`);
    speakStep("", `First, calculating hash for pattern "${pattern}". Pattern hash is ${pHash}.`, 1, textLen - patternLen + 2);
    await sleep(1000);

    // Calculate initial window hash
    let textHash = calculateHash(text, patternLen);
    setCurrentHash(textHash);
    setCurrentPosition(0);
    
    const calculations: {pos: number, hash: number, isMatch: boolean}[] = [];
    const foundMatches: number[] = [];

    // Check first window
    setCurrentStep(`Checking first window: "${text.substring(0, patternLen)}" with hash ${textHash}`);
    speakStep("", `Checking first window at position 0. Text hash is ${textHash}, pattern hash is ${pHash}.`, 2, textLen - patternLen + 2);
    await sleep(800);

    if (pHash === textHash && text.substring(0, patternLen) === pattern) {
      foundMatches.push(0);
      calculations.push({pos: 0, hash: textHash, isMatch: true});
      setCurrentStep(`Match found at position 0!`);
      speakStep("", `Hash match! Verifying character by character... Match confirmed at position 0!`, 2, textLen - patternLen + 2);
      toast.success('Match found at position 0');
    } else {
      calculations.push({pos: 0, hash: textHash, isMatch: false});
      if (pHash === textHash) {
        setCurrentStep(`Hash collision at position 0 - not a real match`);
        speakStep("", `Hash collision detected! Hashes match but strings don't. This is why we verify character by character.`, 2, textLen - patternLen + 2);
      } else {
        setCurrentStep(`No match at position 0`);
        speakStep("", `No hash match at position 0. Moving to next position.`, 2, textLen - patternLen + 2);
      }
    }
    
    setMatches([...foundMatches]);
    setHashCalculations([...calculations]);
    await sleep(1000);

    // Roll through remaining positions
    for (let i = 1; i <= textLen - patternLen; i++) {
      setCurrentPosition(i);
      
      // Calculate rolling hash
      const oldChar = text[i - 1];
      const newChar = text[i + patternLen - 1];
      textHash = calculateRollingHash(textHash, oldChar, newChar, patternLen);
      setCurrentHash(textHash);
      
      setCurrentStep(`Rolling hash at position ${i}: removed '${oldChar}', added '${newChar}', new hash: ${textHash}`);
      speakStep("", `Rolling hash to position ${i}. Removed '${oldChar}', added '${newChar}'. New hash is ${textHash}.`, i + 2, textLen - patternLen + 2);
      await sleep(800);

      // Check for match
      if (pHash === textHash) {
        const substring = text.substring(i, i + patternLen);
        if (substring === pattern) {
          foundMatches.push(i);
          calculations.push({pos: i, hash: textHash, isMatch: true});
          setCurrentStep(`Match found at position ${i}!`);
          speakStep("", `Hash match at position ${i}! Verifying character by character... Match confirmed!`, i + 2, textLen - patternLen + 2);
          toast.success(`Match found at position ${i}`);
        } else {
          calculations.push({pos: i, hash: textHash, isMatch: false});
          setCurrentStep(`Hash collision at position ${i} - not a real match`);
          speakStep("", `Hash collision at position ${i}! Hashes match but strings don't match.`, i + 2, textLen - patternLen + 2);
        }
      } else {
        calculations.push({pos: i, hash: textHash, isMatch: false});
        setCurrentStep(`No match at position ${i}`);
        speakStep("", `No hash match at position ${i}. Continuing search.`, i + 2, textLen - patternLen + 2);
      }
      
      setMatches([...foundMatches]);
      setHashCalculations([...calculations]);
      await sleep(600);
    }

    setCurrentStep(`Search complete. Found ${foundMatches.length} match(es) at positions: ${foundMatches.join(', ')}`);
    speakResult(`Rabin-Karp search completed! Found ${foundMatches.length} matches at positions: ${foundMatches.join(', ')}.`);
    
    setCurrentPosition(-1);
    setIsAnimating(false);
  }, [text, pattern, speakOperation, speakStep, speakResult]);

  const reset = () => {
    setMatches([]);
    setHashCalculations([]);
    setCurrentPosition(-1);
    setCurrentStep('');
    setPatternHash(0);
    setCurrentHash(0);
    setIsAnimating(false);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Rabin-Karp String Matching</h2>
        <p className="text-muted-foreground">
          Efficient string matching using rolling hash technique
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Text:</span>
          <Input 
            className="w-80" 
            value={text} 
            onChange={e => setText(e.target.value)} 
            placeholder="Enter text to search in"
            disabled={isAnimating}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Pattern:</span>
          <Input 
            className="w-32" 
            value={pattern} 
            onChange={e => setPattern(e.target.value)} 
            placeholder="Pattern"
            disabled={isAnimating}
          />
        </div>
        <Button onClick={runRabinKarp} disabled={isAnimating}>
          {isAnimating ? 'Searching...' : 'Start Search'}
        </Button>
        <Button onClick={reset} variant="outline" disabled={isAnimating}>
          Reset
        </Button>
      </div>

      {/* Current Step Display */}
      {currentStep && (
        <div className="p-4 bg-muted/20 rounded-lg border">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Step</Badge>
            <span className="text-sm font-medium">{currentStep}</span>
          </div>
        </div>
      )}

      {/* Hash Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-2">Hash Values:</h4>
          <div className="space-y-2 text-sm">
            <div><strong>Pattern Hash:</strong> {patternHash}</div>
            <div><strong>Current Window Hash:</strong> {currentHash}</div>
            <div><strong>Base:</strong> {BASE} (ASCII range)</div>
            <div><strong>Prime:</strong> {PRIME} (for modular arithmetic)</div>
          </div>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-2">Search Progress:</h4>
          <div className="space-y-2 text-sm">
            <div><strong>Current Position:</strong> {currentPosition >= 0 ? currentPosition : 'Not started'}</div>
            <div><strong>Matches Found:</strong> {matches.length}</div>
            <div><strong>Hash Calculations:</strong> {hashCalculations.length}</div>
            <div><strong>Pattern Length:</strong> {pattern.length}</div>
          </div>
        </div>
      </div>

      {/* Text Visualization */}
      <div className="p-6 bg-gradient-visualization rounded-xl border-2 border-primary/20">
        <h4 className="text-lg font-semibold mb-4 text-center">String Matching Visualization</h4>
        
        <div className="space-y-4">
          {/* Pattern Display */}
          <div>
            <div className="text-sm font-medium mb-2">Pattern: "{pattern}"</div>
            <div className="flex gap-1">
              {pattern.split('').map((char, i) => (
                <div key={i} className="w-8 h-8 border-2 border-primary bg-primary/20 rounded flex items-center justify-center font-mono text-sm">
                  {char}
                </div>
              ))}
            </div>
          </div>

          {/* Text Display */}
          <div>
            <div className="text-sm font-medium mb-2">Text:</div>
            <div className="flex gap-1 flex-wrap">
              {text.split('').map((char, i) => {
                const isInCurrentWindow = currentPosition >= 0 && i >= currentPosition && i < currentPosition + pattern.length;
                const isMatch = matches.some(pos => i >= pos && i < pos + pattern.length);
                const isCurrentPos = i === currentPosition;
                
                return (
                  <div 
                    key={i} 
                    className={`w-8 h-8 border-2 rounded flex items-center justify-center font-mono text-sm transition-all duration-300 ${
                      isMatch 
                        ? 'border-green-500 bg-green-100 text-green-800' 
                        : isInCurrentWindow 
                          ? 'border-blue-500 bg-blue-100 text-blue-800' 
                          : 'border-gray-300 bg-white'
                    } ${isCurrentPos ? 'ring-2 ring-primary' : ''}`}
                  >
                    {char}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hash Calculations Display */}
          {hashCalculations.length > 0 && (
            <div>
              <div className="text-sm font-medium mb-2">Hash Calculations:</div>
              <div className="flex gap-2 flex-wrap">
                {hashCalculations.map((calc, i) => (
                  <div 
                    key={i} 
                    className={`px-2 py-1 rounded text-xs border ${
                      calc.isMatch 
                        ? 'bg-green-100 border-green-500 text-green-800' 
                        : 'bg-gray-100 border-gray-300'
                    }`}
                  >
                    Pos {calc.pos}: {calc.hash}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Algorithm Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-2">How Rabin-Karp Works:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>Calculate hash value for the pattern</li>
            <li>Calculate hash for first window of text</li>
            <li>Compare hashes - if equal, verify character by character</li>
            <li>Use rolling hash to efficiently move to next position</li>
            <li>Rolling hash removes first character and adds next character</li>
            <li>Continue until end of text is reached</li>
          </ul>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-2">Complexity Analysis:</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div><strong>Average Case:</strong> O(n + m) - very efficient</div>
            <div><strong>Worst Case:</strong> O(nm) - many hash collisions</div>
            <div><strong>Space:</strong> O(1) - constant extra space</div>
            <div><strong>Rolling Hash:</strong> O(1) per position</div>
            <div><strong>Applications:</strong> Text search, plagiarism detection, DNA analysis</div>
          </div>
        </div>
      </div>

      {/* Memory Layout */}
      {showMemory && (
        <MemoryLayout
          title="Rabin-Karp Memory Layout"
          data={[patternHash, currentHash, ...hashCalculations.slice(0, 8).map(h => h.hash)]}
          baseAddress={0xC000}
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
