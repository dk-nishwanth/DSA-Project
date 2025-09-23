import React, { useState, useCallback, useEffect } from 'react';
import { Play, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { PseudocodeBox } from '@/components/pseudocode-box';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

export function PalindromeVisualizer() {
  const [text, setText] = useState('racecar');
  const [isAnimating, setIsAnimating] = useState(false);
  const [leftPointer, setLeftPointer] = useState(-1);
  const [rightPointer, setRightPointer] = useState(-1);
  const [comparedPairs, setComparedPairs] = useState<{left: number, right: number, match: boolean}[]>([]);
  const [result, setResult] = useState<boolean | null>(null);
  const [currentStep, setCurrentStep] = useState('');
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

  const checkPalindrome = useCallback(async () => {
    if (!text.trim()) {
      toast.error('Please enter some text');
      return;
    }

    setIsAnimating(true);
    setLeftPointer(-1);
    setRightPointer(-1);
    setComparedPairs([]);
    setResult(null);
    setCurrentStep('Starting palindrome check...');
    
    const cleanText = text.toLowerCase().replace(/[^a-z0-9]/g, '');
    speakOperation("Palindrome Check", `Starting palindrome check for "${text}". Using two pointers technique - one from start and one from end, comparing characters as they move toward center.`);
    
    let left = 0;
    let right = cleanText.length - 1;
    let isPalindrome = true;
    const pairs: {left: number, right: number, match: boolean}[] = [];

    await sleep(500);

    while (left < right) {
      setLeftPointer(left);
      setRightPointer(right);
      setCurrentStep(`Comparing characters at positions ${left} and ${right}: '${cleanText[left]}' vs '${cleanText[right]}'`);
      speakStep("", `Comparing characters at positions ${left} and ${right}: '${cleanText[left]}' versus '${cleanText[right]}'`, left + 1, Math.ceil(cleanText.length / 2));
      
      await sleep(800);

      const match = cleanText[left] === cleanText[right];
      pairs.push({ left, right, match });
      setComparedPairs([...pairs]);

      if (!match) {
        isPalindrome = false;
        setCurrentStep(`Characters don't match! '${cleanText[left]}' ≠ '${cleanText[right]}' - Not a palindrome`);
        speakStep("", `Characters don't match! '${cleanText[left]}' is not equal to '${cleanText[right]}'. This means the text is not a palindrome.`, left + 1, Math.ceil(cleanText.length / 2));
        await sleep(1000);
        break;
      } else {
        setCurrentStep(`Characters match! '${cleanText[left]}' = '${cleanText[right]}' - Continue checking`);
        speakStep("", `Characters match! '${cleanText[left]}' equals '${cleanText[right]}'. Moving pointers closer to center.`, left + 1, Math.ceil(cleanText.length / 2));
        await sleep(600);
      }

      left++;
      right--;
    }

    if (isPalindrome && left >= right) {
      setCurrentStep('All characters match! This is a palindrome.');
    }

    setResult(isPalindrome);
    setLeftPointer(-1);
    setRightPointer(-1);
    setIsAnimating(false);
    
    toast.success(isPalindrome ? 'It\'s a palindrome!' : 'Not a palindrome');
  }, [text]);

  const pseudocode = [
    'clean = toLowerCase(removeNonAlnum(text))',
    'left = 0; right = clean.length - 1',
    'while left < right:',
    "  if clean[left] != clean[right]: return false",
    '  left++; right--',
    'return true'
  ];

  const resetCheck = useCallback(() => {
    setLeftPointer(-1);
    setRightPointer(-1);
    setComparedPairs([]);
    setResult(null);
    setCurrentStep('');
    setIsAnimating(false);
    toast.success('Check reset');
  }, []);

  const renderText = useCallback(() => {
    const cleanText = text.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    return cleanText.split('').map((char, index) => {
      const isLeftPointer = index === leftPointer;
      const isRightPointer = index === rightPointer;
      const comparedPair = comparedPairs.find(pair => pair.left === index || pair.right === index);
      
      let bgColor = 'bg-card';
      let textColor = 'text-card-foreground';
      
      if (isLeftPointer || isRightPointer) {
        bgColor = 'bg-primary';
        textColor = 'text-primary-foreground';
      } else if (comparedPair) {
        bgColor = comparedPair.match ? 'bg-success/20 border-success' : 'bg-destructive/20 border-destructive';
        textColor = comparedPair.match ? 'text-success' : 'text-destructive';
      }

      return (
        <div
          key={index}
          className={`
            w-10 h-10 flex items-center justify-center border-2 border-border
            font-mono text-lg font-bold rounded-lg transition-all duration-300
            ${bgColor} ${textColor}
            ${(isLeftPointer || isRightPointer) ? 'animate-pulse scale-110' : ''}
          `}
        >
          {char.toUpperCase()}
        </div>
      );
    });
  }, [text, leftPointer, rightPointer, comparedPairs]);

  const renderOriginalText = useCallback(() => {
    return text.split('').map((char, index) => {
      const isSpace = char === ' ';
      const isPunctuation = /[^a-z0-9]/i.test(char);
      
      return (
        <span
          key={index}
          className={`
            inline-block text-lg font-mono
            ${isSpace ? 'w-2' : isPunctuation ? 'text-muted-foreground' : 'text-foreground'}
          `}
        >
          {char}
        </span>
      );
    });
  }, [text]);

  return (
    <div className="w-full space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to check for palindrome"
          className="flex-1 min-w-64"
          disabled={isAnimating}
        />

        <Button onClick={checkPalindrome} disabled={isAnimating} className="flex items-center gap-1">
          <Play className="h-4 w-4" />
          Check Palindrome
        </Button>

        <Button onClick={resetCheck} disabled={isAnimating} variant="outline" className="flex items-center gap-1">
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>

        <div className="flex items-center gap-2 ml-auto">
          <label className="text-sm">Voice Explain</label>
          <input type="checkbox" checked={voiceEnabled} onChange={(e)=>setVoiceEnabled(e.target.checked)} />
        </div>
      </div>

      {/* Result Display */}
      {result !== null && (
        <div className={`p-4 rounded-xl border-2 flex items-center justify-center gap-2 ${
          result 
            ? 'bg-success/10 border-success text-success' 
            : 'bg-destructive/10 border-destructive text-destructive'
        }`}>
          {result ? <CheckCircle className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
          <span className="text-lg font-semibold">
            {result ? 'This is a palindrome!' : 'This is not a palindrome'}
          </span>
        </div>
      )}

      {/* Visualization */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 rounded-xl border-2 border-border/50 p-4">
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-3">Original Text</h3>
            <div className="p-3 bg-muted/20 rounded-lg">
              {renderOriginalText()}
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-semibold mb-3">Cleaned Text (Palindrome Check)</h3>
            <div className="flex justify-center gap-1 flex-wrap">
              {renderText()}
            </div>
          </div>

          {leftPointer >= 0 && rightPointer >= 0 && (
            <div className="text-center">
              <div className="flex justify-center gap-8 items-center">
                <div className="text-sm">
                  <span className="font-medium">Left Pointer: </span>
                  <span className="text-primary font-bold">{leftPointer}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Right Pointer: </span>
                  <span className="text-primary font-bold">{rightPointer}</span>
                </div>
              </div>
            </div>
          )}

          {currentStep && (
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <p className="text-sm font-medium">{currentStep}</p>
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
          title="String Memory Layout"
          baseAddress={2000}
          wordSize={1}
        />
      )}

      {/* Pseudocode */}
      <PseudocodeBox title="Palindrome Check - Two Pointers" code={pseudocode} highlightedLine={
        currentStep.includes('Starting') ? 1 :
        currentStep.includes('Comparing') ? 3 :
        currentStep.includes("don't match") ? 4 :
        currentStep.includes('Continue checking') ? 5 :
        currentStep.includes('All characters') ? 6 : 0
      } />

      {/* Key Points */}
      <div className="bg-muted/20 rounded-lg p-4">
        <h4 className="font-semibold mb-2">Key Points</h4>
        <ul className="text-sm space-y-1">
          <li>• <strong>Preprocessing:</strong> Remove spaces, punctuation, convert to lowercase</li>
          <li>• <strong>Two Pointers:</strong> Start from both ends, move toward center</li>
          <li>• <strong>Applications:</strong> Data validation, string processing</li>
          <li>• <strong>Real World:</strong> DNA sequences, word games, data integrity</li>
        </ul>
      </div>
    </div>
  );
}