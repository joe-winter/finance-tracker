import z from "zod";
import prisma from "@/lib/prisma";
import { protectedProcedure, router } from "../trpc";

interface CategoryBalance {
  categoryId: string;
  categoryName: string;
  totalAmount: number;
}

export const dashboardRouter = router({
  getTransactionTotalsByCategory: protectedProcedure
    // .input(z.object({ startDate: z.coerce.date(), endDate: z.coerce.date() }))
    .query(async ({ ctx }): Promise<CategoryBalance[]> => {
      const result = await prisma.$queryRaw<CategoryBalance[]>`
        SELECT 
          c.id as "categoryId",
          c.name as "categoryName",
          COALESCE(SUM(t.amount), 0)::DECIMAL as "totalAmount"
        FROM "Category" c
        LEFT JOIN "Transaction" t ON c.id = t."categoryId" 
          AND t."userId" = ${ctx.auth.userId}
        GROUP BY c.id, c.name
        ORDER BY "totalAmount" DESC
      `;

      return result.map((row) => ({
        categoryId: String(row.categoryId),
        categoryName: String(row.categoryName),
        totalAmount: Number(row.totalAmount),
      }));
    }),
});

export type DashboardRouter = typeof dashboardRouter;
