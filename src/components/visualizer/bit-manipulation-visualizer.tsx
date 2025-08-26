import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Binary, Calculator, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface BitOperation {
  operation: string;
  operand1: number;
  operand2?: number;
  result: number;
  explanation: string;
  binaryOperand1: string;
  binaryOperand2?: string;
  binaryResult: string;
}

export function BitManipulationVisualizer() {
  const [operand1, setOperand1] = useState(12);
  const [operand2, setOperand2] = useState(10);
  const [operation, setOperation] = useState('AND');
  const [result, setResult] = useState<BitOperation | null>(null);
  const [position, setPosition] = useState(2);

  const operations = [
    'AND', 'OR', 'XOR', 'NOT', 'LEFT_SHIFT', 'RIGHT_SHIFT',
    'SET_BIT', 'CLEAR_BIT', 'TOGGLE_BIT', 'CHECK_BIT', 'COUNT_BITS', 'POWER_OF_TWO'
  ];

  const performOperation = () => {
    let res: number;
    let explanation: string;
    const binaryOp1 = operand1.toString(2).padStart(8, '0');
    let binaryOp2 = operand2?.toString(2).padStart(8, '0');
    let binaryRes: string;

    switch (operation) {
      case 'AND':
        res = operand1 & operand2;
        explanation = `${operand1} & ${operand2} = ${res}. Each bit is 1 only if both corresponding bits are 1.`;
        break;
      case 'OR':
        res = operand1 | operand2;
        explanation = `${operand1} | ${operand2} = ${res}. Each bit is 1 if at least one corresponding bit is 1.`;
        break;
      case 'XOR':
        res = operand1 ^ operand2;
        explanation = `${operand1} ^ ${operand2} = ${res}. Each bit is 1 if corresponding bits are different.`;
        break;
      case 'NOT':
        res = ~operand1 >>> 0; // Use unsigned right shift to handle negative numbers
        explanation = `~${operand1} = ${res}. Each bit is flipped (0 becomes 1, 1 becomes 0).`;
        binaryOp2 = undefined;
        break;
      case 'LEFT_SHIFT':
        res = operand1 << operand2;
        explanation = `${operand1} << ${operand2} = ${res}. Shift bits left by ${operand2} positions, fill with 0s.`;
        break;
      case 'RIGHT_SHIFT':
        res = operand1 >> operand2;
        explanation = `${operand1} >> ${operand2} = ${res}. Shift bits right by ${operand2} positions.`;
        break;
      case 'SET_BIT':
        res = operand1 | (1 << position);
        explanation = `Set bit at position ${position}: ${operand1} | (1 << ${position}) = ${res}`;
        binaryOp2 = (1 << position).toString(2).padStart(8, '0');
        break;
      case 'CLEAR_BIT':
        res = operand1 & ~(1 << position);
        explanation = `Clear bit at position ${position}: ${operand1} & ~(1 << ${position}) = ${res}`;
        binaryOp2 = (~(1 << position) >>> 0).toString(2).slice(-8);
        break;
      case 'TOGGLE_BIT':
        res = operand1 ^ (1 << position);
        explanation = `Toggle bit at position ${position}: ${operand1} ^ (1 << ${position}) = ${res}`;
        binaryOp2 = (1 << position).toString(2).padStart(8, '0');
        break;
      case 'CHECK_BIT':
        res = (operand1 & (1 << position)) !== 0 ? 1 : 0;
        explanation = `Check bit at position ${position}: (${operand1} & (1 << ${position})) !== 0 = ${res === 1 ? 'true' : 'false'}`;
        binaryOp2 = (1 << position).toString(2).padStart(8, '0');
        break;
      case 'COUNT_BITS':
        res = operand1.toString(2).split('1').length - 1;
        explanation = `Count set bits in ${operand1}: ${res} bits are set to 1`;
        binaryOp2 = undefined;
        break;
      case 'POWER_OF_TWO':
        res = operand1 > 0 && (operand1 & (operand1 - 1)) === 0 ? 1 : 0;
        explanation = `Is ${operand1} a power of 2? ${res === 1 ? 'Yes' : 'No'}. Check: ${operand1} > 0 && (${operand1} & ${operand1 - 1}) === 0`;
        binaryOp2 = (operand1 - 1).toString(2).padStart(8, '0');
        break;
      default:
        res = 0;
        explanation = 'Unknown operation';
    }

    binaryRes = res.toString(2).padStart(8, '0');

    setResult({
      operation,
      operand1,
      operand2: ['NOT', 'COUNT_BITS', 'POWER_OF_TWO'].includes(operation) ? undefined : 
                ['SET_BIT', 'CLEAR_BIT', 'TOGGLE_BIT', 'CHECK_BIT'].includes(operation) ? position : operand2,
      result: res,
      explanation,
      binaryOperand1: binaryOp1,
      binaryOperand2: binaryOp2,
      binaryResult: binaryRes
    });
  };

  const reset = () => {
    setResult(null);
    setOperand1(12);
    setOperand2(10);
    setPosition(2);
    setOperation('AND');
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
                className={`w-8 h-8 flex items-center justify-center rounded border-2 font-mono font-bold ${
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
            <div key={i} className="w-8 text-xs text-center text-gray-500">
              {7 - i}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">First Operand</label>
          <Input
            type="number"
            value={operand1}
            onChange={(e) => setOperand1(parseInt(e.target.value) || 0)}
            placeholder="Enter number"
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
                <SelectItem key={op} value={op}>
                  {op.replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!['NOT', 'COUNT_BITS', 'POWER_OF_TWO', 'SET_BIT', 'CLEAR_BIT', 'TOGGLE_BIT', 'CHECK_BIT'].includes(operation) && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Second Operand</label>
            <Input
              type="number"
              value={operand2}
              onChange={(e) => setOperand2(parseInt(e.target.value) || 0)}
              placeholder="Enter number"
            />
          </div>
        )}

        {['SET_BIT', 'CLEAR_BIT', 'TOGGLE_BIT', 'CHECK_BIT'].includes(operation) && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Bit Position</label>
            <Input
              type="number"
              value={position}
              onChange={(e) => setPosition(Math.max(0, Math.min(7, parseInt(e.target.value) || 0)))}
              placeholder="0-7"
              min="0"
              max="7"
            />
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={performOperation} className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Calculate
          </Button>
          <Button onClick={reset} variant="outline">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Visualization */}
      {result && (
        <div className="bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-950 dark:to-indigo-900 p-8 rounded-xl border-2 border-dashed border-purple-200 dark:border-purple-800">
          <div className="space-y-8">
            {/* Binary Representation */}
            <div className="space-y-6">
              <div className="text-center">
                <Binary className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <h3 className="text-lg font-semibold">Binary Representation</h3>
              </div>

              {renderBinaryBits(result.binaryOperand1, `${result.operand1} (decimal)`)}
              
              {result.binaryOperand2 && (
                <>
                  <div className="text-center text-2xl font-bold text-purple-600">
                    {operation.replace('_', ' ')}
                  </div>
                  {renderBinaryBits(result.binaryOperand2, 
                    result.operand2 !== undefined ? `${result.operand2} (decimal)` : 'Mask'
                  )}
                </>
              )}

              <div className="border-t-2 border-purple-300 pt-4">
                {renderBinaryBits(result.binaryResult, `${result.result} (decimal)`, 
                  // Highlight changed bits for certain operations
                  ['SET_BIT', 'CLEAR_BIT', 'TOGGLE_BIT'].includes(operation) ? [7 - position] : undefined
                )}
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

      {/* Common Bit Patterns */}
      <div className="bg-card border rounded-lg p-4">
        <h4 className="font-semibold mb-4">Common Bit Manipulation Patterns:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div><strong>Set bit:</strong> n | (1 &lt;&lt; pos)</div>
            <div><strong>Clear bit:</strong> n &amp; ~(1 &lt;&lt; pos)</div>
            <div><strong>Toggle bit:</strong> n ^ (1 &lt;&lt; pos)</div>
            <div><strong>Check bit:</strong> (n &amp; (1 &lt;&lt; pos)) !== 0</div>
          </div>
          <div className="space-y-2">
            <div><strong>Power of 2:</strong> n &gt; 0 &amp;&amp; (n &amp; (n-1)) === 0</div>
            <div><strong>Count bits:</strong> Use Brian Kernighan's algorithm</div>
            <div><strong>Swap numbers:</strong> a ^= b; b ^= a; a ^= b;</div>
            <div><strong>Get rightmost set bit:</strong> n &amp; -n</div>
          </div>
        </div>
      </div>

      {/* Truth Tables */}
      <div className="bg-card border rounded-lg p-4">
        <h4 className="font-semibold mb-4">Bitwise Operations Truth Table:</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">A</th>
                <th className="text-left p-2">B</th>
                <th className="text-left p-2">A & B</th>
                <th className="text-left p-2">A | B</th>
                <th className="text-left p-2">A ^ B</th>
                <th className="text-left p-2">~A</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2">0</td>
                <td className="p-2">0</td>
                <td className="p-2">0</td>
                <td className="p-2">0</td>
                <td className="p-2">0</td>
                <td className="p-2">1</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">0</td>
                <td className="p-2">1</td>
                <td className="p-2">0</td>
                <td className="p-2">1</td>
                <td className="p-2">1</td>
                <td className="p-2">1</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">1</td>
                <td className="p-2">0</td>
                <td className="p-2">0</td>
                <td className="p-2">1</td>
                <td className="p-2">1</td>
                <td className="p-2">0</td>
              </tr>
              <tr>
                <td className="p-2">1</td>
                <td className="p-2">1</td>
                <td className="p-2">1</td>
                <td className="p-2">1</td>
                <td className="p-2">0</td>
                <td className="p-2">0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}