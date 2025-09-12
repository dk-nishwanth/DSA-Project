import { Language } from '../config/languages';

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
  private baseUrl: string;

  constructor() {
    // Use environment variable or default to localhost
    this.baseUrl = process.env.REACT_APP_EXECUTION_API_URL || 'http://localhost:3001/api';
  }

  async executeCode(request: ExecutionRequest): Promise<ExecutionResult> {
    try {
      const response = await fetch(`${this.baseUrl}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: request.code,
          language: request.language.id,
          input: request.input || '',
          filename: request.filename || `main${request.language.extension}`,
          dockerImage: request.language.dockerImage,
          compileCommand: request.language.compileCommand,
          runCommand: request.language.runCommand,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
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
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const codeExecutionService = new CodeExecutionService();