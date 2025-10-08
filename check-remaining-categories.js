import fs from 'fs';

// Read the dsaTopics file
const content = fs.readFileSync('src/data/dsaTopics.ts', 'utf8');

// All categories
const allCategories = [
    'Arrays',
    'Strings',
    'Linked Lists',
    'Stacks & Queues',
    'Trees',
    'Graphs',
    'Sorting',
    'Searching',
    'Hashing',
    'Recursion',
    'Dynamic Programming',
    'Greedy Algorithms',
    'Backtracking',
    'Advanced Data Structures',
    'Two Pointers',
    'Sliding Window',
    'Bit Manipulation',
    'Mathematical Algorithms'
];

// Categories we've completed
const completedCategories = [
    'Mathematical Algorithms',
    'Bit Manipulation',
    'Sliding Window',
    'Two Pointers',
    'Advanced Data Structures',
    'Backtracking',
    'Greedy Algorithms'
];

console.log('='.repeat(80));
console.log('DSA PLATFORM - CATEGORY COMPLETION STATUS');
console.log('='.repeat(80));
console.log();

// Extract topics by category
const categoryTopics = {};
allCategories.forEach(cat => categoryTopics[cat] = []);

// Parse topics
const topicMatches = content.matchAll(/{\s*id:\s*['"]([^'"]+)['"]\s*,\s*title:\s*['"]([^'"]+)['"]\s*,\s*description:[^,]+,\s*category:\s*['"]([^'"]+)['"]/gs);

for (const match of topicMatches) {
    const [, id, title, category] = match;
    categoryTopics[category].push({ id, title });
}

// Display results
let totalTopics = 0;
let completedTopicsCount = 0;

allCategories.forEach(category => {
    const topics = categoryTopics[category] || [];
    const isCompleted = completedCategories.includes(category);
    const status = isCompleted ? '✅ COMPLETE' : '⚠️  NEEDS WORK';
    
    console.log(`${status} | ${category}`);
    console.log(`   Topics: ${topics.length}`);
    
    if (topics.length > 0 && topics.length <= 10) {
        topics.forEach(topic => {
            console.log(`      - ${topic.title} (${topic.id})`);
        });
    }
    
    totalTopics += topics.length;
    if (isCompleted) {
        completedTopicsCount += topics.length;
    }
    
    console.log();
});

console.log('='.repeat(80));
console.log('SUMMARY');
console.log('='.repeat(80));
console.log(`Total Categories: ${allCategories.length}`);
console.log(`Completed Categories: ${completedCategories.length}`);
console.log(`Remaining Categories: ${allCategories.length - completedCategories.length}`);
console.log();
console.log(`Total Topics: ${totalTopics}`);
console.log(`Topics in Completed Categories: ${completedTopicsCount}`);
console.log();

// Show remaining categories
const remainingCategories = allCategories.filter(cat => !completedCategories.includes(cat));
console.log('REMAINING CATEGORIES TO COMPLETE:');
remainingCategories.forEach((cat, idx) => {
    const topicCount = categoryTopics[cat].length;
    console.log(`${idx + 1}. ${cat} (${topicCount} topics)`);
});
