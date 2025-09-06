import { getTransactionsWithDailyBalance } from "@prisma/client/sql";
import { TRPCError } from "@trpc/server";
import z from "zod";
import prisma from "@/lib/prisma";
import { protectedProcedure, router } from "../trpc";
export const transactionSchema = z.object({
  amount: z
    .string()
    .regex(/^(0|[1-9]\d*)\.\d{1,2}$/, {
      message: "Must be a number with exactly 2 decimal places",
    })
    .refine((val) => parseFloat(val) > 0, {
      message: "Money amount must be greater than 0",
    }),
  date: z.date(),
  description: z.string().min(1).max(500),
  categoryId: z.string(),
});

// function normalizeDate(date: Date): Date {
//   console.log("=== normalizeDate Debug ===");
//   console.log("Input date (raw):", date);
//   console.log("Input date ISO string:", date.toISOString());

//   // Server timezone info
//   console.log(
//     "Server timezone:",
//     Intl.DateTimeFormat().resolvedOptions().timeZone
//   );
//   console.log("Server timezone offset (minutes):", date.getTimezoneOffset());

//   // Extracted components (in server timezone)
//   const year = date.getFullYear();
//   const month = date.getMonth();
//   const day = date.getDate();
//   console.log("Extracted components (server TZ):", { year, month, day });
//   console.log(
//     "Month name:",
//     new Date(year, month, 1).toLocaleString("default", { month: "long" })
//   );

//   // Create UTC date with those components
//   const utcDate = new Date(Date.UTC(year, month, day));
//   console.log("Created UTC date:", utcDate);
//   console.log("Created UTC ISO string:", utcDate.toISOString());

//   // Show what this looks like in different timezones
//   console.log("UTC date as local string:", utcDate.toLocaleDateString());
//   console.log("UTC date components:", {
//     utcYear: utcDate.getUTCFullYear(),
//     utcMonth: utcDate.getUTCMonth(),
//     utcDay: utcDate.getUTCDate(),
//   });

//   console.log("=========================");

//   return utcDate;
// }
export type TransactionSchema = z.infer<typeof transactionSchema>;

export const transactionRouter = router({
  getTransactions: protectedProcedure.query(async ({ ctx }) => {
    return await prisma.$queryRawTyped(
      getTransactionsWithDailyBalance(ctx.auth.userId)
    );
  }),
  getTransaction: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      if (!input.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No transaction ID given",
        });
      }
      const transaction = await prisma.transaction.findUnique({
        select: {
          id: true,
          amount: true,
          description: true,
          date: true,
          category: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
        },
        where: { userId: ctx.auth.userId, id: input.id },
      });

      if (!transaction) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Transaction not found",
        });
      }

      return transaction;
    }),
  getTransactionByCategoryCount: protectedProcedure
    .input(
      z.object({
        categoryId: z.nanoid().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      if (!input.categoryId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No Category ID given",
        });
      }
      return await prisma.transaction.count({
        where: {
          userId: ctx.auth.userId,
          categoryId: input.categoryId,
        },
      });
    }),
  createTransaction: protectedProcedure
    .input(transactionSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.auth.userId;
      const { date, amount, categoryId, description } = input;
      // const normalizedDate = normalizeDate(date);

      return await prisma.transaction.create({
        data: {
          amount,
          date,
          description,
          userId,
          categoryId,
        },
      });
    }),
  deleteTransaction: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await prisma.transaction.delete({
        where: {
          id: input.id,
        },
      });
    }),
  editTransaction: protectedProcedure
    .input(transactionSchema.extend({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { date, amount, categoryId, description, id } = input;

      return await prisma.transaction.update({
        data: { date, amount, categoryId, description },
        where: { id },
      });
    }),
});

export type TransactionsRouter = typeof transactionRouter;
