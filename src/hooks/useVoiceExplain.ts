import { useEffect, useState, useCallback } from 'react';

export function useVoiceExplain(text: string) {
  const [enabled, setEnabled] = useState<boolean>(() => {
    try { return localStorage.getItem('dsa_voice_explain') === '1'; } catch { return false; }
  });

  useEffect(() => {
    if (!enabled || !text) return;
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1.05; u.pitch = 1.0; u.volume = 0.85;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch {}
  }, [enabled, text]);

  const set = useCallback((on: boolean) => {
    setEnabled(on);
    try { localStorage.setItem('dsa_voice_explain', on ? '1' : '0'); } catch {}
  }, []);

  return { enabled, setEnabled: set };
}
