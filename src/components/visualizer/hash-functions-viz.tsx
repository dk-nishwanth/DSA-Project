import React, { useState } from 'react';
import { Play } from 'lucide-react';

export const HashFunctionsViz: React.FC = () => {
  const [input, setInput] = useState('hello');
  const [hashes, setHashes] = useState<Record<string, number>>({});

  const divisionMethod = (str: string, size: number) => {
    let sum = 0;
    for (let i = 0; i < str.length; i++) {
      sum += str.charCodeAt(i);
    }
    return sum % size;
  };

  const multiplicationMethod = (str: string, size: number) => {
    const A = 0.6180339887;
    let sum = 0;
    for (let i = 0; i < str.length; i++) {
      sum += str.charCodeAt(i);
    }
    return Math.floor(size * ((sum * A) % 1));
  };

  const djb2Hash = (str: string, size: number) => {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) + str.charCodeAt(i);
    }
    return Math.abs(hash) % size;
  };

  const compute = () => {
    const size = 10;
    setHashes({
      division: divisionMethod(input, size),
      multiplication: multiplicationMethod(input, size),
      djb2: djb2Hash(input, size)
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Hash Functions</h3>
      <div className="flex gap-2 mb-4">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 px-3 py-2 border rounded" placeholder="Enter string" />
        <button onClick={compute} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          <Play size={16} /> Hash
        </button>
      </div>
      {Object.keys(hashes).length > 0 && (
        <div className="space-y-3">
          <div className="p-3 bg-blue-50 rounded">
            <p className="text-sm font-semibold">Division Method</p>
            <p className="text-2xl font-bold text-blue-600">{hashes.division}</p>
            <p className="text-xs text-gray-600">h(k) = k mod m</p>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <p className="text-sm font-semibold">Multiplication Method</p>
            <p className="text-2xl font-bold text-green-600">{hashes.multiplication}</p>
            <p className="text-xs text-gray-600">h(k) = ⌊m(kA mod 1)⌋</p>
          </div>
          <div className="p-3 bg-purple-50 rounded">
            <p className="text-sm font-semibold">DJB2 Hash</p>
            <p className="text-2xl font-bold text-purple-600">{hashes.djb2}</p>
            <p className="text-xs text-gray-600">hash = hash * 33 + char</p>
          </div>
        </div>
      )}
      <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
        <p><strong>Goal:</strong> Distribute keys uniformly across hash table</p>
        <p><strong>Properties:</strong> Deterministic, fast, minimize collisions</p>
      </div>
    </div>
  );
};