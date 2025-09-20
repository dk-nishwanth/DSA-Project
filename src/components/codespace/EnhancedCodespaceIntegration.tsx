import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Code2, 
  Play, 
  Terminal, 
  Zap, 
  CheckCircle, 
  XCircle, 
  Clock,
  TestTube,
  Maximize2
} from 'lucide-react';
import { Codespace } from './Codespace';
import { EnhancedCodePlayground } from '../enhanced-code-playground';

interface EnhancedCodespaceIntegrationProps {
  className?: string;
  topicId?: string;
  topicTitle?: string;
}

export const EnhancedCodespaceIntegration: React.FC<EnhancedCodespaceIntegrationProps> = ({
  className = '',
  topicId = 'general',
  topicTitle = 'Code Practice'
}) => {
  const [activeView, setActiveView] = useState<'codespace' | 'playground'>('codespace');

  return (
    <div className={`w-full ${className}`}>
      <Tabs value={activeView} onValueChange={(value) => setActiveView(value as 'codespace' | 'playground')}>
        <div className="flex items-center justify-between mb-4">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="codespace" className="flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              Professional IDE
            </TabsTrigger>
            <TabsTrigger value="playground" className="flex items-center gap-2">
              <TestTube className="w-4 h-4" />
              Enhanced Playground
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Piston API
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-500" />
              12+ Languages
            </Badge>
          </div>
        </div>

        <TabsContent value="codespace" className="mt-0">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Code2 className="w-5 h-5" />
                    Professional Code Editor
                  </CardTitle>
                  <CardDescription>
                    Full-featured IDE with syntax highlighting, input/output panels, and real-time execution
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveView('playground')}
                  className="flex items-center gap-2"
                >
                  <Maximize2 className="w-4 h-4" />
                  Switch to Playground
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[600px]">
                <Codespace className="h-full border-0 rounded-none" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="playground" className="mt-0">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TestTube className="w-5 h-5" />
                    Enhanced Code Playground
                  </CardTitle>
                  <CardDescription>
                    Multi-language playground with execution history, performance metrics, and advanced features
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveView('codespace')}
                  className="flex items-center gap-2"
                >
                  <Terminal className="w-4 h-4" />
                  Switch to IDE
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="min-h-[600px]">
                <EnhancedCodePlayground 
                  topicId={topicId}
                  topicTitle={topicTitle}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Features Overview */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              Professional IDE Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Resizable panels with input/output</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Fullscreen mode support</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Keyboard shortcuts (Ctrl+Enter, Ctrl+S)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Local code saving and downloading</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TestTube className="w-4 h-4" />
              Enhanced Playground Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Multi-language tabs with templates</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Execution history and performance metrics</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Memory usage estimation</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>API status monitoring with fallback</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
