import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { fetchLinkedInProfile } from "../lib/utils/proxycurl";
import { publicProcedure } from "../trpc";

export const onboardingRouter = {
  getLinkedinProfile: publicProcedure
    .input(
      z.object({
        username: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      const { username } = input;

      try {
        return fetchLinkedInProfile(`https://www.linkedin.com/in/${username}`);
      } catch (e) {
        console.error(e);
        throw new Error("Could not fetch profile");
      }
    }),
} satisfies TRPCRouterRecord;
