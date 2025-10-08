import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calculator, RotateCcw, Play, Pause, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';
import { toast } from 'sonner';

interface CombinationStep {
  candidates: number[];
  currentCombination: number[];
  currentSum: number;
  target: number;
  index: number;
  message: string;
  action: 'include' | 'skip' | 'backtrack' | 'found' | 'complete';
  highlightIndex?: number;
}

export function CombinationSumVisualizer() {
  const [candidatesInput, setCandidatesInput] = useState('2,3,6,7');
  const [targetInput, setTargetInput] = useState('7');
  const [steps, setSteps] = useState<CombinationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [solutions, setSolutions] = useState<number[][]>([]);
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

  const findCombinations = () => {
    try {
      const candidates = candidatesInput.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n) && n > 0);
      const target = parseInt(targetInput);

      if (candidates.length === 0 || isNaN(target) || target <= 0) {
        toast.error('Please enter valid candidates and target');
        return;
      }

      candidates.sort((a, b) => a - b); // Sort for better visualization

      speakOperation('Combination Sum', `Finding all combinations that sum to ${target} using backtracking`);

      const searchSteps: CombinationStep[] = [];
      const result: number[][] = [];

      const backtrack = (start: number, combination: number[], sum: number) => {
        if (sum === target) {
          result.push([...combination]);
          searchSteps.push({
            candidates,
            currentCombination: [...combination],
            currentSum: sum,
            target,
            index: start,
            message: `Found valid combination: [${combination.join(', ')}] = ${target}`,
            action: 'found'
          });
          return;
        }

        if (sum > target) {
          searchSteps.push({
            candidates,
            currentCombination: [...combination],
            currentSum: sum,
            target,
            index: start,
            message: `Sum ${sum} exceeds target ${target}. Backtracking...`,
            action: 'backtrack'
          });
          return;
        }

        for (let i = start; i < candidates.length; i++) {
          const num = candidates[i];
          
          // Include current number
          searchSteps.push({
            candidates,
            currentCombination: [...combination],
            currentSum: sum,
            target,
            index: i,
            highlightIndex: i,
            message: `Including ${num}. Current sum: ${sum} + ${num} = ${sum + num}`,
            action: 'include'
          });

          combination.push(num);
          backtrack(i, combination, sum + num); // Can reuse same element
          combination.pop();

          // Skip current number (implicit in loop)
          if (i < candidates.length - 1) {
            searchSteps.push({
              candidates,
              currentCombination: [...combination],
              currentSum: sum,
              target,
              index: i,
              highlightIndex: i,
              message: `Backtracked. Trying next candidate...`,
              action: 'skip'
            });
          }
        }
      };

      backtrack(0, [], 0);

      searchSteps.push({
        candidates,
        currentCombination: [],
        currentSum: 0,
        target,
        index: 0,
        message: `Search complete. Found ${result.length} combination(s)`,
        action: 'complete'
      });

      setSteps(searchSteps);
      setSolutions(result);
      setCurrentStep(0);
      setIsPlaying(true);

      speakResult(`Found ${result.length} valid combinations`);
    } catch (error) {
      toast.error('Error processing input');
    }
  };

  const reset = () => {
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
    setSolutions([]);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Candidates (comma-separated)</label>
          <Input
            value={candidatesInput}
            onChange={(e) => setCandidatesInput(e.target.value)}
            placeholder="2,3,6,7"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Target Sum</label>
          <Input
            type="number"
            value={targetInput}
            onChange={(e) => setTargetInput(e.target.value)}
            placeholder="7"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={findCombinations} className="flex-1">
          <Calculator className="w-4 h-4 mr-2" />
          Find Combinations
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

          {/* Candidates Array Visualization */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-sm font-medium mb-2">Candidates Array:</div>
            <div className="flex gap-2 flex-wrap">
              {steps[currentStep]?.candidates.map((num, idx) => (
                <motion.div
                  key={idx}
                  animate={{
                    scale: steps[currentStep]?.highlightIndex === idx ? 1.1 : 1,
                    backgroundColor: steps[currentStep]?.highlightIndex === idx 
                      ? steps[currentStep]?.action === 'include' ? '#10b981'
                      : steps[currentStep]?.action === 'skip' ? '#ef4444'
                      : '#3b82f6'
                      : '#f3f4f6'
                  }}
                  className={`w-12 h-12 flex items-center justify-center border-2 rounded font-bold ${
                    steps[currentStep]?.highlightIndex === idx
                      ? 'border-blue-500 text-white'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {num}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Current Combination */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-300">
            <div className="text-sm font-medium mb-2">Current Combination:</div>
            <div className="flex items-center gap-2 flex-wrap">
              {steps[currentStep]?.currentCombination.length > 0 ? (
                <>
                  {steps[currentStep]?.currentCombination.map((num, idx) => (
                    <Badge key={idx} variant="default" className="text-lg px-3 py-1">
                      {num}
                    </Badge>
                  ))}
                  <span className="text-lg font-bold mx-2">=</span>
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {steps[currentStep]?.currentSum}
                  </Badge>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    / {steps[currentStep]?.target}
                  </span>
                </>
              ) : (
                <span className="text-gray-500">Empty</span>
              )}
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
                steps[currentStep].action === 'include' ? 'bg-blue-100 dark:bg-blue-900/20 border-blue-500' :
                'bg-gray-100 dark:bg-gray-800 border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline">
                  Step {currentStep + 1} / {steps.length}
                </Badge>
                <div className="flex gap-2">
                  {steps[currentStep].action === 'include' && <Plus className="w-4 h-4 text-green-600" />}
                  {steps[currentStep].action === 'backtrack' && <Minus className="w-4 h-4 text-red-600" />}
                </div>
              </div>
              <div className="text-sm font-medium">{steps[currentStep].message}</div>
            </motion.div>
          )}

          {/* Solutions Found */}
          {solutions.length > 0 && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-500">
              <div className="text-sm font-medium mb-2">
                Solutions Found ({solutions.length}):
              </div>
              <div className="space-y-2">
                {solutions.map((solution, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Badge variant="outline">{idx + 1}.</Badge>
                    <div className="flex gap-1">
                      {solution.map((num, i) => (
                        <span key={i}>
                          {num}{i < solution.length - 1 && ' + '}
                        </span>
                      ))}
                    </div>
                    <span>= {solution.reduce((a, b) => a + b, 0)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div className="bg-muted/20 rounded-lg p-4 text-sm space-y-2">
        <div className="font-semibold text-primary">Combination Sum Problem:</div>
        <div>• <strong>Problem:</strong> Find all unique combinations that sum to target</div>
        <div>• <strong>Approach:</strong> Backtracking with decision tree (include/exclude)</div>
        <div>• <strong>Key Insight:</strong> Can reuse same element multiple times</div>
        <div>• <strong>Pruning:</strong> Stop exploring when sum exceeds target</div>
        <div>• <strong>Time Complexity:</strong> O(2^target) in worst case</div>
        <div>• <strong>Space Complexity:</strong> O(target) for recursion stack</div>
      </div>
    </div>
  );
}
