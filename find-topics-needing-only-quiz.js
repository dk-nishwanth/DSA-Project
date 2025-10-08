import fs from 'fs';

// Read the analysis report
const report = JSON.parse(fs.readFileSync('topic-completeness-report.json', 'utf8'));

console.log('=== TOPICS THAT ONLY NEED QUIZ QUESTIONS ===\n');

const topicsNeedingOnlyQuiz = [];

report.issues.forEach(topic => {
    const issues = topic.issues;
    
    // Check if the only missing component is quiz questions
    const onlyQuizMissing = issues.length === 1 && 
                           (issues[0].includes('Missing quizQuestions') || 
                            issues[0].includes('No quiz questions found'));
    
    // Or if it only has quiz + format issues
    const onlyQuizAndFormat = issues.length === 2 && 
                             issues.some(issue => issue.includes('quizQuestions')) &&
                             issues.some(issue => issue.includes('extendedDefinition not in required format'));
    
    if (onlyQuizMissing || onlyQuizAndFormat) {
        topicsNeedingOnlyQuiz.push({
            id: topic.id,
            title: topic.title,
            issues: issues
        });
    }
});

console.log(`Found ${topicsNeedingOnlyQuiz.length} topics that primarily need quiz questions:\n`);

topicsNeedingOnlyQuiz.forEach((topic, index) => {
    console.log(`${index + 1}. ${topic.id} - ${topic.title}`);
    topic.issues.forEach(issue => {
        console.log(`   - ${issue}`);
    });
    console.log();
});

console.log('\n=== TOPICS WITH MINIMAL MISSING COMPONENTS (2-3 issues) ===\n');

const topicsWithMinimalIssues = [];

report.issues.forEach(topic => {
    if (topic.issues.length >= 2 && topic.issues.length <= 3) {
        topicsWithMinimalIssues.push({
            id: topic.id,
            title: topic.title,
            issues: topic.issues
        });
    }
});

console.log(`Found ${topicsWithMinimalIssues.length} topics with minimal issues:\n`);

topicsWithMinimalIssues.forEach((topic, index) => {
    console.log(`${index + 1}. ${topic.id} - ${topic.title}`);
    topic.issues.forEach(issue => {
        console.log(`   - ${issue}`);
    });
    console.log();
});