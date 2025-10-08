const fs = require('fs');

const content = fs.readFileSync('src/data/dsaTopics.ts', 'utf8');

const topics = [
  'bit-basics',
  'count-set-bits',
  'power-of-two',
  'single-number',
  'bit-subset'
];

console.log('=== FINAL Bit Manipulation Check ===\n');

let allComplete = true;

topics.forEach(topicId => {
  const topicPattern = new RegExp(`id:\\s*['"]${topicId}['"]`);
  const startIdx = content.search(topicPattern);
  
  if (startIdx === -1) {
    console.log(`❌ ${topicId}: NOT FOUND`);
    allComplete = false;
    return;
  }
  
  // Get a larger chunk
  const topicChunk = content.substring(startIdx, startIdx + 8000);
  
  // Count occurrences
  const exampleMatches = topicChunk.match(/example:\s*`/g);
  const syntaxMatches = topicChunk.match(/syntax:\s*`/g);
  
  const exampleCount = exampleMatches ? exampleMatches.length : 0;
  const syntaxCount = syntaxMatches ? syntaxMatches.length : 0;
  
  if (exampleCount >= 1 && syntaxCount >= 1) {
    console.log(`✅ ${topicId} (${exampleCount} example, ${syntaxCount} syntax)`);
  } else {
    console.log(`❌ ${topicId}`);
    if (exampleCount === 0) console.log(`   - Missing example`);
    if (syntaxCount === 0) console.log(`   - Missing syntax`);
    allComplete = false;
  }
});

console.log('\n' + '='.repeat(60));
if (allComplete) {
  console.log('🎉 All Bit Manipulation topics have example and syntax!');
} else {
  console.log('⚠️  Some topics are missing fields');
}
console.log('='.repeat(60));
