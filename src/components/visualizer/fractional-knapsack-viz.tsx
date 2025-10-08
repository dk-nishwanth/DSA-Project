import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface Item {
  weight: number;
  value: number;
  ratio: number;
  taken: number;
}

export const FractionalKnapsackViz: React.FC = () => {
  const [items, setItems] = useState<Item[]>([
    { weight: 10, value: 60, ratio: 6, taken: 0 },
    { weight: 20, value: 100, ratio: 5, taken: 0 },
    { weight: 30, value: 120, ratio: 4, taken: 0 }
  ]);
  const [capacity] = useState(50);
  const [remaining, setRemaining] = useState(50);
  const [totalValue, setTotalValue] = useState(0);
  const [current, setCurrent] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  const reset = () => {
    setItems(items.map(i => ({ ...i, taken: 0 })));
    setRemaining(capacity);
    setTotalValue(0);
    setCurrent(-1);
    setIsPlaying(false);
  };

  const solve = async () => {
    setIsPlaying(true);
    const sorted = [...items].sort((a, b) => b.ratio - a.ratio);
    setItems(sorted);
    await new Promise(resolve => setTimeout(resolve, 500));

    let cap = capacity;
    let value = 0;

    for (let i = 0; i < sorted.length; i++) {
      setCurrent(i);
      await new Promise(resolve => setTimeout(resolve, 800));

      if (cap >= sorted[i].weight) {
        sorted[i].taken = 1;
        cap -= sorted[i].weight;
        value += sorted[i].value;
      } else {
        sorted[i].taken = cap / sorted[i].weight;
        value += sorted[i].value * sorted[i].taken;
        cap = 0;
      }

      setItems([...sorted]);
      setRemaining(cap);
      setTotalValue(value);
      await new Promise(resolve => setTimeout(resolve, 600));

      if (cap === 0) break;
    }

    setCurrent(-1);
    setIsPlaying(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Fractional Knapsack (Greedy)</h3>
      <div className="flex gap-2 mb-4">
        <button onClick={solve} disabled={isPlaying} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300">
          <Play size={16} /> Solve
        </button>
        <button onClick={reset} className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          <RotateCcw size={16} /> Reset
        </button>
      </div>
      <div className="mb-4 p-3 bg-blue-50 rounded">
        <p className="text-sm"><strong>Capacity:</strong> {capacity} | <strong>Remaining:</strong> {remaining}</p>
        <p className="text-sm"><strong>Total Value:</strong> {totalValue.toFixed(2)}</p>
      </div>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className={`p-3 border-2 rounded ${
            item.taken > 0 ? 'bg-green-100 border-green-400' :
            current === idx ? 'bg-blue-100 border-blue-400' :
            'bg-gray-50 border-gray-300'
          }`}>
            <div className="flex justify-between items-center">
              <span>W:{item.weight} V:{item.value}</span>
              <span className="text-sm">Ratio: {item.ratio}</span>
              {item.taken > 0 && <span className="text-green-600 font-bold">{(item.taken * 100).toFixed(0)}% taken</span>}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
        <p><strong>Greedy Strategy:</strong> Sort by value/weight ratio, take items greedily</p>
        <p><strong>Time:</strong> O(n log n) | <strong>Space:</strong> O(1)</p>
      </div>
    </div>
  );
};
