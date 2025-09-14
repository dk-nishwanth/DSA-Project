import { useState } from 'react';
import { Code, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CodeSnippetBoxProps {
  title: string;
  language: 'javascript' | 'python' | 'java' | 'c';
  code: string;
  description?: string;
  implementations?: {
    javascript?: string;
    python?: string;
    java?: string;
    c?: string;
  };
  topicId?: string;
}

export function CodeSnippetBox({ title, language, code, description, implementations, topicId }: CodeSnippetBoxProps) {
  const [copied, setCopied] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'javascript' | 'python' | 'java' | 'c'>(language);
  const [currentCode, setCurrentCode] = useState(code);

  // Get available languages
  const availableLanguages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'c', label: 'C' }
  ].filter(lang => {
    if (lang.value === language) return true;
    return implementations && implementations[lang.value as keyof typeof implementations];
  });

  const handleLanguageChange = (value: string) => {
    const newLang = value as 'javascript' | 'python' | 'java' | 'c';
    setCurrentLanguage(newLang);
    
    if (newLang === language) {
      setCurrentCode(code);
    } else if (implementations && implementations[newLang]) {
      setCurrentCode(implementations[newLang] || '');
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-card border rounded-xl p-4 shadow-subtle">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Code className="h-4 w-4 text-primary" />
          <h4 className="font-semibold text-card-foreground">{title}</h4>
        </div>
        <div className="flex items-center gap-2">
          {availableLanguages.length > 1 && (
            <Select value={currentLanguage} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[120px] h-8">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                {availableLanguages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {availableLanguages.length <= 1 && (
            <Badge variant="outline" className="text-xs">
              {currentLanguage}
            </Badge>
          )}
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
      </div>
      
      {description && (
        <p className="text-sm text-muted-foreground mb-3">{description}</p>
      )}
      
      <div className="bg-muted/30 rounded-lg p-4 overflow-x-auto">
        <pre className="text-sm text-foreground font-mono whitespace-pre-wrap">
          <code>{currentCode}</code>
        </pre>
      </div>
    </div>
  );
}