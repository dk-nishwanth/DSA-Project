import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { executeCode, testAllServices, formatExecutionResult } from '@/lib/universal-code-executor';
import { Play, CheckCircle, AlertCircle, Loader2, RefreshCw } from 'lucide-react';

interface TestResult {
  language: string;
  success: boolean;
  output: string;
  error?: string;
  executionTime: number;
  service: string;
}

export function LanguageExecutionTest() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [serviceStatus, setServiceStatus] = useState<{ [key: string]: boolean }>({});
  const [progress, setProgress] = useState(0);

  const testCodes = {
    javascript: {
      code: 'console.log("✅ JavaScript execution successful!");\nconsole.log("Math: 2 + 2 =", 2 + 2);\nconsole.log("Array:", [1, 2, 3, 4, 5]);\nconsole.log("Object:", {name: "Test", value: 42});',
      name: 'JavaScript'
    },
    python: {
      code: 'print("✅ Python execution successful!")\nprint("Math: 2 + 2 =", 2 + 2)\nprint("List:", [1, 2, 3, 4, 5])\nprint("Dict:", {"name": "Test", "value": 42})\nimport datetime\nprint("Time:", datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))',
      name: 'Python'
    },
    java: {
      code: 'import java.time.LocalDateTime;\nimport java.util.Arrays;\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("✅ Java execution successful!");\n        System.out.println("Math: 2 + 2 = " + (2 + 2));\n        System.out.println("Array: " + Arrays.toString(new int[]{1, 2, 3, 4, 5}));\n        System.out.println("Time: " + LocalDateTime.now());\n    }\n}',
      name: 'Java'
    },
    c: {
      code: '#include <stdio.h>\n#include <time.h>\n\nint main() {\n    printf("✅ C execution successful!\\n");\n    printf("Math: 2 + 2 = %d\\n", 2 + 2);\n    \n    int arr[] = {1, 2, 3, 4, 5};\n    printf("Array: [");\n    for(int i = 0; i < 5; i++) {\n        printf("%d", arr[i]);\n        if(i < 4) printf(", ");\n    }\n    printf("]\\n");\n    \n    time_t t = time(NULL);\n    printf("Time: %s", ctime(&t));\n    return 0;\n}',
      name: 'C'
    },
    cpp: {
      code: '#include <iostream>\n#include <vector>\n#include <chrono>\n#include <iomanip>\nusing namespace std;\n\nint main() {\n    cout << "✅ C++ execution successful!" << endl;\n    cout << "Math: 2 + 2 = " << (2 + 2) << endl;\n    \n    vector<int> vec = {1, 2, 3, 4, 5};\n    cout << "Vector: [";\n    for(size_t i = 0; i < vec.size(); i++) {\n        cout << vec[i];\n        if(i < vec.size() - 1) cout << ", ";\n    }\n    cout << "]" << endl;\n    \n    auto now = chrono::system_clock::now();\n    auto time_t = chrono::system_clock::to_time_t(now);\n    cout << "Time: " << put_time(localtime(&time_t), "%Y-%m-%d %H:%M:%S") << endl;\n    return 0;\n}',
      name: 'C++'
    },
    csharp: {
      code: 'using System;\nusing System.Linq;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("✅ C# execution successful!");\n        Console.WriteLine("Math: 2 + 2 = " + (2 + 2));\n        \n        int[] array = {1, 2, 3, 4, 5};\n        Console.WriteLine("Array: [" + string.Join(", ", array) + "]");\n        \n        Console.WriteLine("Time: " + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));\n    }\n}',
      name: 'C#'
    },
    php: {
      code: '<?php\necho "✅ PHP execution successful!\\n";\necho "Math: 2 + 2 = " . (2 + 2) . "\\n";\n\n$array = [1, 2, 3, 4, 5];\necho "Array: [" . implode(", ", $array) . "]\\n";\n\n$assoc = ["name" => "Test", "value" => 42];\necho "Assoc Array: " . json_encode($assoc) . "\\n";\n\necho "Time: " . date("Y-m-d H:i:s") . "\\n";\n?>',
      name: 'PHP'
    },
    ruby: {
      code: 'puts "✅ Ruby execution successful!"\nputs "Math: 2 + 2 = #{2 + 2}"\n\narray = [1, 2, 3, 4, 5]\nputs "Array: #{array}"\n\nhash = {name: "Test", value: 42}\nputs "Hash: #{hash}"\n\nputs "Time: #{Time.now.strftime(\'%Y-%m-%d %H:%M:%S\')}"',
      name: 'Ruby'
    },
    go: {
      code: 'package main\n\nimport (\n    "fmt"\n    "time"\n)\n\nfunc main() {\n    fmt.Println("✅ Go execution successful!")\n    fmt.Println("Math: 2 + 2 =", 2 + 2)\n    \n    slice := []int{1, 2, 3, 4, 5}\n    fmt.Println("Slice:", slice)\n    \n    m := map[string]interface{}{\n        "name": "Test",\n        "value": 42,\n    }\n    fmt.Println("Map:", m)\n    \n    fmt.Println("Time:", time.Now().Format("2006-01-02 15:04:05"))\n}',
      name: 'Go'
    },
    rust: {
      code: 'use std::collections::HashMap;\nuse std::time::SystemTime;\n\nfn main() {\n    println!("✅ Rust execution successful!");\n    println!("Math: 2 + 2 = {}", 2 + 2);\n    \n    let vec = vec![1, 2, 3, 4, 5];\n    println!("Vector: {:?}", vec);\n    \n    let mut map = HashMap::new();\n    map.insert("name", "Test");\n    map.insert("value", "42");\n    println!("HashMap: {:?}", map);\n    \n    println!("Time: {:?}", SystemTime::now());\n}',
      name: 'Rust'
    },
    sql: {
      code: '-- SQL execution test\nCREATE TABLE users (\n    id INTEGER PRIMARY KEY,\n    name TEXT NOT NULL,\n    age INTEGER,\n    email TEXT\n);\n\nINSERT INTO users (name, age, email) VALUES \n    (\'Alice\', 25, \'alice@example.com\'),\n    (\'Bob\', 30, \'bob@example.com\'),\n    (\'Charlie\', 35, \'charlie@example.com\'),\n    (\'Diana\', 28, \'diana@example.com\');\n\nSELECT name, age FROM users WHERE age > 27 ORDER BY age;\n\nSELECT COUNT(*) as total_users FROM users;\n\nUPDATE users SET age = age + 1 WHERE name = \'Alice\';\n\nSELECT * FROM users WHERE name = \'Alice\';',
      name: 'SQL'
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setResults([]);
    setProgress(0);

    const languages = Object.keys(testCodes);
    const totalTests = languages.length;

    for (let i = 0; i < languages.length; i++) {
      const language = languages[i];
      const testData = testCodes[language as keyof typeof testCodes];

      try {
        const result = await executeCode({
          language,
          code: testData.code,
          input: ''
        });

        setResults(prev => [...prev, {
          language: testData.name,
          success: result.success,
          output: result.output,
          error: result.error,
          executionTime: result.executionTime,
          service: result.service
        }]);

      } catch (error: any) {
        setResults(prev => [...prev, {
          language: testData.name,
          success: false,
          output: '',
          error: error.message,
          executionTime: 0,
          service: 'Error'
        }]);
      }

      setProgress(((i + 1) / totalTests) * 100);
    }

    setIsRunning(false);
  };

  const testServices = async () => {
    setIsRunning(true);
    try {
      const status = await testAllServices();
      setServiceStatus(status);
    } catch (error) {
      console.error('Service test failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Universal Code Execution Test
          </CardTitle>
          <CardDescription>
            Test real compilation and execution across all supported programming languages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Control Buttons */}
          <div className="flex gap-4">
            <Button onClick={runAllTests} disabled={isRunning} className="flex items-center gap-2">
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Test All Languages
                </>
              )}
            </Button>
            <Button variant="outline" onClick={testServices} disabled={isRunning}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Test Services
            </Button>
          </div>

          {/* Progress */}
          {isRunning && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Testing languages...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Service Status */}
          {Object.keys(serviceStatus).length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Execution Services Status</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
          )}

          {/* Results Summary */}
          {results.length > 0 && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Test Results:</strong> {successCount}/{totalCount} languages executed successfully
                {successCount === totalCount ? " 🎉" : ". Some languages may need API key configuration."}
              </AlertDescription>
            </Alert>
          )}

          {/* Language Results */}
          {results.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Execution Results</h3>
              <div className="grid gap-4">
                {results.map((result, index) => (
                  <Card key={index} className={result.success ? "border-green-200" : "border-red-200"}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          {result.success ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          )}
                          {result.language}
                        </CardTitle>
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
                          <pre className="bg-muted p-3 rounded-lg text-sm overflow-x-auto max-h-40">
                            {result.output}
                          </pre>
                        </div>
                      )}
                      {result.error && (
                        <div className="space-y-2 mt-3">
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

          {/* Setup Instructions */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>To enable real execution for all languages:</strong>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Code execution is powered by the free Piston API</li>
                <li>No API keys or setup required</li>
                <li>Simply click run to execute your code instantly</li>
                <li>Supports 12+ programming languages out of the box!</li>
              </ol>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}