import { publicProcedure, router } from "../trpc";
import { categoryRouter } from "./categories";
import { dashboardRouter } from "./dashboard";
import { transactionRouter } from "./transactions";

export const appRouter = router({
	healthcheck: publicProcedure.query(() => "yay!"),
	transaction: transactionRouter,
	category: categoryRouter,
	dashboard: dashboardRouter,
});

export type AppRouter = typeof appRouter;
