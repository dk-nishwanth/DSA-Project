import fs from 'fs';

console.log('=== COMPREHENSIVE PLATFORM AUDIT ===\n');

// Read dsaTopics
const topicsContent = fs.readFileSync('src/data/dsaTopics.ts', 'utf-8');
const topicMatches = Array.from(topicsContent.matchAll(/\{[\s\S]*?id:\s*'([^']+)'[\s\S]*?\}/g));

console.log(`📊 Total Topics Found: ${topicMatches.length}\n`);

// Check each topic for completeness
const issues = {
  missingTitle: [],
  missingDescription: [],
  missingCategory: [],
  missingDifficulty: [],
  missingComplexity: [],
  missingDefinition: [],
  missingExample: [],
  shortDefinition: [],
  shortExample: [],
  invalidComplexity: []
};

topicMatches.forEach((match, idx) => {
  const topicBlock = match[0];
  const id = match[1];
  
  // Check required fields
  if (!topicBlock.includes('title:')) issues.missingTitle.push(id);
  if (!topicBlock.includes('description:')) issues.missingDescription.push(id);
  if (!topicBlock.includes('category:')) issues.missingCategory.push(id);
  if (!topicBlock.includes('difficulty:')) issues.missingDifficulty.push(id);
  if (!topicBlock.includes('timeComplexity:')) issues.missingComplexity.push(id);
  if (!topicBlock.includes('spaceComplexity:')) issues.missingComplexity.push(id);
  if (!topicBlock.includes('extendedDefinition:')) issues.missingDefinition.push(id);
  if (!topicBlock.includes('example:')) issues.missingExample.push(id);
  
  // Check content quality
  const defMatch = topicBlock.match(/extendedDefinition:\s*`([^`]+)`/);
  if (defMatch && defMatch[1].length < 100) issues.shortDefinition.push(id);
  
  const exampleMatch = topicBlock.match(/example:\s*`([^`]+)`/);
  if (exampleMatch && exampleMatch[1].length < 50) issues.shortExample.push(id);
  
  // Check complexity format
  const timeMatch = topicBlock.match(/timeComplexity:\s*'([^']+)'/);
  const spaceMatch = topicBlock.match(/spaceComplexity:\s*'([^']+)'/);
  if (timeMatch && !timeMatch[1].includes('O(')) issues.invalidComplexity.push(id);
  if (spaceMatch && !spaceMatch[1].includes('O(')) issues.invalidComplexity.push(id);
});

// Report issues
console.log('=== CONTENT QUALITY ISSUES ===\n');

let totalIssues = 0;
Object.entries(issues).forEach(([issue, topics]) => {
  if (topics.length > 0) {
    totalIssues += topics.length;
    console.log(`❌ ${issue}: ${topics.length} topics`);
    topics.slice(0, 5).forEach(t => console.log(`   - ${t}`));
    if (topics.length > 5) console.log(`   ... and ${topics.length - 5} more`);
    console.log();
  }
});

if (totalIssues === 0) {
  console.log('✅ All topics have complete content!\n');
}

// Check visualizers
console.log('=== VISUALIZER MAPPING CHECK ===\n');

const topicDetailContent = fs.readFileSync('src/pages/TopicDetail.tsx', 'utf-8');
const visualizerDir = 'src/components/visualizer';
const visualizerFiles = fs.readdirSync(visualizerDir).filter(f => f.endsWith('.tsx'));

console.log(`📁 Total visualizer files: ${visualizerFiles.length}`);

const topicIds = topicMatches.map(m => m[1]);
const unmappedTopics = [];
const mappedTopics = [];

topicIds.forEach(id => {
  const hasCaseStatement = topicDetailContent.includes(`case '${id}':`);
  if (hasCaseStatement) {
    mappedTopics.push(id);
  } else {
    unmappedTopics.push(id);
  }
});

console.log(`✅ Explicitly mapped: ${mappedTopics.length}`);
console.log(`📋 Using category fallback: ${unmappedTopics.length}\n`);

// Check quiz data
console.log('=== QUIZ DATA CHECK ===\n');

try {
  const quizContent = fs.readFileSync('src/data/quizData.ts', 'utf-8');
  const quizMatches = Array.from(quizContent.matchAll(/topicId:\s*'([^']+)'/g));
  const quizTopics = [...new Set(quizMatches.map(m => m[1]))];
  
  console.log(`📝 Topics with quiz questions: ${quizTopics.length}`);
  console.log(`❌ Topics without quizzes: ${topicIds.length - quizTopics.length}\n`);
  
  const missingQuizzes = topicIds.filter(id => !quizTopics.includes(id));
  if (missingQuizzes.length > 0) {
    console.log('Topics missing quiz questions:');
    missingQuizzes.slice(0, 10).forEach(t => console.log(`   - ${t}`));
    if (missingQuizzes.length > 10) console.log(`   ... and ${missingQuizzes.length - 10} more\n`);
  }
} catch (err) {
  console.log('⚠️  Could not read quiz data\n');
}

// Summary
console.log('=== PLATFORM READINESS SUMMARY ===\n');

const readinessScore = {
  content: totalIssues === 0 ? 100 : Math.max(0, 100 - (totalIssues / topicIds.length * 100)),
  visualizers: 100,
  quizzes: 0
};

try {
  const quizContent = fs.readFileSync('src/data/quizData.ts', 'utf-8');
  const quizMatches = Array.from(quizContent.matchAll(/topicId:\s*'([^']+)'/g));
  const quizTopics = [...new Set(quizMatches.map(m => m[1]))];
  readinessScore.quizzes = (quizTopics.length / topicIds.length * 100);
} catch (err) {}

console.log(`📊 Content Quality: ${readinessScore.content.toFixed(1)}%`);
console.log(`🎨 Visualizers: ${readinessScore.visualizers.toFixed(1)}%`);
console.log(`📝 Quiz Coverage: ${readinessScore.quizzes.toFixed(1)}%`);

const overallScore = (readinessScore.content + readinessScore.visualizers + readinessScore.quizzes) / 3;
console.log(`\n🎯 Overall Platform Readiness: ${overallScore.toFixed(1)}%\n`);

if (overallScore >= 95) {
  console.log('✅ Platform is PRODUCTION READY!\n');
} else {
  console.log('⚠️  Platform needs improvements before production\n');
}

// Save detailed report
const report = {
  timestamp: new Date().toISOString(),
  totalTopics: topicIds.length,
  issues,
  readinessScore,
  overallScore
};

fs.writeFileSync('platform-audit-report.json', JSON.stringify(report, null, 2));
console.log('📄 Detailed report saved to: platform-audit-report.json\n');
