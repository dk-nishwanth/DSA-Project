const fs = require('fs');

console.log('Checking Mathematical Algorithms topics for example and syntax...\n');

const content = fs.readFileSync('src/data/dsaTopics.ts', 'utf8');

// Find all Mathematical Algorithms topics
const mathTopics = [
  'mathematical-algorithms-intro',
  'number-theory-basics', 
  'prime-algorithms',
  'fast-exponentiation',
  'modular-arithmetic',
  'combinatorics',
  'fibonacci-algorithms'
];

console.log('Mathematical Algorithms Topics Status:\n');

mathTopics.forEach(topicId => {
  // Find the topic block
  const topicRegex = new RegExp(`id:\\s*['"]${topicId}['"][\\s\\S]*?(?=\\n\\s*},?\\s*\\n\\s*{\\s*id:|\\n\\s*];)`, 'g');
  const topicBlock = content.match(topicRegex);
  
  if (topicBlock && topicBlock[0]) {
    const block = topicBlock[0];
    
    const hasExample = block.includes('example:');
    const hasSyntax = block.includes('syntax:');
    
    const exampleStatus = hasExample ? '✅' : '❌';
    const syntaxStatus = hasSyntax ? '✅' : '❌';
    
    console.log(`${topicId}:`);
    console.log(`  Example: ${exampleStatus}`);
    console.log(`  Syntax:  ${syntaxStatus}`);
    console.log('');
  } else {
    console.log(`❌ Could not find topic: ${topicId}`);
  }
});

console.log('=== SUMMARY ===');
let completeCount = 0;
mathTopics.forEach(topicId => {
  const topicRegex = new RegExp(`id:\\s*['"]${topicId}['"][\\s\\S]*?(?=\\n\\s*},?\\s*\\n\\s*{\\s*id:|\\n\\s*];)`, 'g');
  const topicBlock = content.match(topicRegex);
  
  if (topicBlock && topicBlock[0]) {
    const block = topicBlock[0];
    const hasExample = block.includes('example:');
    const hasSyntax = block.includes('syntax:');
    
    if (hasExample && hasSyntax) {
      completeCount++;
    }
  }
});

console.log(`Complete topics: ${completeCount}/${mathTopics.length}`);
if (completeCount === mathTopics.length) {
  console.log('🎉 All Mathematical Algorithms topics have both example and syntax!');
} else {
  console.log(`⚠️  ${mathTopics.length - completeCount} topics still need work`);
}
