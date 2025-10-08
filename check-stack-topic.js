import fs from 'fs';

// Read the dsaTopics file
const content = fs.readFileSync('src/data/dsaTopics.ts', 'utf8');

// Find stack-operations topic
const stackTopicMatch = content.match(/{\s*id:\s*['"`]stack-operations['"`][\s\S]*?(?={\s*id:|$)/);

if (stackTopicMatch) {
    const stackTopic = stackTopicMatch[0];
    
    console.log('=== STACK-OPERATIONS TOPIC ANALYSIS ===');
    console.log('Topic found:', !!stackTopic);
    console.log('Length:', stackTopic.length);
    
    // Check for required components
    const components = {
        'extendedDefinition': /extendedDefinition:\s*`/,
        'voiceExplanation': /voiceExplanation:\s*`/,
        'realWorldApplications': /realWorldApplications:\s*`/,
        'keyConcepts': /keyConcepts:\s*`/,
        'pseudocode': /pseudocode:\s*`/,
        'implementationCode': /implementationCode:\s*`/,
        'quizQuestions': /quizQuestions:\s*\[/
    };
    
    console.log('\n=== COMPONENT CHECK ===');
    for (const [component, regex] of Object.entries(components)) {
        const found = regex.test(stackTopic);
        console.log(`${component}: ${found ? '✅' : '❌'}`);
        
        if (found && component === 'quizQuestions') {
            // Count questions
            const questionMatches = stackTopic.match(/{\s*question:/g);
            console.log(`  - Questions found: ${questionMatches ? questionMatches.length : 0}`);
        }
    }
    
    // Check for syntax issues
    console.log('\n=== SYNTAX CHECK ===');
    const hasClosingBrace = stackTopic.includes('}');
    const hasQuizArray = stackTopic.includes('quizQuestions: [');
    const hasQuizEnd = stackTopic.includes(']');
    
    console.log(`Has closing brace: ${hasClosingBrace}`);
    console.log(`Has quiz array start: ${hasQuizArray}`);
    console.log(`Has array end: ${hasQuizEnd}`);
    
} else {
    console.log('Stack-operations topic not found!');
}