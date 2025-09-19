import React, { useState, useCallback, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { PseudocodeBox } from '@/components/pseudocode-box';
import { ComplexityBox } from '@/components/complexity-box';

type DataStructure = 'segment-tree' | 'fenwick-tree';

interface SegmentTreeNode {
  id: string;
  value: number;
  left: number;
  right: number;
  leftChild?: string;
  rightChild?: string;
  isLeaf?: boolean;
  highlighted?: boolean;
  contributes?: boolean;
  level: number;
}

interface FenwickTreeNode {
  id: number;
  value: number;
  highlighted?: boolean;
  contributing?: boolean;
}

export function AdvancedVisualizer() {
  const [dataStructure, setDataStructure] = useState<DataStructure>('segment-tree');
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentStepDescription, setCurrentStepDescription] = useState('');
  const [voiceExplain, setVoiceExplain] = useState<boolean>(() => {
    try { return localStorage.getItem('dsa_voice_explain') === '1'; } catch { return false; }
  });
  useEffect(() => {
    if (!voiceExplain || !currentStepDescription) return;
    try {
      const u = new SpeechSynthesisUtterance(currentStepDescription);
      u.rate = 1.05; u.pitch = 1.0; u.volume = 0.85;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch {}
  }, [voiceExplain, currentStepDescription]);
  const setVoice = (on: boolean) => {
    setVoiceExplain(on);
    try { localStorage.setItem('dsa_voice_explain', on ? '1' : '0'); } catch {}
  };

  // Segment Tree State
  const [segmentArray, setSegmentArray] = useState([1, 3, 5, 7, 9, 11]);
  const [segmentTree, setSegmentTree] = useState<SegmentTreeNode[]>([]);
  const [queryLeft, setQueryLeft] = useState(1);
  const [queryRight, setQueryRight] = useState(3);

  // Fenwick Tree State
  const [fenwickArray, setFenwickArray] = useState([1, 3, 5, 7, 9, 11]);
  const [fenwickTree, setFenwickTree] = useState<FenwickTreeNode[]>([]);
  const [queryIndex, setQueryIndex] = useState(5);

  const pseudocode: Record<DataStructure, string[]> = {
    'segment-tree': [
      "function buildTree(arr, node, start, end):",
      "  if start == end:",
      "    tree[node] = arr[start]",
      "  else:",
      "    mid = (start + end) / 2",
      "    buildTree(arr, 2*node, start, mid)",
      "    buildTree(arr, 2*node+1, mid+1, end)",
      "    tree[node] = tree[2*node] + tree[2*node+1]",
      "",
      "function query(node, start, end, l, r):",
      "  if r < start or end < l:",
      "    return 0",
      "  if l <= start and end <= r:",
      "    return tree[node]",
      "  mid = (start + end) / 2",
      "  return query(2*node, start, mid, l, r) +",
      "         query(2*node+1, mid+1, end, l, r)"
    ],
    'fenwick-tree': [
      "function update(i, delta):",
      "  while i <= n:",
      "    tree[i] += delta",
      "    i += i & (-i)  // add LSB",
      "",
      "function prefixSum(i):",
      "  sum = 0",
      "  while i > 0:",
      "    sum += tree[i]",
      "    i -= i & (-i)  // remove LSB",
      "  return sum",
      "",
      "function rangeSum(l, r):",
      "  return prefixSum(r) - prefixSum(l-1)"
    ]
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const buildSegmentTree = useCallback(async (arr: number[]) => {
    const n = arr.length;
    setCurrentStep(0);
    setCurrentStepDescription('Building segment tree from array');
    await sleep(300);

    const nodes: Record<string, SegmentTreeNode> = {};

    const buildNode = (nodeId: string, start: number, end: number, level: number): SegmentTreeNode => {
      if (start === end) {
        setCurrentStep(1);
        const leaf: SegmentTreeNode = {
          id: nodeId,
          value: arr[start],
          left: start,
          right: end,
          isLeaf: true,
          highlighted: true,
          contributes: false,
          level,
        };
        nodes[nodeId] = leaf;
        return leaf;
      } else {
        setCurrentStep(4);
        const mid = Math.floor((start + end) / 2);
        const leftChild = `${nodeId}-L`;
        const rightChild = `${nodeId}-R`;
        const leftNode = buildNode(leftChild, start, mid, level + 1);
        const rightNode = buildNode(rightChild, mid + 1, end, level + 1);
        setCurrentStep(7);
        const node: SegmentTreeNode = {
          id: nodeId,
          value: leftNode.value + rightNode.value,
          left: start,
          right: end,
          leftChild,
          rightChild,
          highlighted: true,
          contributes: false,
          level,
        };
        nodes[nodeId] = node;
        return node;
      }
    };

    const root = buildNode('root', 0, n - 1, 0);

    // Build level-order list for rendering
    const queue: string[] = [root.id];
    const ordered: SegmentTreeNode[] = [];
    while (queue.length) {
      const id = queue.shift()!;
      const node = nodes[id];
      if (!node) continue;
      ordered.push({ ...node, highlighted: false });
      if (node.leftChild) queue.push(node.leftChild);
      if (node.rightChild) queue.push(node.rightChild);
    }

    setSegmentTree(ordered);
    toast.success('Segment tree built successfully');
  }, []);

  const buildFenwickTree = useCallback(async (arr: number[]) => {
    const n = arr.length;
    const tree: FenwickTreeNode[] = new Array(n + 1).fill(0).map((_, i) => ({
      id: i,
      value: 0
    }));

    setCurrentStep(0);
    setCurrentStepDescription('Building Fenwick tree (Binary Indexed Tree)');
    await sleep(1000);

    // Build Fenwick tree
    for (let i = 0; i < n; i++) {
      let idx = i + 1;
      setCurrentStep(1);
      setCurrentStepDescription(`Updating position ${idx} with value ${arr[i]}`);
      
      while (idx <= n) {
        tree[idx].value += arr[i];
        tree[idx].highlighted = true;
        setFenwickTree([...tree]);
        await sleep(500);
        
        tree[idx].highlighted = false;
        idx += idx & (-idx); // Add LSB
        setCurrentStep(2);
      }
    }

    setFenwickTree(tree);
    toast.success('Fenwick tree built successfully');
  }, []);

  const querySegmentTree = useCallback(async () => {
    if (segmentTree.length === 0) return;

    const within = (l: number, r: number, ql: number, qr: number) => ql <= l && r <= qr;
    const outside = (l: number, r: number, ql: number, qr: number) => r < ql || l > qr;

    setCurrentStep(58); // function query start
    setCurrentStepDescription(`Querying range [${queryLeft}, ${queryRight}]`);

    // Recreate id->node map
    const map: Record<string, SegmentTreeNode> = {};
    segmentTree.forEach(n => (map[n.id] = { ...n, highlighted: false, contributes: false }));

    const highlightNode = async (id: string, desc: string) => {
      map[id].highlighted = true;
      setSegmentTree(Object.values(map).sort((a,b)=> a.level - b.level || a.id.localeCompare(b.id)));
      setCurrentStepDescription(desc);
      await sleep(400);
      map[id].highlighted = false;
      setSegmentTree(Object.values(map).sort((a,b)=> a.level - b.level || a.id.localeCompare(b.id)));
    };

    let result = 0;
    const dfs = async (id: string): Promise<number> => {
      const node = map[id];
      if (!node) return 0;
      const { left, right } = node;

      if (outside(left, right, queryLeft, queryRight)) {
        setCurrentStep(60); // return 0
        await highlightNode(id, `Node ${id} [${left},${right}] is outside range → contributes 0`);
        return 0;
      }
      if (within(left, right, queryLeft, queryRight)) {
        setCurrentStep(62); // return tree[node]
        map[id].contributes = true;
        setSegmentTree(Object.values(map).sort((a,b)=> a.level - b.level || a.id.localeCompare(b.id)));
        await highlightNode(id, `Node ${id} [${left},${right}] fully within range → contributes ${node.value}`);
        return node.value;
      }
      setCurrentStep(63); // mid calc and recurse both sides
      await highlightNode(id, `Node ${id} [${left},${right}] partially overlaps → split to children`);
      const leftSum = node.leftChild ? await dfs(node.leftChild) : 0;
      const rightSum = node.rightChild ? await dfs(node.rightChild) : 0;
      return leftSum + rightSum;
    };

    result = await dfs('root');
    await sleep(300);
    toast.success(`Range sum [${queryLeft}, ${queryRight}] = ${result}`);
  }, [segmentTree, queryLeft, queryRight]);

  const queryFenwickTree = useCallback(async () => {
    if (fenwickTree.length === 0) return;
    
    setCurrentStep(5);
    setCurrentStepDescription(`Computing prefix sum up to index ${queryIndex}`);
    
    let sum = 0;
    let i = queryIndex;
    
    const updatedTree = [...fenwickTree];
    
    while (i > 0) {
      setCurrentStep(7);
      setCurrentStepDescription(`Adding tree[${i}] = ${updatedTree[i].value} to sum`);
      
      updatedTree[i].highlighted = true;
      setFenwickTree([...updatedTree]);
      
      sum += updatedTree[i].value;
      await sleep(800);
      
      updatedTree[i].highlighted = false;
      i -= i & (-i); // Remove LSB
      setCurrentStep(8);
    }
    
    setFenwickTree(updatedTree);
    toast.success(`Prefix sum up to ${queryIndex} = ${sum}`);
  }, [fenwickTree, queryIndex]);

  const executeOperation = useCallback(async () => {
    setIsAnimating(true);
    
    if (dataStructure === 'segment-tree') {
      await buildSegmentTree(segmentArray);
      await querySegmentTree();
    } else {
      await buildFenwickTree(fenwickArray);
      await queryFenwickTree();
    }
    
    setIsAnimating(false);
  }, [dataStructure, segmentArray, fenwickArray, buildSegmentTree, buildFenwickTree, querySegmentTree, queryFenwickTree]);

  const renderSegmentTree = () => (
    <div className="space-y-4">
      
      <div className="flex gap-2 items-center mb-4">
        <span className="text-sm font-medium">Array:</span>
        <Input
          value={segmentArray.join(',')}
          onChange={(e) => {
            const arr = e.target.value.split(',').map(x => parseInt(x.trim()) || 0);
            setSegmentArray(arr);
          }}
          className="w-48"
          disabled={isAnimating}
          placeholder="1,3,5,7,9,11"
        />
      </div>
      
      <div className="flex gap-2 items-center mb-4">
        <span className="text-sm font-medium">Query Range:</span>
        <Input
          type="number"
          value={queryLeft}
          onChange={(e) => setQueryLeft(parseInt(e.target.value) || 0)}
          className="w-20"
          disabled={isAnimating}
        />
        <span>to</span>
        <Input
          type="number"
          value={queryRight}
          onChange={(e) => setQueryRight(parseInt(e.target.value) || 0)}
          className="w-20"
          disabled={isAnimating}
        />
      </div>
      
      {/* Array visualization */}
      <div className="flex justify-center gap-1 mb-4">
        {segmentArray.map((value, index) => (
          <div
            key={index}
            className={`w-12 h-12 border-2 rounded flex items-center justify-center font-mono font-bold
              ${index >= queryLeft && index <= queryRight 
                ? 'border-primary bg-primary/20' 
                : 'border-border bg-card'
              }
            `}
          >
            {value}
          </div>
        ))}
      </div>
      
      {/* Tree visualization (multi-level) */}
      {segmentTree.length > 0 && (
        <div className="space-y-3">
          {(() => {
            const levels: Record<number, SegmentTreeNode[]> = {};
            segmentTree.forEach(n => {
              levels[n.level] ||= [];
              levels[n.level].push(n);
            });
            const sortedLevels = Object.keys(levels)
              .map(k => parseInt(k))
              .sort((a,b)=>a-b);
            return (
              <div className="flex flex-col items-center gap-4">
                {sortedLevels.map(lvl => (
                  <div key={lvl} className="flex gap-3">
                    {levels[lvl].map(node => (
                      <div
                        key={node.id}
                        className={`px-3 py-2 border-2 rounded-md text-center transition-all duration-300 ${
                          node.contributes ? 'border-green-500/70 bg-green-500/10' : node.highlighted ? 'border-primary bg-primary/10' : 'border-border bg-card'
                        }`}
                      >
                        <div className="font-mono text-sm font-bold">{node.value}</div>
                        <div className="text-[10px] text-muted-foreground">[{node.left}, {node.right}]</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );

  const renderFenwickTree = () => (
    <div className="space-y-4">
      <div className="flex gap-2 items-center mb-4">
        <span className="text-sm font-medium">Array:</span>
        <Input
          value={fenwickArray.join(',')}
          onChange={(e) => {
            const arr = e.target.value.split(',').map(x => parseInt(x.trim()) || 0);
            setFenwickArray(arr);
          }}
          className="w-48"
          disabled={isAnimating}
          placeholder="1,3,5,7,9,11"
        />
      </div>
      
      <div className="flex gap-2 items-center mb-4">
        <span className="text-sm font-medium">Query Index:</span>
        <Input
          type="number"
          value={queryIndex}
          onChange={(e) => setQueryIndex(parseInt(e.target.value) || 1)}
          className="w-20"
          disabled={isAnimating}
          min="1"
          max={fenwickArray.length}
        />
      </div>
      
      {/* Original array */}
      <div>
        <div className="text-sm font-medium mb-2">Original Array:</div>
        <div className="flex justify-center gap-1 mb-4">
          {fenwickArray.map((value, index) => (
            <div
              key={index}
              className="w-12 h-12 border-2 rounded flex items-center justify-center font-mono font-bold border-border bg-card"
            >
              {value}
            </div>
          ))}
        </div>
      </div>
      
      {/* Fenwick tree */}
      {fenwickTree.length > 0 && (
        <div>
          <div className="text-sm font-medium mb-2">Fenwick Tree:</div>
          <div className="flex justify-center gap-1 flex-wrap">
            {fenwickTree.slice(1).map((node) => (
              <div
                key={node.id}
                className={`w-12 h-12 border-2 rounded flex flex-col items-center justify-center text-xs transition-all duration-300
                  ${node.highlighted 
                    ? 'border-primary bg-primary/20 scale-110' 
                    : 'border-border bg-card'
                  }
                `}
              >
                <div className="font-mono font-bold">{node.value}</div>
                <div className="text-xs text-muted-foreground">[{node.id}]</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <Select value={dataStructure} onValueChange={(value: DataStructure) => setDataStructure(value)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="segment-tree">Segment Tree</SelectItem>
            <SelectItem value="fenwick-tree">Fenwick Tree (BIT)</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={executeOperation} disabled={isAnimating} className="flex items-center gap-1">
          <Play className="h-4 w-4" />
          Build & Query
        </Button>

        <Button 
          onClick={() => {
            setCurrentStep(0);
            setCurrentStepDescription('');
            setSegmentTree([]);
            setFenwickTree([]);
          }} 
          variant="outline"
          disabled={isAnimating}
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset
        </Button>
        <div className="flex items-center gap-2 ml-auto">
          <label className="text-sm">Voice Explain</label>
          <input type="checkbox" checked={voiceExplain} onChange={(e)=>setVoice(e.target.checked)} />
        </div>
      </div>

      {/* Visualization */}
      <div className="bg-gradient-visualization rounded-xl border-2 border-border/50 p-6">
        <h3 className="text-lg font-semibold mb-4 text-center">
          {dataStructure === 'segment-tree' ? 'Segment Tree' : 'Fenwick Tree (Binary Indexed Tree)'}
        </h3>
        
        {dataStructure === 'segment-tree' ? renderSegmentTree() : renderFenwickTree()}

        {currentStepDescription && (
          <div className="mt-4 p-3 bg-muted/20 rounded-lg text-center">
            <p className="text-sm font-medium">{currentStepDescription}</p>
          </div>
        )}
      </div>

      {/* Pseudocode */}
      <PseudocodeBox 
        title={`${dataStructure === 'segment-tree' ? 'Segment Tree' : 'Fenwick Tree'} - Pseudocode`}
        code={pseudocode[dataStructure]} 
        highlightedLine={currentStep}
      />

      {/* Complexity Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ComplexityBox
          title="Time Complexity"
          timeComplexity="O(log n)"
          spaceComplexity="O(n)"
          description={dataStructure === 'segment-tree' 
            ? "Build: O(n), Query/Update: O(log n)" 
            : "Build: O(n log n), Query/Update: O(log n)"
          }
        />
        
        <div className="bg-muted/20 rounded-lg p-4">
          <h4 className="font-semibold mb-2">Key Properties</h4>
          <ul className="text-sm space-y-1">
            {dataStructure === 'segment-tree' ? (
              <>
                <li>• <strong>Range Queries:</strong> Sum, min, max in O(log n)</li>
                <li>• <strong>Point Updates:</strong> Modify single element in O(log n)</li>
                <li>• <strong>Space:</strong> 4n space for tree array</li>
                <li>• <strong>Use Case:</strong> Range sum/min/max queries</li>
              </>
            ) : (
              <>
                <li>• <strong>Prefix Sums:</strong> Fast cumulative sum queries</li>
                <li>• <strong>LSB Operations:</strong> Uses bit manipulation</li>
                <li>• <strong>Space Efficient:</strong> Only n+1 space needed</li>
                <li>• <strong>Use Case:</strong> Frequency tables, prefix sums</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}