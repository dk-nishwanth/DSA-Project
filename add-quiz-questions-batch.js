import fs from 'fs';

// Read the current file
const content = fs.readFileSync('src/data/dsaTopics.ts', 'utf8');

// Topics that need additional quiz questions (currently have 1, need 5)
const topicsToFix = [
    'array-basics',
    'array-rotation', 
    'array-subarray-problems',
    'string-palindrome',
    'string-search-kmp',
    'rabin-karp',
    'z-algorithm',
    'manacher-algorithm',
    'string-anagram',
    'linked-list-singly',
    'linked-list-doubly',
    'linked-list-circular'
];

// Quiz questions for each topic
const quizQuestions = {
    'array-basics': [
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
    'array-rotation': [
        {
            question: "What is the space complexity of the reversal algorithm for array rotation?",
            options: ["O(1)", "O(n)", "O(log n)", "O(k)"],
            correctAnswer: 0,
            explanation: "The reversal algorithm rotates the array in-place using only constant extra space."
        },
        {
            question: "To rotate an array of size n by k positions to the right, we can equivalently rotate by:",
            options: ["k positions to the left", "n-k positions to the left", "k%n positions to the right", "Both b and c"],
            correctAnswer: 3,
            explanation: "Both n-k positions left and k%n positions right are equivalent to k positions right."
        },
        {
            question: "Which approach has the best space complexity for array rotation?",
            options: ["Using extra array", "Cyclic replacement", "Reversal method", "Both b and c"],
            correctAnswer: 3,
            explanation: "Both cyclic replacement and reversal method use O(1) extra space."
        },
        {
            question: "What is the key insight behind the reversal algorithm?",
            options: ["Reverse the entire array", "Reverse in three steps", "Use two pointers", "Swap adjacent elements"],
            correctAnswer: 1,
            explanation: "The reversal algorithm works by reversing the entire array, then reversing the first k elements, then reversing the remaining elements."
        }
    ],
    'array-subarray-problems': [
        {
            question: "What is the key insight behind Kadane's algorithm for maximum subarray sum?",
            options: ["Use divide and conquer", "Track running sum and reset when negative", "Sort the array first", "Use sliding window"],
            correctAnswer: 1,
            explanation: "Kadane's algorithm maintains a running sum and resets it to 0 when it becomes negative, keeping track of the maximum seen so far."
        },
        {
            question: "What is the time complexity of finding all subarrays with sum equal to k using prefix sums?",
            options: ["O(n)", "O(n log n)", "O(n²)", "O(2^n)"],
            correctAnswer: 0,
            explanation: "Using a hash map to store prefix sums allows us to find all subarrays with sum k in O(n) time."
        },
        {
            question: "In the sliding window maximum problem, what data structure is most efficient?",
            options: ["Stack", "Queue", "Deque", "Heap"],
            correctAnswer: 2,
            explanation: "A deque (double-ended queue) allows efficient addition and removal from both ends, perfect for sliding window maximum."
        },
        {
            question: "What is the space complexity of Kadane's algorithm?",
            options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
            correctAnswer: 0,
            explanation: "Kadane's algorithm only needs to track the current sum and maximum sum, using constant space."
        }
    ],
    'string-palindrome': [
        {
            question: "What is the space complexity of the two-pointer approach for palindrome checking?",
            options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
            correctAnswer: 0,
            explanation: "The two-pointer approach uses only constant extra space regardless of string length."
        },
        {
            question: "Which approach is most efficient for checking if a string is a palindrome?",
            options: ["Reverse and compare", "Two pointers", "Recursion", "Stack-based"],
            correctAnswer: 1,
            explanation: "Two pointers approach is most efficient with O(n) time and O(1) space complexity."
        },
        {
            question: "When checking palindromes, how should case sensitivity be handled?",
            options: ["Always case-sensitive", "Always ignore case", "Depends on requirements", "Convert to lowercase"],
            correctAnswer: 2,
            explanation: "Case sensitivity handling depends on the specific requirements of the problem."
        },
        {
            question: "What is the time complexity of expanding around centers to find all palindromic substrings?",
            options: ["O(n)", "O(n²)", "O(n³)", "O(n log n)"],
            correctAnswer: 1,
            explanation: "Expanding around each possible center takes O(n²) time in the worst case."
        }
    ],
    'string-search-kmp': [
        {
            question: "What is the space complexity of the KMP algorithm?",
            options: ["O(1)", "O(m)", "O(n)", "O(m+n)"],
            correctAnswer: 1,
            explanation: "KMP algorithm requires O(m) space to store the failure function array, where m is the pattern length."
        },
        {
            question: "What does the failure function in KMP represent?",
            options: ["Number of mismatches", "Longest proper prefix which is also suffix", "Pattern frequency", "Character positions"],
            correctAnswer: 1,
            explanation: "The failure function stores the length of the longest proper prefix which is also a suffix for each position."
        },
        {
            question: "In the worst case, how many character comparisons does KMP make?",
            options: ["O(n)", "O(m)", "O(n+m)", "O(nm)"],
            correctAnswer: 2,
            explanation: "KMP makes at most O(n+m) character comparisons, where n is text length and m is pattern length."
        },
        {
            question: "What is the key advantage of KMP over naive string matching?",
            options: ["Uses less space", "Simpler implementation", "Never re-examines text characters", "Works with any alphabet"],
            correctAnswer: 2,
            explanation: "KMP's key advantage is that it never re-examines characters in the text that have already been matched."
        }
    ],
    'rabin-karp': [
        {
            question: "What is the expected time complexity of Rabin-Karp algorithm?",
            options: ["O(n)", "O(n+m)", "O(nm)", "O(n²)"],
            correctAnswer: 1,
            explanation: "Rabin-Karp has expected time complexity of O(n+m) with a good hash function."
        },
        {
            question: "What happens when hash values match in Rabin-Karp?",
            options: ["Pattern is found", "Check character by character", "Continue to next position", "Report false positive"],
            correctAnswer: 1,
            explanation: "When hash values match, we must verify character by character to avoid false positives."
        },
        {
            question: "What is the worst-case time complexity of Rabin-Karp?",
            options: ["O(n)", "O(n+m)", "O(nm)", "O(n²)"],
            correctAnswer: 2,
            explanation: "In the worst case (many hash collisions), Rabin-Karp degrades to O(nm) like naive search."
        },
        {
            question: "What is the key technique for efficient hash computation in Rabin-Karp?",
            options: ["Polynomial hashing", "Rolling hash", "Cryptographic hash", "Perfect hashing"],
            correctAnswer: 1,
            explanation: "Rolling hash allows computing the hash of the next substring in O(1) time using the previous hash value."
        }
    ],
    'z-algorithm': [
        {
            question: "What is the time complexity of the Z algorithm?",
            options: ["O(n)", "O(n log n)", "O(n²)", "O(nm)"],
            correctAnswer: 0,
            explanation: "The Z algorithm runs in linear O(n) time due to its clever use of previously computed information."
        },
        {
            question: "What is the space complexity of the Z algorithm?",
            options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
            correctAnswer: 1,
            explanation: "The Z algorithm requires O(n) space to store the Z array."
        },
        {
            question: "In the Z algorithm, what do the variables l and r represent?",
            options: ["Left and right pointers", "Pattern boundaries", "Z-box boundaries", "String indices"],
            correctAnswer: 2,
            explanation: "l and r represent the boundaries of the rightmost Z-box found so far."
        },
        {
            question: "What is the main application of the Z algorithm?",
            options: ["Sorting strings", "Pattern matching", "String compression", "Palindrome detection"],
            correctAnswer: 1,
            explanation: "The Z algorithm is primarily used for efficient pattern matching in strings."
        }
    ],
    'manacher-algorithm': [
        {
            question: "What is the time complexity of Manacher's algorithm?",
            options: ["O(n)", "O(n log n)", "O(n²)", "O(n³)"],
            correctAnswer: 0,
            explanation: "Manacher's algorithm finds all palindromic substrings in linear O(n) time."
        },
        {
            question: "What is the space complexity of Manacher's algorithm?",
            options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
            correctAnswer: 1,
            explanation: "Manacher's algorithm requires O(n) space for the processed string and palindrome length array."
        },
        {
            question: "What is the key insight that makes Manacher's algorithm efficient?",
            options: ["Dynamic programming", "Reusing previously computed palindrome information", "Divide and conquer", "Greedy approach"],
            correctAnswer: 1,
            explanation: "Manacher's algorithm efficiently reuses information about previously found palindromes to avoid redundant computations."
        },
        {
            question: "How does Manacher's algorithm handle even-length palindromes?",
            options: ["Separate algorithm", "Preprocessing with separators", "Two-pass approach", "Ignore them"],
            correctAnswer: 1,
            explanation: "Manacher's algorithm preprocesses the string by inserting separators (like '#') to handle both odd and even length palindromes uniformly."
        }
    ],
    'string-anagram': [
        {
            question: "What is the time complexity of the sorting approach for anagram detection?",
            options: ["O(n)", "O(n log n)", "O(n²)", "O(1)"],
            correctAnswer: 1,
            explanation: "Sorting both strings takes O(n log n) time, where n is the length of the strings."
        },
        {
            question: "What is the space complexity of the frequency counting approach?",
            options: ["O(1)", "O(n)", "O(k)", "O(n²)"],
            correctAnswer: 2,
            explanation: "The space complexity is O(k) where k is the size of the character set (constant for fixed alphabets like ASCII)."
        },
        {
            question: "Which approach is more efficient for anagram detection with large strings?",
            options: ["Sorting", "Frequency counting", "Both are equal", "Depends on alphabet size"],
            correctAnswer: 1,
            explanation: "Frequency counting is O(n) time vs O(n log n) for sorting, making it more efficient for large strings."
        },
        {
            question: "What is a necessary condition for two strings to be anagrams?",
            options: ["Same characters", "Same length", "Same character frequencies", "All of the above"],
            correctAnswer: 3,
            explanation: "For strings to be anagrams, they must have the same length, same characters, and same character frequencies."
        }
    ],
    'linked-list-singly': [
        {
            question: "What is the space complexity of a singly linked list with n elements?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctAnswer: 2,
            explanation: "A singly linked list requires O(n) space to store n nodes, each containing data and a next pointer."
        },
        {
            question: "What is the time complexity of searching for an element in a singly linked list?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctAnswer: 2,
            explanation: "Searching requires traversing the list from head to find the element, taking O(n) time in the worst case."
        },
        {
            question: "Which operation is most efficient in a singly linked list?",
            options: ["Insert at tail", "Insert at head", "Delete from middle", "Search by value"],
            correctAnswer: 1,
            explanation: "Inserting at the head is O(1) since we just create a new node and update the head pointer."
        },
        {
            question: "What is the main disadvantage of singly linked lists compared to arrays?",
            options: ["More memory usage", "No random access", "Complex insertion", "All of the above"],
            correctAnswer: 1,
            explanation: "The main disadvantage is lack of random access - we must traverse from the head to reach any element."
        }
    ],
    'linked-list-doubly': [
        {
            question: "What is the extra space overhead of a doubly linked list compared to singly linked list?",
            options: ["No extra space", "One extra pointer per node", "Two extra pointers per node", "Depends on implementation"],
            correctAnswer: 1,
            explanation: "Each node in a doubly linked list has one additional 'prev' pointer compared to singly linked list."
        },
        {
            question: "What is the time complexity of deleting a node when you have a reference to it?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctAnswer: 0,
            explanation: "With a reference to the node, deletion is O(1) since we can directly update the prev and next pointers."
        },
        {
            question: "Which traversal directions are possible in a doubly linked list?",
            options: ["Forward only", "Backward only", "Both forward and backward", "Random access"],
            correctAnswer: 2,
            explanation: "Doubly linked lists support both forward (using next) and backward (using prev) traversal."
        },
        {
            question: "What is the main advantage of doubly linked lists over singly linked lists?",
            options: ["Less memory usage", "Faster search", "Bidirectional traversal", "Better cache performance"],
            correctAnswer: 2,
            explanation: "The main advantage is bidirectional traversal capability due to the prev pointers."
        }
    ],
    'linked-list-circular': [
        {
            question: "In a circular linked list, what does the last node point to?",
            options: ["null", "The first node", "The previous node", "A sentinel node"],
            correctAnswer: 1,
            explanation: "In a circular linked list, the last node's next pointer points back to the first node, forming a circle."
        },
        {
            question: "What is the main challenge when traversing a circular linked list?",
            options: ["Memory allocation", "Detecting the end", "Pointer arithmetic", "Cache misses"],
            correctAnswer: 1,
            explanation: "The main challenge is detecting when we've completed a full cycle since there's no null pointer to indicate the end."
        },
        {
            question: "How do you detect if you've completed a full traversal of a circular linked list?",
            options: ["Count nodes", "Check for null", "Return to starting node", "Use a flag"],
            correctAnswer: 2,
            explanation: "You detect completion by checking if you've returned to the starting node after traversal."
        },
        {
            question: "What is a common application of circular linked lists?",
            options: ["Undo operations", "Round-robin scheduling", "Stack implementation", "Binary search"],
            correctAnswer: 1,
            explanation: "Circular linked lists are commonly used in round-robin scheduling where processes are cycled through continuously."
        }
    ]
};

console.log('Starting to add quiz questions to topics...');

let updatedContent = content;
let changesCount = 0;

for (const topicId of topicsToFix) {
    if (quizQuestions[topicId]) {
        console.log(`\nProcessing ${topicId}...`);
        
        // Find the existing quiz question in the topic
        const topicRegex = new RegExp(`(id: '${topicId}'[\\s\\S]*?quizQuestions: \\[\\s*{[\\s\\S]*?}\\s*)(\\]\\s*},)`, 'g');
        const match = topicRegex.exec(updatedContent);
        
        if (match) {
            // Add the additional quiz questions
            const additionalQuestions = quizQuestions[topicId].map(q => 
                `            {
                question: "${q.question}",
                options: ${JSON.stringify(q.options)},
                correctAnswer: ${q.correctAnswer},
                explanation: "${q.explanation}"
            }`
            ).join(',\n');
            
            const replacement = match[1] + ',\n' + additionalQuestions + '\n        ' + match[2];
            updatedContent = updatedContent.replace(match[0], replacement);
            changesCount++;
            console.log(`✅ Added ${quizQuestions[topicId].length} quiz questions to ${topicId}`);
        } else {
            console.log(`❌ Could not find quiz section for ${topicId}`);
        }
    }
}

if (changesCount > 0) {
    // Write the updated content back to the file
    fs.writeFileSync('src/data/dsaTopics.ts', updatedContent);
    console.log(`\n🎉 Successfully updated ${changesCount} topics with additional quiz questions!`);
} else {
    console.log('\n❌ No changes were made.');
}