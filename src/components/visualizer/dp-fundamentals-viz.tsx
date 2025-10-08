import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

export const DPFundamentalsViz: React.FC = () => {
  const [n, setN] = useState(5);
  const [table, setTable] = useState<number[]>([]);
  const [current, setCurrent] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  const fibonacci = async () => {
    setIsPlaying(true);
    const dp = new Array(n + 1).fill(0);
    dp[0] = 0;
    dp[1] = 1;
    setTable([...dp]);
    await new Promise(resolve => setTimeout(resolve, 500));

    for (let i = 2; i <= n; i++) {
      setCurrent(i);
      await new Promise(resolve => setTimeout(resolve, 600));
      dp[i] = dp[i - 1] + dp[i - 2];
      setTable([...dp]);
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    setCurrent(-1);
    setIsPlaying(false);
  };

  const reset = () => {
    setTable([]);
    setCurrent(-1);
    setIsPlaying(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Dynamic Programming Fundamentals</h3>
      <div className="flex gap-4 items-center mb-4">
        <input type="number" value={n} onChange={(e) => setN(Math.max(2, Math.min(15, Number(e.target.value))))} disabled={isPlaying} className="w-20 px-2 py-1 border rounded" min="2" max="15" />
        <button onClick={fibonacci} disabled={isPlaying} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300">
          <Play size={16} /> Compute
        </button>
        <button onClick={reset} className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          <RotateCcw size={16} /> Reset
        </button>
      </div>
      <div className="mb-4">
        <p className="text-sm font-semibold mb-2">DP Table (Fibonacci Example):</p>
        <div className="flex gap-1 flex-wrap">
          {table.map((val, idx) => (
            <div key={idx} className={`w-16 h-16 flex flex-col items-center justify-center border-2 rounded ${current === idx ? 'bg-blue-500 text-white border-blue-600' : 'bg-gray-100 border-gray-300'}`}>
              <div className="text-xs text-gray-500">i={idx}</div>
              <div className="font-bold">{val}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-3 bg-gray-50 rounded text-sm">
        <p><strong>Key Concepts:</strong></p>
        <ul className="list-disc list-inside">
          <li>Overlapping subproblems</li>
          <li>Optimal substructure</li>
          <li>Memoization (top-down)</li>
          <li>Tabulation (bottom-up)</li>
        </ul>
        <p className="mt-2"><strong>Time:</strong> O(n) | <strong>Space:</strong> O(n)</p>
      </div>
    </div>
  );
};