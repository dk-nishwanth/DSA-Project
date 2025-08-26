import { useState } from 'react';
import { Code, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CodeSnippetBoxProps {
  title: string;
  language: 'javascript' | 'python';
  code: string;
  description?: string;
}

export function CodeSnippetBox({ title, language, code, description }: CodeSnippetBoxProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-card border rounded-xl p-4 shadow-subtle">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Code className="h-4 w-4 text-primary" />
          <h4 className="font-semibold text-card-foreground">{title}</h4>
          <Badge variant="outline" className="text-xs">
            {language}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8 w-8 p-0"
        >
          {copied ? (
            <Check className="h-3 w-3 text-success" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>
      </div>
      
      {description && (
        <p className="text-sm text-muted-foreground mb-3">{description}</p>
      )}
      
      <div className="bg-muted/30 rounded-lg p-4 overflow-x-auto">
        <pre className="text-sm text-foreground font-mono whitespace-pre-wrap">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}