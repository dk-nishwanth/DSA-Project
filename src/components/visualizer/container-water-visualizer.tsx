import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

interface BarElement {
  height: number;
  index: number;
  isLeftPointer: boolean;
  isRightPointer: boolean;
  isPartOfContainer: boolean;
  isMaxContainer: boolean;
  isProcessed: boolean;
}

export function ContainerWaterVisualizer() {
  const [heightsInput, setHeightsInput] = useState('1,8,6,2,5,4,8,3,7');
  const [approach, setApproach] = useState<'two-pointers' | 'brute-force' | 'optimized'>('two-pointers');
  const [bars, setBars] = useState<BarElement[]>([]);
  const [leftPointer, setLeftPointer] = useState(0);
  const [rightPointer, setRightPointer] = useState(0);
  const [maxArea, setMaxArea] = useState(0);
  const [currentArea, setCurrentArea] = useState(0);
  const [maxLeft, setMaxLeft] = useState(0);
  const [maxRight, setMaxRight] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showMemory, setShowMemory] = useState(false);
  const [result, setResult] = useState<string>('');
  const [step, setStep] = useState(0);
  const [comparisons, setComparisons] = useState(0);

  const {
    voiceEnabled,
    setVoiceEnabled,
    speakOperation,
    speakStep,
    speakResult,
  } = useVisualizerVoice({ minInterval: 600 });

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const parseHeights = useCallback(() => {
    const heights = heightsInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n >= 0);
    const elements: BarElement[] = heights.map((height, index) => ({
      height,
      index,
      isLeftPointer: false,
      isRightPointer: false,
      isPartOfContainer: false,
      isMaxContainer: false,
      isProcessed: false,
    }));
    setBars(elements);
    return heights;
  }, [heightsInput]);

  const clearHighlights = useCallback(() => {
    setBars(prev => prev.map(bar => ({
      ...bar,
      isLeftPointer: false,
      isRightPointer: false,
      isPartOfContainer: false,
    })));
  }, []);

  const updatePointers = useCallback((left: number, right: number) => {
    setLeftPointer(left);
    setRightPointer(right);
    setBars(prev => prev.map((bar, index) => ({
      ...bar,
      isLeftPointer: index === left,
      isRightPointer: index === right,
    })));
  }, []);

  const calculateArea = useCallback((left: number, right: number, heights: number[]) => {
    const width = right - left;
    const height = Math.min(heights[left], heights[right]);
    return width * height;
  }, []);

  const highlightContainer = useCallback((left: number, right: number, isMax: boolean = false) => {
    setBars(prev => prev.map((bar, index) => ({
      ...bar,
      isPartOfContainer: index >= left && index <= right,
      isMaxContainer: isMax && index >= left && index <= right,
    })));
  }, []);

  const twoPointersApproach = useCallback(async () => {
    const heights = parseHeights();
    
    speakOperation('Two Pointers Container', `Finding maximum water container using two pointers`);
    
    if (heights.length < 2) {
      setResult('Need at least 2 bars to form a container');
      return;
    }
    
    let left = 0;
    let right = heights.length - 1;
    let maxWater = 0;
    let bestLeft = 0;
    let bestRight = 0;
    
    setComparisons(0);
    setMaxArea(0);
    
    speakStep('Initialize', `Starting with pointers at ends: left=${left}, right=${right}`, 0, heights.length - 1);
    await sleep(800);
    
    while (left < right) {
      updatePointers(left, right);
      setComparisons(prev => prev + 1);
      
      const area = calculateArea(left, right, heights);
      setCurrentArea(area);
      
      highlightContainer(left, right);
      
      speakStep('Calculate area', `Container from ${left} to ${right}: width=${right - left}, height=${Math.min(heights[left], heights[right])}, area=${area}`, step, heights.length - 1);
      await sleep(700);
      
      if (area > maxWater) {
        maxWater = area;
        bestLeft = left;
        bestRight = right;
        setMaxArea(maxWater);
        setMaxLeft(bestLeft);
        setMaxRight(bestRight);
        
        speakStep('New maximum', `Found new maximum area: ${area}`, step, heights.length - 1);
        await sleep(500);
      }
      
      // Move the pointer with smaller height
      if (heights[left] < heights[right]) {
        bars[left].isProcessed = true;
        setBars([...bars]);
        left++;
        speakStep('Move left', `Left height ${heights[left - 1]} < right height ${heights[right]}, moving left pointer`, step, heights.length - 1);
      } else {
        bars[right].isProcessed = true;
        setBars([...bars]);
        right--;
        speakStep('Move right', `Right height ${heights[right + 1]} ≤ left height ${heights[left]}, moving right pointer`, step, heights.length - 1);
      }
      
      await sleep(500);
      setStep(prev => prev + 1);
    }
    
    // Highlight the maximum container
    clearHighlights();
    highlightContainer(bestLeft, bestRight, true);
    
    setResult(`Maximum water area: ${maxWater} (between indices ${bestLeft} and ${bestRight})`);
    speakResult(`Maximum water area is ${maxWater}`);
  }, [parseHeights, bars, step, updatePointers, calculateArea, highlightContainer, clearHighlights, speakOperation, speakStep, speakResult]);

  const bruteForceApproach = useCallback(async () => {
    const heights = parseHeights();
    
    speakOperation('Brute Force Container', `Finding maximum water container using brute force`);
    
    let maxWater = 0;
    let bestLeft = 0;
    let bestRight = 0;
    setComparisons(0);
    
    for (let i = 0; i < heights.length - 1; i++) {
      bars[i].isLeftPointer = true;
      setBars([...bars]);
      
      speakStep('Outer loop', `Checking all containers starting from index ${i}`, i, heights.length);
      await sleep(400);
      
      for (let j = i + 1; j < heights.length; j++) {
        bars[j].isRightPointer = true;
        setBars([...bars]);
        
        setComparisons(prev => prev + 1);
        
        const area = calculateArea(i, j, heights);
        setCurrentArea(area);
        
        highlightContainer(i, j);
        
        speakStep('Inner loop', `Container from ${i} to ${j}: area=${area}`, j, heights.length);
        await sleep(300);
        
        if (area > maxWater) {
          maxWater = area;
          bestLeft = i;
          bestRight = j;
          setMaxArea(maxWater);
          setMaxLeft(bestLeft);
          setMaxRight(bestRight);
        }
        
        bars[j].isRightPointer = false;
        setBars([...bars]);
      }
      
      bars[i].isLeftPointer = false;
      bars[i].isProcessed = true;
      setBars([...bars]);
    }
    
    clearHighlights();
    highlightContainer(bestLeft, bestRight, true);
    
    setResult(`Brute force result: Maximum area ${maxWater} (between indices ${bestLeft} and ${bestRight})`);
    speakResult(`Brute force found maximum area ${maxWater}`);
  }, [parseHeights, bars, calculateArea, highlightContainer, clearHighlights, speakOperation, speakStep, speakResult]);

  const optimizedApproach = useCallback(async () => {
    const heights = parseHeights();
    
    speakOperation('Optimized Container', `Using optimized two-pointers with early termination`);
    
    let left = 0;
    let right = heights.length - 1;
    let maxWater = 0;
    let bestLeft = 0;
    let bestRight = 0;
    
    setComparisons(0);
    
    while (left < right) {
      updatePointers(left, right);
      
      const area = calculateArea(left, right, heights);
      setCurrentArea(area);
      setComparisons(prev => prev + 1);
      
      highlightContainer(left, right);
      
      speakStep('Calculate', `Area from ${left} to ${right}: ${area}`, step, heights.length);
      await sleep(500);
      
      if (area > maxWater) {
        maxWater = area;
        bestLeft = left;
        bestRight = right;
        setMaxArea(maxWater);
        setMaxLeft(bestLeft);
        setMaxRight(bestRight);
      }
      
      // Optimization: skip smaller heights on the same side
      if (heights[left] < heights[right]) {
        const currentLeftHeight = heights[left];
        do {
          left++;
        } while (left < right && heights[left] <= currentLeftHeight);
        
        speakStep('Skip smaller', `Skipped smaller left heights, now at ${left}`, step, heights.length);
      } else {
        const currentRightHeight = heights[right];
        do {
          right--;
        } while (left < right && heights[right] <= currentRightHeight);
        
        speakStep('Skip smaller', `Skipped smaller right heights, now at ${right}`, step, heights.length);
      }
      
      await sleep(400);
      setStep(prev => prev + 1);
    }
    
    clearHighlights();
    highlightContainer(bestLeft, bestRight, true);
    
    setResult(`Optimized result: Maximum area ${maxWater} with fewer comparisons`);
    speakResult(`Optimized approach found maximum area ${maxWater}`);
  }, [parseHeights, step, updatePointers, calculateArea, highlightContainer, clearHighlights, speakOperation, speakStep, speakResult]);

  const runAlgorithm = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setResult('');
    setStep(0);
    setComparisons(0);
    setMaxArea(0);
    setCurrentArea(0);
    clearHighlights();
    
    try {
      if (approach === 'two-pointers') {
        await twoPointersApproach();
      } else if (approach === 'brute-force') {
        await bruteForceApproach();
      } else if (approach === 'optimized') {
        await optimizedApproach();
      }
    } finally {
      setIsRunning(false);
    }
  }, [isRunning, approach, twoPointersApproach, bruteForceApproach, optimizedApproach, clearHighlights]);

  const renderBars = () => {
    const maxHeight = Math.max(...bars.map(b => b.height), 1);
    const barWidth = Math.max(30, Math.min(60, 400 / bars.length));
    
    return (
      <div className="flex items-end justify-center gap-1 min-h-[200px]" style={{ height: '250px' }}>
        {bars.map((bar, index) => {
          const heightPercent = (bar.height / maxHeight) * 80; // 80% of container height
          
          return (
            <div key={index} className="relative flex flex-col items-center">
              {/* Pointer labels */}
              {bar.isLeftPointer && (
                <div className="absolute -top-8 text-xs font-bold text-blue-600 z-10">
                  L
                </div>
              )}
              {bar.isRightPointer && (
                <div className="absolute -top-8 text-xs font-bold text-purple-600 z-10">
                  R
                </div>
              )}
              
              {/* Bar */}
              <div
                className={`transition-all duration-300 border-2 flex items-end justify-center text-xs font-bold ${
                  bar.isMaxContainer
                    ? 'bg-green-400 border-green-600 text-white'
                    : bar.isPartOfContainer
                    ? 'bg-blue-200 border-blue-400 dark:bg-blue-800 dark:border-blue-600'
                    : bar.isLeftPointer
                    ? 'bg-blue-300 border-blue-500'
                    : bar.isRightPointer
                    ? 'bg-purple-300 border-purple-500'
                    : bar.isProcessed
                    ? 'bg-gray-200 border-gray-400 dark:bg-gray-700 dark:border-gray-500'
                    : 'bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-600'
                }`}
                style={{
                  width: `${barWidth}px`,
                  height: `${Math.max(heightPercent, 10)}%`,
                }}
              >
                <span className="text-xs">{bar.height}</span>
              </div>
              
              {/* Index */}
              <div className="text-xs text-muted-foreground mt-1">{index}</div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <div className="flex items-center gap-2">
          <span className="text-sm">Heights:</span>
          <Input 
            className="w-48" 
            value={heightsInput} 
            onChange={(e) => setHeightsInput(e.target.value)}
            placeholder="1,8,6,2,5,4,8,3,7"
          />
        </div>

        <Select value={approach} onValueChange={(v: 'two-pointers' | 'brute-force' | 'optimized') => setApproach(v)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="two-pointers">Two Pointers O(n)</SelectItem>
            <SelectItem value="brute-force">Brute Force O(n²)</SelectItem>
            <SelectItem value="optimized">Optimized O(n)</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={runAlgorithm} disabled={isRunning}>
          {isRunning ? 'Finding...' : 'Find Max Water'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 p-4 bg-gradient-visualization rounded-xl border-2">
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-sm font-semibold mb-4">
                Container With Most Water - {approach.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Approach
              </h3>
              <div className="relative">
                {renderBars()}
                
                {/* Water area visualization */}
                {leftPointer < rightPointer && bars.length > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                    <div 
                      className="bg-blue-300/30 border-t-2 border-blue-400"
                      style={{
                        width: `${(rightPointer - leftPointer) * (Math.max(30, Math.min(60, 400 / bars.length)) + 4)}px`,
                        height: `${(Math.min(bars[leftPointer]?.height || 0, bars[rightPointer]?.height || 0) / Math.max(...bars.map(b => b.height), 1)) * 200}px`,
                        marginLeft: `${leftPointer * (Math.max(30, Math.min(60, 400 / bars.length)) + 4)}px`
                      }}
                    />
                  </div>
                )}
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
              <div><strong>Current Area:</strong> {currentArea}</div>
              <div><strong>Max Area:</strong> {maxArea}</div>
              {approach === 'two-pointers' && (
                <>
                  <div><strong>Left Pointer:</strong> {leftPointer}</div>
                  <div><strong>Right Pointer:</strong> {rightPointer}</div>
                  <div><strong>Best Container:</strong> [{maxLeft}, {maxRight}]</div>
                </>
              )}
            </div>
          </div>
          
          <div className="p-4 bg-muted/20 rounded-xl border">
            <h3 className="text-sm font-semibold mb-2">Complexity</h3>
            <div className="text-xs space-y-1">
              {approach === 'two-pointers' && (
                <>
                  <div><strong>Time:</strong> O(n)</div>
                  <div><strong>Space:</strong> O(1)</div>
                  <div><strong>Note:</strong> Optimal solution</div>
                </>
              )}
              {approach === 'brute-force' && (
                <>
                  <div><strong>Time:</strong> O(n²)</div>
                  <div><strong>Space:</strong> O(1)</div>
                  <div><strong>Note:</strong> Checks all pairs</div>
                </>
              )}
              {approach === 'optimized' && (
                <>
                  <div><strong>Time:</strong> O(n)</div>
                  <div><strong>Space:</strong> O(1)</div>
                  <div><strong>Note:</strong> Skips redundant checks</div>
                </>
              )}
            </div>
          </div>
          
          <div className="p-4 bg-muted/20 rounded-xl border">
            <h3 className="text-sm font-semibold mb-2">Legend</h3>
            <div className="text-xs space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-300"></div>
                <span>Left Pointer (L)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-purple-300"></div>
                <span>Right Pointer (R)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-200"></div>
                <span>Current Container</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-400"></div>
                <span>Maximum Container</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-gray-300"></div>
                <span>Processed</span>
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
          data={bars}
          title="Heights Array Memory Layout"
          baseAddress={21000}
          wordSize={4}
        />
      )}

      <div className="bg-muted/20 rounded-lg p-4 text-sm space-y-2">
        <div className="font-semibold text-primary">Container With Most Water Problem:</div>
        <div>• <strong>Problem:</strong> Find two lines that form a container holding the most water</div>
        <div>• <strong>Two Pointers:</strong> Start from ends, move pointer with smaller height - O(n) time, O(1) space</div>
        <div>• <strong>Brute Force:</strong> Check all possible pairs - O(n²) time, O(1) space</div>
        <div>• <strong>Key Insight:</strong> Moving the taller line cannot increase area, so always move the shorter one</div>
        <div>• <strong>Applications:</strong> Optimization problems, geometric algorithms, resource allocation</div>
      </div>
    </div>
  );
}