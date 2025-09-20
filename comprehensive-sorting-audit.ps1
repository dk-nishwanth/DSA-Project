# Comprehensive Sorting Algorithm Audit Script

$filePath = "c:\DSA\DSA-Project\src\data\dsaTopics.ts"
$content = Get-Content $filePath -Raw

Write-Host "🔍 COMPREHENSIVE SORTING ALGORITHM AUDIT" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

$sortingAlgorithms = @(
    @{ id = 'bubble-sort'; name = 'Bubble Sort' },
    @{ id = 'merge-sort'; name = 'Merge Sort' },
    @{ id = 'quick-sort'; name = 'Quick Sort' },
    @{ id = 'heap-sort'; name = 'Heap Sort' },
    @{ id = 'insertion-sort'; name = 'Insertion Sort' },
    @{ id = 'selection-sort'; name = 'Selection Sort' },
    @{ id = 'counting-sort'; name = 'Counting Sort' },
    @{ id = 'radix-sort'; name = 'Radix Sort' },
    @{ id = 'bucket-sort'; name = 'Bucket Sort' }
)

$requiredComponents = @(
    @{ name = 'extendedDefinition'; description = 'Extended Definition' },
    @{ name = 'voiceExplanation'; description = 'Voice Explanation' },
    @{ name = 'realWorldApplications'; description = 'Real World Applications' },
    @{ name = 'keyConcepts'; description = 'Key Concepts' },
    @{ name = 'pseudocode'; description = 'Pseudocode' },
    @{ name = 'implementationCode'; description = 'Implementation Code' },
    @{ name = 'quizQuestions'; description = 'Quiz Questions' }
)

$auditResults = @{}
$totalComplete = 0
$totalComponents = 0

foreach ($algorithm in $sortingAlgorithms) {
    Write-Host "`n📊 AUDITING: $($algorithm.name)" -ForegroundColor Yellow
    Write-Host "ID: $($algorithm.id)" -ForegroundColor Gray
    
    # Find algorithm section
    $algorithmStart = $content.IndexOf("id: '$($algorithm.id)'")
    if ($algorithmStart -eq -1) {
        Write-Host "❌ CRITICAL: Algorithm not found in file!" -ForegroundColor Red
        continue
    }
    
    # Find next algorithm or section boundary
    $nextAlgorithmStart = [int]::MaxValue
    foreach ($nextAlg in $sortingAlgorithms) {
        if ($nextAlg.id -ne $algorithm.id) {
            $nextIndex = $content.IndexOf("id: '$($nextAlg.id)'", $algorithmStart + 1)
            if ($nextIndex -gt $algorithmStart -and $nextIndex -lt $nextAlgorithmStart) {
                $nextAlgorithmStart = $nextIndex
            }
        }
    }
    
    # Check for section boundaries
    $searchingSection = $content.IndexOf("// Searching", $algorithmStart)
    if ($searchingSection -gt $algorithmStart -and $searchingSection -lt $nextAlgorithmStart) {
        $nextAlgorithmStart = $searchingSection
    }
    
    # Extract algorithm section
    if ($nextAlgorithmStart -eq [int]::MaxValue) {
        $algorithmSection = $content.Substring($algorithmStart)
    } else {
        $algorithmSection = $content.Substring($algorithmStart, $nextAlgorithmStart - $algorithmStart)
    }
    
    # Check each component
    $componentResults = @{}
    $algorithmComplete = $true
    $componentCount = 0
    
    foreach ($component in $requiredComponents) {
        $totalComponents++
        $componentCount++
        
        # Check if component exists
        $hasComponent = $algorithmSection.Contains("$($component.name):")
        $componentResults[$component.name] = $hasComponent
        
        if ($hasComponent) {
            Write-Host "    ✅ $($component.description)" -ForegroundColor Green
            
            # Check component quality
            $componentStart = $algorithmSection.IndexOf("$($component.name):")
            $componentEnd = $algorithmSection.IndexOf("},", $componentStart)
            if ($componentEnd -eq -1) {
                $componentEnd = $algorithmSection.IndexOf("}", $componentStart)
            }
            
            if ($componentEnd -gt $componentStart) {
                $componentContent = $algorithmSection.Substring($componentStart, $componentEnd - $componentStart)
                $contentLength = $componentContent.Length
                
                # Quality indicators
                if ($contentLength -gt 500) {
                    Write-Host "        📊 Content: Comprehensive ($contentLength chars)" -ForegroundColor Green
                } elseif ($contentLength -gt 200) {
                    Write-Host "        📊 Content: Adequate ($contentLength chars)" -ForegroundColor Yellow
                } else {
                    Write-Host "        📊 Content: Minimal ($contentLength chars)" -ForegroundColor Red
                }
                
                # Check for specific quality markers
                if ($component.name -eq 'voiceExplanation' -and $componentContent.Contains('Imagine')) {
                    Write-Host "        🎯 Quality: Contains analogy" -ForegroundColor Green
                }
                if ($component.name -eq 'implementationCode' -and $componentContent.Contains('class')) {
                    Write-Host "        🎯 Quality: Contains class implementation" -ForegroundColor Green
                }
                if ($component.name -eq 'quizQuestions' -and $componentContent.Contains('correctAnswer')) {
                    Write-Host "        🎯 Quality: Contains structured quiz" -ForegroundColor Green
                }
            }
        } else {
            Write-Host "    ❌ $($component.description)" -ForegroundColor Red
            $algorithmComplete = $false
        }
    }
    
    # Store results
    $auditResults[$algorithm.id] = @{
        'name' = $algorithm.name
        'complete' = $algorithmComplete
        'components' = $componentResults
        'componentCount' = $componentCount
    }
    
    # Summary for this algorithm
    $completedComponents = ($componentResults.Values | Where-Object { $_ -eq $true }).Count
    $completionPercentage = [math]::Round(($completedComponents / $requiredComponents.Count) * 100, 1)
    
    Write-Host "    📈 Completion: $completedComponents/$($requiredComponents.Count) ($completionPercentage%)" -ForegroundColor $(if ($algorithmComplete) { 'Green' } else { 'Yellow' })
    
    if ($algorithmComplete) {
        Write-Host "    🎉 STATUS: PRODUCTION READY" -ForegroundColor Green
        $totalComplete++
    } else {
        Write-Host "    ⚠️  STATUS: NEEDS ENHANCEMENT" -ForegroundColor Red
    }
}

# Final Summary
Write-Host "`n" + ("=" * 50) -ForegroundColor Cyan
Write-Host "📈 FINAL AUDIT SUMMARY" -ForegroundColor Cyan
Write-Host ("=" * 50) -ForegroundColor Cyan

Write-Host "`n🎯 OVERALL METRICS:" -ForegroundColor White
Write-Host "Total Algorithms Audited: $($sortingAlgorithms.Count)" -ForegroundColor White
Write-Host "Production Ready: $totalComplete" -ForegroundColor Green
Write-Host "Need Enhancement: $($sortingAlgorithms.Count - $totalComplete)" -ForegroundColor Red
Write-Host "Overall Completion: $([math]::Round(($totalComplete / $sortingAlgorithms.Count) * 100, 1))%" -ForegroundColor Yellow

# Detailed breakdown
Write-Host "`n📊 COMPONENT BREAKDOWN:" -ForegroundColor White
foreach ($component in $requiredComponents) {
    $componentCount = 0
    foreach ($algorithm in $sortingAlgorithms) {
        if ($auditResults[$algorithm.id].components[$component.name]) {
            $componentCount++
        }
    }
    $componentPercentage = [math]::Round(($componentCount / $sortingAlgorithms.Count) * 100, 1)
    Write-Host "$($component.description): $componentCount/$($sortingAlgorithms.Count) ($componentPercentage%)" -ForegroundColor $(if ($componentCount -eq $sortingAlgorithms.Count) { 'Green' } else { 'Yellow' })
}

# Missing components
Write-Host "`n❌ MISSING COMPONENTS:" -ForegroundColor Red
$hasMissing = $false
foreach ($algorithm in $sortingAlgorithms) {
    $missing = @()
    foreach ($component in $requiredComponents) {
        if (-not $auditResults[$algorithm.id].components[$component.name]) {
            $missing += $component.description
        }
    }
    if ($missing.Count -gt 0) {
        $hasMissing = $true
        Write-Host "$($algorithm.name):" -ForegroundColor Red
        foreach ($miss in $missing) {
            Write-Host "    - $miss" -ForegroundColor Red
        }
    }
}

if (-not $hasMissing) {
    Write-Host "🎊 NO MISSING COMPONENTS - ALL ALGORITHMS COMPLETE!" -ForegroundColor Green
}

# Visualizer check
Write-Host "`n🎮 VISUALIZER AVAILABILITY:" -ForegroundColor White
$visualizerPath = "c:\DSA\DSA-Project\src\components\visualizer"
$sortingVisualizers = @(
    'bubble-sort-visualizer.tsx',
    'merge-sort-visualizer.tsx',
    'quick-sort-visualizer.tsx',
    'heap-sort-visualizer.tsx',
    'insertion-sort-visualizer.tsx',
    'selection-sort-visualizer.tsx',
    'enhanced-array-visualizer.tsx'
)

foreach ($visualizer in $sortingVisualizers) {
    $visualizerFile = Join-Path $visualizerPath $visualizer
    if (Test-Path $visualizerFile) {
        Write-Host "✅ $visualizer" -ForegroundColor Green
    } else {
        Write-Host "❌ $visualizer" -ForegroundColor Red
    }
}

Write-Host "`n" + ("=" * 50) -ForegroundColor Cyan
if ($totalComplete -eq $sortingAlgorithms.Count) {
    Write-Host "🏆 AUDIT RESULT: ALL SORTING ALGORITHMS ARE PRODUCTION READY!" -ForegroundColor Green
} else {
    Write-Host "⚠️  AUDIT RESULT: $($sortingAlgorithms.Count - $totalComplete) ALGORITHMS NEED ENHANCEMENT" -ForegroundColor Yellow
}
Write-Host ("=" * 50) -ForegroundColor Cyan
