import { Lightbulb, Code2 } from 'lucide-react';
import { VoiceNarrator } from '@/components/voice-narrator';

interface DefinitionBoxProps {
  title: string;
  definition: string;
  className?: string;
  example?: string;
  syntax?: string;
  narrationText?: string; // combined narration for definition + visualization summary
  extra?: string[]; // additional explanatory paragraphs
}

export function DefinitionBox({ title, definition, className, example, syntax, narrationText, extra = [] }: DefinitionBoxProps) {
  // Create comprehensive voice text that includes all definition content
  const createVoiceText = () => {
    if (narrationText) {
      return narrationText;
    }

    // Start with title and main definition
    let voiceText = `${title}. ${definition}`;
    
    // Clean up markdown formatting for voice
    voiceText = voiceText
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
      .replace(/\n\n/g, '. ') // Convert paragraph breaks to pauses
      .replace(/\n/g, ' ') // Convert line breaks to spaces
      .replace(/- /g, '') // Remove bullet point markers
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    // Add extra content if available
    if (extra.length > 0) {
      const extraText = extra.join('. ').replace(/\*\*(.*?)\*\*/g, '$1');
      voiceText += '. ' + extraText;
    }

    // Add example if available
    if (example) {
      const cleanExample = example.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
      voiceText += '. Example: ' + cleanExample;
    }

    // Add syntax if available
    if (syntax) {
      const cleanSyntax = syntax.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
      voiceText += '. Syntax: ' + cleanSyntax;
    }

    return voiceText;
  };

  return (
    <div className={`bg-card border rounded-xl p-4 shadow-subtle ${className || ''}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-primary" />
          <h4 className="font-semibold text-card-foreground">Definition</h4>
        </div>
        <VoiceNarrator
          label="Read complete topic definition"
          text={createVoiceText()}
          voiceGender="female"
          preferredVoiceHint="female"
          variant="compact"
          showLabel={true}
        />
      </div>
      <div className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{title}:</span>
        <div className="mt-2 space-y-3">
          {definition.split('\n\n').map((paragraph, i) => {
            if (paragraph.trim() === '') return null;
            
            // Handle the standardized format sections
            if (paragraph.startsWith('What it does:')) {
              return (
                <div key={i} className="space-y-1">
                  <span className="font-medium text-foreground text-sm">What it does:</span>
                  <p className="text-sm text-muted-foreground leading-relaxed pl-2">
                    {paragraph.replace('What it does:', '').trim()}
                  </p>
                </div>
              );
            }
            
            if (paragraph.startsWith('How it works:')) {
              return (
                <div key={i} className="space-y-1">
                  <span className="font-medium text-foreground text-sm">How it works:</span>
                  <p className="text-sm text-muted-foreground leading-relaxed pl-2">
                    {paragraph.replace('How it works:', '').trim()}
                  </p>
                </div>
              );
            }
            
            if (paragraph.startsWith('When to use:')) {
              return (
                <div key={i} className="space-y-1">
                  <span className="font-medium text-foreground text-sm">When to use:</span>
                  <p className="text-sm text-muted-foreground leading-relaxed pl-2">
                    {paragraph.replace('When to use:', '').trim()}
                  </p>
                </div>
              );
            }
            
            // Handle section headers (text starting with **)
            if (paragraph.includes('**') && (paragraph.includes(':**') || paragraph.includes('**'))) {
              const parts = paragraph.split('**');
              return (
                <div key={i} className="space-y-2">
                  {parts.map((part, j) => {
                    if (j % 2 === 1) {
                      // This is bold text - make it more prominent
                      return (
                        <h5 key={j} className="font-semibold text-foreground text-sm bg-primary/10 px-2 py-1 rounded">
                          {part}
                        </h5>
                      );
                    } else if (part.trim()) {
                      // Regular text
                      return <p key={j} className="text-sm text-muted-foreground leading-relaxed">{part}</p>;
                    }
                    return null;
                  })}
                </div>
              );
            }
            
            // Handle bullet points
            if (paragraph.includes('- ')) {
              const lines = paragraph.split('\n');
              return (
                <div key={i} className="space-y-2 bg-muted/30 p-3 rounded-lg">
                  {lines.map((line, j) => {
                    if (line.trim().startsWith('- ')) {
                      return (
                        <div key={j} className="flex items-start gap-3">
                          <span className="text-primary mt-1 font-bold">•</span>
                          <span className="text-sm text-muted-foreground leading-relaxed flex-1">
                            {line.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '$1')}
                          </span>
                        </div>
                      );
                    } else if (line.trim()) {
                      return (
                        <p key={j} className="text-sm text-muted-foreground leading-relaxed ml-6">
                          {line.replace(/\*\*(.*?)\*\*/g, '$1')}
                        </p>
                      );
                    }
                    return null;
                  })}
                </div>
              );
            }
            
            // Regular paragraph with bold text handling
            return (
              <p key={i} className="text-sm text-muted-foreground leading-relaxed">
                {paragraph.replace(/\*\*(.*?)\*\*/g, '$1')}
              </p>
            );
          })}
        </div>
      </div>

      {(example || syntax) && (
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {example && (
            <div className="p-3 rounded-lg bg-muted/40 border">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Example</span>
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{example}</p>
            </div>
          )}
          {syntax && (
            <div className="p-3 rounded-lg bg-muted/40 border">
              <div className="flex items-center gap-2 mb-2">
                <Code2 className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Syntax</span>
              </div>
              <pre className="text-xs md:text-sm text-muted-foreground overflow-auto"><code>{syntax}</code></pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


