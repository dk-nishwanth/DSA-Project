import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { DockerExecutor } from './dockerExecutor';
import { ExecutionRequest, ExecutionResult } from './types';
import { logger } from './logger';

const app = express();
const port = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);

// Stricter rate limiting for code execution
const executionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 executions per minute
  message: 'Too many code executions, please wait before trying again.',
});

app.use(express.json({ limit: '1mb' }));

const dockerExecutor = new DockerExecutor();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Code execution endpoint
app.post('/api/execute', executionLimiter, async (req, res) => {
  try {
    const request: ExecutionRequest = req.body;
    
    // Validate request
    if (!request.code || !request.language || !request.filename) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: code, language, filename'
      });
    }

    // Security: Limit code size
    if (request.code.length > 50000) { // 50KB limit
      return res.status(400).json({
        success: false,
        error: 'Code size exceeds maximum limit (50KB)'
      });
    }

    // Security: Limit input size
    if (request.input && request.input.length > 10000) { // 10KB limit
      return res.status(400).json({
        success: false,
        error: 'Input size exceeds maximum limit (10KB)'
      });
    }

    logger.info(`Executing ${request.language} code`, {
      language: request.language,
      filename: request.filename,
      codeLength: request.code.length,
      hasInput: !!request.input,
    });

    // Pull Docker image if needed
    await dockerExecutor.pullImageIfNeeded(request.dockerImage);

    // Execute code
    const result: ExecutionResult = await dockerExecutor.executeCode({
      image: request.dockerImage,
      code: request.code,
      filename: request.filename,
      input: request.input,
      compileCommand: request.compileCommand,
      runCommand: request.runCommand,
      timeout: 10000, // 10 second timeout
      memoryLimit: '128m', // 128MB memory limit
      cpuLimit: '0.5', // 0.5 CPU cores
    });

    logger.info(`Execution completed`, {
      language: request.language,
      success: result.success,
      executionTime: result.executionTime,
      memoryUsage: result.memoryUsage,
    });

    res.json(result);

  } catch (error) {
    logger.error('Execution endpoint error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      executionTime: 0,
    });
  }
});

// Supported languages endpoint
app.get('/api/languages', (req, res) => {
  const languages = [
    'python', 'javascript', 'java', 'cpp', 'c', 'csharp', 
    'go', 'rust', 'php', 'ruby', 'sql'
  ];
  
  res.json({ languages });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

app.listen(port, () => {
  logger.info(`Codespace backend server running on port ${port}`);
  
  // Create logs directory if it doesn't exist
  const fs = require('fs');
  if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs');
  }
});