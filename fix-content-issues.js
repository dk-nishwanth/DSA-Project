import fs from 'fs';

console.log('=== FIXING CONTENT ISSUES ===\n');

const content = fs.readFileSync('src/data/dsaTopics.ts', 'utf-8');

// Find topics with issues
const issues = {
  missingDefinition: ['linked-list-circular', 'binary-tree'],
  missingExample: [],
  invalidComplexity: ['recursion-basics', 'dp-introduction', 'mathematical-algorithms-intro']
};

// Extract all topics with missing examples
const topicMatches = Array.from(content.matchAll(/\{[\s\S]*?id:\s*'([^']+)'[\s\S]*?\}/g));
topicMatches.forEach(match => {
  const topicBlock = match[0];
  const id = match[1];
  if (!topicBlock.includes('example:')) {
    issues.missingExample.push(id);
  }
});

console.log('Issues to fix:');
console.log(`- Missing definitions: ${issues.missingDefinition.length}`);
console.log(`- Missing examples: ${issues.missingExample.length}`);
console.log(`- Invalid complexity: ${issues.invalidComplexity.length}`);
console.log();

// Save the list for manual fixing
fs.writeFileSync('content-issues-list.json', JSON.stringify(issues, null, 2));
console.log('✅ Issues list saved to: content-issues-list.json\n');

console.log('Topics needing examples:');
issues.missingExample.forEach(id => console.log(`  - ${id}`));
