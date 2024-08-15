"use client";

import { MiniMap, ReactFlow } from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import type { AppState, OnboardingState } from "~/hooks/store-types";
import useOnboardingStore from "~/hooks/useOnboardingStore";
import useStore from "~/hooks/useStore";
import { OnboardingDialog } from "../onboarding/OnboardingDialog";
import { CanvasInfo } from "./canvas/CanvasInfo";
import { SettingsSheet } from "./settings/SettingsSheet";
import AddDecisionNode from "./xyflow/custom-nodes/AddDecisionNode";
import ContextNode from "./xyflow/custom-nodes/ContextNode";
import CustomOptionNode from "./xyflow/custom-nodes/CustomOptionNode";
import MicroDecisionNode from "./xyflow/custom-nodes/MicroDecisionNode.tsx";
import OptionNode from "./xyflow/custom-nodes/OptionNode";
import OutcomeNode from "./xyflow/custom-nodes/OutcomeNode";
import RootNode from "./xyflow/custom-nodes/RootNode";

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
  workSituation: state.workSituation,
  livingSituation: state.livingSituation,
  friendsAndFamily: state.friendsAndFamilySituation,
  interests: state.interests,
});

const onboardingSelector = (state: OnboardingState) => ({
  onboardingCompleted: state.onboardingCompleted,
});

const MapView = () => {
  // TODO: persist onboarding state
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    workSituation,
    livingSituation,
    friendsAndFamily,
    interests,
  } = useStore(useShallow(selector));

  const { onboardingCompleted } = useOnboardingStore(
    useShallow(onboardingSelector),
  );

  useEffect(() => {
    if (!onboardingCompleted) {
      setOnboardingOpen(true);
    }
  }, [onboardingCompleted]);

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
        // proOptions={{ hideAttribution: true }}
      >
        <MiniMap position={"bottom-left"} />
        <div className="nodrag absolute left-4 top-4 z-50">
          <CanvasInfo />
        </div>
      </ReactFlow>

      <div className="absolute right-4 top-4">
        {workSituation && livingSituation && friendsAndFamily && interests && (
          <SettingsSheet
            workSituation={workSituation}
            livingSituation={livingSituation}
            friendsAndFamily={friendsAndFamily}
            interests={interests}
          />
        )}
      </div>

      <OnboardingDialog
        open={onboardingOpen && !onboardingCompleted}
        setOpen={setOnboardingOpen}
      />
    </div>
  );
};

export default MapView;
