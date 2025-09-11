import { useEffect, useRef, useState } from 'react';
import { VoiceNarrator } from '@/components/voice-narrator';

interface VisualizationNarratorProps {
  className?: string;
}

// Listens for CustomEvent('visualization_step', { detail: { description } })
export function VisualizationNarrator({ className }: VisualizationNarratorProps) {
  const [text, setText] = useState<string>('');
  const lastSpokenRef = useRef<string>('');

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ description?: string }>;
      if (ce?.detail) {
        const { narrationText, description, title, highlight } = ce.detail as any;
        const assembled = narrationText || [title, description, highlight].filter(Boolean).join('. ');
        if (assembled && assembled !== lastSpokenRef.current) {
          lastSpokenRef.current = assembled;
          setText(assembled);
        }
      }
    };
    window.addEventListener('visualization_step', handler as EventListener, { once: false });
    return () => window.removeEventListener('visualization_step', handler as EventListener);
  }, []);

  return (
    <VoiceNarrator
      className={className}
      label="Visualization narration"
      text={text}
      preferredVoiceHint="female"
      voiceGender="female"
      variant="compact"
      autoSpeak={true}
    />
  );
}


