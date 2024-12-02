import React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";

interface PopoverButtonProps {
  buttonText: React.ReactNode;
  content: React.ReactNode;
}

const PopoverButton: React.FC<PopoverButtonProps> = ({
  buttonText,
  content,
}) => {
  return (
    <Popover
      showArrow
      backdrop="opaque"
      placement="right"
      classNames={{
        base: ["before:bg-default-200"],
        content: [
          "py-0.5 px-1 border border-default-200",
          "bg-gradient-to-br from-white to-default-300",
        ],
      }}
    >
      <PopoverTrigger>
        <button>{buttonText}</button>
      </PopoverTrigger>
      <PopoverContent>
        {(titleProps) => (
          <div className="px-1 py-2">
            <h3 className="text-small font-bold" {...titleProps}>
              {content}
            </h3>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default PopoverButton;
