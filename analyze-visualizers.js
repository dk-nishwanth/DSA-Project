// Script to analyze which topics don't have unique visualizers
import fs from 'fs';

// Read the dsaTopics.ts file
const dsaTopicsContent = fs.readFileSync('src/data/dsaTopics.ts', 'utf8');

// Read the TopicDetail.tsx file
const topicDetailContent = fs.readFileSync('src/pages/TopicDetail.tsx', 'utf8');

// Extract all topic IDs from dsaTopics.ts
const topicIdMatches = dsaTopicsContent.match(/id:\s*'([^']+)'/g);
const allTopicIds = topicIdMatches ? topicIdMatches.map(match => match.match(/'([^']+)'/)[1]) : [];

console.log(`Total topics found: ${allTopicIds.length}`);

// Extract all specific case statements from TopicDetail.tsx
const caseMatches = topicDetailContent.match(/case\s+'([^']+)':/g);
const specificCases = caseMatches ? caseMatches.map(match => match.match(/'([^']+)'/)[1]) : [];

console.log(`Topics with specific visualizers: ${specificCases.length}`);

// Find topics without specific visualizers
const topicsWithoutUniqueVisualizers = allTopicIds.filter(id => !specificCases.includes(id));

console.log(`\nTopics WITHOUT unique visualizers (${topicsWithoutUniqueVisualizers.length}):`);
topicsWithoutUniqueVisualizers.forEach((id, index) => {
  console.log(`${index + 1}. ${id}`);
});

// Group by category for better analysis
const categoryGroups = {};
topicsWithoutUniqueVisualizers.forEach(id => {
  // Extract category from dsaTopics.ts
  const topicMatch = dsaTopicsContent.match(new RegExp(`id:\\s*'${id}'[\\s\\S]*?category:\\s*'([^']+)'`));
  const category = topicMatch ? topicMatch[1] : 'Unknown';
  
  if (!categoryGroups[category]) {
    categoryGroups[category] = [];
  }
  categoryGroups[category].push(id);
});

console.log(`\nGrouped by category:`);
Object.entries(categoryGroups).forEach(([category, topics]) => {
  console.log(`\n${category} (${topics.length} topics):`);
  topics.forEach((topic, index) => {
    console.log(`  ${index + 1}. ${topic}`);
  });
});

// Analyze fallback usage
console.log(`\nFallback analysis:`);
console.log(`- Topics with unique visualizers: ${specificCases.length}`);
console.log(`- Topics using category fallbacks: ${topicsWithoutUniqueVisualizers.length}`);
console.log(`- Percentage with unique visualizers: ${((specificCases.length / allTopicIds.length) * 100).toFixed(1)}%`);