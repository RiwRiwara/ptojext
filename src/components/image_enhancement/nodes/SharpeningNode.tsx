import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Slider } from "@nextui-org/slider";
import { Switch } from "@nextui-org/switch";
import useStore from "@/components/image_enhancement/states/store";

function SharpeningNode() {
  const { updateNodeData } = useStore();

  const [sharpeningAmount, setSharpeningAmount] = React.useState(1);
  const [radius, setRadius] = React.useState(1);
  const [threshold, setThreshold] = React.useState(0);
  const [isEnabled, setIsEnabled] = React.useState(false);

  const onSharpeningChange = () => {
    updateNodeData("3", {
      sharpening_amount: sharpeningAmount,
      radius: radius,
      threshold: threshold,
      isEnable: isEnabled,
    });
  };

  const handleAmountChange = (value: number | number[]) => {
    setSharpeningAmount(Array.isArray(value) ? value[0] : value);
    onSharpeningChange();
  };

  const handleRadiusChange = (value: number | number[]) => {
    setRadius(Array.isArray(value) ? value[0] : value);
    onSharpeningChange();
  };

  const handleThresholdChange = (value: number | number[]) => {
    setThreshold(Array.isArray(value) ? value[0] : value);
    onSharpeningChange();
  };

  const onEnableChange = (value: boolean) => {
    setIsEnabled(value);
    onSharpeningChange();
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
      <div className="text-sm text-center font-medium bg-sky-900 text-white p-1 rounded-t-md">
        Sharpening 
      </div>
      <div className="p-2 bg-sky-900 w-[200px] rounded-b-md">
        <div className="flex flex-col gap-2">
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
                <span>Enable</span>
              ) : (
                <span className="text-gray-300">Disable</span>
              )}
            </div>
          </div>
          <div hidden={!isEnabled} className="w-full">
            {/* Sharpening Amount Slider */}
            <Slider
              aria-label="Sharpening Amount"
              size="sm"
              color="secondary"
              isDisabled={!isEnabled}
              step={1}
              minValue={0}
              maxValue={10}
              value={sharpeningAmount}
              onChange={handleAmountChange}
            />
            {/* Radius Slider */}
            <Slider
              aria-label="Radius"
              size="sm"
              color="secondary"
              isDisabled={!isEnabled}
              step={1}
              minValue={1}
              maxValue={10}
              value={radius}
              onChange={handleRadiusChange}
            />
            {/* Threshold Slider */}
            <Slider
              aria-label="Threshold"
              size="sm"
              color="secondary"
              isDisabled={!isEnabled}
              step={1}
              minValue={0}
              maxValue={255}
              value={threshold}
              onChange={handleThresholdChange}
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

export default memo(SharpeningNode);
