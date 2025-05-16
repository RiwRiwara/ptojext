"use client";
import '@xyflow/react/dist/style.css';
import { useCallback, useState, useEffect, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  OnConnect,
  useNodesState,
  useEdgesState,
  addEdge,
  Edge,
  Node,
  Panel,
  EdgeTypes,
  Connection,
  useReactFlow,
} from '@xyflow/react';

// Import node components
import { ImageNode } from '@/components/flow/nodes/image-node';
import { FilterNode } from '@/components/flow/nodes/filter-node';
import { AdjustNode } from '@/components/flow/nodes/adjust-node';
import { ResultImageNode } from '@/components/flow/nodes/result-image-node';
import { CropNode } from '@/components/flow/nodes/crop-node';
import { RotateNode } from '@/components/flow/nodes/rotate-node';
import { SplitNode } from '@/components/flow/nodes/split-node';
import { DetectNode } from '@/components/flow/nodes/detect-node';
import { ThresholdNode } from '@/components/flow/nodes/threshold-node';
import { EdgeDetectionNode } from '@/components/flow/nodes/edge-detection-node';
import { NoiseReductionNode } from '@/components/flow/nodes/noise-reduction-node';
import { HistogramEqualizationNode } from '@/components/flow/nodes/histogram-equalization-node';
import { ColorQuantizationNode } from '@/components/flow/nodes/color-quantization-node';

// Import edge component
import { DataEdge } from '@/components/flow/data-edge';

// Import node panel
import { NodePanel } from '@/components/flow/node-panel';

// Import the image processing hook
import { useImageProcessingFlow } from '@/hooks/useImageProcessingFlow';
import ProcessingPanel from '@/components/flow/panel/ProcessingPanel';
import { DnDProvider, useDnD } from '@/contexts/DnDContext';
import BaseLayout from '@/components/layout/BaseLayout';
import { Toaster } from 'react-hot-toast';
import ControlPanel from '@/components/flow/panel/ControlPanel';

const nodeTypes = {
  image: ImageNode,
  adjust: AdjustNode,
  result_image: ResultImageNode,
  filter: FilterNode,
  sharpen_filter: FilterNode,
  camera: ImageNode,
  crop: CropNode,
  rotate: RotateNode,
  split: SplitNode,
  detect: DetectNode,
  threshold: ThresholdNode,
  edge_detection: EdgeDetectionNode,
  noise_reduction: NoiseReductionNode,
  histogram_equalization: HistogramEqualizationNode,
  color_quantization: ColorQuantizationNode,
};

const edgeTypes = {
  step: DataEdge,
};

// Initial nodes with fixed input and output nodes
const initialNodes: Node[] = [
  {
    id: 'input',
    type: 'image',
    data: {
      imageUrl: '',
      title: 'Input Image',
      isFixed: true,
      selectable: false,
    },
    position: { x: 50, y: 200 },
    // draggable: false,
    deletable: false,
  },
  {
    id: 'output',
    type: 'result_image',
    data: {
      imageUrl: '',
      title: 'Result Image',
      isFixed: true,
      selectable: false,
    },
    position: { x: 750, y: 200 },
    // draggable: false,
    deletable: false,
  },
];

// No initial edges
const initialEdges: Edge[] = [];

function ImageProcessingFlowComponent() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [viewportWidth, setViewportWidth] = useState(1000);
  const [processing, setProcessing] = useState(false);
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [inputImageManuallyChanged, setInputImageManuallyChanged] = useState(false);
  const { nodeType, nodeData, setNodeType, setNodeData } = useDnD();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useReactFlow();
  const { screenToFlowPosition } = reactFlowInstance;
  // Counter for generating unique node IDs
  const nodeIdCounter = useRef(1);
  const getNodeId = () => `node_${nodeIdCounter.current++}`;

  // Handle drag over event
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle drop event to create new nodes
  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      // Return if no node type is selected in the DnD context
      if (!nodeType || !nodeData) {
        return;
      }

      // Get the position where the node was dropped
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Create a new node
      const newNode = {
        id: getNodeId(),
        type: nodeType,
        position,
        data: { ...nodeData },
      };

      // Add the new node to the canvas
      setNodes((nds) => nds.concat(newNode));

      // Reset the DnD context
      setNodeType(null);
      setNodeData(null);
    },
    [nodeType, nodeData, screenToFlowPosition, setNodes, setNodeType, setNodeData]
  );

  const {
    processedImages,
    processFlow,
    processingQuality,
    setProcessingQuality,
  } = useImageProcessingFlow();

  // Update viewport width on resize
  useEffect(() => {
    const updateViewportDimensions = () => {
      const viewportElement = document.querySelector('.react-flow');
      if (viewportElement) {
        setViewportWidth(viewportElement.clientWidth);
      }
    };

    updateViewportDimensions();
    window.addEventListener('resize', updateViewportDimensions);
    return () => window.removeEventListener('resize', updateViewportDimensions);
  }, []);

  // Maintain proper spacing between input and output nodes
  const adjustFixedNodesPositions = useCallback(() => {
    const minMargin = 100;
    const inputX = minMargin;
    const outputX = Math.max(750, viewportWidth - minMargin - 300); // Adjust for node width


  }, [viewportWidth]);

  // Adjust positions when viewport or edges change
  useEffect(() => {
    adjustFixedNodesPositions();
  }, [viewportWidth, edges, adjustFixedNodesPositions]);

  // Track when input node is modified
  useEffect(() => {
    const inputNode = nodes.find(node => node.id === 'input');
    if (inputNode && inputNode.data.imageUrl && typeof inputNode.data.imageUrl === 'string') {
      setInputImageManuallyChanged(true);
    }
  }, [nodes]);

  // Custom onConnect with validation and step edge type
  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      const sourceNode = nodes.find((node) => node.id === params.source);
      const targetNode = nodes.find((node) => node.id === params.target);

      if (!sourceNode || !targetNode) {
        console.warn('Invalid connection: Source or target node not found');
        return;
      }

      // Prevent connections to the input node
      if (targetNode.id === 'input') {
        console.warn('Cannot connect to input node');
        return;
      }

      // Prevent connections from the output node
      if (sourceNode.id === 'output') {
        console.warn('Cannot connect from output node');
        return;
      }

      // Prevent self-connections
      if (params.source === params.target) {
        console.warn('Cannot connect node to itself');
        return;
      }

      // Prevent cycles (basic cycle detection)
      const hasCycle = (nodeId: string, targetId: string, edges: Edge[]): boolean => {
        const visited = new Set<string>();
        const stack = [targetId];

        while (stack.length > 0) {
          const current = stack.pop()!;
          if (current === nodeId) return true;
          if (visited.has(current)) continue;
          visited.add(current);

          const outgoingEdges = edges.filter((edge) => edge.source === current);
          for (const edge of outgoingEdges) {
            stack.push(edge.target);
          }
        }
        return false;
      };

      if (hasCycle(params.source, params.target, edges)) {
        console.warn('Connection would create a cycle');
        return;
      }

      // Add the edge with type 'step'
      setEdges((edges) =>
        addEdge(
          {
            ...params,
            type: 'step',
            data: { key: 'imageUrl' },
            animated: true,
            style: { strokeWidth: 2 },
          },
          edges
        )
      );

      // Trigger processing after connection
      setTimeout(() => {
        processFlow();
        adjustFixedNodesPositions();
      }, 100);
    },
    [setEdges, nodes, edges, processFlow, adjustFixedNodesPositions]
  );

  // Process images when edges or certain node data changes
  useEffect(() => {
    if (edges.length > 0) {
      // Use a longer delay for better debounce (500ms instead of 300ms)
      const timeoutId = setTimeout(() => {
        processFlow();
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [edges, processFlow]);
  
  // Separate effect for processing when nodes change, with more specific dependency tracking
  useEffect(() => {
    // Only trigger processing if there are edges (meaning connections exist)
    if (edges.length > 0) {
      // Extract just what we need to detect meaningful changes and avoid unnecessary processing
      const relevantNodeData = nodes.map(node => ({
        id: node.id,
        imageUrl: node.type === 'image' ? node.data.imageUrl : undefined,
        settings: node.data.settings
      }));
      
      const timeoutId = setTimeout(() => {
        processFlow();
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(nodes.map(n => ({ id: n.id, data: n.data }))), edges.length, processFlow]);

  // Handle node drag stop
  const onNodeDragStop = useCallback(() => {
    setTimeout(adjustFixedNodesPositions, 100);
  }, [adjustFixedNodesPositions]);

  // Handle viewport changes
  const onViewportChange = useCallback(() => {
    setTimeout(adjustFixedNodesPositions, 100);
  }, [adjustFixedNodesPositions]);

  // Manual process trigger
  const processImages = useCallback(async () => {
    setProcessing(true);
    setLogMessages((prev) => [...prev, 'Starting image processing...']);
    try {
      // Process the flow to update the result image
      await processFlow();
      setLogMessages((prev) => [...prev, 'Image processing completed successfully.']);
    } catch (error) {
      setLogMessages((prev) => [...prev, `Error during processing: ${error instanceof Error ? error.message : 'Unknown error'}`]);
    } finally {
      setProcessing(false);
    }
  }, [processFlow]);

  const renderLogPanel = useCallback(() => (
    <div className="mt-2 bg-white p-2 rounded-lg shadow-lg max-h-40 overflow-y-auto">
      <h3 className="text-sm font-medium mb-1">Processing Logs</h3>
      {logMessages.length === 0 ? (
        <p className="text-xs text-muted-foreground">No logs available.</p>
      ) : (
        <ul className="space-y-1 text-xs">
          {logMessages.map((msg, index) => (
            <li key={index} className="border-b border-gray-100 pb-1">{msg}</li>
          ))}
        </ul>
      )}
    </div>
  ), [logMessages]);

  return (
    <div className="h-screen w-screen relative">
      <div className="reactflow-wrapper w-full h-full" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDragStop={onNodeDragStop}
          onMove={onViewportChange}
          onViewportChange={onViewportChange}
          onDragOver={onDragOver}
          onDrop={onDrop}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
        >
          <Background />
          <Controls />
          <NodePanel />

          {/* Processing status indicator */}
          {processing && (
            <ProcessingPanel />
          )}

          {/* Control Panel */}
          {/* <ControlPanel
            processingQuality={processingQuality}
            setProcessingQuality={setProcessingQuality}
            processImages={processImages}
            processing={processing}
          /> */}
        </ReactFlow>
      </div>
    </div>
  );
}


export default function ImageProcessingFlow() {
  return (
    <BaseLayout>
      <ReactFlowProvider>
        <DnDProvider>
          <ImageProcessingFlowComponent />
          <Toaster position="top-right" toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#059669',
            },
          },
          error: {
            style: {
              background: '#e11d48',
            },
          },
        }} />
        </DnDProvider>
      </ReactFlowProvider>
    </BaseLayout>
  );
}