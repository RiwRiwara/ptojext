import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  ReactFlowProvider,
  Panel,
  NodeTypes,
  EdgeTypes,
  Connection,
  useReactFlow,
  useOnSelectionChange,
  Node,
  Edge,
  OnConnectStartParams,
  MarkerType,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  MiniMap,
  ReactFlowState,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Import icons
import { TbAdjustments, TbArrowsRandom, TbEye, TbPlus } from 'react-icons/tb';
import { FaImage, FaFilter, FaRegSave } from 'react-icons/fa';

// Import custom node components
import { ImageInputNode } from './nodes/ImageInputNode';
import { CameraInputNode } from './nodes/CameraInputNode';
import { ImageProcessNode } from './nodes/ImageProcessNode';
import { ImageOutputNode } from './nodes/ImageOutputNode';
import { CustomEdge } from './edges/CustomEdge';

// Import the store with proper typing
import { useFlowStore } from './store';
import { FlowState } from './store';
import { useTranslation } from 'react-i18next';

// Define node types
const nodeTypes: NodeTypes = {
  imageInput: ImageInputNode,
  cameraInput: CameraInputNode,
  imageProcess: ImageProcessNode,
  imageOutput: ImageOutputNode,
};

// Define edge types
const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

// Define node categories and types for the sidebar
const nodeCategories = [
  {
    id: 'inputs',
    label: 'Inputs',
    icon: <FaImage />,
    nodes: [
      { id: 'imageUpload', label: 'Image Upload', type: 'imageInput' },
      { id: 'camera', label: 'Camera Input', type: 'cameraInput' },
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
      { id: 'save', label: 'Save Image', type: 'imageOutput' },
    ],
  },
];

// Initial nodes and edges
const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

function FlowEditorContent() {
  const { t } = useTranslation();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useReactFlow();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Memoize nodeTypes and edgeTypes to prevent recreation on each render
  const memoizedNodeTypes = useMemo(() => nodeTypes, []);
  const memoizedEdgeTypes = useMemo(() => edgeTypes, []);

  // Use React Flow's built-in hooks with proper typing
  const reactFlow = useReactFlow<Node, Edge>();

  // Get nodes and edges from React Flow
  const nodes = reactFlow.getNodes();
  const edges = reactFlow.getEdges();

  // Get store state and safely access store functions
  const storeState = useFlowStore.getState();
  const [currentSelectedNode, setCurrentSelectedNode] = useState<Node | null>(null);

  // Safely access store functions with proper typing
  const safeProcessFlow = useCallback((nodes: Node[], edges: Edge[]) => {
    const processFlow = storeState.processFlow;
    if (typeof processFlow === 'function') {
      processFlow(nodes, edges);
    }
  }, [storeState.processFlow]);

  const safeSetSelectedNode = useCallback((node: Node | null) => {
    const setSelectedNode = storeState.setSelectedNode;
    if (typeof setSelectedNode === 'function') {
      setSelectedNode(node);
      setCurrentSelectedNode(node);
    }
  }, [storeState.setSelectedNode]);

  // Process the flow when nodes or edges change
  useEffect(() => {
    if (nodes.length > 0) {
      safeProcessFlow(nodes, edges);
    }
  }, [nodes, edges, safeProcessFlow]);

  // Handle node selection changes
  useOnSelectionChange({
    onChange: ({ nodes }) => {
      if (nodes.length === 1) {
        safeSetSelectedNode(nodes[0]);
      } else {
        safeSetSelectedNode(null);
      }
    }
  });

  // Handle connections between nodes with proper typing
  const onConnect = useCallback<OnConnect>((connection) => {
    if (connection.source && connection.target) {
      const addEdge = storeState.addEdge;
      if (typeof addEdge === 'function') {
        addEdge(connection);
      }
    }
  }, [storeState.addEdge]);

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
      if (!nodeData) return;

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      // Create a unique ID for the node
      const id = `${nodeData.type}_${Date.now()}`;

      // Create the new node
      const newNode: Node = {
        id,
        position,
        type: nodeData.type,
        data: {
          label: nodeData.label,
          type: nodeData.id, // Store the node's function type (e.g., 'blur', 'grayscale')
          category: nodeData.category,
        },
      };

      // Use the store's addNode method
      const addNode = storeState.addNode;
      if (typeof addNode === 'function') {
        addNode(newNode);
      }
    },
    [storeState.addNode]
  );

  // Define a type for the node data that includes category
  interface NodeWithCategory {
    id: string;
    type: string;
    label: string;
    category?: string;
  }

  // Handle drag start for node creation
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeData: NodeWithCategory) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className=" py-6 px-4">
      <div className="flex h-full">
        {/* Left sidebar - Node types */}
        <div className="w-64 bg-white rounded-lg shadow-md border border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-medium text-gray-800">{t('Image Processing')}</h2>
            <p className="text-xs text-gray-500">{t('Drag nodes to the canvas')}</p>
          </div>

          <div className="p-2 space-y-2">
            {nodeCategories.map((category) => (
              <div key={category.id} className="space-y-1">
                <button
                  onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                  className="w-full flex items-center justify-between p-2 rounded hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">{category.icon}</span>
                    <span className="font-medium text-sm">{t(category.label)}</span>
                  </div>
                  <span className={`transform transition-transform ${selectedCategory === category.id ? 'rotate-180' : ''}`}>
                    <TbPlus size={14} />
                  </span>
                </button>

                {selectedCategory === category.id && (
                  <div className="ml-2 pl-2 border-l-2 border-gray-200 space-y-1">
                    {category.nodes.map((node) => (
                      <div
                        key={node.id}
                        className="flex items-center gap-2 py-1 px-2 rounded text-sm hover:bg-gray-100 cursor-grab"
                        draggable
                        onDragStart={(event) => onDragStart(event, { id: node.id, type: node.type, label: node.label, category: category.id })}
                      >
                        {node.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-3 space-y-2 border-t border-gray-200">
            <button
              className="w-full py-2 bg-blue-600 text-white rounded flex items-center justify-center gap-2 hover:bg-blue-700"
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
                          // Use React Flow's setNodes and setEdges methods directly
                          reactFlow.setNodes(flow.nodes);
                          reactFlow.setEdges(flow.edges);

                          // Also update the store if possible
                          const setNodes = storeState.setNodes;
                          const setEdges = storeState.setEdges;
                          if (typeof setNodes === 'function') {
                            setNodes(flow.nodes);
                          }
                          if (typeof setEdges === 'function') {
                            setEdges(flow.edges);
                          }
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
        <div ref={reactFlowWrapper} className="flex-grow h-[calc(100vh-180px)] overflow-hidden">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={memoizedNodeTypes}
            edgeTypes={memoizedEdgeTypes}
            defaultEdgeOptions={{ type: 'custom' }}
            onNodesChange={(changes: NodeChange[]) => {
              // Use the React Flow's applyNodeChanges helper to handle all node changes properly
              const updatedNodes = applyNodeChanges(changes, nodes);
              const setNodes = storeState.setNodes;
              if (typeof setNodes === 'function') {
                setNodes(updatedNodes);
              }

              // Handle specific change types that need additional processing
              changes.forEach(change => {
                if (change.type === 'remove') {
                  // If a node is removed, we might need to do additional cleanup
                  const removeNode = storeState.removeNode;
                  if (typeof removeNode === 'function') {
                    removeNode(change.id);
                  }
                }
              });
            }}
            onEdgesChange={(changes: EdgeChange[]) => {
              // Use the React Flow's applyEdgeChanges helper to handle all edge changes properly
              const updatedEdges = applyEdgeChanges(changes, edges);
              const setEdges = storeState.setEdges;
              if (typeof setEdges === 'function') {
                setEdges(updatedEdges);
              }

              // Handle specific change types that need additional processing
              changes.forEach(change => {
                if (change.type === 'remove') {
                  // If an edge is removed, we might need to do additional cleanup
                  const removeEdge = storeState.removeEdge;
                  if (typeof removeEdge === 'function') {
                    removeEdge(change.id);
                  }
                }
              });
            }}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
          >
            <Controls />
            <Background gap={16} size={1} />
            <Panel position="top-right">
              <div className="bg-white p-2 rounded shadow-md border border-gray-200">
                <div className="px-3 py-1 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  </span>
                </div>
              </div>
            </Panel>
          </ReactFlow>
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