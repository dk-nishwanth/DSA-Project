import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Node { id: string; val: number; h: number; left?: Node; right?: Node; }

function height(n?: Node){ return n? n.h : 0; }
function update(n: Node){ n.h = 1 + Math.max(height(n.left), height(n.right)); }
function rotateRight(y: Node): Node {
  const x = y.left!; const T2 = x.right;
  x.right = y; y.left = T2;
  update(y); update(x);
  return x;
}
function rotateLeft(x: Node): Node {
  const y = x.right!; const T2 = y.left;
  y.left = x; x.right = T2;
  update(x); update(y);
  return y;
}
function getBalance(n?: Node){ return n? height(n.left) - height(n.right) : 0; }

function insert(node: Node | undefined, val: number): Node {
  if (!node) return { id: Math.random().toString(36).slice(2), val, h: 1 };
  if (val < node.val) node.left = insert(node.left, val);
  else if (val > node.val) node.right = insert(node.right, val);
  else return node;
  update(node);
  const bal = getBalance(node);
  if (bal > 1 && val < (node.left!.val)) return rotateRight(node);
  if (bal < -1 && val > (node.right!.val)) return rotateLeft(node);
  if (bal > 1 && val > (node.left!.val)) { node.left = rotateLeft(node.left!); return rotateRight(node); }
  if (bal < -1 && val < (node.right!.val)) { node.right = rotateRight(node.right!); return rotateLeft(node); }
  return node;
}

export function AVLTreeVisualizer(){
  const [root, setRoot] = useState<Node|undefined>(undefined);
  const [val, setVal] = useState('10');

  const add = useCallback(()=>{
    const v = parseInt(val)||0;
    const newRoot = insert(root, v);
    setRoot({...newRoot});
  }, [root, val]);

  const collect = (n?: Node, x=300, y=40, dx=120, acc: any[]=[]): any[] => {
    if (!n) return acc;
    acc.push({x,y,val:n.val,h:n.h});
    if (n.left) acc = collect(n.left, x-dx, y+80, dx/1.8, acc);
    if (n.right) acc = collect(n.right, x+dx, y+80, dx/1.8, acc);
    return acc;
  };

  const drawEdges = (n?: Node, x=300, y=40, dx=120, lines: any[]=[]): any[] => {
    if (!n) return lines;
    if (n.left) { lines.push({x1:x,y1:y+20,x2:x-dx,y2:y+80-20}); drawEdges(n.left, x-dx, y+80, dx/1.8, lines); }
    if (n.right){ lines.push({x1:x,y1:y+20,x2:x+dx,y2:y+80-20}); drawEdges(n.right, x+dx, y+80, dx/1.8, lines); }
    return lines;
  };

  const nodes = collect(root);
  const edges = drawEdges(root);

  return (
    <div className="w-full space-y-4">
      <div className="flex gap-2 items-center p-4 bg-muted/30 rounded-xl border">
        <Input className="w-28" type="number" value={val} onChange={e=>setVal(e.target.value)} />
        <Button onClick={add}>Insert</Button>
        <Button variant="outline" onClick={()=>setRoot(undefined)}>Reset</Button>
      </div>

      <div className="p-4 bg-card rounded-xl border">
        <svg width="600" height="340" className="mx-auto">
          {edges.map((e,i)=>(<line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke="hsl(var(--border))" strokeWidth="2" />))}
          {nodes.map((n,i)=>(
            <g key={i}>
              <circle cx={n.x} cy={n.y} r={20} fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2" />
              <text x={n.x} y={n.y+5} textAnchor="middle" fontSize="14" fontWeight="bold">{n.val}</text>
              <text x={n.x} y={n.y+34} textAnchor="middle" fontSize="10" className="fill-muted-foreground">h={n.h}</text>
            </g>
          ))}
        </svg>
      </div>

      <div className="bg-muted/20 rounded-lg p-3 text-sm text-muted-foreground">
        <div>• AVL maintains balance factor in [-1,0,1] using rotations (LL, LR, RL, RR).</div>
        <div>• Operations: O(log n) height-balanced BST.</div>
      </div>
    </div>
  );
}
