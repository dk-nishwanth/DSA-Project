import { ReactNode } from 'react';
import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface HintTooltipProps {
  hint: string;
  children?: ReactNode;
  icon?: boolean;
}

export function HintTooltip({ hint, children, icon = true }: HintTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children || (
            <button className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
              {icon && <HelpCircle className="h-4 w-4" />}
            </button>
          )}
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="max-w-xs p-3 bg-popover border border-border shadow-lg"
        >
          <p className="text-sm text-popover-foreground">{hint}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}