import z from "zod";
import prisma from "@/lib/prisma";
import { protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { startOfDay } from "date-fns";

export const transactionSchema = z.object({
  amount: z.number().min(0),
  date: z.preprocess((arg) => {
    if (typeof arg === "string") return new Date(arg);
    return arg;
  }, z.date()),
  description: z.string().min(1).max(500),
  categoryId: z.string(),
});

export type TransactionSchema = z.infer<typeof transactionSchema>;

export const transactionRouter = router({
  getTransactions: protectedProcedure.query(async ({ ctx }) => {
    return await prisma.transaction.findMany({
      select: {
        date: true,
        amount: true,
        description: true,
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
      const { date, amount, categoryId, description } = input;
      const normalizedDate = startOfDay(date);
      const category = await prisma.category.findUnique({
        select: { id: true, type: true },
        where: { id: input.categoryId },
      });

      if (!category?.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      const latestBalance = await prisma.dailyBalance.findFirst({
        select: {
          balance: true,
        },
        where: {
          userId,
          date: { lte: normalizedDate },
        },
        orderBy: {
          date: "desc",
        },
      });

      const balanceChange = category.type === "INCOME" ? amount : -amount;

      const initialBalance = latestBalance?.balance
        ? latestBalance.balance.add(balanceChange)
        : balanceChange;

      return await prisma.$transaction(async (tx) => {
        const balance = await tx.dailyBalance.upsert({
          where: {
            userId_date: {
              userId,
              date: normalizedDate,
            },
          },
          create: {
            userId,
            balance: initialBalance,
            date: normalizedDate,
          },
          update: {
            userId,
            balance: {
              ...(category.type === "INCOME"
                ? { increment: amount }
                : { decrement: amount }),
            },
            date: normalizedDate,
          },
          select: {
            id: true,
          },
        });

        await tx.dailyBalance.updateMany({
          data: {
            balance: {
              ...(category.type === "INCOME"
                ? { increment: amount }
                : { decrement: amount }),
            },
          },
          where: {
            userId,
            date: { gt: normalizedDate },
          },
        });

        return await tx.transaction.create({
          data: {
            amount,
            date: normalizedDate,
            description,
            userId,
            categoryId,
            dailyBalanceId: balance.id,
          },
        });
      });
    }),
});

export type TransactionsRouter = typeof transactionRouter;
