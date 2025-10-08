import fs from 'fs';

// Read the dsaTopics.ts file
const content = fs.readFileSync('src/data/dsaTopics.ts', 'utf8');

// Split into individual topics
const topics = [];
const topicRegex = /{\s*id:\s*'([^']+)',[\s\S]*?(?=},\s*{|\s*]\s*;)/g;
let match;

while ((match = topicRegex.exec(content)) !== null) {
    const topicId = match[1];
    const topicContent = match[0];
    
    // Extract title
    const titleMatch = topicContent.match(/title:\s*'([^']+)'/);
    const title = titleMatch ? titleMatch[1] : 'Unknown';
    
    // Check if has quiz questions
    const hasQuizQuestions = topicContent.includes('quizQuestions:');
    
    // Count quiz questions if they exist
    let quizCount = 0;
    if (hasQuizQuestions) {
        const questionMatches = topicContent.match(/question:/g);
        quizCount = questionMatches ? questionMatches.length : 0;
    }
    
    topics.push({
        id: topicId,
        title: title,
        hasQuizQuestions: hasQuizQuestions,
        quizCount: quizCount,
        needsQuizzes: !hasQuizQuestions || quizCount < 5
    });
}

console.log(`\n=== QUIZ QUESTIONS ANALYSIS ===`);
console.log(`Total topics found: ${topics.length}`);

const topicsNeedingQuizzes = topics.filter(t => t.needsQuizzes);
const topicsWithQuizzes = topics.filter(t => !t.needsQuizzes);

console.log(`Topics with 5+ quiz questions: ${topicsWithQuizzes.length}`);
console.log(`Topics needing quiz questions: ${topicsNeedingQuizzes.length}`);

if (topicsNeedingQuizzes.length > 0) {
    console.log(`\n=== TOPICS NEEDING QUIZ QUESTIONS ===`);
    topicsNeedingQuizzes.forEach((topic, index) => {
        console.log(`${index + 1}. ${topic.id} - ${topic.title} (current: ${topic.quizCount} questions)`);
    });
}

if (topicsWithQuizzes.length > 0) {
    console.log(`\n=== TOPICS WITH SUFFICIENT QUIZ QUESTIONS ===`);
    topicsWithQuizzes.slice(0, 10).forEach((topic, index) => {
        console.log(`${index + 1}. ${topic.id} - ${topic.title} (${topic.quizCount} questions)`);
    });
    if (topicsWithQuizzes.length > 10) {
        console.log(`... and ${topicsWithQuizzes.length - 10} more`);
    }
}

// Save detailed report
const report = {
    totalTopics: topics.length,
    topicsWithSufficientQuizzes: topicsWithQuizzes.length,
    topicsNeedingQuizzes: topicsNeedingQuizzes.length,
    topicsNeedingQuizzesDetails: topicsNeedingQuizzes,
    topicsWithQuizzesDetails: topicsWithQuizzes
};

fs.writeFileSync('quiz-questions-analysis.json', JSON.stringify(report, null, 2));
console.log(`\nDetailed report saved to: quiz-questions-analysis.json`);