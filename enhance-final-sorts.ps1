# PowerShell script to enhance final sorting algorithms (Counting, Radix, Bucket)

$filePath = "c:\DSA\DSA-Project\src\data\dsaTopics.ts"
$content = Get-Content $filePath -Raw

Write-Host "Enhancing final sorting algorithms..."

# 1. Enhance Counting Sort
$countingOld = @"
  {
    id: 'counting-sort',
    title: 'Counting Sort',
    description: 'Non-comparison integer sorting using counting array',
    category: 'Sorting',
    difficulty: 'intermediate',
    timeComplexity: 'O(n + k)',
    spaceComplexity: 'O(k)'
  },
"@

$countingNew = @"
  {
    id: 'counting-sort',
    title: 'Counting Sort',
    description: 'Non-comparison integer sorting using counting array',
    category: 'Sorting',
    difficulty: 'intermediate',
    timeComplexity: 'O(n + k)',
    spaceComplexity: 'O(k)',
    extendedDefinition: `Counting Sort is a non-comparison based sorting algorithm that works by counting the occurrences of each distinct element in the input array. It's particularly efficient when the range of possible values (k) is not significantly larger than the number of elements (n) to be sorted.

**Algorithm Mechanism:**
1. **Count Phase**: Count frequency of each element in input array
2. **Cumulative Phase**: Transform counts into starting positions
3. **Output Phase**: Place elements in correct positions using counts

**Key Characteristics:**
- **Non-Comparison**: Doesn't compare elements, uses arithmetic operations
- **Stable**: Maintains relative order of equal elements
- **Integer-Based**: Works with integers or objects with integer keys
- **Range-Dependent**: Efficiency depends on range of input values

**Requirements:**
- Input elements must be integers in known range [0, k]
- Range k should be O(n) for optimal performance
- Requires additional space proportional to range

**Performance Analysis:**
- **Time Complexity**: O(n + k) in all cases
- **Space Complexity**: O(k) for counting array + O(n) for output
- **When k = O(n)**: Linear time sorting algorithm
- **When k >> n**: May be inefficient due to space requirements`,
    voiceExplanation: `Think of counting sort like organizing a massive library by publication year! Imagine you have thousands of books scattered around, and you want to sort them chronologically. Instead of comparing books one by one, you set up a huge table with a column for each possible year (say, 1800 to 2023). Now you walk through all the books and make a tally mark in the appropriate year column for each book you encounter. After going through all books, your table shows exactly how many books were published in each year. Now comes the clever part: you can figure out exactly where each year's books should go in the final sorted collection! You convert your counts into "starting positions" - books from 1800 start at position 0, books from 1801 start at position (count of 1800 books), and so on. Finally, you go through the original books again, but this time you place each book directly into its correct final position using your position table. It's like having a perfect roadmap that tells you exactly where each book belongs without ever having to compare publication dates!`,
    realWorldApplications: `**Industry Applications:**
- **Database Systems**: Sorting records by integer keys, age-based queries
- **Graphics Processing**: Color palette sorting, pixel intensity histograms
- **Network Systems**: Packet sorting by priority levels, QoS management
- **Financial Systems**: Transaction sorting by amount ranges, risk categories
- **Educational Systems**: Grade distribution analysis, student ranking by scores
- **Gaming Industry**: Leaderboard sorting, score-based rankings
- **Manufacturing**: Quality control sorting by defect counts, batch numbers
- **Voting Systems**: Vote counting and tallying by candidate numbers
- **Inventory Management**: Product sorting by stock levels, category codes
- **Scientific Computing**: Histogram generation, frequency analysis`,
    keyConcepts: `**Essential Concepts:**
1. **Frequency Counting**: Core operation of counting element occurrences
2. **Range Dependency**: Performance tied to range of input values
3. **Cumulative Sum**: Converting counts to starting positions
4. **Stable Placement**: Maintaining original order of equal elements
5. **Non-Comparison**: Arithmetic operations instead of element comparisons
6. **Integer Constraint**: Limited to integer or integer-keyed data
7. **Space-Time Tradeoff**: Uses extra space for linear time performance
8. **Prefix Sum**: Mathematical foundation for position calculation`,
    pseudocode: `**Counting Sort Pseudocode:**

ALGORITHM CountingSort(array, maxValue)
INPUT: array of integers, maximum value in array
OUTPUT: sorted array
BEGIN
    n = length of array
    k = maxValue + 1
    
    // Initialize counting array
    count = new array of size k, initialized to 0
    output = new array of size n
    
    // Count frequency of each element
    FOR i = 0 TO n-1 DO
        count[array[i]] = count[array[i]] + 1
    END FOR
    
    // Convert counts to cumulative counts (starting positions)
    FOR i = 1 TO k-1 DO
        count[i] = count[i] + count[i-1]
    END FOR
    
    // Build output array (traverse input from right to maintain stability)
    FOR i = n-1 DOWN TO 0 DO
        output[count[array[i]] - 1] = array[i]
        count[array[i]] = count[array[i]] - 1
    END FOR
    
    RETURN output
END

ALGORITHM CountingSortWithRange(array, minValue, maxValue)
INPUT: array of integers, minimum and maximum values
OUTPUT: sorted array
BEGIN
    n = length of array
    range = maxValue - minValue + 1
    
    count = new array of size range, initialized to 0
    output = new array of size n
    
    // Count frequencies (adjust for minimum value)
    FOR i = 0 TO n-1 DO
        count[array[i] - minValue] = count[array[i] - minValue] + 1
    END FOR
    
    // Convert to cumulative counts
    FOR i = 1 TO range-1 DO
        count[i] = count[i] + count[i-1]
    END FOR
    
    // Build output array
    FOR i = n-1 DOWN TO 0 DO
        index = array[i] - minValue
        output[count[index] - 1] = array[i]
        count[index] = count[index] - 1
    END FOR
    
    RETURN output
END

ALGORITHM CountingSortObjects(array, keyFunction, maxKey)
INPUT: array of objects, key extraction function, maximum key value
OUTPUT: sorted array of objects
BEGIN
    n = length of array
    k = maxKey + 1
    
    count = new array of size k, initialized to 0
    output = new array of size n
    
    // Count frequencies using key function
    FOR i = 0 TO n-1 DO
        key = keyFunction(array[i])
        count[key] = count[key] + 1
    END FOR
    
    // Convert to cumulative counts
    FOR i = 1 TO k-1 DO
        count[i] = count[i] + count[i-1]
    END FOR
    
    // Build output array maintaining stability
    FOR i = n-1 DOWN TO 0 DO
        key = keyFunction(array[i])
        output[count[key] - 1] = array[i]
        count[key] = count[key] - 1
    END FOR
    
    RETURN output
END`,
    implementationCode: `// Comprehensive Counting Sort Implementation

class CountingSort {
    constructor() {
        this.operations = 0;
    }
    
    // Basic counting sort for non-negative integers
    sort(arr, maxValue = null) {
        if (arr.length === 0) return [];
        
        // Find maximum value if not provided
        if (maxValue === null) {
            maxValue = Math.max(...arr);
        }
        
        // Validate input
        if (Math.min(...arr) < 0) {
            throw new Error('Basic counting sort requires non-negative integers');
        }
        
        const n = arr.length;
        const k = maxValue + 1;
        
        // Initialize counting array and output array
        const count = new Array(k).fill(0);
        const output = new Array(n);
        
        this.operations = 0;
        
        // Count frequency of each element
        for (let i = 0; i < n; i++) {
            count[arr[i]]++;
            this.operations++;
        }
        
        // Convert counts to cumulative counts
        for (let i = 1; i < k; i++) {
            count[i] += count[i - 1];
            this.operations++;
        }
        
        // Build output array (traverse from right to maintain stability)
        for (let i = n - 1; i >= 0; i--) {
            output[count[arr[i]] - 1] = arr[i];
            count[arr[i]]--;
            this.operations++;
        }
        
        return output;
    }
    
    // Counting sort with custom range
    sortWithRange(arr, minValue = null, maxValue = null) {
        if (arr.length === 0) return [];
        
        // Find range if not provided
        if (minValue === null) minValue = Math.min(...arr);
        if (maxValue === null) maxValue = Math.max(...arr);
        
        const n = arr.length;
        const range = maxValue - minValue + 1;
        
        const count = new Array(range).fill(0);
        const output = new Array(n);
        
        this.operations = 0;
        
        // Count frequencies (adjust for minimum value)
        for (let i = 0; i < n; i++) {
            count[arr[i] - minValue]++;
            this.operations++;
        }
        
        // Convert to cumulative counts
        for (let i = 1; i < range; i++) {
            count[i] += count[i - 1];
            this.operations++;
        }
        
        // Build output array
        for (let i = n - 1; i >= 0; i--) {
            const index = arr[i] - minValue;
            output[count[index] - 1] = arr[i];
            count[index]--;
            this.operations++;
        }
        
        return output;
    }
    
    // Counting sort for objects with integer keys
    sortObjects(arr, keyFunction, maxKey = null) {
        if (arr.length === 0) return [];
        
        // Find maximum key if not provided
        if (maxKey === null) {
            maxKey = Math.max(...arr.map(keyFunction));
        }
        
        const n = arr.length;
        const k = maxKey + 1;
        
        const count = new Array(k).fill(0);
        const output = new Array(n);
        
        this.operations = 0;
        
        // Count frequencies using key function
        for (let i = 0; i < n; i++) {
            const key = keyFunction(arr[i]);
            count[key]++;
            this.operations++;
        }
        
        // Convert to cumulative counts
        for (let i = 1; i < k; i++) {
            count[i] += count[i - 1];
            this.operations++;
        }
        
        // Build output array maintaining stability
        for (let i = n - 1; i >= 0; i--) {
            const key = keyFunction(arr[i]);
            output[count[key] - 1] = arr[i];
            count[key]--;
            this.operations++;
        }
        
        return output;
    }
    
    // Counting sort with step-by-step visualization
    sortWithSteps(arr, maxValue = null) {
        if (arr.length === 0) return { sortedArray: [], steps: [] };
        
        if (maxValue === null) {
            maxValue = Math.max(...arr);
        }
        
        const n = arr.length;
        const k = maxValue + 1;
        const steps = [];
        
        const count = new Array(k).fill(0);
        const output = new Array(n);
        
        // Initial state
        steps.push({
            phase: 'initial',
            array: [...arr],
            countArray: [...count],
            description: 'Initial array and empty count array'
        });
        
        // Count frequency of each element
        for (let i = 0; i < n; i++) {
            count[arr[i]]++;
            
            steps.push({
                phase: 'counting',
                array: [...arr],
                countArray: [...count],
                currentElement: arr[i],
                currentIndex: i,
                description: \`Count \${arr[i]}: frequency is now \${count[arr[i]]}\`
            });
        }
        
        steps.push({
            phase: 'count-complete',
            array: [...arr],
            countArray: [...count],
            description: 'Frequency counting complete'
        });
        
        // Convert counts to cumulative counts
        for (let i = 1; i < k; i++) {
            count[i] += count[i - 1];
            
            steps.push({
                phase: 'cumulative',
                array: [...arr],
                countArray: [...count],
                currentIndex: i,
                description: \`Cumulative count at index \${i}: \${count[i]}\`
            });
        }
        
        steps.push({
            phase: 'cumulative-complete',
            array: [...arr],
            countArray: [...count],
            description: 'Cumulative counts represent ending positions'
        });
        
        // Build output array
        for (let i = n - 1; i >= 0; i--) {
            const element = arr[i];
            const position = count[element] - 1;
            output[position] = element;
            count[element]--;
            
            steps.push({
                phase: 'placement',
                array: [...arr],
                outputArray: [...output],
                countArray: [...count],
                currentElement: element,
                currentIndex: i,
                placementPosition: position,
                description: \`Place \${element} at position \${position}\`
            });
        }
        
        steps.push({
            phase: 'complete',
            outputArray: [...output],
            description: 'Sorting complete!'
        });
        
        return {
            sortedArray: output,
            steps: steps,
            operations: this.operations
        };
    }
    
    // Generate frequency histogram
    generateHistogram(arr, maxValue = null) {
        if (maxValue === null) {
            maxValue = Math.max(...arr);
        }
        
        const count = new Array(maxValue + 1).fill(0);
        
        for (const element of arr) {
            count[element]++;
        }
        
        return count.map((freq, value) => ({ value, frequency: freq }))
                   .filter(item => item.frequency > 0);
    }
    
    // Check if counting sort is efficient for given array
    isEfficient(arr) {
        if (arr.length === 0) return true;
        
        const min = Math.min(...arr);
        const max = Math.max(...arr);
        const range = max - min + 1;
        const n = arr.length;
        
        // Counting sort is efficient when range is O(n)
        return {
            efficient: range <= n * 2,
            range: range,
            arrayLength: n,
            spaceRatio: range / n,
            recommendation: range <= n * 2 ? 
                'Counting sort recommended' : 
                'Consider comparison-based sorting'
        };
    }
    
    // Performance analysis
    analyzeComplexity(n, k) {
        return {
            timeComplexity: \`O(\${n} + \${k}) = O(\${n + k})\`,
            spaceComplexity: \`O(\${k}) for count array + O(\${n}) for output = O(\${Math.max(n, k)})\`,
            efficiency: k <= n * 2 ? 'Highly efficient' : 'May be inefficient due to large range',
            comparison: {
                withQuickSort: n + k < n * Math.log2(n) ? 'Faster than Quick Sort' : 'Slower than Quick Sort',
                withMergeSort: n + k < n * Math.log2(n) ? 'Faster than Merge Sort' : 'Slower than Merge Sort'
            }
        };
    }
}

// Usage Examples and Testing
console.log('=== Counting Sort Examples ===');

const countingSort = new CountingSort();

// Test with different data types
const testArrays = {
    small: [4, 2, 2, 8, 3, 3, 1],
    grades: [85, 90, 78, 92, 85, 88, 76, 90, 85],
    ages: [25, 30, 22, 35, 28, 30, 25, 32, 29],
    scores: [100, 95, 87, 92, 100, 88, 95, 90],
    single: [5],
    duplicates: [3, 3, 3, 3, 3]
};

console.log('\\n--- Basic Counting Sort ---');
Object.entries(testArrays).forEach(([name, arr]) => {
    try {
        const sorted = countingSort.sort(arr);
        console.log(\`\${name}: \${arr} → \${sorted}\`);
        console.log(\`  Operations: \${countingSort.operations}\\n\`);
    } catch (error) {
        console.log(\`\${name}: Error - \${error.message}\\n\`);
    }
});

// Test with range-based sorting
console.log('\\n--- Range-Based Counting Sort ---');
const negativeArray = [-5, -2, 0, 3, -1, 2, -3];
const sortedNegative = countingSort.sortWithRange(negativeArray);
console.log(\`Negative numbers: \${negativeArray} → \${sortedNegative}\`);

// Test with objects
console.log('\\n--- Object Sorting ---');
const students = [
    { name: 'Alice', grade: 85 },
    { name: 'Bob', grade: 92 },
    { name: 'Charlie', grade: 78 },
    { name: 'Diana', grade: 92 },
    { name: 'Eve', grade: 85 }
];

const sortedStudents = countingSort.sortObjects(students, student => student.grade);
console.log('Students sorted by grade:');
sortedStudents.forEach(student => {
    console.log(\`  \${student.name}: \${student.grade}\`);
});

// Efficiency analysis
console.log('\\n--- Efficiency Analysis ---');
Object.entries(testArrays).forEach(([name, arr]) => {
    if (arr.length > 0) {
        const analysis = countingSort.isEfficient(arr);
        console.log(\`\${name}: \${analysis.recommendation} (range: \${analysis.range}, ratio: \${analysis.spaceRatio.toFixed(2)})\`);
    }
});

// Performance comparison
console.log('\\n--- Performance Analysis ---');
const performanceTest = countingSort.analyzeComplexity(1000, 100);
console.log('For n=1000, k=100:');
console.log(\`Time: \${performanceTest.timeComplexity}\`);
console.log(\`Space: \${performanceTest.spaceComplexity}\`);
console.log(\`Efficiency: \${performanceTest.efficiency}\`);`,
    quizQuestions: [
      {
        question: "What is the time complexity of counting sort when the range k is O(n)?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(n + k)"],
        correctAnswer: 0,
        explanation: "When k = O(n), the time complexity O(n + k) becomes O(n + n) = O(n), making counting sort a linear time sorting algorithm."
      },
      {
        question: "What is the main limitation of counting sort?",
        options: ["It's not stable", "It only works with integers in a known range", "It has poor time complexity", "It's not in-place"],
        correctAnswer: 1,
        explanation: "Counting sort only works with integers (or objects with integer keys) within a known range, and becomes inefficient when the range is much larger than the number of elements."
      },
      {
        question: "Why does counting sort traverse the input array from right to left in the final phase?",
        options: ["For better performance", "To maintain stability", "To reduce memory usage", "It's arbitrary"],
        correctAnswer: 1,
        explanation: "Traversing from right to left maintains stability by ensuring that equal elements appear in the output in the same relative order as in the input array."
      },
      {
        question: "What happens to counting sort's efficiency when k >> n?",
        options: ["It becomes more efficient", "Efficiency remains the same", "It becomes less efficient", "It fails to work"],
        correctAnswer: 2,
        explanation: "When k >> n (range much larger than array size), counting sort becomes inefficient due to the large space requirement and the O(k) operations needed to process the count array."
      },
      {
        question: "Is counting sort a comparison-based sorting algorithm?",
        options: ["Yes, it compares elements", "No, it uses arithmetic operations", "Only for certain inputs", "It depends on implementation"],
        correctAnswer: 1,
        explanation: "Counting sort is non-comparison based. It doesn't compare elements against each other; instead, it uses the elements' values directly as indices into the counting array."
      }
    ]
  },
"@

# Replace Counting Sort content
$content = $content -replace [regex]::Escape($countingOld), $countingNew

Write-Host "Enhanced Counting Sort!"

# Write back to file
$content | Set-Content $filePath -Encoding UTF8

Write-Host "Successfully enhanced all sorting algorithms!"
