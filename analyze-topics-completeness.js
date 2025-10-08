import fs from 'fs';

// Read the dsaTopics.ts file
const content = fs.readFileSync('src/data/dsaTopics.ts', 'utf8');

// Extract topics using a more sophisticated approach
function extractTopics(content) {
    const topics = [];
    const lines = content.split('\n');
    let currentTopic = '';
    let braceCount = 0;
    let inTopic = false;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Check if this line starts a new topic
        if (line.trim().match(/^\s*{\s*$/) && i + 1 < lines.length && lines[i + 1].trim().match(/id:\s*'[^']+'/)) {
            inTopic = true;
            braceCount = 1;
            currentTopic = line + '\n';
            continue;
        }
        
        if (inTopic) {
            currentTopic += line + '\n';
            
            // Count braces to know when topic ends
            for (let char of line) {
                if (char === '{') braceCount++;
                if (char === '}') braceCount--;
            }
            
            // Topic is complete when braces are balanced
            if (braceCount === 0) {
                topics.push(currentTopic.trim());
                currentTopic = '';
                inTopic = false;
            }
        }
    }
    
    return topics;
}

const topicMatches = extractTopics(content);

if (!topicMatches) {
    console.log('No topics found');
    process.exit(1);
}

console.log(`Found ${topicMatches.length} topics to analyze\n`);

const issues = [];
let topicCount = 0;

topicMatches.forEach((topicText, index) => {
    topicCount++;
    
    // Extract topic ID
    const idMatch = topicText.match(/id:\s*'([^']+)'/);
    const titleMatch = topicText.match(/title:\s*'([^']+)'/);
    
    if (!idMatch || !titleMatch) return;
    
    const id = idMatch[1];
    const title = titleMatch[1];
    
    console.log(`\n${topicCount}. Analyzing: ${id} - ${title}`);
    
    const topicIssues = [];
    
    // Check for required fields
    const requiredFields = [
        'extendedDefinition',
        'voiceExplanation', 
        'realWorldApplications',
        'pseudocode',
        'keyConcepts',
        'implementationCode',
        'quizQuestions'
    ];
    
    requiredFields.forEach(field => {
        if (!topicText.includes(`${field}:`)) {
            topicIssues.push(`Missing ${field}`);
        }
    });
    
    // Check quiz questions count
    const quizMatch = topicText.match(/quizQuestions:\s*\[([\s\S]*?)\]/);
    if (quizMatch) {
        const quizContent = quizMatch[1];
        const questionCount = (quizContent.match(/question:/g) || []).length;
        if (questionCount < 5) {
            topicIssues.push(`Only ${questionCount} quiz questions (need 5+)`);
        }
    } else {
        topicIssues.push('No quiz questions found');
    }
    
    // Check extendedDefinition format
    if (topicText.includes('extendedDefinition:')) {
        const defMatch = topicText.match(/extendedDefinition:\s*`([^`]*)`/);
        if (defMatch) {
            const def = defMatch[1];
            if (!def.includes('What it does:') || !def.includes('How it works:') || !def.includes('When to use:')) {
                topicIssues.push('extendedDefinition not in required format (missing What it does/How it works/When to use)');
            }
        }
    }
    
    if (topicIssues.length > 0) {
        console.log(`  ❌ Issues found:`);
        topicIssues.forEach(issue => console.log(`     - ${issue}`));
        issues.push({
            id,
            title,
            issues: topicIssues
        });
    } else {
        console.log(`  ✅ All requirements met`);
    }
});

console.log(`\n\n=== SUMMARY ===`);
console.log(`Total topics analyzed: ${topicCount}`);
console.log(`Topics with issues: ${issues.length}`);
console.log(`Topics complete: ${topicCount - issues.length}`);

if (issues.length > 0) {
    console.log(`\n=== TOPICS NEEDING FIXES ===`);
    issues.forEach((topic, index) => {
        console.log(`\n${index + 1}. ${topic.id} - ${topic.title}`);
        topic.issues.forEach(issue => console.log(`   - ${issue}`));
    });
}

// Write detailed report
const report = {
    totalTopics: topicCount,
    completeTopics: topicCount - issues.length,
    incompleteTopics: issues.length,
    issues: issues
};

fs.writeFileSync('topic-completeness-report.json', JSON.stringify(report, null, 2));
console.log(`\nDetailed report saved to: topic-completeness-report.json`);