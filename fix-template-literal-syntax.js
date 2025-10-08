import fs from 'fs';

// Read the file
const content = fs.readFileSync('src/data/dsaTopics.ts', 'utf8');

// The issue is that implementationCode sections contain template literals with backticks
// which conflict with the outer template literal syntax
// We need to escape backticks inside implementationCode sections

// Strategy: Find all implementationCode: ` ... ` blocks and escape internal backticks

let fixed = content;

// Pattern to match implementationCode blocks
// This regex finds implementationCode: followed by a backtick, captures content until the next unescaped backtick
const implementationCodePattern = /(implementationCode:\s*`)([\s\S]*?)(`\s*,)/g;

let match;
let offset = 0;
const matches = [];

// First, collect all matches
const tempContent = content;
while ((match = implementationCodePattern.exec(tempContent)) !== null) {
  matches.push({
    start: match.index,
    end: match.index + match[0].length,
    prefix: match[1],
    content: match[2],
    suffix: match[3]
  });
}

console.log(`Found ${matches.length} implementationCode blocks`);

// Process from end to start to maintain indices
for (let i = matches.length - 1; i >= 0; i--) {
  const m = matches[i];
  
  // Escape backticks in the content
  // But be careful not to escape already escaped backticks
  let escapedContent = m.content.replace(/(?<!\\)`/g, '\\`');
  
  // Also escape ${} expressions
  escapedContent = escapedContent.replace(/(?<!\\)\$\{/g, '\\${');
  
  const replacement = m.prefix + escapedContent + m.suffix;
  
  fixed = fixed.substring(0, m.start) + replacement + fixed.substring(m.end);
}

// Also fix pseudocode blocks
const pseudocodePattern = /(pseudocode:\s*`)([\s\S]*?)(`\s*,)/g;
const pseudoMatches = [];

while ((match = pseudocodePattern.exec(content)) !== null) {
  pseudoMatches.push({
    start: match.index,
    end: match.index + match[0].length,
    prefix: match[1],
    content: match[2],
    suffix: match[3]
  });
}

console.log(`Found ${pseudoMatches.length} pseudocode blocks`);

for (let i = pseudoMatches.length - 1; i >= 0; i--) {
  const m = pseudoMatches[i];
  let escapedContent = m.content.replace(/(?<!\\)`/g, '\\`');
  escapedContent = escapedContent.replace(/(?<!\\)\$\{/g, '\\${');
  const replacement = m.prefix + escapedContent + m.suffix;
  fixed = fixed.substring(0, m.start) + replacement + fixed.substring(m.end);
}

// Write the fixed content
fs.writeFileSync('src/data/dsaTopics.ts', fixed, 'utf8');

console.log('Fixed template literal syntax issues');
