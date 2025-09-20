// Real code compilation and execution service using Piston API
// This service provides actual compilation and execution for all programming languages

import { runCodeWithPiston, PistonLanguages, testPistonConnection } from './piston';

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
  language: keyof typeof PistonLanguages;
  code: string;
  input?: string;
}

// Main execution function using Piston API
export async function executeCode(request: CodeRequest): Promise<ExecutionResult> {
  const startTime = Date.now();
  
  try {
    const result = await runCodeWithPiston(request.language, request.code, request.input);
    
    return {
      success: result.run.code === 0,
      output: result.run.stdout || result.run.output || '',
      error: result.run.stderr || (result.compile?.stderr) || undefined,
      executionTime: Date.now() - startTime,
      exitCode: result.run.code,
      service: 'Piston'
    };
  } catch (error: any) {
    return {
      success: false,
      output: '',
      error: `Execution failed: ${error.message}`,
      executionTime: Date.now() - startTime,
      exitCode: 1,
      service: 'Piston'
    };
  }
}

// Test execution service
export async function testExecutionService(): Promise<boolean> {
  try {
    return await testPistonConnection();
  } catch {
    return false;
  }
}

// Format execution result for display
export function formatExecutionResult(result: ExecutionResult): string {
  const parts: string[] = [];
  
  if (result.success) {
    parts.push('✅ Execution completed successfully');
  } else {
    parts.push('❌ Execution failed');
  }
  
  const metadata: string[] = [];
  if (result.executionTime) {
    metadata.push(`⏱️ ${result.executionTime.toFixed(0)}ms`);
  }
  if (result.exitCode !== undefined) {
    metadata.push(`🔢 Exit: ${result.exitCode}`);
  }
  metadata.push(`🔧 ${result.service}`);
  
  if (metadata.length > 0) {
    parts.push(metadata.join(' | '));
  }
  
  parts.push('');
  
  if (result.output) {
    parts.push('📤 Output:');
    parts.push(result.output);
  }
  
  if (result.error) {
    parts.push('');
    parts.push('🚨 Error Details:');
    parts.push(result.error);
  }
  
  return parts.join('\n');
}
