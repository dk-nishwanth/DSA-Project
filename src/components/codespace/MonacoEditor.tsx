import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Language } from '../../config/languages';

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: Language;
  theme?: 'vs-dark' | 'light';
  readOnly?: boolean;
  fontSize?: number;
  minimap?: boolean;
}

export const MonacoEditor: React.FC<MonacoEditorProps> = ({
  value,
  onChange,
  language,
  theme = 'vs-dark',
  readOnly = false,
  fontSize = 14,
  minimap = true,
}) => {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Configure editor options
    editor.updateOptions({
      fontSize,
      fontFamily: 'JetBrains Mono, Consolas, Monaco, "Courier New", monospace',
      lineNumbers: 'on',
      roundedSelection: false,
      scrollBeyondLastLine: false,
      readOnly,
      minimap: { enabled: minimap },
      automaticLayout: true,
      tabSize: language.id === 'python' ? 4 : 2,
      insertSpaces: true,
      wordWrap: 'on',
      contextmenu: true,
      mouseWheelZoom: true,
      smoothScrolling: true,
      cursorBlinking: 'blink',
      cursorSmoothCaretAnimation: true,
      renderLineHighlight: 'all',
      selectOnLineNumbers: true,
      glyphMargin: true,
      folding: true,
      foldingHighlight: true,
      showFoldingControls: 'always',
      unfoldOnClickAfterEndOfLine: true,
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true,
      },
    });

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Trigger save event
      const event = new CustomEvent('editor-save', { detail: { code: editor.getValue() } });
      window.dispatchEvent(event);
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      // Trigger run event
      const event = new CustomEvent('editor-run', { detail: { code: editor.getValue() } });
      window.dispatchEvent(event);
    });

    // Configure language-specific settings
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: false,
    });

    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
    });
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  // Focus editor when language changes
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, [language.id]);

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        language={language.monacoLanguage}
        value={value}
        theme={theme}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          selectOnLineNumbers: true,
          automaticLayout: true,
        }}
        loading={
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        }
      />
    </div>
  );
};