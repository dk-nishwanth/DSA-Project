import React from 'react';
import { Keyboard, X } from 'lucide-react';

interface InputPanelProps {
  input: string;
  onInputChange: (input: string) => void;
  onClear: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  input,
  onInputChange,
  onClear,
  placeholder = "Enter input for your program (stdin)...",
  disabled = false,
}) => {
  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Keyboard className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Input (stdin)
          </span>
        </div>
        
        <button
          onClick={onClear}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          title="Clear input"
          disabled={disabled}
        >
          <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Input Area */}
      <div className="flex-1 p-3">
        <textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full h-full resize-none border rounded-md p-3 font-mono text-sm
            bg-white dark:bg-gray-800 
            border-gray-300 dark:border-gray-600
            text-gray-900 dark:text-gray-100
            placeholder-gray-500 dark:placeholder-gray-400
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          spellCheck={false}
        />
      </div>

      {/* Helper Text */}
      <div className="p-3 pt-0">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          💡 Tip: Each line will be sent as separate input to your program
        </p>
      </div>
    </div>
  );
};