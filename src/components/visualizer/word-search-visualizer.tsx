import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, RotateCcw, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';
import { toast } from 'sonner';

interface Cell {
  char: string;
  row: number;
  col: number;
  isCurrentPath: boolean;
  isVisited: boolean;
  isMatched: boolean;
  isFinalPath: boolean;
  isExploring: boolean;
}

interface SearchStep {
  grid: Cell[][];
  currentChar: string;
  charIndex: number;
  position: [number, number];
  message: string;
  action: 'explore' | 'match' | 'backtrack' | 'found' | 'notfound';
}

export function WordSearchVisualizer() {
  const [gridInput, setGridInput] = useState('ABCE,SFCS,ADEE');
  const [wordInput, setWordInput] = useState('ABCCED');
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [steps, setSteps] = useState<SearchStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [found, setFound] = useState(false);
  const [showMemory, setShowMemory] = useState(false);

  const {
    voiceEnabled,
    setVoiceEnabled,
    speed,
    setSpeed,
    speakStep,
    speakOperation,
    speakResult,
  } = useVisualizerVoice({ minInterval: 1500 });

  const parseGrid = () => {
    try {
      const rows = gridInput.split(',').map(row => row.trim().toUpperCase());
      return rows.map((row, r) => 
        row.split('').map((char, c) => ({
          char,
          row: r,
          col: c,
          isCurrentPath: false,
          isVisited: false,
          isMatched: false,
          isFinalPath: false,
          isExploring: false,
        }))
      );
    } catch (error) {
      toast.error('Invalid grid format');
      return null;
    }
  };

  const searchWord = () => {
    const gridData = parseGrid();
    if (!gridData || !wordInput) {
      toast.error('Please enter valid grid and word');
      return;
    }

    speakOperation('Word Search', `Searching for word "${wordInput}" in the grid using backtracking`);

    const word = wordInput.toUpperCase();
    const rows = gridData.length;
    const cols = gridData[0].length;
    const searchSteps: SearchStep[] = [];
    let wordFound = false;

    const dfs = (r: number, c: number, index: number, visited: Set<string>, path: [number, number][]): boolean => {
      if (index === word.length) {
        searchSteps.push({
          grid: JSON.parse(JSON.stringify(gridData)),
          currentChar: '',
          charIndex: index,
          position: [r, c],
          message: `Found complete word "${word}"!`,
          action: 'found'
        });
        return true;
      }

      if (r < 0 || r >= rows || c < 0 || c >= cols || visited.has(`${r},${c}`) || gridData[r][c].char !== word[index]) {
        return false;
      }

      // Mark as exploring
      visited.add(`${r},${c}`);
      path.push([r, c]);

      searchSteps.push({
        grid: JSON.parse(JSON.stringify(gridData)),
        currentChar: word[index],
        charIndex: index,
        position: [r, c],
        message: `Matched '${word[index]}' at (${r}, ${c}). Looking for '${word[index + 1] || 'END'}'`,
        action: 'match'
      });

      // Explore all 4 directions
      const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
      for (const [dr, dc] of directions) {
        if (dfs(r + dr, c + dc, index + 1, visited, path)) {
          return true;
        }
      }

      // Backtrack
      searchSteps.push({
        grid: JSON.parse(JSON.stringify(gridData)),
        currentChar: word[index],
        charIndex: index,
        position: [r, c],
        message: `Backtracking from (${r}, ${c}). No valid path found.`,
        action: 'backtrack'
      });

      visited.delete(`${r},${c}`);
      path.pop();
      return false;
    };

    // Try starting from each cell
    for (let r = 0; r < rows && !wordFound; r++) {
      for (let c = 0; c < cols && !wordFound; c++) {
        if (gridData[r][c].char === word[0]) {
          searchSteps.push({
            grid: JSON.parse(JSON.stringify(gridData)),
            currentChar: word[0],
            charIndex: 0,
            position: [r, c],
            message: `Starting search from (${r}, ${c}) with '${word[0]}'`,
            action: 'explore'
          });

          if (dfs(r, c, 0, new Set(), [])) {
            wordFound = true;
          }
        }
      }
    }

    if (!wordFound) {
      searchSteps.push({
        grid: JSON.parse(JSON.stringify(gridData)),
        currentChar: '',
        charIndex: 0,
        position: [0, 0],
        message: `Word "${word}" not found in grid`,
        action: 'notfound'
      });
    }

    setGrid(gridData);
    setSteps(searchSteps);
    setCurrentStep(0);
    setFound(wordFound);
    setIsPlaying(true);

    speakResult(wordFound ? `Word found!` : `Word not found`);
  };

  const reset = () => {
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
    setFound(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Grid (comma-separated rows)</label>
          <Input
            value={gridInput}
            onChange={(e) => setGridInput(e.target.value)}
            placeholder="ABCE,SFCS,ADEE"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Word to Search</label>
          <Input
            value={wordInput}
            onChange={(e) => setWordInput(e.target.value)}
            placeholder="ABCCED"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={searchWord} className="flex-1">
          <Search className="w-4 h-4 mr-2" />
          Search Word
        </Button>
        <Button onClick={reset} variant="outline">
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {steps.length > 0 && (
        <>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              variant="outline"
              size="sm"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <VisualizerControls
              showMemory={showMemory}
              onToggleMemory={setShowMemory}
              voiceEnabled={voiceEnabled}
              onToggleVoice={setVoiceEnabled}
              voiceSpeed={speed}
              onVoiceSpeedChange={setSpeed}
            />
          </div>

          {/* Grid Visualization */}
          <div className="flex justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="inline-block">
              {grid.map((row, r) => (
                <div key={r} className="flex gap-1">
                  {row.map((cell, c) => {
                    const step = steps[currentStep];
                    const isCurrentPos = step && step.position[0] === r && step.position[1] === c;
                    const isInPath = step && step.action === 'match' && step.charIndex > 0;

                    return (
                      <motion.div
                        key={`${r}-${c}`}
                        initial={{ scale: 0.8 }}
                        animate={{ 
                          scale: isCurrentPos ? 1.1 : 1,
                          backgroundColor: isCurrentPos 
                            ? step.action === 'match' ? '#10b981' 
                            : step.action === 'backtrack' ? '#ef4444'
                            : '#3b82f6'
                            : '#f3f4f6'
                        }}
                        className={`w-12 h-12 flex items-center justify-center border-2 rounded font-bold text-lg ${
                          isCurrentPos
                            ? 'border-blue-500 text-white'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        {cell.char}
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Current Step Info */}
          {steps[currentStep] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg border ${
                steps[currentStep].action === 'found' ? 'bg-green-100 dark:bg-green-900/20 border-green-500' :
                steps[currentStep].action === 'backtrack' ? 'bg-red-100 dark:bg-red-900/20 border-red-500' :
                steps[currentStep].action === 'match' ? 'bg-blue-100 dark:bg-blue-900/20 border-blue-500' :
                'bg-gray-100 dark:bg-gray-800 border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline">
                  Step {currentStep + 1} / {steps.length}
                </Badge>
                <Badge variant="outline">
                  Character: {steps[currentStep].charIndex + 1} / {wordInput.length}
                </Badge>
              </div>
              <div className="text-sm font-medium">{steps[currentStep].message}</div>
            </motion.div>
          )}
        </>
      )}

      <div className="bg-muted/20 rounded-lg p-4 text-sm space-y-2">
        <div className="font-semibold text-primary">Word Search Problem:</div>
        <div>• <strong>Problem:</strong> Find if a word exists in a 2D character grid</div>
        <div>• <strong>Approach:</strong> Backtracking with DFS in 4 directions (up, down, left, right)</div>
        <div>• <strong>Backtracking:</strong> Mark cell as visited, explore neighbors, unmark if no path found</div>
        <div>• <strong>Time Complexity:</strong> O(N × 4^L) where N is grid cells, L is word length</div>
        <div>• <strong>Space Complexity:</strong> O(L) for recursion stack</div>
      </div>
    </div>
  );
}
