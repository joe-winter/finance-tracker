import { protectedProcedure, publicProcedure, router } from "../trpc";
import prisma from "@/lib/prisma";
import { TransactionType } from "@prisma/client";
import { z } from "zod";

export const transactionSchema = z.object({
  type: z.enum(Object.values(TransactionType)),
  amount: z.number().min(0),
  date: z.date(),
});

export const transactionRouter = router({
  getTransactions: protectedProcedure.query(async ({ ctx }) => {
    // return await prisma.transaction.findMany()
    return await prisma.transaction.findMany({
      where: { createdBy: ctx.auth.userId },
    });
  }),
  createTransaction: protectedProcedure
    .input(transactionSchema)
    .mutation(async ({ input, ctx }) => {
      return await prisma.transaction.create({
        data: { ...input, createdBy: ctx.auth.userId },
      });
    }),
});

export type TransactionsRouter = typeof transactionRouter;
