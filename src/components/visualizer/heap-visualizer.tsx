import React, { useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

interface HeapNode {
  value: number;
  id: string;
  x: number;
  y: number;
  isHighlighted?: boolean;
  isComparing?: boolean;
}

export function HeapVisualizer() {
  const [heap, setHeap] = useState<number[]>([50, 30, 40, 20, 10, 35, 25]);
  const [inputValue, setInputValue] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [highlightedIndices, setHighlightedIndices] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [operation, setOperation] = useState<'insert' | 'extract' | null>(null);
  const [showMemory, setShowMemory] = useState(false);

  const {
    voiceEnabled,
    setVoiceEnabled,
    speed,
    setSpeed,
    isSpeaking,
    pauseSpeech,
    resumeSpeech,
    stopSpeech,
    speakOperation,
    speakResult
  } = useVisualizerVoice({ minInterval: 2000 });

  const getHeapNodes = useCallback((): HeapNode[] => {
    const nodes: HeapNode[] = [];
    const levelWidth = 300;
    const levelHeight = 80;
    
    heap.forEach((value, index) => {
      const level = Math.floor(Math.log2(index + 1));
      const positionInLevel = index - (Math.pow(2, level) - 1);
      const totalInLevel = Math.pow(2, level);
      
      const x = 400 + (positionInLevel - (totalInLevel - 1) / 2) * (levelWidth / Math.max(1, totalInLevel - 1));
      const y = 80 + level * levelHeight;
      
      nodes.push({
        value,
        id: `node-${index}`,
        x: x,
        y: y,
        isHighlighted: highlightedIndices.includes(index),
        isComparing: false
      });
    });
    
    return nodes;
  }, [heap, highlightedIndices]);

  const heapifyUp = useCallback(async (startIndex: number) => {
    let currentIndex = startIndex;
    
    while (currentIndex > 0) {
      const parentIndex = Math.floor((currentIndex - 1) / 2);
      
      setHighlightedIndices([currentIndex, parentIndex]);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (heap[currentIndex] <= heap[parentIndex]) break;
      
      // Narrate comparison and swap
      speakOperation('Heapify Up', `Compare child ${heap[currentIndex]} with parent ${heap[parentIndex]}. Swap if child > parent in max-heap.`);

      // Swap
      const newHeap = [...heap];
      [newHeap[currentIndex], newHeap[parentIndex]] = [newHeap[parentIndex], newHeap[currentIndex]];
      setHeap(newHeap);
      
      await new Promise(resolve => setTimeout(resolve, 600));
      currentIndex = parentIndex;
    }
    
    setHighlightedIndices([]);
  }, [heap, speakOperation]);

  const heapifyDown = useCallback(async (startIndex: number, heapSize: number) => {
    let currentIndex = startIndex;
    
    while (true) {
      const leftChild = 2 * currentIndex + 1;
      const rightChild = 2 * currentIndex + 2;
      let largest = currentIndex;
      
      setHighlightedIndices([currentIndex, leftChild, rightChild].filter(i => i < heapSize));
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (leftChild < heapSize && heap[leftChild] > heap[largest]) {
        largest = leftChild;
      }
      
      if (rightChild < heapSize && heap[rightChild] > heap[largest]) {
        largest = rightChild;
      }
      
      if (largest === currentIndex) break;
      
      speakOperation('Heapify Down', `Swap parent ${heap[currentIndex]} with larger child ${heap[largest]} to restore heap property.`);

      // Swap
      const newHeap = [...heap];
      [newHeap[currentIndex], newHeap[largest]] = [newHeap[largest], newHeap[currentIndex]];
      setHeap(newHeap);
      
      await new Promise(resolve => setTimeout(resolve, 600));
      currentIndex = largest;
    }
    
    setHighlightedIndices([]);
  }, [heap, speakOperation]);

  const insertElement = useCallback(async () => {
    if (!inputValue.trim() || isNaN(Number(inputValue))) {
      toast.error('Please enter a valid number');
      return;
    }

    const value = Number(inputValue);
    setIsAnimating(true);
    setOperation('insert');

    speakOperation('Insert', `Insert ${value} at the end, then bubble up while parent is smaller (max-heap).`);
    
    const newHeap = [...heap, value];
    setHeap(newHeap);
    
    toast.success(`Inserted ${value} into heap`);
    
    await heapifyUp(newHeap.length - 1);

    speakResult(`Insertion of ${value} completed. Heap property restored.`);
    
    setIsAnimating(false);
    setOperation(null);
    setInputValue('');
  }, [inputValue, heap, heapifyUp, speakOperation, speakResult]);

  const extractMax = useCallback(async () => {
    if (heap.length === 0) {
      toast.error('Heap is empty');
      return;
    }

    setIsAnimating(true);
    setOperation('extract');

    speakOperation('Extract Max', `Remove the root (${heap[0]}). Move last element to root and heapify down.`);
    
    const maxValue = heap[0];
    const newHeap = [...heap];
    
    // Move last element to root
    newHeap[0] = newHeap[newHeap.length - 1];
    newHeap.pop();
    setHeap(newHeap);
    
    toast.success(`Extracted maximum: ${maxValue}`);
    
    if (newHeap.length > 0) {
      await heapifyDown(0, newHeap.length);
    }

    speakResult(`Extraction complete. New root is ${newHeap[0] ?? 'empty heap'}.`);
    
    setIsAnimating(false);
    setOperation(null);
  }, [heap, heapifyDown, speakOperation, speakResult]);

  const resetHeap = useCallback(() => {
    setHeap([50, 30, 40, 20, 10, 35, 25]);
    setHighlightedIndices([]);
    setIsAnimating(false);
    setOperation(null);
    setCurrentStep(0);
    toast.success('Heap reset to default state');
  }, []);

  const nodes = getHeapNodes();

  return (
    <div className="w-full space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Enter number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-32"
            disabled={isAnimating}
          />
          <Button
            onClick={insertElement}
            disabled={isAnimating}
            size="sm"
            className="flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Insert
          </Button>
        </div>
        
        <Button
          onClick={extractMax}
          disabled={isAnimating || heap.length === 0}
          size="sm"
          variant="destructive"
          className="flex items-center gap-1"
        >
          <Trash2 className="h-3 w-3" />
          Extract Max
        </Button>
        
        <Button
          onClick={resetHeap}
          disabled={isAnimating}
          size="sm"
          variant="outline"
          className="flex items-center gap-1"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </Button>
      </div>

      {/* Controls below visualization: voice + memory */}
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

      {/* Step Panel */}
      {currentStepText && (
        <div className="p-2 bg-muted/20 rounded text-sm text-center">{currentStepText}</div>
      )}

      {showMemory && (
        <MemoryLayout
          title="Heap Array Memory Layout"
          data={heap as number[]}
          baseAddress={0x6000}
          wordSize={4}
        />
      )}

      {/* Visualization */}
      <div className="relative bg-gradient-visualization rounded-xl border-2 border-border/50 overflow-hidden">
        <svg width="800" height="400" className="w-full h-auto">
          {/* Edges */}
          {nodes.map((node, index) => {
            const edges = [];
            const leftChildIndex = 2 * index + 1;
            const rightChildIndex = 2 * index + 2;
            
            if (leftChildIndex < nodes.length) {
              const leftChild = nodes[leftChildIndex];
              edges.push(
                <line
                  key={`edge-left-${index}`}
                  x1={node.x}
                  y1={node.y + 20}
                  x2={leftChild.x}
                  y2={leftChild.y - 20}
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth="2"
                  className="animate-fade-in"
                />
              );
            }
            
            if (rightChildIndex < nodes.length) {
              const rightChild = nodes[rightChildIndex];
              edges.push(
                <line
                  key={`edge-right-${index}`}
                  x1={node.x}
                  y1={node.y + 20}
                  x2={rightChild.x}
                  y2={rightChild.y - 20}
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth="2"
                  className="animate-fade-in"
                />
              );
            }
            
            return edges;
          })}
          
          {/* Nodes */}
          {nodes.map((node, index) => (
            <g key={node.id} className="animate-fade-in">
              <circle
                cx={node.x}
                cy={node.y}
                r="20"
                fill={
                  node.isHighlighted 
                    ? "hsl(var(--primary))"
                    : index === 0 
                      ? "hsl(var(--success))"
                      : "hsl(var(--card))"
                }
                stroke={
                  node.isHighlighted 
                    ? "hsl(var(--primary-foreground))"
                    : "hsl(var(--border))"
                }
                strokeWidth="2"
                className={`transition-all duration-300 ${
                  node.isHighlighted ? 'animate-pulse' : ''
                }`}
              />
              <text
                x={node.x}
                y={node.y + 4}
                textAnchor="middle"
                className="text-sm font-medium fill-card-foreground"
              >
                {node.value}
              </text>
              <text
                x={node.x}
                y={node.y - 30}
                textAnchor="middle"
                className="text-xs fill-muted-foreground"
              >
                {index}
              </text>
            </g>
          ))}
        </svg>
        
        {/* Operation Status */}
        {operation && (
          <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 border shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">
                {operation === 'insert' ? 'Inserting & Heapifying Up' : 'Extracting & Heapifying Down'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="text-sm text-muted-foreground bg-muted/20 rounded-lg p-3">
        <div className="font-medium mb-1">Max Heap Operations:</div>
        <div>• <strong>Insert:</strong> Add element at end, then heapify up (O(log n))</div>
        <div>• <strong>Extract Max:</strong> Remove root, move last to root, heapify down (O(log n))</div>
        <div>• <strong>Root (green):</strong> Always contains the maximum element</div>
      </div>
    </div>
  );
}