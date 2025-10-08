import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Play, Pause, RotateCcw, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PseudocodeBox } from '@/components/pseudocode-box';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

interface WindowStep {
  array: number[];
  windowStart: number;
  windowEnd: number;
  windowSize: number;
  currentMax: number;
  maxIndex: number;
  result: number[];
  message: string;
}

export function SlidingWindowVisualizer() {
  const [array, setArray] = useState<number[]>([1, 3, -1, -3, 5, 3, 6, 7]);
  const [windowSize, setWindowSize] = useState(3);
  const [steps, setSteps] = useState<WindowStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [inputArray, setInputArray] = useState('1,3,-1,-3,5,3,6,7');
  const [inputWindowSize, setInputWindowSize] = useState('3');
  const [mode, setMode] = useState<'fixed-max'|'kadane'>('fixed-max');
  const [showMemory, setShowMemory] = useState(false);
  const stepDesc = (steps[currentStep]?.message) || '';
  
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

  const generateSteps = (arr: number[], k: number): WindowStep[] => {
    const steps: WindowStep[] = [];
    const result: number[] = [];

    if (k > arr.length) {
      steps.push({
        array: [...arr],
        windowStart: 0,
        windowEnd: arr.length - 1,
        windowSize: k,
        currentMax: Math.max(...arr),
        maxIndex: arr.indexOf(Math.max(...arr)),
        result: [],
        message: `Window size (${k}) is larger than array length (${arr.length})`
      });
      return steps;
    }

    // Initial window
    let windowStart = 0;
    let windowEnd = k - 1;
    let currentWindow = arr.slice(windowStart, windowEnd + 1);
    let currentMax = Math.max(...currentWindow);
    let maxIndex = windowStart + currentWindow.indexOf(currentMax);
    
    result.push(currentMax);
    
    steps.push({
      array: [...arr],
      windowStart,
      windowEnd,
      windowSize: k,
      currentMax,
      maxIndex,
      result: [...result],
      message: `Initial window [${windowStart}, ${windowEnd}]: max = ${currentMax}`
    });

    // Slide the window
    for (let i = 1; i <= arr.length - k; i++) {
      windowStart = i;
      windowEnd = i + k - 1;
      currentWindow = arr.slice(windowStart, windowEnd + 1);
      currentMax = Math.max(...currentWindow);
      maxIndex = windowStart + currentWindow.indexOf(currentMax);
      
      result.push(currentMax);
      
      steps.push({
        array: [...arr],
        windowStart,
        windowEnd,
        windowSize: k,
        currentMax,
        maxIndex,
        result: [...result],
        message: `Window [${windowStart}, ${windowEnd}]: max = ${currentMax}`
      });
    }

    steps.push({
      array: [...arr],
      windowStart: -1,
      windowEnd: -1,
      windowSize: k,
      currentMax: -1,
      maxIndex: -1,
      result: [...result],
      message: `Complete! Maximum values: [${result.join(', ')}]`
    });

    return steps;
  };

  // Kadane's algorithm steps
  const generateKadaneSteps = (arr: number[]): WindowStep[] => {
    const steps: WindowStep[] = [];
    let best = -Infinity, curr = 0;
    let start = 0, bestStart = 0, bestEnd = 0;
    for (let i=0; i<arr.length; i++) {
      if (curr + arr[i] < arr[i]) {
        curr = arr[i]; start = i;
      } else {
        curr += arr[i];
      }
      if (curr > best) {
        best = curr; bestStart = start; bestEnd = i;
      }
      steps.push({
        array: [...arr],
        windowStart: start,
        windowEnd: i,
        windowSize: i-start+1,
        currentMax: curr,
        maxIndex: i,
        result: [best],
        message: `i=${i}: curr=${curr}, best=${best} [${bestStart}, ${bestEnd}]`
      });
    }
    steps.push({
      array: [...arr],
      windowStart: bestStart,
      windowEnd: bestEnd,
      windowSize: bestEnd-bestStart+1,
      currentMax: best,
      maxIndex: bestEnd,
      result: [best],
      message: `Complete! Max sum subarray [${bestStart}, ${bestEnd}] = ${best}`
    });
    return steps;
  };

  const handleSort = () => {
    const newSteps = mode==='fixed-max' ? generateSteps(array, windowSize) : generateKadaneSteps(array);
    setSteps(newSteps);
    setCurrentStep(0);
  };

  const handlePlay = () => {
    if (steps.length === 0) {
      handleSort();
      return;
    }
    
    const modeText = mode === 'fixed-max' ? 'Fixed Window Maximum' : "Kadane's Algorithm";
    speakOperation(`Sliding Window - ${modeText}`, `Starting ${modeText} visualization. ${mode === 'fixed-max' ? `We'll slide a window of size ${windowSize} across the array to find maximum in each window.` : "We'll find the maximum sum subarray using dynamic programming."}`);
    
    setIsPlaying(true);
    let stepIndex = 0;
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          clearInterval(interval);
          speakResult(`${modeText} completed! ${mode === 'fixed-max' ? `Found maximum values for all windows of size ${windowSize}.` : 'Found the maximum sum subarray.'}`);
          return prev;
        }
        const nextStep = prev + 1;
        if (steps[nextStep]) {
          speakStep("", steps[nextStep].message, nextStep + 1, steps.length);
        }
        return nextStep;
      });
    }, 1500);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleInputChange = () => {
    try {
      const newArray = inputArray.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
      const newWindowSize = parseInt(inputWindowSize);
      
      if (newArray.length > 0 && newWindowSize > 0) {
        setArray(newArray);
        setWindowSize(newWindowSize);
        setSteps([]);
        setCurrentStep(0);
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Invalid input');
    }
  };

  const currentStepData = steps[currentStep] || {
    array: array,
    windowStart: 0,
    windowEnd: Math.max(0, (mode==='fixed-max'?windowSize:1) - 1),
    windowSize: mode==='fixed-max'? windowSize : 1,
    currentMax: mode==='fixed-max'? Math.max(...array.slice(0, windowSize)) : (array[0]||0),
    maxIndex: 0,
    result: [],
    message: 'Click Play to start'
  };

  const maxValue = Math.max(...currentStepData.array);
  const minValue = Math.min(...currentStepData.array);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex gap-2">
          <Button
            onClick={isPlaying ? handlePause : handlePlay}
            disabled={steps.length > 0 && currentStep >= steps.length - 1}
            className="flex items-center gap-2"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          
          <Button onClick={handleReset} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        <div className="flex gap-2 items-center">
          <Input
            value={inputArray}
            onChange={(e) => setInputArray(e.target.value)}
            placeholder="Enter numbers"
            className="w-48"
          />
          {mode==='fixed-max' && (
            <Input
              value={inputWindowSize}
              onChange={(e) => setInputWindowSize(e.target.value)}
              placeholder="Window size"
              className="w-24"
            />
          )}
          <Button onClick={handleInputChange} variant="outline">
            Set Values
          </Button>
        </div>

        <Select value={mode} onValueChange={(v: 'fixed-max'|'kadane')=>setMode(v)}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="fixed-max">Fixed Window Maximum</SelectItem>
            <SelectItem value="kadane">Kadane (Max Sum Subarray)</SelectItem>
          </SelectContent>
        </Select>

      </div>

      {/* Progress */}
      {steps.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Step {currentStep + 1} of {steps.length}
        </div>
      )}

      {/* Window Info */}
      <div className="flex items-center justify-center gap-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-600" />
          <span className="font-semibold">{mode==='fixed-max' ? 'Window Size' : 'Current Range'}: {currentStepData.windowSize}</span>
        </div>
        {currentStepData.currentMax !== -1 && (
          <>
            <span className="text-muted-foreground">|</span>
            <span className="font-semibold text-green-600">
              {mode==='fixed-max' ? 'Current Window Max' : 'Current Sum'}: {currentStepData.currentMax}
            </span>
          </>
        )}
      </div>

      {/* Enhanced Visualization */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 p-8 rounded-xl border-2 border-border/50">
        {/* Window Animation Frame */}
        <div className="relative mb-12">
          {currentStepData.windowStart >= 0 && (
            <motion.div 
              className="absolute top-0 left-0 h-full border-4 border-blue-500/70 dark:border-blue-400/70 rounded-lg z-10 shadow-lg"
              style={{
                left: `${(currentStepData.windowStart / currentStepData.array.length) * 100}%`,
                width: `${(currentStepData.windowSize / currentStepData.array.length) * 100}%`,
              }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                left: `${(currentStepData.windowStart / currentStepData.array.length) * 100}%`,
                width: `${(currentStepData.windowSize / currentStepData.array.length) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                Sliding Window
              </div>
            </motion.div>
          )}
          
          <div className="flex items-end justify-center gap-2 h-64 mb-8 relative">
            {currentStepData.array.map((value, index) => {
              const isInWindow = index >= currentStepData.windowStart && index <= currentStepData.windowEnd;
              const isMaxInWindow = index === currentStepData.maxIndex;
              const isJustEntered = index === currentStepData.windowEnd && currentStep > 0;
              const isJustLeft = index === currentStepData.windowStart - 1 && currentStep > 0;
              
              let barColor = 'bg-card border-border';
              if (isMaxInWindow && isInWindow) {
                barColor = 'bg-primary border-primary text-primary-foreground';
              } else if (isInWindow) {
                barColor = 'bg-primary/20 border-primary/50';
              }

              const height = value >= 0 
                ? ((value / maxValue) * 180 + 20)
                : (20 - (Math.abs(value) / Math.abs(minValue)) * 180);

              return (
                <motion.div
                  key={index}
                  className="flex flex-col items-center justify-end relative min-w-[50px]"
                  initial={{ scale: 1 }}
                  animate={{ 
                    scale: isInWindow ? 1.05 : 1,
                    y: isMaxInWindow ? -5 : 0,
                    opacity: isJustLeft ? [1, 0.7, 1] : isJustEntered ? [0.7, 1] : 1
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    className={`${barColor} rounded-t-lg transition-all duration-500 flex items-end justify-center relative border-2`}
                    style={{ height: `${Math.abs(height)}px` }}
                    animate={isInWindow ? {
                      boxShadow: isMaxInWindow ? 
                        '0 0 15px 5px rgba(99, 102, 241, 0.5)' : 
                        '0 0 10px 2px rgba(99, 102, 241, 0.3)'
                    } : {}}
                  >
                    <span className="font-bold text-sm mb-2">
                      {value}
                    </span>
                    
                    {/* Ripple effect for elements entering/leaving window */}
                    {(isJustEntered || isJustLeft) && (
                      <motion.div
                        className="absolute inset-0 rounded-t-lg border-2 border-blue-500"
                        initial={{ opacity: 0.8, scale: 1 }}
                        animate={{ opacity: 0, scale: 1.2 }}
                        transition={{ duration: 0.8, repeat: 0 }}
                      />
                    )}
                  </motion.div>
                  
                  <span className="absolute -bottom-6 text-xs text-gray-600 dark:text-gray-400">
                    {index}
                  </span>
                  
                  {isInWindow && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                      <div className={`
                        ${isMaxInWindow ? 'bg-primary text-primary-foreground' : 'bg-primary/20 text-primary'} 
                        px-2 py-1 rounded-md text-xs font-bold shadow-md
                      `}>
                        {isMaxInWindow ? 'MAX' : 'WIN'}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Window Movement Tracker */}
        <div className="relative h-4 mb-8 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div className="absolute top-0 left-0 h-full w-full flex items-center">
            {currentStepData.array.map((_, index) => (
              <div key={index} className="flex-1 flex justify-center">
                <div className={`h-2 w-2 rounded-full ${
                  index < currentStepData.windowStart || index > currentStepData.windowEnd 
                    ? 'bg-gray-300 dark:bg-gray-600' 
                    : index === currentStepData.maxIndex 
                      ? 'bg-primary' 
                      : 'bg-blue-300 dark:bg-blue-600'
                }`} />
              </div>
            ))}
          </div>
          
          {currentStepData.windowStart >= 0 && (
            <motion.div 
              className="absolute top-0 h-full bg-blue-200 dark:bg-blue-800 opacity-50"
              style={{
                left: `${(currentStepData.windowStart / currentStepData.array.length) * 100}%`,
                width: `${(currentStepData.windowSize / currentStepData.array.length) * 100}%`,
              }}
              animate={{
                left: `${(currentStepData.windowStart / currentStepData.array.length) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
            />
          )}
        </div>

        {/* Message */}
        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border mt-4 shadow-md">
          <p className="text-sm font-medium">{currentStepData.message}</p>
        </div>
      </div>

      {/* Result Display */}
      {currentStepData.result.length > 0 && (
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-2">{mode==='fixed-max' ? 'Maximum Values Found:' : 'Maximum Sum Found:'}</h4>
          <div className="flex flex-wrap gap-2">
            {currentStepData.result.map((value, index) => (
              <div key={index} className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
                {value}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary rounded"></div>
          <span>Maximum in Window</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary/20 rounded"></div>
          <span>In Current Window</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-card border border-border rounded"></div>
          <span>Outside Window</span>
        </div>
      </div>

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
          data={currentStepData.array}
          title="Array Memory Layout"
          baseAddress={1000}
          wordSize={4}
        />
      )}

      {/* Pseudocode */}
      <PseudocodeBox
        title={mode==='fixed-max' ? 'Fixed Window Maximum - Pseudocode' : "Kadane's Algorithm - Pseudocode"}
        code={mode==='fixed-max' ? [
          'result = []',
          'for i in 0..n-k:',
          '  window = a[i..i+k-1]',
          '  result.push(max(window))'
        ] : [
          'best = -inf; curr = 0; start = 0',
          'for i in 0..n-1:',
          '  curr = max(a[i], curr + a[i])',
          '  if curr improved best: update best and range'
        ]}
        highlightedLine={
          mode==='fixed-max'
            ? (currentStep===0 ? 1 : (currentStep>0 && currentStep<steps.length-1 ? 3 : 4))
            : (currentStep===0 ? 1 : (currentStep>0 && currentStep<steps.length-1 ? 3 : 4))
        }
      />
    </div>
  );
}