import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export function OpenAddressingVisualizer() {
  const [size, setSize] = useState(11);
  const [keys, setKeys] = useState<(string|null)[]>(Array(11).fill(null));
  const [values, setValues] = useState<(string|null)[]>(Array(11).fill(null));
  const [probe, setProbe] = useState<'linear'|'quadratic'>('linear');
  const [key, setKey] = useState('john');
  const [val, setVal] = useState('25');
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastProbes, setLastProbes] = useState<number[]>([]);

  const hash = (k: string) => {
    // Simple hash: sum of char codes mod size
    let h = 0;
    for (const ch of k) h = (h + ch.charCodeAt(0)) % size;
    return h;
  };

  const reinit = useCallback((n: number) => {
    setKeys(Array(n).fill(null));
    setValues(Array(n).fill(null));
    setLastProbes([]);
  }, []);

  const insert = useCallback(async () => {
    if (!key.trim()) return;
    setIsAnimating(true);
    const arrK = [...keys];
    const arrV = [...values];
    const start = hash(key);
    const probes: number[] = [];

    let idx = start;
    let i = 0;
    while (i < size && arrK[idx] !== null && arrK[idx] !== key) {
      probes.push(idx);
      setLastProbes([...probes]);
      await new Promise(r => setTimeout(r, 250));
      if (probe === 'linear') idx = (start + (++i)) % size;
      else idx = (start + i*i) % size, i++;
    }
    probes.push(idx);
    setLastProbes([...probes]);
    arrK[idx] = key;
    arrV[idx] = val;
    setKeys(arrK);
    setValues(arrV);
    toast.success(`Inserted ${key}:${val} at ${idx}`);
    setIsAnimating(false);
  }, [key, val, size, probe, keys, values]);

  const remove = useCallback(async () => {
    if (!key.trim()) return;
    setIsAnimating(true);
    const arrK = [...keys];
    const arrV = [...values];
    const start = hash(key);
    const probes: number[] = [];
    let idx = start;
    let i = 0;
    while (i < size && arrK[idx] !== null && arrK[idx] !== key) {
      probes.push(idx); setLastProbes([...probes]); await new Promise(r => setTimeout(r, 200));
      if (probe === 'linear') idx = (start + (++i)) % size; else idx = (start + i*i) % size, i++;
    }
    if (arrK[idx] === key) {
      arrK[idx] = '__DELETED__';
      arrV[idx] = null;
      setKeys(arrK); setValues(arrV);
      toast.success(`Deleted ${key} at ${idx}`);
    } else {
      toast.error('Key not found');
    }
    setIsAnimating(false);
  }, [key, size, probe, keys, values]);

  const clear = useCallback(() => {
    reinit(size);
  }, [size, reinit]);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <div className="flex items-center gap-2">
          <span className="text-sm">Size:</span>
          <Input type="number" value={size} onChange={e => { const n = Math.max(3, parseInt(e.target.value)||11); setSize(n); reinit(n); }} className="w-24" />
        </div>
        <Select value={probe} onValueChange={(v:'linear'|'quadratic') => setProbe(v)}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="linear">Linear Probing</SelectItem>
            <SelectItem value="quadratic">Quadratic Probing</SelectItem>
          </SelectContent>
        </Select>
        <Input placeholder="Key" value={key} onChange={e=>setKey(e.target.value)} className="w-40" />
        <Input placeholder="Value" value={val} onChange={e=>setVal(e.target.value)} className="w-40" />
        <Button onClick={insert} disabled={isAnimating}>Insert</Button>
        <Button onClick={remove} variant="destructive" disabled={isAnimating}>Delete</Button>
        <Button onClick={clear} variant="outline" disabled={isAnimating}>Clear</Button>
      </div>

      <div className="p-4 bg-gradient-visualization rounded-xl border-2">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {keys.map((k, i) => (
            <div key={i} className={`p-3 border rounded bg-card ${lastProbes.includes(i)?'ring-2 ring-primary':''}`}>
              <div className="text-xs text-muted-foreground">Index {i}</div>
              <div className="text-sm font-mono">{k===null?'-':k}</div>
              <div className="text-xs text-muted-foreground">{values[i]===null?'' : String(values[i])}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-muted/20 rounded-lg p-3">
        <div className="font-medium mb-2">Concept</div>
        <div className="text-sm text-muted-foreground space-y-1">
          <div>• On collision, probe for next available slot.</div>
          <div>• Probing strategies: linear (i), quadratic (i^2), or double hashing.</div>
          <div>• Keep load factor low to reduce clustering.</div>
        </div>
      </div>
    </div>
  );
}
