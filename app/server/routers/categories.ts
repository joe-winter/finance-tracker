import z from "zod";
import prisma from "@/lib/prisma";
import { protectedProcedure, router } from "../trpc";
import { TransactionType } from "@prisma/client";

export const categorySchema = z.object({
  name: z.string().min(1).max(30),
  type: z.enum(Object.values(TransactionType)),
});

export type categorySchema = z.infer<typeof categorySchema>;

export const categoryRouter = router({
  getCategoriesByType: protectedProcedure.query(async ({ ctx }) => {
    const categories = await prisma.category.findMany({
      where: { userId: ctx.auth.userId },
    });

    const categoriesByTransaction = Object.groupBy(
      categories,
      ({ type }) => type
    );

    return categoriesByTransaction;
  }),
  createCategory: protectedProcedure
    .input(categorySchema)
    .mutation(async ({ input, ctx }) => {
      return await prisma.category.create({
        data: { ...input, userId: ctx.auth.userId },
      });
    }),

  deleteCategory: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await prisma.category.delete({
        where: { id: input.id, userId: ctx.auth.userId },
      });
    }),
});

export type CategoryRouter = typeof categoryRouter;
