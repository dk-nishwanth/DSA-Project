# PowerShell script to enhance Bucket Sort

$filePath = "c:\DSA\DSA-Project\src\data\dsaTopics.ts"
$content = Get-Content $filePath -Raw

Write-Host "Enhancing Bucket Sort..."

# Enhance Bucket Sort
$bucketOld = @"
  {
    id: 'bucket-sort',
    title: 'Bucket Sort',
    description: 'Distribute elements into buckets, sort individually, then concatenate - great for uniform data',
    category: 'Sorting',
    difficulty: 'intermediate',
    timeComplexity: 'O(n + k)',
    spaceComplexity: 'O(n + k)'
  },
"@

$bucketNew = @"
  {
    id: 'bucket-sort',
    title: 'Bucket Sort',
    description: 'Distribute elements into buckets, sort individually, then concatenate - great for uniform data',
    category: 'Sorting',
    difficulty: 'intermediate',
    timeComplexity: 'O(n + k)',
    spaceComplexity: 'O(n + k)',
    extendedDefinition: `Bucket Sort is a distribution-based sorting algorithm that works by distributing elements into a number of buckets, sorting each bucket individually, and then concatenating the sorted buckets. It's particularly effective when the input is uniformly distributed over a range.

**Algorithm Mechanism:**
1. **Create Buckets**: Initialize empty buckets (usually arrays or lists)
2. **Distribute Elements**: Place each element into appropriate bucket based on its value
3. **Sort Buckets**: Sort each individual bucket using any sorting algorithm
4. **Concatenate**: Combine all sorted buckets to get final result

**Key Characteristics:**
- **Distribution-Based**: Uses value distribution rather than comparisons
- **Stable**: Can maintain relative order with stable bucket sorting
- **Uniform Distribution Dependent**: Performance depends on input distribution
- **Flexible**: Can use any sorting algorithm for individual buckets

**Performance Analysis:**
- **Best Case**: O(n + k) when elements are uniformly distributed
- **Average Case**: O(n + n²/k + k) ≈ O(n) when k ≈ n
- **Worst Case**: O(n²) when all elements fall into one bucket
- **Space**: O(n + k) for buckets and auxiliary space

**Optimal Conditions:**
- Input uniformly distributed over known range
- Number of buckets approximately equal to number of elements
- Range of input values is known in advance`,
    voiceExplanation: `Think of bucket sort like organizing a huge library by sorting books into different sections first! Imagine you have thousands of books scattered around and you want to organize them alphabetically. Instead of trying to sort them all at once, bucket sort says "Let's be smart about this!" First, you set up different sections - one for books starting with A-C, another for D-F, another for G-I, and so on. Now you walk through all the books and toss each one into its appropriate section based on the first letter. Once you've distributed all books, you have much smaller, manageable piles in each section. Now comes the easy part - you sort each section individually using whatever method you like (maybe insertion sort since each pile is small). Finally, you just walk through the sections in order (A-C section first, then D-F, then G-I, etc.) and collect all the books. Voila! Your entire library is perfectly sorted! The magic happens because you've broken one massive sorting problem into many tiny, easy sorting problems. It works best when books are evenly spread across the alphabet - if 90% of your books start with 'S', then you haven't really helped yourself much!`,
    realWorldApplicationations: `**Industry Applications:**
- **Database Systems**: Range-based indexing, histogram equalization, data partitioning
- **Computer Graphics**: Color quantization, image processing, pixel sorting
- **Financial Systems**: Transaction processing by amount ranges, risk categorization
- **Scientific Computing**: Data binning, statistical analysis, experimental data processing
- **Network Systems**: Packet classification, bandwidth allocation, QoS management
- **E-commerce**: Price range filtering, product categorization, inventory management
- **Gaming Industry**: Score distribution, player ranking systems, leaderboard processing
- **Manufacturing**: Quality control sorting, batch processing by specifications
- **Educational Systems**: Grade distribution, student performance analysis
- **Geographic Systems**: Spatial data sorting, coordinate-based processing`,
    keyConcepts: `**Essential Concepts:**
1. **Bucket Distribution**: Strategy for assigning elements to appropriate buckets
2. **Uniform Distribution Assumption**: Performance depends on even element spread
3. **Bucket Count Selection**: Optimal number of buckets for best performance
4. **Individual Bucket Sorting**: Choice of sorting algorithm for each bucket
5. **Range Mapping**: Converting element values to bucket indices
6. **Load Balancing**: Ensuring buckets have roughly equal sizes
7. **Concatenation Order**: Proper ordering of buckets for final result
8. **Adaptive Bucket Sizing**: Adjusting bucket count based on input characteristics`,
    pseudocode: `**Bucket Sort Pseudocode:**

ALGORITHM BucketSort(array, bucketCount)
INPUT: array of elements, number of buckets
OUTPUT: sorted array
BEGIN
    n = length of array
    
    // Create empty buckets
    buckets = array of bucketCount empty lists
    
    // Find range of input values
    minValue = minimum value in array
    maxValue = maximum value in array
    range = maxValue - minValue
    
    // Distribute elements into buckets
    FOR i = 0 TO n-1 DO
        // Calculate bucket index
        bucketIndex = floor((array[i] - minValue) * bucketCount / (range + 1))
        buckets[bucketIndex].add(array[i])
    END FOR
    
    // Sort individual buckets
    FOR i = 0 TO bucketCount-1 DO
        sort(buckets[i]) // Use any sorting algorithm
    END FOR
    
    // Concatenate sorted buckets
    result = empty array
    FOR i = 0 TO bucketCount-1 DO
        FOR each element in buckets[i] DO
            result.add(element)
        END FOR
    END FOR
    
    RETURN result
END

ALGORITHM BucketSortFloats(array, bucketCount)
INPUT: array of floating-point numbers in range [0, 1)
OUTPUT: sorted array
BEGIN
    n = length of array
    buckets = array of bucketCount empty lists
    
    // Distribute elements (assuming range [0, 1))
    FOR i = 0 TO n-1 DO
        bucketIndex = floor(array[i] * bucketCount)
        // Handle edge case where array[i] = 1.0
        IF bucketIndex = bucketCount THEN
            bucketIndex = bucketCount - 1
        END IF
        buckets[bucketIndex].add(array[i])
    END FOR
    
    // Sort individual buckets using insertion sort
    FOR i = 0 TO bucketCount-1 DO
        InsertionSort(buckets[i])
    END FOR
    
    // Concatenate results
    result = empty array
    FOR i = 0 TO bucketCount-1 DO
        FOR each element in buckets[i] DO
            result.add(element)
        END FOR
    END FOR
    
    RETURN result
END

ALGORITHM AdaptiveBucketSort(array)
INPUT: array of elements
OUTPUT: sorted array with adaptive bucket count
BEGIN
    n = length of array
    
    // Adaptive bucket count selection
    bucketCount = max(1, floor(sqrt(n)))
    
    // Analyze distribution to adjust bucket count
    minValue = minimum value in array
    maxValue = maximum value in array
    range = maxValue - minValue
    
    // Adjust bucket count based on range and distribution
    IF range / n > 10 THEN
        bucketCount = min(bucketCount * 2, n)
    END IF
    
    RETURN BucketSort(array, bucketCount)
END`,
    implementationCode: `// Comprehensive Bucket Sort Implementation

class BucketSort {
    constructor() {
        this.comparisons = 0;
        this.distributions = 0;
        this.bucketSorts = 0;
    }
    
    // Basic bucket sort for general numeric data
    sort(arr, bucketCount = null) {
        if (arr.length === 0) return [];
        
        const array = [...arr];
        const n = array.length;
        
        // Default bucket count
        if (bucketCount === null) {
            bucketCount = Math.max(1, Math.floor(Math.sqrt(n)));
        }
        
        this.resetCounters();
        
        // Find range
        const minValue = Math.min(...array);
        const maxValue = Math.max(...array);
        const range = maxValue - minValue;
        
        // Handle edge case of all equal elements
        if (range === 0) {
            return array;
        }
        
        // Create empty buckets
        const buckets = Array.from({ length: bucketCount }, () => []);
        
        // Distribute elements into buckets
        for (let i = 0; i < n; i++) {
            const bucketIndex = Math.floor((array[i] - minValue) * bucketCount / (range + 1));
            const safeIndex = Math.min(bucketIndex, bucketCount - 1);
            buckets[safeIndex].push(array[i]);
            this.distributions++;
        }
        
        // Sort individual buckets
        for (let i = 0; i < bucketCount; i++) {
            if (buckets[i].length > 0) {
                buckets[i] = this.insertionSort(buckets[i]);
                this.bucketSorts++;
            }
        }
        
        // Concatenate sorted buckets
        const result = [];
        for (let i = 0; i < bucketCount; i++) {
            result.push(...buckets[i]);
        }
        
        return result;
    }
    
    // Bucket sort optimized for floating-point numbers in range [0, 1)
    sortFloats(arr, bucketCount = null) {
        if (arr.length === 0) return [];
        
        const array = [...arr];
        const n = array.length;
        
        // Validate input range
        if (array.some(x => x < 0 || x >= 1)) {
            throw new Error('Float bucket sort requires values in range [0, 1)');
        }
        
        if (bucketCount === null) {
            bucketCount = n;
        }
        
        this.resetCounters();
        
        // Create empty buckets
        const buckets = Array.from({ length: bucketCount }, () => []);
        
        // Distribute elements
        for (let i = 0; i < n; i++) {
            let bucketIndex = Math.floor(array[i] * bucketCount);
            // Handle edge case where value = 1.0
            if (bucketIndex === bucketCount) {
                bucketIndex = bucketCount - 1;
            }
            buckets[bucketIndex].push(array[i]);
            this.distributions++;
        }
        
        // Sort individual buckets
        for (let i = 0; i < bucketCount; i++) {
            if (buckets[i].length > 0) {
                buckets[i] = this.insertionSort(buckets[i]);
                this.bucketSorts++;
            }
        }
        
        // Concatenate results
        const result = [];
        for (let i = 0; i < bucketCount; i++) {
            result.push(...buckets[i]);
        }
        
        return result;
    }
    
    // Adaptive bucket sort with intelligent bucket count selection
    adaptiveSort(arr) {
        if (arr.length === 0) return [];
        
        const array = [...arr];
        const n = array.length;
        
        // Analyze input characteristics
        const minValue = Math.min(...array);
        const maxValue = Math.max(...array);
        const range = maxValue - minValue;
        const uniqueValues = new Set(array).size;
        
        // Adaptive bucket count selection
        let bucketCount = Math.max(1, Math.floor(Math.sqrt(n)));
        
        // Adjust based on data characteristics
        if (uniqueValues < n / 2) {
            // Many duplicates - fewer buckets
            bucketCount = Math.max(1, Math.floor(bucketCount / 2));
        } else if (range / n > 10) {
            // Wide range - more buckets
            bucketCount = Math.min(bucketCount * 2, n);
        }
        
        return this.sort(array, bucketCount);
    }
    
    // Bucket sort with step-by-step visualization
    sortWithSteps(arr, bucketCount = null) {
        if (arr.length === 0) return { sortedArray: [], steps: [] };
        
        const array = [...arr];
        const n = array.length;
        
        if (bucketCount === null) {
            bucketCount = Math.max(1, Math.floor(Math.sqrt(n)));
        }
        
        const steps = [];
        this.resetCounters();
        
        // Find range
        const minValue = Math.min(...array);
        const maxValue = Math.max(...array);
        const range = maxValue - minValue;
        
        // Initial state
        steps.push({
            phase: 'initial',
            array: [...array],
            bucketCount: bucketCount,
            range: { min: minValue, max: maxValue, span: range },
            description: \`Initial array with \${bucketCount} buckets, range: [\${minValue}, \${maxValue}]\`
        });
        
        // Create empty buckets
        const buckets = Array.from({ length: bucketCount }, () => []);
        
        steps.push({
            phase: 'buckets-created',
            buckets: buckets.map(b => [...b]),
            description: \`Created \${bucketCount} empty buckets\`
        });
        
        // Distribute elements
        for (let i = 0; i < n; i++) {
            const bucketIndex = Math.floor((array[i] - minValue) * bucketCount / (range + 1));
            const safeIndex = Math.min(bucketIndex, bucketCount - 1);
            buckets[safeIndex].push(array[i]);
            this.distributions++;
            
            steps.push({
                phase: 'distribution',
                element: array[i],
                bucketIndex: safeIndex,
                buckets: buckets.map(b => [...b]),
                description: \`Placed \${array[i]} into bucket \${safeIndex}\`
            });
        }
        
        steps.push({
            phase: 'distribution-complete',
            buckets: buckets.map(b => [...b]),
            description: 'All elements distributed into buckets'
        });
        
        // Sort individual buckets
        for (let i = 0; i < bucketCount; i++) {
            if (buckets[i].length > 0) {
                const originalBucket = [...buckets[i]];
                buckets[i] = this.insertionSort(buckets[i]);
                this.bucketSorts++;
                
                steps.push({
                    phase: 'bucket-sort',
                    bucketIndex: i,
                    originalBucket: originalBucket,
                    sortedBucket: [...buckets[i]],
                    buckets: buckets.map(b => [...b]),
                    description: \`Sorted bucket \${i}: \${originalBucket} → \${buckets[i]}\`
                });
            }
        }
        
        // Concatenate results
        const result = [];
        for (let i = 0; i < bucketCount; i++) {
            result.push(...buckets[i]);
        }
        
        steps.push({
            phase: 'concatenation',
            buckets: buckets.map(b => [...b]),
            result: [...result],
            description: 'Concatenated all sorted buckets'
        });
        
        steps.push({
            phase: 'complete',
            result: [...result],
            description: 'Bucket sort complete!'
        });
        
        return {
            sortedArray: result,
            steps: steps,
            statistics: this.getStatistics()
        };
    }
    
    // Insertion sort for individual buckets
    insertionSort(arr) {
        const array = [...arr];
        const n = array.length;
        
        for (let i = 1; i < n; i++) {
            const key = array[i];
            let j = i - 1;
            
            while (j >= 0) {
                this.comparisons++;
                if (array[j] > key) {
                    array[j + 1] = array[j];
                    j--;
                } else {
                    break;
                }
            }
            array[j + 1] = key;
        }
        
        return array;
    }
    
    // Analyze input distribution
    analyzeDistribution(arr) {
        if (arr.length === 0) return { uniform: true, recommendation: 'Empty array' };
        
        const n = arr.length;
        const minValue = Math.min(...arr);
        const maxValue = Math.max(...arr);
        const range = maxValue - minValue;
        
        // Create histogram to check uniformity
        const bucketCount = Math.max(1, Math.floor(Math.sqrt(n)));
        const histogram = new Array(bucketCount).fill(0);
        
        for (const value of arr) {
            const bucketIndex = Math.floor((value - minValue) * bucketCount / (range + 1));
            const safeIndex = Math.min(bucketIndex, bucketCount - 1);
            histogram[safeIndex]++;
        }
        
        // Calculate uniformity score
        const expectedPerBucket = n / bucketCount;
        const variance = histogram.reduce((sum, count) => {
            return sum + Math.pow(count - expectedPerBucket, 2);
        }, 0) / bucketCount;
        
        const uniformityScore = 1 - (Math.sqrt(variance) / expectedPerBucket);
        
        return {
            uniform: uniformityScore > 0.7,
            uniformityScore: uniformityScore,
            histogram: histogram,
            recommendation: uniformityScore > 0.8 ? 'Excellent for bucket sort' :
                          uniformityScore > 0.6 ? 'Good for bucket sort' :
                          uniformityScore > 0.4 ? 'Moderate for bucket sort' :
                          'Consider other sorting algorithms',
            optimalBuckets: bucketCount
        };
    }
    
    // Utility functions
    resetCounters() {
        this.comparisons = 0;
        this.distributions = 0;
        this.bucketSorts = 0;
    }
    
    getStatistics() {
        return {
            comparisons: this.comparisons,
            distributions: this.distributions,
            bucketSorts: this.bucketSorts
        };
    }
    
    // Performance analysis
    analyzeComplexity(n, k, uniformity = 0.8) {
        const avgBucketSize = n / k;
        const worstCaseBucketSize = uniformity < 0.5 ? n : avgBucketSize * 2;
        
        return {
            bestCase: {
                time: \`O(\${n} + \${k}) = O(\${n + k})\`,
                description: 'Uniform distribution, small bucket sizes'
            },
            averageCase: {
                time: \`O(\${n} + \${n}²/\${k} + \${k}) ≈ O(\${Math.round(n + (n * n) / k + k)})\`,
                description: 'Expected performance with good distribution'
            },
            worstCase: {
                time: \`O(\${n}²)\`,
                description: 'All elements in one bucket'
            },
            spaceComplexity: \`O(\${n} + \${k}) = O(\${n + k})\`,
            efficiency: uniformity > 0.7 ? 'Highly efficient' : 'May be inefficient',
            recommendation: k === Math.floor(Math.sqrt(n)) ? 'Optimal bucket count' : 'Consider adjusting bucket count'
        };
    }
}

// Usage Examples and Testing
console.log('=== Bucket Sort Examples ===');

const bucketSort = new BucketSort();

// Test with different data types
const testArrays = {
    uniform: [0.78, 0.17, 0.39, 0.26, 0.72, 0.94, 0.21, 0.12, 0.23, 0.68],
    integers: [29, 25, 3, 49, 9, 37, 21, 43, 15, 35],
    clustered: [10, 12, 11, 13, 45, 47, 46, 48, 80, 82, 81, 83],
    skewed: [1, 2, 3, 4, 5, 95, 96, 97, 98, 99],
    duplicates: [5, 3, 8, 3, 9, 5, 2, 8, 7, 5]
};

console.log('\\n--- General Bucket Sort ---');
Object.entries(testArrays).forEach(([name, arr]) => {
    if (name !== 'uniform') { // Skip uniform for general sort
        try {
            const sorted = bucketSort.sort(arr);
            const stats = bucketSort.getStatistics();
            console.log(\`\${name}: \${arr} → \${sorted}\`);
            console.log(\`  Stats: \${stats.comparisons} comparisons, \${stats.distributions} distributions, \${stats.bucketSorts} bucket sorts\\n\`);
        } catch (error) {
            console.log(\`\${name}: Error - \${error.message}\\n\`);
        }
    }
});

console.log('\\n--- Float Bucket Sort ---');
try {
    const sorted = bucketSort.sortFloats(testArrays.uniform);
    const stats = bucketSort.getStatistics();
    console.log(\`uniform floats: \${testArrays.uniform} → \${sorted}\`);
    console.log(\`  Stats: \${stats.comparisons} comparisons, \${stats.distributions} distributions, \${stats.bucketSorts} bucket sorts\\n\`);
} catch (error) {
    console.log(\`uniform floats: Error - \${error.message}\\n\`);
}

// Distribution analysis
console.log('\\n--- Distribution Analysis ---');
Object.entries(testArrays).forEach(([name, arr]) => {
    if (name !== 'uniform') {
        const analysis = bucketSort.analyzeDistribution(arr);
        console.log(\`\${name}: \${analysis.recommendation} (uniformity: \${analysis.uniformityScore.toFixed(2)})\`);
    }
});

// Adaptive sorting
console.log('\\n--- Adaptive Bucket Sort ---');
Object.entries(testArrays).forEach(([name, arr]) => {
    if (name !== 'uniform') {
        const sorted = bucketSort.adaptiveSort(arr);
        const stats = bucketSort.getStatistics();
        console.log(\`\${name}: \${arr} → \${sorted}\`);
        console.log(\`  Adaptive stats: \${stats.comparisons} comparisons, \${stats.distributions} distributions\\n\`);
    }
});

// Performance analysis
console.log('\\n--- Performance Analysis ---');
const performanceTest = bucketSort.analyzeComplexity(100, 10, 0.8);
console.log('For n=100, k=10, uniformity=0.8:');
console.log('Best case:', performanceTest.bestCase);
console.log('Average case:', performanceTest.averageCase);
console.log('Worst case:', performanceTest.worstCase);
console.log(\`Space: \${performanceTest.spaceComplexity}\`);
console.log(\`Efficiency: \${performanceTest.efficiency}\`);`,
    quizQuestions: [
      {
        question: "What is the best-case time complexity of bucket sort?",
        options: ["O(n)", "O(n + k)", "O(n log n)", "O(n²)"],
        correctAnswer: 1,
        explanation: "Bucket sort has O(n + k) best-case time complexity when elements are uniformly distributed across k buckets, where n is the number of elements and k is the number of buckets."
      },
      {
        question: "When does bucket sort perform poorly?",
        options: ["When input is already sorted", "When all elements fall into one bucket", "When using too many buckets", "When elements are integers"],
        correctAnswer: 1,
        explanation: "Bucket sort performs poorly when elements are not uniformly distributed and many (or all) elements fall into the same bucket, leading to O(n²) worst-case performance."
      },
      {
        question: "What is the key assumption for bucket sort to be efficient?",
        options: ["Input must be sorted", "Elements must be integers", "Input is uniformly distributed", "Array size must be large"],
        correctAnswer: 2,
        explanation: "Bucket sort assumes that input elements are uniformly distributed over the range. This ensures elements are evenly spread across buckets, leading to optimal performance."
      },
      {
        question: "What sorting algorithm is typically used for individual buckets?",
        options: ["Quick sort", "Merge sort", "Insertion sort", "Heap sort"],
        correctAnswer: 2,
        explanation: "Insertion sort is typically used for individual buckets because buckets are usually small, and insertion sort is efficient for small arrays with low overhead."
      },
      {
        question: "How should the number of buckets be chosen for optimal performance?",
        options: ["Always use 10 buckets", "Equal to array size", "Approximately square root of array size", "As large as possible"],
        correctAnswer: 2,
        explanation: "The optimal number of buckets is typically around the square root of the array size (√n), balancing the distribution overhead with the individual bucket sorting overhead."
      }
    ]
  },
"@

# Replace Bucket Sort content
$content = $content -replace [regex]::Escape($bucketOld), $bucketNew

Write-Host "Enhanced Bucket Sort!"

# Write back to file
$content | Set-Content $filePath -Encoding UTF8

Write-Host "Successfully enhanced Bucket Sort with all components!"
