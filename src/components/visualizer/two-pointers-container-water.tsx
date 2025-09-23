import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';
import { toast } from 'sonner';

export function ContainerWithMostWaterVisualizer() {
  const [heights, setHeights] = useState<number[]>([1,8,6,2,5,4,8,3,7]);
  const [input, setInput] = useState('1,8,6,2,5,4,8,3,7');
  const [l, setL] = useState(0);
  const [r, setR] = useState(heights.length-1);
  const [best, setBest] = useState<{area:number,l:number,r:number}>({area:0,l:0,r:0});
  const [isRunning, setIsRunning] = useState(false);
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

  const sleep = (ms:number)=>new Promise(r=>setTimeout(r,ms));

  const updateFromInput = () => {
    const nums = input.split(',').map(s=>parseInt(s.trim())).filter(n=>!isNaN(n) && n>=0);
    if (nums.length>=2) { setHeights(nums); setL(0); setR(nums.length-1); setBest({area:0,l:0,r:0}); }
  };

  const run = useCallback(async ()=>{
    if (isRunning) return; 
    setIsRunning(true);
    setBest({area:0,l:0,r:0});
    
    speakOperation("Container With Most Water", "Starting two-pointer approach to find maximum water area. We'll use left and right pointers moving towards each other.");
    setCurrentStep("Initializing two pointers at start and end of array");
    
    let i = 0, j = heights.length-1; 
    let bestA = 0, bestL=0, bestR=0;
    let stepCount = 0;
    
    while (i < j) {
      stepCount++;
      setL(i); setR(j);
      
      const area = Math.min(heights[i], heights[j]) * (j - i);
      const stepText = `Step ${stepCount}: Left=${i} (height=${heights[i]}), Right=${j} (height=${heights[j]}). Area = min(${heights[i]}, ${heights[j]}) × ${j-i} = ${area}`;
      setCurrentStep(stepText);
      speakStep("", stepText, stepCount, heights.length);
      
      if (area > bestA) { 
        bestA = area; bestL = i; bestR = j; 
        setBest({area:bestA,l:bestL,r:bestR}); 
        setCurrentStep(`New maximum area found: ${bestA} at positions [${bestL}, ${bestR}]`);
        toast.success(`New max area: ${bestA}`);
      }
      
      await sleep(800);
      
      if (heights[i] < heights[j]) {
        setCurrentStep(`Moving left pointer right (height ${heights[i]} < ${heights[j]})`);
        i++;
      } else {
        setCurrentStep(`Moving right pointer left (height ${heights[j]} ≤ ${heights[i]})`);
        j--;
      }
      await sleep(400);
    }
    
    const resultText = `Algorithm complete! Maximum water area is ${bestA} between positions ${bestL} and ${bestR}`;
    setCurrentStep(resultText);
    speakResult(resultText);
    toast.success(`Max area: ${bestA}`);
    setIsRunning(false);
  }, [heights, isRunning, speakOperation, speakStep, speakResult]);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Container With Most Water Visualizer</h2>
        <p className="text-muted-foreground">
          Two-pointer technique to find maximum water area between vertical lines
        </p>
      </div>

      {/* Controls */}
      <div className="flex gap-2 items-center p-4 bg-muted/30 rounded-xl border flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm">Heights:</span>
          <Input 
            className="w-80" 
            value={input} 
            onChange={e=>setInput(e.target.value)} 
            disabled={isRunning}
            placeholder="Enter heights separated by commas"
          />
        </div>
        <Button onClick={updateFromInput} disabled={isRunning}>Update Array</Button>
        <Button onClick={run} disabled={isRunning}>
          {isRunning ? 'Running...' : 'Run Two Pointers'}
        </Button>
      </div>

      {/* Current Step Display */}
      {currentStep && (
        <div className="text-center p-4 bg-muted rounded-lg">
          <Badge className="mb-2" variant={isRunning ? 'default' : 'secondary'}>
            Two Pointers Step
          </Badge>
          <p className="text-sm">{currentStep}</p>
        </div>
      )}
      <div className="p-4 bg-gradient-visualization rounded-xl border-2">
        <div className="flex items-end gap-1 h-56 justify-center">
          {heights.map((h, idx)=>{
            const isL = idx===l; const isR = idx===r; const isBest = idx===best.l || idx===best.r;
            return (
              <div key={idx} className={`w-6 bg-card border relative ${isBest?'border-success':'border-border'}`} style={{height:`${h*8}px`}}>
                {isL && <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs">L</div>}
                {isR && <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs">R</div>}
              </div>
            );
          })}
        </div>
        <div className="text-sm mt-2">Best Area: <span className="font-mono">{best.area}</span> with [{best.l}, {best.r}]</div>
      </div>

      {/* Results Display */}
      {best.area > 0 && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">Maximum Water Container Found!</h4>
          <div className="text-sm text-green-700 space-y-1">
            <div>• <strong>Maximum Area:</strong> {best.area} square units</div>
            <div>• <strong>Left Line:</strong> Position {best.l}, Height {heights[best.l]}</div>
            <div>• <strong>Right Line:</strong> Position {best.r}, Height {heights[best.r]}</div>
            <div>• <strong>Width:</strong> {best.r - best.l} units</div>
            <div>• <strong>Calculation:</strong> min({heights[best.l]}, {heights[best.r]}) × {best.r - best.l} = {best.area}</div>
          </div>
        </div>
      )}

      {/* Algorithm Information */}
      <div className="bg-muted/20 rounded-lg p-4">
        <h4 className="font-semibold mb-2">Two Pointers Algorithm Properties</h4>
        <div className="text-sm text-muted-foreground space-y-1">
          <div>• <strong>Strategy:</strong> Start with widest container, move pointer at shorter line inward</div>
          <div>• <strong>Reasoning:</strong> Moving the taller line inward cannot increase area (width decreases, height limited by shorter line)</div>
          <div>• <strong>Optimization:</strong> Only move the shorter line to potentially find a taller line</div>
          <div>• <strong>Time Complexity:</strong> O(n) - each element visited at most once</div>
          <div>• <strong>Space Complexity:</strong> O(1) - only using two pointers</div>
          <div>• <strong>Applications:</strong> Two-sum problems, trapping rainwater, palindrome checking</div>
        </div>
      </div>

      {/* Memory Layout */}
      {showMemory && (
        <MemoryLayout
          title="Container Heights Memory Layout"
          data={heights.map((h, i) => `heights[${i}]=${h}`)}
          baseAddress={0xB000}
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
