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
  
  // ✅ Vibrant colors for badges
  const getComplexityColor = (complexity: string) => {
    if (complexity.includes('O(1)')) return 'bg-green-600 text-white';
    if (complexity.includes('O(log n)')) return 'bg-teal-500 text-white';
    if (complexity.includes('O(n)')) return 'bg-yellow-500 text-black';
    if (complexity.includes('O(n log n)')) return 'bg-orange-500 text-white';
    if (complexity.includes('O(n²)') || complexity.includes('O(n^2)')) return 'bg-red-600 text-white';
    return 'bg-gray-500 text-white';
  };

  // ✅ Soft background colors for sections
  const getRowBackground = (label: string) => {
    if (label === "Time Complexity") return "bg-gradient-to-r from-green-50 to-green-100";
    if (label === "Space Complexity") return "bg-gradient-to-r from-blue-50 to-blue-100";
    return "bg-gray-50";
  };

  return (
    <div className="bg-card border rounded-xl p-4 shadow-lg">
      <div className="flex items-center gap-2 mb-3">
        <Info className="h-4 w-4 text-primary" />
        <h4 className="font-semibold text-card-foreground">{title}</h4>
      </div>
      
      {description && (
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
      )}
      
      <div className="space-y-3">
        {/* Time Complexity */}
        <div className={`flex items-center justify-between p-2 rounded-lg ${getRowBackground("Time Complexity")}`}>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-gray-800">Time Complexity</span>
          </div>
          <Badge 
            className={`font-mono text-xs ${getComplexityColor(timeComplexity)}`}
          >
            {timeComplexity}
          </Badge>
        </div>
        
        {/* Space Complexity */}
        <div className={`flex items-center justify-between p-2 rounded-lg ${getRowBackground("Space Complexity")}`}>
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-gray-800">Space Complexity</span>
          </div>
          <Badge 
            className={`font-mono text-xs ${getComplexityColor(spaceComplexity)}`}
          >
            {spaceComplexity}
          </Badge>
        </div>
      </div>
    </div>
  );
}
