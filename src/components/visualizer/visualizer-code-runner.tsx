import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Play, RotateCcw, Terminal } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface VisualizerCodeRunnerProps {
  triggerLabel?: string;
  starterCode?: string;
}

type RunnerLang = 'javascript' | 'c' | 'java';

const TEMPLATES: Record<RunnerLang, string> = {
  javascript: `// Write JS to visualize using console.log
function run() {
  console.log('Hello from JavaScript');
}
run();
`,
  c: `// C Template (simulated)
#include <stdio.h>
int main(){
  printf("Hello from C\\n");
  return 0;
}
`,
  java: `// Java Template (simulated)
class Main {
  public static void main(String[] args){
    System.out.println("Hello from Java");
  }
}
`
};

export function VisualizerCodeRunner({ triggerLabel = 'Code & Run Visualization', starterCode }: VisualizerCodeRunnerProps) {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState<RunnerLang>('javascript');
  const [code, setCode] = useState<string>(starterCode || `// Write JS/TS (JS runtime) to manipulate data and visualize via console logs.
// Example: Binary Search
function binarySearch(arr, target) {
  let l = 0, r = arr.length - 1;
  while (l <= r) {
    const m = Math.floor((l + r) / 2);
    console.log('check index', m, 'value', arr[m]);
    if (arr[m] === target) return m;
    if (arr[m] < target) l = m + 1; else r = m - 1;
  }
  return -1;
}

const idx = binarySearch([1,3,5,7,9,12], 9);
console.log('result index =', idx);
`);
  const [output, setOutput] = useState<string>('');
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, []);

  const runInWorker = () => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
    const jsToRun = (() => {
      if (language === 'javascript') return code;
      // For C/Java, simulate by extracting printf/System.out.println and mapping to console.log
      if (language === 'c') {
        const lines = code.split(/\n/).filter(Boolean);
        const simulated = lines
          .map(l => l.match(/printf\s*\((.*)\)\s*;/) ? `console.log(${(l.match(/printf\s*\((.*)\)\s*;/) as RegExpMatchArray)[1].replace(/%d|%s|\\n/g, '')});` : null)
          .filter(Boolean)
          .join('\n');
        return simulated || `console.log('Simulated C run (no output)');`;
      }
      if (language === 'java') {
        const lines = code.split(/\n/).filter(Boolean);
        const simulated = lines
          .map(l => l.match(/System\.out\.println\((.*)\)\s*;/) ? `console.log(${(l.match(/System\.out\.println\((.*)\)\s*;/) as RegExpMatchArray)[1]});` : null)
          .filter(Boolean)
          .join('\n');
        return simulated || `console.log('Simulated Java run (no output)');`;
      }
      return code;
    })();

    const blob = new Blob([
      `self.console = { log: (...args) => self.postMessage({ type: 'log', data: args.map(String).join(' ') }) };
      self.onerror = (e) => { self.postMessage({ type: 'error', data: e.message || String(e) }); };
      try { ${jsToRun} } catch (e) { self.postMessage({ type: 'error', data: e.message || String(e) }); }`
    ], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const worker = new Worker(url);
    worker.onmessage = (e: MessageEvent) => {
      const { type, data } = e.data || {};
      if (type === 'log') {
        setOutput(prev => prev + data + '\n');
      } else if (type === 'error') {
        setOutput(prev => prev + '[Error] ' + data + '\n');
      }
    };
    worker.onerror = (e) => {
      setOutput(prev => prev + '[Error] ' + (e.message || 'Runtime error') + '\n');
    };
    workerRef.current = worker;
    setOutput('');
  };

  const reset = () => {
    setOutput('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Terminal className="h-4 w-4" /> Run Your Visualization</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Code</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Language</span>
                <Select value={language} onValueChange={(v) => {
                  const lang = v as RunnerLang;
                  setLanguage(lang);
                  setCode(TEMPLATES[lang]);
                }}>
                  <SelectTrigger className="h-8 w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="c">C (simulated)</SelectItem>
                    <SelectItem value="java">Java (simulated)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Textarea value={code} onChange={(e) => setCode(e.target.value)} className="h-72 font-mono text-sm" />
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={runInWorker}><Play className="h-4 w-4 mr-1" /> Run</Button>
              <Button size="sm" variant="outline" onClick={reset}><RotateCcw className="h-4 w-4 mr-1" /> Reset Output</Button>
            </div>
            <p className="text-xs text-muted-foreground">
              C and Java are simulated client-side by extracting print statements to show output quickly. For full compilation, connect a server or WASM toolchain.
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Output</label>
            <Textarea readOnly value={output} className="h-72 font-mono text-sm" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


