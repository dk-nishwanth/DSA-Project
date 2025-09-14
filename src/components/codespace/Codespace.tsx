import React, { useState, useEffect, useCallback } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { LanguageSelector } from './LanguageSelector';
import { OutputPanel } from './OutputPanel';
import { InputPanel } from './InputPanel';
import { Toolbar } from './Toolbar';
import { Language, getDefaultLanguage, getLanguageById } from '../../config/languages';
import { runOnJudge0, Judge0Result } from '../../lib/judge0';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';

interface CodespaceProps {
  className?: string;
  initialLanguage?: string;
  initialCode?: string;
  onCodeChange?: (code: string, language: Language) => void;
}

interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime: number;
}

export const Codespace: React.FC<CodespaceProps> = ({
  className = '',
  initialLanguage,
  initialCode,
  onCodeChange,
}) => {
  // State management
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(() => {
    return initialLanguage ? getLanguageById(initialLanguage) || getDefaultLanguage() : getDefaultLanguage();
  });
  
  const [code, setCode] = useState<string>(() => {
    return initialCode || selectedLanguage.defaultCode;
  });
  
  const [input, setInput] = useState<string>('');
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Check Judge0 API health on mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        // Test with a simple Python code
        const testResult = await runOnJudge0({
          languageId: 71, // Python
          source: 'print("Health check")'
        });
        setIsOnline(testResult.status.id !== 0); // 0 means error
      } catch {
        setIsOnline(false);
      }
    };
    
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Handle language change
  const handleLanguageChange = useCallback((language: Language) => {
    setSelectedLanguage(language);
    setCode(language.defaultCode);
    setExecutionResult(null);
    onCodeChange?.(language.defaultCode, language);
  }, [onCodeChange]);

  // Handle code change
  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
    onCodeChange?.(newCode, selectedLanguage);
  }, [selectedLanguage, onCodeChange]);

  // Execute code using Judge0
  const handleRun = useCallback(async () => {
    if (isRunning || !isOnline) return;

    setIsRunning(true);
    setExecutionResult(null);

    try {
      const startTime = Date.now();
      
      const result: Judge0Result = await runOnJudge0({
        languageId: selectedLanguage.judge0LanguageId,
        source: code,
        stdin: selectedLanguage.supportsInput ? input : undefined
      });

      const executionTime = Date.now() - startTime;

      // Convert Judge0 result to our format
      const executionResult: ExecutionResult = {
        success: result.status.id === 3, // 3 = Accepted
        output: result.stdout || result.compile_output || result.stderr || '',
        error: result.status.id !== 3 ? result.status.description : undefined,
        executionTime: executionTime
      };

      setExecutionResult(executionResult);
    } catch (error) {
      setExecutionResult({
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        executionTime: 0,
      });
    } finally {
      setIsRunning(false);
    }
  }, [code, selectedLanguage, input, isRunning, isOnline]);

  // Stop execution (placeholder - would need WebSocket for real-time stopping)
  const handleStop = useCallback(() => {
    setIsRunning(false);
  }, []);

  // Reset code
  const handleReset = useCallback(() => {
    setCode(selectedLanguage.defaultCode);
    setExecutionResult(null);
    setInput('');
    onCodeChange?.(selectedLanguage.defaultCode, selectedLanguage);
  }, [selectedLanguage, onCodeChange]);

  // Download code
  const handleDownload = useCallback(() => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `main${selectedLanguage.extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [code, selectedLanguage]);

  // Save code locally
  const handleSave = useCallback(() => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const key = `codespace_${selectedLanguage.id}_${timestamp}`;
    localStorage.setItem(key, JSON.stringify({
      language: selectedLanguage.id,
      code,
      input,
      timestamp: new Date().toISOString(),
    }));
    
    // Show success message (you could use a toast library here)
    console.log('Code saved locally!');
  }, [code, selectedLanguage, input]);

  // Settings (placeholder)
  const handleSettings = useCallback(() => {
    console.log('Settings clicked');
  }, []);

  // Clear output
  const handleClearOutput = useCallback(() => {
    setExecutionResult(null);
  }, []);

  // Clear input
  const handleClearInput = useCallback(() => {
    setInput('');
  }, []);

  // Toggle fullscreen
  const handleToggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRun();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleRun, handleSave]);

  const containerClasses = `
    ${className}
    ${isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900' : 'h-full'}
    flex flex-col border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden
  `;

  return (
    <div className={containerClasses}>
      {/* Connection Status */}
      {!isOnline && (
        <div className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm border-b border-red-200 dark:border-red-800">
          <WifiOff className="w-4 h-4" />
          <span>Judge0 API is offline. Code execution is disabled.</span>
        </div>
      )}

      {/* Language Selector */}
      <LanguageSelector
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
      />

      {/* Toolbar */}
      <Toolbar
        onRun={handleRun}
        onStop={handleStop}
        onReset={handleReset}
        onDownload={handleDownload}
        onSave={handleSave}
        onSettings={handleSettings}
        isRunning={isRunning}
        language={selectedLanguage}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal">
          {/* Editor Panel */}
          <Panel defaultSize={60} minSize={30}>
            <PanelGroup direction="vertical">
              {/* Code Editor */}
              <Panel defaultSize={70} minSize={40}>
                <div className="h-full p-4 bg-gray-50 dark:bg-gray-800">
                  <div className="h-full">
                    <textarea
                      value={code}
                      onChange={(e) => handleCodeChange(e.target.value)}
                      className="w-full h-full p-4 font-mono text-sm border rounded-lg resize-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Write your ${selectedLanguage.name} code here...`}
                      spellCheck={false}
                    />
                  </div>
                </div>
              </Panel>

              {/* Input Panel (only show if language supports input) */}
              {selectedLanguage.supportsInput && (
                <>
                  <PanelResizeHandle className="h-1 bg-gray-200 dark:bg-gray-700 hover:bg-blue-500 transition-colors" />
                  <Panel defaultSize={30} minSize={15}>
                    <InputPanel
                      input={input}
                      onInputChange={setInput}
                      onClear={handleClearInput}
                      disabled={isRunning}
                    />
                  </Panel>
                </>
              )}
            </PanelGroup>
          </Panel>

          {/* Resize Handle */}
          <PanelResizeHandle className="w-1 bg-gray-200 dark:bg-gray-700 hover:bg-blue-500 transition-colors" />

          {/* Output Panel */}
          <Panel defaultSize={40} minSize={25}>
            <OutputPanel
              result={executionResult}
              isRunning={isRunning}
              onClear={handleClearOutput}
            />
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
};


