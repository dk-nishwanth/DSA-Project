import fs from 'fs';

// Read the file
let content = fs.readFileSync('src/data/dsaTopics.ts', 'utf8');

console.log('Checking for syntax errors in dsaTopics.ts...');

// Check for unclosed template literals
const lines = content.split('\n');
let inTemplateString = false;
let templateStartLine = -1;
let errors = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for template literal start
    if (line.includes('extendedDefinition: `') && !inTemplateString) {
        inTemplateString = true;
        templateStartLine = i + 1;
    }
    
    // Check for template literal end
    if (inTemplateString && line.includes('`,')) {
        inTemplateString = false;
        templateStartLine = -1;
    }
    
    // Check for other property starts while in template string (indicates missing closing backtick)
    if (inTemplateString && (line.includes('voiceExplanation:') || line.includes('realWorldApplications:') || line.includes('keyConcepts:'))) {
        errors.push({
            line: templateStartLine,
            issue: `Template literal starting at line ${templateStartLine} is not properly closed`
        });
        inTemplateString = false;
        templateStartLine = -1;
    }
}

// Check if we ended with an unclosed template literal
if (inTemplateString) {
    errors.push({
        line: templateStartLine,
        issue: `Template literal starting at line ${templateStartLine} is not properly closed`
    });
}

console.log(`Found ${errors.length} syntax errors:`);
errors.forEach(error => {
    console.log(`Line ${error.line}: ${error.issue}`);
});

// Try to fix the first few errors
if (errors.length > 0) {
    console.log('\nAttempting to fix errors...');
    
    let fixedContent = content;
    let fixCount = 0;
    
    // Fix unclosed template literals by adding closing backticks
    errors.slice(0, 5).forEach(error => { // Fix first 5 errors
        const lineIndex = error.line - 1;
        const lines = fixedContent.split('\n');
        
        // Find the line where we need to add the closing backtick
        for (let i = lineIndex; i < lines.length; i++) {
            if (lines[i].includes('voiceExplanation:') || 
                lines[i].includes('realWorldApplications:') || 
                lines[i].includes('keyConcepts:') ||
                lines[i].includes('pseudocode:')) {
                
                // Insert closing backtick before this line
                lines.splice(i, 0, '        When to use: [needs completion]`,');
                fixedContent = lines.join('\n');
                fixCount++;
                console.log(`Fixed error at line ${error.line}`);
                break;
            }
        }
    });
    
    if (fixCount > 0) {
        fs.writeFileSync('src/data/dsaTopics.ts', fixedContent);
        console.log(`\n✅ Fixed ${fixCount} syntax errors. Try building again.`);
    }
} else {
    console.log('No obvious syntax errors found.');
}