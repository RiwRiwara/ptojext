"use client";
import React from "react";
import {
  ReactFlow,
  Controls,
  NodeTypes,
  ReactFlowProvider,
  Panel,
  Background,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  NoiseNode,
  ImageOriginalNode,
  ImageEnchantedNode,
  GrayScaleNode,
  SharpeningNode,
} from "@/components/image_enchanted/index";
import { Tooltip } from "@nextui-org/tooltip";
import useStore from "@/components/image_enchanted/states/store";
import BottomRight from "@/components/image_enchanted/ui/BottomRight";

import { getAllImages } from "@/components/image_enchanted/data/crud";
import { EnchantedImage } from "@/components/image_enchanted/data/types";
import Image from "next/image";
import { Link } from "@nextui-org/link";
import { FaInfoCircle } from "react-icons/fa";
import { IoCaretBack } from "react-icons/io5";
import BaseLayout from "@/components/layout/BaseLayout";

import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { tour_steps } from "@/components/image_enchanted/data/tour_steps";

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

  // Driver tour =====

  function OnStartTour() {
    const driverObj = driver({
      animate: false,
      showProgress: false,
      showButtons: ["next", "previous", "close"],
      steps: tour_steps,
    });

    driverObj.drive();
  }

  return (
    <BaseLayout>
      <ReactFlowProvider>
        {/* Header section */}
        <div
          className="p-2 bg-white rounded-md mb-4 flex justify-between items-center"
          id="tour-main"
        >
          <div className="flex flex-row gap-2 items-center test-tour">
            <Link href={"/"}>
              <IoCaretBack size={30} className="text-gray-800" />
            </Link>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <FaInfoCircle
              onClick={OnStartTour}
              size={25}
              className="hover:scale-110 duration-300 text-blue-900 cursor-pointer"
            />
            <h1 className="font-semibold text-2xl uppercase text-gray-700">
              Image Enchanted
            </h1>
          </div>
        </div>
        {/* React flow conponents */}
        <div className="shadow-md rounded-md  bg-white  max-h-[720px] md:max-h-[600px] h-[65vh] w-100 m-auto">
          <div style={{ height: "100%" }} id="tour-canvas">
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
              <Background />
              <Panel position="bottom-right">
                <BottomRight />
              </Panel>
            </ReactFlow>
          </div>
        </div>

        <div
          className="shadow-md rounded-md bg-white mt-4 flex flex-row gap-4 p-2 flex-wrap"
          id="tour-images"
        >
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
      </ReactFlowProvider>
    </BaseLayout>
  );
}

export default Flow;