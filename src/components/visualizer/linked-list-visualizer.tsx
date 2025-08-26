import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Plus, Minus, Search, RotateCcw } from 'lucide-react';

interface Node {
  id: string;
  value: number;
  next?: string;
}

export function LinkedListVisualizer() {
  const [nodes, setNodes] = useState<Node[]>([
    { id: '1', value: 10, next: '2' },
    { id: '2', value: 20, next: '3' },
    { id: '3', value: 30 }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [position, setPosition] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);

  const handleInsert = async (pos: 'head' | 'tail' | 'position') => {
    const value = parseInt(inputValue);
    if (isNaN(value)) return;

    setIsAnimating(true);
    setOperation(`Inserting ${value} at ${pos}`);

    const newNode: Node = {
      id: Date.now().toString(),
      value,
    };

    if (pos === 'head') {
      newNode.next = nodes.length > 0 ? nodes[0].id : undefined;
      setNodes(prev => [newNode, ...prev]);
      setHighlightedNode(newNode.id);
    } else if (pos === 'tail') {
      if (nodes.length > 0) {
        setNodes(prev => {
          const updated = [...prev];
          updated[updated.length - 1].next = newNode.id;
          return [...updated, newNode];
        });
      } else {
        setNodes([newNode]);
      }
      setHighlightedNode(newNode.id);
    }

    setInputValue('');
    setTimeout(() => {
      setHighlightedNode(null);
      setIsAnimating(false);
      setOperation(null);
    }, 1500);
  };

  const handleDelete = (pos: 'head' | 'tail') => {
    if (nodes.length === 0) return;

    setIsAnimating(true);
    setOperation(`Deleting from ${pos}`);

    if (pos === 'head') {
      setHighlightedNode(nodes[0].id);
      setTimeout(() => {
        setNodes(prev => prev.slice(1));
        setHighlightedNode(null);
        setIsAnimating(false);
        setOperation(null);
      }, 800);
    } else if (pos === 'tail') {
      const lastNode = nodes[nodes.length - 1];
      setHighlightedNode(lastNode.id);
      setTimeout(() => {
        setNodes(prev => {
          const updated = prev.slice(0, -1);
          if (updated.length > 0) {
            updated[updated.length - 1].next = undefined;
          }
          return updated;
        });
        setHighlightedNode(null);
        setIsAnimating(false);
        setOperation(null);
      }, 800);
    }
  };

  const handleSearch = async () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) return;

    setIsAnimating(true);
    setOperation(`Searching for ${value}`);

    for (let i = 0; i < nodes.length; i++) {
      setHighlightedNode(nodes[i].id);
      await new Promise(resolve => setTimeout(resolve, 600));
      
      if (nodes[i].value === value) {
        setOperation(`Found ${value}!`);
        setTimeout(() => {
          setHighlightedNode(null);
          setIsAnimating(false);
          setOperation(null);
        }, 1000);
        return;
      }
    }

    setOperation(`${value} not found`);
    setTimeout(() => {
      setHighlightedNode(null);
      setIsAnimating(false);
      setOperation(null);
    }, 1000);
  };

  const handleReset = () => {
    setNodes([
      { id: '1', value: 10, next: '2' },
      { id: '2', value: 20, next: '3' },
      { id: '3', value: 30 }
    ]);
    setHighlightedNode(null);
    setIsAnimating(false);
    setOperation(null);
  };

  return (
    <div className="visualization-container p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Linked List Operations</h3>
        <p className="text-muted-foreground text-sm">
          Interactive singly linked list with insert, delete, and search operations
        </p>
      </div>

      {/* Linked List Visualization */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex items-center gap-4 min-h-[120px] p-4 justify-center">
          <AnimatePresence mode="popLayout">
            {nodes.map((node, index) => (
              <motion.div
                key={node.id}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  scale: highlightedNode === node.id ? 1.1 : 1,
                  y: 0 
                }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                className="flex items-center gap-3"
              >
                <div className={`
                  flex flex-col items-center p-4 rounded-xl border-2 min-w-[80px]
                  ${highlightedNode === node.id 
                    ? 'bg-animation-highlight border-animation-highlight shadow-glow' 
                    : 'bg-card border-border'
                  }
                  transition-all duration-300
                `}>
                  <span className="text-lg font-bold">{node.value}</span>
                  <span className="text-xs text-muted-foreground">Node {index + 1}</span>
                </div>
                
                {node.next && (
                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                )}
                
                {!node.next && index === nodes.length - 1 && (
                  <div className="w-6 h-6 border-2 border-dashed border-muted-foreground rounded opacity-50" />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {nodes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              List is empty
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Enter value"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1"
                type="number"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={() => handleInsert('head')}
                disabled={isAnimating || !inputValue}
                size="sm"
                variant="default"
              >
                <Plus className="h-4 w-4 mr-1" />
                Insert Head
              </Button>
              
              <Button 
                onClick={() => handleInsert('tail')}
                disabled={isAnimating || !inputValue}
                size="sm"
                variant="default"
              >
                <Plus className="h-4 w-4 mr-1" />
                Insert Tail
              </Button>
              
              <Button 
                onClick={handleSearch}
                disabled={isAnimating || !inputValue}
                size="sm"
                variant="secondary"
              >
                <Search className="h-4 w-4 mr-1" />
                Search
              </Button>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={() => handleDelete('head')}
                disabled={isAnimating || nodes.length === 0}
                size="sm"
                variant="destructive"
              >
                <Minus className="h-4 w-4 mr-1" />
                Delete Head
              </Button>
              
              <Button 
                onClick={() => handleDelete('tail')}
                disabled={isAnimating || nodes.length === 0}
                size="sm"
                variant="destructive"
              >
                <Minus className="h-4 w-4 mr-1" />
                Delete Tail
              </Button>
              
              <Button 
                onClick={handleReset}
                disabled={isAnimating}
                size="sm"
                variant="outline"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">
            Length: {nodes.length}
          </Badge>
          {operation && (
            <Badge variant="secondary" className="animate-pulse">
              {operation}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}