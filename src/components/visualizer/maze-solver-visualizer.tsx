import React, { useState } from 'react';
import { Play, RotateCcw, Info } from 'lucide-react';

type Cell = 0 | 1 | 2 | 3; // 0: path, 1: wall, 2: visited, 3: solution

export const MazeSolverVisualizer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(0);
  
  const initialMaze: Cell[][] = [
    [0, 1, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 1, 0],
    [1, 1, 0, 0, 0],
    [0, 0, 0, 1, 0],
  ];

  const [maze, setMaze] = useState<Cell[][]>(initialMaze.map(row => [...row]));
  const [path, setPath] = useState<[number, number][]>([[0, 0]]);
  const [found, setFound] = useState(false);

  const reset = () => {
    setMaze(initialMaze.map(row => [...row]));
    setPath([[0, 0]]);
    setStep(0);
    setFound(false);
    setIsPlaying(false);
  };

  const isValid = (x: number, y: number, currentMaze: Cell[][]): boolean => {
    return (
      x >= 0 &&
      x < 5 &&
      y >= 0 &&
      y < 5 &&
      (currentMaze[x][y] === 0)
    );
  };

  const solveMaze = async () => {
    setIsPlaying(true);
    const mazeCopy = maze.map(row => [...row]);
    const pathStack: [number, number][] = [[0, 0]];
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]]; // right, down, left, up
    
    mazeCopy[0][0] = 2;
    setMaze([...mazeCopy]);
    await new Promise(resolve => setTimeout(resolve, 300));

    const backtrack = async (x: number, y: number): Promise<boolean> => {
      if (x === 4 && y === 4) {
        mazeCopy[x][y] = 3;
        setMaze([...mazeCopy]);
        setFound(true);
        return true;
      }

      for (const [dx, dy] of directions) {
        const newX = x + dx;
        const newY = y + dy;

        if (isValid(newX, newY, mazeCopy)) {
          mazeCopy[newX][newY] = 2;
          pathStack.push([newX, newY]);
          setPath([...pathStack]);
          setMaze([...mazeCopy]);
          await new Promise(resolve => setTimeout(resolve, 300));

          if (await backtrack(newX, newY)) {
            mazeCopy[newX][newY] = 3;
            setMaze([...mazeCopy]);
            return true;
          }

          // Backtrack
          pathStack.pop();
          setPath([...pathStack]);
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      return false;
    };

    await backtrack(0, 0);
    setIsPlaying(false);
  };

  const getCellColor = (cell: Cell): string => {
    switch (cell) {
      case 0: return '#ffffff';
      case 1: return '#1e293b';
      case 2: return '#fbbf24';
      case 3: return '#22c55e';
      default: return '#ffffff';
    }
  };

  const getCellLabel = (cell: Cell): string => {
    switch (cell) {
      case 2: return '?';
      case 3: return '✓';
      default: return '';
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Maze Path Finding (Backtracking)</h3>
        <p className="text-gray-600 mb-4">
          Find path from top-left to bottom-right using backtracking
        </p>
        
        <div className="flex gap-2 mb-4">
          <button
            onClick={solveMaze}
            disabled={isPlaying || found}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
          >
            <Play size={16} /> Solve Maze
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            <RotateCcw size={16} /> Reset
          </button>
        </div>

        <div className="bg-blue-50 p-3 rounded mb-4">
          <p className="text-sm">
            <strong>Status:</strong> {found ? '✓ Path Found!' : isPlaying ? 'Searching...' : 'Ready'} | 
            <strong> Path Length:</strong> {path.length}
          </p>
        </div>
      </div>

      <div className="flex justify-center mb-4">
        <div className="inline-grid gap-1" style={{ gridTemplateColumns: 'repeat(5, 60px)' }}>
          {maze.map((row, i) =>
            row.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                className="w-14 h-14 flex items-center justify-center border-2 rounded font-bold text-lg"
                style={{
                  backgroundColor: getCellColor(cell),
                  borderColor: i === 0 && j === 0 ? '#3b82f6' : i === 4 && j === 4 ? '#ef4444' : '#cbd5e1',
                }}
              >
                {i === 0 && j === 0 ? 'S' : i === 4 && j === 4 ? 'E' : getCellLabel(cell)}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex gap-4 justify-center mb-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white border-2 border-gray-300 rounded"></div>
          <span>Path</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-slate-800 rounded"></div>
          <span>Wall</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-yellow-400 rounded"></div>
          <span>Exploring</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-500 rounded"></div>
          <span>Solution</span>
        </div>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded">
        <div className="flex items-start gap-2">
          <Info size={16} className="mt-1 text-blue-500" />
          <div className="text-sm">
            <p className="font-semibold mb-1">Backtracking Approach:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Start from source (0,0), mark as visited</li>
              <li>Try all 4 directions: right, down, left, up</li>
              <li>If valid move, recursively explore that path</li>
              <li>If dead end, backtrack and try another direction</li>
              <li>Continue until destination (4,4) is reached</li>
            </ol>
            <p className="mt-2"><strong>Time:</strong> O(4^(n²)) worst case | <strong>Space:</strong> O(n²)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
