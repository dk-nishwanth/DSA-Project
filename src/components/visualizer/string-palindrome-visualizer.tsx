import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, X, ArrowLeft, ArrowRight, RotateCcw, Type } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

interface PalindromeStep {
  step: number;
  operation: string;
  left: number;
  right: number;
  leftChar: string;
  rightChar: string;
  match: boolean;
  description: string;
  isPalindrome?: boolean;
}

export function StringPalindromeVisualizer() {
  const [algorithm, setAlgorithm] = useState('two-pointers');
  const [inputString, setInputString] = useState('racecar');
  const [steps, setSteps] = useState<PalindromeStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<boolean | null>(null);
  const [showMemory, setShowMemory] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const {
    voiceEnabled,
    setVoiceEnabled,
    speed,
    setSpeed,
    isSpeaking,
    pauseSpeech,
    resumeSpeech,
    stopSpeech,
    speakOperation,
    speakStep,
    speakResult,
  } = useVisualizerVoice({ minInterval: 1500 });

  const algorithms = [
    { value: 'two-pointers', label: 'Two Pointers Approach' },
    { value: 'reverse-compare', label: 'Reverse and Compare' },
    { value: 'recursive', label: 'Recursive Approach' },
    { value: 'expand-center', label: 'Expand Around Center' }
  ];

  const generateTwoPointersSteps = (str: string): PalindromeStep[] => {
    const steps: PalindromeStep[] = [];
    let stepNum = 0;
    let left = 0;
    let right = str.length - 1;

    steps.push({
      step: stepNum++,
      operation: 'Initialize',
      left,
      right,
      leftChar: str[left],
      rightChar: str[right],
      match: true,
      description: `Initialize pointers: left=0, right=${right}`,
    });

    while (left < right) {
      const leftChar = str[left].toLowerCase();
      const rightChar = str[right].toLowerCase();
      const match = leftChar === rightChar;

      steps.push({
        step: stepNum++,
        operation: 'Compare',
        left,
        right,
        leftChar: str[left],
        rightChar: str[right],
        match,
        description: `Compare '${str[left]}' at index ${left} with '${str[right]}' at index ${right}: ${match ? 'Match ✓' : 'No match ✗'}`,
      });

      if (!match) {
        steps.push({
          step: stepNum++,
          operation: 'Result',
          left,
          right,
          leftChar: str[left],
          rightChar: str[right],
          match: false,
          isPalindrome: false,
          description: `Not a palindrome - characters don't match`,
        });
        return steps;
      }

      left++;
      right--;

      if (left < right) {
        steps.push({
          step: stepNum++,
          operation: 'Move Pointers',
          left,
          right,
          leftChar: str[left],
          rightChar: str[right],
          match: true,
          description: `Move pointers inward: left=${left}, right=${right}`,
        });
      }
    }

    steps.push({
      step: stepNum++,
      operation: 'Result',
      left,
      right,
      leftChar: left < str.length ? str[left] : '',
      rightChar: right >= 0 ? str[right] : '',
      match: true,
      isPalindrome: true,
      description: `Palindrome confirmed - all characters match!`,
    });

    return steps;
  };

  const generateReverseCompareSteps = (str: string): PalindromeStep[] => {
    const steps: PalindromeStep[] = [];
    let stepNum = 0;
    const reversed = str.split('').reverse().join('');

    steps.push({
      step: stepNum++,
      operation: 'Original',
      left: 0,
      right: str.length - 1,
      leftChar: str,
      rightChar: '',
      match: true,
      description: `Original string: "${str}"`,
    });

    steps.push({
      step: stepNum++,
      operation: 'Reverse',
      left: 0,
      right: str.length - 1,
      leftChar: str,
      rightChar: reversed,
      match: true,
      description: `Reversed string: "${reversed}"`,
    });

    const isPalindrome = str.toLowerCase() === reversed.toLowerCase();
    steps.push({
      step: stepNum++,
      operation: 'Compare',
      left: 0,
      right: str.length - 1,
      leftChar: str,
      rightChar: reversed,
      match: isPalindrome,
      isPalindrome,
      description: `Compare strings: "${str}" ${isPalindrome ? '==' : '!='} "${reversed}"`,
    });

    return steps;
  };

  const generateRecursiveSteps = (str: string): PalindromeStep[] => {
    const steps: PalindromeStep[] = [];
    let stepNum = 0;

    const recursiveCheck = (s: string, left: number, right: number): boolean => {
      if (left >= right) {
        steps.push({
          step: stepNum++,
          operation: 'Base Case',
          left,
          right,
          leftChar: left < s.length ? s[left] : '',
          rightChar: right >= 0 ? s[right] : '',
          match: true,
          description: `Base case reached: left(${left}) >= right(${right})`,
        });
        return true;
      }

      const leftChar = s[left].toLowerCase();
      const rightChar = s[right].toLowerCase();
      const match = leftChar === rightChar;

      steps.push({
        step: stepNum++,
        operation: 'Recursive Call',
        left,
        right,
        leftChar: s[left],
        rightChar: s[right],
        match,
        description: `Recursive call: compare '${s[left]}' and '${s[right]}' - ${match ? 'Match' : 'No match'}`,
      });

      if (!match) {
        return false;
      }

      return recursiveCheck(s, left + 1, right - 1);
    };

    const isPalindrome = recursiveCheck(str, 0, str.length - 1);

    steps.push({
      step: stepNum++,
      operation: 'Result',
      left: 0,
      right: str.length - 1,
      leftChar: str[0],
      rightChar: str[str.length - 1],
      match: isPalindrome,
      isPalindrome,
      description: `Final result: ${isPalindrome ? 'Palindrome' : 'Not a palindrome'}`,
    });

    return steps;
  };

  const generateExpandCenterSteps = (str: string): PalindromeStep[] => {
    const steps: PalindromeStep[] = [];
    let stepNum = 0;
    const n = str.length;

    // Check for odd length palindrome (single center)
    const center = Math.floor(n / 2);
    let left = center;
    let right = center;

    steps.push({
      step: stepNum++,
      operation: 'Initialize Center',
      left,
      right,
      leftChar: str[left],
      rightChar: str[right],
      match: true,
      description: `Start from center at index ${center}`,
    });

    while (left >= 0 && right < n) {
      const leftChar = str[left].toLowerCase();
      const rightChar = str[right].toLowerCase();
      const match = leftChar === rightChar;

      steps.push({
        step: stepNum++,
        operation: 'Expand',
        left,
        right,
        leftChar: str[left],
        rightChar: str[right],
        match,
        description: `Expand: compare '${str[left]}' at ${left} with '${str[right]}' at ${right} - ${match ? 'Match' : 'No match'}`,
      });

      if (!match) {
        break;
      }

      left--;
      right++;
    }

    const isPalindrome = left < 0 && right >= n;
    steps.push({
      step: stepNum++,
      operation: 'Result',
      left: Math.max(0, left + 1),
      right: Math.min(n - 1, right - 1),
      leftChar: '',
      rightChar: '',
      match: isPalindrome,
      isPalindrome,
      description: `${isPalindrome ? 'Entire string is palindrome' : 'Not a complete palindrome'}`,
    });

    return steps;
  };

  const runAlgorithm = () => {
    setIsAnimating(true);
    speakOperation('Palindrome Check', `Running ${algorithms.find(a=>a.value===algorithm)?.label || 'algorithm'}.`);
    
    let newSteps: PalindromeStep[] = [];
    let isPalindrome = false;

    switch (algorithm) {
      case 'two-pointers':
        newSteps = generateTwoPointersSteps(inputString);
        isPalindrome = checkPalindromeTwoPointers(inputString);
        break;
      case 'reverse-compare':
        newSteps = generateReverseCompareSteps(inputString);
        isPalindrome = inputString.toLowerCase() === inputString.split('').reverse().join('').toLowerCase();
        break;
      case 'recursive':
        newSteps = generateRecursiveSteps(inputString);
        isPalindrome = checkPalindromeRecursive(inputString, 0, inputString.length - 1);
        break;
      case 'expand-center':
        newSteps = generateExpandCenterSteps(inputString);
        isPalindrome = checkPalindromeExpandCenter(inputString);
        break;
    }

    setSteps(newSteps);
    setResult(isPalindrome);
    setCurrentStep(0);
    
    setTimeout(() => setIsAnimating(false), 1000);
    speakResult(`String "${inputString}" is ${isPalindrome ? '' : 'not '}a palindrome.`);
  };

  const checkPalindromeTwoPointers = (str: string): boolean => {
    let left = 0, right = str.length - 1;
    while (left < right) {
      if (str[left].toLowerCase() !== str[right].toLowerCase()) return false;
      left++;
      right--;
    }
    return true;
  };

  const checkPalindromeRecursive = (str: string, left: number, right: number): boolean => {
    if (left >= right) return true;
    if (str[left].toLowerCase() !== str[right].toLowerCase()) return false;
    return checkPalindromeRecursive(str, left + 1, right - 1);
  };

  const checkPalindromeExpandCenter = (str: string): boolean => {
    const n = str.length;
    const center = Math.floor(n / 2);
    let left = center, right = center;
    
    while (left >= 0 && right < n && str[left].toLowerCase() === str[right].toLowerCase()) {
      left--;
      right++;
    }
    
    return left < 0 && right >= n;
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      if (steps[newStep]) {
        speakStep(`Step ${newStep + 1}`, steps[newStep].description, newStep, steps.length);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const reset = () => {
    setSteps([]);
    setCurrentStep(0);
    setResult(null);
    setIsAnimating(false);
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Algorithm</label>
          <Select value={algorithm} onValueChange={setAlgorithm}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {algorithms.map(alg => (
                <SelectItem key={alg.value} value={alg.value}>
                  {alg.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Input String</label>
          <Input
            value={inputString}
            onChange={(e) => setInputString(e.target.value)}
            placeholder="Enter string to check"
          />
        </div>

        <div className="flex gap-2 items-end">
          <Button onClick={runAlgorithm} className="flex items-center gap-2" disabled={isAnimating}>
            <Type className="h-4 w-4" />
            {isAnimating ? 'Checking...' : 'Check'}
          </Button>
          <Button onClick={reset} variant="outline">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* String Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            String Visualization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* String Display */}
            <div className="flex flex-wrap gap-1 justify-center">
              {inputString.split('').map((char, index) => {
                const isLeft = currentStepData?.left === index;
                const isRight = currentStepData?.right === index;
                const isActive = isLeft || isRight;
                
                return (
                  <motion.div
                    key={index}
                    className={`relative flex flex-col items-center p-3 border-2 rounded-lg min-w-[50px] ${
                      isLeft ? 'border-blue-500 bg-blue-100 dark:bg-blue-900' :
                      isRight ? 'border-green-500 bg-green-100 dark:bg-green-900' :
                      'border-gray-300 bg-white dark:bg-gray-800'
                    }`}
                    initial={{ scale: 1 }}
                    animate={{ 
                      scale: isActive ? 1.1 : 1,
                      y: isActive ? -5 : 0
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-xs text-muted-foreground mb-1">
                      {index}
                    </div>
                    <div className="text-lg font-bold">
                      {char}
                    </div>
                    {isLeft && (
                      <motion.div
                        className="absolute -top-8 left-1/2 transform -translate-x-1/2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <ArrowLeft className="h-4 w-4 text-blue-500" />
                      </motion.div>
                    )}
                    {isRight && (
                      <motion.div
                        className="absolute -top-8 left-1/2 transform -translate-x-1/2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <ArrowRight className="h-4 w-4 text-green-500" />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Pointer Legend */}
            <div className="flex justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4 text-blue-500" />
                <span>Left Pointer</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-green-500" />
                <span>Right Pointer</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Navigation */}
      {steps.length > 0 && (
        <div className="flex items-center justify-center gap-4">
          <Button onClick={prevStep} disabled={currentStep === 0} variant="outline">
            Previous
          </Button>
          <Badge variant="secondary">
            Step {currentStep + 1} of {steps.length}
          </Badge>
          <Button onClick={nextStep} disabled={currentStep === steps.length - 1} variant="outline">
            Next
          </Button>
        </div>
      )}

      {/* Current Step Display */}
      <AnimatePresence mode="wait">
        {currentStepData && (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={`border-2 ${
              currentStepData.match ? 'border-green-500' : 'border-red-500'
            }`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {currentStepData.match ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                  {currentStepData.operation}
                  <Badge variant="outline">Step {currentStep + 1}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg mb-4">{currentStepData.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded">
                    <div className="text-sm text-muted-foreground">Left Index</div>
                    <div className="text-xl font-bold">{currentStepData.left}</div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950 p-3 rounded">
                    <div className="text-sm text-muted-foreground">Right Index</div>
                    <div className="text-xl font-bold">{currentStepData.right}</div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-950 p-3 rounded">
                    <div className="text-sm text-muted-foreground">Left Char</div>
                    <div className="text-xl font-bold">'{currentStepData.leftChar}'</div>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-950 p-3 rounded">
                    <div className="text-sm text-muted-foreground">Right Char</div>
                    <div className="text-xl font-bold">'{currentStepData.rightChar}'</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Final Result */}
      {result !== null && (
        <Card className={`border-2 ${result ? 'border-green-500' : 'border-red-500'}`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${
              result ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
            }`}>
              {result ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <X className="h-5 w-5" />
              )}
              Final Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className={`text-3xl font-bold ${
                result ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {result ? 'PALINDROME' : 'NOT PALINDROME'}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                "{inputString}" {result ? 'reads the same forwards and backwards' : 'does not read the same forwards and backwards'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Controls */}
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

      {/* Memory Layout */}
      {showMemory && (
        <MemoryLayout
          title="String Memory Layout"
          data={inputString.split('').map(char => char.charCodeAt(0))}
          baseAddress={0x2000}
          wordSize={1}
        />
      )}

      {/* Educational Information */}
      <Card>
        <CardHeader>
          <CardTitle>Palindrome Check Algorithms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Algorithm Comparison:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Two Pointers: O(n) time, O(1) space</li>
                <li>• Reverse Compare: O(n) time, O(n) space</li>
                <li>• Recursive: O(n) time, O(n) space (stack)</li>
                <li>• Expand Center: O(n) time, O(1) space</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Applications:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• DNA sequence analysis</li>
                <li>• Text processing and validation</li>
                <li>• Longest palindromic substring</li>
                <li>• Data structure validation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}