const fs = require('fs');

let content = fs.readFileSync('src/data/dsaTopics.ts', 'utf8');

// Remove syntax_alt and syntax_alt2 fields from bit manipulation topics
// These are now replaced with proper syntax fields

// Pattern: Find syntax_alt: ` ... `, and remove it
const pattern1 = /,\s*syntax_alt: `[\s\S]*?`,/g;
const pattern2 = /,\s*syntax_alt2: `[\s\S]*?`,/g;

let count1 = 0;
let count2 = 0;

content = content.replace(pattern1, () => {
  count1++;
  return '';
});

content = content.replace(pattern2, () => {
  count2++;
  return '';
});

console.log(`✅ Removed ${count1} syntax_alt fields`);
console.log(`✅ Removed ${count2} syntax_alt2 fields`);

fs.writeFileSync('src/data/dsaTopics.ts', content, 'utf8');
console.log('\n✅ Done!');
