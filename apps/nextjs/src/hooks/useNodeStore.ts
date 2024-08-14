import type { Connection, Edge, Node } from "@xyflow/react";
import { useShallow } from "zustand/react/shallow";

import type { AppState, Canvas } from "./store-types";
import useStore from "./useStore";

const selector = (state: AppState) => ({
  canvasTitle: state.canvasTitle,
  setCanvasTitle: state.setCanvasTitle,
  nodes: state.nodes,
  edges: state.edges,
  onConnect: state.onConnect,
  setNodes: state.setNodes,
  setEdges: state.setEdges,
  messages: state.messages,
  setMessages: state.setMessages,
  selectedOptions: state.selectedOptions,
  setSelectedOptions: state.setSelectedOptions,

  previousCanvases: state.previousCanvases,
  setPreviousCanvases: state.setPreviousCanvases,

  workSituation: state.workSituation,
  setWorkSituation: state.setWorkSituation,
  livingSituation: state.livingSituation,
  setLivingSituation: state.setLivingSituation,
  friendsFamilySituation: state.friendsAndFamilySituation,
  setFriendsFamilySituation: state.friendsAndFamilySituation,
  interests: state.interests,
  setInterests: state.setInterests,
});

export const useNodeStore = () => useStore(useShallow(selector));

// Add these type definitions if they're not already in store-types.ts
export interface NodeStoreState {
  canvasTitle: string;
  setCanvasTitle: (canvasTitle: string) => void;
  nodes: Node[];
  edges: Edge[];
  onConnect: (params: Connection) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  messages: { role: string; content: string }[];
  setMessages: (messages: { role: string; content: string }[]) => void;
  selectedOptions: string[];
  setSelectedOptions: (options: string[]) => void;

  previousCanvases: Canvas[];
  setPreviousCanvases: (previousCanvases: Canvas[]) => void;

  workSituation: string;
  setWorkSituation: (workSituation: string) => void;
  livingSituation: string;
  setLivingSituation: (livingSituation: string) => void;
  friendsFamilySituation: string;
  setFriendsFamilySituation: (friendsFamilySituation: string) => void;
  interests: string;
  setInterests: (interests: string) => void;
}
