import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

export const LCSUniqueViz: React.FC = () => {
  const [text1] = useState('ABCDGH');
  const [text2] = useState('AEDFHR');
  const [table, setTable] = useState<number[][]>([]);
  const [current, setCurrent] = useState<[number, number] | null>(null);
  const [lcs, setLcs] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  const solve = async () => {
    setIsPlaying(true);
    const m = text1.length;
    const n = text2.length;
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    setTable([...dp]);
    await new Promise(resolve => setTimeout(resolve, 500));

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        setCurrent([i, j]);
        await new Promise(resolve => setTimeout(resolve, 300));

        if (text1[i - 1] === text2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
        setTable([...dp]);
      }
    }

    let i = m, j = n;
    let result = '';
    while (i > 0 && j > 0) {
      if (text1[i - 1] === text2[j - 1]) {
        result = text1[i - 1] + result;
        i--;
        j--;
      } else if (dp[i - 1][j] > dp[i][j - 1]) {
        i--;
      } else {
        j--;
      }
    }
    setLcs(result);
    setCurrent(null);
    setIsPlaying(false);
  };

  const reset = () => {
    setTable([]);
    setCurrent(null);
    setLcs('');
    setIsPlaying(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Longest Common Subsequence</h3>
      <div className="flex gap-2 mb-4">
        <button onClick={solve} disabled={isPlaying} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300">
          <Play size={16} /> Find LCS
        </button>
        <button onClick={reset} className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          <RotateCcw size={16} /> Reset
        </button>
      </div>
      <div className="mb-4">
        <p className="text-sm"><strong>Text 1:</strong> {text1}</p>
        <p className="text-sm"><strong>Text 2:</strong> {text2}</p>
      </div>
      {table.length > 0 && (
        <div className="overflow-x-auto mb-4">
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
      {lcs && (
        <div className="p-3 bg-green-50 rounded">
          <p className="text-sm"><strong>LCS:</strong> {lcs}</p>
          <p className="text-sm"><strong>Length:</strong> {lcs.length}</p>
        </div>
      )}
      <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
        <p><strong>DP Formula:</strong> If match: dp[i][j] = dp[i-1][j-1] + 1, else: max(dp[i-1][j], dp[i][j-1])</p>
        <p><strong>Time:</strong> O(m×n) | <strong>Space:</strong> O(m×n)</p>
      </div>
    </div>
  );
};