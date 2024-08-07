import type { Edge, Node } from "@xyflow/react";

import { randomId } from "~/lib/utils/randomId";

interface Option {
  title: string;
  description: string;
}

interface CreateNodesAndEdgesParams {
  nodes: Node[];
  rightMostPositionX: number;
  context: string;
  microDecisions: string;
  options: Option[];
  selectedOptionNode: Node | undefined;
  isInitialDecision: boolean;
}

export const createNewNodesAndEdges = ({
  nodes,
  rightMostPositionX,
  context,
  microDecisions,
  options,
  selectedOptionNode,
  isInitialDecision = false,
}: CreateNodesAndEdgesParams): { newNodes: Node[]; newEdges: Edge[] } => {
  const customOptionNodeId = `custom-option-node-${randomId()}`;
  const baseX = isInitialDecision
    ? rightMostPositionX
    : rightMostPositionX + 500;

  const newNodes: Node[] = [
    {
      id: `decision-node-${nodes.length}`,
      type: "context",
      data: { label: context },
      position: { x: baseX, y: -85 },
    },
    {
      id: `micro-decision-node-${nodes.length + 1}`,
      type: "microDecision",
      data: { label: microDecisions },
      position: { x: baseX + 700, y: -25 },
    },
    ...options.map(({ title, description }, index) => ({
      id: `option-node-${nodes.length + 2 + index}`,
      type: "option",
      data: { label: title, description },
      position: { x: baseX + 1250, y: -350 + index * 200 },
    })),
    {
      id: customOptionNodeId,
      type: "customOption",
      data: {},
      position: {
        x: baseX + 1250,
        y: -250 + options.length * 200,
      },
    },
  ];

  const newEdges: Edge[] = [
    // Only add this edge if it's not the initial decision
    ...(!isInitialDecision
      ? [
          {
            id: `eoption-node-outcome-option-${nodes.length + 1}`,
            source:
              selectedOptionNode?.id ?? `decision-node-${nodes.length + 1}`,
            target: `decision-node-${nodes.length}`,
            animated: true,
          },
        ]
      : []),
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
    {
      id: "e3-custom-option",
      source: `micro-decision-node-${nodes.length + 1}`,
      target: customOptionNodeId,
      animated: true,
    },
  ];

  return { newNodes, newEdges };
};
