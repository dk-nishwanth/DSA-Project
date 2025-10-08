import fs from 'fs';

const topicDetailContent = fs.readFileSync('src/pages/TopicDetail.tsx', 'utf-8');
const dsaTopicsContent = fs.readFileSync('src/data/dsaTopics.ts', 'utf-8');

// Extract all topic IDs
const topicMatches = dsaTopicsContent.matchAll(/id:\s*'([^']+)'/g);
const allTopics = Array.from(topicMatches).map(m => m[1]);

// Parse the switch statement to find which topics share visualizers
const casePattern = /case '([^']+)':/g;
const returnPattern = /return <(\w+)Visualizer \/>;/g;

let currentCases = [];
const visualizerMap = new Map();

const lines = topicDetailContent.split('\n');
let inSwitch = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.includes('renderVisualizer')) {
    inSwitch = true;
    continue;
  }
  
  if (!inSwitch) continue;
  
  if (line.includes('default:')) break;
  
  const caseMatch = line.match(/case '([^']+)':/);
  if (caseMatch) {
    currentCases.push(caseMatch[1]);
  }
  
  const returnMatch = line.match(/return <(\w+) \/>;/);
  if (returnMatch && currentCases.length > 0) {
    const visualizer = returnMatch[1];
    currentCases.forEach(topicId => {
      if (!visualizerMap.has(visualizer)) {
        visualizerMap.set(visualizer, []);
      }
      visualizerMap.get(visualizer).push(topicId);
    });
    currentCases = [];
  }
}

console.log('=== TOPICS SHARING VISUALIZERS ===\n');

const sharedVisualizers = [];
visualizerMap.forEach((topics, visualizer) => {
  if (topics.length > 1) {
    sharedVisualizers.push({ visualizer, topics });
    console.log(`${visualizer}:`);
    topics.forEach(topic => console.log(`  - ${topic}`));
    console.log();
  }
});

console.log(`\n=== SUMMARY ===`);
console.log(`Total visualizers with multiple topics: ${sharedVisualizers.length}`);
console.log(`Topics needing unique visualizers: ${sharedVisualizers.reduce((sum, v) => sum + v.topics.length - 1, 0)}`);

// Save detailed report
fs.writeFileSync('shared-visualizers-report.json', JSON.stringify(sharedVisualizers, null, 2));
console.log('\nDetailed report saved to: shared-visualizers-report.json');
