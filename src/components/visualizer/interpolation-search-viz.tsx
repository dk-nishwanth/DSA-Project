import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

export const InterpolationSearchViz: React.FC = () => {
  const [array] = useState([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
  const [target, setTarget] = useState(70);
  const [left, setLeft] = useState(-1);
  const [right, setRight] = useState(-1);
  const [pos, setPos] = useState(-1);
  const [found, setFound] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const reset = () => {
    setLeft(-1);
    setRight(-1);
    setPos(-1);
    setFound(null);
    setIsPlaying(false);
  };

  const search = async () => {
    setIsPlaying(true);
    let l = 0, r = array.length - 1;

    while (l <= r && target >= array[l] && target <= array[r]) {
      setLeft(l);
      setRight(r);
      await new Promise(resolve => setTimeout(resolve, 800));

      const p = l + Math.floor(((target - array[l]) * (r - l)) / (array[r] - array[l]));
      setPos(p);
      await new Promise(resolve => setTimeout(resolve, 800));

      if (array[p] === target) {
        setFound(p);
        setIsPlaying(false);
        return;
      }

      if (array[p] < target) l = p + 1;
      else r = p - 1;
    }

    setLeft(-1);
    setRight(-1);
    setPos(-1);
    setIsPlaying(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Interpolation Search</h3>
      <div className="flex gap-4 items-center mb-4">
        <input type="number" value={target} onChange={(e) => setTarget(Number(e.target.value))} disabled={isPlaying} className="w-20 px-2 py-1 border rounded" />
        <button onClick={search} disabled={isPlaying} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300">
          <Play size={16} /> Search
        </button>
        <button onClick={reset} className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          <RotateCcw size={16} /> Reset
        </button>
      </div>
      <div className="flex gap-1 justify-center mb-4">
        {array.map((val, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div className="text-xs text-gray-500 mb-1">
              {idx === left && 'L'}
              {idx === right && 'R'}
              {idx === pos && 'P'}
            </div>
            <div className={`w-14 h-14 flex items-center justify-center border-2 rounded font-bold ${
              found === idx ? 'bg-green-500 text-white border-green-600' :
              pos === idx ? 'bg-blue-500 text-white border-blue-600' :
              idx >= left && idx <= right && left !== -1 ? 'bg-yellow-100 border-yellow-400' :
              'bg-gray-100 border-gray-300'
            }`}>
              {val}
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 bg-gray-50 rounded text-sm">
        <p><strong>Formula:</strong> pos = low + [(target - arr[low]) × (high - low) / (arr[high] - arr[low])]</p>
        <p><strong>Time:</strong> O(log log n) for uniform data | <strong>Space:</strong> O(1)</p>
        <p><strong>Best for:</strong> Uniformly distributed sorted arrays</p>
      </div>
    </div>
  );
};