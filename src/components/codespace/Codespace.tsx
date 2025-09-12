import React, { useState, useEffect, useCallback } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { MonacoEditor } from './MonacoEditor';
import { LanguageSelector } from './LanguageSelector';
import { OutputPanel } from './OutputPanel';
import { InputPanel } from './InputPanel';
import { Toolbar } from './Toolbar';
import { Language, getDefaultLanguage, getLanguageById } from '../../config/languages';
import { codeExecutionService, ExecutionResult } from '../../services/codeExecutionService';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';

interface CodespaceProps {
  className?: string;
  initialLanguage?: string;
  initialCode?: string;
  onCodeChange?: (code: string, language: Language) => void;
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

  // Check backend health on mount
  useEffect(() => {
    const checkHealth = async () => {
      const healthy = await codeExecutionService.checkHealth();
      setIsOnline(healthy);
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

  // Execute code
  const handleRun = useCallback(async () => {
    if (isRunning || !isOnline) return;

    setIsRunning(true);
    setExecutionResult(null);

    try {
      const result = await codeExecutionService.executeCode({
        code,
        language: selectedLanguage,
        input: selectedLanguage.supportsInput ? input : undefined,
        filename: `main${selectedLanguage.extension}`,
      });

      setExecutionResult(result);
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

    const handleEditorSave = (e: CustomEvent) => {
      handleSave();
    };

    const handleEditorRun = (e: CustomEvent) => {
      handleRun();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('editor-save', handleEditorSave as EventListener);
    window.addEventListener('editor-run', handleEditorRun as EventListener);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('editor-save', handleEditorSave as EventListener);
      window.removeEventListener('editor-run', handleEditorRun as EventListener);
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
          <span>Backend service is offline. Code execution is disabled.</span>
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
                <MonacoEditor
                  value={code}
                  onChange={handleCodeChange}
                  language={selectedLanguage}
                  theme="vs-dark"
                />
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