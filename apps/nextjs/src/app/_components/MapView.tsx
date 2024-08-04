"use client";

import { MiniMap, ReactFlow } from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { useShallow } from "zustand/react/shallow";

import type { AppState } from "~/hooks/store-types";
import useStore from "~/hooks/useStore";
import AddDecisionNode from "./AddDecisionNode";
import Logo from "./canvas/Logo";
import ContextNode from "./ContextNode";
import EventNode from "./EventNode";
import MicroDecisionNode from "./MicroDecisionNode.tsx";
import OutcomeNode from "./OutcomeNode";
import RootNode from "./RootNode";

const nodeTypes = {
  root: RootNode,
  context: ContextNode,
  event: EventNode,
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
      </ReactFlow>
      <div className="absolute left-4 top-4">
        <Logo />
      </div>
    </div>
  );
};

export default MapView;
