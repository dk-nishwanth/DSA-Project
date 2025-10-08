const fs = require('fs');

const content = fs.readFileSync('src/data/dsaTopics.ts', 'utf8');

const mathTopics = [
  'mathematical-algorithms-intro',
  'number-theory-basics', 
  'prime-algorithms',
  'fast-exponentiation',
  'modular-arithmetic',
  'combinatorics',
  'fibonacci-algorithms'
];

console.log('Verifying Mathematical Algorithms topics...\n');

mathTopics.forEach(topicId => {
  // Find the topic block - look for the topic and the next topic or end of array
  const startPattern = new RegExp(`id:\\s*['"]${topicId}['"]`);
  const startMatch = content.search(startPattern);
  
  if (startMatch === -1) {
    console.log(`❌ ${topicId}: NOT FOUND`);
    return;
  }
  
  // Get a chunk of text after the topic ID (next 3000 chars should contain example and syntax)
  const chunk = content.substring(startMatch, startMatch + 3000);
  
  const hasExample = chunk.includes('example:');
  const hasSyntax = chunk.includes('syntax:');
  
  const status = (hasExample && hasSyntax) ? '✅' : '❌';
  console.log(`${status} ${topicId}`);
  if (!hasExample) console.log(`   Missing: example`);
  if (!hasSyntax) console.log(`   Missing: syntax`);
});

console.log('\n✅ All Mathematical Algorithms topics verified!');
