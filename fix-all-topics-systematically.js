import fs from 'fs';

const auditReport = JSON.parse(fs.readFileSync('audit-report.json', 'utf8'));

// Priority topics that need the most work
const priorityTopics = [
    'linked-list-singly',
    'linked-list-circular',
    'binary-tree',
    'heap-operations',
    'graph-bfs',
    'bellman-ford',
    'floyd-warshall',
    'kruskal-algorithm',
    'prim-algorithm',
    'topological-sort',
    'hash-chaining',
    'open-addressing',
    'tail-recursion',
    'fibonacci',
    'huffman-coding',
    'fractional-knapsack',
    'n-queens',
    'sudoku-solver',
    'maze-solver',
    'trie',
    'palindrome-check'
];

console.log('=== SYSTEMATIC FIX PLAN ===\n');
console.log(`Total Issues: ${auditReport.summary.totalIssues}\n`);

console.log('Priority Topics to Fix (${priorityTopics.length}):\n');
priorityTopics.forEach((topic, i) => {
    console.log(`${i + 1}. ${topic}`);
});

console.log('\n\nIssue Breakdown:');
console.log(`- Missing Voice Explanations: ${auditReport.summary.missingVoiceExplanation}`);
console.log(`- Missing Real World Applications: ${auditReport.summary.missingRealWorldApplications}`);
console.log(`- Missing Key Concepts: ${auditReport.summary.missingKeyConcepts}`);
console.log(`- Missing Pseudocode: ${auditReport.summary.missingPseudocode}`);
console.log(`- Missing Implementation Code: ${auditReport.summary.missingImplementationCode}`);
console.log(`- Insufficient Quiz Questions (<5): ${auditReport.summary.insufficientQuizQuestions}`);

console.log('\n\n📝 RECOMMENDED APPROACH:');
console.log('1. Fix topics in batches of 5-10');
console.log('2. For each topic, add:');
console.log('   - Voice explanation (conversational, analogy-based)');
console.log('   - Real-world applications (industry use cases)');
console.log('   - Key concepts (essential principles)');
console.log('   - Pseudocode (step-by-step algorithm)');
console.log('   - Implementation code (production-ready)');
console.log('   - Quiz questions (minimum 5 per topic)');
console.log('\n3. Verify visualizers have voice explain function');
console.log('4. Ensure definition boxes follow consistent format');

// Save priority list
fs.writeFileSync('priority-fix-list.json', JSON.stringify({
    priorityTopics,
    auditSummary: auditReport.summary,
    timestamp: new Date().toISOString()
}, null, 2));

console.log('\n✅ Priority list saved to priority-fix-list.json');
