import fs from 'fs';

const content = fs.readFileSync('src/data/dsaTopics.ts', 'utf8');

// Test the regex for array-basics
const topicId = 'array-basics';
const existingQuizRegex = new RegExp(`(id: '${topicId}'[\\s\\S]*?quizQuestions: \\[\\s*{[\\s\\S]*?}\\s*)(\\]\\s*}\\s*},)`, 'g');
const match = existingQuizRegex.exec(content);

console.log('Regex pattern:', existingQuizRegex.source);
console.log('Match found:', !!match);

if (match) {
    console.log('Match length:', match[0].length);
    console.log('First 200 chars:', match[0].substring(0, 200));
    console.log('Last 200 chars:', match[0].substring(match[0].length - 200));
} else {
    console.log('No match found');

    // Try a simpler regex
    const simpleRegex = new RegExp(`id: '${topicId}'`, 'g');
    const simpleMatch = simpleRegex.exec(content);
    console.log('Simple regex match:', !!simpleMatch);

    if (simpleMatch) {
        console.log('Found at position:', simpleMatch.index);
        console.log('Context:', content.substring(simpleMatch.index - 50, simpleMatch.index + 200));
    }
}