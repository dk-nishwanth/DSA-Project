import React from 'react';
import { 
  Play, 
  Square, 
  RotateCcw, 
  Download, 
  Save, 
  Settings,
  FileText,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { Language } from '../../config/languages';

interface ToolbarProps {
  onRun: () => void;
  onStop: () => void;
  onReset: () => void;
  onDownload: () => void;
  onSave: () => void;
  onSettings: () => void;
  isRunning: boolean;
  language: Language;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onRun,
  onStop,
  onReset,
  onDownload,
  onSave,
  onSettings,
  isRunning,
  language,
  isFullscreen,
  onToggleFullscreen,
}) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      {/* Left side - Main actions */}
      <div className="flex items-center gap-2">
        {/* Run/Stop Button */}
        {isRunning ? (
          <button
            onClick={onStop}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors font-medium"
            title="Stop execution (Ctrl+C)"
          >
            <Square className="w-4 h-4" />
            Stop
          </button>
        ) : (
          <button
            onClick={onRun}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors font-medium"
            title="Run code (Ctrl+Enter)"
          >
            <Play className="w-4 h-4" />
            Run
          </button>
        )}

        {/* Reset Button */}
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors"
          title="Reset to default code"
          disabled={isRunning}
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>

        {/* Separator */}
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

        {/* File Actions */}
        <button
          onClick={onSave}
          className="flex items-center gap-2 px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors"
          title="Save code locally (Ctrl+S)"
          disabled={isRunning}
        >
          <Save className="w-4 h-4" />
          Save
        </button>

        <button
          onClick={onDownload}
          className="flex items-center gap-2 px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors"
          title="Download code file"
          disabled={isRunning}
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>

      {/* Center - Language info */}
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <FileText className="w-4 h-4" />
        <span>main{language.extension}</span>
      </div>

      {/* Right side - Settings and view options */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleFullscreen}
          className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors"
          title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>

        <button
          onClick={onSettings}
          className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors"
          title="Editor settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};