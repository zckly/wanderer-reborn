import type {
  Edge,
  Node,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
} from "@xyflow/react";

export type AppNode = Node;
export interface AppState {
  nodes: AppNode[];
  edges: Edge[];
  onNodesChange: OnNodesChange<AppNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: AppNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  background: string;
  setBackground: (background: string) => void;
  messages: { role: string; content: string }[];
  setMessages: (messages: { role: string; content: string }[]) => void;
  selectedOptions: string[];
  setSelectedOptions: (selectedOptions: string[]) => void;
  centerPosition: { x: number; y: number };
  setCenterPosition: (centerPosition: { x: number; y: number }) => void;
}
