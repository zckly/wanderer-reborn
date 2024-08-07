import type { Node } from "@xyflow/react";
import { memo, useCallback, useState } from "react";
import { Handle, Position } from "@xyflow/react";

import { MotionNodeWrapper } from "~/components/MotionNodeWrapper";
import { useNodeStore } from "~/hooks/useNodeStore";
import { api } from "~/trpc/react";
import { createNewNodesAndEdges } from "~/utils/nodeUtils";
import MotionPopover from "../../../../components/MotionPopover";

interface CustomOptionNodeProps {
  data: {
    rotation?: number;
  };
}

function CustomOptionNode({ data }: CustomOptionNodeProps) {
  const {
    nodes,
    edges,
    setEdges,
    setNodes,
    messages,
    setMessages,
    setSelectedOptions,
    selectedOptions,
  } = useNodeStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const { mutateAsync: generateOutcomeAndNewDecision } =
    api.ai.generateOutcomeAndNewDecision.useMutation();

  const onOptionAdded = useCallback(
    async ({ title }: { title: string }) => {
      try {
        setIsGenerating(true);
        setSelectedOptions([...selectedOptions, title]);

        let rightMostPositionX = 0;
        const groupedNodes = nodes.map((node) => {
          if (node.type === "option") {
            rightMostPositionX = Math.max(rightMostPositionX, node.position.x);
            return {
              ...node,
              position: {
                x: node.position.x,
                y: node.data.label === title ? -37 : -35,
              },
              data: {
                ...node.data,
                rotation: Math.random() * 2 - 1,
              },
              zIndex: node.data.label === title ? 20 : 0,
            };
          } else if (node.type === "customOption") {
            const optionNode: Node = {
              id: node.id,
              type: "option",
              data: {
                label: title,
                description: node.data.label,
                onDecisionChosen: node.data.onDecisionChosen,
                rotation: Math.random() * 2 - 1,
              },
              position: {
                x: node.position.x,
                y: node.data.label === title ? -37 : -35,
              },
              zIndex: node.data.label === title ? 20 : 0,
            };
            return optionNode;
          }
          return node;
        });
        setNodes(groupedNodes);

        const { context, microDecisions, options, newMessages } =
          await generateOutcomeAndNewDecision({
            messages: [
              ...messages,
              {
                role: "user",
                content: title,
              },
            ],
          });
        setMessages(newMessages);

        const maxRightPosition = Math.max(
          ...groupedNodes.map((node) => node.position.x),
        );
        const selectedOptionNode = groupedNodes.find(
          (node) => node.type === "option" && node.data.label === title,
        );

        const { newNodes, newEdges } = createNewNodesAndEdges({
          nodes: groupedNodes,
          rightMostPositionX: maxRightPosition,
          context,
          microDecisions,
          options,
          selectedOptionNode,
          isInitialDecision: false,
        });

        setNodes([...groupedNodes, ...newNodes]);
        setEdges([...edges, ...newEdges]);
      } catch (error) {
        console.error("Error in onOptionAdded:", error);
      } finally {
        setIsGenerating(false);
      }
    },
    [
      nodes,
      edges,
      setNodes,
      setEdges,
      generateOutcomeAndNewDecision,
      messages,
      setMessages,
      setSelectedOptions,
      selectedOptions,
    ],
  );

  return (
    <MotionNodeWrapper rotation={data.rotation}>
      <MotionPopover
        onSubmit={async (userInput) => {
          setIsGenerating(true);
          try {
            await onOptionAdded({ title: userInput });
          } catch (error) {
            console.error("Error submitting option:", error);
          } finally {
            setIsGenerating(false);
          }
        }}
        isGenerating={isGenerating}
        mode="option"
      />
      <Handle type="source" position={Position.Right} className="opacity-0" />
      <Handle type="target" position={Position.Left} className="opacity-0" />
    </MotionNodeWrapper>
  );
}

export default memo(CustomOptionNode);
