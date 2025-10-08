import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

export const BacktrackingFundamentalsUniqueViz: React.FC = () => {
  const [target] = useState(7);
  const [candidates] = useState([2, 3, 5]);
  const [solutions, setSolutions] = useState<number[][]>([]);
  const [current, setCurrent] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const reset = () => {
    setSolutions([]);
    setCurrent([]);
    setIsPlaying(false);
  };

  const solve = async () => {
    setIsPlaying(true);
    const result: number[][] = [];

    const backtrack = async (remaining: number, path: number[], start: number) => {
      setCurrent([...path]);
      await new Promise(resolve => setTimeout(resolve, 400));

      if (remaining === 0) {
        result.push([...path]);
        setSolutions([...result]);
        return;
      }

      if (remaining < 0) return;

      for (let i = start; i < candidates.length; i++) {
        path.push(candidates[i]);
        await backtrack(remaining - candidates[i], path, i);
        path.pop();
      }
    };

    await backtrack(target, [], 0);
    setCurrent([]);
    setIsPlaying(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Backtracking Fundamentals</h3>
      <div className="flex gap-2 mb-4">
        <button onClick={solve} disabled={isPlaying} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300">
          <Play size={16} /> Solve
        </button>
        <button onClick={reset} className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          <RotateCcw size={16} /> Reset
        </button>
      </div>
      <div className="mb-4 p-3 bg-blue-50 rounded">
        <p className="text-sm"><strong>Problem:</strong> Find combinations that sum to {target}</p>
        <p className="text-sm"><strong>Candidates:</strong> [{candidates.join(', ')}]</p>
      </div>
      {current.length > 0 && (
        <div className="mb-4 p-3 bg-yellow-100 rounded">
          <p className="text-sm"><strong>Exploring:</strong> [{current.join(' + ')}] = {current.reduce((a, b) => a + b, 0)}</p>
        </div>
      )}
      <div className="space-y-2">
        {solutions.map((sol, idx) => (
          <div key={idx} className="p-2 bg-green-100 border border-green-300 rounded">
            <span className="font-mono">[{sol.join(' + ')}] = {target}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
        <p><strong>Backtracking Pattern:</strong></p>
        <ol className="list-decimal list-inside">
          <li>Choose a candidate</li>
          <li>Explore with that choice</li>
          <li>If solution found, record it</li>
          <li>Backtrack and try next candidate</li>
        </ol>
      </div>
    </div>
  );
};
