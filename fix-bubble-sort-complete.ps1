# PowerShell script to complete Bubble Sort with all missing components

$filePath = "c:\DSA\DSA-Project\src\data\dsaTopics.ts"
$content = Get-Content $filePath -Raw

Write-Host "🔧 FIXING BUBBLE SORT - Adding Missing Components..." -ForegroundColor Yellow

# Find Bubble Sort section and add missing components
$bubbleOld = @"
    syntax: `**Bubble Sort Patterns:**

1. **Basic Bubble Sort:**
   \`\`\`javascript
   function bubbleSort(arr) {
       for (let i = 0; i < arr.length - 1; i++) {
           for (let j = 0; j < arr.length - i - 1; j++) {
               if (arr[j] > arr[j + 1]) {
                   [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
               }
           }
       }
       return arr;
   }
   \`\`\`

2. **Optimized Bubble Sort:**
   \`\`\`javascript
   function bubbleSortOptimized(arr) {
       let n = arr.length, swapped;
       do {
           swapped = false;
           for (let i = 1; i < n; i++) {
               if (arr[i - 1] > arr[i]) {
                   [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
                   swapped = true;
               }
           }
           n--; // Reduce range as largest element is in place
       } while (swapped);
       return arr;
   }
   \`\`\``
"@

$bubbleNew = @"
    voiceExplanation: `Think of bubble sort like organizing a line of people by height, but you can only compare and swap adjacent people! Imagine you're a teacher organizing students for a class photo. You start at the left end of the line and compare each pair of neighboring students. If the taller student is on the left, you ask them to swap places. You keep doing this, moving from left to right through the entire line. After one complete pass, you'll notice something magical - the tallest student has "bubbled up" to the rightmost position! Now you repeat the process, but since you know the tallest is already in place, you don't need to check the last position. Each pass guarantees that the next tallest student bubbles up to their correct spot. It's like watching bubbles rise to the surface of water - the biggest elements naturally float to the top (or in this case, the right side). The process continues until no more swaps are needed, meaning everyone is perfectly organized by height!`,
    realWorldApplications: `**Industry Applications:**
- **Educational Systems**: Teaching fundamental sorting concepts in computer science courses
- **Small Dataset Processing**: Sorting small lists where simplicity matters more than efficiency
- **Embedded Systems**: Simple sorting for microcontrollers with severe memory constraints
- **Algorithm Visualization**: Demonstrating sorting concepts in educational software
- **Code Interviews**: Testing understanding of basic algorithms and optimization techniques
- **Debugging Tools**: Simple sorting for small diagnostic datasets
- **Game Development**: Sorting small arrays like inventory items or high scores
- **IoT Devices**: Lightweight sorting for sensor data with minimal processing power
- **Prototyping**: Quick implementation for proof-of-concept applications
- **Legacy Systems**: Maintaining old codebases where bubble sort was historically used`,
    keyConcepts: `**Essential Concepts:**
1. **Adjacent Comparison**: Core operation comparing only neighboring elements
2. **Bubble Effect**: Largest elements "bubble up" to correct positions each pass
3. **Pass-by-Pass Reduction**: Each pass reduces the unsorted region by one element
4. **Early Termination**: Optimization to stop when no swaps occur in a pass
5. **Stable Sorting**: Equal elements maintain their relative order
6. **In-Place Algorithm**: Sorts without requiring additional array space
7. **Adaptive Potential**: Can be optimized to detect already sorted arrays
8. **Quadratic Complexity**: Understanding why it's O(n²) in average and worst cases`,
    pseudocode: `**Bubble Sort Pseudocode:**

ALGORITHM BubbleSort(array)
INPUT: array of comparable elements
OUTPUT: sorted array in ascending order
BEGIN
    n = length of array
    
    FOR i = 0 TO n-2 DO
        swapped = false
        
        // Last i elements are already in correct position
        FOR j = 0 TO n-i-2 DO
            IF array[j] > array[j+1] THEN
                // Swap adjacent elements
                SWAP array[j] AND array[j+1]
                swapped = true
            END IF
        END FOR
        
        // If no swapping occurred, array is sorted
        IF swapped = false THEN
            BREAK
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
        swapped = false
        newN = 0
        
        FOR i = 1 TO n-1 DO
            IF array[i-1] > array[i] THEN
                SWAP array[i-1] AND array[i]
                swapped = true
                newN = i
            END IF
        END FOR
        
        // Optimization: elements after newN are sorted
        n = newN
        
    UNTIL swapped = false
    
    RETURN array
END

ALGORITHM CocktailShakerSort(array)
INPUT: array of comparable elements
OUTPUT: sorted array using bidirectional bubble sort
BEGIN
    left = 0
    right = length of array - 1
    
    WHILE left < right DO
        // Forward pass (left to right)
        FOR i = left TO right-1 DO
            IF array[i] > array[i+1] THEN
                SWAP array[i] AND array[i+1]
            END IF
        END FOR
        right = right - 1
        
        // Backward pass (right to left)
        FOR i = right DOWN TO left+1 DO
            IF array[i-1] > array[i] THEN
                SWAP array[i-1] AND array[i]
            END IF
        END FOR
        left = left + 1
    END WHILE
    
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
    sort(arr) {
        const array = [...arr]; // Create copy to avoid mutation
        const n = array.length;
        
        this.resetCounters();
        
        for (let i = 0; i < n - 1; i++) {
            this.passes++;
            let swapped = false;
            
            // Last i elements are already sorted
            for (let j = 0; j < n - i - 1; j++) {
                this.comparisons++;
                if (array[j] > array[j + 1]) {
                    this.swap(array, j, j + 1);
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
    
    // Optimized bubble sort with early termination
    sortOptimized(arr) {
        const array = [...arr];
        let n = array.length;
        
        this.resetCounters();
        
        do {
            this.passes++;
            let swapped = false;
            let newN = 0;
            
            for (let i = 1; i < n; i++) {
                this.comparisons++;
                if (array[i - 1] > array[i]) {
                    this.swap(array, i - 1, i);
                    swapped = true;
                    newN = i;
                }
            }
            
            // Optimization: elements after newN are sorted
            n = newN;
            
            if (!swapped) break;
        } while (n > 1);
        
        return array;
    }
    
    // Cocktail Shaker Sort (bidirectional bubble sort)
    cocktailSort(arr) {
        const array = [...arr];
        let left = 0;
        let right = array.length - 1;
        
        this.resetCounters();
        
        while (left < right) {
            this.passes++;
            let swapped = false;
            
            // Forward pass (left to right)
            for (let i = left; i < right; i++) {
                this.comparisons++;
                if (array[i] > array[i + 1]) {
                    this.swap(array, i, i + 1);
                    swapped = true;
                }
            }
            right--;
            
            if (!swapped) break;
            
            // Backward pass (right to left)
            for (let i = right; i > left; i--) {
                this.comparisons++;
                if (array[i - 1] > array[i]) {
                    this.swap(array, i - 1, i);
                    swapped = true;
                }
            }
            left++;
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
            swapped: null,
            description: 'Initial unsorted array'
        });
        
        for (let i = 0; i < n - 1; i++) {
            this.passes++;
            let swapped = false;
            
            steps.push({
                array: [...array],
                pass: i + 1,
                sortedRegion: Array.from({length: i}, (_, idx) => n - 1 - idx),
                description: \`Pass \${i + 1}: Bubble largest element to position \${n - 1 - i}\`
            });
            
            for (let j = 0; j < n - i - 1; j++) {
                this.comparisons++;
                
                // Show comparison
                steps.push({
                    array: [...array],
                    pass: i + 1,
                    comparing: [j, j + 1],
                    description: \`Comparing \${array[j]} and \${array[j + 1]}\`
                });
                
                if (array[j] > array[j + 1]) {
                    this.swap(array, j, j + 1);
                    swapped = true;
                    
                    // Show swap
                    steps.push({
                        array: [...array],
                        pass: i + 1,
                        swapped: [j, j + 1],
                        description: \`Swapped \${array[j + 1]} and \${array[j]} - bubble up!\`
                    });
                }
            }
            
            steps.push({
                array: [...array],
                pass: i + 1,
                sortedRegion: Array.from({length: i + 1}, (_, idx) => n - 1 - idx),
                description: \`Pass \${i + 1} complete - \${array[n - 1 - i]} is in final position\`
            });
            
            if (!swapped) {
                steps.push({
                    array: [...array],
                    pass: i + 1,
                    description: 'No swaps needed - array is sorted!'
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
    
    // Bubble sort for linked lists
    sortLinkedList(head) {
        if (!head || !head.next) return head;
        
        let swapped;
        do {
            swapped = false;
            let current = head;
            
            while (current.next) {
                if (current.data > current.next.data) {
                    // Swap data
                    [current.data, current.next.data] = [current.next.data, current.data];
                    swapped = true;
                }
                current = current.next;
            }
        } while (swapped);
        
        return head;
    }
    
    // Utility functions
    swap(array, i, j) {
        [array[i], array[j]] = [array[j], array[i]];
        this.swaps++;
    }
    
    resetCounters() {
        this.comparisons = 0;
        this.swaps = 0;
        this.passes = 0;
    }
    
    getStatistics() {
        return {
            comparisons: this.comparisons,
            swaps: this.swaps,
            passes: this.passes
        };
    }
    
    // Performance analysis
    analyzeComplexity(size) {
        const bestCase = size - 1; // Already sorted
        const worstCase = (size * (size - 1)) / 2; // Reverse sorted
        const averageCase = worstCase / 2; // Random data
        
        return {
            bestCase: {
                comparisons: bestCase,
                swaps: 0,
                description: 'Already sorted array with early termination'
            },
            averageCase: {
                comparisons: averageCase,
                swaps: averageCase,
                description: 'Random array distribution'
            },
            worstCase: {
                comparisons: worstCase,
                swaps: worstCase,
                description: 'Reverse sorted array'
            }
        };
    }
    
    // Generate test data
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
    duplicates: [3, 1, 4, 1, 5, 9, 2, 6, 5, 3],
    single: [42],
    empty: []
};

console.log('\\n--- Basic Bubble Sort ---');
Object.entries(testArrays).forEach(([name, arr]) => {
    const sorted = bubbleSort.sort(arr);
    const stats = bubbleSort.getStatistics();
    console.log(\`\${name}: \${arr} → \${sorted}\`);
    console.log(\`  Stats: \${stats.comparisons} comparisons, \${stats.swaps} swaps, \${stats.passes} passes\\n\`);
});

console.log('\\n--- Optimized Bubble Sort ---');
Object.entries(testArrays).forEach(([name, arr]) => {
    const sorted = bubbleSort.sortOptimized(arr);
    const stats = bubbleSort.getStatistics();
    console.log(\`\${name}: \${arr} → \${sorted}\`);
    console.log(\`  Stats: \${stats.comparisons} comparisons, \${stats.swaps} swaps, \${stats.passes} passes\\n\`);
});

console.log('\\n--- Cocktail Shaker Sort ---');
Object.entries(testArrays).forEach(([name, arr]) => {
    if (arr.length > 0) {
        const sorted = bubbleSort.cocktailSort(arr);
        const stats = bubbleSort.getStatistics();
        console.log(\`\${name}: \${arr} → \${sorted}\`);
        console.log(\`  Stats: \${stats.comparisons} comparisons, \${stats.swaps} swaps, \${stats.passes} passes\\n\`);
    }
});

// Demonstrate step-by-step sorting
console.log('\\n--- Step-by-Step Bubble Sort ---');
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
console.log('Worst case:', analysis.worstCase);

// Test data generation
console.log('\\n--- Test Data Generation ---');
console.log('Random data:', BubbleSort.generateTestData(5, 'random'));
console.log('Sorted data:', BubbleSort.generateTestData(5, 'sorted'));
console.log('Reverse data:', BubbleSort.generateTestData(5, 'reverse'));
console.log('Nearly sorted:', BubbleSort.generateTestData(5, 'nearly-sorted'));`,
    syntax: `**Bubble Sort Patterns:**

1. **Basic Bubble Sort:**
   \`\`\`javascript
   function bubbleSort(arr) {
       for (let i = 0; i < arr.length - 1; i++) {
           for (let j = 0; j < arr.length - i - 1; j++) {
               if (arr[j] > arr[j + 1]) {
                   [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
               }
           }
       }
       return arr;
   }
   \`\`\`

2. **Optimized Bubble Sort:**
   \`\`\`javascript
   function bubbleSortOptimized(arr) {
       let n = arr.length, swapped;
       do {
           swapped = false;
           for (let i = 1; i < n; i++) {
               if (arr[i - 1] > arr[i]) {
                   [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
                   swapped = true;
               }
           }
           n--; // Reduce range as largest element is in place
       } while (swapped);
       return arr;
   }
   \`\`\``,
    quizQuestions: [
      {
        question: "What is the best-case time complexity of bubble sort with early termination optimization?",
        options: ["O(1)", "O(n)", "O(n log n)", "O(n²)"],
        correctAnswer: 1,
        explanation: "With early termination optimization, bubble sort can detect when the array is already sorted after just one pass, giving it O(n) best-case time complexity."
      },
      {
        question: "Why is bubble sort called 'bubble' sort?",
        options: ["It creates bubbles in memory", "Large elements 'bubble up' to their correct positions", "It uses a bubble data structure", "It was invented by someone named Bubble"],
        correctAnswer: 1,
        explanation: "Bubble sort gets its name because larger elements 'bubble up' to the end of the array through successive comparisons and swaps, similar to air bubbles rising to the surface of water."
      },
      {
        question: "What is the main advantage of bubble sort over other sorting algorithms?",
        options: ["Fastest performance", "Lowest memory usage", "Simplicity and ease of understanding", "Best for large datasets"],
        correctAnswer: 2,
        explanation: "Bubble sort's main advantage is its simplicity and ease of understanding, making it excellent for educational purposes and teaching fundamental sorting concepts."
      },
      {
        question: "Is bubble sort a stable sorting algorithm?",
        options: ["Yes, it maintains relative order of equal elements", "No, it changes relative order", "Only with specific implementations", "Only for certain data types"],
        correctAnswer: 0,
        explanation: "Bubble sort is stable because it only swaps adjacent elements when the left element is strictly greater than the right element, never when they are equal, thus preserving the relative order of equal elements."
      },
      {
        question: "What optimization can significantly improve bubble sort's performance on nearly sorted data?",
        options: ["Using a different comparison operator", "Early termination when no swaps occur", "Sorting in reverse order", "Using recursion instead of loops"],
        correctAnswer: 1,
        explanation: "Early termination optimization stops the algorithm when no swaps occur in a complete pass, indicating the array is sorted. This can reduce time complexity from O(n²) to O(n) for already sorted arrays."
      }
    ]
"@

# Replace the content
$content = $content -replace [regex]::Escape($bubbleOld), $bubbleNew

# Write back to file
$content | Set-Content $filePath -Encoding UTF8

Write-Host "✅ Successfully completed Bubble Sort with all components!" -ForegroundColor Green
Write-Host "Added: voiceExplanation, realWorldApplications, keyConcepts, pseudocode, implementationCode, quizQuestions" -ForegroundColor Green
