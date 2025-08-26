import { useState } from 'react';
import { Gauge, Zap, Clock, Turtle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface SpeedControlProps {
  onSpeedChange: (speed: number) => void;
  initialSpeed?: number;
}

export function SpeedControl({ onSpeedChange, initialSpeed = 1000 }: SpeedControlProps) {
  const [speed, setSpeed] = useState(initialSpeed);

  const speedPresets = [
    { label: 'Turtle', icon: Turtle, value: 2000, color: 'text-green-600' },
    { label: 'Normal', icon: Clock, value: 1000, color: 'text-blue-600' },
    { label: 'Fast', icon: Gauge, value: 500, color: 'text-orange-600' },
    { label: 'Lightning', icon: Zap, value: 200, color: 'text-red-600' }
  ];

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    onSpeedChange(newSpeed);
  };

  const getSpeedLabel = (speedValue: number) => {
    if (speedValue >= 1800) return 'Very Slow';
    if (speedValue >= 1200) return 'Slow';
    if (speedValue >= 800) return 'Normal';
    if (speedValue >= 400) return 'Fast';
    return 'Very Fast';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
      <div className="flex items-center gap-2 mb-3">
        <Gauge className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-medium">Animation Speed</span>
        <span className="text-xs text-muted-foreground">({getSpeedLabel(speed)})</span>
      </div>

      {/* Speed Presets */}
      <div className="flex gap-2 mb-4">
        {speedPresets.map((preset) => (
          <Button
            key={preset.label}
            variant={speed === preset.value ? "default" : "outline"}
            size="sm"
            onClick={() => handleSpeedChange(preset.value)}
            className="flex items-center gap-1"
          >
            <preset.icon className={`h-3 w-3 ${preset.color}`} />
            <span className="text-xs">{preset.label}</span>
          </Button>
        ))}
      </div>

      {/* Custom Speed Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Fast</span>
          <span>Slow</span>
        </div>
        <Slider
          value={[speed]}
          onValueChange={(value) => handleSpeedChange(value[0])}
          max={2000}
          min={100}
          step={100}
          className="w-full"
        />
      </div>

      <div className="mt-3 text-xs text-muted-foreground text-center">
        💡 Tip: Use slower speeds to better understand each step!
      </div>
    </div>
  );
}