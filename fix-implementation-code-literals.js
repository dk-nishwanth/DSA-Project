import fs from 'fs';

// Read the file
const content = fs.readFileSync('src/data/dsaTopics.ts', 'utf8');

// The issue is that implementationCode uses template literals (backticks)
// which contain code examples that also use backticks and ${} expressions
// This creates nested template literal issues

// Strategy: Replace the backticks around implementationCode values with regular quotes
// and escape any quotes inside the content

let fixed = content;

// Find implementationCode: ` ... `, pattern
// We need to be careful to match the correct closing backtick
const regex = /implementationCode:\s*`([^`]*(?:`[^`]*`[^`]*)*)`\s*,/g;

// This is complex, so let's use a different approach:
// Find each implementationCode field and replace it line by line

// Split into lines for processing
const lines = content.split('\n');
const result = [];
let inImplementationCode = false;
let implementationBuffer = [];
let indentLevel = '';

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Check if we're starting an implementationCode block
  if (line.match(/implementationCode:\s*`\s*$/)) {
    inImplementationCode = true;
    // Extract indentation
    indentLevel = line.match(/^(\s*)/)[1];
    result.push(line.replace(/`\s*$/, '"'));
    continue;
  }
  
  // Check if we're ending an implementationCode block
  if (inImplementationCode && line.match(/^\s*`\s*,\s*$/)) {
    inImplementationCode = false;
    result.push(line.replace(/`/, '"'));
    continue;
  }
  
  // If we're inside implementationCode, escape any quotes
  if (inImplementationCode) {
    // Escape backslashes first, then quotes
    let processedLine = line.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    result.push(processedLine);
  } else {
    result.push(line);
  }
}

// Write the fixed content
fs.writeFileSync('src/data/dsaTopics.ts', result.join('\n'), 'utf8');

console.log('Fixed implementationCode template literals');
