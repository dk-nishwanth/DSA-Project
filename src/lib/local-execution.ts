// Local code execution engine - similar to personal codespace
// This provides code execution without relying on external APIs

export interface LocalExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime: number;
  language: string;
  version: string;
}

// JavaScript execution using eval (sandboxed)
function executeJavaScript(code: string, input: string = ''): LocalExecutionResult {
  const startTime = Date.now();
  let output = '';
  let error = '';
  let success = true;

  try {
    // Create a sandboxed console
    const logs: string[] = [];
    const sandboxConsole = {
      log: (...args: any[]) => {
        logs.push(args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
      },
      error: (...args: any[]) => {
        logs.push('ERROR: ' + args.map(arg => String(arg)).join(' '));
      },
      warn: (...args: any[]) => {
        logs.push('WARN: ' + args.map(arg => String(arg)).join(' '));
      }
    };

    // Create sandboxed environment
    const sandbox = {
      console: sandboxConsole,
      Math,
      Date,
      JSON,
      Array,
      Object,
      String,
      Number,
      Boolean,
      parseInt,
      parseFloat,
      isNaN,
      isFinite,
      setTimeout: undefined, // Disable for security
      setInterval: undefined, // Disable for security
      eval: undefined, // Disable for security
      Function: undefined, // Disable for security
    };

    // Execute code in sandbox
    const func = new Function('sandbox', 'input', `
      with (sandbox) {
        ${code}
      }
    `);
    
    func(sandbox, input);
    output = logs.join('\n');

  } catch (err) {
    success = false;
    error = err instanceof Error ? err.message : String(err);
    output = '';
  }

  return {
    success,
    output,
    error,
    executionTime: Date.now() - startTime,
    language: 'javascript',
    version: 'Local Engine 1.0'
  };
}

// Python-like execution (basic interpreter)
function executePython(code: string, input: string = ''): LocalExecutionResult {
  const startTime = Date.now();
  let output = '';
  let error = '';
  let success = true;

  try {
    // Basic Python-to-JavaScript transpilation for simple cases
    let jsCode = code
      // Convert print statements
      .replace(/print\s*\(\s*([^)]+)\s*\)/g, 'console.log($1)')
      // Convert Python comments
      .replace(/#(.+)/g, '// $1')
      // Convert Python string formatting (basic)
      .replace(/f"([^"]+)"/g, '`$1`')
      // Convert Python variables (basic)
      .replace(/def\s+(\w+)\s*\(([^)]*)\)\s*:/g, 'function $1($2) {')
      // Convert if statements
      .replace(/if\s+(.+):/g, 'if ($1) {')
      // Convert elif to else if
      .replace(/elif\s+(.+):/g, '} else if ($1) {')
      // Convert else
      .replace(/else\s*:/g, '} else {')
      // Convert for loops (basic)
      .replace(/for\s+(\w+)\s+in\s+range\s*\(\s*(\d+)\s*\)\s*:/g, 'for (let $1 = 0; $1 < $2; $1++) {')
      // Convert while loops
      .replace(/while\s+(.+):/g, 'while ($1) {')
      // Add closing braces (basic heuristic)
      .split('\n')
      .map(line => {
        const trimmed = line.trim();
        if (trimmed.endsWith(':')) {
          return line.replace(':', ' {');
        }
        return line;
      })
      .join('\n');

    // Add closing braces for Python indentation (simplified)
    const lines = jsCode.split('\n');
    const result = [];
    let braceCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      
      if (trimmed.includes('{')) {
        braceCount++;
      }
      
      result.push(line);
      
      // Add closing brace if this is the last line or next line is not indented
      if (i === lines.length - 1 || (lines[i + 1] && !lines[i + 1].startsWith('  '))) {
        while (braceCount > 0) {
          result.push('}');
          braceCount--;
        }
      }
    }

    jsCode = result.join('\n');

    // Execute the converted JavaScript
    const jsResult = executeJavaScript(jsCode, input);
    return {
      ...jsResult,
      language: 'python',
      version: 'Python-to-JS Transpiler 1.0'
    };

  } catch (err) {
    success = false;
    error = err instanceof Error ? err.message : String(err);
    output = '';
  }

  return {
    success,
    output,
    error,
    executionTime: Date.now() - startTime,
    language: 'python',
    version: 'Python-to-JS Transpiler 1.0'
  };
}

// Java execution (basic simulation)
function executeJava(code: string, input: string = ''): LocalExecutionResult {
  const startTime = Date.now();
  let output = '';
  let error = '';
  let success = true;

  try {
    // Extract System.out.println statements and convert to console.log
    let jsCode = code
      // Convert System.out.println
      .replace(/System\.out\.println\s*\(\s*([^)]+)\s*\)/g, 'console.log($1)')
      // Convert System.out.print
      .replace(/System\.out\.print\s*\(\s*([^)]+)\s*\)/g, 'console.log($1)')
      // Remove class declaration
      .replace(/public\s+class\s+\w+\s*\{/, '')
      // Convert main method
      .replace(/public\s+static\s+void\s+main\s*\([^)]*\)\s*\{/, '')
      // Remove access modifiers
      .replace(/public\s+static\s+/g, '')
      .replace(/private\s+static\s+/g, '')
      .replace(/protected\s+static\s+/g, '')
      // Convert variable declarations
      .replace(/int\s+(\w+)/g, 'let $1')
      .replace(/String\s+(\w+)/g, 'let $1')
      .replace(/double\s+(\w+)/g, 'let $1')
      .replace(/float\s+(\w+)/g, 'let $1')
      .replace(/boolean\s+(\w+)/g, 'let $1')
      // Remove extra braces
      .replace(/^\s*\}\s*$/gm, '');

    // Clean up the code
    jsCode = jsCode.trim();
    
    // Execute the converted JavaScript
    const jsResult = executeJavaScript(jsCode, input);
    return {
      ...jsResult,
      language: 'java',
      version: 'Java-to-JS Transpiler 1.0'
    };

  } catch (err) {
    success = false;
    error = err instanceof Error ? err.message : String(err);
    output = '';
  }

  return {
    success,
    output,
    error,
    executionTime: Date.now() - startTime,
    language: 'java',
    version: 'Java-to-JS Transpiler 1.0'
  };
}

// C++ execution (basic simulation)
function executeCpp(code: string, input: string = ''): LocalExecutionResult {
  const startTime = Date.now();
  let output = '';
  let error = '';
  let success = true;

  try {
    // Convert C++ to JavaScript
    let jsCode = code
      // Convert cout statements
      .replace(/cout\s*<<\s*([^;]+)\s*;/g, (match, content) => {
        // Handle endl
        content = content.replace(/\s*<<\s*endl/g, '');
        return `console.log(${content});`;
      })
      // Convert cin statements (basic)
      .replace(/cin\s*>>\s*(\w+)\s*;/g, 'let $1 = input;')
      // Remove includes
      .replace(/#include\s*<[^>]+>/g, '')
      // Remove using namespace
      .replace(/using\s+namespace\s+std\s*;/g, '')
      // Convert main function
      .replace(/int\s+main\s*\(\s*\)\s*\{/, '')
      // Convert variable declarations
      .replace(/int\s+(\w+)/g, 'let $1')
      .replace(/string\s+(\w+)/g, 'let $1')
      .replace(/double\s+(\w+)/g, 'let $1')
      .replace(/float\s+(\w+)/g, 'let $1')
      .replace(/bool\s+(\w+)/g, 'let $1')
      // Remove return 0
      .replace(/return\s+0\s*;/g, '')
      // Remove extra braces
      .replace(/^\s*\}\s*$/gm, '');

    // Clean up the code
    jsCode = jsCode.trim();
    
    // Execute the converted JavaScript
    const jsResult = executeJavaScript(jsCode, input);
    return {
      ...jsResult,
      language: 'cpp',
      version: 'C++-to-JS Transpiler 1.0'
    };

  } catch (err) {
    success = false;
    error = err instanceof Error ? err.message : String(err);
    output = '';
  }

  return {
    success,
    output,
    error,
    executionTime: Date.now() - startTime,
    language: 'cpp',
    version: 'C++-to-JS Transpiler 1.0'
  };
}

// Main execution function
export async function executeCodeLocally(
  language: string,
  code: string,
  input: string = ''
): Promise<LocalExecutionResult> {
  
  // Normalize language name
  const normalizedLanguage = language.toLowerCase();
  
  switch (normalizedLanguage) {
    case 'javascript':
    case 'js':
      return executeJavaScript(code, input);
      
    case 'python':
    case 'py':
      return executePython(code, input);
      
    case 'java':
      return executeJava(code, input);
      
    case 'cpp':
    case 'c++':
      return executeCpp(code, input);
      
    case 'c':
      // C is similar to C++ for basic cases
      return executeCpp(code, input);
      
    default:
      return {
        success: false,
        output: '',
        error: `Language '${language}' is not supported by local execution engine. Supported languages: JavaScript, Python, Java, C++, C`,
        executionTime: 0,
        language: normalizedLanguage,
        version: 'Local Engine 1.0'
      };
  }
}

// Test if local execution is available (always true)
export function isLocalExecutionAvailable(): boolean {
  return true;
}

// Get supported languages
export function getSupportedLanguages(): string[] {
  return ['javascript', 'python', 'java', 'cpp', 'c'];
}
