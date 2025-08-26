import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Play, RotateCcw, Shuffle } from 'lucide-react';
import { PseudocodeBox } from '@/components/pseudocode-box';
import { ComplexityBox } from '@/components/complexity-box';
import { toast } from 'sonner';

interface ArrayElement {
  value: number;
  index: number;
  dpValue: number;
  isInLIS: boolean;
  isCurrent: boolean;
  isComparing: boolean;
}

export function LongestIncreasingSubsequenceVisualizer() {
  const [inputArray, setInputArray] = useState('10 22 9 33 21 50 41 60');
  const [array, setArray] = useState<ArrayElement[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [stepDescription, setStepDescription] = useState('');
  const [lisLength, setLisLength] = useState(0);
  const [lisSequence, setLisSequence] = useState<number[]>([]);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const pseudocode = [
    "function longestIncreasingSubsequence(arr):",
    "  n = arr.length",
    "  dp = array of size n, all 1",
    "  ",
    "  for i = 1 to n-1:",
    "    for j = 0 to i-1:",
    "      if arr[j] < arr[i]:",
    "        dp[i] = max(dp[i], dp[j] + 1)",
    "  ",
    "  return max(dp)"
  ];

  const updateArray = () => {
    try {
      const values = inputArray.split(' ').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
      if (values.length === 0) {
        toast.error('Please enter valid numbers separated by spaces');
        return;
      }
      
      const newArray: ArrayElement[] = values.map((value, index) => ({
        value,
        index,
        dpValue: 1,
        isInLIS: false,
        isCurrent: false,
        isComparing: false
      }));
      
      setArray(newArray);
      setLisLength(0);
      setLisSequence([]);
      setCurrentStep(-1);
      setStepDescription('');
      toast.success('Array updated!');
    } catch (error) {
      toast.error('Invalid input format');
    }
  };

  const generateRandomArray = () => {
    const length = Math.floor(Math.random() * 6) + 5; // 5-10 elements
    const values = Array.from({ length }, () => Math.floor(Math.random() * 50) + 1);
    setInputArray(values.join(' '));
    updateArray();
  };

  const solveLIS = useCallback(async () => {
    if (array.length === 0) {
      toast.error('Please enter an array first');
      return;
    }

    setIsAnimating(true);
    setCurrentStep(0);
    setStepDescription('Initializing LIS algorithm...');

    // Reset all states
    setArray(prev => prev.map(el => ({
      ...el,
      dpValue: 1,
      isInLIS: false,
      isCurrent: false,
      isComparing: false
    })));

    await sleep(1000);

    setCurrentStep(2);
    setStepDescription('Setting all dp values to 1 (each element forms a subsequence of length 1)');
    await sleep(1000);

    const dp = Array(array.length).fill(1);
    const n = array.length;

    // Main LIS algorithm
    setCurrentStep(4);
    setStepDescription('Starting main loop to find longest increasing subsequence...');
    
    for (let i = 1; i < n; i++) {
      // Highlight current element
      setArray(prev => prev.map((el, idx) => ({
        ...el,
        isCurrent: idx === i,
        isComparing: false
      })));

      setStepDescription(`Processing element at index ${i} (value: ${array[i].value})`);
      await sleep(800);

      setCurrentStep(5);
      for (let j = 0; j < i; j++) {
        // Highlight comparing elements
        setArray(prev => prev.map((el, idx) => ({
          ...el,
          isCurrent: idx === i,
          isComparing: idx === j
        })));

        setStepDescription(
          `Comparing arr[${j}] = ${array[j].value} with arr[${i}] = ${array[i].value}`
        );
        await sleep(600);

        setCurrentStep(6);
        if (array[j].value < array[i].value) {
          setStepDescription(
            `${array[j].value} < ${array[i].value}, so we can extend the subsequence`
          );
          await sleep(600);

          setCurrentStep(7);
          const newDpValue = Math.max(dp[i], dp[j] + 1);
          if (newDpValue > dp[i]) {
            dp[i] = newDpValue;
            setArray(prev => prev.map((el, idx) => ({
              ...el,
              dpValue: idx === i ? dp[i] : el.dpValue
            })));
            
            setStepDescription(
              `Updated dp[${i}] = max(${dp[i]}, ${dp[j]} + 1) = ${dp[i]}`
            );
          } else {
            setStepDescription(
              `dp[${i}] remains ${dp[i]} (no improvement)`
            );
          }
          await sleep(800);
        } else {
          setStepDescription(
            `${array[j].value} >= ${array[i].value}, cannot extend subsequence`
          );
          await sleep(400);
        }
      }

      // Clear comparing highlights
      setArray(prev => prev.map(el => ({
        ...el,
        isComparing: false
      })));
    }

    // Find the maximum value in dp array
    const maxLength = Math.max(...dp);
    setLisLength(maxLength);

    // Backtrack to find the actual LIS
    setCurrentStep(9);
    setStepDescription('Backtracking to find the actual longest increasing subsequence...');
    await sleep(1000);

    const lisIndices: number[] = [];
    let currentMax = maxLength;
    
    // Find one possible LIS by going backwards
    for (let i = n - 1; i >= 0; i--) {
      if (dp[i] === currentMax) {
        lisIndices.unshift(i);
        currentMax--;
        if (currentMax === 0) break;
      }
    }

    // Highlight the LIS
    setArray(prev => prev.map((el, idx) => ({
      ...el,
      isInLIS: lisIndices.includes(idx),
      isCurrent: false,
      isComparing: false
    })));

    const sequence = lisIndices.map(idx => array[idx].value);
    setLisSequence(sequence);

    setCurrentStep(-1);
    setStepDescription(
      `LIS found! Length: ${maxLength}, Sequence: [${sequence.join(', ')}]`
    );
    setIsAnimating(false);
    
    toast.success(`LIS length: ${maxLength}, sequence: [${sequence.join(', ')}]`);
  }, [array]);

  const handleReset = () => {
    if (array.length > 0) {
      setArray(prev => prev.map(el => ({
        ...el,
        dpValue: 1,
        isInLIS: false,
        isCurrent: false,
        isComparing: false
      })));
    }
    setLisLength(0);
    setLisSequence([]);
    setCurrentStep(-1);
    setStepDescription('');
    setIsAnimating(false);
    toast.info('Visualization reset!');
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-4 p-4 bg-card border rounded-xl">
          <h3 className="text-lg font-semibold">Array Input</h3>
          <div>
            <Label htmlFor="inputArray">Array (space-separated numbers)</Label>
            <Input
              id="inputArray"
              value={inputArray}
              onChange={(e) => setInputArray(e.target.value)}
              placeholder="10 22 9 33 21 50 41 60"
              disabled={isAnimating}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={updateArray} disabled={isAnimating} className="flex-1">
              Update Array
            </Button>
            <Button onClick={generateRandomArray} disabled={isAnimating} variant="outline">
              <Shuffle className="h-4 w-4 mr-2" />
              Random
            </Button>
          </div>
        </div>
        
        <div className="space-y-4 p-4 bg-card border rounded-xl">
          <h3 className="text-lg font-semibold">Controls</h3>
          <Button onClick={solveLIS} disabled={isAnimating || array.length === 0} className="w-full">
            <Play className="h-4 w-4 mr-2" />
            Find LIS
          </Button>
          <Button onClick={handleReset} variant="outline" className="w-full">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Status */}
      {stepDescription && (
        <div className="p-3 bg-info/10 border border-info/20 rounded-lg">
          <p className="text-info font-medium">{stepDescription}</p>
        </div>
      )}

      {/* Result Display */}
      {lisLength > 0 && (
        <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
          <h3 className="text-lg font-semibold text-success mb-2">Longest Increasing Subsequence</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-success/80">Length</div>
              <div className="text-2xl font-bold text-success">{lisLength}</div>
            </div>
            <div>
              <div className="text-sm text-success/80">Sequence</div>
              <div className="flex gap-1 mt-1 flex-wrap">
                {lisSequence.map((value, index) => (
                  <Badge key={index} variant="outline" className="border-success text-success">
                    {value}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Array Visualization */}
      {array.length > 0 && (
        <div className="p-6 bg-gradient-visualization rounded-xl border-2 border-primary/20">
          <h3 className="text-lg font-semibold mb-4 text-center">Array Visualization</h3>
          
          {/* Array elements */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {array.map((element, index) => (
              <div key={index} className="text-center">
                <div
                  className={`
                    w-16 h-16 rounded-lg border-2 flex items-center justify-center font-bold text-sm transition-all duration-300
                    ${element.isInLIS
                      ? 'bg-success text-success-foreground border-success shadow-lg scale-110'
                      : element.isCurrent
                      ? 'bg-destructive text-destructive-foreground border-destructive'
                      : element.isComparing
                      ? 'bg-warning text-warning-foreground border-warning'
                      : 'bg-card text-card-foreground border-border'
                    }
                  `}
                >
                  {element.value}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  dp[{index}] = {element.dpValue}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-card border border-border rounded"></div>
              <span>Normal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-destructive rounded"></div>
              <span>Current</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-warning rounded"></div>
              <span>Comparing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-success rounded"></div>
              <span>In LIS</span>
            </div>
          </div>
        </div>
      )}

      {/* Pseudocode and Complexity */}
      <div className="grid md:grid-cols-2 gap-6">
        <PseudocodeBox
          title="Longest Increasing Subsequence"
          code={pseudocode}
          highlightedLine={currentStep}
        />
        
        <ComplexityBox
          timeComplexity="O(n²)"
          spaceComplexity="O(n)"
          title="LIS Complexity"
          description="Classic DP approach with nested loops. Can be optimized to O(n log n) using binary search and patience sorting technique."
        />
      </div>
    </div>
  );
}