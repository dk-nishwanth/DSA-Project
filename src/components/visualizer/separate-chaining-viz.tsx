import React, { useState } from 'react';
import { Plus, RotateCcw } from 'lucide-react';

export const SeparateChainingViz: React.FC = () => {
  const [table, setTable] = useState<number[][]>(Array(7).fill(null).map(() => []));
  const [input, setInput] = useState(15);

  const hash = (key: number) => key % 7;

  const insert = () => {
    const idx = hash(input);
    const newTable = [...table];
    newTable[idx] = [...newTable[idx], input];
    setTable(newTable);
    setInput(input + 1);
  };

  const reset = () => {
    setTable(Array(7).fill(null).map(() => []));
    setInput(15);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Separate Chaining</h3>
      <div className="flex gap-2 mb-4">
        <input type="number" value={input} onChange={(e) => setInput(Number(e.target.value))} className="w-20 px-2 py-1 border rounded" />
        <button onClick={insert} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          <Plus size={16} /> Insert
        </button>
        <button onClick={reset} className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          <RotateCcw size={16} /> Reset
        </button>
      </div>
      <div className="space-y-2">
        {table.map((chain, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="w-12 h-10 flex items-center justify-center bg-gray-200 border rounded font-bold">{idx}</div>
            <div className="flex-1 flex gap-1">
              {chain.map((val, i) => (
                <div key={i} className="px-3 py-2 bg-blue-100 border border-blue-300 rounded font-mono">
                  {val}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
        <p><strong>Collision Resolution:</strong> Store multiple values in linked lists</p>
        <p><strong>Time:</strong> O(1 + α) where α = n/m (load factor)</p>
      </div>
    </div>
  );
};