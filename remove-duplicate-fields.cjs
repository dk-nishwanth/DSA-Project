const fs = require('fs');

let content = fs.readFileSync('src/data/dsaTopics.ts', 'utf8');

let totalRemoved = 0;

// Remove duplicate example fields (handle multiline)
for (let i = 0; i < 10; i++) {
  const beforeLength = content.length;
  content = content.replace(/(example:\s*`[\s\S]*?`,)\s*example:\s*`[\s\S]*?`,/, '$1');
  if (content.length === beforeLength) break;
  totalRemoved++;
}

// Remove duplicate syntax fields (handle multiline)
for (let i = 0; i < 10; i++) {
  const beforeLength = content.length;
  content = content.replace(/(syntax:\s*`[\s\S]*?`,)\s*syntax:\s*`[\s\S]*?`,/, '$1');
  if (content.length === beforeLength) break;
  totalRemoved++;
}

console.log(`✅ Removed ${totalRemoved} duplicate fields`);

fs.writeFileSync('src/data/dsaTopics.ts', content, 'utf8');
console.log('✅ Done!');
