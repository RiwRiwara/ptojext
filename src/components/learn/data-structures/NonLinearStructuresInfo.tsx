"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { FiArrowRight, FiInfo } from 'react-icons/fi';
import Link from 'next/link';

export const NonLinearStructuresInfo = () => {
  const [activeStructure, setActiveStructure] = useState('trees');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Non-Linear Data Structures</CardTitle>
          <CardDescription>Data elements arranged in hierarchical or network-like manner.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeStructure} onValueChange={setActiveStructure} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="trees">Trees</TabsTrigger>
              <TabsTrigger value="graphs">Graphs</TabsTrigger>
              <TabsTrigger value="hash">Hash Tables</TabsTrigger>
            </TabsList>
            
            <TabsContent value="trees" className="space-y-4">
              <div className="p-4 border rounded-md bg-muted/50">
                <h3 className="text-lg font-medium mb-2">Trees</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  A hierarchical structure with a root node and child nodes arranged in a branching pattern.
                </p>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="tree-types">
                    <AccordionTrigger>Types of Trees</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Binary Trees - Each node has at most two children</li>
                        <li>Binary Search Trees - Ordered binary trees for efficient searching</li>
                        <li>AVL Trees - Self-balancing binary search trees</li>
                        <li>Red-Black Trees - Self-balancing binary search trees with color properties</li>
                        <li>B-Trees - Self-balancing search trees with multiple children per node</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="tree-operations">
                    <AccordionTrigger>Common Operations</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 border rounded">
                          <p className="font-medium">Insertion</p>
                          <p className="text-xs text-muted-foreground">O(log n) for balanced trees</p>
                        </div>
                        <div className="p-2 border rounded">
                          <p className="font-medium">Deletion</p>
                          <p className="text-xs text-muted-foreground">O(log n) for balanced trees</p>
                        </div>
                        <div className="p-2 border rounded">
                          <p className="font-medium">Search</p>
                          <p className="text-xs text-muted-foreground">O(log n) for balanced trees</p>
                        </div>
                        <div className="p-2 border rounded">
                          <p className="font-medium">Traversal</p>
                          <p className="text-xs text-muted-foreground">O(n) for all nodes</p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="tree-applications">
                    <AccordionTrigger>Real-world Applications</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>File systems organization</li>
                        <li>Database indexing</li>
                        <li>Decision trees in machine learning</li>
                        <li>HTML DOM in web browsers</li>
                        <li>Syntax trees in compilers</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </TabsContent>
            
            <TabsContent value="graphs" className="space-y-4">
              <div className="p-4 border rounded-md bg-muted/50">
                <h3 className="text-lg font-medium mb-2">Graphs</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  A collection of nodes (vertices) connected by edges, representing relationships between objects.
                </p>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="graph-types">
                    <AccordionTrigger>Types of Graphs</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Directed Graphs - Edges have direction</li>
                        <li>Undirected Graphs - Edges have no direction</li>
                        <li>Weighted Graphs - Edges have associated weights</li>
                        <li>Cyclic Graphs - Contains at least one cycle</li>
                        <li>Acyclic Graphs - Contains no cycles</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="graph-operations">
                    <AccordionTrigger>Common Operations</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 border rounded">
                          <p className="font-medium">BFS Traversal</p>
                          <p className="text-xs text-muted-foreground">O(V+E) time complexity</p>
                        </div>
                        <div className="p-2 border rounded">
                          <p className="font-medium">DFS Traversal</p>
                          <p className="text-xs text-muted-foreground">O(V+E) time complexity</p>
                        </div>
                        <div className="p-2 border rounded">
                          <p className="font-medium">Shortest Path</p>
                          <p className="text-xs text-muted-foreground">Dijkstra's, Bellman-Ford</p>
                        </div>
                        <div className="p-2 border rounded">
                          <p className="font-medium">Minimum Spanning Tree</p>
                          <p className="text-xs text-muted-foreground">Kruskal's, Prim's</p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="graph-applications">
                    <AccordionTrigger>Real-world Applications</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Social networks</li>
                        <li>Road networks and GPS navigation</li>
                        <li>Internet routing</li>
                        <li>Recommendation systems</li>
                        <li>Dependency resolution in package managers</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </TabsContent>
            
            <TabsContent value="hash" className="space-y-4">
              <div className="p-4 border rounded-md bg-muted/50">
                <h3 className="text-lg font-medium mb-2">Hash Tables</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Data structures that map keys to values using a hash function for efficient lookup.
                </p>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="hash-concepts">
                    <AccordionTrigger>Key Concepts</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Hash Function - Converts keys to array indices</li>
                        <li>Collision Resolution - Handling when two keys hash to same index</li>
                        <li>Load Factor - Ratio of filled slots to total size</li>
                        <li>Rehashing - Resizing the hash table when load factor exceeds threshold</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="hash-operations">
                    <AccordionTrigger>Common Operations</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 border rounded">
                          <p className="font-medium">Insertion</p>
                          <p className="text-xs text-muted-foreground">O(1) average case</p>
                        </div>
                        <div className="p-2 border rounded">
                          <p className="font-medium">Deletion</p>
                          <p className="text-xs text-muted-foreground">O(1) average case</p>
                        </div>
                        <div className="p-2 border rounded">
                          <p className="font-medium">Lookup</p>
                          <p className="text-xs text-muted-foreground">O(1) average case</p>
                        </div>
                        <div className="p-2 border rounded">
                          <p className="font-medium">Rehashing</p>
                          <p className="text-xs text-muted-foreground">O(n) when needed</p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="hash-applications">
                    <AccordionTrigger>Real-world Applications</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Database indexing</li>
                        <li>Caching systems</li>
                        <li>Symbol tables in compilers</li>
                        <li>Blockchain technology</li>
                        <li>Password storage (with cryptographic hashing)</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Link href="/simulations/non-linear-structures">
          <Button className="flex items-center gap-2">
            Try Non-Linear Structure Visualizations <FiArrowRight />
          </Button>
        </Link>
      </div>
    </div>
  );
};
