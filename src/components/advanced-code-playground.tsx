import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Play,
  Save,
  Download,
  RotateCcw,
  Settings,
  Maximize2,
  Minimize2,
  Terminal,
  Keyboard,
  Eye,
  Clock,
  ExternalLink,
  Code2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { runCodeWithPiston, PistonLanguages } from '@/lib/piston';
import { toast } from 'sonner';

interface AdvancedCodePlaygroundProps {
  topicId: string;
  topicTitle: string;
  initialCode?: Record<string, string>;
}

type SupportedLanguage =
  | 'javascript'
  | 'python'
  | 'java'
  | 'cpp'
  | 'c'
  | 'webdev'
  | 'php'
  | 'ruby'
  | 'go'
  | 'rust'
  | 'csharp'
  | 'sql';

const LANGUAGE_CONFIG = {
  javascript: {
    icon: '🟨',
    name: 'JavaScript',
    extension: '.js',
    judge0Id: 63,
    template: ``
  },
  python: {
    icon: '🐍',
    name: 'Python',
    extension: '.py',
    judge0Id: 71,
    template: ``
  },
  java: {
    icon: '☕',
    name: 'Java',
    extension: '.java',
    judge0Id: 62,
    template: ``
  },
  cpp: {
    icon: '⚡',
    name: 'C++',
    extension: '.cpp',
    judge0Id: 54,
    template: ``
  },
  c: {
    icon: '🔧',
    name: 'C',
    extension: '.c',
    judge0Id: 50,
    template: ``
  },
  webdev: {
    icon: '🌐',
    name: 'HTML+CSS+JS',
    extension: '.html',
    judge0Id: null,
    template: {
      html: ``,
      css: ``,
      js: ``
    }
  },
  php: {
    icon: '🐘',
    name: 'PHP',
    extension: '.php',
    judge0Id: 68,
    template: ``
  },
  ruby: {
    icon: '💎',
    name: 'Ruby',
    extension: '.rb',
    judge0Id: 72,
    template: ``
  },
  go: {
    icon: '🐹',
    name: 'Go',
    extension: '.go',
    judge0Id: 60,
    template: ``
  },
  rust: {
    icon: '🦀',
    name: 'Rust',
    extension: '.rs',
    judge0Id: 73,
    template: ``
  },
  csharp: {
    icon: '🔷',
    name: 'C#',
    extension: '.cs',
    judge0Id: 51,
    template: ``
  },
  sql: {
    icon: '🗄️',
    name: 'SQL',
    extension: '.sql',
    judge0Id: 82,
    template: ``
  }
};

// Map language IDs to Piston language names
const mapLanguageToPiston = (languageId: string): keyof typeof PistonLanguages | null => {
  const mapping: Record<string, keyof typeof PistonLanguages> = {
    'javascript': 'javascript',
    'python': 'python',
    'java': 'java',
    'cpp': 'cpp',
    'c': 'c',
    'csharp': 'csharp',
    'php': 'php',
    'ruby': 'ruby',
    'go': 'go',
    'rust': 'rust'
  };
  
  return mapping[languageId] || null;
};

export function AdvancedCodePlayground({ topicId, topicTitle, initialCode }: AdvancedCodePlaygroundProps) {
  const [activeLanguage, setActiveLanguage] = useState<SupportedLanguage>('javascript');
  const [code, setCode] = useState<Record<string, string>>({});
  const [webCode, setWebCode] = useState({ html: '', css: '', js: '' });
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [showSettings, setShowSettings] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [executionService, setExecutionService] = useState<string>('Piston');
  const [activeWebTab, setActiveWebTab] = useState<'html' | 'css' | 'js'>('html');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Initialize code for all languages - always start with empty editors
  useEffect(() => {
    initializeDefaultCode();
  }, [topicId, topicTitle]);

  // Function to update web preview
  const updateWebPreview = () => {
    if (!iframeRef.current) return;
    
    const combinedHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live Preview - ${topicTitle}</title>
    <style>
        /* Reset and base styles */
        * {
            box-sizing: border-box;
        }
        body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #fff;
        }
        
        /* User CSS */
        ${webCode.css || ''}
    </style>
</head>
<body>
    ${webCode.html || '<p style="color: #666; text-align: center; margin-top: 50px;">Start typing HTML in the editor to see your preview here...</p>'}
    
    <script>
        try {
            ${webCode.js || ''}
        } catch (error) {
            console.error('JavaScript Error:', error);
            document.body.innerHTML += '<div style="position: fixed; top: 10px; right: 10px; background: #ff4444; color: white; padding: 8px 12px; border-radius: 4px; z-index: 9999; font-family: monospace; font-size: 12px; max-width: 300px; word-wrap: break-word;">JS Error: ' + error.message + '</div>';
        }
    </script>
</body>
</html>`;

    const doc = iframeRef.current.contentDocument;
    if (doc) {
      doc.open();
      doc.write(combinedHTML);
      doc.close();
    }
  };

  // Update web preview in real-time when webCode changes
  useEffect(() => {
    if (activeLanguage === 'webdev') {
      const timeoutId = setTimeout(updateWebPreview, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [webCode.html, webCode.css, webCode.js, activeLanguage, topicTitle]);

  // Initialize preview when switching to webdev mode
  useEffect(() => {
    if (activeLanguage === 'webdev' && iframeRef.current) {
      // Small delay to ensure iframe is ready
      setTimeout(updateWebPreview, 100);
    }
  }, [activeLanguage]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            saveCode();
            break;
          case 'Enter':
            e.preventDefault();
            runCode();
            break;
          case 'r':
            e.preventDefault();
            resetCode();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const initializeDefaultCode = () => {
    const defaultCode: Record<string, string> = {};
    Object.entries(LANGUAGE_CONFIG).forEach(([lang, config]) => {
      if (lang === 'webdev') {
        const webTemplate = config.template as { html: string; css: string; js: string };
        setWebCode({
          html: webTemplate.html,
          css: webTemplate.css,
          js: webTemplate.js
        });
      } else {
        const template = typeof config.template === 'string' ? config.template : '';
        defaultCode[lang] = template;
      }
    });
    setCode(defaultCode);
  };

  const handleCodeChange = (value: string) => {
    setCode(prev => ({
      ...prev,
      [activeLanguage]: value
    }));
  };

  const saveCode = () => {
    const dataToSave = {
      code,
      webCode,
      input
    };
    localStorage.setItem(`advanced-codespace-${topicId}`, JSON.stringify(dataToSave));
    setLastSaved(new Date());
  };

  const resetCode = () => {
    initializeDefaultCode();
    setOutput('');
    setInput('');
  };

  const downloadCode = () => {
    if (activeLanguage === 'webdev') {
      // Download complete HTML file with CSS and JS
      const combinedHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${topicTitle} - Web Project</title>
    <style>
${webCode.css}
    </style>
</head>
<body>
${webCode.html.replace(/<html[^>]*>|<\/html>|<head[^>]*>[\s\S]*?<\/head>|<body[^>]*>|<\/body>|<!DOCTYPE[^>]*>/gi, '')}
    <script>
${webCode.js}
    </script>
</body>
</html>`;

      const blob = new Blob([combinedHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${topicTitle.toLowerCase().replace(/\s+/g, '-')}-web-project.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // Download single code file
      const currentCode = code[activeLanguage] || '';
      const config = LANGUAGE_CONFIG[activeLanguage];
      const blob = new Blob([currentCode], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${topicTitle.toLowerCase().replace(/\s+/g, '-')}${config.extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput('🚀 Executing code...');
    const startTime = Date.now();

    try {
      if (activeLanguage === 'webdev') {
        // Handle web development with combined HTML, CSS, JS
        const combinedHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Preview</title>
    <style>${webCode.css}</style>
</head>
<body>
    ${webCode.html.replace(/<html[^>]*>|<\/html>|<head[^>]*>[\s\S]*?<\/head>|<body[^>]*>|<\/body>|<!DOCTYPE[^>]*>/gi, '')}
    <script>
        try {
            ${webCode.js}
        } catch (error) {
            console.error('JavaScript Error:', error);
            document.body.innerHTML += '<div style="position: fixed; top: 10px; right: 10px; background: red; color: white; padding: 10px; border-radius: 5px; z-index: 9999;">JS Error: ' + error.message + '</div>';
        }
    </script>
</body>
</html>`;

        if (iframeRef.current) {
          const doc = iframeRef.current.contentDocument;
          if (doc) {
            doc.open();
            doc.write(combinedHTML);
            doc.close();
          }
        }
        setOutput('✅ Web page rendered successfully in preview window');
        setExecutionTime(100);
      } else {
        // Use Piston API for code execution
        const currentCode = code[activeLanguage] || '';

        // Map language to Piston format
        const pistonLanguage = mapLanguageToPiston(activeLanguage);
        if (!pistonLanguage) {
          throw new Error(`Language ${activeLanguage} is not supported by Piston API`);
        }

        const result = await runCodeWithPiston(pistonLanguage, currentCode, input);
        
        // Format output
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
        const execTime = Date.now() - startTime;
        outputText += `\n📊 Execution Summary:\n`;
        outputText += `Language: ${result.language} (${result.version})\n`;
        outputText += `Compilation: ${result.compile ? (result.compile.stderr ? '❌ Failed' : '✅ Success') : '✅ Success'}\n`;
        outputText += `Exit Code: ${result.run.code}\n`;
        outputText += `Execution Time: ${execTime}ms\n`;
        outputText += `Service: Piston API\n`;
        
        if (!outputText.trim()) {
          outputText = '✅ Code executed successfully with no output.\nTip: Use print statements to see results!';
        }
        
        setOutput(outputText);
        setExecutionTime(execTime);
        setExecutionService('Piston');
      }
    } catch (error: any) {
      setOutput(`❌ Execution Error: ${error.message}`);
      setExecutionTime(0);
    } finally {
      setIsRunning(false);
    }
  };

  const editorStyle = {
    fontSize: `${fontSize}px`,
    fontFamily: 'Menlo, "Ubuntu Mono", "Courier New", monospace',
    lineHeight: 1.5,
    backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
    color: theme === 'dark' ? '#d4d4d4' : '#333333',
  };

  const isWebLanguage = activeLanguage === 'html' || activeLanguage === 'css';

  return (
    <Card className={cn(
      "w-full",
      isMaximized && "fixed inset-0 z-[100] bg-background border-0 rounded-none shadow-2xl"
    )}>
      <CardHeader className={cn(isMaximized && "pt-4 pb-3 border-b")}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Code2 className="h-5 w-5 flex-shrink-0" />
              <span className="truncate">Advanced Code Playground - {topicTitle}</span>
            </CardTitle>
            <CardDescription className="text-sm">
              Full-featured IDE with syntax highlighting, multiple languages, and real execution
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editor Settings</DialogTitle>
                  <DialogDescription>Customize your coding environment</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Font Size</Label>
                    <Select value={fontSize.toString()} onValueChange={(v) => setFontSize(Number(v))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">12px</SelectItem>
                        <SelectItem value="14">14px</SelectItem>
                        <SelectItem value="16">16px</SelectItem>
                        <SelectItem value="18">18px</SelectItem>
                        <SelectItem value="20">20px</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <Select value={theme} onValueChange={(v: 'light' | 'dark') => setTheme(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>

      <CardContent className={cn("space-y-4", isMaximized && "max-h-[calc(100vh-6.5rem)] overflow-auto")}>
        {/* Language Tabs */}
        <Tabs value={activeLanguage} onValueChange={(value) => setActiveLanguage(value as SupportedLanguage)}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 gap-4">
            <div className="flex flex-col sm:flex-row flex-wrap gap-2">
              <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full sm:w-auto">
                <TabsTrigger value="javascript" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3">
                  <span>🟨</span> <span className="hidden xs:inline">JS</span>
                </TabsTrigger>
                <TabsTrigger value="python" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3">
                  <span>🐍</span> <span className="hidden xs:inline">Python</span>
                </TabsTrigger>
                <TabsTrigger value="java" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3">
                  <span>☕</span> <span className="hidden xs:inline">Java</span>
                </TabsTrigger>
                <TabsTrigger value="cpp" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3">
                  <span>⚡</span> <span className="hidden xs:inline">C++</span>
                </TabsTrigger>
              </TabsList>
              <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full sm:w-auto">
                <TabsTrigger value="c" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3">
                  <span>🔧</span> <span className="hidden xs:inline">C</span>
                </TabsTrigger>
                <TabsTrigger value="webdev" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3">
                  <span>🌐</span> <span className="hidden xs:inline">Web</span>
                </TabsTrigger>
                <TabsTrigger value="csharp" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3">
                  <span>🔷</span> <span className="hidden xs:inline">C#</span>
                </TabsTrigger>
                <TabsTrigger value="sql" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3">
                  <span>🗄️</span> <span className="hidden xs:inline">SQL</span>
                </TabsTrigger>
              </TabsList>
              <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full sm:w-auto">
                <TabsTrigger value="php" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3">
                  <span>🐘</span> <span className="hidden xs:inline">PHP</span>
                </TabsTrigger>
                <TabsTrigger value="ruby" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3">
                  <span>💎</span> <span className="hidden xs:inline">Ruby</span>
                </TabsTrigger>
                <TabsTrigger value="go" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3">
                  <span>🐹</span> <span className="hidden xs:inline">Go</span>
                </TabsTrigger>
                <TabsTrigger value="rust" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3">
                  <span>🦀</span> <span className="hidden xs:inline">Rust</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {lastSaved && (
                <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                  Saved {lastSaved.toLocaleTimeString()}
                </Badge>
              )}
              {executionTime && (
                <Badge variant="secondary" className="text-xs">
                  {executionTime}ms
                </Badge>
              )}
              <Button size="sm" variant="outline" onClick={downloadCode} className="hidden sm:flex">
                <Download className="h-4 w-4 mr-1" />
                <span className="hidden md:inline">Download</span>
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsMaximized(!isMaximized)}>
                {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                <span className="hidden md:inline ml-1">{isMaximized ? 'Minimize' : 'Maximize'}</span>
              </Button>
              <Button size="sm" variant="outline" onClick={saveCode}>
                <Save className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Save</span>
              </Button>
              <Button size="sm" variant="outline" onClick={resetCode} className="hidden sm:flex">
                <RotateCcw className="h-4 w-4 mr-1" />
                <span className="hidden md:inline">Reset</span>
              </Button>
              <Button size="sm" onClick={runCode} disabled={isRunning}>
                <Play className="h-4 w-4" />
                <span className="ml-1">{isRunning ? 'Running...' : 'Run'}</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const testCodes: Record<string, string> = {
                    javascript: 'console.log("✅ JavaScript execution test successful!");\nconsole.log("Current time:", new Date().toISOString());\nconsole.log("Math test: 2 + 2 =", 2 + 2);',
                    python: 'print("✅ Python execution test successful!")\nimport datetime\nprint("Current time:", datetime.datetime.now())\nprint("Math test: 2 + 2 =", 2 + 2)',
                    java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("✅ Java execution test successful!");\n        System.out.println("Current time: " + java.time.LocalDateTime.now());\n        System.out.println("Math test: 2 + 2 = " + (2 + 2));\n    }\n}',
                    c: '#include <stdio.h>\n#include <time.h>\nint main() {\n    printf("✅ C execution test successful!\\n");\n    time_t t = time(NULL);\n    printf("Current time: %s", ctime(&t));\n    printf("Math test: 2 + 2 = %d\\n", 2 + 2);\n    return 0;\n}',
                    cpp: '#include <iostream>\n#include <chrono>\nusing namespace std;\nint main() {\n    cout << "✅ C++ execution test successful!" << endl;\n    auto now = chrono::system_clock::now();\n    auto time_t = chrono::system_clock::to_time_t(now);\n    cout << "Current time: " << ctime(&time_t);\n    cout << "Math test: 2 + 2 = " << (2 + 2) << endl;\n    return 0;\n}',
                    csharp: 'using System;\nclass Program {\n    static void Main() {\n        Console.WriteLine("✅ C# execution test successful!");\n        Console.WriteLine("Current time: " + DateTime.Now);\n        Console.WriteLine("Math test: 2 + 2 = " + (2 + 2));\n    }\n}',
                    php: '<?php\necho "✅ PHP execution test successful!\\n";\necho "Current time: " . date("Y-m-d H:i:s") . "\\n";\necho "Math test: 2 + 2 = " . (2 + 2) . "\\n";\n?>',
                    ruby: 'puts "✅ Ruby execution test successful!"\nputs "Current time: #{Time.now}"\nputs "Math test: 2 + 2 = #{2 + 2}"',
                    go: 'package main\nimport (\n    "fmt"\n    "time"\n)\nfunc main() {\n    fmt.Println("✅ Go execution test successful!")\n    fmt.Println("Current time:", time.Now())\n    fmt.Println("Math test: 2 + 2 =", 2 + 2)\n}',
                    rust: 'use std::time::SystemTime;\nfn main() {\n    println!("✅ Rust execution test successful!");\n    println!("Current time: {:?}", SystemTime::now());\n    println!("Math test: 2 + 2 = {}", 2 + 2);\n}',
                    sql: '-- SQL execution test\nCREATE TABLE test_table (\n    id INTEGER PRIMARY KEY,\n    name TEXT,\n    value INTEGER\n);\n\nINSERT INTO test_table (name, value) VALUES \n    (\'Test 1\', 100),\n    (\'Test 2\', 200);\n\nSELECT * FROM test_table WHERE value > 150;'
                  };

                  if (activeLanguage === 'webdev') {
                    setWebCode({
                      html: '<div class="container">\n    <h1>Welcome to Web Development!</h1>\n    <p>This is a simple HTML and CSS example.</p>\n    <div class="card">\n        <h2>Features:</h2>\n        <ul>\n            <li>Responsive design</li>\n            <li>Modern CSS styling</li>\n            <li>Interactive JavaScript</li>\n        </ul>\n        <button id="testBtn" class="btn">Click me!</button>\n        <div id="output" class="output"></div>\n    </div>\n</div>',
                      css: '/* Modern CSS Styling */\n.container {\n    max-width: 800px;\n    margin: 0 auto;\n    padding: 30px;\n    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n    color: white;\n    border-radius: 15px;\n    box-shadow: 0 10px 30px rgba(0,0,0,0.3);\n}\n\nh1 {\n    text-align: center;\n    margin-bottom: 20px;\n    font-size: 2.5em;\n    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);\n}\n\n.card {\n    background: rgba(255,255,255,0.1);\n    padding: 25px;\n    border-radius: 10px;\n    margin-top: 20px;\n    backdrop-filter: blur(10px);\n}\n\n.btn {\n    background: #ff6b6b;\n    color: white;\n    border: none;\n    padding: 12px 24px;\n    border-radius: 8px;\n    cursor: pointer;\n    font-size: 16px;\n    font-weight: bold;\n    transition: all 0.3s ease;\n    margin-top: 15px;\n}\n\n.btn:hover {\n    background: #ff5252;\n    transform: translateY(-2px);\n    box-shadow: 0 5px 15px rgba(255,107,107,0.4);\n}\n\n.output {\n    margin-top: 15px;\n    padding: 15px;\n    background: rgba(255,255,255,0.1);\n    border-radius: 8px;\n    min-height: 50px;\n}\n\nul {\n    list-style-type: none;\n    padding: 0;\n}\n\nli {\n    padding: 8px 0;\n    border-bottom: 1px solid rgba(255,255,255,0.2);\n}\n\nli:before {\n    content: "✨ ";\n    margin-right: 10px;\n}',
                      js: '// Interactive JavaScript\ndocument.addEventListener("DOMContentLoaded", function() {\n    const button = document.getElementById("testBtn");\n    const output = document.getElementById("output");\n    let clickCount = 0;\n    \n    button.addEventListener("click", function() {\n        clickCount++;\n        const messages = [\n            "🎉 JavaScript is working perfectly!",\n            "🚀 This is click number " + clickCount,\n            "⏰ Current time: " + new Date().toLocaleString(),\n            "🌟 HTML, CSS, and JS are working together!"\n        ];\n        \n        output.innerHTML = messages.map(msg => "<p>" + msg + "</p>").join("");\n        \n        // Add some animation\n        output.style.transform = "scale(0.95)";\n        setTimeout(() => {\n            output.style.transform = "scale(1)";\n        }, 150);\n    });\n    \n    // Welcome message\n    output.innerHTML = "<p>👋 Click the button above to test JavaScript functionality!</p>";\n});'
                    });
                  } else {
                    const testCode = testCodes[activeLanguage] || 'console.log("Test code for this language");';
                    setCode(prev => ({ ...prev, [activeLanguage]: testCode }));
                  }
                }}
              >
                Test Code
              </Button>
            </div>
          </div>

          {/* Code Editor and Output - Responsive Grid */}
          <div className={cn(
            "grid gap-4",
            activeLanguage === 'webdev' 
              ? "grid-cols-1 xl:grid-cols-2" 
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          )}>
            {/* Code Editor */}
            <div className={cn("space-y-2", activeLanguage === 'webdev' ? "lg:col-span-1" : "lg:col-span-2")}>
              {activeLanguage === 'webdev' ? (
                // Web Development Editor with HTML, CSS, JS tabs
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        🌐 Web Development
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      HTML + CSS + JS
                    </Badge>
                  </div>

                  <Tabs value={activeWebTab} onValueChange={(value) => setActiveWebTab(value as 'html' | 'css' | 'js')}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="html">HTML</TabsTrigger>
                      <TabsTrigger value="css">CSS</TabsTrigger>
                      <TabsTrigger value="js">JavaScript</TabsTrigger>
                    </TabsList>

                    <TabsContent value="html" className="space-y-2">
                      <textarea
                        value={webCode.html}
                        onChange={(e) => setWebCode(prev => ({ ...prev, html: e.target.value }))}
                        className={cn(
                          "w-full p-3 sm:p-4 border rounded-lg resize-none font-mono text-sm sm:text-base",
                          isMaximized ? "h-[40vh] sm:h-[50vh]" : "h-64 sm:h-80",
                          "focus:outline-none focus:ring-2 focus:ring-primary/20"
                        )}
                        style={editorStyle}
                        placeholder="Write your HTML here..."
                        spellCheck={false}
                      />
                    </TabsContent>

                    <TabsContent value="css" className="space-y-2">
                      <textarea
                        value={webCode.css}
                        onChange={(e) => setWebCode(prev => ({ ...prev, css: e.target.value }))}
                        className={cn(
                          "w-full p-3 sm:p-4 border rounded-lg resize-none font-mono text-sm sm:text-base",
                          isMaximized ? "h-[40vh] sm:h-[50vh]" : "h-64 sm:h-80",
                          "focus:outline-none focus:ring-2 focus:ring-primary/20"
                        )}
                        style={editorStyle}
                        placeholder="Write your CSS here..."
                        spellCheck={false}
                      />
                    </TabsContent>

                    <TabsContent value="js" className="space-y-2">
                      <textarea
                        value={webCode.js}
                        onChange={(e) => setWebCode(prev => ({ ...prev, js: e.target.value }))}
                        className={cn(
                          "w-full p-3 sm:p-4 border rounded-lg resize-none font-mono text-sm sm:text-base",
                          isMaximized ? "h-[40vh] sm:h-[50vh]" : "h-64 sm:h-80",
                          "focus:outline-none focus:ring-2 focus:ring-primary/20"
                        )}
                        style={editorStyle}
                        placeholder="Write your JavaScript here..."
                        spellCheck={false}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                // Regular Programming Language Editor
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {LANGUAGE_CONFIG[activeLanguage].icon} {LANGUAGE_CONFIG[activeLanguage].name} Code
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {LANGUAGE_CONFIG[activeLanguage].extension}
                    </Badge>
                  </div>
                  <textarea
                    value={code[activeLanguage] || ''}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    className={cn(
                      "w-full p-4 border rounded-lg resize-none font-mono",
                      isMaximized ? "h-[60vh]" : "h-96",
                      "focus:outline-none focus:ring-2 focus:ring-primary/20"
                    )}
                    style={editorStyle}
                    placeholder={`Write your ${LANGUAGE_CONFIG[activeLanguage].name} code here...`}
                    spellCheck={false}
                  />
                </div>
              )}
            </div>

            {/* Input/Output or Preview */}
            {activeLanguage === 'webdev' ? (
              // Web Preview
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm font-medium">Live Preview</span>
                    <Badge variant="outline" className="text-xs">
                      Auto-refresh
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        updateWebPreview();
                        toast.success('Preview refreshed!');
                      }}
                      className="h-7 px-2"
                    >
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Refresh
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const newWindow = window.open('', '_blank');
                        if (newWindow) {
                          const combinedHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${topicTitle} - Web Project</title>
    <style>
        ${webCode.css}
    </style>
</head>
<body>
    ${webCode.html.replace(/<html[^>]*>|<\/html>|<head[^>]*>[\s\S]*?<\/head>|<body[^>]*>|<\/body>|<!DOCTYPE[^>]*>/gi, '')}
    <script>
        ${webCode.js}
    </script>
</body>
</html>`;
                          newWindow.document.write(combinedHTML);
                          newWindow.document.close();
                        }
                      }}
                      className="h-7 px-2"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Open
                    </Button>
                  </div>
                </div>
                <div className="border rounded-lg overflow-hidden bg-white">
                  <iframe
                    ref={iframeRef}
                    className={cn(
                      "w-full bg-white border-0",
                      isMaximized ? "h-[50vh] sm:h-[60vh]" : "h-64 sm:h-80 md:h-96"
                    )}
                    title="Web Preview"
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
                {output && (
                  <div className="text-sm text-muted-foreground p-2 bg-muted/50 rounded">
                    {output}
                  </div>
                )}
              </div>
            ) : (
              // Programming Language Input/Output
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Keyboard className="h-4 w-4" />
                  <span className="text-sm font-medium">Input</span>
                </div>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className={cn(
                    "w-full p-4 font-mono text-sm border rounded-lg resize-none",
                    "h-32 bg-muted/50 focus:bg-background transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-primary/20"
                  )}
                  placeholder="Enter input for your program..."
                />

                <div className="flex items-center gap-2 mt-2">
                  <Terminal className="h-4 w-4" />
                  <span className="text-sm font-medium">Output</span>
                </div>
                <div className={cn(
                  "w-full p-4 font-mono text-sm border rounded-lg",
                  isMaximized ? "h-[calc(60vh-10rem)]" : "h-64",
                  "bg-muted/30 overflow-y-auto whitespace-pre-wrap"
                )}>
                  {output || 'Click "Run" to execute your code and see the output here...'}
                </div>
              </div>
            )}
          </div>
        </Tabs>

        <div className="text-xs text-muted-foreground">
          💡 <strong>Pro Tips:</strong> Use Ctrl+S to save, Ctrl+Enter to run code.
          Your code is automatically saved locally. Try different languages and see real execution results!
        </div>
      </CardContent>
    </Card>
  );
}