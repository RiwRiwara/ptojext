"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { FiArrowRight, FiInfo } from 'react-icons/fi';
import Link from 'next/link';

export const LinearStructuresInfo = () => {
  const [activeStructure, setActiveStructure] = useState('arrays');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Linear Data Structures</CardTitle>
          <CardDescription>
            Data elements arranged sequentially where each element has at most two adjacent elements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-gray-700">
            Linear data structures arrange elements in a sequential manner. Each element is connected 
            to its previous and next element (except for the first and last elements). This linear arrangement 
            makes them suitable for tasks requiring sequential access but may limit efficiency for certain operations.
          </p>

          <div className="flex items-center justify-center my-6">
            <div className="relative p-4 w-full max-w-4xl">
              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                {/* Visual representation of linear structure */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <motion.div
                      key={index}
                      className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {String.fromCharCode(65 + index)}
                    </motion.div>
                  ))}
                </div>
                <div className="text-center md:text-left md:ml-6">
                  <h3 className="text-lg font-medium mb-2">Key Characteristics</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    <li>Elements are arranged in sequence</li>
                    <li>Each element has at most two neighbors</li>
                    <li>Access patterns are primarily sequential</li>
                    <li>Simple implementation and memory usage</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Types</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs
                orientation="vertical"
                defaultValue={activeStructure}
                value={activeStructure}
                onValueChange={setActiveStructure}
                className="w-full"
              >
                <TabsList className="flex flex-col h-auto w-full rounded-none">
                  <TabsTrigger value="arrays" className="justify-start">Arrays</TabsTrigger>
                  <TabsTrigger value="linkedLists" className="justify-start">Linked Lists</TabsTrigger>
                  <TabsTrigger value="stacks" className="justify-start">Stacks</TabsTrigger>
                  <TabsTrigger value="queues" className="justify-start">Queues</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>
                {activeStructure === 'arrays' && 'Arrays'}
                {activeStructure === 'linkedLists' && 'Linked Lists'}
                {activeStructure === 'stacks' && 'Stacks'}
                {activeStructure === 'queues' && 'Queues'}
              </CardTitle>
              <CardDescription>
                {activeStructure === 'arrays' && 'Fixed-size sequential collection of elements'}
                {activeStructure === 'linkedLists' && 'Sequence of elements where each points to the next'}
                {activeStructure === 'stacks' && 'Last-In-First-Out (LIFO) data structure'}
                {activeStructure === 'queues' && 'First-In-First-Out (FIFO) data structure'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeStructure === 'arrays' && (
                <div className="space-y-4">
                  <p>
                    Arrays store elements in contiguous memory locations, enabling random access through indexing.
                    They have a fixed size defined at creation, making them efficient for storage but less flexible 
                    for dynamic data.
                  </p>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start gap-3">
                    <FiInfo className="text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-700">Key Points</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-1 text-sm">
                        <li>Fixed size determined at creation</li>
                        <li>Elements stored in contiguous memory locations</li>
                        <li>Random access in O(1) time</li>
                        <li>Insertion and deletion operations are expensive (O(n))</li>
                      </ul>
                    </div>
                  </div>

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="operations">
                      <AccordionTrigger>Common Operations</AccordionTrigger>
                      <AccordionContent>
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr>
                              <th className="text-left py-2">Operation</th>
                              <th className="text-left py-2">Time Complexity</th>
                              <th className="text-left py-2">Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="py-2">Access</td>
                              <td className="py-2">O(1)</td>
                              <td className="py-2">Direct access by index</td>
                            </tr>
                            <tr>
                              <td className="py-2">Search</td>
                              <td className="py-2">O(n)</td>
                              <td className="py-2">Linear search through elements</td>
                            </tr>
                            <tr>
                              <td className="py-2">Insertion</td>
                              <td className="py-2">O(n)</td>
                              <td className="py-2">Requires shifting elements</td>
                            </tr>
                            <tr>
                              <td className="py-2">Deletion</td>
                              <td className="py-2">O(n)</td>
                              <td className="py-2">Requires shifting elements</td>
                            </tr>
                          </tbody>
                        </table>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="code">
                      <AccordionTrigger>Example Implementation</AccordionTrigger>
                      <AccordionContent>
                        <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                          <code className="text-sm">
{`// TypeScript example
// Declaring an array
const numbers: number[] = [1, 2, 3, 4, 5];

// Accessing elements
const firstElement = numbers[0]; // 1

// Modifying elements
numbers[2] = 10; // [1, 2, 10, 4, 5]

// Iterating through an array
for (let i = 0; i < numbers.length; i++) {
  console.log(numbers[i]);
}

// Common array methods
numbers.push(6);       // Add to end: [1, 2, 10, 4, 5, 6]
numbers.pop();         // Remove from end: [1, 2, 10, 4, 5]
numbers.unshift(0);    // Add to beginning: [0, 1, 2, 10, 4, 5]
numbers.shift();       // Remove from beginning: [1, 2, 10, 4, 5]
numbers.splice(2, 1);  // Remove at index: [1, 2, 4, 5]`}
                          </code>
                        </pre>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="applications">
                      <AccordionTrigger>Real-world Applications</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Image processing (pixel arrays)</li>
                          <li>Matrix operations in scientific computing</li>
                          <li>Database indexing</li>
                          <li>Lookup tables for fast access</li>
                          <li>Implementing other data structures (stacks, queues)</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <div className="mt-6 flex justify-end">
                    <Link href="/simulations/linear-structures" passHref>
                      <Button>
                        Visualize Arrays <FiArrowRight className="ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {activeStructure === 'linkedLists' && (
                <div className="space-y-4">
                  <p>
                    Linked Lists consist of nodes where each node contains data and a reference to the next node.
                    Unlike arrays, linked lists can grow or shrink dynamically during execution, making them 
                    ideal for applications with frequent insertions and deletions.
                  </p>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start gap-3">
                    <FiInfo className="text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-700">Key Points</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-1 text-sm">
                        <li>Dynamic size that can grow or shrink</li>
                        <li>Nodes are connected through references/pointers</li>
                        <li>Sequential access only (O(n) to find an element)</li>
                        <li>Efficient insertions and deletions (O(1) if position known)</li>
                        <li>Types: Singly linked, Doubly linked, Circular</li>
                      </ul>
                    </div>
                  </div>

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="operations">
                      <AccordionTrigger>Common Operations</AccordionTrigger>
                      <AccordionContent>
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr>
                              <th className="text-left py-2">Operation</th>
                              <th className="text-left py-2">Time Complexity</th>
                              <th className="text-left py-2">Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="py-2">Access</td>
                              <td className="py-2">O(n)</td>
                              <td className="py-2">Traverse from head to target node</td>
                            </tr>
                            <tr>
                              <td className="py-2">Search</td>
                              <td className="py-2">O(n)</td>
                              <td className="py-2">Linear search through nodes</td>
                            </tr>
                            <tr>
                              <td className="py-2">Insert at beginning</td>
                              <td className="py-2">O(1)</td>
                              <td className="py-2">Constant time insertion at head</td>
                            </tr>
                            <tr>
                              <td className="py-2">Insert at end</td>
                              <td className="py-2">O(1) or O(n)</td>
                              <td className="py-2">O(1) with tail pointer, O(n) without</td>
                            </tr>
                            <tr>
                              <td className="py-2">Delete</td>
                              <td className="py-2">O(1)</td>
                              <td className="py-2">If node reference is available</td>
                            </tr>
                          </tbody>
                        </table>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="code">
                      <AccordionTrigger>Example Implementation</AccordionTrigger>
                      <AccordionContent>
                        <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                          <code className="text-sm">
{`// TypeScript example - Singly Linked List
class Node<T> {
  value: T;
  next: Node<T> | null;
  
  constructor(value: T) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList<T> {
  head: Node<T> | null;
  tail: Node<T> | null;
  size: number;
  
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }
  
  // Add to end of list
  append(value: T): void {
    const newNode = new Node(value);
    
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail!.next = newNode;
      this.tail = newNode;
    }
    
    this.size++;
  }
  
  // Add to beginning of list
  prepend(value: T): void {
    const newNode = new Node(value);
    
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head = newNode;
    }
    
    this.size++;
  }
}`}
                          </code>
                        </pre>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="applications">
                      <AccordionTrigger>Real-world Applications</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Implementing dynamic memory allocation</li>
                          <li>Creating other data structures (stacks, queues)</li>
                          <li>Music playlist implementation</li>
                          <li>Browser history functionality</li>
                          <li>Undo functionality in applications</li>
                          <li>Hash tables (handling collisions)</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <div className="mt-6 flex justify-end">
                    <Link href="/simulations/linear-structures" passHref>
                      <Button>
                        Visualize Linked Lists <FiArrowRight className="ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {activeStructure === 'stacks' && (
                <div className="space-y-4">
                  <p>
                    A Stack is a Last-In-First-Out (LIFO) data structure where elements are added and 
                    removed from the same end, called the top. Think of it like a stack of plates - you can 
                    only take the top plate, and you can only add a new plate to the top.
                  </p>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start gap-3">
                    <FiInfo className="text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-700">Key Points</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-1 text-sm">
                        <li>Follows Last-In-First-Out (LIFO) principle</li>
                        <li>Elements are added/removed only from one end (top)</li>
                        <li>Main operations: push (add) and pop (remove)</li>
                        <li>Can be implemented using arrays or linked lists</li>
                        <li>Only the top element is accessible at any time</li>
                      </ul>
                    </div>
                  </div>

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="operations">
                      <AccordionTrigger>Common Operations</AccordionTrigger>
                      <AccordionContent>
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr>
                              <th className="text-left py-2">Operation</th>
                              <th className="text-left py-2">Time Complexity</th>
                              <th className="text-left py-2">Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="py-2">Push</td>
                              <td className="py-2">O(1)</td>
                              <td className="py-2">Add an element to the top</td>
                            </tr>
                            <tr>
                              <td className="py-2">Pop</td>
                              <td className="py-2">O(1)</td>
                              <td className="py-2">Remove the top element</td>
                            </tr>
                            <tr>
                              <td className="py-2">Peek</td>
                              <td className="py-2">O(1)</td>
                              <td className="py-2">View the top element without removing</td>
                            </tr>
                            <tr>
                              <td className="py-2">isEmpty</td>
                              <td className="py-2">O(1)</td>
                              <td className="py-2">Check if stack is empty</td>
                            </tr>
                          </tbody>
                        </table>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="code">
                      <AccordionTrigger>Example Implementation</AccordionTrigger>
                      <AccordionContent>
                        <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                          <code className="text-sm">
{`// TypeScript example
class Stack<T> {
  private items: T[];
  
  constructor() {
    this.items = [];
  }
  
  // Add element to top of stack
  push(element: T): void {
    this.items.push(element);
  }
  
  // Remove and return top element
  pop(): T | undefined {
    return this.items.pop();
  }
  
  // Return top element without removing
  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }
  
  // Check if stack is empty
  isEmpty(): boolean {
    return this.items.length === 0;
  }
  
  // Get size of stack
  size(): number {
    return this.items.length;
  }
  
  // Clear the stack
  clear(): void {
    this.items = [];
  }
}

// Usage example
const stack = new Stack<number>();
stack.push(10);
stack.push(20);
stack.push(30);
console.log(stack.peek());  // 30
console.log(stack.pop());   // 30
console.log(stack.size());  // 2`}
                          </code>
                        </pre>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="applications">
                      <AccordionTrigger>Real-world Applications</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Function call stack in programming languages</li>
                          <li>Expression evaluation (postfix notation)</li>
                          <li>Syntax parsing in compilers</li>
                          <li>Undo mechanism in text editors</li>
                          <li>Browser history (back button functionality)</li>
                          <li>Backtracking algorithms</li>
                          <li>Balanced parentheses checking</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <div className="mt-6 flex justify-end">
                    <Link href="/simulations/linear-structures" passHref>
                      <Button>
                        Visualize Stacks <FiArrowRight className="ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {activeStructure === 'queues' && (
                <div className="space-y-4">
                  <p>
                    A Queue is a First-In-First-Out (FIFO) data structure where elements are added at one end (rear) 
                    and removed from the other end (front). Think of it like a line of people waiting - the first 
                    person to join is the first to leave.
                  </p>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start gap-3">
                    <FiInfo className="text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-700">Key Points</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-1 text-sm">
                        <li>Follows First-In-First-Out (FIFO) principle</li>
                        <li>Elements added at the rear and removed from the front</li>
                        <li>Main operations: enqueue (add) and dequeue (remove)</li>
                        <li>Can be implemented using arrays or linked lists</li>
                        <li>Variations: Circular Queue, Priority Queue, Deque</li>
                      </ul>
                    </div>
                  </div>

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="operations">
                      <AccordionTrigger>Common Operations</AccordionTrigger>
                      <AccordionContent>
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr>
                              <th className="text-left py-2">Operation</th>
                              <th className="text-left py-2">Time Complexity</th>
                              <th className="text-left py-2">Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="py-2">Enqueue</td>
                              <td className="py-2">O(1)</td>
                              <td className="py-2">Add an element to the rear</td>
                            </tr>
                            <tr>
                              <td className="py-2">Dequeue</td>
                              <td className="py-2">O(1)</td>
                              <td className="py-2">Remove the front element</td>
                            </tr>
                            <tr>
                              <td className="py-2">Peek/Front</td>
                              <td className="py-2">O(1)</td>
                              <td className="py-2">View the front element without removing</td>
                            </tr>
                            <tr>
                              <td className="py-2">isEmpty</td>
                              <td className="py-2">O(1)</td>
                              <td className="py-2">Check if queue is empty</td>
                            </tr>
                          </tbody>
                        </table>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="code">
                      <AccordionTrigger>Example Implementation</AccordionTrigger>
                      <AccordionContent>
                        <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                          <code className="text-sm">
{`// TypeScript example
class Queue<T> {
  private items: T[];
  
  constructor() {
    this.items = [];
  }
  
  // Add element to the rear
  enqueue(element: T): void {
    this.items.push(element);
  }
  
  // Remove and return front element
  dequeue(): T | undefined {
    return this.items.shift();
  }
  
  // Return front element without removing
  front(): T | undefined {
    return this.items[0];
  }
  
  // Check if queue is empty
  isEmpty(): boolean {
    return this.items.length === 0;
  }
  
  // Get size of queue
  size(): number {
    return this.items.length;
  }
  
  // Clear the queue
  clear(): void {
    this.items = [];
  }
}

// Usage example
const queue = new Queue<string>();
queue.enqueue("Alice");
queue.enqueue("Bob");
queue.enqueue("Charlie");
console.log(queue.front());   // "Alice"
console.log(queue.dequeue()); // "Alice"
console.log(queue.size());    // 2`}
                          </code>
                        </pre>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="applications">
                      <AccordionTrigger>Real-world Applications</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>CPU task scheduling</li>
                          <li>Printer queue management</li>
                          <li>Handling of requests on a server</li>
                          <li>Breadth-first search algorithm</li>
                          <li>Asynchronous data transfer</li>
                          <li>Call center phone systems</li>
                          <li>Waiting lists and reservation systems</li>
                          <li>Buffering for media players</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <div className="mt-6 flex justify-end">
                    <Link href="/simulations/linear-structures" passHref>
                      <Button>
                        Visualize Queues <FiArrowRight className="ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
