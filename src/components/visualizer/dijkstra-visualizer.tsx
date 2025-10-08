import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

export const DijkstraVisualizer: React.FC = () => {
  const [distances, setDistances] = useState<number[]>([0, Infinity, Infinity, Infinity, Infinity, Infinity]);
  const [visited, setVisited] = useState<Set<number>>(new Set());
  const [current, setCurrent] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const edges = [
    { from: 0, to: 1, weight: 4 },
    { from: 0, to: 2, weight: 2 },
    { from: 1, to: 3, weight: 5 },
    { from: 2, to: 1, weight: 1 },
    { from: 2, to: 4, weight: 10 },
    { from: 3, to: 5, weight: 3 },
    { from: 4, to: 3, weight: 2 },
    { from: 4, to: 5, weight: 6 }
  ];

  const positions: Record<number, { x: number; y: number }> = {
    0: { x: 50, y: 150 },
    1: { x: 200, y: 50 },
    2: { x: 200, y: 250 },
    3: { x: 350, y: 50 },
    4: { x: 350, y: 250 },
    5: { x: 500, y: 150 }
  };

  const reset = () => {
    setDistances([0, Infinity, Infinity, Infinity, Infinity, Infinity]);
    setVisited(new Set());
    setCurrent(null);
    setIsPlaying(false);
  };

  const dijkstra = async () => {
    setIsPlaying(true);
    const dist = [0, Infinity, Infinity, Infinity, Infinity, Infinity];
    const vis = new Set<number>();
    
    for (let i = 0; i < 6; i++) {
      let minDist = Infinity;
      let minNode = -1;
      
      for (let j = 0; j < 6; j++) {
        if (!vis.has(j) && dist[j] < minDist) {
          minDist = dist[j];
          minNode = j;
        }
      }
      
      if (minNode === -1) break;
      
      setCurrent(minNode);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      vis.add(minNode);
      setVisited(new Set(vis));
      
      edges.forEach(edge => {
        if (edge.from === minNode && !vis.has(edge.to)) {
          const newDist = dist[minNode] + edge.weight;
          if (newDist < dist[edge.to]) {
            dist[edge.to] = newDist;
            setDistances([...dist]);
          }
        }
      });
      
      await new Promise(resolve => setTimeout(resolve, 600));
    }
    
    setCurrent(null);
    setIsPlaying(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Dijkstra's Algorithm</h3>
      
      <div className="flex gap-2 mb-4">
        <button onClick={dijkstra} disabled={isPlaying} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300">
          <Play size={16} /> Start
        </button>
        <button onClick={reset} className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      <svg width="550" height="300" className="border rounded mb-4">
        {edges.map((edge, idx) => (
          <g key={idx}>
            <line
              x1={positions[edge.from].x}
              y1={positions[edge.from].y}
              x2={positions[edge.to].x}
              y2={positions[edge.to].y}
              stroke="#cbd5e1"
              strokeWidth="2"
              markerEnd="url(#arrow)"
            />
            <text
              x={(positions[edge.from].x + positions[edge.to].x) / 2}
              y={(positions[edge.from].y + positions[edge.to].y) / 2 - 10}
              className="text-sm font-bold"
              fill="#64748b"
            >
              {edge.weight}
            </text>
          </g>
        ))}

        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="#cbd5e1" />
          </marker>
        </defs>

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
                y={positions[n].y - 5}
                textAnchor="middle"
                className="text-lg font-bold"
                fill={visited.has(n) || current === n ? 'white' : 'black'}
              >
                {n}
              </text>
              <text
                x={positions[n].x}
                y={positions[n].y + 10}
                textAnchor="middle"
                className="text-xs"
                fill={visited.has(n) || current === n ? 'white' : 'black'}
              >
                {distances[n] === Infinity ? '∞' : distances[n]}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="p-3 bg-gray-50 rounded text-sm">
        <p><strong>Greedy approach:</strong> Always pick nearest unvisited node</p>
        <p><strong>Time:</strong> O((V+E) log V) with heap | <strong>Space:</strong> O(V)</p>
        <p><strong>Note:</strong> Only works with non-negative edge weights</p>
      </div>
    </div>
  );
};
