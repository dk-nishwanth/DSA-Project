import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PseudocodeBox } from '@/components/pseudocode-box';
import { ComplexityBox } from '@/components/complexity-box';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';
import { toast } from 'sonner';

export function NQueensVisualizer() {
  const [nInput, setNInput] = useState('4');
  const [board, setBoard] = useState<number[]>([]); // board[row] = col or -1
  const [isRunning, setIsRunning] = useState(false);
  const [solutions, setSolutions] = useState<number[][]>([]);
  const [currentRow, setCurrentRow] = useState<number>(0);
  const [tryingCol, setTryingCol] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [currentStepDescription, setCurrentStepDescription] = useState<string>('');
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

  const isSafe = (b: number[], row: number, col: number) => {
    for (let r=0; r<row; r++) {
      const c = b[r];
      if (c === col || Math.abs(r-row) === Math.abs(c-col)) return false;
    }
    return true;
  };

  const isThreatened = (b: number[], row: number, col: number) => {
    for (let r=0; r<row; r++) {
      const c = b[r];
      if (c === col || Math.abs(r-row) === Math.abs(c-col)) return true;
    }
    return false;
  };

  const run = useCallback(async () => {
    if (isRunning) return; 
    setIsRunning(true);
    const n = Math.max(4, Math.min(10, parseInt(nInput)||4));
    const b = new Array(n).fill(-1);
    setBoard([...b]); 
    setSolutions([]);
    const sols: number[][] = [];
    setCurrentRow(0);
    setTryingCol(null);
    setCurrentStep(1);
    setCurrentStepDescription('Start backtracking from row 0');
    
    speakOperation("N-Queens Problem", `Starting N-Queens backtracking algorithm for ${n}x${n} board. We need to place ${n} queens so that none attack each other.`);

    const backtrack = async (row: number): Promise<boolean> => {
      setCurrentRow(row);
      if (row === n) {
        sols.push([...b]);
        setSolutions(sols.map(s=>[...s]));
        setCurrentStep(6);
        setCurrentStepDescription('Solution found; backtrack to find more');
        speakStep("", `Solution found! All ${n} queens placed successfully. This is solution number ${sols.length}.`, row, n);
        return false; // continue to find all solutions
      }
      setCurrentStep(2);
      setCurrentStepDescription(`Try placing a queen in row ${row}`);
      speakStep("", `Trying to place queen in row ${row}. Checking each column for safe positions.`, row + 1, n);
      for (let col=0; col<n; col++) {
        setTryingCol(col);
        setCurrentStep(3);
        setCurrentStepDescription(`Check if position (row ${row}, col ${col}) is safe`);
        await sleep(120);
        if (isSafe(b, row, col)) {
          setCurrentStep(4);
          setCurrentStepDescription(`Place queen at (row ${row}, col ${col}) and move to next row`);
          b[row] = col; setBoard([...b]);
          await sleep(160);
          const stop = await backtrack(row+1);
          if (stop) return true;
          setCurrentStep(5);
          setCurrentStepDescription(`Backtrack: remove queen from (row ${row}, col ${col})`);
          b[row] = -1; setBoard([...b]);
          await sleep(120);
        }
      }
      return false;
    };

    await backtrack(0);
    setIsRunning(false);
  }, [nInput, isRunning]);

  const n = board.length || Math.max(4, Math.min(10, parseInt(nInput)||4));

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2 p-4 bg-muted/30 rounded-xl border flex-wrap">
        <div className="flex items-center gap-2"><span className="text-sm">n</span><Input className="w-20" value={nInput} onChange={e=>setNInput(e.target.value)} /></div>
        <Button onClick={run} disabled={isRunning}>Run</Button>
      </div>
      <div className="p-4 bg-card rounded-xl border">
        <div className="grid" style={{gridTemplateColumns:`repeat(${n}, 36px)`}}>
          {Array.from({length:n*n}).map((_,idx)=>{
            const r = Math.floor(idx/n), c = idx % n;
            const hasQ = board[r]===c;
            const dark = (r+c)%2===1;
            const isCurrentRow = r===currentRow;
            const threatened = tryingCol!==null && isCurrentRow && isThreatened(board, r, c);
            const trying = isCurrentRow && c===tryingCol && board[r]===-1;
            return (
              <div
                key={idx}
                className={`w-9 h-9 flex items-center justify-center text-sm border transition-all
                  ${dark?'bg-muted/40':'bg-card'}
                  ${hasQ?'bg-primary/20 border-primary':''}
                  ${trying?'bg-warning/30 border-warning':''}
                  ${threatened?'bg-destructive/20 border-destructive':''}
                `}
                title={hasQ?`Q @ (${r},${c})`: trying?`Trying (${r},${c})`: threatened?`Threatened`:''}
              >{hasQ?'♛':''}</div>
            );
          })}
        </div>
        {currentStepDescription && (
          <div className="mt-3 p-2 bg-muted/20 rounded text-sm text-center">{currentStepDescription}</div>
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
          data={board.map((c,i)=>`row ${i}: col ${c}`)}
          title="Board mapping (row -> col)"
          baseAddress={9800}
          wordSize={1}
        />
      )}

      {solutions.length>0 && (
        <div className="p-3 bg-muted/20 rounded border text-sm">Solutions found: <span className="font-mono">{solutions.length}</span></div>
      )}
      <PseudocodeBox
        title="N-Queens Backtracking - Pseudocode"
        code={[
          'backtrack(row):',
          '  if row == n: record solution; return',
          '  for col in 0..n-1:',
          '    if isSafe(row, col):',
          '      place queen at (row,col)',
          '      backtrack(row+1)',
          '      remove queen at (row,col)'
        ]}
        highlightedLine={currentStep}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ComplexityBox
          title="Time Complexity"
          timeComplexity="O(n!)"
          spaceComplexity="O(n)"
          description="Backtracking explores placements row by row, pruning unsafe positions (columns and diagonals)."
        />
        <div className="bg-muted/20 rounded p-3 text-sm">
          <div className="font-semibold mb-2">Key Properties</div>
          <ul className="space-y-1">
            <li>• A queen attacks along row, column, and diagonals.</li>
            <li>• Place exactly one queen per row; check safety before placing.</li>
            <li>• Backtrack by removing the last queen and trying next column.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
