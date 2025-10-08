import fs from 'fs';

const content = fs.readFileSync('src/data/dsaTopics.ts', 'utf8');

// Remove all _alt properties by finding and removing the entire property
// These patterns match: voiceExplanation_alt, syntax_alt, extendedDefinition_alt, etc.

let fixed = content;

// Pattern to match any property ending with _alt and its value (including multiline)
// Match: propertyName_alt: `...`,
const altPropertyPattern = /\s+\w+_alt:\s*`[^`]*(?:`[^`]*`[^`]*)*`,?\n/g;

fixed = fixed.replace(altPropertyPattern, '');

// Also handle cases where the value might be a string with quotes
const altPropertyPattern2 = /\s+\w+_alt:\s*"(?:[^"\\]|\\.)*",?\n/g;
fixed = fixed.replace(altPropertyPattern2, '');

// Handle cases where the value might be a simple value
const altPropertyPattern3 = /\s+\w+_alt:\s*[^,\n]+,?\n/g;
fixed = fixed.replace(altPropertyPattern3, '');

fs.writeFileSync('src/data/dsaTopics.ts', fixed, 'utf8');

console.log('Removed all _alt properties');
