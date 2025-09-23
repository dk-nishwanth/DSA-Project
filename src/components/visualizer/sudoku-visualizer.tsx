import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PseudocodeBox } from '@/components/pseudocode-box';
import { ComplexityBox } from '@/components/complexity-box';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';
import { toast } from 'sonner';

type Grid = number[][]; // 0 denotes empty

function clone(g: Grid): Grid { return g.map(r => r.slice()); }

function isValid(g: Grid, r: number, c: number, v: number): boolean {
  for (let i=0;i<9;i++) if (g[r][i]===v || g[i][c]===v) return false;
  const br = Math.floor(r/3)*3, bc = Math.floor(c/3)*3;
  for (let i=0;i<3;i++) for (let j=0;j<3;j++) if (g[br+i][bc+j]===v) return false;
  return true;
}

const SAMPLE: Grid = [
  [5,3,0,0,7,0,0,0,0],
  [6,0,0,1,9,5,0,0,0],
  [0,9,8,0,0,0,0,6,0],
  [8,0,0,0,6,0,0,0,3],
  [4,0,0,8,0,3,0,0,1],
  [7,0,0,0,2,0,0,0,6],
  [0,6,0,0,0,0,2,8,0],
  [0,0,0,4,1,9,0,0,5],
  [0,0,0,0,8,0,0,7,9]
];

export function SudokuVisualizer() {
  const [grid, setGrid] = useState<Grid>(clone(SAMPLE));
  const [cur, setCur] = useState<{r:number,c:number}|null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [stepDesc, setStepDesc] = useState('');
  const [showMemory, setShowMemory] = useState(false);
  const [currentValue, setCurrentValue] = useState<number | null>(null);
  
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

  const solve = useCallback(async () => {
    if (isRunning) return; 
    setIsRunning(true);
    speakOperation("Sudoku Solver", `Starting Sudoku backtracking algorithm. We'll fill empty cells systematically, backtracking when constraints are violated.`);
    
    const g = clone(grid);
    const cells: Array<[number, number]> = [];
    for (let r=0;r<9;r++) for (let c=0;c<9;c++) if (g[r][c]===0) cells.push([r,c]);

    const backtrack = async (idx: number): Promise<boolean> => {
      if (idx === cells.length) return true;
      const [r,c] = cells[idx];
      setCur({r,c});
      setStep(1);
      setStepDesc(`Pick next empty cell at (row ${r+1}, col ${c+1}) and try 1..9`);
      for (let v=1; v<=9; v++) {
        if (isValid(g, r, c, v)) {
          setStep(2);
          setStepDesc(`Place ${v} (valid in row/col/box). Recurse to next cell.`);
          g[r][c] = v; setGrid(clone(g)); await sleep(80);
          if (await backtrack(idx+1)) return true;
          setStep(3);
          setStepDesc(`Backtrack: remove ${v} from (row ${r+1}, col ${c+1})`);
          g[r][c] = 0; setGrid(clone(g)); await sleep(60);
        }
      }
      return false;
    };

    await backtrack(0);
    setIsRunning(false);
  }, [grid, isRunning]);

  const reset = () => { setGrid(clone(SAMPLE)); setCur(null); setIsRunning(false); };

  const candidates = useMemo(()=>{
    if (!cur) return [] as number[];
    const {r,c} = cur;
    const vals: number[] = [];
    for (let v=1; v<=9; v++) if (isValid(grid, r, c, v)) vals.push(v);
    return vals;
  }, [cur, grid]);

  const pseudocode = [
    'solve(grid):',
    '  list empty = all empty cells',
    '  backtrack(idx):',
    '    if idx == empty.length: return true',
    '    (r,c) = empty[idx]',
    '    for v in 1..9:',
    '      if valid(r,c,v):',
    '        grid[r][c] = v',
    '        if backtrack(idx+1): return true',
    '        grid[r][c] = 0',
    '    return false'
  ];

  return (
    <div className="w-full space-y-4">
      <div className="flex gap-2 items-center p-4 bg-muted/30 rounded-xl border">
        <Button onClick={solve} disabled={isRunning}>Solve</Button>
        <Button onClick={reset} variant="outline" disabled={isRunning}>Reset</Button>
      </div>
      <div className="p-4 bg-card rounded-xl border">
        <div className="grid" style={{gridTemplateColumns:'repeat(9, 36px)'}}>
          {Array.from({length:81}).map((_,i)=>{
            const r = Math.floor(i/9), c = i%9;
            const v = grid[r][c];
            const boxBorder = (r%3===0? 'border-t-2 ' : '') + (c%3===0? 'border-l-2 ' : '') + ((r+1)%3===0? 'border-b-2 ' : '') + ((c+1)%3===0? 'border-r-2 ' : '');
            const isCur = cur && cur.r===r && cur.c===c;
            return (
              <div key={i} className={`w-9 h-9 flex items-center justify-center border transition-all ${boxBorder} ${isCur?'bg-warning/20 scale-105':''}`}>
                <span className="font-mono text-sm">{v===0? '' : v}</span>
              </div>
            );
          })}
        </div>
      </div>
      {cur && (
        <div className="bg-muted/20 rounded-lg p-3 text-sm">
          <div className="font-semibold">Current cell: (row {cur.r+1}, col {cur.c+1})</div>
          <div className="mt-1">Valid candidates: <span className="font-mono">[{candidates.join(', ') || 'none'}]</span></div>
          {stepDesc && <div className="mt-2 p-2 bg-muted/30 rounded">{stepDesc}</div>}
        </div>
      )}
      <PseudocodeBox title="Sudoku Backtracking - Pseudocode" code={pseudocode} highlightedLine={step} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ComplexityBox
          title="Time Complexity"
          timeComplexity="Up to O(9^(empty))"
          spaceComplexity="O(81)"
          description="Backtracking fills empty cells with values 1..9 respecting row/column/box constraints."
        />
        <div className="bg-muted/20 rounded p-3 text-sm">
          <div className="font-semibold mb-2">Key Properties</div>
          <ul className="space-y-1">
            <li>• Constraint checking ensures only valid numbers are placed.</li>
            <li>• Backtracking removes values when a dead-end is reached.</li>
            <li>• Order of empty cells can impact performance.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
