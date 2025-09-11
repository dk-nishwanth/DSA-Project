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
  return (
    <div className={`bg-card border rounded-xl p-4 shadow-subtle ${className || ''}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-primary" />
          <h4 className="font-semibold text-card-foreground">Definition</h4>
        </div>
        <VoiceNarrator
          label="Read topic definition and overview"
          text={(
            narrationText 
              || (
                `${title}. ${definition}` 
                + (extra.length ? '. ' + extra.join(' ') : '')
                + (example ? '. Example: ' + example.replace(/\n/g, ' ') : '')
                + (syntax ? '. Syntax: ' + syntax.replace(/\n/g, ' ') : '')
              )
          )}
          voiceGender="female"
          preferredVoiceHint="female"
          variant="compact"
          showLabel={true}
        />
      </div>
      <p className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{title}:</span> {definition}
      </p>

      {extra.length > 0 && (
        <div className="mt-3 space-y-2">
          {extra.map((p, i) => (
            <p key={i} className="text-sm text-muted-foreground">{p}</p>
          ))}
        </div>
      )}

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


