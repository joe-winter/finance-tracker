import { getTransactionTotalsByCategory } from "@prisma/client/sql";
import z from "zod";
import prisma from "@/lib/prisma";
import { protectedProcedure, router } from "../trpc";

export const dashboardRouter = router({
	getTransactionTotalsByCategory: protectedProcedure
		.input(
			z.object({
				startDate: z.coerce.date(),
				endDate: z.coerce.date(),
			}),
		)
		.query(async ({ ctx, input }) => {
			return await prisma.$queryRawTyped(
				getTransactionTotalsByCategory(
					ctx.auth.userId,
					input.startDate,
					input.endDate,
				),
			);
		}),
});

export type DashboardRouter = typeof dashboardRouter;
