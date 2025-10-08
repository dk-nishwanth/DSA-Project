import fs from 'fs';

// Read the dsaTopics.ts file
const content = fs.readFileSync('src/data/dsaTopics.ts', 'utf8');

// Count actual topics by looking for id: patterns
const idMatches = content.match(/id:\s*'[^']+'/g);
console.log('Total id: patterns found:', idMatches ? idMatches.length : 0);

// Get unique topic IDs
const uniqueIds = new Set();
if (idMatches) {
    idMatches.forEach(match => {
        const id = match.match(/id:\s*'([^']+)'/)[1];
        uniqueIds.add(id);
    });
}

console.log('Unique topic IDs:', uniqueIds.size);
console.log('First 10 IDs:', Array.from(uniqueIds).slice(0, 10));

// Check if there are duplicates
if (idMatches && idMatches.length !== uniqueIds.size) {
    console.log('⚠️  Found duplicate topic IDs!');
    
    // Find duplicates
    const idCounts = {};
    idMatches.forEach(match => {
        const id = match.match(/id:\s*'([^']+)'/)[1];
        idCounts[id] = (idCounts[id] || 0) + 1;
    });
    
    console.log('\nDuplicate IDs:');
    Object.entries(idCounts).forEach(([id, count]) => {
        if (count > 1) {
            console.log(`  ${id}: ${count} times`);
        }
    });
}