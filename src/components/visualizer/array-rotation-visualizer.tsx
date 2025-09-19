import React, { useState, useCallback, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

import { Play, RotateCcw, RefreshCw, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ComplexityBox } from "@/components/complexity-box";
import { PseudocodeBox } from "@/components/pseudocode-box";
import { MemoryLayout } from "@/components/memory-layout";
import { VisualizerControls } from "@/components/visualizer/visualizer-controls";
import { useVoiceExplain } from "@/hooks/useVoiceExplain";

type RotationMethod = "temp-array" | "reversal" | "cyclic";
type Direction = "left" | "right";

export function ArrayRotationVisualizer() {
  const [array, setArray] = useState([1, 2, 3, 4, 5, 6, 7, 8]);
  const [inputArray, setInputArray] = useState("1,2,3,4,5,6,7,8");
  const [rotateBy, setRotateBy] = useState(3);
  const [method, setMethod] = useState<RotationMethod>("reversal");
  const [direction, setDirection] = useState<Direction>("left");
  const [isAnimating, setIsAnimating] = useState(false);
  const [highlightedIndices, setHighlightedIndices] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState("");
  const [stepCount, setStepCount] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [currentArray, setCurrentArray] = useState<number[]>([]);
  const [showMemory, setShowMemory] = useState(false);

  const { enabled: voiceEnabled, setEnabled: setVoiceEnabled } = useVoiceExplain(currentStep);

  const pseudocode = useMemo(() => ({
    reversal: [
      'k = k % n; if right: k = n - k',
      'reverse(a, 0, n-1)',
      'reverse(a, 0, k-1)',
      'reverse(a, k, n-1)'
    ],
    'temp-array': [
      'k = k % n; if right: k = n - k',
      'temp[(i+n-k)%n] = a[i] for i in 0..n-1',
      'copy temp back to a'
    ],
    cyclic: [
      'k = k % n; if right: k = n - k',
      'for start in 0..n-1 until moved n elements:',
      '  move a[current] to a[(current+n-k)%n] cyclically'
    ]
  }), []);

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const updateArray = useCallback(() => {
    try {
      const newArray = inputArray
        .split(",")
        .map((num) => parseInt(num.trim()))
        .filter((num) => !isNaN(num));
      if (newArray.length === 0) {
        toast.error("Please enter valid numbers");
        return;
      }
      setArray(newArray);
      setCurrentArray([...newArray]);
      toast.success("Array updated");
    } catch {
      toast.error("Invalid array format");
    }
  }, [inputArray]);

  const reverseArray = async (
    arr: number[],
    start: number,
    end: number,
    showStep: string
  ) => {
    setCurrentStep(showStep);
    while (start < end) {
      setHighlightedIndices([start, end]);
      await sleep(600);

      [arr[start], arr[end]] = [arr[end], arr[start]];
      setCurrentArray([...arr]);
      setStepCount((prev) => prev + 1);
      await sleep(400);

      start++;
      end--;
    }
  };

  const rotateArrayReversal = useCallback(async () => {
    const arr = [...array];
    const n = arr.length;
    let k = rotateBy % n;

    if (k === 0) {
      toast.info("No rotation needed");
      return;
    }
    if (direction === "right") k = n - k;

    setCurrentArray([...arr]);
    setCurrentStep("Starting reversal method rotation");
    setStepCount(0);
    setTotalSteps(3);
    await sleep(500);

    await reverseArray(arr, 0, n - 1, `Step 1: Reverse entire array`);
    await reverseArray(arr, 0, k - 1, `Step 2: Reverse first ${k} elements`);
    await reverseArray(arr, k, n - 1, `Step 3: Reverse remaining elements`);

    setHighlightedIndices([]);
    setCurrentStep("✅ Rotation completed using reversal method");
    toast.success(`Array rotated ${direction} by ${rotateBy} positions`);
  }, [array, rotateBy, direction]);

  const rotateArrayTempArray = useCallback(async () => {
    const arr = [...array];
    const n = arr.length;
    let k = rotateBy % n;

    if (k === 0) {
      toast.info("No rotation needed");
      return;
    }
    if (direction === "right") k = n - k;

    setCurrentArray([...arr]);
    setCurrentStep("Creating temporary array");
    setStepCount(0);
    setTotalSteps(n * 2);
    await sleep(500);

    const temp = new Array(n);

    for (let i = 0; i < n; i++) {
      setHighlightedIndices([i]);
      setCurrentStep(
        `Step ${i + 1}: Moving element at index ${i} → ${(i + n - k) % n}`
      );
      temp[(i + n - k) % n] = arr[i];
      setStepCount((prev) => prev + 1);
      await sleep(400);
    }

    for (let i = 0; i < n; i++) {
      setHighlightedIndices([i]);
      arr[i] = temp[i];
      setCurrentArray([...arr]);
      setStepCount((prev) => prev + 1);
      await sleep(300);
    }

    setHighlightedIndices([]);
    setCurrentStep("✅ Rotation completed using temporary array");
    toast.success(`Array rotated ${direction} by ${rotateBy} positions`);
  }, [array, rotateBy, direction]);

  const rotateArrayCyclic = useCallback(async () => {
    const arr = [...array];
    const n = arr.length;
    let k = rotateBy % n;

    if (k === 0) {
      toast.info("No rotation needed");
      return;
    }
    if (direction === "right") k = n - k;

    setCurrentArray([...arr]);
    setCurrentStep("Starting cyclic replacement");
    setStepCount(0);
    setTotalSteps(n);
    await sleep(500);

    let count = 0;
    for (let start = 0; count < n; start++) {
      let current = start;
      let prev = arr[start];

      do {
        const next = (current + n - k) % n;
        [arr[next], prev] = [prev, arr[next]];
        setCurrentArray([...arr]);
        setHighlightedIndices([current, next]);
        setStepCount((prev) => prev + 1);
        setCurrentStep(`Placing element into index ${next}`);
        await sleep(500);
        current = next;
        count++;
      } while (start !== current);
    }

    setHighlightedIndices([]);
    setCurrentStep("✅ Rotation completed using cyclic replacement");
    toast.success(`Array rotated ${direction} by ${rotateBy} positions`);
  }, [array, rotateBy, direction]);

  const rotateArray = useCallback(async () => {
    if (rotateBy <= 0) {
      toast.error("Rotation value must be positive");
      return;
    }

    setIsAnimating(true);
    setHighlightedIndices([]);
    try {
      switch (method) {
        case "reversal":
          await rotateArrayReversal();
          break;
        case "temp-array":
          await rotateArrayTempArray();
          break;
        case "cyclic":
          await rotateArrayCyclic();
          break;
      }
    } catch {
      toast.error("Rotation failed");
    }
    setIsAnimating(false);
  }, [method, rotateArrayReversal, rotateArrayTempArray, rotateArrayCyclic, rotateBy]);

  const resetArray = useCallback(() => {
    setCurrentArray([...array]);
    setHighlightedIndices([]);
    setCurrentStep("");
    setStepCount(0);
    setTotalSteps(0);
    setIsAnimating(false);
    toast.success("Array reset");
  }, [array]);

  const renderArray = useCallback(
    (arr: number[]) => {
      return (
        <div className="flex justify-center gap-2 flex-wrap">
          {arr.map((value, index) => {
            const isHi = highlightedIndices.includes(index);
            return (
              <motion.div
                key={index}
                className="flex flex-col items-center"
                layout
                initial={{ scale: 1, y: 0, opacity: 1 }}
                animate={{ 
                  scale: isHi ? 1.15 : 1, 
                  y: isHi ? -6 : 0, 
                  opacity: 1 
                }}
                transition={{ 
                  duration: 0.4,
                  type: "spring",
                  stiffness: 200,
                  damping: 20
                }}
              >
                <div
                  className={`w-12 h-12 flex items-center justify-center border-2 font-mono text-sm font-semibold rounded transition-all duration-300 ${
                    isHi 
                      ? 'bg-primary text-primary-foreground border-primary shadow-lg' 
                      : 'bg-card border-border hover:border-primary/50'
                  }`}
                >
                  {value}
                </div>
                <span className="text-xs text-muted-foreground mt-1">{index}</span>
              </motion.div>
            );
          })}
        </div>
      );
    },
    [highlightedIndices]
  );

  return (
    <div className="w-full space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <div className="flex gap-2 flex-wrap items-center">
          <Input
            value={inputArray}
            onChange={(e) => setInputArray(e.target.value)}
            placeholder="Enter numbers separated by commas"
            className="w-64"
            disabled={isAnimating}
          />
          <Button onClick={updateArray} disabled={isAnimating} variant="outline">
            Update Array
          </Button>
        </div>

        <div className="flex gap-2 items-center">
          <label className="text-sm font-medium">Rotate by:</label>
          <Input
            type="number"
            value={rotateBy}
            onChange={(e) => setRotateBy(parseInt(e.target.value) || 0)}
            className="w-20"
            min="1"
            disabled={isAnimating}
          />
        </div>

        <Select
          value={method}
          onValueChange={(value: RotationMethod) => setMethod(value)}
        >
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="reversal">Reversal Method</SelectItem>
            <SelectItem value="temp-array">Temporary Array</SelectItem>
            <SelectItem value="cyclic">Cyclic Replacement</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={direction}
          onValueChange={(value: Direction) => setDirection(value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Direction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={rotateArray}
          disabled={isAnimating}
          className="flex items-center gap-1"
        >
          <RefreshCw className="h-4 w-4" />
          Rotate
        </Button>

        <Button
          onClick={resetArray}
          disabled={isAnimating}
          variant="outline"
          className="flex items-center gap-1"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>

      </div>

      {/* Visualization */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 rounded-xl border-2 border-border/50 p-6">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Original Array</h3>
            {renderArray(array)}
          </div>

          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Current State</h3>
            {renderArray(currentArray.length > 0 ? currentArray : array)}
          </div>

          {currentStep && (
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <p className="text-sm font-medium">{currentStep}</p>
              <p className="text-xs text-muted-foreground">
                Step {stepCount} / {totalSteps}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Complexity Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="bg-muted/20 rounded-lg p-4">
          <h4 className="font-semibold mb-2">Key Points</h4>
          <ul className="text-sm space-y-1">
            <li>
              • <strong>Applications:</strong> Circular arrays, scheduling algorithms
            </li>
            <li>
              • <strong>Reversal Method:</strong> Most space-efficient approach
            </li>
            <li>
              • <strong>Direction:</strong> Left rotation by k = Right rotation by n-k
            </li>
            <li>
              • <strong>Edge Case:</strong> k ≥ n, use k % n for optimization
            </li>
          </ul>
        </div>
      </div>

      {/* Pseudocode */}
      <PseudocodeBox
        title={`Array Rotation (${method === 'reversal' ? 'Reversal' : method === 'temp-array' ? 'Temporary Array' : 'Cyclic'}) - Pseudocode`}
        code={pseudocode[method]}
        highlightedLine={
          method === 'reversal' ? (
            currentStep.startsWith('Starting') ? 1 :
            currentStep.includes('Reverse entire array') ? 2 :
            currentStep.includes('Reverse first') ? 3 :
            currentStep.includes('Reverse remaining') ? 4 : 0
          ) : method === 'temp-array' ? (
            currentStep.includes('Creating temporary array') ? 1 :
            currentStep.includes('Moving element') ? 2 :
            currentStep.includes('completed using temporary') ? 3 : 0
          ) : (
            currentStep.includes('Starting cyclic') ? 1 :
            currentStep.includes('Placing element') ? 3 : 0
          )
        }
      />
    </div>
  );
}
