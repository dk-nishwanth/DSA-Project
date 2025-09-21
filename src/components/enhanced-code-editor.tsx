import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Play, 
  Square, 
  Bug, 
  Share2, 
  Download, 
  Upload, 
  Settings, 
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Home
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { executeCodeWithPiston } from '@/lib/piston';

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
  theme?: 'light' | 'dark';
  onCodeChange?: (code: string) => void;
  onExecutionComplete?: (result: ExecutionResult) => void;
  readOnly?: boolean;
  showConsole?: boolean;
  enableDebugging?: boolean;
  enableCollaboration?: boolean;
}

interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime: number;
  memoryUsed: number;
  language: string;
  version: string;
}

interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  passed?: boolean;
  executionTime?: number;
}

interface DebugPoint {
  line: number;
  variables: Record<string, any>;
  stackTrace: string[];
}

const SUPPORTED_LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', extension: 'js', version: '18.15.0' },
  { id: 'python', name: 'Python', extension: 'py', version: '3.10.0' },
  { id: 'java', name: 'Java', extension: 'java', version: '15.0.2' },
  { id: 'cpp', name: 'C++', extension: 'cpp', version: 'GCC 9.4.0' },
  { id: 'c', name: 'C', extension: 'c', version: 'GCC 9.4.0' },
  { id: 'csharp', name: 'C#', extension: 'cs', version: '.NET 5.0' },
  { id: 'go', name: 'Go', extension: 'go', version: '1.16.2' },
  { id: 'rust', name: 'Rust', extension: 'rs', version: '1.68.2' },
  { id: 'typescript', name: 'TypeScript', extension: 'ts', version: '5.0.3' },
  { id: 'php', name: 'PHP', extension: 'php', version: '8.2.3' }
];

const CODE_TEMPLATES = {
  javascript: `// JavaScript DSA Solution
function solution(input) {
    // Your code here
    return input;
}

// Test the function
console.log(solution("Hello World"));`,
  
  python: `# Python DSA Solution
def solution(input_data):
    # Your code here
    return input_data

# Test the function
print(solution("Hello World"))`,
  
  java: `// Java DSA Solution
public class Solution {
    public static String solution(String input) {
        // Your code here
        return input;
    }
    
    public static void main(String[] args) {
        System.out.println(solution("Hello World"));
    }
}`,
  
  cpp: `// C++ DSA Solution
#include <iostream>
#include <string>
using namespace std;

string solution(string input) {
    // Your code here
    return input;
}

int main() {
    cout << solution("Hello World") << endl;
    return 0;
}`
};

export function EnhancedCodeEditor({
  initialCode = '',
  language = 'javascript',
  theme = 'light',
  onCodeChange,
  onExecutionComplete,
  readOnly = false,
  showConsole = true,
  enableDebugging = true,
  enableCollaboration = false
}: CodeEditorProps) {
  const navigate = useNavigate();
  const [code, setCode] = useState(initialCode || CODE_TEMPLATES[language as keyof typeof CODE_TEMPLATES] || '');
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [debugPoints, setDebugPoints] = useState<DebugPoint[]>([]);
  const [isDebugging, setIsDebugging] = useState(false);
  const [currentDebugLine, setCurrentDebugLine] = useState<number | null>(null);
  const [executionHistory, setExecutionHistory] = useState<ExecutionResult[]>([]);
  
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const executionTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (onCodeChange) {
      onCodeChange(code);
    }
  }, [code, onCodeChange]);

  useEffect(() => {
    // Load saved code from localStorage
    const savedCode = localStorage.getItem(`code-editor-${selectedLanguage}`);
    if (savedCode && !initialCode) {
      setCode(savedCode);
    }
  }, [selectedLanguage, initialCode]);

  useEffect(() => {
    // Auto-save code
    const saveTimeout = setTimeout(() => {
      localStorage.setItem(`code-editor-${selectedLanguage}`, code);
    }, 1000);

    return () => clearTimeout(saveTimeout);
  }, [code, selectedLanguage]);

  const handleLanguageChange = (newLanguage: string) => {
    setSelectedLanguage(newLanguage);
    const template = CODE_TEMPLATES[newLanguage as keyof typeof CODE_TEMPLATES];
    if (template && !code.trim()) {
      setCode(template);
    }
  };

  const executeCodeWithTimeout = async () => {
    if (isExecuting) return;
    
    setIsExecuting(true);
    setConsoleOutput([]);
    
    try {
      const startTime = Date.now();
      
      // Set execution timeout
      executionTimeoutRef.current = setTimeout(() => {
        setIsExecuting(false);
        toast.error('Execution timed out after 30 seconds');
      }, 30000);

      const result = await executeCodeWithPiston({
        language: selectedLanguage,
        files: [{ content: code }]
      });
      const executionTime = Date.now() - startTime;
      
      clearTimeout(executionTimeoutRef.current);
      
      const executionResult: ExecutionResult = {
        success: !result.run.stderr,
        output: result.run.stdout || '',
        error: result.run.stderr || undefined,
        executionTime,
        memoryUsed: 0, // Piston doesn't provide memory usage
        language: selectedLanguage,
        version: result.version || 'Unknown'
      };
      
      setExecutionResult(executionResult);
      setConsoleOutput(prev => [...prev, result.run.stdout || result.run.stderr || 'No output']);
      setExecutionHistory(prev => [executionResult, ...prev.slice(0, 9)]); // Keep last 10 executions
      
      if (onExecutionComplete) {
        onExecutionComplete(executionResult);
      }
      
      // Show success/error toast
      if (executionResult.success) {
        toast.success(`Code executed successfully in ${executionTime}ms`);
      } else {
        toast.error('Execution failed - check console for details');
      }
      
    } catch (error) {
      clearTimeout(executionTimeoutRef.current);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      setExecutionResult({
        success: false,
        output: '',
        error: errorMessage,
        executionTime: 0,
        memoryUsed: 0,
        language: selectedLanguage,
        version: 'Unknown'
      });
      
      setConsoleOutput(prev => [...prev, `Error: ${errorMessage}`]);
      toast.error('Execution failed');
    } finally {
      setIsExecuting(false);
    }
  };

  const stopExecution = () => {
    if (executionTimeoutRef.current) {
      clearTimeout(executionTimeoutRef.current);
    }
    setIsExecuting(false);
    toast.info('Execution stopped');
  };

  const runTestCases = async () => {
    if (testCases.length === 0) {
      toast.warning('No test cases defined');
      return;
    }

    setIsExecuting(true);
    const updatedTestCases: TestCase[] = [];

    for (const testCase of testCases) {
      try {
        // Create test code with input
        const testCode = `${code}\n\n// Test input\nconsole.log(${testCase.input});`;
        
        const startTime = Date.now();
        const result = await executeCodeWithPiston({
          language: selectedLanguage,
          files: [{ content: testCode }]
        });
        const executionTime = Date.now() - startTime;
        
        const actualOutput = result.run.stdout?.trim() || '';
        const passed = actualOutput === testCase.expectedOutput.trim();
        
        updatedTestCases.push({
          ...testCase,
          actualOutput,
          passed,
          executionTime
        });
        
      } catch (error) {
        updatedTestCases.push({
          ...testCase,
          actualOutput: 'Error',
          passed: false,
          executionTime: 0
        });
      }
    }

    setTestCases(updatedTestCases);
    setIsExecuting(false);
    
    const passedCount = updatedTestCases.filter(tc => tc.passed).length;
    toast.success(`${passedCount}/${updatedTestCases.length} test cases passed`);
  };

  const addTestCase = () => {
    const newTestCase: TestCase = {
      id: `test-${Date.now()}`,
      input: '',
      expectedOutput: ''
    };
    setTestCases(prev => [...prev, newTestCase]);
  };

  const updateTestCase = (id: string, field: 'input' | 'expectedOutput', value: string) => {
    setTestCases(prev => prev.map(tc => 
      tc.id === id ? { ...tc, [field]: value } : tc
    ));
  };

  const removeTestCase = (id: string) => {
    setTestCases(prev => prev.filter(tc => tc.id !== id));
  };

  const shareCode = async () => {
    try {
      const shareData = {
        code,
        language: selectedLanguage,
        timestamp: new Date().toISOString()
      };
      
      const shareUrl = `${window.location.origin}/shared-code/${btoa(JSON.stringify(shareData))}`;
      
      if (navigator.share) {
        await navigator.share({
          title: 'DSA Code Solution',
          text: 'Check out my code solution',
          url: shareUrl
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Share link copied to clipboard');
      }
    } catch (error) {
      toast.error('Failed to share code');
    }
  };

  const downloadCode = () => {
    const languageInfo = SUPPORTED_LANGUAGES.find(l => l.id === selectedLanguage);
    const filename = `solution.${languageInfo?.extension || 'txt'}`;
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    
    URL.revokeObjectURL(url);
    toast.success(`Code downloaded as ${filename}`);
  };

  const uploadCode = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCode(content);
      toast.success('Code uploaded successfully');
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-gray-900 rounded-lg border">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Enhanced Code Editor</h1>
            <p className="text-sm text-muted-foreground">Multi-language code editor with real-time execution</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_LANGUAGES.map(lang => (
                <SelectItem key={lang.id} value={lang.id}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge variant="secondary">
            {SUPPORTED_LANGUAGES.find(l => l.id === selectedLanguage)?.version}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={shareCode}
            disabled={!code.trim()}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={downloadCode}
            disabled={!code.trim()}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          
          <label className="cursor-pointer">
            <Button variant="outline" size="sm" asChild>
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </span>
            </Button>
            <input
              type="file"
              accept=".js,.py,.java,.cpp,.c,.cs,.go,.rs,.ts,.php"
              onChange={uploadCode}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 border-b">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={executeCodeWithTimeout}
                disabled={isExecuting || !code.trim()}
                className="bg-green-600 hover:bg-green-700"
              >
                {isExecuting ? (
                  <>
                    <Square className="w-4 h-4 mr-2" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run
                  </>
                )}
              </Button>
              
              {isExecuting && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={stopExecution}
                >
                  <Square className="w-4 h-4 mr-2" />
                  Stop
                </Button>
              )}
              
              <Button
                size="sm"
                variant="outline"
                onClick={runTestCases}
                disabled={isExecuting || testCases.length === 0}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Test
              </Button>
              
              {enableDebugging && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsDebugging(!isDebugging)}
                >
                  <Bug className="w-4 h-4 mr-2" />
                  Debug
                </Button>
              )}
            </div>
            
            {executionResult && (
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {executionResult.executionTime}ms
                </div>
                {executionResult.success ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Success
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <XCircle className="w-3 h-3 mr-1" />
                    Error
                  </Badge>
                )}
              </div>
            )}
          </div>
          
          <Textarea
            ref={editorRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Write your code here..."
            className="flex-1 font-mono text-sm resize-none border-0 rounded-none focus:ring-0"
            readOnly={readOnly}
            style={{ minHeight: '400px' }}
          />
        </div>

        {/* Side Panel */}
        {showConsole && (
          <div className="w-96 border-l flex flex-col">
            <Tabs defaultValue="console" className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="console">Console</TabsTrigger>
                <TabsTrigger value="tests">Tests</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="console" className="flex-1 p-4">
                <div className="h-full bg-black text-green-400 p-3 rounded font-mono text-sm overflow-auto">
                  {consoleOutput.length === 0 ? (
                    <div className="text-gray-500">Console output will appear here...</div>
                  ) : (
                    consoleOutput.map((line, index) => (
                      <div key={index} className="mb-1">
                        <span className="text-gray-400">$ </span>
                        {line}
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="tests" className="flex-1 p-4 overflow-auto">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Test Cases</h4>
                    <Button size="sm" onClick={addTestCase}>
                      Add Test
                    </Button>
                  </div>
                  
                  {testCases.map((testCase, index) => (
                    <Card key={testCase.id} className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Test {index + 1}</span>
                        <div className="flex items-center gap-2">
                          {testCase.passed !== undefined && (
                            <Badge variant={testCase.passed ? "default" : "destructive"}>
                              {testCase.passed ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                              {testCase.passed ? 'Passed' : 'Failed'}
                            </Badge>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeTestCase(testCase.id)}
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <label className="text-xs font-medium">Input:</label>
                          <Textarea
                            value={testCase.input}
                            onChange={(e) => updateTestCase(testCase.id, 'input', e.target.value)}
                            placeholder="Test input..."
                            className="h-16 text-xs"
                          />
                        </div>
                        
                        <div>
                          <label className="text-xs font-medium">Expected Output:</label>
                          <Textarea
                            value={testCase.expectedOutput}
                            onChange={(e) => updateTestCase(testCase.id, 'expectedOutput', e.target.value)}
                            placeholder="Expected output..."
                            className="h-16 text-xs"
                          />
                        </div>
                        
                        {testCase.actualOutput !== undefined && (
                          <div>
                            <label className="text-xs font-medium">Actual Output:</label>
                            <div className="p-2 bg-gray-100 rounded text-xs font-mono">
                              {testCase.actualOutput}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="flex-1 p-4 overflow-auto">
                <div className="space-y-2">
                  <h4 className="font-medium">Execution History</h4>
                  {executionHistory.map((result, index) => (
                    <Card key={index} className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={result.success ? "default" : "destructive"}>
                          {result.success ? 'Success' : 'Error'}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {result.executionTime}ms
                        </span>
                      </div>
                      <div className="text-xs font-mono bg-gray-100 p-2 rounded">
                        {result.output || result.error || 'No output'}
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
