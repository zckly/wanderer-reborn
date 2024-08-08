import { aiRouter } from "./router/ai";
import { onboardingRouter } from "./router/onboarding";
import { postRouter } from "./router/post";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  ai: aiRouter,
  onboarding: onboardingRouter,
  post: postRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
