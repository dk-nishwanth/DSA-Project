import fs from 'fs';

const topicsContent = fs.readFileSync('src/data/dsaTopics.ts', 'utf8');
const quizContent = fs.readFileSync('src/data/quizData.ts', 'utf8');

// Better parsing - split by topic boundaries
const topicBlocks = [];
const lines = topicsContent.split('\n');
let currentBlock = [];
let inTopicsArray = false;
let braceCount = 0;
let currentId = null;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.includes('export const dsaTopics')) {
        inTopicsArray = true;
        continue;
    }
    
    if (!inTopicsArray) continue;
    
    // Track braces
    braceCount += (line.match(/\{/g) || []).length;
    braceCount -= (line.match(/\}/g) || []).length;
    
    // Check for topic ID
    const idMatch = line.match(/id:\s*['"]([^'"]+)['"]/);
    if (idMatch) {
        if (currentBlock.length > 0 && currentId) {
            topicBlocks.push({ id: currentId, content: currentBlock.join('\n') });
        }
        currentId = idMatch[1];
        currentBlock = [line];
    } else if (currentId) {
        currentBlock.push(line);
    }
    
    // End of topics array
    if (braceCount === 0 && inTopicsArray && line.includes('];')) {
        if (currentBlock.length > 0 && currentId) {
            topicBlocks.push({ id: currentId, content: currentBlock.join('\n') });
        }
        break;
    }
}

console.log(`\n=== ACCURATE TOPIC AUDIT ===\n`);
console.log(`Total Topics Found: ${topicBlocks.length}\n`);

const issues = {
    missingExtendedDefinition: [],
    missingVoiceExplanation: [],
    missingRealWorldApplications: [],
    missingKeyConcepts: [],
    missingPseudocode: [],
    missingImplementationCode: [],
    insufficientQuizQuestions: []
};

// Check each topic
topicBlocks.forEach(topic => {
    const content = topic.content;
    
    // Check for each required field
    if (!content.includes('extendedDefinition:')) {
        issues.missingExtendedDefinition.push(topic.id);
    }
    if (!content.includes('voiceExplanation:')) {
        issues.missingVoiceExplanation.push(topic.id);
    }
    if (!content.includes('realWorldApplications:')) {
        issues.missingRealWorldApplications.push(topic.id);
    }
    if (!content.includes('keyConcepts:')) {
        issues.missingKeyConcepts.push(topic.id);
    }
    if (!content.includes('pseudocode:')) {
        issues.missingPseudocode.push(topic.id);
    }
    if (!content.includes('implementationCode:')) {
        issues.missingImplementationCode.push(topic.id);
    }
    
    // Check quiz questions
    const quizRegex = new RegExp(`['"]${topic.id}['"]\\s*:\\s*\\[`, 'g');
    const quizMatch = quizContent.match(quizRegex);
    
    if (quizMatch) {
        // Count questions
        const topicQuizStart = quizContent.indexOf(`'${topic.id}':`);
        if (topicQuizStart > -1) {
            const nextTopicMatch = quizContent.substring(topicQuizStart + 1).search(/['"][^'"]+['"]\s*:\s*\[/);
            const section = nextTopicMatch > 0 
                ? quizContent.substring(topicQuizStart, topicQuizStart + nextTopicMatch)
                : quizContent.substring(topicQuizStart, topicQuizStart + 5000);
            const questionCount = (section.match(/\{\s*id:/g) || []).length;
            
            if (questionCount < 5) {
                issues.insufficientQuizQuestions.push(`${topic.id} (${questionCount} questions)`);
            }
        }
    } else {
        issues.insufficientQuizQuestions.push(`${topic.id} (0 questions)`);
    }
});

// Report
console.log('📋 MISSING EXTENDED DEFINITIONS:', issues.missingExtendedDefinition.length);
if (issues.missingExtendedDefinition.length > 0) {
    console.log('   ', issues.missingExtendedDefinition.join(', '));
}

console.log('\n🎤 MISSING VOICE EXPLANATIONS:', issues.missingVoiceExplanation.length);
if (issues.missingVoiceExplanation.length > 0) {
    console.log('   ', issues.missingVoiceExplanation.join(', '));
}

console.log('\n🌍 MISSING REAL WORLD APPLICATIONS:', issues.missingRealWorldApplications.length);
if (issues.missingRealWorldApplications.length > 0) {
    console.log('   ', issues.missingRealWorldApplications.join(', '));
}

console.log('\n🔑 MISSING KEY CONCEPTS:', issues.missingKeyConcepts.length);
if (issues.missingKeyConcepts.length > 0) {
    console.log('   ', issues.missingKeyConcepts.join(', '));
}

console.log('\n📝 MISSING PSEUDOCODE:', issues.missingPseudocode.length);
if (issues.missingPseudocode.length > 0) {
    console.log('   ', issues.missingPseudocode.join(', '));
}

console.log('\n💻 MISSING IMPLEMENTATION CODE:', issues.missingImplementationCode.length);
if (issues.missingImplementationCode.length > 0) {
    console.log('   ', issues.missingImplementationCode.join(', '));
}

console.log('\n⚠️  INSUFFICIENT QUIZ QUESTIONS (<5):', issues.insufficientQuizQuestions.length);
if (issues.insufficientQuizQuestions.length > 0 && issues.insufficientQuizQuestions.length <= 20) {
    console.log('   ', issues.insufficientQuizQuestions.join(', '));
} else if (issues.insufficientQuizQuestions.length > 20) {
    console.log('   ', issues.insufficientQuizQuestions.slice(0, 20).join(', '));
    console.log(`    ... and ${issues.insufficientQuizQuestions.length - 20} more`);
}

const totalIssues = Object.values(issues).reduce((sum, arr) => sum + arr.length, 0);
console.log('\n' + '='.repeat(60));
console.log(`TOTAL ISSUES: ${totalIssues}`);
console.log('='.repeat(60));

// Save report
fs.writeFileSync('accurate-audit-report.json', JSON.stringify({
    timestamp: new Date().toISOString(),
    totalTopics: topicBlocks.length,
    issues,
    summary: {
        missingExtendedDefinition: issues.missingExtendedDefinition.length,
        missingVoiceExplanation: issues.missingVoiceExplanation.length,
        missingRealWorldApplications: issues.missingRealWorldApplications.length,
        missingKeyConcepts: issues.missingKeyConcepts.length,
        missingPseudocode: issues.missingPseudocode.length,
        missingImplementationCode: issues.missingImplementationCode.length,
        insufficientQuizQuestions: issues.insufficientQuizQuestions.length,
        totalIssues
    }
}, null, 2));

console.log('\n✅ Detailed report saved to accurate-audit-report.json\n');
