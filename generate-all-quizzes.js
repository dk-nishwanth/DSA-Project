import fs from 'fs';

console.log('=== GENERATING COMPREHENSIVE QUIZ QUESTIONS ===\n');

// Read topics
const topicsContent = fs.readFileSync('src/data/dsaTopics.ts', 'utf-8');
const topicMatches = Array.from(topicsContent.matchAll(/id:\s*'([^']+)'[\s\S]*?title:\s*'([^']+)'[\s\S]*?category:\s*'([^']+)'[\s\S]*?difficulty:\s*'([^']+)'/g));

console.log(`Found ${topicMatches.length} topics\n`);

// Read existing quiz data
let existingQuizData = '';
try {
  existingQuizData = fs.readFileSync('src/data/quizData.ts', 'utf-8');
} catch (err) {
  console.log('Creating new quiz data file...\n');
}

// Generate quiz questions for each topic
const quizQuestions = [];
let questionId = 1;

topicMatches.forEach(([_, topicId, title, category, difficulty]) => {
  // Skip if already has questions
  if (existingQuizData.includes(`topicId: '${topicId}'`)) {
    console.log(`✓ ${topicId} already has questions`);
    return;
  }
  
  console.log(`Generating questions for: ${topicId}`);
  
  // Generate 5 questions per topic
  for (let i = 1; i <= 5; i++) {
    const questionDifficulty = i <= 2 ? 'easy' : i <= 4 ? 'medium' : 'hard';
    
    quizQuestions.push({
      id: `q${questionId++}`,
      topicId,
      question: `What is the key concept of ${title}?`,
      options: [
        'Option A - Correct answer',
        'Option B - Incorrect',
        'Option C - Incorrect',
        'Option D - Incorrect'
      ],
      correctAnswer: 0,
      explanation: `${title} is a fundamental concept in ${category}. This question tests your understanding of its core principles.`,
      difficulty: questionDifficulty
    });
  }
});

console.log(`\n✅ Generated ${quizQuestions.length} quiz questions\n`);

// Format as TypeScript
const quizDataTS = `// Auto-generated quiz questions
import { QuizQuestion } from '@/types';

export const quizQuestions: QuizQuestion[] = [
${quizQuestions.map(q => `  {
    id: '${q.id}',
    topicId: '${q.topicId}',
    question: '${q.question}',
    options: ${JSON.stringify(q.options, null, 6).replace(/\n/g, '\n    ')},
    correctAnswer: ${q.correctAnswer},
    explanation: '${q.explanation}',
    difficulty: '${q.difficulty}'
  }`).join(',\n')}
];
`;

// Save to file
fs.writeFileSync('generated-quiz-questions.ts', quizDataTS);
console.log('📄 Quiz questions saved to: generated-quiz-questions.ts\n');
console.log('⚠️  Note: These are template questions. Review and customize them for production use.\n');
