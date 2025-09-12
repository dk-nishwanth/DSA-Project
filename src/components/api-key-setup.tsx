import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, Key, ExternalLink, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export function ApiKeySetup() {
  const [apiKey, setApiKey] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    // Check if API key is configured
    const key = process.env.NEXT_PUBLIC_RAPIDAPI_KEY || localStorage.getItem('rapidapi_key');
    setIsConfigured(!!key && key !== 'your_rapidapi_key_here');
    if (key) setApiKey(key);
  }, []);

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('rapidapi_key', apiKey.trim());
      setIsConfigured(true);
      setIsOpen(false);
      
      // Show success message
      alert('✅ API key saved! Real code execution is now enabled. The page will refresh to apply changes.');
      window.location.reload();
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      // First test API key validity
      const response = await fetch('https://judge0-ce.p.rapidapi.com/languages', {
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        }
      });
      
      if (response.ok) {
        // Test actual code execution
        const testResponse = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
          },
          body: JSON.stringify({
            language_id: 71, // Python
            source_code: btoa('print("Real execution test successful!")'),
            stdin: btoa('')
          })
        });
        
        if (testResponse.ok) {
          const result = await testResponse.json();
          const output = result.stdout ? atob(result.stdout) : '';
          alert(`✅ Real code execution is working!\n\nTest output: ${output}\n\nYou can now run actual code in all programming languages!`);
        } else {
          alert('✅ API key is valid, but execution test failed. You may have reached your usage limit.');
        }
      } else {
        alert('❌ API key is invalid. Please check your key and try again.');
      }
    } catch (error) {
      alert('❌ Connection failed. Please check your internet connection and API key.');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Key className="h-4 w-4" />
          {isConfigured ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-600" />
              Real Execution
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4 text-orange-600" />
              Setup Required
            </>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Real Code Execution Setup
          </DialogTitle>
          <DialogDescription>
            Configure real compilation and execution for all programming languages
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {isConfigured ? (
                <span className="text-green-600">
                  ✅ Real code execution is enabled! All languages will compile and run with actual output.
                </span>
              ) : (
                <span className="text-orange-600">
                  ⚠️ Currently using simulated execution. Set up API key for real compilation and execution.
                </span>
              )}
            </AlertDescription>
          </Alert>

          {/* Setup Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Setup (2 minutes)</CardTitle>
              <CardDescription>
                Get real code execution for all programming languages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Step 1</Badge>
                  <span className="text-sm">Get a free RapidAPI key</span>
                </div>
                <p className="text-sm text-muted-foreground ml-16">
                  Visit{' '}
                  <a 
                    href="https://rapidapi.com/judge0-official/api/judge0-ce/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline inline-flex items-center gap-1"
                  >
                    RapidAPI Judge0 <ExternalLink className="h-3 w-3" />
                  </a>
                  {' '}and subscribe to the FREE plan (500 requests/month)
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Step 2</Badge>
                  <span className="text-sm">Enter your API key below</span>
                </div>
                <div className="ml-16 space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="apikey">RapidAPI Key</Label>
                    <Input
                      id="apikey"
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your RapidAPI key here..."
                      className="font-mono"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveKey} disabled={!apiKey.trim()}>
                      Save API Key
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleTestConnection} 
                      disabled={!apiKey.trim() || isTesting}
                    >
                      {isTesting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        'Test Connection'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What You Get</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-medium">Real Compilation</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Actual compiler errors</li>
                    <li>• Syntax error detection</li>
                    <li>• Link-time errors</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Real Execution</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Actual program output</li>
                    <li>• Runtime error detection</li>
                    <li>• Execution time & memory</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Supported Languages</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• C, C++, Java, C#</li>
                    <li>• Python, JavaScript, PHP</li>
                    <li>• Ruby, Go, Rust, SQL</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Security</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Sandboxed execution</li>
                    <li>• Time & memory limits</li>
                    <li>• Safe environment</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fallback Info */}
          <Alert>
            <AlertDescription className="text-sm">
              💡 <strong>No API key needed to start!</strong> The system automatically falls back to enhanced 
              simulation when real execution isn't available. You can add the API key anytime to upgrade 
              to real compilation and execution.
            </AlertDescription>
          </Alert>
        </div>
      </DialogContent>
    </Dialog>
  );
}