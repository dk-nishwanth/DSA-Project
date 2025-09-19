import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface Edge { u: string; v: string; w: number; inMST?: boolean; considered?: boolean; }

function createUF(nodes: string[]) {
  const parent = new Map<string, string>();
  const rank = new Map<string, number>();
  nodes.forEach(n => { parent.set(n, n); rank.set(n, 0); });
  const find = (x: string): string => {
    if (parent.get(x) !== x) parent.set(x, find(parent.get(x)!));
    return parent.get(x)!;
  };
  const unite = (a: string, b: string): boolean => {
    a = find(a); b = find(b);
    if (a === b) return false;
    const ra = rank.get(a)!; const rb = rank.get(b)!;
    if (ra < rb) parent.set(a, b);
    else if (ra > rb) parent.set(b, a);
    else { parent.set(b, a); rank.set(a, ra + 1); }
    return true;
  };
  return { find, unite };
}

const SAMPLE: Record<string, { nodes: string[]; edges: Edge[] }> = {
  small: {
    nodes: ['A','B','C','D','E'],
    edges: [
      { u:'A', v:'B', w:1 }, { u:'A', v:'C', w:5 }, { u:'B', v:'C', w:2 },
      { u:'B', v:'D', w:4 }, { u:'C', v:'D', w:3 }, { u:'C', v:'E', w:6 },
    ]
  }
};

export function KruskalVisualizer() {
  const [graphKey, setGraphKey] = useState<'small'>('small');
  const [edges, setEdges] = useState<Edge[]>([...SAMPLE.small.edges]);
  const [order, setOrder] = useState<Edge[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const run = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    const { nodes } = SAMPLE[graphKey];
    const uf = createUF(nodes);
    const es = [...edges].sort((a,b) => a.w - b.w).map(e => ({...e, inMST:false, considered:false}));
    setEdges(es);
    const mst: Edge[] = [];
    for (const e of es) {
      e.considered = true; setEdges([...es]); await sleep(400);
      if (uf.unite(e.u, e.v)) {
        e.inMST = true; mst.push(e); setEdges([...es]); await sleep(400);
        if (mst.length === nodes.length - 1) break;
      }
      e.considered = false; setEdges([...es]);
    }
    setOrder(mst);
    toast.success(`MST weight = ${mst.reduce((s,e)=>s+e.w,0)}`);
    setIsRunning(false);
  }, [graphKey, edges, isRunning]);

  const reset = useCallback(() => {
    setEdges([...SAMPLE[graphKey].edges]); setOrder([]); setIsRunning(false);
  }, [graphKey]);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <Select value={graphKey} onValueChange={(v:'small')=>setGraphKey(v)}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small Graph</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={run} disabled={isRunning}>Run Kruskal</Button>
        <Button onClick={reset} variant="outline" disabled={isRunning}>Reset</Button>
      </div>

      <div className="p-4 bg-gradient-visualization rounded-xl border-2">
        <div className="text-sm font-medium mb-2">Edges (sorted by weight)</div>
        <div className="flex gap-2 flex-wrap">
          {edges.sort((a,b)=>a.w-b.w).map((e, i) => (
            <div key={i} className={`px-2 py-1 border rounded text-sm font-mono ${e.inMST?'bg-success/20 border-success': e.considered?'bg-warning/20 border-warning':'bg-card'}`}>
              ({e.u}-{e.v}) : {e.w}
            </div>
          ))}
        </div>

        {order.length>0 && (
          <div className="mt-3 text-sm">MST edges: <span className="font-mono">[{order.map(e=>`${e.u}-${e.v}`).join(', ')}]</span></div>
        )}
      </div>

      <div className="bg-muted/20 rounded-lg p-3 text-sm text-muted-foreground">
        <div>• Kruskal sorts edges by weight and adds the next lightest edge that doesn't form a cycle (Union-Find).</div>
        <div>• Time: O(E log E), Space: O(V)</div>
      </div>
    </div>
  );
}
