import { create } from "zustand";
import { addEdge, applyNodeChanges, applyEdgeChanges } from "@xyflow/react";

import { initialNodes, initialEdges } from "../flow_data";
import { type AppState } from "./types";
import { EnchantedImage } from "../data/types";

const useStore = create<AppState>((set, get) => ({
  trigger: false,
  setTrigger: (trigger) => {
    set({ trigger: !trigger });
  },
  nodes: initialNodes,
  edges: initialEdges,
  images_enchanted_data: {},
  setImagesEnchantedData: (newData: EnchantedImage) => {
    set({ images_enchanted_data: newData });
  },
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  setNodes: (nodes) => {
    set({ nodes });
  },
  setEdges: (edges) => {
    set({ edges });
  },
  updateNodeData: (nodeId, nodeData) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...nodeData,
            },
          };
        }
        return node;
      }),
    });
  },
}));

export default useStore;
