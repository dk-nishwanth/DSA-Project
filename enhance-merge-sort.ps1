# PowerShell script to enhance Merge Sort topic

$filePath = "c:\DSA\DSA-Project\src\data\dsaTopics.ts"
$content = Get-Content $filePath -Raw

# Add quizQuestions to Merge Sort
$mergeOld = @"
console.log("Sorted:", mergeSort(numbers)); // [11, 12, 22, 25, 34, 64, 90]`
  },
  {
    id: 'quick-sort',
"@

$mergeNew = @"
console.log("Sorted:", mergeSort(numbers)); // [11, 12, 22, 25, 34, 64, 90]`,
    quizQuestions: [
      {
        question: "What is the time complexity of merge sort in all cases?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(2^n)"],
        correctAnswer: 1,
        explanation: "Merge sort consistently performs in O(n log n) time in best, average, and worst cases due to its divide-and-conquer approach that always splits the array in half."
      },
      {
        question: "What is the main advantage of merge sort over quick sort?",
        options: ["Uses less memory", "Faster average performance", "Guaranteed O(n log n) performance", "In-place sorting"],
        correctAnswer: 2,
        explanation: "Merge sort guarantees O(n log n) performance in all cases, while quick sort can degrade to O(n²) in worst-case scenarios, making merge sort more predictable."
      },
      {
        question: "What is the space complexity of the standard merge sort algorithm?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctAnswer: 2,
        explanation: "Merge sort requires O(n) auxiliary space for the temporary arrays used during the merge process, making it not an in-place sorting algorithm."
      },
      {
        question: "Is merge sort a stable sorting algorithm?",
        options: ["Yes, it maintains relative order of equal elements", "No, it changes relative order of equal elements", "Only in the recursive version", "Only when implemented iteratively"],
        correctAnswer: 0,
        explanation: "Merge sort is stable because during the merge process, when two elements are equal, it consistently takes from the left array first, preserving the original relative order."
      },
      {
        question: "Which approach does merge sort use to solve the sorting problem?",
        options: ["Greedy approach", "Dynamic programming", "Divide and conquer", "Backtracking"],
        correctAnswer: 2,
        explanation: "Merge sort uses the divide-and-conquer approach: it divides the array into smaller subarrays, recursively sorts them, and then merges the sorted subarrays back together."
      }
    ]
  },
  {
    id: 'quick-sort',
"@

# Replace Merge Sort content
$content = $content -replace [regex]::Escape($mergeOld), $mergeNew

# Write back to file
$content | Set-Content $filePath -Encoding UTF8

Write-Host "Successfully enhanced Merge Sort with quizQuestions!"
