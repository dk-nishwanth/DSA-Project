import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

export const ExponentialSearchViz: React.FC = () => {
  const [array] = useState([2, 3, 4, 10, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140]);
  const [target, setTarget] = useState(70);
  const [bound, setBound] = useState(-1);
  const [left, setLeft] = useState(-1);
  const [right, setRight] = useState(-1);
  const [mid, setMid] = useState(-1);
  const [found, setFound] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const reset = () => {
    setBound(-1);
    setLeft(-1);
    setRight(-1);
    setMid(-1);
    setFound(null);
    setIsPlaying(false);
  };

  const search = async () => {
    setIsPlaying(true);
    
    if (array[0] === target) {
      setFound(0);
      setIsPlaying(false);
      return;
    }

    let i = 1;
    while (i < array.length && array[i] <= target) {
      setBound(i);
      await new Promise(resolve => setTimeout(resolve, 600));
      i *= 2;
    }

    let l = Math.floor(i / 2);
    let r = Math.min(i, array.length - 1);
    setLeft(l);
    setRight(r);
    await new Promise(resolve => setTimeout(resolve, 800));

    while (l <= r) {
      const m = Math.floor((l + r) / 2);
      setMid(m);
      await new Promise(resolve => setTimeout(resolve, 600));

      if (array[m] === target) {
        setFound(m);
        setIsPlaying(false);
        return;
      }

      if (array[m] < target) l = m + 1;
      else r = m - 1;
      
      setLeft(l);
      setRight(r);
    }

    setIsPlaying(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Exponential Search</h3>
      <div className="flex gap-4 items-center mb-4">
        <input type="number" value={target} onChange={(e) => setTarget(Number(e.target.value))} disabled={isPlaying} className="w-20 px-2 py-1 border rounded" />
        <button onClick={search} disabled={isPlaying} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300">
          <Play size={16} /> Search
        </button>
        <button onClick={reset} className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          <RotateCcw size={16} /> Reset
        </button>
      </div>
      <div className="flex gap-1 justify-center mb-4 overflow-x-auto">
        {array.map((val, idx) => (
          <div key={idx} className="flex flex-col items-center flex-shrink-0">
            <div className="text-xs text-gray-500 mb-1 h-4">
              {idx === bound && 'B'}
              {idx === left && 'L'}
              {idx === right && 'R'}
              {idx === mid && 'M'}
            </div>
            <div className={`w-12 h-12 flex items-center justify-center border-2 rounded text-sm font-bold ${
              found === idx ? 'bg-green-500 text-white border-green-600' :
              mid === idx ? 'bg-blue-500 text-white border-blue-600' :
              bound === idx ? 'bg-purple-300 border-purple-500' :
              idx >= left && idx <= right && left !== -1 ? 'bg-yellow-100 border-yellow-400' :
              'bg-gray-100 border-gray-300'
            }`}>
              {val}
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 bg-gray-50 rounded text-sm">
        <p><strong>Strategy:</strong> Find range by doubling (1, 2, 4, 8...), then binary search</p>
        <p><strong>Time:</strong> O(log n) | <strong>Space:</strong> O(1)</p>
        <p><strong>Best for:</strong> Unbounded/infinite arrays</p>
      </div>
    </div>
  );
};