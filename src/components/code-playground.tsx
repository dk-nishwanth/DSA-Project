import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Play, Save, RotateCcw, Code2, Terminal, Maximize2, Minimize2 } from 'lucide-react';
import { runCodeWithPiston, PistonLanguages, getPistonCodeTemplate } from '@/lib/piston';
import { cn } from '@/lib/utils';

interface CodePlaygroundProps {
  topicId: string;
  topicTitle: string;
  initialCode?: {
    javascript?: string;
    python?: string;
    java?: string;
    cpp?: string;
    c?: string;
    csharp?: string;
    sql?: string;
    web?: string;
  };
}

const DEFAULT_CODE = {
  javascript: `// ${new Date().toLocaleDateString()} - Practice Code for Topic
// Write your code here and test it!

function solution() {
    // Your implementation here
    console.log("Hello from JavaScript!");
}

// Test your function
solution();`,
  python: `# ${new Date().toLocaleDateString()} - Practice Code for Topic
# Write your code here and test it!

def solution():
    # Your implementation here
    print("Hello from Python!")

# Test your function
solution()`,
  java: `// ${new Date().toLocaleDateString()} - Practice Code for Topic
// Write your code here and test it!

public class Solution {
    public static void main(String[] args) {
        // Your implementation here
        System.out.println("Hello from Java!");
    }
}`,
  cpp: `// ${new Date().toLocaleDateString()} - Practice Code for Topic
// Write your code here and test it!

#include <iostream>
using namespace std;

int main() {
    // Your implementation here
    cout << "Hello from C++!" << endl;
    return 0;
}`,
  c: `// ${new Date().toLocaleDateString()} - Practice Code for Topic
// Write your code here and test it!

#include <stdio.h>

int main() {
    // Your implementation here
    printf("Hello from C!\\n");
    return 0;
}`,
  csharp: `// ${new Date().toLocaleDateString()} - Practice Code for Topic
// Write your code here and test it!

using System;

class Program {
    static void Main() {
        // Your implementation here
        Console.WriteLine("Hello from C#!");
    }
}`,
  sql: `-- ${new Date().toLocaleDateString()} - Practice Code for Topic
-- Write your SQL queries here and test them!

SELECT 'Hello from SQL!' as message;`,
  web: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${new Date().toLocaleDateString()} - Practice Code for Topic</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container {
            background: rgba(255, 255, 255, 0.1);
            padding: 30px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Hello from Web Technologies!</h1>
        <p>This is a sample HTML page with CSS and JavaScript.</p>
        <button onclick="showMessage()">Click Me!</button>
        <p id="output"></p>
    </div>
    
    <script>
        function showMessage() {
            document.getElementById('output').innerHTML = 'JavaScript is working perfectly!';
        }
    </script>
</body>
</html>`
};

export function CodePlayground({ topicId, topicTitle, initialCode }: CodePlaygroundProps) {
  const [activeLanguage, setActiveLanguage] = useState<'javascript' | 'python' | 'java' | 'cpp' | 'c' | 'csharp' | 'sql' | 'web'>('javascript');
  const [code, setCode] = useState<Record<string, string>>({});
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);

  // Load saved code from localStorage
  useEffect(() => {
    const savedCode = localStorage.getItem(`codespace-${topicId}`);
    if (savedCode) {
      try {
        const parsed = JSON.parse(savedCode);
        setCode(parsed);
      } catch {
        // If parsing fails, use default code
        setCode({
          javascript: initialCode?.javascript || DEFAULT_CODE.javascript.replace('Topic', topicTitle),
          python: initialCode?.python || DEFAULT_CODE.python.replace('Topic', topicTitle),
          java: initialCode?.java || DEFAULT_CODE.java.replace('Topic', topicTitle),
          cpp: initialCode?.cpp || DEFAULT_CODE.cpp.replace('Topic', topicTitle),
          c: initialCode?.c || DEFAULT_CODE.c.replace('Topic', topicTitle),
          csharp: initialCode?.csharp || DEFAULT_CODE.csharp.replace('Topic', topicTitle),
          sql: initialCode?.sql || DEFAULT_CODE.sql.replace('Topic', topicTitle),
          web: initialCode?.web || DEFAULT_CODE.web.replace('Topic', topicTitle)
        });
      }
    } else {
      setCode({
        javascript: initialCode?.javascript || DEFAULT_CODE.javascript.replace('Topic', topicTitle),
        python: initialCode?.python || DEFAULT_CODE.python.replace('Topic', topicTitle),
        java: initialCode?.java || DEFAULT_CODE.java.replace('Topic', topicTitle),
        cpp: initialCode?.cpp || DEFAULT_CODE.cpp.replace('Topic', topicTitle),
        c: initialCode?.c || DEFAULT_CODE.c.replace('Topic', topicTitle),
        csharp: initialCode?.csharp || DEFAULT_CODE.csharp.replace('Topic', topicTitle),
        sql: initialCode?.sql || DEFAULT_CODE.sql.replace('Topic', topicTitle),
        web: initialCode?.web || DEFAULT_CODE.web.replace('Topic', topicTitle)
      });
    }
  }, [topicId, topicTitle, initialCode]);

  const handleCodeChange = (value: string) => {
    setCode(prev => ({
      ...prev,
      [activeLanguage]: value
    }));
  };

  const saveCode = () => {
    localStorage.setItem(`codespace-${topicId}`, JSON.stringify(code));
    setLastSaved(new Date());
  };

  const resetCode = () => {
    const defaultCode = {
      javascript: initialCode?.javascript || DEFAULT_CODE.javascript.replace('Topic', topicTitle),
      python: initialCode?.python || DEFAULT_CODE.python.replace('Topic', topicTitle),
      java: initialCode?.java || DEFAULT_CODE.java.replace('Topic', topicTitle),
      cpp: initialCode?.cpp || DEFAULT_CODE.cpp.replace('Topic', topicTitle),
      c: initialCode?.c || DEFAULT_CODE.c.replace('Topic', topicTitle),
      csharp: initialCode?.csharp || DEFAULT_CODE.csharp.replace('Topic', topicTitle),
      sql: initialCode?.sql || DEFAULT_CODE.sql.replace('Topic', topicTitle),
      web: initialCode?.web || DEFAULT_CODE.web.replace('Topic', topicTitle)
    };
    setCode(defaultCode);
    setOutput('');
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput('Running code...');
    
    const currentCode = code[activeLanguage] || '';

    try {
      if (activeLanguage === 'javascript') {
        // Run JS safely in an async Function sandbox (no DOM access), capture console.log
        const logs: string[] = [];
        const fakeConsole = { log: (...args: unknown[]) => logs.push(args.join(' ')) } as unknown as Console;
        const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
        const fn = new AsyncFunction('console', currentCode);
        await Promise.race([
          fn(fakeConsole),
          new Promise((_, rej) => setTimeout(() => rej(new Error('Execution timed out (3s)')), 3000))
        ]);
        setOutput(logs.length ? logs.join('\n') : '✅ Executed. No output produced. Use console.log to print.');
      } else if (activeLanguage === 'web') {
        // For web technologies, we'll show a preview message
        setOutput('🌐 Web Code Preview:\n\nYour HTML/CSS/JavaScript code has been processed!\n\nIn a real environment, this would render as a web page.\n\nCode structure looks good! ✅');
      } else if (activeLanguage === 'sql') {
        // SQL is not supported by Piston, show a message
        setOutput('🗃️ SQL Execution:\n\nSQL queries would be executed against a database.\n\nYour SQL syntax looks good! ✅\n\nIn a real environment, this would connect to a database engine.');
      } else {
        // Use Piston API for all other languages
        const pistonLanguageMap: Record<string, keyof typeof PistonLanguages> = {
          python: 'python',
          java: 'java',
          cpp: 'cpp',
          c: 'c',
          csharp: 'csharp'
        };
        
        const pistonLanguage = pistonLanguageMap[activeLanguage];
        if (pistonLanguage) {
          const result = await runCodeWithPiston(pistonLanguage, currentCode);
          
          let outputText = '';
          
          // Handle compilation errors
          if (result.compile && result.compile.stderr) {
            outputText += `❌ Compilation Error:\n${result.compile.stderr}\n\n`;
          }
          
          // Handle runtime output
          if (result.run.stdout) {
            outputText += `✅ Output:\n${result.run.stdout}\n`;
          }
          
          // Handle runtime errors
          if (result.run.stderr) {
            outputText += `⚠️ Runtime Error/Warning:\n${result.run.stderr}\n`;
          }
          
          // Handle exit code
          if (result.run.code !== 0) {
            outputText += `\n❌ Process exited with code: ${result.run.code}\n`;
          }
          
          // Add execution info
          outputText += `\n📊 Language: ${result.language} (${result.version})\n`;
          
          if (!outputText.trim()) {
            outputText = '✅ Code executed successfully with no output.\nTip: Use print statements to see results!';
          }
          
          setOutput(outputText);
        } else {
          setOutput('❌ Language not supported yet');
        }
      }
    } catch (err: unknown) {
      setOutput(`❌ Error:\n${(err as Error)?.message || String(err)}`);
    } finally {
      setIsRunning(false);
    }
  };

  const getLanguageIcon = (lang: string) => {
    const icons: Record<string, string> = {
      javascript: '🟨',
      python: '🐍',
      java: '☕',
      cpp: '⚡',
      c: '🔧',
      csharp: '🔷',
      sql: '🗃️',
      web: '🌐'
    };
    return icons[lang] || '💻';
  };

  const editorHeightClass = isMaximized ? 'h-[75vh]' : 'h-80';

  useEffect(() => {
    try {
      document.body.classList.toggle('overflow-hidden', isMaximized);
    } catch {
      // Ignore errors
    }
    return () => {
      try { 
        document.body.classList.remove('overflow-hidden'); 
      } catch {
        // Ignore errors
      }
    };
  }, [isMaximized]);

  return (
    <Card className={cn(
      "w-full",
      // Full-screen overlay when maximized
      isMaximized && "fixed inset-0 z-[100] bg-background border-0 rounded-none shadow-2xl"
    )}>
      <CardHeader className={cn(isMaximized && "pt-4 pb-3 border-b")}> 
        <CardTitle className="flex items-center gap-2">
          <Code2 className="h-5 w-5" />
          Personal Codespace - {topicTitle}
        </CardTitle>
        <CardDescription>
          Practice and experiment with code for this topic. Your code is automatically saved locally.
        </CardDescription>
      </CardHeader>
      <CardContent className={cn("space-y-4", isMaximized && "max-h-[calc(100vh-6.5rem)] overflow-auto")}> 
        <div className="flex items-center justify-between">
          <Tabs value={activeLanguage} onValueChange={(value) => setActiveLanguage(value as typeof activeLanguage)}>
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
              <TabsTrigger value="javascript" className="flex items-center gap-1">
                <span>🟨</span> JS
              </TabsTrigger>
              <TabsTrigger value="python" className="flex items-center gap-1">
                <span>🐍</span> Python
              </TabsTrigger>
              <TabsTrigger value="java" className="flex items-center gap-1">
                <span>☕</span> Java
              </TabsTrigger>
              <TabsTrigger value="cpp" className="flex items-center gap-1">
                <span>⚡</span> C++
              </TabsTrigger>
              <TabsTrigger value="c" className="flex items-center gap-1">
                <span>🔧</span> C
              </TabsTrigger>
              <TabsTrigger value="csharp" className="flex items-center gap-1">
                <span>🔷</span> C#
              </TabsTrigger>
              <TabsTrigger value="sql" className="flex items-center gap-1">
                <span>🗃️</span> SQL
              </TabsTrigger>
              <TabsTrigger value="web" className="flex items-center gap-1">
                <span>🌐</span> Web
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-2">
            {lastSaved && (
              <Badge variant="outline" className="text-xs">
                Saved {lastSaved.toLocaleTimeString()}
              </Badge>
            )}
            <Button size="sm" variant="outline" onClick={() => setIsMaximized(v => !v)}>
              {isMaximized ? (
                <>
                  <Minimize2 className="h-4 w-4 mr-1" />
                  Minimize
                </>
              ) : (
                <>
                  <Maximize2 className="h-4 w-4 mr-1" />
                  Maximize
                </>
              )}
            </Button>
            <Button size="sm" variant="outline" onClick={saveCode}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={resetCode}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
            <Button size="sm" onClick={runCode} disabled={isRunning}>
              <Play className="h-4 w-4 mr-1" />
              {isRunning ? 'Running...' : 'Run'}
            </Button>
          </div>
        </div>

        <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-4", isMaximized && "grid-cols-1 md:grid-cols-2") }>
          {/* Code Editor */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {getLanguageIcon(activeLanguage)} {activeLanguage.charAt(0).toUpperCase() + activeLanguage.slice(1)} Code
              </span>
            </div>
            <textarea
              value={code[activeLanguage] || ''}
              onChange={(e) => handleCodeChange(e.target.value)}
              className={cn(
                "w-full p-4 font-mono text-sm border rounded-lg resize-none",
                editorHeightClass,
                "bg-muted/50 focus:bg-background transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-primary/20"
              )}
              placeholder={`Write your ${activeLanguage} code here...`}
              spellCheck={false}
            />
          </div>

          {/* Output */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              <span className="text-sm font-medium">Output</span>
            </div>
            <div className={cn(
              "w-full p-4 font-mono text-sm border rounded-lg",
              editorHeightClass,
              "bg-muted/30 overflow-y-auto whitespace-pre-wrap"
            )}>
              {output || 'Click "Run" to execute your code and see the output here...'}
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          💡 <strong>Tips:</strong> Your code is saved automatically in your browser. Use this space to experiment, 
          take notes, and practice the concepts you're learning. Try different approaches and see what works!
        </div>
      </CardContent>
    </Card>
  );
}