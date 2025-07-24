import { TransactionType } from "@prisma/client";
import z from "zod";
import prisma from "@/lib/prisma";
import { protectedProcedure, router } from "../trpc";

export const transactionSchema = z.object({
  type: z.enum(Object.values(TransactionType)),
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
        type: true,
        category: {
          select: {
            name: true,
          },
        },
        amount: true,
      },
      where: { userId: ctx.auth.userId },
    });
  }),
  createTransaction: protectedProcedure
    .input(transactionSchema)
    .mutation(async ({ input, ctx }) => {
      return await prisma.transaction.create({
        data: { ...input, userId: ctx.auth.userId },
      });
    }),
});

export type TransactionsRouter = typeof transactionRouter;
