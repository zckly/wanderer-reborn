import type { TRPCRouterRecord } from "@trpc/server";
import type { CoreAssistantMessage, CoreUserMessage } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { z } from "zod";

import { generateCanvasTitlePrompt } from "../lib/prompts/generateCanvasTitle";
import {
  initialSimulationPromptV2,
  simulationParser,
} from "../lib/prompts/initialSimulationPrompt";
import { publicProcedure } from "../trpc";

// const fireworks = createOpenAI({
//   apiKey: process.env.FIREWORKS_API_KEY ?? "",
//   baseURL: "https://api.fireworks.ai/inference/v1",
// });

// const llama3Model = fireworks(
//   "accounts/fireworks/models/llama-v3p1-405b-instruct",
// );

export const aiRouter = {
  generateDecisionNodes: publicProcedure
    .input(
      z.object({
        workSituation: z.string(),
        livingSituation: z.string(),
        friendsFamilySituation: z.string(),
        interests: z.string(),
        decision: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const {
        workSituation,
        livingSituation,
        friendsFamilySituation,
        interests,
        decision,
      } = input;

      const userBackground = `<work_background>${workSituation}</work_background>
      <living_background>${livingSituation}</living_background>
      <friends_family_background>${friendsFamilySituation}</friends_family_background>
      <interests>${interests}</interests>`;

      const prompt = initialSimulationPromptV2(userBackground, decision);
      const { text } = await generateText({
        model: anthropic("claude-3-5-sonnet-20240620"),
        // model: llama3Model,
        // model: openai("gpt-4o-mini"),
        prompt,
        temperature: 1,
      });
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
      const { text } = await generateText({
        model: anthropic("claude-3-5-sonnet-20240620"),
        // model: openai("gpt-4o-mini"),
        // model: llama3Model,
        // model: openai("gpt-4o"),
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })) as (CoreUserMessage | CoreAssistantMessage)[],
        temperature: 1,
      });
      const { context, microDecisions, options } = simulationParser(text);
      console.log("Parsed outcome:", {
        context,
        microDecisions,
        options,
      });

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
  generateCanvasTitle: publicProcedure
    .input(
      z.object({
        context: z.string(),
        decision: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { context, decision } = input;

      const prompt = generateCanvasTitlePrompt({ context, decision });
      const { text } = await generateText({
        model: openai("gpt-4o-mini"),
        prompt,
        temperature: 1,
      });

      return {
        text,
      };
    }),
} satisfies TRPCRouterRecord;
