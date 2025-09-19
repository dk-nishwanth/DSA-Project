import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Play, TestTube } from 'lucide-react';
import { runCodeWithPiston, PistonLanguages } from '@/lib/piston';
import { toast } from 'sonner';

interface TestResult {
  language: string;
  success: boolean;
  output: string;
  executionTime: number;
  error?: string;
}

export function PlaygroundTest() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [currentTest, setCurrentTest] = useState<string>('');

  const testCases = {
    javascript: `console.log("Hello from JavaScript!");
const arr = [1, 2, 3];
console.log("Array:", arr);`,
    
    python: `print("Hello from Python!")
arr = [1, 2, 3]
print("Array:", arr)`,
    
    java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");
        int[] arr = {1, 2, 3};
        System.out.println("Array: " + java.util.Arrays.toString(arr));
    }
}`,
    
    cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    cout << "Hello from C++!" << endl;
    vector<int> arr = {1, 2, 3};
    cout << "Array: ";
    for(int x : arr) cout << x << " ";
    cout << endl;
    return 0;
}`,
    
    c: `#include <stdio.h>

int main() {
    printf("Hello from C!\\n");
    int arr[] = {1, 2, 3};
    printf("Array: ");
    for(int i = 0; i < 3; i++) {
        printf("%d ", arr[i]);
    }
    printf("\\n");
    return 0;
}`
  };

  const runSingleTest = async (language: keyof typeof testCases) => {
    setCurrentTest(language);
    const startTime = Date.now();
    
    try {
      const result = await runCodeWithPiston(language as keyof typeof PistonLanguages, testCases[language]);
      const executionTime = Date.now() - startTime;
      
      const success = result.run.code === 0 && result.run.stdout.includes('Hello from');
      
      return {
        language,
        success,
        output: result.run.stdout || result.run.stderr || 'No output',
        executionTime,
        error: result.run.code !== 0 ? `Exit code: ${result.run.code}` : undefined
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;
      return {
        language,
        success: false,
        output: '',
        executionTime,
        error: (error as Error).message
      };
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setResults([]);
    setCurrentTest('');
    
    const testResults: TestResult[] = [];
    
    for (const language of Object.keys(testCases) as Array<keyof typeof testCases>) {
      const result = await runSingleTest(language);
      testResults.push(result);
      setResults([...testResults]);
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setCurrentTest('');
    setIsRunning(false);
    
    const successCount = testResults.filter(r => r.success).length;
    const totalCount = testResults.length;
    
    if (successCount === totalCount) {
      toast.success(`All ${totalCount} languages working perfectly!`);
    } else {
      toast.warning(`${successCount}/${totalCount} languages working`);
    }
  };

  const getLanguageIcon = (language: string) => {
    const icons: Record<string, string> = {
      javascript: '🟨',
      python: '🐍',
      java: '☕',
      cpp: '⚡',
      c: '🔧'
    };
    return icons[language] || '💻';
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          Code Playground Integration Test
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Test the Piston API integration to verify all programming languages are working correctly.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button onClick={runAllTests} disabled={isRunning}>
              <Play className="h-4 w-4 mr-2" />
              {isRunning ? 'Testing...' : 'Test All Languages'}
            </Button>
            
            {currentTest && (
              <Badge variant="secondary">
                Testing {getLanguageIcon(currentTest)} {currentTest}...
              </Badge>
            )}
          </div>
          
          {results.length > 0 && (
            <Badge variant="outline">
              {results.filter(r => r.success).length}/{results.length} passed
            </Badge>
          )}
        </div>

        {results.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Test Results</h3>
            
            <div className="grid gap-3">
              {results.map((result) => (
                <div
                  key={result.language}
                  className={`p-4 rounded-lg border ${
                    result.success 
                      ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950' 
                      : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getLanguageIcon(result.language)}</span>
                      <span className="font-medium capitalize">{result.language}</span>
                      {result.success ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    
                    <Badge variant="outline" className="text-xs">
                      {result.executionTime}ms
                    </Badge>
                  </div>
                  
                  {result.success ? (
                    <div className="text-sm">
                      <div className="text-green-700 dark:text-green-300 font-medium mb-1">
                        ✅ Success
                      </div>
                      <div className="font-mono text-xs bg-white dark:bg-gray-900 p-2 rounded border">
                        {result.output}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm">
                      <div className="text-red-700 dark:text-red-300 font-medium mb-1">
                        ❌ Failed
                      </div>
                      <div className="font-mono text-xs bg-white dark:bg-gray-900 p-2 rounded border">
                        {result.error || result.output || 'Unknown error'}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          💡 <strong>Note:</strong> This test verifies that the Piston API integration is working correctly. 
          If all tests pass, your code playground can execute real code in multiple programming languages!
        </div>
      </CardContent>
    </Card>
  );
}
