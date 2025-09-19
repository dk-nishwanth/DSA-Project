import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Node { ch?: string; freq: number; left?: Node; right?: Node; id: string; }

function buildNodesFromText(text: string): Node[] {
  const freq: Record<string, number> = {};
  for (const ch of text) freq[ch] = (freq[ch]||0)+1;
  return Object.keys(freq).map(ch=>({ ch, freq: freq[ch], id: Math.random().toString(36).slice(2) }));
}

function generateCodes(root?: Node, prefix = '', map: Record<string,string> = {}): Record<string,string> {
  if (!root) return map;
  if (root.ch !== undefined) { map[root.ch] = prefix || '0'; return map; }
  generateCodes(root.left, prefix+'0', map);
  generateCodes(root.right, prefix+'1', map);
  return map;
}

export function HuffmanVisualizer() {
  const [text, setText] = useState('huffman coding');
  const [forest, setForest] = useState<Node[]>([]);
  const [root, setRoot] = useState<Node | undefined>(undefined);
  const [codes, setCodes] = useState<Record<string,string>>({});
  const [isRunning, setIsRunning] = useState(false);

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const run = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    let nodes = buildNodesFromText(text);
    setForest([...nodes]);
    await sleep(200);

    // Build Huffman tree
    while (nodes.length > 1) {
      nodes.sort((a,b)=>a.freq-b.freq);
      const a = nodes.shift()!;
      const b = nodes.shift()!;
      const merged: Node = { freq: a.freq + b.freq, left: a, right: b, id: Math.random().toString(36).slice(2) };
      nodes.push(merged);
      setForest([...nodes]);
      await sleep(400);
    }
    const rt = nodes[0];
    setRoot(rt);
    const codeMap = generateCodes(rt);
    setCodes(codeMap);
    setIsRunning(false);
  }, [text, isRunning]);

  const reset = useCallback(()=>{ setForest([]); setRoot(undefined); setCodes({}); setIsRunning(false); },[]);

  const collect = (n?: Node, x=320, y=40, dx=120, nodes:any[]=[], edges:any[]=[]): any => {
    if (!n) return {nodes, edges};
    nodes.push({x,y,label: n.ch!==undefined?`${n.ch}:${n.freq}`:`${n.freq}`});
    if (n.left) { edges.push({x1:x,y1:y+20,x2:x-dx,y2:y+80-20, label:'0'}); collect(n.left, x-dx, y+80, dx/1.8, nodes, edges); }
    if (n.right){ edges.push({x1:x,y1:y+20,x2:x+dx,y2:y+80-20, label:'1'}); collect(n.right, x+dx, y+80, dx/1.8, nodes, edges); }
    return {nodes, edges};
  };

  const tree = collect(root);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <div className="flex items-center gap-2"><span className="text-sm">Text</span><Input className="w-80" value={text} onChange={e=>setText(e.target.value)} /></div>
        <Button onClick={run} disabled={isRunning}>Run</Button>
        <Button onClick={reset} variant="outline" disabled={isRunning}>Reset</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gradient-visualization rounded-xl border-2">
          <div className="text-sm mb-2">Priority Queue (Forest)</div>
          <div className="flex gap-2 flex-wrap">
            {forest.slice().sort((a,b)=>a.freq-b.freq).map((n,i)=>(
              <div key={i} className="px-2 py-1 border rounded bg-card text-sm font-mono">{n.ch!==undefined?`${n.ch}:${n.freq}`:`${n.freq}`}</div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-card rounded-xl border">
          <div className="text-sm mb-2">Huffman Tree</div>
          <svg width="640" height="360" className="mx-auto">
            {tree.edges?.map((e:any,i:number)=>(
              <g key={i}>
                <line x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke="hsl(var(--border))" strokeWidth="2" />
                <text x={(e.x1+e.x2)/2} y={(e.y1+e.y2)/2} fontSize="10" className="fill-muted-foreground">{e.label}</text>
              </g>
            ))}
            {tree.nodes?.map((n:any,i:number)=>(
              <g key={i}>
                <circle cx={n.x} cy={n.y} r={20} fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2" />
                <text x={n.x} y={n.y+5} textAnchor="middle" fontSize="12" fontWeight="bold">{n.label}</text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {Object.keys(codes).length>0 && (
        <div className="p-4 bg-muted/20 rounded border">
          <div className="text-sm font-medium mb-2">Codes</div>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(codes).map(([ch,code])=> (
              <div key={ch} className="px-2 py-1 border rounded bg-card text-sm font-mono">{JSON.stringify(ch)} → {code}</div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-muted/20 rounded-lg p-3 text-sm text-muted-foreground">
        <div>• Huffman builds an optimal prefix code using a greedy merging of lowest-frequency nodes.</div>
        <div>• Time: O(n log n) with a priority queue.</div>
      </div>
    </div>
  );
}
