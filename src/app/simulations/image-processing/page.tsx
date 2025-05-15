"use client";
import '@xyflow/react/dist/style.css';
import { useCallback, useState, useEffect } from 'react';
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

// Import edge component
import { DataEdge } from '@/components/flow/data-edge';

// Import node panel
import { NodePanel } from '@/components/flow/node-panel';

// Import the image processing hook
import { useImageProcessingFlow } from '@/hooks/useImageProcessingFlow';
import ProcessingPanel from '@/components/flow/panel/ProcessingPanel';
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
};

const edgeTypes = {
  step: DataEdge,
};

// Fixed sample images to choose from
const sampleImages = [
  'https://images.unsplash.com/photo-1622737133809-d95047b9e673',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956',
  'https://images.unsplash.com/photo-1557800636-894a64c1696f',
];

// Initial nodes with fixed input and output nodes
const initialNodes: Node[] = [
  {
    id: 'input',
    type: 'image',
    data: {
      imageUrl: sampleImages[0],
      title: 'Input Image',
      isFixed: true,
      selectable: false,
    },
    position: { x: 50, y: 200 },
    draggable: false,
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
    draggable: false,
    deletable: false,
  },
];

// No initial edges
const initialEdges: Edge[] = [];

function ImageProcessingFlowComponent() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedImage, setSelectedImage] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(1000);
  const [processing, setProcessing] = useState(false);
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const {
    processedImages,
    processFlow,
    processingQuality,
    setProcessingQuality,
  } = useImageProcessingFlow();

  // Update input image when selection changes
  useEffect(() => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === 'input'
          ? { ...node, data: { ...node.data, imageUrl: sampleImages[selectedImage] } }
          : node
      )
    );

    const timeoutId = setTimeout(() => {
      processFlow();
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [selectedImage, setNodes, processFlow]);

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

    setNodes((currentNodes) =>
      currentNodes.map((node) => {
        if (node.id === 'input') {
          return { ...node, position: { ...node.position, x: inputX } };
        } else if (node.id === 'output') {
          return { ...node, position: { ...node.position, x: outputX } };
        }
        return node;
      })
    );
  }, [setNodes, viewportWidth]);

  // Adjust positions when viewport or edges change
  useEffect(() => {
    adjustFixedNodesPositions();
  }, [viewportWidth, edges, adjustFixedNodesPositions]);

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

  // Process images when edges change
  useEffect(() => {
    if (edges.length > 0) {
      const timeoutId = setTimeout(() => {
        processFlow();
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [edges, processFlow]);

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
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        onMove={onViewportChange}
        onViewportChange={onViewportChange}
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
  );
}

import BaseLayout from '@/components/layout/BaseLayout';

export default function ImageProcessingFlow() {
  return (
    <BaseLayout>
      <ReactFlowProvider>
        <ImageProcessingFlowComponent />
      </ReactFlowProvider>
    </BaseLayout>
  );
}