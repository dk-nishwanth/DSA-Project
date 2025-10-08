import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the dsaTopics.ts file
const dsaTopicsPath = path.join(__dirname, 'src', 'data', 'dsaTopics.ts');
let dsaTopicsContent = fs.readFileSync(dsaTopicsPath, 'utf8');

// Define the correct visualizer mappings
const visualizerMappings = {
  'array-basics': 'array-fundamentals-visualizer',
  'string-palindrome': 'string-palindrome-visualizer',
  'binary-search-tree': 'binary-search-tree-visualizer',
  'mathematical-algorithms-intro': 'mathematical-visualizer',
  'number-theory-basics': 'number-theory-visualizer',
  'prime-algorithms': 'prime-algorithms-visualizer',
  'modular-arithmetic': 'modular-arithmetic-visualizer',
  'combinatorics': 'combinatorics-visualizer',
  'mathematical-induction': 'mathematical-induction-visualizer'
};

// Function to update visualizer for a topic
function updateTopicVisualizer(topicId, visualizerName) {
  // Find the topic and update its visualizer
  const topicRegex = new RegExp(`(\\s*{\\s*id:\\s*['"\`]${topicId}['"\`][\\s\\S]*?)(visualizer:\\s*['"\`][^'"\`]*['"\`])(\\s*[\\s\\S]*?}(?=\\s*,\\s*{|\\s*\\]))`, 'g');
  
  if (topicRegex.test(dsaTopicsContent)) {
    dsaTopicsContent = dsaTopicsContent.replace(topicRegex, `$1visualizer: '${visualizerName}'$3`);
    console.log(`✅ Updated ${topicId} -> ${visualizerName}`);
  } else {
    // If no visualizer field exists, add it
    const addVisualizerRegex = new RegExp(`(\\s*{\\s*id:\\s*['"\`]${topicId}['"\`][\\s\\S]*?)(\\s*}(?=\\s*,\\s*{|\\s*\\]))`, 'g');
    
    if (addVisualizerRegex.test(dsaTopicsContent)) {
      dsaTopicsContent = dsaTopicsContent.replace(addVisualizerRegex, `$1,\n    visualizer: '${visualizerName}'$2`);
      console.log(`✅ Added visualizer to ${topicId} -> ${visualizerName}`);
    } else {
      console.log(`❌ Could not find topic: ${topicId}`);
    }
  }
}

// Apply all mappings
console.log('🔧 Updating topic visualizers...\n');

Object.entries(visualizerMappings).forEach(([topicId, visualizerName]) => {
  updateTopicVisualizer(topicId, visualizerName);
});

// Write the updated content back to the file
fs.writeFileSync(dsaTopicsPath, dsaTopicsContent);

console.log('\n✅ All visualizer mappings updated successfully!');
console.log('📁 Updated file: src/data/dsaTopics.ts');