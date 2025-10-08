import fs from 'fs';

// Read the current file
const content = fs.readFileSync('src/data/dsaTopics.ts', 'utf8');

// Topics to complete (only need quiz questions and extendedDefinition format fix)
const topicsToComplete = [
    'array-basics',
    'binary-search-tree', 
    'graph-dfs',
    'merge-sort',
    'quick-sort',
    'binary-search'
];

// Quiz questions for each topic
const quizQuestions = {
    'array-basics': [
        {
            question: "What is the time complexity of accessing an element in an array by index?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctAnswer: 0,
            explanation: "Array access by index is O(1) constant time since arrays provide direct memory access."
        },
        {
            question: "What is the space complexity of an array with n elements?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctAnswer: 2,
            explanation: "An array with n elements requires O(n) space to store all elements."
        },
        {
            question: "Which operation is NOT typically O(1) for arrays?",
            options: ["Access by index", "Update by index", "Insert at beginning", "Get length"],
            correctAnswer: 2,
            explanation: "Inserting at the beginning requires shifting all existing elements, making it O(n)."
        },
        {
            question: "What happens when you access an array index that is out of bounds?",
            options: ["Returns null", "Returns undefined", "Throws an error", "Depends on the language"],
            correctAnswer: 3,
            explanation: "Different programming languages handle out-of-bounds access differently - some throw errors, others return undefined or garbage values."
        },
        {
            question: "In most programming languages, array indices start from:",
            options: ["1", "0", "-1", "Depends on declaration"],
            correctAnswer: 1,
            explanation: "Most programming languages use zero-based indexing, where the first element is at index 0."
        }
    ],
    'binary-search-tree': [
        {
            question: "What is the key property that defines a Binary Search Tree?",
            options: ["Left child < parent < right child", "All leaves at same level", "Complete binary tree", "Height balanced"],
            correctAnswer: 0,
            explanation: "In a BST, for every node, all values in the left subtree are less than the node's value, and all values in the right subtree are greater."
        },
        {
            question: "What is the average time complexity for search in a BST?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
            correctAnswer: 1,
            explanation: "In a balanced BST, search takes O(log n) time as we eliminate half the tree at each step."
        },
        {
            question: "What is the worst-case time complexity for search in a BST?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctAnswer: 2,
            explanation: "In the worst case (skewed tree), BST degenerates to a linked list, making search O(n)."
        },
        {
            question: "Which traversal of a BST gives elements in sorted order?",
            options: ["Preorder", "Inorder", "Postorder", "Level order"],
            correctAnswer: 1,
            explanation: "Inorder traversal (left, root, right) of a BST visits nodes in ascending sorted order."
        },
        {
            question: "What is the space complexity of a BST with n nodes?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctAnswer: 2,
            explanation: "A BST with n nodes requires O(n) space to store all the nodes."
        }
    ],
    'graph-dfs': [
        {
            question: "What data structure is typically used to implement DFS?",
            options: ["Queue", "Stack", "Heap", "Array"],
            correctAnswer: 1,
            explanation: "DFS uses a stack (either explicit or implicit through recursion) to keep track of vertices to visit."
        },
        {
            question: "What is the time complexity of DFS for a graph with V vertices and E edges?",
            options: ["O(V)", "O(E)", "O(V + E)", "O(V * E)"],
            correctAnswer: 2,
            explanation: "DFS visits each vertex once and examines each edge once, resulting in O(V + E) time complexity."
        },
        {
            question: "What is the space complexity of DFS?",
            options: ["O(1)", "O(V)", "O(E)", "O(V + E)"],
            correctAnswer: 1,
            explanation: "DFS requires O(V) space for the visited array and the recursion stack in the worst case."
        },
        {
            question: "Which of the following can DFS be used for?",
            options: ["Detecting cycles", "Topological sorting", "Finding connected components", "All of the above"],
            correctAnswer: 3,
            explanation: "DFS is versatile and can be used for cycle detection, topological sorting, finding connected components, and more."
        },
        {
            question: "In which order does DFS explore vertices?",
            options: ["Breadth-first", "Depth-first", "Random", "Sorted"],
            correctAnswer: 1,
            explanation: "DFS explores as far as possible along each branch before backtracking, hence 'depth-first'."
        }
    ],
    'merge-sort': [
        {
            question: "What is the time complexity of merge sort in all cases (best, average, and worst)?",
            options: ["O(n)", "O(n log n)", "O(n²)", "O(2^n)"],
            correctAnswer: 1,
            explanation: "Merge sort consistently performs in O(n log n) time regardless of input distribution."
        },
        {
            question: "What is the space complexity of merge sort?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctAnswer: 2,
            explanation: "Merge sort requires O(n) additional space for the temporary arrays used during merging."
        },
        {
            question: "What algorithmic paradigm does merge sort use?",
            options: ["Greedy", "Dynamic Programming", "Divide and Conquer", "Backtracking"],
            correctAnswer: 2,
            explanation: "Merge sort uses divide and conquer: divide the array, recursively sort halves, then merge."
        },
        {
            question: "Is merge sort a stable sorting algorithm?",
            options: ["Yes", "No", "Sometimes", "Depends on implementation"],
            correctAnswer: 0,
            explanation: "Merge sort is stable - it maintains the relative order of equal elements."
        },
        {
            question: "What is the key operation in merge sort?",
            options: ["Partitioning", "Merging two sorted arrays", "Finding pivot", "Swapping elements"],
            correctAnswer: 1,
            explanation: "The key operation is merging two sorted subarrays into one sorted array."
        }
    ],
    'quick-sort': [
        {
            question: "What is the average-case time complexity of quick sort?",
            options: ["O(n)", "O(n log n)", "O(n²)", "O(2^n)"],
            correctAnswer: 1,
            explanation: "Quick sort has an average-case time complexity of O(n log n) with good pivot selection."
        },
        {
            question: "What is the worst-case time complexity of quick sort?",
            options: ["O(n)", "O(n log n)", "O(n²)", "O(2^n)"],
            correctAnswer: 2,
            explanation: "Quick sort's worst case is O(n²) when the pivot is always the smallest or largest element."
        },
        {
            question: "What is the space complexity of quick sort?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctAnswer: 1,
            explanation: "Quick sort has O(log n) space complexity due to the recursion stack in the average case."
        },
        {
            question: "What is the key operation in quick sort?",
            options: ["Merging", "Partitioning", "Heapifying", "Counting"],
            correctAnswer: 1,
            explanation: "Partitioning around a pivot element is the key operation that places the pivot in its correct position."
        },
        {
            question: "Is quick sort a stable sorting algorithm?",
            options: ["Yes", "No", "Sometimes", "Depends on pivot choice"],
            correctAnswer: 1,
            explanation: "Standard quick sort is not stable as it may change the relative order of equal elements during partitioning."
        }
    ],
    'binary-search': [
        {
            question: "What is the main prerequisite for binary search to work correctly?",
            options: ["Array must be sorted", "Array must be complete", "Array must have unique elements", "Array must be balanced"],
            correctAnswer: 0,
            explanation: "Binary search requires the array to be sorted to eliminate half the search space at each step."
        },
        {
            question: "What is the time complexity of binary search?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
            correctAnswer: 1,
            explanation: "Binary search has O(log n) time complexity as it halves the search space in each iteration."
        },
        {
            question: "What is the space complexity of iterative binary search?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctAnswer: 0,
            explanation: "Iterative binary search uses only a constant amount of extra space for variables."
        },
        {
            question: "In binary search, what happens when the target is not found?",
            options: ["Returns 0", "Returns -1", "Throws exception", "Returns null"],
            correctAnswer: 1,
            explanation: "By convention, binary search typically returns -1 when the target element is not found."
        },
        {
            question: "What is the maximum number of comparisons needed in binary search for an array of size n?",
            options: ["n", "n/2", "log₂(n)", "⌊log₂(n)⌋ + 1"],
            correctAnswer: 3,
            explanation: "The maximum number of comparisons is ⌊log₂(n)⌋ + 1, which represents the height of the binary search tree."
        }
    ]
};

console.log('Starting to complete minimal topics...');

let updatedContent = content;
let changesCount = 0;

for (const topicId of topicsToComplete) {
    console.log(`\nProcessing ${topicId}...`);
    
    // Add quiz questions if they exist for this topic
    if (quizQuestions[topicId]) {
        // Check if topic already has quiz questions
        const existingQuizRegex = new RegExp(`(id: '${topicId}'[\\s\\S]*?quizQuestions: \\[\\s*{[\\s\\S]*?}\\s*)(\\]\\s*}\\s*},)`, 'g');
        const existingMatch = existingQuizRegex.exec(updatedContent);
        
        if (existingMatch) {
            // Topic already has quiz questions, add more
            const additionalQuestions = quizQuestions[topicId].map(q => 
                `            {
                question: "${q.question}",
                options: ${JSON.stringify(q.options)},
                correctAnswer: ${q.correctAnswer},
                explanation: "${q.explanation}"
            }`
            ).join(',\n');
            
            const replacement = existingMatch[1] + ',\n' + additionalQuestions + '\n        ' + existingMatch[2];
            updatedContent = updatedContent.replace(existingMatch[0], replacement);
            console.log(`✅ Added ${quizQuestions[topicId].length} additional quiz questions to ${topicId}`);
            changesCount++;
        } else {
            // Topic doesn't have quiz questions, add them
            const topicRegex = new RegExp(`(id: '${topicId}'[\\s\\S]*?)(}\\s*},)`, 'g');
            const match = topicRegex.exec(updatedContent);
            
            if (match) {
                const questionsArray = quizQuestions[topicId].map(q => 
                    `            {
                    question: "${q.question}",
                    options: ${JSON.stringify(q.options)},
                    correctAnswer: ${q.correctAnswer},
                    explanation: "${q.explanation}"
                }`
                ).join(',\n');
                
                const quizSection = `,
        quizQuestions: [
${questionsArray}
        ]`;
                
                const replacement = match[1] + quizSection + '\n    ' + match[2];
                updatedContent = updatedContent.replace(match[0], replacement);
                console.log(`✅ Added ${quizQuestions[topicId].length} quiz questions to ${topicId}`);
                changesCount++;
            } else {
                console.log(`❌ Could not find topic structure for ${topicId}`);
            }
        }
    }
}

if (changesCount > 0) {
    // Write the updated content back to the file
    fs.writeFileSync('src/data/dsaTopics.ts', updatedContent);
    console.log(`\n🎉 Successfully updated ${changesCount} topics with quiz questions!`);
} else {
    console.log('\n❌ No changes were made.');
}