export interface Assignment {
  id: string;
  title: string;
  description: string;
  questionType: 'quiz' | 'program' | 'problem' | 'essay' | 'multiple-choice';
  difficulty: 'easy' | 'medium' | 'hard';
  topicId?: string; // Related DSA topic
  dueDate?: Date;
  points: number;
  createdAt: Date;
  createdBy: string; // Admin ID
  isActive: boolean;
  submissions: AssignmentSubmission[];
  question: AssignmentQuestion;
  instructions?: string;
  tags: string[];
}

export interface AssignmentQuestion {
  type: 'quiz' | 'program' | 'problem' | 'essay' | 'multiple-choice';
  content: string;
  options?: string[]; // For multiple choice
  correctAnswer?: number; // For quiz/multiple choice
  testCases?: TestCase[]; // For programming questions
  expectedOutput?: string; // For programming questions
  constraints?: string; // For programming questions
  rubric?: RubricItem[]; // For essay questions
  codeTemplate?: string; // For programming questions
  language?: 'javascript' | 'python' | 'java' | 'cpp' | 'csharp';
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  description?: string;
}

export interface RubricItem {
  criterion: string;
  maxPoints: number;
  description: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  userId: string;
  username: string;
  submittedAt: Date;
  answer: string;
  code?: string;
  language?: string;
  testResults?: TestResult[];
  score?: number;
  maxScore: number;
  feedback?: string;
  status: 'submitted' | 'graded' | 'late';
  isLate: boolean;
}

export interface TestResult {
  testCase: TestCase;
  passed: boolean;
  actualOutput?: string;
  executionTime?: number;
  memoryUsed?: number;
}

// Sample assignments
export const SAMPLE_ASSIGNMENTS: Assignment[] = [
  {
    id: 'assign-1',
    title: 'Array Rotation Implementation',
    description: 'Implement the juggling algorithm for array rotation and analyze its time complexity.',
    questionType: 'program',
    difficulty: 'medium',
    topicId: 'array-rotation',
    dueDate: new Date('2024-02-15'),
    points: 20,
    createdAt: new Date('2024-01-20'),
    createdBy: 'admin-1',
    isActive: true,
    submissions: [],
    question: {
      type: 'program',
      content: `Write a function to rotate an array to the left by k positions using the juggling algorithm.

Requirements:
1. Implement the juggling algorithm for array rotation
2. Handle edge cases (empty array, k > array length)
3. Provide time and space complexity analysis
4. Include test cases to verify your implementation

Example:
Input: arr = [1, 2, 3, 4, 5], k = 2
Output: [3, 4, 5, 1, 2]`,
      language: 'javascript',
      codeTemplate: `function rotateArray(arr, k) {
    // Your implementation here
}

// Test cases
console.log(rotateArray([1, 2, 3, 4, 5], 2)); // Should output: [3, 4, 5, 1, 2]
console.log(rotateArray([1, 2, 3, 4, 5], 0)); // Should output: [1, 2, 3, 4, 5]
console.log(rotateArray([], 2)); // Should handle empty array`,
      testCases: [
        {
          input: '[1, 2, 3, 4, 5], 2',
          expectedOutput: '[3, 4, 5, 1, 2]',
          isHidden: false,
          description: 'Basic rotation test'
        },
        {
          input: '[1, 2, 3, 4, 5], 0',
          expectedOutput: '[1, 2, 3, 4, 5]',
          isHidden: false,
          description: 'No rotation test'
        },
        {
          input: '[1, 2, 3, 4, 5], 7',
          expectedOutput: '[3, 4, 5, 1, 2]',
          isHidden: true,
          description: 'Rotation with k > array length'
        }
      ],
      constraints: 'Time complexity should be O(n), Space complexity should be O(1)'
    },
    instructions: 'Submit your code implementation along with complexity analysis.',
    tags: ['arrays', 'rotation', 'algorithms']
  },
  {
    id: 'assign-2',
    title: 'Bubble Sort Analysis',
    description: 'Analyze the bubble sort algorithm and answer questions about its performance.',
    questionType: 'quiz',
    difficulty: 'easy',
    topicId: 'bubble-sort',
    dueDate: new Date('2024-02-10'),
    points: 15,
    createdAt: new Date('2024-01-18'),
    createdBy: 'admin-1',
    isActive: true,
    submissions: [],
    question: {
      type: 'quiz',
      content: 'What is the worst-case time complexity of bubble sort?',
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'],
      correctAnswer: 2
    },
    instructions: 'Select the correct answer from the given options.',
    tags: ['sorting', 'bubble-sort', 'complexity']
  },
  {
    id: 'assign-3',
    title: 'Binary Search Implementation',
    description: 'Implement binary search and explain when it can and cannot be used.',
    questionType: 'problem',
    difficulty: 'medium',
    topicId: 'binary-search',
    dueDate: new Date('2024-02-20'),
    points: 25,
    createdAt: new Date('2024-01-22'),
    createdBy: 'admin-1',
    isActive: true,
    submissions: [],
    question: {
      type: 'problem',
      content: `Implement binary search and answer the following questions:

1. Write a function that performs binary search on a sorted array
2. What is the time complexity of binary search?
3. What is the space complexity of binary search?
4. When can binary search NOT be used?
5. Provide an example where binary search would fail

Your answer should include:
- Complete code implementation
- Detailed explanation of the algorithm
- Analysis of time and space complexity
- Examples of when binary search works and when it doesn't`,
      testCases: [
        {
          input: '[1, 3, 5, 7, 9], 5',
          expectedOutput: '2',
          isHidden: false,
          description: 'Element found in middle'
        },
        {
          input: '[1, 3, 5, 7, 9], 4',
          expectedOutput: '-1',
          isHidden: false,
          description: 'Element not found'
        }
      ]
    },
    instructions: 'Provide a complete implementation with detailed explanations.',
    tags: ['searching', 'binary-search', 'algorithms']
  },
  {
    id: 'assign-4',
    title: 'Dynamic Programming Essay',
    description: 'Write an essay explaining the concept of dynamic programming with examples.',
    questionType: 'essay',
    difficulty: 'hard',
    topicId: 'dp-introduction',
    dueDate: new Date('2024-02-25'),
    points: 30,
    createdAt: new Date('2024-01-25'),
    createdBy: 'admin-1',
    isActive: true,
    submissions: [],
    question: {
      type: 'essay',
      content: `Write a comprehensive essay on Dynamic Programming covering the following topics:

1. What is Dynamic Programming?
2. When should you use Dynamic Programming?
3. Explain the difference between top-down and bottom-up approaches
4. Provide at least 2 examples of problems that can be solved using DP
5. Discuss the advantages and disadvantages of Dynamic Programming

Your essay should be well-structured, include relevant examples, and demonstrate understanding of the concepts.`,
      rubric: [
        {
          criterion: 'Understanding of DP Concepts',
          maxPoints: 8,
          description: 'Clear explanation of what DP is and when to use it'
        },
        {
          criterion: 'Examples and Applications',
          maxPoints: 8,
          description: 'Good examples with explanations'
        },
        {
          criterion: 'Comparison of Approaches',
          maxPoints: 6,
          description: 'Clear explanation of top-down vs bottom-up'
        },
        {
          criterion: 'Analysis and Critical Thinking',
          maxPoints: 5,
          description: 'Discussion of advantages and disadvantages'
        },
        {
          criterion: 'Writing Quality',
          maxPoints: 3,
          description: 'Well-structured, clear, and coherent writing'
        }
      ]
    },
    instructions: 'Write a comprehensive essay following the rubric provided.',
    tags: ['dynamic-programming', 'algorithms', 'problem-solving']
  },
  {
    id: 'assign-5',
    title: 'Graph Traversal Methods',
    description: 'Compare and contrast different graph traversal algorithms.',
    questionType: 'multiple-choice',
    difficulty: 'medium',
    topicId: 'graph-dfs',
    dueDate: new Date('2024-02-12'),
    points: 10,
    createdAt: new Date('2024-01-19'),
    createdBy: 'admin-1',
    isActive: true,
    submissions: [],
    question: {
      type: 'multiple-choice',
      content: 'Which of the following statements about DFS and BFS is correct?',
      options: [
        'DFS always uses less memory than BFS',
        'BFS is better for finding the shortest path in unweighted graphs',
        'DFS is always faster than BFS',
        'BFS cannot be implemented recursively'
      ],
      correctAnswer: 1
    },
    instructions: 'Select the most accurate statement about DFS and BFS.',
    tags: ['graphs', 'traversal', 'dfs', 'bfs']
  }
];

// Assignment management functions
export const createAssignment = (assignment: Omit<Assignment, 'id' | 'createdAt' | 'submissions'>): Assignment => {
  return {
    ...assignment,
    id: `assign-${Date.now()}`,
    createdAt: new Date(),
    submissions: []
  };
};

export const submitAssignment = (
  assignment: Assignment,
  submission: Omit<AssignmentSubmission, 'id' | 'submittedAt' | 'status' | 'isLate'>
): Assignment => {
  const isLate = assignment.dueDate ? new Date() > assignment.dueDate : false;
  const status = isLate ? 'late' : 'submitted';
  
  const newSubmission: AssignmentSubmission = {
    ...submission,
    id: `submission-${Date.now()}`,
    submittedAt: new Date(),
    status,
    isLate
  };
  
  return {
    ...assignment,
    submissions: [...assignment.submissions, newSubmission]
  };
};

export const gradeSubmission = (
  assignment: Assignment,
  submissionId: string,
  score: number,
  feedback?: string
): Assignment => {
  return {
    ...assignment,
    submissions: assignment.submissions.map(sub => 
      sub.id === submissionId 
        ? { ...sub, score, feedback, status: 'graded' as const }
        : sub
    )
  };
};

// Helper function to get all assignments (both sample and from localStorage)
const getAllAssignments = (): Assignment[] => {
  // Get assignments from localStorage
  const localStorageAssignments = JSON.parse(localStorage.getItem('dsa_assignments') || '[]');
  
  // Combine with sample assignments
  return [...SAMPLE_ASSIGNMENTS, ...localStorageAssignments];
};

export const getAssignmentById = (id: string): Assignment | undefined => {
  return getAllAssignments().find(assignment => assignment.id === id);
};

export const getAssignmentsByTopic = (topicId: string): Assignment[] => {
  return getAllAssignments().filter(assignment => assignment.topicId === topicId);
};

export const getActiveAssignments = (): Assignment[] => {
  // Filter active assignments
  return getAllAssignments().filter(assignment => assignment.isActive);
};

export const getAssignmentsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): Assignment[] => {
  return getAllAssignments().filter(assignment => assignment.difficulty === difficulty);
};

export const getAssignmentsByType = (type: Assignment['questionType']): Assignment[] => {
  return getAllAssignments().filter(assignment => assignment.questionType === type);
};

// Helper functions for question types
export const getQuestionTypeIcon = (type: Assignment['questionType']) => {
  switch (type) {
    case 'quiz':
      return '🎯';
    case 'program':
      return '💻';
    case 'problem':
      return '📝';
    case 'essay':
      return '✍️';
    case 'multiple-choice':
      return '☑️';
    default:
      return '📋';
  }
};

export const getQuestionTypeLabel = (type: Assignment['questionType']) => {
  switch (type) {
    case 'quiz':
      return 'Quiz';
    case 'program':
      return 'Programming';
    case 'problem':
      return 'Problem Solving';
    case 'essay':
      return 'Essay';
    case 'multiple-choice':
      return 'Multiple Choice';
    default:
      return 'Assignment';
  }
};

export const getDifficultyColor = (difficulty: Assignment['difficulty']) => {
  switch (difficulty) {
    case 'easy':
      return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
    case 'medium':
      return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
    case 'hard':
      return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
    default:
      return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300';
  }
};
