import React, { useEffect, useRef } from 'react';
import { ExecutionResult } from '../../services/codeExecutionService';
import { Terminal, Play, Square, RotateCcw, Clock, MemoryStick } from 'lucide-react';

interface OutputPanelProps {
  result: ExecutionResult | null;
  isRunning: boolean;
  onClear: () => void;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({
  result,
  isRunning,
  onClear,
}) => {
  const outputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new output arrives
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [result]);

  const formatExecutionTime = (time: number): string => {
    if (time < 1000) {
      return `${time}ms`;
    }
    return `${(time / 1000).toFixed(2)}s`;
  };

  const formatMemoryUsage = (memory?: number): string => {
    if (!memory) return 'N/A';
    if (memory < 1024) return `${memory}B`;
    if (memory < 1024 * 1024) return `${(memory / 1024).toFixed(1)}KB`;
    return `${(memory / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4" />
          <span className="text-sm font-medium">Output</span>
          {isRunning && (
            <div className="flex items-center gap-1 text-yellow-400">
              <div className="animate-spin rounded-full h-3 w-3 border border-yellow-400 border-t-transparent"></div>
              <span className="text-xs">Running...</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {result && (
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{formatExecutionTime(result.executionTime)}</span>
              </div>
              {result.memoryUsage && (
                <div className="flex items-center gap-1">
                  <MemoryStick className="w-3 h-3" />
                  <span>{formatMemoryUsage(result.memoryUsage)}</span>
                </div>
              )}
            </div>
          )}
          
          <button
            onClick={onClear}
            className="p-1 rounded hover:bg-gray-700 transition-colors"
            title="Clear output"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Output Content */}
      <div
        ref={outputRef}
        className="flex-1 p-4 overflow-auto font-mono text-sm leading-relaxed"
      >
        {isRunning ? (
          <div className="flex items-center gap-2 text-yellow-400">
            <div className="animate-pulse">
              <Play className="w-4 h-4" />
            </div>
            <span>Executing code...</span>
          </div>
        ) : result ? (
          <div className="space-y-2">
            {/* Success/Error Status */}
            <div className={`flex items-center gap-2 text-sm ${
              result.success ? 'text-green-400' : 'text-red-400'
            }`}>
              {result.success ? (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Execution completed successfully</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span>Execution failed</span>
                </div>
              )}
            </div>

            {/* Output */}
            {result.output && (
              <div>
                <div className="text-gray-400 text-xs mb-1">STDOUT:</div>
                <pre className="whitespace-pre-wrap text-gray-100 bg-gray-800 p-3 rounded border-l-4 border-green-500">
                  {result.output}
                </pre>
              </div>
            )}

            {/* Error */}
            {result.error && (
              <div>
                <div className="text-gray-400 text-xs mb-1">STDERR:</div>
                <pre className="whitespace-pre-wrap text-red-300 bg-red-900/20 p-3 rounded border-l-4 border-red-500">
                  {result.error}
                </pre>
              </div>
            )}

            {/* Empty output message */}
            {!result.output && !result.error && (
              <div className="text-gray-500 italic">
                No output generated
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-500 italic">
            Click "Run" to execute your code
          </div>
        )}
      </div>
    </div>
  );
};