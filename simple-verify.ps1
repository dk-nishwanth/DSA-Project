# Simple verification script for sorting algorithms

$filePath = "c:\DSA\DSA-Project\src\data\dsaTopics.ts"
$content = Get-Content $filePath -Raw

Write-Host "Verifying Sorting Algorithms Completion..."
Write-Host "=========================================="

$algorithms = @('bubble-sort', 'merge-sort', 'quick-sort', 'heap-sort', 'insertion-sort', 'selection-sort', 'counting-sort', 'radix-sort', 'bucket-sort')
$components = @('extendedDefinition', 'voiceExplanation', 'realWorldApplications', 'keyConcepts', 'pseudocode', 'implementationCode', 'quizQuestions')

$totalComplete = 0

foreach ($algorithm in $algorithms) {
    Write-Host "Checking: $algorithm"
    
    $algorithmStart = $content.IndexOf("id: '$algorithm'")
    if ($algorithmStart -eq -1) {
        Write-Host "  ERROR: Algorithm not found!"
        continue
    }
    
    $nextStart = $content.IndexOf("id: '", $algorithmStart + 1)
    if ($nextStart -eq -1) {
        $algorithmSection = $content.Substring($algorithmStart)
    } else {
        $algorithmSection = $content.Substring($algorithmStart, $nextStart - $algorithmStart)
    }
    
    $complete = $true
    foreach ($component in $components) {
        $hasComponent = $algorithmSection.Contains("$component:")
        if ($hasComponent) {
            Write-Host "  ✓ $component"
        } else {
            Write-Host "  ✗ $component"
            $complete = $false
        }
    }
    
    if ($complete) {
        Write-Host "  STATUS: COMPLETE" -ForegroundColor Green
        $totalComplete++
    } else {
        Write-Host "  STATUS: INCOMPLETE" -ForegroundColor Red
    }
    
    Write-Host ""
}

Write-Host "=========================================="
Write-Host "SUMMARY:"
Write-Host "Total Algorithms: $($algorithms.Count)"
Write-Host "Complete: $totalComplete"
Write-Host "Incomplete: $($algorithms.Count - $totalComplete)"
Write-Host "Completion: $([math]::Round(($totalComplete / $algorithms.Count) * 100, 1))%"

if ($totalComplete -eq $algorithms.Count) {
    Write-Host ""
    Write-Host "SUCCESS: ALL SORTING ALGORITHMS ARE COMPLETE!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Some algorithms need more work." -ForegroundColor Yellow
}
