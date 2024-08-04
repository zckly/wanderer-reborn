import { aiRouter } from "./router/ai";
import { authRouter } from "./router/auth";
import { postRouter } from "./router/post";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  ai: aiRouter,
  auth: authRouter,
  post: postRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
