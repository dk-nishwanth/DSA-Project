import { useEffect, useCallback, useRef } from 'react';
import { useVoiceExplain } from './useVoiceExplain';

interface VisualizerVoiceOptions {
  minInterval?: number;
  priority?: 'low' | 'normal' | 'high';
  enabled?: boolean;
}

export function useVisualizerVoice(options: VisualizerVoiceOptions = {}) {
  const {
    minInterval = 3000, // 3 seconds minimum between explanations
    priority = 'normal',
    enabled = true
  } = options;

  const lastExplanationRef = useRef<string>('');
  const explanationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Use the enhanced voice hook with controlled timing
  const {
    enabled: voiceEnabled,
    setEnabled: setVoiceEnabled,
    speed,
    setSpeed,
    isSpeaking,
    pauseSpeech,
    resumeSpeech,
    addToQueue,
    stopSpeech
  } = useVoiceExplain('', {
    minInterval,
    priority,
    independentTiming: true
  });

  const speakExplanation = useCallback((text: string, priority: 'low' | 'normal' | 'high' = 'normal') => {
    if (!voiceEnabled || !enabled || !text) return;
    
    // Avoid repeating the same explanation
    if (text === lastExplanationRef.current) {
      console.log('🎤 Skipping duplicate explanation:', text.substring(0, 30));
      return;
    }
    
    lastExplanationRef.current = text;
    
    // Add to queue with controlled timing
    addToQueue(text, priority);
    
    console.log(`🎤 Visualizer voice: queued explanation (${priority}): "${text.substring(0, 50)}..."`);
  }, [voiceEnabled, enabled, addToQueue]);

  const speakStep = useCallback((stepTitle: string, stepDescription: string, stepIndex?: number, totalSteps?: number) => {
    if (!voiceEnabled || !enabled) return;
    
    let explanation = '';
    
    if (stepIndex !== undefined && totalSteps !== undefined) {
      explanation = `Step ${stepIndex + 1} of ${totalSteps}: ${stepTitle}. ${stepDescription}`;
    } else {
      explanation = `${stepTitle}. ${stepDescription}`;
    }
    
    speakExplanation(explanation, 'normal');
  }, [speakExplanation, voiceEnabled, enabled]);

  const speakResult = useCallback((result: string) => {
    if (!voiceEnabled || !enabled) return;
    
    speakExplanation(`Result: ${result}`, 'high');
  }, [speakExplanation, voiceEnabled, enabled]);

  const speakOperation = useCallback((operation: string, details?: string) => {
    if (!voiceEnabled || !enabled) return;
    
    const explanation = details ? `${operation}. ${details}` : operation;
    speakExplanation(explanation, 'normal');
  }, [speakExplanation, voiceEnabled, enabled]);

  // Listen for visualization step events from StepByStepBase
  useEffect(() => {
    const handleVisualizationStep = (event: CustomEvent) => {
      const { narrationText, useControlledTiming, stepIndex, totalSteps } = event.detail;
      
      if (useControlledTiming && narrationText) {
        // Clear any pending timeout
        if (explanationTimeoutRef.current) {
          clearTimeout(explanationTimeoutRef.current);
        }
        
        // Add a small delay to ensure the visual update happens first
        explanationTimeoutRef.current = setTimeout(() => {
          if (stepIndex !== undefined && totalSteps !== undefined) {
            speakStep('', narrationText, stepIndex, totalSteps);
          } else {
            speakExplanation(narrationText, 'normal');
          }
        }, 200);
      }
    };

    window.addEventListener('visualization_step', handleVisualizationStep as EventListener);
    
    return () => {
      window.removeEventListener('visualization_step', handleVisualizationStep as EventListener);
      if (explanationTimeoutRef.current) {
        clearTimeout(explanationTimeoutRef.current);
      }
    };
  }, [speakStep, speakExplanation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (explanationTimeoutRef.current) {
        clearTimeout(explanationTimeoutRef.current);
      }
      stopSpeech();
    };
  }, [stopSpeech]);

  return {
    // Voice control
    voiceEnabled,
    setVoiceEnabled,
    speed,
    setSpeed,
    isSpeaking,
    
    // Speaking functions
    speakExplanation,
    speakStep,
    speakResult,
    speakOperation,
    
    // Control functions
    pauseSpeech,
    resumeSpeech,
    stopSpeech,
    
    // Status
    isEnabled: voiceEnabled && enabled
  };
}
