import fs from 'fs';

// Read the topics file
const topicsContent = fs.readFileSync('src/data/dsaTopics.ts', 'utf8');
const quizContent = fs.readFileSync('src/data/quizData.ts', 'utf8');

// Extract topics array
const topicsMatch = topicsContent.match(/export const dsaTopics: DSATopic\[\] = \[([\s\S]*)\];/);
if (!topicsMatch) {
    console.error('Could not find topics array');
    process.exit(1);
}

// Parse topics (simplified parsing)
const topics = [];
const topicRegex = /\{[\s\S]*?id:\s*['"]([^'"]+)['"][\s\S]*?\}/g;
let match;

while ((match = topicRegex.exec(topicsContent)) !== null) {
    const topicId = match[1];
    const topicBlock = match[0];
    
    topics.push({
        id: topicId,
        hasExtendedDefinition: /extendedDefinition:\s*`/.test(topicBlock),
        hasVoiceExplanation: /voiceExplanation:\s*`/.test(topicBlock),
        hasRealWorldApplications: /realWorldApplications:\s*`/.test(topicBlock),
        hasKeyConcepts: /keyConcepts:\s*`/.test(topicBlock),
        hasPseudocode: /pseudocode:\s*`/.test(topicBlock),
        hasImplementationCode: /implementationCode:\s*`/.test(topicBlock),
        hasQuizQuestions: /quizQuestions:\s*\[/.test(topicBlock),
        block: topicBlock
    });
}

// Check quiz data
const quizTopics = {};
const quizRegex = /['"]([^'"]+)['"]\s*:\s*\[/g;
while ((match = quizRegex.exec(quizContent)) !== null) {
    const topicId = match[1];
    // Count questions for this topic
    const topicQuizSection = quizContent.substring(match.index);
    const nextTopicMatch = topicQuizSection.substring(1).search(/['"][^'"]+['"]\s*:\s*\[/);
    const section = nextTopicMatch > 0 ? topicQuizSection.substring(0, nextTopicMatch) : topicQuizSection.substring(0, 5000);
    const questionCount = (section.match(/\{\s*id:/g) || []).length;
    quizTopics[topicId] = questionCount;
}

console.log('\n=== COMPREHENSIVE TOPIC AUDIT ===\n');
console.log(`Total Topics Found: ${topics.length}\n`);

const issues = {
    missingExtendedDefinition: [],
    missingVoiceExplanation: [],
    missingRealWorldApplications: [],
    missingKeyConcepts: [],
    missingPseudocode: [],
    missingImplementationCode: [],
    missingQuizQuestions: [],
    insufficientQuizQuestions: []
};

topics.forEach(topic => {
    const quizCount = quizTopics[topic.id] || 0;
    
    if (!topic.hasExtendedDefinition) issues.missingExtendedDefinition.push(topic.id);
    if (!topic.hasVoiceExplanation) issues.missingVoiceExplanation.push(topic.id);
    if (!topic.hasRealWorldApplications) issues.missingRealWorldApplications.push(topic.id);
    if (!topic.hasKeyConcepts) issues.missingKeyConcepts.push(topic.id);
    if (!topic.hasPseudocode) issues.missingPseudocode.push(topic.id);
    if (!topic.hasImplementationCode) issues.missingImplementationCode.push(topic.id);
    
    if (quizCount === 0) {
        issues.missingQuizQuestions.push(topic.id);
    } else if (quizCount < 5) {
        issues.insufficientQuizQuestions.push(`${topic.id} (${quizCount} questions)`);
    }
});

// Report issues
console.log('📋 MISSING EXTENDED DEFINITIONS:', issues.missingExtendedDefinition.length);
if (issues.missingExtendedDefinition.length > 0) {
    console.log('   Topics:', issues.missingExtendedDefinition.slice(0, 10).join(', '));
    if (issues.missingExtendedDefinition.length > 10) console.log(`   ... and ${issues.missingExtendedDefinition.length - 10} more`);
}

console.log('\n🎤 MISSING VOICE EXPLANATIONS:', issues.missingVoiceExplanation.length);
if (issues.missingVoiceExplanation.length > 0) {
    console.log('   Topics:', issues.missingVoiceExplanation.slice(0, 10).join(', '));
    if (issues.missingVoiceExplanation.length > 10) console.log(`   ... and ${issues.missingVoiceExplanation.length - 10} more`);
}

console.log('\n🌍 MISSING REAL WORLD APPLICATIONS:', issues.missingRealWorldApplications.length);
if (issues.missingRealWorldApplications.length > 0) {
    console.log('   Topics:', issues.missingRealWorldApplications.slice(0, 10).join(', '));
    if (issues.missingRealWorldApplications.length > 10) console.log(`   ... and ${issues.missingRealWorldApplications.length - 10} more`);
}

console.log('\n🔑 MISSING KEY CONCEPTS:', issues.missingKeyConcepts.length);
if (issues.missingKeyConcepts.length > 0) {
    console.log('   Topics:', issues.missingKeyConcepts.slice(0, 10).join(', '));
    if (issues.missingKeyConcepts.length > 10) console.log(`   ... and ${issues.missingKeyConcepts.length - 10} more`);
}

console.log('\n📝 MISSING PSEUDOCODE:', issues.missingPseudocode.length);
if (issues.missingPseudocode.length > 0) {
    console.log('   Topics:', issues.missingPseudocode.slice(0, 10).join(', '));
    if (issues.missingPseudocode.length > 10) console.log(`   ... and ${issues.missingPseudocode.length - 10} more`);
}

console.log('\n💻 MISSING IMPLEMENTATION CODE:', issues.missingImplementationCode.length);
if (issues.missingImplementationCode.length > 0) {
    console.log('   Topics:', issues.missingImplementationCode.slice(0, 10).join(', '));
    if (issues.missingImplementationCode.length > 10) console.log(`   ... and ${issues.missingImplementationCode.length - 10} more`);
}

console.log('\n❌ MISSING QUIZ QUESTIONS:', issues.missingQuizQuestions.length);
if (issues.missingQuizQuestions.length > 0) {
    console.log('   Topics:', issues.missingQuizQuestions.slice(0, 10).join(', '));
    if (issues.missingQuizQuestions.length > 10) console.log(`   ... and ${issues.missingQuizQuestions.length - 10} more`);
}

console.log('\n⚠️  INSUFFICIENT QUIZ QUESTIONS (<5):', issues.insufficientQuizQuestions.length);
if (issues.insufficientQuizQuestions.length > 0) {
    console.log('   Topics:', issues.insufficientQuizQuestions.slice(0, 10).join(', '));
    if (issues.insufficientQuizQuestions.length > 10) console.log(`   ... and ${issues.insufficientQuizQuestions.length - 10} more`);
}

// Summary
const totalIssues = Object.values(issues).reduce((sum, arr) => sum + arr.length, 0);
console.log('\n' + '='.repeat(50));
console.log(`TOTAL ISSUES FOUND: ${totalIssues}`);
console.log('='.repeat(50));

// Save detailed report
const report = {
    timestamp: new Date().toISOString(),
    totalTopics: topics.length,
    issues,
    summary: {
        missingExtendedDefinition: issues.missingExtendedDefinition.length,
        missingVoiceExplanation: issues.missingVoiceExplanation.length,
        missingRealWorldApplications: issues.missingRealWorldApplications.length,
        missingKeyConcepts: issues.missingKeyConcepts.length,
        missingPseudocode: issues.missingPseudocode.length,
        missingImplementationCode: issues.missingImplementationCode.length,
        missingQuizQuestions: issues.missingQuizQuestions.length,
        insufficientQuizQuestions: issues.insufficientQuizQuestions.length,
        totalIssues
    }
};

fs.writeFileSync('audit-report.json', JSON.stringify(report, null, 2));
console.log('\n✅ Detailed report saved to audit-report.json');
