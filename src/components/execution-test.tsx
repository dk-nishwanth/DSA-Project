import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { executeCode, testExecutionServices } from '@/lib/code-executor';
import { Play, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export function ExecutionTest() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<{ [key: string]: any }>({});
  const [serviceStatus, setServiceStatus] = useState<{ [key: string]: boolean }>({});

  const testCodes = {
    javascript: 'console.log("Hello from JavaScript!"); console.log("Current time:", new Date().toISOString());',
    python: 'print("Hello from Python!"); import datetime; print("Current time:", datetime.datetime.now())',
    java: 'public class Main { public static void main(String[] args) { System.out.println("Hello from Java!"); System.out.println("Current time: " + java.time.LocalDateTime.now()); } }',
    cpp: '#include <iostream>\n#include <chrono>\nusing namespace std;\nint main() { cout << "Hello from C++!" << endl; auto now = chrono::system_clock::now(); auto time_t = chrono::system_clock::to_time_t(now); cout << "Current time: " << ctime(&time_t); return 0; }',
    c: '#include <stdio.h>\n#include <time.h>\nint main() { printf("Hello from C!\\n"); time_t t = time(NULL); printf("Current time: %s", ctime(&t)); return 0; }',
    python: 'print("Hello from Python!")\nprint("Math test: 2 + 2 =", 2 + 2)\nprint("List test:", [1, 2, 3, 4, 5])'
  };

  const runTest = async (language: string) => {
    setIsRunning(true);
    try {
      const result = await executeCode({
        language,
        code: testCodes[language as keyof typeof testCodes],
        input: ''
      });
      
      setResults(prev => ({
        ...prev,
        [language]: result
      }));
    } catch (error: any) {
      setResults(prev => ({
        ...prev,
        [language]: {
          success: false,
          output: '',
          error: error.message,
          executionTime: 0,
          service: 'Error'
        }
      }));
    } finally {
      setIsRunning(false);
    }
  };

  const testAllServices = async () => {
    setIsRunning(true);
    try {
      const status = await testExecutionServices();
      setServiceStatus(status);
    } catch (error) {
      console.error('Service test failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5" />
          Real Code Execution Test
        </CardTitle>
        <CardDescription>
          Test real compilation and execution across different programming languages
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Service Status */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Execution Services Status</h3>
            <Button onClick={testAllServices} disabled={isRunning} size="sm">
              {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Test Services'}
            </Button>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(serviceStatus).map(([service, status]) => (
              <div key={service} className="flex items-center gap-2 p-3 border rounded-lg">
                {status ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="font-medium capitalize">{service}</span>
                <Badge variant={status ? "default" : "destructive"} className="ml-auto">
                  {status ? "Online" : "Offline"}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Language Tests */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Language Execution Tests</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.keys(testCodes).map(language => (
              <Button
                key={language}
                onClick={() => runTest(language)}
                disabled={isRunning}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <span className="font-medium capitalize">{language}</span>
                {results[language] && (
                  <Badge variant={results[language].success ? "default" : "destructive"}>
                    {results[language].success ? "✅ Success" : "❌ Failed"}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Results */}
        {Object.keys(results).length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Execution Results</h3>
            
            <div className="space-y-4">
              {Object.entries(results).map(([language, result]: [string, any]) => (
                <Card key={language}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base capitalize">{language}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant={result.success ? "default" : "destructive"}>
                          {result.success ? "Success" : "Failed"}
                        </Badge>
                        <Badge variant="outline">
                          {result.executionTime}ms
                        </Badge>
                        <Badge variant="secondary">
                          {result.service}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {result.output && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Output:</h4>
                        <pre className="bg-muted p-3 rounded-lg text-sm overflow-x-auto">
                          {result.output}
                        </pre>
                      </div>
                    )}
                    {result.error && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-red-600">Error:</h4>
                        <pre className="bg-red-50 p-3 rounded-lg text-sm text-red-800 overflow-x-auto">
                          {result.error}
                        </pre>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>How to enable real execution:</strong>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Get a free RapidAPI key from <a href="https://rapidapi.com/judge0-official/api/judge0-ce/" target="_blank" className="text-blue-600 hover:underline">Judge0</a></li>
              <li>Add it to your environment: <code className="bg-muted px-1 rounded">NEXT_PUBLIC_RAPIDAPI_KEY=your_key</code></li>
              <li>Or store it locally using the "Setup Required" button in the code playground</li>
              <li>Restart your development server</li>
            </ol>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}