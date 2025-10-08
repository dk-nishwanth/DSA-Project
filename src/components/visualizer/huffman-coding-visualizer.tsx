import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

interface HuffmanNode {
  id: string;
  char?: string;
  frequency: number;
  left?: HuffmanNode;
  right?: HuffmanNode;
  x: number;
  y: number;
  isActive: boolean;
  isHighlighted: boolean;
  code?: string;
}

interface CharFrequency {
  char: string;
  frequency: number;
  code: string;
  isActive: boolean;
}

export function HuffmanCodingVisualizer() {
  const [textInput, setTextInput] = useState('ABRACADABRA');
  const [frequencies, setFrequencies] = useState<CharFrequency[]>([]);
  const [huffmanTree, setHuffmanTree] = useState<HuffmanNode | null>(null);
  const [encodedText, setEncodedText] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [showMemory, setShowMemory] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [compressionRatio, setCompressionRatio] = useState(0);

  const {
    voiceEnabled,
    setVoiceEnabled,
    speakOperation,
    speakStep,
    speakResult,
  } = useVisualizerVoice({ minInterval: 600 });

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const calculateFrequencies = useCallback(() => {
    const text = textInput.toUpperCase();
    const freqMap = new Map<string, number>();
    
    for (const char of text) {
      freqMap.set(char, (freqMap.get(char) || 0) + 1);
    }
    
    const freqArray: CharFrequency[] = Array.from(freqMap.entries()).map(([char, freq]) => ({
      char,
      frequency: freq,
      code: '',
      isActive: false,
    }));
    
    freqArray.sort((a, b) => a.frequency - b.frequency);
    setFrequencies(freqArray);
    return freqArray;
  }, [textInput]);

  const createNode = useCallback((char: string | undefined, frequency: number, left?: HuffmanNode, right?: HuffmanNode): HuffmanNode => ({
    id: `node-${Date.now()}-${Math.random()}`,
    char,
    frequency,
    left,
    right,
    x: 0,
    y: 0,
    isActive: false,
    isHighlighted: false,
  }), []);

  const calculatePositions = useCallback((node: HuffmanNode | null, x: number, y: number, spacing: number): void => {
    if (!node) return;
    
    node.x = x;
    node.y = y;
    
    const childSpacing = spacing / 2;
    if (node.left) {
      calculatePositions(node.left, x - spacing, y + 80, childSpacing);
    }
    if (node.right) {
      calculatePositions(node.right, x + spacing, y + 80, childSpacing);
    }
  }, []);

  const generateCodes = useCallback((node: HuffmanNode | null, code: string = '', codes: Map<string, string> = new Map()): Map<string, string> => {
    if (!node) return codes;
    
    if (node.char) {
      // Leaf node
      codes.set(node.char, code || '0'); // Single character gets '0'
      node.code = code || '0';
    } else {
      // Internal node
      generateCodes(node.left, code + '0', codes);
      generateCodes(node.right, code + '1', codes);
    }
    
    return codes;
  }, []);

  const buildHuffmanTree = useCallback(async () => {
    const freqArray = calculateFrequencies();
    
    speakOperation('Build Huffman Tree', `Building Huffman tree for text: "${textInput}"`);
    
    if (freqArray.length === 0) return;
    
    // Create initial nodes
    const nodes: HuffmanNode[] = freqArray.map(item => 
      createNode(item.char, item.frequency)
    );
    
    speakStep('Create nodes', `Created ${nodes.length} leaf nodes from character frequencies`, 1, freqArray.length);
    await sleep(800);
    
    // Build tree using priority queue (min-heap simulation)
    while (nodes.length > 1) {
      // Sort by frequency (min-heap behavior)
      nodes.sort((a, b) => a.frequency - b.frequency);
      
      // Take two nodes with minimum frequency
      const left = nodes.shift()!;
      const right = nodes.shift()!;
      
      // Highlight the nodes being merged
      left.isActive = true;
      right.isActive = true;
      
      speakStep('Merge nodes', `Merging nodes with frequencies ${left.frequency} and ${right.frequency}`, currentStep, freqArray.length);
      await sleep(600);
      
      // Create new internal node
      const merged = createNode(undefined, left.frequency + right.frequency, left, right);
      merged.isHighlighted = true;
      
      nodes.push(merged);
      
      speakStep('Create parent', `Created parent node with frequency ${merged.frequency}`, currentStep, freqArray.length);
      await sleep(500);
      
      left.isActive = false;
      right.isActive = false;
      merged.isHighlighted = false;
      
      setCurrentStep(prev => prev + 1);
    }
    
    const root = nodes[0];
    setHuffmanTree(root);
    calculatePositions(root, 400, 50, 150);
    
    // Generate Huffman codes
    const codes = generateCodes(root);
    
    // Update frequencies with codes
    const updatedFreqs = freqArray.map(item => ({
      ...item,
      code: codes.get(item.char) || '',
    }));
    setFrequencies(updatedFreqs);
    
    // Encode the text
    const encoded = textInput.toUpperCase().split('').map(char => codes.get(char) || '').join('');
    setEncodedText(encoded);
    
    // Calculate compression ratio
    const originalBits = textInput.length * 8; // ASCII encoding
    const compressedBits = encoded.length;
    const ratio = ((originalBits - compressedBits) / originalBits) * 100;
    setCompressionRatio(ratio);
    
    speakResult(`Huffman tree built successfully. Compression ratio: ${ratio.toFixed(1)}%`);
  }, [textInput, calculateFrequencies, createNode, calculatePositions, generateCodes, currentStep, speakOperation, speakStep, speakResult]);

  const renderHuffmanTree = (node: HuffmanNode | null): JSX.Element[] => {
    if (!node) return [];
    
    const elements: JSX.Element[] = [];
    
    // Draw edges to children
    if (node.left) {
      elements.push(
        <g key={`edge-${node.id}-left`}>
          <line
            x1={node.x}
            y1={node.y + 20}
            x2={node.left.x}
            y2={node.left.y - 20}
            stroke="#6B7280"
            strokeWidth={2}
          />
          <text
            x={(node.x + node.left.x) / 2 - 10}
            y={(node.y + node.left.y) / 2}
            className="text-xs font-bold fill-blue-600"
          >
            0
          </text>
        </g>
      );
      elements.push(...renderHuffmanTree(node.left));
    }
    
    if (node.right) {
      elements.push(
        <g key={`edge-${node.id}-right`}>
          <line
            x1={node.x}
            y1={node.y + 20}
            x2={node.right.x}
            y2={node.right.y - 20}
            stroke="#6B7280"
            strokeWidth={2}
          />
          <text
            x={(node.x + node.right.x) / 2 + 10}
            y={(node.y + node.right.y) / 2}
            className="text-xs font-bold fill-red-600"
          >
            1
          </text>
        </g>
      );
      elements.push(...renderHuffmanTree(node.right));
    }
    
    // Draw node
    elements.push(
      <g key={node.id}>
        <circle
          cx={node.x}
          cy={node.y}
          r={25}
          className={`transition-all duration-300 ${
            node.isActive
              ? 'fill-yellow-300 stroke-yellow-600'
              : node.isHighlighted
              ? 'fill-green-300 stroke-green-600'
              : node.char
              ? 'fill-blue-300 stroke-blue-600'
              : 'fill-white stroke-gray-400'
          }`}
          strokeWidth={2}
        />
        <text
          x={node.x}
          y={node.y - 5}
          textAnchor="middle"
          className="text-sm font-bold fill-gray-800"
        >
          {node.char || 'INT'}
        </text>
        <text
          x={node.x}
          y={node.y + 8}
          textAnchor="middle"
          className="text-xs fill-gray-600"
        >
          {node.frequency}
        </text>
      </g>
    );
    
    return elements;
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <div className="flex items-center gap-2">
          <span className="text-sm">Text:</span>
          <Input 
            className="w-48" 
            value={textInput} 
            onChange={(e) => setTextInput(e.target.value.toUpperCase())}
            placeholder="ABRACADABRA"
          />
        </div>

        <Button onClick={buildHuffmanTree} disabled={isRunning}>
          {isRunning ? 'Building...' : 'Build Huffman Tree'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="p-4 bg-gradient-visualization rounded-xl border-2">
            <h3 className="text-sm font-semibold mb-4 text-center">Huffman Tree</h3>
            <div className="w-full h-96 overflow-auto">
              <svg width="800" height="400" className="w-full h-full">
                {huffmanTree && renderHuffmanTree(huffmanTree)}
              </svg>
              {!huffmanTree && (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Click "Build Huffman Tree" to start
                </div>
              )}
            </div>
          </div>
          
          {encodedText && (
            <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl border-2 border-blue-300">
              <h3 className="text-sm font-semibold mb-2">Encoded Text</h3>
              <div className="font-mono text-sm break-all bg-white dark:bg-gray-800 p-2 rounded">
                {encodedText}
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Original: {textInput.length * 8} bits | Compressed: {encodedText.length} bits | 
                Savings: {compressionRatio.toFixed(1)}%
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-muted/20 rounded-xl border">
            <h3 className="text-sm font-semibold mb-2">Character Frequencies</h3>
            <div className="space-y-2">
              {frequencies.map((item, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center p-2 rounded text-sm transition-all duration-300 ${
                    item.isActive
                      ? 'bg-yellow-100 dark:bg-yellow-900/30'
                      : 'bg-white dark:bg-gray-800'
                  }`}
                >
                  <span className="font-mono font-bold">'{item.char}'</span>
                  <span>{item.frequency}</span>
                  <span className="font-mono text-xs text-blue-600">{item.code}</span>
                </div>
              ))}
            </div>
          </div>
          
          {compressionRatio > 0 && (
            <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-xl border-2 border-green-300">
              <h3 className="text-sm font-semibold mb-2">Compression Stats</h3>
              <div className="text-sm space-y-1">
                <div><strong>Original:</strong> {textInput.length * 8} bits</div>
                <div><strong>Compressed:</strong> {encodedText.length} bits</div>
                <div><strong>Ratio:</strong> {compressionRatio.toFixed(1)}% savings</div>
              </div>
            </div>
          )}
          
          <div className="p-4 bg-muted/20 rounded-xl border">
            <h3 className="text-sm font-semibold mb-2">Legend</h3>
            <div className="text-xs space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-300"></div>
                <span>Leaf Node (Character)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-white border border-gray-400"></div>
                <span>Internal Node</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-300"></div>
                <span>Active/Processing</span>
              </div>
              <div className="text-xs mt-2">
                <div><strong>Blue edges:</strong> 0 bit</div>
                <div><strong>Red edges:</strong> 1 bit</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <VisualizerControls
          showMemory={showMemory}
          onToggleMemory={setShowMemory}
          voiceEnabled={voiceEnabled}
          onToggleVoice={setVoiceEnabled}
        />
      </div>

      {showMemory && huffmanTree && (
        <MemoryLayout
          data={[huffmanTree]}
          title="Huffman Tree Memory"
          baseAddress={18000}
          wordSize={8}
        />
      )}

      <div className="bg-muted/20 rounded-lg p-4 text-sm space-y-2">
        <div className="font-semibold text-primary">Huffman Coding Algorithm:</div>
        <div>• <strong>Greedy Strategy:</strong> Always merge two nodes with lowest frequencies</div>
        <div>• <strong>Optimal Property:</strong> Produces minimum-length prefix-free codes</div>
        <div>• <strong>Time Complexity:</strong> O(n log n) where n is number of unique characters</div>
        <div>• <strong>Applications:</strong> File compression (ZIP, GZIP), image compression (JPEG)</div>
        <div>• <strong>Key Insight:</strong> Frequent characters get shorter codes, rare characters get longer codes</div>
      </div>
    </div>
  );
}