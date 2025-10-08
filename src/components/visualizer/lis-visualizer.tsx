import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

interface ArrayElement {
  value: number;
  index: number;
  isActive: boolean;
  isInLIS: boolean;
  dpValue?: number;
}

interface PatienceCard {
  value: number;
  pile: number;
  isActive: boolean;
}

export function LISVisualizer() {
  const [arrayInput, setArrayInput] = useState('10,9,2,5,3,7,101,18');
  const [array, setArray] = useState<ArrayElement[]>([]);
  const [dpArray, setDpArray] = useState<number[]>([]);
  const [patienceArray, setPatienceArray] = useState<PatienceCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [showMemory, setShowMemory] = useState(false);
  const [algorithm, setAlgorithm] = useState<'dp' | 'patience'>('patience');
  const [lisResult, setLisResult] = useState<number[]>([]);
  const [step, setStep] = useState(0);

  const {
    voiceEnabled,
    setVoiceEnabled,
    speakOperation,
    speakStep,
    speakResult,
  } = useVisualizerVoice({ minInterval: 600 });

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const parseArray = useCallback(() => {
    const nums = arrayInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    const elements: ArrayElement[] = nums.map((value, index) => ({
      value,
      index,
      isActive: false,
      isInLIS: false,
    }));
    setArray(elements);
    return nums;
  }, [arrayInput]);

  const runDPAlgorithm = useCallback(async () => {
    const nums = parseArray();
    const n = nums.length;
    
    speakOperation('LIS Dynamic Programming', `Finding LIS using O(n²) DP approach for array of ${n} elements`);
    
    const dp = new Array(n).fill(1);
    const parent = new Array(n).fill(-1);
    setDpArray([...dp]);
    setStep(0);
    
    // DP algorithm
    for (let i = 1; i < n; i++) {
      setCurrentIndex(i);
      array[i].isActive = true;
      setArray([...array]);
      
      speakStep('Process element', `Processing element ${nums[i]} at index ${i}`, i, n);
      
      for (let j = 0; j < i; j++) {
        if (nums[j] < nums[i] && dp[j] + 1 > dp[i]) {
          dp[i] = dp[j] + 1;
          parent[i] = j;
          
          speakStep('Update DP', `Found longer subsequence: dp[${i}] = ${dp[i]}`, i * n + j, n * n);
        }
      }
      
      array[i].dpValue = dp[i];
      setDpArray([...dp]);
      setArray([...array]);
      await sleep(400);
      
      array[i].isActive = false;
      setStep(prev => prev + 1);
    }
    
    // Find the maximum length and reconstruct LIS
    let maxLength = Math.max(...dp);
    let maxIndex = dp.indexOf(maxLength);
    
    const lis: number[] = [];
    let current = maxIndex;
    while (current !== -1) {
      lis.unshift(nums[current]);
      array[current].isInLIS = true;
      current = parent[current];
    }
    
    setArray([...array]);
    setLisResult(lis);
    setCurrentIndex(-1);
    
    speakResult(`LIS found with length ${maxLength}: [${lis.join(', ')}]`);
  }, [parseArray, array, speakOperation, speakStep, speakResult]);

  const runPatienceAlgorithm = useCallback(async () => {
    const nums = parseArray();
    const n = nums.length;
    
    speakOperation('LIS Patience Sorting', `Finding LIS using O(n log n) patience sorting for array of ${n} elements`);
    
    const piles: number[][] = [];
    const pileIndices: number[][] = [];
    const parent = new Array(n).fill(-1);
    setPatienceArray([]);
    setStep(0);
    
    for (let i = 0; i < n; i++) {
      setCurrentIndex(i);
      array[i].isActive = true;
      setArray([...array]);
      
      const num = nums[i];
      speakStep('Process element', `Processing element ${num} at index ${i}`, i, n);
      
      // Binary search for the leftmost pile where we can place this card
      let left = 0, right = piles.length;
      while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (piles[mid][piles[mid].length - 1] < num) {
          left = mid + 1;
        } else {
          right = mid;
        }
      }
      
      const pileIndex = left;
      
      if (pileIndex === piles.length) {
        // Create new pile
        piles.push([num]);
        pileIndices.push([i]);
        speakStep('New pile', `Created new pile ${pileIndex + 1} with ${num}`, i, n);
      } else {
        // Add to existing pile
        piles[pileIndex].push(num);
        pileIndices[pileIndex].push(i);
        speakStep('Add to pile', `Added ${num} to pile ${pileIndex + 1}`, i, n);
      }
      
      // Set parent for reconstruction
      if (pileIndex > 0) {
        parent[i] = pileIndices[pileIndex - 1][pileIndices[pileIndex - 1].length - 1];
      }
      
      // Update patience visualization
      const patienceCards: PatienceCard[] = [];
      piles.forEach((pile, pIdx) => {
        pile.forEach((value, cardIdx) => {
          patienceCards.push({
            value,
            pile: pIdx,
            isActive: pIdx === pileIndex && cardIdx === pile.length - 1,
          });
        });
      });
      setPatienceArray([...patienceCards]);
      
      await sleep(500);
      
      array[i].isActive = false;
      setStep(prev => prev + 1);
    }
    
    // Reconstruct LIS
    const lis: number[] = [];
    if (pileIndices.length > 0) {
      let current = pileIndices[pileIndices.length - 1][pileIndices[pileIndices.length - 1].length - 1];
      while (current !== -1) {
        lis.unshift(nums[current]);
        array[current].isInLIS = true;
        current = parent[current];
      }
    }
    
    setArray([...array]);
    setLisResult(lis);
    setCurrentIndex(-1);
    
    speakResult(`LIS found with length ${piles.length}: [${lis.join(', ')}]`);
  }, [parseArray, array, speakOperation, speakStep, speakResult]);

  const runVisualization = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setLisResult([]);
    
    // Reset array state
    const nums = parseArray();
    const elements: ArrayElement[] = nums.map((value, index) => ({
      value,
      index,
      isActive: false,
      isInLIS: false,
    }));
    setArray(elements);
    
    if (algorithm === 'dp') {
      await runDPAlgorithm();
    } else {
      await runPatienceAlgorithm();
    }
    
    setIsRunning(false);
  }, [isRunning, algorithm, parseArray, runDPAlgorithm, runPatienceAlgorithm]);

  const renderArray = () => (
    <div className="flex flex-wrap gap-2 justify-center mb-4">
      {array.map((element, idx) => (
        <div
          key={idx}
          className={`w-12 h-12 flex items-center justify-center rounded border-2 font-mono text-sm transition-all duration-300 ${
            element.isInLIS
              ? 'bg-green-200 dark:bg-green-800 border-green-400'
              : element.isActive
              ? 'bg-yellow-200 dark:bg-yellow-800 border-yellow-400'
              : currentIndex === idx
              ? 'bg-blue-200 dark:bg-blue-800 border-blue-400'
              : 'bg-white dark:bg-gray-900 border-gray-300'
          }`}
        >
          <div className="text-center">
            <div className="font-bold">{element.value}</div>
            {algorithm === 'dp' && element.dpValue && (
              <div className="text-xs text-muted-foreground">{element.dpValue}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderPatiencePiles = () => {
    if (algorithm !== 'patience' || patienceArray.length === 0) return null;
    
    const piles: { [key: number]: PatienceCard[] } = {};
    patienceArray.forEach(card => {
      if (!piles[card.pile]) piles[card.pile] = [];
      piles[card.pile].push(card);
    });
    
    return (
      <div className="mt-4">
        <h3 className="text-sm font-semibold mb-2 text-center">Patience Piles</h3>
        <div className="flex gap-4 justify-center">
          {Object.entries(piles).map(([pileIdx, cards]) => (
            <div key={pileIdx} className="flex flex-col items-center">
              <div className="text-xs text-muted-foreground mb-1">Pile {parseInt(pileIdx) + 1}</div>
              <div className="flex flex-col-reverse gap-1">
                {cards.map((card, cardIdx) => (
                  <div
                    key={cardIdx}
                    className={`w-10 h-8 flex items-center justify-center rounded border text-xs font-mono transition-all duration-300 ${
                      card.isActive
                        ? 'bg-yellow-200 dark:bg-yellow-800 border-yellow-400'
                        : 'bg-white dark:bg-gray-900 border-gray-300'
                    }`}
                  >
                    {card.value}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <div className="flex items-center gap-2">
          <span className="text-sm">Array:</span>
          <Input 
            className="w-48" 
            value={arrayInput} 
            onChange={(e) => setArrayInput(e.target.value)}
            placeholder="10,9,2,5,3,7,101,18"
          />
        </div>

        <Select value={algorithm} onValueChange={(v: 'dp' | 'patience') => setAlgorithm(v)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="patience">Patience Sorting O(n log n)</SelectItem>
            <SelectItem value="dp">Dynamic Programming O(n²)</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={runVisualization} disabled={isRunning}>
          {isRunning ? 'Running...' : 'Find LIS'}
        </Button>
      </div>

      <div className="p-4 bg-gradient-visualization rounded-xl border-2">
        {renderArray()}
        
        {algorithm === 'dp' && dpArray.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold mb-2 text-center">DP Array (LIS length ending at each index)</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {dpArray.map((value, idx) => (
                <div
                  key={idx}
                  className={`w-12 h-8 flex items-center justify-center rounded border font-mono text-sm ${
                    currentIndex === idx
                      ? 'bg-blue-200 dark:bg-blue-800 border-blue-400'
                      : 'bg-muted border-gray-300'
                  }`}
                >
                  {value}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {renderPatiencePiles()}
        
        {lisResult.length > 0 && (
          <div className="mt-4 text-center p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <div className="text-sm text-muted-foreground">Longest Increasing Subsequence:</div>
            <div className="text-lg font-bold text-green-700 dark:text-green-300">
              [{lisResult.join(', ')}] (Length: {lisResult.length})
            </div>
          </div>
        )}
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
          data={algorithm === 'dp' ? dpArray : patienceArray}
          title={algorithm === 'dp' ? 'DP Array Memory' : 'Patience Piles Memory'}
          baseAddress={7000}
          wordSize={4}
        />
      )}

      <div className="bg-muted/20 rounded-lg p-4 text-sm space-y-2">
        <div className="font-semibold text-primary">LIS Algorithms:</div>
        <div>• <strong>DP Approach:</strong> O(n²) time, O(n) space - checks all previous elements</div>
        <div>• <strong>Patience Sorting:</strong> O(n log n) time, O(n) space - uses binary search on piles</div>
        <div>• <strong>Key Insight:</strong> Patience sorting maintains piles where each pile's top card is smallest</div>
        <div>• <strong>Applications:</strong> Scheduling, box stacking, Russian doll envelopes</div>
      </div>
    </div>
  );
}