import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

export const GraphBFSVisualizer: React.FC = () => {
  const [visited, setVisited] = useState<Set<number>>(new Set());
  const [queue, setQueue] = useState<number[]>([]);
  const [current, setCurrent] = useState<number | null>(null);
  const [level, setLevel] = useState<Record<number, number>>({});
  const [isPlaying, setIsPlaying] = useState(false);

  const graph = {
    0: [1, 2],
    1: [0, 3, 4],
    2: [0, 5],
    3: [1],
    4: [1, 5],
    5: [2, 4]
  };

  const positions: Record<number, { x: number; y: number }> = {
    0: { x: 200, y: 50 },
    1: { x: 100, y: 150 },
    2: { x: 300, y: 150 },
    3: { x: 50, y: 250 },
    4: { x: 150, y: 250 },
    5: { x: 300, y: 250 }
  };

  const reset = () => {
    setVisited(new Set());
    setQueue([]);
    setCurrent(null);
    setLevel({});
    setIsPlaying(false);
  };

  const bfs = async () => {
    setIsPlaying(true);
    const vis = new Set<number>();
    const q = [0];
    const lvl: Record<number, number> = { 0: 0 };
    
    setQueue([0]);
    setLevel(lvl);

    while (q.length > 0) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const node = q.shift()!;
      setCurrent(node);
      setQueue([...q]);

      if (!vis.has(node)) {
        vis.add(node);
        setVisited(new Set(vis));
        await new Promise(resolve => setTimeout(resolve, 600));

        const neighbors = graph[node as keyof typeof graph] || [];
        neighbors.forEach(neighbor => {
          if (!vis.has(neighbor) && !q.includes(neighbor)) {
            q.push(neighbor);
            lvl[neighbor] = lvl[node] + 1;
          }
        });
        setQueue([...q]);
        setLevel({...lvl});
      }
    }

    setCurrent(null);
    setIsPlaying(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Breadth First Search (BFS)</h3>
      
      <div className="flex gap-2 mb-4">
        <button onClick={bfs} disabled={isPlaying} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300">
          <Play size={16} /> Start BFS
        </button>
        <button onClick={reset} className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      <div className="mb-4 p-3 bg-blue-50 rounded">
        <p className="text-sm"><strong>Queue:</strong> [{queue.join(', ')}]</p>
        <p className="text-sm"><strong>Visited:</strong> {visited.size} nodes</p>
      </div>

      <svg width="400" height="300" className="border rounded">
        {Object.entries(graph).map(([from, tos]) =>
          tos.map(to => (
            <line
              key={`${from}-${to}`}
              x1={positions[Number(from)].x}
              y1={positions[Number(from)].y}
              x2={positions[to].x}
              y2={positions[to].y}
              stroke="#cbd5e1"
              strokeWidth="2"
            />
          ))
        )}

        {Object.keys(positions).map(node => {
          const n = Number(node);
          return (
            <g key={n}>
              <circle
                cx={positions[n].x}
                cy={positions[n].y}
                r="25"
                fill={visited.has(n) ? '#22c55e' : current === n ? '#3b82f6' : '#e2e8f0'}
                stroke="#64748b"
                strokeWidth="2"
              />
              <text
                x={positions[n].x}
                y={positions[n].y + 5}
                textAnchor="middle"
                className="text-lg font-bold"
                fill={visited.has(n) || current === n ? 'white' : 'black'}
              >
                {n}
              </text>
              {level[n] !== undefined && (
                <text
                  x={positions[n].x}
                  y={positions[n].y - 35}
                  textAnchor="middle"
                  className="text-xs"
                  fill="#64748b"
                >
                  L{level[n]}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
        <p><strong>BFS Strategy:</strong> Explore level by level, nearest first</p>
        <p><strong>Uses:</strong> Queue (FIFO) | <strong>Time:</strong> O(V+E) | <strong>Space:</strong> O(V)</p>
      </div>
    </div>
  );
};
