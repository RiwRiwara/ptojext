import { Node, Edge } from "@xyflow/react";
import { grayScaleDataType, noiseDataType } from "./types";

// ========== Connect data ========
export const initialNodes: Node[] = [
  {
    id: "1",
    deletable: false,
    data: { label: "Hello" },
    type: "image_original_node",
    position: { x: -200, y: -50 },
  } as Node,
  {
    id: "2",
    deletable: false,
    position: { x: 250, y: -100 },
    data: { gray_scale: 150, isEnable: false } as grayScaleDataType,
    type: "gray_scale_node",
  } as Node,
  {
    id: "4",
    deletable: false,
    position: { x: 250, y: 50 },
    data: {
      noise_level: 150,
      isEnable: false,
      noise_type: "Gaussian",
    } as noiseDataType,
    type: "noise_node",
  } as Node,
  {
    id: "3",
    // draggable: false,
    deletable: false,
    position: { x: 600, y: 0 },
    type: "image_enchanted_node",
  } as Node,
  // {
  //   id: "5",
  //   deletable: false,
  //   position: { x: 250, y: 200 },
  //   data: {
  //     sharpening_amount: 1,
  //     isEnable: true,
  //   } as sharpeningDataType,
  //   type: "sharpening_node",
  // } as Node,
];
export const initialEdges: Edge[] = [
  {
    id: "1-2",
    source: "1",
    target: "2",
    /*label: "to the",*/
    deletable: false,
  } as Edge,
  {
    id: "2-3",
    source: "2",
    target: "3",
    deletable: false,
  } as Edge,
  {
    id: "1-4",
    source: "1",
    target: "4",
    deletable: false,
  } as Edge,
  {
    id: "1-5",
    source: "1",
    target: "5",
    deletable: false,
  } as Edge,
  {
    id: "4-3",
    source: "4",
    target: "3",
    deletable: false,
  } as Edge,
  {
    id: "5-3",
    source: "5",
    target: "3",
    deletable: false,
  } as Edge,
];
