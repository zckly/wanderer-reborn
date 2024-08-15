import type { Edge, Node } from "@xyflow/react";

export interface Option {
  title: string;
  description: string;
}

export interface CreateNodesAndEdgesParams {
  existingNodes: Node[];
  rightMostPositionX: number;
  context: string;
  microDecisions: string;
  options: Option[];
  selectedOptionNode: Node | undefined;
  isInitialDecision: boolean;
}

export const createOrUpdateNodesAndEdges = ({
  existingNodes,
  rightMostPositionX,
  context,
  microDecisions,
  options,
  selectedOptionNode,
  isInitialDecision = false,
}: CreateNodesAndEdgesParams): { updatedNodes: Node[]; newEdges: Edge[] } => {
  console.log("Creating/updating nodes and edges with params:", {
    existingNodes,
    rightMostPositionX,
    context,
    microDecisions,
    options,
    selectedOptionNode,
    isInitialDecision,
  });

  const baseX = isInitialDecision
    ? rightMostPositionX
    : rightMostPositionX + 300; // Reduced from 500 to 300
  let updatedNodes: Node[] = [...existingNodes];
  const newEdges: Edge[] = [];

  const getOrCreateNode = (
    type: string,
    data: Record<string, unknown>,
    position: { x: number; y: number },
    index?: number,
  ): Node => {
    const nodeId =
      index !== undefined ? `${type}-node-${index}` : `${type}-node`;
    const existingNode = updatedNodes.find((node) => node.id === nodeId);
    if (existingNode) {
      existingNode.data = { ...existingNode.data, ...data };
      return existingNode;
    } else {
      const newNode: Node = {
        id: nodeId,
        type,
        data,
        position,
      };
      updatedNodes.push(newNode);
      return newNode;
    }
  };

  const addEdge = (source: string, target: string) => {
    const edgeExists = newEdges.some(
      (edge) => edge.source === source && edge.target === target,
    );
    if (!edgeExists) {
      newEdges.push({
        id: `e${source}-${target}`,
        source,
        target,
        animated: true,
      });
    }
  };

  if (context) {
    const contextNode = getOrCreateNode(
      "context",
      { label: context },
      { x: baseX, y: -85 },
    );

    if (microDecisions) {
      const microDecisionNode = getOrCreateNode(
        "microDecision",
        { label: microDecisions },
        { x: baseX + 300, y: -25 }, // Reduced from 700 to 300
      );
      addEdge(contextNode.id, microDecisionNode.id);
    }
  }

  // Remove existing option nodes
  updatedNodes = updatedNodes.filter(
    (node) => !node.id.startsWith("option-node-"),
  );

  // Create or update option nodes
  options.forEach(({ title, description }, index) => {
    if (title && description) {
      const optionNode = getOrCreateNode(
        "option",
        { label: title, description },
        { x: baseX + 600, y: -200 + index * 150 }, // Reduced from 1250 to 600, and adjusted Y spacing
        index,
      );
      if (microDecisions) {
        const microDecisionNode = updatedNodes.find(
          (node) => node.type === "microDecision",
        );
        if (microDecisionNode) {
          addEdge(microDecisionNode.id, optionNode.id);
        }
      }
    }
  });

  // Only add or update custom option node if we have context, microDecisions, and at least one regular option
  if (context && microDecisions && options.length > 0) {
    const customOptionNode = getOrCreateNode(
      "customOption",
      {},
      { x: baseX + 600, y: -200 + options.length * 150 }, // Positioned after the last regular option
    );
    const microDecisionNode = updatedNodes.find(
      (node) => node.type === "microDecision",
    );
    if (microDecisionNode) {
      addEdge(microDecisionNode.id, customOptionNode.id);
    }
  }

  if (!isInitialDecision && selectedOptionNode && updatedNodes[0]) {
    addEdge(selectedOptionNode.id, updatedNodes[0].id);
  }

  console.log("Returning updated nodes and edges:", { updatedNodes, newEdges });
  return { updatedNodes, newEdges };
};
