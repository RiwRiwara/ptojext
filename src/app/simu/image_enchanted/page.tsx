"use client";
import { useState, useCallback } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  Controls,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  NodeTypes,
  EdgeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import ImageEnchantedNode from "@/components/image_enchanted/ImageEnchantedNode";
import GrayScaleNode from "@/components/image_enchanted/GrayScaleNode";
import ImageOriginalNode from "@/components/image_enchanted/ImageOriginalNode";
import NoiseNode from "@/components/image_enchanted/NoiseNode";

const nodeTypes = {
  image_enchanted_node: ImageEnchantedNode,
  gray_scale_node: GrayScaleNode,
  image_original_node: ImageOriginalNode,
  noise_node: NoiseNode,
} as NodeTypes;

const initialNodes: Node[] = [
  {
    id: "1",
    // draggable: false,
    deletable: false,
    data: { label: "Hello" },
    type: "image_original_node",
    position: { x: 0, y: 0 },
  } as Node,
  {
    id: "2",
    deletable: false,
    position: { x: 250, y: -50 },
    type: "gray_scale_node",
  } as Node,
  {
    id: "4",
    deletable: false,
    position: { x: 250, y: 50 },
    type: "noise_node",
  } as Node,
  {
    id: "3",
    // draggable: false,
    deletable: false,
    position: { x: 600, y: 0 },
    type: "image_enchanted_node",
  } as Node,
];

const initialEdges: Edge[] = [
  {
    id: "1-2",
    source: "1",
    target: "2",
    /*label: "to the",*/
    deletable: false,
  } as Edge,
  {
    id: "2-3",
    source: "2",
    target: "3",
    deletable: false,
  } as Edge,
  {
    id: "1-4",
    source: "1",
    target: "4",
    deletable: false,
  } as Edge,
  {
    id: "4-3",
    source: "4",
    target: "3",
    deletable: false,
  } as Edge,
];

function Flow() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  return (
    <div className="p-4 bg-gray-300">
      <div className="shadow-md rounded-md border-2 bg-white border-gray-500 max-h-[720px] md:max-h-[800px] h-[96vh] w-100 m-auto">
        <div style={{ height: "100%" }}>
          <ReactFlow
            nodes={nodes}
            onNodesChange={onNodesChange}
            edges={edges}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            // panOnDrag={false}
            // panOnScroll={false}
            // zoomOnScroll={false}
          >
            {/* <Background /> */}
            <Controls showInteractive={false} showZoom={false} />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

export default Flow;
