import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Slider } from "@nextui-org/slider";
import { Button } from "@nextui-org/button";
import { Switch } from "@nextui-org/switch";
import { Select, SelectItem } from "@nextui-org/select";
import useStore from "@/components/image_enchanted/states/store";

const noiseTypes = [
  { key: "Gaussian", label: "Gaussian" },
  { key: "SaltAndPepper", label: "Salt and Pepper" },
  { key: "Speckle", label: "Speckle" },
];


function NoiseNode() {
  const { updateNodeData } = useStore();

  const [noiseLevel, setNoiseLevel] = React.useState(150);
  const [isEnabled, setIsEnabled] = React.useState(false);
  const [noiseType, setNoiseType] = React.useState("Gaussian");
  const [additionalOption, setAdditionalOption] = React.useState("Option1");

  const onNoiseLevelChange = (noiseLevelValue: number) => {
    setNoiseLevel(noiseLevelValue);
    updateNodeData("4", {
      noise_level: noiseLevelValue,
      isEnable: isEnabled,
      noise_type: noiseType,
      additional_option: additionalOption,
    });
  };

  const handleDecrement = () => {
    setNoiseLevel((prev) => {
      const newValue = Math.max(prev - 1, 0);
      onNoiseLevelChange(newValue);
      return newValue;
    });
  };

  const handleIncrement = () => {
    setNoiseLevel((prev) => {
      const newValue = Math.min(prev + 1, 255);
      onNoiseLevelChange(newValue);
      return newValue;
    });
  };

  const onEnableChange = (value: boolean) => {
    setIsEnabled(value);
    updateNodeData("4", {
      noise_level: noiseLevel,
      isEnable: value,
      noise_type: noiseType,
      additional_option: additionalOption,
    });
  };

  const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Math.min(255, parseInt(e.target.value, 10) || 0));
    setNoiseLevel(value);
    onNoiseLevelChange(value);
  };

  const handleNoiseTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNoiseType(e.target.value);
    updateNodeData("4", {
      noise_level: noiseLevel,
      isEnable: isEnabled,
      noise_type: e.target.value,
      additional_option: additionalOption,
    });
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
      <div className="text-sm text-center font-medium bg-blue-900 text-white p-1 rounded-t-md">
        Noise Level [{noiseLevel}]
      </div>
      <div className="p-2 bg-blue-900 w-[200px] rounded-b-md">
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
                {isEnabled ? <span>Enable</span> : <span className="text-gray-300">Disable</span>}
              </div>
            </div>
            <div hidden={!isEnabled} className="w-full">
              {/* Slider */}
              <Slider
                aria-label="Noise Level"
                size="sm"
                color="secondary"
                isDisabled={!isEnabled}
                step={1}
                minValue={0}
                maxValue={255}
                value={noiseLevel}
                onChange={(val) => onNoiseLevelChange(val as number)}
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
                  value={noiseLevel}
                  onChange={handleManualInputChange}
                  disabled={!isEnabled}
                  min={0}
                  max={255}
                  className="p-1 rounded-md bg-gray-600 text-white text-center w-16"
                />
                <span className="text-white">Noise Level</span>
              </div>

              {/* Noise Type Select */}
              <div className="mt-2">
                <Select
                  aria-label="Select Noise Type"
                  value={noiseType}
                  onChange={handleNoiseTypeChange}
                  disabled={!isEnabled}
                  defaultSelectedKeys={["Gaussian"]}
                >
                  {noiseTypes.map((type) => (
                    <SelectItem key={type.key} value={type.key}>
                      {type.label}
                    </SelectItem>
                  ))}
                </Select>
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

export default memo(NoiseNode);
