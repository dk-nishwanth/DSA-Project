import fs from 'fs';

// Read the dsaTopics.ts file
const content = fs.readFileSync('src/data/dsaTopics.ts', 'utf8');

// Extract topics using the same regex as the analysis script
const topicMatches = content.match(/{\s*id:\s*'[^']+',[\s\S]*?}/g);

console.log(`Found ${topicMatches.length} topic matches`);

// Find the stack-operations topic specifically
const stackTopic = topicMatches.find(topic => topic.includes("id: 'stack-operations'"));

if (stackTopic) {
    console.log('\n=== STACK TOPIC CAPTURED BY REGEX ===');
    console.log('Length:', stackTopic.length);
    console.log('First 500 chars:', stackTopic.substring(0, 500));
    console.log('Last 500 chars:', stackTopic.substring(stackTopic.length - 500));
    
    // Check what components are found
    const components = ['extendedDefinition', 'voiceExplanation', 'realWorldApplications', 'keyConcepts', 'pseudocode', 'implementationCode', 'quizQuestions'];
    
    console.log('\n=== COMPONENTS FOUND ===');
    components.forEach(comp => {
        const found = stackTopic.includes(`${comp}:`);
        console.log(`${comp}: ${found}`);
    });
} else {
    console.log('Stack topic not found in matches');
}