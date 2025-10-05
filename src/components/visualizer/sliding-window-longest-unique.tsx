import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { MemoryLayout } from '@/components/memory-layout';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';

export function LongestUniqueSubstringVisualizer() {
  const [text, setText] = useState('abcabcbb');
  const [l, setL] = useState(0);
  const [r, setR] = useState(0);
  const [best, setBest] = useState<{len:number,l:number,r:number}>({len:0,l:0,r:0});
  const [seen, setSeen] = useState<Record<string, number>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [showMemory, setShowMemory] = useState(false);
  const [currentStepText, setCurrentStepText] = useState('');
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
    speakStep,
    speakResult,
  } = useVisualizerVoice({ minInterval: 2000 });

  const sleep = (ms:number)=>new Promise(r=>setTimeout(r,ms));

  const run = useCallback(async ()=>{
    speakOperation('Longest Unique Substring', 'Sliding window expands to the right; on duplicate, move left past last occurrence.');
    if (isRunning) return; setIsRunning(true);
    const last: Record<string, number> = {};
    let left = 0; let bestLen = 0, bestL = 0, bestR = 0;
    for (let right = 0; right < text.length; right++) {
      const ch = text[right];
      if (last[ch] !== undefined && last[ch] >= left) {
        setCurrentStepText(`Duplicate '${ch}' encountered at ${right}. Move left to ${last[ch] + 1}.`);
        left = last[ch] + 1;
      } else {
        setCurrentStepText(`Extend window to include '${ch}' at ${right}.`);
      }
      last[ch] = right;
      setSeen({...last}); setL(left); setR(right);
      const curLen = right - left + 1;
      if (curLen > bestLen) { bestLen = curLen; bestL = left; bestR = right; setBest({len:bestLen,l:bestL,r:bestR}); }
      await sleep(160);
    }
    setIsRunning(false);
  }, [text, isRunning]);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2 p-4 bg-muted/30 rounded-xl border flex-wrap">
        <Input className="w-80" value={text} onChange={e=>setText(e.target.value)} />
        <Button onClick={run} disabled={isRunning}>Run</Button>
      </div>
      <div className="p-4 bg-card rounded-xl border font-mono">
        {text.split('').map((ch, i)=> (
          <span key={i} className={`px-1 ${i>=l && i<=r?'bg-warning/30':''} ${i>=best.l && i<=best.r?'underline decoration-success':''}`}>{ch}</span>
        ))}
      </div>
      <div className="text-sm">Best: <span className="font-mono">{best.len}</span> substring "<span className="font-mono">{text.slice(best.l, best.r+1)}</span>"</div>

      {currentStepText && (
        <div className="p-2 bg-muted/20 rounded text-sm">{currentStepText}</div>
      )}

      <div className="bg-muted/20 rounded-lg p-3 text-sm text-muted-foreground">
        <div>• Expand right; when duplicate seen, move left to last duplicate index + 1.</div>
        <div>• Time: O(n), Space: O(k) distinct chars</div>
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

      {showMemory && (
        <MemoryLayout
          title="Last Seen Indices (ASCII)"
          data={(function(){
            const arr:number[]=[]; for (let i=0;i<128;i++){ const ch=String.fromCharCode(i); arr.push(seen[ch]!==undefined?seen[ch]:-1); } return arr;
          })()}
          baseAddress={0x5600}
          wordSize={2}
        />
      )}
    </div>
  );
}
