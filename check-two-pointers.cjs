const fs = require('fs');

const content = fs.readFileSync('src/data/dsaTopics.ts', 'utf8');

const topics = [
  'two-pointers-intro',
  'two-sum',
  'three-sum',
  'container-water',
  'remove-duplicates',
  'palindrome-check',
  'merge-sorted-arrays'
];

console.log('=== Two Pointers Topics Status ===\n');

let allComplete = true;

topics.forEach(topicId => {
  const topicPattern = new RegExp(`id:\\s*['"]${topicId}['"]`);
  const startIdx = content.search(topicPattern);
  
  if (startIdx === -1) {
    console.log(`❌ ${topicId}: NOT FOUND`);
    allComplete = false;
    return;
  }
  
  const topicChunk = content.substring(startIdx, startIdx + 5000);
  
  const hasExample = /example:\s*`/.test(topicChunk);
  const hasSyntax = /syntax:\s*`/.test(topicChunk);
  
  if (hasExample && hasSyntax) {
    console.log(`✅ ${topicId}`);
  } else {
    console.log(`❌ ${topicId}`);
    if (!hasExample) console.log(`   - Missing example`);
    if (!hasSyntax) console.log(`   - Missing syntax`);
    allComplete = false;
  }
});

console.log('\n' + '='.repeat(60));
if (allComplete) {
  console.log('🎉 All Two Pointers topics have both example and syntax!');
} else {
  console.log('⚠️  Some topics are missing fields');
}
console.log('='.repeat(60));
