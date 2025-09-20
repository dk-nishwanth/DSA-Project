# PowerShell script to enhance remaining sorting algorithms

$filePath = "c:\DSA\DSA-Project\src\data\dsaTopics.ts"
$content = Get-Content $filePath -Raw

# 1. Add quizQuestions to Quick Sort
$quickOld = @"
console.log("Sorted:", quickSort([...numbers])); // [11, 12, 22, 25, 34, 64, 90]`
  },
  {
    id: 'heap-sort',
"@

$quickNew = @"
console.log("Sorted:", quickSort([...numbers])); // [11, 12, 22, 25, 34, 64, 90]`,
    quizQuestions: [
      {
        question: "What is the average time complexity of Quick Sort?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
        correctAnswer: 1,
        explanation: "Quick Sort has an average time complexity of O(n log n) when the pivot divides the array into roughly equal halves, which happens on average with random data."
      },
      {
        question: "What causes Quick Sort's worst-case O(n²) performance?",
        options: ["Random pivot selection", "Balanced partitions", "Consistently poor pivot choices", "Large array size"],
        correctAnswer: 2,
        explanation: "Quick Sort degrades to O(n²) when the pivot is consistently the smallest or largest element, creating highly unbalanced partitions where one side has n-1 elements."
      },
      {
        question: "Which pivot selection strategy helps avoid worst-case performance?",
        options: ["Always choose first element", "Always choose last element", "Random selection or median-of-three", "Choose middle element"],
        correctAnswer: 2,
        explanation: "Random pivot selection or median-of-three strategy helps avoid worst-case scenarios by reducing the probability of consistently poor pivot choices."
      },
      {
        question: "Is Quick Sort a stable sorting algorithm?",
        options: ["Yes, it maintains relative order", "No, it can change relative order", "Only with specific implementations", "Only for small arrays"],
        correctAnswer: 1,
        explanation: "Quick Sort is not stable because the partitioning process can move equal elements past each other, changing their relative order from the original array."
      },
      {
        question: "What is the space complexity of Quick Sort?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctAnswer: 1,
        explanation: "Quick Sort has O(log n) space complexity due to the recursion stack. In the worst case, it can be O(n), but average case is O(log n) for balanced partitions."
      }
    ]
  },
  {
    id: 'heap-sort',
"@

# Replace Quick Sort content
$content = $content -replace [regex]::Escape($quickOld), $quickNew

Write-Host "Enhanced Quick Sort with quizQuestions!"

# 2. Check and enhance Heap Sort - let's see what it has first
$heapSortStart = $content.IndexOf("id: 'heap-sort'")
$heapSortEnd = $content.IndexOf("id: 'insertion-sort'", $heapSortStart)
$heapSortSection = $content.Substring($heapSortStart, $heapSortEnd - $heapSortStart)

# Check if Heap Sort has all components
$hasVoiceExplanation = $heapSortSection.Contains("voiceExplanation:")
$hasRealWorldApplications = $heapSortSection.Contains("realWorldApplications:")
$hasKeyConcepts = $heapSortSection.Contains("keyConcepts:")
$hasPseudocode = $heapSortSection.Contains("pseudocode:")
$hasImplementationCode = $heapSortSection.Contains("implementationCode:")
$hasQuizQuestions = $heapSortSection.Contains("quizQuestions:")

Write-Host "Heap Sort status:"
Write-Host "  voiceExplanation: $hasVoiceExplanation"
Write-Host "  realWorldApplications: $hasRealWorldApplications"
Write-Host "  keyConcepts: $hasKeyConcepts"
Write-Host "  pseudocode: $hasPseudocode"
Write-Host "  implementationCode: $hasImplementationCode"
Write-Host "  quizQuestions: $hasQuizQuestions"

# Write back to file
$content | Set-Content $filePath -Encoding UTF8

Write-Host "Successfully enhanced Quick Sort!"
