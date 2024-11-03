import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Slider } from "@nextui-org/slider";
import { Button } from "@nextui-org/button";

function NoiseNode() {
  const [value, setValue] = React.useState(25);

  return (
    <>
      <Handle
        style={{
          backgroundColor: "transparent",
        }}
        type="target"
        position={Position.Left}
      />
      <div className="text-sm text-center font-medium">Noise [{value}%]</div>
      <div className="p-2 bg-gray-100 rounded-full shadow-md w-[200px]">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2 w-full h-full max-w-md items-start justify-center">
            <Slider
              aria-label="GrayScale"
              size="sm"
              color="primary"
              step={1}
              minValue={0}
              maxValue={100}
              value={value}
              onChange={(val) => setValue(val as number)}
              startContent={
                <Button
                  size="sm"
                  isIconOnly
                  radius="full"
                  variant="light"
                  onPress={() => setValue((prev) => (prev > 0 ? prev - 1 : 0))}
                >
                  <div className="w-[8px] h-[8px] rounded-full border-1 border-gray-600 bg-white"></div>
                </Button>
              }
              endContent={
                <Button
                  isIconOnly
                  radius="full"
                  variant="light"
                  size="sm"
                  onPress={() =>
                    setValue((prev) => (prev < 100 ? prev + 1 : 255))
                  }
                >
                  <div className="w-[8px] h-[8px] rounded-full border-1 border-gray-600 bg-black"></div>
                </Button>
              }
            />
          </div>
        </div>
      </div>
      <Handle
        style={{
          backgroundColor: "transparent",
        }}
        type="source"
        position={Position.Right}
      />
    </>
  );
}

export default memo(NoiseNode);
