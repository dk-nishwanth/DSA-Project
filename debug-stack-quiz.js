import fs from 'fs';

// Read the dsaTopics.ts file
const content = fs.readFileSync('src/data/dsaTopics.ts', 'utf8');

// Extract topics using the same method as the fixed analysis script
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

const topics = extractTopics(content);
const stackTopic = topics.find(topic => topic.includes("id: 'stack-operations'"));

if (stackTopic) {
    console.log('Stack topic found, length:', stackTopic.length);
    
    // Count quiz questions
    const questionMatches = stackTopic.match(/{\s*question:/g);
    console.log('Question matches found:', questionMatches ? questionMatches.length : 0);
    
    // Check if quizQuestions array exists
    const hasQuizArray = stackTopic.includes('quizQuestions: [');
    console.log('Has quizQuestions array:', hasQuizArray);
    
    // Look for the quizQuestions section
    const quizMatch = stackTopic.match(/quizQuestions:\s*\[([\s\S]*?)\]/);
    if (quizMatch) {
        console.log('Quiz section found, length:', quizMatch[1].length);
        const quizContent = quizMatch[1];
        const questions = quizContent.match(/{\s*question:/g);
        console.log('Questions in quiz section:', questions ? questions.length : 0);
    } else {
        console.log('No quiz section match found');
        
        // Check what's at the end of the topic
        console.log('\nLast 1000 chars of topic:');
        console.log(stackTopic.slice(-1000));
    }
} else {
    console.log('Stack topic not found');
}