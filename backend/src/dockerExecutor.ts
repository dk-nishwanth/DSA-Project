import Docker from 'dockerode';
import { v4 as uuidv4 } from 'uuid';
import * as tar from 'tar-stream';
import { DockerExecutionOptions, ExecutionResult } from './types';
import { logger } from './logger';

export class DockerExecutor {
  private docker: Docker;

  constructor() {
    this.docker = new Docker();
  }

  async executeCode(options: DockerExecutionOptions): Promise<ExecutionResult> {
    const startTime = Date.now();
    const containerId = `codespace-${uuidv4()}`;
    
    let container: Docker.Container | null = null;

    try {
      // Create tar archive with code file
      const tarStream = this.createTarArchive(options.filename, options.code);

      // Create container
      container = await this.docker.createContainer({
        Image: options.image,
        name: containerId,
        Cmd: ['/bin/sh', '-c', this.buildExecutionCommand(options)],
        WorkingDir: '/workspace',
        HostConfig: {
          Memory: this.parseMemoryLimit(options.memoryLimit),
          CpuQuota: this.parseCpuLimit(options.cpuLimit),
          NetworkMode: 'none', // No network access for security
          PidsLimit: 50, // Limit number of processes
          ReadonlyRootfs: false, // Allow writing to filesystem
          Tmpfs: {
            '/tmp': 'rw,noexec,nosuid,size=100m',
            '/workspace': 'rw,size=100m'
          },
          AutoRemove: true, // Automatically remove container when it exits
        },
        AttachStdout: true,
        AttachStderr: true,
        AttachStdin: !!options.input,
        OpenStdin: !!options.input,
        StdinOnce: !!options.input,
      });

      // Put files into container
      await container.putArchive(tarStream, { path: '/workspace' });

      // Start container
      await container.start();

      // Handle input if provided
      if (options.input) {
        const stream = await container.attach({
          stream: true,
          stdin: true,
          stdout: false,
          stderr: false,
        });
        
        stream.write(options.input);
        stream.end();
      }

      // Wait for container to finish with timeout
      const result = await Promise.race([
        this.waitForContainer(container),
        this.timeoutPromise(options.timeout)
      ]);

      const executionTime = Date.now() - startTime;

      if (result === 'timeout') {
        await this.killContainer(container);
        return {
          success: false,
          output: '',
          error: `Execution timed out after ${options.timeout}ms`,
          executionTime,
        };
      }

      // Get logs
      const logs = await container.logs({
        stdout: true,
        stderr: true,
        timestamps: false,
      });

      const { stdout, stderr } = this.parseLogs(logs);

      // Get container stats for memory usage
      const stats = await this.getContainerStats(container);

      return {
        success: result.StatusCode === 0,
        output: stdout,
        error: stderr || undefined,
        executionTime,
        memoryUsage: stats?.memoryUsage,
      };

    } catch (error) {
      logger.error('Docker execution error:', error);
      
      if (container) {
        try {
          await this.killContainer(container);
        } catch (killError) {
          logger.error('Error killing container:', killError);
        }
      }

      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Unknown execution error',
        executionTime: Date.now() - startTime,
      };
    }
  }

  private createTarArchive(filename: string, code: string): NodeJS.ReadableStream {
    const pack = tar.pack();
    
    pack.entry({ name: filename }, code);
    pack.finalize();
    
    return pack;
  }

  private buildExecutionCommand(options: DockerExecutionOptions): string {
    const commands: string[] = [];

    // Add compile command if provided
    if (options.compileCommand) {
      commands.push(options.compileCommand);
      commands.push('if [ $? -ne 0 ]; then exit 1; fi'); // Exit if compilation fails
    }

    // Add run command
    commands.push(options.runCommand);

    return commands.join(' && ');
  }

  private async waitForContainer(container: Docker.Container): Promise<{ StatusCode: number }> {
    return new Promise((resolve, reject) => {
      container.wait((err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  private timeoutPromise(timeout: number): Promise<'timeout'> {
    return new Promise((resolve) => {
      setTimeout(() => resolve('timeout'), timeout);
    });
  }

  private async killContainer(container: Docker.Container): Promise<void> {
    try {
      await container.kill();
    } catch (error) {
      // Container might already be stopped
      logger.warn('Could not kill container:', error);
    }
  }

  private parseLogs(logs: Buffer): { stdout: string; stderr: string } {
    let stdout = '';
    let stderr = '';
    
    let offset = 0;
    while (offset < logs.length) {
      // Docker log format: [8 bytes header][payload]
      if (offset + 8 > logs.length) break;
      
      const header = logs.subarray(offset, offset + 8);
      const streamType = header[0];
      const size = header.readUInt32BE(4);
      
      if (offset + 8 + size > logs.length) break;
      
      const payload = logs.subarray(offset + 8, offset + 8 + size).toString('utf8');
      
      if (streamType === 1) {
        stdout += payload;
      } else if (streamType === 2) {
        stderr += payload;
      }
      
      offset += 8 + size;
    }
    
    return { stdout: stdout.trim(), stderr: stderr.trim() };
  }

  private async getContainerStats(container: Docker.Container): Promise<{ memoryUsage?: number }> {
    try {
      const stats = await container.stats({ stream: false });
      const memoryUsage = stats.memory_stats?.usage;
      return { memoryUsage };
    } catch (error) {
      logger.warn('Could not get container stats:', error);
      return {};
    }
  }

  private parseMemoryLimit(limit: string): number {
    const match = limit.match(/^(\d+)([kmg]?)b?$/i);
    if (!match) return 128 * 1024 * 1024; // Default 128MB
    
    const value = parseInt(match[1]);
    const unit = match[2]?.toLowerCase() || '';
    
    switch (unit) {
      case 'k': return value * 1024;
      case 'm': return value * 1024 * 1024;
      case 'g': return value * 1024 * 1024 * 1024;
      default: return value;
    }
  }

  private parseCpuLimit(limit: string): number {
    // Convert CPU limit (e.g., "0.5") to CPU quota (50000 for 0.5 CPU)
    const cpuValue = parseFloat(limit);
    return Math.floor(cpuValue * 100000);
  }

  async pullImageIfNeeded(image: string): Promise<void> {
    try {
      await this.docker.getImage(image).inspect();
      logger.info(`Image ${image} already exists`);
    } catch (error) {
      logger.info(`Pulling image ${image}...`);
      
      return new Promise((resolve, reject) => {
        this.docker.pull(image, (err: any, stream: any) => {
          if (err) {
            reject(err);
            return;
          }

          this.docker.modem.followProgress(stream, (err: any) => {
            if (err) {
              reject(err);
            } else {
              logger.info(`Successfully pulled image ${image}`);
              resolve();
            }
          });
        });
      });
    }
  }
}