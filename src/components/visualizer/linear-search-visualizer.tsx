import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

export const LinearSearchVisualizer: React.FC = () => {
  const [array] = useState([15, 8, 23, 42, 7, 31, 19, 56]);
  const [target, setTarget] = useState(31);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [found, setFound] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [comparisons, setComparisons] = useState(0);

  const reset = () => {
    setCurrentIndex(-1);
    setFound(null);
    setComparisons(0);
    setIsPlaying(false);
  };

  const search = async () => {
    setIsPlaying(true);
    setFound(null);
    let comps = 0;

    for (let i = 0; i < array.length; i++) {
      setCurrentIndex(i);
      comps++;
      setComparisons(comps);
      await new Promise(resolve => setTimeout(resolve, 600));

      if (array[i] === target) {
        setFound(i);
        setIsPlaying(false);
        return;
      }
    }

    setCurrentIndex(-1);
    setIsPlaying(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Linear Search</h3>
      
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

      <div className="flex gap-2 justify-center mb-4">
        {array.map((val, idx) => (
          <div
            key={idx}
            className={`w-16 h-16 flex items-center justify-center border-2 rounded font-bold text-lg ${
              found === idx ? 'bg-green-500 text-white border-green-600' :
              currentIndex === idx ? 'bg-blue-500 text-white border-blue-600' :
              'bg-gray-100 border-gray-300'
            }`}
          >
            {val}
          </div>
        ))}
      </div>

      <div className="p-3 bg-gray-50 rounded text-sm">
        <p><strong>Strategy:</strong> Check each element sequentially from start to end</p>
        <p><strong>Time:</strong> O(n) | <strong>Space:</strong> O(1)</p>
        <p><strong>Best for:</strong> Unsorted arrays, small datasets</p>
      </div>
    </div>
  );
};
