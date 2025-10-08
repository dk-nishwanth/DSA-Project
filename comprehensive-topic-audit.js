import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the dsaTopics.ts file
const dsaTopicsPath = path.join(__dirname, 'src', 'data', 'dsaTopics.ts');
const dsaTopicsContent = fs.readFileSync(dsaTopicsPath, 'utf8');

// Extract all topics with their complete data
const topicRegex = /{\s*id:\s*['"`]([^'"`]+)['"`],\s*title:\s*['"`]([^'"`]+)['"`][^}]*}/gs;
const topics = [];

// More comprehensive extraction
const topicBlocks = dsaTopicsContent.split(/(?=\s*{\s*id:)/g).filter(block => block.includes('id:'));

console.log(`Found ${topicBlocks.length} topic blocks\n`);

const issues = {
  missingVisualizer: [],
  missingVoiceExplanation: [],
  missingQuizQuestions: [],
  insufficientQuizQuestions: [],
  missingPseudocode: [],
  missingKeyConcepts: [],
  missingImplementation: [],
  incorrectDefinitionFormat: [],
  missingRealWorldApps: []
};

topicBlocks.forEach((block, index) => {
  const idMatch = block.match(/id:\s*['"`]([^'"`]+)['"`]/);
  const titleMatch = block.match(/title:\s*['"`]([^'"`]+)['"`]/);
  
  if (!idMatch || !titleMatch) return;
  
  const topicId = idMatch[1];
  const topicTitle = titleMatch[1];
  
  // Check for required components
  const hasVisualizer = block.includes('visualizer:');
  const hasVoiceExplanation = block.includes('voiceExplanation:');
  const hasQuizQuestions = block.includes('quizQuestions:');
  const hasPseudocode = block.includes('pseudocode:');
  const hasKeyConcepts = block.includes('keyConcepts:');
  const hasImplementation = block.includes('implementationCode:');
  const hasRealWorldApps = block.includes('realWorldApplications:');
  
  // Check definition format
  const extDefMatch = block.match(/extendedDefinition:\s*`([^`]+)`/s);
  const hasCorrectFormat = extDefMatch && 
    extDefMatch[1].includes('What it does:') && 
    extDefMatch[1].includes('How it works:') && 
    extDefMatch[1].includes('When to use:');
  
  // Count quiz questions
  const quizMatches = block.match(/question:/g);
  const quizCount = quizMatches ? quizMatches.length : 0;
  
  // Record issues
  if (!hasVisualizer) issues.missingVisualizer.push({ id: topicId, title: topicTitle });
  if (!hasVoiceExplanation) issues.missingVoiceExplanation.push({ id: topicId, title: topicTitle });
  if (!hasQuizQuestions) issues.missingQuizQuestions.push({ id: topicId, title: topicTitle });
  if (hasQuizQuestions && quizCount < 5) issues.insufficientQuizQuestions.push({ id: topicId, title: topicTitle, count: quizCount });
  if (!hasPseudocode) issues.missingPseudocode.push({ id: topicId, title: topicTitle });
  if (!hasKeyConcepts) issues.missingKeyConcepts.push({ id: topicId, title: topicTitle });
  if (!hasImplementation) issues.missingImplementation.push({ id: topicId, title: topicTitle });
  if (!hasCorrectFormat) issues.incorrectDefinitionFormat.push({ id: topicId, title: topicTitle });
  if (!hasRealWorldApps) issues.missingRealWorldApps.push({ id: topicId, title: topicTitle });
  
  topics.push({
    id: topicId,
    title: topicTitle,
    hasVisualizer,
    hasVoiceExplanation,
    hasQuizQuestions,
    quizCount,
    hasPseudocode,
    hasKeyConcepts,
    hasImplementation,
    hasCorrectFormat,
    hasRealWorldApps
  });
});

// Generate comprehensive report
console.log('=== COMPREHENSIVE TOPIC AUDIT ===\n');
console.log(`Total Topics Found: ${topics.length}\n`);

console.log('=== CRITICAL ISSUES ===\n');

console.log(`❌ Missing Visualizer (${issues.missingVisualizer.length}):`);
issues.missingVisualizer.slice(0, 10).forEach(t => console.log(`   - ${t.id}: ${t.title}`));
if (issues.missingVisualizer.length > 10) console.log(`   ... and ${issues.missingVisualizer.length - 10} more`);

console.log(`\n❌ Missing Voice Explanation (${issues.missingVoiceExplanation.length}):`);
issues.missingVoiceExplanation.slice(0, 10).forEach(t => console.log(`   - ${t.id}: ${t.title}`));
if (issues.missingVoiceExplanation.length > 10) console.log(`   ... and ${issues.missingVoiceExplanation.length - 10} more`);

console.log(`\n❌ Missing Quiz Questions (${issues.missingQuizQuestions.length}):`);
issues.missingQuizQuestions.slice(0, 10).forEach(t => console.log(`   - ${t.id}: ${t.title}`));
if (issues.missingQuizQuestions.length > 10) console.log(`   ... and ${issues.missingQuizQuestions.length - 10} more`);

console.log(`\n⚠️  Insufficient Quiz Questions (<5) (${issues.insufficientQuizQuestions.length}):`);
issues.insufficientQuizQuestions.slice(0, 10).forEach(t => console.log(`   - ${t.id}: ${t.title} (${t.count} questions)`));
if (issues.insufficientQuizQuestions.length > 10) console.log(`   ... and ${issues.insufficientQuizQuestions.length - 10} more`);

console.log(`\n❌ Incorrect Definition Format (${issues.incorrectDefinitionFormat.length}):`);
issues.incorrectDefinitionFormat.slice(0, 10).forEach(t => console.log(`   - ${t.id}: ${t.title}`));
if (issues.incorrectDefinitionFormat.length > 10) console.log(`   ... and ${issues.incorrectDefinitionFormat.length - 10} more`);

console.log(`\n❌ Missing Pseudocode (${issues.missingPseudocode.length}):`);
issues.missingPseudocode.slice(0, 10).forEach(t => console.log(`   - ${t.id}: ${t.title}`));
if (issues.missingPseudocode.length > 10) console.log(`   ... and ${issues.missingPseudocode.length - 10} more`);

console.log(`\n❌ Missing Key Concepts (${issues.missingKeyConcepts.length}):`);
issues.missingKeyConcepts.slice(0, 10).forEach(t => console.log(`   - ${t.id}: ${t.title}`));
if (issues.missingKeyConcepts.length > 10) console.log(`   ... and ${issues.missingKeyConcepts.length - 10} more`);

console.log(`\n❌ Missing Implementation Code (${issues.missingImplementation.length}):`);
issues.missingImplementation.slice(0, 10).forEach(t => console.log(`   - ${t.id}: ${t.title}`));
if (issues.missingImplementation.length > 10) console.log(`   ... and ${issues.missingImplementation.length - 10} more`);

console.log(`\n❌ Missing Real World Applications (${issues.missingRealWorldApps.length}):`);
issues.missingRealWorldApps.slice(0, 10).forEach(t => console.log(`   - ${t.id}: ${t.title}`));
if (issues.missingRealWorldApps.length > 10) console.log(`   ... and ${issues.missingRealWorldApps.length - 10} more`);

// Calculate completion percentage
const totalChecks = topics.length * 9; // 9 checks per topic
const passedChecks = topics.reduce((sum, topic) => {
  return sum + 
    (topic.hasVisualizer ? 1 : 0) +
    (topic.hasVoiceExplanation ? 1 : 0) +
    (topic.hasQuizQuestions ? 1 : 0) +
    (topic.quizCount >= 5 ? 1 : 0) +
    (topic.hasPseudocode ? 1 : 0) +
    (topic.hasKeyConcepts ? 1 : 0) +
    (topic.hasImplementation ? 1 : 0) +
    (topic.hasCorrectFormat ? 1 : 0) +
    (topic.hasRealWorldApps ? 1 : 0);
}, 0);

const completionPercentage = ((passedChecks / totalChecks) * 100).toFixed(1);

console.log(`\n=== OVERALL COMPLETION ===`);
console.log(`${completionPercentage}% Complete (${passedChecks}/${totalChecks} checks passed)`);

// Save detailed report
const report = {
  totalTopics: topics.length,
  completionPercentage,
  passedChecks,
  totalChecks,
  issues,
  topics
};

fs.writeFileSync('comprehensive-topic-audit-report.json', JSON.stringify(report, null, 2));
console.log(`\n📄 Detailed report saved to: comprehensive-topic-audit-report.json`);

// Generate priority fix list
console.log(`\n=== PRIORITY FIX LIST ===`);
console.log(`1. Fix ${issues.incorrectDefinitionFormat.length} topics with incorrect definition format`);
console.log(`2. Add visualizers to ${issues.missingVisualizer.length} topics`);
console.log(`3. Add voice explanations to ${issues.missingVoiceExplanation.length} topics`);
console.log(`4. Add/complete quiz questions for ${issues.missingQuizQuestions.length + issues.insufficientQuizQuestions.length} topics`);
console.log(`5. Add pseudocode to ${issues.missingPseudocode.length} topics`);
console.log(`6. Add key concepts to ${issues.missingKeyConcepts.length} topics`);
console.log(`7. Add implementation code to ${issues.missingImplementation.length} topics`);
console.log(`8. Add real-world applications to ${issues.missingRealWorldApps.length} topics`);