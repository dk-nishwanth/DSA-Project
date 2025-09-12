export interface ExecutionRequest {
  code: string;
  language: string;
  input?: string;
  filename: string;
  dockerImage: string;
  compileCommand?: string;
  runCommand: string;
}

export interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime: number;
  memoryUsage?: number;
}

export interface DockerExecutionOptions {
  image: string;
  code: string;
  filename: string;
  input?: string;
  compileCommand?: string;
  runCommand: string;
  timeout: number;
  memoryLimit: string;
  cpuLimit: string;
}