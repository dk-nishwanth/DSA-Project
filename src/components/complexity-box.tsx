import { Clock, Gauge, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ComplexityBoxProps {
  timeComplexity: string;
  spaceComplexity: string;
  title?: string;
  description?: string;
}

export function ComplexityBox({ 
  timeComplexity, 
  spaceComplexity, 
  title = "Complexity Analysis",
  description
}: ComplexityBoxProps) {
  const getComplexityColor = (complexity: string) => {
    if (complexity.includes('O(1)')) return 'success';
    if (complexity.includes('O(log n)')) return 'success';
    if (complexity.includes('O(n)')) return 'warning';
    if (complexity.includes('O(n log n)')) return 'warning';
    if (complexity.includes('O(n²)') || complexity.includes('O(n^2)')) return 'destructive';
    return 'secondary';
  };

  return (
    <div className="bg-card border rounded-xl p-4 shadow-subtle">
      <div className="flex items-center gap-2 mb-3">
        <Info className="h-4 w-4 text-primary" />
        <h4 className="font-semibold text-card-foreground">{title}</h4>
      </div>
      
      {description && (
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
      )}
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Time Complexity</span>
          </div>
          <Badge 
            variant={getComplexityColor(timeComplexity) as any}
            className="font-mono text-xs"
          >
            {timeComplexity}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Space Complexity</span>
          </div>
          <Badge 
            variant={getComplexityColor(spaceComplexity) as any}
            className="font-mono text-xs"
          >
            {spaceComplexity}
          </Badge>
        </div>
      </div>
    </div>
  );
}