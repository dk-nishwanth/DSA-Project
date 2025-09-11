import { useEffect, useMemo, useRef } from 'react';

interface VisualizationAutoNarratorProps {
  introText?: string;
}

export function VisualizationAutoNarrator({ introText }: VisualizationAutoNarratorProps) {
  const lastSpokenRef = useRef<string>('');

  const canSpeak = useMemo(() => typeof window !== 'undefined' && 'speechSynthesis' in window, []);

  const selectFemaleVoice = (): SpeechSynthesisVoice | undefined => {
    if (!canSpeak) return undefined;
    const voices = window.speechSynthesis.getVoices();
    const femaleKeywords = ['female', 'zira', 'samantha', 'karen', 'victoria', 'google uk english female', 'zira desktop'];
    const byKeyword = voices.find(v => femaleKeywords.some(k => v.name.toLowerCase().includes(k) || (v.voiceURI || '').toLowerCase().includes(k)));
    return byKeyword || voices.find(v => v.default) || voices[0];
  };

  const speak = (text: string) => {
    if (!canSpeak || !text?.trim()) return;
    if (text === lastSpokenRef.current) return;
    lastSpokenRef.current = text;
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1;
    utter.pitch = 1.1;
    utter.volume = 1;
    const voice = selectFemaleVoice();
    if (voice) utter.voice = voice;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<any>;
      const { narrationText, title, description, highlight, play } = ce?.detail || {};
      // On first play, speak intro first if provided
      if (play && introText) {
        speak(introText);
        return;
      }
      const assembled = narrationText || [title, description, highlight].filter(Boolean).join('. ');
      if (assembled) speak(assembled);
    };
    window.addEventListener('visualization_step', handler as EventListener);
    return () => window.removeEventListener('visualization_step', handler as EventListener);
  }, [introText]);

  return null;
}


