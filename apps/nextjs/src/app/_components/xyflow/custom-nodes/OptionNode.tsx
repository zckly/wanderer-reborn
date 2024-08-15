import { memo, useCallback, useState } from "react";
import { Handle, Position } from "@xyflow/react";

import { MotionNodeWrapper } from "~/components/MotionNodeWrapper";
import { useNodeStore } from "~/hooks/useNodeStore";
import { api } from "~/trpc/react";
import { createOrUpdateNodesAndEdges } from "~/utils/nodeUtils";
import MotionDialog from "../../../../components/MotionDialog";

interface OptionNodeProps {
  data: {
    label: string;
    description: string;
    rotation?: number;
  };
}

function OptionNode({ data }: OptionNodeProps) {
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
  const [outcomeGenerated, setOutcomeGenerated] = useState(false);

  const { mutateAsync: generateOutcomeAndNewDecision } =
    api.ai.generateOutcomeAndNewDecision.useMutation();

  const onDecisionChosen = useCallback(
    async ({ title }: { title: string }) => {
      setSelectedOptions([...selectedOptions, title]);

      let rightMostPositionX = 0;
      const groupedNodes = nodes.map((node) => {
        if (node.type === "option" || node.type === "customOption") {
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
            zIndex:
              node.type === "customOption"
                ? 0
                : node.data.label === title
                  ? 20
                  : 0,
          };
        }
        return node;
      });
      setNodes(groupedNodes);

      setIsGenerating(true);
      const { context, microDecisions, options, newMessages } =
        await generateOutcomeAndNewDecision({
          messages: [...messages, { role: "user", content: title }],
        });

      setMessages(newMessages);
      setIsGenerating(false);

      const selectedOptionNode = groupedNodes.find(
        (node) => node.type === "option" && node.data.label === title,
      );

      const { updatedNodes, newEdges } = createOrUpdateNodesAndEdges({
        existingNodes: groupedNodes,
        rightMostPositionX,
        context,
        microDecisions,
        options,
        selectedOptionNode,
        isInitialDecision: false,
      });

      setNodes([...updatedNodes]);
      setEdges([...edges, ...newEdges]);
      setOutcomeGenerated(true);
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
      <MotionDialog
        title={data.label}
        subtitle={data.description}
        onDecisionChosen={({ title }) => {
          void onDecisionChosen({ title });
        }}
        loading={isGenerating}
        outcomeGenerated={outcomeGenerated}
      />
      <Handle type="target" position={Position.Left} className="opacity-0" />
      <Handle type="source" position={Position.Right} className="opacity-0" />
    </MotionNodeWrapper>
  );
}

export default memo(OptionNode);
