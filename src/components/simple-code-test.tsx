import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { executeCode, formatExecutionResult } from '@/lib/direct-executor';
import { Play, Loader2 } from 'lucide-react';

export function SimpleCodeTest() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<string>('');

  const testLanguage = async (language: string, code: string) => {
    setIsRunning(true);
    try {
      const result = await executeCode({ language, code, input: '' });
      setResult(formatExecutionResult(result));
    } catch (error: any) {
      setResult(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const tests = [
    {
      name: 'JavaScript',
      language: 'javascript',
      code: 'console.log("Hello from JavaScript!");\nconsole.log("Math: 2 + 2 =", 2 + 2);\nconsole.log("Array:", [1, 2, 3]);'
    },
    {
      name: 'Python',
      language: 'python',
      code: 'print("Hello from Python!")\nprint("Math: 2 + 2 =", 2 + 2)\nprint("List:", [1, 2, 3])'
    },
    {
      name: 'Java',
      language: 'java',
      code: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Java!");\n        System.out.println("Math: 2 + 2 = " + (2 + 2));\n    }\n}'
    },
    {
      name: 'C++',
      language: 'cpp',
      code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello from C++!" << endl;\n    cout << "Math: 2 + 2 = " << (2 + 2) << endl;\n    return 0;\n}'
    },
    {
      name: 'SQL',
      language: 'sql',
      code: 'CREATE TABLE users (id INT, name TEXT);\nINSERT INTO users VALUES (1, \'Alice\'), (2, \'Bob\');\nSELECT * FROM users;'
    }
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Code Execution Test</CardTitle>
        <CardDescription>
          Test real code execution for different programming languages
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {tests.map((test) => (
            <Button
              key={test.language}
              onClick={() => testLanguage(test.language, test.code)}
              disabled={isRunning}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              {isRunning ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              <span className="font-medium">{test.name}</span>
            </Button>
          ))}
        </div>

        {result && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Execution Result:</h3>
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">
              {result}
            </pre>
          </div>
        )}

        <div className="text-sm text-muted-foreground">
          💡 <strong>Note:</strong> To enable real execution for all languages, get a free RapidAPI key 
          from Judge0 and configure it using the "Setup Required" button in the code playground.
        </div>
      </CardContent>
    </Card>
  );
}