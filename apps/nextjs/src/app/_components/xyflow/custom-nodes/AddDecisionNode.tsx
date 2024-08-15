"use client";

import type { Edge, Node } from "@xyflow/react";
import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { Handle, Position } from "@xyflow/react";
import { useChat } from "ai/react";

import type { CreateNodesAndEdgesParams } from "~/utils/nodeUtils";
import { useNodeStore } from "~/hooks/useNodeStore";
import {
  initialSimulationPromptV2,
  simulationParser,
} from "~/lib/prompts/initialDecisionPrompt";
import { api } from "~/trpc/react";
import { createOrUpdateNodesAndEdges } from "~/utils/nodeUtils";
import MotionPopover from "../../../../components/MotionPopover";

function AddDecisionNode() {
  const { mutateAsync: generateCanvasTitle } =
    api.ai.generateCanvasTitle.useMutation();
  const {
    nodes,
    setEdges,
    setNodes,
    setMessages,
    workSituation,
    livingSituation,
    friendsFamilySituation,
    interests,
    setCanvasTitle,
  } = useNodeStore();
  const systemPrompt = initialSimulationPromptV2();
  const { messages: useChatMessages, append, isLoading } = useChat({});

  const generateNodes = useCallback(
    async (decision: string) => {
      console.log("generateNodes called with decision:", decision);
      const userBackground = `<work_background>${workSituation}</work_background>
      <living_background>${livingSituation}</living_background>
      <friends_family_background>${friendsFamilySituation}</friends_family_background>
      <interests>${interests}</interests>`;

      const userPrompt = `Here's the user's background information:

${userBackground}

And the initial decision they're pondering:

${decision}`;

      const prompt = `${systemPrompt}

${userPrompt}`;

      const content = await append({
        role: "user",
        content: prompt,
      });

      console.log("Append completed, content:", content);

      const { text } = await generateCanvasTitle({
        context: content ?? "",
        decision,
      });
      setCanvasTitle(text);
      const initialMessages = [
        {
          role: "user",
          content: prompt,
        },
        {
          role: "assistant",
          content: content ?? "",
        },
      ];
      setMessages(initialMessages);
      console.log("generateNodes completed");
    },
    [
      append,
      systemPrompt,
      generateCanvasTitle,
      interests,
      workSituation,
      livingSituation,
      friendsFamilySituation,
      setCanvasTitle,
      setMessages,
    ],
  );

  // Memoize the calculation of rightMostPositionX
  const calculateRightMostPositionX = useMemo(() => {
    return (nodes: Node[]): number => {
      return Math.max(...nodes.map((node) => node.position.x));
    };
  }, []);

  // Memoize the creation of new nodes and edges
  const createMemoizedNodesAndEdges = useMemo(() => {
    return (params: CreateNodesAndEdgesParams) => {
      return createOrUpdateNodesAndEdges(params);
    };
  }, []);

  // Use callback for updating nodes and edges
  const updateNodesAndEdges = useCallback(
    (newNodes: Node[], newEdges: Edge[]) => {
      console.log("Updating nodes and edges");
      console.log("New nodes:", newNodes);
      console.log("New edges:", newEdges);

      setNodes(newNodes);
      console.log("Updated nodes set");

      setEdges(newEdges);
    },
    [setNodes, setEdges],
  );

  const messagesRef = useRef(useChatMessages);

  useEffect(() => {
    messagesRef.current = useChatMessages;
  }, [useChatMessages]);

  const processMessages = useCallback(() => {
    const messages = messagesRef.current;
    const lastMessage = messages[messages.length - 1];

    console.log("Processing messages:", messages);
    console.log("Is loading:", isLoading);
    console.log("Messages length:", messages.length);
    console.log("Last message role:", lastMessage?.role);

    if (isLoading) {
      console.log("Not processing: Still loading");
    } else if (messages.length <= 1) {
      console.log("Not processing: Not enough messages");
    } else if (lastMessage?.role !== "assistant") {
      console.log("Not processing: Last message is not from assistant");
    } else {
      console.log("Processing new assistant message");

      const parsedContent = simulationParser(lastMessage.content);
      console.log("Parsed content:", parsedContent);

      const { context, options, microDecisions } = parsedContent;

      // Only update if we have new content
      if (context && options.length > 0 && microDecisions) {
        const rightMostPositionX = calculateRightMostPositionX(nodes);
        console.log("Right most position X:", rightMostPositionX);

        const { updatedNodes, newEdges } = createMemoizedNodesAndEdges({
          existingNodes: nodes,
          rightMostPositionX,
          context,
          microDecisions,
          options,
          selectedOptionNode: undefined,
          isInitialDecision: nodes.length === 0,
        });

        console.log("Updated nodes:", updatedNodes);
        console.log("New edges:", newEdges);

        // Only update if there are changes
        if (updatedNodes.length !== nodes.length || newEdges.length > 0) {
          updateNodesAndEdges(updatedNodes, newEdges);
          console.log("Nodes and edges updated");
        } else {
          console.log("No changes in nodes or edges");
        }
      } else {
        console.log("Not enough content to update nodes and edges");
      }
    }
  }, [
    nodes,
    calculateRightMostPositionX,
    createMemoizedNodesAndEdges,
    updateNodesAndEdges,
    isLoading,
  ]);

  useEffect(() => {
    console.log("useEffect triggered, messages:", useChatMessages);
    if (useChatMessages.length > 0 && !isLoading) {
      processMessages();
    }
  }, [processMessages, useChatMessages, isLoading]);

  return (
    <div>
      <MotionPopover
        onSubmit={(decision) => {
          void generateNodes(decision);
        }}
        isGenerating={isLoading}
      />
      <Handle type="source" position={Position.Right} className="opacity-0" />
      <Handle type="target" position={Position.Left} className="opacity-0" />
    </div>
  );
}

export default memo(AddDecisionNode);
