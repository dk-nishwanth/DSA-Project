import { runCodeWithPiston, PistonLanguages, testPistonConnection } from '../lib/piston';

export interface ExecutionRequest {
  code: string;
  language: keyof typeof PistonLanguages;
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
      
      const result = await runCodeWithPiston(
        request.language,
        request.code,
        request.input
      );

      const executionTime = Date.now() - startTime;

      // Convert Piston result to our format
      return {
        success: result.run.code === 0,
        output: result.run.stdout || result.run.output || '',
        error: result.run.stderr || (result.compile?.stderr) || undefined,
        executionTime: executionTime,
        memoryUsage: undefined // Piston doesn't provide memory usage
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
      return await testPistonConnection();
    } catch {
      return false;
    }
  }
}

export const codeExecutionService = new CodeExecutionService();