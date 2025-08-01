import { publicProcedure, router } from "../trpc";
import { categoryRouter } from "./categories";
import { transactionRouter } from "./transactions";

export const appRouter = router({
  healthcheck: publicProcedure.query(() => "yay!"),
  transaction: transactionRouter,
  category: categoryRouter,
});

export type AppRouter = typeof appRouter;
