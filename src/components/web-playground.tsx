import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Save, 
  RotateCcw, 
  Code2, 
  Globe, 
  Maximize2, 
  Minimize2,
  Download,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface WebPlaygroundProps {
  topicId: string;
  topicTitle: string;
  className?: string;
}

const DEFAULT_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Playground</title>
</head>
<body>
    <div class="container">
        <h1>Welcome to Web Playground</h1>
        <p>Edit the HTML, CSS, and JavaScript to see live changes!</p>
        <button id="clickBtn" class="btn">Click me!</button>
        <div id="output"></div>
    </div>
</body>
</html>`;

const DEFAULT_CSS = `/* CSS Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 20px;
    color: white;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.1);
    padding: 40px;
    border-radius: 20px;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    text-align: center;
}

h1 {
    font-size: 2.5em;
    margin-bottom: 20px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

p {
    font-size: 1.2em;
    margin-bottom: 30px;
    opacity: 0.9;
}

.btn {
    background: linear-gradient(45deg, #ff6b6b, #ee5a24);
    color: white;
    border: none;
    padding: 15px 30px;
    font-size: 1.1em;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

#output {
    margin-top: 30px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    min-height: 50px;
    font-size: 1.1em;
}

/* Animation classes */
.fade-in {
    animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}`;

const DEFAULT_JS = `// JavaScript Code
console.log('Web Playground loaded!');

// Get elements
const button = document.getElementById('clickBtn');
const output = document.getElementById('output');

// Add click event listener
button.addEventListener('click', function() {
    const messages = [
        '🎉 Great job!',
        '✨ You clicked the button!',
        '🚀 JavaScript is working!',
        '💫 Keep coding!',
        '🎯 Perfect click!'
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    output.innerHTML = \`
        <div class="fade-in">
            <h3>\${randomMessage}</h3>
            <p>Clicked at: \${new Date().toLocaleTimeString()}</p>
        </div>
    \`;
    
    // Add some visual feedback
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 150);
});

// Add some interactive features
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded and ready!');
    
    // Add keyboard support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target === button) {
            button.click();
        }
    });
});`;

export function WebPlayground({ topicId, topicTitle, className }: WebPlaygroundProps) {
  const [html, setHtml] = useState(DEFAULT_HTML);
  const [css, setCss] = useState(DEFAULT_CSS);
  const [js, setJs] = useState(DEFAULT_JS);
  const [isMaximized, setIsMaximized] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showPreview, setShowPreview] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const refreshTimeoutRef = useRef<NodeJS.Timeout>();

  // Load saved code
  useEffect(() => {
    const savedCode = localStorage.getItem(`web-playground-${topicId}`);
    if (savedCode) {
      try {
        const parsed = JSON.parse(savedCode);
        setHtml(parsed.html || DEFAULT_HTML);
        setCss(parsed.css || DEFAULT_CSS);
        setJs(parsed.js || DEFAULT_JS);
      } catch {
        // Use defaults if parsing fails
      }
    }
  }, [topicId]);

  // Auto-refresh preview
  useEffect(() => {
    if (autoRefresh && showPreview) {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      refreshTimeoutRef.current = setTimeout(() => {
        updatePreview();
      }, 1000);
    }
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [html, css, js, autoRefresh, showPreview]);

  const updatePreview = () => {
    if (!iframeRef.current) return;

    const combinedCode = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview</title>
    <style>${css}</style>
</head>
<body>
    ${html.replace(/<html[^>]*>|<\/html>|<head[^>]*>[\s\S]*?<\/head>|<body[^>]*>|<\/body>|<!DOCTYPE[^>]*>/gi, '')}
    <script>
        try {
            ${js}
        } catch (error) {
            console.error('JavaScript Error:', error);
            document.body.innerHTML += '<div style="position: fixed; top: 10px; right: 10px; background: red; color: white; padding: 10px; border-radius: 5px; z-index: 9999;">JS Error: ' + error.message + '</div>';
        }
    </script>
</body>
</html>`;

    const doc = iframeRef.current.contentDocument;
    if (doc) {
      doc.open();
      doc.write(combinedCode);
      doc.close();
    }
  };

  const saveCode = () => {
    const codeData = { html, css, js };
    localStorage.setItem(`web-playground-${topicId}`, JSON.stringify(codeData));
    setLastSaved(new Date());
  };

  const resetCode = () => {
    setHtml(DEFAULT_HTML);
    setCss(DEFAULT_CSS);
    setJs(DEFAULT_JS);
  };

  const downloadProject = () => {
    const combinedCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${topicTitle} - Web Project</title>
    <style>
${css}
    </style>
</head>
<body>
${html.replace(/<html[^>]*>|<\/html>|<head[^>]*>[\s\S]*?<\/head>|<body[^>]*>|<\/body>|<!DOCTYPE[^>]*>/gi, '')}
    <script>
${js}
    </script>
</body>
</html>`;

    const blob = new Blob([combinedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${topicTitle.toLowerCase().replace(/\s+/g, '-')}-project.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const editorHeight = isMaximized ? 'h-[40vh]' : 'h-64';

  return (
    <Card className={cn(
      "w-full",
      isMaximized && "fixed inset-0 z-[100] bg-background border-0 rounded-none shadow-2xl",
      className
    )}>
      <CardHeader className={cn(isMaximized && "pt-4 pb-3 border-b")}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Web Development Playground - {topicTitle}
            </CardTitle>
            <CardDescription>
              Create interactive web pages with HTML, CSS, and JavaScript
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {lastSaved && (
              <Badge variant="outline" className="text-xs">
                Saved {lastSaved.toLocaleTimeString()}
              </Badge>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              <RefreshCw className={cn("h-4 w-4", autoRefresh && "animate-spin")} />
            </Button>
            <Button size="sm" variant="outline" onClick={downloadProject}>
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
            <Button size="sm" variant="outline" onClick={() => setIsMaximized(!isMaximized)}>
              {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button size="sm" variant="outline" onClick={saveCode}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={resetCode}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
            <Button size="sm" onClick={updatePreview}>
              <Play className="h-4 w-4 mr-1" />
              Run
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className={cn("space-y-4", isMaximized && "max-h-[calc(100vh-6.5rem)] overflow-auto")}>
        <div className={cn(
          "grid gap-4",
          showPreview ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
        )}>
          {/* Code Editors */}
          <div className="space-y-4">
            <Tabs defaultValue="html">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="html" className="flex items-center gap-1">
                  🌐 HTML
                </TabsTrigger>
                <TabsTrigger value="css" className="flex items-center gap-1">
                  🎨 CSS
                </TabsTrigger>
                <TabsTrigger value="js" className="flex items-center gap-1">
                  🟨 JavaScript
                </TabsTrigger>
              </TabsList>

              <TabsContent value="html" className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">🌐 HTML Structure</span>
                  <Badge variant="outline" className="text-xs">.html</Badge>
                </div>
                <textarea
                  value={html}
                  onChange={(e) => setHtml(e.target.value)}
                  className={cn(
                    "w-full p-4 font-mono text-sm border rounded-lg resize-none",
                    editorHeight,
                    "bg-muted/50 focus:bg-background transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-primary/20"
                  )}
                  placeholder="Write your HTML here..."
                  spellCheck={false}
                />
              </TabsContent>

              <TabsContent value="css" className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">🎨 CSS Styles</span>
                  <Badge variant="outline" className="text-xs">.css</Badge>
                </div>
                <textarea
                  value={css}
                  onChange={(e) => setCss(e.target.value)}
                  className={cn(
                    "w-full p-4 font-mono text-sm border rounded-lg resize-none",
                    editorHeight,
                    "bg-muted/50 focus:bg-background transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-primary/20"
                  )}
                  placeholder="Write your CSS here..."
                  spellCheck={false}
                />
              </TabsContent>

              <TabsContent value="js" className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">🟨 JavaScript Logic</span>
                  <Badge variant="outline" className="text-xs">.js</Badge>
                </div>
                <textarea
                  value={js}
                  onChange={(e) => setJs(e.target.value)}
                  className={cn(
                    "w-full p-4 font-mono text-sm border rounded-lg resize-none",
                    editorHeight,
                    "bg-muted/50 focus:bg-background transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-primary/20"
                  )}
                  placeholder="Write your JavaScript here..."
                  spellCheck={false}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Live Preview */}
          {showPreview && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span className="text-sm font-medium">Live Preview</span>
                {autoRefresh && (
                  <Badge variant="secondary" className="text-xs">Auto-refresh</Badge>
                )}
              </div>
              <div className="border rounded-lg overflow-hidden">
                <iframe
                  ref={iframeRef}
                  className={cn(
                    "w-full bg-white",
                    isMaximized ? "h-[calc(100vh-20rem)]" : "h-96"
                  )}
                  title="Live Preview"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          💡 <strong>Web Dev Tips:</strong> Changes auto-refresh in the preview. 
          Use browser dev tools (F12) in the preview for debugging. Download your project as a complete HTML file!
        </div>
      </CardContent>
    </Card>
  );
}