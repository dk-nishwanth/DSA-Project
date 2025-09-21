import { useEffect, useState, useCallback, useRef } from 'react';

export type VoiceSpeed = 'slow' | 'normal' | 'fast';

interface VoiceQueueItem {
  text: string;
  timestamp: number;
  priority?: 'low' | 'normal' | 'high';
}

export function useVoiceExplain(text: string, options?: { 
  minInterval?: number; 
  priority?: 'low' | 'normal' | 'high';
  independentTiming?: boolean;
}) {
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
  const voiceQueueRef = useRef<VoiceQueueItem[]>([]);
  const lastSpeechTimeRef = useRef<number>(0);
  const queueProcessorRef = useRef<NodeJS.Timeout | null>(null);
  
  // Default options
  const minInterval = options?.minInterval || 2000; // Minimum 2 seconds between voice explanations
  const priority = options?.priority || 'normal';
  const independentTiming = options?.independentTiming || true;

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
      
      // Clear queue processor
      if (queueProcessorRef.current) {
        clearTimeout(queueProcessorRef.current);
        queueProcessorRef.current = null;
      }
    } catch {}
  }, []);

  const addToVoiceQueue = useCallback((text: string, priority: 'low' | 'normal' | 'high' = 'normal') => {
    if (!text || !enabled) return;
    
    const now = Date.now();
    const queueItem: VoiceQueueItem = {
      text,
      timestamp: now,
      priority
    };
    
    // Add to queue based on priority
    if (priority === 'high') {
      voiceQueueRef.current.unshift(queueItem);
    } else {
      voiceQueueRef.current.push(queueItem);
    }
    
    // Remove old items (older than 10 seconds)
    voiceQueueRef.current = voiceQueueRef.current.filter(item => 
      now - item.timestamp < 10000
    );
    
    console.log(`🎤 Added to voice queue (${priority}): "${text.substring(0, 50)}..."`);
    processVoiceQueue();
  }, [enabled]);

  const processVoiceQueue = useCallback(() => {
    if (queueProcessorRef.current) return; // Already processing
    
    const processNext = () => {
      const now = Date.now();
      
      // Check if enough time has passed since last speech
      if (independentTiming && now - lastSpeechTimeRef.current < minInterval) {
        const waitTime = minInterval - (now - lastSpeechTimeRef.current);
        console.log(`🎤 Voice pacing: waiting ${waitTime}ms before next speech`);
        queueProcessorRef.current = setTimeout(processNext, waitTime);
        return;
      }
      
      // Get next item from queue
      const nextItem = voiceQueueRef.current.shift();
      if (!nextItem) {
        queueProcessorRef.current = null;
        return;
      }
      
      // Skip if speech is currently active
      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        console.log(`🎤 Speech active, skipping: "${nextItem.text.substring(0, 30)}..."`);
        queueProcessorRef.current = setTimeout(processNext, 500);
        return;
      }
      
      // Speak the text
      speakText(nextItem.text);
      lastSpeechTimeRef.current = now;
      
      // Continue processing queue after speech completes
      queueProcessorRef.current = setTimeout(processNext, 1000);
    };
    
    processNext();
  }, [independentTiming, minInterval]);

  const speakText = useCallback((textToSpeak: string) => {
    try {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      const speedRate = getSpeedRate(speed);
      utterance.rate = speedRate;
      utterance.pitch = 1.0;
      utterance.volume = 0.85;
      
      console.log(`🎤 Speaking with controlled pacing: "${textToSpeak.substring(0, 50)}..." (rate: ${speedRate})`);
      
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
      
      currentUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.warn('Speech synthesis not available:', error);
      setIsSpeaking(false);
    }
  }, [speed, getSpeedRate]);

  useEffect(() => {
    if (!enabled || !text) {
      return;
    }

    // Use queue system for controlled pacing
    if (independentTiming) {
      addToVoiceQueue(text, priority);
    } else {
      // Legacy immediate speech for backward compatibility
      const timeoutId = setTimeout(() => {
        speakText(text);
      }, 150);
      
      return () => clearTimeout(timeoutId);
    }
  }, [enabled, text, independentTiming, addToVoiceQueue, priority, speakText]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCurrentSpeech();
      voiceQueueRef.current = [];
    };
  }, [stopCurrentSpeech]);

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
    stopSpeech: stopCurrentSpeech,
    addToQueue: addToVoiceQueue,
    queueLength: voiceQueueRef.current.length
  };
}
