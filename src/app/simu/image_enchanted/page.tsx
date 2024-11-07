"use client";
import {
  ReactFlow,
  Controls,
  NodeTypes,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  NoiseNode,
  ImageOriginalNode,
  ImageEnchantedNode,
  GrayScaleNode,
} from "@/components/image_enchanted/index";

import useStore from "@/components/image_enchanted/states/store";

const nodeTypes = {
  image_enchanted_node: ImageEnchantedNode,
  gray_scale_node: GrayScaleNode,
  image_original_node: ImageOriginalNode,
  noise_node: NoiseNode,
} as NodeTypes;

function Flow() {
  const { edges, nodes, onNodesChange, onEdgesChange } = useStore();

  return (
    <ReactFlowProvider>
      <div className="p-6 bg-gray-300 h-screen">
        <div className="shadow-md rounded-md border-2 bg-white border-gray-500 max-h-[720px] md:max-h-[600px] h-[76vh] w-100 m-auto">
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

        <div className="shadow-md rounded-md border-2 bg-white border-gray-500 mt-4 flex flex-row gap-4 p-2 flex-wrap">
          <div className="w-32 h-36 bg-blue-100 shadow-inner rounded-md"></div>
          <div className="w-32 h-36 bg-blue-100 shadow-inner rounded-md"></div>
          <div className="w-32 h-36 bg-blue-100 shadow-inner rounded-md"></div>
          <div className="w-32 h-36 bg-blue-100 shadow-inner rounded-md"></div>
          <div className="w-32 h-36 bg-blue-100 shadow-inner rounded-md"></div>
          <div className="w-32 h-36 bg-blue-100 shadow-inner rounded-md"></div>
        </div>
      </div>
    </ReactFlowProvider>
  );
}

export default Flow;
