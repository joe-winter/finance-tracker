import { publicProcedure, router } from "../trpc";
import { postRouter } from "./posts";
import { transactionRouter } from "./transactions";

export const appRouter = router({
  healthcheck: publicProcedure.query(() => "yay!"),

  post: postRouter,
  transaction: transactionRouter,
});

export type AppRouter = typeof appRouter;
