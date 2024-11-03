import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";

function ImageOriginalNode() {
  return (
    <>
      <div className="p-2 bg-gray-50  rounded-lg shadow-inner">
        <div className="flex flex-col gap-2">
          <Image
            alt="original-node"
            src="/people.jpg"
            className="w-[150px] h-auto rounded-md border-dotted border-2 border-purple-300"
          />
          <Button size="sm" variant="flat" className="bg-gray-400 text-white">
            Select image
          </Button>
        </div>
      </div>
      <Handle
        isConnectable={false}
        style={{
          backgroundColor: "transparent",
        }}
        type="source"
        position={Position.Right}
      />
    </>
  );
}

export default memo(ImageOriginalNode);
