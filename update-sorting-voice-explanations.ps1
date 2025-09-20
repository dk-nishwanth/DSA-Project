# PowerShell script to update sorting voice explanations to match Arrays style

$filePath = "c:\DSA\DSA-Project\src\data\dsaTopics.ts"
$content = Get-Content $filePath -Raw

Write-Host "🎤 Updating Sorting Voice Explanations to Match Arrays Style..." -ForegroundColor Cyan

# 1. Update Bubble Sort voice explanation
$bubbleOld = @"
    voiceExplanation: `Think of bubble sort like organizing a line of people by height, but you can only compare and swap adjacent people! Imagine you're a teacher organizing students for a class photo. You start at the left end of the line and compare each pair of neighboring students. If the taller student is on the left, you ask them to swap places. You keep doing this, moving from left to right through the entire line. After one complete pass, you'll notice something magical - the tallest student has "bubbled up" to the rightmost position! Now you repeat the process, but since you know the tallest is already in place, you don't need to check the last position. Each pass guarantees that the next tallest student bubbles up to their correct spot. It's like watching bubbles rise to the surface of water - the biggest elements naturally float to the top (or in this case, the right side). The process continues until no more swaps are needed, meaning everyone is perfectly organized by height!`,
"@

$bubbleNew = @"
    voiceExplanation: `Bubble sort is like organizing books on a shelf by comparing only adjacent books. You start at the left and compare each pair of neighboring books. If the left book is bigger than the right one, you swap them. After one complete pass through all books, the largest book "bubbles up" to the rightmost position. You repeat this process, and each time, the next largest book finds its correct spot. It's called bubble sort because large elements bubble to the top, just like air bubbles rising in water. The algorithm is simple but slow for large collections.`,
"@

# 2. Update Merge Sort voice explanation  
$mergeOld = @"
    voiceExplanation: `Imagine you have a huge pile of papers to sort alphabetically, but it's too overwhelming to sort all at once. Merge sort uses a "divide and conquer" strategy - like asking friends to help. You split the pile in half, give each half to a friend, and ask them to sort their pile. But here's the clever part: your friends do the same thing! They split their piles in half and pass them on, until everyone has just one or two papers that are easy to sort. Then, the magic happens during the "merge" phase. People start combining their sorted mini-piles back together, always keeping them in order. Two sorted piles are easy to merge - just compare the top papers and take the smaller one. This process continues until you have one perfectly sorted pile. It's like a well-organized assembly line that guarantees the same speed no matter how messy the original pile was.`,
"@

$mergeNew = @"
    voiceExplanation: `Merge sort is like organizing a deck of cards using a divide-and-conquer approach. First, you split the deck into smaller and smaller piles until each pile has just one card. Then you merge these piles back together in sorted order. When merging two sorted piles, you simply compare the top cards and take the smaller one. This process continues until you have one perfectly sorted deck. Merge sort is reliable because it always takes the same amount of time, regardless of how shuffled the original deck was.`,
"@

# Apply replacements
$content = $content -replace [regex]::Escape($bubbleOld), $bubbleNew
$content = $content -replace [regex]::Escape($mergeOld), $mergeNew

Write-Host "✅ Updated Bubble Sort and Merge Sort voice explanations" -ForegroundColor Green

# Write back to file
$content | Set-Content $filePath -Encoding UTF8

Write-Host "🎤 Voice explanations updated to match Arrays style!" -ForegroundColor Green
