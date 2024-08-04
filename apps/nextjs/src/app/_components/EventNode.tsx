import { memo, useCallback, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { motion } from "framer-motion";
import { useShallow } from "zustand/react/shallow";

import { cn } from "@acme/ui";

import type { AppState } from "~/hooks/store-types";
import useStore from "~/hooks/useStore";
import { api } from "~/trpc/react";
import MotionDialog from "./primitives/MotionDialog";

const selector = (state: AppState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onConnect: state.onConnect,
  setNodes: state.setNodes,
  setEdges: state.setEdges,
  background: state.background,
  messages: state.messages,
  setMessages: state.setMessages,
  selectedOptions: state.selectedOptions,
  setSelectedOptions: state.setSelectedOptions,
});

function EventNode({
  data,
}: {
  data: {
    label: string;
    description: string;
    rotation?: number;
  };
}) {
  const {
    nodes,
    edges,
    setEdges,
    setNodes,
    messages,
    setMessages,
    setSelectedOptions,
    selectedOptions,
  } = useStore(useShallow(selector));
  const [isGenerating, setIsGenerating] = useState(false);
  const [outcomeGenerated, setOutcomeGenerated] = useState(false);

  const { mutateAsync: generateOutcomeAndNewDecision } =
    api.ai.generateOutcomeAndNewDecision.useMutation();
  const onDecisionChosen = useCallback(
    async ({ title }: { title: string }) => {
      console.log("onDecisionChosen called with title:", title);
      setSelectedOptions([...selectedOptions, title]);
      let rightMostPositionX = 0;
      // after selecting an option, group the nodes together and have them stack on top of each other
      // the selected option node should be the topmost node
      const groupedNodes = nodes.map((node) => {
        if (node.type === "event") {
          console.log("Adjusting position for node:", node.id);
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
        }
        return node;
      });
      console.log("Grouped nodes:", groupedNodes);
      setNodes(groupedNodes);
      console.log("Appending content to chat...");

      setIsGenerating(true);
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
      console.log({ newMessages });
      setMessages(newMessages);
      setIsGenerating(false);
      // create options
      console.log("Created options:", options);

      // create nodes
      const newNodes = [
        {
          id: `decision-node-${nodes.length}`,
          type: "context",
          data: {
            label: context,
            // Add consequences
          },
          position: { x: rightMostPositionX + 500, y: -160 },
        },
        {
          id: `micro-decision-node-${nodes.length + 1}`,
          type: "microDecision",
          data: {
            label: microDecisions,
          },
          position: { x: rightMostPositionX + 1200, y: -25 },
        },
        ...options.map(({ title, description }, index) => ({
          id: `option-node-${nodes.length + 2 + index}`,
          type: "event",
          data: {
            label: title,
            description: description,
            onDecisionChosen: onDecisionChosen,
          },
          position: { x: rightMostPositionX + 1750, y: -250 + index * 150 },
        })),
      ];
      console.log("Created new nodes:", newNodes);
      setNodes([...groupedNodes, ...newNodes]);
      const selectedOptionNode = nodes.find(
        (node) => node.type === "event" && node.data.label === title,
      );

      const newEdges = [
        // If selected option node is not null, add an edge from the outcome node to the selected option node
        {
          id: `eoption-node-outcome-option-${nodes.length + 1}`,
          source: selectedOptionNode?.id ?? `decision-node-${nodes.length + 1}`,
          target: `decision-node-${nodes.length}`,
          animated: true,
        },
        {
          id: `edecision-micro-option-${nodes.length + 2}`,
          source: `decision-node-${nodes.length}`,
          target: `micro-decision-node-${nodes.length + 1}`,
          animated: true,
        },
        ...options.map((_, index) => ({
          id: `eoption-node-${nodes.length + 3 + index}`,
          source: `micro-decision-node-${nodes.length + 1}`,
          target: `option-node-${nodes.length + 2 + index}`,
          animated: true,
        })),
      ];
      console.log("Created new edges:", newEdges);
      setEdges([...edges, ...newEdges]);
      console.log("onDecisionChosen completed");
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        transform: `rotate(${data.rotation ?? 0}deg)`,
      }}
      className={cn("bg-white")}
    >
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
    </motion.div>
  );
}

export default memo(EventNode);
