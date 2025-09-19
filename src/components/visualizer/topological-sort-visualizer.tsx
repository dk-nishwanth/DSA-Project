import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface Edge { from: string; to: string; }

const SAMPLE_DAGS: Record<string, { nodes: string[]; edges: Edge[] }> = {
  simple: {
    nodes: ['A','B','C','D','E','F'],
    edges: [
      { from: 'A', to: 'C' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'D' },
      { from: 'B', to: 'E' },
      { from: 'E', to: 'F' },
    ]
  },
  diamond: {
    nodes: ['S','A','B','T'],
    edges: [
      { from: 'S', to: 'A' },
      { from: 'S', to: 'B' },
      { from: 'A', to: 'T' },
      { from: 'B', to: 'T' },
    ]
  }
};

export function TopologicalSortVisualizer() {
  const [graphKey, setGraphKey] = useState<'simple'|'diamond'>('simple');
  const [order, setOrder] = useState<string[]>([]);
  const [inDegree, setInDegree] = useState<Record<string, number>>({});
  const [queueState, setQueueState] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const runKahn = useCallback( async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setOrder([]);

    const { nodes, edges } = SAMPLE_DAGS[graphKey];
    const indeg: Record<string, number> = Object.fromEntries(nodes.map(n => [n, 0]));
    for (const e of edges) indeg[e.to]++;
    setInDegree({ ...indeg });

    const q: string[] = [];
    for (const n of nodes) if (indeg[n] === 0) q.push(n);
    setQueueState([...q]);

    const result: string[] = [];
    while (q.length) {
      const u = q.shift()!;
      setQueueState([...q]);
      result.push(u);
      setOrder([...result]);
      await sleep(600);
      for (const e of edges.filter(e => e.from === u)) {
        indeg[e.to]--;
        setInDegree({ ...indeg });
        await sleep(300);
        if (indeg[e.to] === 0) {
          q.push(e.to);
          setQueueState([...q]);
          await sleep(200);
        }
      }
    }

    if (result.length !== nodes.length) {
      toast.error('Graph has a cycle (not a DAG)');
    } else {
      toast.success(`Topological order: ${result.join(' → ')}`);
    }
    setIsAnimating(false);
  }, [graphKey, isAnimating]);

  const reset = useCallback(() => {
    setOrder([]); setInDegree({}); setQueueState([]); setIsAnimating(false);
  }, []);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <Select value={graphKey} onValueChange={(v: 'simple'|'diamond') => setGraphKey(v)}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="simple">Simple DAG</SelectItem>
            <SelectItem value="diamond">Diamond DAG</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={runKahn} disabled={isAnimating}>Run Kahn's</Button>
        <Button onClick={reset} variant="outline" disabled={isAnimating}>Reset</Button>
      </div>

      <div className="p-4 bg-gradient-visualization rounded-xl border-2">
        <div className="text-sm font-medium mb-2">In-Degrees</div>
        <div className="flex gap-2 flex-wrap">
          {Object.keys(inDegree).map(n => (
            <div key={n} className="px-2 py-1 border rounded bg-card text-sm font-mono">
              {n}: {inDegree[n]}
            </div>
          ))}
        </div>

        <div className="mt-4 text-sm font-medium">Queue</div>
        <div className="flex gap-2">
          {queueState.map((n, i) => (
            <div key={i} className="px-2 py-1 rounded bg-info/20 border text-sm font-mono">{n}</div>
          ))}
        </div>

        <div className="mt-4 text-sm font-medium">Order</div>
        <div className="flex gap-2 flex-wrap">
          {order.map((n, i) => (
            <div key={i} className="px-2 py-1 rounded bg-success/20 border text-sm font-mono">{i+1}. {n}</div>
          ))}
        </div>
      </div>

      <div className="bg-muted/20 rounded-lg p-3">
        <div className="font-medium mb-2">Algorithm Info</div>
        <div className="text-sm text-muted-foreground space-y-1">
          <div>• Kahn's algorithm repeatedly removes nodes with in-degree 0.</div>
          <div>• Each removal simulates placing the node next in the topological order.</div>
          <div>• Time: O(V + E), Space: O(V)</div>
        </div>
      </div>
    </div>
  );
}
