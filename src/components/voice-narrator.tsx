import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Pause, Play, RotateCcw, Volume2 } from 'lucide-react';

interface VoiceNarratorProps {
  text: string;
  rate?: number; // 0.1 - 10
  pitch?: number; // 0 - 2
  volume?: number; // 0 - 1
  className?: string;
  label?: string;
  preferredVoiceHint?: string; // e.g., 'female', 'Google UK English Female', 'Samantha'
  voiceGender?: 'female' | 'male' | 'any';
  variant?: 'default' | 'compact';
  showLabel?: boolean;
  autoSpeak?: boolean; // if true, speak automatically when text changes
}

export function VoiceNarrator({
  text,
  rate = 1,
  pitch = 1.1,
  volume = 1,
  className,
  label = 'Narration',
  preferredVoiceHint = 'female',
  voiceGender = 'female',
  variant = 'default',
  showLabel = true,
  autoSpeak = true
}: VoiceNarratorProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const lastTextRef = useRef<string>('');

  const canSpeak = useMemo(() => typeof window !== 'undefined' && 'speechSynthesis' in window, []);

  useEffect(() => {
    setIsSupported(canSpeak);
  }, [canSpeak]);

  useEffect(() => {
    return () => {
      if (canSpeak) {
        window.speechSynthesis.cancel();
      }
    };
  }, [canSpeak]);

  useEffect(() => {
    if (!canSpeak) return;
    const loadVoices = () => {
      const list = window.speechSynthesis.getVoices();
      if (list && list.length > 0) setVoices(list);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, [canSpeak]);

  const selectVoice = (): SpeechSynthesisVoice | undefined => {
    if (!voices || voices.length === 0) return undefined;
    const hint = (preferredVoiceHint || '').toLowerCase();
    const gender = (voiceGender || 'any').toLowerCase();

    const byHint = hint
      ? voices.find(v => v.name.toLowerCase().includes(hint) || (v.voiceURI || '').toLowerCase().includes(hint))
      : undefined;
    if (byHint) return byHint;

    const femaleKeywords = ['female', 'zira', 'samantha', 'karen', 'victoria', 'google uk english female', 'zira desktop'];
    const maleKeywords = ['male', 'david', 'alex', 'fred', 'google uk english male'];

    if (gender === 'female') {
      const match = voices.find(v => femaleKeywords.some(k => v.name.toLowerCase().includes(k) || (v.voiceURI || '').toLowerCase().includes(k)));
      if (match) return match;
    }
    if (gender === 'male') {
      const match = voices.find(v => maleKeywords.some(k => v.name.toLowerCase().includes(k) || (v.voiceURI || '').toLowerCase().includes(k)));
      if (match) return match;
    }
    // Fallback to default
    return voices.find(v => v.default) || voices[0];
  };

  const handleSpeak = () => {
    if (!canSpeak || !text?.trim()) return;
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsSpeaking(true);
      return;
    }
    if (isSpeaking) {
      // restart
      window.speechSynthesis.cancel();
    }
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = rate;
    utter.pitch = pitch;
    utter.volume = volume;
    const voice = selectVoice();
    if (voice) utter.voice = voice;
    utter.onend = () => setIsSpeaking(false);
    utter.onstart = () => setIsSpeaking(true);
    utter.onerror = () => setIsSpeaking(false);
    utteranceRef.current = utter;
    window.speechSynthesis.speak(utter);
  };

  // Auto-speak when text changes (browser permitting)
  useEffect(() => {
    if (!autoSpeak) return;
    const t = (text || '').trim();
    if (!t || t === lastTextRef.current) return;
    lastTextRef.current = t;
    const id = setTimeout(() => {
      handleSpeak();
    }, 120);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, autoSpeak]);

  const handlePause = () => {
    if (!canSpeak) return;
    if (isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsSpeaking(false);
    }
  };

  const handleReset = () => {
    if (!canSpeak) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const Controls = (
    <div className={`flex items-center ${variant === 'compact' ? 'gap-1' : 'gap-2'}`}>
      <Button size={variant === 'compact' ? 'sm' : 'sm'} variant={variant === 'compact' ? 'ghost' : 'outline'} onClick={handleSpeak} disabled={!isSupported || !text}>
        <Play className="h-4 w-4 mr-1" /> {variant === 'compact' ? 'Play' : 'Play'}
      </Button>
      <Button size={variant === 'compact' ? 'sm' : 'sm'} variant={variant === 'compact' ? 'ghost' : 'outline'} onClick={handlePause} disabled={!isSupported}>
        <Pause className="h-4 w-4 mr-1" /> {variant === 'compact' ? 'Pause' : 'Pause'}
      </Button>
      <Button size={variant === 'compact' ? 'sm' : 'sm'} variant={variant === 'compact' ? 'ghost' : 'outline'} onClick={handleReset} disabled={!isSupported}>
        <RotateCcw className="h-4 w-4 mr-1" /> {variant === 'compact' ? 'Reset' : 'Reset'}
      </Button>
    </div>
  );

  return (
    <div className={className}>
      {variant === 'compact' ? (
        <div className="flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-primary" />
          {showLabel && <span className="text-sm font-medium">{label}</span>}
          {Controls}
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/40">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-primary" />
            {showLabel && <span className="text-sm font-medium">{label}</span>}
          </div>
          {Controls}
        </div>
      )}
      {!isSupported && (
        <p className="mt-2 text-xs text-muted-foreground">Text-to-speech not supported in this browser.</p>
      )}
    </div>
  );
}


