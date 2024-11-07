import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Image } from "@nextui-org/image";

function ImageOriginalNode() {
  return (
    <>

      <div className="p-2 bg-gray-50  rounded-lg shadow-inner">
        <div className="flex flex-col gap-2">
          <Image
            alt="original-node"
            src="/people.jpg"
            className="rounded-md w-[400px] border-dotted border-2 border-purple-300"
          />
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
