"use client";
import React, { useCallback, useState, DragEvent } from "react";
import { useReactFlow } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Filter, Sliders, Layers, Crop, RotateCw, Split, Wand2, BrainCircuit, ChevronDown, ChevronUp, Grid, ZapIcon, Waves, BarChart3, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDnD } from "@/contexts/DnDContext";
import { 
  NodeTypes,
  FilterNodeData,
  AdjustNodeData,
  CropNodeData,
  RotateNodeData,
  SplitNodeData,
  DetectNodeData,
  ThresholdNodeData,
  EdgeDetectionNodeData,
  NoiseReductionNodeData,
  HistogramEqualizationNodeData,
  ColorQuantizationNodeData 
} from './types';

interface NodeType {
  type: NodeTypes;
  label: string;
  icon: React.ReactNode;
  data: Record<string, unknown>;
  category: "filter" | "transform" | "ai";
  description: string;
}

const nodeTypes: NodeType[] = [
  // Filter nodes
  {
    type: "filter", 
    label: "Filter",
    icon: <Filter className="h-4 w-4" />,
    data: { type: "blur", intensity: 50 } as FilterNodeData,
    category: "filter",
    description: "Applies a blur effect to the image",
  },
  {
    type: "adjust",
    label: "Adjust Colors",
    icon: <Sliders className="h-4 w-4" />,
    data: { brightness: 0, contrast: 0, saturation: 0 } as AdjustNodeData,
    category: "filter",
    description: "Adjusts brightness, contrast, and saturation",
  },
  {
    type: "threshold",
    label: "Threshold",
    icon: <Grid className="h-4 w-4" />,
    data: { threshold: 128, inverted: false } as ThresholdNodeData,
    category: "filter",
    description: "Converts image to black and white based on threshold",
  },
  {
    type: "edge_detection",
    label: "Edge Detection",
    icon: <ZapIcon className="h-4 w-4" />,
    data: { algorithm: "sobel", threshold: 50 } as EdgeDetectionNodeData,
    category: "filter",
    description: "Detects edges in the image using various algorithms",
  },
  {
    type: "noise_reduction",
    label: "Noise Reduction",
    icon: <Waves className="h-4 w-4" />,
    data: { algorithm: "gaussian", intensity: 50 } as NoiseReductionNodeData,
    category: "filter",
    description: "Reduces noise in the image using various algorithms",
  },
  // Transform nodes
  {
    type: "crop",
    label: "Crop",
    icon: <Crop className="h-4 w-4" />,
    data: { x: 0, y: 0, width: 100, height: 100 } as CropNodeData,
    category: "transform",
    description: "Crops a specific region of the image",
  },
  {
    type: "rotate",
    label: "Rotate",
    icon: <RotateCw className="h-4 w-4" />,
    data: { angle: 0 } as RotateNodeData,
    category: "transform",
    description: "Rotates the image by a specified angle",
  },
  {
    type: "split",
    label: "Channel Split",
    icon: <Split className="h-4 w-4" />,
    data: { channel: "red" } as SplitNodeData,
    category: "transform",
    description: "Splits image into color channels",
  },
  {
    type: "histogram_equalization",
    label: "Histogram Equalization",
    icon: <BarChart3 className="h-4 w-4" />,
    data: { mode: "global", clipLimit: 2.0 } as HistogramEqualizationNodeData,
    category: "transform",
    description: "Enhances contrast using histogram equalization",
  },
  {
    type: "color_quantization",
    label: "Color Quantization",
    icon: <Palette className="h-4 w-4" />,
    data: { colors: 8, dithering: true } as ColorQuantizationNodeData,
    category: "transform",
    description: "Reduces the number of colors in the image",
  },
  // AI nodes
  {
    type: "detect",
    label: "Object Detection",
    icon: <BrainCircuit className="h-4 w-4" />,
    data: { sensitivity: 0.5 } as DetectNodeData,
    category: "ai",
    description: "Detects objects within the image using AI",
  },
];

export function NodePanel() {
  const reactFlowInstance = useReactFlow();
  const { screenToFlowPosition, getNodes, addNodes } = reactFlowInstance;
  const [searchQuery, setSearchQuery] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { setNodeType, setNodeData } = useDnD();

  const addNode = useCallback(
    (nodeType: NodeType) => {
      const nodes = getNodes();
      const newNodeId = `node_${nodes.length + 1}`;
      // Improved positioning: offset new nodes to avoid overlap
      const position = screenToFlowPosition({
        x: window.innerWidth / 2 + Math.random() * 50 - 25,
        y: window.innerHeight / 2 + Math.random() * 50 - 25,
      });

      addNodes([
        {
          id: newNodeId,
          type: nodeType.type,
          position,
          data: nodeType.data,
        },
      ]);
    },
    [getNodes, addNodes, screenToFlowPosition]
  );

  const filteredNodes = nodeTypes.filter((node) =>
    node.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDragStart = (event: DragEvent<HTMLButtonElement>, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType.type);
    event.dataTransfer.effectAllowed = 'move';
    
    // Set the node type and data in the DnD context
    setNodeType(nodeType.type);
    setNodeData(nodeType.data);
  };

  const renderNodeButton = (nodeType: NodeType) => (
    <Tooltip key={nodeType.type}>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start gap-2 hover:bg-accent/50 transition-colors cursor-grab active:cursor-grabbing"
          onClick={() => addNode(nodeType)}
          draggable
          onDragStart={(e) => handleDragStart(e, nodeType)}
          aria-label={`Add ${nodeType.label} node`}
        >
          {nodeType.icon}
          <span className="truncate">{nodeType.label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{nodeType.description}</p>
      </TooltipContent>
    </Tooltip>
  );

  return (
    <TooltipProvider>
      <Card
        className={cn(
          "fixed top-20 left-5 w-80 shadow-xl transition-all duration-300 z-10 bg-gradient-to-b from-background to-background/95 rounded-lg border-slate-200 dark:border-slate-800",
          isCollapsed ? "h-16" : "max-h-[80vh] overflow-y-auto"
        )}
      >
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Layers className="h-5 w-5" />
            Image Processing
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Expand panel" : "Collapse panel"}
          >
            {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
        </CardHeader>
        {!isCollapsed && (
          <CardContent className="p-4">
            <Input
              placeholder="Search nodes..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="mb-4"
              aria-label="Search nodes"
            />
            <Tabs defaultValue="filter" className="w-full">
              <TabsList className="w-full grid grid-cols-3 mb-4">
                <TabsTrigger
                  value="filter"
                  className="text-xs"
                  title="Filter Nodes"
                  aria-label="Filter Nodes"
                >
                  <Filter className="h-4 w-4 mr-1" />
                  Filters
                </TabsTrigger>
                <TabsTrigger
                  value="transform"
                  className="text-xs"
                  title="Transform Nodes"
                  aria-label="Transform Nodes"
                >
                  <Crop className="h-4 w-4 mr-1" />
                  Transforms
                </TabsTrigger>
                <TabsTrigger
                  value="ai"
                  className="text-xs"
                  title="AI Nodes"
                  aria-label="AI Nodes"
                >
                  <BrainCircuit className="h-4 w-4 mr-1" />
                  AI
                </TabsTrigger>
              </TabsList>

              {/* Filter Nodes */}
              <TabsContent value="filter" className="grid gap-2">
                {filteredNodes
                  .filter((node) => node.category === "filter")
                  .map(renderNodeButton)}
              </TabsContent>

              {/* Transform Nodes */}
              <TabsContent value="transform" className="grid gap-2">
                {filteredNodes
                  .filter((node) => node.category === "transform")
                  .map(renderNodeButton)}
              </TabsContent>

              {/* AI Nodes */}
              <TabsContent value="ai" className="grid gap-2">
                {filteredNodes
                  .filter((node) => node.category === "ai")
                  .map(renderNodeButton)}
              </TabsContent>
            </Tabs>
          </CardContent>
        )}
      </Card>
    </TooltipProvider>
  );
}