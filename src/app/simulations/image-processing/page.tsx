"use client";
import '@xyflow/react/dist/style.css';
import { useCallback, useState, useEffect } from 'react';
import { Image, Filter, Sliders, UploadCloud, Layers, Crop, RotateCw, Split, Wand2, BrainCircuit, Download } from 'lucide-react';
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
} from '@xyflow/react';

// Import node components
import { ImageNode } from '@/components/flow/nodes/image-node';
import { FilterNode } from '@/components/flow/nodes/filter-node';
import { AdjustNode } from '@/components/flow/nodes/adjust-node';
import { OutputNode } from '@/components/flow/nodes/output-node';

// Import edge component
import { DataEdge } from '@/components/flow/data-edge';

// Import node panel
import { NodePanel } from '@/components/flow/node-panel';

// Import the image processing hook
import { useImageProcessingFlow } from '@/hooks/useImageProcessingFlow';

const nodeTypes = {
  image: ImageNode,
  filter: FilterNode,
  adjust: AdjustNode,
  output: OutputNode,
  camera: ImageNode, // Reuse ImageNode for camera
  crop: FilterNode, // Temporarily reuse FilterNode
  rotate: FilterNode, // Temporarily reuse FilterNode
  split: FilterNode, // Temporarily reuse FilterNode
  detect: FilterNode, // Temporarily reuse FilterNode
  sharpen: FilterNode, // Reuse FilterNode
};

const edgeTypes = {
  data: DataEdge,
};

// Fixed sample images to choose from
const sampleImages = [
  'https://images.unsplash.com/photo-1622737133809-d95047b9e673',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956',
  'https://images.unsplash.com/photo-1557800636-894a64c1696f',
];

// Initial nodes with fixed input and output nodes
const initialNodes: Node[] = [
  // Input node (fixed position on the left)
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
  },
  // Output node (fixed position on the right)
  {
    id: 'output',
    type: 'output',
    data: {
      imageUrl: '',
      isFixed: true,
      selectable: false,
    },
    position: { x: 750, y: 200 },
    draggable: false,
  }
];

// No initial edges
const initialEdges: Edge[] = [];

function ImageProcessingFlowComponent() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedImage, setSelectedImage] = useState(0); // Index of selected sample image
  const {
    processedImages,
    processing,
    processFlow,
    processingQuality,
    setProcessingQuality
  } = useImageProcessingFlow();

  // Update input image when selection changes
  useEffect(() => {
    setNodes(nodes => nodes.map(node =>
      node.id === 'input'
        ? { ...node, data: { ...node.data, imageUrl: sampleImages[selectedImage] } }
        : node
    ));

    // Process after a short delay to allow image to load
    const timeoutId = setTimeout(() => {
      processFlow();
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [selectedImage, setNodes, processFlow]);

  // Process when edges change
  useEffect(() => {
    if (edges.length > 0) {
      // Process after a short delay to allow for multiple changes
      const timeoutId = setTimeout(() => {
        processFlow();
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [edges, processFlow]);

  const onConnect: OnConnect = useCallback(
    (params) => {
      setEdges((edges) => {
        const newEdges = addEdge({ type: 'data', data: { key: 'imageUrl' }, ...params }, edges);
        return newEdges;
      });
    },
    [setEdges],
  );

  // Function to manually trigger image processing
  const processImages = useCallback(() => {
    processFlow();
  }, [processFlow]);

  return (
    <div className="h-screen w-screen relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
      >
        <Background />
        <Controls />
        <NodePanel />


        {/* Processing status indicator */}
        {processing && (
          <Panel position="bottom-right" className="p-2">
            <div className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg animate-pulse">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </div>
          </Panel>
        )}

        {/* Control Panel */}
        <Panel position="top-center" className="p-2">
          <div className="bg-white p-3 rounded-lg shadow-lg flex flex-col gap-3">
            {/* Quality Selection */}
            <div className="space-y-2">
              <div className="text-sm font-medium">Processing Quality</div>
              <div className="flex gap-2">
                {['Low', 'Medium', 'High'].map((quality) => (
                  <button
                    key={quality}
                    className={`px-3 py-1 text-xs rounded ${processingQuality === quality.toLowerCase() ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                    onClick={() => setProcessingQuality(quality.toLowerCase() as 'low' | 'medium' | 'high')}
                  >
                    {quality}
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Process Button */}
            <button
              onClick={processImages}
              disabled={processing}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded font-medium transition-all disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Process Now
            </button>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

// Wrap the component with ReactFlowProvider
export default function ImageProcessingFlow() {
  return (
    <ReactFlowProvider>
      <ImageProcessingFlowComponent />
    </ReactFlowProvider>
  );
}
