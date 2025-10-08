import fs from 'fs';

const templates = {
  'interpolation-search-viz.tsx': `import React, { useState } from 'react';
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
            <div className={\`w-14 h-14 flex items-center justify-center border-2 rounded font-bold \${
              found === idx ? 'bg-green-500 text-white border-green-600' :
              pos === idx ? 'bg-blue-500 text-white border-blue-600' :
              idx >= left && idx <= right && left !== -1 ? 'bg-yellow-100 border-yellow-400' :
              'bg-gray-100 border-gray-300'
            }\`}>
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
};`,

  'exponential-search-viz.tsx': `import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

export const ExponentialSearchViz: React.FC = () => {
  const [array] = useState([2, 3, 4, 10, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140]);
  const [target, setTarget] = useState(70);
  const [bound, setBound] = useState(-1);
  const [left, setLeft] = useState(-1);
  const [right, setRight] = useState(-1);
  const [mid, setMid] = useState(-1);
  const [found, setFound] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const reset = () => {
    setBound(-1);
    setLeft(-1);
    setRight(-1);
    setMid(-1);
    setFound(null);
    setIsPlaying(false);
  };

  const search = async () => {
    setIsPlaying(true);
    
    if (array[0] === target) {
      setFound(0);
      setIsPlaying(false);
      return;
    }

    let i = 1;
    while (i < array.length && array[i] <= target) {
      setBound(i);
      await new Promise(resolve => setTimeout(resolve, 600));
      i *= 2;
    }

    let l = Math.floor(i / 2);
    let r = Math.min(i, array.length - 1);
    setLeft(l);
    setRight(r);
    await new Promise(resolve => setTimeout(resolve, 800));

    while (l <= r) {
      const m = Math.floor((l + r) / 2);
      setMid(m);
      await new Promise(resolve => setTimeout(resolve, 600));

      if (array[m] === target) {
        setFound(m);
        setIsPlaying(false);
        return;
      }

      if (array[m] < target) l = m + 1;
      else r = m - 1;
      
      setLeft(l);
      setRight(r);
    }

    setIsPlaying(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Exponential Search</h3>
      <div className="flex gap-4 items-center mb-4">
        <input type="number" value={target} onChange={(e) => setTarget(Number(e.target.value))} disabled={isPlaying} className="w-20 px-2 py-1 border rounded" />
        <button onClick={search} disabled={isPlaying} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300">
          <Play size={16} /> Search
        </button>
        <button onClick={reset} className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          <RotateCcw size={16} /> Reset
        </button>
      </div>
      <div className="flex gap-1 justify-center mb-4 overflow-x-auto">
        {array.map((val, idx) => (
          <div key={idx} className="flex flex-col items-center flex-shrink-0">
            <div className="text-xs text-gray-500 mb-1 h-4">
              {idx === bound && 'B'}
              {idx === left && 'L'}
              {idx === right && 'R'}
              {idx === mid && 'M'}
            </div>
            <div className={\`w-12 h-12 flex items-center justify-center border-2 rounded text-sm font-bold \${
              found === idx ? 'bg-green-500 text-white border-green-600' :
              mid === idx ? 'bg-blue-500 text-white border-blue-600' :
              bound === idx ? 'bg-purple-300 border-purple-500' :
              idx >= left && idx <= right && left !== -1 ? 'bg-yellow-100 border-yellow-400' :
              'bg-gray-100 border-gray-300'
            }\`}>
              {val}
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 bg-gray-50 rounded text-sm">
        <p><strong>Strategy:</strong> Find range by doubling (1, 2, 4, 8...), then binary search</p>
        <p><strong>Time:</strong> O(log n) | <strong>Space:</strong> O(1)</p>
        <p><strong>Best for:</strong> Unbounded/infinite arrays</p>
      </div>
    </div>
  );
};`,

  'hash-functions-viz.tsx': `import React, { useState } from 'react';
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
};`,

  'separate-chaining-viz.tsx': `import React, { useState } from 'react';
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
};`
};

Object.entries(templates).forEach(([filename, content]) => {
  fs.writeFileSync(`src/components/visualizer/${filename}`, content);
  console.log(`Created: ${filename}`);
});

console.log('\n✅ All hash/search visualizers created!');
