import React, { useEffect, useState } from "react";

interface ConnectingLineProps {
  fromId: string;
  toId: string;
  strokeWidth?: number;
  side?: string;
  align?: string;
  strokeColor?: string;
  dashArray?: string; // Add dash array
}

const ConnectingLine: React.FC<ConnectingLineProps> = ({
  fromId,
  toId,
  side = "left",
  align = "bot",
  strokeWidth = 2,
  strokeColor = "black",
  dashArray = "4 2", // Default dash pattern
}) => {
  const [lineCoordinates, setLineCoordinates] = useState({
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  });

  useEffect(() => {
    const fromElement = document.getElementById(fromId);
    const toElement = document.getElementById(toId);

    if (fromElement && toElement) {
      const fromRect = fromElement.getBoundingClientRect();
      const toRect = toElement.getBoundingClientRect();

      // Calculate center points
      let change_side_X = -70;
      const change_side_Y = -20;
      const change_side_dest_X = -20;
      const change_side_dest_Y = -20;
      if (side == "left") {
      } else {
        change_side_X = 40;
      }
      if (align == "bot") {
      } else {
        // change_side_X = 10;
      }

      const fromCenterX = fromRect.left + fromRect.width / 2 + change_side_X;
      const fromCenterY = fromRect.top + fromRect.height / 2 + change_side_Y;
      const toCenterX = toRect.left + toRect.width / 2 + change_side_dest_X;
      const toCenterY = toRect.top + toRect.height / 2 + change_side_dest_Y;

      setLineCoordinates({
        x1: fromCenterX,
        y1: fromCenterY,
        x2: toCenterX,
        y2: toCenterY,
      });
    }
  }, [fromId, toId]);

  return (
    <svg className="absolute w-full h-full" style={{ pointerEvents: "none" }}>
      <line
        x1={lineCoordinates.x1}
        y1={lineCoordinates.y1}
        x2={lineCoordinates.x2}
        y2={lineCoordinates.y2}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={dashArray}
      />
    </svg>
  );
};

export default ConnectingLine;
