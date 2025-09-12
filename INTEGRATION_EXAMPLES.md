# Codespace Integration Examples

Here are various ways to integrate the codespace into your existing React application.

## 1. Full Page Integration

```tsx
// pages/CodespacePage.tsx
import React from 'react';
import { Codespace } from '../components/codespace';

export const CodespacePage: React.FC = () => {
  return (
    <div className="h-screen">
      <Codespace className="h-full" />
    </div>
  );
};

// Add to your router
<Route path="/codespace" element={<CodespacePage />} />
```

## 2. Embedded in Existing Page

```tsx
// pages/TutorialPage.tsx
import React from 'react';
import { Codespace } from '../components/codespace';

export const TutorialPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1>Python Tutorial</h1>
      <p>Learn Python with interactive examples...</p>
      
      {/* Embedded Codespace */}
      <div className="my-8 h-96 border rounded-lg">
        <Codespace 
          initialLanguage="python"
          initialCode={`# Try this Python code
print("Hello, World!")
name = input("What's your name? ")
print(f"Nice to meet you, {name}!")`}
          onCodeChange={(code, language) => {
            // Save progress or track analytics
            localStorage.setItem('tutorial-progress', code);
          }}
        />
      </div>
      
      <p>Continue with the next lesson...</p>
    </div>
  );
};
```

## 3. Modal/Dialog Integration

```tsx
// components/CodespaceModal.tsx
import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Codespace } from './codespace';
import { X } from 'lucide-react';

interface CodespaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCode?: string;
  language?: string;
}

export const CodespaceModal: React.FC<CodespaceModalProps> = ({
  isOpen,
  onClose,
  initialCode,
  language
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-6xl h-5/6 bg-white rounded-lg shadow-xl">
          <div className="flex items-center justify-between p-4 border-b">
            <Dialog.Title className="text-lg font-medium">
              Code Editor
            </Dialog.Title>
            <button onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="h-full p-4">
            <Codespace 
              className="h-full"
              initialCode={initialCode}
              initialLanguage={language}
            />
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

// Usage
function MyComponent() {
  const [showCodespace, setShowCodespace] = useState(false);
  
  return (
    <>
      <button onClick={() => setShowCodespace(true)}>
        Open Code Editor
      </button>
      
      <CodespaceModal 
        isOpen={showCodespace}
        onClose={() => setShowCodespace(false)}
        initialCode="console.log('Hello!');"
        language="javascript"
      />
    </>
  );
}
```

## 4. Tabbed Interface Integration

```tsx
// components/TabbedCodespace.tsx
import React, { useState } from 'react';
import { Codespace } from './codespace';
import { SUPPORTED_LANGUAGES } from './codespace';

export const TabbedCodespace: React.FC = () => {
  const [activeTab, setActiveTab] = useState('editor');
  
  return (
    <div className="h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('editor')}
          className={`px-4 py-2 ${activeTab === 'editor' ? 'border-b-2 border-blue-500' : ''}`}
        >
          Code Editor
        </button>
        <button
          onClick={() => setActiveTab('docs')}
          className={`px-4 py-2 ${activeTab === 'docs' ? 'border-b-2 border-blue-500' : ''}`}
        >
          Documentation
        </button>
        <button
          onClick={() => setActiveTab('examples')}
          className={`px-4 py-2 ${activeTab === 'examples' ? 'border-b-2 border-blue-500' : ''}`}
        >
          Examples
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="flex-1">
        {activeTab === 'editor' && (
          <Codespace className="h-full" />
        )}
        {activeTab === 'docs' && (
          <div className="p-4">Documentation content...</div>
        )}
        {activeTab === 'examples' && (
          <div className="p-4">Code examples...</div>
        )}
      </div>
    </div>
  );
};
```

## 5. Sidebar Integration

```tsx
// components/CodespaceWithSidebar.tsx
import React, { useState } from 'react';
import { Codespace } from './codespace';
import { FileText, Folder, Settings } from 'lucide-react';

export const CodespaceWithSidebar: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  return (
    <div className="h-full flex">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="w-64 bg-gray-100 border-r flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-medium">Project Explorer</h3>
          </div>
          
          <div className="flex-1 p-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded cursor-pointer">
                <Folder className="w-4 h-4" />
                <span>src/</span>
              </div>
              <div className="flex items-center gap-2 p-2 pl-6 hover:bg-gray-200 rounded cursor-pointer">
                <FileText className="w-4 h-4" />
                <span>main.py</span>
              </div>
              <div className="flex items-center gap-2 p-2 pl-6 hover:bg-gray-200 rounded cursor-pointer">
                <FileText className="w-4 h-4" />
                <span>utils.py</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t">
            <button className="flex items-center gap-2 text-sm text-gray-600">
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex-1">
        <Codespace className="h-full" />
      </div>
    </div>
  );
};
```

## 6. Multi-File Editor

```tsx
// components/MultiFileCodespace.tsx
import React, { useState } from 'react';
import { Codespace } from './codespace';
import { X, Plus } from 'lucide-react';

interface CodeFile {
  id: string;
  name: string;
  language: string;
  code: string;
}

export const MultiFileCodespace: React.FC = () => {
  const [files, setFiles] = useState<CodeFile[]>([
    {
      id: '1',
      name: 'main.py',
      language: 'python',
      code: 'print("Hello, World!")'
    }
  ]);
  const [activeFileId, setActiveFileId] = useState('1');
  
  const activeFile = files.find(f => f.id === activeFileId);
  
  const addFile = () => {
    const newFile: CodeFile = {
      id: Date.now().toString(),
      name: 'untitled.py',
      language: 'python',
      code: ''
    };
    setFiles([...files, newFile]);
    setActiveFileId(newFile.id);
  };
  
  const closeFile = (fileId: string) => {
    const newFiles = files.filter(f => f.id !== fileId);
    setFiles(newFiles);
    if (activeFileId === fileId && newFiles.length > 0) {
      setActiveFileId(newFiles[0].id);
    }
  };
  
  const updateFile = (code: string) => {
    setFiles(files.map(f => 
      f.id === activeFileId ? { ...f, code } : f
    ));
  };
  
  return (
    <div className="h-full flex flex-col">
      {/* File Tabs */}
      <div className="flex items-center bg-gray-100 border-b overflow-x-auto">
        {files.map(file => (
          <div
            key={file.id}
            className={`flex items-center gap-2 px-3 py-2 border-r cursor-pointer ${
              activeFileId === file.id ? 'bg-white' : 'hover:bg-gray-200'
            }`}
            onClick={() => setActiveFileId(file.id)}
          >
            <span className="text-sm">{file.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeFile(file.id);
              }}
              className="hover:bg-gray-300 rounded p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        
        <button
          onClick={addFile}
          className="p-2 hover:bg-gray-200"
          title="Add new file"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      
      {/* Editor */}
      <div className="flex-1">
        {activeFile && (
          <Codespace
            key={activeFile.id}
            className="h-full"
            initialCode={activeFile.code}
            initialLanguage={activeFile.language}
            onCodeChange={updateFile}
          />
        )}
      </div>
    </div>
  );
};
```

## 7. Challenge/Exercise Integration

```tsx
// components/CodingChallenge.tsx
import React, { useState } from 'react';
import { Codespace } from './codespace';
import { CheckCircle, XCircle, Play } from 'lucide-react';

interface TestCase {
  input: string;
  expectedOutput: string;
  description: string;
}

interface ChallengeProps {
  title: string;
  description: string;
  starterCode: string;
  language: string;
  testCases: TestCase[];
}

export const CodingChallenge: React.FC<ChallengeProps> = ({
  title,
  description,
  starterCode,
  language,
  testCases
}) => {
  const [results, setResults] = useState<boolean[]>([]);
  const [currentCode, setCurrentCode] = useState(starterCode);
  
  const runTests = async () => {
    // This would integrate with your test runner
    // For now, just simulate test results
    const mockResults = testCases.map(() => Math.random() > 0.5);
    setResults(mockResults);
  };
  
  return (
    <div className="h-full flex">
      {/* Challenge Description */}
      <div className="w-1/3 p-6 bg-gray-50 border-r overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="text-gray-700 mb-6">{description}</p>
        
        <h3 className="font-semibold mb-3">Test Cases:</h3>
        <div className="space-y-3">
          {testCases.map((testCase, index) => (
            <div key={index} className="p-3 bg-white rounded border">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium">Test {index + 1}</span>
                {results[index] !== undefined && (
                  results[index] ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">{testCase.description}</p>
              <div className="text-xs">
                <div><strong>Input:</strong> {testCase.input}</div>
                <div><strong>Expected:</strong> {testCase.expectedOutput}</div>
              </div>
            </div>
          ))}
        </div>
        
        <button
          onClick={runTests}
          className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <Play className="w-4 h-4" />
          Run Tests
        </button>
      </div>
      
      {/* Code Editor */}
      <div className="flex-1">
        <Codespace
          className="h-full"
          initialCode={starterCode}
          initialLanguage={language}
          onCodeChange={setCurrentCode}
        />
      </div>
    </div>
  );
};

// Usage
const challenge = {
  title: "Two Sum",
  description: "Given an array of integers and a target sum, return indices of two numbers that add up to the target.",
  starterCode: `def two_sum(nums, target):
    # Your code here
    pass`,
  language: "python",
  testCases: [
    {
      input: "[2,7,11,15], target=9",
      expectedOutput: "[0,1]",
      description: "nums[0] + nums[1] = 2 + 7 = 9"
    }
  ]
};

<CodingChallenge {...challenge} />
```

## 8. Navigation Integration

```tsx
// Add to your main navigation
import { Code } from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Tutorials', href: '/tutorials', icon: BookOpen },
  { name: 'Codespace', href: '/codespace', icon: Code }, // Add this
  { name: 'About', href: '/about', icon: Info },
];
```

## 9. Context Integration

```tsx
// contexts/CodespaceContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { Language } from '../components/codespace';

interface CodespaceContextType {
  savedSnippets: Array<{id: string, name: string, code: string, language: string}>;
  saveSnippet: (name: string, code: string, language: string) => void;
  loadSnippet: (id: string) => {code: string, language: string} | null;
}

const CodespaceContext = createContext<CodespaceContextType | null>(null);

export const CodespaceProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [savedSnippets, setSavedSnippets] = useState([]);
  
  const saveSnippet = (name: string, code: string, language: string) => {
    const snippet = {
      id: Date.now().toString(),
      name,
      code,
      language,
      createdAt: new Date().toISOString()
    };
    setSavedSnippets(prev => [...prev, snippet]);
    localStorage.setItem('codespace-snippets', JSON.stringify([...savedSnippets, snippet]));
  };
  
  const loadSnippet = (id: string) => {
    return savedSnippets.find(s => s.id === id) || null;
  };
  
  return (
    <CodespaceContext.Provider value={{ savedSnippets, saveSnippet, loadSnippet }}>
      {children}
    </CodespaceContext.Provider>
  );
};

export const useCodespace = () => {
  const context = useContext(CodespaceContext);
  if (!context) throw new Error('useCodespace must be used within CodespaceProvider');
  return context;
};
```

These examples show how flexible the codespace component is and how it can be integrated into various parts of your application without breaking existing functionality.