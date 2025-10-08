const fs = require('fs');

let content = fs.readFileSync('src/data/dsaTopics.ts', 'utf8');

// For each bit manipulation topic, find and remove the long example field
// Keep only the short example that was added

const topics = [
  {
    id: 'count-set-bits',
    // Remove from after short example to before syntax field
    removePattern: /(\`,\n        example: `countSetBits\(7\) = 3.*?\n.*?\n.*?\`,)\n        example: `\/\/ Count Set Bits Implementation[\s\S]*?(\`,\n        syntax:)/
  },
  {
    id: 'power-of-two',
    removePattern: /(\`,\n        example: `isPowerOfTwo\(8\) = true.*?\n.*?\n.*?\n.*?\`,)\n        example: `\/\/ Power of Two Check[\s\S]*?(\`,\n        syntax:)/
  },
  {
    id: 'single-number',
    removePattern: /(\`,\n        example: `findSingle\(\[2,1,2,3,1\]\) = 3[\s\S]*?\`,)\n        example: `\/\/ Single Number Problem[\s\S]*?(\`,\n        syntax:)/
  },
  {
    id: 'bit-subset',
    removePattern: /(\`,\n        example: `generateSubsets\(\[1,2,3\]\) = [\s\S]*?\`,)\n        example: `\/\/ Generate All Subsets[\s\S]*?(\`,\n        syntax:)/
  }
];

// Try to remove duplicate examples
for (const topic of topics) {
  if (topic.removePattern && topic.removePattern.test(content)) {
    content = content.replace(topic.removePattern, '$1$2');
    console.log(`✅ Removed duplicate example from ${topic.id}`);
  } else {
    console.log(`⚠️  Could not find duplicate pattern for ${topic.id}`);
  }
}

fs.writeFileSync('src/data/dsaTopics.ts', content, 'utf8');
console.log('\n✅ Done removing duplicates!');
