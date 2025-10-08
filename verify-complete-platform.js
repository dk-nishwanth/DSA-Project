import fs from 'fs';

console.log('='.repeat(80));
console.log('🎯 DSA PLATFORM - COMPLETE VERIFICATION');
console.log('='.repeat(80));
console.log();

// Read files
const topicsContent = fs.readFileSync('src/data/dsaTopics.ts', 'utf8');
const topicDetailContent = fs.readFileSync('src/pages/TopicDetail.tsx', 'utf8');

// Extract all topic IDs from dsaTopics.ts
const topicMatches = [...topicsContent.matchAll(/id:\s*['"]([^'"]+)['"]/g)];
const allTopicIds = topicMatches.map(m => m[1]);

console.log(`📊 Total Topics Found: ${allTopicIds.length}`);
console.log();

// Extract all mapped cases from TopicDetail.tsx
const caseMatches = [...topicDetailContent.matchAll(/case\s+['"]([^'"]+)['"]\s*:/g)];
const mappedTopicIds = caseMatches.map(m => m[1]);

console.log(`✅ Explicitly Mapped Topics: ${mappedTopicIds.length}`);
console.log();

// Find unmapped topics
const unmappedTopics = allTopicIds.filter(id => !mappedTopicIds.includes(id));

if (unmappedTopics.length === 0) {
    console.log('🎉 SUCCESS! All topics are explicitly mapped!');
} else {
    console.log(`⚠️  Topics relying on default fallback: ${unmappedTopics.length}`);
    console.log();
    console.log('Topics using category fallback:');
    unmappedTopics.forEach(id => {
        console.log(`  - ${id}`);
    });
}

console.log();
console.log('='.repeat(80));
console.log('📋 CATEGORY BREAKDOWN');
console.log('='.repeat(80));
console.log();

// Group topics by category
const categoryTopics = {};
const topicDetailMatches = [...topicsContent.matchAll(/{\s*id:\s*['"]([^'"]+)['"]\s*,\s*title:\s*['"]([^'"]+)['"]\s*,\s*description:[^,]+,\s*category:\s*['"]([^'"]+)['"]/gs)];

for (const match of topicDetailMatches) {
    const [, id, title, category] = match;
    if (!categoryTopics[category]) {
        categoryTopics[category] = [];
    }
    categoryTopics[category].push({ id, title, mapped: mappedTopicIds.includes(id) });
}

// Display by category
const categories = Object.keys(categoryTopics).sort();
let totalMapped = 0;
let totalTopics = 0;

categories.forEach(category => {
    const topics = categoryTopics[category];
    const mappedCount = topics.filter(t => t.mapped).length;
    const totalCount = topics.length;
    const percentage = totalCount > 0 ? Math.round((mappedCount / totalCount) * 100) : 100;
    const status = percentage === 100 ? '✅' : percentage >= 50 ? '⚠️' : '❌';
    
    console.log(`${status} ${category}: ${mappedCount}/${totalCount} (${percentage}%)`);
    
    if (mappedCount < totalCount) {
        topics.filter(t => !t.mapped).forEach(topic => {
            console.log(`     ⚠️  ${topic.title} (${topic.id})`);
        });
    }
    
    totalMapped += mappedCount;
    totalTopics += totalCount;
    console.log();
});

console.log('='.repeat(80));
console.log('🎊 FINAL SUMMARY');
console.log('='.repeat(80));
console.log();
console.log(`Total Categories: ${categories.length}`);
console.log(`Total Topics: ${totalTopics}`);
console.log(`Explicitly Mapped: ${totalMapped}`);
console.log(`Using Fallback: ${totalTopics - totalMapped}`);
console.log(`Completion: ${Math.round((totalMapped / totalTopics) * 100)}%`);
console.log();

if (totalMapped === totalTopics) {
    console.log('🎉🎉🎉 PERFECT! ALL TOPICS EXPLICITLY MAPPED! 🎉🎉🎉');
} else if (totalMapped / totalTopics >= 0.9) {
    console.log('✅ EXCELLENT! Over 90% explicitly mapped!');
} else if (totalMapped / totalTopics >= 0.75) {
    console.log('👍 GOOD! Over 75% explicitly mapped!');
} else {
    console.log('⚠️  More work needed to reach 100% explicit mapping.');
}

console.log();
console.log('='.repeat(80));
