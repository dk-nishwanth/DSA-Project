const fs = require('fs');

let content = fs.readFileSync('src/data/dsaTopics.ts', 'utf8');

// Find all instances where there are two example fields in a row
// Pattern: example: `...`, followed by whitespace, then another example: `...`,

const pattern = /(example: `[\s\S]*?`,)\s+(example: `[\s\S]*?`,)/g;

let matches = 0;
let lastContent = content;

while (true) {
  content = content.replace(pattern, (match, first, second) => {
    // Keep the first (short) example, remove the second (long) one
    matches++;
    return first;
  });
  
  // If no more changes, break
  if (content === lastContent) break;
  lastContent = content;
}

console.log(`✅ Removed ${matches} duplicate example fields`);

fs.writeFileSync('src/data/dsaTopics.ts', content, 'utf8');
console.log('✅ Done!');
