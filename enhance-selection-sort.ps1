# PowerShell script to enhance Selection Sort

$filePath = "c:\DSA\DSA-Project\src\data\dsaTopics.ts"
$content = Get-Content $filePath -Raw

Write-Host "Enhancing Selection Sort..."

# Enhance Selection Sort
$selectionOld = @"
  {
    id: 'selection-sort',
    title: 'Selection Sort',
    description: 'Find minimum element and swap to correct position - minimizes number of swaps',
    category: 'Sorting',
    difficulty: 'beginner',
    timeComplexity: 'O(nÂ²)',
    spaceComplexity: 'O(1)'
  },
"@

$selectionNew = @"
  {
    id: 'selection-sort',
    title: 'Selection Sort',
    description: 'Find minimum element and swap to correct position - minimizes number of swaps',
    category: 'Sorting',
    difficulty: 'beginner',
    timeComplexity: 'O(nÂ²)',
    spaceComplexity: 'O(1)',
    extendedDefinition: `Selection Sort is a simple comparison-based sorting algorithm that works by repeatedly finding the minimum element from the unsorted portion and placing it at the beginning. It's called "selection" sort because it repeatedly selects the smallest remaining element.

**Algorithm Mechanism:**
The algorithm divides the array into two regions:
1. **Sorted Region**: Left portion containing elements in final sorted order
2. **Unsorted Region**: Right portion containing elements yet to be processed

For each position in the array:
- Find the minimum element in the unsorted region
- Swap it with the first element of the unsorted region
- Expand the sorted region by one element

**Key Characteristics:**
- **Minimizes Swaps**: Makes exactly n-1 swaps for n elements
- **Not Stable**: Can change relative order of equal elements
- **In-Place**: Requires only O(1) additional memory
- **Not Adaptive**: Performance doesn't improve for sorted data

**Performance Analysis:**
- **Best Case**: O(n²) - same as worst case, no optimization for sorted data
- **Average Case**: O(n²) - consistent performance regardless of input
- **Worst Case**: O(n²) - always makes the same number of comparisons
- **Space**: O(1) constant extra space

**Comparison with Other Sorts:**
- Fewer swaps than bubble sort (exactly n-1 vs up to n²/2)
- More comparisons than insertion sort on nearly sorted data
- Simpler implementation than heap sort
- Not adaptive like insertion sort`,
    voiceExplanation: `Think of selection sort like organizing a bookshelf where you can only move one book at a time to its final position! Imagine you have a messy shelf of books and you want to arrange them by height from shortest to tallest. Selection sort says: "Let me find the shortest book in the entire collection and put it in the first position." So you scan through all the books, find the shortest one, and swap it with whatever book is currently in the first spot. Now you have one book in its final correct position! Next, you look at all the remaining books, find the shortest among them, and put it in the second position. You keep doing this - always finding the minimum from what's left and putting it in the next available spot. It's like having a very methodical librarian who always picks the next smallest book and places it exactly where it belongs. The cool thing is that you're guaranteed to make exactly one swap per position, so you never do more swapping than necessary!`,
    realWorldApplications: `**Industry Applications:**
- **Memory-Constrained Systems**: Embedded systems where minimizing swaps is crucial
- **Database Systems**: Selecting top-k smallest elements without full sorting
- **Educational Software**: Teaching sorting concepts due to algorithm simplicity
- **Hardware Implementations**: Simple logic for hardware-based sorting
- **Small Dataset Processing**: Efficient for very small arrays (n < 20)
- **Swap-Expensive Operations**: When moving elements is costly (large objects)
- **Real-time Systems**: Predictable performance characteristics
- **Microcontroller Programming**: Simple algorithm for resource-limited devices
- **Game Development**: Sorting small lists where simplicity matters
- **IoT Applications**: Lightweight sorting for sensor data processing`,
    keyConcepts: `**Essential Concepts:**
1. **Minimum Selection**: Core operation of finding smallest element in unsorted region
2. **Sorted Boundary**: Clear division between sorted and unsorted portions
3. **Swap Minimization**: Exactly n-1 swaps for n elements, optimal swap count
4. **Invariant Maintenance**: Sorted region always contains smallest elements in order
5. **Linear Search**: Finding minimum requires scanning entire unsorted region
6. **Position-Based**: Each iteration fills a specific position with correct element
7. **Non-Adaptive**: Performance remains constant regardless of input distribution
8. **Unstable Sorting**: Equal elements may change relative order during swaps`,
    pseudocode: `**Selection Sort Pseudocode:**

ALGORITHM SelectionSort(array)
INPUT: array of comparable elements
OUTPUT: sorted array in ascending order
BEGIN
    n = length of array
    
    FOR i = 0 TO n-2 DO
        minIndex = i
        
        // Find minimum element in unsorted region
        FOR j = i+1 TO n-1 DO
            IF array[j] < array[minIndex] THEN
                minIndex = j
            END IF
        END FOR
        
        // Swap minimum element with first unsorted element
        IF minIndex ≠ i THEN
            SWAP array[i] AND array[minIndex]
        END IF
    END FOR
    
    RETURN array
END

ALGORITHM SelectionSortWithEarlyTermination(array)
INPUT: array of comparable elements
OUTPUT: sorted array with optimization
BEGIN
    n = length of array
    
    FOR i = 0 TO n-2 DO
        minIndex = i
        minValue = array[i]
        
        // Find minimum element and its index
        FOR j = i+1 TO n-1 DO
            IF array[j] < minValue THEN
                minIndex = j
                minValue = array[j]
            END IF
        END FOR
        
        // Only swap if minimum is not already in correct position
        IF minIndex ≠ i THEN
            array[minIndex] = array[i]
            array[i] = minValue
        END IF
    END FOR
    
    RETURN array
END

ALGORITHM DoubleSelectionSort(array)
INPUT: array of comparable elements
OUTPUT: sorted array using bidirectional selection
BEGIN
    n = length of array
    left = 0
    right = n - 1
    
    WHILE left < right DO
        minIndex = left
        maxIndex = left
        
        // Find both minimum and maximum in current range
        FOR i = left TO right DO
            IF array[i] < array[minIndex] THEN
                minIndex = i
            END IF
            IF array[i] > array[maxIndex] THEN
                maxIndex = i
            END IF
        END FOR
        
        // Handle special case where min and max are the same
        IF minIndex = maxIndex THEN
            BREAK
        END IF
        
        // Place minimum at left position
        SWAP array[left] AND array[minIndex]
        
        // Adjust maxIndex if it was pointing to left position
        IF maxIndex = left THEN
            maxIndex = minIndex
        END IF
        
        // Place maximum at right position
        SWAP array[right] AND array[maxIndex]
        
        left = left + 1
        right = right - 1
    END WHILE
    
    RETURN array
END`,
    implementationCode: `// Comprehensive Selection Sort Implementation

class SelectionSort {
    constructor() {
        this.comparisons = 0;
        this.swaps = 0;
        this.passes = 0;
    }
    
    // Basic selection sort
    sort(arr) {
        const array = [...arr]; // Create copy to avoid mutation
        const n = array.length;
        
        this.resetCounters();
        
        for (let i = 0; i < n - 1; i++) {
            let minIndex = i;
            this.passes++;
            
            // Find minimum element in unsorted region
            for (let j = i + 1; j < n; j++) {
                this.comparisons++;
                if (array[j] < array[minIndex]) {
                    minIndex = j;
                }
            }
            
            // Swap minimum element with first unsorted element
            if (minIndex !== i) {
                this.swap(array, i, minIndex);
            }
        }
        
        return array;
    }
    
    // Optimized selection sort with early termination
    sortOptimized(arr) {
        const array = [...arr];
        const n = array.length;
        
        this.resetCounters();
        
        for (let i = 0; i < n - 1; i++) {
            let minIndex = i;
            let minValue = array[i];
            this.passes++;
            
            // Find minimum element and track its value
            for (let j = i + 1; j < n; j++) {
                this.comparisons++;
                if (array[j] < minValue) {
                    minIndex = j;
                    minValue = array[j];
                }
            }
            
            // Only swap if minimum is not already in correct position
            if (minIndex !== i) {
                array[minIndex] = array[i];
                array[i] = minValue;
                this.swaps++;
            }
        }
        
        return array;
    }
    
    // Double selection sort (finds min and max in each pass)
    doubleSelectionSort(arr) {
        const array = [...arr];
        let left = 0;
        let right = array.length - 1;
        
        this.resetCounters();
        
        while (left < right) {
            let minIndex = left;
            let maxIndex = left;
            this.passes++;
            
            // Find both minimum and maximum in current range
            for (let i = left; i <= right; i++) {
                this.comparisons += 2; // Two comparisons per iteration
                if (array[i] < array[minIndex]) {
                    minIndex = i;
                }
                if (array[i] > array[maxIndex]) {
                    maxIndex = i;
                }
            }
            
            // Handle special case where min and max are the same
            if (minIndex === maxIndex) {
                break;
            }
            
            // Place minimum at left position
            if (minIndex !== left) {
                this.swap(array, left, minIndex);
            }
            
            // Adjust maxIndex if it was pointing to left position
            if (maxIndex === left) {
                maxIndex = minIndex;
            }
            
            // Place maximum at right position
            if (maxIndex !== right) {
                this.swap(array, right, maxIndex);
            }
            
            left++;
            right--;
        }
        
        return array;
    }
    
    // Selection sort with step-by-step visualization
    sortWithSteps(arr) {
        const array = [...arr];
        const steps = [];
        const n = array.length;
        
        this.resetCounters();
        
        // Initial state
        steps.push({
            array: [...array],
            pass: 0,
            sortedRegion: [],
            description: 'Initial unsorted array'
        });
        
        for (let i = 0; i < n - 1; i++) {
            let minIndex = i;
            this.passes++;
            
            // Show current pass start
            steps.push({
                array: [...array],
                pass: i + 1,
                currentPosition: i,
                sortedRegion: Array.from({length: i}, (_, idx) => idx),
                description: \`Pass \${i + 1}: Find minimum in positions \${i} to \${n - 1}\`
            });
            
            // Find minimum element in unsorted region
            for (let j = i + 1; j < n; j++) {
                this.comparisons++;
                
                steps.push({
                    array: [...array],
                    pass: i + 1,
                    currentPosition: i,
                    comparing: j,
                    currentMin: minIndex,
                    description: \`Comparing \${array[j]} with current minimum \${array[minIndex]}\`
                });
                
                if (array[j] < array[minIndex]) {
                    minIndex = j;
                    
                    steps.push({
                        array: [...array],
                        pass: i + 1,
                        currentPosition: i,
                        newMin: minIndex,
                        description: \`New minimum found: \${array[minIndex]} at index \${minIndex}\`
                    });
                }
            }
            
            // Swap minimum element with first unsorted element
            if (minIndex !== i) {
                const temp = array[i];
                this.swap(array, i, minIndex);
                
                steps.push({
                    array: [...array],
                    pass: i + 1,
                    swapped: [i, minIndex],
                    sortedRegion: Array.from({length: i + 1}, (_, idx) => idx),
                    description: \`Swap \${array[i]} with \${temp} - position \${i} now sorted\`
                });
            } else {
                steps.push({
                    array: [...array],
                    pass: i + 1,
                    sortedRegion: Array.from({length: i + 1}, (_, idx) => idx),
                    description: \`Minimum \${array[i]} already in correct position \${i}\`
                });
            }
        }
        
        steps.push({
            array: [...array],
            pass: n,
            sortedRegion: Array.from({length: n}, (_, idx) => idx),
            description: 'Array completely sorted!'
        });
        
        return {
            sortedArray: array,
            steps: steps,
            statistics: this.getStatistics()
        };
    }
    
    // Find kth smallest element using selection algorithm
    findKthSmallest(arr, k) {
        if (k < 1 || k > arr.length) {
            throw new Error('k must be between 1 and array length');
        }
        
        const array = [...arr];
        
        // Perform k-1 selection passes
        for (let i = 0; i < k - 1; i++) {
            let minIndex = i;
            
            for (let j = i + 1; j < array.length; j++) {
                if (array[j] < array[minIndex]) {
                    minIndex = j;
                }
            }
            
            if (minIndex !== i) {
                this.swap(array, i, minIndex);
            }
        }
        
        return array[k - 1];
    }
    
    // Selection sort for specific range
    sortRange(arr, start, end) {
        const array = [...arr];
        
        for (let i = start; i < end; i++) {
            let minIndex = i;
            
            for (let j = i + 1; j <= end; j++) {
                if (array[j] < array[minIndex]) {
                    minIndex = j;
                }
            }
            
            if (minIndex !== i) {
                this.swap(array, i, minIndex);
            }
        }
        
        return array;
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
        const comparisons = (size * (size - 1)) / 2;
        const swaps = size - 1; // Maximum swaps
        
        return {
            allCases: {
                comparisons: comparisons,
                swaps: swaps,
                description: 'Selection sort has same complexity in all cases'
            },
            swapOptimal: {
                description: 'Minimizes swaps - exactly n-1 swaps for n elements'
            }
        };
    }
}

// Usage Examples and Testing
console.log('=== Selection Sort Examples ===');

const selectionSort = new SelectionSort();

// Test with different data types
const testArrays = {
    small: [64, 34, 25, 12, 22, 11, 90],
    sorted: [1, 2, 3, 4, 5],
    reverse: [5, 4, 3, 2, 1],
    duplicates: [3, 1, 4, 1, 5, 9, 2, 6, 5, 3],
    single: [42],
    empty: []
};

console.log('\\n--- Basic Selection Sort ---');
Object.entries(testArrays).forEach(([name, arr]) => {
    const sorted = selectionSort.sort(arr);
    const stats = selectionSort.getStatistics();
    console.log(\`\${name}: \${arr} → \${sorted}\`);
    console.log(\`  Stats: \${stats.comparisons} comparisons, \${stats.swaps} swaps, \${stats.passes} passes\\n\`);
});

console.log('\\n--- Double Selection Sort ---');
Object.entries(testArrays).forEach(([name, arr]) => {
    if (arr.length > 0) {
        const sorted = selectionSort.doubleSelectionSort(arr);
        const stats = selectionSort.getStatistics();
        console.log(\`\${name}: \${arr} → \${sorted}\`);
        console.log(\`  Stats: \${stats.comparisons} comparisons, \${stats.swaps} swaps, \${stats.passes} passes\\n\`);
    }
});

// Demonstrate step-by-step sorting
console.log('\\n--- Step-by-Step Selection Sort ---');
const stepResult = selectionSort.sortWithSteps([3, 1, 4, 1, 5]);
console.log('Final result:', stepResult.sortedArray);
console.log('Total steps:', stepResult.steps.length);
console.log('Statistics:', stepResult.statistics);

// Find kth smallest element
console.log('\\n--- Find Kth Smallest ---');
const testArray = [64, 34, 25, 12, 22, 11, 90];
for (let k = 1; k <= 3; k++) {
    const kthSmallest = selectionSort.findKthSmallest(testArray, k);
    console.log(\`\${k}th smallest element: \${kthSmallest}\`);
}

// Performance analysis
console.log('\\n--- Complexity Analysis ---');
const analysis = selectionSort.analyzeComplexity(10);
console.log('For array of size 10:');
console.log('All cases:', analysis.allCases);
console.log('Swap optimization:', analysis.swapOptimal);`,
    quizQuestions: [
      {
        question: "What is the time complexity of selection sort in all cases?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(1)"],
        correctAnswer: 2,
        explanation: "Selection sort has O(n²) time complexity in best, average, and worst cases because it always makes the same number of comparisons regardless of input distribution."
      },
      {
        question: "What is the maximum number of swaps selection sort will make for an array of n elements?",
        options: ["n", "n-1", "n²", "n(n-1)/2"],
        correctAnswer: 1,
        explanation: "Selection sort makes exactly n-1 swaps for n elements, as it places one element in its correct position per pass, and the last element is automatically in place."
      },
      {
        question: "Is selection sort a stable sorting algorithm?",
        options: ["Yes, it maintains relative order", "No, it can change relative order", "Only for certain data types", "Only with modifications"],
        correctAnswer: 1,
        explanation: "Selection sort is not stable because when swapping the minimum element with the first unsorted element, it can move equal elements past each other, changing their relative order."
      },
      {
        question: "What is the main advantage of selection sort over bubble sort?",
        options: ["Better time complexity", "Fewer swaps", "Stable sorting", "Adaptive behavior"],
        correctAnswer: 1,
        explanation: "Selection sort makes exactly n-1 swaps compared to bubble sort's potentially O(n²) swaps, making it more efficient when swapping is expensive."
      },
      {
        question: "Why is selection sort not adaptive?",
        options: ["It uses recursion", "It always makes the same number of comparisons", "It requires extra memory", "It's not in-place"],
        correctAnswer: 1,
        explanation: "Selection sort is not adaptive because it always scans the entire unsorted region to find the minimum, making the same number of comparisons regardless of whether the data is already sorted."
      }
    ]
  },
"@

# Replace Selection Sort content
$content = $content -replace [regex]::Escape($selectionOld), $selectionNew

Write-Host "Enhanced Selection Sort!"

# Write back to file
$content | Set-Content $filePath -Encoding UTF8

Write-Host "Successfully enhanced Selection Sort with all components!"
