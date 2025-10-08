const fs = require('fs');

console.log('Checking for topics missing example and syntax fields...\n');

const content = fs.readFileSync('src/data/dsaTopics.ts', 'utf8');

// Extract all topics
const topicMatches = content.match(/{\s*id:\s*['"]([^'"]+)['"]/g);
const topics = topicMatches ? topicMatches.map(m => m.match(/['"]([^'"]+)['"]/)[1]) : [];

console.log(`Total topics found: ${topics.length}\n`);

let missingExample = [];
let missingSyntax = [];

// For each topic, check if it has example and syntax
topics.forEach(topicId => {
  // Find the topic block
  const topicRegex = new RegExp(`id:\\s*['"]${topicId}['"][\\s\\S]*?(?=\\n\\s*},?\\s*\\n\\s*{\\s*id:|\\n\\s*];)`, 'g');
  const topicBlock = content.match(topicRegex);
  
  if (topicBlock && topicBlock[0]) {
    const block = topicBlock[0];
    
    // Check for example field
    if (!block.includes('example:')) {
      missingExample.push(topicId);
    }
    
    // Check for syntax field
    if (!block.includes('syntax:')) {
      missingSyntax.push(topicId);
    }
  }
});

console.log('=== TOPICS MISSING EXAMPLE FIELD ===');
if (missingExample.length === 0) {
  console.log('✅ All topics have example field!\n');
} else {
  console.log(`❌ Found ${missingExample.length} topics without example:\n`);
  missingExample.slice(0, 20).forEach(id => console.log(`  - ${id}`));
  if (missingExample.length > 20) {
    console.log(`  ... and ${missingExample.length - 20} more`);
  }
  console.log('');
}

console.log('=== TOPICS MISSING SYNTAX FIELD ===');
if (missingSyntax.length === 0) {
  console.log('✅ All topics have syntax field!\n');
} else {
  console.log(`❌ Found ${missingSyntax.length} topics without syntax:\n`);
  missingSyntax.slice(0, 20).forEach(id => console.log(`  - ${id}`));
  if (missingSyntax.length > 20) {
    console.log(`  ... and ${missingSyntax.length - 20} more`);
  }
  console.log('');
}

console.log('=== SUMMARY ===');
console.log(`Topics with example: ${topics.length - missingExample.length}/${topics.length}`);
console.log(`Topics with syntax: ${topics.length - missingSyntax.length}/${topics.length}`);

if (missingExample.length === 0 && missingSyntax.length === 0) {
  console.log('\n✅ ALL TOPICS HAVE BOTH EXAMPLE AND SYNTAX FIELDS!');
} else {
  console.log(`\n⚠️  Need to add ${missingExample.length} examples and ${missingSyntax.length} syntax fields`);
}
