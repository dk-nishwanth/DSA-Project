import React, { useState, useCallback } from 'react';
import { Play, RotateCcw, Search, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

type SearchAlgorithm = 'linear' | 'binary' | 'interpolation';

export function SearchVisualizer() {
  const [array, setArray] = useState([2, 5, 8, 12, 16, 23, 38, 45, 67, 78, 89, 99]);
  const [inputArray, setInputArray] = useState('2,5,8,12,16,23,38,45,67,78,89,99');
  const [target, setTarget] = useState(23);
  const [algorithm, setAlgorithm] = useState<SearchAlgorithm>('binary');
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchRange, setSearchRange] = useState<{left: number, right: number} | null>(null);
  const [foundIndex, setFoundIndex] = useState(-1);
  const [comparisons, setComparisons] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const updateArray = useCallback(() => {
    try {
      const newArray = inputArray.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
      if (newArray.length === 0) {
        toast.error('Please enter valid numbers');
        return;
      }
      setArray(newArray);
      toast.success('Array updated');
    } catch {
      toast.error('Invalid array format');
    }
  }, [inputArray]);

  const linearSearch = useCallback(async () => {
    let comparisonCount = 0;
    
    for (let i = 0; i < array.length; i++) {
      setCurrentIndex(i);
      comparisonCount++;
      setComparisons(comparisonCount);
      setCurrentStep(`Checking index ${i}: ${array[i]} ${array[i] === target ? '==' : '!='} ${target}`);
      
      await sleep(600);
      
      if (array[i] === target) {
        setFoundIndex(i);
        setCurrentStep(`Found target ${target} at index ${i}!`);
        return i;
      }
    }
    
    setCurrentStep(`Target ${target} not found in array`);
    return -1;
  }, [array, target]);

  const binarySearch = useCallback(async () => {
    let left = 0;
    let right = array.length - 1;
    let comparisonCount = 0;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      setCurrentIndex(mid);
      setSearchRange({left, right});
      comparisonCount++;
      setComparisons(comparisonCount);
      
      setCurrentStep(`Checking middle: array[${mid}] = ${array[mid]} vs target ${target}`);
      await sleep(800);

      if (array[mid] === target) {
        setFoundIndex(mid);
        setCurrentStep(`Found target ${target} at index ${mid}!`);
        return mid;
      } else if (array[mid] < target) {
        left = mid + 1;
        setCurrentStep(`${array[mid]} < ${target}, search right half`);
      } else {
        right = mid - 1;
        setCurrentStep(`${array[mid]} > ${target}, search left half`);
      }
      
      await sleep(600);
    }

    setCurrentStep(`Target ${target} not found in array`);
    return -1;
  }, [array, target]);

  const interpolationSearch = useCallback(async () => {
    let left = 0;
    let right = array.length - 1;
    let comparisonCount = 0;

    while (left <= right && target >= array[left] && target <= array[right]) {
      if (left === right) {
        setCurrentIndex(left);
        comparisonCount++;
        setComparisons(comparisonCount);
        setCurrentStep(`Single element left: array[${left}] = ${array[left]}`);
        await sleep(600);
        
        if (array[left] === target) {
          setFoundIndex(left);
          setCurrentStep(`Found target ${target} at index ${left}!`);
          return left;
        }
        break;
      }

      // Interpolation formula
      const pos = left + Math.floor(((target - array[left]) * (right - left)) / (array[right] - array[left]));
      const clampedPos = Math.max(left, Math.min(right, pos));
      
      setCurrentIndex(clampedPos);
      setSearchRange({left, right});
      comparisonCount++;
      setComparisons(comparisonCount);
      
      setCurrentStep(`Interpolated position: ${clampedPos}, array[${clampedPos}] = ${array[clampedPos]}`);
      await sleep(800);

      if (array[clampedPos] === target) {
        setFoundIndex(clampedPos);
        setCurrentStep(`Found target ${target} at index ${clampedPos}!`);
        return clampedPos;
      } else if (array[clampedPos] < target) {
        left = clampedPos + 1;
        setCurrentStep(`${array[clampedPos]} < ${target}, search right`);
      } else {
        right = clampedPos - 1;
        setCurrentStep(`${array[clampedPos]} > ${target}, search left`);
      }
      
      await sleep(600);
    }

    setCurrentStep(`Target ${target} not found in array`);
    return -1;
  }, [array, target]);

  const runSearch = useCallback(async () => {
    if (array.length === 0) {
      toast.error('Array is empty');
      return;
    }

    // Check if array is sorted for binary/interpolation search
    if ((algorithm === 'binary' || algorithm === 'interpolation')) {
      const isSorted = array.every((val, i) => i === 0 || array[i - 1] <= val);
      if (!isSorted) {
        toast.error(`${algorithm === 'binary' ? 'Binary' : 'Interpolation'} search requires a sorted array`);
        return;
      }
    }

    setIsAnimating(true);
    setCurrentIndex(-1);
    setSearchRange(null);
    setFoundIndex(-1);
    setComparisons(0);
    setCurrentStep(`Starting ${algorithm} search for ${target}...`);
    
    await sleep(500);

    try {
      let result = -1;
      switch (algorithm) {
        case 'linear':
          result = await linearSearch();
          break;
        case 'binary':
          result = await binarySearch();
          break;
        case 'interpolation':
          result = await interpolationSearch();
          break;
      }

      if (result !== -1) {
        toast.success(`Found ${target} at index ${result}`);
      } else {
        toast.error(`${target} not found in array`);
      }
    } catch (error) {
      toast.error('Search failed');
    }

    setCurrentIndex(-1);
    setSearchRange(null);
    setIsAnimating(false);
  }, [algorithm, linearSearch, binarySearch, interpolationSearch, array, target]);

  const resetSearch = useCallback(() => {
    setCurrentIndex(-1);
    setSearchRange(null);
    setFoundIndex(-1);
    setComparisons(0);
    setCurrentStep('');
    setIsAnimating(false);
    toast.success('Search reset');
  }, []);

  const renderArray = useCallback(() => {
    return array.map((value, index) => {
      let bgColor = 'bg-card';
      let textColor = 'text-card-foreground';
      let borderColor = 'border-border';

      if (index === foundIndex) {
        bgColor = 'bg-success';
        textColor = 'text-success-foreground';
        borderColor = 'border-success';
      } else if (index === currentIndex) {
        bgColor = 'bg-primary';
        textColor = 'text-primary-foreground';
        borderColor = 'border-primary';
      } else if (searchRange && (index < searchRange.left || index > searchRange.right)) {
        bgColor = 'bg-muted';
        textColor = 'text-muted-foreground';
      } else if (searchRange && index >= searchRange.left && index <= searchRange.right) {
        bgColor = 'bg-warning/20';
        borderColor = 'border-warning';
      }

      return (
        <div key={index} className="flex flex-col items-center">
          <div className="text-xs text-muted-foreground mb-1">{index}</div>
          <div
            className={`
              w-14 h-14 flex items-center justify-center border-2 rounded-lg
              font-mono text-sm font-bold transition-all duration-300
              ${bgColor} ${textColor} ${borderColor}
              ${index === currentIndex ? 'animate-pulse scale-110' : ''}
              ${index === foundIndex ? 'animate-bounce' : ''}
            `}
          >
            {value}
          </div>
        </div>
      );
    });
  }, [array, currentIndex, searchRange, foundIndex]);

  return (
    <div className="w-full space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <div className="flex gap-2 items-center">
          <Input
            value={inputArray}
            onChange={(e) => setInputArray(e.target.value)}
            placeholder="Enter sorted numbers (comma separated)"
            className="w-64"
            disabled={isAnimating}
          />
          <Button onClick={updateArray} disabled={isAnimating} variant="outline">
            Update
          </Button>
        </div>

        <div className="flex gap-2 items-center">
          <Target className="h-4 w-4" />
          <Input
            type="number"
            value={target}
            onChange={(e) => setTarget(parseInt(e.target.value) || 0)}
            placeholder="Target"
            className="w-24"
            disabled={isAnimating}
          />
        </div>

        <Select value={algorithm} onValueChange={(value: SearchAlgorithm) => setAlgorithm(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="linear">Linear Search</SelectItem>
            <SelectItem value="binary">Binary Search</SelectItem>
            <SelectItem value="interpolation">Interpolation Search</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={runSearch} disabled={isAnimating} className="flex items-center gap-1">
          <Search className="h-4 w-4" />
          Search
        </Button>

        <Button onClick={resetSearch} disabled={isAnimating} variant="outline" className="flex items-center gap-1">
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>

      {/* Visualization */}
      <div className="bg-gradient-visualization rounded-xl border-2 border-border/50 p-6">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="flex gap-2 flex-wrap">
              {renderArray()}
            </div>
          </div>

          {searchRange && algorithm !== 'linear' && (
            <div className="text-center p-2 bg-warning/10 rounded-lg border border-warning/30">
              <span className="text-sm font-medium">
                Search Range: [{searchRange.left}, {searchRange.right}]
              </span>
            </div>
          )}

          <div className="flex justify-center gap-4 text-sm">
            <div>Target: <span className="font-bold text-primary">{target}</span></div>
            <div>Comparisons: <span className="font-bold text-primary">{comparisons}</span></div>
            {foundIndex >= 0 && (
              <div>Found at: <span className="font-bold text-success">{foundIndex}</span></div>
            )}
          </div>

          {currentStep && (
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <p className="text-sm font-medium">{currentStep}</p>
            </div>
          )}
        </div>
      </div>

      {/* Algorithm Info */}
      <div className="bg-muted/20 rounded-lg p-4">
        <h4 className="font-semibold mb-2">Algorithm Complexity</h4>
        <div className="text-sm space-y-1">
          {algorithm === 'linear' && (
            <>
              <div>• <strong>Linear Search:</strong> Check each element sequentially</div>
              <div>• <strong>Time Complexity:</strong> O(n) - May need to check all elements</div>
              <div>• <strong>Space Complexity:</strong> O(1) - No extra space needed</div>
              <div>• <strong>Best for:</strong> Unsorted arrays or small datasets</div>
            </>
          )}
          {algorithm === 'binary' && (
            <>
              <div>• <strong>Binary Search:</strong> Divide and conquer on sorted array</div>
              <div>• <strong>Time Complexity:</strong> O(log n) - Eliminate half each iteration</div>
              <div>• <strong>Space Complexity:</strong> O(1) - Iterative approach</div>
              <div>• <strong>Requirement:</strong> Array must be sorted</div>
            </>
          )}
          {algorithm === 'interpolation' && (
            <>
              <div>• <strong>Interpolation Search:</strong> Estimate position based on value distribution</div>
              <div>• <strong>Time Complexity:</strong> O(log log n) average, O(n) worst case</div>
              <div>• <strong>Space Complexity:</strong> O(1) - No extra space needed</div>
              <div>• <strong>Best for:</strong> Uniformly distributed sorted data</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}