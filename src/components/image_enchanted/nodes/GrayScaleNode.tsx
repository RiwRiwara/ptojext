import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Slider } from "@nextui-org/slider";
import { Button } from "@nextui-org/button";
import { Switch } from "@nextui-org/switch";
import useStore from "@/components/image_enchanted/states/store";

function GrayScaleNode() {
  const { updateNodeData } = useStore();

  const [GrayScale, setGrayScale] = React.useState(150);
  const [isEnabled, setIsEnabled] = React.useState(false);

  const onGrayScaleChange = (grayScaleValue: number) => {
    setGrayScale(grayScaleValue);
    updateNodeData("2", {
      gray_scale: grayScaleValue,
      isEnable: isEnabled,
    });
  };

  const handleDecrement = () => {
    setGrayScale((prev) => {
      const newValue = Math.max(prev - 1, 0);
      onGrayScaleChange(newValue);
      return newValue;
    });
  };

  const handleIncrement = () => {
    setGrayScale((prev) => {
      const newValue = Math.min(prev + 1, 255);
      onGrayScaleChange(newValue);
      return newValue;
    });
  };

  const onEnableChange = (value: boolean) => {
    setIsEnabled(value);
    updateNodeData("2", {
      gray_scale: GrayScale,
      isEnable: value,
    });
  };

  const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Math.min(255, parseInt(e.target.value, 10) || 0)); // Ensure the value is within the 0-255 range
    setGrayScale(value);
    onGrayScaleChange(value);
  };

  return (
    <>
      <Handle
        style={{
          backgroundColor: "transparent",
        }}
        type="target"
        position={Position.Left}
      />
      <div className="text-sm text-center font-medium bg-gray-700 text-white p-1 rounded-t-md">
        Gray Scale [{GrayScale}]
      </div>
      <div className="p-2 bg-gray-700  w-[200px] rounded-b-md">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2 w-full h-full max-w-md items-start justify-center">
            <div className="flex justify-between w-full">
              <Switch
                className="font-bold"
                isSelected={isEnabled}
                color="secondary"
                onValueChange={onEnableChange}
                size="sm"
              />
              <div className="font-bold text-white">
                {isEnabled ? (
                  <span className="text-white">Enable</span>
                ) : (
                  <span className="text-gray-300">Disable</span>
                )}
              </div>
            </div>
            <div hidden={!isEnabled} className="w-full">
              {/* Slider */}
              <Slider
                aria-label="GrayScale"
                size="sm"
                color="secondary"
                isDisabled={!isEnabled}
                step={1}
                minValue={0}
                maxValue={255}
                value={GrayScale}
                onChange={(val) => onGrayScaleChange(val as number)}
                startContent={
                  <Button
                    size="sm"
                    isIconOnly
                    radius="full"
                    variant="light"
                    onPress={handleDecrement}
                  >
                    <div className="w-[15px] h-[15px] rounded-full border-1 border-gray-600 bg-black"></div>
                  </Button>
                }
                endContent={
                  <Button
                    isIconOnly
                    radius="full"
                    variant="light"
                    size="sm"
                    onPress={handleIncrement}
                  >
                    <div className="w-[15px] h-[15px] rounded-full border-1 border-gray-600 bg-white"></div>
                  </Button>
                }
              />
              {/* Manual Input Field */}
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="number"
                  value={GrayScale}
                  onChange={handleManualInputChange}
                  disabled={!isEnabled}
                  min={0}
                  max={255}
                  className="p-1 rounded-md bg-gray-600 text-white text-center w-16"
                />
                <span className="text-white">GrayScale</span>
              </div>
            </div>
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

export default memo(GrayScaleNode);
