import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';
import { toast } from 'sonner';

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

  const add = useCallback(async ()=>{
    const v = parseInt(val)||0;
    if (isNaN(v)) {
      toast.error('Please enter a valid number');
      return;
    }
    
    setIsAnimating(true);
    speakOperation("AVL Tree Insert", `Inserting ${v} into AVL tree. AVL trees maintain balance by ensuring height difference between subtrees is at most 1.`);
    setCurrentStep(`Inserting ${v} into AVL tree...`);
    
    const newRoot = insert(root, v);
    setRoot({...newRoot});
    
    const resultText = `Successfully inserted ${v}. Tree remains balanced with automatic rotations if needed.`;
    setCurrentStep(resultText);
    speakResult(resultText);
    toast.success(`Inserted ${v} into AVL tree`);
    
    setTimeout(() => {
      setIsAnimating(false);
      setCurrentStep('');
    }, 2000);
  }, [root, val, speakOperation, speakResult, isAnimating]);

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
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">AVL Tree Visualizer</h2>
        <p className="text-muted-foreground">
          Self-balancing binary search tree with automatic rotations
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
        <Button onClick={add} disabled={isAnimating}>
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
            AVL Operation
          </Badge>
          <p className="text-sm">{currentStep}</p>
        </div>
      )}

      {/* Tree Visualization */}
      <div className="p-6 bg-gradient-visualization rounded-xl border-2 border-primary/20">
        <h3 className="text-lg font-semibold mb-4 text-center">AVL Tree Structure</h3>
        <svg width="600" height="340" className="mx-auto">
          {edges.map((e,i)=>(<line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke="hsl(var(--border))" strokeWidth="2" />))}
          {nodes.map((n,i)=>(
            <g key={i}>
              <circle cx={n.x} cy={n.y} r={20} fill="hsl(var(--primary))" fillOpacity="0.1" stroke="hsl(var(--primary))" strokeWidth="2" />
              <text x={n.x} y={n.y+5} textAnchor="middle" fontSize="14" fontWeight="bold" fill="hsl(var(--foreground))">{n.val}</text>
              <text x={n.x} y={n.y+34} textAnchor="middle" fontSize="10" className="fill-muted-foreground">h={n.h}</text>
            </g>
          ))}
        </svg>
        {!root && (
          <div className="text-center py-12 text-muted-foreground">
            <div className="text-lg mb-2">AVL Tree is empty</div>
            <div className="text-sm">Insert values to see the self-balancing tree structure</div>
          </div>
        )}
      </div>

      {/* Algorithm Information */}
      <div className="bg-muted/20 rounded-lg p-4">
        <h4 className="font-semibold mb-2">AVL Tree Properties</h4>
        <div className="text-sm text-muted-foreground space-y-1">
          <div>• <strong>Balance Factor:</strong> Height difference between left and right subtrees must be in [-1, 0, 1]</div>
          <div>• <strong>Rotations:</strong> LL (Right), RR (Left), LR (Left-Right), RL (Right-Left) rotations maintain balance</div>
          <div>• <strong>Time Complexity:</strong> O(log n) for insert, delete, and search operations</div>
          <div>• <strong>Space Complexity:</strong> O(n) for storing n nodes</div>
          <div>• <strong>Applications:</strong> Database indexing, memory management, priority queues</div>
        </div>
      </div>

      {/* Memory Layout */}
      {showMemory && (
        <MemoryLayout
          title="AVL Tree Memory Layout"
          data={nodes.map(n => `Node(${n.val}, h=${n.h})`)}
          baseAddress={0x6000}
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
