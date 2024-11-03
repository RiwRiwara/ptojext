import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";

function ImageEnchantedNode() {
  return (
    <>
      <Handle
        style={{
          backgroundColor: "transparent",
        }}
        type="target"
        position={Position.Left}
      />
      <div className="p-1 bg-gray-50  rounded-lg shadow-inner">
        <div className="flex flex-col gap-2">
          <Image
            alt="enchanted-node"
            src="/people.jpg"
            className="w-[150px] h-auto rounded-md border-dotted border-2 border-green-300"
          />
        </div>
      </div>
    </>
  );
}

export default memo(ImageEnchantedNode);
