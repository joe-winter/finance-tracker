import { publicProcedure, router } from "../trpc";
import { categoryRouter } from "./categories";
import { postRouter } from "./posts";
import { transactionRouter } from "./transactions";

export const appRouter = router({
  healthcheck: publicProcedure.query(() => "yay!"),

  post: postRouter,
  transaction: transactionRouter,
  category: categoryRouter,
});

export type AppRouter = typeof appRouter;
