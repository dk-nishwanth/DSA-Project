import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

export const BinarySearchAlgoVisualizer: React.FC = () => {
  const [array] = useState([5, 12, 18, 23, 31, 42, 56, 67, 78, 89]);
  const [target, setTarget] = useState(42);
  const [left, setLeft] = useState(-1);
  const [right, setRight] = useState(-1);
  const [mid, setMid] = useState(-1);
  const [found, setFound] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [comparisons, setComparisons] = useState(0);

  const reset = () => {
    setLeft(-1);
    setRight(-1);
    setMid(-1);
    setFound(null);
    setComparisons(0);
    setIsPlaying(false);
  };

  const search = async () => {
    setIsPlaying(true);
    setFound(null);
    let l = 0, r = array.length - 1;
    let comps = 0;

    while (l <= r) {
      setLeft(l);
      setRight(r);
      await new Promise(resolve => setTimeout(resolve, 800));

      const m = Math.floor((l + r) / 2);
      setMid(m);
      comps++;
      setComparisons(comps);
      await new Promise(resolve => setTimeout(resolve, 800));

      if (array[m] === target) {
        setFound(m);
        setIsPlaying(false);
        return;
      }

      if (array[m] < target) {
        l = m + 1;
      } else {
        r = m - 1;
      }
    }

    setLeft(-1);
    setRight(-1);
    setMid(-1);
    setIsPlaying(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Binary Search</h3>
      
      <div className="flex gap-4 items-center mb-4">
        <input
          type="number"
          value={target}
          onChange={(e) => setTarget(Number(e.target.value))}
          disabled={isPlaying}
          className="w-20 px-2 py-1 border rounded"
        />
        <button onClick={search} disabled={isPlaying} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300">
          <Play size={16} /> Search
        </button>
        <button onClick={reset} className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      <div className="mb-4 p-3 bg-blue-50 rounded">
        <p className="text-sm"><strong>Comparisons:</strong> {comparisons}</p>
        <p className="text-sm"><strong>Status:</strong> {found !== null ? `Found at index ${found}!` : isPlaying ? 'Searching...' : 'Ready'}</p>
      </div>

      <div className="flex gap-1 justify-center mb-4">
        {array.map((val, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div className="text-xs text-gray-500 mb-1">
              {idx === left && 'L'}
              {idx === right && 'R'}
              {idx === mid && 'M'}
            </div>
            <div
              className={`w-14 h-14 flex items-center justify-center border-2 rounded font-bold ${
                found === idx ? 'bg-green-500 text-white border-green-600' :
                mid === idx ? 'bg-blue-500 text-white border-blue-600' :
                idx >= left && idx <= right && left !== -1 ? 'bg-yellow-100 border-yellow-400' :
                'bg-gray-100 border-gray-300'
              }`}
            >
              {val}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 bg-gray-50 rounded text-sm">
        <p><strong>Strategy:</strong> Divide search space in half each iteration</p>
        <p><strong>Time:</strong> O(log n) | <strong>Space:</strong> O(1)</p>
        <p><strong>Requirement:</strong> Array must be sorted</p>
      </div>
    </div>
  );
};
