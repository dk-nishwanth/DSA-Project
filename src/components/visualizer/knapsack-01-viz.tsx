import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

export const Knapsack01Viz: React.FC = () => {
  const [items] = useState([
    { weight: 2, value: 3 },
    { weight: 3, value: 4 },
    { weight: 4, value: 5 },
    { weight: 5, value: 6 }
  ]);
  const [capacity] = useState(8);
  const [table, setTable] = useState<number[][]>([]);
  const [current, setCurrent] = useState<[number, number] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const solve = async () => {
    setIsPlaying(true);
    const n = items.length;
    const dp = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0));
    setTable([...dp]);
    await new Promise(resolve => setTimeout(resolve, 500));

    for (let i = 1; i <= n; i++) {
      for (let w = 0; w <= capacity; w++) {
        setCurrent([i, w]);
        await new Promise(resolve => setTimeout(resolve, 300));

        if (items[i - 1].weight <= w) {
          dp[i][w] = Math.max(
            dp[i - 1][w],
            dp[i - 1][w - items[i - 1].weight] + items[i - 1].value
          );
        } else {
          dp[i][w] = dp[i - 1][w];
        }
        setTable([...dp]);
      }
    }

    setCurrent(null);
    setIsPlaying(false);
  };

  const reset = () => {
    setTable([]);
    setCurrent(null);
    setIsPlaying(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">0/1 Knapsack Problem</h3>
      <div className="flex gap-2 mb-4">
        <button onClick={solve} disabled={isPlaying} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300">
          <Play size={16} /> Solve
        </button>
        <button onClick={reset} className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          <RotateCcw size={16} /> Reset
        </button>
      </div>
      <div className="mb-4">
        <p className="text-sm font-semibold mb-2">Items:</p>
        <div className="flex gap-2">
          {items.map((item, idx) => (
            <div key={idx} className="p-2 bg-blue-100 border rounded text-sm">
              W:{item.weight} V:{item.value}
            </div>
          ))}
        </div>
        <p className="text-sm mt-2"><strong>Capacity:</strong> {capacity}</p>
      </div>
      {table.length > 0 && (
        <div className="overflow-x-auto">
          <table className="border-collapse text-xs">
            <tbody>
              {table.map((row, i) => (
                <tr key={i}>
                  {row.map((val, j) => (
                    <td key={j} className={`border px-2 py-1 ${current && current[0] === i && current[1] === j ? 'bg-blue-500 text-white' : 'bg-gray-50'}`}>
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
        <p><strong>DP Formula:</strong> dp[i][w] = max(dp[i-1][w], dp[i-1][w-wt[i]] + val[i])</p>
        <p><strong>Time:</strong> O(n×W) | <strong>Space:</strong> O(n×W)</p>
      </div>
    </div>
  );
};