// Real code compilation and execution service
// This service provides actual compilation and execution for all programming languages

export interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime: number;
  memory?: number;
  exitCode?: number;
  service: string;
}

export interface CodeRequest {
  language: string;
  code: string;
  input?: string;
}

// Language configurations for different execution services
const LANGUAGE_CONFIGS = {
  // Judge0 CE API (most reliable)
  judge0: {
    baseUrl: 'https://judge0-ce.p.rapidapi.com',
    languages: {
      javascript: 63,
      python: 71,
      java: 62,
      cpp: 54,
      c: 50,
      csharp: 51,
      php: 68,
      ruby: 72,
      go: 60,
      rust: 73,
      sql: 82,
      typescript: 74,
      kotlin: 78,
      swift: 83
    }
  },
  // Piston API (free alternative)
  piston: {
    baseUrl: 'https://emkc.org/api/v2/piston',
    languages: {
      javascript: 'javascript',
      python: 'python',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      csharp: 'csharp',
      php: 'php',
      ruby: 'ruby',
      go: 'go',
      rust: 'rust',
      typescript: 'typescript'
    }
  },
  // CodeX API (backup)
  codex: {
    baseUrl: 'https://api.codex.jaagrav.in',
    languages: {
      javascript: 'js',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      php: 'php',
      ruby: 'rb',
      go: 'go'
    }
  }
};

// Execute code using Judge0 API
async function executeWithJudge0(request: CodeRequest): Promise<ExecutionResult> {
  const startTime = Date.now();
  
  try {
    const languageId = LANGUAGE_CONFIGS.judge0.languages[request.language as keyof typeof LANGUAGE_CONFIGS.judge0.languages];
    if (!languageId) {
      throw new Error(`Language ${request.language} not supported by Judge0`);
    }

    // Get API key from environment or localStorage
    const apiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY || 
                   (typeof window !== 'undefined' ? localStorage.getItem('rapidapi_key') : null);

    if (!apiKey || apiKey === 'your-rapidapi-key-here') {
      throw new Error('Judge0 API key not configured');
    }

    // Submit code for execution
    const submitResponse = await fetch(`${LANGUAGE_CONFIGS.judge0.baseUrl}/submissions?base64_encoded=true&wait=false`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      },
      body: JSON.stringify({
        language_id: languageId,
        source_code: btoa(request.code),
        stdin: request.input ? btoa(request.input) : '',
        cpu_time_limit: 10,
        memory_limit: 256000
      })
    });

    if (!submitResponse.ok) {
      const errorText = await submitResponse.text();
      throw new Error(`Judge0 submission failed: ${submitResponse.status} - ${errorText}`);
    }

    const { token } = await submitResponse.json();

    // Poll for result
    let result;
    let attempts = 0;
    const maxAttempts = 20;

    do {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const resultResponse = await fetch(`${LANGUAGE_CONFIGS.judge0.baseUrl}/submissions/${token}?base64_encoded=true`, {
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        }
      });

      if (!resultResponse.ok) {
        throw new Error(`Failed to get result: ${resultResponse.status}`);
      }

      result = await resultResponse.json();
      attempts++;
    } while (result.status.id <= 2 && attempts < maxAttempts);

    // Decode outputs
    const stdout = result.stdout ? atob(result.stdout) : '';
    const stderr = result.stderr ? atob(result.stderr) : '';
    const compile_output = result.compile_output ? atob(result.compile_output) : '';

    let output = '';
    if (stdout) output += stdout;
    if (stderr) output += (output ? '\n' : '') + stderr;
    if (compile_output) output += (output ? '\n' : '') + compile_output;

    return {
      success: result.status.id === 3, // Accepted
      output: output || 'Program executed successfully with no output',
      error: result.status.id !== 3 ? result.status.description : undefined,
      executionTime: result.time ? parseFloat(result.time) * 1000 : Date.now() - startTime,
      memory: result.memory,
      exitCode: result.exit_code,
      service: 'Judge0'
    };

  } catch (error: any) {
    throw new Error(`Judge0 execution failed: ${error.message}`);
  }
}

// Execute code using Piston API
async function executeWithPiston(request: CodeRequest): Promise<ExecutionResult> {
  const startTime = Date.now();
  
  try {
    const language = LANGUAGE_CONFIGS.piston.languages[request.language as keyof typeof LANGUAGE_CONFIGS.piston.languages];
    if (!language) {
      throw new Error(`Language ${request.language} not supported by Piston`);
    }

    const response = await fetch(`${LANGUAGE_CONFIGS.piston.baseUrl}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: language,
        version: '*',
        files: [
          {
            name: `main.${getFileExtension(request.language)}`,
            content: request.code
          }
        ],
        stdin: request.input || '',
        compile_timeout: 10000,
        run_timeout: 5000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Piston API failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    let output = '';
    let hasError = false;

    if (result.compile && result.compile.stderr) {
      output += `Compilation Error:\n${result.compile.stderr}`;
      hasError = true;
    }

    if (result.run) {
      if (result.run.stdout) {
        output += (output ? '\n' : '') + result.run.stdout;
      }
      if (result.run.stderr) {
        output += (output ? '\n' : '') + `Runtime Error:\n${result.run.stderr}`;
        hasError = true;
      }
    }

    return {
      success: !hasError && (result.run ? result.run.code === 0 : true),
      output: output || 'Program executed successfully with no output',
      error: hasError ? 'Execution completed with errors' : undefined,
      executionTime: Date.now() - startTime,
      exitCode: result.run ? result.run.code : 0,
      service: 'Piston'
    };

  } catch (error: any) {
    throw new Error(`Piston execution failed: ${error.message}`);
  }
}

// Execute code using CodeX API
async function executeWithCodeX(request: CodeRequest): Promise<ExecutionResult> {
  const startTime = Date.now();
  
  try {
    const language = LANGUAGE_CONFIGS.codex.languages[request.language as keyof typeof LANGUAGE_CONFIGS.codex.languages];
    if (!language) {
      throw new Error(`Language ${request.language} not supported by CodeX`);
    }

    const response = await fetch(`${LANGUAGE_CONFIGS.codex.baseUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: request.code,
        language: language,
        input: request.input || ''
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`CodeX API failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    return {
      success: !result.error,
      output: result.output || result.error || 'Program executed successfully with no output',
      error: result.error ? 'Execution error occurred' : undefined,
      executionTime: result.timeStamp || Date.now() - startTime,
      service: 'CodeX'
    };

  } catch (error: any) {
    throw new Error(`CodeX execution failed: ${error.message}`);
  }
}

// Execute JavaScript locally (real execution)
async function executeJavaScriptLocally(request: CodeRequest): Promise<ExecutionResult> {
  const startTime = Date.now();
  
  try {
    const logs: string[] = [];
    const errors: string[] = [];
    
    // Create a comprehensive console mock
    const mockConsole = {
      log: (...args: any[]) => {
        logs.push(args.map(arg => {
          if (typeof arg === 'object' && arg !== null) {
            try {
              return JSON.stringify(arg, null, 2);
            } catch {
              return String(arg);
            }
          }
          return String(arg);
        }).join(' '));
      },
      error: (...args: any[]) => errors.push('ERROR: ' + args.join(' ')),
      warn: (...args: any[]) => logs.push('WARNING: ' + args.join(' ')),
      info: (...args: any[]) => logs.push('INFO: ' + args.join(' ')),
      debug: (...args: any[]) => logs.push('DEBUG: ' + args.join(' ')),
      clear: () => { logs.length = 0; errors.length = 0; },
      table: (data: any) => logs.push('TABLE: ' + JSON.stringify(data, null, 2)),
      time: (label: string) => logs.push(`TIMER START: ${label}`),
      timeEnd: (label: string) => logs.push(`TIMER END: ${label}`)
    };

    // Create safe globals
    const safeGlobals = {
      console: mockConsole,
      input: request.input || '',
      Math: Math,
      Date: Date,
      JSON: JSON,
      parseInt: parseInt,
      parseFloat: parseFloat,
      isNaN: isNaN,
      isFinite: isFinite,
      Array: Array,
      Object: Object,
      String: String,
      Number: Number,
      Boolean: Boolean,
      RegExp: RegExp,
      Promise: Promise,
      setTimeout: (fn: Function, delay: number) => {
        if (delay > 5000) delay = 5000;
        return setTimeout(fn, delay);
      },
      setInterval: (fn: Function, delay: number) => {
        if (delay < 100) delay = 100;
        return setInterval(fn, delay);
      }
    };

    // Execute with timeout
    const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
    const func = new AsyncFunction(...Object.keys(safeGlobals), request.code);
    
    await Promise.race([
      func(...Object.values(safeGlobals)),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Execution timeout (10 seconds)')), 10000)
      )
    ]);

    const output = [...logs, ...errors].join('\n');

    return {
      success: errors.length === 0,
      output: output || 'JavaScript executed successfully with no output',
      error: errors.length > 0 ? 'Runtime errors occurred' : undefined,
      executionTime: Date.now() - startTime,
      service: 'Local JavaScript Engine'
    };

  } catch (error: any) {
    return {
      success: false,
      output: '',
      error: `JavaScript Runtime Error: ${error.message}`,
      executionTime: Date.now() - startTime,
      service: 'Local JavaScript Engine'
    };
  }
}

// Get file extension for language
function getFileExtension(language: string): string {
  const extensions: Record<string, string> = {
    javascript: 'js',
    python: 'py',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    csharp: 'cs',
    php: 'php',
    ruby: 'rb',
    go: 'go',
    rust: 'rs',
    typescript: 'ts',
    kotlin: 'kt',
    swift: 'swift'
  };
  return extensions[language] || 'txt';
}

// Main execution function with intelligent fallback
export async function executeCode(request: CodeRequest): Promise<ExecutionResult> {
  const { language, code, input } = request;

  if (!code.trim()) {
    return {
      success: false,
      output: '',
      error: 'No code provided',
      executionTime: 0,
      service: 'Validator'
    };
  }

  // Special handling for JavaScript - use local execution for better performance
  if (language === 'javascript') {
    try {
      return await executeJavaScriptLocally(request);
    } catch (error) {
      console.log('Local JS execution failed, trying remote services...');
    }
  }

  // Try execution services in order of preference
  const executors = [
    { name: 'Judge0', execute: executeWithJudge0 },
    { name: 'Piston', execute: executeWithPiston },
    { name: 'CodeX', execute: executeWithCodeX }
  ];

  let lastError = '';

  for (const executor of executors) {
    try {
      console.log(`🚀 Attempting execution with ${executor.name} for ${language}...`);
      const result = await executor.execute(request);
      
      if (result.success || result.output) {
        console.log(`✅ ${executor.name} execution successful for ${language}`);
        return result;
      }
      
      lastError = result.error || 'Unknown error';
      console.log(`⚠️ ${executor.name} execution completed with issues: ${lastError}`);
      
    } catch (error: any) {
      console.log(`❌ ${executor.name} execution failed for ${language}:`, error.message);
      lastError = error.message;
      continue;
    }
  }

  // If all real execution services fail, return enhanced simulation
  console.log('🔄 All execution services failed, using enhanced simulation...');
  return {
    success: false,
    output: `⚠️ Real execution services are currently unavailable.\n\nLast error: ${lastError}\n\n🔧 Enhanced Simulation:\nYour ${language} code would produce output here.\n\n💡 To enable real execution:\n1. Get a free RapidAPI key from Judge0\n2. Click the "Setup Required" button\n3. Enter your API key\n\nFree tier includes 500 executions per month!`,
    error: 'Real execution services unavailable',
    executionTime: 100,
    service: 'Enhanced Simulation'
  };
}

// Test connection to execution services
export async function testExecutionServices(): Promise<{ [key: string]: boolean }> {
  const results: { [key: string]: boolean } = {};

  // Test Judge0
  try {
    const apiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY || 
                   (typeof window !== 'undefined' ? localStorage.getItem('rapidapi_key') : null);
    
    if (apiKey && apiKey !== 'your-rapidapi-key-here') {
      const response = await fetch('https://judge0-ce.p.rapidapi.com/languages', {
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        }
      });
      results.judge0 = response.ok;
    } else {
      results.judge0 = false;
    }
  } catch {
    results.judge0 = false;
  }

  // Test Piston
  try {
    const response = await fetch('https://emkc.org/api/v2/piston/runtimes');
    results.piston = response.ok;
  } catch {
    results.piston = false;
  }

  // Test CodeX
  try {
    const response = await fetch('https://api.codex.jaagrav.in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'print("test")', language: 'py', input: '' })
    });
    results.codex = response.ok;
  } catch {
    results.codex = false;
  }

  return results;
}

// Format execution result for display
export function formatExecutionResult(result: ExecutionResult): string {
  const parts: string[] = [];
  
  // Status header
  if (result.success) {
    parts.push('✅ Execution completed successfully');
  } else {
    parts.push('❌ Execution failed');
  }
  
  // Metadata
  const metadata: string[] = [];
  if (result.executionTime) {
    metadata.push(`⏱️ ${result.executionTime.toFixed(0)}ms`);
  }
  if (result.memory) {
    metadata.push(`💾 ${result.memory} KB`);
  }
  if (result.exitCode !== undefined) {
    metadata.push(`🔢 Exit code: ${result.exitCode}`);
  }
  metadata.push(`🔧 ${result.service}`);
  
  if (metadata.length > 0) {
    parts.push(metadata.join(' | '));
  }
  
  parts.push(''); // Empty line
  
  // Output
  if (result.output) {
    parts.push('📤 Output:');
    parts.push(result.output);
  }
  
  // Error
  if (result.error) {
    parts.push('');
    parts.push('🚨 Error Details:');
    parts.push(result.error);
  }
  
  return parts.join('\n');
}