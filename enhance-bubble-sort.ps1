# PowerShell script to enhance Bubble Sort topic

$filePath = "c:\DSA\DSA-Project\src\data\dsaTopics.ts"
$content = Get-Content $filePath -Raw

# Enhance Bubble Sort
$bubbleOld = @"
   \`\`\``
  },
  {
    id: 'merge-sort',
"@

$bubbleNew = @"
   \`\`\``,
    voiceExplanation: `Think of bubble sort like organizing a line of people by height, but you can only compare and swap adjacent people! Imagine you're a teacher organizing students in a hallway, and you can only ask two students standing next to each other to switch places if the shorter one is behind the taller one. You start at the beginning of the line and work your way to the end, making swaps as needed. After one complete pass through the line, you're guaranteed that the tallest person has "bubbled up" to the back of the line! Then you do it again, and the second tallest person bubbles up to the second-to-last position. It's like watching bubbles rise to the surface of a fizzy drink - the biggest elements naturally float to the top (end) of the array. The beautiful thing is that after each pass, you know one more element is in its final correct position, so you can ignore it in the next pass!`,
    realWorldApplications: `**Industry Applications:**
- **Educational Systems**: Teaching fundamental sorting concepts in computer science courses
- **Small Dataset Processing**: Sorting small lists where simplicity matters more than efficiency
- **Embedded Systems**: Simple sorting for microcontrollers with limited memory
- **Algorithm Visualization**: Demonstrating sorting principles in educational software
- **Code Interviews**: Testing understanding of basic algorithms and optimization
- **Debugging Tools**: Simple sorting for small debug datasets
- **Game Development**: Sorting small arrays like high scores or player lists
- **IoT Devices**: Lightweight sorting for sensor data with few readings
- **Prototyping**: Quick implementation when developing proof-of-concept systems
- **Legacy Systems**: Maintaining old codebases where bubble sort was historically used`,
    keyConcepts: `**Essential Concepts:**
1. **Adjacent Comparison**: Only compares and swaps neighboring elements
2. **Bubbling Effect**: Largest elements "bubble" to their correct positions
3. **Multiple Passes**: Requires n-1 passes for complete sorting
4. **In-Place Sorting**: Sorts without requiring additional memory space
5. **Stable Algorithm**: Maintains relative order of equal elements
6. **Early Termination**: Can stop early if no swaps occur in a pass
7. **Quadratic Complexity**: O(n²) time complexity in average and worst cases
8. **Optimization Potential**: Can be improved with flags and range reduction`,
    pseudocode: `**Bubble Sort Pseudocode:**

ALGORITHM BubbleSort(array)
INPUT: array of comparable elements
OUTPUT: sorted array in ascending order
BEGIN
    n = length of array
    
    FOR i = 0 TO n-2 DO
        swapped = FALSE
        
        FOR j = 0 TO n-i-2 DO
            IF array[j] > array[j+1] THEN
                SWAP array[j] AND array[j+1]
                swapped = TRUE
            END IF
        END FOR
        
        // Early termination optimization
        IF swapped = FALSE THEN
            BREAK  // Array is already sorted
        END IF
    END FOR
    
    RETURN array
END

ALGORITHM BubbleSortOptimized(array)
INPUT: array of comparable elements
OUTPUT: sorted array with optimizations
BEGIN
    n = length of array
    
    REPEAT
        newN = 0
        FOR i = 1 TO n-1 DO
            IF array[i-1] > array[i] THEN
                SWAP array[i-1] AND array[i]
                newN = i
            END IF
        END FOR
        n = newN
    UNTIL n ≤ 1
    
    RETURN array
END

ALGORITHM BubbleSortWithCounting(array)
INPUT: array of comparable elements
OUTPUT: sorted array with operation counting
BEGIN
    n = length of array
    comparisons = 0
    swaps = 0
    
    FOR i = 0 TO n-2 DO
        FOR j = 0 TO n-i-2 DO
            comparisons = comparisons + 1
            IF array[j] > array[j+1] THEN
                SWAP array[j] AND array[j+1]
                swaps = swaps + 1
            END IF
        END FOR
    END FOR
    
    PRINT "Comparisons: " + comparisons
    PRINT "Swaps: " + swaps
    RETURN array
END`,
    implementationCode: `// Comprehensive Bubble Sort Implementation

class BubbleSort {
    constructor() {
        this.comparisons = 0;
        this.swaps = 0;
        this.passes = 0;
    }
    
    // Basic bubble sort implementation
    basicSort(arr) {
        const array = [...arr]; // Create copy to avoid mutation
        const n = array.length;
        
        this.resetCounters();
        
        for (let i = 0; i < n - 1; i++) {
            this.passes++;
            
            for (let j = 0; j < n - i - 1; j++) {
                this.comparisons++;
                
                if (array[j] > array[j + 1]) {
                    // Swap elements
                    [array[j], array[j + 1]] = [array[j + 1], array[j]];
                    this.swaps++;
                }
            }
        }
        
        return array;
    }
    
    // Optimized bubble sort with early termination
    optimizedSort(arr) {
        const array = [...arr];
        const n = array.length;
        
        this.resetCounters();
        
        for (let i = 0; i < n - 1; i++) {
            let swapped = false;
            this.passes++;
            
            for (let j = 0; j < n - i - 1; j++) {
                this.comparisons++;
                
                if (array[j] > array[j + 1]) {
                    [array[j], array[j + 1]] = [array[j + 1], array[j]];
                    this.swaps++;
                    swapped = true;
                }
            }
            
            // Early termination if no swaps occurred
            if (!swapped) {
                break;
            }
        }
        
        return array;
    }
    
    // Cocktail shaker sort (bidirectional bubble sort)
    cocktailSort(arr) {
        const array = [...arr];
        let start = 0;
        let end = array.length - 1;
        let swapped = true;
        
        this.resetCounters();
        
        while (swapped) {
            swapped = false;
            this.passes++;
            
            // Forward pass
            for (let i = start; i < end; i++) {
                this.comparisons++;
                if (array[i] > array[i + 1]) {
                    [array[i], array[i + 1]] = [array[i + 1], array[i]];
                    this.swaps++;
                    swapped = true;
                }
            }
            
            if (!swapped) break;
            
            end--;
            swapped = false;
            
            // Backward pass
            for (let i = end; i > start; i--) {
                this.comparisons++;
                if (array[i] < array[i - 1]) {
                    [array[i], array[i - 1]] = [array[i - 1], array[i]];
                    this.swaps++;
                    swapped = true;
                }
            }
            
            start++;
        }
        
        return array;
    }
    
    // Bubble sort with step-by-step visualization
    sortWithSteps(arr) {
        const array = [...arr];
        const steps = [];
        const n = array.length;
        
        this.resetCounters();
        
        // Initial state
        steps.push({
            array: [...array],
            pass: 0,
            comparing: null,
            swapped: false,
            description: 'Initial array'
        });
        
        for (let i = 0; i < n - 1; i++) {
            this.passes++;
            let passSwapped = false;
            
            for (let j = 0; j < n - i - 1; j++) {
                this.comparisons++;
                
                // Show comparison
                steps.push({
                    array: [...array],
                    pass: i + 1,
                    comparing: [j, j + 1],
                    swapped: false,
                    description: \`Pass \${i + 1}: Comparing \${array[j]} and \${array[j + 1]}\`
                });
                
                if (array[j] > array[j + 1]) {
                    [array[j], array[j + 1]] = [array[j + 1], array[j]];
                    this.swaps++;
                    passSwapped = true;
                    
                    // Show swap
                    steps.push({
                        array: [...array],
                        pass: i + 1,
                        comparing: [j, j + 1],
                        swapped: true,
                        description: \`Pass \${i + 1}: Swapped \${array[j + 1]} and \${array[j]}\`
                    });
                }
            }
            
            // End of pass
            steps.push({
                array: [...array],
                pass: i + 1,
                comparing: null,
                swapped: false,
                description: \`Pass \${i + 1} complete. Element \${array[n - i - 1]} is in final position.\`
            });
            
            if (!passSwapped) {
                steps.push({
                    array: [...array],
                    pass: i + 1,
                    comparing: null,
                    swapped: false,
                    description: 'No swaps in this pass. Array is sorted!'
                });
                break;
            }
        }
        
        return {
            sortedArray: array,
            steps: steps,
            statistics: this.getStatistics()
        };
    }
    
    // Performance analysis
    analyzeComplexity(size) {
        const worstCase = size * (size - 1) / 2;
        const bestCase = size - 1;
        const averageCase = worstCase / 2;
        
        return {
            worstCase: {
                comparisons: worstCase,
                swaps: worstCase,
                description: 'Reverse sorted array'
            },
            bestCase: {
                comparisons: bestCase,
                swaps: 0,
                description: 'Already sorted array (with optimization)'
            },
            averageCase: {
                comparisons: worstCase,
                swaps: averageCase,
                description: 'Random array'
            }
        };
    }
    
    // Reset performance counters
    resetCounters() {
        this.comparisons = 0;
        this.swaps = 0;
        this.passes = 0;
    }
    
    // Get performance statistics
    getStatistics() {
        return {
            comparisons: this.comparisons,
            swaps: this.swaps,
            passes: this.passes
        };
    }
    
    // Utility method to generate test data
    static generateTestData(size, type = 'random') {
        const data = [];
        
        switch (type) {
            case 'random':
                for (let i = 0; i < size; i++) {
                    data.push(Math.floor(Math.random() * 100) + 1);
                }
                break;
                
            case 'sorted':
                for (let i = 1; i <= size; i++) {
                    data.push(i);
                }
                break;
                
            case 'reverse':
                for (let i = size; i >= 1; i--) {
                    data.push(i);
                }
                break;
                
            case 'nearly-sorted':
                for (let i = 1; i <= size; i++) {
                    data.push(i);
                }
                // Swap a few random elements
                for (let i = 0; i < Math.floor(size / 10); i++) {
                    const idx1 = Math.floor(Math.random() * size);
                    const idx2 = Math.floor(Math.random() * size);
                    [data[idx1], data[idx2]] = [data[idx2], data[idx1]];
                }
                break;
        }
        
        return data;
    }
}

// Usage Examples and Testing
console.log('=== Bubble Sort Examples ===');

const bubbleSort = new BubbleSort();

// Test with different data types
const testArrays = {
    small: [64, 34, 25, 12, 22, 11, 90],
    sorted: [1, 2, 3, 4, 5],
    reverse: [5, 4, 3, 2, 1],
    duplicates: [3, 1, 4, 1, 5, 9, 2, 6, 5, 3]
};

console.log('\\n--- Basic Bubble Sort ---');
Object.entries(testArrays).forEach(([name, arr]) => {
    const sorted = bubbleSort.basicSort(arr);
    const stats = bubbleSort.getStatistics();
    console.log(\`\${name}: \${arr} → \${sorted}\`);
    console.log(\`  Stats: \${stats.comparisons} comparisons, \${stats.swaps} swaps, \${stats.passes} passes\\n\`);
});

console.log('\\n--- Optimized Bubble Sort ---');
Object.entries(testArrays).forEach(([name, arr]) => {
    const sorted = bubbleSort.optimizedSort(arr);
    const stats = bubbleSort.getStatistics();
    console.log(\`\${name}: \${arr} → \${sorted}\`);
    console.log(\`  Stats: \${stats.comparisons} comparisons, \${stats.swaps} swaps, \${stats.passes} passes\\n\`);
});

// Demonstrate step-by-step sorting
console.log('\\n--- Step-by-Step Sorting ---');
const stepResult = bubbleSort.sortWithSteps([3, 1, 4, 1, 5]);
console.log('Final result:', stepResult.sortedArray);
console.log('Total steps:', stepResult.steps.length);
console.log('Statistics:', stepResult.statistics);

// Performance analysis
console.log('\\n--- Complexity Analysis ---');
const analysis = bubbleSort.analyzeComplexity(10);
console.log('For array of size 10:');
console.log('Best case:', analysis.bestCase);
console.log('Average case:', analysis.averageCase);
console.log('Worst case:', analysis.worstCase);`,
    quizQuestions: [
      {
        question: "What is the key characteristic that gives bubble sort its name?",
        options: ["It creates bubbles in memory", "Smaller elements bubble to the beginning", "It uses bubble-like data structures", "It pops elements like bubbles"],
        correctAnswer: 1,
        explanation: "Bubble sort gets its name because smaller elements 'bubble' to the beginning of the array through successive swaps with adjacent elements, similar to how air bubbles rise to the surface."
      },
      {
        question: "What is the time complexity of bubble sort in the worst case?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(2^n)"],
        correctAnswer: 2,
        explanation: "Bubble sort has O(n²) time complexity in the worst case because it uses nested loops - the outer loop runs n times and the inner loop runs up to n times for each iteration."
      },
      {
        question: "Which optimization can improve bubble sort's performance on nearly sorted arrays?",
        options: ["Using recursion", "Adding a flag to detect when no swaps occur", "Using binary search", "Implementing it iteratively"],
        correctAnswer: 1,
        explanation: "Adding a flag to detect when no swaps occur in a pass allows bubble sort to terminate early if the array becomes sorted, improving performance from O(n²) to O(n) for already sorted arrays."
      },
      {
        question: "Is bubble sort a stable sorting algorithm?",
        options: ["Yes, it maintains relative order of equal elements", "No, it changes the relative order of equal elements", "Only when optimized", "It depends on the implementation"],
        correctAnswer: 0,
        explanation: "Bubble sort is stable because it only swaps adjacent elements when they are strictly out of order (arr[i] > arr[i+1]), never when they are equal, thus preserving the relative order of equal elements."
      },
      {
        question: "What is the space complexity of bubble sort?",
        options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
        correctAnswer: 2,
        explanation: "Bubble sort has O(1) space complexity because it sorts in-place, only using a constant amount of extra memory for temporary variables regardless of input size."
      }
    ]
  },
  {
    id: 'merge-sort',
"@

# Replace Bubble Sort content
$content = $content -replace [regex]::Escape($bubbleOld), $bubbleNew

# Write back to file
$content | Set-Content $filePath -Encoding UTF8

Write-Host "Successfully enhanced Bubble Sort with all missing components!"
Write-Host "Added: voiceExplanation, realWorldApplications, keyConcepts, pseudocode, implementationCode, quizQuestions"
