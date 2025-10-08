const fs = require('fs');

let content = fs.readFileSync('src/data/dsaTopics.ts', 'utf8');

// For each bit manipulation topic, find and keep only the FIRST occurrence of example and syntax

const topics = ['bit-basics', 'count-set-bits', 'power-of-two', 'single-number', 'bit-subset'];

for (const topicId of topics) {
  // Find the topic
  const topicStart = content.search(new RegExp(`id:\\s*['"]${topicId}['"]`));
  if (topicStart === -1) continue;
  
  // Find the next topic or end
  const nextTopicPattern = /\n\s*},\s*\n\s*{\s*\n\s*id:/g;
  nextTopicPattern.lastIndex = topicStart + 100;
  const nextMatch = nextTopicPattern.exec(content);
  const topicEnd = nextMatch ? nextMatch.index : content.length;
  
  let topicContent = content.substring(topicStart, topicEnd);
  
  // Remove duplicate example fields (keep first)
  let exampleCount = 0;
  topicContent = topicContent.replace(/example:\s*`[\s\S]*?`,/g, (match) => {
    exampleCount++;
    return exampleCount === 1 ? match : '';
  });
  
  // Remove duplicate syntax fields (keep first)
  let syntaxCount = 0;
  topicContent = topicContent.replace(/syntax:\s*`[\s\S]*?`,/g, (match) => {
    syntaxCount++;
    return syntaxCount === 1 ? match : '';
  });
  
  content = content.substring(0, topicStart) + topicContent + content.substring(topicEnd);
  
  if (exampleCount > 1 || syntaxCount > 1) {
    console.log(`✅ Fixed ${topicId}: removed ${exampleCount - 1} duplicate examples, ${syntaxCount - 1} duplicate syntax`);
  }
}

fs.writeFileSync('src/data/dsaTopics.ts', content, 'utf8');
console.log('\n✅ Done!');
