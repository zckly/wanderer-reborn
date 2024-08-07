"use client";

import { MiniMap, ReactFlow } from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { useShallow } from "zustand/react/shallow";

import type { AppState } from "~/hooks/store-types";
import useStore from "~/hooks/useStore";
import { OnboardingDialog } from "../onboarding/OnboardingDialog";
import Logo from "./canvas/Logo";
import { SettingsSheet } from "./SettingsSheet";
import AddDecisionNode from "./xyflow/custom-nodes/AddDecisionNode";
import ContextNode from "./xyflow/custom-nodes/ContextNode";
import CustomOptionNode from "./xyflow/custom-nodes/CustomOptionNode";
import MicroDecisionNode from "./xyflow/custom-nodes/MicroDecisionNode.tsx";
import OptionNode from "./xyflow/custom-nodes/OptionNode";
import OutcomeNode from "./xyflow/custom-nodes/OutcomeNode";
import RootNode from "./xyflow/custom-nodes/RootNode";
import DevTools from "./xyflow/debugging/DevTools";

const nodeTypes = {
  root: RootNode,
  context: ContextNode,
  option: OptionNode,
  customOption: CustomOptionNode,
  addDecision: AddDecisionNode,
  microDecision: MicroDecisionNode,
  outcome: OutcomeNode,
};

const selector = (state: AppState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  setNodes: state.setNodes,
  setEdges: state.setEdges,
  background: state.background,
  setBackground: state.setBackground,
});
const MapView = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useStore(
    useShallow(selector),
  );

  return (
    <div
      style={{ width: "100%", height: "100vh" }}
      className="relative font-mono"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <MiniMap position={"bottom-left"} />
        <DevTools />
      </ReactFlow>
      <div className="absolute left-4 top-4">
        <Logo />
      </div>
      <div className="absolute right-4 top-4">
        <SettingsSheet />
      </div>

      <OnboardingDialog open />
    </div>
  );
};

export default MapView;
