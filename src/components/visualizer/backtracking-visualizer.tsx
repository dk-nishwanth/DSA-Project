import React, { useState, useCallback } from 'react';
import { Play, RotateCcw, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { PseudocodeBox } from '@/components/pseudocode-box';
import { ComplexityBox } from '@/components/complexity-box';

type BacktrackProblem = 'n-queens' | 'sudoku' | 'maze';

interface QueenPosition {
  row: number;
  col: number;
}

const pseudocode: Record<BacktrackProblem, string[]> = {
  'n-queens': [
    "function solveNQueens(board, row):",
    "  if row == N:",
    "    return true  // All queens placed",
    "  for col = 0 to N-1:",
    "    if isSafe(board, row, col):",
    "      board[row][col] = 1",
    "      if solveNQueens(board, row + 1):",
    "        return true",
    "      board[row][col] = 0  // backtrack",
    "  return false"
  ],
  'sudoku': [
    "function solveSudoku(board):",
    "  for row = 0 to 8:",
    "    for col = 0 to 8:",
    "      if board[row][col] == 0:",
    "        for num = 1 to 9:",
    "          if isValid(board, row, col, num):",
    "            board[row][col] = num",
    "            if solveSudoku(board):",
    "              return true",
    "            board[row][col] = 0  // backtrack",
    "        return false",
    "  return true"
  ],
  'maze': [
    "function solveMaze(maze, x, y):",
    "  if x == N-1 and y == N-1:",
    "    return true  // reached destination",
    "  if isSafe(maze, x, y):",
    "    maze[x][y] = 1  // mark as path",
    "    if solveMaze(maze, x+1, y) or",
    "       solveMaze(maze, x, y+1):",
    "      return true",
    "    maze[x][y] = 0  // backtrack",
    "  return false"
  ]
};

export function BacktrackingVisualizer() {
  const [problem, setProblem] = useState<BacktrackProblem>('n-queens');
  const [boardSize, setBoardSize] = useState(4);
  const [isAnimating, setIsAnimating] = useState(false);
  const [queens, setQueens] = useState<QueenPosition[]>([]);
  const [attackedSquares, setAttackedSquares] = useState<Set<string>>(new Set());
  const [currentStep, setCurrentStep] = useState(0);
  const [currentStepDescription, setCurrentStepDescription] = useState('');
  const [solutions, setSolutions] = useState<QueenPosition[][]>([]);
  const [currentTry, setCurrentTry] = useState<{row: number, col: number} | null>(null);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const isSquareAttacked = useCallback((row: number, col: number, queenPositions: QueenPosition[]) => {
    for (const queen of queenPositions) {
      if (queen.row === row || queen.col === col || 
          Math.abs(queen.row - row) === Math.abs(queen.col - col)) {
        return true;
      }
    }
    return false;
  }, []);

  const updateAttackedSquares = useCallback((queenPositions: QueenPosition[]) => {
    const attacked = new Set<string>();
    
    for (const queen of queenPositions) {
      // Row and column attacks
      for (let i = 0; i < boardSize; i++) {
        attacked.add(`${queen.row}-${i}`);
        attacked.add(`${i}-${queen.col}`);
      }
      
      // Diagonal attacks
      for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
          if (Math.abs(queen.row - i) === Math.abs(queen.col - j)) {
            attacked.add(`${i}-${j}`);
          }
        }
      }
    }
    
    setAttackedSquares(attacked);
  }, [boardSize]);

  const solveNQueens = useCallback(async (row: number = 0, currentQueens: QueenPosition[] = []): Promise<boolean> => {
    if (row === boardSize) {
      setSolutions(prev => [...prev, [...currentQueens]]);
      setCurrentStepDescription(`Solution found! Placed all ${boardSize} queens.`);
      setCurrentStep(1);
      await sleep(1000);
      return true;
    }

    for (let col = 0; col < boardSize; col++) {
      setCurrentTry({ row, col });
      setCurrentStepDescription(`Trying to place queen at position (${row}, ${col})`);
      setCurrentStep(3);
      
      setQueens([...currentQueens, { row, col }]);
      updateAttackedSquares([...currentQueens, { row, col }]);
      
      await sleep(800);

      if (!isSquareAttacked(row, col, currentQueens)) {
        setCurrentStepDescription(`Position (${row}, ${col}) is safe! Placing queen.`);
        setCurrentStep(4);
        await sleep(600);
        
        const newQueens = [...currentQueens, { row, col }];
        setQueens(newQueens);
        updateAttackedSquares(newQueens);
        
        if (await solveNQueens(row + 1, newQueens)) {
          return true;
        }
        
        // Backtrack
        setCurrentStepDescription(`Backtracking from position (${row}, ${col})`);
        setCurrentStep(8);
        setQueens(currentQueens);
        updateAttackedSquares(currentQueens);
        await sleep(600);
      } else {
        setCurrentStepDescription(`Position (${row}, ${col}) is under attack! Trying next position.`);
        setQueens(currentQueens);
        updateAttackedSquares(currentQueens);
        await sleep(400);
      }
    }

    setCurrentTry(null);
    setCurrentStepDescription(`No valid position found in row ${row}. Backtracking...`);
    setCurrentStep(9);
    await sleep(600);
    return false;
  }, [boardSize, isSquareAttacked, updateAttackedSquares]);

  const runBacktracking = useCallback(async () => {
    if (boardSize < 1 || boardSize > 8) {
      toast.error('Board size must be between 1 and 8');
      return;
    }

    setIsAnimating(true);
    setQueens([]);
    setAttackedSquares(new Set());
    setSolutions([]);
    setCurrentTry(null);
    setCurrentStepDescription('Starting N-Queens backtracking algorithm...');
    setCurrentStep(0);
    
    await sleep(800);

    try {
      const foundSolution = await solveNQueens();
      
      if (foundSolution) {
        toast.success(`Found solution for ${boardSize}-Queens!`);
      } else {
        setCurrentStepDescription(`No solution exists for ${boardSize}-Queens problem.`);
        toast.error('No solution found');
      }
    } catch (error) {
      toast.error('Algorithm failed');
    }

    setCurrentTry(null);
    setIsAnimating(false);
  }, [boardSize, solveNQueens]);

  const resetBacktracking = useCallback(() => {
    setQueens([]);
    setAttackedSquares(new Set());
    setSolutions([]);
    setCurrentTry(null);
    setCurrentStepDescription('');
    setCurrentStep(0);
    setIsAnimating(false);
    toast.success('Board reset');
  }, []);

  const renderChessBoard = useCallback(() => {
    const squares = [];
    
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        const isQueen = queens.some(q => q.row === row && q.col === col);
        const isAttacked = attackedSquares.has(`${row}-${col}`);
        const isTrying = currentTry?.row === row && currentTry?.col === col;
        const isLight = (row + col) % 2 === 0;
        
        squares.push(
          <div
            key={`${row}-${col}`}
            className={`
              w-12 h-12 flex items-center justify-center border border-border/30
              relative transition-all duration-300 text-lg
              ${isLight ? 'bg-amber-50 dark:bg-amber-950/20' : 'bg-amber-900/20 dark:bg-amber-900/40'}
              ${isAttacked && !isQueen ? 'bg-destructive/20' : ''}
              ${isTrying ? 'bg-warning animate-pulse' : ''}
              ${isQueen ? 'bg-success/30' : ''}
            `}
          >
            {isQueen && <Crown className="h-6 w-6 text-primary" />}
            {isTrying && !isQueen && (
              <div className="w-3 h-3 bg-warning rounded-full animate-ping" />
            )}
            <div className="absolute top-0 left-0 text-[8px] text-muted-foreground p-0.5">
              {row},{col}
            </div>
          </div>
        );
      }
    }

    return (
      <div 
        className="inline-grid gap-0 border-2 border-border rounded"
        style={{ gridTemplateColumns: `repeat(${boardSize}, 1fr)` }}
      >
        {squares}
      </div>
    );
  }, [boardSize, queens, attackedSquares, currentTry]);

  return (
    <div className="w-full space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <Select value={problem} onValueChange={(value: BacktrackProblem) => setProblem(value)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="n-queens">N-Queens Problem</SelectItem>
            <SelectItem value="sudoku">Sudoku Solver</SelectItem>
            <SelectItem value="maze">Maze Solver</SelectItem>
          </SelectContent>
        </Select>

        {problem === 'n-queens' && (
          <div className="flex gap-2 items-center">
            <label className="text-sm font-medium">Board Size:</label>
            <Select 
              value={boardSize.toString()} 
              onValueChange={(value) => setBoardSize(parseInt(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[4,5,6,7,8].map(size => (
                  <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <Button onClick={runBacktracking} disabled={isAnimating} className="flex items-center gap-1">
          <Play className="h-4 w-4" />
          Solve
        </Button>

        <Button onClick={resetBacktracking} disabled={isAnimating} variant="outline" className="flex items-center gap-1">
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>

      {/* Solutions Display */}
      {solutions.length > 0 && (
        <div className="p-4 bg-success/10 border-2 border-success rounded-xl text-center">
          <div className="text-lg font-semibold text-success">
            Solutions Found: {solutions.length}
          </div>
        </div>
      )}

      {/* Visualization */}
      <div className="bg-gradient-visualization rounded-xl border-2 border-border/50 p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center">
            {problem === 'n-queens' && `${boardSize}-Queens Problem`}
            {problem === 'sudoku' && 'Sudoku Solver'}
            {problem === 'maze' && 'Maze Solver'}
          </h3>
          
          <div className="flex justify-center">
            {problem === 'n-queens' ? renderChessBoard() : (
              <div className="text-center text-muted-foreground py-8">
                {problem} visualization coming soon!
              </div>
            )}
          </div>

          <div className="flex justify-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Crown className="h-4 w-4 text-primary" />
              <span>Queen</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-destructive/40 rounded" />
              <span>Attacked</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-warning rounded" />
              <span>Trying</span>
            </div>
          </div>

          {currentStepDescription && (
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <p className="text-sm font-medium">{currentStepDescription}</p>
            </div>
          )}
        </div>
      </div>

      {/* Pseudocode */}
      <PseudocodeBox 
        title={`${problem.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} - Pseudocode`}
        code={pseudocode[problem]} 
        highlightedLine={currentStep}
      />

      {/* Complexity Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ComplexityBox
          title="Time Complexity"
          timeComplexity={
            problem === 'n-queens' ? 'O(N!)' :
            problem === 'sudoku' ? 'O(9^(n*n))' :
            'O(4^(n*m))'
          }
          spaceComplexity={
            problem === 'n-queens' ? 'O(N²)' :
            problem === 'sudoku' ? 'O(n²)' :
            'O(n*m)'
          }
          description="Exponential time due to exhaustive search with backtracking"
        />
        
        <div className="bg-muted/20 rounded-lg p-4">
          <h4 className="font-semibold mb-2">Backtracking Properties</h4>
          <ul className="text-sm space-y-1">
            <li>• <strong>Exhaustive Search:</strong> Tries all possible solutions</li>
            <li>• <strong>Pruning:</strong> Abandons invalid partial solutions</li>
            <li>• <strong>Recursive:</strong> Uses recursion with base cases</li>
            <li>• <strong>Undoes Choices:</strong> Backtracks when stuck</li>
          </ul>
        </div>
      </div>
    </div>
  );
}