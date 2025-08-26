import { useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ExplanationStep {
  title: string;
  description: string;
  highlight?: string;
}

interface ExplanationBoxProps {
  title?: string;
  steps: ExplanationStep[];
  currentStep?: number;
  onStepChange?: (step: number) => void;
}

export function ExplanationBox({ 
  title = "Step-by-step Explanation", 
  steps, 
  currentStep = 0,
  onStepChange 
}: ExplanationBoxProps) {
  const [activeStep, setActiveStep] = useState(currentStep);

  const nextStep = () => {
    const newStep = Math.min(activeStep + 1, steps.length - 1);
    setActiveStep(newStep);
    onStepChange?.(newStep);
  };

  const prevStep = () => {
    const newStep = Math.max(activeStep - 1, 0);
    setActiveStep(newStep);
    onStepChange?.(newStep);
  };

  const goToStep = (step: number) => {
    setActiveStep(step);
    onStepChange?.(step);
  };

  if (steps.length === 0) return null;

  return (
    <div className="bg-card border rounded-xl shadow-subtle">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          <h4 className="font-semibold text-card-foreground">{title}</h4>
        </div>
        <Badge variant="outline" className="text-xs">
          {activeStep + 1} / {steps.length}
        </Badge>
      </div>
      
      <div className="p-4">
        <div className="mb-4">
          <h5 className="font-medium text-card-foreground mb-2">
            {steps[activeStep]?.title}
          </h5>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {steps[activeStep]?.description}
          </p>
          {steps[activeStep]?.highlight && (
            <div className="mt-3 p-3 bg-animation-highlight/10 border border-animation-highlight/30 rounded-lg">
              <p className="text-sm font-medium text-foreground">
                💡 {steps[activeStep].highlight}
              </p>
            </div>
          )}
        </div>
        
        {/* Step Navigation */}
        <div className="flex items-center justify-between">
          <Button
            size="sm"
            variant="outline"
            onClick={prevStep}
            disabled={activeStep === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          
          <div className="flex gap-1">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => goToStep(index)}
                className={`
                  w-2 h-2 rounded-full transition-all duration-200
                  ${index === activeStep 
                    ? 'bg-primary shadow-glow' 
                    : 'bg-muted hover:bg-muted-foreground/50'
                  }
                `}
              />
            ))}
          </div>
          
          <Button
            size="sm"
            variant="outline"
            onClick={nextStep}
            disabled={activeStep === steps.length - 1}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}