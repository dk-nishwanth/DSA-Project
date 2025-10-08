import fs from 'fs';

const visualizers = {
  // DP Topics
  'dp-fundamentals-viz.tsx': `import React, { useState } from 'react';
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
            <div key={idx} className={\`w-16 h-16 flex flex-col items-center justify-center border-2 rounded \${current === idx ? 'bg-blue-500 text-white border-blue-600' : 'bg-gray-100 border-gray-300'}\`}>
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
};`,

  'knapsack-01-viz.tsx': `import React, { useState } from 'react';
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
                    <td key={j} className={\`border px-2 py-1 \${current && current[0] === i && current[1] === j ? 'bg-blue-500 text-white' : 'bg-gray-50'}\`}>
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
};`,

  'lis-unique-viz.tsx': `import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

export const LISUniqueViz: React.FC = () => {
  const [array] = useState([10, 9, 2, 5, 3, 7, 101, 18]);
  const [dp, setDp] = useState<number[]>([]);
  const [current, setCurrent] = useState(-1);
  const [lis, setLis] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const solve = async () => {
    setIsPlaying(true);
    const n = array.length;
    const dpArr = new Array(n).fill(1);
    setDp([...dpArr]);
    await new Promise(resolve => setTimeout(resolve, 500));

    for (let i = 1; i < n; i++) {
      setCurrent(i);
      await new Promise(resolve => setTimeout(resolve, 600));

      for (let j = 0; j < i; j++) {
        if (array[j] < array[i]) {
          dpArr[i] = Math.max(dpArr[i], dpArr[j] + 1);
        }
      }
      setDp([...dpArr]);
      await new Promise(resolve => setTimeout(resolve, 400));
    }

    const maxLen = Math.max(...dpArr);
    const lisArr: number[] = [];
    let len = maxLen;
    for (let i = n - 1; i >= 0; i--) {
      if (dpArr[i] === len) {
        lisArr.unshift(array[i]);
        len--;
      }
    }
    setLis(lisArr);
    setCurrent(-1);
    setIsPlaying(false);
  };

  const reset = () => {
    setDp([]);
    setCurrent(-1);
    setLis([]);
    setIsPlaying(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Longest Increasing Subsequence</h3>
      <div className="flex gap-2 mb-4">
        <button onClick={solve} disabled={isPlaying} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300">
          <Play size={16} /> Find LIS
        </button>
        <button onClick={reset} className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          <RotateCcw size={16} /> Reset
        </button>
      </div>
      <div className="mb-4">
        <p className="text-sm font-semibold mb-2">Array:</p>
        <div className="flex gap-2">
          {array.map((val, idx) => (
            <div key={idx} className={\`w-12 h-12 flex items-center justify-center border-2 rounded font-bold \${current === idx ? 'bg-blue-500 text-white border-blue-600' : lis.includes(val) ? 'bg-green-200 border-green-400' : 'bg-gray-100 border-gray-300'}\`}>
              {val}
            </div>
          ))}
        </div>
      </div>
      {dp.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-semibold mb-2">DP Array (LIS length ending at i):</p>
          <div className="flex gap-2">
            {dp.map((val, idx) => (
              <div key={idx} className="w-12 h-12 flex items-center justify-center border rounded bg-blue-100 font-bold">
                {val}
              </div>
            ))}
          </div>
        </div>
      )}
      {lis.length > 0 && (
        <div className="p-3 bg-green-50 rounded">
          <p className="text-sm"><strong>LIS:</strong> [{lis.join(', ')}]</p>
          <p className="text-sm"><strong>Length:</strong> {lis.length}</p>
        </div>
      )}
      <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
        <p><strong>DP Formula:</strong> dp[i] = max(dp[j] + 1) where arr[j] &lt; arr[i]</p>
        <p><strong>Time:</strong> O(n²) | <strong>Space:</strong> O(n)</p>
      </div>
    </div>
  );
};`,

  'lcs-unique-viz.tsx': `import React, { useState } from 'react';
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
                    <td key={j} className={\`border px-2 py-1 \${current && current[0] === i && current[1] === j ? 'bg-blue-500 text-white' : 'bg-gray-50'}\`}>
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
};`
};

// Create all files
Object.entries(visualizers).forEach(([filename, content]) => {
  fs.writeFileSync(`src/components/visualizer/${filename}`, content);
  console.log(`Created: ${filename}`);
});

console.log('\n✅ DP visualizers created!');
