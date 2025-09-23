import React, { useState, useCallback } from 'react';
import { Play, RotateCcw, Grid3x3, HardDrive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';

type DPProblem = 'lcs' | 'knapsack' | 'coin-change' | 'lis';

interface DPCell {
  value: number;
  isActive?: boolean;
  isResult?: boolean;
  calculation?: string;
}

export function DPVisualizer() {
  const [problem, setProblem] = useState<DPProblem>('lcs');
  const [string1, setString1] = useState('ABCDGH');
  const [string2, setString2] = useState('AEDFHR');
  const [isAnimating, setIsAnimating] = useState(false);
  const [dpTable, setDpTable] = useState<DPCell[][]>([]);
  const [currentCell, setCurrentCell] = useState<{row: number, col: number} | null>(null);
  const [currentStep, setCurrentStep] = useState('');
  const [result, setResult] = useState<any>(null);
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
  } = useVisualizerVoice({ minInterval: 2500 });

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const initializeDPTable = useCallback((rows: number, cols: number) => {
    return Array(rows).fill(null).map(() => 
      Array(cols).fill(null).map(() => ({ value: 0 }))
    );
  }, []);

  const updateCell = useCallback(async (row: number, col: number, value: number, calculation?: string) => {
    setCurrentCell({ row, col });
    setDpTable(prev => prev.map((r, i) => 
      r.map((cell, j) => ({
        ...cell,
        isActive: i === row && j === col,
        ...(i === row && j === col ? { value, calculation } : {})
      }))
    ));
    await sleep(400);
  }, []);

  const solveLCS = useCallback(async () => {
    const m = string1.length;
    const n = string2.length;
    const table = initializeDPTable(m + 1, n + 1);
    setDpTable(table);
    
    speakOperation("Longest Common Subsequence", `Starting LCS algorithm for strings "${string1}" and "${string2}". We'll build a DP table where each cell represents the LCS length for substrings.`);
    setCurrentStep('Initializing DP table for Longest Common Subsequence');
    await sleep(800);

    // Fill the DP table
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const char1 = string1[i - 1];
        const char2 = string2[j - 1];
        
        if (char1 === char2) {
          const value = table[i - 1][j - 1].value + 1;
          const calculation = `${char1}==${char2}: dp[${i-1}][${j-1}] + 1 = ${value}`;
          await updateCell(i, j, value, calculation);
          setCurrentStep(`Match found: ${char1} == ${char2}. LCS length = ${value}`);
          speakStep("", `Characters match! ${char1} equals ${char2}. We extend the diagonal LCS by 1, making the length ${value}.`, i * n + j, m * n);
        } else {
          const value = Math.max(table[i - 1][j].value, table[i][j - 1].value);
          const calculation = `${char1}!=${char2}: max(${table[i-1][j].value}, ${table[i][j-1].value}) = ${value}`;
          await updateCell(i, j, value, calculation);
          setCurrentStep(`No match: taking max of left (${table[i][j-1].value}) and top (${table[i-1][j].value})`);
          speakStep("", `Characters don't match. ${char1} is not equal to ${char2}. Taking maximum from left cell (${table[i][j-1].value}) and top cell (${table[i-1][j].value}), which is ${value}.`, i * n + j, m * n);
        }
        
        await sleep(300);
      }
    }

    // Mark result cell
    setDpTable(prev => prev.map((r, i) => 
      r.map((cell, j) => ({
        ...cell,
        isResult: i === m && j === n,
        isActive: false
      }))
    ));

    const lcsLength = table[m][n].value;
    setResult({ type: 'LCS Length', value: lcsLength });
    setCurrentStep(`Longest Common Subsequence length: ${lcsLength}`);
    speakResult(`LCS algorithm complete! The longest common subsequence between "${string1}" and "${string2}" has length ${lcsLength}. The DP table shows how we built this solution step by step.`);
    setCurrentCell(null);
  }, [string1, string2, initializeDPTable, updateCell, speakOperation, speakStep, speakResult]);

  const solve01Knapsack = useCallback(async () => {
    // Simplified knapsack with predefined values
    const weights = [1, 3, 4, 5];
    const values = [1, 4, 5, 7];
    const capacity = 7;
    
    const table = initializeDPTable(weights.length + 1, capacity + 1);
    setDpTable(table);
    
    speakOperation("0/1 Knapsack Problem", `Solving 0/1 Knapsack with capacity ${capacity}. We have ${weights.length} items with different weights and values. Each cell will store the maximum value achievable.`);
    setCurrentStep('Solving 0/1 Knapsack Problem');
    await sleep(800);

    for (let i = 1; i <= weights.length; i++) {
      for (let w = 1; w <= capacity; w++) {
        const weight = weights[i - 1];
        const value = values[i - 1];
        
        if (weight <= w) {
          const include = table[i - 1][w - weight].value + value;
          const exclude = table[i - 1][w].value;
          const maxValue = Math.max(include, exclude);
          
          await updateCell(i, w, maxValue, 
            `Item ${i}: max(include: ${include}, exclude: ${exclude}) = ${maxValue}`);
          setCurrentStep(`Item ${i} (w=${weight}, v=${value}): ${maxValue}`);
        } else {
          const value = table[i - 1][w].value;
          await updateCell(i, w, value, `Weight ${weight} > ${w}, exclude item`);
          setCurrentStep(`Item ${i} too heavy for capacity ${w}`);
        }
        
        await sleep(300);
      }
    }

    setResult({ type: 'Max Value', value: table[weights.length][capacity].value });
    speakResult(`Knapsack algorithm complete! Maximum value achievable with capacity ${capacity} is ${table[weights.length][capacity].value}. The DP table shows optimal decisions for each item and capacity combination.`);
    setCurrentCell(null);
  }, [initializeDPTable, updateCell, speakOperation, speakResult]);

  const runDP = useCallback(async () => {
    if (problem === 'lcs' && (!string1.trim() || !string2.trim())) {
      toast.error('Please enter both strings');
      return;
    }

    setIsAnimating(true);
    setCurrentCell(null);
    setResult(null);
    setCurrentStep('');

    try {
      switch (problem) {
        case 'lcs':
          await solveLCS();
          break;
        case 'knapsack':
          await solve01Knapsack();
          break;
        default:
          toast.info(`${problem} visualization coming soon!`);
          break;
      }
    } catch (error) {
      toast.error('DP algorithm failed');
    }

    setIsAnimating(false);
  }, [problem, solveLCS, solve01Knapsack, string1, string2]);

  const resetDP = useCallback(() => {
    setDpTable([]);
    setCurrentCell(null);
    setResult(null);
    setCurrentStep('');
    setIsAnimating(false);
    toast.success('DP table reset');
  }, []);

  const renderDPTable = useCallback(() => {
    if (dpTable.length === 0) return null;

    return (
      <div className="overflow-x-auto">
        <table className="border-collapse">
          <tbody>
            {dpTable.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} className="p-0">
                    <div
                      className={`
                        w-16 h-16 border border-border flex flex-col items-center justify-center
                        text-xs font-mono transition-all duration-300 relative
                        ${cell.isActive ? 'bg-primary text-primary-foreground animate-pulse' : 'bg-card'}
                        ${cell.isResult ? 'bg-success text-success-foreground ring-2 ring-success' : ''}
                      `}
                    >
                      <div className="font-bold">{cell.value}</div>
                      {currentCell?.row === i && currentCell?.col === j && cell.calculation && (
                        <div className="absolute top-full left-0 z-10 bg-popover border rounded p-2 text-xs whitespace-nowrap shadow-lg">
                          {cell.calculation}
                        </div>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }, [dpTable, currentCell]);

  const renderInputs = () => {
    if (problem === 'lcs') {
      return (
        <div className="flex gap-3">
          <div>
            <label className="text-sm font-medium">String 1:</label>
            <Input
              value={string1}
              onChange={(e) => setString1(e.target.value.toUpperCase())}
              className="w-32 font-mono"
              disabled={isAnimating}
            />
          </div>
          <div>
            <label className="text-sm font-medium">String 2:</label>
            <Input
              value={string2}
              onChange={(e) => setString2(e.target.value.toUpperCase())}
              className="w-32 font-mono"
              disabled={isAnimating}
            />
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <Select value={problem} onValueChange={(value: DPProblem) => setProblem(value)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lcs">Longest Common Subsequence</SelectItem>
            <SelectItem value="knapsack">0/1 Knapsack</SelectItem>
            <SelectItem value="coin-change">Coin Change</SelectItem>
            <SelectItem value="lis">Longest Increasing Subsequence</SelectItem>
          </SelectContent>
        </Select>

        {renderInputs()}

        <Button onClick={runDP} disabled={isAnimating} className="flex items-center gap-1">
          <Grid3x3 className="h-4 w-4" />
          Solve DP
        </Button>

        <Button onClick={resetDP} disabled={isAnimating} variant="outline" className="flex items-center gap-1">
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>

      {/* Result Display */}
      {result && (
        <div className="p-4 bg-success/10 border-2 border-success rounded-xl text-center">
          <div className="text-lg font-semibold text-success">
            {result.type}: {result.value}
          </div>
        </div>
      )}

      {/* Visualization */}
      <div className="bg-gradient-visualization rounded-xl border-2 border-border/50 p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center">
            DP Table - {problem.toUpperCase().replace('-', ' ')}
          </h3>
          
          <div className="flex justify-center">
            {dpTable.length > 0 ? renderDPTable() : (
              <div className="text-center text-muted-foreground py-8">
                Click "Solve DP" to generate the table
              </div>
            )}
          </div>

          {problem === 'lcs' && string1 && string2 && (
            <div className="flex justify-center gap-4 text-sm">
              <div>String 1: <span className="font-mono font-bold">{string1}</span></div>
              <div>String 2: <span className="font-mono font-bold">{string2}</span></div>
            </div>
          )}

          {currentStep && (
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <p className="text-sm font-medium">{currentStep}</p>
            </div>
          )}
        </div>
      </div>

      {/* Algorithm Info */}
      <div className="bg-muted/20 rounded-lg p-4">
        <h4 className="font-semibold mb-2">Dynamic Programming Analysis</h4>
        <div className="text-sm space-y-1">
          {problem === 'lcs' && (
            <>
              <div>• <strong>LCS Problem:</strong> Find longest common subsequence between two strings</div>
              <div>• <strong>Time Complexity:</strong> O(m×n) where m, n are string lengths</div>
              <div>• <strong>Space Complexity:</strong> O(m×n) for the DP table</div>
              <div>• <strong>Recurrence:</strong> If chars match: dp[i][j] = dp[i-1][j-1] + 1</div>
            </>
          )}
          {problem === 'knapsack' && (
            <>
              <div>• <strong>0/1 Knapsack:</strong> Maximize value within weight capacity</div>
              <div>• <strong>Time Complexity:</strong> O(n×W) where n = items, W = capacity</div>
              <div>• <strong>Space Complexity:</strong> O(n×W) for the DP table</div>
              <div>• <strong>Decision:</strong> For each item, choose to include or exclude</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}