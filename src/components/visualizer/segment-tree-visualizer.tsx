import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function buildTree(arr: number[]): number[] {
  const n = arr.length;
  const size = 1 << (Math.ceil(Math.log2(n)) + 1);
  const tree = Array(size).fill(0);
  const build = (idx: number, l: number, r: number) => {
    if (l === r) { tree[idx] = arr[l]; return; }
    const m = (l + r) >> 1;
    build(idx*2, l, m);
    build(idx*2+1, m+1, r);
    tree[idx] = tree[idx*2] + tree[idx*2+1];
  };
  build(1, 0, n-1);
  return tree;
}

export function SegmentTreeVisualizer() {
  const [input, setInput] = useState('1,3,5,7,9,11');
  const [arr, setArr] = useState<number[]>([1,3,5,7,9,11]);
  const [tree, setTree] = useState<number[]>(buildTree([1,3,5,7,9,11]));
  const [op, setOp] = useState<'query'|'update'>('query');
  const [l, setL] = useState('1');
  const [r, setR] = useState('3');
  const [pos, setPos] = useState('2');
  const [val, setVal] = useState('10');
  const [highlight, setHighlight] = useState<number[]>([]);
  const [isBusy, setIsBusy] = useState(false);

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const rebuild = useCallback(() => {
    const nums = input.split(',').map(s=>parseInt(s.trim())).filter(n=>!isNaN(n));
    if (!nums.length) return;
    setArr(nums);
    setTree(buildTree(nums));
  }, [input]);

  const doQuery = useCallback(async (ql: number, qr: number) => {
    setIsBusy(true); setHighlight([]);
    const n = arr.length;
    const t = [...tree];
    const visit: number[] = [];
    const query = async (idx: number, l: number, r: number): Promise<number> => {
      visit.push(idx); setHighlight([...visit]); await sleep(150);
      if (qr < l || r < ql) return 0;
      if (ql <= l && r <= qr) return t[idx];
      const m = (l + r) >> 1;
      return (await query(idx*2, l, m)) + (await query(idx*2+1, m+1, r));
    };
    const sum = await query(1, 0, n-1);
    setIsBusy(false);
    return sum;
  }, [arr.length, tree]);

  const doUpdate = useCallback(async (p: number, newVal: number) => {
    setIsBusy(true); setHighlight([]);
    const n = arr.length;
    const t = [...tree];
    const a = [...arr];
    const visit: number[] = [];
    const update = async (idx: number, l: number, r: number) => {
      visit.push(idx); setHighlight([...visit]); await sleep(150);
      if (l === r) { t[idx] = newVal; return; }
      const m = (l + r) >> 1;
      if (p <= m) await update(idx*2, l, m); else await update(idx*2+1, m+1, r);
      t[idx] = t[idx*2] + t[idx*2+1];
    };
    await update(1, 0, n-1);
    a[p] = newVal;
    setArr(a); setTree(t); setIsBusy(false);
  }, [arr, tree]);

  const run = useCallback(async () => {
    if (op === 'query') {
      const ql = Math.max(0, Math.min(arr.length-1, parseInt(l)||0));
      const qr = Math.max(ql, Math.min(arr.length-1, parseInt(r)||0));
      const res = await doQuery(ql, qr);
      alert(`Range Sum [${ql}, ${qr}] = ${res}`);
    } else {
      const p = Math.max(0, Math.min(arr.length-1, parseInt(pos)||0));
      const nv = parseInt(val)||0;
      await doUpdate(p, nv);
    }
  }, [op, l, r, pos, val, arr.length, doQuery, doUpdate]);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <Input className="w-72" value={input} onChange={e=>setInput(e.target.value)} />
        <Button onClick={rebuild} disabled={isBusy}>Build</Button>
        <Select value={op} onValueChange={(v: 'query'|'update')=>setOp(v)}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="query">Range Sum Query</SelectItem>
            <SelectItem value="update">Point Update</SelectItem>
          </SelectContent>
        </Select>
        {op==='query' ? (
          <div className="flex items-center gap-2">
            <span className="text-sm">L</span>
            <Input className="w-16" value={l} onChange={e=>setL(e.target.value)} />
            <span className="text-sm">R</span>
            <Input className="w-16" value={r} onChange={e=>setR(e.target.value)} />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm">Pos</span>
            <Input className="w-16" value={pos} onChange={e=>setPos(e.target.value)} />
            <span className="text-sm">Val</span>
            <Input className="w-20" value={val} onChange={e=>setVal(e.target.value)} />
          </div>
        )}
        <Button onClick={run} disabled={isBusy}>Run</Button>
      </div>

      <div className="p-6 bg-gradient-visualization rounded-xl border-2 space-y-4">
        <div className="text-sm mb-1">Array</div>
        <div className="flex gap-2">
          {arr.map((x,i)=>(<div key={i} className="px-2 py-1 border rounded bg-card font-mono text-sm">{x}</div>))}
        </div>

        <div className="text-sm mt-4 mb-1">Segment Tree (array form)</div>
        <div className="flex gap-2 flex-wrap">
          {tree.map((x,i)=>(
            <div key={i} className={`px-2 py-1 border rounded font-mono text-xs ${highlight.includes(i)?'bg-primary/20 border-primary':'bg-card'}`}>{i}:{x}</div>
          ))}
        </div>
      </div>

      <div className="bg-muted/20 rounded-lg p-3 text-sm text-muted-foreground">
        <div>• Supports range sum queries and point updates in O(log n).</div>
        <div>• Time: Build O(n), Query/Update O(log n). Space: O(n).</div>
      </div>
    </div>
  );
}
