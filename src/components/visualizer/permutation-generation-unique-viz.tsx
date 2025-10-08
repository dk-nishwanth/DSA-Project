import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

export const PermutationGenerationUniqueViz: React.FC = () => {
  const [array] = useState([1, 2, 3]);
  const [permutations, setPermutations] = useState<number[][]>([]);
  const [current, setCurrent] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const reset = () => {
    setPermutations([]);
    setCurrent([]);
    setIsPlaying(false);
  };

  const generate = async () => {
    setIsPlaying(true);
    const result: number[][] = [];

    const backtrack = async (path: number[], remaining: number[]) => {
      setCurrent([...path]);
      await new Promise(resolve => setTimeout(resolve, 400));

      if (remaining.length === 0) {
        result.push([...path]);
        setPermutations([...result]);
        return;
      }

      for (let i = 0; i < remaining.length; i++) {
        const newPath = [...path, remaining[i]];
        const newRemaining = remaining.filter((_, idx) => idx !== i);
        await backtrack(newPath, newRemaining);
      }
    };

    await backtrack([], array);
    setCurrent([]);
    setIsPlaying(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Permutation Generation (Backtracking)</h3>
      <div className="flex gap-2 mb-4">
        <button onClick={generate} disabled={isPlaying} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300">
          <Play size={16} /> Generate
        </button>
        <button onClick={reset} className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          <RotateCcw size={16} /> Reset
        </button>
      </div>
      <div className="mb-4">
        <p className="text-sm font-semibold">Array: [{array.join(', ')}]</p>
        <p className="text-sm">Total Permutations: {permutations.length} / {array.length}!</p>
      </div>
      {current.length > 0 && (
        <div className="mb-4 p-3 bg-blue-100 rounded">
          <p className="text-sm"><strong>Current:</strong> [{current.join(', ')}]</p>
        </div>
      )}
      <div className="grid grid-cols-3 gap-2">
        {permutations.map((perm, idx) => (
          <div key={idx} className="p-2 bg-green-100 border border-green-300 rounded text-sm text-center font-mono">
            [{perm.join(', ')}]
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
        <p><strong>Backtracking:</strong> Try each element at each position</p>
        <p><strong>Time:</strong> O(n!) | <strong>Space:</strong> O(n)</p>
      </div>
    </div>
  );
};
