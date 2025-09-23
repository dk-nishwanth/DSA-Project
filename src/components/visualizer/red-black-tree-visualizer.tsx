import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';
import { toast } from 'sonner';

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
  const [showMemory, setShowMemory] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const {
    voiceEnabled,
    setVoiceEnabled,
    speed,
    setSpeed,
    isSpeaking,
    pauseSpeech,
    resumeSpeech,
    stopSpeech,
    speakStep,
    speakOperation,
    speakResult
  } = useVisualizerVoice({ minInterval: 2500 });

  const insert = async ()=>{
    const v = parseInt(val)||0;
    if (isNaN(v)) {
      toast.error('Please enter a valid number');
      return;
    }
    
    setIsAnimating(true);
    speakOperation("Red-Black Tree Insert", `Inserting ${v} into red-black tree. Red-black trees maintain balance using color properties and rotations.`);
    setCurrentStep(`Inserting ${v} into red-black tree...`);
    
    const newRoot = insertRBT(root, v);
    setRoot(newRoot? {...newRoot} : undefined);
    
    const resultText = `Successfully inserted ${v}. Tree maintains red-black properties with automatic color changes and rotations.`;
    setCurrentStep(resultText);
    speakResult(resultText);
    toast.success(`Inserted ${v} into red-black tree`);
    
    setTimeout(() => {
      setIsAnimating(false);
      setCurrentStep('');
    }, 2000);
  };

  const {nodes, edges} = collect(root);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Red-Black Tree Visualizer</h2>
        <p className="text-muted-foreground">
          Self-balancing binary search tree using color properties
        </p>
      </div>

      {/* Controls */}
      <div className="flex gap-2 items-center p-4 bg-muted/30 rounded-xl border">
        <Input 
          className="w-28" 
          type="number" 
          value={val} 
          onChange={e=>setVal(e.target.value)} 
          placeholder="Value"
          disabled={isAnimating}
        />
        <Button onClick={insert} disabled={isAnimating}>
          {isAnimating ? 'Inserting...' : 'Insert'}
        </Button>
        <Button variant="outline" onClick={()=>setRoot(undefined)} disabled={isAnimating}>
          Reset
        </Button>
      </div>

      {/* Current Step Display */}
      {currentStep && (
        <div className="text-center p-4 bg-muted rounded-lg">
          <Badge className="mb-2" variant={isAnimating ? 'default' : 'secondary'}>
            Red-Black Operation
          </Badge>
          <p className="text-sm">{currentStep}</p>
        </div>
      )}

      {/* Tree Visualization */}
      <div className="p-6 bg-gradient-visualization rounded-xl border-2 border-primary/20">
        <h3 className="text-lg font-semibold mb-4 text-center">Red-Black Tree Structure</h3>
        <svg width="640" height="360" className="mx-auto">
          {edges.map((e,i)=>(<line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke="hsl(var(--border))" strokeWidth="2" />))}
          {nodes.map((n,i)=>(
            <g key={i}>
              <circle cx={n.x} cy={n.y} r={20} fill={n.color==='R'?"#ef444433":"#22c55e33"} stroke={n.color==='R'?"#ef4444":"#22c55e"} strokeWidth="3" />
              <text x={n.x} y={n.y+5} textAnchor="middle" fontSize="14" fontWeight="bold" fill="hsl(var(--foreground))">{n.val}</text>
              <text x={n.x} y={n.y+34} textAnchor="middle" fontSize="10" className="fill-muted-foreground">{n.color==='R'?'RED':'BLACK'}</text>
            </g>
          ))}
        </svg>
        {!root && (
          <div className="text-center py-12 text-muted-foreground">
            <div className="text-lg mb-2">Red-Black Tree is empty</div>
            <div className="text-sm">Insert values to see the color-balanced tree structure</div>
          </div>
        )}
      </div>

      {/* Algorithm Information */}
      <div className="bg-muted/20 rounded-lg p-4">
        <h4 className="font-semibold mb-2">Red-Black Tree Properties</h4>
        <div className="text-sm text-muted-foreground space-y-1">
          <div>• <strong>Root Property:</strong> Root is always black</div>
          <div>• <strong>Red Property:</strong> Red nodes cannot have red children (no two red nodes adjacent)</div>
          <div>• <strong>Black Property:</strong> All paths from root to leaves have same number of black nodes</div>
          <div>• <strong>Leaf Property:</strong> All leaves (NIL nodes) are black</div>
          <div>• <strong>Time Complexity:</strong> O(log n) for insert, delete, and search operations</div>
          <div>• <strong>Applications:</strong> Java TreeMap, C++ map, Linux kernel scheduler</div>
        </div>
      </div>

      {/* Memory Layout */}
      {showMemory && (
        <MemoryLayout
          title="Red-Black Tree Memory Layout"
          data={nodes.map(n => `Node(${n.val}, ${n.color === 'R' ? 'RED' : 'BLACK'})`)}
          baseAddress={0x7000}
        />
      )}

      {/* Visualizer Controls */}
      <div className="flex justify-center">
        <VisualizerControls
          showMemory={showMemory}
          onToggleMemory={setShowMemory}
          voiceEnabled={voiceEnabled}
          onToggleVoice={setVoiceEnabled}
          voiceSpeed={speed}
          onVoiceSpeedChange={setSpeed}
          isSpeaking={isSpeaking}
          onPauseSpeech={pauseSpeech}
          onResumeSpeech={resumeSpeech}
          onStopSpeech={stopSpeech}
        />
      </div>
    </div>
  );
}
