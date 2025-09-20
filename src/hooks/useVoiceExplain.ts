import { useEffect, useState, useCallback, useRef } from 'react';

export type VoiceSpeed = 'slow' | 'normal' | 'fast';

export function useVoiceExplain(text: string) {
  const [enabled, setEnabled] = useState<boolean>(() => {
    try { return localStorage.getItem('dsa_voice_explain') === '1'; } catch { return false; }
  });
  
  const [speed, setSpeed] = useState<VoiceSpeed>(() => {
    try { 
      const saved = localStorage.getItem('dsa_voice_speed') as VoiceSpeed;
      return saved && ['slow', 'normal', 'fast'].includes(saved) ? saved : 'normal';
    } catch { 
      return 'normal'; 
    }
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const getSpeedRate = useCallback((speed: VoiceSpeed): number => {
    switch (speed) {
      case 'slow': return 0.8;  // Increased from 0.7 for better browser compatibility
      case 'normal': return 1.0;
      case 'fast': return 1.5;  // Increased from 1.3 for more noticeable difference
      default: return 1.0;
    }
  }, []);

  const stopCurrentSpeech = useCallback(() => {
    try {
      // Force stop any ongoing speech
      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        window.speechSynthesis.cancel();
        // Wait a bit to ensure cancellation is processed
        setTimeout(() => {
          if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
          }
        }, 50);
      }
      setIsSpeaking(false);
      currentUtteranceRef.current = null;
    } catch {}
  }, []);

  useEffect(() => {
    if (!enabled || !text) {
      stopCurrentSpeech();
      return;
    }

    // Prevent overlapping speech - cancel any current speech
    stopCurrentSpeech();

    // Longer delay to ensure previous speech is fully cancelled and prevent overlapping
    const timeoutId = setTimeout(() => {
      try {
        // Double-check that speech synthesis is ready
        if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
          window.speechSynthesis.cancel();
          // Wait a bit more if there's still ongoing speech
          setTimeout(() => {
            if (!window.speechSynthesis.speaking) {
              startSpeech();
            }
          }, 100);
        } else {
          startSpeech();
        }

        function startSpeech() {
          const utterance = new SpeechSynthesisUtterance(text);
          const speedRate = getSpeedRate(speed);
          utterance.rate = speedRate;
          utterance.pitch = 1.0;
          utterance.volume = 0.85;
          console.log(`🎤 Creating speech with speed: ${speed}, rate: ${speedRate}`);
          
          // Set up event listeners
          utterance.onstart = () => {
            setIsSpeaking(true);
          };
          utterance.onend = () => {
            setIsSpeaking(false);
            currentUtteranceRef.current = null;
          };
          utterance.onerror = (event) => {
            console.warn('Speech synthesis error:', event);
            setIsSpeaking(false);
            currentUtteranceRef.current = null;
          };
          utterance.onpause = () => {
            // Keep isSpeaking true when paused
          };
          utterance.onresume = () => {
            setIsSpeaking(true);
          };

          currentUtteranceRef.current = utterance;
          window.speechSynthesis.speak(utterance);
        }
      } catch (error) {
        console.warn('Speech synthesis not available:', error);
        setIsSpeaking(false);
      }
    }, 150);

    return () => {
      clearTimeout(timeoutId);
      stopCurrentSpeech();
    };
  }, [enabled, text, speed, stopCurrentSpeech]);

  const setEnabledWithStorage = useCallback((on: boolean) => {
    if (!on) {
      stopCurrentSpeech();
    }
    setEnabled(on);
    try { localStorage.setItem('dsa_voice_explain', on ? '1' : '0'); } catch {}
  }, [stopCurrentSpeech]);

  const setSpeedWithStorage = useCallback((newSpeed: VoiceSpeed) => {
    console.log(`🎤 Voice speed changing from ${speed} to ${newSpeed}`);
    console.log(`🎤 Speed rate will be: ${getSpeedRate(newSpeed)}`);
    setSpeed(newSpeed);
    try { localStorage.setItem('dsa_voice_speed', newSpeed); } catch {}
    
    // If speech is currently active, update the rate immediately
    if (currentUtteranceRef.current && window.speechSynthesis.speaking) {
      console.log('🎤 Speech is active, restarting with new speed');
      try {
        // For ongoing speech, we need to restart with new speed
        // because utterance.rate is read-only after speech starts
        const currentText = currentUtteranceRef.current.text;
        const wasPlaying = !window.speechSynthesis.paused;
        
        stopCurrentSpeech();
        
        // Restart with new speed after a short delay
        setTimeout(() => {
          if (enabled && currentText) {
            const utterance = new SpeechSynthesisUtterance(currentText);
            const newSpeedRate = getSpeedRate(newSpeed);
            utterance.rate = newSpeedRate;
            utterance.pitch = 1.0;
            utterance.volume = 0.85;
            console.log(`🎤 Restarting speech with new speed: ${newSpeed}, rate: ${newSpeedRate}`);
            
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => {
              setIsSpeaking(false);
              currentUtteranceRef.current = null;
            };
            utterance.onerror = () => {
              setIsSpeaking(false);
              currentUtteranceRef.current = null;
            };

            currentUtteranceRef.current = utterance;
            if (wasPlaying) {
              window.speechSynthesis.speak(utterance);
            }
          }
        }, 100);
      } catch (error) {
        console.warn('Error updating speech speed:', error);
      }
    }
  }, [enabled, stopCurrentSpeech, getSpeedRate]);

  const pauseSpeech = useCallback(() => {
    try {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        // Note: We don't change isSpeaking state here as the speech is just paused
      }
    } catch (error) {
      console.warn('Error pausing speech:', error);
    }
  }, []);

  const resumeSpeech = useCallback(() => {
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsSpeaking(true);
      }
    } catch (error) {
      console.warn('Error resuming speech:', error);
    }
  }, []);

  return { 
    enabled, 
    setEnabled: setEnabledWithStorage,
    speed,
    setSpeed: setSpeedWithStorage,
    isSpeaking,
    pauseSpeech,
    resumeSpeech,
    stopSpeech: stopCurrentSpeech
  };
}
