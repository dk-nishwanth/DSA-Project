import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

export interface VisualizationStep {
  id: string;
  title: string;
  description: string;
  code?: string;
  highlight?: number[];
  data: any;
  complexity?: {
    time: string;
    space: string;
  };
}

interface StepByStepBaseProps {
  steps: VisualizationStep[];
  onStepChange?: (step: VisualizationStep, index: number) => void;
  children: (currentStep: VisualizationStep, stepIndex: number) => React.ReactNode;
  title: string;
  initialSpeed?: number;
}

export function StepByStepBase({ 
  steps, 
  onStepChange, 
  children, 
  title,
  initialSpeed = 1000 
}: StepByStepBaseProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed);
  const [showControls, setShowControls] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentStep = steps[currentStepIndex] || steps[0];

  useEffect(() => {
    if (onStepChange && currentStep) {
      onStepChange(currentStep, currentStepIndex);
    }
    if (currentStep) {
      const description = (currentStep as any)?.description || '';
      const title = (currentStep as any)?.title || '';
      const highlight = (currentStep as any)?.highlight || '';
      const narrationText = [title, description, highlight].filter(Boolean).join('. ') + (highlight ? '.' : '');
      
      // Dispatch event with controlled timing flag
      const event = new CustomEvent('visualization_step', {
        detail: {
          description,
          title,
          highlight,
          narrationText,
          useControlledTiming: true, // Flag for voice system to use independent timing
          stepIndex: currentStepIndex,
          totalSteps: steps.length
        }
      });
      window.dispatchEvent(event);
    }
  }, [currentStepIndex, currentStep, onStepChange, steps.length]);

  useEffect(() => {
    if (isPlaying && steps.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, speed, steps.length]);

  const handlePlay = () => {
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
    }
    setIsPlaying(true);
    // Announce current step when playback starts (user gesture → allowed to speak)
    const step = steps[Math.max(0, currentStepIndex)] || steps[0];
    if (step) {
      const description = (step as any)?.description || '';
      const title = (step as any)?.title || '';
      const highlight = (step as any)?.highlight || '';
      const narrationText = [title, description, highlight].filter(Boolean).join('. ') + (highlight ? '.' : '');
      const event = new CustomEvent('visualization_step', {
        detail: { description, title, highlight, narrationText, play: true }
      });
      window.dispatchEvent(event);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handlePrevious = () => {
    setIsPlaying(false);
    setCurrentStepIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentStepIndex(prev => Math.min(steps.length - 1, prev + 1));
  };

  const handleStepClick = (index: number) => {
    setIsPlaying(false);
    setCurrentStepIndex(index);
  };

  const getSpeedLabel = (speedValue: number) => {
    if (speedValue >= 2000) return 'Very Slow';
    if (speedValue >= 1500) return 'Slow';
    if (speedValue >= 1000) return 'Normal';
    if (speedValue >= 500) return 'Fast';
    return 'Very Fast';
  };

  const speedPresets = [
    { label: '🐌', value: 2000, name: 'Very Slow' },
    { label: '🚶', value: 1500, name: 'Slow' },
    { label: '🏃', value: 1000, name: 'Normal' },
    { label: '🏃‍♂️', value: 500, name: 'Fast' },
    { label: '⚡', value: 200, name: 'Very Fast' }
  ];

  if (steps.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No steps available for visualization</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowControls(!showControls)}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {/* Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 border space-y-4"
          >
            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                disabled={currentStepIndex === 0 && !isPlaying}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={currentStepIndex === 0}
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              
              <Button
                onClick={isPlaying ? handlePause : handlePlay}
                disabled={steps.length === 0}
                className="px-6"
              >
                {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={currentStepIndex >= steps.length - 1}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            {/* Speed Control */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Speed: {getSpeedLabel(speed)}</span>
                <div className="flex gap-1">
                  {speedPresets.map((preset) => (
                    <Button
                      key={preset.value}
                      variant={speed === preset.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSpeed(preset.value)}
                      className="px-2 py-1 text-xs"
                      title={preset.name}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>
              
              <Slider
                value={[speed]}
                onValueChange={(value) => setSpeed(value[0])}
                max={2000}
                min={200}
                step={100}
                className="w-full"
              />
            </div>

            {/* Step Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Step {currentStepIndex + 1} of {steps.length}</span>
                <Badge variant="outline">
                  {Math.round(((currentStepIndex + 1) / steps.length) * 100)}% Complete
                </Badge>
              </div>
              
              <div className="flex gap-1 overflow-x-auto pb-2">
                {steps.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(index)}
                    className={`flex-shrink-0 w-8 h-8 rounded-full text-xs font-medium transition-all ${
                      index === currentStepIndex
                        ? 'bg-blue-500 text-white scale-110'
                        : index < currentStepIndex
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                    title={step.title}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current Step Info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-semibold text-blue-800 dark:text-blue-200">
            {currentStep.title}
          </h4>
          {currentStep.complexity && (
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs">
                Time: {currentStep.complexity.time}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Space: {currentStep.complexity.space}
              </Badge>
            </div>
          )}
        </div>
        <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
          {currentStep.description}
        </p>
        
        {currentStep.code && (
          <div className="bg-gray-900 rounded p-3 text-sm font-mono text-green-400 overflow-x-auto">
            <pre>{currentStep.code}</pre>
          </div>
        )}
      </div>

      {/* Visualization Content */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl p-6 border-2 border-dashed border-gray-200 dark:border-gray-700">
        {children(currentStep, currentStepIndex)}
      </div>

      {/* Step Navigation Footer */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          {currentStepIndex > 0 && (
            <span>Previous: {steps[currentStepIndex - 1]?.title}</span>
          )}
        </div>
        <div>
          {currentStepIndex < steps.length - 1 && (
            <span>Next: {steps[currentStepIndex + 1]?.title}</span>
          )}
        </div>
      </div>
    </div>
  );
}