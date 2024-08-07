import type { Edge, Node } from "@xyflow/react";
import { addEdge, applyEdgeChanges, applyNodeChanges } from "@xyflow/react";
import { create } from "zustand";

import type { AppState } from "./store-types";
import { sarahBackground } from "~/lib/data/sarahBackground";

const initialNodes: Node[] = [
  // {
  //   id: "1",
  //   type: "root",
  //   data: { label: "Start" },
  //   position: { x: 0, y: 0 },
  // },
  {
    id: "2",
    type: "addDecision",
    data: { label: "Add decision" },
    position: { x: 200, y: 0 },
  },
];

const initialEdges: Edge[] = [
  // {
  //   id: "e1-2",
  //   source: "1",
  //   target: "2",
  //   animated: true,
  // },
];

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create<AppState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
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
  background: sarahBackground,
  setBackground: (background) => set({ background }),
  messages: [],
  setMessages: (messages) => set({ messages }),
  selectedOptions: [],
  setSelectedOptions: (selectedOptions) => set({ selectedOptions }),
  centerPosition: { x: 0, y: 0 },
  setCenterPosition: (centerPosition) => set({ centerPosition }),
}));

export default useStore;
