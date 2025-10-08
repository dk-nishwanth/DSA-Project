import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the dsaTopics.ts file
const dsaTopicsPath = path.join(__dirname, 'src', 'data', 'dsaTopics.ts');
const dsaTopicsContent = fs.readFileSync(dsaTopicsPath, 'utf8');

// Extract all topics
const topicMatches = dsaTopicsContent.match(/{\s*id:\s*['"`]([^'"`]+)['"`],\s*title:\s*['"`]([^'"`]+)['"`],\s*description:\s*['"`]([^'"`]+)['"`],\s*category:\s*['"`]([^'"`]+)['"`]/g);

const topics = [];
if (topicMatches) {
    topicMatches.forEach(match => {
        const idMatch = match.match(/id:\s*['"`]([^'"`]+)['"`]/);
        const titleMatch = match.match(/title:\s*['"`]([^'"`]+)['"`]/);
        const categoryMatch = match.match(/category:\s*['"`]([^'"`]+)['"`]/);
        
        if (idMatch && titleMatch && categoryMatch) {
            topics.push({
                id: idMatch[1],
                title: titleMatch[1],
                category: categoryMatch[1]
            });
        }
    });
}

console.log(`Found ${topics.length} topics total`);

// Check existing visualizers
const visualizerDir = path.join(__dirname, 'src', 'components', 'visualizer');
const visualizerFiles = fs.readdirSync(visualizerDir).filter(file => file.endsWith('.tsx'));

console.log(`Found ${visualizerFiles.length} visualizer files`);

// Map topics to visualizers
const topicsWithVisualizers = [];
const topicsWithoutVisualizers = [];

topics.forEach(topic => {
    // Check for exact match
    const exactMatch = visualizerFiles.find(file => 
        file === `${topic.id}-visualizer.tsx` || 
        file === `${topic.id.replace(/-/g, '-')}-visualizer.tsx`
    );
    
    // Check for partial matches
    const partialMatches = visualizerFiles.filter(file => {
        const baseName = file.replace('-visualizer.tsx', '');
        const topicWords = topic.id.split('-');
        return topicWords.some(word => baseName.includes(word));
    });
    
    if (exactMatch) {
        topicsWithVisualizers.push({
            ...topic,
            visualizer: exactMatch,
            matchType: 'exact'
        });
    } else if (partialMatches.length > 0) {
        topicsWithVisualizers.push({
            ...topic,
            visualizer: partialMatches[0],
            matchType: 'partial',
            allMatches: partialMatches
        });
    } else {
        topicsWithoutVisualizers.push(topic);
    }
});

// Group by category
const categorizedTopics = {};
topics.forEach(topic => {
    if (!categorizedTopics[topic.category]) {
        categorizedTopics[topic.category] = [];
    }
    categorizedTopics[topic.category].push(topic);
});

// Generate report
const report = {
    totalTopics: topics.length,
    totalVisualizers: visualizerFiles.length,
    topicsWithVisualizers: topicsWithVisualizers.length,
    topicsWithoutVisualizers: topicsWithoutVisualizers.length,
    categories: Object.keys(categorizedTopics).map(category => ({
        name: category,
        count: categorizedTopics[category].length,
        topics: categorizedTopics[category]
    })),
    missingVisualizers: topicsWithoutVisualizers,
    existingVisualizers: topicsWithVisualizers
};

// Write detailed report
fs.writeFileSync('topics-visualization-analysis.json', JSON.stringify(report, null, 2));

console.log('\n=== TOPICS VISUALIZATION ANALYSIS ===');
console.log(`Total Topics: ${report.totalTopics}`);
console.log(`Topics with Visualizers: ${report.topicsWithVisualizers}`);
console.log(`Topics without Visualizers: ${report.topicsWithoutVisualizers}`);

console.log('\n=== BY CATEGORY ===');
report.categories.forEach(category => {
    console.log(`${category.name}: ${category.count} topics`);
});

console.log('\n=== TOPICS WITHOUT VISUALIZERS ===');
report.missingVisualizers.forEach(topic => {
    console.log(`- ${topic.id} (${topic.title}) [${topic.category}]`);
});

console.log('\n=== TOPICS WITH QUESTIONABLE VISUALIZERS ===');
report.existingVisualizers.filter(topic => topic.matchType === 'partial').forEach(topic => {
    console.log(`- ${topic.id} -> ${topic.visualizer} (${topic.matchType} match)`);
});

console.log('\nDetailed report saved to: topics-visualization-analysis.json');