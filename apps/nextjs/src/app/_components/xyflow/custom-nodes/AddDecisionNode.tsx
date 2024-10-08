"use client";

import { memo, useCallback, useState } from "react";
import { Handle, Position } from "@xyflow/react";

import { useNodeStore } from "~/hooks/useNodeStore";
import { api } from "~/trpc/react";
import { createNewNodesAndEdges } from "~/utils/nodeUtils";
import MotionPopover from "../../../../components/MotionPopover";

function AddDecisionNode() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { mutateAsync: generateDecisionNodes } =
    api.ai.generateDecisionNodes.useMutation();
  const { mutateAsync: generateCanvasTitle } =
    api.ai.generateCanvasTitle.useMutation();
  const {
    nodes,
    edges,
    setEdges,
    setNodes,
    setMessages,
    workSituation,
    livingSituation,
    friendsFamilySituation,
    interests,
    setCanvasTitle,
  } = useNodeStore();

  const generateNodes = useCallback(
    async (decision: string) => {
      setIsGenerating(true);

      const { context, options, microDecisions, initialMessages } =
        await generateDecisionNodes({
          workSituation,
          livingSituation,
          friendsFamilySituation,
          interests,
          decision,
        });

      const { text } = await generateCanvasTitle({
        context,
        decision,
      });
      setCanvasTitle(text);

      setMessages(initialMessages);
      setIsGenerating(false);

      const rightMostPositionX = Math.max(
        ...nodes.map((node) => node.position.x),
      );

      const { newNodes, newEdges } = createNewNodesAndEdges({
        nodes,
        rightMostPositionX,
        context,
        microDecisions,
        options,
        selectedOptionNode: undefined, // No selected option node for initial generation
        isInitialDecision: true, // This is the initial decision
      });

      // Remove the last node (which is the AddDecisionNode itself)
      const updatedNodes = nodes.slice(0, -1);
      setNodes([...updatedNodes, ...newNodes]);
      setEdges([...edges, ...newEdges]);
    },
    [
      nodes,
      edges,
      setNodes,
      setEdges,
      setMessages,
      generateDecisionNodes,
      workSituation,
      livingSituation,
      friendsFamilySituation,
      interests,
      setCanvasTitle,
      generateCanvasTitle,
    ],
  );

  return (
    <div>
      <MotionPopover
        onSubmit={(decision) => {
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
