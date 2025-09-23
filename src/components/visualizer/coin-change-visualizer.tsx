import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Coins, RotateCcw, Play, Info } from 'lucide-react';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

export function CoinChangeVisualizer() {
  const [coinsInput, setCoinsInput] = useState('1,2,5');
  const [amount, setAmount] = useState('11');
  const [mode, setMode] = useState<'min'|'ways'>('min');
  const [dp, setDp] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [currentCoin, setCurrentCoin] = useState<number | null>(null);
  const [currentAmount, setCurrentAmount] = useState<number | null>(null);
  const [showMemory, setShowMemory] = useState(false);
  const [coins, setCoins] = useState<number[]>([1, 2, 5]);
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
    
    const coinArray = coinsInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n > 0);
    const targetAmount = Math.max(0, parseInt(amount) || 0);
    setCoins(coinArray);
    
    if (!coinArray.length) { 
      setIsRunning(false); 
      return; 
    }

    const modeText = mode === 'min' ? 'minimum coins needed' : 'number of ways to make change';
    speakOperation("Coin Change DP", `Starting dynamic programming solution to find ${modeText} for amount ${targetAmount} using coins [${coinArray.join(', ')}]`);
    
    if (mode === 'min') {
      const INF = 1e9;
      const D = Array(targetAmount + 1).fill(INF);
      D[0] = 0;
      setDp([...D]);
      setCurrentStep(`Initialized DP array. dp[0] = 0 (base case: 0 coins needed for amount 0)`);
      await sleep(1000);

      for (let coinIndex = 0; coinIndex < coinArray.length; coinIndex++) {
        const coin = coinArray[coinIndex];
        setCurrentCoin(coin);
        setCurrentStep(`Processing coin ${coin} - checking all amounts from ${coin} to ${targetAmount}`);
        speakStep("", `Now processing coin of value ${coin}. We'll update all amounts that can use this coin.`, coinIndex + 1, coinArray.length);
        await sleep(800);
        
        for (let x = coin; x <= targetAmount; x++) {
          setCurrentAmount(x);
          const oldValue = D[x];
          const newValue = Math.min(D[x], D[x - coin] + 1);
          D[x] = newValue;
          setDp([...D]);
          
          if (newValue < oldValue) {
            setCurrentStep(`Updated dp[${x}]: Using coin ${coin}, we need ${newValue} coins (was ${oldValue >= INF ? '∞' : oldValue})`);
          } else {
            setCurrentStep(`dp[${x}] remains ${oldValue >= INF ? '∞' : oldValue} (using coin ${coin} doesn't improve)`);
          }
          await sleep(300);
        }
      }
      
      const result = D[targetAmount] >= INF ? 'impossible' : `${D[targetAmount]} coins`;
      setCurrentStep(`Final result: ${result} needed to make amount ${targetAmount}`);
      speakResult(`Coin change complete! ${result === 'impossible' ? 'It is impossible to make the target amount' : `Minimum ${result} needed to make amount ${targetAmount}`}`);
      
    } else {
      const W = Array(targetAmount + 1).fill(0);
      W[0] = 1;
      setDp([...W]);
      setCurrentStep(`Initialized DP array. dp[0] = 1 (base case: 1 way to make amount 0)`);
      await sleep(1000);

      for (let coinIndex = 0; coinIndex < coinArray.length; coinIndex++) {
        const coin = coinArray[coinIndex];
        setCurrentCoin(coin);
        setCurrentStep(`Processing coin ${coin} - adding ways to make each amount using this coin`);
        speakStep("", `Now processing coin of value ${coin}. We'll add the number of ways this coin can contribute.`, coinIndex + 1, coinArray.length);
        await sleep(800);
        
        for (let x = coin; x <= targetAmount; x++) {
          setCurrentAmount(x);
          const oldValue = W[x];
          W[x] += W[x - coin];
          setDp([...W]);
          setCurrentStep(`Updated dp[${x}]: ${oldValue} + ${W[x - coin]} = ${W[x]} ways (added ways using coin ${coin})`);
          await sleep(300);
        }
      }
      
      setCurrentStep(`Final result: ${W[targetAmount]} ways to make amount ${targetAmount}`);
      speakResult(`Coin change complete! Found ${W[targetAmount]} different ways to make amount ${targetAmount}`);
    }
    
    setCurrentCoin(null);
    setCurrentAmount(null);
    setIsRunning(false);
  }, [isRunning, coinsInput, amount, mode, speakOperation, speakStep, speakResult]);

  const reset = useCallback(() => { 
    setDp([]); 
    setIsRunning(false); 
    setCurrentStep('');
    setCurrentCoin(null);
    setCurrentAmount(null);
  }, []);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          <Coins className="h-6 w-6" />
          Coin Change Visualizer
        </h2>
        <p className="text-muted-foreground">
          Dynamic Programming solution to find minimum coins or count ways to make change
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Coins:</span>
          <Input 
            className="w-40" 
            value={coinsInput} 
            onChange={e => setCoinsInput(e.target.value)}
            placeholder="1,2,5"
            disabled={isRunning}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Amount:</span>
          <Input 
            className="w-24" 
            value={amount} 
            onChange={e => setAmount(e.target.value)}
            placeholder="11"
            disabled={isRunning}
          />
        </div>
        <Select value={mode} onValueChange={(v: 'min'|'ways') => setMode(v)} disabled={isRunning}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="min">Minimum Coins</SelectItem>
            <SelectItem value="ways">Number of Ways</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={run} disabled={isRunning}>
          <Play className="h-4 w-4 mr-1" />
          {isRunning ? 'Running...' : 'Run Algorithm'}
        </Button>
        <Button onClick={reset} variant="outline" disabled={isRunning}>
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset
        </Button>
      </div>

      {/* Current Step Display */}
      {currentStep && (
        <div className="p-4 bg-muted rounded-lg border">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-primary mt-0.5" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                {currentCoin && (
                  <Badge variant="outline">Processing Coin: {currentCoin}</Badge>
                )}
                {currentAmount && (
                  <Badge variant="secondary">Amount: {currentAmount}</Badge>
                )}
              </div>
              <p className="text-sm">{currentStep}</p>
            </div>
          </div>
        </div>
      )}

      {/* DP Array Visualization */}
      <div className="p-6 bg-gradient-visualization rounded-xl border-2 border-primary/20">
        <h3 className="text-lg font-semibold mb-4 text-center">
          DP Array - {mode === 'min' ? 'Minimum Coins' : 'Number of Ways'}
        </h3>
        <div className="flex gap-2 flex-wrap justify-center">
          {dp.map((value, index) => (
            <div 
              key={index} 
              className={`
                px-3 py-2 border-2 rounded-lg font-mono text-sm min-w-[60px] text-center transition-all duration-300
                ${currentAmount === index 
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-110' 
                  : 'bg-card border-border hover:border-primary/50'
                }
              `}
            >
              <div className="text-xs text-muted-foreground">dp[{index}]</div>
              <div className="font-bold">
                {mode === 'min' && value >= 1e9 ? '∞' : value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coin Display */}
      {coins.length > 0 && (
        <div className="p-4 bg-muted/20 rounded-lg">
          <h4 className="font-semibold mb-3">Available Coins</h4>
          <div className="flex gap-2 flex-wrap">
            {coins.map((coin, index) => (
              <div 
                key={index}
                className={`
                  px-4 py-2 rounded-full border-2 font-medium transition-all duration-300
                  ${currentCoin === coin 
                    ? 'bg-primary text-primary-foreground border-primary shadow-lg' 
                    : 'bg-card border-border'
                  }
                `}
              >
                {coin}¢
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Algorithm Information */}
      <div className="bg-muted/20 rounded-lg p-4">
        <h4 className="font-semibold mb-2">Dynamic Programming Approach</h4>
        <div className="text-sm text-muted-foreground space-y-2">
          <div>
            <strong>Problem:</strong> {mode === 'min' 
              ? 'Find the minimum number of coins needed to make a target amount'
              : 'Count the number of different ways to make a target amount'
            }
          </div>
          <div>
            <strong>Recurrence:</strong> {mode === 'min'
              ? 'dp[i] = min(dp[i], dp[i-coin] + 1) for each coin'
              : 'dp[i] += dp[i-coin] for each coin'
            }
          </div>
          <div><strong>Time Complexity:</strong> O(amount × number of coins)</div>
          <div><strong>Space Complexity:</strong> O(amount) for the DP array</div>
          <div><strong>Base Case:</strong> {mode === 'min' ? 'dp[0] = 0 (0 coins needed for amount 0)' : 'dp[0] = 1 (1 way to make amount 0)'}</div>
        </div>
      </div>

      {/* Memory Layout */}
      {showMemory && (
        <MemoryLayout
          title="DP Array Memory Layout"
          data={dp.slice(0, 20)} // Show first 20 elements to avoid overflow
          baseAddress={0x8000}
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
