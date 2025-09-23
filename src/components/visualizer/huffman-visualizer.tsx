import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';
import { toast } from 'sonner';

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
  const [currentStep, setCurrentStep] = useState('');
  const [showMemory, setShowMemory] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  
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
  } = useVisualizerVoice({ minInterval: 2000 });

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const run = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setStepCount(0);
    
    let nodes = buildNodesFromText(text);
    setForest([...nodes]);
    setCurrentStep(`Building frequency table for "${text}" - found ${nodes.length} unique characters`);
    speakOperation("Huffman Coding", `Starting Huffman coding algorithm for text "${text}". First, we build a frequency table and create leaf nodes for each character.`);
    await sleep(1000);

    // Build Huffman tree using greedy approach
    let step = 1;
    setCurrentStep(`Starting tree construction with ${nodes.length} nodes in priority queue`);
    speakStep("", `We have ${nodes.length} nodes in our priority queue, sorted by frequency. Now we'll repeatedly merge the two nodes with lowest frequencies.`, step, nodes.length);
    
    while (nodes.length > 1) {
      nodes.sort((a,b)=>a.freq-b.freq);
      const a = nodes.shift()!;
      const b = nodes.shift()!;
      const merged: Node = { 
        freq: a.freq + b.freq, 
        left: a, 
        right: b, 
        id: Math.random().toString(36).slice(2) 
      };
      
      setCurrentStep(`Merging nodes: ${a.ch || `freq:${a.freq}`} + ${b.ch || `freq:${b.freq}`} = freq:${merged.freq}`);
      speakStep("", `Merging two lowest frequency nodes with frequencies ${a.freq} and ${b.freq} to create new internal node with frequency ${merged.freq}.`, step, nodes.length + 1);
      
      nodes.push(merged);
      setForest([...nodes]);
      setStepCount(step++);
      await sleep(800);
    }
    
    const rt = nodes[0];
    setRoot(rt);
    setCurrentStep(`Tree construction complete! Generating Huffman codes...`);
    speakStep("", "Tree construction complete! Now generating binary codes by traversing from root to each leaf.", step, step);
    await sleep(500);
    
    const codeMap = generateCodes(rt);
    setCodes(codeMap);
    
    const totalBits = Object.entries(codeMap).reduce((sum, [char, code]) => {
      const charFreq = text.split('').filter(c => c === char).length;
      return sum + (charFreq * code.length);
    }, 0);
    
    const originalBits = text.length * 8; // ASCII encoding
    const compressionRatio = ((originalBits - totalBits) / originalBits * 100).toFixed(1);
    
    setCurrentStep(`Huffman coding complete! Compression: ${originalBits} → ${totalBits} bits (${compressionRatio}% reduction)`);
    speakResult(`Huffman coding completed! Generated ${Object.keys(codeMap).length} unique codes. Compressed from ${originalBits} bits to ${totalBits} bits, achieving ${compressionRatio}% compression.`);
    toast.success(`Huffman coding complete! ${compressionRatio}% compression achieved`);
    
    setIsRunning(false);
  }, [text, isRunning, speakOperation, speakStep, speakResult]);

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
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Huffman Coding Visualizer</h2>
        <p className="text-muted-foreground">
          Optimal prefix-free binary encoding using greedy tree construction
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Input Text:</span>
          <Input 
            className="w-80" 
            value={text} 
            onChange={e=>setText(e.target.value)}
            placeholder="Enter text to encode"
            disabled={isRunning}
          />
        </div>
        <Button onClick={run} disabled={isRunning}>
          {isRunning ? 'Building Tree...' : 'Run Huffman Coding'}
        </Button>
        <Button onClick={reset} variant="outline" disabled={isRunning}>Reset</Button>
      </div>

      {/* Current Step Display */}
      {currentStep && (
        <div className="p-4 bg-muted/20 rounded-lg border">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Step {stepCount}</Badge>
            <span className="text-sm font-medium">{currentStep}</span>
          </div>
        </div>
      )}

      {/* Main Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Queue */}
        <div className="p-6 bg-gradient-visualization rounded-xl border-2 border-primary/20">
          <h3 className="text-lg font-semibold mb-4 text-center">Priority Queue (Min-Heap)</h3>
          <div className="flex gap-2 flex-wrap justify-center">
            {forest.slice().sort((a,b)=>a.freq-b.freq).map((n,i)=>(
              <div 
                key={i} 
                className="px-3 py-2 border-2 rounded-lg bg-card text-sm font-mono min-w-[60px] text-center transition-all duration-300 hover:border-primary/50"
              >
                <div className="text-xs text-muted-foreground">
                  {n.ch !== undefined ? 'char' : 'internal'}
                </div>
                <div className="font-bold">
                  {n.ch !== undefined ? `'${n.ch}'` : 'node'}
                </div>
                <div className="text-xs text-primary">freq: {n.freq}</div>
              </div>
            ))}
          </div>
          {forest.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              Priority queue will appear here during algorithm execution
            </div>
          )}
        </div>

        {/* Huffman Tree */}
        <div className="p-6 bg-gradient-visualization rounded-xl border-2 border-primary/20">
          <h3 className="text-lg font-semibold mb-4 text-center">Huffman Tree</h3>
          <div className="bg-white rounded-lg p-4">
            <svg width="100%" height="360" viewBox="0 0 640 360" className="mx-auto">
              {tree.edges?.map((e:any,i:number)=>(
                <g key={i}>
                  <line 
                    x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} 
                    stroke="hsl(var(--primary))" 
                    strokeWidth="2" 
                  />
                  <text 
                    x={(e.x1+e.x2)/2} y={(e.y1+e.y2)/2} 
                    fontSize="12" 
                    className="fill-primary font-bold"
                    textAnchor="middle"
                  >
                    {e.label}
                  </text>
                </g>
              ))}
              {tree.nodes?.map((n:any,i:number)=>(
                <g key={i}>
                  <circle 
                    cx={n.x} cy={n.y} r={25} 
                    fill="hsl(var(--card))" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth="2" 
                  />
                  <text 
                    x={n.x} y={n.y+5} 
                    textAnchor="middle" 
                    fontSize="11" 
                    fontWeight="bold"
                    className="fill-foreground"
                  >
                    {n.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
          {!root && (
            <div className="text-center text-muted-foreground py-8">
              Huffman tree will be constructed here
            </div>
          )}
        </div>
      </div>

      {/* Generated Codes */}
      {Object.keys(codes).length > 0 && (
        <div className="p-6 bg-muted/20 rounded-xl border">
          <h3 className="text-lg font-semibold mb-4">Generated Huffman Codes</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Object.entries(codes).map(([ch,code])=> (
              <div key={ch} className="px-3 py-2 border-2 rounded-lg bg-card text-sm font-mono text-center">
                <div className="text-xs text-muted-foreground">character</div>
                <div className="font-bold text-lg">'{ch}'</div>
                <div className="text-xs text-primary">→ {code}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Algorithm Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-2">How Huffman Coding Works:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>Build frequency table for all characters</li>
            <li>Create leaf nodes and add to priority queue</li>
            <li>Repeatedly merge two lowest-frequency nodes</li>
            <li>Assign 0/1 codes based on left/right tree paths</li>
            <li>More frequent characters get shorter codes</li>
          </ul>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-2">Complexity Analysis:</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div><strong>Time:</strong> O(n log n) - Priority queue operations</div>
            <div><strong>Space:</strong> O(n) - Tree storage and codes</div>
            <div><strong>Optimality:</strong> Produces minimum expected code length</div>
            <div><strong>Applications:</strong> File compression, data transmission</div>
          </div>
        </div>
      </div>

      {/* Memory Layout */}
      {showMemory && (
        <MemoryLayout
          title="Huffman Tree Memory Layout"
          data={forest.slice(0, 10).map(node => node.freq)} // Show frequencies
          baseAddress={0xA000}
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
