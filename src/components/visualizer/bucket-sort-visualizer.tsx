import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

export const BucketSortVisualizer: React.FC = () => {
  const [array, setArray] = useState([0.78, 0.17, 0.39, 0.26, 0.72, 0.94, 0.21, 0.12, 0.23, 0.68]);
  const [buckets, setBuckets] = useState<number[][]>([]);
  const [sorted, setSorted] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const reset = () => {
    setBuckets([]);
    setSorted([]);
    setIsPlaying(false);
  };

  const sort = async () => {
    setIsPlaying(true);
    const n = array.length;
    const bkts: number[][] = Array.from({ length: n }, () => []);

    // Distribute into buckets
    for (let i = 0; i < n; i++) {
      const bucketIndex = Math.floor(array[i] * n);
      bkts[bucketIndex].push(array[i]);
      setBuckets([...bkts]);
      await new Promise(resolve => setTimeout(resolve, 400));
    }

    // Sort each bucket
    for (let i = 0; i < n; i++) {
      if (bkts[i].length > 0) {
        bkts[i].sort((a, b) => a - b);
        setBuckets([...bkts]);
        await new Promise(resolve => setTimeout(resolve, 400));
      }
    }

    // Concatenate
    const result: number[] = [];
    for (let i = 0; i < n; i++) {
      result.push(...bkts[i]);
      setSorted([...result]);
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    setIsPlaying(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Bucket Sort</h3>
      
      <div className="flex gap-2 mb-4">
        <button onClick={sort} disabled={isPlaying} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300">
          <Play size={16} /> Sort
        </button>
        <button onClick={reset} className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      <div className="mb-4">
        <p className="text-sm font-semibold mb-2">Original Array:</p>
        <div className="flex gap-2">
          {array.map((val, idx) => (
            <div key={idx} className="px-3 py-2 bg-gray-100 border rounded font-mono text-sm">
              {val.toFixed(2)}
            </div>
          ))}
        </div>
      </div>

      {buckets.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-semibold mb-2">Buckets:</p>
          <div className="space-y-2">
            {buckets.map((bucket, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <span className="text-xs w-12">B{idx}:</span>
                <div className="flex gap-1">
                  {bucket.map((val, i) => (
                    <div key={i} className="px-2 py-1 bg-blue-100 border border-blue-300 rounded font-mono text-xs">
                      {val.toFixed(2)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {sorted.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-semibold mb-2">Sorted Array:</p>
          <div className="flex gap-2">
            {sorted.map((val, idx) => (
              <div key={idx} className="px-3 py-2 bg-green-100 border border-green-300 rounded font-mono text-sm">
                {val.toFixed(2)}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="p-3 bg-gray-50 rounded text-sm">
        <p><strong>Strategy:</strong> Distribute into buckets, sort each, concatenate</p>
        <p><strong>Time:</strong> O(n + k) average | <strong>Space:</strong> O(n + k)</p>
        <p><strong>Best for:</strong> Uniformly distributed data</p>
      </div>
    </div>
  );
};
