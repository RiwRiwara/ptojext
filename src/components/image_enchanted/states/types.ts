import {
  type Edge,
  type Node,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
} from "@xyflow/react";
import { EnchantedImage } from "../data/types";

export type AppNode = Node;

export type AppState = {
  trigger: boolean;
  setTrigger: (trigger: boolean) => void;
  nodes: AppNode[];
  edges: Edge[];
  images_enchanted_data: EnchantedImage;
  setImagesEnchantedData: (data: EnchantedImage) => void;
  onNodesChange: OnNodesChange<AppNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: AppNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateNodeData: (nodeId: string, nodeData: any) => void;
};
