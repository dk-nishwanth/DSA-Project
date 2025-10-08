import React, { useState } from 'react';
import { Play, RotateCcw, Info } from 'lucide-react';

interface TreeNode {
  value: string;
  open: number;
  close: number;
  isValid: boolean;
  isComplete: boolean;
}

export const GenerateParenthesesVisualizer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [n, setN] = useState(3);
  const [results, setResults] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [exploring, setExploring] = useState<TreeNode[]>([]);

  const reset = () => {
    setResults([]);
    setCurrentPath('');
    setExploring([]);
    setIsPlaying(false);
  };

  const generate = async () => {
    setIsPlaying(true);
    setResults([]);
    setExploring([]);
    const validCombinations: string[] = [];
    const explorationSteps: TreeNode[] = [];

    const backtrack = async (current: string, open: number, close: number) => {
      const node: TreeNode = {
        value: current,
        open,
        close,
        isValid: open >= close,
        isComplete: current.length === 2 * n,
      };

      explorationSteps.push(node);
      setCurrentPath(current);
      setExploring([...explorationSteps]);
      await new Promise(resolve => setTimeout(resolve, 400));

      if (current.length === 2 * n) {
        validCombinations.push(current);
        setResults([...validCombinations]);
        return;
      }

      if (open < n) {
        await backtrack(current + '(', open + 1, close);
      }

      if (close < open) {
        await backtrack(current + ')', open, close + 1);
      }

      explorationSteps.pop();
      setExploring([...explorationSteps]);
    };

    await backtrack('', 0, 0);
    setIsPlaying(false);
    setCurrentPath('');
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Generate Valid Parentheses</h3>
        <p className="text-gray-600 mb-4">
          Generate all combinations of well-formed parentheses using backtracking
        </p>
        
        <div className="flex gap-4 items-center mb-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Pairs (n):</label>
            <input
              type="number"
              min="1"
              max="4"
              value={n}
              onChange={(e) => setN(Math.min(4, Math.max(1, parseInt(e.target.value) || 1)))}
              disabled={isPlaying}
              className="w-16 px-2 py-1 border rounded"
            />
          </div>
          <button
            onClick={generate}
            disabled={isPlaying}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
          >
            <Play size={16} /> Generate
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            <RotateCcw size={16} /> Reset
          </button>
        </div>

        <div className="bg-blue-50 p-3 rounded mb-4">
          <p className="text-sm">
            <strong>Current Path:</strong> {currentPath || 'None'} | 
            <strong> Valid Combinations Found:</strong> {results.length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold mb-2">Exploration Tree</h4>
          <div className="bg-gray-50 p-4 rounded h-64 overflow-y-auto">
            {exploring.length === 0 ? (
              <p className="text-gray-400 text-sm">Click Generate to start</p>
            ) : (
              <div className="space-y-2">
                {exploring.map((node, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 bg-white rounded border"
                    style={{ marginLeft: `${idx * 12}px` }}
                  >
                    <span className="font-mono font-bold text-lg">
                      {node.value || '""'}
                    </span>
                    <span className="text-xs text-gray-500">
                      (open:{node.open}, close:{node.close})
                    </span>
                    {node.isComplete && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        ✓ Valid
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Valid Combinations ({results.length})</h4>
          <div className="bg-gray-50 p-4 rounded h-64 overflow-y-auto">
            {results.length === 0 ? (
              <p className="text-gray-400 text-sm">No results yet</p>
            ) : (
              <div className="space-y-2">
                {results.map((result, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-green-50 border border-green-200 rounded"
                  >
                    <span className="font-mono font-bold text-lg text-green-700">
                      {result}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded">
        <div className="flex items-start gap-2">
          <Info size={16} className="mt-1 text-blue-500" />
          <div className="text-sm">
            <p className="font-semibold mb-1">Backtracking Rules:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Start with empty string, open=0, close=0</li>
              <li>Add '(' if open &lt; n (can still add opening brackets)</li>
              <li>Add ')' if close &lt; open (maintain validity)</li>
              <li>If length = 2n, we have a valid combination</li>
              <li>Backtrack and try other branches</li>
            </ol>
            <p className="mt-2">
              <strong>For n={n}:</strong> Expected {Math.pow(2, n) / (n + 1)} combinations (Catalan number)
            </p>
            <p className="mt-1"><strong>Time:</strong> O(4^n / √n) | <strong>Space:</strong> O(n)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
