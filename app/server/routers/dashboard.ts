import type { TransactionType } from "@prisma/client";
import z from "zod";
import prisma from "@/lib/prisma";
import { protectedProcedure, router } from "../trpc";

interface CategoryBalance {
	type: TransactionType;
	categoryId: string | null;
	name: string;
	sum: string;
}

export const dashboardRouter = router({
	getTransactionTotalsByCategory: protectedProcedure
		.input(
			z.object({
				startDate: z.coerce.date(),
				endDate: z.coerce.date(),
			}),
		)
		.query(async ({ ctx, input }): Promise<CategoryBalance[]> => {
			return await prisma.$queryRaw<CategoryBalance[]>`
        WITH CategoryTotals AS (
          SELECT 
            c.id as "categoryId",
            c.name,
            c.type,
            COALESCE(SUM(t.amount), 0) as total_amount,
            ROW_NUMBER() OVER (
              PARTITION BY c.type
              ORDER BY COALESCE(SUM(t.amount), 0) DESC
            ) as rank
          FROM "Category" c
          LEFT JOIN "Transaction" t ON c.id = t."categoryId"
          WHERE c."userId" = ${ctx.auth.userId}
            AND (t.id IS NULL OR (
              t."userId" = ${ctx.auth.userId}
              AND t.amount > 0
              AND t.date >= ${input.startDate}
              AND t.date <= ${input.endDate}
            ))
          GROUP BY c.id, c.name, c.type
        ),
        GroupedCategories AS (
          SELECT 
            type,
            CASE 
              WHEN rank <= 5 THEN "categoryId"::TEXT
              ELSE NULL 
            END as "categoryId",
            CASE 
              WHEN rank <= 5 THEN name
              ELSE 'Other' 
            END as name,
            total_amount
          FROM CategoryTotals
          WHERE total_amount > 0
        )
        SELECT 
          type,
          "categoryId",
          name,
          SUM(total_amount)::TEXT as sum
        FROM GroupedCategories
        GROUP BY type, "categoryId", name
        ORDER BY type, CASE WHEN name = 'Other' THEN 1 ELSE 0 END
      `;
		}),
});

export type DashboardRouter = typeof dashboardRouter;
