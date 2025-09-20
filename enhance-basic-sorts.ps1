# PowerShell script to enhance basic sorting algorithms (Insertion, Selection)

$filePath = "c:\DSA\DSA-Project\src\data\dsaTopics.ts"
$content = Get-Content $filePath -Raw

Write-Host "Enhancing Insertion Sort and Selection Sort..."

# 1. Enhance Insertion Sort
$insertionOld = @"
  {
    id: 'insertion-sort',
    title: 'Insertion Sort',
    description: 'Build sorted array one element at a time - efficient for small or nearly sorted data',
    category: 'Sorting',
    difficulty: 'beginner',
    timeComplexity: 'O(nÂ²)',
    spaceComplexity: 'O(1)'
  },
"@

$insertionNew = @"
  {
    id: 'insertion-sort',
    title: 'Insertion Sort',
    description: 'Build sorted array one element at a time - efficient for small or nearly sorted data',
    category: 'Sorting',
    difficulty: 'beginner',
    timeComplexity: 'O(nÂ²)',
    spaceComplexity: 'O(1)',
    extendedDefinition: `Insertion Sort is a simple and intuitive sorting algorithm that builds the final sorted array one element at a time. It works by taking elements from the unsorted portion and inserting them into their correct position in the sorted portion, similar to how you might sort playing cards in your hand.

**Algorithm Mechanism:**
The algorithm maintains two regions in the array:
1. **Sorted Region**: Initially contains just the first element
2. **Unsorted Region**: Contains all remaining elements

For each element in the unsorted region, the algorithm:
- Removes the element (the "key")
- Finds the correct position in the sorted region
- Shifts larger elements to make space
- Inserts the key in its correct position

**Key Characteristics:**
- **Adaptive**: Performs better on nearly sorted data (O(n) best case)
- **Stable**: Maintains relative order of equal elements
- **In-Place**: Requires only O(1) additional memory
- **Online**: Can sort data as it arrives

**Performance Analysis:**
- **Best Case**: O(n) when array is already sorted
- **Average Case**: O(n²) for random data
- **Worst Case**: O(n²) when array is reverse sorted
- **Space**: O(1) constant extra space

**Practical Applications:**
- Excellent for small datasets (typically n < 50)
- Efficient for nearly sorted data
- Used as subroutine in hybrid algorithms
- Good for sorting data as it arrives (online algorithm)`,
    voiceExplanation: `Think of insertion sort like organizing a hand of playing cards! Imagine you're dealt cards one by one, and you want to keep your hand sorted at all times. You start with the first card - that's automatically "sorted" since it's alone. When you get the second card, you compare it with the first and either leave it where it is or slide it to the left. For the third card, you start from the right side of your sorted cards and keep sliding the new card left until you find its proper spot. You continue this process - each new card gets inserted into exactly the right position among the cards you've already sorted. The beautiful thing is that one side of your hand is always perfectly sorted, and you're just growing that sorted region one card at a time. It's like having a neat freak organize cards - they can't stand having anything out of place, so they immediately put each new card exactly where it belongs!`,
    realWorldApplications: `**Industry Applications:**
- **Small Dataset Sorting**: Efficient for arrays with fewer than 50 elements
- **Hybrid Algorithms**: Used in Timsort (Python) and Introsort (C++) for small subarrays
- **Online Algorithms**: Sorting data streams as elements arrive
- **Database Systems**: Sorting small result sets, index maintenance
- **Embedded Systems**: Memory-constrained environments requiring simple algorithms
- **Game Development**: Sorting small lists like inventory items or high scores
- **Educational Software**: Teaching fundamental sorting concepts
- **Real-time Systems**: Predictable performance for small, nearly sorted datasets
- **Mobile Applications**: Sorting contact lists, message threads
- **IoT Devices**: Lightweight sorting for sensor data with limited memory`,
    keyConcepts: `**Essential Concepts:**
1. **Key Element**: The current element being inserted into sorted portion
2. **Sorted Region**: Left portion of array that's already in order
3. **Unsorted Region**: Right portion containing elements yet to be processed
4. **Shifting Operation**: Moving elements right to make space for insertion
5. **Adaptive Behavior**: Performance improves significantly on nearly sorted data
6. **Stable Sorting**: Equal elements maintain their relative order
7. **In-Place Algorithm**: Sorts without requiring additional array space
8. **Online Property**: Can process elements as they become available`,
    pseudocode: `**Insertion Sort Pseudocode:**

ALGORITHM InsertionSort(array)
INPUT: array of comparable elements
OUTPUT: sorted array in ascending order
BEGIN
    n = length of array
    
    FOR i = 1 TO n-1 DO
        key = array[i]
        j = i - 1
        
        // Move elements greater than key one position ahead
        WHILE j >= 0 AND array[j] > key DO
            array[j + 1] = array[j]
            j = j - 1
        END WHILE
        
        // Insert key at correct position
        array[j + 1] = key
    END FOR
    
    RETURN array
END

ALGORITHM InsertionSortOptimized(array)
INPUT: array of comparable elements
OUTPUT: sorted array with early termination
BEGIN
    n = length of array
    
    FOR i = 1 TO n-1 DO
        key = array[i]
        
        // Early termination if key is already in correct position
        IF key >= array[i-1] THEN
            CONTINUE
        END IF
        
        j = i - 1
        WHILE j >= 0 AND array[j] > key DO
            array[j + 1] = array[j]
            j = j - 1
        END WHILE
        
        array[j + 1] = key
    END FOR
    
    RETURN array
END

ALGORITHM BinaryInsertionSort(array)
INPUT: array of comparable elements
OUTPUT: sorted array using binary search for position
BEGIN
    n = length of array
    
    FOR i = 1 TO n-1 DO
        key = array[i]
        
        // Find insertion position using binary search
        left = 0
        right = i
        
        WHILE left < right DO
            mid = (left + right) / 2
            IF array[mid] > key THEN
                right = mid
            ELSE
                left = mid + 1
            END IF
        END WHILE
        
        // Shift elements and insert
        FOR j = i DOWN TO left + 1 DO
            array[j] = array[j - 1]
        END FOR
        
        array[left] = key
    END FOR
    
    RETURN array
END`,
    implementationCode: `// Comprehensive Insertion Sort Implementation

class InsertionSort {
    constructor() {
        this.comparisons = 0;
        this.shifts = 0;
        this.passes = 0;
    }
    
    // Basic insertion sort
    sort(arr) {
        const array = [...arr]; // Create copy to avoid mutation
        const n = array.length;
        
        this.resetCounters();
        
        for (let i = 1; i < n; i++) {
            const key = array[i];
            let j = i - 1;
            this.passes++;
            
            // Move elements greater than key one position ahead
            while (j >= 0) {
                this.comparisons++;
                if (array[j] > key) {
                    array[j + 1] = array[j];
                    this.shifts++;
                    j--;
                } else {
                    break;
                }
            }
            
            // Insert key at correct position
            array[j + 1] = key;
        }
        
        return array;
    }
    
    // Optimized insertion sort with early termination
    sortOptimized(arr) {
        const array = [...arr];
        const n = array.length;
        
        this.resetCounters();
        
        for (let i = 1; i < n; i++) {
            const key = array[i];
            this.passes++;
            
            // Early termination if already in correct position
            this.comparisons++;
            if (key >= array[i - 1]) {
                continue;
            }
            
            let j = i - 1;
            while (j >= 0) {
                this.comparisons++;
                if (array[j] > key) {
                    array[j + 1] = array[j];
                    this.shifts++;
                    j--;
                } else {
                    break;
                }
            }
            
            array[j + 1] = key;
        }
        
        return array;
    }
    
    // Binary insertion sort (reduces comparisons)
    binaryInsertionSort(arr) {
        const array = [...arr];
        const n = array.length;
        
        this.resetCounters();
        
        for (let i = 1; i < n; i++) {
            const key = array[i];
            this.passes++;
            
            // Find insertion position using binary search
            let left = 0;
            let right = i;
            
            while (left < right) {
                this.comparisons++;
                const mid = Math.floor((left + right) / 2);
                if (array[mid] > key) {
                    right = mid;
                } else {
                    left = mid + 1;
                }
            }
            
            // Shift elements and insert
            for (let j = i; j > left; j--) {
                array[j] = array[j - 1];
                this.shifts++;
            }
            
            array[left] = key;
        }
        
        return array;
    }
    
    // Insertion sort with step-by-step visualization
    sortWithSteps(arr) {
        const array = [...arr];
        const steps = [];
        const n = array.length;
        
        this.resetCounters();
        
        // Initial state
        steps.push({
            array: [...array],
            pass: 0,
            key: null,
            sortedRegion: [0],
            description: 'Initial array - first element is considered sorted'
        });
        
        for (let i = 1; i < n; i++) {
            const key = array[i];
            let j = i - 1;
            this.passes++;
            
            // Show key selection
            steps.push({
                array: [...array],
                pass: i,
                key: key,
                keyIndex: i,
                sortedRegion: Array.from({length: i}, (_, idx) => idx),
                description: \`Pass \${i}: Select key = \${key} at index \${i}\`
            });
            
            // Show shifting process
            while (j >= 0) {
                this.comparisons++;
                if (array[j] > key) {
                    array[j + 1] = array[j];
                    this.shifts++;
                    
                    steps.push({
                        array: [...array],
                        pass: i,
                        key: key,
                        comparing: j,
                        shifting: true,
                        description: \`Shift \${array[j + 1]} right (was at index \${j})\`
                    });
                    
                    j--;
                } else {
                    break;
                }
            }
            
            // Insert key
            array[j + 1] = key;
            
            steps.push({
                array: [...array],
                pass: i,
                key: key,
                insertPosition: j + 1,
                sortedRegion: Array.from({length: i + 1}, (_, idx) => idx),
                description: \`Insert key \${key} at position \${j + 1}\`
            });
        }
        
        return {
            sortedArray: array,
            steps: steps,
            statistics: this.getStatistics()
        };
    }
    
    // Insertion sort for linked lists
    sortLinkedList(head) {
        if (!head || !head.next) return head;
        
        let sorted = null;
        let current = head;
        
        while (current) {
            const next = current.next;
            sorted = this.insertIntoSorted(sorted, current);
            current = next;
        }
        
        return sorted;
    }
    
    insertIntoSorted(sorted, newNode) {
        if (!sorted || newNode.data < sorted.data) {
            newNode.next = sorted;
            return newNode;
        }
        
        let current = sorted;
        while (current.next && current.next.data < newNode.data) {
            current = current.next;
        }
        
        newNode.next = current.next;
        current.next = newNode;
        return sorted;
    }
    
    // Utility functions
    resetCounters() {
        this.comparisons = 0;
        this.shifts = 0;
        this.passes = 0;
    }
    
    getStatistics() {
        return {
            comparisons: this.comparisons,
            shifts: this.shifts,
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
                shifts: 0,
                description: 'Already sorted array'
            },
            averageCase: {
                comparisons: averageCase,
                shifts: averageCase,
                description: 'Random array'
            },
            worstCase: {
                comparisons: worstCase,
                shifts: worstCase,
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
console.log('=== Insertion Sort Examples ===');

const insertionSort = new InsertionSort();

// Test with different data types
const testArrays = {
    small: [64, 34, 25, 12, 22, 11, 90],
    sorted: [1, 2, 3, 4, 5],
    reverse: [5, 4, 3, 2, 1],
    duplicates: [3, 1, 4, 1, 5, 9, 2, 6, 5, 3],
    nearlySorted: [1, 2, 4, 3, 5, 6, 8, 7, 9]
};

console.log('\\n--- Basic Insertion Sort ---');
Object.entries(testArrays).forEach(([name, arr]) => {
    const sorted = insertionSort.sort(arr);
    const stats = insertionSort.getStatistics();
    console.log(\`\${name}: \${arr} → \${sorted}\`);
    console.log(\`  Stats: \${stats.comparisons} comparisons, \${stats.shifts} shifts, \${stats.passes} passes\\n\`);
});

console.log('\\n--- Optimized Insertion Sort ---');
Object.entries(testArrays).forEach(([name, arr]) => {
    const sorted = insertionSort.sortOptimized(arr);
    const stats = insertionSort.getStatistics();
    console.log(\`\${name}: \${arr} → \${sorted}\`);
    console.log(\`  Stats: \${stats.comparisons} comparisons, \${stats.shifts} shifts, \${stats.passes} passes\\n\`);
});

// Demonstrate step-by-step sorting
console.log('\\n--- Step-by-Step Insertion Sort ---');
const stepResult = insertionSort.sortWithSteps([3, 1, 4, 1, 5]);
console.log('Final result:', stepResult.sortedArray);
console.log('Total steps:', stepResult.steps.length);
console.log('Statistics:', stepResult.statistics);

// Performance analysis
console.log('\\n--- Complexity Analysis ---');
const analysis = insertionSort.analyzeComplexity(10);
console.log('For array of size 10:');
console.log('Best case:', analysis.bestCase);
console.log('Average case:', analysis.averageCase);
console.log('Worst case:', analysis.worstCase);`,
    quizQuestions: [
      {
        question: "What is the best-case time complexity of insertion sort?",
        options: ["O(1)", "O(n)", "O(n log n)", "O(n²)"],
        correctAnswer: 1,
        explanation: "Insertion sort has O(n) best-case time complexity when the array is already sorted, as it only needs to make one comparison per element without any shifts."
      },
      {
        question: "What makes insertion sort particularly efficient for small datasets?",
        options: ["Low constant factors and simple operations", "It uses advanced data structures", "It has better asymptotic complexity", "It requires less memory"],
        correctAnswer: 0,
        explanation: "Insertion sort has very low constant factors and performs simple operations (comparisons and shifts), making it efficient for small datasets despite its O(n²) complexity."
      },
      {
        question: "Is insertion sort a stable sorting algorithm?",
        options: ["Yes, it maintains relative order of equal elements", "No, it changes relative order", "Only for certain data types", "Only when implemented recursively"],
        correctAnswer: 0,
        explanation: "Insertion sort is stable because it only moves elements when they are strictly greater than the key, never when they are equal, preserving the relative order of equal elements."
      },
      {
        question: "What is the key characteristic that makes insertion sort 'adaptive'?",
        options: ["It uses different algorithms for different inputs", "It performs better on nearly sorted data", "It adapts its memory usage", "It changes its comparison function"],
        correctAnswer: 1,
        explanation: "Insertion sort is adaptive because it performs significantly better on nearly sorted data, requiring fewer comparisons and shifts when elements are already close to their correct positions."
      },
      {
        question: "In which scenario would insertion sort be preferred over more advanced algorithms?",
        options: ["Large datasets", "Small datasets or nearly sorted data", "Parallel processing", "External sorting"],
        correctAnswer: 1,
        explanation: "Insertion sort is preferred for small datasets (typically < 50 elements) or nearly sorted data due to its simplicity, low overhead, and adaptive behavior that approaches O(n) performance."
      }
    ]
  },
"@

# Replace Insertion Sort content
$content = $content -replace [regex]::Escape($insertionOld), $insertionNew

Write-Host "Enhanced Insertion Sort!"

# Write back to file
$content | Set-Content $filePath -Encoding UTF8

Write-Host "Successfully enhanced Insertion Sort with all components!"
