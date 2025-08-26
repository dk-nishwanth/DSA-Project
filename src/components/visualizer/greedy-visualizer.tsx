import React, { useState, useCallback } from 'react';
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { PseudocodeBox } from '@/components/pseudocode-box';
import { ComplexityBox } from '@/components/complexity-box';

type GreedyAlgorithm = 'activity-selection' | 'fractional-knapsack' | 'huffman-coding';

interface Activity {
  id: number;
  name: string;
  start: number;
  finish: number;
  selected?: boolean;
  processed?: boolean;
}

interface KnapsackItem {
  id: number;
  name: string;
  weight: number;
  value: number;
  ratio: number;
  selected?: boolean;
  amount?: number;
}

interface HuffmanNode {
  id: string;
  char?: string;
  freq: number;
  left?: HuffmanNode;
  right?: HuffmanNode;
  code?: string;
}

export function GreedyVisualizer() {
  const [algorithm, setAlgorithm] = useState<GreedyAlgorithm>('activity-selection');
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(1000);

  // Activity Selection State
  const [activities, setActivities] = useState<Activity[]>([
    { id: 1, name: 'A1', start: 1, finish: 4 },
    { id: 2, name: 'A2', start: 3, finish: 5 },
    { id: 3, name: 'A3', start: 0, finish: 6 },
    { id: 4, name: 'A4', start: 5, finish: 7 },
    { id: 5, name: 'A5', start: 8, finish: 9 },
    { id: 6, name: 'A6', start: 5, finish: 9 },
    { id: 7, name: 'A7', start: 6, finish: 10 },
    { id: 8, name: 'A8', start: 8, finish: 11 },
  ]);

  // Knapsack State
  const [knapsackCapacity, setKnapsackCapacity] = useState(50);
  const [knapsackItems, setKnapsackItems] = useState<KnapsackItem[]>([
    { id: 1, name: 'Item 1', weight: 20, value: 100, ratio: 5.0 },
    { id: 2, name: 'Item 2', weight: 30, value: 120, ratio: 4.0 },
    { id: 3, name: 'Item 3', weight: 10, value: 60, ratio: 6.0 },
  ]);

  // Huffman Coding State
  const [huffmanText, setHuffmanText] = useState('ABRACADABRA');
  const [huffmanNodes, setHuffmanNodes] = useState<HuffmanNode[]>([]);
  const [huffmanCodes, setHuffmanCodes] = useState<{[key: string]: string}>({});

  const [currentStepDescription, setCurrentStepDescription] = useState('');

  const pseudocode: Record<GreedyAlgorithm, string[]> = {
    'activity-selection': [
      "function activitySelection(activities):",
      "  sort activities by finish time",
      "  result = [activities[0]]",
      "  lastSelected = 0",
      "  for i = 1 to n-1:",
      "    if activities[i].start >= activities[lastSelected].finish:",
      "      result.add(activities[i])",
      "      lastSelected = i",
      "  return result"
    ],
    'fractional-knapsack': [
      "function fractionalKnapsack(items, capacity):",
      "  sort items by value/weight ratio (descending)",
      "  totalValue = 0",
      "  currentWeight = 0",
      "  for each item in sorted items:",
      "    if currentWeight + item.weight <= capacity:",
      "      take full item",
      "      currentWeight += item.weight",
      "      totalValue += item.value",
      "    else:",
      "      take fractional amount",
      "      fraction = (capacity - currentWeight) / item.weight",
      "      totalValue += item.value * fraction",
      "      break",
      "  return totalValue"
    ],
    'huffman-coding': [
      "function buildHuffmanTree(text):",
      "  count frequency of each character",
      "  create leaf nodes for each character",
      "  add all nodes to min-heap",
      "  while heap has more than 1 node:",
      "    left = extract min from heap",
      "    right = extract min from heap", 
      "    merged = new Node(left.freq + right.freq)",
      "    merged.left = left",
      "    merged.right = right",
      "    add merged to heap",
      "  root = extract last node from heap",
      "  generate codes from root",
      "  return codes"
    ]
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const executeAlgorithm = useCallback(async () => {
    setIsAnimating(true);
    setCurrentStep(0);
    
    switch (algorithm) {
      case 'activity-selection':
        await executeActivitySelection();
        break;
      case 'fractional-knapsack':
        await executeFractionalKnapsack();
        break;
      case 'huffman-coding':
        await executeHuffmanCoding();
        break;
    }
    
    setIsAnimating(false);
  }, [algorithm, activities, knapsackItems, knapsackCapacity, huffmanText]);

  const executeActivitySelection = async () => {
    // Reset selections
    const sortedActivities = [...activities].sort((a, b) => a.finish - b.finish);
    setActivities(sortedActivities);
    
    setCurrentStep(1);
    setCurrentStepDescription('Sorting activities by finish time');
    await sleep(animationSpeed);

    const selected: Activity[] = [sortedActivities[0]];
    setActivities(prev => prev.map(act => 
      act.id === sortedActivities[0].id ? { ...act, selected: true } : act
    ));
    
    setCurrentStep(2);
    setCurrentStepDescription(`Selected first activity: ${sortedActivities[0].name}`);
    await sleep(animationSpeed);

    let lastSelected = 0;
    
    for (let i = 1; i < sortedActivities.length; i++) {
      setCurrentStep(5);
      setCurrentStepDescription(`Checking if ${sortedActivities[i].name} can be selected`);
      
      setActivities(prev => prev.map(act => 
        act.id === sortedActivities[i].id ? { ...act, processed: true } : act
      ));
      await sleep(animationSpeed);
      
      if (sortedActivities[i].start >= sortedActivities[lastSelected].finish) {
        setCurrentStep(6);
        setCurrentStepDescription(`${sortedActivities[i].name} can be selected - no overlap`);
        
        selected.push(sortedActivities[i]);
        setActivities(prev => prev.map(act => 
          act.id === sortedActivities[i].id ? { ...act, selected: true, processed: false } : act
        ));
        lastSelected = i;
        await sleep(animationSpeed);
      } else {
        setCurrentStepDescription(`${sortedActivities[i].name} overlaps - skipping`);
        await sleep(animationSpeed / 2);
      }
    }

    toast.success(`Selected ${selected.length} activities: ${selected.map(a => a.name).join(', ')}`);
  };

  const executeFractionalKnapsack = async () => {
    // Calculate ratios and sort
    const itemsWithRatio = knapsackItems.map(item => ({
      ...item,
      ratio: item.value / item.weight
    })).sort((a, b) => b.ratio - a.ratio);

    setKnapsackItems(itemsWithRatio);
    setCurrentStep(1);
    setCurrentStepDescription('Sorting items by value/weight ratio (descending)');
    await sleep(animationSpeed);

    let currentWeight = 0;
    let totalValue = 0;

    for (let i = 0; i < itemsWithRatio.length; i++) {
      const item = itemsWithRatio[i];
      setCurrentStep(4);
      setCurrentStepDescription(`Considering ${item.name} (ratio: ${item.ratio.toFixed(2)})`);
      
      setKnapsackItems(prev => prev.map(it => 
        it.id === item.id ? { ...it, selected: true } : it
      ));
      await sleep(animationSpeed);

      if (currentWeight + item.weight <= knapsackCapacity) {
        setCurrentStep(5);
        setCurrentStepDescription(`Taking full ${item.name}`);
        currentWeight += item.weight;
        totalValue += item.value;
        
        setKnapsackItems(prev => prev.map(it => 
          it.id === item.id ? { ...it, amount: 1 } : it
        ));
      } else {
        const fraction = (knapsackCapacity - currentWeight) / item.weight;
        if (fraction > 0) {
          setCurrentStep(11);
          setCurrentStepDescription(`Taking ${(fraction * 100).toFixed(1)}% of ${item.name}`);
          totalValue += item.value * fraction;
          
          setKnapsackItems(prev => prev.map(it => 
            it.id === item.id ? { ...it, amount: fraction } : it
          ));
        }
        break;
      }
      await sleep(animationSpeed);
    }

    toast.success(`Total value: ${totalValue.toFixed(2)}`);
  };

  const executeHuffmanCoding = async () => {
    // Count frequencies
    const freqMap = new Map<string, number>();
    for (const char of huffmanText) {
      freqMap.set(char, (freqMap.get(char) || 0) + 1);
    }

    setCurrentStep(1);
    setCurrentStepDescription('Counting character frequencies');
    await sleep(animationSpeed);

    // Create leaf nodes
    const nodes: HuffmanNode[] = Array.from(freqMap.entries()).map(([char, freq], index) => ({
      id: `leaf-${index}`,
      char,
      freq
    }));

    setHuffmanNodes([...nodes]);
    setCurrentStep(2);
    setCurrentStepDescription('Creating leaf nodes for each character');
    await sleep(animationSpeed);

    // Build tree (simplified visualization)
    const heap = [...nodes];
    let nodeId = 0;

    while (heap.length > 1) {
      heap.sort((a, b) => a.freq - b.freq);
      
      setCurrentStep(4);
      setCurrentStepDescription('Finding two nodes with minimum frequencies');
      await sleep(animationSpeed);

      const left = heap.shift()!;
      const right = heap.shift()!;
      
      setCurrentStep(7);
      setCurrentStepDescription(`Merging nodes (freq: ${left.freq} + ${right.freq})`);
      
      const merged: HuffmanNode = {
        id: `internal-${nodeId++}`,
        freq: left.freq + right.freq,
        left,
        right
      };

      heap.push(merged);
      await sleep(animationSpeed);
    }

    // Generate codes (simplified)
    const codes: {[key: string]: string} = {};
    const generateCodes = (node: HuffmanNode, code: string) => {
      if (node.char) {
        codes[node.char] = code || '0';
      } else {
        if (node.left) generateCodes(node.left, code + '0');
        if (node.right) generateCodes(node.right, code + '1');
      }
    };

    if (heap[0]) {
      generateCodes(heap[0], '');
      setHuffmanCodes(codes);
      
      setCurrentStep(11);
      setCurrentStepDescription('Generated Huffman codes');
      toast.success(`Generated codes for ${Object.keys(codes).length} characters`);
    }
  };

  const renderActivitySelection = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className={`p-3 rounded-lg border-2 transition-all duration-300 ${
              activity.selected
                ? 'border-success bg-success/10'
                : activity.processed
                ? 'border-warning bg-warning/10'
                : 'border-border bg-card'
            }`}
          >
            <div className="font-semibold">{activity.name}</div>
            <div className="text-sm text-muted-foreground">
              Start: {activity.start}, Finish: {activity.finish}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 h-16 bg-muted/20 rounded-lg relative">
        <div className="absolute inset-0 flex items-center">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className={`absolute h-8 rounded transition-all duration-300 flex items-center justify-center text-xs font-bold ${
                activity.selected ? 'bg-success text-success-foreground' : 'bg-muted'
              }`}
              style={{
                left: `${(activity.start / 12) * 100}%`,
                width: `${((activity.finish - activity.start) / 12) * 100}%`,
              }}
            >
              {activity.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFractionalKnapsack = () => (
    <div className="space-y-4">
      <div className="mb-4">
        <label className="text-sm font-medium">Knapsack Capacity: {knapsackCapacity}</label>
        <Input
          type="number"
          value={knapsackCapacity}
          onChange={(e) => setKnapsackCapacity(parseInt(e.target.value) || 0)}
          className="w-24 mt-1"
          disabled={isAnimating}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {knapsackItems.map((item) => (
          <div
            key={item.id}
            className={`p-3 rounded-lg border-2 transition-all duration-300 ${
              item.selected
                ? item.amount === 1
                  ? 'border-success bg-success/10'
                  : 'border-warning bg-warning/10'
                : 'border-border bg-card'
            }`}
          >
            <div className="font-semibold">{item.name}</div>
            <div className="text-sm space-y-1">
              <div>Weight: {item.weight}, Value: {item.value}</div>
              <div>Ratio: {item.ratio.toFixed(2)}</div>
              {item.amount !== undefined && (
                <div className="font-medium text-primary">
                  Selected: {(item.amount * 100).toFixed(1)}%
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHuffmanCoding = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Input Text:</label>
        <Input
          value={huffmanText}
          onChange={(e) => setHuffmanText(e.target.value.toUpperCase())}
          className="mt-1"
          disabled={isAnimating}
        />
      </div>
      
      {Object.keys(huffmanCodes).length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(huffmanCodes).map(([char, code]) => (
            <div key={char} className="p-2 bg-card border rounded text-center">
              <div className="font-mono font-bold">{char}</div>
              <div className="text-sm text-primary">{code}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <Select value={algorithm} onValueChange={(value: GreedyAlgorithm) => setAlgorithm(value)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="activity-selection">Activity Selection</SelectItem>
            <SelectItem value="fractional-knapsack">Fractional Knapsack</SelectItem>
            <SelectItem value="huffman-coding">Huffman Coding</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={executeAlgorithm} disabled={isAnimating} className="flex items-center gap-1">
          <Play className="h-4 w-4" />
          Start Algorithm
        </Button>

        <Button 
          onClick={() => {
            setCurrentStep(0);
            setCurrentStepDescription('');
            // Reset algorithm-specific state
          }} 
          variant="outline"
          disabled={isAnimating}
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset
        </Button>
      </div>

      {/* Visualization */}
      <div className="bg-gradient-visualization rounded-xl border-2 border-border/50 p-6">
        <h3 className="text-lg font-semibold mb-4 text-center">
          {algorithm.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </h3>
        
        {algorithm === 'activity-selection' && renderActivitySelection()}
        {algorithm === 'fractional-knapsack' && renderFractionalKnapsack()}
        {algorithm === 'huffman-coding' && renderHuffmanCoding()}

        {currentStepDescription && (
          <div className="mt-4 p-3 bg-muted/20 rounded-lg text-center">
            <p className="text-sm font-medium">{currentStepDescription}</p>
          </div>
        )}
      </div>

      {/* Pseudocode */}
      <PseudocodeBox 
        title={`${algorithm.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} - Pseudocode`}
        code={pseudocode[algorithm]} 
        highlightedLine={currentStep}
      />

      {/* Complexity Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ComplexityBox
          title="Time Complexity"
          timeComplexity={
            algorithm === 'activity-selection' ? 'O(n log n)' :
            algorithm === 'fractional-knapsack' ? 'O(n log n)' :
            'O(n log n)'
          }
          spaceComplexity={
            algorithm === 'huffman-coding' ? 'O(n)' : 'O(1)'
          }
          description="Dominated by sorting step in most greedy algorithms"
        />
        
        <div className="bg-muted/20 rounded-lg p-4">
          <h4 className="font-semibold mb-2">Greedy Choice Property</h4>
          <ul className="text-sm space-y-1">
            <li>• <strong>Local Optimum:</strong> Makes best choice at each step</li>
            <li>• <strong>No Backtracking:</strong> Never reconsiders previous choices</li>
            <li>• <strong>Fast:</strong> Usually O(n log n) due to sorting</li>
            <li>• <strong>Not Always Optimal:</strong> Works only for specific problems</li>
          </ul>
        </div>
      </div>
    </div>
  );
}