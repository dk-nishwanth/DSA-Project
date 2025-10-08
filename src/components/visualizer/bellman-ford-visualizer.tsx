import React, { useState } from 'react';
import { Play, RotateCcw, Info } from 'lucide-react';

interface Edge {
  from: number;
  to: number;
  weight: number;
}

interface NodeState {
  distance: number;
  predecessor: number | null;
  isActive: boolean;
  isRelaxed: boolean;
}

export const BellmanFordVisualizer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const [iteration, setIteration] = useState(0);
  const [currentEdge, setCurrentEdge] = useState<number | null>(null);
  
  const edges: Edge[] = [
    { from: 0, to: 1, weight: 4 },
    { from: 0, to: 2, weight: 5 },
    { from: 1, to: 2, weight: -3 },
    { from: 2, to: 3, weight: 2 },
    { from: 1, to: 3, weight: 6 },
  ];

  const initialNodes: NodeState[] = [
    { distance: 0, predecessor: null, isActive: true, isRelaxed: false },
    { distance: Infinity, predecessor: null, isActive: false, isRelaxed: false },
    { distance: Infinity, predecessor: null, isActive: false, isRelaxed: false },
    { distance: Infinity, predecessor: null, isActive: false, isRelaxed: false },
  ];

  const [nodes, setNodes] = useState<NodeState[]>(initialNodes);

  const positions = [
    { x: 100, y: 150 },
    { x: 300, y: 50 },
    { x: 300, y: 250 },
    { x: 500, y: 150 },
  ];

  const reset = () => {
    setNodes(initialNodes);
    setStep(0);
    setIteration(0);
    setCurrentEdge(null);
    setIsPlaying(false);
  };

  const relaxEdge = (edge: Edge, nodesCopy: NodeState[]) => {
    if (nodesCopy[edge.from].distance !== Infinity) {
      const newDistance = nodesCopy[edge.from].distance + edge.weight;
      if (newDistance < nodesCopy[edge.to].distance) {
        nodesCopy[edge.to].distance = newDistance;
        nodesCopy[edge.to].predecessor = edge.from;
        nodesCopy[edge.to].isRelaxed = true;
        return true;
      }
    }
    return false;
  };

  const nextStep = () => {
    if (iteration >= 3) return;

    const nodesCopy = [...nodes];
    const edgeIndex = step % edges.length;
    
    if (edgeIndex === 0 && step > 0) {
      setIteration(iteration + 1);
      nodesCopy.forEach(n => n.isRelaxed = false);
    }

    setCurrentEdge(edgeIndex);
    relaxEdge(edges[edgeIndex], nodesCopy);
    
    setNodes(nodesCopy);
    setStep(step + 1);
  };

  const autoPlay = async () => {
    setIsPlaying(true);
    let currentStep = step;
    let currentIteration = iteration;

    while (currentIteration < 3) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const nodesCopy = [...nodes];
      const edgeIndex = currentStep % edges.length;
      
      if (edgeIndex === 0 && currentStep > 0) {
        currentIteration++;
        nodesCopy.forEach(n => n.isRelaxed = false);
      }

      setCurrentEdge(edgeIndex);
      relaxEdge(edges[edgeIndex], nodesCopy);
      
      setNodes(nodesCopy);
      setIteration(currentIteration);
      currentStep++;
      setStep(currentStep);
    }
    
    setIsPlaying(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Bellman-Ford Algorithm</h3>
        <p className="text-gray-600 mb-4">
          Finds shortest paths from source to all vertices, handles negative weights
        </p>
        
        <div className="flex gap-2 mb-4">
          <button
            onClick={autoPlay}
            disabled={isPlaying || iteration >= 3}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
          >
            <Play size={16} /> Play
          </button>
          <button
            onClick={nextStep}
            disabled={isPlaying || iteration >= 3}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300"
          >
            Next Step
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
            <strong>Iteration:</strong> {iteration + 1} / 4 | 
            <strong> Current Edge:</strong> {currentEdge !== null ? `${edges[currentEdge].from} → ${edges[currentEdge].to} (weight: ${edges[currentEdge].weight})` : 'None'}
          </p>
        </div>
      </div>

      <svg width="600" height="350" className="border rounded">
        {/* Draw edges */}
        {edges.map((edge, idx) => {
          const from = positions[edge.from];
          const to = positions[edge.to];
          const isActive = currentEdge === idx;
          
          return (
            <g key={idx}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={isActive ? '#ef4444' : '#94a3b8'}
                strokeWidth={isActive ? 3 : 2}
                markerEnd="url(#arrowhead)"
              />
              <text
                x={(from.x + to.x) / 2}
                y={(from.y + to.y) / 2 - 10}
                className="text-sm font-bold"
                fill={isActive ? '#ef4444' : '#475569'}
              >
                {edge.weight}
              </text>
            </g>
          );
        })}

        {/* Arrow marker */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#94a3b8" />
          </marker>
        </defs>

        {/* Draw nodes */}
        {nodes.map((node, idx) => (
          <g key={idx}>
            <circle
              cx={positions[idx].x}
              cy={positions[idx].y}
              r={30}
              fill={node.isRelaxed ? '#86efac' : node.isActive ? '#93c5fd' : '#e2e8f0'}
              stroke={node.isActive ? '#3b82f6' : '#64748b'}
              strokeWidth={2}
            />
            <text
              x={positions[idx].x}
              y={positions[idx].y - 5}
              textAnchor="middle"
              className="text-lg font-bold"
            >
              {idx}
            </text>
            <text
              x={positions[idx].x}
              y={positions[idx].y + 10}
              textAnchor="middle"
              className="text-xs"
              fill="#475569"
            >
              {node.distance === Infinity ? '∞' : node.distance}
            </text>
          </g>
        ))}
      </svg>

      <div className="mt-4 p-4 bg-gray-50 rounded">
        <div className="flex items-start gap-2">
          <Info size={16} className="mt-1 text-blue-500" />
          <div className="text-sm">
            <p className="font-semibold mb-1">Algorithm Steps:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Initialize source distance to 0, all others to ∞</li>
              <li>Relax all edges V-1 times (V = number of vertices)</li>
              <li>For each edge (u,v): if dist[u] + weight(u,v) &lt; dist[v], update dist[v]</li>
              <li>Check for negative cycles in final iteration</li>
            </ol>
            <p className="mt-2"><strong>Time:</strong> O(V×E) | <strong>Space:</strong> O(V)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
