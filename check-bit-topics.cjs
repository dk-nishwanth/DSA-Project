const fs = require('fs');

const content = fs.readFileSync('src/data/dsaTopics.ts', 'utf8');

const bitTopics = [
  'bit-basics',
  'count-set-bits',
  'power-of-two',
  'single-number',
  'bit-subset'
];

console.log('=== Bit Manipulation Topics Status ===\n');

let allComplete = true;

bitTopics.forEach(topicId => {
  // Find topic start
  const topicPattern = new RegExp(`id:\\s*['"]${topicId}['"]`);
  const startIdx = content.search(topicPattern);
  
  if (startIdx === -1) {
    console.log(`❌ ${topicId}: NOT FOUND IN FILE`);
    allComplete = false;
    return;
  }
  
  // Get next 5000 characters (should contain the whole topic)
  const topicChunk = content.substring(startIdx, startIdx + 5000);
  
  // Check for example and syntax
  const hasExample = /example:\s*`/.test(topicChunk);
  const hasSyntax = /syntax:\s*`/.test(topicChunk);
  
  if (hasExample && hasSyntax) {
    console.log(`✅ ${topicId}`);
  } else {
    console.log(`❌ ${topicId}`);
    if (!hasExample) console.log(`   - Missing example field`);
    if (!hasSyntax) console.log(`   - Missing syntax field`);
    allComplete = false;
  }
});

console.log('\n' + '='.repeat(60));
if (allComplete) {
  console.log('🎉 SUCCESS! All Bit Manipulation topics have both example and syntax!');
} else {
  console.log('⚠️  Some topics are missing fields');
}
console.log('='.repeat(60));
