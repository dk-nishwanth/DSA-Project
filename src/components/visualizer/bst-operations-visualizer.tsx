import React, { useState } from 'react';
import { Play, Plus, Trash2 } from 'lucide-react';

interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  x?: number;
  y?: number;
}

export const BSTOperationsVisualizer: React.FC = () => {
  const [root, setRoot] = useState<TreeNode | null>({
    value: 50,
    left: { value: 30, left: { value: 20, left: null, right: null }, right: { value: 40, left: null, right: null } },
    right: { value: 70, left: { value: 60, left: null, right: null }, right: { value: 80, left: null, right: null } }
  });
  const [searchValue, setSearchValue] = useState(40);
  const [insertValue, setInsertValue] = useState(45);
  const [current, setCurrent] = useState<number | null>(null);
  const [found, setFound] = useState<number | null>(null);

  const search = async (node: TreeNode | null, val: number): Promise<boolean> => {
    if (!node) return false;
    setCurrent(node.value);
    await new Promise(resolve => setTimeout(resolve, 600));
    
    if (node.value === val) {
      setFound(node.value);
      return true;
    }
    
    if (val < node.value) return search(node.left, val);
    return search(node.right, val);
  };

  const handleSearch = async () => {
    setCurrent(null);
    setFound(null);
    await search(root, searchValue);
    setCurrent(null);
  };

  const calculatePositions = (node: TreeNode | null, x: number, y: number, offset: number): void => {
    if (!node) return;
    node.x = x;
    node.y = y;
    if (node.left) calculatePositions(node.left, x - offset, y + 60, offset / 2);
    if (node.right) calculatePositions(node.right, x + offset, y + 60, offset / 2);
  };

  const renderTree = (node: TreeNode | null): JSX.Element[] => {
    if (!node || !root) return [];
    calculatePositions(root, 200, 40, 80);
    
    const elements: JSX.Element[] = [];
    const queue: TreeNode[] = [root];
    
    while (queue.length > 0) {
      const n = queue.shift()!;
      
      if (n.left) {
        elements.push(
          <line key={`${n.value}-${n.left.value}`} x1={n.x} y1={n.y} x2={n.left.x} y2={n.left.y} stroke="#cbd5e1" strokeWidth="2" />
        );
        queue.push(n.left);
      }
      if (n.right) {
        elements.push(
          <line key={`${n.value}-${n.right.value}`} x1={n.x} y1={n.y} x2={n.right.x} y2={n.right.y} stroke="#cbd5e1" strokeWidth="2" />
        );
        queue.push(n.right);
      }
      
      elements.push(
        <g key={`node-${n.value}`}>
          <circle
            cx={n.x}
            cy={n.y}
            r="20"
            fill={found === n.value ? '#22c55e' : current === n.value ? '#3b82f6' : '#e2e8f0'}
            stroke="#64748b"
            strokeWidth="2"
          />
          <text x={n.x} y={n.y + 5} textAnchor="middle" className="text-sm font-bold" fill={current === n.value || found === n.value ? 'white' : 'black'}>
            {n.value}
          </text>
        </g>
      );
    }
    
    return elements;
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Binary Search Tree Operations</h3>
      
      <div className="flex gap-2 mb-4">
        <input type="number" value={searchValue} onChange={(e) => setSearchValue(Number(e.target.value))} className="w-20 px-2 py-1 border rounded" />
        <button onClick={handleSearch} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          <Play size={16} /> Search
        </button>
      </div>

      <svg width="400" height="250" className="border rounded mb-4">
        {renderTree(root)}
      </svg>

      <div className="p-3 bg-gray-50 rounded text-sm">
        <p><strong>BST Property:</strong> Left &lt; Root &lt; Right</p>
        <p><strong>Search/Insert/Delete:</strong> O(log n) average, O(n) worst</p>
      </div>
    </div>
  );
};
