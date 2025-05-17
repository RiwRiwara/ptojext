"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { FiPlay, FiPause, FiRefreshCw, FiInfo } from 'react-icons/fi';

export const DataStructureVisualizer = () => {
  const [activeStructure, setActiveStructure] = useState('array');
  const [animationSpeed, setAnimationSpeed] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentOperation, setCurrentOperation] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Sample data for visualization
  const [arrayData, setArrayData] = useState([5, 8, 2, 9, 1, 7, 3]);
  const [linkedListData, setLinkedListData] = useState([
    { value: 10, next: 1 },
    { value: 20, next: 2 },
    { value: 30, next: 3 },
    { value: 40, next: -1 }
  ]);
  const [treeData, setTreeData] = useState({
    value: 50,
    left: { value: 30, left: { value: 20, left: null, right: null }, right: { value: 40, left: null, right: null } },
    right: { value: 70, left: { value: 60, left: null, right: null }, right: { value: 80, left: null, right: null } }
  });
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw based on active structure
    if (activeStructure === 'array') {
      drawArray(ctx, canvas.width, canvas.height);
    } else if (activeStructure === 'linkedList') {
      drawLinkedList(ctx, canvas.width, canvas.height);
    } else if (activeStructure === 'tree') {
      drawTree(ctx, canvas.width, canvas.height);
    } else if (activeStructure === 'graph') {
      drawGraph(ctx, canvas.width, canvas.height);
    }
  }, [activeStructure, arrayData, linkedListData, treeData, isPlaying, currentOperation]);
  
  const drawArray = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const cellWidth = width / (arrayData.length + 2);
    const cellHeight = 60;
    const startX = cellWidth;
    const startY = height / 2 - cellHeight / 2;
    
    // Draw array cells
    arrayData.forEach((value, index) => {
      const x = startX + index * cellWidth;
      
      // Draw cell
      ctx.fillStyle = currentOperation === `array-${index}` ? '#3b82f6' : '#f3f4f6';
      ctx.strokeStyle = '#d1d5db';
      ctx.lineWidth = 2;
      ctx.fillRect(x, startY, cellWidth, cellHeight);
      ctx.strokeRect(x, startY, cellWidth, cellHeight);
      
      // Draw index
      ctx.fillStyle = '#6b7280';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(index.toString(), x + cellWidth / 2, startY - 10);
      
      // Draw value
      ctx.fillStyle = '#111827';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(value.toString(), x + cellWidth / 2, startY + cellHeight / 2 + 6);
    });
  };
  
  const drawLinkedList = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const nodeRadius = 30;
    const nodeSpacing = 100;
    const startX = 50;
    const startY = height / 2;
    
    linkedListData.forEach((node, index) => {
      const x = startX + index * nodeSpacing;
      
      // Draw node circle
      ctx.fillStyle = currentOperation === `node-${index}` ? '#3b82f6' : '#f3f4f6';
      ctx.strokeStyle = '#d1d5db';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, startY, nodeRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      // Draw value
      ctx.fillStyle = '#111827';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(node.value.toString(), x, startY + 5);
      
      // Draw arrow if not the last node
      if (node.next !== -1) {
        const nextX = startX + node.next * nodeSpacing;
        
        // Arrow line
        ctx.strokeStyle = '#9ca3af';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + nodeRadius, startY);
        ctx.lineTo(nextX - nodeRadius, startY);
        ctx.stroke();
        
        // Arrow head
        ctx.beginPath();
        ctx.moveTo(nextX - nodeRadius, startY);
        ctx.lineTo(nextX - nodeRadius - 10, startY - 5);
        ctx.lineTo(nextX - nodeRadius - 10, startY + 5);
        ctx.closePath();
        ctx.fill();
      }
    });
  };
  
  const drawTree = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const drawNode = (node: any, x: number, y: number, level: number, maxWidth: number) => {
      if (!node) return;
      
      const nodeRadius = 25;
      const levelHeight = 80;
      const widthOffset = maxWidth / Math.pow(2, level + 1);
      
      // Draw node circle
      ctx.fillStyle = '#f3f4f6';
      ctx.strokeStyle = '#d1d5db';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      // Draw value
      ctx.fillStyle = '#111827';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(node.value.toString(), x, y + 5);
      
      // Draw left child
      if (node.left) {
        const childX = x - widthOffset;
        const childY = y + levelHeight;
        
        // Draw connection line
        ctx.strokeStyle = '#9ca3af';
        ctx.beginPath();
        ctx.moveTo(x - nodeRadius / 2, y + nodeRadius / 2);
        ctx.lineTo(childX + nodeRadius / 2, childY - nodeRadius / 2);
        ctx.stroke();
        
        // Draw child recursively
        drawNode(node.left, childX, childY, level + 1, maxWidth);
      }
      
      // Draw right child
      if (node.right) {
        const childX = x + widthOffset;
        const childY = y + levelHeight;
        
        // Draw connection line
        ctx.strokeStyle = '#9ca3af';
        ctx.beginPath();
        ctx.moveTo(x + nodeRadius / 2, y + nodeRadius / 2);
        ctx.lineTo(childX - nodeRadius / 2, childY - nodeRadius / 2);
        ctx.stroke();
        
        // Draw child recursively
        drawNode(node.right, childX, childY, level + 1, maxWidth);
      }
    };
    
    // Start drawing tree from root
    drawNode(treeData, width / 2, 60, 0, width - 100);
  };
  
  const drawGraph = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Sample graph data
    const nodes = [
      { id: 0, x: width / 2, y: 60, value: 'A' },
      { id: 1, x: width / 4, y: height / 3, value: 'B' },
      { id: 2, x: 3 * width / 4, y: height / 3, value: 'C' },
      { id: 3, x: width / 3, y: 2 * height / 3, value: 'D' },
      { id: 4, x: 2 * width / 3, y: 2 * height / 3, value: 'E' }
    ];
    
    const edges = [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 4 },
      { from: 3, to: 4 },
      { from: 1, to: 2 }
    ];
    
    // Draw edges
    edges.forEach(edge => {
      const fromNode = nodes[edge.from];
      const toNode = nodes[edge.to];
      
      ctx.strokeStyle = '#9ca3af';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      ctx.stroke();
    });
    
    // Draw nodes
    nodes.forEach(node => {
      const nodeRadius = 25;
      
      // Draw node circle
      ctx.fillStyle = '#f3f4f6';
      ctx.strokeStyle = '#d1d5db';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      // Draw value
      ctx.fillStyle = '#111827';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(node.value, node.x, node.y + 5);
    });
  };
  
  const handleOperationSelect = (operation: string) => {
    setIsPlaying(false);
    setCurrentOperation(null);
    
    // Simulate operation based on structure type
    if (activeStructure === 'array') {
      if (operation === 'insert') {
        const newValue = Math.floor(Math.random() * 100);
        const newArray = [...arrayData, newValue];
        setArrayData(newArray);
      } else if (operation === 'delete') {
        if (arrayData.length > 0) {
          const newArray = [...arrayData];
          newArray.pop();
          setArrayData(newArray);
        }
      } else if (operation === 'search') {
        const randomIndex = Math.floor(Math.random() * arrayData.length);
        setCurrentOperation(`array-${randomIndex}`);
      }
    } else if (activeStructure === 'linkedList') {
      if (operation === 'insert') {
        const newValue = Math.floor(Math.random() * 100);
        const newNode = { value: newValue, next: -1 };
        const newList = [...linkedListData];
        
        if (newList.length > 0) {
          const lastNodeIndex = newList.length - 1;
          newList[lastNodeIndex].next = newList.length;
        }
        
        newList.push(newNode);
        setLinkedListData(newList);
      } else if (operation === 'delete') {
        if (linkedListData.length > 1) {
          const newList = linkedListData.slice(0, -1);
          newList[newList.length - 1].next = -1;
          setLinkedListData(newList);
        }
      } else if (operation === 'search') {
        const randomIndex = Math.floor(Math.random() * linkedListData.length);
        setCurrentOperation(`node-${randomIndex}`);
      }
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Interactive Data Structure Visualizer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Tabs value={activeStructure} onValueChange={setActiveStructure} className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="array">Array</TabsTrigger>
                <TabsTrigger value="linkedList">Linked List</TabsTrigger>
                <TabsTrigger value="tree">Tree</TabsTrigger>
                <TabsTrigger value="graph">Graph</TabsTrigger>
              </TabsList>
              
              <div className="flex flex-col space-y-4">
                <div className="border rounded-md p-2">
                  <canvas 
                    ref={canvasRef} 
                    width={800} 
                    height={400} 
                    className="w-full h-[400px] bg-white rounded-md"
                  />
                </div>
                
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-sm font-medium mb-1 block">Operation</label>
                    <Select onValueChange={handleOperationSelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select operation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="insert">Insert</SelectItem>
                        <SelectItem value="delete">Delete</SelectItem>
                        <SelectItem value="search">Search</SelectItem>
                        {activeStructure === 'array' && (
                          <SelectItem value="sort">Sort</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-sm font-medium mb-1 block">Animation Speed</label>
                    <Slider
                      value={[animationSpeed]}
                      min={10}
                      max={100}
                      step={10}
                      onValueChange={(value) => setAnimationSpeed(value[0])}
                      className="py-2"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <FiPause /> : <FiPlay />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsPlaying(false);
                        setCurrentOperation(null);
                        
                        if (activeStructure === 'array') {
                          setArrayData([5, 8, 2, 9, 1, 7, 3]);
                        } else if (activeStructure === 'linkedList') {
                          setLinkedListData([
                            { value: 10, next: 1 },
                            { value: 20, next: 2 },
                            { value: 30, next: 3 },
                            { value: 40, next: -1 }
                          ]);
                        }
                      }}
                    >
                      <FiRefreshCw />
                    </Button>
                  </div>
                </div>
              </div>
            </Tabs>
            
            <div className="p-4 bg-muted/50 rounded-md">
              <div className="flex items-start gap-2">
                <FiInfo className="mt-1 text-muted-foreground" />
                <div>
                  <h4 className="text-sm font-medium">How to use this visualizer</h4>
                  <p className="text-sm text-muted-foreground">
                    Select a data structure type from the tabs above. Choose operations from the dropdown to see how they affect the structure.
                    Adjust the animation speed slider to control visualization speed. Use the play/pause button to control animations and the reset button to return to the initial state.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
