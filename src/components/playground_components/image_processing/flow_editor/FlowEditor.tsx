import React, { useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  Connection,
  ReactFlowProvider,
  Node,
  Edge,
  NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Import icons
import { TbAdjustments, TbArrowsRandom, TbEye, TbPlus } from 'react-icons/tb';
import { FaImage, FaFilter, FaRegSave } from 'react-icons/fa';

// Import custom node components
import { ImageInputNode } from './nodes/ImageInputNode';
import { ImageProcessNode } from './nodes/ImageProcessNode';
import { ImageOutputNode } from './nodes/ImageOutputNode';
import { PropertiesPanel } from './PropertiesPanel';
import { useFlowStore } from './store';

// Define node types
const nodeTypes: NodeTypes = {
  imageInput: ImageInputNode,
  imageProcess: ImageProcessNode,
  imageOutput: ImageOutputNode,
};

// Define node categories and types for the sidebar
const nodeCategories = [
  {
    id: 'inputs',
    label: 'Inputs',
    icon: <FaImage />,
    nodes: [
      { id: 'imageUpload', label: 'Image Upload', type: 'imageInput' },
      { id: 'camera', label: 'Camera Input', type: 'imageInput' },
    ],
  },
  {
    id: 'filters',
    label: 'Filters',
    icon: <FaFilter />,
    nodes: [
      { id: 'blur', label: 'Blur', type: 'imageProcess' },
      { id: 'grayscale', label: 'Grayscale', type: 'imageProcess' },
      { id: 'sepia', label: 'Sepia', type: 'imageProcess' },
      { id: 'invert', label: 'Invert', type: 'imageProcess' },
    ],
  },
  {
    id: 'edgeDetection',
    label: 'Edge Detection',
    icon: <TbArrowsRandom />,
    nodes: [
      { id: 'edgeDetection', label: 'Edge Detection', type: 'imageProcess' },
      { id: 'sobelOperator', label: 'Sobel Operator', type: 'imageProcess' },
    ],
  },
  {
    id: 'adjustments',
    label: 'Adjustments',
    icon: <TbAdjustments />,
    nodes: [
      { id: 'brightness', label: 'Brightness', type: 'imageProcess' },
      { id: 'contrast', label: 'Contrast', type: 'imageProcess' },
      { id: 'saturation', label: 'Saturation', type: 'imageProcess' },
      { id: 'hueRotate', label: 'Hue Rotate', type: 'imageProcess' },
    ],
  },
  {
    id: 'outputs',
    label: 'Outputs',
    icon: <TbEye />,
    nodes: [
      { id: 'preview', label: 'Preview', type: 'imageOutput' },
      { id: 'save', label: 'Save Image', type: 'imageOutput' },
    ],
  },
];

// Initial nodes and edges
const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

function FlowEditorContent() {
  const { t } = useTranslation();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { selectedNode } = useFlowStore();

  // Handle connections between nodes and process the flow
  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => {
      const newEdges = addEdge(connection, eds);
      
      // Process the flow after a new connection is made
      setTimeout(() => {
        console.log('Connection made, processing flow...');
        const { processFlow, setNodeInputImage, getNodeOutputImage } = useFlowStore.getState();
        
        // First, directly set the input of the target node to the output of the source node
        if (connection.source && connection.target) {
          const sourceOutput = getNodeOutputImage(connection.source);
          if (sourceOutput) {
            console.log(`Setting input of ${connection.target} to output of ${connection.source}`);
            setNodeInputImage(connection.target, sourceOutput);
          }
        }
        
        // Then process the entire flow
        processFlow(nodes, newEdges);
      }, 100);
      
      return newEdges;
    });
  }, [setEdges, nodes]);

  // Handle drag over for node creation
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle drop for node creation
  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!reactFlowBounds) return;

      const nodeData = JSON.parse(event.dataTransfer.getData('application/reactflow'));

      // Check if the dropped element is valid
      if (typeof nodeData.type === 'undefined' || !nodeData.label) {
        return;
      }

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      // Create a unique ID for the node
      const id = `${nodeData.id}-${nodes.length + 1}`;

      const newNode = {
        id,
        type: nodeData.type,
        position,
        data: {
          label: nodeData.label,
          category: nodeData.category,
        },
      };

      setNodes((nds) => {
        const updatedNodes = nds.concat(newNode as Node);
        // Process the flow after a new node is added
        setTimeout(() => {
          const { processFlow } = useFlowStore.getState();
          processFlow(updatedNodes, edges);
        }, 100);
        return updatedNodes;
      });
    },
    [nodes, setNodes, edges]
  );

  // Define a type for the node data that includes category
  type NodeWithCategory = {
    id: string;
    type: string;
    label: string;
    category?: string;
  };
  
  // Handle drag start for node creation
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeData: NodeWithCategory) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className=" py-6 px-4">
      <div className="flex gap-4 h-[calc(100vh-200px)] min-h-[600px]">
        {/* Left panel - Node library */}
        <div className="w-64 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-medium text-gray-800">Node Library</h2>
            <p className="text-xs text-gray-500">Drag nodes to the canvas</p>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-3 space-y-2">
              {nodeCategories.map((category) => (
                <div key={category.id} className="space-y-1">
                  <div
                    className="flex items-center justify-between p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                    onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[#83AFC9]">{category.icon}</span>
                      <span className="font-medium text-sm">{category.label}</span>
                    </div>
                    <span className={`transition-transform ${selectedCategory === category.id ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </div>

                  {selectedCategory === category.id && (
                    <div className="pl-2 space-y-1">
                      {category.nodes.map((node) => (
                        <div
                          key={node.id}
                          className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-grab"
                          draggable
                          onDragStart={(event) => onDragStart(event, { ...node, category: category.id  })}
                        >
                          <div className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full">
                            <TbPlus size={14} className="text-gray-600" />
                          </div>
                          <span className="text-sm">{node.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-gray-100 border-t border-gray-200 space-y-2">
            <button 
              className="w-full py-2 bg-[#83AFC9] text-white rounded flex items-center justify-center gap-2 hover:bg-[#6b9cb5]"
              onClick={() => {
                // Export the current flow as JSON
                const flow = {
                  nodes,
                  edges,
                  timestamp: new Date().toISOString(),
                };
                
                // Create a download link
                const dataStr = JSON.stringify(flow, null, 2);
                const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
                
                const exportName = `image-flow-${new Date().getTime()}.json`;
                const linkElement = document.createElement('a');
                linkElement.setAttribute('href', dataUri);
                linkElement.setAttribute('download', exportName);
                linkElement.click();
              }}
            >
              <FaRegSave size={14} />
              <span>Export Workflow</span>
            </button>
            
            <label className="w-full py-2 bg-gray-600 text-white rounded flex items-center justify-center gap-2 hover:bg-gray-700 cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept=".json"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      try {
                        const flow = JSON.parse(e.target?.result as string);
                        if (flow.nodes && flow.edges) {
                          setNodes(flow.nodes);
                          setEdges(flow.edges);
                          
                          // Process the flow after loading
                          setTimeout(() => {
                            const { processFlow } = useFlowStore.getState();
                            processFlow(flow.nodes, flow.edges);
                          }, 100);
                        }
                      } catch (error) {
                        console.error('Error importing flow:', error);
                        alert('Invalid flow file format');
                      }
                    };
                    reader.readAsText(file);
                  }
                }}
              />
              <span>Import Workflow</span>
            </label>
          </div>
        </div>

        {/* Center - Flow canvas */}
        <div className="flex-1" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
          >
            <Controls />
            <MiniMap nodeColor="#83AFC9" />
            <Background gap={16} size={1} />
            <Panel position="top-right">
              <div className="bg-white p-2 rounded shadow-md border border-gray-200">
                <div className="px-3 py-1 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Real-time processing
                  </span>
                </div>
              </div>
            </Panel>
          </ReactFlow>
        </div>

        {/* Right panel - Properties */}
        <div className="w-72 bg-white rounded-lg shadow-md border border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-medium text-gray-800">Properties</h2>
            <p className="text-xs text-gray-500">Edit selected node properties</p>
          </div>

          <PropertiesPanel node={selectedNode} />
        </div>
      </div>
    </div>
  );
}

// Wrap with ReactFlowProvider to fix the zustand provider error
export function FlowEditor() {
  return (
    <ReactFlowProvider>
      <FlowEditorContent />
    </ReactFlowProvider>
  );
}
