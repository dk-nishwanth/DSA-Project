# Simple sorting algorithm audit

$filePath = "c:\DSA\DSA-Project\src\data\dsaTopics.ts"
$content = Get-Content $filePath -Raw

Write-Host "SORTING ALGORITHMS AUDIT" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan

$algorithms = @('bubble-sort', 'merge-sort', 'quick-sort', 'heap-sort', 'insertion-sort', 'selection-sort', 'counting-sort', 'radix-sort', 'bucket-sort')
$components = @('extendedDefinition', 'voiceExplanation', 'realWorldApplications', 'keyConcepts', 'pseudocode', 'implementationCode', 'quizQuestions')

$results = @{}
$totalComplete = 0

foreach ($algorithm in $algorithms) {
    Write-Host "`nChecking: $algorithm" -ForegroundColor Yellow
    
    $algorithmStart = $content.IndexOf("id: '$algorithm'")
    if ($algorithmStart -eq -1) {
        Write-Host "  ERROR: Not found!" -ForegroundColor Red
        continue
    }
    
    # Find next algorithm boundary
    $nextStart = $content.Length
    foreach ($nextAlg in $algorithms) {
        if ($nextAlg -ne $algorithm) {
            $nextIndex = $content.IndexOf("id: '$nextAlg'", $algorithmStart + 1)
            if ($nextIndex -gt $algorithmStart -and $nextIndex -lt $nextStart) {
                $nextStart = $nextIndex
            }
        }
    }
    
    # Check for section boundary
    $searchingIndex = $content.IndexOf("// Searching", $algorithmStart)
    if ($searchingIndex -gt $algorithmStart -and $searchingIndex -lt $nextStart) {
        $nextStart = $searchingIndex
    }
    
    $algorithmSection = $content.Substring($algorithmStart, $nextStart - $algorithmStart)
    
    $componentResults = @{}
    $complete = $true
    
    foreach ($component in $components) {
        $hasComponent = $algorithmSection.Contains("$component" + ":")
        $componentResults[$component] = $hasComponent
        
        if ($hasComponent) {
            Write-Host "  ✓ $component" -ForegroundColor Green
        } else {
            Write-Host "  ✗ $component" -ForegroundColor Red
            $complete = $false
        }
    }
    
    $results[$algorithm] = @{
        'complete' = $complete
        'components' = $componentResults
    }
    
    if ($complete) {
        Write-Host "  STATUS: COMPLETE" -ForegroundColor Green
        $totalComplete++
    } else {
        Write-Host "  STATUS: INCOMPLETE" -ForegroundColor Red
    }
}

Write-Host "`n========================" -ForegroundColor Cyan
Write-Host "SUMMARY:" -ForegroundColor Cyan
Write-Host "Total: $($algorithms.Count)"
Write-Host "Complete: $totalComplete" -ForegroundColor Green
Write-Host "Incomplete: $($algorithms.Count - $totalComplete)" -ForegroundColor Red
Write-Host "Completion: $([math]::Round(($totalComplete / $algorithms.Count) * 100, 1))%"

Write-Host "`nMISSING COMPONENTS:" -ForegroundColor Red
foreach ($algorithm in $algorithms) {
    if (-not $results[$algorithm].complete) {
        Write-Host "$algorithm missing:" -ForegroundColor Red
        foreach ($component in $components) {
            if (-not $results[$algorithm].components[$component]) {
                Write-Host "  - $component" -ForegroundColor Red
            }
        }
    }
}

if ($totalComplete -eq $algorithms.Count) {
    Write-Host "`nSUCCESS: ALL ALGORITHMS COMPLETE!" -ForegroundColor Green
}
