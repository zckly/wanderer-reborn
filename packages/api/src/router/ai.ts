import type { TRPCRouterRecord } from "@trpc/server";
import { openai } from "@ai-sdk/openai";
// const fireworks = createOpenAI({
//   apiKey: process.env.FIREWORKS_API_KEY ?? "",
//   baseURL: "https://api.fireworks.ai/inference/v1",
// });

// const llama3Model = fireworks(
//   "accounts/fireworks/models/llama-v3p1-405b-instruct",
// );
import Anthropic from "@anthropic-ai/sdk";
import { generateText } from "ai";
import { z } from "zod";

import { generateCanvasTitlePrompt } from "../lib/prompts/generateCanvasTitle";
import {
  initialSimulationPromptV2,
  simulationParser,
} from "../lib/prompts/initialSimulationPrompt";
import { publicProcedure } from "../trpc";

const anthropicClient = new Anthropic();

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

      const systemPrompt = initialSimulationPromptV2();
      // const { text } = await generateText({
      //   model: anthropic("claude-3-5-sonnet-20240620"),
      //   // model: llama3Model,
      //   // model: openai("gpt-4o-mini"),
      //   prompt,
      //   temperature: 1,
      // });

      const userPrompt = `Here's the user's background information:

${userBackground}

And the initial decision they're pondering:

${decision}`;

      const message = await anthropicClient.beta.promptCaching.messages.create({
        max_tokens: 1400,
        system: [
          {
            type: "text",
            text: systemPrompt,
            cache_control: { type: "ephemeral" },
          },
        ],
        temperature: 1,
        messages: [
          {
            role: "user",
            content: userPrompt,
          },
        ],
        model: "claude-3-5-sonnet-20240620",
      });

      const text =
        message.content[0]?.type === "text" ? message.content[0].text : "";

      const { context, microDecisions, options } = simulationParser(text);

      const initialMessages = [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
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
      const systemMessages = messages
        .filter((m) => m.role === "system")
        .map((m) => ({
          cache_control: { type: "ephemeral" } as const,
          type: "text" as const,
          text: m.content,
        }));
      const message = await anthropicClient.beta.promptCaching.messages.create({
        max_tokens: 4096,
        temperature: 1,
        system: systemMessages,
        messages: messages
          .filter((m) => m.role !== "system")
          .map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
        model: "claude-3-5-sonnet-20240620",
      });

      const text =
        message.content[0]?.type === "text" ? message.content[0].text : "";

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
  generateSummary: publicProcedure
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
    }),
} satisfies TRPCRouterRecord;
