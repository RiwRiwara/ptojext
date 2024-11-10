"use client";
import React from "react";
import {
  ReactFlow,
  Controls,
  NodeTypes,
  ReactFlowProvider,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  NoiseNode,
  ImageOriginalNode,
  ImageEnchantedNode,
  GrayScaleNode,
  SharpeningNode,
} from "@/components/image_enchanted/index";

import useStore from "@/components/image_enchanted/states/store";
import BottomRight from "@/components/image_enchanted/ui/BottomRight";

import { getAllImages } from "@/components/image_enchanted/data/crud";
import { EnchantedImage } from "@/components/image_enchanted/data/types";
import Image from "next/image";
import { Link } from "@nextui-org/link";

const nodeTypes = {
  image_enchanted_node: ImageEnchantedNode,
  gray_scale_node: GrayScaleNode,
  image_original_node: ImageOriginalNode,
  noise_node: NoiseNode,
  sharpening_node: SharpeningNode,
} as NodeTypes;

function Flow() {
  const { edges, nodes, onNodesChange, onEdgesChange, trigger } = useStore();

  const [images, setImages] = React.useState<EnchantedImage[]>([]);

  React.useEffect(() => {
    async function GetAllImagesShow() {
      try {
        const response = await getAllImages();
        setImages(response.images as EnchantedImage[]);
      } catch (error) {
        console.error("Failed to fetch images:", error);
      }
    }

    GetAllImagesShow();
  }, [trigger]);

  return (
    <ReactFlowProvider>
      <div className="p-6 bg-gray-300">
        <div className="p-4 bg-white rounded-md border-2 border-gray-500 mb-4">
          <Link color="secondary" href={"/"}>
            Back
          </Link>
        </div>
        <div className="shadow-md rounded-md border-2 bg-white border-gray-500 max-h-[720px] md:max-h-[600px] h-[65vh] w-100 m-auto">
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
              <Panel position="bottom-right">
                <BottomRight />
              </Panel>
            </ReactFlow>
          </div>
        </div>

        <div className="shadow-md rounded-md border-2 bg-white border-gray-500 mt-4 flex flex-row gap-4 p-2 flex-wrap">
          {images.length > 0 ? (
            images.map((image) => (
              <div key={image.id} className="p-2 border rounded mb-2">
                <Image
                  src={image.data ?? ""}
                  alt={image.name ?? "" + image.id}
                  width={150}
                  height={100}
                />
              </div>
            ))
          ) : (
            <p>You can save image</p>
          )}
        </div>
      </div>
    </ReactFlowProvider>
  );
}

export default Flow;
