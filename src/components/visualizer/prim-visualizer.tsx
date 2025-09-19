import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface Edge { u: string; v: string; w: number; inMST?: boolean; considered?: boolean; }

const SAMPLE: Record<string, { nodes: string[]; edges: Edge[] }> = {
  small: {
    nodes: ['A','B','C','D','E'],
    edges: [
      { u:'A', v:'B', w:1 }, { u:'A', v:'C', w:5 }, { u:'B', v:'C', w:2 },
      { u:'B', v:'D', w:4 }, { u:'C', v:'D', w:3 }, { u:'C', v:'E', w:6 },
      { u:'D', v:'E', w:7 }
    ]
  }
};

export function PrimVisualizer() {
  const [graphKey, setGraphKey] = useState<'small'>('small');
  const [edges, setEdges] = useState<Edge[]>([...SAMPLE.small.edges]);
  const [inMST, setInMST] = useState<Set<string>>(new Set());
  const [mstEdges, setMstEdges] = useState<Edge[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const run = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    const { nodes } = SAMPLE[graphKey];
    const picked = new Set<string>();
    const mst: Edge[] = [];

    // Start at first node
    picked.add(nodes[0]);
    setInMST(new Set(picked));
    await sleep(400);

    while (picked.size < nodes.length) {
      // Find minimum edge crossing the cut (picked -> not picked)
      let best: Edge | null = null;
      for (const e of edges) {
        const aIn = picked.has(e.u), bIn = picked.has(e.v);
        if (aIn !== bIn) {
          e.considered = true; setEdges([...edges]); await sleep(200);
          if (!best || e.w < best.w) best = e;
          e.considered = false; setEdges([...edges]);
        }
      }
      if (!best) break; // disconnected
      best.inMST = true;
      mst.push(best);
      setEdges([...edges]);
      picked.add(picked.has(best.u) ? best.v : best.u);
      setInMST(new Set(picked));
      await sleep(400);
    }
    setMstEdges(mst);
    toast.success(`MST weight = ${mst.reduce((s,e)=>s+e.w,0)}`);
    setIsRunning(false);
  }, [graphKey, edges, isRunning]);

  const reset = useCallback(() => {
    setEdges([...SAMPLE[graphKey].edges]); setMstEdges([]); setInMST(new Set()); setIsRunning(false);
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
        <Button onClick={run} disabled={isRunning}>Run Prim</Button>
        <Button onClick={reset} variant="outline" disabled={isRunning}>Reset</Button>
      </div>

      <div className="p-4 bg-gradient-visualization rounded-xl border-2">
        <div className="text-sm font-medium mb-2">Edges</div>
        <div className="flex gap-2 flex-wrap">
          {edges.map((e, i) => (
            <div key={i} className={`px-2 py-1 border rounded text-sm font-mono ${e.inMST?'bg-success/20 border-success': e.considered?'bg-warning/20 border-warning':'bg-card'}`}>
              ({e.u}-{e.v}) : {e.w}
            </div>
          ))}
        </div>
        {mstEdges.length>0 && (
          <div className="mt-3 text-sm">MST edges: <span className="font-mono">[{mstEdges.map(e=>`${e.u}-${e.v}`).join(', ')}]</span></div>
        )}
      </div>

      <div className="bg-muted/20 rounded-lg p-3 text-sm text-muted-foreground">
        <div>• Prim grows the MST by repeatedly adding the minimum edge crossing the current cut.</div>
        <div>• Time: O(E log V) with priority queue (simple O(V^2) demo here), Space: O(V)</div>
      </div>
    </div>
  );
}
