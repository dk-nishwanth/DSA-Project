import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Play, 
  Save, 
  RotateCcw, 
  Code2, 
  Terminal, 
  Maximize2, 
  Minimize2, 
  CheckCircle, 
  XCircle, 
  Clock,
  Zap,
  TestTube
} from 'lucide-react';
import { runCodeWithPiston, PistonLanguages, getPistonCodeTemplate, testPistonConnection } from '@/lib/piston';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface EnhancedCodePlaygroundProps {
  topicId: string;
  topicTitle: string;
  initialCode?: Partial<Record<keyof typeof PistonLanguages, string>>;
}

const SUPPORTED_LANGUAGES = [
  { key: 'javascript', name: 'JavaScript', icon: '🟨', color: 'bg-yellow-100 text-yellow-800' },
  { key: 'python', name: 'Python', icon: '🐍', color: 'bg-blue-100 text-blue-800' },
  { key: 'java', name: 'Java', icon: '☕', color: 'bg-orange-100 text-orange-800' },
  { key: 'cpp', name: 'C++', icon: '⚡', color: 'bg-purple-100 text-purple-800' },
  { key: 'c', name: 'C', icon: '🔧', color: 'bg-gray-100 text-gray-800' },
  { key: 'csharp', name: 'C#', icon: '🔷', color: 'bg-indigo-100 text-indigo-800' },
  { key: 'go', name: 'Go', icon: '🐹', color: 'bg-cyan-100 text-cyan-800' },
  { key: 'rust', name: 'Rust', icon: '🦀', color: 'bg-red-100 text-red-800' },
  { key: 'typescript', name: 'TypeScript', icon: '🔷', color: 'bg-blue-100 text-blue-800' },
  { key: 'php', name: 'PHP', icon: '🐘', color: 'bg-purple-100 text-purple-800' },
  { key: 'ruby', name: 'Ruby', icon: '💎', color: 'bg-red-100 text-red-800' },
  { key: 'kotlin', name: 'Kotlin', icon: '🟣', color: 'bg-violet-100 text-violet-800' },
] as const;

type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number]['key'];

export function EnhancedCodePlayground({ topicId, topicTitle, initialCode }: EnhancedCodePlaygroundProps) {
  const [activeLanguage, setActiveLanguage] = useState<SupportedLanguage>('javascript');
  const [code, setCode] = useState<Record<string, string>>({});
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [apiStatus, setApiStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const [executionHistory, setExecutionHistory] = useState<Array<{
    language: string;
    timestamp: Date;
    success: boolean;
    executionTime: number;
  }>>([]);

  // Test API connection on mount
  useEffect(() => {
    const checkApiStatus = async () => {
      const isAvailable = await testPistonConnection();
      setApiStatus(isAvailable ? 'available' : 'unavailable');
      if (!isAvailable) {
        toast.error('Code execution service is currently unavailable. Using mock mode.');
      }
    };
    checkApiStatus();
  }, []);

  // Load saved code from localStorage
  useEffect(() => {
    const savedCode = localStorage.getItem(`enhanced-codespace-${topicId}`);
    if (savedCode) {
      try {
        const parsed = JSON.parse(savedCode);
        setCode(parsed);
      } catch {
        initializeDefaultCode();
      }
    } else {
      initializeDefaultCode();
    }
  }, [topicId, topicTitle, initialCode]);

  const initializeDefaultCode = () => {
    const defaultCode: Record<string, string> = {};
    SUPPORTED_LANGUAGES.forEach(({ key }) => {
      defaultCode[key] = initialCode?.[key] || getPistonCodeTemplate(key, topicTitle);
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
    localStorage.setItem(`enhanced-codespace-${topicId}`, JSON.stringify(code));
    setLastSaved(new Date());
    toast.success('Code saved successfully!');
  };

  const resetCode = () => {
    const defaultCode: Record<string, string> = {};
    SUPPORTED_LANGUAGES.forEach(({ key }) => {
      defaultCode[key] = initialCode?.[key] || getPistonCodeTemplate(key, topicTitle);
    });
    setCode(defaultCode);
    setOutput('');
    toast.info('Code reset to default template');
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput('🚀 Executing code...\n');
    const startTime = Date.now();
    
    const currentCode = code[activeLanguage] || '';

    try {
      if (apiStatus === 'unavailable') {
        // Mock execution for demo purposes
        await new Promise(resolve => setTimeout(resolve, 1000));
        setOutput(`🎭 Mock Execution (API Unavailable)\n\nLanguage: ${activeLanguage}\nCode executed successfully!\n\nNote: This is a simulation. The actual Piston API is currently unavailable.`);
        const mockTime = Math.random() * 500 + 100;
        setExecutionTime(mockTime);
        
        setExecutionHistory(prev => [...prev.slice(-9), {
          language: activeLanguage,
          timestamp: new Date(),
          success: true,
          executionTime: mockTime
        }]);
        
        toast.success('Code executed successfully (mock mode)');
        return;
      }

      const result = await runCodeWithPiston(activeLanguage, currentCode);
      const endTime = Date.now();
      const execTime = endTime - startTime;
      
      setExecutionTime(execTime);
      
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
      outputText += `\n📊 Execution Info:\n`;
      outputText += `Language: ${result.language} (${result.version})\n`;
      outputText += `Execution Time: ${execTime}ms\n`;
      outputText += `Exit Code: ${result.run.code}\n`;
      
      if (!outputText.trim()) {
        outputText = '✅ Code executed successfully with no output.\nTip: Use print statements to see results!';
      }
      
      setOutput(outputText);
      
      // Track execution history
      setExecutionHistory(prev => [...prev.slice(-9), {
        language: activeLanguage,
        timestamp: new Date(),
        success: result.run.code === 0,
        executionTime: execTime
      }]);
      
      if (result.run.code === 0) {
        toast.success(`Code executed successfully in ${execTime}ms`);
      } else {
        toast.error('Code execution failed. Check the output for details.');
      }
      
    } catch (err: unknown) {
      const endTime = Date.now();
      const execTime = endTime - startTime;
      
      setExecutionTime(execTime);
      setOutput(`❌ Execution Error:\n${(err as Error)?.message || String(err)}\n\nThis might be due to:\n• Network connectivity issues\n• API service unavailability\n• Invalid code syntax\n• Timeout (execution > 3 seconds)`);
      
      setExecutionHistory(prev => [...prev.slice(-9), {
        language: activeLanguage,
        timestamp: new Date(),
        success: false,
        executionTime: execTime
      }]);
      
      toast.error('Code execution failed');
    } finally {
      setIsRunning(false);
    }
  };

  const testAllLanguages = async () => {
    toast.info('Starting multi-language test...');
    setOutput('🧪 Testing all supported languages...\n\n');
    
    let results = '';
    let successCount = 0;
    
    for (const { key, name } of SUPPORTED_LANGUAGES) {
      setActiveLanguage(key);
      results += `Testing ${name}...\n`;
      setOutput(prev => prev + `Testing ${name}...\n`);
      
      try {
        const testCode = getPistonCodeTemplate(key, 'Test');
        const result = await runCodeWithPiston(key, testCode);
        
        if (result.run.code === 0) {
          results += `✅ ${name}: SUCCESS\n`;
          successCount++;
        } else {
          results += `❌ ${name}: FAILED (Exit code: ${result.run.code})\n`;
        }
      } catch (error) {
        results += `❌ ${name}: ERROR (${(error as Error).message})\n`;
      }
      
      setOutput(prev => prev.replace(/Testing.*\.\.\.\n$/, results));
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    results += `\n📊 Test Summary: ${successCount}/${SUPPORTED_LANGUAGES.length} languages working\n`;
    setOutput(prev => prev + `\n📊 Test Summary: ${successCount}/${SUPPORTED_LANGUAGES.length} languages working\n`);
    
    if (successCount === SUPPORTED_LANGUAGES.length) {
      toast.success('All languages are working perfectly!');
    } else {
      toast.warning(`${SUPPORTED_LANGUAGES.length - successCount} language(s) failed`);
    }
  };

  const getCurrentLanguageInfo = () => {
    return SUPPORTED_LANGUAGES.find(lang => lang.key === activeLanguage) || SUPPORTED_LANGUAGES[0];
  };

  const editorHeightClass = isMaximized ? 'h-[70vh]' : 'h-80';

  return (
    <Card className={cn(
      "w-full",
      isMaximized && "fixed inset-0 z-[100] bg-background border-0 rounded-none shadow-2xl"
    )}>
      <CardHeader className={cn(isMaximized && "pt-4 pb-3 border-b")}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="h-5 w-5" />
              Enhanced Code Playground - {topicTitle}
            </CardTitle>
            <CardDescription>
              Multi-language code execution with real-time testing. Powered by Piston API.
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={apiStatus === 'available' ? 'default' : apiStatus === 'checking' ? 'secondary' : 'destructive'}>
              {apiStatus === 'available' && <CheckCircle className="h-3 w-3 mr-1" />}
              {apiStatus === 'checking' && <Clock className="h-3 w-3 mr-1" />}
              {apiStatus === 'unavailable' && <XCircle className="h-3 w-3 mr-1" />}
              {apiStatus === 'available' ? 'API Ready' : apiStatus === 'checking' ? 'Checking...' : 'API Unavailable'}
            </Badge>
            
            {executionTime && (
              <Badge variant="outline">
                <Zap className="h-3 w-3 mr-1" />
                {executionTime}ms
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className={cn("space-y-4", isMaximized && "max-h-[calc(100vh-8rem)] overflow-auto")}>
        {/* Language Selection and Controls */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <Select value={activeLanguage} onValueChange={(value) => setActiveLanguage(value as SupportedLanguage)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_LANGUAGES.map(({ key, name, icon }) => (
                  <SelectItem key={key} value={key}>
                    <span className="flex items-center gap-2">
                      <span>{icon}</span>
                      {name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Badge className={getCurrentLanguageInfo().color}>
              {getCurrentLanguageInfo().icon} {getCurrentLanguageInfo().name}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            {lastSaved && (
              <Badge variant="outline" className="text-xs">
                Saved {lastSaved.toLocaleTimeString()}
              </Badge>
            )}
            
            <Button size="sm" variant="outline" onClick={testAllLanguages} disabled={isRunning}>
              <TestTube className="h-4 w-4 mr-1" />
              Test All
            </Button>
            
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
              {isRunning ? 'Running...' : 'Run Code'}
            </Button>
          </div>
        </div>

        {/* Code Editor and Output */}
        <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-4", isMaximized && "grid-cols-1 xl:grid-cols-2")}>
          {/* Code Editor */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {getCurrentLanguageInfo().icon} {getCurrentLanguageInfo().name} Code
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
              placeholder={`Write your ${getCurrentLanguageInfo().name} code here...`}
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
              {output || 'Click "Run Code" to execute your code and see the output here...'}
            </div>
          </div>
        </div>

        {/* Execution History */}
        {executionHistory.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Recent Executions</h4>
            <div className="flex gap-2 flex-wrap">
              {executionHistory.slice(-10).map((exec, index) => (
                <Badge
                  key={index}
                  variant={exec.success ? "default" : "destructive"}
                  className="text-xs"
                >
                  {SUPPORTED_LANGUAGES.find(l => l.key === exec.language)?.icon} 
                  {exec.language} ({exec.executionTime}ms)
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          💡 <strong>Enhanced Features:</strong> Real-time code execution across {SUPPORTED_LANGUAGES.length} languages, 
          automatic saving, execution history tracking, and comprehensive error reporting. 
          Try the "Test All" button to verify all languages are working!
        </div>
      </CardContent>
    </Card>
  );
}
