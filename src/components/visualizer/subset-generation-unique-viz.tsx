import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

export const SubsetGenerationUniqueViz: React.FC = () => {
  const [array] = useState([1, 2, 3]);
  const [subsets, setSubsets] = useState<number[][]>([]);
  const [current, setCurrent] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const reset = () => {
    setSubsets([]);
    setCurrent([]);
    setIsPlaying(false);
  };

  const generate = async () => {
    setIsPlaying(true);
    const result: number[][] = [];

    const backtrack = async (start: number, path: number[]) => {
      setCurrent([...path]);
      result.push([...path]);
      setSubsets([...result]);
      await new Promise(resolve => setTimeout(resolve, 400));

      for (let i = start; i < array.length; i++) {
        path.push(array[i]);
        await backtrack(i + 1, path);
        path.pop();
      }
    };

    await backtrack(0, []);
    setCurrent([]);
    setIsPlaying(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Subset Generation (Backtracking)</h3>
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
        <p className="text-sm">Total Subsets: {subsets.length} / {Math.pow(2, array.length)}</p>
      </div>
      {current.length >= 0 && (
        <div className="mb-4 p-3 bg-blue-100 rounded">
          <p className="text-sm"><strong>Current:</strong> [{current.join(', ')}]</p>
        </div>
      )}
      <div className="grid grid-cols-4 gap-2">
        {subsets.map((subset, idx) => (
          <div key={idx} className="p-2 bg-green-100 border border-green-300 rounded text-sm text-center">
            [{subset.join(', ') || 'Ø'}]
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
        <p><strong>Backtracking:</strong> Include or exclude each element</p>
        <p><strong>Time:</strong> O(2^n) | <strong>Space:</strong> O(n)</p>
      </div>
    </div>
  );
};
