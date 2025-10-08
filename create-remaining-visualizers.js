import fs from 'fs';

const visualizers = {
  'inorder-traversal-visualizer.tsx': `import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

export const InorderTraversalVisualizer: React.FC = () => {
  const [traversal, setTraversal] = useState<number[]>([]);
  const [current, setCurrent] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const tree = { val: 4, left: { val: 2, left: { val: 1 }, right: { val: 3 } }, right: { val: 6, left: { val: 5 }, right: { val: 7 } } };

  const inorder = async (node: any, result: number[]) => {
    if (!node) return;
    await inorder(node.left, result);
    setCurrent(node.val);
    result.push(node.val);
    setTraversal([...result]);
    await new Promise(resolve => setTimeout(resolve, 600));
    await inorder(node.right, result);
  };

  const traverse = async () => {
    setIsPlaying(true);
    const result: number[] = [];
    await inorder(tree, result);
    setCurrent(null);
    setIsPlaying(false);
  };

  const reset = () => {
    setTraversal([]);
    setCurrent(null);
    setIsPlaying(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Inorder Traversal (Left-Root-Right)</h3>
      <div className="flex gap-2 mb-4">
        <button onClick={traverse} disabled={isPlaying} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300">
          <Play size={16} /> Traverse
        </button>
        <button onClick={reset} className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          <RotateCcw size={16} /> Reset
        </button>
      </div>
      <div className="p-3 bg-blue-50 rounded mb-4">
        <p className="text-sm"><strong>Traversal:</strong> [{traversal.join(', ')}]</p>
        <p className="text-sm"><strong>Result:</strong> Sorted order for BST</p>
      </div>
      <svg width="300" height="200" className="border rounded">
        <line x1="150" y1="40" x2="75" y2="100" stroke="#cbd5e1" strokeWidth="2" />
        <line x1="150" y1="40" x2="225" y2="100" stroke="#cbd5e1" strokeWidth="2" />
        <line x1="75" y1="100" x2="40" y2="160" stroke="#cbd5e1" strokeWidth="2" />
        <line x1="75" y1="100" x2="110" y2="160" stroke="#cbd5e1" strokeWidth="2" />
        <line x1="225" y1="100" x2="190" y2="160" stroke="#cbd5e1" strokeWidth="2" />
        <line x1="225" y1="100" x2="260" y2="160" stroke="#cbd5e1" strokeWidth="2" />
        {[
          { val: 4, x: 150, y: 40 },
          { val: 2, x: 75, y: 100 },
          { val: 6, x: 225, y: 100 },
          { val: 1, x: 40, y: 160 },
          { val: 3, x: 110, y: 160 },
          { val: 5, x: 190, y: 160 },
          { val: 7, x: 260, y: 160 }
        ].map(({ val, x, y }) => (
          <g key={val}>
            <circle cx={x} cy={y} r="18" fill={current === val ? '#3b82f6' : traversal.includes(val) ? '#22c55e' : '#e2e8f0'} stroke="#64748b" strokeWidth="2" />
            <text x={x} y={y + 5} textAnchor="middle" className="font-bold" fill={current === val || traversal.includes(val) ? 'white' : 'black'}>{val}</text>
          </g>
        ))}
      </svg>
      <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
        <p><strong>Order:</strong> Left subtree → Root → Right subtree</p>
        <p><strong>Use:</strong> Get sorted sequence from BST</p>
      </div>
    </div>
  );
};`,

  'preorder-traversal-visualizer.tsx': `import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

export const PreorderTraversalVisualizer: React.FC = () => {
  const [traversal, setTraversal] = useState<number[]>([]);
  const [current, setCurrent] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const tree = { val: 4, left: { val: 2, left: { val: 1 }, right: { val: 3 } }, right: { val: 6, left: { val: 5 }, right: { val: 7 } } };

  const preorder = async (node: any, result: number[]) => {
    if (!node) return;
    setCurrent(node.val);
    result.push(node.val);
    setTraversal([...result]);
    await new Promise(resolve => setTimeout(resolve, 600));
    await preorder(node.left, result);
    await preorder(node.right, result);
  };

  const traverse = async () => {
    setIsPlaying(true);
    const result: number[] = [];
    await preorder(tree, result);
    setCurrent(null);
    setIsPlaying(false);
  };

  const reset = () => {
    setTraversal([]);
    setCurrent(null);
    setIsPlaying(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Preorder Traversal (Root-Left-Right)</h3>
      <div className="flex gap-2 mb-4">
        <button onClick={traverse} disabled={isPlaying} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300">
          <Play size={16} /> Traverse
        </button>
        <button onClick={reset} className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          <RotateCcw size={16} /> Reset
        </button>
      </div>
      <div className="p-3 bg-blue-50 rounded mb-4">
        <p className="text-sm"><strong>Traversal:</strong> [{traversal.join(', ')}]</p>
        <p className="text-sm"><strong>Result:</strong> Root first, useful for copying tree</p>
      </div>
      <svg width="300" height="200" className="border rounded">
        <line x1="150" y1="40" x2="75" y2="100" stroke="#cbd5e1" strokeWidth="2" />
        <line x1="150" y1="40" x2="225" y2="100" stroke="#cbd5e1" strokeWidth="2" />
        <line x1="75" y1="100" x2="40" y2="160" stroke="#cbd5e1" strokeWidth="2" />
        <line x1="75" y1="100" x2="110" y2="160" stroke="#cbd5e1" strokeWidth="2" />
        <line x1="225" y1="100" x2="190" y2="160" stroke="#cbd5e1" strokeWidth="2" />
        <line x1="225" y1="100" x2="260" y2="160" stroke="#cbd5e1" strokeWidth="2" />
        {[
          { val: 4, x: 150, y: 40 },
          { val: 2, x: 75, y: 100 },
          { val: 6, x: 225, y: 100 },
          { val: 1, x: 40, y: 160 },
          { val: 3, x: 110, y: 160 },
          { val: 5, x: 190, y: 160 },
          { val: 7, x: 260, y: 160 }
        ].map(({ val, x, y }) => (
          <g key={val}>
            <circle cx={x} cy={y} r="18" fill={current === val ? '#3b82f6' : traversal.includes(val) ? '#22c55e' : '#e2e8f0'} stroke="#64748b" strokeWidth="2" />
            <text x={x} y={y + 5} textAnchor="middle" className="font-bold" fill={current === val || traversal.includes(val) ? 'white' : 'black'}>{val}</text>
          </g>
        ))}
      </svg>
      <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
        <p><strong>Order:</strong> Root → Left subtree → Right subtree</p>
        <p><strong>Use:</strong> Copy tree structure, prefix expression</p>
      </div>
    </div>
  );
};`,

  'postorder-traversal-visualizer.tsx': `import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

export const PostorderTraversalVisualizer: React.FC = () => {
  const [traversal, setTraversal] = useState<number[]>([]);
  const [current, setCurrent] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const tree = { val: 4, left: { val: 2, left: { val: 1 }, right: { val: 3 } }, right: { val: 6, left: { val: 5 }, right: { val: 7 } } };

  const postorder = async (node: any, result: number[]) => {
    if (!node) return;
    await postorder(node.left, result);
    await postorder(node.right, result);
    setCurrent(node.val);
    result.push(node.val);
    setTraversal([...result]);
    await new Promise(resolve => setTimeout(resolve, 600));
  };

  const traverse = async () => {
    setIsPlaying(true);
    const result: number[] = [];
    await postorder(tree, result);
    setCurrent(null);
    setIsPlaying(false);
  };

  const reset = () => {
    setTraversal([]);
    setCurrent(null);
    setIsPlaying(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Postorder Traversal (Left-Right-Root)</h3>
      <div className="flex gap-2 mb-4">
        <button onClick={traverse} disabled={isPlaying} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300">
          <Play size={16} /> Traverse
        </button>
        <button onClick={reset} className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          <RotateCcw size={16} /> Reset
        </button>
      </div>
      <div className="p-3 bg-blue-50 rounded mb-4">
        <p className="text-sm"><strong>Traversal:</strong> [{traversal.join(', ')}]</p>
        <p className="text-sm"><strong>Result:</strong> Children before parent, useful for deletion</p>
      </div>
      <svg width="300" height="200" className="border rounded">
        <line x1="150" y1="40" x2="75" y2="100" stroke="#cbd5e1" strokeWidth="2" />
        <line x1="150" y1="40" x2="225" y2="100" stroke="#cbd5e1" strokeWidth="2" />
        <line x1="75" y1="100" x2="40" y2="160" stroke="#cbd5e1" strokeWidth="2" />
        <line x1="75" y1="100" x2="110" y2="160" stroke="#cbd5e1" strokeWidth="2" />
        <line x1="225" y1="100" x2="190" y2="160" stroke="#cbd5e1" strokeWidth="2" />
        <line x1="225" y1="100" x2="260" y2="160" stroke="#cbd5e1" strokeWidth="2" />
        {[
          { val: 4, x: 150, y: 40 },
          { val: 2, x: 75, y: 100 },
          { val: 6, x: 225, y: 100 },
          { val: 1, x: 40, y: 160 },
          { val: 3, x: 110, y: 160 },
          { val: 5, x: 190, y: 160 },
          { val: 7, x: 260, y: 160 }
        ].map(({ val, x, y }) => (
          <g key={val}>
            <circle cx={x} cy={y} r="18" fill={current === val ? '#3b82f6' : traversal.includes(val) ? '#22c55e' : '#e2e8f0'} stroke="#64748b" strokeWidth="2" />
            <text x={x} y={y + 5} textAnchor="middle" className="font-bold" fill={current === val || traversal.includes(val) ? 'white' : 'black'}>{val}</text>
          </g>
        ))}
      </svg>
      <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
        <p><strong>Order:</strong> Left subtree → Right subtree → Root</p>
        <p><strong>Use:</strong> Delete tree, postfix expression</p>
      </div>
    </div>
  );
};`
};

// Create all files
Object.entries(visualizers).forEach(([filename, content]) => {
  fs.writeFileSync(`src/components/visualizer/${filename}`, content);
  console.log(`Created: ${filename}`);
});

console.log('\n✅ All traversal visualizers created!');
