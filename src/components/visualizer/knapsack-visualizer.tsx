import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Play, RotateCcw, Plus, Trash2 } from 'lucide-react';
import { PseudocodeBox } from '@/components/pseudocode-box';
import { ComplexityBox } from '@/components/complexity-box';
import { toast } from 'sonner';

interface Item {
  id: number;
  weight: number;
  value: number;
  selected: boolean;
}

interface DPCell {
  value: number;
  highlighted: boolean;
  current: boolean;
}

export function KnapsackVisualizer() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, weight: 1, value: 1, selected: false },
    { id: 2, weight: 3, value: 4, selected: false },
    { id: 3, weight: 4, value: 5, selected: false },
    { id: 4, weight: 5, value: 7, selected: false }
  ]);
  
  const [capacity, setCapacity] = useState(7);
  const [newWeight, setNewWeight] = useState('');
  const [newValue, setNewValue] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [dpTable, setDPTable] = useState<DPCell[][]>([]);
  const [solution, setSolution] = useState<number[]>([]);
  const [maxValue, setMaxValue] = useState(0);
  const [stepDescription, setStepDescription] = useState('');

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const pseudocode = [
    "function knapsack(items, capacity):",
    "  dp = array[items.length + 1][capacity + 1]",
    "  ",
    "  for i = 0 to items.length:",
    "    for w = 0 to capacity:",
    "      if i == 0 or w == 0:",
    "        dp[i][w] = 0",
    "      elif items[i-1].weight <= w:",
    "        include = items[i-1].value + dp[i-1][w - items[i-1].weight]",
    "        exclude = dp[i-1][w]",
    "        dp[i][w] = max(include, exclude)",
    "      else:",
    "        dp[i][w] = dp[i-1][w]",
    "  ",
    "  return dp[items.length][capacity]"
  ];

  const initializeDP = () => {
    const rows = items.length + 1;
    const cols = capacity + 1;
    return Array(rows).fill(null).map(() => 
      Array(cols).fill(null).map(() => ({ 
        value: 0, 
        highlighted: false, 
        current: false 
      }))
    );
  };

  const solveKnapsack = useCallback(async () => {
    setIsAnimating(true);
    setCurrentStep(0);
    setStepDescription("Initializing DP table...");
    
    const dp = initializeDP();
    setDPTable(dp);
    await sleep(1000);

    setCurrentStep(3);
    setStepDescription("Filling DP table row by row...");

    // Fill the DP table
    for (let i = 0; i <= items.length; i++) {
      for (let w = 0; w <= capacity; w++) {
        // Highlight current cell
        setDPTable(prev => prev.map((row, ri) => 
          row.map((cell, ci) => ({
            ...cell,
            current: ri === i && ci === w,
            highlighted: false
          }))
        ));
        
        await sleep(300);
        
        if (i === 0 || w === 0) {
          setCurrentStep(6);
          setStepDescription(`Base case: dp[${i}][${w}] = 0`);
          dp[i][w].value = 0;
        } else {
          const item = items[i - 1];
          if (item.weight <= w) {
            setCurrentStep(8);
            const include = item.value + dp[i - 1][w - item.weight].value;
            const exclude = dp[i - 1][w].value;
            
            setStepDescription(
              `Item ${item.id}: weight=${item.weight}, value=${item.value}. ` +
              `Include: ${item.value} + dp[${i-1}][${w-item.weight}] = ${include}. ` +
              `Exclude: dp[${i-1}][${w}] = ${exclude}`
            );
            
            // Highlight relevant cells
            setDPTable(prev => prev.map((row, ri) => 
              row.map((cell, ci) => ({
                ...cell,
                highlighted: (ri === i-1 && ci === w) || (ri === i-1 && ci === w-item.weight),
                current: ri === i && ci === w
              }))
            ));
            
            await sleep(800);
            
            setCurrentStep(10);
            dp[i][w].value = Math.max(include, exclude);
            setStepDescription(`dp[${i}][${w}] = max(${include}, ${exclude}) = ${dp[i][w].value}`);
          } else {
            setCurrentStep(12);
            dp[i][w].value = dp[i - 1][w].value;
            setStepDescription(
              `Item ${item.id} too heavy (${item.weight} > ${w}). ` +
              `dp[${i}][${w}] = dp[${i-1}][${w}] = ${dp[i][w].value}`
            );
            
            // Highlight relevant cell
            setDPTable(prev => prev.map((row, ri) => 
              row.map((cell, ci) => ({
                ...cell,
                highlighted: ri === i-1 && ci === w,
                current: ri === i && ci === w
              }))
            ));
          }
          
          await sleep(500);
        }
        
        // Update the DP table display
        setDPTable([...dp]);
      }
    }

    // Backtrack to find solution
    setCurrentStep(14);
    setStepDescription("Backtracking to find optimal solution...");
    
    const selectedItems: number[] = [];
    let i = items.length;
    let w = capacity;
    
    while (i > 0 && w > 0) {
      if (dp[i][w].value !== dp[i - 1][w].value) {
        selectedItems.push(i - 1);
        w -= items[i - 1].weight;
      }
      i--;
    }
    
    setSolution(selectedItems);
    setMaxValue(dp[items.length][capacity].value);
    
    // Highlight solution
    setItems(prev => prev.map((item, index) => ({
      ...item,
      selected: selectedItems.includes(index)
    })));

    // Clear highlighting
    setDPTable(prev => prev.map(row => 
      row.map(cell => ({ ...cell, highlighted: false, current: false }))
    ));
    
    setCurrentStep(-1);
    setStepDescription(`Optimal solution found! Maximum value: ${dp[items.length][capacity].value}`);
    setIsAnimating(false);
    
    toast.success(`Knapsack solved! Maximum value: ${dp[items.length][capacity].value}`);
  }, [items, capacity]);

  const addItem = () => {
    const weight = parseInt(newWeight);
    const value = parseInt(newValue);
    
    if (!weight || !value || weight <= 0 || value <= 0) {
      toast.error('Please enter valid positive numbers for weight and value');
      return;
    }
    
    const newItem: Item = {
      id: items.length + 1,
      weight,
      value,
      selected: false
    };
    
    setItems([...items, newItem]);
    setNewWeight('');
    setNewValue('');
    toast.success('Item added successfully!');
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
    toast.success('Item removed!');
  };

  const handleReset = () => {
    setItems(prev => prev.map(item => ({ ...item, selected: false })));
    setDPTable([]);
    setSolution([]);
    setMaxValue(0);
    setCurrentStep(-1);
    setStepDescription('');
    setIsAnimating(false);
    toast.info('Knapsack reset!');
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-4 p-4 bg-card border rounded-xl">
          <h3 className="text-lg font-semibold">Knapsack Configuration</h3>
          <div>
            <Label htmlFor="capacity">Knapsack Capacity</Label>
            <Input
              id="capacity"
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(parseInt(e.target.value) || 0)}
              disabled={isAnimating}
              min="1"
            />
          </div>
          <Button onClick={solveKnapsack} disabled={isAnimating || items.length === 0} className="w-full">
            <Play className="h-4 w-4 mr-2" />
            Solve Knapsack
          </Button>
          <Button onClick={handleReset} variant="outline" className="w-full">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
        
        <div className="space-y-4 p-4 bg-card border rounded-xl">
          <h3 className="text-lg font-semibold">Add New Item</h3>
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="newWeight">Weight</Label>
              <Input
                id="newWeight"
                type="number"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                placeholder="Weight"
                disabled={isAnimating}
                min="1"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="newValue">Value</Label>
              <Input
                id="newValue"
                type="number"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="Value"
                disabled={isAnimating}
                min="1"
              />
            </div>
          </div>
          <Button onClick={addItem} disabled={isAnimating} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Items Display */}
      <div className="p-4 bg-card border rounded-xl">
        <h3 className="text-lg font-semibold mb-3">Items</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {items.map((item) => (
            <div 
              key={item.id}
              className={`p-3 border rounded-lg transition-all duration-300 ${
                item.selected 
                  ? 'border-success bg-success/10' 
                  : 'border-border bg-card hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Badge variant={item.selected ? 'default' : 'outline'}>
                  Item {item.id}
                </Badge>
                <Button 
                  onClick={() => removeItem(item.id)}
                  disabled={isAnimating}
                  variant="ghost" 
                  size="sm"
                  className="h-6 w-6 p-0 text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <div className="text-sm space-y-1">
                <div>Weight: <span className="font-mono">{item.weight}</span></div>
                <div>Value: <span className="font-mono">{item.value}</span></div>
                <div>Ratio: <span className="font-mono">{(item.value / item.weight).toFixed(2)}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status */}
      {stepDescription && (
        <div className="p-3 bg-info/10 border border-info/20 rounded-lg">
          <p className="text-info font-medium">{stepDescription}</p>
        </div>
      )}

      {/* Solution Display */}
      {maxValue > 0 && (
        <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
          <h3 className="text-lg font-semibold text-success mb-2">Optimal Solution</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-success/80">Maximum Value</div>
              <div className="text-2xl font-bold text-success">{maxValue}</div>
            </div>
            <div>
              <div className="text-sm text-success/80">Selected Items</div>
              <div className="flex gap-1 mt-1">
                {solution.map(index => (
                  <Badge key={index} variant="outline" className="border-success text-success">
                    Item {items[index].id}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm text-success/80">Total Weight</div>
              <div className="text-lg font-semibold text-success">
                {solution.reduce((sum, index) => sum + items[index].weight, 0)} / {capacity}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DP Table */}
      {dpTable.length > 0 && (
        <div className="p-4 bg-card border rounded-xl">
          <h3 className="text-lg font-semibold mb-3">Dynamic Programming Table</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="p-2 border bg-muted text-center">Items/Capacity</th>
                  {Array.from({ length: capacity + 1 }, (_, i) => (
                    <th key={i} className="p-2 border bg-muted text-center min-w-[40px]">{i}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dpTable.map((row, i) => (
                  <tr key={i}>
                    <td className="p-2 border bg-muted text-center font-medium">
                      {i === 0 ? '∅' : `Item ${items[i-1].id}`}
                    </td>
                    {row.map((cell, j) => (
                      <td 
                        key={j} 
                        className={`p-2 border text-center transition-all duration-300 ${
                          cell.current 
                            ? 'bg-destructive text-destructive-foreground' 
                            : cell.highlighted 
                            ? 'bg-warning/20 border-warning' 
                            : 'bg-background'
                        }`}
                      >
                        {cell.value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pseudocode and Complexity */}
      <div className="grid md:grid-cols-2 gap-6">
        <PseudocodeBox
          title="0/1 Knapsack Algorithm"
          code={pseudocode}
          highlightedLine={currentStep}
        />
        
        <ComplexityBox
          timeComplexity="O(n × W)"
          spaceComplexity="O(n × W)"
          title="Knapsack Complexity"
          description="Where n is the number of items and W is the knapsack capacity. This is a pseudo-polynomial time algorithm."
        />
      </div>
    </div>
  );
}