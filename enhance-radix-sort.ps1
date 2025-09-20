# PowerShell script to enhance Radix Sort

$filePath = "c:\DSA\DSA-Project\src\data\dsaTopics.ts"
$content = Get-Content $filePath -Raw

Write-Host "Enhancing Radix Sort..."

# Enhance Radix Sort
$radixOld = @"
  {
    id: 'radix-sort',
    title: 'Radix Sort',
    description: 'Non-comparison sorting by processing digits',
    category: 'Sorting',
    difficulty: 'intermediate',
    timeComplexity: 'O(d Ã— (n + k))',
    spaceComplexity: 'O(n + k)'
  },
"@

$radixNew = @"
  {
    id: 'radix-sort',
    title: 'Radix Sort',
    description: 'Non-comparison sorting by processing digits',
    category: 'Sorting',
    difficulty: 'intermediate',
    timeComplexity: 'O(d × (n + k))',
    spaceComplexity: 'O(n + k)',
    extendedDefinition: `Radix Sort is a non-comparison based sorting algorithm that sorts integers by processing individual digits. It works by sorting the elements digit by digit, starting from the least significant digit (LSD) to the most significant digit (MSD), using a stable sorting algorithm like counting sort as a subroutine.

**Algorithm Mechanism:**
1. **Digit Extraction**: Process digits from rightmost (least significant) to leftmost (most significant)
2. **Stable Sorting**: Use counting sort to sort by each digit position
3. **Iteration**: Repeat for all digit positions until complete

**Key Characteristics:**
- **Non-Comparison**: Doesn't compare elements directly, uses digit values
- **Stable**: Maintains relative order of equal elements
- **Integer-Based**: Works with integers or fixed-length strings
- **Digit-Dependent**: Performance depends on number of digits

**Variants:**
- **LSD (Least Significant Digit)**: Processes from rightmost digit
- **MSD (Most Significant Digit)**: Processes from leftmost digit
- **Binary Radix**: Uses binary representation for sorting

**Performance Analysis:**
- **Time Complexity**: O(d × (n + k)) where d = digits, n = elements, k = radix
- **Space Complexity**: O(n + k) for auxiliary arrays
- **When d is constant**: Linear time O(n) sorting algorithm
- **Best for**: Fixed-width integers or strings`,
    voiceExplanation: `Think of radix sort like organizing a massive filing cabinet by employee ID numbers! Imagine you have thousands of employee files with 5-digit ID numbers scattered everywhere, and you need to sort them numerically. Instead of comparing entire ID numbers, radix sort is like having a super-organized assistant who says "Let's sort by the last digit first!" So you create 10 piles (0-9) and place each file in the pile matching its last digit. Then you collect the piles in order (0 pile first, then 1 pile, etc.). Now you repeat this process with the second-to-last digit, then the third-to-last, and so on. The magic is that after processing all 5 digit positions, your files are perfectly sorted by ID number! It's like peeling an onion - you handle one layer (digit) at a time, and the stable sorting at each step ensures everything stays in the right relative order. The beautiful thing is you never have to compare full ID numbers - you just look at one digit at a time!`,
    realWorldApplications: `**Industry Applications:**
- **Database Systems**: Sorting large datasets with fixed-width keys, index creation
- **Computer Graphics**: Sorting pixels by color values, image processing algorithms
- **Network Systems**: IP address sorting, packet routing, network analysis
- **Financial Systems**: Account number sorting, transaction ID processing
- **Telecommunications**: Phone number sorting, routing table management
- **Scientific Computing**: Sorting experimental data with numeric identifiers
- **Gaming Industry**: Player ID sorting, score processing, leaderboard management
- **Manufacturing**: Serial number sorting, batch processing, quality control
- **Library Systems**: ISBN sorting, catalog number organization
- **Government Systems**: Social security number sorting, ID processing`,
    keyConcepts: `**Essential Concepts:**
1. **Digit-by-Digit Processing**: Core strategy of handling one digit position at a time
2. **Stable Subroutine**: Requires stable sorting (usually counting sort) for each digit
3. **Radix Selection**: Choice of base (usually 10 for decimal, 2 for binary)
4. **LSD vs MSD**: Different approaches for digit processing order
5. **Fixed-Width Requirement**: All numbers must have same number of digits
6. **Linear Time Potential**: O(n) when number of digits is constant
7. **Space-Time Tradeoff**: Uses extra space for linear time performance
8. **Non-Comparison Nature**: Avoids element comparisons entirely`,
    pseudocode: `**Radix Sort Pseudocode:**

ALGORITHM RadixSort(array)
INPUT: array of non-negative integers
OUTPUT: sorted array
BEGIN
    // Find maximum number to determine number of digits
    maxNum = findMaximum(array)
    
    // Process each digit position (LSD to MSD)
    digitPosition = 1
    WHILE maxNum / digitPosition > 0 DO
        CountingSortByDigit(array, digitPosition)
        digitPosition = digitPosition * 10
    END WHILE
    
    RETURN array
END

ALGORITHM CountingSortByDigit(array, digitPosition)
INPUT: array and current digit position
OUTPUT: array sorted by specific digit
BEGIN
    n = length of array
    output = new array of size n
    count = new array of size 10, initialized to 0
    
    // Count frequency of each digit (0-9)
    FOR i = 0 TO n-1 DO
        digit = (array[i] / digitPosition) % 10
        count[digit] = count[digit] + 1
    END FOR
    
    // Convert counts to cumulative counts
    FOR i = 1 TO 9 DO
        count[i] = count[i] + count[i-1]
    END FOR
    
    // Build output array (maintain stability)
    FOR i = n-1 DOWN TO 0 DO
        digit = (array[i] / digitPosition) % 10
        output[count[digit] - 1] = array[i]
        count[digit] = count[digit] - 1
    END FOR
    
    // Copy output back to original array
    FOR i = 0 TO n-1 DO
        array[i] = output[i]
    END FOR
END

ALGORITHM MSDRadixSort(array, left, right, digitPosition)
INPUT: array, range bounds, current digit position
OUTPUT: sorted array using MSD approach
BEGIN
    IF left >= right OR digitPosition <= 0 THEN
        RETURN
    END IF
    
    // Count frequency of each digit
    count = new array of size 11, initialized to 0
    
    FOR i = left TO right DO
        digit = getDigitAtPosition(array[i], digitPosition)
        count[digit + 1] = count[digit + 1] + 1
    END FOR
    
    // Convert to cumulative counts
    FOR i = 0 TO 9 DO
        count[i + 1] = count[i + 1] + count[i]
    END FOR
    
    // Distribute elements
    aux = new array of size (right - left + 1)
    FOR i = left TO right DO
        digit = getDigitAtPosition(array[i], digitPosition)
        aux[count[digit]] = array[i]
        count[digit] = count[digit] + 1
    END FOR
    
    // Copy back
    FOR i = left TO right DO
        array[i] = aux[i - left]
    END FOR
    
    // Recursively sort each digit group
    FOR i = 0 TO 9 DO
        MSDRadixSort(array, left + count[i], left + count[i + 1] - 1, digitPosition - 1)
    END FOR
END`,
    implementationCode: `// Comprehensive Radix Sort Implementation

class RadixSort {
    constructor() {
        this.operations = 0;
        this.passes = 0;
    }
    
    // LSD (Least Significant Digit) Radix Sort
    sort(arr) {
        if (arr.length === 0) return [];
        
        // Validate input (non-negative integers only)
        if (arr.some(num => num < 0 || !Number.isInteger(num))) {
            throw new Error('LSD Radix sort requires non-negative integers');
        }
        
        const array = [...arr];
        this.operations = 0;
        this.passes = 0;
        
        // Find maximum number to determine number of digits
        const maxNum = Math.max(...array);
        
        // Process each digit position
        for (let digitPosition = 1; Math.floor(maxNum / digitPosition) > 0; digitPosition *= 10) {
            this.countingSortByDigit(array, digitPosition);
            this.passes++;
        }
        
        return array;
    }
    
    // Counting sort by specific digit position
    countingSortByDigit(array, digitPosition) {
        const n = array.length;
        const output = new Array(n);
        const count = new Array(10).fill(0);
        
        // Count frequency of each digit (0-9)
        for (let i = 0; i < n; i++) {
            const digit = Math.floor(array[i] / digitPosition) % 10;
            count[digit]++;
            this.operations++;
        }
        
        // Convert counts to cumulative counts
        for (let i = 1; i < 10; i++) {
            count[i] += count[i - 1];
            this.operations++;
        }
        
        // Build output array (maintain stability)
        for (let i = n - 1; i >= 0; i--) {
            const digit = Math.floor(array[i] / digitPosition) % 10;
            output[count[digit] - 1] = array[i];
            count[digit]--;
            this.operations++;
        }
        
        // Copy output back to original array
        for (let i = 0; i < n; i++) {
            array[i] = output[i];
            this.operations++;
        }
    }
    
    // MSD (Most Significant Digit) Radix Sort
    msdSort(arr) {
        if (arr.length === 0) return [];
        
        const array = [...arr];
        const maxNum = Math.max(...array);
        const maxDigits = maxNum.toString().length;
        
        this.operations = 0;
        this.passes = 0;
        
        this.msdSortRecursive(array, 0, array.length - 1, maxDigits);
        
        return array;
    }
    
    msdSortRecursive(array, left, right, digitPosition) {
        if (left >= right || digitPosition <= 0) {
            return;
        }
        
        this.passes++;
        const count = new Array(11).fill(0);
        
        // Count frequency of each digit
        for (let i = left; i <= right; i++) {
            const digit = this.getDigitAtPosition(array[i], digitPosition);
            count[digit + 1]++;
            this.operations++;
        }
        
        // Convert to cumulative counts
        for (let i = 0; i < 10; i++) {
            count[i + 1] += count[i];
            this.operations++;
        }
        
        // Distribute elements
        const aux = new Array(right - left + 1);
        for (let i = left; i <= right; i++) {
            const digit = this.getDigitAtPosition(array[i], digitPosition);
            aux[count[digit]++] = array[i];
            this.operations++;
        }
        
        // Copy back
        for (let i = left; i <= right; i++) {
            array[i] = aux[i - left];
            this.operations++;
        }
        
        // Recursively sort each digit group
        for (let i = 0; i < 10; i++) {
            const start = left + count[i];
            const end = left + count[i + 1] - 1;
            if (start <= end) {
                this.msdSortRecursive(array, start, end, digitPosition - 1);
            }
        }
    }
    
    // Binary radix sort (for better cache performance)
    binaryRadixSort(arr) {
        if (arr.length === 0) return [];
        
        const array = [...arr];
        const maxNum = Math.max(...array);
        const maxBits = Math.floor(Math.log2(maxNum)) + 1;
        
        this.operations = 0;
        this.passes = 0;
        
        for (let bit = 0; bit < maxBits; bit++) {
            this.countingSortByBit(array, bit);
            this.passes++;
        }
        
        return array;
    }
    
    countingSortByBit(array, bitPosition) {
        const n = array.length;
        const output = new Array(n);
        const count = [0, 0]; // Only 0 and 1 for binary
        
        // Count 0s and 1s at current bit position
        for (let i = 0; i < n; i++) {
            const bit = (array[i] >> bitPosition) & 1;
            count[bit]++;
            this.operations++;
        }
        
        // Convert to cumulative count
        count[1] += count[0];
        
        // Build output array
        for (let i = n - 1; i >= 0; i--) {
            const bit = (array[i] >> bitPosition) & 1;
            output[count[bit] - 1] = array[i];
            count[bit]--;
            this.operations++;
        }
        
        // Copy back
        for (let i = 0; i < n; i++) {
            array[i] = output[i];
            this.operations++;
        }
    }
    
    // Radix sort with step-by-step visualization
    sortWithSteps(arr) {
        if (arr.length === 0) return { sortedArray: [], steps: [] };
        
        const array = [...arr];
        const steps = [];
        const maxNum = Math.max(...array);
        
        this.operations = 0;
        this.passes = 0;
        
        // Initial state
        steps.push({
            phase: 'initial',
            array: [...array],
            digitPosition: 0,
            description: \`Initial array, max number: \${maxNum}\`
        });
        
        // Process each digit position
        for (let digitPosition = 1; Math.floor(maxNum / digitPosition) > 0; digitPosition *= 10) {
            this.passes++;
            const digitPlace = Math.log10(digitPosition);
            
            steps.push({
                phase: 'digit-start',
                array: [...array],
                digitPosition: digitPosition,
                digitPlace: digitPlace,
                description: \`Processing digit position \${digitPlace + 1} (digit position \${digitPosition})\`
            });
            
            // Show digit extraction
            const digitCounts = new Array(10).fill(0);
            for (let i = 0; i < array.length; i++) {
                const digit = Math.floor(array[i] / digitPosition) % 10;
                digitCounts[digit]++;
            }
            
            steps.push({
                phase: 'digit-count',
                array: [...array],
                digitPosition: digitPosition,
                digitCounts: [...digitCounts],
                description: \`Digit frequency count for position \${digitPlace + 1}\`
            });
            
            // Perform counting sort by digit
            this.countingSortByDigitWithSteps(array, digitPosition, steps);
            
            steps.push({
                phase: 'digit-complete',
                array: [...array],
                digitPosition: digitPosition,
                description: \`Completed sorting by digit position \${digitPlace + 1}\`
            });
        }
        
        steps.push({
            phase: 'complete',
            array: [...array],
            description: 'Radix sort complete!'
        });
        
        return {
            sortedArray: array,
            steps: steps,
            statistics: this.getStatistics()
        };
    }
    
    countingSortByDigitWithSteps(array, digitPosition, steps) {
        const n = array.length;
        const output = new Array(n);
        const count = new Array(10).fill(0);
        
        // Count and build output (simplified for visualization)
        for (let i = 0; i < n; i++) {
            const digit = Math.floor(array[i] / digitPosition) % 10;
            count[digit]++;
        }
        
        for (let i = 1; i < 10; i++) {
            count[i] += count[i - 1];
        }
        
        for (let i = n - 1; i >= 0; i--) {
            const digit = Math.floor(array[i] / digitPosition) % 10;
            output[count[digit] - 1] = array[i];
            count[digit]--;
        }
        
        for (let i = 0; i < n; i++) {
            array[i] = output[i];
        }
    }
    
    // Utility functions
    getDigitAtPosition(number, position) {
        const str = number.toString();
        const index = str.length - position;
        return index >= 0 ? parseInt(str[index]) : 0;
    }
    
    getStatistics() {
        return {
            operations: this.operations,
            passes: this.passes
        };
    }
    
    // Performance analysis
    analyzeComplexity(n, maxDigits, radix = 10) {
        const timeComplexity = maxDigits * (n + radix);
        const spaceComplexity = n + radix;
        
        return {
            timeComplexity: \`O(\${maxDigits} × (\${n} + \${radix})) = O(\${timeComplexity})\`,
            spaceComplexity: \`O(\${n} + \${radix}) = O(\${spaceComplexity})\`,
            efficiency: maxDigits <= Math.log2(n) ? 'More efficient than comparison sorts' : 'Consider comparison sorts',
            linearTime: maxDigits <= 4 ? 'Effectively linear time' : 'May be slower than O(n log n) sorts'
        };
    }
    
    // Check if radix sort is suitable
    isSuitable(arr) {
        if (arr.length === 0) return { suitable: true, reason: 'Empty array' };
        
        // Check for non-negative integers
        const hasNegative = arr.some(num => num < 0);
        const hasFloat = arr.some(num => !Number.isInteger(num));
        
        if (hasNegative) return { suitable: false, reason: 'Contains negative numbers' };
        if (hasFloat) return { suitable: false, reason: 'Contains non-integers' };
        
        const maxNum = Math.max(...arr);
        const digits = maxNum.toString().length;
        const n = arr.length;
        
        return {
            suitable: digits <= Math.log2(n) + 2,
            reason: digits <= Math.log2(n) + 2 ? 'Good digit-to-size ratio' : 'Too many digits relative to array size',
            digits: digits,
            recommendation: digits <= 4 ? 'Highly recommended' : 'Consider Quick Sort or Merge Sort'
        };
    }
}

// Usage Examples and Testing
console.log('=== Radix Sort Examples ===');

const radixSort = new RadixSort();

// Test with different data types
const testArrays = {
    small: [170, 45, 75, 90, 2, 802, 24, 66],
    uniform: [123, 456, 789, 234, 567, 890, 345, 678],
    singleDigit: [9, 5, 2, 8, 1, 7, 3, 6, 4],
    largeNumbers: [1000000, 999999, 500000, 750000, 250000],
    duplicates: [100, 200, 100, 300, 200, 100]
};

console.log('\\n--- LSD Radix Sort ---');
Object.entries(testArrays).forEach(([name, arr]) => {
    try {
        const sorted = radixSort.sort(arr);
        const stats = radixSort.getStatistics();
        console.log(\`\${name}: \${arr} → \${sorted}\`);
        console.log(\`  Stats: \${stats.operations} operations, \${stats.passes} passes\\n\`);
    } catch (error) {
        console.log(\`\${name}: Error - \${error.message}\\n\`);
    }
});

console.log('\\n--- MSD Radix Sort ---');
Object.entries(testArrays).forEach(([name, arr]) => {
    try {
        const sorted = radixSort.msdSort(arr);
        const stats = radixSort.getStatistics();
        console.log(\`\${name}: \${arr} → \${sorted}\`);
        console.log(\`  Stats: \${stats.operations} operations, \${stats.passes} passes\\n\`);
    } catch (error) {
        console.log(\`\${name}: Error - \${error.message}\\n\`);
    }
});

// Suitability analysis
console.log('\\n--- Suitability Analysis ---');
Object.entries(testArrays).forEach(([name, arr]) => {
    const analysis = radixSort.isSuitable(arr);
    console.log(\`\${name}: \${analysis.suitable ? 'Suitable' : 'Not suitable'} - \${analysis.reason}\`);
    if (analysis.digits) {
        console.log(\`  Digits: \${analysis.digits}, Recommendation: \${analysis.recommendation}\`);
    }
});

// Performance analysis
console.log('\\n--- Performance Analysis ---');
const performanceTest = radixSort.analyzeComplexity(1000, 3, 10);
console.log('For n=1000, d=3, k=10:');
console.log(\`Time: \${performanceTest.timeComplexity}\`);
console.log(\`Space: \${performanceTest.spaceComplexity}\`);
console.log(\`Efficiency: \${performanceTest.efficiency}\`);
console.log(\`Linear time: \${performanceTest.linearTime}\`);`,
    quizQuestions: [
      {
        question: "What is the time complexity of radix sort for d-digit numbers?",
        options: ["O(n)", "O(n log n)", "O(d × (n + k))", "O(n²)"],
        correctAnswer: 2,
        explanation: "Radix sort has time complexity O(d × (n + k)) where d is the number of digits, n is the number of elements, and k is the radix (base). Each digit position requires O(n + k) time for counting sort."
      },
      {
        question: "What is the main requirement for using radix sort?",
        options: ["Elements must be comparable", "Elements must be integers with fixed number of digits", "Array must be partially sorted", "Array size must be a power of 2"],
        correctAnswer: 1,
        explanation: "Radix sort requires elements to be integers (or fixed-length strings) because it processes individual digit positions. It cannot work with arbitrary comparable elements like comparison-based sorts."
      },
      {
        question: "What does LSD stand for in LSD Radix Sort?",
        options: ["Large Scale Data", "Least Significant Digit", "Linear Sorting Digits", "Last Sorted Digit"],
        correctAnswer: 1,
        explanation: "LSD stands for Least Significant Digit. LSD radix sort processes digits from right to left (least significant to most significant), which is the most common variant."
      },
      {
        question: "Why must the subroutine used in radix sort be stable?",
        options: ["For better performance", "To maintain relative order of equal elements", "To reduce memory usage", "To handle negative numbers"],
        correctAnswer: 1,
        explanation: "The subroutine (usually counting sort) must be stable to preserve the relative order established by previous digit positions. Without stability, the final result would be incorrect."
      },
      {
        question: "When is radix sort more efficient than comparison-based sorts?",
        options: ["Always", "When the number of digits is small relative to array size", "When array is already sorted", "When dealing with floating-point numbers"],
        correctAnswer: 1,
        explanation: "Radix sort is more efficient when the number of digits (d) is small relative to the array size (n), making O(d × n) better than O(n log n). When d is large, comparison-based sorts may be faster."
      }
    ]
  },
"@

# Replace Radix Sort content
$content = $content -replace [regex]::Escape($radixOld), $radixNew

Write-Host "Enhanced Radix Sort!"

# Write back to file
$content | Set-Content $filePath -Encoding UTF8

Write-Host "Successfully enhanced Radix Sort with all components!"
