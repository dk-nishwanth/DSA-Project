import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Color = 'R'|'B';
interface Node { id: string; val: number; color: Color; left?: Node; right?: Node; parent?: Node; }

function isRed(n?: Node){ return n && n.color==='R'; }
function setBlack(n?: Node){ if(n) n.color='B'; }
function setRed(n?: Node){ if(n) n.color='R'; }

function grandparent(n?: Node){ return n?.parent?.parent; }
function uncle(n?: Node){ const g = grandparent(n); if(!g) return undefined; return g.left===n?.parent ? g.right : g.left; }

function rotateLeft(root: Node|undefined, x: Node): Node|undefined {
  const y = x.right!;
  x.right = y.left; if (y.left) y.left.parent = x;
  y.parent = x.parent;
  if (!x.parent) root = y;
  else if (x === x.parent.left) x.parent.left = y; else x.parent.right = y;
  y.left = x; x.parent = y;
  return root;
}
function rotateRight(root: Node|undefined, x: Node): Node|undefined {
  const y = x.left!;
  x.left = y.right; if (y.right) y.right.parent = x;
  y.parent = x.parent;
  if (!x.parent) root = y;
  else if (x === x.parent.right) x.parent.right = y; else x.parent.left = y;
  y.right = x; x.parent = y;
  return root;
}

function bstInsert(root: Node|undefined, z: Node): Node {
  let y: Node|undefined = undefined; let x = root;
  while (x) { y = x; x = z.val < x.val ? x.left : x.right; }
  z.parent = y;
  if (!y) return z; // tree was empty
  if (z.val < y.val) y.left = z; else y.right = z;
  return root!;
}

function insertFixup(root: Node|undefined, z: Node): Node|undefined {
  while (isRed(z.parent)) {
    const g = grandparent(z)!;
    if (z.parent === g.left) {
      const y = g.right; // uncle
      if (isRed(y)) { setBlack(z.parent); setBlack(y); setRed(g); z = g; }
      else {
        if (z === z.parent!.right) { z = z.parent!; root = rotateLeft(root, z)!; }
        setBlack(z.parent); setRed(g); root = rotateRight(root, g)!;
      }
    } else {
      const y = g.left; // uncle
      if (isRed(y)) { setBlack(z.parent); setBlack(y); setRed(g); z = g; }
      else {
        if (z === z.parent!.left) { z = z.parent!; root = rotateRight(root, z)!; }
        setBlack(z.parent); setRed(g); root = rotateLeft(root, g)!;
      }
    }
  }
  setBlack(root);
  return root;
}

function insertRBT(root: Node|undefined, val: number): Node|undefined {
  const z: Node = { id: Math.random().toString(36).slice(2), val, color: 'R' };
  root = bstInsert(root, z);
  return insertFixup(root, z);
}

function collect(n: Node|undefined, x=300, y=40, dx=120, nodes:any[]=[], edges:any[]=[]){
  if(!n) return {nodes, edges};
  nodes.push({x,y,val:n.val,color:n.color});
  if(n.left){ edges.push({x1:x,y1:y+20,x2:x-dx,y2:y+80-20}); collect(n.left,x-dx,y+80,dx/1.8,nodes,edges); }
  if(n.right){ edges.push({x1:x,y1:y+20,x2:x+dx,y2:y+80-20}); collect(n.right,x+dx,y+80,dx/1.8,nodes,edges); }
  return {nodes, edges};
}

export function RedBlackTreeVisualizer(){
  const [root, setRoot] = useState<Node|undefined>(undefined);
  const [val, setVal] = useState('10');

  const insert = ()=>{
    const v = parseInt(val)||0;
    const newRoot = insertRBT(root, v);
    setRoot(newRoot? {...newRoot} : undefined);
  };

  const {nodes, edges} = collect(root);

  return (
    <div className="w-full space-y-4">
      <div className="flex gap-2 items-center p-4 bg-muted/30 rounded-xl border">
        <Input className="w-28" type="number" value={val} onChange={e=>setVal(e.target.value)} />
        <Button onClick={insert}>Insert</Button>
        <Button variant="outline" onClick={()=>setRoot(undefined)}>Reset</Button>
      </div>
      <div className="p-4 bg-card rounded-xl border">
        <svg width="640" height="360" className="mx-auto">
          {edges.map((e,i)=>(<line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke="hsl(var(--border))" strokeWidth="2" />))}
          {nodes.map((n,i)=>(
            <g key={i}>
              <circle cx={n.x} cy={n.y} r={20} fill={n.color==='R'?"#ef444433":"#22c55e33"} stroke={n.color==='R'?"#ef4444":"#22c55e"} strokeWidth="2" />
              <text x={n.x} y={n.y+5} textAnchor="middle" fontSize="14" fontWeight="bold">{n.val}</text>
              <text x={n.x} y={n.y+34} textAnchor="middle" fontSize="10" className="fill-muted-foreground">{n.color==='R'?'RED':'BLACK'}</text>
            </g>
          ))}
        </svg>
      </div>
      <div className="bg-muted/20 rounded-lg p-3 text-sm text-muted-foreground">
        <div>• Red-Black tree keeps approximately balanced height using colors and rotations.</div>
        <div>• Properties: root black, no two consecutive reds, equal black height along paths.</div>
      </div>
    </div>
  );
}
