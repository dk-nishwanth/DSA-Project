# PowerShell script to enhance all remaining sorting algorithms

$filePath = "c:\DSA\DSA-Project\src\data\dsaTopics.ts"
$content = Get-Content $filePath -Raw

Write-Host "Starting comprehensive enhancement of remaining sorting algorithms..."

# 1. Enhance Heap Sort (missing all components)
$heapOld = @"
    id: 'heap-sort',
    title: 'Heap Sort',
    description: 'Comparison-based sorting using binary heap data structure',
    category: 'Sorting',
    difficulty: 'intermediate',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)',
    extendedDefinition: `Heap Sort is an efficient comparison-based sorting algorithm that uses the binary heap data structure. It combines the best features of merge sort (guaranteed O(n log n) performance) and insertion sort (in-place sorting), making it a reliable choice for systems where consistent performance is crucial.

**Algorithm Overview:**
Heap Sort works in two main phases:
1. **Build Max Heap**: Transform the input array into a max heap structure
"@

$heapNew = @"
    id: 'heap-sort',
    title: 'Heap Sort',
    description: 'Comparison-based sorting using binary heap data structure',
    category: 'Sorting',
    difficulty: 'intermediate',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)',
    extendedDefinition: `Heap Sort is an efficient comparison-based sorting algorithm that uses the binary heap data structure. It combines the best features of merge sort (guaranteed O(n log n) performance) and insertion sort (in-place sorting), making it a reliable choice for systems where consistent performance is crucial.

**Algorithm Overview:**
Heap Sort works in two main phases:
1. **Build Max Heap**: Transform the input array into a max heap structure
2. **Extract Maximum**: Repeatedly extract the maximum element and place it at the end

**Key Properties:**
- **Guaranteed Performance**: Always O(n log n), regardless of input distribution
- **In-Place**: Requires only O(1) additional memory space
- **Unstable**: Does not preserve relative order of equal elements
- **Not Adaptive**: Performance doesn't improve for partially sorted data

**Heap Properties:**
- **Complete Binary Tree**: All levels filled except possibly the last
- **Max Heap Property**: Parent nodes are greater than or equal to children
- **Array Representation**: Parent at index i, children at 2i+1 and 2i+2

**Performance Characteristics:**
- **Best Case**: O(n log n) - same as average and worst case
- **Average Case**: O(n log n) - consistent performance
- **Worst Case**: O(n log n) - no degradation like Quick Sort
- **Space**: O(1) - truly in-place sorting algorithm`,
    voiceExplanation: `Think of heap sort like organizing a tournament bracket, but in reverse! Imagine you have a bunch of players and you want to rank them from strongest to weakest. First, you organize them into a tournament tree where every parent is stronger than their children - this is like building a max heap. The strongest player naturally rises to the top. Now, instead of continuing the tournament, you take the winner (the strongest) and put them in the "hall of fame" at the end of your list. Then you take the last player in the tournament, put them at the top, and let them "sink down" to their proper level by comparing with their opponents. You repeat this process - always taking the current strongest player and putting them in their final ranking position. It's like having a self-organizing tournament that always knows who the current champion is, and systematically places everyone in their final ranking order. The beautiful thing is that this process is guaranteed to take the same amount of time regardless of how the players were initially arranged!`,
    realWorldApplications: `**Industry Applications:**
- **Operating Systems**: Process scheduling, memory management, priority queues
- **Database Systems**: Query optimization, index maintenance, buffer management
- **Embedded Systems**: Real-time systems where consistent performance is crucial
- **Graphics Processing**: Z-buffer algorithms, priority-based rendering
- **Network Systems**: Quality of Service (QoS) management, packet scheduling
- **Scientific Computing**: Numerical analysis where stability is important
- **Game Development**: AI decision trees, pathfinding algorithms
- **Financial Systems**: Risk management where worst-case guarantees matter
- **Compiler Design**: Register allocation, instruction scheduling
- **Data Analysis**: Statistical computations requiring consistent performance`,
    keyConcepts: `**Essential Concepts:**
1. **Binary Heap Structure**: Complete binary tree with heap property
2. **Heapify Operation**: Maintaining heap property after modifications
3. **Build Heap**: Converting arbitrary array into heap structure
4. **Extract Maximum**: Removing root and maintaining heap property
5. **In-Place Sorting**: Using the array itself as both heap and sorted region
6. **Heap Property**: Parent-child relationship in max/min heaps
7. **Complete Binary Tree**: Efficient array representation of tree structure
8. **Guaranteed Performance**: O(n log n) in all cases without degradation`,
    pseudocode: `**Heap Sort Pseudocode:**

ALGORITHM HeapSort(array)
INPUT: array of comparable elements
OUTPUT: sorted array in ascending order
BEGIN
    n = length of array
    
    // Build max heap from array
    FOR i = n/2 - 1 DOWN TO 0 DO
        Heapify(array, n, i)
    END FOR
    
    // Extract elements from heap one by one
    FOR i = n - 1 DOWN TO 1 DO
        // Move current root to end (largest element)
        SWAP array[0] AND array[i]
        
        // Restore heap property for reduced heap
        Heapify(array, i, 0)
    END FOR
    
    RETURN array
END

ALGORITHM Heapify(array, heapSize, rootIndex)
INPUT: array, size of heap, root index to heapify
OUTPUT: array with heap property restored
BEGIN
    largest = rootIndex
    leftChild = 2 * rootIndex + 1
    rightChild = 2 * rootIndex + 2
    
    // Check if left child exists and is greater than root
    IF leftChild < heapSize AND array[leftChild] > array[largest] THEN
        largest = leftChild
    END IF
    
    // Check if right child exists and is greater than current largest
    IF rightChild < heapSize AND array[rightChild] > array[largest] THEN
        largest = rightChild
    END IF
    
    // If largest is not root, swap and continue heapifying
    IF largest ≠ rootIndex THEN
        SWAP array[rootIndex] AND array[largest]
        Heapify(array, heapSize, largest)
    END IF
END

ALGORITHM BuildMaxHeap(array)
INPUT: array to convert to max heap
OUTPUT: array arranged as max heap
BEGIN
    n = length of array
    
    // Start from last non-leaf node and heapify each node
    FOR i = n/2 - 1 DOWN TO 0 DO
        Heapify(array, n, i)
    END FOR
END`,
    implementationCode: `// Comprehensive Heap Sort Implementation

class HeapSort {
    constructor() {
        this.comparisons = 0;
        this.swaps = 0;
    }
    
    // Main heap sort function
    sort(arr) {
        const array = [...arr]; // Create copy to avoid mutation
        const n = array.length;
        
        this.resetCounters();
        
        // Build max heap
        this.buildMaxHeap(array);
        
        // Extract elements from heap one by one
        for (let i = n - 1; i > 0; i--) {
            // Move current root to end
            this.swap(array, 0, i);
            
            // Restore heap property for reduced heap
            this.heapify(array, i, 0);
        }
        
        return array;
    }
    
    // Build max heap from array
    buildMaxHeap(array) {
        const n = array.length;
        
        // Start from last non-leaf node and heapify each node
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            this.heapify(array, n, i);
        }
    }
    
    // Heapify a subtree rooted at index i
    heapify(array, heapSize, rootIndex) {
        let largest = rootIndex;
        const leftChild = 2 * rootIndex + 1;
        const rightChild = 2 * rootIndex + 2;
        
        // Check if left child exists and is greater than root
        if (leftChild < heapSize) {
            this.comparisons++;
            if (array[leftChild] > array[largest]) {
                largest = leftChild;
            }
        }
        
        // Check if right child exists and is greater than current largest
        if (rightChild < heapSize) {
            this.comparisons++;
            if (array[rightChild] > array[largest]) {
                largest = rightChild;
            }
        }
        
        // If largest is not root, swap and continue heapifying
        if (largest !== rootIndex) {
            this.swap(array, rootIndex, largest);
            this.heapify(array, heapSize, largest);
        }
    }
    
    // Iterative heapify (avoids recursion stack)
    heapifyIterative(array, heapSize, startIndex) {
        let rootIndex = startIndex;
        
        while (true) {
            let largest = rootIndex;
            const leftChild = 2 * rootIndex + 1;
            const rightChild = 2 * rootIndex + 2;
            
            if (leftChild < heapSize) {
                this.comparisons++;
                if (array[leftChild] > array[largest]) {
                    largest = leftChild;
                }
            }
            
            if (rightChild < heapSize) {
                this.comparisons++;
                if (array[rightChild] > array[largest]) {
                    largest = rightChild;
                }
            }
            
            if (largest === rootIndex) {
                break; // Heap property satisfied
            }
            
            this.swap(array, rootIndex, largest);
            rootIndex = largest;
        }
    }
    
    // Min heap sort (for descending order)
    sortDescending(arr) {
        const array = [...arr];
        const n = array.length;
        
        this.resetCounters();
        
        // Build min heap
        this.buildMinHeap(array);
        
        // Extract elements from heap one by one
        for (let i = n - 1; i > 0; i--) {
            this.swap(array, 0, i);
            this.minHeapify(array, i, 0);
        }
        
        return array;
    }
    
    buildMinHeap(array) {
        const n = array.length;
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            this.minHeapify(array, n, i);
        }
    }
    
    minHeapify(array, heapSize, rootIndex) {
        let smallest = rootIndex;
        const leftChild = 2 * rootIndex + 1;
        const rightChild = 2 * rootIndex + 2;
        
        if (leftChild < heapSize) {
            this.comparisons++;
            if (array[leftChild] < array[smallest]) {
                smallest = leftChild;
            }
        }
        
        if (rightChild < heapSize) {
            this.comparisons++;
            if (array[rightChild] < array[smallest]) {
                smallest = rightChild;
            }
        }
        
        if (smallest !== rootIndex) {
            this.swap(array, rootIndex, smallest);
            this.minHeapify(array, heapSize, smallest);
        }
    }
    
    // Heap sort with step-by-step visualization
    sortWithSteps(arr) {
        const array = [...arr];
        const steps = [];
        const n = array.length;
        
        this.resetCounters();
        
        // Initial state
        steps.push({
            array: [...array],
            phase: 'initial',
            description: 'Initial unsorted array'
        });
        
        // Build max heap phase
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            this.heapifyWithSteps(array, n, i, steps, 'build-heap');
        }
        
        steps.push({
            array: [...array],
            phase: 'heap-built',
            description: 'Max heap constructed - largest element at root'
        });
        
        // Sorting phase
        for (let i = n - 1; i > 0; i--) {
            // Move current root to end
            this.swap(array, 0, i);
            
            steps.push({
                array: [...array],
                phase: 'extract',
                description: \`Moved largest element \${array[i]} to position \${i}\`
            });
            
            // Restore heap property
            this.heapifyWithSteps(array, i, 0, steps, 'restore-heap');
        }
        
        return {
            sortedArray: array,
            steps: steps,
            statistics: this.getStatistics()
        };
    }
    
    heapifyWithSteps(array, heapSize, rootIndex, steps, phase) {
        let largest = rootIndex;
        const leftChild = 2 * rootIndex + 1;
        const rightChild = 2 * rootIndex + 2;
        
        if (leftChild < heapSize && array[leftChild] > array[largest]) {
            largest = leftChild;
        }
        
        if (rightChild < heapSize && array[rightChild] > array[largest]) {
            largest = rightChild;
        }
        
        if (largest !== rootIndex) {
            this.swap(array, rootIndex, largest);
            
            steps.push({
                array: [...array],
                phase: phase,
                description: \`Heapify: Swapped \${array[largest]} and \${array[rootIndex]}\`
            });
            
            this.heapifyWithSteps(array, heapSize, largest, steps, phase);
        }
    }
    
    // Utility functions
    swap(array, i, j) {
        [array[i], array[j]] = [array[j], array[i]];
        this.swaps++;
    }
    
    resetCounters() {
        this.comparisons = 0;
        this.swaps = 0;
    }
    
    getStatistics() {
        return {
            comparisons: this.comparisons,
            swaps: this.swaps
        };
    }
    
    // Verify heap property (for testing)
    isMaxHeap(array, index = 0, heapSize = array.length) {
        const leftChild = 2 * index + 1;
        const rightChild = 2 * index + 2;
        
        if (leftChild >= heapSize) {
            return true; // Leaf node
        }
        
        if (array[index] < array[leftChild]) {
            return false;
        }
        
        if (rightChild < heapSize && array[index] < array[rightChild]) {
            return false;
        }
        
        return this.isMaxHeap(array, leftChild, heapSize) && 
               (rightChild >= heapSize || this.isMaxHeap(array, rightChild, heapSize));
    }
}

// Usage Examples and Testing
console.log('=== Heap Sort Examples ===');

const heapSort = new HeapSort();

// Test with different data types
const testArrays = {
    small: [64, 34, 25, 12, 22, 11, 90],
    sorted: [1, 2, 3, 4, 5],
    reverse: [5, 4, 3, 2, 1],
    duplicates: [3, 1, 4, 1, 5, 9, 2, 6, 5, 3],
    single: [42],
    empty: []
};

console.log('\\n--- Heap Sort Results ---');
Object.entries(testArrays).forEach(([name, arr]) => {
    const sorted = heapSort.sort(arr);
    const stats = heapSort.getStatistics();
    console.log(\`\${name}: \${arr} → \${sorted}\`);
    console.log(\`  Stats: \${stats.comparisons} comparisons, \${stats.swaps} swaps\\n\`);
});

// Demonstrate step-by-step sorting
console.log('\\n--- Step-by-Step Heap Sort ---');
const stepResult = heapSort.sortWithSteps([3, 1, 4, 1, 5]);
console.log('Final result:', stepResult.sortedArray);
console.log('Total steps:', stepResult.steps.length);
console.log('Statistics:', stepResult.statistics);

// Performance comparison
console.log('\\n--- Performance Analysis ---');
const sizes = [100, 1000, 5000];
sizes.forEach(size => {
    const randomArray = Array.from({length: size}, () => Math.floor(Math.random() * 1000));
    
    console.time(\`Heap Sort - Size \${size}\`);
    heapSort.sort(randomArray);
    console.timeEnd(\`Heap Sort - Size \${size}\`);
    
    const stats = heapSort.getStatistics();
    console.log(\`  Comparisons: \${stats.comparisons}, Swaps: \${stats.swaps}\`);
});`,
    quizQuestions: [
      {
        question: "What is the time complexity of Heap Sort in all cases?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
        correctAnswer: 1,
        explanation: "Heap Sort has O(n log n) time complexity in best, average, and worst cases. Building the heap takes O(n) and each of the n extractions takes O(log n)."
      },
      {
        question: "What is the space complexity of Heap Sort?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctAnswer: 0,
        explanation: "Heap Sort is an in-place sorting algorithm with O(1) space complexity, as it only uses a constant amount of extra memory regardless of input size."
      },
      {
        question: "What data structure does Heap Sort use internally?",
        options: ["Stack", "Queue", "Binary Heap", "Linked List"],
        correctAnswer: 2,
        explanation: "Heap Sort uses a binary heap data structure, specifically a max heap for ascending order sorting, which maintains the heap property throughout the algorithm."
      },
      {
        question: "Is Heap Sort a stable sorting algorithm?",
        options: ["Yes, it maintains relative order", "No, it can change relative order", "Only for small arrays", "Only with modifications"],
        correctAnswer: 1,
        explanation: "Heap Sort is not stable because the heap operations can move equal elements past each other, changing their relative order from the original array."
      },
      {
        question: "What is the main advantage of Heap Sort over Quick Sort?",
        options: ["Better average performance", "Stable sorting", "Guaranteed O(n log n) performance", "Less memory usage"],
        correctAnswer: 2,
        explanation: "Heap Sort guarantees O(n log n) performance in all cases, while Quick Sort can degrade to O(n²) in worst-case scenarios, making Heap Sort more predictable."
      }
    ]
"@

# Replace Heap Sort content
$content = $content -replace [regex]::Escape($heapOld), $heapNew

Write-Host "Enhanced Heap Sort with all components!"

# Write back to file
$content | Set-Content $filePath -Encoding UTF8

Write-Host "Successfully enhanced Heap Sort!"
