import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { useVoiceExplain } from '@/hooks/useVoiceExplain';

export function VoiceSpeedTest() {
  const [testText, setTestText] = useState(
    "This is a test of the voice speed functionality. You can change the speed using the buttons below and hear the difference in speech rate. Slow speed is 0.7 times normal, normal speed is 1.0 times, and fast speed is 1.3 times normal."
  );
  const [showMemory, setShowMemory] = useState(false);

  const {
    enabled: voiceEnabled,
    setEnabled: setVoiceEnabled,
    speed: voiceSpeed,
    setSpeed: setVoiceSpeed,
    isSpeaking,
    pauseSpeech,
    resumeSpeech,
    stopSpeech
  } = useVoiceExplain(testText);

  const startTest = () => {
    console.log('Starting voice test with speed:', voiceSpeed);
    setTestText(testText + ' ' + Date.now()); // Force re-trigger
  };

  const testDirectSpeech = (speed: 'slow' | 'normal' | 'fast') => {
    const rates = { slow: 0.8, normal: 1.0, fast: 1.5 };
    const utterance = new SpeechSynthesisUtterance(`Testing ${speed} speed at rate ${rates[speed]}`);
    utterance.rate = rates[speed];
    utterance.pitch = 1.0;
    utterance.volume = 0.85;
    
    console.log(`🧪 Direct test: ${speed} speed, rate: ${rates[speed]}`);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Voice Speed Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Test the voice speed buttons by enabling voice, clicking "Start Test", and then changing the speed while the voice is speaking.
            </p>
            
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <Button onClick={startTest} disabled={!voiceEnabled}>
                  Start Voice Test
                </Button>
                <Button onClick={() => testDirectSpeech('slow')} variant="outline">
                  Test Slow (Direct)
                </Button>
                <Button onClick={() => testDirectSpeech('normal')} variant="outline">
                  Test Normal (Direct)
                </Button>
                <Button onClick={() => testDirectSpeech('fast')} variant="outline">
                  Test Fast (Direct)
                </Button>
              </div>
              
              <div className="p-4 bg-muted/20 rounded-lg">
                <p className="text-sm">
                  <strong>Test Text:</strong> {testText.split(' ').slice(0, 20).join(' ')}...
                </p>
              </div>
              
              <div className="p-4 bg-muted/20 rounded-lg">
                <p className="text-sm">
                  <strong>Current Status:</strong>
                </p>
                <ul className="text-sm mt-2 space-y-1">
                  <li>Voice Enabled: {voiceEnabled ? '✅ Yes' : '❌ No'}</li>
                  <li>Current Speed: {voiceSpeed} ({voiceSpeed === 'slow' ? '0.8x' : voiceSpeed === 'normal' ? '1.0x' : '1.5x'})</li>
                  <li>Is Speaking: {isSpeaking ? '🔊 Yes' : '🔇 No'}</li>
                  <li>Browser Support: {typeof window !== 'undefined' && 'speechSynthesis' in window ? '✅ Yes' : '❌ No'}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h4 className="font-semibold mb-4">Voice Controls</h4>
            <VisualizerControls
              showMemory={showMemory}
              onToggleMemory={setShowMemory}
              voiceEnabled={voiceEnabled}
              onToggleVoice={setVoiceEnabled}
              voiceSpeed={voiceSpeed}
              onVoiceSpeedChange={setVoiceSpeed}
              isSpeaking={isSpeaking}
              onPauseSpeech={pauseSpeech}
              onResumeSpeech={resumeSpeech}
              onStopSpeech={stopSpeech}
            />
          </div>

          <div className="border-t pt-6">
            <h4 className="font-semibold mb-4">Test Instructions</h4>
            <ol className="text-sm space-y-2">
              <li>1. <strong>Direct Test:</strong> Click "Test Slow/Normal/Fast (Direct)" buttons to test speech synthesis directly</li>
              <li>2. <strong>Hook Test:</strong> Enable voice by clicking the "Voice" button</li>
              <li>3. Click "Start Voice Test" to begin speaking through the hook</li>
              <li>4. While the voice is speaking, try clicking different speed buttons (Slow, Normal, Fast)</li>
              <li>5. Notice how the speech speed changes immediately</li>
              <li>6. Check the browser console for debug logs (🔘 for button clicks, 🎤 for voice events)</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
