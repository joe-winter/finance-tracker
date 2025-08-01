import z from "zod";
import prisma from "@/lib/prisma";
import { protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

export const transactionSchema = z.object({
  amount: z.number().min(0),
  date: z.preprocess((arg) => {
    if (typeof arg === "string") return new Date(arg);
    return arg;
  }, z.date()),
  categoryId: z.string(),
});

export type TransactionSchema = z.infer<typeof transactionSchema>;

export const transactionRouter = router({
  getTransactions: protectedProcedure.query(async ({ ctx }) => {
    return await prisma.transaction.findMany({
      select: {
        date: true,
        amount: true,
        category: {
          select: {
            name: true,
            type: true,
          },
        },
        dailyBalance: {
          select: {
            balance: true,
          },
        },
      },
      where: { userId: ctx.auth.userId },
      orderBy: {
        date: "desc",
      },
    });
  }),
  createTransaction: protectedProcedure
    .input(transactionSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.auth.userId;
      const { date, amount, categoryId } = input;
      const category = await prisma.category.findFirst({
        select: { id: true, type: true },
        where: { id: input.categoryId },
      });

      if (!category?.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      return await prisma.$transaction(async (tx) => {
        const balance = await tx.dailyBalance.upsert({
          where: {
            userId_date: {
              userId,
              date,
            },
          },
          create: {
            userId,
            balance: amount,
            date,
          },
          update: {
            userId,
            balance: {
              ...(category.type === "INCOME"
                ? { increment: amount }
                : { decrement: amount }),
            },
            date,
          },
          select: {
            id: true,
          },
        });

        return await tx.transaction.create({
          data: {
            amount,
            date,
            userId,
            categoryId,
            dailyBalanceId: balance.id,
          },
        });
      });
    }),
});

export type TransactionsRouter = typeof transactionRouter;
