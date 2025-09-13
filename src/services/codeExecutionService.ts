import { Language } from '../config/languages';
import { runOnJudge0, Judge0Result } from '../lib/judge0';

export interface ExecutionRequest {
  code: string;
  language: Language;
  input?: string;
  filename?: string;
}

export interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime: number;
  memoryUsage?: number;
}

class CodeExecutionService {
  async executeCode(request: ExecutionRequest): Promise<ExecutionResult> {
    try {
      const startTime = Date.now();
      
      const result: Judge0Result = await runOnJudge0({
        languageId: request.language.judge0LanguageId,
        source: request.code,
        stdin: request.input
      });

      const executionTime = Date.now() - startTime;

      // Convert Judge0 result to our format
      return {
        success: result.status.id === 3, // 3 = Accepted
        output: result.stdout || result.compile_output || result.stderr || '',
        error: result.status.id !== 3 ? result.status.description : undefined,
        executionTime: executionTime,
        memoryUsage: result.memory
      };
    } catch (error) {
      console.error('Code execution error:', error);
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        executionTime: 0,
      };
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      // Test with a simple Python code
      const testResult = await runOnJudge0({
        languageId: 71, // Python
        source: 'print("Health check")'
      });
      return testResult.status.id !== 0; // 0 means error
    } catch {
      return false;
    }
  }
}

export const codeExecutionService = new CodeExecutionService();