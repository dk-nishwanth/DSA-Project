import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Binary, Calculator, RotateCcw, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import { VisualizerControls } from '@/components/visualizer/visualizer-controls';
import { useVisualizerVoice } from '@/hooks/useVisualizerVoice';
import { toast } from 'sonner';

interface BitOperation {
  operation: string;
  operand1: number;
  operand2?: number;
  result: number;
  explanation: string;
  binaryOperand1: string;
  binaryOperand2?: string;
  binaryResult: string;
  truthTable?: Array<{a: string, b: string, result: string}>;
}

export function BitBasicsVisualizer() {
  const [operand1, setOperand1] = useState(12);
  const [operand2, setOperand2] = useState(10);
  const [operation, setOperation] = useState('AND');
  const [result, setResult] = useState<BitOperation | null>(null);
  const [showTruthTable, setShowTruthTable] = useState(false);
  const [showMemory, setShowMemory] = useState(false);
  
  const {
    voiceEnabled,
    setVoiceEnabled,
    speed,
    setSpeed,
    isSpeaking,
    pauseSpeech,
    resumeSpeech,
    stopSpeech,
    speakStep,
    speakOperation,
    speakResult
  } = useVisualizerVoice({ minInterval: 2000 });

  const operations = [
    { value: 'AND', label: 'AND (&)', description: 'Both bits must be 1' },
    { value: 'OR', label: 'OR (|)', description: 'At least one bit must be 1' },
    { value: 'XOR', label: 'XOR (^)', description: 'Bits must be different' },
    { value: 'NOT', label: 'NOT (~)', description: 'Flip all bits' },
    { value: 'LEFT_SHIFT', label: 'Left Shift (<<)', description: 'Multiply by 2^n' },
    { value: 'RIGHT_SHIFT', label: 'Right Shift (>>)', description: 'Divide by 2^n' }
  ];

  const getTruthTable = (op: string) => {
    switch (op) {
      case 'AND':
        return [
          { a: '0', b: '0', result: '0' },
          { a: '0', b: '1', result: '0' },
          { a: '1', b: '0', result: '0' },
          { a: '1', b: '1', result: '1' }
        ];
      case 'OR':
        return [
          { a: '0', b: '0', result: '0' },
          { a: '0', b: '1', result: '1' },
          { a: '1', b: '0', result: '1' },
          { a: '1', b: '1', result: '1' }
        ];
      case 'XOR':
        return [
          { a: '0', b: '0', result: '0' },
          { a: '0', b: '1', result: '1' },
          { a: '1', b: '0', result: '1' },
          { a: '1', b: '1', result: '0' }
        ];
      default:
        return [];
    }
  };

  const performOperation = () => {
    speakOperation("Bit Manipulation Basics", `Performing ${operation.replace('_', ' ')} operation. Let's see how individual bits interact.`);
    
    let res: number;
    let explanation: string;
    const binaryOp1 = operand1.toString(2).padStart(8, '0');
    let binaryOp2 = operand2?.toString(2).padStart(8, '0');
    let binaryRes: string;
    let truthTable = undefined;

    switch (operation) {
      case 'AND':
        res = operand1 & operand2;
        explanation = `${operand1} & ${operand2} = ${res}. AND operation: result bit is 1 only when both input bits are 1.`;
        truthTable = getTruthTable('AND');
        break;
      case 'OR':
        res = operand1 | operand2;
        explanation = `${operand1} | ${operand2} = ${res}. OR operation: result bit is 1 when at least one input bit is 1.`;
        truthTable = getTruthTable('OR');
        break;
      case 'XOR':
        res = operand1 ^ operand2;
        explanation = `${operand1} ^ ${operand2} = ${res}. XOR operation: result bit is 1 when input bits are different.`;
        truthTable = getTruthTable('XOR');
        break;
      case 'NOT':
        res = ~operand1 >>> 0; // Use unsigned right shift to handle negative numbers
        explanation = `~${operand1} = ${res}. NOT operation: flips every bit (0 becomes 1, 1 becomes 0).`;
        binaryOp2 = undefined;
        break;
      case 'LEFT_SHIFT':
        res = operand1 << operand2;
        explanation = `${operand1} << ${operand2} = ${res}. Left shift: moves bits left by ${operand2} positions, multiplying by 2^${operand2}.`;
        break;
      case 'RIGHT_SHIFT':
        res = operand1 >> operand2;
        explanation = `${operand1} >> ${operand2} = ${res}. Right shift: moves bits right by ${operand2} positions, dividing by 2^${operand2}.`;
        break;
      default:
        res = 0;
        explanation = 'Unknown operation';
    }

    binaryRes = res.toString(2).padStart(8, '0');

    setResult({
      operation,
      operand1,
      operand2: ['NOT'].includes(operation) ? undefined : operand2,
      result: res,
      explanation,
      binaryOperand1: binaryOp1,
      binaryOperand2: binaryOp2,
      binaryResult: binaryRes,
      truthTable
    });

    speakResult(`${operation.replace('_', ' ')} operation completed! Result: ${res}. ${explanation}`);
    toast.success(`${operation} operation completed`);
  };

  const reset = () => {
    setResult(null);
    setOperand1(12);
    setOperand2(10);
    setOperation('AND');
    setShowTruthTable(false);
  };

  const renderBinaryBits = (binary: string, label: string, highlight?: number[]) => {
    return (
      <div className="space-y-2">
        <div className="text-sm font-medium text-center">{label}</div>
        <div className="flex justify-center gap-1">
          {binary.split('').map((bit, index) => {
            const isHighlighted = highlight?.includes(index);
            return (
              <motion.div
                key={index}
                className={`w-10 h-10 flex items-center justify-center rounded border-2 font-mono font-bold text-lg ${
                  isHighlighted 
                    ? 'bg-yellow-200 border-yellow-400 text-yellow-800' 
                    : bit === '1' 
                      ? 'bg-blue-100 border-blue-300 text-blue-800' 
                      : 'bg-gray-100 border-gray-300 text-gray-600'
                }`}
                initial={{ scale: 1 }}
                animate={{ scale: isHighlighted ? 1.1 : 1 }}
                transition={{ duration: 0.2 }}
              >
                {bit}
              </motion.div>
            );
          })}
        </div>
        <div className="flex justify-center gap-1">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="w-10 text-xs text-center text-gray-500">
              {7 - i}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderBitByBitComparison = () => {
    if (!result || !result.binaryOperand2) return null;

    const bits1 = result.binaryOperand1.split('');
    const bits2 = result.binaryOperand2.split('');
    const bitsResult = result.binaryResult.split('');

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
        <h4 className="font-semibold mb-3 text-center">Bit-by-Bit Operation</h4>
        <div className="space-y-2">
          {bits1.map((bit1, index) => {
            const bit2 = bits2[index];
            const bitResult = bitsResult[index];
            const position = 7 - index;
            
            return (
              <div key={index} className="flex items-center justify-center gap-4 text-sm">
                <div className="w-16 text-right">Bit {position}:</div>
                <div className={`w-8 h-8 flex items-center justify-center rounded border font-mono ${
                  bit1 === '1' ? 'bg-blue-100 border-blue-300' : 'bg-gray-100 border-gray-300'
                }`}>
                  {bit1}
                </div>
                <div className="w-8 text-center font-bold">{result.operation === 'AND' ? '&' : result.operation === 'OR' ? '|' : '^'}</div>
                <div className={`w-8 h-8 flex items-center justify-center rounded border font-mono ${
                  bit2 === '1' ? 'bg-blue-100 border-blue-300' : 'bg-gray-100 border-gray-300'
                }`}>
                  {bit2}
                </div>
                <div className="w-8 text-center font-bold">=</div>
                <div className={`w-8 h-8 flex items-center justify-center rounded border font-mono ${
                  bitResult === '1' ? 'bg-green-100 border-green-300' : 'bg-gray-100 border-gray-300'
                }`}>
                  {bitResult}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Bit Manipulation Basics Visualizer</h3>
        <p className="text-muted-foreground">
          Learn fundamental bitwise operations with interactive binary visualization
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">First Number</label>
          <Input
            type="number"
            value={operand1}
            onChange={(e) => setOperand1(parseInt(e.target.value) || 0)}
            placeholder="Enter number"
            min="0"
            max="255"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Operation</label>
          <Select value={operation} onValueChange={setOperation}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {operations.map(op => (
                <SelectItem key={op.value} value={op.value}>
                  {op.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!['NOT'].includes(operation) && (
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {['LEFT_SHIFT', 'RIGHT_SHIFT'].includes(operation) ? 'Positions' : 'Second Number'}
            </label>
            <Input
              type="number"
              value={operand2}
              onChange={(e) => setOperand2(parseInt(e.target.value) || 0)}
              placeholder="Enter number"
              min="0"
              max={['LEFT_SHIFT', 'RIGHT_SHIFT'].includes(operation) ? "7" : "255"}
            />
          </div>
        )}

        <div className="flex gap-2 items-end">
          <Button onClick={performOperation} className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Calculate
          </Button>
          <Button onClick={reset} variant="outline">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Operation Description */}
      {operation && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-4 w-4 text-blue-600" />
            <span className="font-semibold text-blue-800 dark:text-blue-200">
              {operations.find(op => op.value === operation)?.label}
            </span>
          </div>
          <div className="text-sm text-blue-700 dark:text-blue-300">
            {operations.find(op => op.value === operation)?.description}
          </div>
        </div>
      )}

      {/* Visualization */}
      {result && (
        <div className="bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-950 dark:to-indigo-900 p-8 rounded-xl border-2 border-dashed border-purple-200 dark:border-purple-800">
          <div className="space-y-8">
            {/* Binary Representation */}
            <div className="space-y-6">
              <div className="text-center">
                <Binary className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <h3 className="text-lg font-semibold">Binary Operation Visualization</h3>
              </div>

              {renderBinaryBits(result.binaryOperand1, `${result.operand1} (decimal)`)}
              
              {result.binaryOperand2 && (
                <>
                  <div className="text-center text-2xl font-bold text-purple-600">
                    {operation.replace('_', ' ')}
                  </div>
                  {renderBinaryBits(result.binaryOperand2, 
                    result.operand2 !== undefined ? `${result.operand2} (decimal)` : 'Operand'
                  )}
                </>
              )}

              <div className="border-t-2 border-purple-300 pt-4">
                {renderBinaryBits(result.binaryResult, `${result.result} (decimal)`)}
              </div>
            </div>

            {/* Result */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border">
              <div className="text-center space-y-4">
                <div className="text-3xl font-bold text-green-600">
                  Result: {result.result}
                </div>
                <div className="text-sm text-muted-foreground max-w-2xl mx-auto">
                  {result.explanation}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bit-by-Bit Comparison */}
      {result && result.binaryOperand2 && renderBitByBitComparison()}

      {/* Truth Table */}
      {result && result.truthTable && (
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">Truth Table for {result.operation}</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTruthTable(!showTruthTable)}
            >
              {showTruthTable ? 'Hide' : 'Show'} Truth Table
            </Button>
          </div>
          
          {showTruthTable && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">A</th>
                    <th className="text-left p-2">B</th>
                    <th className="text-left p-2">A {result.operation === 'AND' ? '&' : result.operation === 'OR' ? '|' : '^'} B</th>
                  </tr>
                </thead>
                <tbody>
                  {result.truthTable.map((row, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2 font-mono">{row.a}</td>
                      <td className="p-2 font-mono">{row.b}</td>
                      <td className="p-2 font-mono font-bold">{row.result}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Common Patterns */}
      <div className="bg-card border rounded-lg p-4">
        <h4 className="font-semibold mb-4">Common Bit Manipulation Patterns:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div><strong>Check even/odd:</strong> n &amp; 1 (0 = even, 1 = odd)</div>
            <div><strong>Multiply by 2:</strong> n &lt;&lt; 1</div>
            <div><strong>Divide by 2:</strong> n &gt;&gt; 1</div>
            <div><strong>Set bit i:</strong> n | (1 &lt;&lt; i)</div>
          </div>
          <div className="space-y-2">
            <div><strong>Clear bit i:</strong> n &amp; ~(1 &lt;&lt; i)</div>
            <div><strong>Toggle bit i:</strong> n ^ (1 &lt;&lt; i)</div>
            <div><strong>Check bit i:</strong> (n &amp; (1 &lt;&lt; i)) != 0</div>
            <div><strong>Swap variables:</strong> a ^= b; b ^= a; a ^= b;</div>
          </div>
        </div>
      </div>

      {/* Visualizer Controls */}
      <div className="flex justify-center">
        <VisualizerControls
          showMemory={showMemory}
          onToggleMemory={setShowMemory}
          voiceEnabled={voiceEnabled}
          onToggleVoice={setVoiceEnabled}
          voiceSpeed={speed}
          onVoiceSpeedChange={setSpeed}
          isSpeaking={isSpeaking}
          onPauseSpeech={pauseSpeech}
          onResumeSpeech={resumeSpeech}
          onStopSpeech={stopSpeech}
        />
      </div>
    </div>
  );
}