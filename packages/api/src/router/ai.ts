import type { TRPCRouterRecord } from "@trpc/server";
import type { CoreAssistantMessage, CoreUserMessage } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { z } from "zod";

import {
  initialSimulationPromptV2,
  simulationParser,
} from "../lib/prompts/initialSimulationPrompt";
import { publicProcedure } from "../trpc";

const fireworks = createOpenAI({
  apiKey: process.env.FIREWORKS_API_KEY ?? "",
  baseURL: "https://api.fireworks.ai/inference/v1",
});

const llama3Model = fireworks(
  "accounts/fireworks/models/llama-v3p1-405b-instruct",
);

export const aiRouter = {
  generateDecisionNodes: publicProcedure
    .input(
      z.object({
        userBackground: z.string(),
        decision: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { userBackground, decision } = input;
      const prompt = initialSimulationPromptV2(userBackground, decision);
      const { text } = await generateText({
        // model: anthropic("claude-3-5-sonnet-20240620"),
        model: llama3Model,
        prompt,
        temperature: 1,
      });
      console.log({ text });
      const { context, microDecisions, options } = simulationParser(text);

      const initialMessages = [
        {
          role: "user",
          content: prompt,
        },
        {
          role: "assistant",
          content: text,
        },
      ];

      return {
        text,
        context,
        microDecisions,
        options,
        initialMessages,
      };
    }),
  generateOutcomeAndNewDecision: publicProcedure
    .input(
      z.object({
        messages: z.array(
          z.object({
            role: z.string(),
            content: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ input }) => {
      const { messages } = input;
      console.log("Input messages:", { messages });

      console.log("Generating text...");
      const { text } = await generateText({
        // model: anthropic("claude-3-5-sonnet-20240620"),
        model: llama3Model,
        // model: openai("gpt-4o"),
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })) as (CoreUserMessage | CoreAssistantMessage)[],
        temperature: 1,
      });
      console.log("Generated text:", text);

      console.log("Parsing outcome...");
      const { context, microDecisions, options } = simulationParser(text);
      console.log("Parsed outcome:", {
        context,
        microDecisions,
        options,
      });

      console.log("Returning result...");
      return {
        text,
        context,
        microDecisions,
        options,
        newMessages: [
          ...messages,
          {
            role: "assistant",
            content: text,
          },
        ],
      };
    }),
} satisfies TRPCRouterRecord;
