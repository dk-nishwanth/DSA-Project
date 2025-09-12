import React from 'react';
import { Codespace } from '../components/codespace/Codespace';
import { Code, Zap, Shield, Globe } from 'lucide-react';

export const CodespacePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Codespace
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  VS Code-like editor with multi-language support
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span>Fast Execution</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Secure Sandbox</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-500" />
                <span>11+ Languages</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="h-[calc(100vh-200px)]">
          <Codespace
            className="h-full"
            onCodeChange={(code, language) => {
              // Optional: Save to localStorage or send to analytics
              console.log(`Code changed for ${language.name}:`, code.length, 'characters');
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <span>Powered by Monaco Editor & Docker</span>
              <span>•</span>
              <span>Secure execution environment</span>
            </div>
            
            <div className="flex items-center gap-4">
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                Ctrl+Enter
              </kbd>
              <span>to run</span>
              <span>•</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                Ctrl+S
              </kbd>
              <span>to save</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};