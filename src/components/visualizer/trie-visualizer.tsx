import React, { useState, useCallback } from 'react';
import { Plus, Search, Trash2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';
import { toast } from 'sonner';

interface TrieNode {
  char: string;
  isEnd: boolean;
  children: Map<string, TrieNode>;
  id: string;
  x: number;
  y: number;
  isHighlighted?: boolean;
  isSearchPath?: boolean;
}

export function TrieVisualizer() {
  const [words, setWords] = useState<string[]>(['CAT', 'CAR', 'CARD', 'CARE', 'CAREFUL']);
  const [inputWord, setInputWord] = useState('');
  const [searchWord, setSearchWord] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [highlightedPath, setHighlightedPath] = useState<string[]>([]);
  const [operation, setOperation] = useState<'insert' | 'search' | null>(null);
  const [showMemory, setShowMemory] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  
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

  const buildTrie = useCallback(() => {
    const root: TrieNode = {
      char: 'ROOT',
      isEnd: false,
      children: new Map(),
      id: 'root',
      x: 400,
      y: 50
    };

    words.forEach(word => {
      let current = root;
      for (const char of word) {
        if (!current.children.has(char)) {
          current.children.set(char, {
            char,
            isEnd: false,
            children: new Map(),
            id: `${current.id}-${char}`,
            x: 0,
            y: 0
          });
        }
        current = current.children.get(char)!;
      }
      current.isEnd = true;
    });

    // Calculate positions
    const calculatePositions = (node: TrieNode, level: number, minX: number, maxX: number) => {
      const childrenArray = Array.from(node.children.values());
      const childCount = childrenArray.length;
      
      if (childCount === 0) return;
      
      const spacing = (maxX - minX) / Math.max(1, childCount - 1);
      
      childrenArray.forEach((child, index) => {
        child.x = childCount === 1 ? (minX + maxX) / 2 : minX + index * spacing;
        child.y = 50 + level * 80;
        child.isHighlighted = highlightedPath.includes(child.id);
        
        const childWidth = Math.max(100, spacing);
        calculatePositions(child, level + 1, child.x - childWidth/2, child.x + childWidth/2);
      });
    };

    calculatePositions(root, 1, 50, 750);
    return root;
  }, [words, highlightedPath]);

  const insertWord = useCallback(async () => {
    if (!inputWord.trim()) {
      toast.error('Please enter a word');
      return;
    }

    const word = inputWord.toUpperCase();
    if (words.includes(word)) {
      toast.info('Word already exists in trie');
      return;
    }

    setIsAnimating(true);
    setOperation('insert');
    setCurrentStep(`Starting insertion of "${word}" into trie`);
    speakOperation("Trie Insert", `Starting insertion of word "${word}" into trie. We'll traverse character by character, creating new nodes as needed.`);
    
    // Animate insertion path
    const path = ['root'];
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      path.push(`${path[path.length - 1]}-${char}`);
      setHighlightedPath([...path]);
      setCurrentStep(`Processing character '${char}' at position ${i + 1} of ${word.length}`);
      speakStep("", `Processing character '${char}'. ${words.some(w => w.startsWith(word.substring(0, i + 1))) ? 'Path exists, following existing branch.' : 'Creating new branch for this character.'}`, i + 1, word.length);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    setWords(prev => [...prev, word]);
    setCurrentStep(`Successfully inserted "${word}" and marked end of word`);
    speakResult(`Successfully inserted "${word}" into trie! The word is now stored and can be searched efficiently.`);
    toast.success(`Inserted "${word}" into trie`);
    
    setTimeout(() => {
      setHighlightedPath([]);
      setIsAnimating(false);
      setOperation(null);
      setInputWord('');
      setCurrentStep('');
    }, 1500);
  }, [inputWord, words, speakOperation, speakStep, speakResult]);

  const searchForWord = useCallback(async () => {
    if (!searchWord.trim()) {
      toast.error('Please enter a word to search');
      return;
    }

    const word = searchWord.toUpperCase();
    setIsAnimating(true);
    setOperation('search');
    setCurrentStep(`Starting search for "${word}" in trie`);
    speakOperation("Trie Search", `Starting search for word "${word}" in trie. We'll follow the path character by character to see if the word exists.`);
    
    // Animate search path
    const path = ['root'];
    let found = true;
    
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      const nextId = `${path[path.length - 1]}-${char}`;
      path.push(nextId);
      setHighlightedPath([...path]);
      setCurrentStep(`Following path for character '${char}' at position ${i + 1}`);
      
      // Check if path exists in our words
      const pathExists = words.some(w => w.substring(0, i + 1) === word.substring(0, i + 1));
      speakStep("", `Checking character '${char}'. ${pathExists ? 'Path exists, continuing search.' : 'Path not found, word does not exist.'}`, i + 1, word.length);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (!pathExists) {
        found = false;
        break;
      }
    }
    
    const wordExists = words.includes(word);
    
    if (wordExists) {
      setCurrentStep(`"${word}" found! Complete word exists in trie`);
      speakResult(`Success! "${word}" found in trie. The word exists as a complete entry.`);
      toast.success(`"${word}" found in trie!`);
    } else if (found) {
      setCurrentStep(`"${word}" is a prefix but not a complete word`);
      speakResult(`"${word}" is a valid prefix but not stored as a complete word in the trie.`);
      toast.info(`"${word}" is a prefix but not a complete word`);
    } else {
      setCurrentStep(`"${word}" not found in trie`);
      speakResult(`"${word}" not found in trie. No path exists for this word.`);
      toast.error(`"${word}" not found in trie`);
    }
    
    setTimeout(() => {
      setHighlightedPath([]);
      setIsAnimating(false);
      setOperation(null);
      setCurrentStep('');
    }, 2000);
  }, [searchWord, words, speakOperation, speakStep, speakResult]);

  const removeWord = useCallback(() => {
    if (!searchWord.trim()) {
      toast.error('Please enter a word to remove');
      return;
    }

    const word = searchWord.toUpperCase();
    if (!words.includes(word)) {
      toast.error('Word not found in trie');
      return;
    }

    setWords(prev => prev.filter(w => w !== word));
    toast.success(`Removed "${word}" from trie`);
    setSearchWord('');
  }, [searchWord, words]);

  const resetTrie = useCallback(() => {
    setWords(['CAT', 'CAR', 'CARD', 'CARE', 'CAREFUL']);
    setHighlightedPath([]);
    setIsAnimating(false);
    setOperation(null);
    setInputWord('');
    setSearchWord('');
    toast.success('Trie reset to default words');
  }, []);

  const renderTrieNodes = (node: TrieNode): JSX.Element[] => {
    const elements: JSX.Element[] = [];
    
    // Render edges to children
    Array.from(node.children.values()).forEach(child => {
      elements.push(
        <line
          key={`edge-${node.id}-${child.id}`}
          x1={node.x}
          y1={node.y + 15}
          x2={child.x}
          y2={child.y - 15}
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="2"
          className="animate-fade-in"
        />
      );
      
      elements.push(...renderTrieNodes(child));
    });
    
    // Render current node
    elements.push(
      <g key={node.id} className="animate-fade-in">
        <circle
          cx={node.x}
          cy={node.y}
          r="18"
          fill={
            node.isHighlighted
              ? "hsl(var(--primary))"
              : node.isEnd
                ? "hsl(var(--success))"
                : "hsl(var(--card))"
          }
          stroke={
            node.isHighlighted
              ? "hsl(var(--primary-foreground))"
              : node.isEnd
                ? "hsl(var(--success-foreground))"
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
          className="text-sm font-bold fill-card-foreground"
        >
          {node.char === 'ROOT' ? '●' : node.char}
        </text>
        {node.isEnd && (
          <circle
            cx={node.x + 12}
            cy={node.y - 12}
            r="4"
            fill="hsl(var(--success))"
            className="animate-pulse"
          />
        )}
      </g>
    );
    
    return elements;
  };

  const trieRoot = buildTrie();

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Trie (Prefix Tree) Visualizer</h2>
        <p className="text-muted-foreground">
          Efficient prefix-based string storage and retrieval data structure
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border shadow-inner">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter word to insert"
            value={inputWord}
            onChange={(e) => setInputWord(e.target.value.toUpperCase())}
            className="w-40 border-2 focus:border-primary/50"
            disabled={isAnimating}
          />
          <Button
            onClick={insertWord}
            disabled={isAnimating}
            size="sm"
            className="flex items-center gap-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-md"
          >
            <Plus className="h-3 w-3" />
            Insert
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search/Remove word"
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value.toUpperCase())}
            className="w-40 border-2 focus:border-primary/50"
            disabled={isAnimating}
          />
          <Button
            onClick={searchForWord}
            disabled={isAnimating}
            size="sm"
            variant="secondary"
            className="flex items-center gap-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md"
          >
            <Search className="h-3 w-3" />
            Search
          </Button>
          <Button
            onClick={removeWord}
            disabled={isAnimating}
            size="sm"
            variant="destructive"
            className="flex items-center gap-1"
          >
            <Trash2 className="h-3 w-3" />
            Remove
          </Button>
        </div>
        
        <Button
          onClick={resetTrie}
          disabled={isAnimating}
          size="sm"
          variant="outline"
          className="flex items-center gap-1 border-2"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </Button>
      </div>

      {/* Current Words */}
      <div className="flex flex-wrap gap-2 p-3 bg-muted/20 rounded-lg">
        <span className="text-sm font-medium">Words in Trie:</span>
        {words.map(word => (
          <span
            key={word}
            className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium"
          >
            {word}
          </span>
        ))}
      </div>

      {/* Visualization */}
      <div className="relative bg-gradient-visualization rounded-xl border-2 border-border/50 overflow-hidden">
        <svg width="800" height="400" className="w-full h-auto">
          {renderTrieNodes(trieRoot)}
        </svg>
        
        {/* Operation Status */}
        {operation && (
          <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 border shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">
                {operation === 'insert' ? 'Inserting word...' : 'Searching trie...'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Current Step Display */}
      {currentStep && (
        <div className="p-4 bg-muted/20 rounded-lg border">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{operation === 'insert' ? 'Insert' : 'Search'}</Badge>
            <span className="text-sm font-medium">{currentStep}</span>
          </div>
        </div>
      )}

      {/* Algorithm Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-2">How Trie Works:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>Root node represents empty string</li>
            <li>Each path from root to node represents a prefix</li>
            <li>Nodes marked as "end" represent complete words</li>
            <li>Common prefixes share the same path</li>
            <li>Efficient for prefix-based operations</li>
          </ul>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-semibold mb-2">Complexity Analysis:</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div><strong>Insert:</strong> O(m) - m is word length</div>
            <div><strong>Search:</strong> O(m) - m is word length</div>
            <div><strong>Delete:</strong> O(m) - may need cleanup</div>
            <div><strong>Space:</strong> O(ALPHABET_SIZE × N × M)</div>
            <div><strong>Applications:</strong> Autocomplete, spell checkers, IP routing</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="text-sm text-muted-foreground bg-muted/20 rounded-lg p-3">
        <div className="font-medium mb-2">Trie Legend:</div>
        <div className="grid grid-cols-2 gap-2">
          <div>• <span className="text-success">Green circles:</span> End of word</div>
          <div>• <span className="text-primary">Blue highlight:</span> Current operation path</div>
          <div>• <span className="text-success">Green dot:</span> Word terminator</div>
          <div>• Each level represents character position</div>
        </div>
      </div>

      {/* Memory Layout */}
      {showMemory && (
        <MemoryLayout
          title="Trie Node Memory Layout"
          data={words.map(word => word.length)} // Show word lengths
          baseAddress={0xB000}
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