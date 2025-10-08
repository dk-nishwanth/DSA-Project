import fs from 'fs';

const content = fs.readFileSync('src/data/dsaTopics.ts', 'utf8');

// Find array-basics topic and add quiz questions
const topicId = 'array-basics';

// Find the start of the topic
const topicStart = content.indexOf(`id: '${topicId}'`);
if (topicStart === -1) {
    console.log(`Topic ${topicId} not found`);
    process.exit(1);
}

console.log(`Found ${topicId} at position ${topicStart}`);

// Find the existing quiz question
const quizStart = content.indexOf('quizQuestions: [', topicStart);
if (quizStart === -1) {
    console.log('No existing quiz questions found');
    process.exit(1);
}

console.log(`Found quizQuestions at position ${quizStart}`);

// Find the end of the existing quiz question (look for the closing bracket of the first question)
let braceCount = 0;
let inQuestion = false;
let questionEnd = -1;

for (let i = quizStart; i < content.length; i++) {
    const char = content[i];
    
    if (char === '{') {
        braceCount++;
        inQuestion = true;
    } else if (char === '}') {
        braceCount--;
        if (inQuestion && braceCount === 0) {
            // Found the end of the first question
            questionEnd = i;
            break;
        }
    }
}

if (questionEnd === -1) {
    console.log('Could not find end of existing question');
    process.exit(1);
}

console.log(`Found end of first question at position ${questionEnd}`);

// Show the context around this position
console.log('Context around question end:');
console.log(content.substring(questionEnd - 50, questionEnd + 100));

// Additional quiz questions to add
const additionalQuestions = [
    {
        question: "What is the space complexity of an array with n elements?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correctAnswer: 2,
        explanation: "An array with n elements requires O(n) space to store all elements."
    },
    {
        question: "Which operation is NOT typically O(1) for arrays?",
        options: ["Access by index", "Update by index", "Insert at beginning", "Get length"],
        correctAnswer: 2,
        explanation: "Inserting at the beginning requires shifting all existing elements, making it O(n)."
    },
    {
        question: "What happens when you access an array index that is out of bounds?",
        options: ["Returns null", "Returns undefined", "Throws an error", "Depends on the language"],
        correctAnswer: 3,
        explanation: "Different programming languages handle out-of-bounds access differently - some throw errors, others return undefined or garbage values."
    },
    {
        question: "In most programming languages, array indices start from:",
        options: ["1", "0", "-1", "Depends on declaration"],
        correctAnswer: 1,
        explanation: "Most programming languages use zero-based indexing, where the first element is at index 0."
    }
];

// Format the additional questions
const questionsText = additionalQuestions.map(q => 
    `            {
                question: "${q.question}",
                options: ${JSON.stringify(q.options)},
                correctAnswer: ${q.correctAnswer},
                explanation: "${q.explanation}"
            }`
).join(',\n');

// Insert the additional questions after the existing question
const insertPosition = questionEnd + 1;
const beforeInsert = content.substring(0, insertPosition);
const afterInsert = content.substring(insertPosition);

const newContent = beforeInsert + ',\n' + questionsText + afterInsert;

// Write the updated content
fs.writeFileSync('src/data/dsaTopics.ts', newContent);
console.log(`✅ Successfully added ${additionalQuestions.length} additional quiz questions to ${topicId}`);