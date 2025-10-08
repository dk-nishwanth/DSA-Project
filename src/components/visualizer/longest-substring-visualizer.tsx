import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Type, RotateCcw, Hash } from 'lucide-react';
import { motion } from 'framer-motion';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';
import { toast } from 'sonner';

interface SubstringStep {
  string: string;
  left: number;
  right: number;
  currentSubstring: string;
  maxLength: number;
  maxSubstring: string;
  charMap: Record<string, number>;
  message: string;
  operation: 'init' | 'expand' | 'shrink' | 'found' | 'complete';
  duplicateChar?: string;
}

export function LongestSubstringVisualizer() {
  const [inputString, setInputString] = useState('abcabcbb');
  const [steps, setSteps] = useState<SubstringStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
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
    speakStep
  } = useVisualizerVoice({ minInterval: 2000 });

  const generateLongestSubstringSteps = (s: string): SubstringStep[] => {
    const steps: SubstringStep[] = [];
    const charMap: Record<string, number> = {};
    let left = 0;
    let maxLength = 0;
    let maxSubstring = '';

    steps.push({
      string: s,
      left: 0,
      right: -1,
      currentSubstring: '',
      maxLength: 0,
      maxSubstring: '',
      charMap: {},
      message: `Initialize: Finding longest substring without repeating characters in "${s}"`,
      operation: 'init'
    });

    for (let right = 0; right < s.length; right++) {
      const char = s[right];
      const currentSubstring = s.substring(left, right + 1);
      
      // Check if character is already in current window
      if (charMap[char] !== undefined && charMap[char] >= left) {
        // Character found in current window - need to shrink
        const duplicateIndex = charMap[char];
        
        steps.push({
          string: s,
          left,
          right,
          currentSubstring: s.substring(left, right),
          maxLength,
          maxSubstring,
          charMap: { ...charMap },
          message: `Found duplicate '${char}' at index ${duplicateIndex}. Current window: "${s.substring(left, right)}"`,
          operation: 'shrink',
          duplicateChar: char
        });

        // Move left pointer to after the duplicate character
        left = duplicateIndex + 1;
        
        steps.push({
          string: s,
          left,
          right,
          currentSubstring: s.substring(left, right),
          maxLength,
          maxSubstring,
          charMap: { ...charMap },
          message: `Shrink window: Move left pointer to ${left} (after duplicate)`,
          operation: 'shrink',
          duplicateChar: char
        });
      }

      // Add current character to window
      charMap[char] = right;
      const newSubstring = s.substring(left, right + 1);
      const newLength = newSubstring.length;
      
      // Check if this is a new maximum
      const isNewMax = newLength > maxLength;
      if (isNewMax) {
        maxLength = newLength;
        maxSubstring = newSubstring;
      }

      steps.push({
        string: s,
        left,
        right,
        currentSubstring: newSubstring,
        maxLength,
        maxSubstring,
        charMap: { ...charMap },
        message: `Add '${char}' to window. Current: "${newSubstring}" (length ${newLength})${isNewMax ? ' ✓ New maximum!' : ''}`,
        operation: isNewMax ? 'found' : 'expand'
      });
    }

    steps.push({
      string: s,
      left,
      right: s.length - 1,
      currentSubstring: maxSubstring,
      maxLength,
      maxSubstring,
      charMap: { ...charMap },
      message: `Complete! Longest substring without repeating characters: "${maxSubstring}" (length ${maxLength})`,
      operation: 'complete'
    });

    return steps;
  };

  const startVisualization = () => {
    if (!inputString.trim()) {
      toast.error('Please enter a valid string');
      return;
    }

    const newSteps = generateLongestSubstringSteps(inputString.trim());
    setSteps(newSteps);
    setCurrentStep(0);

    if (voiceEnabled) {
      speakStep('Longest Substring', `Starting visualization for string "${inputString}". We'll use sliding window with hash map to track character positions.`);
    }

    toast.success('Longest substring visualization started');
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      
      if (voiceEnabled && steps[newStep]) {
        speakStep('Substring Step', steps[newStep].message, newStep, steps.length);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      
      if (voiceEnabled && steps[newStep]) {
        speakStep('Substring Step', steps[newStep].message, newStep, steps.length);
      }
    }
  };

  const reset = () => {
    setSteps([]);
    setCurrentStep(0);
    setInputString('abcabcbb');
  };

  const renderString = () => {
    if (steps.length === 0) return null;
    
    const currentStepData = steps[currentStep];
    
    return (
      <div className="space-y-4">
        {/* String visualization */}
        <div className="flex justify-center gap-1">
          {currentStepData.string.split('').map((char, index) => {
            const isInWindow = index >= currentStepData.left && index <= currentStepData.right && currentStepData.left >= 0 && currentStepData.right >= 0;
            const isLeftPointer = index === currentStepData.left;
            const isRightPointer = index === currentStepData.right;
            const isDuplicate = char === currentStepData.duplicateChar && currentStepData.operation === 'shrink';
            const isInMaxSubstring = currentStepData.maxSubstring.includes(char) && 
              currentStepData.operation === 'complete' &&
              index >= currentStepData.string.indexOf(currentStepData.maxSubstring) &&
              index < currentStepData.string.indexOf(currentStepData.maxSubstring) + currentStepData.maxSubstring.length;
            
            return (
              <motion.div
                key={index}
                className={`relative w-12 h-12 flex items-center justify-center rounded border-2 font-bold ${
                  isInMaxSubstring && currentStepData.operation === 'complete'
                    ? 'bg-green-200 border-green-400 text-green-800'
                    : isDuplicate
                      ? 'bg-red-200 border-red-400 text-red-800'
                      : isInWindow
                        ? currentStepData.operation === 'found'
                          ? 'bg-yellow-200 border-yellow-400 text-yellow-800'
                          : 'bg-blue-200 border-blue-400 text-blue-800'
                        : 'bg-gray-100 border-gray-300 text-gray-600'
                }`}
                initial={{ scale: 1 }}
                animate={{ 
                  scale: isDuplicate ? 1.2 : isInWindow ? 1.1 : 1,
                  rotate: isDuplicate ? [0, -5, 5, 0] : 0
                }}
                transition={{ duration: 0.3 }}
              >
                {char}
                
                {/* Pointer indicators */}
                {isLeftPointer && currentStepData.left >= 0 && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                    <div className="text-xs font-bold text-blue-600">L</div>
                    <div className="w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-blue-600"></div>
                  </div>
                )}
                
                {isRightPointer && currentStepData.right >= 0 && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                    <div className="text-xs font-bold text-red-600">R</div>
                    <div className="w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-red-600"></div>
                  </div>
                )}
                
                {/* Index labels */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
                  {index}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Current window display */}
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-2">Current Window:</div>
          <div className="text-lg font-mono font-bold">
            "{currentStepData.currentSubstring || 'Empty'}"
          </div>
        </div>
      </div>
    );
  };

  const renderCharMap = () => {
    if (steps.length === 0) return null;
    
    const currentStepData = steps[currentStep];
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
        <div className="flex items-center gap-2 mb-3">
          <Hash className="h-4 w-4" />
          <h4 className="font-semibold">Character Position Map</h4>
        </div>
        <div className="space-y-2">
          {Object.keys(currentStepData.charMap).length === 0 ? (
            <div className="text-center text-gray-500 py-4">No characters tracked yet</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {Object.entries(currentStepData.charMap).map(([char, index]) => (
                <motion.div
                  key={char}
                  className={`p-2 rounded border text-center ${
                    char === currentStepData.duplicateChar && currentStepData.operation === 'shrink'
                      ? 'bg-red-100 border-red-300 text-red-800'
                      : 'bg-blue-100 border-blue-300 text-blue-800'
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="font-bold">'{char}'</div>
                  <div className="text-xs">→ {index}</div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Longest Substring Without Repeating Characters</h3>
        <p className="text-muted-foreground">
          Find the longest substring with all unique characters using sliding window + hash map
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Input String</label>
          <Input
            value={inputString}
            onChange={(e) => setInputString(e.target.value)}
            placeholder="e.g., abcabcbb"
          />
        </div>

        <div className="flex gap-2 items-end">
          <Button onClick={startVisualization} className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            Start
          </Button>
          <Button onClick={reset} variant="outline">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Visualization */}
      {steps.length > 0 && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950 dark:to-pink-900 p-8 rounded-xl border-2 border-dashed border-purple-200 dark:border-purple-800">
          <div className="space-y-6">
            {/* String Visualization */}
            {renderString()}

            {/* Character Map */}
            {renderCharMap()}

            {/* Current State Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-sm text-muted-foreground">Window Position</div>
                  <div className="font-bold">
                    {currentStepData.left >= 0 && currentStepData.right >= 0 
                      ? `[${currentStepData.left}, ${currentStepData.right}]` 
                      : 'Initializing'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Current Length</div>
                  <div className="font-bold">{currentStepData.currentSubstring.length}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Max Length Found</div>
                  <div className="font-bold text-green-600">{currentStepData.maxLength}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Max Substring</div>
                  <div className="font-bold text-green-600">
                    "{currentStepData.maxSubstring || 'None'}"
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <div className="text-sm text-muted-foreground mb-2">Current Operation:</div>
                <div className="text-lg font-semibold">{currentStepData.message}</div>
              </div>
            </div>

            {/* Step Controls */}
            <div className="flex justify-center gap-4">
              <Button 
                onClick={prevStep} 
                disabled={currentStep === 0}
                variant="outline"
              >
                Previous
              </Button>
              <Badge variant="secondary" className="px-4 py-2">
                Step {currentStep + 1} of {steps.length}
              </Badge>
              <Button 
                onClick={nextStep} 
                disabled={currentStep === steps.length - 1}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Algorithm Explanation */}
      <div className="bg-card border rounded-lg p-4">
        <h4 className="font-semibold mb-4">Algorithm Strategy:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="font-medium text-purple-600">Sliding Window Approach</div>
            <div>• <strong>Expand:</strong> Move right pointer, add characters</div>
            <div>• <strong>Shrink:</strong> When duplicate found, move left pointer</div>
            <div>• <strong>Track:</strong> Use hash map for character positions</div>
            <div>• <strong>Update:</strong> Keep track of maximum length found</div>
          </div>
          <div className="space-y-2">
            <div className="font-medium text-blue-600">Complexity Analysis</div>
            <div>• <strong>Time:</strong> O(n) - each character visited at most twice</div>
            <div>• <strong>Space:</strong> O(min(m,n)) - hash map size limited by charset</div>
            <div>• <strong>Optimal:</strong> Better than O(n³) brute force approach</div>
            <div>• <strong>Efficient:</strong> Single pass with smart pointer movement</div>
          </div>
        </div>
      </div>

      {/* Examples */}
      <div className="bg-card border rounded-lg p-4">
        <h4 className="font-semibold mb-4">Common Examples:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="font-medium">"abcabcbb" → 3</div>
            <div>Longest: "abc" or "bca" or "cab"</div>
            <div className="font-medium">"bbbbb" → 1</div>
            <div>Longest: "b" (all characters same)</div>
          </div>
          <div className="space-y-2">
            <div className="font-medium">"pwwkew" → 3</div>
            <div>Longest: "wke" (characters: w, k, e)</div>
            <div className="font-medium">"" → 0</div>
            <div>Empty string has no substrings</div>
          </div>
        </div>
      </div>

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