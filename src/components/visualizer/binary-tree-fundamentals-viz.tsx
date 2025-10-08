import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

export const BinaryTreeFundamentalsViz: React.FC = () => {
  const [tree] = useState<TreeNode>({
    value: 1,
    left: { value: 2, left: { value: 4, left: null, right: null }, right: { value: 5, left: null, right: null } },
    right: { value: 3, left: { value: 6, left: null, right: null }, right: { value: 7, left: null, right: null } }
  });
  const [traversal, setTraversal] = useState<number[]>([]);
  const [current, setCurrent] = useState<number | null>(null);
  const [mode, setMode] = useState<'inorder' | 'preorder' | 'postorder'>('inorder');
  const [isPlaying, setIsPlaying] = useState(false);

  const reset = () => {
    setTraversal([]);
    setCurrent(null);
    setIsPlaying(false);
  };

  const inorder = async (node: TreeNode | null, result: number[]) => {
    if (!node) return;
    await inorder(node.left, result);
    setCurrent(node.value);
    result.push(node.value);
    setTraversal([...result]);
    await new Promise(resolve => setTimeout(resolve, 600));
    await inorder(node.right, result);
  };

  const preorder = async (node: TreeNode | null, result: number[]) => {
    if (!node) return;
    setCurrent(node.value);
    result.push(node.value);
    setTraversal([...result]);
    await new Promise(resolve => setTimeout(resolve, 600));
    await preorder(node.left, result);
    await preorder(node.right, result);
  };

  const postorder = async (node: TreeNode | null, result: number[]) => {
    if (!node) return;
    await postorder(node.left, result);
    await postorder(node.right, result);
    setCurrent(node.value);
    result.push(node.value);
    setTraversal([...result]);
    await new Promise(resolve => setTimeout(resolve, 600));
  };

  const traverse = async () => {
    setIsPlaying(true);
    const result: number[] = [];
    if (mode === 'inorder') await inorder(tree, result);
    else if (mode === 'preorder') await preorder(tree, result);
    else await postorder(tree, result);
    setCurrent(null);
    setIsPlaying(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Binary Tree Fundamentals</h3>
      
      <div className="flex gap-2 mb-4">
        <select value={mode} onChange={(e) => setMode(e.target.value as any)} disabled={isPlaying} className="px-3 py-2 border rounded">
          <option value="inorder">Inorder</option>
          <option value="preorder">Preorder</option>
          <option value="postorder">Postorder</option>
        </select>
        <button onClick={traverse} disabled={isPlaying} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300">
          <Play size={16} /> Traverse
        </button>
        <button onClick={reset} className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      <svg width="400" height="250" className="border rounded mb-4">
        {/* Edges */}
        <line x1="200" y1="40" x2="100" y2="100" stroke="#cbd5e1" strokeWidth="2" />
        <line x1="200" y1="40" x2="300" y2="100" stroke="#cbd5e1" strokeWidth="2" />
        <line x1="100" y1="100" x2="50" y2="160" stroke="#cbd5e1" strokeWidth="2" />
        <line x1="100" y1="100" x2="150" y2="160" stroke="#cbd5e1" strokeWidth="2" />
        <line x1="300" y1="100" x2="250" y2="160" stroke="#cbd5e1" strokeWidth="2" />
        <line x1="300" y1="100" x2="350" y2="160" stroke="#cbd5e1" strokeWidth="2" />

        {/* Nodes */}
        {[
          { val: 1, x: 200, y: 40 },
          { val: 2, x: 100, y: 100 },
          { val: 3, x: 300, y: 100 },
          { val: 4, x: 50, y: 160 },
          { val: 5, x: 150, y: 160 },
          { val: 6, x: 250, y: 160 },
          { val: 7, x: 350, y: 160 }
        ].map(({ val, x, y }) => (
          <g key={val}>
            <circle
              cx={x}
              cy={y}
              r="20"
              fill={current === val ? '#3b82f6' : traversal.includes(val) ? '#22c55e' : '#e2e8f0'}
              stroke="#64748b"
              strokeWidth="2"
            />
            <text x={x} y={y + 5} textAnchor="middle" className="text-lg font-bold" fill={current === val || traversal.includes(val) ? 'white' : 'black'}>
              {val}
            </text>
          </g>
        ))}
      </svg>

      <div className="p-3 bg-blue-50 rounded">
        <p className="text-sm"><strong>Traversal:</strong> [{traversal.join(', ')}]</p>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
        <p><strong>Inorder:</strong> Left → Root → Right (sorted for BST)</p>
        <p><strong>Preorder:</strong> Root → Left → Right (copy tree)</p>
        <p><strong>Postorder:</strong> Left → Right → Root (delete tree)</p>
      </div>
    </div>
  );
};
