"use client";

import { memo, useCallback, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { useShallow } from "zustand/react/shallow";

import type { AppState } from "~/hooks/store-types";
import useStore from "~/hooks/useStore";
import { api } from "~/trpc/react";
import MotionPopover from "./primitives/MotionPopover";

const selector = (state: AppState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onConnect: state.onConnect,
  setNodes: state.setNodes,
  setEdges: state.setEdges,
  background: state.background,
  setMessages: state.setMessages,
});

function AddDecisionNode() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { mutateAsync: generateDecisionNodes } =
    api.ai.generateDecisionNodes.useMutation();
  const { nodes, edges, setEdges, setNodes, background, setMessages } =
    useStore(useShallow(selector));
  const generateNodes = useCallback(
    async (decision: string) => {
      setIsGenerating(true);
      const { context, options, microDecisions, initialMessages } =
        await generateDecisionNodes({
          userBackground: background,
          decision,
        });

      setMessages(initialMessages);
      setIsGenerating(false);

      const contextNode = {
        id: `decision-node`,
        type: "context",
        data: {
          label: context,
        },
        position: { x: 300, y: -85 },
      };

      const microDecisionNode = {
        id: `micro-decision-node`,
        type: "microDecision",
        data: {
          label: microDecisions,
        },
        position: { x: 1000, y: -15 },
      };

      // Create an event node for each option
      const optionNodes = options.map((option, index) => ({
        id: `option-node-${index}`,
        type: "event",
        data: {
          label: option.title,
          description: option.description,
          imageUrl: option.imageUrl,
        },
        position: { x: 1700, y: -300 + index * 200 },
      }));

      const updatedNodes = nodes.slice(0, -1); // Remove the last node once
      const newNodes = [contextNode, microDecisionNode, ...optionNodes];

      setNodes([...updatedNodes, ...newNodes]);

      const newEdges = [
        {
          id: "e1-context",
          source: "1",
          target: "decision-node",
          animated: true,
        },
        {
          id: "edecision-micro",
          source: "decision-node",
          target: "micro-decision-node",
          animated: true,
        },
        ...optionNodes.map((node, index) => ({
          id: `e2-${index + 3}`,
          source: "micro-decision-node",
          target: `option-node-${index}`,
          animated: true,
        })),
      ];
      setEdges([...edges, ...newEdges]);
    },
    [
      background,
      nodes,
      edges,
      setNodes,
      setEdges,
      setMessages,
      generateDecisionNodes,
    ],
  );
  return (
    <div>
      <MotionPopover
        onAddDecisionClick={(decision) => {
          void generateNodes(decision);
        }}
        isGenerating={isGenerating}
      />
      <Handle type="source" position={Position.Right} className="opacity-0" />
      <Handle type="target" position={Position.Left} className="opacity-0" />
    </div>
  );
}

export default memo(AddDecisionNode);
