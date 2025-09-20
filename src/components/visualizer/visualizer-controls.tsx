import React from 'react';
import { Button } from '@/components/ui/button';
import { HardDrive, Volume2, VolumeX, Pause, Play, Square, Gauge } from 'lucide-react';
import { VoiceSpeed } from '@/hooks/useVoiceExplain';

interface VisualizerControlsProps {
  showMemory: boolean;
  onToggleMemory: (next: boolean) => void;
  voiceEnabled: boolean;
  onToggleVoice: (next: boolean) => void;
  voiceSpeed?: VoiceSpeed;
  onVoiceSpeedChange?: (speed: VoiceSpeed) => void;
  isSpeaking?: boolean;
  onPauseSpeech?: () => void;
  onResumeSpeech?: () => void;
  onStopSpeech?: () => void;
  className?: string;
}

export function VisualizerControls({ 
  showMemory, 
  onToggleMemory, 
  voiceEnabled, 
  onToggleVoice,
  voiceSpeed = 'normal',
  onVoiceSpeedChange,
  isSpeaking = false,
  onPauseSpeech,
  onResumeSpeech,
  onStopSpeech,
  className 
}: VisualizerControlsProps) {
  return (
    <div className={"flex items-center gap-3 flex-wrap " + (className || '')}>
      <Button onClick={() => onToggleMemory(!showMemory)} variant="outline" size="sm">
        <HardDrive className="h-4 w-4 mr-1" />
        {showMemory ? 'Hide Memory' : 'Show Memory'}
      </Button>
      
      <div className="flex items-center gap-2 p-2 rounded-lg border bg-muted/20">
        <Button
          onClick={() => onToggleVoice(!voiceEnabled)}
          variant={voiceEnabled ? "default" : "outline"}
          size="sm"
        >
          {voiceEnabled ? <Volume2 className="h-4 w-4 mr-1" /> : <VolumeX className="h-4 w-4 mr-1" />}
          Voice
        </Button>
        
        {voiceEnabled && (
          <>
            <div className="flex items-center gap-1">
              <Gauge className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Speed:</span>
              <div className="flex items-center gap-1">
                <Button
                  onClick={() => {
                    console.log('🔘 Slow button clicked');
                    onVoiceSpeedChange?.('slow');
                  }}
                  variant={voiceSpeed === 'slow' ? "default" : "ghost"}
                  size="sm"
                  className="h-7 px-2 text-xs"
                  title="Slow speed (0.8x)"
                >
                  Slow
                </Button>
                <Button
                  onClick={() => {
                    console.log('🔘 Normal button clicked');
                    onVoiceSpeedChange?.('normal');
                  }}
                  variant={voiceSpeed === 'normal' ? "default" : "ghost"}
                  size="sm"
                  className="h-7 px-2 text-xs"
                  title="Normal speed (1.0x)"
                >
                  Normal
                </Button>
                <Button
                  onClick={() => {
                    console.log('🔘 Fast button clicked');
                    onVoiceSpeedChange?.('fast');
                  }}
                  variant={voiceSpeed === 'fast' ? "default" : "ghost"}
                  size="sm"
                  className="h-7 px-2 text-xs"
                  title="Fast speed (1.5x)"
                >
                  Fast
                </Button>
              </div>
            </div>
            
            {(onPauseSpeech || onResumeSpeech || onStopSpeech) && (
              <div className="flex items-center gap-1">
                {onPauseSpeech && (
                  <Button
                    onClick={onPauseSpeech}
                    variant="ghost"
                    size="sm"
                    disabled={!isSpeaking}
                  >
                    <Pause className="h-3 w-3" />
                  </Button>
                )}
                {onResumeSpeech && (
                  <Button
                    onClick={onResumeSpeech}
                    variant="ghost"
                    size="sm"
                    disabled={isSpeaking}
                  >
                    <Play className="h-3 w-3" />
                  </Button>
                )}
                {onStopSpeech && (
                  <Button
                    onClick={onStopSpeech}
                    variant="ghost"
                    size="sm"
                  >
                    <Square className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
