import { aiRouter } from "./router/ai";
import { postRouter } from "./router/post";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  ai: aiRouter,
  post: postRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
