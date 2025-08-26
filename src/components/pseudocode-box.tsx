import { useState } from 'react';
import { Code2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PseudocodeBoxProps {
  title?: string;
  code: string[];
  highlightedLine?: number;
}

export function PseudocodeBox({ 
  title = "Pseudocode", 
  code, 
  highlightedLine = -1 
}: PseudocodeBoxProps) {
  return (
    <div className="bg-card border rounded-xl shadow-subtle overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-primary" />
          <h4 className="font-semibold text-card-foreground">{title}</h4>
        </div>
        <Button size="sm" variant="ghost" className="h-6 px-2">
          <Play className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="p-4">
        <div className="font-mono text-sm space-y-1">
          {code.map((line, index) => (
            <div
              key={index}
              className={`
                flex items-center gap-3 px-2 py-1 rounded transition-all duration-200
                ${highlightedLine === index 
                  ? 'bg-animation-highlight text-foreground shadow-sm animate-pulse-highlight' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }
              `}
            >
              <span className="text-xs text-muted-foreground/60 w-6 text-right select-none">
                {index + 1}
              </span>
              <span className="flex-1">{line}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}