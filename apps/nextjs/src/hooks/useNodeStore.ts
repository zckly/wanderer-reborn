import type { Edge, Node } from "@xyflow/react";
import { useShallow } from "zustand/react/shallow";

import type { AppState } from "./store-types";
import useStore from "./useStore";

const selector = (state: AppState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onConnect: state.onConnect,
  setNodes: state.setNodes,
  setEdges: state.setEdges,
  background: state.background,
  messages: state.messages,
  setMessages: state.setMessages,
  selectedOptions: state.selectedOptions,
  setSelectedOptions: state.setSelectedOptions,
});

export const useNodeStore = () => useStore(useShallow(selector));

// Add these type definitions if they're not already in store-types.ts
export interface NodeStoreState {
  nodes: Node[];
  edges: Edge[];
  onConnect: (params: any) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  background: string;
  messages: any[]; // Replace 'any' with the actual message type
  setMessages: (messages: any[]) => void;
  selectedOptions: string[];
  setSelectedOptions: (options: string[]) => void;
}
