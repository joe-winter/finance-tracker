import z from "zod";
import prisma from "@/lib/prisma";
import { protectedProcedure, router } from "../trpc";
import type { TransactionType } from "@prisma/client";

interface CategoryBalance {
  type: TransactionType;
  categoryId: string | null;
  name: string;
  sum: string;
}

export const dashboardRouter = router({
  getTransactionTotalsByCategory: protectedProcedure.query(
    async ({ ctx }): Promise<CategoryBalance[]> => {
      return await prisma.$queryRaw<CategoryBalance[]>`
        SELECT * FROM (
          SELECT 
            r."type",
            CASE 
              WHEN r.rank <= 5 THEN r."categoryId"
              ELSE NULL 
            END as "categoryId",
            CASE 
              WHEN r.rank <= 5 THEN r."name"
              ELSE 'Other' 
            END as "name",
            SUM(r."sum") as "sum"
          FROM (
            SELECT 
              c.id as "categoryId",
              c.name as "name",
              c.type as "type",
              COALESCE(SUM(t.amount), 0)::DECIMAL as "sum",
              ROW_NUMBER() OVER (
                PARTITION BY c.type
                ORDER BY COALESCE(SUM(t.amount), 0) DESC
              ) as rank
            FROM "Category" c
            LEFT JOIN "Transaction" t 
              ON c.id = t."categoryId" 
              AND t."userId" = ${ctx.auth.userId}
              AND t."amount" > 0
            GROUP BY c.id, c.name, c.type
          ) r
          GROUP BY 
            r."type",
            CASE 
              WHEN r.rank <= 5 THEN r."categoryId"
              ELSE NULL 
            END,
            CASE 
              WHEN r.rank <= 5 THEN r."name"
              ELSE 'Other' 
            END
        ) final
        WHERE final."sum" > 0
        ORDER BY final."type", final."sum" DESC
      `;
    }
  ),
});

export type DashboardRouter = typeof dashboardRouter;
