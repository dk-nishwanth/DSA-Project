# PowerShell script to verify all sorting algorithms are complete

$filePath = "c:\DSA\DSA-Project\src\data\dsaTopics.ts"
$content = Get-Content $filePath -Raw

Write-Host "🔍 VERIFYING SORTING ALGORITHMS COMPLETION..." -ForegroundColor Cyan
Write-Host ("=" * 60)

$sortingAlgorithms = @(
    'bubble-sort',
    'merge-sort', 
    'quick-sort',
    'heap-sort',
    'insertion-sort',
    'selection-sort',
    'counting-sort',
    'radix-sort',
    'bucket-sort'
)

$requiredComponents = @(
    'extendedDefinition',
    'voiceExplanation',
    'realWorldApplications',
    'keyConcepts', 
    'pseudocode',
    'implementationCode',
    'quizQuestions'
)

$completionStatus = @{}
$totalComplete = 0

foreach ($algorithm in $sortingAlgorithms) {
    Write-Host "📊 Checking: $algorithm" -ForegroundColor Yellow
    
    # Find the algorithm section
    $algorithmStart = $content.IndexOf("id: '$algorithm'")
    if ($algorithmStart -eq -1) {
        Write-Host "  ❌ Algorithm not found!" -ForegroundColor Red
        continue
    }
    
    # Find the next algorithm or end of section
    $nextAlgorithmIndex = [int]::MaxValue
    foreach ($nextAlg in $sortingAlgorithms) {
        if ($nextAlg -ne $algorithm) {
            $nextIndex = $content.IndexOf("id: '$nextAlg'", $algorithmStart + 1)
            if ($nextIndex -gt $algorithmStart -and $nextIndex -lt $nextAlgorithmIndex) {
                $nextAlgorithmIndex = $nextIndex
            }
        }
    }
    
    # Also check for other sections
    $searchingStart = $content.IndexOf("// Searching", $algorithmStart)
    if ($searchingStart -gt $algorithmStart -and $searchingStart -lt $nextAlgorithmIndex) {
        $nextAlgorithmIndex = $searchingStart
    }
    
    if ($nextAlgorithmIndex -eq [int]::MaxValue) {
        $algorithmSection = $content.Substring($algorithmStart)
    } else {
        $algorithmSection = $content.Substring($algorithmStart, $nextAlgorithmIndex - $algorithmStart)
    }
    
    # Check each required component
    $componentStatus = @{}
    $algorithmComplete = $true
    
    foreach ($component in $requiredComponents) {
        $hasComponent = $algorithmSection.Contains("$component" + ":")
        $componentStatus[$component] = $hasComponent
        
        if ($hasComponent) {
            Write-Host "    ✅ $component" -ForegroundColor Green
        } else {
            Write-Host "    ❌ $component" -ForegroundColor Red
            $algorithmComplete = $false
        }
    }
    
    $completionStatus[$algorithm] = @{
        'complete' = $algorithmComplete
        'components' = $componentStatus
    }
    
    if ($algorithmComplete) {
        Write-Host "  🎉 COMPLETE!" -ForegroundColor Green
        $totalComplete++
    } else {
        Write-Host "  ⚠️  INCOMPLETE" -ForegroundColor Red
    }
    
    Write-Host ""
}

Write-Host ("=" * 60)
Write-Host "📈 FINAL SUMMARY:" -ForegroundColor Cyan
Write-Host "Total Algorithms: $($sortingAlgorithms.Count)"
Write-Host "Complete Algorithms: $totalComplete" -ForegroundColor Green
Write-Host "Incomplete Algorithms: $($sortingAlgorithms.Count - $totalComplete)" -ForegroundColor Red
Write-Host "Completion Percentage: $([math]::Round(($totalComplete / $sortingAlgorithms.Count) * 100, 1))%" -ForegroundColor Yellow

if ($totalComplete -eq $sortingAlgorithms.Count) {
    Write-Host ""
    Write-Host "🎊 ALL SORTING ALGORITHMS ARE PRODUCTION-READY! 🎊" -ForegroundColor Green
    Write-Host "✨ The Sorting section is 100% complete! ✨" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "⚠️  Some algorithms still need enhancement" -ForegroundColor Yellow
    
    foreach ($algorithm in $sortingAlgorithms) {
        if (-not $completionStatus[$algorithm].complete) {
            Write-Host "❌ $algorithm needs:" -ForegroundColor Red
            foreach ($component in $requiredComponents) {
                if (-not $completionStatus[$algorithm].components[$component]) {
                    Write-Host "    - $component" -ForegroundColor Red
                }
            }
        }
    }
}

Write-Host ("=" * 60)
