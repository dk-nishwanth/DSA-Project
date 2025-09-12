import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { executeCode } from '@/lib/direct-executor';
import { Play } from 'lucide-react';

export function QuickTest() {
  const [result, setResult] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);

  const testJavaScript = async () => {
    setIsRunning(true);
    try {
      const result = await executeCode({
        language: 'javascript',
        code: 'console.log("Hello from JavaScript!");\nconsole.log("Math: 2 + 2 =", 2 + 2);',
        input: ''
      });
      setResult(`Success: ${result.success}\nOutput: ${result.output}\nService: ${result.service}`);
    } catch (error: any) {
      setResult(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const testPython = async () => {
    setIsRunning(true);
    try {
      const result = await executeCode({
        language: 'python',
        code: 'print("Hello from Python!")\nprint("Math: 2 + 2 =", 2 + 2)',
        input: ''
      });
      setResult(`Success: ${result.success}\nOutput: ${result.output}\nService: ${result.service}`);
    } catch (error: any) {
      setResult(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const testSQL = async () => {
    setIsRunning(true);
    try {
      const result = await executeCode({
        language: 'sql',
        code: 'CREATE TABLE users (id INT, name TEXT);\nINSERT INTO users VALUES (1, \'Alice\');\nSELECT * FROM users;',
        input: ''
      });
      setResult(`Success: ${result.success}\nOutput: ${result.output}\nService: ${result.service}`);
    } catch (error: any) {
      setResult(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Quick Code Execution Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Button onClick={testJavaScript} disabled={isRunning}>
            <Play className="h-4 w-4 mr-2" />
            Test JavaScript
          </Button>
          <Button onClick={testPython} disabled={isRunning}>
            <Play className="h-4 w-4 mr-2" />
            Test Python
          </Button>
          <Button onClick={testSQL} disabled={isRunning}>
            <Play className="h-4 w-4 mr-2" />
            Test SQL
          </Button>
        </div>

        {result && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Result:</h3>
            <pre className="bg-muted p-4 rounded-lg text-sm whitespace-pre-wrap">
              {result}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}