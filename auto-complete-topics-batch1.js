import fs from 'fs';

// This script adds missing components to the first batch of priority topics

const topicsToFix = [
    {
        id: 'linked-list-singly',
        needs: ['realWorldApplications', 'keyConcepts', 'pseudocode', 'implementationCode']
    },
    {
        id: 'linked-list-circular',
        needs: ['extendedDefinition', 'voiceExplanation', 'realWorldApplications', 'keyConcepts', 'pseudocode', 'implementationCode']
    },
    {
        id: 'binary-tree',
        needs: ['extendedDefinition', 'voiceExplanation', 'realWorldApplications', 'keyConcepts', 'pseudocode', 'implementationCode']
    },
    {
        id: 'heap-operations',
        needs: ['voiceExplanation', 'realWorldApplications', 'keyConcepts', 'pseudocode', 'implementationCode']
    },
    {
        id: 'graph-bfs',
        needs: ['voiceExplanation', 'realWorldApplications', 'keyConcepts', 'pseudocode', 'implementationCode']
    }
];

// Templates for missing components
const templates = {
    'linked-list-singly': {
        realWorldApplications: `**Industry Applications:**
- **Operating Systems**: Process scheduling with linked task queues
- **Music Players**: Playlist management with next/previous navigation
- **Web Browsers**: Browser history navigation (forward only)
- **Image Viewers**: Sequential image gallery navigation
- **Undo Functionality**: Command pattern implementation in editors
- **Memory Management**: Free list management in allocators
- **Blockchain**: Transaction chains and block linking
- **File Systems**: Directory entry linking and inode lists`,
        
        keyConcepts: `**Essential Concepts:**
1. **Node Structure**: Each node contains data and a next pointer
2. **Head Pointer**: Reference to the first node in the list
3. **Sequential Access**: Must traverse from head to reach any node
4. **Dynamic Size**: Can grow/shrink without reallocation
5. **Insertion Efficiency**: O(1) at head, O(n) at tail without tail pointer
6. **Memory Overhead**: Extra pointer per node compared to arrays
7. **No Random Access**: Cannot directly access elements by index`,
        
        pseudocode: `**Singly Linked List Pseudocode:**

ALGORITHM InsertAtHead(list, value)
INPUT: list - the linked list, value - value to insert
OUTPUT: modified list
BEGIN
    newNode = CREATE_NODE(value)
    newNode.next = list.head
    list.head = newNode
END

ALGORITHM InsertAtTail(list, value)
INPUT: list - the linked list, value - value to insert
OUTPUT: modified list
BEGIN
    newNode = CREATE_NODE(value)
    
    IF list.head IS NULL THEN
        list.head = newNode
        RETURN
    END IF
    
    current = list.head
    WHILE current.next IS NOT NULL DO
        current = current.next
    END WHILE
    
    current.next = newNode
END

ALGORITHM DeleteNode(list, value)
INPUT: list - the linked list, value - value to delete
OUTPUT: modified list
BEGIN
    IF list.head IS NULL THEN
        RETURN
    END IF
    
    IF list.head.value = value THEN
        list.head = list.head.next
        RETURN
    END IF
    
    current = list.head
    WHILE current.next IS NOT NULL AND current.next.value ≠ value DO
        current = current.next
    END WHILE
    
    IF current.next IS NOT NULL THEN
        current.next = current.next.next
    END IF
END

ALGORITHM ReverseList(list)
INPUT: list - the linked list to reverse
OUTPUT: reversed list
BEGIN
    prev = NULL
    current = list.head
    
    WHILE current IS NOT NULL DO
        next = current.next
        current.next = prev
        prev = current
        current = next
    END WHILE
    
    list.head = prev
END`,
        
        implementationCode: `// Comprehensive Singly Linked List Implementation

class ListNode {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class SinglyLinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }
    
    // Insert at beginning - O(1)
    insertAtHead(value) {
        const newNode = new ListNode(value);
        newNode.next = this.head;
        this.head = newNode;
        this.size++;
    }
    
    // Insert at end - O(n)
    insertAtTail(value) {
        const newNode = new ListNode(value);
        
        if (!this.head) {
            this.head = newNode;
            this.size++;
            return;
        }
        
        let current = this.head;
        while (current.next) {
            current = current.next;
        }
        current.next = newNode;
        this.size++;
    }
    
    // Insert at specific position - O(n)
    insertAt(index, value) {
        if (index < 0 || index > this.size) {
            throw new Error('Index out of bounds');
        }
        
        if (index === 0) {
            this.insertAtHead(value);
            return;
        }
        
        const newNode = new ListNode(value);
        let current = this.head;
        
        for (let i = 0; i < index - 1; i++) {
            current = current.next;
        }
        
        newNode.next = current.next;
        current.next = newNode;
        this.size++;
    }
    
    // Delete by value - O(n)
    deleteByValue(value) {
        if (!this.head) return false;
        
        if (this.head.value === value) {
            this.head = this.head.next;
            this.size--;
            return true;
        }
        
        let current = this.head;
        while (current.next && current.next.value !== value) {
            current = current.next;
        }
        
        if (current.next) {
            current.next = current.next.next;
            this.size--;
            return true;
        }
        
        return false;
    }
    
    // Delete at position - O(n)
    deleteAt(index) {
        if (index < 0 || index >= this.size) {
            throw new Error('Index out of bounds');
        }
        
        if (index === 0) {
            this.head = this.head.next;
            this.size--;
            return;
        }
        
        let current = this.head;
        for (let i = 0; i < index - 1; i++) {
            current = current.next;
        }
        
        current.next = current.next.next;
        this.size--;
    }
    
    // Search for value - O(n)
    search(value) {
        let current = this.head;
        let index = 0;
        
        while (current) {
            if (current.value === value) {
                return index;
            }
            current = current.next;
            index++;
        }
        
        return -1;
    }
    
    // Get value at index - O(n)
    get(index) {
        if (index < 0 || index >= this.size) {
            throw new Error('Index out of bounds');
        }
        
        let current = this.head;
        for (let i = 0; i < index; i++) {
            current = current.next;
        }
        
        return current.value;
    }
    
    // Reverse the list - O(n)
    reverse() {
        let prev = null;
        let current = this.head;
        
        while (current) {
            const next = current.next;
            current.next = prev;
            prev = current;
            current = next;
        }
        
        this.head = prev;
    }
    
    // Find middle node (slow-fast pointer) - O(n)
    findMiddle() {
        if (!this.head) return null;
        
        let slow = this.head;
        let fast = this.head;
        
        while (fast && fast.next) {
            slow = slow.next;
            fast = fast.next.next;
        }
        
        return slow.value;
    }
    
    // Detect cycle - O(n)
    hasCycle() {
        if (!this.head) return false;
        
        let slow = this.head;
        let fast = this.head;
        
        while (fast && fast.next) {
            slow = slow.next;
            fast = fast.next.next;
            
            if (slow === fast) {
                return true;
            }
        }
        
        return false;
    }
    
    // Convert to array - O(n)
    toArray() {
        const result = [];
        let current = this.head;
        
        while (current) {
            result.push(current.value);
            current = current.next;
        }
        
        return result;
    }
    
    // Display list - O(n)
    display() {
        return this.toArray().join(' -> ') + ' -> null';
    }
    
    // Get size
    getSize() {
        return this.size;
    }
    
    // Check if empty
    isEmpty() {
        return this.size === 0;
    }
    
    // Clear list
    clear() {
        this.head = null;
        this.size = 0;
    }
}

// Usage Examples
const list = new SinglyLinkedList();
list.insertAtHead(3);
list.insertAtHead(2);
list.insertAtHead(1);
list.insertAtTail(4);
list.insertAtTail(5);
console.log(list.display()); // 1 -> 2 -> 3 -> 4 -> 5 -> null

list.insertAt(2, 2.5);
console.log(list.display()); // 1 -> 2 -> 2.5 -> 3 -> 4 -> 5 -> null

console.log('Middle:', list.findMiddle()); // 2.5 or 3

list.reverse();
console.log(list.display()); // 5 -> 4 -> 3 -> 2.5 -> 2 -> 1 -> null

list.deleteByValue(2.5);
console.log(list.display()); // 5 -> 4 -> 3 -> 2 -> 1 -> null`
    }
};

console.log('📝 Template for linked-list-singly created');
console.log('\nNext steps:');
console.log('1. Review the template above');
console.log('2. Apply similar templates to other topics');
console.log('3. Run comprehensive audit again to verify fixes');
console.log('\n✅ Batch 1 preparation complete');
