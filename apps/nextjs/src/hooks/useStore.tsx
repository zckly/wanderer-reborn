import type { Edge, Node } from "@xyflow/react";
import { addEdge, applyEdgeChanges, applyNodeChanges } from "@xyflow/react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { AppState } from "./store-types";

export const initialNodes: Node[] = [
  {
    id: "2",
    type: "addDecision",
    data: { label: "Add decision" },
    position: { x: 200, y: 0 },
  },
];

const initialEdges: Edge[] = [];

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      canvasTitle: "",
      setCanvasTitle: (canvasTitle) => set({ canvasTitle }),
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
      setNodes: (nodesOrUpdater) => {
        set((state) => {
          const newNodes =
            typeof nodesOrUpdater === "function"
              ? nodesOrUpdater(state.nodes)
              : nodesOrUpdater;
          if (newNodes !== state.nodes) {
            return { nodes: newNodes };
          }
          return state;
        });
      },
      setEdges: (edgesOrUpdater) => {
        set((state) => {
          const newEdges =
            typeof edgesOrUpdater === "function"
              ? edgesOrUpdater(state.edges)
              : edgesOrUpdater;
          if (newEdges !== state.edges) {
            return { edges: newEdges };
          }
          return state;
        });
      },
      messages: [],
      setMessages: (messages) => set({ messages }),
      selectedOptions: [],
      setSelectedOptions: (selectedOptions) => set({ selectedOptions }),

      previousCanvases: [],
      setPreviousCanvases: (previousCanvases) => set({ previousCanvases }),

      // background
      workSituation: "",
      setWorkSituation: (workSituation) => set({ workSituation }),
      livingSituation: "",
      setLivingSituation: (livingSituation) => set({ livingSituation }),
      friendsAndFamilySituation: "",
      setFriendsAndFamilySituation: (friendsAndFamilySituation) =>
        set({ friendsAndFamilySituation }),
      interests: "",
      setInterests: (interests) => set({ interests }),
    }),
    {
      name: "app-state-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // using localStorage for persistence
    },
  ),
);

export default useStore;
