import z from "zod";
import prisma from "@/lib/prisma";
import { protectedProcedure, router } from "../trpc";

export const categorySchema = z.object({
  name: z.string().min(1).max(30),
});

export type categorySchema = z.infer<typeof categorySchema>;

export const categoryRouter = router({
  getCategories: protectedProcedure.query(async ({ ctx }) => {
    return await prisma.category.findMany({
      where: { userId: ctx.auth.userId },
    });
  }),
  createCategory: protectedProcedure
    .input(categorySchema)
    .mutation(async ({ input, ctx }) => {
      return await prisma.category.create({
        data: { name: input.name, userId: ctx.auth.userId },
      });
    }),
});

export type CategoryRouter = typeof categoryRouter;
