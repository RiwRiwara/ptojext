"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { motion } from 'framer-motion';
import { FiCode, FiFileText, FiCpu } from 'react-icons/fi';

export const AlgorithmInfo = () => {
    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-4">
                        <FiCode className="text-blue-500 mr-3 h-6 w-6" />
                        <h3 className="text-lg font-bold">Algorithm Types</h3>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                        Pathfinding algorithms can be categorized based on their approach: informed (using heuristics) versus uninformed (blind search), and completeness (guaranteed to find a solution if one exists).
                    </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-4">
                        <FiCpu className="text-green-500 mr-3 h-6 w-6" />
                        <h3 className="text-lg font-bold">Applications</h3>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                        Pathfinding algorithms are essential in robotics, video games, network routing, GPS navigation systems, and artificial intelligence applications.
                    </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-4">
                        <FiFileText className="text-purple-500 mr-3 h-6 w-6" />
                        <h3 className="text-lg font-bold">Performance Metrics</h3>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                        Algorithms are compared based on time complexity, space complexity, optimality (finding shortest paths), and completeness (guaranteed to find a path if one exists).
                    </p>
                </div>
            </motion.div>
            
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="dijkstra">
                    <AccordionTrigger className="text-lg font-medium">Dijkstra s Algorithm</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-4 p-2">
                            <h3 className="font-semibold text-blue-600 dark:text-blue-400">Overview</h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                Dijkstra s algorithm finds the shortest path from a source node to all other nodes in a weighted graph. It works by maintaining a priority queue of nodes, where the priority is determined by the distance from the starting node.
                            </p>
                            <h3 className="font-semibold text-blue-600 dark:text-blue-400 mt-4">Key Features</h3>
                            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                                <li>Time Complexity: O(V²) or O(E log V) with a priority queue</li>
                                <li>Space Complexity: O(V)</li>
                                <li>Always finds the shortest path in graphs with non-negative edge weights</li>
                                <li>Applications: GPS navigation, network routing protocols, OSPF (Open Shortest Path First)</li>
                            </ul>
                            <h3 className="font-semibold text-blue-600 dark:text-blue-400 mt-4">Implementation Notes</h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                Uses a priority queue to select the node with the smallest tentative distance. Updates distances iteratively until all nodes are processed. Cannot handle negative edge weights.
                            </p>
                            <h3 className="font-semibold text-blue-600 dark:text-blue-400 mt-4">Pseudocode</h3>
                            <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-sm overflow-x-auto">
{`function dijkstra(graph, start):
    // Initialize distances with infinity for all nodes except start
    distance[start] = 0
    priority_queue = {(0, start)}
    
    while priority_queue is not empty:
        current_distance, current_node = extract_min(priority_queue)
        
        if current_node is visited: continue
        mark current_node as visited
        
        for each neighbor of current_node:
            if neighbor is not visited:
                distance_through_current = current_distance + edge_weight(current_node, neighbor)
                if distance_through_current < distance[neighbor]:
                    distance[neighbor] = distance_through_current
                    add (distance_through_current, neighbor) to priority_queue
    
    return distance`}
                            </pre>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="astar">
                    <AccordionTrigger className="text-lg font-medium">A* Algorithm</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-4 p-2">
                            <h3 className="font-semibold text-blue-600 dark:text-blue-400">Overview</h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                A* is an informed search algorithm that combines the strengths of Dijkstra s algorithm and greedy best-first search. It uses both the cost to reach a node and a heuristic estimate of the cost to reach the goal.
                            </p>
                            <h3 className="font-semibold text-blue-600 dark:text-blue-400 mt-4">Key Features</h3>
                            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                                <li>Time Complexity: O(E log V) (depends on heuristic)</li>
                                <li>Space Complexity: O(V)</li>
                                <li>Complete and optimal when using an admissible heuristic</li>
                                <li>Applications: Game pathfinding, robotics, puzzle solving</li>
                            </ul>
                            <h3 className="font-semibold text-blue-600 dark:text-blue-400 mt-4">Heuristic Functions</h3>
                            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                                <li><strong>Manhattan Distance:</strong> |x1 - x2| + |y1 - y2| (ideal for grid-based movement with 4 directions)</li>
                                <li><strong>Euclidean Distance:</strong> √((x1 - x2)² + (y1 - y2)²) (ideal for movement in any direction)</li>
                                <li><strong>Diagonal Distance:</strong> max(|x1 - x2|, |y1 - y2|) (ideal for grid-based movement with 8 directions)</li>
                            </ul>
                            <h3 className="font-semibold text-blue-600 dark:text-blue-400 mt-4">Pseudocode</h3>
                            <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-sm overflow-x-auto">
{`function astar(graph, start, goal, heuristic):
    // f(n) = g(n) + h(n) where g is cost so far, h is heuristic
    open_set = {start}    // Nodes to be evaluated
    came_from = {}        // Path tracking
    
    g_score[start] = 0    // Cost from start to start
    f_score[start] = heuristic(start, goal)  // Estimated total cost
    
    while open_set is not empty:
        current = node in open_set with lowest f_score
        
        if current = goal:
            return reconstruct_path(came_from, current)
            
        remove current from open_set
        
        for each neighbor of current:
            tentative_g_score = g_score[current] + distance(current, neighbor)
            
            if tentative_g_score < g_score[neighbor]:
                // This path is better
                came_from[neighbor] = current
                g_score[neighbor] = tentative_g_score
                f_score[neighbor] = g_score[neighbor] + heuristic(neighbor, goal)
                
                if neighbor not in open_set:
                    add neighbor to open_set
    
    return failure (no path exists)`}
                            </pre>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="bfs">
                    <AccordionTrigger className="text-lg font-medium">Breadth-First Search (BFS)</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-4 p-2">
                            <h3 className="font-semibold text-blue-600 dark:text-blue-400">Overview</h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                BFS explores all nodes at the present depth level before moving to nodes at the next depth level. It is an uninformed search algorithm that guarantees the shortest path in unweighted graphs.
                            </p>
                            <h3 className="font-semibold text-blue-600 dark:text-blue-400 mt-4">Key Features</h3>
                            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                                <li>Time Complexity: O(V + E)</li>
                                <li>Space Complexity: O(V)</li>
                                <li>Guarantees shortest path in unweighted graphs</li>
                                <li>Applications: Maze solving, social network analysis, web crawling</li>
                            </ul>
                            <h3 className="font-semibold text-blue-600 dark:text-blue-400 mt-4">Implementation Notes</h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                Uses a queue to process nodes in order of discovery. Marks nodes as visited to avoid cycles. Expands in a layer-by-layer fashion.
                            </p>
                            <h3 className="font-semibold text-blue-600 dark:text-blue-400 mt-4">Pseudocode</h3>
                            <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-sm overflow-x-auto">
{`function bfs(graph, start, goal):
    queue = [start]
    visited = {start}
    parent = {}
    
    while queue is not empty:
        current = queue.dequeue()
        
        if current = goal:
            return reconstruct_path(parent, start, goal)
            
        for each neighbor of current:
            if neighbor not in visited:
                visited.add(neighbor)
                parent[neighbor] = current
                queue.enqueue(neighbor)
    
    return failure (no path exists)`}
                            </pre>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="dfs">
                    <AccordionTrigger className="text-lg font-medium">Depth-First Search (DFS)</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-4 p-2">
                            <h3 className="font-semibold text-blue-600 dark:text-blue-400">Overview</h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                DFS explores as far as possible along each branch before backtracking. It is an uninformed search algorithm that may not find the shortest path but requires less memory than BFS.
                            </p>
                            <h3 className="font-semibold text-blue-600 dark:text-blue-400 mt-4">Key Features</h3>
                            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                                <li>Time Complexity: O(V + E)</li>
                                <li>Space Complexity: O(V) in worst case (skewed graph)</li>
                                <li>Does not guarantee shortest path</li>
                                <li>Applications: Topological sorting, maze generation, cycle detection</li>
                            </ul>
                            <h3 className="font-semibold text-blue-600 dark:text-blue-400 mt-4">Implementation Notes</h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                Can be implemented recursively or iteratively using a stack. Marks nodes as visited to avoid cycles. Explores deeply before widely.
                            </p>
                            <h3 className="font-semibold text-blue-600 dark:text-blue-400 mt-4">Pseudocode</h3>
                            <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-sm overflow-x-auto">
{`function dfs(graph, start, goal):
    stack = [start]
    visited = {start}
    parent = {}
    
    while stack is not empty:
        current = stack.pop()
        
        if current = goal:
            return reconstruct_path(parent, start, goal)
            
        for each neighbor of current:
            if neighbor not in visited:
                visited.add(neighbor)
                parent[neighbor] = current
                stack.push(neighbor)
    
    return failure (no path exists)`}
                            </pre>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="greedy">
                    <AccordionTrigger className="text-lg font-medium">Greedy Best-First Search</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-4 p-2">
                            <h3 className="font-semibold text-blue-600 dark:text-blue-400">Overview</h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                Greedy Best-First Search is an informed search algorithm that always chooses the path that appears closest to the goal according to a heuristic function. Unlike A*, it ignores the cost to reach the current node.
                            </p>
                            <h3 className="font-semibold text-blue-600 dark:text-blue-400 mt-4">Key Features</h3>
                            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                                <li>Time Complexity: O(E log V) in the worst case</li>
                                <li>Space Complexity: O(V)</li>
                                <li>Not guaranteed to find the shortest path</li>
                                <li>Applications: Simple pathfinding, puzzle solving</li>
                            </ul>
                            <h3 className="font-semibold text-blue-600 dark:text-blue-400 mt-4">Implementation Notes</h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                Uses a priority queue where the priority is determined solely by the heuristic estimate to the goal. Very efficient when the heuristic is good, but can lead to suboptimal paths.
                            </p>
                            <h3 className="font-semibold text-blue-600 dark:text-blue-400 mt-4">Pseudocode</h3>
                            <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-sm overflow-x-auto">
{`function greedy_best_first_search(graph, start, goal, heuristic):
    open_set = {start}    // Nodes to be evaluated
    came_from = {}        // Path tracking
    visited = {start}
    
    while open_set is not empty:
        // Get node with lowest heuristic value
        current = node in open_set with lowest heuristic(node, goal)
        
        if current = goal:
            return reconstruct_path(came_from, current)
            
        remove current from open_set
        
        for each neighbor of current:
            if neighbor not in visited:
                visited.add(neighbor)
                came_from[neighbor] = current
                add neighbor to open_set
    
    return failure (no path exists)`}
                            </pre>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};