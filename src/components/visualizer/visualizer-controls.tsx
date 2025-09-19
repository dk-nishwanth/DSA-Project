import React from 'react';
import { Button } from '@/components/ui/button';
import { HardDrive } from 'lucide-react';

interface VisualizerControlsProps {
  showMemory: boolean;
  onToggleMemory: (next: boolean) => void;
  voiceEnabled: boolean;
  onToggleVoice: (next: boolean) => void;
  className?: string;
}

export function VisualizerControls({ showMemory, onToggleMemory, voiceEnabled, onToggleVoice, className }: VisualizerControlsProps) {
  return (
    <div className={"flex items-center gap-3 flex-wrap " + (className || '')}>
      <Button onClick={() => onToggleMemory(!showMemory)}>
        <HardDrive className="h-4 w-4 mr-1" />
        {showMemory ? 'Hide Memory' : 'Show Memory'}
      </Button>
      <div className="flex items-center gap-2">
        <label className="text-sm">Voice Explain</label>
        <input type="checkbox" checked={voiceEnabled} onChange={(e)=>onToggleVoice(e.target.checked)} />
      </div>
    </div>
  );
}
