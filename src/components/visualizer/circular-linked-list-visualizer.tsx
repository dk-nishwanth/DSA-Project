import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PseudocodeBox } from '@/components/pseudocode-box';
import { ComplexityBox } from '@/components/complexity-box';

interface Node { id: string; value: number; next?: Node; }

export function CircularLinkedListVisualizer() {
  const [head, setHead] = useState<Node | null>(null);
  const [values, setValues] = useState<number[]>([]);
  const [val, setVal] = useState('10');
  const [stepDesc, setStepDesc] = useState('');
  const [voiceExplain, setVoiceExplain] = useState<boolean>(() => {
    try { return localStorage.getItem('dsa_voice_explain') === '1'; } catch { return false; }
  });
  useEffect(() => {
    if (!voiceExplain || !stepDesc) return;
    try {
      const u = new SpeechSynthesisUtterance(stepDesc);
      u.rate = 1.05; u.pitch = 1.0; u.volume = 0.85;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch {}
  }, [voiceExplain, stepDesc]);
  const setVoice = (on: boolean) => {
    setVoiceExplain(on);
    try { localStorage.setItem('dsa_voice_explain', on ? '1' : '0'); } catch {}
  };

  const insertEnd = () => {
    const v = parseInt(val) || 0;
    const n: Node = { id: Math.random().toString(36).slice(2), value: v };
    if (!head) {
      n.next = n; setHead(n); setValues([v]); setStepDesc(`List empty: insert ${v} as head; next points to itself.`); return;
    }
    // find tail (node whose next is head)
    let cur = head;
    while (cur.next && cur.next !== head) cur = cur.next;
    cur.next = n; n.next = head; setValues(prev => [...prev, v]);
    setStepDesc(`Inserted ${v} at end. Tail now points to new node; new node points to head.`);
  };

  const deleteHead = () => {
    if (!head) return;
    if (head.next === head) { setHead(null); setValues([]); setStepDesc('Single node removed; list is now empty.'); return; }
    // find tail
    let tail = head; while (tail.next !== head) tail = tail.next!;
    const newHead = head.next!; tail.next = newHead; setHead(newHead);
    setValues(prev => prev.slice(1));
    setStepDesc(`Deleted head; updated tail.next to new head.`);
  };

  const insertHead = () => {
    const v = parseInt(val) || 0;
    const n: Node = { id: Math.random().toString(36).slice(2), value: v };
    if (!head) { n.next = n; setHead(n); setValues([v]); setStepDesc(`List empty: insert ${v} as head.`); return; }
    let tail = head; while (tail.next !== head) tail = tail.next!;
    n.next = head; tail.next = n; setHead(n); setValues(prev => [v, ...prev]);
    setStepDesc(`Inserted ${v} at head; tail.next updated to new head.`);
  };

  const deleteValue = () => {
    const v = parseInt(val); if (!head || isNaN(v)) return;
    let cur: Node | null = head; let prev: Node | null = null;
    do {
      if (cur!.value === v) {
        if (cur === head) { deleteHead(); return; }
        prev!.next = cur!.next; setValues(prevVals => prevVals.filter(x => x !== v || prevVals.indexOf(x) !== prevVals.indexOf(v)));
        setStepDesc(`Deleted first occurrence of ${v}.`);
        return;
      }
      prev = cur; cur = cur!.next!;
    } while (cur && cur !== head);
    setStepDesc(`Value ${v} not found.`);
  };

  const iterateOnce = () => {
    if (!head) return [] as number[];
    const out: number[] = [];
    let cur: Node | undefined = head;
    do { out.push(cur.value); cur = cur.next; } while (cur && cur !== head);
    return out;
  };

  const nodesForView = useMemo(()=> iterateOnce(), [head, values]);

  return (
    <div className="w-full space-y-4">
      <div className="flex gap-2 items-center p-4 bg-muted/30 rounded-xl border flex-wrap">
        <Input className="w-28" value={val} onChange={e=>setVal(e.target.value)} type="number" />
        <Button onClick={insertHead}>Insert (Head)</Button>
        <Button onClick={insertEnd}>Insert (End)</Button>
        <Button onClick={deleteHead} variant="outline">Delete Head</Button>
        <Button onClick={deleteValue} variant="outline">Delete Value</Button>
        <div className="flex items-center gap-2 ml-auto">
          <label className="text-sm">Voice Explain</label>
          <input type="checkbox" checked={voiceExplain} onChange={(e)=>setVoice(e.target.checked)} />
        </div>
      </div>

      <div className="p-6 bg-gradient-visualization rounded-xl border-2">
        <div className="text-sm mb-2">Circular Linked List (one full traversal starting at head)</div>
        <div className="flex gap-3 items-center flex-wrap">
          {nodesForView.map((v, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`px-3 py-2 rounded-full border font-mono ${i===0?'bg-primary/20 border-primary':''}`} title={i===0?'Head node':''}>
                {v}{i===0 && ' (H)'}
              </div>
              {i < nodesForView.length-1 ? <span className="text-muted-foreground">→</span> : <span className="text-muted-foreground">↺</span>}
            </div>
          ))}
          {!head && (
            <div className="text-xs text-muted-foreground">List is empty</div>
          )}
        </div>
        {stepDesc && (
          <div className="mt-3 p-2 bg-muted/20 rounded text-sm">{stepDesc}</div>
        )}
      </div>

      <PseudocodeBox
        title="Circular Linked List - Common Operations"
        code={[
          'InsertHead(v):',
          '  if head==null: head=new(v); head.next=head',
          '  else: find tail; new.next=head; tail.next=new; head=new',
          'InsertEnd(v):',
          '  if head==null: head=new(v); head.next=head',
          '  else: find tail; tail.next=new; new.next=head',
          'DeleteHead():',
          '  if head==null: return',
          '  if head.next==head: head=null',
          '  else: find tail; head=head.next; tail.next=head'
        ]}
        highlightedLine={0}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ComplexityBox
          title="Time Complexity"
          timeComplexity="O(n)"
          spaceComplexity="O(1)"
          description="Insert/Delete at head are O(1) if tail tracked; otherwise finding tail makes operations O(n). Traversal is O(n)."
        />
        <div className="bg-muted/20 rounded-lg p-3 text-sm text-muted-foreground">
          <div className="font-semibold mb-1">Key Properties</div>
          <ul className="space-y-1">
            <li>• Last node points back to head forming a cycle.</li>
            <li>• A single-node list points to itself.</li>
            <li>• Useful for round-robin scheduling or continuous buffers.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
