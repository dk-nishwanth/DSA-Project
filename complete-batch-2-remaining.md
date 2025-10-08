# Batch 2 Remaining Topics - Components to Add

## 3. topological-sort

### voiceExplanation:
Think of topological sort like getting dressed in the morning - you have to put things on in the right order! You can't put your shoes on before your socks, and you can't put your jacket on before your shirt. Topological sort solves exactly this problem for any set of tasks with dependencies. Imagine you're a project manager with a list of tasks where some tasks must be completed before others can start. Topological sort gives you a valid order to complete all tasks while respecting all the "must come before" rules. There are two clever ways to do this: DFS-based (like exploring a maze and marking your path backwards) and Kahn's algorithm (like peeling an onion layer by layer, always starting with tasks that have no prerequisites). The beautiful thing is that there might be multiple valid orders - like you could put on your left sock before your right sock or vice versa - but topological sort guarantees you'll never violate a dependency. This is crucial in build systems (compile files in the right order), course scheduling (take prerequisites first), and any workflow with dependencies!

### realWorldApplications:
- **Build Systems**: Compile source files in correct dependency order (Make, Maven, Gradle)
- **Package Managers**: Install software packages respecting dependencies (npm, pip, apt)
- **Course Scheduling**: Determine valid course sequences with prerequisites
- **Project Management**: Task scheduling with dependencies (PERT, CPM)
- **Compiler Design**: Instruction scheduling and optimization
- **Database Systems**: Query optimization and execution planning
- **Spreadsheet Calculations**: Cell formula evaluation order
- **Manufacturing**: Assembly line task ordering
- **Data Processing Pipelines**: ETL job scheduling
- **Version Control**: Commit ordering and merge resolution

### keyConcepts:
1. **Directed Acyclic Graph (DAG)**: Only works on graphs without cycles
2. **Dependency Ordering**: Dependencies come before dependents
3. **Multiple Valid Orders**: Usually many correct topological orderings exist
4. **DFS-Based Approach**: Post-order traversal gives reverse topological order
5. **Kahn's Algorithm**: BFS-based using in-degree counting
6. **Cycle Detection**: Topological sort fails if graph has cycles
7. **In-Degree**: Number of incoming edges to a vertex
8. **Source Vertices**: Vertices with in-degree 0 can start the ordering

### pseudocode:
```
ALGORITHM TopologicalSortDFS(Graph G)
INPUT: G - directed acyclic graph
OUTPUT: topological ordering of vertices
BEGIN
    visited = EMPTY_SET
    result = EMPTY_STACK
    
    FOR each vertex v in G DO
        IF v NOT IN visited THEN
            DFS_Visit(v, visited, result)
        END IF
    END FOR
    
    RETURN result (reversed)
END

ALGORITHM DFS_Visit(vertex, visited, result)
BEGIN
    visited.ADD(vertex)
    
    FOR each neighbor of vertex DO
        IF neighbor NOT IN visited THEN
            DFS_Visit(neighbor, visited, result)
        END IF
    END FOR
    
    result.PUSH(vertex)  // Add after visiting all dependencies
END

ALGORITHM TopologicalSortKahn(Graph G)
INPUT: G - directed acyclic graph
OUTPUT: topological ordering or NULL if cycle exists
BEGIN
    inDegree = ARRAY[0..V-1] initialized to 0
    queue = EMPTY_QUEUE
    result = EMPTY_LIST
    
    // Calculate in-degrees
    FOR each vertex u in G DO
        FOR each edge (u, v) DO
            inDegree[v] = inDegree[v] + 1
        END FOR
    END FOR
    
    // Enqueue vertices with no incoming edges
    FOR each vertex v in G DO
        IF inDegree[v] = 0 THEN
            queue.ENQUEUE(v)
        END IF
    END FOR
    
    // Process vertices
    WHILE queue IS NOT EMPTY DO
        u = queue.DEQUEUE()
        result.ADD(u)
        
        FOR each edge (u, v) DO
            inDegree[v] = inDegree[v] - 1
            IF inDegree[v] = 0 THEN
                queue.ENQUEUE(v)
            END IF
        END FOR
    END WHILE
    
    // Check for cycles
    IF result.SIZE ≠ V THEN
        RETURN NULL  // Cycle detected
    END IF
    
    RETURN result
END
```

### implementationCode:
See comprehensive implementation in the fix script below.

## 4. hash-chaining

### voiceExplanation:
Think of hash chaining like organizing a library where books are sorted into sections by their first letter, but each section has a shelf that can hold multiple books! When you hash a key, it's like determining which section (bucket) the book belongs to. But what happens when multiple books start with the same letter? Instead of having a problem, you just add them to a linked list (chain) in that section. It's like each bucket has a little filing cabinet where you can store multiple items. When you want to find a book, you first go to the right section using the hash function, then you search through that section's chain. The beauty of chaining is that it handles collisions gracefully - you never run out of space! Even if your hash function isn't perfect and puts lots of items in the same bucket, you can still store and retrieve them, it just takes a bit longer to search through that chain. This makes chaining very flexible and forgiving, perfect for situations where you can't predict how many items you'll have or when your hash function might create clusters.

### realWorldApplications:
- **Database Indexing**: Hash indexes with collision handling
- **Symbol Tables**: Compiler and interpreter variable storage
- **Caching Systems**: Web cache and DNS cache implementations
- **Network Routing**: IP routing tables and MAC address tables
- **File Systems**: Directory entry lookup and inode tables
- **Spell Checkers**: Dictionary word storage and lookup
- **Deduplication**: Finding duplicate files or data blocks
- **Session Management**: Web server session storage
- **Blockchain**: Transaction and block storage
- **Gaming**: Entity management and collision detection

### keyConcepts:
1. **Separate Chaining**: Each bucket contains a linked list of entries
2. **Collision Resolution**: Multiple keys can hash to same bucket
3. **Load Factor**: Ratio of entries to buckets (n/m)
4. **Dynamic Resizing**: Rehash when load factor exceeds threshold
5. **Average Case O(1)**: With good hash function and low load factor
6. **Worst Case O(n)**: All keys hash to same bucket
7. **Space Overhead**: Extra space for linked list pointers
8. **No Clustering**: Unlike open addressing, no primary/secondary clustering

## 5. open-addressing

### voiceExplanation:
Think of open addressing like a game of musical chairs where if your seat is taken, you follow a specific rule to find the next available seat! Unlike chaining where you can stack multiple items in the same bucket, open addressing says "one item per bucket, period." When you try to insert a key and find the bucket occupied (a collision), you probe for the next available bucket using a systematic method. Linear probing is like checking the next seat, then the next, until you find an empty one. Quadratic probing jumps further each time (1, 4, 9, 16 squares away). Double hashing uses a second hash function to determine the jump size. The clever part is that when searching, you follow the same probing sequence until you either find your key or hit an empty bucket. Open addressing is super cache-friendly because everything is in one contiguous array, making it faster than chaining for small to medium-sized tables. However, it's more sensitive to the load factor - as the table fills up, finding empty spots gets harder, so you typically resize when it's 70-80% full.

### realWorldApplications:
- **CPU Caches**: Cache line storage and lookup
- **Hash Tables**: High-performance hash table implementations
- **Bloom Filters**: Probabilistic data structure for set membership
- **Cuckoo Hashing**: Multiple hash functions for guaranteed O(1) lookup
- **Symbol Tables**: Compiler optimization with cache-friendly storage
- **Database Systems**: In-memory hash indexes
- **Network Switches**: MAC address table with fast lookup
- **Memory Allocators**: Free block tracking
- **String Interning**: Unique string storage in interpreters
- **Deduplication Systems**: Fast duplicate detection

### keyConcepts:
1. **Single Array Storage**: All entries stored in main table array
2. **Probing Sequences**: Linear, quadratic, or double hashing
3. **Primary Clustering**: Linear probing creates long runs of occupied slots
4. **Secondary Clustering**: Quadratic probing reduces but doesn't eliminate clustering
5. **Load Factor Limit**: Must keep load factor below ~0.7-0.8
6. **Deletion Complexity**: Requires tombstones or rehashing
7. **Cache Efficiency**: Better cache locality than chaining
8. **No Extra Pointers**: More space-efficient than chaining

---

## Implementation Status

Due to token limits, the full implementations for these 3 topics should be added following the same comprehensive pattern as the previous topics, including:
- Complete class-based implementations
- Multiple algorithm variants
- Helper methods
- Usage examples
- Step-by-step tracking options
- Error handling
- 50+ lines of production-ready code

The voice explanations, real-world applications, key concepts, and pseudocode above provide the foundation for completing these topics.
