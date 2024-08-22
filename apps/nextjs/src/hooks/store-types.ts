import type {
  Edge,
  Node,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
} from "@xyflow/react";

export type AppNode = Node;
export interface Canvas {
  title: string;
  nodes: AppNode[];
  edges: Edge[];
  messages: { role: string; content: string }[];
  selectedOptions: string[];
}

export interface AppState {
  canvasTitle: string;
  setCanvasTitle: (canvasTitle: string) => void;

  nodes: AppNode[];
  edges: Edge[];
  onNodesChange: OnNodesChange<AppNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (
    nodesOrUpdater: AppNode[] | ((nodes: AppNode[]) => AppNode[]),
  ) => void;
  setEdges: (edgesOrUpdater: Edge[] | ((edges: Edge[]) => Edge[])) => void;
  messages: { role: string; content: string }[];
  setMessages: (messages: { role: string; content: string }[]) => void;
  selectedOptions: string[];
  setSelectedOptions: (selectedOptions: string[]) => void;

  previousCanvases: Canvas[];
  setPreviousCanvases: (previousCanvases: Canvas[]) => void;

  workSituation: string;
  setWorkSituation: (workSituation: string) => void;
  livingSituation: string;
  setLivingSituation: (livingSituation: string) => void;
  friendsAndFamilySituation: string;
  setFriendsAndFamilySituation: (friendsAndFamilySituation: string) => void;
  interests: string;
  setInterests: (interests: string) => void;
}

export interface OnboardingState {
  onboardingStep: number;
  setOnboardingStep: (onboardingStep: number) => void;
  onboardingCompleted: boolean;
  setOnboardingCompleted: (onboardingCompleted: boolean) => void;
  currentRole: string;
  setCurrentRole: (currentRole: string) => void;
  eduHistory: string;
  setEduHistory: (eduHistory: string) => void;
  workHistory: string;
  setWorkHistory: (workHistory: string) => void;
}
